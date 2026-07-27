'use strict';
const fs=require('fs');
const path=require('path');

const filename=path.resolve(__dirname,'hero-fidelity-qa.js');
let source=fs.readFileSync(filename,'utf8');
const anchor="function renderAsset(asset,transform='',token='asset'){if(!asset)return'';const body=namespaceBody(asset.svg,token);return transform?`<g transform=\"${transform}\">${body}</g>`:`<g>${body}</g>`;}\n";
const helper=[
  'function clipShape(asset){',
  "  const tags=[...String(asset?.svg||'').matchAll(/<path\\b[^>]*>/gi)].map(match=>match[0]).filter(tag=>! /fill=[\"']none[\"']/i.test(tag));",
  "  const ranked=tags.map(tag=>({tag,d:(tag.match(/\\bd=[\"']([^\"']+)[\"']/i)||[])[1]||''})).filter(item=>item.d.length>60).sort((a,b)=>b.d.length-a.d.length);",
  "  if(!ranked.length)return renderAsset(asset,'','clip-fallback');",
  "  let tag=ranked[0].tag.replace(/\\sfill=[\"'][^\"']*[\"']/i,' fill=\"#fff\"').replace(/\\sstroke=[\"'][^\"']*[\"']/gi,' stroke=\"none\"');",
  "  if(!/\\sfill=/i.test(tag))tag=tag.replace(/>$/,' fill=\"#fff\">');",
  "  return '<g>'+tag+'</g>';",
  '}',
  ''
].join('\n');
if(!source.includes('function clipShape(asset)')){
  if(!source.includes(anchor))throw new Error('Hero QA render anchor not found');
  source=source.replace(anchor,anchor+helper);
}
const oldClip='`<defs><clipPath id="${clipId}">${renderAsset(base,\'\',`${token}-clip`)}</clipPath></defs>`';
const newClip='`<defs><clipPath id="${clipId}">${clipShape(base)}</clipPath></defs>`';
if(source.includes(oldClip))source=source.replace(oldClip,newClip);
if(!source.includes(newClip))throw new Error('Hero QA clip replacement failed');
fs.writeFileSync(filename,source);
console.log('Hero QA uses authored silhouette geometry for mouth clipping.');
