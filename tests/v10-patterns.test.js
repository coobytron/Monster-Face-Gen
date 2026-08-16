'use strict';

const assert = require('assert');
const crypto = require('crypto');
const pack = require('../assets/v10-patterns');
const manifest = require('../assets/v10-pattern-manifest.json');

const forbiddenSvg = /<(?:script|foreignObject)\b|on[a-z]+\s*=|javascript:/i;

assert.strictEqual(pack.issue, 44);
assert.strictEqual(pack.runtimeGeometry, false);
assert.strictEqual(pack.humanApprovalRequired, true);
assert.strictEqual(pack.assets.length, 18, 'Expected 18 new authored pattern assets.');
assert.strictEqual(pack.baselineCount + pack.assets.length, 27, 'Pattern target must reach 27.');
assert.strictEqual(manifest.added, 18);
assert.strictEqual(manifest.target, 27);

const ids = pack.assets.map(asset => asset.id);
assert.strictEqual(new Set(ids).size, ids.length, 'Pattern IDs must be unique.');
assert.deepStrictEqual(ids, manifest.assetIds, 'Pack and manifest asset order must match.');

const digests = new Set();
const families = new Set();
const blendModes = new Set();

for (const asset of pack.assets) {
  assert.match(asset.id, /^pattern-v10-[a-z0-9-]+$/);
  assert.strictEqual(asset.authored, true);
  assert.strictEqual(asset.runtimeGeometry, false);
  assert.strictEqual(asset.status, 'agent-candidate-pending-art-director');
  assert.strictEqual(asset.assetRevision, '10.6.0');
  assert.strictEqual(asset.kind, 'pattern');
  assert.strictEqual(asset.flipSafe, true);
  assert.strictEqual(asset.mirrorWithComposition, true);
  assert.ok(asset.family);
  assert.ok(Array.isArray(asset.supportedBaseIds));
  assert.deepStrictEqual([...asset.supportedBaseIds].sort(), [...manifest.baseIds].sort());
  assert.ok(manifest.allowedBlendModes.includes(asset.blendMode));
  assert.ok(asset.opacity > 0 && asset.opacity <= 0.6, `${asset.id} opacity should preserve face readability.`);
  assert.ok(Number.isInteger(asset.zOrder));
  assert.ok(Array.isArray(asset.bounds) && asset.bounds.length === 4 && asset.bounds.every(Number.isFinite));
  assert.strictEqual(asset.thumbnailSafe, true);
  assert.strictEqual(asset.transparentSafe, true);
  assert.match(asset.svg, /viewBox="0 0 600 600"/);
  assert.match(asset.svg, /clipPath/);
  assert.ok(!forbiddenSvg.test(asset.svg), `${asset.id} contains forbidden active SVG.`);
  assert.ok(!/Math\.random|rough\.|canvas|getContext|Path2D/.test(asset.svg), `${asset.id} must remain literal authored SVG.`);
  digests.add(crypto.createHash('sha256').update(asset.svg).digest('hex'));
  families.add(asset.family);
  blendModes.add(asset.blendMode);
}

assert.strictEqual(digests.size, 18, 'Every pattern candidate must have distinct authored geometry.');
assert.ok(families.size >= 14, 'Pattern pack needs broad surface-language diversity.');
assert.deepStrictEqual([...blendModes].sort(), ['multiply', 'source-over']);

const requiredDirections = ['stipple','scratches','scars','patches','stripes','freckles','wrinkles','ink-fills','registration','fur-marks','pores','scales','contour-hatching'];
for (const family of requiredDirections) assert.ok(families.has(family), `Missing required surface family ${family}.`);

console.log(`V10 pattern pack validated: ${pack.assets.length} candidates across ${families.size} surface families.`);
