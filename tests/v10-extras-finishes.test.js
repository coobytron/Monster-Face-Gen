'use strict';
const assert = require('assert');
const crypto = require('crypto');
const extras = require('../assets/v10-extras');
const finishes = require('../assets/v10-finishes');
const manifest = require('../assets/v10-extras-finishes-manifest.json');

const forbiddenSvg = /<(?:script|foreignObject)\b|on[a-z]+\s*=|javascript:/i;
assert.strictEqual(extras.issue, 45);
assert.strictEqual(finishes.issue, 45);
assert.strictEqual(extras.runtimeGeometry, false);
assert.strictEqual(finishes.runtimeGeometry, false);
assert.strictEqual(extras.humanApprovalRequired, true);
assert.strictEqual(finishes.humanApprovalRequired, true);
assert.strictEqual(extras.assets.length, 18);
assert.strictEqual(extras.baselineCount + extras.assets.length, 27);
assert.strictEqual(finishes.assets.length, 7);
assert.strictEqual(finishes.baselineCount + finishes.assets.length, 12);
assert.deepStrictEqual(extras.assets.map(x=>x.id), manifest.extras.assetIds);
assert.deepStrictEqual(finishes.assets.map(x=>x.id), manifest.finishes.assetIds);

const extraDigests = new Set();
const extraFamilies = new Set();
for (const asset of extras.assets) {
  assert.match(asset.id, /^extra-v10-[a-z0-9-]+$/);
  assert.strictEqual(asset.authored, true);
  assert.strictEqual(asset.runtimeGeometry, false);
  assert.strictEqual(asset.status, 'agent-candidate-pending-art-director');
  assert.strictEqual(asset.assetRevision, '10.7.0');
  assert.strictEqual(asset.kind, 'extra');
  assert.strictEqual(asset.blendMode, 'source-over');
  assert.strictEqual(asset.opacity, 1);
  assert.strictEqual(asset.zOrder, 80);
  assert.strictEqual(asset.thumbnailSafe, true);
  assert.strictEqual(asset.transparentSafe, true);
  assert.strictEqual(asset.flipSafe, true);
  assert.ok(asset.family && asset.attachmentZone);
  assert.deepStrictEqual([...asset.supportedBaseIds].sort(), [...manifest.baseIds].sort());
  assert.ok(Array.isArray(asset.bounds) && asset.bounds.length === 4 && asset.bounds.every(Number.isFinite));
  assert.match(asset.svg, /viewBox="0 0 600 600"/);
  assert.ok(!forbiddenSvg.test(asset.svg));
  assert.ok(!/Math\.random|canvas|getContext|Path2D/.test(asset.svg));
  extraDigests.add(crypto.createHash('sha256').update(asset.svg).digest('hex'));
  extraFamilies.add(asset.family);
}
assert.strictEqual(extraDigests.size, 18);
assert.ok(extraFamilies.size >= 16);

const finishDigests = new Set();
for (const asset of finishes.assets) {
  assert.match(asset.id, /^finish-v10-[a-z0-9-]+$/);
  assert.strictEqual(asset.authored, true);
  assert.strictEqual(asset.runtimeGeometry, false);
  assert.strictEqual(asset.status, 'agent-candidate-pending-art-director');
  assert.strictEqual(asset.assetRevision, '10.7.0');
  assert.strictEqual(asset.kind, 'finish');
  assert.strictEqual(asset.maskContract, 'alpha-mask-to-composed-art');
  assert.ok(finishes.allowedBlendModes.includes(asset.blendMode));
  assert.ok(asset.opacity > 0 && asset.opacity <= 0.5);
  assert.deepStrictEqual([...asset.supportedBackgrounds].sort(), [...manifest.backgrounds].sort());
  assert.strictEqual(asset.transparentSafe, true);
  assert.match(asset.svg, /viewBox="0 0 600 600"/);
  assert.ok(!forbiddenSvg.test(asset.svg));
  assert.ok(!/Math\.random|canvas|getContext|Path2D/.test(asset.svg));
  finishDigests.add(crypto.createHash('sha256').update(asset.svg).digest('hex'));
}
assert.strictEqual(finishDigests.size, 7);

console.log(`V10 extras/finishes validated: ${extras.assets.length} extras, ${finishes.assets.length} finishes; totals 27 / 12.`);
