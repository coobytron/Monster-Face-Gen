# V10 nose and snout candidate pack

Issue #42 adds 18 authored nose and snout candidates to the nine-part v9 baseline, reaching the V10 target of 27. The supplied MVP boards and the existing Monster Face Generator library remain the visual source of truth.

## Art direction range

The pack covers tiny button, broad animal, hooked, pig-like, skull cavity, beak-adjacent, wrinkled, flat, long, asymmetrical, stitched, soft/cute, and sharp/creepy constructions. These are independently drawn silhouettes rather than color variants. Large forms preserve the eye-first hierarchy; lower bounds remain inside the shared nose-safe region so a nose cannot claim the mouth zone accidentally.

## Runtime contract

- `assets/v10-nose-assets-01.js` and `assets/v10-nose-assets-02.js` contain literal 600 × 600 authored SVG objects.
- `assets/v10-noses.js` registers those objects by stable ID without drawing or deforming geometry.
- `assets/v10-nose-compatibility.js` classifies every candidate against all 18 current bases.
- `assets/v10-nose-placements.js` records one approved rigid placement fixture per candidate.
- Every candidate carries an anchor, authored bounds, z-order, base list, flip-safe declaration, and candidate status.

All assets in this pack are **agent-assisted candidates pending human Art Director approval**. Passing automated QA is not production approval.

## Review

Run `npm run v10:noses` to validate the contract and write review boards. The deterministic boards show each chosen base pairing, its flipped state, and isolated 96 px and 48 px thumbnail reads on cream, white, black, and transparent backgrounds. The report uses a fixed timestamp and a SHA-256 source digest.

Reviewers should check nostril clarity, eye hierarchy, mouth-zone ownership, attachment to the face plane, transparent edges, and whether the silhouette adds a genuinely useful character family.
