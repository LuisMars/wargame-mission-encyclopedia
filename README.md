# Wargame Mission Encyclopedia

A system-neutral catalog of mission archetypes for tabletop wargames.

**Live site:** https://luismars.github.io/wargame-mission-encyclopedia/

## What is this?

A reference of **83 mission archetypes** organized into **11 families**, designed to help wargame designers, GMs, and players understand the building blocks behind mission design. Every archetype is system-agnostic — it describes *what* the mission is about, not *how* the rules work.

### Families

| Family | Archetypes | Focus |
|--------|-----------|-------|
| Control | 15 | Claiming and holding territory |
| Elimination | 12 | Destroying enemy forces or key targets |
| Loot | 9 | Retrieving, stealing, or extracting objects |
| Sabotage | 8 | Destroying or disabling enemy assets |
| Breakthrough | 7 | Crossing enemy lines, escaping, or racing |
| Defense | 7 | Holding out against pressure or storming fortifications |
| Progress | 7 | Completing multi-step objectives or constructions |
| Escort | 6 | Moving VIPs, convoys, or prisoners |
| Recon | 5 | Gathering intelligence |
| Influence | 4 | Civilians, politics, or reputation |
| Stealth | 3 | Concealment, detection avoidance, covert operations |

### Taxonomy

Each archetype is classified across six facets:

- **Intent** — what victory is about (space control, elimination, retrieval, etc.)
- **Interaction** — what players physically do (presence, carry, combat, stealth, etc.)
- **Victory** — how the winner is decided (progressive, endgame, sudden death, etc.)
- **Information** — what is known and when (open, hidden objectives, fog of war)
- **Match** — player count, symmetry, third parties
- **Spatial** — how the board is used (topology, orientation, dynamism)

## Features

- Bilingual: English and Spanish
- Dark mode
- Filterable by family, tags, and free-text search
- Responsive design
- No dependencies beyond Jekyll

## Run locally

```bash
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000/wargame-mission-encyclopedia/` in your browser.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add archetypes, propose taxonomy changes, or add a new language.

## License

- **Content** (archetypes, taxonomy, translations): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- **Code** (templates, JS, CSS): [MIT](LICENSE)
