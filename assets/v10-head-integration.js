(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) api.install(root);
})(typeof window!=='undefined'?window:null,function(root){
  'use strict';
  const isNode=typeof module==='object'&&module.exports;
  const pairJunctions=isNode?[require('./v10-head-junctions-01'),require('./v10-head-junctions-02'),require('./v10-head-junctions-03'),require('./v10-head-junctions-04'),require('./v10-head-junctions-05'),require('./v10-head-junctions-06')].flat():(root.MONSTER_V10_HEAD_JUNCTION_CHUNKS||[]).flat();
  const baseSeams=isNode?[require('./v10-head-seams-01'),require('./v10-head-seams-02'),require('./v10-head-seams-03'),require('./v10-head-seams-04'),require('./v10-head-seams-05')].flat():(root.MONSTER_V10_HEAD_SEAM_CHUNKS||[]).flat();
  const compatibilityChunks=isNode?[require('./v10-head-compatibility-01'),require('./v10-head-compatibility-02')].flat():(root.MONSTER_V10_HEAD_COMPATIBILITY_CHUNKS||[]).flat();
  const compatibility=Object.assign({},...compatibilityChunks);
  const placementOverrides=isNode?require('./v10-head-placements'):(root.MONSTER_V10_HEAD_PLACEMENTS||{});
  const reviewPairKeys=pairJunctions.map(item=>item.pairKey);
  const baseIds=Object.keys(compatibility);
  function install(target){
    const pair=target.MONSTER_PAIR_JUNCTIONS;if(!pair)throw new Error('V10 head integration requires MONSTER_PAIR_JUNCTIONS');
    pair.mouth=pair.mouth||[];pair.horns=pair.horns||[];pair.all=pair.all||[];pair.byKey=pair.byKey||{};
    for(const item of pairJunctions){if(!pair.byKey[item.pairKey]){(item.family==='horns'?pair.horns:pair.mouth).push(item);pair.all.push(item);pair.byKey[item.pairKey]=item;}}
    pair.version=10;pair.revision='10.2.0';pair.candidateHeadPairKeys=reviewPairKeys;pair.select=(baseId,partId)=>pair.byKey[baseId+'|'+partId]||null;
    const seams=target.MONSTER_JUNCTIONS;if(!seams)throw new Error('V10 head integration requires MONSTER_JUNCTIONS');
    seams.mouthSeams=seams.mouthSeams||[];seams.hornSeams=seams.hornSeams||[];
    for(const seam of baseSeams){const list=seam.family==='horns'?seams.hornSeams:seams.mouthSeams;if(!list.some(item=>item.id===seam.id))list.push(seam);}
    const compat=target.MONSTER_COMPATIBILITY;if(!compat)throw new Error('V10 head integration requires MONSTER_COMPATIBILITY');
    compat.matrix=compat.matrix||{};compat.placementOverrides=compat.placementOverrides||{};
    for(const [baseId,families] of Object.entries(compatibility)){const entry=compat.matrix[baseId]=compat.matrix[baseId]||{};for(const [family,states] of Object.entries(families))entry[family]={approved:[...states.approved],acceptable:[...states.acceptable],blocked:[...states.blocked]};}
    Object.assign(compat.placementOverrides,placementOverrides);compat.version=10;compat.revision='10.2.0';compat.candidateHeadBaseIds=baseIds;
    target.MONSTER_V10_HEAD_INTEGRATION={version:10,revision:'10.2.0',runtimeGeometry:false,humanApprovalRequired:true,pairJunctions,baseSeams,compatibility,placementOverrides,reviewPairKeys,baseIds};return target.MONSTER_V10_HEAD_INTEGRATION;
  }
  return {version:10,revision:'10.2.0',runtimeGeometry:false,humanApprovalRequired:true,pairJunctions,baseSeams,compatibility,placementOverrides,reviewPairKeys,baseIds,install};
});
