#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,BACKGROUNDS,loadBrowserData,readManifest,validate,recipeCells,sheetSvg
} = require('./pair-junction-contract');

const OUT = path.join(ROOT,'generated','qa');
const VALIDATE_ONLY = process.argv.includes('--validate-only');

async function writeSheet(name,svg){
  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,`${name}.svg`),svg);
  const sharp=require('sharp');
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT,`${name}.png`));
}

async function main(){
  const data=loadBrowserData();
  const manifest=readManifest();
  const report=validate(data,manifest);
  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,'pair-junction-validation-report.json'),JSON.stringify(report,null,2)+'\n');
  fs.copyFileSync(path.join(ROOT,'schemas','pair-junction-validation-report.schema.json'),path.join(OUT,'pair-junction-validation-report.schema.json'));

  if(!VALIDATE_ONLY){
    for(const [backgroundName,background] of Object.entries(BACKGROUNDS)){
      await writeSheet(`pair-junction-mouth-crops-${backgroundName}`,sheetSvg({
        title:'Reviewed Recipe Mouth Junctions — Generic / Exact',
        subtitle:`All 16 curated recipes · 100%, 25%, 192 px, 96 px, 48 px, and flipped · background:${backgroundName}`,
        cells:recipeCells(data,'mouth'),background
      }));
      await writeSheet(`pair-junction-horn-crops-${backgroundName}`,sheetSvg({
        title:'Reviewed Recipe Horn / Ear Junctions — Generic / Exact',
        subtitle:`All 16 curated recipes · root overlap, fold, 25%, 192 px, 96 px, 48 px, and flipped · background:${backgroundName}`,
        cells:recipeCells(data,'horn'),background
      }));
    }
  }

  console.log(JSON.stringify(report.summary));
  if(!report.summary.passed) process.exitCode=1;
}

main().catch(error=>{console.error(error);process.exitCode=1;});
