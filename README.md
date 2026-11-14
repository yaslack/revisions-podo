# Révisions Oral Pédicurie

Site de révision de l’oral UEM de pédicurie-podologie, dans le style des vidéos explicatives (papier quadrillé, feutre, les 8 couleurs du plan). Il s’installe sur l’écran d’accueil (Safari → Partager → « Sur l’écran d’accueil ») et marche hors ligne.

**Pédicurie : 24 fiches**, chacune construite comme sa vidéo :
- la couverture dessinée, puis le plan : une carte par partie (8, ou 6 pour les plans adaptés), avec le dessin de la vidéo ;
- une partie par écran : les dessins de la vidéo (touche pour les agrandir), les points clés, « ce que je dis à l’oral » replié, et ← → pour passer à la partie suivante ; « Me tester » cache tout, on touche pour révéler ;
- la fiche en mots-clés, le quiz de 4 questions, les photos (livret et photos cliniques sous licence libre, avec leur auteur), et le texte du livret mot pour mot.

**Anatomie palpatoire : les 59 questions** de la liste d’oral, rangées par région (pied, jambe, cuisse avec la hanche et le bassin) puis en os et muscles. Pour chacune : la position du sujet, comment trouver la structure, comment vérifier, la fiche d’identité des muscles (origine, terminaison, innervation, action) et la planche de l’atlas avec son numéro entouré. « Je m’interroge » tire les repères pas encore sus.

**Pour apprendre** : un quiz par fiche (partie par partie, puis toute la fiche de mémoire), la séance du jour (date de l’oral, révisions espacées à 1, 3, 6, 12 et 25 jours, objectif, série de jours), le quiz 3D des 59 repères, le lexique (215 mots) et la recherche.

**Pour jouer** (en haut de l’accueil, tout est tiré des fiches, de `data/quiz.js`, de `data/cas.js`, des repères d’anatomie et des tests cliniques) :
- Apprendre une fiche : 3 manches sur une seule fiche, de la plus aidée à la moins aidée (lire une partie, la cacher, la redire avec les initiales ; les questions de `data/quiz.js` ; toute la fiche de mémoire). On dit la réponse avant de la voir, ce qui est raté revient en fin de manche. Une étoile par manche réussie à 80 % du premier coup ; la manche « De mémoire » met la fiche dans les révisions espacées.
- Le patient : 64 consultations en 5 étapes (le dossier qu'on dévoile après avoir cherché quoi demander et quoi examiner, diagnostic et pourquoi pas les autres, orientation, traitement, question du patient), puis la fiche en mots-clés à redire.
- Podo Quest (`aventure.js`) : un jeu d'aventure au tour par tour. Chaque monstre est une fiche, un repère d'anatomie ou un test clinique : on le reconnaît à ses signes, on l'attaque avec des défis (Question, Tri, Ordre, Trous) et surtout avec la carte Oral : dire une partie à voix haute, le micro du téléphone (dictée) retrouve les idées dites, sinon on coche soi-même ; les oublis s'affichent en rouge. Le coup de grâce d'une fiche, c'est dire son traitement. Une expédition = 3 monstres, un coffre, un boss ; le boss d'une fiche, c'est l'oral blanc : toute la fiche, partie par partie, dans l'ordre du plan. Les expéditions passent par tout le choix (`S.rpg.met`) avant de revenir aux mêmes ; un seul revenant (monstre raté) par expédition, jamais deux fois de suite. Les objets (`ITEMS`) sont de vrais instruments et soins du livret : on les garde si on sait à quoi ils servent. Niveaux, PV, bestiaire ; la progression est dans `S.rpg`. Musique « Podo Quest » dans `musique.js`.
- Qui suis-je ? : 4 indices progressifs (4, 3, 2, 1 pt) sur les fiches, les 59 repères d’anatomie et les 41 tests cliniques, en cherchant d’abord sans voir les 4 choix.
- Survie (questions à choix multiple, 3 vies, chrono qui raccourcit, record) et Les paires (60 secondes pour relier fiches et mots-clés, ou muscles et nerfs). Avant chaque partie on choisit ce qu’on révise ; le choix est gardé.

**Sons** : 4 musiques composées pour le site (`musique.js` : les notes et un petit synthé, aucun fichier audio) en plus des bruits de `sons.js`, et des sons d’interface (boutons, réponses, vie perdue, étoile, record, objectif du jour) qu’on peut couper dans la carte « Sons pour réviser ».

**Examen clinique** : les 41 tests du « Guide complet de l'Examen Clinique en Pédicurie-Podologie », en 7 sections ; pour chaque test un dessin (patient, mains du praticien, ce qui bouge), l'installation, les étapes, les chiffres, le résultat normal ou positif, et une vidéo YouTube pour 13 d'entre eux (choisies par piriforme.fr).

**Aussi** : le plan de l’oral en 8 questions, le tirage au sort (un sujet de pédicurie, ou 5 repères à palper), la progression gardée sur le téléphone, la vidéo de chaque fiche quand son lien Drive est renseigné dans `data/videos.js`.

## Fichiers

- `index.html`, `style.css`, `app.js` : le site ; `aventure.js` : le jeu Podo Quest (branché dans `app.js` par `window.AVENTURE`).
- `data/pedi.js`, `data/anat.js`, `data/anat3d.js` : le contenu, généré (ne pas éditer à la main) ; `data/quiz.js` : les questions des quiz de fiche (écrites à la main) ; `data/lexique.js` : le lexique ; `data/videos.js` : liens Drive des vidéos. `data/clinique.js` : les 41 tests (écrits à la main) ; `data/bilan.js` : le bilan du pied en 15 étapes ; `data/clinique-dessins.js` : les dessins en SVG des tests (CLIN_PIC) et du bilan (BILAN_PIC), même numéro.
- `vendor/three-mini.js`, `anat/jambe3d.bin` : le modèle 3D (BodyParts3D, © DBCLS, CC BY-SA 2.1 JP).
- Mise à jour : ajouter une entrée à `NOTES` dans `app.js` (fenêtre « Quoi de neuf ? »), changer `?v=` dans `index.html`, puis `node tools/build-sw.js N` et `version.json`.
- `illus/` : dessins tirés des vidéos ; `anat/` : planches ; `photos/` : photos ; `fonts/` : Permanent Marker et Caveat (licence OFL).
- `sw.js` : cache hors ligne, généré.

## Régénérer le contenu

Depuis la racine du site, avec le moteur des vidéos (`video-plan`) :

```
node tools/extract-videos.js VIDEO_PLAN > /tmp/raw.json      # textes à l’écran et narration de chaque partie
node tools/build-pedi.js /tmp/raw.json ANCIEN_INDEX.html      # data/pedi.js (+ texte et photos du livret)
node tools/build-anat.js ANCIEN_INDEX.html                    # data/anat.js (les 59 questions)
node tools/build-anat3d.js ANCIEN_INDEX.html                  # data/anat3d.js (cibles du quiz 3D)
tools/export-illus.sh VIDEO_PLAN                              # illus/ (dessins des vidéos)
node tools/build-sw.js VERSION && echo '{"v": "VERSION"}' > version.json
```

`ANCIEN_INDEX.html` est l’`index.html` de la version 32 (`git show a4ceada:index.html`) : il contient le texte du livret, les photos et les fiches d’anatomie d’origine.

## Podologie : ajouter une fiche quand sa vidéo est finie

Les 40 fiches sont dans `data/podo.js` (généré). Une fiche s'ouvre dès que son épisode `pNN-…` est extrait ; les autres sont « coming soon ». Les numéros sont ceux de la liste du livret et des vidéos, qui saute 8 et 9 (1 à 7, puis 10 à 42) ; un épisode va à sa fiche par les mots de son nom (`p10-fractures-fatigue` → `fractures-fatigue`), pas par son numéro.
1. Texte : `node tools/extract-videos.js VIDEO_PLAN '^p(0[1-7]|[123][0-9]|4[0-2])-' > raw.json` (mettre tous les épisodes dont la vidéo est finie, selon les MP4 du bureau), puis `node tools/build-podo.js raw.json tools/src/livret-podo.txt`.
2. Dessins, pris dans la vidéo finie (rien n'est relancé dans le projet vidéo) :
   `node tools/podo-frames.js VIDEO_PLAN p03-… | swift tools/grab-frames.swift "~/Desktop/Podologie/03 - ….mp4" illus/<id>`, puis relancer `build-podo.js`.
3. Quiz : ajouter `QUIZ['<id>']` en bas de `data/quiz.js` (une entrée par partie).
4. Vidéo : son identifiant Drive dans `data/videos.js`.
5. Nouvelle version : entrée dans `NOTES` (app.js), `?v=` dans `index.html`, `version.json`, `node tools/build-sw.js N`.
