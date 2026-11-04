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

const clean = s => s.replace(/\s+/g, ' ').replace(/\s*:\s*$/, '').trim();
function blocks(screen) {
  const out = [], seen = new Set();
  const keyOf = b => JSON.stringify(b);
  const add = (list, b) => { const k = keyOf(b); if (seen.has(k)) return; seen.add(k); list.push(b); };
  for (let i = 0; i < screen.length; i++) {
    const e = screen[i];
    if (e.kind === 'tagstart') {
      const inner = []; let depth = 1, j = i + 1;
      for (; j < screen.length && depth; j++) { if (screen[j].kind === 'tagstart') depth++; else if (screen[j].kind === 'tagend') depth--; if (depth) inner.push(screen[j]); }
      i = j - 1;
      const items = inner.filter(x => x.kind !== 'tagstart' && x.kind !== 'tagend').map(x => x.kind === 'note' ? { t: 'li', term: clean(x.text), d: clean(x.detail || '') } : x.kind === 'chips' ? { t: 'chips', items: x.text.split(' · ').map(clean) } : { t: 'txt', text: clean(x.text) });
      if (!items.length) continue;
      const head = items[0].t === 'txt' ? items.shift().text : '';
      const card = { t: 'card', title: head, items };
      if (seen.has('card:' + head + JSON.stringify(items))) continue;
      seen.add('card:' + head + JSON.stringify(items));
      out.push(card);
      continue;
    }
    if (e.kind === 'tagend') continue;
    if (e.kind === 'note') add(out, { t: 'li', term: clean(e.text), d: clean(e.detail || '') });
    else if (e.kind === 'chips') add(out, { t: 'chips', items: e.text.split(' · ').map(clean) });
    else if (e.kind === 'heading') add(out, { t: 'h', text: clean(e.text) });
    else if (e.kind === 'badge') add(out, { t: 'badge', text: clean(e.text) });
    else if (e.kind === 'txt' && clean(e.text).length > 2) add(out, { t: 'txt', text: clean(e.text) });
  }
  return out;
}
const stripPart = s => (s || '').replace(/^Partie [^:]+: [^?]+\?\s*/, '').trim();

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
