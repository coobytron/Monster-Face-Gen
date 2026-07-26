# Pre-Drawn Asset Guide

## Core rule

Every visible monster feature must originate from an authored image asset. Canvas may position, mask, blend, frame, transform, and export assets, but it must not synthesize monster anatomy with paths.

Randomisation is selection, not generation.

## Current v5 contract

The builder supports complete faces and seven composable families:

1. horns / ears
2. blank head base
3. surface pattern
4. eyes
5. nose / snout
6. mouth
7. extras

That list is also the render order. Horns sit behind the head; patterns and facial features sit above it.

All current composable objects live in the family files under `assets/parts/` as fixed inline SVG documents using a shared `0 0 600 600` viewBox. This full-canvas alignment lets the compositor layer objects without detecting facial geometry.

## Recommended production format

For a production art replacement pack:

- transparent PNG or WebP for raster artwork
- SVG when the original artwork is genuinely vector
- square 2048 × 2048 working canvas
- sRGB colour profile
- premultiplied-alpha-safe edges
- no baked paper background
- no labels, contact-sheet borders, or crop marks
- at least 120 px transparent padding

Keep all features on the same full-size canvas as their compatible base. A mouth should remain in its authored face position rather than being tightly cropped.

## Base object

Each blank head base owns small alignment adjustments for the other families:

```js
{
  id: "base-bog",
  name: "Bog Blob",
  svg: "<svg ...>",
  slots: {
    eyes:    { x: 0, y: -0.01, scale: 1 },
    noses:   { x: 0, y: 0,     scale: 1 },
    mouths:  { x: 0, y: 0.01,  scale: 1 },
    horns:   { x: 0, y: 0,     scale: 1 },
    patterns:{ x: 0, y: 0,     scale: 1 },
    extras:  { x: 0, y: 0,     scale: 1 }
  }
}
```

These slots are art-direction metadata. They do not create or deform artwork.

## Part object

```js
{
  id: "mouth-grin",
  name: "Toothy Grin",
  tags: ["grin", "teeth"],
  svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 600\">...</svg>"
}
```

A family may include an explicit `none` object so the user can remove that layer without special compositor logic.

## Naming

Use stable IDs because exported PNG recipes point back to them.

```text
base-<name>
eye-<name>
nose-<name>
mouth-<name>
horn-<name>
pattern-<name>
extra-<name>
```

Do not rename a published ID. Replace the art behind the same ID or introduce a new ID.

## Folder direction for raster production packs

```text
assets/
  faces/
  bases/
  eyes/
  noses/
  mouths/
  horns/
  patterns/
  extras/
  thumbnails/
```

A future manifest entry can use `src` instead of inline `svg` while keeping the same IDs and slots.

## Quality checks

Before adding or replacing an asset:

1. View it on cream, white, black, and transparent backgrounds.
2. Check for paper-coloured halos around alpha edges.
3. Confirm the line weight matches the approved pack.
4. Verify the feature remains legible in the library thumbnail.
5. Test it on all six current blank bases.
6. Inspect the intended z-order against horns, patterns, and extras.
7. Export a 3600 × 3600 composition and inspect edge detail.
8. Confirm the exported `monsterFaceState` metadata records the stable ID.
9. Test horizontal flip when the artwork is expected to be mirror-safe.
10. Keep a contact sheet for review, but treat the individual transparent objects as production source files.

## Source-of-truth principle

The supplied reference boards define the approved families, tone, and visual language. Production assets should come from the underlying layered artwork whenever it exists rather than being cropped from a flattened reference sheet.
