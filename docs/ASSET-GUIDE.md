# Pre-Drawn Asset Guide — v8

## Core rule

Every visible monster feature must originate from an authored image asset. Canvas may position, layer, clip, mask, blend, frame, transform, and export assets, but it must not synthesize monster anatomy with paths or runtime geometry.

Randomisation is selection, not generation.

## Current v8 contract

The builder supports complete faces, seven composable anatomy families, one non-anatomical finish family, one non-anatomical junction family, and an authored compatibility layer.

The supplied MVP boards remain the primary visual source of truth. Features should read as one finished character rather than independent stickers.

## Compatibility contract

Every published base must classify every stable eye, nose, mouth, and horn/ear ID in `assets/compatibility.js`.

Allowed states:

- `approved` — preferred pairing that closely matches the MVP silhouette and expression language
- `acceptable` — safe alternate pairing that remains intentional at thumbnail size
- `blocked` — pairing that floats, crowds the base, breaks attachment, weakens the silhouette, or reads as generic

Each part ID must appear exactly once in one state for each relevant base/family pair. Missing and duplicate classifications are validation failures.

Patterns and extras are currently globally compatible because they do not alter the primary facial silhouette. They may receive their own authored matrix in a future pack.

### Selection behavior

- A blocked part is disabled for the active base.
- Changing bases repairs any selected part that becomes blocked.
- The renderer filters blocked anatomy as a final safety layer.
- Manual selection may use approved or acceptable parts only.
- Shuffle begins from an approved complete recipe or mutates one feature inside the active base’s compatible family.
- Compatibility logic must never calculate new geometry or infer landmarks.

## Approved recipe contract

A recipe is a complete stable-ID selection:

```js
{
  id: "bog-cyclops-grin",
  name: "Bog Cyclops Grin",
  status: "approved",
  baseId: "base-bog",
  eyeId: "eye-cyclops",
  noseId: "nose-button",
  mouthId: "mouth-grin",
  hornId: "horn-curved",
  patternId: "pattern-spots",
  extraId: "extra-earring"
}
```

Recipes are art-directed compositions, not generated presets. Every recipe must pass the matrix and read as an intentional finished character at thumbnail size.

The current pack includes 16 approved recipes. Keep recipe IDs stable after publication because exported PNG metadata may reference them.

## Per-pair placement overrides

Each base continues to own universal slots. A specific base/part pair may add a small authored override when the universal slot is insufficient.

```js
placementOverrides: {
  "base-imp|mouth-roar": {x:0,y:0.016,scale:0.92,rotation:0}
}
```

The compositor combines the base slot and override:

- translations add
- rotations add
- scales multiply

Overrides may only translate, uniformly scale, or rotate an existing full-canvas asset. They must not morph, crop into new anatomy, non-uniformly distort, or infer a face landmark.

Use overrides sparingly. Prefer the universal base slot until a pair visibly needs authored correction.

## Narrow-base and wide-mouth rule

Narrow or short bases must block overly wide mouths unless a reviewed authored override makes the pair intentional. The current validation explicitly checks that narrow bases reject `mouth-roar`, while `base-imp|mouth-roar` remains an approved authored exception with a placement override.

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

All anatomy is authored before runtime. Compatibility chooses and positions assets; junction stages only resolve overlap and edge ownership.

## Junction render contract

A junction object is a fixed full-canvas transition plate. It may contain overlap shadows, cheek-colour cover shapes, lip-edge cover shapes, horn-root contour folds, short highlight marks, and authored distress local to a join.

A junction object must not contain a complete mouth, horn, ear, tooth, eye, nose, head silhouette, or other standalone anatomy.

Canvas may derive a fixed junction ID from stable authored IDs, transform it with the same composition and placement slot, clip the complete mouth to the selected base alpha, and draw the fixed plate at the documented stage.

Canvas must not calculate a new contour, morph a path, infer a landmark, or generate a transition shape from image analysis.

### Mouth edge ownership

Every mouth owns its internal aperture. Teeth, gums, tongues, and inner shadows must remain inside a fixed authored clip path or alpha mask. The compositor then clips the complete mouth layer to the authored base alpha and draws the matching base seam plate.

### Horn and ear root ownership

Horns and ears render behind the head. Each asset includes an authored root flare. The matching seam plate may add fixed overlap shadow, fold line, or highlight without extending the horn silhouette.

Horizontal flip mirrors the entire authored composition and its junction transforms together so roots remain attached.

## Finish render contract

A finish is a fixed full-canvas non-anatomical artwork plate containing hatching, stipple, blackwork shadow masses, registration accents, scratches, or distress. It may be transformed with the monster, alpha-masked to the composed artwork, and blended with its authored mode and opacity.

## Art-direction target

- bold, readable monster silhouettes
- embedded features rather than stacked stickers
- dense but controlled hand-inked detail
- irregular contour accents and imperfect marks
- warm printed-paper context
- restrained coral, teal, amber, purple, and moss accents
- screen-print and registration character without muddying the face
- strong black shapes balanced against lighter stipple and hatch systems

Hydro74’s public vector portfolio remains a secondary reference for compact silhouettes, high-contrast blackwork, ornamental line systems, and print-ready vector discipline. Do not trace or imitate a specific published piece.

## Asset format

Current composable anatomy, finishes, junctions, and compatibility data use stable IDs and a shared `0 0 600 600` full-canvas coordinate system.

Recommended production replacements:

- transparent PNG or WebP for raster artwork
- SVG only when the original artwork is genuinely vector
- square 2048 × 2048 working canvas
- sRGB colour profile
- premultiplied-alpha-safe edges
- no baked paper background
- no labels, contact-sheet borders, or crop marks
- at least 120 px transparent padding

Keep anatomy features on the same full-size canvas as their compatible base.

## Base object

```js
{
  id: "base-bog",
  name: "Bog Blob",
  svg: "<svg ...>",
  slots: {
    eyes:{x:0,y:-0.01,scale:1},
    noses:{x:0,y:0,scale:1},
    mouths:{x:0,y:0.01,scale:1},
    horns:{x:0,y:0,scale:1},
    patterns:{x:0,y:0,scale:1},
    extras:{x:0,y:0,scale:1}
  }
}
```

Slots and overrides are art-direction metadata. They do not create or deform artwork.

## Anatomy part object

```js
{
  id: "mouth-grin",
  name: "Toothy Grin",
  seamProfile: "wide",
  tags: ["grin","teeth","clipped-interior"],
  svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 600\">...</svg>"
}
```

A family may include an explicit `none` object.

## Stable naming

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

## PNG metadata

Version 8 exports should retain:

- stable selected part IDs
- approved recipe ID when present
- compatibility state per primary pair
- active per-pair placement overrides
- finish and junction IDs
- composition transform and flip
- assembly version

## Quality checks

1. View assets on cream, white, black, and transparent backgrounds.
2. Confirm line weight and detail density match the MVP pack.
3. Verify every part remains legible at thumbnail size.
4. Classify every primary pair exactly once.
5. Test anatomy parts on all six bases.
6. Confirm mouth interiors remain inside their authored aperture and selected base alpha.
7. Inspect mouth-corner and lower-lip seam continuity.
8. Inspect horn-root overlap before and after horizontal flip.
9. Confirm narrow bases block overly wide mouths unless a reviewed override exists.
10. Verify approved recipes read as finished characters at thumbnail size.
11. Run 100 compatibility-aware shuffle samples with no blocked selections.
12. Export a 3600 × 3600 composition and inspect edge detail.
13. Confirm `monsterFaceState` metadata records stable IDs, recipe ID, compatibility states, overrides, finish, and junction IDs.
14. Confirm finish and junction plates remain non-anatomical by themselves.
15. Keep a review contact sheet for art-direction approval.

Run the automated matrix checks with:

```bash
node tests/compatibility.test.js
```

## Source-of-truth principle

The supplied reference boards define the approved families, tone, silhouette, and expression language. Production assets should come from underlying layered artwork whenever it exists rather than crops from a flattened reference sheet.
