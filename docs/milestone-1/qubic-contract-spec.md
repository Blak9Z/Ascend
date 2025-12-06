# Qubic Contract Specification – Milestone 1
Owner: @nouslabs

## Goals
- Track quest progress, badge issuance, and XP allocations on-chain for auditability.
- Provide deterministic events for EasyConnect so Ascend services can consume normalized payloads via the in-house Qubic C++ library.
- Support badge minting hooks and XP multipliers without redeploying the main contract.

## Storage Layout
```cpp
struct QuestProgressRow {
    uint64_t quest_id;
    address wallet;
    uint32_t status;          // 0=pending,1=started,2=completed
    uint64_t last_action_id;  // reference to ChainAction hash
    uint64_t updated_at;      // unix timestamp
};

struct RewardLedgerRow {
    address wallet;
    uint64_t total_xp;
    uint32_t mastery_badges;  // number of mastery badges minted
    uint64_t last_reward_id;
};

struct BadgeMintRow {
    uint32_t badge_id;
    address wallet;
    uint64_t minted_at;
    bytes32 metadata_cid;     // IPFS/Arweave reference
};
```
Tables keyed by `(quest_id, wallet)` for `QuestProgressRow`, `wallet` for rewards, `(badge_id, wallet)` for badge mints.

## Actions
1. `record_progress(quest_id, wallet, status, action_hash)`
   - Auth: only EasyConnect orchestrator key.
   - Validations: status must be >= previous status; dedupe by `(quest_id, wallet, action_hash)`.
   - Emits `QuestProgressed` event.
2. `allocate_xp(wallet, quest_id, amount, source)`
   - Auth: Reward System signer.
   - Applies XP cap (500/day) enforced via rolling window stored in memory map keyed by `wallet`.
   - Emits `XPAwarded` event with new total.
3. `mint_badge(wallet, badge_id, metadata_cid)`
   - Auth: Reward System signer.
   - Checks badge_id within registry and not already minted for wallet unless badge is repeatable flag.
   - Emits `BadgeMinted` event and stores row.
4. `set_badge_registry(badge_id, tier, repeatable)`
   - Auth: admin multisig (controlled by @nouslabs team for this milestone).
   - Updates metadata mapping used by reward service.

## Events
```cpp
event QuestProgressed {
    uint64_t quest_id;
    address wallet;
    uint32_t status;
    uint64_t action_hash;
    uint64_t updated_at;
}

event XPAwarded {
    address wallet;
    uint64_t quest_id;
    uint64_t amount;
    uint64_t total_xp;
    uint8_t  multiplier; // 1 = no boost, >1 when mastery/streak active
}

event BadgeMinted {
    address wallet;
    uint32_t badge_id;
    bytes32 metadata_cid;
    uint64_t minted_at;
}
```
EasyConnect library will normalize these events into `ChainAction` payloads containing `quest_id`, `status`, `badge_id`, `xp_amount`, etc.

## Integration Notes
- Compile with `-std=c++23`, enforce clang-format in CI.
- Deterministic unit tests simulate quest progress, XP allocation caps, and badge minting race conditions.
- Provide fixture scripts for localnet deployment; exported contract ABI used by webhook adapter.
- Security: guard critical entrypoints with replay protection by storing nonce per orchestrator wallet.

## Deliverables Checklist
- [ ] Contract header/implementation files checked into `contracts/qubic`.
- [ ] Schema + ABI JSON published for EasyConnect integration tests.
- [ ] Sample event payloads recorded and shared with Quest Evaluation Engine team.
- [ ] Ops runbook for rotating orchestrator keys owned by @nouslabs.

