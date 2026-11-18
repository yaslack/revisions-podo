// Le conte des savoirs : le récit est inventé ; toutes les réponses viennent de QUIZ et des fiches.
// L'oral est autoévalué après récitation. Aucune reconnaissance vocale n'est simulée.
window.CONTE = A => {
  const { esc, md, top, ico, sounds } = A;
  const state = () => A.state();
  const progress = id => {
    const s = state(); s.conte = s.conte || {};
    return s.conte[id] = s.conte[id] || { parts: {}, finalParts: {} };
  };
  const plan = f => f.parts.map((part, p) => ({ part, p, items: (A.QZ[f.id]?.[p]?.k || []).filter(x => typeof x === 'string' && x.trim()) }));
  const complete = f => plan(f).every(x => progress(f.id).parts[x.p]);
  const scenes = [
    ['bridge', 'Le pont endormi', 'Un pont ferme les yeux au-dessus de la rivière. « Raconte-moi le début de ton savoir, et je te laisserai passer. »', 'Le pont ouvre les yeux. Ses pierres se déplient : le chemin est à toi !'],
    ['mill', 'Le moulin sans vent', 'Les ailes du moulin se sont arrêtées. Chaque idée retrouvée leur rend un peu de vent.', 'Les ailes tournent à nouveau. Un parfum de pain chaud accompagne tes pas.'],
    ['lantern', 'La lanterne des lucioles', 'La nuit approche. Les lucioles attendent ton récit pour rallumer la lanterne du sentier.', 'Les lucioles s’envolent : une lumière dorée te montre la suite du chemin.'],
    ['garden', 'Le jardin silencieux', 'Les fleurs ont oublié comment s’ouvrir. Explique cette partie avec tes mots pour réveiller le jardin.', 'Une à une, les fleurs se déplient. Le jardin bruisse de nouveau.'],
    ['boat', 'La barque des souvenirs', 'Une petite barque t’attend. Pour retrouver l’autre rive, sa voile a besoin de ce que tu sais.', 'La voile se gonfle. La barque glisse doucement vers l’autre rive.'],
    ['gate', 'La porte du village', 'Derrière la porte, le village retient son souffle. Ton récit peut faire tourner la clé.', 'La porte s’ouvre en grand. Les habitants accrochent des fanions pour ton arrivée.'],
    ['tree', 'L’arbre aux histoires', 'Le vieil arbre garde les récits du village. Confie-lui cette partie pour lui rendre ses feuilles.', 'Des feuilles de papier poussent sur les branches. L’arbre gardera ton histoire.'],
    ['chest', 'Le coffre étoilé', 'Sous le chêne, un coffre attend les dernières idées de ta fiche. Raconte-les pour découvrir son secret.', 'Le couvercle se soulève : une étoile de papier brille dans le coffre.']
  ];
  const initials = s => s.replace(/[\p{L}\p{N}]+/gu, w => w[0] + '·'.repeat(Math.min(6, w.length - 1)));
  const btn = (a, text, cls = '', extra = '') => `<button class="ct-btn ${cls}" data-g="ct${a}" ${extra}>${text}</button>`;
  const link = f => `#/jeu/conte/${f.id}`;
  function load(f, final = false) {
    const saved = progress(f.id), steps = plan(f);
    const p = steps.find(x => !(final ? saved.finalParts : saved.parts)[x.p])?.p;
    A.setG({ game: 'conte', f, final, p: p ?? steps.length - 1, phase: p == null ? (final ? 'end' : 'chapter') : 'tell', ticks: [], aided: false });
  }
  function theatre(scene, won) {
    return `<div class="ct-stage ct-${scene[0]} ${won ? 'ct-awake' : ''}" data-scene="${scene[0]}" role="img" aria-label="Décor de conte en papier découpé : ${esc(scene[1])}${won ? ', le passage est ouvert' : ''}">
      <div class="ct-layer ct-distant"></div>
      <div class="ct-layer ct-landscape"><div class="ct-characters"><img class="ct-hero ct-duo" src="jeu/conte/heros-tortue.png" alt="" draggable="false"></div></div>
      <div class="ct-layer ct-light"><i></i><i></i><i></i><i></i><i></i></div><div class="ct-layer ct-front"></div>
      <div class="ct-sparkles" aria-hidden="true">✦ <span>✧</span> ✦</div>
    </div>`;
  }
  function soundControls() {
    if (!sounds) return '';
    return `<div class="ct-audio" role="group" aria-label="Audio du conte">
      <button class="ct-audio-btn" data-g="ctmusic" aria-label="Musique du conte" title="Musique du conte" aria-pressed="${sounds.musicOn()}"><span aria-hidden="true">♫</span></button>
      <button class="ct-audio-btn" data-g="ctfx" aria-label="Bruitages du conte" title="Bruitages du conte" aria-pressed="${sounds.fxOn()}">${ico('spkhigh')}</button>
    </div>`;
  }
  let libraryFilter = 'all', libraryQuery = '';
  const subjects = [['pedi', 'Pédicurie'], ['podo', 'Podologie']];
  function library() {
    const list = ([id, title]) => `<section data-ct-subject="${id}"><h2 class="ct-section">${title}</h2><div class="ct-books">${A.files.filter(f => (f.sec || 'pedi') === id).map(f => {
      const p = progress(f.id), n = f.parts.filter((_, i) => p.parts[i]).length;
      const finished = f.parts.every((_, i) => p.finalParts[i]);
      const status = finished ? '★ Conte et grand récit terminés' : n ? `${n}/${f.parts.length} passages ouverts · Reprendre` : `${f.parts.length} rencontres · ${p.done ? 'Rejouer' : 'Ouvrir le conte'}`;
      return `<a class="ct-book" href="${link(f)}" data-ct-title="${esc(f.title)}"><span class="ct-book-cover">${A.cover(f)}</span><span><b>${esc(f.title)}</b><small>${status}</small><span class="ct-book-progress" style="--progress:${n / f.parts.length * 100}%"></span></span><span class="ct-chevron" aria-hidden="true"></span></a>`;
    }).join('')}</div></section>`;
    const last = A.files.find(f => f.id === state().conteLast);
    const active = last && !last.parts.every((_, i) => progress(last.id).finalParts[i]);
    return `<div class="wrap ct ct-library">${top('#/', 'Le conte des savoirs')}
      <div class="ct-intro"><h1>Choisis ta fiche</h1><p>Récite à voix haute, puis coche les idées que tu as dites.</p></div>
      ${active ? `<a class="ct-resume" href="${link(last)}"><span>Reprendre <b>${esc(last.title)}</b></span><span class="ct-chevron" aria-hidden="true"></span></a>` : ''}
      <div class="ct-library-anchor"></div><div class="ct-library-tools">
        <div role="search" class="ct-search"><input type="search" aria-label="Rechercher une fiche" placeholder="Chercher une fiche…" value="${esc(libraryQuery)}" data-ct-search autocomplete="off"></div>
        <div class="ct-filters" role="group" aria-label="Matière">${[['all', 'Toutes'], ...subjects].map(([id, label]) => `<button type="button" data-ct-filter="${id}" aria-pressed="${id === libraryFilter}">${label}</button>`).join('')}</div>
      </div>
      <p class="ct-no-results" hidden aria-live="polite">Aucune fiche trouvée. Essaie un autre mot ou choisis « Toutes ».</p>
      ${subjects.map(list).join('')}</div>`;
  }
  function mountLibrary(page) {
    const search = page.querySelector('[data-ct-search]');
    const filters = [...page.querySelectorAll('[data-ct-filter]')];
    const fold = text => text.toLocaleLowerCase('fr').normalize('NFD').replace(/\p{M}/gu, '');
    const groups = [...page.querySelectorAll('[data-ct-subject]')].map(section => ({
      section, books: [...section.querySelectorAll('[data-ct-title]')].map(link => ({ link, title: fold(link.dataset.ctTitle) })),
    }));
    function filter() {
      const words = fold(libraryQuery).trim().split(/\s+/).filter(Boolean);
      let found = 0;
      for (const { section, books } of groups) {
        const enabled = libraryFilter === 'all' || section.dataset.ctSubject === libraryFilter;
        let count = 0;
        for (const { link, title } of books) {
          link.hidden = !enabled || !words.every(word => title.includes(word));
          if (!link.hidden) count++;
        }
        section.hidden = count === 0;
        found += count;
      }
      page.querySelector('.ct-no-results').hidden = found > 0;
      for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.ctFilter === libraryFilter));
    }
    const startOfList = () => {
      const app = document.getElementById('app'), anchor = page.querySelector('.ct-library-anchor');
      if (app.scrollTop > anchor.offsetTop) anchor.scrollIntoView({ block: 'start' });
    };
    const onInput = () => { libraryQuery = search.value; startOfList(); filter(); };
    const onChoice = event => {
      const button = event.target.closest('[data-ct-filter]');
      if (button) { libraryFilter = button.dataset.ctFilter; startOfList(); filter(); }
    };
    search.addEventListener('input', onInput);
    page.addEventListener('click', onChoice);
    filter();
    return () => { search.removeEventListener('input', onInput); page.removeEventListener('click', onChoice); };
  }
  function view(id) {
    const f = A.files.find(f => f.id === id);
    if (!f) { if (!A.g() || A.g().game !== 'conte' || A.g().f) A.setG({ game: 'conte' }); return library(); }
    if (!A.g() || A.g().game !== 'conte' || A.g().f?.id !== id) {
      const saved = progress(id);
      load(f, !!(saved.finalStarted || Object.keys(saved.finalParts).length));
      if (state().conteLast !== id) { state().conteLast = id; A.save(); }
    }
    const g = A.g(), saved = progress(f.id), steps = plan(f), st = steps[g.p];
    const scene = scenes[g.p % scenes.length], won = ['pass', 'chapter', 'end'].includes(g.phase);
    const restart = g.p || g.final || g.aided || g.phase !== 'tell' ? btn('restart', '↺ Recommencer cette fiche', 'ct-restart') : '';
    const header = `<header class="ct-top"><a class="ct-back" href="#/jeu/conte" aria-label="Retour aux contes">←</a><div class="ct-brand"><span class="ct-logo">Podo Quest</span><span class="ct-book-title">Le conte des savoirs</span></div><div class="ct-top-side">${soundControls()}<span class="ct-page-number">${g.final ? 'Grand récit' : `${Math.min(steps.filter(x => saved.parts[x.p]).length + 1, steps.length)} / ${steps.length}`}</span></div></header>`;
    let body;
    if (g.phase === 'chapter' || g.phase === 'end') {
      const end = g.phase === 'end';
      body = `<section class="ct-card ct-ending"><span class="ct-eyebrow">${end ? 'TON HISTOIRE EST EN MÉMOIRE' : 'TOUS LES PASSAGES SONT OUVERTS'}</span><h2>${end ? 'Une étoile pour ton récit.' : 'Le village attend ton grand récit.'}</h2><p>${end ? 'Tu as récité chaque partie de la fiche sans aide. Elle reviendra dans ta séance du jour pour entretenir ta mémoire.' : 'Relie maintenant toute la fiche : récite ses parties dans l’ordre, sans lire et sans indice. Tes oublis devront être redits pour terminer l’histoire.'}</p>${end ? `<a class="ct-btn" href="#/jeu/conte">Choisir un autre conte →</a>${btn('restartfinal', 'Refaire le grand récit', 'ct-secondary')}` : btn('final', 'Raconter toute la fiche →')}<a class="ct-text-link" href="${A.fileLink(f)}">Retrouver la fiche</a>${restart}</section>`;
    } else {
      const show = ['check', 'result'].includes(g.phase), missed = st.items.filter((_, j) => !g.ticks.includes(j));
      body = `<section class="ct-card"><div class="ct-ribbon">${show ? 'Idées à vérifier' : g.final ? `Le grand récit · ${g.p + 1}/${steps.length}` : 'À toi de raconter'}</div><span class="ct-subject">${esc(f.title)}</span><h2 class="ct-part-title">${g.p + 1}. ${esc(st.part.title)}</h2>
        ${show ? '' : `<p class="ct-question">${esc(st.part.q || 'Raconte cette partie avec tes mots.')}</p>`}
        ${g.phase === 'read' ? `<div class="ct-lesson"><b>Lis, puis cache avant de raconter.</b><ul>${st.items.map(x => `<li>${md(x)}</li>`).join('')}</ul>${st.part.say ? `<details><summary>Le texte pour l’oral</summary><p>${md(st.part.say)}</p></details>` : ''}</div>${btn('hide', 'Je cache et je raconte →')}` : ''}
        ${g.phase === 'tell' ? `<div class="ct-speaking">${ico('speak')} Sans ta fiche, récite à voix haute.<small>${st.items.length} idées à retrouver · Autoévaluation après le récit</small></div>${g.aided ? `<ul class="ct-hints">${st.items.map(x => `<li>${esc(initials(x))}</li>`).join('')}</ul><p class="ct-small">Avec cet indice, tu t’entraînes. Il faudra redire cette partie sans aide.</p>` : ''}${btn('show', 'J’ai terminé →')}${!g.final ? `<div class="ct-help">${btn('hint', 'Un petit indice ?', 'ct-secondary', g.aided ? 'disabled' : '')}${btn('read', 'Lire avant de raconter', 'ct-secondary')}</div>` : '<p class="ct-small">Le grand récit se fait sans aide.</p>'}` : ''}
        ${show ? `<p class="ct-small">Coche les idées que tu as dites à voix haute.</p><div class="ct-checks">${st.items.map((x,j) => `<button class="ct-check ${g.ticks.includes(j) ? 'on' : ''} ${g.phase === 'result' && !g.ticks.includes(j) ? 'ct-missed' : ''}" data-g="cttick" data-j="${j}" aria-pressed="${g.ticks.includes(j)}" ${g.phase === 'result' ? 'disabled' : ''}><span aria-hidden="true">${g.ticks.includes(j) ? '✓' : '○'}</span><span>${md(x)}</span></button>`).join('')}</div>${g.phase === 'check' ? btn('validate', `Vérifier · ${g.ticks.length}/${st.items.length}`, 'ct-sticky-action') : `<div class="ct-feedback" role="status"><b>${missed.length ? `${missed.length} idée${missed.length > 1 ? 's' : ''} à retrouver.` : 'Tu as retrouvé toutes les idées avec un indice.'}</b><p>${g.final ? 'Retiens les idées oubliées, cache cette correction, puis recommence cette partie de mémoire.' : 'Le passage attend encore : retiens les idées, cache la correction, puis raconte de nouveau sans aide.'}</p></div>${btn('retry', 'Je cache et je réessaie →')}`}` : ''}
        ${g.phase === 'pass' ? `<div class="ct-feedback ct-success" role="status"><b>Toutes les idées, sans aide. Le passage s’ouvre !</b><p>${g.final ? 'Une partie de plus dans ton grand récit.' : 'La tortue te rejoint. La suite de l’histoire t’attend.'}</p></div>${btn('next', g.p === steps.length - 1 ? (g.final ? 'Découvrir mon étoile →' : 'Arriver au village →') : 'Continuer l’histoire →')}` : ''}
        ${restart}
      </section>`;
    }
    const zone = `${esc(f.id)}:${g.final ? 'final' : 'conte'}:${g.p}`;
    return `<div class="ct ct-story" data-zone="${zone}" data-phase="${g.phase}">${theatre(scene, won)}${header}<div class="ct-layout"><div class="ct-picture"><div class="ct-chapter"><span class="ct-chapter-label">${g.final ? 'Le grand récit · Le village des savoirs' : `Chapitre ${g.p + 1} · La forêt des souvenirs`}</span><h1>${esc(g.phase === 'end' ? 'Le village des savoirs' : scene[1])}</h1></div><div class="ct-picture-foot"><p class="ct-narration">${esc(g.final ? 'Le village se rassemble pour écouter ton histoire…' : won ? scene[3] : scene[2])}</p><div class="ct-trail" aria-label="Progression des parties">${steps.map(x => `<span class="${(g.final ? saved.finalParts : saved.parts)[x.p] ? 'done' : ''} ${x.p === g.p ? 'current' : ''}" aria-label="Partie ${x.p + 1}${(g.final ? saved.finalParts : saved.parts)[x.p] ? ' réussie' : ''}">${(g.final ? saved.finalParts : saved.parts)[x.p] ? '✓' : x.p + 1}</span>`).join('')}</div></div></div>${body}</div></div>`;
  }
  let crossing = false;
  async function crossClouds(advance) {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !Element.prototype.animate) { sounds?.fx('page'); advance(); return; }
    sounds?.fx('clouds');

    const app = document.getElementById('app');
    const origin = location.hash, game = A.g(), wasInert = app.inert;
    const curtain = document.createElement('div');
    curtain.className = 'ct-cloud-wipe';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML = ['far', 'middle', 'near'].map(layer => `<div class="ct-cloud-bank ct-cloud-${layer}"></div>`).join('');
    const banks = [...curtain.children];
    let animations = [], advanced = false;
    const cancel = () => animations.forEach(animation => animation.cancel());
    const go = () => {
      if (!advanced && location.hash === origin && A.g() === game) {
        advanced = true;
        advance();
      }
    };
    const onMotionChange = () => { if (motion.matches) cancel(); };
    window.addEventListener('hashchange', cancel);
    motion.addEventListener('change', onMotionChange);
    crossing = app.inert = true;
    document.body.append(curtain);

    function sweep(from, to, timings, easing) {
      animations = banks.map((bank, i) => {
        const [duration, delay] = timings[i];
        return bank.animate([
          { transform: `translate3d(${from[i]}vw,0,0)` },
          { transform: `translate3d(${to[i]}vw,0,0)` },
        ], { duration, delay, easing, fill: 'both' });
      });
      return Promise.all(animations.map(animation => animation.finished));
    }

    try {
      await sweep([155, 155, 155], [-10, 0, 17], [[360, 0], [425, 35], [390, 75]], 'cubic-bezier(.34,.63,.34,1)');
      // Le décor change sous le nuage opaque, avant que le bord droit se dégage.
      go();
      const entering = animations;
      const exit = sweep([-10, 0, 17], [-155, -155, -155], [[400, 0], [510, 0], [545, 20]], 'cubic-bezier(.43,.16,.49,1)');
      entering.forEach(animation => animation.cancel());
      await exit;
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
      go();
    } finally {
      window.removeEventListener('hashchange', cancel);
      motion.removeEventListener('change', onMotionChange);
      curtain.remove();
      app.inert = wasInert;
      crossing = false;
      if (advanced && document.activeElement === document.body) {
        const title = app.querySelector('.ct-chapter h1');
        if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
      }
    }
  }

  function act(a, j) {
    const g = A.g(); if (crossing || !g?.f || g.game !== 'conte') return;
    if (a === 'ctmusic' || a === 'ctfx') {
      if (!sounds) return;
      if (a === 'ctmusic') {
        sounds.toggleMusic();
        sounds.fx('tap');
      } else sounds.toggleFX();
      document.querySelector(`[data-g="${a}"]`)?.setAttribute('aria-pressed', String(a === 'ctmusic' ? sounds.musicOn() : sounds.fxOn()));
      return;
    }
    sounds?.arm();
    const saved = progress(g.f.id), st = plan(g.f)[g.p];
    if (a === 'ctrestart') {
      const restart = () => {
        saved.parts = {};
        saved.finalParts = {};
        delete saved.finalStarted;
        A.save();
        load(g.f);
        A.render(false);
      };
      if (g.p) return crossClouds(restart);
      sounds?.fx('page');
      return restart();
    }
    let keep = true;
    if ((a === 'ctfinal' && g.phase === 'chapter' || a === 'ctrestartfinal' && g.phase === 'end') && complete(g.f)) {
      return crossClouds(() => {
        if (a === 'ctrestartfinal') saved.finalParts = {};
        saved.finalStarted = 1;
        A.save();
        load(g.f, true);
        A.render(false);
      });
    } else if (a === 'ctread' && g.phase === 'tell' && !g.final) {
      g.phase = 'read';
      sounds?.fx('page');
    } else if (a === 'cthide' && g.phase === 'read' || a === 'ctretry' && g.phase === 'result') {
      Object.assign(g, { phase: 'tell', aided: false, ticks: [] });
      sounds?.fx('page');
    } else if (a === 'cthint' && g.phase === 'tell' && !g.final) {
      g.aided = true;
      sounds?.fx('page');
    } else if (a === 'ctshow' && g.phase === 'tell') {
      g.phase = 'check';
      sounds?.fx('page');
    } else if (a === 'cttick' && g.phase === 'check' && Number.isInteger(j) && j >= 0 && j < st.items.length) {
      const wasChecked = g.ticks.includes(j);
      g.ticks = wasChecked ? g.ticks.filter(x => x !== j) : g.ticks.concat(j);
      sounds?.fx(wasChecked ? 'undo' : 'tick');
    }
    else if (a === 'ctvalidate' && g.phase === 'check') {
      const passed = st.items.length > 0 && g.ticks.length === st.items.length && !g.aided;
      g.phase = passed ? 'pass' : 'result';
      if (passed) {
        (g.final ? saved.finalParts : saved.parts)[g.p] = 1;
        const s = state(); s.rpg = s.rpg || { lvl: 1, xp: 0, items: { hexo: 1 }, seen: {}, runs: 0 };
        s.rpg.oral = s.rpg.oral || {}; (s.rpg.oral['f:' + g.f.id] = s.rpg.oral['f:' + g.f.id] || {})[g.p] = 1;
        if (g.final && g.p === g.f.parts.length - 1) {
          saved.done = 1;
          A.review('f:' + g.f.id, true);
        }
        A.did(1); A.save(); sounds?.fx('pass');
      } else sounds?.fx('retry');
    } else if (a === 'ctnext' && g.phase === 'pass') {
      keep = false;
      if (g.p < g.f.parts.length - 1) return crossClouds(() => {
        Object.assign(g, { p: g.p + 1, phase: 'tell', aided: false, ticks: [] });
        A.render(false);
      });
      if (!g.final) { g.phase = 'chapter'; sounds?.fx('page'); }
      else { g.phase = 'end'; sounds?.fx('star'); }
    } else return;
    A.render(keep);
    if (typeof document !== 'undefined' && matchMedia('(max-width: 800px)').matches) {
      if (['ctshow', 'ctread', 'cthint', 'cthide', 'ctretry'].includes(a)) {
        document.querySelector('.ct-card')?.scrollIntoView({ block: 'start' });
      } else if (a === 'ctvalidate') document.querySelector('.ct-feedback')?.scrollIntoView({ block: 'center' });
    }
  }
  // Le théâtre reste monté quand le formulaire change, y compris à la correction.
  function update(app, html) {
    const page = app.querySelector('.ct-story');
    if (!page || !html.startsWith('<div class="ct ct-story"')) return false;
    const template = document.createElement('template');
    template.innerHTML = html;
    const next = template.content.firstElementChild;
    if (next.dataset.zone !== page.dataset.zone) return false;
    const stage = page.firstElementChild, nextStage = next.firstElementChild;
    stage.classList.toggle('ct-awake', nextStage.classList.contains('ct-awake'));
    stage.setAttribute('aria-label', nextStage.getAttribute('aria-label'));
    page.dataset.phase = next.dataset.phase;
    const oldFocus = document.activeElement?.closest('[data-g="cttick"]');
    while (stage.nextElementSibling) stage.nextElementSibling.remove();
    page.append(...Array.from(next.children).slice(1));
    if (oldFocus) page.querySelector(`[data-g="cttick"][data-j="${Number(oldFocus.dataset.j)}"]`)?.focus({ preventScroll: true });
    return true;
  }
  let dispose = () => {}, mountedSurface = null, cloudArt;
  function mount() {
    const page = document.querySelector('.ct-story'), stage = page?.firstElementChild || null;
    const catalog = document.querySelector('.ct-library'), surface = stage || catalog;
    if (surface === mountedSurface) return;
    dispose();
    mountedSurface = surface;
    const g = A.g();
    const next = stage && g.p < g.f.parts.length - 1 ? scenes[(g.p + 1) % scenes.length][0] : scenes[0][0];
    sounds?.scene(stage?.dataset.scene, next);
    if (!stage) { dispose = catalog ? mountLibrary(catalog) : () => {}; return; }
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (!media.matches && !cloudArt) {
      cloudArt = new Image();
      cloudArt.src = 'jeu/conte/nuages-papier.png';
    }
    let frame = 0, x = 0, y = 0, scroll = 0;
    const draw = () => { frame = 0; stage.style.setProperty('--px', x.toFixed(2) + 'px'); stage.style.setProperty('--py', (y + scroll).toFixed(2) + 'px'); };
    const schedule = () => { if (!frame && !media.matches) frame = requestAnimationFrame(draw); };
    const move = e => { if (e.pointerType === 'touch') return; x = (e.clientX / window.innerWidth - .5) * 14; y = (e.clientY / window.innerHeight - .5) * 10; schedule(); };
    const reset = () => { x = y = 0; schedule(); };
    const app = document.getElementById('app');
    const scrolled = () => { scroll = Math.min(12, app.scrollTop / 30); schedule(); };
    const preference = () => { stage.style.setProperty('--px', '0px'); stage.style.setProperty('--py', '0px'); if (frame) cancelAnimationFrame(frame); frame = 0; };
    app.addEventListener('pointermove', move); app.addEventListener('pointerleave', reset); app.addEventListener('scroll', scrolled, { passive: true }); media.addEventListener('change', preference);
    dispose = () => { if (frame) cancelAnimationFrame(frame); app.removeEventListener('pointermove', move); app.removeEventListener('pointerleave', reset); app.removeEventListener('scroll', scrolled); media.removeEventListener('change', preference); };
  }
  return { view, act, update, mount, plan };
};
