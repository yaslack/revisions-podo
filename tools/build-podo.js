// Builds data/podo.js (window.PODO) : les 40 fiches du « Livret des pathologies podologiques » (IFPP), dans l'ordre du livret.
// Une fiche est prête quand sa vidéo est finie : son texte vient alors de l'épisode (extraction comme la pédicurie) et son
// livret du PDF. Les autres sont « coming soon ».
// usage: node tools/extract-videos.js VIDEO_PLAN_DIR '^p(01|02)-' > raw.json   (seulement les épisodes dont la vidéo est finie)
//        node tools/build-podo.js raw.json livret-podo.txt                      (texte du PDF, une ligne par ligne du PDF)
const fs = require('fs');
const { blocks, stripPart } = require('./blocks');
const [raw, livretTxt] = process.argv.slice(2);
const eps = JSON.parse(fs.readFileSync(raw, 'utf8'));

// [titre du livret, identifiant, titre du chapitre dans le PDF si différent]
const LIST = [
  ['Atteintes ligamentaires du genou', 'genou'], ["Chaussures de l'enfant", 'chaussures-enfant'], ['Chaussures de sécurité', 'chaussures-securite'],
  ['Coxarthrose', 'coxarthrose'], ['Cycle de marche', 'cycle-marche', 'Le Cycle de Marche'], ['Déformations des orteils : griffes, clinodactylies, vrilles', 'deformations-orteils', 'Déformations des orteils - Griffes, Clinodactylies, Vrilles, Métatarsalgie'],
  ['Entorses de cheville, LODA', 'entorses-cheville', 'Entorses de la Cheville'], ['Fractures de fatigue', 'fractures-fatigue', 'Fractures de Fatigue du Membre Inférieur'], ['Genu valgum et genu varum', 'genu-valgum-varum', 'Genu Valgum et du Genu Varum'],
  ['Gonarthrose', 'gonarthrose'], ['Hallux rigidus', 'hallux-rigidus'], ['Hallux valgus', 'hallux-valgus'], ['ILMI', 'ilm', 'Inégalité de longueur des membres inférieurs'],
  ['Insuffisance du 1er rayon', 'insuffisance-1er-rayon', 'Insuffisance du Premier Rayon'], ['Kyste poplité', 'kyste-poplite'], ["Maladie d'Haglund", 'haglund', 'Maladie de Haglund'],
  ['Maladies de Sever et d\'Osgood-Schlatter', 'sever-osgood', "Maladie de Sever et Maladie d'Osgood-Schlatter"], ['Myo-aponévrosite plantaire', 'map'], ['Naviculaire accessoire', 'naviculaire-accessoire', 'Os Naviculaire Accessoire'],
  ['Ostéochondrose', 'osteochondrose', 'Ostéochondroses'], ['Périostite tibiale', 'periostite-tibiale'], ['Pied bot varus équin', 'pied-bot'], ['Pied creux', 'pied-creux'],
  ['Pied plat valgus', 'pied-plat'], ['Scoliose', 'scoliose'], ['Attitudes scoliotiques', 'attitudes-scoliotiques'], ['Syndrome du carrefour postérieur', 'carrefour-posterieur'],
  ['Syndrome du canal tarsien', 'canal-tarsien'], ['Bursite inter-capito-métatarsienne', 'bursite-icm'], ['Pseudo-névrome de Morton', 'morton'],
  ['Syndrome de la patte d\'oie', 'patte-oie'], ["Syndrome de l'essuie-glace", 'essuie-glace'], ['Syndrome des loges', 'syndrome-loges'],
  ['Syndrome du 2e rayon', 'syndrome-2e-rayon'], ['Syndrome du sinus du tarse', 'sinus-tarse'], ['Synostoses', 'synostoses'], ['Talalgies', 'talalgies'],
  ['Talonnade', 'talonnade'], ['Tendinites : généralités', 'tendinites'], ["Tendinopathies d'Achille", 'tendinopathie-achille'],
];
if (LIST.length !== 40) throw new Error('il faut 40 fiches');

// ---------- le livret (PDF → texte) : un chapitre par fiche, en HTML simple ----------
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'").replace(/[^a-z0-9']+/gi, ' ').trim().toLowerCase();
const lines = fs.readFileSync(livretTxt, 'utf8').split('\n').map(l => l.trim()).filter(l => l && !/^=== PAGE/.test(l) && !/^Page \d+ sur \d+$/.test(l));
const START = lines.findIndex(l => /^42\s*-/.test(l));   // après la liste des pathologies du début
if (START < 0) throw new Error('liste des pathologies introuvable');
const SECTION = /^(\d+\.\s*)?(Introduction|Étiologie|Etiologie|Physiopathologie|Signes cliniques|Diagnostic|Traitement|Pronostic|Prévention|Prevention|Complications|Examen clinique)\b/i;
function chapter(i) {
  const at = j => { const t = norm(LIST[j][2] || LIST[j][0]); return lines.findIndex((l, k) => k > START && norm(l) === t); };
  const a = at(i); if (a < 0) throw new Error('chapitre introuvable dans le livret : ' + LIST[i][0]);
  let b = i + 1 < LIST.length ? at(i + 1) : lines.length; if (b < 0) throw new Error('chapitre suivant introuvable : ' + LIST[i + 1][0]);
  let html = SECTION.test(lines[a + 1]) ? '' : '<h4>Introduction</h4>', para = '', inList = false;   // titre « Introduction » seulement si le livret n'en a pas
  const flush = () => { if (para) html += inList ? `<li>${para}</li>` : `<p>${para}</p>`; para = ''; };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  for (let l of lines.slice(a + 1, b)) {
    if (SECTION.test(l) && l.length < 60 && !/[.]$/.test(l)) { l = l.replace(/^\d+\.\s*/, '').replace(/\s*:$/, ''); flush(); if (inList) { html += '</ul>'; inList = false; } html += `<h4>${esc(l)}</h4>`; continue; }
    if (/^[-•]\s/.test(l)) { flush(); if (!inList) { html += '<ul>'; inList = true; } para = esc(l.replace(/^[-•]\s*/, '')); continue; }
    if (para && !/[.:!?]$/.test(para)) { para += ' ' + esc(l); continue; }
    flush(); if (inList) { html += '</ul>'; inList = false; } para = esc(l);
  }
  flush(); if (inList) html += '</ul>';
  return html;
}

// un épisode pNN-mots va à la fiche dont l'identifiant a les mêmes mots (les numéros des vidéos ne suivent pas le livret)
const same = (ep, id) => ep.replace('premier', '1er').split('-').slice(1).every(w => id.split('-').some(v => v.slice(0, 4) === w.slice(0, 4)));
const EPI = eps.map(e => { const m = LIST.filter(([, id]) => same(e.id, id)); if (m.length !== 1) throw new Error(`épisode ${e.id} : ${m.length} fiches`); return [m[0][1], e]; });
const PODO = LIST.map(([title, id], i) => {
  // numéros de la liste du livret, repris par les vidéos : elle saute 8 et 9 (1 à 7, puis 10 à 42)
  const n = i < 7 ? i + 1 : i + 3, e = (EPI.find(([k]) => k === id) || [])[1];
  const base = { n, id, sec: 'podo', title, cat: 'podo', catName: 'Podologie', ready: !!e };
  if (!e) return base;
  const ill = fs.existsSync(`illus/${id}/cover.jpg`) ? 'jpg' : fs.existsSync(`illus/${id}/cover.webp`) ? 'webp' : '';   // dessins pris dans la vidéo finie (tools/grab-frames.swift)
  return { ...base, ill, title: e.title, planTitle: e.planTitle, intro: e.intro, outro: e.outro,
    parts: e.parts.map(p => ({ title: e.plan[p.k].title, q: e.plan[p.k].q, say: stripPart(p.say), blocks: blocks(p.screen) })),
    memo: e.memo, quiz: e.quiz.map(q => ({ q: q.q, a: q.a })), photos: [], livret: chapter(i), video: '' };
});
fs.writeFileSync('data/podo.js', '// Généré par tools/build-podo.js : les 40 fiches de podologie (prêtes quand leur vidéo est finie). Ne pas éditer à la main.\nwindow.PODO=' + JSON.stringify(PODO) + ';\n');
console.log(PODO.filter(f => f.ready).map(f => `${f.n}. ${f.title} (${f.parts.length} parties, livret ${f.livret.length} car.)`).join('\n'), '\n', PODO.length, 'fiches,', Math.round(fs.statSync('data/podo.js').size / 1024), 'Ko');
