'use strict';
const fs=require('fs');
const path=require('path');

const ROOT=path.resolve(__dirname,'..');
const START='<!-- HERO-FIDELITY-V9:START -->';
const END='<!-- HERO-FIDELITY-V9:END -->';

function upsert(relativePath,beforeHeading,body){
  const filename=path.join(ROOT,relativePath);
  let content=fs.readFileSync(filename,'utf8');
  const expression=new RegExp(`\\n?${START}[\\s\\S]*?${END}\\n?`,'m');
  content=content.replace(expression,'\n');
  const block=`${START}\n${body.trim()}\n${END}\n\n`;
  const index=content.indexOf(beforeHeading);
  content=index>=0?`${content.slice(0,index)}${block}${content.slice(index)}`:`${content.trimEnd()}\n\n${block}`;
  fs.writeFileSync(filename,content.replace(/\n{3,}/g,'\n\n'));
}

upsert('README.md','## V9 hybrid authored asset bundles',`
## V9.4 near-final hero artwork

The three locked fidelity recipes now resolve to **21 original re-authored components** behind their existing stable IDs. The replacement pack in \`assets/hero-v9/\` covers each hero base, eye set, nose, mouth, horn set, pattern, and extra while leaving every non-hero asset and recipe available.

- \`bog-cyclops-grin\` — irregular teal blob silhouette, dominant asymmetrical cyclops eye, varied tooth cadence, and curved horn surface wear
- \`fuzz-fanged\` — broken orange fur rhythm, weighted sleepy lids, long fangs, and bent horn integration
- \`imp-roar\` — compressed purple imp silhouette, startled mismatched eyes, deep open roar, tongue volume, and spiky crown treatment

\`base-bog-hybrid-v2\` updates the six-layer hybrid fixture to the same hero artwork while retaining parent ID \`base-bog\`. The exact mouth and horn pair plates from v9 remain active. Runtime code still performs composition only; it does not draw, infer, mutate, or sketch anatomy.

See \`docs/HERO-FIDELITY-V9.md\` for the stable-ID inventory, art-direction changes, runtime boundary, and review procedure. \`npm run qa\` now generates one before/after summary and one large multi-scale comparison board per hero across cream, white, black, and transparent backgrounds.
`);

upsert('docs/ASSET-GUIDE.md','## Hybrid authored bundle contract',`
## Near-final hero replacement contract

The v9.4 hero pass uses a load-after replacement pack in \`assets/hero-v9/\`. A replacement must use an already-published stable ID, inherit the original placement slots, and replace authored artwork without changing compatibility or export identity.

Every hero replacement must declare:

- \`heroRevision: 9.4.0\`
- \`authored: true\`
- \`runtimeGeometry: false\`
- the \`hero-v9\` tag
- the shared \`0 0 600 600\` viewBox

The complete required inventory is three bases, three eye sets, three noses, three mouths, three horn sets, three patterns, and three extras. The three locked recipes must resolve all seven visible selections to this inventory and retain their exact pair-specific mouth and horn junctions.

Replacement SVG may contain authored anatomy because it is production artwork loaded as data. Runtime scripts may not construct, morph, infer, or sketch that anatomy. Rough.js, procedural path commands, embedded scripts, event handlers, \`foreignObject\`, and flattened reference-board crops are forbidden.

Review all three heroes using the deterministic boards described in \`docs/HERO-FIDELITY-V9.md\`. Human acceptance remains at least 4/5 for silhouette strength, attachment integration, expression read, detail density, and thumbnail read.
`);

console.log('Hero fidelity README and asset guide sections are current.');
