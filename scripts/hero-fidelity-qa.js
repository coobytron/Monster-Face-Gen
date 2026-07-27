#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const crypto=require('crypto');
const sharp=require('sharp');

const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'generated','qa');
const VALIDATE_ONLY=process.argv.includes('--validate-only');
const BACKGROUNDS={cream:'#f2ead8',white:'#ffffff',black:'#111111',transparent:null};
const FAMILY_FILES={bases:'assets/parts/bases.js',eyes:'assets/parts/eyes.js',noses:'assets/parts/noses.js',mouths:'assets/parts/mouths.js',horns:'assets/parts/horns.js',patterns:'assets/parts/patterns-compact.js',extras:'assets/parts/extras.js'};
const HERO_FILES=['bases','eyes','noses','mouths','horns','patterns','extras'].map(name=>`assets/hero-v9/${name}.js`);
const HERO_IDS=['bog-cyclops-grin','fuzz-fanged','imp-roar'];
const HERO_ASSETS={
  bases:['base-bog','base-fuzz','base-imp'],eyes:['eye-cyclops','eye-sleepy','eye-wide'],noses:['nose-button','nose-hook','nose-piggy'],mouths:['mouth-grin','mouth-fangs','mouth-roar'],horns:['horn-curved','horn-bent','horn-spiky'],patterns:['pattern-spots','pattern-stripes','pattern-freckles'],extras:['extra-earring','extra-scar','extra-spikes']
};

const hash=value=>crypto.createHash('sha256').update(String(value)).digest('hex');
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const stripSvg=svg=>{const match=String(svg||'').match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/i);return match?match[1]:'';};
const indexById=list=>Object.fromEntries((list||[]).map(item=>[item.id,item]));

function loadData(includeHero){
  const context={window:{MONSTER_PARTS:{},MONSTER_HERO_FIDELITY:null},console};context.window.window=context.window;vm.createContext(context);
  const files=[...Object.values(FAMILY_FILES),...(includeHero?HERO_FILES:[]),'assets/finishes.js','assets/junctions.js','assets/pair-junctions.js','assets/compatibility.js'];
  for(const rel of files){const filename=path.join(ROOT,rel);vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename:rel});}
  return{parts:context.window.MONSTER_PARTS||{},finishes:context.window.MONSTER_FINISHES||[],junctions:context.window.MONSTER_JUNCTIONS||{},pairs:context.window.MONSTER_PAIR_JUNCTIONS||{},compatibility:context.window.MONSTER_COMPATIBILITY||{},registry:context.window.MONSTER_HERO_FIDELITY||null};
}

function namespaceBody(svg,token){
  let body=stripSvg(svg);const ids=[...body.matchAll(/\bid=["']([^"']+)["']/g)].map(match=>match[1]);
  for(const id of ids){const safe=`${id}-${token}`;body=body.replaceAll(`id="${id}"`,`id="${safe}"`).replaceAll(`id='${id}'`,`id='${safe}'`).replaceAll(`url(#${id})`,`url(#${safe})`).replaceAll(`#${id}"`,`#${safe}"`).replaceAll(`#${id}'`,`#${safe}'`);}
  return body;
}
function renderAsset(asset,transform='',token='asset'){if(!asset)return'';const body=namespaceBody(asset.svg,token);return transform?`<g transform="${transform}">${body}</g>`:`<g>${body}</g>`;}
function clipShape(asset){
  const tags=[...String(asset?.svg||'').matchAll(/<path\b[^>]*>/gi)].map(match=>match[0]).filter(tag=>! /fill=["']none["']/i.test(tag));
  const ranked=tags.map(tag=>({tag,d:(tag.match(/\bd=["']([^"']+)["']/i)||[])[1]||''})).filter(item=>item.d.length>60).sort((a,b)=>b.d.length-a.d.length);
  if(!ranked.length)return renderAsset(asset,'','clip-fallback');
  let tag=ranked[0].tag.replace(/\sfill=["'][^"']*["']/i,' fill="#fff"').replace(/\sstroke=["'][^"']*["']/gi,' stroke="none"');
  if(!/\sfill=/i.test(tag))tag=tag.replace(/>$/,' fill="#fff">');
  return '<g>'+tag+'</g>';
}
function transformFor(data,base,family,partId){const slot=base.slots?.[family]||{x:0,y:0,scale:1,rotation:0};const override=data.compatibility.placementOverrides?.[`${base.id}|${partId}`]||{};const x=((slot.x||0)+(override.x||0))*600,y=((slot.y||0)+(override.y||0))*600,scale=(slot.scale||1)*(override.scale||1),rotation=(slot.rotation||0)+(override.rotation||0);return`translate(${x.toFixed(3)} ${y.toFixed(3)}) translate(300 300) rotate(${rotation.toFixed(3)}) scale(${scale.toFixed(5)}) translate(-300 -300)`;}

function renderComposition(data,selection,{flip=false,finishId='finish-clean',token='composition'}={}){
  const idx={};for(const family of Object.keys(FAMILY_FILES))idx[family]=indexById(data.parts[family]);idx.finishes=indexById(data.finishes);
  const base=idx.bases[selection.baseId];if(!base)return'';
  const exactMouth=data.pairs.select?.(base.id,selection.mouthId)||null,exactHorn=data.pairs.select?.(base.id,selection.hornId)||null;
  const mouthSeam=exactMouth||(data.junctions.mouthSeams||[]).find(item=>item.targetId===base.id);
  const hornSeam=exactHorn||(data.junctions.hornSeams||[]).find(item=>item.targetId===selection.hornId);
  const transforms={horns:transformFor(data,base,'horns',selection.hornId),patterns:transformFor(data,base,'patterns',selection.patternId),eyes:transformFor(data,base,'eyes',selection.eyeId),noses:transformFor(data,base,'noses',selection.noseId),mouths:transformFor(data,base,'mouths',selection.mouthId),extras:transformFor(data,base,'extras',selection.extraId)};
  const clipId=`hero-clip-${token}`;const finish=idx.finishes[finishId];
  const inner=[
    `<defs><clipPath id="${clipId}">${clipShape(base)}</clipPath></defs>`,
    renderAsset(idx.horns[selection.hornId],transforms.horns,`${token}-horns`),
    renderAsset(base,'',`${token}-base`),
    hornSeam?renderAsset(hornSeam,transforms.horns,`${token}-horn-seam`):'',
    renderAsset(idx.patterns[selection.patternId],transforms.patterns,`${token}-pattern`),
    renderAsset(idx.eyes[selection.eyeId],transforms.eyes,`${token}-eyes`),
    renderAsset(idx.noses[selection.noseId],transforms.noses,`${token}-nose`),
    renderAsset(idx.mouths[selection.mouthId],transforms.mouths,`${token}-mouth`),
    mouthSeam?renderAsset(mouthSeam,'',`${token}-mouth-seam`):'',
    renderAsset(idx.extras[selection.extraId],transforms.extras,`${token}-extra`),
    finish&&finish.id!=='finish-clean'?`<g clip-path="url(#${clipId})" opacity="${finish.opacity??1}" style="mix-blend-mode:${finish.blendMode||'multiply'}">${renderAsset(finish,'',`${token}-finish`)}</g>`:''
  ].join('');
  return flip?`<g transform="translate(600 0) scale(-1 1)">${inner}</g>`:`<g>${inner}</g>`;
}

function validate(baseline,hero,manifest){
  const errors=[],warnings=[],checks=[];let changed=0;
  if(!hero.registry||hero.registry.runtimeGeometry!==false)errors.push({code:'invalid-hero-registry'});
  if(JSON.stringify(hero.registry?.heroRecipeIds||[])!==JSON.stringify(HERO_IDS))errors.push({code:'hero-recipe-set-changed',expected:HERO_IDS,actual:hero.registry?.heroRecipeIds||[]});
  for(const [name,score] of Object.entries(hero.registry?.reviewScoreTargets||{}))if(score<4)errors.push({code:'review-target-below-four',category:name,score});
  for(const [family,ids] of Object.entries(HERO_ASSETS)){
    const before=indexById(baseline.parts[family]),after=indexById(hero.parts[family]);
    for(const id of ids){
      const asset=after[id];if(!asset){errors.push({code:'missing-hero-asset',family,id});continue;}
      if(asset.heroRevision!=='9.4.0'||asset.authored!==true||asset.runtimeGeometry!==false)errors.push({code:'invalid-hero-metadata',family,id});
      if(!(asset.tags||[]).includes('hero-v9'))errors.push({code:'missing-hero-tag',family,id});
      if(!/<svg\b[^>]*viewBox=["']0 0 600 600["']/i.test(asset.svg||''))errors.push({code:'invalid-viewbox',family,id});
      if(/<script\b|<foreignObject\b|\son\w+\s*=|rough\.js|roughjs/i.test(asset.svg||''))errors.push({code:'forbidden-runtime-content',family,id});
      if(before[id]&&hash(before[id].svg)!==hash(asset.svg))changed++;
    }
  }
  if(changed!==21)errors.push({code:'replacement-count-mismatch',expected:21,actual:changed});
  const recipes=hero.compatibility.recipes||[];
  for(const recipeId of HERO_IDS){
    const recipe=recipes.find(item=>item.id===recipeId);if(!recipe){errors.push({code:'missing-hero-recipe',recipeId});continue;}
    for(const [family,key] of [['bases','baseId'],['eyes','eyeId'],['noses','noseId'],['mouths','mouthId'],['horns','hornId'],['patterns','patternId'],['extras','extraId']]){const asset=(hero.parts[family]||[]).find(item=>item.id===recipe[key]);if(!asset||(asset.tags||[]).includes('hero-v9')===false)errors.push({code:'recipe-not-using-hero-art',recipeId,family,id:recipe[key]});}
    if(!hero.pairs.select?.(recipe.baseId,recipe.mouthId))errors.push({code:'missing-mouth-pair-junction',recipeId});
    if(!hero.pairs.select?.(recipe.baseId,recipe.hornId))errors.push({code:'missing-horn-pair-junction',recipeId});
  }
  if(manifest.runtimeAnatomyGeneration!==false)errors.push({code:'runtime-anatomy-generation-enabled'});
  if(manifest.counts?.heroAuthoredReplacements!==21)errors.push({code:'manifest-hero-count-mismatch',expected:21,actual:manifest.counts?.heroAuthoredReplacements??null});
  if(JSON.stringify(manifest.heroFidelityContract?.heroRecipeIds||[])!==JSON.stringify(HERO_IDS))errors.push({code:'manifest-hero-contract-mismatch'});
  const groups={identity:['missing-hero-asset','missing-hero-recipe','hero-recipe-set-changed'],authored:['invalid-hero-registry','invalid-hero-metadata','missing-hero-tag','invalid-viewbox','forbidden-runtime-content','replacement-count-mismatch','runtime-anatomy-generation-enabled'],recipes:['recipe-not-using-hero-art','missing-mouth-pair-junction','missing-horn-pair-junction'],review:['review-target-below-four'],manifest:['manifest-hero-count-mismatch','manifest-hero-contract-mismatch']};
  for(const [name,codes] of Object.entries(groups))checks.push({name,passed:!errors.some(error=>codes.includes(error.code))});
  return{schemaVersion:1,generator:'scripts/hero-fidelity-qa.js',deterministic:true,generatedAt:new Date(0).toISOString(),sourceDigest:hash(JSON.stringify({registry:hero.registry,assets:HERO_ASSETS,recipes:recipes.filter(recipe=>HERO_IDS.includes(recipe.id)),manifest:manifest.heroFidelityContract})),summary:{passed:errors.length===0,errorCount:errors.length,warningCount:warnings.length,checkCount:checks.length},checks,errors,warnings,counts:{heroRecipes:HERO_IDS.length,authoredReplacements:changed,families:Object.keys(HERO_ASSETS).length,backgrounds:Object.keys(BACKGROUNDS).length}};
}

function checker(){return`<pattern id="checker" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#fff"/><rect width="12" height="12" fill="#ddd"/><rect x="12" y="12" width="12" height="12" fill="#ddd"/></pattern>`;}
function panel({x,y,w,h,label,meta,art,scale=1,background,text}){const tile=background==='#111111'?'#202020':background||'url(#checker)';return`<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="16" fill="${tile}" stroke="${text}" stroke-opacity=".24"/><g transform="translate(${(w-600*scale)/2} 18) scale(${scale})">${art}</g><text x="18" y="${h-38}" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="700">${esc(label)}</text><text x="18" y="${h-16}" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="12" opacity=".68">${esc(meta)}</text></g>`;}
function heroBoard(baseline,hero,recipe,background){
  const text=background==='#111111'?'#fff':'#171512',bg=background?`<rect width="100%" height="100%" fill="${background}"/>`:`<rect width="100%" height="100%" fill="url(#checker)"/>`;
  const before=renderComposition(baseline,recipe,{token:`${recipe.id}-before`}),after=renderComposition(hero,recipe,{token:`${recipe.id}-after`}),flipped=renderComposition(hero,recipe,{flip:true,token:`${recipe.id}-flip`}),etched=renderComposition(hero,recipe,{finishId:'finish-etched',token:`${recipe.id}-etched`});
  const panels=[panel({x:30,y:115,w:620,h:680,label:'Before · locked v9 baseline',meta:'Original stable-ID assets + pair junctions',art:before,scale:1,background,text}),panel({x:675,y:115,w:620,h:680,label:'After · near-final hero art',meta:'21-asset replacement system · clean finish',art:after,scale:1,background,text}),panel({x:1320,y:115,w:620,h:680,label:'After · horizontally flipped',meta:'Full composition mirrors with exact pair plates',art:flipped,scale:1,background,text}),panel({x:30,y:825,w:620,h:680,label:'After · Etched MVP finish',meta:'Finish remains non-anatomical and alpha-masked',art:etched,scale:1,background,text}),panel({x:675,y:825,w:620,h:680,label:'25% review',meta:'150 px equivalent art review',art:after,scale:.25,background,text}),panel({x:1320,y:825,w:292,h:340,label:'96 px',meta:'Expression + silhouette thumbnail',art:after,scale:.16,background,text}),panel({x:1640,y:825,w:292,h:340,label:'48 px',meta:'Eye count + mouth family check',art:after,scale:.08,background,text})];
  return`<svg xmlns="http://www.w3.org/2000/svg" width="1970" height="1540" viewBox="0 0 1970 1540"><defs>${checker()}</defs>${bg}<text x="34" y="48" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="32" font-weight="700">${esc(recipe.name)} · Hero fidelity comparison</text><text x="34" y="81" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="15" opacity=".72">${esc(recipe.id)} · stable IDs preserved · authored runtime geometry disabled</text>${panels.join('')}</svg>`;
}
function summaryBoard(baseline,hero,recipes,background){
  const text=background==='#111111'?'#fff':'#171512',bg=background?`<rect width="100%" height="100%" fill="${background}"/>`:`<rect width="100%" height="100%" fill="url(#checker)"/>`;
  const rows=recipes.map((recipe,index)=>{const y=115+index*660;return[panel({x:30,y,w:620,h:625,label:`${recipe.name} · before`,meta:recipe.id,art:renderComposition(baseline,recipe,{token:`summary-${recipe.id}-before`}),scale:.92,background,text}),panel({x:675,y,w:620,h:625,label:`${recipe.name} · after`,meta:'Near-final clean hero art',art:renderComposition(hero,recipe,{token:`summary-${recipe.id}-after`}),scale:.92,background,text}),panel({x:1320,y,w:620,h:625,label:`${recipe.name} · after + etched`,meta:'Finish and pair-junction review',art:renderComposition(hero,recipe,{finishId:'finish-etched',token:`summary-${recipe.id}-etched`}),scale:.92,background,text})].join('');}).join('');
  return`<svg xmlns="http://www.w3.org/2000/svg" width="1970" height="2110" viewBox="0 0 1970 2110"><defs>${checker()}</defs>${bg}<text x="34" y="48" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="32" font-weight="700">Three locked heroes · before / after</text><text x="34" y="81" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="15" opacity=".72">Original production artwork derived from the supplied MVP direction · no cropped reference images · no runtime anatomy generation</text>${rows}</svg>`;
}
async function writeSheet(name,svg){fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,`${name}.svg`),svg);await sharp(Buffer.from(svg)).png().toFile(path.join(OUT,`${name}.png`));}

async function main(){
  const baseline=loadData(false),hero=loadData(true),manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/manifest.json'),'utf8')),report=validate(baseline,hero,manifest);fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'hero-fidelity-validation-report.json'),JSON.stringify(report,null,2)+'\n');fs.copyFileSync(path.join(ROOT,'schemas/hero-fidelity-validation-report.schema.json'),path.join(OUT,'hero-fidelity-validation-report.schema.json'));
  if(!VALIDATE_ONLY){const recipes=(hero.compatibility.recipes||[]).filter(recipe=>HERO_IDS.includes(recipe.id));for(const [backgroundName,background] of Object.entries(BACKGROUNDS)){await writeSheet(`hero-fidelity-summary-${backgroundName}`,summaryBoard(baseline,hero,recipes,background));for(const recipe of recipes)await writeSheet(`hero-fidelity-${recipe.id}-${backgroundName}`,heroBoard(baseline,hero,recipe,background));}}
  console.log(JSON.stringify(report.summary));if(!report.summary.passed)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exit(1);});
