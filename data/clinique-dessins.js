// Dessins des 41 tests d'examen clinique (SVG 240×150), d'après les photos et schémas de référence de chaque test.
// Style illustration plate : corps en formes pleines (cuisses, mollets, mains, pieds, visage de profil), ombre douce,
// contour fin. Patient : t-shirt bleu clair, short. Praticien : blouse blanche, pantalon bleu.
// En couleur de la section (var(--c)) : ce qui bouge (flèches), la zone examinée (cercle) et les repères.
// Les tests sur une articulation sont cadrés en gros plan (CAM : x, y, largeur de la zone montrée).
(() => {
  // ---------- géométrie ----------
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
  const len = a => Math.hypot(a[0], a[1]), nrm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; }, perp = a => [-a[1], a[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const rot = (u, a) => [u[0] * Math.cos(a) - u[1] * Math.sin(a), u[0] * Math.sin(a) + u[1] * Math.cos(a)];
  const P = p => `${+p[0].toFixed(2)} ${+p[1].toFixed(2)}`;
  let K = 1;   // zoom du dessin en cours : traits, flèches et textes gardent la même taille à l'écran

  // forme allongée entre deux cercles (rayons ra, rb), côtés un peu bombés (bl à gauche, br à droite)
  function limb(a, b, ra, rb, bl = 0, br = 0) {
    const d = len(sub(b, a)); if (d < .01) return circle(a, Math.max(ra, rb));
    const u = mul(sub(b, a), 1 / d), ph = Math.acos(Math.max(-1, Math.min(1, (ra - rb) / d))), uL = rot(u, ph), uR = rot(u, -ph), n = perp(u);
    const AL = add(a, mul(uL, ra)), BL = add(b, mul(uL, rb)), AR = add(a, mul(uR, ra)), BR = add(b, mul(uR, rb));
    return `M${P(AL)}Q${P(add(lerp(AL, BL, .5), mul(n, bl * 2)))} ${P(BL)}A${rb} ${rb} 0 ${ph > Math.PI / 2 ? 1 : 0} 0 ${P(BR)}Q${P(add(lerp(BR, AR, .5), mul(n, -br * 2)))} ${P(AR)}A${ra} ${ra} 0 ${ph < Math.PI / 2 ? 1 : 0} 0 ${P(AL)}Z`;
  }
  const circle = (c, r) => `M${P([c[0] - r, c[1]])}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  // courbe douce fermée passant par les points (Catmull-Rom)
  function smooth(pts) {
    const n = pts.length; let d = `M${P(pts[0])}`;
    for (let i = 0; i < n; i++) { const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += `C${P(add(p1, mul(sub(p2, p0), 1 / 6)))} ${P(sub(p2, mul(sub(p3, p1), 1 / 6)))} ${P(p2)}`; }
    return d + 'Z';
  }
  // ombre : la même forme, plus fine, décalée vers le bas à droite (lumière en haut à gauche)
  const LIGHT = [.45, .9];
  const shadeOf = (a, b, ra, rb) => { const u = nrm(sub(b, a)); let s = perp(u); if (dot(s, LIGHT) < 0) s = mul(s, -1); const o = mul(s, (ra + rb) * .19); return limb(add(a, o), add(b, o), ra * .62, rb * .62); };

  // ---------- couleurs : [fond, ombre, contour] ----------
  const SKN = ['#f6cba8', '#e8b28b', '#b27b58'], SKF = ['#e2b089', '#d29d76', '#a36f4e'];
  const TOP = ['#a3cdec', '#86b5da', '#4f7fa6'], TOPF = ['#8fbadc', '#78a5ca', '#4a7499'], SHO = ['#41597a', '#35496a', '#24334c'];
  const COAT = ['#ffffff', '#e3e9f1', '#8a97aa'], COATF = ['#eef2f7', '#d9e0ea', '#8390a3'], PANT = ['#5f81a8', '#506f96', '#354f70'], PANTF = ['#56769c', '#48668b', '#33496a'];
  const SHOE = ['#3b3f49', '#2f333c', '#1d2027'], HAIRP = ['#5a3a28', '#4a2f20', '#3a2418'], HAIRD = ['#2e2a2a', '#252122', '#151313'];
  const DEV = ['#eef1f5', '#d5dbe3', '#6b7686'];
  const part = (d, c, sh, det = '') => ({ d, c, sh, det });
  const layer = parts => parts.map(p => `<path d="${p.d}" fill="${p.c[2]}" stroke="${p.c[2]}" stroke-width="2.4" vector-effect="non-scaling-stroke"/>`).join('') +
    parts.map(p => `<path d="${p.d}" fill="${p.c[0]}"/>${p.sh ? `<path d="${p.sh}" fill="${p.c[1]}"/>` : ''}${p.det}`).join('');

  // ---------- morceaux du corps ----------
  // main en moufle centrée en c, doigts vers dir ; le pouce part du côté « side »
  function mitten(c, dir, col = SKN, side, k = 1) {
    const d = nrm(dir); let n = perp(d); if (side ? side < 0 : dot(n, [0, -1]) < 0) n = mul(n, -1);
    const w = sub(c, mul(d, 4.5 * k)), m = add(c, mul(d, 1.2 * k)), tip = add(c, mul(d, 5.4 * k)), t1 = add(w, add(mul(d, 2.2 * k), mul(n, 2.4 * k))), t2 = add(w, add(mul(d, 5.6 * k), mul(n, 4.6 * k)));
    return [part(limb(t1, t2, 1.7 * k, 1.4 * k), col), part(limb(w, m, 2.8 * k, 3.3 * k), col, shadeOf(w, m, 2.8 * k, 3.3 * k)), part(limb(m, tip, 3.2 * k, 2.3 * k), col, '', `<path d="M${P(add(m, mul(n, -1.2 * k)))}L${P(add(tip, mul(n, -1 * k)))}" stroke="${col[1]}" stroke-width="${.8}" vector-effect="non-scaling-stroke"/>`)];
  }
  // pied : cheville a, orteils vers t, plante du côté opposé au genou k
  function foot(a, t, k, col, front) {
    if (front) return [part(smooth([add(a, [-4.5, 1]), add(a, [0, -1]), add(a, [4.5, 1]), add(a, [5.5, 4.5]), add(a, [0, 5.6]), add(a, [-5.5, 4.5])]), col)];
    const x = nrm(sub(t, a)); let y = perp(x); if (dot(y, sub(k, a)) > 0) y = mul(y, -1);
    const s = len(sub(t, a)) / 13, L = ([u, v]) => add(a, add(mul(x, u * s), mul(y, v * s)));
    const pts = [[-3.2, -6.5], [-5.4, -1.5], [-5.8, 2.6], [-4, 5.6], [0, 6.2], [5, 5.2], [10, 6], [14.4, 5.8], [16.6, 4.3], [16.3, 2.2], [13.6, 1.1], [8.6, -.8], [3.8, -3], [1.6, -6]].map(L);
    return [part(smooth(pts), col, '', col === SHOE ? '' : `<circle cx="${P(L([-.8, -1.6])).split(' ')[0]}" cy="${P(L([-.8, -1.6])).split(' ')[1]}" r="${1.9 * s}" fill="${col[1]}"/>`)];
  }
  // jambe : hanche → genou → cheville → orteils ; le mollet bombe vers l'arrière
  function leg(hip, [k, a, t], skin, cloth, pro, front) {
    const ant = (p, q) => { const u = nrm(sub(q, p)), f = nrm(sub(t, a)); const n = sub(f, mul(u, dot(f, u))); return dot(perp(u), n) > 0 ? 1 : -1; };
    const s1 = front ? 0 : ant(hip, k), s2 = front ? 0 : ant(k, a), bb = (s, A, B) => s > 0 ? [A, B] : s < 0 ? [B, A] : [.6, .6];
    const out = [];
    if (pro) {
      out.push(part(limb(hip, k, 7.6, 5.9, ...bb(s1, .5, .5)), cloth, shadeOf(hip, k, 7.6, 5.9)), part(limb(k, a, 5.6, 4.6), cloth, shadeOf(k, a, 5.6, 4.6)));
      out.push(...foot(a, t, k, SHOE, front));
    } else {
      out.push(...foot(a, t, k, skin, front));
      out.push(part(limb(hip, k, 7.3, 5.1, ...bb(s1, .9, .7)), skin, shadeOf(hip, k, 7.3, 5.1)), part(limb(k, a, 4.8, 3.1, ...bb(s2, .2, 2.1)), skin, shadeOf(k, a, 4.8, 3.1)));
      out.push(part(limb(hip, lerp(hip, k, .42), 8.1, 6.8), cloth, shadeOf(hip, lerp(hip, k, .42), 8.1, 6.8)));
    }
    return out;
  }
  // bras : épaule → coude → main (centre de la main en w)
  function arm(s, [e, w], skin, cloth, pro, side) {
    const d = nrm(sub(w, e)), wr = sub(w, mul(d, 4.2)), out = [];
    out.push(part(limb(s, e, 4, 3.3), skin, shadeOf(s, e, 4, 3.3)), part(limb(e, wr, 3.4, 2.5, .5, .5), skin, shadeOf(e, wr, 3.4, 2.5)));
    if (pro) out.push(part(limb(s, e, 4.7, 4.2), cloth, shadeOf(s, e, 4.7, 4.2)), part(limb(e, lerp(e, wr, .85), 4.2, 3.7), cloth, shadeOf(e, wr, 4.2, 3.7)));
    else out.push(part(limb(s, lerp(s, e, .55), 5, 4.4), cloth, shadeOf(s, lerp(s, e, .55), 5, 4.4)));
    out.push(...mitten(w, d, skin, side));
    return out;
  }
  // tronc vu de profil ou de face, du cou au bassin ; robe = blouse qui descend sur les cuisses
  function trunk(s, hip, w, from, to) {
    const u = nrm(sub(hip, s)), n = perp(u), L = len(sub(hip, s)), at = (t, k) => add(add(s, mul(u, t * L)), mul(n, k));
    const prof = [[-.06, .62], [.04, .96], [.28, 1], [.62, .86], [.86, .94], [1, 1]], ts = prof.filter(([t]) => t >= from - .01 && t <= to + .01);
    if (to > 1) ts.push([to, 1.05]);
    const pts = [...ts.map(([t, k]) => at(t, k * w)), at(to + .1, 0), ...ts.slice().reverse().map(([t, k]) => at(t, -k * w)), at(from - .08, 0)];
    return smooth(pts);
  }
  // tête : u vers le haut de la tête, f vers le visage ; vue de profil, de face ou de dos
  function head(c, u, f, view, hair) {
    const r = 9.6, an = v => Math.atan2(v[1], v[0]), sg = Math.sign(u[0] * f[1] - u[1] * f[0]) || 1, at = (a, R) => add(c, [Math.cos(a) * R, Math.sin(a) * R]);
    const parts = [], au = an(u), deg = Math.PI / 180;
    if (view === 'side') {
      const jaw = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; jaw.push(add(add(c, add(mul(f, 1.8), mul(u, -3.1))), add(mul(f, Math.cos(a) * 7.6), mul(u, Math.sin(a) * 7.1)))); }
      parts.push(part(circle(c, r), SKN, '', ''), part(smooth(jaw), SKN), part(circle(add(c, add(mul(f, 9.7), mul(u, -1.4))), 2), SKN));
      const hp = []; for (let a = 40; a >= -135; a -= 15) hp.push(at(au + sg * a * deg, r + 1.4));
      hp.push(add(c, add(mul(f, -4.2), mul(u, -3.6))), add(c, add(mul(f, -1.2), mul(u, 1.6))), add(c, add(mul(f, 3.5), mul(u, 5.6))));
      parts.push(part(smooth(hp), hair, '', `<ellipse cx="${P(add(c, add(mul(f, -1), mul(u, -1)))).split(' ')[0]}" cy="${P(add(c, add(mul(f, -1), mul(u, -1)))).split(' ')[1]}" rx="2.3" ry="2.8" fill="${SKN[1]}"/>` +
        `<circle cx="${P(add(c, add(mul(f, 5.6), mul(u, .8)))).split(' ')[0]}" cy="${P(add(c, add(mul(f, 5.6), mul(u, .8)))).split(' ')[1]}" r="1.1" fill="#2a2320"/>`));
    } else {
      const n = perp(u), hp = [];
      parts.push(part(circle(c, r), SKN));
      const span = view === 'back' ? 118 : 80;
      for (let a = -span; a <= span; a += 16) hp.push(at(au + a * deg, r + 1.4));
      hp.push(add(c, mul(u, view === 'back' ? -5 : 4.2)));
      let det = '';
      if (view === 'front') for (const k of [-3.3, 3.3]) { const e = add(c, add(mul(n, k), mul(u, -.4))); det += `<circle cx="${e[0].toFixed(2)}" cy="${e[1].toFixed(2)}" r="1.1" fill="#2a2320"/>`; }
      parts.push(part(smooth(hp), hair, '', det));
    }
    return parts;
  }
  // une personne : h tête, s épaules, hip bassin, l / l2 jambes (genou, cheville, orteils), a / a2 bras (coude, main)
  // view : 'side' (défaut), 'front', 'back' ; face : direction du visage (sinon vers les orteils) ; pro : le praticien
  const HANDS = [];
  function man(o) {
    const pr = o.pro, view = o.view || 'side', front = view !== 'side', u = nrm(sub(o.h, o.s));
    let f = o.face ? nrm(o.face) : o.l ? nrm(sub(o.l[2], o.l[1])) : [1, 0]; f = sub(f, mul(u, dot(f, u))); f = len(f) < .1 ? perp(u) : nrm(f);
    const top = pr ? COAT : TOP, topf = pr ? COATF : TOPF, bot = pr ? PANT : SHO, botf = pr ? PANTF : SHO, w = o.w || (front ? 13.5 : 10.5);
    const far = [], body = [], nearL = [], nearA = [];
    if (o.a2) far.push(...arm(o.s2 || o.s, o.a2, SKF, topf, pr, o.th2));
    if (o.l2) far.push(...leg(o.hip2 || o.hip, o.l2, SKF, botf, pr, front));
    if (o.l) nearL.push(...leg(o.hip1 || o.hip, o.l, SKN, bot, pr, front));
    body.push(part(limb(o.s, lerp(o.s, o.h, .62), 3.4, 3.2), SKN));
    if (pr) body.push(part(trunk(o.s, o.hip, w, -.06, 1.3), top, ''));
    else body.push(part(trunk(o.s, o.hip, w, -.06, .82), top), part(trunk(o.s, o.hip, w * 1.02, .7, 1), bot));
    body.push(...head(o.h, u, f, view, pr ? HAIRD : HAIRP));
    if (o.a) nearA.push(...arm(o.sa || o.s, o.a, SKN, top, pr, o.th));
    if (pr) { if (o.a) HANDS.push({ c: o.a[1], d: sub(o.a[1], o.a[0]), th: o.th }); if (o.a2) HANDS.push({ c: o.a2[1], d: sub(o.a2[1], o.a2[0]), th: o.th2 }); }
    return pr ? layer(far) + layer(nearL) + layer(body) + layer(nearA) : layer(far) + layer(body) + layer(nearL) + layer(nearA);
  }
  // une main du praticien qui arrive dans l'image (manche de blouse, poignet, main)
  const hand = (from, to, side, k = 1) => { const d = nrm(sub(to, from)), wr = sub(to, mul(d, 4.2 * k)), el = sub(wr, mul(d, 18 * k));
    return layer([part(limb(el, wr, 3.2 * k, 2.5 * k), SKN), part(limb(el, sub(wr, mul(d, 3 * k)), 4.4 * k, 3.8 * k), COAT, shadeOf(el, wr, 4.4 * k, 3.8 * k)), ...mitten(to, d, SKN, side, k)]); };
  // redessiner par-dessus le patient les mains du praticien posées sur lui
  const onTop = (...ps) => ps.map(p => { const h = HANDS.slice().sort((x, y) => len(sub(x.c, p)) - len(sub(y.c, p)))[0]; return h ? layer(mitten(h.c, h.d, SKN, h.th)) : ''; }).join('');
  const ik = (s, w, side = 1, L1 = 25, L2 = 23) => { const dx = w[0] - s[0], dy = w[1] - s[1], d = Math.hypot(dx, dy) || 1, D = Math.min(d, L1 + L2 - .1), a = (L1 * L1 - L2 * L2 + D * D) / (2 * D), h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), ux = dx / d, uy = dy / d;
    return [s[0] + ux * a - uy * h * side, s[1] + uy * a + ux * h * side]; };
  // le praticien debout derrière la table, penché vers le patient, mains en w1 et w2
  const doc = (x, lean, w1, w2, sd = [1, 1]) => { const s = [x - lean, 46 + Math.abs(lean) * .25];
    return man({ pro: 1, face: [-1, .6], h: [x - lean * 1.45, 30 + Math.abs(lean) * .45], s, hip: [x, 86], l: [[x - 1, 114], [x, 139], [x - 13, 140]], l2: [[x + 3, 114], [x + 4, 139], [x - 9, 140]],
      a: w1 && [ik(s, w1, sd[0]), w1], a2: w2 && [ik(s, w2, sd[1]), w2] }); };

  // ---------- décor ----------
  const table = (x1, x2, y = 96) => `<rect x="${x1 + 6}" y="${y + 8}" width="${x2 - x1 - 12}" height="4" rx="2" fill="#7b8794"/>` +
    `<path d="M${x1 + 12} ${y + 10}V141M${x2 - 12} ${y + 10}V141" stroke="#9aa5b1" stroke-width="3.2"/><path d="M${x1 + 6} 141H${x1 + 18}M${x2 - 18} 141H${x2 - 6}" stroke="#7b8794" stroke-width="3"/>` +
    `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="9" rx="4.5" fill="#6f8399" stroke="#4d5f73" stroke-width="1.2" vector-effect="non-scaling-stroke"/><rect x="${x1 + 3}" y="${y + 1.2}" width="${x2 - x1 - 6}" height="2.6" rx="1.3" fill="#8a9db1"/>`;
  const floor = (x1 = 10, x2 = 230, y = 142) => `<path class="fl" d="M${x1} ${y}H${x2}"/>`;
  const shadow = (x, w = 26, y = 142) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="2.6" fill="#000" opacity=".13"/>`;
  const wall = (x, w = 9) => `<rect x="${x}" y="2" width="${w}" height="140" fill="#c9bfae" stroke="#8f8573" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`;
  const dev = (d, extra = '') => `<path d="${d}" fill="${DEV[0]}" stroke="${DEV[2]}" stroke-width="1.6" vector-effect="non-scaling-stroke" ${extra}/>`;
  const rod = (a, b, w = 2.4, col = '#6b7686') => `<path d="M${P(a)}L${P(b)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;

  // ---------- repères en couleur ----------
  const S = v => +(v / K).toFixed(3);
  const ah = (x, y, a) => { const L = S(8.5), W = .5; return `<path class="ah" d="M${x + Math.cos(a) * S(1.5)} ${y + Math.sin(a) * S(1.5)}L${x - L * Math.cos(a - W)} ${y - L * Math.sin(a - W)}L${x - L * Math.cos(a + W)} ${y - L * Math.sin(a + W)}Z"/>`; };
  const ar = (x1, y1, x2, y2, two) => { const a = Math.atan2(y2 - y1, x2 - x1), d = `M${x1} ${y1}L${x2} ${y2}`;
    return `<path class="halo" d="${d}"/><path class="al" d="${d}"/>` + ah(x2, y2, a) + (two ? ah(x1, y1, a + Math.PI) : ''); };
  const arc = (cx, cy, r, a1, a2, two) => { const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)], [x1, y1] = p(a1), [x2, y2] = p(a2), big = Math.abs(a2 - a1) > 180 ? 1 : 0, sw = a2 > a1 ? 1 : 0, d = `M${x1} ${y1}A${r} ${r} 0 ${big} ${sw} ${x2} ${y2}`;
    const tg = a => (a + (sw ? 90 : -90)) * Math.PI / 180;
    return `<path class="halo" d="${d}"/><path class="al" d="${d}"/>` + ah(x2, y2, tg(a2)) + (two ? ah(x1, y1, tg(a1) + Math.PI) : ''); };
  const zone = (x, y, r = 10) => `<circle class="zn" cx="${x}" cy="${y}" r="${r}"/>`;
  const pt = (x, y, r = 4) => `<circle class="pt" cx="${x}" cy="${y}" r="${S(r)}"/>`;
  const tx = (x, y, t, an = 'middle', cls = 'lb') => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${an}" style="font-size:${S(/big/.test(cls) ? 22 : /sm/.test(cls) ? 10.5 : 13)}px;stroke-width:${S(3)}px">${t}</text>`;
  const dash = (...p) => `<path class="ds" d="M${p.map(P).join('L')}"/>`;
  const zz = (x, y, dx, dy) => { const d = `M${x} ${y}l${dx * .3} ${dy * .2}l${-dx * .15} ${dy * .25}l${dx * .4} ${dy * .25}l${-dx * .1} ${dy * .3}`; return `<path class="halo" d="${d}"/><path class="al" d="${d}"/>`; };   // éclair : douleur
  const eye = (x, y) => `<path class="ey" d="M${x - 9} ${y}Q${x} ${y + 7} ${x + 9} ${y}M${x - 6} ${y + 3}l-2 4M${x} ${y + 5}v4M${x + 6} ${y + 3}l2 4"/>`;   // yeux fermés
  const panel = (x, y, w, h, t) => `<rect class="pn" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>${t ? tx(x + w / 2, y + h - 6, t, 'middle', 'lb sm') : ''}`;

  // ---------- postures de base ----------
  const STAND = (x, o = {}) => shadow(x + 5) + man({ h: [x, 22], s: [x, 41], hip: [x, 80], l: [[x + 1, 110], [x, 136], [x + 13, 138]], l2: [[x - 2, 110], [x - 3, 136], [x + 10, 138]], a: [[x + 2, 60], [x + 4, 79]], a2: [[x - 1, 60], [x, 79]], ...o });
  const BACK = (x, o = {}) => shadow(x, 34) + man({ view: 'back', h: [x, 22], s: [x, 40], hip: [x, 82], hip1: [x - 7, 84], hip2: [x + 7, 84], sa: [x - 15, 45], s2: [x + 15, 45],
    l: [[x - 8, 111], [x - 8, 136], [x - 10, 138]], l2: [[x + 8, 111], [x + 8, 136], [x + 10, 138]], a: [[x - 19, 64], [x - 20, 82]], a2: [[x + 19, 64], [x + 20, 82]], ...o });
  const SUP = (o = {}) => man({ h: [34, 82], s: [52, 85], hip: [104, 86], l: [[138, 88], [168, 89], [170, 77]], l2: [[138, 87], [168, 88], [170, 76]], a2: [[76, 90], [96, 90]], ...o });
  const SEAT = (o = {}) => man({ h: [80, 28], s: [82, 46], hip: [86, 86], l: [[114, 88], [116, 126], [129, 131]], l2: [[108, 86], [93, 120], [104, 127]], a: [[87, 66], [99, 84]], ...o });
  const bend = (x, o = {}) => shadow(x + 6) + man({ face: [-.4, 1], h: [x + 66, 86], s: [x + 50, 76], hip: [x + 2, 78], l: [[x + 3, 108], [x + 4, 136], [x + 17, 138]], l2: [[x, 108], [x, 136], [x + 13, 138]], a: [[x + 52, 99], [x + 54, 118]], a2: [[x + 48, 99], [x + 50, 118]], ...o });
  const front = (x, legs, o = {}) => shadow(x, 34) + man({ view: 'front', h: [x, 22], s: [x, 40], hip: [x, 82], hip1: [x - 7, 84], hip2: [x + 7, 84], sa: [x - 15, 45], s2: [x + 15, 45], l: legs[0], l2: legs[1], a: [[x - 19, 64], [x - 20, 82]], a2: [[x + 19, 64], [x + 20, 82]], ...o });
  const SEATT = o => table(16, 110) + SEAT(o);

  // pied vu de profil (orteils vers la droite), cheville en (ax, ay) ; med : côté interne (voûte)
  const footSide = (ax, ay, s = 1, med, top = -64) => { const Q = (x, y) => [ax + x * s, ay + y * s];
    const pts = [[-11, top], [-9.5, -12], [-14, 2], [-17, 16], [-14, 26], [-4, 28.5], [8, 27], [med ? 22 : 22, med ? 22.5 : 27], [36, 26.5], [50, 28], [59, 26], [61, 20], [55, 16], [40, 10], [24, 0], [12, -9], [10, top]].map(([x, y]) => Q(x, y));
    const m = Q(med ? 1 : -1, -2);
    return layer([part(smooth(pts), SKN, '', `<circle cx="${m[0]}" cy="${m[1]}" r="${5 * s}" fill="${SKN[1]}"/><path d="M${P(Q(52, 17))}Q${P(Q(55, 22))} ${P(Q(52, 27))}" stroke="${SKN[1]}" stroke-width="1" fill="none" vector-effect="non-scaling-stroke"/>`)]); };
  // pied vu de dessus ou de dessous (orteils en haut) ; hallux à gauche
  const footTop = (cx, cy, s = 1, tv = [0, 0]) => { const Q = (x, y) => [cx + x * s, cy + y * s];
    const sole = [[-2, 58], [-16, 52], [-18, 34], [-16, 16], [-22, -2], [-23, -20], [-16, -36], [2, -41], [18, -38], [25, -26], [22, -4], [15, 18], [15, 40], [10, 55]].map(([x, y]) => Q(x, y));
    const toes = [[-14, -50 + tv[0], 8.6], [1, -54 + tv[1], 5.8], [11, -52, 5], [19, -47, 4.4], [25, -40, 3.9]];
    return layer([...toes.map(([x, y, r]) => part(circle(Q(x, y), r * s), SKN)), part(smooth(sole), SKN, '', `<path d="M${P(Q(-12, -28))}Q${P(Q(4, -32))} ${P(Q(20, -26))}" stroke="${SKN[1]}" stroke-width="1" fill="none" vector-effect="non-scaling-stroke"/>`)]); };
  // jambe et talon vus de derrière (cheville en cx, cy)
  const rear = (cx, cy) => layer([part(smooth([[cx - 13, cy - 92], [cx - 11, cy - 40], [cx - 9, cy - 10], [cx - 13, cy + 6], [cx - 9, cy + 18], [cx, cy + 21], [cx + 9, cy + 18], [cx + 13, cy + 6], [cx + 9, cy - 10], [cx + 12, cy - 40], [cx + 13, cy - 92]]), SKN, '',
    `<circle cx="${cx - 11}" cy="${cy - 7}" r="4" fill="${SKN[1]}"/><circle cx="${cx + 11}" cy="${cy - 4}" r="4" fill="${SKN[1]}"/>`)]);

  const D = [], CAM = {};
  // ---------- 1. Rachis ----------
  D[1] = () => floor() + BACK(100) + hand([150, 0], [104, 5]) + `<path class="al" d="M100 8V128"/><circle class="pt" cx="100" cy="131" r="4.5"/>` +
    pt(100, 37) + pt(100, 86) + tx(116, 38, 'C7', 'start') + tx(124, 90, 'pli interfessier', 'start') + tx(116, 132, 'entre les talons', 'start') + tx(40, 20, 'vu de dos', 'middle', 'lb sm');
  const docS = (x, a) => shadow(x + 4) + man({ pro: 1, h: [x, 26], s: [x, 45], hip: [x, 86], l: [[x, 113], [x, 138], [x + 13, 139]], l2: [[x - 3, 113], [x - 4, 138], [x + 9, 139]], a, a2: [[x - 2, 66], [x + 2, 84]] });
  D[2] = () => floor() + docS(34, [[44, 64], [50, 80]]) + bend(100) + dash([44, 24], [130, 58]) + `<path class="halo" d="M120 64Q133 50 146 62"/><path class="al" d="M120 64Q133 50 146 62"/>` + tx(140, 44, 'bosse d\'un côté ?') + tx(174, 132, 'penché à 90°', 'middle', 'lb sm');
  D[3] = () => floor() + bend(90) + dev('M117 60L149 56L150 63L118 67Z') + `<circle cx="133.5" cy="61.5" r="2.4" fill="#e8a33d"/>` + hand([96, 30], [116, 60]) + hand([176, 34], [151, 56], -1) + tx(133, 40, 'scoliomètre sur la bosse') + tx(56, 118, '5° : surveiller · 7° : radio', 'middle', 'lb sm');
  CAM[3] = [60, 20, 160];
  D[4] = () => floor() + STAND(56) + pt(46, 78) + pt(46, 60) + `<path class="al" d="M41 60V78"/>` + tx(37, 72, '10', 'end') + tx(40, 92, 'S1', 'end', 'lb sm') +
    bend(136) + pt(140, 70) + pt(170, 64) + `<path class="al" d="M140 62L170 56"/>` + tx(156, 48, '14-15 cm') + ar(90, 64, 116, 64) + tx(103, 56, 'penche', 'middle', 'lb sm');
  D[5] = () => floor() + STAND(56) + pt(47, 44) + pt(46, 74) + `<path class="al" d="M41 44V74"/>` + tx(37, 63, '30', 'end') + tx(40, 38, 'C7', 'end', 'lb sm') +
    bend(136) + pt(184, 72) + pt(146, 74) + `<path class="al" d="M146 64L184 62"/>` + tx(165, 52, '32-34 cm') + ar(90, 64, 116, 64);
  D[6] = () => floor() + shadow(106) + man({ face: [-.3, 1], h: [128, 114], s: [122, 100], hip: [100, 74], l: [[101, 106], [102, 136], [115, 138]], l2: [[98, 106], [98, 136], [111, 138]], a: [[134, 116], [140, 128]], a2: [[130, 116], [136, 128]] }) +
    `<path class="al" d="M141 133V142"/>` + tx(150, 124, 'doigts → sol', 'start') + tx(150, 108, 'norme : 0 cm', 'start', 'lb sm') + zone(86, 94, 14);
  D[7] = () => table(16, 112) + man({ face: [0, 1], h: [180, 86], s: [160, 86], hip: [112, 86], l: [[78, 89], [44, 89], [34, 97]], l2: [[78, 87], [44, 87], [34, 95]], a: [[150, 98], [143, 88]], a2: [[148, 96], [141, 86]] }) +
    hand([70, 46], [62, 80]) + hand([50, 46], [42, 80]) + zone(138, 80, 16) + tx(150, 58, '120 à 180 s') + dash([112, 66], [198, 66]) + tx(52, 40, 'jambes tenues', 'middle', 'lb sm');

  // ---------- 2. Hanche ----------
  D[8] = () => table(26, 124) + man({ h: [40, 82], s: [58, 85], hip: [118, 86], l: [[152, 90], [150, 124], [162, 129]], l2: [[94, 54], [118, 50], [126, 40]], a: [[80, 70], [94, 56]] }) +
    dash([118, 90], [182, 90]) + tx(196, 94, '0°', 'start') + arc(152, 90, 14, 92, 172) + tx(170, 116, '≥ 90°', 'start') + zone(118, 80, 12);
  const trend = (x, tilt, lab) => shadow(x, 34) + man({ view: 'back', h: [x, 22], s: [x, 40], hip: [x, 82], hip1: [x - 7, 84 - tilt * .2], hip2: [x + 7, 84 + tilt], sa: [x - 15, 45], s2: [x + 15, 45],
    l: [[x - 8, 111], [x - 8, 136], [x - 10, 138]], l2: [[x + 9, 104 + tilt], [x + 11, 120 + tilt], [x + 13, 122 + tilt]], a: [[x - 19, 64], [x - 20, 82]], a2: [[x + 19, 64], [x + 20, 82]] }) +
    `<path class="halo" d="M${x - 22} ${82 - tilt * .2}L${x + 22} ${86 + tilt}"/><path class="al" d="M${x - 22} ${82 - tilt * .2}L${x + 22} ${86 + tilt}"/>` + dash([x - 26, 82], [x + 28, 82]) + tx(x, 12, lab, 'middle', 'lb sm');
  D[9] = () => floor() + trend(66, 0, 'NORMAL') + trend(170, 10, 'POSITIF') + zone(160, 76, 9) + tx(204, 108, 'tombe', 'start') + ar(200, 92, 200, 104) + tx(120, 149, 'vu de dos · appui sur la jambe gauche', 'middle', 'lb sm');
  D[10] = () => doc(156, 8, [128, 50], [102, 74], [1, -1]) + table(16, 196) + SUP({ l: [[128, 58], [140, 84], [150, 87]] }) + onTop([128, 50], [100, 74]) + ar(128, 26, 128, 40) + tx(84, 62, 'EIAS bloquée', 'end', 'lb sm') + tx(160, 66, '« 4 »', 'start') + zone(104, 80, 9);
  CAM[10] = [40, 10, 190];
  D[11] = () => doc(160, 6, [108, 40], [140, 54], [1, 1]) + table(16, 196) + SUP({ l: [[106, 46], [140, 48], [146, 38]] }) + onTop([108, 40], [140, 54]) + arc(140, 48, 18, -40, 60) + tx(118, 20, 'adduction + rotation interne', 'middle', 'lb sm') + zone(100, 78, 10) + tx(74, 66, 'aine ?', 'middle');
  CAM[11] = [40, 8, 190];
  D[12] = () => doc(150, 4, [132, 80], [160, 82], [1, -1]) + table(16, 196) + SUP() + onTop([132, 80], [160, 82]) + arc(146, 88, 22, 200, 340, 1) + tx(146, 52, 'roule dedans / dehors') + zone(102, 84, 11);
  CAM[12] = [40, 14, 180];
  D[13] = () => doc(190, 12, [162, 48], [134, 60], [-1, 1]) + table(16, 196) + SUP({ l: [[130, 66], [156, 46], [166, 34]] }) + onTop([134, 60]) + `<path class="ds" d="M150 88A46 46 0 0 0 136 54"/>` + tx(150, 82, '30-60°', 'start') + zz(116, 74, 30, 14) + tx(64, 60, 'douleur qui descend ?', 'middle', 'lb sm');
  D[14] = () => table(16, 196) + SUP({ l: [[128, 54], [150, 88], [162, 90]], l2: [[124, 62], [150, 87], [162, 89]] }) + dash([114, 45], [152, 45]) + dash([112, 53], [152, 53]) + tx(156, 48, 'même hauteur ?', 'start') + zone(126, 54, 9);
  CAM[14] = [40, 10, 180];
  D[15] = () => floor() + BACK(84) + dev('M86 138h22v5h-22z') + dash([54, 82], [114, 82]) + tx(84, 12, 'crêtes iliaques de niveau ?', 'middle', 'lb sm') + tx(112, 134, 'cale', 'start', 'lb sm') +
    panel(146, 22, 86, 98, 'mètre ruban') + `<path class="al" d="M164 36V102"/>` + pt(164, 36) + pt(164, 102) + tx(172, 40, 'EIAS', 'start', 'lb sm') + tx(172, 104, 'malléole', 'start', 'lb sm') + tx(172, 72, 'D = G ?', 'start', 'lb sm');

  // ---------- 3. Genou ----------
  D[16] = () => floor() + front(64, [[[60, 111], [52, 136], [50, 138]], [[68, 111], [76, 136], [78, 138]]]) + ar(52, 128, 76, 128, 1) + tx(64, 149, 'VALGUM (X) : DIM', 'middle', 'lb sm') +
    front(176, [[[163, 111], [171, 136], [169, 138]], [[189, 111], [181, 136], [183, 138]]]) + ar(164, 106, 188, 106, 1) + tx(176, 149, 'VARUM (O) : DIC', 'middle', 'lb sm');
  D[17] = () => doc(160, 6, [130, 52], [152, 84], [1, 1]) + table(16, 196) + SUP({ l: [[128, 56], [150, 88], [162, 90]] }) + onTop([130, 52]) + pt(128, 57, 4) + ar(152, 38, 172, 60) + tx(176, 40, 'je tends', 'start') + tx(92, 40, 'pouce : épicondyle latéral', 'middle', 'lb sm') + zone(128, 57, 12) + tx(92, 52, 'douleur vers 30° ?', 'middle', 'lb sm');
  CAM[17] = [60, 18, 170];
  D[18] = () => floor() + shadow(112) + man({ h: [110, 26], s: [110, 44], hip: [106, 84], l: [[118, 110], [108, 136], [121, 138]], l2: [[94, 104], [82, 120], [80, 131]], a: [[103, 64], [99, 82]] }) + arc(118, 110, 16, -60, 40, 1) + tx(150, 102, '0 → 60°', 'start') + zone(118, 110, 11) + tx(150, 120, 'douleur vers 30° ?', 'start', 'lb sm');
  CAM[18] = [40, 14, 180];
  D[19] = () => doc(160, 6, [120, 72], [148, 92], [1, -1]) + table(16, 196) + SUP({ l: [[134, 72], [166, 86], [170, 74]] }) + onTop([120, 72]) + ar(156, 106, 156, 80) + tx(166, 112, 'tibia vers l\'avant', 'start', 'lb sm') + tx(134, 56, '20-30°') + zone(134, 76, 10) + tx(84, 64, 'arrêt dur ?', 'middle');
  CAM[19] = [56, 24, 170];
  D[20] = () => table(16, 196) + SUP({ l: [[128, 50], [150, 88], [162, 90]] }) + man({ pro: 1, face: [-1, .3], h: [176, 30], s: [174, 48], hip: [170, 86], l: [[198, 92], [200, 126], [213, 130]], a: [[152, 60], [137, 54]], a2: [[156, 66], [141, 62]] }) +
    ar(152, 36, 137, 50) + tx(150, 22, 'pousse le tibia en arrière', 'middle', 'lb sm') + tx(200, 146, 'assis sur le pied', 'middle', 'lb sm') + zone(129, 52, 10);
  CAM[20] = [56, 10, 180];

  // ---------- 4. Cheville ----------
  D[21] = () => SEATT() + hand([152, 104], [120, 113], -1) + hand([152, 144], [113, 138]) + ar(126, 146, 148, 146) + tx(144, 124, 'pied en avant', 'start') + tx(144, 100, 'jambe tenue', 'start', 'lb sm') + zone(122, 127, 10);
  CAM[21] = [70, 74, 116];
  D[22] = () => SEATT() + hand([152, 104], [120, 112], -1) + hand([148, 146], [113, 138]) + arc(115, 128, 18, 10, 120, 1) +
    panel(152, 6, 84, 138, 'vu de derrière') + `<g transform="rotate(-14 194 112)" opacity=".35">${rear(194, 112)}</g>` + rear(194, 112) + arc(194, 112, 26, 200, 250) + tx(194, 18, 'varus / valgus', 'middle', 'lb sm');
  D[23] = () => table(16, 196) + SUP({ l: [[128, 54], [150, 88], [162, 90]] }) + hand([170, 50], [149, 66], -1) + hand([110, 94], [129, 79]) + ar(172, 50, 157, 60) + ar(110, 94, 123, 85) + zone(150, 90, 9) + zz(160, 100, 10, 14) + tx(186, 106, 'mal à la cheville ?', 'middle', 'lb sm') + tx(150, 30, 'serrer au milieu du mollet', 'middle', 'lb sm');
  CAM[23] = [70, 18, 150];
  D[24] = () => SEATT() + hand([152, 102], [120, 112], -1) + hand([162, 150], [127, 136]) + arc(122, 132, 20, -150, -20) + tx(146, 98, 'rotation externe', 'start') + zone(118, 124, 9) + tx(146, 112, 'jambe tenue', 'start', 'lb sm');
  CAM[24] = [70, 74, 116];
  D[25] = () => table(16, 156) + man({ face: [0, 1], h: [28, 86], s: [46, 87], hip: [98, 87], l: [[130, 89], [164, 89], [168, 102]], l2: [[130, 87], [164, 87], [168, 100]], a: [[70, 93], [88, 93]] }) +
    hand([118, 54], [134, 79]) + hand([166, 54], [150, 79], -1) + ar(120, 66, 131, 76) + ar(164, 66, 153, 76) + arc(164, 89, 20, 40, 100) + tx(142, 40, 'serrer le mollet', 'middle', 'lb sm') + tx(186, 124, 'le pied bouge ?', 'middle');
  CAM[25] = [76, 34, 150];
  D[26] = () => panel(4, 4, 112, 112) + footSide(40, 70, .78) + `<path class="ds" d="M33 70V24"/>` + pt(33, 62) + pt(78, 88) + tx(60, 16, 'côté externe', 'middle', 'lb sm') + tx(84, 104, 'base M5', 'middle', 'lb sm') +
    panel(124, 4, 112, 112) + footSide(160, 70, .78, 1) + `<path class="ds" d="M153 70V24"/>` + pt(153, 62) + pt(178, 84) + tx(180, 16, 'côté interne', 'middle', 'lb sm') + tx(190, 104, 'naviculaire', 'middle', 'lb sm') +
    tx(16, 40, '6 cm', 'start', 'lb sm') + [0, 1, 2, 3].map(i => `<ellipse class="pt" cx="${70 + i * 30}" cy="${134 - (i % 2) * 8}" rx="9" ry="4"/>`).join('') + tx(196, 136, '4 pas', 'start');
  D[27] = () => floor() + wall(206) + shadow(160, 60) + man({ h: [150, 24], s: [148, 41], hip: [144, 82], l: [[196, 98], [168, 134], [194, 138]], l2: [[128, 132], [100, 136], [92, 139]], a: [[172, 54], [201, 52]], a2: [[170, 50], [200, 46]] }) +
    pt(196, 98) + pt(166, 138) + ar(195, 147, 206, 147, 1) + tx(190, 148, '≥ 10 cm', 'end') + tx(152, 126, 'talon au sol', 'end', 'lb sm');
  D[28] = () => footSide(100, 70, 1.25) + hand([64, 4], [94, 50], 0, 1.6) + hand([30, 124], [78, 102], 0, 1.6) + arc(84, 100, 22, 140, 230, 1) + pt(118, 82, 5) + zone(118, 82, 11) + tx(150, 70, 'sinus du tarse', 'start') + tx(64, 38, 'talus fixé', 'end', 'lb sm');

  // ---------- 5. Avant-pied ----------
  D[29] = () => footSide(50, 60, 1.35) + hand([118, 30], [104, 68], 0, 1.6) + hand([168, 50], [134, 78], -1, 1.6) + ar(148, 100, 148, 70, 1) + pt(120, 86) + zone(120, 86, 10) + tx(160, 84, 'P1 haut / bas', 'start') + tx(100, 140, '2e MTP', 'middle');
  D[30] = () => footTop(120, 82, 1.1) + ar(62, 36, 92, 40) + ar(182, 42, 152, 46) + pt(125, 30, 5) + zone(125, 30, 11) + ar(125, 72, 125, 44) + tx(125, 14, '« clic ! »') + tx(50, 60, 'serrer', 'middle', 'lb sm') + tx(150, 76, 'doigt : 3e espace', 'start', 'lb sm');
  D[31] = () => [['palper', 0], ['étirer', 1], ['contrarier', 2]].map(([t, i]) => { const x = 4 + i * 78;
    return panel(x, 6, 74, 138, `${i + 1}. ${t}`) + footSide(x + 24, 72, .62, 1) + (i === 0 ? hand([x + 66, 36], [x + 20, 80], 0, 1.2) + pt(x + 16, 84) : i === 1 ? arc(x + 30, 72, 30, -10, -60) : hand([x + 70, 120], [x + 58, 86], -1, 1.2) + ar(x + 46, 104, x + 46, 80) + ar(x + 62, 62, x + 62, 80)); }).join('');
  D[32] = () => panel(4, 6, 112, 138, 'Tinel : taper') + footSide(44, 72, .8, 1) + rod([72, 18], [50, 56], 3.4) + dev('M38 53l16 -6l4 9l-16 6z') + pt(40, 70) + zz(46, 82, 14, 20) +
    panel(124, 6, 112, 138, 'Phalen : 60 s') + `<g transform="rotate(25 164 64)">${footSide(164, 64, .8, 1)}</g>` + arc(170, 70, 30, 0, 50) + tx(196, 40, 'FP + inversion', 'middle', 'lb sm');

  // ---------- 6. Diabète ----------
  D[33] = () => footTop(90, 84, 1.1) + [[-14, -50], [-15, -18], [17, -10]].map(([x, y], i) => pt(90 + x * 1.1, 84 + y * 1.1, 5) + tx(90 + x * 1.1 + (i === 2 ? 12 : -12), 84 + y * 1.1 + 4, i + 1, i === 2 ? 'start' : 'end')).join('') +
    rod([198, 38], [162, 68], 6, '#4b5563') + `<path class="halo" d="M162 68Q150 82 132 72"/><path class="al" d="M162 68Q150 82 132 72"/>` + tx(190, 98, '10 g : il se plie', 'middle', 'lb sm') + eye(196, 130) + tx(196, 120, 'yeux fermés', 'middle', 'lb sm');
  D[34] = () => footSide(60, 66, 1.25, 1) + rod([130, 50], [130, 80], 4.5, '#8b95a3') + `<path d="M120 22V42Q120 50 130 50Q140 50 140 42V22" stroke="#8b95a3" stroke-width="4.5" fill="none"/>` + pt(130, 84, 5) +
    `<path class="al" d="M110 26q-6 6 0 12M150 26q6 6 0 12"/>` + tx(160, 46, '128 Hz', 'start') + pt(62, 62) + tx(60, 34, 'malléole', 'middle', 'lb sm') + tx(146, 108, 'sur l\'hallux', 'start', 'lb sm') + eye(30, 132) + tx(30, 122, 'yeux fermés', 'middle', 'lb sm');
  D[35] = () => footTop(110, 84, 1.1) + rod([40, 30], [82, 50], 2.6, '#c9ced6') + `<ellipse cx="85" cy="51.5" rx="5.5" ry="3.8" fill="#fff" stroke="#9aa3ad" stroke-width="1"/>` + tx(36, 22, 'toucher', 'middle') +
    rod([190, 40], [142, 69], 3.6, '#6b7686') + pt(140, 70, 3) + tx(196, 32, 'piquer', 'middle') + eye(196, 120) + tx(196, 110, 'au hasard', 'middle', 'lb sm');
  D[36] = () => panel(4, 6, 112, 138, 'pédieux') + footTop(58, 82, .9) + pt(52, 46, 5) + hand([24, 120], [50, 56], 0, 1.3) + `<path class="al" d="M66 30l4-6 4 10 4-8 4 4"/>` +
    panel(124, 6, 112, 138, 'tibial postérieur') + footSide(160, 70, .8, 1) + pt(152, 74, 5) + hand([206, 122], [158, 82], -1, 1.3) + `<path class="al" d="M180 50l4-6 4 10 4-8 4 4"/>`;
  D[37] = () => table(16, 196) + SUP() + dev('M64 82h16v13h-16z') + dev('M154 80h13v14h-13z') + rod([188, 50], [170, 84], 5, '#4b5563') +
    tx(72, 70, 'bras') + tx(164, 64, 'cheville') + tx(120, 130, 'IPS = cheville ÷ bras', 'middle') + tx(120, 24, '0,90 – 1,30 = normal', 'middle', 'lb sm');

  // ---------- 7. Fonctionnels ----------
  D[38] = () => { const p = (i, t, d) => { const x = 4 + (i % 3) * 78, y = i < 3 ? 4 : 78; return panel(x, y, 74, 70, t) + `<g transform="translate(${x} ${y})">${d}</g>`; };
    const fore = (a, b) => part(limb(a, b, 4.4, 3.4), SKN, shadeOf(a, b, 4.4, 3.4));
    return p(0, '5e doigt > 90°', layer([fore([2, 44], [36, 44]), ...mitten([43, 44], [1, 0], SKN, 1, 1.3), part(limb([46, 40], [44, 22], 1.6, 1.3), SKN)]) + arc(46, 42, 13, -90, -15)) +
      p(1, 'pouce sur l\'avant-bras', layer([fore([4, 32], [42, 32]), ...mitten([47, 40], [.4, 1], SKN, -1, 1.3), part(limb([44, 34], [36, 37], 1.8, 1.5), SKN)]) + ar(30, 18, 38, 30)) +
      p(2, 'coude > 10°', layer(arm([6, 26], [[34, 34], [62, 26]], SKN, TOP, false)) + dash([34, 34], [66, 42]) + arc(34, 34, 16, -24, 18)) +
      p(3, 'genou > 10°', layer(leg([6, 20], [[34, 32], [60, 24], [64, 12]], SKN, SHO)) + dash([34, 32], [64, 42]) + arc(34, 32, 16, -22, 18)) +
      p(4, 'paumes au sol', `<g transform="translate(4 -12) scale(.5)">${man({ face: [-.3, 1], h: [96, 112], s: [90, 96], hip: [64, 56], l: [[65, 88], [66, 116], [78, 118]], l2: [[62, 88], [62, 116], [74, 118]], a: [[96, 108], [98, 118]] })}</g>`) +
      tx(196, 118, '/ 9', 'middle', 'big') + tx(196, 136, 'adulte ≥ 5', 'middle', 'lb sm');
  };
  D[39] = () => floor() + `<path class="al" d="M86 142V132M154 142V132"/>` + tx(120, 149, '30 cm', 'middle', 'lb sm') + ar(92, 137, 148, 137, 1) +
    man({ view: 'front', h: [124, 24], s: [123, 42], hip: [121, 80], hip1: [114, 82], hip2: [128, 82], sa: [109, 46], s2: [137, 46], l: [[116, 104], [120, 122], [116, 124]], l2: [[132, 98], [140, 112], [144, 110]], a: [[106, 60], [104, 74]], a2: [[140, 60], [143, 74]] }) +
    `<path class="ds" d="M80 120Q120 70 160 120"/>` + tx(40, 50, '30 s', 'middle', 'big') + tx(40, 70, 'aller-retour', 'middle', 'lb sm');
  D[40] = () => floor() + shadow(96) + man({ h: [92, 30], s: [92, 47], hip: [90, 84], l: [[98, 110], [90, 136], [103, 138]], l2: [[118, 108], [146, 128], [160, 136]], a: [[80, 66], [90, 82]] }) +
    dev('M160 131h16v10h-16z') + ar(150, 122, 170, 122) +
    panel(178, 6, 58, 60, 'le Y') + `<path class="al" d="M207 30V12M207 30L192 48M207 30L222 48"/>` + tx(207, 10, 'ant', 'middle', 'lb sm') + tx(188, 58, 'PM', 'middle', 'lb sm') + tx(226, 58, 'PL', 'middle', 'lb sm');
  D[41] = () => floor() + `<path class="al" d="M30 132V142"/>` + shadow(46) + man({ h: [44, 40], s: [46, 57], hip: [44, 92], l: [[56, 114], [40, 136], [52, 138]], l2: [[30, 104], [24, 120], [20, 125]], a: [[34, 72], [27, 84]] }) +
    `<path class="ds" d="M60 90Q120 20 176 80"/>` + shadow(184) + man({ h: [186, 24], s: [184, 41], hip: [180, 80], l: [[190, 108], [180, 136], [193, 138]], l2: [[168, 98], [160, 114], [156, 123]], a: [[196, 60], [204, 50]] }) +
    ar(30, 147, 180, 147, 1) + tx(105, 136, 'distance, 3 essais') + tx(206, 118, 'tenir 2 s', 'start', 'lb sm');


  // =================== le bilan du pied : 15 dessins (BILAN_PIC) ===================
  const BD = [], BCAM = {};
  const mirror = (cx, g) => `<g transform="matrix(-1 0 0 1 ${2 * cx} 0)">${g}</g>`;
  const rotg = (a, x, y, g, op) => `<g transform="rotate(${a} ${x} ${y})"${op ? ` opacity="${op}"` : ''}>${g}</g>`;
  const bubble = (x, y, w, t, tail = 'left') => `<path d="M${x + 8} ${y}h${w - 16}q8 0 8 8v6q0 8 -8 8h${tail === 'right' ? -(w - 30) : -8}l${tail === 'right' ? -6 : -6} 7l1 -7H${x + 8}q-8 0 -8 -8v-6q0 -8 8 -8Z" style="fill:var(--card);stroke:var(--c)" stroke-width="1.6" vector-effect="non-scaling-stroke"/>` + tx(x + w / 2, y + 15, t);
  const chair = (x1, x2, y, back) => `<path d="M${x1 + 4} ${y + 6}V141M${x2 - 4} ${y + 6}V141" stroke="#8b7b69" stroke-width="3"/><rect x="${x1}" y="${y}" width="${x2 - x1}" height="7" rx="3" fill="#a8927a" stroke="#6e5d4c" stroke-width="1.2" vector-effect="non-scaling-stroke"/>` +
    (back != null ? `<rect x="${back - 3}" y="${y - 40}" width="6" height="46" rx="3" fill="#a8927a" stroke="#6e5d4c" stroke-width="1.2" vector-effect="non-scaling-stroke"/>` : '');
  // empreinte au podoscope (orteils en haut, hallux à gauche) : n normal, p1..p3 plat, c1..c3 creux
  const print = (cx, cy, s, kind) => { const Q = ([x, y]) => [cx + x * s, cy + y * s], f = 'style="fill:var(--ink)" opacity=".85"';
    const fore = [[-23, -20], [-16, -36], [2, -41], [18, -38], [25, -26]], heelL = [[15, 40], [10, 55], [-2, 58], [-15, 52], [-17, 38]];
    const W = { n: 13, p1: 19, p2: 27, p3: 44, c1: 7 }[kind], gap = kind === 'c2' || kind === 'c3';
    let g = (kind === 'c3' ? '' : [[-14, -52, 7.4], [1, -55, 4.8], [10, -53, 4.2], [18, -48, 3.8], [24, -42, 3.3]].map(([x, y, r]) => { const c = Q([x, y]); return `<circle cx="${c[0]}" cy="${c[1]}" r="${r * s}" ${f}/>`; }).join(''));
    if (gap) g += `<path d="${smooth([...fore, [23, -10], [8, -6], [-12, -8]].map(Q))}" ${f}/><path d="${smooth([[15, 24], ...heelL, [-14, 26], [0, 22]].map(Q))}" ${f}/>`;
    else g += `<path d="${smooth([...fore, [22, -4], [16, 18], ...heelL, [-15, 26], [18 - W, 12], [16 - W * .9, -2], [-21, -10]].map(Q))}" ${f}/>`;
    return g; };
  // jambe vue de derrière, talon basculé de a degrés (a > 0 : le bas du talon part vers la droite de l'image)
  const rearT = (cx, cy, a, lift = 0) => { const pv = [cx, cy - 6 - lift];
    const leg = smooth([[cx - 14, cy - 96], [cx - 12, cy - 40], [cx - 9, cy - 8 - lift], [cx + 9, cy - 8 - lift], [cx + 12, cy - 40], [cx + 14, cy - 96]]);
    const heel = smooth([[cx - 10, cy - 14 - lift], [cx - 13, cy + 4 - lift], [cx - 8, cy + 18 - lift], [cx, cy + 21 - lift], [cx + 8, cy + 18 - lift], [cx + 13, cy + 4 - lift], [cx + 10, cy - 14 - lift]]);
    return layer([part(leg, SKN, '', `<circle cx="${cx - 11}" cy="${cy - 9 - lift}" r="3.6" fill="${SKN[1]}"/><circle cx="${cx + 11}" cy="${cy - 6 - lift}" r="3.6" fill="${SKN[1]}"/>`)]) +
      `<g transform="rotate(${-a} ${pv[0]} ${pv[1]})">${layer([part(heel, SKN, '', `<path d="M${cx - 6} ${cy + 8 - lift}Q${cx} ${cy + 12 - lift} ${cx + 6} ${cy + 8 - lift}" stroke="${SKN[1]}" stroke-width="1.2" fill="none" vector-effect="non-scaling-stroke"/>`)])}</g>`; };
  const heelAxis = (cx, cy, a, lift = 0) => { const pv = [cx, cy - 6 - lift], r = a * Math.PI / 180;
    return dash([cx, cy - 74 - lift], [cx, cy + 26 - lift]) + `<path class="halo" d="M${pv[0]} ${pv[1]}L${pv[0] + Math.sin(r) * 30} ${pv[1] + Math.cos(r) * 30}"/><path class="al" d="M${pv[0]} ${pv[1]}L${pv[0] + Math.sin(r) * 30} ${pv[1] + Math.cos(r) * 30}"/>`; };
  // orteil vu de côté : normal ou en griffe (MTP en extension, IPP en flexion)
  const toe = (x, y, claw) => { const pts = claw ? [[x + 40, y + 2], [x + 52, y - 13], [x + 59, y + 1], [x + 61, y + 13]] : [[x + 40, y + 4], [x + 56, y + 5], [x + 66, y + 8], [x + 73, y + 12]];
    const [a, b, c, d] = pts;
    return layer([part(smooth([[x - 6, y - 26], [x + 14, y - 14], [x + 38, y - 4], [x + 44, y + 6], [x + 38, y + 13], [x + 12, y + 15], [x - 6, y + 15]]), SKN, '', `<rect x="${x - 8}" y="${y - 30}" width="4" height="48" fill="${SKN[0]}"/>`), part(limb(a, b, 6, 5.4), SKN, shadeOf(a, b, 6, 5.4)), part(limb(b, c, 5.2, 4.8), SKN, shadeOf(b, c, 5.2, 4.8)), part(limb(c, d, 4.6, 3.9), SKN, '',
      `<path d="M${P(lerp(c, d, .35))}L${P(lerp(c, d, .95))}" stroke="#f3e3d6" stroke-width="3.2" stroke-linecap="round" transform="translate(${claw ? 2.5 : 0} ${claw ? 0 : -3})"/>`)]); };

  // ---------- avant l'examen ----------
  BD[1] = () => floor() + chair(48, 94, 98, 50) + chair(148, 196, 98, 194) +
    man({ h: [66, 40], s: [68, 58], hip: [72, 96], l: [[100, 98], [102, 134], [115, 138]], l2: [[98, 96], [98, 133], [111, 137]], a: [[78, 78], [92, 92]], a2: [[74, 78], [88, 90]] }) +
    man({ pro: 1, face: [-1, 0], h: [174, 38], s: [172, 56], hip: [170, 96], l: [[142, 98], [140, 134], [127, 138]], l2: [[144, 96], [144, 133], [131, 137]], a: [[160, 76], [148, 80]], a2: [[164, 74], [152, 72]] }) +
    dev('M140 64l14 -4l6 22l-14 4z') + bubble(120, 4, 112, 'Où avez-vous mal ?', 'left') + tx(70, 18, 'j\'écoute, j\'observe', 'middle', 'lb sm');
  BD[2] = () => { const p = (i, t) => panel(4 + i * 78, 6, 74, 138, t);
    return p(0, 'systématique') + footSide(30, 66, .55) + ar(16, 112, 62, 112) + tx(40, 128, 'arrière → avant', 'middle', 'lb sm') +
      p(1, 'bilatéral') + mirror(105, footTop(105, 74, .5)) + footTop(133, 74, .5) + tx(119, 124, 'les 2 pieds', 'middle', 'lb sm') +
      p(2, 'comparatif') + mirror(184, footTop(184, 74, .5)) + footTop(212, 74, .5) + tx(198, 26, '= ?', 'middle', 'big') + tx(198, 124, 'D comme G ?', 'middle', 'lb sm'); };
  // ---------- en décharge ----------
  BD[3] = () => { const ax = 38, ay = 70, s = .95, t = -18 * Math.PI / 180, R = ([x, y]) => [ax + (x * Math.cos(t) - y * Math.sin(t)) * s, ay + (x * Math.sin(t) + y * Math.cos(t)) * s], hb = R([-4, 28.5]), m1 = R([36, 26.5]);
    return panel(4, 6, 132, 138, 'dénivellation') + rotg(-18, ax, ay, footSide(ax, ay, s, 1)) + dash([hb[0] - 8, hb[1]], [m1[0] + 26, hb[1]]) + dash([m1[0] - 8, m1[1]], [m1[0] + 26, m1[1]]) + pt(hb[0], hb[1]) + pt(m1[0], m1[1]) +
      ar(m1[0] + 18, m1[1] + 1, m1[0] + 18, hb[1] - 1, 1) + tx(m1[0] + 14, hb[1] + 14, '2-2,5 cm', 'middle', 'lb sm') + tx(hb[0] + 6, hb[1] + 12, 'talon', 'middle', 'lb sm') + tx(m1[0], m1[1] - 8, 'tête M1', 'middle', 'lb sm') +
      panel(140, 6, 96, 138) + footTop(158, 90, .42, [-7, 6]) + footTop(188, 90, .42, [-2, 0]) + footTop(218, 90, .42, [5, -6]) + [[158, -7], [188, -2], [218, 5]].map(([x, d]) => dash([x - 12, 90 + (-58.6 + d) * .42], [x + 12, 90 + (-58.6 + d) * .42])).join('') +
      tx(158, 132, 'égyptien', 'middle', 'lb sm') + tx(188, 132, 'carré', 'middle', 'lb sm') + tx(218, 132, 'grec', 'middle', 'lb sm') + tx(188, 22, 'les orteils'); };
  BD[4] = () => { const cx = 74, cy = 80, s = 1.05, Q = (x, y) => [cx + x * s, cy + y * s], hk = (x, y, rx, ry) => `<ellipse cx="${Q(x, y)[0]}" cy="${Q(x, y)[1]}" rx="${rx}" ry="${ry}" fill="#ead39a" stroke="#b9974f" stroke-width="1.2" vector-effect="non-scaling-stroke"/>`;
    return footTop(cx, cy, s) + hk(-13, -27, 8, 6) + hk(18, -20, 6, 5) + hk(1, 45, 9, 7) +
      `<circle cx="168" cy="54" r="30" fill="${SKN[0]}" stroke="#6b7686" stroke-width="5"/><ellipse cx="168" cy="54" rx="17" ry="12" fill="#ead39a" stroke="#b9974f" stroke-width="1.4"/><path d="M190 76L210 98" stroke="#6b7686" stroke-width="7" stroke-linecap="round"/>` +
      dash(Q(-13, -27), [140, 46]) + tx(168, 102, 'durillon = hyperpression', 'middle', 'lb sm') + tx(168, 120, 'Shore : 20 souple · 35 ferme', 'middle', 'lb sm') + tx(168, 138, '+ ongles, grains de beauté (ABCDE)', 'middle', 'lb sm'); };
  BD[5] = () => { const p = (i, t) => panel(4 + i * 78, 6, 74, 138, t);
    return p(0, 'pédieux') + footTop(40, 78, .62) + pt(36, 58, 4.5) + hand([14, 136], [36, 62], 0, .9) + `<path class="al" d="M50 34l3-5 3 8 3-6 3 3"/>` +
      p(1, 'tibial post.') + footSide(108, 74, .58, 1) + pt(102, 78, 4.5) + hand([150, 132], [104, 82], -1, .9) + `<path class="al" d="M120 50l3-5 3 8 3-6 3 3"/>` +
      p(2, 'recoloration') + footSide(178, 70, .58, 1) + hand([232, 40], [210, 82], -1, .9) + pt(212, 88, 4) + tx(194, 30, '< 3 s', 'middle', 'big'); };
  BD[6] = () => layer([part(limb([96, -10], [110, 98], 15, 8.5, 0, 3.6), SKN, shadeOf([96, -10], [110, 98], 15, 8.5))]) + footSide(110, 104, .9, 1, -30) +
    `<path d="M86 24q5 6 -1 12t1 12q5 6 0 12M96 30q-4 8 2 14t0 14" stroke="#5b74c9" stroke-width="2.6" fill="none" stroke-linecap="round"/>` +
    hand([160, 82], [124, 98], -1) + `<ellipse cx="121" cy="100" rx="3.6" ry="2.4" fill="${SKN[1]}" stroke="${SKN[2]}" stroke-width=".8"/>` +
    `<circle class="pt" cx="130" cy="128" r="6"/><circle class="pt" cx="104" cy="48" r="6"/>` + `<text x="130" y="132" text-anchor="middle" style="font:700 9px sans-serif;fill:#fff">1</text><text x="104" y="52" text-anchor="middle" style="font:700 9px sans-serif;fill:#fff">2</text>` +
    ar(150, 128, 150, 30) + tx(156, 30, 'le sang remonte', 'start', 'lb sm') + tx(170, 112, 'godet', 'start') + tx(40, 30, 'varices ?', 'middle') + tx(66, 128, '1 voûte · 2 mollet · 3 cuisse', 'middle', 'lb sm');
  BD[7] = () => { const p = (i, t) => panel(4 + i * 78, 6, 74, 138, t);
    return p(0, 'monofilament') + footTop(40, 80, .62) + pt(32, 50, 4) + pt(32, 70, 4) + pt(52, 74, 4) + rod([72, 30], [58, 58], 4, '#4b5563') + `<path class="al" d="M58 58Q52 66 48 60"/>` +
      p(1, 'diapason') + footSide(102, 72, .6, 1) + rod([136, 50], [136, 70], 3.4, '#8b95a3') + `<path d="M130 32V44Q130 50 136 50Q142 50 142 44V32" stroke="#8b95a3" stroke-width="3.4" fill="none"/>` + pt(136, 74, 4) +
      p(2, 'réflexe achilléen') + footSide(196, 70, .62) + `<g transform="rotate(-30 180 72)">${rod([180, 72], [180, 40], 3, '#6b7686')}<rect x="172" y="66" width="16" height="9" rx="4" fill="#c0392b" stroke="#7a2318" stroke-width="1"/></g>` + pt(187, 76, 4) + tx(196, 30, 'S1', 'middle', 'big'); };
  BD[8] = () => { const ax = 104, ay = 74, foot = footSide(ax, ay, 1.05, 0, -8);
    return layer([part(limb([ax - 1, ay - 74], [ax, ay - 4], 10.5, 9.5), SKN, shadeOf([ax - 1, ay - 74], [ax, ay - 4], 10.5, 9.5))]) + rotg(-25, ax, ay, foot, .35) + rotg(40, ax, ay, foot, .35) + foot +
      arc(ax, ay, 66, -6, -30) + arc(ax, ay, 66, 16, 54) + tx(178, 26, 'FD 20-30°', 'start') + tx(150, 140, 'FP 30-50°', 'start') + tx(30, 120, 'MTP1 : ext. 50-60°', 'middle', 'lb sm'); };
  BD[9] = () => footSide(70, 70, 1.05) + hand([150, 30], [118, 80], -1) + ar(104, 48, 104, 66) + ar(86, 112, 86, 94) + tx(110, 42, 'je résiste', 'start', 'lb sm') + tx(78, 128, 'il pousse', 'middle', 'lb sm') +
    [0, 1, 2, 3, 4, 5].map(i => `<rect x="${170 + i * 10}" y="${110 - i * 13}" width="8" height="${12 + i * 13}" rx="2" style="fill:${i === 3 ? 'var(--c)' : 'color-mix(in srgb, var(--c) 30%, transparent)'}"/>` + tx(174 + i * 10, 136, i, 'middle', 'lb sm')).join('') + tx(194, 22, '3 = contre pesanteur', 'middle', 'lb sm');
  // ---------- en charge ----------
  BD[10] = () => floor(10, 230, 132) + rearT(70, 110, 5) + heelAxis(70, 110, 5) + tx(70, 146, 'normal : valgus ≤ 5°', 'middle', 'lb sm') +
    rearT(172, 110, 14) + heelAxis(172, 110, 14) + tx(172, 146, 'valgus > 5°', 'middle', 'lb sm') + tx(120, 14, 'vu de dos, debout', 'middle', 'lb sm');
  BD[11] = () => floor(10, 112, 122) + floor(128, 232, 122) + panel(4, 6, 112, 138, 'normal') + toe(18, 104) + panel(124, 6, 112, 138, 'griffe') + toe(138, 104, 1) +
    `<ellipse cx="190" cy="85" rx="5" ry="3" fill="#ead39a" stroke="#b9974f" stroke-width="1"/>` + tx(212, 70, 'cor', 'middle', 'lb sm') + hand([226, 40], [191, 82], -1, .9) + ar(206, 52, 196, 70) + tx(180, 30, 'je la redresse ?', 'middle', 'lb sm');
  BD[12] = () => { const L = [['n', 'normal'], ['p1', 'plat 1°'], ['p2', 'plat 2°'], ['p3', 'plat 3°'], ['c1', 'creux 1°'], ['c2', 'creux 2°'], ['c3', 'creux 3°']];
    return L.map(([k, t], i) => { const r = i < 4 ? 0 : 1, x = r ? 56 + (i - 4) * 64 : 30 + i * 60, y = r ? 104 : 32; return print(x, y, .42, k) + tx(x + 2, y + 36, t, 'middle', 'lb sm'); }).join(''); };
  // ---------- tests dynamiques ----------
  BD[13] = () => floor(10, 130) + shadow(62) + man({ h: [60, 26], s: [60, 44], hip: [58, 84], l: [[60, 110], [58, 136], [71, 138]], l2: [[82, 92], [82, 118], [94, 120]], a: [[50, 64], [44, 80]], a2: [[68, 62], [74, 78]] }) +
    panel(130, 6, 106, 138, 'pied creux souple') + print(158, 66, .5, 'c1') + ar(176, 66, 192, 66) + print(212, 66, .5, 'n') + tx(156, 116, 'avant', 'middle', 'lb sm') + tx(212, 116, 'en appui', 'middle', 'lb sm');
  BD[14] = () => { const pair = (cx, a, lift) => rearT(cx - 15, 110, a, lift) + mirror(cx + 15, rearT(cx + 15, 110, a, lift)) + heelAxis(cx - 15, 110, a, lift) + mirror(cx + 15, heelAxis(cx + 15, 110, a, lift));
    return floor(10, 230, 132) + pair(64, -9, 0) + tx(64, 146, 'debout : valgus', 'middle', 'lb sm') + pair(176, 9, 12) + tx(176, 146, 'sur pointe : varus', 'middle', 'lb sm') + ar(120, 110, 120, 86) + tx(120, 14, 'vu de dos', 'middle', 'lb sm'); };
  BD[15] = () => floor(10, 230, 101) + footSide(60, 66, 1.25, 1) + hand([172, 30], [136, 80], -1) + arc(126, 92, 18, -20, -80) + dash([62, 96], [86, 86], [110, 96]) + ar(88, 100, 88, 84) +
    tx(150, 52, 'je relève l\'hallux', 'start', 'lb sm') + tx(88, 120, 'l\'arche se creuse ?', 'middle');

  window.BILAN_PIC = n => { if (!BD[n]) return ''; const c = BCAM[n] || [0, 0, 240]; K = 240 / c[2]; HANDS.length = 0;
    return `<g transform="scale(${+K.toFixed(4)}) translate(${-c[0]} ${-c[1]})" fill="none" stroke-linecap="round" stroke-linejoin="round">${BD[n]()}</g>`; };

  window.CLIN_PIC = n => { if (!D[n]) return ''; const c = CAM[n] || [0, 0, 240]; K = 240 / c[2]; HANDS.length = 0;
    const svg = D[n](); return `<g transform="scale(${+K.toFixed(4)}) translate(${-c[0]} ${-c[1]})" fill="none" stroke-linecap="round" stroke-linejoin="round">${svg}</g>`; };
})();
