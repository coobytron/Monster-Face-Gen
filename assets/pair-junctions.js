(function(){
  const allowedContent = [
    'local-skin-or-fur-overlap',
    'cheek-or-lip-cover',
    'short-wrinkle-or-fold-lines',
    'cast-shadow',
    'edge-highlight',
    'horn-root-fold',
    'local-distress-or-texture-continuity'
  ];

  const mouth = [
    {
      id: 'base-bog|mouth-grin', pairKey: 'base-bog|mouth-grin', family: 'mouths',
      baseId: 'base-bog', partId: 'mouth-grin', recipeId: 'bog-cyclops-grin',
      name: 'Bog grin integration plate', stage: 'mouth-base-pair-junction', zOrder: 8,
      flipSafe: true, mirrorWithComposition: true, fallbackId: 'mouth-seam-base-bog',
      contentAudit: { standaloneAnatomy: false, contains: allowedContent },
      svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><path d="M139 390C151 378 171 378 193 397C181 417 181 443 198 466C177 478 153 469 143 448C137 427 136 405 139 390Z" fill="#2e8e87"/><path d="M461 390C449 378 429 378 407 397C419 417 419 443 402 466C423 478 447 469 457 448C463 427 464 405 461 390Z" fill="#2e8e87"/><path d="M191 397C178 421 181 447 199 466M409 397C422 421 419 447 401 466" fill="none" stroke="#171512" stroke-width="8" stroke-linecap="round"/><path d="M151 401C165 392 180 395 189 407M449 401C435 392 420 395 411 407" fill="none" stroke="#83c8bd" stroke-width="5" stroke-linecap="round" opacity=".8"/><path d="M185 475C218 504 260 518 301 519C343 518 383 504 416 475" fill="none" stroke="#174e4b" stroke-width="11" stroke-linecap="round" opacity=".52"/><path d="M164 455l11 5m250 0 11-5M174 469l8 4m236 0 8-4" stroke="#171512" stroke-width="3.5" stroke-linecap="round" opacity=".44"/></svg>`
    },
    {
      id: 'base-fuzz|mouth-fangs', pairKey: 'base-fuzz|mouth-fangs', family: 'mouths',
      baseId: 'base-fuzz', partId: 'mouth-fangs', recipeId: 'fuzz-fanged',
      name: 'Fuzz fangs integration plate', stage: 'mouth-base-pair-junction', zOrder: 8,
      flipSafe: true, mirrorWithComposition: true, fallbackId: 'mouth-seam-base-fuzz',
      contentAudit: { standaloneAnatomy: false, contains: allowedContent },
      svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><path d="M142 396l-13-10 15-9-7-14 20 6-2-17 20 13c11 7 20 18 27 33-13 22-13 47 2 68-18 15-42 13-57-5Z" fill="#d86d2e"/><path d="M458 396l13-10-15-9 7-14-20 6 2-17-20 13c-11 7-20 18-27 33 13 22 13 47-2 68 18 15 42 13 57-5Z" fill="#d86d2e"/><path d="M199 397C185 420 187 447 204 466M401 397C415 420 413 447 396 466" fill="none" stroke="#171512" stroke-width="8" stroke-linecap="round"/><path d="M151 396l19-14m-12 35 17-10m274-11-19-14m12 35-17-10" stroke="#f2a04a" stroke-width="6" stroke-linecap="round" opacity=".82"/><path d="M187 475C221 507 260 520 301 521C341 520 380 507 413 475" fill="none" stroke="#7f321f" stroke-width="11" stroke-linecap="round" opacity=".58"/><path d="M164 463l-12 13m31-4-9 15m262-24 12 13m-31-4 9 15" stroke="#171512" stroke-width="3.5" stroke-linecap="round" opacity=".5"/></svg>`
    },
    {
      id: 'base-imp|mouth-roar', pairKey: 'base-imp|mouth-roar', family: 'mouths',
      baseId: 'base-imp', partId: 'mouth-roar', recipeId: 'imp-roar',
      name: 'Imp roar integration plate', stage: 'mouth-base-pair-junction', zOrder: 8,
      flipSafe: true, mirrorWithComposition: true, fallbackId: 'mouth-seam-base-imp',
      contentAudit: { standaloneAnatomy: false, contains: allowedContent },
      svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><path d="M132 376C151 357 177 361 205 390C188 420 188 453 207 480C181 494 151 482 138 456C129 430 127 399 132 376Z" fill="#725178"/><path d="M468 376C449 357 423 361 395 390C412 420 412 453 393 480C419 494 449 482 462 456C471 430 473 399 468 376Z" fill="#725178"/><path d="M204 389C184 420 187 455 208 480M396 389C416 420 413 455 392 480" fill="none" stroke="#171512" stroke-width="9" stroke-linecap="round"/><path d="M145 390C160 378 179 382 194 400M455 390C440 378 421 382 406 400" fill="none" stroke="#aa79b2" stroke-width="5" stroke-linecap="round" opacity=".76"/><path d="M181 490C217 518 258 531 301 532C344 531 385 517 419 489" fill="none" stroke="#3f2d50" stroke-width="13" stroke-linecap="round" opacity=".62"/><path d="M154 428c15 4 24 13 29 27m263-27c-15 4-24 13-29 27" fill="none" stroke="#171512" stroke-width="4" stroke-linecap="round" opacity=".55"/><path d="M163 468l12 5m250 0 12-5" stroke="#c29ac8" stroke-width="3.5" stroke-linecap="round" opacity=".56"/></svg>`
    }
  ];

  const horns = [
    {
      id: 'base-bog|horn-curved', pairKey: 'base-bog|horn-curved', family: 'horns',
      baseId: 'base-bog', partId: 'horn-curved', recipeId: 'bog-cyclops-grin',
      name: 'Bog curved-horn root plate', stage: 'horn-root-pair-junction', zOrder: 3,
      flipSafe: true, mirrorWithComposition: true, fallbackId: 'horn-seam-curved',
      contentAudit: { standaloneAnatomy: false, contains: allowedContent },
      svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><path d="M171 126C184 108 207 106 232 120C226 144 207 158 181 155C171 147 168 136 171 126Z" fill="#2e8e87"/><path d="M429 126C416 108 393 106 368 120C374 144 393 158 419 155C429 147 432 136 429 126Z" fill="#2e8e87"/><path d="M178 143C192 127 213 125 226 135M422 143C408 127 387 125 374 135" fill="none" stroke="#171512" stroke-width="7" stroke-linecap="round"/><path d="M181 132C194 119 210 118 221 126M419 132C406 119 390 118 379 126" fill="none" stroke="#83c8bd" stroke-width="4" stroke-linecap="round" opacity=".72"/><path d="M185 153l8 10m214 0 8-10M201 156l5 11m188 0 5-11" stroke="#174e4b" stroke-width="3.5" stroke-linecap="round" opacity=".62"/></svg>`
    },
    {
      id: 'base-fuzz|horn-bent', pairKey: 'base-fuzz|horn-bent', family: 'horns',
      baseId: 'base-fuzz', partId: 'horn-bent', recipeId: 'fuzz-fanged',
      name: 'Fuzz bent-horn root plate', stage: 'horn-root-pair-junction', zOrder: 3,
      flipSafe: true, mirrorWithComposition: true, fallbackId: 'horn-seam-bent',
      contentAudit: { standaloneAnatomy: false, contains: allowedContent },
      svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><path d="M166 143l-13-8 14-9-7-13 18 5 2-17 17 13c11-9 27-8 40 3-4 25-22 43-48 45Z" fill="#d86d2e"/><path d="M434 143l13-8-14-9 7-13-18 5-2-17-17 13c-11-9-27-8-40 3 4 25 22 43 48 45Z" fill="#d86d2e"/><path d="M178 151C193 132 216 130 231 142M422 151C407 132 384 130 369 142" fill="none" stroke="#171512" stroke-width="7" stroke-linecap="round"/><path d="M170 137l18-13m-10 30 17-12m235-5-18-13m10 30-17-12" stroke="#f2a04a" stroke-width="5" stroke-linecap="round" opacity=".8"/><path d="M193 157l-7 14m221-14 7 14M208 159l-4 13m188-13 4 13" stroke="#7f321f" stroke-width="3.5" stroke-linecap="round" opacity=".62"/></svg>`
    },
    {
      id: 'base-imp|horn-spiky', pairKey: 'base-imp|horn-spiky', family: 'horns',
      baseId: 'base-imp', partId: 'horn-spiky', recipeId: 'imp-roar',
      name: 'Imp spiky-horn root plate', stage: 'horn-root-pair-junction', zOrder: 3,
      flipSafe: true, mirrorWithComposition: true, fallbackId: 'horn-seam-spiky',
      contentAudit: { standaloneAnatomy: false, contains: allowedContent },
      svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><path d="M165 137C181 114 209 111 237 127C230 153 207 168 179 162C166 155 161 146 165 137Z" fill="#725178"/><path d="M435 137C419 114 391 111 363 127C370 153 393 168 421 162C434 155 439 146 435 137Z" fill="#725178"/><path d="M176 153C193 133 216 132 230 145M424 153C407 133 384 132 370 145" fill="none" stroke="#171512" stroke-width="8" stroke-linecap="round"/><path d="M178 140C194 124 212 123 225 135M422 140C406 124 388 123 375 135" fill="none" stroke="#aa79b2" stroke-width="4.5" stroke-linecap="round" opacity=".76"/><path d="M188 160l9 13m206 0 9-13M206 161l5 14m178 0 5-14" stroke="#3f2d50" stroke-width="4" stroke-linecap="round" opacity=".66"/></svg>`
    }
  ];

  const all = [...mouth, ...horns];
  const byKey = Object.fromEntries(all.map(item => [item.pairKey, item]));
  const select = (baseId, partId) => byKey[`${baseId}|${partId}`] || null;

  window.MONSTER_PAIR_JUNCTIONS = {
    version: 9,
    keyPattern: '<base-id>|<part-id>',
    coordinateSystem: { width: 600, height: 600, viewBox: '0 0 600 600' },
    runtimeGeometry: false,
    deterministicSelection: 'exact pair key first; generic target seam fallback second',
    heroRecipeIds: ['bog-cyclops-grin','fuzz-fanged','imp-roar'],
    allowedContent,
    mouth,
    horns,
    all,
    byKey,
    select
  };
})();
