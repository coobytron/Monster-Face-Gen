  const assets = window.MONSTER_ASSETS || [];
  const parts = window.MONSTER_PARTS || {};

  const filters = [
    {id:'all',label:'All'},
    {id:'cyclops',label:'Cyclops'},
    {id:'multi',label:'Multi-eye'},
    {id:'horned',label:'Horned'},
    {id:'angry',label:'Angry'},
    {id:'creepy',label:'Creepy'},
    {id:'favorites',label:'Favorites'}
  ];

  const categories = [
    {id:'bases',label:'Heads',key:'baseId'},
    {id:'eyes',label:'Eyes',key:'eyeId'},
    {id:'noses',label:'Noses',key:'noseId'},
    {id:'mouths',label:'Mouths',key:'mouthId'},
    {id:'horns',label:'Horns / ears',key:'hornId'},
    {id:'patterns',label:'Patterns',key:'patternId'},
    {id:'extras',label:'Extras',key:'extraId'}
  ];

  const defaults = {
    mode:'faces',
    assetId:'monster-01',
    baseId:'base-bog',
    eyeId:'eye-cyclops',
    noseId:'nose-button',
    mouthId:'mouth-grin',
    hornId:'horn-curved',
    patternId:'pattern-spots',
    extraId:'extra-earring',
    scale:1,
    rotation:0,
    x:0,
    y:0,
    flipped:false,
    background:true,
    preset:'classic',
    frameStyle:'none',
    paperColor:'cream',
    caption:'MONSTER No. 01',
    showCaption:true,
    transparent:false
  };

  let state = {...defaults};
  let history = [];
  let future = [];
  let variations = [];
  let activeFilter = 'all';
  let activeCategory = 'bases';
  let dragging = false;
  let dragStart = null;
  let renderToken = 0;
  const imageCache = new Map();

  const $ = id => document.getElementById(id);
  const canvas = $('monsterCanvas');
  const paperMap = {
    cream:'#efe2c8',
    warm:'#c9a36a',
    white:'#f7f2e8',
    black:'#171512'
  };

  function categoryInfo(id){ return categories.find(category => category.id === id); }
  function currentAsset(){ return assets.find(asset => asset.id === state.assetId) || assets[0]; }
  function currentPart(categoryId, snapshot=state){
    const category = categoryInfo(categoryId);
    if(!category) return null;
    const list = parts[categoryId] || [];
    return list.find(part => part.id === snapshot[category.key]) || list[0] || null;
  }
  function currentBase(snapshot=state){ return currentPart('bases',snapshot); }

  function getFavorites(){
    try{return JSON.parse(localStorage.getItem('monster-face-favorites') || '[]')}catch{return[]}
  }
  function setFavorites(ids){ localStorage.setItem('monster-face-favorites',JSON.stringify(ids)); }
  function currentIdentity(snapshot=state){
    if(snapshot.mode === 'faces') return snapshot.assetId;
    return `builder:${categories.map(category => snapshot[category.key]).join('|')}`;
  }
  function isFavorite(identity=currentIdentity()){ return getFavorites().includes(identity); }
  function toggleFavorite(){
    const identity=currentIdentity();
    const ids=getFavorites();
    const index=ids.indexOf(identity);
    if(index>=0) ids.splice(index,1); else ids.push(identity);
    setFavorites(ids);
    renderLibrary();
    updateFavoriteButton();
  }
  function updateFavoriteButton(){
    $('favoriteBtn').querySelector('span').textContent = isFavorite() ? '♥' : '♡';
  }

  function loadSvgImage(item){
    if(!item) return Promise.reject(new Error('Missing authored asset'));
    if(imageCache.has(item.id)) return imageCache.get(item.id);
    const promise=new Promise((resolve,reject)=>{
      const blob=new Blob([item.svg],{type:'image/svg+xml'});
      const url=URL.createObjectURL(blob);
      const img=new Image();
      img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
      img.onerror=error=>{URL.revokeObjectURL(url);reject(error)};
      img.src=url;
    });
    imageCache.set(item.id,promise);
    return promise;
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
  }
  function assetArtMarkup(item){
    return `<span class="asset-art" role="img" aria-label="${escapeHtml(item.name)}">${item.svg}</span>`;
  }
  function partArtMarkup(item,categoryId){
    const previewScale={bases:1.06,eyes:1.46,noses:1.72,mouths:1.48,horns:1.16,patterns:1.18,extras:1.55}[categoryId]||1;
    return `<span class="asset-art part-preview" style="--preview-scale:${previewScale}" role="img" aria-label="${escapeHtml(item.name)}">${item.svg}</span>`;
  }

  function filteredAssets(){
    const favorites=getFavorites();
    return assets.filter(asset=>{
      if(activeFilter==='all') return true;
      if(activeFilter==='favorites') return favorites.includes(asset.id);
      if(activeFilter==='cyclops') return asset.eyeCount===1;
      if(activeFilter==='multi') return asset.eyeCount>=3;
      if(activeFilter==='horned') return asset.tags.includes('horned') || asset.tags.includes('soft-horns');
      if(activeFilter==='angry') return asset.mood==='angry' || asset.mood==='furious';
      if(activeFilter==='creepy') return asset.tags.includes('creepy') || asset.tags.includes('skull');
      return true;
    });
  }

  function renderModeSwitch(){
    document.querySelectorAll('.mode-btn').forEach(button=>button.classList.toggle('active',button.dataset.mode===state.mode));
    const builder=state.mode==='builder';
    $('filterRow').hidden=builder;
    $('categoryRow').hidden=!builder;
    $('builderSummaryGroup').hidden=!builder;
    $('libraryGrid').classList.toggle('parts',builder);
    $('sourceNote').innerHTML=builder
      ? '<strong>Authored object builder</strong>Every selection is a fixed transparent illustration. Shuffle only recombines approved objects using authored placement slots.'
      : '<strong>Complete face library</strong>Select a finished character and art-direct its placement, print treatment, caption, and export.';
    $('stageMode').textContent=builder?'Layered object build':'Complete face';
    $('shufflePrimary').textContent=builder?'Shuffle authored parts':'Shuffle face';
  }

  function renderFilters(){
    const row=$('filterRow');
    row.innerHTML='';
    filters.forEach(filter=>{
      const button=document.createElement('button');
      button.className='filter-chip'+(filter.id===activeFilter?' active':'');
      button.textContent=filter.label;
      button.onclick=()=>{activeFilter=filter.id;renderFilters();renderLibrary()};
      row.appendChild(button);
    });
  }

  function renderCategories(){
    const row=$('categoryRow');
    row.innerHTML='';
    categories.forEach(category=>{
      const button=document.createElement('button');
      const count=(parts[category.id]||[]).length;
      button.className='category-tab'+(category.id===activeCategory?' active':'');
      button.textContent=`${category.label} ${count}`;
      button.onclick=()=>{activeCategory=category.id;renderCategories();renderLibrary()};
      row.appendChild(button);
    });
  }

  function renderLibrary(){
    const grid=$('libraryGrid');
    grid.innerHTML='';
    if(state.mode==='faces'){
      const shown=filteredAssets();
      $('assetCount').textContent=`${shown.length} face${shown.length===1?'':'s'}`;
      shown.forEach(asset=>{
        const card=document.createElement('button');
        card.className='asset-card'+(asset.id===state.assetId?' active':'');
        card.innerHTML=`${assetArtMarkup(asset)}<span class="favorite-star">${isFavorite(asset.id)?'♥':''}</span><span class="asset-meta"><b>${escapeHtml(asset.name)}</b><small>${asset.eyeCount} eye${asset.eyeCount===1?'':'s'} · ${escapeHtml(asset.mood)}</small></span>`;
        card.onclick=()=>selectAsset(asset.id);
        grid.appendChild(card);
      });
      if(!shown.length) grid.innerHTML='<div class="empty-variation">No matching faces</div>';
      return;
    }

    const category=categoryInfo(activeCategory);
    const shown=parts[activeCategory]||[];
    $('assetCount').textContent=`${shown.length} ${category.label.toLowerCase()}`;
    shown.forEach(part=>{
      const card=document.createElement('button');
      card.className='asset-card part-card'+(part.id===state[category.key]?' active':'');
      const tags=(part.tags||[]).filter(tag=>tag!=='none').slice(0,2).join(' · ') || 'remove layer';
      card.innerHTML=`${partArtMarkup(part,activeCategory)}<span class="asset-meta"><b>${escapeHtml(part.name)}</b><small>${escapeHtml(tags)}</small></span>`;
      card.onclick=()=>selectPart(activeCategory,part.id);
      grid.appendChild(card);
    });
  }

  function pushHistory(){
    history.push(JSON.stringify(state));
    if(history.length>80) history.shift();
    future=[];
    updateUndoRedo();
  }

  function applyState(next,record=true){
    if(record) pushHistory();
    state={...state,...next};
    syncControls();
    renderModeSwitch();
    renderFilters();
    renderCategories();
    renderLibrary();
    render();
  }

  function selectAsset(id){
    const asset=assets.find(item=>item.id===id);
    if(!asset) return;
    const number=String(assets.indexOf(asset)+1).padStart(2,'0');
    applyState({assetId:id,scale:asset.defaultScale||1,rotation:asset.defaultRotation||0,x:0,y:0,caption:`MONSTER No. ${number}`});
    updateFavoriteButton();
  }

  function selectPart(categoryId,id){
    const category=categoryInfo(categoryId);
    if(!category || !(parts[categoryId]||[]).some(part=>part.id===id)) return;
    const next={[category.key]:id};
    if(categoryId==='bases'){
      const base=(parts.bases||[]).find(part=>part.id===id);
      if(base) next.caption=base.name.toUpperCase();
    }
    applyState(next);
    updateFavoriteButton();
  }

  function renderBuilderSummary(){
    const summary=$('builderSummary');
    summary.innerHTML='';
    let count=0;
    categories.forEach(category=>{
      const part=currentPart(category.id);
      if(!part) return;
      if(!(part.tags||[]).includes('none')) count++;
      const item=document.createElement('div');
      item.className='summary-item';
      item.innerHTML=`<small>${escapeHtml(category.label)}</small><b>${escapeHtml(part.name)}</b>`;
      summary.appendChild(item);
    });
    $('partCountOut').textContent=String(count);
  }

  function syncControls(){
    $('scale').value=Math.round(state.scale*100);
    $('rotation').value=state.rotation;
    $('scaleOut').textContent=`${Math.round(state.scale*100)}%`;
    $('rotationOut').textContent=`${state.rotation}°`;
    $('frameStyle').value=state.frameStyle;
    $('paperColor').value=state.paperColor;
    $('caption').value=state.caption;
    $('captionToggle').checked=state.showCaption;
    $('transparentToggle').checked=state.transparent;
    document.querySelectorAll('.preset').forEach(button=>button.classList.toggle('active',button.dataset.preset===state.preset));
    if(state.mode==='faces'){
      const asset=currentAsset();
      $('currentTitle').textContent=asset?asset.name:'Complete Face';
      $('assetBadge').textContent='Curated complete face';
    }else{
      const base=currentBase();
      const count=categories.filter(category=>{
        const part=currentPart(category.id);
        return part && !(part.tags||[]).includes('none');
      }).length;
      $('currentTitle').textContent=base?`${base.name} Build`:'Authored Build';
      $('assetBadge').textContent=`${count} pre-drawn parts`;
      renderBuilderSummary();
    }
    updateUndoRedo();
    updateFavoriteButton();
  }

  function updateUndoRedo(){
    $('undoBtn').disabled=!history.length;
    $('redoBtn').disabled=!future.length;
  }
  function undo(){
    if(!history.length) return;
    future.push(JSON.stringify(state));
    state=JSON.parse(history.pop());
    syncControls();renderModeSwitch();renderFilters();renderCategories();renderLibrary();render();
  }
  function redo(){
    if(!future.length) return;
    history.push(JSON.stringify(state));
    state=JSON.parse(future.pop());
    syncControls();renderModeSwitch();renderFilters();renderCategories();renderLibrary();render();
  }

