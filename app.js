// Révisions podo : 24 fiches de pédicurie (structure des vidéos) + 59 questions d'anatomie palpatoire.
// Données : data/pedi.js (window.PEDI, PLAN_ORAL), data/anat.js (ANAT_Q, ANAT_PL, ANAT_REG), data/videos.js (VIDEOS).
(() => {
  const PEDI = window.PEDI, PODO = window.PODO || [], PODO_OK = PODO.filter(f => f.ready), AQ = window.ANAT_Q, PL = window.ANAT_PL, VIDEOS = window.VIDEOS || {};
  const PCOL = i => `var(--p${(i % 8) + 1})`;
  const RCOL = { pied: 'var(--p5)', jambe: 'var(--p4)', cuisse: 'var(--p1)' };
  const REG_ORDER = ['pied', 'jambe', 'cuisse'];
  const REG_SHORT = { pied: 'Pied', jambe: 'Jambe', cuisse: 'Cuisse' };
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  // progression, gardée sur le téléphone ; l'appli marche sans (navigation privée)
  const KEY = 'podo:v3';
  let usedBefore = false; try { usedBefore = !!(localStorage.getItem('podo:v2') || localStorage.getItem(KEY)); } catch (e) {}
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
  const ILLX = Object.fromEntries(PODO.filter(f => f.ill).map(f => [f.id, f.ill]));   // podologie : dessins en .jpg
  const ill = (id, name) => `illus/${id}/${name}.${ILLX[id] || 'webp'}`;
  // une image qui ne charge pas (réseau du téléphone) : on réessaie une fois, puis on retire son cadre
  // une fiche de pédicurie ou de podologie : son adresse, sa liste, ses dessins (la podologie n'a pas encore les dessins des vidéos)
  const FB = f => `#/${f.sec || 'pedi'}/${f.id}`, LISTOF = f => f.sec === 'podo' ? PODO_OK : PEDI, ALLF = PEDI.concat(PODO_OK);
  const SECN = f => f.sec === 'podo' ? 'Podologie' : 'Pédicurie', NTOT = f => f.sec === 'podo' ? PODO.length : PEDI.length;
  const hasIll = f => f.sec !== 'podo' || !!f.ill;
  const RETRY = `onerror="if(!this.dataset.r){this.dataset.r=1;this.src=this.src.split('?')[0]+'?r=1'}else(this.closest('.drawn')||this).remove()"`;
  const img = (src, alt, cls = '') => `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" ${RETRY}>`;
  // vidéo Drive : la couverture dessinée ouvre un calque plein écran avec le lecteur Drive à la forme exacte de la vidéo.
  // Drive recadre son image et grossit ses commandes dans un petit cadre : le lecteur est dessiné plus grand puis réduit
  // (fitLayer). Il est seul dans le calque (rien ne défile dessous) et supprimé en fermant, pour que rien ne tourne après.
  const frame = (id, t, poster) => `<button class="video vposter" data-vid="${id}" style="background-image:url(${poster})" aria-label="${t}">
    <span class="play">▶</span><span class="vtxt">Regarder la vidéo</span></button>`;
  // yt : vidéo YouTube (tests d'examen clinique, de piriforme.fr) ; src : la page d'où elle vient
  function openVideo(id, yt, src, lab) {
    closeVideo();
    const d = document.createElement('div'); d.className = 'vlayer' + (yt ? ' yt' : '');
    d.innerHTML = `<iframe src="${yt ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&autoplay=1` : `https://drive.google.com/file/d/${id}/preview`}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen title="Vidéo"></iframe>
      <div class="vrot">📱↻ Tourne ton téléphone pour voir la vidéo en grand.</div>
      <button class="vclose" id="vclose" aria-label="Fermer la vidéo">✕</button>
      ${yt ? `<a class="vdrive" href="${src}" target="_blank" rel="noopener">${lab || 'Fiche du test sur piriforme.fr'} ↗</a>` : `<a class="vdrive" href="https://drive.google.com/file/d/${id}/view" target="_blank" rel="noopener">Ouvrir dans Drive ↗</a>`}`;
    document.body.appendChild(d); document.body.classList.add('vopen');
    fitLayer(); window.addEventListener('resize', fitLayer);
    try { if (screen.orientation && screen.orientation.lock && d.requestFullscreen) d.requestFullscreen().then(() => screen.orientation.lock('landscape')).catch(() => {}); } catch (e) {}
  }
  // le lecteur est dessiné à 800 px de large au moins, puis réduit : Drive garde ses commandes de taille normale
  // (sur iPhone il les agrandit dans un petit cadre) et montre l'image entière, même en portrait
  function fitLayer() {
    const d = $('.vlayer'), f = d && d.querySelector('iframe'); if (!f) return;
    const W = d.clientWidth, H = d.clientHeight, fw = Math.min(W, H * 16 / 9), fh = fw * 9 / 16, VW = d.classList.contains('yt') ? fw : Math.max(fw, 800), k = fw / VW;
    Object.assign(f.style, { width: VW + 'px', height: VW * 9 / 16 + 'px', left: (W - fw) / 2 + 'px', top: (H - fh) / 2 + 'px', transform: k < 1 ? `scale(${k})` : '' });
  }
  function closeVideo() {
    window.removeEventListener('resize', fitLayer);
    const d = $('.vlayer'); if (!d) return;
    d.querySelector('iframe').src = 'about:blank'; d.remove(); document.body.classList.remove('vopen');
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
  }
  const thumb = (src, alt) => `<span class="drawn th">${img(src, alt)}</span>`;

  // Noé (Nono) devient Natasha de 21 h à 6 h ; le nom de l'appli mélange Yaya et Noé : Yanoé (Yanatasha la nuit, en touchant le titre)
  const night = () => { const h = new Date().getHours(); return h >= 21 || h < 6; };
  const NONO = () => night() ? 'Natasha' : 'Nono';
  const nightly = t => t.replace(/Nono/g, NONO());
  // la nuit, toucher le titre le change en Yanatasha (et retour), avec un fondu flou
  document.addEventListener('click', e => {
    const h = e.target.closest('#apptitle'); if (!h || !night() || h.classList.contains('swap')) return;
    h.classList.add('swap');
    setTimeout(() => { const n = h.dataset.n = h.dataset.n === '1' ? '0' : '1'; h.innerHTML = `Ya<span>${n === '1' ? 'natasha' : 'noé'}</span>`; h.classList.remove('swap'); }, 420);
  });

  // ---------- accueil : où j'en suis, et quoi faire maintenant ----------
  function home() {
    const nP = PEDI.filter(f => doneP(f.id)).length, vP = PEDI.reduce((s, f) => s + pctP(f), 0) / PEDI.length;
    const nA = AQ.filter(x => doneA(x.q)).length;
    const last = S.last && ALLF.find(f => f.id === S.last.id);
    const nextF = PEDI.find(f => !doneP(f.id) && f !== last);
    const regs = REG_ORDER.map(r => { const it = AQ.filter(x => x.reg === r), k = it.filter(x => doneA(x.q)).length; return `<span class="mini"><span>${REG_SHORT[r]} ${k}/${it.length}</span>${bar(k / it.length, RCOL[r])}</span>`; }).join('');
    return `<div class="wrap">
      <header class="brand"><h1 id="apptitle" class="${night() ? 'tap' : ''}">Ya<span>noé</span></h1><div class="kicker">L'ORAL UEM DE PODO, SANS STRESS</div></header>
      <div class="team"><span class="mate zoomable"><img src="photos/equipe/yaya.jpg" data-full="photos/equipe/yaya-full.jpg" alt="Yaya"><span><b>Yaya</b> 🧢<br><small>le dev</small></span></span>
        <span class="mate zoomable"><img src="photos/equipe/nono.jpg" data-full="photos/equipe/nono-full.jpg" alt="${NONO()}"><span><b>${NONO()}</b> 🚧<br><small>le cerveau</small></span></span></div>
      ${todayCard()}
      ${last ? `<a class="card resume" href="${FB(last)}${S.last.k ? '/p' + S.last.k : ''}">${hasIll(last) ? thumb(ill(last.id, S.last.k ? `p${S.last.k}b` : 'cover'), last.title) : `<span class="stamp sm" style="--c:var(--p8)">${last.n}</span>`}
        <span class="rt"><span class="kicker">▶ REPRENDRE</span><span class="t">${last.n}. ${esc(last.title)}</span><span class="s">${S.last.k ? `Partie ${S.last.k} · ${esc(last.parts[S.last.k - 1].title)}` : 'Le plan de la fiche'}</span>${segs(last)}</span></a>` : ''}
      <div class="sec">OÙ J'EN SUIS</div>
      <a class="card prog" href="#/pedi">${ring(vP, 'var(--p6)')}<span class="rt"><span class="t">Pédicurie</span><span class="s">${nP}/24 fiches sues · ${PEDI.reduce((s, f) => s + nSeen(f), 0)} parties lues</span>${bar(nP / 24, 'var(--p6)')}</span><span class="chev">›</span></a>
      <a class="card prog" href="#/podo">${ring(PODO_OK.length ? PODO_OK.reduce((s, f) => s + pctP(f), 0) / PODO.length : 0, 'var(--p8)')}<span class="rt"><span class="t">Podologie</span><span class="s">${PODO_OK.filter(f => doneP(f.id)).length}/${PODO.length} fiches sues · ${PODO_OK.length} prête${PODO_OK.length > 1 ? 's' : ''}, les autres arrivent</span>${bar(PODO_OK.filter(f => doneP(f.id)).length / PODO.length, 'var(--p8)')}</span><span class="chev">›</span></a>
      <a class="card prog" href="#/anat">${ring(nA / AQ.length, 'var(--p1)')}<span class="rt"><span class="t">Anatomie palpatoire</span><span class="s">${nA}/${AQ.length} repères sus</span><span class="minis">${regs}</span></span><span class="chev">›</span></a>
      <a class="card prog" href="#/clin">${ring((nC(CL) + nB(BL)) / (CL.length + BL.length), 'var(--p4)')}<span class="rt"><span class="t">Examen clinique</span><span class="s">${nC(CL)}/${CL.length} tests · ${nB(BL)}/${BL.length} étapes du bilan</span>${bar((nC(CL) + nB(BL)) / (CL.length + BL.length), 'var(--p4)')}</span><span class="chev">›</span></a>
      <div class="sec">RÉVISER MAINTENANT</div>
      <div class="quick">
        ${nextF ? `<a class="qb" href="${FB(nextF)}" style="--c:var(--p6)">${thumb(ill(nextF.id, 'cover'), nextF.title)}<span class="t">Fiche ${nextF.n}</span><span class="s">${esc(nextF.title)}</span></a>` : ''}
        <a class="qb" href="#/anat/quiz" style="--c:var(--p1)"><span class="em">🎯</span><span class="t">Je m'interroge</span><span class="s">un repère d'anatomie au hasard</span></a>
        <a class="qb" href="#/tirage" style="--c:var(--red)"><span class="em">🎲</span><span class="t">Tirage au sort</span><span class="s">comme le jour de l'oral</span></a>
        <a class="qb" href="#/plan" style="--c:var(--p3)">${thumb(ill('plan', 'board'), 'Le plan')}<span class="t">Le plan de l'oral</span><span class="s">les 8 questions</span></a>
      </div>
      ${window.SONS ? `<div class="sec">POUR SE CONCENTRER</div>${SONS.card()}` : ''}
      <div class="sec">RÉGLAGES</div>${settings()}</div>`;
  }

  // ---------- réglages : thème, couleurs, taille du texte, code de sauvegarde ----------
  function settings() {
    const b = (attr, v, cur, t) => `<button class="btn ghost" data-${attr}="${v}" aria-pressed="${cur === v}">${t}</button>`;
    return `<div class="card sets">
      <div class="lbl">Thème</div><div class="skin">${b('skin', 'drawn', S.skin || 'drawn', '✏️ Dessiné')}${b('skin', 'classic', S.skin || 'drawn', 'Classique')}</div>
      <div class="lbl">Couleurs</div><div class="skin">${b('theme', '', S.theme || '', 'Auto')}${b('theme', 'light', S.theme || '', 'Clair')}${b('theme', 'dark', S.theme || '', 'Sombre')}</div>
      <div class="lbl">Texte</div><div class="skin">${b('size', '', S.size || '', 'Normal')}${b('size', 'big', S.size || '', 'Grand')}</div>
      <div class="lbl">Sauvegarde</div><div class="muted small">Ta progression reste sur ce téléphone. Sur iPhone, Safari et l'icône de l'écran d'accueil ne la partagent pas : copie ton code d'un côté, restaure-le de l'autre (ou garde-le dans tes Notes).</div>
      <div class="skin"><button class="btn ghost" id="bkcopy">📋 Copier mon code</button><button class="btn ghost" id="bkopen">Restaurer</button></div>
      <div id="bkzone" hidden><textarea id="bkta" rows="3" placeholder="Colle ton code ici"></textarea><button class="btn" id="bkload" style="--c:var(--hl)">Restaurer ce code</button></div>
      <div class="muted small" id="bkmsg"></div>
      <div class="lbl">Mise à jour</div><div class="skin"><span class="muted small" style="margin:0">Version ${APP_V}</span><button class="btn ghost" id="upcheck">🔄 Vérifier</button></div>
      <div class="muted small" id="upmsg"></div>
      <div class="lbl">Partager</div><div class="skin"><button class="btn" id="share" style="--c:var(--hl)">📤 Partager l'appli à un ami</button></div>
      <div class="muted small" id="shmsg">Chacun garde sa propre progression sur son téléphone.</div>
      ${matchMedia('(display-mode: standalone)').matches || navigator.standalone ? '' : `<div class="lbl">L'installer comme une appli</div><div class="muted small">Sur iPhone : ouvre le site dans Safari, touche Partager puis « Sur l'écran d'accueil ». Sur Android : menu ⋮ puis « Ajouter à l'écran d'accueil ». Elle marche ensuite sans réseau.</div>`}</div>`;
  }
  function setSkin() { const r = document.documentElement; r.dataset.skin = S.skin || 'drawn'; S.theme ? (r.dataset.theme = S.theme) : delete r.dataset.theme; S.size ? (r.dataset.size = S.size) : delete r.dataset.size; }
  setSkin();
  const toCode = () => btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  function fromCode(raw) {
    const o = JSON.parse(decodeURIComponent(escape(atob(raw.trim().replace(/\s/g, '')))));
    if (o && o.cards) { fromOld(o); return; }                  // un code de l'ancienne version
    if (!o || !o.pedi || !o.anat) throw new Error('code');
    S = Object.assign({ pedi: {}, anat: {} }, o);
  }

  // ---------- révisions espacées : une fiche (quiz) ou un repère revient après 1, 3, 6, 12 puis 25 jours ----------
  // Raté : il revient demain. Rien n'est prévu après l'oral : ce qui tomberait après revient la veille.
  const INT = [0, 1, 3, 6, 12, 25];
  const dayNum = (d = new Date()) => Math.round(new Date(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
  const today = () => dayNum();
  const examDay = () => S.exam ? dayNum(new Date(S.exam + 'T12:00:00')) : null;
  function review(key, ok) {
    const rv = S.rv = S.rv || {}, r = rv[key] = rv[key] || { b: 0, d: 0 }, T = today();
    r.b = ok ? Math.min(5, r.b + 1) : 0; r.d = T + (ok ? INT[r.b] : 1);
    const e = examDay(); if (e && e > T + 1 && r.d >= e) r.d = Math.max(T + 1, e - 1);
    did(1);
  }
  const dueKeys = pre => Object.entries(S.rv || {}).filter(([k, r]) => k.startsWith(pre) && r.d <= today()).map(([k]) => k.slice(pre.length));
  const dueIn = key => { const r = (S.rv || {})[key]; return r ? r.d - today() : null; };
  // activité du jour (pour l'objectif et la série de jours)
  const GOAL = 20;
  function did(n) { const d = S.days = S.days || {}, k = String(today()); d[k] = (d[k] || 0) + n; save(); }
  const doneToday = () => (S.days || {})[String(today())] || 0;
  function streak() { const d = S.days || {}; let t = today(), n = 0; if (!d[t]) t--; while (d[t]) { n++; t--; } return n; }
  function todayCard() {
    const T = today(), e = examDay(), left = e != null ? e - T : null;
    const dueF = dueKeys('f:').map(id => ALLF.find(f => f.id === id)).filter(Boolean), dueA = dueKeys('a:').length;
    const fresh = ALLF.filter(f => !doneP(f.id) && !(S.rv || {})['f:' + f.id] && !(S.last && S.last.id === f.id));
    const perDay = left > 1 ? Math.ceil(fresh.length / Math.max(1, left - 2)) : 0, nf = fresh[0], st = streak(), n = doneToday();
    const item = (href, em, t, sub) => `<a class="todo" href="${href}"><span class="em">${em}</span><span class="rt"><span class="t">${t}</span>${sub ? `<span class="s">${sub}</span>` : ''}</span><span class="chev">›</span></a>`;
    return `<div class="card today">
      <div class="trow"><div><div class="kicker">MA SÉANCE DU JOUR</div>${left != null ? `<div class="big3">${left > 0 ? `Oral dans ${left} jour${left > 1 ? 's' : ''}` : left === 0 ? "C'est le jour J !" : 'Oral passé'}</div>` : ''}</div>
        <div class="streak" title="Jours d'affilée">🔥 ${st}<small>jour${st > 1 ? 's' : ''}</small></div></div>
      <div class="goal"><span>Objectif du jour : ${Math.min(n, GOAL)} / ${GOAL}</span>${bar(Math.min(1, n / GOAL), 'var(--p6)')}</div>
      <div class="todos">
        ${dueF.map(f => item(`${FB(f)}/quiz`, '🔁', `À revoir : ${esc(f.title)}`, 'le quiz de la fiche')).join('')}
        ${dueA ? item('#/anat/quiz', '🦴', `${dueA} repère${dueA > 1 ? 's' : ''} d'anatomie à revoir`, "Je m'interroge") : ''}
        ${nf ? item(`${FB(nf)}`, '🆕', `Nouvelle fiche : ${nf.n}. ${esc(nf.title)}`, perDay ? `pour tout voir avant l'oral : ${perDay} nouvelle${perDay > 1 ? 's' : ''} par jour` : 'lis-la, puis fais son quiz') : ''}
        ${!dueF.length && !dueA && !nf ? '<div class="muted small">Rien à revoir aujourd\'hui. Tire un sujet au sort pour t\'entraîner !</div>' : ''}
      </div>
      <div class="exam">📅 Mon oral : <input type="date" id="examdate" value="${S.exam || ''}" aria-label="Date de mon oral"></div></div>`;
  }

  // ---------- mise à jour : la version de ce téléphone (le ?v= de app.js) contre celle du site (version.json) ----------
  const APP_V = +((document.querySelector('script[src*="app.js"]') || {}).src || '').replace(/.*[?&]v=(\d+).*/, '$1') || 0;
  const latestV = () => fetch('version.json?t=' + Date.now(), { cache: 'no-store' }).then(r => r.json()).then(j => +j.v).catch(() => 0);
  async function applyUpdate() {   // nouveau service worker, caches vidés, puis on recharge : la progression n'est pas touchée
    try { const r = navigator.serviceWorker && await navigator.serviceWorker.getRegistration(); if (r) await r.update(); } catch (e) {}
    try { for (const k of await caches.keys()) await caches.delete(k); } catch (e) {}
    location.reload();
  }
  function upBanner(v) {
    if ($('.upbar') || !v || v <= APP_V) return;
    const d = document.createElement('div'); d.className = 'upbar';
    d.innerHTML = `<span>Une mise à jour est disponible (version ${v}).</span><button class="btn" id="upgo" style="--c:var(--hl)">Mettre à jour</button><button class="upx" id="upx" aria-label="Plus tard">✕</button>`;
    document.body.appendChild(d);
  }
  setTimeout(() => latestV().then(upBanner), 2500);

  // ---------- quoi de neuf : affiché une fois après une mise à jour, seulement à ceux qui utilisaient déjà le site ----------
  // Pour une nouvelle version : ajouter une entrée { v, items } à la fin (v = numéro de version.json).
  const NOTES = [
    { v: 45, theme: true, items: [
      ['✏️', 'Un nouveau look, dessiné comme les vidéos. Tu préfères l\'ancien ? Choisis en bas.'],
      ['🎯', 'Un quiz pour apprendre chaque fiche par cœur : partie par partie, puis toute la fiche de mémoire.'],
      ['🎬', 'La vidéo de chaque fiche, et les dessins des vidéos sur chaque partie.'],
      ['🦴', 'Anatomie : seulement les 59 questions de l\'oral, rangées pied / jambe / cuisse, avec ce qui s\'insère sur chaque os.'],
      ['🧊', 'Le quiz 3D revient, sur les 59 repères.'],
      ['📅', 'Ma séance du jour : la date de ton oral, ce qu\'il faut revoir aujourd\'hui, ton objectif et ta série de jours.'],
      ['🔁', 'Ce que tu apprends revient au bon moment : après 1, 3, 6, 12 puis 25 jours.'],
      ['📖', 'Le lexique des mots compliqués et une recherche dans tout le site.'],
      ['🌙', 'Mode sombre, texte plus grand et code de sauvegarde : dans Réglages, en bas de l\'accueil.'],
      ['✅', 'Ta progression a été gardée.'],
    ] },
    { v: 50, items: [
      ['🩺', 'Nouvel onglet Examen clinique : les 41 tests du guide, rangés en 7 sections.'],
      ['✏️', 'Chaque test a son dessin : comment se placer, où mettre les mains, ce qui bouge.'],
      ['👣', 'Les étapes une par une, les chiffres à retenir, et comment lire le résultat (normal ou positif).'],
      ['▶️', 'Une vidéo pour 13 des tests.'],
      ['🙈', 'Mode test (l\'œil en haut) et « Un test au hasard » pour t\'entraîner.'],
    ] },
    { v: 51, items: [
      ['✏️', 'Examen clinique : tous les dessins des tests ont été refaits, plus clairs, avec les mains du praticien et des gros plans sur le genou, la cheville et le pied.'],
      ['🧢', 'L\'appli s\'appelle Yanoé (Yaya + Noé), et tu peux voir qui l\'a faite : Yaya et Nono, en haut de l\'accueil.'],
    ] },
    { v: 52, items: [
      ['🦶', 'Examen clinique : le bilan du pied, en décharge et en charge, en 15 étapes dans l\'ordre de l\'examen.'],
      ['✏️', 'Chaque étape a son dessin : empreintes au podoscope, griffes, axe du talon, amplitudes, test de Jack…'],
      ['▶️', 'Des vidéos pour 6 étapes, et le mode test (l\'œil en haut) pour réciter.'],
    ] },
    { v: 53, items: [
      ['🦵', 'Nouveau : la podologie ! Les 40 fiches du livret, faites comme celles de pédicurie, à partir des vidéos.'],
      ['✅', 'Déjà prêtes : 1. Atteintes ligamentaires du genou et 2. Les chaussures de l\'enfant, avec leurs dessins, leur quiz et le livret.'],
      ['⏳', 'Les autres arrivent au fur et à mesure des vidéos. Elles sont sur l\'accueil, sous Pédicurie.'],
    ] },
    { v: 55, items: [
      ['🎧', 'Des sons pour réviser : bruit rose, brun, brun profond, blanc, pluie, vagues, feu, ondes alpha. À choisir en bas de l\'accueil.'],
      ['⏯', 'Un mini-lecteur reste à l\'écran : pause, volume ou arrêt à tout moment. Déplace-le avec ⠿, réduis-le avec –. Le son tourne en boucle sans fin.'],
      ['▶️', 'La vidéo de la fiche podologie 2 (chaussures de l\'enfant) est là.'],
    ] },
  ];
  const NOTE_V = NOTES[NOTES.length - 1].v;
  if (!usedBefore && !S.noteV) { S.noteV = NOTE_V; save(); }   // première visite : rien à annoncer
  function showNote() {
    const news = NOTES.filter(n => n.v > (S.noteV || 0));
    if (!news.length || $('.note')) return;
    const d = document.createElement('div'); d.className = 'note';
    d.innerHTML = `<div class="card" role="dialog" aria-label="Quoi de neuf"><div class="kicker">MISE À JOUR</div><h2>Quoi de neuf ?</h2>
      <ul>${news.flatMap(n => n.items).map(([e, t]) => `<li><span>${e}</span><span>${esc(nightly(t))}</span></li>`).join('')}</ul>
      ${news.some(n => n.theme) ? `<div class="row2"><button class="btn grow" data-skin="drawn" style="--c:var(--hl)">Garder le dessiné</button><button class="btn ghost grow" data-skin="classic">L'ancien style</button></div>`
        : `<button class="btn wide" data-note="ok">C'est parti !</button>`}</div>`;
    document.body.appendChild(d);
  }
  const closeNote = () => { S.noteV = NOTE_V; save(); const n = $('.note'); if (n) n.remove(); };

  // ---------- pédicurie ----------
  function pediList() {
    const nP = PEDI.filter(f => doneP(f.id)).length;
    return `<div class="wrap">${top('#/', 'Pédicurie · 24 fiches', count(nP, 24))}
      <div class="row2" style="margin:0 0 12px"><a class="btn ghost grow" href="#/search">🔎 Rechercher</a><a class="btn ghost grow" href="#/lexique">📖 Lexique (${(window.LEXIQUE || []).length})</a></div>
      <div class="entries">${PEDI.map(f => `<a class="entry" href="${FB(f)}">${thumb(ill(f.id, 'cover'), f.title)}
        <span class="rt"><span class="n">${f.n} · ${esc(f.catName)}${S.qz && S.qz[f.id] ? ` · quiz ${S.qz[f.id].last} %` : ''}</span><span class="t">${esc(f.title)}</span>${segs(f)}</span>${doneP(f.id) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`).join('')}</div></div>`;
  }

  // podologie : les 40 fiches du livret ; celles dont la vidéo n'est pas encore finie sont « coming soon »
  function podoList() {
    const nP = PODO_OK.filter(f => doneP(f.id)).length;
    return `<div class="wrap">${top('#/', `Podologie · ${PODO.length} fiches`, count(nP, PODO.length))}
      <div class="muted lead">${PODO_OK.length} fiche${PODO_OK.length > 1 ? 's' : ''} prête${PODO_OK.length > 1 ? 's' : ''} : les autres arrivent au fur et à mesure des vidéos.</div>
      <div class="entries">${PODO.map(f => f.ready ? `<a class="entry" href="${FB(f)}">${hasIll(f) ? thumb(ill(f.id, 'cover'), f.title) : `<span class="stamp xs" style="--c:var(--p8)">${f.n}</span>`}
        <span class="rt"><span class="n">${f.n} · ${esc(f.catName)}${S.qz && S.qz[f.id] ? ` · quiz ${S.qz[f.id].last} %` : ''}</span><span class="t">${esc(f.title)}</span>${segs(f)}</span>${doneP(f.id) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`
        : `<div class="entry soon"><span class="stamp xs">${f.n}</span><span class="rt"><span class="t">${esc(f.title)}</span><span class="n">⏳ Coming soon</span></span></div>`).join('')}</div></div>`;
  }

  // la fiche : où j'en suis, le bouton pour continuer, les outils, puis le plan
  function fiche(f) {
    const n = f.parts.length, k = nSeen(f), nextK = (f.parts.findIndex((_, i) => !seenP(f, i + 1)) + 1) || 1;
    if (!S.last || S.last.id !== f.id) { S.last = { id: f.id, k: 0 }; save(); }
    const tool = (href, em, label) => `<a class="tool" href="${href}"><span class="em">${em}</span><span>${label}</span></a>`;
    const L = LISTOF(f), i = L.indexOf(f), a = L[i - 1], b = L[i + 1];
    return `<div class="wrap">${top('#/' + (f.sec || 'pedi'), `Fiche ${f.n} / ${NTOT(f)} · ${esc(f.catName)}`, count(k, n))}
      <div class="fhead">${hasIll(f) ? `<span class="drawn th zoomable">${img(ill(f.id, 'cover'), f.title)}</span>` : `<span class="stamp" style="--c:var(--p8)">${f.n}</span>`}<div class="rt"><h1>${esc(f.title)}</h1>${segs(f)}<span class="s">${doneP(f.id) ? '✓ fiche sue' : `${k} partie${k > 1 ? 's' : ''} lue${k > 1 ? 's' : ''} sur ${n}`}</span></div></div>
      <a class="btn wide" href="${FB(f)}/p${nextK}">${k === 0 ? 'Commencer la fiche' : k === n ? 'Revoir depuis le début' : `Continuer : partie ${nextK}`} →</a>
      <a class="btn wide quizbtn" href="${FB(f)}/quiz" style="--c:var(--p5)">🎯 Apprendre la fiche : quiz${S.qz && S.qz[f.id] ? ` · dernier ${S.qz[f.id].last} %` : ''}</a>
      ${dueIn('f:' + f.id) != null ? `<div class="muted small center-t">${dueIn('f:' + f.id) <= 0 ? '🔁 À revoir aujourd\'hui' : `🔁 Prochaine révision dans ${dueIn('f:' + f.id)} jour${dueIn('f:' + f.id) > 1 ? 's' : ''}`}</div>` : ''}
      <div class="tools">
        ${VIDEOS[f.id] ? tool(`${FB(f)}/video`, '▶️', 'Vidéo') : ''}
        ${tool(`${FB(f)}/memo`, '📝', 'Mots-clés')}
        ${f.photos.length ? tool(`${FB(f)}/photos`, '📷', 'Photos') : ''}
        ${f.livret ? tool(`${FB(f)}/livret`, '📖', 'Livret') : ''}
      </div>
      <div class="sec">${esc(f.planTitle || 'LE PLAN EN ' + n + ' PARTIES').toUpperCase()}</div>
      <div class="entries">${f.parts.map((p, j) => `<a class="entry part-e" href="${FB(f)}/p${j + 1}" style="--c:${PCOL(j)}"><span class="stamp xs">${j + 1}</span>
        <span class="rt"><span class="t">${esc(p.title)}</span><span class="q">${esc(p.q)}</span></span>${hasIll(f) ? thumb(ill(f.id, `p${j + 1}b`), p.title) : ''}${seenP(f, j + 1) ? '<span class="ok">✓</span>' : ''}</a>`).join('')}</div>
      <button class="btn wide ${doneP(f.id) ? 'ghost' : ''}" id="done" style="--c:var(--p6);margin-top:18px">${doneP(f.id) ? 'Je dois encore la revoir' : '✓ Je la connais'}</button>
      <div class="pair">${a ? `<a href="${FB(a)}">← Fiche ${a.n}</a>` : '<span></span>'}${b ? `<a href="${FB(b)}">Fiche ${b.n} →</a>` : ''}</div></div>`;
  }

  // une partie = un écran : le dessin de la vidéo, les points clés, ce que je dis
  function part(f, k) {
    const p = f.parts[k - 1], n = f.parts.length, c = PCOL(k - 1);
    if (!p) return fiche(f);
    const st = S.pedi[f.id] = S.pedi[f.id] || {};
    st.seen = st.seen || []; if (!st.seen.includes(k)) st.seen.push(k);
    if (!(S.last && S.last.id === f.id && S.last.k === k)) did(1);
    S.last = { id: f.id, k }; save();
    const prev = k > 1 ? `${FB(f)}/p${k - 1}` : `${FB(f)}`, next = k < n ? `${FB(f)}/p${k + 1}` : `${FB(f)}/memo`;
    return `<div class="wrap ${S.revise ? 'revise' : ''}">${top(`${FB(f)}`, `${f.n}. ${esc(f.title)}`, `<button class="eye" id="revise" aria-pressed="${!!S.revise}" title="Me tester : cacher les réponses">${S.revise ? '🙈' : '👁'}</button>`)}
      <nav class="segnav">${f.parts.map((_, i) => `<a href="${FB(f)}/p${i + 1}" class="${i + 1 === k ? 'on' : seenP(f, i + 1) ? 'seen' : ''}" style="--c:${PCOL(i)}">${i + 1}</a>`).join('')}</nav>
      <section class="part solo" style="--c:${c}">
        <header><span class="stamp sm">${k}</span><div><h2>${esc(p.title)}</h2><span class="q">${esc(p.q)}</span></div></header>
        ${hasIll(f) ? `<figure class="drawn slide">${img(ill(f.id, `p${k}b`), p.title + ' : dessin de la vidéo', 'crop')}</figure>` : ''}
        ${S.revise ? '<div class="hint">🙈 Mode test : récite, puis touche une ligne pour la voir. (👁 en haut pour tout afficher)</div>' : ''}
        <div class="body">${blocks(p.blocks)}</div>
        <details class="say"><summary>🗣 Ce que je dis à l'oral</summary><p>${md(p.say)}</p></details>
        <a class="btn ghost wide" href="${FB(f)}/quiz/${k}" style="margin-top:14px">🎯 Me tester sur cette partie</a>
      </section>
      ${pager(prev, `<a class="btn grow" href="${next}" style="--c:${k < n ? PCOL(k) : 'var(--hl)'}">${k < n ? `Partie ${k + 1}` : 'Mots-clés'} →</a>`, next)}</div>`;
  }

  function memo(f) {
    const n = f.parts.length;
    return `<div class="wrap">${top(`${FB(f)}`, `${f.n}. ${esc(f.title)} · mots-clés`)}<div class="muted lead">Une ligne par partie : récite à partir des mots-clés.</div>
      <div class="sheet">${f.memo.map((r, i) => `<a class="row" href="${FB(f)}/p${i + 1}"><span class="n" style="color:${PCOL(i)}">${i + 1}.</span><span class="qq">${esc(r.q)}</span><span class="k"><span class="hl">${md(r.k)}</span></span></a>`).join('')}</div>
      ${pager(`${FB(f)}/p${n}`, `<a class="btn grow" href="${FB(f)}/quiz" style="--c:var(--p5)">Quiz →</a>`, `${FB(f)}/quiz`)}</div>`;
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
    const back = key === 'all' ? `${FB(f)}` : `${FB(f)}/p${key}`;
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
    if (Q.full && !Q.saved) { const z = S.qz = S.qz || {}, o = z[f.id] || {}; z[f.id] = { last: pc(v), best: Math.max(o.best || 0, pc(v)), at: Date.now() }; Q.saved = true; review('f:' + f.id, v >= 0.8); did(4); }
    const msg = v >= 0.9 ? 'Tu la connais ! Refais-la demain pour la garder.' : v >= 0.6 ? 'Presque : refais les parties en rouge.' : 'Normal au début : refais les parties en rouge, puis recommence demain.';
    return `<div class="card qend">${ring(v, v >= 0.9 ? 'var(--p6)' : v >= 0.6 ? 'var(--p4)' : 'var(--red)')}<div class="question">${msg}</div></div>
      <div class="entries">${parts.map(p => { const r = Q.res[p], x = r.ok / r.tot; return `<a class="entry part-e" href="${FB(f)}/p${p}" style="--c:${PCOL(p - 1)}"><span class="stamp xs">${p}</span><span class="rt"><span class="t">${esc(f.parts[p - 1].title)}</span>${bar(x, x >= 0.8 ? 'var(--p6)' : 'var(--red)')}</span>${x >= 0.8 ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`; }).join('')}</div>
      <div class="pager fixed">${weak.length ? `<button class="btn grow" data-qa="weak" data-w="${weak.join(',')}" style="--c:var(--hl)">↻ Refaire ${weak.length > 1 ? 'les ' + weak.length + ' parties ratées' : 'la partie ratée'}</button>` : `<button class="btn grow" data-qa="again" style="--c:var(--hl)">↻ Recommencer</button>`}<a class="btn ghost grow" href="${FB(f)}">Fiche</a></div>`;
  }
  function quizAct(t) {
    const st = Q && Q.steps[Q.i], j = +t.dataset.j, f = ALLF.find(x => x.id === Q.id);
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
    return `<div class="wrap">${top(`${FB(f)}`, `${f.n}. ${esc(f.title)} · vidéo`)}
      ${frame(VIDEOS[f.id], 'Vidéo de la fiche', hasIll(f) ? ill(f.id, 'cover') : '')}
      <div class="muted lead" style="margin-top:12px">Regarde-la une fois en entier, puis reprends partie par partie.</div>
      <a class="btn wide" href="${FB(f)}/p1">Partie 1 →</a></div>`;
  }
  function photos(f) {
    return `<div class="wrap">${top(`${FB(f)}`, `${f.n}. ${esc(f.title)} · photos`)}<div class="photos">${f.photos.map(p => `<figure class="photo"><img loading="lazy" src="${p.src}" alt="${esc(p.cap)}" ${RETRY}><figcaption>${esc(p.cap)}<small>${p.ln ? `<a href="${p.ln}" target="_blank" rel="noopener">${esc(p.cr)}</a>` : esc(p.cr)}</small></figcaption></figure>`).join('')}</div></div>`;
  }
  function livret(f) {
    return `<div class="wrap">${top(`${FB(f)}`, `${f.n}. ${esc(f.title)} · livret`)}<div class="livret">${f.livret}</div></div>`;
  }
  function pedi(id, sub, c, sec = 'pedi') {
    const f = (sec === 'podo' ? PODO_OK : PEDI).find(x => x.id === id);
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
      <div class="row2"><a class="btn grow" href="#/anat/quiz" style="--c:var(--hl)">🎯 Je m'interroge</a><a class="btn grow" href="#/anat/3d" style="--c:var(--p8);color:#fff">🧊 Quiz 3D</a></div>`;
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
    if (!card) { const due = dueKeys('a:').map(Number), pool = due.length ? AQ.filter(x => due.includes(x.q)) : AQ.filter(x => !doneA(x.q)); const src = pool.length ? pool : AQ; card = src[Math.floor(Math.random() * src.length)]; shown = false; }
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
      <div class="quick"><button class="qb" id="drawP" style="--c:var(--p6)"><span class="em">🎲</span><span class="t">Un sujet de pédicurie</span></button>${PODO_OK.length ? `<button class="qb" id="drawO" style="--c:var(--p8)"><span class="em">🎲</span><span class="t">Un sujet de podologie</span><span class="s">parmi les ${PODO_OK.length} fiches prêtes</span></button>` : ''}<button class="qb" id="drawA" style="--c:var(--p1)"><span class="em">🎲</span><span class="t">5 repères à palper</span></button></div>
      ${d && d.kind === 'p' ? `<a class="card draw" href="${FB(d.f)}"><span class="stamp">${d.f.n}</span><div class="big">${esc(d.f.title)}</div><div class="muted">Touche pour ouvrir la fiche</div></a>` : ''}
      ${d && d.kind === 'a' ? `<div class="entries" style="margin-top:16px">${d.list.map(x => `<a class="entry" href="#/anat/${x.q}" style="--c:${RCOL[x.reg]}">${zoomThumb(x, 52)}<span class="rt"><span class="n">Question ${x.q} · ${REG_SHORT[x.reg]}</span><span class="t">${esc(x.name)}</span></span><span class="chev">›</span></a>`).join('')}</div>` : ''}</div>`;
  }

  // ---------- examen clinique : les 41 tests (data/clinique.js), rangés en 7 sections ----------
  const CL = window.CLIN || [], CS = window.CLIN_S || [];
  const SCOL = s => PCOL(s);
  const doneC = i => !!(S.clin && S.clin[i]);
  const nC = list => list.filter(x => doneC(CL.indexOf(x) + 1)).length;
  // dessins des tests : data/clinique-dessins.js
  const pic = (n, cls = 'cpic') => `<svg class="${cls}" viewBox="0 0 240 150" aria-hidden="true">${window.CLIN_PIC ? window.CLIN_PIC(n) : ''}</svg>`;

  function clinHub() {
    const kb = nB(BL);
    return `<div class="wrap">${top('#/', 'Examen clinique', count(nC(CL) + kb, CL.length + BL.length))}
      <div class="sec">LE BILAN DU PIED · ${BL.length} ÉTAPES</div>
      <a class="entry" href="#/clin/b" style="--c:var(--p5)"><span class="cthumb">${bpic(12, 'mini')}</span><span class="rt"><span class="t">Le bilan du pied, en décharge et en charge</span><span class="n">${kb}/${BL.length} étapes sues</span>${bar(kb / BL.length, 'var(--p5)')}</span><span class="chev">›</span></a>
      <div class="sec">LES ${CL.length} TESTS · ${CS.length} SECTIONS</div>
      <button class="btn wide" id="crand" style="--c:var(--hl);margin-bottom:10px">🎯 Un test au hasard, réponses cachées</button>
      <div class="entries">${CS.map((s, i) => { const it = CL.filter(x => x.s === i), k = nC(it);
        return `<a class="entry" href="#/clin/s${i + 1}" style="--c:${SCOL(i)}"><span class="stamp xs cem">${s.e}</span><span class="rt"><span class="t">${esc(s.t)}</span><span class="n">${k}/${it.length} tests sus</span>${bar(k / it.length, SCOL(i))}</span><span class="chev">›</span></a>`; }).join('')}</div></div>`;
  }
  function clinSec(i) {
    const s = CS[i]; if (!s) return notFound();
    const it = CL.filter(x => x.s === i);
    return `<div class="wrap">${top('#/clin', `${s.e} ${esc(s.t)}`, count(nC(it), it.length))}
      <div class="muted lead">${esc(s.intro)}</div>
      <div class="entries">${it.map(x => { const n = CL.indexOf(x) + 1;
        return `<a class="entry" href="#/clin/${n}" style="--c:${SCOL(i)}"><span class="cthumb">${pic(n, 'mini')}</span><span class="rt"><span class="n">TEST ${n}${x.yt ? ' · ▶ vidéo' : ''}</span><span class="t">${esc(x.n)}</span><span class="s">${esc(x.cherche)}</span></span>${doneC(n) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`; }).join('')}</div>
      ${i === 5 ? `<div class="sec">GRADE DU RISQUE PODOLOGIQUE (HAS)</div><div class="card hasg">${(window.CLIN_HAS || []).map(([g, t]) => `<div><b class="g${g}">${g}</b><span>${esc(t)}</span></div>`).join('')}<div class="muted small">Le pédicure-podologue peut poser lui-même ce grade.</div></div>` : ''}
      <div class="pair">${i > 0 ? `<a href="#/clin/s${i}">← ${esc(CS[i - 1].t)}</a>` : '<span></span>'}${i < CS.length - 1 ? `<a href="#/clin/s${i + 2}">${esc(CS[i + 1].t)} →</a>` : ''}</div></div>`;
  }
  function clinTest(n) {
    const x = CL[n - 1]; if (!x) return notFound();
    const c = SCOL(x.s), s = CS[x.s];
    return `<div class="wrap ${S.revise ? 'revise' : ''}">${top(`#/clin/s${x.s + 1}`, `${s.e} ${esc(s.t)}`, `<button class="eye" id="revise" aria-pressed="${!!S.revise}" title="Me tester : cacher les réponses">${S.revise ? '🙈' : '👁'}</button>`)}
      <section class="part solo ctest" style="--c:${c}">
        <figure class="chero">${pic(n)}${x.yt ? `<button class="cvid" data-vid="${x.yt}" data-yt="1" data-src="https://www.piriforme.fr/bdd/orthopedie/${x.src}">▶ Voir le test en vidéo</button>` : ''}</figure><div class="chead"><div class="rt"><div class="n" style="color:${c}">TEST ${n} / ${CL.length}</div><h1>${esc(x.n)}</h1><div class="cq">🎯 ${esc(x.cherche)}</div></div></div>
        ${S.revise ? '<div class="hint">🙈 Mode test : dis comment tu fais le test, puis touche une ligne pour la voir. (👁 en haut pour tout afficher)</div>' : ''}
        <div class="body"><div class="h">Installation</div><ul class="who"><li><span class="em">🧍</span><span><span class="lab">Patient</span>${md(x.pat)}</span></li><li><span class="em">🩺</span><span><span class="lab">Praticien</span>${md(x.prat)}</span></li></ul></div>
        <div class="body"><div class="h">Comment faire</div><ol class="steps">${x.steps.map(t => `<li>${md(t)}</li>`).join('')}</ol>
          ${x.key && x.key.length ? `<div class="chips">${x.key.map(k => `<span class="chip">${esc(k)}</span>`).join('')}</div>` : ''}</div>
        <div class="body"><div class="h">Lire le résultat</div><ul class="res"><li class="okr"><span class="lab">Normal</span>${md(x.norm)}</li>${x.pos.map(([a, b]) => `<li class="kor"><span class="lab">${md(a)}</span>→ ${md(b)}</li>`).join('')}</ul>
          ${x.extra ? `<div class="muted small" style="margin-top:8px">${md(x.extra)}</div>` : ''}</div>
        ${x.tip ? `<div class="ctip">💡 ${md(x.tip)}</div>` : ''}
      </section>
      ${pager(n > 1 ? `#/clin/${n - 1}` : '', `<button class="btn grow ${doneC(n) ? 'ghost' : ''}" id="cknow" style="--c:var(--p6)">${doneC(n) ? '✓ Su · à revoir ?' : 'Je sais le faire'}</button>`, n < CL.length ? `#/clin/${n + 1}` : '')}</div>`;
  }

  // ---------- le bilan du pied (data/bilan.js), dans l'ordre de l'examen ----------
  const BL = window.BILAN || [], BG = window.BILAN_G || [];
  const doneB = i => !!(S.bil && S.bil[i]), nB = list => list.filter(x => doneB(BL.indexOf(x) + 1)).length;
  const bpic = (n, cls = 'cpic') => `<svg class="${cls}" viewBox="0 0 240 150" aria-hidden="true">${window.BILAN_PIC ? window.BILAN_PIC(n) : ''}</svg>`;
  const BCOL = g => ['var(--p3)', 'var(--p5)', 'var(--p4)', 'var(--p7)'][g];
  function bilanList() {
    return `<div class="wrap">${top('#/clin', 'Le bilan du pied', count(nB(BL), BL.length))}
      <div class="muted lead">L'examen du pied dans l'ordre : on écoute, on examine assis ou allongé, puis debout, puis on fait bouger.</div>
      ${BG.map((g, i) => { const it = BL.filter(x => x.g === i); return `<div class="sec" style="color:${BCOL(i)}">${g.e} ${esc(g.t).toUpperCase()}</div>
        <div class="entries">${it.map(x => { const n = BL.indexOf(x) + 1;
          return `<a class="entry" href="#/clin/b/${n}" style="--c:${BCOL(i)}"><span class="cthumb">${bpic(n, 'mini')}</span><span class="rt"><span class="n">ÉTAPE ${n}${x.yt ? ' · ▶ vidéo' : ''}</span><span class="t">${esc(x.n)}</span><span class="s">${esc(x.why)}</span></span>${doneB(n) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`; }).join('')}</div>`; }).join('')}</div>`;
  }
  const bBlock = x => `<div class="body"><div class="h">${esc(x.h)}</div>${x.p ? `<p class="bp">${md(x.p)}</p>` : ''}` +
    (x.kv ? `<ul class="who">${x.kv.map(([a, b]) => `<li><span><span class="lab">${md(a)}</span>${md(b)}</span></li>`).join('')}</ul>` : '') +
    (x.li ? `<ul class="notes">${x.li.map(t => `<li>${md(t)}</li>`).join('')}</ul>` : '') +
    (x.steps ? `<ol class="steps">${x.steps.map(t => `<li>${md(t)}</li>`).join('')}</ol>` : '') +
    (x.table ? `<table class="ctab">${x.head ? `<tr>${x.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr>` : ''}${x.table.map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</table>` : '') +
    (x.res ? `<ul class="res">${x.res.map(([k, a, b]) => `<li class="${k === 'ok' ? 'okr' : k === 'mid' ? 'midr' : 'kor'}"><span class="lab">${md(a)}</span>${b ? '→ ' + md(b) : ''}</li>`).join('')}</ul>` : '') + '</div>';
  function bilanStep(n) {
    const x = BL[n - 1]; if (!x) return notFound();
    const c = BCOL(x.g), g = BG[x.g];
    return `<div class="wrap ${S.revise ? 'revise' : ''}">${top('#/clin/b', `${g.e} ${esc(g.t)}`, `<button class="eye" id="revise" aria-pressed="${!!S.revise}" title="Me tester : cacher les réponses">${S.revise ? '🙈' : '👁'}</button>`)}
      <section class="part solo ctest" style="--c:${c}">
        <figure class="chero">${bpic(n)}${x.yt ? `<button class="cvid" data-vid="${x.yt}" data-yt="1" data-src="https://www.youtube.com/watch?v=${x.yt}" data-lab="Voir sur YouTube">▶ Voir en vidéo</button>` : ''}</figure>
        <div class="chead"><div class="rt"><div class="n" style="color:${c}">ÉTAPE ${n} / ${BL.length}</div><h1>${esc(x.n)}</h1><div class="cq">🎯 ${esc(x.why)}</div></div></div>
        ${S.revise ? '<div class="hint">🙈 Mode test : récite l\'étape, puis touche une ligne pour la voir. (👁 en haut pour tout afficher)</div>' : ''}
        ${x.pos ? `<div class="body"><div class="h">Installation</div><ul class="who"><li><span class="em">🧍</span><span>${md(x.pos)}</span></li></ul></div>` : ''}
        ${x.b.map(bBlock).join('')}
        ${x.key ? `<div class="chips">${x.key.map(k => `<span class="chip">${esc(k)}</span>`).join('')}</div>` : ''}
        ${x.tip ? `<div class="ctip">💡 ${md(x.tip)}</div>` : ''}
      </section>
      ${pager(n > 1 ? `#/clin/b/${n - 1}` : '#/clin/b', `<button class="btn grow ${doneB(n) ? 'ghost' : ''}" id="bknow" style="--c:var(--p6)">${doneB(n) ? '✓ Su · à revoir ?' : 'Je la connais'}</button>`, n < BL.length ? `#/clin/b/${n + 1}` : '')}</div>`;
  }

  // ---------- lexique et recherche : la liste se met à jour pendant qu'on tape, sans redessiner la page ----------
  const norm = x => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const LEX = window.LEXIQUE || [];
  function lexique() {
    return `<div class="wrap">${top('#/pedi', 'Lexique des mots compliqués', `<span class="count">${LEX.length}</span>`)}
      <input class="search" id="lexq" type="search" placeholder="Chercher un mot…" autocomplete="off"><div id="lexres">${lexRows('')}</div></div>`;
  }
  const lexRows = q => { const n = norm(q), r = LEX.filter(([w, d]) => !n || norm(w).includes(n) || norm(d).includes(n));
    return r.length ? `<dl class="lex">${r.map(([w, d]) => `<dt>${esc(w)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>` : '<div class="empty">Aucun mot trouvé.</div>'; };
  function search() {
    return `<div class="wrap">${top('#/pedi', 'Rechercher')}<input class="search" id="sq" type="search" placeholder="verrue, ongle, Raynaud, monofilament…" autocomplete="off">
      <div id="sres"><div class="muted small">Cherche dans les fiches de pédicurie et de podologie, les 59 repères d'anatomie, les tests d'examen clinique et le lexique.</div></div></div>`;
  }
  function searchRows(q) {
    const n = norm(q.trim()); if (n.length < 2) return '<div class="muted small">Tape au moins 2 lettres.</div>';
    const snip = (txt, k = 70) => { const t = String(txt).replace(/\*\*/g, ''), i = norm(t).indexOf(n); if (i < 0) return ''; const a = Math.max(0, i - k); return (a ? '…' : '') + esc(t.slice(a, i)) + '<mark>' + esc(t.slice(i, i + n.length)) + '</mark>' + esc(t.slice(i + n.length, i + n.length + k)) + '…'; };
    const out = [];
    for (const f of ALLF) {
      if (norm(f.title).includes(n)) out.push(`<a class="entry" href="${FB(f)}">${hasIll(f) ? thumb(ill(f.id, 'cover'), f.title) : ''}<span class="rt"><span class="n">${SECN(f).toUpperCase()} · FICHE ${f.n}</span><span class="t">${esc(f.title)}</span></span><span class="chev">›</span></a>`);
      f.parts.forEach((p, i) => { const sn = snip(p.say); if (sn) out.push(`<a class="entry part-e" href="${FB(f)}/p${i + 1}" style="--c:${PCOL(i)}"><span class="stamp xs">${i + 1}</span><span class="rt"><span class="n">${f.n}. ${esc(f.title)} · ${esc(p.title)}</span><span class="s">${sn}</span></span></a>`); });
    }
    for (const x of AQ) if (norm(x.name).includes(n) || norm(x.how || '').includes(n)) out.push(`<a class="entry" href="#/anat/${x.q}" style="--c:${RCOL[x.reg]}">${zoomThumb(x, 44)}<span class="rt"><span class="n">ANATOMIE · Q${x.q}</span><span class="t">${esc(x.name)}</span></span><span class="chev">›</span></a>`);
    CL.forEach((x, i) => { if (norm(x.n).includes(n) || norm(x.cherche).includes(n)) out.push(`<a class="entry" href="#/clin/${i + 1}" style="--c:${SCOL(x.s)}"><span class="cthumb">${pic(i + 1, 'mini')}</span><span class="rt"><span class="n">EXAMEN CLINIQUE · TEST ${i + 1}</span><span class="t">${esc(x.n)}</span></span><span class="chev">›</span></a>`); });
    BL.forEach((x, i) => { if (norm(x.n).includes(n) || norm(x.why).includes(n)) out.push(`<a class="entry" href="#/clin/b/${i + 1}" style="--c:${BCOL(x.g)}"><span class="cthumb">${bpic(i + 1, 'mini')}</span><span class="rt"><span class="n">BILAN DU PIED · ÉTAPE ${i + 1}</span><span class="t">${esc(x.n)}</span></span><span class="chev">›</span></a>`); });
    const lx = LEX.filter(([w]) => norm(w).includes(n));
    return (lx.length ? `<dl class="lex">${lx.map(([w, d]) => `<dt>${esc(w)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>` : '') +
      (out.length ? `<div class="entries">${out.slice(0, 60).join('')}</div>` : lx.length ? '' : '<div class="empty">Rien trouvé.</div>');
  }
  document.addEventListener('input', e => {
    if (e.target.id === 'lexq') $('#lexres').innerHTML = lexRows(e.target.value);
    if (e.target.id === 'sq') $('#sres').innerHTML = searchRows(e.target.value);
  });
  document.addEventListener('change', e => { if (e.target.id === 'examdate') { S.exam = e.target.value || ''; save(); render(); } });

  const notFound = () => `<div class="wrap">${top('#/', 'Introuvable')}<div class="empty">Cette page n'existe pas.</div></div>`;

  // ---------- quiz 3D : retrouver les 59 repères sur le modèle du membre inférieur droit ----------
  // Modèle BodyParts3D (© DBCLS, CC BY-SA 2.1 JP) ; cibles calculées par tools/build-anat3d.js (data/anat3d.js).
  // La page n'est dessinée qu'une fois (le modèle reste chargé) : seul le panneau du bas change.
  const L3 = { os: ['Os', '#E9DEC4'], m3: ['Profonds', '#8E3036'], m2: ['Moyens', '#A93C40'], m1: ['Superficiels', '#C2504D'] };
  let Q3 = null, V3 = null;
  const on3 = () => (S.v3on = S.v3on || { os: 1, m3: 1, m2: 1, m1: 1 });
  const stat3 = q => (S.a3 || {})[q] || { ok: 0, ko: 0 };
  function quiz3d() {
    Q3 = Q3 || { st: 'pick' };
    return `<div class="v3"><canvas id="v3c" aria-label="Modèle 3D du membre inférieur droit : glisse pour tourner, pince pour zoomer"></canvas>
      <div class="v3load" id="v3load">Chargement du modèle 3D…</div><div id="v3mk"></div>
      ${top('#/anat', 'Quiz 3D · les 59 repères', `<span class="count" id="v3n"></span>`)}
      <div class="v3chips">${Object.entries(L3).map(([k, [l, c]]) => `<button class="v3l ${on3()[k] ? 'on' : ''}" data-v3l="${k}"><i style="background:${c}"></i>${l}</button>`).join('')}</div>
      <div class="v3sheet" id="v3sheet">${sheet3()}</div></div>`;
  }
  function sheet3() {
    const x = Q3.list && Q3.list[Q3.i], b = (a, t, c = 'var(--hl)', cls = 'grow') => `<button class="btn ${cls}" data-q3="${a}" style="--c:${c}">${t}</button>`;
    if (Q3.st === 'pick') return `<div class="kicker">TROUVE-LES SUR LE MODÈLE</div><div class="muted small">Glisse pour tourner, pince pour zoomer. Enlève des couches en haut pour atteindre les muscles profonds.</div>
      <div class="regpick">${['tout', ...REG_ORDER].map(r => { const it = r === 'tout' ? AQ : AQ.filter(a => a.reg === r); return `<button class="btn ghost" data-q3="go" data-r="${r}">${r === 'tout' ? 'Tout' : REG_SHORT[r]} <small>${it.length}</small></button>`; }).join('')}</div>`;
    if (Q3.st === 'end') { const n = Q3.list.length, miss = Q3.list.filter(a => !Q3.res[a.q]);
      return `<div class="qend">${ring(Q3.ok / n, Q3.ok / n >= .8 ? 'var(--p6)' : 'var(--p4)')}<div><div class="question">${Q3.ok} / ${n} trouvés</div>${miss.length ? `<div class="muted small">À revoir : ${miss.map(a => `<a href="#/anat/${a.q}">${esc(a.name)}</a>`).join(', ')}</div>` : ''}</div></div>
        <div class="row2">${b('again', '↻ Rejouer')}${b('pick', 'Autre région', 'var(--card)')}</div>`; }
    const head = `<div class="kicker">${esc(REG_SHORT[x.reg]).toUpperCase()} · ${x.group === 'Os' ? 'OS' : 'MUSCLE / TENDON'} · Q${x.q}</div>`;
    if (Q3.st === 'q') return `${head}<div class="question">Touche : ${esc(x.name)}</div>
      <div class="row2">${b('help', '💡 La zone', 'var(--card)')}${b('skip', 'Je ne sais pas', 'var(--card)')}</div>`;
    return `${head}<div class="question">${Q3.good ? '✓ Bien vu : ' : '✗ '}${esc(x.name)}</div>${!Q3.good && Q3.hit ? `<div class="muted small">Tu as touché : ${esc(Q3.hit)}</div>` : ''}
      <div class="small">${md(x.how || '')}</div><div class="row2"><a class="btn ghost grow" href="#/anat/${x.q}">La fiche</a>${b('next', Q3.i + 1 < Q3.list.length ? 'Suivant →' : 'Résultat')}</div>`;
  }
  function upd3() { const s = $('#v3sheet'), n = $('#v3n'); if (s) s.innerHTML = sheet3(); if (n) n.textContent = Q3.list && Q3.st !== 'pick' && Q3.st !== 'end' ? `${Q3.i + 1}/${Q3.list.length}` : ''; if (V3) V3.mark(); }
  function q3Start(r) {
    const pool = (r === 'tout' ? AQ : AQ.filter(a => a.reg === r)).map(a => [stat3(a.q).ok > stat3(a.q).ko ? 1 : 0, Math.random(), a]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(a => a[2]);
    Q3 = { st: 'q', reg: r, list: pool.slice(0, 10), i: 0, ok: 0, res: {} };
    if (V3) V3.home();
  }
  function q3Answer(good, hit) {
    const x = Q3.list[Q3.i], a3 = S.a3 = S.a3 || {}, r = a3[x.q] = a3[x.q] || { ok: 0, ko: 0 };
    good ? r.ok++ : r.ko++; review('a:' + x.q, good);
    Object.assign(Q3, { st: 'a', good, hit }); if (good) { Q3.ok++; Q3.res[x.q] = 1; }
    if (V3) V3.show(x.q);
    upd3();
  }
  function q3Act(t) {
    const a = t.dataset.q3;
    if (a === 'go') q3Start(t.dataset.r);
    else if (a === 'again') q3Start(Q3.reg);
    else if (a === 'pick') Q3 = { st: 'pick' };
    else if (a === 'help') { if (V3) V3.show(Q3.list[Q3.i].q, true); return; }
    else if (a === 'skip') return q3Answer(false, null);
    else if (a === 'next') { Q3.i++; Object.assign(Q3, Q3.i < Q3.list.length ? { st: 'q', hit: null } : { st: 'end' }); if (V3) V3.home(); }
    upd3();
  }
  async function start3d() {
    const cv = $('#v3c'); if (!cv) return;
    try {
      const [T, buf] = await Promise.all([import('./vendor/three-mini.js'), fetch('anat/jambe3d.bin').then(r => { if (!r.ok) throw new Error('modèle'); return r.arrayBuffer(); })]);
      if (!document.body.contains(cv)) return;
      V3 = make3d(T, buf, cv); const l = $('#v3load'); if (l) l.remove(); upd3();
    } catch (e) { const l = $('#v3load'); if (l) l.textContent = 'Impossible de charger le modèle 3D : vérifie ta connexion, puis rouvre la page.'; }
  }
  function make3d(T, buf, cv) {
    const stage = cv.parentNode, mk = $('#v3mk');
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, .01, 20);
    scene.add(new T.HemisphereLight(0xfff6ea, 0x6d5b55, 1.15));
    const d1 = new T.DirectionalLight(0xffffff, 1.6); d1.position.set(1.5, 2, 2.5); scene.add(d1);
    const d2 = new T.DirectionalLight(0xffe2cf, .7); d2.position.set(-2, .5, -2); scene.add(d2);
    const ctl = new T.OrbitControls(cam, cv); ctl.enableDamping = true; ctl.dampingFactor = .09; ctl.minDistance = .06; ctl.maxDistance = 4;
    const grp = new T.Group(); scene.add(grp);
    const dv = new DataView(buf), meshes = [], byKey = {};
    window.ANAT3D.forEach(([key, fr, layer, vo, vc, io, ic, isz]) => {
      if (!L3[layer]) return;   // artères et veines : pas dans les 59
      const p = new Float32Array(vc * 3); for (let i = 0; i < vc * 3; i++) p[i] = dv.getInt16(vo + i * 2, true) / 32767 * .5;
      const idx = isz === 4 ? new Uint32Array(buf.slice(io, io + ic * 4)) : new Uint16Array(buf.slice(io, io + ic * 2));
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(p, 3)); g.setIndex(new T.BufferAttribute(idx, 1)); g.computeVertexNormals(); g.computeBoundingSphere();
      const c = new T.Color(/^(achille|tractus-it)$/.test(key) ? '#E2DACB' : L3[layer][1]);
      if (layer !== 'os') c.offsetHSL(((meshes.length * 37) % 11 - 5) * .004, 0, ((meshes.length * 53) % 9 - 4) * .018);
      const mat = new T.MeshStandardMaterial({ color: c, roughness: layer === 'os' ? .82 : .55, metalness: 0, side: T.DoubleSide });
      const m = new T.Mesh(g, mat); m.userData = { key, fr, layer, mat }; grp.add(m); meshes.push(m); byKey[key] = m;
    });
    const box = new T.Box3().setFromObject(grp), size = box.getSize(new T.Vector3());
    grp.position.sub(box.getCenter(new T.Vector3())); grp.updateMatrixWorld(true);
    const mat = (c, e) => new T.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: .45, roughness: .45, side: T.DoubleSide });
    const mGood = mat(0x2FB36B, 0x0b5a2c), mBad = mat(0xE04A3F, 0x6a120c);
    const layers = () => meshes.forEach(m => (m.visible = !!on3()[m.userData.layer]));
    layers();
    let W = 1, H = 1;
    const fit = () => { W = stage.clientWidth; H = stage.clientHeight; renderer.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); };
    const ro = new ResizeObserver(fit); ro.observe(stage); fit();
    const full = () => size.y * .62 / Math.tan(cam.fov * Math.PI / 360);
    let anim = null;
    const fly = (pos, tgt) => { const p0 = cam.position.clone(), t0 = ctl.target.clone(), s0 = performance.now();
      anim = now => { const k = Math.min(1, (now - s0) / 650), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; cam.position.lerpVectors(p0, pos, e); ctl.target.lerpVectors(t0, tgt, e); if (k >= 1) anim = null; }; };
    cam.position.set(0, 0, full()); ctl.target.set(0, 0, 0); ctl.update();
    // cible d'une question : centre des pièces, ou point sur l'os
    const T3 = window.ANAT3D_T, R0 = .03;
    const tgtOf = q => { const t = T3[q];
      if (t.p) return { c: grp.localToWorld(new T.Vector3(...t.p)), r: .06 };
      const ms = t.m.map(k => byKey[k]).filter(Boolean), c = new T.Vector3();
      ms.forEach(m => c.add(m.geometry.boundingSphere.center.clone().applyMatrix4(m.matrixWorld))); c.divideScalar(ms.length);
      return { c, r: Math.max(...ms.map(m => m.geometry.boundingSphere.radius)) }; };
    const pts = [];   // repères affichés : { v: Vector3, cls }
    const reset = () => { meshes.forEach(m => (m.material = m.userData.mat)); pts.length = 0; };
    const api = {
      home() { reset(); fly(new T.Vector3(0, 0, full()), new T.Vector3(0, 0, 0)); },
      show(q, hintOnly) {
        const t = T3[q], g = tgtOf(q), dir = cam.position.clone().sub(ctl.target).normalize();
        fly(g.c.clone().add(dir.multiplyScalar(Math.max(g.r * 4.5, .22))), g.c);
        if (hintOnly) return;
        if (t.m) t.m.forEach(k => byKey[k] && (byKey[k].material = mGood)); else pts.push({ v: g.c, cls: 'good' });
      },
      mark() { mk.innerHTML = pts.map(p => `<i class="${p.cls}"></i>`).join(''); },
      dispose() { cancelAnimationFrame(raf); ro.disconnect(); ctl.dispose && ctl.dispose(); meshes.forEach(m => m.geometry.dispose()); renderer.dispose(); },
    };
    // un toucher (pas un glissement) : on regarde ce qui est sous le doigt
    const rc = new T.Raycaster(); let down = null;
    cv.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY, performance.now()]; });
    cv.addEventListener('pointerup', e => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 8 || performance.now() - down[2] > 450 || !Q3 || Q3.st !== 'q') return;
      const r = cv.getBoundingClientRect();
      rc.setFromCamera(new T.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), cam);
      const hit = rc.intersectObjects(meshes.filter(m => m.visible), false)[0];
      if (!hit) return;
      const x = Q3.list[Q3.i], t = T3[x.q];
      const good = t.m ? t.m.includes(hit.object.userData.key) : hit.point.distanceTo(tgtOf(x.q).c) < R0 * (t.r || 1);
      if (!good) { if (t.m) hit.object.material = mBad; else pts.push({ v: hit.point.clone(), cls: 'bad' }); }
      q3Answer(good, good ? null : hit.object.userData.fr);
    });
    let raf = 0;
    const loop = now => { raf = requestAnimationFrame(loop); if (anim) anim(now); ctl.update(); renderer.render(scene, cam);
      const els = mk.children; pts.forEach((p, i) => { const v = p.v.clone().project(cam); if (els[i]) els[i].style.transform = `translate(${(v.x + 1) / 2 * W}px,${(1 - v.y) / 2 * H}px)`; }); };
    raf = requestAnimationFrame(loop);
    api.layers = layers;
    return api;
  }

  // ---------- routeur ----------
  function render() {
    const [, sec, a, b, c] = (location.hash || '#/').split('/');
    let html;
    if (!sec) html = home();
    else if (sec === 'pedi') html = a ? pedi(a, b, c) : pediList();
    else if (sec === 'podo') html = a ? pedi(a, b, c, 'podo') : podoList();
    else if (sec === 'plan') html = plan();
    else if (sec === 'anat') html = a === 'quiz' ? anatQuiz() : a === '3d' ? quiz3d() : a && !REG_ORDER.includes(a) ? anatItem(a) : anatList(a);
    else if (sec === 'clin') html = !a ? clinHub() : a === 'b' ? (b ? bilanStep(+b) : bilanList()) : a[0] === 's' ? clinSec(+a.slice(1) - 1) : clinTest(+a);
    else if (sec === 'tirage') html = tirage();
    else if (sec === 'lexique') html = lexique();
    else if (sec === 'search') html = search();
    else html = notFound();
    if (V3) { V3.dispose(); V3 = null; }
    closeVideo();
    $('#app').innerHTML = html;
    document.body.classList.toggle('v3on', !!$('#v3c'));
    if ($('#v3c')) start3d();
    document.body.classList.toggle('reading', !!$('#app .pager.fixed'));
    document.querySelectorAll('nav.tabs a').forEach(t => t.classList.toggle('on', t.dataset.s === (sec || '') || (t.dataset.s === 'tirage' && sec === 'plan')));
    const f = (sec === 'podo' ? PODO_OK : PEDI).find(x => x.id === a);
    document.title = (sec === 'pedi' || sec === 'podo') && f ? `${f.n}. ${f.title} · Révisions podo` : sec === 'clin' && a === 'b' && BL[+b - 1] ? `${BL[+b - 1].n} · Bilan du pied · Révisions podo` : sec === 'clin' && CL[+a - 1] ? `${CL[+a - 1].n} · Examen clinique · Révisions podo` : sec === 'anat' && a && a !== 'quiz' && a !== '3d' && !REG_ORDER.includes(a) ? `Q${a} · Anatomie · Révisions podo` : 'Révisions podo';
    window.scrollTo(0, 0);
    showNote();
  }

  // toucher un dessin ou une planche : plein écran (on peut zoomer avec les doigts), toucher encore pour fermer
  document.addEventListener('click', e => {
    const im = e.target.closest('.slide img, .zoomable img, .plate img');
    if (im) { e.preventDefault(); const z = document.createElement('div'); z.className = 'zoom' + (im.dataset.full ? ' tall' : ''); z.innerHTML = `<img src="${im.dataset.full || im.getAttribute('src')}" alt=""><span>Toucher pour fermer</span>`; z.onclick = () => z.remove(); document.body.appendChild(z); return; }
  }, true);
  document.addEventListener('click', e => {
    const t = e.target.closest('button, .revise .part .body li, .revise .part .body .chip, .revise .part .body .badge, .revise .part .body td');
    if (!t) return;
    if (t.dataset.qa) { quizAct(t); return; }
    if (t.dataset.q3) { q3Act(t); return; }
    if (t.dataset.note) { closeNote(); return; }
    if (t.dataset.size !== undefined) { S.size = t.dataset.size; save(); setSkin(); render(); return; }
    if (t.id === 'bkcopy') { const c = toCode(), m = $('#bkmsg'), z = $('#bkzone'), ta = $('#bkta'); z.hidden = false; ta.value = c; ta.select(); try { navigator.clipboard.writeText(c).then(() => (m.textContent = 'Code copié. Colle-le dans tes Notes pour le garder.'), () => (m.textContent = 'Sélectionne le code ci-dessus et copie-le.')); } catch (er) { m.textContent = 'Sélectionne le code ci-dessus et copie-le.'; } return; }
    if (t.id === 'share') {
      const url = location.origin + location.pathname, m = $('#shmsg');
      const copy = () => { try { navigator.clipboard.writeText(url).then(() => (m.textContent = 'Lien copié : envoie-le à ton ami.'), () => (m.textContent = url)); } catch (er) { m.textContent = url; } };
      if (navigator.share) navigator.share({ title: 'Révisions podo', text: "Pour réviser l'oral de pédicurie-podologie : les 24 fiches et les 59 repères d'anatomie.", url }).catch(er => { if (er && er.name !== 'AbortError') copy(); });
      else copy();
      return;
    }
    if (t.dataset.vid) { openVideo(t.dataset.vid, t.dataset.yt, t.dataset.src, t.dataset.lab); return; }
    if (t.id === 'vclose') { closeVideo(); return; }
    if (t.id === 'upcheck') { const m = $('#upmsg'); m.textContent = 'Vérification…'; latestV().then(v => { if (!v) m.textContent = 'Pas de réseau : réessaie plus tard.'; else if (v > APP_V) { m.innerHTML = `Version ${v} disponible. <button class="btn" id="upgo" style="--c:var(--hl)">Mettre à jour</button>`; } else m.textContent = 'Tu as la dernière version ✓'; }); return; }
    if (t.id === 'upgo') { t.textContent = 'Mise à jour…'; applyUpdate(); return; }
    if (t.id === 'upx') { t.closest('.upbar').remove(); return; }
    if (t.id === 'bkopen') { $('#bkzone').hidden = false; $('#bkta').value = ''; $('#bkta').focus(); return; }
    if (t.id === 'bkload') { try { fromCode($('#bkta').value); save(); setSkin(); render(); const m = $('#bkmsg'); if (m) m.textContent = 'Progression restaurée ✓'; } catch (er) { $('#bkmsg').textContent = "Ce code n'est pas valide : vérifie que tu l'as collé en entier."; } return; }
    if (t.dataset.skin || t.dataset.theme !== undefined) { if (t.dataset.skin) S.skin = t.dataset.skin; else S.theme = t.dataset.theme; if (t.closest('.note')) closeNote(); save(); setSkin(); render(); return; }
    if (t.dataset.v3l) { const k = t.dataset.v3l; on3()[k] = on3()[k] ? 0 : 1; save(); t.classList.toggle('on', !!on3()[k]); if (V3) V3.layers(); return; }
    if (t.classList.contains('reveal')) { t.closest('[data-quiz]').classList.add('shown'); return; }
    if (!t.matches('button')) { t.classList.toggle('shown'); return; }
    const [, sec, a] = location.hash.split('/');
    if (t.id === 'revise') { S.revise = !S.revise; save(); render(); }
    if (t.id === 'done') { const p = S.pedi[a] = S.pedi[a] || {}; p.done = !p.done; save(); render(); }
    if (t.id === 'bknow') { const m = S.bil = S.bil || {}, k = location.hash.split('/')[3]; m[k] = !m[k]; if (m[k]) did(1); save(); render(); }
    if (t.id === 'cknow') { const m = S.clin = S.clin || {}; m[a] = !m[a]; if (m[a]) did(1); save(); render(); }
    if (t.id === 'crand') { const left = CL.map((_, i) => i + 1).filter(i => !doneC(i)), pool = left.length ? left : CL.map((_, i) => i + 1); S.revise = true; save(); location.hash = '#/clin/' + pool[Math.floor(Math.random() * pool.length)]; }
    if (t.id === 'aknow') { S.anat[a] = !S.anat[a]; save(); render(); }
    if (t.id === 'qshow') { shown = true; render(); }
    if (t.id === 'qok' || t.id === 'qko') { S.anat[card.q] = t.id === 'qok'; review('a:' + card.q, t.id === 'qok'); card = null; render(); }
    if (t.id === 'drawO') { draw = { kind: 'p', f: PODO_OK[Math.floor(Math.random() * PODO_OK.length)] }; render(); }
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
