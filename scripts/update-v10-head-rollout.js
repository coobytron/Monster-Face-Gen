'use strict'
const fs=require('fs')
const path=require('path')
const ROOT=path.resolve(__dirname,'..')
const manifestPath=path.join(ROOT,'assets','manifest.json')
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'))
const source=JSON.parse(fs.readFileSync(path.join(ROOT,'assets','v10-head-manifest.json'),'utf8'))
const appendUnique=(list,values)=>[...new Set([...(list||[]),...values])]
manifest.files=manifest.files||{}
manifest.files.parts=appendUnique(manifest.files.parts,[...source.modules.assets,'assets/v10-head-fixtures.js','assets/v10-heads.js'])
manifest.files.pairJunctions=appendUnique(manifest.files.pairJunctions,[...source.modules.seams,...source.modules.junctions,...source.modules.compatibility,'assets/v10-head-placements.js','assets/v10-head-integration.js'])
manifest.files.validation=appendUnique(manifest.files.validation,['tests/v10-heads.test.js','scripts/v10-head-qa.js','schemas/v10-head-validation-report.schema.json'])
manifest.files.fidelityTargets=appendUnique(manifest.files.fidelityTargets,['docs/V10-HEAD-BASE-PACK.md'])
manifest.counts=manifest.counts||{}
Object.assign(manifest.counts,{
  bases:source.baselineCount+source.addedCount,
  v10HeadCandidates:source.addedCount,
  v10HeadCandidateBaseSeams:source.baseSeams.length,
  v10HeadCandidatePairJunctions:source.pairJunctions.length
})
manifest.v10HeadContract={
  version:10,revision:source.revision,issue:source.issue,status:source.status,
  humanApprovalRequired:true,runtimeGeometry:false,
  baseline:source.baselineCount,added:source.addedCount,target:source.targetCount,
  manifest:'assets/v10-head-manifest.json',
  archetypes:source.requiredArchetypes,
  integrationZones:['mouth','crown','eyes','nose'],
  reviewScales:source.reviewScales,reviewBackgrounds:source.reviewBackgrounds,reviewOrientations:source.reviewOrientations,
  exactPairKeys:source.pairJunctions.map(item=>item.pairKey),
  report:'generated/qa/v10-heads/validation-report.json'
}
manifest.validation=manifest.validation||{}
manifest.validation.commands=appendUnique(manifest.validation.commands,['node tests/v10-heads.test.js','node scripts/v10-head-qa.js --validate-only','node scripts/v10-head-qa.js --write'])
manifest.validation.v10HeadReport='generated/qa/v10-heads/validation-report.json'
manifest.validation.requiresV10HeadValidation=true
manifest.contactSheetContract=manifest.contactSheetContract||{}
manifest.contactSheetContract.v10HeadReview='12 candidate head bases with exact mouth and crown pair plates, normal and flipped, on cream, white, black, and transparent at 100 percent, 25 percent, 192 px, 96 px, and 48 px'
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n')
function updateDoc(file,section){
  const target=path.join(ROOT,file),start='<!-- V10-HEAD-BASE-PACK:START -->',end='<!-- V10-HEAD-BASE-PACK:END -->'
  const block=`${start}\n${section.trim()}\n${end}`
  let text=fs.readFileSync(target,'utf8')
  const pattern=new RegExp(`${start}[\\s\\S]*?${end}`)
  text=pattern.test(text)?text.replace(pattern,block):`${text.trimEnd()}\n\n${block}\n`
  fs.writeFileSync(target,text)
}
updateDoc('README.md',`## V10 authored head-base expansion\n\nIssue #40 adds 12 structurally distinct head bases, bringing the authored library to 18 bases across the cyclops, multi-eye, skull-like, furry, blob, compact-imp, long-face, squat, soft-cute, sharp-creepy, calm, and wild directions. Every candidate carries a stable \`base-*\` ID, archetype and silhouette metadata, mouth/crown/eye/nose integration zones, compatibility against the full 10 eye, 9 nose, 27 mouth, and 9 horn catalogue, fallback seams, exact mouth and crown pair plates, and deterministic normal/flipped QA across four backgrounds and five scales. See [docs/V10-HEAD-BASE-PACK.md](docs/V10-HEAD-BASE-PACK.md). Human Art Director approval remains required before production promotion.`)
updateDoc('docs/ASSET-GUIDE.md',`## V10 head-base candidate contract\n\nLoad \`assets/v10-heads.js\` after the v9 base replacements, and \`assets/v10-head-integration.js\` after junctions, pair junctions, and compatibility. New bases are full-canvas authored SVGs with stable \`base-*\` IDs, an \`archetype\` tag, a \`silhouette\` descriptor, \`integrationZones\` for mouth, crown, eyes, and nose, an \`outlinePath\` copy of the silhouette for QA, runtime geometry disabled, and candidate review status. Structural distinction is measured against the v9 baseline: a new base must sit at least as far from every other base as the closest approved v9 pair, so a recolour scores zero and cannot be counted as new anatomy.`)
console.log('V10 head rollout manifest and docs are current.')
