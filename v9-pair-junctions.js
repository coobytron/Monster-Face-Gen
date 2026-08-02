(function(){
  const sources = ['assets/v10-mouths.js', 'assets/v10-mouth-integration.js'];

  function loadSource(index){
    if(index >= sources.length){
      initialisePairJunctionRuntime();
      return;
    }
    const script = document.createElement('script');
    script.src = sources[index];
    script.async = false;
    script.onload = () => loadSource(index + 1);
    script.onerror = () => {
      console.error(`Unable to load ${sources[index]}; retaining the existing v9 pair-junction runtime.`);
      initialisePairJunctionRuntime();
    };
    document.head.appendChild(script);
  }

  function initialisePairJunctionRuntime(){
    const registry = window.MONSTER_PAIR_JUNCTIONS;
    if (!registry) return;

    const originalLoadRenderLayers = loadRenderLayers;
    const originalRecipeMetadata = recipeMetadata;

    function selectedPairJunctions(){
      if (state.mode !== 'builder') return { mouth: null, horns: null };
      const base = currentBase();
      const mouth = currentPart('mouths');
      const horns = currentPart('horns');
      return {
        mouth: base && mouth && !(mouth.tags || []).includes('none') ? registry.select(base.id, mouth.id) : null,
        horns: base && horns && !(horns.tags || []).includes('none') ? registry.select(base.id, horns.id) : null
      };
    }

    loadRenderLayers = async function loadRenderLayersV9PairJunctions(){
      const layers = await originalLoadRenderLayers();
      if (state.mode !== 'builder') return layers;

      const selected = selectedPairJunctions();
      const [mouthImage, hornImage] = await Promise.all([
        selected.mouth ? loadSvgImage(selected.mouth) : Promise.resolve(null),
        selected.horns ? loadSvgImage(selected.horns) : Promise.resolve(null)
      ]);

      layers.v7Assembly = layers.v7Assembly || {};
      if (selected.mouth) {
        layers.v7Assembly.mouthSeam = selected.mouth;
        layers.v7Assembly.mouthSeamImage = mouthImage;
      }
      if (selected.horns) {
        layers.v7Assembly.hornSeam = selected.horns;
        layers.v7Assembly.hornSeamImage = hornImage;
      }

      layers.v9PairJunctions = {
        mouth: selected.mouth,
        mouthImage,
        horns: selected.horns,
        hornImage,
        mouthSelection: selected.mouth ? 'pair-specific' : 'generic-fallback',
        hornSelection: selected.horns ? 'pair-specific' : 'generic-fallback'
      };
      return layers;
    };

    function compact(item){
      if (!item) return null;
      const { svg, contentAudit, ...metadata } = item;
      return { ...metadata, contentAudit };
    }

    recipeMetadata = function recipeMetadataV9PairJunctions(){
      const metadata = originalRecipeMetadata();
      const selected = selectedPairJunctions();
      return {
        ...metadata,
        pairJunctionContractVersion: registry.version,
        pairJunctions: {
          mouth: compact(selected.mouth),
          horns: compact(selected.horns),
          mouthSelection: selected.mouth ? 'pair-specific' : 'generic-fallback',
          hornSelection: selected.horns ? 'pair-specific' : 'generic-fallback',
          mirrorMode: 'full-composition'
        }
      };
    };

    const originalRenderModeSwitch = renderModeSwitch;
    renderModeSwitch = function renderModeSwitchV9PairJunctions(){
      originalRenderModeSwitch();
      const sourceNote = document.getElementById('sourceNote');
      if (sourceNote && state.mode === 'builder') {
        const selected = selectedPairJunctions();
        const pairCount = Number(Boolean(selected.mouth)) + Number(Boolean(selected.horns));
        sourceNote.innerHTML = pairCount
          ? `<strong>Pair-authored assembly</strong>${pairCount} exact mouth or horn junction plate${pairCount === 1 ? '' : 's'} selected by stable base × part key. Other joins retain the generic authored fallback.`
          : '<strong>Authored assembly fallback</strong>No exact pair plate is published for this combination, so the retained generic mouth and horn seams are used.';
      }
    };

    const originalSyncControls = syncControls;
    syncControls = function syncControlsV9PairJunctions(){
      originalSyncControls();
      const badge = document.getElementById('assetBadge');
      if (badge && state.mode === 'builder') {
        const selected = selectedPairJunctions();
        if ((selected.mouth || selected.horns) && !badge.textContent.includes('pair junctions')) {
          badge.textContent += ' · pair junctions';
        }
      }
      document.body.dataset.pairJunctions = registry.version >= 10 ? 'v10' : 'v9';
    };

    defaults.pairJunctionVersion = registry.version;
    state.pairJunctionVersion = registry.version;
    window.MonsterPairJunctions = { registry, selectedPairJunctions };

    document.title = registry.version >= 10
      ? 'Monster Face Builder — Pre-Drawn v10.1'
      : 'Monster Face Builder — Pre-Drawn v9';
    renderModeSwitch();
    syncControls();
    render();
  }

  loadSource(0);
})();
