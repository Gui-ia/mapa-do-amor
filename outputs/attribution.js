'use strict';
(() => {
  const key = 'mapa:attribution:v1';
  const allowed = name => /^utm_[a-z0-9_]+$/i.test(name) || ['fbclid','gclid','gbraid','wbraid','ttclid','msclkid','src','sck'].includes(name);
  let params = new URLSearchParams();
  const incoming = new URLSearchParams(location.search);
  for (const [name, value] of incoming) if (allowed(name) && value) params.set(name, value);
  // An explicit new campaign replaces the previous one; direct navigation resumes it.
  if (!params.size) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(key));
      if (saved && Date.now() - saved.at < 86400000 && saved.at <= Date.now()) {
        for (const [name,value] of new URLSearchParams(saved.query)) if (allowed(name) && value) params.set(name,value);
      }
    } catch {}
  }
  try { sessionStorage.setItem(key, JSON.stringify({at: Date.now(), query: params.toString()})); } catch {}
  function url(target) {
    const destination = new URL(target, location.href);
    for (const [name, value] of params) {
      // Keep unrelated destination arguments and fragments intact.
      destination.searchParams.set(name, value);
    }
    return destination.href;
  }
  window.MAPA_ATTRIBUTION = Object.freeze({url});
  if (params.size) {
    try { history.replaceState(history.state, '', url(location.href)); } catch {}
  }
  // Real hrefs preserve attribution for regular clicks and opening a new tab.
  document.querySelectorAll('a[href]').forEach(link => {
    const raw = link.getAttribute('href');
    if (!raw || raw.startsWith('#')) return;
    const destination = new URL(raw, location.href);
    if (destination.origin === location.origin) link.href = url(destination.href);
  });
})();
