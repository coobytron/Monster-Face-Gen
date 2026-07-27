const C=window.MONSTER_RECIPE_DIRECTOR;
const compatibility=window.MONSTER_COMPATIBILITY;
const familyMap={baseId:'bases',eyeId:'eyes',noseId:'noses',mouthId:'mouths',hornId:'horns',patternId:'patterns',extraId:'extras',finishId:'finishes'};
const transformMap={eyeId:'eyes',noseId:'nose',mouthId:'mouth',hornId:'horns',patternId:'pattern',extraId:'extra',finishId:'finish'};
const state=C.normalizeRecipe({});
let selectedTransform='eyes';
function arrays(){
 const p=window.MONSTER_PARTS||{};
 return {bases:p.bases||p.base||[],eyes:p.eyes||[],noses:p.noses||[],mouths:p.mouths||[],horns:p.horns||[],patterns:p.patterns||[],extras:p.extras||[],finishes:window.MONSTER_FINISHES||[]};
}
function idOf(a){return a.id||a.assetId||a.stableId}
function labelOf(a){return a.name||a.label||idOf(a)}
function svgOf(a){return a.svg||a.markup||a.content||''}
function lookup(family,id){return (arrays()[family]||[]).find(a=>idOf(a)===id)}
function knownIds(){const out={};Object.entries(familyMap).forEach(([key,f])=>out[key]=(arrays()[f]||[]).map(idOf).filter(Boolean));return out}
function fromRecipe(r){
 const next=C.normalizeRecipe({...r,parts:r.parts||r});Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,next);
 document.querySelector('#tags').value=state.expressionTags.join(', ');document.querySelector('#notes').value=state.notes;document.querySelector('#background').value=state.background;
 syncTransform();render();
}
function loadHero(){const r=compatibility.recipes.find(x=>x.id==='bog-cyclops-grin')||compatibility.recipes[0];fromRecipe({...r,parts:r,expressionTags:['goofy'],junctions:r.pairJunctions||{},review:{scores:{silhouette:4,expression:4,junctions:4,thumbnail:4,finish:4,overall:4}}});}
function populate(){
 const rs=document.querySelector('#recipeSelect');rs.innerHTML=compatibility.recipes.map(r=>`<option value="${r.id}">${r.name}</option>`).join('');rs.onchange=()=>fromRecipe(compatibility.recipes.find(r=>r.id===rs.value));
 const wrap=document.querySelector('#partControls');wrap.innerHTML='';Object.entries(familyMap).forEach(([key,f])=>{const row=document.createElement('div');row.className='partRow';const sel=document.createElement('select');sel.dataset.key=key;sel.innerHTML=(arrays()[f]||[]).map(a=>`<option value="${idOf(a)}">${labelOf(a)}</option>`).join('');sel.onchange=()=>{state.parts[key]=sel.value;autoJunctions();render()};row.innerHTML=`<b>${key.replace('Id','')}</b>`;row.append(sel);wrap.append(row)});
 const scoreWrap=document.querySelector('#scores');scoreWrap.innerHTML='<h2>Review scores (1–5)</h2>';C.SCORE_KEYS.forEach(key=>{const row=document.createElement('label');row.className='scoreRow';row.innerHTML=`<span>${key}</span><input type="number" min="1" max="5" value="3" data-score="${key}">`;row.querySelector('input').oninput=e=>{state.review.scores[key]=Number(e.target.value)};scoreWrap.append(row)});
 document.querySelector('#transformTarget').onchange=e=>{selectedTransform=e.target.value;syncTransform()};['tx','ty','ts','tr'].forEach(id=>document.querySelector('#'+id).oninput=updateTransform);
 document.querySelector('#tags').oninput=e=>state.expressionTags=e.target.value.split(',').map(s=>s.trim()).filter(Boolean);document.querySelector('#notes').oninput=e=>state.notes=e.target.value;
 document.querySelector('#background').onchange=e=>{state.background=e.target.value;render()};document.querySelector('#flipBtn').onclick=()=>{state.flipped=!state.flipped;render()};document.querySelector('#pinBtn').onclick=addPin;
 document.querySelector('#loadHero').onclick=loadHero;document.querySelector('#exportBtn').onclick=exportJSON;document.querySelector('#importBtn').onclick=()=>document.querySelector('#fileInput').click();document.querySelector('#fileInput').onchange=importJSON;
}
function autoJunctions(){if(state.parts.baseId&&state.parts.mouthId)state.junctions.mouth=`${state.parts.baseId}|${state.parts.mouthId}`;if(state.parts.baseId&&state.parts.hornId)state.junctions.horns=`${state.parts.baseId}|${state.parts.hornId}`}
function syncTransform(){const t=state.transforms[selectedTransform]||{x:0,y:0,scale:1,rotation:0};[['tx','x'],['ty','y'],['ts','scale'],['tr','rotation']].forEach(([id,k])=>document.querySelector('#'+id).value=t[k]);outputs()}
function updateTransform(){const t=state.transforms[selectedTransform];t.x=+document.querySelector('#tx').value;t.y=+document.querySelector('#ty').value;t.scale=+document.querySelector('#ts').value;t.rotation=+document.querySelector('#tr').value;outputs();render()}
function outputs(){document.querySelector('#txOut').textContent=document.querySelector('#tx').value;document.querySelector('#tyOut').textContent=document.querySelector('#ty').value;document.querySelector('#tsOut').textContent=document.querySelector('#ts').value;document.querySelector('#trOut').textContent=document.querySelector('#tr').value+'°'}
function transformFor(key){const t=state.transforms[transformMap[key]]||{x:0,y:0,scale:1,rotation:0};return `translate(${t.x*1000} ${t.y*1000}) rotate(${t.rotation} 800 800) translate(${800*(1-t.scale)} ${800*(1-t.scale)}) scale(${t.scale})`}
function compose(){const order=['hornId','baseId','patternId','eyeId','noseId','mouthId','extraId','finishId'];let body='';order.forEach(key=>{const a=lookup(familyMap[key],state.parts[key]);if(!a)return;const raw=svgOf(a);if(!raw)return;const inner=raw.replace(/^.*?<svg[^>]*>/s,'').replace(/<\/svg>.*$/s,'');body+=`<g data-stable-id="${idOf(a)}" transform="${transformFor(key)}">${inner}</g>`});return `<svg viewBox="0 0 1600 1600" xmlns="http://www.w3.org/2000/svg"><g transform="${state.flipped?'translate(1600 0) scale(-1 1)':''}">${body}</g></svg>`}
function render(){
 document.querySelectorAll('[data-key]').forEach(s=>{if(state.parts[s.dataset.key])s.value=state.parts[s.dataset.key]});
 const svg=compose();document.querySelector('#art').innerHTML=svg;document.querySelector('#thumbnail').innerHTML=svg;const stage=document.querySelector('#stage');stage.className='stage '+state.background;
 const result=C.validateRecipe(state,{knownIds:knownIds(),compatibility});const badge=document.querySelector('#compatibility');badge.className='status '+(result.valid?'approved':'blocked');badge.textContent=result.valid?'Save-ready · no blocked pairs':result.errors[0];
 document.querySelector('#inspector').textContent=JSON.stringify({parts:state.parts,transforms:state.transforms,junctions:state.junctions,flipped:state.flipped,background:state.background},null,2);
 document.querySelector('#pins').innerHTML=state.annotations.map((p,i)=>`<button class="pin" style="left:${p.x*100}%;top:${p.y*100}%" title="${p.note.replace(/"/g,'&quot;')}">${i+1}</button>`).join('');
}
function addPin(){const note=prompt('Reviewer annotation');if(note===null)return;state.annotations.push({id:`pin-${state.annotations.length+1}`,x:.5,y:.5,note});render()}
function exportJSON(){const result=C.validateRecipe(state,{knownIds:knownIds(),compatibility});if(!result.valid){toast(result.errors.join(' · '));return}const blob=new Blob([C.serializeRecipe(state)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${state.id}.recipe.json`;a.click();URL.revokeObjectURL(a.href);toast('Deterministic recipe JSON exported')}
async function importJSON(e){const file=e.target.files[0];if(!file)return;try{const result=C.importRecipe(await file.text(),{knownIds:knownIds(),compatibility});if(!result.valid)throw new Error(result.errors.join(' · '));fromRecipe(result.recipe);toast('Recipe imported and validated')}catch(err){toast(err.message)}e.target.value=''}
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
async function mountTldraw(){try{const React=await import('https://esm.sh/react@18.3.1');const {createRoot}=await import('https://esm.sh/react-dom@18.3.1/client');const {Tldraw}=await import('https://esm.sh/tldraw@3.15.3?external=react,react-dom');createRoot(document.querySelector('#tldrawMount')).render(React.createElement(Tldraw,{hideUi:true,onMount:editor=>{editor.setCurrentTool('select');editor.updateInstanceState({isReadonly:true})}}));}catch(e){document.querySelector('#tldrawMount').className='annotationFallback';console.info('tldraw shell unavailable; recipe controls remain functional',e)}}
populate();loadHero();mountTldraw();