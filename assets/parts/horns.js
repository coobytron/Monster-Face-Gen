window.MONSTER_PARTS = window.MONSTER_PARTS || {};

window.MONSTER_PARTS.horns = [
  {
    id: 'horn-none',
    name: 'No Horns / Ears',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="No horns"></svg>',
    tags: ['none']
  },
  {
    id: 'horn-curved',
    name: 'Curved Horns',
    rootProfile: 'curved',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Curved horns">
      <g transform="translate(170 201) rotate(-8) scale(-1 1)">
        <path d="M-42 27C-65-34-64-87-20-128C-31-82-13-37 39 29C18 39-20 40-42 27Z" fill="#caa777" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
        <path d="M-39 22C-18 10 10 11 33 24" fill="none" stroke="#6e5036" stroke-width="7" stroke-linecap="round"/>
        <path d="M-31 4C-13-7 8-7 26 6M-23-14C-8-24 7-24 20-12M-15-32C-4-41 8-42 16-30M-8-51C1-59 10-60 14-48M-2-70C4-76 10-78 13-67" fill="none" stroke="#725237" stroke-width="5" stroke-linecap="round"/>
        <path d="M-23-103C-12-113 0-120 9-122" fill="none" stroke="#f0d29a" stroke-width="5" stroke-linecap="round" opacity=".62"/>
      </g>
      <g transform="translate(430 201) rotate(8)">
        <path d="M-42 27C-65-34-64-87-20-128C-31-82-13-37 39 29C18 39-20 40-42 27Z" fill="#caa777" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
        <path d="M-39 22C-18 10 10 11 33 24" fill="none" stroke="#6e5036" stroke-width="7" stroke-linecap="round"/>
        <path d="M-31 4C-13-7 8-7 26 6M-23-14C-8-24 7-24 20-12M-15-32C-4-41 8-42 16-30M-8-51C1-59 10-60 14-48M-2-70C4-76 10-78 13-67" fill="none" stroke="#725237" stroke-width="5" stroke-linecap="round"/>
        <path d="M-23-103C-12-113 0-120 9-122" fill="none" stroke="#f0d29a" stroke-width="5" stroke-linecap="round" opacity=".62"/>
      </g>
    </svg>`,
    tags: ['horns', 'curved', 'authored-root']
  },
  {
    id: 'horn-spiky',
    name: 'Spiky Horns',
    rootProfile: 'spiky',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Spiky horns">
      <path d="M128 228L154 72L207 225C184 237 151 239 128 228Z" fill="#bca06e" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
      <path d="M393 225L446 72L472 228C449 239 416 237 393 225Z" fill="#bca06e" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
      <path d="M139 210C160 199 183 200 201 217M399 217C417 200 440 199 461 210" fill="none" stroke="#684c34" stroke-width="7" stroke-linecap="round"/>
      <path d="M148 177L190 187M151 143L186 152M156 111L181 118M410 187L452 177M414 152L449 143M419 118L444 111" stroke="#6c4e35" stroke-width="5" stroke-linecap="round"/>
      <path d="M164 88L169 103M436 88L431 103" stroke="#eed09a" stroke-width="5" stroke-linecap="round" opacity=".6"/>
    </svg>`,
    tags: ['horns', 'sharp', 'authored-root']
  },
  {
    id: 'horn-nubs',
    name: 'Small Nubs',
    rootProfile: 'nubs',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Horn nubs">
      <path d="M169 222C162 185 171 148 196 126C219 153 226 185 218 226C202 235 184 234 169 222Z" fill="#c7a36f" stroke="#171512" stroke-width="11"/>
      <path d="M382 226C374 185 381 153 404 126C429 148 438 185 431 222C416 234 398 235 382 226Z" fill="#c7a36f" stroke="#171512" stroke-width="11"/>
      <path d="M174 209C190 199 204 200 216 211M384 211C396 200 410 199 426 209" fill="none" stroke="#704f36" stroke-width="6" stroke-linecap="round"/>
      <path d="M187 173L209 181M391 181L413 173" stroke="#765438" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
    tags: ['horns', 'small', 'authored-root']
  },
  {
    id: 'horn-long',
    name: 'Long Points',
    rootProfile: 'long',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Long horns">
      <path d="M121 240C99 170 103 93 172 45C177 128 193 183 224 225C199 239 153 246 121 240Z" fill="#d0ad79" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
      <path d="M376 225C407 183 423 128 428 45C497 93 501 170 479 240C447 246 401 239 376 225Z" fill="#d0ad79" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
      <path d="M128 221C151 207 189 208 216 223M384 223C411 208 449 207 472 221" fill="none" stroke="#735338" stroke-width="7" stroke-linecap="round"/>
      <path d="M132 184L191 197M128 148L183 159M132 112L176 121M409 197L468 184M417 159L472 148M424 121L468 112" stroke="#745438" stroke-width="5" stroke-linecap="round"/>
      <path d="M155 64L163 83M445 64L437 83" stroke="#f2d49d" stroke-width="5" stroke-linecap="round" opacity=".62"/>
    </svg>`,
    tags: ['horns', 'long', 'authored-root']
  },
  {
    id: 'horn-rams',
    name: 'Curly Rams',
    rootProfile: 'rams',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Ram horns">
      <path d="M186 229C124 227 91 187 104 121C116 58 176 44 214 76C251 108 236 158 203 177C176 193 143 176 137 149C132 126 148 104 171 103C190 102 203 117 196 134C191 146 179 151 166 145C176 164 195 161 207 145C225 121 211 96 188 91C148 82 123 112 124 145C124 188 154 203 194 197Z" fill="#b99a69" stroke="#171512" stroke-width="13" fill-rule="evenodd" stroke-linejoin="round"/>
      <path d="M414 229C476 227 509 187 496 121C484 58 424 44 386 76C349 108 364 158 397 177C424 193 457 176 463 149C468 126 452 104 429 103C410 102 397 117 404 134C409 146 421 151 434 145C424 164 405 161 393 145C375 121 389 96 412 91C452 82 477 112 476 145C476 188 446 203 406 197Z" fill="#b99a69" stroke="#171512" stroke-width="13" fill-rule="evenodd" stroke-linejoin="round"/>
      <path d="M116 181C137 197 159 203 187 201M484 181C463 197 441 203 413 201" fill="none" stroke="#715138" stroke-width="7" stroke-linecap="round"/>
      <path d="M121 128L151 136M134 92L163 104M449 136L479 128M437 104L466 92" stroke="#725238" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
    tags: ['horns', 'curled', 'authored-root']
  },
  {
    id: 'horn-bat',
    name: 'Bat Ears',
    rootProfile: 'bat',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Bat ears">
      <path d="M145 266C91 239 67 189 103 112C137 151 174 178 210 209L198 284C178 283 159 276 145 266Z" fill="#865078" stroke="#171512" stroke-width="13" stroke-linejoin="round"/>
      <path d="M455 266C509 239 533 189 497 112C463 151 426 178 390 209L402 284C422 283 441 276 455 266Z" fill="#865078" stroke="#171512" stroke-width="13" stroke-linejoin="round"/>
      <path d="M132 226C115 196 113 164 119 141C145 172 170 192 192 217M468 226C485 196 487 164 481 141C455 172 430 192 408 217" fill="none" stroke="#d57891" stroke-width="8" stroke-linecap="round"/>
      <path d="M151 253C167 244 184 246 199 260M449 253C433 244 416 246 401 260" fill="none" stroke="#542e4b" stroke-width="7" stroke-linecap="round"/>
    </svg>`,
    tags: ['ears', 'bat', 'authored-root']
  },
  {
    id: 'horn-tufted',
    name: 'Tufted Ears',
    rootProfile: 'tufted',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Tufted ears">
      <path d="M149 265C100 247 82 207 108 149C143 167 177 193 205 220L197 284C178 282 161 274 149 265Z" fill="#a36c5b" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
      <path d="M451 265C500 247 518 207 492 149C457 167 423 193 395 220L403 284C422 282 439 274 451 265Z" fill="#a36c5b" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
      <path d="M116 163L94 132M132 170L127 132M151 181L164 145M484 163L506 132M468 170L473 132M449 181L436 145" stroke="#e9c996" stroke-width="8" stroke-linecap="round"/>
      <path d="M150 251C165 243 184 246 199 260M450 251C435 243 416 246 401 260" fill="none" stroke="#653f34" stroke-width="7" stroke-linecap="round"/>
    </svg>`,
    tags: ['ears', 'tufted', 'authored-root']
  },
  {
    id: 'horn-bent',
    name: 'Bent Horns',
    rootProfile: 'bent',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Bent horns">
      <path d="M132 241C101 200 91 142 138 78C189 92 215 125 196 170C186 196 194 213 224 226C199 241 158 247 132 241Z" fill="#bda171" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
      <path d="M468 241C499 200 509 142 462 78C411 92 385 125 404 170C414 196 406 213 376 226C401 241 442 247 468 241Z" fill="#bda171" stroke="#171512" stroke-width="12" stroke-linejoin="round"/>
      <path d="M135 221C157 209 194 210 216 225M384 225C406 210 443 209 465 221" fill="none" stroke="#6d5038" stroke-width="7" stroke-linecap="round"/>
      <path d="M128 184L190 196M129 148L192 160M410 196L472 184M408 160L471 148" stroke="#6f5139" stroke-width="5" stroke-linecap="round"/>
      <path d="M146 94L160 110M454 94L440 110" stroke="#efd19a" stroke-width="5" stroke-linecap="round" opacity=".62"/>
    </svg>`,
    tags: ['horns', 'bent', 'authored-root']
  }
];
