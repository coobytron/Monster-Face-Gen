# Monster Face Builder — Pre-Drawn v8

Monster Face Builder is a static browser app for composing approved monster artwork. It supports two curated workflows:

1. **Complete Faces** — select one of ten finished monster illustrations.
2. **Build a Monster** — combine fixed head, eye, nose, mouth, horn/ear, pattern, and extra assets through authored compatibility rules.

Open `index.html` in a modern browser or publish the branch through GitHub Pages. No framework, server, API, or build step is required.

## Source-of-truth rule

Every visible monster feature originates from an authored asset. Canvas may select, position, layer, transform, clip, mask, apply approved finishing and junction plates, frame, and export the artwork. It must not generate anatomy or redraw feature geometry.

Randomisation is selection, not generation.

## v8 compatibility and recipe pass

V8 replaces universal mix-and-match behavior with an authored compatibility system based on the supplied MVP boards.

### Compatibility matrix

`assets/compatibility.js` classifies every base × eye, base × nose, base × mouth, and base × horn pairing as:

- `approved` — preferred art-directed pairing
- `acceptable` — safe secondary pairing
- `blocked` — visually cramped, floating, overly generic, or incompatible

Blocked parts are disabled in the library for the active base and are filtered from rendering as a final safety layer. Changing the base automatically repairs any newly blocked selection.

### Approved recipes

The builder includes 16 complete hand-directed recipes. Builder shuffle starts from this library 76% of the time. The remaining shuffles mutate one feature while staying inside the selected base’s approved or acceptable family.

The recipes preserve the silhouette and expression language of the MVP boards while keeping every visible feature fully pre-drawn.

### Per-pair placement overrides

Universal base slots remain the default. `placementOverrides` adds small authored x/y/scale/rotation adjustments for specific base/part pairs where the universal slot is not sufficient.

These overrides only position existing full-canvas assets. They do not generate, deform, or infer anatomy.

## v7 assembly refinement retained

### Mouth integration

- All visible mouth assets use authored aperture clipping.
- The complete mouth layer is alpha-clipped to the selected authored head base.
- Six fixed base-specific cheek and lower-lip seam plates cover hard mouth corners and restore local contour continuity.

### Horn and ear integration

- Horn and ear assets include authored root flares and root texture.
- Eight fixed horn-root seam plates add overlap shadows and contour folds.
- Horns remain behind the head and stay attached after horizontal flip because the complete authored composition transform is mirrored together.

## Authored illustration finishes

Five non-anatomical full-canvas finish plates remain available:

| Finish | Purpose |
|---|---|
| Etched MVP | default hatching, stipple, contour accents, and highlight cuts |
| Blackwork Punch | heavier vector shadow masses and slash hatching |
| Screenprint Pop | halftone dots and controlled registration-colour accents |
| Distressed Ink | scratches, speckle, and worn print marks |
| Clean Asset | shows the underlying approved asset without an added finish |

## Included asset packs

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
| Composable anatomy objects | 61 |
| Illustration finishes | 5 |
| Mouth seam plates | 6 |
| Horn / ear root seam plates | 8 |
| Approved complete recipes | 16 |
| Pair placement overrides | 16 |
| **Total authored visual objects** | **90** |

Compatibility metadata and recipes reference the existing stable visual-object IDs and do not add generated anatomy.

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

## Builder behaviour

- Switch between complete-face and authored-parts modes
- Browse feature families through category tabs
- See approved, acceptable, and blocked status for the active base
- Use base slots plus authored per-pair placement overrides
- Apply the v7 assembly integration pass
- Select one of five authored illustration finishes
- Shuffle from approved recipes or compatible mutations only
- Drag, scale, rotate, flip, frame, caption, and apply print treatments
- Save up to eight comparison versions
- Store favourites locally
- Export transparent or paper-backed 3600 × 3600 PNGs

## PNG recipe metadata

Every exported PNG receives a `tEXt` chunk with the keyword `monsterFaceState`.

Version 8 builder metadata includes:

- selected stable asset IDs and names
- complete part recipe
- approved recipe ID when applicable
- compatibility state for each base/feature pair
- active per-pair placement overrides
- selected finishing-plate metadata
- assembly version and derived mouth / horn seam IDs
- composition position, scale, rotation, and flip
- paper, frame, treatment, caption, and transparency settings
- export timestamp

The PNG stores a compact editable recipe pointing to canonical asset IDs. It does not duplicate raw SVG source.

## Validation

Run:

```bash
node tests/compatibility.test.js
```

The test verifies:

- complete matrix coverage for all stable IDs
- no duplicate classifications
- all 16 approved recipes avoid blocked pairs
- narrow bases block the widest mouth unless an authored exception exists
- placement override presence for approved wide-mouth exceptions
- 100 compatibility-aware shuffle samples contain no blocked selections

## Files

- `index.html` — static interface and script loading order
- `app-core.js` — state, library, builder, history, and favourites
- `app.js` — base Canvas composition, export, and controls
- `v6-art-finish.js` — finish selection and alpha-masked finishing compositor
- `v7-integration.js` — mouth/base clipping, junction-stage rendering, and v7 metadata
- `v8-compatibility.js` — compatibility-aware selection, repair, shuffle, placement, and metadata
- `assets/compatibility.js` — matrix, approved recipes, and pair overrides
- `png-metadata.js` — JSON-in-PNG metadata writer
- `assets/faces/` — ten complete pre-drawn monsters
- `assets/parts/*.js` — seven anatomy families containing 61 composable authored objects and base slots
- `assets/finishes.js` — five fixed non-anatomical vector finishing plates
- `assets/junctions.js` — fourteen fixed non-anatomical transition plates
- `assets/manifest.json` — canonical pack inventory and render contract
- `tests/compatibility.test.js` — matrix and shuffle validation
- `docs/ASSET-GUIDE.md` — production contract for future art packs

## Production direction

Future production replacements may use transparent PNG, WebP, or SVG exported from original layered artwork, provided stable IDs, full-canvas alignment, authored z-order, compatibility classifications, pair overrides, and junction profiles remain intact.
