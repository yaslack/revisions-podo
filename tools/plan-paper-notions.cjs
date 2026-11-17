// Prépare deux scènes propres au contenu de chaque partie encore sans images.
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
global.window = {}; require('../data/pedi.js'); require('../data/podo.js'); require('../data/paper-notions.js');
const courses = [...window.PEDI, ...window.PODO.filter(f => f.ready)];
const folder = path.join(root, 'papercraft/plans'); fs.mkdirSync(folder, { recursive: true });
const clean = text => String(text || '').replace(/\*\*/g, '').replace(/^[•★①②③→\s]+/, '').trim();
function lines(b) {
  if (b.t === 'card') return [b.title, ...(b.items || []).flatMap(lines)].filter(Boolean);
  if (b.t === 'chips') return b.items;
  if (b.t === 'li') return [b.term + (b.d ? ' : ' + b.d : '')];
  return b.text ? [b.text] : [];
}
const generic = /^(dd|local|oral|topique|traitement|diagnostic|pronostic|prévention|facteurs|imagerie|examens|conservateur|chirurgie|systémique|pathologie|p|bon|récidives?|généralement bon|3 actions|pour|savoir éliminer|les étapes|les 2 pieds|dépistage|maintenant|quelques mois|~ 1 an|attention)$/i;
const overrides = {
  antifongiques: [
    ['Contre les champignons', 'Peau et ongles atteints'], ['Fongistatique : bloquer la croissance', 'Fongicide : éliminer le champignon'],
    ['Azolés et allylamines', 'Amorolfine et ciclopirox'], ['Crèmes et poudres', 'Vernis pour les ongles'],
    ['Préparer et sécher l’ongle', 'Traitement oral sur avis médical'], ['Résistance du champignon', 'Irritation et réaction cutanée'],
    ['Allergie à un composant', 'Vérifier la composition'], ['Séchage et observance', 'Aérer les chaussures']
  ],
  hematome: [
    ['Sang sous la plaque unguéale', 'Choc sur l’ongle'], ['Chocs répétés en descente', 'Chaussure trop courte'],
    ['Rupture des petits vaisseaux', 'Pression sous l’ongle'], ['Tache sombre sous l’ongle', 'Douleur à la pression'],
    ['Rechercher un traumatisme', 'Distinguer les autres taches unguéales'], ['Supprimer les chocs', 'Soin et pansement protecteur'],
    ['La tache avance avec la repousse', 'Surveiller l’inflammation'], ['Chaussant et laçage adaptés', 'Coupe droite de l’ongle']
  ],
  ains: [
    ['Douleur et inflammation', 'Faire baisser la fièvre'], ['Connaître le traitement du patient', 'Adapter les soins locaux'],
    ['Traumatismes et tendons douloureux', 'Articulations et décharge'], ['Comprimés prescrits', 'Gel sur peau intacte'],
    ['Allergie et troubles digestifs', 'Grossesse et autres contre-indications'], ['Irritation gastrique', 'Réaction cutanée au soleil']
  ]
};
for (const f of courses) {
  if (window.PAPER_NOTIONS[f.id]) continue;
  const file = path.join(folder, f.id + '.json'); if (fs.existsSync(file)) continue;
  const parts = f.parts.map((p, k) => {
    const split = Math.max(1, Math.ceil(p.blocks.length / 2));
    return [p.blocks.slice(0, split), p.blocks.slice(split)].map((segment, j) => {
      const context = segment.flatMap(lines).map(clean).filter(Boolean);
      const all = p.blocks.flatMap(lines).map(clean).filter(Boolean);
      const candidates = (context.length ? context : all).filter(s => s.length > 5 && !generic.test(s) && !/^\d|^[<>≤≥≈±×]|^sur avis|^selon |^avec |^pas de |^ni |^et |^ou |^pour |^\(/i.test(s));
      const candidate = candidates[0] || all[j] || p.title;
      const raw = overrides[f.id]?.[k]?.[j] || candidate;
      const caption = clean(raw).replace(/\s*\([^)]*\)/g, '').split(' : ')[0].replace(/^[…·\s]+/, '').slice(0, 100);
      return { caption, after: j ? p.blocks.length - 1 : split - 1, context: context.length ? context : all };
    });
  });
  const count = parts.flat().length, rows = Math.ceil(count / 4);
  const sceneList = parts.flatMap((pair, k) => pair.map((n, j) => ({cell:k*2+j+1,part:f.parts[k].title,focus:n.caption,source:n.context,oralContext:f.parts[k].say || ''})));
  const prompt = [
    'Use case: scientific-educational. Production asset for a French podiatry revision app.',
    'Course: ' + f.title + '. Create ONE atlas, EXACTLY FOUR COLUMNS and ' + rows + ' ROWS, ' + count + ' separate equal-sized vignettes in strict row-major order. Two distinct content-specific illustrations for each course section, as specified below.',
    'Reference image is ONLY for physically handmade paper material, light, palette and artistic quality. Never repeat its unrelated subjects. Rich sculptural layered hand-cut fibrous cardstock, warm studio light, visible cut edges and subtle contact shadows. Moss and sage, ochre, warm ivory, dusty blue, peach, coral, lavender. Orthographic, clear, memorable compositions for small mobile screens.',
    'Each vignette is complete inside its own cell, with broad fully transparent gutters and no overlap. All ' + count + ' images must be distinct and describe the actual focus concept, with meaningful body part, mechanism, sign, care action or environment. No generic chapter icons. No writing, words, letters, numerals, drug brand names, logos, screenshots or labels anywhere. Arrows and simple symbolic marks are allowed.',
    'Use simple non-graphic schematic anatomy. Do not invent a diagnosis, treatment, dose, timing, anatomical mechanism or prognosis. The French source text is context for choosing the subject; DO NOT render it as text. Show medicine as generic unlabelled containers only, no doses or prescription instructions. If the source marks a section incomplete, illustrate the existing source/reference rather than invent content.',
    'For each cell, illustrate the FOCUS using that cell’s source text and oral context. Never swap or reorder cells. Cell specifications:',
    JSON.stringify(sceneList),
    'Final output: one exact ' + rows + '-row by 4-column atlas. Transparent alpha outside the independent handcrafted paper vignettes.'
  ].join('\n');
  fs.writeFileSync(file, JSON.stringify({id:f.id,title:f.title,columns:4,rows,parts,prompt}, null, 2) + '\n');
}
console.log('Plans préparés dans papercraft/plans');
