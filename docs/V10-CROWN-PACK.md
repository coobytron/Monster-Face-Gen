# V10 Crown Pack — Issue #43

## Purpose

This pack expands the pre-drawn horn and ear library from 9 to 27 authored crown systems. The supplied Monster Face Generator MVP boards remain the visual source of truth. Runtime code may select, rigidly place, mirror, layer, clip, mask, finish, and export these objects; it may not generate anatomy.

## Candidate inventory

The 18 additions cover:

- broken fork horns
- curled coil horns
- stubby pegs
- spiked saw crowns
- antler thickets
- soft rounded ears
- ragged bat ears
- drooping ears
- asymmetrical horn-and-ear mismatch
- a single crooked horn
- clustered crown spikes
- bone prongs
- furry-root horns
- compact imp nubs
- fin ears
- goblin ears
- thorn halos
- moth ears

Every candidate is structurally distinct. Recolour-only variants do not count toward the quota.

## Authored asset contract

Each `horn-v10-*` object contains a literal full-canvas SVG using `viewBox="0 0 600 600"`, a stable ID, crown kind, family, root profile, anchor, authored bounds, expression direction, review base, and flip contract. The loader marks every object:

- `authored: true`
- `runtimeGeometry: false`
- `status: agent-candidate-pending-art-director`
- `flipSafe: true`
- `mirrorWithComposition: true`

The browser aggregator only registers these objects in `MONSTER_PARTS.horns`. It does not construct or deform them.

## Compatibility and exact roots

`assets/v10-crown-compatibility.js` classifies every new crown against all 18 current base IDs exactly once as `approved`, `acceptable`, or `blocked`.

`assets/v10-crown-placements.js` publishes one approved exact root fixture for every candidate. Each fixture uses stable pair key `<base-id>|<horn-id>`, a rigid transform, and a literal non-anatomical transition plate containing only local root overlap, contour folds, shadow, and highlight. Plates declare `standaloneAnatomy: false`.

`assets/v10-crown-integration.js` adds the classifications and rigid placement overrides to the existing compatibility object after it loads. It keeps V10 candidate pair keys separate from the human-reviewed V9 pair set.

## Deterministic review

Run:

```bash
npm test
npm run v10:crowns
```

The QA script validates IDs, SVG safety, authored-only status, structural uniqueness, complete 18-base classification, exact root fixture coverage, rigid transform constraints, flip safety, and the human-approval boundary. `--write` produces cream, white, black, and transparent review boards with normal, flipped, 96 px, and 48 px reads plus a machine-readable report.

Generated output:

- `generated/qa/v10-crowns/integration-*.svg`
- `generated/qa/v10-crowns/integration-*.png`
- `generated/qa/v10-crowns/validation-report.json`

## Approval boundary

All 18 additions are agent-produced candidates. Automated QA verifies contract compliance but does not grant production approval. A human Art Director must review silhouette, root attachment, line weight, thumbnail read, and fidelity to the supplied MVP boards before any candidate is promoted into curated production recipes.
