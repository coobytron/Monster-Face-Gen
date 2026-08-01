'use strict'

const assert = require('assert')
const { buildReport, validate } = require('../scripts/v10-expansion-contract')

const first = buildReport()
const second = buildReport()

assert.strictEqual(first.valid, true, first.errors.join('\n'))
assert.deepStrictEqual(first, second, 'report must be deterministic')
assert.strictEqual(first.targets.bases, 18)
assert.strictEqual(first.targets.mouths, 27)
assert.strictEqual(first.targets.recipes, 48)

const invalid = {
  baseline: { bases: 6 },
  targets: { bases: 5 },
  runtimeGeometry: true,
  humanApprovalRequired: false,
  requiredCharacterArchetypes: ['blob', 'blob'],
  requiredMouthFamilies: [],
  requiredEffectFamilies: [],
  reviewScales: [],
  reviewBackgrounds: []
}

assert(validate(invalid).length >= 8, 'known failures must be rejected')
console.log('v10 expansion contract tests passed')
