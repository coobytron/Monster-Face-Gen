'use strict'
const fs=require('fs')
const path=require('path')
const crypto=require('crypto')
const vm=require('vm')
const root=path.resolve(__dirname,'..')
const pack=require('../assets/v10-heads')
const integration=require('../assets/v10-head-integration')
const manifest=require('../assets/v10-head-manifest.json')
const BASELINE_BASE_FILES=['assets/parts/bases.js','assets/library-v9/bases.js','assets/hero-v9/bases.js']
const BROWSER_FILES=['assets/parts/bases.js','assets/parts/mouths.js','assets/parts/horns.js','assets/library-v9/bases.js','assets/hero-v9/bases.js','assets/v10-mouth-assets-01.js','assets/v10-mouth-assets-02.js','assets/v10-mouth-assets-03.js','assets/v10-mouth-fixtures.js','assets/v10-mouths.js','assets/v10-head-assets-01.js','assets/v10-head-assets-02.js','assets/v10-head-assets-03.js','assets/v10-head-assets-04.js','assets/v10-head-assets-05.js','assets/v10-head-assets-06.js','assets/v10-head-fixtures.js','assets/v10-heads.js','assets/junctions.js','assets/pair-junctions.js','assets/compatibility.js','assets/v10-head-seams-01.js','assets/v10-head-seams-02.js','assets/v10-head-seams-03.js','assets/v10-head-seams-04.js','assets/v10-head-seams-05.js','assets/v10-head-junctions-01.js','assets/v10-head-junctions-02.js','assets/v10-head-junctions-03.js','assets/v10-head-junctions-04.js','assets/v10-head-junctions-05.js','assets/v10-head-junctions-06.js','assets/v10-head-compatibility-01.js','assets/v10-head-compatibility-02.js','assets/v10-head-placements.js','assets/v10-head-integration.js']
const RADIAL_BINS=48
const DISTINCTION_FLOOR=0.08
const WEIGHTS={aspect:0.6,fill:0.8,complexity:0.25,balance:0.8}

function stable(value){if(Array.isArray(value))return value.map(stable);if(value&&typeof value==='object')return Object.keys(value).sort().reduce((out,key)=>(out[key]=stable(value[key]),out),{});return value}
function loadBrowserState(){
  const context={window:{},console};vm.createContext(context)
  for(const file of BROWSER_FILES) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file})
  return context.window
}
function inner(svg){return svg.replace(/^\s*<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'')}
function prefix(svg,scope){const ids=[...svg.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);let out=svg;for(const id of ids){out=out.replaceAll(`id="${id}"`,`id="${scope}-${id}"`).replaceAll(`url(#${id})`,`url(#${scope}-${id})`).replaceAll(`href="#${id}"`,`href="#${scope}-${id}"`)}return out}
function transformFor(value){const x=Math.round((value?.x||0)*600),y=Math.round((value?.y||0)*600),s=value?.scale||1,r=value?.rotation||0;return `translate(${x} ${y}) translate(300 300) rotate(${r}) scale(${s}) translate(-300 -300)`}

// --- authoring-time silhouette geometry -------------------------------------
// Flattening and sampling run in QA only. Runtime never touches these helpers.
function flatten(d){
  const tokens=d.match(/[MLQCZHV]|-?\d+(?:\.\d+)?/gi)||[]
  const pts=[];let i=0,command='M',current=[0,0],start=[0,0]
  const num=()=>Number(tokens[i++])
  const curve=(controls,end,order)=>{
    for(let step=1;step<=16;step++){
      const t=step/16,u=1-t
      if(order===2){const [c]=controls;pts.push([u*u*current[0]+2*u*t*c[0]+t*t*end[0],u*u*current[1]+2*u*t*c[1]+t*t*end[1]])}
      else{const [a,b]=controls;pts.push([u*u*u*current[0]+3*u*u*t*a[0]+3*u*t*t*b[0]+t*t*t*end[0],u*u*u*current[1]+3*u*u*t*a[1]+3*u*t*t*b[1]+t*t*t*end[1]])}
    }
    current=end
  }
  while(i<tokens.length){
    const token=tokens[i]
    if(/[MLQCZHV]/i.test(token)){command=token.toUpperCase();i++}
    if(command==='Z'){if(start)pts.push([...start]);current=[...start];i++;continue}
    if(command==='M'){current=[num(),num()];start=[...current];pts.push([...current]);command='L';continue}
    if(command==='L'){current=[num(),num()];pts.push([...current]);continue}
    if(command==='H'){current=[num(),current[1]];pts.push([...current]);continue}
    if(command==='V'){current=[current[0],num()];pts.push([...current]);continue}
    if(command==='Q'){const c=[num(),num()];curve([c],[num(),num()],2);continue}
    if(command==='C'){const a=[num(),num()],b=[num(),num()];curve([a,b],[num(),num()],3);continue}
    i++
  }
  return pts
}
const IDENTITY=[1,0,0,1,0,0]
function multiply(m,n){return [m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]]}
function applyMatrix(m,[x,y]){return [m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]]}
function parseTransform(value){
  let matrix=IDENTITY
  for(const part of value.matchAll(/(translate|scale|rotate|matrix)\s*\(([^)]*)\)/g)){
    const args=(part[2].match(/-?\d+(?:\.\d+)?/g)||[]).map(Number)
    if(part[1]==='translate') matrix=multiply(matrix,[1,0,0,1,args[0]||0,args[1]||0])
    else if(part[1]==='scale') matrix=multiply(matrix,[args[0]??1,0,0,args[1]??args[0]??1,0,0])
    else if(part[1]==='matrix') matrix=multiply(matrix,args.slice(0,6))
    else{
      const radians=((args[0]||0)*Math.PI)/180,cos=Math.cos(radians),sin=Math.sin(radians)
      const cx=args[1]||0,cy=args[2]||0
      matrix=multiply(multiply(multiply(matrix,[1,0,0,1,cx,cy]),[cos,sin,-sin,cos,0,0]),[1,0,0,1,-cx,-cy])
    }
  }
  return matrix
}
// Transform-aware content bounds for third-party part assets, which nest their
// geometry inside translated, rotated, and mirrored groups.
function contentBounds(svg){
  const stack=[IDENTITY]
  const points=[]
  for(const token of svg.matchAll(/<\/g>|<g\b[^>]*>|<(?:path|circle|ellipse|rect)\b[^>]*>/g)){
    const tag=token[0]
    if(tag==='</g>'){if(stack.length>1)stack.pop();continue}
    const transform=(tag.match(/\btransform="([^"]+)"/)||[])[1]
    if(tag.startsWith('<g')){stack.push(multiply(stack[stack.length-1],transform?parseTransform(transform):IDENTITY));continue}
    const matrix=transform?multiply(stack[stack.length-1],parseTransform(transform)):stack[stack.length-1]
    const number=key=>Number((tag.match(new RegExp(`\\b${key}="(-?[\\d.]+)"`))||[])[1]||0)
    const d=(tag.match(/\bd="([^"]+)"/)||[])[1]
    if(d){for(const point of flatten(d))points.push(applyMatrix(matrix,point));continue}
    if(/^<rect/.test(tag)){
      const x=number('x'),y=number('y'),width=number('width'),height=number('height')
      for(const corner of [[x,y],[x+width,y],[x,y+height],[x+width,y+height]]) points.push(applyMatrix(matrix,corner))
      continue
    }
    const cx=number('cx'),cy=number('cy'),rx=number('rx')||number('r'),ry=number('ry')||number('r')
    for(const corner of [[cx-rx,cy-ry],[cx+rx,cy-ry],[cx-rx,cy+ry],[cx+rx,cy+ry]]) points.push(applyMatrix(matrix,corner))
  }
  if(!points.length) return null
  const xs=points.map(point=>point[0]),ys=points.map(point=>point[1])
  return [Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)]
}
function contentPoints(svg){
  const stack=[IDENTITY]
  const points=[]
  for(const token of svg.matchAll(/<\/g>|<g\b[^>]*>|<(?:path|circle|ellipse|rect)\b[^>]*>/g)){
    const tag=token[0]
    if(tag==='</g>'){if(stack.length>1)stack.pop();continue}
    const transform=(tag.match(/\btransform="([^"]+)"/)||[])[1]
    if(tag.startsWith('<g')){stack.push(multiply(stack[stack.length-1],transform?parseTransform(transform):IDENTITY));continue}
    const matrix=transform?multiply(stack[stack.length-1],parseTransform(transform)):stack[stack.length-1]
    const number=key=>Number((tag.match(new RegExp(`\\b${key}="(-?[\\d.]+)"`))||[])[1]||0)
    const d=(tag.match(/\bd="([^"]+)"/)||[])[1]
    if(d){for(const point of flatten(d))points.push(applyMatrix(matrix,point));continue}
    if(/^<rect/.test(tag)){
      const x=number('x'),y=number('y'),width=number('width'),height=number('height')
      for(const corner of [[x,y],[x+width,y],[x,y+height],[x+width,y+height]]) points.push(applyMatrix(matrix,corner))
      continue
    }
    const cx=number('cx'),cy=number('cy'),rx=number('rx')||number('r'),ry=number('ry')||number('r')
    for(let step=0;step<16;step++){const angle=(step/16)*Math.PI*2;points.push(applyMatrix(matrix,[cx+rx*Math.cos(angle),cy+ry*Math.sin(angle)]))}
  }
  return points
}
function placePoints(points,override){
  const scale=override?.scale||1,dx=(override?.x||0)*600,dy=(override?.y||0)*600
  return points.map(([x,y])=>[300+scale*(x-300)+dx,300+scale*(y-300)+dy])
}
function placeBounds(bounds,override){
  const scale=override?.scale||1,dx=(override?.x||0)*600,dy=(override?.y||0)*600
  return [300+scale*(bounds[0]-300)+dx,300+scale*(bounds[1]-300)+dy,300+scale*(bounds[2]-300)+dx,300+scale*(bounds[3]-300)+dy]
}
function outlineOf(svg){
  const match=[...svg.matchAll(/<path\b[^>]*>/g)].find(tag=>/fill="url\(/.test(tag[0]))
  if(!match) return null
  return (match[0].match(/\bd="([^"]+)"/)||[])[1]||null
}
function centroid(pts){
  let area=0,cx=0,cy=0
  for(let i=0;i<pts.length;i++){
    const [x0,y0]=pts[i],[x1,y1]=pts[(i+1)%pts.length]
    const cross=x0*y1-x1*y0
    area+=cross;cx+=(x0+x1)*cross;cy+=(y0+y1)*cross
  }
  area/=2
  if(Math.abs(area)<1e-6) return [pts.reduce((s,p)=>s+p[0],0)/pts.length,pts.reduce((s,p)=>s+p[1],0)/pts.length]
  return [cx/(6*area),cy/(6*area)]
}
function inside(pts,[x,y]){
  let hit=false
  for(let i=0,j=pts.length-1;i<pts.length;j=i++){
    const [xi,yi]=pts[i],[xj,yj]=pts[j]
    if((yi>y)!==(yj>y)&&x<((xj-xi)*(y-yi))/(yj-yi)+xi) hit=!hit
  }
  return hit
}
function radialSignature(pts){
  const [cx,cy]=centroid(pts)
  const bins=new Array(RADIAL_BINS).fill(0)
  for(const [x,y] of pts){
    const angle=Math.atan2(y-cy,x-cx),radius=Math.hypot(x-cx,y-cy)
    const bin=Math.min(RADIAL_BINS-1,Math.floor(((angle+Math.PI)/(2*Math.PI))*RADIAL_BINS))
    bins[bin]=Math.max(bins[bin],radius)
  }
  for(let i=0;i<RADIAL_BINS;i++){
    if(bins[i]>0) continue
    let back=i,forward=i
    while(bins[(back+RADIAL_BINS)%RADIAL_BINS]===0) back--
    while(bins[forward%RADIAL_BINS]===0) forward++
    bins[i]=(bins[(back+RADIAL_BINS)%RADIAL_BINS]+bins[forward%RADIAL_BINS])/2
  }
  const mean=bins.reduce((sum,value)=>sum+value,0)/RADIAL_BINS
  return bins.map(value=>value/mean)
}
function descriptor(polygon){
  const xs=polygon.map(point=>point[0]),ys=polygon.map(point=>point[1])
  const width=Math.max(...xs)-Math.min(...xs),height=Math.max(...ys)-Math.min(...ys)
  let signed=0,perimeter=0
  for(let i=0;i<polygon.length;i++){
    const [x0,y0]=polygon[i],[x1,y1]=polygon[(i+1)%polygon.length]
    signed+=x0*y1-x1*y0
    perimeter+=Math.hypot(x1-x0,y1-y0)
  }
  signed/=2
  const area=Math.abs(signed)
  return {
    radial:radialSignature(polygon),
    aspect:width/height,
    fill:area/(width*height),
    complexity:perimeter/Math.sqrt(area),
    balance:(centroid(polygon)[1]-Math.min(...ys))/height
  }
}
// Structural distinction blends outline shape with proportion, coverage,
// outline complexity, and vertical mass so a recolour of an existing base
// scores zero and cannot be counted as new anatomy.
function signatureDistance(a,b){
  const radial=a.radial.reduce((sum,value,index)=>sum+Math.abs(value-b.radial[index]),0)/a.radial.length
  return radial
    +WEIGHTS.aspect*Math.abs(a.aspect-b.aspect)
    +WEIGHTS.fill*Math.abs(a.fill-b.fill)
    +WEIGHTS.complexity*Math.abs(a.complexity-b.complexity)
    +WEIGHTS.balance*Math.abs(a.balance-b.balance)
}
function baselineOutlines(){
  const context={window:{MONSTER_PARTS:{}},console};vm.createContext(context)
  for(const file of BASELINE_BASE_FILES) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file})
  return context.window.MONSTER_PARTS.bases.map(base=>({id:base.id,outline:outlineOf(base.svg)}))
}

function buildReport(){
  const errors=[]
  const ids=pack.assets.map(asset=>asset.id)
  if(pack.assets.length!==12) errors.push('expected 12 authored head bases')
  if(new Set(ids).size!==ids.length) errors.push('duplicate stable base ID')
  if(pack.baselineCount+pack.assets.length!==pack.targetCount) errors.push('head base count does not reach the V10 target of 18')
  const archetypes=pack.assets.map(asset=>asset.archetype)
  for(const archetype of pack.requiredArchetypes) if(!archetypes.includes(archetype)) errors.push(`archetype ${archetype} is not covered`)
  if(new Set(archetypes).size!==archetypes.length) errors.push('duplicate archetype coverage')

  const silhouettes=[]
  for(const asset of pack.assets){
    if(asset.authored!==true||asset.runtimeGeometry!==false) errors.push(`${asset.id} violates the authored runtime contract`)
    if(asset.reviewStatus!=='agent-candidate-pending-art-director') errors.push(`${asset.id} must stay an agent candidate`)
    if(!asset.svg.includes('viewBox="0 0 600 600"')) errors.push(`${asset.id} uses the wrong coordinate system`)
    if(/(<script|foreignObject|on\w+=|Math\.random|Date\()/i.test(asset.svg)) errors.push(`${asset.id} contains disallowed markup`)
    const outline=outlineOf(asset.svg)
    if(!outline){errors.push(`${asset.id} has no filled silhouette path`);continue}
    if(outline!==asset.outlinePath) errors.push(`${asset.id} outline metadata does not match its authored path`)
    const polygon=flatten(outline)
    const xs=polygon.map(point=>point[0]),ys=polygon.map(point=>point[1])
    if(Math.min(...xs)<12||Math.min(...ys)<12||Math.max(...xs)>588||Math.max(...ys)>588) errors.push(`${asset.id} escapes the transparent-edge safe area`)
    for(const key of pack.integrationZoneKeys){
      const zone=asset.integrationZones[key]
      if(!Array.isArray(zone)||zone.length!==4){errors.push(`${asset.id} is missing the ${key} integration zone`);continue}
      const [zx,zy,zw,zh]=zone
      const probes=key==='crown'
        ?[[zx,zy+zh],[zx+zw/2,zy+zh],[zx+zw,zy+zh],[zx+zw/2,zy+zh/2]]
        :[[zx,zy],[zx+zw,zy],[zx,zy+zh],[zx+zw,zy+zh],[zx+zw/2,zy+zh/2]]
      for(const probe of probes) if(!inside(polygon,probe)) errors.push(`${asset.id} ${key} zone detaches from the silhouette at ${probe.map(Math.round).join(',')}`)
    }
    const [mx,my,mw,mh]=asset.integrationZones.mouth
    if(!(mx>=100&&my>=340&&mx+mw<=500&&my+mh<=570)) errors.push(`${asset.id} mouth zone escapes the shared mouth-safe area`)
    silhouettes.push({id:asset.id,baseline:false,descriptor:descriptor(polygon)})
  }

  for(const base of baselineOutlines()){
    if(!base.outline){errors.push(`baseline ${base.id} has no filled silhouette path`);continue}
    silhouettes.push({id:base.id,baseline:true,descriptor:descriptor(flatten(base.outline))})
  }
  const distinction=[]
  for(let i=0;i<silhouettes.length;i++)for(let j=i+1;j<silhouettes.length;j++){
    distinction.push({a:silhouettes[i].id,b:silhouettes[j].id,baselinePair:silhouettes[i].baseline&&silhouettes[j].baseline,distance:Number(signatureDistance(silhouettes[i].descriptor,silhouettes[j].descriptor).toFixed(4))})
  }
  // The tightest approved v9 pair is the art-direction floor for "distinct".
  const baselinePairs=distinction.filter(item=>item.baselinePair).map(item=>item.distance)
  const threshold=Math.max(DISTINCTION_FLOOR,baselinePairs.length?Math.min(...baselinePairs):DISTINCTION_FLOOR)
  for(const item of distinction){
    if(!item.baselinePair&&item.distance<threshold) errors.push(`${item.a} and ${item.b} are not structurally distinct (${item.distance} < ${threshold})`)
  }

  const state=loadBrowserState()
  const outlines=Object.fromEntries(pack.assets.map(asset=>[asset.id,flatten(asset.outlinePath)]))
  const zones=Object.fromEntries(pack.assets.map(asset=>[asset.id,asset.integrationZones]))
  const partSvg=Object.fromEntries([...state.MONSTER_PARTS.mouths,...state.MONSTER_PARTS.horns].map(part=>[part.id,part.svg]))
  const seamIds=new Set(integration.baseSeams.map(seam=>seam.id))
  for(const fixture of pack.reviewFixtures){
    const polygon=outlines[fixture.baseId]
    const mouthGeometry=partSvg[fixture.mouthId]?contentPoints(partSvg[fixture.mouthId]):null
    if(!mouthGeometry) errors.push(`${fixture.mouthPairKey} mouth asset is missing`)
    else{
      const placed=placePoints(mouthGeometry,integration.placementOverrides[fixture.mouthPairKey])
      const escaped=placed.filter(point=>!inside(polygon,point))
      if(escaped.length) errors.push(`${fixture.mouthPairKey} clips the jaw at ${escaped.length} of ${placed.length} authored points`)
    }
    const hornBounds=partSvg[fixture.hornId]?contentBounds(partSvg[fixture.hornId]):null
    if(!hornBounds) errors.push(`${fixture.hornPairKey} crown asset is missing`)
    else{
      const [hx0,hy0,hx1,hy1]=placeBounds(hornBounds,integration.placementOverrides[fixture.hornPairKey])
      const [cx,cy,cw,ch]=zones[fixture.baseId].crown
      const overlap=Math.min(hy1,cy+ch)-Math.max(hy0,cy)
      if(overlap<20) errors.push(`${fixture.hornPairKey} crown root detaches from the crown zone (${Math.round(overlap)}px overlap)`)
      if(hx1<cx||hx0>cx+cw) errors.push(`${fixture.hornPairKey} crown root sits outside the crown zone span`)
      if(!inside(polygon,[(hx0+hx1)/2,Math.min(hy1,cy+ch)])) errors.push(`${fixture.hornPairKey} crown root does not land on the silhouette`)
    }
    for(const pairKey of [fixture.mouthPairKey,fixture.hornPairKey]){
      if(!integration.reviewPairKeys.includes(pairKey)) errors.push(`${pairKey} lacks an exact pair plate`)
      if(!integration.placementOverrides[pairKey]) errors.push(`${pairKey} lacks a rigid placement override`)
    }
    if(!seamIds.has(`mouth-seam-${fixture.baseId}`)) errors.push(`${fixture.baseId} lacks a fallback mouth seam`)
    if(!seamIds.has(`horn-seam-${fixture.baseId}`)) errors.push(`${fixture.baseId} lacks a fallback crown seam`)
  }
  for(const plate of integration.pairJunctions){
    if(plate.contentAudit.standaloneAnatomy!==false) errors.push(`${plate.pairKey} declares standalone anatomy`)
    if(!seamIds.has(plate.fallbackId)) errors.push(`${plate.pairKey} points at a missing fallback seam`)
  }

  const matrix=[]
  for(const fixture of pack.reviewFixtures)for(const background of pack.reviewBackgrounds)for(const scale of pack.reviewScales)for(const orientation of pack.reviewOrientations)
    matrix.push({fixtureId:fixture.id,baseId:fixture.baseId,background,scale,orientation,status:'candidate-review-required'})
  const canonical=JSON.stringify(stable({manifest,ids,pairs:integration.reviewPairKeys,distinction,matrix}))
  return stable({
    schemaVersion:'1.0.0',generatedAt:'1970-01-01T00:00:00.000Z',revision:'10.2.0',issue:40,
    valid:errors.length===0,errors,
    counts:{baselineBases:pack.baselineCount,newBases:pack.assets.length,totalBases:pack.baselineCount+pack.assets.length,fallbackSeams:integration.baseSeams.length,exactPairPlates:integration.pairJunctions.length,reviewCells:matrix.length},
    requiredArchetypes:pack.requiredArchetypes,reviewScales:pack.reviewScales,reviewBackgrounds:pack.reviewBackgrounds,reviewOrientations:pack.reviewOrientations,
    distinctionThreshold:threshold,minimumDistinction:distinction.length?Math.min(...distinction.filter(item=>!item.baselinePair).map(item=>item.distance)):0,
    digest:crypto.createHash('sha256').update(canonical).digest('hex'),reviewMatrix:matrix
  })
}

function buildSheet(state,scaleLabel){
  const size={'100%':600,'25%':150,'192px':192,'96px':96,'48px':48}[scaleLabel]
  const backgrounds={cream:'#ead9b7',white:'#fffdf7',black:'#171512',transparent:'none'}
  const cols=8,rows=pack.reviewFixtures.length,width=cols*size,height=rows*size
  const bases=Object.fromEntries(state.MONSTER_PARTS.bases.map(item=>[item.id,item]))
  const mouths=Object.fromEntries(state.MONSTER_PARTS.mouths.map(item=>[item.id,item]))
  const horns=Object.fromEntries(state.MONSTER_PARTS.horns.map(item=>[item.id,item]))
  const cells=[]
  pack.reviewFixtures.forEach((fixture,row)=>{
    Object.keys(backgrounds).forEach((background,bgIndex)=>{
      pack.reviewOrientations.forEach((orientation,flipIndex)=>{
        const col=bgIndex*2+flipIndex,x=col*size,y=row*size,scope=`c${row}-${col}`
        const base=prefix(inner(bases[fixture.baseId].svg),`${scope}-base`)
        const mouth=prefix(inner(mouths[fixture.mouthId].svg),`${scope}-mouth`)
        const horn=prefix(inner(horns[fixture.hornId].svg),`${scope}-horn`)
        const mouthPlate=prefix(inner(state.MONSTER_PAIR_JUNCTIONS.byKey[fixture.mouthPairKey].svg),`${scope}-mplate`)
        const hornPlate=prefix(inner(state.MONSTER_PAIR_JUNCTIONS.byKey[fixture.hornPairKey].svg),`${scope}-hplate`)
        const flip=orientation==='flipped'?'translate(600 0) scale(-1 1)':''
        const bg=backgrounds[background]==='none'?'':`<rect width="600" height="600" fill="${backgrounds[background]}"/>`
        cells.push(`<g transform="translate(${x} ${y}) scale(${size/600})"><g>${bg}<g transform="${flip}"><g transform="${transformFor(integration.placementOverrides[fixture.hornPairKey])}">${horn}</g>${hornPlate}${base}<g transform="${transformFor(integration.placementOverrides[fixture.mouthPairKey])}">${mouth}</g>${mouthPlate}</g></g></g>`)
      })
    })
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-scale="${scaleLabel}" data-status="candidate-pending-art-director">${cells.join('')}</svg>\n`
}

if(require.main===module){
  const report=buildReport(),output=JSON.stringify(report,null,2)+'\n'
  const write=process.argv.includes('--write')||!process.argv.includes('--validate-only')
  if(write){
    const out=path.join(root,'generated','qa','v10-heads');fs.mkdirSync(out,{recursive:true})
    fs.writeFileSync(path.join(out,'validation-report.json'),output)
    const state=loadBrowserState()
    for(const scale of pack.reviewScales) fs.writeFileSync(path.join(out,`contact-sheet-${scale.replace('%','percent')}.svg`),buildSheet(state,scale))
  }
  process.stdout.write(output)
  if(!report.valid) process.exitCode=1
}
module.exports={buildReport,buildSheet,stable,loadBrowserState,flatten,inside,radialSignature,descriptor,signatureDistance,contentBounds,contentPoints,placeBounds,placePoints,outlineOf}
