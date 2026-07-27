(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.MONSTER_RECIPE_DIRECTOR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const VERSION=1;
  const PART_KEYS=['baseId','eyeId','noseId','mouthId','hornId','patternId','extraId','finishId'];
  const TRANSFORM_KEYS=['eyes','nose','mouth','horns','pattern','extra','finish'];
  const SCORE_KEYS=['silhouette','expression','junctions','thumbnail','finish','overall'];
  const round=n=>Math.round(Number(n||0)*10000)/10000;
  const stable=(value)=>{
    if(Array.isArray(value)) return value.map(stable);
    if(value&&typeof value==='object') return Object.keys(value).sort().reduce((out,key)=>(out[key]=stable(value[key]),out),{});
    return value;
  };
  const normalizeTransform=(value={})=>({x:round(value.x),y:round(value.y),scale:round(value.scale==null?1:value.scale),rotation:round(value.rotation)});
  function normalizeRecipe(input={}){
    const recipe={
      schemaVersion:VERSION,
      id:String(input.id||'untitled-recipe'),
      name:String(input.name||'Untitled recipe'),
      status:input.status==='approved'?'approved':'draft',
      flipped:Boolean(input.flipped),
      background:['cream','white','black','transparent'].includes(input.background)?input.background:'cream',
      expressionTags:[...new Set((input.expressionTags||[]).map(String))].sort(),
      notes:String(input.notes||''),
      parts:{},transforms:{},junctions:{},annotations:[],review:{scores:{}}
    };
    const sourceParts=input.parts||input;
    PART_KEYS.forEach(key=>{if(sourceParts[key]) recipe.parts[key]=String(sourceParts[key]);});
    TRANSFORM_KEYS.forEach(key=>{recipe.transforms[key]=normalizeTransform((input.transforms||{})[key]);});
    const junctions=input.junctions||input.pairJunctions||{};
    if(junctions.mouth) recipe.junctions.mouth=String(junctions.mouth);
    if(junctions.horns) recipe.junctions.horns=String(junctions.horns);
    recipe.annotations=(input.annotations||[]).map((pin,index)=>({id:String(pin.id||`pin-${index+1}`),x:round(pin.x),y:round(pin.y),note:String(pin.note||'')})).sort((a,b)=>a.id.localeCompare(b.id));
    const review=input.review||{};
    SCORE_KEYS.forEach(key=>{const n=Number((review.scores||{})[key]);recipe.review.scores[key]=Number.isFinite(n)?Math.max(1,Math.min(5,Math.round(n))):3;});
    recipe.review.reviewer=String(review.reviewer||'');
    recipe.review.notes=String(review.notes||'');
    return stable(recipe);
  }
  function validateRecipe(input,context={}){
    const recipe=normalizeRecipe(input); const errors=[];
    const known=context.knownIds||{};
    Object.entries(recipe.parts).forEach(([key,id])=>{const family=known[key];if(family&& !family.includes(id)) errors.push(`Unsupported ${key}: ${id}`);});
    const c=context.compatibility;
    if(c&&recipe.parts.baseId){
      [['eyeId','eyes'],['noseId','noses'],['mouthId','mouths'],['hornId','horns']].forEach(([key,family])=>{
        const id=recipe.parts[key]; if(id&&c.status(recipe.parts.baseId,family,id)==='blocked') errors.push(`Blocked combination: ${recipe.parts.baseId} + ${id}`);
      });
    }
    const expectedMouth=recipe.parts.baseId&&recipe.parts.mouthId?`${recipe.parts.baseId}|${recipe.parts.mouthId}`:null;
    const expectedHorns=recipe.parts.baseId&&recipe.parts.hornId?`${recipe.parts.baseId}|${recipe.parts.hornId}`:null;
    if(recipe.junctions.mouth&&recipe.junctions.mouth!==expectedMouth) errors.push(`Mouth junction does not match selected pair: ${recipe.junctions.mouth}`);
    if(recipe.junctions.horns&&recipe.junctions.horns!==expectedHorns) errors.push(`Horn junction does not match selected pair: ${recipe.junctions.horns}`);
    return {valid:errors.length===0,errors,recipe};
  }
  function serializeRecipe(input){return JSON.stringify(normalizeRecipe(input),null,2)+'\n';}
  function importRecipe(text,context){const parsed=typeof text==='string'?JSON.parse(text):text;return validateRecipe(parsed,context);}
  return {VERSION,PART_KEYS,TRANSFORM_KEYS,SCORE_KEYS,normalizeRecipe,validateRecipe,serializeRecipe,importRecipe};
});