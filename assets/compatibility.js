(function(){
  const states=['approved','acceptable','blocked'];
  const matrix={
    'base-bog':{
      eyes:{approved:['eye-cyclops','eye-droopy','eye-wide','eye-wild'],acceptable:['eye-beady','eye-triple','eye-stacked','eye-crossed','eye-sleepy','eye-none'],blocked:[]},
      noses:{approved:['nose-button','nose-piggy','nose-warty','nose-none'],acceptable:['nose-trihole','nose-elephant','nose-hook'],blocked:['nose-skeletal','nose-beak']},
      mouths:{approved:['mouth-grin','mouth-gummy','mouth-tongue','mouth-gapped'],acceptable:['mouth-fangs','mouth-jagged','mouth-buck','mouth-none'],blocked:['mouth-roar']},
      horns:{approved:['horn-curved','horn-nubs','horn-tufted','horn-none'],acceptable:['horn-spiky','horn-bent','horn-rams'],blocked:['horn-long','horn-bat']}
    },
    'base-fuzz':{
      eyes:{approved:['eye-droopy','eye-beady','eye-wide','eye-sleepy'],acceptable:['eye-cyclops','eye-triple','eye-stacked','eye-crossed','eye-wild','eye-none'],blocked:[]},
      noses:{approved:['nose-button','nose-piggy','nose-hook','nose-none'],acceptable:['nose-beak','nose-warty','nose-trihole'],blocked:['nose-skeletal','nose-elephant']},
      mouths:{approved:['mouth-gummy','mouth-fangs','mouth-buck','mouth-gapped'],acceptable:['mouth-grin','mouth-jagged','mouth-tongue','mouth-none'],blocked:['mouth-roar']},
      horns:{approved:['horn-tufted','horn-nubs','horn-bent','horn-none'],acceptable:['horn-curved','horn-spiky','horn-bat'],blocked:['horn-long','horn-rams']}
    },
    'base-skull':{
      eyes:{approved:['eye-beady','eye-sleepy','eye-crossed','eye-wild'],acceptable:['eye-cyclops','eye-droopy','eye-wide','eye-stacked','eye-none'],blocked:['eye-triple']},
      noses:{approved:['nose-skeletal','nose-hook','nose-none'],acceptable:['nose-beak','nose-button','nose-warty'],blocked:['nose-piggy','nose-trihole','nose-elephant']},
      mouths:{approved:['mouth-fangs','mouth-jagged','mouth-gapped','mouth-none'],acceptable:['mouth-grin','mouth-gummy','mouth-buck'],blocked:['mouth-tongue','mouth-roar']},
      horns:{approved:['horn-long','horn-bent','horn-nubs','horn-none'],acceptable:['horn-curved','horn-spiky','horn-rams'],blocked:['horn-bat','horn-tufted']}
    },
    'base-imp':{
      eyes:{approved:['eye-wide','eye-beady','eye-crossed','eye-wild'],acceptable:['eye-cyclops','eye-droopy','eye-triple','eye-stacked','eye-sleepy','eye-none'],blocked:[]},
      noses:{approved:['nose-piggy','nose-beak','nose-hook','nose-none'],acceptable:['nose-button','nose-trihole','nose-warty'],blocked:['nose-skeletal','nose-elephant']},
      mouths:{approved:['mouth-fangs','mouth-jagged','mouth-roar','mouth-gapped'],acceptable:['mouth-grin','mouth-gummy','mouth-tongue','mouth-buck','mouth-none'],blocked:[]},
      horns:{approved:['horn-spiky','horn-long','horn-bat','horn-bent'],acceptable:['horn-curved','horn-nubs','horn-rams','horn-none'],blocked:['horn-tufted']}
    },
    'base-moss':{
      eyes:{approved:['eye-cyclops','eye-droopy','eye-triple','eye-sleepy'],acceptable:['eye-beady','eye-wide','eye-stacked','eye-crossed','eye-wild','eye-none'],blocked:[]},
      noses:{approved:['nose-warty','nose-trihole','nose-button','nose-none'],acceptable:['nose-piggy','nose-elephant','nose-hook'],blocked:['nose-skeletal','nose-beak']},
      mouths:{approved:['mouth-grin','mouth-gummy','mouth-tongue','mouth-buck'],acceptable:['mouth-fangs','mouth-jagged','mouth-gapped','mouth-none'],blocked:['mouth-roar']},
      horns:{approved:['horn-rams','horn-curved','horn-nubs','horn-none'],acceptable:['horn-spiky','horn-tufted','horn-bent'],blocked:['horn-long','horn-bat']}
    },
    'base-blue':{
      eyes:{approved:['eye-triple','eye-stacked','eye-wide','eye-wild'],acceptable:['eye-cyclops','eye-droopy','eye-beady','eye-crossed','eye-sleepy','eye-none'],blocked:[]},
      noses:{approved:['nose-elephant','nose-trihole','nose-button','nose-none'],acceptable:['nose-piggy','nose-warty','nose-hook'],blocked:['nose-skeletal','nose-beak']},
      mouths:{approved:['mouth-tongue','mouth-gummy','mouth-gapped','mouth-grin'],acceptable:['mouth-fangs','mouth-jagged','mouth-buck','mouth-none'],blocked:['mouth-roar']},
      horns:{approved:['horn-bat','horn-tufted','horn-nubs','horn-none'],acceptable:['horn-curved','horn-spiky','horn-bent'],blocked:['horn-long','horn-rams']}
    }
  };

  const placementOverrides={
    'base-bog|mouth-grin':{x:0,y:0.012,scale:0.96,rotation:0},
    'base-bog|mouth-gummy':{x:0,y:0.026,scale:0.91,rotation:0},
    'base-fuzz|mouth-fangs':{x:0,y:0.018,scale:0.86,rotation:0},
    'base-fuzz|mouth-buck':{x:0,y:0.008,scale:0.88,rotation:0},
    'base-skull|mouth-jagged':{x:0,y:0.014,scale:0.82,rotation:0},
    'base-skull|mouth-gapped':{x:0,y:0.02,scale:0.84,rotation:0},
    'base-imp|mouth-roar':{x:0,y:0.016,scale:0.92,rotation:0},
    'base-imp|horn-bat':{x:0,y:0.01,scale:0.94,rotation:0},
    'base-moss|mouth-grin':{x:0,y:0.018,scale:0.94,rotation:0},
    'base-moss|horn-rams':{x:0,y:0.008,scale:0.92,rotation:0},
    'base-blue|mouth-tongue':{x:0,y:0.018,scale:0.9,rotation:0},
    'base-blue|horn-bat':{x:0,y:0.012,scale:0.91,rotation:0},
    'base-skull|eye-sleepy':{x:0,y:-0.012,scale:0.92,rotation:0},
    'base-blue|eye-triple':{x:0,y:-0.015,scale:0.94,rotation:0},
    'base-fuzz|nose-hook':{x:0,y:0.005,scale:0.9,rotation:0},
    'base-imp|nose-beak':{x:0,y:0.004,scale:0.92,rotation:0}
  };

  const recipes=[
    ['bog-cyclops-grin','Bog Cyclops Grin','base-bog','eye-cyclops','nose-button','mouth-grin','horn-curved','pattern-spots','extra-earring'],
    ['bog-sleepy-gummy','Sleepy Bog','base-bog','eye-droopy','nose-warty','mouth-gummy','horn-nubs','pattern-pores','extra-slime'],
    ['fuzz-buck','Fuzzy Bucktooth','base-fuzz','eye-wide','nose-button','mouth-buck','horn-tufted','pattern-fur','extra-bandage'],
    ['fuzz-fanged','Fanged Fuzz','base-fuzz','eye-sleepy','nose-hook','mouth-fangs','horn-bent','pattern-stripes','extra-scar'],
    ['skull-oracle','Bone Oracle','base-skull','eye-sleepy','nose-skeletal','mouth-gapped','horn-long','pattern-cracked','extra-earring'],
    ['skull-jagged','Jagged Relic','base-skull','eye-beady','nose-hook','mouth-jagged','horn-nubs','pattern-pores','extra-patch'],
    ['imp-roar','Boiler Roar','base-imp','eye-wide','nose-piggy','mouth-roar','horn-spiky','pattern-freckles','extra-spikes'],
    ['imp-bat','Bat Imp','base-imp','eye-crossed','nose-beak','mouth-fangs','horn-bat','pattern-stripes','extra-scar'],
    ['imp-bent-grin','Bent Imp','base-imp','eye-wild','nose-hook','mouth-gapped','horn-bent','pattern-cracked','extra-bandage'],
    ['moss-grinner','Moss Grinner','base-moss','eye-cyclops','nose-warty','mouth-grin','horn-rams','pattern-warts','extra-bumps'],
    ['moss-tongue','Moss Tongue','base-moss','eye-triple','nose-trihole','mouth-tongue','horn-curved','pattern-spots','extra-slime'],
    ['moss-gummy','Old Moss','base-moss','eye-droopy','nose-button','mouth-gummy','horn-nubs','pattern-pores','extra-earring'],
    ['blue-worry','Blue Worrywart','base-blue','eye-triple','nose-elephant','mouth-gummy','horn-tufted','pattern-freckles','extra-snot'],
    ['blue-tangle','Tongue Tangle','base-blue','eye-stacked','nose-trihole','mouth-tongue','horn-bat','pattern-spots','extra-slime'],
    ['blue-wild','Wild Blue','base-blue','eye-wild','nose-button','mouth-gapped','horn-nubs','pattern-scales','extra-spikes'],
    ['bog-gapped','Bog Gapped','base-bog','eye-wide','nose-piggy','mouth-gapped','horn-tufted','pattern-warts','extra-patch']
  ].map(([id,name,baseId,eyeId,noseId,mouthId,hornId,patternId,extraId])=>({id,name,baseId,eyeId,noseId,mouthId,hornId,patternId,extraId,status:'approved'}));

  function categoryForKey(key){return ({eyeId:'eyes',noseId:'noses',mouthId:'mouths',hornId:'horns'})[key]||null}
  function status(baseId,categoryId,partId){
    const family=matrix[baseId]&&matrix[baseId][categoryId];
    if(!family) return 'acceptable';
    return states.find(value=>(family[value]||[]).includes(partId))||'blocked';
  }
  function compatibleIds(baseId,categoryId,minimum='acceptable'){
    const family=matrix[baseId]&&matrix[baseId][categoryId];
    if(!family) return [];
    return minimum==='approved'?[...family.approved]:[...family.approved,...family.acceptable];
  }
  function validateRecipe(recipe){
    return ['eyeId','noseId','mouthId','hornId'].every(key=>status(recipe.baseId,categoryForKey(key),recipe[key])!=='blocked');
  }

  window.MONSTER_COMPATIBILITY={version:8,states,matrix,placementOverrides,recipes,status,compatibleIds,validateRecipe};
})();
