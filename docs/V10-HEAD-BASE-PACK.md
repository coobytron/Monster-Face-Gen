# V10 Authored Head-Base Pack

Issue #40 expands the pre-drawn head-base library from 6 to 18 stable authored bases. The 12 additions are production candidates pending human art-direction approval.

## Agent Cody Banks team

- Producer: scope, branch isolation, review gates, and delivery record.
- Creative Director: fidelity to the supplied MVP boards and the authored-only premise.
- Art Director: silhouette family, line hierarchy, texture, and candidate review.
- Designer: 12 static SVG head bases, normalised to the shared canvas.
- Creative Technologist and JavaScript Specialist: manifest metadata, integration zones, compatibility, seams, exact pair plates, and deterministic previews.
- Independent QA reviewer: structural distinction, crop, scale, transparency, flip safety, and compatibility readiness.

## Coverage

One base per required character direction:

| ID | Name | Archetype |
|---|---|---|
| `base-cyclops-dome` | Dome Cyclops | cyclops |
| `base-multi-eye-cluster` | Cluster Watcher | multi-eye |
| `base-skull-cracked` | Split Cranium | skull-like |
| `base-furry-mane` | Mane Mop | furry |
| `base-blob-melt` | Melt Blob | blob |
| `base-imp-compact` | Pocket Imp | compact-imp |
| `base-long-face` | Long Lantern | long-face |
| `base-squat-slab` | Squat Slab | squat |
| `base-soft-pillow` | Pillow Pal | soft-cute |
| `base-sharp-shard` | Shard Creep | sharp-creepy |
| `base-calm-stone` | Calm Stone | calm |
| `base-wild-bramble` | Bramble Wild | wild |

Every candidate keeps the MVP's chunky asymmetry, eye-first hierarchy, hand-inked materiality, and a strong thumbnail read: a screenprint registration offset, contour hatching, stipple, and distress ticks sit on a heavy `#171512` outline.

## Integration zones

Each base publishes explicit `integrationZones` in canvas coordinates as `[x, y, width, height]`:

- `mouth` — the authored mouth landing area, always inside the shared mouth-safe band (`x >= 100`, `y >= 340`, `x + w <= 500`, `y + h <= 570`).
- `crown` — the horn or ear root band.
- `eyes` and `nose` — the remaining placement bands, published for downstream recipe work.

QA flattens the authored silhouette and proves that the mouth zone corners and centre, and the crown zone's lower edge, all fall inside the outline. Nothing here is inferred at runtime; the zones are authored numbers checked against authored geometry.

## Structural distinction

A silhouette descriptor blends a 48-bin radial profile with proportion, coverage, outline complexity, and vertical mass. Distinction is calibrated against the shipped library rather than a guessed constant: the closest approved v9 pair sets the floor, and every pair involving a new base must clear it. A recolour of an existing base scores zero and is rejected.

## Compatibility and seams

Each new base classifies the entire catalogue — 10 eye sets, 9 noses, 27 mouths (9 v9 plus the 18 V10 candidates), and 9 horn or ear crowns — as approved, acceptable, or blocked. Each base also ships a fallback mouth seam and a fallback crown seam, plus an exact pair plate for its reviewed mouth and crown pairing with a rigid placement override. Plates carry only local overlap, cheek or lip cover, short folds, horn-root folds, cast shadow, edge highlight, and local distress; they never carry standalone anatomy.

Clip safety is proved geometrically: every authored point of the placed mouth must land inside the base silhouette, and each crown root must overlap the crown zone and land on the silhouette.

## Runtime boundary

Runtime may select, position, uniformly scale, rotate, clip, mask, mirror, composite, finish, and export approved assets. It may not generate paths, infer landmarks, morph anatomy, distort assets non-uniformly, or count recolours as new anatomy. The candidates are deliberately not wired into `index.html`; they stay out of the shipping picker until an Art Director approves them, exactly as the V10 mouth pack does.

## QA

```bash
node tests/v10-heads.test.js
node scripts/v10-head-qa.js --validate-only
node scripts/v10-head-qa.js --write
```

The writer produces deterministic contact sheets for normal and flipped compositions on cream, white, black, and transparent backgrounds at 100%, 25%, 192 px, 96 px, and 48 px, plus a machine-readable validation report at `generated/qa/v10-heads/validation-report.json`. Candidate status remains separate from human approval.
