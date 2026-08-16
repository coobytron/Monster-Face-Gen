'use strict';
const assert=require('assert');
const crypto=require('crypto');
const pack=require('../assets/v10-eyes');
const integration=require('../assets/v10-eye-integration');
const manifest=require('../assets/v10-eye-manifest.json');

assert.strictEqual(pack.issue,41);
assert.strictEqual(pack.runtimeGeometry,false);
assert.strictEqual(pack.humanApprovalRequired,true);
assert.strictEqual(pack.assets.length,20,'expected 20 V10 eye candidates');
assert.strictEqual(pack.baselineCount+pack.assets.length,pack.targetCount,'eye quota must reach 30');
assert.deepStrictEqual(pack.assets.map(asset=>asset.id),manifest.assetIds,'eye pack and manifest order must match');

const ids=new Set();
const families=new Set();
const expressions=new Set();
const digests=new Set();
for(const asset of pack.assets){
  assert(/^eye-v10-[a-z0-9-]+$/.test(asset.id),`invalid stable ID: ${asset.id}`);
  assert(!ids.has(asset.id),`duplicate stable ID: ${asset.id}`);
  ids.add(asset.id);
  families.add(asset.family);
  expressions.add(asset.expression);
  assert.strictEqual(asset.authored,true,`${asset.id} must be authored`);
  assert.strictEqual(asset.runtimeGeometry,false,`${asset.id} cannot use runtime geometry`);
  assert.strictEqual(asset.status,'agent-candidate-pending-art-director');
  assert.strictEqual(asset.assetRevision,'10.3.1');
  assert.strictEqual(asset.flipSafe,true);
  assert.strictEqual(asset.thumbnailSafe,true);
  assert.strictEqual(asset.transparentSafe,true);
  assert(asset.svg.startsWith('<svg'),`${asset.id} must contain static SVG`);
  assert(asset.svg.includes('viewBox="0 0 600 600"')||asset.svg.includes("viewBox='0 0 600 600'"),`${asset.id} must use shared canvas`);
  assert(!/<script|foreignObject|onload=/i.test(asset.svg),`${asset.id} contains unsupported active content`);
  assert(!/Math\.random|canvas|getContext|Path2D/.test(asset.svg),`${asset.id} must remain literal authored SVG`);
  digests.add(crypto.createHash('sha256').update(asset.svg).digest('hex'));
}
assert.strictEqual(digests.size,20,'all eye candidates need distinct authored source');
for(const family of pack.requiredFamilies)assert(families.has(family),`missing required family: ${family}`);
for(const expression of pack.requiredExpressions)assert(expressions.has(expression),`missing required expression: ${expression}`);

let approvedPairs=0;
for(const asset of pack.assets){
  const rules=pack.compatibility[asset.id];
  assert(rules,`missing compatibility for ${asset.id}`);
  const classified=manifest.compatibilityStates.flatMap(state=>rules[state]||[]);
  assert.strictEqual(classified.length,manifest.baseIds.length,`${asset.id} must classify every base exactly once`);
  assert.strictEqual(new Set(classified).size,manifest.baseIds.length,`${asset.id} has duplicate base classifications`);
  assert.deepStrictEqual([...classified].sort(),[...manifest.baseIds].sort(),`${asset.id} base classification coverage mismatch`);
  assert.ok(rules.approved.length>=6,`${asset.id} needs meaningful approved coverage`);
  assert.deepStrictEqual(asset.approvedBaseIds,rules.approved);
  assert.strictEqual(asset.rigidPlacementKeys.length,1,`${asset.id} must publish one rigid review placement`);
  approvedPairs+=rules.approved.length;
}

assert.strictEqual(Object.keys(pack.placements).length,20);
for(const [key,fixture] of Object.entries(pack.placements)){
  assert.strictEqual(fixture.id,key);
  assert.strictEqual(fixture.pairKey,key);
  assert.ok(manifest.baseIds.includes(fixture.baseId));
  assert.ok(ids.has(fixture.eyeId));
  assert.ok(pack.compatibility[fixture.eyeId].approved.includes(fixture.baseId),`${key} fixture base must be approved`);
  assert.deepStrictEqual(Object.keys(fixture.transform).sort(),['rotation','scale','x','y']);
  assert.ok(fixture.transform.scale>0);
  assert.strictEqual(fixture.flipSafe,true);
}

const mock={matrix:{},placementOverrides:{}};
for(const baseId of manifest.baseIds)mock.matrix[baseId]={eyes:{approved:[],acceptable:[],blocked:[]}};
integration.install(mock);
for(const baseId of manifest.baseIds){
  const family=mock.matrix[baseId].eyes;
  const classified=manifest.compatibilityStates.flatMap(state=>family[state].filter(id=>id.startsWith('eye-v10-')));
  assert.strictEqual(classified.length,20,`${baseId} must receive all V10 eye classifications`);
  assert.strictEqual(new Set(classified).size,20);
}
assert.strictEqual(mock.v10EyeCandidatePairKeys.length,20);
assert.strictEqual(Object.keys(mock.placementOverrides).filter(key=>key.includes('|eye-v10-')).length,20);
assert.strictEqual(integration.runtimeGeometry,false);
assert.deepStrictEqual(pack.reviewStates,['normal','flipped']);
assert(pack.reviewScales.includes('96px')&&pack.reviewScales.includes('48px'));
console.log(`V10 eye rollout validated: ${pack.assets.length} authored candidates, ${approvedPairs} approved base pairs, and ${Object.keys(pack.placements).length} rigid review fixtures.`);
