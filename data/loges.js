// Les loges des muscles (écrites à la main) : pour chaque loge, ce qu'elle contient, ses parois, son nerf et son artère ;
// puis, pour chaque muscle des 59 questions (numéro de question), sa loge et, s'il y a lieu, son plan.
// Affichées dans la fiche de chaque muscle, dans la liste d'une région (muscles rangés par loge), au quiz 3D et dans Podo Quest.
var LOGES = window.LOGES = {
  glut: { reg: 'cuisse', n: 'Région glutéale (fessière)', c: 'Trois plans : superficiel (**grand fessier**, **TFL**), moyen (**moyen fessier**), profond (**petit fessier**, **piriforme**, obturateurs, jumeaux, carré fémoral)', murs: 'Derrière l\'os coxal et le sacrum, sous le fascia glutéal', nerf: 'N. glutéaux supérieur (moyen et petit fessiers, TFL) et inférieur (grand fessier) ; branches du plexus sacré (pelvi-trochantériens)', art: 'A. glutéales supérieure et inférieure' },
  iliaque: { reg: 'cuisse', n: 'Région iliaque (muscle du bassin)', c: '**Ilio-psoas** (iliaque + grand psoas) : de la fosse iliaque et des vertèbres lombales, il passe sous le ligament inguinal (lacune musculaire) pour finir sur le petit trochanter', murs: 'Dans la fosse iliaque, puis sous le ligament inguinal vers la cuisse', nerf: 'N. fémoral (iliaque) ; plexus lombal (psoas)', art: 'A. ilio-lombale, circonflexe iliaque profonde' },
  'cuisse-ant': { reg: 'cuisse', n: 'Loge antérieure de la cuisse', c: '**Quadriceps** (droit fémoral, vastes médial, latéral et intermédiaire) et **sartorius**', murs: 'Devant le fémur, séparée des loges médiale et postérieure par les septums intermusculaires médial et latéral', nerf: 'N. fémoral', art: 'A. fémorale' },
  'cuisse-med': { reg: 'cuisse', n: 'Loge médiale de la cuisse', c: 'Les **adducteurs** : pectiné, long, court et grand adducteurs, **gracile** (et obturateur externe)', murs: 'En dedans du fémur, entre la loge antérieure (septum intermusculaire médial) et la loge postérieure', nerf: 'N. obturateur (le grand adducteur aussi par le n. sciatique)', art: 'A. obturatrice, a. profonde de la cuisse' },
  'cuisse-post': { reg: 'cuisse', n: 'Loge postérieure de la cuisse', c: 'Les **ischio-jambiers** : biceps fémoral, semi-tendineux, semi-membraneux', murs: 'Derrière le fémur, séparée de la loge antérieure par le septum intermusculaire latéral', nerf: 'N. sciatique', art: 'A. perforantes (de l\'a. profonde de la cuisse)' },
  'jambe-ant': { reg: 'jambe', n: 'Loge antérieure de la jambe', c: '**Tibial antérieur**, **long extenseur de l\'hallux**, **long extenseur des orteils**, 3e fibulaire', murs: 'Entre le tibia, la membrane interosseuse, la fibula et le septum intermusculaire antérieur', nerf: 'N. fibulaire profond', art: 'A. tibiale antérieure' },
  'jambe-lat': { reg: 'jambe', n: 'Loge latérale (fibulaire) de la jambe', c: '**Long** et **court fibulaires**', murs: 'Contre la fibula, entre les septums intermusculaires antérieur et postérieur', nerf: 'N. fibulaire superficiel', art: 'Branches des a. fibulaire et tibiale antérieure' },
  'jambe-post-sup': { reg: 'jambe', n: 'Loge postérieure superficielle de la jambe', c: 'Le **triceps sural** (gastrocnémien + soléaire) et le plantaire', murs: 'Derrière la loge profonde, dont la sépare le fascia transverse profond', nerf: 'N. tibial', art: 'A. surales (de l\'a. poplitée)' },
  'jambe-post-prof': { reg: 'jambe', n: 'Loge postérieure profonde de la jambe', c: 'Poplité, **tibial postérieur**, **long fléchisseur des orteils**, **long fléchisseur de l\'hallux**', murs: 'Entre la membrane interosseuse (et les os) et le fascia transverse profond', nerf: 'N. tibial', art: 'A. tibiale postérieure, a. fibulaire' },
  'pied-dos': { reg: 'pied', n: 'Région dorsale du pied', c: '**Court extenseur des orteils** et **court extenseur de l\'hallux**, sous les tendons des longs extenseurs', murs: 'Sur le dos du tarse et des métatarsiens, sous le fascia dorsal du pied', nerf: 'N. fibulaire profond', art: 'A. dorsale du pied' },
  'pied-med': { reg: 'pied', n: 'Loge plantaire médiale', c: '**Abducteur de l\'hallux**, **court fléchisseur de l\'hallux** ; le tendon du long fléchisseur de l\'hallux', murs: 'Sous le 1er rayon, en dedans du septum plantaire médial', nerf: 'N. plantaire médial', art: 'A. plantaire médiale' },
  'pied-moy': { reg: 'pied', n: 'Loge plantaire moyenne (centrale)', c: '**Court fléchisseur des orteils**, carré plantaire, lombricaux, adducteur de l\'hallux ; les tendons du long fléchisseur des orteils', murs: 'Sous l\'aponévrose plantaire, entre les septums plantaires médial et latéral', nerf: 'N. plantaire médial (court fléchisseur des orteils, 1er lombrical) et n. plantaire latéral (les autres)', art: 'A. plantaire latérale' },
  'pied-lat': { reg: 'pied', n: 'Loge plantaire latérale', c: '**Abducteur du 5e orteil**, **court fléchisseur du 5e orteil**, opposant du 5e', murs: 'Sous le 5e rayon, en dehors du septum plantaire latéral', nerf: 'N. plantaire latéral', art: 'A. plantaire latérale' },
};
// numéro de la question → [loge, précision]
var LOGE_OF = window.LOGE_OF = {
  5: ['glut', 'plan moyen'], 6: ['glut', 'plan superficiel'], 9: ['glut', 'plan profond (pelvi-trochantérien)'], 15: ['glut', 'plan superficiel (il tend le fascia lata)'],
  10: ['iliaque', 'passe dans la cuisse sous le ligament inguinal'],
  11: ['cuisse-ant'], 12: ['cuisse-ant'], 25: ['cuisse-ant'], 26: ['cuisse-ant'],
  13: ['cuisse-med'], 14: ['cuisse-med'],
  8: ['cuisse-post'], 20: ['cuisse-post'], 21: ['cuisse-post'], 22: ['cuisse-post'],
  42: ['jambe-ant'], 43: ['jambe-ant'], 44: ['jambe-ant'],
  50: ['jambe-lat'], 51: ['jambe-lat'],
  23: ['jambe-post-sup'], 48: ['jambe-post-sup'],
  47: ['jambe-post-prof'], 52: ['jambe-post-prof'], 53: ['jambe-post-prof'],
  45: ['pied-dos'], 46: ['pied-dos'],
  55: ['pied-med'], 58: ['pied-med'],
  54: ['pied-moy'],
  56: ['pied-lat'], 57: ['pied-lat'],
};
