'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const crypto=require('crypto');
const sharp=require('sharp');
const ROOT=path.resolve(__dirname,'..');
const FORBIDDEN_KEYS=new Set(['geometry','commands','pathData','generator','procedural','drawPath','runtimePath','landmarks']);
const sha256=value=>crypto.createHash('sha256').update(value).digest('hex');
const stripSvg=svg=>{const m=String(svg||'').match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/i);return m?m[1]:''};
const hasViewBox=(svg,viewBox)=>new RegExp(`<svg\\b[^>]*\\bviewBox=["']${viewBox.replace(/ /g,'\\s+')}["']`,'i').test(String(svg||''));
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

function loadRegistry(){
  const context={window:{MONSTER_PARTS:{bases:[]}},console};context.window.window=context.window;vm.createContext(context);
  const filename=path.join(ROOT,'assets/hybrid-bundles.js');
  vm.runInContext(fs.readFileSync(filename,'utf8'),context,{filename:'assets/hybrid-bundles.js'});
  return context.window.MONSTER_HYBRID_BUNDLES;
}
function findForbidden(value,prefix='bundle'){
  const found=[];
  if(Array.isArray(value))value.forEach((item,index)=>found.push(...findForbidden(item,`${prefix}[${index}]`)));
  else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){if(FORBIDDEN_KEYS.has(key))found.push(`${prefix}.${key}`);found.push(...findForbidden(item,`${prefix}.${key}`));}
  return found;
}
async function validateRegistry(registry=loadRegistry()){
  const errors=[],warnings=[],checks=[];
  const bundleIds=new Set();
  if(!registry||registry.runtimeGeometry!==false)errors.push({code:'runtime-geometry-enabled',scope:'registry'});
  const allowedKinds=new Set(registry.allowedKinds||[]),allowedBlendModes=new Set(registry.allowedBlendModes||[]),requiredRoles=new Set(registry.requiredRoles||[]),roleIndex=Object.fromEntries((registry.roleOrder||[]).map((role,index)=>[role,index]));
  for(const bundle of registry.bundles||[]){
    if(bundleIds.has(bundle.id))errors.push({code:'duplicate-bundle-id',bundleId:bundle.id});bundleIds.add(bundle.id);
    if(!bundle.parentAssetId)errors.push({code:'missing-parent-id',bundleId:bundle.id});
    if(!bundle.revision)errors.push({code:'missing-bundle-revision',bundleId:bundle.id});
    if(bundle.runtimeGeometry!==false)errors.push({code:'runtime-geometry-enabled',bundleId:bundle.id});
    if(bundle.width!==registry.coordinateSystem.width||bundle.height!==registry.coordinateSystem.height||bundle.viewBox!==registry.coordinateSystem.viewBox)errors.push({code:'invalid-bundle-dimensions',bundleId:bundle.id,expected:registry.coordinateSystem,actual:{width:bundle.width,height:bundle.height,viewBox:bundle.viewBox}});
    for(const keyPath of findForbidden(bundle,`bundle:${bundle.id}`))errors.push({code:'forbidden-runtime-geometry',bundleId:bundle.id,path:keyPath});
    const roles=new Set(),zs=new Set();
    for(const layer of bundle.layers||[]){
      if(roles.has(layer.role))errors.push({code:'duplicate-layer-role',bundleId:bundle.id,role:layer.role});roles.add(layer.role);
      if(zs.has(layer.z))errors.push({code:'non-deterministic-order',bundleId:bundle.id,z:layer.z});zs.add(layer.z);
      if(!allowedKinds.has(layer.kind))errors.push({code:'invalid-layer-kind',bundleId:bundle.id,role:layer.role,kind:layer.kind});
      if(!allowedBlendModes.has(layer.blendMode||'source-over'))errors.push({code:'invalid-blend-mode',bundleId:bundle.id,role:layer.role,blendMode:layer.blendMode});
      if(typeof layer.alpha!=='number'||layer.alpha<0||layer.alpha>1)errors.push({code:'invalid-alpha',bundleId:bundle.id,role:layer.role,alpha:layer.alpha});
      const sourcePath=path.resolve(ROOT,layer.src||'');
      if(!layer.src||!sourcePath.startsWith(ROOT+path.sep)||!fs.existsSync(sourcePath)){errors.push({code:'broken-layer-path',bundleId:bundle.id,role:layer.role,src:layer.src});continue;}
      const bytes=fs.readFileSync(sourcePath),actualHash=sha256(bytes);
      if(actualHash!==layer.sourceHash)errors.push({code:'source-hash-mismatch',bundleId:bundle.id,role:layer.role,expected:layer.sourceHash,actual:actualHash});
      if(layer.inlineSvg&&sha256(Buffer.from(layer.inlineSvg))!==actualHash)errors.push({code:'inline-source-mismatch',bundleId:bundle.id,role:layer.role});
      if(layer.kind==='svg'||layer.kind==='svg-mask'){
        const svg=bytes.toString('utf8');
        if(!hasViewBox(svg,bundle.viewBox))errors.push({code:'invalid-layer-viewbox',bundleId:bundle.id,role:layer.role,expected:bundle.viewBox});
        if(/<script\b|<foreignObject\b|on[a-z]+\s*=/i.test(svg))errors.push({code:'forbidden-svg-runtime-content',bundleId:bundle.id,role:layer.role});
      }else{
        try{const metadata=await sharp(bytes).metadata();if(metadata.width!==bundle.width||metadata.height!==bundle.height)errors.push({code:'invalid-layer-dimensions',bundleId:bundle.id,role:layer.role,expected:[bundle.width,bundle.height],actual:[metadata.width,metadata.height]});}
        catch(error){errors.push({code:'invalid-raster-source',bundleId:bundle.id,role:layer.role,message:error.message});}
      }
    }
    for(const role of requiredRoles)if(!roles.has(role))errors.push({code:'missing-required-layer',bundleId:bundle.id,role});
    const declared=(bundle.layers||[]).map(layer=>layer.role);
    const sorted=[...(bundle.layers||[])].sort((a,b)=>(a.z-b.z)||((roleIndex[a.role]??999)-(roleIndex[b.role]??999))||String(a.src).localeCompare(String(b.src))).map(layer=>layer.role);
    if(JSON.stringify(declared)!==JSON.stringify(sorted))errors.push({code:'non-deterministic-order',bundleId:bundle.id,declared,expected:sorted});
  }
  const groups={identity:['duplicate-bundle-id','missing-parent-id','missing-bundle-revision'],layers:['duplicate-layer-role','missing-required-layer','invalid-layer-kind','broken-layer-path'],dimensions:['invalid-bundle-dimensions','invalid-layer-viewbox','invalid-layer-dimensions','invalid-raster-source'],ordering:['non-deterministic-order'],alpha:['invalid-alpha','invalid-blend-mode'],hashes:['source-hash-mismatch','inline-source-mismatch'],authored:['runtime-geometry-enabled','forbidden-runtime-geometry','forbidden-svg-runtime-content']};
  for(const [name,codes] of Object.entries(groups))checks.push({name,passed:!errors.some(error=>codes.includes(error.code))});
  const sourceDigest=sha256(JSON.stringify({version:registry.version,bundles:(registry.bundles||[]).map(bundle=>({id:bundle.id,parentAssetId:bundle.parentAssetId,revision:bundle.revision,layers:bundle.layers.map(layer=>({role:layer.role,src:layer.src,z:layer.z,alpha:layer.alpha,blendMode:layer.blendMode,sourceHash:layer.sourceHash}))}))}));
  return{schemaVersion:1,generator:'scripts/hybrid-bundle-contract.js',deterministic:true,generatedAt:new Date(0).toISOString(),sourceDigest,summary:{passed:errors.length===0,errorCount:errors.length,warningCount:warnings.length,checkCount:checks.length},checks,errors,warnings,counts:{bundles:(registry.bundles||[]).length,layers:(registry.bundles||[]).reduce((sum,bundle)=>sum+(bundle.layers||[]).length,0)}};
}
function layerMarkup(layer){
  const file=fs.readFileSync(path.join(ROOT,layer.src));
  if(layer.kind==='svg'||layer.kind==='svg-mask')return stripSvg(file.toString('utf8'));
  const mime=layer.kind==='webp'?'image/webp':'image/png';return`<image href="data:${mime};base64,${file.toString('base64')}" width="600" height="600"/>`;
}
function renderBundleSvg(bundle){
  const layers=[...(bundle.layers||[])].sort((a,b)=>a.z-b.z||String(a.src).localeCompare(String(b.src)));
  const mask=layers.find(layer=>layer.role==='silhouette-mask');
  const maskDef=mask?`<mask id="bundle-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600"><g>${layerMarkup(mask)}</g></mask>`:'';
  const unmasked=layers.filter(layer=>layer.role!=='silhouette-mask'&&layer.masked===false).map(layer=>`<g opacity="${layer.alpha}" style="mix-blend-mode:${layer.blendMode||'normal'}">${layerMarkup(layer)}</g>`).join('');
  const masked=layers.filter(layer=>layer.role!=='silhouette-mask'&&layer.masked!==false).map(layer=>`<g opacity="${layer.alpha}" style="mix-blend-mode:${layer.blendMode||'normal'}">${layerMarkup(layer)}</g>`).join('');
  return`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs>${maskDef}</defs>${unmasked}<g${mask?' mask="url(#bundle-mask)"':''}>${masked}</g></svg>`;
}
function bundleMetadata(bundle){return{bundleId:bundle.id,parentAssetId:bundle.parentAssetId,revision:bundle.revision,sourceHashes:Object.fromEntries(bundle.layers.map(layer=>[layer.role,layer.sourceHash]))};}
module.exports={ROOT,loadRegistry,validateRegistry,renderBundleSvg,bundleMetadata,sha256,esc};
