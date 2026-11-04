#!/bin/bash
# Exporte les dessins des vidéos pour le site : illus/<fiche>/cover.webp + pNa.webp / pNb.webp (milieu et fin de chaque partie).
# usage: tools/export-illus.sh VIDEO_PLAN_DIR   (à lancer depuis la racine du site ; une vidéo à la fois)
set -u
V="$1"; SITE="$(pwd)"
for d in "$V"/episodes/[0-9][0-9]-*; do
  ep=$(basename "$d"); [ "$ep" = "00-plan" ] && continue
  id=$(node -e 'global.window={};require(process.argv[1]);const f=window.PEDI.find(x=>String(x.n).padStart(2,"0")===process.argv[2].slice(0,2));process.stdout.write(f?f.id+" "+f.parts.length:"")' "$SITE/data/pedi.js" "$ep")
  set -- $id; fid=$1; n=$2
  args="cover=s0@0.92"; for k in $(seq 1 $n); do args="$args p${k}a=s${k}@0.55 p${k}b=s${k}@0.97"; done
  (cd "$V" && pkill -f puppeteer_dev_chrome_profile; node render.mjs frames "$ep" "$SITE/illus/$fid" $args 2>&1 | grep -E 'wrote|rror|WATCHDOG' | sed "s/^/$ep: /")
done
echo "FIN"
