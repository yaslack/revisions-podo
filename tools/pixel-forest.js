// Clairière de nuit calculée pixel par pixel : sol → touffes → objets (du fond vers l'avant, chacun sur son calque
// avec son contour) → lumière du lampadaire. Rien n'est une image : tout est dessiné par ce code.
const FOREST = {
  grass: ['#0c2636', '#10323a', '#153f3c', '#1b4c3c', '#245a3c', '#30693e', '#407a42', '#568c48'],
  path: ['#33202f', '#442a39', '#553440', '#663f46', '#774b4a', '#88584e', '#996652'],
  leaf: ['#06233a', '#08374c', '#0a4f5a', '#0f6c62', '#1b8a68', '#3ca86c', '#72c678', '#b0e28e'],
  trunk: ['#2a1622', '#4c2628', '#73392c', '#9a5232', '#bb6e3c', '#d68e4e'],
  rock: ['#1c1a34', '#2c2848', '#423e5e', '#5c5878', '#7c7896'],
  metal: ['#2c2118', '#4c3920', '#70542a', '#967436', '#b89246'],
  wood: ['#6b4a34', '#8c6540', '#ab8250', '#c69c62', '#dab678'],
  hair: ['#1e100c', '#371e12', '#54301a', '#734524', '#8e5c30'],
  skin: ['#9a5c48', '#c08060', '#d89a74', '#eab890'],
  cloth: ['#141418', '#202028', '#30303a', '#444450'],
};

function forest(seed) {
  const W = 320, H = 200, N = W * H, img = new ImageData(W, H), px = new Uint32Array(img.data.buffer), lay = new Uint32Array(N);
  const hsh = (x, y) => { let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + seed | 0; n = Math.imul(n ^ n >>> 13, 1274126177); return ((n ^ n >>> 16) >>> 0) / 4294967296; };
  const vn = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = hsh(xi, yi), b = hsh(xi + 1, yi), c = hsh(xi, yi + 1), d = hsh(xi + 1, yi + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  };
  const fbm = (x, y) => vn(x, y) * .55 + vn(x * 2.1 + 9, y * 2.1 + 4) * .3 + vn(x * 4.3 + 3, y * 4.3 + 7) * .15;
  const sat = t => Math.max(0, Math.min(1, t)), smooth = t => (t = sat(t), t * t * (3 - 2 * t));
  const abgr = s => { const n = parseInt(s.slice(1), 16); return (0xff000000 | (n & 255) << 16 | n & 0xff00 | n >> 16) >>> 0; };
  const R = Object.fromEntries(Object.entries(FOREST).map(([k, v]) => [k, v.map(abgr)]));
  const tone = (ramp, t) => ramp[Math.max(0, Math.min(ramp.length - 1, Math.round(t)))];
  const OUT = abgr('#07151f'), WHITE = abgr('#eef0e0'), YELLOW = abgr('#e8bc4c');

  // --- calque : on dessine un objet dessus, puis on le pose sur l'image avec son contour sombre
  const put = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < W && y < H) lay[y * W + x] = c; };
  const flush = (outline = OUT) => {
    for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i++) {
      if (lay[i]) px[i] = lay[i];
      else if (outline && ((x && lay[i - 1]) || (x < W - 1 && lay[i + 1]) || (y && lay[i - W]) || (y < H - 1 && lay[i + W]))) px[i] = outline;
    }
    lay.fill(0);
  };
  const disc = (cx, cy, r, f) => { for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) put(x, y, f(x, y, (x - cx) / r, (y - cy) / r)); };
  const stroke = (pts, r0, r1, f) => {   // trait épais le long de points, qui s'affine
    for (let s = 0; s < pts.length - 1; s++) for (let k = 0; k <= 12; k++) {
      const t = k / 12, g = (s + t) / (pts.length - 1), x = pts[s][0] + (pts[s + 1][0] - pts[s][0]) * t, y = pts[s][1] + (pts[s + 1][1] - pts[s][1]) * t;
      disc(x, y, r0 + (r1 - r0) * g, f);
    }
  };
  const bark = (x, y, ox) => tone(R.trunk, 2.6 - ox * 1.7 + (hsh(x, y >> 1) - .5) * 1.2);

  // texture de feuillage : des rangées d'écailles (dessus clair, bord sombre), décalées une ligne sur deux
  const scale = (x, y) => { const row = Math.floor(y / 3), cx = (((x + (row & 1) * 3) % 6) + 6) % 6 - 2.5, cy = ((y % 3) + 3) % 3; return cy === 0 && Math.abs(cx) < 2 ? 1 : cy === 2 || Math.abs(cx) > 2.4 ? -1 : 0; };
  const cel = (sh, x, y, dark) => {   // 3 aplats nets, avec quelques écailles seulement pour faire vivre la matière
    const sc = scale(x, y), row = Math.floor(y / 3), k = hsh(Math.floor((x + (row & 1) * 3) / 6), row + 900);
    const t = sh > .3 ? 6 - (sc < 0 && k > .45 ? 1 : 0) + (sc > 0 && k > .8 ? 1 : 0) : sh > -.3 ? 4 + (sc > 0 && k > .5 ? 1 : 0) - (sc < 0 && k < .25 ? 1 : 0) : 2 + (sc > 0 && k > .75 ? 1 : 0);
    return tone(R.leaf, t - dark);
  };

  // --- chemin : une ligne qui serpente, plus large au milieu
  const KP = [[0, 188, 11], [40, 180, 16], [91, 161, 30], [131, 164, 18], [162, 149, 19], [200, 170, 17]];
  const pathD = (x, y) => {
    let i = 0; while (i < KP.length - 2 && y > KP[i + 1][0]) i++;
    const a = KP[i], b = KP[i + 1], t = smooth((y - a[0]) / (b[0] - a[0])), cx = a[1] + (b[1] - a[1]) * t, hw = a[2] + (b[2] - a[2]) * t;
    return (Math.abs(x - cx) + (vn(x / 6, y / 6) - .5) * 10 + (vn(x / 2.5, y / 2.5) - .5) * 3) / hw;
  };
  const LX = 199, LY = 45;   // la lanterne
  const glow = (x, y) => smooth(1 - Math.hypot(x - LX, y - LY) / 30) * .95 + smooth(1 - Math.hypot(x - 202, (y - 80) * 1.3) / 58) * .5;

  // --- objets de la scène : [x, y du pied, fonction de dessin, rayon de l'ombre au sol]
  const things = [];
  const add = (x, y, shade, draw) => things.push({ x, y, shade, draw });

  const clump = (cx, cy, rx, ry, dark = 0) => {   // nuage de feuilles : plusieurs boules, chacune éclairée en haut à gauche
    const n = rx > 20 ? 4 : 3, lobes = [];
    for (let k = 0; k < n; k++) { const a = k / (n - 1) * 2 - 1; lobes.push([cx + a * rx * .58, cy + Math.abs(a) * ry * .22, ry * (1 - Math.abs(a) * .22) * 1.02]); }
    for (let y = Math.floor(cy - ry - 2); y <= cy + ry + 3; y++) for (let x = Math.floor(cx - rx - 2); x <= cx + rx + 2; x++) {
      let sh = -9;
      for (const [lx, ly, r] of lobes) {
        const nx = (x - lx) / (r * 1.25), ny = (y - ly) / r * (y > ly ? 1.35 : 1), e = Math.hypot(nx, ny) / (.94 + .1 * Math.abs(Math.sin(Math.atan2(ny, nx) * 4 + lx)));
        if (e < 1) sh = Math.max(sh, -ny * .95 - nx * .4);
      }
      if (sh > -9) put(x, y, cel(sh, x, y, dark));
    }
    flush();
  };
  const trunkBase = (bx, by, w, h) => {           // tronc droit avec racines
    for (let y = by - h; y <= by; y++) {
      const fl = Math.max(0, y - by + 5), half = w / 2 + fl * fl * .22;
      for (let x = Math.floor(bx - half); x <= bx + half; x++) if (y < by - 1 || (x + bx) % 4 !== 0) put(x, y, bark(x, y, (x - bx) / half));
    }
    flush();
  };
  const pine = (bx, by, w, h) => add(bx, by, w * .5, () => {   // sapin : des jupes empilées, de la plus large à la pointe
    trunkBase(bx, by, w * .15, h * .24);
    const n = 5;
    for (let i = 0; i <= n; i++) {
      const cy = by - h * .2 - i * h * .74 / n, wi = w / 2 * (1 - i / n * .74), th = h * .3, m = wi > 22 ? 5 : wi > 12 ? 3 : 1, lw = wi * 2 / m;
      for (let dx = -Math.ceil(wi); dx <= wi; dx++) {
        const f = Math.abs(dx) / wi, top = cy - th * (1 - f ** 1.15), lob = Math.abs(Math.sin((dx + wi) / lw * Math.PI)), bot = cy + 1 + 5 * lob + f * 4;
        for (let y = Math.floor(top); y <= bot; y++) {
          const x = bx + dx, v = (y - top) / (bot - top);
          put(x, y, cel((v < .42 && f < .8 ? .6 : v < .74 ? 0 : -.6) - (dx > wi * .4 ? .5 : 0) + (lob - .5) * .3, x, y, 0));
        }
      }
      flush();
    }
  });
  const roundTree = (cx, cy, r, trunk) => add(cx, cy + r, r * .9, () => {   // gros arbre rond et sombre
    if (trunk) trunkBase(cx, cy + r * 1.25, r * .3, r * .7);
    for (const [ox, oy, k] of [[-.3, .45, .5], [.4, .5, .5], [-.65, 0, .5], [.65, .05, .5], [0, .1, .6], [-.3, -.4, .5], [.35, -.45, .5], [0, -.7, .42]])
      clump(cx + ox * r, cy + oy * r, r * k * 1.25, r * k * .85, 1);
  });
  const twisted = (bx, by, flip) => add(bx, by, 16, () => {     // arbre tordu : tronc en S, branches, trois nuages de feuilles
    const m = dx => bx + dx * flip, ink = (x, y, ox) => bark(x, y, ox);
    clump(m(4), by - 68, 25, 13);
    stroke([[m(0), by], [m(-7), by + 2]], 2.2, 1.5, ink); stroke([[m(0), by], [m(7), by + 2]], 2.2, 1.5, ink);
    stroke([[m(1), by - 26], [m(-10), by - 36], [m(-17), by - 41]], 2.2, 1.4, ink);
    stroke([[m(-1), by - 36], [m(12), by - 38], [m(22), by - 39]], 2.2, 1.4, ink);
    stroke([[m(0), by], [m(-2), by - 13], [m(3), by - 25], [m(-1), by - 37], [m(4), by - 52]], 5, 2.6, ink);
    flush();
    clump(m(-19), by - 46, 19, 10); clump(m(25), by - 42, 18, 10); clump(m(2), by - 60, 15, 8);
  });
  const rock = (cx, cy, rx, ry) => add(cx, cy, rx * 1.2, () => {
    for (let y = Math.floor(cy - ry); y <= cy; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy > 1 + (hsh(x / 3 | 0, 5) - .5) * .25) continue;
      const sh = -dx * .6 - (dy + .5) * 1.5 + (hsh(x / 4 | 0, y / 3 | 0) - .5) * .5; put(x, y, R.rock[sh > .45 ? 4 : sh > .05 ? 3 : sh > -.45 ? 2 : 1]);
    }
    flush();
  });
  const fern = (cx, cy, size) => add(cx, cy, size * .5, () => {  // fougère : des palmes en éventail, chacune avec ses folioles
    for (const k of [0, 8, 1, 7, 2, 6, 3, 5, 4]) {
      const ang = -Math.PI * (.04 + k / 8 * .92), len = size * (.62 + .38 * Math.sin(k / 8 * Math.PI));
      for (let j = 0; j <= len * 2; j++) {
        const s = j / (len * 2), x = cx + Math.cos(ang) * s * len, y = cy + Math.sin(ang) * s * len + s * s * len * .42;
        const l = (1 - s) * size * .13 + 1, nx = -Math.sin(ang), ny = Math.cos(ang);
        if (j % 3 === 0) for (let q = -l; q <= l; q++) put(x + nx * q + Math.abs(q) * Math.cos(ang) * .5, y + ny * q * .8 + Math.abs(q) * .3, tone(R.leaf, 5.4 + s * 1.5 - Math.abs(q) / l + (q < 0 ? .6 : -.6)));
        put(x, y, tone(R.leaf, 3));
      }
      flush();
    }
  });
  const sprig = (x, y) => add(x, y, 0, () => {                  // brin d'herbe haute
    for (let b = 0; b < 5; b++) { const a = -Math.PI * (.14 + b * .18), len = 4 + (b % 2 ? 3 : 1) + (b === 2 ? 2 : 0);
      for (let s = 0; s <= len; s++) put(x + Math.cos(a) * s, y + Math.sin(a) * s, tone(R.leaf, 3.5 + s / len * 2.5)); }
    flush();
  });
  const flowers = (x, y) => add(x, y + 8, 0, () => {
    for (let i = 0; i < 4; i++) {
      const fx = x + (i % 2) * 9 - 4 + (hsh(x + i, y) * 3 | 0), fy = y + (i >> 1) * 6 + (hsh(x, y + i) * 3 | 0);
      for (let s = 1; s <= 4; s++) put(fx, fy + s, tone(R.leaf, 4)); put(fx - 1, fy + 3, tone(R.leaf, 5)); put(fx + 1, fy + 2, tone(R.leaf, 5));
      put(fx - 1, fy, WHITE); put(fx + 1, fy, WHITE); put(fx, fy - 1, WHITE); put(fx, fy + 1, WHITE); put(fx, fy, YELLOW);
    }
    flush();
  });
  const log = (ax, ay, bx, by, r) => add(ax, ay + r, r * 2.5, () => {   // tronc couché, mousse dessus, cernes au bout
    const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, ink = (x, y, ox, oy) => bark(x, y, oy);
    stroke([[ax + ux * L * .62, ay + uy * L * .62], [ax + ux * L * .62 + 3, ay + uy * L * .62 - r - 6]], 2.6, 2.2, ink);
    stroke([[ax + ux * L * .85, ay + uy * L * .85], [ax + ux * L * .85 + 5, ay + uy * L * .85 - r - 5]], 2.6, 2.2, ink);
    stroke([[ax + ux * L * .5, ay + uy * L * .5], [ax + ux * L * .5 + 7, ay + uy * L * .5 + r + 4]], 2.2, 1.8, ink);
    flush();
    for (let y = Math.floor(Math.min(ay, by) - r); y <= Math.max(ay, by) + r; y++) for (let x = Math.floor(ax - r); x <= bx + r; x++) {
      const t = (x - ax) * ux + (y - ay) * uy, s = -(x - ax) * uy + (y - ay) * ux; if (t < 0 || t > L || Math.abs(s) > r) continue;
      const moss = s < -r * .15 && fbm(t / 9, 3 + s / 9) > .47;
      put(x, y, moss ? tone(R.leaf, 5.5 - (s + r) / r * 2 + (hsh(x >> 1, y) - .5) * 1.5) : tone(R.trunk, 2.4 - s / r * 2.2 + (hsh(t / 4 | 0, s / 2 | 0) - .5) * 1.3));
    }
    flush();
    for (let y = Math.floor(ay - r - 1); y <= ay + r + 1; y++) for (let x = Math.floor(ax - r * .8); x <= ax + r * .8; x++) {   // la coupe
      const d = Math.hypot((x - ax) / .78, y - ay); if (d > r + .5) continue;
      put(x, y, tone(R.wood, d > r - 1.2 ? 0 : 2.6 + Math.sin(d * 1.9 + Math.atan2(y - ay, x - ax)) * 1.5));
    }
    flush();
  });
  const lamp = (bx, by) => add(bx, by, 5, () => {
    const m = (x, y, t) => put(x, y, tone(R.metal, t));
    for (let y = by - 47; y <= by; y++) { const half = y > by - 3 ? 4 : y > by - 7 ? 3 : y === by - 16 || y === by - 17 ? 2 : 1;
      for (let x = bx - half; x <= bx + half; x++) m(x, y, 2.4 - (x - bx) * .9 + (y > by - 7 ? -.4 : 0)); }
    for (let a = 0; a <= 20; a++) { const g = -Math.PI * a / 20, x = bx - 6 + Math.cos(g) * 6, y = by - 47 + Math.sin(g) * 6; m(x, y, 3); m(x, y + 1, 2); }
    for (let x = LX - 4; x <= LX + 4; x++) { m(x, LY - 5, 2); m(x, LY - 4, 1); }
    for (let x = LX - 2; x <= LX + 2; x++) m(x, LY + 4, 1);
    for (let y = LY - 3; y <= LY + 3; y++) for (let x = LX - 3; x <= LX + 3; x++) { const d = Math.hypot(x - LX, y - LY); put(x, y, abgr(d < 1.5 ? '#fff8d8' : d < 3 ? '#ffdc80' : '#f8a838')); }
    flush();
  });
  const hero = (cx, fy) => add(cx, fy, 0, () => {               // personnage : cheveux bouclés, tee-shirt noir, baskets blanches
    const rect = (x0, y0, x1, y1, f) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, typeof f === 'function' ? f(x, y) : f); };
    const C = R.cloth, S = R.skin, y = fy - 40, dark = abgr('#1a0e10');
    rect(cx - 5, y + 34, cx - 2, y + 38, C[1]); rect(cx + 2, y + 34, cx + 5, y + 38, C[1]);                       // jambes
    rect(cx - 6, y + 38, cx - 2, y + 40, WHITE); rect(cx + 2, y + 38, cx + 6, y + 40, WHITE);                       // baskets
    rect(cx - 6, y + 40, cx - 2, y + 40, abgr('#a8a8b4')); rect(cx + 2, y + 40, cx + 6, y + 40, abgr('#a8a8b4'));
    rect(cx - 7, y + 26, cx + 7, y + 35, (x, yy) => C[x < cx - 3 ? 3 : x > cx + 4 ? 1 : 2 - (yy > y + 33 ? 1 : 0)]); // tee-shirt
    rect(cx - 10, y + 27, cx - 8, y + 32, C[3]); rect(cx + 8, y + 27, cx + 10, y + 32, C[1]);                       // bras
    rect(cx - 10, y + 32, cx - 8, y + 34, S[2]); rect(cx + 8, y + 32, cx + 10, y + 34, S[1]);                       // mains
    disc(cx, y + 18, 9.6, (x, yy, ox, oy) => S[oy > .75 ? 1 : ox < -.2 && oy < .3 ? 3 : 2]);                          // tête
    rect(cx - 11, y + 18, cx - 10, y + 20, WHITE); rect(cx + 10, y + 18, cx + 11, y + 20, WHITE); put(cx - 10, y + 21, WHITE); put(cx + 10, y + 21, WHITE);   // écouteurs
    for (let i = 0; i < 5; i++) { put(cx - 7 + i, y + 16 + (i > 1 ? 1 : 0), dark); put(cx + 7 - i, y + 16 + (i > 1 ? 1 : 0), dark); }   // sourcils
    rect(cx - 6, y + 18, cx - 3, y + 19, dark); rect(cx + 3, y + 18, cx + 6, y + 19, dark); put(cx - 6, y + 19, S[3]); put(cx + 6, y + 19, S[3]);   // yeux
    put(cx, y + 21, S[1]); rect(cx - 2, y + 24, cx + 2, y + 24, S[0]); put(cx + 3, y + 23, S[0]);                   // nez, sourire en coin
    for (let yy = y - 3; yy <= y + 20; yy++) for (let x = cx - 17; x <= cx + 17; x++) {                              // cheveux bouclés
      const dx = (x - cx) / 15, dy = (yy - y - 9) / 11, e = Math.hypot(dx, dy) / (.93 + .12 * Math.abs(Math.sin(Math.atan2(dy, dx) * 8)));
      if (e >= 1 || (yy > y + 13 + Math.abs(Math.sin(x * 1.1)) * 1.5 && Math.abs(x - cx) < 10)) continue;
      put(x, yy, tone(R.hair, 2 + Math.sin(x * 1.25 + Math.sin(yy * 1.1) * 2.2) * 1.1 - dy * 1.2 - dx * .5 + (hsh(x, yy) - .5) * .8));
    }
    flush(dark);
  });

  // --- la scène (positions reprises de l'image de référence)
  roundTree(56, 4, 30, true); roundTree(130, -4, 26); roundTree(305, 16, 34); roundTree(12, 112, 34); roundTree(30, 178, 36);
  roundTree(299, 160, 34, true); roundTree(318, 96, 22);
  pine(33, 88, 64, 96); pine(240, 199, 60, 100);
  twisted(99, 84, 1); twisted(248, 82, -1);
  rock(71, 92, 12, 13); rock(151, 21, 7, 7); rock(219, 115, 12, 13); rock(202, 126, 10, 9);
  fern(289, 100, 34); fern(93, 186, 38);
  log(48, 137, 101, 114, 10);
  flowers(44, 97); flowers(147, 26); flowers(227, 68); flowers(194, 157); flowers(208, 184);
  for (const [x, y] of [[115, 74], [121, 122], [116, 139], [289, 124], [134, 193], [77, 70], [144, 36], [262, 176]]) sprig(x, y);
  lamp(211, 88); hero(160, 101);

  // --- couche sol : herbe sombre, chemin, ombres au pied des objets
  const shade = (x, y) => { let s = 0; for (const o of things) if (o.shade) s += smooth(1 - Math.hypot(x - o.x, (y - o.y) * 2) / o.shade) * .3; return Math.min(s, .5); };
  const lightAt = (x, y) => .52 + (fbm(x / 40, y / 30) - .5) * .7 - shade(x, y) + glow(x, y) * .25;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const pd = pathD(x, y), L = lightAt(x, y);
    px[y * W + x] = pd < 1 ? tone(R.path, 1.2 + L * 5 + (fbm(x / 9, y / 6) - .5) * 2.4 + (hsh(x, y) - .5) * .5 - (pd > .8 ? 1 : 0)) : tone(R.grass, L * 6 - 1.2);
  }
  { const [cx, cy] = [160, 101]; for (let y = cy - 3; y <= cy + 3; y++) for (let x = cx - 12; x <= cx + 12; x++) if (((x - cx) / 12) ** 2 + ((y - cy) / 3.4) ** 2 < 1) px[y * W + x] = R.path[0]; }
  // --- couche touffes, de l'arrière vers l'avant
  const g = (x, y, t) => { if (x >= 0 && y >= 0 && x < W && y < H) px[y * W + x] = tone(R.grass, t); };
  for (let y = 0; y < H + 4; y += 2) for (let x = -2; x < W + 2; x += 3) {
    const tx = x + (hsh(x, y) * 3 | 0), ty = y + (hsh(y, x + 77) * 2 | 0), pd = pathD(tx, ty);
    if (pd < 1 && hsh(tx, ty + 31) < .99) continue;
    const t = lightAt(tx, ty) * 6 + (hsh(tx, ty + 500) - .5) * 1 - (pd < 1.2 ? 1 : 0), Hh = 3 + (hsh(tx + 13, ty) * 3 | 0);
    for (let i = 0; i < Hh - 2; i++) g(tx + 1 + (i >= Hh - 3 ? 1 : 0), ty - i, t - 1.1 + i * .5);
    for (let i = 0; i < Hh - 1; i++) g(tx - 1 - (i >= Hh - 2 ? 1 : 0), ty - i, t - .5 + i / Math.max(1, Hh - 2) * 1.3);
    for (let i = 0; i < Hh; i++) g(tx, ty - i, t - .8 + i / (Hh - 1) * 1.7);
  }
  // --- objets, du fond vers l'avant
  things.sort((a, b) => a.y - b.y).forEach(o => o.draw());

  // --- couche lumière : halo chaud du lampadaire (par paliers tramés) et bords de l'image assombris
  const d = img.data, bayer = [0, .5, .75, .25];
  for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i += 4) {
    const b = bayer[(x & 1) + (y & 1) * 2] / 5, q = Math.floor(sat(glow(x, y)) * 5 + b * 5) / 5;
    const v = Math.floor(smooth((Math.hypot((x - 160) / 190, (y - 100) / 125) - .6) / .5) * 4 + b * 4) / 4, k = 1 - v * .2;
    d[i] = (d[i] + (255 - d[i]) * q * .55) * k; d[i + 1] = (d[i + 1] + (184 - d[i + 1]) * q * .42) * k; d[i + 2] = (d[i + 2] + (70 - d[i + 2]) * q * .22) * k;
  }
  return img;
}
