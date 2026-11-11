// Podo Quest : le jeu d'aventure au tour par tour. Chaque monstre EST une fiche, un repère d'anatomie ou un test clinique :
//   on le reconnaît à ses signes, on l'attaque en répondant à ses questions, on le finit avec son vrai traitement (les gestes du livret).
//   Les objets sont de vrais instruments et soins du livret ; pour en gagner un, il faut savoir à quoi il sert.
// Tout le contenu vient des données du site (quiz.js, cas.js, anat.js, clinique.js) : rien n'est inventé ici, sauf les dessins et les chiffres du jeu.
// app.js fournit ses outils par A ; l'état de la partie est G (A.g()), la progression du héros est S.rpg.
window.AVENTURE = A => {
  const { S, save, esc, md, ico, shuffle, rnd, fx, did, review, top, count, QZ, CAS, mkStep, anatQ, clinQ, qsjClues, qsjOpts } = A;
  const G = () => A.g();
  const R = () => S.rpg = S.rpg || { lvl: 1, xp: 0, items: { hexo: 1 }, seen: {}, runs: 0 };

  // ---------- les objets : nom, emplacement (arme / armure / soin), valeur, à quoi ça sert VRAIMENT (texte du livret), fiche d'origine ----------
  const ITEMS = {
    bistouri: { n: 'Bistouri lame n°15', s: 'arme', v: 3, use: 'Enlever l\'hyperkératose : ablation mécanique au bistouri', f: 'hyperkeratoses' },
    gouge: { n: 'Gouge', s: 'arme', v: 5, use: 'Enlever le nucléus d\'un cor', f: 'hyperkeratoses' },
    cryo: { n: 'Cryothérapie', s: 'arme', v: 7, use: 'Traiter une verrue plantaire par le froid', f: 'verrues' },
    fraise: { n: 'Fraise', s: 'arme', v: 9, use: 'Fraiser la plaque de l\'ongle si nécessaire, après avoir dégagé les sillons', f: 'onychodys' },
    ortho: { n: 'Orthoplastie protectrice', s: 'armure', v: 2, use: 'Protéger une zone d\'hyperkératose : le traitement orthétique', f: 'hyperkeratoses' },
    semelles: { n: 'Orthèses plantaires', s: 'armure', v: 3, use: 'Corriger les appuis et la posture pendant la marche', f: 'cycle-marche' },
    contention: { n: 'Bas de contention classe II-III', s: 'armure', v: 4, use: 'Comprimer les veines : soulager les varices', f: 'varices' },
    chut: { n: 'Chaussures de décharge (CHUT / CHUP)', s: 'armure', v: 5, use: 'Mettre en décharge un mal perforant plantaire', f: 'mpp' },
    hexo: { n: 'Hexomédine transcutanée', s: 'soin', v: 15, use: 'Désinfecter ou tremper l\'orteil avant de percer un hématome sous-unguéal', f: 'hematome' },
    dexeryl: { n: 'Dexeryl', s: 'soin', v: 20, use: 'Hydrater en couche épaisse, plusieurs fois par jour (syndrome main-pied)', f: 'smp' },
    hydro: { n: 'Pansement hydrocolloïde', s: 'soin', v: 26, use: 'Couvrir une phlyctène fermée sans risque de rupture (guérison en 5 jours environ)', f: 'phlyctenes' },
    rice: { n: 'Méthode RICE', s: 'soin', v: 40, use: 'Repos, glace, compression, élévation : les 48 premières heures d\'une entorse', f: 'entorses-cheville' },
  };
  const hpMax = r => 40 + 8 * (r.lvl - 1), atk = r => 10 + 2 * (r.lvl - 1) + (ITEMS[r.arme] ? ITEMS[r.arme].v : 0), def = r => ITEMS[r.armure] ? ITEMS[r.armure].v : 0, xpNext = r => 40 + 30 * r.lvl;
  const soins = r => Object.keys(ITEMS).filter(k => ITEMS[k].s === 'soin' && r.items[k] > 0);

  // ---------- les dessins : un héros, 8 familles de monstres (la couleur change avec le monstre) ----------
  const eyes = (x1, x2, y, r = 7) => [x1, x2].map(x => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + 1.5}" cy="${y + 1}" r="${r * .45}" fill="#222" stroke="none"/>`).join('')
    + `<path d="M${x1 - r - 2} ${y - r - 4}l${r + 6} 5M${x2 + r + 2} ${y - r - 4}l${-r - 6} 5"/>`;
  const SPR = {
    peau: `<path d="M22 88c-10-22 2-58 38-60 34-2 50 32 40 60-4 12-70 14-78 0z" fill="var(--m)"/><circle cx="33" cy="52" r="6" fill="var(--m2)"/><circle cx="90" cy="58" r="5" fill="var(--m2)"/><circle cx="62" cy="36" r="4" fill="var(--m2)"/><circle cx="78" cy="42" r="3" fill="var(--m2)"/>${eyes(48, 74, 64)}<path d="M46 82q15 10 30 0"/><path d="M52 84l3 5 4-4M64 85l3 4 4-5" fill="#fff"/>`,
    ongle: `<path d="M30 56l-15-8 4 12-8 3 17 8M90 56l15-8-4 12 8 3-17 8" fill="var(--m2)"/><path d="M30 40c0-18 60-18 60 0v38c0 18-60 18-60 0z" fill="var(--m)"/><path d="M40 42c6-8 34-8 40 0" stroke-width="2"/><path d="M38 86c8 7 36 7 44 0" stroke-width="2"/>${eyes(50, 70, 58, 6)}<path d="M47 76l5-4 5 4 5-4 5 4 5-4"/><path d="M46 95v11M74 95v11"/>`,
    vasc: `<path d="M24 98c30 8 46-6 36-20s-28-14-18-32 34-18 46-8" stroke-width="21"/><path d="M24 98c30 8 46-6 36-20s-28-14-18-32 34-18 46-8" stroke="var(--m)" stroke-width="15"/><ellipse cx="92" cy="36" rx="18" ry="14" fill="var(--m)"/>${eyes(86, 100, 32, 5)}<path d="M108 42l10 3-5 2 4 5-11-4" fill="#e5484d"/>`,
    med: `<rect x="48" y="12" width="24" height="15" rx="3" fill="var(--m2)"/><path d="M40 27h40v8c10 6 14 14 14 26v32c0 8-6 12-12 12H38c-6 0-12-4-12-12V61c0-12 4-20 14-26z" fill="var(--m)"/><rect x="36" y="76" width="48" height="20" rx="3" fill="#fff"/><path d="M52 86h16M60 80v12" stroke="#e5484d"/>${eyes(48, 72, 54, 6)}<path d="M52 67q8 5 16 0"/>`,
    podo: `<path d="M32 22c16-6 32 0 32 14l-2 30c14 2 40 8 44 22 2 8-2 13-10 13H30c-10 0-14-8-12-18z" fill="var(--m)"/><path d="M76 88v13M86 89v12M96 92v9" stroke-width="2"/>${eyes(38, 56, 44, 6)}<path d="M35 60q11 9 24 0"/><path d="M40 62l3 5 4-4" fill="#fff"/>`,
    os: `<path d="M14 100l92-80M14 20l92 80" stroke-width="10"/><path d="M14 100l92-80M14 20l92 80" stroke="var(--m2)" stroke-width="5"/><path d="M28 54c0-40 64-40 64 0 0 14-6 20-12 24v14H40V78c-6-4-12-10-12-24z" fill="var(--m)"/><path d="M50 92v-8M60 92v-8M70 92v-8" stroke-width="2"/><circle cx="46" cy="56" r="9" fill="#222"/><circle cx="74" cy="56" r="9" fill="#222"/><circle cx="48" cy="54" r="3" fill="#e5484d" stroke="none"/><circle cx="76" cy="54" r="3" fill="#e5484d" stroke="none"/><path d="M57 71l3-6 3 6z" fill="#222"/>`,
    mus: `<path d="M34 72c-18-4-24-22-17-36 3-6 13-5 12 3 0 6 4 10 11 12M86 72c18-4 24-22 17-36-3-6-13-5-12 3 0 6-4 10-11 12" fill="var(--m)"/><path d="M30 98c-6-24 6-42 30-42s36 18 30 42z" fill="var(--m)"/><path d="M21 50c6-4 10 0 10 6M99 50c-6-4-10 0-10 6" stroke-width="2"/><path d="M46 80c8 6 20 6 28 0M48 89c8 4 16 4 24 0" stroke-width="2"/><circle cx="60" cy="42" r="17" fill="var(--m)"/>${eyes(53, 67, 40, 4.5)}<path d="M53 51h14"/>`,
    test: `<path d="M20 40l-8-10M40 28l-4-12M60 24V10M80 28l4-12M100 40l8-10M40 88q-4 12 4 20M60 92v17M80 88q4 12-4 20"/><path d="M12 60c20-34 76-34 96 0-20 34-76 34-96 0z" fill="#fff"/><circle cx="60" cy="60" r="21" fill="var(--m)"/><circle cx="60" cy="60" r="9" fill="#222"/><circle cx="54" cy="54" r="4" fill="#fff" stroke="none"/>`,
  };
  const EXTRA = {
    peau: '<path d="M30 92q4 12 8 0M80 93q4 12 8 0" fill="var(--m)"/><path d="M33 44q6-11 17-13" stroke="#fff" stroke-width="3"/><circle cx="44" cy="92" r="3" fill="var(--m2)"/>',
    ongle: '<path d="M36 30l4-13 6 10 6-13 6 13 6-13 6 13 6-10 4 13" fill="var(--m2)"/>',
    vasc: '<path d="M100 44v7M106 44v6" stroke="#fff" stroke-width="3"/><path d="M30 92l6 8M44 96l4 8M56 84l8 4" stroke="var(--m2)" stroke-width="3"/>',
    med: '<path d="M28 66l-13-7M92 66l13-7" stroke-width="6"/><circle cx="12" cy="57" r="6" fill="var(--m)"/><circle cx="108" cy="57" r="6" fill="var(--m)"/>',
    podo: '<path d="M104 92l10 3M100 100l8 6" stroke-width="4"/><path d="M34 30h30M33 36h31" stroke="var(--m2)" stroke-width="3"/>',
    os: '<path d="M60 16l-5 9 7 4-4 9" stroke-width="2"/>',
    mus: '<path d="M43 33h34" stroke="#e5484d" stroke-width="6"/><path d="M77 33l10-4-2 8" fill="#e5484d"/>',
    test: '<path d="M12 60L2 44l5 17-7 4 13 3M108 60l10-16-5 17 7 4-13 3" fill="var(--m2)"/>',
  };
  const CROWN = '<path d="M38 22l-3-18 12 10 13-14 13 14 12-10-3 18z" fill="#f6d84a"/>';
  const fam = it => it.kind === 'f' ? (it.f.sec === 'podo' ? 'podo' : SPR[it.f.cat] ? it.f.cat : 'peau') : it.kind === 'a' ? (it.x.nerf ? 'mus' : 'os') : 'test';
  const hue = id => { let h = 7; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  // Le rendu pixel art : chaque dessin vectoriel est redessiné en 48×48 pixels nets, avec un contour sombre, la lumière en haut à gauche et l'ombre en bas à droite.
  const PX = {}, BUSY = {}, BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', N = 56;
  function pixify(key, inner) {
    if (PX[key]) return PX[key]; if (BUSY[key]) return BLANK; BUSY[key] = 1;
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'); x.drawImage(im, 0, 0, N, N);
      const d = x.getImageData(0, 0, N, N), p = d.data, solid = new Uint8Array(N * N); for (let i = 0; i < N * N; i++) solid[i] = p[i * 4 + 3] > 120 ? 1 : 0;
      const at = (X, Y) => X >= 0 && Y >= 0 && X < N && Y < N && solid[Y * N + X];
      for (let Y = 0; Y < N; Y++) for (let X = 0; X < N; X++) { const i = (Y * N + X) * 4;
        if (solid[Y * N + X]) { const vol = 1.12 - .28 * Y / N - .1 * X / N + ((X + Y) % 2 ? .035 : -.035), k = vol * (!at(X + 1, Y + 1) || !at(X, Y + 2) ? .72 : !at(X - 1, Y - 1) || !at(X, Y - 2) ? 1.18 : 1); for (let q = 0; q < 3; q++) p[i + q] = Math.min(255, Math.round(p[i + q] * k / 24) * 24); p[i + 3] = 255; }
        else if (at(X - 1, Y) || at(X + 1, Y) || at(X, Y - 1) || at(X, Y + 1)) { p[i] = 22; p[i + 1] = 14; p[i + 2] = 34; p[i + 3] = 255; } else p[i + 3] = 0; }
      x.putImageData(d, 0, 0); PX[key] = c.toDataURL(); if (G() && G().game === 'aventure') A.render(true);
    };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="none" stroke="#1a1423" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">${inner}</svg>`);
    return BLANK;
  }
  const img = (key, inner, cls) => `<img class="avspr ${cls}" alt="" src="${pixify(key, inner)}">`;
  const sprite = (it, cls = '', boss) => { const h = hue(it.id); return img(it.id + (boss ? 'B2' : '2'), (SPR[fam(it)] + EXTRA[fam(it)] + (boss ? CROWN : '')).replace(/var\(--m2\)/g, `hsl(${(h + 40) % 360},55%,42%)`).replace(/var\(--m\)/g, `hsl(${h},72%,60%)`), cls); };
  const HERO = (cls = '') => img('hero3', `<path d="M50 94v18M70 94v18" stroke-width="9"/><path d="M50 94v17M70 94v17" stroke="#2c3e6b" stroke-width="5"/><path d="M41 114h15M64 114h15" stroke="#3b2a20" stroke-width="7"/><path d="M38 68l-13 14M82 68l14-12" stroke-width="8"/><path d="M38 68l-12 13M82 68l13-11" stroke="#ffffff" stroke-width="4"/><path d="M94 58l14-27 6 3-13 27z" fill="#e6eef8"/><path d="M37 98V64c0-9 8-14 23-14s23 5 23 14v34z" fill="#ffffff"/><path d="M60 52v46" stroke-width="2"/><path d="M51 52c-4 12 2 19 9 19s13-7 9-19" stroke="#2f9be0" stroke-width="3"/><circle cx="60" cy="73" r="3.5" fill="#2f9be0"/><circle cx="60" cy="31" r="19" fill="#f1c9a5"/><path d="M41 32c-2-17 9-25 21-25s21 8 17 23c-5-7-14-10-22-10-6 0-12 4-16 12z" fill="#3b2a20"/><circle cx="53" cy="35" r="2.6" fill="#222" stroke="none"/><circle cx="68" cy="35" r="2.6" fill="#222" stroke="none"/><path d="M55 43q6 4 12 0" stroke-width="2"/>`, 'avhero ' + cls);
  const CHEST = cls => img('chest', '<path d="M16 54c0-22 88-22 88 0v10H16z" fill="#c98a3c"/><rect x="16" y="64" width="88" height="40" rx="4" fill="#9a5f24"/><path d="M16 78h88M34 64v40M86 64v40" stroke-width="3"/><rect x="51" y="56" width="18" height="22" rx="3" fill="#f6d84a"/>', cls);

  // Les décors, peints pixel par pixel (160×100) : un par biome, plus l'arène néon des boss. Calculés une fois, gardés en mémoire.
  const PAL = {
    foret: { sky: ['#3b4f8a', '#6a6fb0', '#c9799a', '#f0a070', '#f8cf8a'], sun: '#fff1b8', cloud: '#f6b48f', far: '#8d7bbd', mid: '#5b5a9a', leaf: ['#14503f', '#1f7a5c', '#39a877'], trunk: '#5a3220', ground: ['#2f8a55', '#1f6a43', '#164d33'], dot: '#f472b6' },
    marais: { sky: ['#12263a', '#1d4350', '#2f6f6a', '#6fae8d', '#cfe8a8'], sun: '#eaffc2', cloud: '#4d8c80', far: '#2a5560', mid: '#1d3f47', leaf: ['#0f3a34', '#1b5a4a', '#2f8a66'], trunk: '#2b241c', ground: ['#35605a', '#254a48', '#183636'], dot: '#9ef0c0' },
    canyon: { sky: ['#3a2a5c', '#7a3e73', '#d6604d', '#f4a261', '#ffd98a'], sun: '#fff6cf', cloud: '#f7b27a', far: '#b5543c', mid: '#8a3b2e', leaf: ['#3d5a2a', '#56803a', '#7fae4d'], trunk: '#6b3e26', ground: ['#d9a05b', '#b97f43', '#8f5f32'], dot: '#fff1b8' },
    grotte: { sky: ['#0b0a1f', '#141235', '#1f1b4d', '#2a2566', '#3a3080'], sun: '#9fd8ff', cloud: '#2a2566', far: '#1a1740', mid: '#120f2e', leaf: ['#3aa0d8', '#7fd6ff', '#c9f1ff'], trunk: '#2a2452', ground: ['#2d2a5a', '#211e46', '#161432'], dot: '#7fd6ff' },
  };
  const BIOME = { peau: 'foret', ongle: 'foret', vasc: 'marais', med: 'marais', podo: 'canyon', os: 'grotte', mus: 'grotte', test: 'grotte' }, SC = {};
  function scene(kind) {
    if (SC[kind]) return SC[kind];
    const W = 160, H = 100, GY = kind === 'boss' ? 68 : 72, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    let seed = kind.charCodeAt(0) * 7919 + kind.length * 131; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
    const px = (X, Y, col, w = 1, h = 1) => { x.fillStyle = col; x.fillRect(Math.round(X), Math.round(Y), Math.round(w), Math.round(h)); };
    const disc = (cx, cy, r, col) => { for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); px(cx - w, cy + y, col, 2 * w + 1, 1); } };
    const bands = sky => { for (let y = 0; y < GY; y++) { const f = y / GY * sky.length, i = Math.min(sky.length - 1, f | 0), edge = f - i > .75 && i < sky.length - 1; for (let X = 0; X < W; X++) px(X, y, edge && (X + y) % 2 ? sky[i + 1] : sky[i]); } };   // dégradé en bandes tramées
    const ridge = (base, amp, fr, col, hi) => { let prev = 0; for (let X = 0; X < W; X++) { const h = Math.round(base - amp * (.6 * Math.abs(Math.sin(X * fr + seed % 7)) + .4 * Math.abs(Math.sin(X * fr * 2.7 + 1)))); px(X, h, col, 1, GY - h); if (hi && h < prev) px(X, h, hi, 1, 2); prev = h; } };
    if (kind === 'boss') {
      bands(['#12002b', '#2a0845', '#5a0f6e', '#a31a86', '#ff4d9d']);
      for (let k = 0; k < 46; k++) px(rnd() * W, rnd() * 40, k % 5 ? '#d9c7ff' : '#fff');
      for (let y = -24; y <= 24; y++) { if (y > 2 && y % 5 < 2) continue; const w = Math.round(Math.sqrt(576 - y * y)); px(80 - w, 44 + y, y < -6 ? '#ffe45e' : y < 8 ? '#ff9e3d' : '#ff4d6d', 2 * w + 1, 1); }   // le soleil rayé
      ridge(66, 16, .09, '#0a0518'); px(0, GY, '#0a0518', W, H - GY); px(0, GY, '#ff3df0', W, 1);
      for (let k = 1; k < 8; k++) px(0, GY + k * k * .55, '#b517c9', W, 1);
      for (let v = -9; v <= 9; v++) for (let y = GY + 1; y < H; y++) { const X = 80 + v * (y - GY) * .62; if (X >= 0 && X < W) px(X, y, '#b517c9'); }
    } else {
      const P = PAL[kind]; bands(P.sky); disc(120, 24, 10, P.sun);
      for (let k = 0; k < 5; k++) { const cx = rnd() * W - 10, cy = 8 + rnd() * 28, w = 16 + rnd() * 14; px(cx, cy, P.cloud, w, 2); px(cx + 3, cy - 2, P.cloud, w - 7, 2); px(cx + 7, cy - 4, P.cloud, w - 14, 2); }
      ridge(58, 34, .035, P.far, P.cloud); ridge(66, 16, .06, P.mid);
      const tree = (X, h, r) => { px(X - 1, GY - h, P.trunk, 3, h); px(X + 1, GY - h, '#00000033', 1, h); disc(X, GY - h, r, P.leaf[0]); disc(X - 2, GY - h - 2, r - 3, P.leaf[1]); disc(X - 4, GY - h - 4, Math.max(1, r - 7), P.leaf[2]); };
      const spike = (X, h) => { for (let y = 0; y < h; y++) { const w = 1 + (y / 3 | 0); px(X - w / 2, GY - h + y, (X + y) % 4 < 2 ? P.leaf[1] : P.leaf[0], w, 1); } px(X, GY - h, P.leaf[2], 1, h * .6); };
      const cactus = X => { px(X, GY - 16, P.leaf[1], 3, 16); px(X - 4, GY - 11, P.leaf[1], 2, 6); px(X - 4, GY - 6, P.leaf[1], 5, 2); px(X + 5, GY - 13, P.leaf[1], 2, 6); px(X + 3, GY - 8, P.leaf[1], 4, 2); px(X, GY - 16, P.leaf[2], 1, 16); };
      if (kind === 'grotte') { for (let k = 0; k < 9; k++) px(rnd() * W, 0, P.far, 3, 4 + rnd() * 14); [10, 26, 134, 150, 96].forEach((X, i) => spike(X, 12 + (i * 7) % 16)); }
      else if (kind === 'canyon') { cactus(16); cactus(146); cactus(98); }
      else { tree(96, 12, 6); tree(150, 30, 12); tree(12, 42, 17); }
      for (let y = GY; y < H; y++) px(0, y, P.ground[Math.min(2, (y - GY) / 9 | 0)], W, 1);
      for (let k = 0; k < 110; k++) { const X = rnd() * W, y = GY + rnd() * (H - GY - 2); px(X, y, P.ground[k % 3 ? 0 : 2], 1, 2); px(X + 1, y + 1, P.ground[0]); }
      for (let k = 0; k < 14; k++) px(rnd() * W, GY + 4 + rnd() * 22, P.dot);
    }
    return SC[kind] = c.toDataURL();
  }

  // ---------- ce qu'un monstre fait réviser : ses questions (attaque), ses récitations (spécial), son coup de grâce (les gestes du livret) ----------
  const flat = st => st.kind === 'list' ? { kind: 'ticks', q: st.q, items: st.items } : st;
  function kit(it) {
    if (it.kind === 'f') {
      const f = it.f, Z = QZ[f.id] || [], c = CAS[f.id], m = f.memo && f.memo[5];
      return { qs: Z.flatMap((z, i) => z.q.map(s => () => flat(mkStep(i + 1, s)))),
        says: f.parts.map((p, i) => Z[i] && Z[i].k.length ? { kind: 'ticks', q: p.q, sub: p.title, items: Z[i].k } : null).filter(Boolean),
        fin: c ? { kind: 'pick', q: 'Coup de grâce : quels sont les bons gestes ?', items: c.tt } : null, weak: m ? [m.q, m.k] : null };
    }
    if (it.kind === 'a') {
      const x = it.x, id = [['Origine', x.o], ['Terminaison', x.t], ['Nerf', x.nerf], ['Action', x.act]].filter(a => a[1]).map(a => `**${a[0]}** : ${a[1]}`);
      return { qs: [() => Object.assign({ kind: 'qcm' }, anatQ(x))], weak: x.nerf ? ['Son nerf', x.nerf] : ['On le trouve', String(x.how).split('\n')[0]],
        says: [x.nerf ? { kind: 'ticks', q: `Fiche d'identité : ${x.name}`, sub: 'origine, terminaison, nerf, action', items: id } : { kind: 'ticks', q: `Comment tu trouves : ${x.name} ?`, sub: 'palpation', items: [x.pos, x.how, x.chk].filter(Boolean).map(s => String(s).split('\n')[0]) }] };
    }
    const c = it.cl;
    return { qs: [() => Object.assign({ kind: 'qcm' }, clinQ(c))], says: [{ kind: 'ticks', q: `Les étapes du test : ${c.n}`, sub: 'le geste', items: c.steps }], weak: ['Il cherche', c.cherche] };
  }
  const nextQ = k => { if (!k.deck || !k.deck.length) k.deck = shuffle(k.qs); return k.deck.pop()(); };

  // ---------- l'expédition : 5 étapes (2 combats, un coffre, un combat, le boss). Les monstres les moins vus passent d'abord. ----------
  function start(pool) {
    const r = R(), order = shuffle(pool).sort((a, b) => (r.seen[a.id] || 0) - (r.seen[b.id] || 0));
    const boss = order.find(x => x.kind === 'f') || order[0], foes = order.filter(x => x !== boss).slice(0, 3);
    while (foes.length < 3) foes.push(rnd(pool));
    return { game: 'aventure', scr: 'map', i: 0, hp: hpMax(r), focus: 0, combo: 0, kills: [], gain: 0,
      nodes: [{ t: 'foe', it: foes[0] }, { t: 'foe', it: foes[1] }, { t: 'chest' }, { t: 'foe', it: foes[2] }, { t: 'boss', it: boss }] };
  }
  function enter() {
    const g = G(), r = R(), n = g.nodes[g.i];
    if (n.t === 'chest') return chest();
    const boss = n.t === 'boss', it = n.it, small = it.kind === 'a' && !it.x.nerf, max = Math.round((26 + 7 * r.lvl + 4 * g.i) * (boss ? 2.4 : small ? .6 : 1));
    Object.assign(g, { scr: 'fight', anim: {}, msg: boss ? 'Le boss te barre la route. Qui est-ce ?' : 'Un monstre surgit ! Qui est-ce ?',
      foe: { it, boss, max, hp: max, was: max, atk: Math.round((5 + 1.2 * r.lvl + .5 * g.i) * (boss ? 1.3 : 1)), kit: kit(it), miss: 0, si: 0 },
      t: { mode: 'id', st: { kind: 'qcm', clues: qsjClues(it).slice(0, 2), opts: qsjOpts(it), ok: it.title } } });
    fx(boss ? 'boss' : 'start');
  }
  function chest(last) {
    const g = G(), r = R(), keys = Object.keys(ITEMS), fresh = keys.filter(k => ITEMS[k].s !== 'soin' && !r.items[k]);
    const k = fresh.length && (last || Math.random() < .6) ? rnd(fresh) : rnd(keys.filter(x => ITEMS[x].s === 'soin')), it = ITEMS[k];
    Object.assign(g, { scr: 'chest', last, t: { item: k, st: { kind: 'qcm', q: `À quoi sert : **${it.n}** ?`, ok: it.use, opts: shuffle([it.use, ...shuffle(keys.filter(x => x !== k && ITEMS[x].use !== it.use)).slice(0, 3).map(x => ITEMS[x].use)]) } } });
    fx('reveal');
  }

  // ---------- les coups ----------
  function hitFoe(d, crit) { const g = G(), f = g.foe; d = Math.max(1, Math.round(d)); f.was = f.hp; f.hp = Math.max(0, f.hp - d); Object.assign(g.anim, { foe: 1, dF: d, crit }); fx(crit ? 'crit' : 'hit'); }
  function hitMe() { const g = G(), d = Math.max(2, g.foe.atk - def(R())); g.was = g.hp; g.hp = Math.max(0, g.hp - d); g.combo = 0; g.foe.miss++; Object.assign(g.anim, { me: 1, dM: d }); setTimeout(() => fx('hurt'), g.anim.foe ? 280 : 0); }
  function resolve(v) {   // v : la note de la réponse, de 0 à 1
    const g = G(), r = R(), t = g.t, f = g.foe, a = atk(r), name = f.it.title;
    t.done = true; g.anim = {}; f.was = f.hp; g.was = g.hp; did(1);
    if (t.mode === 'id') {
      if (v) { g.focus = Math.min(3, g.focus + 1); hitFoe(a * .8); g.msg = `Reconnu : ${name} ! Tu frappes en premier.`; } else { hitMe(); g.msg = `C'était : ${name}. Il frappe en premier.`; }
    } else if (t.mode === 'atk') {
      if (v >= .6) { g.combo++; g.focus = Math.min(3, g.focus + 1); const crit = g.combo >= 3; hitFoe(a * (.6 + .4 * v) * (1 + .15 * (g.combo - 1)), crit); g.msg = crit ? `Série de ${g.combo} : coup critique !` : 'Touché !'; }
      else { hitMe(); g.msg = `Raté : ${name} riposte.`; }
    } else if (t.mode === 'spe') {
      if (v > 0) hitFoe(a * 3 * v, v >= .8); if (v < .5) hitMe();
      g.msg = v >= .8 ? 'Récitation parfaite : dégâts énormes !' : v >= .5 ? 'Récitation correcte : gros dégâts.' : 'Trop de trous dans la récitation : il en profite.';
    } else if (v >= .99) { hitFoe(f.hp, true); g.msg = 'Coup de grâce : le bon traitement !'; }
    else { if (v > 0) hitFoe(a * v); hitMe(); g.msg = 'Pas le bon traitement : il résiste et riposte.'; }
  }
  function addXp(n) { const g = G(), r = R(); r.xp += n; g.gain += n; while (r.xp >= xpNext(r)) { r.xp -= xpNext(r); r.lvl++; g.up = true; g.hp = hpMax(r); } save(); }
  function after() {   // après un coup : victoire, K.O., ou retour au menu
    const g = G(), r = R(), f = g.foe;
    if (f.hp <= 0) {
      r.seen[f.it.id] = (r.seen[f.it.id] || 0) + 1; g.up = false; addXp((f.boss ? 45 : 18) + (f.miss ? 0 : 8));
      if (f.it.kind !== 'c') review(f.it.id, f.miss <= 1);   // fiche ou repère : il entre dans les révisions espacées
      g.kills.push(f.it); g.scr = 'win'; g.hp = Math.min(hpMax(r), g.hp + Math.round(hpMax(r) * .3));   // on souffle : +30 % de PV
      setTimeout(() => fx(g.up ? 'lvl' : 'win'), 200);
    } else if (g.hp <= 0) { g.scr = 'ko'; save(); fx('over'); }
    else { g.t = null; g.anim = {}; g.msg = 'À toi de jouer.'; }
  }
  const tog = (t, j) => { t.ticks = t.ticks || []; t.ticks = t.ticks.includes(j) ? t.ticks.filter(x => x !== j) : t.ticks.concat(j); };

  function act(a, j, el) {
    const g = G(), r = R(), t = g.t, st = t && t.st, soft = () => A.render(true), hard = () => A.render();
    if (a === 'avhub') { A.setG({ game: 'aventure', scr: 'hub' }); fx('tap'); return hard(); }
    if (a === 'avbest') { g.scr = g.scr === 'best' ? 'hub' : 'best'; fx('tap'); return hard(); }
    if (a === 'aveq') { const k = el.dataset.k, s = ITEMS[k].s; r[s] = r[s] === k ? null : k; save(); fx('tick'); return soft(); }
    if (a === 'avmus') { const M = window.SONS; if (M && M.play) { M.playing() === 'combat' ? M.stop() : M.play('combat'); } return soft(); }
    if (a === 'avgo') { enter(); return hard(); }
    if (g.scr === 'chest') {
      if (a === 'avpick' && !t.done) { t.pick = j; t.done = true; t.won = st.opts[j] === st.ok; did(1);
        if (t.won) { const k = t.item, it = ITEMS[k]; r.items[k] = (r.items[k] || 0) + 1; if (it.s !== 'soin' && (!r[it.s] || ITEMS[r[it.s]].v < it.v)) r[it.s] = k; save(); fx('loot'); } else fx('bad');
        return soft(); }
      if (a === 'avnext') { if (g.last) { g.scr = 'end'; r.runs++; addXp(30); fx('record'); } else { g.i++; g.scr = 'map'; fx('tap'); } return hard(); }
      return;
    }
    if (a === 'avcont') { if (g.foe.boss) chest(true); else { g.i++; g.scr = 'map'; fx('tap'); } return hard(); }
    if (g.scr !== 'fight') return;
    const f = g.foe;
    if (a === 'avnext') { after(); return hard(); }
    if (a === 'avatk') { g.t = { mode: 'atk', st: nextQ(f.kit) }; g.anim = {}; fx('tap'); return soft(); }
    if (a === 'avspe') { if (!f.boss) g.focus -= 2; g.t = { mode: 'spe', st: Object.assign({}, f.kit.says[f.si++ % f.kit.says.length]) }; g.anim = {}; fx('tap'); return soft(); }
    if (a === 'avfin') { g.t = { mode: 'fin', st: f.kit.fin ? Object.assign({}, f.kit.fin, { items: shuffle(f.kit.fin.items) }) : nextQ(f.kit) }; g.anim = {}; fx('tap'); return soft(); }
    if (a === 'avobj') { g.t = t && t.mode === 'obj' ? null : { mode: 'obj' }; g.anim = {}; fx('tap'); return soft(); }
    if (a === 'avuse') { const k = el.dataset.k; r.items[k]--; g.was = g.hp; g.hp = Math.min(hpMax(r), g.hp + ITEMS[k].v); g.t = null; g.anim = { heal: g.hp - g.was }; g.msg = `${ITEMS[k].n} : +${g.hp - g.was} PV. Dans la vraie vie : ${ITEMS[k].use.toLowerCase()}.`; save(); fx('good'); return soft(); }
    if (!st || t.done) return;
    if (a === 'avpick') { t.pick = j; resolve(st.opts[j] === st.ok ? 1 : 0); return soft(); }
    if (a === 'avshow') { t.shown = true; fx('reveal'); return soft(); }
    if (a === 'avyes' || a === 'avno') { resolve(a === 'avyes' ? 1 : 0); return soft(); }
    if (a === 'avtk') { tog(t, j); fx('tick'); return soft(); }
    if (a === 'avval') { const k = t.ticks || [], good = st.items.filter(x => x[1]).length;
      resolve(st.kind === 'pick' ? Math.max(0, k.reduce((s, i) => s + (st.items[i][1] ? 1 : -1), 0)) / good : k.length / st.items.length); return soft(); }
  }

  // ---------- l'affichage ----------
  const bar = (now, was, max, cls = '') => `<div class="avhp ${cls}"><i style="--f:${100 * was / max}%;--t:${100 * now / max}%"></i></div>`;
  const btn = (g, txt, c = 'var(--hl)', more = '') => `<button class="btn grow" data-g="${g}" style="--c:${c}" ${more}>${txt}</button>`;
  const head = (right, bg) => `<div class="wrap qz av" style="--bg:url(${scene(bg || 'grotte')})">${top('#/', 'Podo Quest', right || '')}`;
  const stats = r => `<span class="avstat">${ico('flame')} Attaque ${atk(r)}</span><span class="avstat">Défense ${def(r)}</span>`;
  function qcard(t) {   // la question en cours, selon son type : choix, carte à retourner, liste à cocher, gestes à choisir
    const st = t.st, k = t.ticks || [], say = txt => `<div class="say-it">${ico('speak')} ${txt}</div>`;
    const opts = () => `<div class="opts">${st.opts.map((o, j) => `<button class="opt ${t.done ? (o === st.ok ? 'good' : j === t.pick ? 'bad' : 'dim') : ''}" data-g="avpick" data-j="${j}" ${t.done ? 'disabled' : ''}>${md(o)}</button>`).join('')}</div>`;
    const checks = pick => `<div class="checks">${st.items.map((x, j) => `<button class="ck ${k.includes(j) ? 'on' : ''} ${pick && t.done ? (x[1] ? 'yes' : 'no') : ''}" data-g="avtk" data-j="${j}" ${t.done ? 'disabled' : ''}><span class="box"></span><span>${md(pick ? x[0] : x)}</span></button>`).join('')}</div>`;
    if (st.clues) return `<div class="avclues">${st.clues.map(c => `<div><b>${esc(c[0])}</b> ${md(c[1])}</div>`).join('')}</div>${opts()}`;
    if (st.kind === 'qcm') return `<div class="question">${md(st.q)}</div>${opts()}`;
    if (st.kind === 'flip') return `<div class="question">${md(st.q)}</div>${t.shown ? `<div class="answer">${md(st.a)}</div>${t.done ? '' : `<div class="row2" style="margin-top:10px">${btn('avno', '✗ Pas su', '#f6c3b9')}${btn('avyes', '✓ Je savais', 'var(--p6)')}</div>`}` : `${say('Réponds à voix haute')}${btn('avshow', 'Voir la réponse')}`}`;
    if (st.kind === 'pick') return `<div class="question">${esc(st.q)}</div>${checks(true)}${t.done ? '' : btn('avval', `Frapper · ${k.length} coché${k.length > 1 ? 's' : ''}`, 'var(--p6)')}`;
    return `<div class="kicker">${esc(st.sub || '').toUpperCase()}</div><div class="question">${md(st.q)}</div>${t.shown ? `<div class="muted small">Coche ce que tu as dit (sois honnête) :</div>${checks()}${t.done ? '' : btn('avval', `Frapper · ${k.length}/${st.items.length}`, 'var(--p6)')}` : `${say(`Dis-le à voix haute : ${st.items.length} idées.`)}${btn('avshow', 'J\'ai récité → voir')}`}`;
  }
  function fight() {
    const g = G(), r = R(), f = g.foe, t = g.t, an = g.anim || {}, idp = t && t.mode === 'id' && !t.done, p = f.hp / f.max, max = hpMax(r);
    const kind = f.boss ? 'boss' : BIOME[fam(f.it)];
    const arena = `<div class="avscene ${kind} ${an.crit ? 'flash' : ''}" style="background-image:url(${scene(kind)})">
      <div class="avplate"><b>Toi · Nv ${r.lvl}</b>${bar(g.hp, g.was == null ? g.hp : g.was, max, 'me')}<span>${g.hp}/${max} PV ${[0, 1, 2].map(i => `<i class="avpip ${i < g.focus ? 'on' : ''}"></i>`).join('')}${g.combo > 1 ? ` ×${g.combo}` : ''}</span></div>
      <div class="avplate foe"><b>${idp ? '???' : esc(f.it.title)}</b>${bar(f.hp, f.was, f.max)}<span>${f.boss ? 'BOSS · ' : ''}${esc(f.it.lab)}</span></div>
      <div class="avpos me">${HERO(an.foe ? 'lunge' : an.me ? 'hurt' : 'idle')}${an.dM ? `<span class="avdmg me">-${an.dM}</span>` : an.heal ? `<span class="avdmg heal">+${an.heal}</span>` : ''}</div>
      <div class="avpos foe">${sprite(f.it, (idp ? 'sil ' : '') + (an.foe ? 'hit' : 'idle'), f.boss)}${an.dF ? `<span class="avdmg ${an.crit ? 'crit' : ''}">-${an.dF}</span>` : ''}</div></div>
      <div class="avbox">${esc(g.msg || '')}</div>`;
    let body;
    if (t && t.mode === 'obj') body = `<div class="card qc"><div class="kicker">TES SOINS</div><div class="avlist">${soins(r).map(k => `<button class="ptitem" data-g="avuse" data-k="${k}"><b>${esc(ITEMS[k].n)}</b> ×${r.items[k]} · +${ITEMS[k].v} PV<br><span class="muted">${esc(ITEMS[k].use)}</span></button>`).join('')}</div><button class="btn ghost wide" data-g="avobj" style="margin-top:10px">Retour</button></div>`;
    else if (t) body = `<div class="card qc">${t.mode === 'id' ? '' : `<div class="kicker">${t.mode === 'atk' ? 'ATTAQUE' : t.mode === 'spe' ? 'RÉCITATION · DÉGÂTS ×3' : 'COUP DE GRÂCE'}</div>`}${qcard(t)}</div>${t.done ? `<div class="pager fixed">${btn('avnext', f.hp <= 0 ? 'Victoire →' : g.hp <= 0 ? 'Aïe…' : 'Suite →')}</div>` : ''}`;
    else {   // le menu : face au boss, c'est lui qui impose le style (3 phases) ; sinon on choisit
      const spe = f.kit.says.length, m = [];
      if (f.boss) m.push(p > .66 ? ['avatk', 'Attaque', 'Phase 1 : brise sa garde avec les questions', 'var(--hl)'] : p > .33 || !spe ? ['avspe', 'Récitation', 'Phase 2 : seule une partie récitée perce son armure', 'var(--p3)'] : ['avfin', 'Coup de grâce', 'Phase 3 : trouve le bon traitement', 'var(--red)']);
      else { m.push(['avatk', 'Attaque', 'Une question sur lui', 'var(--hl)']);
        m.push(['avspe', 'Récitation', g.focus >= 2 && spe ? 'Dégâts ×3 · coûte 2 de concentration' : 'Il faut 2 de concentration (2 bonnes réponses)', 'var(--p3)', g.focus < 2 || !spe]);
        m.push(['avfin', 'Coup de grâce', p <= .35 ? 'Le bon traitement le termine d\'un coup' : 'Quand il est sous 35 % de PV', 'var(--red)', p > .35]); }
      m.push(['avobj', 'Soins', soins(r).length ? `${soins(r).reduce((s, k) => s + r.items[k], 0)} dans le sac` : 'Sac vide', 'var(--p6)', !soins(r).length]);
      body = `<div class="avmenu">${m.map(([a, n, d, c, off]) => `<button class="avact" data-g="${a}" style="--c:${c}" ${off ? 'disabled' : ''}><b>${n}</b><span>${d}</span></button>`).join('')}</div>`;
    }
    return `${head(count(`Étape ${g.i + 1}`, g.nodes.length), kind)}${arena}${body}</div>`;
  }
  const NODE = { foe: '<path d="M-6 6L6-6M1-6h5v5M-7 3l4 4"/>', chest: '<rect x="-7" y="-5" width="14" height="10" rx="2"/><path d="M-7-1h14M0-2v3"/>', boss: '<path d="M-8 5l-1-10 5 5 4-7 4 7 5-5-1 10z"/>' };
  const PTS = [[32, 112], [96, 58], [160, 108], [224, 52], [288, 96]];
  function map() {
    const g = G(), r = R(), n = g.nodes[g.i], max = hpMax(r);
    return `${head(count(`Étape ${g.i + 1}`, g.nodes.length))}
      <div class="card avmap" style="background-image:linear-gradient(rgba(14,13,19,.25),rgba(14,13,19,.9)),url(${scene(n.t === 'boss' ? 'boss' : n.it ? BIOME[fam(n.it)] : 'foret')})"><svg viewBox="0 0 320 150" fill="none" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M${PTS.map(p => p.join(' ')).join(' L')}" stroke-dasharray="2 9" stroke-width="4" opacity=".5"/>
        ${g.nodes.map((x, i) => `<g transform="translate(${PTS[i]})" class="avnode ${i < g.i ? 'done' : i === g.i ? 'now' : ''}"><circle r="17" fill="${i < g.i ? 'var(--p6)' : x.t === 'boss' ? 'var(--red)' : x.t === 'chest' ? 'var(--hl)' : 'var(--card)'}"/>${i < g.i ? '<path d="M-7 0l5 5 9-10"/>' : NODE[x.t]}</g>`).join('')}
      </svg><div class="avhud"><b>Toi · Nv ${r.lvl}</b>${bar(g.hp, g.hp, max, 'me')}<span class="muted">${g.hp}/${max} PV</span></div></div>
      <div class="card qc"><div class="kicker">${n.t === 'chest' ? 'UN COFFRE' : n.t === 'boss' ? 'LE BOSS' : 'UN MONSTRE'}</div>
        <div class="question">${n.t === 'chest' ? 'Un coffre au bord du chemin.' : n.t === 'boss' ? 'Une ombre énorme garde la sortie.' : 'Quelque chose bouge devant toi…'}</div>
        <div class="muted small">${n.t === 'chest' ? 'Pour garder l\'objet, il faut savoir à quoi il sert.' : n.t === 'boss' ? 'Trois phases : les questions, la récitation, puis le bon traitement.' : 'Reconnais-le à ses signes pour frapper le premier.'}</div></div>
      <div class="pager fixed">${btn('avgo', n.t === 'chest' ? 'Ouvrir le coffre →' : 'Avancer →')}</div></div>`;
  }
  function hub() {
    const r = R(), gear = Object.keys(ITEMS).filter(k => ITEMS[k].s !== 'soin' && r.items[k]), heal = soins(r), M = window.SONS, n = A.pool().length, seen = Object.keys(r.seen).length;
    return `${head(`<span class="count">Nv ${r.lvl}</span>`)}
      <div class="card avcamp" style="background-image:linear-gradient(90deg,rgba(14,13,19,.2),rgba(14,13,19,.92) 62%),url(${scene('foret')})">${HERO('idle')}<div class="avhud"><div class="kicker">TON PODOLOGUE · ${r.runs} EXPÉDITION${r.runs > 1 ? 'S' : ''}</div><b>Niveau ${r.lvl}</b>${bar(r.xp, r.xp, xpNext(r), 'xp')}<span class="muted">${r.xp}/${xpNext(r)} XP · ${hpMax(r)} PV</span><div>${stats(r)}</div></div></div>
      <div class="muted small">Chaque monstre est une fiche, un repère ou un test. Reconnais-le, réponds pour l'attaquer, récite pour frapper fort, et finis-le avec son vrai traitement.</div>
      ${gear.length ? `<div class="sec">TON ÉQUIPEMENT (TOUCHE POUR ÉQUIPER)</div><div class="avlist">${gear.map(k => { const it = ITEMS[k], on = r[it.s] === k; return `<button class="ptitem ${on ? 'good' : ''}" data-g="aveq" data-k="${k}"><b>${esc(it.n)}</b> · ${it.s === 'arme' ? 'attaque' : 'défense'} +${it.v}${on ? ' · équipé' : ''}<br><span class="muted">${esc(it.use)}</span></button>`; }).join('')}</div>` : ''}
      ${heal.length ? `<div class="sec">TES SOINS</div><div class="avlist">${heal.map(k => `<div class="ptitem"><b>${esc(ITEMS[k].n)}</b> ×${r.items[k]} · +${ITEMS[k].v} PV<br><span class="muted">${esc(ITEMS[k].use)}</span></div>`).join('')}</div>` : ''}
      <div class="row2" style="margin-top:14px"><button class="btn ghost grow" data-g="setup">Ce que je révise (${n})</button><button class="btn ghost grow" data-g="avbest">Bestiaire (${seen})</button></div>
      ${M && M.play ? `<button class="btn ghost wide" data-g="avmus" style="margin-top:10px">${ico('phones')} ${M.playing() === 'combat' ? 'Couper la musique' : 'Musique de l\'aventure'}</button>` : ''}
      <div class="pager fixed">${btn('go', n ? 'Partir en expédition →' : 'Rien à combattre avec ce choix', 'var(--hl)', n ? '' : 'disabled')}</div></div>`;
  }
  function best() {
    const r = R(), all = A.all(), seen = all.filter(x => r.seen[x.id]);
    return `${head(count(seen.length, all.length))}<div class="muted small">Les monstres que tu as battus, et ce qu'il faut retenir pour les battre. Touche-en un pour revoir sa fiche.</div>
      <div class="avbest">${seen.map(x => { const w = kit(x).weak; return `<a class="card avmon" href="${x.link}">${sprite(x)}<span><b>${esc(x.title)}</b><span class="muted">${esc(x.lab)} · battu ${r.seen[x.id]} fois</span>${w ? `<span class="avweak"><b>${esc(w[0])}</b> ${md(w[1])}</span>` : ''}</span></a>`; }).join('') || '<div class="muted">Aucun monstre battu pour l\'instant.</div>'}</div>
      <div class="pager fixed"><button class="btn ghost grow" data-g="avbest">← Retour au camp</button></div></div>`;
  }
  function view() {
    const g = G(), r = R();
    if (g.scr === 'hub') return hub();
    if (g.scr === 'best') return best();
    if (g.scr === 'map') return map();
    if (g.scr === 'fight') return fight();
    if (g.scr === 'chest') { const t = g.t, it = ITEMS[t.item];
      return `${head('')}<div class="card gover avchest">${CHEST(t.done && t.won ? 'idle' : 'shake')}
        <div class="kicker">${t.done ? (t.won ? 'OBJET GAGNÉ' : 'LE COFFRE SE REFERME') : 'DANS LE COFFRE'}</div><div class="question">${esc(it.n)}</div>
        ${t.done ? `<div class="muted">${t.won ? `${it.s === 'soin' ? `Soin : +${it.v} PV` : it.s === 'arme' ? `Arme : attaque +${it.v}` : `Protection : défense +${it.v}`}. ` : 'Tu ne sais pas encore t\'en servir. '}Il sert à : ${esc(it.use.toLowerCase())}.</div>` : ''}</div>
        <div class="card qc">${qcard(t)}</div>${t.done ? `<div class="pager fixed">${btn('avnext', g.last ? 'Fin de l\'expédition →' : 'Continuer →')}</div>` : ''}</div>`; }
    const f = g.foe, w = f.kit.weak;
    if (g.scr === 'win') return `${head('')}<div class="card gover">${sprite(f.it, 'ko', f.boss)}<div class="kicker">${f.boss ? 'BOSS VAINCU' : 'VICTOIRE'}${f.miss ? '' : ' · SANS FAUTE'}</div><div class="question">${esc(f.it.title)}</div>
        ${w ? `<div class="ptcle"><b>${esc(w[0])}</b> ${md(w[1])}</div>` : ''}<div class="muted" style="margin-top:8px">Tu souffles : +30 % de PV · +${(f.boss ? 45 : 18) + (f.miss ? 0 : 8)} XP${g.up ? ` · <b>Niveau ${r.lvl} !</b> PV rendus, attaque +2` : ''}</div></div>
        <div class="pager fixed">${btn('avcont', f.boss ? 'Ouvrir son trésor →' : 'Continuer →')}</div></div>`;
    if (g.scr === 'ko') return `${head('')}<div class="card gover">${sprite(f.it, 'idle', f.boss)}<div class="kicker">K.O.</div><div class="question">${esc(f.it.title)} t'a eu.</div>
        ${w ? `<div class="ptcle"><b>${esc(w[0])}</b> ${md(w[1])}</div>` : ''}<div class="muted" style="margin-top:8px">Tu gardes tes ${g.gain} XP et tes objets. Revois sa fiche et reviens te venger.</div>
        <div class="row2" style="margin-top:12px"><a class="btn ghost grow" href="${f.it.link}">${ico('book')} Sa fiche</a></div></div>
        <div class="pager fixed">${btn('go', '↻ Nouvelle expédition')}<button class="btn ghost grow" data-g="avhub">Camp</button></div></div>`;
    return `${head('')}<div class="card gover">${HERO('idle')}<div class="kicker">EXPÉDITION RÉUSSIE</div><div class="gscore">+${g.gain} XP</div><div class="question">Niveau ${r.lvl} · ${g.kills.length} monstres battus</div></div>
      <div class="avbest">${g.kills.map(x => `<a class="card avmon" href="${x.link}">${sprite(x)}<span><b>${esc(x.title)}</b><span class="muted">${esc(x.lab)}</span></span></a>`).join('')}</div>
      <div class="pager fixed">${btn('go', '↻ Nouvelle expédition')}<button class="btn ghost grow" data-g="avhub">Camp</button></div></div>`;
  }
  return { start, view, act };
};
