(() => {
  const assets = window.MONSTER_ASSETS || [];

  const filters = [
    {id:'all',label:'All'},
    {id:'cyclops',label:'Cyclops'},
    {id:'multi',label:'Multi-eye'},
    {id:'horned',label:'Horned'},
    {id:'angry',label:'Angry'},
    {id:'creepy',label:'Creepy'},
    {id:'favorites',label:'Favorites'}
  ];

  const defaults = {
    assetId:'monster-01',
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
  let dragging = false;
  let dragStart = null;
  const imageCache = new Map();

  const $ = id => document.getElementById(id);
  const canvas = $('monsterCanvas');
  const ctx = canvas.getContext('2d');
  const paperMap = {
    cream:'#efe2c8',
    warm:'#c9a36a',
    white:'#f7f2e8',
    black:'#171512'
  };

  function currentAsset(){
    return assets.find(a => a.id === state.assetId) || assets[0];
  }

  function getFavorites(){
    try{return JSON.parse(localStorage.getItem('monster-face-favorites') || '[]')}catch{return[]}
  }

  function setFavorites(ids){
    localStorage.setItem('monster-face-favorites',JSON.stringify(ids));
  }

  function isFavorite(id){
    return getFavorites().includes(id);
  }

  function toggleFavorite(){
    const ids = getFavorites();
    const index = ids.indexOf(state.assetId);
    if(index >= 0) ids.splice(index,1); else ids.push(state.assetId);
    setFavorites(ids);
    renderLibrary();
    updateFavoriteButton();
  }

  function updateFavoriteButton(){
    const fav = isFavorite(state.assetId);
    $('favoriteBtn').querySelector('span').textContent = fav ? '♥' : '♡';
  }

  function loadAssetImage(asset){
    if(imageCache.has(asset.id)) return imageCache.get(asset.id);
    const p = new Promise((resolve,reject)=>{
      const blob = new Blob([asset.svg],{type:'image/svg+xml'});
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
    imageCache.set(asset.id,p);
    return p;
  }

  function assetArtMarkup(asset){
    return `<span class="asset-art" role="img" aria-label="${asset.name}">${asset.svg}</span>`;
  }

  function filteredAssets(){
    const favs = getFavorites();
    return assets.filter(asset => {
      if(activeFilter === 'all') return true;
      if(activeFilter === 'favorites') return favs.includes(asset.id);
      if(activeFilter === 'cyclops') return asset.eyeCount === 1;
      if(activeFilter === 'multi') return asset.eyeCount >= 3;
      if(activeFilter === 'horned') return asset.tags.includes('horned') || asset.tags.includes('soft-horns');
      if(activeFilter === 'angry') return asset.mood === 'angry' || asset.mood === 'furious';
      if(activeFilter === 'creepy') return asset.tags.includes('creepy') || asset.tags.includes('skull');
      return true;
    });
  }

  function renderFilters(){
    $('filterRow').innerHTML = '';
    filters.forEach(filter => {
      const btn = document.createElement('button');
      btn.className = 'filter-chip' + (filter.id === activeFilter ? ' active' : '');
      btn.textContent = filter.label;
      btn.onclick = () => { activeFilter = filter.id; renderFilters(); renderLibrary(); };
      $('filterRow').appendChild(btn);
    });
  }

  function renderLibrary(){
    const grid = $('libraryGrid');
    grid.innerHTML = '';
    const shown = filteredAssets();
    $('assetCount').textContent = `${shown.length} asset${shown.length === 1 ? '' : 's'}`;
    shown.forEach(asset => {
      const card = document.createElement('button');
      card.className = 'asset-card' + (asset.id === state.assetId ? ' active' : '');
      card.innerHTML = `
        ${assetArtMarkup(asset)}
        <span class="favorite-star">${isFavorite(asset.id) ? '♥' : ''}</span>
        <span class="asset-meta"><b>${asset.name}</b><small>${asset.eyeCount} eye${asset.eyeCount === 1 ? '' : 's'} · ${asset.mood}</small></span>`;
      card.onclick = () => selectAsset(asset.id);
      grid.appendChild(card);
    });
    if(!shown.length){
      const empty = document.createElement('div');
      empty.className = 'empty-variation';
      empty.textContent = 'No matching faces';
      grid.appendChild(empty);
    }
  }

  function pushHistory(){
    history.push(JSON.stringify(state));
    if(history.length > 80) history.shift();
    future = [];
    updateUndoRedo();
  }

  function applyState(next, record=true){
    if(record) pushHistory();
    state = {...state,...next};
    syncControls();
    renderLibrary();
    render();
  }

  function selectAsset(id){
    const asset = assets.find(a=>a.id===id);
    if(!asset) return;
    const number = String(assets.indexOf(asset)+1).padStart(2,'0');
    applyState({
      assetId:id,
      scale:asset.defaultScale || 1,
      rotation:asset.defaultRotation || 0,
      x:0,y:0,
      caption:`MONSTER No. ${number}`
    });
    updateFavoriteButton();
  }

  function syncControls(){
    $('scale').value = Math.round(state.scale*100);
    $('rotation').value = state.rotation;
    $('scaleOut').textContent = `${Math.round(state.scale*100)}%`;
    $('rotationOut').textContent = `${state.rotation}°`;
    $('frameStyle').value = state.frameStyle;
    $('paperColor').value = state.paperColor;
    $('caption').value = state.caption;
    $('captionToggle').checked = state.showCaption;
    $('transparentToggle').checked = state.transparent;
    [...document.querySelectorAll('.preset')].forEach(b=>b.classList.toggle('active',b.dataset.preset===state.preset));
    $('currentTitle').textContent = currentAsset().name;
    updateUndoRedo();
  }

  function updateUndoRedo(){
    $('undoBtn').disabled = !history.length;
    $('redoBtn').disabled = !future.length;
  }

  function undo(){
    if(!history.length) return;
    future.push(JSON.stringify(state));
    state = JSON.parse(history.pop());
    syncControls(); renderLibrary(); render();
  }

  function redo(){
    if(!future.length) return;
    history.push(JSON.stringify(state));
    state = JSON.parse(future.pop());
    syncControls(); renderLibrary(); render();
  }

  function drawPaper(g,size,forExport=false){
    if(state.transparent && forExport){
      g.clearRect(0,0,size,size);
      return;
    }
    const base = paperMap[state.paperColor] || paperMap.cream;
    if(!state.background){
      g.fillStyle = state.paperColor === 'black' ? '#171512' : '#f7f2e8';
      g.fillRect(0,0,size,size);
      return;
    }
    const grad = g.createRadialGradient(size*.4,size*.28,size*.05,size*.5,size*.5,size*.78);
    if(state.paperColor === 'black'){
      grad.addColorStop(0,'#2c2924'); grad.addColorStop(1,'#0f0e0c');
    }else{
      grad.addColorStop(0,shadeHex(base,18)); grad.addColorStop(1,shadeHex(base,-10));
    }
    g.fillStyle = grad; g.fillRect(0,0,size,size);

    if(state.preset !== 'clean'){
      const seed = hashString(state.assetId + state.preset + state.paperColor);
      const rand = mulberry32(seed);
      g.save();
      g.globalAlpha = state.preset === 'thermal' ? .13 : .065;
      g.fillStyle = state.paperColor === 'black' ? '#ffffff' : '#171512';
      const count = Math.floor(size * .55);
      for(let i=0;i<count;i++){
        const x=rand()*size,y=rand()*size,s=.4+rand()*1.8;
        g.fillRect(x,y,s,s);
      }
      g.restore();
    }
  }

  function drawFrame(g,size){
    if(state.frameStyle === 'none') return;
    g.save();
    g.strokeStyle = state.paperColor === 'black' ? '#f4e6c8' : '#171512';
    if(state.frameStyle === 'poster'){
      g.lineWidth = size*.008;
      g.strokeRect(size*.045,size*.045,size*.91,size*.91);
      g.lineWidth = size*.002;
      g.strokeRect(size*.061,size*.061,size*.878,size*.878);
    }else if(state.frameStyle === 'badge'){
      g.lineWidth = size*.009;
      g.beginPath();g.arc(size*.5,size*.48,size*.405,0,Math.PI*2);g.stroke();
      g.lineWidth = size*.0025;
      g.beginPath();g.arc(size*.5,size*.48,size*.425,0,Math.PI*2);g.stroke();
    }
    g.restore();
  }

  function drawCaption(g,size){
    if(!state.showCaption || !state.caption.trim()) return;
    const dark = state.paperColor === 'black';
    const y = size*.915;
    g.save();
    g.textAlign='center';
    g.textBaseline='middle';
    g.font=`900 ${Math.round(size*.038)}px Arial Narrow, Arial, sans-serif`;
    const text=state.caption.trim().toUpperCase();
    const m=g.measureText(text);
    const pad=size*.026;
    g.fillStyle=dark?'#f1dfbd':'#171512';
    roundRect(g,size*.5-m.width/2-pad,y-size*.035,m.width+pad*2,size*.07,size*.015);
    g.fill();
    g.fillStyle=dark?'#171512':'#f5e7ca';
    g.fillText(text,size*.5,y);
    g.restore();
  }

  function applyTreatment(g,size){
    if(state.preset === 'noir'){
      g.save();g.globalCompositeOperation='saturation';g.fillStyle='#111';g.fillRect(0,0,size,size);g.restore();
      g.save();g.globalCompositeOperation='multiply';g.globalAlpha=.14;g.fillStyle='#111';g.fillRect(0,0,size,size);g.restore();
    }
    if(state.preset === 'thermal'){
      g.save();g.globalCompositeOperation='saturation';g.fillStyle='#111';g.fillRect(0,0,size,size);g.restore();
      g.save();g.globalCompositeOperation='overlay';g.globalAlpha=.23;g.fillStyle='#111';g.fillRect(0,0,size,size);g.restore();
    }
  }

  async function render(targetCanvas=canvas,forExport=false){
    const g=targetCanvas.getContext('2d');
    const size=targetCanvas.width;
    g.clearRect(0,0,size,size);
    drawPaper(g,size,forExport);
    drawFrame(g,size);
    const asset=currentAsset();
    try{
      const img=await loadAssetImage(asset);
      g.save();
      g.translate(size*.5 + state.x*size*.22, size*.49 + state.y*size*.22);
      g.rotate(state.rotation*Math.PI/180);
      g.scale(state.flipped?-state.scale:state.scale,state.scale);
      const drawSize=size*.74;
      g.drawImage(img,-drawSize/2,-drawSize/2,drawSize,drawSize);
      g.restore();
      applyTreatment(g,size);
      drawCaption(g,size);
    }catch(err){
      g.fillStyle='#171512';g.font='700 24px Arial';g.textAlign='center';g.fillText('Asset failed to load',size/2,size/2);
      console.error(err);
    }
  }

  function shadeHex(hex,amt){
    const n=parseInt(hex.slice(1),16);
    const r=Math.max(0,Math.min(255,(n>>16)+amt));
    const gg=Math.max(0,Math.min(255,((n>>8)&255)+amt));
    const b=Math.max(0,Math.min(255,(n&255)+amt));
    return '#'+(1<<24|r<<16|gg<<8|b).toString(16).slice(1);
  }

  function roundRect(g,x,y,w,h,r){
    g.beginPath();
    g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);
    g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();
  }

  function hashString(str){
    let h=2166136261;
    for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
    return h>>>0;
  }

  function mulberry32(a){
    return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
  }

  function shuffle(){
    const pool=filteredAssets().length ? filteredAssets() : assets;
    let next=pool[Math.floor(Math.random()*pool.length)];
    if(pool.length>1 && next.id===state.assetId) next=pool[(pool.indexOf(next)+1)%pool.length];
    selectAsset(next.id);
  }

  function fit(){
    applyState({scale:1,rotation:0,x:0,y:0,flipped:false});
  }

  function saveVariation(){
    variations.unshift({...state,savedAt:Date.now()});
    variations=variations.slice(0,8);
    renderVariations();
  }

  function renderVariations(){
    const grid=$('variationGrid');
    grid.innerHTML='';
    if(!variations.length){
      const empty=document.createElement('div');
      empty.className='empty-variation';
      empty.textContent='Save a composition to compare it here';
      grid.appendChild(empty);
      return;
    }
    variations.forEach((variation,index)=>{
      const asset=assets.find(a=>a.id===variation.assetId) || assets[0];
      const btn=document.createElement('button');
      btn.innerHTML=`${assetArtMarkup(asset)}<span>Version ${String(variations.length-index).padStart(2,'0')}</span>`;
      btn.onclick=()=>{pushHistory();state={...variation};delete state.savedAt;syncControls();renderLibrary();render()};
      grid.appendChild(btn);
    });
  }

  async function exportPng(){
    const exportCanvas=document.createElement('canvas');
    exportCanvas.width=3600;exportCanvas.height=3600;
    await render(exportCanvas,true);
    exportCanvas.toBlob(async blob=>{
      if(!blob) return;
      const metadata={
        app:'Monster Face Library',
        version:4,
        mode:'pre-drawn',
        exportedAt:new Date().toISOString(),
        asset:currentAsset(),
        state
      };
      const enriched=await window.PngMetadata.embedJsonInPng(blob,metadata);
      const url=URL.createObjectURL(enriched);
      const a=document.createElement('a');
      a.href=url;
      a.download=`${state.assetId}-${Date.now()}.png`;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    },'image/png');
  }

  function bindControls(){
    $('shuffleBtn').onclick=shuffle;
    $('shufflePrimary').onclick=shuffle;
    $('resetBtn').onclick=()=>applyState({...defaults});
    $('favoriteBtn').onclick=toggleFavorite;
    $('exportBtn').onclick=exportPng;
    $('undoBtn').onclick=undo;
    $('redoBtn').onclick=redo;
    $('flipBtn').onclick=()=>applyState({flipped:!state.flipped});
    $('fitBtn').onclick=fit;
    $('saveVariationBtn').onclick=saveVariation;
    $('backgroundBtn').onclick=()=>applyState({background:!state.background});

    $('scale').oninput=e=>{
      if(!e.target.dataset.started){pushHistory();e.target.dataset.started='1'}
      state.scale=Number(e.target.value)/100;
      $('scaleOut').textContent=e.target.value+'%';render();
    };
    $('scale').onchange=e=>delete e.target.dataset.started;
    $('rotation').oninput=e=>{
      if(!e.target.dataset.started){pushHistory();e.target.dataset.started='1'}
      state.rotation=Number(e.target.value);
      $('rotationOut').textContent=e.target.value+'°';render();
    };
    $('rotation').onchange=e=>delete e.target.dataset.started;

    $('frameStyle').onchange=e=>applyState({frameStyle:e.target.value});
    $('paperColor').onchange=e=>applyState({paperColor:e.target.value});
    $('caption').onchange=e=>applyState({caption:e.target.value});
    $('caption').oninput=e=>{state.caption=e.target.value;render()};
    $('captionToggle').onchange=e=>applyState({showCaption:e.target.checked});
    $('transparentToggle').onchange=e=>applyState({transparent:e.target.checked});

    document.querySelectorAll('.preset').forEach(btn=>{
      btn.onclick=()=>applyState({preset:btn.dataset.preset});
    });

    const wrap=$('canvasWrap');
    wrap.addEventListener('pointerdown',e=>{
      dragging=true;wrap.setPointerCapture(e.pointerId);
      dragStart={px:e.clientX,py:e.clientY,x:state.x,y:state.y};
      pushHistory();
    });
    wrap.addEventListener('pointermove',e=>{
      if(!dragging)return;
      const rect=wrap.getBoundingClientRect();
      state.x=Math.max(-1,Math.min(1,dragStart.x+(e.clientX-dragStart.px)/rect.width*2));
      state.y=Math.max(-1,Math.min(1,dragStart.y+(e.clientY-dragStart.py)/rect.height*2));
      render();
    });
    const endDrag=()=>{dragging=false;dragStart=null};
    wrap.addEventListener('pointerup',endDrag);
    wrap.addEventListener('pointercancel',endDrag);
  }

  async function init(){
    renderFilters();
    renderLibrary();
    renderVariations();
    bindControls();
    syncControls();
    updateFavoriteButton();
    await Promise.all(assets.slice(0,3).map(loadAssetImage));
    render();
  }

  init();
})();
