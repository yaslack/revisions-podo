# Reprise des illustrations de fiches

Objectif demandé : plusieurs illustrations personnalisées par partie, selon les notions du cours, dans le style de la référence en papier découpé. Les scènes génériques ne suffisent pas.

Avancement sauvegardé : 20/64 fiches, 316 illustrations intégrées.

Fiches prêtes : verrues, onychomycoses, antifongiques, hematome, ains, antiseptiques, mycoses, hyperkeratoses, phlyctenes, mpp, genou, attitudes-scoliotiques, carrefour-posterieur, bursite-icm, morton, essuie-glace, syndrome-loges, sinus-tarse, synostoses, talonnade

Fiches restantes : aomi, phlebite, varices, erysipele, eczema, psoriasis, dyshidrose, sudoraux, raynaud, gelures, onychodys, dyschromies, smp, tumeurs, chaussures-enfant, chaussures-securite, coxarthrose, cycle-marche, deformations-orteils, entorses-cheville, fractures-fatigue, genu-valgum-varum, gonarthrose, hallux-rigidus, hallux-valgus, ilm, insuffisance-1er-rayon, kyste-poplite, haglund, sever-osgood, map, naviculaire-accessoire, osteochondrose, periostite-tibiale, pied-bot, pied-creux, pied-plat, scoliose, canal-tarsien, patte-oie, syndrome-2e-rayon, talalgies, tendinites, tendinopathie-achille

Les correspondances sont dans papercraft/notions/*.json ; les images dans jeu/theatre/notions/<fiche>/ ; les prompts dans papercraft/*-notions-prompts.txt.

Après récupération d’images générées : enregistrer les découpes et le manifeste de la fiche, puis exécuter node tools/build-paper-notions.js et node tools/check-paper-notions.js. Régénérer sw.js avec node tools/build-sw.js 130 avant livraison.

Aperçu : http://127.0.0.1:51862/ . Le script tools/preview-live.js actualise les textures et les nouveaux dessins uniquement en local, sans relancer les quiz.

Correction déjà faite : le bandeau corail de « Ce que je dis à l’oral » utilisait une découpe de 90 px sur une image haute de 167 px, ce qui laissait une ligne vide. Il utilise désormais des découpes verticales de 45 px.
