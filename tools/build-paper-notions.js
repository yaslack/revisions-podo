// Assemble les illustrations personnalisées sans modifier les données de cours.
// Usage : node tools/build-paper-notions.js [--watch]
const fs = require('fs'), path = require('path');
const folder = path.resolve(__dirname, '../papercraft/notions');
global.window = {};
require('../data/pedi.js'); require('../data/podo.js');
const expected = [...window.PEDI, ...window.PODO.filter(f => f.ready)];
fs.mkdirSync(folder, { recursive: true });
function build() {
  const courses = {};
  for (const file of fs.readdirSync(folder).filter(f => f.endsWith('.json')).sort()) {
    const course = JSON.parse(fs.readFileSync(path.join(folder, file), 'utf8'));
    if (!course.id || !Array.isArray(course.parts)) throw new Error('Manifeste invalide : ' + file);
    for (const notions of course.parts) for (const item of notions) {
      if (!item.caption || !Number.isInteger(item.after) || !item.src.startsWith('jeu/theatre/notions/')) throw new Error('Notion invalide : ' + file);
      if (!fs.existsSync(path.resolve(__dirname, '..', item.src))) throw new Error('Illustration manquante : ' + item.src);
    }
    courses[course.id] = course.parts;
  }
  const output = '// Illustrations par notion, généré par tools/build-paper-notions.js.\nwindow.PAPER_NOTIONS = ' + JSON.stringify(courses) + ';\n';
  const target = path.resolve(__dirname, '../data/paper-notions.js');
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) fs.writeFileSync(target, output);
  const previewIndex = path.resolve(__dirname, '../papercraft/notions-index.json');
  const json = JSON.stringify(courses);
  if (!fs.existsSync(previewIndex) || fs.readFileSync(previewIndex, 'utf8') !== json) fs.writeFileSync(previewIndex, json);
  const completed = expected.filter(f => courses[f.id]);
  const remaining = expected.filter(f => !courses[f.id]);
  fs.writeFileSync(path.resolve(__dirname, '../papercraft/ETAT-REPRISE.md'), [
    '# Reprise des illustrations de fiches', '',
    'Objectif demandé : plusieurs illustrations personnalisées par partie, selon les notions du cours, dans le style de la référence en papier découpé. Les scènes génériques ne suffisent pas.', '',
    `Avancement sauvegardé : ${completed.length}/${expected.length} fiches, ${completed.reduce((n, f) => n + courses[f.id].flat().length, 0)} illustrations intégrées.`, '',
    'Fiches prêtes : ' + completed.map(f => f.id).join(', '), '',
    'Fiches restantes : ' + remaining.map(f => f.id).join(', '), '',
    'Les correspondances sont dans papercraft/notions/*.json ; les images dans jeu/theatre/notions/<fiche>/ ; les prompts dans papercraft/*-notions-prompts.txt.', '',
    'Après chaque planche : tools/publish-paper.sh <fiche> <atlas.png> découpe les dessins, vérifie les textes, incrémente la version et publie sur GitHub Pages. ImageGen intégré reste utilisé pour les générations.', '',
    'Aperçu : http://127.0.0.1:51862/ . Le script tools/preview-live.js actualise les textures et les nouveaux dessins uniquement en local, sans relancer les quiz.', '',
    'Correction déjà faite : le bandeau corail de « Ce que je dis à l’oral » utilisait une découpe de 90 px sur une image haute de 167 px, ce qui laissait une ligne vide. Il utilise désormais des découpes verticales de 45 px.', ''
  ].join('\n'));
  console.log(Object.keys(courses).length + ' fiches illustrées par notion');
}
build();
if (process.argv.includes('--watch')) {
  let timer;
  fs.watch(folder, () => { clearTimeout(timer); timer = setTimeout(() => { try { build(); } catch (e) { console.error(e.message); } }, 250); });
}
