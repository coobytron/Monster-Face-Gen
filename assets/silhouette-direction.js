(function(){
  const bases={
    'base-bog':{profile:'rounded-lopsided',crown:'offset-dome',cheek:'soft-heavy',jaw:'wide-drop',chin:'shallow-notch'},
    'base-fuzz':{profile:'fur-broken-pear',crown:'tufted-peak',cheek:'ragged-full',jaw:'tapered-fur',chin:'split-tuft'},
    'base-skull':{profile:'angular-cranium',crown:'bone-dome',cheek:'socket-cut',jaw:'segmented',chin:'toothed-step'},
    'base-imp':{profile:'compressed-round',crown:'low-dome',cheek:'ear-interrupted',jaw:'heavy-round',chin:'center-drop'},
    'base-moss':{profile:'asymmetric-goblin',crown:'sloped-offset',cheek:'ear-broken',jaw:'uneven-heavy',chin:'off-center'},
    'base-blue':{profile:'tufted-round',crown:'central-spike',cheek:'fur-stepped',jaw:'wide-tufted',chin:'small-notch'}
  };

  const roots={
    'horn-curved':{profile:'crown-flare',flipSafe:true},
    'horn-spiky':{profile:'high-crown-flare',flipSafe:true},
    'horn-nubs':{profile:'compact-crown',flipSafe:true},
    'horn-long':{profile:'deep-crown-flare',flipSafe:true},
    'horn-rams':{profile:'wide-crown-wrap',flipSafe:true},
    'horn-bat':{profile:'side-ear-pocket',flipSafe:true},
    'horn-tufted':{profile:'side-ear-pocket',flipSafe:true},
    'horn-bent':{profile:'crown-flare',flipSafe:true}
  };

  const seamProfiles={
    'base-bog':{
      'horn-curved':'bog-crown',
      'horn-nubs':'bog-crown',
      'horn-tufted':'bog-side',
      'horn-spiky':'bog-high',
      'horn-bent':'bog-crown',
      'horn-rams':'bog-wide'
    },
    'base-fuzz':{
      'horn-tufted':'fuzz-side',
      'horn-nubs':'fuzz-crown',
      'horn-bent':'fuzz-crown',
      'horn-curved':'fuzz-crown',
      'horn-spiky':'fuzz-high',
      'horn-bat':'fuzz-side'
    },
    'base-skull':{
      'horn-long':'skull-deep',
      'horn-bent':'skull-crown',
      'horn-nubs':'skull-crown',
      'horn-curved':'skull-crown',
      'horn-spiky':'skull-high',
      'horn-rams':'skull-wide'
    },
    'base-imp':{
      'horn-spiky':'imp-high',
      'horn-long':'imp-deep',
      'horn-bat':'imp-side',
      'horn-bent':'imp-crown',
      'horn-curved':'imp-crown',
      'horn-nubs':'imp-crown',
      'horn-rams':'imp-wide'
    },
    'base-moss':{
      'horn-rams':'moss-wide',
      'horn-curved':'moss-crown',
      'horn-nubs':'moss-crown',
      'horn-spiky':'moss-high',
      'horn-tufted':'moss-side',
      'horn-bent':'moss-crown'
    },
    'base-blue':{
      'horn-bat':'blue-side',
      'horn-tufted':'blue-side',
      'horn-nubs':'blue-crown',
      'horn-curved':'blue-crown',
      'horn-spiky':'blue-high',
      'horn-bent':'blue-crown'
    }
  };

  const pairOverrides={
    'base-bog|horn-tufted':{x:0,y:0.01,scale:0.96,rotation:0,seamProfile:'bog-side'},
    'base-fuzz|horn-tufted':{x:0,y:0.012,scale:0.94,rotation:0,seamProfile:'fuzz-side'},
    'base-fuzz|horn-bat':{x:0,y:0.018,scale:0.92,rotation:0,seamProfile:'fuzz-side'},
    'base-skull|horn-long':{x:0,y:0.014,scale:0.96,rotation:0,seamProfile:'skull-deep'},
    'base-skull|horn-rams':{x:0,y:0.012,scale:0.9,rotation:0,seamProfile:'skull-wide'},
    'base-imp|horn-spiky':{x:0,y:0.006,scale:0.97,rotation:0,seamProfile:'imp-high'},
    'base-imp|horn-bat':{x:0,y:0.016,scale:0.92,rotation:0,seamProfile:'imp-side'},
    'base-moss|horn-rams':{x:0,y:0.014,scale:0.9,rotation:0,seamProfile:'moss-wide'},
    'base-moss|horn-tufted':{x:0,y:0.014,scale:0.94,rotation:0,seamProfile:'moss-side'},
    'base-blue|horn-bat':{x:0,y:0.016,scale:0.9,rotation:0,seamProfile:'blue-side'},
    'base-blue|horn-tufted':{x:0,y:0.014,scale:0.92,rotation:0,seamProfile:'blue-side'}
  };

  function seamProfile(baseId,hornId){
    return seamProfiles[baseId]&&seamProfiles[baseId][hornId]||null;
  }

  function hasAuthoredRoot(baseId,hornId){
    if(hornId==='horn-none') return true;
    return Boolean(roots[hornId]&&seamProfile(baseId,hornId));
  }

  function flipSafe(baseId,hornId){
    if(hornId==='horn-none') return true;
    return hasAuthoredRoot(baseId,hornId)&&roots[hornId].flipSafe===true;
  }

  window.MONSTER_SILHOUETTE_DIRECTION={
    version:8,
    bases,
    roots,
    seamProfiles,
    pairOverrides,
    seamProfile,
    hasAuthoredRoot,
    flipSafe
  };
})();
