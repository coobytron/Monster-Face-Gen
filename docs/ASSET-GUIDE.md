# Pre-Drawn Asset Guide — v9

## Core rule

Every visible monster feature must originate from an authored asset. Canvas and repository tooling may position, layer, clip, mask, alpha-composite, blend, frame, transform, render, and export those assets, but must not synthesize monster anatomy with runtime paths or inferred geometry.

Randomisation is selection, not generation. Contact-sheet QA is review, not creation.

## Shared authored asset contract

All composable anatomy, finishes, junctions, compatibility data, expression data, silhouette data, and hybrid bundle layers use stable IDs and a shared `0 0 600 600` full-canvas coordinate system.

Recommended production sources:

- transparent PNG, WebP, or genuine SVG
- square 2048 × 2048 or larger working canvas, exported into the shared 600-unit coordinate system
- sRGB colour profile
- premultiplied-alpha-safe edges
- no baked paper background, labels, borders, or crop marks
- at least 120 px transparent padding in the working source
- published parent IDs remain stable

A published ID must not be renamed. Replace the art behind the same ID or introduce a new ID.

## Hybrid authored bundle contract

A logical asset may remain a single inline SVG or opt into a layered bundle declared in `assets/hybrid-bundles.js`. Opt-in is attached to the existing logical asset through `bundleId`; the stable parent asset ID remains the identity used by recipes, compatibility, state, QA, and exports.

The existing inline SVG remains mandatory as the backwards-compatible fallback unless a later migration explicitly changes that policy.

### Allowed layer roles

Bundle roles are declared once and sorted deterministically by numeric `z`, role order, and source path:

1. `silhouette-mask` — required alpha mask
2. `local-shadow` — optional authored shadow that may remain outside the mask
3. `colour-underpaint` — required colour mass
4. `black-linework` — required authored contour and internal linework
5. `highlights` — optional authored highlight plate
6. `texture-detail` — optional authored texture/detail plate

The minimum bundle contains `silhouette-mask`, `colour-underpaint`, and `black-linework` exactly once. Duplicate roles and duplicate `z` values are validation failures.

### Allowed source kinds

- `svg`
- `svg-mask`
- `png`
- `webp`

Every layer must use the bundle's full-canvas dimensions and `0 0 600 600` viewBox. Raster layers must be exactly 600 × 600 in the published bundle. SVG layers must be genuine authored SVG with no scripts, event handlers, or `foreignObject` content.

### Alpha, mask, and blend rules

- `alpha` must be between 0 and 1.
- Allowed blend modes are `source-over`, `multiply`, `screen`, and `overlay`.
- Layers use `masked: true` by default.
- Authored local shadows may use `masked: false`.
- The silhouette mask is applied with destination-in alpha compositing after masked layers are assembled.
- The compositor rasterizes at the actual preview or export draw size, so the same bundle supports the 1600 preview and 3600 × 3600 export without a fixed 600 px intermediate.

### Stable IDs, revisions, and hashes

Every bundle must declare:

- stable bundle ID
- stable parent asset ID
- semantic bundle revision
- ordered layer roles and z values
- source path and source kind
- SHA-256 source hash for every layer
- `runtimeGeometry: false`

PNG metadata includes the contract version, parent ID, bundle ID, revision, ordered layer metadata, and source hashes. Updating any source layer requires updating its hash and normally incrementing the bundle revision.

### Forbidden runtime geometry

Bundle declarations and runtime code must not contain procedural drawing commands, runtime path data, inferred landmarks, geometry generators, morph instructions, or anatomy construction recipes. Runtime code may only load and composite authored pixels and paths.

The validator rejects geometry-like declaration keys, escaping or broken paths, scripts, event handlers, invalid SVG content, and mismatched inline fixture sources.

## Minimal fixture

`base-bog-hybrid-v1` demonstrates the contract by decomposing the existing authored `base-bog` SVG into mask, local shadow, underpaint, linework, highlight, and texture plates. It retains parent ID `base-bog` and introduces no new anatomy.

The fixture includes inline SVG copies so opening `index.html` directly from disk remains supported. QA verifies that each inline copy exactly matches the repository source file hash.

## Compatibility contract

Every base must classify every stable eye, nose, mouth, and horn/ear ID in `assets/compatibility.js` exactly once as:

- `approved` — preferred art-directed pairing
- `acceptable` — safe alternate pairing
- `blocked` — visually incompatible pairing

Blocked anatomy must be disabled for manual selection, repaired after a base change, filtered before rendering, and excluded from shuffle.

Patterns and extras are globally compatible in the current pack.

## Expression contract

`assets/expression-direction.js` preserves authored emotional intent without changing geometry. The vocabulary is `sleepy`, `uneasy`, `feral`, `goofy`, `stern`, and `startled`.

Every eye and mouth ID has authored expression tags. Every approved complete recipe carries one stable expression assignment supported by its selected eye or mouth.

Expression metadata may guide curation, QA labels, future shuffle weighting, and export metadata. It must not redraw eyelids, pupils, gums, lips, teeth, or any anatomy.

## Approved recipe contract

A recipe is a complete stable-ID selection. Recipes are authored compositions, not generated presets. Every recipe must resolve to known IDs, avoid blocked primary pairs, carry a reviewed expression assignment, and remain legible at thumbnail size.

Recipe IDs remain stable because exported PNG metadata and QA reports may reference them.

## V9 fidelity audit contract

`docs/MVP-FIDELITY-TARGETS.md` locks `bog-cyclops-grin`, `fuzz-fanged`, and `imp-roar` as the common review set. Later fidelity changes must preserve their stable IDs and use the same score categories and review sizes.

The baseline is descriptive review metadata, not runtime drawing instruction.

## Placement overrides

Per-pair placement overrides use `<base-id>|<part-id>` and may only translate, uniformly scale, or rotate. They may not morph, infer landmarks, non-uniformly distort anatomy, or create geometry.

## Silhouette contract

`assets/silhouette-direction.js` records intended crown, cheek, jaw, and chin rhythm as review metadata. Every visible approved or acceptable horn/ear pairing requires a known root profile, seam profile, flip-safe treatment, and rigid pair override where the generic slot is insufficient.

Runtime code may only select authored seams and apply approved rigid transforms.

## Junction contract

A junction is a fixed full-canvas transition plate. It may contain overlap shadows, cheek-colour cover shapes, lip-edge cover shapes, horn-root contour folds, short highlights, and local distress. It must not contain standalone anatomy.

Every base requires a mouth seam. Every visible horn/ear requires a matching horn-root seam. `horn-none` is the only exception.

Mouth interiors remain inside authored apertures and are clipped to the selected base alpha. Horns render behind the base. The complete authored composition and transforms mirror together when flipped.

## Finish contract

A finish is a fixed, non-anatomical full-canvas plate containing hatching, stipple, blackwork, registration accents, scratches, or distress. It renders after approved art and junction composition and may be alpha-masked to the composed artwork.

## Builder render order

1. horns / ears
2. blank head base or stable-parent hybrid bundle
3. horn / ear root seam
4. surface pattern
5. eyes
6. nose / snout
7. mouth clipped to selected base alpha
8. base-specific mouth seam
9. extras
10. illustration finish

Changing this order is a validation failure. Hybrid bundle internal order is separately declared by roles and z values.

## Deterministic review workflow

Run:

```bash
npm ci
npm test
npm run qa
```

The test workflow validates compatibility, expression assignments, silhouette profiles, root coverage, flip safety, hybrid bundle identity, source hashes, required roles, order, alpha, transparent edges, and 3600 × 3600 export support.

The workflow generates SVG and PNG review sheets in `generated/qa/` for the existing matrices and for the hybrid fixture on cream, white, black, and transparent backgrounds.

## Machine-readable validation

`generated/qa/validation-report.json` follows `schemas/qa-validation-report.schema.json`.

`generated/qa/hybrid-bundle-validation-report.json` follows `schemas/hybrid-bundle-validation-report.schema.json` and reports:

- duplicate or missing bundle IDs and stable parent IDs
- missing bundle revisions
- missing required roles and duplicate roles
- invalid source kinds, alpha, or blend modes
- non-deterministic ordering or duplicate z values
- invalid dimensions or viewBox
- broken paths and invalid PNG/WebP sources
- source-hash and inline-source mismatches
- scripts, event handlers, foreign objects, runtime geometry, or procedural declarations

Both reports use stable digests and a fixed Unix-epoch timestamp so unchanged authored inputs produce byte-stable output.

## Review expectations

1. Inspect every asset on cream, white, black, and transparent backgrounds.
2. Confirm line weight and detail density match the supplied MVP boards.
3. Check thumbnail legibility and eye-first hierarchy.
4. Review tooth cadence, gum ridges, cheek compression, lower-lip ownership, mouth corners, and clipping.
5. Review crown, cheek, jaw, and chin rhythm before internal details.
6. Review horn roots before and after horizontal flip at 100%, 25%, and thumbnail scale.
7. Confirm blocked pairs never appear in approved recipes.
8. Confirm every approved recipe carries one expression tag.
9. Inspect finishes only on approved recipes.
10. Keep generated review artifacts with asset-changing pull requests.
11. Confirm bundle layers remain full-canvas aligned and ordered.
12. Compare hybrid output at preview scale and 3600 × 3600 export.
13. Inspect transparent edges against cream, white, black, and checkerboard backgrounds.
14. Confirm fixture or production bundles retain the stable parent ID and metadata hashes.
15. Score the three locked heroes using `docs/MVP-FIDELITY-TARGETS.md`.

## GitHub Actions

`.github/workflows/contact-sheet-qa.yml` runs manually and on changes to assets, bundle declarations, runtime compositor, schemas, tests, package scripts, and QA tooling. It uploads the generated review set and may commit refreshed artifacts to the branch.

## Source of truth

The supplied MVP boards define the approved families, tone, silhouette, expression language, and attachment quality. Production assets should come from underlying layered artwork whenever available rather than crops from flattened reference sheets.
