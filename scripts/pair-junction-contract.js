#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const FAMILY_FILES = {
  bases:'assets/parts/bases.js', eyes:'assets/parts/eyes.js', noses:'assets/parts/noses.js',
  mouths:'assets/parts/mouths.js', horns:'assets/parts/horns.js', patterns:'assets/parts/patterns-compact.js', extras:'assets/parts/extras.js'
};
const HERO_IDS = ['bog-cyclops-grin','fuzz-fanged','imp-roar'];
const EXPECTED_STAGE = { mouths:'mouth-base-pair-junction', horns:'horn-root-pair-junction' };
const EXPECTED_Z = { mouths:8, horns:3 };
const BACKGROUNDS = { cream:'#f2ead8', white:'#ffffff', black:'#111111', transparent:null };

function hash(value){return crypto.createHash('sha256').update(String(value)).digest('hex');}
function esc(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));}
function stripSvg(svg){const match=String(svg||'').match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/i);return match?match[1]:'';}
function hasViewBox(svg){return /<svg\b[^>]*\bviewBox=["']0 0 600 600["']/i.test(String(svg||''));}
function indexById(list){return Object.fromEntries((list||[]).map(item=>[item.id,item]));}

function loadBrowserData(){
  const context={window:{},console};context.window.window=context.window;vm.createContext(context);
  const files=[...Object.values(FAMILY_FILES),'assets/finishes.js','assets/junctions.js','assets/pair-junctions.js','assets/compatibility.js'];
  for(const rel of files){
    const filename=path.join(ROOT,rel);
    if(!fs.existsSync(filename)) throw new Error(`Missing source file: ${rel}`);
    vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename:rel});
  }
  return {
    parts:context.window.MONSTER_PARTS||{},
    finishes:context.window.MONSTER_FINISHES||[],
    junctions:context.window.MONSTER_JUNCTIONS||{},
    pairs:context.window.MONSTER_PAIR_JUNCTIONS||{},
    compatibility:context.window.MONSTER_COMPATIBILITY||{}
  };
}

function readManifest(){return JSON.parse(fs.readFileSync(path.join(ROOT,'assets/manifest.json'),'utf8'));}

function requiredPairs(data){
  const recipes=data.compatibility.recipes||[];
  return HERO_IDS.flatMap(recipeId=>{
    const recipe=recipes.find(item=>item.id===recipeId);
    if(!recipe) return [{recipeId,family:'missing',pairKey:null}];
    return [
      {recipeId,family:'mouths',baseId:recipe.baseId,partId:recipe.mouthId,pairKey:`${recipe.baseId}|${recipe.mouthId}`},
      {recipeId,family:'horns',baseId:recipe.baseId,partId:recipe.hornId,pairKey:`${recipe.baseId}|${recipe.hornId}`}
    ];
  });
}

function validate(data,manifest){
  const errors=[];const warnings=[];const checks=[];
  const registry=data.pairs||{};
  const all=[...(registry.mouth||[]),...(registry.horns||[])];
  const bases=indexById(data.parts.bases);const mouths=indexById(data.parts.mouths);const horns=indexById(data.parts.horns);
  const genericById=indexById([...(data.junctions.mouthSeams||[]),...(data.junctions.hornSeams||[])]);
  const ids=new Set();const keys=new Set();
  const forbiddenSvg=/<(?:script|foreignObject|image|use|text)\b|\son\w+\s*=|javascript:/i;

  if(registry.runtimeGeometry!==false) errors.push({code:'runtime-anatomy-generation-enabled'});
  if(registry.keyPattern!=='<base-id>|<part-id>') errors.push({code:'invalid-key-pattern',actual:registry.keyPattern||null});

  for(const item of all){
    if(!item.id) errors.push({code:'missing-pair-id',name:item.name||null});
    else if(ids.has(item.id)) errors.push({code:'duplicate-pair-id',id:item.id});
    else ids.add(item.id);
    if(!item.pairKey||item.pairKey!==`${item.baseId}|${item.partId}`||item.id!==item.pairKey) errors.push({code:'invalid-pair-key',id:item.id||null,pairKey:item.pairKey||null,expected:`${item.baseId}|${item.partId}`});
    if(keys.has(item.pairKey)) errors.push({code:'duplicate-pair-key',pairKey:item.pairKey});else keys.add(item.pairKey);
    if(!bases[item.baseId]) errors.push({code:'unknown-pair-base',pairKey:item.pairKey,baseId:item.baseId});
    const familyIndex=item.family==='mouths'?mouths:item.family==='horns'?horns:null;
    if(!familyIndex) errors.push({code:'unknown-pair-family',pairKey:item.pairKey,family:item.family});
    else if(!familyIndex[item.partId]) errors.push({code:'unknown-pair-part',pairKey:item.pairKey,family:item.family,partId:item.partId});
    if(item.stage!==EXPECTED_STAGE[item.family]||item.zOrder!==EXPECTED_Z[item.family]) errors.push({code:'incorrect-z-order',pairKey:item.pairKey,expectedStage:EXPECTED_STAGE[item.family],actualStage:item.stage,expectedZ:EXPECTED_Z[item.family],actualZ:item.zOrder});
    if(!genericById[item.fallbackId]) errors.push({code:'missing-generic-fallback',pairKey:item.pairKey,fallbackId:item.fallbackId||null});
    if(item.flipSafe!==true||item.mirrorWithComposition!==true) errors.push({code:'flip-unsafe-configuration',pairKey:item.pairKey});
    if(!item.svg||!hasViewBox(item.svg)) errors.push({code:'invalid-pair-svg',pairKey:item.pairKey});
    if(forbiddenSvg.test(String(item.svg||''))) errors.push({code:'anatomy-like-standalone-content',pairKey:item.pairKey,reason:'embedded-or-active-content'});
    if(item.contentAudit?.standaloneAnatomy!==false) errors.push({code:'anatomy-like-standalone-content',pairKey:item.pairKey,reason:'missing-negative-audit'});
    const allowed=new Set(registry.allowedContent||[]);
    for(const content of item.contentAudit?.contains||[]) if(!allowed.has(content)) errors.push({code:'anatomy-like-standalone-content',pairKey:item.pairKey,reason:'unapproved-content',content});
  }

  const required=requiredPairs(data);
  for(const entry of required){
    if(!entry.pairKey) errors.push({code:'missing-hero-recipe',recipeId:entry.recipeId});
    else if(!keys.has(entry.pairKey)) errors.push({code:'missing-required-pair-junction',recipeId:entry.recipeId,family:entry.family,pairKey:entry.pairKey});
  }
  if(all.length!==6) errors.push({code:'pair-count-mismatch',expected:6,actual:all.length});
  if(JSON.stringify(registry.heroRecipeIds||[])!==JSON.stringify(HERO_IDS)) errors.push({code:'hero-id-mismatch',expected:HERO_IDS,actual:registry.heroRecipeIds||[]});
  if(manifest.runtimeAnatomyGeneration!==false) errors.push({code:'runtime-anatomy-generation-enabled',source:'manifest'});
  const contract=manifest.pairJunctionContract||{};
  if(contract.selection!=='exact-pair-first-generic-fallback') errors.push({code:'invalid-selection-rule',actual:contract.selection||null});
  if(JSON.stringify(contract.heroRecipeIds||[])!==JSON.stringify(HERO_IDS)) errors.push({code:'manifest-hero-id-mismatch',actual:contract.heroRecipeIds||[]});

  const groups={
    ids:['missing-pair-id','duplicate-pair-id','invalid-pair-key','duplicate-pair-key','invalid-key-pattern'],
    coverage:['missing-required-pair-junction','missing-hero-recipe','pair-count-mismatch','hero-id-mismatch','manifest-hero-id-mismatch'],
    references:['unknown-pair-base','unknown-pair-family','unknown-pair-part','missing-generic-fallback'],
    order:['incorrect-z-order','invalid-selection-rule'],
    authored:['anatomy-like-standalone-content','invalid-pair-svg','runtime-anatomy-generation-enabled'],
    flip:['flip-unsafe-configuration']
  };
  for(const [name,codes] of Object.entries(groups)) checks.push({name,passed:!errors.some(error=>codes.includes(error.code))});

  return {
    schemaVersion:1,
    generator:'scripts/pair-junction-contract.js',
    deterministic:true,
    generatedAt:new Date(0).toISOString(),
    sourceManifestVersion:manifest.version,
    sourceDigest:hash(JSON.stringify({pairs:all.map(item=>({...item,svg:hash(item.svg)})),required,contract})),
    summary:{passed:errors.length===0,errorCount:errors.length,warningCount:warnings.length,checkCount:checks.length},
    checks,errors,warnings,
    counts:{heroRecipes:HERO_IDS.length,requiredPairs:required.length,publishedPairs:all.length,mouthPairs:(registry.mouth||[]).length,hornPairs:(registry.horns||[]).length}
  };
}

function transformFor(data,base,family,partId){
  const slot=base.slots?.[family]||{x:0,y:0,scale:1,rotation:0};
  const override=data.compatibility.placementOverrides?.[`${base.id}|${partId}`]||{};
  const x=((slot.x||0)+(override.x||0))*600;const y=((slot.y||0)+(override.y||0))*600;
  const scale=(slot.scale||1)*(override.scale||1);const rotation=(slot.rotation||0)+(override.rotation||0);
  return `translate(${x.toFixed(3)} ${y.toFixed(3)}) translate(300 300) rotate(${rotation.toFixed(3)}) scale(${scale.toFixed(5)}) translate(-300 -300)`;
}
function renderAsset(asset,transform=''){if(!asset)return'';const body=stripSvg(asset.svg);return transform?`<g transform="${transform}">${body}</g>`:`<g>${body}</g>`;}

function renderHero(data,recipe,{paired=false,flip=false,finishId='finish-etched'}={}){
  const idx={};for(const family of Object.keys(FAMILY_FILES))idx[family]=indexById(data.parts[family]);idx.finishes=indexById(data.finishes);
  const base=idx.bases[recipe.baseId];if(!base)return'';
  const genericMouth=(data.junctions.mouthSeams||[]).find(item=>item.targetId===base.id);
  const genericHorn=(data.junctions.hornSeams||[]).find(item=>item.targetId===recipe.hornId);
  const pairMouth=paired?data.pairs.byKey?.[`${base.id}|${recipe.mouthId}`]:null;
  const pairHorn=paired?data.pairs.byKey?.[`${base.id}|${recipe.hornId}`]:null;
  const mouthSeam=pairMouth||genericMouth;const hornSeam=pairHorn||genericHorn;
  const t={
    horns:transformFor(data,base,'horns',recipe.hornId),patterns:transformFor(data,base,'patterns',recipe.patternId),
    eyes:transformFor(data,base,'eyes',recipe.eyeId),noses:transformFor(data,base,'noses',recipe.noseId),
    mouths:transformFor(data,base,'mouths',recipe.mouthId),extras:transformFor(data,base,'extras',recipe.extraId)
  };
  const clipId=`pair-clip-${hash(`${recipe.id}:${paired}`).slice(0,10)}`;const finish=idx.finishes[finishId];
  const inner=[
    `<defs><clipPath id="${clipId}">${renderAsset(base)}</clipPath></defs>`,renderAsset(idx.horns[recipe.hornId],t.horns),renderAsset(base),
    hornSeam?renderAsset(hornSeam,t.horns):'',renderAsset(idx.patterns[recipe.patternId],t.patterns),renderAsset(idx.eyes[recipe.eyeId],t.eyes),
    renderAsset(idx.noses[recipe.noseId],t.noses),`<g clip-path="url(#${clipId})">${renderAsset(idx.mouths[recipe.mouthId],t.mouths)}</g>`,
    mouthSeam?renderAsset(mouthSeam):'',renderAsset(idx.extras[recipe.extraId],t.extras),
    finish&&finish.id!=='finish-clean'?`<g clip-path="url(#${clipId})" opacity="${finish.opacity??1}" style="mix-blend-mode:${finish.blendMode||'multiply'}">${renderAsset(finish)}</g>`:''
  ].join('');
  return flip?`<g transform="translate(600 0) scale(-1 1)">${inner}</g>`:`<g>${inner}</g>`;
}

function reviewCell({label,meta,art,viewBox='0 0 600 600',displayScale=1}){
  const width=600*displayScale;const height=600*displayScale;const x=(600-width)/2;const y=(600-height)/2;
  return {label,meta,art:`<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">${art}</svg>`};
}

function heroCells(data,type){
  const recipes=data.compatibility.recipes||[];const cells=[];
  const viewBox=type==='mouth'?'100 330 400 245':'100 70 400 165';
  for(const recipeId of HERO_IDS){
    const recipe=recipes.find(item=>item.id===recipeId);if(!recipe)continue;
    cells.push(reviewCell({label:`${recipe.id} · before`,meta:`generic ${type} seam · 100% crop`,art:renderHero(data,recipe,{paired:false}),viewBox}));
    cells.push(reviewCell({label:`${recipe.id} · after`,meta:`pair-specific ${type} plate · 100% crop`,art:renderHero(data,recipe,{paired:true}),viewBox}));
    cells.push(reviewCell({label:`${recipe.id} · flipped`,meta:`pair-specific ${type} plate · full-composition mirror`,art:renderHero(data,recipe,{paired:true,flip:true}),viewBox}));
    cells.push(reviewCell({label:`${recipe.id} · 25%`,meta:'pair-specific review at 25% scale',art:renderHero(data,recipe,{paired:true}),displayScale:.25}));
    cells.push(reviewCell({label:`${recipe.id} · 96 px`,meta:'thumbnail legibility',art:renderHero(data,recipe,{paired:true}),displayScale:.16}));
    cells.push(reviewCell({label:`${recipe.id} · 48 px`,meta:'small thumbnail legibility',art:renderHero(data,recipe,{paired:true}),displayScale:.08}));
  }
  return cells;
}

function sheetSvg({title,subtitle,cells,background}){
  const columns=3,cellW=660,cellH=710,headerH=110,rows=Math.ceil(cells.length/columns),width=columns*cellW,height=headerH+rows*cellH;
  const text=background==='#111111'?'#fff':'#171512';const bg=background?`<rect width="100%" height="100%" fill="${background}"/>`:'';
  const body=cells.map((cell,index)=>{const x=(index%columns)*cellW,y=headerH+Math.floor(index/columns)*cellH;const tile=background==='#111111'?'#202020':background||'url(#checker)';return `<g transform="translate(${x} ${y})"><rect x="12" y="10" width="636" height="684" rx="14" fill="${tile}" stroke="${text}" stroke-opacity=".24"/><g transform="translate(30 26)">${cell.art}</g><text x="28" y="654" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="700">${esc(cell.label)}</text><text x="28" y="678" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="13" opacity=".72">${esc(cell.meta)}</text></g>`;}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><defs><pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#fff"/><rect width="10" height="10" fill="#ddd"/><rect x="10" y="10" width="10" height="10" fill="#ddd"/></pattern></defs>${bg}<text x="24" y="42" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="700">${esc(title)}</text><text x="24" y="74" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="15" opacity=".72">${esc(subtitle)}</text>${body}</svg>`;
}

module.exports={ROOT,BACKGROUNDS,HERO_IDS,loadBrowserData,readManifest,requiredPairs,validate,renderHero,heroCells,sheetSvg,hash};
