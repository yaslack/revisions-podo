// Ajoute au modèle 3D (anat/jambe3d.bin + la liste ANAT3D de data/anat3d.js) une pièce de BodyParts3D, la même source que le reste du modèle.
// usage : node tools/add-bp3d.js FICHIER.obj clé "Nom en français" couche     (couche : os, lig, m1, m2, m3)
//   ex.  node tools/add-bp3d.js FJ3393.obj sacrum "Sacrum" os
// Les fichiers .obj sont dans isa_BP3D_4.0_obj_99.zip (https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html) :
//   FJ3393 = sacrum, FJ1424 = long ligament plantaire droit. BodyParts3D, © The Database Center for Life Science, CC BY-SA 2.1 JP.
// Puis relancer : node tools/build-anat3d.js
// La transformation des coordonnées de BodyParts3D (mm ; X, Y vers l'arrière, Z vers le haut) vers celles du modèle (y en haut, z en avant)
// a été retrouvée en superposant l'os coxal, le fémur et le tibia des deux côtés : écart moyen 0,01 millième, c'est la même transformation.
const fs = require('fs');
const [file, key, fr, layer] = process.argv.slice(2);
if (!file || !key || !fr || !['os', 'lig', 'm1', 'm2', 'm3'].includes(layer)) { console.error('usage : node tools/add-bp3d.js FICHIER.obj clé "Nom" os|lig|m1|m2|m3'); process.exit(1); }
const S = 0.0009701166602, OX = 0.0813937564, OY = -0.4293688727, OZ = -0.1048595921;
const tf = ([x, y, z]) => [S * x + OX, S * z + OY, -S * y + OZ];

const w = {}; new Function('window', fs.readFileSync('data/anat3d.js', 'utf8'))(w);
if (w.ANAT3D.some(m => m[0] === key)) { console.log(`${key} est déjà dans le modèle : rien à faire`); process.exit(0); }

const lines = fs.readFileSync(file, 'utf8').split('\n'), V = [], F = [];
for (const l of lines) {
  if (l.startsWith('v ')) V.push(tf(l.trim().split(/\s+/).slice(1, 4).map(Number)));
  else if (l.startsWith('f ')) { const f = l.trim().split(/\s+/).slice(1).map(t => parseInt(t, 10) - 1); for (let i = 1; i < f.length - 1; i++) F.push(f[0], f[i], f[i + 1]); }
}
if (V.some(v => v.some(c => Math.abs(c) >= .5))) throw new Error('pièce hors du cube du modèle (±0,5) : elle ne peut pas être codée sur 16 bits');
const isz = V.length > 65535 ? 4 : 2;

// le .bin : les sommets en entiers 16 bits (valeur / 32767 × 0,5), puis les indices ; chaque bloc aligné sur 4 octets
const old = fs.readFileSync('anat/jambe3d.bin'), pad = n => (4 - n % 4) % 4;
const vo = old.length + pad(old.length), vbytes = V.length * 6, io = vo + vbytes + pad(vo + vbytes), out = Buffer.alloc(io + F.length * isz);
old.copy(out, 0);
V.forEach((v, i) => v.forEach((c, j) => out.writeInt16LE(Math.round(c / .5 * 32767), vo + (i * 3 + j) * 2)));
F.forEach((x, i) => (isz === 4 ? out.writeUInt32LE(x, io + i * 4) : out.writeUInt16LE(x, io + i * 2)));
fs.writeFileSync('anat/jambe3d.bin', out);

w.ANAT3D.push([key, fr, layer, vo, V.length, io, F.length, isz]);
const src = fs.readFileSync('data/anat3d.js', 'utf8').replace(/window\.ANAT3D=\[.*?\];\n/, 'window.ANAT3D=' + JSON.stringify(w.ANAT3D) + ';\n');
fs.writeFileSync('data/anat3d.js', src);
console.log(`${fr} ajouté : ${V.length} sommets, ${F.length / 3} triangles (anat/jambe3d.bin : ${old.length} → ${out.length} octets)`);
