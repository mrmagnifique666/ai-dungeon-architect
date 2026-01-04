SECTION 0 — Inputs Echo
```json
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
```

SECTION 1 — Quest & Motivation
The once-renowned Starfall Academy, famed for its arcane research, lies in ruin, a testament to a catastrophic magical failure decades ago. Whispers now suggest the disaster wasn't the end, but a beginning. Strange, chaotic energies have begun to emanate from the academy's sealed catacombs, causing minor mutations in local wildlife and disturbing the ley lines of the region.

**Why the party goes:** A local lord, concerned by the escalating magical disturbances and the dwindling harvests in nearby farmlands, has put out a desperate call for skilled adventurers. He offers a generous reward for anyone brave enough to investigate the Starfall Academy's ruins, locate the source of the chaotic magic, and neutralize the threat.

**Why the party stays:** As the party delves deeper, they discover evidence that the "failed experiment" was actually a conscious attempt by Archmage Xylos to merge his mind with raw planar energy, an experiment that went horribly wrong. The entity, now known as the Sentient Maelstrom, is not merely leaking energy; it is actively drawing power from the surrounding land, slowly corrupting it. The party finds a journal detailing Xylos's final, desperate plea to stop the nascent entity from fully manifesting and consuming all life.

**Why the BBEG must be stopped now:** The Sentient Maelstrom is reaching a critical threshold. Ancient arcane conduits within its laboratory are charging, indicating it plans a massive, region-wide discharge of chaotic energy that would mutate all living things, warp the landscape, and potentially open unstable rifts to chaotic planes. Its full manifestation is imminent, perhaps within days.

**What changes if the party succeeds:** The Sentient Maelstrom is contained or destroyed, stabilizing the ley lines and halting the magical corruption. The land begins to heal, the strange mutations recede, and the region is saved from a devastating arcane catastrophe. The local lord honors his reward, and the party gains renown. Fragments of Xylos's research might be recovered, offering new arcane insights (or warnings).

**What happens if they fail:** The Sentient Maelstrom fully manifests, unleashing a wave of chaotic magic that permanently transforms the region into a twisted, unpredictable wasteland. Monstrous mutations become common, and the local populace is either consumed, mutated, or forced to flee, leaving the area a desolate, magic-blasted monument to unchecked arcane ambition.

SECTION 2 — BBEG Forge
**Identity & Theme Tie**
The Sentient Maelstrom of Xylos is the horrifying culmination of Archmage Xylos's hubris. Believing he could harness and merge with pure planar chaos, his experiment instead trapped and twisted his consciousness, forming a being of raw, unstable arcane energy. It is a living, thinking vortex of chaotic magic, constantly shifting and crackling, barely contained within its final laboratory. Its existence perfectly embodies the "failed archmage experiment evolved into a sentient threat" theme, a dark reflection of the academy's ruin.

**Motivation**
The Sentient Maelstrom's motivation is primal: to fully manifest its power, break free from the confines of the laboratory, and spread its chaotic influence across the world. It seeks to consume and reforge reality in its own image, driven by the fragmented, pain-ridden echoes of Xylos's ambition and the pure, untamed hunger of planar chaos. It views the material plane as a canvas for its warped creation, and all life as fuel for its ultimate evolution.

**Full D&D 5e Stat-Block (BBEG)**
**The Sentient Maelstrom of Xylos**
*Large Aberration, Chaotic Evil*

**Armor Class** 15 (natural armor, arcane barrier)
**Hit Points** 136 (16d10 + 48)
**Speed** 0 ft., fly 40 ft. (hover)

| STR | DEX | CON | INT | WIS | CHA |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 6 (-2) | 14 (+2) | 16 (+3) | 19 (+4) | 12 (+1) | 18 (+4) |

**Saving Throws** Int +8, Wis +5, Cha +8
**Skills** Arcana +8, Perception +5
**Damage Resistances** Bludgeoning, Piercing, and Slashing from nonmagical attacks
**Damage Immunities** Force, Poison
**Condition Immunities** Charmed, Exhaustion, Frightened, Grappled, Paralyzed, Petrified, Poisoned, Prone, Restrained
**Senses** Darkvision 120 ft., passive Perception 15
**Languages** Deep Speech, telepathy 120 ft.
**Challenge** 7 (2,900 XP)

**Traits**
***Amorphous.*** The Maelstrom can move through a space as narrow as 1 inch wide without squeezing.
***Chaotic Aura.*** At the start of each of the Maelstrom's turns, each creature within 10 feet of it takes 7 (2d6) force damage. Any creature that starts its turn within this aura must succeed on a DC 15 Wisdom saving throw or have disadvantage on the first attack roll or saving throw it makes before the end of its next turn.
***Innate Spellcasting.*** The Maelstrom's innate spellcasting ability is Charisma (spell save DC 16, +8 to hit with spell attacks). It can innately cast the following spells, requiring no material components:
At will: *detect magic, magic missile* (3rd level)
3/day each: *chromatic orb* (at 4th level), *hold person*, *misty step*
1/day each: *confusion, wall of force*
***Magic Resistance.*** The Maelstrom has advantage on saving throws against spells and other magical effects.
***Unstable Form.*** The Maelstrom cannot be grappled or restrained by nonmagical means. If the Maelstrom takes 20 or more damage from a single attack, it gains 1 point of exhaustion (cumulative).

**Actions**
***Multiattack.*** The Maelstrom makes two Arcane Lash attacks.
***Arcane Lash.*** *Melee Spell Attack:* +8 to hit, reach 15 ft., one target. *Hit:* 11 (2d6 + 4) force damage plus 7 (2d6) psychic damage.
***Reality Warp (Recharge 5-6).*** The Maelstrom unleashes a localized burst of chaotic energy in a 20-foot radius centered on itself. Each creature in that area must make a DC 16 Dexterity saving throw. On a failed save, a creature takes 28 (8d6) force damage and is teleported up to 30 feet in a random direction (roll a d8 for direction, 5ft per increment). On a successful save, a creature takes half as much damage and is not teleported.

**Reactions**
***Chaotic Feedback.*** When a creature successfully hits the Maelstrom with a spell attack, the Maelstrom can force the attacker to make a DC 16 Intelligence saving throw. On a failed save, the attacker takes 10 (3d6) psychic damage and has disadvantage on its next saving throw.

SECTION 3 — One-Shot Snapshot
**Title:** The Maelstrom of Starfall
**Hook:** The Starfall Academy lies in ruins, but a creeping magical blight now emanates from its depths, threatening to consume the surrounding lands. Local authorities seek brave adventurers to uncover and neutralize the source.
**Objective:** Delve into the hidden, corrupted laboratories beneath the Starfall Academy, identify the source of the chaotic magic, and destroy or contain the Sentient Maelstrom of Xylos before it fully manifests its devastating power.
**Twist:** The Sentient Maelstrom isn't just a mindless magical anomaly; it's the twisted consciousness of Archmage Xylos, seeking to complete its horrifying evolution and impose its chaotic will upon the world, a dark echo of the very academic ambition that created it.
**Failure Stakes:** The surrounding region is permanently warped into a chaotic, magic-blasted wasteland, its inhabitants mutated or driven to madness, as the Maelstrom becomes an unstoppable force.

SECTION 4 — Dungeon Module Overview
This one-shot module, "The Maelstrom of Starfall," plunges a party of four 5th-level adventurers into the forgotten, magically corrupted laboratories beneath the ruined Starfall Academy. The dungeon is designed to be a linear progression through increasingly dangerous and warped environments, culminating in a confrontation with the Sentient Maelstrom of Xylos. The theme is one of dark arcane experimentation gone awry, with visual cues of broken machinery, corrupted magical residue, and the slow transformation of the environment. The tone is tense and dangerous, emphasizing the threat of unchecked magical power. The dungeon layout encourages careful exploration while presenting frequent, challenging combat encounters. Clues are scattered throughout, revealing the tragic history of Archmage Xylos and the true nature of the Maelstrom, building narrative tension towards the final confrontation.

SECTION 5 — Balance Plan
This adventure is balanced for a party of four 5th-level characters, designed with a "combat-heavy" profile, "low" traps, and "medium" social/roleplay and exploration/puzzle elements. The encounters are designed to provide a steady challenge, with a mix of direct combat, environmental hazards, and strategic decision-making.

*   **Combat Encounters:** The dungeon features 6 combat encounters, ranging from Medium to Hard difficulty for a 5th-level party, culminating in a Deadly boss fight. Monsters are chosen from the SRD to fit the theme of arcane experimentation and corruption. Tactical considerations for each encounter are provided.
*   **Traps:** Traps are minimal (1-2 minor traps), primarily serving as environmental hazards or to reinforce the dangerous, unstable nature of the laboratory rather than as primary challenges.
*   **Social/Roleplay:** Opportunities for social interaction are limited, primarily focused on interpreting lore and making decisions based on the discovered information. There are no friendly NPCs, but understanding the BBEG's twisted motivation through scattered journals and notes provides a narrative roleplay element.
*   **Exploration/Puzzle:** Exploration is key to navigating the dungeon and discovering clues. Puzzles are integrated into the environment, such as deciphering cryptic notes or manipulating arcane machinery, to unlock progress or reveal hidden areas.

**Encounters by Room:**
*   **Room 1: Crumbling Antechamber:** Medium combat (Animated Armor).
*   **Room 2: Collapsed Library & Guard Post:** Medium combat (Gargoyle).
*   **Room 3: Alchemical Lab Remnants:** Minor puzzle/hazard, potential for a social encounter if party tries to decipher notes.
*   **Room 4: Containment Cells:** Hard combat (Grick, Specter).
*   **Room 5: Arcane Conduit Chamber:** Hard combat (Ogre, Animated Armor).
*   **Room 6: Failed Experimentarium:** Deadly combat (Gibbering Mouther).
*   **Room 7: Maelstrom's Antechamber:** Hard combat (Flameskull).
*   **Room 8: Heart of the Maelstrom:** Deadly boss fight (Sentient Maelstrom of Xylos).

SECTION 6 — Dungeon Rooms

---
**Room R1 — Crumbling Antechamber**

- Read-Aloud
The air here is thick with the scent of dust and ozone, a stark contrast to the fresh air outside the ruined academy. Stone blocks, once part of an elegant archway, lie scattered across the floor, partially obscuring a grand, but now broken, mosaic depicting celestial bodies. Ahead, a heavy, iron-bound door, half-off its hinges, creaks ominously, revealing only darkness beyond.

- Environment & Layout
This chamber serves as the initial entry point into the underground complex. The ceiling is cracked, with sections of rubble having fallen, creating difficult terrain in places. The mosaic on the floor, though damaged, hints at the academy's past reverence for celestial magic. Along the walls, broken sconces and rusted iron grates suggest former grandeur, now decayed. Dust motes dance in the faint light filtering from the surface, illuminating ancient scorch marks on the stone, hinting at past magical conflicts or accidents.

The room is roughly rectangular, with a wide, arched entrance from the surface leading to the iron-bound door. Piles of debris provide partial cover (half cover) for anyone seeking to use them tactically. The air grows noticeably colder near the iron door, carrying a faint, unsettling hum.

- Interactive Elements
*   **Rubble Piles:** Difficult terrain; can be used for half cover. (DC 10 Strength (Athletics) to clear a 5ft square in 1 minute).
*   **Broken Mosaic:** A DC 13 Intelligence (Investigation) check reveals faint arcane symbols integrated into the celestial design, subtly hinting at the academy's focus on planar energies.
*   **Rusted Iron Grates:** Lead to small, dark vents that descend into the earth, too small for passage but allowing faint drafts of air.

- Encounters
**Encounter E-R1-1: Guardians of the Threshold**
*   **Monsters:** Animated Armor (monster_id: M1, count: 2)
*   **Trigger:** The Animated Armors stand motionless amongst the debris. They activate and attack as soon as any living creature passes the halfway point of the room or attempts to force open the iron-bound door.
*   **Tactics:** The Animated Armors will move to intercept the closest threats, attempting to block passage to the next room. They will use their False Appearance trait to surprise the party if possible, then engage in straightforward melee combat. They prioritize spellcasters if easily identifiable and within reach.

- Treasure & Consequences
A DC 12 Intelligence (Investigation) check on the rubble near the iron door reveals a small, ornate leather pouch containing 35 gp and a silver ring (worth 15 gp) amidst a crushed skeleton. The Animated Armors carry no treasure.

- Clues Forward
*   A faint, high-pitched hum can be heard emanating from beyond the iron door, growing stronger as one approaches.
*   Scattered, faded etchings on the archway depict a stylized symbol of a swirling vortex, identical to some of the arcane symbols on the mosaic, suggesting a link to the academy's deeper research.

- Exits
*   To: R2 (via heavy iron door on the North wall, description: "Heavy, iron-bound door, half-off its hinges, leads deeper into the complex.")

---
**Room R2 — Collapsed Library & Guard Post**

- Read-Aloud
Beyond the creaking door, a vast chamber stretches out, its former glory now a ruin. Bookshelves lie toppled, their contents scattered and moldering, forming treacherous mounds of decaying parchment. A section of the ceiling has entirely collapsed, creating a gaping hole that leads to the surface, allowing a single, weak beam of moonlight to pierce the perpetual gloom. In the center, a raised platform with a broken lectern stands, surrounded by what appear to be the remnants of a guard post.

- Environment & Layout
This large, irregular chamber once served as a grand library, but decades of neglect and the academy's collapse have reduced it to a chaotic mess. The floor is uneven, covered in a thick layer of dust, broken timber, and water-damaged books. The collapsed ceiling section creates a large crater in the northern part of the room, with debris forming a ramp down. The guard post in the center, though dilapidated, still offers some vantage and cover. Broken arcane devices and discarded quills are scattered among the debris, hinting at the research once conducted here.

The air here is noticeably cooler and carries a faint, metallic tang. Several alcoves along the walls contain more ruined bookshelves and desks, some still bearing faint scorch marks. The sheer volume of debris makes movement difficult in many areas.

- Interactive Elements
*   **Toppled Bookshelves:** Difficult terrain. A DC 14 Strength (Athletics) check is required to move through a particularly dense section of collapsed shelves.
*   **Collapsed Ceiling Crater:** Provides a weak source of moonlight. A DC 12 Intelligence (Investigation) check reveals faint, unusual crystalline growths on the rock exposed by the collapse, pulsing with a dim, internal light.
*   **Broken Lectern:** A DC 15 Intelligence (Arcana or History) check on the lectern reveals it was enchanted to project magical light and sound, likely for lectures. It now emits only a faint, erratic hum.

- Encounters
**Encounter E-R2-1: Corrupted Guardian**
*   **Monsters:** Gargoyle (monster_id: M2, count: 1)
*   **Trigger:** The Gargoyle is perched motionless on a high, partially intact section of the wall near the collapsed ceiling. It appears to be a stone statue. It animates and attacks when the party approaches the guard post or attempts to interact with the collapsed ceiling crater.
*   **Tactics:** The Gargoyle uses its False Appearance to surprise the party. It will prioritize spellcasters or ranged attackers, using its flight to maintain distance and harass from above, occasionally swooping down for melee attacks. It attempts to push targets into difficult terrain created by the debris.

- Treasure & Consequences
A DC 14 Intelligence (Investigation) check among the debris of the guard post uncovers a sturdy, locked wooden chest (DC 15 Dexterity (Thieves' Tools) to unlock, or DC 18 Strength to break open). Inside are 80 gp, a potion of healing, and a spell scroll of *detect magic*.

- Clues Forward
*   Among the ruined books, a partial journal entry (DC 13 Intelligence (Investigation) to find) speaks of Archmage Xylos's "breakthrough research into planar fusion" and mentions "the containment cells below."
*   The faint crystalline growths in the collapsed ceiling are identical to those mentioned in the journal fragment, suggesting the chaotic magic is spreading.

- Exits
*   To: R1 (via heavy iron door on the South wall, description: "Heavy, iron-bound door, half-off its hinges, leading back to the entrance.")
*   To: R3 (via sturdy wooden door on the East wall, description: "A sturdy wooden door, slightly ajar, leads into a darker passage.")

---
**Room R3 — Alchemical Lab Remnants**

- Read-Aloud
A pungent, acrid smell hangs heavy in this smaller chamber, which appears to have been an alchemical laboratory. Shattered glass beakers and cracked clay retorts litter the stone tables, some still stained with dried, iridescent residues. A large, ornate furnace dominates one wall, its grates warped and rusted, while a shallow pool of murky, glowing liquid shimmers faintly in the center of the room.

- Environment & Layout
This room is a testament to hurried and potentially dangerous alchemical work. The tables are covered in chemical spills, some of which still fizz faintly. The glowing pool in the center is the most prominent feature, emitting a soft, ethereal light that casts eerie shadows. Shelves along the walls hold cracked vials and forgotten ingredients, many now inert or dangerously volatile. The air feels heavy and slightly corrosive.

The floor around the pool is slick and stained. The furnace, once a source of intense heat, is now cold, but its internal mechanisms are complex and partially exposed. The room has a low ceiling, making it feel somewhat claustrophobic.

- Interactive Elements
*   **Glowing Pool:** The murky liquid emits faint light. A DC 13 Intelligence (Arcana) check identifies it as residual, unstable alchemical reagents. Touching it deals 1d4 acid damage and 1d4 psychic damage (no save). A DC 14 Intelligence (Investigation) check reveals a small, waterlogged journal at the bottom.
*   **Shattered Lab Equipment:** Difficult terrain in places. A DC 12 Intelligence (Investigation) check might reveal a still-intact (but empty) vial labeled "Planar Stabilizer."
*   **Ornate Furnace:** A DC 15 Intelligence (Investigation) check reveals a hidden compartment behind a loose brick in the furnace's base.

- Encounters
No direct combat encounter in this room. The primary challenge is environmental and investigative.

- Treasure & Consequences
The hidden compartment in the furnace (DC 15 Intelligence (Investigation) to find) contains 50 gp and a small bag of holding.
The waterlogged journal in the glowing pool (DC 14 Intelligence (Investigation) to retrieve carefully) is mostly illegible but contains a few clear phrases from Archmage Xylos: "Containment failing," "the pulse grows stronger," and "must reach the lower levels before it fully awakens." Reading it causes a momentary, unsettling psychic echo (no damage).

- Clues Forward
*   The waterlogged journal explicitly mentions "containment failing" and "the lower levels," indicating the experiment's location.
*   The "Planar Stabilizer" vial, though empty, suggests that Xylos was trying to *contain* something, not just create it.
*   A faint, rhythmic thrumming sound, like a slow heartbeat, can be felt through the floor, originating from deeper below.

- Exits
*   To: R2 (via sturdy wooden door on the West wall, description: "A sturdy wooden door, slightly ajar, leads back to the collapsed library.")
*   To: R4 (via reinforced iron door on the North wall, description: "A heavily reinforced iron door, secured with arcane runes, leads down a short flight of steps.")

---
**Room R4 — Containment Cells**

- Read-Aloud
The rhythmic thrumming intensifies as you enter a long, narrow corridor lined with reinforced iron doors, each bearing a faded, glowing rune. The air here is cold and heavy, carrying a faint, metallic tang mixed with something vaguely organic and putrid. Through gaps in the corroded iron, you glimpse empty cells, some streaked with strange, dried fluids, others containing broken restraints. This place feels like a prison, or perhaps, a desperate attempt to contain the uncontrollable.

- Environment & Layout
This corridor is clearly designed for security and containment. The iron doors are thick and barred, many now standing ajar or completely broken. The cells themselves are small, spartan, and often show signs of violent struggle. The walls and floor are made of dark, heavy stone, with faint arcane conduits etched into them, once used to power the containment runes. Some of these conduits still hum weakly. A few cells contain the skeletal remains of small, mutated creatures, or broken, rusted surgical instruments.

The thrumming from below is now a constant, low vibration felt through the soles of one's boots. The corridor is dimly lit by the faint glow of the decaying runes and the occasional crackle of unstable magic.

- Interactive Elements
*   **Reinforced Cell Doors:** Most are broken open. A DC 15 Intelligence (Arcana) check on an intact rune reveals its purpose: to suppress magical abilities within the cell.
*   **Broken Restraints:** A DC 12 Wisdom (Medicine) check reveals the restraints were designed for humanoids but show signs of having held something much stronger or more flexible.
*   **Mutated Remains:** A DC 14 Intelligence (Nature) or (Arcana) check on the skeletal remains suggests accelerated, unnatural mutation, possibly from arcane exposure.

- Encounters
**Encounter E-R4-1: Escaped Experiments**
*   **Monsters:** Grick (monster_id: M3, count: 2), Specter (monster_id: M4, count: 1)
*   **Trigger:** The Gricks are camouflaged against the dark ceiling and walls, waiting. The Specter manifests from a particularly corrupted cell as the party moves past the third cell door.
*   **Tactics:** The Gricks drop from above to ambush the party, focusing on isolated targets. The Specter will use its Incorporeal Movement to pass through walls and surprise targets, prioritizing characters with high Constitution scores to drain their life force. The Gricks will attempt to grapple and constrict, while the Specter will try to isolate and weaken.

- Treasure & Consequences
One of the broken cell doors (DC 16 Intelligence (Investigation) to spot a hidden compartment behind it) conceals a small, lead-lined box containing three vials of antitoxin and a pouch with 60 gp.
The Specter carries no physical treasure.

- Clues Forward
*   A faded, blood-stained note (DC 13 Intelligence (Investigation) to find in a cell) from a desperate researcher reads: "The 'Maelstrom' grows too fast. Xylos is obsessed. He's trying to *feed* it. It needs to be stopped before it consumes us all."
*   The rhythmic thrumming from the floor is now very distinct, leading further down.

- Exits
*   To: R3 (via reinforced iron door on the South wall, description: "A heavily reinforced iron door, secured with arcane runes, leads back up to the alchemical lab.")
*   To: R5 (via heavy vault door on the East wall, description: "A massive, circular vault door, intricately carved with arcane symbols, hums with contained energy.")

---
**Room R5 — Arcane Conduit Chamber**

- Read-Aloud
The heavy vault door slides open with a groan of stressed metal, revealing a vast, circular chamber dominated by a colossal, glowing crystal spire that rises from the floor to the high ceiling. Arcane conduits, thick as tree trunks