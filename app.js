  function drawPaper(g,size,forExport=false){
    if(state.transparent&&forExport){g.clearRect(0,0,size,size);return}
    const base=paperMap[state.paperColor]||paperMap.cream;
    if(!state.background){
      g.fillStyle=state.paperColor==='black'?'#171512':'#f7f2e8';
      g.fillRect(0,0,size,size);
      return;
    }
    const gradient=g.createRadialGradient(size*.4,size*.28,size*.05,size*.5,size*.5,size*.78);
    if(state.paperColor==='black'){gradient.addColorStop(0,'#2c2924');gradient.addColorStop(1,'#0f0e0c')}
    else{gradient.addColorStop(0,shadeHex(base,18));gradient.addColorStop(1,shadeHex(base,-10))}
    g.fillStyle=gradient;g.fillRect(0,0,size,size);
    if(state.preset!=='clean'){
      const seed=hashString(currentIdentity()+state.preset+state.paperColor);
      const random=mulberry32(seed);
      g.save();g.globalAlpha=state.preset==='thermal'?.13:.065;g.fillStyle=state.paperColor==='black'?'#fff':'#171512';
      const count=Math.floor(size*.55);
      for(let i=0;i<count;i++){const x=random()*size,y=random()*size,s=.4+random()*1.8;g.fillRect(x,y,s,s)}
      g.restore();
    }
  }

  function drawFrame(g,size){
    if(state.frameStyle==='none') return;
    g.save();g.strokeStyle=state.paperColor==='black'?'#f4e6c8':'#171512';
    if(state.frameStyle==='poster'){
      g.lineWidth=size*.008;g.strokeRect(size*.045,size*.045,size*.91,size*.91);
      g.lineWidth=size*.002;g.strokeRect(size*.061,size*.061,size*.878,size*.878);
    }else if(state.frameStyle==='badge'){
      g.lineWidth=size*.009;g.beginPath();g.arc(size*.5,size*.48,size*.405,0,Math.PI*2);g.stroke();
      g.lineWidth=size*.0025;g.beginPath();g.arc(size*.5,size*.48,size*.425,0,Math.PI*2);g.stroke();
    }
    g.restore();
  }

  function drawCaption(g,size){
    if(!state.showCaption||!state.caption.trim()) return;
    const dark=state.paperColor==='black';
    const y=size*.915;
    g.save();g.textAlign='center';g.textBaseline='middle';g.font=`900 ${Math.round(size*.038)}px Arial Narrow, Arial, sans-serif`;
    const text=state.caption.trim().toUpperCase();
    const measurement=g.measureText(text);const pad=size*.026;
    g.fillStyle=dark?'#f1dfbd':'#171512';roundRect(g,size*.5-measurement.width/2-pad,y-size*.035,measurement.width+pad*2,size*.07,size*.015);g.fill();
    g.fillStyle=dark?'#171512':'#f5e7ca';g.fillText(text,size*.5,y);g.restore();
  }

  function applyTreatment(g,size){
    if(state.preset==='noir'){
      g.save();g.globalCompositeOperation='saturation';g.fillStyle='#111';g.fillRect(0,0,size,size);g.restore();
      g.save();g.globalCompositeOperation='multiply';g.globalAlpha=.14;g.fillStyle='#111';g.fillRect(0,0,size,size);g.restore();
    }
    if(state.preset==='thermal'){
      g.save();g.globalCompositeOperation='saturation';g.fillStyle='#111';g.fillRect(0,0,size,size);g.restore();
      g.save();g.globalCompositeOperation='overlay';g.globalAlpha=.23;g.fillStyle='#111';g.fillRect(0,0,size,size);g.restore();
    }
  }

  function compositeLayerItems(snapshot=state){
    const order=['horns','bases','patterns','eyes','noses','mouths','extras'];
    return order.map(categoryId=>({categoryId,item:currentPart(categoryId,snapshot)})).filter(layer=>layer.item&&!(layer.item.tags||[]).includes('none'));
  }
  function slotFor(base,categoryId){
    if(categoryId==='bases') return {x:0,y:0,scale:1,rotation:0};
    return (base&&base.slots&&base.slots[categoryId])||{x:0,y:0,scale:1,rotation:0};
  }

  async function loadRenderLayers(){
    if(state.mode==='faces'){
      const asset=currentAsset();
      return asset?[{categoryId:'face',item:asset,image:await loadSvgImage(asset)}]:[];
    }
    const layers=compositeLayerItems();
    const images=await Promise.all(layers.map(layer=>loadSvgImage(layer.item)));
    return layers.map((layer,index)=>({...layer,image:images[index]}));
  }

  function drawLoadedLayers(g,size,layers){
    const drawSize=size*.74;
    g.save();
    g.translate(size*.5+state.x*size*.22,size*.49+state.y*size*.22);
    g.rotate(state.rotation*Math.PI/180);
    g.scale(state.flipped?-state.scale:state.scale,state.scale);
    if(state.mode==='faces'){
      const layer=layers[0];
      if(layer) g.drawImage(layer.image,-drawSize/2,-drawSize/2,drawSize,drawSize);
    }else{
      const base=currentBase();
      layers.forEach(layer=>{
        const slot=slotFor(base,layer.categoryId);
        g.save();
        g.translate((slot.x||0)*drawSize,(slot.y||0)*drawSize);
        g.rotate((slot.rotation||0)*Math.PI/180);
        g.scale(slot.scale||1,slot.scale||1);
        g.drawImage(layer.image,-drawSize/2,-drawSize/2,drawSize,drawSize);
        g.restore();
      });
    }
    g.restore();
  }

  async function render(targetCanvas=canvas,forExport=false){
    const ownToken=targetCanvas===canvas?++renderToken:null;
    try{
      const layers=await loadRenderLayers();
      if(ownToken&&ownToken!==renderToken) return;
      const g=targetCanvas.getContext('2d');const size=targetCanvas.width;
      g.clearRect(0,0,size,size);drawPaper(g,size,forExport);drawFrame(g,size);drawLoadedLayers(g,size,layers);applyTreatment(g,size);drawCaption(g,size);
    }catch(error){
      const g=targetCanvas.getContext('2d');const size=targetCanvas.width;
      g.clearRect(0,0,size,size);drawPaper(g,size,forExport);g.fillStyle='#171512';g.font='700 24px Arial';g.textAlign='center';g.fillText('Authored asset failed to load',size/2,size/2);console.error(error);
    }
  }

  function shadeHex(hex,amount){
    const number=parseInt(hex.slice(1),16);
    const r=Math.max(0,Math.min(255,(number>>16)+amount));
    const green=Math.max(0,Math.min(255,((number>>8)&255)+amount));
    const blue=Math.max(0,Math.min(255,(number&255)+amount));
    return '#'+(1<<24|r<<16|green<<8|blue).toString(16).slice(1);
  }
  function roundRect(g,x,y,width,height,radius){
    g.beginPath();g.moveTo(x+radius,y);g.arcTo(x+width,y,x+width,y+height,radius);g.arcTo(x+width,y+height,x,y+height,radius);g.arcTo(x,y+height,x,y,radius);g.arcTo(x,y,x+width,y,radius);g.closePath();
  }
  function hashString(value){let hash=2166136261;for(let i=0;i<value.length;i++){hash^=value.charCodeAt(i);hash=Math.imul(hash,16777619)}return hash>>>0}
  function mulberry32(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

  function randomFrom(categoryId,allowNone=false){
    const list=(parts[categoryId]||[]).filter(part=>allowNone||(part.tags||[]).includes('none')===false);
    return list[Math.floor(Math.random()*list.length)] || (parts[categoryId]||[])[0];
  }
  function shuffle(){
    if(state.mode==='faces'){
      const pool=filteredAssets().length?filteredAssets():assets;
      let next=pool[Math.floor(Math.random()*pool.length)];
      if(pool.length>1&&next.id===state.assetId) next=pool[(pool.indexOf(next)+1)%pool.length];
      if(next) selectAsset(next.id);
      return;
    }
    const base=randomFrom('bases');
    const eye=randomFrom('eyes');
    const nose=randomFrom('noses',Math.random()<.12);
    const mouth=randomFrom('mouths');
    const horn=randomFrom('horns',Math.random()<.18);
    const pattern=randomFrom('patterns',Math.random()<.16);
    const extra=randomFrom('extras',Math.random()<.3);
    applyState({baseId:base.id,eyeId:eye.id,noseId:nose.id,mouthId:mouth.id,hornId:horn.id,patternId:pattern.id,extraId:extra.id,scale:1,rotation:0,x:0,y:0,flipped:false,caption:'MIXED MONSTER'});
  }

  function fit(){ applyState({scale:1,rotation:0,x:0,y:0,flipped:false}); }
  function saveVariation(){
    variations.unshift({...JSON.parse(JSON.stringify(state)),savedAt:Date.now()});
    variations=variations.slice(0,8);renderVariations();
  }

  function compositeMarkup(snapshot){
    const base=currentBase(snapshot);
    const layers=compositeLayerItems(snapshot).map(layer=>{
      const slot=slotFor(base,layer.categoryId);
      const transform=`translate(${(slot.x||0)*100}%,${(slot.y||0)*100}%) scale(${slot.scale||1}) rotate(${slot.rotation||0}deg)`;
      return `<span class="composite-layer" style="transform:${transform}">${layer.item.svg}</span>`;
    }).join('');
    const outer=`rotate(${Number(snapshot.rotation)||0}deg) scaleX(${snapshot.flipped?-1:1})`;
    return `<span class="asset-art composite-stack" style="transform:${outer}">${layers}</span>`;
  }

  function variationPreviewMarkup(variation){
    if(variation.mode==='builder') return compositeMarkup(variation);
    const asset=assets.find(item=>item.id===variation.assetId)||assets[0];
    return asset?assetArtMarkup(asset):'<span class="asset-art"></span>';
  }

  function renderVariations(){
    const grid=$('variationGrid');grid.innerHTML='';
    if(!variations.length){grid.innerHTML='<div class="empty-variation">Save a composition to compare it here</div>';return}
    variations.forEach((variation,index)=>{
      const button=document.createElement('button');
      button.innerHTML=`${variationPreviewMarkup(variation)}<span class="version-label">${variation.mode==='builder'?'Build':'Face'} ${String(variations.length-index).padStart(2,'0')}</span>`;
      button.onclick=()=>{pushHistory();state={...variation};delete state.savedAt;syncControls();renderModeSwitch();renderFilters();renderCategories();renderLibrary();render()};
      grid.appendChild(button);
    });
  }

  function compactPart(part){
    if(!part) return null;
    const {svg,slots,...metadata}=part;
    return metadata;
  }
  function recipeMetadata(){
    if(state.mode==='faces') return {type:'complete-face',asset:compactPart(currentAsset())};
    return {type:'authored-parts',parts:Object.fromEntries(categories.map(category=>[category.id,compactPart(currentPart(category.id))]))};
  }

  async function exportPng(){
    const exportCanvas=document.createElement('canvas');exportCanvas.width=3600;exportCanvas.height=3600;
    await render(exportCanvas,true);
    exportCanvas.toBlob(async blob=>{
      if(!blob) return;
      const metadata={app:'Monster Face Builder',version:5,mode:state.mode,exportedAt:new Date().toISOString(),recipe:recipeMetadata(),state};
      const enriched=await window.PngMetadata.embedJsonInPng(blob,metadata);
      const url=URL.createObjectURL(enriched);const link=document.createElement('a');
      link.href=url;link.download=`monster-${state.mode}-${Date.now()}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    },'image/png');
  }

  function bindControls(){
    $('shuffleBtn').onclick=shuffle;$('shufflePrimary').onclick=shuffle;
    $('resetBtn').onclick=()=>applyState({...defaults,mode:state.mode});
    $('favoriteBtn').onclick=toggleFavorite;$('exportBtn').onclick=exportPng;
    $('undoBtn').onclick=undo;$('redoBtn').onclick=redo;
    $('flipBtn').onclick=()=>applyState({flipped:!state.flipped});$('fitBtn').onclick=fit;
    $('saveVariationBtn').onclick=saveVariation;$('backgroundBtn').onclick=()=>applyState({background:!state.background});

    document.querySelectorAll('.mode-btn').forEach(button=>{
      button.onclick=()=>applyState({mode:button.dataset.mode});
    });

    $('scale').oninput=event=>{
      if(!event.target.dataset.started){pushHistory();event.target.dataset.started='1'}
      state.scale=Number(event.target.value)/100;$('scaleOut').textContent=event.target.value+'%';render();
    };
    $('scale').onchange=event=>delete event.target.dataset.started;
    $('rotation').oninput=event=>{
      if(!event.target.dataset.started){pushHistory();event.target.dataset.started='1'}
      state.rotation=Number(event.target.value);$('rotationOut').textContent=event.target.value+'°';render();
    };
    $('rotation').onchange=event=>delete event.target.dataset.started;

    $('frameStyle').onchange=event=>applyState({frameStyle:event.target.value});
    $('paperColor').onchange=event=>applyState({paperColor:event.target.value});
    $('caption').onchange=event=>applyState({caption:event.target.value});
    $('caption').oninput=event=>{state.caption=event.target.value;render()};
    $('captionToggle').onchange=event=>applyState({showCaption:event.target.checked});
    $('transparentToggle').onchange=event=>applyState({transparent:event.target.checked});
    document.querySelectorAll('.preset').forEach(button=>button.onclick=()=>applyState({preset:button.dataset.preset}));

    const wrap=$('canvasWrap');
    wrap.addEventListener('pointerdown',event=>{
      dragging=true;wrap.setPointerCapture(event.pointerId);dragStart={px:event.clientX,py:event.clientY,x:state.x,y:state.y};pushHistory();
    });
    wrap.addEventListener('pointermove',event=>{
      if(!dragging) return;
      const rect=wrap.getBoundingClientRect();
      state.x=Math.max(-1,Math.min(1,dragStart.x+(event.clientX-dragStart.px)/rect.width*2));
      state.y=Math.max(-1,Math.min(1,dragStart.y+(event.clientY-dragStart.py)/rect.height*2));render();
    });
    const endDrag=()=>{dragging=false;dragStart=null};
    wrap.addEventListener('pointerup',endDrag);wrap.addEventListener('pointercancel',endDrag);
  }

  async function init(){
    renderModeSwitch();renderFilters();renderCategories();renderLibrary();renderVariations();bindControls();syncControls();
    const preload=[...assets.slice(0,2),...compositeLayerItems().map(layer=>layer.item)].filter(Boolean);
    await Promise.all(preload.map(loadSvgImage));
    render();
  }

  init();
