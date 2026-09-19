'use strict';
// Separate from the first page's 30-second camera gate. No expiry on this grant.
(() => {
  const key = 'mapa-do-amor:offer:6a95925e03a5f237c68c83b9:480:v1';
  function restore() {
    try { if (localStorage.getItem(key) === '1') document.documentElement.classList.add('offer-unlocked'); } catch {}
  }
  function unlock() {
    document.documentElement.classList.add('offer-unlocked');
    try { localStorage.setItem(key, '1'); } catch {}
  }
  // Runs in the head, before styles/markup: returning visitors see the offer immediately.
  restore();
  window.addEventListener('pageshow', restore);
  window.addEventListener('storage', event => { if (event.key === key && event.newValue === '1') restore(); });
  window.MAPA_OFFER_ACCESS = Object.freeze({ unlock });
})();
