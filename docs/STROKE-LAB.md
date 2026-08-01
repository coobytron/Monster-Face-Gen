# Authoring-Time Stroke Expansion

The internal Stroke Lab in `tools/stroke-lab/` converts explicitly selected centreline marks into baked SVG outlines for review. It is an authoring aid only and is excluded from the public generator runtime.

## Allowed uses

- horn-root fold accents
- mouth-corner seam accents
- short cheek-compression marks
- hatching, scratches, and highlight cuts
- decorative lettering and internal UI marks

## Forbidden uses

The tool must not generate, infer, morph, or reconstruct monster anatomy, including heads, mouths, teeth, eyes, noses, horns, ears, limbs, or landmarks. Expanded output is not accepted automatically: it must be reviewed, cleaned where needed, and committed as ordinary authored SVG artwork behind stable IDs.

## Review contract

Review each candidate at 100%, 25%, 96 px, and 48 px. Review mirrored output whenever the mark participates in a flipped composition. Confirm that the result remains subordinate to the authored anatomy and that it does not become a meaningful standalone feature.

The prototype compares averaged adjacent normals against direct segment normals, supports constant and graduated widths, emits deterministic SHA-256 digests, and writes machine-readable validation. Validation rejects non-finite geometry, collapsed widths or segments, self-intersections, open or collapsed contours, excessive segment counts, and unstable output. Winding is normalized before export.

Run:

```bash
npm run stroke-lab
node tests/stroke-lab.test.js
```

The generated files remain review artifacts until an art director approves them for transfer into the authored asset library.
