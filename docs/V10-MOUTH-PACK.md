# V10 Authored Mouth Pack

Issue #34 expands the pre-drawn mouth library from 9 to 27 stable authored assets. The 18 additions are production candidates pending human art-direction approval.

## Agent Cody Banks team

- Producer: scope, branch isolation, review gates, and delivery record.
- Creative Director: fidelity to the supplied MVP boards and the authored-only premise.
- Art Director: corner ownership, lip/gum layering, cheek compression, lower-jaw attachment, and expression range.
- Designer: 18 static SVG mouth assets.
- Creative Technologist and JavaScript Specialist: stable IDs, compatibility, exact pair plates, deterministic fixtures, and tests.
- Independent QA reviewer: flip, clipping, transparent edges, and 96 px / 48 px readability.

## Coverage

The pack covers sparse, crowded, tusked, buck-toothed, zipper-like, gummy, fang-led, open-roar, underbite, and tongue-led families. Every candidate has authored full-canvas geometry, a seam profile, a safe review bound, compatibility classification against all six v9 bases, a rigid placement override for its review pairing, and an exact pair-specific mouth junction plate.

## Runtime boundary

Runtime may select, position, uniformly scale, rotate, clip, mask, mirror, composite, finish, and export approved assets. It may not generate paths, infer landmarks, morph anatomy, distort assets non-uniformly, or count recolors as new anatomy.

## QA

Run:

```bash
node tests/v10-mouths.test.js
node scripts/v10-mouth-qa.js --validate-only
node scripts/v10-mouth-qa.js --write
```

The writer produces deterministic contact sheets for normal and flipped compositions on cream, white, black, and transparent backgrounds at 100%, 25%, 192 px, 96 px, and 48 px, plus a machine-readable validation report. Candidate status remains separate from human approval.
