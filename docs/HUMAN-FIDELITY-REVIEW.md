# Human MVP-Fidelity Review

This workflow turns the three locked hero comparisons into a repeatable review record. It does **not** claim that software can judge aesthetic quality. Automated checks only validate completeness, stable references, score ranges, targets, and regressions.

## Review set

The canonical record is `reviews/hero-fidelity-v9.json`, validated by `schemas/hero-fidelity-review.schema.json` and `scripts/hero-review-qa.js`.

Each hero stores separate `baseline` and `current` 1–5 scores for:

- silhouette strength
- attachment integration
- expression read
- detail density
- thumbnail read
- MVP similarity

Notes may target a recipe, base, mouth, horn/ear, junction, finish, or individual asset by stable ID. Asset replacement behind a stable ID does not invalidate historical records.

## Board procedure

Run:

```bash
npm ci
npm test
npm run qa
```

Review each `generated/qa/hero-review-board-<recipe-id>.svg` alongside the supplied MVP source boards. Every board exposes:

1. full composition
2. silhouette-only view
3. eyes and expression crop
4. mouth and jaw crop
5. horn/ear root crop
6. flipped view
7. thumbnail view
8. cream, white, black, and transparent backgrounds

The board references the deterministic hero-fidelity compositions so it does not redraw or generate monster anatomy.

## Human confirmation

The checked-in records are an agent-assisted initial pass derived from the locked baseline and current hero work. They intentionally use `humanConfirmed: false` and `status: human-confirmation-required` until an art director reviews the boards against the supplied MVP images.

To complete human review:

1. Inspect every panel and background.
2. Adjust scores only from direct visual review.
3. Add concrete notes tied to stable IDs.
4. Set each record's `reviewer` and `humanConfirmed: true`.
5. Set the review-set status to `human-confirmed`.
6. Run `npm test` and `npm run qa` again.

Pending confirmation is a warning, not an automated aesthetic failure. A missing review, invalid reference set, score below its target, or current score below baseline is an error.

## Determinism

The review report uses a Unix-epoch timestamp and a SHA-256 digest of the canonical JSON. Unchanged inputs produce byte-stable JSON and SVG outputs.
