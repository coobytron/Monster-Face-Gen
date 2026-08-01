# V10 Authored Library Expansion Plan

V10 expands the pre-drawn monster library to approximately three times the v9 baseline while preserving the authored-asset boundary.

## Source of truth

The supplied Monster Face Generator MVP boards define the visual target: chunky asymmetrical silhouettes, dominant eye-first hierarchy, irregular teeth and gums, broken or curled crown elements, dense hand-inked texture, distressed print effects, playful color, and strong 96 px / 48 px readability.

## Targets

| Family | v9 baseline | V10 target |
|---|---:|---:|
| Head bases | 6 | 18 |
| Eye sets | 10 | 30 |
| Noses / snouts | 9 | 27 |
| Mouths | 9 | 27 |
| Horns / ears | 9 | 27 |
| Patterns | 9 | 27 |
| Extras | 9 | 27 |
| Finishes | 5 | 12 |
| Curated recipes | 16 | 48 |

The canonical machine-readable contract is `assets/v10-expansion-contract.json`.

## Diversity contract

New anatomy must be structurally authored, not counted through recolors. Required character directions include cyclops, multi-eye, skull-like, furry, blob, compact imp, long-face, squat, soft/cute, sharp/creepy, calm, and wild.

Required mouth directions include sparse, crowded, tusked, buck-toothed, zipper-like, gummy, fang-led, open-roar, underbite, and tongue-led.

## Effects

V10 may use authored SVG, PNG, WebP, masks, hybrid layers, and fixed deterministic finish plates. Candidate treatments include etched ink, blackwork, screenprint registration, distressed xerox, halftone pulp, dry brush, chromatic edge split, metallic highlights, paper-cut shadows, soft airbrush underpaint, risograph, and clean asset.

Effects must not create, infer, morph, or distort anatomy at runtime.

## Review

Review every new asset and curated recipe at 100%, 25%, 192 px, 96 px, and 48 px; flipped and unflipped; on cream, white, black, and transparent backgrounds.

Agent-authored candidates are not human-approved production art. Human review status must remain explicit.

## Validation

Run:

```bash
node tests/v10-expansion-contract.test.js
node scripts/v10-expansion-contract.js --write
```

The validator checks target integrity, required taxonomy, duplicate tags, runtime-geometry prohibition, and human-approval separation. It writes deterministic output to `generated/qa/v10-expansion-validation-report.json`.
