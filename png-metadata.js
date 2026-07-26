window.PngMetadata = (() => {
  function crc32(bytes){
    let c=0xffffffff;
    for(let i=0;i<bytes.length;i++){
      c^=bytes[i];
      for(let k=0;k<8;k++) c=(c>>>1)^((c&1)?0xedb88320:0);
    }
    return (c^0xffffffff)>>>0;
  }
  function uint32be(n){
    return new Uint8Array([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]);
  }
  function concatBytes(...arrays){
    const len=arrays.reduce((n,a)=>n+a.length,0);
    const out=new Uint8Array(len);let offset=0;
    arrays.forEach(a=>{out.set(a,offset);offset+=a.length});
    return out;
  }
  function makePngChunk(type,data){
    const typeBytes=new TextEncoder().encode(type);
    const body=concatBytes(typeBytes,data);
    return concatBytes(uint32be(data.length),body,uint32be(crc32(body)));
  }
  async function embedJsonInPng(blob,metadata){
    const bytes=new Uint8Array(await blob.arrayBuffer());
    const sig=bytes.slice(0,8);
    let offset=8;
    const chunks=[];
    while(offset<bytes.length){
      const length=((bytes[offset]<<24)|(bytes[offset+1]<<16)|(bytes[offset+2]<<8)|bytes[offset+3])>>>0;
      const end=offset+12+length;
      const type=String.fromCharCode(...bytes.slice(offset+4,offset+8));
      if(type==='IEND'){
        const payload=new TextEncoder().encode('monsterFaceState\0'+JSON.stringify(metadata));
        chunks.push(makePngChunk('tEXt',payload));
      }
      chunks.push(bytes.slice(offset,end));
      offset=end;
    }
    return new Blob([concatBytes(sig,...chunks)],{type:'image/png'});
  }
  return {embedJsonInPng};
})();
