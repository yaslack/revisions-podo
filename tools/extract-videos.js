// Builds data/pedi.json from the video episodes (video-plan/episodes/NN-*/script.js + scenes.js).
// The scenes are run with every drawing function replaced by a recorder, so the texts shown on screen come out in order,
// part by part: notes (term + detail), chips, headings, card titles, badges and captions. The narration of each clip
// comes from script.js. usage: node tools/extract-videos.js VIDEO_PLAN_DIR [MOTIF] > data/pedi.json
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = process.argv[2];
const art = fs.readFileSync(path.join(root, 'js/art.js'), 'utf8');
const PARTS = vm.runInNewContext(art.slice(art.indexOf('const PARTS'), art.indexOf('];', art.indexOf('const PARTS')) + 2) + ';PARTS');
const noop = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => 0 : noop), apply: () => noop });   // callable, any property, any depth
const SH = new Proxy({}, { get: () => () => [] });

function episode(dir) {
  const ev = [];
  const rec = (kind, text, extra) => { if (text && String(text).trim()) ev.push({ kind, text: String(text).trim(), ...extra }); };
  const S = { at: () => 0, p: () => 0.5, pop: () => 0.5, w: () => 0.5, d: () => 0.5, sfx: noop, lead: 0, clipEnd: 0 };
  const g = {
    window: {}, W: 1920, H: 1080, TAU: Math.PI * 2, MUTED: '#6b5a3a', FT: 'x', FH: 'x', BOIL: 0, X: new Proxy({}, { get: () => noop, set: () => true }),
    C: { ink: '#25232d', paper: '#f4ecd9', red: '#c8372d', hl: '#ffd84d', card: '#fffaf0', skin: '#f2c3a0', parts: ['#3b78d0', '#d6453d', '#8a55c9', '#e0922a', '#23998a', '#3f9e5c', '#d9628f', '#1f6b87'] },
    E: { back: x => x, out: x => x, inout: x => x, in: x => x }, SH, PARTS, Math,
    clamp: (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp: (a, b, t) => a + (b - a) * t, prog: () => 0.5, hash: () => 0.5, shade: c => c,
    notes: (S_, items) => items.forEach(it => { rec('note', it.term, { detail: it.detail || '' }); }),
    chips: (S_, items) => rec('chips', items.map(i => i.w).join(' · ')),
    heading: (S_, text) => rec('heading', text),
    txt: (s) => rec('txt', s),
    badge: (cx, cy, label) => rec('badge', label),
    tag: (x, y, w, h, color, p, fn) => { if (p > 0) { ev.push({ kind: 'tagstart' }); fn(); ev.push({ kind: 'tagend' }); } },
    group: fn => { if (typeof fn === 'function') fn(); },
    partScene: (k, clip, body, ho) => ({ type: 'part', k, clip, body, qAt: ho && ho.qAt }),
    coverScene: (clip, n, title) => ({ type: 'cover', clip, title }),
    memoScene: (clip, rows) => ({ type: 'memo', clip, rows: rows.map(r => ({ q: r.q, k: r.k })) }),
    quizPair: (n, total, qId, aId, qAt, question, answer) => [{ type: 'quiz', n, qId, aId, question, answer }],
    outroScene: (clip) => ({ type: 'outro', clip }),
  };
  const ctx = vm.createContext(g);
  const run = code => { for (let i = 0; i < 200; i++) { try { return vm.runInContext(code, ctx); } catch (e) { const m = /^(\w+) is not defined/.exec(e.message); if (!m) throw e; ctx[m[1]] = noop; } } };
  run(fs.readFileSync(path.join(dir, 'script.js'), 'utf8'));
  run(fs.readFileSync(path.join(dir, 'scenes.js'), 'utf8'));
  const script = Object.fromEntries(ctx.window.SCRIPT.map(c => [c.id, c.text]));
  const plan = (ctx.window.PLAN || PARTS).map(p => ({ title: p.title, q: p.q }));
  const out = { id: path.basename(dir), plan, planTitle: ctx.window.PLAN_TITLE || null, intro: script['01'], parts: [], memo: [], quiz: [], outro: script['11'] };
  for (const sc of ctx.window.SCENES) {
    if (sc.type === 'cover') out.title = sc.title;
    if (sc.type === 'memo') out.memo = sc.rows;
    if (sc.type === 'quiz') out.quiz.push({ q: sc.question, a: sc.answer, qSay: script[sc.qId], aSay: script[sc.aId] });
    if (sc.type !== 'part') continue;
    ev.length = 0;
    for (let i = 0; i < 2000 && true; i++) { try { sc.body(0, S); break; } catch (e) { const m = /^(\w+) is not defined/.exec(e.message); if (!m) throw new Error(dir + ': ' + e.message); ctx[m[1]] = noop; } }
    out.parts.push({ k: sc.k, say: script[sc.clip], screen: ev.slice() });
  }
  return out;
}

const only = new RegExp(process.argv[3] || '^\\d\\d-');   // 2e argument : quels épisodes (ex. '^p0[12]-' pour la podologie)
const eps = fs.readdirSync(path.join(root, 'episodes')).filter(d => only.test(d)).sort();
const all = eps.map(d => episode(path.join(root, 'episodes', d)));
process.stdout.write(JSON.stringify(all, null, 1));
