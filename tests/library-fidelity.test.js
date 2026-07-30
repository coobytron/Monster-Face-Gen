'use strict';

const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const {ROOT,loadReview,loadHeroReview,NON_HERO_IDS,validate}=require('../scripts/library-fidelity-contract');
const {loadBrowserData,readManifest}=require('../scripts/pair-junction-contract');

const data=loadBrowserData();
const manifest=readManifest();
const review=loadReview();
const heroReview=loadHeroReview();
const report=validate(data,manifest,review,heroReview);

assert.equal(report.summary.passed,true,JSON.stringify(report.errors,null,2));
assert.equal(report.counts.heroReviews,3);
assert.equal(report.counts.libraryReviews,13);
assert.equal(report.counts.totalReviewedRecipes,16);
assert.equal(report.counts.libraryAuthoredReplacements,34);
assert.equal(report.counts.exactPairJunctions,32);
assert.deepEqual(review.reviewedRecipeIds,NON_HERO_IDS);
assert.ok(review.reviews.every(entry=>entry.humanConfirmed===false));
assert.ok(heroReview.reviews.every(entry=>entry.humanConfirmed===false));
assert.ok(report.warnings.length>=16);

for(const filename of ['scripts/library-fidelity-contract.js','scripts/library-fidelity-qa.js','scripts/update-library-rollout-manifest.js','scripts/update-library-rollout-docs.js']){
  new vm.Script(fs.readFileSync(path.join(ROOT,filename),'utf8'),{filename});
}

console.log('library fidelity rollout tests passed');
