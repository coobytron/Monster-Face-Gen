# Monster Face Builder — Pre-Drawn v6

Monster Face Builder is a static browser app for composing approved monster artwork. It supports two curated workflows:

1. **Complete Faces** — select one of ten finished monster illustrations.
2. **Build a Monster** — combine fixed head, eye, nose, mouth, horn/ear, pattern, and extra assets.

Open `index.html` in a modern browser or publish the branch through GitHub Pages. No framework, server, API, or build step is required.

## Source-of-truth rule

Every visible monster feature originates from an authored asset. Canvas may select, position, layer, transform, mask, apply approved finishing plates, frame, and export the artwork. It must not generate anatomy or redraw feature geometry.

Randomisation is selection, not generation.

## v6 art-direction pass

This pass moves the implementation closer to the approved MVP by adding a denser, more graphic finishing system while preserving the fully pre-drawn architecture.

The visual reference study focused on:

- the attached MVP boards: warm paper, bold silhouettes, irregular ink, dense surface detail, imperfect registration, and expressive colour
- Hydro74’s published vector work: strong blackwork, compact silhouette design, controlled detail density, ornamental line systems, and screen-print energy

The implementation does not copy a specific Hydro74 illustration. It translates those broad vector and printmaking principles into original, fixed finishing assets for this project.

### Authored illustration finishes

Five fixed full-canvas SVG plates are included:

| Finish | Purpose |
|---|---|
| Etched MVP | default hatching, stipple, contour accents, and highlight cuts |
| Blackwork Punch | heavier vector shadow masses and slash hatching |
| Screenprint Pop | halftone dots and controlled registration-colour accents |
| Distressed Ink | scratches, speckle, and worn print marks |
| Clean Asset | shows the underlying approved asset without an added finish |

The selected plate is transformed with the monster, alpha-masked to the completed approved artwork, and blended non-destructively. The plate cannot create eyes, mouths, horns, heads, teeth, or any other anatomy.

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
| **Total authored objects** | **76** |

The composable pack includes explicit `none` objects where removing a layer is useful.

## Builder behaviour

- Switch between complete-face and authored-parts modes
- Browse feature families through category tabs
- Layer parts in the fixed authored order: horns, base, pattern, eyes, nose, mouth, extras
- Use per-base authored placement slots for small alignment adjustments
- Select one of five authored illustration finishes
- Shuffle approved assets without generating geometry
- Drag, scale, rotate, flip, frame, caption, and apply print treatments
- Save up to eight comparison versions
- Store favourites locally
- Export transparent or paper-backed 3600 × 3600 PNGs

## PNG recipe metadata

Every exported PNG receives a `tEXt` chunk with the keyword `monsterFaceState`.

Version 6 metadata includes:

- complete-face or authored-parts mode
- selected asset IDs and names
- complete part recipe
- selected finishing-plate ID and metadata
- composition position, scale, rotation, and flip
- paper, frame, treatment, caption, and transparency settings
- export timestamp

The raw SVG source is not duplicated inside the metadata. The PNG stores a compact editable recipe that points back to canonical asset IDs.

## Files

- `index.html` — static interface, mode controls, and finish selector
- `styles.css` — existing responsive visual system
- `v6-art-finish.css` — sharper poster framing and finish-selector styling
- `app-core.js` — existing state, library, builder, history, and favourites
- `app.js` — existing Canvas composition, export, and controls
- `v6-art-finish.js` — finish selection, alpha-masked compositing, and v6 export metadata
- `png-metadata.js` — JSON-in-PNG metadata writer
- `assets/faces/` — ten complete pre-drawn monsters
- `assets/parts/*.js` — seven anatomy families containing 61 composable authored SVG objects and base slots
- `assets/finishes.js` — five fixed non-anatomical vector finishing plates
- `assets/manifest.json` — canonical pack inventory and render contract
- `docs/ASSET-GUIDE.md` — production contract for future art packs

## Production direction

The current inline SVG assets establish the interaction and compositing contract. Future production replacements may use transparent PNG, WebP, or SVG exported from original layered artwork, provided stable IDs, full-canvas alignment, authored z-order, and slot metadata remain intact.
