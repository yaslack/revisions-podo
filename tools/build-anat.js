// Builds data/anat.js (window.ANAT_Q, window.ANAT_PL): the 59 structures of « Questions Anatomie Palpatoire.docx », in its
// order, from the old site's palpation route, landmarks and muscle cards; the structures it lacked are written here.
// Each question links to the atlas plates whose legend names it (palpation route plates first).
// usage: node tools/build-anat.js OLD_INDEX.html
const fs = require('fs');
const old = fs.readFileSync(process.argv[2], 'utf8');
const L = old.split('\n');
let i = L.findIndex(l => l.startsWith('const ANAT=[')), j = i; while (!L[j].startsWith('];')) j++;
const A = JSON.parse('[' + L.slice(i + 1, j).join('\n').replace(/,\s*$/, '') + ']');
const ART = JSON.parse(old.match(/const ANATART=(\{.*\});/)[1]);
const NERFS = Function('return ' + old.slice(old.indexOf('const NERFS={') + 12, old.indexOf('};', old.indexOf('const NERFS={')) + 1))();
const parc = {}, palp = {}, mus = {}, oldId = {};
// identifiants des cartes de l'ancien site (v32), pour reprendre la progression de ceux qui l'utilisaient
A.find(x => x.id === 'a-parcours').parc.forEach(([, items], zi) => items.forEach(([n, pos, how, chk], ii) => { parc[n] = { pos, how, chk }; oldId['p:' + n] = ['a-parcours-x' + zi + '-' + ii]; }));
for (const f of A) { (f.palp || []).forEach(([n, x]) => (palp[n] = x)); (f.mus || []).forEach((m, i) => { mus[m.n] = m; oldId['m:' + m.n] = ['p', 'o', 't', 'n', 'a'].map(k => f.id + '-m' + i + k); }); }
const need = (o, k) => { if (!o[k]) throw new Error('source introuvable : ' + k); return o[k]; };
const fromParc = k => ({ ...need(parc, k), old: oldId['p:' + k] });
const fromMus = (k, extra = {}) => { const m = need(mus, k); const nf = NERFS[m.nf]; return { pos: '', how: m.p, chk: '', o: m.o, t: m.t, nerf: nf ? `${nf[0]} (${nf[1]})` + (m.nn ? ` · ${m.nn}` : '') : '', act: m.a, old: oldId['m:' + k], ...extra }; };

// Classement demandé : région (pied, jambe, cuisse ; le bassin et la hanche vont avec la cuisse), puis os ou muscles.
const R = { pied: 'Pied', jambe: 'Jambe', cuisse: 'Cuisse, hanche & bassin' };
const REG = { bassin: 'cuisse', cuisse: 'cuisse', jambe: 'jambe', pied: 'pied' };
const GROUP = { os: 'Os', muscle: 'Muscles', tendon: 'Muscles' };
// q, name, region, kind (os | muscle | tendon), content, plate keywords (normalised, accents removed)
const Q = [
  [1, 'Épine iliaque postéro-supérieure (EIPS)', 'bassin', 'os', { ...fromParc('EIPS'), chk: 'À hauteur de S2 : ce sont les **fossettes lombaires**, une de chaque côté du sacrum (gauche et droite). Comparer les deux : une fossette plus haute = hémibassin plus haut de ce côté.\n\n**Bassin vu de profil** (EIPS comparée à l’EIAS du même côté) : normalement l’EIPS est un peu plus haute (≈ 1 à 2 travers de doigt). **Antéversion** : l’EIPS **monte** (nettement plus haute que l’EIAS), lordose lombaire accentuée. **Rétroversion** : l’EIPS **descend** (au niveau ou en dessous de l’EIAS), lordose effacée.\n\n**Gauche / droite** : EIPS **et** EIAS plus hautes du même côté = **bascule latérale** (membre plus long de ce côté ?) ; EIPS plus basse mais EIAS plus haute du même côté = **torsion** de l’iliaque (rotation postérieure de cet os coxal).' }, ['epine iliaque postero']],
  [2, 'Crête iliaque', 'bassin', 'os', { ...fromParc('Crête iliaque'), chk: 'Son sommet est à hauteur de L4–L5 : comparer droite et gauche (bassin horizontal ?).\n\nEn **antéversion**, la partie **antérieure** de la crête (vers l’EIAS) descend et la partie **postérieure** (vers l’EIPS) monte ; en **rétroversion**, c’est l’inverse : l’avant monte, l’arrière descend.' }, ['crete iliaque']],
  [3, 'Épine iliaque antéro-supérieure (EIAS)', 'bassin', 'os', { ...fromParc('EIAS'), chk: 'Le sartorius et le TFL partent juste en dessous : ils se tendent en flexion de hanche.\n\n**Bassin vu de profil** (EIAS comparée à l’EIPS du même côté) : normalement l’EIAS est un peu plus basse que l’EIPS. **Antéversion** (bascule du bassin vers l’avant) : l’EIAS **descend** et avance, la partie **antérieure** de la crête iliaque est plus basse, la partie **postérieure** plus haute. **Rétroversion** (bascule vers l’arrière) : l’EIAS **monte** et recule, la partie **antérieure** de la crête est plus haute, la partie **postérieure** plus basse.\n\n**Gauche / droite** : comparer les deux EIAS (pouces posés dessus) et les deux fossettes des EIPS de part et d’autre du sacrum : les deux plus hautes du même côté = **bascule latérale** ; EIAS haute et EIPS basse du même côté = **torsion** de l’iliaque.' }, ['epine iliaque antero-sup']],
  [4, 'Grand trochanter', 'bassin', 'os', fromParc('Grand trochanter'), ['grand trochanter']],
  [5, 'Moyen fessier', 'bassin', 'muscle', fromMus('Moyen fessier'), ['moyen fessier']],
  [6, 'Grand fessier', 'bassin', 'muscle', fromMus('Grand fessier'), ['grand fessier']],
  [8, 'Ischio-jambiers', 'cuisse', 'muscle', {
    pos: 'Procubitus, genou légèrement fléchi.',
    how: 'Flexion du genou contrariée : les tendons encadrent le **creux poplité**. En dehors, le **biceps fémoral** (vers la tête de la fibula) ; en dedans, le **semi-tendineux** (fin, saillant) et le **semi-membraneux** (plus large, plus profond). Remonter les corps musculaires jusqu’à la **tubérosité ischiatique**.',
    chk: 'Les 3 tendons se tendent en flexion contrariée ; genou fléchi, la rotation externe fait saillir le biceps, la rotation interne les deux médiaux.',
    o: '**Tubérosité ischiatique** (long chef du biceps, semi-tendineux, semi-membraneux)', t: 'Biceps : tête de la fibula · semi-tendineux : patte d’oie · semi-membraneux : condyle médial du tibia',
    nerf: 'N. sciatique (L4–S3)', act: '**Extension de hanche + flexion du genou** (muscles bi-articulaires).',
  }, ['^ischio-jambiers']],
  [9, 'Piriforme', 'bassin', 'muscle', fromMus('Piriforme'), ['piriforme']],
  [10, 'Ilio-psoas', 'bassin', 'muscle', fromMus('Ilio-psoas (psoas + iliaque)'), ['psoas', 'iliaque']],
  [11, 'Sartorius', 'cuisse', 'muscle', fromMus('Sartorius (couturier)'), ['sartorius']],
  [12, 'Droit fémoral', 'cuisse', 'muscle', fromMus('Droit fémoral'), ['droit femoral']],
  [13, 'Long adducteur', 'cuisse', 'muscle', fromMus('Long adducteur'), ['long adducteur']],
  [14, 'Gracile', 'cuisse', 'muscle', fromMus('Gracile (droit interne)'), ['gracile']],
  [15, 'Tenseur du fascia lata (TFL)', 'bassin', 'muscle', fromMus('Tenseur du fascia lata (TFL)'), ['tenseur du fascia', 'fascia lata']],
  [16, 'Patella', 'cuisse', 'os', fromParc('Patella'), ['patella']],
  [17, 'Tubérosité tibiale', 'jambe', 'os', {
    pos: 'Assis, genou fléchi à 90°.',
    how: 'Partir de la pointe de la patella et descendre le long du ligament patellaire jusqu’à la **saillie osseuse antérieure** du tibia.',
    chk: 'C’est l’arrivée du **ligament patellaire** (appareil extenseur du quadriceps) ; elle est à peu près à hauteur de la tête de la fibula.',
  }, ['tuberosite tibiale']],
  [18, 'Tête de la fibula', 'jambe', 'os', fromParc('Tête de la fibula'), ['tete de la fibula']],
  [19, 'Tubercule infracondylaire du tibia (tubercule de Gerdy)', 'jambe', 'os', fromParc('Tubercule de Gerdy'), ['gerdy']],
  [20, 'Biceps fémoral', 'cuisse', 'muscle', fromMus('Biceps fémoral'), ['biceps femoral']],
  [21, 'Semi-tendineux', 'cuisse', 'muscle', fromMus('Semi-tendineux'), ['semi-tendineux']],
  [22, 'Semi-membraneux', 'cuisse', 'muscle', fromMus('Semi-membraneux'), ['semi-membraneux']],
  [23, 'Gastrocnémien', 'jambe', 'muscle', fromMus('Gastrocnémiens (jumeaux)'), ['gastrocnemien']],
  [24, 'Ligament patellaire', 'cuisse', 'tendon', {
    pos: 'Assis genou fléchi à 90°, ou décubitus dorsal genou tendu.',
    how: 'La **corde** tendue entre la **pointe de la patella** et la **tubérosité tibiale** : la pincer entre pouce et index.',
    chk: 'Elle se tend quand le patient contracte le quadriceps (extension du genou) et devient souple quand il se relâche.',
  }, ['ligament patellaire']],
  [25, 'Vaste médial', 'cuisse', 'muscle', fromMus('Vaste médial'), ['vaste medial']],
  [26, 'Vaste latéral', 'cuisse', 'muscle', fromMus('Vaste latéral'), ['vaste lateral']],
  [27, 'Patte d’oie', 'jambe', 'tendon', fromParc('Patte d’oie'), ['patte d']],
  [28, 'Sinus du tarse', 'pied', 'os', fromParc('Sinus du tarse et pédieux'), ['sinus du tarse']],
  [29, 'Trochlée du talus', 'pied', 'os', {
    pos: 'Assis ou décubitus dorsal, pied relâché.',
    how: 'En avant de la mortaise, **entre les deux malléoles**, sous les tendons extenseurs : mettre le pied en **flexion plantaire** passive, la poulie du talus vient se découvrir en avant du tibia.',
    chk: 'Elle se cache sous le tibia en flexion dorsale et réapparaît en flexion plantaire.',
  }, ['^talus']],
  [30, 'Col du talus', 'pied', 'os', {
    pos: 'Assis, pied en légère flexion plantaire.',
    how: 'En avant de la trochlée : petite **dépression** entre la trochlée (en arrière) et la **tête du talus** (en avant). En dehors, il surplombe le **sinus du tarse**.',
    chk: 'En faisant tourner le pied en dedans et en dehors, la tête du talus bouge juste en avant du col.',
  }, ['^talus']],
  [31, 'Articulation métatarso-phalangienne de l’hallux', 'pied', 'os', {
    pos: 'Décubitus dorsal ou assis, pied relâché.',
    how: 'Suivre le bord médial du **1er métatarsien** jusqu’à sa tête : l’**interligne** est juste en avant, à la base de la phalange proximale de l’hallux.',
    chk: 'Mobiliser l’hallux en flexion et en extension : l’interligne s’ouvre sous le doigt. Les **sésamoïdes** roulent dessous.',
  }, ['tete du m1 et sesamoides', '^hallux']],
  [32, '1er métatarsien', 'pied', 'os', {
    pos: 'Assis ou décubitus dorsal.',
    how: 'Bord médial du pied : de la **base** (en avant du cunéiforme médial, arrivée du tibial antérieur) à la **tête**, en suivant la diaphyse sur sa face dorsale et médiale.',
    chk: 'En mobilisant la tête, on sent l’interligne cunéo-métatarsien bouger à la base.',
  }, ['1er metatarsien']],
  [33, 'Cunéiforme médial', 'pied', 'os', { pos: 'Assis.', how: 'En avant du **naviculaire**, sur le bord médial : suivre le tendon du **tibial antérieur** jusqu’à son arrivée.', chk: 'En mobilisant le 1er métatarsien, l’interligne cunéo-métatarsien bouge juste en avant de lui.' }, ['cuneiforme medial', 'cuneiforme']],
  [34, 'Tubérosité de l’os naviculaire', 'pied', 'os', fromParc('Tubercule du naviculaire'), ['naviculaire']],
  [35, 'Malléole tibiale (médiale)', 'jambe', 'os', fromParc('Malléole médiale'), ['malleole medial']],
  [36, 'Sustentaculum tali', 'pied', 'os', fromParc('Sustentaculum tali'), ['sustentaculum']],
  [37, 'Cuboïde', 'pied', 'os', fromParc('Cuboïde'), ['cuboide']],
  [38, 'Trochlée fibulaire (tubercule des fibulaires)', 'pied', 'os', fromParc('Tubercule des fibulaires'), ['tubercule des fibulaires', 'trochlee fibulaire']],
  [39, 'Malléole fibulaire (latérale)', 'jambe', 'os', fromParc('Malléole latérale'), ['malleole lateral']],
  [40, 'Processus médial de la tubérosité du calcanéus', 'pied', 'os', {
    pos: 'Procubitus, pieds dépassant de la table (ou décubitus dorsal, pied relâché).',
    how: 'Face **plantaire du talon**, côté **médial** : appuyer fermement du pouce sous la tubérosité du calcanéus, en avant de l’arrière du talon.',
    chk: 'C’est l’origine de l’**abducteur de l’hallux**, du **court fléchisseur des orteils** et de l’**aponévrose plantaire**.',
  }, ['tuberosite du calcaneus', 'calcaneus']],
  [41, 'Sésamoïdes', 'pied', 'os', fromParc('Tête du M1 et sésamoïdes'), ['sesamoide']],
  [42, 'Tibial antérieur', 'jambe', 'muscle', fromMus('Tibial antérieur (anc. jambier antérieur)'), ['tibial anterieur']],
  [43, 'Long extenseur de l’hallux', 'jambe', 'muscle', fromMus('Long extenseur de l’hallux'), ['long extenseur de l']],
  [44, 'Long extenseur des orteils', 'jambe', 'muscle', fromMus('Long extenseur des orteils'), ['long extenseur des orteils']],
  [45, 'Court extenseur de l’hallux', 'pied', 'muscle', {
    pos: 'Assis, pied relâché.',
    how: 'Sur le dos du pied, en dehors du tendon du long extenseur de l’hallux : c’est le **chef médial du pédieux**, qui file vers la phalange proximale de l’hallux.',
    chk: 'Il se contracte en extension contrariée du gros orteil.',
    o: 'Face dorsale du **calcanéus** (sinus du tarse), avec le court extenseur des orteils', t: 'Base de la **phalange proximale de l’hallux**',
    nerf: 'N. fibulaire profond (L4–S1)', act: 'Extension de l’hallux (MTP).',
  }, ['court extenseur des orteils (pedieux)']],
  [46, 'Court extenseur des orteils', 'pied', 'muscle', fromMus('Pédieux (court extenseur des orteils et de l’hallux)', { t: 'Tendons extenseurs des orteils 2 à 4', act: 'Extension des orteils 2 à 4.' }), ['court extenseur des orteils (pedieux)']],
  [47, 'Tibial postérieur', 'jambe', 'muscle', fromMus('Tibial postérieur (anc. jambier postérieur)'), ['tibial posterieur']],
  [48, 'Soléaire', 'jambe', 'muscle', fromMus('Soléaire'), ['soleaire']],
  [49, 'Tendon calcanéen', 'jambe', 'tendon', fromParc('Tendon calcanéen'), ['tendon calcaneen']],
  [50, 'Long fibulaire', 'jambe', 'muscle', fromMus('Long fibulaire (anc. long péronier latéral)'), ['long fibulaire']],
  [51, 'Court fibulaire', 'jambe', 'muscle', fromMus('Court fibulaire (anc. court péronier latéral)'), ['court fibulaire']],
  [52, 'Long fléchisseur des orteils', 'jambe', 'muscle', fromMus('Long fléchisseur des orteils'), ['long flechisseur des orteils']],
  [53, 'Long fléchisseur de l’hallux', 'jambe', 'muscle', fromMus('Long fléchisseur de l’hallux'), ['long flechisseur de l']],
  [54, 'Court fléchisseur des orteils', 'pied', 'muscle', fromMus('Court fléchisseur des orteils'), ['court flechisseur des orteils']],
  [55, 'Court fléchisseur de l’hallux', 'pied', 'muscle', fromMus('Court fléchisseur de l’hallux'), ['court flechisseur de l']],
  [56, 'Abducteur du 5e orteil', 'pied', 'muscle', fromMus('Abducteur du 5e orteil'), ['^abducteur du 5']],
  [57, 'Court fléchisseur du 5e orteil', 'pied', 'muscle', {
    pos: 'Décubitus dorsal ou procubitus, pied relâché.',
    how: 'Bord latéral de la plante, **sous la diaphyse du 5e métatarsien**, en dedans de l’abducteur du 5e orteil.',
    chk: 'Il se contracte en **flexion contrariée** du 5e orteil (MTP).',
    o: 'Base du **5e métatarsien** (et gaine du long fibulaire)', t: 'Base de la **phalange proximale du 5e orteil**',
    nerf: 'N. plantaire latéral (S1–S2)', act: 'Flexion de la MTP du 5e orteil.',
  }, ['court flechisseur du 5', 'court flechisseur du petit']],
  [58, 'Abducteur de l’hallux', 'pied', 'muscle', fromMus('Abducteur de l’hallux'), ['^abducteur de l']],
  [59, '2e métatarsien', 'pied', 'os', {
    pos: 'Assis ou décubitus dorsal.',
    how: 'Sur le dos du pied, le **plus long** des métatarsiens : sa base est encastrée en retrait, dans la **mortaise des cunéiformes** ; suivre la diaphyse jusqu’à la tête, palpable aussi sous l’avant-pied.',
    chk: 'Base presque immobile (clé de voûte de l’interligne de Lisfranc) ; en mobilisant le 2e orteil, on sent l’interligne métatarso-phalangien.',
  }, ['tetes metatarsiennes']],
  [60, '5e métatarsien', 'pied', 'os', fromParc('Base (tubérosité) du M5'), ['5e metatarsien']],
];

// Os : les muscles (et ligaments) qui s'y insèrent, pour avoir quelque chose à dire quand on parle de l'os.
const INS = {
  1: "**Grand fessier** (une partie de son origine) ; ligaments sacro-iliaques postérieurs et sacro-tubéral.",
  2: "**Obliques externe et interne**, **transverse** de l'abdomen, **grand dorsal**, **carré des lombes** ; en avant, le **TFL**.",
  3: "**Sartorius** et **tenseur du fascia lata** ; le **ligament inguinal**.",
  4: "**Moyen fessier** et **petit fessier**, **piriforme**, **obturateur interne et jumeaux** ; en dessous, origine du **vaste latéral**.",
  16: "En haut, le **tendon du quadriceps** (droit fémoral + 3 vastes) ; en bas, le **ligament patellaire** ; sur les côtés, les rétinaculums.",
  17: "Le **ligament patellaire** : terminaison de tout l'appareil extenseur du **quadriceps**.",
  18: "**Biceps fémoral** ; **ligament collatéral fibulaire** du genou ; origine du **long fibulaire** et d'une partie du **soléaire**.",
  19: "Le **tractus ilio-tibial** (fascia lata tendu par le **TFL** et le **grand fessier**) ; quelques fibres du **tibial antérieur**.",
  28: "En avant, l'origine du **court extenseur des orteils** ; dedans, les ligaments **talo-calcanéen interosseux** et **cervical** ; le rétinaculum des extenseurs.",
  29: "**Aucun muscle** ne s'insère sur le talus ! Seulement des ligaments (talo-fibulaires, deltoïdien) ; les tendons des extenseurs passent devant.",
  30: "**Aucun muscle** (le talus n'a pas d'insertion musculaire) ; la capsule talo-crurale et le ligament talo-naviculaire.",
  31: "Base de P1 : **abducteur** et **adducteur de l'hallux**, **court extenseur de l'hallux** ; dessous, le **court fléchisseur** (par les sésamoïdes) ; les tendons des **longs extenseur et fléchisseur** passent vers P2.",
  32: "Base : **long fibulaire** (en dessous, en dehors) et **tibial antérieur** (en dedans) ; origine du **1er interosseux dorsal**.",
  33: "**Tibial antérieur** (face médiale) et **long fibulaire** (face plantaire) ; des expansions du **tibial postérieur**.",
  34: "Le **tibial postérieur** (sa terminaison principale) ; le ligament calcanéo-naviculaire plantaire (spring ligament).",
  35: "Le **ligament deltoïdien** (collatéral médial) ; derrière elle passent le **tibial postérieur** et le **long fléchisseur des orteils**.",
  36: "Dessous passe le **long fléchisseur de l'hallux** ; s'y attachent le **ligament calcanéo-naviculaire plantaire** et le faisceau tibio-calcanéen du deltoïdien.",
  37: "Le **long fibulaire** passe dans sa gouttière plantaire ; expansions du **tibial postérieur** ; ligaments plantaires (long ligament plantaire).",
  38: "Elle sépare le **court fibulaire** (au-dessus) du **long fibulaire** (en dessous) ; le rétinaculum inférieur des fibulaires s'y fixe.",
  39: "Le **ligament collatéral latéral** (talo-fibulaire antérieur, calcanéo-fibulaire, talo-fibulaire postérieur) ; derrière passent le **long** et le **court fibulaire**.",
  40: "Origine de l'**abducteur de l'hallux**, du **court fléchisseur des orteils** et de l'**aponévrose plantaire** (le tendon calcanéen est juste au-dessus, en arrière).",
  41: "Les deux chefs du **court fléchisseur de l'hallux** ; l'**abducteur** (médial) et l'**adducteur de l'hallux** (latéral) ; le **long fléchisseur de l'hallux** passe entre eux.",
  59: "Origine des **1er et 2e interosseux dorsaux** ; le chef oblique de l'**adducteur de l'hallux** ; expansions du **tibial postérieur** à la base.",
  60: "Base (styloïde) : **court fibulaire** ; face dorsale : **3e fibulaire** ; origine du **court fléchisseur** et de l'**opposant du 5e** ; l'**abducteur du 5e** ; interosseux.",
};
const N = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const order = k => (k.startsWith('r-parcours') ? 0 : k.startsWith('r-') ? 1 : 2);
const used = new Set();
const ANAT_Q = Q.map(([q, name, reg, kind, c, keys]) => {
  const plates = [];
  for (const key of keys) {
    for (const pl of Object.keys(ART).sort((a, b) => order(a) - order(b))) ART[pl].leg.forEach((l, k) => { if ((key[0] === '^' ? N(l[0]).startsWith(key.slice(1)) : N(l[0]).includes(key)) && !plates.some(p => p.pl === pl)) plates.push({ pl, num: k + 1 }); });
    if (plates.length) break;
  }
  plates.splice(3);
  plates.forEach(p => used.add(p.pl));
  return { q, name, reg: REG[reg], regName: R[REG[reg]], kind, group: GROUP[kind], ...c, ...(INS[q] ? { ins: INS[q] } : {}), plates };
});
const ANAT_PL = Object.fromEntries([...used].map(k => [k, ART[k]]));
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/anat.js', '// Généré par tools/build-anat.js : les 59 questions d’anatomie palpatoire. Ne pas éditer à la main.\nwindow.ANAT_Q=' + JSON.stringify(ANAT_Q) + ';\nwindow.ANAT_PL=' + JSON.stringify(ANAT_PL) + ';\nwindow.ANAT_REG=' + JSON.stringify(R) + ';\n');
const none = ANAT_Q.filter(x => !x.plates.length).map(x => 'Q' + x.q + ' ' + x.name);
console.log(ANAT_Q.length, 'questions,', used.size, 'planches utilisées,', Math.round(fs.statSync('data/anat.js').size / 1024), 'Ko');
console.log('sans planche :', none.join(' | ') || 'aucune');
const noIns = ANAT_Q.filter(x => x.group === 'Os' && !x.ins).map(x => x.q); if (noIns.length) throw new Error('os sans insertions : ' + noIns);
