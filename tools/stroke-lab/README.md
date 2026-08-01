# Stroke Lab

`stroke-lab` is an internal authoring experiment for converting explicitly selected centreline strokes into baked, ordinary SVG outline paths. It is limited to non-anatomical junction accents, hatching, scratches, highlight cuts, and internal decorative marks.

It must not be used to generate or infer heads, mouths, teeth, eyes, noses, horns, ears, limbs, landmarks, or any other monster anatomy. Nothing in this directory is loaded by the public generator runtime.

## Approaches compared

- `averaged-normal`: averages adjacent segment normals for smoother joins and is the preferred approach for short folds and graduated seam accents.
- `segment-normal`: uses the active segment normal and is intentionally simpler for short scratches and highlight cuts.

Both approaches are deterministic and dependency-free. They are authoring prototypes, not production runtime geometry.

## Run

```bash
node tools/stroke-lab/stroke-lab.js
node tests/stroke-lab.test.js
```

The default fixtures export one horn-root fold and one highlight cut. Output includes baked SVG paths, a flipped junction review, source stable IDs, tool/version metadata, SHA-256 digests, and `validation-report.json`.

Review exported artwork at 100%, 25%, 96 px, and 48 px before moving it into an authored asset file. Flipped review is required for marks that mirror with composition.

## Validation

The tool rejects or reports non-finite geometry, collapsed segments or widths, open/collapsed contours, self-intersections, excessive segment counts, disconnected/collapsed results, and unstable output. Winding is normalized during export and reported when correction was required.
