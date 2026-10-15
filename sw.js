// Révisions Podo · service worker v31 : page toujours à jour quand il y a du réseau, version en cache sinon.
// Les planches d’anatomie (anat/*.webp) et les photos de pédicurie (photos/*.webp) sont mises en cache dès l’installation pour marcher hors ligne.
const CACHE="podo-v31";
const ASSETS=["./","index.html","apple-touch-icon.png","vendor/three-mini.js","anat/jambe3d.bin"].concat(["b-acetabulum.webp","b-apo-plantaire.webp","b-art-cuisse.webp","b-art-jambe.webp","b-art-pied.webp","b-bassin.webp","b-cheville.webp","b-coupe-cuisse.webp","b-coupe-jambe.webp","b-coxal.webp","b-cuisse-ant.webp","b-cuisse-int.webp","b-cuisse-post.webp","b-femur.webp","b-fesse1.webp","b-fesse2.webp","b-genou.webp","b-hanche-lig.webp","b-jambe-ant.webp","b-jambe-ext.webp","b-jambe-post.webp","b-nerf-cuisse.webp","b-nerf-cutane.webp","b-nerf-dos-pied.webp","b-nerf-fesse.webp","b-nerf-jambe-ext.webp","b-nerf-jambe.webp","b-nerf-plante.webp","b-pied-dos.webp","b-pied-lig.webp","b-pied-os.webp","b-pied-plante.webp","b-plante-prof.webp","b-tibia.webp","b-veines.webp","r-amplitudes.webp","r-hanchemus.webp","r-marche.webp","r-parcours1.webp","r-parcours2.webp","r-squelette.webp","r-vaisseaux.webp","r-voute.webp"].map(f=>"anat/"+f)).concat(["ains-1.webp","ains-2.webp","antifongiques-1.webp","antifongiques-2.webp","antiseptiques-1.webp","antiseptiques-2.webp","aomi-1.webp","aomi-2.webp","hyperkeratoses-1.webp","hyperkeratoses-2.webp","onychodys-1.webp","onychodys-2.webp","phlebite-1.webp","phlebite-2.webp","phlyctenes-1.webp","phlyctenes-2.webp","sudoraux-1.webp","sudoraux-2.webp","varices-1.webp","varices-2.webp","verrues-1.webp","verrues-2.webp"].map(f=>"photos/"+f));
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>fetch(new Request(u,{cache:"reload"})).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET")return;
  const url=new URL(req.url); if(url.origin!==location.origin)return;
  if(url.pathname.endsWith("version.json")||url.pathname.endsWith("sw.js"))return;
  const isPage=req.mode==="navigate"||url.pathname.endsWith("/")||url.pathname.endsWith(".html");
  if(isPage){
    e.respondWith((async()=>{
      const c=await caches.open(CACHE);
      try{
        const ctrl=new AbortController(); const t=setTimeout(()=>ctrl.abort(),4000);
        const r=await fetch(req,{cache:"no-cache",signal:ctrl.signal}); clearTimeout(t);
        if(r&&r.ok){await c.put("index.html",r.clone());await c.put("./",r.clone());return r}
      }catch(err){}
      return (await c.match("index.html"))||(await c.match("./"))||Response.error();
    })());
    return;
  }
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(req,{ignoreSearch:true});if(hit)return hit;try{const r=await fetch(req);if(r.ok)c.put(req,r.clone());return r}catch(err){return Response.error()}}));
});
