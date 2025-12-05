#pragma once

#include <cstdint>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace qubic::contracts {

struct QuestProgress {
    std::string quest_id;
    std::string wallet;
    std::uint32_t status; // 0=pending, 1=started, 2=completed
    std::uint64_t last_action_hash;
    std::uint64_t updated_at;
};

struct RewardEvent {
    std::string quest_id;
    std::string wallet;
    std::uint64_t xp_awarded;
    std::uint64_t total_xp;
    std::uint8_t multiplier{1};
    bool badge_minted{false};
};

struct BadgeRecord {
    std::string badge_id;
    std::string wallet;
    std::uint64_t minted_at;
    std::string metadata_cid;
};

struct BadgeMetadata {
    std::string metadata_cid;
    bool repeatable{false};
};

class QuestLedger {
  public:
    void set_badge_metadata(const std::string &badge_id,
                            std::string metadata_cid,
                            bool repeatable);

    QuestProgress record_progress(const std::string &quest_id,
                                  const std::string &wallet,
                                  std::uint32_t status,
                                  std::uint64_t action_hash,
                                  std::uint64_t timestamp);

    RewardEvent allocate_xp(const std::string &quest_id,
                            const std::string &wallet,
                            std::uint64_t amount,
                            std::uint64_t timestamp);

    BadgeRecord mint_badge(const std::string &badge_id,
                           const std::string &wallet,
                           std::uint64_t timestamp,
                           bool repeatable = false);

    const std::vector<QuestProgress> &progress_log() const { return progress_; }
    const std::vector<RewardEvent> &reward_log() const { return rewards_; }
    const std::vector<BadgeRecord> &badge_log() const { return badges_; }

  private:
    std::string progress_key(const std::string &quest_id, const std::string &wallet) const;
    std::string dedupe_key(const std::string &quest_id,
                           const std::string &wallet,
                           std::uint64_t action_hash) const;
    std::uint64_t day_bucket(std::uint64_t timestamp) const;

    struct RewardState {
        std::uint64_t total_xp{0};
        std::uint64_t day{0};
        std::uint64_t xp_today{0};
        std::uint8_t multiplier{1};
    };

    std::unordered_map<std::string, QuestProgress> latest_progress_;
    std::unordered_set<std::string> processed_actions_;
    std::unordered_map<std::string, RewardState> reward_ledger_;
    std::unordered_map<std::string, BadgeMetadata> badge_registry_;
    std::unordered_set<std::string> minted_badges_;

    std::vector<QuestProgress> progress_;
    std::vector<RewardEvent> rewards_;
    std::vector<BadgeRecord> badges_;
};

} // namespace qubic::contracts
