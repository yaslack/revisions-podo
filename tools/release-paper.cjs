// Prépare une nouvelle version du thème Papier avant publication GitHub Pages.
const fs = require('fs'), cp = require('child_process'), path = require('path');
const root = path.resolve(__dirname, '..'); process.chdir(root);
cp.execFileSync(process.execPath, ['tools/build-paper-notions.js'], { stdio: 'inherit' });
cp.execFileSync(process.execPath, ['tools/check-paper-notions.js'], { stdio: 'inherit' });
global.window = {}; require('../data/paper-notions.js');
const count = Object.keys(window.PAPER_NOTIONS).length;
const previous = Number(JSON.parse(fs.readFileSync('version.json')).v);
const version = process.argv.includes('--initial') ? previous : previous + 1;
fs.writeFileSync('version.json', JSON.stringify({ v: String(version) }) + '\n');
fs.writeFileSync('index.html', fs.readFileSync('index.html', 'utf8').replace(/\?v=\d+(?:\.\d+)?/g, '?v=' + version));
let app = fs.readFileSync('app.js', 'utf8');
const start = app.lastIndexOf('    { v: '), end = app.indexOf('\n    ] },', start);
if (start < 0 || end < 0) throw new Error('Dernière note de version introuvable');
const note = `    { v: ${version}, items: [
      ['sparkle', 'Le thème Papier découpé devient un théâtre de papier : feuillages, matières illustrées et scènes en relief dans les cours.'],
      ['book', '${count}/64 fiches proposent maintenant plusieurs dessins personnalisés par partie. Les textes de révision et les schémas détaillés restent accessibles.'],
    ] },`;
app = app.slice(0, start) + note + app.slice(end + '\n    ] },'.length);
fs.writeFileSync('app.js', app);
cp.execFileSync(process.execPath, ['--check', 'app.js'], { stdio: 'inherit' });
cp.execFileSync(process.execPath, ['tools/build-sw.js', String(version)], { stdio: 'inherit' });
cp.execFileSync('git', ['diff', '--check'], { stdio: 'inherit' });
console.log('Version ' + version + ' prête : ' + count + '/64 fiches.');
