// Découpe une planche ImageGen, conserve l'alpha et publie son manifeste.
// PAPER_CANVAS_MODULE peut désigner une installation existante de @napi-rs/canvas.
const fs = require('fs'), path = require('path');
const { createCanvas, loadImage } = require(process.env.PAPER_CANVAS_MODULE || '@napi-rs/canvas');
const root = path.resolve(__dirname, '..');
const [planFile, source] = process.argv.slice(2);
if (!planFile || !source) throw new Error('Usage : node tools/import-paper-atlas.cjs PLAN.json ATLAS.png');
const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));
global.window = {};
require('../data/pedi.js'); require('../data/podo.js');
const f = [...window.PEDI, ...window.PODO.filter(f => f.ready)].find(f => f.id === plan.id);
if (!f || plan.parts.length !== f.parts.length) throw new Error('Plan incompatible : ' + plan.id);
const entries = plan.parts.flat();
const rows = plan.rows || Math.ceil(entries.length / 4), cols = plan.columns || 4;
if (rows * cols < entries.length) throw new Error('Grille trop petite');
for (const [k, pair] of plan.parts.entries()) {
  if (pair.length < 2) throw new Error('Plusieurs dessins nécessaires par partie');
  for (const n of pair) if (!n.caption?.trim() || !Number.isInteger(n.after) || n.after < 0 || n.after >= f.parts[k].blocks.length) throw new Error('Ancrage invalide');
}
const target = path.join(root, 'papercraft/notions', plan.id + '.json');
if (fs.existsSync(target)) throw new Error('Fiche déjà intégrée : ' + plan.id);
(async () => {
  const im = await loadImage(source);
  const folder = path.join(root, 'jeu/theatre/notions', plan.id);
  fs.mkdirSync(folder, { recursive: true });
  const parts = plan.parts.map(() => []);
  let i = 0;
  for (const [k, pair] of plan.parts.entries()) for (const [j, notion] of pair.entries()) {
    const col = i % cols, row = Math.floor(i / cols);
    const x0 = Math.round(col * im.width / cols), x1 = Math.round((col + 1) * im.width / cols);
    const y0 = Math.round(row * im.height / rows), y1 = Math.round((row + 1) * im.height / rows);
    const c = createCanvas(450, 450), ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    const scale = Math.min(450 / (x1 - x0), 450 / (y1 - y0)), w = (x1 - x0) * scale, h = (y1 - y0) * scale;
    ctx.drawImage(im, x0, y0, x1 - x0, y1 - y0, (450 - w) / 2, (450 - h) / 2, w, h);
    const filename = 'p' + (k + 1) + '-' + (j + 1) + '.webp';
    fs.writeFileSync(path.join(folder, filename), c.toBuffer('image/webp', 90));
    parts[k].push({ src: 'jeu/theatre/notions/' + plan.id + '/' + filename, caption: notion.caption, after: notion.after });
    i++;
  }
  fs.writeFileSync(target, JSON.stringify({ id: plan.id, parts }, null, 2) + '\n');
  fs.writeFileSync(path.join(root, 'papercraft', plan.id + '-notions-prompts.txt'), 'Outil : ImageGen intégré.\nAtlas source : ' + source + '\n\n' + plan.prompt + '\n');
  console.log(plan.id + ' : ' + entries.length + ' dessins intégrés');
})().catch(e => { console.error(e); process.exitCode = 1; });
