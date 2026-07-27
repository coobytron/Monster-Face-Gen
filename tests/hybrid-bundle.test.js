'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const sharp=require('sharp');
const {loadRegistry,validateRegistry,renderBundleSvg,bundleMetadata}=require('../scripts/hybrid-bundle-contract');
(async()=>{
  const registry=loadRegistry();
  const report=await validateRegistry(registry);
  assert.strictEqual(report.summary.passed,true,JSON.stringify(report.errors,null,2));
  assert.strictEqual(registry.runtimeGeometry,false);
  assert.strictEqual(registry.bundles.length,1);
  const bundle=registry.bundles[0];
  assert.strictEqual(bundle.parentAssetId,'base-bog');
  assert.strictEqual(bundle.revision,'1.0.0');
  assert.deepStrictEqual(bundle.layers.map(layer=>layer.role),registry.roleOrder);
  assert.strictEqual(renderBundleSvg(bundle),renderBundleSvg(bundle),'bundle rendering must be byte-deterministic');
  const metadata=bundleMetadata(bundle);
  assert.strictEqual(metadata.bundleId,bundle.id);
  assert.strictEqual(Object.keys(metadata.sourceHashes).length,bundle.layers.length);
  const svg=Buffer.from(renderBundleSvg(bundle));
  const raw=await sharp(svg).resize(600,600).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const cornerAlpha=[raw.data[3],raw.data[(599*4)+3],raw.data[((599*600)*4)+3],raw.data[((600*600-1)*4)+3]];
  assert.deepStrictEqual(cornerAlpha,[0,0,0,0],'transparent corners must remain clean');
  const context={window:{MONSTER_PARTS:{}},console};context.window.window=context.window;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/parts/bases.js'),'utf8'),context);const legacy=(context.window.MONSTER_PARTS.bases||[]).find(item=>item.id==='base-bog');
  assert(legacy,'legacy stable parent asset must remain available');
  const legacyRaw=await sharp(Buffer.from(legacy.svg)).resize(600,600).ensureAlpha().raw().toBuffer();
  let totalDifference=0,maxDifference=0;
  for(let i=0;i<raw.data.length;i++){const difference=Math.abs(raw.data[i]-legacyRaw[i]);totalDifference+=difference;if(difference>maxDifference)maxDifference=difference;}
  assert(totalDifference/raw.data.length<0.75,`hybrid fixture average pixel difference too high: ${totalDifference/raw.data.length}`);
  assert(maxDifference<=32,`hybrid fixture maximum pixel difference too high: ${maxDifference}`);

  const exported=await sharp(svg).resize(3600,3600).png().toBuffer({resolveWithObject:true});
  assert.strictEqual(exported.info.width,3600);assert.strictEqual(exported.info.height,3600);
  console.log('hybrid bundle contract tests passed');
})().catch(error=>{console.error(error);process.exit(1);});
