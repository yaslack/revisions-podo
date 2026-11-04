// Moments des dessins d'un épisode (couverture + milieu et fin de chaque partie), calculés comme la frise du moteur vidéo
// (js/main.js : durée d'une scène = lead + durée de la voix + tail, transitions qui se chevauchent), sans rien lancer dans le projet vidéo.
// usage: node tools/podo-frames.js VIDEO_PLAN_DIR EPISODE   →   lignes « nom temps_en_secondes » (cover, p1a, p1b, …)
const fs = require('fs'), path = require('path'), vm = require('vm'), { execFileSync } = require('child_process');
const [root, ep] = process.argv.slice(2), dir = path.join(root, 'episodes', ep);
const TRD = { slide: 0.7, ink: 0.9, none: 0 };
const noop = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : noop), apply: () => noop });
// mêmes durées que js/props.js et js/fiche.js
const g = {
  window: {}, Math,
  partScene: (k, clip, body, ho = {}) => ({ part: k, clip, lead: 2.0, tail: ho.tail ?? 0.9, trans: 'slide' }),
  coverScene: clip => ({ cover: true, clip, lead: 1.0, tail: 0.9, trans: 'none' }),
  memoScene: clip => ({ clip, lead: 1.0, tail: 1.2, trans: 'slide' }),
  quizPair: (n, total, qId, aId) => [{ clip: qId, lead: 1.0, tail: 4.6, trans: 'slide' }, { clip: aId, lead: 0.4, tail: 1.6, trans: 'none' }],
  outroScene: clip => ({ clip, lead: 0.8, tail: 4.5, trans: 'ink' }),
};
const ctx = vm.createContext(g);
const run = code => { for (let i = 0; i < 300; i++) { try { return vm.runInContext(code, ctx); } catch (e) { const m = /^(\w+) is not defined/.exec(e.message); if (!m) throw e; ctx[m[1]] = noop; } } };
run(fs.readFileSync(path.join(dir, 'script.js'), 'utf8'));
run(fs.readFileSync(path.join(dir, 'scenes.js'), 'utf8'));
const scenes = ctx.window.SCENES.flat();
const dur = id => { for (const ext of ['mp3', 'wav']) { const f = path.join(dir, 'audio', `${id}.${ext}`); if (fs.existsSync(f)) return +execFileSync('afinfo', [f]).toString().match(/estimated duration: ([\d.]+)/)[1]; } throw new Error('voix introuvable ' + id); };
let t = 0; const out = [];
scenes.forEach((d, i) => {
  if (!d || !d.clip) throw new Error('scène inconnue ' + i);
  if (i > 0) t -= TRD[d.trans] || 0;
  const D = d.lead + dur(d.clip) + d.tail;
  if (d.cover) out.push(['cover', t + D * 0.92]);
  if (d.part != null) out.push([`p${d.part + 1}a`, t + D * 0.55], [`p${d.part + 1}b`, t + D * 0.97]);   // partScene(k) : k commence à 0
  t += D;
});
console.log(out.map(([n, s]) => `${n} ${s.toFixed(3)}`).join('\n'));
console.error(`${ep} : ${out.length} images, vidéo de ${t.toFixed(1)} s`);
