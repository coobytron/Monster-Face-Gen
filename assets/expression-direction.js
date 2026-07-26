(function(){
  const vocabulary=['sleepy','uneasy','feral','goofy','stern','startled'];

  const eyes={
    'eye-none':[],
    'eye-cyclops':['stern','uneasy'],
    'eye-droopy':['sleepy','uneasy'],
    'eye-beady':['stern','goofy'],
    'eye-wide':['startled','goofy'],
    'eye-triple':['startled','uneasy'],
    'eye-stacked':['startled','goofy'],
    'eye-crossed':['goofy','uneasy'],
    'eye-sleepy':['sleepy','stern'],
    'eye-wild':['feral','startled']
  };

  const mouths={
    'mouth-none':[],
    'mouth-grin':['goofy','stern'],
    'mouth-gummy':['sleepy','goofy'],
    'mouth-fangs':['feral','stern'],
    'mouth-jagged':['feral','uneasy'],
    'mouth-tongue':['goofy','startled'],
    'mouth-buck':['goofy','uneasy'],
    'mouth-roar':['feral','startled'],
    'mouth-gapped':['sleepy','uneasy']
  };

  const approvedPairs=[
    ['eye-droopy','mouth-gummy','sleepy'],
    ['eye-sleepy','mouth-gapped','sleepy'],
    ['eye-triple','mouth-gummy','uneasy'],
    ['eye-crossed','mouth-buck','goofy'],
    ['eye-wide','mouth-tongue','goofy'],
    ['eye-wild','mouth-jagged','feral'],
    ['eye-wild','mouth-roar','feral'],
    ['eye-beady','mouth-fangs','stern'],
    ['eye-cyclops','mouth-grin','stern'],
    ['eye-wide','mouth-roar','startled'],
    ['eye-stacked','mouth-tongue','startled'],
    ['eye-triple','mouth-gapped','uneasy']
  ].map(([eyeId,mouthId,expression])=>({eyeId,mouthId,expression,status:'approved'}));

  const recipeExpressions={
    'bog-cyclops-grin':'stern',
    'bog-sleepy-gummy':'sleepy',
    'fuzz-buck':'goofy',
    'fuzz-fanged':'stern',
    'skull-oracle':'sleepy',
    'skull-jagged':'uneasy',
    'imp-roar':'startled',
    'imp-bat':'goofy',
    'imp-bent-grin':'feral',
    'moss-grinner':'stern',
    'moss-tongue':'startled',
    'moss-gummy':'sleepy',
    'blue-worry':'uneasy',
    'blue-tangle':'goofy',
    'blue-wild':'feral',
    'bog-gapped':'uneasy'
  };

  function tagsFor(kind,id){
    const map=kind==='eyes'?eyes:kind==='mouths'?mouths:null;
    return map&&map[id]?[...map[id]]:[];
  }

  function sharedTags(eyeId,mouthId){
    const mouthTags=new Set(tagsFor('mouths',mouthId));
    return tagsFor('eyes',eyeId).filter(tag=>mouthTags.has(tag));
  }

  function pairStatus(eyeId,mouthId){
    const approved=approvedPairs.find(pair=>pair.eyeId===eyeId&&pair.mouthId===mouthId);
    if(approved) return {status:'approved',expression:approved.expression};
    const shared=sharedTags(eyeId,mouthId);
    return shared.length?{status:'acceptable',expression:shared[0]}:{status:'neutral',expression:null};
  }

  function validateRecipe(recipe){
    const expected=recipeExpressions[recipe.id];
    if(!expected) return false;
    const eyeTags=tagsFor('eyes',recipe.eyeId);
    const mouthTags=tagsFor('mouths',recipe.mouthId);
    return eyeTags.includes(expected)||mouthTags.includes(expected);
  }

  window.MONSTER_EXPRESSION_DIRECTION={
    version:8,
    vocabulary,
    eyes,
    mouths,
    approvedPairs,
    recipeExpressions,
    tagsFor,
    sharedTags,
    pairStatus,
    validateRecipe
  };
})();
