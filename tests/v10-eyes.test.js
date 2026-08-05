const assert=require('assert');
const pack=require('../assets/v10-eyes');

assert.strictEqual(pack.issue,41);
assert.strictEqual(pack.runtimeGeometry,false);
assert.strictEqual(pack.humanApprovalRequired,true);
assert.strictEqual(pack.assets.length,20,'expected 20 V10 eye candidates');
assert.strictEqual(pack.baselineCount+pack.assets.length,pack.targetCount,'eye quota must reach 30');

const ids=new Set();
const families=new Set();
const expressions=new Set();
for(const asset of pack.assets){
  assert(/^eye-v10-[a-z0-9-]+$/.test(asset.id),`invalid stable ID: ${asset.id}`);
  assert(!ids.has(asset.id),`duplicate stable ID: ${asset.id}`);
  ids.add(asset.id);
  families.add(asset.family);
  expressions.add(asset.expression);
  assert.strictEqual(asset.authored,true,`${asset.id} must be authored`);
  assert.strictEqual(asset.runtimeGeometry,false,`${asset.id} cannot use runtime geometry`);
  assert.strictEqual(asset.status,'agent-candidate-pending-art-director');
  assert(asset.svg.startsWith('<svg'),`${asset.id} must contain static SVG`);
  assert(asset.svg.includes("viewBox=\"0 0 600 600\"")||asset.svg.includes("viewBox='0 0 600 600'"),`${asset.id} must use shared canvas`);
  assert(!/<script|foreignObject|onload=/i.test(asset.svg),`${asset.id} contains unsupported active content`);
}
for(const family of pack.requiredFamilies)assert(families.has(family),`missing required family: ${family}`);
for(const expression of pack.requiredExpressions)assert(expressions.has(expression),`missing required expression: ${expression}`);
assert.deepStrictEqual(pack.reviewStates,['normal','flipped']);
assert(pack.reviewScales.includes('96px')&&pack.reviewScales.includes('48px'));
console.log('V10 eye pack validation passed: 20 authored candidates, stable IDs, family/expression coverage, and no runtime geometry.');
