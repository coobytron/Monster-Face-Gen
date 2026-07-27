# Internal Recipe Director — v9.6

`internal/recipe-director/` is a separate art-direction surface for revising approved pre-drawn recipes. It is intentionally excluded from the public app and public runtime bundle.

## Open the tool

Serve the repository root with any static server, then open:

`/internal/recipe-director/`

A static server is required because the internal tool loads the tldraw editor shell as an ES module. The public `index.html` remains install-free and unchanged.

## Workflow

1. Load an approved recipe or the locked `bog-cyclops-grin` hero example.
2. Select repository-authored assets by stable ID.
3. Inspect compatibility state before making placement changes.
4. Apply only rigid transforms: translate, uniform scale, and rotation.
5. Preview horizontal flip and cream, white, black, or transparent backgrounds.
6. Inspect the 96 px thumbnail and stable-ID/layer JSON.
7. Select exact mouth and horn pair junction IDs derived from the selected base/part pair.
8. Add annotation pins, reviewer notes, expression tags, and 1–5 review scores.
9. Export deterministic JSON. Blocked pairs, unsupported stable IDs, and mismatched junction keys prevent export.
10. Re-import the file to verify a byte-stable round trip.

## tldraw boundary

tldraw is loaded only inside the internal route and is mounted as a read-only selection/navigation shell. Freehand drawing, shape creation, anatomy generation, path morphing, inferred landmarks, and non-uniform distortion are not exposed. Annotation pins and recipe metadata are managed by the constrained recipe controls and saved through `recipe-contract.js`.

The public generator does not import tldraw, React, or the recipe-director files.

## Deterministic output

`recipe-contract.js`:

- canonicalizes key order
- rounds transform and pin coordinates to four decimal places
- sorts and de-duplicates expression tags
- normalizes every review score to an integer from 1–5
- validates stable IDs against the loaded repository library
- validates base × eye/nose/mouth/horn compatibility
- rejects mismatched pair-junction IDs
- emits newline-terminated, two-space JSON

Run `npm test` to execute the import/export round-trip and validation tests.

## Hero round-trip example

The default workflow loads `bog-cyclops-grin` with:

- `base-bog`
- `eye-cyclops`
- `nose-button`
- `mouth-grin`
- `horn-curved`
- `pattern-spots`
- `extra-earring`
- mouth junction `base-bog|mouth-grin`
- horn junction `base-bog|horn-curved`

The test suite exports, imports, and exports this recipe again and requires byte-identical JSON.

## Review capture

For the draft PR, capture the following views after serving the branch locally:

1. hero recipe at full editable scale with stable-ID inspector visible
2. exact mouth junction selected with compatibility marked save-ready
3. flipped 96 px thumbnail on black background
4. a deliberately blocked pair showing export prevention

Generated review screenshots are evidence only and must not be loaded as anatomy assets.