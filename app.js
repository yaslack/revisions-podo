// Révisions podo : 24 fiches de pédicurie (structure des vidéos) + 59 questions d'anatomie palpatoire.
// Données : data/pedi.js (window.PEDI, PLAN_ORAL), data/anat.js (ANAT_Q, ANAT_PL, ANAT_REG), data/videos.js (VIDEOS).
(() => {
  const PEDI = window.PEDI, AQ = window.ANAT_Q, PL = window.ANAT_PL, VIDEOS = window.VIDEOS || {};
  const PCOL = i => `var(--p${(i % 8) + 1})`;
  const RCOL = { pied: 'var(--p5)', jambe: 'var(--p4)', cuisse: 'var(--p1)' };
  const REG_ORDER = ['pied', 'jambe', 'cuisse'];
  const REG_SHORT = { pied: 'Pied', jambe: 'Jambe', cuisse: 'Cuisse' };
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  // progression, gardée sur le téléphone ; l'appli marche sans (navigation privée)
  const KEY = 'podo:v3';
  let S = { pedi: {}, anat: {} };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  // Reprendre la progression de l'ancienne version du site (clé « podo:v2 », avec sa copie de secours dans IndexedDB) :
  // une seule fois, en ajoutant sans rien effacer, et sans toucher à l'ancienne sauvegarde.
  function fromOld(o) {
    if (!o || typeof o !== 'object' || !o.cards) return false;
    const b = id => ((o.cards[id] || {}).b || 0), KEYS = ['i', 'e', 'p', 's', 'd', 't', 'r', 'v'];
    const pp = Object.keys(o.pp || {}), learn = o.learn || {}, pt = o.pt || {};
    for (const f of PEDI) {
      const L = learn[f.id] || {}, cur = S.pedi[f.id] = S.pedi[f.id] || {}, seen = new Set(cur.seen || []);
      let all = f.parts.length === 8;
      if (f.parts.length === 8) KEYS.forEach((k, i) => {
        const lv = L[k] || 0, ptb = (pt[f.id + '|' + k] || {}).b || 0;
        if (lv > 0 || ptb > 0 || b(f.id + '-' + k) > 0 || pp.some(x => x.startsWith(f.id + '|' + k + '|'))) seen.add(i + 1);
        if (lv < 3 || ptb < 3) all = false;
      });
      if (seen.size) cur.seen = [...seen];
      if (all) cur.done = true;
      if (!Object.keys(cur).length) delete S.pedi[f.id];
    }
    // un repère est « su » si la moitié au moins de ses anciennes cartes l'étaient (niveau 2 ou plus)
    for (const x of AQ) if (x.old && x.old.filter(id => b(id) >= 2).length >= Math.ceil(x.old.length / 2)) S.anat[x.q] = true;
    return true;
  }
  if (!S.mig) {
    let o = null; try { o = JSON.parse(localStorage.getItem('podo:v2')); } catch (e) {}
    if (fromOld(o)) { S.mig = 1; save(); }
    else try {   // localStorage effacé : la copie IndexedDB de l'ancienne version
      const r = indexedDB.open('podo', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => { try { const g = r.result.transaction('kv', 'readonly').objectStore('kv').get('podo:v2');
        g.onsuccess = () => { let v = null; try { v = JSON.parse(g.result); } catch (e) {} if (fromOld(v)) { S.mig = 1; save(); render(); } r.result.close(); }; } catch (e) {} };
    } catch (e) {}
  }
  const doneP = id => !!(S.pedi[id] && S.pedi[id].done);
  const doneA = q => !!S.anat[q];
  const seenP = (f, k) => doneP(f.id) || !!(S.pedi[f.id] && (S.pedi[f.id].seen || []).includes(k));
  const nSeen = f => f.parts.filter((_, i) => seenP(f, i + 1)).length;
  const pctP = f => nSeen(f) / f.parts.length;

  // ---------- jauges ----------
  const pc = v => Math.round(v * 100);
  const bar = (v, c) => `<span class="bar" style="--c:${c}"><i style="width:${pc(v)}%"></i></span>`;
  const ring = (v, c) => `<span class="ring" style="--c:${c};--v:${pc(v)}%"><b>${pc(v)}%</b></span>`;
  const segs = f => `<span class="segs">${f.parts.map((_, i) => `<i class="${seenP(f, i + 1) ? 'on' : ''}" style="--c:${PCOL(i)}"></i>`).join('')}</span>`;

  // ---------- blocs d'une partie (repris de l'écran des vidéos) ----------
  function blocks(list) {
    let h = '', i = 0;
    while (i < list.length) {
      const b = list[i];
      if (b.t === 'li') { h += '<ul class="notes">'; while (i < list.length && list[i].t === 'li') { const x = list[i++]; h += `<li>${md(x.term)}${x.d ? `<span class="d">${md(x.d)}</span>` : ''}</li>`; } h += '</ul>'; continue; }
      if (b.t === 'card') { h += '<div class="grid">'; while (i < list.length && list[i].t === 'card') { const c = list[i++]; h += `<div class="tag">${c.title ? `<div class="tt">${md(c.title)}</div>` : ''}${blocks(c.items)}</div>`; } h += '</div>'; continue; }
      // libellés des schémas : en MAJUSCULES = titre, sinon une suite de lignes = liste
      const upper = x => x.t === 'txt' && /\p{L}/u.test(x.text) && x.text === x.text.toUpperCase() && x.text.length <= 45;
      if (b.t === 'txt' && !upper(b)) { h += '<ul class="notes">'; while (i < list.length && list[i].t === 'txt' && !upper(list[i])) h += `<li>${md(list[i++].text)}</li>`; h += '</ul>'; continue; }
      if (b.t === 'h' || upper(b)) h += `<div class="h">${md(b.text)}</div>`;
      else if (b.t === 'chips') h += `<div class="chips">${b.items.map(c => `<span class="chip">${md(c)}</span>`).join('')}</div>`;
      else if (b.t === 'badge') h += `<div><span class="badge" style="--c:var(--red)">${md(b.text)}</span></div>`;
      i++;
    }
    return h;
  }

  // ---------- morceaux de page ----------
  // barre du haut, collée en haut de l'écran : retour, titre, et à droite la progression
  const top = (back, title, right = '') => `<header class="top"><a class="back" href="${back}" aria-label="Retour">←</a><div class="tt">${title}</div>${right}</header>`;
  const count = (a, b) => `<span class="count">${a}/${b}</span>`;
  // barre du bas pendant la lecture : précédent / suivant (on peut aussi glisser le doigt)
  const pager = (prev, mid, next) => `<div class="pager fixed">${prev ? `<a class="btn ghost arrow prev" href="${prev}" aria-label="Précédent">←</a>` : '<span class="arrow"></span>'}${mid}${next ? `<a class="btn ghost arrow next" href="${next}" aria-label="Suivant">→</a>` : '<span class="arrow"></span>'}</div>`;

  // dessins des vidéos : illus/<fiche>/cover.webp, pNa.webp (milieu de la partie), pNb.webp (fin)
  const ill = (id, name) => `illus/${id}/${name}.webp`;
  // une image qui ne charge pas (réseau du téléphone) : on réessaie une fois, puis on retire son cadre
  const RETRY = `onerror="if(!this.dataset.r){this.dataset.r=1;this.src=this.src.split('?')[0]+'?r=1'}else(this.closest('.drawn')||this).remove()"`;
  const img = (src, alt, cls = '') => `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" ${RETRY}>`;
  // vidéo Drive : le lecteur est dessiné en taille ordinateur puis réduit (sinon Drive recadre et zoome sur téléphone),
  // avec la couverture dessinée de la fiche par-dessus en guise d'aperçu ; on la touche pour lancer le lecteur
  const frame = (id, t, poster) => `<div class="video"><iframe src="https://drive.google.com/file/d/${id}/preview" allow="autoplay; fullscreen" allowfullscreen title="${t}"></iframe>
    <button class="poster" style="background-image:url(${poster})" aria-label="Lancer la vidéo"><span>▶</span></button></div>
    <a class="vlink" href="https://drive.google.com/file/d/${id}/view" target="_blank" rel="noopener">La vidéo ne se lance pas ? L'ouvrir dans Google Drive ↗</a>`;
  const fitVideos = () => document.querySelectorAll('.video iframe').forEach(f => {
    const w = f.parentNode.clientWidth, W = Math.max(640, w);
    f.style.width = W + 'px'; f.style.height = W * 9 / 16 + 'px'; f.style.transform = w < W ? `scale(${w / W})` : '';
  });
  window.addEventListener('resize', fitVideos);
  const thumb = (src, alt) => `<span class="drawn th">${img(src, alt)}</span>`;

  // ---------- accueil : où j'en suis, et quoi faire maintenant ----------
  function home() {
    const nP = PEDI.filter(f => doneP(f.id)).length, vP = PEDI.reduce((s, f) => s + pctP(f), 0) / PEDI.length;
    const nA = AQ.filter(x => doneA(x.q)).length;
    const last = S.last && PEDI.find(f => f.id === S.last.id);
    const nextF = PEDI.find(f => !doneP(f.id) && f !== last);
    const regs = REG_ORDER.map(r => { const it = AQ.filter(x => x.reg === r), k = it.filter(x => doneA(x.q)).length; return `<span class="mini"><span>${REG_SHORT[r]} ${k}/${it.length}</span>${bar(k / it.length, RCOL[r])}</span>`; }).join('');
    return `<div class="wrap">
      <div class="kicker">ORAL UEM · PÉDICURIE-PODOLOGIE</div><h1>Mes révisions</h1>
      ${last ? `<a class="card resume" href="#/pedi/${last.id}${S.last.k ? '/p' + S.last.k : ''}">${thumb(ill(last.id, S.last.k ? `p${S.last.k}b` : 'cover'), last.title)}
        <span class="rt"><span class="kicker">▶ REPRENDRE</span><span class="t">${last.n}. ${esc(last.title)}</span><span class="s">${S.last.k ? `Partie ${S.last.k} · ${esc(last.parts[S.last.k - 1].title)}` : 'Le plan de la fiche'}</span>${segs(last)}</span></a>` : ''}
      <div class="sec">OÙ J'EN SUIS</div>
      <a class="card prog" href="#/pedi">${ring(vP, 'var(--p6)')}<span class="rt"><span class="t">Pédicurie</span><span class="s">${nP}/24 fiches sues · ${PEDI.reduce((s, f) => s + nSeen(f), 0)} parties lues</span>${bar(nP / 24, 'var(--p6)')}</span><span class="chev">›</span></a>
      <a class="card prog" href="#/anat">${ring(nA / AQ.length, 'var(--p1)')}<span class="rt"><span class="t">Anatomie palpatoire</span><span class="s">${nA}/${AQ.length} repères sus</span><span class="minis">${regs}</span></span><span class="chev">›</span></a>
      <div class="sec">RÉVISER MAINTENANT</div>
      <div class="quick">
        ${nextF ? `<a class="qb" href="#/pedi/${nextF.id}" style="--c:var(--p6)">${thumb(ill(nextF.id, 'cover'), nextF.title)}<span class="t">Fiche ${nextF.n}</span><span class="s">${esc(nextF.title)}</span></a>` : ''}
        <a class="qb" href="#/anat/quiz" style="--c:var(--p1)"><span class="em">🎯</span><span class="t">Je m'interroge</span><span class="s">un repère d'anatomie au hasard</span></a>
        <a class="qb" href="#/tirage" style="--c:var(--red)"><span class="em">🎲</span><span class="t">Tirage au sort</span><span class="s">comme le jour de l'oral</span></a>
        <a class="qb" href="#/plan" style="--c:var(--p3)">${thumb(ill('plan', 'board'), 'Le plan')}<span class="t">Le plan de l'oral</span><span class="s">les 8 questions</span></a>
      </div></div>`;
  }

  // ---------- pédicurie ----------
  function pediList() {
    const nP = PEDI.filter(f => doneP(f.id)).length;
    return `<div class="wrap">${top('#/', 'Pédicurie · 24 fiches', count(nP, 24))}
      <div class="entries">${PEDI.map(f => `<a class="entry" href="#/pedi/${f.id}">${thumb(ill(f.id, 'cover'), f.title)}
        <span class="rt"><span class="n">${f.n} · ${esc(f.catName)}${S.qz && S.qz[f.id] ? ` · quiz ${S.qz[f.id].last} %` : ''}</span><span class="t">${esc(f.title)}</span>${segs(f)}</span>${doneP(f.id) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`).join('')}</div></div>`;
  }

  // la fiche : où j'en suis, le bouton pour continuer, les outils, puis le plan
  function fiche(f) {
    const n = f.parts.length, k = nSeen(f), nextK = (f.parts.findIndex((_, i) => !seenP(f, i + 1)) + 1) || 1;
    if (!S.last || S.last.id !== f.id) { S.last = { id: f.id, k: 0 }; save(); }
    const tool = (href, em, label) => `<a class="tool" href="${href}"><span class="em">${em}</span><span>${label}</span></a>`;
    const i = PEDI.indexOf(f), a = PEDI[i - 1], b = PEDI[i + 1];
    return `<div class="wrap">${top('#/pedi', `Fiche ${f.n} / 24 · ${esc(f.catName)}`, count(k, n))}
      <div class="fhead"><span class="drawn th zoomable">${img(ill(f.id, 'cover'), f.title)}</span><div class="rt"><h1>${esc(f.title)}</h1>${segs(f)}<span class="s">${doneP(f.id) ? '✓ fiche sue' : `${k} partie${k > 1 ? 's' : ''} lue${k > 1 ? 's' : ''} sur ${n}`}</span></div></div>
      <a class="btn wide" href="#/pedi/${f.id}/p${nextK}">${k === 0 ? 'Commencer la fiche' : k === n ? 'Revoir depuis le début' : `Continuer : partie ${nextK}`} →</a>
      <a class="btn wide quizbtn" href="#/pedi/${f.id}/quiz" style="--c:var(--p5)">🎯 Apprendre la fiche : quiz${S.qz && S.qz[f.id] ? ` · dernier ${S.qz[f.id].last} %` : ''}</a>
      <div class="tools">
        ${VIDEOS[f.id] ? tool(`#/pedi/${f.id}/video`, '▶️', 'Vidéo') : ''}
        ${tool(`#/pedi/${f.id}/memo`, '📝', 'Mots-clés')}
        ${f.photos.length ? tool(`#/pedi/${f.id}/photos`, '📷', 'Photos') : ''}
        ${f.livret ? tool(`#/pedi/${f.id}/livret`, '📖', 'Livret') : ''}
      </div>
      <div class="sec">${esc(f.planTitle || 'LE PLAN EN ' + n + ' PARTIES').toUpperCase()}</div>
      <div class="entries">${f.parts.map((p, j) => `<a class="entry part-e" href="#/pedi/${f.id}/p${j + 1}" style="--c:${PCOL(j)}"><span class="stamp xs">${j + 1}</span>
        <span class="rt"><span class="t">${esc(p.title)}</span><span class="q">${esc(p.q)}</span></span>${thumb(ill(f.id, `p${j + 1}b`), p.title)}${seenP(f, j + 1) ? '<span class="ok">✓</span>' : ''}</a>`).join('')}</div>
      <button class="btn wide ${doneP(f.id) ? 'ghost' : ''}" id="done" style="--c:var(--p6);margin-top:18px">${doneP(f.id) ? 'Je dois encore la revoir' : '✓ Je la connais'}</button>
      <div class="pair">${a ? `<a href="#/pedi/${a.id}">← Fiche ${a.n}</a>` : '<span></span>'}${b ? `<a href="#/pedi/${b.id}">Fiche ${b.n} →</a>` : ''}</div></div>`;
  }

  // une partie = un écran : le dessin de la vidéo, les points clés, ce que je dis
  function part(f, k) {
    const p = f.parts[k - 1], n = f.parts.length, c = PCOL(k - 1);
    if (!p) return fiche(f);
    const st = S.pedi[f.id] = S.pedi[f.id] || {};
    st.seen = st.seen || []; if (!st.seen.includes(k)) st.seen.push(k);
    S.last = { id: f.id, k }; save();
    const prev = k > 1 ? `#/pedi/${f.id}/p${k - 1}` : `#/pedi/${f.id}`, next = k < n ? `#/pedi/${f.id}/p${k + 1}` : `#/pedi/${f.id}/memo`;
    return `<div class="wrap ${S.revise ? 'revise' : ''}">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)}`, `<button class="eye" id="revise" aria-pressed="${!!S.revise}" title="Me tester : cacher les réponses">${S.revise ? '🙈' : '👁'}</button>`)}
      <nav class="segnav">${f.parts.map((_, i) => `<a href="#/pedi/${f.id}/p${i + 1}" class="${i + 1 === k ? 'on' : seenP(f, i + 1) ? 'seen' : ''}" style="--c:${PCOL(i)}">${i + 1}</a>`).join('')}</nav>
      <section class="part solo" style="--c:${c}">
        <header><span class="stamp sm">${k}</span><div><h2>${esc(p.title)}</h2><span class="q">${esc(p.q)}</span></div></header>
        <figure class="drawn slide">${img(ill(f.id, `p${k}b`), p.title + ' : dessin de la vidéo', 'crop')}</figure>
        ${S.revise ? '<div class="hint">🙈 Mode test : récite, puis touche une ligne pour la voir. (👁 en haut pour tout afficher)</div>' : ''}
        <div class="body">${blocks(p.blocks)}</div>
        <details class="say"><summary>🗣 Ce que je dis à l'oral</summary><p>${md(p.say)}</p></details>
        <a class="btn ghost wide" href="#/pedi/${f.id}/quiz/${k}" style="margin-top:14px">🎯 Me tester sur cette partie</a>
      </section>
      ${pager(prev, `<a class="btn grow" href="${next}" style="--c:${k < n ? PCOL(k) : 'var(--hl)'}">${k < n ? `Partie ${k + 1}` : 'Mots-clés'} →</a>`, next)}</div>`;
  }

  function memo(f) {
    const n = f.parts.length;
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · mots-clés`)}<div class="muted lead">Une ligne par partie : récite à partir des mots-clés.</div>
      <div class="sheet">${f.memo.map((r, i) => `<a class="row" href="#/pedi/${f.id}/p${i + 1}"><span class="n" style="color:${PCOL(i)}">${i + 1}.</span><span class="qq">${esc(r.q)}</span><span class="k"><span class="hl">${md(r.k)}</span></span></a>`).join('')}</div>
      ${pager(`#/pedi/${f.id}/p${n}`, `<a class="btn grow" href="#/pedi/${f.id}/quiz" style="--c:var(--p5)">Quiz →</a>`, `#/pedi/${f.id}/quiz`)}</div>`;
  }

  // ---------- quiz d'apprentissage d'une fiche (data/quiz.js) ----------
  // Partie par partie : 1 à 3 questions, puis « récite la partie » et on coche les idées dites.
  // Ce qui est raté revient 3 cartes plus loin. À la fin : toute la fiche de mémoire, avec le plan.
  let Q = null;
  const shuffle = a => a.map(x => [Math.random(), x]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
  function mkStep(p, s) {
    const [q, a] = s.split(' | '), st = { t: 'q', p, q };
    if (a.includes(' || ')) { const [ok, bad] = a.split(' || '); Object.assign(st, { kind: 'qcm', ok, opts: shuffle([ok, ...bad.split(' ; ')]) }); }
    else if (a.includes(' ; ')) Object.assign(st, { kind: 'list', items: a.split(' ; ') });
    else Object.assign(st, { kind: 'flip', a });
    return st;
  }
  function startQuiz(f, key, parts) {
    const Z = (window.QUIZ || {})[f.id] || [], steps = [];
    for (const p of parts) { (Z[p - 1] ? Z[p - 1].q : []).forEach(s => steps.push(mkStep(p, s))); steps.push({ t: 'r', p, items: Z[p - 1] ? Z[p - 1].k : [] }); }
    if (key === 'all') steps.push({ t: 'f', marks: {}, rev: {} });
    Q = { id: f.id, key, full: key === 'all' && parts.length === f.parts.length, steps, i: 0, res: {} };
  }
  // une carte validée : score de 0 à 1 ; ratée → elle revient un peu plus loin (une seule fois)
  function quizScore(st, v) {
    if (!st.retry) { const r = Q.res[st.p] = Q.res[st.p] || { ok: 0, tot: 0 }; r.ok += v; r.tot += 1; }
    if (v < 1 && !st.retry) {
      const c = Object.assign({}, st, { retry: true, shown: false, pick: null, ticks: [] });
      const lastFinal = Q.steps[Q.steps.length - 1].t === 'f' ? 1 : 0;
      Q.steps.splice(Math.min(Q.i + 4, Q.steps.length - lastFinal), 0, c);
    }
    Q.i++;
  }
  function quiz(f, c) {
    const key = c && f.parts[+c - 1] ? c : 'all';
    if (!Q || Q.id !== f.id || Q.key !== key) startQuiz(f, key, key === 'all' ? f.parts.map((_, i) => i + 1) : [+key]);
    const back = key === 'all' ? `#/pedi/${f.id}` : `#/pedi/${f.id}/p${key}`;
    const head = top(back, `${f.n}. ${esc(f.title)} · quiz`, Q.i < Q.steps.length ? count(Q.i + 1, Q.steps.length) : '');
    const bar = `<div class="qbar">${Q.steps.map((x, j) => `<i class="${j < Q.i ? 'on' : j === Q.i ? 'now' : ''}" style="--c:${x.t === 'f' ? 'var(--ink)' : PCOL(x.p - 1)}"></i>`).join('')}</div>`;
    if (Q.i >= Q.steps.length) return `<div class="wrap">${head}${quizEnd(f)}</div>`;
    const st = Q.steps[Q.i], P = f.parts[st.p - 1];
    const label = st.t === 'f' ? `<div class="qpart" style="--c:var(--ink)">TOUTE LA FICHE, DE MÉMOIRE</div>`
      : `<div class="qpart" style="--c:${PCOL(st.p - 1)}"><span class="stamp xs">${st.p}</span>${esc(P.title)}${st.retry ? ' <span class="again">↻ encore une fois</span>' : ''}</div>`;
    const btn = (qa, txt, col, cls = '') => `<button class="btn grow ${cls}" data-qa="${qa}" style="--c:${col}">${txt}</button>`;
    const checks = items => `<div class="checks">${items.map((x, j) => `<button class="ck ${(st.ticks || []).includes(j) ? 'on' : ''}" data-qa="ck" data-j="${j}"><span class="box"></span><span>${md(x)}</span></button>`).join('')}</div>`;
    let body = '', foot = '';
    if (st.t === 'q' && st.kind === 'qcm') {
      body = `<div class="question">${md(st.q)}</div><div class="opts">${st.opts.map((o, j) => `<button class="opt ${st.pick != null ? (o === st.ok ? 'good' : j === st.pick ? 'bad' : 'dim') : ''}" data-qa="pick" data-j="${j}" ${st.pick != null ? 'disabled' : ''}>${md(o)}</button>`).join('')}</div>`;
      foot = st.pick != null ? btn('next', st.opts[st.pick] === st.ok ? '✓ Bien vu ! Continuer →' : 'Continuer →', st.opts[st.pick] === st.ok ? 'var(--p6)' : 'var(--hl)') : '<span class="tip">Choisis une réponse</span>';
    } else if (st.t === 'q' && st.kind === 'flip') {
      body = `<div class="question">${md(st.q)}</div>${st.shown ? `<div class="answer">${md(st.a)}</div>` : '<div class="say-it">🗣 Réponds à voix haute</div>'}`;
      foot = st.shown ? btn('no', '✗ Pas su', '#f6c3b9') + btn('yes', '✓ Je savais', 'var(--p6)') : btn('show', 'Voir la réponse', 'var(--hl)');
    } else if (st.t === 'q') {
      body = `<div class="question">${md(st.q)}</div>${st.shown ? `<div class="muted small">Touche ce que tu avais trouvé :</div>${checks(st.items)}` : `<div class="say-it">🗣 Cite-les à voix haute (${st.items.length})</div>`}`;
      foot = st.shown ? btn('valid', `Valider · ${(st.ticks || []).length}/${st.items.length}`, 'var(--p6)') : btn('show', 'Voir la réponse', 'var(--hl)');
    } else if (st.t === 'r') {
      const m = f.memo[st.p - 1];
      body = `<div class="kicker">RÉCITE LA PARTIE ${st.p}</div><div class="question">${esc(P.q)}</div>
        ${st.shown ? `<div class="muted small">Coche ce que tu as dit :</div>${checks(st.items)}<details class="say"><summary>🗣 Le texte complet de la partie</summary><p>${md(P.say)}</p></details>`
          : `<div class="say-it">🗣 Dis-la à voix haute, comme à l'oral.</div>${m ? `<details class="hintk"><summary>💡 Un indice</summary><span class="hl">${md(m.k)}</span></details>` : ''}`}`;
      foot = st.shown ? btn('valid', `Valider · ${(st.ticks || []).length}/${st.items.length}`, 'var(--p6)') : btn('show', "J'ai récité → voir", 'var(--hl)');
    } else {
      body = `<div class="muted small">Pour chaque question du plan, dis la partie à voix haute, puis touche-la pour vérifier.</div>
        <div class="finals">${f.memo.map((r, j) => `<div class="fin" style="--c:${PCOL(j)}"><button class="fq" data-qa="frev" data-j="${j}"><span class="n">${j + 1}.</span> ${esc(r.q)}${st.rev[j] ? `<span class="fk hl">${md(r.k)}</span>` : '<span class="fk muted">toucher pour vérifier</span>'}</button>
          ${st.rev[j] ? `<span class="fm"><button class="${st.marks[j] === false ? 'on ko' : ''}" data-qa="fko" data-j="${j}">✗</button><button class="${st.marks[j] ? 'on ok' : ''}" data-qa="fok" data-j="${j}">✓</button></span>` : ''}</div>`).join('')}</div>`;
      foot = btn('fend', `Terminer · ${Object.values(st.marks).filter(Boolean).length}/${f.memo.length} ✓`, 'var(--p6)');
    }
    return `<div class="wrap qz">${head}${bar}${label}<div class="card qc">${body}</div><div class="pager fixed">${foot}</div></div>`;
  }
  function quizEnd(f) {
    const parts = Object.keys(Q.res).map(Number).sort((a, b) => a - b);
    const ok = parts.reduce((s, p) => s + Q.res[p].ok, 0), tot = parts.reduce((s, p) => s + Q.res[p].tot, 0), v = tot ? ok / tot : 0;
    const weak = parts.filter(p => Q.res[p].ok / Q.res[p].tot < 0.8);
    if (Q.full && !Q.saved) { const z = S.qz = S.qz || {}, o = z[f.id] || {}; z[f.id] = { last: pc(v), best: Math.max(o.best || 0, pc(v)), at: Date.now() }; Q.saved = true; save(); }
    const msg = v >= 0.9 ? 'Tu la connais ! Refais-la demain pour la garder.' : v >= 0.6 ? 'Presque : refais les parties en rouge.' : 'Normal au début : refais les parties en rouge, puis recommence demain.';
    return `<div class="card qend">${ring(v, v >= 0.9 ? 'var(--p6)' : v >= 0.6 ? 'var(--p4)' : 'var(--red)')}<div class="question">${msg}</div></div>
      <div class="entries">${parts.map(p => { const r = Q.res[p], x = r.ok / r.tot; return `<a class="entry part-e" href="#/pedi/${f.id}/p${p}" style="--c:${PCOL(p - 1)}"><span class="stamp xs">${p}</span><span class="rt"><span class="t">${esc(f.parts[p - 1].title)}</span>${bar(x, x >= 0.8 ? 'var(--p6)' : 'var(--red)')}</span>${x >= 0.8 ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`; }).join('')}</div>
      <div class="pager fixed">${weak.length ? `<button class="btn grow" data-qa="weak" data-w="${weak.join(',')}" style="--c:var(--hl)">↻ Refaire ${weak.length > 1 ? 'les ' + weak.length + ' parties ratées' : 'la partie ratée'}</button>` : `<button class="btn grow" data-qa="again" style="--c:var(--hl)">↻ Recommencer</button>`}<a class="btn ghost grow" href="#/pedi/${f.id}">Fiche</a></div>`;
  }
  function quizAct(t) {
    const st = Q && Q.steps[Q.i], j = +t.dataset.j, f = PEDI.find(x => x.id === Q.id);
    switch (t.dataset.qa) {
      case 'show': st.shown = true; break;
      case 'yes': quizScore(st, 1); break;
      case 'no': quizScore(st, 0); break;
      case 'pick': st.pick = j; break;
      case 'next': quizScore(st, st.opts[st.pick] === st.ok ? 1 : 0); break;
      case 'ck': st.ticks = st.ticks || []; st.ticks = st.ticks.includes(j) ? st.ticks.filter(x => x !== j) : st.ticks.concat(j); break;
      case 'valid': quizScore(st, st.items.length ? (st.ticks || []).length / st.items.length : 1); break;
      case 'frev': st.rev[j] = true; break;
      case 'fok': st.marks[j] = true; break;
      case 'fko': st.marks[j] = false; break;
      case 'fend': f.memo.forEach((_, k) => { const r = Q.res[k + 1] = Q.res[k + 1] || { ok: 0, tot: 0 }; r.ok += st.marks[k] ? 1 : 0; r.tot += 1; }); Q.i++; break;
      case 'weak': { const key = Q.key; startQuiz(f, key, t.dataset.w.split(',').map(Number)); Q.full = false; break; }
      case 'again': startQuiz(f, Q.key, Q.key === 'all' ? f.parts.map((_, i) => i + 1) : [+Q.key]); break;
    }
    render();
  }

  function video(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · vidéo`)}
      ${frame(VIDEOS[f.id], 'Vidéo de la fiche', ill(f.id, 'cover'))}
      <div class="muted lead" style="margin-top:12px">Regarde-la une fois en entier, puis reprends partie par partie.</div>
      <a class="btn wide" href="#/pedi/${f.id}/p1">Partie 1 →</a></div>`;
  }
  function photos(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · photos`)}<div class="photos">${f.photos.map(p => `<figure class="photo"><img loading="lazy" src="${p.src}" alt="${esc(p.cap)}" ${RETRY}><figcaption>${esc(p.cap)}<small>${p.ln ? `<a href="${p.ln}" target="_blank" rel="noopener">${esc(p.cr)}</a>` : esc(p.cr)}</small></figcaption></figure>`).join('')}</div></div>`;
  }
  function livret(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · livret`)}<div class="livret">${f.livret}</div></div>`;
  }
  function pedi(id, sub, c) {
    const f = PEDI.find(x => x.id === id);
    if (!f) return notFound();
    if (!sub) return fiche(f);
    if (/^p\d+$/.test(sub)) return part(f, +sub.slice(1));
    if (sub === 'video' && !VIDEOS[f.id]) return fiche(f);
    if (sub === 'quiz') return quiz(f, c);
    return ({ memo, photos, livret, video }[sub] || fiche)(f);
  }

  // le plan de l'oral : une ligne par question, on l'ouvre pour voir le dessin et ce qu'on attend
  function plan() {
    const P = window.PLAN_ORAL || [];
    return `<div class="wrap">${top('#/', "Le plan de l'oral")}<div class="muted lead">Pour chaque sujet, les mêmes 8 questions, dans le même ordre.</div>
      ${VIDEOS.plan ? frame(VIDEOS.plan, 'Vidéo : le plan de l’oral', ill('plan', 'cover')) : ''}
      <div class="entries" style="margin-top:16px">${P.map((p, i) => `<details class="fold-e" style="--c:${PCOL(i)}"><summary class="entry part-e"><span class="stamp xs">${i + 1}</span><span class="rt"><span class="t">${esc(p.title)}</span><span class="q">${esc(p.q)}</span></span><span class="chev">›</span></summary>
        <div class="dd"><figure class="drawn slide">${img(ill('plan', `p${i + 1}b`), p.title, 'crop')}</figure><p>${md(p.say)}</p></div></details>`).join('')}</div></div>`;
  }

  // ---------- anatomie : une région à la fois (pied, jambe, cuisse), puis os et muscles ----------
  function anatList(r) {
    r = REG_ORDER.includes(r) ? r : (REG_ORDER.includes(S.areg) ? S.areg : 'pied');
    if (S.areg !== r) { S.areg = r; save(); }
    const nA = AQ.filter(x => doneA(x.q)).length, items = AQ.filter(x => x.reg === r);
    let h = `<div class="wrap">${top('#/', 'Anatomie palpatoire', count(nA, AQ.length))}
      <nav class="regtabs">${REG_ORDER.map(x => { const it = AQ.filter(a => a.reg === x), k = it.filter(a => doneA(a.q)).length;
        return `<a href="#/anat/${x}" class="${x === r ? 'on' : ''}" style="--c:${RCOL[x]}"><span class="t">${REG_SHORT[x]}</span><span class="s">${k}/${it.length}</span>${bar(k / it.length, RCOL[x])}</a>`; }).join('')}</nav>
      <a class="btn wide" href="#/anat/quiz" style="--c:var(--hl)">🎯 Je m'interroge</a>`;
    for (const g of ['Os', 'Muscles']) {
      const it = items.filter(x => x.group === g);
      if (!it.length) continue;
      h += `<div class="sec" style="color:${RCOL[r]}">${g === 'Os' ? '🦴 OS & REPÈRES OSSEUX' : '💪 MUSCLES & TENDONS'} · ${it.filter(x => doneA(x.q)).length}/${it.length}</div>
        <div class="entries">${it.map(x => `<a class="entry" href="#/anat/${x.q}" style="--c:${RCOL[r]}">${zoomThumb(x, 52)}<span class="rt"><span class="n">Question ${x.q}</span><span class="t">${esc(x.name)}</span></span>${doneA(x.q) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`).join('')}</div>`;
    }
    return h + '</div>';
  }

  // vignette ronde découpée dans la planche, centrée sur le numéro de la structure
  function zoomThumb(x, size = 64) {
    const p = x.plates[0], d = p && PL[p.pl], m = d && d.num.find(n => n[0] === p.num);
    if (!m) return '';
    const bw = size * 4, bh = bw * d.h / d.w, px = -(m[1] / d.w * bw - size / 2), py = -(m[2] / d.h * bh - size / 2);
    return `<span class="zthumb" style="width:${size}px;height:${size}px;background-image:url(${d.src});background-size:${bw}px ${bh}px;background-position:${px}px ${py}px"></span>`;
  }

  function plateHTML(p, name) {
    const d = PL[p.pl]; if (!d) return '';
    const leg = d.leg[p.num - 1];
    return `<figure class="plate"><div style="position:relative"><img loading="lazy" src="${d.src}" width="${d.w}" height="${d.h}" alt="${esc(name)}">
      ${d.num.map(([n, x, y]) => `<span class="num ${n === p.num ? 'me' : ''}" style="left:${(x / d.w) * 100}%;top:${(y / d.h) * 100}%">${n}</span>`).join('')}</div>
      <figcaption><b>${p.num}.</b> ${esc(leg ? leg[0] : name)}${leg && leg[1] ? ` <span class="muted">· ${esc(leg[1])}</span>` : ''}</figcaption></figure>`;
  }

  function anatItem(q) {
    const x = AQ.find(a => a.q === +q);
    if (!x) return notFound();
    const c = RCOL[x.reg], i = AQ.indexOf(x), a = AQ[i - 1], b = AQ[i + 1];
    const f = (label, txt, col) => txt ? `<div class="tag field" style="--c:${col}"><div class="tt">${label}</div><div>${md(txt)}</div></div>` : '';
    const mus = x.o || x.t || x.nerf || x.act ? `<div class="card ident"><div class="tt">Fiche d'identité</div><div class="mcard">
      ${[['Origine', x.o], ['Terminaison', x.t], ['Innervation', x.nerf], ['Action', x.act]].filter(r => r[1]).map(([l, v]) => `<span class="l">${l}</span><span>${md(v)}</span>`).join('')}</div></div>` : '';
    return `<div class="wrap">${top(`#/anat/${x.reg}`, `${REG_SHORT[x.reg]} · ${x.group}`, count(AQ.filter(y => doneA(y.q)).length, AQ.length))}
      <div class="fhead">${zoomThumb(x, 64)}<div class="rt"><div class="n" style="color:${c}">QUESTION ${x.q}</div><h1>${esc(x.name)}</h1></div></div>
      <div class="fields">${f('Position du sujet', x.pos, 'var(--p1)')}${f('Comment le trouver', x.how, 'var(--p4)')}${f('Pour vérifier', x.chk, 'var(--p6)')}${f("Ce qui s'y insère", x.ins, 'var(--p3)')}</div>
      ${mus}
      <div class="sec">SUR LA PLANCHE</div>${x.plates.map(p => plateHTML(p, x.name)).join('')}
      ${pager(a ? `#/anat/${a.q}` : '', `<button class="btn grow ${doneA(x.q) ? 'ghost' : ''}" id="aknow" style="--c:var(--p6)">${doneA(x.q) ? '✓ Su · à revoir ?' : 'Je sais le palper'}</button>`, b ? `#/anat/${b.q}` : '')}</div>`;
  }

  // je m'interroge : un repère au hasard (les non sus d'abord), on cherche, puis on vérifie
  let card = null, shown = false;
  function anatQuiz() {
    if (!card) { const pool = AQ.filter(x => !doneA(x.q)); const src = pool.length ? pool : AQ; card = src[Math.floor(Math.random() * src.length)]; shown = false; }
    const x = card, c = RCOL[x.reg], nA = AQ.filter(a => doneA(a.q)).length;
    return `<div class="wrap">${top(`#/anat/${x.reg}`, "Je m'interroge", count(nA, AQ.length))}${bar(nA / AQ.length, 'var(--p6)')}
      <div class="card draw"><span class="stamp" style="--c:${c}">${x.q}</span><div class="kicker" style="margin-top:12px">${esc(x.regName).toUpperCase()} · ${x.group.toUpperCase()}</div><div class="big">${esc(x.name)}</div>
      <div class="muted">Position du sujet ? Comment le trouver ? Comment vérifier ?${x.o ? ' Origine, terminaison, nerf, action ?' : ''}${x.ins ? " Qu'est-ce qui s'y insère ?" : ''}</div>
      ${shown ? `<div style="text-align:left;margin-top:16px" class="fields">${x.pos ? `<div class="tag" style="--c:var(--p1)"><div class="tt">Position</div>${md(x.pos)}</div>` : ''}<div class="tag" style="--c:var(--p4)"><div class="tt">Comment le trouver</div>${md(x.how)}</div>${x.chk ? `<div class="tag" style="--c:var(--p6)"><div class="tt">Vérifier</div>${md(x.chk)}</div>` : ''}${x.ins ? `<div class="tag" style="--c:var(--p3)"><div class="tt">Ce qui s'y insère</div>${md(x.ins)}</div>` : ''}${x.o ? `<div class="tag" style="--c:var(--p3)"><div class="tt">Identité</div><b>O :</b> ${md(x.o)}<br><b>T :</b> ${md(x.t)}<br><b>N :</b> ${md(x.nerf)}<br><b>A :</b> ${md(x.act)}</div>` : ''}</div>` : ''}
      <div class="btns center"><a class="btn ghost" href="#/anat/${x.q}">Ouvrir la fiche</a></div></div>
      <div class="pager fixed">${shown ? `<button class="btn grow" id="qko" style="--c:#f6c3b9">À revoir</button><button class="btn grow" id="qok" style="--c:var(--p6)">✓ Je savais</button>` : `<button class="btn grow" id="qshow">Voir la réponse</button>`}</div></div>`;
  }

  let draw = null;
  function tirage() {
    const d = draw;
    return `<div class="wrap">${top('#/', 'Tirage au sort')}<div class="muted lead">Comme le jour de l'oral : 5 minutes pour préparer, puis tu présentes avec le plan.</div>
      <div class="quick"><button class="qb" id="drawP" style="--c:var(--p6)"><span class="em">🎲</span><span class="t">Un sujet de pédicurie</span></button><button class="qb" id="drawA" style="--c:var(--p1)"><span class="em">🎲</span><span class="t">5 repères à palper</span></button></div>
      ${d && d.kind === 'p' ? `<a class="card draw" href="#/pedi/${d.f.id}"><span class="stamp">${d.f.n}</span><div class="big">${esc(d.f.title)}</div><div class="muted">Touche pour ouvrir la fiche</div></a>` : ''}
      ${d && d.kind === 'a' ? `<div class="entries" style="margin-top:16px">${d.list.map(x => `<a class="entry" href="#/anat/${x.q}" style="--c:${RCOL[x.reg]}">${zoomThumb(x, 52)}<span class="rt"><span class="n">Question ${x.q} · ${REG_SHORT[x.reg]}</span><span class="t">${esc(x.name)}</span></span><span class="chev">›</span></a>`).join('')}</div>` : ''}</div>`;
  }

  const notFound = () => `<div class="wrap">${top('#/', 'Introuvable')}<div class="empty">Cette page n'existe pas.</div></div>`;

  // ---------- routeur ----------
  function render() {
    const [, sec, a, b, c] = (location.hash || '#/').split('/');
    let html;
    if (!sec) html = home();
    else if (sec === 'pedi') html = a ? pedi(a, b, c) : pediList();
    else if (sec === 'plan') html = plan();
    else if (sec === 'anat') html = a === 'quiz' ? anatQuiz() : a && !REG_ORDER.includes(a) ? anatItem(a) : anatList(a);
    else if (sec === 'tirage') html = tirage();
    else html = notFound();
    $('#app').innerHTML = html;
    document.body.classList.toggle('reading', !!$('#app .pager.fixed'));
    document.querySelectorAll('nav.tabs a').forEach(t => t.classList.toggle('on', t.dataset.s === (sec || '') || (t.dataset.s === 'tirage' && sec === 'plan')));
    const f = PEDI.find(x => x.id === a);
    document.title = sec === 'pedi' && f ? `${f.n}. ${f.title} · Révisions podo` : sec === 'anat' && a && a !== 'quiz' && !REG_ORDER.includes(a) ? `Q${a} · Anatomie · Révisions podo` : 'Révisions podo';
    window.scrollTo(0, 0);
    fitVideos();
  }

  // toucher un dessin ou une planche : plein écran (on peut zoomer avec les doigts), toucher encore pour fermer
  document.addEventListener('click', e => {
    const im = e.target.closest('.slide img, .zoomable img, .plate img');
    if (im) { e.preventDefault(); const z = document.createElement('div'); z.className = 'zoom'; z.innerHTML = `<img src="${im.getAttribute('src')}" alt=""><span>Toucher pour fermer</span>`; z.onclick = () => z.remove(); document.body.appendChild(z); return; }
  }, true);
  document.addEventListener('click', e => {
    const t = e.target.closest('button, .revise .part .body li, .revise .part .body .chip, .revise .part .body .badge');
    if (!t) return;
    if (t.classList.contains('poster')) { t.remove(); return; }
    if (t.dataset.qa) { quizAct(t); return; }
    if (t.classList.contains('reveal')) { t.closest('[data-quiz]').classList.add('shown'); return; }
    if (!t.matches('button')) { t.classList.toggle('shown'); return; }
    const [, sec, a] = location.hash.split('/');
    if (t.id === 'revise') { S.revise = !S.revise; save(); render(); }
    if (t.id === 'done') { const p = S.pedi[a] = S.pedi[a] || {}; p.done = !p.done; save(); render(); }
    if (t.id === 'aknow') { S.anat[a] = !S.anat[a]; save(); render(); }
    if (t.id === 'qshow') { shown = true; render(); }
    if (t.id === 'qok' || t.id === 'qko') { S.anat[card.q] = t.id === 'qok'; save(); card = null; render(); }
    if (t.id === 'drawP') { draw = { kind: 'p', f: PEDI[Math.floor(Math.random() * PEDI.length)] }; render(); }
    if (t.id === 'drawA') { const pool = AQ.slice().sort(() => Math.random() - 0.5); draw = { kind: 'a', list: pool.slice(0, 5).sort((x, y) => x.q - y.q) }; render(); }
  });

  // glisser le doigt à gauche / à droite : page suivante / précédente (là où il y a la barre du bas)
  let tx = null, ty = 0;
  document.addEventListener('touchstart', e => { tx = e.touches.length === 1 ? e.touches[0].clientX : null; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (tx === null || $('.zoom')) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
    const l = $(dx < 0 ? '.pager.fixed a.next' : '.pager.fixed a.prev');
    if (l) location.hash = l.getAttribute('href');
  }, { passive: true });

  window.addEventListener('hashchange', render);
  render();
})();
