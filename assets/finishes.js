window.MONSTER_FINISHES = [
  {
    id: 'finish-etched',
    name: 'Etched MVP',
    shortName: 'Etched',
    blendMode: 'multiply',
    opacity: 0.58,
    tags: ['etched','hatching','mvp'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Etched MVP finishing plate">
      <defs>
        <pattern id="etch-a" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
          <path d="M0 4H18M0 12H18" stroke="#171512" stroke-width="2.6" stroke-linecap="round" opacity=".62"/>
        </pattern>
        <pattern id="etch-b" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
          <path d="M0 8H26M0 20H26" stroke="#171512" stroke-width="2" stroke-linecap="round" opacity=".42"/>
        </pattern>
        <pattern id="stipple" width="31" height="29" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="7" r="2.2" fill="#171512" opacity=".58"/>
          <circle cx="21" cy="15" r="1.5" fill="#171512" opacity=".46"/>
          <circle cx="13" cy="26" r="1.2" fill="#171512" opacity=".4"/>
        </pattern>
      </defs>
      <path d="M72 332C107 450 191 521 307 532C415 537 502 472 535 346L535 600H65Z" fill="url(#etch-a)" opacity=".52"/>
      <path d="M95 110C154 63 227 43 302 52C388 52 467 91 514 159C444 128 378 116 302 120C222 115 153 128 95 164Z" fill="url(#etch-b)" opacity=".31"/>
      <path d="M70 150H530V520H70Z" fill="url(#stipple)" opacity=".24"/>
      <g fill="none" stroke="#171512" stroke-linecap="round">
        <path d="M115 352C151 438 217 483 299 489" stroke-width="7" opacity=".45"/>
        <path d="M485 337C458 425 396 476 319 490" stroke-width="6" opacity=".38"/>
        <path d="M137 300C164 215 222 166 292 152" stroke-width="4" opacity=".36"/>
        <path d="M463 298C438 215 381 169 314 153" stroke-width="4" opacity=".34"/>
        <path d="M147 413l36-12m-22 36 43-15m214-4 38 13m-53 9 42 15" stroke-width="5" opacity=".62"/>
        <path d="M179 187l22-18m-9 43 29-23m199 1 25 20m-43-42 25 21" stroke-width="4" opacity=".55"/>
      </g>
      <g fill="#f7edda" opacity=".48">
        <path d="M150 249l30-12-21 28Z"/><path d="M437 244l-31-11 22 28Z"/>
        <path d="M212 458l34-7-25 24Z"/><path d="M389 455l-35-7 25 25Z"/>
      </g>
    </svg>`
  },
  {
    id: 'finish-blackwork',
    name: 'Blackwork Punch',
    shortName: 'Blackwork',
    blendMode: 'multiply',
    opacity: 0.5,
    tags: ['blackwork','vector','bold'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Blackwork finishing plate">
      <defs>
        <pattern id="slash" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <path d="M0 5H34M0 20H34" stroke="#171512" stroke-width="7" stroke-linecap="round" opacity=".55"/>
        </pattern>
      </defs>
      <path d="M57 399C128 349 180 364 231 425C165 416 126 451 96 513Z" fill="#171512" opacity=".72"/>
      <path d="M543 395C477 349 421 365 370 424C438 413 477 452 505 514Z" fill="#171512" opacity=".68"/>
      <path d="M118 126C164 91 205 76 250 71C210 107 192 142 183 190Z" fill="#171512" opacity=".56"/>
      <path d="M482 126C437 90 396 76 351 70C390 106 410 142 417 190Z" fill="#171512" opacity=".54"/>
      <path d="M75 292C112 248 153 224 201 212L165 345Z" fill="url(#slash)" opacity=".62"/>
      <path d="M525 290C487 247 447 224 399 211L435 345Z" fill="url(#slash)" opacity=".58"/>
      <g fill="none" stroke="#171512" stroke-linecap="round" stroke-linejoin="round">
        <path d="M126 470C174 514 232 535 300 538C371 536 428 513 475 469" stroke-width="12" opacity=".67"/>
        <path d="M135 163C180 118 236 96 300 94C364 96 420 119 464 164" stroke-width="8" opacity=".42"/>
        <path d="M103 333l58-25m-41 69 55-26m304-18-58-25m39 69-54-26" stroke-width="9" opacity=".63"/>
      </g>
    </svg>`
  },
  {
    id: 'finish-screenprint',
    name: 'Screenprint Pop',
    shortName: 'Screenprint',
    blendMode: 'multiply',
    opacity: 0.52,
    tags: ['halftone','registration','poster'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Screenprint finishing plate">
      <defs>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="3.4" fill="#171512"/><circle cx="15" cy="15" r="2.1" fill="#171512"/>
        </pattern>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".48" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="1"/>
        </linearGradient>
        <mask id="fade-mask"><rect width="600" height="600" fill="url(#fade)"/></mask>
      </defs>
      <rect x="65" y="80" width="470" height="470" fill="url(#dots)" opacity=".38" mask="url(#fade-mask)"/>
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M104 228C141 153 214 105 300 103C388 105 459 154 497 228" stroke="#c45143" stroke-width="11" opacity=".47" transform="translate(-7 4)"/>
        <path d="M96 379C132 476 207 526 300 529C394 526 469 475 505 379" stroke="#2e8e87" stroke-width="12" opacity=".45" transform="translate(7 -3)"/>
        <path d="M126 306C154 257 192 226 241 210M474 306C446 257 408 226 359 210" stroke="#171512" stroke-width="6" opacity=".36"/>
      </g>
      <g fill="#c45143" opacity=".58"><circle cx="126" cy="430" r="8"/><circle cx="453" cy="190" r="6"/><circle cx="391" cy="493" r="5"/></g>
      <g fill="#2e8e87" opacity=".56"><circle cx="474" cy="421" r="8"/><circle cx="150" cy="196" r="6"/><circle cx="218" cy="496" r="5"/></g>
    </svg>`
  },
  {
    id: 'finish-distressed',
    name: 'Distressed Ink',
    shortName: 'Distressed',
    blendMode: 'multiply',
    opacity: 0.49,
    tags: ['scratches','speckle','weathered'],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Distressed ink finishing plate">
      <defs>
        <pattern id="pepper" width="43" height="39" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="10" r="2" fill="#171512"/><circle cx="31" cy="7" r="1.3" fill="#171512"/>
          <circle cx="20" cy="28" r="2.4" fill="#171512"/><circle cx="39" cy="31" r="1.1" fill="#171512"/>
        </pattern>
      </defs>
      <rect x="70" y="80" width="460" height="470" fill="url(#pepper)" opacity=".38"/>
      <g fill="none" stroke="#171512" stroke-linecap="round">
        <path d="M117 187l67-33m-45 73 83-42m-99 108 54-26m292-86-66-30m43 71-82-39m105 103-57-27" stroke-width="5" opacity=".52"/>
        <path d="M124 426l93-33m-73 75 121-40m211-6-92-30m71 75-122-39" stroke-width="6" opacity=".58"/>
        <path d="M211 120l-13 58m57-76-18 79m151-61 13 61m-57-79 18 80" stroke-width="4" opacity=".4"/>
      </g>
      <g fill="#f7edda" opacity=".66">
        <path d="M164 330l42-11-31 31Z"/><path d="M436 328l-41-10 30 30Z"/>
        <path d="M252 482l29-10-18 31Z"/><path d="M350 482l-30-10 19 31Z"/>
        <circle cx="198" cy="223" r="5"/><circle cx="408" cy="236" r="4"/><circle cx="303" cy="142" r="6"/>
      </g>
    </svg>`
  },
  {
    id: 'finish-clean',
    name: 'Clean Asset',
    shortName: 'Clean',
    blendMode: 'source-over',
    opacity: 0,
    tags: ['clean','none'],
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="No finishing plate"></svg>'
  }
];
