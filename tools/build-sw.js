// Écrit sw.js avec la liste exacte des fichiers du site, pour qu'il marche hors ligne. usage: node tools/build-sw.js VERSION
const fs = require('fs'), path = require('path');
const v = process.argv[2];
global.window = {}; require(path.resolve('data/pedi.js')); require(path.resolve('data/podo.js')); require(path.resolve('data/anat.js'));
const files = ['./', 'index.html', 'style.css', 'app.js', 'aventure.js', 'jeu/decor-foret-v2.webp', 'jeu/decor-marais-v2.webp', 'jeu/decor-canyon-v2.webp', 'jeu/decor-grotte-v2.webp', 'jeu/decor-boss-v2.webp', 'jeu/heros-v2.png', 'jeu/heros-attaque-v2.png', ...['peau', 'ongle', 'vasc', 'med', 'podo', 'os', 'mus', 'test'].map(f => `jeu/monstre-${f}-v2.png`), 'jeu/carte.jpg', 'jeu/coffre.png', 'jeu/coffre-ouvert.png', 'jeu/ui-ic-ongle.png', 'jeu/ui-ic-vasc.png', 'jeu/btn-orange.png', 'jeu/btn-vert.png', 'jeu/btn-rouge.png', 'jeu/btn-gris.png', 'jeu/obj-bistouri.png', 'jeu/obj-gouge.png', 'jeu/obj-cryo.png', 'jeu/obj-fraise.png', 'jeu/obj-ortho.png', 'jeu/obj-semelles.png', 'jeu/obj-contention.png', 'jeu/obj-chut.png', 'jeu/obj-hexo.png', 'jeu/obj-dexeryl.png', 'jeu/obj-hydro.png', 'jeu/obj-rice.png', 'jeu/ui-logo.png', 'jeu/ui-cadre.png', 'jeu/ui-cadre-or.png', 'jeu/ui-ic-mus.png', 'jeu/ui-ic-os.png', 'jeu/ui-ic-podo.png', 'jeu/ui-ic-med.png', 'jeu/ui-ic-peau.png', 'jeu/ui-ic-test.png', 'jeu/ui-act-atk.png', 'jeu/ui-act-soin.png', 'jeu/ui-act-fin.png', 'jeu/ui-act-spe.png', 'jeu/ui-ban-niveau.png', 'jeu/ui-ban-victoire.png', 'jeu/ui-ban-defaite.png', 'jeu/monstre-peau-v2.png', 'jeu/monstre-ongle-v2.png', 'jeu/monstre-vasc-v2.png', 'jeu/monstre-med-v2.png', 'jeu/monstre-podo-v2.png', 'jeu/monstre-os-v2.png', 'jeu/monstre-mus-v2.png', 'jeu/monstre-test-v2.png', 'icons.js', 'musique.js', 'sons.js', 'apple-touch-icon.png', 'data/pedi.js', 'data/podo.js', 'data/anat.js', 'data/videos.js', 'data/quiz.js', 'data/anat3d.js', 'data/lexique.js', 'data/clinique.js', 'data/bilan.js', 'data/clinique-dessins.js', 'data/cas.js', 'data/loges.js', 'photos/equipe/yaya.jpg', 'photos/equipe/nono.jpg', 'fonts/fonts.css',
  ...fs.readdirSync('fonts').filter(f => f.endsWith('.woff2')).map(f => 'fonts/' + f),
  ...new Set(window.PEDI.flatMap(f => f.photos.map(p => p.src))), ...Object.values(window.ANAT_PL).map(p => p.src),
  // dessins : couvertures et plan en avance ; ceux des parties se mettent en cache à la première ouverture
  ...window.PEDI.map(f => `illus/${f.id}/cover.webp`), ...window.PODO.filter(f => f.ill).map(f => `illus/${f.id}/cover.${f.ill}`), ...fs.readdirSync('illus/plan').map(f => 'illus/plan/' + f)];
for (const f of files) if (f !== './' && !fs.existsSync(f)) throw new Error('fichier manquant : ' + f);
fs.writeFileSync('sw.js', `// Révisions podo · service worker v${v} (généré par tools/build-sw.js) : page à jour quand il y a du réseau, cache sinon ; images depuis le cache.
const CACHE = 'podo-v${v}';
const ASSETS = ${JSON.stringify(files)};
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => fetch(new Request(u, { cache: 'reload' })).then(r => r.ok && c.put(u, r)).catch(() => {})))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.endsWith('sw.js')) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE), hit = await c.match(req, { ignoreSearch: true });
    // images et polices : le cache d'abord (elles ne changent pas d'une version à l'autre sans changer de cache)
    if (hit && /\\.(webp|jpe?g|png|woff2)$/i.test(url.pathname)) return hit;
    const net = fetch(req, { cache: 'no-cache' }).then(r => { if (r.ok) c.put(req, r.clone()); return r; });
    // jamais vu : on attend le réseau, sans limite de temps (un téléphone lent finit par l'avoir)
    if (!hit) return net.catch(async () => (req.mode === 'navigate' && (await c.match('index.html'))) || Response.error());
    // page et scripts : le réseau d'abord pour la dernière version, le cache si le réseau traîne (3 s) ou ne répond pas
    return Promise.race([net, new Promise(r => setTimeout(() => r(hit), 3000))]).catch(() => hit);
  })());
});
`);
console.log('sw.js v' + v + ' :', files.length, 'fichiers');
