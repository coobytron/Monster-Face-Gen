#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'generated','qa');
const REVIEW_PATH=path.join(ROOT,'reviews','hero-fidelity-v9.json');
const HERO_IDS=['bog-cyclops-grin','fuzz-fanged','imp-roar'];
const CATEGORIES=['silhouetteStrength','attachmentIntegration','expressionRead','detailDensity','thumbnailRead','mvpSimilarity'];
const hash=value=>crypto.createHash('sha256').update(String(value)).digest('hex');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function validate(data){
  const errors=[],warnings=[];
  if(data.schemaVersion!==1)errors.push({code:'unsupported-schema-version'});
  if(JSON.stringify(data.scoreScale)!==JSON.stringify([1,2,3,4,5]))errors.push({code:'invalid-score-scale'});
  const byId=Object.fromEntries((data.reviews||[]).map(r=>[r.recipeId,r]));
  for(const id of HERO_IDS){
    const review=byId[id];
    if(!review){errors.push({code:'missing-review',recipeId:id});continue;}
    if(!review.reviewer||!review.reviewedAt)errors.push({code:'incomplete-review-metadata',recipeId:id});
    if(!review.assetIds||Object.keys(review.assetIds).length<8)errors.push({code:'missing-asset-references',recipeId:id});
    if(!Array.isArray(review.junctionIds)||review.junctionIds.length!==2)errors.push({code:'missing-junction-references',recipeId:id});
    if(!Array.isArray(review.notes)||review.notes.length===0)errors.push({code:'missing-review-notes',recipeId:id});
    for(const category of CATEGORIES){
      const baseline=review.baseline?.[category],current=review.current?.[category],target=data.targets?.[category];
      if(!Number.isInteger(baseline)||baseline<1||baseline>5||!Number.isInteger(current)||current<1||current>5)errors.push({code:'invalid-score',recipeId:id,category});
      if(Number.isInteger(baseline)&&Number.isInteger(current)&&current<baseline)errors.push({code:'score-regression',recipeId:id,category,baseline,current});
      if(Number.isInteger(current)&&Number.isInteger(target)&&current<target)errors.push({code:'below-target',recipeId:id,category,target,current});
    }
    if(review.humanConfirmed!==true)warnings.push({code:'human-confirmation-pending',recipeId:id});
  }
  for(const id of Object.keys(byId))if(!HERO_IDS.includes(id))errors.push({code:'unknown-review-recipe',recipeId:id});
  return {schemaVersion:1,generator:'scripts/hero-review-qa.js',deterministic:true,generatedAt:new Date(0).toISOString(),sourceDigest:hash(JSON.stringify(data)),summary:{passed:errors.length===0,errorCount:errors.length,warningCount:warnings.length,reviewCount:(data.reviews||[]).length,humanConfirmedCount:(data.reviews||[]).filter(r=>r.humanConfirmed).length},errors,warnings};
}
function board(review){
  const cards=[['Full composition','0 0 600 600'],['Silhouette only','0 0 600 600'],['Eyes / expression crop','110 120 380 220'],['Mouth / jaw crop','90 300 420 260'],['Horn / ear roots','80 70 440 180'],['Flipped view','0 0 600 600'],['Thumbnail view','0 0 600 600']];
  const backgroundRows=[['cream','#f2ead8'],['white','#fff'],['black','#111'],['transparent','url(#checker)']];
  const panels=[];
  backgroundRows.forEach(([name,bg],row)=>cards.forEach(([label,view],col)=>{const x=24+col*258,y=106+row*290,source=`hero-fidelity-${review.recipeId}-${name}.svg`;const flip=label==='Flipped view'?'translate(240 0) scale(-1 1)':'';const silhouette=label==='Silhouette only'?'filter:url(#silhouette)':'';const thumb=label==='Thumbnail view'?'width="96" height="96" x="72" y="60"':'width="220" height="220" x="10" y="10"';panels.push(`<g transform="translate(${x} ${y})"><rect width="240" height="250" rx="12" fill="${bg}" stroke="#777" stroke-opacity=".35"/><svg viewBox="${view}" ${thumb} overflow="hidden"><g transform="${flip}" ${silhouette}><image href="${source}" width="600" height="600" preserveAspectRatio="xMidYMid slice"/></g></svg><text x="12" y="232" font-family="Arial" font-size="13" font-weight="700" fill="${name==='black'?'#fff':'#171512'}">${esc(label)}</text><text x="12" y="247" font-family="Arial" font-size="10" fill="${name==='black'?'#fff':'#171512'}" opacity=".65">${name}</text></g>`)}));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1840" height="1280" viewBox="0 0 1840 1280"><defs><pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#fff"/><rect width="10" height="10" fill="#ddd"/><rect x="10" y="10" width="10" height="10" fill="#ddd"/></pattern><filter id="silhouette"><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/></filter></defs><rect width="100%" height="100%" fill="#ece9e2"/><text x="28" y="44" font-family="Arial" font-size="28" font-weight="700">${esc(review.recipeId)} · human MVP-fidelity review</text><text x="28" y="74" font-family="Arial" font-size="14">Stable IDs · baseline/current scores · human confirmation: ${review.humanConfirmed?'yes':'pending'}</text>${panels.join('')}</svg>`;
}
function main(){
  const data=JSON.parse(fs.readFileSync(REVIEW_PATH,'utf8'));
  const report=validate(data);
  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,'hero-review-validation-report.json'),JSON.stringify(report,null,2)+'\n');
  fs.copyFileSync(path.join(ROOT,'schemas','hero-fidelity-review.schema.json'),path.join(OUT,'hero-fidelity-review.schema.json'));
  for(const review of data.reviews||[])fs.writeFileSync(path.join(OUT,`hero-review-board-${review.recipeId}.svg`),board(review));
  console.log(JSON.stringify(report.summary));
  if(!report.summary.passed)process.exitCode=1;
}
main();
