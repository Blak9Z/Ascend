# Product Brief – Ascend Milestone 1

## Purpose
Define the flagship quest experiences Ascend will ship during milestone 1 so downstream teams can align on requirements for evaluation, rewards, and comms.

## Personas
1. **Explorers** – new wallet owners coming from EasyConnect partner activations; measure success via quest completion and retention.
2. **Contributors** – existing blockchain users testing integrations; focus on deeper quests (governance votes, contract calls).
3. **Champions** – community members competing on leaderboards and sharing progress to Discord/Notion.

## Quest Catalog v1
| Quest Type | Example Quest | Trigger | Completion Criteria | Notes |
| --- | --- | --- | --- | --- |
| Onboarding | “Connect wallet + confirm profile” | EasyConnect identity event | Wallet verification + profile metadata complete | Awards base XP, unlocks other quests |
| Learning | “Complete tutorial & run sample contract call” | Library-signed transaction | Submit hash + confirm decoded event | Auto-award badge highlighting skill |
| Competition | “Top 100 gasless swaps this week” | Aggregated swap events | Ranking by count and accuracy | Feeds leaderboard season |
| Contribution | “Submit quest idea + staking vote” | Governance vote + Notion form | On-chain vote receipt + off-chain reference | Unlocks unique badge |
| Mastery | “Complete 5 quests across 3 categories” | Quest engine progress | Derived condition | Grants mastery badge & XP multiplier |

## Badge & XP Economy
- Base XP table: Onboarding (50), Learning (80), Competition (variable, up to 200), Contribution (120), Mastery (250).
- Daily XP cap per user: 500 XP to prevent farming; quest evaluation engine enforces cooldowns.
- Badges grouped into **Starter**, **Skill**, **Competitive**, **Legendary** tiers; metadata stored in badge registry and minted through Qubic hooks.
- XP multipliers triggered by Mastery badges (+15%) and weekly streaks (+10%).

## Leaderboard Rules
- Leaderboard seasons run bi-weekly with snapshots stored for transparency.
- Sorting priority: Total XP > Quest completion count > Earliest completion timestamp.
- Anti-cheat: deduplicate events via wallet+quest IDs and require signed payloads from EasyConnect library.
- Public API exposes top 100 plus user-specific rank for dashboards and Discord bots.

## Success Metrics
- 70% of onboarding quest starters finish at least one Learning quest within first 72 hours.
- 1,000 wallet connections with verified quest progress before Milestone 2 begins.
- At least 30% of quests triggered automatically via EasyConnect replays (no manual marking).
- Feedback loop: collect qualitative input from 10 champions to refine quest catalog.

