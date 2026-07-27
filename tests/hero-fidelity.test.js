'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

const partFiles=['bases','eyes','noses','mouths','horns','patterns-compact','extras'].map(name=>`assets/parts/${name}.js`);
const heroFiles=['bases','eyes','noses','mouths','horns','patterns','extras'].map(name=>`assets/hero-v9/${name}.js`);
const context={window:{MONSTER_PARTS:{},MONSTER_HERO_FIDELITY:null},console};
context.window.window=context.window;
vm.createContext(context);
for(const file of [...partFiles,...heroFiles,'assets/pair-junctions.js','assets/compatibility.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}

const registry=context.window.MONSTER_HERO_FIDELITY;
const parts=context.window.MONSTER_PARTS;
const compatibility=context.window.MONSTER_COMPATIBILITY;
const pairJunctions=context.window.MONSTER_PAIR_JUNCTIONS;
const expected={
  bases:['base-bog','base-fuzz','base-imp'],
  eyes:['eye-cyclops','eye-sleepy','eye-wide'],
  noses:['nose-button','nose-hook','nose-piggy'],
  mouths:['mouth-grin','mouth-fangs','mouth-roar'],
  horns:['horn-curved','horn-bent','horn-spiky'],
  patterns:['pattern-spots','pattern-stripes','pattern-freckles'],
  extras:['extra-earring','extra-scar','extra-spikes']
};
const heroRecipeIds=['bog-cyclops-grin','fuzz-fanged','imp-roar'];

assert(registry,'hero fidelity registry must load');
assert.strictEqual(registry.version,9);
assert.strictEqual(registry.runtimeGeometry,false);
assert.deepStrictEqual([...registry.heroRecipeIds],heroRecipeIds);
assert(Object.values(registry.reviewScoreTargets).every(score=>score>=4),'all locked review targets must be at least 4/5');
assert.strictEqual(compatibility.recipes.length,16,'non-hero recipe inventory must remain intact');

let replacementCount=0;
for(const [family,ids] of Object.entries(expected)){
  assert.deepStrictEqual([...registry.families[family]],ids,`${family} registry order changed`);
  const familyAssets=parts[family]||[];
  for(const id of ids){
    const matches=familyAssets.filter(asset=>asset.id===id);
    assert.strictEqual(matches.length,1,`${family}/${id} must preserve one stable asset`);
    const asset=matches[0];
    assert.strictEqual(asset.heroRevision,'9.4.0',`${id} missing hero revision`);
    assert.strictEqual(asset.authored,true,`${id} must be explicitly authored`);
    assert.strictEqual(asset.runtimeGeometry,false,`${id} must disable runtime geometry`);
    assert((asset.tags||[]).includes('hero-v9'),`${id} missing hero-v9 tag`);
    assert(/viewBox=["']0 0 600 600["']/.test(asset.svg),`${id} has wrong coordinate system`);
    assert(!/<script\b|<foreignObject\b|on[a-z]+\s*=|rough\.js|roughjs/i.test(asset.svg),`${id} contains forbidden runtime or embedded content`);
    replacementCount++;
  }
}
assert.strictEqual(replacementCount,21,'exactly 21 visible hero components must be re-authored');

for(const recipeId of heroRecipeIds){
  const recipe=compatibility.recipes.find(item=>item.id===recipeId);
  assert(recipe,`${recipeId} recipe is missing`);
  for(const [family,key] of [['bases','baseId'],['eyes','eyeId'],['noses','noseId'],['mouths','mouthId'],['horns','hornId'],['patterns','patternId'],['extras','extraId']]){
    const asset=(parts[family]||[]).find(item=>item.id===recipe[key]);
    assert(asset,`${recipeId}/${family} stable ID is missing`);
    assert((asset.tags||[]).includes('hero-v9'),`${recipeId}/${family} did not resolve to hero artwork`);
  }
  assert(pairJunctions.select(recipe.baseId,recipe.mouthId),`${recipeId} missing exact mouth junction`);
  assert(pairJunctions.select(recipe.baseId,recipe.hornId),`${recipeId} missing exact horn junction`);
  assert(compatibility.validateRecipe(recipe),`${recipeId} became incompatible`);
}

for(const [family,count] of Object.entries({bases:6,eyes:10,noses:9,mouths:9,horns:9,patterns:9,extras:9})){
  assert.strictEqual((parts[family]||[]).length,count,`${family} inventory changed`);
}

console.log('Hero fidelity v9: 21 stable-ID replacements, three complete heroes, pair junctions, and non-hero compatibility passed.');
