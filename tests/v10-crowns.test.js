'use strict';

const assert = require('assert');
const crypto = require('crypto');
const pack = require('../assets/v10-crowns');
const compatibility = require('../assets/v10-crown-compatibility');
const placements = require('../assets/v10-crown-placements');
const integration = require('../assets/v10-crown-integration');
const manifest = require('../assets/v10-crown-manifest.json');

const BASE_IDS = manifest.baseIds;
const STATES = manifest.compatibilityStates;
const forbiddenSvg = /<(?:script|foreignObject)\b|on[a-z]+\s*=|javascript:/i;

assert.strictEqual(pack.issue, 43);
assert.strictEqual(pack.runtimeGeometry, false);
assert.strictEqual(pack.humanApprovalRequired, true);
assert.strictEqual(pack.assets.length, 18, 'Expected 18 new crown assets.');
assert.strictEqual(pack.baselineCount + pack.assets.length, 27, 'Crown target must reach 27.');
assert.strictEqual(manifest.added, 18);
assert.strictEqual(manifest.target, 27);

const ids = pack.assets.map(asset => asset.id);
assert.strictEqual(new Set(ids).size, ids.length, 'Crown IDs must be unique.');
assert.deepStrictEqual(ids, manifest.assetIds, 'Pack and manifest asset order must match.');

const svgDigests = new Set();
const rootProfiles = new Set();
const families = new Set();
const kinds = new Set();

for (const asset of pack.assets) {
  assert.match(asset.id, /^horn-v10-[a-z0-9-]+$/);
  assert.strictEqual(asset.authored, true);
  assert.strictEqual(asset.runtimeGeometry, false);
  assert.strictEqual(asset.status, 'agent-candidate-pending-art-director');
  assert.strictEqual(asset.flipSafe, true);
  assert.strictEqual(asset.mirrorWithComposition, true);
  assert.strictEqual(asset.assetRevision, '10.5.0');
  assert.ok(['horns', 'ears', 'mixed'].includes(asset.kind));
  assert.ok(asset.rootProfile);
  assert.ok(asset.family);
  assert.ok(BASE_IDS.includes(asset.reviewBaseId));
  assert.ok(Number.isFinite(asset.anchor.x) && Number.isFinite(asset.anchor.y));
  assert.ok(Array.isArray(asset.bounds) && asset.bounds.length === 4);
  assert.ok(asset.bounds.every(Number.isFinite));
  assert.match(asset.svg, /viewBox="0 0 600 600"/);
  assert.ok(!forbiddenSvg.test(asset.svg), `${asset.id} contains forbidden active SVG.`);
  assert.ok(!/Math\.random|rough\.|canvas|getContext|Path2D/.test(asset.svg), `${asset.id} must be literal authored SVG.`);
  svgDigests.add(crypto.createHash('sha256').update(asset.svg).digest('hex'));
  rootProfiles.add(asset.rootProfile);
  families.add(asset.family);
  kinds.add(asset.kind);
}
assert.strictEqual(svgDigests.size, 18, 'Every candidate must have distinct authored geometry.');
assert.ok(rootProfiles.size >= 12, 'Crown pack needs broad root-profile diversity.');
assert.strictEqual(families.size, 18, 'Every requested crown direction should be represented.');
assert.deepStrictEqual([...kinds].sort(), ['ears', 'horns', 'mixed']);

assert.deepStrictEqual(Object.keys(compatibility), ids);
let approvedPairs = 0;
for (const asset of pack.assets) {
  const rules = compatibility[asset.id];
  assert.ok(rules, `Missing compatibility for ${asset.id}.`);
  const all = STATES.flatMap(state => rules[state] || []);
  assert.strictEqual(all.length, BASE_IDS.length, `${asset.id} must classify every base exactly once.`);
  assert.strictEqual(new Set(all).size, BASE_IDS.length, `${asset.id} has duplicate base classifications.`);
  assert.deepStrictEqual([...all].sort(), [...BASE_IDS].sort(), `${asset.id} classification coverage mismatch.`);
  assert.ok(rules.approved.length >= 5, `${asset.id} needs meaningful approved coverage.`);
  assert.ok(rules.approved.includes(asset.reviewBaseId), `${asset.id} review fixture must be approved.`);
  approvedPairs += rules.approved.length;
}
assert.ok(approvedPairs >= 90, 'Expected broad approved crown/base coverage.');

assert.strictEqual(Object.keys(placements).length, 18, 'Every crown needs one exact root integration fixture.');
for (const asset of pack.assets) {
  const key = `${asset.reviewBaseId}|${asset.id}`;
  const fixture = placements[key];
  assert.ok(fixture, `Missing exact root fixture ${key}.`);
  assert.strictEqual(fixture.id, key);
  assert.strictEqual(fixture.pairKey, key);
  assert.strictEqual(fixture.baseId, asset.reviewBaseId);
  assert.strictEqual(fixture.crownId, asset.id);
  assert.strictEqual(fixture.rootProfile, asset.rootProfile);
  assert.deepStrictEqual(Object.keys(fixture.transform).sort(), ['rotation', 'scale', 'x', 'y']);
  assert.ok(fixture.transform.scale > 0);
  assert.match(fixture.rootPlate.svg, /viewBox="0 0 600 600"/);
  assert.ok(!forbiddenSvg.test(fixture.rootPlate.svg));
  assert.strictEqual(fixture.rootPlate.flipSafe, true);
  assert.strictEqual(fixture.rootPlate.mirrorWithComposition, true);
  assert.strictEqual(fixture.rootPlate.contentAudit.standaloneAnatomy, false);
  assert.strictEqual(fixture.reviewStatus, 'agent-candidate-pending-art-director');
}

const mock = { matrix: {}, placementOverrides: {} };
for (const baseId of BASE_IDS) {
  mock.matrix[baseId] = {
    horns: { approved: ['horn-none'], acceptable: [], blocked: [] }
  };
}
integration.install(mock);
for (const baseId of BASE_IDS) {
  const family = mock.matrix[baseId].horns;
  const classified = STATES.flatMap(state => family[state].filter(id => id.startsWith('horn-v10-')));
  assert.strictEqual(classified.length, 18, `${baseId} must receive all 18 crown classifications.`);
  assert.strictEqual(new Set(classified).size, 18);
}
assert.strictEqual(mock.v10CrownCandidatePairKeys.length, 18);
assert.strictEqual(Object.keys(mock.placementOverrides).filter(key => key.includes('|horn-v10-')).length, 18);
assert.strictEqual(integration.runtimeGeometry, false);

console.log(`V10 crown pack validated: ${pack.assets.length} candidates, ${approvedPairs} approved base pairs, ${Object.keys(placements).length} exact root fixtures.`);
