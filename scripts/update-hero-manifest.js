'use strict';
const fs=require('fs');
const path=require('path');

const ROOT=path.resolve(__dirname,'..');
const manifestPath=path.join(ROOT,'assets','manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const heroFiles=['bases','eyes','noses','mouths','horns','patterns','extras'].map(name=>`assets/hero-v9/${name}.js`);
const validationFiles=['tests/hero-fidelity.test.js','scripts/hero-fidelity-qa.js','schemas/hero-fidelity-validation-report.schema.json'];
const appendUnique=(list,values)=>[...new Set([...(list||[]),...values])];

manifest.files=manifest.files||{};
manifest.files.heroFidelity=heroFiles;
manifest.files.validation=appendUnique(manifest.files.validation,validationFiles);
manifest.counts=manifest.counts||{};
manifest.counts.heroAuthoredReplacements=21;
manifest.hybridBundleContract=manifest.hybridBundleContract||{};
manifest.hybridBundleContract.currentBundleId='base-bog-hybrid-v2';
manifest.hybridBundleContract.currentBundleRevision='2.0.0';
manifest.heroFidelityContract={
  version:9,
  revision:'9.4.0',
  source:'supplied-mvp-reference-boards',
  heroRecipeIds:['bog-cyclops-grin','fuzz-fanged','imp-roar'],
  stableIdPolicy:'replace artwork behind published IDs; do not rename exported recipe components',
  authoredReplacementCount:21,
  families:{
    bases:['base-bog','base-fuzz','base-imp'],
    eyes:['eye-cyclops','eye-sleepy','eye-wide'],
    noses:['nose-button','nose-hook','nose-piggy'],
    mouths:['mouth-grin','mouth-fangs','mouth-roar'],
    horns:['horn-curved','horn-bent','horn-spiky'],
    patterns:['pattern-spots','pattern-stripes','pattern-freckles'],
    extras:['extra-earring','extra-scar','extra-spikes']
  },
  hybridBundle:{id:'base-bog-hybrid-v2',parentAssetId:'base-bog',revision:'2.0.0'},
  pairJunctions:['base-bog|mouth-grin','base-bog|horn-curved','base-fuzz|mouth-fangs','base-fuzz|horn-bent','base-imp|mouth-roar','base-imp|horn-spiky'],
  reviewSizes:['100-percent','25-percent','96px','48px'],
  backgrounds:['cream','white','black','transparent'],
  finishes:['finish-clean','finish-etched'],
  humanReviewTargets:{silhouetteStrength:4,attachmentIntegration:4,expressionRead:4,detailDensity:4,thumbnailRead:4},
  requiredComparisons:['baseline-clean','hero-clean','hero-flipped','hero-etched','hero-25-percent','hero-96px','hero-48px'],
  forbidden:['rough-js-anatomy','runtime-sketch-effects','cropped-reference-artwork','runtime-path-generation','landmark-inference','path-morphing'],
  runtimeGeometry:false
};
manifest.validation=manifest.validation||{};
manifest.validation.commands=appendUnique(manifest.validation.commands,['node tests/hero-fidelity.test.js','node scripts/hero-fidelity-qa.js --validate-only','node scripts/hero-fidelity-qa.js']);
manifest.validation.heroFidelityReport='generated/qa/hero-fidelity-validation-report.json';
manifest.validation.heroFidelityReportSchema='schemas/hero-fidelity-validation-report.schema.json';
manifest.validation.requiresHeroFidelityValidation=true;
manifest.contactSheetContract=manifest.contactSheetContract||{};
manifest.contactSheetContract.heroFidelityReview='one before/after summary and one full comparison board per locked hero on cream, white, black, and transparent backgrounds';
manifest.contactSheetContract.heroFidelityVariants=['baseline-clean','hero-clean','hero-flipped','hero-etched','25-percent','96px','48px'];

fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('Hero fidelity manifest metadata is current.');
