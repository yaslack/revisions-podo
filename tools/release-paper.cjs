// Prépare une nouvelle version du thème Papier avant publication GitHub Pages.
const fs = require('fs'), cp = require('child_process'), path = require('path');
const root = path.resolve(__dirname, '..'); process.chdir(root);
cp.execFileSync(process.execPath, ['tools/build-paper-notions.js'], { stdio: 'inherit' });
cp.execFileSync(process.execPath, ['tools/check-paper-notions.js'], { stdio: 'inherit' });
global.window = {}; require('../data/paper-notions.js');
const count = Object.keys(window.PAPER_NOTIONS).length;
let app = fs.readFileSync('app.js', 'utf8');
const previous = Math.max(Number(JSON.parse(fs.readFileSync('version.json')).v), ...[...app.matchAll(/\{ v: (\d+),/g)].map(m => Number(m[1])));
const version = process.argv.includes('--initial') ? previous : previous + 1;
fs.writeFileSync('version.json', JSON.stringify({ v: String(version) }) + '\n');
fs.writeFileSync('index.html', fs.readFileSync('index.html', 'utf8').replace(/\?v=\d+(?:\.\d+)?/g, '?v=' + version));
const note = `    { v: ${version}, paperNotions: true, items: [
      ['sparkle', 'Le thème Papier découpé devient un théâtre de papier : feuillages, matières illustrées et scènes en relief dans les cours.'],
      ['book', '${count}/64 fiches proposent maintenant plusieurs dessins personnalisés par partie. Les textes de révision et les schémas détaillés restent accessibles.'],
    ] },`;
// Actualiser notre annonce sans supprimer celles des autres fonctionnalités.
app = app.replace(/    \{ v: \d+,(?: paperNotions: true,)? items: \[\n[\s\S]*?\n    \] \},\n/g, entry => entry.includes('fiches proposent maintenant plusieurs dessins personnalisés') ? '' : entry);
const marker = '  ];\n  const NOTE_V';
if (!app.includes(marker)) throw new Error('Fin des notes de version introuvable');
app = app.replace(marker, note + '\n' + marker);
fs.writeFileSync('app.js', app);
cp.execFileSync(process.execPath, ['--check', 'app.js'], { stdio: 'inherit' });
cp.execFileSync(process.execPath, ['tools/build-sw.js', String(version)], { stdio: 'inherit' });
cp.execFileSync('git', ['diff', '--check'], { stdio: 'inherit' });
console.log('Version ' + version + ' prête : ' + count + '/64 fiches.');
