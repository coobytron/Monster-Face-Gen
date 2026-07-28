'use strict';
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const START='<!-- LIBRARY-FIDELITY-V9:START -->';
const END='<!-- LIBRARY-FIDELITY-V9:END -->';
const read=relative=>fs.readFileSync(path.join(ROOT,relative),'utf8');
const write=(relative,value)=>fs.writeFileSync(path.join(ROOT,relative),value);
function block(body){return `${START}\n${body.trim()}\n${END}`;}
function replaceBlock(source,body,beforeHeading){
  const next=block(body);const pattern=new RegExp(`${START}[\\s\\S]*?${END}`);
  if(pattern.test(source)) return source.replace(pattern,next);
  const index=source.indexOf(beforeHeading);
  return index>=0?`${source.slice(0,index)}${next}\n\n${source.slice(index)}`:`${source.trim()}\n\n${next}\n`;
}
const readmeBody=`## V9.8 reviewed-library fidelity rollout

The three locked heroes remain the visual baseline, and the same authored production method now covers the other **13 curated recipes**. The rollout adds **34 load-after stable-ID replacements** in \`assets/library-v9/\` and expands exact mouth/base and horn-or-ear/root integration from six hero plates to **32 exact pair plates** across all 16 curated recipes.

Shuffle now strongly prefers complete reviewed recipes. Its compatible mutation path keeps the reviewed mouth and horn pair locked and changes only eyes, nose, pattern, or extra, preventing a high-quality recipe from falling back to an unreviewed attachment during randomisation.

\`reviews/library-fidelity-v9.json\` records stable IDs, findings, actions, baseline/current scores, required scales, backgrounds, and pair keys for the 13 non-hero recipes. These records are **agent-assisted production candidates, not human art-direction approval**. The three hero records also remain human-confirmation-required until reviewed in the internal recipe director against the supplied MVP boards.

See \`docs/LIBRARY-FIDELITY-V9.md\` for the replacement inventory, exact-pair coverage, review workflow, and source-of-truth boundary.`;
const guideBody=`## Reviewed-library production contract

V9.8 extends the locked hero method to all 16 curated recipes without changing the pre-drawn runtime boundary.

- \`assets/library-v9/\` contains 34 original load-after replacements behind published stable IDs for the non-hero production library.
- \`assets/pair-junctions.js\` contains one exact mouth plate and one exact horn-or-ear plate for every curated recipe: 16 + 16 plates.
- Every plate remains non-anatomical support artwork and retains the exact-pair-first, generic-fallback selection rule.
- Curated shuffle keeps reviewed mouth and horn pair IDs together. Compatible mutation may change eyes, nose, pattern, or extra only.
- \`reviews/library-fidelity-v9.json\` is structured agent-assisted review evidence. It must not be converted to human-confirmed status without an art director comparing the generated boards and supplied MVP references.
- Review every recipe at 100%, 25%, 192 px, 96 px, and 48 px; flipped and unflipped; on cream, white, black, and transparent backgrounds.

Runtime code may select, rigidly place, uniformly scale, rotate, layer, clip, mask, mirror, finish, and export these authored assets. It may not generate or infer anatomy.`;
let readme=replaceBlock(read('README.md'),readmeBody,'## V9 hybrid authored asset bundles');
readme=readme.replace('Hero pair-specific mouth plates | 3','Reviewed exact mouth pair plates | 16').replace('Hero pair-specific horn plates | 3','Reviewed exact horn / ear pair plates | 16');
readme=readme.replace('The builder includes 16 complete hand-directed recipes and authored per-pair placement overrides. The three locked hero recipes additionally carry their required pair-junction keys.','The builder includes 16 complete hand-directed recipes, and every curated recipe carries exact reviewed mouth and horn-or-ear pair-junction keys plus authored rigid placement overrides.');
readme=readme.replace('The retained v7 generic assembly stages remain available for every non-hero combination:','The retained v7 generic assembly stages remain available for any compatible non-curated combination:');
write('README.md',readme);
let guide=replaceBlock(read('docs/ASSET-GUIDE.md'),guideBody,'## Hybrid authored bundle contract');
guide=guide.replace('The current required set is:','The original locked-hero set is listed below; V9.8 additionally requires both exact pair keys for every curated recipe as recorded in `assets/compatibility.js` and `reviews/library-fidelity-v9.json`:');
write('docs/ASSET-GUIDE.md',guide);
console.log('Library fidelity rollout documentation is current.');
