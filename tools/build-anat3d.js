// Écrit data/anat3d.js : la liste des pièces du modèle 3D (anat/jambe3d.bin, BodyParts3D © DBCLS, CC BY-SA 2.1 JP)
// et, pour chacune des 59 questions, ce qu'il faut toucher : un muscle entier, ou un point calculé sur l'os.
// Aussi : l'origine (o) et la terminaison (t) de chaque muscle, en points, et les petits muscles du pied absents du modèle (ANAT3D_X),
// dessinés comme des tubes entre des points pris sur les os. Les pièces de BodyParts3D ajoutées après coup (sacrum, long ligament plantaire)
// viennent de tools/add-bp3d.js.
// usage: node tools/build-anat3d.js [ANCIEN_INDEX.html]   (index.html de la v32 : git show a4ceada:index.html ; sans lui, la liste des pièces est relue dans data/anat3d.js)
const fs = require('fs');
let M;   // [key, nom, couche, vo, vc, io, ic, isz]
if (process.argv[2]) { const old = fs.readFileSync(process.argv[2], 'utf8').split('\n'), line = old.find(l => l.startsWith('const ANAT3D=[')); M = JSON.parse(line.slice(line.indexOf('['), line.lastIndexOf(']') + 1)); }
else { const w = {}; new Function('window', fs.readFileSync('data/anat3d.js', 'utf8'))(w); M = w.ANAT3D; }
const buf = fs.readFileSync('anat/jambe3d.bin'), dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
const V = {};
for (const [key, , , vo, vc] of M) { const a = []; for (let i = 0; i < vc; i++) a.push([0, 1, 2].map(j => dv.getInt16(vo + (i * 3 + j) * 2, true) / 32767 * 0.5)); V[key] = a; }
// repère du modèle : y vers le haut, z vers l'avant, x vers le dedans (jambe droite)
const box = k => { const a = V[k], lo = [0, 1, 2].map(j => Math.min(...a.map(v => v[j]))), hi = [0, 1, 2].map(j => Math.max(...a.map(v => v[j]))); return { lo, hi }; };
const yRel = (k, v) => { const b = box(k); return (v[1] - b.lo[1]) / (b.hi[1] - b.lo[1]); };   // 0 = bas de l'os, 1 = haut
// le point de l'os le plus loin dans la direction d, parmi ceux qui passent le filtre
const ext = (k, d, f = () => true) => V[k].filter(v => f(v)).reduce((b, v) => (v[0] * d[0] + v[1] * d[1] + v[2] * d[2] > b[0] ? [v[0] * d[0] + v[1] * d[1] + v[2] * d[2], v] : b), [-1e9, null])[1];
const mid = (a, b) => a.map((x, i) => (x + b[i]) / 2);
const A = [0, 0, 1], P = [0, 0, -1], U = [0, 1, 0], D = [0, -1, 0], L = [-1, 0, 0], Me = [1, 0, 0];
const add = (...ds) => ds.reduce((s, d) => s.map((x, i) => x + d[i]), [0, 0, 0]);
const sc = (d, k) => d.map(x => x * k);
const T = {
  1: { p: ext('os-coxal', add(P, sc(U, .3)), v => yRel('os-coxal', v) > .5) },
  2: { p: ext('os-coxal', U), r: 1.6 },
  3: { p: ext('os-coxal', A, v => yRel('os-coxal', v) > .55) },
  4: { p: ext('femur', L, v => yRel('femur', v) > .85) },
  5: { m: ['moyen-fessier'] }, 6: { m: ['grand-fessier'] },
  8: { m: ['biceps-long', 'biceps-court', 'semi-tendineux', 'semi-membraneux'] },
  9: { m: ['piriforme'] }, 10: { m: ['iliaque'] }, 11: { m: ['sartorius'] }, 12: { m: ['droit-femoral'] }, 13: { m: ['long-adducteur'] },
  14: { m: ['gracile'] }, 15: { m: ['tfl'] },
  16: { m: ['patella'] },
  17: { p: ext('tibia', A, v => yRel('tibia', v) > .8 && yRel('tibia', v) < .92) },
  18: { p: ext('fibula', U) },
  19: { p: ext('tibia', add(sc(A, .6), sc(L, .8)), v => yRel('tibia', v) > .86 && yRel('tibia', v) < .95) },
  20: { m: ['biceps-long', 'biceps-court'] }, 21: { m: ['semi-tendineux'] }, 22: { m: ['semi-membraneux'] }, 23: { m: ['gastroc-med', 'gastroc-lat'] },
  24: { p: mid(ext('patella', D), ext('tibia', A, v => yRel('tibia', v) > .8 && yRel('tibia', v) < .92)) },
  25: { m: ['vaste-medial'] }, 26: { m: ['vaste-lateral'] },
  27: { p: mid(ext('tibia', add(Me, sc(A, .3)), v => yRel('tibia', v) > .8 && yRel('tibia', v) < .88), ext('gracile', D)), r: 1.4 },
  28: { p: mid(ext('talus', add(L, sc(A, .4))), ext('calcaneus', add(L, A, U))), r: 1.2 },
  29: { p: ext('talus', add(U, sc(A, .6))) },
  30: { p: ext('talus', add(A, U)) },
  31: { p: mid(ext('m1', A), ext('p1-1', P)) },
  32: { m: ['m1'] }, 33: { m: ['cuneiforme-m'] },
  34: { p: ext('naviculaire', Me) },
  35: { p: ext('tibia', Me, v => yRel('tibia', v) < .06) },
  36: { p: ext('calcaneus', Me) },
  37: { m: ['cuboide'] },
  38: { p: ext('calcaneus', L) },
  39: { p: ext('fibula', D) },
  40: { p: ext('calcaneus', add(P, D, sc(Me, .5))) },
  41: { p: ext('m1', D, v => v[2] > box('m1').hi[2] - (box('m1').hi[2] - box('m1').lo[2]) * .2) },
  42: { m: ['tibial-ant'] }, 43: { m: ['long-extenseur-hallux'] }, 44: { m: ['long-extenseur-orteils'] },
  45: { p: ext('m1', U), r: 1.3 },                                   // court extenseur de l'hallux : sur le dos du 1er métatarsien
  46: { p: ext('cuneiforme-l', add(U, sc(L, .5))), r: 1.5 },          // court extenseur des orteils : dos du pied, en dehors
  47: { m: ['tibial-post'] }, 48: { m: ['soleaire'] }, 49: { m: ['achille'] }, 50: { m: ['long-fibulaire'] }, 51: { m: ['court-fibulaire'] },
  52: { m: ['long-flechisseur-orteils'] }, 53: { m: ['long-flechisseur-hallux'] }, 54: { m: ['court-flechisseur-orteils'] },
  55: { p: ext('m1', D), r: 1.3 },                                   // court fléchisseur de l'hallux : sous le 1er métatarsien
  56: { m: ['abducteur-5'] },
  57: { p: ext('m5', D), r: 1.3 },                                   // court fléchisseur du 5e : sous le 5e métatarsien
  58: { m: ['abducteur-hallux'] },
  59: { m: ['m2'] }, 60: { m: ['m5'] },
};
// ---------- les petits muscles du pied absents du modèle : des tubes (chemin de points, rayon à chaque point) posés sur les os ----------
const lift = (p, d, k) => add(p, sc(d, k));
const zRel = (k, v) => { const b = box(k); return (v[2] - b.lo[2]) / (b.hi[2] - b.lo[2]); };   // 0 = arrière de l'os, 1 = avant
const near = (k, f) => v => f(zRel(k, v));
const sinus = ext('calcaneus', add(A, U, sc(L, .7)));   // l'avant du calcanéus, côté dehors : d'où partent les deux courts extenseurs
const dors = (k, at) => lift(ext(k, U, near(k, z => Math.abs(z - at) < .2)), U, .0035);
const plant = (k, at) => lift(ext(k, D, near(k, z => Math.abs(z - at) < .2)), D, .004);
const split = lift(mid(ext('cuboide', U), ext('cuneiforme-l', U)), U, .008);
const X = [
  { key: 'court-extenseur-orteils', fr: 'Court extenseur des orteils', layer: 'm2', q: 46, tubes: [
    { p: [lift(sinus, U, .004), lift(mid(sinus, split), U, .006), split], r: [.005, .008, .006] },
    ...['2', '3', '4'].map(n => ({ p: [split, dors('m' + n, .35), dors('m' + n, .85), dors(`p${n}-1`, .5)], r: [.0035, .0022, .0018, .0016] }))] },
  { key: 'court-extenseur-hallux', fr: 'Court extenseur de l’hallux', layer: 'm2', q: 45, tubes: [
    { p: [lift(add(sinus, sc(Me, .006)), U, .006), lift(ext('cuneiforme-i', U), U, .009), dors('m1', .45), dors('m1', .9), dors('p1-1', .45)], r: [.005, .0065, .003, .002, .0018] }] },
  { key: 'court-flechisseur-hallux', fr: 'Court fléchisseur de l’hallux', layer: 'm3', q: 55, tubes: [-1, 1].map(s => (
    { p: [lift(plant('cuneiforme-m', .4), L, .004), lift(plant('m1', .35), Me, .004 * s), lift(plant('m1', .8), Me, .006 * s), lift(plant('p1-1', .2), Me, .003 * s)], r: [.003, .0055, .0045, .002] })) },
  { key: 'court-flechisseur-5', fr: 'Court fléchisseur du 5e orteil', layer: 'm3', q: 57, tubes: [
    { p: [plant('m5', .1), lift(plant('m5', .5), D, .002), plant('m5', .9), plant('p5-1', .25)], r: [.0028, .0045, .0035, .0018] }] },
];
for (const x of X) V[x.key] = V[x.key] || x.tubes.flatMap(t => t.p);   // le ligament patellaire : on touche la bande elle-même

for (const x of X) if (x.q) { T[x.q] = { m: [x.key], o: x.tubes[0].p[0], t: x.tubes.length > 2 ? x.tubes.slice(1).map(t => t.p[t.p.length - 1]) : x.tubes[0].p[x.tubes[0].p.length - 1] }; V[x.key] = x.tubes.flatMap(t => t.p); }

// ---------- origine et terminaison des muscles du modèle : la zone d'attache du haut (ou du dedans, ou de l'arrière), puis la zone la plus loin de celle-ci ----------
const AXIS = { piriforme: Me, 'abducteur-hallux': P, 'abducteur-5': P, 'court-flechisseur-orteils': P };
const zone = (a, f) => { const s = a.map(f), hi = Math.max(...s), lo = Math.min(...s), pick = a.filter((v, i) => s[i] >= hi - (hi - lo) * .04); return [0, 1, 2].map(j => pick.reduce((t, v) => t + v[j], 0) / pick.length); };
const ot = keys => { const a = keys.flatMap(k => V[k]), d = AXIS[keys[0]] || U, o = zone(a, v => v[0] * d[0] + v[1] * d[1] + v[2] * d[2]);
  return { o, t: /^(soleaire|gastroc)/.test(keys[0]) ? zone(V.achille, v => -v[1]) : zone(a, v => Math.hypot(v[0] - o[0], v[1] - o[1], v[2] - o[2])) }; };

global.window = {}; require(require('path').resolve('data/anat.js'));
for (const x of window.ANAT_Q) { const t = T[x.q]; if (x.o && x.t && t.m && !t.o) Object.assign(t, ot(t.m)); }
const miss = window.ANAT_Q.filter(x => !T[x.q]).map(x => x.q);
if (miss.length) throw new Error('questions sans cible 3D : ' + miss);
const r4 = p => Array.isArray(p[0]) ? p.map(r4) : p.map(x => +x.toFixed(4));
for (const [q, t] of Object.entries(T)) { if (t.m) t.m.forEach(k => { if (!V[k]) throw new Error('pièce inconnue ' + k); }); for (const f of ['p', 'o', 't']) if (t[f]) t[f] = r4(t[f]); }
for (const x of X) { delete x.q; x.tubes.forEach(t => { t.p = r4(t.p); t.r = t.r.map(v => Array.isArray(v) ? r4(v) : +v.toFixed(4)); }); }
fs.writeFileSync('data/anat3d.js', '// Généré par tools/build-anat3d.js : pièces du modèle 3D et cible de chaque question. Ne pas éditer à la main.\nwindow.ANAT3D=' + JSON.stringify(M) + ';\nwindow.ANAT3D_T=' + JSON.stringify(T) + ';\nwindow.ANAT3D_X=' + JSON.stringify(X) + ';\n');
console.log(M.length, 'pièces +', X.length, 'muscles dessinés,', Object.keys(T).length, 'cibles :', Object.values(T).filter(t => t.p).length, 'points,', Object.values(T).filter(t => t.m).length, 'pièces entières');
