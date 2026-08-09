'use strict';
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const manifestPath=path.join(ROOT,'assets','manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const pack=require('../assets/v10-crowns');
const compatibility=require('../assets/v10-crown-compatibility');
const placements=require('../assets/v10-crown-placements');
const appendUnique=(list,values)=>[...new Set([...(list||[]),...values])];

manifest.files=manifest.files||{};
manifest.files.parts=appendUnique(manifest.files.parts,[
  'assets/v10-crown-assets-01.js','assets/v10-crown-assets-02.js','assets/v10-crown-assets-03.js',
  'assets/v10-crowns.js','assets/v10-crown-manifest.json'
]);
manifest.files.pairJunctions=appendUnique(manifest.files.pairJunctions,[
  'assets/v10-crown-compatibility.js','assets/v10-crown-placements.js','assets/v10-crown-integration.js'
]);
manifest.files.validation=appendUnique(manifest.files.validation,[
  'tests/v10-crowns.test.js','scripts/v10-crown-qa.js','schemas/v10-crown-validation-report.schema.json'
]);
manifest.files.fidelityTargets=appendUnique(manifest.files.fidelityTargets,['docs/V10-CROWN-PACK.md']);
manifest.counts=manifest.counts||{};
Object.assign(manifest.counts,{
  horns:pack.baselineCount+pack.assets.length,
  v10CrownCandidates:pack.assets.length,
  v10CrownApprovedBasePairs:Object.values(compatibility).reduce((sum,item)=>sum+item.approved.length,0),
  v10CrownExactRootPairs:Object.keys(placements).length
});
manifest.v10CrownContract={
  version:pack.version,revision:pack.revision,issue:pack.issue,status:pack.status,
  humanApprovalRequired:pack.humanApprovalRequired,runtimeGeometry:pack.runtimeGeometry,
  baseline:pack.baselineCount,added:pack.assets.length,target:pack.targetCount,
  families:pack.requiredFamilies,kinds:[...new Set(pack.assets.map(item=>item.kind))],
  reviewScales:pack.reviewScales,reviewBackgrounds:pack.reviewBackgrounds,reviewStates:pack.reviewStates,
  compatibility:'assets/v10-crown-compatibility.js',
  placements:'assets/v10-crown-placements.js',
  integration:'assets/v10-crown-integration.js',
  report:'generated/qa/v10-crowns/validation-report.json'
};
manifest.validation=manifest.validation||{};
manifest.validation.commands=appendUnique(manifest.validation.commands,[
  'node tests/v10-crowns.test.js',
  'node scripts/v10-crown-qa.js --validate-only',
  'node scripts/v10-crown-qa.js --write'
]);
manifest.validation.v10CrownReport='generated/qa/v10-crowns/validation-report.json';
manifest.validation.requiresV10CrownValidation=true;
manifest.contactSheetContract=manifest.contactSheetContract||{};
manifest.contactSheetContract.v10CrownReview='18 authored horn and ear candidates on approved exact-root fixtures, normal and flipped, with 96 px and 48 px reads on cream, white, black, and transparent backgrounds';
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');

function updateDoc(file,section){
  const target=path.join(ROOT,file),start='<!-- V10-CROWN-PACK:START -->',end='<!-- V10-CROWN-PACK:END -->';
  const block=`${start}\n${section.trim()}\n${end}`;
  let text=fs.readFileSync(target,'utf8'),pattern=new RegExp(`${start}[\\s\\S]*?${end}`);
  text=pattern.test(text)?text.replace(pattern,block):`${text.trimEnd()}\n\n${block}\n`;
  fs.writeFileSync(target,text);
}
updateDoc('README.md',`## V10 authored horn and ear crown expansion

Issue #43 adds **18 structurally distinct horn and ear candidates**, bringing the authored library to the V10 target of **27 crown systems**. The range includes broken, curled, stubby, spiked, antler-like, soft ear, bat ear, drooping, asymmetrical, single-horn, crown-cluster, bone-like, furry-root, compact-imp, fin, goblin, thorn-halo, and moth directions. Every candidate has a stable ID, root profile, complete 18-base compatibility classification, rigid placement fixture, exact non-anatomical root plate, and flip-safe review contract. See [docs/V10-CROWN-PACK.md](docs/V10-CROWN-PACK.md). All additions remain candidates pending human Art Director approval.`);
updateDoc('docs/ASSET-GUIDE.md',`## V10 crown candidate contract

Load the three \`assets/v10-crown-assets-*\` chunks before \`assets/v10-crowns.js\`. Load compatibility and exact-root fixtures after the existing compatibility object, then install \`assets/v10-crown-integration.js\`. Every crown is a literal full-canvas SVG with stable \`horn-v10-*\` ID, crown kind, family, root profile, authored bounds, rigid review placement, flip-safe flag, runtime geometry disabled, and candidate status. Every candidate must classify all 18 current bases exactly once and publish one approved exact root fixture whose transition plate declares \`standaloneAnatomy: false\`.`);

const indexPath=path.join(ROOT,'index.html');
let index=fs.readFileSync(indexPath,'utf8');
const assetStart='<!-- V10-CROWN-ASSETS:START -->',assetEnd='<!-- V10-CROWN-ASSETS:END -->';
const assetBlock=`${assetStart}
<script src="assets/v10-crown-assets-01.js"></script><script src="assets/v10-crown-assets-02.js"></script><script src="assets/v10-crown-assets-03.js"></script><script src="assets/v10-crowns.js"></script>
${assetEnd}`;
const integrationStart='<!-- V10-CROWN-INTEGRATION:START -->',integrationEnd='<!-- V10-CROWN-INTEGRATION:END -->';
const integrationBlock=`${integrationStart}
<script src="assets/v10-crown-compatibility.js"></script><script src="assets/v10-crown-placements.js"></script><script src="assets/v10-crown-integration.js"></script>
${integrationEnd}`;
function upsertAfter(text,start,end,anchor,block){
  const pattern=new RegExp(`${start}[\\s\\S]*?${end}`);
  if(pattern.test(text))return text.replace(pattern,block);
  if(!text.includes(anchor))throw new Error(`Missing index anchor: ${anchor}`);
  return text.replace(anchor,`${anchor}\n${block}`);
}
index=upsertAfter(index,assetStart,assetEnd,'<script src="assets/hero-v9/horns.js"></script>',assetBlock);
index=upsertAfter(index,integrationStart,integrationEnd,'<script src="assets/hybrid-bundles.js"></script><script src="assets/finishes.js"></script><script src="assets/junctions.js"></script><script src="assets/pair-junctions.js"></script><script src="assets/compatibility.js"></script>',integrationBlock);
fs.writeFileSync(indexPath,index);

console.log('V10 crown rollout manifest, docs, and browser loader are current.');
