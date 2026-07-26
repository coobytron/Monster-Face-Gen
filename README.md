# Monster Face Builder — Pre-Drawn v5

This branch replaces procedural monster anatomy with two curated workflows:

1. **Complete Faces** — select one of ten finished monster illustrations.
2. **Build a Monster** — combine fixed head, eye, nose, mouth, horn/ear, pattern, and extra assets.

Open `index.html` in a modern browser or publish the branch through GitHub Pages. No build step, framework, server, or API is required.

## Source-of-truth rule

Every visible character feature comes from an authored SVG asset. Canvas may select, position, layer, transform, treat, frame, and export the artwork. It does not generate new anatomy or redraw the feature geometry.

Randomisation only chooses among approved assets.

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
| **Composable objects** | **61** |

The composable pack includes explicit “none” objects where removing a layer is useful.

## Builder behaviour

- Switch between complete-face and authored-parts modes
- Browse feature families through category tabs
- Layer parts in a fixed authored order: horns, base, pattern, eyes, nose, mouth, extras
- Use per-base authored placement slots for small alignment adjustments
- Shuffle approved combinations without generating geometry
- Drag, scale, rotate, flip, frame, caption, and apply print treatments
- Save up to eight comparison versions
- Store favourites locally
- Export transparent or paper-backed 3600 × 3600 PNGs

## PNG recipe metadata

Every exported PNG receives a `tEXt` chunk with the keyword `monsterFaceState`.

Version 5 metadata includes:

- complete-face or authored-parts mode
- selected asset IDs and names
- complete part recipe
- composition position, scale, rotation, and flip
- paper, frame, treatment, caption, and transparency settings
- export timestamp

The raw SVG source is not duplicated inside the metadata. The PNG stores a compact editable recipe that points back to the canonical asset IDs.

## Files

- `index.html` — static interface and mode controls
- `styles.css` — responsive visual system and part thumbnails
- `app.js` — library, builder, composition, history, favourites, and export behaviour
- `png-metadata.js` — JSON-in-PNG metadata writer
- `assets/faces/` — ten complete pre-drawn monsters
- `assets/parts/*.js` — seven family files containing 61 composable authored SVG objects and base slots
- `assets/manifest.json` — canonical pack inventory
- `docs/ASSET-GUIDE.md` — production contract for future art packs

## Production direction

The included SVG objects establish the working contract and interaction model. The preferred production pass is to replace or extend them with transparent exports from the original layered artwork while preserving the IDs, full-canvas alignment, z-order, and authored slot metadata.
