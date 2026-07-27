#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const sharp=require('sharp');
const {ROOT,loadRegistry,validateRegistry,renderBundleSvg,esc}=require('./hybrid-bundle-contract');
const OUT=path.join(ROOT,'generated','qa');
const VALIDATE_ONLY=process.argv.includes('--validate-only');
const BACKGROUNDS={cream:'#f2ead8',white:'#ffffff',black:'#111111',transparent:null};
function stripSvg(svg){const match=String(svg||'').match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/i);return match?match[1]:'';}
function loadLegacyBase(){const context={window:{MONSTER_PARTS:{}},console};context.window.window=context.window;vm.createContext(context);const file=path.join(ROOT,'assets/parts/bases.js');vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:'assets/parts/bases.js'});return(context.window.MONSTER_PARTS.bases||[]).find(item=>item.id==='base-bog');}
function contactSheet(bundle,legacy,background){
  const text=background==='#111111'?'#fff':'#171512';const bg=background?`<rect width="100%" height="100%" fill="${background}"/>`:'<defs><pattern id="checker" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#fff"/><rect width="12" height="12" fill="#ddd"/><rect x="12" y="12" width="12" height="12" fill="#ddd"/></pattern></defs><rect width="100%" height="100%" fill="url(#checker)"/>';
  const hybrid=stripSvg(renderBundleSvg(bundle)),old=stripSvg(legacy.svg);
  return`<svg xmlns="http://www.w3.org/2000/svg" width="1320" height="780" viewBox="0 0 1320 780">${bg}<text x="40" y="52" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="700">Hybrid authored bundle fixture</text><text x="40" y="82" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="15" opacity=".72">Stable parent: ${esc(bundle.parentAssetId)} · bundle: ${esc(bundle.id)} · revision: ${esc(bundle.revision)}</text><g transform="translate(30 110)"><rect width="610" height="640" rx="14" fill="none" stroke="${text}" stroke-opacity=".24"/><g transform="translate(5 5)">${old}</g><text x="24" y="618" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700">Legacy single SVG · base-bog</text></g><g transform="translate(680 110)"><rect width="610" height="640" rx="14" fill="none" stroke="${text}" stroke-opacity=".24"/><g transform="translate(5 5)">${hybrid}</g><text x="24" y="618" fill="${text}" font-family="Arial,Helvetica,sans-serif" font-size="17" font-weight="700">Hybrid bundle · deterministic authored layers</text></g></svg>`;
}
async function main(){
  const registry=loadRegistry(),report=await validateRegistry(registry);fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(path.join(OUT,'hybrid-bundle-validation-report.json'),JSON.stringify(report,null,2)+'\n');fs.copyFileSync(path.join(ROOT,'schemas/hybrid-bundle-validation-report.schema.json'),path.join(OUT,'hybrid-bundle-validation-report.schema.json'));
  if(!VALIDATE_ONLY&&report.summary.passed){const bundle=registry.bundles[0],legacy=loadLegacyBase();for(const [name,bg] of Object.entries(BACKGROUNDS)){const svg=contactSheet(bundle,legacy,bg);fs.writeFileSync(path.join(OUT,`hybrid-bundle-fixture-${name}.svg`),svg);await sharp(Buffer.from(svg)).png().toFile(path.join(OUT,`hybrid-bundle-fixture-${name}.png`));}await sharp(Buffer.from(renderBundleSvg(bundle))).resize(3600,3600,{fit:'fill'}).png().toFile(path.join(OUT,'hybrid-bundle-fixture-export-3600.png'));}
  console.log(JSON.stringify(report.summary));if(!report.summary.passed)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1;});
