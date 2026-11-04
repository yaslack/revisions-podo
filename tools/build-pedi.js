// Builds data/pedi.js (window.PEDI, window.PLAN_ORAL) from the video extraction + the old site's booklet text and photos.
// usage: node tools/build-pedi.js RAW.json OLD_INDEX.html
const fs = require('fs'), path = require('path');
const [raw, oldIndex] = process.argv.slice(2);
const eps = JSON.parse(fs.readFileSync(raw, 'utf8'));
const old = fs.readFileSync(oldIndex, 'utf8');
const grab = (re) => { const m = old.match(re); if (!m) throw new Error('introuvable: ' + re); return m[1]; };
const LIVRET = JSON.parse(grab(/const LIVRET=(\{.*\});/));
const IMG = JSON.parse(grab(/const IMG = (\{.*\});?\n/));
const ILLU = JSON.parse(grab(/const ILLU=(\{.*\});/));
const EXTRA = Function('return ' + grab(/const EXTRA = (\{[\s\S]*?\n\});/))();
const TOPICS = Function('return ' + grab(/const TOPICS = (\[[\s\S]*?\n\]);/))();
const OLD_ID = { '18-sudoraux': 'sudoraux', '21-onychodystrophies': 'onychodys' };
const CAT = { vasc: 'Vasculaire', peau: 'Peau', ongle: 'Ongle', med: 'Médicaments' };

const { blocks, stripPart } = require('./blocks');

fs.mkdirSync('photos/livret', { recursive: true });
const PEDI = [];
let planOral = null;
for (const e of eps) {
  if (e.id === '00-plan') { planOral = e.parts.map((p, i) => ({ title: e.plan[i].title, q: e.plan[i].q, say: p.say })); continue; }
  const n = +e.id.slice(0, 2), oid = OLD_ID[e.id] || e.id.slice(3);
  const topic = TOPICS.find(t => t.id === oid);
  if (!topic) throw new Error('sujet ancien introuvable pour ' + e.id);
  const photos = [];
  for (const [k, cap] of ((EXTRA[oid] || {}).img || [])) {
    if (!IMG[k]) continue;
    const m = IMG[k].src.match(/^data:image\/(\w+);base64,(.*)$/);
    const ext = m[1] === 'jpeg' ? 'jpg' : m[1], file = `photos/livret/${k}.${ext}`;
    fs.writeFileSync(file, Buffer.from(m[2], 'base64'));
    photos.push({ src: file, cap, cr: 'Livret IFPP' });
  }
  for (const [k, cap, cr, ln] of (ILLU[oid] || [])) photos.push({ src: `photos/${k}.webp`, cap, cr, ln });
  PEDI.push({
    n, id: oid, title: e.title, cat: topic.cat, catName: CAT[topic.cat], planTitle: e.planTitle,
    intro: e.intro, outro: e.outro,
    parts: e.parts.map(p => ({ title: e.plan[p.k].title, q: e.plan[p.k].q, say: stripPart(p.say), blocks: blocks(p.screen) })),
    memo: e.memo, quiz: e.quiz.map(q => ({ q: q.q, a: q.a })), photos, livret: LIVRET[oid] || '', video: '',
  });
}
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/pedi.js', '// Généré par tools/build-pedi.js depuis les vidéos (fiches 1 à 24) et le livret. Ne pas éditer à la main.\nwindow.PEDI=' + JSON.stringify(PEDI) + ';\nwindow.PLAN_ORAL=' + JSON.stringify(planOral) + ';\n');
console.log(PEDI.length, 'fiches,', PEDI.reduce((a, f) => a + f.photos.length, 0), 'photos,', Math.round(fs.statSync('data/pedi.js').size / 1024), 'Ko');
