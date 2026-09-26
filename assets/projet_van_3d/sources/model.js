import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Reconstitution interprétée des 13 photographies de Mohamed El Yagoubi.
// Axes : X = largeur, Y = haut, Z = avant. Unité = mètre. Cotes estimées.
export function buildVan() {
 const root = new T.Group(); root.name = 'Boxer_de_Mohamed';
 root.userData = {description:'Modèle interprété d’après 13 photographies. Dimensions estimées ; extérieur et aménagement intérieur.', units:'metres', version:'1.0'};
 const groups={};
 const group=n=>{const g=new T.Group();g.name=n;root.add(g);groups[n]=g;return g;};
 const base=group('Chassis'),cab=group('Cabine'),left=group('Paroi_gauche'),right=group('Paroi_droite');
 const rear=group('Portes_arriere'),roof=group('Toit'),lining=group('Lambris_gauche');
 const sliding=group('Porte_laterale');
 const liningR=group('Lambris_droit'),bulk=group('Cloison_cabine'),floor=group('Plancher');
 const kitchen=group('Cuisine'),shower=group('Douche'),lounge=group('Salon');
 const bed=group('Lit'),electric=group('Electricite'),water=group('Eau'),upper=group('Placards_hauts'),decor=group('Decoration');
 let seed=7407; const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function texture(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;}
 const wood=texture(512,256,(c,w,h)=>{
  c.fillStyle='#b88954';c.fillRect(0,0,w,h);
  for(let i=0;i<900;i++){const y=rand()*h;const k=rand();c.strokeStyle=k>.5?'rgba(239,203,147,.14)':'rgba(67,38,16,.13)';c.lineWidth=.2+rand()*1.2;c.beginPath();for(let x=0;x<=w;x+=8){const yy=y+Math.sin(x*.018+y*.11)*1.3+Math.sin(x*.036+y)*.65;x?c.lineTo(x,yy):c.moveTo(x,yy);}c.stroke();}
  for(let i=0;i<5;i++){let x=rand()*w,y=rand()*h;for(let j=0;j<8;j++){c.beginPath();c.ellipse(x,y,5+j*4,1.5+j*.95,0,0,Math.PI*2);c.strokeStyle=`rgba(69,39,17,${.17-j*.014})`;c.lineWidth=.8;c.stroke();}}
 });
 const cloth=texture(512,512,(c,w,h)=>{
  c.fillStyle='#ded5bf';c.fillRect(0,0,w,h);c.strokeStyle='#514a42';c.lineWidth=2;
  for(let i=0;i<16;i++){c.beginPath();let x=rand()*w,y=rand()*h;c.moveTo(x,y);for(let j=0;j<4;j++){c.bezierCurveTo(x+rand()*200-100,y+rand()*150-75,x+rand()*240-120,y+rand()*200-100,x+rand()*100-50,y+rand()*100-50);x+=rand()*80-40;y+=rand()*80-40;}c.stroke();}
  for(let i=0;i<4000;i++){c.fillStyle=rand()>.5?'#ffffff20':'#4433220c';c.fillRect(rand()*w,rand()*h,1,2);}
 });
 const fabric=texture(256,256,(c,w,h)=>{c.fillStyle='#b5b0a5';c.fillRect(0,0,w,h);for(let i=0;i<2400;i++){c.strokeStyle=rand()>.5?'#514f45':'#ebe7dd';c.globalAlpha=.45;c.beginPath();let x=rand()*w,y=rand()*h;c.moveTo(x,y);c.lineTo(x+rand()*18+2,y);c.stroke();}c.globalAlpha=1;});
 const quilt=texture(512,512,(c,w,h)=>{c.fillStyle='#e8e6dc';c.fillRect(0,0,w,h);for(let i=-6;i<10;i++){c.strokeStyle='#c9c9be';c.lineWidth=2;c.beginPath();c.moveTo(i*100,0);c.lineTo(i*100+512,512);c.moveTo(i*100,0);c.lineTo(i*100-512,512);c.stroke();}for(let i=0;i<10000;i++){c.fillStyle='#fff5';c.fillRect(rand()*w,rand()*h,1,1);}});
 const honey=texture(128,128,(c,w,h)=>{c.fillStyle='#272d30';c.fillRect(0,0,w,h);c.strokeStyle='#c4c5bd';c.lineWidth=1;for(let y=-12;y<150;y+=14)for(let x=-10;x<150;x+=16){c.beginPath();for(let i=0;i<6;i++){let a=i*Math.PI/3,xx=x+(Math.round(y/14)%2)*8+8*Math.cos(a),yy=y+8*Math.sin(a);i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.closePath();c.stroke();}});
 const solarTex=texture(512,512,(c,w,h)=>{c.fillStyle='#14202a';c.fillRect(0,0,w,h);for(let i=0;i<6;i++)for(let j=0;j<12;j++){c.fillStyle=(i+j)%3?'#172732':'#192b37';c.fillRect(i*w/6+1,j*h/12+1,w/6-2,h/12-2);}c.strokeStyle='#55707d';c.lineWidth=.4;for(let y=0;y<512;y+=5){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}});
 const mat=(name,color,opts={})=>{const m=new T.MeshStandardMaterial({color,roughness:.64,...opts});m.name=name;return m;};
 const M={white:mat('Carrosserie_blanc_casse','#eeefec',{roughness:.29,metalness:.22}),cream:mat('Placards_ivoire','#e9e6d9',{roughness:.48}),sage:mat('Meubles_vert_grise','#596f6b'),black:mat('Noir_satine','#202729',{roughness:.48}),rubber:mat('Caoutchouc','#151a1c',{roughness:.91}),tire:mat('Pneus','#222729',{roughness:.95}),chrome:mat('Metal_brosse','#aab1b0',{metalness:.88,roughness:.24}),darkMetal:mat('Acier_sombre','#4c5659',{metalness:.65,roughness:.42}),wood:mat('Lambris_pin','#ffffff',{map:wood,roughness:.72}),oak:mat('Plan_chene','#d7c5a6',{map:wood,roughness:.55}),cloth:mat('Coussins_a_motifs','#ffffff',{map:cloth,roughness:.97}),fabric:mat('Coussins_tisses','#ffffff',{map:fabric,roughness:1}),quilt:mat('Matelas_matellasse','#ffffff',{map:quilt,roughness:.94}),honey:mat('Bordure_matelas','#ffffff',{map:honey,roughness:.91}),glass:mat('Vitrages_fumes','#243e47',{metalness:.4,roughness:.17}),clear:mat('Verre_clair','#96bcc3',{metalness:.5,roughness:.15}),red:mat('Feux_rouges','#ab1728',{roughness:.25,metalness:.12}),amber:mat('Clignotants','#e99d33',{roughness:.25}),led:mat('LED_chaude','#ffe4a4',{emissive:'#ffc668',emissiveIntensity:2.5}),blue:mat('Modules_electriques_bleus','#178ac4',{roughness:.39}),orange:mat('Etiquette_batterie','#db782d'),wireRed:mat('Cable_positif','#a62b35'),green:mat('Feuillage','#3d6541'),soil:mat('Terreau','#31281c'),solar:mat('Cellules_solaires','#ffffff',{map:solarTex,metalness:.35,roughness:.24})};
 const tiles=Array.from({length:5},(_,i)=>mat('Ceramique_verte_'+i,['#1d4940','#235146','#294e42','#1b4039','#2d5549'][i],{roughness:.26,metalness:.07}));
 function mesh(g,geo,ma,pos=[0,0,0],rot=null,name=''){const m=new T.Mesh(geo,ma);m.position.set(...pos);if(rot)m.rotation.set(...rot);m.name=name||ma.name;m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
 function box(g,s,p,m,r=0,rot=null){return mesh(g,r?new RoundedBoxGeometry(...s,1,r):new T.BoxGeometry(...s),m,p,rot);}
 function cylinder(g,r,l,p,m,axis='y',r2=r,n=20){const a=mesh(g,new T.CylinderGeometry(r,r2,l,n),m,p);if(axis==='x')a.rotation.z=Math.PI/2;if(axis==='z')a.rotation.x=Math.PI/2;return a;}
 function ball(g,r,p,m,s=[1,1,1]){const b=mesh(g,new T.SphereGeometry(r,12,8),m,p);b.scale.set(...s);return b;}
 function line(g,pts,r,m,segments=28){return mesh(g,new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p))),segments,r,6,false),m);}
 function label(g,text,w,h,p,bg='#e6e4d9',fg='#273738',rot=[0,0,0]){const tx=texture(512,128,(c,W,H)=>{c.fillStyle=bg;c.fillRect(0,0,W,H);c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';c.font='bold 65px sans-serif';c.fillText(text,W/2,H/2,W-35);});return mesh(g,new T.PlaneGeometry(w,h),mat('Marquage_'+text,'#ffffff',{map:tx,roughness:.58}),p,rot);}
 function panel(g,pts,ma){const a=[];for(let i=1;i<pts.length-1;i++)a.push(...pts[0],...pts[i],...pts[i+1]);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(a,3));geo.computeVertexNormals();const mm=ma.clone();mm.side=T.DoubleSide;return mesh(g,geo,mm);}
 function yzShape(g,shape,x,d,ma){const geo=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false,curveSegments:24});geo.rotateY(Math.PI/2);geo.translate(x,0,0);return mesh(g,geo,ma);}
 function sideShape(g,x,z0,z1,y0,y1,ma,holes=[]){const s=new T.Shape();s.moveTo(-z0,y0);s.lineTo(-z1,y0);s.lineTo(-z1,y1);s.lineTo(-z0,y1);s.closePath();for(const [z,y,w,h] of holes){const q=new T.Path();q.moveTo(-z-w/2,y-h/2);q.lineTo(-z+w/2,y-h/2);q.lineTo(-z+w/2,y+h/2);q.lineTo(-z-w/2,y+h/2);q.closePath();s.holes.push(q);}return yzShape(g,s,x,.055,ma);}
 function knob(g,x,y,z,axis='x'){cylinder(g,.011,.020,[x,y,z],M.darkMetal,axis,undefined,10);ball(g,.022,[x+(axis==='x'?-.015:0),y,z+(axis==='z'?.015:0)],M.darkMetal,[axis==='x'?.55:1,1,axis==='z'?.55:1]);}

 // Châssis, plancher et roues. Les roues sont de vrais volumes tournants.
 box(base,[1.77,.16,5.5],[0,.50,1.03],M.black,.03);
 for(let x of [-.66,.66])box(base,[.09,.17,5.7],[x,.43,1.0],M.darkMetal);
 box(floor,[1.94,.06,4.16],[0,.645,-.01],M.black);
 for(let i=0;i<10;i++){const m=M.oak.clone();m.color.multiplyScalar(.9+(i%3)*.07);m.name='Lame_parquet_'+i;box(floor,[.19,.025,4.10],[-.864+i*.192,.69,-.015],m,.003);}
 for(const z of [-.69,3.12]){cylinder(base,.065,1.94,[0,.35,z],M.darkMetal,'x');for(const x of [-1.0,1.0]){
  const s=Math.sign(x);cylinder(base,.376,.26,[x,.376,z],M.tire,'x',undefined,48);
  const t=mesh(base,new T.TorusGeometry(.273,.082,10,40),M.tire,[x+s*.127,.376,z],[0,Math.PI/2,0]);
  cylinder(base,.233,.018,[x+s*.139,.376,z],M.chrome,'x',undefined,40);
  cylinder(base,.102,.037,[x+s*.158,.376,z],M.darkMetal,'x',undefined,28);
  cylinder(base,.073,.040,[x+s*.180,.376,z],M.chrome,'x');
  for(let i=0;i<10;i++){const a=i*Math.PI/5;ball(base,.034,[x+s*.151,.376+Math.cos(a)*.177,z+Math.sin(a)*.177],M.black,[.24,1,.82]);}
  for(let i=0;i<5;i++){const a=i*Math.PI*.4;cylinder(base,.010,.018,[x+s*.181,.376+Math.cos(a)*.081,z+Math.sin(a)*.081],M.chrome,'x',undefined,6);}
  for(let i=0;i<44;i++){const a=i*Math.PI*2/44;const q=box(base,[.225,.009,.019],[x,.376+Math.cos(a)*.374,z+Math.sin(a)*.374],M.rubber,.002);q.rotation.x=a;}
 }}
 // Coque latérale : découpes réelles des passages de roues et des fenêtres.
 for(const side of [-1,1]){
  const g=side<0?left:right;const x=side<0?-1.045:.99;
  const s=new T.Shape();s.moveTo(2.08,.44);s.lineTo(1.14,.44);
  for(let i=0;i<=28;i++){let a=Math.PI-i*Math.PI/28;const z=-.69+.44*Math.cos(a);s.lineTo(-z,.405+.44*Math.sin(a));}
  s.lineTo(-2.07,.44);s.lineTo(-2.07,2.70);s.quadraticCurveTo(-2.07,2.79,-1.98,2.79);s.lineTo(1.98,2.79);s.quadraticCurveTo(2.08,2.79,2.08,2.68);s.closePath();
  const win=new T.Path();win.moveTo(-1.98,1.47);win.lineTo(-.62,1.47);win.lineTo(-.62,2.16);win.lineTo(-1.98,2.16);win.closePath();s.holes.push(win);
  yzShape(g,s,x,.055,M.white);
  for(const zz of [-1.70,.7,1.8])box(g,[.07,.24,zz===.7?1.6:.56],[side*1.06,.59,zz],M.black,.025);
  // Fenêtre noire à deux panneaux, au niveau du salon/de la porte coulissante.
  const wg=side<0?lining:liningR;
  box(g,[.018,.76,1.43],[side*1.057,1.815,1.30],M.black,.04);
  box(g,[.023,.665,1.335],[side*1.070,1.815,1.30],M.glass,.025);
  box(g,[.026,.663,.025],[side*1.083,1.815,1.29],M.black);
  box(wg,[.10,.05,1.42],[side*.927,1.448,1.30],tiles[1],.012);
  for(const zz of [-1.68,.05,1.89])box(g,[.013,.045,.11],[side*1.088,.65,zz],M.amber,.007);
  // Nervures embouties et joints de porte.
  line(g,[[side*1.047,2.37,-1.94],[side*1.047,2.37,.15],[side*1.047,2.37,1.99]],.008,M.white,8);
  line(g,[[side*1.049,1.26,-1.97],[side*1.049,1.26,.18],[side*1.049,1.26,2.0]],.009,M.white,8);
  if(side>0){for(let zz of [.38,2.02])box(g,[.008,1.98,.010],[1.054,1.61,zz],M.darkMetal);box(g,[.065,.17,.058],[1.099,1.36,1.99],M.black,.018);box(g,[.035,.047,2.7],[1.082,1.365,-.70],M.black,.009);}
  else{box(g,[.028,.18,.20],[-1.077,1.07,-1.5],M.cream,.02);box(g,[.032,.13,.12],[-1.095,1.07,-1.5],M.white,.009);cylinder(g,.012,.007,[-1.115,1.06,-1.46],M.chrome,'x');}
  // Cerclage noir des arches.
  const pts=[];for(let i=0;i<=30;i++){const a=i*Math.PI/30;pts.push([side*1.079,.405+.458*Math.sin(a),-.69+.458*Math.cos(a)]);}line(g,pts,.028,M.black,30);
 }
 // Portes arrière, indépendantes pour l'ouverture animée.
 for(let side of [-1,1]){
  const hinge=new T.Group();hinge.name=side<0?'Porte_arriere_gauche':'Porte_arriere_droite';hinge.position.set(side*.95,0,-2.095);rear.add(hinge);
  const c=-side*.475;box(hinge,[.946,2.19,.065],[c,1.65,0],M.white,.035);
  box(hinge,[.937,.20,.077],[c,.65,-.012],M.black,.014);
  box(hinge,[.91,.022,.013],[c,1.50,-.044],M.white,.005);box(hinge,[.91,.022,.013],[c,2.22,-.044],M.white,.005);
  for(let j=0;j<14;j++)box(hinge,[.86,.124,.022],[c,.795+j*.139,.047],M.wood,.004);
  for(const y of [.64,2.12])box(hinge,[.073,.14,.10],[0,y,0],M.white,.02);
  if(side===1)box(hinge,[.078,.16,.08],[-.80,1.20,-.064],M.black,.022);
  if(side===-1){box(hinge,[.56,.15,.015],[c,.84,-.058],M.white,.01);label(hinge,'VAN PROJECT',.51,.104,[c,.84,-.070],'#ecece7','#253237',[0,Math.PI,0]);box(hinge,[.66,.048,.02],[c,.955,-.071],M.black,.009);}
 }
 box(rear,[1.99,.13,.16],[0,.48,-2.13],M.black,.05);
 box(rear,[.38,.09,.12],[0,2.785,-2.11],M.black,.03);box(rear,[.27,.043,.018],[0,2.798,-2.179],M.red,.014);
 for(const side of [-1,1]){box(rear,[.095,.77,.098],[side*.99,1.03,-2.10],M.black,.035);box(rear,[.079,.72,.100],[side*.99,1.045,-2.118],M.red,.03);box(rear,[.082,.18,.012],[side*.99,.975,-2.173],M.clear,.012);box(rear,[.05,.05,.018],[side*.99,.565,-2.185],M.red,.007);}
 label(rear,'BOXER',.20,.032,[.68,1.14,-2.137],'#edece6','#596160',[0,Math.PI,0]);
 // Cabine du Boxer : pare-brise incliné, capot court, calandre et rétroviseurs.
 for(const side of [-1,1]){
  const s=new T.Shape();s.moveTo(-2.08,.44);s.lineTo(-2.67,.44);
  for(let i=0;i<=28;i++){const a=Math.PI-i*Math.PI/28;s.lineTo(-(3.12+.46*Math.cos(a)),.40+.46*Math.sin(a));}
  s.lineTo(-4.18,.45);s.lineTo(-4.18,1.17);s.lineTo(-3.68,1.48);s.lineTo(-2.93,2.31);s.lineTo(-2.68,2.71);s.lineTo(-2.10,2.79);s.closePath();
  const wh=new T.Path();wh.moveTo(-2.21,1.47);wh.lineTo(-3.51,1.47);wh.lineTo(-2.88,2.25);wh.lineTo(-2.21,2.28);wh.closePath();s.holes.push(wh);
  yzShape(cab,s,side<0?-1.039:.984,.055,M.white);
  const x=side*1.044;
  panel(cab,[[side*1.039,2.31,2.93],[side*.89,2.31,2.94],[side*.96,2.70,2.64],[side*1.039,2.71,2.68]],M.white);
  panel(cab,[[side*1.039,1.48,3.68],[side*.965,1.48,3.69],[side*.89,2.31,2.94],[side*1.039,2.31,2.93]],M.white);
  panel(cab,[[side*1.039,2.71,2.68],[side*.96,2.70,2.64],[side*1.015,2.77,2.09],[side*1.039,2.79,2.10]],M.white);
  panel(cab,[[x,1.50,2.235],[x,1.50,3.46],[x,2.215,2.87],[x,2.25,2.235]],M.glass).material=M.glass.clone();
  cab.children[cab.children.length-1].material.side=T.DoubleSide;
  line(cab,[[x,1.46,2.21],[x,2.28,2.21],[x,2.27,2.88],[x,1.48,3.51],[x,1.46,2.21]],.018,M.black,16);
  line(cab,[[side*1.047,.70,2.145],[side*1.047,1.52,2.145],[side*1.047,2.39,2.145]],.005,M.darkMetal,5);
  box(cab,[.067,.16,.058],[side*1.073,1.31,2.26],M.black,.022);
  const pts=[];for(let i=0;i<=30;i++){const a=i*Math.PI/30;pts.push([side*1.068,.40+.478*Math.sin(a),3.12+.478*Math.cos(a)]);}line(cab,pts,.045,M.black,30);
  box(cab,[.07,.15,.54],[side*1.044,.51,2.33],M.black,.025);
  line(cab,[[side*1.04,1.54,3.21],[side*1.19,1.56,3.22],[side*1.28,1.63,3.22]],.034,M.black,10);
  box(cab,[.19,.31,.24],[side*1.285,1.69,3.20],M.black,.047);
  box(cab,[.14,.228,.018],[side*1.285,1.69,3.074],M.clear,.02);
  box(cab,[.017,.10,.047],[side*1.391,1.69,3.23],M.clear,.006);
 }
 // Capot et pare-brise sont des surfaces inclinées, pas des faces cubiques.
 panel(cab,[[-.98,1.48,3.68],[.98,1.48,3.68],[.96,1.20,4.19],[-.96,1.20,4.19]],M.white);
 const wind=panel(cab,[[-.89,2.31,2.94],[.89,2.31,2.94],[.965,1.48,3.69],[-.965,1.48,3.69]],M.glass.clone());wind.material.side=T.DoubleSide;
 line(cab,[[-.89,2.31,2.94],[.89,2.31,2.94],[.965,1.48,3.69],[-.965,1.48,3.69],[-.89,2.31,2.94]],.026,M.black,12);
 panel(cab,[[-1.015,2.77,2.09],[1.015,2.77,2.09],[.96,2.70,2.64],[.89,2.335,2.95],[-.89,2.335,2.95],[-.96,2.70,2.64]],M.white);
 for(const x of [-.56,.56])line(cab,[[x,2.79,2.15],[x,2.72,2.59],[x,2.45,2.83]],.013,M.white,12);
 for(const x of [-.44,.42])line(cab,[[x,1.475,3.72],[x+.16,1.516,3.65],[x+.33,1.56,3.61]],.015,M.black,8);
 line(cab,[[0,2.48,2.84],[0,2.85,2.73]],.007,M.black,2);
 box(cab,[1.96,.63,.24],[0,.86,4.12],M.black,.08);
 box(cab,[1.15,.43,.085],[0,.986,4.256],M.chrome,.07);
 box(cab,[1.015,.32,.105],[0,.99,4.281],M.black,.042);
 for(let i=0;i<5;i++)box(cab,[.995,.020,.021],[0,.865+i*.059,4.34],M.darkMetal,.007);
 for(let x of [-.30,0,.30])box(cab,[.020,.30,.021],[x,.99,4.325],M.black);
 for(const side of [-1,1]){
  const p=[[side*.98,1.38,3.884],[side*.54,1.26,4.23],[side*.57,1.16,4.245],[side*.94,1.23,4.055]];
  const head=panel(cab,side<0?p.reverse():p,M.clear.clone());head.material.side=T.DoubleSide;
  line(cab,[...p,p[0]],.022,M.black,12);
  for(let j=0;j<2;j++)ball(cab,.071,[side*(.66+j*.16),1.245+j*.03,4.16-j*.10],M.chrome,[1,.68,.3]);
  box(cab,[.055,.047,.035],[side*.925,1.295,4.035],M.amber,.01);
  cylinder(cab,.058,.025,[side*.79,.635,4.238],M.clear,'z');
  box(cab,[.33,.063,.025],[side*.65,.773,4.256],M.rubber,.025);
 }
 label(cab,'PEUGEOT',.225,.035,[0,1.177,4.309],'#aeb6b6','#384243');
 box(cab,[.59,.132,.022],[0,.586,4.267],M.white,.008);
 label(cab,'VAN PROJECT',.53,.096,[0,.586,4.280]);
 // Cockpit suggéré derrière les vitres teintées ; pas de détails inventés au premier plan.
 box(cab,[1.79,.19,.48],[0,1.27,3.21],M.black,.06);
 for(const x of [-.48,.43]){box(cab,[.45,.14,.45],[x,.89,2.53],M.black,.055);box(cab,[.44,.64,.13],[x,1.17,2.27],M.black,.052,[.07,0,0]);box(cab,[.28,.20,.10],[x,1.57,2.25],M.black,.035);}
 mesh(cab,new T.TorusGeometry(.145,.020,8,30),M.black,[-.48,1.43,2.96],[-.53,0,0]);

 // Toit démontable : nervures extérieures, panneau solaire et lanterneau.
 box(roof,[2.00,.08,4.16],[0,2.785,-.01],M.white,.075);
 for(let x=-.82;x<=.83;x+=.164)box(roof,[.027,.012,4.03],[x,2.834,-.025],M.white,.008);
 box(roof,[1.91,.017,4.08],[0,2.726,0],M.black);
 for(let i=0;i<27;i++)box(roof,[.047,.018,4.075],[-.91+i*.070,2.708,0],M.oak,.004);
 for(const x of [-.51,.51])box(roof,[.010,.009,3.90],[x,2.695,-.015],M.led,.003);
 box(roof,[1.04,.055,2.12],[0,2.904,-.70],M.black,.015);
 box(roof,[.995,.012,2.075],[0,2.938,-.70],M.solar,.006);
 for(const x of [-.57,.57])for(const z of [-1.66,.27]){box(roof,[.12,.065,.16],[x,2.862,z],M.black,.014);cylinder(roof,.011,.018,[x,2.898,z],M.chrome);}
 box(roof,[.12,.065,.14],[0,2.865,-1.94],M.black,.022);
 line(roof,[[0,2.87,-1.94],[.02,2.865,-1.84],[.09,2.892,-1.79]],.008,M.black,8);
 box(roof,[.46,.055,.46],[0,2.702,1.02],M.cream,.032);
 box(roof,[.38,.021,.38],[0,2.667,1.02],M.chrome,.008);
 for(let i=0;i<14;i++)box(roof,[.35,.013,.006],[0,2.653,.849+i*.026],M.cream);
 box(roof,[.44,.090,.44],[0,2.869,1.02],M.cream,.04);
 box(roof,[.40,.04,.40],[0,2.927,1.02],M.clear,.035);

 // Lambris intérieur en lames horizontales. Fenêtres laissées ouvertes.
 for(let side of [-1,1]){
  const g=side<0?lining:liningR;
  for(let row=0;row<15;row++){
   const y=.765+row*.130;
   if(y>1.44&&y<2.20){box(g,[.023,.123,2.62],[side*.966,y,-.74],M.wood,.002);}
   else box(g,[.023,.123,4.08],[side*.966,y,-.01],M.wood,.002);
  }
  for(let y of [1.43,2.205])box(g,[.04,.035,1.41],[side*.944,y,1.295],M.black);
  for(let z of [.59,2.0])box(g,[.04,.80,.034],[side*.944,1.814,z],M.black);
  box(g,[.012,.675,1.32],[side*.972,1.815,1.295],M.glass,.015);
  box(g,[.027,.695,.023],[side*.940,1.815,1.30],M.black);
 }
 // Cloison noire avec hublot entre salon et cabine.
 const bs=new T.Shape();bs.moveTo(-.95,.70);bs.lineTo(.95,.70);bs.lineTo(.95,2.69);bs.lineTo(-.95,2.69);bs.closePath();
 const hole=new T.Path();hole.moveTo(-.31,1.58);hole.lineTo(.31,1.58);hole.lineTo(.31,1.90);hole.lineTo(-.31,1.90);hole.closePath();bs.holes.push(hole);
 const bg=new T.ExtrudeGeometry(bs,{depth:.05,bevelEnabled:false});mesh(bulk,bg,M.black,[0,0,2.025]);
 box(bulk,[.65,.36,.033],[0,1.74,2.003],M.cream,.047);box(bulk,[.59,.285,.035],[0,1.74,1.982],M.glass,.04);
 box(bulk,[1.86,.05,.31],[0,2.33,1.867],M.black,.008);

 // Salon en L, côté conducteur et contre la cloison cabine.
 box(lounge,[.55,.41,1.24],[-.658,.905,1.365],M.sage,.012);
 box(lounge,[1.28,.41,.53],[.18,.905,1.754],M.sage,.012);
 box(lounge,[.55,.125,1.24],[-.658,1.170,1.365],M.cloth,.046);
 box(lounge,[1.28,.125,.53],[.18,1.170,1.754],M.cloth,.042);
 for(let z of [1.0,1.6])box(lounge,[.105,.29,.45],[-.867,1.37,z],M.fabric,.045,[0,0,-.10]);
 for(let x of [-.06,.53])box(lounge,[.43,.29,.105],[x,1.37,1.945],M.fabric,.044,[.10,0,0]);
 // Surpiqûres discrètes, répétées dans la géométrie du coussin.
 for(let z of [.99,1.36,1.70])line(lounge,[[-.885,1.216,z],[-.65,1.226,z],[-.425,1.216,z]],.0024,M.cream,6);

 // Cuisine longitudinale côté passager, façades et petit réfrigérateur noir.
 box(kitchen,[.54,.84,1.40],[.676,1.115,.105],M.sage,.013);
 // Façades tournées vers l'allée centrale (-X).
 for(let z of [-.345,.035]){box(kitchen,[.023,.69,.35],[.394,1.071,z],M.sage,.005);knob(kitchen,.368,1.354,z+.107);}
 box(kitchen,[.034,.58,.46],[.389,1.010,.513],M.black,.016);
 box(kitchen,[.035,.49,.413],[.368,1.006,.513],M.glass,.012);
 box(kitchen,[.041,.035,.39],[.353,1.283,.513],M.black,.005);
 box(kitchen,[.028,.115,.456],[.388,1.396,.513],M.sage,.006);knob(kitchen,.351,1.390,.515);
 box(kitchen,[.028,.057,1.35],[.389,.733,.10],M.oak,.005);
 // Plan de travail avec un véritable évidement pour la cuve.
 box(kitchen,[.598,.043,.88],[.68,1.556,.385],M.oak,.008);
 box(kitchen,[.598,.043,.14],[.68,1.556,-.55],M.oak,.008);
 box(kitchen,[.087,.043,.40],[.426,1.556,-.28],M.oak,.006);
 box(kitchen,[.105,.043,.40],[.927,1.556,-.28],M.oak,.006);
 box(kitchen,[.40,.024,.32],[.668,1.400,-.28],M.chrome,.028);
 for(let x of [.475,.866])box(kitchen,[.018,.145,.344],[x,1.478,-.28],M.chrome,.011);
 for(let z of [-.45,-.11])box(kitchen,[.408,.145,.018],[.67,1.478,z],M.chrome,.011);
 for(let x of [.46,.88])box(kitchen,[.034,.012,.388],[x,1.584,-.28],M.chrome,.012);
 for(let z of [-.463,-.097])box(kitchen,[.43,.012,.025],[.67,1.584,z],M.chrome,.009);
 cylinder(kitchen,.025,.006,[.67,1.416,-.29],M.darkMetal);
 box(kitchen,[.025,.37,.34],[.937,1.770,-.28],M.black,.027,[0,0,-.05]);
 line(kitchen,[[.848,1.584,-.060],[.848,1.89,-.060],[.74,1.96,-.06],[.647,1.905,-.06],[.647,1.83,-.06]],.013,M.chrome,28);
 cylinder(kitchen,.034,.022,[.848,1.587,-.060],M.chrome);
 line(kitchen,[[.80,1.60,.02],[.75,1.66,.02]],.01,M.chrome,6);
 // Crédence émeraude, joints visibles, carreaux légèrement nuancés.
 box(kitchen,[.016,.70,1.36],[.944,1.932,.092],M.cream);
 for(let row=0;row<7;row++)for(let col=0;col<7;col++)box(kitchen,[.021,.095,.188],[.930,1.631+row*.1,-.493+col*.196],tiles[(row*3+col)%5],.004);
 box(kitchen,[.028,.135,.060],[.903,1.765,.603],M.cream,.006);
 box(kitchen,[.032,.044,.044],[.884,1.792,.603],M.white,.003);
 cylinder(kitchen,.017,.009,[.881,1.731,.603],M.cream,'x');

 // Douche : 60 cm environ, entrée noire, lambris sur la joue avant et miroir rond.
 box(shower,[.66,.05,.67],[-.613,.747,.38],M.black,.008);
 box(shower,[.56,.035,.58],[-.60,.786,.38],M.cream,.014);
 for(let x of [-.882,-.32])box(shower,[.025,.061,.60],[x,.806,.38],M.cream,.007);
 for(let z of [.09,.674])box(shower,[.56,.061,.025],[-.60,.806,z],M.cream,.007);
 cylinder(shower,.026,.005,[-.43,.808,.23],M.chrome);
 box(shower,[.027,1.86,.64],[-.946,1.718,.38],M.black);
 box(shower,[.65,1.90,.032],[-.62,1.730,.704],M.wood);
 box(shower,[.636,1.862,.023],[-.62,1.730,.683],M.black);
 box(shower,[.635,1.885,.032],[-.62,1.730,.047],M.black);
 for(let z of [.037,.721])box(shower,[.040,1.94,.040],[-.277,1.727,z],M.black,.006);
 box(shower,[.04,.04,.704],[-.277,2.680,.38],M.black,.004);
 // Porte pliante repliée sur un bord pour voir la douche.
 for(let i=0;i<4;i++)box(shower,[.034,1.83,.029],[-.262-i*.012,1.734,.095+i*.036],M.darkMetal,.004);
 box(shower,[.059,.195,.034],[-.228,1.54,.185],M.black,.01);
 line(shower,[[-.889,1.28,.26],[-.84,1.08,.3],[-.78,1.34,.36],[-.885,2.32,.36]],.011,M.chrome,36);
 line(shower,[[-.889,1.34,.43],[-.889,2.36,.43]],.010,M.chrome,8);
 cylinder(shower,.05,.030,[-.858,2.40,.40],M.black,'x');
 line(shower,[[-.916,1.31,.16],[-.916,1.31,.43]],.019,M.chrome,8);
 box(shower,[.53,.010,.40],[-.62,2.677,.38],M.led);
 // Face avant bois et miroir visible depuis le salon.
 for(let i=0;i<13;i++)box(shower,[.64,.139,.022],[-.62,.825+i*.145,.731],M.wood,.002);


 // Lit transversal, sommier visible et bande latérale à motif alvéolé.
 for(let x of [-.86,.86])box(bed,[.035,.095,1.38],[x,1.388,-1.37],M.chrome,.004);
 for(let z of [-2.04,-.70])box(bed,[1.82,.08,.043],[0,1.398,z],M.chrome,.003);
 for(let i=0;i<15;i++)box(bed,[1.76,.018,.063],[0,1.443,-2.005+i*.09],M.oak,.004);
 box(bed,[1.835,.191,1.355],[0,1.555,-1.365],M.honey,.042);
 box(bed,[1.835,.044,1.355],[0,1.666,-1.365],M.quilt,.024);
 // Tuyauterie et électricité séparées pour la visite des coffres.
 box(electric,[.04,.64,1.34],[.91,1.035,-1.39],M.sage,.006);
 box(electric,[.46,.045,1.35],[.696,.745,-1.39],M.sage,.007);
 box(electric,[.355,.315,.56],[.685,.925,-1.729],M.black,.017);
 box(electric,[.366,.039,.567],[.685,1.099,-1.729],M.black,.008);
 label(electric,'12.8V 280Ah',.48,.16,[.497,.965,-1.729],'#d78335','#f8f3e3',[0,-Math.PI/2,0]);
 for(const [z,m] of [[-1.92,M.wireRed],[-1.51,M.black]]){cylinder(electric,.022,.036,[.64,1.135,z],m);}
 box(electric,[.19,.37,.30],[.72,1.04,-1.12],M.black,.025);
 box(electric,[.206,.383,.025],[.72,1.04,-1.283],M.orange,.012);
 box(electric,[.103,.205,.20],[.773,1.148,-.93],M.blue,.014);
 box(electric,[.114,.17,.19],[.762,.91,-.93],M.blue,.013);
 label(electric,'MPPT',.165,.043,[.715,1.15,-.93],'#1488c1','#f5f3e8',[0,-Math.PI/2,0]);
 box(electric,[.095,.255,.22],[.80,1.215,-1.49],M.cream,.020);
 box(electric,[.017,.172,.165],[.745,1.225,-1.49],M.glass,.013);
 for(const [z,m] of [[-1.27,M.wireRed],[-1.71,M.black]])box(electric,[.064,.047,.16],[.82,1.105,z],m,.010);
 cylinder(electric,.041,.033,[.76,1.10,-1.365],M.wireRed,'x');
 for(let i=0;i<6;i++)box(electric,[.029,.027,.047],[.783,1.245-i*.038,-1.805],i%2?M.amber:M.red,.003);
 line(electric,[[.64,1.15,-1.92],[.52,1.19,-1.98],[.5,1.21,-1.65],[.78,1.13,-1.27]],.014,M.wireRed,30);
 line(electric,[[.64,1.15,-1.51],[.58,1.21,-1.48],[.70,1.31,-1.65],[.82,1.12,-1.71]],.014,M.black,30);
 line(electric,[[.77,1.08,-.93],[.60,.78,-1.00],[.46,.78,-1.30],[.53,.98,-1.58]],.012,M.wireRed,30);
 line(electric,[[.78,1.29,-1.5],[.72,1.25,-1.43],[.69,.82,-1.25],[.70,.85,-1.1]],.010,M.cream,20);
 box(water,[.44,.34,.71],[-.686,.90,-1.01],M.sage,.014);
 box(water,[.38,.255,.64],[-.686,1.037,-1.01],M.cream,.033);
 cylinder(water,.13,.39,[-.69,.875,-1.74],M.black,'z',undefined,32);
 for(let z of [-1.90,-1.58])box(water,[.36,.025,.06],[-.69,.745,z],M.darkMetal,.004);
 cylinder(water,.055,.19,[-.83,1.145,-1.47],M.black);
 line(water,[[-.87,1.08,-1.5],[-.85,.90,-1.51],[-.71,.78,-1.38],[-.6,1.13,-1.02]],.015,M.clear,25);
 line(water,[[-.74,1.17,-1.1],[-.82,1.20,-1.3],[-.82,1.19,-1.45]],.012,M.cream,16);

 // Placards hauts ivoire, poignées sombres et bandeaux LED chauds.
 function cabinet(side,z,len){const x=side*.75;box(upper,[.43,.40,len],[x,2.456,z],M.cream,.012);for(let i=0;i<2;i++){let zz=z+(i===0?-1:1)*len*.25;box(upper,[.020,.365,len/2-.012],[side*.528,2.456,zz],M.cream,.005);knob(upper,side*.506,2.327,zz);}
  box(upper,[.28,.014,len-.04],[side*.75,2.243,z],M.led,.003);
 }
 cabinet(-1,-1.385,1.34);cabinet(-1,1.37,1.20);cabinet(1,.115,1.39);
 // Téléviseur sur le flanc droit au niveau du couchage.
 box(decor,[.047,.59,1.024],[.910,2.188,-1.393],M.black,.018);
 box(decor,[.012,.551,.982],[.880,2.192,-1.393],M.glass,.009);
 box(decor,[.018,.010,.12],[.870,1.914,-1.393],M.chrome,.002);
 // Deux petites plantes suspendues, visibles sur les photographies.
 for(const z of [.79,1.92]){
  cylinder(decor,.07,.085,[-.86,2.24,z],M.black,'y',.052,16);
  cylinder(decor,.062,.008,[-.86,2.286,z],M.soil);
  for(let k=0;k<4;k++){const xx=-.85+k*.024,zz=z+.035*Math.sin(k);line(decor,[[xx,2.27,zz],[xx+.016,2.06,zz],[xx+.04,1.83+k*.025,zz]],.003,M.green,14);
   for(let j=0;j<7;j++){const leaf=ball(decor,.027,[xx+.024*Math.sin(j*2),2.245-j*.054,zz+.022*Math.cos(j)],M.green,[.8,1.45,.24]);leaf.rotation.set(.3,j*.9,j*.6);}}
 }
 // Correction de l'implantation : étendre la douche vers le lit en conservant
 // sa joue avant côté salon. Sa paroi arrière rejoint le bord du matelas.
 const showerFront=.782,bedFront=-.6875;
 const showerStretch=(showerFront-bedFront)/(showerFront-.031);
 const showerTransform=new T.Matrix4().makeTranslation(0,0,showerFront)
  .multiply(new T.Matrix4().makeScale(1,1,showerStretch))
  .multiply(new T.Matrix4().makeTranslation(0,0,-showerFront));
 for(const m of shower.children){m.updateMatrix();m.geometry.applyMatrix4(showerTransform.clone().multiply(m.matrix));m.position.set(0,0,0);m.rotation.set(0,0,0);m.scale.set(1,1,1);m.updateMatrix();}
 shower.userData.modification='Douche agrandie jusqu’au lit selon la correction du propriétaire.';
 // Façade réelle côté allée : porte noire côté lit et panneau bois côté salon.
 // Ajout après l'agrandissement pour conserver un miroir parfaitement rond.
 box(shower,[.033,1.90,.51],[-.253,1.723,.477],M.wood,.003);
 for(let i=0;i<13;i++)box(shower,[.018,.139,.51],[-.226,.825+i*.145,.477],M.wood,.002);
 for(const z of [.212,.742])box(shower,[.035,1.954,.024],[-.222,1.725,z],M.black,.004);
 box(shower,[.035,.024,.554],[-.222,2.701,.477],M.black,.004);
 box(shower,[.028,1.83,.80],[-.275,1.721,-.225],M.black,.007);
 box(shower,[.024,1.79,.023],[-.253,1.721,-.57],M.darkMetal,.003);
 cylinder(shower,.170,.020,[-.200,2.184,.477],M.black,'x',undefined,48);
 cylinder(shower,.152,.005,[-.186,2.184,.477],M.clear,'x',undefined,48);
 line(shower,[[-.201,2.249,.329],[-.201,2.546,.477],[-.201,2.249,.625]],.008,M.black,3);
 box(shower,[.024,.087,.087],[-.195,1.565,.477],M.cream,.006);
 box(shower,[.027,.055,.055],[-.180,1.565,.477],M.white,.003);
 shower.userData.frontPanel='Lambris bois côté allée, miroir rond à sangle et interrupteur ; photo IMG_8589(1).jpeg.';


 // Extraire une vraie porte de la coque et du lambris, avec sa fenêtre.
 // Découpage des triangles : aucune paroi fixe ne bouche l'ouverture.
 function splitDoor(g){
  const planes=[[2,1,-.38],[2,-1,2.035],[1,1,-.65],[1,-1,2.615]];
  const clip=(poly,axis,sign,offset,keep)=>{
   const out=[];if(!poly.length)return out;
   for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=keep*(sign*a[axis]+offset),db=keep*(sign*b[axis]+offset);const ia=da>=-1e-9,ib=db>=-1e-9;
    if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push(a.map((v,k)=>v+(b[k]-v)*t));}
   }return out;
  };
  const append=(poly,output)=>{for(let i=1;i<poly.length-1;i++){const a=poly[0],b=poly[i],c=poly[i+1];const ab=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),ac=new T.Vector3(c[0]-a[0],c[1]-a[1],c[2]-a[2]);if(ab.cross(ac).lengthSq()<1e-18)continue;output.push(a,b,c);}};
  const geometry=vertices=>{const p=[],n=[],uv=[];for(const v of vertices){p.push(...v.slice(0,3));const l=Math.hypot(...v.slice(3,6))||1;n.push(v[3]/l,v[4]/l,v[5]/l);uv.push(v[6],v[7]);}const out=new T.BufferGeometry();out.setAttribute('position',new T.Float32BufferAttribute(p,3));out.setAttribute('normal',new T.Float32BufferAttribute(n,3));out.setAttribute('uv',new T.Float32BufferAttribute(uv,2));return out;};
  for(const m of [...g.children]){if(!m.isMesh)continue;m.updateMatrix();const geo=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();geo.applyMatrix4(m.matrix);const p=geo.getAttribute('position'),n=geo.getAttribute('normal'),uv=geo.getAttribute('uv'),moving=[],fixed=[];
   for(let i=0;i<p.count;i+=3){let poly=[0,1,2].map(k=>[p.getX(i+k),p.getY(i+k),p.getZ(i+k),n.getX(i+k),n.getY(i+k),n.getZ(i+k),uv?uv.getX(i+k):0,uv?uv.getY(i+k):0]);
    for(const [axis,sign,offset] of planes){append(clip(poly,axis,sign,offset,-1),fixed);poly=clip(poly,axis,sign,offset,1);if(!poly.length)break;}append(poly,moving);
   }
   g.remove(m);if(fixed.length)mesh(g,geometry(fixed),m.material);if(moving.length)mesh(sliding,geometry(moving),m.material);geo.dispose();
  }
 }
 splitDoor(right);splitDoor(liningR);
 // Joint et seuil fixes, conservés lors du coulissement vers l'arrière.
 for(const z of [.365,2.055])box(right,[.036,1.975,.025],[1.00,1.637,z],M.black,.006);
 box(right,[.15,.035,1.70],[.982,.654,1.206],M.darkMetal,.004);
 box(right,[.033,.026,1.70],[1.00,2.630,1.205],M.black,.004);
 sliding.userData={type:'sliding-door',openOffset:[.24,0,-1.55],description:'Porte latérale côté cuisine ; coulisse vers l’arrière.'};
 root.userData.version='1.2';
 // Références utiles lors de la réouverture du fichier dans un modeleur.
 kitchen.userData.photos=['IMG_8601.jpeg','IMG_8590.jpeg'];shower.userData.photos=['IMG_9064.jpeg','IMG_8589(1).jpeg'];
 lounge.userData.photos=['IMG_9020.jpeg','IMG_9019.jpeg'];bed.userData.photos=['IMG_8948.jpeg','IMG_9045.jpeg'];
 electric.userData.photos=['IMG_9001.jpeg'];roof.userData.photos=['IMG_9073(1).jpeg','IMG_9019.jpeg'];
 cab.userData.photos=['IMG_7257(1).jpeg'];rear.userData.photos=['IMG_9072(1).jpeg'];
 // Fusion par matériau au sein des groupes amovibles : moins d'appels de dessin.
 function optimize(g){for(const c of [...g.children])if(c.isGroup)optimize(c);g.updateWorldMatrix(true,true);
  const buckets=new Map();for(const m of g.children){if(!m.isMesh||Array.isArray(m.material))continue;const key=m.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(m);}
  for(const items of buckets.values()){if(items.length<2)continue;const geometries=items.map(m=>{let a=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();a.applyMatrix4(m.matrix);if(!a.getAttribute('uv'))a.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(a.getAttribute('position').count*2),2));return a;});const geo=mergeGeometries(geometries,false);if(!geo)continue;const combined=mesh(g,geo,items[0].material);combined.name=items[0].material.name;items.forEach(m=>g.remove(m));geometries.forEach(a=>a.dispose());}
 }
 optimize(root);root.updateMatrixWorld(true);return {root,groups};
}
