(function(root,factory){const pack=factory(root);if(typeof module==='object'&&module.exports)module.exports=pack;if(root){root.MONSTER_PARTS=root.MONSTER_PARTS||{};const target=root.MONSTER_PARTS.eyes=root.MONSTER_PARTS.eyes||[];for(const asset of pack.assets){if(!target.some(item=>item.id===asset.id))target.push(asset);}root.MONSTER_V10_EYE_PACK=pack;}})(typeof window!=='undefined'?window:null,function(root){'use strict';
const isNode=typeof module==='object'&&module.exports;
const assets=isNode?[require('./v10-eye-assets-01'),require('./v10-eye-assets-02')].flat():(root.MONSTER_V10_EYE_ASSET_CHUNKS||[]).flat();
const compatibility=isNode?require('./v10-eye-compatibility'):(root.MONSTER_V10_EYE_COMPATIBILITY||{});
const placements=isNode?require('./v10-eye-placements'):(root.MONSTER_V10_EYE_PLACEMENTS||{});
for(const asset of assets){
  const rules=compatibility[asset.id]||{approved:[],acceptable:[],blocked:[]};
  const rigidPlacementKeys=Object.keys(placements).filter(key=>placements[key].eyeId===asset.id);
  Object.assign(asset,{
    authored:true,
    runtimeGeometry:false,
    status:'agent-candidate-pending-art-director',
    assetRevision:'10.3.1',
    flipSafe:true,
    mirrorWithComposition:true,
    thumbnailSafe:true,
    transparentSafe:true,
    compatibility:rules,
    approvedBaseIds:[...(rules.approved||[])],
    rigidPlacementKeys
  });
}
return {
  version:10,revision:'10.3.1',issue:41,status:'candidate',humanApprovalRequired:true,runtimeGeometry:false,
  baselineCount:10,targetCount:30,assets,compatibility,placements,
  requiredFamilies:['cyclops','multi-eye','drooping','wide-startled','tiny-beady','mismatched','half-lidded','feral','sleepy','stern','goofy','uneasy','glassy','scarred','mechanical-adjacent'],
  requiredExpressions:['sleepy','uneasy','feral','goofy','stern','startled'],
  reviewScales:['100%','96px','48px'],reviewStates:['normal','flipped'],reviewBackgrounds:['cream','white','black','transparent']
};
});
