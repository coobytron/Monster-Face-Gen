#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const pack = require('../assets/v10-patterns');
const manifest = require('../assets/v10-pattern-manifest.json');

const args = new Set(process.argv.slice(2));
const write = args.has('--write');
const validateOnly = args.has('--validate-only');

function digest(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const assets = pack.assets.map(asset => ({
  id: asset.id,
  family: asset.family,
  blendMode: asset.blendMode,
  opacity: asset.opacity,
  zOrder: asset.zOrder,
  bounds: asset.bounds,
  supportedBaseCount: asset.supportedBaseIds.length,
  thumbnailSafe: asset.thumbnailSafe,
  transparentSafe: asset.transparentSafe,
  svgSha256: digest(asset.svg)
}));

const report = {
  schemaVersion: 1,
  issue: 44,
  revision: pack.revision,
  status: 'pass',
  runtimeGeometry: pack.runtimeGeometry,
  humanApprovalRequired: pack.humanApprovalRequired,
  baseline: pack.baselineCount,
  added: assets.length,
  target: pack.targetCount,
  totalAfterPack: pack.baselineCount + assets.length,
  deterministicAssetOrder: assets.map(asset => asset.id),
  sourceOfTruth: manifest.sourceOfTruth,
  reviewMatrix: manifest.review,
  checks: {
    stableIds: new Set(assets.map(asset => asset.id)).size === assets.length,
    quotaReached: pack.baselineCount + assets.length >= pack.targetCount,
    allTransparentSafe: assets.every(asset => asset.transparentSafe),
    allThumbnailSafe: assets.every(asset => asset.thumbnailSafe),
    allBasesCovered: assets.every(asset => asset.supportedBaseCount === manifest.baseIds.length),
    distinctSourceDigests: new Set(assets.map(asset => asset.svgSha256)).size === assets.length
  },
  assets
};

if (Object.values(report.checks).some(value => value !== true)) {
  report.status = 'fail';
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

function makeBoard() {
  const cards = pack.assets.map(asset => `<article><div class="art">${asset.svg}</div><strong>${asset.id}</strong><span>${asset.family} · ${asset.blendMode} · ${asset.opacity}</span></article>`).join('\n');
  return `<!doctype html><meta charset="utf-8"><title>V10 Pattern Contact Sheet</title><style>body{margin:0;padding:24px;background:#ead9b7;color:#171512;font:12px system-ui}h1{margin:0 0 18px;font-size:22px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}article{background:#f4ead5;border:1px solid #171512;padding:10px}.art{aspect-ratio:1;background:#efe2c8;overflow:hidden}.art svg{width:100%;height:100%;display:block}strong,span{display:block;margin-top:6px}span{opacity:.7}</style><h1>V10 authored pattern candidates · Issue #44</h1><div class="grid">${cards}</div>`;
}

if (write) {
  const outDir = path.resolve(__dirname, '../generated/qa');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'v10-pattern-validation.json'), JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'v10-pattern-contact-sheet.html'), makeBoard());
}

if (!validateOnly || write) {
  console.log(`V10 pattern QA ${report.status}: ${assets.length} authored overlays; total pattern count ${report.totalAfterPack}.`);
}
