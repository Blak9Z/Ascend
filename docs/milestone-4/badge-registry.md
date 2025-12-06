# Badge Metadata Registry - Milestone 4

## Registry Structure
```json
{
  "id": "legendary-ember",
  "label": "Legendary Ember",
  "rarity": "legendary",
  "description": "Awarded for completing quests in three categories during a single season.",
  "artCid": "bafybeigdyr5kj-example",
  "qubicMintHook": "0xquestMintLegendary",
  "season": "S0",
  "xpValue": 250
}
```

| Field | Description |
| --- | --- |
| `id` | Stable slug referenced by quest rules + reward ledger. |
| `label` | Human-readable badge name surfaced in UI + notifications. |
| `rarity` | `starter`, `skill`, `competitive`, `legendary`. Drives badge shelf styling. |
| `description` | Short blurb shown in tooltips + docs. |
| `artCid` | Content hash (IPFS/Arweave) for badge artwork. |
| `qubicMintHook` | Contract entrypoint name that mints or updates NFT state. |
| `season` | Season identifier to scope metadata updates. |
| `xpValue` | Canonical XP reward tied to this badge for auditing. |

## Sample Registry Entries
```jsonc
[
  {
    "id": "starter-spark",
    "label": "Starter Spark",
    "rarity": "starter",
    "description": "Connect wallet + profile to unlock the questline.",
    "artCid": "bafybeidstarter0001",
    "qubicMintHook": "0xquestMintStarter",
    "season": "S0",
    "xpValue": 50
  },
  {
    "id": "rule-crafter",
    "label": "Rule Crafter",
    "rarity": "skill",
    "description": "Replay 5 evaluation payloads via @nouslabs CLI.",
    "artCid": "bafybeidrule0002",
    "qubicMintHook": "0xquestMintSkill",
    "season": "S0",
    "xpValue": 80
  },
  {
    "id": "season-architect",
    "label": "Season Architect",
    "rarity": "competitive",
    "description": "Prototype leaderboard dashboards with XP deltas and sharing.",
    "artCid": "bafybeidseason0003",
    "qubicMintHook": "0xquestMintCompetitive",
    "season": "S0",
    "xpValue": 140
  },
  {
    "id": "legendary-ember",
    "label": "Legendary Ember",
    "rarity": "legendary",
    "description": "Complete cross-category mastery sweep.",
    "artCid": "bafybeidlegendary0004",
    "qubicMintHook": "0xquestMintLegendary",
    "season": "S0",
    "xpValue": 250
  }
]
```

## Operational Notes
- Registry lives alongside reward service configs; publish as JSON + generated TS types.
- CI should validate structure via Zod schema + ensure art CIDs resolve before merging.
- Mint hooks require matching contract tests confirming badge IDs map to on-chain enums.
