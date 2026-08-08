(function(root,factory){const api=factory(
  typeof module==='object'&&module.exports?require('./v10-crown-compatibility'):root&&root.MONSTER_V10_CROWN_COMPATIBILITY,
  typeof module==='object'&&module.exports?require('./v10-crown-placements'):root&&root.MONSTER_V10_CROWN_PLACEMENTS
);if(typeof module==='object'&&module.exports)module.exports=api;if(root){root.MONSTER_V10_CROWN_INTEGRATION=api;if(root.MONSTER_COMPATIBILITY)api.install(root.MONSTER_COMPATIBILITY);}})(typeof window!=='undefined'?window:null,function(compatibility,placements){'use strict';
const states=['approved','acceptable','blocked'];
const candidatePairKeys=Object.keys(placements||{});
function addUnique(list,values){for(const value of values||[])if(!list.includes(value))list.push(value);}
function removeIds(family,ids){for(const state of states)family[state]=(family[state]||[]).filter(id=>!ids.has(id));}
function install(target){
  if(!target||!target.matrix)throw new Error('MONSTER_COMPATIBILITY must load before V10 crown integration.');
  const crownIds=new Set(Object.keys(compatibility||{}));
  const baseIds=new Set(Object.values(compatibility||{}).flatMap(item=>[...(item.approved||[]),...(item.acceptable||[]),...(item.blocked||[])]));
  for(const baseId of baseIds){
    const base=target.matrix[baseId]=target.matrix[baseId]||{};
    const family=base.horns=base.horns||{approved:[],acceptable:[],blocked:[]};
    removeIds(family,crownIds);
    for(const [crownId,rules] of Object.entries(compatibility||{})){
      const state=states.find(value=>(rules[value]||[]).includes(baseId));
      if(!state)throw new Error(`Missing crown classification: ${baseId}|${crownId}`);
      addUnique(family[state],[crownId]);
    }
  }
  target.placementOverrides=target.placementOverrides||{};
  for(const fixture of Object.values(placements||{}))target.placementOverrides[fixture.pairKey]={...fixture.transform};
  target.v10CrownCandidatePairKeys=[...candidatePairKeys];
  target.v10CrownRevision='10.5.0';
  return target;
}
function rootPlateFor(baseId,crownId){return (placements||{})[`${baseId}|${crownId}`]?.rootPlate||null;}
function fixtureFor(baseId,crownId){return (placements||{})[`${baseId}|${crownId}`]||null;}
return {version:10,revision:'10.5.0',issue:43,status:'candidate',humanApprovalRequired:true,runtimeGeometry:false,candidatePairKeys,compatibility,placements,install,rootPlateFor,fixtureFor};
});
