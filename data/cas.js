// Cas cliniques pour le jeu « Le patient » : un cas réaliste par fiche (64 cas).
window.CAS = {
  "verrues": {
    "id": "verrues",
    "nom": "Léa",
    "age": 14,
    "sexe": "f",
    "qui": "collégienne, nage 3 fois par semaine en club",
    "motif": "J'ai comme un caillou sous le pied, ça me fait mal quand je marche.",
    "ask": [
      [
        "Depuis quand ça vous gêne ?",
        "Depuis deux mois à peu près. Au début, c'était tout petit.",
        1
      ],
      [
        "Vous allez à la piscine, ou dans des douches collectives ?",
        "Oui, trois entraînements par semaine, et on se douche au club.",
        1
      ],
      [
        "Quelqu'un autour de vous a eu la même chose ?",
        "Ma copine du club en a eu une l'an dernier.",
        1
      ],
      [
        "Vous avez eu de la fièvre ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Vous avez mal au dos ou aux genoux ?",
        "Non, juste là, sous le pied.",
        0
      ],
      [
        "Vous prenez un traitement en ce moment ?",
        "Non, rien.",
        0
      ]
    ],
    "exam": [
      [
        "Regarder la lésion de près",
        "Lésion ronde, dure, bien délimitée sous la tête du 2e métatarsien, couverte de corne, avec de petits points noirs.",
        1,
        0
      ],
      [
        "Pincer la lésion sur les côtés",
        "Plus douloureux au pincement latéral qu'à la pression directe.",
        1,
        0
      ],
      [
        "Débrider la corne au bistouri",
        "Dessous, de petits points qui saignent ; les lignes de la peau contournent la lésion.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal : le pied bouge quand on presse le mollet.",
        0,
        25
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur bien perçus.",
        0,
        36
      ]
    ],
    "dx": "Une verrue plantaire (myrmécie, HPV 1)",
    "ddx": [
      [
        "Un cor",
        "Le cor fait mal à la pression directe, sans points noirs, et les lignes de la peau passent dessus."
      ],
      [
        "Un granulome à corps étranger",
        "Il suit une écharde ou un corps étranger, et la zone est rouge, inflammatoire."
      ],
      [
        "Une kératolyse ponctuée",
        "Ce sont de petits creux dans la corne avec une forte odeur, pas une lésion dure et douloureuse."
      ]
    ],
    "cle": "Piscine et vie en club, lésion dure et bien délimitée avec des **points noirs**, plus douloureuse au pincement : c'est une myrmécie (HPV 1).",
    "orient": 0,
    "orientWhy": "Lésion bénigne : le pédicure-podologue la traite. On adresse seulement si elle résiste ou a un aspect suspect.",
    "tt": [
      [
        "Débrider la couche cornée",
        1
      ],
      [
        "Kératolytique (ex. Vercid) sous pansement occlusif",
        1
      ],
      [
        "Proposer la cryothérapie",
        1
      ],
      [
        "Prescrire un antibiotique",
        0
      ],
      [
        "Faire une semelle orthopédique",
        0
      ],
      [
        "Interdire tout sport pendant 3 mois",
        0
      ]
    ],
    "conseil": {
      "q": "C'est contagieux ? Je peux continuer la piscine ?",
      "ok": "Oui, c'est contagieux : tu peux nager, mais avec des sandales dans les douches, et en séchant bien tes pieds.",
      "ko": [
        "Non, ce n'est pas contagieux : aucune précaution à prendre.",
        "Il faut arrêter la piscine jusqu'à la guérison complète."
      ]
    }
  },
  "onychomycoses": {
    "id": "onychomycoses",
    "nom": "Marc",
    "age": 52,
    "sexe": "m",
    "qui": "magasinier en chaussures de sécurité, joue au tennis le week-end",
    "motif": "Mon ongle du gros orteil est devenu tout jaune et épais, il s'effrite quand je le coupe.",
    "ask": [
      [
        "Vous transpirez beaucoup dans vos chaussures de travail ?",
        "Oui, je garde mes chaussures de sécurité huit heures par jour, mes chaussettes sont humides.",
        1
      ],
      [
        "Ça vous gratte entre les orteils ?",
        "Oui, la peau pèle et me démange entre les petits orteils depuis quelques mois.",
        1
      ],
      [
        "Vous avez pris un gros choc sur cet ongle récemment ?",
        "Non, aucun choc particulier, ça a commencé dans le coin du bord libre.",
        1
      ],
      [
        "Vous avez des plaques rouges sur les coudes ou les genoux ?",
        "Non, ma peau est normale ailleurs.",
        0
      ],
      [
        "Vous avez mal au mollet quand vous marchez ?",
        "Non, je cours sans problème au tennis.",
        0
      ],
      [
        "Vous prenez des anticoagulants ?",
        "Non, je ne prends aucun médicament.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter l'ongle de l'hallux",
        "Coloration jaunâtre, onycholyse et hyperkératose sous-unguéale disto-latérale ; la matrice est saine.",
        1,
        0
      ],
      [
        "Examiner les espaces interdigitaux",
        "Fissure blanchâtre et desquamation au 4e espace interdigital, typique d'un intertrigo.",
        1,
        0
      ],
      [
        "Fraiser et tester la friabilité sous l'ongle",
        "Débris kératosiques friables et jaunâtres sous la tablette décollée, sans saignement.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur bien frappés.",
        0,
        36
      ],
      [
        "Test au monofilament 10 g",
        "Sensibilité plantaire parfaitement conservée sur tous les sites.",
        0,
        33
      ]
    ],
    "dx": "Une onychomycose disto-latérale sous-unguéale à dermatophytes",
    "ddx": [
      [
        "Une onycholyse traumatique",
        "Pas de choc signalé, et la présence d'un intertrigo entre les orteils oriente vers un dermatophyte."
      ],
      [
        "Un psoriasis unguéal",
        "Pas de terrain psoriasique ni de dépressions en dé à coudre ; ici l'intertrigo signe l'origine fongique."
      ],
      [
        "Une onychomycose à Candida",
        "Le Candida touche surtout les mains avec un périonyxis chez les métiers de l'eau, rarement l'orteil ainsi."
      ]
    ],
    "cle": "Ongle **jaunâtre, épaissi et décollé** en disto-latéral associé à un **intertrigo** et à la macération : onychomycose à dermatophytes.",
    "orient": 0,
    "orientWhy": "L'atteinte est limitée sans toucher la matrice : soin de débridement et traitement local au cabinet (médecin si matrice atteinte).",
    "tt": [
      [
        "Débrider et désépaissir l'ongle atteint",
        1
      ],
      [
        "Appliquer un vernis antifongique local",
        1
      ],
      [
        "Traiter l'intertrigo et désinfecter les chaussures",
        1
      ],
      [
        "Conseiller des chaussettes en coton et un séchage soigneux",
        1
      ],
      [
        "Arracher chirurgicalement la matrice",
        0
      ],
      [
        "Appliquer un dermocorticoïde sous l'ongle",
        0
      ]
    ],
    "conseil": {
      "q": "En combien de temps mon ongle va redevenir normal ?",
      "ok": "C'est long : il faut plusieurs mois à un an, le temps que l'ongle repousse entièrement.",
      "ko": [
        "En deux semaines de vernis, l'ongle reprend sa couleur normale.",
        "L'ongle reste toujours jaune, le traitement empêche juste la douleur."
      ]
    }
  },
  "antifongiques": {
    "id": "antifongiques",
    "nom": "Nadia",
    "age": 38,
    "sexe": "f",
    "qui": "professeure des écoles, consulte après un prélèvement mycologique positif",
    "motif": "Le laboratoire a confirmé une mycose sur mon ongle du gros orteil, qu'est-ce que je dois mettre ?",
    "dxq": "Quelle stratégie antifongique est adaptée à son cas ?",
    "ask": [
      [
        "Combien d'ongles sont touchés ?",
        "Un seul, uniquement le gros orteil du pied droit.",
        1
      ],
      [
        "Est-ce que la base de l'ongle, près de la peau, est touchée ?",
        "Non, c'est juste le bout de l'ongle sur le côté.",
        1
      ],
      [
        "Avez-vous déjà fait une allergie à une crème ou un vernis ?",
        "Non, je n'ai aucune allergie connue.",
        1
      ],
      [
        "Avez-vous mal au talon le matin au réveil ?",
        "Non, je n'ai aucune douleur au talon.",
        0
      ],
      [
        "Vos chevilles gonflent-elles le soir ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Faites-vous de la course en montagne ?",
        "Non, je marche juste un peu.",
        0
      ]
    ],
    "exam": [
      [
        "Examiner l'étendue sur la tablette unguéale",
        "Un seul ongle atteint en disto-latéral sur moins d'un tiers ; la lunule et la matrice sont indemnes.",
        1,
        0
      ],
      [
        "Vérifier les autres ongles et la peau plantaire",
        "Tous les autres ongles sont sains ; pas de lésion étendue sur la plante des pieds.",
        1,
        0
      ],
      [
        "Couper et préparer la zone atteinte",
        "La partie décollée se coupe facilement, laissant un lit propre prêt pour un topique filmogène.",
        1,
        0
      ],
      [
        "Signe de Mulder",
        "Pas de clic ni de douleur entre les têtes métatarsiennes.",
        0,
        30
      ],
      [
        "Knee-to-wall (cheville au mur)",
        "Flexion dorsale de cheville symétrique et normale.",
        0,
        27
      ]
    ],
    "dx": "Un vernis antifongique local (ciclopirox 1×/j ou amorolfine 1×/semaine) pendant 9 à 12 mois",
    "ddx": [
      [
        "De la terbinafine orale d'emblée pendant 6 mois",
        "Le traitement oral sur avis médical est réservé aux atteintes de la matrice, de plusieurs ongles ou aux échecs."
      ],
      [
        "Du vernis antifongique pendant seulement 1 mois",
        "Un mois est beaucoup trop court : aux pieds, le traitement local par vernis dure 9 à 12 mois."
      ],
      [
        "Uniquement de la poudre antifongique sur l'ongle",
        "La poudre s'utilise pour un intertrigo et la décontamination ; sur l'ongle, il faut une solution filmogène (vernis)."
      ]
    ],
    "cle": "**Un seul ongle** atteint sans toucher la matrice : **vernis antifongique** local (ciclopirox 1×/j ou amorolfine 1×/sem) pendant **9 à 12 mois** aux pieds.",
    "orient": 0,
    "orientWhy": "Un seul ongle atteint sans atteinte matricielle : soin local et prescription topique par le pédicure-podologue suffisent.",
    "tt": [
      [
        "Couper l'ongle court, nettoyer et bien sécher",
        1
      ],
      [
        "Prescrire un vernis (ciclopirox 1×/j ou amorolfine 1×/sem)",
        1
      ],
      [
        "Décontaminer les chaussures et les chaussons",
        1
      ],
      [
        "Dépister l'entourage familial",
        1
      ],
      [
        "Prescrire de la griséofulvine par voie orale",
        0
      ],
      [
        "Conseiller des chaussures fermées et serrées",
        0
      ]
    ],
    "conseil": {
      "q": "Si ça me brûle fort ou que ça devient tout rouge autour, je continue ?",
      "ok": "Une légère brûlure transitoire est possible, mais en cas de vraie rougeur, démangeaisons ou eczéma, arrêtez le traitement.",
      "ko": [
        "C'est normal que la peau pèle et démange fort, il faut doubler la dose.",
        "Il faut mettre un pansement plastique serré par-dessus le vernis toute la nuit."
      ]
    }
  },
  "hematome": {
    "id": "hematome",
    "nom": "Julien",
    "age": 31,
    "sexe": "m",
    "qui": "coureur de trail, a fait une course avec une longue descente hier",
    "motif": "Depuis hier soir, mon gros orteil me lance terriblement, j'ai l'impression qu'il bat au rythme de mon cœur.",
    "ask": [
      [
        "Quand la douleur a-t-elle commencé exactement ?",
        "Hier soir, quelques heures après ma course de 30 kilomètres avec beaucoup de dénivelé négatif.",
        1
      ],
      [
        "Vos chaussures de course étaient comment ?",
        "Un peu justes devant, mon gros orteil tapait au fond à chaque descente.",
        1
      ],
      [
        "La tache sous l'ongle était-elle déjà là le mois dernier ?",
        "Non, mon ongle était tout à fait normal hier matin avant le départ.",
        1
      ],
      [
        "Avez-vous eu de la fièvre ou des frissons cette nuit ?",
        "Non, pas de fièvre.",
        0
      ],
      [
        "Avez-vous des antécédents de goutte dans la famille ?",
        "Non, personne n'a ça chez nous.",
        0
      ],
      [
        "Prenez-vous un traitement pour la tension ?",
        "Non, aucun médicament.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter l'ongle de l'hallux",
        "Tache rouge foncé à noire occupant plus de la moitié de la plaque unguéale, apparue brutalement.",
        1,
        0
      ],
      [
        "Palper doucement la plaque unguéale",
        "Douleur vive et exquise à la moindre pression sur l'ongle, qui est sous tension.",
        1,
        0
      ],
      [
        "Mobiliser l'articulation interphalangienne et palper l'os",
        "Pas de craquement ni de déformation osseuse suspectant une fracture de la phalange.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Flexion plantaire présente à la pression du mollet.",
        0,
        25
      ],
      [
        "Tiroir antérieur de cheville",
        "Pas de laxité ligamentaire à la cheville.",
        0,
        21
      ]
    ],
    "dx": "Un hématome sous-unguéal aigu",
    "ddx": [
      [
        "Un mélanome sous-unguéal",
        "Le mélanome évolue lentement sans douleur pulsatile aiguë ; ici la tache a suivi immédiatement le trail."
      ],
      [
        "Une onychomycose pigmentée",
        "Une mycose s'installe sur des mois avec un ongle friable, pas en quelques heures avec une douleur battante."
      ],
      [
        "Une paronychie aiguë",
        "La paronychie est une inflammation du bourrelet autour de l'ongle, pas une poche de sang sous la plaque."
      ]
    ],
    "cle": "Course en descente il y a **moins de 48 h**, tache **rouge foncé à noire** et douleur **aiguë pulsatile** : hématome sous-unguéal sous tension.",
    "orient": 0,
    "orientWhy": "Hématome de moins de 48 h sans signe de fracture : le pédicure-podologue évacue le sang au cabinet pour soulager immédiatement.",
    "tt": [
      [
        "Désinfecter l'orteil (ex. Hexomédine transcutanée)",
        1
      ],
      [
        "Percer 2 petits trous dans l'ongle pour évacuer le sang",
        1
      ],
      [
        "Poser un pansement compressif et protecteur avec antiseptique",
        1
      ],
      [
        "Conseiller sur le chaussant (longueur, laçage) et la coupe droite",
        1
      ],
      [
        "Arracher toute la plaque unguéale à la pince",
        0
      ],
      [
        "Appliquer un gel anti-inflammatoire directement sur l'ongle percé",
        0
      ]
    ],
    "conseil": {
      "q": "Maintenant que vous avez percé, mon ongle est sauvé ou il va tomber ?",
      "ok": "Vous êtes soulagé tout de suite, mais l'ongle peut quand même se décoller et tomber en repoussant : surveillez toute rougeur.",
      "ko": [
        "Comme on l'a percé dans les 48 heures, il ne tombera jamais.",
        "Il va tomber demain matin et ne repoussera plus."
      ]
    }
  },
  "ains": {
    "id": "ains",
    "nom": "Karim",
    "age": 29,
    "sexe": "m",
    "qui": "footballeur amateur, vient pour un soin d'orteil après un match",
    "motif": "On m'a marché sur le pied dimanche : j'ai mal à l'orteil et la peau est écorchée dessus, je pensais mettre du gel Ketum.",
    "dxq": "Que dois-tu lui expliquer sur l'usage des AINS dans sa situation ?",
    "ask": [
      [
        "Montrez-moi où vous voulez mettre votre gel : la peau est-elle ouverte ?",
        "Oui, le crampon a arraché la peau sur le dessus de l'orteil, ça suinte un peu.",
        1
      ],
      [
        "Avez-vous déjà eu des brûlures d'estomac ou un ulcère ?",
        "Oui, j'ai fait un ulcère à l'estomac l'an dernier.",
        1
      ],
      [
        "Comptez-vous vous entraîner dehors au soleil cet après-midi ?",
        "Oui, on s'entraîne à 15 heures en plein soleil.",
        1
      ],
      [
        "Portez-vous des semelles orthopédiques ?",
        "Non, jamais.",
        0
      ],
      [
        "Avez-vous des fourmillements dans la plante du pied ?",
        "Non, aucun fourmillement.",
        0
      ],
      [
        "Vos ongles s'incarnent-ils souvent ?",
        "Non, je n'ai jamais eu d'ongle incarné.",
        0
      ]
    ],
    "exam": [
      [
        "Examiner le dos du 2e orteil",
        "Plaie superficielle abrasée et irritée en regard de l'articulation interphalangienne tuméfiée.",
        1,
        0
      ],
      [
        "Mobiliser doucement l'orteil",
        "Entorse bénigne de l'orteil avec douleur inflammatoire locale, sans déformation axiale.",
        1,
        0
      ],
      [
        "Vérifier le reste de l'avant-pied",
        "Pas d'autre plaie, bonne coloration distale.",
        1,
        0
      ],
      [
        "Test de Lachman de la MTP",
        "Stabilité normale de la plaque plantaire.",
        0,
        29
      ],
      [
        "Signes de Tinel et de Phalen (canal tarsien)",
        "Aucune douleur ni paresthésie sur le trajet du nerf tibial.",
        0,
        32
      ]
    ],
    "dx": "Surtout pas d'AINS : le gel est interdit sur peau lésée (et au soleil) et la voie orale est contre-indiquée par son ulcère",
    "ddx": [
      [
        "Lui prescrire de l'ibuprofène par voie orale",
        "Le pédicure-podologue ne peut pas prescrire d'AINS, et son antécédent d'ulcère gastro-duodénal les contre-indique."
      ],
      [
        "Appliquer le gel de kétoprofène sur la plaie sous pansement",
        "On n'applique jamais un AINS topique sur une peau lésée ou une plaie : risque de brûlure, d'allergie et de retard de cicatrisation."
      ],
      [
        "Mettre le gel de kétoprofène juste avant son match au soleil",
        "Le gel au kétoprofène expose à des réactions cutanées graves (photosensibilisation) en cas d'exposition au soleil."
      ]
    ],
    "cle": "Le podologue **ne prescrit pas d'AINS**. Jamais de gel sur **peau lésée** (retard de cicatrisation, allergie) ni au **soleil** (kétoprofène) ; ulcère = CI.",
    "orient": 0,
    "orientWhy": "Traumatisme local bénin : le pédicure-podologue assure les soins locaux, la décharge et conseille le patient sur les contre-indications.",
    "tt": [
      [
        "Déconseiller formellement le gel AINS sur la peau lésée",
        1
      ],
      [
        "Nettoyer et protéger la petite plaie avec un soin local adapté",
        1
      ],
      [
        "Réaliser une décharge locale (taping / syndactylie ou orthèse)",
        1
      ],
      [
        "Rappeler la contre-indication des AINS oraux avec son ulcère",
        1
      ],
      [
        "Rédiger une ordonnance de kétoprofène par voie orale",
        0
      ],
      [
        "Masser la plaie ouverte avec du diclofénac en gel",
        0
      ]
    ],
    "conseil": {
      "q": "À quoi servent les anti-inflammatoires alors, si je ne peux pas en mettre là ?",
      "ok": "Ils agissent contre la douleur, l'inflammation et la fièvre, mais en gel ils ne se mettent que sur une peau intacte, sans soleil.",
      "ko": [
        "Ce sont des antibiotiques qui tuent les microbes dans les plaies ouvertes.",
        "Ils servent à faire cicatriser plus vite les plaies chez les diabétiques."
      ]
    }
  },
  "antiseptiques": {
    "id": "antiseptiques",
    "nom": "Chloé",
    "age": 27,
    "sexe": "f",
    "qui": "infirmière enceinte de 7 mois, vient pour un ongle incarné débutant",
    "motif": "Le coin de mon ongle me rentre dans la peau, c'est rouge. J'ai un vieux flacon de Bétadine ouvert l'an dernier, je peux en mettre ?",
    "dxq": "Quel antiseptique et quelles règles d'utilisation dois-tu choisir ?",
    "ask": [
      [
        "Vous êtes à quel mois de grossesse ?",
        "Je suis au début de mon septième mois, donc au troisième trimestre.",
        1
      ],
      [
        "Depuis quand votre flacon de Bétadine est-il ouvert ?",
        "Je l'ai ouvert il y a presque un an pour une coupure.",
        1
      ],
      [
        "Êtes-vous allergique à la chlorhexidine ou à l'hexamidine ?",
        "Non, je n'ai aucune allergie connue.",
        1
      ],
      [
        "Avez-vous des varices sur les jambes ?",
        "Non, je porte des bas de contention et tout va bien.",
        0
      ],
      [
        "Marchez-vous souvent pieds nus à la piscine ?",
        "Non, je n'y vais plus en ce moment.",
        0
      ],
      [
        "Avez-vous mal au genou en montant les escaliers ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter le sillon unguéal de l'hallux",
        "Bourrelet péri-unguéal rouge et sensible sur un ongle incarné débutant, sans collection purulente.",
        1,
        0
      ],
      [
        "Vérifier l'état cutané après lavage au savon",
        "Il reste des traces de savon sur le pied : un rinçage soigneux est indispensable avant tout antiseptique.",
        1,
        0
      ],
      [
        "Dégager doucement l'éperon unguéal",
        "L'éperon est retiré proprement, la zone nécessite maintenant une antisepsie locale adaptée.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Réponse normale du triceps sural.",
        0,
        25
      ],
      [
        "Test de Lasègue",
        "Pas de douleur radiculaire.",
        0,
        13
      ]
    ],
    "dx": "Utiliser de l'hexamidine (Hexomédine) ou de la chlorhexidine neuve sur peau rincée et sèche, et jeter la Bétadine",
    "ddx": [
      [
        "Utiliser sa Bétadine ouverte l'an dernier",
        "Les dérivés iodés sont contre-indiqués aux 2e et 3e trimestres de grossesse, et un flacon ouvert est périmé (28 j max en général)."
      ],
      [
        "Mélanger Bétadine et eau de Dakin pour plus d'efficacité",
        "On n'associe jamais deux antiseptiques à cause des interférences chimiques, et l'iode est interdit au 3e trimestre."
      ],
      [
        "Mettre de l'alcool modifié directement dans la plaie du sillon",
        "L'alcool ne s'applique jamais sur les plaies ni les muqueuses car il est douloureux et irritant."
      ]
    ],
    "cle": "**Grossesse T2-T3** = dérivés **iodés contre-indiqués**. Ongle incarné : **Hexomédine** (ou chlorhexidine après rinçage du savon), flacon **< 28 jours**.",
    "orient": 0,
    "orientWhy": "Ongle incarné débutant sans signe de gravité : soin instrumental et antisepsie adaptée au cabinet par le pédicure-podologue.",
    "tt": [
      [
        "Nettoyer, bien rincer le savon et sécher avant l'antiseptique",
        1
      ],
      [
        "Appliquer de l'Hexomédine (ou chlorhexidine) en dose unitaire",
        1
      ],
      [
        "Laisser sécher à l'air libre sans essuyer",
        1
      ],
      [
        "Faire jeter le vieux flacon et noter la date d'ouverture (28 j)",
        1
      ],
      [
        "Appliquer de la Bétadine dermique en pansement humide",
        0
      ],
      [
        "Associer deux antiseptiques différents sur le sillon",
        0
      ]
    ],
    "conseil": {
      "q": "Si je prends un flacon d'Hexomédine transcutanée à la pharmacie, je le garde combien de temps une fois ouvert ?",
      "ok": "Il se conserve 15 jours après ouverture à moins de 25 °C (et 5 jours en bain local) : notez toujours la date sur le flacon.",
      "ko": [
        "Une fois ouvert, un antiseptique se garde trois ans dans la salle de bain.",
        "Vous pouvez toucher le goulot avec vos doigts tant que vous refermez bien le bouchon."
      ]
    }
  },
  "mycoses": {
    "id": "mycoses",
    "nom": "Mehdi",
    "age": 26,
    "sexe": "m",
    "qui": "plongeur en restauration, travaille au chaud et à l'humidité toute la journée",
    "motif": "Ça me brûle et ça me gratte énormément entre les deux derniers orteils depuis trois semaines.",
    "ask": [
      [
        "Quelles chaussures portez-vous au travail ?",
        "Des chaussures de sécurité fermées en cuisine, j'ai les pieds trempés de transpiration du matin au soir.",
        1
      ],
      [
        "Comment vous séchez-vous les pieds après la douche ?",
        "Vite fait sur le tapis de bain, je ne passe jamais la serviette entre les orteils.",
        1
      ],
      [
        "Avez-vous pris des antibiotiques récemment ?",
        "Oui, j'ai pris dix jours d'antibiotiques le mois dernier pour une grosse angine.",
        1
      ],
      [
        "Avez-vous eu un traumatisme à la cheville ?",
        "Non, aucune torsion.",
        0
      ],
      [
        "Avez-vous des douleurs dans le bas du dos ?",
        "Non, rien au dos.",
        0
      ],
      [
        "Quelqu'un dans votre famille a-t-il du psoriasis ?",
        "Non, personne.",
        0
      ]
    ],
    "exam": [
      [
        "Écarter les 4e et 5e orteils",
        "Lésion érythémateuse rouge vif, brillante et suintante au fond du pli, entourée d'une collerette blanchâtre.",
        1,
        0
      ],
      [
        "Examiner la plante des pieds et les autres plis",
        "Quelques petites squames périphériques, peau macérée par l'hyperhidrose mais ongles intacts.",
        1,
        0
      ],
      [
        "Rechercher des signes de surinfection bactérienne",
        "Pas de pus franc, pas de placard chaud sur le dos du pied ni de traînée rouge sur la jambe.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur normaux.",
        0,
        36
      ],
      [
        "Test de Thomas modifié",
        "Pas de rétraction des fléchisseurs de hanche.",
        0,
        8
      ]
    ],
    "dx": "Une mycose cutanée : intertrigo candidosique inter-orteils",
    "ddx": [
      [
        "Un psoriasis inversé des plis",
        "Le psoriasis donne des plaques bien limitées souvent associées à d'autres localisations, sans collerette blanchâtre post-antibiotiques."
      ],
      [
        "Un eczéma de contact",
        "L'eczéma évolue par vésicules et croûtes sur la zone de contact avec un allergène, pas un fond de pli brillant à collerette blanche."
      ],
      [
        "Un érysipèle débutant",
        "L'érysipèle donne une grosse jambe rouge aiguë avec fièvre à 39-40 °C, même si l'intertrigo peut en être la porte d'entrée."
      ]
    ],
    "cle": "Macération en chaussures de sécurité + antibiotiques + pli **rouge, brillant, suintant avec collerette blanchâtre** et prurit : **intertrigo candidosique**.",
    "orient": 0,
    "orientWhy": "Mycose cutanée superficielle localisée : traitement antifongique topique et conseils d'hygiène au cabinet.",
    "tt": [
      [
        "Appliquer un antifongique topique (ex. éconazole) 1 à 2×/jour",
        1
      ],
      [
        "Poursuivre le traitement local pendant plusieurs semaines",
        1
      ],
      [
        "Sécher soigneusement les espaces interdigitaux après la douche",
        1
      ],
      [
        "Changer de chaussettes tous les jours et aérer les pieds",
        1
      ],
      [
        "Appliquer un dermocorticoïde seul dans le pli",
        0
      ],
      [
        "Prescrire d'emblée un antifongique par voie orale",
        0
      ]
    ],
    "conseil": {
      "q": "Dès que ça ne me gratte plus au bout de 4 ou 5 jours, je peux arrêter la crème ?",
      "ok": "Non, il faut continuer plusieurs semaines jusqu'au bout et bien sécher entre les orteils, sinon ça récidive très vite.",
      "ko": [
        "Oui, dès que la démangeaison s'arrête, le champignon est mort.",
        "Il faut se laver les pieds cinq fois par jour au savon décapant pour éviter que ça revienne."
      ]
    }
  },
  "hyperkeratoses": {
    "id": "hyperkeratoses",
    "nom": "Odette",
    "age": 69,
    "sexe": "f",
    "qui": "retraitée active, marche tous les jours avec des chaussures de ville étroites",
    "motif": "J'ai comme une épine sur le dessus du deuxième orteil et ça me brûle sous l'avant du pied quand je marche.",
    "ask": [
      [
        "Comment est la douleur sur votre orteil ?",
        "Au début ça piquait comme une aiguille quand je marchais, maintenant ça me lance même le soir au repos.",
        1
      ],
      [
        "Quel type de chaussures portez-vous au quotidien ?",
        "Des chaussures en cuir assez rigides et pointues, le dessus frotte pile sur mon orteil replié.",
        1
      ],
      [
        "Êtes-vous diabétique ou artéritique ?",
        "Non, ma glycémie et ma circulation sont tout à fait normales.",
        1
      ],
      [
        "Allez-vous à la piscine municipale ?",
        "Non, je ne sais pas nager.",
        0
      ],
      [
        "Avez-vous eu une fièvre ou des frissons ?",
        "Non, je me sens très bien à part mes pieds.",
        0
      ],
      [
        "Avez-vous fait un long voyage en avion récemment ?",
        "Non, je ne prends jamais l'avion.",
        0
      ]
    ],
    "exam": [
      [
        "Examiner le dos du 2e orteil",
        "Petite induration ronde et très douloureuse à la pression directe en regard de l'interphalangienne, avec un nucléus central dense.",
        1,
        0
      ],
      [
        "Inspecter et palper la plante de l'avant-pied",
        "Plaque cornée jaunâtre étendue et mal délimitée sous les têtes métatarsiennes médianes, sans nucléus.",
        1,
        0
      ],
      [
        "Observer la statique du pied",
        "Hallux valgus, 2e orteil en griffe qui frotte contre la chaussure, et fonte du capiton plantaire liée à l'âge.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur bien perçus.",
        0,
        36
      ],
      [
        "Signe de Mulder",
        "Pas de douleur inter-métatarsienne ni de clic.",
        0,
        30
      ]
    ],
    "dx": "Un cor dorsal sur le 2e orteil et un durillon plantaire sous les têtes métatarsiennes",
    "ddx": [
      [
        "Deux verrues plantaires et digitales",
        "La verrue a des points noirs, interrompt les dermatoglyphes et fait mal au pincement ; ici il y a un nucléus sur zone de conflit."
      ],
      [
        "Un mal perforant plantaire",
        "Le mal perforant est une ulcération profonde et indolore chez un patient diabétique neuropathique."
      ],
      [
        "Une phlyctène",
        "La phlyctène est une bulle aiguë remplie de liquide séreux, pas un épaississement chronique de kératine."
      ]
    ],
    "cle": "Peau coincée entre l'os (griffe, hallux valgus) et la chaussure étroite : **cor** (petit, **nucléus central** très douloureux) et **durillon** (étalé sous les têtes).",
    "orient": 0,
    "orientWhy": "Pas de signe d'infection ni d'ostéite : soin pédicural instrumental et prise en charge orthétique au cabinet.",
    "tt": [
      [
        "Ablation mécanique de l'hyperkératose au bistouri (lame 10, 15, 20/21)",
        1
      ],
      [
        "Énucléer le nucléus du cor à la gouge ou à la turbine",
        1
      ],
      [
        "Proposer une orthoplastie protectrice et des semelles orthopédiques",
        1
      ],
      [
        "Conseiller des chaussures adaptées et une hydratation quotidienne",
        1
      ],
      [
        "Appliquer un coricide kératolytique fort sur l'orteil",
        0
      ],
      [
        "Prescrire des antibiotiques par voie orale",
        0
      ]
    ],
    "conseil": {
      "q": "Maintenant que vous avez tout enlevé au bistouri, ça ne reviendra plus jamais ?",
      "ok": "Ça reviendra si le conflit persiste : il faut des chaussures adaptées, hydrater la peau et porter vos orthèses.",
      "ko": [
        "Une fois le nucléus retiré à la gouge, un cor ne peut jamais repousser.",
        "Si ça revient, mettez des pansements coricides à l'acide vendus en supermarché."
      ]
    }
  },
  "phlyctenes": {
    "id": "phlyctenes",
    "nom": "Camille",
    "age": 24,
    "sexe": "f",
    "qui": "randonneuse, prépare un trail et revient d'une sortie de 20 km",
    "motif": "J'ai essayé mes chaussures de randonnée neuves hier, ça me brûle derrière le talon.",
    "ask": [
      [
        "Quelles chaussettes portiez-vous avec vos chaussures neuves ?",
        "Des chaussettes de sport classiques en coton avec une grosse couture au talon, et j'ai beaucoup transpiré.",
        1
      ],
      [
        "La cloque s'est-elle percée ou voyez-vous du pus ?",
        "Non, elle n'est pas percée, le liquide dedans a l'air tout clair.",
        1
      ],
      [
        "Êtes-vous diabétique ou avez-vous des problèmes de circulation ?",
        "Non, je suis en pleine santé.",
        1
      ],
      [
        "Avez-vous ressenti un claquement derrière la cheville ?",
        "Non, aucun claquement.",
        0
      ],
      [
        "Avez-vous mal au genou sur le côté externe ?",
        "Non, aucune douleur au genou.",
        0
      ],
      [
        "Avez-vous eu de la fièvre ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter l'arrière du talon",
        "Grosse bulle ovale très tendue, à risque de rupture, remplie d'un liquide séreux clair avec un léger halo rosé.",
        1,
        0
      ],
      [
        "Vérifier l'absence de signes d'infection",
        "Pas d'écoulement purulent, pas de chaleur diffuse ni de traînée inflammatoire.",
        1,
        0
      ],
      [
        "Palper délicatement le pourtour",
        "Douleur localisée à la pression et sensation de brûlure ; l'épiderme soulevé est intact.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Contraction normale du mollet entraînant la flexion plantaire.",
        0,
        25
      ],
      [
        "Triade de la tendinopathie sur le tendon d'Achille",
        "Tendon d'Achille indolore à l'étirement et à la contraction résistée.",
        0,
        31
      ]
    ],
    "dx": "Une phlyctène (ampoule) fermée, volumineuse et à risque de rupture",
    "ddx": [
      [
        "Une phlyctène surinfectée",
        "Le liquide est séreux et clair, sans pus, sans augmentation brutale de la douleur ni fièvre."
      ],
      [
        "Une bursite rétro-calcanéenne profonde",
        "Il s'agit ici d'un soulèvement superficiel de l'épiderme rempli de sérosité claire après frottement de chaussure neuve."
      ],
      [
        "Un durillon du talon",
        "Le durillon est un épaississement corné chronique (même si une phlyctène asséchée peut évoluer en durillon si le frottement persiste)."
      ]
    ],
    "cle": "Frottement en **chaussures neuves** + bulle de **liquide séreux clair** très tendue chez une sportive non diabétique : **phlyctène à risque de rupture**.",
    "orient": 0,
    "orientWhy": "Pathologie bénigne non infectée chez une patiente saine : soin local au cabinet et conseils de prévention pour son trail.",
    "tt": [
      [
        "Ponctionner doucement avec une aiguille stérile en gardant le toit",
        1
      ],
      [
        "Appliquer un antiseptique asséchant",
        1
      ],
      [
        "Poser un pansement protecteur par-dessus",
        1
      ],
      [
        "Conseiller des chaussettes sans couture et un chaussant adapté",
        1
      ],
      [
        "Découper et arracher toute la peau de l'ampoule",
        0
      ],
      [
        "Appliquer un gel anti-inflammatoire sur la bulle percée",
        0
      ]
    ],
    "conseil": {
      "q": "Comment je prépare mes pieds avant mon prochain trail dans un mois pour éviter d'en ravoir ?",
      "ok": "Soin de pédicurie 3 semaines avant, puis tannage (acide citrique) et hydratation, et arrêt du tannage quelques jours avant.",
      "ko": [
        "Collez des pansements préventifs partout sous les pieds le matin de la course et poncez toute la corne la veille.",
        "Trempez vos pieds dans de l'eau très chaude salée juste avant le départ pour ramollir la peau."
      ]
    }
  },
  "mpp": {
    "id": "mpp",
    "nom": "Bernard",
    "age": 68,
    "sexe": "m",
    "qui": "retraité, diabétique de type 2 depuis 18 ans",
    "motif": "Ma femme a vu une tache sur ma chaussette hier soir : j'ai un trou sous le pied, mais je ne sens absolument rien.",
    "ask": [
      [
        "Votre diabète est-il bien équilibré en ce moment ?",
        "Pas trop, ma dernière hémoglobine glyquée était à 8,5 % et je ne faisais plus suivre mes pieds.",
        1
      ],
      [
        "Avez-vous des fourmillements ou une perte de sensibilité dans les pieds ?",
        "Oui, j'ai l'impression de marcher sur du coton depuis deux ou trois ans.",
        1
      ],
      [
        "Avez-vous eu de la fièvre, ou avez-vous remarqué du pus et une mauvaise odeur ?",
        "Non, pas de fièvre, ça suinte juste un liquide clair sans odeur.",
        1
      ],
      [
        "Faites-vous de la natation en club ?",
        "Non, je ne fais pas de sport.",
        0
      ],
      [
        "Avez-vous mal à l'épaule ou au cou ?",
        "Non, rien de ce côté-là.",
        0
      ],
      [
        "Prenez-vous du lithium ?",
        "Non, uniquement mes médicaments pour le diabète.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter les deux pieds",
        "Ulcération ronde, profonde et indolore sous la 1re tête métatarsienne, entourée d'un épais halo hyperkératosique ; orteils en griffe et xérose.",
        1,
        0
      ],
      [
        "Test au monofilament 10 g (Semmes-Weinstein)",
        "Le patient ne perçoit pas le monofilament sur la plante des deux pieds : perte de la sensibilité protectrice.",
        1,
        33
      ],
      [
        "Prendre les pouls pédieux et tibiaux postérieurs",
        "Pouls présents mais un peu faibles ; pas de nécrose ni de placard rouge extensif.",
        1,
        36
      ],
      [
        "Signe de Thompson",
        "Tendon d'Achille intact.",
        0,
        25
      ],
      [
        "Test d'Adams",
        "Pas de gibbosité rachidienne.",
        0,
        2
      ]
    ],
    "dx": "Un mal perforant plantaire (ulcère neuropathique du pied diabétique)",
    "ddx": [
      [
        "Un durillon simple",
        "Sous l'hyperkératose, la peau est creusée par une ulcération profonde et indolore sur terrain de neuropathie diabétique."
      ],
      [
        "Une verrue plantaire",
        "La verrue fait mal au pincement avec des points noirs ; ici c'est une plaie profonde totalement indolore sous une zone d'hyperpression."
      ],
      [
        "Un ulcère veineux variqueux",
        "L'ulcère veineux siège aux malléoles sur jambe œdématiée avec dermite ocre, pas sous une tête métatarsienne en hyperpression."
      ]
    ],
    "cle": "**Diabétique** + perte de sensibilité au **monofilament** + **plaie plantaire profonde indolore** entourée d'un **halo hyperkératosique** : mal perforant plantaire.",
    "orient": 1,
    "orientWhy": "Toute plaie du pied diabétique impose une mise en décharge et une orientation rapide vers une équipe pluridisciplinaire (hospitalisation d'urgence si infection sévère).",
    "tt": [
      [
        "Mettre immédiatement le pied en décharge stricte",
        1
      ],
      [
        "Réaliser une détersion douce de l'hyperkératose et un pansement adapté",
        1
      ],
      [
        "Orienter vite vers l'équipe pluridisciplinaire (bilan, radio)",
        1
      ],
      [
        "Éduquer (inspection quotidienne, jamais marcher pieds nus)",
        1
      ],
      [
        "Conseiller de marcher 1 h par jour dessus pour la circulation",
        0
      ],
      [
        "Appliquer un coricide à l'acide salicylique sur le halo",
        0
      ]
    ],
    "conseil": {
      "q": "Comme ça ne me fait pas mal du tout, je peux quand même poser le pied par terre à la maison ?",
      "ok": "Non : la neuropathie masque la douleur, mais chaque appui empêche la cicatrisation et expose à l'infection et à l'amputation.",
      "ko": [
        "Oui, tant que ça ne fait pas mal vous pouvez marcher normalement chez vous, même pieds nus.",
        "Mettez juste un petit pansement ordinaire et gardez vos chaussures habituelles."
      ]
    }
  },
  "aomi": {
    "id": "aomi",
    "nom": "Gérard",
    "age": 63,
    "sexe": "m",
    "qui": "ancien chauffeur routier, fume un paquet par jour depuis 40 ans",
    "motif": "Quand je marche un peu vite, une crampe terrible me prend dans le mollet droit et m'oblige à m'arrêter.",
    "ask": [
      [
        "Au bout de quelle distance la douleur apparaît-elle, et que se passe-t-il quand vous vous arrêtez ?",
        "Au bout de 200 mètres environ, et dès que je m'arrête deux minutes, ça passe complètement.",
        1
      ],
      [
        "Avez-vous mal au pied la nuit quand vous êtes allongé dans votre lit ?",
        "Non, la nuit je dors bien, je n'ai mal que quand je marche.",
        1
      ],
      [
        "Avez-vous de l'hypertension, du cholestérol ou du diabète en plus du tabac ?",
        "Oui, je suis traité pour la tension et le cholestérol.",
        1
      ],
      [
        "Avez-vous fait un voyage en avion récemment ?",
        "Non, je ne voyage pas.",
        0
      ],
      [
        "Votre douleur descend-elle depuis le bas du dos comme une décharge électrique ?",
        "Non, je n'ai pas mal au dos, c'est vraiment une crampe dans le mollet à la marche.",
        0
      ],
      [
        "Avez-vous changé de lessive ou de savon ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter et toucher les deux pieds",
        "Pied droit froid et pâle, peau sèche et dépilée ; temps de recoloration cutanée allongé à plus de 5 secondes.",
        1,
        0
      ],
      [
        "Palper les pouls pédieux et tibial postérieur",
        "Pouls pédieux et tibial postérieur abolis à droite, présents à gauche.",
        1,
        36
      ],
      [
        "Mesurer l'indice de pression systolique (IPS)",
        "IPS mesuré à 0,72 à droite (inférieur à 0,9), confirmant le déficit artériel.",
        1,
        37
      ],
      [
        "Test de Lasègue",
        "Pas de douleur sciatique à l'élévation du membre tendu.",
        0,
        13
      ],
      [
        "Signe de Thompson",
        "Tendon d'Achille continu et fonctionnel.",
        0,
        25
      ]
    ],
    "dx": "Une artériopathie oblitérante des membres inférieurs (AOMI) au stade II de Leriche et Fontaine",
    "ddx": [
      [
        "Une phlébite (TVP)",
        "La phlébite donne un mollet chaud, rouge, gonflé et douloureux au repos, pas un pied froid avec crampe d'effort cédant à l'arrêt."
      ],
      [
        "Une sciatique L5 ou S1",
        "La sciatique part du rachis avec un Lasègue positif ; ici les pouls sont abolis et l'IPS est < 0,9."
      ],
      [
        "Une AOMI au stade III ou IV",
        "Il n'a ni douleur de décubitus la nuit (stade III) ni trouble trophique comme un ulcère ou une nécrose (stade IV)."
      ]
    ],
    "cle": "Fumeur + **claudication intermittente** à l'effort cédant au repos + pied froid, **pouls abolis** et **IPS < 0,9** : **AOMI stade II**.",
    "orient": 1,
    "orientWhy": "Pas d'ischémie critique aiguë (stade II), mais pathologie cardiovasculaire grave : soins prudents et orientation vers le médecin pour écho-doppler et traitement médical.",
    "tt": [
      [
        "Adresser au médecin (écho-doppler artériel et bilan CV)",
        1
      ],
      [
        "Encourager l'arrêt du tabac et la marche quotidienne (30 min/jour)",
        1
      ],
      [
        "Rappeler le contrôle des facteurs de risque (tension, diabète, cholestérol)",
        1
      ],
      [
        "Poser des bas de contention veineuse serrés de classe III",
        0
      ],
      [
        "Ponctionner la peau ou faire un soin agressif au bistouri",
        0
      ],
      [
        "Conseiller le repos strict au lit sans marcher",
        0
      ]
    ],
    "conseil": {
      "q": "Comme j'ai mal en marchant, je dois arrêter de marcher pour économiser mes artères ?",
      "ok": "Au contraire : au stade de la claudication, marcher 30 minutes par jour avec l'arrêt du tabac développe les artères de secours.",
      "ko": [
        "Oui, il faut rester assis le plus possible et ne plus jamais faire travailler vos mollets.",
        "Trempez vos pieds dans de l'eau bouillante pour réchauffer et dilater vos artères."
      ]
    }
  },
  "phlebite": {
    "id": "phlebite",
    "nom": "Sophie",
    "age": 41,
    "sexe": "f",
    "qui": "cadre commerciale, rentre d'un vol long-courrier de 11 heures il y a deux jours",
    "motif": "J'ai mal dans le mollet gauche depuis hier matin et ma cheville a gonflé d'un seul côté.",
    "ask": [
      [
        "Prenez-vous une contraception orale ou fumez-vous ?",
        "Oui, je prends une pilule œstroprogestative et je fume un peu.",
        1
      ],
      [
        "Avez-vous pris l'avion ou êtes-vous restée longtemps immobile récemment ?",
        "Oui, onze heures d'avion avant-hier sans bouger de mon siège.",
        1
      ],
      [
        "Êtes-vous essoufflée ou avez-vous une douleur dans la poitrine ?",
        "Non, je respire normalement et je n'ai pas mal dans la poitrine.",
        1
      ],
      [
        "Avez-vous porté des chaussures neuves ?",
        "Non, mes baskets habituelles.",
        0
      ],
      [
        "Avez-vous eu une angine le mois dernier ?",
        "Non, je n'ai pas été malade.",
        0
      ],
      [
        "Avez-vous des plaques qui grattent sur les coudes ?",
        "Non, aucune plaque.",
        0
      ]
    ],
    "exam": [
      [
        "Comparer et palper les deux mollets",
        "Œdème unilatéral de la jambe gauche, peau chaude et légèrement rouge, avec perte du ballottement du mollet.",
        1,
        0
      ],
      [
        "Rechercher le signe de Homans",
        "La dorsiflexion passive du pied gauche réveille une douleur nette dans le mollet.",
        1,
        0
      ],
      [
        "Vérifier la fréquence respiratoire et le pouls",
        "Pas de polypnée ni de tachycardie au repos ; les pouls artériels périphériques sont bien perçus.",
        1,
        36
      ],
      [
        "Signe de Mulder",
        "Pas de douleur à l'avant-pied.",
        0,
        30
      ],
      [
        "Test de Noble",
        "Pas de douleur sur la face externe du genou.",
        0,
        17
      ]
    ],
    "dx": "Une phlébite (thrombose veineuse profonde, TVP) du membre inférieur gauche",
    "ddx": [
      [
        "Une insuffisance veineuse simple (œdème de stase)",
        "L'insuffisance veineuse chronique est souvent bilatérale en fin de journée, sans perte brutale du ballottement après un long vol."
      ],
      [
        "Un érysipèle",
        "L'érysipèle débute brutalement avec une fièvre élevée à 39-40 °C, des frissons et un placard rouge vif bien délimité."
      ],
      [
        "Une rupture du tendon d'Achille",
        "Elle survient lors d'un effort avec un claquement brutal et un signe de Thompson positif, pas spontanément après un vol."
      ]
    ],
    "cle": "Long voyage + pilule + **douleur unilatérale du mollet**, **œdème chaud**, **perte du ballottement** et signe de **Homans** : suspicion de **TVP**.",
    "orient": 2,
    "orientWhy": "Urgence médicale : risque d'embolie pulmonaire. Il faut l'adresser immédiatement au médecin ou aux urgences pour écho-doppler veineux et anticoagulation.",
    "tt": [
      [
        "Adresser en urgence au médecin / urgences pour écho-doppler veineux",
        1
      ],
      [
        "Expliquer la base du traitement : les anticoagulants (héparine, puis relais)",
        1
      ],
      [
        "Prévoir des bas de contention élastique et une mobilisation précoce",
        1
      ],
      [
        "Surveiller les signes d'embolie pulmonaire (dyspnée, thorax)",
        1
      ],
      [
        "Faire un massage profond du mollet pour drainer l'œdème",
        0
      ],
      [
        "Lui dire de rentrer à pied et de revenir dans 15 jours",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi vous m'envoyez voir le médecin tout de suite pour une simple douleur au mollet ?",
      "ok": "Car un caillot dans une veine profonde peut migrer vers les poumons (embolie pulmonaire) : il faut un écho-doppler en urgence.",
      "ko": [
        "C'est juste une crampe musculaire due à l'avion, massez bien fort votre mollet ce soir.",
        "Il faut courir trente minutes aujourd'hui pour faire circuler le sang et dissoudre la boule."
      ]
    }
  },
  "varices": {
    "id": "varices",
    "nom": "Martine",
    "age": 56,
    "sexe": "f",
    "qui": "coiffeuse, travaille debout en piétinant toute la journée",
    "motif": "J'ai les jambes lourdes comme du plomb tous les soirs et mes chevilles sont gonflées.",
    "ask": [
      [
        "À quel moment de la journée vos jambes vous gênent-elles le plus ?",
        "Surtout en fin de journée après le salon, et j'ai souvent des crampes la nuit et des démangeaisons.",
        1
      ],
      [
        "Y a-t-il des problèmes de veines dans votre famille, et avez-vous eu des grossesses ?",
        "Ma mère avait de grosses varices, et ça a commencé après ma troisième grossesse.",
        1
      ],
      [
        "Avez-vous eu de la fièvre, une douleur brutale dans un seul mollet ou un essoufflement ?",
        "Non, c'est pareil des deux côtés depuis des années, sans fièvre.",
        1
      ],
      [
        "Avez-vous mal sous le talon le matin au premier pas ?",
        "Non, pas de douleur au talon.",
        0
      ],
      [
        "Allez-vous souvent à la piscine ?",
        "Non, jamais.",
        0
      ],
      [
        "Avez-vous pris des antibiotiques récemment ?",
        "Non, aucun.",
        0
      ]
    ],
    "exam": [
      [
        "Examiner les jambes debout",
        "Veines superficielles dilatées, permanentes et tortueuses (> 3 mm) sur les deux jambes, avec œdème des chevilles.",
        1,
        0
      ],
      [
        "Inspecter la peau du tiers inférieur de la jambe",
        "Taches brunâtres de dermite ocre au-dessus des malléoles, sans ulcère ouvert (stade C4 de la classification CEAP).",
        1,
        0
      ],
      [
        "Palper les pouls pédieux et tibiaux postérieurs",
        "Pouls artériels bien perçus des deux côtés, pieds chauds ; mollets souples au ballottement.",
        1,
        36
      ],
      [
        "Test au monofilament 10 g",
        "Sensibilité plantaire normale.",
        0,
        33
      ],
      [
        "Signe de Thompson",
        "Normal des deux côtés.",
        0,
        25
      ]
    ],
    "dx": "Une insuffisance veineuse chronique avec varices, œdème de stase et dermite ocre (CEAP C4)",
    "ddx": [
      [
        "Une phlébite aiguë (TVP)",
        "Ici l'atteinte est chronique et bilatérale, les mollets sont souples, sans douleur aiguë unilatérale."
      ],
      [
        "Une AOMI",
        "Dans l'AOMI le pied est froid avec pouls abolis et claudication d'effort ; ici les pouls sont présents et la lourdeur est vespérale."
      ],
      [
        "Un érysipèle",
        "Il n'y a ni fièvre à 39-40 °C ni placard inflammatoire aigu : les taches brunâtres sont une dermite ocre chronique."
      ]
    ],
    "cle": "Femme en **station debout prolongée** + **jambes lourdes le soir**, crampes nocturnes, **veines dilatées tortueuses**, œdème et **dermite ocre** : varices et œdème veineux.",
    "orient": 1,
    "orientWhy": "Pas d'urgence vitale, mais devant l'œdème et la dermite ocre (C4), le podologue éduque et oriente vers le médecin ou phlébologue pour un doppler duplex veineux.",
    "tt": [
      [
        "Conseiller des bas de contention (classe II ou III)",
        1
      ],
      [
        "Encourager la marche active et la surélévation des jambes le soir",
        1
      ],
      [
        "Orienter vers le médecin / phlébologue pour un doppler duplex veineux",
        1
      ],
      [
        "Surveiller l'état cutané pour prévenir l'ulcère variqueux",
        1
      ],
      [
        "Interdire la marche et conseiller l'immobilité debout",
        0
      ],
      [
        "Appliquer des bains de pieds très chauds tous les soirs",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi j'ai ces taches marron sur les chevilles, c'est grave ?",
      "ok": "C'est une dermite ocre due à la stase veineuse : il faut porter la contention et voir le phlébologue pour éviter l'ulcère.",
      "ko": [
        "Ce sont juste des taches de soleil, elles partiront avec un gommage fort.",
        "Cela veut dire que vos artères sont bouchées et qu'on ne peut plus mettre de bas de contention."
      ]
    }
  },
  "erysipele": {
    "id": "erysipele",
    "nom": "Alain",
    "age": 61,
    "sexe": "m",
    "qui": "boulanger en surpoids, souffre d'insuffisance veineuse",
    "motif": "Depuis hier, ma jambe droite est devenue toute rouge et brûlante, et j'ai tremblé de fièvre toute la nuit.",
    "ask": [
      [
        "Combien aviez-vous de fièvre cette nuit ?",
        "J'avais 39,5 °C avec de gros frissons, je me sens complètement épuisé.",
        1
      ],
      [
        "Aviez-vous une petite plaie ou des démangeaisons entre les orteils avant que ça commence ?",
        "Oui, ça fait des semaines que la peau est fendue entre mes petits orteils, je n'y ai pas fait attention.",
        1
      ],
      [
        "La rougeur s'étend-elle vite ?",
        "Oui, hier matin ce n'était que sur la cheville et aujourd'hui ça remonte jusqu'au milieu du mollet.",
        1
      ],
      [
        "Votre douleur apparaît-elle uniquement au bout de 200 mètres de marche ?",
        "Non, j'ai mal tout le temps, même sans bouger.",
        0
      ],
      [
        "Avez-vous changé de chaussures de course ?",
        "Non, je ne fais pas de course à pied.",
        0
      ],
      [
        "Avez-vous des plaques squameuses dans les cheveux ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter la jambe droite",
        "Grosse jambe rouge aiguë : placard rouge vif, chaud, œdémateux, douloureux et bien circonscrit, sans zone de nécrose ni crépitation.",
        1,
        0
      ],
      [
        "Rechercher une porte d'entrée au pied droit",
        "Intertrigo inter-orteils fissuré et macéré au 4e espace interdigital droit.",
        1,
        0
      ],
      [
        "Palper le pli de l'aine et regarder le trajet lymphatique",
        "Adénopathie inguinale sensible à droite avec une fine traînée rouge de lymphangite.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal.",
        0,
        25
      ],
      [
        "Test de Galeazzi",
        "Pas d'inégalité de longueur des membres.",
        0,
        14
      ]
    ],
    "dx": "Un érysipèle (dermo-hypodermite bactérienne aiguë non nécrosante) sur intertrigo",
    "ddx": [
      [
        "Une fasciite nécrosante",
        "Urgence vitale absolue à écarter : ici il n'y a ni nécrose cutanée, ni bulles hémorragiques, ni hypoesthésie ou signes de choc."
      ],
      [
        "Une phlébite (TVP)",
        "La phlébite donne rarement une fièvre brutale à 39,5 °C avec frissons, placard rouge bien limité et adénopathie sur intertrigo."
      ],
      [
        "Un eczéma de stase",
        "L'eczéma de stase gratte et suinte avec des vésicules sans fièvre à 39,5 °C ni frissons ni lymphangite."
      ]
    ],
    "cle": "**Grosse jambe rouge aiguë fébrile** (39-40 °C, frissons) + placard chaud bien limité + **porte d'entrée** (intertrigo) : **érysipèle** à streptocoque bêta.",
    "orient": 2,
    "orientWhy": "Urgence médicale : adresser immédiatement au médecin pour débuter l'antibiothérapie (amoxicilline) et surveiller l'absence d'évolution nécrosante.",
    "tt": [
      [
        "Adresser en urgence au médecin pour antibiothérapie (amoxicilline)",
        1
      ],
      [
        "Délimiter les contours du placard au marqueur pour suivre l'extension",
        1
      ],
      [
        "Préconiser le repos avec la jambe surélevée, sans compression au début",
        1
      ],
      [
        "Traiter la porte d'entrée (antiseptique et soins de l'intertrigo)",
        1
      ],
      [
        "Poser tout de suite une bande de compression serrée sur le placard",
        0
      ],
      [
        "Prescrire soi-même de l'amoxicilline pour 2 semaines",
        0
      ]
    ],
    "conseil": {
      "q": "Une fois que les antibiotiques auront guéri ma jambe, comment éviter que ça revienne ?",
      "ok": "Soignez et séchez toujours vos espaces inter-orteils (porte d'entrée), et portez vos bas de contention après la phase aiguë.",
      "ko": [
        "On est immunisé à vie après un érysipèle, ça ne peut jamais récidiver.",
        "Il suffit de prendre des anti-inflammatoires dès que vous avez un peu chaud aux pieds."
      ]
    }
  },
  "eczema": {
    "id": "eczema",
    "nom": "Inès",
    "age": 22,
    "sexe": "f",
    "qui": "étudiante en esthétique, porte de nouvelles sandales à boucles métalliques",
    "motif": "Ça me démange horriblement sur le dessus des deux pieds, j'ai plein de petits boutons qui coulent.",
    "ask": [
      [
        "Quand ces plaques sont-elles apparues ?",
        "Deux jours après avoir remis mes sandales d'été : ça me fait ça à chaque fois que la boucle et la lanière touchent ma peau.",
        1
      ],
      [
        "Avez-vous déjà fait des allergies à des bijoux fantaisie ou des cosmétiques ?",
        "Oui, je ne supporte pas les boucles d'oreilles en nickel et j'ai fait de l'asthme enfant.",
        1
      ],
      [
        "Quelqu'un autour de vous a-t-il attrapé la même chose ?",
        "Non, personne, mais ça me gratte tellement que je m'écorche la nuit.",
        1
      ],
      [
        "Avez-vous eu de la fièvre à 39 °C ?",
        "Non, aucune fièvre.",
        0
      ],
      [
        "Avez-vous mal au mollet en marchant ?",
        "Non, c'est juste la peau du dessus du pied qui me démange.",
        0
      ],
      [
        "Vos ongles sont-ils jaunes et épais ?",
        "Non, mes ongles sont normaux.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter le dos des pieds",
        "Placards érythémato-vésiculeux bien limités dessinant la zone de contact des brides, avec suintement clair et quelques petites croûtes.",
        1,
        0
      ],
      [
        "Examiner les espaces interdigitaux et les ongles",
        "Espaces inter-orteils propres et secs ; ongles sains sans dépressions ponctuées.",
        1,
        0
      ],
      [
        "Rechercher des signes de surinfection bactérienne",
        "Lésions de grattage mais pas de pus jaunâtre ni de chaleur diffuse.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur normaux.",
        0,
        36
      ],
      [
        "Test de Schöber",
        "Souplesse lombaire normale.",
        0,
        4
      ]
    ],
    "dx": "Un eczéma (dermite de contact allergique aiguë)",
    "ddx": [
      [
        "Une mycose cutanée (dermatophytose)",
        "La lésion dessine exactement le contact de la bride chez une allergique au nickel, avec la séquence rougeur-vésicules-suintement-croûtes."
      ],
      [
        "Un psoriasis",
        "Le psoriasis donne des plaques érythémato-squameuses sèches et épaisses (coudes, genoux), pas des vésicules suintantes sur zone de contact."
      ],
      [
        "Un érysipèle",
        "L'érysipèle est unilatéral avec fièvre élevée à 39-40 °C ; ici ce sont des vésicules très prurigineuses sans fièvre."
      ]
    ],
    "cle": "Allergie au **nickel** + lésion sur la **zone exposée** + séquence **rougeur, œdème, vésicules, suintement, croûtes** et **prurit intense** : eczéma de contact.",
    "orient": 1,
    "orientWhy": "Poussée aiguë suintante : conseils d'éviction et d'hygiène au cabinet, et orientation vers le médecin/dermatologue pour dermocorticoïde et patch tests.",
    "tt": [
      [
        "Supprimer la cause : arrêt immédiat du port des sandales allergisantes",
        1
      ],
      [
        "Orienter au médecin (dermocorticoïde classe II + antiseptique)",
        1
      ],
      [
        "Conseiller émollients quotidiens et hygiène douce sans savon agressif",
        1
      ],
      [
        "Expliquer l'intérêt des patch tests (lus à 48-72 h) en allergologie",
        1
      ],
      [
        "Appliquer un antifongique ou de l'alcool modifié sur les vésicules",
        0
      ],
      [
        "Pansement kératolytique à l'acide salicylique sur les croûtes",
        0
      ]
    ],
    "conseil": {
      "q": "C'est contagieux avec le liquide qui coule ? Mon copain risque de l'attraper ?",
      "ok": "Non, l'eczéma n'est jamais contagieux, c'est une réaction allergique : évitez surtout de gratter pour ne pas surinfecter la peau.",
      "ko": [
        "Oui, le liquide des vésicules est très contagieux pour tout votre entourage.",
        "Prenez des bains très chauds avec du savon antiseptique fort pour décaper les boutons."
      ]
    }
  },
  "psoriasis": {
    "id": "psoriasis",
    "nom": "Thomas",
    "age": 34,
    "sexe": "m",
    "qui": "graphiste, très stressé par son travail ces derniers mois",
    "motif": "J'ai des plaques rouges pleines de peaux blanches épaisses sous les pieds et mes ongles sont tout abîmés.",
    "ask": [
      [
        "Avez-vous les mêmes plaques ailleurs sur le corps ?",
        "Oui, j'en ai sur les deux coudes, les genoux et dans le bas du dos depuis quelques mois.",
        1
      ],
      [
        "Y a-t-il quelqu'un dans votre famille qui a un problème de peau similaire ?",
        "Oui, mon père a du psoriasis depuis qu'il est jeune.",
        1
      ],
      [
        "Avez-vous traversé une période de stress, ou remarqué que les plaques apparaissent là où vous vous grattez ?",
        "Oui, gros stress au bureau, et dès que je m'écorche la peau, une plaque apparaît pile sur la rayure.",
        1
      ],
      [
        "Allez-vous pieds nus à la piscine ?",
        "Non, je ne vais jamais à la piscine.",
        0
      ],
      [
        "Avez-vous eu une forte fièvre hier ?",
        "Non, pas de fièvre.",
        0
      ],
      [
        "Avez-vous une crampe au mollet au bout de 200 mètres de marche ?",
        "Non, je marche sans douleur dans les mollets.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter les plantes des pieds, les coudes et les genoux",
        "Plaques érythémato-squameuses bien limitées, sèches, couvertes d'épaisses squames blanchâtres.",
        1,
        0
      ],
      [
        "Examiner les ongles des pieds et des mains",
        "Plusieurs ongles présentent des dépressions ponctuées et une hyperkératose sous-unguéale ; les espaces interdigitaux sont sains.",
        1,
        0
      ],
      [
        "Interroger et palper les articulations des orteils",
        "Pas de gonflement ni de douleur articulaire suspectant une forme arthropathique.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur bien frappés.",
        0,
        36
      ],
      [
        "Signe de Thompson",
        "Normal.",
        0,
        25
      ]
    ],
    "dx": "Un psoriasis cutané et unguéal",
    "ddx": [
      [
        "Une mycose plantaire et unguéale (dermatophytose)",
        "L'atteinte symétrique des coudes et genoux, l'antécédent familial et le phénomène de Koebner signent le psoriasis."
      ],
      [
        "Un eczéma chronique",
        "L'eczéma évolue par vésicules et suintement ; ici ce sont des plaques érythémato-squameuses bien limitées typiques sur les faces d'extension."
      ],
      [
        "Un pityriasis rosé de Gibert",
        "Le pityriasis rosé donne des médaillons sur le tronc qui guérissent en quelques semaines, sans atteinte chronique des ongles et des coudes."
      ]
    ],
    "cle": "**Plaques érythémato-squameuses bien limitées** (coudes, genoux, pieds) + **atteinte des ongles** + terrain familial + **phénomène de Koebner** : psoriasis.",
    "orient": 1,
    "orientWhy": "Maladie inflammatoire chronique avec retentissement et comorbidités : soins doux au cabinet et orientation vers le dermatologue pour le traitement (dermocorticoïdes, vitamine D…).",
    "tt": [
      [
        "Orienter vers le dermatologue pour le traitement médical adapté",
        1
      ],
      [
        "Conseiller des émollients quotidiens et des soins locaux doux",
        1
      ],
      [
        "Éviter tout soin agressif ou traumatisme cutané (phénomène de Koebner)",
        1
      ],
      [
        "Conseiller de limiter les déclencheurs (stress, tabac, alcool)",
        1
      ],
      [
        "Débrider agressivement les plaques jusqu'au saignement",
        0
      ],
      [
        "Prescrire du méthotrexate ou une biothérapie au cabinet",
        0
      ]
    ],
    "conseil": {
      "q": "J'ai honte de montrer mes pieds en été… Est-ce que c'est contagieux, et est-ce que ça se guérit définitivement ?",
      "ok": "Ce n'est pas contagieux : on ne le guérit pas définitivement, mais les traitements contrôlent très bien les poussées.",
      "ko": [
        "Oui, c'est contagieux par les squames, il ne faut jamais marcher pieds nus chez vous.",
        "Grattez fort toutes les peaux blanches à sec tous les soirs pour faire disparaître la plaque."
      ]
    }
  },
  "dyshidrose": {
    "id": "dyshidrose",
    "nom": "Camille",
    "age": 28,
    "sexe": "f",
    "qui": "infirmière en réanimation, terrain atopique",
    "motif": "Ça me gratte énormément sous les deux pieds et entre les doigts, avec plein de petites cloques.",
    "ask": [
      [
        "C'est la première fois que ça vous arrive ?",
        "Non, ça revient presque chaque printemps et automne depuis trois ans.",
        1
      ],
      [
        "Vous avez un terrain allergique, de l'eczéma ou de l'asthme ?",
        "Oui, j'ai fait de l'eczéma enfant et je suis très stressée au travail en ce moment.",
        1
      ],
      [
        "Vous transpirez beaucoup des pieds ou vous portez des gants ?",
        "Oui, je transpire beaucoup dans mes sabots, et je porte des gants toute la journée.",
        1
      ],
      [
        "Vous avez eu un épisode de diarrhée ou d'infection urinaire récemment ?",
        "Non, rien de tout ça.",
        0
      ],
      [
        "Vous avez des douleurs dans la poitrine ou les articulations ?",
        "Non, aucune douleur articulaire.",
        0
      ],
      [
        "Vous avez marché pieds nus autour d'une piscine ?",
        "Non, je ne vais jamais à la piscine.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter la voûte plantaire et les orteils",
        "Petites vésicules enchâssées d'environ 1 mm, à liquide jaune citron, aspect en grains de tapioca, bilatérales.",
        1,
        0
      ],
      [
        "Regarder les mains et les faces latérales des doigts",
        "Mêmes vésicules tendues sur les faces latérales des doigts et desquamation en collerette sur les anciennes lésions.",
        1,
        0
      ],
      [
        "Examiner les espaces interdigitaux",
        "Léger intertrigo fissuraire au 4e espace, macéré, qui peut favoriser la poussée.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur bien frappés des deux côtés.",
        0,
        36
      ],
      [
        "Signe de Mulder",
        "Pas de clic ni de douleur électrique entre les têtes métatarsiennes.",
        0,
        30
      ]
    ],
    "dx": "Une dyshidrose palmo-plantaire (eczéma spongiotique)",
    "ddx": [
      [
        "Un psoriasis pustuleux palmo-plantaire de Barber",
        "Il donne des pustules jaunâtres stériles sur fond érythémato-squameux, pas des vésicules claires en grains de sagou."
      ],
      [
        "Une pustulose kératogène (Fiessinger-Leroy-Reiter)",
        "Elle survient après une infection digestive ou génito-urinaire avec arthrite, absentes ici."
      ],
      [
        "Un syndrome SAPHO",
        "Il associe pustulose palmo-plantaire et douleurs ostéo-articulaires, notamment de la paroi thoracique antérieure."
      ]
    ],
    "cle": "Vésicules enchâssées en **grains de sagou/tapioca** (liquide jaune citron), prurit intense, atteinte symétrique mains-pieds par poussées saisonnières sur terrain atopique : c'est une dyshidrose.",
    "orient": 1,
    "orientWhy": "Dermatose bénigne mais récidivante : soins et conseils au cabinet, et avis médical pour un dermocorticoïde en crise ou un suivi dermatologique.",
    "tt": [
      [
        "Laver avec un savon adapté (ex. Béta Scrub) et bien sécher",
        1
      ],
      [
        "Assécher les lésions avec un antiseptique (éosine aqueuse, Bétadine)",
        1
      ],
      [
        "Hydrater avec une crème émolliente et traiter l'intertrigo",
        1
      ],
      [
        "Adresser au médecin pour des corticoïdes locaux en crise",
        1
      ],
      [
        "Percer toutes les vésicules à la lame de bistouri",
        0
      ],
      [
        "Appliquer un kératolytique fort à l'acide salicylique",
        0
      ]
    ],
    "conseil": {
      "q": "C'est ma transpiration qui provoque cette maladie ?",
      "ok": "Non, la sueur ne cause pas la dyshidrose, mais elle l'aggrave : portez des chaussettes en coton et séchez bien vos pieds.",
      "ko": [
        "Oui, c'est uniquement dû à un excès de sueur qui bouche les pores.",
        "Il faut garder les pieds humides en permanence pour éviter les croûtes."
      ]
    }
  },
  "sudoraux": {
    "id": "sudoraux",
    "nom": "Lucas",
    "age": 19,
    "sexe": "m",
    "qui": "étudiant en droit, joue au futsal en club",
    "motif": "Mes pieds sont trempés toute la journée dans mes baskets et ça sent vraiment très mauvais, j'ai honte.",
    "ask": [
      [
        "Depuis quand transpirez-vous autant, et est-ce des deux côtés ?",
        "Ça a commencé au lycée vers 15 ans, des deux pieds pareil, toutes les semaines.",
        1
      ],
      [
        "Est-ce que vous transpirez aussi des pieds la nuit en dormant ?",
        "Non, la nuit mes pieds sont secs, ça démarre dès que je me lève.",
        1
      ],
      [
        "Il y a d'autres personnes dans votre famille qui ont ce souci ?",
        "Oui, mon père a exactement la même chose aux pieds et aux mains.",
        1
      ],
      [
        "Vous avez perdu du poids ou eu de la fièvre la nuit ?",
        "Non, je suis en pleine forme.",
        0
      ],
      [
        "Vous avez un pacemaker ou une prothèse métallique ?",
        "Non, rien du tout.",
        0
      ],
      [
        "Vous avez eu un traumatisme de la cheville récemment ?",
        "Non, aucune entorse.",
        0
      ]
    ],
    "exam": [
      [
        "Examiner la plante des deux pieds",
        "Sudation abondante, bilatérale et symétrique, peau humide et ramollie avec odeur fétide marquée.",
        1,
        0
      ],
      [
        "Inspecter les espaces interdigitaux",
        "Petites fissures macérées entre les 4e et 5e orteils, début de pied d'athlète favorisé par l'humidité.",
        1,
        0
      ],
      [
        "Palper la thyroïde et vérifier l'état général",
        "Pas de signe d'hyperthyroïdie ni d'atteinte neurologique asymétrique.",
        1,
        0
      ],
      [
        "Test au monofilament 10 g",
        "Sensibilité plantaire parfaitement conservée sur toutes les zones.",
        0,
        33
      ],
      [
        "Signe de Tinel au canal tarsien",
        "Aucune décharge électrique derrière la malléole médiale.",
        0,
        32
      ]
    ],
    "dx": "Une hyperhidrose plantaire localisée primitive compliquée de bromhidrose",
    "ddx": [
      [
        "Une hyperhidrose localisée secondaire",
        "Elle est asymétrique et liée à une cause neurologique locale, alors qu'ici tout est bilatéral et familial."
      ],
      [
        "Une hyperhidrose généralisée secondaire",
        "Elle touche tout le corps et persiste souvent la nuit (lymphome, hyperthyroïdie, diabète)."
      ],
      [
        "Une dyshidrose plantaire isolée",
        "Elle se manifeste par des vésicules prurigineuses en grains de tapioca, pas par une simple sudation fétide."
      ]
    ],
    "cle": "Sudation **bilatérale et symétrique** > 6 mois, début avant 25 ans, **arrêt la nuit** et terrain familial : hyperhidrose primitive, avec **bromhidrose** (odeur fétide par bactéries/levures).",
    "orient": 0,
    "orientWhy": "Forme primitive typique sans signe d'alerte : éducation d'hygiène, antitranspirants locaux et ionophorèse se gèrent au cabinet.",
    "tt": [
      [
        "Laver et bien sécher les pieds tous les jours",
        1
      ],
      [
        "Chaussettes en coton changées chaque jour et alterner les chaussures",
        1
      ],
      [
        "Antitranspirant au chlorure d'aluminium (ex. Sudine, Etiaxyl)",
        1
      ],
      [
        "Proposer des séances d'ionophorèse au cabinet",
        1
      ],
      [
        "Conseiller des chaussettes synthétiques serrées",
        0
      ],
      [
        "Prescrire un bilan thyroïdien d'urgence avant tout conseil",
        0
      ]
    ],
    "conseil": {
      "q": "Comment marche l'ionophorèse ? Tout le monde peut en faire ?",
      "ok": "Un léger courant dans l'eau bloque les glandes sudoripares ; contre-indiqué si plaie, pacemaker, prothèse ou grossesse.",
      "ko": [
        "C'est un bain d'acide qui brûle définitivement les glandes de la sueur en une séance.",
        "On peut la faire même sur des crevasses ouvertes ou avec un pacemaker sans aucun problème."
      ]
    }
  },
  "raynaud": {
    "id": "raynaud",
    "nom": "Chloé",
    "age": 23,
    "sexe": "f",
    "qui": "étudiante en architecture, fume 5 cigarettes par jour",
    "motif": "Dès qu'il fait froid, mes doigts et mes orteils deviennent tout blancs et engourdis.",
    "ask": [
      [
        "Vos doigts changent de couleur dans un ordre précis au froid ?",
        "Oui, ils deviennent tout blancs d'un coup, puis bleus, et enfin tout rouges quand ça se réchauffe.",
        1
      ],
      [
        "Ça touche les deux côtés de la même façon, et votre famille a ça ?",
        "Oui, les deux mains et les deux pieds, et ma mère a la même chose depuis qu'elle est jeune.",
        1
      ],
      [
        "Vous avez déjà eu des petites plaies ou des crevasses au bout des doigts ?",
        "Non, jamais aucune plaie, la peau redevient tout à fait normale après la crise.",
        1
      ],
      [
        "Vous êtes restée longtemps dehors par moins dix degrés ?",
        "Non, ça m'arrive même en prenant un produit au rayon frais du supermarché.",
        0
      ],
      [
        "Vous avez mal dans le bas du dos le matin ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Vous transpirez beaucoup des pieds ?",
        "Non, j'ai plutôt la peau sèche.",
        0
      ]
    ],
    "exam": [
      [
        "Examiner la peau et la pulpe des doigts et des orteils",
        "Peau souple et normale entre les crises, aucune ulcération digitale, ni nécrose, ni cicatrice ponctiforme.",
        1,
        0
      ],
      [
        "Prendre les pouls pédieux, tibiaux postérieurs et radiaux",
        "Tous les pouls périphériques sont présents et symétriques : pas de maladie vasculaire périphérique.",
        1,
        36
      ],
      [
        "Vérifier la symétrie et les zones atteintes à l'interrogatoire",
        "Crises épisodiques et symétriques, débutées vers 20 ans, sans atteinte viscérale.",
        1,
        0
      ],
      [
        "Test au diapason gradué 128 Hz",
        "Sensibilité vibratoire normale aux hallux et aux malléoles.",
        0,
        34
      ],
      [
        "Signe de Thompson",
        "Flexion plantaire normale à la pression du mollet.",
        0,
        25
      ]
    ],
    "dx": "Un phénomène de Raynaud primaire (idiopathique)",
    "ddx": [
      [
        "Un phénomène de Raynaud secondaire",
        "Il donne des crises asymétriques, très douloureuses, avec des ulcérations ou cicatrices digitales."
      ],
      [
        "Des engelures",
        "Ce sont des papules rouges, lisses et luisantes qui durent 1 à 3 semaines après un froid humide, pas une crise brève."
      ],
      [
        "Une artériopathie oblitérante (AOMI)",
        "Elle touche le sujet plus âgé avec abolition des pouls et claudication, pas un vasospasme réversible de la jeune femme."
      ]
    ],
    "cle": "Vasospasme au froid **triphasique** (blanc ischémique, bleu cyanose, rouge reperfusion), **symétrique**, chez une jeune femme de 15-30 ans sans lésion : c'est un **Raynaud primaire**.",
    "orient": 1,
    "orientWhy": "C'est bénin dans 75 à 80 % des cas : on éduque la patiente au cabinet et le médecin confirme l'absence de cause secondaire ou prescrit un inhibiteur calcique si besoin.",
    "tt": [
      [
        "Éducation thérapeutique : garder pieds et mains bien au chaud",
        1
      ],
      [
        "Éviter les froids soudains et les changements rapides de température",
        1
      ],
      [
        "Conseiller de diminuer le tabac et la caféine",
        1
      ],
      [
        "Orientée vers le médecin (inhibiteur calcique si crises gênantes)",
        1
      ],
      [
        "Faire tremper les pieds dans l'eau glacée tous les soirs",
        0
      ],
      [
        "Appliquer un kératolytique sur la pulpe des orteils",
        0
      ]
    ],
    "conseil": {
      "q": "Est-ce que je risque de perdre un orteil ou d'avoir la gangrène avec ça ?",
      "ok": "Non, votre forme primaire est bénigne et n'abîme pas les tissus ; protégez-vous bien du froid et réduisez tabac et café.",
      "ko": [
        "Oui, le Raynaud primaire évolue souvent vers la nécrose et l'auto-amputation.",
        "Il faut fumer une cigarette quand la crise commence pour dilater les artères."
      ]
    }
  },
  "gelures": {
    "id": "gelures",
    "nom": "Antoine",
    "age": 34,
    "sexe": "m",
    "qui": "facteur à vélo en automne, fumeur",
    "motif": "J'ai le bout des orteils tout rouge, gonflé, ça me brûle et ça me démange dès que je rentre au chaud.",
    "ask": [
      [
        "Quel temps faisait-il pendant vos tournées cette semaine ?",
        "Il faisait entre 3 et 6 degrés, avec beaucoup de pluie et de vent, j'avais les pieds humides.",
        1
      ],
      [
        "Comment êtes-vous chaussé pour faire votre tournée ?",
        "Je mets des chaussures de ville assez étroites avec de fines chaussettes synthétiques.",
        1
      ],
      [
        "Avez-vous été exposé à un grand gel sous zéro degré en montagne ?",
        "Non, pas du tout, il n'a même pas gelé en ville cette semaine.",
        1
      ],
      [
        "Vos doigts deviennent-ils tout blancs puis bleus en quelques minutes ?",
        "Non, mes orteils restent rouges et gonflés en continu depuis quatre jours.",
        0
      ],
      [
        "Avez-vous changé de lessive récemment ?",
        "Non, toujours la même.",
        0
      ],
      [
        "Avez-vous mal au genou en pédalant ?",
        "Non, aucun souci aux genoux.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter les orteils des deux pieds",
        "Lésions symétriques érythémato-papuleuses sur les orteils : peau rouge, lisse et luisante.",
        1,
        0
      ],
      [
        "Vérifier l'absence de nécrose ou de phlyctènes hémorragiques",
        "Aucune phlyctène séro-hématique ni zone blanche ou nécrotique ; sensibilité conservée.",
        1,
        0
      ],
      [
        "Prendre les pouls pédieux et tibiaux postérieurs",
        "Pouls présents mais extrémités fraîches et humides.",
        1,
        36
      ],
      [
        "Test de Lachman de la MTP",
        "Pas d'instabilité de la 2e métatarso-phalangienne.",
        0,
        29
      ],
      [
        "Test de Schöber",
        "Souplesse lombaire normale.",
        0,
        4
      ]
    ],
    "dx": "Des engelures des orteils",
    "ddx": [
      [
        "Une gelure",
        "La gelure survient sous 0 °C (cristaux de glace dans les tissus), alors qu'ici il faisait entre 0 et 10 °C avec humidité."
      ],
      [
        "Un phénomène de Raynaud primaire",
        "Le Raynaud donne des crises brèves triphasiques (blanc, bleu, rouge) sans lésion persistante entre les crises."
      ],
      [
        "Une dyshidrose plantaire",
        "La dyshidrose donne des petites vésicules enchâssées en grains de tapioca sous la plante et sur les côtés des orteils."
      ]
    ],
    "cle": "Exposition prolongée entre **0 et 10 °C** avec **vent, humidité et chaussures étroites**, lésions symétriques rouges, lisses et luisantes : **engelures** (sous 0 °C = gelure).",
    "orient": 0,
    "orientWhy": "Les engelures sont des lésions bénignes qui guérissent sans séquelles : prévention, chaussage et topiques barrières au cabinet suffisent.",
    "tt": [
      [
        "Conseiller des chaussettes en coton pour isoler du froid",
        1
      ],
      [
        "Appliquer un topique barrière froid/humidité (ex. Akilenjur)",
        1
      ],
      [
        "Choisir des chaussures plus larges et imperméables contre l'humidité",
        1
      ],
      [
        "Réduire les facteurs de risque comme le tabac",
        1
      ],
      [
        "Percer les papules avec une lame stérile",
        0
      ],
      [
        "Plonger les pieds dans de l'eau brûlante à 45 °C en rentrant",
        0
      ]
    ],
    "conseil": {
      "q": "Ça va durer tout l'hiver ou ça va partir ?",
      "ok": "C'est bénin et ça disparaît sans séquelles en 1 à 3 semaines en gardant les pieds au sec, au chaud et au large.",
      "ko": [
        "Ça laisse toujours des cicatrices profondes et il faudra sûrement opérer.",
        "Il faut frotter vigoureusement vos orteils avec de la neige pour relancer la circulation."
      ]
    }
  },
  "onychodys": {
    "id": "onychodys",
    "nom": "Martine",
    "age": 62,
    "sexe": "f",
    "qui": "secrétaire retraitée, porte souvent des escarpins",
    "motif": "Mon ongle du gros orteil s'est enroulé sur les côtés, il me rentre dans la peau quand je mets mes chaussures.",
    "ask": [
      [
        "Quel type de chaussures portez-vous au quotidien ?",
        "J'ai porté des chaussures pointues et assez étroites pendant toute ma carrière.",
        1
      ],
      [
        "Depuis quand l'ongle a-t-il pris cette forme bombée ?",
        "Ça s'est accentué petit à petit avec l'âge, sur mes deux gros orteils.",
        1
      ],
      [
        "Avez-vous eu un choc violent sur l'ongle ou un traitement lourd récemment ?",
        "Non, aucun choc ni médicament particulier.",
        1
      ],
      [
        "Avez-vous une maladie grave des poumons ou du cœur ?",
        "Non, cœur et poumons vont très bien.",
        0
      ],
      [
        "Avez-vous du psoriasis sur les coudes ou le cuir chevelu ?",
        "Non, pas de psoriasis.",
        0
      ],
      [
        "Avez-vous mal dans le pli de l'aine en marchant ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Examiner la courbure de l'ongle de l'hallux",
        "Ongle hyperconvexe transversalement dont les bords latéraux convergent vers le bord libre : ongle en volute.",
        1,
        0
      ],
      [
        "Palper la phalange distale et vérifier l'épaisseur de la tablette",
        "Légère hyperconvexité de la phalange distale ; tablette d'épaisseur normale, lisse, non friable.",
        1,
        0
      ],
      [
        "Inspecter les sillons péri-unguéaux",
        "Sillons encombrés d'hyperkératose et inflammatoires sous la pression des bords de l'ongle, sans plaie.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur bien perçus.",
        0,
        36
      ],
      [
        "Test de Thompson",
        "Pas de rupture achilléenne.",
        0,
        25
      ]
    ],
    "dx": "Une onychodystrophie de courbure : hypercourbure en volute",
    "ddx": [
      [
        "Une koïlonychie",
        "C'est l'inverse : un ongle concave dans les deux sens, en cuillère, mince et lisse."
      ],
      [
        "Un ongle hippocratique en verre de montre",
        "Il est bombé dans les deux plans et souvent lié à une pathologie pulmonaire ou cardiaque chronique."
      ],
      [
        "Un ongle grêlé en dé à coudre (érosion ponctuée)",
        "C'est une modification de surface avec des dépressions en tête d'épingle, typique du psoriasis unguéal."
      ]
    ],
    "cle": "Hypercourbure transversale où les **bords convergent vers le bord libre** (tuile de Provence = sillons parallèles), liée à l'âge et aux **chaussures pointues** : **ongle en volute**.",
    "orient": 0,
    "orientWhy": "Modification de forme mécanique : le soin de pédicurie et la pose d'une orthonyxie relèvent directement du pédicure-podologue.",
    "tt": [
      [
        "Couper l'ongle correctement et dégager les sillons",
        1
      ],
      [
        "Fraiser la plaque unguéale si nécessaire pour l'assouplir",
        1
      ],
      [
        "Poser une orthonyxie pour corriger l'hypercourbure",
        1
      ],
      [
        "Conseiller des chaussures adaptées à avant-pied large",
        1
      ],
      [
        "Prescrire un antifongique oral pendant 6 mois d'emblée",
        0
      ],
      [
        "Arracher chirurgicalement la matrice au cabinet",
        0
      ]
    ],
    "conseil": {
      "q": "À quoi sert le petit dispositif que vous voulez coller sur mon ongle ?",
      "ok": "C'est une orthonyxie : elle redresse progressivement la courbure de l'ongle pour qu'il ne comprime plus vos sillons.",
      "ko": [
        "C'est juste esthétique pour cacher la forme de l'ongle sous le vernis.",
        "Il faudra quand même continuer à porter des chaussures très pointues pour maintenir l'ongle serré."
      ]
    }
  },
  "dyschromies": {
    "id": "dyschromies",
    "nom": "Marc",
    "age": 41,
    "sexe": "m",
    "qui": "menuisier, bricoleur",
    "motif": "J'ai l'ongle du gros orteil qui est devenu bleu-noir et qui me lance très fort, je n'ai pas pu dormir.",
    "ask": [
      [
        "Il s'est passé quelque chose sur cet orteil hier ou avant-hier ?",
        "Oui, hier après-midi j'ai fait tomber une planche en chêne pile sur mon gros orteil.",
        1
      ],
      [
        "Depuis combien d'heures exactement avez-vous cette tache et cette douleur ?",
        "Ça fait environ vingt-quatre heures, ça tape dedans comme mon pouls.",
        1
      ],
      [
        "Aviez-vous déjà une bande brune sur cet ongle avant le choc ?",
        "Non, mon ongle était tout à fait normal et rose hier matin.",
        1
      ],
      [
        "Prenez-vous une chimiothérapie ou un traitement au long cours ?",
        "Non, aucun médicament.",
        0
      ],
      [
        "Avez-vous une maladie du foie ou des reins ?",
        "Non, je suis en bonne santé.",
        0
      ],
      [
        "Vos autres ongles sont-ils blancs ou jaunes ?",
        "Non, tous les autres ongles sont normaux.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter l'ongle de l'hallux",
        "Collection bleue-noire bien limitée sous la tablette unguéale, mise sous tension douloureuse.",
        1,
        0
      ],
      [
        "Vérifier le repli sus-unguéal et les autres ongles",
        "Pas de débordement pigmentaire sur la peau péri-unguéale (pas de signe de Hutchinson), autres ongles sains.",
        1,
        0
      ],
      [
        "Examiner l'orteil à la recherche d'une plaie ou d'une déformation",
        "Pas de plaie cutanée ni de mobilité osseuse anormale, douleur élective à la pression de la collection.",
        1,
        0
      ],
      [
        "Critères d'Ottawa de la cheville",
        "Non applicables ici, la cheville est indolore.",
        0,
        26
      ],
      [
        "Test au monofilament 10 g",
        "Sensibilité normale.",
        0,
        33
      ]
    ],
    "dx": "Un hématome sous-unguéal récent (< 48 h)",
    "ddx": [
      [
        "Un mélanome sous-unguéal",
        "Il donne une bande brune-noire progressive partant de la matrice (> 4 mm, signe de Hutchinson), sans choc aigu de la veille."
      ],
      [
        "Une chloronychie à Pseudomonas",
        "Elle donne une coloration verte de l'ongle d'origine infectieuse, pas une collection bleue-noire pulsatile post-traumatique."
      ],
      [
        "Une mélanonychie physiologique",
        "Elle se voit sur peau sombre sous forme de bandes brunes multiples et indolores sur plusieurs ongles."
      ]
    ],
    "cle": "Traumatisme unique récent (**moins de 48 heures**) avec collection de sang sous l'ongle bleue/brune virant au noir et douleur pulsatile : c'est un **hématome sous-unguéal aigu**.",
    "orient": 0,
    "orientWhy": "Hématome sous-unguéal franc de moins de 48 heures après traumatisme identifié : le pédicure-podologue évacue la collection au cabinet.",
    "tt": [
      [
        "Désinfecter rigoureusement l'ongle et l'orteil",
        1
      ],
      [
        "Forer l'ongle pour évacuer l'hématome (< 48 h)",
        1
      ],
      [
        "Poser un pansement compressif et protecteur",
        1
      ],
      [
        "Conseiller un chaussage adapté et surveiller la repousse",
        1
      ],
      [
        "Faire un prélèvement mycologique avant de toucher l'ongle",
        0
      ],
      [
        "Attendre une semaine avant de percer l'ongle",
        0
      ]
    ],
    "conseil": {
      "q": "La tache noire va partir tout de suite après votre soin ?",
      "ok": "La douleur cède aussitôt, puis la trace avance avec la pousse de l'ongle ; si une tache noire reste fixe à la base, reconsultez.",
      "ko": [
        "L'ongle va redevenir tout rose dès ce soir une fois percé.",
        "Une tache noire sous un ongle ne nécessite jamais de surveillance par la suite."
      ]
    }
  },
  "smp": {
    "id": "smp",
    "nom": "Françoise",
    "age": 58,
    "sexe": "f",
    "qui": "comptable, suivie en oncologie pour un cancer digestif",
    "motif": "J'ai la plante des pieds et la paume des mains toutes rouges, ça me brûle et la peau commence à peler.",
    "ask": [
      [
        "Quel traitement prenez-vous actuellement pour votre cancer ?",
        "Je prends de la capécitabine, le Xeloda, en comprimés depuis trois semaines.",
        1
      ],
      [
        "Est-ce que cette douleur vous empêche de marcher ou de faire vos activités ?",
        "Ça me gêne pour marcher longtemps et faire mon ménage, mais j'arrive encore à mettre mes chaussures larges.",
        1
      ],
      [
        "Avez-vous aussi des douleurs aux points d'appui ou des ongles fragilisés ?",
        "Oui, ça tire fort sous les pieds et j'ai un ongle qui commence à se décoller un peu.",
        1
      ],
      [
        "Avez-vous un enfant autour de vous qui a eu de la fièvre et des boutons dans la bouche ?",
        "Non, je ne vois pas d'enfants en bas âge.",
        0
      ],
      [
        "Avez-vous déjà eu du psoriasis dans votre vie ?",
        "Non, jamais.",
        0
      ],
      [
        "Faites-vous de la course à pied ?",
        "Non, je marche juste un peu.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter les plantes des pieds et les paumes des mains",
        "Atteinte bilatérale symétrique : érythème acral cuisant, léger œdème, xérose et desquamation débutante.",
        1,
        0
      ],
      [
        "Évaluer le grade de sévérité OMS",
        "Grade 2 : érythème et desquamation douloureux qui limitent les activités quotidiennes, mais chaussage encore possible.",
        1,
        0
      ],
      [
        "Examiner les ongles et les zones d'appui",
        "Petite onycholyse distale et hyperkératose modérée sous les têtes métatarsiennes.",
        1,
        0
      ],
      [
        "Test de Thomas modifié",
        "Pas de raideur des fléchisseurs de hanche.",
        0,
        8
      ],
      [
        "Test de Lachman du genou",
        "Genou stable.",
        0,
        19
      ]
    ],
    "dx": "Un syndrome mains-pieds de grade 2 sous chimiothérapie (capécitabine)",
    "ddx": [
      [
        "Une mycose plantaire (pied d'athlète)",
        "La mycose débute dans les plis interdigitaux et ne donne pas un érythème cuisant bilatéral mains-pieds sous Xeloda."
      ],
      [
        "Un syndrome main-pied-bouche",
        "C'est une infection virale aiguë fébrile avec vésicules buccales, surtout chez l'enfant."
      ],
      [
        "Une dyshidrose",
        "Elle se caractérise par des vésicules prurigineuses en grains de tapioca, pas par un érythème acral toxique sous chimio."
      ]
    ],
    "cle": "Érythème acral cuisant bilatéral palmo-plantaire avec desquamation limitant les activités (**grade 2 OMS**) sous **capécitabine (Xeloda / 5-FU)** : c'est un **syndrome mains-pieds**.",
    "orient": 1,
    "orientWhy": "Soins doux et éducation au cabinet, tout en informant l'oncologue du grade 2 au cas où une adaptation de dose serait discutée.",
    "tt": [
      [
        "Hydrater plusieurs fois par jour en couche épaisse (ex. Dexeryl)",
        1
      ],
      [
        "Bains d'eau froide 3 à 4 fois/j et lavage surgras sans savon",
        1
      ],
      [
        "Abrasion très douce des hyperkératoses et débridement des onycholyses",
        1
      ],
      [
        "Conseiller des chaussures amples et des chaussettes en coton",
        1
      ],
      [
        "Décapage agressif au bistouri sur les zones rouges inflammatoires",
        0
      ],
      [
        "Bains de pieds très chauds et frictions au gel hydroalcoolique",
        0
      ]
    ],
    "conseil": {
      "q": "Que dois-je faire au quotidien pour ménager mes pieds et mes mains ?",
      "ok": "Lavez à l'eau froide/tiède sans frotter, portez chaussures amples et doubles gants, et alertez l'oncologue si ça s'aggrave.",
      "ko": [
        "Coupez bien vos cuticules et marchez longtemps pour activer la circulation.",
        "Arrêtez vous-même vos comprimés de chimiothérapie sans appeler l'oncologue."
      ]
    }
  },
  "tumeurs": {
    "id": "tumeurs",
    "nom": "Henri",
    "age": 66,
    "sexe": "m",
    "qui": "jardinier retraité",
    "motif": "J'ai une bande foncée sur l'ongle du gros orteil qui s'élargit depuis quelques mois, je croyais que c'était un bleu.",
    "ask": [
      [
        "Avez-vous le souvenir d'un choc sur cet orteil, et la tache avance-t-elle avec la pousse ?",
        "Non, aucun choc, et la bande part toujours de la base de l'ongle sans jamais disparaître.",
        1
      ],
      [
        "La bande s'est-elle élargie ou modifiée récemment ?",
        "Oui, elle est devenue plus large et de couleur irrégulière, avec du brun foncé et du noir.",
        1
      ],
      [
        "Y a-t-il eu des mélanomes ou des cancers de la peau dans votre famille ?",
        "Mon frère a été opéré d'un mélanome il y a cinq ans.",
        1
      ],
      [
        "Avez-vous mal au talon le matin en posant le pied par terre ?",
        "Non, je n'ai aucune douleur sous le talon.",
        0
      ],
      [
        "Vos autres ongles ont-ils la même bande brune ?",
        "Non, c'est uniquement sur ce gros orteil-là.",
        0
      ],
      [
        "Souffrez-vous de goutte ?",
        "Non, jamais eu de crise de goutte.",
        0
      ]
    ],
    "exam": [
      [
        "Mesurer la bande pigmentée et examiner sa couleur",
        "Bande pigmentée longitudinale de 6 mm de large, asymétrique, polychrome (brun clair à noir), sur un seul orteil.",
        1,
        0
      ],
      [
        "Chercher le signe de Hutchinson sur le repli péri-unguéal",
        "Débordement de la pigmentation brune-noire sur le repli sus-unguéal et la peau péri-unguéale : signe de Hutchinson positif.",
        1,
        0
      ],
      [
        "Examiner le reste du pied et les autres ongles",
        "Onychopathie strictement limitée à ce seul doigt ; légère dystrophie fissuraire de la tablette en regard.",
        1,
        0
      ],
      [
        "Signe de Mulder",
        "Négatif.",
        0,
        30
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur présents.",
        0,
        36
      ]
    ],
    "dx": "Une forte suspicion de mélanome unguéal",
    "ddx": [
      [
        "Un hématome sous-unguéal",
        "L'hématome fait suite à un traumatisme et migre vers le bord libre avec la pousse de l'ongle sans signe de Hutchinson."
      ],
      [
        "Un botryomycome",
        "C'est une petite boule rouge et charnue bénigne qui saigne au contact, souvent après un ongle incarné, pas une bande noire."
      ],
      [
        "Un pseudokyste mucoïde",
        "C'est une boule lisse et translucide sur le dos de l'articulation P2-P3, pas une lésion pigmentée matricielle."
      ]
    ],
    "cle": "Onychopathie d'un **seul orteil**, bande pigmentée **> 4 mm** irrégulière qui s'élargit avec **signe de Hutchinson** (débordement cutané) : forte suspicion de **mélanome unguéal**.",
    "orient": 2,
    "orientWhy": "Urgence dermatologique : on n'y touche pas en pédicurie et on adresse immédiatement au dermatologue pour biopsie/exérèse et anatomopathologie.",
    "tt": [
      [
        "Réorienter en urgence vers le dermatologue ou le médecin",
        1
      ],
      [
        "Ne faire aucun geste invasif ni fraisage sur la lésion au cabinet",
        1
      ],
      [
        "Expliquer la nécessité d'une biopsie pour analyse anatomopathologique",
        1
      ],
      [
        "Enseigner l'autosurveillance de la peau pour repérer tôt une lésion suspecte",
        1
      ],
      [
        "Forer l'ongle au cabinet pour voir s'il y a du sang dessous",
        0
      ],
      [
        "Appliquer du nitrate d'argent sur le repli pigmenté",
        0
      ]
    ],
    "conseil": {
      "q": "Comment le dermatologue va-t-il savoir avec certitude si c'est grave ?",
      "ok": "Seule l'analyse anatomopathologique (biopsie) affirme le diagnostic et donne l'épaisseur (indice de Breslow).",
      "ko": [
        "Un simple coup d'œil ou une radiographie de l'orteil suffit à prouver que c'est bénin.",
        "C'est sûrement causé par le soleil sur vos pieds, une crème solaire suffira."
      ]
    }
  },
  "genou": {
    "id": "genou",
    "nom": "Inès",
    "age": 22,
    "sexe": "f",
    "qui": "joueuse de basket en club régional",
    "motif": "Mon genou droit a tourné hier au match sur une réception de saut, il est tout gonflé et je sens qu'il se dérobe.",
    "ask": [
      [
        "Avez-vous entendu ou senti un bruit au moment de la torsion ?",
        "Oui, j'ai nettement entendu un craquement sec dans le genou en atterrissant.",
        1
      ],
      [
        "En combien de temps votre genou a-t-il gonflé ?",
        "Il a gonflé très vite, en deux ou trois heures après l'arrêt du match.",
        1
      ],
      [
        "Que ressentez-vous quand vous essayez de marcher ?",
        "J'ai l'impression que mon genou flotte et part vers l'avant, je n'arrive pas à le tendre à fond.",
        1
      ],
      [
        "Avez-vous pris un choc direct sur l'avant du tibia contre un obstacle ?",
        "Non, personne ne m'a touchée, mon pied est resté bloqué au sol et mon corps a tourné.",
        0
      ],
      [
        "Avez-vous mal sur le côté externe du genou uniquement après 30 minutes de course ?",
        "Non, c'est arrivé d'un coup hier soir au match.",
        0
      ],
      [
        "Avez-vous des fourmillements sous le pied ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Test de Lachman (LCA) et tiroir antérieur",
        "Arrêt mou et avancée anormale du tibia par rapport au fémur : test de Lachman positif.",
        1,
        19
      ],
      [
        "Évaluer l'œdème et la mobilité en flexion-extension",
        "Gros épanchement intra-articulaire et limitation douloureuse de l'extension complète du genou.",
        1,
        0
      ],
      [
        "Tiroir postérieur (LCP)",
        "Négatif : pas de recul anormal du tibia par rapport au fémur.",
        1,
        20
      ],
      [
        "Test de Noble",
        "Non pertinent ici et négatif.",
        0,
        17
      ],
      [
        "Signe de Thompson",
        "Normal.",
        0,
        25
      ]
    ],
    "dx": "Une rupture du ligament croisé antérieur (LCA)",
    "ddx": [
      [
        "Une rupture du ligament croisé postérieur (LCP)",
        "Elle survient après un choc antérieur sur le tibia fléchi et donne un tiroir postérieur positif, absent ici."
      ],
      [
        "Un syndrome de la bandelette ilio-tibiale (essuie-glace)",
        "Il donne une douleur externe progressive à la course (tests de Noble et Renne), sans craquement ni instabilité aiguë."
      ],
      [
        "Une entorse isolée bénigne du ligament collatéral médial (LCM)",
        "Elle fait mal sur la face interne au valgus forcé, sans tiroir antérieur ni sensation de flottement antéro-postérieur."
      ]
    ],
    "cle": "Torsion à la réception d'un saut, **craquement**, **œdème rapide**, sensation de **flottement** (instabilité) et **test de Lachman positif** : rupture du **LCA** (qui retient le tibia vers l'avant).",
    "orient": 1,
    "orientWhy": "On applique le protocole RICE et on adresse rapidement au médecin pour une radiographie (exclure une fracture) et une IRM (examen clé).",
    "tt": [
      [
        "Appliquer le protocole RICE (repos, glace, compression, élévation)",
        1
      ],
      [
        "Adresser au médecin pour radiographie et IRM du genou",
        1
      ],
      [
        "Conseiller une genouillère de maintien en attendant l'avis médical",
        1
      ],
      [
        "Prévoir à distance un bilan pour orthèses plantaires de stabilité",
        1
      ],
      [
        "Faire reprendre l'entraînement de basket dès la semaine prochaine",
        0
      ],
      [
        "Manipuler brutalement le genou en extension forcée",
        0
      ]
    ],
    "conseil": {
      "q": "Si le ligament est complètement rompu, je pourrai rejouer au basket dans trois semaines ?",
      "ok": "Non : une rupture complète du LCA demande souvent une chirurgie par greffe puis plusieurs mois de rééducation.",
      "ko": [
        "Oui, trois semaines de repos suffisent toujours à ressouder un LCA rompu.",
        "Il ne faut surtout faire aucune rééducation après l'opération pour ne pas détendre la greffe."
      ]
    }
  },
  "chaussures-enfant": {
    "id": "chaussures-enfant",
    "nom": "Léo",
    "age": 4,
    "sexe": "m",
    "qui": "enfant en maternelle, amené par son père",
    "motif": "Son père : Il trébuche souvent quand il court, il a des ampoules aux orteils et il ne veut plus marcher longtemps.",
    "ask": [
      [
        "Depuis quand porte-t-il cette paire de chaussures ?",
        "Son père : Depuis huit mois, ce sont les chaussures rigides de son grand frère qu'on a récupérées.",
        1
      ],
      [
        "Avez-vous remarqué que ses orteils sont serrés ou que ses pieds chauffent ?",
        "Son père : Oui, quand on lui enlève ses chaussures le soir, ses orteils sont tout recroquevillés et ses pieds sont trempés.",
        1
      ],
      [
        "Y a-t-il des pieds plats ou un hallux valgus dans la famille ?",
        "Son père : Oui, sa mère et moi avons tous les deux les pieds plats.",
        1
      ],
      [
        "A-t-il eu de la fièvre ou un gonflement d'une articulation ?",
        "Son père : Non, jamais de fièvre.",
        0
      ],
      [
        "Est-il tombé d'un jeu au parc récemment ?",
        "Son père : Non, pas de chute particulière.",
        0
      ],
      [
        "Se réveille-t-il la nuit en pleurant à cause de douleurs dans le tibia ?",
        "Son père : Non, il dort très bien toute la nuit.",
        0
      ]
    ],
    "exam": [
      [
        "Mesurer le pied (longueur, largeur, profondeur) et contrôler la chaussure",
        "Chaussure trop petite d'une pointure et demie, semelle très rigide et tige synthétique mal aérée.",
        1,
        0
      ],
      [
        "Inspecter la peau, l'alignement du pied et les orteils",
        "Ampoules de frottement, début de griffes d'orteils réductibles et affaissement de la voûte plantaire en charge.",
        1,
        0
      ],
      [
        "Observer la démarche avec et sans chaussures",
        "Pieds nus, la marche est fluide ; chaussé, il marche maladroitement avec un mauvais déroulé du pas.",
        1,
        0
      ],
      [
        "Test de Lasègue",
        "Normal et indolore.",
        0,
        13
      ],
      [
        "Pouls pédieux et tibial postérieur",
        "Normaux.",
        0,
        36
      ]
    ],
    "dxq": "Quelle est la cause principale des troubles de Léo ?",
    "dx": "Un chaussage infantile inadapté (chaussures trop petites, trop rigides et mal aérées)",
    "ddx": [
      [
        "Une clinodactylie congénitale isolée",
        "Elle est présente dès la naissance par anomalie génétique, alors qu'ici les orteils se plient dans une chaussure trop courte."
      ],
      [
        "Une fracture de fatigue du métatarse",
        "Elle donne une douleur osseuse élective à la palpation après surmenage sportif, pas des ampoules bilatérales par chaussure trop petite."
      ],
      [
        "Une entorse aiguë de la cheville",
        "Elle suit un traumatisme en inversion avec œdème externe aigu, absent ici."
      ]
    ],
    "cle": "Chez l'enfant, le pied est **souple et grandit très vite** : une chaussure **trop petite et trop rigide** gêne la croissance, modifie la marche et provoque ampoules, griffes d'orteils et pieds plats.",
    "orient": 0,
    "orientWhy": "Prise en charge podologique directe : mesure du pied, éducation des parents sur le chaussage, suivi de la croissance et semelles si le trouble statique persiste.",
    "tt": [
      [
        "Changer pour des chaussures à la bonne taille, larges et confortables",
        1
      ],
      [
        "Choisir une semelle souple avec bon soutien du talon et de la voûte",
        1
      ],
      [
        "Éduquer le parent à vérifier souvent l'ajustement avec la croissance",
        1
      ],
      [
        "Suivre l'alignement (semelles sur mesure si déviation persistante)",
        1
      ],
      [
        "Prendre des chaussures 3 pointures trop grandes pour durer 2 ans",
        0
      ],
      [
        "Bloquer le pied dans une chaussure montante ultra-rigide en plastique",
        0
      ]
    ],
    "conseil": {
      "q": "Son père : Comment dois-je choisir ses prochaines chaussures pour ne pas me tromper ?",
      "ok": "Prenez des chaussures qui respectent la forme du pied, à semelle souple et bon maintien, et vérifiez souvent la pointure.",
      "ko": [
        "La semelle doit être la plus dure possible pour forcer l'arche du pied à se creuser.",
        "À 4 ans le pied ne grandit presque plus, une paire par an suffit largement."
      ]
    }
  },
  "chaussures-securite": {
    "id": "chaussures-securite",
    "nom": "Karim",
    "age": 38,
    "sexe": "m",
    "qui": "ouvrier dans le BTP (gros œuvre extérieur)",
    "motif": "Après mes huit heures de chantier, j'ai mal sous les pieds, des ampoules et les pieds qui gonflent.",
    "ask": [
      [
        "Quel type de chaussures de sécurité portez-vous et dans quel environnement ?",
        "Je travaille dehors dans la boue et les clous, et je porte de vieilles bottes S4 en caoutchouc un peu trop grandes.",
        1
      ],
      [
        "Combien d'heures par jour restez-vous debout dedans ?",
        "Huit à neuf heures par jour debout à marcher sur le chantier, sans changer de chaussures.",
        1
      ],
      [
        "Que ressentez-vous en fin de journée au niveau des pieds ?",
        "Mes pieds nagent dedans, ils chauffent énormément, transpirent et j'ai des fourmillements le soir.",
        1
      ],
      [
        "Avez-vous eu un blocage aigu du genou ?",
        "Non, pas de souci au genou.",
        0
      ],
      [
        "Prenez-vous des médicaments anticoagulants ?",
        "Non, aucun traitement.",
        0
      ],
      [
        "Avez-vous des taches blanches sur les ongles des mains ?",
        "Non, rien aux mains.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter la peau plantaire et les orteils",
        "Hyperkératose mécanique, ampoules de friction, macération interdigitale et léger œdème vespéral.",
        1,
        0
      ],
      [
        "Examiner les chaussures de sécurité actuelles",
        "Bottes S4 en caoutchouc totalement étanches et non ventilées, trop larges, provoquant frottements et humidité.",
        1,
        0
      ],
      [
        "Évaluer la posture et la répartition des charges en statique et à la marche",
        "Mauvais maintien de l'arrière-pied et hyperpression sous les têtes métatarsiennes et le talon.",
        1,
        0
      ],
      [
        "Test de Lachman de la cheville (tiroir antérieur)",
        "Cheville stable.",
        0,
        21
      ],
      [
        "Test d'Adams",
        "Pas de gibbosité rachidienne.",
        0,
        2
      ]
    ],
    "dxq": "Quel est le problème et quelle catégorie d'EPI lui faut-il ?",
    "dx": "Un mauvais ajustement en bottes S4 étanches ; il lui faut des chaussures S3 (ou S5) bien ajustées",
    "ddx": [
      [
        "Passer à une chaussure de catégorie S1",
        "La S1 est réservée aux milieux secs et propres : elle ne protège ni de l'humidité ni de la perforation sur chantier."
      ],
      [
        "Passer à une chaussure de catégorie S2",
        "La S2 résiste à l'eau mais n'a pas la semelle anti-perforation ni la protection accrue des S3/S5 contre les risques mécaniques de chantier."
      ],
      [
        "Continuer avec les mêmes bottes S4 sans semelles",
        "La S4 en caoutchouc étanche trop large entretient la macération, les ampoules et le mauvais maintien sur terrain accidenté."
      ]
    ],
    "cle": "En BTP extérieur (humidité + risques mécaniques/perforation), il faut du **S3** (ou **S5**), bien ajusté : une **S4** étanche mal ajustée cause macération, ampoules, cors et œdème.",
    "orient": 0,
    "orientWhy": "Soins de pédicurie, semelles orthopédiques adaptées aux EPI et conseils sur le choix de la catégorie de chaussure de sécurité se font au cabinet.",
    "tt": [
      [
        "Soins locaux : traiter les callosités et les ampoules de friction",
        1
      ],
      [
        "Conseiller des chaussures S3 (ou S5) bien ajustées à son pied",
        1
      ],
      [
        "Réaliser des orthèses plantaires pour répartir les pressions",
        1
      ],
      [
        "Conseiller hygiène, séchage, chaussettes adaptées et pauses régulières",
        1
      ],
      [
        "Conseiller de travailler en baskets souples sans coque sur chantier",
        0
      ],
      [
        "Découper la coque de protection des chaussures de sécurité",
        0
      ]
    ],
    "conseil": {
      "q": "Comment bien choisir et entretenir mes prochaines chaussures de sécurité ?",
      "ok": "Choisissez la catégorie adaptée (S3), testez plusieurs modèles pour un ajustement ni serré ni lâche, et vérifiez l'usure.",
      "ko": [
        "Prenez toujours deux pointures au-dessus pour que le pied ne touche jamais la coque.",
        "Toutes les chaussures de sécurité se valent, la catégorie S1 suffit même dans la boue et les clous."
      ]
    }
  },
  "coxarthrose": {
    "id": "coxarthrose",
    "nom": "Gérard",
    "age": 67,
    "sexe": "m",
    "qui": "retraité, ancien maçon, en surpoids",
    "motif": "J'ai mal dans le pli de l'aine à droite quand je marche et j'ai un mal fou à monter les escaliers ou mettre mes chaussettes.",
    "ask": [
      [
        "Quand la douleur est-elle la plus forte ?",
        "Quand je marche longtemps, que je monte les escaliers, ou quand je me lève après être resté assis.",
        1
      ],
      [
        "Ressentez-vous une raideur le matin et où va la douleur ?",
        "Oui, je suis dérouillé au bout d'un petit moment le matin, et la douleur descend dans l'aine et le devant de la cuisse.",
        1
      ],
      [
        "Avez-vous eu un traumatisme autrefois ou y a-t-il de l'arthrose dans la famille ?",
        "Ma mère avait une prothèse de hanche, et j'ai porté des charges lourdes toute ma vie avec quinze kilos en trop.",
        1
      ],
      [
        "La douleur descend-elle en éclair derrière la jambe jusqu'aux orteils quand vous toussez ?",
        "Non, ça s'arrête dans la cuisse, jamais sous le genou.",
        0
      ],
      [
        "Avez-vous eu de la fièvre ou des frissons ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Avez-vous une plaie sous le pied ?",
        "Non, aucune plaie.",
        0
      ]
    ],
    "exam": [
      [
        "Tester la mobilité passive de la hanche droite (Log roll, FADIR, FABER)",
        "Perte nette de mobilité et douleur mécanique en flexion et surtout en rotation interne de la hanche droite.",
        1,
        12
      ],
      [
        "Observer la marche et le bilan postural",
        "Boiterie d'esquive à droite, amyotrophie quadricipitale/fessière et déséquilibre biomécanique en genu varum surchargeant la hanche.",
        1,
        16
      ],
      [
        "Test de Lasègue",
        "Négatif : pas de douleur radiculaire sciatique.",
        1,
        13
      ],
      [
        "Signe de Mulder",
        "Négatif.",
        0,
        30
      ],
      [
        "Tiroir antérieur de cheville",
        "Normal.",
        0,
        21
      ]
    ],
    "dx": "Une coxarthrose (arthrose de la hanche)",
    "ddx": [
      [
        "Une sciatique L5 ou S1",
        "Elle irradie derrière la cuisse et la jambe jusqu'au pied avec un test de Lasègue positif, sans raideur élective de la rotation de hanche."
      ],
      [
        "Une fracture aiguë du col du fémur",
        "Elle survient après une chute avec impotence fonctionnelle totale immédiate, pas progressivement sur plusieurs mois."
      ],
      [
        "Une tendinopathie d'Achille",
        "Elle donne une douleur à l'arrière de la cheville et non dans le pli de l'aine avec limitation de la flexion-rotation de hanche."
      ]
    ],
    "cle": "Douleur mécanique du **pli de l'aine** irradiant à la cuisse, raideur après immobilité, gêne aux escaliers/chaussage et **perte de mobilité en flexion et rotation** après 50 ans : **coxarthrose**.",
    "orient": 1,
    "orientWhy": "On réalise le bilan podologique et les semelles au cabinet, et on adresse au médecin pour la radiographie de référence et le traitement médical ou kinésithérapique.",
    "tt": [
      [
        "Adresser au médecin pour radiographie de hanche (examen de référence)",
        1
      ],
      [
        "Réaliser des semelles orthopédiques pour corriger les déséquilibres",
        1
      ],
      [
        "Conseiller la physiothérapie (renforcement musculaire et mobilité)",
        1
      ],
      [
        "Encourager la gestion du poids et une activité physique adaptée",
        1
      ],
      [
        "Imposer l'alitement strict pendant deux mois",
        0
      ],
      [
        "Faire une infiltration d'acide hyaluronique soi-même au cabinet",
        0
      ]
    ],
    "conseil": {
      "q": "Qu'est-ce qu'on va voir sur la radio, et vais-je forcément devoir être opéré tout de suite ?",
      "ok": "La radio montre pincement et ostéophytes ; semelles, kiné et perte de poids soulagent, la prothèse (PTH) est pour les cas sévères.",
      "ko": [
        "La radiographie ne montre jamais l'arthrose, seule l'échographie permet de voir le cartilage.",
        "Il faut arrêter définitivement de marcher car chaque pas détruit un peu plus l'os."
      ]
    }
  },
  "cycle-marche": {
    "id": "cycle-marche",
    "nom": "Nadia",
    "age": 46,
    "sexe": "f",
    "qui": "vendeuse en prêt-à-porter, en léger surpoids",
    "motif": "Je fatigue très vite quand je marche et j'ai mal sous l'avant-pied et au genou droit dès la fin de matinée.",
    "ask": [
      [
        "À quel moment du pas ressentez-vous le plus la gêne ou la douleur ?",
        "Surtout quand mon pied reste posé au sol et que je pousse dessus pour avancer.",
        1
      ],
      [
        "Quelles chaussures portez-vous au travail ?",
        "Des chaussures assez plates à semelle très dure, toute la journée sur le carrelage du magasin.",
        1
      ],
      [
        "Avez-vous l'impression de boiter ou de manquer de stabilité en fin de journée ?",
        "Oui, mes jambes sont lourdes et je boîte un peu le soir tellement les muscles tirent.",
        1
      ],
      [
        "Avez-vous eu un accident vasculaire cérébral ou une sclérose en plaques ?",
        "Non, aucun problème neurologique.",
        0
      ],
      [
        "Votre cheville a-t-elle doublé de volume après une torsion hier ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Avez-vous de la fièvre ?",
        "Non.",
        0
      ]
    ],
    "exam": [
      [
        "Observer la marche et faire une analyse vidéo du cycle",
        "Allongement et affaissement excessif en pronation pendant la phase de soutien et mauvais décollage propulsif.",
        1,
        0
      ],
      [
        "Bilan podométrique (analyse des pressions plantaires)",
        "Hyperpressions marquées sous les têtes métatarsiennes médiales lors de la phase d'appui.",
        1,
        0
      ],
      [
        "Tester la souplesse (cheville au mur / knee-to-wall) et la force musculaire",
        "Raideur du triceps sural limitant la flexion dorsale en phase de soutien et fatigue des stabilisateurs.",
        1,
        27
      ],
      [
        "Test de Lachman du genou",
        "Genou stable, pas de laxité ligamentaire.",
        0,
        19
      ],
      [
        "Test au diapason 128 Hz",
        "Sensibilité vibratoire normale.",
        0,
        34
      ]
    ],
    "dxq": "Quelle grande phase du cycle de marche est perturbée ici et quelle est sa durée normale ?",
    "dx": "La phase d'appui (60 % du cycle : contact initial, charge, soutien, décollage)",
    "ddx": [
      [
        "La phase de balancement, qui représente 60 % du cycle",
        "Faux : la phase de balancement (précoce, intermédiaire, terminal) ne représente que 40 % du cycle et le pied y est en l'air."
      ],
      [
        "La phase de balancement intermédiaire (pied au sol portant le poids)",
        "Faux : pendant le balancement intermédiaire le pied est en l'air ; c'est la phase de soutien qui porte le poids au sol."
      ],
      [
        "Uniquement le balancement terminal",
        "Le balancement terminal prépare le pied à toucher le sol en fin de phase oscillante, alors qu'ici la douleur survient en charge et à la propulsion."
      ]
    ],
    "cle": "**Phase d'appui (60 %)** : contact initial, charge, soutien, décollage ; **phase de balancement (40 %)** : précoce, intermédiaire, terminal. Vidéo et podométrie ciblent le défaut d'appui.",
    "orient": 0,
    "orientWhy": "Trouble biomécanique du cycle de marche sans pathologie neurologique aiguë : prise en charge conservatrice au cabinet (orthèses, conseils de chaussage) et kinésithérapie si besoin.",
    "tt": [
      [
        "Réaliser des orthèses plantaires pour corriger appuis et posture",
        1
      ],
      [
        "Conseiller des chaussures adaptées à son pied et à son activité",
        1
      ],
      [
        "Associer de la physiothérapie (renforcement et souplesse musculaire)",
        1
      ],
      [
        "Prévoir une évaluation régulière pour suivre l'évolution",
        1
      ],
      [
        "Plâtrer le membre inférieur pendant 6 semaines",
        0
      ],
      [
        "Conseiller des talons hauts à semelle très rigide pour travailler",
        0
      ]
    ],
    "conseil": {
      "q": "Comment se décompose exactement un pas normal quand on marche ?",
      "ok": "Le pied est au sol 60 % du cycle (contact, charge, soutien, décollage) et en l'air 40 % (balancement) ; les semelles aident.",
      "ko": [
        "Le pied passe 80 % du temps en l'air et seulement 20 % au sol pendant la marche.",
        "Les chaussures n'ont aucune influence sur les phases du cycle de marche."
      ]
    }
  },
  "deformations-orteils": {
    "id": "deformations-orteils",
    "nom": "Simone",
    "age": 71,
    "sexe": "f",
    "qui": "retraitée active, diabétique de type 2 équilibrée",
    "motif": "Mon deuxième orteil est replié en crochet et il frotte contre le dessus de ma chaussure, j'ai un cor qui me fait très mal.",
    "ask": [
      [
        "Depuis quand cet orteil s'est-il replié comme ça ?",
        "Ça fait deux ou trois ans, ma mère avait les orteils pareils, et j'ai longtemps porté des chaussures un peu serrées.",
        1
      ],
      [
        "Arrivez-vous encore à allonger votre orteil avec vos doigts ?",
        "Oui, quand je tire doucement dessus il se remet presque droit, mais dès que je lâche il se replie.",
        1
      ],
      [
        "Ressentez-vous aussi un échauffement sous l'avant du pied à la marche ?",
        "Oui, ça me brûle un peu sous la plante juste à la base de cet orteil quand je reste debout.",
        1
      ],
      [
        "Cet orteil était-il déjà tordu sur le côté à votre naissance ?",
        "Non, pas du tout, mes orteils étaient bien droits quand j'étais jeune.",
        0
      ],
      [
        "Avez-vous eu un traumatisme récent de la cheville ?",
        "Non, aucune chute.",
        0
      ],
      [
        "Avez-vous des sueurs nocturnes ou de la fièvre ?",
        "Non, rien de tout ça.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter l'orteil et chercher les zones d'hyperkératose",
        "Hyperflexion de l'interphalangienne proximale (IPP) du 2e orteil, avec cor dorsal en regard et callosité sous la 2e tête métatarsienne.",
        1,
        0
      ],
      [
        "Mobiliser l'articulation pour tester la réductibilité",
        "La déformation en griffe est encore réductible passivement, causée par un déséquilibre entre extenseurs et fléchisseurs.",
        1,
        0
      ],
      [
        "Test au monofilament 10 g (patiente diabétique)",
        "Légère baisse de sensibilité distale débutante justifiant une vigilance accrue sur les conflits chaussants.",
        1,
        33
      ],
      [
        "Squeeze test de la jambe",
        "Négatif.",
        0,
        23
      ],
      [
        "Test de Trendelenburg",
        "Normal.",
        0,
        9
      ]
    ],
    "dx": "Une griffe d'orteil réductible du 2e rayon avec hyperkératose dorsale et métatarsalgie",
    "ddx": [
      [
        "Une clinodactylie",
        "C'est une déviation latérale congénitale (souvent du 5e orteil) présente dès la naissance, pas une hyperflexion acquise des IP."
      ],
      [
        "Une griffe totale irréductible fixée",
        "Dans la griffe irréductible, l'articulation est ankylosée et ne peut plus être étendue passivement lors de la mobilisation."
      ],
      [
        "Une maladie de Ledderhose",
        "Elle donne des nodules fibreux dans l'aponévrose plantaire au médio-pied, pas un cor dorsal sur l'IPP d'un orteil replié."
      ]
    ],
    "cle": "**Hyperflexion de l'IP** par déséquilibre extenseurs/fléchisseurs, encore **réductible** à la mobilisation, avec hyperkératose dorsale et appui métatarsien : **griffe d'orteil réductible**.",
    "orient": 0,
    "orientWhy": "Griffe réductible sans plaie : prise en charge conservatrice au cabinet (soin d'hyperkératose, orthoplastie/orthèses, chaussage) ; chirurgie seulement si forme sévère ou échec.",
    "tt": [
      [
        "Soin de pédicurie : retirer l'hyperkératose dorsale et plantaire",
        1
      ],
      [
        "Réaliser une orthoplastie / orthèse pour protéger et corriger",
        1
      ],
      [
        "Conseiller des chaussures à avant-pied haut et large",
        1
      ],
      [
        "Éduquer à une coupe d'ongles adaptée et à la surveillance des pieds",
        1
      ],
      [
        "Appliquer un coricide caustique sur cette patiente diabétique",
        0
      ],
      [
        "Forcer l'articulation jusqu'au craquement pour rompre le tendon",
        0
      ]
    ],
    "conseil": {
      "q": "Une fois que vous aurez enlevé le cor, est-ce que je suis définitivement guérie ?",
      "ok": "Le soin soulage tout de suite, mais le cor reviendra si vous ne portez pas l'orthèse et des chaussures plus larges.",
      "ko": [
        "Oui, un cor retiré au bistouri ne revient jamais, même dans des chaussures étroites.",
        "Coupez vos ongles très courts dans les coins pour empêcher l'orteil de se plier."
      ]
    }
  },
  "entorses-cheville": {
    "id": "entorses-cheville",
    "nom": "Maxime",
    "age": 25,
    "sexe": "m",
    "qui": "footballeur amateur, a déjà fait une entorse il y a 2 ans",
    "motif": "Je me suis tordu la cheville hier soir à l'entraînement, elle a gonflé sur le côté externe et j'ai mal quand je pose le pied.",
    "ask": [
      [
        "Dans quel sens votre pied a-t-il tourné ?",
        "Mon pied est parti brusquement vers l'intérieur, en inversion, en retombant sur un terrain abîmé.",
        1
      ],
      [
        "Pouvez-vous faire quelques pas en mettant du poids sur votre pied ?",
        "Oui, j'arrive à faire quatre ou cinq pas en boitant, mais ça tire fort sur le côté externe.",
        1
      ],
      [
        "Aviez-vous fait de la rééducation après votre première entorse il y a deux ans ?",
        "Non, j'avais juste arrêté le foot quinze jours et j'ai repris sans kiné.",
        1
      ],
      [
        "Avez-vous mal sous le talon uniquement au réveil depuis six mois ?",
        "Non, c'est arrivé brutalement hier soir.",
        0
      ],
      [
        "Avez-vous des plaques rouges qui grattent entre les orteils ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Prenez-vous un traitement contre le cholestérol ?",
        "Non.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter et palper les ligaments latéraux de la cheville",
        "Œdème en œuf de pigeon et petite ecchymose sous la malléole latérale ; douleur vive sur le ligament talo-fibulaire antérieur (LTFA).",
        1,
        0
      ],
      [
        "Appliquer les critères d'Ottawa",
        "Pas de douleur osseuse malléolaire, ni de la base du 5e métatarsien, ni du naviculaire, et appui possible sur 4 pas.",
        1,
        26
      ],
      [
        "Tester le tiroir antérieur de cheville",
        "Légère laxité antérieure douloureuse du talus, en faveur d'une atteinte du LTFA.",
        1,
        21
      ],
      [
        "Signe de Thompson",
        "Pression du mollet normale : le tendon d'Achille est intact.",
        0,
        25
      ],
      [
        "Test de FABER (Patrick)",
        "Hanche indolore.",
        0,
        10
      ]
    ],
    "dx": "Une entorse latérale de la cheville (atteinte du ligament talo-fibulaire antérieur)",
    "ddx": [
      [
        "Une rupture du tendon d'Achille",
        "Elle donne une encoche au-dessus du talon et un signe de Thompson positif (absence de flexion plantaire), alors qu'il est normal ici."
      ],
      [
        "Une fracture de la base du 5e métatarsien",
        "Elle donne une douleur osseuse exquise sur la styloïde du 5e métatarsien (critères d'Ottawa positifs), absente ici."
      ],
      [
        "Une entorse de la syndesmose (entorse haute)",
        "Elle survient en rotation externe/dorsiflexion forcée avec douleur tibio-fibulaire haute au Squeeze test et au test de Kleiger."
      ]
    ],
    "cle": "Traumatisme en **inversion**, œdème et ecchymose externes, douleur sur le **ligament talo-fibulaire antérieur (LTFA)** et tiroir antérieur : **entorse latérale de cheville**.",
    "orient": 1,
    "orientWhy": "On conseille le protocole RICE dans les 48 premières heures et on adresse au médecin pour l'attelle, le bilan d'imagerie si besoin (écho/radio) et surtout la prescription de rééducation.",
    "tt": [
      [
        "Appliquer la méthode RICE dans les 48 premières heures",
        1
      ],
      [
        "Adresser au médecin (attelle, AINS si besoin et prescription de kiné)",
        1
      ],
      [
        "Insister sur la rééducation avec renforcement et proprioception",
        1
      ],
      [
        "Prévoir un suivi podologique à distance pour la stabilité au sport",
        1
      ],
      [
        "Mettre des poches très chaudes sur la cheville dès le premier jour",
        0
      ],
      [
        "Reprendre les matchs dès que ça dégonfle, sans kinésithérapie",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi insistez-vous autant sur la rééducation alors que j'arrive déjà à marcher un peu ?",
      "ok": "Sans rééducation (renforcement et proprioception), vous risquez une instabilité chronique et des récidives fréquentes.",
      "ko": [
        "La proprioception ne sert qu'aux personnes âgées, pas aux jeunes footballeurs.",
        "Une fois que l'œdème a dégonflé au bout de 5 jours, le ligament est totalement cicatrisé."
      ]
    }
  },
  "fractures-fatigue": {
    "id": "fractures-fatigue",
    "nom": "Élodie",
    "age": 29,
    "sexe": "f",
    "qui": "coureuse sur route, prépare son premier marathon",
    "motif": "J'ai une douleur très précise sur le dessus de l'avant-pied droit qui m'empêche de courir, alors que je ne me suis pas tordu le pied.",
    "ask": [
      [
        "Avez-vous changé votre rythme d'entraînement récemment ?",
        "Oui, j'ai doublé mon kilométrage d'un coup ce mois-ci en courant presque tous les jours sur le bitume.",
        1
      ],
      [
        "Comment la douleur a-t-elle évolué depuis le début ?",
        "Au début j'avais mal juste après mes sorties, puis pendant la course, et maintenant j'ai mal même au repos et en marchant.",
        1
      ],
      [
        "Comment sont vos chaussures de course actuelles ?",
        "Elles sont très usées, j'ai fait plus de mille kilomètres avec sans les changer.",
        1
      ],
      [
        "Avez-vous entendu un craquement brutal lors d'un faux mouvement ?",
        "Non, aucun faux mouvement, c'est venu petit à petit sur trois semaines.",
        0
      ],
      [
        "Ressentez-vous une décharge électrique entre les orteils ?",
        "Non, ce n'est pas une décharge, c'est un point très précis sur l'os.",
        0
      ],
      [
        "Avez-vous des boutons qui grattent sous le pied ?",
        "Non, la peau est tout à fait normale.",
        0
      ]
    ],
    "exam": [
      [
        "Palper précisément les métatarsiens",
        "Douleur exquise très localisée à la palpation de la diaphyse du 2e métatarsien droit.",
        1,
        0
      ],
      [
        "Inspecter le dos de l'avant-pied",
        "Léger gonflement localisé en regard du 2e métatarsien, sans grosse ecchymose ni déformation visible.",
        1,
        0
      ],
      [
        "Signe de Mulder",
        "Négatif : pas de douleur inter-capitale ni de clic au pincement transversal.",
        1,
        30
      ],
      [
        "Tiroir antérieur de cheville",
        "Cheville stable et indolore.",
        0,
        21
      ],
      [
        "Pouls pédieux et tibial postérieur",
        "Pouls bien perçus.",
        0,
        36
      ]
    ],
    "dx": "Une fracture de fatigue (fracture de stress) du 2e métatarsien",
    "ddx": [
      [
        "Un névrome de Morton",
        "Il donne une douleur électrique inter-métatarsienne chaussée avec un signe de Mulder positif, pas une douleur osseuse exquise sur la diaphyse."
      ],
      [
        "Une fracture traumatique aiguë",
        "Elle fait suite à un choc violent direct ou une torsion brutale avec ecchymose importante et impotence immédiate."
      ],
      [
        "Une entorse latérale de cheville",
        "Elle siège sous la malléole externe après une inversion, pas sur la diaphyse du 2e métatarsien."
      ]
    ],
    "cle": "Hausse brutale d'entraînement sans repos, douleur **progressive** (effort puis repos), **douleur exquise à la palpation osseuse** sans choc : **fracture de fatigue** (tibia ou 2e-3e métatarsiens).",
    "orient": 1,
    "orientWhy": "Il faut mettre le pied au repos immédiatement et adresser au médecin pour confirmer par imagerie et écarter le risque de fracture complète.",
    "tt": [
      [
        "Arrêt immédiat de la course et mise au repos (primordial)",
        1
      ],
      [
        "Appliquer de la glace et décharger l'avant-pied",
        1
      ],
      [
        "Adresser au médecin pour imagerie (radio, et IRM si radio normale)",
        1
      ],
      [
        "À la reprise : chaussures soutenant bien, doser l'effort et suivi podo",
        1
      ],
      [
        "Continuer à courir le marathon sous anti-inflammatoires",
        0
      ],
      [
        "Manipuler vigoureusement le 2e métatarsien pour le remettre en place",
        0
      ]
    ],
    "conseil": {
      "q": "Mon médecin m'a prescrit une radio : si elle est normale demain, je peux courir dimanche ?",
      "ok": "Non ! Au début la radio est souvent normale (piège) : seule l'IRM ou la scintigraphie la voit tôt, et le repos est primordial.",
      "ko": [
        "Oui, une radiographie normale prouve à 100 % que l'os est intact dès le premier jour.",
        "Il faut courir sur la douleur pour stimuler la calcification de l'os."
      ]
    }
  },
  "genu-valgum-varum": {
    "id": "genu-valgum-varum",
    "nom": "Hugo",
    "age": 9,
    "sexe": "m",
    "qui": "écolier, fait du football et du judo en club",
    "motif": "Sa mère : « Ses genoux me semblent tordus quand il court et il se plaint d'avoir mal aux genoux après le sport. »",
    "ask": [
      [
        "Depuis quel âge avez-vous remarqué cette forme de jambes ?",
        "Depuis tout petit, vers 3 ans, mais le médecin disait que ça passerait et c'est toujours là à 9 ans.",
        1
      ],
      [
        "Où a-t-il mal exactement au genou ?",
        "Surtout sur le côté intérieur des deux genoux quand il marche longtemps ou monte les escaliers.",
        1
      ],
      [
        "Est-ce qu'il se sent instable pendant le sport ?",
        "Oui, il dit que ses genoux se touchent en courant et qu'il perd parfois l'équilibre.",
        1
      ],
      [
        "A-t-il eu de la fièvre ou un genou gonflé et chaud ?",
        "Non, jamais de fièvre ni de gonflement.",
        0
      ],
      [
        "Porte-t-il des lunettes ou un appareil dentaire ?",
        "Non, sa vue et ses dents vont très bien.",
        0
      ],
      [
        "A-t-il mal sous les talons le matin au réveil ?",
        "Non, uniquement aux genoux après l'effort.",
        0
      ]
    ],
    "exam": [
      [
        "Observer l'alignement des jambes debout (genu valgum / varum)",
        "Jambes en X marquées : les genoux se touchent et il reste un net écart entre les malléoles internes.",
        1,
        16
      ],
      [
        "Analyser la marche et la course",
        "Marche moins fluide avec inclinaison interne des genoux et surcharge du compartiment médial.",
        1,
        0
      ],
      [
        "Palper la face médiale des genoux et tester la mobilité",
        "Sensibilité sur l'interligne interne des deux genoux, sans épanchement ni blocage articulaire.",
        1,
        0
      ],
      [
        "Test de Lachman (LCA)",
        "Normal : arrêt dur, pas de laxité antérieure du tibia.",
        0,
        19
      ],
      [
        "Signe de Thompson",
        "Normal : flexion plantaire présente à la pression du mollet.",
        0,
        25
      ]
    ],
    "dx": "Un genu valgum pathologique persistant après 8 ans",
    "ddx": [
      [
        "Un genu varum",
        "Le genu varum donne des jambes en O avec des genoux écartés et une douleur externe."
      ],
      [
        "Un genu valgum physiologique de l'enfant",
        "Il est physiologique entre 2 et 4 ans, mais devient pathologique s'il persiste après 7 ou 8 ans."
      ],
      [
        "Une maladie d'Osgood-Schlatter",
        "Elle donne une douleur localisée juste sous la rotule sur la tubérosité tibiale, sans jambes en X."
      ]
    ],
    "cle": "Des jambes en **X** (genoux rapprochés, chevilles écartées) avec douleur **médiale** qui persistent **après 7-8 ans** signent un genu valgum pathologique.",
    "orient": 1,
    "orientWhy": "Un genu valgum persistant après 7-8 ans nécessite une radiographie de l'axe mécanique prescrite par le médecin, en plus du suivi podologique.",
    "tt": [
      [
        "Réaliser des semelles orthopédiques de correction posturale",
        1
      ],
      [
        "Adresser au médecin pour une radiographie des membres inférieurs",
        1
      ],
      [
        "Conseiller de la rééducation (quadriceps et ischio-jambiers)",
        1
      ],
      [
        "Conseiller la prudence sur les sports à fort impact",
        1
      ],
      [
        "Rassurer sans rien faire car c'est toujours normal à 9 ans",
        0
      ],
      [
        "Proposer d'emblée une prothèse totale de genou",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi est-ce que ça gêne l'intérieur de ses genoux ?",
      "ok": "L'angle fémur-tibia est trop petit : la face interne du genou est surchargée, ce qui peut user le cartilage à long terme.",
      "ko": [
        "C'est uniquement esthétique, cela n'a aucune conséquence sur le cartilage ou les articulations.",
        "C'est la face externe du genou qui supporte toute la charge dans les jambes en X."
      ]
    }
  },
  "gonarthrose": {
    "id": "gonarthrose",
    "nom": "Martine",
    "age": 65,
    "sexe": "f",
    "qui": "retraitée, ancienne aide-soignante, en surpoids",
    "motif": "J'ai le genou droit qui me fait souffrir quand je marche et que je descends les escaliers.",
    "ask": [
      [
        "Quand la douleur apparaît-elle et qu'est-ce qui la calme ?",
        "Elle augmente à la marche, dans les escaliers ou en portant mes courses, et elle se calme au repos.",
        1
      ],
      [
        "Comment est votre genou le matin au réveil ou après être restée assise ?",
        "Il est tout raide pendant quelques minutes quand je me lève, il faut le dérouiller.",
        1
      ],
      [
        "Avez-vous eu un traumatisme du genou ou une prise de poids ?",
        "On m'a retiré un bout de ménisque il y a quinze ans, et j'ai pris quinze kilos depuis.",
        1
      ],
      [
        "Avez-vous de la fièvre ou des frissons ?",
        "Non, pas du tout.",
        0
      ],
      [
        "La douleur descend-elle derrière la cuisse jusqu'au pied ?",
        "Non, ça reste vraiment dans le genou.",
        0
      ],
      [
        "Portez-vous des chaussures à talons aiguilles ?",
        "Non, je porte des chaussures basses.",
        0
      ]
    ],
    "exam": [
      [
        "Mobiliser le genou en flexion et extension",
        "Mobilité diminuée avec crépitements nets sous la main et douleur mécanique en fin de flexion.",
        1,
        0
      ],
      [
        "Inspecter et palper le genou au repos",
        "Léger épanchement articulaire après la marche, sans chaleur importante ni rougeur aiguë.",
        1,
        0
      ],
      [
        "Évaluer l'alignement des genoux debout",
        "Déformation modérée du genou droit en genu varum avec surcharge du compartiment interne.",
        1,
        16
      ],
      [
        "Test de Lachman (LCA)",
        "Normal : pas de tiroir antérieur pathologique.",
        0,
        19
      ],
      [
        "Test de Lasègue",
        "Négatif : aucune douleur radiculaire sciatique.",
        0,
        13
      ]
    ],
    "dx": "Une gonarthrose (arthrose du genou)",
    "ddx": [
      [
        "Une rupture aiguë du ligament croisé antérieur",
        "Elle survient après un traumatisme récent en pivot avec un test de Lachman positif."
      ],
      [
        "Un syndrome de l'essuie-glace (bandelette ilio-tibiale)",
        "Il touche surtout le coureur jeune sur la face externe, sans crépitements ni raideur matinale d'usure."
      ],
      [
        "Une arthrite infectieuse aiguë du genou",
        "Elle donne une douleur inflammatoire permanente avec fièvre et genou très chaud et rouge."
      ]
    ],
    "cle": "Après 60 ans, surpoids et antécédent méniscal : une douleur **mécanique** (effort, escaliers), une **raideur** au lever, des **crépitements** et un épanchement signent la gonarthrose.",
    "orient": 1,
    "orientWhy": "Le podologue réalise les orthèses pour corriger l'alignement et adresse au médecin pour la radiographie de première intention et le traitement médical.",
    "tt": [
      [
        "Réaliser des semelles orthopédiques pour rééquilibrer l'axe",
        1
      ],
      [
        "Conseiller perte de poids et activités douces (vélo, natation)",
        1
      ],
      [
        "Adresser au médecin pour une radiographie (pincement, ostéophytes)",
        1
      ],
      [
        "Recommander de la rééducation (renforcement et étirements)",
        1
      ],
      [
        "Imposer l'arrêt total de toute activité physique",
        0
      ],
      [
        "Faire une infiltration de corticoïdes au cabinet de podologie",
        0
      ]
    ],
    "conseil": {
      "q": "Je dois arrêter de bouger pour ne pas user mon cartilage encore plus ?",
      "ok": "Surtout pas : gardez une activité régulière qui ménage les genoux, comme le vélo ou la natation, et contrôlez votre poids.",
      "ko": [
        "Oui, il faut rester assise le plus possible pour économiser le cartilage.",
        "Il faut courir sur du béton tous les jours pour renforcer l'os sous le cartilage."
      ]
    }
  },
  "hallux-rigidus": {
    "id": "hallux-rigidus",
    "nom": "Marc",
    "age": 53,
    "sexe": "m",
    "qui": "facteur, marche beaucoup en tournée et court le dimanche",
    "motif": "J'ai mal à la base du gros orteil droit, surtout en fin de journée, et j'ai du mal à plier le pied.",
    "ask": [
      [
        "Quand la douleur est-elle la plus forte ?",
        "En fin de tournée, après avoir couru, ou quand je repars après être resté assis.",
        1
      ],
      [
        "Quels mouvements vous gênent le plus ?",
        "Monter les escaliers ou dérouler le pied en courant, mon gros orteil ne veut plus se plier.",
        1
      ],
      [
        "Avez-vous déjà eu un choc sur cet orteil ?",
        "Oui, je me suis fracturé le gros orteil au foot il y a une dizaine d'années.",
        1
      ],
      [
        "Mangez-vous beaucoup de charcuterie ou avez-vous de l'acide urique ?",
        "Non, ma prise de sang du mois dernier était tout à fait normale.",
        0
      ],
      [
        "Ressentez-vous une décharge électrique entre le 3e et le 4e orteil ?",
        "Non, c'est uniquement sur l'articulation du gros orteil.",
        0
      ],
      [
        "Avez-vous mal au bas du dos ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Tester la mobilité de la métatarso-phalangienne de l'hallux",
        "Raideur marquée avec limitation douloureuse de la flexion dorsale et de la flexion plantaire.",
        1,
        0
      ],
      [
        "Palper la base du gros orteil",
        "Douleur vive sur l'interligne articulaire et saillie osseuse dorsale dure (ostéophytes).",
        1,
        0
      ],
      [
        "Observer l'axe du gros orteil et la marche",
        "Gros orteil bien axé sans déviation latérale marquée ; boiterie d'esquive au déroulé du pas.",
        1,
        0
      ],
      [
        "Signe de Mulder",
        "Négatif : pas de clic ni de douleur dans les espaces intermétatarsiens.",
        0,
        30
      ],
      [
        "Prendre les pouls pédieux et tibial postérieur",
        "Pouls bien frappés et symétriques des deux côtés.",
        0,
        36
      ]
    ],
    "dx": "Un hallux rigidus (arthrose de la métatarso-phalangienne)",
    "ddx": [
      [
        "Un hallux valgus",
        "Dans l'hallux valgus, le gros orteil dévie vers l'extérieur avec un oignon interne ; ici la raideur domine."
      ],
      [
        "Un névrome de Morton",
        "Il siège dans le 2e ou 3e espace intermétatarsien avec un signe de Mulder positif."
      ],
      [
        "Une fracture récente de la phalange",
        "La douleur est progressive après l'effort avec des ostéophytes, sans traumatisme aigu récent."
      ]
    ],
    "cle": "Adulte entre 40 et 60 ans, antécédent traumatique, douleur mécanique à la base de l'hallux, **raideur** en flexion/extension et **ostéophytes** dorsaux : c'est un hallux rigidus.",
    "orient": 1,
    "orientWhy": "Prise en charge conservatrice au cabinet (semelles, chaussage) et orientation vers le médecin pour une radiographie qui confirme le diagnostic et donne le stade.",
    "tt": [
      [
        "Conseiller des chaussures confortables à semelle rigide",
        1
      ],
      [
        "Réaliser des semelles orthopédiques pour répartir les pressions",
        1
      ],
      [
        "Adresser au médecin pour radiographie et bilan (AINS, kiné)",
        1
      ],
      [
        "Conseiller des bains de pieds ou de la cryothérapie en poussée",
        1
      ],
      [
        "Conseiller des chaussures très souples qui plient l'avant-pied",
        0
      ],
      [
        "Réaliser une arthrodèse chirurgicale au cabinet",
        0
      ]
    ],
    "conseil": {
      "q": "Si le traitement par semelles ne suffit plus avec les années, qu'est-ce qu'on peut faire ?",
      "ok": "Une chirurgie est possible : ostéotomie, arthroplastie, ou arthrodèse qui fusionne l'articulation et soulage durablement.",
      "ko": [
        "Il n'existe aucune opération pour cette articulation, il faudra marcher avec des béquilles.",
        "Une simple pédicurie tous les mois suffit à refaire pousser le cartilage usé."
      ]
    }
  },
  "hallux-valgus": {
    "id": "hallux-valgus",
    "nom": "Claire",
    "age": 46,
    "sexe": "f",
    "qui": "hôtesse d'accueil, porte des escarpins étroits à talons au travail",
    "motif": "J'ai une bosse sur le côté du gros orteil qui frotte dans mes chaussures et me fait mal en marchant.",
    "ask": [
      [
        "Quelles chaussures portez-vous au quotidien ?",
        "Des escarpins assez serrés avec des talons hauts toute la journée pour mon travail.",
        1
      ],
      [
        "Quelqu'un dans votre famille a-t-il la même déformation ?",
        "Oui, ma mère et ma tante ont exactement le même pied.",
        1
      ],
      [
        "Quand la douleur est-elle la plus gênante ?",
        "Dès que je mets des chaussures étroites ou après une longue marche, la bosse devient rouge et chaude.",
        1
      ],
      [
        "Avez-vous eu une plaie ou une écharde à cet endroit ?",
        "Non, la peau n'est pas ouverte.",
        0
      ],
      [
        "Êtes-vous diabétique ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Avez-vous mal au talon le matin au premier pas ?",
        "Non, c'est uniquement devant, sur le côté du gros orteil.",
        0
      ]
    ],
    "exam": [
      [
        "Observer l'avant-pied en décharge et debout",
        "1er métatarsien dévié en dedans et gros orteil incliné en dehors, avec une saillie interne nette (oignon).",
        1,
        0
      ],
      [
        "Palper la saillie médiale et mobiliser la MTP1",
        "Rougeur, léger gonflement et douleur au frottement sur l'oignon ; mobilité encore conservée.",
        1,
        0
      ],
      [
        "Analyser les appuis plantaires et la marche",
        "Pied plat associé et report de pression sur le bord externe du pied à la marche.",
        1,
        0
      ],
      [
        "Monofilament 10 g",
        "Sensibilité plantaire normale sur toutes les zones testées.",
        0,
        33
      ],
      [
        "Tiroir antérieur de cheville",
        "Normal : pas de laxité du ligament talo-fibulaire antérieur.",
        0,
        21
      ]
    ],
    "dx": "Un hallux valgus",
    "ddx": [
      [
        "Un hallux rigidus",
        "Dans l'hallux rigidus, l'axe de l'orteil est conservé et c'est l'enraidissement articulaire qui domine."
      ],
      [
        "Un cor interdigital isolé",
        "Un cor est un épaississement cutané localisé, sans déviation osseuse de M1 et du gros orteil."
      ],
      [
        "Une maladie de Haglund",
        "La maladie de Haglund est une bosse à l'arrière du talon, pas à la base du gros orteil."
      ]
    ],
    "cle": "Talons et chaussures étroites, terrain familial, **1er métatarsien en dedans** et **gros orteil en dehors** avec saillie interne (**oignon**) douloureuse : c'est un hallux valgus.",
    "orient": 0,
    "orientWhy": "Forme modérée prise en charge au cabinet par chaussage adapté, semelles et orthèses ; on adresse au médecin pour radiographie ou chirurgie si la gêne persiste.",
    "tt": [
      [
        "Conseiller des chaussures larges, confortables et sans talon haut",
        1
      ],
      [
        "Réaliser des semelles orthopédiques sur mesure",
        1
      ],
      [
        "Proposer une orthèse digitale (séparateur d'orteils)",
        1
      ],
      [
        "Conseiller de la rééducation pour la souplesse et la force du pied",
        1
      ],
      [
        "Conseiller des talons hauts à bout pointu pour maintenir l'orteil",
        0
      ],
      [
        "Exciser la saillie osseuse au bistouri au cabinet",
        0
      ]
    ],
    "conseil": {
      "q": "Est-ce que mes semelles vont remettre mon os complètement droit ?",
      "ok": "Non, mais avec des chaussures larges sans talon haut, elles réalignent les appuis, soulagent la douleur et freinent l'aggravation.",
      "ko": [
        "Oui, en trois semaines de semelles l'oignon osseux aura totalement disparu.",
        "Les chaussures ne changent rien, vous pouvez garder vos escarpins étroits tous les jours."
      ]
    }
  },
  "ilm": {
    "id": "ilm",
    "nom": "Julien",
    "age": 13,
    "sexe": "m",
    "qui": "collégien en pleine croissance, fait de l'athlétisme",
    "motif": "J'ai mal en bas du dos et au genou gauche après l'entraînement, et mon coach dit que je cours de travers.",
    "ask": [
      [
        "Avez-vous eu une fracture ou un problème à une jambe plus jeune ?",
        "Oui, je me suis cassé le fémur droit à 8 ans en tombant de vélo.",
        1
      ],
      [
        "Avez-vous beaucoup grandi ces derniers mois ?",
        "Oui, j'ai pris presque dix centimètres cette année.",
        1
      ],
      [
        "Où ressentez-vous les douleurs exactement ?",
        "Dans le bas du dos et parfois à la hanche et au genou, surtout après la course.",
        1
      ],
      [
        "Avez-vous des fourmillements jusque dans les orteils ?",
        "Non, jamais.",
        0
      ],
      [
        "Avez-vous mal sous l'avant-pied dans des chaussures serrées ?",
        "Non, mes chaussures de sport sont larges.",
        0
      ],
      [
        "Avez-vous eu de la fièvre récemment ?",
        "Non, je suis en pleine forme à part ça.",
        0
      ]
    ],
    "exam": [
      [
        "Mesure de l'ILMI (cales et mètre ruban EIAS-malléole médiale)",
        "Membre inférieur gauche plus court de 8 mm ; une talonnette de 8 mm à gauche rééquilibre le bassin.",
        1,
        15
      ],
      [
        "Test d'Adams (test du plongeur) et examen statique debout",
        "Bascule du bassin à gauche et attitude scoliotique debout qui disparaît en antéflexion du tronc.",
        1,
        2
      ],
      [
        "Test de Galeazzi (jambes fléchies à 90° en décubitus)",
        "Le genou droit est plus haut que le gauche : l'inégalité siège sur le segment fémoral.",
        1,
        14
      ],
      [
        "Test de Lasègue",
        "Négatif des deux côtés : pas de conflit disco-radiculaire.",
        0,
        13
      ],
      [
        "Signe de Thompson",
        "Normal : flexion plantaire intacte.",
        0,
        25
      ]
    ],
    "dx": "Une inégalité de longueur des membres inférieurs (ILMI) de 8 mm",
    "ddx": [
      [
        "Une scoliose structurale vraie",
        "Dans une scoliose vraie, la gibbosité persiste au test d'Adams et ne se corrige pas avec une cale."
      ],
      [
        "Une sciatique par hernie discale",
        "Elle donnerait une douleur radiculaire avec un test de Lasègue positif, sans asymétrie osseuse au Galeazzi."
      ],
      [
        "Une maladie de Sever",
        "La maladie de Sever est une douleur du talon chez l'enfant, pas une bascule du bassin avec fémurs inégaux."
      ]
    ],
    "cle": "Antécédent de fracture du fémur (stimulation de croissance), bascule du bassin, attitude scoliotique réductible et **8 mm d'écart** corrigés par **cales** : c'est une ILMI (< 1 cm).",
    "orient": 1,
    "orientWhy": "Compensation de moins de 1 cm par orthèses plantaires au cabinet, et orientation vers le médecin pour un bilan radiologique (EOS ou téléradiographie) en période de croissance.",
    "tt": [
      [
        "Réaliser des orthèses plantaires (compensation < 1 cm)",
        1
      ],
      [
        "Tester des talonnettes de hauteur croissante au bilan",
        1
      ],
      [
        "Adresser au médecin pour imagerie (système EOS) et suivi de croissance",
        1
      ],
      [
        "Surveiller régulièrement l'évolution pendant la croissance",
        1
      ],
      [
        "Prescrire des chaussures orthopédiques sur mesure (réservées à > 1 cm)",
        0
      ],
      [
        "Indiquer une chirurgie d'épiphysiodèse dès 8 mm d'écart",
        0
      ]
    ],
    "conseil": {
      "q": "Son père : « Quel examen radio est le mieux pour suivre sa croissance sans trop de rayons ? »",
      "ok": "Le système EOS : face et profil debout en charge, reconstruit en 3D avec beaucoup moins de rayons qu'une radio classique.",
      "ko": [
        "Un scanner complet tous les mois allongé sur le dos, c'est le seul moyen de voir le bassin.",
        "Une échographie du pied suffit à mesurer précisément la longueur du fémur et du tibia."
      ]
    }
  },
  "insuffisance-1er-rayon": {
    "id": "insuffisance-1er-rayon",
    "nom": "Chloé",
    "age": 41,
    "sexe": "f",
    "qui": "responsable commerciale, marche beaucoup en chaussures à talons",
    "motif": "J'ai mal sous l'avant-pied et au gros orteil quand je marche longtemps, surtout au moment de pousser sur le pied.",
    "ask": [
      [
        "À quel moment du pas ressentez-vous le plus la gêne ?",
        "Au moment où je décolle le talon pour propulser mon pas vers l'avant.",
        1
      ],
      [
        "Comment sont vos chaussures de travail ?",
        "Je porte tous les jours des chaussures à talons hauts et à bouts assez étroits et rigides.",
        1
      ],
      [
        "Avez-vous d'autres douleurs ou une raideur après le repos ?",
        "Mon gros orteil est raide quand je repars, et je commence à avoir mal sous le milieu de l'avant-pied et au genou.",
        1
      ],
      [
        "Avez-vous marché pieds nus à la piscine récemment ?",
        "Non, je ne vais jamais à la piscine.",
        0
      ],
      [
        "Avez-vous eu une entorse de la cheville ces derniers mois ?",
        "Non, ma cheville est stable.",
        0
      ],
      [
        "Prenez-vous des anticoagulants ?",
        "Non, aucun médicament.",
        0
      ]
    ],
    "exam": [
      [
        "Tester la mobilité du 1er métatarsien et de la MTP1",
        "Mobilité diminuée en flexion et en extension du 1er rayon, avec douleur à la mobilisation de la MTP1.",
        1,
        0
      ],
      [
        "Examiner l'avant-pied en charge et les hyperappuis",
        "Début d'hallux valgus associé et hyperappui douloureux sous les têtes métatarsiennes adjacentes par transfert de charge.",
        1,
        0
      ],
      [
        "Analyser la marche (phase de propulsion)",
        "Propulsion retardée et inefficace sur le 1er rayon, avec compensation par l'extérieur de l'avant-pied.",
        1,
        0
      ],
      [
        "Signe de Mulder",
        "Négatif : pas de clic douloureux dans le 3e espace intermétatarsien.",
        0,
        30
      ],
      [
        "Signes de Tinel et de Phalen (canal tarsien)",
        "Négatifs : pas de paresthésies sur le trajet du nerf tibial.",
        0,
        32
      ]
    ],
    "dx": "Une insuffisance du premier rayon",
    "ddx": [
      [
        "Un névrome de Morton",
        "Il provoque une douleur électrique interdigitale avec un signe de Mulder positif, sans perte de mobilité du 1er rayon."
      ],
      [
        "Un syndrome du canal tarsien",
        "Il donne des brûlures plantaires neuropathiques avec un signe de Tinel positif derrière la malléole médiale."
      ],
      [
        "Une verrue plantaire",
        "C'est une lésion cutanée ponctuelle avec points noirs, pas un défaut biomécanique de propulsion du 1er rayon."
      ]
    ],
    "cle": "Talons hauts et bouts étroits, hallux valgus associé, mobilité réduite de M1 et de la MTP1 avec **défaut de propulsion** et transfert de charge : c'est une **insuffisance du premier rayon**.",
    "orient": 0,
    "orientWhy": "Trouble biomécanique pris en charge au cabinet par orthèses plantaires, chaussage adapté et rééducation ; on adresse au médecin si arthrose ou tendinite rebelle.",
    "tt": [
      [
        "Réaliser des semelles orthopédiques pour soulager le 1er rayon",
        1
      ],
      [
        "Conseiller des chaussures larges, souples et sans talon haut",
        1
      ],
      [
        "Proposer une orthèse pour maintenir l'alignement de l'hallux",
        1
      ],
      [
        "Conseiller de la rééducation (renforcer le pied, assouplir l'hallux)",
        1
      ],
      [
        "Conseiller de porter des talons encore plus hauts",
        0
      ],
      [
        "Plâtrer le pied pendant six semaines",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi est-ce que ce problème du gros orteil me fait aussi mal au reste de l'avant-pied et au genou ?",
      "ok": "Le 1er rayon assure la propulsion : s'il bouge mal, les forces se répartissent mal et le genou ou la hanche doivent compenser.",
      "ko": [
        "Il n'y a aucun lien, le gros orteil ne sert pas du tout pendant la marche.",
        "C'est parce que le liquide synovial du gros orteil remonte jusque dans le genou."
      ]
    }
  },
  "kyste-poplite": {
    "id": "kyste-poplite",
    "nom": "Gérard",
    "age": 68,
    "sexe": "m",
    "qui": "retraité, suivi pour de l'arthrose du genou gauche, aime jardiner",
    "motif": "J'ai senti une boule derrière mon genou gauche et ça me tire quand je m'accroupis au jardin.",
    "ask": [
      [
        "Avez-vous déjà un problème connu à ce genou ?",
        "Oui, j'ai de l'arthrose au genou gauche depuis quelques années et un vieux problème de ménisque.",
        1
      ],
      [
        "Que ressentez-vous quand vous pliez le genou ou marchez ?",
        "Une tension et une raideur derrière le genou, je n'arrive plus à m'accroupir complètement.",
        1
      ],
      [
        "Est-ce que votre mollet est devenu soudainement gonflé, rouge et très douloureux ?",
        "Non, mon mollet est souple, c'est juste cette boule derrière le genou.",
        1
      ],
      [
        "Avez-vous mal sous le talon au réveil ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Avez-vous perdu la sensibilité sous les pieds ?",
        "Non, je sens très bien mes pieds.",
        0
      ],
      [
        "Faites-vous de la danse classique ?",
        "Non, juste du jardinage et de la marche.",
        0
      ]
    ],
    "exam": [
      [
        "Palper la fosse poplitée à l'arrière du genou",
        "Masse ronde, bien délimitée, rénitente et sensible à la pression au creux poplité gauche.",
        1,
        0
      ],
      [
        "Tester la mobilité du genou en flexion et extension",
        "Flexion et extension complètes limitées par une sensation de tension postérieure ; crépitements d'arthrose.",
        1,
        0
      ],
      [
        "Examiner le mollet et les signes vasculaires",
        "Mollet souple et indolore, sans œdème du bas de jambe (pas de signe de rupture ni de phlébite).",
        1,
        0
      ],
      [
        "Pouls pédieux et tibial postérieur",
        "Pouls distaux bien perçus et symétriques.",
        0,
        36
      ],
      [
        "Signe de Thompson",
        "Normal : le tendon d'Achille est intact.",
        0,
        25
      ]
    ],
    "dx": "Un kyste poplité (accumulation de liquide synovial)",
    "ddx": [
      [
        "Une thrombose veineuse profonde (phlébite) ou une rupture de kyste",
        "Elles donnent une douleur aiguë et un œdème diffus du bas de la jambe, absents ici."
      ],
      [
        "Une tendinopathie du tendon d'Achille",
        "Elle siège en bas de la jambe sur le calcanéum, pas dans la fosse poplitée derrière le genou."
      ],
      [
        "Une rupture du ligament croisé postérieur",
        "Elle fait suite à un choc direct sur le tibia avec un tiroir postérieur, sans poche liquidienne palpable."
      ]
    ],
    "cle": "Terrain d'**arthrose** ou de lésion méniscale, **bosse palpable dans la fosse poplitée** avec tension à l'accroupissement et mobilité limitée : c'est un **kyste poplité**.",
    "orient": 1,
    "orientWhy": "Il faut adresser au médecin pour confirmer par échographie et surtout traiter la cause intra-articulaire (arthrose ou ménisque).",
    "tt": [
      [
        "Adresser au médecin (échographie et traitement de la cause)",
        1
      ],
      [
        "Conseiller du repos relatif en limitant les flexions forcées",
        1
      ],
      [
        "Conseiller glace, élévation et une compression par bandage",
        1
      ],
      [
        "Prendre en charge le trouble statique associé pour soulager le genou",
        1
      ],
      [
        "Ponctionner ou inciser le kyste au cabinet de podologie",
        0
      ],
      [
        "Masser vigoureusement la boule pour la faire éclater",
        0
      ]
    ],
    "conseil": {
      "q": "Si le médecin ponctionne le liquide avec une aiguille, est-ce que je serai définitivement guéri ?",
      "ok": "Pas forcément : la ponction draine le kyste, mais il peut revenir si on ne traite pas la cause du genou (arthrose ou ménisque).",
      "ko": [
        "Oui, une ponction empêche toujours définitivement le liquide synovial de revenir.",
        "Il ne faut jamais toucher au genou, ce kyste vient d'une artère bouchée dans le pied."
      ]
    }
  },
  "haglund": {
    "id": "haglund",
    "nom": "Camille",
    "age": 26,
    "sexe": "f",
    "qui": "joueuse de tennis et coureuse, s'entraîne 4 fois par semaine",
    "motif": "J'ai une bosse qui frotte à l'arrière du talon droit et je ne supporte plus mes chaussures fermées.",
    "ask": [
      [
        "Quelles chaussures vous font le plus mal ?",
        "Mes nouvelles chaussures de tennis et mes chaussures de ville fermées qui ont un contrefort très rigide.",
        1
      ],
      [
        "Quand la douleur augmente-t-elle ?",
        "À la marche, à la course et après mes matchs, avec une vraie sensation de frottement derrière le talon.",
        1
      ],
      [
        "Depuis quand voyez-vous cette bosse à l'arrière du talon ?",
        "Elle s'est installée progressivement ces derniers mois, et maintenant c'est souvent rouge et gonflé.",
        1
      ],
      [
        "Avez-vous entendu un gros claquement brutal en courant ?",
        "Non, aucun claquement brutal.",
        0
      ],
      [
        "La douleur est-elle sous la plante du pied au premier pas du matin ?",
        "Non, c'est vraiment derrière le talon, en haut et sur le côté.",
        0
      ],
      [
        "Avez-vous des ongles incarnés ?",
        "Non, mes ongles vont très bien.",
        0
      ]
    ],
    "exam": [
      [
        "Inspecter et palper l'arrière du talon",
        "Excroissance osseuse palpable et visible sur la partie supérieure et latérale du calcanéum, avec rougeur et chaleur de la bourse.",
        1,
        0
      ],
      [
        "Tester la mobilité de la cheville et du tendon d'Achille",
        "Mobilité légèrement limitée et sensible en flexion/extension par irritation de la bourse rétrocalcanéenne.",
        1,
        0
      ],
      [
        "Examiner la statique du pied et les chaussures",
        "Pied creux associé ; contrefort postérieur des chaussures très rigide et marqué par le frottement.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal : la pression du mollet entraîne bien une flexion plantaire.",
        0,
        25
      ],
      [
        "Signe de Mulder",
        "Négatif à l'avant-pied.",
        0,
        30
      ]
    ],
    "dx": "Une maladie (ou déformation) de Haglund",
    "ddx": [
      [
        "Une fasciite plantaire",
        "Elle donne une douleur sous le talon à l'insertion de l'aponévrose aux premiers pas du matin, sans bosse postéro-supérieure."
      ],
      [
        "Une rupture du tendon d'Achille",
        "C'est un accident brutal avec impotence immédiate et signe de Thompson positif."
      ],
      [
        "Une maladie de Sever",
        "C'est une apophysite de croissance de l'enfant entre 8 et 14 ans, alors que Camille a 26 ans."
      ]
    ],
    "cle": "Jeune sportive, **excroissance postéro-supérieure et latérale du calcanéum**, bourse enflammée et conflit avec les **chaussures à talon rigide** : c'est la maladie de Haglund.",
    "orient": 1,
    "orientWhy": "Prise en charge conservatrice au cabinet (semelles, chaussage) et orientation vers le médecin pour une radiographie qui montre l'excroissance du calcanéum.",
    "tt": [
      [
        "Réaliser des semelles ou coussinets pour réduire la pression au talon",
        1
      ],
      [
        "Conseiller repos relatif, glace et chaussures à contrefort souple",
        1
      ],
      [
        "Conseiller des étirements et du renforcement du tendon d'Achille",
        1
      ],
      [
        "Adresser au médecin pour radiographie et traitement anti-inflammatoire",
        1
      ],
      [
        "Conseiller des chaussures fermées à contrefort très rigide et serré",
        0
      ],
      [
        "Réséquer l'excroissance osseuse au cabinet",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi est-ce que c'est devenu rouge et gonflé par-dessus l'os ?",
      "ok": "L'excroissance osseuse du calcanéum frotte contre la chaussure et irrite la bourse séreuse voisine ainsi que le tendon d'Achille.",
      "ko": [
        "C'est une verrue plantaire qui a poussé sous la peau du talon.",
        "C'est parce que votre os est fracturé en deux morceaux."
      ]
    }
  },
  "sever-osgood": {
    "id": "sever-osgood",
    "nom": "Lucas",
    "age": 11,
    "sexe": "m",
    "qui": "collégien, joue au basket 3 fois par semaine",
    "motif": "Son père : « Il boîte à la fin du basket : il a mal derrière le talon droit et aussi sous le genou gauche quand il saute. »",
    "ask": [
      [
        "A-t-il beaucoup grandi récemment ?",
        "Oui, il a fait une grosse poussée de croissance ces six derniers mois.",
        1
      ],
      [
        "Quand les douleurs apparaissent-elles ?",
        "À chaque entraînement avec les courses et les sauts répétés, et ça se calme quand il se repose.",
        1
      ],
      [
        "Montre-moi exactement où tu as mal au talon et au genou.",
        "Lucas : « Juste derrière le talon en bas, et sur la petite bosse juste en dessous de ma rotule gauche. »",
        1
      ],
      [
        "A-t-il eu de la fièvre ou une perte de poids ?",
        "Non, il mange bien et n'a pas de fièvre.",
        0
      ],
      [
        "S'est-il tordu la cheville récemment ?",
        "Non, pas d'entorse.",
        0
      ],
      [
        "A-t-il des fourmillements dans les pieds la nuit ?",
        "Non, il dort très bien.",
        0
      ]
    ],
    "exam": [
      [
        "Palper le calcanéum droit et évaluer la souplesse d'Achille",
        "Douleur vive à la pression de l'arrière du calcanéum, léger gonflement et tendon d'Achille raide ; pied plat associé.",
        1,
        0
      ],
      [
        "Palper la tubérosité tibiale antérieure gauche et mobiliser le genou",
        "Gonflement localisé très sensible juste sous la rotule sur l'insertion du tendon rotulien, avec raideur du genou.",
        1,
        0
      ],
      [
        "Observer la marche",
        "Légère boiterie d'esquive après l'effort, sans instabilité ligamentaire.",
        1,
        0
      ],
      [
        "Test de Lachman (LCA)",
        "Normal : genou parfaitement stable.",
        0,
        19
      ],
      [
        "Tiroir antérieur de cheville",
        "Normal : pas de laxité ligamentaire de cheville.",
        0,
        21
      ]
    ],
    "dx": "Une maladie de Sever (au talon) et d'Osgood-Schlatter (au genou)",
    "ddx": [
      [
        "Une rupture du tendon d'Achille et du tendon rotulien",
        "Chez cet enfant qui marche, les tendons sont continus : c'est leur traction sur les zones de croissance qui fait mal."
      ],
      [
        "Une arthrite infectieuse du genou et de la cheville",
        "Il n'y a ni fièvre ni douleur permanente de repos : la douleur est purement mécanique aux sauts et à la course."
      ],
      [
        "Une gonarthrose précoce",
        "L'arthrose touche l'adulte par usure du cartilage, alors qu'ici ce sont des apophysites de croissance entre 8 et 15 ans."
      ]
    ],
    "cle": "Enfant sportif en croissance : **Sever** (8-14 ans, traction d'Achille sur le calcanéum) et **Osgood-Schlatter** (10-15 ans, traction du tendon rotulien sur la tubérosité tibiale).",
    "orient": 1,
    "orientWhy": "Affections bénignes prises en charge de façon conservatrice (semelles, repos sportif, glace) avec suivi médical recommandé pour écarter toute complication.",
    "tt": [
      [
        "Conseiller du repos sportif relatif (limiter les sauts) et de la glace",
        1
      ],
      [
        "Réaliser des semelles pour soulager la pression sur le talon (Sever)",
        1
      ],
      [
        "Conseiller une genouillère de protection de la tubérosité (Osgood)",
        1
      ],
      [
        "Recommander kinésithérapie (Achille, quadriceps) et suivi médical",
        1
      ],
      [
        "Opérer d'urgence les cartilages de croissance",
        0
      ],
      [
        "Continuer les entraînements intensifs de sauts malgré la boiterie",
        0
      ]
    ],
    "conseil": {
      "q": "Son père : « C'est grave ? Est-ce qu'il va garder ça toute sa vie ? »",
      "ok": "Non, ce sont deux affections bénignes : l'os grandit plus vite que les tendons, et tout disparaît en fin de croissance.",
      "ko": [
        "Oui, c'est une usure définitive qui détruit l'articulation à l'âge adulte.",
        "Il ne pourra plus jamais refaire de sport, même une fois sa croissance finie."
      ]
    }
  },
  "map": {
    "id": "map",
    "nom": "Laurent",
    "age": 48,
    "sexe": "m",
    "qui": "cuisinier en léger surpoids, piétine toute la journée et court le week-end",
    "motif": "J'ai une douleur aiguë sous le talon droit, surtout quand je pose le pied par terre le matin au réveil.",
    "ask": [
      [
        "Comment évolue la douleur au cours de la journée ?",
        "Les premiers pas du matin sont terribles, puis ça chauffe un peu, et ça revient très fort après ma journée debout ou la course.",
        1
      ],
      [
        "Quelles chaussures portez-vous en cuisine et pour courir ?",
        "Des chaussures très plates sans amorti en cuisine, et de vieilles baskets usées.",
        1
      ],
      [
        "Où situez-vous la douleur sous le pied ?",
        "Juste devant le talon, là où commence le creux du pied.",
        1
      ],
      [
        "Avez-vous mal derrière la cheville au frottement du contrefort ?",
        "Non, c'est vraiment dessous, sous le talon.",
        0
      ],
      [
        "Avez-vous eu de la fièvre ou une plaie sous le pied ?",
        "Non, la peau est normale et je n'ai pas de fièvre.",
        0
      ],
      [
        "Avez-vous mal au genou en vous accroupissant ?",
        "Non, mes genoux vont bien.",
        0
      ]
    ],
    "exam": [
      [
        "Palper l'insertion calcanéenne et le long de l'aponévrose plantaire",
        "Douleur vive précise à la base médiale du talon et le long de la bande aponévrotique mise en tension.",
        1,
        0
      ],
      [
        "Observer la statique du pied et tester la dorsiflexion (Knee-to-wall)",
        "Pied plat en hyperpronation et raideur du tendon d'Achille limitant la flexion dorsale.",
        1,
        27
      ],
      [
        "Inspecter la plante du pied",
        "Légère tension plantaire sans lésion cutanée ni hyperkératose ponctuelle.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal : flexion plantaire présente.",
        0,
        25
      ],
      [
        "Signe de Mulder",
        "Négatif : aucune douleur de l'avant-pied.",
        0,
        30
      ]
    ],
    "dx": "Une fasciite plantaire (inflammation de l'aponévrose plantaire)",
    "ddx": [
      [
        "Une maladie de Haglund",
        "Elle siège à l'arrière et en haut du talon avec une bosse osseuse qui frotte contre la chaussure."
      ],
      [
        "Une verrue plantaire du talon",
        "Elle se voit à l'inspection (lésion cornée avec points noirs) et ne donne pas cette raideur typique des premiers pas."
      ],
      [
        "Une rupture du tendon d'Achille",
        "Elle survient brutalement à l'effort avec un signe de Thompson positif, pas sous la voûte le matin."
      ]
    ],
    "cle": "Douleur à la **jonction talon / voûte**, typique aux **premiers pas du matin**, aggravée par la station debout, le surpoids et le pied plat : c'est une **fasciite plantaire**.",
    "orient": 0,
    "orientWhy": "Prise en charge conservatrice au cabinet (semelles, conseils d'étirements et de chaussage) ; on adresse au médecin si la douleur persiste pour imagerie ou kiné.",
    "tt": [
      [
        "Réaliser des semelles orthopédiques (soutien de voûte et amorti)",
        1
      ],
      [
        "Conseiller du repos relatif, de la glace et l'élévation du pied",
        1
      ],
      [
        "Enseigner des étirements du tendon d'Achille et de la voûte plantaire",
        1
      ],
      [
        "Conseiller des chaussures ajustées avec soutien de voûte et amorti",
        1
      ],
      [
        "Conseiller de marcher pieds nus ou en chaussures plates sans amorti",
        0
      ],
      [
        "Opérer d'emblée avant d'essayer le traitement conservateur",
        0
      ]
    ],
    "conseil": {
      "q": "Mon voisin m'a dit qu'on voyait parfois une « épine » à la radio : il faut absolument opérer ?",
      "ok": "Non : l'épine vient de la traction de l'aponévrose, et la majorité guérit sans chirurgie avec repos, semelles et étirements.",
      "ko": [
        "Oui, s'il y a une épine calcanéenne à la radio, seule la chirurgie peut soulager la douleur.",
        "La radio montre très bien l'aponévrose enflammée mais ne permet jamais de voir une épine osseuse."
      ]
    }
  },
  "naviculaire-accessoire": {
    "id": "naviculaire-accessoire",
    "nom": "Inès",
    "age": 19,
    "sexe": "f",
    "qui": "étudiante, joue au handball 3 fois par semaine",
    "motif": "J'ai une douleur sur le bord interne du pied gauche qui me gêne dès que je cours ou que je reste debout longtemps.",
    "ask": [
      [
        "Quand la douleur est-elle apparue et qu'est-ce qui l'aggrave ?",
        "Depuis quelques mois sans vrai choc, et c'est pire avec les sauts au handball ou quand je reste debout longtemps.",
        1
      ],
      [
        "Avez-vous remarqué une petite bosse sur l'intérieur du pied ?",
        "Oui, j'ai toujours eu une petite bosse au milieu de l'arche, mais maintenant elle est sensible et frotte dans mes baskets.",
        1
      ],
      [
        "Quelqu'un dans votre famille a-t-il les pieds plats ou cette même bosse ?",
        "Oui, mon père a les pieds plats et la même bosse sur le côté interne.",
        1
      ],
      [
        "Avez-vous mal sous le talon au premier pas du matin ?",
        "Non, c'est plus haut, sur le côté intérieur de l'arche.",
        0
      ],
      [
        "Avez-vous eu de la fièvre ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Avez-vous mal aux orteils ?",
        "Non, mes orteils ne me font pas mal.",
        0
      ]
    ],
    "exam": [
      [
        "Palper la face médiale de l'arche du pied (région du naviculaire)",
        "Douleur nette et élective sur une saillie osseuse médiale du naviculaire, avec légère tuméfaction locale.",
        1,
        0
      ],
      [
        "Tester la mobilité du médio-pied et le tendon tibial postérieur",
        "Légère raideur du médio-pied et sensibilité à l'insertion du tendon tibial postérieur mis en contrainte.",
        1,
        31
      ],
      [
        "Observer la statique du pied debout",
        "Pied plat associé avec surcharge mécanique de l'arche médiale.",
        1,
        0
      ],
      [
        "Tiroir antérieur de cheville",
        "Normal : pas de laxité externe de cheville.",
        0,
        21
      ],
      [
        "Signe de Mulder",
        "Négatif : avant-pied indolore.",
        0,
        30
      ]
    ],
    "dx": "Un os naviculaire accessoire symptomatique",
    "ddx": [
      [
        "Une fracture aiguë du naviculaire",
        "Pas de traumatisme aigu récent ; à la radio, cet os supplémentaire congénital est d'ailleurs souvent confondu avec une fracture."
      ],
      [
        "Une entorse du ligament collatéral latéral",
        "Elle fait suite à une torsion en inversion et siège sur la malléole externe, pas sur l'arche médiale."
      ],
      [
        "Un hallux valgus",
        "L'hallux valgus siège plus en avant sur la 1re métatarso-phalangienne, pas au sommet de l'arche médiale."
      ]
    ],
    "cle": "Douleur et tuméfaction de l'**arche médiale** sur le naviculaire, aggravées par le sport à impact et le pied plat, avec surcharge du **tibial postérieur** : c'est un **os naviculaire accessoire**.",
    "orient": 1,
    "orientWhy": "Prise en charge conservatrice par orthèses plantaires au cabinet et orientation vers le médecin pour une radiographie (profil et dorso-plantaire) et de la kinésithérapie.",
    "tt": [
      [
        "Réaliser des orthèses plantaires pour soulager l'os accessoire",
        1
      ],
      [
        "Conseiller du repos relatif et des chaussures de sport avec soutien",
        1
      ],
      [
        "Adresser au médecin pour radiographie (profil, dorso-plantaire)",
        1
      ],
      [
        "Conseiller de la kinésithérapie pour la mobilité et la fonction",
        1
      ],
      [
        "Opérer d'emblée sans tenter le traitement conservateur",
        0
      ],
      [
        "Continuer les sports à impact avec des chaussures plates sans soutien",
        0
      ]
    ],
    "conseil": {
      "q": "D'où vient cet os en plus ? Et est-ce qu'on le voit bien à la radio ?",
      "ok": "C'est un défaut de fusion fréquent (10-20 %) : la radio le montre, mais attention à ne pas le confondre avec une fracture.",
      "ko": [
        "C'est un morceau d'os qui a poussé le mois dernier à cause du handball, et il est invisible à la radio.",
        "C'est une maladie très rare qui oblige toujours à retirer l'os chirurgicalement."
      ]
    }
  },
  "osteochondrose": {
    "id": "osteochondrose",
    "nom": "Théo",
    "age": 10,
    "sexe": "m",
    "qui": "écolier, fait de la gymnastique et du football en club",
    "motif": "Sa mère : « Il a mal sur le dessus et l'intérieur du pied droit depuis un mois et il boîte après la gym. »",
    "ask": [
      [
        "A-t-il grandi vite ces derniers temps ?",
        "Oui, il est en pleine poussée de croissance en ce moment.",
        1
      ],
      [
        "Quelles activités déclenchent la douleur ?",
        "Les réceptions de sauts à la gym et les entraînements de foot ; au repos ça diminue.",
        1
      ],
      [
        "Y a-t-il eu une plaie ou de la fièvre ?",
        "Non, pas de fièvre ni de blessure de la peau, mais le dessus de son pied est un peu gonflé.",
        1
      ],
      [
        "A-t-il des verrues sous les pieds ?",
        "Non, sa peau est nette.",
        0
      ],
      [
        "Porte-t-il un appareil dentaire ?",
        "Non.",
        0
      ],
      [
        "A-t-il mal au dos le matin ?",
        "Non, uniquement à son pied droit.",
        0
      ]
    ],
    "exam": [
      [
        "Palper les zones d'ossification du médio-pied (naviculaire)",
        "Douleur vive et localisée à la pression du naviculaire, avec un léger œdème en regard.",
        1,
        0
      ],
      [
        "Tester la mobilité articulaire du pied",
        "Raideur articulaire et limitation douloureuse des mouvements du médio-pied.",
        1,
        0
      ],
      [
        "Observer la marche",
        "Boiterie d'esquive à l'appui sur le pied droit.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal : tendon d'Achille intact.",
        0,
        25
      ],
      [
        "Monofilament 10 g",
        "Sensibilité cutanée normale.",
        0,
        33
      ]
    ],
    "dx": "Une ostéochondrose du pied (atteinte du cartilage de croissance et nécrose osseuse)",
    "ddx": [
      [
        "Un cor dorsal par frottement",
        "La peau est souple sans hyperkératose : la douleur est osseuse et articulaire, avec œdème et raideur."
      ],
      [
        "Une entorse bénigne du ligament talo-fibulaire antérieur",
        "Elle siège sur le côté externe de la cheville après une torsion aiguë, pas sur un noyau d'ossification du médio-pied."
      ],
      [
        "Une goutte aiguë",
        "La goutte est une arthrite métabolique de l'adulte touchant surtout la MTP1, pas un trouble de croissance de l'enfant."
      ]
    ],
    "cle": "Enfant en croissance faisant des **sports à impact**, douleur localisée avec **œdème**, raideur et boiterie sur un site d'ossification : c'est une **ostéochondrose** (nécrose avasculaire).",
    "orient": 1,
    "orientWhy": "Il faut adresser au médecin pour une radiographie (recherche d'anomalies osseuses et de nécrose) et associer repos sportif et orthèses plantaires pour éviter l'arthrose précoce.",
    "tt": [
      [
        "Imposer le repos en arrêtant temporairement les sports à fort impact",
        1
      ],
      [
        "Réaliser des orthèses plantaires et conseiller des chaussures adaptées",
        1
      ],
      [
        "Adresser au médecin pour radiographie (nécrose) et antalgiques/AINS",
        1
      ],
      [
        "Conseiller de la kinésithérapie (souplesse et force musculaire)",
        1
      ],
      [
        "Forcer l'entraînement de sauts pour renforcer l'os nécrosé",
        0
      ],
      [
        "Faire un curetage chirurgical de l'os au cabinet",
        0
      ]
    ],
    "conseil": {
      "q": "Sa mère : « Pourquoi faut-il vraiment qu'il mette ses semelles et arrête les sauts un moment ? »",
      "ok": "L'os en croissance souffre de mauvaise irrigation : pris tôt avec repos et orthèses, il guérit sans séquelles ni arthrose précoce.",
      "ko": [
        "Parce que c'est contagieux pour les autres enfants du club de gymnastique.",
        "Il n'y a aucun risque pour le cartilage, il peut sauter autant qu'il veut même s'il boîte."
      ]
    }
  },
  "periostite-tibiale": {
    "id": "periostite-tibiale",
    "nom": "Sofia",
    "age": 23,
    "sexe": "f",
    "qui": "étudiante, prépare un semi-marathon sur route",
    "motif": "J'ai mal le long de l'intérieur du tibia quand je cours, ça commence au départ puis ça revient fort après l'entraînement.",
    "ask": [
      [
        "Comment la douleur évolue-t-elle pendant votre séance de course ?",
        "J'ai mal au début, ça s'estompe une fois que je suis bien échauffée, et ça revient fort dès que je m'arrête.",
        1
      ],
      [
        "Avez-vous changé votre entraînement récemment ?",
        "Oui, j'ai doublé mes distances en deux semaines et je cours uniquement sur du béton avec mes vieilles baskets.",
        1
      ],
      [
        "Où avez-vous mal exactement sur la jambe ?",
        "Le long du bord intérieur du tibia, sur plusieurs centimètres, pas sur un seul point.",
        1
      ],
      [
        "Votre mollet est-il dur comme du bois avec le pied engourdi ?",
        "Non, mon mollet est souple et je sens très bien mon pied.",
        0
      ],
      [
        "Avez-vous mal dans le bas du dos ?",
        "Non, jamais.",
        0
      ],
      [
        "Avez-vous eu de la fièvre ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Palper la face interne du tibia",
        "Sensibilité diffuse le long du bord interne du tibia (entre le tiers supérieur et le tiers moyen) avec un léger œdème.",
        1,
        0
      ],
      [
        "Analyser la statique du pied et la foulée de course",
        "Pieds plats en hyperpronation marquée et foulée trop longue avec chaussures au mauvais amorti.",
        1,
        0
      ],
      [
        "Tester les muscles tibiaux contre résistance",
        "Douleur réveillée à la sollicitation des muscles qui s'insèrent sur le périoste tibial médial.",
        1,
        0
      ],
      [
        "Test de Noble (bandelette ilio-tibiale)",
        "Négatif : aucune douleur sur le condyle fémoral externe.",
        0,
        17
      ],
      [
        "Signe de Thompson",
        "Normal : tendon d'Achille intact.",
        0,
        25
      ]
    ],
    "dx": "Une périostite tibiale (syndrome de la douleur tibiale médiale)",
    "ddx": [
      [
        "Une fracture de stress du tibia",
        "La fracture de stress donne une douleur exquise très localisée sur un point précis qui ne cède pas à l'échauffement."
      ],
      [
        "Un syndrome de l'essuie-glace",
        "Il donne une douleur sur la face externe du genou (test de Noble positif), pas sur le bord interne du tibia."
      ],
      [
        "Un syndrome des loges aigu",
        "C'est une urgence avec loge musculaire sous tension extrême et signes neurovasculaires, absents ici."
      ]
    ],
    "cle": "Hausse brutale de la course sur **béton**, **hyperpronation**, douleur diffuse du **bord interne du tibia** (tiers sup/moyen) calmée à l'échauffement : c'est une **périostite tibiale**.",
    "orient": 0,
    "orientWhy": "Blessure de surutilisation prise en charge par repos relatif, orthèses plantaires et correction de la foulée ; on adresse au médecin si l'on suspecte une fracture de stress.",
    "tt": [
      [
        "Réaliser des orthèses plantaires pour corriger la pronation",
        1
      ],
      [
        "Conseiller repos relatif (natation, vélo) et cryothérapie (glace)",
        1
      ],
      [
        "Corriger la foulée et conseiller des chaussures de sport bien amorties",
        1
      ],
      [
        "Recommander de la kinésithérapie (étirements, renforcement tibial)",
        1
      ],
      [
        "Continuer à augmenter les kilomètres sur le béton pour endurcir l'os",
        0
      ],
      [
        "Plâtrer la jambe pendant trois mois",
        0
      ]
    ],
    "conseil": {
      "q": "Quand je reprendrai la course, comment éviter que ça revienne ?",
      "ok": "Augmentez les distances progressivement, échauffez-vous, étirez-vous, renforcez vos tibiaux et portez des chaussures amorties.",
      "ko": [
        "Il faut allonger au maximum votre foulée et courir uniquement sur le béton.",
        "Une périostite ne guérit jamais, il faut arrêter définitivement toute activité sportive."
      ]
    }
  },
  "pied-bot": {
    "id": "pied-bot",
    "nom": "Gabriel",
    "age": 0,
    "sexe": "m",
    "qui": "nourrisson de 2 semaines, amené par ses parents",
    "motif": "Ses parents : « Depuis sa naissance, son pied droit est tourné vers l'intérieur et vers le bas, on s'inquiète pour sa marche. »",
    "ask": [
      [
        "Cette position du pied était-elle présente dès la naissance ?",
        "Oui, on l'a vue dès la naissance et même à l'échographie pendant la grossesse.",
        1
      ],
      [
        "Quelqu'un dans la famille est-il né avec la même déformation ?",
        "Oui, son oncle paternel est né avec un pied tourné pareil.",
        1
      ],
      [
        "Est-ce que le pied se remet facilement à plat quand vous le touchez ?",
        "Non, il reste bloqué vers le bas et l'intérieur, on n'arrive pas à le redresser.",
        1
      ],
      [
        "Le bébé a-t-il de la fièvre ?",
        "Non, il tète bien et n'a pas de fièvre.",
        0
      ],
      [
        "Est-ce qu'il marche déjà ?",
        "Non, il n'a que deux semaines.",
        0
      ],
      [
        "Prend-il des antibiotiques ?",
        "Non, aucun traitement.",
        0
      ]
    ],
    "exam": [
      [
        "Observer les trois composantes de la déformation du pied",
        "Association typique de trois déformations : équin (flexion plantaire), varus (incliné en dedans) et adduction (tourné en dedans).",
        1,
        0
      ],
      [
        "Faire le test de correction passive à la main",
        "Déformation rigide non réductible passivement à la main, avec un triceps sural court et tendu.",
        1,
        0
      ],
      [
        "Inspecter les plis cutanés et le relief musculaire",
        "Sillons cutanés marqués à la face interne de la cheville et mollet légèrement moins développé.",
        1,
        0
      ],
      [
        "Pouls pédieux et tibial postérieur",
        "Bonne vascularisation distale du pied.",
        0,
        36
      ],
      [
        "Signe de Mulder",
        "Sans objet et négatif chez le nourrisson.",
        0,
        30
      ]
    ],
    "dx": "Un pied bot varus équin congénital",
    "ddx": [
      [
        "Un simple malpositionnement fœtal bénin",
        "Une malposition simple est souple et se corrige facilement à la main au test de correction passive."
      ],
      [
        "Un pied plat valgus de l'enfant",
        "Le pied plat dévie le talon en valgus (vers l'extérieur) avec une voûte affaissée, à l'inverse du varus équin."
      ],
      [
        "Une maladie de Sever",
        "La maladie de Sever est une douleur du talon chez l'enfant sportif de 8 à 14 ans, pas une malformation néonatale."
      ]
    ],
    "cle": "Déformation congénitale associant **équin**, **varus** et **adduction**, **rigide** au test de correction passive avec sillons cutanés : c'est un **pied bot varus équin**.",
    "orient": 1,
    "orientWhy": "Il faut adresser dès les premières semaines à l'équipe orthopédique pédiatrique pour débuter la méthode de Ponseti, puis assurer le suivi podologique pendant l'enfance.",
    "tt": [
      [
        "Orienter vite pour débuter la méthode de Ponseti (plâtres, attelles)",
        1
      ],
      [
        "Éduquer les parents au port des attelles pour éviter la récidive",
        1
      ],
      [
        "Prévoir le suivi dans l'enfance (kiné, orthèses et chaussage)",
        1
      ],
      [
        "Attendre l'âge de 7 ans sans rien faire pour voir si ça passe seul",
        0
      ],
      [
        "Forcer brutalement le pied à la main en une seule séance au cabinet",
        0
      ],
      [
        "Faire une ténotomie du tendon d'Achille au cabinet de podologie",
        0
      ]
    ],
    "conseil": {
      "q": "Ses parents : « En quoi consiste la méthode de Ponseti, et est-ce qu'il marchera normalement ? »",
      "ok": "Plâtres hebdomadaires, ténotomie d'Achille puis attelles : pris tôt, 80 à 90 % des enfants ont un pied fonctionnel.",
      "ko": [
        "C'est une grosse chirurgie qui bloque définitivement toutes les articulations du pied dès la naissance.",
        "Une fois le dernier plâtre retiré, il n'y a plus jamais besoin de porter d'attelles ni de surveiller."
      ]
    }
  },
  "pied-creux": {
    "id": "pied-creux",
    "nom": "Antoine",
    "age": 31,
    "sexe": "m",
    "qui": "ingénieur informatique, fait de la randonnée",
    "motif": "J'ai tout le temps mal sous l'avant-pied et je me tords sans arrêt les chevilles depuis deux ans.",
    "ask": [
      [
        "Y a-t-il des problèmes de pieds ou une maladie neurologique dans votre famille ?",
        "Oui, mon père a les pieds très cambrés comme moi et on lui a diagnostiqué la maladie de Charcot-Marie-Tooth.",
        1
      ],
      [
        "Où avez-vous mal sous les pieds et comment sont vos chaussures ?",
        "Ça me brûle sous les têtes des métatarsiens à l'avant, et j'ai du mal à trouver des chaussures assez hautes pour mon cou-de-pied.",
        1
      ],
      [
        "Comment se passent vos entorses ?",
        "Ma cheville part sans arrêt vers l'extérieur dès que le terrain est un peu irrégulier.",
        1
      ],
      [
        "Avez-vous eu de la fièvre ?",
        "Non, jamais.",
        0
      ],
      [
        "Allez-vous souvent à la piscine municipale ?",
        "Non, je n'aime pas nager.",
        0
      ],
      [
        "Prenez-vous des corticoïdes ?",
        "Non, aucun traitement.",
        0
      ]
    ],
    "exam": [
      [
        "Observer le pied en statique et à l'empreinte plantaire",
        "Voûte longitudinale exagérément creusée, talon en varus, avant-pied en adduction/supination et orteils en griffe.",
        1,
        0
      ],
      [
        "Palper l'avant-pied et analyser la marche",
        "Métatarsalgies avec surcharge nette des têtes métatarsiennes latérales, défaut d'amorti et instabilité latérale.",
        1,
        0
      ],
      [
        "Tester la sensibilité et le tonus musculaire (bilan neurologique)",
        "Déséquilibre entre fléchisseurs et extenseurs avec rétraction des intrinsèques et légère diminution de la sensibilité vibratoire.",
        1,
        34
      ],
      [
        "Signe de Thompson",
        "Normal : le triceps sural est continu (et même suractif).",
        0,
        25
      ],
      [
        "Test de Lasègue",
        "Négatif : pas de radiculalgie sciatique.",
        0,
        13
      ]
    ],
    "dx": "Un pied creux (à forte suspicion d'origine neurologique)",
    "ddx": [
      [
        "Un pied plat valgus",
        "C'est l'inverse : dans le pied plat, la voûte est effondrée et le calcanéum part en valgus."
      ],
      [
        "Une simple séquelle d'entorse externe isolée",
        "Elle n'explique ni la voûte très creusée bilatérale, ni les orteils en griffe, ni l'antécédent familial de Charcot-Marie-Tooth."
      ],
      [
        "Une maladie de Sever",
        "La maladie de Sever est une talalgie de croissance de l'enfant entre 8 et 14 ans."
      ]
    ],
    "cle": "Voûte **exagérément creusée**, **talon en varus**, **orteils en griffe**, métatarsalgies, entorses et terrain familial de **Charcot-Marie-Tooth** (70-80 % de causes neurologiques).",
    "orient": 1,
    "orientWhy": "Dans 70 à 80 % des cas le pied creux est neurologique : il faut adresser au médecin pour un bilan neurologique (EMG, radio en charge) en plus des orthèses plantaires.",
    "tt": [
      [
        "Réaliser des orthèses sur mesure (soutien externe, appuis répartis)",
        1
      ],
      [
        "Adresser au médecin pour bilan neurologique (EMG) et radio en charge",
        1
      ],
      [
        "Conseiller rééducation (étirer chaînes postérieures, proprioception)",
        1
      ],
      [
        "Conseiller un chaussage adapté (profondeur, largeur, soutien latéral)",
        1
      ],
      [
        "Creuser encore plus l'arche interne avec une grosse voûte médiale",
        0
      ],
      [
        "Écarter d'office toute cause neurologique sans demander de bilan",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi voulez-vous que je voie mon médecin et un neurologue alors que je viens juste pour mes pieds ?",
      "ok": "Car 70 à 80 % des pieds creux sont neurologiques (ex. Charcot-Marie-Tooth) : un suivi pluridisciplinaire et vos semelles aident.",
      "ko": [
        "C'est juste une formalité administrative, le pied creux vient toujours d'une chaussure trop grande.",
        "Parce qu'il faut vous opérer demain matin sans jamais essayer de semelles orthopédiques."
      ]
    }
  },
  "pied-plat": {
    "id": "pied-plat",
    "nom": "Yanis",
    "age": 10,
    "sexe": "m",
    "qui": "écolier en léger surpoids, amené par son père",
    "motif": "Son père : « Il a mal au milieu des pieds après une longue marche, et ses chaussures s'écrasent vers l'intérieur. »",
    "ask": [
      [
        "Depuis quand a-t-il ces pieds plats et ces douleurs ?",
        "Il a toujours eu les pieds plats, mais à 10 ans ça persiste et il a mal aux pieds et aux chevilles en fin de journée.",
        1
      ],
      [
        "Y a-t-il des pieds plats ou une grande souplesse dans la famille ?",
        "Oui, je suis très souple des articulations et j'avais les pieds plats enfant.",
        1
      ],
      [
        "Quelles chaussures porte-t-il d'habitude ?",
        "Des baskets en toile très molles sans contrefort à l'arrière.",
        1
      ],
      [
        "A-t-il eu de la fièvre ou des articulations gonflées le matin ?",
        "Non, jamais de fièvre ni de gonflement matinal.",
        0
      ],
      [
        "A-t-il une plaie sous le pied ?",
        "Non, aucune plaie.",
        0
      ],
      [
        "Fait-il de la danse sur pointes ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Observer les pieds debout de face et de derrière",
        "Voûte plantaire effondrée, calcanéum en valgus net et avant-pied en abduction (signe du « too many toes »).",
        1,
        0
      ],
      [
        "Faire le test de Jack (extension du gros orteil) et la mise sur pointes",
        "La voûte réapparaît au test de Jack et le calcanéum se redresse sur la pointe des pieds : pied plat souple réductible.",
        1,
        0
      ],
      [
        "Évaluer l'hyperlaxité ligamentaire (score de Beighton) et la podographie",
        "Hyperlaxité ligamentaire présente et empreinte plantaire étalée au podoscope.",
        1,
        38
      ],
      [
        "Signe de Thompson",
        "Normal : tendon d'Achille continu.",
        0,
        25
      ],
      [
        "Signe de Mulder",
        "Négatif : pas de douleur intermétatarsienne.",
        0,
        30
      ]
    ],
    "dx": "Un pied plat valgus souple symptomatique de l'enfant",
    "ddx": [
      [
        "Un pied plat rigide par synostose tarsienne",
        "Dans une synostose tarsienne (fusion osseuse), le pied est rigide et ne se corrige ni au test de Jack ni sur pointes."
      ],
      [
        "Un pied creux",
        "Le pied creux a une voûte exagérément haute et un talon en varus, à l'opposé du pied plat valgus."
      ],
      [
        "Un pied bot varus équin",
        "C'est une déformation congénitale rigide en varus, équin et adduction, pas un affaissement souple en valgus."
      ]
    ],
    "cle": "Voûte **effondrée**, **valgus calcanéen**, signe du **« too many toes »**, mais la voûte réapparaît au **test de Jack** et le talon se redresse **sur pointes** : c'est un **pied plat valgus souple**.",
    "orient": 0,
    "orientWhy": "Pied plat souple mais persistant après 8 ans et douloureux : prise en charge podologique au cabinet par orthèses sur mesure, chaussage adapté et rééducation.",
    "tt": [
      [
        "Réaliser des orthèses sur mesure (soutien médial, corriger le valgus)",
        1
      ],
      [
        "Conseiller des chaussures avec bon contrefort et semelle stable",
        1
      ],
      [
        "Conseiller de la rééducation (tibial postérieur, proprioception)",
        1
      ],
      [
        "Suivre régulièrement l'évolution et accompagner le contrôle du poids",
        1
      ],
      [
        "Poser d'emblée un implant sous-talien (arthrorise) sans semelles",
        0
      ],
      [
        "Conseiller des chaussures en toile molles sans maintien arrière",
        0
      ]
    ],
    "conseil": {
      "q": "Son père : « Pourquoi avez-vous soulevé son gros orteil et demandé de monter sur la pointe des pieds ? »",
      "ok": "Au test de Jack et sur pointes, la voûte revient et le talon se redresse : son pied plat est souple et évoluera bien.",
      "ko": [
        "C'était uniquement pour vérifier s'il n'avait pas d'ongle incarné au gros orteil.",
        "Cela prouve que les os de son pied sont soudés entre eux et qu'il faut l'opérer tout de suite."
      ]
    }
  },
  "scoliose": {
    "id": "scoliose",
    "nom": "Chloé",
    "age": 13,
    "sexe": "f",
    "qui": "collégienne en 4e, vient avec sa mère pour un bilan de posture",
    "motif": "Sa mère : En lui achetant un maillot de bain, j'ai vu que son dos n'était pas droit et qu'une épaule ressortait.",
    "ask": [
      [
        "A-t-elle grandi vite ces derniers mois ?",
        "Sa mère : Oui, elle a pris presque 8 centimètres cette année, depuis sa puberté.",
        1
      ],
      [
        "Y a-t-il des scolioses dans la famille ?",
        "Sa mère : Oui, moi-même j'ai porté un corset au collège pour une scoliose.",
        1
      ],
      [
        "A-t-elle mal au dos dans la journée ?",
        "Chloé : Non, je n'ai pas mal du tout, je sens juste que je fatigue vite assise.",
        1
      ],
      [
        "A-t-elle eu de la fièvre ou perdu du poids ?",
        "Sa mère : Non, elle est en pleine forme.",
        0
      ],
      [
        "Fait-elle des entorses à répétition ?",
        "Chloé : Non, je ne me suis jamais tordu la cheville.",
        0
      ],
      [
        "Porte-t-elle des chaussures de sécurité ?",
        "Chloé : Non, des baskets normales pour aller au collège.",
        0
      ]
    ],
    "exam": [
      [
        "Alignement au fil à plomb et examen du dos debout",
        "Tronc asymétrique : épaule droite plus haute, omoplate droite saillante et pli de taille asymétrique.",
        1,
        1
      ],
      [
        "Test d'Adams (penchée en avant, mains jointes)",
        "Bosse dorsale droite nette (gibbosité) qui ne disparaît pas à la flexion.",
        1,
        2
      ],
      [
        "Mesure au scoliomètre et test en position allongée",
        "Angle de torsion rachidienne à 8° au scoliomètre ; la déformation reste fixée même allongée.",
        1,
        3
      ],
      [
        "Mesure de l'ILMI aux cales et au mètre ruban",
        "Membres inférieurs de même longueur, pas d'inégalité significative.",
        0,
        15
      ],
      [
        "Test de Lasègue",
        "Indolore des deux côtés, aucun signe de sciatique.",
        0,
        13
      ]
    ],
    "dx": "Une scoliose idiopathique structurale de l'adolescente",
    "ddx": [
      [
        "Une simple attitude scoliotique",
        "L'attitude scoliotique est souple, sans rotation vertébrale ni gibbosité au test d'Adams, et disparaît allongée."
      ],
      [
        "Une inégalité de longueur des membres inférieurs isolée",
        "Les deux jambes ont la même longueur et la déformation du rachis est fixée dans les trois plans."
      ],
      [
        "Une maladie de Scheuermann (cyphose dorsale)",
        "Elle donne un dos rond dans le plan sagittal, pas une gibbosité latérale avec rotation vertébrale au test d'Adams."
      ]
    ],
    "cle": "Adolescente en croissance rapide avec antécédent familial, tronc asymétrique et **gibbosité fixée** au test d'Adams (8° au scoliomètre) : c'est une **scoliose structurale**.",
    "orient": 1,
    "orientWhy": "Il faut adresser au médecin pour une radiographie du rachis en charge (angle de Cobb) et organiser le suivi pluridisciplinaire.",
    "tt": [
      [
        "Adresser au médecin pour radiographie du rachis (angle de Cobb)",
        1
      ],
      [
        "Réaliser un bilan podologique et postural complet",
        1
      ],
      [
        "Travailler en équipe (médecin, kiné RPG/Schroth, podologue)",
        1
      ],
      [
        "Donner des conseils d'hygiène posturale (sac à dos, assise)",
        1
      ],
      [
        "Rassurer sans suivi car elle n'a aucune douleur",
        0
      ],
      [
        "Manipuler les vertèbres pour débloquer la rotation",
        0
      ]
    ],
    "conseil": {
      "q": "Comme elle n'a pas mal, ça risque vraiment de s'aggraver ?",
      "ok": "Oui, une scoliose idiopathique peut fort s'aggraver pendant la croissance : un suivi régulier est indispensable.",
      "ko": [
        "Non, tant qu'il n'y a pas de douleur, la colonne ne bougera plus.",
        "Elle va disparaître toute seule dès qu'elle portera son sac sur les deux épaules."
      ]
    }
  },
  "attitudes-scoliotiques": {
    "id": "attitudes-scoliotiques",
    "nom": "Nathan",
    "age": 11,
    "sexe": "m",
    "qui": "élève de 6e, amené par son père après la visite scolaire",
    "motif": "Son père : L'infirmière scolaire a trouvé qu'il se tenait de travers avec une épaule plus basse que l'autre.",
    "ask": [
      [
        "A-t-il mal au dos ?",
        "Nathan : Pas vraiment mal, mais j'ai le dos un peu fatigué en fin de journée.",
        1
      ],
      [
        "Comment porte-t-il son sac de cours ?",
        "Nathan : Toujours sur l'épaule droite, il est super lourd depuis l'entrée en 6e.",
        1
      ],
      [
        "Avez-vous remarqué qu'il usait ses chaussures différemment ?",
        "Son père : Oui, sa basket gauche est plus usée sous le talon et il penche un peu.",
        1
      ],
      [
        "A-t-il des fourmillements dans les jambes ?",
        "Nathan : Non, jamais.",
        0
      ],
      [
        "A-t-il eu une fracture de la colonne ?",
        "Son père : Non, aucun accident.",
        0
      ],
      [
        "Respire-t-il mal quand il court ?",
        "Nathan : Non, je cours normalement au foot.",
        0
      ]
    ],
    "exam": [
      [
        "Observation posturale debout et au fil à plomb",
        "Épaule gauche plus basse, bassin oblique basculé à gauche et pied gauche plat valgus.",
        1,
        1
      ],
      [
        "Test d'Adams (flexion antérieure du tronc)",
        "Test d'Adams négatif : le dos reste symétrique, aucune gibbosité ni rotation vertébrale.",
        1,
        2
      ],
      [
        "Mesure de l'ILMI aux cales et examen allongé",
        "Jambe gauche plus courte de 9 mm ; la déviation du rachis disparaît couchée et avec une cale sous le talon gauche.",
        1,
        15
      ],
      [
        "Test de Schöber",
        "Souplesse lombaire tout à fait normale.",
        0,
        4
      ],
      [
        "Signe de Thompson",
        "Normal des deux côtés.",
        0,
        25
      ]
    ],
    "dx": "Une attitude scoliotique secondaire à une ILMI",
    "ddx": [
      [
        "Une scoliose structurale idiopathique",
        "Dans la vraie scoliose, la rotation des vertèbres est fixée et donne une gibbosité au test d'Adams."
      ],
      [
        "Une sciatique par hernie discale",
        "Il n'y a ni douleur irradiant dans la jambe ni raideur rachidienne."
      ],
      [
        "Une spondylarthrite ankylosante",
        "C'est un rhumatisme inflammatoire avec raideur matinale, alors qu'ici le rachis est souple et indolore."
      ]
    ],
    "cle": "Déviation frontale souple, **test d'Adams négatif** (sans gibbosité) et rachis qui se réaligne allongé ou avec une **cale sous le talon court** : c'est une **attitude scoliotique**.",
    "orient": 1,
    "orientWhy": "Le podologue corrige la cause fonctionnelle par semelles et informe le médecin pour le suivi de croissance et la kinésithérapie.",
    "tt": [
      [
        "Semelles sur mesure avec élévation sous le talon court",
        1
      ],
      [
        "Corriger les troubles d'appui plantaire pour symétriser la posture",
        1
      ],
      [
        "Conseiller de porter le sac à dos sur les deux épaules",
        1
      ],
      [
        "Rééducation posturale (gainage, étirements, proprioception)",
        1
      ],
      [
        "Faire porter un corset plâtré jour et nuit",
        0
      ],
      [
        "Proposer une arthrodèse vertébrale chirurgicale",
        0
      ]
    ],
    "conseil": {
      "q": "Est-ce que sa colonne va rester tordue toute sa vie ?",
      "ok": "Non, c'est fonctionnel et réversible si on corrige tôt l'inégalité de longueur et la posture, avec un bon suivi.",
      "ko": [
        "Oui, les vertèbres sont déjà soudées de travers.",
        "Il faut qu'il arrête complètement le sport jusqu'à ses 18 ans."
      ]
    }
  },
  "carrefour-posterieur": {
    "id": "carrefour-posterieur",
    "nom": "Camille",
    "age": 19,
    "sexe": "f",
    "qui": "danseuse classique en conservatoire, 15 heures par semaine",
    "motif": "J'ai une douleur vive derrière la cheville droite dès que je monte sur pointes.",
    "ask": [
      [
        "Quel mouvement précis déclenche la douleur ?",
        "Dès que je pointe le pied à fond en danse, j'ai l'impression que quelque chose coince derrière la cheville.",
        1
      ],
      [
        "Sentez-vous des blocages ou des claquements ?",
        "Oui, parfois ça claque ou ça bloque à l'arrière, derrière la malléole.",
        1
      ],
      [
        "Avez-vous déjà fait des entorses à cette cheville ?",
        "Oui, deux entorses l'an dernier, et on m'a toujours dit que j'avais les chevilles très laxes.",
        1
      ],
      [
        "Avez-vous mal aux premiers pas le matin sous le talon ?",
        "Non, au réveil à plat je n'ai pas mal du tout.",
        0
      ],
      [
        "Avez-vous des fourmillements sous les orteils la nuit ?",
        "Non, jamais.",
        0
      ],
      [
        "Avez-vous changé de savon ou eu des plaques rouges ?",
        "Non, la peau est normale.",
        0
      ]
    ],
    "exam": [
      [
        "Test du carrefour postérieur (flexion plantaire passive forcée)",
        "La mise en flexion plantaire forcée reproduit immédiatement la douleur vive à l'arrière de la cheville.",
        1,
        0
      ],
      [
        "Palpation profonde derrière la malléole externe et triangle de Kager",
        "Douleur nette dans le triangle de Kager (entre Achille, calcanéum et talus), alors que le corps du tendon d'Achille est indolore.",
        1,
        0
      ],
      [
        "Examen morphostatique du pied et de la cheville",
        "Pied creux avec laxité de cheville et légère tuméfaction postérieure.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal : la pression du mollet entraîne bien la flexion plantaire.",
        0,
        25
      ],
      [
        "Signe de Mulder",
        "Négatif, aucune douleur à l'avant-pied.",
        0,
        30
      ]
    ],
    "dx": "Un syndrome du carrefour postérieur de la cheville",
    "ddx": [
      [
        "Une tendinopathie du corps du tendon d'Achille",
        "Dans la tendinopathie d'Achille, la douleur est sur le tendon lui-même et pire en flexion dorsale ou au réveil."
      ],
      [
        "Une fasciite plantaire",
        "La fasciite fait mal sous le talon aux premiers pas du matin, pas derrière la cheville en pointe forcée."
      ],
      [
        "Un syndrome du canal tarsien",
        "Il donne des brûlures et fourmillements sous le pied avec un signe de Tinel médial, pas un blocage en extension."
      ]
    ],
    "cle": "Danseuse avec laxité et pied creux, douleur dans le **triangle de Kager** et blocage reproduit en **flexion plantaire forcée** (pointe) : c'est un conflit du **carrefour postérieur**.",
    "orient": 1,
    "orientWhy": "On met en place le traitement podologique conservateur et on adresse au médecin pour imagerie (radio en flexion plantaire à la recherche d'un os trigone, écho/IRM).",
    "tt": [
      [
        "Repos sportif relatif (éviter les pointes forcées temporairement)",
        1
      ],
      [
        "Semelles limitant la flexion plantaire avec amorti postérieur",
        1
      ],
      [
        "Poser un taping ou une contention souple de cheville",
        1
      ],
      [
        "Adresser pour kinésithérapie (proprioception, stabilisateurs)",
        1
      ],
      [
        "Forcer les étirements en pointe maximale chaque jour",
        0
      ],
      [
        "Retirer l'os trigone au cabinet sous anesthésie locale",
        0
      ]
    ],
    "conseil": {
      "q": "Je vais pouvoir reprendre la danse sans me faire opérer ?",
      "ok": "Souvent oui : repos adapté, kiné et semelles suffisent. On n'opère que si un conflit osseux comme un os trigone résiste.",
      "ko": [
        "Non, en danse classique l'opération chirurgicale est obligatoire d'emblée.",
        "Tu peux reprendre les pointes à fond dès demain si tu serres plus tes chaussons."
      ]
    }
  },
  "canal-tarsien": {
    "id": "canal-tarsien",
    "nom": "Karim",
    "age": 46,
    "sexe": "m",
    "qui": "vendeur en magasin de bricolage, debout toute la journée",
    "motif": "J'ai comme des brûlures et des décharges sous le pied droit, ça part de l'intérieur de la cheville.",
    "ask": [
      [
        "Quel genre de douleur ressentez-vous exactement ?",
        "Ça brûle, ça serre comme un étau sous la plante et j'ai des fourmillements jusque dans les trois premiers orteils.",
        1
      ],
      [
        "À quel moment de la journée avez-vous le plus mal ?",
        "C'est pire après être resté debout longtemps au magasin, et ça me réveille même souvent la nuit.",
        1
      ],
      [
        "Avez-vous eu un traumatisme à cette cheville par le passé ?",
        "Oui, une grosse entorse il y a deux ans, et j'ai toujours eu les pieds très plats.",
        1
      ],
      [
        "Avez-vous mal dans le bas du dos ou dans la fesse ?",
        "Non, mon dos va très bien, ça part vraiment de la cheville.",
        0
      ],
      [
        "Avez-vous de la fièvre ou des frissons ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Pratiquez-vous la danse classique sur pointes ?",
        "Non, je ne fais pas de danse.",
        0
      ]
    ],
    "exam": [
      [
        "Signes de Tinel et de Phalen au canal tarsien (derrière la malléole médiale)",
        "Tinel positif : la percussion derrière et sous la malléole interne déclenche une décharge électrique vers la plante et les premiers orteils.",
        1,
        32
      ],
      [
        "Examen de la sensibilité plantaire",
        "Légère diminution de la sensibilité superficielle sur le territoire plantaire médial.",
        1,
        35
      ],
      [
        "Bilan statique du pied en charge",
        "Pied plat valgus prononcé qui met en tension la face médiale de la cheville.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur bien frappés et symétriques.",
        0,
        36
      ],
      [
        "Test de Lasègue",
        "Négatif, pas de douleur radiculaire sciatique.",
        0,
        13
      ]
    ],
    "dx": "Un syndrome du canal tarsien (compression du nerf tibial postérieur)",
    "ddx": [
      [
        "Une fasciite plantaire",
        "La fasciite donne une douleur mécanique sous le talon aux premiers pas du matin, sans fourmillements nocturnes ni signe de Tinel."
      ],
      [
        "Une sciatique (radiculalgie L5 ou S1)",
        "La douleur partirait du rachis lombaire avec un Lasègue positif, pas d'un Tinel derrière la malléole médiale."
      ],
      [
        "Un névrome de Morton",
        "Le Morton siège entre les têtes métatarsiennes (3e espace) et ne donne pas de douleur derrière la malléole interne."
      ]
    ],
    "cle": "Brûlures et **fourmillements nocturnes** irradiant sous la plante, pied plat valgus et **signe de Tinel positif** derrière la malléole médiale : c'est un **syndrome du canal tarsien**.",
    "orient": 1,
    "orientWhy": "Le podologue réalise les semelles de décharge et adresse au médecin pour confirmer l'atteinte par électromyogramme (EMG) et échographie.",
    "tt": [
      [
        "Semelles avec soutien de voûte, contrôle du valgus et amorti talonnier",
        1
      ],
      [
        "Conseiller un chaussage adapté qui ne serre pas la cheville",
        1
      ],
      [
        "Adresser au médecin (EMG, échographie, kiné neurodynamique)",
        1
      ],
      [
        "Repos relatif en limitant les stations debout prolongées",
        1
      ],
      [
        "Comprimer fortement la malléole interne avec un strapping serré",
        0
      ],
      [
        "Réaliser une neurolyse chirurgicale au cabinet",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi mes pieds plats me donnent des fourmillements dans les orteils ?",
      "ok": "Le pied plat valgus étire le nerf tibial postérieur derrière la malléole interne : la semelle redresse le pied et soulage le nerf.",
      "ko": [
        "C'est parce que les artères des orteils sont bouchées par le pied plat.",
        "Il faut porter des chaussures très étroites et rigides pour bloquer la malléole."
      ]
    }
  },
  "bursite-icm": {
    "id": "bursite-icm",
    "nom": "Sophie",
    "age": 42,
    "sexe": "f",
    "qui": "professeure des écoles, marche beaucoup et porte souvent des bottines à talons",
    "motif": "J'ai mal sous l'avant-pied gauche quand je marche, comme si je marchais sur une petite bille.",
    "ask": [
      [
        "Est-ce que cette douleur vous réveille la nuit ?",
        "Non, jamais la nuit. C'est uniquement quand je marche ou que je reste debout longtemps en classe.",
        1
      ],
      [
        "Ressentez-vous de vraies décharges électriques ou un orteil tout engourdi ?",
        "Non, ça chauffe et ça comprime un peu vers les orteils du milieu, mais je sens très bien mes orteils.",
        1
      ],
      [
        "Quel type de chaussures portez-vous au quotidien ?",
        "Souvent des chaussures de ville assez étroites devant avec un petit talon.",
        1
      ],
      [
        "Avez-vous eu une plaie ou une écharde sous le pied ?",
        "Non, la peau est intacte.",
        0
      ],
      [
        "Avez-vous mal derrière le talon en montant les escaliers ?",
        "Non, juste sous l'avant-pied.",
        0
      ],
      [
        "Faites-vous de la natation avec des palmes ?",
        "Non, jamais.",
        0
      ]
    ],
    "exam": [
      [
        "Palper l'espace entre les têtes métatarsiennes (M2-M3)",
        "Douleur franche et petit gonflement localisé entre les 2e et 3e têtes métatarsiennes.",
        1,
        0
      ],
      [
        "Signe de Mulder (compression transversale de l'avant-pied)",
        "La pression latérale réveille une douleur mécanique, mais sans clic palpable ni décharge électrique franche.",
        1,
        30
      ],
      [
        "Examen statique de l'avant-pied et de l'arche",
        "Pied creux avec hallux valgus débutant qui transfère les appuis sur les rayons centraux (2e rayon long).",
        1,
        0
      ],
      [
        "Lachman de la 2e métatarso-phalangienne",
        "Articulation MTP2 stable, pas de rupture de la plaque plantaire.",
        0,
        29
      ],
      [
        "Signes de Tinel et de Phalen au canal tarsien",
        "Négatifs, aucune douleur rétro-malléolaire médiale.",
        0,
        32
      ]
    ],
    "dx": "Une bursite inter-capito-métatarsienne (M2-M3)",
    "ddx": [
      [
        "Un vrai névrome de Morton",
        "Le vrai Morton donne des décharges neuropathiques franches, un engourdissement des orteils et un clic au test de Mulder."
      ],
      [
        "Une verrue plantaire",
        "Il n'y a aucune lésion cornée à points noirs sur la peau."
      ],
      [
        "Une fracture de fatigue métatarsienne",
        "La douleur siège dans l'espace inter-capito-métatarsien et non sur la diaphyse osseuse du métatarsien."
      ]
    ],
    "cle": "Douleur mécanique entre deux têtes (M2-M3) avec corps étranger, **jamais la nuit**, pied creux + hallux valgus et **Mulder sans clic** : c'est une **bursite inter-capito-métatarsienne**.",
    "orient": 1,
    "orientWhy": "On réalise l'appareillage par semelles et on adresse au médecin si besoin d'une échographie (qui montre la bourse enflammée et écarte un Morton) ou d'AINS.",
    "tt": [
      [
        "Semelles orthopédiques avec barre rétro-capitale de décharge",
        1
      ],
      [
        "Conseiller un chaussage large à l'avant-pied, amorti et sans talons",
        1
      ],
      [
        "Proposer des étirements du triceps sural (mollet) et du repos",
        1
      ],
      [
        "Adresser au médecin pour échographie / AINS si douleur persistante",
        1
      ],
      [
        "Mettre un élément compressif directement sous les têtes M2-M3",
        0
      ],
      [
        "Prescrire des chaussures à talons hauts pour soulager l'avant-pied",
        0
      ]
    ],
    "conseil": {
      "q": "Ma collègue m'a dit que c'était sûrement un névrome de Morton, c'est pareil ?",
      "ok": "Non, ici c'est la bourse de glissement entre les os qui est enflammée par l'appui ; l'échographie la distingue bien d'un Morton.",
      "ko": [
        "Oui, c'est exactement la même maladie : il faut couper le nerf chirurgicalement.",
        "Une bursite est une infection bactérienne : il faut prendre des antibiotiques pendant un mois."
      ]
    }
  },
  "morton": {
    "id": "morton",
    "nom": "Claire",
    "age": 38,
    "sexe": "f",
    "qui": "hôtesse d'accueil en entreprise, porte des escarpins toute la journée",
    "motif": "J'ai une brûlure et un pincement entre les 3e et 4e orteils droits dès que je marche avec mes escarpins.",
    "ask": [
      [
        "Qu'est-ce qui déclenche et qu'est-ce qui calme votre douleur ?",
        "Ça brûle en marchant avec mes escarpins serrés, et ça me soulage dès que je me déchausse et que je masse mon pied.",
        1
      ],
      [
        "Avez-vous souvent des fourmillements ou les orteils endormis ?",
        "Presque pas de fourmillements, c'est surtout une brûlure et un pincement mécanique à l'appui.",
        1
      ],
      [
        "Avez-vous déjà passé une échographie ou une IRM du pied ?",
        "Oui, aux deux examens le nerf interdigital n'est pas épaissi : il n'y a aucun névrome, juste les tissus mous irrités.",
        1
      ],
      [
        "Avez-vous eu une entorse du genou récemment ?",
        "Non, jamais.",
        0
      ],
      [
        "Avez-vous des plaques rouges qui grattent entre les orteils ?",
        "Non, la peau entre mes orteils est toute propre.",
        0
      ],
      [
        "Prenez-vous des anticoagulants ?",
        "Non, aucun médicament.",
        0
      ]
    ],
    "exam": [
      [
        "Palper le 3e espace inter-métatarsien (M3-M4)",
        "Douleur nette à la palpation plantaire entre M3 et M4, liée à la compression des tissus mous.",
        1,
        0
      ],
      [
        "Signe de Mulder",
        "Pas de clic palpable à la compression transversale de l'avant-pied.",
        1,
        30
      ],
      [
        "Bilan podologique statique et dynamique",
        "Pied creux avec hyper-appui antérieur marqué, hallux valgus et instabilité médio-tarsienne.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal des deux côtés.",
        0,
        25
      ],
      [
        "Monofilament 10 g",
        "Sensibilité plantaire parfaitement conservée partout.",
        0,
        33
      ]
    ],
    "dx": "Un pseudo-névrome de Morton",
    "ddx": [
      [
        "Un vrai névrome de Morton",
        "Dans le vrai Morton, le nerf interdigital est hypertrophié, avec un clic de Mulder et un épaississement visible à l'écho ou à l'IRM."
      ],
      [
        "Une maladie de Freiberg (ostéochondrose de la tête de M2)",
        "Elle touche la tête osseuse du 2e métatarsien chez l'adolescent, pas le 3e espace inter-métatarsien à imagerie osseuse normale."
      ],
      [
        "Un syndrome du canal tarsien",
        "La compression se situe derrière la malléole médiale et non entre les têtes M3 et M4."
      ]
    ],
    "cle": "Douleur en M3-M4 soulagée au déchaussage, peu de paresthésies, pas de clic au Mulder et **imagerie négative pour le névrome** (nerf sain) : c'est un **pseudo-névrome de Morton**.",
    "orient": 0,
    "orientWhy": "L'imagerie a déjà écarté un vrai névrome : la prise en charge est conservatrice et mécanique au cabinet de podologie.",
    "tt": [
      [
        "Semelles avec barre rétro-capitale et soutien de voûte adapté",
        1
      ],
      [
        "Corriger l'axe d'appui pour décharger l'avant-pied",
        1
      ],
      [
        "Conseiller un chaussage large, souple et sans talon haut",
        1
      ],
      [
        "Étirements du triceps sural et glaçage en phase douloureuse",
        1
      ],
      [
        "Adresser au chirurgien pour réséquer le nerf interdigital",
        0
      ],
      [
        "Continuer les escarpins étroits en serrant les lacets",
        0
      ]
    ],
    "conseil": {
      "q": "Comment je peux avoir mal comme dans un Morton si mon nerf est normal à l'IRM ?",
      "ok": "Ce sont les tissus mous autour du nerf qui sont comprimés à la marche : avec les semelles et un chaussage large, ça guérit vite.",
      "ko": [
        "C'est que la douleur est psychologique puisqu'on ne voit pas de boule sur le nerf.",
        "Il va falloir plâtrer le pied pendant six semaines sans poser le pied par terre."
      ]
    }
  },
  "patte-oie": {
    "id": "patte-oie",
    "nom": "Martine",
    "age": 58,
    "sexe": "f",
    "qui": "retraitée active, s'est mise à la marche rapide et au tennis en club",
    "motif": "J'ai mal à l'intérieur du genou droit depuis trois semaines, surtout dans les escaliers.",
    "ask": [
      [
        "Où se situe exactement votre douleur au genou ?",
        "À l'intérieur du genou, juste un peu en dessous de l'articulation, sur le haut du tibia.",
        1
      ],
      [
        "Quels mouvements réveillent le plus la douleur ?",
        "Quand je plie le genou, quand je monte ou descends les escaliers, et quand je cours au tennis.",
        1
      ],
      [
        "Avez-vous eu un traumatisme ou un blocage franc du genou ?",
        "Non, aucun choc ni blocage, c'est venu progressivement en augmentant mes séances de tennis.",
        1
      ],
      [
        "Avez-vous mal dans le bas du dos ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Avez-vous des crampes dans les deux mollets au bout de 500 mètres ?",
        "Non, mes mollets vont bien.",
        0
      ],
      [
        "Avez-vous eu de la fièvre cette semaine ?",
        "Non, aucune fièvre.",
        0
      ]
    ],
    "exam": [
      [
        "Palper l'insertion de la patte d'oie (face médiale haute du tibia)",
        "Douleur vive et précise à la palpation sous l'interligne médial du genou, avec un léger œdème local.",
        1,
        0
      ],
      [
        "Tester la flexion et la rotation interne contrariées du genou",
        "La mise en tension des tendons (sartorius, gracilis, semi-tendineux) reproduit la douleur médiale ; faiblesse des quadriceps et ischios.",
        1,
        31
      ],
      [
        "Examen statique des membres inférieurs et des pieds",
        "Genu valgum modéré associé à des pieds plats valgus et une pronation excessive à la marche.",
        1,
        16
      ],
      [
        "Test de Noble (face externe du genou)",
        "Négatif : aucune douleur sur l'épicondyle latéral du fémur.",
        0,
        17
      ],
      [
        "Test de Lachman du genou (LCA)",
        "Arrêt dur normal, pas de laxité antérieure.",
        0,
        19
      ]
    ],
    "dx": "Un syndrome de la patte d'oie (tendinite de la patte d'oie)",
    "ddx": [
      [
        "Un syndrome de l'essuie-glace (bandelette ilio-tibiale)",
        "Il donne une douleur à l'extérieur du genou avec un test de Noble positif, alors qu'ici la douleur est à l'intérieur."
      ],
      [
        "Une rupture du ligament croisé antérieur (LCA)",
        "Elle fait suite à un traumatisme en torsion avec instabilité et test de Lachman positif."
      ],
      [
        "Une sciatique L5",
        "La douleur est strictement locale sur l'insertion tendineuse médiale du tibia, sans irradiation depuis le dos."
      ]
    ],
    "cle": "Femme sportive avec pied plat pronateur, douleur à l'**intérieur du genou sous l'interligne** (sartorius, gracilis, semi-tendineux) pire dans les escaliers : **tendinite de la patte d'oie**.",
    "orient": 1,
    "orientWhy": "Prise en charge par semelles au cabinet et orientation vers le médecin pour prescrire la kinésithérapie (et une échographie si doute).",
    "tt": [
      [
        "Semelles orthopédiques pour corriger la pronation et l'alignement",
        1
      ],
      [
        "Repos sportif relatif et application de glace sur la zone",
        1
      ],
      [
        "Adresser en kinésithérapie (renforcer quadriceps/ischios, étirer)",
        1
      ],
      [
        "Adapter le dosage de l'entraînement avec un bon échauffement",
        1
      ],
      [
        "Infiltrer des corticoïdes directement dans le tendon chaque semaine",
        0
      ],
      [
        "Immobiliser le genou dans un plâtre circulaire pendant un mois",
        0
      ]
    ],
    "conseil": {
      "q": "Mon médecin m'a parlé d'une infiltration si ça ne passe pas, on peut en faire autant qu'on veut ?",
      "ok": "Non, repos, kiné et semelles suffisent souvent ; l'infiltration se fait avec prudence car elle peut atrophier le tendon.",
      "ko": [
        "Oui, on peut faire une infiltration tous les mois sans aucun risque pour les tendons.",
        "Une tendinite de la patte d'oie ne guérit jamais sans opération chirurgicale."
      ]
    }
  },
  "essuie-glace": {
    "id": "essuie-glace",
    "nom": "Julien",
    "age": 29,
    "sexe": "m",
    "qui": "ingénieur, prépare un semi-marathon sur route",
    "motif": "J'ai une douleur sur le côté extérieur du genou gauche qui m'oblige à arrêter de courir.",
    "ask": [
      [
        "Avez-vous changé quelque chose dans votre entraînement récemment ?",
        "Oui, j'ai doublé mon kilométrage il y a trois semaines et je cours maintenant sur du bitume avec beaucoup de côtes.",
        1
      ],
      [
        "Comment évolue la douleur pendant et après la course ?",
        "Elle monte sur l'extérieur du genou avec l'effort, surtout dans les descentes et les escaliers, et dure des heures après.",
        1
      ],
      [
        "Dans quel état sont vos chaussures de course ?",
        "Elles ont plus d'un an et sont bien usées sur les côtés.",
        1
      ],
      [
        "Votre genou s'est-il dérobé ou bloqué après une chute ?",
        "Non, je ne suis jamais tombé.",
        0
      ],
      [
        "Avez-vous mal sous le talon au réveil ?",
        "Non, jamais.",
        0
      ],
      [
        "Avez-vous des fourmillements dans les orteils ?",
        "Non, aucun fourmillement.",
        0
      ]
    ],
    "exam": [
      [
        "Palper l'épicondyle latéral du fémur et faire le test de Noble",
        "Test de Noble positif : douleur vive sur l'épicondyle latéral quand on fléchit-étend le genou vers 30° sous pression.",
        1,
        17
      ],
      [
        "Test de Renne (flexion monopodal en charge)",
        "Douleur reproduite sur la face externe du genou vers 30-40° de flexion en appui sur le pied gauche.",
        1,
        18
      ],
      [
        "Bilan statique et testing musculaire de hanche",
        "Pieds plats pronateurs et faiblesse nette des abducteurs de hanche (moyen fessier) au test de Trendelenburg.",
        1,
        9
      ],
      [
        "Palper la patte d'oie (face interne du genou)",
        "Totalement indolore en dedans.",
        0,
        0
      ],
      [
        "Tiroir postérieur du genou (LCP)",
        "Normal, aucune laxité postérieure.",
        0,
        20
      ]
    ],
    "dx": "Un syndrome de l'essuie-glace (tendinite de la bandelette ilio-tibiale)",
    "ddx": [
      [
        "Un syndrome de la patte d'oie",
        "La patte d'oie fait mal à l'intérieur du genou sous l'interligne, pas à l'extérieur sur l'épicondyle latéral."
      ],
      [
        "Une rupture du ligament croisé postérieur",
        "Elle suit un choc direct sur le tibia avec un tiroir postérieur positif."
      ],
      [
        "Un syndrome des loges de la jambe",
        "Le syndrome des loges donne une tension douloureuse dans les muscles de la jambe, pas sur l'épicondyle latéral du genou."
      ]
    ],
    "cle": "Coureur ayant augmenté brusquement sa charge, douleur à l'**extérieur du genou** pire en descente, **tests de Noble et de Renne positifs** : c'est le **syndrome de l'essuie-glace**.",
    "orient": 1,
    "orientWhy": "Le diagnostic est clinique : le podologue corrige la biomécanique par semelles et adresse au médecin pour prescrire la kinésithérapie.",
    "tt": [
      [
        "Repos relatif (remplacer la course par natation ou vélo souple)",
        1
      ],
      [
        "Étirer la bandelette ilio-tibiale et renforcer hanches et cuisses",
        1
      ],
      [
        "Semelles orthopédiques pour corriger la pronation et la statique",
        1
      ],
      [
        "Glaçage local et renouveler les chaussures de course usées",
        1
      ],
      [
        "Courir uniquement en descente sur bitume pour habituer le tendon",
        0
      ],
      [
        "Opérer d'emblée pour sectionner la bandelette ilio-tibiale",
        0
      ]
    ],
    "conseil": {
      "q": "J'ai besoin de passer une IRM tout de suite pour être sûr que c'est ça ?",
      "ok": "Non, le diagnostic est avant tout clinique grâce à l'examen du genou : l'imagerie est en général inutile en première intention.",
      "ko": [
        "Oui, on ne peut jamais commencer les étirements ni les semelles sans une IRM en urgence.",
        "Il faut d'abord faire une arthroscopie du genou au bloc opératoire."
      ]
    }
  },
  "syndrome-loges": {
    "id": "syndrome-loges",
    "nom": "Lucas",
    "age": 24,
    "sexe": "m",
    "qui": "footballeur en club régional, 3 entraînements et un match par semaine",
    "motif": "À chaque entraînement, j'ai les deux jambes qui durcissent et me font mal à devoir m'arrêter.",
    "ask": [
      [
        "Au bout de combien de temps la douleur apparaît-elle ?",
        "C'est réglé comme une horloge : au bout de 15 minutes de course, toujours à la même distance, dans les deux jambes.",
        1
      ],
      [
        "Que ressentez-vous exactement et où ?",
        "Sur le devant et le côté des tibias : ça serre, ça fait comme une crampe énorme qui m'oblige à stopper net.",
        1
      ],
      [
        "Que se passe-t-il quand vous vous arrêtez de courir ?",
        "Dès que je m'arrête au repos, la tension redescend vite en une vingtaine de minutes, même si ça reste sensible.",
        1
      ],
      [
        "Avez-vous mal au repos le matin dans le lit ?",
        "Non, au réveil je n'ai absolument aucune douleur.",
        0
      ],
      [
        "Avez-vous reçu un coup de crampon direct sur l'os ?",
        "Non, aucun choc et c'est pareil des deux côtés.",
        0
      ],
      [
        "Fumez-vous deux paquets par jour depuis 30 ans ?",
        "Non, je ne fume pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Observer et palper les loges antéro-latérales après effort sur tapis",
        "Masses musculaires volumineuses ; après 15 min de course, loges antéro-latérales dures, tendues et sensibles, avec petite hernie.",
        1,
        0
      ],
      [
        "Examen de la statique et de la foulée",
        "Pieds plats valgus avec hyperpronation bilatérale qui sollicite fortement les releveurs de la loge antérieure.",
        1,
        0
      ],
      [
        "Prendre les pouls du pied (pédieux et tibial postérieur)",
        "Pouls bien perçus avant et après l'effort, ce qui écarte une artériopathie oblitérante.",
        1,
        36
      ],
      [
        "Palper le bord postéro-médial de la crête tibiale au repos",
        "L'os tibial lui-même est indolore au repos (pas de point exquis de fracture).",
        0,
        0
      ],
      [
        "Signe de Thompson",
        "Normal des deux côtés.",
        0,
        25
      ]
    ],
    "dx": "Un syndrome des loges chronique d'effort (loge antéro-latérale)",
    "ddx": [
      [
        "Une fracture de fatigue du tibia",
        "La fracture de fatigue est souvent unilatérale et la douleur osseuse persiste à la marche quotidienne et à la palpation de l'os au repos."
      ],
      [
        "Une périostite tibiale",
        "Elle fait mal sur le bord interne de l'os tibial dès le début ou à la palpation osseuse, sans loge musculaire indurée ni hernie."
      ],
      [
        "Une artériopathie oblitérante des membres inférieurs (AOMI)",
        "Elle touche le sujet artériopathe avec abolition des pouls distaux, alors qu'ici les pouls sont normaux chez un jeune sportif."
      ]
    ],
    "cle": "Douleur **bilatérale de la loge antéro-latérale** chez un sportif musclé, **reproductible à distance constante**, obligeant à l'arrêt et calmée au repos : **syndrome des loges chronique**.",
    "orient": 1,
    "orientWhy": "On propose la prise en charge podologique et on adresse au médecin du sport pour la mesure des pressions intramusculaires avant/après effort et l'écho-Doppler.",
    "tt": [
      [
        "Adresser pour mesure des pressions des loges avant et après effort",
        1
      ],
      [
        "Semelles corrigeant l'hyperpronation et répartissant les appuis",
        1
      ],
      [
        "Étirements du complexe suro-achilléo-plantaire, massage et cryo",
        1
      ],
      [
        "Adapter l'entraînement et vérifier les chaussures de course",
        1
      ],
      [
        "Faire du renforcement excentrique intensif de la loge antérieure",
        0
      ],
      [
        "Inciser l'aponévrose de la jambe au cabinet de podologie",
        0
      ]
    ],
    "conseil": {
      "q": "Si les semelles et la kiné ne suffisent pas pour rejouer au foot, quelle est la solution ?",
      "ok": "Si la gêne persiste malgré le conservateur, le gold standard est la chirurgie qui décomprime la loge (sport à 4-6 mois).",
      "ko": [
        "Il faut serrer tes jambes avec des bandes élastiques très serrées pendant les matchs.",
        "Il faut faire beaucoup de musculation excentrique pour faire grossir encore plus le muscle dans sa loge."
      ]
    }
  },
  "syndrome-2e-rayon": {
    "id": "syndrome-2e-rayon",
    "nom": "Marc",
    "age": 51,
    "sexe": "m",
    "qui": "cadre commercial, court deux fois par semaine",
    "motif": "J'ai mal juste à la base de mon deuxième orteil droit quand je marche et quand je cours.",
    "ask": [
      [
        "Où avez-vous mal exactement ?",
        "Pile sous l'articulation à la base du deuxième orteil, et le dessus de l'orteil frotte maintenant dans ma chaussure.",
        1
      ],
      [
        "La douleur est-elle calmée par le repos ?",
        "Oui, dès que je suis assis au repos ça se calme, et ça repart dès que je pousse sur l'avant-pied en marchant.",
        1
      ],
      [
        "Comment est la forme de vos orteils depuis toujours ?",
        "Mon deuxième orteil a toujours été plus long que le gros, et mon gros orteil dévie en dedans depuis quelques années.",
        1
      ],
      [
        "Avez-vous des décharges électriques qui vous réveillent la nuit ?",
        "Non, jamais la nuit et pas de fourmillements.",
        0
      ],
      [
        "Avez-vous mal derrière la malléole interne ?",
        "Non, ma cheville va très bien.",
        0
      ],
      [
        "Avez-vous eu une verrue à la piscine ?",
        "Non, je ne vais pas à la piscine.",
        0
      ]
    ],
    "exam": [
      [
        "Palper et mobiliser la 2e métatarso-phalangienne (MTP2)",
        "Douleur précise et léger gonflement de la MTP2 avec raideur en flexion et début d'orteil en marteau.",
        1,
        0
      ],
      [
        "Lachman de la 2e métatarso-phalangienne (tiroir vertical)",
        "Douleur et légère laxité dorsale de la MTP2 traduisant la surcharge de la plaque plantaire.",
        1,
        29
      ],
      [
        "Inspecter la peau et analyser les appuis à la marche",
        "Pied plat pronateur avec hallux valgus, 2e orteil long, durillon sous la tête de M2 et petit cor dorsal sur l'orteil.",
        1,
        0
      ],
      [
        "Signe de Mulder dans le 3e espace (M3-M4)",
        "Négatif : aucune douleur ni clic entre les 3e et 4e têtes métatarsiennes.",
        0,
        30
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur normaux.",
        0,
        36
      ]
    ],
    "dx": "Un syndrome du 2e rayon (surcharge de la 2e métatarso-phalangienne)",
    "ddx": [
      [
        "Un névrome de Morton (3e espace)",
        "Le Morton siège entre les têtes métatarsiennes (souvent M3-M4) avec des décharges nerveuses, pas sur l'articulation MTP2 avec griffe d'orteil."
      ],
      [
        "Une crise de goutte aiguë",
        "La goutte donne une arthrite aiguë rouge vif et insomniante, le plus souvent sur le gros orteil (MTP1)."
      ],
      [
        "Une verrue plantaire",
        "On observe un durillon d'hyper-appui sous M2 et un début d'orteil en marteau, sans lésion virale à points noirs."
      ]
    ],
    "cle": "2e orteil long + hallux valgus, douleur mécanique et gonflement à la **base du 2e orteil (MTP2)** avec **Lachman de la MTP sensible** et début de marteau : c'est un **syndrome du 2e rayon**.",
    "orient": 1,
    "orientWhy": "Le podologue réalise les soins et les orthèses sur mesure, et adresse au médecin si une radiographie ou une IRM est nécessaire.",
    "tt": [
      [
        "Orthèses sur mesure redistribuant les pressions de l'avant-pied",
        1
      ],
      [
        "Repos sportif relatif (remplacer la course par vélo ou natation)",
        1
      ],
      [
        "Conseiller des chaussures larges, confortables et bien amorties",
        1
      ],
      [
        "Étirer et renforcer les muscles du pied, massages et chaleur douce",
        1
      ],
      [
        "Surcharger la 2e tête métatarsienne avec un élément dur dessous",
        0
      ],
      [
        "Porter des chaussures étroites à bout pointu pour tenir l'orteil",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi c'est mon deuxième orteil qui trinque alors que c'est mon gros orteil qui est dévié ?",
      "ok": "Avec l'hallux valgus et ton 2e orteil long, ce rayon encaisse trop de pression à la propulsion : la semelle répartit la charge.",
      "ko": [
        "Aucun rapport avec la marche : c'est un microbe qui attaque uniquement le deuxième orteil.",
        "Il faut continuer à courir sur route dure tous les jours pour redresser l'orteil."
      ]
    }
  },
  "sinus-tarse": {
    "id": "sinus-tarse",
    "nom": "Antoine",
    "age": 27,
    "sexe": "m",
    "qui": "joueur de basket-ball amateur, 3 séances par semaine en salle",
    "motif": "J'ai une douleur sur le côté extérieur du pied droit, juste devant la cheville, surtout quand je prends appui.",
    "ask": [
      [
        "Avez-vous eu une entorse ou un traumatisme sur cette cheville ?",
        "Oui, une grosse entorse il y a quatre mois que je n'ai jamais vraiment rééduquée, j'ai repris le basket tout de suite.",
        1
      ],
      [
        "Quels mouvements ou situations augmentent la douleur ?",
        "Quand je cours, que je saute sur le parquet dur, au moment de pousser sur le pied ou sur un sol pas plat.",
        1
      ],
      [
        "La douleur vous gêne-t-elle aussi au repos ?",
        "Après un gros match, elle reste présente au repos le soir et même parfois la nuit.",
        1
      ],
      [
        "Avez-vous mal dans le bas du dos ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Avez-vous un ongle incarné qui suppure ?",
        "Non, mes ongles sont normaux.",
        0
      ],
      [
        "Avez-vous des crampes dans les deux mollets à l'effort ?",
        "Non, uniquement cette douleur devant la malléole externe.",
        0
      ]
    ],
    "exam": [
      [
        "Palper directement le creux du sinus du tarse (devant la malléole latérale)",
        "Signe clé : douleur très vive et bien localisée dans l'orifice du sinus du tarse avec un léger gonflement.",
        1,
        0
      ],
      [
        "Mobilisation de la sous-talienne en pronation-supination",
        "Les mouvements passifs de pronation-supination de l'arrière-pied réveillent nettement la douleur du sinus.",
        1,
        28
      ],
      [
        "Tester la flexion dorsale de cheville et observer l'appui",
        "Raideur douloureuse en flexion dorsale (cheville au mur limitée) et pied plat avec hyperpronation marquée.",
        1,
        27
      ],
      [
        "Signes de Tinel et de Phalen au canal tarsien (côté médial)",
        "Négatifs, aucune douleur ni décharge derrière la malléole interne.",
        0,
        32
      ],
      [
        "Signe de Mulder",
        "Négatif à l'avant-pied.",
        0,
        30
      ]
    ],
    "dx": "Un syndrome du sinus du tarse",
    "ddx": [
      [
        "Un syndrome du canal tarsien",
        "Le canal tarsien siège du côté interne derrière la malléole médiale avec des fourmillements plantaires, pas dans le creux externe devant la malléole."
      ],
      [
        "Un conflit du carrefour postérieur",
        "Le carrefour postérieur fait mal à l'arrière de la cheville en flexion plantaire forcée, pas devant la malléole externe dans le sinus."
      ],
      [
        "Une rupture du tendon d'Achille",
        "Le tendon d'Achille est intact et la douleur ne siège pas à l'arrière du talon."
      ]
    ],
    "cle": "Antécédent d'entorse et hyperpronation, **douleur vive à la palpation du sinus du tarse** (devant la malléole externe) et à la **mobilisation sous-talienne** : **syndrome du sinus du tarse**.",
    "orient": 1,
    "orientWhy": "On confectionne des orthèses plantaires sur mesure et on adresse au médecin pour la kinésithérapie proprioceptive (et une IRM si la douleur persiste).",
    "tt": [
      [
        "Repos sportif (arrêter temporairement la course et les sauts)",
        1
      ],
      [
        "Orthèses plantaires sur mesure pour corriger l'hyperpronation",
        1
      ],
      [
        "Glaçage et kinésithérapie (mobilité, renforcement, proprioception)",
        1
      ],
      [
        "Conseiller des chaussures de sport ajustées avec bon soutien",
        1
      ],
      [
        "Reprendre immédiatement les sauts sur sol dur pieds nus",
        0
      ],
      [
        "Opérer le sinus du tarse au cabinet de podologie",
        0
      ]
    ],
    "conseil": {
      "q": "Une simple radio de la cheville va permettre de voir l'inflammation dans mon sinus du tarse ?",
      "ok": "Non, la radio écarte seulement une fracture : pour voir l'inflammation des tissus mous du sinus, c'est l'IRM qui est utile.",
      "ko": [
        "Oui, les ligaments enflammés se voient très bien sur une radiographie standard.",
        "Aucun examen ni traitement n'existe, la douleur restera à vie."
      ]
    }
  },
  "synostoses": {
    "id": "synostoses",
    "nom": "Hugo",
    "age": 16,
    "sexe": "m",
    "qui": "lycéen, vient avec sa mère pour un pied raide et douloureux",
    "motif": "J'ai mal au milieu du pied gauche dès que je marche longtemps ou que je fais du sport au lycée, et je boite.",
    "ask": [
      [
        "Y a-t-il eu une fracture ou un problème particulier à ce pied ?",
        "Sa mère : Il s'était fracturé le tarse à 12 ans à vélo, et son père a aussi deux os soudés au pied de naissance.",
        1
      ],
      [
        "As-tu l'impression que ton pied ou tes orteils bougent moins bien ?",
        "Hugo : Oui, mon pied gauche est super raide, il ne s'adapte pas du tout quand je marche sur les cailloux.",
        1
      ],
      [
        "Ton médecin a-t-il déjà fait passer une radiographie ?",
        "Sa mère : Oui, la radio montre que deux os du tarse sont soudés ensemble par un pont osseux.",
        1
      ],
      [
        "As-tu de la fièvre ou une plaie qui coule sous le pied ?",
        "Hugo : Non, pas du tout.",
        0
      ],
      [
        "Vas-tu souvent marcher pieds nus à la piscine ?",
        "Hugo : Non, je ne fais pas de natation.",
        0
      ],
      [
        "As-tu des brûlures qui te réveillent la nuit dans les orteils ?",
        "Hugo : Non, quand je suis couché je n'ai pas mal.",
        0
      ]
    ],
    "exam": [
      [
        "Mobiliser la sous-talienne et le médio-tarse",
        "Perte quasi complète de mobilité entre les deux os concernés : l'articulation est bloquée et douloureuse quand on la sollicite.",
        1,
        28
      ],
      [
        "Observer la marche et l'attitude du pied en charge",
        "Marche difficile avec boiterie d'esquive et raideur de l'arrière-pied qui ne s'adapte plus au sol.",
        1,
        0
      ],
      [
        "Palper l'interligne articulaire soudé et les tendons voisins",
        "Douleur locale sur les bords de la zone soudée et sensibilité des tendons fibulaires et tibiaux voisins trop contraints.",
        1,
        31
      ],
      [
        "Signe de Thompson",
        "Normal : le tendon d'Achille est continu.",
        0,
        25
      ],
      [
        "Monofilament 10 g",
        "Sensibilité plantaire normale.",
        0,
        33
      ]
    ],
    "dx": "Une synostose du tarse (fusion anormale de deux os)",
    "ddx": [
      [
        "Une entorse bénigne récente de cheville",
        "Une simple entorse ne donne pas un blocage articulaire permanent ni un pont osseux entre deux os à la radiographie."
      ],
      [
        "Une tendinopathie isolée d'Achille",
        "Le tendon d'Achille est souple et indolore, alors que l'articulation du tarse est bloquée."
      ],
      [
        "Un syndrome de Morton",
        "Le Morton touche l'espace entre les têtes métatarsiennes à l'avant-pied, sans raideur ni fusion osseuse du tarse."
      ]
    ],
    "cle": "Antécédent de fracture et terrain familial, **articulation bloquée** avec boiterie, tendons voisins contraints et **fusion de deux os à la radiographie** : c'est une **synostose**.",
    "orient": 1,
    "orientWhy": "On réalise les orthèses plantaires de décharge et on adresse au médecin / chirurgien orthopédiste (scanner pour vue détaillée, avis chirurgical si gêne importante).",
    "tt": [
      [
        "Orthèses plantaires pour redistribuer les forces et soulager la zone",
        1
      ],
      [
        "Repos relatif en évitant de trop solliciter l'articulation bloquée",
        1
      ],
      [
        "Physiothérapie pour entretenir la mobilité des autres articulations",
        1
      ],
      [
        "Adresser à l'orthopédiste (scanner, chirurgie si gêne importante)",
        1
      ],
      [
        "Forcer violemment au cabinet pour casser le pont osseux",
        0
      ],
      [
        "Appliquer un kératolytique acide sur la cheville",
        0
      ]
    ],
    "conseil": {
      "q": "Pourquoi il a aussi mal aux tendons autour alors que ce sont deux os qui sont soudés ?",
      "ok": "Comme l'articulation soudée est bloquée, les articulations et les tendons voisins compensent à chaque pas et fatiguent.",
      "ko": [
        "C'est parce que la soudure osseuse est contagieuse et gagne les tendons.",
        "Les orthèses plantaires vont faire fondre l'os soudé en quinze jours."
      ]
    }
  },
  "talalgies": {
    "id": "talalgies",
    "nom": "Nadia",
    "age": 49,
    "sexe": "f",
    "qui": "aide-soignante à l'hôpital, marche toute la journée avec des sabots plats",
    "motif": "J'ai une douleur très vive sous le talon droit, c'est devenu un calvaire de poser le pied.",
    "ask": [
      [
        "À quel moment de la journée la douleur est-elle la plus forte ?",
        "Le matin au réveil, aux tout premiers pas ! Après quelques minutes ça dérouille un peu, puis ça revient après ma garde.",
        1
      ],
      [
        "Où avez-vous mal exactement : sous le talon ou derrière sur le tendon ?",
        "Vraiment dessous, sous l'avant du talon, côté interne.",
        1
      ],
      [
        "Avez-vous pris du poids ou changé de chaussures de travail récemment ?",
        "Oui, j'ai pris 7 kilos cette année et mes sabots d'hôpital sont tout plats, sans aucun amorti.",
        1
      ],
      [
        "Avez-vous des fourmillements qui partent de la malléole la nuit ?",
        "Non, pas de fourmillements ni de douleur la nuit au lit.",
        0
      ],
      [
        "Avez-vous entendu un gros claquement derrière la cheville en courant ?",
        "Non, aucun claquement.",
        0
      ],
      [
        "Avez-vous une plaie ou une verrue sous le talon ?",
        "Non, la peau est tout à fait normale.",
        0
      ]
    ],
    "exam": [
      [
        "Palper le tubercule médial du calcanéum (insertion du fascia plantaire)",
        "Douleur exquise à la palpation sous le talon, pile sur l'insertion calcanéenne du fascia plantaire.",
        1,
        0
      ],
      [
        "Mettre le pied et l'hallux en extension dorsale passive",
        "La mise en tension du fascia plantaire par l'extension dorsale réveille nettement la douleur sous le talon.",
        1,
        27
      ],
      [
        "Observer la statique du pied et de la marche",
        "Boiterie d'esquive, pied plat avec hyperpronation et raideur du tendon d'Achille.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal : pas de rupture du tendon d'Achille.",
        0,
        25
      ],
      [
        "Signes de Tinel et de Phalen au canal tarsien",
        "Négatifs : pas d'atteinte du nerf tibial postérieur.",
        0,
        32
      ]
    ],
    "dx": "Une talalgie mécanique par fasciite plantaire",
    "ddx": [
      [
        "Une tendinopathie d'Achille",
        "L'Achille fait mal à l'arrière du talon sur le corps ou l'insertion du tendon, pas sous le calcanéum à l'extension du fascia."
      ],
      [
        "Un syndrome du canal tarsien",
        "Il donne des brûlures et des picotements nocturnes irradiant dans la plante avec un signe de Tinel positif."
      ],
      [
        "Une maladie de Haglund",
        "C'est une bosse osseuse postéro-supérieure du calcanéum qui frotte contre le contrefort de la chaussure derrière le talon."
      ]
    ],
    "cle": "Douleur sous le talon **maximale aux premiers pas du matin**, réveillée par la palpation de l'insertion et l'**extension dorsale du pied** : c'est une **talalgie par fasciite plantaire** (cause n° 1).",
    "orient": 1,
    "orientWhy": "On réalise les orthèses plantaires sur mesure et on coordonne avec le médecin pour la physiothérapie (étirements Achille/fascia) et l'imagerie si besoin.",
    "tt": [
      [
        "Orthèses plantaires corrigeant la pronation et soulageant le talon",
        1
      ],
      [
        "Stretching et physio du fascia plantaire et du tendon d'Achille",
        1
      ],
      [
        "Repos relatif, glaçage local et chaussures bien ajustées avec soutien",
        1
      ],
      [
        "Adresser au médecin si besoin d'AINS ou d'imagerie (écho, radio)",
        1
      ],
      [
        "Opérer d'emblée pour sectionner le fascia plantaire",
        0
      ],
      [
        "Conseiller de marcher pieds nus sur le carrelage dur toute la journée",
        0
      ]
    ],
    "conseil": {
      "q": "Ça va partir en trois jours dès que je mettrai mes semelles ?",
      "ok": "Le pronostic est très bon avec semelles, étirements et bonnes chaussures, mais la guérison prend souvent plusieurs semaines.",
      "ko": [
        "Oui, en 48 heures la fasciite disparaît toujours définitivement sans faire d'étirements.",
        "Non, une douleur du talon ne guérit jamais sans opération chirurgicale."
      ]
    }
  },
  "talonnade": {
    "id": "talonnade",
    "nom": "Gérard",
    "age": 62,
    "sexe": "m",
    "qui": "jeune retraité en surpoids, marche beaucoup en randonnée avec de vieilles chaussures",
    "motif": "J'ai mal sous le talon gauche dès que je me lève et que je marche en randonnée.",
    "ask": [
      [
        "Quand la douleur est-elle la plus vive ?",
        "Au réveil ou après être resté assis longtemps ; ça diminue un peu en bougeant puis ça repart dès que je marche.",
        1
      ],
      [
        "Votre médecin a-t-il fait passer une radiographie du talon ?",
        "Oui, on voit une petite pointe osseuse sous l'os du talon, une épine calcanéenne, et aucune fracture.",
        1
      ],
      [
        "Quel type de chaussures portez-vous pour marcher ?",
        "De vieilles chaussures plates à semelle toute fine, sans aucun maintien ni amorti sous le talon.",
        1
      ],
      [
        "Avez-vous eu une plaie ouverte ou de la fièvre ?",
        "Non, aucune plaie et pas de fièvre.",
        0
      ],
      [
        "Avez-vous mal à l'extérieur du genou en descendant les côtes ?",
        "Non, mes genoux vont bien.",
        0
      ],
      [
        "Sentez-vous un clic entre les 3e et 4e orteils ?",
        "Non, je n'ai pas mal aux orteils.",
        0
      ]
    ],
    "exam": [
      [
        "Palper le dessous du calcanéum et l'insertion plantaire",
        "Douleur nette sous le calcanéum en regard de l'insertion du fascia et de l'épine calcanéenne.",
        1,
        0
      ],
      [
        "Mettre le pied en extension dorsale passive",
        "L'extension dorsale met en tension le fascia plantaire et réveille la douleur plantaire du talon.",
        1,
        27
      ],
      [
        "Observer la statique du pied et la démarche",
        "Surpoids, pied plat avec hyperpronation et boiterie d'esquive à la mise en charge sur le talon gauche.",
        1,
        0
      ],
      [
        "Signe de Thompson",
        "Normal : le tendon d'Achille est intègre.",
        0,
        25
      ],
      [
        "Prendre les pouls du pied",
        "Pouls pédieux et tibial postérieur bien perçus.",
        0,
        36
      ]
    ],
    "dx": "Une talonnade (calcanéodynie) sur fasciite et épine calcanéenne",
    "ddx": [
      [
        "Une rupture du tendon d'Achille",
        "Le signe de Thompson est normal et la douleur siège sous le calcanéum, pas sur une encoche du tendon d'Achille."
      ],
      [
        "Une fracture de fatigue du calcanéum",
        "La radiographie a écarté une fracture et la douleur est maximale aux premiers pas après le repos."
      ],
      [
        "Un syndrome du canal tarsien",
        "Il n'y a ni brûlure neuropathique nocturne ni irradiation dans les orteils."
      ]
    ],
    "cle": "Sujet de 62 ans en surpoids, pied plat et chaussures sans soutien, douleur sous le calcanéum **pire au réveil et à la charge** avec **épine calcanéenne** : **talonnade (calcanéodynie)**.",
    "orient": 1,
    "orientWhy": "Prise en charge podologique par orthèses sur mesure et coordination avec le médecin / kinésithérapeute pour la physiothérapie et les étirements.",
    "tt": [
      [
        "Orthèses plantaires sur mesure soulageant le talon et l'alignement",
        1
      ],
      [
        "Repos relatif avec pauses régulières lors de la marche",
        1
      ],
      [
        "Physiothérapie et étirements réguliers du fascia et du mollet",
        1
      ],
      [
        "Glaçage local et chaussures avec bon soutien et amorti",
        1
      ],
      [
        "Meuler l'épine calcanéenne en urgence au cabinet",
        0
      ],
      [
        "Marcher pieds nus sur les cailloux pour casser l'épine",
        0
      ]
    ],
    "conseil": {
      "q": "Il faut m'opérer pour raboter cette épine sous le talon ?",
      "ok": "Non, l'épine vient de la traction mécanique : semelles, repos et étirements suffisent à guérir l'inflammation sans opérer l'os.",
      "ko": [
        "Oui, tant que l'épine est visible à la radio il est impossible de marcher sans opération.",
        "Il suffit de taper fort sous le talon avec un maillet pour briser l'épine."
      ]
    }
  },
  "tendinites": {
    "id": "tendinites",
    "nom": "Élodie",
    "age": 35,
    "sexe": "f",
    "qui": "joueuse de tennis en club, a repris les tournois intensifs il y a un mois",
    "motif": "J'ai une douleur aiguë sur le côté interne de la cheville gauche qui tire jusque sous l'arche du pied.",
    "ask": [
      [
        "Comment la douleur a-t-elle commencé ?",
        "J'ai enchaîné quatre matchs de tennis en deux semaines sans préparation physique et avec mes vieilles chaussures.",
        1
      ],
      [
        "Comment évolue la douleur dans la journée ?",
        "C'est plus raide et douloureux au réveil, mieux en s'échauffant, puis ça chauffe et lance fort pendant et après le tennis.",
        1
      ],
      [
        "Avez-vous senti ou entendu quelque chose en bougeant le pied ?",
        "Oui, ça a un peu gonflé le long du tendon et je sens comme un petit crissement quand je bouge la cheville.",
        1
      ],
      [
        "Avez-vous des fourmillements la nuit sous la plante du pied ?",
        "Non, pas de décharges électriques ni de fourmillements.",
        0
      ],
      [
        "Avez-vous eu de la fièvre ?",
        "Non, pas du tout.",
        0
      ],
      [
        "Avez-vous mal sous le 2e orteil ?",
        "Non, mes orteils n'ont rien.",
        0
      ]
    ],
    "exam": [
      [
        "Triade de la tendinopathie sur le tendon tibial postérieur",
        "Triade positive : douleur vive à la palpation du tendon, à son étirement en éversion et à l'inversion contrariée du pied.",
        1,
        31
      ],
      [
        "Inspecter et palper le trajet du tendon à la cheville",
        "Léger gonflement, chaleur locale et fine crépitation au mouvement sur le trajet du tendon.",
        1,
        0
      ],
      [
        "Bilan biomécanique du pied en charge",
        "Pied plat valgus prononcé qui surcharge le tendon tibial postérieur à chaque changement d'appui.",
        1,
        0
      ],
      [
        "Signes de Tinel et de Phalen au canal tarsien",
        "Négatifs : pas de décharge neuropathique à la percussion du nerf tibial.",
        0,
        32
      ],
      [
        "Tiroir antérieur de cheville",
        "Normal : pas de laxité ligamentaire externe.",
        0,
        21
      ]
    ],
    "dx": "Une tendinite aiguë (tendinopathie du tibial postérieur)",
    "ddx": [
      [
        "Un syndrome du canal tarsien",
        "Le canal tarsien donne des fourmillements et brûlures neuropathiques avec Tinel positif, alors qu'ici la triade tendineuse est positive."
      ],
      [
        "Une entorse du ligament collatéral latéral",
        "Elle siège du côté externe après une torsion aiguë, pas sur le tendon interne après surcharge répétée."
      ],
      [
        "Une fracture malléolaire",
        "Il n'y a eu aucun choc direct et la douleur suit exactement le corps du tendon avec crépitation."
      ]
    ],
    "cle": "Reprise brutale du tennis sur pied plat, douleur **pire au réveil et à l'effort**, gonflement, chaleur, **crépitation** et **triade tendineuse positive** : c'est une **tendinite**.",
    "orient": 1,
    "orientWhy": "On réalise les semelles pour corriger la cause biomécanique et on adresse au médecin pour la kinésithérapie (et une échographie si besoin).",
    "tt": [
      [
        "Repos sportif en réduisant les gestes qui sollicitent le tendon",
        1
      ],
      [
        "Glace, compression par bandage élastique et surélévation",
        1
      ],
      [
        "Semelles orthopédiques pour corriger le mauvais alignement (pied plat)",
        1
      ],
      [
        "Adresser en physiothérapie (renforcement progressif, étirements)",
        1
      ],
      [
        "Doubler les entraînements de tennis dès demain pour forcer dessus",
        0
      ],
      [
        "Prescrire une cure d'antibiotiques par voie orale",
        0
      ]
    ],
    "conseil": {
      "q": "Si je mets juste de la glace quelques jours, ça ne reviendra plus quand je rejouerai ?",
      "ok": "La glace calme l'inflammation, mais ça récidive si on ne règle pas la cause : semelles, bonnes chaussures, échauffement et kiné.",
      "ko": [
        "Oui, trois jours de glace suffisent à rendre le tendon indestructible sans rien changer d'autre.",
        "Une tendinite oblige à arrêter définitivement tout sport de raquette pour le reste de ta vie."
      ]
    }
  },
  "tendinopathie-achille": {
    "id": "tendinopathie-achille",
    "nom": "Thomas",
    "age": 41,
    "sexe": "m",
    "qui": "coureur à pied amateur, a augmenté brusquement ses séances de fractionné",
    "motif": "J'ai mal derrière le talon droit, un peu au-dessus de l'os, surtout le matin et quand je cours.",
    "ask": [
      [
        "Comment est votre cheville le matin au lever ?",
        "Elle est toute raide et douloureuse au réveil pendant quelques minutes, puis ça se déverrouille en marchant.",
        1
      ],
      [
        "Qu'est-ce qui réveille la douleur dans la journée ?",
        "La course, les escaliers ou monter sur la pointe du pied ; j'ai doublé mes séances de piste le mois dernier.",
        1
      ],
      [
        "Vos chaussures de running sont-elles récentes et vous échauffez-vous ?",
        "Non, mes chaussures sont très usées et je pars souvent courir à froid sans étirer mes mollets.",
        1
      ],
      [
        "Avez-vous entendu un claquement brutal comme un coup de fouet avec impossibilité de marcher ?",
        "Non, je peux toujours marcher et monter sur la pointe du pied, mais ça tire fort.",
        0
      ],
      [
        "Avez-vous mal sous l'avant-pied entre les orteils ?",
        "Non, uniquement sur le gros tendon derrière la cheville.",
        0
      ],
      [
        "Avez-vous de la fièvre ?",
        "Non, pas du tout.",
        0
      ]
    ],
    "exam": [
      [
        "Palper le corps du tendon d'Achille et faire la triade tendineuse",
        "Douleur nette et léger épaississement fusiforme à la palpation du milieu du tendon d'Achille, 4 cm au-dessus du calcanéum ; triade positive.",
        1,
        31
      ],
      [
        "Signe de Thompson (compression du mollet)",
        "Signe de Thompson normal (le pied part bien en flexion plantaire) : il n'y a pas de rupture complète du tendon.",
        1,
        25
      ],
      [
        "Tester la souplesse du mollet (Knee-to-wall) et observer l'appui",
        "Manque de flexion dorsale par raideur du triceps sural et pieds plats valgus.",
        1,
        27
      ],
      [
        "Palper l'insertion plantaire du fascia sous le calcanéum",
        "Le dessous du talon est totalement indolore.",
        0,
        0
      ],
      [
        "Signe de Mulder",
        "Négatif à l'avant-pied.",
        0,
        30
      ]
    ],
    "dx": "Une tendinopathie du tendon d'Achille",
    "ddx": [
      [
        "Une rupture totale du tendon d'Achille",
        "Dans la rupture totale, le coup de fouet est brutal, l'appui sur la pointe est impossible et le signe de Thompson est positif."
      ],
      [
        "Une fasciite plantaire",
        "La fasciite fait mal sous le talon à l'insertion du fascia, pas à 4 cm au-dessus du calcanéum sur le corps du tendon d'Achille."
      ],
      [
        "Un syndrome du canal tarsien",
        "Il donne des brûlures et fourmillements sous le pied par compression nerveuse médiale, pas un épaississement du tendon d'Achille."
      ]
    ],
    "cle": "Coureur de plus de 30 ans après hausse brutale, **raideur matinale**, douleur et gonflement au **milieu du tendon d'Achille** avec **Thompson normal** : **tendinopathie d'Achille**.",
    "orient": 1,
    "orientWhy": "On réalise les semelles de correction biomécanique et on adresse au médecin pour prescrire la kinésithérapie (renforcement excentrique) et une échographie.",
    "tt": [
      [
        "Repos sportif relatif, glaçage, compression et élévation",
        1
      ],
      [
        "Kinésithérapie fondamentale avec travail de renforcement excentrique",
        1
      ],
      [
        "Semelles orthopédiques corrigeant le pied plat et soulageant l'Achille",
        1
      ],
      [
        "Conseiller des chaussures en bon état et un échauffement progressif",
        1
      ],
      [
        "Continuer le fractionné intensif malgré la douleur au risque de rompre",
        0
      ],
      [
        "Suturer chirurgicalement le tendon au cabinet de podologie",
        0
      ]
    ],
    "conseil": {
      "q": "Si je continue à forcer dessus sans repos ni rééducation, qu'est-ce que je risque ?",
      "ok": "Sans repos, la tendinite évolue en tendinose : le collagène dégénère et le tendon fragilisé risque de se rompre.",
      "ko": [
        "Tu ne risques rien, plus un tendon d'Achille fait mal plus il devient solide.",
        "Le renforcement excentrique chez le kiné est formellement interdit pour le tendon d'Achille."
      ]
    }
  }
};
