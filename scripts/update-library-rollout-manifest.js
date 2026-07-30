'use strict';
const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const manifestPath=path.join(ROOT,'assets','manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const appendUnique=(list,values)=>[...new Set([...(list||[]),...values])];
const recipeIds=['bog-cyclops-grin','bog-sleepy-gummy','fuzz-buck','fuzz-fanged','skull-oracle','skull-jagged','imp-roar','imp-bat','imp-bent-grin','moss-grinner','moss-tongue','moss-gummy','blue-worry','blue-tangle','blue-wild','bog-gapped'];
const heroIds=['bog-cyclops-grin','fuzz-fanged','imp-roar'];
const libraryIds=recipeIds.filter(id=>!heroIds.includes(id));
const pairs=[
  'base-bog|mouth-grin','base-bog|horn-curved','base-bog|mouth-gummy','base-bog|horn-nubs','base-fuzz|mouth-buck','base-fuzz|horn-tufted','base-fuzz|mouth-fangs','base-fuzz|horn-bent',
  'base-skull|mouth-gapped','base-skull|horn-long','base-skull|mouth-jagged','base-skull|horn-nubs','base-imp|mouth-roar','base-imp|horn-spiky','base-imp|mouth-fangs','base-imp|horn-bat',
  'base-imp|mouth-gapped','base-imp|horn-bent','base-moss|mouth-grin','base-moss|horn-rams','base-moss|mouth-tongue','base-moss|horn-curved','base-moss|mouth-gummy','base-moss|horn-nubs',
  'base-blue|mouth-gummy','base-blue|horn-tufted','base-blue|mouth-tongue','base-blue|horn-bat','base-blue|mouth-gapped','base-blue|horn-nubs','base-bog|mouth-gapped','base-bog|horn-tufted'
];
const libraryFiles=['bases','eyes','noses','mouths','horns','patterns','extras'].map(name=>`assets/library-v9/${name}.js`);
const validationFiles=['tests/library-fidelity.test.js','scripts/library-fidelity-contract.js','scripts/library-fidelity-qa.js','schemas/library-fidelity-validation-report.schema.json'];
manifest.files=manifest.files||{};
manifest.files.libraryFidelity=libraryFiles;
manifest.files.structuredReviews=appendUnique(manifest.files.structuredReviews,['reviews/hero-fidelity-v9.json','reviews/library-fidelity-v9.json']);
manifest.files.validation=appendUnique(manifest.files.validation,validationFiles);
manifest.files.fidelityTargets=appendUnique(manifest.files.fidelityTargets,['docs/LIBRARY-FIDELITY-V9.md']);
manifest.counts=manifest.counts||{};
Object.assign(manifest.counts,{pairSpecificMouthJunctions:16,pairSpecificHornJunctions:16,pairSpecificJunctions:32,libraryFidelityRecipes:13,reviewedFidelityRecipes:16,libraryAuthoredReplacements:34,totalAuthoredVisualObjects:162});
manifest.compatibilityContract=manifest.compatibilityContract||{};
manifest.compatibilityContract.shuffle='84-percent fully reviewed exact-pair recipe; otherwise mutate eyes, nose, pattern, or extra while preserving the reviewed mouth and horn pair';
manifest.compatibilityContract.reviewedRecipeIds=recipeIds;
manifest.compatibilityContract.reviewedPairKeys=pairs;
manifest.pairJunctionContract=manifest.pairJunctionContract||{};
Object.assign(manifest.pairJunctionContract,{version:9,revision:'9.8.0',heroRecipeIds:heroIds,reviewedRecipeIds:recipeIds,requiredPairs:pairs,selection:'exact-pair-first-generic-fallback',runtimeGeometry:false});
manifest.junctions=manifest.junctions||{};
manifest.junctions.pairSpecific=pairs;
manifest.libraryFidelityContract={
  version:9,revision:'9.8.0',source:'supplied-mvp-reference-boards',document:'docs/LIBRARY-FIDELITY-V9.md',reviewFile:'reviews/library-fidelity-v9.json',heroReviewFile:'reviews/hero-fidelity-v9.json',
  heroRecipeIds:heroIds,libraryRecipeIds:libraryIds,reviewedRecipeIds:recipeIds,authoredReplacementCount:34,exactPairJunctionCount:32,
  stableIdPolicy:'replace authored artwork behind published IDs; retain recipe, asset, pair, finish, and export identity',
  reviewSizes:['100-percent','25-percent','192px','96px','48px'],backgrounds:['cream','white','black','transparent'],finishes:['finish-clean','finish-etched'],
  humanConfirmationRequired:true,automatedApproval:false,
  allowedRuntimeOperations:['select','position','uniform-scale','rotate','layer','clip','mask','mirror','finish','export'],
  forbidden:['runtime-path-generation','procedural-anatomy','landmark-inference','path-morphing','non-uniform-distortion','cropped-reference-artwork'],runtimeGeometry:false
};
manifest.validation=manifest.validation||{};
manifest.validation.commands=appendUnique(manifest.validation.commands,['node tests/library-fidelity.test.js','node scripts/library-fidelity-qa.js --validate-only','node scripts/library-fidelity-qa.js']);
manifest.validation.libraryFidelityReport='generated/qa/library-fidelity-validation-report.json';
manifest.validation.libraryFidelityReportSchema='schemas/library-fidelity-validation-report.schema.json';
manifest.validation.requiresLibraryFidelityValidation=true;
manifest.contactSheetContract=manifest.contactSheetContract||{};
manifest.contactSheetContract.pairJunctionReview='generic versus exact authored junctions for all 16 reviewed recipes at 100 percent, 25 percent, 192 px, 96 px, 48 px, and flipped';
manifest.contactSheetContract.libraryFidelityReview='13 non-hero structured production-candidate reviews plus the separate three-hero review set; human acceptance remains pending';
manifest.contactSheetContract.cellMetadata=appendUnique(manifest.contactSheetContract.cellMetadata,['review-status','asset-revision','structured-review-id']);
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('Library fidelity rollout manifest metadata is current.');
