const oral = require('./src/oral.json');

// Le titre rattache chaque texte à sa partie si le plan de la vidéo est réordonné.
function oralText(id, title, narration) {
  return oral[id]?.[title] ?? narration;
}

module.exports = oralText;
