'use strict'
const assert=require('assert')
const crypto=require('crypto')
const pack=require('../assets/v10-mouths')
const integration=require('../assets/v10-mouth-integration')
const manifest=require('../assets/v10-mouth-manifest.json')
const ids=pack.assets.map(item=>item.id)
assert.strictEqual(pack.runtimeGeometry,false)
assert.strictEqual(pack.humanApprovalRequired,true)
assert.strictEqual(pack.assets.length,18)
assert.strictEqual(pack.baselineCount+pack.assets.length,27)
assert.strictEqual(new Set(ids).size,18)
assert.deepStrictEqual(new Set(pack.assets.map(item=>item.mouthFamily)),new Set(pack.requiredFamilies))
for(const asset of pack.assets){
  assert(asset.id.startsWith('mouth-'))
  assert.strictEqual(asset.authored,true)
  assert.strictEqual(asset.runtimeGeometry,false)
  assert.strictEqual(asset.reviewStatus,'agent-candidate-pending-art-director')
  assert(/<svg\b/.test(asset.svg)&&/viewBox="0 0 600 600"/.test(asset.svg))
  assert(!/(<script|foreignObject|on\w+=|Math\.random|Date\()/i.test(asset.svg))
  const [x,y,w,h]=asset.mouthBounds
  assert(x>=100&&y>=340&&x+w<=500&&y+h<=570,`${asset.id} bounds escape mouth-safe area`)
}
assert.strictEqual(integration.mouthJunctions.length,18)
assert.strictEqual(new Set(integration.reviewPairKeys).size,18)
for(const fixture of pack.reviewFixtures){
  assert(ids.includes(fixture.mouthId))
  assert.strictEqual(fixture.pairKey,`${fixture.baseId}|${fixture.mouthId}`)
  assert(integration.reviewPairKeys.includes(fixture.pairKey))
  assert.strictEqual(fixture.flipSafe,true)
  assert.strictEqual(fixture.transparentEdgeSafe,true)
}
const allIds=new Set(ids)
for(const [baseId,states] of Object.entries(integration.compatibility)){
  const classified=[...states.approved,...states.acceptable,...states.blocked]
  assert.strictEqual(classified.length,18,`${baseId} must classify every V10 mouth`)
  assert.strictEqual(new Set(classified).size,18,`${baseId} duplicate compatibility classification`)
  assert.deepStrictEqual(new Set(classified),allIds)
}
const fake={MONSTER_PAIR_JUNCTIONS:{mouth:[],all:[],byKey:{}},MONSTER_COMPATIBILITY:{matrix:{},placementOverrides:{}}}
for(const baseId of Object.keys(integration.compatibility)) fake.MONSTER_COMPATIBILITY.matrix[baseId]={mouths:{approved:[],acceptable:[],blocked:[]}}
integration.install(fake)
assert.strictEqual(fake.MONSTER_PAIR_JUNCTIONS.mouth.length,18)
assert.strictEqual(fake.MONSTER_PAIR_JUNCTIONS.select(pack.reviewFixtures[0].baseId,pack.reviewFixtures[0].mouthId).pairKey,pack.reviewFixtures[0].pairKey)
assert.strictEqual(Object.keys(fake.MONSTER_COMPATIBILITY.placementOverrides).length,18)
const digest=crypto.createHash('sha256').update(JSON.stringify(manifest)).digest('hex')
assert.strictEqual(digest.length,64)
console.log('v10 mouth pack tests passed')
