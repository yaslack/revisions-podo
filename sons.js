// Sons pour réviser : bruits rose / brun / blanc, pluie, vagues, feu, ondes alpha.
// Tout est calculé dans le téléphone (Web Audio) : aucun fichier audio à télécharger, ça marche hors ligne.
// Une boucle de 14 s par son, générée au premier clic, raccordée en fondu pour qu'on n'entende pas la couture.
// Le choix et le volume restent sur le téléphone (podo:sons). Un mini-lecteur reste en bas de l'écran tant qu'un son est choisi.
(() => {
  const KEY = 'podo:sons';
  const st = { id: '', vol: 0.5, on: false, mini: false, pos: null, fx: true };   // fx : les sons des boutons et des jeux   // mini : lecteur réduit ; pos : où il a été déplacé (fraction de l'écran)
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const LIST = [
    { id: 'rose', n: 'Bruit rose', e: 'noisep', d: 'Doux et régulier : le bruit le plus étudié pour la concentration et la mémoire.' },
    { id: 'brun', n: 'Bruit brun', e: 'noisebr', d: 'Grave et enveloppant, comme une cascade au loin.' },
    { id: 'brun2', n: 'Brun profond', e: 'noisedeep', d: 'Encore plus grave : un grondement sourd et très calme.' },
    { id: 'blanc', n: 'Bruit blanc', e: 'noisew', d: 'Plus aigu : cache bien les voix et les bruits autour.' },
    { id: 'pluie', n: 'Pluie', e: 'rain', d: 'Une pluie régulière sur le toit.' },
    { id: 'vagues', n: 'Vagues', e: 'waves', d: 'Le ressac lent de la mer, pour se poser.' },
    { id: 'feu', n: 'Feu de cheminée', e: 'flame', d: 'Un grondement doux et quelques crépitements.' },
    { id: 'alpha', n: 'Ondes alpha', e: 'phones', d: 'Sons binauraux à 10 Hz : avec un casque seulement (effet encore discuté).' },
  ];
  const MUS = (window.MUSIQUE ? MUSIQUE.LIST : []).map(m => ({ id: m.id, n: m.n, e: m.e, d: m.d, m: true }));   // les musiques de musique.js
  LIST.unshift(...MUS);
  const byId = id => LIST.find(s => s.id === id);
  const ico = n => window.ico ? window.ico(n) : '';
  // icônes en SVG (les polices dessinées n'ont pas ▶ ⏸ ✕ : l'iPhone affiche « ? »)
  const svg = d => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const IC = { play: svg('<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>'), pause: svg('<path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z" fill="currentColor"/>'),
    min: svg('<path d="M6 12h12" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/>'),
    grip: svg('<g fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></g>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/>') };
  let ctx = null, master = null, src = [], playing = false, busy = '', storySource = null;
  const cache = {}, LOOP = 14, FADE = 1.5;
  const gainOf = v => v * v;   // le volume perçu suit mieux le carré du curseur

  // ---------- fabrication d'une boucle ----------
  function gen(id) {
    if (byId(id).m) { const [L, R] = MUSIQUE.render(id, 22050), b = ctx.createBuffer(2, L.length, 22050); b.getChannelData(0).set(L); b.getChannelData(1).set(R); return b; }
    const SR = ctx.sampleRate, N = Math.round(SR * LOOP), F = Math.round(SR * FADE), M = N + F, out = ctx.createBuffer(2, N, SR);
    for (let ch = 0; ch < 2; ch++) {
      const raw = new Float32Array(M), rnd = () => Math.random() * 2 - 1;
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, br = 0, lp = 0, lp2 = 0, hp = 0;
      const pink = () => { const w = rnd(); b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898; const p = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362; b6 = w * .115926; return p * .11; };
      const brown = () => { br = (br + .02 * rnd()) / 1.02; return br * 3.5; };
      for (let i = 0; i < M; i++) {
        const t = i / SR; let v;
        if (id === 'blanc') v = rnd();
        else if (id === 'rose') v = pink();
        else if (id === 'brun') v = brown();
        else if (id === 'brun2') { lp += (brown() - lp) * .04; lp2 += (lp - lp2) * .04; v = lp2; }   // deux filtres : seulement le grave
        else if (id === 'pluie') { const p = pink(); hp += (p - hp) * .02; v = (p - hp) * .8; }     // rose sans le grondement
        else if (id === 'vagues') { const sn = Math.sin(Math.PI * t / (LOOP / 2)), e = .12 + .88 * sn * sn * sn * sn; lp += (pink() - lp) * (.05 + .25 * e); v = (brown() * .5 + lp * 1.6) * e; }
        else if (id === 'feu') { lp += (brown() - lp) * .08; v = lp * .9; }
        raw[i] = v;
      }
      // gouttes et crépitements : de petits éclats de bruit qui s'éteignent vite
      const burst = (rate, dmin, dmax, amp) => { for (let k = 0, n = Math.round(rate * M / SR); k < n; k++) { const at = Math.floor(Math.random() * M), L = Math.round(SR * (dmin + Math.random() * (dmax - dmin))), a = amp * (.3 + Math.random() * .7); let f = 0;
        for (let j = 0; j < L * 4 && at + j < M; j++) { f += (rnd() - f) * .5; raw[at + j] += a * f * Math.exp(-j / L); } } };
      if (id === 'pluie') { burst(55, .002, .006, .5); burst(6, .01, .02, .35); }
      if (id === 'feu') { burst(7, .001, .004, 1.1); burst(1.2, .008, .02, .7); }
      let s = 0, pk = 0; for (let i = 0; i < M; i++) { s += raw[i] * raw[i]; pk = Math.max(pk, Math.abs(raw[i])); }
      const k = Math.min(.2 / Math.sqrt(s / M), .9 / pk), d = out.getChannelData(ch);   // même niveau pour tous les sons, sans saturer
      for (let i = 0; i < N; i++) { const x = i < F ? raw[i] * Math.sqrt(i / F) + raw[N + i] * Math.sqrt(1 - i / F) : raw[i]; d[i] = Math.max(-1, Math.min(1, x * k)); }
    }
    return out;
  }

  // ---------- lecture ----------
  function ensure() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
  }
  const ramp = (v, d) => { const g = master.gain, n = ctx.currentTime; g.cancelScheduledValues(n); g.setValueAtTime(g.value, n); g.linearRampToValueAtTime(v, n + d); };
  const session = t => { try { if (navigator.audioSession) navigator.audioSession.type = t; } catch (e) {} };   // iPhone : 'playback' joue même en mode silencieux
  function start(id) {
    ensure(); ctx.resume(); session('playback');
    const n = ctx.currentTime, at = src.length ? n + .2 : n;
    if (src.length) { ramp(0, .18); src.forEach(x => { try { x.stop(at); } catch (e) {} }); }
    st.id = id; st.on = true; save();
    if (id === 'alpha') {
      const m = ctx.createChannelMerger(2), g = ctx.createGain(), o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), bed = ctx.createBufferSource(), bg = ctx.createGain();
      o1.frequency.value = 200; o2.frequency.value = 210; g.gain.value = .25; bed.buffer = cache.rose || (cache.rose = gen('rose')); bed.loop = true; bg.gain.value = .25;
      o1.connect(m, 0, 0); o2.connect(m, 0, 1); m.connect(g); g.connect(master); bed.connect(bg); bg.connect(master);
      o1.start(at); o2.start(at); bed.start(at); src = [o1, o2, bed];
    } else {
      const s = ctx.createBufferSource(); s.buffer = cache[id] || (cache[id] = gen(id)); s.loop = true; s.connect(master); s.start(at); src = [s];
    }
    const g = master.gain; g.setValueAtTime(0, at); g.linearRampToValueAtTime(storySource ? 0 : gainOf(st.vol), at + 1);
    playing = true; ui();
  }
  function pause(now) {
    if (!ctx || !playing) return;
    playing = false;
    if (now) {
      master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(0, ctx.currentTime);
      src.forEach(x => { try { x.stop(); x.disconnect(); } catch (e) {} }); src = [];
      if (!storySource) { ctx.suspend(); session('ambient'); }
    } else { ramp(0, .25); setTimeout(() => { if (!playing && !storySource) { ctx.suspend(); session('ambient'); } }, 300); }
    ui();
  }
  const onLeave = () => { if (playing) pause(true); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) onLeave(); });
  addEventListener('pagehide', onLeave);
  addEventListener('blur', () => { if (document.activeElement?.tagName !== 'IFRAME') onLeave(); });
  function resume() { if (!st.id) return; if (!ctx || !src.length) return start(st.id); session('playback'); ctx.resume(); ramp(storySource ? 0 : gainOf(st.vol), .5); playing = true; ui(); }
  function stop() {
    if (ctx && src.length) { ramp(0, .3); const n = ctx.currentTime + .35; src.forEach(x => { try { x.stop(n); } catch (e) {} }); src = []; }
    playing = false; st.on = false; save(); ui(); if (!storySource) session('ambient');
  }
  function setVol(v) { st.vol = v; save(); if (ctx && playing && !storySource) master.gain.setTargetAtTime(gainOf(v), ctx.currentTime, .05); document.querySelectorAll('[data-sndvol]').forEach(r => { if (+r.value !== v) r.value = v; }); }

  // Une piste par décor. Le PCM est bouclé directement par le moteur audio.
  const STORY = {
    bridge: '01-le-pont-endormi', mill: '02-le-moulin-sans-vent', lantern: '03-la-lanterne-des-lucioles',
    garden: '04-le-jardin-silencieux', boat: '05-la-barque-des-souvenirs', gate: '06-la-porte-du-village',
    tree: '07-l-arbre-aux-histoires', chest: '08-le-coffre-etoile',
  };
  const storyBuffers = new Map();
  let storyArmed = false, storyScene = '', storyNext = '', storyTarget = '', request = 0;
  const musicOn = () => storyArmed && st.conteMusic !== false;
  const storyFXOn = () => (st.conteFX ?? st.fx) !== false;

  function loadStory(key) {
    let ready = storyBuffers.get(key);
    if (!ready) {
      ready = fetch(`jeu/conte/audio/${STORY[key]}.wav`).then(response => {
        if (!response.ok) throw new Error('Piste du conte indisponible');
        return response.arrayBuffer();
      }).then(data => ctx.decodeAudioData(data));
      ready.catch(() => { if (storyBuffers.get(key) === ready) storyBuffers.delete(key); });
    }
    storyBuffers.delete(key);
    storyBuffers.set(key, ready);
    if (storyBuffers.size > 3) storyBuffers.delete(storyBuffers.keys().next().value);
    return ready;
  }

  function fadeStory(track, duration) {
    if (!track) return;
    const now = ctx.currentTime, level = track.gain.gain;
    if (level.cancelAndHoldAtTime) level.cancelAndHoldAtTime(now);
    else { level.cancelScheduledValues(now); level.setValueAtTime(level.value, now); }
    level.linearRampToValueAtTime(0, now + duration);
    track.source.stop(now + duration);
  }

  function syncStory() {
    const key = musicOn() && !document.hidden ? storyScene : '';
    if (key === storyTarget) return;
    storyTarget = key;
    const token = ++request;
    if (!key) {
      fadeStory(storySource, document.hidden ? 0 : .28);
      storySource = null;
      if (playing) ramp(gainOf(st.vol), .32);
      else session('ambient');
      return;
    }
    if (storySource?.key !== key) loadStory(key).then(buffer => {
      if (token !== request || document.hidden) return;
      const now = ctx.currentTime, source = ctx.createBufferSource(), gain = ctx.createGain();
      source.buffer = buffer;
      source.loop = true;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(.32, now + .55);
      source.connect(gain).connect(ctx.destination);
      source.onended = () => { source.disconnect(); gain.disconnect(); };
      source.start();
      fadeStory(storySource, .55);
      storySource = { key, source, gain };
      if (playing) ramp(0, .32);
    }).catch(() => { if (token === request) storyTarget = ''; });
    if (STORY[storyNext] && storyNext !== key) loadStory(storyNext).catch(() => {});
  }

  function armStory() {
    try {
      storyArmed = true;
      if (!musicOn()) return;
      ensure();
      session('playback');
      if (ctx.state !== 'running') ctx.resume().catch(() => {});
      syncStory();
    } catch (_) { storyArmed = false; }
  }

  function selectStory(key, next) {
    storyScene = STORY[key] ? key : '';
    storyNext = next;
    if (storyScene && musicOn()) armStory();
    else syncStory();
  }
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && storyScene && musicOn()) armStory();
    else if (document.hidden) syncStory();
  });
  addEventListener('pagehide', () => { storyArmed = false; syncStory(); });

  // ---------- sons d'interface : de petites notes jouées à la volée (forme d'onde, puis [fréquence, départ, durée, volume, glisse vers]) ----------
  const FX = {
    tap: ['sine', [[440, 0, .05, .1, 620]]], nav: ['sine', [[330, 0, .06, .07, 440]]], tick: ['sine', [[900, 0, .03, .07]]], reveal: ['sine', [[523, 0, .09, .09, 660]]],
    hit: ['square', [[196, 0, .05, .13, 98], [131, .04, .1, .12, 65]]], crit: ['square', [[262, 0, .05, .14, 131], [523, .05, .07, .12], [784, .11, .22, .13]]], hurt: ['sawtooth', [[147, 0, .14, .13, 73], [98, .1, .2, .11, 55]]],
    loot: ['sine', [[659, 0, .08, .13], [880, .08, .08, .13], [1109, .16, .08, .13], [1319, .24, .4, .15]]], lvl: ['sine', [[523, 0, .1, .15], [659, .1, .1, .15], [784, .2, .1, .15], [1047, .3, .12, .16], [1319, .42, .6, .17], [1568, .42, .6, .08]]],
    boss: ['sawtooth', [[110, 0, .3, .13, 104], [104, .3, .3, .13, 98], [98, .6, .7, .15, 65]]],
    good: ['sine', [[784, 0, .09, .15], [1047, .07, .18, .15]]], pair: ['sine', [[880, 0, .07, .13], [1319, .05, .14, .11]]],
    bad: ['triangle', [[233, 0, .16, .2, 175], [175, .12, .22, .16, 131]]],
    life: ['triangle', [[392, 0, .12, .2, 294], [294, .11, .12, .2, 220], [220, .22, .32, .2, 139]]],
    start: ['sine', [[523, 0, .08, .13], [659, .08, .08, .13], [784, .16, .16, .15]]],
    over: ['triangle', [[523, 0, .16, .17], [494, .16, .16, .17], [415, .32, .16, .17], [330, .48, .55, .19]]],
    win: ['sine', [[659, 0, .1, .14], [784, .1, .1, .14], [1047, .2, .32, .15]]],
    star: ['sine', [[784, 0, .09, .14], [988, .08, .09, .14], [1175, .16, .09, .14], [1568, .24, .5, .16], [2093, .3, .5, .07]]],
    record: ['sine', [[523, 0, .12, .15], [659, .12, .12, .15], [784, .24, .12, .15], [1047, .36, .2, .16], [784, .52, .1, .13], [1047, .62, .6, .17], [1319, .62, .6, .09]]],
  };
  let fxg = null;
  function playFX(def, up = 0) {   // up : demi-tons en plus (les bonnes réponses d'affilée montent)
    if (!def) return;
    try {
      ensure(); if (ctx.state !== 'running') ctx.resume().catch(() => {});
      if (!fxg) { fxg = ctx.createGain(); fxg.gain.value = .55; fxg.connect(ctx.destination); }
      const n = ctx.currentTime + .005, tr = Math.pow(2, up / 12);
      for (const [f, t0, d, v, f2] of def[1]) {
        const o = ctx.createOscillator(), g = ctx.createGain(), a = n + t0;
        o.type = def[0]; o.frequency.setValueAtTime(f * tr, a); if (f2) o.frequency.exponentialRampToValueAtTime(f2 * tr, a + d);
        g.gain.setValueAtTime(0, a); g.gain.linearRampToValueAtTime(v, a + .006); g.gain.exponentialRampToValueAtTime(.0001, a + d);
        o.connect(g); g.connect(fxg); o.start(a); o.stop(a + d + .02);
      }
    } catch (e) {}
  }
  const fx = (name, up) => { if (st.fx !== false) playFX(FX[name], up); };
  const STORY_FX = {
    tap: ['sine', [[392, 0, .065, .07, 330]]],
    tick: ['sine', [[784, 0, .095, .075]]],
    undo: ['triangle', [[440, 0, .07, .045, 392]]],
    page: ['sine', [[523, .04, .12, .065, 587]]],
    pass: ['sine', [[392, 0, .20, .09], [494, .08, .21, .09], [587, .16, .27, .10], [784, .24, .47, .07]]],
    retry: ['sine', [[392, 0, .15, .075], [330, .11, .26, .07]]],
    star: ['sine', [[587, 0, .19, .08], [784, .13, .22, .10], [988, .23, .31, .11], [1175, .34, .64, .08]]],
    clouds: ['sine', [[392, .26, .33, .025], [587, .54, .40, .045], [784, .68, .35, .038]]],
  };
  let paperNoise;
  function rustle(delay, duration, volume, sharpness, panFrom, panTo) {
    if (!paperNoise) {
      paperNoise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 1.2), ctx.sampleRate);
      const samples = paperNoise.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    }
    const when = ctx.currentTime + delay, noise = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    noise.buffer = paperNoise;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(sharpness, when);
    filter.frequency.exponentialRampToValueAtTime(sharpness * .55, when + duration);
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume, when + duration * .35);
    gain.gain.exponentialRampToValueAtTime(.0001, when + duration);
    noise.connect(filter).connect(gain);
    if (pan) {
      pan.pan.setValueAtTime(panFrom, when);
      pan.pan.linearRampToValueAtTime(panTo, when + duration);
      gain.connect(pan).connect(fxg);
    } else gain.connect(fxg);
    noise.start(when, Math.random() * .35);
    noise.stop(when + duration);
    noise.onended = () => { noise.disconnect(); filter.disconnect(); gain.disconnect(); pan?.disconnect(); };
  }
  function storyFX(name) {
    if (!storyFXOn() || !STORY_FX[name]) return;
    playFX(STORY_FX[name]);
    if (!fxg) return;
    if (name === 'clouds') {
      rustle(.01, .43, .145, 840, .8, -.55);
      rustle(.20, .61, .155, 1550, .65, -.7);
      rustle(.49, .57, .17, 2100, .7, -.9);
    } else if (name === 'page') rustle(0, .24, .12, 1820, .35, -.27);
    else if (name === 'tap' || name === 'tick' || name === 'undo') rustle(0, .075, .10, 2400, 0, .1);
  }
  const conte = {
    arm: armStory, scene: selectStory, fx: storyFX, musicOn, fxOn: storyFXOn,
    toggleMusic() { st.conteMusic = !musicOn(); save(); if (st.conteMusic) armStory(); else syncStory(); },
    toggleFX() { st.conteFX = !storyFXOn(); save(); if (st.conteFX) storyFX('tap'); },
  };
  // tout ce qui se touche fait un petit bruit ; les jeux et les quiz jouent leurs propres sons (data-g, data-qa, data-q3) depuis app.js
  const BYID = { qok: 'good', qko: 'bad', done: 'pair', bknow: 'pair', cknow: 'pair', aknow: 'pair' };
  document.addEventListener('click', e => {
    const t = e.target.closest('a[href], button, summary, .reveal'); if (!t || t.disabled) return;
    const enterStory = t.getAttribute('href')?.startsWith('#/jeu/conte/');
    if (enterStory) armStory();
    if (enterStory || t.closest('.ct')) {
      if (!t.dataset.g) storyFX(t.matches('summary') ? 'page' : 'tap');
      return;
    }
    if (t.dataset.g || t.dataset.qa || t.dataset.q3 || t.dataset.snd || t.hasAttribute('data-sndpp')) return;
    fx(BYID[t.id] || (t.classList.contains('reveal') ? 'reveal' : t.matches('a[href]') ? 'nav' : 'tap'));
  }, true);

  // ---------- la carte de l'accueil et le mini-lecteur ----------
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const vol = () => `<input type="range" min="0" max="1" step="0.01" value="${st.vol}" data-sndvol aria-label="Volume du son">`;
  function card() {
    const cur = byId(st.id);
    return `<div class="card sndcard" id="sndcard">
      <div class="trow"><div><div class="kicker">${ico('phones')} SONS POUR RÉVISER</div><div class="muted small">${busy ? `Je prépare « ${esc(byId(busy).n)} »…` : st.on && cur ? (playing ? `En cours : ${ico(cur.e)} ${esc(cur.n)}` : `En pause : ${ico(cur.e)} ${esc(cur.n)}`) : 'Choisis un son : il joue en fond pendant que tu révises.'}</div></div>
        ${st.on ? `<button class="btn ghost sndoff" data-sndx>Couper</button>` : ''}</div>
      ${[['MUSIQUES', LIST.filter(s => s.m)], ['BRUITS', LIST.filter(s => !s.m)]].filter(x => x[1].length).map(([h, l]) => `<div class="sndh">${h}</div>
      <div class="sndgrid">${l.map(s => `<button class="sndchip ${st.on && st.id === s.id ? 'on' : ''}" data-snd="${s.id}" aria-pressed="${st.on && st.id === s.id && playing}"><span class="em">${ico(s.e)}</span>${esc(s.n)}</button>`).join('')}</div>`).join('')}
      ${st.on && cur ? `<div class="sndd small muted">${esc(cur.d)}</div><label class="sndvol">${ico('spklow')} ${vol()} ${ico('spkhigh')}</label>` : ''}
      <div class="sndh">SONS DES BOUTONS ET DES JEUX</div><button class="btn ghost" data-sndfx aria-pressed="${st.fx !== false}">${st.fx !== false ? 'Activés : toucher pour couper' : 'Coupés : toucher pour remettre'}</button>
    </div>`;
  }
  function ui(animMin) {
    if (!animMin) { const c = document.getElementById('sndcard'); if (c) c.outerHTML = card(); }
    let b = document.getElementById('sndbar');
    const cur = byId(st.id);
    if (!st.on || !cur) { if (b) b.remove(); document.body.classList.remove('sndon'); return; }
    if (!b) { b = document.createElement('div'); b.id = 'sndbar'; b.className = 'sndbar'; document.body.appendChild(b); }
    const r0 = animMin ? b.getBoundingClientRect() : null;
    if (b.dataset.id !== st.id) {
      b.dataset.id = st.id;
      b.innerHTML = `<span class="sndgrip" aria-label="Déplacer le lecteur" title="Déplacer">${IC.grip}</span><button class="sndpp" data-sndpp></button><button class="sndexp" data-sndmin aria-label="Agrandir le lecteur">${ico(cur.e)}</button><div class="sndfull"><span class="sndn">${ico(cur.e)} ${esc(cur.n)}</span>${vol()}<button class="sndmin" data-sndmin aria-label="Réduire le lecteur">${IC.min}</button><button class="sndx" data-sndx aria-label="Arrêter le son">${IC.close}</button></div>`;
    }
    const pp = b.querySelector('.sndpp'); if (pp) { pp.setAttribute('aria-label', playing ? 'Pause' : 'Lecture'); pp.innerHTML = playing ? IC.pause : IC.play; }
    b.classList.toggle('paused', !playing); b.classList.toggle('mini', !!st.mini); document.body.classList.add('sndon');
    place(b);
    if (r0 && b.animate) {
      const r1 = b.getBoundingClientRect();
      const kf0 = { width: r0.width + 'px' }, kf1 = { width: r1.width + 'px' };
      if (st.pos) { kf0.left = r0.left + 'px'; kf0.top = r0.top + 'px'; kf1.left = r1.left + 'px'; kf1.top = r1.top + 'px'; }
      b.animate([kf0, kf1], { duration: 420, easing: 'cubic-bezier(.22, 1.28, .36, 1)' });
    }
  }
  // le lecteur se déplace en le tenant par la poignée ⠿ ; sa place est gardée (en fraction de l'écran) et reste dans l'écran
  function place(b) {
    if (!st.pos) { b.style.left = b.style.top = ''; b.classList.remove('moved'); return; }
    const W = innerWidth, H = innerHeight, w = st.mini ? 106 : Math.min(W * 0.92, 400), h = b.offsetHeight || 50;
    b.classList.add('moved');
    b.style.left = Math.max(6, Math.min(W - w - 6, st.pos.x * W)) + 'px'; b.style.top = Math.max(6, Math.min(H - h - 6, st.pos.y * H)) + 'px';
  }
  let drag = null;
  document.addEventListener('pointerdown', e => {
    const g = e.target.closest('.sndgrip'); if (!g) return;
    const b = g.closest('.sndbar'), r = b.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, b }; b.classList.add('dragging'); e.preventDefault(); try { g.setPointerCapture(e.pointerId); } catch (er) {}
  });
  document.addEventListener('pointermove', e => {
    if (!drag) return; e.preventDefault();
    st.pos = { x: (e.clientX - drag.dx) / innerWidth, y: (e.clientY - drag.dy) / innerHeight }; place(drag.b);
  }, { passive: false });
  document.addEventListener('pointerup', () => { if (drag) { drag.b.classList.remove('dragging'); drag = null; save(); } });
  addEventListener('resize', () => { const b = document.getElementById('sndbar'); if (b) place(b); });
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-snd], [data-sndpp], [data-sndx], [data-sndmin], [data-sndfx]'); if (!t) return;
    if (t.hasAttribute('data-sndfx')) { st.fx = st.fx === false; save(); ui(); return; }
    const want = t.dataset.snd || (t.hasAttribute('data-sndpp') && !src.length && st.id);
    if (want && byId(want) && byId(want).m && !cache[want]) {   // première écoute d'une musique : on affiche « Je prépare… », puis on la calcule
      if (busy) return; busy = want; ensure(); ctx.resume(); ui();
      setTimeout(() => { try { cache[want] = gen(want); } catch (er) {} busy = ''; if (cache[want] && !document.hidden) start(want); else ui(); }, 60); return;
    }
    if (t.hasAttribute('data-sndmin')) { st.mini = !st.mini; save(); ui(true); return; }
    if (t.dataset.snd) { if (st.on && st.id === t.dataset.snd) (playing ? pause : resume)(); else start(t.dataset.snd); }
    else if (t.hasAttribute('data-sndpp')) (playing ? pause : resume)();
    else stop();
  });
  document.addEventListener('input', e => { if (e.target.hasAttribute && e.target.hasAttribute('data-sndvol')) setVol(+e.target.value); });
  // un son choisi avant de fermer l'appli revient en pause : un toucher sur ▶ le relance (le navigateur interdit de jouer tout seul)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
  window.SONS = { card, LIST, fx, conte, play: start, stop, playing: () => playing ? st.id : '' };
})();
