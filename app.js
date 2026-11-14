// Révisions podo : 24 fiches de pédicurie (structure des vidéos) + 59 questions d'anatomie palpatoire.
// Données : data/pedi.js (window.PEDI, PLAN_ORAL), data/anat.js (ANAT_Q, ANAT_PL, ANAT_REG), data/videos.js (VIDEOS).
(() => {
  const PEDI = window.PEDI, PODO = window.PODO || [], PODO_OK = PODO.filter(f => f.ready), AQ = window.ANAT_Q, PL = window.ANAT_PL, VIDEOS = window.VIDEOS || {};
  const PCOL = i => `var(--p${(i % 8) + 1})`;
  const RCOL = { pied: 'var(--p5)', jambe: 'var(--p4)', cuisse: 'var(--p1)' };
  const REG_ORDER = ['pied', 'jambe', 'cuisse'];
  const REG_SHORT = { pied: 'Pied', jambe: 'Jambe', cuisse: 'Cuisse' };
  const $ = s => document.querySelector(s);
  const ico = (n, c) => window.ico ? window.ico(n, c) : '';   // icônes dessinées (icons.js)
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

  // progression, gardée sur le téléphone ; l'appli marche sans (navigation privée)
  const KEY = 'podo:v3';
  let usedBefore = false; try { usedBefore = !!(localStorage.getItem('podo:v2') || localStorage.getItem(KEY)); } catch (e) {}
  let S = { pedi: {}, anat: {} };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  let fbUser = null, fbOk = false, fbTimer = 0;   // sauvegarde en ligne (plus bas) : envoyée 2 s après le dernier changement, une fois le choix fait
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} if (fbOk) { clearTimeout(fbTimer); fbTimer = setTimeout(fbPush, 2000); } };
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
  const SECN = f => f.sec === 'podo' ? 'Podologie' : 'Pédicurie';
  const hasIll = f => f.sec !== 'podo' || !!f.ill;
  const RETRY = `onerror="if(!this.dataset.r){this.dataset.r=1;this.src=this.src.split('?')[0]+'?r=1'}else(this.closest('.drawn')||this).remove()"`;
  const img = (src, alt, cls = '') => `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" ${RETRY}>`;
  // vidéo Drive : la couverture dessinée ouvre un calque plein écran avec le lecteur Drive à la forme exacte de la vidéo.
  // Drive recadre son image et grossit ses commandes dans un petit cadre : le lecteur est dessiné plus grand puis réduit
  // (fitLayer). Il est seul dans le calque (rien ne défile dessous) et supprimé en fermant, pour que rien ne tourne après.
  // icônes en SVG : les polices dessinées n'ont pas ▶ ✕ 📱, l'iPhone affiche alors « ? »
  const IC = {
    play: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>',
    close: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/></svg>',
    rotate: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2.5" width="8" height="14" rx="1.6"/><path d="M11 14h2"/><path d="M3.5 15.5a8.5 8.5 0 0 0 7 6"/><path d="M8.5 19.8l2 1.7-1.6 2"/></svg>',
  };
  const frame = (id, t, poster) => `<button class="video vposter" data-vid="${id}" style="background-image:url(${poster})" aria-label="${t}">
    <span class="play">${IC.play}</span><span class="vtxt">Regarder la vidéo</span></button>`;
  // yt : vidéo YouTube (tests d'examen clinique, de piriforme.fr) ; src : la page d'où elle vient
  function openVideo(id, yt, src, lab) {
    closeVideo();
    const d = document.createElement('div'); d.className = 'vlayer' + (yt ? ' yt' : '');
    d.innerHTML = `<div class="vbox"><iframe src="${yt ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&autoplay=1` : `https://drive.google.com/file/d/${id}/preview`}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen title="Vidéo"></iframe></div>
      <div class="vrot">${IC.rotate} Tourne ton téléphone pour voir la vidéo en grand.</div>
      <button class="vclose" id="vclose" aria-label="Fermer la vidéo">${IC.close}</button>
      ${yt ? `<a class="vdrive" href="${src}" target="_blank" rel="noopener">${lab || 'Fiche du test sur piriforme.fr'} ↗</a>` : `<a class="vdrive" href="https://drive.google.com/file/d/${id}/view" target="_blank" rel="noopener">Ouvrir dans Drive ↗</a>`}`;
    document.body.appendChild(d); document.body.classList.add('vopen'); document.documentElement.classList.add('vopen');
    zoomLock(true); fitLayer(); window.addEventListener('resize', fitLayer); window.addEventListener('orientationchange', refit);
    try { if (screen.orientation && screen.orientation.lock && d.requestFullscreen) d.requestFullscreen().then(() => screen.orientation.lock('landscape')).catch(() => {}); } catch (e) {}
  }
  // le lecteur est dessiné à 1024 px de large au moins, puis réduit : sur iPhone, Drive montre alors une barre fine au lieu de
  // grosses commandes et d'un voile noir sur toute la vidéo (testé à 402 / 800 / 1024 / 1280 px sur le simulateur iPhone)
  // Le lecteur est dans une boîte à la taille exacte de l'écran qui cache ce qui dépasse : sinon le lecteur de 1024 px rend
  // la page plus large que l'écran et l'iPhone dézoome en tournant, puis garde ce zoom en revenant en portrait.
  function fitLayer() {
    const d = $('.vlayer'), b = d && d.querySelector('.vbox'), f = b && b.querySelector('iframe'); if (!f) return;
    const W = d.clientWidth, H = d.clientHeight, fw = Math.min(W, H * 16 / 9), fh = fw * 9 / 16, VW = d.classList.contains('yt') ? fw : Math.max(fw, 1024), k = fw / VW;
    Object.assign(b.style, { width: fw + 'px', height: fh + 'px', left: (W - fw) / 2 + 'px', top: (H - fh) / 2 + 'px' });
    Object.assign(f.style, { width: VW + 'px', height: VW * 9 / 16 + 'px', transform: k < 1 ? `scale(${k})` : '' });
  }
  // l'iPhone donne la nouvelle taille un peu après la rotation : on recale encore, puis on remet le zoom de la page à 1
  const refit = () => { [120, 400, 900].forEach(t => setTimeout(() => { fitLayer(); zoomLock(!!$('.vlayer')); }, t)); };
  // pendant la vidéo, la page ne peut pas zoomer ; en fermant, on rend le zoom (et l'iPhone revient à l'échelle 1)
  const VIEWPORT = 'width=device-width, initial-scale=1, viewport-fit=cover';
  function zoomLock(on) { const m = document.querySelector('meta[name=viewport]'); if (m) m.setAttribute('content', on ? VIEWPORT + ', maximum-scale=1, user-scalable=no' : VIEWPORT); }
  function closeVideo() {
    window.removeEventListener('resize', fitLayer); window.removeEventListener('orientationchange', refit);
    const d = $('.vlayer'); if (!d) return;
    d.querySelector('iframe').src = 'about:blank'; d.remove(); document.body.classList.remove('vopen'); document.documentElement.classList.remove('vopen');
    zoomLock(true); setTimeout(() => zoomLock(false), 300);
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
    if (last && !(last.parts || [])[S.last.k - 1]) S.last.k = 0;   // la fiche a perdu cette partie : on reprend au plan
    const nextF = PEDI.find(f => !doneP(f.id) && f !== last);
    const regs = REG_ORDER.map(r => { const it = AQ.filter(x => x.reg === r), k = it.filter(x => doneA(x.q)).length; return `<span class="mini"><span>${REG_SHORT[r]} ${k}/${it.length}</span>${bar(k / it.length, RCOL[r])}</span>`; }).join('');
    return `<div class="wrap">
      <header class="brand"><h1 id="apptitle" class="${night() ? 'tap' : ''}">Ya<span>noé</span></h1><div class="kicker">L'ORAL UEM DE PODO, SANS STRESS</div></header>
      <div class="team"><span class="mate zoomable"><img src="photos/equipe/yaya.jpg" data-full="photos/equipe/yaya-full.jpg" alt="Yaya"><span><b>Yaya</b> ${ico('cap')}<br><small>le dev</small></span></span>
        <span class="mate zoomable"><img src="photos/equipe/nono.jpg" data-full="photos/equipe/nono-full.jpg" alt="${NONO()}"><span><b>${NONO()}</b> ${ico('cone')}<br><small>le cerveau</small></span></span>
        <span class="mate zoomable"><img src="photos/equipe/hugo.jpg" data-full="photos/equipe/hugo-full.jpg" alt="Hugo"><span><b>Hugo</b> ${ico('quad')}<br><small>la cuisse droite</small></span></span></div>
      ${todayCard()}
      ${last ? `<a class="card resume" href="${FB(last)}${S.last.k ? '/p' + S.last.k : ''}">${hasIll(last) ? thumb(ill(last.id, S.last.k ? `p${S.last.k}b` : 'cover'), last.title) : `<span class="stamp sm" style="--c:var(--p8)">${last.n}</span>`}
        <span class="rt"><span class="kicker">${IC.play} REPRENDRE</span><span class="t">${last.n}. ${esc(last.title)}</span><span class="s">${S.last.k ? `Partie ${S.last.k} · ${esc(last.parts[S.last.k - 1].title)}` : 'Le plan de la fiche'}</span>${segs(last)}</span></a>` : ''}
      <div class="sec">JOUER</div>
      <a class="card resume" href="#/jeu/apprendre"><span class="stamp sm" style="--c:var(--p6)">${ico('sparkle')}</span><span class="rt"><span class="kicker">POUR APPRENDRE</span><span class="t">Apprendre une fiche</span><span class="s">Lire, cacher, réciter · ${ALLF.filter(f => nStars(f.id) === 3).length}/${ALLF.length} fiches à 3 étoiles</span></span><span class="chev">›</span></a>
      <a class="card resume" href="#/jeu/aventure"><span class="stamp sm" style="--c:var(--red)">${ico('flame')}</span><span class="rt"><span class="kicker">L'AVENTURE</span><span class="t">Podo Quest</span><span class="s">Bats les monstres en récitant leurs fiches · niveau ${(S.rpg || {}).lvl || 1} · ${Object.keys((S.rpg || {}).seen || {}).length} monstres battus</span></span><span class="chev">›</span></a>
      <div class="sec">POUR RÉVISER CE QUE TU CHOISIS</div>
      <div class="quick">
        <a class="qb" href="#/jeu/patient" style="--c:var(--p4)"><span class="em">${ico('stetho')}</span><span class="t">Le patient</span><span class="s">64 patients${(S.rec || {}).patient ? ' · record ' + S.rec.patient + '/30' : ''}</span></a>
        <a class="qb" href="#/jeu/quisuisje" style="--c:var(--p3)"><span class="em">${ico('bulb')}</span><span class="t">Qui suis-je ?</span><span class="s">4 indices${(S.rec || {}).quisuisje ? ' · record ' + S.rec.quisuisje + '/40' : ''}</span></a>
        <a class="qb" href="#/jeu/survie" style="--c:var(--red)"><span class="em">${ico('flame')}</span><span class="t">Survie</span><span class="s">3 vies${(S.rec || {}).survie ? ' · record ' + S.rec.survie : ''}</span></a>
        <a class="qb" href="#/jeu/paires" style="--c:var(--p5)"><span class="em">${ico('stopwatch')}</span><span class="t">Les paires</span><span class="s">60 secondes${(S.rec || {}).paires ? ' · record ' + S.rec.paires : ''}</span></a>
      </div>
      <div class="sec">OÙ J'EN SUIS</div>
      <a class="card prog" href="#/pedi">${ring(vP, 'var(--p6)')}<span class="rt"><span class="t">Pédicurie</span><span class="s">${nP}/24 fiches sues · ${PEDI.reduce((s, f) => s + nSeen(f), 0)} parties lues</span>${bar(nP / 24, 'var(--p6)')}</span><span class="chev">›</span></a>
      <a class="card prog" href="#/podo">${ring(PODO_OK.length ? PODO_OK.reduce((s, f) => s + pctP(f), 0) / PODO.length : 0, 'var(--p8)')}<span class="rt"><span class="t">Podologie</span><span class="s">${PODO_OK.filter(f => doneP(f.id)).length}/${PODO.length} fiches sues · ${PODO_OK.length} prête${PODO_OK.length > 1 ? 's' : ''}, les autres arrivent</span>${bar(PODO_OK.filter(f => doneP(f.id)).length / PODO.length, 'var(--p8)')}</span><span class="chev">›</span></a>
      <a class="card prog" href="#/anat">${ring(nA / AQ.length, 'var(--p1)')}<span class="rt"><span class="t">Anatomie palpatoire</span><span class="s">${nA}/${AQ.length} repères sus</span><span class="minis">${regs}</span></span><span class="chev">›</span></a>
      <a class="card prog" href="#/clin">${ring((nC(CL) + nB(BL)) / (CL.length + BL.length), 'var(--p4)')}<span class="rt"><span class="t">Examen clinique</span><span class="s">${nC(CL)}/${CL.length} tests · ${nB(BL)}/${BL.length} étapes du bilan</span>${bar((nC(CL) + nB(BL)) / (CL.length + BL.length), 'var(--p4)')}</span><span class="chev">›</span></a>
      <div class="sec">RÉVISER MAINTENANT</div>
      <div class="quick">
        ${nextF ? `<a class="qb" href="${FB(nextF)}" style="--c:var(--p6)">${thumb(ill(nextF.id, 'cover'), nextF.title)}<span class="t">Fiche ${nextF.n}</span><span class="s">${esc(nextF.title)}</span></a>` : ''}
        <a class="qb" href="#/anat/quiz" style="--c:var(--p1)"><span class="em">${ico('target')}</span><span class="t">Je m'interroge</span><span class="s">un repère d'anatomie au hasard</span></a>
        <a class="qb" href="#/tirage" style="--c:var(--red)"><span class="em">${ico('dice')}</span><span class="t">Tirage au sort</span><span class="s">comme le jour de l'oral</span></a>
        <a class="qb" href="#/plan" style="--c:var(--p3)">${thumb(ill('plan', 'board'), 'Le plan')}<span class="t">Le plan de l'oral</span><span class="s">les 8 questions</span></a>
      </div>
      ${window.SONS ? `<div class="sec">POUR SE CONCENTRER</div>${SONS.card()}` : ''}
      <div class="sec">RÉGLAGES</div>${settings()}</div>`;
  }

  // ---------- réglages : thème, couleurs, taille du texte, code de sauvegarde ----------
  function settings() {
    const b = (attr, v, cur, t) => `<button class="btn ghost" data-${attr}="${v}" aria-pressed="${cur === v}">${t}</button>`;
    return `<div class="card sets">
      <div class="lbl">Thème</div><div class="skin">${b('skin', 'drawn', S.skin || 'drawn', ico('pencil') + ' Dessiné')}${b('skin', 'classic', S.skin || 'drawn', 'Classique')}</div>
      <div class="lbl">Couleurs</div><div class="skin">${b('theme', '', S.theme || '', 'Auto')}${b('theme', 'light', S.theme || '', 'Clair')}${b('theme', 'dark', S.theme || '', 'Sombre')}</div>
      <div class="lbl">Texte</div><div class="skin">${b('size', '', S.size || '', 'Normal')}${b('size', 'big', S.size || '', 'Grand')}</div>
      <div class="lbl">Sauvegarde</div><div class="muted small">${fbUser ? `Connecté(e) : ${esc(fbUser.email)}. Ta progression est sauvegardée en ligne et revient sur tous tes appareils où tu te connectes.` : "Connecte-toi avec Google pour retrouver ta progression sur tous tes appareils (et entre Safari et l'icône de l'écran d'accueil)."}</div>
      <div class="skin">${fbUser ? '<button class="btn ghost" id="fbout">Se déconnecter</button>' : '<button class="btn" id="fbin" style="--c:var(--hl)">Se connecter avec Google</button>'}<button class="btn ghost" id="bkshow" aria-expanded="false">Sauvegarder sans Google (hors ligne)</button></div>
      <div class="muted small" id="fbmsg"></div>
      ${(() => { try { return localStorage.getItem(SPARE) ? '<div class="skin"><button class="btn ghost" id="fbundo">Revenir à la progression d\'avant</button></div>' : ''; } catch (e) { return ''; } })()}
      <div id="bkbox" hidden><div class="muted small">Sans compte : copie ton code d'un côté, restaure-le de l'autre (ou garde-le dans tes Notes).</div>
      <div class="skin"><button class="btn ghost" id="bkcopy">${ico('clipboard')} Copier mon code</button><button class="btn ghost" id="bkopen">Restaurer</button></div>
      <div id="bkzone" hidden><textarea id="bkta" rows="3" placeholder="Colle ton code ici"></textarea><button class="btn" id="bkload" style="--c:var(--hl)">Restaurer ce code</button></div>
      <div class="muted small" id="bkmsg"></div></div>
      <div class="lbl">Mise à jour</div><div class="skin"><span class="muted small" style="margin:0">Version ${APP_V}</span><button class="btn ghost" id="upcheck">${ico('refresh')} Vérifier</button></div>
      <div class="muted small" id="upmsg"></div>
      <div class="lbl">Partager</div><div class="skin"><button class="btn" id="share" style="--c:var(--hl)">${ico('share')} Partager l'appli à un ami</button></div>
      <div class="muted small" id="shmsg">Chacun garde sa propre progression.</div>
      <div class="lbl">Sur tous tes appareils</div><div class="muted small">Utilise l'appli sur ton téléphone, ta tablette et ton ordi : <a href="https://yaslack.github.io/revisions-podo/"><b>yaslack.github.io/revisions-podo</b></a>. Connecte-toi avec Google pour retrouver ta progression partout.</div>
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

  // ---------- sauvegarde en ligne : connexion Google (Firebase), progression dans Firestore (doc progress/<uid>) ----------
  // Firebase n'est chargé que si le réseau répond ; sans réseau, l'appli marche comme avant sur le téléphone.
  const FB_CFG = { apiKey: 'AIzaSyAGcjr5BQvlr6SexnTFnRRNAMJqwKqWLck', authDomain: 'revisonpodo.firebaseapp.com', projectId: 'revisonpodo', appId: '1:226593516493:web:f22825b1cc9afc4b163284' };
  const FB_URL = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-';
  let fbx = null;   // { Au, auth } une fois chargé : la fenêtre Google doit s'ouvrir tout de suite au toucher (sinon Safari la bloque)
  const fbHome = () => { if (!location.hash || location.hash === '#/') render(); };   // pas de re-rendu au milieu d'un quiz
  function fbLoad() {
    if (fbx) return;
    Promise.all([import(FB_URL + 'app.js'), import(FB_URL + 'auth.js')]).then(([A, Au]) => {
      const auth = Au.getAuth(A.initializeApp(FB_CFG));
      fbx = { Au, auth };
      Au.onAuthStateChanged(auth, u => { fbUser = u; fbOk = false; fbHome(); if (u) fbPull(); });
    }).catch(() => {});
  }
  // ponytail: Firestore par son API REST (pas le SDK, trop lourd pour une seule fiche par élève)
  async function fbDoc(method, d) {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${FB_CFG.projectId}/databases/(default)/documents/progress/${fbUser.uid}`, {
      method, keepalive: method === 'PATCH', headers: { Authorization: 'Bearer ' + await fbUser.getIdToken(), 'Content-Type': 'application/json' },
      body: d ? JSON.stringify({ fields: { d: { stringValue: d } } }) : undefined });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error('firestore ' + r.status);
    return r.json();
  }
  // deux progressions réunies sans rien perdre : listes réunies, compteurs au plus haut, sinon la valeur de ce téléphone
  // ponytail: une case décochée sur un autre appareil peut revenir ; un vrai suivi des suppressions si ça gêne
  function merge(a, b) {
    // (ce téléphone d'abord : si l'autre côté n'apporte rien, le résultat est identique à ce téléphone)
    if (Array.isArray(a) && Array.isArray(b)) return [...new Map([...a, ...b].map(x => [JSON.stringify(x), x])).values()];
    if (a && b && typeof a === 'object' && typeof b === 'object') { const o = {}; for (const k in a) o[k] = k in b ? merge(a[k], b[k]) : a[k]; for (const k in b) if (!(k in a)) o[k] = b[k]; return o; }
    if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
    return a === undefined ? b : a;
  }
  // en cas de pépin : la progression remplacée reste en secours sur le téléphone (bouton « Revenir à la progression d'avant »)
  const SPARE = 'podo:v3:avant', LINK = 'podo:fbuid';
  function fbUse(next, spare) {   // spare : la progression remplacée par un choix de l'élève, gardée en secours
    if (spare) try { localStorage.setItem(SPARE, JSON.stringify(spare)); } catch (e) {}
    S = Object.assign({ pedi: {}, anat: {} }, next, { mig: S.mig, noteV: S.noteV, skin: S.skin, theme: S.theme, size: S.size });   // le look reste celui de cet appareil
    save(); setSkin(); fbHome();
  }
  const fbLink = keep => { fbOk = true; try { localStorage.setItem(LINK, fbUser.uid); } catch (e) {} return fbPush(keep); };
  const fbGet = async () => { const j = await fbDoc('GET'); return j && j.fields && j.fields.d ? JSON.parse(j.fields.d.stringValue) : null; };
  const hasProg = o => ['pedi', 'anat', 'days', 'qz', 'rv', 'bil', 'clin'].some(k => o[k] && Object.keys(o[k]).length);
  function sumUp(o) {   // « 3 fiches finies · 12 repères sus · 5 jours de révision · la dernière fois le 06/11/2026 »
    const f = Object.values(o.pedi || {}).filter(x => x && x.done).length, a = Object.values(o.anat || {}).filter(Boolean).length, d = Object.keys(o.days || {}).map(Number), s = x => x > 1 ? 's' : '';
    return `${f} fiche${s(f)} finie${s(f)} · ${a} repère${s(a)} su${s(a)} · ${d.length} jour${s(d.length)} de révision${d.length ? ` · la dernière fois le ${new Date(Math.max(...d) * 864e5).toLocaleDateString('fr-FR')}` : ''}`;
  }
  let fbCloud = null;
  async function fbPull() {
    try {
      let linked = null; try { linked = localStorage.getItem(LINK); } catch (e) {}
      // première connexion sur ce téléphone, avec une progression des deux côtés : l'élève choisit (comme dans un jeu)
      if (linked !== fbUser.uid) { const cloud = await fbGet(); if (cloud && hasProg(S) && hasProg(cloud) && JSON.stringify(merge(S, cloud)) !== JSON.stringify(S)) return fbAsk(cloud); }
      await fbLink();
    } catch (e) { const m = $('#fbmsg'); if (m) m.textContent = 'Sauvegarde en ligne indisponible pour le moment : ta progression reste sur ce téléphone.'; }
  }
  function fbAsk(cloud) {
    fbCloud = cloud; if ($('#fbask')) return;
    const d = document.createElement('div'); d.className = 'note'; d.id = 'fbask';
    d.innerHTML = `<div class="card" role="dialog" aria-label="Quelle progression garder ?"><div class="kicker">SAUVEGARDE</div><h2>Quelle progression garder ?</h2>
      <div class="lbl">Sur ce téléphone</div><div class="muted small">${sumUp(S)}</div>
      <div class="lbl">En ligne</div><div class="muted small">${sumUp(cloud)}</div>
      <button class="btn wide" data-fb="mix" style="--c:var(--hl)">Réunir les deux (rien n'est perdu)</button>
      <div class="row2"><button class="btn ghost grow" data-fb="local">Celle du téléphone</button><button class="btn ghost grow" data-fb="cloud">Celle en ligne</button></div>
      <div class="muted small">Celle que tu ne gardes pas reste en secours sur ce téléphone (Réglages).</div></div>`;
    document.body.appendChild(d);
  }
  // envoi : on relit d'abord la sauvegarde en ligne et on la réunit avec ce téléphone, pour ne jamais effacer ce qu'un autre appareil a envoyé
  // (keep : après un choix de l'élève, sa progression remplace celle en ligne telle quelle)
  let fbBusy = Promise.resolve();
  function fbPush(keep) {
    clearTimeout(fbTimer); fbTimer = 0;
    if (!fbUser || !fbOk) return;
    return fbBusy = fbBusy.then(async () => {
      const c = keep ? null : await fbGet(), m = c && merge(S, c);
      if (m && JSON.stringify(m) !== JSON.stringify(S)) { fbUse(m); clearTimeout(fbTimer); fbTimer = 0; }
      await fbDoc('PATCH', JSON.stringify(S));
    }).catch(() => { const x = $('#fbmsg'); if (x) x.textContent = 'Sauvegarde en ligne indisponible pour le moment : ta progression reste sur ce téléphone.'; });
  }
  // appli fermée : on envoie tout de suite ; appli qui revient à l'écran : on récupère ce que les autres appareils ont fait
  document.addEventListener('visibilitychange', () => { if (document.hidden ? fbTimer : fbOk) fbPush(); });
  setTimeout(fbLoad, 1500);

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
  const fx = (n, up) => { if (window.SONS && SONS.fx) SONS.fx(n, up); };   // sons d'interface (sons.js)
  function did(n) { const d = S.days = S.days || {}, k = String(today()), was = d[k] || 0; d[k] = was + n; save(); if (was < GOAL && d[k] >= GOAL) setTimeout(() => fx('record'), 900); }   // objectif du jour atteint : fanfare
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
        <div class="streak" title="Jours d'affilée">${ico('flame')} ${st}<small>jour${st > 1 ? 's' : ''}</small></div></div>
      <div class="goal"><span>Objectif du jour : ${Math.min(n, GOAL)} / ${GOAL}</span>${bar(Math.min(1, n / GOAL), 'var(--p6)')}</div>
      <div class="todos">
        ${dueF.map(f => item(`${FB(f)}/quiz`, ico('repeat'), `À revoir : ${esc(f.title)}`, 'le quiz de la fiche')).join('')}
        ${dueA ? item('#/anat/quiz', ico('bone'), `${dueA} repère${dueA > 1 ? 's' : ''} d'anatomie à revoir`, "Je m'interroge") : ''}
        ${nf ? item(`#/jeu/apprendre/${nf.id}`, ico('sparkle'), `Nouvelle fiche : ${nf.n}. ${esc(nf.title)}`, perDay ? `pour tout voir avant l'oral : ${perDay} nouvelle${perDay > 1 ? 's' : ''} par jour` : 'apprends-la en jouant') : ''}
        ${!dueF.length && !dueA && !nf ? '<div class="muted small">Rien à revoir aujourd\'hui. Tire un sujet au sort pour t\'entraîner !</div>' : ''}
      </div>
      <div class="exam">${ico('calendar')} Mon oral : <input type="date" id="examdate" value="${S.exam || ''}" aria-label="Date de mon oral"></div></div>`;
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
    d.innerHTML = `<span>Une mise à jour est disponible (version ${v}).</span><button class="btn" id="upgo" style="--c:var(--hl)">Mettre à jour</button><button class="upx" id="upx" aria-label="Plus tard">${IC.close}</button>`;
    document.body.appendChild(d);
  }
  setTimeout(() => latestV().then(upBanner), 2500);

  // ---------- quoi de neuf : affiché une fois après une mise à jour, seulement à ceux qui utilisaient déjà le site ----------
  // Pour une nouvelle version : ajouter une entrée { v, items } à la fin (v = numéro de version.json).
  const NOTES = [
    { v: 45, theme: true, items: [
      ['pencil', 'Un nouveau look, dessiné comme les vidéos. Tu préfères l\'ancien ? Choisis en bas.'],
      ['target', 'Un quiz pour apprendre chaque fiche par cœur : partie par partie, puis toute la fiche de mémoire.'],
      ['film', 'La vidéo de chaque fiche, et les dessins des vidéos sur chaque partie.'],
      ['bone', 'Anatomie : seulement les 59 questions de l\'oral, rangées pied / jambe / cuisse, avec ce qui s\'insère sur chaque os.'],
      ['cube', 'Le quiz 3D revient, sur les 59 repères.'],
      ['calendar', 'Ma séance du jour : la date de ton oral, ce qu\'il faut revoir aujourd\'hui, ton objectif et ta série de jours.'],
      ['repeat', 'Ce que tu apprends revient au bon moment : après 1, 3, 6, 12 puis 25 jours.'],
      ['book', 'Le lexique des mots compliqués et une recherche dans tout le site.'],
      ['moon', 'Mode sombre, texte plus grand et code de sauvegarde : dans Réglages, en bas de l\'accueil.'],
      ['check', 'Ta progression a été gardée.'],
    ] },
    { v: 50, items: [
      ['stetho', 'Nouvel onglet Examen clinique : les 41 tests du guide, rangés en 7 sections.'],
      ['pencil', 'Chaque test a son dessin : comment se placer, où mettre les mains, ce qui bouge.'],
      ['feet', 'Les étapes une par une, les chiffres à retenir, et comment lire le résultat (normal ou positif).'],
      ['play', 'Une vidéo pour 13 des tests.'],
      ['eyeoff', 'Mode test (l\'œil en haut) et « Un test au hasard » pour t\'entraîner.'],
    ] },
    { v: 51, items: [
      ['pencil', 'Examen clinique : tous les dessins des tests ont été refaits, plus clairs, avec les mains du praticien et des gros plans sur le genou, la cheville et le pied.'],
      ['cap', 'L\'appli s\'appelle Yanoé (Yaya + Noé), et tu peux voir qui l\'a faite : Yaya et Nono, en haut de l\'accueil.'],
    ] },
    { v: 52, items: [
      ['foot', 'Examen clinique : le bilan du pied, en décharge et en charge, en 15 étapes dans l\'ordre de l\'examen.'],
      ['pencil', 'Chaque étape a son dessin : empreintes au podoscope, griffes, axe du talon, amplitudes, test de Jack…'],
      ['play', 'Des vidéos pour 6 étapes, et le mode test (l\'œil en haut) pour réciter.'],
    ] },
    { v: 53, items: [
      ['leg', 'Nouveau : la podologie ! Les 40 fiches du livret, faites comme celles de pédicurie, à partir des vidéos.'],
      ['check', 'Déjà prêtes : 1. Atteintes ligamentaires du genou et 2. Les chaussures de l\'enfant, avec leurs dessins, leur quiz et le livret.'],
      ['hourglass', 'Les autres arrivent au fur et à mesure des vidéos. Elles sont sur l\'accueil, sous Pédicurie.'],
    ] },
    { v: 55, items: [
      ['phones', 'Des sons pour réviser : bruit rose, brun, brun profond, blanc, pluie, vagues, feu, ondes alpha. À choisir en bas de l\'accueil.'],
      ['playpause', 'Un mini-lecteur reste à l\'écran : pause, volume ou arrêt à tout moment. Déplace-le avec ⠿, réduis-le avec –. Le son tourne en boucle sans fin.'],
      ['play', 'La vidéo de la fiche podologie 2 (chaussures de l\'enfant) est là.'],
    ] },
    { v: 59, items: [
      ['leg', 'Podologie : 3 nouvelles fiches, avec vidéo, dessins et quiz : 3. Les chaussures de sécurité, 4. La coxarthrose, 5. Le cycle de marche.'],
    ] },
    { v: 63, items: [
      ['leg', 'Podologie : 6 nouvelles fiches, avec dessins et quiz : 6. Déformations des orteils, 7. Les entorses de la cheville, 10. Les fractures de fatigue, 11. Genu valgum et genu varum, 12. La gonarthrose, 13. L\'hallux rigidus.'],
      ['play', 'La vidéo de la fiche 7 est là ; les autres arrivent.'],
      ['memo', 'Les fiches de podologie gardent les numéros de la liste officielle (et des vidéos) : la liste saute le 8 et le 9.'],
    ] },
    { v: 64, items: [
      ['play', 'La vidéo de la fiche podologie 6 (déformations des orteils) est là.'],
    ] },
    { v: 65, items: [
      ['play', 'Les vidéos des fiches podologie 10 à 13 sont là : fractures de fatigue, genu valgum et varum, gonarthrose, hallux rigidus.'],
    ] },
    { v: 66, items: [
      ['leg', 'Podologie : nouvelle fiche 14. L\'hallux valgus, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 67, items: [
      ['leg', 'Podologie : nouvelle fiche 15. L\'inégalité de longueur des membres, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 68, items: [
      ['leg', 'Podologie : nouvelle fiche 16. L\'insuffisance du premier rayon, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 69, items: [
      ['leg', 'Podologie : nouvelle fiche 17. Le kyste poplité, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 70, items: [
      ['play', 'Podologie : les vidéos des fiches 14 à 17 sont en ligne (hallux valgus, inégalité de longueur des membres, insuffisance du premier rayon, kyste poplité).'],
    ] },
    { v: 71, items: [
      ['leg', 'Podologie : nouvelle fiche 18. La maladie de Haglund, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 72, items: [
      ['leg', 'Podologie : nouvelle fiche 19. Sever et Osgood-Schlatter, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 74, items: [
      ['leg', 'Podologie : nouvelle fiche 20. La fasciite plantaire, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 75, items: [
      ['leg', 'Podologie : nouvelle fiche 21. L\'os naviculaire accessoire, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 76, items: [
      ['leg', 'Podologie : nouvelle fiche 22. Les ostéochondroses, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 77, items: [
      ['play', 'Podologie : les vidéos des fiches 18 à 21 sont en ligne (Haglund, Sever et Osgood-Schlatter, fasciite plantaire, os naviculaire accessoire).'],
    ] },
    { v: 78, items: [
      ['play', 'Podologie : la vidéo de la fiche 22 est en ligne (les ostéochondroses).'],
    ] },
    { v: 79, until: '2026-11-11', items: [
      ['refresh', 'Nouveau : connecte-toi avec Google (Réglages, en bas de l\'accueil) pour retrouver ta progression sur tous tes appareils.'],
    ] },
    { v: 80, items: [
      ['refresh', 'Connexion Google : si tu as déjà une progression sur ce téléphone et une en ligne, tu choisis laquelle garder (ou tu réunis les deux).'],
      ['check', 'Celle que tu ne gardes pas reste en secours : « Revenir à la progression d\'avant » dans Réglages.'],
      ['clipboard', 'Le code de sauvegarde est toujours là : « Sauvegarder sans Google (hors ligne) ».'],
    ] },
    { v: 83, items: [
      ['leg', 'Podologie : 13 nouvelles fiches (23 à 35), de la périostite tibiale au syndrome des loges, avec dessins et quiz.'],
      ['play', 'Podologie : les vidéos des fiches 23 à 33 sont en ligne (34 et 35 arrivent).'],
    ] },
    { v: 84, items: [
      ['leg', 'Podologie : nouvelle fiche 36. Le syndrome du 2e rayon, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 87, items: [
      ['play', 'Podologie : les vidéos des fiches 34 à 36 sont en ligne (essuie-glace, syndrome des loges, syndrome du 2e rayon).'],
    ] },
    { v: 89, items: [
      ['leg', 'Podologie : nouvelle fiche 37. Le sinus du tarse, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 90, items: [
      ['leg', 'Podologie : nouvelle fiche 38. Les synostoses, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 91, items: [
      ['leg', 'Podologie : nouvelle fiche 39. Les talalgies, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 92, items: [
      ['play', 'Podologie : les vidéos des fiches 37 à 39 sont en ligne (sinus du tarse, synostoses, talalgies).'],
    ] },
    { v: 93, items: [
      ['leg', 'Podologie : nouvelle fiche 40. La talonnade, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 94, items: [
      ['leg', 'Podologie : nouvelle fiche 41. Les tendinites, avec dessins et quiz (la vidéo arrive).'],
    ] },
    { v: 95, items: [
      ['leg', 'Podologie : nouvelle fiche 42. Les tendinopathies d\'Achille, avec dessins et quiz (la vidéo arrive). Les 40 fiches sont prêtes !'],
    ] },
    { v: 97, items: [
      ['play', 'Podologie : les vidéos des fiches 40 à 42 sont là (talonnade, tendinites, Achille). Toutes les vidéos sont maintenant en ligne !'],
    ] },
    { v: 98, items: [
      ['sparkle', 'Nouveau : apprends une fiche en jouant. 3 manches d\'une minute (le tri, les trous, de mémoire), une étoile par manche réussie.'],
      ['flame', 'Survie : 3 vies, le chrono raccourcit, bats ton record.'],
      ['stopwatch', 'Les paires : 60 secondes pour relier chaque fiche à ses mots-clés, ou chaque muscle à son nerf.'],
      ['person', 'Le patient : tu vois ses signes, tu trouves ce qu\'il a, puis ce que tu fais.'],
      ['check', 'Dans ces 3 jeux, tu choisis ce que tu révises : pédicurie, podologie, anatomie, ou seulement telles fiches.'],
      ['bone', 'Anatomie : EIPS, crête iliaque et EIAS expliquent maintenant l\'antéversion, la rétroversion, la bascule latérale et la torsion du bassin.'],
    ] },
    { v: 99, items: [
      ['phones', 'De la musique pour réviser : 4 morceaux composés pour l\'appli (Café lo-fi, Nuit calme, Bonne humeur, Piano du soir), dans « Sons pour réviser » en bas de l\'accueil. Ils marchent hors ligne.'],
      ['spkhigh', 'L\'appli fait du bruit : boutons, bonnes et mauvaises réponses, vie perdue, étoile gagnée, record, objectif du jour. Tu peux les couper au même endroit.'],
    ] },
    { v: 100, items: [
      ['stetho', 'Le patient, refait de A à Z : 64 vraies consultations cliniques (interrogatoire, examen avec les tests cliniques, diagnostic + pourquoi pas les diagnostics différentiels, orientation, prise en charge et question du patient).'],
      ['bulb', 'Nouveau jeu « Qui suis-je ? » : 4 indices progressifs sur les fiches, les 59 repères d\'anatomie et les 41 tests cliniques. Trouve avec le moins d\'indices possible (avant même de voir les 4 choix !).'],
    ] },
    { v: 105, items: [
      ['sparkle', 'Apprendre une fiche, refait pour vraiment retenir : tu lis une partie, tu la caches, tu la redis avec les initiales ; puis les questions ; puis toute la fiche de mémoire. Fini les réponses qu\'on devinait parce que les autres étaient hors sujet.'],
      ['repeat', 'Ce que tu rates revient à la fin de la manche, et une fiche récitée de mémoire revient toute seule dans ta séance du jour.'],
      ['stetho', 'Le patient, plus court : tu cherches d\'abord quoi demander et quoi examiner, tu dévoiles le dossier, puis diagnostic, orientation, traitement, conseil. À la fin, la fiche en mots-clés à redire.'],
      ['bulb', 'Qui suis-je ? : des indices courts, et des pièges pris dans les fiches qui se ressemblent le plus. Les paires aussi. Survie te montre tes 3 erreurs à la fin.'],
      ['book', 'Les 64 patients ont été relus face au livret : 5 phrases qui n\'y étaient pas ont été remplacées par ce que dit le livret.'],
    ] },
    { v: 108, items: [
      ['flame', 'Nouveau : Podo Quest, un jeu d\'aventure au tour par tour ! Ton podologue monte de niveau en battant des monstres : chaque monstre est une fiche, un repère d\'anatomie ou un test clinique.'],
      ['target', 'Tu le reconnais à ses signes, tu l\'attaques avec ses questions, tu frappes fort en récitant une partie, et tu le finis avec son vrai traitement. Les boss se battent en 3 phases.'],
      ['sparkle', 'Les objets sont de vrais instruments et soins du livret (bistouri, gouge, bas de contention, méthode RICE…) : pour les garder, il faut savoir à quoi ils servent. Bestiaire, niveaux, musique d\'aventure.'],
      ['cone', 'Bienvenue à Hugo dans l\'équipe, sur l\'accueil.'],
    ] },
    { v: 109, items: [
      ['flame', 'Podo Quest change de look : un vrai jeu en pixel art. Des décors par monde (forêt, marais, canyon, grotte de cristal), des monstres et un héros en pixels, des fenêtres dorées, une arène néon pour les boss et une carte au trésor en parchemin.'],
      ['phones', 'La musique de l\'aventure passe en chiptune, comme sur une vieille console.'],
    ] },
    { v: 110, items: [
      ['flame', 'Podo Quest : nouvelle interface, sombre et sobre, avec la scène de combat bord à bord. Héros redessiné en pied, monstres plus détaillés (crocs, piques, ailes) avec du volume.'],
    ] },
    { v: 111, items: [
      ['flame', 'Podo Quest : cadres en pixels à coins crantés, palette nuit violette, bouton orange, et le décor du monde en fond de tout l\'écran.'],
    ] },
    { v: 112, items: [
      ['flame', 'Podo Quest avec de vraies images : 5 décors (forêt, marais, canyon, grotte, arène du boss), un nouveau héros, et 8 monstres qui réagissent quand ils sont touchés et quand ils sont K.O.'],
    ] },
    { v: 113, items: [
      ['flame', 'Podo Quest : la vraie interface dessinée. Logo, cadres, icônes des attaques et des familles de monstres, bannières Victoire, Défaite et Niveau.'],
    ] },
    { v: 114, items: [
      ['phones', 'Podo Quest : la musique démarre toute seule, et un bouton ♪ en haut du jeu la coupe ou la remet à tout moment. Ton choix est gardé.'],
    ] },
    { v: 115, items: [
      ['flame', 'Podo Quest : une vraie carte du monde, des décors en hauteur, un coffre qui s\'ouvre, les 12 objets dessinés et de nouveaux boutons.'],
      ['phones', 'Dans le jeu, le lecteur de musique ne s\'affiche plus : seul le bouton ♪ reste, pour couper ou remettre le son.'],
    ] },
    { v: 116, items: [
      ['flame', 'Podo Quest : le voile sombre qui montait et descendait pendant les combats est corrigé.'],
    ] },
    { v: 117, items: [
      ['sparkle', 'Podo Quest : nouveaux décors, héros et monstres en pixel art, avec des combats plus vivants.'],
      ['flame', 'Interface, barres de vie, animations et effets de combat retravaillés pour mieux suivre ton aventure.'],
    ] },
    { v: 118, items: [
      ['sparkle', 'Podo Quest : nouvelle interface de combat, portraits et panneaux inspirés de la maquette, avec une pose d’attaque pour le héros.'],
      ['flame', 'La carte est mieux cadrée et ses étapes sont plus faciles à distinguer.'],
    ] },
    { v: 119, items: [
      ['flame', 'Correction : l’accueil ne plante plus quand la fiche à reprendre avait changé de découpage.'],
    ] },
    { v: 120, items: [
      ['flame', 'Podo Quest : les décors pèsent 6 fois moins lourd et les nouveaux monstres marchent aussi hors ligne.'],
    ] },
    { v: 121, items: [
      ['flame', 'Podo Quest : nouveaux combats. À chaque tour tu choisis ton défi parmi 3 cartes : Question, Tri, Ordre ou Trous. Plus le défi est dur, plus tu frappes fort.'],
      ['sparkle', 'Fini les cases à cocher « sur l’honneur » : c’est le jeu qui corrige. Les pièges viennent de la même fiche, des muscles voisins ou de la même section de tests.'],
      ['book', 'Un défi raté montre ce qu’il fallait retenir, puis revient en revanche. Un monstre battu avec des fautes revient à l’expédition suivante.'],
      ['flame', 'Certains monstres ont un caractère (vif, cuirassé) qui change la façon de les combattre. Et la même question ne revient plus deux fois de suite.'],
    ] },
    { v: 122, items: [
      ['speak', 'Podo Quest t\'entraîne pour l\'oral : la nouvelle carte Oral (la plus forte) te fait dire une partie de la fiche à voix haute, sans choix à deviner. Touche « Parler » : le micro du téléphone écoute et retrouve les idées que tu as dites. Ensuite tu vois en rouge ce que tu as oublié.'],
      ['flame', 'Le boss, c\'est maintenant l\'oral blanc : sa fiche entière, partie par partie, dans l\'ordre du plan. Une partie ratée revient à la fin. Le coup de grâce d\'une fiche, c\'est dire tout son traitement.'],
      ['sparkle', 'Fini de tomber toujours sur les mêmes : les expéditions passent par tout ce que tu as choisi avant de revenir aux mêmes monstres. Un monstre raté revient, mais un seul à la fois et pas à chaque fois.'],
    ] },
    { v: 123, items: [
      ['speak', 'Podo Quest t\'apprend la fiche un peu plus à chaque victoire : la carte Oral te fait dire la prochaine partie que tu ne sais pas encore (tu peux la lire d\'abord). Une partie est sue quand tu la dis à 80 % sans aide. Le boss te fait réciter tout ce que tu sais, plus 2 parties nouvelles ; quand tu sais tout, c\'est l\'oral complet sans indice.'],
      ['muscle', 'Les muscles sont plus durs : l\'origine et la terminaison se disent à voix haute (plus de choix à deviner), et il faut les deux pour donner le coup de grâce.'],
      ['cube', 'Quiz 3D : les 4 petits muscles du pied qui manquaient (courts extenseurs, courts fléchisseurs de l\'hallux et du 5e) sont dessinés. Le TFL se voit à travers le tractus ilio-tibial, chaque muscle a sa nuance, et à la réponse tu vois l\'origine (O) et la terminaison (T) sur le modèle, avec les muscles du dessus en transparence.'],
      ['target', 'Quiz 3D plus facile à viser : le modèle tient entre les boutons et le panneau, le pied, la jambe ou la cuisse s\'affichent en grand, boutons + et −, le pincement zoome vers tes doigts, et toucher juste à côté compte.'],
      ['check', 'La barre du bas ne remonte plus et le titre de Podo Quest ne descend plus quand tu arrives en bas de la page.'],
    ] },
  ];
  const NOTE_V = NOTES[NOTES.length - 1].v;
  if (!usedBefore && !S.noteV) { S.noteV = NOTE_V; save(); }   // première visite : rien à annoncer
  function showNote() {
    let news = NOTES.filter(n => n.v > (S.noteV || 0));
    if (!news.length || $('.note')) return;
    // une annonce importante (until) revient en tête de chaque nouvelle note jusqu'à sa date, même déjà vue
    news = [...NOTES.filter(n => n.until && Date.now() < Date.parse(n.until) && !news.includes(n)), ...news];
    const d = document.createElement('div'); d.className = 'note';
    d.innerHTML = `<div class="card" role="dialog" aria-label="Quoi de neuf"><div class="kicker">MISE À JOUR</div><h2>Quoi de neuf ?</h2>
      <ul>${news.flatMap(n => n.items).map(([e, t]) => `<li><span>${ico(e) || esc(e)}</span><span>${esc(nightly(t))}</span></li>`).join('')}</ul>
      ${news.some(n => n.theme) ? `<div class="row2"><button class="btn grow" data-skin="drawn" style="--c:var(--hl)">Garder le dessiné</button><button class="btn ghost grow" data-skin="classic">L'ancien style</button></div>`
        : `<button class="btn wide" data-note="ok">C'est parti !</button>`}</div>`;
    document.body.appendChild(d);
  }
  const closeNote = () => { S.noteV = NOTE_V; save(); const n = $('.note'); if (n) n.remove(); };

  // ---------- pédicurie ----------
  function pediList() {
    const nP = PEDI.filter(f => doneP(f.id)).length;
    return `<div class="wrap">${top('#/', 'Pédicurie · 24 fiches', count(nP, 24))}
      <div class="row2" style="margin:0 0 12px"><a class="btn ghost grow" href="#/search">${ico('search')} Rechercher</a><a class="btn ghost grow" href="#/lexique">${ico('book')} Lexique (${(window.LEXIQUE || []).length})</a></div>
      <div class="entries">${PEDI.map(f => `<a class="entry" href="${FB(f)}">${thumb(ill(f.id, 'cover'), f.title)}
        <span class="rt"><span class="n">${f.n} · ${esc(f.catName)}${S.qz && S.qz[f.id] ? ` · quiz ${S.qz[f.id].last} %` : ''}${nStars(f.id) ? ' ' + stars(f.id) : ''}</span><span class="t">${esc(f.title)}</span>${segs(f)}</span>${doneP(f.id) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`).join('')}</div></div>`;
  }

  // podologie : les 40 fiches du livret ; celles dont la vidéo n'est pas encore finie sont « coming soon »
  function podoList() {
    const nP = PODO_OK.filter(f => doneP(f.id)).length;
    return `<div class="wrap">${top('#/', `Podologie · ${PODO.length} fiches`, count(nP, PODO.length))}
      <div class="muted lead">${PODO_OK.length} fiche${PODO_OK.length > 1 ? 's' : ''} prête${PODO_OK.length > 1 ? 's' : ''} : les autres arrivent au fur et à mesure des vidéos.</div>
      <div class="entries">${PODO.map(f => f.ready ? `<a class="entry" href="${FB(f)}">${hasIll(f) ? thumb(ill(f.id, 'cover'), f.title) : `<span class="stamp xs" style="--c:var(--p8)">${f.n}</span>`}
        <span class="rt"><span class="n">${f.n} · ${esc(f.catName)}${S.qz && S.qz[f.id] ? ` · quiz ${S.qz[f.id].last} %` : ''}${nStars(f.id) ? ' ' + stars(f.id) : ''}</span><span class="t">${esc(f.title)}</span>${segs(f)}</span>${doneP(f.id) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`
        : `<div class="entry soon"><span class="stamp xs">${f.n}</span><span class="rt"><span class="t">${esc(f.title)}</span><span class="n">${ico('hourglass')} Coming soon</span></span></div>`).join('')}</div></div>`;
  }

  // la fiche : où j'en suis, le bouton pour continuer, les outils, puis le plan
  function fiche(f) {
    const n = f.parts.length, k = nSeen(f), nextK = (f.parts.findIndex((_, i) => !seenP(f, i + 1)) + 1) || 1;
    if (!S.last || S.last.id !== f.id) { S.last = { id: f.id, k: 0 }; save(); }
    const tool = (href, em, label) => `<a class="tool" href="${href}"><span class="em">${em}</span><span>${label}</span></a>`;
    const L = LISTOF(f), i = L.indexOf(f), a = L[i - 1], b = L[i + 1];
    return `<div class="wrap">${top('#/' + (f.sec || 'pedi'), `Fiche ${f.n}${f.sec === 'podo' ? '' : ' / ' + PEDI.length} · ${esc(f.catName)}`, count(k, n))}
      <div class="fhead">${hasIll(f) ? `<span class="drawn th zoomable">${img(ill(f.id, 'cover'), f.title)}</span>` : `<span class="stamp" style="--c:var(--p8)">${f.n}</span>`}<div class="rt"><h1>${esc(f.title)}</h1>${segs(f)}<span class="s">${doneP(f.id) ? '✓ fiche sue' : `${k} partie${k > 1 ? 's' : ''} lue${k > 1 ? 's' : ''} sur ${n}`}</span></div></div>
      <a class="btn wide" href="${FB(f)}/p${nextK}">${k === 0 ? 'Commencer la fiche' : k === n ? 'Revoir depuis le début' : `Continuer : partie ${nextK}`} →</a>
      <a class="btn wide" href="#/jeu/apprendre/${f.id}" style="--c:var(--p4);margin-top:10px">${ico('sparkle')} Apprendre en jouant ${stars(f.id)}</a>
      <a class="btn wide quizbtn" href="${FB(f)}/quiz" style="--c:var(--p5)">${ico('target')} Apprendre la fiche : quiz${S.qz && S.qz[f.id] ? ` · dernier ${S.qz[f.id].last} %` : ''}</a>
      ${dueIn('f:' + f.id) != null ? `<div class="muted small center-t">${dueIn('f:' + f.id) <= 0 ? ico('repeat') + ' À revoir aujourd\'hui' : `${ico('repeat')} Prochaine révision dans ${dueIn('f:' + f.id)} jour${dueIn('f:' + f.id) > 1 ? 's' : ''}`}</div>` : ''}
      <div class="tools">
        ${VIDEOS[f.id] ? tool(`${FB(f)}/video`, ico('play'), 'Vidéo') : ''}
        ${tool(`${FB(f)}/memo`, ico('memo'), 'Mots-clés')}
        ${f.photos.length ? tool(`${FB(f)}/photos`, ico('camera'), 'Photos') : ''}
        ${f.livret ? tool(`${FB(f)}/livret`, ico('book'), 'Livret') : ''}
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
    return `<div class="wrap ${S.revise ? 'revise' : ''}">${top(`${FB(f)}`, `${f.n}. ${esc(f.title)}`, `<button class="eye" id="revise" aria-pressed="${!!S.revise}" title="Me tester : cacher les réponses">${S.revise ? ico('eyeoff') : ico('eye')}</button>`)}
      <nav class="segnav">${f.parts.map((_, i) => `<a href="${FB(f)}/p${i + 1}" class="${i + 1 === k ? 'on' : seenP(f, i + 1) ? 'seen' : ''}" style="--c:${PCOL(i)}">${i + 1}</a>`).join('')}</nav>
      <section class="part solo" style="--c:${c}">
        <header><span class="stamp sm">${k}</span><div><h2>${esc(p.title)}</h2><span class="q">${esc(p.q)}</span></div></header>
        ${hasIll(f) ? `<figure class="drawn slide">${img(ill(f.id, `p${k}b`), p.title + ' : dessin de la vidéo', 'crop')}</figure>` : ''}
        ${S.revise ? `<div class="hint">${ico('eyeoff')} Mode test : récite, puis touche une ligne pour la voir. (${ico('eye')} en haut pour tout afficher)</div>` : ''}
        <div class="body">${blocks(p.blocks)}</div>
        <details class="say"><summary>${ico('speak')} Ce que je dis à l'oral</summary><p>${md(p.say)}</p></details>
        <a class="btn ghost wide" href="${FB(f)}/quiz/${k}" style="margin-top:14px">${ico('target')} Me tester sur cette partie</a>
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
      body = `<div class="question">${md(st.q)}</div>${st.shown ? `<div class="answer">${md(st.a)}</div>` : `<div class="say-it">${ico('speak')} Réponds à voix haute</div>`}`;
      foot = st.shown ? btn('no', '✗ Pas su', '#f6c3b9') + btn('yes', '✓ Je savais', 'var(--p6)') : btn('show', 'Voir la réponse', 'var(--hl)');
    } else if (st.t === 'q') {
      body = `<div class="question">${md(st.q)}</div>${st.shown ? `<div class="muted small">Touche ce que tu avais trouvé :</div>${checks(st.items)}` : `<div class="say-it">${ico('speak')} Cite-les à voix haute (${st.items.length})</div>`}`;
      foot = st.shown ? btn('valid', `Valider · ${(st.ticks || []).length}/${st.items.length}`, 'var(--p6)') : btn('show', 'Voir la réponse', 'var(--hl)');
    } else if (st.t === 'r') {
      const m = f.memo[st.p - 1];
      body = `<div class="kicker">RÉCITE LA PARTIE ${st.p}</div><div class="question">${esc(P.q)}</div>
        ${st.shown ? `<div class="muted small">Coche ce que tu as dit :</div>${checks(st.items)}<details class="say"><summary>${ico('speak')} Le texte complet de la partie</summary><p>${md(P.say)}</p></details>`
          : `<div class="say-it">${ico('speak')} Dis-la à voix haute, comme à l'oral.</div>${m ? `<details class="hintk"><summary>${ico('bulb')} Un indice</summary><span class="hl">${md(m.k)}</span></details>` : ''}`}`;
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
    const st = Q && Q.steps[Q.i], j = +t.dataset.j, f = ALLF.find(x => x.id === Q.id), qa = t.dataset.qa, wasEnd = Q.i >= Q.steps.length;
    fx(qa === 'yes' || qa === 'fok' ? 'good' : qa === 'no' || qa === 'fko' ? 'bad' : qa === 'pick' ? (st.opts[j] === st.ok ? 'good' : 'bad') : qa === 'ck' ? 'tick' : qa === 'show' || qa === 'frev' ? 'reveal'
      : qa === 'valid' ? (!st.items.length || (st.ticks || []).length / st.items.length >= 0.8 ? 'good' : 'bad') : qa === 'weak' || qa === 'again' ? 'start' : 'tap');
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
    if (!wasEnd && Q.i >= Q.steps.length) setTimeout(() => fx('win'), 350);   // quiz terminé
    render(['show', 'pick', 'ck', 'frev', 'fok', 'fko'].includes(qa));
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
      <div class="row2"><a class="btn grow" href="#/anat/quiz" style="--c:var(--hl)">${ico('target')} Je m'interroge</a><a class="btn grow" href="#/anat/3d" style="--c:var(--p8);color:#fff">${ico('cube')} Quiz 3D</a></div>`;
    for (const g of ['Os', 'Muscles']) {
      const it = items.filter(x => x.group === g);
      if (!it.length) continue;
      h += `<div class="sec" style="color:${RCOL[r]}">${g === 'Os' ? ico('bone') + ' OS & REPÈRES OSSEUX' : ico('muscle') + ' MUSCLES & TENDONS'} · ${it.filter(x => doneA(x.q)).length}/${it.length}</div>
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
      <div class="quick"><button class="qb" id="drawP" style="--c:var(--p6)"><span class="em">${ico('dice')}</span><span class="t">Un sujet de pédicurie</span></button>${PODO_OK.length ? `<button class="qb" id="drawO" style="--c:var(--p8)"><span class="em">${ico('dice')}</span><span class="t">Un sujet de podologie</span><span class="s">parmi les ${PODO_OK.length} fiches prêtes</span></button>` : ''}<button class="qb" id="drawA" style="--c:var(--p1)"><span class="em">${ico('dice')}</span><span class="t">5 repères à palper</span></button></div>
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
      <button class="btn wide" id="crand" style="--c:var(--hl);margin-bottom:10px">${ico('target')} Un test au hasard, réponses cachées</button>
      <div class="entries">${CS.map((s, i) => { const it = CL.filter(x => x.s === i), k = nC(it);
        return `<a class="entry" href="#/clin/s${i + 1}" style="--c:${SCOL(i)}"><span class="stamp xs cem">${ico(s.e)}</span><span class="rt"><span class="t">${esc(s.t)}</span><span class="n">${k}/${it.length} tests sus</span>${bar(k / it.length, SCOL(i))}</span><span class="chev">›</span></a>`; }).join('')}</div></div>`;
  }
  function clinSec(i) {
    const s = CS[i]; if (!s) return notFound();
    const it = CL.filter(x => x.s === i);
    return `<div class="wrap">${top('#/clin', `${ico(s.e)} ${esc(s.t)}`, count(nC(it), it.length))}
      <div class="muted lead">${esc(s.intro)}</div>
      <div class="entries">${it.map(x => { const n = CL.indexOf(x) + 1;
        return `<a class="entry" href="#/clin/${n}" style="--c:${SCOL(i)}"><span class="cthumb">${pic(n, 'mini')}</span><span class="rt"><span class="n">TEST ${n}${x.yt ? ` · ${IC.play} vidéo` : ''}</span><span class="t">${esc(x.n)}</span><span class="s">${esc(x.cherche)}</span></span>${doneC(n) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`; }).join('')}</div>
      ${i === 5 ? `<div class="sec">GRADE DU RISQUE PODOLOGIQUE (HAS)</div><div class="card hasg">${(window.CLIN_HAS || []).map(([g, t]) => `<div><b class="g${g}">${g}</b><span>${esc(t)}</span></div>`).join('')}<div class="muted small">Le pédicure-podologue peut poser lui-même ce grade.</div></div>` : ''}
      <div class="pair">${i > 0 ? `<a href="#/clin/s${i}">← ${esc(CS[i - 1].t)}</a>` : '<span></span>'}${i < CS.length - 1 ? `<a href="#/clin/s${i + 2}">${esc(CS[i + 1].t)} →</a>` : ''}</div></div>`;
  }
  function clinTest(n) {
    const x = CL[n - 1]; if (!x) return notFound();
    const c = SCOL(x.s), s = CS[x.s];
    return `<div class="wrap ${S.revise ? 'revise' : ''}">${top(`#/clin/s${x.s + 1}`, `${ico(s.e)} ${esc(s.t)}`, `<button class="eye" id="revise" aria-pressed="${!!S.revise}" title="Me tester : cacher les réponses">${S.revise ? ico('eyeoff') : ico('eye')}</button>`)}
      <section class="part solo ctest" style="--c:${c}">
        <figure class="chero">${pic(n)}${x.yt ? `<button class="cvid" data-vid="${x.yt}" data-yt="1" data-src="https://www.piriforme.fr/bdd/orthopedie/${x.src}">${IC.play} Voir le test en vidéo</button>` : ''}</figure><div class="chead"><div class="rt"><div class="n" style="color:${c}">TEST ${n} / ${CL.length}</div><h1>${esc(x.n)}</h1><div class="cq">${ico('target')} ${esc(x.cherche)}</div></div></div>
        ${S.revise ? `<div class="hint">${ico('eyeoff')} Mode test : dis comment tu fais le test, puis touche une ligne pour la voir. (${ico('eye')} en haut pour tout afficher)</div>` : ''}
        <div class="body"><div class="h">Installation</div><ul class="who"><li><span class="em">${ico('person')}</span><span><span class="lab">Patient</span>${md(x.pat)}</span></li><li><span class="em">${ico('stetho')}</span><span><span class="lab">Praticien</span>${md(x.prat)}</span></li></ul></div>
        <div class="body"><div class="h">Comment faire</div><ol class="steps">${x.steps.map(t => `<li>${md(t)}</li>`).join('')}</ol>
          ${x.key && x.key.length ? `<div class="chips">${x.key.map(k => `<span class="chip">${esc(k)}</span>`).join('')}</div>` : ''}</div>
        <div class="body"><div class="h">Lire le résultat</div><ul class="res"><li class="okr"><span class="lab">Normal</span>${md(x.norm)}</li>${x.pos.map(([a, b]) => `<li class="kor"><span class="lab">${md(a)}</span>→ ${md(b)}</li>`).join('')}</ul>
          ${x.extra ? `<div class="muted small" style="margin-top:8px">${md(x.extra)}</div>` : ''}</div>
        ${x.tip ? `<div class="ctip">${ico('bulb')} ${md(x.tip)}</div>` : ''}
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
      ${BG.map((g, i) => { const it = BL.filter(x => x.g === i); return `<div class="sec" style="color:${BCOL(i)}">${ico(g.e)} ${esc(g.t).toUpperCase()}</div>
        <div class="entries">${it.map(x => { const n = BL.indexOf(x) + 1;
          return `<a class="entry" href="#/clin/b/${n}" style="--c:${BCOL(i)}"><span class="cthumb">${bpic(n, 'mini')}</span><span class="rt"><span class="n">ÉTAPE ${n}${x.yt ? ` · ${IC.play} vidéo` : ''}</span><span class="t">${esc(x.n)}</span><span class="s">${esc(x.why)}</span></span>${doneB(n) ? '<span class="ok">✓</span>' : '<span class="chev">›</span>'}</a>`; }).join('')}</div>`; }).join('')}</div>`;
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
    return `<div class="wrap ${S.revise ? 'revise' : ''}">${top('#/clin/b', `${ico(g.e)} ${esc(g.t)}`, `<button class="eye" id="revise" aria-pressed="${!!S.revise}" title="Me tester : cacher les réponses">${S.revise ? ico('eyeoff') : ico('eye')}</button>`)}
      <section class="part solo ctest" style="--c:${c}">
        <figure class="chero">${bpic(n)}${x.yt ? `<button class="cvid" data-vid="${x.yt}" data-yt="1" data-src="https://www.youtube.com/watch?v=${x.yt}" data-lab="Voir sur YouTube">${IC.play} Voir en vidéo</button>` : ''}</figure>
        <div class="chead"><div class="rt"><div class="n" style="color:${c}">ÉTAPE ${n} / ${BL.length}</div><h1>${esc(x.n)}</h1><div class="cq">${ico('target')} ${esc(x.why)}</div></div></div>
        ${S.revise ? `<div class="hint">${ico('eyeoff')} Mode test : récite l'étape, puis touche une ligne pour la voir. (${ico('eye')} en haut pour tout afficher)</div>` : ''}
        ${x.pos ? `<div class="body"><div class="h">Installation</div><ul class="who"><li><span class="em">${ico('person')}</span><span>${md(x.pos)}</span></li></ul></div>` : ''}
        ${x.b.map(bBlock).join('')}
        ${x.key ? `<div class="chips">${x.key.map(k => `<span class="chip">${esc(k)}</span>`).join('')}</div>` : ''}
        ${x.tip ? `<div class="ctip">${ico('bulb')} ${md(x.tip)}</div>` : ''}
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
      <div class="v3chips">${Object.entries(L3).map(([k, [l, c]]) => `<button class="v3l ${on3()[k] ? 'on' : ''}" data-v3l="${k}" aria-pressed="${!!on3()[k]}"><i style="background:${c}"></i>${l}</button>`).join('')}</div>
      <div class="v3zoom"><button data-v3z="1.6" aria-label="Zoomer">+</button><button data-v3z="0.625" aria-label="Dézoomer">−</button><button data-v3z="home" aria-label="Recentrer">${ico('refresh')}</button></div>
      <div class="v3sheet" id="v3sheet">${sheet3()}</div></div>`;
  }
  function sheet3() {
    const x = Q3.list && Q3.list[Q3.i], b = (a, t, c = 'var(--hl)', cls = 'grow') => `<button class="btn ${cls}" data-q3="${a}" style="--c:${c}">${t}</button>`;
    if (Q3.st === 'pick') return `<div class="kicker">TROUVE-LES SUR LE MODÈLE</div><div class="muted small">Glisse pour tourner, pince pour zoomer (ou + et −). Enlève des couches en haut pour atteindre les muscles profonds.</div>
      <div class="regpick">${['tout', ...REG_ORDER].map(r => { const it = r === 'tout' ? AQ : AQ.filter(a => a.reg === r); return `<button class="btn ghost" data-q3="go" data-r="${r}">${r === 'tout' ? 'Tout' : REG_SHORT[r]} <small>${it.length}</small></button>`; }).join('')}</div>`;
    if (Q3.st === 'end') { const n = Q3.list.length, miss = Q3.list.filter(a => !Q3.res[a.q]);
      return `<div class="qend">${ring(Q3.ok / n, Q3.ok / n >= .8 ? 'var(--p6)' : 'var(--p4)')}<div><div class="question">${Q3.ok} / ${n} trouvés</div>${miss.length ? `<div class="muted small">À revoir : ${miss.map(a => `<a href="#/anat/${a.q}">${esc(a.name)}</a>`).join(', ')}</div>` : ''}</div></div>
        <div class="row2">${b('again', '↻ Rejouer')}${b('pick', 'Autre région', 'var(--card)')}</div>`; }
    const head = `<div class="kicker">${esc(REG_SHORT[x.reg]).toUpperCase()} · ${x.group === 'Os' ? 'OS' : 'MUSCLE / TENDON'} · Q${x.q}</div>`;
    if (Q3.st === 'q') return `${head}<div class="question">Touche : ${esc(x.name)}</div>
      <div class="row2">${b('help', ico('bulb') + ' La zone', 'var(--card)')}${b('skip', 'Je ne sais pas', 'var(--card)')}</div>`;
    return `${head}<div class="question">${Q3.good ? '✓ Bien vu : ' : '✗ '}${esc(x.name)}</div>${!Q3.good && Q3.hit ? `<div class="muted small">Tu as touché : ${esc(Q3.hit)}</div>` : ''}
      ${x.o && x.t ? `<div class="v3ot"><div><i class="o">O</i><span><b>Origine</b> ${md(x.o)}</span></div><div><i class="t">T</i><span><b>Terminaison</b> ${md(x.t)}</span></div></div>` : ''}
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
    good ? r.ok++ : r.ko++; review('a:' + x.q, good); fx(good ? 'good' : 'bad');
    Object.assign(Q3, { st: 'a', good, hit }); if (good) { Q3.ok++; Q3.res[x.q] = 1; }
    if (V3) V3.show(x.q);
    upd3();
  }
  function q3Act(t) {
    const a = t.dataset.q3; fx(a === 'go' || a === 'again' ? 'start' : 'tap');
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
  // un muscle absent du modèle : des tubes lissés (Catmull-Rom) le long d'un chemin de points, avec un rayon à chaque point, fermés aux deux bouts
  function tubeGeo(T, tubes) {
    const pos = [], idx = [], N = 10, S = 8, sub = (a, b) => a.map((x, i) => x - b[i]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], unit = a => { const l = Math.hypot(...a) || 1; return a.map(x => x / l); };
    for (const { p, r } of tubes) {
      const pts = [], rad = [];
      for (let i = 0; i < p.length - 1; i++) for (let s = 0; s < S; s++) {
        const u = s / S, P0 = p[Math.max(0, i - 1)], P1 = p[i], P2 = p[i + 1], P3 = p[Math.min(p.length - 1, i + 2)];
        pts.push([0, 1, 2].map(j => .5 * (2 * P1[j] + (P2[j] - P0[j]) * u + (2 * P0[j] - 5 * P1[j] + 4 * P2[j] - P3[j]) * u * u + (3 * P1[j] - P0[j] - 3 * P2[j] + P3[j]) * u * u * u)));
        rad.push(r[i] + (r[i + 1] - r[i]) * u);
      }
      pts.push(p[p.length - 1]); rad.push(r[r.length - 1]);
      const base = pos.length / 3, n = pts.length; let nr = null;
      pts.forEach((c, i) => {
        const t = unit(sub(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)]));
        nr = unit(nr ? sub(nr, t.map(x => x * dot(nr, t))) : cross(t, Math.abs(t[1]) < .9 ? [0, 1, 0] : [1, 0, 0]));
        const bi = cross(t, nr), rr = rad[i] * (i && i < n - 1 ? 1 : .4);
        for (let k = 0; k < N; k++) { const a = k / N * 2 * Math.PI, cs = Math.cos(a) * rr, sn = Math.sin(a) * rr; pos.push(c[0] + cs * nr[0] + sn * bi[0], c[1] + cs * nr[1] + sn * bi[1], c[2] + cs * nr[2] + sn * bi[2]); }
      });
      for (let i = 0; i < n - 1; i++) for (let k = 0; k < N; k++) { const a = base + i * N + k, b = base + i * N + (k + 1) % N; idx.push(a, a + N, b, b, a + N, b + N); }
      const c0 = pos.length / 3; pos.push(...pts[0], ...pts[n - 1]);
      for (let k = 0; k < N; k++) { idx.push(c0, base + (k + 1) % N, base + k, c0 + 1, base + (n - 1) * N + k, base + (n - 1) * N + (k + 1) % N); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(new Float32Array(pos), 3)); g.setIndex(new T.BufferAttribute(new Uint32Array(idx), 1)); return g;
  }
  function make3d(T, buf, cv) {
    const stage = cv.parentNode, mk = $('#v3mk');
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, .01, 20);
    scene.add(new T.HemisphereLight(0xfff6ea, 0x6d5b55, 1.15));
    const d1 = new T.DirectionalLight(0xffffff, 1.6); d1.position.set(1.5, 2, 2.5); scene.add(d1);
    const d2 = new T.DirectionalLight(0xffe2cf, .7); d2.position.set(-2, .5, -2); scene.add(d2);
    // le pincement zoome vers les doigts (pas vers le centre) : on va droit à la zone qu'on regarde
    const ctl = new T.OrbitControls(cam, cv); ctl.enableDamping = true; ctl.dampingFactor = .09; ctl.minDistance = .05; ctl.maxDistance = 4; ctl.zoomToCursor = true; ctl.zoomSpeed = 1.15;
    const grp = new T.Group(); scene.add(grp);
    const dv = new DataView(buf), meshes = [], byKey = {};
    // chaque muscle a sa nuance (teinte et clarté) pour qu'on voie où l'un finit et où l'autre commence ; tendons et tractus en blanc nacré
    const addMesh = (key, fr, layer, g) => {
      g.computeVertexNormals(); g.computeBoundingSphere();
      const n = meshes.length, c = new T.Color(/^(achille|tractus-it)$/.test(key) ? '#E2DACB' : L3[layer][1]);
      if (layer !== 'os' && !/^(achille|tractus-it)$/.test(key)) c.offsetHSL(((n * 7) % 9 - 4) * .011, ((n * 5) % 7 - 3) * .03, ((n * 11) % 9 - 4) * .045);
      const veil = key === 'tractus-it';   // le tractus ilio-tibial est une lame : à moitié transparent, on voit (et on touche) le TFL et le vaste latéral dessous
      const mat = new T.MeshStandardMaterial({ color: c, roughness: layer === 'os' ? .82 : .55, metalness: 0, side: T.DoubleSide, transparent: veil, opacity: veil ? .45 : 1, depthWrite: !veil });
      const m = new T.Mesh(g, mat); m.userData = { key, fr, layer, mat, veil }; if (veil) m.renderOrder = 2; grp.add(m); meshes.push(m); byKey[key] = m;
    };
    window.ANAT3D.forEach(([key, fr, layer, vo, vc, io, ic, isz]) => {
      if (!L3[layer]) return;   // artères et veines : pas dans les 59
      const p = new Float32Array(vc * 3); for (let i = 0; i < vc * 3; i++) p[i] = dv.getInt16(vo + i * 2, true) / 32767 * .5;
      const idx = isz === 4 ? new Uint32Array(buf.slice(io, io + ic * 4)) : new Uint16Array(buf.slice(io, io + ic * 2));
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(p, 3)); g.setIndex(new T.BufferAttribute(idx, 1)); addMesh(key, fr, layer, g);
    });
    (window.ANAT3D_X || []).forEach(x => addMesh(x.key, x.fr, x.layer, tubeGeo(T, x.tubes)));   // les petits muscles du pied absents du modèle
    const box = new T.Box3().setFromObject(grp), size = box.getSize(new T.Vector3());
    grp.position.sub(box.getCenter(new T.Vector3())); grp.updateMatrixWorld(true);
    const mat = (c, e) => new T.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: .45, roughness: .45, side: T.DoubleSide });
    const mGood = mat(0x2FB36B, 0x0b5a2c), mBad = mat(0xE04A3F, 0x6a120c);
    const mGhost = new T.MeshStandardMaterial({ color: 0xC2504D, roughness: .6, transparent: true, opacity: .16, depthWrite: false, side: T.DoubleSide }), DEPTH = { m1: 1, m2: 2, m3: 3, os: 0 };
    const layers = () => meshes.forEach(m => (m.visible = !!on3()[m.userData.layer]));
    layers();
    // le modèle se cadre dans la bande libre, entre les boutons du haut et le panneau du bas (décalage de l'image, sans bouger la caméra)
    let W = 1, H = 1, BH = 1;
    const TAN = Math.tan(16 * Math.PI / 180);
    const fit = () => {
      W = stage.clientWidth; H = stage.clientHeight; renderer.setSize(W, H, false);
      const sr = stage.getBoundingClientRect(), ch = $('.v3chips'), sh = $('#v3sheet');
      const t = ch ? ch.getBoundingClientRect().bottom - sr.top + 4 : 0, b = sh ? sh.getBoundingClientRect().top - sr.top - 4 : H;
      BH = Math.max(120, b - t); const d = (t + b) / 2 - H / 2, H2 = H + 2 * Math.abs(d);
      cam.fov = 2 * Math.atan(TAN * H2 / BH) * 180 / Math.PI; cam.aspect = W / H2; cam.setViewOffset(W, H2, 0, d > 0 ? 0 : -2 * d, W, H); cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(fit); ro.observe(stage); fit();
    const shRo = new ResizeObserver(fit); if ($('#v3sheet')) shRo.observe($('#v3sheet'));
    // la distance pour voir une boîte (hauteur h, largeur w) dans la bande libre
    const dist = (h, w) => Math.max(h * .56, w * .56 * BH / W) / TAN;
    let anim = null;
    const fly = (pos, tgt) => { const p0 = cam.position.clone(), t0 = ctl.target.clone(), s0 = performance.now();
      anim = now => { const k = Math.min(1, (now - s0) / 650), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; cam.position.lerpVectors(p0, pos, e); ctl.target.lerpVectors(t0, tgt, e); if (k >= 1) anim = null; }; };
    // les régions : on arrive directement sur le pied, la jambe ou la cuisse, vues de trois quarts
    const REG3 = { pied: [['calcaneus', 'talus', 'm1', 'm5', 'p1-3', 'p5-3'], [-.25, .85, 1]], jambe: [['tibia', 'fibula'], [-.25, .1, 1]], cuisse: [['os-coxal', 'femur'], [-.3, .1, 1]] };
    const view = r => { const R = REG3[r];
      if (!R) return [new T.Vector3(0, 0, dist(size.y, size.x)), new T.Vector3(0, 0, 0)];
      const b = new T.Box3(); R[0].forEach(k => byKey[k] && b.expandByObject(byKey[k])); const c = b.getCenter(new T.Vector3()), s = b.getSize(new T.Vector3());
      return [c.clone().add(new T.Vector3(...R[1]).normalize().multiplyScalar(dist(s.y, Math.hypot(s.x, s.z)) * 1.1)), c]; };
    { const [p, t] = view(); cam.position.copy(p); ctl.target.copy(t); ctl.update(); }
    // cible d'une question : centre des pièces, ou point sur l'os
    const T3 = window.ANAT3D_T, R0 = .03, W3 = v => grp.localToWorld(new T.Vector3(...v));
    const tgtOf = q => { const t = T3[q];
      if (t.p) return { c: W3(t.p), r: .06 };
      const ms = t.m.map(k => byKey[k]).filter(Boolean), b = new T.Box3(); ms.forEach(m => b.expandByObject(m));
      return { c: b.getCenter(new T.Vector3()), r: b.getSize(new T.Vector3()).length() / 2 }; };
    const pts = [];   // repères affichés : { v: Vector3, cls, txt }
    const reset = () => { meshes.forEach(m => (m.material = m.userData.mat)); pts.length = 0; };
    const api = {
      home() { reset(); fly(...view(Q3 && Q3.reg)); },
      zoom(k) { const tg = ctl.target, off = cam.position.clone().sub(tg); fly(tg.clone().add(off.multiplyScalar(k)), tg.clone()); },
      show(q, hintOnly) {
        // on se place du côté de la cible : de l'os le plus proche vers elle (un muscle postérieur se montre de dos, un muscle plantaire par en dessous)
        const t = T3[q], g = tgtOf(q), cur = cam.position.clone().sub(ctl.target).normalize(), wc = m => m.geometry.boundingSphere.center.clone().applyMatrix4(m.matrixWorld);
        const bone = meshes.filter(m => m.userData.layer === 'os').reduce((b, m) => (!b || wc(m).distanceTo(g.c) < wc(b).distanceTo(g.c) ? m : b), null);
        const out = bone ? g.c.clone().sub(wc(bone)) : new T.Vector3(); if (bone && /^(tibia|fibula|femur|os-coxal|patella)$/.test(bone.userData.key)) out.y = 0;   // os long : seulement le côté (devant, derrière, dehors, dedans)
        const dir = out.length() > .004 ? out.normalize().multiplyScalar(.75).add(cur.multiplyScalar(.25)).add(new T.Vector3(0, .15, 0)).normalize() : cur;
        fly(g.c.clone().add(dir.multiplyScalar(Math.max(g.r * 1.15 / TAN, t.p ? .38 : .2))), g.c);   // on voit le muscle entier, de son origine à sa terminaison
        if (hintOnly) return;
        if (t.m) { t.m.forEach(k => byKey[k] && (byKey[k].material = mGood));
          // rayons X : les muscles plus superficiels que la réponse deviennent transparents, on voit le muscle profond en entier
          const deep = Math.max(...t.m.map(k => byKey[k] ? DEPTH[byKey[k].userData.layer] : 0));
          meshes.forEach(m => { const d = DEPTH[m.userData.layer]; if (d && d < deep && !t.m.includes(m.userData.key)) m.material = mGhost; }); }
        else pts.push({ v: g.c, cls: 'good' });
        if (t.o) pts.push({ v: W3(t.o), cls: 'o', txt: 'O' });
        if (t.t) (Array.isArray(t.t[0]) ? t.t : [t.t]).forEach(p => pts.push({ v: W3(p), cls: 't', txt: 'T' }));
      },
      mark() { mk.innerHTML = pts.map(p => `<i class="${p.cls}">${p.txt || ''}</i>`).join(''); },
      fit,
      dispose() { cancelAnimationFrame(raf); ro.disconnect(); shRo.disconnect(); ctl.dispose && ctl.dispose(); meshes.forEach(m => m.geometry.dispose()); renderer.dispose(); },
    };
    // un toucher (pas un glissement) : on regarde ce qui est sous le doigt. Pour aider, on regarde aussi un peu autour (14 px)
    // et juste derrière une lame fine : toucher le muscle à travers le tractus ou un tendon compte.
    const rc = new T.Raycaster(); let down = null;
    const hits = (x, y) => { const r = cv.getBoundingClientRect(); rc.setFromCamera(new T.Vector2((x - r.left) / r.width * 2 - 1, -(y - r.top) / r.height * 2 + 1), cam);
      return rc.intersectObjects(meshes.filter(m => m.visible && !m.userData.veil), false); };
    cv.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY, performance.now()]; });
    cv.addEventListener('pointerup', e => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 8 || performance.now() - down[2] > 450 || !Q3 || Q3.st !== 'q') return;
      const h0 = hits(e.clientX, e.clientY), hit = h0[0];
      if (!hit) return;
      const x = Q3.list[Q3.i], t = T3[x.q], R = 14;
      let good;
      if (t.m) { const inT = h => h && t.m.includes(h.object.userData.key);
        good = inT(hit) || h0.some(h => inT(h) && h.distance - hit.distance < .012) || [[R, 0], [-R, 0], [0, R], [0, -R]].some(([dx, dy]) => inT(hits(e.clientX + dx, e.clientY + dy)[0])); }
      else { const c = tgtOf(x.q).c, v = c.clone().project(cam), r = cv.getBoundingClientRect(), sx = (v.x + 1) / 2 * r.width + r.left, sy = (1 - v.y) / 2 * r.height + r.top;
        good = hit.point.distanceTo(c) < R0 * 1.25 * (t.r || 1) || (Math.hypot(sx - e.clientX, sy - e.clientY) < 26 && hit.point.distanceTo(c) < R0 * 3); }
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

  // ---------- jeux : apprendre une fiche, survie, les paires, qui suis-je, le patient ----------
  let G = null, gTimer = 0;
  const GAMES = { apprendre: 'Apprendre une fiche', survie: 'Survie', paires: 'Les paires', quisuisje: 'Qui suis-je ?', patient: 'Le patient', aventure: 'Podo Quest' };
  const QZ = window.QUIZ || {}, CAS = window.CAS || {};
  const STD = ALLF.filter(f => f.parts.length === 8 && f.memo && f.memo.length === 8 && /^Signes cliniques/.test(f.parts[3].title) && /^Traitement/.test(f.parts[5].title)
    && f.memo[3].q === 'On voit quoi ?' && f.memo[4].q === 'Sûr comment ?' && f.memo[5].q === 'On fait quoi ?');   // les fiches au plan classique
  const MUS = AQ.filter(x => x.nerf);
  // les fiches qui ressemblent le plus à une fiche (mots en commun dans le titre et les mots-clés) : c'est là qu'on prend les pièges, pour qu'ils soient du même sujet
  const wordsOf = f => new Set(norm(f.title + ' ' + (f.memo || []).map(m => m.k).join(' ')).match(/[a-z]{5,}/g) || []), NEAR = {};
  const near = f => NEAR[f.id] = NEAR[f.id] || ALLF.filter(g => g !== f && g.sec === f.sec).map(g => [[...wordsOf(g)].filter(w => wordsOf(f).has(w)).length, g]).sort((x, y) => y[0] - x[0]).map(x => x[1]);
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const distinct = (list, n, key) => shuffle(list).filter((y, i, a) => a.findIndex(z => key(z) === key(y)) === i).slice(0, n);
  const best = (k, v) => { const r = S.rec = S.rec || {}; if (v > (r[k] || 0)) { r[k] = v; save(); return true; } return false; };
  const gStop = () => { clearTimeout(gTimer); if (G && G.game === 'aventure') AV.stop(); G = null; };   // on quitte Podo Quest : le micro se coupe
  // chrono : la barre est une animation CSS décalée du temps déjà écoulé, pour survivre à un nouveau rendu
  function gClock(sec, fn) { clearTimeout(gTimer); G.t0 = Date.now(); G.dur = sec; G.el = null; G.fn = fn; gTimer = setTimeout(fn, sec * 1000); }
  const gFreeze = () => { clearTimeout(gTimer); G.el = (Date.now() - G.t0) / 1000; };
  const gBar = () => `<div class="gtime"><i style="animation-duration:${G.dur}s;animation-delay:${-(G.el != null ? G.el : (Date.now() - G.t0) / 1000)}s${G.el != null ? ';animation-play-state:paused' : ''}"></i></div>`;
  const gOpts = () => `<div class="opts">${G.opts.map((o, j) => `<button class="opt ${G.pick != null ? (o === G.ok ? 'good' : j === G.pick ? 'bad' : 'dim') : ''}" data-g="pick" data-j="${j}" ${G.pick != null ? 'disabled' : ''}>${md(o)}</button>`).join('')}</div>`;
  const gEnd = (big, msg, extra = '', btns = '') => `<div class="card gover"><div class="gscore">${big}</div><div class="question">${msg}</div></div>${extra}
    <div class="pager fixed">${btns || '<button class="btn grow" data-g="again" style="--c:var(--hl)">↻ Rejouer</button><button class="btn ghost grow" data-g="setup">Changer le choix</button>'}</div>`;
  const HEART = on => `<svg class="hrt${on ? ' on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-8-5-8-10.8a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 5.8-8 10.8-8 10.8z"/></svg>`;
  const STAR = on => `<svg class="star${on ? ' on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>`;

  // --- le choix du joueur : les matières, puis telle fiche ou telle région. S.goff = ce qui est décoché (rien = tout).
  const akey = x => `a:${x.reg}:${x.kind === 'os' ? 'os' : 'mus'}`;
  const GROUPS = [
    { k: 'pedi', n: 'Pédicurie', c: 'var(--p6)', it: PEDI.map(f => ['f:' + f.id, `${f.n}. ${f.title}`]) },
    { k: 'podo', n: 'Podologie', c: 'var(--p8)', it: PODO_OK.map(f => ['f:' + f.id, `${f.n}. ${f.title}`]) },
    { k: 'anat', n: 'Anatomie', c: 'var(--p1)', it: REG_ORDER.flatMap(r => [[`a:${r}:os`, `${REG_SHORT[r]} · les os`], [`a:${r}:mus`, `${REG_SHORT[r]} · les muscles`]]) },
    { k: 'clin', n: 'Examen clinique', c: 'var(--p4)', it: CS.map((s, i) => [`c:${i}`, `${i + 1}. ${s.t}`]) },
  ];
  const groupsOf = a => GROUPS.filter(g => g.it.length && (a === 'patient' ? (g.k === 'pedi' || g.k === 'podo') : a === 'paires' ? g.k !== 'clin' : true));
  const on = k => !(S.goff || {})[k];
  const selF = () => ALLF.filter(f => on('f:' + f.id)), selA = () => AQ.filter(x => on(akey(x))), selC = () => CL.filter(c => on('c:' + c.s));
  // ce que chaque jeu peut tirer du choix
  const anatQ = x => {   // une question d'anatomie fabriquée : le nerf, la terminaison, ou « on palpe quoi ? »
    const same = AQ.filter(y => y !== x && (x.kind === 'os') === (y.kind === 'os')), kinds = x.nerf ? ['nerf', 't', 'how'] : ['how'], k = rnd(kinds);
    const mk = (q, ok, bad) => ({ q, ok, opts: shuffle([ok, ...distinct(bad.filter(b => b && b !== ok), 3, b => b)]) });
    if (k === 'nerf') return mk(`Quel nerf innerve : **${x.name}** ?`, x.nerf, MUS.map(y => y.nerf));
    if (k === 't' && x.t) return mk(`Où se termine : **${x.name}** ?`, x.t, MUS.map(y => y.t));
    return mk(`On palpe quoi ? ${x.how}`, x.name, same.map(y => y.name));
  };
  const clinQ = c => {
    const n = CL.indexOf(c) + 1, oth = CL.filter(y => y !== c);
    return Math.random() < 0.5
      ? { q: `Quel test cherche : **${c.cherche}** ?`, ok: c.n, opts: shuffle([c.n, ...distinct(oth.map(y => y.n), 3, x => x)]) }
      : { q: `Que cherche le test : **${c.n}** ?`, ok: c.cherche, opts: shuffle([c.cherche, ...distinct(oth.map(y => y.cherche), 3, x => x)]) };
  };
  const poolSurvie = () => [
    ...selF().flatMap(f => (QZ[f.id] || []).flatMap((z, p) => z.q.filter(s => s.includes(' || ')).map(s => ({ lab: `${f.n}. ${f.title}`, c: PCOL(p), link: `${FB(f)}/p${p + 1}`, mk: () => mkStep(p + 1, s) })))),
    ...selA().map(x => ({ lab: `Anatomie · ${REG_SHORT[x.reg]}`, c: RCOL[x.reg], link: `#/anat/${x.q}`, mk: () => anatQ(x) })),
    ...selC().map(c => ({ lab: `Clinique · ${CS[c.s].t}`, c: SCOL(c.s), link: `#/clin/${CL.indexOf(c) + 1}`, mk: () => clinQ(c) }))];
  const poolPairesF = () => selF().filter(f => STD.includes(f)), poolPairesA = () => selA().filter(x => x.nerf);
  const poolQsj = all => [
    ...(all ? ALLF : selF()).map(f => ({ kind: 'f', f, id: 'f:' + f.id, title: f.title, lab: `${SECN(f)} · fiche`, c: f.sec === 'podo' ? 'var(--p8)' : 'var(--p6)', link: FB(f) })),
    ...(all ? AQ : selA()).map(x => ({ kind: 'a', x, id: 'a:' + x.q, title: x.name, lab: `Anatomie · ${REG_SHORT[x.reg]}`, c: RCOL[x.reg], link: `#/anat/${x.q}` })),
    ...(all ? CL : selC()).map(c => ({ kind: 'c', cl: c, id: 'c:' + (CL.indexOf(c) + 1), title: c.n, lab: `Examen clinique · ${CS[c.s].t}`, c: SCOL(c.s), link: `#/clin/${CL.indexOf(c) + 1}` }))];
  const poolOf = a => a === 'survie' ? poolSurvie() : a === 'paires' ? [...poolPairesF(), ...poolPairesA()] : a === 'quisuisje' || a === 'aventure' ? poolQsj() : selF().filter(f => CAS[f.id]);
  function setup(a) {
    const r = (S.rec || {})[a], sub = a === 'patient' ? ' · 3 consultations (/30)' : a === 'quisuisje' ? ' · 10 énigmes (/40)' : '';
    return `<div class="wrap qz">${top('#/', GAMES[a], r ? `<span class="count">record ${r}${a === 'patient' ? '/30' : a === 'quisuisje' ? '/40' : ''}</span>` : '')}
      <div class="qpart" style="--c:var(--ink)">Tu révises quoi ?${sub}</div>
      ${groupsOf(a).map(g => `<div class="gsel" style="--c:${g.c}"><button class="ck gh" data-g="grp" data-k="${g.k}"><span class="box"></span><b>${g.n}</b><span class="muted gn"></span></button>
        <details><summary>Choisir dans la liste</summary><div class="checks">${g.it.map(([k, t]) => `<button class="ck" data-g="tog" data-k="${k}"><span class="box"></span><span>${esc(t)}</span></button>`).join('')}</div></details></div>`).join('')}
      <div class="pager fixed"><button class="btn grow" id="ggo" data-g="go" style="--c:var(--hl)">Jouer →</button></div></div>`;
  }
  function gSync() {   // met les cases à jour sans tout redessiner (les listes restent ouvertes)
    if (!G || !G.setup) return;
    document.querySelectorAll('.gsel').forEach(el => {
      const bs = [...el.querySelectorAll('[data-g="tog"]')]; bs.forEach(b => b.classList.toggle('on', on(b.dataset.k)));
      const n = bs.filter(b => on(b.dataset.k)).length; el.querySelector('.gh').classList.toggle('on', n > 0); el.querySelector('.gn').textContent = `${n}/${bs.length}`;
    });
    const go = $('#ggo'), n = poolOf(G.game).length; if (go) { go.disabled = !n; go.innerHTML = n ? 'Jouer →' : 'Rien à jouer avec ce choix'; }
  }
  function setupAct(t) {
    const off = S.goff = S.goff || {}, k = t.dataset.k;
    if (t.dataset.g === 'tog') { if (off[k]) delete off[k]; else off[k] = 1; }
    else { const it = GROUPS.find(g => g.k === k).it, all = it.every(x => on(x[0])); it.forEach(x => { if (all) off[x[0]] = 1; else delete off[x[0]]; }); }   // tout coché → tout décocher, sinon tout cocher
    save(); gSync();
  }

  // --- survie : 3 vies, le temps par question raccourcit (15 s → 7 s), les bonnes réponses d'affilée rapportent plus (jusqu'à ×5)
  function svDraw() {
    if (!G.deck.length) G.deck = shuffle(G.pool);
    const c = G.cur = G.deck.pop(), st = c.mk();
    Object.assign(G, { opts: st.opts, ok: st.ok, q: st.q, pick: null }); G.n++;
    gClock(Math.max(7, 15 - (G.n - 1) * 0.5), () => svAnswer(-1));
  }
  function svAnswer(j) {
    if (!G || G.pick != null) return;
    const ok = G.opts[j] === G.ok; gFreeze(); G.pick = j; did(1);
    if (ok) { G.combo++; G.score += Math.min(G.combo, 5); }
    else { G.combo = 0; G.lives--; G.missed.push([G.q, G.ok, G.cur.link]); G.deck.splice(Math.max(0, G.deck.length - 5), 0, G.cur); }   // ratée : elle revient 5 questions plus loin
    fx(ok ? 'good' : 'life', ok ? Math.min(G.combo - 1, 5) * 2 : 0);   // les bonnes réponses d'affilée montent
    render(true);
    gTimer = setTimeout(() => { if (G.lives > 0) svDraw(); else { G.over = true; G.isRec = best('survie', G.score); fx(G.isRec ? 'record' : 'over'); } render(); }, ok ? 800 : 2200);
  }
  // --- les paires : 60 s pour relier 4 fiches à leurs mots-clés (ou 4 muscles à leur nerf) ; une erreur coûte 3 s
  function prDraw() {
    const fs = poolPairesF(), ms = poolPairesA(), anat = Math.random() * (fs.length + ms.length) < ms.length;
    // 4 du choix ; s'il y en a moins, on complète avec d'autres de la même matière
    const four = (mine, all, key) => { const a = distinct(mine, 4, key); return a.concat(distinct(all.filter(y => !a.some(z => key(z) === key(y))), 4 - a.length, key)); };
    let it, label;
    if (anat) { it = four(ms, MUS, x => x.nerf).map(x => [x.q, x.name, x.nerf]); label = 'Quel nerf pour quel muscle ?'; }
    else { const j = rnd([1, 3, 4, 5]), f0 = rnd(fs), fam = [f0, ...near(f0).slice(0, 6)].filter(f => fs.includes(f)), a = four(fam.length >= 4 ? fam : fs.filter(f => f.sec === f0.sec), STD.filter(f => f.sec === f0.sec), f => f.memo[j].k); it = a.map(f => [f.id, f.title, f.memo[j].k]); label = a[0].memo[j].q; }
    Object.assign(G, { L: shuffle(it.map(x => [x[0], x[1]])), R: shuffle(it.map(x => [x[0], x[2]])), label, sel: null, found: {}, bad: null });
  }
  function prTap(side, j) {
    if (G.over) return;
    const id = G[side][j][0]; if (G.found[id]) return;
    if (!G.sel || G.sel.side === side) { G.sel = { side, j, id }; G.bad = null; fx('tick'); }
    else if (G.sel.id === id) { fx('pair', Object.keys(G.found).length * 2); G.found[id] = 1; G.score++; G.sel = null; if (Object.keys(G.found).length === G.L.length) { did(1); prDraw(); } }
    else { fx('bad'); G.bad = { [side]: j, [G.sel.side]: G.sel.j }; G.sel = null; G.t0 -= 3000; clearTimeout(gTimer); gTimer = setTimeout(G.fn, Math.max(0, G.t0 + G.dur * 1000 - Date.now())); }
    render(true);
  }

  // --- qui suis-je ? : 4 indices progressifs (4, 3, 2, 1 pt), on cherche dans sa tête avant de dévoiler les 4 choix ; 10 énigmes par partie
  const STOP_W = new Set(['les', 'des', 'une', 'dans', 'pour', 'avec', 'sur', 'aux', 'par', 'plus', 'sous', 'entre', 'chez', 'son', 'ses', 'syndrome', 'maladie', 'test', 'signe', 'signes', 'atteinte', 'atteintes', 'trouble', 'troubles', 'pied', 'pieds', 'membre', 'membres', 'examen', 'clinique', 'bilan', 'douleur', 'douleurs', 'jambe', 'cuisse', 'hanche', 'bassin', 'genou', 'cheville', 'orteil', 'orteils', 'tendon', 'muscle', 'muscles', 'nerf', 'artere', 'veine', 'inter', 'capito', 'posterieur', 'anterieur', 'medial', 'lateral', 'interne', 'externe']);
  function maskTitle(txt, title) {
    if (!txt) return '';
    const stems = (norm(title).match(/[a-z0-9]{4,}/g) || []).filter(w => !STOP_W.has(w)).map(w => w.slice(0, Math.max(4, w.length - 2)));
    if (!stems.length) return String(txt);
    return String(txt).replace(/[a-zA-ZÀ-ÿ0-9]{4,}/g, w => stems.some(s => norm(w).startsWith(s)) ? '•••' : w);
  }
  function qsjClues(it) {
    if (it.kind === 'f') {
      const f = it.f, m = f.memo || [];   // les mots-clés de la fiche (courts), du moins parlant au plus parlant : mécanisme, cause, traitement, signes
      return [2, 1, 5, 3].map((i, n) => [m[i] ? m[i].q : 'Indice ' + (n + 1), maskTitle((m[i] && m[i].k) || '', f.title)]);
    }
    if (it.kind === 'a') {
      const x = it.x;
      if (x.nerf) return [
        ['Action principale', maskTitle(x.act || x.regName, x.name)],
        ['Innervation', maskTitle(x.nerf, x.name)],
        ['Insertions', maskTitle(`Origine : ${x.o || '—'} → Terminaison : ${x.t || '—'}`, x.name)],
        ['Comment le palper', maskTitle(x.how, x.name)],
      ];
      return [
        ['Région & groupe', `${x.regName} · ${x.group}`],
        ['Insertions / rapports', maskTitle(x.ins || x.chk || x.pos || 'Repère osseux', x.name).split('\n')[0]],
        ['Position & repérage', maskTitle([x.pos, (x.chk || '').split('\n')[0]].filter(Boolean).join(' · '), x.name)],
        ['Comment le palper', maskTitle(x.how, x.name)],
      ];
    }
    const c = it.cl;
    return [
      ['Section & installation', `${CS[c.s].t} · ${maskTitle(c.pat, c.n)}`],
      ['Le geste', maskTitle(c.steps.slice(0, 2).join(' '), c.n)],
      ['Positif si…', maskTitle(c.pos && c.pos[0] ? c.pos[0].join(' → ') : c.norm, c.n)],
      ['Ce qu\'on cherche', maskTitle(c.cherche, c.n)],
    ];
  }
  function qsjOpts(it) {
    if (it.kind === 'f') {
      const f = it.f;   // les pièges : 3 des 6 fiches les plus proches
      return shuffle([f.title, ...distinct(near(f).slice(0, 6).map(x => x.title), 3, x => x)]);
    }
    if (it.kind === 'a') {
      const x = it.x, same = AQ.filter(y => y !== x && (y.kind === 'os') === (x.kind === 'os'));
      return shuffle([x.name, ...distinct(same.map(y => y.name), 3, y => y)]);
    }
    const c = it.cl, same = CL.filter(y => y !== c && y.s === c.s), pool = same.length >= 3 ? same : CL.filter(y => y !== c);
    return shuffle([c.n, ...distinct(pool.map(y => y.n), 3, y => y)]);
  }
  function qsDraw() {
    if (!G.deck.length) G.deck = shuffle(G.pool);
    const cur = G.cur = G.deck.pop(); G.n++;
    Object.assign(G, { clues: qsjClues(cur), opts: qsjOpts(cur), ok: cur.title, rev: 1, showOpts: false, pick: null, pts: 0 });
  }
  function qsAnswer(j) {
    if (G.pick != null) return;
    const ok = G.opts[j] === G.ok, pts = ok ? 5 - G.rev : 0;
    G.pick = j; G.pts = pts; G.score += pts; did(1);
    if (ok) fx(pts === 4 ? 'star' : 'good', (pts - 1) * 2);
    else { fx('bad'); if (!G.miss.some(m => m.id === G.cur.id)) G.miss.push(G.cur); }
    if (G.cur.kind === 'f' || G.cur.kind === 'a') review(G.cur.id, ok);
    render(true);
  }
  function qsNext() {
    if (G.n >= G.tot) { G.over = true; G.isRec = best('quisuisje', G.score); fx(G.isRec ? 'record' : G.score >= G.tot * 2.5 ? 'win' : 'over'); }
    else qsDraw();
    render();
  }

  // --- le patient : une consultation en 5 étapes (le dossier qu'on dévoile, diagnostic + pourquoi pas les autres, orientation, traitement, question du patient) puis la fiche en mots-clés
  const ORIENTS = [
    ['Cabinet : je prends en charge', 'Soins de pédicurie, semelles ou conseils au cabinet, sans urgence médicale.'],
    ['Cabinet + avis médical', 'Je réalise les soins / conseils utiles et j\'adresse au médecin (sans urgence vitale).'],
    ['Urgence médicale immédiate', 'Drapeau rouge : j\'adresse tout de suite au médecin ou aux urgences.'],
  ];
  function ptDraw() {
    if (!G.deck.length) G.deck = shuffle(G.pool);
    const f = G.f = G.deck.pop(), c = G.c = CAS[f.id]; G.n++;
    const tt = shuffle(c.tt.map(a => [a[0], a[1]]));
    Object.assign(G, { step: 0, pScore: 0, seen: {}, dxOpts: shuffle([c.dx, ...c.ddx.map(d => d[0])]), dxPick: null, orPick: null, tt, ticks: [], ttDone: false, nYes: tt.filter(a => a[1]).length, csOpts: shuffle([c.conseil.ok, ...c.conseil.ko]), csPick: null });
  }
  function ptStepBar() {
    const labs = ['1. Dossier', '2. Diagnostic', '3. Orientation', '4. Traitement', '5. Conseil'];
    return `<div class="ptsteps">${labs.map((l, i) => `<span class="ptst ${i < G.step ? 'done' : i === G.step ? 'now' : ''}">${l}</span>`).join('')}</div>`;
  }
  // ce que le patient répond et ce qu'on trouve à l'examen : seulement ce qui compte (plus de fausses questions hors sujet à écarter)
  const ptAsk = c => `<ul>${c.ask.filter(a => a[2]).map(a => `<li>${esc(a[0])}<br><i>« ${esc(a[1])} »</i></li>`).join('')}</ul>`;
  const ptExam = c => c.exam.filter(a => a[2]).map(a => a[3] && CL[a[3] - 1] ? `<div class="ptclin">${pic(a[3], 'ptsvg')}<div><b>${esc(CL[a[3] - 1].n)}</b><br>${md(a[1])}</div></div>` : `<div class="ptfind"><b>${esc(a[0])}</b><br>${md(a[1])}</div>`).join('');
  function ptDossier() {   // le dossier reste sous les yeux, replié, après l'étape 1
    if (G.step < 1) return '';
    return `<details class="ptdos"><summary>${ico('clipboard')} Revoir le dossier</summary><div class="ptdosb"><div><b>Interrogatoire :</b>${ptAsk(G.c)}</div><div><b>Examen clinique :</b>${ptExam(G.c)}</div></div></details>`;
  }
  function ptView() {
    const f = G.f, c = G.c, head = `<div class="wrap qz">${top('#/', 'Le patient', count(`Patient ${G.n}/${G.tot}`, `${G.score} pts`))}`;
    const next = txt => `<div class="pager fixed"><button class="btn grow" data-g="ptstep" style="--c:var(--hl)">${txt}</button></div>`;
    if (G.step === 5) {   // bilan de CE patient, avec la fiche en mots-clés à redire
      return `${head}<div class="card gover"><div class="kicker">${esc(c.nom.toUpperCase())}, ${c.age} ANS · ${SECN(f).toUpperCase()}</div>
        <div class="gscore">${G.pScore}/10</div><div class="question">${esc(f.n + '. ' + f.title)}</div>
        <div class="ptcle">${md(c.cle)}</div></div>
        <div class="card"><div class="kicker">LA FICHE EN MOTS-CLÉS : REDIS-LA À VOIX HAUTE</div><ul class="aplist">${(f.memo || []).map(r => `<li><b>${esc(r.q)}</b> ${md(r.k)}</li>`).join('')}</ul>
        <div class="row2" style="margin-top:12px"><a class="btn ghost grow" href="${FB(f)}">${ico('book')} Voir la fiche</a><a class="btn ghost grow" href="#/jeu/apprendre/${f.id}">${ico('sparkle')} Apprendre ${stars(f.id)}</a></div></div>
        <div class="pager fixed"><button class="btn grow" data-g="ptnext" style="--c:var(--hl)">${G.n < G.tot ? `Patient suivant (${G.n + 1}/${G.tot}) →` : 'Voir le bilan final →'}</button></div></div>`;
    }
    const banner = `<div class="card ptcard"><div class="pttop"><span class="stamp sm" style="--c:${f.sec === 'podo' ? 'var(--p8)' : 'var(--p6)'}">${ico('person')}</span>
      <div class="ptwho"><div class="kicker">PATIENT ${G.n}/${G.tot} · ${SECN(f).toUpperCase()} · ${G.pScore} PT${G.pScore > 1 ? 'S' : ''}</div>
      <div class="ptname"><b>${esc(c.nom)}</b>, ${c.age} ans <span class="muted">· ${esc(c.qui)}</span></div></div></div>
      <div class="ptmotif">« ${esc(c.motif)} »</div>${ptStepBar()}${ptDossier()}</div>`;
    const opts = (list, pk, good, act, fmt = md) => `<div class="opts">${list.map((o, j) => `<button class="opt ${pk != null ? (good(o, j) ? 'good' : j === pk ? 'bad' : 'dim') : ''}" data-g="${act}" data-j="${j}" ${pk != null ? 'disabled' : ''}>${fmt(o)}</button>`).join('')}</div>`;

    if (G.step === 0) {   // 1. le dossier : on cherche d'abord dans sa tête ce qu'on demanderait et ce qu'on examinerait, puis on dévoile
      const sec = (k, t, hint, html) => G.seen[k] ? `<div class="ptfold"><div class="kicker">${t}</div>${html}</div>`
        : `<button class="ptitem" data-g="ptsee" data-k="${k}"><div class="ptq"><span class="ptbul">?</span><span><b>${t}</b><br><span class="muted">${hint}</span></span></div></button>`;
      return `${head}${banner}<div class="card qc"><div class="kicker">ÉTAPE 1 · LE DOSSIER</div>
        <div class="question">Tu penses à quoi ?</div>
        <div class="muted small">Dis d'abord ce que tu demanderais et ce que tu chercherais, puis touche pour voir ce que ça donne.</div>
        <div class="ptlist">${sec('a', 'INTERROGATOIRE', 'Quelles questions tu lui poses ?', ptAsk(c))}${sec('e', 'EXAMEN CLINIQUE', 'Tu regardes quoi, tu testes quoi ?', ptExam(c))}</div></div>
        ${G.seen.a && G.seen.e ? next('Poser le diagnostic →') : ''}</div>`;
    }
    if (G.step === 1) {   // 2. diagnostic, puis pourquoi pas les autres
      const pk = G.dxPick;
      return `${head}${banner}<div class="card qc"><div class="kicker">ÉTAPE 2 · DIAGNOSTIC (4 PTS)</div>
        <div class="question">${esc(c.dxq || `Qu'est-ce qu'${c.sexe === 'f' ? 'elle' : 'il'} a ?`)}</div>
        ${opts(G.dxOpts, pk, o => o === c.dx, 'ptdx')}
        ${pk != null ? `<div class="answer">${md(c.cle)}</div>
          <div class="ptddx"><div class="kicker">POURQUOI PAS LES AUTRES ?</div>
          ${c.ddx.map(d => `<div class="ptddxi"><b>✗ ${esc(d[0])}</b> : ${md(d[1])}</div>`).join('')}</div>` : ''}</div>
        ${pk != null ? next('Continuer : orientation →') : ''}</div>`;
    }
    if (G.step === 2) {   // 3. orientation (cabinet / médecin / urgence)
      const pk = G.orPick;
      return `${head}${banner}<div class="card qc"><div class="kicker">ÉTAPE 3 · ORIENTATION (2 PTS)</div>
        <div class="question">Tu l'orientes comment ?</div>
        ${opts(ORIENTS, pk, (o, j) => j === c.orient, 'ptor', o => `<b>${esc(o[0])}</b><br><span class="muted" style="font-size:18px">${esc(o[1])}</span>`)}
        ${pk != null ? `<div class="answer">${md(c.orientWhy)}</div>` : ''}</div>
        ${pk != null ? next('Continuer : traitement →') : ''}</div>`;
    }
    if (G.step === 3) {   // 4. prise en charge : les bons gestes parmi des pièges du même sujet
      return `${head}${banner}<div class="card qc"><div class="kicker">ÉTAPE 4 · TRAITEMENT (2 PTS)</div>
        <div class="question">Qu'est-ce que tu fais ?</div>
        <div class="muted small">${G.ttDone ? 'En vert les bons gestes de la fiche, barrés les pièges ou les gestes hors compétence.' : `Coche les ${G.nYes} bons gestes pour ${esc(c.nom)}.`}</div>
        <div class="checks">${G.tt.map(([x, y], j) => `<button class="ck ${G.ticks.includes(j) ? 'on' : ''} ${G.ttDone ? (y ? 'yes' : 'no') : ''}" data-g="pttk" data-j="${j}" ${G.ttDone ? 'disabled' : ''}><span class="box"></span><span>${md(x)}</span></button>`).join('')}</div></div>
        <div class="pager fixed"><button class="btn grow" data-g="${G.ttDone ? 'ptstep' : 'pttval'}" style="--c:${G.ttDone ? 'var(--hl)' : 'var(--p6)'}">${G.ttDone ? 'Dernière étape : le conseil →' : `Valider · ${G.ticks.length}/${G.nYes}`}</button></div></div>`;
    }
    const pk = G.csPick;   // 5. la question du patient en partant
    return `${head}${banner}<div class="card qc"><div class="kicker">ÉTAPE 5 · LA QUESTION DE ${esc(c.nom.toUpperCase())} (2 PTS)</div>
      <div class="ptmotif" style="margin:6px 0 12px">« ${esc(c.conseil.q)} »</div>
      <div class="question">Tu lui réponds quoi ?</div>
      ${opts(G.csOpts, pk, o => o === c.conseil.ok, 'ptcs')}</div>
      ${pk != null ? next(`Voir le bilan de ${esc(c.nom)} →`) : ''}</div>`;
  }
  function ptAct(a, j, t) {
    const c = G.c, win = (ok, pts) => { if (ok) { G.pScore += pts; G.score += pts; } did(1); fx(ok ? 'good' : 'bad'); return ok; };
    if (a === 'ptsee') { G.seen[t.dataset.k] = 1; fx('reveal'); }
    else if (a === 'ptdx' && G.dxPick == null) { G.dxPick = j; if (!win(G.dxOpts[j] === c.dx, 4) && !G.miss.includes(G.f)) G.miss.push(G.f); }
    else if (a === 'ptor' && G.orPick == null) { G.orPick = j; win(j === c.orient, 2); }
    else if (a === 'pttk' && !G.ttDone) { fx('tick'); G.ticks = G.ticks.includes(j) ? G.ticks.filter(x => x !== j) : G.ticks.concat(j); }
    else if (a === 'pttval' && !G.ttDone) { G.ttDone = true; win(Math.max(0, G.ticks.reduce((s, k) => s + (G.tt[k][1] ? 1 : -1), 0) / G.nYes) >= 0.75, 2); }
    else if (a === 'ptcs' && G.csPick == null) { G.csPick = j; win(G.csOpts[j] === c.conseil.ok, 2); }
    else if (a === 'ptstep') {
      fx('tap'); G.step++;
      if (G.step === 5) { review('f:' + G.f.id, G.pScore >= 8); setTimeout(() => fx(G.pScore >= 8 ? 'star' : G.pScore >= 6 ? 'win' : 'tap'), 180); }
      return render();
    } else if (a === 'ptnext') {
      if (G.n >= G.tot) { G.over = true; G.isRec = best('patient', G.score); fx(G.isRec ? 'record' : G.score >= G.tot * 7 ? 'win' : 'over'); }
      else { fx('tap'); ptDraw(); }
      return render();
    }
    render(true);
  }

  // --- Podo Quest : le jeu d'aventure (aventure.js), branché sur les mêmes données et le même choix de matières
  const AV = window.AVENTURE && window.AVENTURE({ S, save, esc, md, ico, shuffle, rnd, fx, did, review, top, count, QZ, CAS, mkStep, anatQ, clinQ, qsjClues, qsjOpts,
    g: () => G, setG: x => { G = x; }, render: k => render(k), pool: () => poolQsj(), all: () => poolQsj(true) });
  function gStart(a) {
    const pool = poolOf(a); gStop();
    if (!pool.length) { G = { game: a, setup: true }; return; }
    if (a === 'aventure') { G = AV.start(pool); return; }
    if (a === 'survie') { G = { game: a, pool, lives: 3, score: 0, combo: 0, n: 0, deck: shuffle(pool), missed: [] }; svDraw(); }
    else if (a === 'paires') { G = { game: a, score: 0 }; prDraw(); gClock(60, () => { G.over = true; G.isRec = best('paires', G.score); fx(G.isRec ? 'record' : 'win'); render(); }); }
    else if (a === 'quisuisje') { G = { game: a, pool, score: 0, n: 0, tot: Math.min(10, pool.length), deck: shuffle(pool), miss: [] }; qsDraw(); }
    else { G = { game: a, pool, score: 0, n: 0, tot: Math.min(3, pool.length), deck: shuffle(pool), miss: [] }; ptDraw(); }
  }

  // --- apprendre une fiche : 3 manches sur UNE fiche, de la plus aidée à la moins aidée. On dit les idées soi-même (pas de choix à deviner),
  //     ce qui est raté revient en fin de manche ; une étoile par manche réussie à 80 % du premier coup (S.st[id] = [meilleur score de chaque manche])
  const MANCHES = [['Lire, cacher, retrouver', 'Tu lis une partie, tu la caches, tu la redis avec les initiales.'], ['Les questions', 'Toutes les questions de la fiche ; les ratées reviennent.'], ['De mémoire', 'Seulement la question du plan : tu récites sans aide, comme à l\'oral.']];
  const nStars = id => ((S.st || {})[id] || []).filter(v => v >= 0.8).length;
  const stars = id => `<span class="stars">${[0, 1, 2].map(i => STAR(i < nStars(id))).join('')}</span>`;
  const initials = s => String(s).replace(/[A-Za-zÀ-ÿ]{4,}/g, w => w[0] + '•'.repeat(Math.min(w.length - 1, 6))).replace(/\d/g, '•');   // « HPV 1 → myrmécie » devient « HPV • → m•••••• »
  function mancheSteps(f, m) {
    const Z = QZ[f.id] || [], ps = f.parts.map((_, i) => i).filter(i => Z[i] && Z[i].k.length);
    const say = (i, hint) => ({ t: 'say', p: i + 1, q: f.parts[i].q, items: Z[i].k, hint });
    if (m === 1) return ps.flatMap(i => [{ t: 'read', p: i + 1, items: Z[i].k }, say(i, true)]);
    if (m === 2) return ps.flatMap(i => Z[i].q.map(s => mkStep(i + 1, s)));
    return ps.map(i => say(i, false));
  }
  function apDraw() { const st = G.steps[G.i]; Object.assign(G, { st, opts: st.opts, ok: st.ok, pick: null }); }
  function apNext(v) {   // v : la note de l'étape (rien pour une lecture)
    const st = G.st;
    if (v != null) {
      did(1); if (!st.retry) { G.sum += v; G.tot++; }
      if (v < 0.8 && !st.retry) {   // ratée : elle revient à la fin (avec sa lecture dans la manche 1), sans compter dans la note
        const again = x => Object.assign({}, x, { retry: true, shown: false, ticks: [] });
        if (st.hint) G.steps.push(again(G.steps[G.i - 1])); G.steps.push(again(st));
      }
    }
    if (++G.i < G.steps.length) return apDraw();
    const f = G.f, was = nStars(f.id), a = (S.st = S.st || {})[f.id] = (S.st[f.id] || [0, 0, 0]);
    G.v = G.tot ? G.sum / G.tot : 0; G.over = true; a[G.m - 1] = Math.max(a[G.m - 1] || 0, G.v); save();
    if (G.m === 3 || (was < 3 && nStars(f.id) === 3)) review('f:' + f.id, G.v >= 0.8);   // récitée de mémoire : la fiche entre dans les révisions espacées
    setTimeout(() => fx(nStars(f.id) > was ? (nStars(f.id) === 3 ? 'record' : 'star') : G.v >= 0.8 ? 'win' : 'over'), 250);
  }
  function apAnswer(j) {
    if (G.pick != null) return;
    const ok = G.opts[j] === G.ok; G.pick = j; fx(ok ? 'good' : 'bad'); render(true);
    gTimer = setTimeout(() => { apNext(ok ? 1 : 0); render(); }, ok ? 800 : 2200);
  }
  function apprendre(id, m) {
    const f = ALLF.find(x => x.id === id);
    if (!f) {   // la liste : on choisit la fiche
      gStop();
      const list = (t, fs) => fs.length ? `<div class="sec">${t}</div><div class="entries">${fs.map(x => `<a class="entry" href="#/jeu/apprendre/${x.id}"><span class="stamp sm" style="--c:${x.sec === 'podo' ? 'var(--p8)' : 'var(--p6)'}">${x.n}</span><span class="rt"><span class="t">${esc(x.title)}</span></span>${stars(x.id)}</a>`).join('')}</div>` : '';
      return `<div class="wrap">${top('#/', 'Apprendre une fiche', count(ALLF.filter(x => nStars(x.id) === 3).length, ALLF.length))}<div class="muted small">Choisis la fiche. 3 manches : tu lis, tu caches, tu récites. Une étoile par manche réussie.</div>${list('PÉDICURIE', PEDI)}${list('PODOLOGIE', PODO_OK)}</div>`;
    }
    m = +m;
    if (!MANCHES[m - 1]) {   // la fiche : ses 3 manches
      gStop();
      const a = (S.st || {})[f.id] || [];
      return `<div class="wrap">${top('#/jeu/apprendre', `${f.n}. ${esc(f.title)}`, stars(f.id))}
        <div class="entries">${MANCHES.map(([n, d], i) => `<a class="entry" href="#/jeu/apprendre/${f.id}/${i + 1}"><span class="stamp sm" style="--c:${PCOL(i * 2 + 1)}">${i + 1}</span><span class="rt"><span class="t">${n}</span><span class="s">${d}${a[i] ? ` · meilleur ${pc(a[i])} %` : ''}</span></span>${STAR(a[i] >= 0.8)}</a>`).join('')}</div>
        <div class="muted small" style="margin-top:12px">Dis les réponses à voix haute avant de regarder : c'est ça qui fait retenir.</div>
        <div class="row2" style="margin-top:14px"><a class="btn ghost grow" href="${FB(f)}">${ico('book')} Lire la fiche</a>${f.video ? `<a class="btn ghost grow" href="${FB(f)}/video">${ico('play')} La vidéo</a>` : ''}</div></div>`;
    }
    if (!G || G.key !== id + '/' + m) { gStop(); G = { game: 'apprendre', key: id + '/' + m, f, m, steps: mancheSteps(f, m), i: 0, sum: 0, tot: 0 }; if (G.steps.length) apDraw(); else G.over = true; }
    const back = `#/jeu/apprendre/${f.id}`, head = `<div class="wrap qz">${top(back, `${f.n}. ${esc(f.title)} · ${MANCHES[m - 1][0]}`, G.over ? '' : count(G.i + 1, G.steps.length))}`;
    if (G.over) {
      const v = G.v || 0, won = v >= 0.8;
      return `${head}${gEnd(`${pc(v)} %`, won ? `${STAR(true)} Manche réussie !${nStars(f.id) === 3 ? ' Les 3 étoiles : tu connais la fiche. Elle reviendra dans ta séance du jour pour ne pas l\'oublier.' : ''}` : 'Il faut 80 % du premier coup pour l\'étoile. Encore un essai ?', '',
        `${won && m < 3 ? `<a class="btn grow" href="#/jeu/apprendre/${f.id}/${m + 1}" style="--c:var(--hl)">Manche ${m + 1} →</a>` : ''}<button class="btn ${won && m < 3 ? 'ghost ' : ''}grow" data-g="again" ${won && m < 3 ? '' : 'style="--c:var(--hl)"'}>↻ Rejouer</button><a class="btn ghost grow" href="${back}">Manches</a>`)}</div>`;
    }
    const st = G.st, P = f.parts[st.p - 1], n = (st.ticks || []).length;
    const bar = `<div class="qbar">${G.steps.map((x, j) => `<i class="${j < G.i ? 'on' : j === G.i ? 'now' : ''}" style="--c:${PCOL(x.p - 1)}"></i>`).join('')}</div>`;
    const label = `<div class="qpart" style="--c:${PCOL(st.p - 1)}"><span class="stamp xs">${st.p}</span>${esc(P.title)}${st.retry ? ' <span class="again">↻ encore une fois</span>' : ''}</div>`;
    const btn = (g, txt, c) => `<button class="btn grow" data-g="${g}" style="--c:${c}">${txt}</button>`;
    const checks = `<div class="muted small">Coche ce que tu as dit (sois honnête) :</div><div class="checks">${(st.items || []).map((x, j) => `<button class="ck ${(st.ticks || []).includes(j) ? 'on' : ''}" data-g="mk" data-j="${j}"><span class="box"></span><span>${md(x)}</span></button>`).join('')}</div>`;
    const valid = () => btn('mval', `Valider · ${n}/${st.items.length}`, 'var(--p6)');
    let body, foot = '';
    if (st.t === 'read') {
      body = `<div class="kicker">LIS ET RETIENS · ${st.items.length} IDÉES</div><div class="question">${esc(P.q)}</div><ul class="aplist">${st.items.map(x => `<li>${md(x)}</li>`).join('')}</ul>`;
      foot = btn('apgo', 'C\'est en tête → je cache', 'var(--hl)');
    } else if (st.t === 'say') {
      body = `<div class="kicker">${st.hint ? 'REDIS-LA AVEC LES INITIALES' : 'RÉCITE DE MÉMOIRE'}</div><div class="question">${esc(P.q)}</div>${st.shown ? `${checks}<details class="say"><summary>${ico('speak')} Le texte complet de la partie</summary><p>${md(P.say)}</p></details>`
        : st.hint ? `<ul class="aplist hid">${st.items.map(x => `<li>${esc(initials(x))}</li>`).join('')}</ul>` : `<div class="say-it">${ico('speak')} Dis la partie à voix haute : ${st.items.length} idées.</div>`}`;
      foot = st.shown ? valid() : btn('apshow', 'J\'ai récité → voir', 'var(--hl)');
    } else if (st.kind === 'list') {
      body = `<div class="question">${md(st.q)}</div>${st.shown ? checks : `<div class="say-it">${ico('speak')} Cite-les à voix haute (${st.items.length})</div>`}`;
      foot = st.shown ? valid() : btn('apshow', 'Voir la réponse', 'var(--hl)');
    } else if (st.kind === 'flip') {
      body = `<div class="question">${md(st.q)}</div>${st.shown ? `<div class="answer">${md(st.a)}</div>` : `<div class="say-it">${ico('speak')} Réponds à voix haute</div>`}`;
      foot = st.shown ? btn('apno', '✗ Pas su', '#f6c3b9') + btn('apyes', '✓ Je savais', 'var(--p6)') : btn('apshow', 'Voir la réponse', 'var(--hl)');
    } else body = `<div class="question">${md(st.q)}</div>${gOpts()}`;
    return `${head}${bar}${label}<div class="card qc">${body}</div>${foot ? `<div class="pager fixed">${foot}</div>` : ''}</div>`;
  }

  function gameAct(t) {
    const j = +t.dataset.j, a = t.dataset.g;
    if (a === 'tog' || a === 'grp') { fx('tick'); return setupAct(t); }
    if (a === 'go') { fx('start'); gStart(G.game); return render(); }
    if (a === 'setup') { fx('tap'); G = { game: G.game, setup: true }; return render(); }
    if (a === 'again') { fx('start'); if (G.game === 'apprendre') G.key = ''; else gStart(G.game); return render(); }
    if (a === 'pick') return G.game === 'survie' ? svAnswer(j) : G.game === 'quisuisje' ? qsAnswer(j) : apAnswer(j);
    if (a === 'qshint') { if (G.rev < 4 && G.pick == null) { fx('reveal'); G.rev++; render(true); } return; }
    if (a === 'qsopts') { fx('tap'); G.showOpts = true; return render(true); }
    if (a === 'qsnext') { fx('tap'); return qsNext(); }
    if (a.startsWith('av')) return AV.act(a, j, t);
    if (a.startsWith('pt')) return ptAct(a, j, t);
    if (a === 'L' || a === 'R') return prTap(a, j);
    const st = G.st;   // apprendre : lire, dévoiler, cocher ce qu'on a dit, valider
    if (a === 'apgo') { fx('tap'); apNext(); return render(); }
    if (a === 'apshow') { fx('reveal'); st.shown = true; return render(); }
    if (a === 'apyes' || a === 'apno') { fx(a === 'apyes' ? 'good' : 'bad'); apNext(a === 'apyes' ? 1 : 0); return render(); }
    if (a === 'mk') { fx('tick'); const k = st.ticks || []; st.ticks = k.includes(j) ? k.filter(x => x !== j) : k.concat(j); return render(true); }
    if (a === 'mval') { const v = (st.ticks || []).length / st.items.length; fx(v >= 0.8 ? 'good' : 'bad'); apNext(v); render(); }
  }
  function jeu(a, b, c) {
    if (!GAMES[a]) return notFound();
    if (a === 'apprendre') return apprendre(b, c);
    if (!G || G.game !== a) { gStop(); G = a === 'aventure' ? { game: a, scr: 'hub' } : { game: a, setup: true }; }
    if (G.setup) return setup(a);
    if (a === 'aventure') return AV.view();
    const r = (S.rec || {})[a] || 0, head = right => `<div class="wrap qz">${top('#/', GAMES[a], right)}`;
    if (a === 'survie') {
      if (G.over) return `${head('')}${gEnd(G.score, G.isRec ? 'Nouveau record !' : `Ton record : ${r}. Encore une ?`, `<div class="sec">TES 3 ERREURS, À RETENIR</div><div class="entries">${G.missed.map(m => `<a class="entry" href="${m[2]}"><span class="rt"><span class="s">${md(m[0])}</span><span class="t">${md(m[1])}</span></span><span class="chev">›</span></a>`).join('')}</div>`)}</div>`;
      return `${head(count(G.score, 'record ' + Math.max(r, G.score)))}${gBar()}
        <div class="ghud"><span>${[0, 1, 2].map(i => HEART(i < G.lives)).join('')}</span>${G.combo > 1 ? `<span class="combo">×${Math.min(G.combo, 5)}</span>` : ''}</div>
        <div class="qpart" style="--c:${G.cur.c}">${esc(G.cur.lab)}</div>
        <div class="card qc"><div class="question">${md(G.q)}</div>${gOpts()}${G.pick === -1 ? '<div class="muted small">Trop tard !</div>' : ''}</div></div>`;
    }
    if (a === 'paires') {
      if (G.over) return `${head('')}${gEnd(G.score, G.isRec ? 'Nouveau record de paires !' : `Ton record : ${r} paires. Encore une ?`)}</div>`;
      const col = side => `<div class="pcol">${G[side].map((x, j) => `<button class="pr ${G.found[x[0]] ? 'ok' : G.sel && G.sel.side === side && G.sel.j === j ? 'sel' : G.bad && G.bad[side] === j ? 'bad' : ''}" data-g="${side}" data-j="${j}">${md(x[1])}</button>`).join('')}</div>`;
      return `${head(count(G.score, 'record ' + Math.max(r, G.score)))}${gBar()}
        <div class="qpart" style="--c:var(--p5)">${esc(G.label)} Relie chaque paire.</div><div class="pairs">${col('L')}${col('R')}</div></div>`;
    }
    if (a === 'quisuisje') {
      const maxS = G.tot * 4;
      if (G.over) return `${head('')}${gEnd(`${G.score}/${maxS}`, G.isRec ? `Nouveau record : ${G.score}/${maxS} !` : G.score >= maxS * 0.75 ? `Solide ! Record : ${Math.max(r, G.score)}/${maxS}.` : `Ton record : ${Math.max(r, G.score)}/${maxS}. Revois les fiches ci-dessous.`,
        G.miss.length ? `<div class="sec">À REVOIR</div><div class="entries">${G.miss.map(m => `<a class="entry" href="${m.link}"><span class="stamp sm" style="--c:${m.c}">?</span><span class="rt"><span class="t">${esc(m.title)}</span><span class="s">${esc(m.lab)}</span></span><span class="chev">›</span></a>`).join('')}</div>` : '')}</div>`;
      const done = G.pick != null, ptsNow = 5 - G.rev, shown = done ? 4 : G.rev, clIdx = G.cur.kind === 'c' ? CL.indexOf(G.cur.cl) + 1 : 0;
      return `${head(count(`${G.n}/${G.tot}`, `${G.score} pts`))}
        <div class="ghud"><span class="qpart" style="--c:${G.cur.c};margin:0">${ico('bulb')} ${esc(G.cur.lab)}</span>
          <span class="qsbadge">${done ? (G.pts ? `+${G.pts} pt${G.pts > 1 ? 's' : ''} !` : '0 pt') : `Vaut ${ptsNow} pt${ptsNow > 1 ? 's' : ''}`}</span></div>
        <div class="card qc"><div class="kicker">QUI SUIS-JE ? · INDICE ${shown}/4</div>
          <div class="qsclues">${G.clues.map((c, i) => i < shown ? `<div class="qsclue ${done && i >= G.rev ? 'extra' : ''}"><span class="qsnum">${i + 1}</span><div><div class="qslab">${esc(c[0])}</div><div class="qstxt">${md(c[1])}</div></div></div>`
            : `<div class="qsclue locked"><span class="qsnum">${i + 1}</span><div class="qslab">Indice ${i + 1} caché (${4 - i} pt${4 - i > 1 ? 's' : ''})</div></div>`).join('')}</div>
          ${done && clIdx ? `<div style="margin-top:10px">${pic(clIdx)}</div>` : ''}
          ${!done && G.rev < 4 ? `<button class="btn ghost wide" data-g="qshint" style="margin-top:10px">+ Dévoiler l'indice ${G.rev + 1}/4 (vaut ${ptsNow - 1} pt${ptsNow - 1 > 1 ? 's' : ''})</button>` : ''}
          ${!done && !G.showOpts ? `<button class="btn wide" data-g="qsopts" style="--c:var(--hl);margin-top:10px">${ico('bulb')} J'ai une idée → Voir les 4 choix</button>`
            : `<div style="margin-top:12px">${gOpts()}</div>`}
          ${done ? `<div class="row2" style="margin-top:12px"><a class="btn ghost grow" href="${G.cur.link}">${ico('book')} Voir la fiche</a></div>` : ''}</div>
        ${done ? `<div class="pager fixed"><button class="btn grow" data-g="qsnext" style="--c:var(--hl)">${G.n < G.tot ? `Énigme suivante (${G.n + 1}/${G.tot}) →` : 'Voir mon score →'}</button></div>` : ''}</div>`;
    }
    const maxP = G.tot * 10;
    if (G.over) return `${head('')}${gEnd(`${G.score}/${maxP}`, G.isRec ? `Nouveau record : ${G.score}/${maxP} !` : G.score >= maxP * 0.8 ? 'Tes patients sont entre de bonnes mains !' : 'Revois les fiches ci-dessous, puis relance une consultation.',
      G.miss.length ? `<div class="sec">À REVOIR</div><div class="entries">${G.miss.map(f => `<a class="entry" href="#/jeu/apprendre/${f.id}"><span class="stamp sm" style="--c:${f.sec === 'podo' ? 'var(--p8)' : 'var(--p6)'}">${f.n}</span><span class="rt"><span class="t">${esc(f.title)}</span></span>${stars(f.id)}</a>`).join('')}</div>` : '')}</div>`;
    return ptView();
  }

  // ---------- routeur ----------
  function render(keepScroll) {
    const sy = window.scrollY || 0, dosOpen = !!(document.querySelector('.ptdos') && document.querySelector('.ptdos').open);
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
    else if (sec === 'jeu') html = jeu(a, b, c);
    else html = notFound();
    if (sec !== 'jeu' && G) { if (G.game === 'aventure' && window.SONS && SONS.playing && SONS.playing() === 'combat') SONS.stop(); gStop(); }   // on quitte Podo Quest : sa musique s'arrête
    if (V3) { V3.dispose(); V3 = null; }
    closeVideo();
    $('#app').innerHTML = html;
    if (dosOpen && $('.ptdos')) $('.ptdos').open = true;
    document.body.classList.toggle('v3on', !!$('#v3c'));
    if ($('#v3c')) start3d();
    gSync();
    document.body.classList.toggle('reading', !!$('#app .pager.fixed'));
    document.querySelectorAll('nav.tabs a').forEach(t => t.classList.toggle('on', t.dataset.s === (sec || '') || (t.dataset.s === 'tirage' && sec === 'plan') || (t.dataset.s === 'fiches' && (sec === 'pedi' || sec === 'podo'))));
    tabMenu(false);
    const f = (sec === 'podo' ? PODO_OK : PEDI).find(x => x.id === a);
    document.title = (sec === 'pedi' || sec === 'podo') && f ? `${f.n}. ${f.title} · Révisions podo` : sec === 'clin' && a === 'b' && BL[+b - 1] ? `${BL[+b - 1].n} · Bilan du pied · Révisions podo` : sec === 'clin' && CL[+a - 1] ? `${CL[+a - 1].n} · Examen clinique · Révisions podo` : sec === 'anat' && a && a !== 'quiz' && a !== '3d' && !REG_ORDER.includes(a) ? `Q${a} · Anatomie · Révisions podo` : 'Révisions podo';
    window.scrollTo(0, keepScroll === true ? sy : 0);
    showNote();
  }

  // onglet « Fiches » de la barre du bas : un petit menu vertical s'ouvre vers le haut (Pédicurie / Podologie)
  function tabMenu(open) { const m = $('#tabmenu'), t = $('#tabf'); if (!m || !t) return; m.classList.toggle('open', open); t.setAttribute('aria-expanded', open); }
  document.addEventListener('click', e => {
    if (e.target.closest('#tabf')) { e.preventDefault(); tabMenu(!$('#tabmenu').classList.contains('open')); return; }
    if (!e.target.closest('#tabmenu')) tabMenu(false);
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') tabMenu(false); });

  // toucher un dessin ou une planche : plein écran (on peut zoomer avec les doigts), toucher encore pour fermer
  document.addEventListener('click', e => {
    const im = e.target.closest('.slide img, .zoomable img, .plate img');
    if (im) { e.preventDefault(); const z = document.createElement('div'); z.className = 'zoom' + (im.dataset.full ? ' tall' : ''); z.innerHTML = `<img src="${im.dataset.full || im.getAttribute('src')}" alt=""><span>Toucher pour fermer</span>`; z.onclick = () => z.remove(); document.body.appendChild(z); return; }
  }, true);
  document.addEventListener('click', e => {
    const t = e.target.closest('button, .revise .part .body li, .revise .part .body .chip, .revise .part .body .badge, .revise .part .body td');
    if (!t) return;
    if (t.dataset.qa) { quizAct(t); return; }
    if (t.dataset.g && G) { gameAct(t); return; }
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
    if (t.id === 'fbin') { const m = $('#fbmsg');
      if (!fbx) { fbLoad(); m.textContent = 'Connexion impossible sans réseau : réessaie dans un instant.'; return; }
      fbx.Au.signInWithPopup(fbx.auth, new fbx.Au.GoogleAuthProvider()).catch(er => { if (!/cancelled|closed/.test(er.code || '')) m.textContent = 'La connexion a échoué : réessaie.'; });
      return; }
    if (t.dataset.fb) { const c = fbCloud, k = t.dataset.fb; fbCloud = null; $('#fbask').remove(); fbUse(k === 'local' ? S : k === 'cloud' ? c : merge(S, c), k === 'local' ? c : S); fbLink(true); return; }
    if (t.id === 'fbundo') { let o = null; try { o = JSON.parse(localStorage.getItem(SPARE)); } catch (er) {} if (o && confirm('Remplacer ta progression actuelle par celle d\'avant ? (l\'actuelle sera gardée en secours)')) { fbUse(o, S); render(); fbPush(true); } return; }
    if (t.id === 'fbout') { Promise.resolve(fbPush()).then(() => fbx.Au.signOut(fbx.auth)); return; }
    if (t.id === 'bkshow') { const x = $('#bkbox'); x.hidden = !x.hidden; t.setAttribute('aria-expanded', !x.hidden); return; }
    if (t.id === 'bkopen') { $('#bkzone').hidden = false; $('#bkta').value = ''; $('#bkta').focus(); return; }
    if (t.id === 'bkload') { try { fromCode($('#bkta').value); save(); setSkin(); render(); const m = $('#bkmsg'); if (m) { $('#bkbox').hidden = false; m.textContent = 'Progression restaurée ✓'; } } catch (er) { $('#bkmsg').textContent = "Ce code n'est pas valide : vérifie que tu l'as collé en entier."; } return; }
    if (t.dataset.skin || t.dataset.theme !== undefined) { if (t.dataset.skin) S.skin = t.dataset.skin; else S.theme = t.dataset.theme; if (t.closest('.note')) closeNote(); save(); setSkin(); render(); return; }
    if (t.dataset.v3l) { const k = t.dataset.v3l; on3()[k] = on3()[k] ? 0 : 1; save(); t.classList.toggle('on', !!on3()[k]); t.setAttribute('aria-pressed', !!on3()[k]); if (V3) V3.layers(); return; }
    if (t.dataset.v3z) { fx('tap'); if (V3) t.dataset.v3z === 'home' ? V3.home() : V3.zoom(1 / +t.dataset.v3z); return; }
    if (t.classList.contains('reveal')) { t.closest('[data-quiz]').classList.add('shown'); return; }
    if (!t.matches('button')) { t.classList.toggle('shown'); return; }
    const [, sec, a] = location.hash.split('/');
    if (t.id === 'revise') { S.revise = !S.revise; save(); render(true); }
    if (t.id === 'done') { const p = S.pedi[a] = S.pedi[a] || {}; p.done = !p.done; save(); render(true); }
    if (t.id === 'bknow') { const m = S.bil = S.bil || {}, k = location.hash.split('/')[3]; m[k] = !m[k]; if (m[k]) did(1); save(); render(true); }
    if (t.id === 'cknow') { const m = S.clin = S.clin || {}; m[a] = !m[a]; if (m[a]) did(1); save(); render(true); }
    if (t.id === 'crand') { const left = CL.map((_, i) => i + 1).filter(i => !doneC(i)), pool = left.length ? left : CL.map((_, i) => i + 1); S.revise = true; save(); location.hash = '#/clin/' + pool[Math.floor(Math.random() * pool.length)]; }
    if (t.id === 'aknow') { S.anat[a] = !S.anat[a]; save(); render(true); }
    if (t.id === 'qshow') { shown = true; render(true); }
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
