# Contributing

Thanks for your interest in improving the Wargame Mission Encyclopedia. This guide explains how to add content and what conventions to follow.

## Project structure

```
_archetypes/
  control/          # One folder per family
    area-control.md # One file per archetype
    king-of-the-hill.md
    ...
  elimination/
  loot/
  ...
_data/
  i18n.yml          # UI strings (EN + ES)
  taxonomy.yml      # Families, facets, tags
_layouts/           # Jekyll templates
_includes/          # Header, footer partials
assets/
  css/style.css     # All styles
  js/filter.js      # Filtering, language toggle, dark mode
es/index.html       # Spanish index page
index.html          # English index page
```

## Add a new archetype

1. Pick the family it belongs to (e.g., `control`, `elimination`, `loot`).
2. Copy `_archetypes/_template.md` to `_archetypes/<family>/<your-archetype>.md`.
3. Fill in the front matter — every field is required:

```yaml
---
id: family.your-archetype          # family.slug format
intent:
  primary: space_control            # leaf ID from taxonomy.yml → intent
interaction:
  primary: zone_presence            # leaf ID from taxonomy.yml → interaction
victory:
  cadence: progressive              # from taxonomy.yml → victory.cadence
  win_form: most_after_n            # from taxonomy.yml → victory.win_form
information:
  primary: open_info                # from taxonomy.yml → information
match:
  player_count: 1v1                 # 1v1 | teams | ffa
  symmetry: symmetric               # symmetric | asymmetric | rotating
spatial:
  topology: center_weighted          # from taxonomy.yml → spatial.topology
  orientation: midline               # from taxonomy.yml → spatial.orientation
  dynamism: static                   # from taxonomy.yml → spatial.dynamism
name:
  en: Your Archetype Name
  es: Nombre del arquetipo
summary:
  en: One-sentence description.
  es: Descripcion en una frase.
tags: [contact-high, rules-med, mid] # from taxonomy.yml → tags
---
```

4. Write the body in both languages:

```markdown
<div lang="en" markdown="1">

**Core:**
- Main mechanic description

**Win Condition:**
- How the winner is determined

**Variants:**
- Variant 1
- Variant 2

</div>

<div lang="es" markdown="1">

**Nucleo:**
- Descripcion de la mecanica principal

**Condicion de Victoria:**
- Como se determina el ganador

**Variantes:**
- Variante 1
- Variante 2

</div>
```

5. Build locally and check that it renders on both the index page and its detail page.

## Add a new language

Adding a language requires zero template or code changes. Only data:

1. **`_data/i18n.yml`** — Add a new top-level block (e.g., `fr:`) with all UI string keys.
2. **`_data/taxonomy.yml`** — Add `fr:` to every `name: {}` hash across all families, facets, and tags.
3. **Archetype front matter** — Add `fr:` to `name` and `summary` in every `.md` file.
4. **Archetype body** — Add a `<div lang="fr" markdown="1">` block in every `.md` file.
5. **`fr/index.html`** — Create with:
   ```yaml
   ---
   layout: home
   lang: fr
   permalink: /fr/
   ---
   ```

The language toggle will automatically cycle through all languages defined in `i18n.yml`.

## Propose a new family or taxonomy change

Open an issue describing:

- What the new family/facet/tag represents
- Which existing archetypes would move to it (if any)
- Example archetypes that would belong to it

Taxonomy changes affect all archetypes, so they need discussion before implementation.

## Pull request workflow

1. Fork the repo and create a branch.
2. Make your changes.
3. Build locally (`bundle exec jekyll serve`) and verify.
4. Submit a PR with a description of what you added or changed.

## Style conventions

- Archetype file names: `kebab-case.md`
- IDs: `family.kebab-case`
- Front matter values: use leaf IDs from `taxonomy.yml`, not free text
- Body sections: **Core**, **Win Condition**, **Variants** (EN) / **Nucleo**, **Condicion de Victoria**, **Variantes** (ES)
- Keep descriptions concise — bullet points, not paragraphs
