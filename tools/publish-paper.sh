#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
paper_id="$1"
paper_source="$2"
case "$paper_id" in *[!a-z0-9-]*|'') echo 'Identifiant de fiche invalide' >&2; exit 1;; esac
test "$(git branch --show-current)" = main
node tools/import-paper-atlas.cjs "papercraft/plans/$paper_id.json" "$paper_source"
node tools/release-paper.cjs
paper_version="$(node -p "JSON.parse(require('fs').readFileSync('version.json')).v")"
git add -- app.js index.html sw.js version.json data/paper-notions.js papercraft/ETAT-REPRISE.md papercraft/notions-index.json "papercraft/notions/$paper_id.json" "papercraft/plans/$paper_id.json" "papercraft/$paper_id-notions-prompts.txt" "jeu/theatre/notions/$paper_id" tools/build-paper-notions.js tools/publish-paper.sh
git commit --quiet -m "Illustre $paper_id en papier découpé (v$paper_version)"
git push --quiet origin main
paper_commit="$(git rev-parse HEAD)"
echo "Publication envoyée : $paper_id, v$paper_version, $paper_commit"
for paper_attempt in {1..30}; do
  paper_live="$(curl -fsSL --max-time 15 "https://yaslack.github.io/revisions-podo/version.json?verify=$paper_commit-$paper_attempt" 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log(JSON.parse(s).v)}catch{}})" || true)"
  if [[ "$paper_live" = "$paper_version" ]]; then
    curl -fsSL --max-time 15 -o /dev/null "https://yaslack.github.io/revisions-podo/jeu/theatre/notions/$paper_id/p1-1.webp?verify=$paper_commit"
    echo "EN LIGNE : $paper_id, version $paper_version"
    exit 0
  fi
  sleep 5
done
echo "Publication envoyée, propagation à vérifier : $paper_id v$paper_version" >&2
exit 2
