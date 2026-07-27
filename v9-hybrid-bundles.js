(function(){
  const registry=window.MONSTER_HYBRID_BUNDLES;
  if(!registry) return;

  const originalLoadSvgImage=loadSvgImage;
  const originalDrawLoadedLayers=drawLoadedLayers;
  const originalRecipeMetadata=recipeMetadata;
  const bundleById=Object.fromEntries((registry.bundles||[]).map(bundle=>[bundle.id,bundle]));
  const bundleLoadCache=new Map();
  const bundleCanvasCache=new Map();

  function sortedLayers(bundle){
    const roleIndex=Object.fromEntries((registry.roleOrder||[]).map((role,index)=>[role,index]));
    return [...(bundle.layers||[])].sort((a,b)=>(a.z-b.z)||((roleIndex[a.role]??999)-(roleIndex[b.role]??999))||a.src.localeCompare(b.src));
  }

  function loadLayerImage(layer){
    return new Promise((resolve,reject)=>{
      const image=new Image();
      let url=layer.src;
      let revoke=false;
      if(layer.inlineSvg){
        url=URL.createObjectURL(new Blob([layer.inlineSvg],{type:'image/svg+xml'}));
        revoke=true;
      }
      image.onload=()=>{if(revoke)URL.revokeObjectURL(url);resolve(image)};
      image.onerror=()=>{if(revoke)URL.revokeObjectURL(url);reject(new Error(`Failed authored bundle layer: ${layer.src}`))};
      image.src=url;
    });
  }

  function loadBundle(bundle){
    const key=`${bundle.id}@${bundle.revision}:${(bundle.layers||[]).map(layer=>layer.sourceHash).join('|')}`;
    if(bundleLoadCache.has(key)) return bundleLoadCache.get(key);
    const promise=Promise.all(sortedLayers(bundle).map(async layer=>({...layer,image:await loadLayerImage(layer)})))
      .then(layers=>({__hybridBundle:true,key,bundle,layers}));
    bundleLoadCache.set(key,promise);
    return promise;
  }

  loadSvgImage=function(item){
    const bundle=item&&bundleById[item.bundleId];
    return bundle?loadBundle(bundle):originalLoadSvgImage(item);
  };

  function drawLayer(ctx,layer,size){
    ctx.save();
    ctx.globalAlpha=layer.alpha==null?1:layer.alpha;
    ctx.globalCompositeOperation=layer.blendMode||'source-over';
    ctx.drawImage(layer.image,0,0,size,size);
    ctx.restore();
  }

  function compositeBundleImage(descriptor,size){
    const pixelSize=Math.max(1,Math.round(size));
    const cacheKey=`${descriptor.key}:${pixelSize}`;
    if(bundleCanvasCache.has(cacheKey)) return bundleCanvasCache.get(cacheKey);
    const finalCanvas=document.createElement('canvas');finalCanvas.width=pixelSize;finalCanvas.height=pixelSize;
    const artCanvas=document.createElement('canvas');artCanvas.width=pixelSize;artCanvas.height=pixelSize;
    const finalCtx=finalCanvas.getContext('2d');
    const artCtx=artCanvas.getContext('2d');
    const mask=descriptor.layers.find(layer=>layer.role==='silhouette-mask');
    for(const layer of descriptor.layers){
      if(layer.role==='silhouette-mask') continue;
      if(layer.masked===false) drawLayer(finalCtx,layer,pixelSize);
      else drawLayer(artCtx,layer,pixelSize);
    }
    if(mask){
      artCtx.save();
      artCtx.globalCompositeOperation='destination-in';
      artCtx.globalAlpha=mask.alpha==null?1:mask.alpha;
      artCtx.drawImage(mask.image,0,0,pixelSize,pixelSize);
      artCtx.restore();
    }
    finalCtx.drawImage(artCanvas,0,0);
    bundleCanvasCache.set(cacheKey,finalCanvas);
    return finalCanvas;
  }

  drawLoadedLayers=function(g,size,layers){
    if(!layers.some(layer=>layer.image&&layer.image.__hybridBundle)) return originalDrawLoadedLayers(g,size,layers);
    const drawSize=size*.74;
    g.save();
    g.translate(size*.5+state.x*size*.22,size*.49+state.y*size*.22);
    g.rotate(state.rotation*Math.PI/180);
    g.scale(state.flipped?-state.scale:state.scale,state.scale);
    if(state.mode==='faces'){
      const layer=layers[0];
      if(layer){
        const image=layer.image.__hybridBundle?compositeBundleImage(layer.image,drawSize):layer.image;
        g.drawImage(image,-drawSize/2,-drawSize/2,drawSize,drawSize);
      }
    }else{
      const base=currentBase();
      layers.forEach(layer=>{
        const slot=slotFor(base,layer.categoryId,layer.item);
        g.save();
        g.translate((slot.x||0)*drawSize,(slot.y||0)*drawSize);
        g.rotate((slot.rotation||0)*Math.PI/180);
        g.scale(slot.scale||1,slot.scale||1);
        const image=layer.image.__hybridBundle?compositeBundleImage(layer.image,drawSize):layer.image;
        g.drawImage(image,-drawSize/2,-drawSize/2,drawSize,drawSize);
        g.restore();
      });
    }
    g.restore();
  };

  function selectedBundleMetadata(snapshot=state){
    const selected=[];
    if(snapshot.mode==='faces'){
      const asset=currentAsset();if(asset?.bundleId)selected.push(asset);
    }else{
      for(const category of categories){const item=currentPart(category.id,snapshot);if(item?.bundleId)selected.push(item)}
    }
    return selected.map(item=>{
      const bundle=bundleById[item.bundleId];
      return {
        bundleId:bundle.id,
        parentAssetId:bundle.parentAssetId,
        revision:bundle.revision,
        coordinateSystem:{width:bundle.width,height:bundle.height,viewBox:bundle.viewBox},
        sourceHashes:Object.fromEntries(sortedLayers(bundle).map(layer=>[layer.role,layer.sourceHash])),
        layers:sortedLayers(bundle).map(layer=>({role:layer.role,kind:layer.kind,src:layer.src,z:layer.z,alpha:layer.alpha,blendMode:layer.blendMode,masked:layer.masked!==false}))
      };
    });
  }

  recipeMetadata=function(){
    const metadata=originalRecipeMetadata();
    const hybridBundles=selectedBundleMetadata();
    return hybridBundles.length?{...metadata,hybridAssetContractVersion:registry.version,hybridBundles}:metadata;
  };

  window.MonsterHybridBundles={registry,bundleById,sortedLayers,selectedBundleMetadata};
})();
