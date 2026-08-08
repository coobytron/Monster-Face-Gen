'use strict';

const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const valueAfter = flag => {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1];
};
const base = valueAfter('--base');
const head = valueAfter('--head') || 'HEAD';

function run(commandArgs, label) {
  console.log(`::group::${label}`);
  const result = spawnSync(process.execPath, commandArgs, { stdio: 'inherit' });
  console.log('::endgroup::');
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function gitDiffFiles() {
  if (!base || /^0+$/.test(base)) return null;
  const result = spawnSync('git', ['diff', '--name-only', `${base}...${head}`], { encoding: 'utf8' });
  if (result.status !== 0) return null;
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

const noseSpecific = file =>
  /^assets\/v10-nose/.test(file) ||
  /^scripts\/(?:update-)?v10-nose/.test(file) ||
  /^tests\/v10-noses\.test\.js$/.test(file) ||
  /^schemas\/v10-nose/.test(file) ||
  /^generated\/qa\/v10-noses\//.test(file);

const crownSpecific = file =>
  /^assets\/v10-crown/.test(file) ||
  /^scripts\/(?:update-)?v10-crown/.test(file) ||
  /^tests\/v10-crowns\.test\.js$/.test(file) ||
  /^schemas\/v10-crown/.test(file) ||
  /^generated\/qa\/v10-crowns\//.test(file);

const sharedRollout = new Set([
  'README.md',
  'docs/ASSET-GUIDE.md',
  'assets/manifest.json',
  'index.html',
  'generated/qa/run.log',
  'generated/qa/validation-report.json',
  'package.json',
  'package-lock.json',
  '.github/workflows/contact-sheet-qa.yml',
  'scripts/run-qa-ci.js'
]);

const files = gitDiffFiles();
const noseOnly = files && files.length > 0 && files.some(noseSpecific) &&
  files.every(file => noseSpecific(file) || sharedRollout.has(file) || file === 'docs/V10-NOSE-SNOUT-PACK.md');
const crownOnly = files && files.length > 0 && files.some(crownSpecific) &&
  files.every(file => crownSpecific(file) || sharedRollout.has(file) || file === 'docs/V10-CROWN-PACK.md');

if (noseOnly) {
  console.log(`CI QA plan: V10 nose-only (${files.length} changed files).`);
  run(['-r', './scripts/sharp-svg-sanitize.js', 'scripts/v10-nose-qa.js', '--write'], 'Render V10 nose review sheets');
} else if (crownOnly) {
  console.log(`CI QA plan: V10 crown-only (${files.length} changed files).`);
  run(['-r', './scripts/sharp-svg-sanitize.js', 'scripts/v10-crown-qa.js', '--write'], 'Render V10 crown review sheets');
} else {
  console.log(files ? `CI QA plan: full (${files.length} changed files).` : 'CI QA plan: full (no reliable diff base).');
  const result = spawnSync('npm', ['run', 'qa:full'], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}
