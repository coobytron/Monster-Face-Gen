'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { expandPolyline, validateOutline, toPath, run } = require('../tools/stroke-lab/stroke-lab');

const line = [{ x: 10, y: 10 }, { x: 30, y: 20 }, { x: 50, y: 10 }];
const a = expandPolyline(line, 8, 'averaged-normal');
const b = expandPolyline(line, 8, 'averaged-normal');
assert.deepStrictEqual(a, b, 'identical inputs must produce identical outlines');
assert.strictEqual(validateOutline(a).valid, true);
assert.strictEqual(toPath(a), toPath(b));

assert.throws(() => expandPolyline([{ x: 0, y: 0 }, { x: 0, y: 0 }], 8), /Collapsed segment/);
assert.throws(() => expandPolyline([{ x: 0, y: 0 }, { x: Infinity, y: 1 }], 8), /non-finite/);
assert.throws(() => expandPolyline(line, { start: 8, end: -2 }), /positive/);

const out = fs.mkdtempSync(path.join(os.tmpdir(), 'stroke-lab-'));
const fixture = path.join(__dirname, '..', 'tools', 'stroke-lab', 'fixtures.json');
const first = run(fixture, out);
const firstReport = fs.readFileSync(path.join(out, 'validation-report.json'), 'utf8');
const second = run(fixture, out);
const secondReport = fs.readFileSync(path.join(out, 'validation-report.json'), 'utf8');
assert.deepStrictEqual(first, second);
assert.strictEqual(firstReport, secondReport);
assert(first.items.every((item) => item.validation.valid));

console.log('stroke-lab tests passed');
