// Cube d'herbe calculé pixel par pixel, en couches empilées comme le ferait un peintre :
// relief → lumière → terre → mottes → herbe qui pend → cascade → sol (chemin, mare, sable) → touffes → maison → contour.
// Chaque couche écrit une matière et un ton ; la palette n'est appliquée qu'à la fin.
const GRASS = ['#0a4439', '#0d533b', '#11633c', '#16733c', '#1e843b', '#2a9438', '#3ca434', '#56b32f', '#76c12b', '#9bcf2b', '#c3dc33', '#ebe85a'];
const DIRT = ['#22151a', '#34201f', '#482b24', '#5d372a', '#734430', '#8a5437', '#a16640', '#b87b4a', '#cd9459', '#e0af70', '#f0cb90'];
const WATER = ['#0e2a56', '#123e78', '#18589c', '#2278bc', '#3a9ad4', '#6cc0e6', '#b4e6f6', '#f2fcff'];
const WALL = ['#3d3038', '#5b4a48', '#7c675a', '#9d866c', '#bda682', '#d9c69c', '#f0e2bc'];
const ROOF = ['#35131f', '#541c24', '#762728', '#99362b', '#bb4d30', '#d76d3a', '#ee9852'];
const OUTLINE = '#0d1f1d';

function cube(seed) {
  const S = 256, img = new ImageData(S, S), px = new Uint32Array(img.data.buffer);
  const mat = new Uint8Array(S * S), tb = new Float32Array(S * S);   // 0 vide, 1 herbe, 2 terre/bois, 3 eau, 4 mur, 5 toit
  const CX = 128, CY = 72, HW = 112, HH = 56, SH = 112;
  const HOUSE = { u0: -.06, u1: .36, v0: -.75, v1: -.39, wall: 20, rise: 15 };
  const POND = { u: -.2, v: .58 };

  const hsh = (x, y) => { let n = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + seed | 0; n = Math.imul(n ^ n >>> 13, 1274126177); return ((n ^ n >>> 16) >>> 0) / 4294967296; };
  const vn = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = hsh(xi, yi), b = hsh(xi + 1, yi), c = hsh(xi, yi + 1), d = hsh(xi + 1, yi + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  };
  const fbm = (x, y) => vn(x, y) * .55 + vn(x * 2.1 + 9, y * 2.1 + 4) * .3 + vn(x * 4.3 + 3, y * 4.3 + 7) * .15;
  const sat = t => Math.max(0, Math.min(1, t)), smooth = t => (t = sat(t), t * t * (3 - 2 * t));
  const set = (x, y, m, t) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < S && y < S) { mat[y * S + x] = m; tb[y * S + x] = t; } };
  const addDirt = (x, y, dt) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < S && y < S && mat[y * S + x] === 2) tb[y * S + x] += dt; };
  const uv = (x, y) => [(x - CX) / HW + (y - CY) / HH, -(x - CX) / HW + (y - CY) / HH];
  const P = (u, v, z) => [CX + (u - v) * HW / 2, CY + (u + v) * HH / 2 - z];   // point 3D → écran
  const edgeY = dx => dx < 0 ? CY + (dx + HW) / 2 : CY + HH - dx / 2;          // arête avant du dessus

  // --- couche relief + lumière : buttes douces éclairées d'en haut à gauche, grandes ombres portées
  const height = (x, y) => fbm(x / 46, y / 23) + .35 * fbm(x / 17 + 5, y / 8.5 + 3);
  const light = (x, y) => {
    const slope = height(x, y) - height(x - 4, y - 6);
    const cloud = smooth((fbm(x / 60 + 20, y / 30 + 20) - .36) / .26);
    return sat((.54 + slope * 5) * (.56 + .44 * cloud) + (height(x, y) - .67) * .35);
  };
  // chemin principal + petite allée qui mène à la porte ; < .12 = terre
  const pathD = (u, v, x, y) => {
    const n = (vn(x / 5, y / 5) - .5) * .1, main = Math.abs(v - .3 * Math.sin(u * 2.6 + .5)) + n;
    const alley = v > HOUSE.v1 && v < .3 ? Math.abs(u - .13) * 2 + n : 9;
    return Math.min(main, alley);
  };
  // mare + ruisseau jusqu'au bord ; < 1 = eau, < 1.22 = sable
  const streamU = v => POND.u + .04 * Math.sin(v * 14);
  const waterF = (u, v, x, y) => {
    const n = (vn(x / 7, y / 7) - .5) * .3;
    const pond = Math.hypot((u - POND.u) / .3, (v - POND.v) / .22) + n;
    const stream = v > POND.v ? Math.abs(u - streamU(v)) / .055 + n * .5 : 9;
    return Math.min(pond, stream);
  };
  const fallX = Math.round(CX + (streamU(1) - 1) * HW / 2);   // où le ruisseau tombe du cube

  // --- couche terre des deux côtés : strates, grain, ombre sous l'herbe, plus sombre vers le bas
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = x - CX; if (Math.abs(dx) > HW) continue;
    const left = dx < 0, d = y - edgeY(dx); if (d <= 0 || d > SH) continue;
    const a = left ? dx + HW : dx + 300;
    let t = 4.7 + (fbm(a / 16, d / 8) - .5) * 5 + Math.sin(d / 5 + vn(a / 20, 1) * 5) * .5 + (hsh(x, y) - .5) * .8
          - d / SH * 2 + (left ? 1.4 : -1.2);
    if (d < 18) t -= (18 - d) / 18 * 2.6;
    if (d > SH - 3) t -= 1.5;
    if (dx === -1 || dx === -2) t += 1.2; else if (dx === 0) t += .5;
    set(x, y, 2, t);
  }
  // --- couche mottes et cailloux : clairs en haut à gauche, ombre dessous
  for (let k = 0; k < 360; k++) {
    const left = k & 1, a = hsh(k, 11) * HW, d = 8 + hsh(k, 12) * (SH - 14), r = 1.5 + hsh(k, 13) ** 2 * 5.5;
    for (let oy = -r; oy <= r + 2; oy++) for (let ox = -r; ox <= r + 1; ox++) {
      const x = Math.round((left ? CX - HW : CX) + a + ox), dx = x - CX; if (left !== (dx < 0 ? 1 : 0)) continue;
      const y = edgeY(dx) + d + oy, e = (ox / r) ** 2 + (oy / (r * .72)) ** 2 + (hsh(ox + k, oy) - .5) * .4;
      if (e < 1) addDirt(x, y, 1.1 - (ox + oy * 1.6) / r * 1.2);
      else if (e < 1.9 && oy > 0) addDirt(x, y, -1.4);
    }
  }
  // --- couche herbe qui pend sur les côtés (sauf là où le chemin et le ruisseau arrivent au bord)
  for (let x = CX - HW; x <= CX + HW; x++) {
    const dx = x - CX, left = dx < 0, y0 = edgeY(dx);
    if (!left && pathD(1, 1 - dx / (HW / 2), x, y0) < .12) continue;
    if (Math.abs(x - fallX) < 5) continue;
    const L = light(x, y0), g = 3 + vn(x / 5, 7) * 7 + hsh(x, 3) * 4 + (hsh(x, 5) > .85 ? 4 : 0);
    for (let d = 1; d <= g; d++) set(x, y0 + d, 1, L * 11 * (left ? .7 : .45) + (left ? .5 : 0) + (hsh(x, 8) - .5) * 2 - d / g * 3.5);
  }
  // --- couche cascade : le ruisseau tombe le long du côté gauche, filets clairs, écume en haut
  for (let x = fallX - 4; x <= fallX + 4; x++) {
    const w = Math.abs(x - fallX), y0 = edgeY(x - CX);
    for (let d = 1; d <= SH - 1; d++) {
      const spread = w - d / SH * 1.5; if (spread > 3.2) continue;
      const streak = hsh(x, (d + hsh(x, 1) * 9) / 7 | 0) > .55 ? 1.6 : 0;
      set(x, y0 + d, 3, 4.2 + streak - (w > 2 ? 1.4 : 0) + (d < 4 ? 2 : 0) - d / SH * 1.2);
    }
  }
  // --- couche sol du dessus : fond d'herbe sombre, chemin de terre, mare et son sable
  for (let y = CY - HH; y <= CY + HH; y++) for (let x = CX - HW; x <= CX + HW; x++) {
    const [u, v] = uv(x, y); if (Math.abs(u) > 1 || Math.abs(v) > 1) continue;
    const pd = pathD(u, v, x, y), L = light(x, y), f = waterF(u, v, x, y);
    if (f < 1) {
      const [u2, v2] = uv(x, y - 3), bank = waterF(u2, v2, x, y - 3) >= 1;      // la berge du haut fait de l'ombre
      const ripple = hsh(x / 3 | 0, y) > .86 && hsh(x / 3 | 0, y + 1) < .6 ? 2.2 : 0;
      set(x, y, 3, bank ? 1 : 1.6 + f * 2.6 + ripple + (f > .88 ? 1.8 : 0) + (vn(x / 9, y / 4) - .5) * 1.5);
    } else if (f < 1.22) set(x, y, 2, 8.6 + (hsh(x, y) - .5) * 1.4 - (f < 1.07 ? 2 : 0));
    else if (pd < .12) set(x, y, 2, 8 + (L - .5) * 4 + (fbm(x / 5, y / 3) - .5) * 2.6 + (hsh(x, y) - .5) * .8 - (pd > .09 ? 1.6 : 0));
    else set(x, y, 1, L * 11 - 1.5);
  }
  for (let k = 0; k < 60; k++) {   // petits cailloux du chemin
    const u = hsh(k, 21) * 2 - 1, v = .3 * Math.sin(u * 2.6 + .5) + (hsh(k, 22) - .5) * .16;
    const [x, y] = P(u, v, 0), w = 1 + (hsh(k, 23) * 3 | 0);
    for (let i = 0; i < w; i++) { addDirt(x + i, y, 2); addDirt(x + i, y + 1, -2); }
  }
  // --- couche touffes : trois brins par touffe, pointe claire, pied sombre, posées de l'arrière vers l'avant
  const tuft = (tx, ty, t, H) => {
    const lean = hsh(tx, ty + 9) > .5 ? 1 : -1;
    for (let i = 0; i < H - 2; i++) set(tx + 1 + (i >= H - 3 ? 1 : 0), ty - i, 1, t - 1.3 + i * .6);
    for (let i = 0; i < H - 1; i++) set(tx - 1 - (i >= H - 2 ? 1 : 0), ty - i, 1, t - .4 + i / Math.max(1, H - 2) * 1.6);
    for (let i = 0; i < H; i++) set(tx + (i >= H - 1 ? lean : 0), ty - i, 1, t - .9 + i / (H - 1) * 2);
  };
  for (let y = CY - HH; y <= CY + HH; y += 2) for (let x = CX - HW; x <= CX + HW; x += 3) {
    const tx = x + (hsh(x, y) * 3 | 0), ty = y + (hsh(y, x + 77) * 2 | 0), [u, v] = uv(tx, ty);
    if (Math.abs(u) > 1 || Math.abs(v) > 1) continue;
    const pd = pathD(u, v, tx, ty), f = waterF(u, v, tx, ty);
    if (f < 1.22 || pd < .12 && hsh(tx, ty + 31) < .985) continue;
    const reed = f < 1.5;                                                        // roseaux au bord de l'eau
    const shadow = v > HOUSE.v0 - .04 && v < HOUSE.v1 + .04 ? smooth((HOUSE.u1 + .3 - u) / .1) * smooth((u - HOUSE.u1 + .05) / .05) : 0;
    const t = light(tx, ty) * 11 + (pd < .18 ? -1.5 : 0) + (u > .93 || v > .93 ? 1 : 0) + (hsh(tx, ty + 500) - .5) * 1.2 - shadow * 3.5 - (reed ? 1 : 0);
    tuft(tx, ty, t, 3 + (hsh(tx + 13, ty) * 3 | 0) + (reed ? 2 : 0));
  }

  // --- couche maison : mur de droite (ombre), mur de gauche (soleil, porte), toit de tuiles, cheminée
  const { u0, u1, v0, v1, wall, rise } = HOUSE, du = u1 - u0, dv = v1 - v0, vm = (v0 + v1) / 2;
  const grain = (x, y) => (hsh(x, y) - .5) * .7;
  const face = (lit, a, z, top, x, y) => {      // colombages + crépi + soubassement de pierre
    if (a < .05 || a > .95 || z > top - 2) return [2, lit ? 4.6 : 2.6];
    if (z < 3) return [4, (lit ? 2.6 : 1.2) + grain(x, y) * 2];
    return [4, (lit ? 5.3 : 3.2) + grain(x, y) - (z > top - 6 ? .9 : 0)];
  };
  const opening = (lit, a, z, a0, a1, z0, z1, door) => {   // porte ou fenêtre
    if (a < a0 || a > a1 || z < z0 || z > z1) return null;
    const fa = (a - a0) / (a1 - a0), fz = (z - z0) / (z1 - z0), frame = fa < .14 || fa > .86 || fz > .88 || (!door && fz < .12);
    if (frame) return [2, lit ? 2 : 1];
    if (door) return [2, 4.4 - (fa * 4 % 1 < .25 ? 1.2 : 0) + (fa > .68 && fa < .8 && fz > .45 && fz < .58 ? 5 : 0)];
    return Math.abs(fa - .5) < .09 || Math.abs(fz - .5) < .09 ? [2, 2] : [2, 10 - fz * 1.5];   // carreaux éclairés
  };
  for (let i = 0; i <= 100; i++) for (let z = 0; z <= wall + rise; z += .5) {      // mur de droite, avec le pignon
    const a = i / 100, top = wall + rise * (1 - Math.abs(2 * a - 1)); if (z > top) continue;
    const [x, y] = P(u1, v0 + a * dv, z), r = Math.round;
    const o = opening(false, a, z, .36, .64, 7, 15) || (z > wall ? [4, 3 + grain(r(x), r(y))] : face(false, a, z, 99, r(x), r(y)));
    set(x, y, o[0], z > top - 1.5 ? 1.6 : o[1]);
  }
  for (let i = 0; i <= 120; i++) for (let z = 0; z <= wall; z += .5) {             // mur de gauche, au soleil
    const a = i / 120, [x, y] = P(u0 + a * du, v1, z), r = Math.round;
    const o = opening(true, a, z, .22, .46, 0, 14, true) || opening(true, a, z, .62, .86, 7, 15) || face(true, a, z, wall, r(x), r(y));
    set(x, y, o[0], o[1]);
  }
  const ov = .06, half = dv / 2;                                                    // pan de toit visible, tuiles en quinconce
  for (let i = 0; i <= 160; i++) for (let j = 0; j <= 120; j++) {
    const a = i / 160, s = j / 120, u = u0 - .04 + a * (du + .08), v = vm + s * (half + ov), z = wall + rise * (1 - s * (half + ov) / half);
    const [x, y] = P(u, v, z), row = s * 8 | 0, fr = s * 8 % 1, col = a * 13 + (row & 1) * .5 | 0, fc = (a * 13 + (row & 1) * .5) % 1;
    let t = 4.5 + (hsh(col, row + 60) - .5) * 1.8 - fr * 1.3 - (fc < .12 ? 1.2 : 0) + (fr < .2 ? .8 : 0);
    if (s < .05) t = 6; if (s > .95 || a > .985) t = 1; if (a < .012) t = 2;
    set(x, y, 5, t);
  }
  { const [x, y] = P(u0 + .11, vm + .07, wall + rise * .6);                         // cheminée de pierre
    for (let oy = 0; oy <= 13; oy++) for (let ox = -3; ox <= 3; ox++)
      set(x + ox, y - oy + Math.abs(ox) / 2 - (ox < 0 ? 0 : 1), 4, oy > 11 ? 1 : (ox < 0 ? 4.4 : 2.4) - (oy % 4 === 0 ? 1 : 0) + grain(x + ox, y - oy)); }
  for (let i = 0; i <= 14; i++) {                                                   // herbe au pied des murs
    const a = i / 14, [x1, y1] = P(u0 + a * du, v1 + .02, 0), [x2, y2] = P(u1 + .02, v0 + a * dv, 0);
    if (a < .2 || a > .5) tuft(Math.round(x1), Math.round(y1) + 1, light(x1, y1) * 11 - 1, 3);
    tuft(Math.round(x2), Math.round(y2) + 1, light(x2, y2) * 11 - 4, 3);
  }

  // --- palette, puis contour sombre
  const abgr = s => { const n = parseInt(s.slice(1), 16); return (0xff000000 | (n & 255) << 16 | n & 0xff00 | n >> 16) >>> 0; };
  const ramps = [null, GRASS, DIRT, WATER, WALL, ROOF].map(r => r && r.map(abgr));
  for (let i = 0; i < px.length; i++) if (mat[i]) { const R = ramps[mat[i]]; px[i] = R[Math.max(0, Math.min(R.length - 1, Math.round(tb[i])))]; }
  const o = abgr(OUTLINE), at = (x, y) => x >= 0 && y >= 0 && x < S && y < S && mat[y * S + x];
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++)
    if (!mat[y * S + x] && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) px[y * S + x] = o;
  return img;
}
