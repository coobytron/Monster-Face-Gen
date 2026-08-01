#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const VERSION = '0.1.0';
const MAX_SEGMENTS = 512;

function finitePoint(p) {
  return p && Number.isFinite(p.x) && Number.isFinite(p.y);
}

function normal(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (!len) return null;
  return { x: -dy / len, y: dx / len };
}

function widthAt(width, t) {
  if (typeof width === 'number') return width;
  const start = Number(width.start);
  const end = Number(width.end);
  return start + (end - start) * t;
}

function polygonArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}

function segmentsIntersect(a, b, c, d) {
  const orient = (p, q, r) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
  const o1 = orient(a, b, c);
  const o2 = orient(a, b, d);
  const o3 = orient(c, d, a);
  const o4 = orient(c, d, b);
  return o1 !== o2 && o3 !== o4;
}

function hasSelfIntersection(points) {
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    for (let j = i + 2; j < points.length; j += 1) {
      if (i === 0 && j === points.length - 1) continue;
      const c = points[j];
      const d = points[(j + 1) % points.length];
      if (segmentsIntersect(a, b, c, d)) return true;
    }
  }
  return false;
}

function expandPolyline(points, width, approach = 'averaged-normal') {
  if (!Array.isArray(points) || points.length < 2) throw new Error('A centreline requires at least two points.');
  if (!points.every(finitePoint)) throw new Error('Centreline contains non-finite geometry.');
  if (points.length > MAX_SEGMENTS) throw new Error(`Centreline exceeds ${MAX_SEGMENTS} points.`);

  const left = [];
  const right = [];
  for (let i = 0; i < points.length; i += 1) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    let n;
    if (approach === 'segment-normal') {
      n = normal(points[i], next) || normal(prev, points[i]);
    } else {
      const n1 = normal(prev, points[i]);
      const n2 = normal(points[i], next);
      if (n1 && n2) {
        const len = Math.hypot(n1.x + n2.x, n1.y + n2.y) || 1;
        n = { x: (n1.x + n2.x) / len, y: (n1.y + n2.y) / len };
      } else n = n1 || n2;
    }
    if (!n) throw new Error('Collapsed segment prevents expansion.');
    const half = widthAt(width, i / (points.length - 1)) / 2;
    if (!Number.isFinite(half) || half <= 0) throw new Error('Width must remain positive and finite.');
    left.push({ x: points[i].x + n.x * half, y: points[i].y + n.y * half });
    right.push({ x: points[i].x - n.x * half, y: points[i].y - n.y * half });
  }
  return [...left, ...right.reverse()];
}

function validateOutline(points) {
  const errors = [];
  const warnings = [];
  if (!points.every(finitePoint)) errors.push('non-finite-geometry');
  if (points.length < 3) errors.push('open-or-collapsed-contour');
  if (points.length > MAX_SEGMENTS * 2) errors.push('excessive-segment-count');
  const area = polygonArea(points);
  if (!Number.isFinite(area) || Math.abs(area) < 0.001) errors.push('collapsed-outline');
  if (area > 0) warnings.push('inverted-winding-normalized');
  if (hasSelfIntersection(points)) errors.push('self-intersection');
  return { valid: errors.length === 0, errors, warnings, signedArea: area };
}

function normalizeWinding(points) {
  return polygonArea(points) > 0 ? [...points].reverse() : points;
}

function fmt(n) {
  return Number(n.toFixed(3));
}

function toPath(points) {
  const p = normalizeWinding(points);
  return `M ${fmt(p[0].x)} ${fmt(p[0].y)} ${p.slice(1).map((v) => `L ${fmt(v.x)} ${fmt(v.y)}`).join(' ')} Z`;
}

function svgDocument(item, outline, flipped = false) {
  const transform = flipped ? 'translate(600 0) scale(-1 1)' : '';
  const metadata = JSON.stringify({ sourceId: item.id, tool: 'stroke-lab', version: VERSION, approach: item.approach });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" data-source-id="${item.id}"><metadata>${metadata}</metadata><g transform="${transform}"><path d="${toPath(outline)}" fill="#111"/></g></svg>\n`;
}

function run(inputPath, outputDir) {
  const fixture = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  fs.mkdirSync(outputDir, { recursive: true });
  const report = { tool: 'stroke-lab', version: VERSION, generatedAt: '1970-01-01T00:00:00.000Z', items: [] };

  for (const item of fixture.items) {
    let outline;
    let validation;
    try {
      outline = expandPolyline(item.points, item.width, item.approach);
      validation = validateOutline(outline);
      if (validation.valid) {
        const svg = svgDocument(item, outline, false);
        const name = `${item.id}.svg`;
        fs.writeFileSync(path.join(outputDir, name), svg);
        if (item.flipReview) fs.writeFileSync(path.join(outputDir, `${item.id}-flipped.svg`), svgDocument(item, outline, true));
        validation.digest = crypto.createHash('sha256').update(svg).digest('hex');
      }
    } catch (error) {
      validation = { valid: false, errors: [error.message], warnings: [] };
    }
    report.items.push({ id: item.id, role: item.role, approach: item.approach, validation });
  }

  const reportText = `${JSON.stringify(report, null, 2)}\n`;
  fs.writeFileSync(path.join(outputDir, 'validation-report.json'), reportText);
  return report;
}

if (require.main === module) {
  const input = process.argv[2] || path.join(__dirname, 'fixtures.json');
  const output = process.argv[3] || path.join(__dirname, 'generated');
  const report = run(input, output);
  if (report.items.some((item) => !item.validation.valid)) process.exitCode = 1;
}

module.exports = { expandPolyline, validateOutline, toPath, run };
