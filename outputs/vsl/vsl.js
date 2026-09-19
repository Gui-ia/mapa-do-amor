'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const dialog = $('photo-dialog'), camera = $('camera');
  const player = document.querySelector('vturb-smartplayer');
  let playerReady = false;

  function revealPhotoAction() {
    const el = $('photo-action');
    if (el && el.style.display === 'none') {
      el.style.display = 'block';
    }
  }

  const checkCameraGate = (time) => {
    if (time >= 30) revealPhotoAction();
  };

  // Gate the camera action on playback position, never on page elapsed time.
  player.addEventListener('player:ready', () => {
    playerReady = true;
    try {
      player.displayHiddenElements(30, ['#photo-action'], { display: 'block', persist: false });
    } catch (e) {}
    try {
      if (player.currentTime >= 30) revealPhotoAction();
    } catch (e) {}
  }, { once: true });

  // Backup garantido: monitora múltiplos eventos de reprodução do Smartplayer e HTML5 video
  player.addEventListener('video:timeupdate', (e) => checkCameraGate(e.detail?.time || 0));
  player.addEventListener('timeupdate', () => checkCameraGate(player.currentTime || 0));
  setInterval(() => {
    try {
      const cur = player.currentTime || player.video?.currentTime || 0;
      if (cur >= 30) checkCameraGate(cur);
    } catch (e) {}
  }, 500);

  const playerScript = document.createElement('script');
  playerScript.src = 'https://scripts.converteai.net/af9b52cf-e5e4-4213-b5cb-0966a1c95761/players/6aac2f6f17052e6db12238cb/v4/player.js';
  playerScript.async = true;
  document.head.appendChild(playerScript);
  const storageKey = 'mapa-vsl:photo-id';
  let photoRequest = 0, saving = false;
  let stream = null, request = 0, draft = null, saved = null, previewUrl = '', savedId = '';
  function stopCamera() {
    request++;
    stream?.getTracks().forEach(track => track.stop());
    stream = null; camera.srcObject = null; camera.hidden = true;
  }
  function error(message = '') { $('photo-error').textContent = message; $('photo-error').hidden = !message; }
  async function startCamera() {
    photoRequest++; stopCamera(); error(); draft = null;
    $('photo-preview').hidden = true; $('confirm-photo').hidden = true; $('retake').hidden = true; $('capture').hidden = true;
    $('camera-status').hidden = false; $('camera-status').textContent = 'Abrindo a câmera…';
    const current = request;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('unavailable');
      const next = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1440},height:{ideal:1920}},audio:false});
      if (current !== request || !dialog.open) { next.getTracks().forEach(track => track.stop()); return; }
      stream = next; camera.srcObject = stream; camera.hidden = false;
      await camera.play();
      if (current !== request || !dialog.open) return;
      $('camera-status').hidden = true; $('capture').hidden = false;
    } catch {
      if (current !== request || !dialog.open) return;
      stopCamera();
      $('camera-status').textContent = 'Você pode abrir a câmera do aparelho ou escolher uma foto da galeria.';
      $('retake').textContent = 'Abrir câmera do aparelho'; $('retake').hidden = false;
    }
  }
  async function preview(blob) {
    if (!blob || saving) return;
    const current = ++photoRequest;
    draft = null; $('confirm-photo').hidden = true; $('photo-preview').hidden = true;
    stopCamera(); error();
    if (!['image/jpeg','image/png','image/webp'].includes(blob.type)) { error('Escolha uma foto JPG, PNG ou WebP.'); return; }
    if (blob.size > 10 * 1024 * 1024) { error('Escolha uma foto com até 10 MB.'); return; }
    const url = URL.createObjectURL(blob), probe = new Image();
    try { probe.src = url; await probe.decode(); }
    catch { URL.revokeObjectURL(url); if (current !== photoRequest) return; error('Não foi possível abrir essa foto. Tente outra imagem.'); return; }
    if (!dialog.open || current !== photoRequest) { URL.revokeObjectURL(url); return; }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    draft = blob; previewUrl = url;
    $('photo-preview').src = url; $('photo-preview').hidden = false;
    $('camera-status').hidden = true; $('capture').hidden = true;
    $('confirm-photo').hidden = false; $('retake').hidden = false; $('retake').textContent = 'Tirar outra foto';
    $('confirm-photo').focus();
  }
  $('open-camera').addEventListener('click', () => {
    if (playerReady) player.pause();
    dialog.showModal();
    if (saved) preview(saved); else startCamera();
  });
  $('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { photoRequest++; stopCamera(); });
  $('pick-photo').addEventListener('click', () => $('gallery').click());
  $('retake').addEventListener('click', () => {
    if ($('retake').textContent === 'Abrir câmera do aparelho') $('native-camera').click();
    else startCamera();
  });
  for (const id of ['gallery','native-camera']) $(id).addEventListener('change', e => {
    const file = e.target.files[0]; e.target.value = ''; if (file) preview(file);
  });
  $('capture').addEventListener('click', () => {
    if (!camera.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = camera.videoWidth; canvas.height = camera.videoHeight;
    canvas.getContext('2d').drawImage(camera,0,0);
    canvas.toBlob(blob => { if (blob && dialog.open) preview(blob); },'image/jpeg',.92);
  });
  $('confirm-photo').addEventListener('click', async () => {
    if (!draft || saving) return;
    saving = true;
    const selected = draft, oldId = savedId;
    const controls = ['confirm-photo','close-dialog','retake','pick-photo'];
    controls.forEach(id => $(id).disabled = true);
    $('confirm-photo').textContent = 'Guardando sua foto…';
    const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
    try {
      const persisted = await window.MAPA_SESSION.putPhoto(id,selected);
      if (!persisted) throw new Error('Não foi possível guardar sua foto. Tente novamente ou abra esta página no Safari ou Chrome pelo menu do aplicativo.');
      try { sessionStorage.setItem(storageKey,id); }
      catch { window.MAPA_SESSION.removePhoto(id); throw new Error('Permita o armazenamento nesta aba ou abra a página no Safari ou Chrome.'); }
      saved = selected; savedId = id;
      if (oldId) window.MAPA_SESSION.removePhoto(oldId);
      dialog.close();
      location.assign(window.MAPA_ATTRIBUTION.url('preparando.html'));
    } catch (err) { error(err.message || 'Não foi possível guardar sua foto. Tente novamente.'); }
    finally {
      saving = false;
      controls.forEach(id => $(id).disabled = false);
      $('confirm-photo').textContent = 'Usar esta foto';
    }
  });
  dialog.addEventListener('cancel', event => { if (saving) event.preventDefault(); });
  async function restore() {
    saved = null;
    try { savedId = sessionStorage.getItem(storageKey) || ''; } catch {}
    if (savedId) {
      const blob = await window.MAPA_SESSION.getPhoto(savedId);
      if (blob) saved = blob;
    }
    window.MAPA_SESSION.cleanup();
    if (saved && new URLSearchParams(location.search).get('foto') === 'editar') {
      dialog.showModal();
      preview(saved);
      const clean = new URL(location.href); clean.searchParams.delete('foto');
      history.replaceState(null, '', clean.pathname + clean.search + clean.hash);
      return;
    }
    if (saved) location.replace(window.MAPA_ATTRIBUTION.url('preparando.html'));
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && stream) { stopCamera(); $('capture').hidden = true; $('camera-status').textContent = 'Câmera pausada.'; $('camera-status').hidden = false; $('retake').hidden = false; $('retake').textContent = 'Tirar outra foto'; }
  });
  window.addEventListener('pagehide', () => { stopCamera(); if (previewUrl) URL.revokeObjectURL(previewUrl); });
  window.addEventListener('pageshow', event => { if (event.persisted) restore(); });
  restore();
})();
