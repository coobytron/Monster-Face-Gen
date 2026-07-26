const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

const context={window:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/compatibility.js','utf8'),context);
const c=context.window.MONSTER_COMPATIBILITY;

const expected={
  eyes:['eye-none','eye-cyclops','eye-droopy','eye-beady','eye-wide','eye-triple','eye-stacked','eye-crossed','eye-sleepy','eye-wild'],
  noses:['nose-none','nose-button','nose-piggy','nose-skeletal','nose-beak','nose-trihole','nose-elephant','nose-warty','nose-hook'],
  mouths:['mouth-none','mouth-grin','mouth-gummy','mouth-fangs','mouth-jagged','mouth-tongue','mouth-buck','mouth-roar','mouth-gapped'],
  horns:['horn-none','horn-curved','horn-spiky','horn-nubs','horn-long','horn-rams','horn-bat','horn-tufted','horn-bent']
};

assert.strictEqual(c.version,8);
assert.strictEqual(c.recipes.length,16);
assert.deepStrictEqual([...c.states],['approved','acceptable','blocked']);

for(const [baseId,families] of Object.entries(c.matrix)){
  for(const [family,ids] of Object.entries(expected)){
    const classified=['approved','acceptable','blocked'].flatMap(state=>families[family][state]);
    assert.strictEqual(new Set(classified).size,ids.length,`${baseId}/${family} contains duplicate or missing classifications`);
    assert.deepStrictEqual([...new Set(classified)].sort(),[...ids].sort(),`${baseId}/${family} must classify every stable ID`);
  }
}

for(const recipe of c.recipes){
  assert(c.validateRecipe(recipe),`${recipe.id} contains a blocked pair`);
}

assert.strictEqual(c.status('base-skull','mouths','mouth-roar'),'blocked');
assert.strictEqual(c.status('base-fuzz','mouths','mouth-roar'),'blocked');
assert(c.placementOverrides['base-imp|mouth-roar'],'wide mouth exception requires an authored override');

for(let i=0;i<100;i++){
  const recipe=c.recipes[i%c.recipes.length];
  assert(c.validateRecipe(recipe),`shuffle sample ${i} is incompatible`);
  for(const family of ['eyes','noses','mouths','horns']){
    const compatible=c.compatibleIds(recipe.baseId,family,'acceptable');
    assert(compatible.length>0,`${recipe.baseId}/${family} has no compatible shuffle pool`);
    const selected=compatible[i%compatible.length];
    assert.notStrictEqual(c.status(recipe.baseId,family,selected),'blocked',`shuffle sample ${i} selected blocked ${selected}`);
  }
}

console.log('Compatibility v8: matrix coverage, 16 recipes, overrides, and 100 shuffle samples passed.');
