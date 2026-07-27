'use strict';
const fs=require('fs');
const assert=require('assert');
const data=JSON.parse(fs.readFileSync('reviews/hero-fidelity-v9.json','utf8'));
const ids=['bog-cyclops-grin','fuzz-fanged','imp-roar'];
const categories=['silhouetteStrength','attachmentIntegration','expressionRead','detailDensity','thumbnailRead','mvpSimilarity'];
assert.strictEqual(data.schemaVersion,1);
assert.deepStrictEqual(data.scoreScale,[1,2,3,4,5]);
assert.deepStrictEqual(data.reviews.map(r=>r.recipeId),ids);
for(const review of data.reviews){
  assert(review.reviewer);
  assert.strictEqual(review.reviewedAt,'1970-01-01T00:00:00.000Z');
  assert.strictEqual(Object.keys(review.assetIds).length,8);
  assert.strictEqual(review.junctionIds.length,2);
  assert(review.notes.length>0);
  for(const category of categories){
    assert(Number.isInteger(review.baseline[category]));
    assert(Number.isInteger(review.current[category]));
    assert(review.current[category]>=review.baseline[category],`${review.recipeId}/${category} regressed`);
    assert(review.current[category]>=data.targets[category],`${review.recipeId}/${category} below target`);
  }
}
console.log('Structured hero review records: stable references, paired scores, thresholds, and regression checks passed.');
