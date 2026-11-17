// Vérifie les fichiers, les correspondances aux parties et la conservation du cours.
const fs = require('fs'), vm = require('vm'), assert = require('node:assert/strict');
global.window = {};
require('../data/pedi.js'); require('../data/podo.js'); require('../data/paper-notions.js');
const courses = [...window.PEDI, ...window.PODO.filter(f => f.ready)];
const app = fs.readFileSync(require.resolve('../app.js'), 'utf8');
const context = vm.createContext({
  md: String, esc: String,
  paperNotions: (f, k) => window.PAPER_NOTIONS[f.id]?.[k - 1] || [],
});
vm.runInContext(app.slice(app.indexOf('  function blocks('), app.indexOf('  // ---------- morceaux de page')), context);
vm.runInContext(app.slice(app.indexOf('  function paperLessonBlocks('), app.indexOf('  // une partie = un écran', app.indexOf('  function paperLessonBlocks('))), context);
function textOf(b) {
  if (b.t === 'li') return [b.term, b.d].filter(Boolean);
  if (b.t === 'card') return [b.title, ...b.items.flatMap(textOf)].filter(Boolean);
  if (b.t === 'chips') return b.items;
  return b.text ? [b.text] : [];
}
let parts = 0, illustrations = 0;
for (const [id, entries] of Object.entries(window.PAPER_NOTIONS)) {
  const f = courses.find(f => f.id === id);
  assert(f, 'Fiche inconnue : ' + id);
  assert.equal(entries.length, f.parts.length, id + ' : nombre de parties');
  entries.forEach((notions, index) => {
    const p = f.parts[index];
    assert(notions.length >= 2, id + ' : plusieurs images par partie');
    for (const n of notions) {
      assert(fs.existsSync(n.src), n.src);
      assert(Number.isInteger(n.after) && n.after >= 0 && n.after < p.blocks.length, id + ' : ancrage dans le cours');
      assert(n.caption.trim(), id + ' : légende');
      illustrations++;
    }
    const html = context.paperLessonBlocks(f, p, index + 1);
    for (const text of p.blocks.flatMap(textOf)) assert(html.includes(text), id + ' : texte perdu : ' + text);
    assert.equal((html.match(/class="paper-concept"/g) || []).length, notions.length, id + ' : nombre de scènes');
    parts++;
  });
}
console.log(Object.keys(window.PAPER_NOTIONS).length + ' fiches, ' + parts + ' parties, ' + illustrations + ' illustrations : fichiers et textes vérifiés');
