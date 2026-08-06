const assert=require('assert');
const vm=require('vm');
const fs=require('fs');
const path=require('path');
const pack=require('../assets/v10-noses');
const compatibility=require('../assets/v10-nose-compatibility');
const placements=require('../assets/v10-nose-placements');
const ROOT=path.resolve(__dirname,'..');
const BASE_IDS=['base-bog','base-fuzz','base-skull','base-imp','base-moss','base-blue',...require('../assets/v10-heads').assets.map(item=>item.id)];

assert.strictEqual(pack.issue,42);
assert.strictEqual(pack.runtimeGeometry,false);
assert.strictEqual(pack.humanApprovalRequired,true);
assert.strictEqual(pack.assets.length,18,'expected 18 V10 nose candidates');
assert.strictEqual(pack.baselineCount+pack.assets.length,pack.targetCount,'nose quota must reach 27');

const ids=new Set(),families=new Set();
for(const asset of pack.assets){
  assert(/^nose-v10-[a-z0-9-]+$/.test(asset.id),`invalid stable ID: ${asset.id}`);
  assert(!ids.has(asset.id),`duplicate stable ID: ${asset.id}`);ids.add(asset.id);families.add(asset.family);
  assert.strictEqual(asset.authored,true,`${asset.id} must be authored`);
  assert.strictEqual(asset.runtimeGeometry,false,`${asset.id} cannot use runtime geometry`);
  assert.strictEqual(asset.status,'agent-candidate-pending-art-director');
  assert.deepStrictEqual(Object.keys(asset.anchor).sort(),['x','y']);
  assert(Array.isArray(asset.bounds)&&asset.bounds.length===4,`${asset.id} needs authored bounds`);
  assert(Number.isFinite(asset.zOrder),`${asset.id} needs z-order`);
  assert(asset.svg.startsWith('<svg')&&/viewBox=['"]0 0 600 600['"]/.test(asset.svg),`${asset.id} must be static shared-canvas SVG`);
  assert(!/(<script|foreignObject|on\w+=|Math\.random|Date\()/i.test(asset.svg),`${asset.id} contains active or random content`);
  const matrix=compatibility[asset.id];assert(matrix,`${asset.id} lacks compatibility fixture`);
  const classified=[...matrix.approved,...matrix.acceptable,...matrix.blocked];
  assert.strictEqual(classified.length,BASE_IDS.length,`${asset.id} must classify every base`);
  assert.strictEqual(new Set(classified).size,BASE_IDS.length,`${asset.id} repeats a base classification`);
  assert.deepStrictEqual(new Set(classified),new Set(BASE_IDS),`${asset.id} references wrong bases`);
  assert.deepStrictEqual(new Set(matrix.approved),new Set(asset.compatibleBases),`${asset.id} approved list must match metadata`);
  assert(Object.keys(placements).some(key=>key.endsWith(`|${asset.id}`)),`${asset.id} needs a rigid pair override`);
}
for(const family of pack.requiredFamilies)assert(families.has(family),`missing required family: ${family}`);
for(const [pairKey,value] of Object.entries(placements)){
  const [baseId,noseId]=pairKey.split('|');assert(BASE_IDS.includes(baseId),`${pairKey} has unknown base`);assert(ids.has(noseId),`${pairKey} has unknown nose`);
  assert(compatibility[noseId].approved.includes(baseId),`${pairKey} must be approved`);
  assert(['x','y','scale','rotation'].every(key=>Number.isFinite(value[key])),`${pairKey} override incomplete`);
}
const context={window:{MONSTER_PARTS:{noses:[]}},console};vm.createContext(context);
for(const file of ['assets/v10-nose-assets-01.js','assets/v10-nose-assets-02.js','assets/v10-noses.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,file),'utf8'),context,{filename:file});
assert.strictEqual(context.window.MONSTER_PARTS.noses.length,18,'browser registration must expose all candidates');
assert.strictEqual(context.window.MONSTER_V10_NOSE_PACK.issue,42);
console.log('V10 nose pack validation passed: 18 authored candidates, complete base classifications, rigid overrides, and no runtime anatomy.');
