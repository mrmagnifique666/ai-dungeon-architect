{
  "mode": "standard",
  "generation_type": "one-shot",
  "theme": "Forbidden arcane laboratory beneath a ruined academy",
  "tone": "dark, tense, dangerous",
  "dungeon_idea": "An abandoned magical academy hides a sealed underground laboratory where a failed archmage experiment has evolved into a sentient threat.",
  "party": {
    "system": "D&D 5e",
    "party_size": 4,
    "party_level": 5,
    "composition_notes": "Balanced party with at least one frontliner and one spellcaster"
  },
  "constraints": {
    "combat_profile": "combat-heavy",
    "traps": "low",
    "social_roleplay": "medium",
    "exploration_puzzle": "medium"
  },
  "bbeg_preferences": {
    "must_be_unique": true,
    "theme_tied": true,
    "final_room_logic_required": true,
    "allowed_types": [
      "mutated spellcaster",
      "arcane construct",
      "failed magical experiment"
    ],
    "disallowed_types": [
      "lich",
      "dragon",
      "demon lord"
    ]
  },
  "map_preferences": {
    "grid_type": "standard",
    "units": "5ft",
    "top_down_required": true,
    "allow_dead_ends": true,
    "corridor_style": "orthogonal",
    "overlap_forbidden": true
  },
  "output_preferences": {
    "include_json_export": true,
    "include_top_down_map_prompt": true,
    "verbosity": "ui-optimized"
  },
  "missing_inputs_policy": "mark_missing_and_continue"
}
