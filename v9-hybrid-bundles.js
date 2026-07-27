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

  function drawBundleLayer(ctx,layer,size){
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
      if(layer.masked===false||!mask){
        drawBundleLayer(finalCtx,layer,pixelSize);
        continue;
      }
      artCtx.clearRect(0,0,pixelSize,pixelSize);
      drawBundleLayer(artCtx,layer,pixelSize);
      artCtx.save();
      artCtx.globalCompositeOperation='destination-in';
      artCtx.globalAlpha=mask.alpha==null?1:mask.alpha;
      artCtx.drawImage(mask.image,0,0,pixelSize,pixelSize);
      artCtx.restore();
      finalCtx.drawImage(artCanvas,0,0);
    }
    bundleCanvasCache.set(cacheKey,finalCanvas);
    return finalCanvas;
  }

  function drawable(image,size){
    return image&&image.__hybridBundle?compositeBundleImage(image,size):image;
  }

  function compositionTransform(ctx,size,callback){
    const drawSize=size*.74;
    ctx.save();
    ctx.translate(size*.5+state.x*size*.22,size*.49+state.y*size*.22);
    ctx.rotate(state.rotation*Math.PI/180);
    ctx.scale(state.flipped?-state.scale:state.scale,state.scale);
    callback(drawSize);
    ctx.restore();
  }

  function drawInSlot(ctx,size,image,slot={x:0,y:0,scale:1,rotation:0}){
    if(!image) return;
    compositionTransform(ctx,size,drawSize=>{
      ctx.save();
      ctx.translate((slot.x||0)*drawSize,(slot.y||0)*drawSize);
      ctx.rotate((slot.rotation||0)*Math.PI/180);
      ctx.scale(slot.scale||1,slot.scale||1);
      ctx.drawImage(drawable(image,drawSize),-drawSize/2,-drawSize/2,drawSize,drawSize);
      ctx.restore();
    });
  }

  function drawBuilderLayer(ctx,size,layer,base){
    if(!layer||!layer.image) return;
    drawInSlot(ctx,size,layer.image,slotFor(base,layer.categoryId,layer.item));
  }

  drawLoadedLayers=function(g,size,layers){
    if(!layers.some(layer=>layer.image&&layer.image.__hybridBundle)) return originalDrawLoadedLayers(g,size,layers);

    if(state.mode==='faces'){
      const layer=layers[0];
      if(layer) drawInSlot(g,size,layer.image);
      return;
    }

    const base=currentBase();
    const byCategory=Object.fromEntries(layers.map(layer=>[layer.categoryId,layer]));
    const assembly=layers.v7Assembly||{};

    drawBuilderLayer(g,size,byCategory.horns,base);
    drawBuilderLayer(g,size,byCategory.bases,base);

    if(assembly.hornSeamImage&&byCategory.horns){
      drawInSlot(g,size,assembly.hornSeamImage,slotFor(base,'horns',byCategory.horns.item));
    }

    drawBuilderLayer(g,size,byCategory.patterns,base);
    drawBuilderLayer(g,size,byCategory.eyes,base);
    drawBuilderLayer(g,size,byCategory.noses,base);

    const mouthLayer=byCategory.mouths;
    const baseLayer=byCategory.bases;
    if(mouthLayer&&baseLayer){
      const mouthSurface=document.createElement('canvas');
      mouthSurface.width=size;mouthSurface.height=size;
      const mouthContext=mouthSurface.getContext('2d');
      drawBuilderLayer(mouthContext,size,mouthLayer,base);
      mouthContext.globalCompositeOperation='destination-in';
      drawBuilderLayer(mouthContext,size,baseLayer,base);
      mouthContext.globalCompositeOperation='source-over';
      g.drawImage(mouthSurface,0,0);
    }else{
      drawBuilderLayer(g,size,mouthLayer,base);
    }

    if(assembly.mouthSeamImage) drawInSlot(g,size,assembly.mouthSeamImage);
    drawBuilderLayer(g,size,byCategory.extras,base);
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

  window.MonsterHybridBundles={registry,bundleById,sortedLayers,selectedBundleMetadata,compositeBundleImage};
})();
