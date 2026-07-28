# Reviewed Library Fidelity Rollout — V9.8

## Source of truth

The supplied MVP boards remain the visual source of truth for silhouette rhythm, expression hierarchy, line weight, black-mass distribution, controlled hatching and stipple, local print wear, attachment quality, and thumbnail read. The existing three locked recipes remain the common baseline:

- `bog-cyclops-grin`
- `fuzz-fanged`
- `imp-roar`

This rollout does not crop, trace, or ship the flattened reference boards. Every production object is original authored artwork stored behind a stable asset or pair ID.

## What this rollout covers

The 13 remaining curated recipes now receive the same production structure as the hero set:

- a structured fidelity audit tied to stable recipe, asset, finish, and junction IDs
- load-after authored replacement art where the starter object was materially weaker
- one exact mouth/base integration plate
- one exact horn-or-ear/root integration plate
- deterministic generic-before versus exact-after QA
- flipped, 25%, 192 px, 96 px, and 48 px review
- cream, white, black, and transparent backgrounds
- clean and etched finish checks

The complete curated set therefore has 16 exact mouth pair plates and 16 exact horn-or-ear pair plates.

## Stable-ID replacement pack

`assets/library-v9/` contains 34 replacement objects. The files load after the starter part pack and before the three-hero pack. Each replacement keeps its published `id`, declares `libraryRevision: 9.8.0`, `authored: true`, and `runtimeGeometry: false`.

| Family | Replaced stable IDs |
|---|---|
| Bases | `base-skull`, `base-moss`, `base-blue` |
| Eyes | `eye-droopy`, `eye-beady`, `eye-crossed`, `eye-wild`, `eye-triple`, `eye-stacked` |
| Noses | `nose-warty`, `nose-skeletal`, `nose-beak`, `nose-trihole`, `nose-elephant` |
| Mouths | `mouth-gummy`, `mouth-buck`, `mouth-gapped`, `mouth-jagged`, `mouth-tongue` |
| Horns / ears | `horn-nubs`, `horn-tufted`, `horn-long`, `horn-bat`, `horn-rams` |
| Patterns | `pattern-pores`, `pattern-fur`, `pattern-cracked`, `pattern-warts`, `pattern-scales` |
| Extras | `extra-slime`, `extra-bandage`, `extra-patch`, `extra-bumps`, `extra-snot` |

The existing 21 hero replacements continue to cover the shared hero IDs used by several non-hero recipes. Together the two load-after packs cover every visible stable ID used by the 16 curated recipes.

## Exact-pair coverage

Each curated recipe publishes its exact keys in `assets/compatibility.js`:

- `pairJunctions.mouth = <base-id>|<mouth-id>`
- `pairJunctions.horns = <base-id>|<horn-or-ear-id>`

`assets/pair-junctions.js` contains ordinary static SVG plates for all 32 keys. Plates may contain cheek-colour restoration, lip-edge reinforcement, root compression, short folds, local shadows, highlights, and texture continuity. They must not contain standalone mouths, teeth, gums, heads, horns, ears, eyes, noses, or other anatomy.

The runtime selection remains deterministic:

1. choose the exact pair plate for a curated recipe or reviewed pair;
2. otherwise use the retained generic base mouth seam or horn-family seam;
3. never stack exact and generic plates at the same stage.

## Curated shuffle

The public builder now weights the 16 reviewed recipes rather than treating every compatible combination as equally production-ready. A small mutation path remains, but it preserves the exact reviewed mouth and horn pair and changes only eyes, nose, pattern, or extra. Blocked combinations remain excluded.

This is still selection among pre-drawn objects. Shuffle does not draw anatomy.

## Structured review state

`reviews/library-fidelity-v9.json` contains the 13 non-hero records. The separate `reviews/hero-fidelity-v9.json` continues to contain the three locked heroes.

Automated checks require:

- stable recipe and asset IDs
- exact pair keys
- no blocked primary combination
- current category scores at or above 4
- no regression from the recorded baseline
- findings and authored production actions
- required sizes and backgrounds
- deterministic flip-safe output
- replacement metadata and `runtimeGeometry: false`

All records intentionally remain `humanConfirmed: false`. Agent-assisted scores are triage and production guidance, not final aesthetic approval. Human acceptance must happen in `/internal/recipe-director/` while comparing the generated boards with the supplied MVP boards.

## QA output

Run:

```bash
npm ci
npm test
npm run qa
```

The workflow generates:

- `pair-junction-mouth-crops-{background}.svg/.png`
- `pair-junction-horn-crops-{background}.svg/.png`
- `pair-junction-validation-report.json`
- `library-fidelity-rollout-summary.svg/.png`
- `library-fidelity-validation-report.json`
- the existing recipe, finish, hybrid, hero, and human-review boards

## Hard boundary

Allowed runtime operations are selection, rigid translation, uniform scale, rotation, layer order, clipping, masking, mirroring, finish application, and export. The public runtime may not generate paths, infer landmarks, morph anatomy, non-uniformly distort features, or add a freehand/generative drawing system.
