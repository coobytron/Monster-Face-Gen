# Monster Face Builder — Pre-Drawn v8

Monster Face Builder is a static browser app for composing approved monster artwork. It supports complete finished faces and a builder that combines fixed head, eye, nose, mouth, horn/ear, pattern, and extra assets through authored compatibility rules.

Open `index.html` in a modern browser or publish the branch through GitHub Pages.

## Source-of-truth rule

Every visible monster feature originates from an authored asset. Canvas and QA tooling may select, position, layer, transform, clip, mask, apply approved finishing and junction plates, frame, render, and export those assets. They must not generate anatomy or redraw feature geometry.

Randomisation is selection, not generation. QA is review of authored objects, not asset creation.

## V8 compatibility and recipes

`assets/compatibility.js` classifies every base × eye, base × nose, base × mouth, and base × horn pairing as `approved`, `acceptable`, or `blocked`.

The builder includes 16 complete hand-directed recipes and authored per-pair placement overrides. Blocked parts are disabled, filtered before composition, and excluded from compatibility-aware shuffle.

The retained v7 assembly stages clip mouths to the authored base alpha, add six base-specific mouth seam plates, and add eight authored horn/ear root seam plates. Horns remain behind the head and the complete authored composition mirrors together when flipped.

## Expression direction

`assets/expression-direction.js` adds a fixed six-word expression vocabulary: `sleepy`, `uneasy`, `feral`, `goofy`, `stern`, and `startled`.

Every eye and mouth has authored expression tags, at least six reviewed eye × mouth pairings are explicitly approved, and every complete recipe carries one stable expression assignment. The metadata does not alter anatomy; it preserves art direction for review, shuffle curation, exports, and future asset replacements.

## Silhouette and root direction

`assets/silhouette-direction.js` records intentional crown, cheek, jaw, and chin rhythm for all six bases. It also defines authored root profiles for every approved or acceptable base × horn/ear pairing, compatibility-specific placement corrections for the weakest joins, and a flip-safety contract.

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

## Deterministic contact-sheet QA

Install and run the complete review workflow with:

```bash
npm ci
npm test
npm run qa
```

`npm test` runs compatibility, expression, silhouette/root, and validation-only checks. `npm run qa` then writes deterministic review artifacts to `generated/qa/`.

The generator produces SVG and PNG sheets for:

- every mouth on every base, unflipped and flipped
- every horn/ear on every base, unflipped and flipped
- every authored finish on every approved recipe
- large approved-recipe crops for junction, clipping, and finish review
- cream, white, black, and transparent backgrounds

Each cell carries stable base and asset IDs plus the compatibility state. The tooling only evaluates and composes repository-authored SVG objects.

### Machine-readable validation

`generated/qa/validation-report.json` follows `schemas/qa-validation-report.schema.json` and reports:

- missing, duplicate, unknown, or unclassified stable IDs
- missing metadata or `0 0 600 600` viewBox
- blocked or unknown approved-recipe combinations
- missing mouth/base or horn/root junction coverage
- invalid render z-order
- any manifest state that permits runtime anatomy generation

The report uses a deterministic source digest and a fixed epoch timestamp so unchanged authored inputs produce unchanged output.

### GitHub Actions

`.github/workflows/contact-sheet-qa.yml` runs manually and whenever asset, compatibility, manifest, schema, or QA tooling files change. It uploads the review set as a workflow artifact. Push and manual runs can commit refreshed `package-lock.json` and `generated/qa/` artifacts back to the working branch.

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
| **Total authored visual objects** | **90** |

## Builder render order

1. horns / ears
2. blank head base
3. horn / ear root seam
4. surface pattern
5. eyes
6. nose / snout
7. mouth clipped to the selected base alpha
8. base-specific mouth seam
9. extras
10. illustration finish

## Key files

- `assets/manifest.json` — canonical inventory, render contract, and QA contract
- `assets/compatibility.js` — compatibility matrix, recipes, and pair overrides
- `assets/expression-direction.js` — authored expression vocabulary and eye × mouth pairing direction
- `assets/silhouette-direction.js` — head contour rhythm, root profiles, pair corrections, and flip safety
- `assets/parts/*.js` — authored composable objects and base slots
- `assets/finishes.js` — fixed non-anatomical finish plates
- `assets/junctions.js` — fixed non-anatomical transition plates
- `scripts/contact-sheet-qa.js` — deterministic renderer and validator
- `schemas/qa-validation-report.schema.json` — report schema
- `generated/qa/` — generated review sheets and report
- `tests/compatibility.test.js` — matrix and shuffle validation
- `tests/art-direction.test.js` — expression, silhouette, root-profile, and flip-safety validation
- `docs/ASSET-GUIDE.md` — production and review contract
- `docs/GITHUB_VECTOR_AGENT_HANDOFF.md` — agent workflow architecture

## Production direction

Future replacements may use transparent PNG, WebP, or SVG exported from original layered artwork, provided stable IDs, full-canvas alignment, authored z-order, compatibility classifications, expression tags, silhouette profiles, placement overrides, and junction profiles remain intact.
