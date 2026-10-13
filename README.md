# Révisions Oral Pédicurie

Appli de révision pour l’oral de pédicurie-podologie et l’anatomie palpatoire du membre inférieur. S’installe sur l’écran d’accueil (Safari → Partager → « Sur l’écran d’accueil ») et fonctionne hors ligne. Au lancement, on choisit la matière : chaque matière a son accueil, ses fiches, ses cartes et son quiz.

**Pédicurie**
- 24 fiches illustrées (photos du livret ou schémas dessinés), phrase mémo, 5 points clés, plan détaillé en frise.
- Contenu aligné sur le **livret d’oral 2025** : le plan détaillé reprend tout le livret partie par partie, et chaque fiche contient le texte original du livret, mot pour mot (section « Livret »).
- **Mon oral** : 9 étapes dans l’ordre de l’oral (intro → conclusion), chacune en 3 niveaux : lire, texte à trous (mots cachés différents à chaque fois), de tête. Texte complet à lire ou écouter, récitation complète, oral blanc chronométré avec enregistrement de sa voix.
- **Écoute comme à l’oral** : la fiche est dite comme une vraie présentation (bonjour, plan, transitions, conclusion), avec un lecteur : pause, reprise, partie précédente / suivante, vitesse, choix de la voix. La position est retenue (carte « Reprendre l’écoute ») ; après une mise en veille, la lecture reprend à la phrase en cours.
- **Entraînement varié** : 12 exercices mélangés (récitation, mot à taper, vrai/faux piégé, partie du plan, intrus, question du jury, oral express). Une étape n’est maîtrisée à 100 % que retrouvée de tête sur au moins 3 jours différents.

**Anatomie**
- **Planches d’atlas réalistes** : 32 planches en couleur de l’atlas de Bourgery et Jacob (1831-1854, domaine public, BIU Santé Paris) pour les muscles, les os, les articulations, les nerfs et les vaisseaux, nettoyées et numérotées en français, avec leur version muette.
- 18 fiches rangées en 5 chapitres, avec des **planches haute définition** (muscles en relief avec fibres et tendons, os éclairés, nerfs et territoires sensitifs) et plusieurs vues par région (face, dos, profil, plans superficiel et profond). Les numéros et légendes restent nets à tous les zooms ; toucher une ligne de la légende allume le numéro sur le dessin :
  - **Os** : squelette, hanche (os coxal), cuisse (fémur, patella), jambe (tibia, fibula), pied ;
  - **Articulations** : hanche, genou, cheville, pied et voûte, toutes les amplitudes ;
  - **Muscles** : hanche, cuisse, jambe, pied ;
  - **Nerfs et vaisseaux** ; **Palpation et fonction** (parcours palpatoire, marche).
- 40 muscles en fiche d’identité (origine, terminaison, nerf, action, palpation) et un tableau récapitulatif.
- **Schéma qui suit la lecture** : dans « Muscles », « À palper » et « Le parcours », le schéma reste en haut de l’écran et zoome sur le muscle ou le repère que tu lis.
- Parcours palpatoire de la hanche au pied : position du sujet, comment trouver, comment vérifier.
- **Pratique** : examen pratique blanc chronométré, entraînement varié, 20 schémas muets à légender.

Cartes mémoire à répétition espacée (on peut glisser la carte : à droite si on savait, à gauche sinon) et quiz pour les deux matières. La progression reste sur le téléphone (2 copies : localStorage + IndexedDB) ; un code de sauvegarde permet de la copier ailleurs. Chaque personne a sa propre progression.

**Ma progression** : série de jours, objectif du jour réglable (15, 30, 50 ou 80 révisions), calendrier des 12 dernières semaines, révisions des 14 derniers jours, état des cartes, maîtrise par famille ou chapitre et sujets à travailler en priorité.

**Favoris** : une étoile sur chaque fiche ; les favoris s’affichent sur l’accueil et forment une série de cartes. Au quiz, « Refaire mes erreurs » rejoue les questions ratées.

**Affichage** (dans Matières) : thème automatique, clair ou sombre, texte normal ou grand, animations normales ou réduites.

**Voix de lecture** (dans Matières) : la meilleure voix française du téléphone est choisie d’office (Premium, puis Améliorée, puis Google ; les voix « robot » d’iOS sont écartées). On peut en choisir une autre, l’écouter, et un guide explique comment télécharger gratuitement une voix Améliorée ou Premium sur iPhone. Pour la **voix de Siri**, chaque fiche a un bouton « Lire avec Siri » : il ouvre le texte de l’oral seul à l’écran, que l’iPhone lit avec « Énoncer l’écran » (Apple ne donne pas les voix de Siri aux sites web).

**Design** : barre d’onglets en verre avec pastille qui glisse, transitions entre les pages, titres qui apparaissent mot par mot, chiffres qui défilent. Chaque matière a sa couleur (vert pour la pédicurie, ambre pour l’anatomie). Tout est désactivé si l’iPhone est réglé sur « Réduire les animations » ou si l’on choisit « Animations réduites ».
