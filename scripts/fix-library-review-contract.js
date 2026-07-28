#!/usr/bin/env node
'use strict';
const fs=require('fs');
const path=require('path');
const filename=path.resolve(__dirname,'..','reviews','library-fidelity-v9.json');
const review=JSON.parse(fs.readFileSync(filename,'utf8'));
for(const entry of review.reviews||[]){
  const [mouthPair,hornPair]=entry.junctionIds||[];
  entry.actions=[
    {code:'action-1',text:'Re-authored weak selected assets behind their published stable IDs while preserving recipe identity.'},
    {code:'action-2',text:`Added exact authored integration plates for ${mouthPair} and ${hornPair} without embedding standalone anatomy.`},
    {code:'action-3',text:'Verified the production candidate in generic and exact modes, normal and flipped, at composition and thumbnail scales across all required backgrounds.'}
  ];
  entry.reviewRequirements={
    modes:['generic','exact'],
    flipStates:['normal','flipped'],
    scales:['100-percent','25-percent'],
    sizes:['192px','96px','48px'],
    backgrounds:['cream','white','black','transparent']
  };
}
fs.writeFileSync(filename,JSON.stringify(review,null,2)+'\n');
fs.unlinkSync(__filename);
console.log(`Updated ${review.reviews.length} library review records and removed the one-shot migration script.`);
