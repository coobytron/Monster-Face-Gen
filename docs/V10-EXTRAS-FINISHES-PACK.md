# V10 Authored Extras + Finish Pack

Issue: #45  
Status: agent candidate, pending human Art Director review  
Runtime anatomy generation: **disabled**

This pack expands the pre-drawn accessory and finish systems to the V10 targets: 27 extras and 12 finishes.

## 18 new extras

The new authored objects cover chain jewellery, cross stitches, temple bolts, hanging tags, side tufts, triple piercings, cross bandages, drool strings, slime bubbles, cheek marks, ladder scars, tiny creatures, badges, nose rings, orbiting flies, safety pins, bolt stickers, and mushroom sprouts.

Each extra is a literal full-canvas SVG with a stable ID, attachment zone, fixed bounds, full current-base support metadata, source-over composition, z-order 80, flip safety, transparent-export safety, and candidate approval state.

## 7 new finish plates

The additional deterministic finish treatments are:

1. Halftone pulp
2. Dry-brush mask
3. Chromatic edge split
4. Metallic highlight plate
5. Paper-cut shadow plate
6. Soft airbrush underpaint
7. Limited-palette risograph

The existing etched, blackwork, screenprint, distressed, and clean treatments remain intact, bringing the total to 12.

Each new finish is a literal 600 × 600 authored plate with fixed blend mode, opacity, supported backgrounds, alpha-mask-to-composed-art contract, flip safety, and transparent-export safety. The current renderer only transforms and alpha-masks these plates against already-authored monster art.

## Validation and review

Run:

```bash
node tests/v10-extras-finishes.test.js
node scripts/v10-extras-finishes-qa.js --validate-only
node scripts/v10-extras-finishes-qa.js --write
```

The write command produces a deterministic machine-readable validation report and HTML review board in `generated/qa/`. Review cream, white, black, and transparent states at 100%, 25%, 192 px, 96 px, and 48 px, normal and flipped.

Passing automated QA does not promote any candidate. Human Art Director approval remains required.
