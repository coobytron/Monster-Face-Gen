'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {
  ROOT,HERO_IDS,loadBrowserData,readManifest,reviewedRecipeIds,requiredPairs,validate,renderRecipe,hash
} = require('../scripts/pair-junction-contract');

const data=loadBrowserData();
const manifest=readManifest();
const report=validate(data,manifest);
assert.equal(report.summary.passed,true,JSON.stringify(report.errors,null,2));
assert.equal(report.counts.heroRecipes,3);
assert.equal(report.counts.reviewedRecipes,16);
assert.equal(report.counts.requiredPairs,32);
assert.equal(report.counts.publishedPairs,32);
assert.equal(report.counts.mouthPairs,16);
assert.equal(report.counts.hornPairs,16);

const recipeIds=reviewedRecipeIds(data);
assert.equal(recipeIds.length,16);
assert.deepEqual(Array.from(data.pairs.reviewedRecipeIds),recipeIds);
assert.deepEqual(Array.from(data.pairs.heroRecipeIds),HERO_IDS);

const required=requiredPairs(data);
for(const entry of required){
  assert.ok(data.pairs.byKey[entry.pairKey],`missing ${entry.pairKey}`);
  assert.equal(data.pairs.select(entry.baseId,entry.partId).id,entry.pairKey);
}
assert.equal(data.pairs.select('base-bog','mouth-tongue'),null,'non-curated pair must retain generic fallback');

for(const recipe of data.compatibility.recipes){
  const before=renderRecipe(data,recipe,{paired:false});
  const after=renderRecipe(data,recipe,{paired:true});
  const flipped=renderRecipe(data,recipe,{paired:true,flip:true});
  assert.ok(before.length>1000);
  assert.ok(after.length>1000);
  assert.notEqual(hash(before),hash(after),`${recipe.id} generic and exact junction review should differ`);
  assert.ok(flipped.includes('scale(-1 1)'),`${recipe.id} flip should mirror full composition`);
  assert.equal(recipe.pairJunctions.mouth,`${recipe.baseId}|${recipe.mouthId}`);
  assert.equal(recipe.pairJunctions.horns,`${recipe.baseId}|${recipe.hornId}`);
}

for(const filename of [
  'assets/pair-junctions.js','assets/compatibility.js','v8-compatibility.js','v9-pair-junctions.js','v9-hybrid-bundles.js',
  'assets/library-v9/bases.js','assets/library-v9/eyes.js','assets/library-v9/noses.js','assets/library-v9/mouths.js',
  'assets/library-v9/horns.js','assets/library-v9/patterns.js','assets/library-v9/extras.js'
]){
  const source=fs.readFileSync(path.join(ROOT,filename),'utf8');
  new vm.Script(source,{filename});
}

console.log('reviewed library pair junction tests passed');
