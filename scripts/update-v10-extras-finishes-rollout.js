'use strict';
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const manifestPath=path.join(ROOT,'assets','manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const extras=require('../assets/v10-extras');
const finishes=require('../assets/v10-finishes');
const packManifest=require('../assets/v10-extras-finishes-manifest.json');
const appendUnique=(list,values)=>[...new Set([...(list||[]),...values])];

manifest.files=manifest.files||{};
manifest.files.parts=appendUnique(manifest.files.parts,[
 'assets/v10-extra-assets-01.js','assets/v10-extra-assets-02.js','assets/v10-extra-assets-03.js',
 'assets/v10-extras.js','assets/v10-extras-finishes-manifest.json'
]);
manifest.files.finishes=appendUnique(manifest.files.finishes,['assets/v10-finish-assets.js','assets/v10-finishes.js']);
manifest.files.validation=appendUnique(manifest.files.validation,[
 'tests/v10-extras-finishes.test.js','scripts/v10-extras-finishes-qa.js','schemas/v10-extras-finishes-validation-report.schema.json'
]);
manifest.files.fidelityTargets=appendUnique(manifest.files.fidelityTargets,['docs/V10-EXTRAS-FINISHES-PACK.md']);
manifest.counts=manifest.counts||{};
Object.assign(manifest.counts,{
 extras:extras.baselineCount+extras.assets.length,
 finishes:finishes.baselineCount+finishes.assets.length,
 v10ExtraCandidates:extras.assets.length,
 v10FinishCandidates:finishes.assets.length,
 v10ExtraFamilies:new Set(extras.assets.map(x=>x.family)).size,
 v10FinishFamilies:new Set(finishes.assets.map(x=>x.family)).size,
 v10ExtrasTransparentSafe:extras.assets.filter(x=>x.transparentSafe).length,
 v10FinishesTransparentSafe:finishes.assets.filter(x=>x.transparentSafe).length
});
manifest.v10ExtrasFinishesContract={
 version:10,revision:'10.7.0',issue:45,status:'candidate',humanApprovalRequired:true,runtimeGeometry:false,
 extras:{baseline:extras.baselineCount,added:extras.assets.length,target:extras.targetCount,families:[...new Set(extras.assets.map(x=>x.family))]},
 finishes:{baseline:finishes.baselineCount,added:finishes.assets.length,target:finishes.targetCount,families:[...new Set(finishes.assets.map(x=>x.family))],allowedBlendModes:finishes.allowedBlendModes},
 reviewScales:packManifest.review.scales,reviewStates:packManifest.review.states,reviewBackgrounds:packManifest.backgrounds,
 manifest:'assets/v10-extras-finishes-manifest.json',
 report:'generated/qa/v10-extras-finishes-validation.json',
 contactSheet:'generated/qa/v10-extras-finishes-contact-sheet.html'
};
manifest.validation=manifest.validation||{};
manifest.validation.commands=appendUnique(manifest.validation.commands,[
 'node tests/v10-extras-finishes.test.js','node scripts/v10-extras-finishes-qa.js --validate-only','node scripts/v10-extras-finishes-qa.js --write'
]);
manifest.validation.v10ExtrasFinishesReport='generated/qa/v10-extras-finishes-validation.json';
manifest.validation.requiresV10ExtrasFinishesValidation=true;
manifest.contactSheetContract=manifest.contactSheetContract||{};
manifest.contactSheetContract.v10ExtrasFinishesReview='18 authored extras and 7 authored finish plates, normal and flipped, at 100%, 25%, 192 px, 96 px, and 48 px across cream, white, black, and transparent backgrounds';
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');

function updateDoc(file,section){
 const target=path.join(ROOT,file),start='<!-- V10-EXTRAS-FINISHES:START -->',end='<!-- V10-EXTRAS-FINISHES:END -->';
 const block=`${start}\n${section.trim()}\n${end}`; let text=fs.readFileSync(target,'utf8'),pattern=new RegExp(`${start}[\\s\\S]*?${end}`);
 text=pattern.test(text)?text.replace(pattern,block):`${text.trimEnd()}\n\n${block}\n`; fs.writeFileSync(target,text);
}
updateDoc('README.md',`## V10 extras and deterministic finish expansion

Issue #45 adds **18 structurally distinct authored extras** and **7 authored finish plates**, reaching the V10 targets of **27 extras** and **12 finishes**. Extras include jewellery, stitches, bolts, tags, tufts, piercings, bandages, drool, slime, cheek marks, scars, small creatures, badges, pins, stickers, and sprouts. New finishes add halftone pulp, dry-brush masking, chromatic edge split, metallic highlights, paper-cut shadow, soft airbrush underpaint, and limited-palette risograph. Every addition is a fixed authored object with stable IDs and deterministic composition metadata; no runtime anatomy is generated. See [docs/V10-EXTRAS-FINISHES-PACK.md](docs/V10-EXTRAS-FINISHES-PACK.md). Human Art Director approval remains separate.`);
updateDoc('docs/ASSET-GUIDE.md',`## V10 extras and finish candidate contract

Load the three \`assets/v10-extra-assets-*\` chunks before \`assets/v10-extras.js\`; load \`assets/v10-finish-assets.js\` and \`assets/v10-finishes.js\` after the baseline \`assets/finishes.js\`. Extras are literal 600 × 600 authored SVG objects with stable \`extra-v10-*\` IDs, attachment zones, full current-base support metadata, fixed bounds, source-over composition, z-order 80, flip safety, and transparent-export safety. Finish candidates are literal 600 × 600 authored plates with stable \`finish-v10-*\` IDs, fixed blend/opacity, alpha-mask-to-composed-art contract, explicit supported backgrounds, flip safety, and transparent-export safety. Runtime may place, mirror, mask, blend, and export these sources; it may not infer landmarks, morph paths, or generate anatomy.`);

const indexPath=path.join(ROOT,'index.html'); let index=fs.readFileSync(indexPath,'utf8');
const eStart='<!-- V10-EXTRA-ASSETS:START -->',eEnd='<!-- V10-EXTRA-ASSETS:END -->';
const eBlock=`${eStart}
<script src="assets/v10-extra-assets-01.js"></script><script src="assets/v10-extra-assets-02.js"></script><script src="assets/v10-extra-assets-03.js"></script><script src="assets/v10-extras.js"></script>
${eEnd}`;
const fStart='<!-- V10-FINISH-ASSETS:START -->',fEnd='<!-- V10-FINISH-ASSETS:END -->';
const fBlock=`${fStart}
<script src="assets/v10-finish-assets.js"></script><script src="assets/v10-finishes.js"></script>
${fEnd}`;
function upsert(text,start,end,anchor,block){
 const pattern=new RegExp(`${start}[\\s\\S]*?${end}`); if(pattern.test(text)) return text.replace(pattern,block);
 if(!text.includes(anchor)) throw new Error(`Missing index anchor: ${anchor}`); return text.replace(anchor,`${anchor}\n${block}`);
}
index=upsert(index,eStart,eEnd,'<script src="assets/hero-v9/patterns.js"></script><script src="assets/hero-v9/extras.js"></script>',eBlock);
index=upsert(index,fStart,fEnd,'<script src="assets/hybrid-bundles.js"></script><script src="assets/finishes.js"></script>',fBlock);
fs.writeFileSync(indexPath,index);
console.log(`V10 extras/finishes rollout current: ${extras.assets.length} extras, ${finishes.assets.length} finishes.`);
