# V10 Authored Pattern Pack

Issue: #44  
Status: agent candidate, pending human Art Director review  
Runtime anatomy generation: **disabled**

This pack expands the pre-drawn surface-detail library from 9 to 27 pattern choices without introducing procedural anatomy. The 18 new objects are literal authored SVG overlays stored and registered through `assets/v10-patterns.js`.

## Surface directions

The pack covers contour hatching, stipple, scratches, scars, patches, wrinkles, ink fills, registration offsets, fur marks, scales, freckles, crackle, stripes, pores, halftone-like dot fields, dry-brush plates, and asymmetric graphic marks.

Every candidate declares:

- stable `pattern-v10-*` ID
- supported V10 base IDs
- fixed blend mode and opacity
- fixed z-order
- export bounds
- thumbnail-safety and transparent-background flags
- authored/candidate state and revision
- literal 600 × 600 SVG source

No candidate uses runtime path generation, inferred landmarks, procedural noise, canvas drawing, or anatomy deformation.

## Review contract

Automated validation verifies deterministic IDs, unique SVG digests, metadata coverage, transparent-export safety declarations, supported-base coverage, and the 27-pattern quota.

Human review remains separate. The Art Director should inspect the generated contact sheet on cream, white, black, and transparent backgrounds, normal and flipped, at 100%, 25%, 192 px, 96 px, and 48 px. Particular attention should go to eye and mouth readability; candidate patterns are intentionally capped at low opacity.

Run:

```bash
node tests/v10-patterns.test.js
node scripts/v10-pattern-qa.js --validate-only
node scripts/v10-pattern-qa.js --write
```

The write mode produces:

- `generated/qa/v10-pattern-validation.json`
- `generated/qa/v10-pattern-contact-sheet.html`

These are review artifacts only; passing QA does not promote candidate art to approved production art.
