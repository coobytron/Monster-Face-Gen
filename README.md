# Monster Face Builder — Pre-Drawn v7

Monster Face Builder is a static browser app for composing approved monster artwork. It supports two curated workflows:

1. **Complete Faces** — select one of ten finished monster illustrations.
2. **Build a Monster** — combine fixed head, eye, nose, mouth, horn/ear, pattern, and extra assets.

Open `index.html` in a modern browser or publish the branch through GitHub Pages. No framework, server, API, or build step is required.

## Source-of-truth rule

Every visible monster feature originates from an authored asset. Canvas may select, position, layer, transform, clip, mask, apply approved finishing and junction plates, frame, and export the artwork. It must not generate anatomy or redraw feature geometry.

Randomisation is selection, not generation.

## v7 assembly-refinement pass

V7 focuses on the places where separate pre-drawn objects meet. The attached MVP boards remain the visual source of truth: features should feel embedded in one heavy, hand-inked character rather than laid on top as independent stickers.

### Mouth integration

- All eight visible mouth assets were redrawn with irregular contours, denser gum and tooth detail, and fixed SVG clip paths.
- Teeth, gums, and tongue artwork are clipped to the authored mouth aperture, preventing interior vectors from ending abruptly outside the black mouth shape.
- During builder rendering, the complete mouth layer is additionally alpha-clipped to the selected authored head base.
- Six fixed base-specific cheek and lower-lip seam plates cover hard mouth corners and restore the base colour, contour line, and local shadow around the join.

### Horn and ear integration

- All eight visible horn/ear assets now include wider root flares, more authored segmentation, and stronger texture near the attachment point.
- Eight fixed horn-root seam plates render after the head base, adding overlap shadows, contour folds, and short highlight marks at the exact authored roots.
- Horns remain behind the head. The seam plate only resolves the overlap; it does not create or deform horn anatomy.

## Authored illustration finishes

The five v6 full-canvas finish plates remain available:

| Finish | Purpose |
|---|---|
| Etched MVP | default hatching, stipple, contour accents, and highlight cuts |
| Blackwork Punch | heavier vector shadow masses and slash hatching |
| Screenprint Pop | halftone dots and controlled registration-colour accents |
| Distressed Ink | scratches, speckle, and worn print marks |
| Clean Asset | shows the underlying approved asset without an added finish |

The selected plate is transformed with the monster, alpha-masked to the completed approved artwork, and blended non-destructively.

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
| **Total authored objects** | **90** |

The composable pack includes explicit `none` objects where removing a layer is useful.

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
- Use per-base authored placement slots for small alignment adjustments
- Apply the automatic v7 assembly pass to builder combinations
- Select one of five authored illustration finishes
- Shuffle approved assets without generating geometry
- Drag, scale, rotate, flip, frame, caption, and apply print treatments
- Save up to eight comparison versions
- Store favourites locally
- Export transparent or paper-backed 3600 × 3600 PNGs

## PNG recipe metadata

Every exported PNG receives a `tEXt` chunk with the keyword `monsterFaceState`.

Version 7 metadata includes:

- complete-face or authored-parts mode
- selected asset IDs and names
- complete part recipe
- selected finishing-plate ID and metadata
- assembly version and derived mouth / horn seam IDs
- composition position, scale, rotation, and flip
- paper, frame, treatment, caption, and transparency settings
- export timestamp

The raw SVG source is not duplicated inside the metadata. The PNG stores a compact editable recipe that points back to canonical asset IDs.

## Files

- `index.html` — static interface and v7 script loading order
- `styles.css` — responsive visual system
- `v6-art-finish.css` — poster framing and finish-selector styling
- `app-core.js` — state, library, builder, history, and favourites
- `app.js` — base Canvas composition, export, and controls
- `v6-art-finish.js` — finish selection and alpha-masked finishing compositor
- `v7-integration.js` — mouth/base clipping, junction-stage rendering, and v7 metadata
- `png-metadata.js` — JSON-in-PNG metadata writer
- `assets/faces/` — ten complete pre-drawn monsters
- `assets/parts/*.js` — seven anatomy families containing 61 composable authored objects and base slots
- `assets/finishes.js` — five fixed non-anatomical vector finishing plates
- `assets/junctions.js` — fourteen fixed non-anatomical mouth and horn/ear transition plates
- `assets/manifest.json` — canonical pack inventory and render contract
- `docs/ASSET-GUIDE.md` — production contract for future art packs

## Production direction

Future production replacements may use transparent PNG, WebP, or SVG exported from original layered artwork, provided stable IDs, full-canvas alignment, authored z-order, slot metadata, and compatible junction profiles remain intact.
