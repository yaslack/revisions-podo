#!/bin/zsh
# Compile Verrou Révision, l'installe dans ~/Applications et le lance à chaque ouverture de session.
set -e
cd "$(dirname "$0")"
APP=~/Applications/VerrouRevision.app
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
swiftc -O VerrouRevision.swift -o "$APP/Contents/MacOS/VerrouRevision"
R="$APP/Contents/Resources/site"; rm -rf "$APP/Contents/Resources"; mkdir -p "$R/mac" "$R/data"
cp -R ../fonts ../style.css ../musique.js "$R/"; cp verrou.html "$R/mac/"
cp ../data/quiz.js ../data/pedi.js ../data/podo.js ../data/anat.js ../data/loges.js "$R/data/"
cat > "$APP/Contents/Info.plist" <<P
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0"><dict>
<key>CFBundleIdentifier</key><string>fr.revisions-podo.verrou</string>
<key>CFBundleName</key><string>Verrou Révision</string>
<key>CFBundleExecutable</key><string>VerrouRevision</string>
<key>LSUIElement</key><true/>
</dict></plist>
P
PL=~/Library/LaunchAgents/fr.revisions-podo.verrou.plist
cat > "$PL" <<P
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0"><dict>
<key>Label</key><string>fr.revisions-podo.verrou</string>
<key>ProgramArguments</key><array><string>$APP/Contents/MacOS/VerrouRevision</string></array>
<key>RunAtLoad</key><true/>
<key>KeepAlive</key><true/>
</dict></plist>
P
launchctl bootout gui/$(id -u) "$PL" 2>/dev/null || true
launchctl bootstrap gui/$(id -u) "$PL"
echo "Installé : icône 🎓 en haut à droite."
