# Pre-Drawn Asset Guide

## Core rule

Every visible monster feature must originate from an authored image asset. Canvas may position, mask, blend, frame, and export assets, but it must not synthesize monster anatomy with paths.

## Recommended file format

- Transparent PNG for maximum compatibility
- Transparent WebP for smaller production downloads
- sRGB colour profile
- Premultiplied-alpha-safe edges
- No baked paper background
- No labels, crop marks, or contact-sheet borders

## Complete face assets

Use a square 2048 × 2048 working canvas.

- Keep the monster centred around `(1024, 980)`
- Leave at least 120 px transparent padding
- Preserve the ground shadow as part of the asset when desired
- Use a consistent visual scale across the pack
- Export thumbnails at 320 × 320

Manifest entry:

```json
{
  "id": "monster-11",
  "name": "Example Monster",
  "mood": "mischievous",
  "eyeCount": 2,
  "palette": "teal",
  "tags": ["horned", "toothy"],
  "src": "assets/monsters/monster-11.png",
  "thumb": "assets/monsters/monster-11-thumb.png",
  "defaultScale": 1,
  "defaultRotation": 0
}
```

## Future composable feature packs

Feature files should use the same 2048 × 2048 coordinate system as their compatible blank head base. Export each feature on a transparent full-size canvas instead of tightly cropping it. This lets the app layer files at `(0, 0)` without guessing placement.

Recommended folder structure:

```text
assets/
  bases/
  eyes/
  noses/
  mouths/
  horns/
  patterns/
  extras/
  palettes/
```

Each composable asset should declare:

- `id`
- `family`
- `compatibleBases`
- `src`
- `zIndex`
- `anchor`
- `bounds`
- `tags`
- optional `mirrorSafe`
- optional `colourway`

## Authored anchors

For tightly cropped assets, provide a normalized anchor:

```json
{
  "anchor": {
    "x": 0.5,
    "y": 0.42,
    "scale": 1,
    "rotation": 0
  }
}
```

Anchors are art-direction data, not procedural generation.

## Quality checks

Before adding an asset:

1. View it on cream, white, black, and transparent backgrounds.
2. Check for paper-coloured halos around the alpha edge.
3. Confirm the line weight matches the approved pack.
4. Verify it remains legible at 160 px.
5. Confirm the source and thumbnail filenames match the manifest.
6. Export a 3600 × 3600 composition and inspect teeth, eyes, horns, and edge detail.
7. Confirm embedded `monsterFaceState` JSON can identify the asset.

## Source-of-truth principle

Contact sheets are references and review surfaces. Production assets should be exported from the underlying artwork rather than cropped from a flattened contact sheet whenever the original layers are available.
