# MVP Fidelity Targets — v9 Baseline

## Purpose

This document translates the supplied MVP reference boards into a stable, measurable art-direction target for the pre-drawn builder. It is the dependency gate for the v9 fidelity track.

The project remains completely pre-drawn. Runtime code may select, position, transform, layer, clip, mask, finish, and export approved assets. It must not generate, infer, morph, or procedurally draw monster anatomy.

## Reference sources

The visual source of truth is the supplied MVP board set associated with this repository and project. Repository-safe review pointers are:

- `generated/qa/approved-recipes-high-resolution-cream.png`
- `generated/qa/approved-recipes-high-resolution-white.png`
- `generated/qa/approved-recipes-high-resolution-black.png`
- `generated/qa/approved-recipes-high-resolution-transparent.png`
- `generated/qa/approved-recipes-finishes-cream.png`
- `generated/qa/mouth-base-cream.png`
- `generated/qa/horn-base-cream.png`

Do not copy flattened reference-board artwork into runtime assets. Production replacements should come from authored layered artwork and retain the stable IDs below.

## Locked hero recipes

These three recipes are the required baseline for all later fidelity work. They intentionally cover a rounded/blob silhouette, a furry broken silhouette, and an imp-like silhouette, while exercising three mouth families and three attachment-root conditions.

### Hero A — Bog Cyclops Grin

**Recipe ID:** `bog-cyclops-grin`  
**Expression:** `stern`  
**Silhouette profile:** `rounded-lopsided`

| Family | Stable ID |
|---|---|
| Base | `base-bog` |
| Eyes | `eye-cyclops` |
| Nose | `nose-button` |
| Mouth | `mouth-grin` |
| Horns / ears | `horn-curved` |
| Pattern | `pattern-spots` |
| Extra | `extra-earring` |
| Mouth seam | `mouth-seam-base-bog` |
| Horn seam | `horn-seam-curved` |
| Default review finish | `finish-etched` |

**What this recipe tests**

- Soft, offset dome with a wide dropping jaw and shallow chin notch.
- One dominant eye as the unmistakable first read.
- A broad grin whose gum, lip, tooth cadence, and corners remain owned by the mouth asset.
- Curved crown horns that feel grown into the head instead of placed behind it.
- Asymmetry that remains intentional after horizontal flip.

### Hero B — Fanged Fuzz

**Recipe ID:** `fuzz-fanged`  
**Expression:** `stern`  
**Silhouette profile:** `fur-broken-pear`

| Family | Stable ID |
|---|---|
| Base | `base-fuzz` |
| Eyes | `eye-sleepy` |
| Nose | `nose-hook` |
| Mouth | `mouth-fangs` |
| Horns / ears | `horn-bent` |
| Pattern | `pattern-stripes` |
| Extra | `extra-scar` |
| Mouth seam | `mouth-seam-base-fuzz` |
| Horn seam | `horn-seam-bent` |
| Default review finish | `finish-etched` |

**What this recipe tests**

- A tufted crown, ragged cheeks, tapered fur jaw, and split-tuft chin.
- Fur rhythm that reads as a designed silhouette rather than noisy edge decoration.
- Sleepy eyelids paired with a fanged mouth without losing the stern expression.
- Fang and gum ownership, especially at the corners and lower-lip overlap.
- Bent crown horns integrated into an irregular furry edge.

### Hero C — Boiler Roar

**Recipe ID:** `imp-roar`  
**Expression:** `startled`  
**Silhouette profile:** `compressed-round`

| Family | Stable ID |
|---|---|
| Base | `base-imp` |
| Eyes | `eye-wide` |
| Nose | `nose-piggy` |
| Mouth | `mouth-roar` |
| Horns / ears | `horn-spiky` |
| Pattern | `pattern-freckles` |
| Extra | `extra-spikes` |
| Mouth seam | `mouth-seam-base-imp` |
| Horn seam | `horn-seam-spiky` |
| Default review finish | `finish-etched` |

**What this recipe tests**

- Compact imp proportions with a low crown, interrupted cheeks, heavy round jaw, and center-drop chin.
- Wide eyes and open roar working as one immediate expression.
- The largest mouth aperture in the approved library, including clipping, cheek compression, gums, teeth, tongue/interior ownership, and lower-lip mass.
- High spiky crown roots under the most aggressive silhouette condition.
- Strong readability at thumbnail size without detail turning to visual noise.

## Measurable art-direction targets

### 1. Silhouette rhythm

Review the outer contour before internal detail.

- The crown, cheeks, jaw, and chin must form four legible beats rather than one uniform blob.
- Large contour decisions must survive at 96 px and 48 px thumbnails.
- Fur and spikes must reinforce the primary mass; they must not create an evenly noisy perimeter.
- Each hero must remain identifiable from a solid black silhouette.
- Left/right imbalance is encouraged where authored, but accidental dents, tangent collisions, and detached appendages are failures.

### 2. Expression and first-read hierarchy

Required read order:

1. eye / eyelid expression
2. mouth expression
3. silhouette and horn/ear attitude
4. surface detail and finish

At thumbnail size, the assigned expression must be identifiable without relying on pattern, extra, or finish layers. Finishes may amplify the expression but must never replace it.

### 3. Eye and eyelid construction

- Eyelids, pupils, sclera, sockets, brows, and surrounding wrinkles remain authored anatomy inside the eye asset.
- Upper lids should carry more visual weight than lower lids unless the approved eye family intentionally reverses that hierarchy.
- Pupil direction and lid compression must agree with the assigned expression.
- Eye edges must not be obscured by finish texture at 96 px.
- Cyclops, sleepy, and wide-eye families must remain visibly distinct when rendered without pattern or extras.

### 4. Mouth, gum, tooth, and lip ownership

- Mouth interiors, gums, lips, teeth, fangs, tongue, apertures, and corner anatomy belong to the mouth asset.
- The base-specific mouth seam may only cover joins, restore cheek colour, add short overlap shadows, and reinforce local lip edges.
- Teeth must show deliberate cadence: varied size and spacing, but no accidental mergers or floating teeth.
- Gum ridges must support the mouth family and remain distinct from the base seam.
- The lower lip must read as one owned form and must not be split visually between mouth and base.
- Mouth corners must terminate cleanly inside the head silhouette in both normal and flipped states.

### 5. Horn / ear root integration

- Horns and ears render behind the base, then receive an authored root seam.
- Root integration must show compression, overlap, or contour folding appropriate to the base profile.
- A visible gap, hard tangent, uniform sticker-like overlap, or root that changes perceived position after flip is a failure.
- Root seams are non-anatomical transition plates. They must not read as standalone horn or ear geometry.
- Review at 100%, 25%, 96 px, and flipped.

### 6. Line-weight hierarchy

Use three visible levels:

1. **Primary contour:** strongest weight around the outer silhouette and major mouth aperture.
2. **Secondary anatomy:** medium weight around eyes, lids, gums, major wrinkles, horn ridges, and lip ownership.
3. **Tertiary texture:** light hatching, pores, fur marks, stipple, scratches, and print wear.

Primary contours must not be diluted by finish plates. Tertiary marks must not become as dark or continuous as anatomy boundaries.

### 7. Detail and finish density

The reference style is richly authored but not uniformly busy.

- Concentrate hatching and stipple in shadow turns, cheek compression, sockets, horn roots, and under-lip zones.
- Preserve quiet zones around the first-read eye and key mouth shapes.
- Highlight cuts should interrupt dark masses selectively, not outline every form.
- Shadow masses should support volume and expression without filling small eye or tooth gaps.
- Distress and print wear must read as surface treatment, never anatomy.
- `finish-clean` must remain a valid anatomy-review state.
- `finish-etched` is the locked default for v9 hero comparison.

### 8. Thumbnail legibility

Review all heroes at 192 px, 96 px, and 48 px.

Passing behavior:

- Hero identity remains distinct.
- Expression remains readable at 96 px.
- Eye count and mouth family remain recognizable at 48 px.
- Horn/ear type remains recognizable at 96 px.
- Teeth do not collapse into a single white bar.
- Hatching and wear do not create false facial features.

### 9. Flip safety

The complete authored composition, pair overrides, clipping, mouth seams, horn-root seams, extras, and finishes mirror together.

A flipped hero must preserve:

- attachment depth and root contact
- mouth corner containment
- eye-to-mouth expression relationship
- line-weight hierarchy
- silhouette balance
- readable extras

Asymmetry may reverse; quality must not.

## Authored anatomy versus non-anatomical support

| Authored anatomy | Non-anatomical support |
|---|---|
| bases and head silhouettes | mouth/base transition plates |
| eyes, lids, pupils, brows, sockets | horn/ear root transition plates |
| noses and snouts | hatching and stipple plates |
| mouths, gums, lips, teeth, fangs, tongues | shadow-mass and highlight-cut plates |
| horns and ears | registration accents, scratches, distress, print wear |
| surface patterns that depict bodily marks | clipping, masking, rigid placement, mirroring, export framing |
| extras that depict attached bodily or prop forms | QA labels and review backgrounds |

Support layers may improve integration and finish but may not create anatomy that reads independently.

## Scored baseline

Scores use a 1–5 scale where `1` is substantially below the supplied MVP target and `5` matches the target closely enough to lock for production. These are before-state audit scores, not acceptance scores for later work.

| Hero recipe | Silhouette strength | Attachment integration | Expression read | Detail density | Thumbnail read | MVP similarity | Baseline total / 30 |
|---|---:|---:|---:|---:|---:|---:|---:|
| `bog-cyclops-grin` | 4 | 3 | 4 | 3 | 4 | 3 | 21 |
| `fuzz-fanged` | 3 | 3 | 3 | 3 | 3 | 3 | 18 |
| `imp-roar` | 4 | 3 | 4 | 3 | 4 | 3 | 21 |

### Baseline interpretation

- **Bog Cyclops Grin:** strongest immediate identity and eye hierarchy; needs more convincing crown-root compression and richer controlled finish density.
- **Fanged Fuzz:** most demanding silhouette; fur rhythm, horn integration, and expression unity are the primary improvement targets.
- **Boiler Roar:** strongest stress test for clipping and expression; mouth/base ownership and high-root integration remain the key fidelity gaps.

## Acceptance target for later v9 issues

A later implementation may claim hero-target completion only when:

- no category scores below `4`
- MVP similarity is at least `4` for all three heroes
- no regression in stable IDs, compatibility, expression assignment, flip safety, or QA validation
- before/after contact sheets are included at matching scale and background
- no runtime anatomy generation is introduced

## Review procedure

1. Run `npm ci`, `npm test`, and `npm run qa`.
2. Open the cream high-resolution approved-recipe sheet.
3. Locate `bog-cyclops-grin`, `fuzz-fanged`, and `imp-roar` by stable recipe ID.
4. Compare each against this document at 100%, 25%, 96 px, and 48 px.
5. Repeat on white, black, and transparent backgrounds.
6. Review unflipped and flipped mouth/base and horn/base sheets for the selected stable IDs.
7. Confirm finishes and seams remain non-anatomical in isolation.
8. Record updated scores in the implementing pull request without changing this baseline silently.

## Dependency gate

Issues 02–06 in the v9 MVP-fidelity sequence must use these three stable recipe IDs and this scoring rubric. Changes to the locked heroes or rubric require an explicit art-direction review and an update to this document.