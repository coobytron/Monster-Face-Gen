#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const {ROOT,loadBrowserData,readManifest,renderRecipe,hash}=require('./pair-junction-contract');

const REVIEW_FILE='reviews/library-fidelity-v9.json';
const HERO_REVIEW_FILE='reviews/hero-fidelity-v9.json';
const SCORE_KEYS=['silhouetteStrength','attachmentIntegration','expressionRead','detailDensity','thumbnailRead','mvpSimilarity'];
const HERO_IDS=['bog-cyclops-grin','fuzz-fanged','imp-roar'];
const NON_HERO_IDS=['bog-sleepy-gummy','fuzz-buck','skull-oracle','skull-jagged','imp-bat','imp-bent-grin','moss-grinner','moss-tongue','moss-gummy','blue-worry','blue-tangle','blue-wild','bog-gapped'];
const FAMILY_KEYS={baseId:'bases',eyeId:'eyes',noseId:'noses',mouthId:'mouths',hornId:'horns',patternId:'patterns',extraId:'extras'};

function readJson(relative){return JSON.parse(fs.readFileSync(path.join(ROOT,relative),'utf8'));}
function loadReview(){return readJson(REVIEW_FILE);}
function loadHeroReview(){return readJson(HERO_REVIEW_FILE);}
function indexById(list){return Object.fromEntries((list||[]).map(item=>[item.id,item]));}
function deterministicDigest(value){return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');}

function validate(data,manifest,review=loadReview(),heroReview=loadHeroReview()){
  const errors=[];const warnings=[];const checks=[];
  const recipes=indexById(data.compatibility.recipes||[]);
  const pairs=data.pairs?.byKey||{};
  const target=review.targets||{};

  if(review.revision!=='9.8.0') errors.push({code:'review-revision-mismatch',actual:review.revision||null});
  if(review.status!=='agent-reviewed-pending-art-director') errors.push({code:'invalid-review-status',actual:review.status||null});
  if(JSON.stringify(review.reviewedRecipeIds||[])!==JSON.stringify(NON_HERO_IDS)) errors.push({code:'reviewed-recipe-id-mismatch',expected:NON_HERO_IDS,actual:review.reviewedRecipeIds||[]});
  if((review.reviews||[]).length!==13) errors.push({code:'review-count-mismatch',expected:13,actual:(review.reviews||[]).length});

  const seen=new Set();
  for(const entry of review.reviews||[]){
    if(seen.has(entry.recipeId)) errors.push({code:'duplicate-review',recipeId:entry.recipeId});
    seen.add(entry.recipeId);
    const recipe=recipes[entry.recipeId];
    if(!recipe) { errors.push({code:'unknown-reviewed-recipe',recipeId:entry.recipeId}); continue; }
    if(HERO_IDS.includes(entry.recipeId)) errors.push({code:'hero-in-library-review',recipeId:entry.recipeId});
    if(data.compatibility.validateRecipe(recipe)!==true) errors.push({code:'blocked-reviewed-recipe',recipeId:entry.recipeId});
    const expectedAssets={base:recipe.baseId,eyes:recipe.eyeId,nose:recipe.noseId,mouth:recipe.mouthId,hornOrEar:recipe.hornId,pattern:recipe.patternId,extra:recipe.extraId,finish:'finish-etched'};
    for(const [key,value] of Object.entries(expectedAssets)) if(entry.assetIds?.[key]!==value) errors.push({code:'review-asset-id-mismatch',recipeId:entry.recipeId,key,expected:value,actual:entry.assetIds?.[key]||null});
    const expectedJunctions=[`${recipe.baseId}|${recipe.mouthId}`,`${recipe.baseId}|${recipe.hornId}`];
    if(JSON.stringify(entry.junctionIds||[])!==JSON.stringify(expectedJunctions)) errors.push({code:'review-junction-id-mismatch',recipeId:entry.recipeId,expected:expectedJunctions,actual:entry.junctionIds||[]});
    for(const pairKey of expectedJunctions) if(!pairs[pairKey]) errors.push({code:'missing-reviewed-pair',recipeId:entry.recipeId,pairKey});
    for(const score of SCORE_KEYS){
      if(!Number.isInteger(entry.current?.[score])||entry.current[score]<1||entry.current[score]>5) errors.push({code:'invalid-current-score',recipeId:entry.recipeId,score,value:entry.current?.[score]});
      if(entry.current?.[score]<(target[score]||4)) errors.push({code:'below-target',recipeId:entry.recipeId,score,target:target[score]||4,value:entry.current?.[score]});
      if((entry.current?.[score]||0)<(entry.baseline?.[score]||0)) errors.push({code:'score-regression',recipeId:entry.recipeId,score});
    }
    if(entry.humanConfirmed===true) errors.push({code:'unverified-human-confirmation',recipeId:entry.recipeId});
    warnings.push({code:'human-confirmation-required',recipeId:entry.recipeId,status:entry.status||null});
    if(!Array.isArray(entry.findings)||entry.findings.length===0) errors.push({code:'missing-findings',recipeId:entry.recipeId});
    if(!Array.isArray(entry.actions)||entry.actions.length===0) errors.push({code:'missing-actions',recipeId:entry.recipeId});
    if(!entry.reviewRequirements?.sizes?.includes('192px')) errors.push({code:'missing-review-size',recipeId:entry.recipeId,size:'192px'});
    if(!entry.reviewRequirements?.backgrounds?.includes('transparent')) errors.push({code:'missing-review-background',recipeId:entry.recipeId,background:'transparent'});

    for(const [key,family] of Object.entries(FAMILY_KEYS)){
      const id=recipe[key];const asset=(data.parts[family]||[]).find(item=>item.id===id);
      if(!asset) errors.push({code:'unknown-replacement-asset',recipeId:entry.recipeId,family,id});
      else if(asset.runtimeGeometry!==false) errors.push({code:'runtime-anatomy-generation-enabled',recipeId:entry.recipeId,family,id});
      else if(asset.heroRevision!=='9.4.0'&&asset.libraryRevision!=='9.8.0') errors.push({code:'unreviewed-asset-revision',recipeId:entry.recipeId,family,id,heroRevision:asset.heroRevision||null,libraryRevision:asset.libraryRevision||null});
    }

    const exact=renderRecipe(data,recipe,{paired:true,finishId:'finish-etched'});
    const flipped=renderRecipe(data,recipe,{paired:true,flip:true,finishId:'finish-etched'});
    if(exact.length<1000) errors.push({code:'empty-reviewed-render',recipeId:entry.recipeId});
    if(!flipped.includes('scale(-1 1)')) errors.push({code:'flip-render-missing',recipeId:entry.recipeId});
  }

  for(const id of NON_HERO_IDS) if(!seen.has(id)) errors.push({code:'missing-structured-review',recipeId:id});
  if(heroReview.status!=='human-confirmation-required') errors.push({code:'hero-review-status-changed',actual:heroReview.status||null});
  for(const entry of heroReview.reviews||[]){ if(entry.humanConfirmed!==false) errors.push({code:'hero-human-confirmation-not-pending',recipeId:entry.recipeId}); warnings.push({code:'human-confirmation-required',recipeId:entry.recipeId,status:'locked-hero-pending-art-director'}); }

  const contract=manifest.libraryFidelityContract||{};
  if(contract.revision!=='9.8.0') errors.push({code:'manifest-library-revision-mismatch',actual:contract.revision||null});
  if(contract.humanConfirmationRequired!==true) errors.push({code:'manifest-human-confirmation-policy-missing'});
  if(contract.runtimeGeometry!==false||manifest.runtimeAnatomyGeneration!==false||data.libraryFidelity.runtimeGeometry!==false) errors.push({code:'runtime-anatomy-generation-enabled'});
  if((manifest.counts?.libraryAuthoredReplacements||0)!==34) errors.push({code:'manifest-replacement-count-mismatch',expected:34,actual:manifest.counts?.libraryAuthoredReplacements||0});

  const groups={
    review:['review-revision-mismatch','invalid-review-status','reviewed-recipe-id-mismatch','review-count-mismatch','duplicate-review','unknown-reviewed-recipe','hero-in-library-review','missing-structured-review','hero-review-status-changed','hero-human-confirmation-not-pending','unverified-human-confirmation'],
    references:['review-asset-id-mismatch','review-junction-id-mismatch','missing-reviewed-pair','unknown-replacement-asset'],
    scores:['invalid-current-score','below-target','score-regression'],
    production:['missing-findings','missing-actions','missing-review-size','missing-review-background','unreviewed-asset-revision','empty-reviewed-render','flip-render-missing','blocked-reviewed-recipe'],
    manifest:['manifest-library-revision-mismatch','manifest-human-confirmation-policy-missing','manifest-replacement-count-mismatch'],
    authored:['runtime-anatomy-generation-enabled']
  };
  for(const [name,codes] of Object.entries(groups)) checks.push({name,passed:!errors.some(error=>codes.includes(error.code))});

  return {
    schemaVersion:1,generator:'scripts/library-fidelity-contract.js',deterministic:true,generatedAt:new Date(0).toISOString(),
    sourceManifestVersion:manifest.version,
    sourceDigest:deterministicDigest({review,heroReview,libraryFidelity:data.libraryFidelity,recipes:data.compatibility.recipes,pairs:data.pairs.reviewedPairKeys,contract}),
    summary:{passed:errors.length===0,errorCount:errors.length,warningCount:warnings.length,checkCount:checks.length},checks,errors,warnings,
    counts:{heroReviews:(heroReview.reviews||[]).length,libraryReviews:(review.reviews||[]).length,totalReviewedRecipes:(heroReview.reviews||[]).length+(review.reviews||[]).length,libraryAuthoredReplacements:34,exactPairJunctions:(data.pairs.all||[]).length}
  };
}

function reviewSummarySvg(data,review){
  const recipes=indexById(data.compatibility.recipes||[]);const cols=4,cellW=500,cellH=220,header=105,rows=Math.ceil((review.reviews||[]).length/cols),width=cols*cellW,height=header+rows*cellH;
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
  const cells=(review.reviews||[]).map((entry,index)=>{const x=(index%cols)*cellW,y=header+Math.floor(index/cols)*cellH,recipe=recipes[entry.recipeId];const score=SCORE_KEYS.map(key=>entry.current[key]).reduce((a,b)=>a+b,0)/SCORE_KEYS.length;return `<g transform="translate(${x} ${y})"><rect x="12" y="10" width="476" height="194" rx="14" fill="#fffaf0" stroke="#171512" stroke-opacity=".22"/><text x="30" y="48" font-family="Arial,Helvetica,sans-serif" font-size="20" font-weight="700" fill="#171512">${esc(entry.recipeId)}</text><text x="30" y="76" font-family="Arial,Helvetica,sans-serif" font-size="14" fill="#171512" opacity=".72">${esc(recipe?.name||entry.recipeName||'')}</text><text x="30" y="112" font-family="Arial,Helvetica,sans-serif" font-size="13" fill="#171512">Exact pairs: ${esc(entry.junctionIds.join(' · '))}</text><text x="30" y="141" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="700" fill="#171512">Agent score ${score.toFixed(1)} / 5</text><text x="30" y="171" font-family="Arial,Helvetica,sans-serif" font-size="12" fill="#8a4f2a">ART-DIRECTOR CONFIRMATION PENDING</text></g>`;}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#f2ead8"/><text x="24" y="42" font-family="Arial,Helvetica,sans-serif" font-size="28" font-weight="700" fill="#171512">Remaining Recipe Library — Structured Fidelity Rollout</text><text x="24" y="73" font-family="Arial,Helvetica,sans-serif" font-size="15" fill="#171512" opacity=".72">13 production candidates · exact authored pairs · stable IDs · human acceptance intentionally pending</text>${cells}</svg>`;
}

module.exports={ROOT,REVIEW_FILE,HERO_REVIEW_FILE,SCORE_KEYS,HERO_IDS,NON_HERO_IDS,loadReview,loadHeroReview,validate,reviewSummarySvg};
