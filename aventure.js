// Podo Quest : le jeu d'aventure au tour par tour. Chaque monstre EST une fiche, un repère d'anatomie ou un test clinique :
//   on le reconnaît à ses signes, on l'attaque avec des défis qui se corrigent tout seuls (question, tri, ordre, trous), on le finit avec son vrai traitement.
//   Pour apprendre vraiment : un défi raté montre la leçon du livret puis revient en revanche ; un monstre battu avec des fautes revient à l'expédition suivante.
//   Les objets sont de vrais instruments et soins du livret ; pour en gagner un, il faut savoir à quoi il sert.
// Tout le contenu vient des données du site (quiz.js, cas.js, anat.js, clinique.js) : rien n'est inventé ici, sauf les dessins et les chiffres du jeu.
// app.js fournit ses outils par A ; l'état de la partie est G (A.g()), la progression du héros est S.rpg.
window.AVENTURE = A => {
  const { S, save, esc, md, ico, shuffle, rnd, fx, did, review, top, count, QZ, CAS, mkStep, qsjClues, qsjOpts } = A;
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
  const FAMS = ['peau', 'ongle', 'vasc', 'med'];
  const fam = it => it.kind === 'f' ? (it.f.sec === 'podo' ? 'podo' : FAMS.includes(it.f.cat) ? it.f.cat : 'peau') : it.kind === 'a' ? (it.x.nerf ? 'mus' : 'os') : 'test';
  const hue = id => { let h = 7; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  // Un sprite par famille, animé par les classes de combat ; chaque adversaire reçoit une légère variation de teinte.
  const sprite = (it, cls = '') => `<img class="avspr art ${cls}" alt="" style="--hr:${hue(it.id) % 5 * 14 - 28}deg" src="jeu/monstre-${fam(it)}-v2.png">`;
  const HERO = (cls = '') => /\blunge\b/.test(cls)
    ? `<img class="avspr art avhero avhero-base" alt="" src="jeu/heros-v2.png"><img class="avspr art avhero avhero-strike" alt="" src="jeu/heros-attaque-v2.png">`
    : `<img class="avspr art avhero ${cls}" alt="" src="jeu/heros-v2.png">`;
  const CHEST = (open, cls = '') => `<img class="avspr art avhero ${cls}" alt="" src="jeu/coffre${open ? '-ouvert' : ''}.png">`, OBJ = k => `<img class="avobj" alt="" src="jeu/obj-${k}.png">`;

  const BIOME = { peau: 'foret', ongle: 'foret', vasc: 'marais', med: 'marais', podo: 'canyon', os: 'grotte', mus: 'grotte', test: 'grotte' }, scene = kind => `jeu/decor-${kind}-v2.webp`;

  // ---------- les défis : ils se corrigent tout seuls (plus rien à cocher « sur l'honneur »). Quatre genres, du plus simple au plus fort : ----------
  //   Question (un choix), Tri (toucher seulement ce qui est juste), Ordre (remettre les étapes), Trous (remettre les mots cachés).
  //   Les pièges viennent toujours du même endroit que la bonne réponse : la même fiche, la même région du corps, la même section de tests.
  //   Et l'Oral, le plus fort : rien à choisir, on dit la partie à voix haute (comme le jour de l'oral), puis on voit ce qu'on a oublié.
  const KIND = { qcm: ['Question', 1, 'var(--hl)', 'Une seule bonne réponse.'], tri: ['Tri', 1.3, 'var(--p6)', 'Touche seulement ce qui est juste : un piège touché annule un bon.'], ordre: ['Ordre', 1.4, 'var(--p3)', 'Touche les étapes dans l\'ordre.'], trous: ['Trous', 1.5, 'var(--p8)', 'Remets les mots à leur place.'],
    oral: ['Oral', 2, 'var(--p1)', 'Dis-le à voix haute, sans regarder, comme devant le jury. Puis vérifie ce que tu as oublié.'] };
  const NC = new Map(), norm = s => { let v = NC.get(s); if (v == null) NC.set(s, v = String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()); return v; }, plain = s => String(s || '').replace(/\*\*/g, ''), stem = w => norm(w).slice(0, 5), line = s => String(s || '').split('\n')[0];
  const STOPW = new Set('souvent parfois surtout exemple pendant plusieurs environ general generalement possible toujours jamais depuis autres niveau partie patient patiente patients traitement traitements certains certaines quelques autour devant derriere dessus dessous permet peuvent mettre prendre partir ensuite encore beaucoup notamment principal principale principalement associe associee associes associees plutot presque simple simples besoin lorsque chaque toutes atteinte atteintes risque risques facteurs facteur signes causes formes egalement moment maniere suivre tendre donner trouve trouver praticien'.split(' '));
  const NUM = /\d+(?:[.,]\d+)?(?:\s?(?:à|-|–)\s?\d+(?:[.,]\d+)?)?(?:\s?(?:%|°|mm|cm|ans?|mois|jours?|semaines?|heures?|min)(?!\p{L}))?/gu;
  let ALLC; const ALL = () => ALLC = ALLC || A.all();
  const some = (a, n) => shuffle(a.map((_, i) => i)).slice(0, n).sort((x, y) => x - y).map(i => a[i]);   // n éléments au hasard, gardés dans leur ordre
  const low = (w, i) => !i && /^\p{Lu}\p{Ll}/u.test(w) ? w[0].toLowerCase() + w.slice(1) : w;   // un mot de début de phrase perd sa majuscule (sinon elle le trahit dans la banque)
  // les mots qu'on peut cacher dans un texte : ceux en gras (b), les chiffres avec leur unité (n), les mots longs (w)
  function spots(txt) {
    const clean = plain(txt), out = []; let k = 0;
    for (const m of String(txt).matchAll(/\*\*(.+?)\*\*/g)) { if (m[1].length <= 40) out.push({ i: m.index - 4 * k, w: low(m[1], m.index), ty: 'b' }); k++; }
    for (const m of clean.matchAll(NUM)) if (!/[\p{L}\d°]/u.test(clean[m.index - 1] || ' ')) out.push({ i: m.index, w: m[0], ty: 'n' });
    for (const m of clean.matchAll(/\p{L}{6,}/gu)) if (!STOPW.has(norm(m[0]))) out.push({ i: m.index, w: low(m[0], m.index), ty: 'w' });
    return { clean, out };
  }
  // les pièges doivent ressembler à la bonne réponse, sinon on les écarte sans savoir : même terminaison, même longueur, même nombre de mots
  const alike = (a, b) => { a = norm(a); b = norm(b); return (a.slice(-2) === b.slice(-2) ? 2 : a.slice(-1) === b.slice(-1) ? 1 : 0) + (Math.abs(a.length - b.length) < 3 ? 1 : 0) + (a.split(' ').length === b.split(' ').length ? 1 : 0); };
  const closest = (goods, cands, n) => shuffle(shuffle(cands).map(c => [Math.max(...goods.map(g => alike(g, c))), c]).sort((x, y) => y[0] - x[0]).slice(0, n + 1)).slice(0, n).map(x => x[1]);
  // pour un chiffre, les pièges sont des chiffres voisins avec la MÊME unité (« 60 % » face à « 30 % » et « 80 % ») : ce sont les seules fausses réponses fabriquées par le jeu
  const unit = w => w.replace(/^\d+(?:[.,]\d+)?(?:\s?(?:à|-|–)\s?\d+(?:[.,]\d+)?)?/, '');
  function vary(w) {
    const m = w.match(/^(\d+)(?:(\s?(?:à|-|–)\s?)(\d+))?(?![.,\d])(.*)$/); if (!m) return [];
    const a = +m[1], b = m[3] ? +m[3] : null, u = m[4], ok = v => Number.isInteger(v) && v > (u.trim() ? 1 : 0) && !(u.includes('%') && v >= 100);
    if (a === 1 && u.trim() && b == null) return [];   // « 1 an » : au pluriel, le piège se verrait
    if (b == null) return (a < 10 ? [a - 1, a + 1, a + 2] : [a / 2, a * 1.5, a * 2, a - 10, a + 10]).filter(ok).map(v => v + u);
    return (a < 10 ? [[a + 1, b + 1], [a + 2, b + 2], [a * 2, b * 2], [a, b * 2]] : [[a / 2, b / 2], [a * 2, b * 2], [a + 10, b + 10], [a, b + 10]]).filter(x => ok(x[0]) && ok(x[1]) && x[0] < x[1]).map(x => x[0] + m[2] + x[1] + u);
  }
  const bag = texts => { const p = { b: [], n: [], w: [] }; for (const t of texts) for (const s of spots(t).out) if (!p[s.ty].some(x => norm(x) === norm(s.w))) p[s.ty].push(s.w); return p; };
  // un texte à trous : par ligne, on cache jusqu'à `per` mots (gras d'abord, puis chiffres, puis mots longs) ; la banque mêle les bons mots et des pièges du même genre, pris dans P
  function cloze(q, lines, P, per = 1) {
    const segs = [], ok = [], traps = [], more = [], all = norm(lines.join(' ')), free = s => (s.ty === 'n' ? [...new Set([...P.n.filter(d => unit(d) === unit(s.w)), ...vary(s.w)])].filter(d => d !== s.w) : P[s.ty].filter(d => !all.includes(norm(d)) && stem(d) !== stem(s.w)));
    lines.forEach((ln, li) => {
      const { clean, out } = spots(ln), got = [];
      for (const ty of 'bnw') for (const s of shuffle(out.filter(x => x.ty === ty)))
        if (got.length < per && !got.some(g => s.i < g.i + g.w.length && g.i < s.i + s.w.length) && free(s).length > 1) got.push(s);
      let at = 0;
      for (const s of got.sort((a, b) => a.i - b.i)) { segs.push(clean.slice(at, s.i), ok.length); ok.push(s.w); traps.push(...(s.ty === 'n' ? shuffle(free(s)).slice(0, 2) : closest([s.w], free(s), 2))); more.push(...shuffle(free(s)).slice(0, 4)); at = s.i + s.w.length; }
      segs.push(clean.slice(at) + (li < lines.length - 1 ? '\n' : ''));
    });
    const bad = [...new Set([...shuffle(traps), ...more])].filter(d => !ok.some(w => w === d || (!/\d/.test(d) && stem(w) === stem(d))));
    return ok.length ? { kind: 'trous', q, segs, ok, bank: shuffle([...ok, ...bad.slice(0, Math.max(3, Math.min(5, ok.length + 1)))]) } : null;
  }
  const share = (a, b) => (norm(a).match(/[a-z]{5,}/g) || []).some(w => norm(b).includes(w.slice(0, 6)));   // deux idées qui se ressemblent trop pour que l'une serve de piège à l'autre
  const tri = (q, good, bad) => ({ kind: 'pick', q, items: shuffle([...some(good, 5).map(x => [x, 1]), ...closest(good, bad, 3).map(x => [x, 0])]) });
  const ordre = (q, items) => { let sh; do sh = shuffle(items.map((_, i) => i)); while (sh.every((x, i) => x === i)); return { kind: 'ordre', q, items, sh }; };
  const qcm = (q, ok, cands) => { ok = plain(ok); const bad = []; for (const c of cands.map(plain)) if (c && norm(c) !== norm(ok) && bad.length < 3 && !bad.some(b => norm(b) === norm(c))) bad.push(c); return { kind: 'qcm', q, ok, opts: shuffle([ok, ...bad]) }; };
  const card = (k, lab, les, mk) => ({ k, lab, les, mk });   // une carte d'attaque : son genre, ce qu'elle fait réviser, la leçon à montrer si on la rate, et de quoi fabriquer le défi
  const make = c => { for (let i = 0; i < 6; i++) { const st = c.mk(); if (st) return st; } };

  // ---------- l'oral : on dit une partie à voix haute, sans regarder, puis on coche les idées qu'on a vraiment dites. ----------
  const oral = (lab, q, items, full, pi) => items && items.length ? Object.assign(card('oral', lab, items, () => ({ kind: 'oral', q, items, full })), { pi }) : null;
  // ---------- ce que tu sais dire à l'oral, gardé d'une partie à l'autre : S.rpg.oral[monstre][partie] = meilleure note SANS aide (indice ou lecture) ----------
  //   Une partie est « sue » à 80 %. Chaque victoire te fait dire la suivante : la fiche se récite un peu plus à chaque fois.
  const SUE = .8, score = (it, pi) => ((R().oral || {})[it.id] || {})[pi] || 0, sue = (it, pi) => score(it, pi) >= SUE;
  // les parties d'un monstre qu'on peut dire à l'oral : les parties du plan d'une fiche ; pour un muscle, origine + terminaison puis toute sa fiche d'identité
  const pisOf = it => it.kind === 'f' ? (QZ[it.f.id] || []).map((z, i) => z.k.length && it.f.parts[i] ? i : null).filter(x => x != null) : it.kind === 'a' && it.x.nerf ? [...(it.x.o && it.x.t ? ['ot'] : []), 'id'] : [];
  const nSue = it => pisOf(it).filter(pi => sue(it, pi)).length;
  const nextPart = it => pisOf(it).find(pi => !sue(it, pi));   // la prochaine partie à apprendre, dans l'ordre du plan
  const partName = (it, pi) => it.kind === 'f' ? `Partie ${pi + 1} · ${it.f.parts[pi].title}` : pi === 'ot' ? 'Origine, terminaison et action' : 'Fiche d\'identité complète';
  const dots = it => { const ps = pisOf(it); return `<span class="avdots" role="img" aria-label="${nSue(it)} sur ${ps.length} sues">${ps.map(pi => `<i class="${sue(it, pi) ? 'on' : score(it, pi) ? 'half' : ''}"></i>`).join('')}</span>`; };
  const progress = it => { const ps = pisOf(it), n = nSue(it), nx = nextPart(it); if (!ps.length) return '';
    return `<div class="avprog"><div class="kicker">${it.kind === 'f' ? 'TON ORAL DE CETTE FICHE' : 'CE MUSCLE À L\'ORAL'}</div>${dots(it)}<div class="small">${n}/${ps.length} ${it.kind === 'f' ? `partie${n > 1 ? 's' : ''} sue${n > 1 ? 's' : ''}` : 'su'} · ${nx != null ? `prochaine fois : <b>${esc(partName(it, nx))}</b>` : '<b>tu sais tout le dire !</b>'}</div></div>`; };
  const initials = s => plain(s).replace(/[A-Za-zÀ-ÿ]{4,}/g, w => w[0] + '•'.repeat(Math.min(w.length - 1, 6))).replace(/\d/g, '•');   // « HPV 1 → myrmécie » devient « HPV • → m•••••• »

  // ---------- ce qu'un monstre fait réviser : ses cartes d'attaque (qs), ses récitations à trous (says), son coup de grâce (fin) ----------
  function kit(it) {
    if (it.kind === 'f') {
      const f = it.f, Z = QZ[f.id] || [], c = CAS[f.id], ans = s => s.split(' | ')[1], ti = f.parts.findIndex(p => /^Traitement/.test(p.title));
      const P = bag(Z.flatMap(z => [...z.k, ...z.q.map(s => ans(s).replace(' || ', ' ; '))]));
      const lists = Z.map(z => z.q.map(ans).filter(a => !a.includes(' || ') && a.includes(' ; ')).flatMap(a => a.split(' ; ')));
      const qs = Z.flatMap((z, i) => z.q.map(s => {
        const [q, a] = s.split(' | '), mk = (k, fn) => card(k, (f.parts[i] || f).title, z.k, fn);
        if (a.includes(' || ')) return mk('qcm', () => mkStep(i + 1, s));
        if (!a.includes(' ; ')) return mk('trous', () => cloze(q, [a], P, 2));
        // une liste à citer : on trie ses vraies idées parmi des idées de la MÊME fiche, prises dans d'autres parties
        const good = a.split(' ; '), bad = [...new Set(lists.flatMap((l, j) => j === i ? [] : l))].filter(b => !good.some(g => share(g, b) || share(b, g)));
        return bad.length > 2 ? mk('tri', () => tri(q, good, bad)) : mk('trous', () => cloze(q, some(good, 4), P, 1));
      })).filter(make);
      // l'oral : chaque partie du plan, à dire avec ses idées clés (c'est ce que le jury demande)
      const plan = Z.map((z, i) => f.parts[i] ? oral(`${i + 1}. ${f.parts[i].title}`, `**${f.title}**\nPartie ${i + 1} · ${f.parts[i].title} : ${f.parts[i].q}`, z.k, f.parts[i].say, i) : null).filter(Boolean);
      const gestes = c ? card('tri', 'Les bons gestes', ti >= 0 && Z[ti] ? Z[ti].k : null, () => ({ kind: 'pick', q: 'Quels sont les bons gestes ?', items: shuffle(c.tt) })) : null;
      const fin = ti >= 0 && Z[ti] && Z[ti].k.length ? oral('Traitement', `Coup de grâce · **${f.title}**\n${f.parts[ti].title} : ${f.parts[ti].q}`, Z[ti].k, f.parts[ti].say, ti) : gestes;
      return { qs: [...qs, ...plan, ...(gestes && fin !== gestes ? [gestes] : [])], says: plan, plan, fin };
    }
    if (it.kind === 'a') {
      const x = it.x, sib = ALL().filter(y => y.kind === 'a' && y.x !== x && !y.x.nerf === !x.nerf).map(y => y.x), reg = sib.filter(y => y.reg === x.reg), by = () => [...shuffle(reg), ...shuffle(sib)];
      const N = `**${x.name}**`, les = x.nerf ? [['Origine', x.o], ['Terminaison', x.t], ['Nerf', x.nerf], ['Action', x.act]].filter(a => a[1]).map(a => `**${a[0]}** : ${a[1]}`) : [x.pos, x.how, x.chk, x.ins].filter(Boolean).map(line);
      const Q = (lab, q, ok, key) => ok ? card('qcm', lab, les, () => qcm(q, ok, by().map(key))) : null;
      const palp = Q('Palpation', `On palpe quoi ?\n${plain(x.how)}`, x.name, y => y.name);
      if (x.nerf) {   // un muscle : ses 4 lignes d'identité, face à celles des muscles voisins
        const P = bag((reg.length > 3 ? reg : sib).map(y => y.act).filter(Boolean));
        const id = () => { const o = by().slice(0, 2), rows = [['Origine', 'o'], ['Terminaison', 't'], ['Nerf', 'nerf']].filter(r => x[r[1]]), ok = rows.map(r => plain(x[r[1]]));
          const traps = [...new Set(rows.flatMap(r => o.map(y => plain(y[r[1]]))))].filter(d => d && !ok.some(w => norm(w) === norm(d)));
          return { kind: 'trous', q: `Fiche d'identité : ${x.name}`, segs: [...rows.flatMap((r, i) => [`${i ? '\n' : ''}${r[0]} : `, i]), ''], ok, bank: shuffle([...ok, ...traps]) }; };
        // l'anatomie doit être dure : l'origine, la terminaison et l'action se DISENT (plus de choix à deviner), et il faut les trois pour l'achever
        const say = oral('Fiche d\'identité', `Dis sa fiche d'identité : ${N}\nOrigine, terminaison, nerf, action.`, les, null, 'id');
        const ot = x.o && x.t ? oral('Origine, terminaison, action', `Origine, terminaison et action : ${N}\nDis d'où il part, où il se termine, puis ce qu'il fait.`, [`**Origine** : ${x.o}`, `**Terminaison** : ${x.t}`, ...(x.act ? [`**Action** : ${x.act}`] : [])], null, 'ot') : null;
        const plan = [ot, say].filter(Boolean);
        return { qs: [Q('Nerf', `Quel nerf innerve : ${N} ?`, x.nerf, y => y.nerf), Q('Action', `Que fait : ${N} ?`, x.act, y => y.act), palp,
          x.act && card('trous', 'Action', les, () => cloze(`Que fait : ${x.name} ?`, [x.act], P, 2)), card('trous', 'Fiche d\'identité', les, id), ...plan].filter(c => c && make(c)), says: [say], plan, fin: ot, hard: true };
      }
      // un repère (os, tendon) : comment on le trouve, comment on vérifie, ce qui s'y attache
      const P = bag((reg.length > 3 ? reg : sib).flatMap(y => [y.pos, y.how, y.chk, y.ins].filter(Boolean).map(line)));
      const say = oral('Repérage', `Explique comment tu le palpes : ${N}\nLa position, comment le trouver, comment vérifier.`, les);
      return { qs: [palp, Q('Rapports', `Qu'est-ce qui s'attache ou passe sur : ${N} ?`, x.ins && line(x.ins), y => y.ins && line(y.ins)),
        x.how && card('trous', 'Palpation', les, () => cloze(`Comment trouver : ${x.name} ?`, [x.how], P, 2)), x.chk && card('trous', 'Vérification', les, () => cloze(`Comment vérifier : ${x.name} ?`, [line(x.chk)], P, 2)),
        card('trous', 'Repérage', les, () => cloze(`Tout le repérage : ${x.name}`, les, P, 1)), say].filter(c => c && make(c)),
        says: [say], fin: null };
    }
    // un test clinique : ce qu'il cherche, son geste dans l'ordre, ce que veut dire un test positif
    const c = it.cl, oth = ALL().filter(y => y.kind === 'c' && y.cl !== c).map(y => y.cl), sec = oth.filter(y => y.s === c.s), by = () => [...shuffle(sec), ...shuffle(oth)], pos = c.pos && c.pos[0];
    const les = [`**Il cherche** : ${c.cherche}`, ...c.steps, c.norm ? `**Normal** : ${c.norm}` : ''].filter(Boolean), P = bag((sec.length > 3 ? sec : oth).flatMap(y => [y.pat, y.prat, ...y.steps, y.norm].filter(Boolean)));
    // l'ordre ne se demande que pour une vraie suite d'étapes : pas pour une liste (étapes à étiquette en gras, ou qui commencent par le même mot)
    const seq = c.steps.length > 2 && c.steps.filter(x => x.startsWith('**')).length < 2 && new Set(c.steps.map(x => norm(x).split(' ')[0])).size === c.steps.length;
    const ord = seq ? card('ordre', 'Le geste', les, () => ordre(`Remets le test dans l'ordre : ${c.n}`, c.steps)) : null;
    return { qs: [card('qcm', 'Ce qu\'il cherche', les, () => qcm(`Quel test cherche : **${plain(c.cherche)}** ?`, c.n, by().map(y => y.n))), card('qcm', 'Ce qu\'il cherche', les, () => qcm(`Que cherche : **${c.n}** ?`, c.cherche, by().map(y => y.cherche))),
      pos && card('qcm', 'Test positif', les, () => qcm(`**${c.n}** positif : « ${plain(pos[0])} ». Ça veut dire quoi ?`, pos[1], by().map(y => y.pos && y.pos[0] && y.pos[0][1]))), ord,
      card('trous', 'Le geste', les, () => cloze(`Le geste : ${c.n}`, some(c.steps, 3), P, 1)), c.norm && card('trous', 'Résultat normal', les, () => cloze(`Résultat normal : ${c.n}`, [c.norm], P, 2)),
      card('trous', 'Tout le test', les, () => cloze(`Tout le test : ${c.n}`, [c.pat && `Patient : ${c.pat}`, c.prat && `Praticien : ${c.prat}`, ...some(c.steps, 3)].filter(Boolean), P, 1)),
      oral('Tout le test', `Décris le test : **${c.n}**\nCe qu'il cherche, le geste étape par étape, le résultat normal.`, les)].filter(x => x && make(x)),
      says: [oral('Tout le test', `Décris le test : **${c.n}**\nCe qu'il cherche, le geste étape par étape, le résultat normal.`, les)], fin: ord };
  }
  // ce qu'il faut retenir d'un monstre (bestiaire, écrans de fin)
  const weak = it => { if (it.kind === 'f') { const m = it.f.memo && it.f.memo[5]; return m ? [m.q, m.k] : null; } return it.kind === 'a' ? (it.x.nerf ? (it.x.o && it.x.t ? ['Origine → terminaison', `${it.x.o} → ${it.x.t}${it.x.act ? ` · **Action** : ${it.x.act}` : ''}`] : ['Son nerf', it.x.nerf]) : ['On le trouve', line(it.x.how)]) : ['Il cherche', it.cl.cherche]; };
  // la main : 3 cartes tirées du paquet du monstre, de genres différents si possible. Un défi raté revient seul, un tour plus tard : c'est la revanche.
  function deal(f) {
    if (f.hand) return f.hand;
    f.rvNow = !!f.rev.length && f.rev[0].due <= f.turn;
    if (f.rvNow) return f.hand = [f.rev[0].c];
    if (f.deck.length < 3) f.deck.push(...shuffle(f.kit.qs.filter(c => !f.deck.includes(c) && c !== f.last && !f.rev.some(r => r.c === c))));
    if (!f.deck.length) f.deck = f.kit.qs.slice();
    // il y a toujours une carte Oral dans la main quand le monstre en a une (la première du paquet : elles tournent)
    const orals = f.deck.filter(c => c.k === 'oral').sort((a, b) => sue(f.it, a.pi) - sue(f.it, b.pi) || score(f.it, a.pi) - score(f.it, b.pi) || (a.pi < b.pi ? -1 : 1));   // d'abord ce que tu ne sais pas encore dire
    const h = [], d = [...orals.slice(0, 1), ...f.deck];
    for (const strict of [1, 0]) for (const c of d) if (h.length < 3 && !h.includes(c) && !(strict && h.some(x => x.k === c.k))) h.push(c);
    return f.hand = h;
  }

  // ---------- l'expédition : 5 étapes (2 combats, un coffre, un combat, le boss). ----------
  //   Pour passer par TOUT ce qu'on a choisi : chaque monstre est noté « rencontré » dès le départ (même si on perd),
  //   et on prend d'abord ceux qu'on n'a jamais vus, puis ceux qu'on n'a pas vus depuis le plus longtemps.
  //   Un seul revenant (un monstre où tu as fait des fautes) par expédition, et jamais deux expéditions de suite : il revient, mais ne prend pas toute la place.
  function start(pool) {
    const r = R(), miss = r.miss || {}, met = r.met = r.met || {}, E = r.exp = (r.exp || 0) + 1, last = x => met[x.id] || 0;
    const order = shuffle(pool).sort((a, b) => last(a) - last(b));
    const back = order.filter(x => miss[x.id] && last(x) && last(x) < E - 1).sort((a, b) => miss[b.id] - miss[a.id] || last(a) - last(b)).slice(0, 1);
    const rest = order.filter(x => !back.includes(x)), boss = rest.find(x => x.kind === 'f') || back[0] || order[0];
    const foes = [...back, ...rest].filter(x => x !== boss).slice(0, 3);
    while (foes.length < 3) foes.push(rnd(pool));
    for (const x of [...foes, boss]) met[x.id] = E;
    save();
    return { game: 'aventure', scr: 'map', i: 0, hp: hpMax(r), focus: 0, combo: 0, kills: [], gain: 0,
      nodes: [{ t: 'foe', it: foes[0] }, { t: 'foe', it: foes[1] }, { t: 'chest' }, { t: 'foe', it: foes[2] }, { t: 'boss', it: boss }] };
  }
  const oralBoss = it => it.kind === 'f' && (QZ[it.f.id] || []).filter(z => z.k.length).length > 1;   // le boss d'une fiche, c'est l'oral : toute la fiche, partie par partie
  // le caractère d'un monstre change la façon de le combattre (jamais au 1er combat ni face au boss)
  const STYLE = { vif: ['Vif', 'Il est vif : réponds avant la fin de la barre bleue pour frapper 40 % plus fort.'], cuir: ['Cuirassé', 'Il est cuirassé : les Questions font moitié moins mal. Sors le Tri, l\'Ordre, les Trous.'] };
  const TIME = k => k === 'qcm' ? 12 : k === 'oral' ? 60 : 30;   // face à un monstre vif : le temps pour le devancer, en secondes
  function enter() {
    const g = G(), r = R(), n = g.nodes[g.i];
    if (n.t === 'chest') return chest();
    const boss = n.t === 'boss', it = n.it, small = it.kind === 'a' && !it.x.nerf, max = Math.round((26 + 7 * r.lvl + 4 * g.i) * (boss ? 2.4 : small ? .6 : 1)), k = kit(it);
    const style = boss ? null : k.hard ? 'cuir' : !g.i ? null : rnd([null, 'vif', 'cuir'].filter(s => s !== 'cuir' || k.qs.filter(c => c.k !== 'qcm').length > 1));
    Object.assign(g, { scr: 'fight', anim: {}, msg: boss ? 'Le boss te barre la route. Qui est-ce ?' : 'Un monstre surgit ! Qui est-ce ?',
      foe: { it, boss, max, hp: max, was: max, atk: Math.round((5 + 1.2 * r.lvl + .5 * g.i) * (boss ? 1.3 : 1)), kit: k, style, deck: shuffle(k.qs), rev: [], wrong: [], turn: 0, miss: 0, si: 0,
        oral: boss && it.kind === 'f' && k.plan && k.plan.length > 1, q: [], pv: {}, scope: [], final: false },   // q : les parties de l'oral qui restent à dire, dans l'ordre du plan ; pv : la note de chacune
      t: { mode: 'id', st: { kind: 'qcm', ic: fam(it), clues: qsjClues(it).slice(0, 2), opts: qsjOpts(it), ok: it.title } } });
    const f = g.foe;
    if (f.oral) {   // l'oral blanc grandit à chaque fois : ce que tu sais déjà dire, plus 2 parties nouvelles
      const all = k.plan.map((_, j) => j), know = all.filter(j => sue(it, k.plan[j].pi)), fresh = all.filter(j => !know.includes(j));
      f.final = !fresh.length; f.scope = f.final ? all : [...know, ...fresh.slice(0, Math.max(2, 3 - know.length))].sort((a, b) => a - b); f.q = f.scope.slice();
    }
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
  // la bonne réponse d'un défi, en clair : [la question, la réponse] (pour le bilan de fin de combat)
  const sol = (st, t) => [st.q, st.kind === 'trous' ? st.segs.map(s => typeof s === 'string' ? s : `**${st.ok[s]}**`).join('') : st.kind === 'pick' ? st.items.filter(x => x[1]).map(x => plain(x[0])).join(' · ')
    : st.kind === 'ordre' ? st.items.map((x, i) => `${i + 1}. ${plain(x)}`).join('\n') : st.kind === 'oral' ? st.items.map((x, j) => (t && (t.ticks || []).includes(j) ? '✓ ' : '✗ **') + plain(x) + (t && (t.ticks || []).includes(j) ? '' : '**')).join('\n') : st.ok];
  function resolve(v) {   // v : la note de la réponse, de 0 à 1. C'est le jeu qui la calcule : plus rien n'est déclaré « sur l'honneur ».
    const g = G(), r = R(), t = g.t, f = g.foe, a = atk(r), name = f.it.title, c = t.card;
    t.done = true; g.anim = {}; f.was = f.hp; g.was = g.hp; did(1);
    // raté : il riposte, la faute est notée (le monstre reviendra tant qu'il n'est pas battu sans faute) et le défi revient en revanche
    const fail = again => { hitMe(); t.bad = true; f.wrong.push(sol(t.st, t)); r.miss = r.miss || {}; r.miss[f.it.id] = (r.miss[f.it.id] || 0) + 1; if (again) f.rev.push({ c, due: f.turn + 1 }); };
    const help = t.read ? .5 : t.hint ? .6 : 1;   // à l'oral, l'indice (les initiales) coûte 40 % des dégâts, lire la partie avant coûte 50 %
    if (t.st.kind === 'oral' && c && c.pi != null) {   // on garde la meilleure note de cette partie (avec une aide, elle ne peut pas passer « sue »)
      const o = (r.oral = r.oral || {})[f.it.id] = r.oral[f.it.id] || {}, was = sue(f.it, c.pi);
      o[c.pi] = Math.max(o[c.pi] || 0, +(v * help).toFixed(2)); t.learned = !was && sue(f.it, c.pi); save();
    }
    if (t.mode === 'id') {
      if (v) { g.focus = Math.min(3, g.focus + 1); hitFoe(a * .8); g.msg = `Reconnu : ${name} ! Tu frappes en premier.`; } else { hitMe(); g.msg = `C'était : ${name}. Il frappe en premier.`; }
      return;
    }
    f.turn++; f.hand = null;
    if (t.mode === 'atk') {
      const fast = f.style === 'vif' && Date.now() - t.t0 < TIME(c.k) * 1000, mult = KIND[c.k][1] * (t.rv ? 1.5 : 1) * (fast ? 1.4 : 1) * (f.style === 'cuir' && c.k === 'qcm' ? .5 : 1) * help;
      if (v >= .6) { g.combo++; g.focus = Math.min(3, g.focus + 1); const crit = g.combo >= 3 || t.rv; hitFoe(a * (.6 + .4 * v) * mult * (1 + .15 * (g.combo - 1)), crit);
        g.msg = v < 1 ? (c.k === 'oral' ? 'Touché, mais il manquait des idées : relis-les.' : 'Touché, mais pas tout juste : regarde la correction.') : t.rv ? 'Revanche prise : cette fois, tu le sais !' : fast ? 'Plus rapide que lui : +40 % de dégâts !' : crit ? `Série de ${g.combo} : coup critique !` : c.k === 'oral' ? 'Tout y était : le jury serait content !' : 'Touché !'; }
      else { fail(true); g.msg = `Raté : ${name} riposte. Retiens la correction : ce défi va revenir.`; }
    } else if (t.mode === 'spe') {
      if (v > 0) hitFoe(a * 2.5 * v, v >= .8); if (v < .6) fail(true);
      g.msg = v >= .8 ? 'Récitation solide : dégâts énormes !' : v >= .6 ? 'Récitation correcte : gros dégâts.' : 'Trop d\'oublis dans la récitation : il en profite. Elle va revenir.';
    } else if (t.mode === 'boss') {   // l'oral blanc : chaque partie dite enlève sa part de PV ; une partie ratée revient à la fin
      const n = f.scope.length, i = f.q.shift(); f.pv[i] = Math.max(f.pv[i] || 0, v * help);
      if (v > 0) hitFoe(f.max / n * 1.1 * v * help, v >= .99 && help === 1);
      if (v < .6) { fail(false); f.q.push(i); }
      if (!f.q.length && f.hp > 0) f.q = f.scope.slice().sort((x, y) => (f.pv[x] || 0) - (f.pv[y] || 0));   // tout est dit mais il tient encore : on reprend les parties les plus faibles
      g.msg = v >= .8 ? (help < 1 ? 'Partie dite, avec l\'aide des initiales. La prochaine fois, sans !' : 'Partie solide : le boss recule !') : v >= .6 ? 'Correct, mais il manquait des idées : relis-les.' : 'Trop d\'oublis : il riposte. Cette partie reviendra à la fin de l\'oral.';
    } else if (v * help >= (c.k === 'oral' ? .8 : .99)) {   // à l'oral, 80 % des idées sans indice suffisent pour l'achever
      hitFoe(f.hp, true); g.msg = f.it.kind === 'f' ? 'Coup de grâce : le bon traitement !' : 'Coup de grâce : sans une faute !'; }
    else { if (v > 0) hitFoe(a * v * help); fail(false); g.msg = f.it.kind === 'f' ? 'Traitement incomplet : il résiste et riposte.' : 'Pas tout à fait : il résiste et riposte.'; }
  }
  const resolve2 = v => { const t = G().t; resolve(v); if (t.learned) { G().msg = `Nouvelle partie sue : ${partName(G().foe.it, t.card.pi)} ! ` + G().msg; setTimeout(() => fx('star'), 350); } };
  function addXp(n) { const g = G(), r = R(); r.xp += n; g.gain += n; while (r.xp >= xpNext(r)) { r.xp -= xpNext(r); r.lvl++; g.up = true; g.hp = hpMax(r); } save(); }
  function after() {   // après un coup : victoire, K.O., ou retour au menu
    const g = G(), r = R(), f = g.foe;
    if (f.hp <= 0) {
      if (!f.wrong.length && r.miss) delete r.miss[f.it.id];   // battu sans une faute : ce n'est plus un revenant
      r.seen[f.it.id] = (r.seen[f.it.id] || 0) + 1; g.up = false; addXp((f.boss ? 45 : 18) + (f.miss ? 0 : 8));
      if (f.it.kind !== 'c') review(f.it.id, f.miss <= 1);   // fiche ou repère : il entre dans les révisions espacées
      g.kills.push(f.it); g.scr = 'win'; g.hp = Math.min(hpMax(r), g.hp + Math.round(hpMax(r) * .3));   // on souffle : +30 % de PV
      setTimeout(() => fx(g.up ? 'lvl' : 'win'), 200);
    } else if (g.hp <= 0) { g.scr = 'ko'; save(); fx('over'); }
    else { g.t = null; g.anim = {}; g.msg = f.style ? STYLE[f.style][1] : 'À toi de jouer : choisis ton défi.'; }
  }
  const tog = (t, j) => { t.ticks = t.ticks || []; t.ticks = t.ticks.includes(j) ? t.ticks.filter(x => x !== j) : t.ticks.concat(j); };

  function act(a, j, el) {
    const g = G(), r = R(), t = g.t, st = t && t.st, soft = () => A.render(true), hard = () => A.render();
    if (a === 'avhub') { A.setG({ game: 'aventure', scr: 'hub' }); fx('tap'); return hard(); }
    if (a === 'avbest') { g.scr = g.scr === 'best' ? 'hub' : 'best'; fx('tap'); return hard(); }
    if (a === 'aveq') { const k = el.dataset.k, s = ITEMS[k].s; r[s] = r[s] === k ? null : k; save(); fx('tick'); return soft(); }
    const M = window.SONS && SONS.play ? SONS : null;
    if (a === 'avmus') { r.mus = r.mus === false; save(); if (M) r.mus ? M.play('combat') : M.stop(); return soft(); }
    if (M && r.mus !== false && M.playing() !== 'combat') M.play('combat');
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
    const f = g.foe, go = (mode, c, more) => { g.t = Object.assign({ mode, card: c, st: make(c) }, more); g.anim = {}; fx('tap'); return soft(); };
    if (a === 'avnext') { after(); return hard(); }
    if (a === 'avcard') { const c = deal(f)[j]; if (!c) return;   // la carte jouée quitte le paquet ; les deux autres repartent au fond
      if (f.rvNow) f.rev.shift(); else f.deck = f.deck.filter(x => !f.hand.includes(x)).concat(f.hand.filter(x => x !== c));
      f.last = c; return go('atk', c, { rv: f.rvNow, t0: Date.now() }); }
    if (a === 'avspe') { if (!f.boss) g.focus -= 2; return go('spe', f.kit.says[f.si++ % f.kit.says.length]); }
    if (a === 'avfin') return go('fin', f.kit.fin || f.kit.says[0] || f.kit.qs[0]);
    if (a === 'avboss') return go('boss', f.kit.plan[f.q[0]], { part: f.q[0] });
    if (st && st.kind === 'oral' && !t.done) {   // l'oral : demander l'indice ou lire d'abord, réciter, puis vérifier ce qu'on a dit
      if (a === 'avhint' && !t.shown) { t.hint = true; fx('tick'); return soft(); }
      if (a === 'avread' && !t.shown) { t.reading = true; t.read = true; fx('tick'); return soft(); }   // une partie nouvelle : on la lit, on la cache, puis on la redit
      if (a === 'avhide') { t.reading = false; fx('tap'); return soft(); }
      if (a === 'avshow' && !t.shown && !t.reading) { t.shown = true; t.ticks = []; fx('reveal'); return soft(); }
      if ((!t.shown || t.reading) && (a === 'avtk' || a === 'avval' || a === 'avshow')) return;
    }
    if (a === 'avobj') { g.t = t && t.mode === 'obj' ? null : { mode: 'obj' }; g.anim = {}; fx('tap'); return soft(); }
    if (a === 'avuse') { const k = el.dataset.k; r.items[k]--; g.was = g.hp; g.hp = Math.min(hpMax(r), g.hp + ITEMS[k].v); g.t = null; g.anim = { heal: g.hp - g.was }; g.msg = `${ITEMS[k].n} : +${g.hp - g.was} PV. Dans la vraie vie : ${ITEMS[k].use.toLowerCase()}.`; save(); fx('good'); return soft(); }
    if (!st || t.done) return;
    if (a === 'avpick') { t.pick = j; resolve(st.opts[j] === st.ok ? 1 : 0); return soft(); }
    if (a === 'avtk') { tog(t, j); fx('tick'); return soft(); }   // tri : cocher ; ordre : l'ordre des touches fait l'ordre des étapes
    if (a === 'avbk') { t.fill = t.fill || st.ok.map(() => null); const i = t.fill.indexOf(null); if (i >= 0 && !t.fill.includes(j)) { t.fill[i] = j; fx('tick'); } return soft(); }   // un mot de la banque va dans le premier trou libre
    if (a === 'avbl') { if (t.fill) t.fill[j] = null; fx('tick'); return soft(); }   // toucher un trou rempli le vide
    if (a === 'avval') { const k = t.ticks || [], fl = t.fill || [];
      resolve2(st.kind === 'oral' ? k.length / st.items.length : st.kind === 'pick' ? Math.max(0, k.reduce((s, i) => s + (st.items[i][1] ? 1 : -1), 0)) / st.items.filter(x => x[1]).length
        : st.kind === 'ordre' ? k.filter((d, i) => st.sh[d] === i).length / st.items.length
        : st.ok.filter((w, i) => fl[i] != null && st.bank[fl[i]] === w).length / st.ok.length); return soft(); }
  }

  // ---------- l'affichage ----------
  const bar = (now, was, max, cls = '') => `<div class="avhp ${cls}" role="progressbar" aria-label="${cls === 'xp' ? 'Expérience' : 'Points de vie'}" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${now}"><i style="--f:${100 * was / max}%;--t:${100 * now / max}%"></i></div>`;
  const btn = (g, txt, c = 'var(--hl)', more = '') => `<button class="btn grow" data-g="${g}" style="--c:${c}" ${more}>${txt}</button>`;
  const head = (right, bg) => `<div class="wrap qz av" style="--bg:url(${scene(bg || 'grotte')})">${top('#/', '<img class="avlogo" src="jeu/ui-logo.png" alt="Podo Quest">', (right || '') + `<button class="avmusb ${R().mus === false ? 'off' : ''}" data-g="avmus" aria-label="Musique" aria-pressed="${R().mus !== false}">♪</button>`)}`;
  const stats = r => `<span class="avstat">${ico('flame')} Attaque ${atk(r)}</span><span class="avstat">Défense ${def(r)}</span>`;
  function qcard(t) {   // le défi en cours, selon son genre : choix, tri, ordre, trous. Après la réponse : la correction, et la leçon du livret si c'est raté.
    const st = t.st, k = t.ticks || [], c = t.card, q = `<div class="question">${md(st.q)}</div>`, hit = (off, n) => btn('avval', 'Frapper' + (n ? ` · ${n}` : ''), 'var(--p6)', off ? 'disabled' : '');
    const opts = () => `<div class="opts">${st.opts.map((o, j) => `<button class="opt ${t.done ? (o === st.ok ? 'good' : j === t.pick ? 'bad' : 'dim') : ''}" data-g="avpick" data-j="${j}" ${t.done ? 'disabled' : ''}>${md(o)}</button>`).join('')}</div>`;
    const les = t.done && t.bad && c && c.les && c.les.length ? `<div class="avles"><div class="kicker">À retenir · ${esc(c.lab)}</div><ul>${c.les.slice(0, 6).map(x => `<li>${md(x)}</li>`).join('')}</ul></div>` : '';
    if (st.clues) return `<div class="avclues">${t.done ? `<img class="avfic" alt="" src="jeu/ui-ic-${st.ic}.png">` : ''}${st.clues.map(c => `<div><b>${esc(c[0])}</b> ${md(c[1])}</div>`).join('')}</div>${opts()}`;
    if (st.kind === 'qcm') return q + opts() + les;
    if (st.kind === 'oral') {   // avant : la question seule (ou les initiales si on a pris l'indice) ; après : les idées, à cocher
      const n = st.items.length, f = G().foe, it = f && f.it, pi = c && c.pi;
      const fresh = it && pi != null && !sue(it, pi), noHelp = t.mode === 'spe' || (t.mode === 'boss' && f.final);
      if (t.reading) return `${q}<div class="kicker" style="margin-top:10px">LIS ET RETIENS · ${n} IDÉE${n > 1 ? 'S' : ''}</div><ul class="aplist avread">${st.items.map(x => `<li>${md(x)}</li>`).join('')}</ul>
        ${btn('avhide', 'C\'est en tête → je cache et je récite', 'var(--hl)')}`;
      if (!t.shown) return `${fresh && !t.read ? `<div class="avnew">Nouvelle partie à apprendre</div>` : ''}${q}${t.hint ? `<ul class="avini">${st.items.map(x => `<li>${esc(initials(x))}</li>`).join('')}</ul>` : `<div class="avsay">${ico('speak')} ${n} idée${n > 1 ? 's' : ''} à dire. À voix haute, sans regarder.</div>`}
        <div class="avoral">${!noHelp && !t.hint && !t.read ? `<button class="btn ghost grow" data-g="avhint">Indice : les initiales (−40 %)</button>` : ''}${!noHelp && fresh && !t.read && !t.hint ? `<button class="btn ghost grow" data-g="avread">La lire d'abord (−50 %)</button>` : ''}</div>
        ${t.read ? '<div class="muted small">Tu l\'as lue : redis-la maintenant sans regarder. Elle comptera comme sue quand tu la diras sans aide.</div>' : ''}
        ${btn('avshow', 'J\'ai récité → vérifier', 'var(--hl)')}`;
      const k = t.ticks || [], miss = n - k.length;
      const rows = st.items.map((x, j) => t.done ? `<div class="ck ${k.includes(j) ? 'yes' : 'miss'}"><span class="box"></span><span>${md(x)}</span></div>` : `<button class="ck ${k.includes(j) ? 'on' : ''}" data-g="avtk" data-j="${j}"><span class="box"></span><span>${md(x)}</span></button>`).join('');
      return `${q}<div class="muted small">${t.done ? (miss ? `En rouge, ce que tu as oublié (${miss}) : redis-le une fois à voix haute.` : 'Tout y était.') : 'Touche chaque idée que tu as vraiment dite (pas celles que tu reconnais en les lisant).'}</div>
        <div class="checks">${rows}</div>${t.done && st.full ? `<details class="avheardd" ${miss ? 'open' : ''}><summary>${ico('speak')} Ce qu'on dit à l'oral</summary><p>${md(st.full)}</p></details>` : ''}${t.done ? '' : hit(false, `${k.length}/${n}`)}`;
    }
    if (st.kind === 'pick') return `${q}<div class="checks">${st.items.map((x, j) => `<button class="ck ${k.includes(j) ? 'on' : ''} ${t.done ? (x[1] ? 'yes' : 'no') : ''}" data-g="avtk" data-j="${j}" ${t.done ? 'disabled' : ''}><span class="box"></span><span>${md(x[0])}</span></button>`).join('')}</div>${t.done ? les : hit(!k.length, k.length)}`;
    if (st.kind === 'ordre') return q + (t.done   // après la réponse : le bon ordre, en rouge les étapes qui n'étaient pas à leur place
      ? `<div class="checks">${st.items.map((x, i) => `<div class="ck num ${st.sh[k[i]] === i ? 'yes' : 'miss'}"><span class="box">${i + 1}</span><span>${md(x)}</span></div>`).join('')}</div>${les}`
      : `<div class="checks">${st.sh.map((d, j) => `<button class="ck num ${k.includes(j) ? 'on' : ''}" data-g="avtk" data-j="${j}"><span class="box">${k.indexOf(j) + 1 || ''}</span><span>${md(st.items[d])}</span></button>`).join('')}</div>${hit(k.length < st.items.length)}`);
    const fl = t.fill || [], gap = i => { const w = fl[i] != null ? st.bank[fl[i]] : '', good = w === st.ok[i];
      return t.done ? `<span class="avgap ${good ? 'good' : 'bad'}">${good || !w ? '' : `<s>${esc(w)}</s> `}${esc(st.ok[i])}</span>` : `<button class="avgap ${w ? 'on' : ''}" data-g="avbl" data-j="${i}" aria-label="Trou ${i + 1}">${w ? esc(w) : '&nbsp;'}</button>`; };
    return `${q}<div class="avtxt">${st.segs.map(s => typeof s === 'string' ? md(s) : gap(s)).join('')}</div>${t.done ? les : `<div class="avbank">${st.bank.map((w, j) => `<button class="avchip" data-g="avbk" data-j="${j}" ${fl.includes(j) ? 'disabled' : ''}>${esc(w)}</button>`).join('')}</div>${hit(fl.filter(x => x != null).length < st.ok.length)}`}`;
  }
  // ce qu'on a raté pendant le combat, avec la bonne réponse (écrans de victoire et de défaite)
  const recap = f => { const seen = new Set(), w = f.wrong.filter(x => !seen.has(x[0]) && seen.add(x[0])); return w.length ? `<div class="avles"><div class="kicker">À revoir · ${w.length} faute${w.length > 1 ? 's' : ''}</div>${w.map(x => `<p><b>${md(x[0])}</b><br>${md(x[1])}</p>`).join('')}</div>` : ''; };
  function fight() {
    const g = G(), r = R(), f = g.foe, t = g.t, an = g.anim || {}, idp = t && t.mode === 'id' && !t.done, p = f.hp / f.max, max = hpMax(r);
    const kind = f.boss ? 'boss' : BIOME[fam(f.it)];
    const arena = `<div class="avscene ${kind} ${an.crit ? 'flash' : ''}" style="background-image:url(${scene(kind)})">
      <div class="avplate"><span class="avportrait"><img src="jeu/heros-v2.png" alt=""></span><div class="avplate-info"><b>Toi · Nv ${r.lvl}</b>${bar(g.hp, g.was == null ? g.hp : g.was, max, 'me')}<span><i class="avheart" aria-hidden="true">♥</i> ${g.hp}/${max} PV ${[0, 1, 2].map(i => `<i class="avpip ${i < g.focus ? 'on' : ''}"></i>`).join('')}${g.combo > 1 ? ` ×${g.combo}` : ''}</span></div></div>
      <div class="avplate foe"><span class="avportrait ${idp ? 'unknown' : ''}"><img src="jeu/monstre-${fam(f.it)}-v2.png" alt=""></span><div class="avplate-info"><b>${idp ? '???' : esc(f.it.title)}</b>${bar(f.hp, f.was, f.max)}<span>${f.boss ? 'BOSS · ' : f.style ? STYLE[f.style][0].toUpperCase() + ' · ' : ''}${esc(f.it.lab)}</span></div></div>
      <div class="avpos me ${an.me ? 'ouch' : an.heal ? 'heal' : ''}">${HERO(an.foe ? 'lunge' : an.me ? 'hurt' : 'idle')}${an.dM ? `<span class="avdmg me">-${an.dM}</span>` : an.heal ? `<span class="avdmg heal">+${an.heal}</span>` : ''}</div>
      <div class="avpos foe ${an.foe ? 'slash' : ''} ${an.crit ? 'rays' : ''}">${sprite(f.it, (idp ? 'sil ' : '') + (an.foe ? 'hit' : 'idle'), f.boss)}${an.dF ? `<span class="avdmg ${an.crit ? 'crit' : ''}">-${an.dF}</span>` : ''}</div></div>
      <div class="avbox">${esc(g.msg || '')}</div>`;
    let body;
    if (t && t.mode === 'obj') body = `<div class="card qc"><div class="kicker">TES SOINS</div><div class="avlist">${soins(r).map(k => `<button class="ptitem" data-g="avuse" data-k="${k}">${OBJ(k)}<b>${esc(ITEMS[k].n)}</b> ×${r.items[k]} · +${ITEMS[k].v} PV<br><span class="muted">${esc(ITEMS[k].use)}</span></button>`).join('')}</div><button class="btn ghost wide" data-g="avobj" style="margin-top:10px">Retour</button></div>`;
    else if (t) { const K = t.card && KIND[t.card.k], T = t.mode === 'atk' && f.style === 'vif' && !t.done ? TIME(t.card.k) : 0;   // monstre vif : la barre bleue se vide, il faut répondre avant
      const kick = t.mode === 'spe' ? 'RÉCITATION SANS INDICE · DÉGÂTS ×2,5' : t.mode === 'fin' ? 'COUP DE GRÂCE' : t.mode === 'boss' ? `${f.final ? 'L\'ORAL COMPLET' : 'L\'ORAL'} · PARTIE ${t.card.pi + 1}/${f.it.f.parts.length}` : K ? `${t.rv ? 'REVANCHE · ' : ''}${K[0]} · ${esc(t.card.lab)}` : '';
      const tip = t.mode === 'spe' ? 'Toute la partie, de mémoire, à voix haute.' : t.mode === 'boss' ? 'Comme devant le jury : dis la partie à voix haute, sans regarder.' : K ? K[3] : '';
      body = `<div class="card qc">${T ? `<div class="avtime"><i style="animation-duration:${T}s;animation-delay:-${Math.min(T, (Date.now() - t.t0) / 1000).toFixed(1)}s"></i></div>` : ''}${t.mode === 'id' ? '' : `<div class="kicker">${kick}</div>${t.done || t.shown ? '' : `<div class="muted small">${tip}</div>`}`}${qcard(t)}</div>${t.done ? `<div class="pager fixed">${btn('avnext', f.hp <= 0 ? 'Victoire →' : g.hp <= 0 ? 'Aïe…' : 'Suite →')}</div>` : ''}`; }
    else {   // le menu : une main de défis (plus c'est dur, plus ça frappe), la revanche si un défi raté revient ; face au boss, c'est lui qui impose le style (3 phases)
      const spe = f.kit.says.length, m = [], hand = deal(f), x = n => String(n).replace('.', ',');
      const cards = () => hand.forEach((c, j) => m.push(f.rvNow ? ['avcard', 'Revanche', `Raté tout à l'heure : ${c.lab} · dégâts ×1,5`, 'var(--red)', 0, j] : ['avcard', KIND[c.k][0], `${c.lab} · dégâts ×${x(KIND[c.k][1])}`, KIND[c.k][2], 0, j]));
      if (f.oral) { const i = f.q[0], c = f.kit.plan[i]; m.push(['avboss', `Partie ${c.pi + 1}${sue(f.it, c.pi) ? '' : ' · nouvelle'}`, `${c.lab.replace(/^\d+\. /, '')} · à dire à voix haute${f.pv[i] != null ? ' · à reprendre' : ''}`, 'var(--p1)']); }
      else if (f.boss) { if (f.rvNow || p > .66) cards(); else m.push(p > .33 && spe ? ['avspe', 'Récitation', 'Phase 2 : seule une partie récitée perce son armure', 'var(--p3)'] : ['avfin', 'Coup de grâce', 'Phase 3 : trouve le bon traitement', 'var(--red)']); }
      else { cards();
        m.push(['avspe', 'Récitation', g.focus >= 2 && spe ? 'Toute une partie · dégâts ×2,5 · coûte 2 de concentration' : 'Il faut 2 de concentration (2 bonnes réponses)', 'var(--p3)', g.focus < 2 || !spe]);
        m.push(['avfin', 'Coup de grâce', p <= .35 ? (f.kit.fin && f.kit.fin.k === 'oral' ? 'Dis tout le traitement : il tombe d\'un coup' : f.it.kind === 'f' ? 'Le bon traitement le termine d\'un coup' : 'Sans une faute, il tombe d\'un coup') : 'Quand il est sous 35 % de PV', 'var(--red)', p > .35]); }
      m.push(['avobj', 'Soins', soins(r).length ? `${soins(r).reduce((s, k) => s + r.items[k], 0)} dans le sac` : 'Sac vide', 'var(--p6)', !soins(r).length]);
      const said = f.oral ? f.scope.filter(i => (f.pv[i] || 0) >= .6).length : 0, newN = f.oral ? f.scope.filter(i => !sue(f.it, f.kit.plan[i].pi)).length : 0;
      body = `${f.oral ? `<div class="muted small" style="margin-bottom:8px">${f.final ? `L'oral complet, sans aide : les ${f.scope.length} parties, dans l'ordre du plan.` : `Le boss, c'est l'oral : ${f.scope.length} parties aujourd'hui (${f.scope.length - newN} que tu sais, ${newN} nouvelle${newN > 1 ? 's' : ''}). À chaque victoire, la fiche grandit.`} ${said}/${f.scope.length} réussies. ${dots(f.it)}</div>` : f.boss && !f.rvNow && p > .66 ? '<div class="muted small" style="margin-bottom:8px">Phase 1 : brise sa garde avec tes défis.</div>' : ''}<div class="avmenu">${m.map(([a, n, d, c, off, j]) => `<button class="avact" data-g="${a}" ${j != null ? `data-j="${j}"` : ''} style="--c:${c}" ${off ? 'disabled' : ''}><img alt="" src="jeu/ui-act-${{ avcard: 'atk', avspe: 'spe', avfin: 'fin', avobj: 'soin', avboss: 'spe' }[a]}.png"><b>${n}</b><span>${esc(d)}</span></button>`).join('')}</div>`;
    }
    return `${head(count(`Étape ${g.i + 1}`, g.nodes.length), kind)}${arena}${body}</div>`;
  }
  const NODE = { foe: '<path d="M-6 6L6-6M1-6h5v5M-7 3l4 4"/>', chest: '<rect x="-7" y="-5" width="14" height="10" rx="2"/><path d="M-7-1h14M0-2v3"/>', boss: '<path d="M-8 5l-1-10 5 5 4-7 4 7 5-5-1 10z"/>' };
  const POS = [[38.7, 64.2], [66.8, 52.8], [43.3, 42.1], [53.4, 28.3], [69.5, 15.9]];   // les 5 étapes sur la carte dessinée, en % (le rond du bas est le départ)
  function map() {
    const g = G(), r = R(), n = g.nodes[g.i], max = hpMax(r), back = n.it && (r.miss || {})[n.it.id];
    return `${head(count(`Étape ${g.i + 1}`, g.nodes.length))}
      <div class="avworld">${g.nodes.map((x, i) => `<span class="avpin ${i < g.i ? 'done' : i === g.i ? 'now' : ''} ${x.t}" style="left:${POS[i][0]}%;top:${POS[i][1]}%" aria-label="Étape ${i + 1}${i < g.i ? ', terminée' : i === g.i ? ', en cours' : ''}">${i < g.i ? '✓' : `<svg viewBox="-12 -12 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${NODE[x.t]}</svg>`}</span>`).join('')}<img class="avspr art avwho" alt="" src="jeu/heros-v2.png" style="left:${POS[g.i][0]}%;top:${POS[g.i][1]}%"></div><div class="card avmap"><div class="avhud"><b>Toi · Nv ${r.lvl}</b>${bar(g.hp, g.hp, max, 'me')}<span class="muted">${g.hp}/${max} PV</span></div></div>
      <div class="card qc"><div class="kicker">${n.t === 'chest' ? 'UN COFFRE' : n.t === 'boss' ? 'LE BOSS' : back ? 'UN REVENANT' : 'UN MONSTRE'}</div>
        <div class="question">${n.t === 'chest' ? 'Un coffre au bord du chemin.' : n.t === 'boss' ? 'Une ombre énorme garde la sortie.' : 'Quelque chose bouge devant toi…'}</div>
        <div class="muted small">${n.t === 'chest' ? 'Pour garder l\'objet, il faut savoir à quoi il sert.' : n.t === 'boss' ? (oralBoss(n.it) ? `Le boss, c'est l'oral : tu récites sa fiche à voix haute, comme devant le jury. Les parties que tu sais, plus 2 nouvelles (tu en sais ${nSue(n.it)}/${pisOf(n.it).length}).` : 'Trois phases : tes défis, la récitation, puis le coup de grâce.') : back ? 'Tu as fait des fautes contre lui : il revient tant que tu ne l\'as pas battu sans faute.' : 'Reconnais-le à ses signes pour frapper le premier.'}</div></div>
      <div class="pager fixed">${btn('avgo', n.t === 'chest' ? 'Ouvrir le coffre →' : 'Avancer →')}</div></div>`;
  }
  function hub() {
    const r = R(), gear = Object.keys(ITEMS).filter(k => ITEMS[k].s !== 'soin' && r.items[k]), heal = soins(r), M = window.SONS, pool = A.pool(), n = pool.length, seen = Object.keys(r.seen).length, fresh = pool.filter(x => !(r.met || {})[x.id]).length;
    const fs = pool.filter(x => x.kind === 'f' && pisOf(x).length), full = fs.filter(x => nextPart(x) == null).length, parts = fs.reduce((t, x) => t + nSue(x), 0), tot = fs.reduce((t, x) => t + pisOf(x).length, 0);
    return `${head(`<span class="count">Nv ${r.lvl}</span>`)}
      <div class="card avcamp" style="background-image:linear-gradient(90deg,rgba(14,13,19,.2),rgba(14,13,19,.92) 62%),url(${scene('foret')})">${HERO('idle')}<div class="avhud"><div class="kicker">TON PODOLOGUE · ${r.runs} EXPÉDITION${r.runs > 1 ? 'S' : ''}</div><b>Niveau ${r.lvl}</b>${bar(r.xp, r.xp, xpNext(r), 'xp')}<span class="muted">${r.xp}/${xpNext(r)} XP · ${hpMax(r)} PV</span><div>${stats(r)}</div></div></div>
      <div class="muted small">Chaque monstre est une fiche, un repère ou un test. Reconnais-le, puis choisis ton défi : la carte <b>Oral</b> (dire une partie à voix haute) frappe le plus fort. Le boss, c'est l'oral d'une fiche entière. Un défi raté revient en revanche.</div>
      ${n ? `<div class="muted small" style="margin-top:6px">Ta sélection : ${n} monstre${n > 1 ? 's' : ''}${fresh ? ` · ${fresh} jamais rencontré${fresh > 1 ? 's' : ''}` : ' · tous rencontrés'}. Les expéditions passent par tous avant de revenir aux mêmes.</div>` : ''}
      ${fs.length ? `<div class="card avprog"><div class="kicker">TON ORAL</div><div><b>${full}/${fs.length}</b> fiche${fs.length > 1 ? 's' : ''} que tu sais réciter en entier · ${parts}/${tot} parties sues</div><div class="muted small">Une partie est sue quand tu la dis à 80 %, sans indice ni lecture. Chaque monstre battu t'en fait apprendre une de plus ; le boss te fait réciter tout ce que tu sais, plus 2 nouvelles.</div></div>` : ''}
      ${gear.length ? `<div class="sec">TON ÉQUIPEMENT (TOUCHE POUR ÉQUIPER)</div><div class="avlist">${gear.map(k => { const it = ITEMS[k], on = r[it.s] === k; return `<button class="ptitem ${on ? 'good' : ''}" data-g="aveq" data-k="${k}">${OBJ(k)}<b>${esc(it.n)}</b> · ${it.s === 'arme' ? 'attaque' : 'défense'} +${it.v}${on ? ' · équipé' : ''}<br><span class="muted">${esc(it.use)}</span></button>`; }).join('')}</div>` : ''}
      ${heal.length ? `<div class="sec">TES SOINS</div><div class="avlist">${heal.map(k => `<div class="ptitem">${OBJ(k)}<b>${esc(ITEMS[k].n)}</b> ×${r.items[k]} · +${ITEMS[k].v} PV<br><span class="muted">${esc(ITEMS[k].use)}</span></div>`).join('')}</div>` : ''}
      <div class="row2" style="margin-top:14px"><button class="btn ghost grow" data-g="setup">Ce que je révise (${n})</button><button class="btn ghost grow" data-g="avbest">Bestiaire (${seen})</button></div>
      <div class="pager fixed">${btn('go', n ? 'Partir en expédition →' : 'Rien à combattre avec ce choix', 'var(--hl)', n ? '' : 'disabled')}</div></div>`;
  }
  function best() {
    const r = R(), all = A.all(), seen = all.filter(x => r.seen[x.id]);
    return `${head(count(seen.length, all.length))}<div class="muted small">Les monstres que tu as battus, et ce qu'il faut retenir pour les battre. Touche-en un pour revoir sa fiche.</div>
      <div class="avbest">${seen.map(x => { const w = weak(x); return `<a class="card avmon" href="${x.link}">${sprite(x)}<span><b>${esc(x.title)}</b><span class="muted">${esc(x.lab)} · battu ${r.seen[x.id]} fois</span>${pisOf(x).length ? dots(x) : ''}${w ? `<span class="avweak"><b>${esc(w[0])}</b> ${md(w[1])}</span>` : ''}</span></a>`; }).join('') || '<div class="muted">Aucun monstre battu pour l\'instant.</div>'}</div>
      <div class="pager fixed"><button class="btn ghost grow" data-g="avbest">← Retour au camp</button></div></div>`;
  }
  function view() {
    const g = G(), r = R();
    if (g.scr === 'hub') return hub();
    if (g.scr === 'best') return best();
    if (g.scr === 'map') return map();
    if (g.scr === 'fight') return fight();
    if (g.scr === 'chest') { const t = g.t, it = ITEMS[t.item];
      return `${head('')}<div class="card gover avchest">${CHEST(t.done && t.won, t.done ? '' : 'shake')}${t.done && t.won ? OBJ(t.item) : ''}
        <div class="kicker">${t.done ? (t.won ? 'OBJET GAGNÉ' : 'LE COFFRE SE REFERME') : 'DANS LE COFFRE'}</div><div class="question">${esc(it.n)}</div>
        ${t.done ? `<div class="muted">${t.won ? `${it.s === 'soin' ? `Soin : +${it.v} PV` : it.s === 'arme' ? `Arme : attaque +${it.v}` : `Protection : défense +${it.v}`}. ` : 'Tu ne sais pas encore t\'en servir. '}Il sert à : ${esc(it.use.toLowerCase())}.</div>` : ''}</div>
        <div class="card qc">${qcard(t)}</div>${t.done ? `<div class="pager fixed">${btn('avnext', g.last ? 'Fin de l\'expédition →' : 'Continuer →')}</div>` : ''}</div>`; }
    const f = g.foe, w = weak(f.it);
    if (g.scr === 'win') return `${head('')}<div class="card gover">${sprite(f.it, 'ko', f.boss)}<img class="avban" alt="Victoire" src="jeu/ui-ban-victoire.png">${g.up ? '<img class="avban" alt="Niveau supérieur" src="jeu/ui-ban-niveau.png">' : ''}<div class="kicker">${f.boss ? 'BOSS VAINCU' : 'MONSTRE BATTU'}${f.miss ? '' : ' · SANS FAUTE'}</div><div class="question">${esc(f.it.title)}</div>
        ${w ? `<div class="ptcle"><b>${esc(w[0])}</b> ${md(w[1])}</div>` : ''}${progress(f.it)}${recap(f)}<div class="muted" style="margin-top:8px">Tu souffles : +30 % de PV · +${(f.boss ? 45 : 18) + (f.miss ? 0 : 8)} XP${g.up ? ` · <b>Niveau ${r.lvl} !</b> PV rendus, attaque +2` : ''}</div></div>
        <div class="pager fixed">${btn('avcont', f.boss ? 'Ouvrir son trésor →' : 'Continuer →')}</div></div>`;
    if (g.scr === 'ko') return `${head('')}<div class="card gover">${sprite(f.it, 'idle', f.boss)}<img class="avban" alt="Défaite" src="jeu/ui-ban-defaite.png"><div class="question">${esc(f.it.title)} t'a eu.</div>
        ${w ? `<div class="ptcle"><b>${esc(w[0])}</b> ${md(w[1])}</div>` : ''}${progress(f.it)}${recap(f)}<div class="muted" style="margin-top:8px">Tu gardes tes ${g.gain} XP et tes objets. Revois sa fiche et reviens te venger.</div>
        <div class="row2" style="margin-top:12px"><a class="btn ghost grow" href="${f.it.link}">${ico('book')} Sa fiche</a></div></div>
        <div class="pager fixed">${btn('go', '↻ Nouvelle expédition')}<button class="btn ghost grow" data-g="avhub">Camp</button></div></div>`;
    return `${head('')}<div class="card gover">${HERO('idle')}<div class="kicker">EXPÉDITION RÉUSSIE</div><div class="gscore">+${g.gain} XP</div><div class="question">Niveau ${r.lvl} · ${g.kills.length} monstres battus</div></div>
      <div class="avbest">${g.kills.map(x => `<a class="card avmon" href="${x.link}">${sprite(x)}<span><b>${esc(x.title)}</b><span class="muted">${esc(x.lab)}</span></span></a>`).join('')}</div>
      <div class="pager fixed">${btn('go', '↻ Nouvelle expédition')}<button class="btn ghost grow" data-g="avhub">Camp</button></div></div>`;
  }
  return { start, view, act, kit };   // kit : pour tools/check-aventure.js
};
