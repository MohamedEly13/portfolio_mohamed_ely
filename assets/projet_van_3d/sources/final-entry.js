import {startViewer} from './viewer.js';
const source=document.getElementById('van-model').textContent.trim();
const bytes=Uint8Array.from(atob(source),c=>c.charCodeAt(0));
startViewer(bytes.buffer).catch(error=>{
 console.error(error);
 const loading=document.getElementById('loading');loading.hidden=false;
 loading.innerHTML='<strong>L’aperçu 3D n’a pas pu démarrer.</strong><span>Essaie dans Chrome, Edge, Firefox ou Safari sur ton ordinateur.<br>Le modèle van-complet.glb reste disponible dans le dossier.</span>';
});
