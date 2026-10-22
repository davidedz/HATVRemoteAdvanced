const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL});
 try{
 const page=await browser.newPage({viewport:{width:420,height:640}});
 await page.route('http://card.test/**',r=>r.fulfill({contentType:'text/html',body:`<html><head><style>
 body{margin:0;padding:20px;background:#111316;font-family:Arial,sans-serif;color:#e8e9eb;--primary-text-color:#e8e9eb;--secondary-text-color:#92979e;--primary-color:#6eb6b0;--divider-color:#41454a;--card-background-color:#1b1e22}ha-card{display:block;background:var(--card-background-color);border-radius:16px;border:1px solid #30343a}body.light{background:#f3f4f6;--primary-text-color:#202630;--secondary-text-color:#737b86;--primary-color:#378c85;--divider-color:#cdd2d8;--card-background-color:#fff}body.light ha-card{border-color:#e0e4e8}
 </style></head><body></body></html>`}));
 await page.goto('http://card.test/');
 await page.addScriptTag({type:'module',content:fs.readFileSync(path.join(__dirname,'../custom_components/advanced_tv_remote/www/advanced-tv-remote-card.js'),'utf8')});
 await page.waitForFunction(()=>customElements.get('advanced-tv-remote-card'));
 await page.clock.install();await page.clock.pauseAt(new Date());
 await page.evaluate(async()=>{
  customElements.define('ha-card',class extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'}).innerHTML='<style>:host{display:block;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:16px;box-shadow:0 2px 12px #0000000a}</style><slot></slot>';}});
  const labels=['Rai 1','Rai 2','Rai 3','5','Italia 1','TV8','NOVE','Real Time','DMAX'];
  const titles=['Il commissario Montalbano','Tutto è possibile','Un posto al sole','Striscia la notizia','Le Iene','Pechino Express','Che tempo che fa','Casa a prima vista','Affari a quattro ruote'];
  const next=['Porta a Porta','TG2 — Stasera','Geo · Le storie','Grande Fratello','Sport Mediaset','Alessandro Borghese — 4 ristoranti','Fratelli di Crozza','Primo appuntamento','Airport Security'];
  const colors=['#465ac5','#e34e51','#43a27c','#378bc6','#4c9de0','#e1dfd8','#f3f0e8','#ce4a82','#e65236'];
  const logos=labels.map((name,i)=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="64" viewBox="0 0 80 64"><rect x="0" y="8" width="80" height="48" rx="5" fill="${colors[i]}"/><text x="40" y="38" font-family="Arial,sans-serif" font-size="${name.length>6?13:18}" font-weight="bold" text-anchor="middle" fill="${i===5||i===6?'#222':'white'}">${name}</text></svg>`));
  window.channelData=labels.map((name,i)=>({id:'ch'+i,name,icon:logos[i]}));
  const now=Date.now();window.programmeData=Object.fromEntries(labels.map((_,i)=>['ch'+i,{current:{title:titles[i],start:new Date(now-(i+1)*6*60000).toISOString(),stop:new Date(now+(9-i)*6*60000).toISOString()},next:{title:next[i],start:new Date(now+(9-i)*6*60000).toISOString(),stop:new Date(now+(19-i)*6*60000).toISOString()}}]));
  window.config={type:'custom:advanced-tv-remote-card',config_entry_id:'test',channels:channelData.map(c=>({channel_id:c.id,tap_action:{action:'none'}}))};
  window.card=document.createElement('advanced-tv-remote-card');card.hass={locale:{language:'it'},callWS:async m=>m.type.endsWith('/channels')?channelData:programmeData,callService:async()=>{}};card.setConfig(config);document.body.append(card);await card.updateComplete;
 });
 await page.waitForFunction(()=>card.shadowRoot.querySelectorAll('img').length===9);
 await page.locator('advanced-tv-remote-card').locator('img').first().waitFor();
 assert.equal(await page.locator('advanced-tv-remote-card').locator('h2').count(),0);
 assert.equal(await page.locator('advanced-tv-remote-card').locator('.channel-name').count(),0);
 const initial=await page.evaluate(()=>Number.parseFloat(card.shadowRoot.querySelector('.progress-fill').style.width));assert.equal(initial,10);
 const heights=await page.locator('advanced-tv-remote-card').locator('button').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().height));assert(heights.every(h=>h<=59));
 if(process.env.EDITOR_SCREENSHOTS)await page.screenshot({path:path.join(process.env.EDITOR_SCREENSHOTS,'compact-card-dark.png')});
 await page.evaluate(()=>document.body.classList.add('light'));
 if(process.env.EDITOR_SCREENSHOTS)await page.screenshot({path:path.join(process.env.EDITOR_SCREENSHOTS,'compact-card-light.png')});
 await page.clock.runFor(15000);assert((await page.evaluate(()=>Number.parseFloat(card.shadowRoot.querySelector('.progress-fill').style.width)))>initial);
 for(const width of [280,360,768]){await page.setViewportSize({width,height:1000});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);}
 await page.evaluate(()=>{card.setConfig({...config,show_channel_names:true,title:'Guida TV'});});
 await page.waitForFunction(()=>card.shadowRoot.querySelectorAll('.channel-name').length===9);
 await page.evaluate(()=>{programmeData.ch0.current.start='invalid';programmeData.ch1.current.stop=programmeData.ch1.current.start;programmeData.ch2.current=null;programmeData.ch2.next=null;channelData[0].icon='data:image/png;base64,invalid';channelData[1].icon=undefined;card.setConfig({...config});});
 await page.waitForFunction(()=>card.shadowRoot.querySelectorAll('.logo-fallback').length===2);
 assert.equal(await page.locator('advanced-tv-remote-card').locator('button').nth(0).locator('.progress-fill').count(),0);
 assert.equal(await page.locator('advanced-tv-remote-card').locator('button').nth(1).locator('.progress-fill').count(),0);
 assert.match(await page.locator('advanced-tv-remote-card').locator('button').nth(2).innerText(),/Programmazione non disponibile/);
 await page.evaluate(()=>{const now=Date.now();programmeData.ch3.current={title:'Futuro',start:new Date(now+10000).toISOString(),stop:new Date(now+20000).toISOString()};programmeData.ch4.current={title:'Finito',start:new Date(now-20000).toISOString(),stop:new Date(now-10000).toISOString()};card.setConfig(config);});
 await page.waitForFunction(()=>card.shadowRoot.querySelectorAll('button')[3].querySelector('.progress-fill')?.style.width==='0%');
 assert.equal(await page.locator('advanced-tv-remote-card').locator('button').nth(4).locator('.progress-fill').evaluate(e=>e.style.width),'100%');
 console.log('PASS: 58px rows, dark/light preview, 280/360/768px widths, logos and broken-logo fallback, optional names/title, live progress, invalid times and missing programmes');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
