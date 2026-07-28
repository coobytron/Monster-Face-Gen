#!/usr/bin/env node
'use strict';

const fs=require('fs');
const path=require('path');
const {ROOT,loadReview,loadHeroReview,validate,reviewSummarySvg}=require('./library-fidelity-contract');
const {loadBrowserData,readManifest}=require('./pair-junction-contract');

const OUT=path.join(ROOT,'generated','qa');
const VALIDATE_ONLY=process.argv.includes('--validate-only');

async function main(){
  const data=loadBrowserData(),manifest=readManifest(),review=loadReview(),heroReview=loadHeroReview();
  const report=validate(data,manifest,review,heroReview);
  fs.mkdirSync(OUT,{recursive:true});
  fs.writeFileSync(path.join(OUT,'library-fidelity-validation-report.json'),JSON.stringify(report,null,2)+'\n');
  fs.copyFileSync(path.join(ROOT,'schemas','library-fidelity-validation-report.schema.json'),path.join(OUT,'library-fidelity-validation-report.schema.json'));
  if(!VALIDATE_ONLY){
    const svg=reviewSummarySvg(data,review);
    fs.writeFileSync(path.join(OUT,'library-fidelity-rollout-summary.svg'),svg);
    const sharp=require('sharp');
    await sharp(Buffer.from(svg)).png().toFile(path.join(OUT,'library-fidelity-rollout-summary.png'));
  }
  console.log(JSON.stringify(report.summary));
  if(!report.summary.passed) process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1;});
