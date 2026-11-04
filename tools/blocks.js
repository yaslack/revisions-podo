// Textes des vidéos → blocs d'une partie (listes, cartes, puces, titres). Partagé par build-pedi.js et build-podo.js.
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
module.exports = { blocks, stripPart, clean };
