# Pre-Drawn Asset Guide — v7

## Core rule

Every visible monster feature must originate from an authored image asset. Canvas may position, layer, clip, mask, blend, frame, transform, and export assets, but it must not synthesize monster anatomy with paths or runtime geometry.

Randomisation is selection, not generation.

## Current v7 contract

The builder supports complete faces, seven composable anatomy families, one non-anatomical finish family, and one non-anatomical junction family.

### Builder render order

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

All anatomy is fully authored before runtime. The junction stages only resolve overlap and edge ownership between already-authored objects.

## Junction render contract

A junction object is a fixed full-canvas transition plate. It may contain:

- overlap shadows
- cheek-colour cover shapes
- lip-edge cover shapes
- horn-root contour folds
- short highlight marks
- authored distress local to a join

A junction object must not contain a complete mouth, horn, ear, tooth, eye, nose, head silhouette, or other standalone anatomy.

Canvas may:

1. derive the required junction ID from the selected stable base, mouth, or horn ID
2. transform the junction with the same composition and authored placement slot as its target
3. use the authored base alpha to clip the complete mouth layer
4. draw the fixed transition plate in the documented render stage

Canvas must not calculate a new contour, morph a path, infer a facial landmark, or generate a transition shape from image analysis.

### Mouth edge ownership

Every visible mouth asset should own its internal aperture. Teeth, gums, tongues, and inner shadows must be placed inside a fixed SVG clip path or alpha mask authored with that mouth.

The compositor then clips the complete mouth layer to the selected authored base alpha. This is a safety and edge-ownership operation, not anatomy generation.

A base-specific mouth seam plate renders after the clipped mouth. It may cover mouth corners with the exact base colour and add a fixed lower-lip shadow or cheek crease.

### Horn and ear root ownership

Horns and ears render behind the head base. Each visible horn/ear asset should include a deliberate root flare and denser authored texture near the root.

A matching horn-root seam plate renders after the base. It may add a fixed overlap shadow, fold line, or highlight at the root. It may not extend or reshape the horn silhouette.

## Finish render contract

The finish stage remains separate from anatomy and junctions. A finish is a fixed full-canvas artwork plate containing only marks such as hatching, stipple, blackwork shadow masses, registration accents, scratches, or distress.

Canvas may transform the finish with the selected monster, alpha-mask it to the already composed approved artwork, and blend it using the authored `blendMode` and `opacity`.

## Art-direction target

The supplied MVP boards remain the primary visual source of truth. The target characteristics are:

- bold, readable monster silhouettes
- features that feel embedded into one character rather than stacked as stickers
- dense but controlled hand-inked detail
- irregular contour accents and imperfect marks
- warm printed-paper context
- small areas of high-saturation coral, teal, amber, purple, and moss
- screen-print and registration character without muddying the face
- strong black shapes balanced against lighter stipple and hatch systems

Hydro74’s public vector portfolio remains a secondary reference for broad principles such as compact silhouette construction, high-contrast blackwork, ornamental line systems, and print-ready vector discipline. Do not trace, reproduce, or imitate a specific published piece.

## Existing inline SVG contract

Current composable anatomy objects live in family files under `assets/parts/` as fixed SVG documents using a shared `0 0 600 600` viewBox. Full-canvas alignment lets the compositor layer objects without detecting facial geometry.

Current finishes live in `assets/finishes.js`. Junction plates live in `assets/junctions.js`. Both use the same `0 0 600 600` viewBox.

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
  seamProfile: "wide",
  tags: ["grin", "teeth", "clipped-interior"],
  svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 600\">...</svg>"
}
```

Optional metadata such as `seamProfile` or `rootProfile` documents the intended authored transition family. It must not be used to generate geometry.

A family may include an explicit `none` object so the user can remove that layer without special compositor logic.

## Junction object

```js
{
  id: "mouth-seam-base-bog",
  targetId: "base-bog",
  name: "Bog mouth seam",
  svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 600\">...</svg>"
}
```

The `targetId` is a stable lookup key. Junction selection is deterministic: the compositor chooses the fixed plate that matches the selected authored object.

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
mouth-seam-<base-id>
horn-seam-<horn-id>
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
  junctions/
  thumbnails/
```

A future manifest entry may use `src` instead of inline `svg` while keeping the same IDs, slots, finish blend metadata, junction target IDs, and full-canvas alignment.

## Mouth design guidance

- Put all teeth, gums, tongues, and interior shadows inside one authored aperture clip.
- Avoid perfectly repeated tooth widths and identical vertical baselines.
- Use a deliberate gum ridge or lip edge so the mouth does not read as a black sticker.
- Keep cheek-cover shapes in the junction plate, not inside the reusable mouth asset.
- Test each mouth against all six bases and all mouth placement slots.
- Inspect the wide mouths on the narrow skull base and the open roar on the shortest bases.

## Horn and ear design guidance

- Widen the root before it disappears behind the head.
- Increase segmentation and texture density near the root.
- Preserve a clear outer silhouette at thumbnail scale.
- Keep root shadows and head-side fold marks in the junction plate.
- Test every horn/ear on all six bases, including horizontal flip.

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
6. Confirm mouth interiors remain inside the authored aperture.
7. Confirm the complete mouth layer remains inside the selected base alpha.
8. Inspect mouth-corner coverage and lower-lip seam continuity.
9. Inspect horn-root overlap, shadow, and contour continuity.
10. Verify the intended z-order against patterns, extras, and the selected finish.
11. Export a 3600 × 3600 composition and inspect edge detail.
12. Confirm exported `monsterFaceState` metadata records stable part, finish, and junction IDs.
13. Test horizontal flip when the artwork is expected to be mirror-safe.
14. Confirm finish and junction plates remain non-anatomical when viewed without a monster.
15. Keep a contact sheet for review, but treat individual transparent objects as production source files.

## Source-of-truth principle

The supplied reference boards define the approved families, tone, and visual language. Production assets should come from underlying layered artwork whenever it exists rather than being cropped from a flattened reference sheet.
