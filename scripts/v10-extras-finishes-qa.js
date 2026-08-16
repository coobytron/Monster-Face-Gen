#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const extras=require('../assets/v10-extras');
const finishes=require('../assets/v10-finishes');
const manifest=require('../assets/v10-extras-finishes-manifest.json');
const args=new Set(process.argv.slice(2));
const write=args.has('--write');
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');

const extraRows=extras.assets.map(a=>({id:a.id,family:a.family,attachmentZone:a.attachmentZone,bounds:a.bounds,supportedBaseCount:a.supportedBaseIds.length,transparentSafe:a.transparentSafe,svgSha256:digest(a.svg)}));
const finishRows=finishes.assets.map(a=>({id:a.id,family:a.family,blendMode:a.blendMode,opacity:a.opacity,supportedBackgrounds:a.supportedBackgrounds,transparentSafe:a.transparentSafe,maskContract:a.maskContract,svgSha256:digest(a.svg)}));
const report={
 schemaVersion:1,issue:45,revision:'10.7.0',status:'pass',runtimeGeometry:false,humanApprovalRequired:true,
 extras:{baseline:9,added:extraRows.length,target:27,total:9+extraRows.length,assets:extraRows},
 finishes:{baseline:5,added:finishRows.length,target:12,total:5+finishRows.length,assets:finishRows},
 review:manifest.review,backgrounds:manifest.backgrounds,
 checks:{
  extraQuota:9+extraRows.length===27,finishQuota:5+finishRows.length===12,
  uniqueExtras:new Set(extraRows.map(x=>x.svgSha256)).size===extraRows.length,
  uniqueFinishes:new Set(finishRows.map(x=>x.svgSha256)).size===finishRows.length,
  allExtrasTransparentSafe:extraRows.every(x=>x.transparentSafe),
  allFinishesTransparentSafe:finishRows.every(x=>x.transparentSafe),
  allExtrasCoverBases:extraRows.every(x=>x.supportedBaseCount===manifest.baseIds.length),
  allFinishesCoverBackgrounds:finishRows.every(x=>x.supportedBackgrounds.length===manifest.backgrounds.length)
 }
};
if(Object.values(report.checks).some(x=>x!==true)){report.status='fail';console.error(JSON.stringify(report,null,2));process.exit(1);}
function board(){
 const backgrounds=['#ead9b7','#fff','#171512','transparent'];
 const extraCards=extras.assets.map(a=>`<article><div class="art">${a.svg}</div><b>${a.id}</b><span>${a.family} · ${a.attachmentZone}</span></article>`).join('');
 const finishCards=finishes.assets.map(a=>`<article><div class="art finish">${a.svg}</div><b>${a.id}</b><span>${a.blendMode} · ${a.opacity}</span></article>`).join('');
 return `<!doctype html><meta charset="utf-8"><title>V10 Extras + Finishes QA</title><style>body{margin:0;padding:24px;background:#ead9b7;color:#171512;font:12px system-ui}h1,h2{margin:0 0 16px}h2{margin-top:30px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}article{background:#f4ead5;border:1px solid;padding:9px}.art{aspect-ratio:1;background:#efe2c8;overflow:hidden}.art svg{width:100%;height:100%;display:block}b,span{display:block;margin-top:5px}span{opacity:.7}.backgrounds{display:flex;gap:8px;margin:10px 0 20px}.swatch{width:80px;height:36px;border:1px solid;background:var(--bg)}</style><h1>V10 extras + deterministic finishes · Issue #45</h1><div class="backgrounds">${backgrounds.map(bg=>`<div class="swatch" style="--bg:${bg}"></div>`).join('')}</div><h2>18 authored extras</h2><div class="grid">${extraCards}</div><h2>7 authored finish plates</h2><div class="grid">${finishCards}</div>`;
}
if(write){const out=path.resolve(__dirname,'../generated/qa');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'v10-extras-finishes-validation.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(out,'v10-extras-finishes-contact-sheet.html'),board());}
console.log(`V10 extras/finishes QA ${report.status}: ${extraRows.length} extras and ${finishRows.length} finishes.`);
