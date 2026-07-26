# Pre-Drawn Asset Guide — v6

## Core rule

Every visible monster feature must originate from an authored image asset. Canvas may position, layer, mask, blend, frame, transform, and export assets, but it must not synthesize monster anatomy with paths or runtime geometry.

Randomisation is selection, not generation.

## Current v6 contract

The builder supports complete faces, seven composable anatomy families, and one non-anatomical finish family.

### Anatomy render order

1. horns / ears
2. blank head base
3. surface pattern
4. eyes
5. nose / snout
6. mouth
7. extras

Horns sit behind the head. Patterns and facial features sit above it. All anatomy is fully authored before runtime.

### Finish render stage

8. illustration finish

The finish stage is separate from anatomy. A finish is a fixed full-canvas artwork plate containing only marks such as hatching, stipple, blackwork shadow masses, registration accents, scratches, or distress.

Canvas may:

1. transform the finish with the selected monster
2. alpha-mask it to the already composed approved artwork
3. blend it using the authored `blendMode` and `opacity`

Canvas must not use the finish layer to create a silhouette, facial feature, tooth, horn, eye, mouth, nose, head, or other anatomy.

## Art-direction target

The supplied MVP boards remain the primary visual source of truth. The target characteristics are:

- bold, readable monster silhouettes
- dense but controlled hand-inked detail
- irregular contour accents and imperfect marks
- warm printed-paper context
- small areas of high-saturation coral, teal, amber, purple, and moss
- screen-print and registration character without muddying the face
- strong black shapes balanced against lighter stipple and hatch systems

Hydro74’s public vector portfolio is a secondary reference for broad principles such as compact silhouette construction, high-contrast blackwork, ornamental line systems, and print-ready vector discipline. Do not trace, reproduce, or imitate a specific published piece.

## Existing inline SVG contract

Current composable anatomy objects live in family files under `assets/parts/` as fixed SVG documents using a shared `0 0 600 600` viewBox. Full-canvas alignment lets the compositor layer objects without detecting facial geometry.

Current finishes live in `assets/finishes.js` and use the same `0 0 600 600` viewBox.

## Recommended production format

For replacement or expansion packs:

- transparent PNG or WebP for raster artwork
- SVG only when the original artwork is genuinely vector
- square 2048 × 2048 working canvas
- sRGB colour profile
- premultiplied-alpha-safe edges
- no baked paper background
- no labels, contact-sheet borders, or crop marks
- at least 120 px transparent padding

Keep all anatomy features on the same full-size canvas as their compatible base. A mouth should remain in its authored face position rather than being tightly cropped.

## Base object

Each blank head base owns small alignment adjustments for the other anatomy families:

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

## Anatomy part object

```js
{
  id: "mouth-grin",
  name: "Toothy Grin",
  tags: ["grin", "teeth"],
  svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 600\">...</svg>"
}
```

A family may include an explicit `none` object so the user can remove that layer without special compositor logic.

## Finish object

```js
{
  id: "finish-etched",
  name: "Etched MVP",
  shortName: "Etched",
  blendMode: "multiply",
  opacity: 0.58,
  tags: ["etched", "hatching", "mvp"],
  svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 600\">...</svg>"
}
```

A finish plate must remain non-anatomical. It may contain authored texture and print marks, but no feature should make sense as a new monster part when viewed by itself.

## Naming

Stable IDs are required because exported PNG recipes point back to them.

```text
monster-<number>
base-<name>
eye-<name>
nose-<name>
mouth-<name>
horn-<name>
pattern-<name>
extra-<name>
finish-<name>
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
  finishes/
  thumbnails/
```

A future manifest entry may use `src` instead of inline `svg` while keeping the same IDs, slots, finish blend metadata, and full-canvas alignment.

## Finish design guidance

- Use broad zones of detail rather than uniform noise over the entire canvas.
- Preserve eye, mouth, and tooth readability at thumbnail scale.
- Keep the darkest masses away from the main expression unless the finish is intentionally dramatic.
- Use hatching direction to reinforce volume, not to invent a new contour.
- Registration accents should stay restrained and use approved palette colours.
- Distress should feel placed and authored, not randomly generated.
- Test the finish on all complete faces and all six current bases.
- Include a `finish-clean` object so the original art is always available.

## Quality checks

Before adding or replacing an asset:

1. View it on cream, white, black, and transparent backgrounds.
2. Check for paper-coloured halos around alpha edges.
3. Confirm line weight and detail density match the approved MVP pack.
4. Verify the feature remains legible in the library thumbnail.
5. Test anatomy parts on all six current blank bases.
6. Inspect the intended z-order against horns, patterns, extras, and the selected finish.
7. Export a 3600 × 3600 composition and inspect edge detail.
8. Confirm exported `monsterFaceState` metadata records every stable ID, including `finishId`.
9. Test horizontal flip when the artwork is expected to be mirror-safe.
10. Confirm a finish plate remains non-anatomical when viewed without a monster.
11. Keep a contact sheet for review, but treat individual transparent objects as production source files.

## Source-of-truth principle

The supplied reference boards define the approved families, tone, and visual language. Production assets should come from underlying layered artwork whenever it exists rather than being cropped from a flattened reference sheet.
