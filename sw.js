// Révisions Podo · service worker v14 : page toujours à jour quand il y a du réseau, version en cache sinon.
const CACHE="podo-v14";
const ASSETS=["./","index.html","apple-touch-icon.png"];
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
