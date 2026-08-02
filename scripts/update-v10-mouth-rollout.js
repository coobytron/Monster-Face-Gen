'use strict'
const fs=require('fs')
const path=require('path')
const ROOT=path.resolve(__dirname,'..')
const manifestPath=path.join(ROOT,'assets','manifest.json')
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'))
const source=JSON.parse(fs.readFileSync(path.join(ROOT,'assets','v10-mouth-manifest.json'),'utf8'))
const appendUnique=(list,values)=>[...new Set([...(list||[]),...values])]
manifest.files=manifest.files||{}
manifest.files.parts=appendUnique(manifest.files.parts,["assets/v10-mouth-assets-01.js","assets/v10-mouth-assets-02.js","assets/v10-mouth-assets-03.js","assets/v10-mouth-fixtures.js","assets/v10-mouths.js"])
manifest.files.pairJunctions=appendUnique(manifest.files.pairJunctions,["assets/v10-mouth-junctions-01.js","assets/v10-mouth-junctions-02.js","assets/v10-mouth-junctions-03.js","assets/v10-mouth-junctions-04.js","assets/v10-mouth-junctions-05.js","assets/v10-mouth-integration-data.js","assets/v10-mouth-integration.js"])
manifest.files.validation=appendUnique(manifest.files.validation,['tests/v10-mouths.test.js','scripts/v10-mouth-qa.js','schemas/v10-mouth-validation-report.schema.json'])
manifest.files.fidelityTargets=appendUnique(manifest.files.fidelityTargets,['docs/V10-MOUTH-PACK.md'])
manifest.counts=manifest.counts||{}
Object.assign(manifest.counts,{mouths:27,pairSpecificMouthJunctions:34,pairSpecificJunctions:50,totalAuthoredVisualObjects:198,v10MouthCandidates:18,v10MouthCandidatePairJunctions:18})
manifest.v10MouthContract={version:10,revision:'10.1.0',issue:34,status:'candidate',humanApprovalRequired:true,runtimeGeometry:false,baseline:9,added:18,target:27,manifest:'assets/v10-mouth-manifest.json',families:source.requiredFamilies,reviewScales:source.reviewScales,reviewBackgrounds:source.reviewBackgrounds,reviewOrientations:source.reviewOrientations,exactPairKeys:source.fixtures.map(item=>item.pairKey),report:'generated/qa/v10-mouths/validation-report.json'}
manifest.validation=manifest.validation||{}
manifest.validation.commands=appendUnique(manifest.validation.commands,['node tests/v10-mouths.test.js','node scripts/v10-mouth-qa.js --validate-only','node scripts/v10-mouth-qa.js --write'])
manifest.validation.v10MouthReport='generated/qa/v10-mouths/validation-report.json'
manifest.validation.requiresV10MouthValidation=true
manifest.contactSheetContract=manifest.contactSheetContract||{}
manifest.contactSheetContract.v10MouthReview='18 candidate mouths with exact base-pair plates, normal and flipped, on cream, white, black, and transparent at 100 percent, 25 percent, 192 px, 96 px, and 48 px'
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n')
function updateDoc(file,section){const p=path.join(ROOT,file),start='<!-- V10-MOUTH-PACK:START -->',end='<!-- V10-MOUTH-PACK:END -->',block=`${start}\n${section.trim()}\n${end}`;let text=fs.readFileSync(p,'utf8');const pattern=new RegExp(`${start}[\\s\\S]*?${end}`);text=pattern.test(text)?text.replace(pattern,block):`${text.trimEnd()}\n\n${block}\n`;fs.writeFileSync(p,text)}
updateDoc('README.md',`## V10 authored mouth expansion\n\nIssue #34 adds 18 static mouth candidates, bringing the authored library to 27 mouths. Every candidate has stable metadata, all-base compatibility classification, a rigid review placement, an exact pair-specific junction plate, and deterministic normal/flipped QA across four backgrounds and five scales. See [docs/V10-MOUTH-PACK.md](docs/V10-MOUTH-PACK.md). Human Art Director approval remains required before production promotion.`)
updateDoc('docs/ASSET-GUIDE.md',`## V10 mouth candidate contract\n\nLoad \`assets/v10-mouths.js\` after the v9 mouth replacements and \`assets/v10-mouth-integration.js\` after pair junctions plus compatibility. New mouths are full-canvas authored SVGs with stable \`mouth-*\` IDs, explicit mouth-family and seam-profile metadata, runtime geometry disabled, and candidate review status. Exact pair plates may contain only local overlap, cheek/lip covers, short folds, cast shadow, edge highlight, and local distress; they must not contain standalone mouth anatomy.`)
console.log('V10 mouth rollout manifest and docs are current.')
