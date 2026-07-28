(function(){
  const compatibility=window.MONSTER_COMPATIBILITY;
  if(!compatibility) return;

  const originalSlotFor=slotFor;
  const originalSelectPart=selectPart;
  const originalRecipeMetadata=recipeMetadata;
  const originalCompositeLayerItems=compositeLayerItems;
  const keyCategories={eyeId:'eyes',noseId:'noses',mouthId:'mouths',hornId:'horns'};

  function mergeSlots(baseSlot,override){
    return {
      x:(baseSlot.x||0)+(override.x||0),
      y:(baseSlot.y||0)+(override.y||0),
      scale:(baseSlot.scale||1)*(override.scale||1),
      rotation:(baseSlot.rotation||0)+(override.rotation||0)
    };
  }

  slotFor=function(base,categoryId,item){
    const baseSlot=originalSlotFor(base,categoryId);
    const selected=item||currentPart(categoryId);
    if(!base||!selected||categoryId==='bases') return baseSlot;
    const override=compatibility.placementOverrides[`${base.id}|${selected.id}`];
    return override?mergeSlots(baseSlot,override):baseSlot;
  };

  function statusFor(categoryId,partId,snapshot=state){
    if(!['eyes','noses','mouths','horns'].includes(categoryId)) return 'approved';
    return compatibility.status(snapshot.baseId,categoryId,partId);
  }

  function firstCompatible(categoryId,baseId,preferred='approved'){
    const ids=compatibility.compatibleIds(baseId,categoryId,preferred);
    return ids[0]||compatibility.compatibleIds(baseId,categoryId,'acceptable')[0]||(parts[categoryId]||[])[0]?.id;
  }

  function repairForBase(next){
    ['eyes','noses','mouths','horns'].forEach(categoryId=>{
      const key=categoryInfo(categoryId).key;
      const current=next[key]||state[key];
      if(compatibility.status(next.baseId,categoryId,current)==='blocked') next[key]=firstCompatible(categoryId,next.baseId);
    });
    return next;
  }

  selectPart=function(categoryId,id){
    const category=categoryInfo(categoryId);
    if(!category) return;
    if(categoryId==='bases'){
      const next=repairForBase({baseId:id});
      const base=(parts.bases||[]).find(part=>part.id===id);
      if(base) next.caption=base.name.toUpperCase();
      next.recipeId=null;
      next.compatibilityState='manual-compatible';
      applyState(next);
      updateFavoriteButton();
      return;
    }
    if(statusFor(categoryId,id)==='blocked') return;
    originalSelectPart(categoryId,id);
    state.recipeId=null;
    state.compatibilityState=statusFor(categoryId,id)==='approved'?'manual-approved':'manual-compatible';
  };

  const originalRenderLibrary=renderLibrary;
  renderLibrary=function(){
    originalRenderLibrary();
    if(state.mode!=='builder'||!['eyes','noses','mouths','horns'].includes(activeCategory)) return;
    [...document.querySelectorAll('#libraryGrid .part-card')].forEach((card,index)=>{
      const part=(parts[activeCategory]||[])[index];
      if(!part) return;
      const pairKey=`${state.baseId}|${part.id}`;
      const status=statusFor(activeCategory,part.id);
      card.dataset.compatibility=status;
      card.dataset.pairReview=compatibility.reviewedPairKeys?.includes(pairKey)?'exact-reviewed':'generic-fallback';
      card.classList.toggle('blocked',status==='blocked');
      card.disabled=status==='blocked';
      const meta=card.querySelector('small');
      if(meta) meta.textContent=`${status} · ${card.dataset.pairReview} · ${meta.textContent}`;
      card.title=status==='blocked'?`Blocked on ${currentBase()?.name||'this base'}`:`${status} pairing · ${card.dataset.pairReview}`;
    });
  };

  function randomItem(list){return list[Math.floor(Math.random()*list.length)]}
  function chooseCompatible(baseId,categoryId,approvedBias=.9){
    const approved=compatibility.compatibleIds(baseId,categoryId,'approved');
    const all=compatibility.compatibleIds(baseId,categoryId,'acceptable');
    const pool=Math.random()<approvedBias&&approved.length?approved:all;
    return randomItem(pool)||firstCompatible(categoryId,baseId);
  }
  function chooseOptional(categoryId,noneChance){
    const list=parts[categoryId]||[];
    if(Math.random()<noneChance) return list.find(item=>(item.tags||[]).includes('none'))?.id||list[0]?.id;
    const visible=list.filter(item=>!(item.tags||[]).includes('none'));
    return randomItem(visible)?.id||list[0]?.id;
  }
  function weightedRecipe(){
    const pool=[];
    for(const recipe of compatibility.recipes||[]) for(let i=0;i<Math.max(1,recipe.shuffleWeight||1);i++) pool.push(recipe);
    return randomItem(pool);
  }
  function recipeState(recipe){
    return {...recipe,recipeId:recipe.id,compatibilityState:'approved-reviewed',scale:1,rotation:0,x:0,y:0,flipped:false,caption:recipe.name.toUpperCase()};
  }
  function mutateRecipe(recipe){
    const next=recipeState(recipe);
    // Mouth and horn/ear stay locked to the reviewed exact-pair plates. Mutation is
    // selection-only and limited to approved eyes, noses, patterns, and extras.
    const mutable=randomItem(['eyeId','noseId','patternId','extraId']);
    const category=keyCategories[mutable];
    if(category) next[mutable]=chooseCompatible(recipe.baseId,category,.94);
    else if(mutable==='patternId') next.patternId=chooseOptional('patterns',.08);
    else next.extraId=chooseOptional('extras',.18);
    next.recipeId=`${recipe.id}:reviewed-mutation`;
    next.compatibilityState='approved-reviewed-mutation';
    return next;
  }

  function v8Shuffle(){
    if(state.mode==='faces'){
      const pool=filteredAssets().length?filteredAssets():assets;
      let next=randomItem(pool);
      if(pool.length>1&&next.id===state.assetId) next=pool[(pool.indexOf(next)+1)%pool.length];
      if(next) selectAsset(next.id);
      return;
    }
    const recipe=weightedRecipe();
    if(recipe) applyState(Math.random()<.84?recipeState(recipe):mutateRecipe(recipe));
  }
  shuffle=v8Shuffle;
  $('shuffleBtn').onclick=v8Shuffle;
  $('shufflePrimary').onclick=v8Shuffle;

  recipeMetadata=function(){
    const metadata=originalRecipeMetadata();
    if(state.mode!=='builder') return metadata;
    const pairKeys={mouth:`${state.baseId}|${state.mouthId}`,horns:`${state.baseId}|${state.hornId}`};
    return {...metadata,compatibility:{version:9,revision:compatibility.revision||null,recipeId:state.recipeId||null,state:state.compatibilityState||'manual-compatible',reviewedRecipe:Boolean(state.recipeId&&compatibility.reviewedRecipeIds?.some(id=>state.recipeId.startsWith(id))),pairKeys,pairReview:{mouth:compatibility.reviewedPairKeys?.includes(pairKeys.mouth)?'exact-reviewed':'generic-fallback',horns:compatibility.reviewedPairKeys?.includes(pairKeys.horns)?'exact-reviewed':'generic-fallback'},pairStates:{eyes:statusFor('eyes',state.eyeId),noses:statusFor('noses',state.noseId),mouths:statusFor('mouths',state.mouthId),horns:statusFor('horns',state.hornId)},placementOverrides:Object.fromEntries(['eyes','noses','mouths','horns'].map(categoryId=>{const item=currentPart(categoryId);const value=item?compatibility.placementOverrides[`${state.baseId}|${item.id}`]:null;return [categoryId,value||null]}))}};
  };

  compositeLayerItems=function(snapshot=state){
    return originalCompositeLayerItems(snapshot).filter(layer=>statusFor(layer.categoryId,layer.item.id,snapshot)!=='blocked');
  };

  renderLibrary();
  syncControls();
})();
