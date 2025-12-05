#include "ledger.hpp"

#include <fmt/format.h>

#include <stdexcept>
#include <utility>

namespace qubic::contracts {
namespace {
constexpr std::uint64_t XP_DAILY_CAP = 500;
constexpr std::uint64_t SECONDS_IN_DAY = 86400;
}

void QuestLedger::set_badge_metadata(const std::string &badge_id,
                                     std::string metadata_cid,
                                     bool repeatable) {
    badge_registry_[badge_id] = BadgeMetadata{
        .metadata_cid = std::move(metadata_cid),
        .repeatable = repeatable,
    };
}

std::string QuestLedger::progress_key(const std::string &quest_id,
                                      const std::string &wallet) const {
    return fmt::format("{}:{}", quest_id, wallet);
}

std::string QuestLedger::dedupe_key(const std::string &quest_id,
                                    const std::string &wallet,
                                    std::uint64_t action_hash) const {
    return fmt::format("{}:{}:{}", quest_id, wallet, action_hash);
}

std::uint64_t QuestLedger::day_bucket(std::uint64_t timestamp) const {
    return timestamp / SECONDS_IN_DAY;
}

QuestProgress QuestLedger::record_progress(const std::string &quest_id,
                                            const std::string &wallet,
                                            std::uint32_t status,
                                            std::uint64_t action_hash,
                                            std::uint64_t timestamp) {
    if (status > 2U) {
        throw std::invalid_argument("invalid quest status");
    }

    const auto action_key = dedupe_key(quest_id, wallet, action_hash);
    if (processed_actions_.contains(action_key)) {
        throw std::runtime_error("action already processed");
    }

    const auto key = progress_key(quest_id, wallet);
    if (auto it = latest_progress_.find(key); it != latest_progress_.end()) {
        if (status < it->second.status) {
            throw std::runtime_error("status regression detected");
        }
    }

    auto entry = QuestProgress{quest_id, wallet, status, action_hash, timestamp};
    latest_progress_[key] = entry;
    processed_actions_.insert(action_key);
    progress_.push_back(entry);
    return entry;
}

RewardEvent QuestLedger::allocate_xp(const std::string &quest_id,
                                     const std::string &wallet,
                                     std::uint64_t amount,
                                     std::uint64_t timestamp) {
    auto &state = reward_ledger_[wallet];
    auto day = day_bucket(timestamp);
    if (state.day != day) {
        state.day = day;
        state.xp_today = 0;
    }

    const auto remaining = state.xp_today >= XP_DAILY_CAP ? 0 : XP_DAILY_CAP - state.xp_today;
    const auto applied = std::min<std::uint64_t>(amount, remaining);
    state.xp_today += applied;
    state.total_xp += applied;

    auto ev = RewardEvent{
        .quest_id = quest_id,
        .wallet = wallet,
        .xp_awarded = applied,
        .total_xp = state.total_xp,
        .multiplier = state.multiplier,
        .badge_minted = false,
    };
    rewards_.push_back(ev);
    return ev;
}

BadgeRecord QuestLedger::mint_badge(const std::string &badge_id,
                                    const std::string &wallet,
                                    std::uint64_t timestamp,
                                    bool repeatable_flag) {
    auto it = badge_registry_.find(badge_id);
    if (it == badge_registry_.end()) {
        throw std::runtime_error("badge metadata missing");
    }
    const auto &meta = it->second;
    const bool repeatable = repeatable_flag || meta.repeatable;

    const auto minted_key = fmt::format("{}:{}", badge_id, wallet);
    if (!repeatable && minted_badges_.contains(minted_key)) {
        throw std::runtime_error("badge already minted for wallet");
    }

    if (!repeatable) {
        minted_badges_.insert(minted_key);
    }

    auto record = BadgeRecord{badge_id, wallet, timestamp, meta.metadata_cid};
    badges_.push_back(record);
    return record;
}

} // namespace qubic::contracts
