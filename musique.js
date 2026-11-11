// Musiques pour réviser : 4 boucles de 8 mesures, composées ici (accords, basse, mélodie, batterie) et jouées par un petit synthé.
// Comme les bruits de sons.js : aucun fichier audio, tout est calculé dans le téléphone au premier clic, ça marche hors ligne.
// Les notes qui dépassent la fin de la boucle reviennent au début : la boucle se raccorde sans couture.
// ponytail: une boucle se calcule d'un bloc (environ 1 s sur un téléphone) ; si ça gêne, la calculer dans un Worker.
(() => {
  const TAU = Math.PI * 2, hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const prng = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // les instruments : (fréquence, durée tenue) → { dur : durée totale avec la queue, fn(t) : l'échantillon au temps t }
  const rel = (t, len, r) => t > len ? Math.exp(-(t - len) / r) : 1;
  const INS = {
    rhodes: (f, len) => ({ dur: len + .6, fn: t => { const w = TAU * f * t; return Math.min(1, t / .004) * Math.exp(-t / 1.4) * rel(t, len, .12) * (Math.sin(w + (1.1 * Math.exp(-t / .3) + .2) * Math.sin(w)) + .1 * Math.exp(-t / .08) * Math.sin(w * 7.01)); } }),
    pad: (f, len) => ({ dur: len + 2.4, fn: t => { const a = TAU * f * t * .9975, b = TAU * f * t * 1.0025; return .3 * Math.min(1, t / .7) * rel(t, len, .7) * (Math.sin(a) + Math.sin(b) + .32 * (Math.sin(2 * a) + Math.sin(2 * b)) + .12 * (Math.sin(3 * a) + Math.sin(3 * b))); } }),
    piano: (f, len) => ({ dur: len + 1.2, fn: t => { const w = TAU * f * t; let v = 0; for (let h = 1; h <= 5; h++) v += Math.sin(w * h * (1 + .0004 * h * h)) / h * Math.exp(-t * (.45 + .55 * h)); return Math.min(1, t / .003) * rel(t, len, .3) * v; } }),
    pluck: f => ({ dur: 1.8, fn: t => { const w = TAU * f * t; return Math.min(1, t / .002) * Math.exp(-t / .5) * Math.sin(w + .9 * Math.exp(-t / .06) * Math.sin(3 * w)); } }),
    bell: f => ({ dur: 3.2, fn: t => { const w = TAU * f * t; return Math.min(1, t / .002) * Math.exp(-t / 1.1) * Math.sin(w + .5 * Math.exp(-t / .3) * Math.sin(3.5 * w)); } }),
    bass: (f, len) => ({ dur: len + .25, fn: t => { const w = TAU * f * t; return Math.min(1, t / .008) * Math.exp(-t / .8) * rel(t, len, .06) * Math.tanh(1.4 * (Math.sin(w) + .5 * Math.sin(2 * w) + .2 * Math.sin(3 * w))); } }),
  };

  function render(tr, SR) {
    const stepS = 60 / tr.bpm / 4, N = Math.round(8 * 16 * stepS * SR), rand = prng(tr.seed || 7);
    const H = [new Float32Array(N), new Float32Array(N)], D = [new Float32Array(N), new Float32Array(N)], duck = new Float32Array(N).fill(1);
    const at = s => s * stepS + (Math.round(s) % 2 ? (tr.swing || 0) * stepS : 0);   // le contretemps est un peu en retard (swing)
    const put = (B, t0, dur, vel, pan, fn) => {
      const i0 = Math.round(t0 * SR), n = Math.round(dur * SR), gl = vel * Math.cos(pan * Math.PI / 2), gr = vel * Math.sin(pan * Math.PI / 2);
      for (let j = 0; j < n; j++) { const v = fn(j / SR), i = (i0 + j) % N; B[0][i] += gl * v; B[1][i] += gr * v; }
    };
    const noise = () => rand() * 2 - 1;
    const api = {
      n: (kind, step, midi, len, vel, pan = .5, late = 0) => { const v = INS[kind](hz(midi), len * stepS); put(H, at(step) + late, v.dur, vel * (.9 + .2 * rand()), pan, v.fn); },
      kick: (step, vel) => { const t0 = at(step), i0 = Math.round(t0 * SR);
        put(D, t0, .5, vel, .5, t => Math.sin(TAU * (45 * t + 3.15 * (1 - Math.exp(-t / .035)))) * Math.exp(-t / .16));
        for (let j = 0; j < .45 * SR; j++) { const i = (i0 + j) % N; duck[i] = Math.min(duck[i], 1 - .38 * vel * Math.exp(-j / SR / .11)); } },   // les accords s'effacent un peu sous la grosse caisse
      snare: (step, vel) => { let lp = 0; put(D, at(step), .3, vel, .5, t => { const x = noise(); lp += (x - lp) * .3; return (x - lp) * Math.exp(-t / .07) * .8 + .5 * Math.sin(TAU * 185 * t) * Math.exp(-t / .045); }); },
      hat: (step, vel, open) => { let p = 0; const tau = open ? .09 : .022; put(D, at(step), tau * 5, vel * (.8 + .4 * rand()), .62, t => { const x = noise(), v = x - p; p = x; return v * Math.exp(-t / tau); }); },
    };
    tr.make(api);
    if (tr.vinyl) for (let c = 0; c < 2; c++) { let lp = 0, cr = 0; for (let i = 0; i < N; i++) { lp += (noise() - lp) * .3; if (rand() < 5 / SR) cr = (rand() - .3) * .2; cr *= .86; D[c][i] += lp * .012 * tr.vinyl + cr * tr.vinyl; } }   // souffle et craquements de vinyle
    const out = [];
    for (let c = 0; c < 2; c++) {
      const x = H[c], k = 1 - Math.exp(-TAU * (tr.lp || 6000) / SR); let lp = 0;
      for (let i = 0; i < N; i++) x[i] *= duck[i];
      for (let lap = 0; lap < 2; lap++) for (let i = 0; i < N; i++) { lp += (x[i] - lp) * k; if (lap) x[i] = lp; }   // son feutré : on coupe les aigus (2 tours pour que le filtre soit déjà lancé au début de la boucle)
      // réverbération : 4 échos bouclés puis 2 diffuseurs, sur 2 tours de boucle
      const wet = new Float32Array(N);
      for (const ms of c ? [33.3, 38.9, 43.7, 49.1] : [31.7, 37.1, 41.1, 47.9]) { const d = Math.round(ms * SR / 1000), y = new Float32Array(N); let f = 0;
        for (let lap = 0; lap < 2; lap++) for (let i = 0; i < N; i++) { f += (y[(i - d + N) % N] - f) * .45; y[i] = x[i] + .83 * f; }
        for (let i = 0; i < N; i++) wet[i] += (y[i] - x[i]) * .25; }
      for (const ms of [5.1, 1.7]) { const d = Math.round(ms * SR / 1000), y = new Float32Array(N);
        for (let lap = 0; lap < 2; lap++) for (let i = 0; i < N; i++) y[i] = -.6 * wet[i] + wet[(i - d + N) % N] + .6 * y[(i - d + N) % N];
        wet.set(y); }
      const m = new Float32Array(N); for (let i = 0; i < N; i++) m[i] = x[i] + (tr.wet || .2) * wet[i] + D[c][i];
      out.push(m);
    }
    // même niveau que les bruits de sons.js, sans saturer
    let s = 0, pk = 0; for (const m of out) for (let i = 0; i < N; i++) { s += m[i] * m[i]; pk = Math.max(pk, Math.abs(m[i])); }
    const g = Math.min(.17 / Math.sqrt(s / (2 * N)), .92 / pk); for (const m of out) for (let i = 0; i < N; i++) m[i] *= g;
    return out;
  }

  // ---------- les 4 morceaux (notes en numéros MIDI : 60 = do du milieu ; un pas = une double croche, 16 par mesure) ----------
  const LIST = [
    { id: 'cafe', n: 'Café lo-fi', e: 'book', d: 'Piano électrique, basse ronde et batterie qui traîne un peu : le classique pour bosser.', bpm: 72, swing: .2, lp: 5200, wet: .2, vinyl: 1, seed: 11,
      make: ({ n, kick, snare, hat }) => {
        const CH = [[57, 60, 64, 67], [55, 59, 62, 64], [53, 57, 60, 64], [52, 55, 59, 62], [57, 60, 64, 67], [55, 59, 62, 64], [53, 57, 60, 64], [53, 57, 60, 64]], B = [41, 40, 38, 36, 41, 40, 38, 43];   // Fmaj9 Em7 Dm9 Cmaj9 · Fmaj9 Em7 Dm9 G9sus
        const MEL = [[[2, 69, 3], [6, 72, 2], [8, 76, 6]], [[2, 74, 3], [6, 71, 2], [8, 67, 6]], [[0, 69, 2], [3, 72, 2], [6, 76, 2], [8, 74, 3], [12, 72, 4]], [[2, 71, 3], [6, 67, 8]],
          [[2, 69, 3], [6, 72, 2], [8, 76, 3], [12, 79, 4]], [[2, 74, 3], [6, 76, 2], [8, 71, 6]], [[2, 72, 2], [4, 74, 2], [6, 76, 2], [8, 69, 6]], [[2, 67, 3], [6, 69, 2], [8, 72, 4], [13, 74, 3]]];
        for (let b = 0; b < 8; b++) { const s = b * 16;
          CH[b].forEach((m, i) => { n('rhodes', s, m, 6, .2, .34 + i * .1, i * .014); n('rhodes', s + 10, m, 5, .13, .34 + i * .1, i * .01); });
          n('bass', s, B[b], 5, .5); n('bass', s + 7, B[b] + 12, 1.5, .26); n('bass', s + 10, B[b], 4, .42);
          kick(s, .9); kick(s + 7, .4); kick(s + 10, .8); snare(s + 4, .3); snare(s + 12, .34);
          for (let h = 0; h < 16; h += 2) hat(s + h, h % 4 ? .1 : .06); if (b % 2) hat(s + 15, .05);
          MEL[b].forEach(([st, m]) => n('pluck', s + st, m, 1, .26, .62));
        } } },
    { id: 'nuit', n: 'Nuit calme', e: 'moon', d: 'Nappes douces et petites notes qui montent et redescendent, presque sans batterie : pour les longues séances.', bpm: 80, lp: 4600, wet: .34, seed: 23,
      make: ({ n, kick, hat }) => {
        const CH = [[60, 64, 67, 71], [57, 60, 64, 67], [55, 59, 62, 64], [59, 62, 67, 69]], B = [45, 41, 48, 43];   // Am9 Fmaj7 Cmaj9 Gadd9
        const ARP = [[64, 69, 72, 76, 71, 72, 69, 64], [65, 69, 72, 76, 72, 69, 67, 69], [64, 67, 72, 74, 76, 74, 72, 67], [62, 67, 69, 71, 74, 71, 69, 67]];
        const TOP = [[[4, 81]], [[4, 79]], [[4, 76], [12, 79]], [[4, 74]]];   // au 2e passage, une cloche lente par-dessus
        for (let b = 0; b < 8; b++) { const s = b * 16, c = b % 4;
          CH[c].forEach((m, i) => n('pad', s, m, 15, .1, .25 + i * .17));
          n('bass', s, B[c], 12, .42); n('bass', s + 12, B[c] + 7, 3, .18);
          ARP[c].forEach((m, i) => n('pluck', s + i * 2, m, 1, i % 4 ? .15 : .2, i % 2 ? .3 : .7));
          kick(s, .5); kick(s + 8, .32); hat(s + 4, .035, true); hat(s + 12, .035, true);
          if (b > 3) TOP[c].forEach(([st, m]) => n('bell', s + st, m, 1, .13, .5));
        } } },
    { id: 'soleil', n: 'Bonne humeur', e: 'sparkle', d: 'Plus rapide et plus claire, avec une petite mélodie qui sautille : pour se motiver à s\'y mettre.', bpm: 90, swing: .13, lp: 6800, wet: .18, vinyl: .5, seed: 37,
      make: ({ n, kick, snare, hat }) => {
        const CH = [[54, 57, 61, 64], [54, 57, 59, 62], [55, 59, 62, 66], [55, 57, 62, 64]], B = [38, 47, 43, 45];   // Dmaj7 Bm7 Gmaj7 A7sus
        const MEL = [[[0, 78], [3, 81], [6, 78], [8, 76], [12, 74]], [[2, 74], [4, 78], [6, 76], [8, 74], [12, 71]], [[0, 71], [3, 74], [6, 71], [8, 69], [11, 71], [13, 74]], [[0, 76], [8, 74], [10, 76], [12, 81]],
          [[0, 78], [3, 81], [6, 83], [8, 81], [12, 78]], [[2, 74], [4, 78], [6, 81], [8, 78], [12, 74]], [[0, 71], [3, 74], [6, 76], [8, 78], [13, 76]], [[0, 74], [6, 76], [8, 69]]];
        for (let b = 0; b < 8; b++) { const s = b * 16, c = b % 4;
          CH[c].forEach((m, i) => { n('rhodes', s, m, 3, .19, .34 + i * .1, i * .008); n('rhodes', s + 6, m, 2, .14, .34 + i * .1); n('rhodes', s + 11, m, 4, .17, .34 + i * .1, i * .008); });
          n('bass', s, B[c], 3, .5); n('bass', s + 6, B[c], 2, .4); n('bass', s + 8, B[c] + 12, 2, .3); n('bass', s + 11, B[c], 3, .44);
          kick(s, .9); kick(s + 6, .6); kick(s + 10, .75); snare(s + 4, .32); snare(s + 12, .36);
          for (let h = 0; h < 16; h += 2) hat(s + h, h % 4 ? .11 : .07); hat(s + 14, .08, true); if (b % 2) hat(s + 15, .06);
          MEL[b].forEach(([st, m]) => n('pluck', s + st, m, 1, .27, .6));
        } } },
    { id: 'piano', n: 'Piano du soir', e: 'bed', d: 'Un piano seul, lent, avec beaucoup d\'écho et aucune batterie : pour apprendre par cœur au calme.', bpm: 63, lp: 5000, wet: .42, seed: 41,
      make: ({ n }) => {
        const ARP = [[48, 55, 62, 64, 67, 64, 62, 55], [45, 52, 60, 64, 67, 64, 60, 52], [41, 48, 57, 60, 64, 60, 57, 48], [43, 50, 59, 62, 67, 62, 59, 50]];   // Cadd9 Am7 Fmaj7 G
        const PAD = [[60, 64, 67], [60, 64, 67], [57, 60, 65], [59, 62, 67]];
        const MEL = [[[8, 76, 8]], [[4, 72, 4], [8, 76, 8]], [[0, 81, 6], [8, 79, 4], [12, 76, 4]], [[0, 74, 12]], [[4, 79, 4], [8, 76, 8]], [[0, 72, 4], [4, 74, 4], [8, 76, 8]], [[0, 77, 6], [6, 76, 2], [8, 72, 8]], [[0, 71, 8], [8, 74, 8]]];
        for (let b = 0; b < 8; b++) { const s = b * 16, c = b % 4;
          ARP[c].forEach((m, i) => n('piano', s + i * 2, m, 3, i ? .2 : .3, .38 + (m - 41) / 90));
          PAD[c].forEach((m, i) => n('pad', s, m, 15, .045, .2 + i * .3));
          MEL[b].forEach(([st, m, l]) => n('piano', s + st, m, l, .34, .58));
        } } },
    { id: 'combat', n: 'Podo Quest', e: 'flame', d: 'Le thème de l\'aventure : une basse qui galope et une mélodie héroïque, pour combattre les monstres.', bpm: 112, lp: 7000, wet: .14, seed: 53,
      make: ({ n, kick, snare, hat }) => {
        const CH = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62], [57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]], B = [45, 41, 48, 43, 45, 41, 38, 40];   // Am F C G · Am F Dm E
        const MEL = [[[0, 69], [4, 72], [6, 76], [10, 74], [12, 72]], [[0, 69], [4, 72], [8, 77], [12, 76]], [[0, 79], [4, 76], [6, 72], [10, 74], [12, 76]], [[0, 74], [6, 71], [8, 74], [12, 79]],
          [[0, 81], [4, 79], [6, 76], [10, 79], [12, 81]], [[0, 84], [6, 81], [8, 77], [12, 76]], [[0, 74], [4, 77], [6, 81], [10, 77], [12, 74]], [[0, 76], [4, 80], [8, 83], [12, 88]]];
        for (let b = 0; b < 8; b++) { const s = b * 16;
          CH[b].forEach((m, i) => { for (const k of [2, 6, 10, 14]) n('rhodes', s + k, m, 2, .13, .3 + i * .2); n('pad', s, m + 12, 15, .03, .2 + i * .3); });
          for (let k = 0; k < 16; k += 2) n('bass', s + k, B[b] + (k % 8 === 6 ? 12 : 0), 2, k % 4 ? .34 : .46);
          kick(s, .9); kick(s + 8, .85); kick(s + 11, .5); snare(s + 4, .4); snare(s + 12, .44); if (b % 4 === 3) { snare(s + 14, .3); snare(s + 15, .34); }
          for (let h = 0; h < 16; h++) hat(s + h, h % 4 === 2 ? .12 : .05, h === 14);
          MEL[b].forEach(([st, m]) => { n('pluck', s + st, m, 2, .3, .6); n('bell', s + st, m + 12, 1, .05, .4); });
        } } },
  ];
  const api = { LIST, render: (id, SR) => render(LIST.find(t => t.id === id), SR) };
  if (typeof window !== 'undefined') window.MUSIQUE = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
