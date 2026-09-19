from pathlib import Path
import json
r=Path('outputs'); p=r/'app.js';s=p.read_text()
s=s.replace("let photoId='',", "let photoBusy=false;\n let photoId='',")
s=s.replace('<div class="camera-view"><video id="camera-preview" autoplay muted playsinline></video></div>', '<div class="camera-view"><video id="camera-preview" autoplay muted playsinline></video><div class="camera-guide" aria-hidden="true"><img src="assets/como-fotografar-mao.svg" alt=""></div><span class="camera-guide-label">${t(\'centerPhoto\')}</span></div>')
a=s.index('<figure class="photo-example">');b=s.index('<fieldset>',a)
s=s[:a]+'''<div class="photo-panel"><div class="photo-frame ${photo?'has-photo':''}">${photo?`<img class="photo-preview" src="${photo}" alt="${t('photoAlt')}">`:`<img class="photo-mock" src="assets/como-fotografar-mao.svg" width="260" height="300" alt="${t('photoExampleAlt')}">`}<span class="photo-frame-caption">${t(photo?'photoSelected':'centerPhoto')}</span></div><div class="photo-instructions"><h2>${t(photo?'checkPhoto':'photoExample')}</h2><p>${t('frameHelp')}</p><ul><li>${t('photoTip1')}</li><li>${t('photoTip2')}</li><li>${t('photoTip3')}</li></ul></div><div class="photo-actions"><button type="button" class="cta photo-camera" data-action="take-photo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5 10 3h4l2 2h4a2 2 0 0 1 2 2v12H2V7a2 2 0 0 1 2-2Z"/><circle cx="12" cy="12" r="4"/></svg>${t('takePhoto')}</button><button type="button" class="secondary" data-action="choose-photo">${t(photo?'replacePhoto':'gallery')}</button><input id="camera-upload" class="photo-file-input" type="file" accept="image/*" capture="environment" tabindex="-1" aria-label="${t('takePhoto')}"><input id="upload" class="photo-file-input" type="file" accept="image/*" tabindex="-1" aria-label="${t('gallery')}"><p class="small">${t('formats')}</p><p id="photo-status" class="photo-status" role="status" aria-live="polite">${photoBusy?t('photoProcessing'):photo?t('photoSelected'):''}</p>${photo?btn('remove-photo',t('removePhoto'),'link'):''}</div></div><details class="photo-help"><summary>${t('photoHelpTitle')}</summary><p>${t('photoHelpBody')}</p></details>''' +s[b:]
a=s.index(' function acceptPhoto(');b=s.index(' async function openCamera',a)
s=s[:a]+''' function photoLoading(busy){photoBusy=busy;const status=document.getElementById('photo-status');if(status)status.textContent=busy?loc(D.copy.photoProcessing):'';const submit=app.querySelector('#step-form button[type="submit"]');if(submit)submit.disabled=busy;}
 async function acceptPhoto(file){
  if(!file)return;const id=++ticket;
  if(!file.size||file.size>26214400||(!/^image\\//i.test(file.type)&&!(file.type===''&&/\\.(jpe?g|png|webp|heic|heif|avif)$/i.test(file.name||'')))){photoLoading(false);showError('photoError');return;}
  photoLoading(true);error='';const err=document.getElementById('error');if(err)err.textContent='';
  const url=URL.createObjectURL(file),image=new Image();
  try{
   await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
   if(id!==ticket)return;
   if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth*image.naturalHeight>80000000)throw new Error('dimensions');
   const canvas=document.createElement('canvas'),scale=Math.min(1,2000/Math.max(image.naturalWidth,image.naturalHeight));
   canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.9));if(!blob)throw new Error('conversion');
   if(id!==ticket)return;
   const nextId=typeof crypto?.randomUUID==='function'?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
   // Storage is best effort: a blocked database must not block the photo step.
   const stored=await Promise.race([session.putPhoto(nextId,blob),new Promise(resolve=>setTimeout(()=>resolve(false),2500))]);
   if(id!==ticket){session.removePhoto(nextId);return;}
   const previousId=photoId;if(photo)URL.revokeObjectURL(photo);photo=URL.createObjectURL(blob);photoId=stored?nextId:'';error='';photoLoading(false);saveSession();session.removePhoto(previousId);if(stage==='photo')render(false);
  }catch{if(id===ticket){photoLoading(false);showError('decodeError');}}
  finally{URL.revokeObjectURL(url);}
 }
''' +s[b:]
s=s.replace("if(!navigator.mediaDevices?.getUserMedia){showError('cameraUnavailable');return;}","if(!navigator.mediaDevices?.getUserMedia){document.getElementById('camera-upload').click();return;}")
s=s.replace("if(stage==='photo')return photo?", "if(stage==='photo'&&photoBusy)return 'photoProcessing';if(stage==='photo')return photo?")
s=s.replace("dlg.showModal();", "if(typeof dlg.showModal==='function')dlg.showModal();else{dlg.setAttribute('open','');dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');}")
s=s.replace("app.addEventListener('submit',e=>{e.preventDefault();", "app.addEventListener('submit',e=>{e.preventDefault();if(photoBusy)return;")
s=s.replace("photoId='';ticket++;if(photo)","photoId='';ticket++;photoLoading(false);if(photo)")
s=s.replace("ticket++;if(photo)URL.revokeObjectURL(photo);});", "ticket++;photoLoading(false);});\n window.addEventListener('pageshow',e=>{if(e.persisted){modal='';render(false);}});")
p.write_text(s)
p=r/'quiz-copy-data.json';d=json.loads(p.read_text());
copy={
'centerPhoto':('Centralize a palma da mão','Zentriere deine Handfläche'),
'frameHelp':('Enquadre a mão inteira, do pulso até a ponta dos dedos.','Zeige die ganze Hand, vom Handgelenk bis zu den Fingerspitzen.'),
'checkPhoto':('Confira sua foto','Prüfe dein Foto'),
'photoSelected':('Foto adicionada ✓','Foto hinzugefügt ✓'),
'replacePhoto':('Escolher outra foto','Anderes Foto auswählen'),
'photoProcessing':('Preparando sua foto…','Dein Foto wird vorbereitet…'),
'formats':('Imagens de até 25 MB. A foto será otimizada automaticamente.','Bilder bis 25 MB. Dein Foto wird automatisch optimiert.'),
'photoError':('Escolha uma imagem de até 25 MB.','Wähle ein Bild mit maximal 25 MB.'),
'decodeError':('Não foi possível abrir essa imagem. Escolha uma foto JPG/PNG ou tire uma nova foto.','Dieses Bild konnte nicht geöffnet werden. Wähle ein JPG/PNG oder nimm ein neues Foto auf.'),
'photoHelpTitle':('A câmera ou a galeria não abriu?','Kamera oder Galerie öffnet sich nicht?'),
'photoHelpBody':('Tente escolher uma foto da galeria. No Facebook ou Instagram, use o menu ⋯ e abra esta página no Safari ou Chrome, se essa opção estiver disponível. Ao trocar de navegador, pode ser necessário refazer as etapas.','Versuche, ein Foto aus der Galerie auszuwählen. Öffne im Facebook- oder Instagram-Menü ⋯ diese Seite in Safari oder Chrome, falls verfügbar. In einem anderen Browser musst du die Schritte möglicherweise wiederholen.')}
for k,(pt,de) in copy.items():d['copy'][k]={'pt':pt,'de':de}
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=r/'index.html';p.write_text(p.read_text().replace('v=6.16','v=6.17'))
