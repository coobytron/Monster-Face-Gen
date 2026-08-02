'use strict'
const fs=require('fs')
const path=require('path')
const crypto=require('crypto')
const vm=require('vm')
const root=path.resolve(__dirname,'..')
const pack=require('../assets/v10-mouths')
const integration=require('../assets/v10-mouth-integration')
const manifest=require('../assets/v10-mouth-manifest.json')
function stable(value){if(Array.isArray(value))return value.map(stable);if(value&&typeof value==='object')return Object.keys(value).sort().reduce((out,key)=>(out[key]=stable(value[key]),out),{});return value}
function loadBrowserState(){
  const context={window:{},console};vm.createContext(context)
  for(const file of ["assets/parts/bases.js","assets/parts/mouths.js","assets/v10-mouth-assets-01.js","assets/v10-mouth-assets-02.js","assets/v10-mouth-assets-03.js","assets/v10-mouth-fixtures.js","assets/v10-mouths.js","assets/pair-junctions.js","assets/compatibility.js","assets/v10-mouth-junctions-01.js","assets/v10-mouth-junctions-02.js","assets/v10-mouth-junctions-03.js","assets/v10-mouth-junctions-04.js","assets/v10-mouth-junctions-05.js","assets/v10-mouth-integration-data.js","assets/v10-mouth-integration.js"]){
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file})
  }
  return context.window
}
function inner(svg){return svg.replace(/^\s*<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'')}
function prefix(svg,prefix){const ids=[...svg.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);let out=svg;for(const id of ids){out=out.replaceAll(`id="${id}"`,`id="${prefix}-${id}"`).replaceAll(`url(#${id})`,`url(#${prefix}-${id})`).replaceAll(`href="#${id}"`,`href="#${prefix}-${id}"`)}return out}
function transformFor(value){const x=Math.round((value.x||0)*600),y=Math.round((value.y||0)*600),s=value.scale||1,r=value.rotation||0;return `translate(${x} ${y}) translate(300 300) rotate(${r}) scale(${s}) translate(-300 -300)`}
function buildReport(){
  const errors=[]
  const ids=pack.assets.map(item=>item.id)
  if(pack.assets.length!==18)errors.push('expected 18 authored mouths')
  if(new Set(ids).size!==ids.length)errors.push('duplicate stable mouth ID')
  if(new Set(pack.assets.map(item=>item.mouthFamily)).size!==pack.requiredFamilies.length)errors.push('mouth family coverage incomplete')
  for(const item of pack.assets){if(item.runtimeGeometry!==false||item.authored!==true)errors.push(`${item.id} violates authored runtime contract`);if(!item.svg.includes('viewBox="0 0 600 600"'))errors.push(`${item.id} uses wrong coordinate system`)}
  for(const fixture of pack.reviewFixtures){if(!integration.reviewPairKeys.includes(fixture.pairKey))errors.push(`${fixture.pairKey} lacks exact pair plate`);if(!integration.placementOverrides[fixture.pairKey])errors.push(`${fixture.pairKey} lacks rigid placement override`)}
  const matrix=[]
  for(const fixture of pack.reviewFixtures)for(const background of pack.reviewBackgrounds)for(const scale of pack.reviewScales)for(const orientation of ['normal','flipped'])matrix.push({fixtureId:fixture.id,pairKey:fixture.pairKey,background,scale,orientation,status:'candidate-review-required'})
  const canonical=JSON.stringify(stable({manifest,ids,pairs:integration.reviewPairKeys,matrix}))
  return stable({schemaVersion:'1.0.0',generatedAt:'1970-01-01T00:00:00.000Z',revision:'10.1.0',issue:34,valid:errors.length===0,errors,counts:{baselineMouths:9,newMouths:18,totalMouths:27,exactPairPlates:18,reviewCells:matrix.length},requiredFamilies:pack.requiredFamilies,reviewScales:pack.reviewScales,reviewBackgrounds:pack.reviewBackgrounds,digest:crypto.createHash('sha256').update(canonical).digest('hex'),reviewMatrix:matrix})
}
function buildSheet(state,scaleLabel){
  const size={'100%':600,'25%':150,'192px':192,'96px':96,'48px':48}[scaleLabel]
  const backgrounds={cream:'#ead9b7',white:'#fffdf7',black:'#171512',transparent:'none'}
  const cols=8,rows=pack.reviewFixtures.length,width=cols*size,height=rows*size
  const bases=Object.fromEntries(state.MONSTER_PARTS.bases.map(item=>[item.id,item]))
  const mouths=Object.fromEntries(state.MONSTER_PARTS.mouths.map(item=>[item.id,item]))
  const cells=[]
  pack.reviewFixtures.forEach((fixture,row)=>{
    Object.keys(backgrounds).forEach((background,bgIndex)=>{
      ;['normal','flipped'].forEach((orientation,flipIndex)=>{
        const col=bgIndex*2+flipIndex,x=col*size,y=row*size,p=`c${row}-${col}`
        const base=prefix(inner(bases[fixture.baseId].svg),`${p}-base`),mouth=prefix(inner(mouths[fixture.mouthId].svg),`${p}-mouth`),junction=prefix(inner(state.MONSTER_PAIR_JUNCTIONS.byKey[fixture.pairKey].svg),`${p}-junction`)
        const override=integration.placementOverrides[fixture.pairKey]
        const flip=orientation==='flipped'?'translate(600 0) scale(-1 1)':''
        const bg=backgrounds[background]==='none'?'':`<rect width="600" height="600" fill="${backgrounds[background]}"/>`
        cells.push(`<g transform="translate(${x} ${y}) scale(${size/600})"><g>${bg}<g transform="${flip}">${base}<g transform="${transformFor(override)}">${mouth}</g>${junction}</g></g></g>`)
      })
    })
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-scale="${scaleLabel}" data-status="candidate-pending-art-director">${cells.join('')}</svg>\n`
}
if(require.main===module){
  const report=buildReport(),output=JSON.stringify(report,null,2)+'\n'
  const write=process.argv.includes('--write')||!process.argv.includes('--validate-only')
  if(write){const out=path.join(root,'generated','qa','v10-mouths');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'validation-report.json'),output);const state=loadBrowserState();for(const scale of pack.reviewScales)fs.writeFileSync(path.join(out,`contact-sheet-${scale.replace('%','percent')}.svg`),buildSheet(state,scale))}
  process.stdout.write(output)
  if(!report.valid)process.exitCode=1
}
module.exports={buildReport,buildSheet,stable,loadBrowserState}
