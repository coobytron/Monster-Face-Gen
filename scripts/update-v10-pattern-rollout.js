'use strict';
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const manifestPath=path.join(ROOT,'assets','manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const pack=require('../assets/v10-patterns');
const patternManifest=require('../assets/v10-pattern-manifest.json');
const appendUnique=(list,values)=>[...new Set([...(list||[]),...values])];

manifest.files=manifest.files||{};
manifest.files.parts=appendUnique(manifest.files.parts,[
  'assets/v10-pattern-assets-01.js','assets/v10-pattern-assets-02.js','assets/v10-pattern-assets-03.js',
  'assets/v10-patterns.js','assets/v10-pattern-manifest.json'
]);
manifest.files.validation=appendUnique(manifest.files.validation,[
  'tests/v10-patterns.test.js','scripts/v10-pattern-qa.js','schemas/v10-pattern-validation-report.schema.json'
]);
manifest.files.fidelityTargets=appendUnique(manifest.files.fidelityTargets,['docs/V10-PATTERN-PACK.md']);
manifest.counts=manifest.counts||{};
Object.assign(manifest.counts,{
  patterns:pack.baselineCount+pack.assets.length,
  v10PatternCandidates:pack.assets.length,
  v10PatternFamilies:new Set(pack.assets.map(item=>item.family)).size,
  v10PatternTransparentSafe:pack.assets.filter(item=>item.transparentSafe).length
});
manifest.v10PatternContract={
  version:pack.version,revision:pack.revision,issue:pack.issue,status:pack.status,
  humanApprovalRequired:pack.humanApprovalRequired,runtimeGeometry:pack.runtimeGeometry,
  baseline:pack.baselineCount,added:pack.assets.length,target:pack.targetCount,
  families:[...new Set(pack.assets.map(item=>item.family))],
  allowedBlendModes:pack.allowedBlendModes,
  requiredMetadata:pack.requiredMetadata,
  reviewScales:pack.reviewScales,reviewBackgrounds:pack.reviewBackgrounds,reviewStates:pack.reviewStates,
  manifest:'assets/v10-pattern-manifest.json',
  report:'generated/qa/v10-pattern-validation.json',
  contactSheet:'generated/qa/v10-pattern-contact-sheet.html'
};
manifest.validation=manifest.validation||{};
manifest.validation.commands=appendUnique(manifest.validation.commands,[
  'node tests/v10-patterns.test.js',
  'node scripts/v10-pattern-qa.js --validate-only',
  'node scripts/v10-pattern-qa.js --write'
]);
manifest.validation.v10PatternReport='generated/qa/v10-pattern-validation.json';
manifest.validation.requiresV10PatternValidation=true;
manifest.contactSheetContract=manifest.contactSheetContract||{};
manifest.contactSheetContract.v10PatternReview='18 authored surface overlays, normal and flipped, with 100%, 25%, 192 px, 96 px, and 48 px reads on cream, white, black, and transparent backgrounds';

fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');

function updateDoc(file,section){
  const target=path.join(ROOT,file),start='<!-- V10-PATTERN-PACK:START -->',end='<!-- V10-PATTERN-PACK:END -->';
  const block=`${start}\n${section.trim()}\n${end}`;
  let text=fs.readFileSync(target,'utf8'),pattern=new RegExp(`${start}[\\s\\S]*?${end}`);
  text=pattern.test(text)?text.replace(pattern,block):`${text.trimEnd()}\n\n${block}\n`;
  fs.writeFileSync(target,text);
}
updateDoc('README.md',`## V10 authored pattern and surface-detail expansion

Issue #44 adds **18 structurally distinct authored surface overlays**, bringing the selectable pattern library from 9 to the V10 target of **27**. The pack covers contour hatching, stipple, scratches, scars, patches, wrinkles, ink fills, registration offsets, fur marks, scales, freckles, crackle, stripes, pores, halftone-like dot fields, dry-brush plates, and asymmetric graphic marks. Each candidate has a stable ID, supported-base contract, fixed opacity/blend/z-order metadata, fixed export bounds, literal 600 × 600 SVG source, and transparent/background review flags. See [docs/V10-PATTERN-PACK.md](docs/V10-PATTERN-PACK.md). All additions remain candidates pending human Art Director approval.`);
updateDoc('docs/ASSET-GUIDE.md',`## V10 pattern candidate contract

Load the three \`assets/v10-pattern-assets-*\` chunks after the baseline pattern library and before \`assets/v10-patterns.js\`. Every candidate is a literal full-canvas SVG overlay with stable \`pattern-v10-*\` ID, surface family, complete current-base support metadata, fixed blend mode and opacity, z-order 35, authored bounds, thumbnail and transparent-export safety declarations, flip-safe composition behavior, runtime geometry disabled, and candidate status. The renderer may composite, clip, mirror, and export these authored plates; it may not synthesize marks, infer facial landmarks, generate anatomy, or deform the underlying character.`);

const indexPath=path.join(ROOT,'index.html');
let index=fs.readFileSync(indexPath,'utf8');
const start='<!-- V10-PATTERN-ASSETS:START -->',end='<!-- V10-PATTERN-ASSETS:END -->';
const block=`${start}
<script src="assets/v10-pattern-assets-01.js"></script><script src="assets/v10-pattern-assets-02.js"></script><script src="assets/v10-pattern-assets-03.js"></script><script src="assets/v10-patterns.js"></script>
${end}`;
const pattern=new RegExp(`${start}[\\s\\S]*?${end}`);
if(pattern.test(index)) index=index.replace(pattern,block);
else {
  const anchor='<script src="assets/parts/bases.js"></script><script src="assets/parts/eyes.js"></script><script src="assets/parts/noses.js"></script><script src="assets/parts/mouths.js"></script><script src="assets/parts/horns.js"></script><script src="assets/parts/patterns-compact.js"></script><script src="assets/parts/extras.js"></script>';
  if(!index.includes(anchor)) throw new Error(`Missing index anchor: ${anchor}`);
  index=index.replace(anchor,`${anchor}\n${block}`);
}
fs.writeFileSync(indexPath,index);

console.log(`V10 pattern rollout current: ${pack.assets.length} candidates, ${patternManifest.target} total target patterns.`);
