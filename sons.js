// Sons pour réviser : bruits rose / brun / blanc, pluie, vagues, feu, ondes alpha.
// Tout est calculé dans le téléphone (Web Audio) : aucun fichier audio à télécharger, ça marche hors ligne.
// Une boucle de 14 s par son, générée au premier clic, raccordée en fondu pour qu'on n'entende pas la couture.
// Le choix et le volume restent sur le téléphone (podo:sons). Un mini-lecteur reste en bas de l'écran tant qu'un son est choisi.
(() => {
  const KEY = 'podo:sons';
  const st = { id: '', vol: 0.5, on: false, mini: false, pos: null };   // mini : lecteur réduit ; pos : où il a été déplacé (fraction de l'écran)
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  const LIST = [
    { id: 'rose', n: 'Bruit rose', e: '🌸', d: 'Doux et régulier : le bruit le plus étudié pour la concentration et la mémoire.' },
    { id: 'brun', n: 'Bruit brun', e: '🟤', d: 'Grave et enveloppant, comme une cascade au loin.' },
    { id: 'brun2', n: 'Brun profond', e: '🌑', d: 'Encore plus grave : un grondement sourd et très calme.' },
    { id: 'blanc', n: 'Bruit blanc', e: '⚪', d: 'Plus aigu : cache bien les voix et les bruits autour.' },
    { id: 'pluie', n: 'Pluie', e: '🌧', d: 'Une pluie régulière sur le toit.' },
    { id: 'vagues', n: 'Vagues', e: '🌊', d: 'Le ressac lent de la mer, pour se poser.' },
    { id: 'feu', n: 'Feu de cheminée', e: '🔥', d: 'Un grondement doux et quelques crépitements.' },
    { id: 'alpha', n: 'Ondes alpha', e: '🎧', d: 'Sons binauraux à 10 Hz : avec un casque seulement (effet encore discuté).' },
  ];
  const byId = id => LIST.find(s => s.id === id);
  // icônes en SVG (les polices dessinées n'ont pas ▶ ⏸ ✕ : l'iPhone affiche « ? »)
  const svg = d => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const IC = { play: svg('<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>'), pause: svg('<path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z" fill="currentColor"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none"/>') };
  let ctx = null, master = null, src = [], playing = false;
  const cache = {}, LOOP = 14, FADE = 1.5;
  const gainOf = v => v * v;   // le volume perçu suit mieux le carré du curseur

  // ---------- fabrication d'une boucle ----------
  function gen(id) {
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
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}   // iPhone : jouer même en mode silencieux
  }
  const ramp = (v, d) => { const g = master.gain, n = ctx.currentTime; g.cancelScheduledValues(n); g.setValueAtTime(g.value, n); g.linearRampToValueAtTime(v, n + d); };
  function start(id) {
    ensure(); ctx.resume();
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
    const g = master.gain; g.setValueAtTime(0, at); g.linearRampToValueAtTime(gainOf(st.vol), at + 1);
    playing = true; ui();
  }
  function pause() { if (!ctx || !playing) return; ramp(0, .25); setTimeout(() => { if (!playing) ctx.suspend(); }, 300); playing = false; ui(); }
  function resume() { if (!st.id) return; if (!ctx || !src.length) return start(st.id); ctx.resume(); ramp(gainOf(st.vol), .5); playing = true; ui(); }
  function stop() {
    if (ctx && src.length) { ramp(0, .3); const n = ctx.currentTime + .35; src.forEach(x => { try { x.stop(n); } catch (e) {} }); src = []; }
    playing = false; st.on = false; save(); ui();
  }
  function setVol(v) { st.vol = v; save(); if (ctx && playing) master.gain.setTargetAtTime(gainOf(v), ctx.currentTime, .05); document.querySelectorAll('[data-sndvol]').forEach(r => { if (+r.value !== v) r.value = v; }); }

  // ---------- la carte de l'accueil et le mini-lecteur ----------
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const vol = () => `<input type="range" min="0" max="1" step="0.01" value="${st.vol}" data-sndvol aria-label="Volume du son">`;
  function card() {
    const cur = byId(st.id);
    return `<div class="card sndcard" id="sndcard">
      <div class="trow"><div><div class="kicker">🎧 SONS POUR RÉVISER</div><div class="muted small">${st.on && cur ? (playing ? `En cours : ${cur.e} ${esc(cur.n)}` : `En pause : ${cur.e} ${esc(cur.n)}`) : 'Choisis un son : il joue en fond pendant que tu révises.'}</div></div>
        ${st.on ? `<button class="btn ghost sndoff" data-sndx>Couper</button>` : ''}</div>
      <div class="sndgrid">${LIST.map(s => `<button class="sndchip ${st.on && st.id === s.id ? 'on' : ''}" data-snd="${s.id}" aria-pressed="${st.on && st.id === s.id && playing}"><span class="em">${s.e}</span>${esc(s.n)}</button>`).join('')}</div>
      ${st.on && cur ? `<div class="sndd small muted">${esc(cur.d)}</div><label class="sndvol">🔈 ${vol()} 🔊</label>` : ''}
    </div>`;
  }
  function ui() {
    const c = document.getElementById('sndcard'); if (c) c.outerHTML = card();
    let b = document.getElementById('sndbar');
    const cur = byId(st.id);
    if (!st.on || !cur) { if (b) b.remove(); document.body.classList.remove('sndon'); return; }
    if (!b) { b = document.createElement('div'); b.id = 'sndbar'; b.className = 'sndbar'; document.body.appendChild(b); }
    const pp = `<button class="sndpp" data-sndpp aria-label="${playing ? 'Pause' : 'Lecture'}">${playing ? IC.pause : IC.play}</button>`, grip = '<span class="sndgrip" aria-label="Déplacer le lecteur" title="Déplacer">⠿</span>';
    b.innerHTML = st.mini ? `${grip}${pp}<button class="sndexp" data-sndmin aria-label="Agrandir le lecteur">${cur.e}</button>`
      : `${grip}${pp}<span class="sndn">${cur.e} ${esc(cur.n)}</span>${vol()}<button class="sndmin" data-sndmin aria-label="Réduire le lecteur">–</button><button class="sndx" data-sndx aria-label="Arrêter le son">${IC.close}</button>`;
    b.classList.toggle('paused', !playing); b.classList.toggle('mini', !!st.mini); document.body.classList.add('sndon');
    place(b);
  }
  // le lecteur se déplace en le tenant par la poignée ⠿ ; sa place est gardée (en fraction de l'écran) et reste dans l'écran
  function place(b) {
    if (!st.pos) { b.style.left = b.style.top = ''; b.classList.remove('moved'); return; }
    const W = innerWidth, H = innerHeight, w = b.offsetWidth, h = b.offsetHeight;
    b.classList.add('moved');
    b.style.left = Math.max(6, Math.min(W - w - 6, st.pos.x * W)) + 'px'; b.style.top = Math.max(6, Math.min(H - h - 6, st.pos.y * H)) + 'px';
  }
  let drag = null;
  document.addEventListener('pointerdown', e => {
    const g = e.target.closest('.sndgrip'); if (!g) return;
    const b = g.closest('.sndbar'), r = b.getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, b }; e.preventDefault(); try { g.setPointerCapture(e.pointerId); } catch (er) {}
  });
  document.addEventListener('pointermove', e => {
    if (!drag) return; e.preventDefault();
    st.pos = { x: (e.clientX - drag.dx) / innerWidth, y: (e.clientY - drag.dy) / innerHeight }; place(drag.b);
  }, { passive: false });
  document.addEventListener('pointerup', () => { if (drag) { drag = null; save(); } });
  addEventListener('resize', () => { const b = document.getElementById('sndbar'); if (b) place(b); });
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-snd], [data-sndpp], [data-sndx], [data-sndmin]'); if (!t) return;
    if (t.hasAttribute('data-sndmin')) { st.mini = !st.mini; save(); ui(); return; }
    if (t.dataset.snd) { if (st.on && st.id === t.dataset.snd) (playing ? pause : resume)(); else start(t.dataset.snd); }
    else if (t.hasAttribute('data-sndpp')) (playing ? pause : resume)();
    else stop();
  });
  document.addEventListener('input', e => { if (e.target.hasAttribute && e.target.hasAttribute('data-sndvol')) setVol(+e.target.value); });
  // un son choisi avant de fermer l'appli revient en pause : un toucher sur ▶ le relance (le navigateur interdit de jouer tout seul)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ui); else ui();
  window.SONS = { card, LIST };
})();
