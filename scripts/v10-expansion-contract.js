'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const root = path.resolve(__dirname, '..')
const contractPath = path.join(root, 'assets', 'v10-expansion-contract.json')

function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((out, key) => {
      out[key] = stable(value[key])
      return out
    }, {})
  }
  return value
}

function validate(contract) {
  const errors = []
  const requiredFamilies = ['bases','eyes','noses','mouths','hornsOrEars','patterns','extras','finishes','recipes']
  for (const family of requiredFamilies) {
    if (!Number.isInteger(contract.baseline?.[family]) || contract.baseline[family] < 0) errors.push(`invalid baseline.${family}`)
    if (!Number.isInteger(contract.targets?.[family]) || contract.targets[family] < contract.baseline[family]) errors.push(`invalid targets.${family}`)
  }
  if (contract.runtimeGeometry !== false) errors.push('runtimeGeometry must be false')
  if (contract.humanApprovalRequired !== true) errors.push('humanApprovalRequired must be true')
  for (const key of ['requiredCharacterArchetypes','requiredMouthFamilies','requiredEffectFamilies','reviewScales','reviewBackgrounds']) {
    const values = contract[key]
    if (!Array.isArray(values) || values.length === 0) errors.push(`${key} must be non-empty`)
    else if (new Set(values).size !== values.length) errors.push(`${key} contains duplicates`)
  }
  return errors
}

function buildReport() {
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  const canonical = JSON.stringify(stable(contract))
  const errors = validate(contract)
  return {
    schemaVersion: '1.0.0',
    generatedAt: '1970-01-01T00:00:00.000Z',
    contractVersion: contract.contractVersion,
    digest: crypto.createHash('sha256').update(canonical).digest('hex'),
    valid: errors.length === 0,
    errors,
    baseline: contract.baseline,
    targets: contract.targets
  }
}

if (require.main === module) {
  const report = buildReport()
  const output = JSON.stringify(stable(report), null, 2) + '\n'
  if (process.argv.includes('--write')) {
    const outDir = path.join(root, 'generated', 'qa')
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'v10-expansion-validation-report.json'), output)
  }
  process.stdout.write(output)
  if (!report.valid) process.exitCode = 1
}

module.exports = { buildReport, validate, stable }
