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
      "id": "base-bog-hybrid-v1",
      "parentAssetId": "base-bog",
      "family": "bases",
      "revision": "1.0.0",
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
          "sourceHash": "db343dc8e103afc9f50069ad341bc40bd8b89839c090949b43b9861118a52e48",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <path d=\"M112 474 Q78 350 130 228 Q180 120 304 112 Q432 120 480 236 Q522 360 486 474 Q431 528 301 530 Q170 528 112 474Z\" fill=\"#fff\"/>\n</svg>\n"
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
          "sourceHash": "f4740fb1e54515fe5f26eb7b1f367172a36e124a2d9abc0ba980be68a9d76ccb",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <ellipse cx=\"300\" cy=\"520\" rx=\"205\" ry=\"28\" fill=\"#171512\" opacity=\".16\"/>\n</svg>\n"
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
          "sourceHash": "2190c8e38a61f40ab1be141e68c7be335feb21f4f8d3e240a5dcc0e4881a1efd",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <defs><linearGradient id=\"base-bog-hybrid-g\" x1=\"0\" y1=\"0\" x2=\".9\" y2=\"1\"><stop offset=\"0\" stop-color=\"#55aaa1\"/><stop offset=\".58\" stop-color=\"#2e8e87\"/><stop offset=\"1\" stop-color=\"#1a5e5b\"/></linearGradient></defs>\n  <path d=\"M112 474 Q78 350 130 228 Q180 120 304 112 Q432 120 480 236 Q522 360 486 474 Q431 528 301 530 Q170 528 112 474Z\" fill=\"url(#base-bog-hybrid-g)\"/>\n</svg>\n"
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
          "sourceHash": "b48a766d090243e18ce5302572a54966708eb621c0d240ea2a33e99a61dccd0d",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <path d=\"M112 474 Q78 350 130 228 Q180 120 304 112 Q432 120 480 236 Q522 360 486 474 Q431 528 301 530 Q170 528 112 474Z\" fill=\"none\" stroke=\"#171512\" stroke-width=\"16\" stroke-linejoin=\"round\"/>\n</svg>\n"
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
          "sourceHash": "26b32f5d8865f1345c1663d4247d3f39ed1723745e106f298bace52747741789",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <path d=\"M142 318 Q128 260 166 208\" fill=\"none\" stroke=\"#8fd0c4\" stroke-width=\"10\" opacity=\".34\" stroke-linecap=\"round\"/>\n  <path d=\"M430 248 Q462 304 450 376\" fill=\"none\" stroke=\"#174e4b\" stroke-width=\"8\" opacity=\".3\" stroke-linecap=\"round\"/>\n</svg>\n"
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
          "sourceHash": "d6bc903714d9cdd88b5070738887362d795e80f1b2998214cf00021fd877dcc9",
          "inlineSvg": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"600\" viewBox=\"0 0 600 600\">\n  <circle cx=\"168\" cy=\"382\" r=\"7\" fill=\"#d6be57\" stroke=\"#171512\" stroke-width=\"3\"/>\n  <circle cx=\"444\" cy=\"398\" r=\"10\" fill=\"#725178\" stroke=\"#171512\" stroke-width=\"4\"/>\n  <circle cx=\"202\" cy=\"196\" r=\"5\" fill=\"#c45143\" stroke=\"#171512\" stroke-width=\"2\"/>\n  <path d=\"M173 457 l22 -7 M407 448 l18 -6 M218 500 l16 -5 M372 498 l19 -6\" stroke=\"#171512\" stroke-width=\"4\" opacity=\".42\" stroke-linecap=\"round\"/>\n</svg>\n"
        }
      ]
    }
  ]
};
  window.MONSTER_HYBRID_BUNDLES = registry;
  const parent = (window.MONSTER_PARTS?.bases || []).find(item => item.id === 'base-bog');
  if(parent) parent.bundleId = 'base-bog-hybrid-v1';
})();
