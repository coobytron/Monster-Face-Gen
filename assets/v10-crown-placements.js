(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;if(root)root.MONSTER_V10_CROWN_PLACEMENTS=value;})(typeof window!=='undefined'?window:null,function(){'use strict';
const contentAudit={standaloneAnatomy:false,allowed:['local-root-overlap','short-contour-fold','edge-highlight','local-shadow']};
const plateLibrary={
  paired:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Paired crown root integration plate"><ellipse cx="174" cy="232" rx="48" ry="24" fill="#8e8a79" stroke="#171512" stroke-width="7"/><ellipse cx="426" cy="232" rx="48" ry="24" fill="#8e8a79" stroke="#171512" stroke-width="7"/><path d="M132 231Q174 211 216 231M384 231Q426 211 468 231" fill="none" stroke="#171512" stroke-width="5" stroke-linecap="round"/><path d="M151 217Q174 208 197 217M403 217Q426 208 449 217" fill="none" stroke="#efe2c8" stroke-width="4" opacity=".55"/></svg>`,
  ears:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Paired ear root integration plate"><ellipse cx="174" cy="232" rx="55" ry="27" fill="#9a7775" stroke="#171512" stroke-width="7"/><ellipse cx="426" cy="232" rx="55" ry="27" fill="#9a7775" stroke="#171512" stroke-width="7"/><path d="M126 232Q174 207 222 232M378 232Q426 207 474 232" fill="none" stroke="#171512" stroke-width="5" stroke-linecap="round"/><path d="M150 216Q174 207 198 216M402 216Q426 207 450 216" fill="none" stroke="#efe2c8" stroke-width="4" opacity=".55"/></svg>`,
  asym:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Asymmetrical crown root integration plate"><ellipse cx="174" cy="232" rx="53" ry="25" fill="#8d8977" stroke="#171512" stroke-width="7"/><ellipse cx="426" cy="224" rx="42" ry="22" fill="#8f6e80" stroke="#171512" stroke-width="7"/><path d="M132 231Q174 211 216 231M391 224Q426 207 461 224" fill="none" stroke="#171512" stroke-width="5" stroke-linecap="round"/></svg>`,
  single:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Single crown root integration plate"><ellipse cx="300" cy="221" rx="51" ry="25" fill="#7f8e82" stroke="#171512" stroke-width="7"/><path d="M257 221Q300 199 343 221M272 235Q300 222 328 235" fill="none" stroke="#171512" stroke-width="5" stroke-linecap="round"/><path d="M282 207Q300 198 318 207" fill="none" stroke="#efe2c8" stroke-width="4" opacity=".55"/></svg>`,
  band:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Crown band root integration plate"><path d="M205 228Q300 190 395 228L384 257Q300 236 216 257Z" fill="#827b88" stroke="#171512" stroke-width="7" stroke-linejoin="round"/><path d="M221 230Q300 211 379 230M245 247Q300 235 355 247" fill="none" stroke="#171512" stroke-width="5" stroke-linecap="round"/><path d="M264 216Q300 208 336 216" fill="none" stroke="#efe2c8" stroke-width="4" opacity=".55"/></svg>`
};
const definitions=[
['base-skull-cracked','horn-v10-broken-forks','bone-wide','paired',0,-0.003,.94,0],
['base-squat-slab','horn-v10-curl-coil','ram-coil','paired',0,-0.001,.95,-2],
['base-soft-pillow','horn-v10-stubby-pegs','compact-round','paired',0,.001,.96,1],
['base-sharp-shard','horn-v10-spike-saw','saw-ridge','paired',0,.003,.97,2],
['base-wild-bramble','horn-v10-antler-thicket','branch-wide','paired',0,-.003,.98,-1],
['base-soft-pillow','horn-v10-ear-soft-round','soft-lobe','ears',0,-.001,.94,0],
['base-imp-compact','horn-v10-ear-bat-ragged','bat-ragged','ears',0,.001,.95,-2],
['base-long-face','horn-v10-ear-droop','droop-fold','ears',0,.003,.96,1],
['base-blob-melt','horn-v10-asym-mismatch','split-asym','asym',0,-.003,.97,2],
['base-cyclops-dome','horn-v10-single-crook','single-center','single',0,-.001,.98,-1],
['base-multi-eye-cluster','horn-v10-crown-cluster','cluster-band','band',0,.001,.94,0],
['base-skull','horn-v10-bone-prongs','bone-prong','paired',0,.003,.95,-2],
['base-furry-mane','horn-v10-furry-root','fur-overlap','paired',0,-.003,.96,1],
['base-imp-compact','horn-v10-imp-nubs','imp-tight','paired',0,-.001,.97,2],
['base-blue','horn-v10-ear-fin','fin-rib','ears',0,.001,.98,-1],
['base-long-face','horn-v10-ear-goblin','long-lobe','ears',0,.003,.94,0],
['base-calm-stone','horn-v10-halo-thorns','halo-band','band',0,-.003,.95,-2],
['base-cyclops-dome','horn-v10-ear-moth','wing-lobe','ears',0,-.001,.96,1]
];
return Object.fromEntries(definitions.map(([baseId,crownId,rootProfile,plateId,x,y,scale,rotation])=>{
  const pairKey=`${baseId}|${crownId}`;
  return [pairKey,{id:pairKey,pairKey,baseId,crownId,rootProfile,transform:{x,y,scale,rotation},rootPlate:{svg:plateLibrary[plateId],plateId,zOrder:20,flipSafe:true,mirrorWithComposition:true,contentAudit},reviewStatus:'agent-candidate-pending-art-director'}];
}));
});
