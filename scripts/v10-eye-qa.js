#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const pack=require('../assets/v10-eyes');
const integration=require('../assets/v10-eye-integration');
const manifest=require('../assets/v10-eye-manifest.json');

const args=new Set(process.argv.slice(2));
const write=args.has('--write');
const validateOnly=args.has('--validate-only');
const digest=text=>crypto.createHash('sha256').update(text).digest('hex');

const assets=pack.assets.map(asset=>{
  const placementKey=asset.rigidPlacementKeys[0];
  return {
    id:asset.id,
    family:asset.family,
    expression:asset.expression,
    approvedBaseCount:(pack.compatibility[asset.id]?.approved||[]).length,
    blockedBaseCount:(pack.compatibility[asset.id]?.blocked||[]).length,
    placementKey,
    thumbnailSafe:asset.thumbnailSafe,
    transparentSafe:asset.transparentSafe,
    svgSha256:digest(asset.svg)
  };
});

const states=manifest.compatibilityStates;
const checks={
  quotaReached:pack.baselineCount+pack.assets.length===manifest.target,
  stableIds:new Set(assets.map(asset=>asset.id)).size===assets.length,
  distinctSources:new Set(assets.map(asset=>asset.svgSha256)).size===assets.length,
  familyCoverage:manifest.families.every(family=>pack.assets.some(asset=>asset.family===family)),
  expressionCoverage:manifest.expressions.every(expression=>pack.assets.some(asset=>asset.expression===expression)),
  compatibilityComplete:pack.assets.every(asset=>{
    const rules=pack.compatibility[asset.id]||{};
    const all=states.flatMap(state=>rules[state]||[]);
    return all.length===manifest.baseIds.length && new Set(all).size===manifest.baseIds.length &&
      manifest.baseIds.every(baseId=>all.includes(baseId));
  }),
  rigidPlacements:Object.keys(pack.placements).length===pack.assets.length &&
    pack.assets.every(asset=>asset.rigidPlacementKeys.length===1),
  placementBasesApproved:Object.values(pack.placements).every(fixture=>
    (pack.compatibility[fixture.eyeId]?.approved||[]).includes(fixture.baseId)),
  allThumbnailSafe:pack.assets.every(asset=>asset.thumbnailSafe),
  allTransparentSafe:pack.assets.every(asset=>asset.transparentSafe),
  runtimeGeometryDisabled:pack.runtimeGeometry===false && integration.runtimeGeometry===false
};

const report={
  schemaVersion:1,
  issue:41,
  revision:pack.revision,
  status:Object.values(checks).every(Boolean)?'pass':'fail',
  runtimeGeometry:false,
  humanApprovalRequired:true,
  baseline:pack.baselineCount,
  added:pack.assets.length,
  target:pack.targetCount,
  totalAfterPack:pack.baselineCount+pack.assets.length,
  approvedBasePairs:Object.values(pack.compatibility).reduce((sum,item)=>sum+(item.approved||[]).length,0),
  rigidPlacementCount:Object.keys(pack.placements).length,
  review:manifest.review,
  sourceOfTruth:manifest.sourceOfTruth,
  checks,
  assets
};

if(report.status!=='pass'){
  console.error(JSON.stringify(report,null,2));
  process.exit(1);
}

function makeBoard(){
  const cards=pack.assets.map(asset=>{
    const fixture=pack.placements[asset.rigidPlacementKeys[0]];
    return `<article>
      <div class="art">${asset.svg}</div>
      <strong>${asset.id}</strong>
      <span>${asset.family} · ${asset.expression}</span>
      <small>${fixture.baseId} · x ${fixture.transform.x} · y ${fixture.transform.y} · s ${fixture.transform.scale}</small>
    </article>`;
  }).join('\n');
  return `<!doctype html>
<meta charset="utf-8">
<title>V10 Eye Contact Sheet</title>
<style>
body{margin:0;padding:24px;background:#ead9b7;color:#171512;font:12px system-ui}
h1{margin:0 0 8px;font-size:22px}p{margin:0 0 18px;max-width:780px}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
article{background:#f4ead5;border:1px solid #171512;padding:8px}
.art{aspect-ratio:1;background:#efe2c8;overflow:hidden}
.art svg{width:100%;height:100%;display:block}
strong,span,small{display:block;margin-top:5px}span,small{opacity:.7}
</style>
<h1>V10 expressive eye candidates · Issue #41</h1>
<p>20 pre-drawn eye systems. Review normal/flipped at 100%, 96 px, and 48 px on cream, white, black, and transparent backgrounds. Automated QA does not constitute Art Director approval.</p>
<div class="grid">${cards}</div>`;
}

if(write){
  const outDir=path.resolve(__dirname,'../generated/qa/v10-eyes');
  fs.mkdirSync(outDir,{recursive:true});
  fs.writeFileSync(path.join(outDir,'validation-report.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(outDir,'contact-sheet.html'),makeBoard());
}
if(!validateOnly||write)console.log(`V10 eye QA ${report.status}: ${assets.length} candidates, ${report.approvedBasePairs} approved base pairs, ${report.rigidPlacementCount} rigid placements.`);
