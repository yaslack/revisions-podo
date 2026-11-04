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
  const img = (src, alt, cls = '') => `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" onerror="this.closest('.drawn')?this.closest('.drawn').remove():this.remove()">`;
  const frame = (id, t) => `<iframe src="https://drive.google.com/file/d/${id}/preview" allow="autoplay; fullscreen" allowfullscreen loading="lazy" title="${t}"></iframe>`;
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
        <span class="rt"><span class="n">${f.n} · ${esc(f.catName)}</span><span class="t">${esc(f.title)}</span>${segs(f)}</span>${doneP(f.id) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`).join('')}</div></div>`;
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
      <div class="tools">
        ${VIDEOS[f.id] ? tool(`#/pedi/${f.id}/video`, '▶️', 'Vidéo') : ''}
        ${tool(`#/pedi/${f.id}/memo`, '📝', 'Mots-clés')}
        ${tool(`#/pedi/${f.id}/quiz`, '❓', 'Quiz')}
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
      </section>
      ${pager(prev, `<a class="btn grow" href="${next}" style="--c:${k < n ? PCOL(k) : 'var(--hl)'}">${k < n ? `Partie ${k + 1}` : 'Mots-clés'} →</a>`, next)}</div>`;
  }

  function memo(f) {
    const n = f.parts.length;
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · mots-clés`)}<div class="muted lead">Une ligne par partie : récite à partir des mots-clés.</div>
      <div class="sheet">${f.memo.map((r, i) => `<a class="row" href="#/pedi/${f.id}/p${i + 1}"><span class="n" style="color:${PCOL(i)}">${i + 1}.</span><span class="qq">${esc(r.q)}</span><span class="k"><span class="hl">${md(r.k)}</span></span></a>`).join('')}</div>
      ${pager(`#/pedi/${f.id}/p${n}`, `<a class="btn grow" href="#/pedi/${f.id}/quiz" style="--c:var(--p5)">Quiz →</a>`, `#/pedi/${f.id}/quiz`)}</div>`;
  }

  function quiz(f) {
    return `<div class="wrap quiz">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · quiz`)}<div class="muted lead">Réponds à voix haute, puis retourne la carte.</div>
      ${f.quiz.map((q, i) => `<div class="card qcard" data-quiz><span class="badge qnum">QUESTION ${i + 1}</span>
        <div class="question">${md(q.q)}</div><div class="answer">${md(q.a)}</div><div class="btns center"><button class="btn reveal">Voir la réponse</button></div></div>`).join('')}
      ${pager(`#/pedi/${f.id}/memo`, `<a class="btn grow" href="#/pedi/${f.id}" style="--c:var(--p6)">Fin de la fiche ✓</a>`, '')}</div>`;
  }

  function video(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · vidéo`)}
      <div class="video">${frame(VIDEOS[f.id], 'Vidéo de la fiche')}</div>
      <div class="muted lead" style="margin-top:12px">Regarde-la une fois en entier, puis reprends partie par partie.</div>
      <a class="btn wide" href="#/pedi/${f.id}/p1">Partie 1 →</a></div>`;
  }
  function photos(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · photos`)}<div class="photos">${f.photos.map(p => `<figure class="photo"><img loading="lazy" src="${p.src}" alt="${esc(p.cap)}"><figcaption>${esc(p.cap)}<small>${p.ln ? `<a href="${p.ln}" target="_blank" rel="noopener">${esc(p.cr)}</a>` : esc(p.cr)}</small></figcaption></figure>`).join('')}</div></div>`;
  }
  function livret(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `${f.n}. ${esc(f.title)} · livret`)}<div class="livret">${f.livret}</div></div>`;
  }
  function pedi(id, sub) {
    const f = PEDI.find(x => x.id === id);
    if (!f) return notFound();
    if (!sub) return fiche(f);
    if (/^p\d+$/.test(sub)) return part(f, +sub.slice(1));
    if (sub === 'video' && !VIDEOS[f.id]) return fiche(f);
    return ({ memo, quiz, photos, livret, video }[sub] || fiche)(f);
  }

  // le plan de l'oral : une ligne par question, on l'ouvre pour voir le dessin et ce qu'on attend
  function plan() {
    const P = window.PLAN_ORAL || [];
    return `<div class="wrap">${top('#/', "Le plan de l'oral")}<div class="muted lead">Pour chaque sujet, les mêmes 8 questions, dans le même ordre.</div>
      ${VIDEOS.plan ? `<div class="video">${frame(VIDEOS.plan, 'Vidéo : le plan de l’oral')}</div>` : ''}
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
      <div class="fields">${f('Position du sujet', x.pos, 'var(--p1)')}${f('Comment le trouver', x.how, 'var(--p4)')}${f('Pour vérifier', x.chk, 'var(--p6)')}</div>
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
      <div class="muted">Position du sujet ? Comment le trouver ? Comment vérifier ?${x.o ? ' Origine, terminaison, nerf, action ?' : ''}</div>
      ${shown ? `<div style="text-align:left;margin-top:16px" class="fields">${x.pos ? `<div class="tag" style="--c:var(--p1)"><div class="tt">Position</div>${md(x.pos)}</div>` : ''}<div class="tag" style="--c:var(--p4)"><div class="tt">Comment le trouver</div>${md(x.how)}</div>${x.chk ? `<div class="tag" style="--c:var(--p6)"><div class="tt">Vérifier</div>${md(x.chk)}</div>` : ''}${x.o ? `<div class="tag" style="--c:var(--p3)"><div class="tt">Identité</div><b>O :</b> ${md(x.o)}<br><b>T :</b> ${md(x.t)}<br><b>N :</b> ${md(x.nerf)}<br><b>A :</b> ${md(x.act)}</div>` : ''}</div>` : ''}
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
    const [, sec, a, b] = (location.hash || '#/').split('/');
    let html;
    if (!sec) html = home();
    else if (sec === 'pedi') html = a ? pedi(a, b) : pediList();
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
  }

  // toucher un dessin ou une planche : plein écran (on peut zoomer avec les doigts), toucher encore pour fermer
  document.addEventListener('click', e => {
    const im = e.target.closest('.slide img, .zoomable img, .plate img');
    if (im) { e.preventDefault(); const z = document.createElement('div'); z.className = 'zoom'; z.innerHTML = `<img src="${im.getAttribute('src')}" alt=""><span>Toucher pour fermer</span>`; z.onclick = () => z.remove(); document.body.appendChild(z); return; }
  }, true);
  document.addEventListener('click', e => {
    const t = e.target.closest('button, .revise .part .body li, .revise .part .body .chip, .revise .part .body .badge');
    if (!t) return;
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
