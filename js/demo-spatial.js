// Original, procedural models. Rendering is demand-driven and entirely local.
import * as T from '/assets/cases/vendor/three.module.min.js';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const motion={response:10,settle:.0007,maxDpr:1.6};

export function mountSpatial(root) {
  const canvas=root.querySelector('canvas');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const architecture=root.dataset.spatial==='house';
  const viewport=root.querySelector('.spatial-viewport');
  let renderer;
  try { renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'}); }
  catch { root.dataset.spatialState='fallback';return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio,motion.maxDpr));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(33,1,.1,100);
  camera.position.set(architecture?7:4.5,architecture?6.1:3.2,architecture?8.5:6.5);
  camera.lookAt(0,architecture?.9:1.25,0);
  scene.add(new T.HemisphereLight(0xfff8ed,0xa2aeb4,2.4));
  const key=new T.DirectionalLight(0xfff4df,4);
  key.position.set(-3,7,5);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);
  Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.1,far:24});
  key.shadow.bias=-.0004;key.shadow.normalBias=.035;key.shadow.radius=4;
  scene.add(key);
  const rim=new T.DirectionalLight(0xd5e8ff,1.5);rim.position.set(5,3,-4);scene.add(rim);
  const group=new T.Group();scene.add(group);
  const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.75,...extra});
  const baseMat=mat(0xe4ddd0),wallMat=mat(0xe6e1d5),woodMat=mat(0x936a43),darkMat=mat(0x313a36),greenMat=mat(0x727d58);
  function mesh(geometry,material,parent=group){const obj=new T.Mesh(geometry,material);obj.castShadow=true;obj.receiveShadow=true;parent.add(obj);return obj;}
  function box(w,h,d,x,y,z,material,parent=group){const obj=mesh(new T.BoxGeometry(w,h,d),material,parent);obj.position.set(x,y,z);return obj;}
  const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.17}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=-.045;scene.add(floor);
  let roof,ceramic;
  if(architecture) {
    box(5.2,.13,4.1,0,.03,0,baseMat);
    box(4.55,.09,3.25,0,.15,0,mat(0xd0c2ac));
    box(4.55,1.35,.14,0,.86,-1.55,wallMat);
    box(.14,1.35,3.12,-2.2,.86,0,wallMat);
    box(.14,1.35,3.12,2.2,.86,0,wallMat);
    box(1.3,1.35,.14,-1.62,.86,1.5,wallMat);
    box(.12,1.25,1.7,.58,.81,-.72,wallMat);
    // Furniture is visible through the front facade and under the lifting roof.
    box(1.25,.18,.52,-.9,.37,.45,mat(0xb9b2a4));
    box(1.25,.37,.13,-.9,.63,.18,mat(0xb9b2a4));
    box(.68,.08,.48,-.9,.48,1.01,woodMat);
    for(const x of [-1.15,-.65])for(const z of [.86,1.16])box(.04,.28,.04,x,.3,z,darkMat);
    box(.75,.09,1.1,1.35,.66,-.45,woodMat);
    box(.56,.6,.45,1.35,.48,-1.22,darkMat);
    const glass=mat(0x93ada5,{transparent:true,opacity:.22,roughness:.15,metalness:.3,depthWrite:false});
    box(2.88,1.14,.025,.68,.84,1.47,glass);
    for(const x of [-.95,.1,1.15,2.1]) box(.035,1.29,.045,x,.85,1.48,darkMat);
    box(3.1,.035,.045,.57,1.46,1.48,darkMat);
    box(3.1,.035,.045,.57,.23,1.48,darkMat);
    // Slatted terrace: every slat is real geometry, not a painted facade.
    for(let x=-2.35;x<2.4;x+=.13)box(.105,.025,.52,x,.12,1.8,woodMat);
    const roofGroup=new T.Group();group.add(roofGroup);roof=roofGroup;
    box(4.7,.16,3.45,0,1.64,0,wallMat,roofGroup);
    box(1.1,.08,.72,-.85,1.75,-.25,darkMat,roofGroup);
    box(.96,.02,.59,-.85,1.8,-.25,mat(0xb0c6c2,{metalness:.3,roughness:.18}),roofGroup);
    // Garden planted into the model's plinth.
    for(const [x,z] of [[-2.35,-1.6],[2.28,-1.55],[2.25,1.65]]) {
      const trunk=mesh(new T.CylinderGeometry(.018,.032,.75,8),woodMat);trunk.position.set(x,.48,z);
      const leaves=mesh(new T.IcosahedronGeometry(.36,2),greenMat);leaves.position.set(x,1.04,z);leaves.scale.set(.85,1.2,.85);
    }
    group.rotation.y=-.18;
  } else {
    const profile=[[0,.02],[.38,.02],[.48,.09],[.57,.25],[.69,.55],[.78,.9],[.79,1.2],[.72,1.51],[.52,1.79],[.29,1.98],[.27,2.18],[.31,2.27],[.30,2.32],[.24,2.32],[.22,2.25],[.22,2.03],[.47,1.83],[.66,1.49],[.73,1.18],[.72,.9],[.63,.56],[.51,.29],[.42,.16],[0,.16]];
    const curve=new T.SplineCurve(profile.map(([x,y])=>new T.Vector2(x,y)));
    const geo=new T.LatheGeometry(curve.getPoints(110),112);
    // Very subtle thrown-ceramic relief in the actual surface.
    const p=geo.attributes.position;
    for(let i=0;i<p.count;i++){const y=p.getY(i),ripple=1+Math.sin(y*110)*.002; p.setX(i,p.getX(i)*ripple);p.setZ(i,p.getZ(i)*ripple);}
    geo.computeVertexNormals();
    ceramic=mat(0xcdb493,{roughness:.6});
    mesh(geo,ceramic);
    const plate=mesh(new T.CylinderGeometry(1.3,1.35,.1,96),mat(0xd8cdb9));plate.position.y=-.005;
    // Fine asymmetric branch makes changes of viewing angle immediately readable.
    const stemPath=new T.CatmullRomCurve3([new T.Vector3(0,1.3,0),new T.Vector3(.08,2.35,.03),new T.Vector3(.3,2.85,-.08),new T.Vector3(.55,3.15,-.13)]);
    mesh(new T.TubeGeometry(stemPath,36,.012,6,false),woodMat);
    for(let i=0;i<5;i++){const leaf=mesh(new T.SphereGeometry(1,14,10),mat(0x697761));leaf.position.set(.14+i*.083,2.56+i*.11,-.06);leaf.scale.set(.18,.042,.075);leaf.rotation.z=(i%2?-.6:.4);leaf.rotation.y=i*.65;}
    group.position.y=.06;
  }
  const controls=root.querySelector('.spatial-controls');
  const rotation=root.querySelector('[data-rotation]');
  const status=root.querySelector('.spatial-status');
  const target={angle:0,open:0},current={angle:0,open:0};
  const materialTarget=ceramic?.color.clone();
  let frame=0,visible=false,previous=0,drag=null,userMoved=false,disposed=false;
  const signal=new AbortController();
  function draw(time=performance.now()) {
    frame=0;if(disposed||!visible||document.hidden)return;
    const dt=clamp((time-previous)/1000,0,.05);previous=time;
    const blend=reduced.matches?1:1-Math.exp(-motion.response*(dt||.016));
    current.angle+=(target.angle-current.angle)*blend;current.open+=(target.open-current.open)*blend;
    group.rotation.y=current.angle+(architecture?-.18:0);
    if(roof){roof.position.y=current.open*1.6;roof.position.x=current.open*.25;const control=root.querySelector('[data-explode]');control.setAttribute('aria-pressed',String(target.open>=.5));control.firstChild.textContent=target.open>=.5?'Refermer la toiture ':'Soulever la toiture ';}
    if(ceramic)ceramic.color.lerp(materialTarget,blend);
    renderer.render(scene,camera);
    const changing=Math.abs(target.angle-current.angle)>motion.settle||Math.abs(target.open-current.open)>motion.settle;
    const colorChanging=ceramic&&['r','g','b'].some(k=>Math.abs(ceramic.color[k]-materialTarget[k])>motion.settle);
    if(changing||colorChanging)frame=requestAnimationFrame(draw);
  }
  function wake(){if(!frame&&visible&&!document.hidden&&!disposed){previous=performance.now();frame=requestAnimationFrame(draw);}}
  function resize(){const r=viewport.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();wake();}
  function setAngle(value){target.angle=Number(value)*Math.PI/180;rotation.value=String(Math.round(Number(value)));wake();}
  rotation.addEventListener('input',()=>{userMoved=true;setAngle(rotation.value);},{signal:signal.signal});
  canvas.addEventListener('pointerdown',ev=>{if(ev.pointerType==='mouse'&&ev.button!==0)return;drag={x:ev.clientX,y:ev.clientY,angle:target.angle,id:ev.pointerId};canvas.setPointerCapture(ev.pointerId);},{signal:signal.signal});
  canvas.addEventListener('pointermove',ev=>{if(!drag)return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;if(ev.pointerType==='touch'&&Math.abs(dy)>Math.abs(dx)*1.3)return;userMoved=true;setAngle(clamp((drag.angle+dx*.009)*180/Math.PI,-180,180));},{signal:signal.signal});
  const release=()=>{drag=null;};
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,release,{signal:signal.signal});
  root.querySelector('[data-explode]')?.addEventListener('click',ev=>{userMoved=true;target.open=target.open>=.5?0:1;ev.currentTarget.setAttribute('aria-pressed',String(Boolean(target.open)));ev.currentTarget.firstChild.textContent=target.open?'Refermer la toiture ':'Soulever la toiture ';status.textContent=target.open?'Vue ouverte : séjour, espace repas et lumière zénithale.':'Vue d’ensemble de la maison.';wake();},{signal:signal.signal});
  root.querySelectorAll('[data-finish]').forEach(button=>button.addEventListener('click',()=>{root.querySelectorAll('[data-finish]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));materialTarget.set({sable:0xcdb493,argile:0x9d5539,foret:0x3f5748}[button.dataset.finish]);status.textContent=`Finition ${button.textContent.toLowerCase()}.`;wake();},{signal:signal.signal}));
  function scroll(){if(!visible||reduced.matches||userMoved)return;const r=root.getBoundingClientRect();const progress=clamp((innerHeight-r.top)/(innerHeight+r.height),0,1);target.angle=(progress-.5)*(architecture?.45:.75);if(architecture)target.open=clamp((progress-.32)*2.8,0,1);rotation.value=String(Math.round(target.angle*180/Math.PI));wake();}
  window.addEventListener('scroll',scroll,{passive:true,signal:signal.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();},{signal:signal.signal});
  reduced.addEventListener('change',()=>{target.angle=current.angle;target.open=current.open;wake();},{signal:signal.signal});
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){resize();scroll();wake();}else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'80px'});io.observe(viewport);
  const ro=new ResizeObserver(resize);ro.observe(viewport);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();root.classList.remove('spatial-ready');controls.hidden=true;cancelAnimationFrame(frame);},{signal:signal.signal});
  root.classList.add('spatial-ready');root.dataset.spatialState='ready';controls.hidden=false;resize();
  window.addEventListener('pagehide',event=>{if(event.persisted)return;disposed=true;signal.abort();io.disconnect();ro.disconnect();cancelAnimationFrame(frame);scene.traverse(obj=>{obj.geometry?.dispose();if(obj.material){(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>m.dispose());}});renderer.dispose();},{once:true});
}
