// Vérifie les défis de Podo Quest : fabrique 10 fois chaque carte de chaque monstre (fiches, anatomie, tests) et arrête à la première carte cassée.
// usage : node tools/check-aventure.js        (ajouter un identifiant pour voir les défis d'un monstre : node tools/check-aventure.js f:verrues)
const path = require('path'), assert = require('assert');
global.window = global;
for (const f of ['pedi', 'podo', 'anat', 'clinique', 'quiz', 'cas']) require(path.resolve('data', f + '.js'));
require(path.resolve('aventure.js'));

const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
const mkStep = (p, s) => { const [q, a] = s.split(' | '), [ok, bad] = a.split(' || '); return { kind: 'qcm', q, ok, opts: shuffle([ok, ...bad.split(' ; ')]) }; };
const all = [
  ...PEDI.concat((window.PODO || []).filter(f => f.ready)).map(f => ({ kind: 'f', f, id: 'f:' + f.id, title: f.title, lab: 'fiche', link: '#' })),
  ...ANAT_Q.map(x => ({ kind: 'a', x, id: 'a:' + x.q, title: x.name, lab: 'anatomie', link: '#' })),
  ...CLIN.map((c, i) => ({ kind: 'c', cl: c, id: 'c:' + (i + 1), title: c.n, lab: 'test', link: '#' }))];
// le jeu tourne ici sans navigateur : les outils d'app.js sont remplacés par des versions minimales
let G = null; const S = {}, rnd = a => a[Math.floor(Math.random() * a.length)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])), md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const AV = window.AVENTURE({ S, shuffle, rnd, mkStep, esc, md, QZ: window.QUIZ, CAS: window.CAS, all: () => all, pool: () => all, g: () => G, setG: x => { G = x; }, render() {}, save() {}, fx() {}, did() {}, review() {},
  ico: () => '', top: (a, b, c) => b + c, count: (a, b) => `${a}/${b}`, qsjClues: () => [['Indice', 'un'], ['Indice', 'deux']], qsjOpts: it => shuffle([it.title, 'x', 'y', 'z']) });

const show = process.argv[2], n = { qcm: 0, tri: 0, ordre: 0, trous: 0, oral: 0 }, few = [];
const text = st => st.kind === 'oral' ? st.items.join(' | ') : st.kind === 'trous' ? `${st.segs.map(s => typeof s === 'string' ? s : `[${st.ok[s]}]`).join('')}\n     banque : ${st.bank.join(' | ')}` : st.kind === 'pick' ? st.items.map(x => (x[1] ? '+ ' : '- ') + x[0]).join(' | ') : st.kind === 'ordre' ? st.items.join(' > ') : `${st.ok}  /  ${st.opts.filter(o => o !== st.ok).join(' | ')}`;
for (const it of all) {
  const k = AV.kit(it), cards = [...k.qs, ...k.says, ...(k.fin ? [k.fin] : [])];
  if (k.qs.length < 2) few.push(it.id);
  assert(k.qs.length, `${it.id} : aucune carte d'attaque`);
  assert(k.says.length, `${it.id} : aucune récitation`);
  for (const c of cards) for (let i = 0; i < 10; i++) {
    const st = c.mk(), at = `${it.id} · ${c.k} · ${c.lab}`;
    if (!st) continue;   // une carte peut rater un tirage (le jeu retente) ; elle doit en réussir au moins un, vérifié par `make` à la construction
    if (!i) n[c.k]++;
    if (show === it.id && !i) console.log(`\n[${c.k}] ${c.lab}\n  ${st.q}\n  -> ${text(st)}`);
    assert(st.q, at + ' : pas de question');
    if (st.kind === 'qcm') { assert(st.opts.includes(st.ok), at + ' : bonne réponse absente'); assert(new Set(st.opts).size === st.opts.length && st.opts.length >= 3, `${at} : choix en double ou trop peu (${st.opts.length})`); }
    else if (st.kind === 'pick') { const good = st.items.filter(x => x[1]).length; assert(good && st.items.length - good >= 2, at + ' : il faut du vrai et au moins 2 pièges'); }
    else if (st.kind === 'oral') assert(st.items.length && st.items.every(x => typeof x === 'string' && x), at + ' : oral sans idées');
    else if (st.kind === 'ordre') assert(st.items.length > 2 && st.sh.some((x, j) => x !== j), at + ' : rien à remettre en ordre');
    else { assert(st.ok.length && st.ok.every(w => st.bank.includes(w)), at + ' : mot caché absent de la banque'); assert(st.bank.length - st.ok.length >= 2, `${at} : pas assez de pièges dans la banque (${st.bank.join(' | ')})`); assert(st.segs.filter(s => typeof s === 'number').length === st.ok.length, at + ' : trous mal comptés'); }
  }
}
console.log(`\nOK : ${all.length} monstres, cartes : ${JSON.stringify(n)}`);
if (few.length) console.log(`Monstres avec une seule carte d'attaque : ${few.join(', ')}`);

// ---------- 40 expéditions jouées en entier avec 70 % de bonnes réponses, puis une perdue exprès (tout faux, en se soignant) : rien ne doit planter, chaque écran doit s'afficher, chaque partie doit finir ----------
const seen = { win: 0, ko: 0, end: 0, revanche: 0, spe: 0, fin: 0, vif: 0, cuir: 0, soin: 0, oral: 0, boss: 0 };
const screen = () => { const h = AV.view(); assert(typeof h === 'string' && !/undefined|NaN|\[object/.test(h), `écran « ${G.scr} » mal affiché : ${(h.match(/.{0,60}(undefined|NaN|\[object).{0,60}/) || [h])[0]}`); return h; };
const answer = good => {   // répond au défi en cours, juste ou faux
  const t = G.t, st = t.st, tap = (a, j) => { AV.act(a, j); screen(); };
  if (st.kind === 'qcm') return AV.act('avpick', good ? st.opts.indexOf(st.ok) : st.opts.findIndex(o => o !== st.ok));
  if (st.kind === 'oral') { if (Math.random() < .3) tap('avhint'); tap('avshow'); if (good) st.items.forEach((x, j) => { if (!(t.ticks || []).includes(j)) tap('avtk', j); }); }
  else if (st.kind === 'pick') st.items.forEach((x, j) => { if (good ? x[1] : !x[1]) tap('avtk', j); });
  else if (st.kind === 'ordre') st.items.forEach((x, i) => tap('avtk', good ? st.sh.indexOf(i) : st.sh.indexOf(st.items.length - 1 - i)));
  else st.ok.forEach((w, i) => tap('avbk', good ? st.bank.findIndex((b, j) => b === w && !(t.fill || []).includes(j)) : st.bank.findIndex((b, j) => b !== w && !(t.fill || []).includes(j))));
  AV.act('avval');
};
function play(skill, heal, low) {   // skill : part de bonnes réponses ; heal : chance de se soigner quand les PV passent sous `low`
  G = AV.start(all); let steps = 0;
  while (G.scr !== 'end' && G.scr !== 'ko') {
    assert(++steps < 3000, 'expédition sans fin');
    const html = screen(), t = G.t, f = G.foe;
    if (G.scr === 'map') AV.act('avgo');
    else if (G.scr === 'win') { seen.win++; AV.act('avcont'); }
    else if (G.scr === 'chest') t.done ? AV.act('avnext') : AV.act('avpick', Math.random() < skill ? t.st.opts.indexOf(t.st.ok) : 0);
    else if (t && t.done) AV.act('avnext');
    else if (t) { if (t.rv) seen.revanche++; if (t.mode === 'spe') seen.spe++; if (t.mode === 'fin') seen.fin++; if (t.mode === 'boss') seen.boss++; if (t.st.kind === 'oral') seen.oral++; if (f.style) seen[f.style]++; answer(Math.random() < skill); }
    else {   // le menu : on joue un des boutons proposés (pas les grisés)
      const on = [...html.matchAll(/<button class="avact" data-g="(\w+)" (?:data-j="(\d)")? ?style="[^"]*" >/g)].map(m => [m[1], +m[2] || 0]).filter(m => m[0] !== 'avobj');
      assert(on.length, 'menu de combat sans bouton jouable : ' + html.slice(-600));
      if (G.hp < low && /data-g="avobj" +style="[^"]*" >/.test(html) && Math.random() < heal) { AV.act('avobj'); screen(); AV.act('avuse', 0, { dataset: { k: Object.keys(S.rpg.items).find(k => S.rpg.items[k] > 0 && /hexo|dexeryl|hydro|rice/.test(k)) } }); seen.soin++; }
      else AV.act(...(on.find(m => m[0] === 'avfin') || rnd(on)));
    }
  }
  seen[G.scr]++; screen(); return G.scr;
}
for (let run = 0; run < 40; run++) play(.7, .5, 15);
S.rpg.items.hexo = 3;
assert(play(0, 1, 1e9) === 'ko', 'tout faux : la partie devait finir par une défaite');
for (const k in seen) assert(seen[k], `la simulation n'est jamais passée par : ${k}`);
console.log(`OK : 40 expéditions jouées ${JSON.stringify(seen)}, niveau atteint ${S.rpg.lvl}, revenants en attente ${Object.keys(S.rpg.miss || {}).length}`);

// ---------- la rotation : avec 12 fiches choisies, en perdant et en faisant des fautes, toutes doivent passer, et aucune ne doit tout envahir ----------
for (const k in S) delete S[k];
const twelve = all.filter(x => x.kind === 'f').slice(0, 12), met = {};
for (let e = 0; e < 6; e++) {
  G = AV.start(twelve); const ids = G.nodes.filter(x => x.it).map(x => x.it.id);
  ids.forEach(i => met[i] = (met[i] || 0) + 1);
  S.rpg.miss = S.rpg.miss || {}; for (const i of ids.slice(0, 2)) S.rpg.miss[i] = (S.rpg.miss[i] || 0) + 3;   // des fautes sur les 2 premiers, puis défaite : personne n'est « battu »
}
assert(Object.keys(met).length === 12, `rotation : seulement ${Object.keys(met).length}/12 fiches rencontrées en 6 expéditions`);
assert(Math.max(...Object.values(met)) <= 3, 'rotation : une fiche revient trop souvent ' + JSON.stringify(met));
console.log(`OK : rotation (12 fiches en 6 expéditions : ${Object.values(met).sort().join(' ')})`);

// ---------- l'oral progresse : le boss grandit avec ce que tu sais, une partie dite avec aide ne compte pas, un muscle s'achève avec origine ET terminaison ----------
for (const k in S) delete S[k];
const fi = all.find(x => x.id === 'f:verrues'), toBoss = it => { G = AV.start([it]); G.i = 4; AV.act('avgo'); AV.act('avpick', G.t.st.opts.indexOf(G.t.st.ok)); AV.act('avnext'); };
const sayPart = (help, good) => { if (help) AV.act(help); if (help === 'avread') AV.act('avhide'); AV.act('avshow'); if (good) G.t.st.items.forEach((x, j) => { if (!(G.t.ticks || []).includes(j)) AV.act('avtk', j); }); AV.act('avval'); screen(); };
toBoss(fi);
assert(G.foe.oral && G.foe.scope.join() === '0,1,2' && !G.foe.final, 'boss : la 1re fois, 3 parties (les 3 premières) ' + G.foe.scope);
AV.act('avboss'); sayPart('avhint', true);
assert(S.rpg.oral['f:verrues'][0] === .6, 'avec l\'indice, la partie ne doit pas passer sue ' + JSON.stringify(S.rpg.oral));
AV.act('avnext'); AV.act('avboss'); sayPart(null, true);
assert(S.rpg.oral['f:verrues'][1] === 1 && /Nouvelle partie sue/.test(G.msg), 'sans aide et complète, la partie devient sue');
S.rpg.oral['f:verrues'] = { 0: 1, 1: 1, 2: 1 }; toBoss(fi);
assert(G.foe.scope.join() === '0,1,2,3,4', 'boss : les 3 sues + 2 nouvelles ' + G.foe.scope);
S.rpg.oral['f:verrues'] = Object.fromEntries(fi.f.parts.map((_, i) => [i, 1])); toBoss(fi);
assert(G.foe.final && G.foe.scope.length === AV.kit(fi).plan.length && !/avhint|avread/.test(AV.view().replace(/data-g="avboss"/, '')), 'boss : tout est su, l\'oral complet');
AV.act('avboss'); assert(!/data-g="avhint"/.test(AV.view()), 'oral complet : pas d\'indice');
const mu = all.find(x => x.kind === 'a' && x.x.nerf && x.x.o && x.x.t), km = AV.kit(mu);
assert(km.fin && km.fin.k === 'oral' && km.fin.les.length === 2 && !km.qs.some(c => /Origine|Terminaison/.test(c.lab) && c.k === 'qcm'), 'muscle : origine et terminaison se disent, plus de QCM dessus');
G = AV.start([mu]); AV.act('avgo'); AV.act('avpick', G.t.st.opts.indexOf(G.t.st.ok)); AV.act('avnext');
assert(G.foe.style === 'cuir', 'un muscle est cuirassé');
G.foe.hp = Math.round(G.foe.max * .3); AV.act('avfin'); AV.act('avshow'); AV.act('avtk', 0); AV.act('avval');
assert(G.foe.hp > 0, 'muscle : avec seulement l\'origine, il ne tombe pas');
console.log('OK : l\'oral progresse (boss 3 → 5 → complet), l\'aide ne compte pas, un muscle demande origine et terminaison');
