// Écrit sw.js avec la liste exacte des fichiers du site, pour qu'il marche hors ligne. usage: node tools/build-sw.js VERSION
const fs = require('fs'), path = require('path');
const v = process.argv[2];
global.window = {}; require(path.resolve('data/pedi.js')); require(path.resolve('data/anat.js'));
const files = ['./', 'index.html', 'style.css', 'app.js', 'apple-touch-icon.png', 'data/pedi.js', 'data/anat.js', 'data/videos.js', 'fonts/fonts.css',
  ...fs.readdirSync('fonts').filter(f => f.endsWith('.woff2')).map(f => 'fonts/' + f),
  ...new Set(window.PEDI.flatMap(f => f.photos.map(p => p.src))), ...Object.values(window.ANAT_PL).map(p => p.src),
  // dessins : couvertures et plan en avance ; ceux des parties se mettent en cache à la première ouverture
  ...window.PEDI.map(f => `illus/${f.id}/cover.webp`), ...fs.readdirSync('illus/plan').map(f => 'illus/plan/' + f)];
for (const f of files) if (f !== './' && !fs.existsSync(f)) throw new Error('fichier manquant : ' + f);
fs.writeFileSync('sw.js', `// Révisions podo · service worker v${v} (généré par tools/build-sw.js) : page à jour quand il y a du réseau, cache sinon.
const CACHE = 'podo-v${v}';
const ASSETS = ${JSON.stringify(files)};
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => fetch(new Request(u, { cache: 'reload' })).then(r => r.ok && c.put(u, r)).catch(() => {})))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('sw.js')) return;
  // réseau d'abord (4 s max) pour avoir la dernière version, puis le cache
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 4000); const r = await fetch(req, { cache: 'no-cache', signal: ctl.signal }); clearTimeout(t); if (r.ok) c.put(req, r.clone()); return r; }
    catch (err) { return (await c.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' && (await c.match('index.html'))) || Response.error(); }
  })());
});
`);
console.log('sw.js v' + v + ' :', files.length, 'fichiers');
