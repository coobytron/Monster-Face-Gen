(() => {
  const finishAssets = window.MONSTER_FINISHES || [];
  if (!finishAssets.length) return;

  defaults.finishId = defaults.finishId || 'finish-etched';
  state.finishId = state.finishId || defaults.finishId;

  function currentAuthoredFinish(snapshot = state) {
    return finishAssets.find(finish => finish.id === snapshot.finishId) || finishAssets[0];
  }

  function compactFinish(finish) {
    if (!finish) return null;
    const { svg, ...metadata } = finish;
    return metadata;
  }

  function makeSurface(size) {
    const surface = document.createElement('canvas');
    surface.width = size;
    surface.height = size;
    return surface;
  }

  function drawFinishWithCompositionTransform(g, size, image) {
    const drawSize = size * .74;
    g.save();
    g.translate(size * .5 + state.x * size * .22, size * .49 + state.y * size * .22);
    g.rotate(state.rotation * Math.PI / 180);
    g.scale(state.flipped ? -state.scale : state.scale, state.scale);
    g.drawImage(image, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    g.restore();
  }

  function applyFinishPlate(artCanvas, size, finish, finishImage) {
    if (!finish || !finishImage || finish.opacity <= 0) return;
    const finishCanvas = makeSurface(size);
    const finishContext = finishCanvas.getContext('2d');
    drawFinishWithCompositionTransform(finishContext, size, finishImage);

    finishContext.globalCompositeOperation = 'destination-in';
    finishContext.drawImage(artCanvas, 0, 0);

    const artContext = artCanvas.getContext('2d');
    artContext.save();
    artContext.globalCompositeOperation = finish.blendMode || 'multiply';
    artContext.globalAlpha = Number.isFinite(finish.opacity) ? finish.opacity : .5;
    artContext.drawImage(finishCanvas, 0, 0);
    artContext.restore();
  }

  async function renderWithAuthoredFinish(targetCanvas = canvas, forExport = false) {
    const ownToken = targetCanvas === canvas ? ++renderToken : null;
    try {
      const layers = await loadRenderLayers();
      const finish = currentAuthoredFinish();
      const finishImage = finish.id === 'finish-clean' ? null : await loadSvgImage(finish);
      if (ownToken && ownToken !== renderToken) return;

      const g = targetCanvas.getContext('2d');
      const size = targetCanvas.width;
      g.clearRect(0, 0, size, size);
      drawPaper(g, size, forExport);
      drawFrame(g, size);

      const artCanvas = makeSurface(size);
      drawLoadedLayers(artCanvas.getContext('2d'), size, layers);
      applyFinishPlate(artCanvas, size, finish, finishImage);
      g.drawImage(artCanvas, 0, 0);

      applyTreatment(g, size);
      drawCaption(g, size);
    } catch (error) {
      const g = targetCanvas.getContext('2d');
      const size = targetCanvas.width;
      g.clearRect(0, 0, size, size);
      drawPaper(g, size, forExport);
      g.fillStyle = '#171512';
      g.font = '700 24px Arial';
      g.textAlign = 'center';
      g.fillText('Authored asset failed to load', size / 2, size / 2);
      console.error(error);
    }
  }

  function buildFinishControl() {
    const panelBody = document.querySelector('.right-panel .panel-body');
    const builderSummary = document.getElementById('builderSummaryGroup');
    if (!panelBody || document.getElementById('finishGrid')) return;

    const group = document.createElement('div');
    group.className = 'control-group art-finish-group';
    group.innerHTML = `
      <div class="group-label"><span>Illustration finish</span><output id="finishOut"></output></div>
      <div class="finish-grid" id="finishGrid"></div>
      <div class="finish-note">Fixed vector ink plates are transformed with the monster and alpha-masked to approved art. They add surface character, never anatomy.</div>
    `;
    panelBody.insertBefore(group, builderSummary || panelBody.firstChild);

    const grid = document.getElementById('finishGrid');
    finishAssets.forEach(finish => {
      const button = document.createElement('button');
      button.className = 'finish-card';
      button.dataset.finish = finish.id;
      button.innerHTML = `<span class="finish-swatch">${finish.svg}</span><b>${escapeHtml(finish.shortName || finish.name)}</b>`;
      button.onclick = () => applyState({ finishId: finish.id });
      grid.appendChild(button);
    });
  }

  const originalSyncControls = syncControls;
  syncControls = function syncControlsV6() {
    originalSyncControls();
    const finish = currentAuthoredFinish();
    const output = document.getElementById('finishOut');
    if (output) output.textContent = finish.name;
    document.querySelectorAll('.finish-card').forEach(button => {
      button.classList.toggle('active', button.dataset.finish === finish.id);
    });
    const badge = document.getElementById('assetBadge');
    if (badge) {
      const baseLabel = state.mode === 'builder' ? badge.textContent.replace(/ · .*$/, '') : 'Curated complete face';
      badge.textContent = `${baseLabel} · ${finish.shortName || finish.name}`;
    }
    document.body.dataset.finish = finish.id;
  };

  const originalRecipeMetadata = recipeMetadata;
  recipeMetadata = function recipeMetadataV6() {
    return { ...originalRecipeMetadata(), finish: compactFinish(currentAuthoredFinish()) };
  };

  exportPng = async function exportPngV6() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 3600;
    exportCanvas.height = 3600;
    await render(exportCanvas, true);
    exportCanvas.toBlob(async blob => {
      if (!blob) return;
      const metadata = {
        app: 'Monster Face Builder',
        version: 6,
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

  render = renderWithAuthoredFinish;
  buildFinishControl();

  document.title = 'Monster Face Builder — Pre-Drawn v6';
  const eyebrow = document.querySelector('.eyebrow');
  if (eyebrow) eyebrow.textContent = 'Pre-drawn monster asset system';
  const intro = document.querySelector('.intro');
  if (intro) intro.innerHTML = 'A curated library of approved monster art, now finished with <b>fixed vector hatching, blackwork, halftone, and distressed-ink plates</b> inspired by the dense graphic energy of the MVP.';
  const sourceNote = document.getElementById('sourceNote');
  if (sourceNote) sourceNote.innerHTML = '<strong>Pre-drawn source of truth</strong>Canvas may compose, position, mask, treat, and export approved assets. It never generates monster anatomy.';
  const tip = document.querySelector('.right-panel .tip');
  if (tip) tip.textContent = 'Exports a 3600 × 3600 PNG and embeds the editable face, part, finish, and composition recipe inside the PNG metadata.';
  const footer = document.querySelector('.footer-note');
  if (footer) footer.innerHTML = '<span>☠</span>Selected by hand. Finished with authored ink.<span>☠</span>';

  document.getElementById('exportBtn').onclick = exportPng;
  syncControls();
  render();
})();
