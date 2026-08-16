(function(root,factory){const api=factory(
  typeof module==='object'&&module.exports?require('./v10-eye-compatibility'):root&&root.MONSTER_V10_EYE_COMPATIBILITY,
  typeof module==='object'&&module.exports?require('./v10-eye-placements'):root&&root.MONSTER_V10_EYE_PLACEMENTS
);if(typeof module==='object'&&module.exports)module.exports=api;if(root){root.MONSTER_V10_EYE_INTEGRATION=api;if(root.MONSTER_COMPATIBILITY)api.install(root.MONSTER_COMPATIBILITY);}})(typeof window!=='undefined'?window:null,function(compatibility,placements){'use strict';
const states=['approved','acceptable','blocked'];
function addUnique(list,values){for(const value of values||[])if(!list.includes(value))list.push(value);}
function removeIds(family,ids){for(const state of states)family[state]=(family[state]||[]).filter(id=>!ids.has(id));}
function install(target){
  if(!target||!target.matrix)throw new Error('MONSTER_COMPATIBILITY must load before V10 eye integration.');
  const eyeIds=new Set(Object.keys(compatibility||{}));
  const baseIds=new Set(Object.values(compatibility||{}).flatMap(item=>[...(item.approved||[]),...(item.acceptable||[]),...(item.blocked||[])]));
  for(const baseId of baseIds){
    const base=target.matrix[baseId]=target.matrix[baseId]||{};
    const family=base.eyes=base.eyes||{approved:[],acceptable:[],blocked:[]};
    removeIds(family,eyeIds);
    for(const [eyeId,rules] of Object.entries(compatibility||{})){
      const state=states.find(value=>(rules[value]||[]).includes(baseId));
      if(!state)throw new Error(`Missing eye classification: ${baseId}|${eyeId}`);
      addUnique(family[state],[eyeId]);
    }
  }
  target.placementOverrides=target.placementOverrides||{};
  for(const fixture of Object.values(placements||{}))target.placementOverrides[fixture.pairKey]={...fixture.transform};
  target.v10EyeCandidatePairKeys=Object.keys(placements||{});
  target.v10EyeRevision='10.3.1';
  return target;
}
function fixtureFor(baseId,eyeId){return (placements||{})[`${baseId}|${eyeId}`]||null;}
return {version:10,revision:'10.3.1',issue:41,status:'candidate',humanApprovalRequired:true,runtimeGeometry:false,compatibility,placements,install,fixtureFor};
});
