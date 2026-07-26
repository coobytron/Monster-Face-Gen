'use strict';

const Module = require('module');
const originalLoad = Module._load;

function sanitizeSvgXml(source) {
  let normalizedTags = 0;
  const output = source.replace(/<([A-Za-z][\w:.-]*)(\s[^<>]*?)?>/g, (full, tagName, rawAttributes = '') => {
    const attributes = [];
    const attributePattern = /\s+([^\s=/>]+)\s*=\s*("[^"]*"|'[^']*')/g;
    let match;
    while ((match = attributePattern.exec(rawAttributes))) {
      attributes.push({ name: match[1], value: match[2] });
    }
    if (!attributes.length) return full;

    const lastByName = new Map();
    for (const attribute of attributes) lastByName.set(attribute.name, attribute);
    if (lastByName.size === attributes.length) return full;

    normalizedTags += 1;
    const selfClosing = /\/\s*>$/.test(full);
    const rebuilt = [...lastByName.values()].map(attribute => ` ${attribute.name}=${attribute.value}`).join('');
    return `<${tagName}${rebuilt}${selfClosing ? '/' : ''}>`;
  });

  if (normalizedTags > 0) {
    process.stderr.write(`[qa] normalized duplicate XML attributes in ${normalizedTags} SVG tag(s) for strict PNG rasterization\n`);
  }
  return output;
}

Module._load = function patchedLoad(request, parent, isMain) {
  const loaded = originalLoad.apply(this, arguments);
  if (request !== 'sharp') return loaded;

  function sanitizedSharp(input, options) {
    if (Buffer.isBuffer(input)) {
      input = Buffer.from(sanitizeSvgXml(input.toString('utf8')), 'utf8');
    } else if (typeof input === 'string' && input.trimStart().startsWith('<svg')) {
      input = sanitizeSvgXml(input);
    }
    return loaded(input, options);
  }

  Object.assign(sanitizedSharp, loaded);
  return sanitizedSharp;
};

module.exports = { sanitizeSvgXml };
