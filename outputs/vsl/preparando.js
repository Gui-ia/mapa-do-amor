'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const stateKey = 'mapa-vsl:preparation';
  let photoId = '', name = '', phase = 0, photoUrl = '', timer = 0, transitioning = false;
  function persist() {
    try {
      sessionStorage.setItem('mapa-vsl:first-name', name);
      sessionStorage.setItem(stateKey, JSON.stringify({ photoId, name, phase }));
      return true;
    } catch { return false; }
  }
  function progress(value) {
    $('step-percent').textContent = `${value}%`;
    $('reading-progress').setAttribute('aria-valuenow', String(value));
    $('reading-progress').firstElementChild.style.width = `${value}%`;
  }
  function steps(active) {
    document.querySelectorAll('.line-steps li').forEach((item, i) => {
      item.classList.toggle('active', i === active);
      item.classList.toggle('complete', i < active);
      item.querySelector('.step-marker').textContent = i < active ? '✓' : String(i + 1);
      if(i === active) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
    });
  }
  // This sequence presents the three themes; no image-analysis service is connected.
  function animate(index, from, to, done) {
    clearInterval(timer); steps(index); progress(from);
    $('step-status').textContent = ['Preparando a primeira etapa…','Preparando a segunda etapa…','Preparando a terceira etapa…'][index];
    let elapsed = 0, last = performance.now();
    timer = setInterval(() => {
      const now = performance.now();
      if (!document.hidden) elapsed += Math.min(now - last, 200);
      last = now;
      progress(Math.round(from + (to - from) * Math.min(elapsed / 2800, 1)));
      if(elapsed >= 2800) { clearInterval(timer); done(); }
    }, 100);
  }
  function askName() {
    phase = 1; persist(); steps(1); progress(33);
    $('step-status').textContent = 'Primeira etapa preparada';
    $('first-name').value = name;
    $('resume-name').hidden = true;
    if (!$('name-card').open) $('name-card').showModal();
    $('first-name').focus({preventScroll:true});
  }
  function finish() {
    phase = 4; persist(); steps(3); progress(100);
    $('step-status').textContent = 'Tudo pronto para continuar';
    $('completion-note').textContent = `${name}, vamos à sua leitura.`;
    $('completion-note').hidden = false;
    timer = setTimeout(() => location.replace(window.MAPA_ATTRIBUTION.url('oferta.html')), 1100);
  }
  function remaining() {
    if (phase !== 3) phase = 2;
    $('name-card').close();
    $('resume-name').hidden = true;
    if(phase === 3) animate(2, 66, 100, finish);
    else {
      phase = 2; persist();
      animate(1, 33, 66, () => {phase = 3; persist(); animate(2, 66, 100, finish);});
    }
  }
  $('resume-name').addEventListener('click', askName);
  $('name-card').addEventListener('close', () => {
    if (phase === 1) {
      $('resume-name').hidden = false;
      $('resume-name').focus();
    }
  });
  $('first-name').addEventListener('input', () => {
    $('name-error').hidden = true;
    $('first-name').removeAttribute('aria-invalid');
  });
  $('name-form').addEventListener('submit', event => {
    event.preventDefault();
    if(transitioning) return;
    name = $('first-name').value.trim().replace(/\s+/g,' ').slice(0,40);
    let message = '';
    if(!/\p{L}/u.test(name) || /[<>\p{Cc}]/u.test(name)) message = 'Digite seu primeiro nome para continuar.';
    else if(!persist()) message = 'Permita o armazenamento neste navegador para guardar seu nome e continuar.';
    $('name-error').textContent = message; $('name-error').hidden = !message;
    $('first-name').setAttribute('aria-invalid', String(!!message));
    if(message) { $('first-name').focus(); return; }
    transitioning = true;
    remaining();
  });
  async function init() {
    let saved;
    try {
      photoId = sessionStorage.getItem('mapa-vsl:photo-id') || '';
      name = (sessionStorage.getItem('mapa-vsl:first-name') || '').trim().slice(0,40);
      saved = JSON.parse(sessionStorage.getItem(stateKey) || 'null');
    } catch {}
    const blob = photoId ? await window.MAPA_SESSION.getPhoto(photoId) : null;
    if(!blob) { location.replace(window.MAPA_ATTRIBUTION.url('./')); return; }
    photoUrl = URL.createObjectURL(blob); $('reading-photo').src = photoUrl;
    if(saved?.photoId === photoId && Number.isInteger(saved.phase)) phase = Math.max(0,Math.min(4,saved.phase));
    if(phase > 1 && !name) phase = 1;
    if(phase === 4) { location.replace(window.MAPA_ATTRIBUTION.url('oferta.html')); return; }
    $('loading-note').hidden = true;
    document.querySelector('main').hidden = false;
    if(phase === 0) animate(0, 0, 33, askName);
    else if(phase === 1) askName();
    else remaining();
  }
  window.addEventListener('pagehide', () => {clearInterval(timer); if(photoUrl) URL.revokeObjectURL(photoUrl);});
  window.addEventListener('pageshow', event => {if(event.persisted) location.reload();});
  init();
})();
