(function(){
  const registry = {
  "version": 1,
  "coordinateSystem": {
    "width": 600,
    "height": 600,
    "viewBox": "0 0 600 600"
  },
  "roleOrder": [
    "silhouette-mask",
    "local-shadow",
    "colour-underpaint",
    "black-linework",
    "highlights",
    "texture-detail"
  ],
  "requiredRoles": [
    "silhouette-mask",
    "colour-underpaint",
    "black-linework"
  ],
  "allowedKinds": [
    "svg",
    "svg-mask",
    "png",
    "webp"
  ],
  "allowedBlendModes": [
    "source-over",
    "multiply",
    "screen",
    "overlay"
  ],
  "runtimeGeometry": false,
  "bundles": [
    {
      "id": "base-bog-hybrid-v2",
      "parentAssetId": "base-bog",
      "family": "bases",
      "revision": "2.0.0",
      "width": 600,
      "height": 600,
      "viewBox": "0 0 600 600",
      "alphaMode": "premultiplied-safe",
      "maskMode": "alpha",
      "runtimeGeometry": false,
      "layers": [
        {
          "role": "silhouette-mask",
          "src": "assets/hybrid-fixture/base-bog-mask.svg",
          "kind": "svg-mask",
          "z": 0,
          "alpha": 1,
          "blendMode": "source-over",
          "masked": true,
          "required": true,
          "sourceHash": "f9e1272d1478645e0d472fe0e4dc0cabba6ae4bdcd18a5a2e8773220370338eb",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <path d=\"M108 474C91 438 91 397 101 357L92 329L113 309L106 279L128 257L125 225L153 212L159 181L191 176L210 145L244 151L273 119L302 136L333 112L356 145L392 139L410 173L444 179L447 212L476 229L469 262L493 287L481 319L503 349L487 381L500 415L479 444L485 474C447 520 389 538 301 540C211 539 149 522 108 474Z\" fill=\"#fff\"/>\n</svg>\n"
        },
        {
          "role": "local-shadow",
          "src": "assets/hybrid-fixture/base-bog-shadow.svg",
          "kind": "svg",
          "z": 5,
          "alpha": 1,
          "blendMode": "source-over",
          "masked": false,
          "required": false,
          "sourceHash": "82f0d89da51a7e575a23d64d60277de57dd66dfd5333bf83a2390f695b40004b",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <ellipse cx=\"302\" cy=\"526\" rx=\"218\" ry=\"31\" fill=\"#171512\" opacity=\".22\"/><path d=\"M126 486C169 526 224 542 301 543C389 541 442 523 478 486\" fill=\"none\" stroke=\"#171512\" stroke-width=\"16\" opacity=\".18\" stroke-linecap=\"round\"/>\n</svg>\n"
        },
        {
          "role": "colour-underpaint",
          "src": "assets/hybrid-fixture/base-bog-underpaint.svg",
          "kind": "svg",
          "z": 10,
          "alpha": 1,
          "blendMode": "source-over",
          "masked": true,
          "required": true,
          "sourceHash": "397a5299ae1dd2c4805fb5e3a77f7fdbe275f8648da93a3bdd4579f2cc3adb40",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <defs><linearGradient id=\"bog-v9-g\" x1=\".08\" y1=\".02\" x2=\".92\" y2=\".98\"><stop offset=\"0\" stop-color=\"#65b8ac\"/><stop offset=\".45\" stop-color=\"#338f88\"/><stop offset=\".78\" stop-color=\"#226e6b\"/><stop offset=\"1\" stop-color=\"#164947\"/></linearGradient></defs>\n  <path d=\"M108 474C91 438 91 397 101 357L92 329L113 309L106 279L128 257L125 225L153 212L159 181L191 176L210 145L244 151L273 119L302 136L333 112L356 145L392 139L410 173L444 179L447 212L476 229L469 262L493 287L481 319L503 349L487 381L500 415L479 444L485 474C447 520 389 538 301 540C211 539 149 522 108 474Z\" fill=\"url(#bog-v9-g)\"/>\n</svg>\n"
        },
        {
          "role": "black-linework",
          "src": "assets/hybrid-fixture/base-bog-linework.svg",
          "kind": "svg",
          "z": 20,
          "alpha": 1,
          "blendMode": "source-over",
          "masked": false,
          "required": true,
          "sourceHash": "5772b80a66d4327c924b76d996c8eb42c8ff6bb45d8ef258c57b8d74f543d8c7",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <path d=\"M108 474C91 438 91 397 101 357L92 329L113 309L106 279L128 257L125 225L153 212L159 181L191 176L210 145L244 151L273 119L302 136L333 112L356 145L392 139L410 173L444 179L447 212L476 229L469 262L493 287L481 319L503 349L487 381L500 415L479 444L485 474C447 520 389 538 301 540C211 539 149 522 108 474Z\" fill=\"none\" stroke=\"#171512\" stroke-width=\"17\" stroke-linejoin=\"round\"/>\n  <path d=\"M125 355C112 398 119 445 145 477M469 342C487 397 475 451 448 484\" fill=\"none\" stroke=\"#164947\" stroke-width=\"9\" opacity=\".56\" stroke-linecap=\"round\"/>\n  <path d=\"M177 194l-17-17m49-19-8-22m45 13 8-23m50 6 2-25m41 29 13-22m42 44 18-17m17 49 23-8\" stroke=\"#171512\" stroke-width=\"5\" stroke-linecap=\"round\" opacity=\".66\"/>\n</svg>\n"
        },
        {
          "role": "highlights",
          "src": "assets/hybrid-fixture/base-bog-highlights.svg",
          "kind": "svg",
          "z": 30,
          "alpha": 1,
          "blendMode": "source-over",
          "masked": true,
          "required": false,
          "sourceHash": "ee4f44116dacc5f3423453e8159fb27092da5e9c15ea2f65efd0d2f223840060",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <path d=\"M139 319C126 278 145 220 190 184\" fill=\"none\" stroke=\"#9fd8ce\" stroke-width=\"10\" opacity=\".45\" stroke-linecap=\"round\"/>\n  <path d=\"M164 346C151 326 153 301 166 282M403 190C429 213 444 246 443 278\" fill=\"none\" stroke=\"#8ed0c4\" stroke-width=\"5\" opacity=\".48\" stroke-linecap=\"round\"/>\n  <path d=\"M439 407c14-20 20-43 17-66\" fill=\"none\" stroke=\"#0c3b3b\" stroke-width=\"8\" opacity=\".35\" stroke-linecap=\"round\"/>\n</svg>\n"
        },
        {
          "role": "texture-detail",
          "src": "assets/hybrid-fixture/base-bog-texture.svg",
          "kind": "svg",
          "z": 40,
          "alpha": 1,
          "blendMode": "source-over",
          "masked": true,
          "required": false,
          "sourceHash": "5a756ab9d60f40679ccb0f342785d7e89a6d499711626b7b2efad338da687b85",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <defs><radialGradient id=\"bog-v9-wart\" cx=\".35\" cy=\".28\" r=\".75\"><stop offset=\"0\" stop-color=\"#d9d274\"/><stop offset=\".55\" stop-color=\"#83974f\"/><stop offset=\"1\" stop-color=\"#405d3e\"/></radialGradient></defs>\n  <g stroke=\"#171512\" stroke-linecap=\"round\">\n  <circle cx=\"157\" cy=\"389\" r=\"13\" fill=\"url(#bog-v9-wart)\" stroke-width=\"4\"/><circle cx=\"447\" cy=\"400\" r=\"17\" fill=\"url(#bog-v9-wart)\" stroke-width=\"5\"/>\n  <circle cx=\"207\" cy=\"205\" r=\"8\" fill=\"#d26458\" stroke-width=\"3\"/><circle cx=\"392\" cy=\"184\" r=\"7\" fill=\"#78558a\" stroke-width=\"3\"/>\n  <circle cx=\"129\" cy=\"298\" r=\"5\" fill=\"#d7bd55\" stroke-width=\"2\"/><circle cx=\"469\" cy=\"313\" r=\"6\" fill=\"#d7bd55\" stroke-width=\"2\"/>\n  <path d=\"M150 455l25-10m-12 24 22-8m41 50 20-8m19 20 17-7m54 4 18-7m43-14 23-10m-3-28 26-12\" fill=\"none\" stroke-width=\"4\" opacity=\".58\"/>\n  <path d=\"M187 244l7-4m15 18 9-5m177 12 8-4m24 18 9-5M176 426l9-3m239-16 11-4\" fill=\"none\" stroke-width=\"3\" opacity=\".55\"/>\n  </g>\n  <g fill=\"#d6c85e\" opacity=\".65\"><circle cx=\"182\" cy=\"326\" r=\"5\"/><circle cx=\"421\" cy=\"344\" r=\"4\"/><circle cx=\"232\" cy=\"171\" r=\"4\"/><circle cx=\"365\" cy=\"159\" r=\"3\"/><circle cx=\"256\" cy=\"492\" r=\"3\"/><circle cx=\"342\" cy=\"501\" r=\"4\"/></g>\n  <g fill=\"#171512\" opacity=\".38\"><circle cx=\"198\" cy=\"374\" r=\"2.5\"/><circle cx=\"221\" cy=\"403\" r=\"2\"/><circle cx=\"375\" cy=\"377\" r=\"2.5\"/><circle cx=\"401\" cy=\"430\" r=\"2\"/><circle cx=\"284\" cy=\"186\" r=\"2\"/><circle cx=\"329\" cy=\"191\" r=\"2.5\"/></g>\n</svg>\n"
        }
      ]
    }
  ]
};
  window.MONSTER_HYBRID_BUNDLES = registry;
  const parent = (window.MONSTER_PARTS?.bases || []).find(item => item.id === 'base-bog');
  if(parent) parent.bundleId = 'base-bog-hybrid-v2';
})();
