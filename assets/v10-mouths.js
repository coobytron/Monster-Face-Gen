(function(root,factory){
  const pack=factory(root);
  if(typeof module==='object'&&module.exports) module.exports=pack;
  if(root){root.MONSTER_PARTS=root.MONSTER_PARTS||{};const target=root.MONSTER_PARTS.mouths=root.MONSTER_PARTS.mouths||[];for(const asset of pack.assets){if(!target.some(item=>item.id===asset.id))target.push(asset);}root.MONSTER_V10_MOUTH_PACK=pack;}
})(typeof window!=='undefined'?window:null,function(root){
  'use strict';
  const isNode=typeof module==='object'&&module.exports;
  const assets=isNode?[require('./v10-mouth-assets-01'),require('./v10-mouth-assets-02'),require('./v10-mouth-assets-03')].flat():(root.MONSTER_V10_MOUTH_ASSET_CHUNKS||[]).flat();
  const reviewFixtures=isNode?require('./v10-mouth-fixtures'):(root.MONSTER_V10_MOUTH_FIXTURES||[]);
  return {version:10,revision:'10.1.0',issue:34,status:'candidate',humanApprovalRequired:true,runtimeGeometry:false,baselineCount:9,targetCount:27,assets,reviewFixtures,requiredFamilies:["sparse","crowded","tusked","buck-toothed","zipper-like","gummy","fang-led","open-roar","underbite","tongue-led"],reviewScales:["100%","25%","192px","96px","48px"],reviewBackgrounds:["cream","white","black","transparent"]};
});
