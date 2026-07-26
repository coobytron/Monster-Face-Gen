const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

const context={window:{}};
vm.createContext(context);
for(const path of ['assets/compatibility.js','assets/expression-direction.js','assets/silhouette-direction.js']){
  vm.runInContext(fs.readFileSync(path,'utf8'),context,{filename:path});
}

const compatibility=context.window.MONSTER_COMPATIBILITY;
const expression=context.window.MONSTER_EXPRESSION_DIRECTION;
const silhouette=context.window.MONSTER_SILHOUETTE_DIRECTION;

assert.deepStrictEqual([...expression.vocabulary],['sleepy','uneasy','feral','goofy','stern','startled']);
assert(expression.approvedPairs.length>=6,'at least six authored expression pair recipes are required');
assert.strictEqual(Object.keys(expression.recipeExpressions).length,compatibility.recipes.length,'every approved recipe needs an expression tag');

for(const recipe of compatibility.recipes){
  assert(expression.validateRecipe(recipe),`${recipe.id} is missing supported expression direction`);
}

for(const [baseId,families] of Object.entries(compatibility.matrix)){
  assert(silhouette.bases[baseId],`${baseId} is missing silhouette rhythm metadata`);
  for(const state of ['approved','acceptable']){
    for(const hornId of families.horns[state]){
      assert(silhouette.hasAuthoredRoot(baseId,hornId),`${baseId}/${hornId} is missing an authored root profile`);
      assert(silhouette.flipSafe(baseId,hornId),`${baseId}/${hornId} is not flip-safe`);
    }
  }
}

for(const [key,override] of Object.entries(silhouette.pairOverrides)){
  const [baseId,hornId]=key.split('|');
  assert.notStrictEqual(compatibility.status(baseId,'horns',hornId),'blocked',`${key} override targets a blocked pairing`);
  assert.strictEqual(override.seamProfile,silhouette.seamProfile(baseId,hornId),`${key} override seam profile mismatch`);
}

console.log('Art direction v8: expression tags, approved pairings, silhouette rhythm, root profiles, and flip safety passed.');
