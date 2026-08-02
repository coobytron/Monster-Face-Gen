(function(root,factory){
  const api=factory(root);
  if(typeof module==='object'&&module.exports) module.exports=api;
  if(root) api.install(root);
})(typeof window!=='undefined'?window:null,function(root){
  'use strict';
  const isNode=typeof module==='object'&&module.exports;
  const mouthJunctions=isNode?[require('./v10-mouth-junctions-01'),require('./v10-mouth-junctions-02'),require('./v10-mouth-junctions-03'),require('./v10-mouth-junctions-04'),require('./v10-mouth-junctions-05')].flat():(root.MONSTER_V10_MOUTH_JUNCTION_CHUNKS||[]).flat();
  const data=isNode?require('./v10-mouth-integration-data'):(root.MONSTER_V10_MOUTH_INTEGRATION_DATA||{});
  const compatibility=data.compatibility||{},placementOverrides=data.placementOverrides||{};
  const reviewPairKeys=mouthJunctions.map(item=>item.pairKey);
  function appendUnique(list,values){for(const value of values){if(!list.includes(value))list.push(value);}}
  function install(target){
    const pair=target.MONSTER_PAIR_JUNCTIONS;if(!pair)throw new Error('V10 mouth integration requires MONSTER_PAIR_JUNCTIONS');
    pair.mouth=pair.mouth||[];pair.all=pair.all||[];pair.byKey=pair.byKey||{};
    for(const item of mouthJunctions){if(!pair.byKey[item.pairKey]){pair.mouth.push(item);pair.all.push(item);pair.byKey[item.pairKey]=item;}}
    pair.version=10;pair.revision='10.1.0';pair.candidateMouthPairKeys=reviewPairKeys;pair.select=(baseId,partId)=>pair.byKey[baseId+'|'+partId]||null;
    const compat=target.MONSTER_COMPATIBILITY;if(!compat)throw new Error('V10 mouth integration requires MONSTER_COMPATIBILITY');
    for(const [baseId,states] of Object.entries(compatibility)){const family=compat.matrix?.[baseId]?.mouths;if(!family)throw new Error('Missing compatibility mouth family for '+baseId);for(const state of ['approved','acceptable','blocked'])family[state]=(family[state]||[]).filter(id=>!reviewPairKeys.some(key=>key.endsWith('|'+id)));for(const state of ['approved','acceptable','blocked'])appendUnique(family[state],states[state]);}
    Object.assign(compat.placementOverrides,placementOverrides);compat.version=10;compat.revision='10.1.0';compat.candidateMouthPairKeys=reviewPairKeys;
    target.MONSTER_V10_MOUTH_INTEGRATION={version:10,revision:'10.1.0',runtimeGeometry:false,humanApprovalRequired:true,mouthJunctions,compatibility,placementOverrides,reviewPairKeys};return target.MONSTER_V10_MOUTH_INTEGRATION;
  }
  return {version:10,revision:'10.1.0',runtimeGeometry:false,humanApprovalRequired:true,mouthJunctions,compatibility,placementOverrides,reviewPairKeys,install};
});
