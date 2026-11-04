// Examen clinique : le bilan du pied en décharge et en charge (« Guide Complet de l'Examen Clinique du Pied en Décharge et en Charge »),
// réécrit simplement, en 15 étapes. Dessin de chaque étape : BILAN_PIC dans data/clinique-dessins.js (même numéro).
// Chaque étape : n titre, g groupe, why ce qu'on cherche, pos installation, b blocs, key chiffres, tip astuce, yt vidéo YouTube.
// Un bloc : h titre, puis p (texte), kv ([libellé, texte]), li (liste), steps (étapes), table (+ head), res ([ok|mid|ko, signe, sens]).
window.BILAN_G = [
  { t: "Avant l'examen", e: '🗣' },
  { t: 'En décharge (assis ou allongé)', e: '🛏' },
  { t: 'En charge (debout)', e: '🧍' },
  { t: 'Tests dynamiques', e: '🏃' },
];
window.BILAN = [
  { n: 'Accueil et anamnèse', g: 0, why: 'Comprendre pourquoi le patient vient, avant de toucher le pied',
    pos: 'Patient assis face à toi. Tu regardes déjà sa marche quand il entre.',
    b: [
      { h: 'Les questions, dans l\'ordre', kv: [['Identité', 'nom, prénom, âge'], ['Mode de vie', 'métier, sport, chaussures portées'], ['Motif', 'pourquoi il vient, ce qui le gêne'],
        ['La douleur', 'où, depuis quand, comment c\'est arrivé, intensité, ce qui l\'aggrave ou la soulage'], ['Antécédents', 'maladies (ex. **diabète**), opérations, traumatismes récents ou anciens'],
        ['Suivi podo', 'soins de pédicurie réguliers ? orthèses déjà portées ?']] },
      { h: 'Ce que j\'observe dès l\'entrée', li: ['La **marche** spontanée', 'La **posture** et l\'**équilibre**', 'Les **asymétries** et les attitudes d\'évitement (boiterie)'] },
    ],
    tip: 'Hygiène, empathie, écoute active : le patient doit se sentir en confiance.' },
  { n: 'Les 3 règles de l\'examen', g: 0, why: 'Ne rien oublier, et pouvoir comparer', yt: 'QICp6rWjBrU',
    b: [
      { h: 'L\'examen est toujours…', kv: [['Systématique', 'de l\'**arrière-pied vers l\'avant-pied**, articulation par articulation, tissu par tissu'],
        ['Bilatéral', 'on examine **les deux pieds**, même si un seul fait mal'], ['Comparatif', 'on compare formes, mobilités, amplitudes et couleur **d\'un côté à l\'autre**']] },
      { h: 'Puis il se fait en 2 temps', kv: [['En décharge', 'assis ou allongé : le pied **sans** le poids du corps'], ['En charge', 'debout : le pied **sous** le poids du corps. Ce sont **les données en charge** qui comptent pour concevoir les orthèses.']] },
    ],
    tip: 'S-B-C : Systématique, Bilatéral, Comparatif.' },

  { n: 'Morphologie du pied', g: 1, why: 'Le type de pied, la forme des orteils, les déformations de l\'avant-pied',
    pos: 'En décharge, assis ou allongé.', key: ['2 à 2,5 cm', 'égyptien 60 %'],
    b: [
      { h: 'Typologie : la dénivellation', p: 'La hauteur entre le **point le plus bas du talon** et la **tête du 1er métatarsien**.',
        res: [['ok', 'Pied normal', 'dénivellation de **2 à 2,5 cm**'], ['ko', 'Pied plat', 'moins de **2 cm**'], ['ko', 'Pied creux', 'plus de **2,5 cm**']] },
      { h: 'Le canon des orteils', head: ['Pied', 'Les orteils', 'Combien'], table: [['Égyptien', 'hallux **plus long** que le 2e', '60 %'], ['Carré', 'hallux et 2e **de même longueur**', '25 %'], ['Grec', '2e orteil **plus long** que l\'hallux', '15 %']] },
      { h: 'L\'avant-pied : chercher les déformations', li: ['**Hallux valgus**', '**Quintus varus**', '**Griffes** d\'orteils'] },
    ],
    tip: 'Égyptien comme un pharaon : le gros orteil domine. Grec comme les statues : le 2e orteil dépasse.' },
  { n: 'Peau et ongles', g: 1, why: 'L\'état de la peau, les zones où le pied appuie trop, les ongles, les grains de beauté suspects',
    key: ['Shore 20 souple', 'Shore 35 ferme'],
    b: [
      { h: 'La peau', kv: [['Trophicité', 'souple, ou sèche / atrophique ; élasticité, poils, couleur'], ['Fermeté (Shore)', 'peau souple ≈ **20**, peau ferme ≈ **35**']] },
      { h: 'Les lésions', kv: [['Hyperkératoses', 'cors, durillons, œils-de-perdrix : des **zones d\'hyperpression**'], ['Portes d\'entrée', 'fissures, crevasses, intertrigos (mycoses), ulcérations'],
        ['Inflammation', 'rougeur, chaleur : conflit avec la chaussure, rhumatisme ou infection']] },
      { h: 'Les ongles', li: ['La **forme**', 'La **surface** : lignes de Beau, stries', 'La **couleur** : hématome sous l\'ongle, leuconychie (taches blanches)'] },
      { h: 'Un grain de beauté : la règle ABCDE', head: ['', 'Suspect si…'], table: [['A', '**Asymétrique**'], ['B', '**Bords** irréguliers'], ['C', '**Couleur** pas homogène'], ['D', '**Diamètre** de plus de 6 mm'], ['E', '**Évolution** : il change']] },
    ],
    tip: 'Une hyperkératose montre où le pied appuie trop : un indice à vérifier ensuite en charge.' },
  { n: 'Bilan artériel', g: 1, why: 'Le sang arrive-t-il bien jusqu\'au pied ?', yt: 'EwaDSZRH1LE',
    pos: 'Allongé sur le dos, jambes relâchées.', key: ['recoloration < 3 s'],
    b: [
      { h: 'Comment faire', steps: ['**Pouls pédieux** : sur le dos du pied, entre le 1er et le 2e métatarsien.', '**Pouls tibial postérieur** : en arrière de la malléole interne.',
        '**Temps de recoloration** : appuyer sur la pulpe d\'un orteil jusqu\'à ce qu\'elle blanchisse, lâcher, compter.'] },
      { h: 'Lire le résultat', res: [['ok', 'Normal', 'pouls bien perçus des deux côtés, la couleur revient en **moins de 3 secondes**'],
        ['ko', 'Pouls absent ou recoloration lente', '**insuffisance artérielle** : on complète avec l\'IPS (test 37)']] },
    ],
    tip: 'Pédieux : sur le dos du pied. Tibial postérieur : derrière la malléole interne.' },
  { n: 'Veines et lymphe', g: 1, why: 'Le sang remonte-t-il bien ? Y a-t-il un œdème ?',
    b: [
      { h: 'Le retour veineux : 3 pompes', steps: ['La **voûte plantaire**, écrasée à chaque appui', 'Les **muscles du mollet**, à la marche', 'Les **muscles des cuisses**'] },
      { h: 'Ce que je peux trouver', head: ['Signe', 'À quoi on le reconnaît'], table: [['Varicosités', 'petits réseaux violets ou bleus, bénins'], ['Varices', 'grosses veines dilatées en permanence (les valves fuient)'],
        ['Œdème de stase', 'gonflement mou, blanc, indolore, **le soir aux chevilles** ; signe du **godet** positif'], ['Dermite ocre', 'peau brunâtre en bas de jambe (dépôts d\'hémosidérine)'],
        ['Phlébite (TVP)', '**urgence** : mollet douloureux, rouge, chaud, qui ballotte moins, gonflé d\'un seul côté']] },
      { h: 'Le lymphœdème', li: ['Ne dégonfle **pas** la nuit', 'Touche les **orteils** : ils deviennent « carrés »', 'Devient **dur**, épais, cartonné', 'Signe de **Stemmer** : on n\'arrive pas à pincer la peau sur le dos du 2e orteil'] },
    ],
    tip: 'Godet : j\'appuie avec le doigt, le creux reste. Phlébite = on l\'envoie aux urgences.' },
  { n: 'Sensibilité et réflexes', g: 1, why: 'Le pied sent-il bien ? (neuropathie, surtout chez le diabétique)', yt: 'ROmpAg4VQIk',
    pos: 'Allongé, **yeux fermés** pour la sensibilité.', key: ['achilléen S1', 'patellaire L4'],
    b: [
      { h: 'Sensibilité superficielle', kv: [['Pique-touche', 'pointe ou coton, au hasard : douleur et toucher léger'], ['Thermique', 'chaud ou froid ?'],
        ['Monofilament 10 g', 'le test de référence de la **perte de sensibilité de protection** (diabétique) : voir le test 33']] },
      { h: 'Sensibilité profonde', kv: [['Diapason gradué', 'la vibration (pallesthésie) : normal si elle s\'éteint **entre 4 et 8** ; **avant 4** = neuropathie périphérique']] },
      { h: 'Les réflexes', head: ['Réflexe', 'Racine / normal'], table: [['Achilléen', '**S1**'], ['Patellaire', '**L4**'], ['Cutané plantaire', 'les orteils partent en **flexion**']] },
    ],
    tip: '« 1, 2 : la chaussure ; 3, 4 : le genou » : achilléen S1, patellaire L4. Gros orteil qui se relève au cutané plantaire = signe de Babinski, anormal.' },
  { n: 'Amplitudes articulaires', g: 1, why: 'Repérer une raideur', pos: 'Assis ou allongé ; tu bouges l\'articulation toi-même (passif).',
    key: ['FD 20-30°', 'FP 30-50°', 'MTP1 50-60°'],
    b: [
      { h: 'Les normes', head: ['Articulation', 'Mouvement', 'Normal'], table: [['Talo-crurale', 'flexion dorsale', '**20 à 30°**'], ['', 'flexion plantaire', '**30 à 50°**'],
        ['Sous-talienne', 'pronation', '**5 à 10°**'], ['', 'supination', '**20 à 30°**'], ['', 'inversion', '**30 à 35°**'], ['MTP1', 'extension', '**50 à 60°**'], ['', 'flexion plantaire', '**30 à 40°**']] },
    ],
    tip: 'Une raideur trouvée : mobilisations passives tous les jours.' },
  { n: 'Testing musculaire', g: 1, why: 'L\'extensibilité et la force des muscles de la jambe et du pied', key: ['cote 3 = contre la pesanteur'],
    b: [
      { h: 'Ce qu\'on regarde', li: ['L\'**extensibilité**, l\'**élasticité**, l\'**excitabilité**', 'Les muscles **extrinsèques** (de la jambe) et **intrinsèques** (du pied)'] },
      { h: 'La cotation de 0 à 5', head: ['Cote', 'Ce que le muscle fait'], table: [['0', 'aucune contraction'], ['1', 'contraction, mais sans mouvement'], ['2', 'mouvement, sans la pesanteur'],
        ['3', 'mouvement **contre la pesanteur**'], ['4', 'contre une **résistance modérée**'], ['5', 'force **normale**']] },
    ],
    tip: 'Le seuil à retenir est 3 : le muscle soulève le segment contre la pesanteur.' },

  { n: 'Axe calcanéo-jambier', g: 2, why: 'L\'arrière-pied part-il en valgus ou en varus ?', pos: 'Debout sur les deux pieds, vu de dos.', key: ['valgus ≤ 5° normal'],
    b: [
      { h: 'Comment faire', steps: ['Repérer l\'axe du **bas de la jambe** (le milieu du tendon d\'Achille).', 'Repérer l\'axe du **talon** (le milieu du calcanéus).', 'Regarder l\'angle entre les deux.'] },
      { h: 'Lire le résultat', res: [['ok', 'Valgus physiologique', 'jusqu\'à **5°**'], ['ko', 'Valgus pathologique', 'plus de **5°**'], ['ko', 'Varus', 'le talon bascule vers l\'intérieur (supination excessive)']] },
    ],
    tip: 'En charge, un petit valgus est normal : jusqu\'à 5°.' },
  { n: 'Griffes d\'orteils (Lelièvre)', g: 2, why: 'D\'où vient la griffe, et peut-on encore la corriger ?',
    b: [
      { h: 'D\'où elle vient', kv: [['Neurologique', 'muscles **intrinsèques** paralysés ou faibles, les extrinsèques dominent ; souvent **irréductible** (diabète, Charcot-Marie-Tooth)'],
        ['Statique', 'déséquilibre mécanique (pied creux, surcharge) ; **réductible au début**, puis se fixe'], ['Mixte', 'une atteinte neurologique + un facteur mécanique qui aggrave']] },
      { h: 'Peut-on la redresser à la main ?', res: [['ok', 'Réductible', 'correction complète'], ['mid', 'Semi-réductible', 'correction partielle, début de raideur'], ['ko', 'Irréductible', 'déformation fixée, on ne peut pas la corriger']] },
    ],
    tip: 'On teste toujours en essayant de redresser l\'orteil à la main.' },
  { n: 'Podoscope : les empreintes', g: 2, why: 'Où le pied appuie, et le type de pied', pos: 'Debout sur le podoscope, pieds nus, sur les deux pieds.', yt: 'wYn-ygwFSx4', key: ['isthme = 1/3'],
    b: [
      { h: 'Pied normal', li: ['Avant-pied : toutes les **têtes métatarsiennes** appuient, pulpes des orteils bien séparées', 'Isthme (le milieu) : environ **1/3** de la largeur de l\'avant-pied', 'Talon : une empreinte **ovale**'] },
      { h: 'Pied plat', head: ['Degré', 'L\'empreinte'], table: [['1er', 'isthme **un peu élargi**'], ['2e', 'plus de voûte : isthme **très large**'], ['3e', 'bord interne **bombé**, arche effondrée']] },
      { h: 'Pied creux', head: ['Degré', 'L\'empreinte'], table: [['1er', 'isthme **plus étroit**'], ['2e', 'isthme **coupé** : avant-pied et talon séparés'], ['3e', 'les **orteils ne touchent plus** : appui talon + têtes métatarsiennes']] },
    ],
    tip: 'Plat : l\'isthme grossit. Creux : il maigrit, puis se coupe, puis les orteils décollent.' },

  { n: 'Test unipodal', g: 3, why: 'Un pied creux est-il souple ou rigide ?', pos: 'Debout sur un seul pied, puis sur l\'autre.',
    b: [
      { h: 'Comment faire', steps: ['Le patient se tient sur **un seul pied**.', 'Regarder l\'empreinte et l\'arche plantaire.', 'Recommencer de l\'autre côté et comparer.'] },
      { h: 'Lire le résultat', res: [['ok', 'L\'empreinte s\'élargit, l\'arche s\'adapte', 'pied creux **souple**'], ['ko', 'Rien ne bouge', 'pied creux **rigide**']] },
    ],
    tip: 'Souple = il s\'écrase un peu sous le poids. Rigide = il garde sa forme.' },
  { n: 'Mise sur pointe', g: 3, why: 'Le valgus de l\'arrière-pied se corrige-t-il ?', pos: 'Debout sur les deux pieds, vu de dos.', yt: '8aT64qKE5sA',
    b: [
      { h: 'Comment faire', steps: ['Le patient monte sur la **pointe des pieds**.', 'Regarder les **talons** de dos.'] },
      { h: 'Lire le résultat', res: [['ok', 'Le talon passe en varus', 'trouble **fonctionnel, réductible** : tendons (tibial postérieur) et ligaments intacts'], ['ko', 'Le valgus reste', 'trouble **structurel, fixé**']] },
    ],
    tip: 'Talon qui rentre quand il monte sur pointe : bon signe.' },
  { n: 'Test de Jack (Hubscher)', g: 3, why: 'L\'arche d\'un pied plat est-elle réductible ?', pos: 'Debout, pieds à plat (en charge).', yt: 'CyJxNDahgKU',
    b: [
      { h: 'Comment faire', steps: ['Le patient est debout, pieds à plat.', 'Relever **passivement l\'hallux** (flexion dorsale forcée).', 'Regarder la **voûte plantaire**.'] },
      { h: 'Lire le résultat', res: [['ok', 'L\'arche se creuse', 'test **positif** : déformation **réductible**'], ['ko', 'L\'arche ne bouge pas', '**raideur structurelle**, ou le système suro-achilléo-calcanéo-plantaire ne fonctionne pas']] },
    ],
    tip: 'C\'est le mécanisme du treuil : relever l\'hallux tend l\'aponévrose plantaire, qui creuse l\'arche.' },
];
