// Aperçu local uniquement : actualise les textures sans interrompre un quiz.
(() => {
  if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  let previousStyle = '', previousIndex = '';
  let polling = false;
  async function update() {
    if (polling || document.hidden) return;
    polling = true;
    try {
      const style = await fetch('papier.css', { cache: 'no-store' });
      if (style.ok) {
        const content = await style.text();
        if (content !== previousStyle) {
          previousStyle = content;
          const link = document.querySelector('link[href^="papier.css"]');
          if (link) link.href = 'papier.css?preview=' + Date.now();
        }
      }
      const response = await fetch('papercraft/notions-index.json', { cache: 'no-store' });
      if (response.ok) {
        const content = await response.text();
        if (content !== previousIndex) {
          previousIndex = content;
          const next = JSON.parse(content), old = window.PAPER_NOTIONS || {};
          const changed = Object.keys(next).filter(id => JSON.stringify(old[id]) !== JSON.stringify(next[id]));
          window.PAPER_NOTIONS = next;
          if (changed.length) window.dispatchEvent(new CustomEvent('paper-illustrations-update', { detail: changed }));
        }
      }
    } catch (_) { /* Le serveur peut être en cours de redémarrage. */ }
    finally { polling = false; }
  }
  update();
  setInterval(update, 3000);
})();
