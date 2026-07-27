# Monster Face Builder — Pre-Drawn v9

Monster Face Builder is a static browser app for composing approved monster artwork. It supports complete finished faces and a builder that combines fixed head, eye, nose, mouth, horn/ear, pattern, and extra assets through authored compatibility rules.

Open `index.html` in a modern browser or publish the branch through GitHub Pages.

## Source-of-truth rule

Every visible monster feature originates from an authored asset. Canvas and QA tooling may select, position, layer, transform, clip, mask, alpha-composite, frame, render, and export those assets. They must not generate anatomy or redraw feature geometry.

Randomisation is selection, not generation. QA is review of authored objects, not asset creation.

## V9 hybrid authored asset bundles

A logical asset may now opt into an authored bundle while retaining its stable parent asset ID and the existing single-SVG fallback. Bundles support full-canvas transparent PNG, WebP, genuine SVG, and SVG mask layers with deterministic roles:

1. silhouette mask
2. optional authored local shadow
3. colour underpaint
4. black linework
5. optional highlights
6. optional texture/detail

`base-bog` is the minimal fixture. Its existing SVG remains in `assets/parts/bases.js`; `assets/hybrid-bundles.js` attaches `base-bog-hybrid-v1` to the same stable parent ID. The fixture decomposes the already-authored Bog Blob artwork and does not introduce new anatomy.

`v9-hybrid-bundles.js` loads bundle layers deterministically, composites at the actual preview or export resolution, applies authored alpha and blend settings, masks only designated layers, and leaves unmasked local shadows outside the silhouette. Existing SVG-only assets continue through the original renderer unchanged.

PNG export metadata now includes the bundle contract version, stable parent ID, bundle ID, revision, ordered layer roles, and SHA-256 source hashes.

## V9 MVP fidelity baseline

`docs/MVP-FIDELITY-TARGETS.md` locks three hero recipes for the fidelity track:

- `bog-cyclops-grin` — rounded / blob silhouette
- `fuzz-fanged` — furry broken silhouette
- `imp-roar` — compact imp silhouette and wide-mouth stress test

The document records every stable asset ID, measurable art-direction targets, a 1–5 before-state scorecard, thumbnail and flip review requirements, and the boundary between authored anatomy and non-anatomical support layers.

## V8 compatibility and recipes

`assets/compatibility.js` classifies every base × eye, base × nose, base × mouth, and base × horn pairing as `approved`, `acceptable`, or `blocked`.

The builder includes 16 complete hand-directed recipes and authored per-pair placement overrides. Blocked parts are disabled, filtered before composition, and excluded from compatibility-aware shuffle.

The retained v7 assembly stages clip mouths to the authored base alpha, add six base-specific mouth seam plates, and add eight authored horn/ear root seam plates. Horns remain behind the head and the complete authored composition mirrors together when flipped.

## Expression direction

`assets/expression-direction.js` adds a fixed six-word expression vocabulary: `sleepy`, `uneasy`, `feral`, `goofy`, `stern`, and `startled`.

Every eye and mouth has authored expression tags, reviewed eye × mouth pairings are explicitly approved, and every complete recipe carries one stable expression assignment. The metadata does not alter anatomy.

## Silhouette and root direction

`assets/silhouette-direction.js` records intentional crown, cheek, jaw, and chin rhythm for all six bases. It also defines authored root profiles for every approved or acceptable base × horn/ear pairing, compatibility-specific placement corrections for weak joins, and a flip-safety contract.

The root metadata only selects authored seam treatment and rigid transforms. It does not infer landmarks, morph contours, or generate attachment geometry.

## Authored illustration finishes

Five fixed, non-anatomical full-canvas finish plates are available:

| Finish | Purpose |
|---|---|
| Etched MVP | hatching, stipple, contour accents, and highlight cuts |
| Blackwork Punch | heavier shadow masses and slash hatching |
| Screenprint Pop | halftone and registration-colour accents |
| Distressed Ink | scratches, speckle, and worn print marks |
| Clean Asset | underlying approved assets without an added finish |

## Deterministic QA

Install and run the complete review workflow with:

```bash
npm ci
npm test
npm run qa
```

`npm test` runs compatibility, expression, silhouette/root, hybrid bundle, transparent-edge, 3600×3600 export, and validation-only checks. `npm run qa` writes deterministic review artifacts to `generated/qa/`.

The existing contact-sheet generator produces SVG and PNG sheets for:

- every mouth on every base, unflipped and flipped
- every horn/ear on every base, unflipped and flipped
- every authored finish on every approved recipe
- large approved-recipe crops for junction, clipping, and finish review
- cream, white, black, and transparent backgrounds

The hybrid bundle QA adds:

- legacy single-SVG versus hybrid fixture contact sheets on all four backgrounds
- a transparent 3600×3600 fixture export
- `hybrid-bundle-validation-report.json`
- the retained main `validation-report.json`

### Hybrid validation failures

The validator reports stable bundle and layer IDs for:

- missing required layers
- duplicate layer roles or bundle IDs
- duplicate z values and non-deterministic declaration order
- invalid alpha or blend modes
- invalid dimensions or SVG viewBox
- broken or escaping source paths
- source-hash or inline-source mismatches
- invalid PNG/WebP files
- forbidden scripts, event handlers, foreign objects, runtime geometry keys, or procedural anatomy declarations

Reports use a fixed Unix-epoch timestamp and deterministic source digest.

### GitHub Actions

`.github/workflows/contact-sheet-qa.yml` runs manually and whenever assets, bundle declarations, runtime compositor, schemas, tests, or QA tooling change. It uploads the complete review set and may commit refreshed `package-lock.json` and `generated/qa/` artifacts back to the working branch.

## Included asset pack

| Family | Assets |
|---|---:|
| Complete faces | 10 |
| Blank head bases | 6 |
| Eye sets | 10 |
| Noses / snouts | 9 |
| Mouths | 9 |
| Horns / ears | 9 |
| Surface patterns | 9 |
| Extras | 9 |
| Illustration finishes | 5 |
| Mouth seam plates | 6 |
| Horn / ear root seam plates | 8 |
| Approved recipes | 16 |
| Approved expression pairings | 12 |
| Pair placement overrides | 16 |
| Silhouette-specific horn overrides | 11 |
| Hybrid logical bundles | 1 |
| Hybrid authored layers | 6 |

## Builder render order

1. horns / ears
2. blank head base or its authored hybrid bundle
3. horn / ear root seam
4. surface pattern
5. eyes
6. nose / snout
7. mouth clipped to the selected base alpha
8. base-specific mouth seam
9. extras
10. illustration finish

Hybrid bundle internal order is independent from the builder order and is declared by stable role and z value.

## Key files

- `docs/MVP-FIDELITY-TARGETS.md` — locked v9 hero recipes and visual targets
- `assets/manifest.json` — canonical inventory and render/validation contracts
- `assets/hybrid-bundles.js` — stable parent-to-bundle declarations, revisions, roles, hashes, and fixture
- `assets/hybrid-fixture/*.svg` — authored full-canvas fixture layers
- `v9-hybrid-bundles.js` — browser compositor and export metadata extension
- `scripts/hybrid-bundle-contract.js` — bundle loader, validator, metadata, and QA SVG compositor
- `scripts/hybrid-bundle-qa.js` — fixture contact sheets and 3600×3600 review export
- `schemas/hybrid-asset-bundle.schema.json` — bundle schema
- `schemas/hybrid-bundle-validation-report.schema.json` — report schema
- `tests/hybrid-bundle.test.js` — deterministic rendering, metadata, transparency, and export tests
- `assets/compatibility.js` — compatibility matrix, recipes, and pair overrides
- `assets/expression-direction.js` — authored expression direction
- `assets/silhouette-direction.js` — contour rhythm, roots, and flip safety
- `assets/parts/*.js` — authored composable objects and base slots
- `assets/finishes.js` — fixed non-anatomical finish plates
- `assets/junctions.js` — fixed non-anatomical transition plates
- `scripts/contact-sheet-qa.js` — deterministic legacy renderer and validator
- `docs/ASSET-GUIDE.md` — production and review contract

## Production direction

Production replacements may use transparent PNG, WebP, or genuine SVG exported from original layered artwork. They must retain stable parent IDs, full-canvas alignment, deterministic roles and z-order, source hashes, authored alpha, compatibility classifications, expression tags, silhouette profiles, placement overrides, junction profiles, and the locked fidelity targets.
