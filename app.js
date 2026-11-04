// Révisions podo : 24 fiches de pédicurie (structure des vidéos) + 59 questions d'anatomie palpatoire.
// Données : data/pedi.js (window.PEDI, PLAN_ORAL), data/anat.js (ANAT_Q, ANAT_PL, ANAT_REG), data/videos.js (VIDEOS).
(() => {
  const PEDI = window.PEDI, AQ = window.ANAT_Q, PL = window.ANAT_PL, VIDEOS = window.VIDEOS || {};
  const PCOL = i => `var(--p${(i % 8) + 1})`;
  const RCOL = { pied: 'var(--p5)', jambe: 'var(--p4)', cuisse: 'var(--p1)' };
  const REG_ORDER = ['pied', 'jambe', 'cuisse'];
  const REG_PLATE = { pied: 'r-parcours2', jambe: 'b-jambe-ext', cuisse: 'r-hanchemus' };
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
  const dots = (arr, on) => `<div class="dots">${arr.map(x => `<i class="${on(x) ? 'on' : ''}"></i>`).join('')}</div>`;

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

  // ---------- pages ----------
  const top = (back, kicker) => `<div class="top"><a class="back" href="${back}" aria-label="Retour">←</a><div class="kicker">${kicker}</div></div>`;

  // dessins des vidéos : illus/<fiche>/cover.webp, pNa.webp (milieu de la partie), pNb.webp (fin)
  const ill = (id, name) => `illus/${id}/${name}.webp`;
  const img = (src, alt, cls = '') => `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" onerror="this.closest('.drawn')?this.closest('.drawn').remove():this.remove()">`;

  const frame = (id, t) => `<iframe src="https://drive.google.com/file/d/${id}/preview" allow="autoplay; fullscreen" allowfullscreen loading="lazy" title="${t}"></iframe>`;

  function home() {
    const nP = PEDI.filter(f => doneP(f.id)).length, nA = AQ.filter(x => doneA(x.q)).length;
    const last = S.last && PEDI.find(f => f.id === S.last.id);
    const pile = [PEDI[0], PEDI[9], PEDI[23]].map((f, i) => `<span class="drawn pile p${i}">${img(ill(f.id, 'cover'), f.title)}</span>`).join('');
    return `<div class="wrap">
      <div class="kicker">ORAL UEM · PÉDICURIE-PODOLOGIE</div>
      <h1 class="space-s">Mes révisions</h1>
      <div class="drawn big home-hero">${img(ill('plan', 'board'), 'Le plan en 8 questions')}</div>
      ${last ? `<a class="card step resume" href="#/pedi/${last.id}${S.last.k ? '/p' + S.last.k : ''}" style="--c:var(--red)"><span class="drawn mini">${img(ill(last.id, S.last.k ? `p${S.last.k}b` : 'cover'), last.title)}</span><span><span class="kicker">REPRENDRE</span><span class="t">${esc(last.title)}</span><span class="s">${S.last.k ? 'partie ' + S.last.k + ' · ' + esc(last.parts[S.last.k - 1].title) : 'le plan de la fiche'}</span></span></a>` : ''}
      <div class="home-grid">
        <a class="card subject" href="#/pedi" style="--c:var(--p6)"><div class="piles">${pile}</div><div class="kicker">PÉDICURIE</div><h2>24 fiches</h2>
          <div class="muted">Le plan en 8 parties, les dessins des vidéos, les mots-clés et le quiz de chaque fiche.</div>${dots(PEDI, f => doneP(f.id))}<div class="big">${nP} / 24</div></a>
        <a class="card subject" href="#/anat" style="--c:var(--p1)"><span class="drawn">${img(PL['r-parcours2'] ? PL['r-parcours2'].src : '', 'Planche du pied', 'plate-thumb')}</span><div class="kicker">ANATOMIE PALPATOIRE</div><h2>59 questions</h2>
          <div class="muted">Pied, jambe, cuisse ; puis os et muscles.</div>${dots(AQ, x => doneA(x.q))}<div class="big">${nA} / 59</div></a>
        <a class="card subject" href="#/plan" style="--c:var(--p3)"><span class="drawn">${img(ill('plan', 'p1b'), 'Le plan de l’oral')}</span><div class="kicker">MÉTHODE</div><h2>Le plan de l'oral</h2><div class="muted">Les 8 questions à dérouler pour chaque sujet.</div></a>
        <a class="card subject" href="#/tirage" style="--c:var(--red)"><span class="drawn">${img(ill('plan', 'cover'), 'Tirage au sort')}</span><div class="kicker">ENTRAÎNEMENT</div><h2>Tirage au sort</h2><div class="muted">Comme le jour J : un sujet au hasard, ou des repères à palper.</div></a>
      </div></div>`;
  }

  function pediList() {
    return `<div class="wrap">${top('#/', 'PÉDICURIE · 24 FICHES')}<h1>Les fiches</h1>${dots(PEDI, f => doneP(f.id))}
      <div class="cover-list">${PEDI.map(f => `<a class="cover-card" href="#/pedi/${f.id}">
        <span class="drawn">${img(ill(f.id, 'cover'), f.title)}</span>
        <span class="cap"><span class="stamp sm" style="--c:${doneP(f.id) ? 'var(--p6)' : 'var(--red)'}">${f.n}</span><span><span class="t">${esc(f.title)}</span><span class="s">${esc(f.catName)}${doneP(f.id) ? ' · ✓ sue' : ''}</span></span></span></a>`).join('')}</div></div>`;
  }

  // la fiche = la couverture, puis le plan : une carte dessinée par partie
  function fiche(f) {
    const vid = VIDEOS[f.id], n = f.parts.length;
    if (!S.last || S.last.id !== f.id) { S.last = { id: f.id, k: 0 }; save(); }
    return `<div class="wrap">${top('#/pedi', `FICHE ${f.n} / 24 · ${esc(f.catName).toUpperCase()}`)}
      <div class="hero"><span class="stamp">${f.n}</span><div><h1>${esc(f.title)}</h1><div class="sub">${esc(f.catName)} · ${n} parties · mots-clés · quiz</div></div></div>
      ${vid ? `<div class="video">${frame(vid, 'Vidéo de la fiche')}</div>`
            : `<div class="drawn big">${img(ill(f.id, 'cover'), f.title)}</div>`}
      <h2 class="space">${esc(f.planTitle || 'Le plan en ' + n + ' parties')}</h2>
      <div class="board drawn-board">${f.parts.map((p, i) => `<a class="pcard" href="#/pedi/${f.id}/p${i + 1}" style="--c:${PCOL(i)}">
        <span class="drawn thumb">${img(ill(f.id, `p${i + 1}b`), p.title)}</span>
        <span class="pc-cap"><span class="stamp sm">${i + 1}</span><span><span class="t">${esc(p.title)}</span><span class="q">${esc(p.q)}</span></span></span></a>`).join('')}</div>
      <div class="next-steps">
        <a class="card step" href="#/pedi/${f.id}/memo" style="--c:var(--p8)"><span class="emoji">📝</span><span><span class="t">La fiche en mots-clés</span><span class="s">les ${f.memo.length} parties sur une page</span></span></a>
        <a class="card step" href="#/pedi/${f.id}/quiz" style="--c:var(--p5)"><span class="emoji">❓</span><span><span class="t">À toi de jouer !</span><span class="s">${f.quiz.length} questions, réponds à voix haute</span></span></a>
        ${f.photos.length ? `<a class="card step" href="#/pedi/${f.id}/photos" style="--c:var(--p4)"><span class="emoji">📷</span><span><span class="t">Photos</span><span class="s">${f.photos.length} images du livret et cliniques</span></span></a>` : ''}
        ${f.livret ? `<a class="card step" href="#/pedi/${f.id}/livret" style="--c:var(--muted)"><span class="emoji">📖</span><span><span class="t">Le livret, mot pour mot</span><span class="s">le texte officiel de la fiche</span></span></a>` : ''}
      </div>
      <div class="card end"><h2>${doneP(f.id) ? `Fiche ${f.n} bouclée ✓` : `Fiche ${f.n}`}</h2>
        <div class="muted">Regarde-la 2 ou 3 fois, récite-la à voix haute partie par partie, puis sans regarder.</div>
        <button class="btn" id="done" style="--c:${doneP(f.id) ? 'var(--card)' : 'var(--p6)'}">${doneP(f.id) ? 'Je dois encore la revoir' : '✓ Je la connais'}</button>
        <div class="btns center">${navPedi(f)}</div></div></div>`;
  }

  // une partie = un écran : le dessin de la vidéo, les points clés, ce que je dis
  function part(f, k) {
    const p = f.parts[k - 1], n = f.parts.length, c = PCOL(k - 1);
    if (!p) return fiche(f);
    S.last = { id: f.id, k }; save();
    const prev = k > 1 ? `#/pedi/${f.id}/p${k - 1}` : `#/pedi/${f.id}`, next = k < n ? `#/pedi/${f.id}/p${k + 1}` : `#/pedi/${f.id}/memo`;
    return `<div class="wrap ${S.revise ? 'revise' : ''}">${top(`#/pedi/${f.id}`, `FICHE ${f.n} · ${esc(f.title).toUpperCase()}`)}
      <div class="steps">${f.parts.map((_, i) => `<a href="#/pedi/${f.id}/p${i + 1}" class="${i + 1 === k ? 'on' : ''}" style="--c:${PCOL(i)}">${i + 1}</a>`).join('')}</div>
      <section class="part solo" style="--c:${c}">
        <header><span class="stamp">${k}</span><div><div class="k">PARTIE ${k} / ${n}</div><h2>${esc(p.title)}</h2><span class="q hl">${esc(p.q)}</span></div></header>
        <div class="slides">${['a', 'b'].map(x => `<figure class="drawn slide">${img(ill(f.id, `p${k}${x}`), p.title + ' : dessin de la vidéo', 'crop')}</figure>`).join('')}</div>
        <div class="btns"><button class="btn ${S.revise ? 'dark' : 'ghost'}" id="revise">${S.revise ? '👁 Tout afficher' : '🙈 Me tester (cacher)'}</button></div>
        <div class="body">${blocks(p.blocks)}</div>
        <details class="say"><summary>🗣 Ce que je dis à l'oral</summary><p>${md(p.say)}</p></details>
      </section>
      <div class="pager"><a class="btn ghost" href="${prev}">← ${k > 1 ? 'Partie ' + (k - 1) : 'Le plan'}</a><a class="btn" href="${next}" style="--c:${k < n ? PCOL(k) : 'var(--hl)'}">${k < n ? 'Partie ' + (k + 1) : 'Mots-clés'} →</a></div></div>`;
  }

  function memo(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `FICHE ${f.n} · MOTS-CLÉS`)}<h1>La fiche en mots-clés</h1><div class="muted space-s">${esc(f.title)} : une ligne par partie.</div>
      <div class="sheet">${f.memo.map((r, i) => `<a class="row" href="#/pedi/${f.id}/p${i + 1}"><span class="n" style="color:${PCOL(i)}">${i + 1}.</span><span class="qq">${esc(r.q)}</span><span class="k"><span class="hl">${md(r.k)}</span></span></a>`).join('')}</div>
      <div class="pager"><a class="btn ghost" href="#/pedi/${f.id}/p${f.parts.length}">← Partie ${f.parts.length}</a><a class="btn" href="#/pedi/${f.id}/quiz" style="--c:var(--p5)">Quiz →</a></div></div>`;
  }

  function quiz(f) {
    return `<div class="wrap quiz">${top(`#/pedi/${f.id}`, `FICHE ${f.n} · QUIZ`)}<h1>À toi de jouer !</h1><div class="muted space-s">Réponds à voix haute, puis retourne la carte.</div>
      ${f.quiz.map((q, i) => `<div class="card qcard" data-quiz><span class="badge qnum" style="--c:var(--p5)">QUESTION ${i + 1}</span>
        <div class="question">${md(q.q)}</div><div class="answer">${md(q.a)}</div><div class="btns center"><button class="btn reveal">Voir la réponse</button></div></div>`).join('')}
      <div class="pager"><a class="btn ghost" href="#/pedi/${f.id}/memo">← Mots-clés</a><a class="btn" href="#/pedi/${f.id}" style="--c:var(--p6)">Retour à la fiche</a></div></div>`;
  }

  function photos(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `FICHE ${f.n} · PHOTOS`)}<h1>Photos</h1><div class="photos space">${f.photos.map(p => `<figure class="photo"><img loading="lazy" src="${p.src}" alt="${esc(p.cap)}"><figcaption>${esc(p.cap)}<small>${p.ln ? `<a href="${p.ln}" target="_blank" rel="noopener">${esc(p.cr)}</a>` : esc(p.cr)}</small></figcaption></figure>`).join('')}</div></div>`;
  }
  function livret(f) {
    return `<div class="wrap">${top(`#/pedi/${f.id}`, `FICHE ${f.n} · LIVRET`)}<h1>Le livret, mot pour mot</h1><div class="livret space">${f.livret}</div></div>`;
  }
  function pedi(id, sub) {
    const f = PEDI.find(x => x.id === id);
    if (!f) return notFound();
    if (!sub) return fiche(f);
    if (/^p\d+$/.test(sub)) return part(f, +sub.slice(1));
    return ({ memo, quiz, photos, livret }[sub] || fiche)(f);
  }
  const navPedi = f => { const i = PEDI.indexOf(f), a = PEDI[i - 1], b = PEDI[i + 1]; return (a ? `<a class="btn ghost" href="#/pedi/${a.id}">← ${a.n}</a>` : '') + (b ? `<a class="btn ghost" href="#/pedi/${b.id}">${b.n} →</a>` : ''); };

  function plan() {
    const P = window.PLAN_ORAL || [];
    return `<div class="wrap">${top('#/', 'MÉTHODE')}<h1>Le plan de l'oral</h1><div class="muted space-s">Pour chaque sujet, on déroule les mêmes 8 questions, dans le même ordre.</div>
      ${VIDEOS.plan ? `<div class="video">${frame(VIDEOS.plan, 'Vidéo : le plan de l’oral')}</div>` : `<div class="drawn big">${img(ill('plan', 'board'), 'Le plan en 8 questions')}</div>`}
      ${P.map((p, i) => `<section class="part solo" id="p${i + 1}" style="--c:${PCOL(i)}"><header><span class="stamp">${i + 1}</span><div><h2>${esc(p.title)}</h2><span class="q hl">${esc(p.q)}</span></div></header>
        <figure class="drawn slide">${img(ill('plan', `p${i + 1}b`), p.title, 'crop')}</figure>
        <details class="say"><summary>🗣 Ce qu'on attend dans cette partie</summary><p>${md(p.say)}</p></details></section>`).join('')}</div>`;
  }

  function anatList() {
    let h = `<div class="wrap">${top('#/', 'ANATOMIE PALPATOIRE · 59 QUESTIONS')}<h1>Les 59 repères</h1>${dots(AQ, x => doneA(x.q))}
      <div class="btns"><a class="btn" href="#/anat/quiz" style="--c:var(--hl)">Je m'interroge</a><a class="btn ghost" href="#/tirage">Tirage au sort</a></div>`;
    for (const r of REG_ORDER) {
      const items = AQ.filter(x => x.reg === r);
      const pl = PL[REG_PLATE[r]];
      h += `<div class="region" style="--c:${RCOL[r]}">${pl ? `<span class="drawn">${img(pl.src, window.ANAT_REG[r], 'plate-thumb')}</span>` : ''}<div><h2>${esc(window.ANAT_REG[r])}</h2><div class="muted">${items.length} repères · ${items.filter(x => doneA(x.q)).length} sus</div>${dots(items, x => doneA(x.q))}</div></div>`;
      for (const g of ['Os', 'Muscles']) {
        const it = items.filter(x => x.group === g);
        if (!it.length) continue;
        h += `<div class="sub-title" style="--c:${RCOL[r]}">${g === 'Os' ? '🦴 OS & REPÈRES OSSEUX' : '💪 MUSCLES & TENDONS'}</div><div class="list">${it.map(x => `<a class="tag item" href="#/anat/${x.q}" style="--c:${RCOL[r]}">
          ${zoomThumb(x)}<span class="stamp xs" style="--c:${doneA(x.q) ? 'var(--p6)' : RCOL[r]}">${x.q}</span><span class="t">${esc(x.name)}</span>${doneA(x.q) ? '<span class="ok">✓</span>' : ''}</a>`).join('')}</div>`;
      }
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
    const mus = x.o || x.t || x.nerf || x.act ? `<div class="card"><h3 style="margin-bottom:8px">Fiche d'identité</h3><div class="mcard">
      ${[['Origine', x.o], ['Terminaison', x.t], ['Innervation', x.nerf], ['Action', x.act]].filter(r => r[1]).map(([l, v]) => `<span class="l">${l}</span><span>${md(v)}</span>`).join('')}</div></div>` : '';
    return `<div class="wrap">${top('#/anat', `QUESTION ${x.q} · ${esc(x.regName).toUpperCase()} · ${x.group.toUpperCase()}`)}
      <div class="hero"><span class="stamp" style="--c:${c}">${x.q}</span><div><h1>${esc(x.name)}</h1><div class="sub">${esc(x.regName)} · ${x.kind === 'os' ? 'os / repère osseux' : x.kind === 'tendon' ? 'tendon / ligament' : 'muscle'}</div></div></div>
      <div class="fields">${f('Position du sujet', x.pos, 'var(--p1)')}${f('Comment le trouver', x.how, 'var(--p4)')}${f('Pour vérifier', x.chk, 'var(--p6)')}</div>
      <div style="margin-top:16px">${mus}</div>
      <h2 style="margin:22px 0 10px">Sur la planche</h2>${x.plates.map(p => plateHTML(p, x.name)).join('')}
      <div class="card" style="text-align:center;margin-top:24px"><button class="btn" id="aknow" style="--c:${doneA(x.q) ? 'var(--card)' : 'var(--p6)'}">${doneA(x.q) ? 'À revoir' : '✓ Je sais le palper'}</button>
        <div class="btns" style="justify-content:center">${a ? `<a class="btn ghost" href="#/anat/${a.q}">← Q${a.q}</a>` : ''}${b ? `<a class="btn ghost" href="#/anat/${b.q}">Q${b.q} →</a>` : ''}</div></div></div>`;
  }

  // je m'interroge : un repère au hasard (les non sus d'abord), on cherche, puis on vérifie
  let card = null, shown = false;
  function anatQuiz() {
    if (!card) { const pool = AQ.filter(x => !doneA(x.q)); const src = pool.length ? pool : AQ; card = src[Math.floor(Math.random() * src.length)]; shown = false; }
    const x = card, c = RCOL[x.reg];
    return `<div class="wrap">${top('#/anat', `JE M'INTERROGE · ${AQ.filter(a => doneA(a.q)).length}/59 SUS`)}
      <div class="card draw"><span class="stamp" style="--c:${c}">${x.q}</span><div class="kicker" style="margin-top:12px">${esc(x.regName).toUpperCase()} · ${x.group.toUpperCase()}</div><div class="big">${esc(x.name)}</div>
      <div class="muted">Position du sujet ? Comment le trouver ? Comment vérifier ?${x.o ? ' Origine, terminaison, nerf, action ?' : ''}</div>
      ${shown ? `<div style="text-align:left;margin-top:16px" class="fields">${x.pos ? `<div class="tag" style="--c:var(--p1)"><div class="tt">Position</div>${md(x.pos)}</div>` : ''}<div class="tag" style="--c:var(--p4)"><div class="tt">Comment le trouver</div>${md(x.how)}</div>${x.chk ? `<div class="tag" style="--c:var(--p6)"><div class="tt">Vérifier</div>${md(x.chk)}</div>` : ''}${x.o ? `<div class="tag" style="--c:var(--p3)"><div class="tt">Identité</div><b>O :</b> ${md(x.o)}<br><b>T :</b> ${md(x.t)}<br><b>N :</b> ${md(x.nerf)}<br><b>A :</b> ${md(x.act)}</div>` : ''}</div>
        <div class="btns" style="justify-content:center"><button class="btn" id="qok" style="--c:var(--p6)">✓ Je savais</button><button class="btn" id="qko" style="--c:#f6c3b9">À revoir</button></div>`
        : `<div class="btns" style="justify-content:center"><button class="btn" id="qshow">Voir la réponse</button></div>`}</div>
      <div class="btns" style="justify-content:center"><a class="btn ghost" href="#/anat/${x.q}">Ouvrir la fiche</a></div></div>`;
  }

  let draw = null;
  function tirage() {
    const d = draw;
    return `<div class="wrap">${top('#/', 'ENTRAÎNEMENT')}<h1>Tirage au sort</h1><div class="muted" style="margin:6px 0 14px">Comme le jour de l'oral : 5 minutes pour préparer, puis tu présentes avec le plan.</div>
      <div class="btns"><button class="btn" id="drawP" style="--c:var(--p6)">🎲 Un sujet de pédicurie</button><button class="btn" id="drawA" style="--c:var(--p1)">🎲 5 repères à palper</button></div>
      ${d && d.kind === 'p' ? `<a class="card draw" href="#/pedi/${d.f.id}"><span class="stamp">${d.f.n}</span><div class="big">${esc(d.f.title)}</div><div class="muted">Touche pour ouvrir la fiche</div></a>` : ''}
      ${d && d.kind === 'a' ? `<div class="list">${d.list.map(x => `<a class="tag item" href="#/anat/${x.q}" style="--c:${RCOL[x.reg]}"><span class="stamp xs" style="--c:${RCOL[x.reg]}">${x.q}</span><span><span class="t">${esc(x.name)}</span><br><span class="s">${esc(x.regName)}</span></span></a>`).join('')}</div>` : ''}</div>`;
  }

  const notFound = () => `<div class="wrap">${top('#/', 'INTROUVABLE')}<div class="empty">Cette page n'existe pas.</div></div>`;

  // ---------- routeur ----------
  function render() {
    const [, sec, a, b] = (location.hash || '#/').split('/');
    let html;
    if (!sec) html = home();
    else if (sec === 'pedi') html = a ? pedi(a, b) : pediList();
    else if (sec === 'plan') html = plan();
    else if (sec === 'anat') html = a === 'quiz' ? anatQuiz() : a ? anatItem(a) : anatList();
    else if (sec === 'tirage') html = tirage();
    else html = notFound();
    $('#app').innerHTML = html;
    document.querySelectorAll('nav.tabs a').forEach(t => t.classList.toggle('on', t.dataset.s === (sec || '') || (t.dataset.s === 'tirage' && sec === 'plan')));
    const f = PEDI.find(x => x.id === a);
    document.title = sec === 'pedi' && f ? `${f.n}. ${f.title} · Révisions podo` : sec === 'anat' && a && a !== 'quiz' ? `Q${a} · Anatomie · Révisions podo` : 'Révisions podo';
    if (!(sec === 'plan' && a)) window.scrollTo(0, 0);
    if (sec === 'plan' && a) setTimeout(() => { const el = document.getElementById(a); if (el) el.scrollIntoView(); }, 0);
  }

  // toucher un dessin ou une planche : plein écran (on peut zoomer avec les doigts), toucher encore pour fermer
  document.addEventListener('click', e => {
    const im = e.target.closest('.slide img, .drawn.big img, .plate img, .home-hero img');
    if (im) { e.preventDefault(); const z = document.createElement('div'); z.className = 'zoom'; z.innerHTML = `<img src="${im.getAttribute('src')}" alt=""><span>Toucher pour fermer</span>`; z.onclick = () => z.remove(); document.body.appendChild(z); return; }
  }, true);
  document.addEventListener('click', e => {
    const t = e.target.closest('button, .revise .part .body > *, .revise .part .body li, .revise .part .body .tag');
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
  window.addEventListener('hashchange', render);
  render();
})();
