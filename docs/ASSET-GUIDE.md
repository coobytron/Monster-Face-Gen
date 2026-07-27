# Pre-Drawn Asset Guide — v8

## Core rule

Every visible monster feature must originate from an authored asset. Canvas and repository tooling may position, layer, clip, mask, blend, frame, transform, render, and export those assets, but must not synthesize monster anatomy with runtime paths or inferred geometry.

Randomisation is selection, not generation. Contact-sheet QA is review, not creation.

## Authored asset contract

All composable anatomy, finishes, junctions, compatibility data, expression data, and silhouette data use stable IDs and a shared `0 0 600 600` full-canvas coordinate system.

Recommended production replacements:

- transparent PNG, WebP, or genuine SVG source
- square 2048 × 2048 working canvas
- sRGB colour profile
- premultiplied-alpha-safe edges
- no baked paper background, labels, borders, or crop marks
- at least 120 px transparent padding
- published IDs remain stable

A published ID must not be renamed. Replace the art behind the same ID or introduce a new ID.

## Compatibility contract

Every base must classify every stable eye, nose, mouth, and horn/ear ID in `assets/compatibility.js` exactly once as:

- `approved` — preferred art-directed pairing
- `acceptable` — safe alternate pairing
- `blocked` — visually incompatible pairing

Blocked anatomy must be disabled for manual selection, repaired after a base change, filtered before rendering, and excluded from shuffle.

Patterns and extras are globally compatible in the current pack.

## Expression contract

`assets/expression-direction.js` preserves the authored emotional intent of the part library without changing geometry.

The current vocabulary is:

- `sleepy`
- `uneasy`
- `feral`
- `goofy`
- `stern`
- `startled`

Every eye and mouth ID has zero or more expression tags. Reviewed eye × mouth pairings may be marked `approved`, while shared-tag combinations are `acceptable`. Every approved complete recipe must carry one stable expression assignment that is supported by its selected eye or mouth.

Expression metadata may guide curation, QA labels, future shuffle weighting, and export metadata. It must not procedurally redraw eyelids, pupils, gums, lips, teeth, or any other anatomy.

## Approved recipe contract

A recipe is a complete stable-ID selection. Recipes are authored compositions, not generated presets. Every recipe must resolve to known IDs, avoid blocked primary pairs, carry a reviewed expression assignment, and remain legible at thumbnail size.

Recipe IDs remain stable because exported PNG metadata and QA reports may reference them.

## V9 fidelity audit contract

`docs/MVP-FIDELITY-TARGETS.md` locks three approved recipes as the common review set for the v9 fidelity track:

- `bog-cyclops-grin`
- `fuzz-fanged`
- `imp-roar`

Later fidelity changes must preserve every stable ID in those recipes, compare before and after states at matching scale and background, and score the same six categories: silhouette strength, attachment integration, expression read, detail density, thumbnail read, and MVP similarity.

The locked baseline is descriptive review metadata. It may guide asset replacement, curation, QA, and issue acceptance, but it must not be interpreted as runtime drawing instructions.

## Placement overrides

Per-pair placement overrides use the key `<base-id>|<part-id>` and may only:

- translate x/y
- uniformly scale
- rotate

Overrides may not morph, infer landmarks, non-uniformly distort anatomy, or create geometry.

## Silhouette contract

`assets/silhouette-direction.js` records the intended outer-contour rhythm for each base through authored descriptors for crown, cheek, jaw, and chin. These descriptors are review metadata, not runtime contour instructions.

Every visible approved or acceptable horn/ear pairing requires:

- a known authored root profile
- a compatibility-specific seam profile
- flip-safe treatment
- a rigid pair override where the generic slot is insufficient

Blocked pairings do not require a root profile. `horn-none` is treated as inherently safe.

Silhouette metadata must not generate paths, infer attachment landmarks, morph the head edge, or create seam geometry. Runtime code may only select existing authored seams and apply approved rigid transforms.

## Junction contract

A junction is a fixed full-canvas transition plate. It may contain overlap shadows, cheek-colour cover shapes, lip-edge cover shapes, horn-root contour folds, short highlights, and local distress.

A junction must not contain standalone anatomy. Every base requires a mouth seam. Every visible horn/ear requires a matching horn-root seam. `horn-none` is the only horn selection that does not require a root seam.

Mouth interiors remain inside authored apertures and are clipped to the selected base alpha. Horns render behind the base. The complete authored composition and junction transforms mirror together when flipped.

## Finish contract

A finish is a fixed, non-anatomical full-canvas plate containing hatching, stipple, blackwork, registration accents, scratches, or distress. It renders after the approved art and junction composition and may be alpha-masked to the composed artwork.

## Render order

1. horns / ears
2. blank head base
3. horn / ear root seam
4. surface pattern
5. eyes
6. nose / snout
7. mouth clipped to selected base alpha
8. base-specific mouth seam
9. extras
10. illustration finish

Changing this order is a validation failure.

## Deterministic review workflow

Run:

```bash
npm ci
npm test
npm run qa
```

The test workflow validates compatibility, expression assignments, silhouette profiles, root coverage, flip safety, and the machine-readable QA contract.

The workflow generates SVG and PNG contact sheets in `generated/qa/` for:

- mouth × base, including all blocked, acceptable, and approved pairs
- horn/ear × base
- unflipped and horizontally flipped variants
- every finish on every approved recipe
- large approved-recipe crops for join and edge inspection
- cream, white, black, and transparent backgrounds

Every review cell displays stable IDs and compatibility state. Rendering composes only authored repository assets.

## Machine-readable validation

`generated/qa/validation-report.json` follows `schemas/qa-validation-report.schema.json`.

Validation must report asset IDs for:

- missing or duplicate IDs
- unknown IDs and incomplete compatibility coverage
- blocked approved-recipe combinations
- missing expression assignments or unsupported recipe expressions
- missing metadata or `viewBox="0 0 600 600"`
- missing mouth/base or horn/root junctions
- missing silhouette profiles or flip-unsafe root pairings
- invalid z-order
- any manifest state that permits runtime anatomy generation

The report uses a stable digest of the manifest, IDs, and recipes. Its timestamp is fixed to the Unix epoch so unchanged inputs create byte-stable output.

## Review expectations

1. Inspect every asset on cream, white, black, and transparent backgrounds.
2. Confirm line weight and detail density match the supplied MVP boards.
3. Check thumbnail legibility and confirm the eyes remain the first-read feature.
4. Review tooth cadence, gum ridges, cheek compression, lower-lip ownership, mouth corners, and clipping.
5. Review crown, cheek, jaw, and chin rhythm before internal details.
6. Review horn roots before and after horizontal flip at 100%, 25%, and thumbnail scale.
7. Confirm blocked pairs are visibly labelled and never appear in approved recipes.
8. Confirm every approved recipe carries one of the six expression tags.
9. Inspect authored finishes only on approved recipes.
10. Keep generated review artifacts with asset-changing pull requests when appropriate.
11. Run the compatibility-aware shuffle test with no blocked selections.
12. Confirm finish and junction plates remain non-anatomical by themselves.
13. For v9 fidelity work, score all three locked heroes using `docs/MVP-FIDELITY-TARGETS.md` and include matching before/after review crops.

## GitHub Actions

`.github/workflows/contact-sheet-qa.yml` runs manually and on changes to assets, compatibility data, expression/silhouette direction, the manifest, schemas, and QA scripts. It uploads the generated review set and may commit refreshed review artifacts back to the current branch.

## Source of truth

The supplied MVP boards define the approved families, tone, silhouette, expression language, and attachment quality. Production assets should come from underlying layered artwork whenever available rather than crops from a flattened reference sheet.