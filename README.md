# Monster Face Library — Pre-Drawn v4

This branch replaces the procedural Canvas monster renderer with a curated library of fixed, pre-drawn monster assets.

Open `index.html` in a modern browser or publish the branch through GitHub Pages. No build step, framework, server, or API is required.

## What changed

- Removed runtime head, eye, mouth, horn, tooth, and skin generation
- Added ten complete, hand-authored SVG monster faces based on the approved pre-drawn reference direction
- Rebuilt Canvas as a compositor and export surface rather than an illustration engine
- Added face-library filtering, favourites, shuffle, undo/redo, saved compositions, drag positioning, scale, rotation, flip, framing, captions, paper treatments, and transparent export
- Added 3600 × 3600 PNG export
- Embedded the complete composition state as JSON inside each exported PNG using a PNG `tEXt` chunk
- Added a documented asset contract for future eyes, mouths, horns, textures, and extras packs

## Product direction

The generator is now **curated rather than procedural**:

1. Artists create complete faces and feature families.
2. Assets are stored as fixed SVG, transparent PNG, or transparent WebP files.
3. The app selects, positions, layers, and exports those assets without redrawing them.
4. Randomisation only chooses from approved art; it never invents geometry.

## First face pack

- Bog Cyclops
- Swamp Elder
- Sunburst Triplet
- Bone Oracle
- Boiler Imp
- Blue Worrywart
- Purple Lurker
- Moss Grinner
- Tongue Tangle
- Amber Brute

Each asset is a complete authored illustration. Composition controls are non-destructive.

## Files

- `index.html` — static interface and markup
- `styles.css` — responsive visual system
- `app.js` — library, composition, history, favourites, and export behaviour
- `png-metadata.js` — JSON-in-PNG metadata writer
- `assets/faces/` — one fixed pre-drawn SVG object per monster
- `assets/manifest.json` — canonical asset metadata
- `docs/ASSET-GUIDE.md` — naming, sizing, anchor, and pack guidance

## Next packs

The new reference boards define the next pre-drawn families:

- blank head bases
- eye sets
- nose and snout sets
- mouth sets
- paired horns and ears
- surface patterns
- scars, bandages, jewellery, slime, spikes, and other extras

Those families should arrive as authored transparent assets with authored anchors. The application should never procedurally recreate their line work.

## Export metadata

Each exported PNG contains a `tEXt` chunk with the keyword `monsterFaceState`. Its JSON includes the app version, export timestamp, selected face, scale, rotation, position, flip, paper, frame, treatment, caption, and transparency settings.

This keeps the image and its editable recipe together in one portable file.
