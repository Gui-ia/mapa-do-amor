'use strict';
(() => {
  const D = window.MAPA_COPY;
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  let lang = ['pt', 'de'].includes(requestedLanguage) ? requestedLanguage : D.defaultLanguage, stage = 'landing', q = 0;
  let answers = {}, name = '', hand = '', photo = '', error = '', uploadTicket = 0;
  const app = document.getElementById('app');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const loc = value => value?.[lang] ?? '';
  const t = key => esc(loc(D.copy[key]));
  const money = () => new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'de-DE', {style:'currency', currency:D.currency}).format(D.price);
  const branch = () => D.branches[answers.goal];
  const rows = () => q === 0 ? D.goals : branch()[q === 1 ? 'context' : 'curiosity'];
  const key = () => ['goal','context','curiosity'][q];
  const selectedText = () => esc(loc(branch().curiosity.find(r => r.id === answers.curiosity)?.text));
  const btn = (action, label, style='cta') => `<button type="button" class="${style}" data-action="${action}">${label}<span aria-hidden="true">${style==='cta'?' ↗':''}</span></button>`;
  const back = action => btn(action, '← '+t('back'), 'back');
  const eyebrow = label => `<p class="eyebrow">${label}</p>`;
  function timeline(compact=false) {
    return `<ol class="timeline ${compact?'compact':''}">${D.timeline.map((r,i)=>`<li><span class="point">0${i+1}</span><div><h3>${esc(loc(r.title))}</h3><p>${esc(loc(r.text))}</p></div></li>`).join('')}</ol>`;
  }
  function sample(detail=false) {
    return `<figure class="map-sample"><div class="map-picture"><img src="assets/mapa-exemplo.png" alt="${t('exampleAlt')}" width="1122" height="1402"><span class="image-label">HERZLINIEN</span></div><div class="map-reading">${eyebrow(t('exampleLabel'))}${timeline(true)}</div><figcaption>${t('sampleNote')}</figcaption></figure>${detail?`<div class="sample-explanation"><div>${eyebrow(t('lineTitle'))}<p>${t('lineObservation')}</p></div><div><h3>${t('sampleTitle')}</h3><p>${t('sampleText')}</p></div></div>`:''}`;
  }
  function benefits() {
    return `<div class="benefits">${D.benefits.map((b,i)=>`<article><span class="number">0${i+1}</span><h3>${esc(loc(b.title))}</h3><p>${esc(loc(b.text))}</p></article>`).join('')}</div>`;
  }
  function faq() {
    return `<div class="faq">${D.faq.map(r=>`<details><summary>${esc(loc(r.q))}</summary><p>${esc(loc(r.a))}</p></details>`).join('')}</div>`;
  }
  function progress() {
    const active = stage==='questions'?0:stage==='example'?1:stage==='photo'?2:3;
    return `<ol class="steps" aria-label="${lang==='pt'?'Etapas':'Schritte'}">${['phaseQuestions','phaseExample','phasePhoto','phasePreview'].map((r,i)=>`<li ${active===i?'aria-current="step"':''} class="${i<=active?'active':''}"><span>${i<active?'✓':i+1}</span>${t(r)}</li>`).join('')}</ol>`;
  }
  function photoCard() {
    return photo ? `<div class="selected-photo"><img src="${photo}" alt="${t('photoAlt')}">${btn('remove-photo',t('removePhoto'),'link')}</div>` : '';
  }
  function render(focus=true) {
    document.documentElement.lang = lang==='pt'?'pt-BR':'de';
    document.title = 'Herzlinien · '+loc(D.copy.product);
    document.getElementById('header').innerHTML = `<span class="brand" translate="no">herzlinien<span aria-hidden="true">✧</span></span><div class="language"><label for="language">${t('review')}</label><select id="language"><option value="de" ${lang==='de'?'selected':''}>Deutsch</option><option value="pt" ${lang==='pt'?'selected':''}>Português</option></select></div>`;
    document.getElementById('demo-note').textContent = loc(D.copy.demo);
    document.getElementById('footer').innerHTML = `<div class="footer-brand"><span class="brand" translate="no">herzlinien✧</span><p>${t('futureNote')}</p></div><details><summary>${t('privacy')}</summary><p>${t('privacyText')}</p></details><p class="footer-small">${t('guideDisclosure')}</p>`;
    app.className = stage==='landing'?'landing':`flow ${stage}`;
    let h='';
    if(stage==='landing') {
      h=`<section class="hero"><div class="hero-copy">${eyebrow(t('product'))}<h1>${t('headline')}</h1><p class="lead">${t('lead')}</p><p class="sublead">${t('sublead')}</p>${btn('start',t('start'))}<p class="small">${t('free')}</p></div><div>${sample()}</div></section><section class="section">${eyebrow(t('included'))}<h2>${t('exampleTitle')}</h2>${benefits()}</section><section class="section faq-section"><h2>${lang==='pt'?'Antes de começar':'Bevor du beginnst'}</h2>${faq()}</section><aside class="guide"><img src="assets/clara.png" alt="${t('guide')}" width="90" height="90" loading="lazy"><div><h3>${t('guide')}</h3><p>${t('guideText')}</p></div></aside><section class="closing"><h2>${t('bottomTitle')}</h2>${btn('start',t('start'))}<p class="small">${t('free')}</p></section>`;
    } else if(stage==='questions') {
      const title=q===1?branch().question:D.questions[q];
      h=`${progress()}<div class="question-body">${eyebrow(`${lang==='pt'?'Pergunta':'Frage'} ${q+1} ${lang==='pt'?'de':'von'} 3`)}<h1>${esc(loc(title))}</h1><p class="small">${t('questionNote')}</p><div class="choices">${rows().map(r=>`<button type="button" class="choice ${answers[key()]===r.id?'selected':''}" data-value="${r.id}" aria-pressed="${answers[key()]===r.id}"><span class="radio" aria-hidden="true"></span><span>${esc(loc(r.text))}</span><span class="arrow" aria-hidden="true">→</span></button>`).join('')}</div>${back('back-question')}</div>`;
    } else if(stage==='example') {
      h=`${progress()}${eyebrow(t('product'))}<h1>${t('exampleTitle')}</h1><p class="lead">${t('exampleLead')}</p>${sample(true)}<p class="mechanism">${t('mechanism')}</p><div class="nav">${back('to-last-question')}${btn('photo',t('addPhoto'))}</div>`;
    } else if(stage==='photo') {
      h=`${progress()}<div class="question-body">${eyebrow(t('phasePhoto'))}<h1>${t('photoTitle')}</h1><p>${t('photoLead')}</p><div class="upload-box"><label for="upload" class="upload-label"><span class="upload-icon" aria-hidden="true">＋</span><strong>${photo?t('changePhoto'):t('choosePhoto')}</strong><span class="small">${t('formats')}</span></label><input id="upload" type="file" accept="image/jpeg,image/png,image/webp"></div><p id="photo-error" class="error" role="alert">${error?t(error):''}</p>${photoCard()}<fieldset><legend>${t('hand')}</legend><div class="hand-options">${['right','left'].map(v=>`<label><input type="radio" name="hand" value="${v}" ${hand===v?'checked':''}>${t(v)}</label>`).join('')}</div></fieldset><label class="name-label" for="name">${t('name')}</label><input id="name" type="text" maxlength="40" autocomplete="given-name" value="${esc(name)}"><p class="privacy-inline">${t('photoLocal')}</p><div class="nav">${back('example')}${btn('preview',t('prepare'))}</div></div>`;
    } else if(stage==='preview') {
      h=`${progress()}${eyebrow(t('phasePreview'))}<h1>${name?`${esc(name)}, `:''}${esc(loc(branch().heading))}</h1><p class="demo-context">${t('previewIntro')}</p><div class="question-focus">${eyebrow(t('yourQuestion'))}<p>${selectedText()}</p></div>${sample(true)}${photo?`<details class="your-photo"><summary>${lang==='pt'?'Sua foto, sem análise':'Dein Foto, ohne Analyse'}</summary><img src="${photo}" alt="${t('photoAlt')}"></details>`:''}<div class="closing small-closing"><h2>${t('wholeMap')}</h2>${btn('offer',t('offerCta'))}</div><div class="nav">${back('photo')}${btn('edit',t('edit'),'link')}</div>`;
    } else if(stage==='offer') {
      h=`${eyebrow(t('product'))}<h1>${t('offerTitle')}</h1><p class="lead">${t('offerLead')}</p><div class="offer-grid"><div>${timeline()}<div class="personal-chapter">${eyebrow(t('chapter'))}<h3>${esc(loc(branch().chapter))}</h3><p>${selectedText()}</p></div><h3>${esc(loc(D.benefits[2].title))}</h3><p>${esc(loc(D.benefits[2].text))}</p></div><aside class="price-card">${eyebrow(t('priceLabel'))}<p class="price">${esc(money())}</p><p>${t('oneTime')}</p><hr><p>${t('delivery')}</p>${btn('summary',t('summaryCta'))}<p class="small">${t('notLive')}</p></aside></div>${faq()}${back('preview')}`;
    } else if(stage==='summary') {
      h=`${eyebrow(t('product'))}<h1>${t('summaryTitle')}</h1><div class="summary-card"><div><h2>${t('product')}</h2><p>${esc(loc(branch().chapter))}</p><p>${t('oneTime')}</p><p>${t('delivery')}</p></div><div><span class="small">${t('total')}</span><p class="price">${esc(money())}</p></div></div><p class="notice" role="status">${t('summaryNotice')}</p><div class="nav">${btn('offer',t('change'),'secondary')}${btn('restart',t('restart'),'link')}</div>`;
    }
    app.innerHTML=h;
    if(focus){window.scrollTo({top:0,behavior:'instant'});const title=app.querySelector('h1');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}}
  }
  function go(next){stage=next;error='';render();}
  function reset(){uploadTicket++;if(photo)URL.revokeObjectURL(photo);photo='';answers={};name='';hand='';q=0;go('landing');}
  app.addEventListener('click', event=>{
    const choice=event.target.closest('[data-value]');
    if(choice && stage==='questions'){
      const value=choice.dataset.value;
      if(!rows().some(r=>r.id===value))return;
      if(q===0 && answers.goal!==value){delete answers.context;delete answers.curiosity;}
      answers[key()]=value;
      if(q<2){q++;render();}else go('example');
      return;
    }
    const action=event.target.closest('[data-action]')?.dataset.action;
    if(!action)return;
    if(action==='start'){q=0;go('questions');}
    else if(action==='back-question'){if(q>0){q--;render();}else go('landing');}
    else if(action==='to-last-question'){q=2;go('questions');}
    else if(action==='edit'){q=0;go('questions');}
    else if(action==='remove-photo'){uploadTicket++;URL.revokeObjectURL(photo);photo='';error='';render();}
    else if(action==='restart')reset();
    else if(action==='preview'){
      if(photo&&!hand){error='handError';document.getElementById('photo-error').textContent=loc(D.copy[error]);app.querySelector('[name="hand"]').focus();return;}
      go('preview');
    }else if(['example','photo','offer','summary'].includes(action))go(action);
  });
  app.addEventListener('input',event=>{if(event.target.id==='name')name=event.target.value.slice(0,40);});
  app.addEventListener('change',event=>{
    if(event.target.name==='hand')hand=event.target.value;
    if(event.target.id!=='upload')return;
    const ticket=++uploadTicket,f=event.target.files[0];if(!f)return;
    const showError=key=>{error=key;const el=document.getElementById('photo-error');if(el)el.textContent=loc(D.copy[key]);};
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>10485760){showError('photoError');return;}
    const url=URL.createObjectURL(f),im=new Image();
    im.onload=()=>{if(ticket!==uploadTicket){URL.revokeObjectURL(url);return;}if(photo)URL.revokeObjectURL(photo);photo=url;error='';if(stage==='photo')render();};
    im.onerror=()=>{URL.revokeObjectURL(url);if(ticket===uploadTicket)showError('decodeError');};
    im.src=url;
  });
  document.getElementById('header').addEventListener('change',event=>{if(event.target.id==='language'&&['de','pt'].includes(event.target.value)){lang=event.target.value;render(false);document.getElementById('language').focus();}});
  window.addEventListener('pagehide',()=>{uploadTicket++;if(photo)URL.revokeObjectURL(photo);});
  render(false);
})();
