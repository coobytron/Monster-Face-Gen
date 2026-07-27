# Hero Asset Fidelity — v9.4

## Source and scope

The supplied MVP boards remain the visual source of truth. This pass re-authors the three locked recipes selected in `docs/MVP-FIDELITY-TARGETS.md`:

- `bog-cyclops-grin`
- `fuzz-fanged`
- `imp-roar`

The artwork is original production work based on the approved direction. Flattened reference-board images are not cropped, traced, or shipped as runtime assets.

## Stable-ID replacement model

Twenty-one visible components are replaced behind their existing published IDs:

| Family | Stable IDs |
|---|---|
| Bases | `base-bog`, `base-fuzz`, `base-imp` |
| Eyes | `eye-cyclops`, `eye-sleepy`, `eye-wide` |
| Noses | `nose-button`, `nose-hook`, `nose-piggy` |
| Mouths | `mouth-grin`, `mouth-fangs`, `mouth-roar` |
| Horns | `horn-curved`, `horn-bent`, `horn-spiky` |
| Patterns | `pattern-spots`, `pattern-stripes`, `pattern-freckles` |
| Extras | `extra-earring`, `extra-scar`, `extra-spikes` |

The replacement files live in `assets/hero-v9/` and load after the original part library. Each replacement preserves the original stable ID and inherited placement slots while replacing authored SVG artwork and adding:

- `heroRevision: 9.4.0`
- `authored: true`
- `runtimeGeometry: false`
- `hero-v9` classification tag

Non-hero assets remain in the original packs and continue through the existing compatibility, shuffle, seam-fallback, and export paths.

## Art-direction changes

The replacement set increases:

- irregular crown, cheek, jaw, and chin rhythm
- primary, secondary, and tertiary line-weight separation
- asymmetrical lids, pupils, sockets, brows, and eye shadows
- lip mass, gum ridges, varied teeth cadence, fangs, tongue volume, and mouth-corner ownership
- horn segmentation, wear, highlights, and root compression
- controlled colour variation within each hero palette
- cast shadows, edge highlights, pores, warts, freckles, scratches, fur marks, and print-like distress
- first-read expression at 96 px and feature recognition at 48 px

The three characters deliberately share contour weight, warm off-white anatomy colour, restrained accent colours, and dense-but-localised texture so they read as one illustration family.

## Hybrid bundle

`base-bog` remains the hybrid-bundle production example. `base-bog-hybrid-v2` retains stable parent ID `base-bog` and revision `2.0.0` with six authored layers:

1. silhouette mask
2. local shadow
3. colour underpaint
4. black linework
5. highlights
6. texture detail

The inline SVG fallback and hybrid composition are validated for deterministic pixel equivalence, clean transparent corners, source hashes, and 3600 × 3600 export.

## Pair integration

The six exact pair plates from issue #17 remain mandatory:

- `base-bog|mouth-grin`
- `base-bog|horn-curved`
- `base-fuzz|mouth-fangs`
- `base-fuzz|horn-bent`
- `base-imp|mouth-roar`
- `base-imp|horn-spiky`

The new anatomy is authored to meet those plates. Pair plates remain non-anatomical transition layers and replace, rather than stack with, generic seams for the locked heroes.

## Runtime boundary

Allowed runtime operations:

- select stable authored IDs
- apply approved rigid placement transforms
- compose deterministic layers
- clip mouths to authored base alpha
- select exact pair plates or generic fallbacks
- mask and blend finishes
- mirror the full composition
- export PNG and embedded recipe metadata

Forbidden runtime operations:

- Rough.js or sketch effects that create anatomy
- procedural paths or anatomy construction
- inferred landmarks
- path morphing
- non-uniform anatomy deformation
- cropped or flattened MVP artwork

## Review and validation

Run:

```bash
npm ci
npm test
npm run qa
```

`tests/hero-fidelity.test.js` validates stable identity, replacement coverage, metadata, recipe completeness, pair-junction coverage, non-hero inventory, and the runtime-geometry boundary.

`scripts/hero-fidelity-qa.js` generates:

- `hero-fidelity-summary-{background}.svg/png`
- `hero-fidelity-{recipe-id}-{background}.svg/png`
- `hero-fidelity-validation-report.json`

Each hero board includes:

- locked baseline
- near-final clean artwork
- horizontally flipped artwork
- Etched MVP finish
- 25% review
- 96 px thumbnail
- 48 px thumbnail

Boards are generated on cream, white, black, and transparent backgrounds. Human review targets remain at least 4/5 for silhouette strength, attachment integration, expression read, detail density, and thumbnail read.
