'use strict';
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const manifestPath=path.join(ROOT,'assets','manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const pack=require('../assets/v10-eyes');
const compatibility=require('../assets/v10-eye-compatibility');
const placements=require('../assets/v10-eye-placements');
const appendUnique=(list,values)=>[...new Set([...(list||[]),...values])];

manifest.files=manifest.files||{};
manifest.files.parts=appendUnique(manifest.files.parts,[
  'assets/v10-eye-assets-01.js','assets/v10-eye-assets-02.js','assets/v10-eyes.js','assets/v10-eye-manifest.json'
]);
manifest.files.pairJunctions=appendUnique(manifest.files.pairJunctions,[
  'assets/v10-eye-compatibility.js','assets/v10-eye-placements.js','assets/v10-eye-integration.js'
]);
manifest.files.validation=appendUnique(manifest.files.validation,[
  'tests/v10-eyes.test.js','scripts/v10-eye-qa.js','schemas/v10-eye-validation-report.schema.json'
]);
manifest.files.fidelityTargets=appendUnique(manifest.files.fidelityTargets,['docs/V10-EYE-PACK.md']);

manifest.counts=manifest.counts||{};
Object.assign(manifest.counts,{
  eyes:pack.baselineCount+pack.assets.length,
  v10EyeCandidates:pack.assets.length,
  v10EyeApprovedBasePairs:Object.values(compatibility).reduce((sum,item)=>sum+(item.approved||[]).length,0),
  v10EyeRigidPlacements:Object.keys(placements).length,
  v10EyeFamilies:new Set(pack.assets.map(item=>item.family)).size
});

manifest.v10EyeContract={
  version:pack.version,revision:pack.revision,issue:pack.issue,status:pack.status,
  humanApprovalRequired:pack.humanApprovalRequired,runtimeGeometry:pack.runtimeGeometry,
  baseline:pack.baselineCount,added:pack.assets.length,target:pack.targetCount,
  families:pack.requiredFamilies,expressions:pack.requiredExpressions,
  reviewScales:pack.reviewScales,reviewBackgrounds:pack.reviewBackgrounds,reviewStates:pack.reviewStates,
  compatibility:'assets/v10-eye-compatibility.js',
  placements:'assets/v10-eye-placements.js',
  integration:'assets/v10-eye-integration.js',
  report:'generated/qa/v10-eyes/validation-report.json',
  contactSheet:'generated/qa/v10-eyes/contact-sheet.html'
};

manifest.validation=manifest.validation||{};
manifest.validation.commands=appendUnique(manifest.validation.commands,[
  'node tests/v10-eyes.test.js',
  'node scripts/v10-eye-qa.js --validate-only',
  'node scripts/v10-eye-qa.js --write'
]);
manifest.validation.v10EyeReport='generated/qa/v10-eyes/validation-report.json';
manifest.validation.requiresV10EyeValidation=true;
manifest.contactSheetContract=manifest.contactSheetContract||{};
manifest.contactSheetContract.v10EyeReview='20 authored eye candidates with complete base classifications and rigid review fixtures, normal and flipped, at 100%, 96 px, and 48 px on cream, white, black, and transparent backgrounds';
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');

function updateDoc(file,section){
  const target=path.join(ROOT,file),start='<!-- V10-EYE-PACK:START -->',end='<!-- V10-EYE-PACK:END -->';
  const block=`${start}\n${section.trim()}\n${end}`;
  let text=fs.readFileSync(target,'utf8'),pattern=new RegExp(`${start}[\\s\\S]*?${end}`);
  text=pattern.test(text)?text.replace(pattern,block):`${text.trimEnd()}\n\n${block}\n`;
  fs.writeFileSync(target,text);
}
updateDoc('README.md',`## V10 authored expressive eye expansion

Issue #41 provides **20 structurally distinct pre-drawn eye candidates**, bringing the eye library from 10 to the V10 target of **30**. The rollout covers cyclops, multi-eye, drooping, wide-startled, tiny-beady, mismatched, half-lidded, feral, sleepy, stern, goofy, uneasy, glassy, scarred, and mechanical-adjacent systems. This integration completes the missing browser loader, complete 18-base compatibility classifications, rigid review placements, deterministic QA, and manifest contract from the original eye PR. See [docs/V10-EYE-PACK.md](docs/V10-EYE-PACK.md). All V10 eyes remain candidates pending human Art Director approval.`);
updateDoc('docs/ASSET-GUIDE.md',`## V10 eye candidate contract

Load the two \`assets/v10-eye-assets-*\` chunks, then \`assets/v10-eye-compatibility.js\`, \`assets/v10-eye-placements.js\`, and \`assets/v10-eyes.js\`. After the base compatibility matrix is available, load \`assets/v10-eye-integration.js\`. Every V10 eye is a literal full-canvas SVG with stable \`eye-v10-*\` ID, expression/family tags, complete 18-base compatibility classification, one approved rigid review placement, flip-safe and thumbnail-safe metadata, runtime geometry disabled, and candidate approval status. The integration mutates compatibility lists and fixed placement overrides only; it never generates or deforms eye anatomy.`);

const indexPath=path.join(ROOT,'index.html');
let index=fs.readFileSync(indexPath,'utf8');
const assetStart='<!-- V10-EYE-ASSETS:START -->',assetEnd='<!-- V10-EYE-ASSETS:END -->';
const assetBlock=`${assetStart}
<script src="assets/v10-eye-assets-01.js"></script><script src="assets/v10-eye-assets-02.js"></script><script src="assets/v10-eye-compatibility.js"></script><script src="assets/v10-eye-placements.js"></script><script src="assets/v10-eyes.js"></script>
${assetEnd}`;
const integrationStart='<!-- V10-EYE-INTEGRATION:START -->',integrationEnd='<!-- V10-EYE-INTEGRATION:END -->';
const integrationBlock=`${integrationStart}
<script src="assets/v10-eye-integration.js"></script>
${integrationEnd}`;
function upsertAfter(text,start,end,anchor,block){
  const pattern=new RegExp(`${start}[\\s\\S]*?${end}`);
  if(pattern.test(text))return text.replace(pattern,block);
  if(!text.includes(anchor))throw new Error(`Missing index anchor: ${anchor}`);
  return text.replace(anchor,`${anchor}\n${block}`);
}
index=upsertAfter(index,assetStart,assetEnd,'<script src="assets/hero-v9/bases.js"></script><script src="assets/hero-v9/eyes.js"></script><script src="assets/hero-v9/noses.js"></script><script src="assets/hero-v9/mouths.js"></script><script src="assets/hero-v9/horns.js"></script>',assetBlock);
index=upsertAfter(index,integrationStart,integrationEnd,'<script src="assets/hybrid-bundles.js"></script><script src="assets/finishes.js"></script><script src="assets/junctions.js"></script><script src="assets/pair-junctions.js"></script><script src="assets/compatibility.js"></script>',integrationBlock);
fs.writeFileSync(indexPath,index);

console.log(`V10 eye rollout current: ${pack.assets.length} candidates, ${pack.baselineCount+pack.assets.length} total eyes, ${Object.keys(placements).length} rigid fixtures.`);
