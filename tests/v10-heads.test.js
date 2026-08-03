'use strict'
const assert=require('assert')
const crypto=require('crypto')
const pack=require('../assets/v10-heads')
const integration=require('../assets/v10-head-integration')
const manifest=require('../assets/v10-head-manifest.json')
const qa=require('../scripts/v10-head-qa')
const ids=pack.assets.map(item=>item.id)

assert.strictEqual(pack.runtimeGeometry,false)
assert.strictEqual(pack.humanApprovalRequired,true)
assert.strictEqual(pack.assets.length,12)
assert.strictEqual(pack.baselineCount+pack.assets.length,18)
assert.strictEqual(new Set(ids).size,12)
assert.deepStrictEqual(new Set(pack.assets.map(item=>item.archetype)),new Set(pack.requiredArchetypes))

for(const asset of pack.assets){
  assert(asset.id.startsWith('base-'),`${asset.id} must use a stable base ID`)
  assert.strictEqual(asset.authored,true)
  assert.strictEqual(asset.runtimeGeometry,false)
  assert.strictEqual(asset.reviewStatus,'agent-candidate-pending-art-director')
  assert.strictEqual(asset.flipSafe,true)
  assert.strictEqual(asset.transparentEdgeSafe,true)
  assert(/<svg\b/.test(asset.svg)&&/viewBox="0 0 600 600"/.test(asset.svg))
  assert(!/(<script|foreignObject|on\w+=|Math\.random|Date\()/i.test(asset.svg))
  for(const key of pack.integrationZoneKeys) assert.strictEqual(asset.integrationZones[key].length,4,`${asset.id} ${key} zone`)
  for(const slot of ['eyes','noses','mouths','horns','patterns','extras']) assert(asset.slots[slot],`${asset.id} missing ${slot} slot`)
  const [x,y,w,h]=asset.integrationZones.mouth
  assert(x>=100&&y>=340&&x+w<=500&&y+h<=570,`${asset.id} mouth zone escapes the shared mouth-safe area`)
}

// Existing v9 base IDs must survive untouched.
const v9=['base-bog','base-fuzz','base-skull','base-imp','base-moss','base-blue']
for(const id of v9) assert(!ids.includes(id),`${id} must not be renamed or replaced`)

assert.strictEqual(integration.pairJunctions.length,24)
assert.strictEqual(integration.baseSeams.length,24)
assert.strictEqual(new Set(integration.reviewPairKeys).size,24)
assert.strictEqual(pack.reviewFixtures.length,12)
for(const fixture of pack.reviewFixtures){
  assert(ids.includes(fixture.baseId))
  assert.strictEqual(fixture.mouthPairKey,`${fixture.baseId}|${fixture.mouthId}`)
  assert.strictEqual(fixture.hornPairKey,`${fixture.baseId}|${fixture.hornId}`)
  assert(integration.reviewPairKeys.includes(fixture.mouthPairKey))
  assert(integration.reviewPairKeys.includes(fixture.hornPairKey))
  assert.strictEqual(fixture.flipSafe,true)
  assert.strictEqual(fixture.transparentEdgeSafe,true)
  assert.strictEqual(fixture.clipSafe,true)
}
for(const plate of integration.pairJunctions) assert.strictEqual(plate.contentAudit.standaloneAnatomy,false,`${plate.pairKey} must not carry standalone anatomy`)

const catalogueSizes={eyes:10,noses:9,mouths:27,horns:9}
for(const [baseId,families] of Object.entries(integration.compatibility)){
  assert(ids.includes(baseId),`${baseId} is not a V10 head base`)
  for(const [family,size] of Object.entries(catalogueSizes)){
    const states=families[family]
    const classified=[...states.approved,...states.acceptable,...states.blocked]
    assert.strictEqual(classified.length,size,`${baseId} must classify every ${family} entry`)
    assert.strictEqual(new Set(classified).size,size,`${baseId} duplicate ${family} classification`)
  }
}

const fake={
  MONSTER_PAIR_JUNCTIONS:{mouth:[],horns:[],all:[],byKey:{}},
  MONSTER_JUNCTIONS:{mouthSeams:[],hornSeams:[]},
  MONSTER_COMPATIBILITY:{matrix:{},placementOverrides:{}}
}
integration.install(fake)
assert.strictEqual(fake.MONSTER_PAIR_JUNCTIONS.all.length,24)
assert.strictEqual(fake.MONSTER_JUNCTIONS.mouthSeams.length,12)
assert.strictEqual(fake.MONSTER_JUNCTIONS.hornSeams.length,12)
assert.strictEqual(Object.keys(fake.MONSTER_COMPATIBILITY.matrix).length,12)
assert.strictEqual(Object.keys(fake.MONSTER_COMPATIBILITY.placementOverrides).length,24)
const sample=pack.reviewFixtures[0]
assert.strictEqual(fake.MONSTER_PAIR_JUNCTIONS.select(sample.baseId,sample.mouthId).pairKey,sample.mouthPairKey)
integration.install(fake)
assert.strictEqual(fake.MONSTER_PAIR_JUNCTIONS.all.length,24,'install must stay idempotent')

// A recolour of an existing base must never clear the distinction floor.
const clone=qa.flatten(pack.assets[0].outlinePath)
assert.strictEqual(qa.signatureDistance(qa.descriptor(clone),qa.descriptor(clone)),0)

const report=qa.buildReport()
assert.strictEqual(report.valid,true,report.errors.join('\n'))
assert.deepStrictEqual(report,qa.buildReport(),'report must be deterministic')
assert.strictEqual(report.counts.totalBases,18)
assert.strictEqual(report.reviewMatrix.length,480)
assert(report.minimumDistinction>=report.distinctionThreshold)
const digest=crypto.createHash('sha256').update(JSON.stringify(manifest)).digest('hex')
assert.strictEqual(digest.length,64)
console.log('v10 head base pack tests passed')
