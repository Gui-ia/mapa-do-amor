'use strict';
(() => {
  let name = '';
  try { name = (sessionStorage.getItem('mapa-vsl:first-name') || '').trim().slice(0,40); } catch {}
  if (name) {
    const title = document.getElementById('personal-title');
    title.replaceChildren(document.createTextNode(`${name}, sua leitura `));
    const emphasis = document.createElement('em');
    emphasis.textContent = 'está pronta.';
    title.append(emphasis);
  }
  const player = document.querySelector('vturb-smartplayer');
  const audioAction = document.getElementById('video-audio-action');
  function showAudioAction(label) {
    audioAction.textContent = label;
    audioAction.hidden = false;
  }
  async function autoplay() {
    try {
      player.unmute();
      await player.play();
      if (player.paused) throw new Error('Autoplay blocked');
    } catch {
      // A click on the previous page does not always authorize audio on this page.
      player.mute();
      try {
        await player.play();
        showAudioAction(player.paused ? 'Toque para assistir ao vídeo' : 'Toque para ativar o som');
      } catch { showAudioAction('Toque para assistir ao vídeo'); }
    }
  }
  audioAction.addEventListener('click', async () => {
    player.unmute();
    try {
      await player.play();
      audioAction.hidden = true;
    } catch { showAudioAction('Toque para assistir ao vídeo'); }
  });
  player.addEventListener('player:ready', () => {
    // Playback timestamp only: pausing or leaving the tab open does not advance the gate.
    player.onTime(240, () => window.MAPA_OFFER_ACCESS.unlock());
    if (player.currentTime >= 240) window.MAPA_OFFER_ACCESS.unlock();
    autoplay();
  }, { once: true });
  const playerScript = document.createElement('script');
  playerScript.src = 'https://scripts.converteai.net/af9b52cf-e5e4-4213-b5cb-0966a1c95761/players/6aac506d76eb195e3e5f046c/v4/player.js';
  playerScript.async = true;
  document.head.appendChild(playerScript);
  const dialog = document.getElementById('payment-preview');
  document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => {
    const configured = window.MAPA_OFFER?.paymentUrl;
    if (configured) {
      try {
        const destination = new URL(configured);
        if (destination.protocol === 'https:') { location.assign(window.MAPA_ATTRIBUTION.url(destination.href)); return; }
      } catch {}
    }
    dialog.showModal();
  }));
  for (const id of ['close-payment','back-to-offer']) document.getElementById(id).addEventListener('click', () => dialog.close());
  let photoUrl = '';
  async function loadPhoto() {
    let id;
    try { id = sessionStorage.getItem('mapa-vsl:photo-id'); } catch {}
    if (!id) return;
    const blob = await window.MAPA_SESSION.getPhoto(id);
    if (!blob) return;
    photoUrl = URL.createObjectURL(blob);
    document.getElementById('submitted-photo').src = photoUrl;
    document.getElementById('photo-receipt').hidden = false;
  }
  window.addEventListener('pagehide', () => { if (photoUrl) URL.revokeObjectURL(photoUrl); });
  window.addEventListener('pageshow', event => { if (event.persisted) loadPhoto(); });
  loadPhoto();
})();
