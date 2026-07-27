'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {
  ROOT,HERO_IDS,loadBrowserData,readManifest,requiredPairs,validate,renderHero,hash
} = require('../scripts/pair-junction-contract');

const data=loadBrowserData();
const manifest=readManifest();
const report=validate(data,manifest);
assert.equal(report.summary.passed,true,JSON.stringify(report.errors,null,2));
assert.equal(report.counts.heroRecipes,3);
assert.equal(report.counts.requiredPairs,6);
assert.equal(report.counts.publishedPairs,6);

const required=requiredPairs(data);
for(const entry of required){
  assert.ok(data.pairs.byKey[entry.pairKey],`missing ${entry.pairKey}`);
  assert.equal(data.pairs.select(entry.baseId,entry.partId).id,entry.pairKey);
}
assert.equal(data.pairs.select('base-bog','mouth-gummy'),null,'non-hero pair must use generic fallback');
assert.deepEqual(Array.from(data.pairs.heroRecipeIds),HERO_IDS);

for(const recipeId of HERO_IDS){
  const recipe=data.compatibility.recipes.find(item=>item.id===recipeId);
  const before=renderHero(data,recipe,{paired:false});
  const after=renderHero(data,recipe,{paired:true});
  const flipped=renderHero(data,recipe,{paired:true,flip:true});
  assert.ok(before.length>1000);
  assert.ok(after.length>1000);
  assert.notEqual(hash(before),hash(after),`${recipeId} before and after should differ`);
  assert.ok(flipped.includes('scale(-1 1)'),`${recipeId} flip should mirror full composition`);
}

for(const filename of ['assets/pair-junctions.js','v9-pair-junctions.js','v9-hybrid-bundles.js']){
  const source=fs.readFileSync(path.join(ROOT,filename),'utf8');
  new vm.Script(source,{filename});
}

console.log('pair junction tests passed');
