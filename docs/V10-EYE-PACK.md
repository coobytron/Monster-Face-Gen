# V10 Expressive Eye System Rollout

Issue: #41  
Status: agent candidate, pending human Art Director review  
Runtime anatomy generation: **disabled**

The 20 pre-drawn V10 eye systems from the original #41 implementation remain the authored source. This rollout completes the integration work that was missing from PR #48: browser registration, full base compatibility classification, rigid review placements, deterministic QA, machine-readable metadata, and documentation.

## Library target

- Baseline eye systems: 10
- New V10 candidate eye systems: 20
- Total selectable eye systems after rollout: 30

The existing candidate set covers cyclops, multi-eye, drooping, wide-startled, tiny-beady, mismatched, half-lidded, feral, sleepy, stern, goofy, uneasy, glassy, scarred, and mechanical-adjacent constructions. Required expression reads include sleepy, uneasy, feral, goofy, stern, and startled.

## Integration contract

Every V10 eye candidate:

- keeps its stable `eye-v10-*` ID;
- is literal 600 × 600 authored SVG;
- has `runtimeGeometry: false`;
- remains `agent-candidate-pending-art-director`;
- classifies all 18 current head bases exactly once as approved, acceptable, or blocked;
- publishes one approved rigid placement fixture for deterministic integration review;
- declares flip, thumbnail, and transparent-background safety;
- is installed into the existing compatibility matrix without changing baseline eye IDs.

Runtime may select, place, mirror, mask, composite, and export the authored eye systems. It may not synthesize eyes, infer landmarks, morph paths, or generate anatomy.

## Review contract

Review all candidates:

- normal and horizontally flipped;
- at 100%, 96 px, and 48 px;
- on cream, white, black, and transparent backgrounds;
- with attention to lid/highlight clipping, eye-first hierarchy, expression readability, and pair placement.

Run:

```bash
node tests/v10-eyes.test.js
node scripts/v10-eye-qa.js --validate-only
node scripts/v10-eye-qa.js --write
```

Write mode creates:

- `generated/qa/v10-eyes/validation-report.json`
- `generated/qa/v10-eyes/contact-sheet.html`

Automated QA confirms contract compliance only. Human Art Director approval remains a separate promotion gate.
