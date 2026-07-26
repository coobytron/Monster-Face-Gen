#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'generated', 'qa');
const VALIDATE_ONLY = process.argv.includes('--validate-only');
const BACKGROUNDS = { cream:'#f2ead8', white:'#ffffff', black:'#111111', transparent:null };
const FAMILY_FILES = {
  bases:'assets/parts/bases.js', eyes:'assets/parts/eyes.js', noses:'assets/parts/noses.js',
  mouths:'assets/parts/mouths.js', horns:'assets/parts/horns.js', patterns:'assets/parts/patterns-compact.js', extras:'assets/parts/extras.js'
};
const REQUIRED_LAYER_ORDER = ['horns','bases','horn-root-seam','patterns','eyes','noses','mouths-clipped-to-base-alpha','mouth-base-seam','extras','finishes'];

function loadBrowserData(){
  const context={window:{},console}; context.window.window=context.window; vm.createContext(context);
  for(const rel of [...Object.values(FAMILY_FILES),'assets/finishes.js','assets/junctions.js','assets/compatibility.js']){
    const filename=path.join(ROOT,rel);
    if(!fs.existsSync(filename)) throw new Error(`Missing source file: ${rel}`);
    vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename:rel});
  }
  return {parts:context.window.MONSTER_PARTS||{},finishes:context.window.MONSTER_FINISHES||[],junctions:context.window.MONSTER_JUNCTIONS||{},compatibility:context.window.MONSTER_COMPATIBILITY||{}};
}
function readManifest(){return JSON.parse(fs.readFileSync(path.join(ROOT,'assets/manifest.json'),'utf8'));}
function hash(v){return crypto.createHash('sha256').update(v).digest('hex');}
function stripSvg(svg){const m=String(svg||'').match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/i);return m?m[1]:'';}
function hasViewBox(svg){return /<svg\b[^>]*\bviewBox=["']0 0 600 600["']/i.test(String(svg||''));}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));}
function indexById(list){return Object.fromEntries((list||[]).map(x=>[x.id,x]));}
function stateFor(data,baseId,family,partId){const row=data.compatibility.matrix?.[baseId]?.[family];if(!row)return'unknown';for(const s of ['approved','acceptable','blocked'])if((row[s]||[]).includes(partId))return s;return'unknown';}
function transformFor(data,base,family,partId){const slot=base.slots?.[family]||{x:0,y:0,scale:1,rotation:0};const o=data.compatibility.placementOverrides?.[`${base.id}|${partId}`]||{};const x=((slot.x||0)+(o.x||0))*600;const y=((slot.y||0)+(o.y||0))*600;const scale=(slot.scale||1)*(o.scale||1);const rot=(slot.rotation||0)+(o.rotation||0);return`translate(${x.toFixed(3)} ${y.toFixed(3)}) translate(300 300) rotate(${rot.toFixed(3)}) scale(${scale.toFixed(5)}) translate(-300 -300)`;}
function renderAsset(asset,t=''){if(!asset)return'';const body=stripSvg(asset.svg);return t?`<g transform="${t}">${body}</g>`:`<g>${body}</g>`;}
function renderComposition(data,s,flip=false,finishId='finish-clean'){
  const idx={};for(const k of Object.keys(FAMILY_FILES))idx[k]=indexById(data.parts[k]);idx.finishes=indexById(data.finishes);
  const base=idx.bases[s.baseId];if(!base)return'';
  const mouthSeam=(data.junctions.mouthSeams||[]).find(x=>x.targetId===base.id);
  const hornSeam=(data.junctions.hornSeams||[]).find(x=>x.targetId===s.hornId);
  const t={horns:transformFor(data,base,'horns',s.hornId),patterns:transformFor(data,base,'patterns',s.patternId),eyes:transformFor(data,base,'eyes',s.eyeId),noses:transformFor(data,base,'noses',s.noseId),mouths:transformFor(data,base,'mouths',s.mouthId),extras:transformFor(data,base,'extras',s.extraId)};
  const finish=idx.finishes[finishId];const clipId=`clip-${hash(JSON.stringify(s)).slice(0,10)}`;
  const inner=[`<defs><clipPath id="${clipId}">${renderAsset(base)}</clipPath></defs>`,renderAsset(idx.horns[s.hornId],t.horns),renderAsset(base),hornSeam?renderAsset(hornSeam,t.horns):'',renderAsset(idx.patterns[s.patternId],t.patterns),renderAsset(idx.eyes[s.eyeId],t.eyes),renderAsset(idx.noses[s.noseId],t.noses),`<g clip-path="url(#${clipId})">${renderAsset(idx.mouths[s.mouthId],t.mouths)}</g>`,mouthSeam?renderAsset(mouthSeam):'',renderAsset(idx.extras[s.extraId],t.extras),finish&&finish.id!=='finish-clean'?`<g clip-path="url(#${clipId})" opacity="${finish.opacity??1}" style="mix-blend-mode:${finish.blendMode||'multiply'}">${renderAsset(finish)}</g>`:''].join('');
  return flip?`<g transform="translate(600 0) scale(-1 1)">${inner}</g>`:`<g>${inner}</g>`;
}
function defaultSelection(data,baseId,family,partId){const row=data.compatibility.matrix?.[baseId];const first=k=>row?.[k]?.approved?.[0]||row?.[k]?.acceptable?.[0]||data.parts[k]?.[0]?.id;return{baseId,eyeId:family==='eyes'?partId:first('eyes'),noseId:family==='noses'?partId:first('noses'),mouthId:family==='mouths'?partId:first('mouths'),hornId:family==='horns'?partId:first('horns'),patternId:data.parts.patterns?.[0]?.id,extraId:data.parts.extras?.[0]?.id};}

function validate(data,manifest){
  const errors=[],warnings=[],checks=[],ids=new Map(),all=[];
  for(const [family,list] of Object.entries(data.parts))for(const asset of list||[])all.push({family,asset});
  for(const asset of data.finishes||[])all.push({family:'finishes',asset});
  for(const asset of data.junctions.mouthSeams||[])all.push({family:'mouthSeams',asset});
  for(const asset of data.junctions.hornSeams||[])all.push({family:'hornSeams',asset});
  for(const {family,asset} of all){if(!asset.id)errors.push({code:'missing-id',family,asset:asset.name||null});else if(ids.has(asset.id))errors.push({code:'duplicate-id',id:asset.id,families:[ids.get(asset.id),family]});else ids.set(asset.id,family);if(!asset.name)errors.push({code:'missing-metadata',id:asset.id||null,field:'name'});if(!asset.svg)errors.push({code:'missing-svg',id:asset.id||null});else if(!hasViewBox(asset.svg))errors.push({code:'missing-viewbox',id:asset.id});}
  const baseIds=(data.parts.bases||[]).map(x=>x.id);
  for(const baseId of baseIds)for(const family of ['eyes','noses','mouths','horns']){const expected=new Set((data.parts[family]||[]).map(x=>x.id));const row=data.compatibility.matrix?.[baseId]?.[family];if(!row){errors.push({code:'missing-compatibility-row',baseId,family});continue;}const seen=new Map();for(const state of ['approved','acceptable','blocked'])for(const id of row[state]||[]){if(!expected.has(id))errors.push({code:'unknown-id',baseId,family,state,id});if(seen.has(id))errors.push({code:'duplicate-classification',baseId,family,id,states:[seen.get(id),state]});seen.set(id,state);}for(const id of expected)if(!seen.has(id))errors.push({code:'unclassified-id',baseId,family,id});}
  const mouthTargets=new Set((data.junctions.mouthSeams||[]).map(x=>x.targetId));const hornTargets=new Set((data.junctions.hornSeams||[]).map(x=>x.targetId));for(const id of baseIds)if(!mouthTargets.has(id))errors.push({code:'missing-junction',junction:'mouth-base',targetId:id});for(const horn of data.parts.horns||[])if(horn.id!=='horn-none'&&!hornTargets.has(horn.id))errors.push({code:'missing-junction',junction:'horn-root',targetId:horn.id});
  const recipes=data.compatibility.approvedRecipes||[];
  for(const r of recipes){for(const [family,key] of [['eyes','eyeId'],['noses','noseId'],['mouths','mouthId'],['horns','hornId']]){const st=stateFor(data,r.baseId,family,r[key]);if(st==='blocked')errors.push({code:'blocked-combination',recipeId:r.id,baseId:r.baseId,family,partId:r[key]});if(st==='unknown')errors.push({code:'unknown-recipe-id',recipeId:r.id,baseId:r.baseId,family,partId:r[key]});}for(const [family,key] of [['patterns','patternId'],['extras','extraId']])if(!ids.has(r[key]))errors.push({code:'unknown-recipe-id',recipeId:r.id,family,partId:r[key]});}
  if(JSON.stringify(manifest.layerOrder)!==JSON.stringify(REQUIRED_LAYER_ORDER))errors.push({code:'invalid-z-order',expected:REQUIRED_LAYER_ORDER,actual:manifest.layerOrder});
  if(manifest.runtimeAnatomyGeneration!==false)errors.push({code:'runtime-anatomy-generation-enabled'});
  const groups={stable:['missing-id','duplicate-id'],metadata:['missing-metadata','missing-svg','missing-viewbox'],compatibility:['missing-compatibility-row','unknown-id','duplicate-classification','unclassified-id'],junctions:['missing-junction'],recipes:['blocked-combination','unknown-recipe-id'],order:['invalid-z-order'],authored:['runtime-anatomy-generation-enabled']};
  for(const [name,codes] of Object.entries(groups))checks.push({name,passed:!errors.some(x=>codes.includes(x.code))});
  return{schemaVersion:1,generator:'scripts/contact-sheet-qa.js',deterministic:true,generatedAt:new Date(0).toISOString(),sourceManifestVersion:manifest.version,sourceDigest:hash(JSON.stringify({manifest,ids:[...ids.keys()].sort(),recipes})),summary:{passed:errors.length===0,errorCount:errors.length,warningCount:warnings.length,checkCount:checks.length},checks,errors,warnings,counts:{bases:data.parts.bases?.length||0,mouths:data.parts.mouths?.length||0,horns:data.parts.horns?.length||0,finishes:data.finishes?.length||0,recipes:recipes.length,visualAssets:all.length}};
}
function sheetSvg({title,subtitle,cells,columns,background}){const cellW=330,cellH=370,headerH=120,rows=Math.ceil(cells.length/columns),width=columns*cellW,height=headerH+rows*cellH,bg=background?`<rect width="100%" height="100%" fill="${background}"/>`:'',text=background==='#111111'?'#fff':'#171512';const body=cells.map((c,i)=>{const x=(i%columns)*cellW,y=headerH+Math.floor(i/columns)*cellH,tile=background==='#111111'?'#202020':background||'url(#checker)';return`<g transform="translate(${x} ${y})"><rect x="8" y="8" width="314" height="354" rx="12" fill="${tile}" stroke="${text}" stroke-opacity=".24"/><g transform="translate(15 12) scale(.5)">${c.art}</g><text x="18" y="330" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="700">${esc(c.label)}</text><text x="18" y="350" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="12" opacity=".72">${esc(c.meta||'')}</text></g>`;}).join('');return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><defs><pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#fff"/><rect width="10" height="10" fill="#ddd"/><rect x="10" y="10" width="10" height="10" fill="#ddd"/></pattern></defs>${bg}<text x="24" y="44" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="700">${esc(title)}</text><text x="24" y="76" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="15" opacity=".72">${esc(subtitle)}</text>${body}</svg>`;}
function pairCells(data,family){const out=[];for(const base of data.parts.bases||[])for(const part of data.parts[family]||[]){const s=defaultSelection(data,base.id,family,part.id),st=stateFor(data,base.id,family,part.id);for(const flip of [false,true])out.push({label:`${base.id} × ${part.id}${flip?' — flipped':''}`,meta:`state:${st} stable:${part.id}`,art:renderComposition(data,s,flip)});}return out;}
function recipeFinishCells(data){const out=[];for(const r of data.compatibility.approvedRecipes||[])for(const f of data.finishes||[])out.push({label:`${r.id} × ${f.id}`,meta:'approved recipe · authored finish',art:renderComposition(data,r,false,f.id)});return out;}
function highResCells(data){return(data.compatibility.approvedRecipes||[]).map(r=>({label:r.id,meta:'600×600 authored assembly crop',art:renderComposition(data,r,false,'finish-etched')}));}
async function writeSheet(name,svg){fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,`${name}.svg`),svg);const sharp=require('sharp');await sharp(Buffer.from(svg)).png().toFile(path.join(OUT,`${name}.png`));}
async function main(){const data=loadBrowserData(),manifest=readManifest(),report=validate(data,manifest);fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'validation-report.json'),JSON.stringify(report,null,2)+'\n');fs.copyFileSync(path.join(ROOT,'schemas/qa-validation-report.schema.json'),path.join(OUT,'validation-report.schema.json'));if(!VALIDATE_ONLY){const groups=[['mouth-base','Mouth × Base','Every authored mouth on every base, unflipped and flipped',pairCells(data,'mouths'),6],['horn-base','Horn / Ear × Base','Every authored horn or ear on every base, unflipped and flipped',pairCells(data,'horns'),6],['approved-recipes-finishes','Approved Recipes × Finishes','Every authored finish applied to every approved recipe',recipeFinishCells(data),5],['approved-recipes-high-resolution','Approved Recipe High-Resolution Crops','Large review crops for junction, clipping, and finish inspection',highResCells(data),4]];for(const [slug,title,subtitle,cells,columns] of groups)for(const [bgName,bg] of Object.entries(BACKGROUNDS))await writeSheet(`${slug}-${bgName}`,sheetSvg({title,subtitle:`${subtitle} · background:${bgName}`,cells,columns,background:bg}));}console.log(JSON.stringify(report.summary));if(!report.summary.passed)process.exitCode=1;}
main().catch(e=>{console.error(e.stack||e);process.exit(1);});
