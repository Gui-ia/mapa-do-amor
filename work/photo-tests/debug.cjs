const {chromium,webkit,firefox}=require('playwright');const fs=require('fs');const assert=require('assert');
(async()=>{const engine=process.env.ENGINE||'chromium';const browser=await ({chromium,webkit,firefox}[engine]).launch(engine==='chromium'?{channel:'chrome',headless:true}:{headless:true});
for(const width of [360,390,768,1280]){
const page=await browser.newPage({viewport:{width,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:18769/?lang=pt');await page.evaluate(()=>{const D=window.MAPA_COPY;window.MAPA_SESSION.save({stage:'photo',lang:'pt',a:{relationship:D.relationships[0].id,goal:D.goals[0].id,context:D.branches[D.goals[0].id].context[0].id,curiosity:D.branches[D.goals[0].id].curiosity[0].id,desire:D.desires[0].id},person:{name:'Teste',day:'1',month:'1',year:'1990',city:'São Paulo',hand:''}})});await page.reload();
console.log(await page.locator('body').innerText(),errors);await page.locator('.photo-mock').waitFor();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.locator('#upload').setInputFiles({name:'bad.jpg',mimeType:'image/jpeg',buffer:Buffer.from('broken')});await page.waitForFunction(()=>document.querySelector('#error').textContent.includes('Não foi possível'));
await page.locator('#upload').setInputFiles('outputs/assets/clara.png');await page.locator('.photo-preview').waitFor();assert(await page.locator('.photo-preview').evaluate(i=>i.complete&&i.naturalWidth>0));
await page.locator('#step-form button[type=submit]').click();assert((await page.locator('#error').textContent()).length>0);
await page.locator('input[name=hand][value=right]').check();await page.locator('#step-form button[type=submit]').click();await page.locator('dialog[open]').waitFor();await page.locator('[data-action=close-modal]').click();
await page.reload();await page.locator('.photo-preview').waitFor();await page.locator('[data-action=remove-photo]').click();await page.locator('.photo-mock').waitFor();
assert.equal(errors.length,0,errors.join('\n'));console.log('PASS',width,'layout, invalid file, upload, hand validation, modal, persistence, remove');
if(width===390)await page.screenshot({path:'work/photo-tests/mobile.png',fullPage:true});await page.close();}
const page=await browser.newPage();await page.goto('http://127.0.0.1:18769/?lang=pt');await page.evaluate(()=>{window.MAPA_SESSION.putPhoto=async()=>false;});
await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
