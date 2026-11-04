// Dessins des 41 tests d'examen clinique (SVG 240×150), d'après des schémas de référence de chaque test.
// Patient : peau, t-shirt clair, short. Praticien : blouse blanche (souvent seulement ses mains).
// En couleur de la section (var(--c)) : ce qui bouge (flèches), la zone examinée (cercle) et les repères.
(() => {
  const OL = '#2b2730', SK = '#f1c6a0', SK2 = '#d9a77f', SH = '#bcd6ee', PA = '#5f6f8a', WC = '#ffffff', TR = '#93a6c2', HR = '#5a4436';
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const pl = p => 'M' + p.map(q => q.map(v => +v.toFixed(1)).join(' ')).join('L');
  const dot = p => [p, [p[0] + .01, p[1]]];
  // un calque : tous les contours, puis toutes les couleurs (les articulations se fondent, le calque suivant passe devant)
  const layer = segs => segs.map(([p, w]) => `<path d="${pl(p)}" stroke="${OL}" stroke-width="${w + 4.5}"/>`).join('') + segs.map(([p, w, c]) => `<path d="${pl(p)}" stroke="${c}" stroke-width="${w}"/>`).join('');
  const leg = (hip, [k, a, t], sk, short = PA, pro) => pro ? [[[hip, k, a], 15, short], [[a, t], 9, '#3a3f4b']] : [[[hip, k, a], 14, sk], [[a, t], 9, sk], [[hip, lerp(hip, k, .42)], 18, short]];
  const arm = (s, [e, w], sk, sleeve = SH, long) => [[[s, e, w], 9, sk], [[s, long ? lerp(e, w, .8) : lerp(s, e, .55)], long ? 11 : 13, sleeve], [dot(w), 11, sk]];
  // une personne : h tête, s épaules, hip bassin, l / l2 jambes (genou, cheville, orteils), a / a2 bras (coude, poignet)
  function man(o) {
    const pr = o.pro, sk = SK, top = pr ? WC : SH, bot = pr ? TR : PA, far = [], mid = [], near = [];
    if (o.l2) far.push(...leg(o.hip2 || o.hip, o.l2, SK2, pr ? TR : PA, pr));
    if (o.a2) far.push(...arm(o.s2 || o.s, o.a2, SK2, top, pr));
    mid.push([[o.s, lerp(o.s, o.h, .55)], 9, sk], [[o.s, o.hip], o.w || 24, top], [[lerp(o.s, o.hip, .82), o.hip], (o.w || 24) + 1, bot], [dot(o.h), 22, sk]);
    if (pr) mid.push([[[o.h[0] - 7, o.h[1] - 5], [o.h[0] + 5, o.h[1] - 8]], 7, HR]);
    if (o.l) near.push(...leg(o.hip1 || o.hip, o.l, sk, bot, pr));
    if (o.a) near.push(...arm(o.sa || o.s, o.a, sk, top, pr));
    return layer(far) + layer(mid) + layer(near);
  }
  // une main du praticien qui arrive du bord : manche de blouse puis la main
  const hand = (from, to, w = 12) => { const d = Math.hypot(from[0] - to[0], from[1] - to[1]) || 1, f = [to[0] + (from[0] - to[0]) / d * 22, to[1] + (from[1] - to[1]) / d * 22];
    return layer([[[f, to], 11, WC], [dot(to), w + 2, SK]]); };
  const onTop = (...ps) => layer(ps.map(p => [dot(p), 12, SK]));
  // coude placé pour que la main tombe au bon endroit (bras de 25 + 23)
  const ik = (s, w, side = 1, L1 = 25, L2 = 23) => { const dx = w[0] - s[0], dy = w[1] - s[1], d = Math.hypot(dx, dy) || 1, D = Math.min(d, L1 + L2 - .1), a = (L1 * L1 - L2 * L2 + D * D) / (2 * D), h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), ux = dx / d, uy = dy / d;
    return [s[0] + ux * a - uy * h * side, s[1] + uy * a + ux * h * side]; };
  // le praticien debout derrière la table, penché vers le patient, mains en w1 et w2
  const doc = (x, lean, w1, w2, sd = [1, 1]) => { const s = [x - lean, 44 + Math.abs(lean) * .25];
    return man({ pro: 1, h: [x - lean * 1.45, 28 + Math.abs(lean) * .45], s, hip: [x, 84], l: [[x - 1, 113], [x, 140], [x - 12, 141]], l2: [[x + 3, 113], [x + 4, 140], [x - 8, 141]],
      a: w1 && [ik(s, w1, sd[0]), w1], a2: w2 && [ik(s, w2, sd[1]), w2] }); };
  // repères en couleur
  const ar = (x1, y1, x2, y2, two) => { const a = Math.atan2(y2 - y1, x2 - x1), hd = (x, y, s) => `<path class="ah" d="M${x} ${y}L${x - 8 * Math.cos(a - .45 * s) * s} ${y - 8 * Math.sin(a - .45 * s) * s}L${x - 8 * Math.cos(a + .45 * s) * s} ${y - 8 * Math.sin(a + .45 * s) * s}Z"/>`;
    return `<path class="al" d="M${x1} ${y1}L${x2} ${y2}"/>` + hd(x2, y2, 1) + (two ? hd(x1, y1, -1) : ''); };
  const arc = (cx, cy, r, a1, a2, two) => { const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)], [x1, y1] = p(a1), [x2, y2] = p(a2), big = Math.abs(a2 - a1) > 180 ? 1 : 0, sw = a2 > a1 ? 1 : 0;
    const t = (a, s) => { const [x, y] = p(a), d = (a + (s * (sw ? 90 : -90))) * Math.PI / 180, ux = Math.cos(d), uy = Math.sin(d), nx = -uy, ny = ux; return `<path class="ah" d="M${x + ux * 2} ${y + uy * 2}L${x - ux * 7 + nx * 5} ${y - uy * 7 + ny * 5}L${x - ux * 7 - nx * 5} ${y - uy * 7 - ny * 5}Z"/>`; };
    return `<path class="al" d="M${x1} ${y1}A${r} ${r} 0 ${big} ${sw} ${x2} ${y2}"/>` + t(a2, 1) + (two ? t(a1, -1) : ''); };
  const zone = (x, y, r = 10) => `<circle class="zn" cx="${x}" cy="${y}" r="${r}"/>`;
  const pt = (x, y, r = 4) => `<circle class="pt" cx="${x}" cy="${y}" r="${r}"/>`;
  const tx = (x, y, t, an = 'middle', cls = 'lb') => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${an}">${t}</text>`;
  const dash = (...p) => `<path class="ds" d="${pl(p)}"/>`;
  const zz = (x, y, dx, dy) => `<path class="al" d="M${x} ${y}l${dx * .3} ${dy * .2}l${-dx * .15} ${dy * .25}l${dx * .4} ${dy * .25}l${-dx * .1} ${dy * .3}"/>`;   // éclair : douleur, décharge
  const table = (x1, x2, y = 96) => `<rect class="tb" x="${x1}" y="${y}" width="${x2 - x1}" height="8" rx="3"/><path class="tl" d="M${x1 + 9} ${y + 8}V142M${x2 - 9} ${y + 8}V142"/>`;
  const floor = (x1 = 14, x2 = 226, y = 142) => `<path class="fl" d="M${x1} ${y}H${x2}"/>`;
  const eye = (x, y) => `<path class="ey" d="M${x - 9} ${y}Q${x} ${y + 7} ${x + 9} ${y}M${x - 6} ${y + 3}l-2 4M${x} ${y + 5}v4M${x + 6} ${y + 3}l2 4"/>`;   // yeux fermés
  const panel = (x, y, w, h, t) => `<rect class="pn" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>${t ? tx(x + w / 2, y + h - 6, t, 'middle', 'lb sm') : ''}`;

  // ---------- postures de base ----------
  const STAND = (x, o = {}) => man({ h: [x, 22], s: [x, 40], hip: [x, 80], l: [[x + 1, 110], [x, 137], [x + 13, 139]], l2: [[x - 2, 110], [x - 3, 137], [x + 9, 139]], a: [[x + 2, 60], [x + 4, 80]], ...o });
  const BACK = (x, o = {}) => man({ h: [x, 22], s: [x, 40], hip: [x, 80], hip1: [x - 8, 82], w: 28, hip2: [x + 8, 82], s2: [x + 11, 44],
    sa: [x - 16, 46], s2: [x + 16, 46], l: [[x - 9, 110], [x - 9, 137], [x - 15, 140]], l2: [[x + 9, 110], [x + 9, 137], [x + 15, 140]], a: [[x - 20, 64], [x - 21, 84]], a2: [[x + 20, 64], [x + 21, 84]], ...o });
  const SUP = (o = {}) => man({ h: [34, 84], s: [52, 85], hip: [104, 86], l: [[138, 88], [170, 89], [172, 77]], l2: [[138, 87], [170, 88], [172, 76]], a2: [[76, 90], [98, 90]], ...o });
  const SEAT = (o = {}) => man({ h: [80, 30], s: [82, 46], hip: [86, 86], l: [[114, 88], [116, 128], [130, 133]], l2: [[112, 86], [113, 126], [127, 131]], a: [[86, 66], [100, 84]], ...o });

  // pied vu de profil (orteils vers la droite), cheville en (ax, ay) ; med : côté interne (voûte)
  const footSide = (ax, ay, s = 1, med) => { const P = (x, y) => `${ax + x * s} ${ay + y * s}`;
    return `<path class="ft" d="M${P(-11, -62)}L${P(-9, -10)}C${P(-12, 0)} ${P(-20, 10)} ${P(-17, 22)}C${P(-15, 28)} ${P(-6, 29)} ${P(2, 28)}${med ? `C${P(14, 22)} ${P(28, 22)} ${P(38, 26)}` : `L${P(38, 27)}`}C${P(46, 28)} ${P(56, 28)} ${P(60, 25)}C${P(63, 22)} ${P(61, 17)} ${P(56, 16)}C${P(42, 12)} ${P(22, 2)} ${P(12, -8)}L${P(10, -62)}Z"/>` +
      `<circle class="ftm" cx="${ax + (med ? 1 : -1) * s}" cy="${ay - 2 * s}" r="${5 * s}"/>`; };
  // pied vu de dessus / de dessous (orteils en haut) ; hallux à gauche
  const footTop = (cx, cy, s = 1) => { const P = (x, y) => `${cx + x * s} ${cy + y * s}`;
    return `<path class="ft" d="M${P(-2, 58)}C${P(-17, 58)} ${P(-19, 44)} ${P(-17, 30)}C${P(-15, 14)} ${P(-22, 0)} ${P(-22, -14)}C${P(-22, -32)} ${P(-12, -40)} ${P(4, -40)}C${P(20, -40)} ${P(26, -30)} ${P(24, -16)}C${P(22, 0)} ${P(15, 14)} ${P(15, 32)}C${P(15, 48)} ${P(12, 58)} ${P(-2, 58)}Z"/>` +
      [[-14, -50, 9], [1, -54, 6], [11, -52, 5.2], [19, -47, 4.6], [25, -40, 4]].map(([x, y, r]) => `<circle class="ft" cx="${cx + x * s}" cy="${cy + y * s}" r="${r * s}"/>`).join(''); };

  // jambe et talon vus de derrière (cheville en cx, cy)
  const rear = (cx, cy) => `<path class="ft" d="M${cx - 13} ${cy - 90}L${cx - 10} ${cy - 10}C${cx - 13} ${cy} ${cx - 12} ${cy + 18} ${cx} ${cy + 20}C${cx + 12} ${cy + 18} ${cx + 13} ${cy} ${cx + 10} ${cy - 10}L${cx + 13} ${cy - 90}Z"/><circle class="ftm" cx="${cx - 11}" cy="${cy - 8}" r="4"/><circle class="ftm" cx="${cx + 11}" cy="${cy - 5}" r="4"/>`;
  const D = [];
  // ---------- 1. Rachis ----------
  D[1] = () => BACK(100) + `<path class="al" d="M100 8V128"/>` + `<circle class="pt" cx="100" cy="131" r="5"/>` + hand([140, 0], [100, 6]) +
    pt(100, 36) + pt(100, 84) + tx(116, 38, 'C7', 'start') + tx(124, 88, 'pli interfessier', 'start') + tx(116, 136, 'entre les talons', 'start') + tx(40, 20, 'vu de dos', 'middle', 'lb sm');
  const bend = (x, o = {}) => man({ h: [x + 68, 84], s: [x + 52, 76], hip: [x + 2, 80], l: [[x + 3, 110], [x + 4, 137], [x + 17, 139]], l2: [[x, 110], [x, 137], [x + 13, 139]], a: [[x + 54, 100], [x + 56, 120]], a2: [[x + 50, 100], [x + 52, 120]], ...o });
  const docS = (x, a = [[x + 14, 60], [x + 30, 66]]) => man({ pro: 1, h: [x, 26], s: [x, 44], hip: [x, 84], l: [[x, 112], [x, 138], [x + 12, 140]], l2: [[x - 3, 112], [x - 4, 138], [x + 8, 140]], a, ...{} });
  D[2] = () => floor() + docS(34, [[42, 62], [48, 78]]) + bend(100) + `<path class="al" d="M120 66Q134 50 146 64"/>` + tx(134, 46, 'bosse d\'un côté ?') + dash([46, 22], [128, 58]) + tx(172, 140, 'flexion 90°', 'middle', 'lb sm');
  D[3] = () => floor() + bend(90) + `<rect class="dev" x="116" y="56" width="34" height="11" rx="4" transform="rotate(-4 133 61)"/><circle class="pt" cx="133" cy="61" r="3"/>` + hand([100, 30], [118, 58]) + hand([170, 30], [148, 56]) + tx(133, 40, 'scoliomètre sur la bosse') + tx(60, 120, '5° surveiller · 7° radio', 'middle', 'lb sm');
  D[4] = () => floor() + STAND(56) + pt(46, 78) + pt(46, 60) + `<path class="al" d="M40 60V78"/>` + tx(36, 72, '10', 'end') + tx(40, 92, 'S1', 'end', 'lb sm') +
    bend(136) + pt(140, 72) + pt(168, 66) + `<path class="al" d="M140 64L168 58"/>` + tx(156, 52, '14-15 cm') + ar(92, 76, 118, 76) + tx(105, 68, 'penche', 'middle', 'lb sm');
  D[5] = () => floor() + STAND(56) + pt(46, 44) + pt(46, 74) + `<path class="al" d="M40 44V74"/>` + tx(36, 63, '30', 'end') + tx(40, 38, 'C7', 'end', 'lb sm') +
    bend(136) + pt(182, 74) + pt(144, 74) + `<path class="al" d="M146 64L184 66"/>` + tx(165, 54, '32-34 cm') + ar(92, 76, 118, 76);
  D[6] = () => floor() + man({ h: [128, 118], s: [124, 104], hip: [100, 74], l: [[101, 108], [102, 137], [115, 139]], l2: [[98, 108], [98, 137], [111, 139]], a2: [[134, 120], [140, 132]] }) +
    `<path class="al" d="M140 136V142"/>` + tx(150, 126, 'doigts → sol', 'start') + tx(150, 110, 'norme 0 cm', 'start', 'lb sm') + zone(84, 96, 14);
  D[7] = () => table(16, 112) + man({ h: [178, 86], s: [160, 86], hip: [112, 86], l: [[78, 89], [44, 89], [34, 97]], l2: [[78, 87], [44, 87], [34, 95]], a: [[150, 98], [142, 90]], a2: [[148, 96], [140, 88]] }) +
    hand([60, 50], [62, 78]) + hand([40, 50], [42, 78]) + zone(138, 80, 16) + tx(150, 58, '⏱ 120-180 s') + dash([112, 66], [196, 66]) + tx(52, 46, 'jambes tenues', 'middle', 'lb sm');

  // ---------- 2. Hanche ----------
  D[8] = () => table(26, 124) + man({ h: [40, 84], s: [58, 85], hip: [118, 86], l: [[152, 90], [150, 126], [162, 130]], l2: [[94, 54], [118, 50], [126, 40]], a: [[78, 68], [94, 58]] }) +
    dash([118, 90], [182, 90]) + tx(196, 94, '0°', 'start') + arc(152, 90, 14, 90, 175) + tx(170, 116, '≥ 90°', 'start') + zone(118, 80, 12);
  const trend = (x, tilt, lab) => man({ h: [x, 22], s: [x, 40], hip: [x, 80], hip1: [x - 8, 82 - tilt * .2], w: 28, hip2: [x + 8, 82 + tilt], s2: [x + 16, 46], sa: [x - 16, 46],
    l: [[x - 9, 110], [x - 9, 137], [x - 15, 140]], l2: [[x + 10, 102 + tilt], [x + 12, 118 + tilt], [x + 17, 120 + tilt]], a: [[x - 20, 64], [x - 21, 84]], a2: [[x + 20, 64], [x + 21, 84]] }) +
    `<path class="al" d="M${x - 22} ${80 - tilt * .2}L${x + 22} ${84 + tilt}"/>` + dash([x - 26, 80], [x + 28, 80]) + tx(x, 12, lab, 'middle', 'lb sm');
  D[9] = () => floor() + trend(66, 0, 'NORMAL') + trend(170, 10, 'POSITIF') + zone(158, 76, 9) + tx(204, 104, 'tombe', 'start') + ar(200, 90, 200, 102) + tx(120, 148, 'vu de dos · appui sur la jambe gauche', 'middle', 'lb sm');
  D[10] = () => doc(204, 34, [128, 50], [100, 74], [1, -1]) + table(16, 196) + SUP({ l: [[128, 58], [140, 84], [150, 88]] }) + onTop([128, 50], [100, 74]) + ar(128, 26, 128, 40) + tx(76, 66, 'EIAS bloquée', 'end', 'lb sm') + tx(160, 66, '« 4 »', 'start') + zone(104, 80, 9);
  D[11] = () => doc(206, 36, [108, 40], [140, 54], [1, 1]) + table(16, 196) + SUP({ l: [[106, 46], [140, 48], [146, 38]] }) + onTop([108, 40], [140, 54]) + arc(140, 48, 18, -40, 60) + tx(110, 22, 'adduction + rotation interne', 'middle', 'lb sm') + zone(100, 78, 10) + tx(70, 64, 'aine ?', 'middle');
  D[12] = () => doc(190, 22, [132, 80], [162, 82], [1, -1]) + table(16, 196) + SUP() + onTop([132, 80], [162, 82]) + arc(150, 88, 20, 200, 340, 1) + tx(150, 56, 'roule dedans / dehors') + zone(102, 84, 11);
  D[13] = () => doc(212, 28, [162, 50], [134, 60], [-1, 1]) + table(16, 196) + SUP({ l: [[130, 66], [158, 46], [168, 34]] }) + onTop([134, 60]) + `<path class="ds" d="M150 88A46 46 0 0 0 136 54"/>` + tx(150, 82, '30-60°', 'start') + zz(116, 74, 30, 14) + tx(60, 62, 'douleur qui descend ?', 'middle', 'lb sm');
  D[14] = () => table(16, 196) + SUP({ l: [[128, 54], [150, 88], [162, 90]], l2: [[124, 62], [150, 87], [162, 89]] }) + dash([116, 46], [150, 46]) + dash([114, 54], [150, 54]) + tx(156, 50, 'même hauteur ?', 'start') + zone(126, 54, 9) + eye(206, 70).replace('class="ey"', 'class="ey" transform="rotate(180 206 70)"') + tx(206, 88, 'de face', 'middle', 'lb sm');
  D[15] = () => floor() + BACK(84) + `<rect class="dev" x="88" y="137" width="20" height="6" rx="2"/>` + dash([54, 80], [114, 80]) + tx(84, 12, 'crêtes iliaques de niveau ?', 'middle', 'lb sm') + tx(112, 134, 'cale', 'start', 'lb sm') +
    panel(146, 22, 86, 98, 'mètre ruban') + `<path class="al" d="M164 36V102"/>` + pt(164, 36) + pt(164, 102) + tx(172, 40, 'EIAS', 'start', 'lb sm') + tx(172, 104, 'malléole', 'start', 'lb sm') + tx(172, 72, 'D = G ?', 'start', 'lb sm');

  // ---------- 3. Genou ----------
  const front = (x, legs, o = {}) => man({ h: [x, 22], s: [x, 40], hip: [x, 82], hip1: [x - 7, 82], w: 28, hip2: [x + 7, 82], s2: [x + 16, 46], sa: [x - 16, 46], l: legs[0], l2: legs[1], a: [[x - 20, 64], [x - 21, 84]], a2: [[x + 20, 64], [x + 21, 84]], ...o });
  D[16] = () => floor() + front(64, [[[-4 + 64, 110], [-14 + 64, 137], [-20 + 64, 140]], [[4 + 64, 110], [14 + 64, 137], [20 + 64, 140]]]) + ar(50, 128, 78, 128, 1) + tx(64, 150, 'VALGUM (X) · DIM', 'middle', 'lb sm') +
    front(170, [[[-15 + 170, 110], [-6 + 170, 137], [-12 + 170, 140]], [[15 + 170, 110], [6 + 170, 137], [12 + 170, 140]]]) + ar(157, 104, 183, 104, 1) + tx(170, 150, 'VARUM (O) · DIC', 'middle', 'lb sm');
  D[17] = () => doc(206, 34, [130, 52], [152, 84], [1, 1]) + table(16, 196) + SUP({ l: [[128, 56], [150, 88], [162, 90]] }) + onTop([130, 52]) + pt(130, 56, 4) + ar(150, 40, 172, 64) + tx(176, 40, 'je tends', 'start') + tx(84, 40, 'pouce : épicondyle latéral', 'middle', 'lb sm') + zone(129, 56, 12) + tx(84, 54, 'douleur vers 30° ?', 'middle', 'lb sm');
  D[18] = () => floor() + man({ h: [110, 26], s: [110, 44], hip: [106, 84], l: [[118, 110], [108, 137], [121, 139]], l2: [[94, 104], [82, 120], [80, 132]], a: [[102, 64], [98, 82]] }) + arc(118, 110, 16, -60, 40, 1) + tx(150, 102, '0 → 60°', 'start') + zone(118, 110, 11) + tx(150, 120, 'douleur vers 30° ?', 'start', 'lb sm');
  D[19] = () => doc(208, 38, [120, 72], [148, 92], [1, -1]) + table(16, 196) + SUP({ l: [[134, 72], [168, 86], [172, 74]] }) + onTop([120, 72]) + ar(156, 104, 156, 78) + tx(166, 112, 'tibia vers l\'avant', 'start', 'lb sm') + tx(134, 58, '20-30°') + zone(134, 76, 10) + tx(70, 66, 'arrêt dur ?', 'middle');
  D[20] = () => table(16, 196) + SUP({ l: [[128, 50], [150, 88], [162, 90]] }) + man({ pro: 1, h: [174, 30], s: [172, 48], hip: [168, 84], l: [[198, 90], [200, 126], [212, 130]], a: [[150, 60], [136, 54]], a2: [[154, 66], [140, 62]] }) +
    ar(150, 36, 136, 50) + tx(150, 22, 'pousse le tibia en arrière', 'middle', 'lb sm') + tx(200, 146, 'assis sur le pied', 'middle', 'lb sm') + zone(129, 52, 10);

  // ---------- 4. Cheville ----------
  const SEATT = o => table(16, 110) + SEAT(o);
  D[21] = () => SEATT() + hand([150, 104], [120, 114]) + hand([150, 146], [112, 140]) + ar(124, 148, 148, 148) + tx(158, 124, 'pied en avant', 'start') + tx(158, 100, 'jambe tenue', 'start', 'lb sm') + zone(122, 128, 10);
  D[22] = () => SEATT() + hand([150, 104], [120, 112]) + hand([146, 146], [112, 140]) + arc(114, 128, 18, 10, 120, 1) +
    panel(150, 6, 86, 138, 'vu de derrière') + `<g transform="rotate(-14 193 112)" opacity=".35">${rear(193, 112)}</g>` + rear(193, 112) + arc(193, 112, 26, 200, 250) + tx(193, 18, 'varus / valgus', 'middle', 'lb sm');
  D[23] = () => table(16, 196) + SUP({ l: [[128, 54], [150, 88], [162, 90]] }) + hand([168, 52], [149, 66]) + hand([110, 92], [129, 78]) + ar(170, 52, 156, 61) + ar(112, 92, 124, 84) + zone(150, 90, 9) + zz(160, 100, 10, 14) + tx(176, 114, 'mal à la cheville ?', 'middle', 'lb sm') + tx(150, 30, 'serrer au milieu du mollet', 'middle', 'lb sm');
  D[24] = () => SEATT() + hand([150, 102], [120, 112]) + hand([168, 140], [134, 134]) + arc(122, 132, 20, -150, -20) + tx(150, 96, 'rotation externe', 'start') + zone(118, 124, 9) + tx(150, 112, 'jambe tenue', 'start', 'lb sm');
  D[25] = () => table(16, 156) + man({ h: [28, 86], s: [46, 87], hip: [98, 87], l: [[130, 89], [164, 89], [168, 102]], l2: [[130, 87], [164, 87], [168, 100]], a: [[70, 92], [90, 92]] }) +
    hand([116, 54], [134, 78]) + hand([168, 54], [150, 78]) + ar(118, 70, 130, 82) + ar(166, 70, 154, 82) + arc(164, 89, 20, 40, 100) + tx(142, 40, 'serrer le mollet', 'middle', 'lb sm') + tx(196, 128, 'le pied bouge ?', 'middle');
  D[26] = () => panel(4, 4, 112, 112) + footSide(40, 70, .78) + `<path class="ds" d="M33 70V24"/>` + pt(33, 62) + pt(78, 88) + tx(60, 16, 'côté externe', 'middle', 'lb sm') + tx(84, 104, 'base M5', 'middle', 'lb sm') +
    panel(124, 4, 112, 112) + footSide(160, 70, .78, 1) + `<path class="ds" d="M153 70V24"/>` + pt(153, 62) + pt(178, 82) + tx(180, 16, 'côté interne', 'middle', 'lb sm') + tx(190, 104, 'naviculaire', 'middle', 'lb sm') +
    tx(16, 40, '6 cm', 'start', 'lb sm') + [0, 1, 2, 3].map(i => `<ellipse class="pt" cx="${70 + i * 30}" cy="${134 - (i % 2) * 8}" rx="9" ry="4"/>`).join('') + tx(196, 136, '4 pas', 'start');
  D[27] = () => floor() + `<rect class="tb" x="206" y="6" width="10" height="136" rx="2"/>` + man({ h: [150, 24], s: [148, 40], hip: [144, 82], l: [[196, 98], [168, 134], [194, 139]], l2: [[128, 132], [100, 136], [92, 140]], a: [[172, 52], [200, 52]] }) +
    pt(196, 98) + pt(166, 138) + ar(196, 148, 206, 148, 1) + tx(184, 146, '≥ 10 cm', 'end') + tx(152, 126, 'talon au sol', 'end', 'lb sm');
  D[28] = () => footSide(100, 70, 1.25) + hand([60, 0], [96, 54]) + hand([30, 120], [80, 98]) + arc(84, 100, 22, 140, 230, 1) + pt(118, 82, 5) + zone(118, 82, 11) + tx(150, 70, 'sinus du tarse', 'start') + tx(60, 40, 'talus fixé', 'end', 'lb sm');

  // ---------- 5. Avant-pied ----------
  D[29] = () => footSide(50, 60, 1.35) + hand([110, 40], [104, 70]) + hand([150, 50], [128, 76]) + ar(146, 98, 146, 70, 1) + pt(120, 86) + zone(120, 86, 10) + tx(160, 84, 'P1 haut / bas', 'start') + tx(100, 140, '2e MTP', 'middle');
  D[30] = () => footTop(120, 82, 1.1) + ar(62, 36, 92, 40) + ar(182, 42, 152, 46) + pt(125, 30, 5) + zone(125, 30, 11) + ar(125, 70, 125, 44) + tx(125, 14, '« clic ! »') + tx(50, 60, 'serrer', 'middle', 'lb sm') + tx(150, 74, 'doigt : 3e espace', 'start', 'lb sm');
  D[31] = () => [['palper', 0], ['étirer', 1], ['contrarier', 2]].map(([t, i]) => { const x = 4 + i * 78;
    return panel(x, 6, 74, 138, `${i + 1}. ${t}`) + footSide(x + 24, 72, .62, 1) + (i === 0 ? hand([x + 70, 20], [x + 16, 84]) + pt(x + 16, 84) : i === 1 ? arc(x + 30, 72, 30, -10, -60) : hand([x + 70, 120], [x + 58, 84]) + ar(x + 46, 100, x + 46, 76) + ar(x + 62, 64, x + 62, 82)); }).join('');
  D[32] = () => panel(4, 6, 112, 138, 'Tinel : taper') + footSide(44, 72, .8, 1) + `<path class="dev" d="M70 20L48 58" stroke-width="5"/><rect class="dev" x="40" y="54" width="18" height="10" rx="3" transform="rotate(30 49 59)"/>` + pt(40, 70) + zz(46, 82, 14, 20) +
    panel(124, 6, 112, 138, 'Phalen : 60 s') + footSide(164, 64, .8, 1).replace(/<path class="ft"/, '<path class="ft" transform="rotate(25 164 64)"') + arc(170, 70, 30, 0, 50) + tx(200, 40, 'FP + inversion', 'middle', 'lb sm');

  // ---------- 6. Diabète ----------
  D[33] = () => footTop(90, 84, 1.1) + [[-14, -50], [-15, -18], [17, -10]].map(([x, y], i) => pt(90 + x * 1.1, 84 + y * 1.1, 5) + tx(90 + x * 1.1 + (i === 2 ? 12 : -12), 84 + y * 1.1 + 4, i + 1, i === 2 ? 'start' : 'end')).join('') +
    `<path class="dev" d="M196 40L160 70" stroke-width="7"/><path class="al" d="M160 70Q150 82 132 70"/>` + tx(190, 98, '10 g, il se plie', 'middle', 'lb sm') + eye(196, 130) + tx(196, 120, 'yeux fermés', 'middle', 'lb sm');
  D[34] = () => footSide(60, 66, 1.25, 1) + `<path class="dev" d="M130 50V80M120 22V42Q120 50 130 50Q140 50 140 42V22" fill="none" stroke-width="5"/>` + pt(130, 84, 5) + `<path class="al" d="M110 26q-6 6 0 12M150 26q6 6 0 12"/>` + tx(160, 46, '128 Hz', 'start') + pt(62, 62) + tx(60, 34, 'malléole', 'middle', 'lb sm') + tx(146, 108, 'sur l\'hallux', 'start', 'lb sm') + eye(30, 132) + tx(30, 122, 'yeux fermés', 'middle', 'lb sm');
  D[35] = () => footTop(110, 84, 1.1) + `<path class="dev" d="M40 30L84 50" stroke-width="4"/><ellipse class="ft" cx="86" cy="51" rx="6" ry="4"/>` + tx(36, 22, 'toucher', 'middle') + `<path class="dev" d="M190 40L140 70" stroke-width="5"/>` + pt(138, 71, 3) + tx(196, 32, 'piquer', 'middle') + eye(196, 120) + tx(196, 110, 'au hasard', 'middle', 'lb sm');
  D[36] = () => panel(4, 6, 112, 138, 'pédieux') + footTop(58, 82, .9) + pt(52, 46, 5) + hand([30, 120], [50, 52]) + `<path class="al" d="M66 30l4-6 4 10 4-8 4 4"/>` +
    panel(124, 6, 112, 138, 'tibial postérieur') + footSide(160, 70, .8, 1) + pt(152, 74, 5) + hand([200, 120], [154, 78]) + `<path class="al" d="M180 50l4-6 4 10 4-8 4 4"/>`;
  D[37] = () => table(16, 196) + SUP() + `<rect class="dev" x="64" y="84" width="16" height="12" rx="3"/><rect class="dev" x="156" y="80" width="12" height="14" rx="3"/>` + `<path class="dev" d="M188 50L172 84" stroke-width="5"/>` +
    tx(72, 70, 'bras') + tx(166, 64, 'cheville') + tx(120, 128, 'IPS = cheville ÷ bras', 'middle') + tx(120, 24, '0,90 – 1,30 = normal', 'middle', 'lb sm');

  // ---------- 7. Fonctionnels ----------
  D[38] = () => { const p = (i, t, d) => { const x = 4 + (i % 3) * 78, y = i < 3 ? 4 : 78; return panel(x, y, 74, 70, t) + `<g transform="translate(${x} ${y})">${d}</g>`; };
    return p(0, '5e doigt > 90°', layer([[[[18, 40], [44, 40]], 14, SK], [[[44, 40], [54, 18]], 6, SK]]) + arc(44, 40, 14, -90, -10)) +
      p(1, 'pouce / avant-bras', layer([[[[10, 34], [56, 34]], 12, SK], [[[56, 34], [44, 26]], 7, SK]]) + ar(58, 20, 48, 26)) +
      p(2, 'coude > 10°', layer([[[[10, 26], [38, 36], [64, 30]], 11, SK]]) + dash([38, 36], [66, 44]) + arc(38, 36, 16, -30, 20)) +
      p(3, 'genou > 10°', layer([[[[14, 22], [38, 34], [64, 26]], 13, SK]]) + dash([38, 34], [66, 44]) + arc(38, 34, 16, -30, 20)) +
      p(4, 'paumes au sol', man({ h: [48, 54], s: [42, 44], hip: [22, 18], l: [[22, 34], [22, 54], [28, 56]], a: [[46, 52], [50, 58]] }).replace(/stroke-width="(\d+\.?\d*)"/g, (m, w) => `stroke-width="${w * .55}"`)) +
      tx(196, 118, '/ 9', 'middle', 'big');
  };
  D[39] = () => floor() + `<path class="al" d="M86 142V132M154 142V132"/>` + tx(120, 148, '30 cm', 'middle', 'lb sm') + ar(92, 136, 148, 136, 1) +
    man({ h: [124, 24], s: [123, 40], hip: [121, 78], w: 26, l: [[118, 102], [124, 120], [128, 124]], l2: [[132, 96], [140, 110], [144, 106]], a: [[108, 58], [104, 72]], a2: [[138, 58], [142, 72]] }) +
    `<path class="ds" d="M80 120Q120 70 160 120"/>` + tx(40, 50, '30 s', 'middle', 'big') + tx(40, 70, 'aller-retour', 'middle', 'lb sm');
  D[40] = () => floor() + man({ h: [92, 30], s: [92, 46], hip: [90, 84], l: [[98, 110], [90, 137], [103, 139]], l2: [[118, 108], [146, 128], [160, 138]], a: [[78, 66], [90, 82]] }) +
    `<rect class="dev" x="160" y="132" width="16" height="10" rx="2"/>` + ar(150, 124, 170, 124) +
    panel(178, 6, 58, 60, 'le Y') + `<path class="al" d="M207 30V12M207 30L192 48M207 30L222 48"/>` + tx(207, 10, 'ant', 'middle', 'lb sm') + tx(188, 58, 'PM', 'middle', 'lb sm') + tx(226, 58, 'PL', 'middle', 'lb sm');
  D[41] = () => floor() + `<path class="al" d="M30 132V142"/>` + man({ h: [44, 40], s: [46, 56], hip: [44, 92], w: 22, l: [[56, 114], [40, 137], [52, 140]], l2: [[30, 104], [24, 120], [20, 126]], a: [[34, 72], [26, 84]] }).replace(/stroke-width="(\d+\.?\d*)"/g, (m, w) => `stroke-width="${w * .9}"`) +
    `<path class="ds" d="M60 90Q120 20 176 80"/>` + man({ h: [186, 24], s: [184, 40], hip: [180, 80], l: [[190, 108], [180, 137], [193, 139]], l2: [[168, 98], [160, 114], [156, 124]], a: [[196, 60], [204, 50]] }) +
    ar(30, 146, 180, 146, 1) + tx(105, 134, 'distance, 3 essais') + tx(206, 118, 'tenir 2 s', 'start', 'lb sm');

  window.CLIN_PIC = n => D[n] ? `<g fill="none" stroke-linecap="round" stroke-linejoin="round">${D[n]()}</g>` : '';
})();
