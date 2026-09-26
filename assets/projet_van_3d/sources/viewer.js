import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export async function startViewer(modelSource){
 const container=document.getElementById('stage');
 const scene=new THREE.Scene();scene.background=new THREE.Color('#e9e7df');
 const camera=new THREE.PerspectiveCamera(39,1,.04,80);
 let renderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});}
 catch(e){document.getElementById('loading').innerHTML='<strong>L’aperçu 3D nécessite WebGL.</strong><br>Ouvre ce fichier dans un navigateur récent sur ton ordinateur.';throw e;}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.10;container.prepend(renderer.domElement);
 renderer.domElement.setAttribute('aria-label','Maquette 3D du van. Fais glisser pour tourner et utilise la molette ou deux doigts pour zoomer.');
 renderer.domElement.setAttribute('role','img');renderer.domElement.tabIndex=0;
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.045).texture;scene.environmentIntensity=.57;pmrem.dispose();
 scene.add(new THREE.HemisphereLight('#f5f2e5','#969b96',2.0));
 const key=new THREE.DirectionalLight('#fff3db',3.6);key.position.set(-4,8,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.1,far:24});key.shadow.normalBias=.018;key.shadow.bias=-.00015;key.shadow.radius=3;scene.add(key);
 const fill=new THREE.DirectionalLight('#dceaf2',1.3);fill.position.set(5,4,-4);scene.add(fill);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#e9e7df',roughness:1}));ground.rotation.x=-Math.PI/2;ground.position.y=-.012;ground.receiveShadow=true;scene.add(ground);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.085;controls.minDistance=.25;controls.maxDistance=19;controls.maxPolarAngle=Math.PI*.485;controls.panSpeed=.6;controls.rotateSpeed=.62;controls.zoomSpeed=.75;
 let root;if(modelSource.isObject3D)root=modelSource;else{const result=await new GLTFLoader().parseAsync(modelSource,'');root=result.scene;}scene.add(root);
 root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material.map)o.material.map.anisotropy=renderer.capabilities.getMaxAnisotropy();}});
 const named=n=>root.getObjectByName(n);const required=['Toit','Paroi_droite','Paroi_gauche','Portes_arriere','Lit','Lambris_gauche','Lambris_droit','Porte_laterale'];
 const missing=required.filter(n=>!named(n));if(missing.length)throw new Error('Groupes manquants : '+missing.join(', '));
 const state={mode:'exterior',roof:true,doors:false,sliding:false,bed:true,rotating:false};let destination=null;let slideProgress=0;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const modes={
  exterior:{pos:[7.3,4.3,8.2],target:[0,1.30,1.05],title:'L’extérieur',tag:'01 / SILHOUETTE',desc:'Un Boxer blanc à toit haut, ses baies latérales et un panneau solaire sur le toit.',roof:true,doors:false,bed:true},
  cutaway:{pos:[6.8,6.4,-7.2],target:[0,1.30,.35],title:'L’aménagement',tag:'02 / VUE EN COUPE',desc:'Cuisine, douche, salon en L et lit transversal : les volumes s’organisent autour d’une allée centrale.',roof:false,doors:true,bed:true},
  interior:{pos:[.14,2.20,-2.8],target:[-.10,1.75,1.20],title:'À l’intérieur',tag:'03 / ESPACE DE VIE',desc:'Lambris en bois, mobilier vert grisé, placards ivoire et plafond à tasseaux éclairé par des LED.',roof:true,doors:true,bed:true},
  systems:{pos:[.12,2.6,-5.4],target:[0,1.04,-1.26],title:'Sous le couchage',tag:'04 / ÉQUIPEMENTS',desc:'Batterie, convertisseur, modules électriques et circuit d’eau sont regroupés sous le lit.',roof:false,doors:true,bed:false},
  plan:{pos:[0,8.5,.18],target:[0,.70,.20],title:'Le plan d’ensemble',tag:'05 / IMPLANTATION',desc:'Une vue de dessus pour comprendre la place de chaque zone de vie.',roof:false,doors:true,bed:true}
 };
 function applyVisibility(){
  named('Toit').visible=state.roof;
  const isCut=state.mode==='cutaway'||state.mode==='systems'||state.mode==='plan';
  named('Paroi_droite').visible=!isCut;named('Lambris_droit').visible=!isCut;
  named('Paroi_gauche').visible=!isCut;named('Lambris_gauche').visible=state.mode!=='plan';
  named('Lit').visible=state.bed;
  named('Porte_laterale').visible=!isCut;
  if(named('Decoration'))named('Decoration').visible=state.mode!=='plan';
  if(named('Placards_hauts'))named('Placards_hauts').visible=state.mode!=='plan';
  if(named('Cabine'))named('Cabine').visible=state.mode!=='plan';
  for(const [id,on] of [['roof',state.roof],['doors',state.doors],['sliding',state.sliding],['bed',state.bed],['rotate',state.rotating]]){
   const button=document.getElementById(id);button.setAttribute('aria-pressed',String(on));button.classList.toggle('selected',on);
  }
  document.getElementById('roof-label').textContent=state.roof?'Retirer le toit':'Afficher le toit';
  document.getElementById('doors-label').textContent=state.doors?'Fermer l’arrière':'Ouvrir l’arrière';
  document.getElementById('sliding-label').textContent=state.sliding?'Fermer la porte latérale':'Ouvrir la porte latérale';
  document.getElementById('bed-label').textContent=state.bed?'Retirer le lit':'Afficher le lit';
  document.getElementById('rotate-label').textContent=state.rotating?'Arrêter la rotation':'Rotation automatique';
 }
 function fitPos(p){const v=new THREE.Vector3(...p);const target=new THREE.Vector3(...modes[state.mode].target);if(container.clientWidth/container.clientHeight<1.0&&state.mode!=='interior')v.sub(target).multiplyScalar(1.25).add(target);return v;}
 function setMode(mode,instant=false){state.mode=mode;const m=modes[mode];state.roof=m.roof;state.doors=m.doors;state.sliding=mode!=='exterior';state.bed=m.bed;state.rotating=false;controls.autoRotate=false;applyVisibility();
  document.getElementById('view-title').textContent=m.title;document.getElementById('view-tag').textContent=m.tag;document.getElementById('view-desc').textContent=m.desc;
  document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===mode);b.setAttribute('aria-pressed',String(b.dataset.view===mode));});
  const p=fitPos(m.pos),target=new THREE.Vector3(...m.target);
  if(instant||reduce){camera.position.copy(p);controls.target.copy(target);controls.update();destination=null;}
  else destination={pos:p,target};
 }
 controls.addEventListener('start',()=>{destination=null;if(state.rotating){state.rotating=false;controls.autoRotate=false;applyVisibility();}});
 document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.view)));
 document.getElementById('roof').onclick=()=>{state.roof=!state.roof;applyVisibility();};
 document.getElementById('doors').onclick=()=>{state.doors=!state.doors;applyVisibility();};
 document.getElementById('sliding').onclick=()=>{const open=!state.sliding;if(['cutaway','systems','plan'].includes(state.mode))setMode('exterior');state.sliding=open;applyVisibility();};
 document.getElementById('bed').onclick=()=>{state.bed=!state.bed;applyVisibility();};
 document.getElementById('rotate').onclick=()=>{state.rotating=!state.rotating;controls.autoRotate=state.rotating;controls.autoRotateSpeed=.75;applyVisibility();};
 document.getElementById('reset').onclick=()=>setMode(state.mode);
 document.getElementById('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else window.open(location.href,'_blank','noopener');}catch{document.getElementById('help').textContent='Ouvre l’aperçu dans un nouvel onglet pour l’agrandir.';}};
 renderer.domElement.addEventListener('keydown',e=>{if(e.key==='Home'){setMode('exterior');e.preventDefault();}if(e.key==='+'||e.key==='='){camera.position.lerp(controls.target,.1);e.preventDefault();}if(e.key==='-'){camera.position.sub(controls.target).multiplyScalar(1.1).add(controls.target);e.preventDefault();}});
 function resize(){const w=container.clientWidth,h=container.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(container);resize();setMode('exterior',true);
 document.getElementById('loading').hidden=true;document.body.classList.add('ready');
 let active=true;document.addEventListener('visibilitychange',()=>active=!document.hidden);
 const clock=new THREE.Clock();
 function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.06);if(!active||document.getElementById('viewer-panel')?.hidden)return;
  const f=1-Math.exp(-dt*7);
  if(destination){camera.position.lerp(destination.pos,f);controls.target.lerp(destination.target,f);if(camera.position.distanceTo(destination.pos)<.005&&controls.target.distanceTo(destination.target)<.005)destination=null;}
  for(const [name,side] of [['Porte_arriere_gauche',-1],['Porte_arriere_droite',1]]){const door=named(name);if(door){let angle=state.doors?-side*Math.PI*.68:0;door.rotation.y=reduce?angle:THREE.MathUtils.lerp(door.rotation.y,angle,f);}}
  const lateral=named('Porte_laterale');
  if(lateral){slideProgress=reduce?(state.sliding?1:0):THREE.MathUtils.lerp(slideProgress,state.sliding?1:0,f);lateral.position.x=.24*Math.min(slideProgress/.16,1);lateral.position.z=-1.55*Math.max(0,(slideProgress-.16)/.84);}
  controls.update(dt);renderer.render(scene,camera);
 }animate();
 window.VAN_VIEWER={scene,root,camera,renderer,controls,state,setMode,applyVisibility,named,ready:true};
 return window.VAN_VIEWER;
}
