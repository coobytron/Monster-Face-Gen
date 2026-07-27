#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ROOT,BACKGROUNDS,loadBrowserData,readManifest,validate,heroCells,sheetSvg
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
        title:'Hero Mouth Junctions — Before / After',
        subtitle:`Pair-specific cheek, corner, lower-lip, flip, 25%, 96 px, and 48 px review · background:${backgroundName}`,
        cells:heroCells(data,'mouth'),background
      }));
      await writeSheet(`pair-junction-horn-crops-${backgroundName}`,sheetSvg({
        title:'Hero Horn Junctions — Before / After',
        subtitle:`Pair-specific root overlap, fold, flip, 25%, 96 px, and 48 px review · background:${backgroundName}`,
        cells:heroCells(data,'horn'),background
      }));
    }
  }

  console.log(JSON.stringify(report.summary));
  if(!report.summary.passed) process.exitCode=1;
}

main().catch(error=>{console.error(error);process.exitCode=1;});
