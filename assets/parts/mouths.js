window.MONSTER_PARTS = window.MONSTER_PARTS || {};

window.MONSTER_PARTS.mouths = [
  {
    id: 'mouth-none',
    name: 'No Mouth',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="No mouth"></svg>',
    tags: ['none']
  },
  {
    id: 'mouth-grin',
    name: 'Toothy Grin',
    seamProfile: 'wide',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Toothy grin">
      <defs>
        <clipPath id="mouth-grin-clip"><path d="M154 407C194 382 247 390 300 400C353 389 406 382 446 407C435 462 383 499 301 505C218 502 167 462 154 407Z"/></clipPath>
      </defs>
      <path d="M154 407C194 382 247 390 300 400C353 389 406 382 446 407C435 462 383 499 301 505C218 502 167 462 154 407Z" fill="#171512" stroke="#171512" stroke-width="15" stroke-linejoin="round"/>
      <g clip-path="url(#mouth-grin-clip)">
        <path d="M162 413C211 397 253 406 300 414C350 405 392 397 438 413" fill="none" stroke="#c85f75" stroke-width="19" stroke-linecap="round"/>
        <path d="M176 463C218 489 258 494 301 496C347 494 387 487 425 461C400 501 357 520 301 522C245 519 201 501 176 463Z" fill="#351719" opacity=".72"/>
        <g fill="#f2dfb7" stroke="#171512" stroke-width="5" stroke-linejoin="round">
          <path d="M177 411L188 448L204 414Z"/><path d="M205 408L217 454L233 412Z"/>
          <path d="M234 409L246 448L261 412Z"/><path d="M263 412L274 457L290 414Z"/>
          <path d="M292 414L302 451L317 413Z"/><path d="M320 412L332 456L347 410Z"/>
          <path d="M349 409L361 449L376 408Z"/><path d="M378 409L389 452L405 408Z"/>
          <path d="M407 412L418 445L431 414Z"/>
          <path d="M209 482L224 461L243 487Z"/><path d="M267 495L285 469L304 497Z"/>
          <path d="M307 497L327 470L345 493Z"/><path d="M361 486L377 461L394 480Z"/>
        </g>
        <path d="M254 487C273 473 291 472 305 481C319 472 338 474 353 489C333 507 278 507 254 487Z" fill="#a8455d" stroke="#171512" stroke-width="6"/>
        <path d="M303 483C309 491 309 499 304 506" fill="none" stroke="#6e2c40" stroke-width="4" stroke-linecap="round"/>
      </g>
      <path d="M146 408C151 420 152 433 150 445M454 407C449 421 448 434 451 446" fill="none" stroke="#171512" stroke-width="7" stroke-linecap="round" opacity=".72"/>
      <path d="M163 397L178 391M437 396L422 390" stroke="#f5d4a0" stroke-width="5" stroke-linecap="round" opacity=".55"/>
    </svg>`,
    tags: ['grin', 'teeth', 'clipped-interior']
  },
  {
    id: 'mouth-gummy',
    name: 'Gummy Smile',
    seamProfile: 'wide',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Gummy smile">
      <defs><clipPath id="mouth-gummy-clip"><path d="M165 412C206 390 252 399 300 409C350 398 395 391 435 412C422 469 375 500 301 504C226 500 179 470 165 412Z"/></clipPath></defs>
      <path d="M165 412C206 390 252 399 300 409C350 398 395 391 435 412C422 469 375 500 301 504C226 500 179 470 165 412Z" fill="#171512" stroke="#171512" stroke-width="15"/>
      <g clip-path="url(#mouth-gummy-clip)">
        <path d="M174 416C222 397 263 411 300 417C341 410 382 398 426 416" fill="none" stroke="#cf687e" stroke-width="26" stroke-linecap="round"/>
        <ellipse cx="300" cy="468" rx="104" ry="35" fill="#8d3c56" stroke="#171512" stroke-width="8"/>
        <path d="M197 420C211 443 211 458 204 472M236 418C248 442 248 461 241 477M276 420C286 445 286 463 281 481M320 420C311 445 311 464 316 481M361 418C350 443 350 461 357 477M401 420C388 444 389 459 396 472" fill="none" stroke="#f1dfb9" stroke-width="18" stroke-linecap="round"/>
        <path d="M222 472C247 486 274 491 300 491C329 491 357 485 379 472" fill="none" stroke="#d57a8b" stroke-width="7" stroke-linecap="round" opacity=".55"/>
      </g>
      <path d="M157 414C164 429 164 443 159 457M443 414C436 429 436 443 441 457" fill="none" stroke="#171512" stroke-width="7" stroke-linecap="round" opacity=".7"/>
    </svg>`,
    tags: ['gums', 'rounded', 'clipped-interior']
  },
  {
    id: 'mouth-fangs',
    name: 'Fangs',
    seamProfile: 'medium',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Fanged mouth">
      <defs><clipPath id="mouth-fangs-clip"><path d="M178 409C216 390 258 399 300 407C343 399 385 390 422 409C409 465 364 495 300 499C235 496 191 465 178 409Z"/></clipPath></defs>
      <path d="M178 409C216 390 258 399 300 407C343 399 385 390 422 409C409 465 364 495 300 499C235 496 191 465 178 409Z" fill="#171512" stroke="#171512" stroke-width="15"/>
      <g clip-path="url(#mouth-fangs-clip)" fill="#f3e0b9" stroke="#171512" stroke-linejoin="round">
        <path d="M198 409C207 442 215 468 232 483C248 456 251 431 245 410Z" stroke-width="6"/>
        <path d="M355 410C349 432 352 456 368 483C385 468 393 442 402 409Z" stroke-width="6"/>
        <path d="M247 414L259 451L273 414Z" stroke-width="5"/><path d="M277 417L289 456L303 418Z" stroke-width="5"/>
        <path d="M307 418L320 456L333 416Z" stroke-width="5"/><path d="M338 414L350 450L364 412Z" stroke-width="5"/>
        <path d="M245 478L260 458L276 483Z" stroke-width="5"/><path d="M325 482L341 458L357 476Z" stroke-width="5"/>
      </g>
      <path d="M188 455C214 479 251 489 300 491C349 489 385 479 412 455" fill="none" stroke="#782f43" stroke-width="7" opacity=".72"/>
      <path d="M169 409L184 397M431 409L416 397" stroke="#171512" stroke-width="7" stroke-linecap="round"/>
    </svg>`,
    tags: ['fangs', 'clipped-interior']
  },
  {
    id: 'mouth-jagged',
    name: 'Jagged',
    seamProfile: 'wide',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Jagged mouth">
      <defs><clipPath id="mouth-jagged-clip"><path d="M157 406C200 385 251 393 300 402C351 392 401 385 443 406C431 470 377 506 301 511C223 507 169 470 157 406Z"/></clipPath></defs>
      <path d="M157 406C200 385 251 393 300 402C351 392 401 385 443 406C431 470 377 506 301 511C223 507 169 470 157 406Z" fill="#171512" stroke="#171512" stroke-width="15" stroke-linejoin="round"/>
      <g clip-path="url(#mouth-jagged-clip)" fill="#f2dfb7" stroke="#171512" stroke-width="5" stroke-linejoin="round">
        <path d="M170 409L183 456L199 410Z"/><path d="M198 408L211 470L228 410Z"/><path d="M227 409L240 455L257 411Z"/>
        <path d="M256 411L270 472L286 413Z"/><path d="M285 414L299 456L315 413Z"/><path d="M314 412L329 472L344 410Z"/>
        <path d="M343 410L357 455L373 408Z"/><path d="M372 408L386 468L402 408Z"/><path d="M401 410L414 452L430 411Z"/>
        <path d="M189 484L207 458L224 490L244 462L262 498L282 467L301 497L321 466L341 497L361 461L379 489L397 458L414 480"/>
      </g>
      <path d="M174 468C213 496 258 506 301 507C348 505 390 494 427 466" fill="none" stroke="#8d354a" stroke-width="7" opacity=".8"/>
      <path d="M151 407L168 394M449 406L432 394" stroke="#171512" stroke-width="7" stroke-linecap="round"/>
    </svg>`,
    tags: ['sharp', 'jagged', 'clipped-interior']
  },
  {
    id: 'mouth-tongue',
    name: 'Tongue Out',
    seamProfile: 'medium',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Tongue out mouth">
      <defs><clipPath id="mouth-tongue-clip"><path d="M174 409C213 389 258 398 300 406C345 398 389 389 426 409C414 467 369 495 301 499C233 496 187 467 174 409Z"/></clipPath></defs>
      <path d="M174 409C213 389 258 398 300 406C345 398 389 389 426 409C414 467 369 495 301 499C233 496 187 467 174 409Z" fill="#171512" stroke="#171512" stroke-width="15"/>
      <g clip-path="url(#mouth-tongue-clip)">
        <path d="M184 414C226 398 263 410 301 417C341 409 378 398 416 414" fill="none" stroke="#c85f75" stroke-width="17" stroke-linecap="round"/>
        <g fill="#f2dfb7" stroke="#171512" stroke-width="5">
          <path d="M194 411L207 450L224 413Z"/><path d="M232 414L244 453L261 415Z"/>
          <path d="M339 415L356 453L368 414Z"/><path d="M376 413L393 450L406 411Z"/>
        </g>
      </g>
      <path d="M237 454C260 438 283 437 301 449C321 437 345 439 364 455C355 512 334 542 301 548C268 543 246 512 237 454Z" fill="#c95d75" stroke="#171512" stroke-width="10" stroke-linejoin="round"/>
      <path d="M301 453C310 481 311 516 301 536" fill="none" stroke="#7b3047" stroke-width="6" stroke-linecap="round"/>
      <path d="M251 474C265 466 276 464 287 467M316 467C328 464 340 468 350 476" fill="none" stroke="#e88798" stroke-width="5" stroke-linecap="round" opacity=".65"/>
      <path d="M166 410L181 397M434 410L419 397" stroke="#171512" stroke-width="7" stroke-linecap="round"/>
    </svg>`,
    tags: ['tongue', 'clipped-interior']
  },
  {
    id: 'mouth-buck',
    name: 'Buck Tooth',
    seamProfile: 'narrow',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Buck tooth mouth">
      <defs><clipPath id="mouth-buck-clip"><path d="M184 417C220 398 261 405 300 413C340 405 381 398 416 417C403 467 362 490 301 494C239 491 197 467 184 417Z"/></clipPath></defs>
      <path d="M184 417C220 398 261 405 300 413C340 405 381 398 416 417C403 467 362 490 301 494C239 491 197 467 184 417Z" fill="#171512" stroke="#171512" stroke-width="15"/>
      <g clip-path="url(#mouth-buck-clip)" fill="#f2dfb7" stroke="#171512" stroke-linejoin="round">
        <path d="M255 412C258 443 267 472 287 486C297 468 299 440 296 413Z" stroke-width="6"/>
        <path d="M304 413C301 440 303 468 313 486C333 472 342 443 345 412Z" stroke-width="6"/>
        <path d="M207 420L219 453L235 421Z" stroke-width="5"/><path d="M365 421L381 453L393 420Z" stroke-width="5"/>
      </g>
      <path d="M269 427L279 431M321 431L331 427" stroke="#c9b180" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path d="M176 417L190 406M424 417L410 406" stroke="#171512" stroke-width="7" stroke-linecap="round"/>
    </svg>`,
    tags: ['buck-tooth', 'narrow', 'clipped-interior']
  },
  {
    id: 'mouth-roar',
    name: 'Open Roar',
    seamProfile: 'roar',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Open roar">
      <defs><clipPath id="mouth-roar-clip"><path d="M210 382C235 355 267 350 300 360C334 350 367 355 390 382C426 422 418 489 390 520C365 544 333 553 300 551C266 553 234 544 210 520C181 489 174 422 210 382Z"/></clipPath></defs>
      <path d="M210 382C235 355 267 350 300 360C334 350 367 355 390 382C426 422 418 489 390 520C365 544 333 553 300 551C266 553 234 544 210 520C181 489 174 422 210 382Z" fill="#171512" stroke="#171512" stroke-width="16" stroke-linejoin="round"/>
      <g clip-path="url(#mouth-roar-clip)">
        <path d="M220 389C244 371 272 372 300 381C329 372 357 371 380 389" fill="none" stroke="#c85f75" stroke-width="18" stroke-linecap="round"/>
        <g fill="#f2dfb7" stroke="#171512" stroke-width="5" stroke-linejoin="round">
          <path d="M225 386L238 437L253 386Z"/><path d="M255 379L269 444L284 378Z"/>
          <path d="M286 379L300 438L315 378Z"/><path d="M317 378L332 444L346 379Z"/>
          <path d="M348 385L363 437L377 386Z"/>
          <path d="M231 521L248 487L266 528Z"/><path d="M267 535L284 496L301 539Z"/>
          <path d="M303 539L321 496L337 535Z"/><path d="M339 528L357 487L374 520Z"/>
        </g>
        <ellipse cx="300" cy="501" rx="63" ry="38" fill="#c95d75" stroke="#171512" stroke-width="8"/>
        <path d="M272 501C288 491 309 491 328 501" fill="none" stroke="#e8899a" stroke-width="6" stroke-linecap="round" opacity=".65"/>
      </g>
      <path d="M200 390C190 410 187 430 189 450M400 390C410 410 413 430 411 450" fill="none" stroke="#171512" stroke-width="7" stroke-linecap="round" opacity=".75"/>
    </svg>`,
    tags: ['open', 'roar', 'clipped-interior']
  },
  {
    id: 'mouth-gapped',
    name: 'Gapped Grin',
    seamProfile: 'wide',
    svg: String.raw`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Gapped grin">
      <defs><clipPath id="mouth-gapped-clip"><path d="M160 409C201 386 251 395 300 404C350 395 400 386 440 409C428 469 377 503 301 508C224 505 172 470 160 409Z"/></clipPath></defs>
      <path d="M160 409C201 386 251 395 300 404C350 395 400 386 440 409C428 469 377 503 301 508C224 505 172 470 160 409Z" fill="#171512" stroke="#171512" stroke-width="15"/>
      <g clip-path="url(#mouth-gapped-clip)" fill="#f2dfb7" stroke="#171512" stroke-width="5" stroke-linejoin="round">
        <path d="M186 410L198 451L214 412Z"/><path d="M223 412L235 458L252 414Z"/>
        <path d="M275 417L287 463L304 418Z"/><path d="M328 415L341 459L357 413Z"/>
        <path d="M381 411L393 451L409 410Z"/>
        <path d="M217 485L232 463L250 489Z"/><path d="M274 498L291 473L308 499Z"/>
        <path d="M333 489L350 463L366 483Z"/>
      </g>
      <path d="M184 467C216 493 259 502 301 503C345 502 388 491 416 465" fill="none" stroke="#8b344a" stroke-width="7" opacity=".78"/>
      <path d="M152 410L169 396M448 409L431 396" stroke="#171512" stroke-width="7" stroke-linecap="round"/>
    </svg>`,
    tags: ['gapped', 'clipped-interior']
  }
];
