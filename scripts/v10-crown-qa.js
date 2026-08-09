'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pack = require('../assets/v10-crowns');
const compatibility = require('../assets/v10-crown-compatibility');
const placements = require('../assets/v10-crown-placements');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'generated', 'qa', 'v10-crowns');
const args = new Set(process.argv.slice(2));
const shouldWrite = args.has('--write');
const validateOnly = args.has('--validate-only');

const backgrounds = [
  { id: 'cream', fill: '#ead9b7', ink: '#171512', mount: '#c9b987' },
  { id: 'white', fill: '#f7f5ef', ink: '#171512', mount: '#d7d3c7' },
  { id: 'black', fill: '#151412', ink: '#f4ead7', mount: '#4e4a43' },
  { id: 'transparent', fill: 'url(#checker)', ink: '#171512', mount: '#c9c7bd' }
];

function innerSvg(svg) {
  return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
}
function escapeText(value) {
  return String(value).replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
}
function sourceDigest() {
  const files = [
    'assets/v10-crown-assets-01.js',
    'assets/v10-crown-assets-02.js',
    'assets/v10-crown-assets-03.js',
    'assets/v10-crowns.js',
    'assets/v10-crown-compatibility.js',
    'assets/v10-crown-placements.js',
    'assets/v10-crown-integration.js'
  ];
  const hash = crypto.createHash('sha256');
  for (const file of files) hash.update(file).update('\0').update(fs.readFileSync(path.join(ROOT, file)));
  return hash.digest('hex');
}
function validate() {
  const errors = [];
  const ids = pack.assets.map(item => item.id);
  if (ids.length !== 18 || new Set(ids).size !== 18) errors.push('Expected 18 unique crown IDs.');
  for (const asset of pack.assets) {
    if (!asset.svg.includes('viewBox="0 0 600 600"')) errors.push(`${asset.id}: invalid viewBox`);
    if (/<(?:script|foreignObject)\b|on[a-z]+\s*=|javascript:/i.test(asset.svg)) errors.push(`${asset.id}: active SVG content`);
    if (asset.runtimeGeometry !== false || asset.authored !== true) errors.push(`${asset.id}: authored/runtime contract`);
    const rules = compatibility[asset.id];
    if (!rules) { errors.push(`${asset.id}: missing compatibility`); continue; }
    const all = ['approved','acceptable','blocked'].flatMap(state => rules[state] || []);
    if (all.length !== 18 || new Set(all).size !== 18) errors.push(`${asset.id}: incomplete compatibility`);
    const key = `${asset.reviewBaseId}|${asset.id}`;
    const fixture = placements[key];
    if (!fixture) errors.push(`${asset.id}: missing exact root fixture`);
    else if (fixture.rootPlate.contentAudit.standaloneAnatomy !== false) errors.push(`${asset.id}: invalid root content audit`);
  }
  return errors;
}
function renderCell(asset, bg, index) {
  const key = `${asset.reviewBaseId}|${asset.id}`;
  const fixture = placements[key];
  const crown = innerSvg(asset.svg);
  const plate = innerSvg(fixture.rootPlate.svg);
  const x = (index % 3) * 600;
  const y = Math.floor(index / 3) * 360;
  const normalTransform = `translate(${x + 40} ${y + 74}) scale(.43)`;
  const flippedTransform = `translate(${x + 560} ${y + 74}) scale(-.43 .43)`;
  return `<g>
    <rect x="${x + 8}" y="${y + 8}" width="584" height="344" rx="24" fill="${bg.id === 'black' ? '#26231f' : '#f4ead7'}" fill-opacity="${bg.id === 'transparent' ? '.74' : '1'}" stroke="${bg.ink}" stroke-width="3"/>
    <text x="${x + 28}" y="${y + 36}" fill="${bg.ink}" font-family="Arial,sans-serif" font-size="18" font-weight="700">${escapeText(asset.name)}</text>
    <text x="${x + 28}" y="${y + 58}" fill="${bg.ink}" font-family="monospace" font-size="11">${escapeText(asset.id)} · ${escapeText(asset.reviewBaseId)}</text>
    <g transform="${normalTransform}"><path d="M112 292Q128 207 205 184Q300 152 395 184Q472 207 488 292L470 430Q300 493 130 430Z" fill="${bg.mount}" stroke="${bg.ink}" stroke-width="10"/>${crown}${plate}</g>
    <g transform="${flippedTransform}"><path d="M112 292Q128 207 205 184Q300 152 395 184Q472 207 488 292L470 430Q300 493 130 430Z" fill="${bg.mount}" stroke="${bg.ink}" stroke-width="10"/>${crown}${plate}</g>
    <text x="${x + 110}" y="${y + 326}" fill="${bg.ink}" font-family="Arial,sans-serif" font-size="12">normal</text>
    <text x="${x + 405}" y="${y + 326}" fill="${bg.ink}" font-family="Arial,sans-serif" font-size="12">flipped</text>
    <g transform="translate(${x + 250} ${y + 250}) scale(.16)"><path d="M112 292Q128 207 205 184Q300 152 395 184Q472 207 488 292L470 430Q300 493 130 430Z" fill="${bg.mount}" stroke="${bg.ink}" stroke-width="14"/>${crown}${plate}</g>
    <g transform="translate(${x + 350} ${y + 276}) scale(.08)"><path d="M112 292Q128 207 205 184Q300 152 395 184Q472 207 488 292L470 430Q300 493 130 430Z" fill="${bg.mount}" stroke="${bg.ink}" stroke-width="20"/>${crown}${plate}</g>
    <text x="${x + 258}" y="${y + 342}" fill="${bg.ink}" font-family="Arial,sans-serif" font-size="9">96 px</text>
    <text x="${x + 354}" y="${y + 342}" fill="${bg.ink}" font-family="Arial,sans-serif" font-size="9">48 px</text>
  </g>`;
}
function sheetSvg(bg) {
  const width = 1800;
  const height = 2160;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs><pattern id="checker" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#f2f0e9"/><path d="M0 0h16v16H0zM16 16h16v16H16z" fill="#d8d5cc"/></pattern></defs>
  <rect width="${width}" height="${height}" fill="${bg.fill}"/>
  ${pack.assets.map((asset,index) => renderCell(asset,bg,index)).join('\n')}
  </svg>`;
}
async function writeOutputs(report) {
  fs.mkdirSync(OUT, { recursive: true });
  const outputs = [];
  let sharp = null;
  try { sharp = require('sharp'); } catch (error) {
    console.warn('sharp is unavailable; writing SVG review sheets only.');
  }
  for (const bg of backgrounds) {
    const svg = sheetSvg(bg);
    const svgName = `integration-${bg.id}.svg`;
    fs.writeFileSync(path.join(OUT, svgName), svg);
    outputs.push(`generated/qa/v10-crowns/${svgName}`);
    if (sharp) {
      const pngName = `integration-${bg.id}.png`;
      await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, pngName));
      outputs.push(`generated/qa/v10-crowns/${pngName}`);
    }
  }
  report.review.outputs = outputs;
  fs.writeFileSync(path.join(OUT, 'validation-report.json'), JSON.stringify(report, null, 2) + '\n');
}
async function main() {
  const errors = validate();
  const approvedBasePairs = Object.values(compatibility).reduce((sum,item) => sum + item.approved.length, 0);
  const report = {
    version: 10,
    issue: 43,
    generatedAt: '1970-01-01T00:00:00.000Z',
    status: errors.length ? 'fail' : 'pass',
    sourceDigest: sourceDigest(),
    counts: {
      baseline: pack.baselineCount,
      candidates: pack.assets.length,
      total: pack.baselineCount + pack.assets.length,
      approvedBasePairs,
      exactRootFixtures: Object.keys(placements).length
    },
    review: {
      backgrounds: pack.reviewBackgrounds,
      states: pack.reviewStates,
      scales: pack.reviewScales,
      outputs: []
    },
    errors
  };
  if (shouldWrite) await writeOutputs(report);
  if (!shouldWrite && !validateOnly) console.log(JSON.stringify(report, null, 2));
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(`V10 crown QA passed: ${report.counts.candidates} candidates, ${approvedBasePairs} approved pairs, ${report.counts.exactRootFixtures} exact root fixtures.`);
}
main().catch(error => { console.error(error); process.exit(1); });
