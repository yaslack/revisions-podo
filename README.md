# Révisions Oral Pédicurie

Site de révision de l’oral UEM de pédicurie-podologie, dans le style des vidéos explicatives (papier quadrillé, feutre, les 8 couleurs du plan). Il s’installe sur l’écran d’accueil (Safari → Partager → « Sur l’écran d’accueil ») et marche hors ligne.

**Pédicurie : 24 fiches**, chacune construite comme sa vidéo :
- la couverture dessinée, puis le plan : une carte par partie (8, ou 6 pour les plans adaptés), avec le dessin de la vidéo ;
- une partie par écran : les dessins de la vidéo (touche pour les agrandir), les points clés, « ce que je dis à l’oral » replié, et ← → pour passer à la partie suivante ; « Me tester » cache tout, on touche pour révéler ;
- la fiche en mots-clés, le quiz de 4 questions, les photos (livret et photos cliniques sous licence libre, avec leur auteur), et le texte du livret mot pour mot.

**Anatomie palpatoire : les 59 questions** de la liste d’oral, rangées par région (pied, jambe, cuisse avec la hanche et le bassin) puis en os et muscles. Pour chacune : la position du sujet, comment trouver la structure, comment vérifier, la fiche d’identité des muscles (origine, terminaison, innervation, action) et la planche de l’atlas avec son numéro entouré. « Je m’interroge » tire les repères pas encore sus.

**Pour apprendre** : un quiz par fiche (partie par partie, puis toute la fiche de mémoire), la séance du jour (date de l’oral, révisions espacées à 1, 3, 6, 12 et 25 jours, objectif, série de jours), le quiz 3D des 59 repères, le lexique (215 mots) et la recherche.

**Examen clinique** : les 41 tests du « Guide complet de l'Examen Clinique en Pédicurie-Podologie », en 7 sections ; pour chaque test un dessin (patient, mains du praticien, ce qui bouge), l'installation, les étapes, les chiffres, le résultat normal ou positif, et une vidéo YouTube pour 13 d'entre eux (choisies par piriforme.fr).

**Aussi** : le plan de l’oral en 8 questions, le tirage au sort (un sujet de pédicurie, ou 5 repères à palper), la progression gardée sur le téléphone, la vidéo de chaque fiche quand son lien Drive est renseigné dans `data/videos.js`.

## Fichiers

- `index.html`, `style.css`, `app.js` : le site.
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
