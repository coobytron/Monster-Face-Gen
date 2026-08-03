(function(root,factory){
  const pack=factory(root);
  if(typeof module==='object'&&module.exports) module.exports=pack;
  if(root){root.MONSTER_PARTS=root.MONSTER_PARTS||{};const target=root.MONSTER_PARTS.bases=root.MONSTER_PARTS.bases||[];for(const asset of pack.assets){if(!target.some(item=>item.id===asset.id))target.push(asset);}root.MONSTER_V10_HEAD_PACK=pack;}
})(typeof window!=='undefined'?window:null,function(root){
  'use strict';
  const isNode=typeof module==='object'&&module.exports;
  const assets=isNode?[require('./v10-head-assets-01'),require('./v10-head-assets-02'),require('./v10-head-assets-03'),require('./v10-head-assets-04'),require('./v10-head-assets-05'),require('./v10-head-assets-06')].flat():(root.MONSTER_V10_HEAD_ASSET_CHUNKS||[]).flat();
  const reviewFixtures=isNode?require('./v10-head-fixtures'):(root.MONSTER_V10_HEAD_FIXTURES||[]);
  return {version:10,revision:'10.2.0',issue:40,status:'candidate',humanApprovalRequired:true,runtimeGeometry:false,baselineCount:6,targetCount:18,assets,reviewFixtures,requiredArchetypes:["cyclops","multi-eye","skull-like","furry","blob","compact-imp","long-face","squat","soft-cute","sharp-creepy","calm","wild"],integrationZoneKeys:["mouth","crown","eyes","nose"],reviewScales:["100%","25%","192px","96px","48px"],reviewBackgrounds:["cream","white","black","transparent"],reviewOrientations:["normal","flipped"]};
});
