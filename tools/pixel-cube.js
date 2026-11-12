// Cube d'herbe calculé pixel par pixel, en couches empilées comme le ferait un peintre :
// relief → lumière → terre → mottes → herbe qui pend → chemin → touffes (de l'arrière vers l'avant) → contour.
// Chaque couche écrit une matière (herbe / terre) et un ton ; la palette n'est appliquée qu'à la fin.
const GRASS = ['#0a4439', '#0d533b', '#11633c', '#16733c', '#1e843b', '#2a9438', '#3ca434', '#56b32f', '#76c12b', '#9bcf2b', '#c3dc33', '#ebe85a'];
const DIRT = ['#22151a', '#34201f', '#482b24', '#5d372a', '#734430', '#8a5437', '#a16640', '#b87b4a', '#cd9459', '#e0af70', '#f0cb90'];
const OUTLINE = '#0d1f1d';

function cube(seed) {
  const S = 256, img = new ImageData(S, S), px = new Uint32Array(img.data.buffer);
  const mat = new Uint8Array(S * S), tb = new Float32Array(S * S);   // 0 vide, 1 herbe, 2 terre
  const CX = 128, CY = 72, HW = 112, HH = 56, SH = 112;

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
  const edgeY = dx => dx < 0 ? CY + (dx + HW) / 2 : CY + HH - dx / 2;   // arête avant du dessus

  // --- couche relief + lumière : buttes douces éclairées d'en haut à gauche, grandes ombres portées
  const height = (x, y) => fbm(x / 46, y / 23) + .35 * fbm(x / 17 + 5, y / 8.5 + 3);
  const light = (x, y) => {
    const slope = height(x, y) - height(x - 4, y - 6);
    const cloud = smooth((fbm(x / 60 + 20, y / 30 + 20) - .36) / .26);
    return sat((.54 + slope * 5) * (.56 + .44 * cloud) + (height(x, y) - .67) * .35);
  };
  const pathD = (u, v, x, y) => Math.abs(v - .3 * Math.sin(u * 2.6 + .5)) + (vn(x / 5, y / 5) - .5) * .1;

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
  // --- couche herbe qui pend sur les côtés (sauf là où le chemin arrive au bord)
  for (let x = CX - HW; x <= CX + HW; x++) {
    const dx = x - CX, left = dx < 0, y0 = edgeY(dx);
    if (!left && pathD(1, 1 - dx / (HW / 2), x, y0) < .12) continue;
    const L = light(x, y0), g = 3 + vn(x / 5, 7) * 7 + hsh(x, 3) * 4 + (hsh(x, 5) > .85 ? 4 : 0);
    for (let d = 1; d <= g; d++) set(x, y0 + d, 1, L * 11 * (left ? .7 : .45) + (left ? .5 : 0) + (hsh(x, 8) - .5) * 2 - d / g * 3.5);
  }
  // --- couche sol du dessus : fond d'herbe sombre + chemin de terre
  for (let y = CY - HH; y <= CY + HH; y++) for (let x = CX - HW; x <= CX + HW; x++) {
    const [u, v] = uv(x, y); if (Math.abs(u) > 1 || Math.abs(v) > 1) continue;
    const pd = pathD(u, v, x, y), L = light(x, y);
    if (pd < .12) set(x, y, 2, 8 + (L - .5) * 4 + (fbm(x / 5, y / 3) - .5) * 2.6 + (hsh(x, y) - .5) * .8 - (pd > .09 ? 1.6 : 0));
    else set(x, y, 1, L * 11 - 1.5);
  }
  for (let k = 0; k < 60; k++) {   // petits cailloux du chemin
    const u = hsh(k, 21) * 2 - 1, v = .3 * Math.sin(u * 2.6 + .5) + (hsh(k, 22) - .5) * .16;
    const x = CX + (u - v) * HW / 2, y = CY + (u + v) * HH / 2, w = 1 + (hsh(k, 23) * 3 | 0);
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
    const pd = pathD(u, v, tx, ty);
    if (pd < .12 && hsh(tx, ty + 31) < .985) continue;
    const t = light(tx, ty) * 11 + (pd < .18 ? -1.5 : 0) + (u > .93 || v > .93 ? 1 : 0) + (hsh(tx, ty + 500) - .5) * 1.2;
    tuft(tx, ty, t, 3 + (hsh(tx + 13, ty) * 3 | 0));
  }

  // --- palette, puis contour sombre
  const abgr = s => { const n = parseInt(s.slice(1), 16); return (0xff000000 | (n & 255) << 16 | n & 0xff00 | n >> 16) >>> 0; };
  const ramps = [null, GRASS.map(abgr), DIRT.map(abgr)];
  for (let i = 0; i < px.length; i++) if (mat[i]) { const P = ramps[mat[i]]; px[i] = P[Math.max(0, Math.min(P.length - 1, Math.round(tb[i])))]; }
  const o = abgr(OUTLINE), at = (x, y) => x >= 0 && y >= 0 && x < S && y < S && mat[y * S + x];
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++)
    if (!mat[y * S + x] && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) px[y * S + x] = o;
  return img;
}
