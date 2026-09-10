/* WebGL background and rounded glass lenses. DOM content stays accessible above it. */
(() => {
  const stage = document.querySelector('.stage');
  const status = document.querySelector('#renderer-status');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {position:'fixed',left:'0',top:'0',pointerEvents:'none',zIndex:'3'});
  canvas.dataset.html2canvasIgnore='true';
  stage.prepend(canvas);
  const gl = canvas.getContext('webgl', {alpha:true, antialias:false, depth:false});
  const fallback = () => {
    stage.classList.remove('webgl-ready');
    canvas.style.display = 'none';
    status.textContent = 'WebGLが利用できないため、CSSのガラス表現を表示しています。';
  };
  if (!gl) { fallback(); return; }
  const style = document.createElement('style');
  style.textContent = '.stage{overflow:clip} .stage nav{position:sticky;top:20px;z-index:5}.webgl-ready .glass{z-index:4;background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;border-color:transparent;box-shadow:none}.webgl-ready nav.glass{z-index:5}';
  document.head.append(style);
  const vertex = 'attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}';
  const fragment = `
    precision highp float;
    uniform vec2 resolution;
    uniform float ratio, scrollY, light, radius, opacity, blur, saturation, edge, shine, shadow, refraction, dispersion;
    uniform vec4 rects[4];
    uniform sampler2D backdrop;
    uniform vec2 documentSize;
    vec3 scene(vec2 p){
      return texture2D(backdrop,clamp((p+vec2(0.,scrollY))/documentSize,vec2(0.),vec2(1.))).rgb;
    }
    vec3 unusedScene(vec2 p){
      p.y+=scrollY;
      vec3 base=mix(vec3(.065,.078,.09),vec3(.88,.91,.93),light);
      float glow=exp(-length((p-vec2(160.,250.))/vec2(370.,430.)));
      base+=vec3(.12,.25,.29)*glow*(1.-light*.55);
      float wave=sin(p.y*.010+p.x*.007)*65.;
      float band=exp(-pow((p.x-180.-wave)/70.,2.));
      base+=vec3(.12,.25,.28)*band*.38;
      vec2 grid=abs(mod(p+32.,64.)-32.);
      float line=1.-smoothstep(.45,1.3,min(grid.x,grid.y));
      base=mix(base,mix(vec3(.40,.51,.55),vec3(.59,.68,.72),light),line*.30);
      float stripe=1.-smoothstep(1.,2.5,abs(p.x-p.y*.38-65.));
      base+=vec3(.26,.32,.33)*stripe*.65;
      return base;
    }
    float sdf(vec2 p,vec2 halfSize,float r){
      vec2 q=abs(p)-halfSize+r;
      return length(max(q,0.))+min(max(q.x,q.y),0.)-r;
    }
    vec3 blurred(vec2 p){
      float b=blur*.5;
      return scene(p)*.2+(scene(p+vec2(b,0.))+scene(p-vec2(b,0.))+scene(p+vec2(0.,b))+scene(p-vec2(0.,b)))*.12+
        (scene(p+vec2(b,b))+scene(p-vec2(b,b))+scene(p+vec2(b,-b))+scene(p+vec2(-b,b)))*.08;
    }
    void main(){
      vec2 p=vec2(gl_FragCoord.x,resolution.y-gl_FragCoord.y)/ratio;
      vec3 color=vec3(0.);
      float alpha=0.;
      for(int i=0;i<4;i++){
        vec4 box=rects[i];
        vec2 halfSize=box.zw*.5;
        vec2 local=p-box.xy-halfSize;
        float r=min(radius,min(halfSize.x,halfSize.y));
        float d=sdf(local,halfSize,r);
        float sd=sdf(local-vec2(0.,9.),halfSize,r);
        float shadowAlpha=exp(-max(sd,0.)/14.)*shadow*.4*smoothstep(-1.,2.,d);
        alpha=max(alpha,shadowAlpha);
        if(d<1.){
          vec2 normal=normalize(vec2(sdf(local+vec2(.5,0.),halfSize,r)-sdf(local-vec2(.5,0.),halfSize,r),sdf(local+vec2(0.,.5),halfSize,r)-sdf(local-vec2(0.,.5),halfSize,r))+vec2(.0001));
          float rim=exp(-abs(d)/9.);
          vec2 offset=-normal*refraction*rim;
          vec3 glass=blurred(p+offset);
          glass.r=blurred(p+offset+normal*dispersion*rim).r;
          glass.b=blurred(p+offset-normal*dispersion*rim).b;
          float gray=dot(glass,vec3(.2126,.7152,.0722));
          glass=mix(vec3(gray),glass,saturation/100.);
          glass=mix(glass,vec3(1.),opacity);
          glass+=shine*.30*(1.-local.y/max(halfSize.y,1.));
          float spec=pow(max(dot(normal,normalize(vec2(-.5,-1.))),0.),3.);
          glass+=edge*exp(-abs(d+1.)/1.2)*(.15+.75*spec);
          float coverage=1.-smoothstep(-.8,.8,d);
          color=mix(color,glass,coverage);
          alpha=max(alpha,coverage);
        }
      }
      gl_FragColor=vec4(color*alpha,alpha);
    }`;
  function shader(type, source) {
    const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  let program;
  try {
    program=gl.createProgram();
    gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch(error) { console.error('Glass shader:',error); fallback(); return; }
  gl.useProgram(program);
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const uniform = name => gl.getUniformLocation(program,name);
  const names=['ratio','scrollY','light','radius','opacity','blur','saturation','edge','shine','shadow','refraction','dispersion'];
  const uniforms=Object.fromEntries(names.map(name=>[name,uniform(name)]));
  const resolution=uniform('resolution'),rectangles=uniform('rects[0]');
  const documentSize=uniform('documentSize');
  const texture=gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.uniform1i(uniform('backdrop'),0);
  // The compositor paints back to front, independently of DOM order.
  const navigation=stage.querySelector('nav.glass');
  const buttons=[...stage.querySelectorAll('.glass')].filter(el=>el!==navigation);
  const lenses=[...buttons,navigation];
  function clipButtonsUnderNavigation(navRect, cornerRadius){
    for(const button of buttons){
      const b=button.getBoundingClientRect();
      if(b.right<=navRect.left||b.left>=navRect.right||b.bottom<=navRect.top||b.top>=navRect.bottom){
        button.style.removeProperty('clip-path');continue;
      }
      // The shared canvas sits below button labels. Cut those labels out only
      // inside the foreground lens so they cannot paint over its glass.
      const sx=button.offsetWidth/b.width,sy=button.offsetHeight/b.height;
      const x=(navRect.left-b.left)*sx,y=(navRect.top-b.top)*sy;
      const w=navRect.width*sx,h=navRect.height*sy;
      const rx=cornerRadius*sx,ry=cornerRadius*sy;
      const outer=`M0 0H${button.offsetWidth}V${button.offsetHeight}H0Z`;
      const hole=`M${x+rx} ${y}H${x+w-rx}A${rx} ${ry} 0 0 1 ${x+w} ${y+ry}V${y+h-ry}A${rx} ${ry} 0 0 1 ${x+w-rx} ${y+h}H${x+rx}A${rx} ${ry} 0 0 1 ${x} ${y+h-ry}V${y+ry}A${rx} ${ry} 0 0 1 ${x+rx} ${y}Z`;
      button.style.clipPath=`path(evenodd, "${outer}${hole}")`;
    }
  }
  let pending=false, lost=false;
  function render(){
    pending=false;if(lost)return;
    const width=stage.clientWidth,height=innerHeight,dpr=Math.min(devicePixelRatio||1,2);
    const w=Math.round(width*dpr),h=Math.round(height*dpr);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;canvas.style.width=width+'px';canvas.style.height=height+'px';gl.viewport(0,0,w,h);}
    gl.uniform2f(resolution,w,h);
    const css=getComputedStyle(document.documentElement);
    const navRect=navigation.getBoundingClientRect();
    clipButtonsUnderNavigation(navRect,Math.min(parseFloat(css.getPropertyValue('--radius')),navRect.width/2,navRect.height/2));
    for(const name of names){
      let value=parseFloat(css.getPropertyValue('--'+name));
      if(name==='ratio')value=dpr;
      if(name==='scrollY')value=window.scrollY;
      if(name==='light')value=document.body.classList.contains('light')?1:0;
      gl.uniform1f(uniforms[name],value);
    }
    gl.uniform4fv(rectangles,new Float32Array(lenses.flatMap(el=>{const r=el.getBoundingClientRect();return[r.x,r.y,r.width,r.height]})));
    gl.drawArrays(gl.TRIANGLES,0,6);
  }
  function schedule(){if(!pending&&!lost){pending=true;requestAnimationFrame(render);}}
  let capturing=false,dirty=false,captureTimer;
  async function capture(){
    if(lost)return;
    if(capturing){dirty=true;return;}
    capturing=true;
    try{
      const width=stage.clientWidth,height=stage.scrollHeight;
      const maxSize=Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE),4096);
      const snapshot=await html2canvas(stage,{
        scale:Math.min(devicePixelRatio||1,1.5,maxSize/width,maxSize/height),
        backgroundColor:getComputedStyle(document.body).backgroundColor,
        logging:false,useCORS:true,
        onclone(doc){
          const clone=doc.querySelector('.stage');clone.classList.remove('webgl-ready');
          clone.querySelectorAll('.glass').forEach(el=>{el.style.visibility='hidden'});
        }
      });
      if(lost)return;
      gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,snapshot);
      gl.uniform2f(documentSize,width,height);
      stage.classList.add('webgl-ready');canvas.style.display='block';
      status.textContent='WebGL稼働中 — 文章・画像を取り込み済み。スクロールでナビの下の屈折を確認できます。';
      schedule();
    }catch(error){console.error('Backdrop capture:',error);fallback();}
    finally{capturing=false;if(dirty){dirty=false;queueCapture();}}
  }
  function queueCapture(){clearTimeout(captureTimer);captureTimer=setTimeout(capture,180);}
  addEventListener('glasschange',schedule);
  addEventListener('resize',schedule);
  addEventListener('scroll',schedule,{passive:true});
  new ResizeObserver(()=>{schedule();queueCapture();}).observe(stage);
  new MutationObserver(queueCapture).observe(document.body,{attributes:true,attributeFilter:['class']});
  stage.querySelectorAll('img').forEach(img=>img.addEventListener('load',queueCapture));
  document.fonts.ready.then(queueCapture);
  // Follow the short CSS button transition; no permanent animation loop.
  for(const lens of lenses){for(const event of ['pointerenter','pointerleave','pointerdown','pointerup','focus','blur'])lens.addEventListener(event,()=>{const end=performance.now()+240;function tick(){schedule();if(performance.now()<end)requestAnimationFrame(tick)}tick();});}
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;fallback();status.textContent='WebGLの描画が中断されました。CSS表示に切り替えています。再読み込みで再試行できます。';});
  queueCapture();
})();
