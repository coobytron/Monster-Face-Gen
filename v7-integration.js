(() => {
  const junctionPack = window.MONSTER_JUNCTIONS || {};
  const mouthSeams = junctionPack.mouthSeams || [];
  const hornSeams = junctionPack.hornSeams || [];

  defaults.assemblyVersion = 7;
  state.assemblyVersion = 7;

  function junctionFor(list, targetId) {
    return list.find(item => item.targetId === targetId) || null;
  }

  function makeSurface(size) {
    const surface = document.createElement('canvas');
    surface.width = size;
    surface.height = size;
    return surface;
  }

  function compositionTransform(g, size, callback) {
    const drawSize = size * .74;
    g.save();
    g.translate(size * .5 + state.x * size * .22, size * .49 + state.y * size * .22);
    g.rotate(state.rotation * Math.PI / 180);
    g.scale(state.flipped ? -state.scale : state.scale, state.scale);
    callback(drawSize);
    g.restore();
  }

  function drawImageInSlot(g, size, image, slot = { x: 0, y: 0, scale: 1, rotation: 0 }) {
    if (!image) return;
    compositionTransform(g, size, drawSize => {
      g.save();
      g.translate((slot.x || 0) * drawSize, (slot.y || 0) * drawSize);
      g.rotate((slot.rotation || 0) * Math.PI / 180);
      g.scale(slot.scale || 1, slot.scale || 1);
      g.drawImage(image, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      g.restore();
    });
  }

  function drawLayer(g, size, layer, base) {
    if (!layer || !layer.image) return;
    drawImageInSlot(g, size, layer.image, slotFor(base, layer.categoryId));
  }

  const originalLoadRenderLayers = loadRenderLayers;
  loadRenderLayers = async function loadRenderLayersV7() {
    const layers = await originalLoadRenderLayers();
    if (state.mode !== 'builder') return layers;

    const base = currentBase();
    const horn = currentPart('horns');
    const mouth = currentPart('mouths');
    const mouthSeam = base && mouth && !(mouth.tags || []).includes('none')
      ? junctionFor(mouthSeams, base.id)
      : null;
    const hornSeam = horn && !(horn.tags || []).includes('none')
      ? junctionFor(hornSeams, horn.id)
      : null;

    const [mouthSeamImage, hornSeamImage] = await Promise.all([
      mouthSeam ? loadSvgImage(mouthSeam) : Promise.resolve(null),
      hornSeam ? loadSvgImage(hornSeam) : Promise.resolve(null)
    ]);

    layers.v7Assembly = {
      mouthSeam,
      mouthSeamImage,
      hornSeam,
      hornSeamImage
    };
    return layers;
  };

  const originalDrawLoadedLayers = drawLoadedLayers;
  drawLoadedLayers = function drawLoadedLayersV7(g, size, layers) {
    if (state.mode !== 'builder') {
      originalDrawLoadedLayers(g, size, layers);
      return;
    }

    const base = currentBase();
    const byCategory = Object.fromEntries(layers.map(layer => [layer.categoryId, layer]));
    const assembly = layers.v7Assembly || {};

    drawLayer(g, size, byCategory.horns, base);
    drawLayer(g, size, byCategory.bases, base);

    if (assembly.hornSeamImage && byCategory.horns) {
      drawImageInSlot(g, size, assembly.hornSeamImage, slotFor(base, 'horns'));
    }

    drawLayer(g, size, byCategory.patterns, base);
    drawLayer(g, size, byCategory.eyes, base);
    drawLayer(g, size, byCategory.noses, base);

    const mouthLayer = byCategory.mouths;
    const baseLayer = byCategory.bases;
    if (mouthLayer && baseLayer) {
      const mouthSurface = makeSurface(size);
      const mouthContext = mouthSurface.getContext('2d');
      drawLayer(mouthContext, size, mouthLayer, base);

      // The mouth is clipped to the authored head base alpha. This removes hard
      // cut-offs outside the silhouette without inventing or deforming anatomy.
      mouthContext.globalCompositeOperation = 'destination-in';
      drawLayer(mouthContext, size, baseLayer, base);
      mouthContext.globalCompositeOperation = 'source-over';
      g.drawImage(mouthSurface, 0, 0);
    } else {
      drawLayer(g, size, mouthLayer, base);
    }

    if (assembly.mouthSeamImage) {
      drawImageInSlot(g, size, assembly.mouthSeamImage);
    }

    drawLayer(g, size, byCategory.extras, base);
  };

  function compactJunction(item) {
    if (!item) return null;
    const { svg, ...metadata } = item;
    return metadata;
  }

  const originalRecipeMetadata = recipeMetadata;
  recipeMetadata = function recipeMetadataV7() {
    const recipe = originalRecipeMetadata();
    if (state.mode !== 'builder') {
      return { ...recipe, assembly: { version: 7, method: 'complete-face-no-junction-pass' } };
    }

    const base = currentBase();
    const mouth = currentPart('mouths');
    const horn = currentPart('horns');
    return {
      ...recipe,
      assembly: {
        version: 7,
        mouthClip: 'authored-base-alpha',
        mouthSeam: compactJunction(
          mouth && !(mouth.tags || []).includes('none') ? junctionFor(mouthSeams, base && base.id) : null
        ),
        hornSeam: compactJunction(
          horn && !(horn.tags || []).includes('none') ? junctionFor(hornSeams, horn.id) : null
        )
      }
    };
  };

  exportPng = async function exportPngV7() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 3600;
    exportCanvas.height = 3600;
    await render(exportCanvas, true);
    exportCanvas.toBlob(async blob => {
      if (!blob) return;
      const metadata = {
        app: 'Monster Face Builder',
        version: 7,
        mode: state.mode,
        exportedAt: new Date().toISOString(),
        recipe: recipeMetadata(),
        state
      };
      const enriched = await window.PngMetadata.embedJsonInPng(blob, metadata);
      const url = URL.createObjectURL(enriched);
      const link = document.createElement('a');
      link.href = url;
      link.download = `monster-${state.mode}-${Date.now()}.png`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };

  const originalRenderModeSwitch = renderModeSwitch;
  renderModeSwitch = function renderModeSwitchV7() {
    originalRenderModeSwitch();
    const sourceNote = document.getElementById('sourceNote');
    if (!sourceNote) return;
    sourceNote.innerHTML = state.mode === 'builder'
      ? '<strong>Authored assembly pass</strong>Mouths are clipped to the selected pre-drawn head, then finished with fixed cheek seams. Horn roots receive fixed overlap shadows and contour folds.'
      : '<strong>Complete face library</strong>Select a finished character and art-direct its placement, finish, print treatment, caption, and export.';
  };

  const originalSyncControls = syncControls;
  syncControls = function syncControlsV7() {
    originalSyncControls();
    const badge = document.getElementById('assetBadge');
    if (badge && state.mode === 'builder' && !badge.textContent.includes('integrated seams')) {
      badge.textContent += ' · integrated seams';
    }
    document.body.dataset.assembly = 'v7';
  };

  document.title = 'Monster Face Builder — Pre-Drawn v7';
  const eyebrow = document.querySelector('.eyebrow');
  if (eyebrow) eyebrow.textContent = 'Pre-drawn monster assembly system';
  const intro = document.querySelector('.intro');
  if (intro) intro.innerHTML = 'A curated library of approved monster art with <b>authored mouth clipping, cheek transitions, horn-root seams, and fixed print finishes</b> that make mixed parts read as one drawing.';
  const tip = document.querySelector('.right-panel .tip');
  if (tip) tip.textContent = 'Exports a 3600 × 3600 PNG and embeds the editable face, part, finish, assembly, and composition recipe inside the PNG metadata.';
  const footer = document.querySelector('.footer-note');
  if (footer) footer.innerHTML = '<span>☠</span>Selected by hand. Joined like one drawing.<span>☠</span>';

  document.getElementById('exportBtn').onclick = exportPng;
  renderModeSwitch();
  syncControls();
  render();
})();
