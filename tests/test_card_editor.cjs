const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs');
const path = require('path');
process.chdir(path.resolve(__dirname, '..'));
// Online integration test using the real components served by the official HA demo.
// Requires Playwright and an installed browser. PLAYWRIGHT_CHANNEL can select msedge.

(async () => {
  const browser = await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL});
  try {
    const page = await browser.newPage({viewport:{width:1000,height:1100}});
    const demoHtml=await (await page.request.get('https://demo.home-assistant.io/')).text();
    page.on('pageerror',e=>console.log('PAGE:',e.message));
    await page.route('http://card.test/**',async route=>{
      const url=new URL(route.request().url());
      if(url.pathname==='/') return route.fulfill({contentType:'text/html',body:demoHtml.replace(/<script>window.__CF[\s\S]*?<\/script>/g,'')});
      if(url.pathname.startsWith('/cdn-cgi/')) return route.fulfill({body:''});
      try {const response=await route.fetch({url:'https://demo.home-assistant.io'+url.pathname+url.search,timeout:30000});await route.fulfill({response});}
      catch {await route.abort();}
    });
    await page.goto('http://card.test/');
    await page.waitForFunction(()=>customElements.get('ha-demo'),{},{timeout:90000});
    await page.waitForFunction(()=>typeof window.loadCardHelpers==='function',{},{timeout:90000});
    console.log('Demo loaded');
    console.log(await page.evaluate(()=>({helpers:typeof window.loadCardHelpers,forms:!!customElements.get('ha-form'),hass:!!document.querySelector('ha-demo').hass})));
    await page.addScriptTag({type:'module',content:fs.readFileSync('custom_components/advanced_tv_remote/www/advanced-tv-remote-card.js','utf8')});
    await page.waitForFunction(()=>customElements.get('advanced-tv-remote-card-editor'));
    console.log(await page.evaluate(async()=>{
      const demo=document.querySelector('ha-demo');
      function findHass(root){for(const el of root.querySelectorAll('*')){if(el.hass)return el.hass;if(el.shadowRoot){const hass=findHass(el.shadowRoot);if(hass)return hass;}}}
      const hass=demo.hass||findHass(document);
      if(!hass)throw Error('Demo hass unavailable');
      const channels=Array.from({length:500},(_,i)=>({id:`channel${i}`,name:`Canale ${i}`}));
      const editor=document.createElement('advanced-tv-remote-card-editor');
      editor.hass={...hass,callWS:async message=>message.type.endsWith('/sources')?[{entry_id:'source1',title:'Guida italiana'}]:message.type.endsWith('/channels')?channels:{}};
      editor.setConfig({type:'custom:advanced-tv-remote-card',config_entry_id:'source1',channels:[{channel_id:'channel20',tap_action:{action:'toggle',entity:'switch.tv'}},{channel_id:'channel30'}]});
      document.querySelector('ha-demo').style.display='none'; document.querySelector('#ha-launch-screen')?.remove();document.body.style.cssText='opacity:1;visibility:visible';
      editor.style.cssText='display:block;max-width:600px;padding:24px';document.body.append(editor);
      window.testEditor=editor;window.savedConfigs=[];editor.addEventListener('config-changed',e=>savedConfigs.push(e.detail.config));
      return 'Editor mounted with real Home Assistant components';
    }));
    await page.waitForFunction(()=>!!customElements.get('ha-form-expandable'),{},{timeout:90000});
    const editor=page.locator('advanced-tv-remote-card-editor');
    const first=editor.locator('section').nth(0);
    const second=editor.locator('section').nth(1);
    await first.locator('ha-expansion-panel').locator('#summary').click();
    await page.waitForFunction(()=>testEditor.shadowRoot.querySelector('section > ha-form').schema[0].expanded);
    await first.locator('ha-selector-select').waitFor({state:'visible'});
    console.log('Native panel expanded');
    await first.locator('ha-selector-select').locator('ha-select').click();
    const nativeSelect=first.locator('ha-selector-select').locator('ha-select');
    const options=nativeSelect.locator('ha-dropdown-item');
    if(await options.count()!==500)throw Error('Missing native options');
    const rows=await options.evaluateAll(items=>items.slice(0,20).map(item=>{const r=item.getBoundingClientRect();return {y:r.y,h:r.height}}));
    if(rows.some((row,i)=>row.h<30||(i&&row.y<rows[i-1].y+rows[i-1].h-1)))throw Error('Overlapping native options');
    if(process.env.EDITOR_SCREENSHOTS)await page.screenshot({path:path.join(process.env.EDITOR_SCREENSHOTS,'native-editor-menu.png')});
    await options.filter({hasText:/^\s*Canale 499\s*$/}).click();
    await page.waitForFunction(()=>savedConfigs.at(-1)?.channels[0]?.channel_id==='channel499');
    if(await page.evaluate(()=>savedConfigs.at(-1).channels[0].tap_action.entity)!=='switch.tv')throw Error('Action lost');
    const nameField=first.locator('ha-selector-text').locator('input');
    await nameField.fill('TV Salotto');await nameField.press('Tab');
    await page.waitForFunction(()=>savedConfigs.at(-1)?.channels[0]?.name==='TV Salotto');
    await first.getByRole('heading',{name:'TV Salotto',exact:true}).waitFor({state:'visible'});
    await first.locator('ha-expansion-panel').locator('#summary').click();
    await second.locator('ha-expansion-panel').locator('#summary').click();
    if(await first.locator('ha-expansion-panel').getAttribute('expanded')!==null)throw Error('Panel did not collapse');
    await first.locator('ha-expansion-panel').locator('#summary').click();
    await nameField.fill('');await nameField.press('Tab');
    await page.waitForFunction(()=>!('name' in savedConfigs.at(-1).channels[0]));
    await editor.getByText('Nuovo canale',{exact:true}).click();
    await page.waitForFunction(()=>savedConfigs.at(-1)?.channels.length===3);
    const added=editor.locator('section').nth(2);
    await added.locator('ha-expansion-panel[expanded]').waitFor({state:'visible'});
    await first.getByText('Rimuovi canale',{exact:true}).click();
    await page.waitForFunction(()=>savedConfigs.at(-1)?.channels.length===2);
    const saved=await page.evaluate(()=>savedConfigs.at(-1));
    if(saved.channels[0].channel_id!=='channel30')throw Error('Wrong channel removed');
    const formState=await page.evaluate(()=>testEditor.shadowRoot.querySelectorAll('section > ha-form')[0].schema[0].expanded);
    if(!formState)throw Error('Expanded state moved to wrong channel');
    if(process.env.EDITOR_SCREENSHOTS)await page.screenshot({path:path.join(process.env.EDITOR_SCREENSHOTS,'native-editor-expanded.png')});
    await page.evaluate(()=>{testEditor.setConfig({...savedConfigs.at(-1),channels:[{channel_id:'channel20',name:'TV Salotto'}]});const card=document.createElement('advanced-tv-remote-card');card.setConfig({...savedConfigs.at(-1),channels:[{channel_id:'channel20',name:'TV Salotto'}]});window.testCard=card;document.body.append(card);});
    await page.waitForFunction(()=>testCard.shadowRoot.querySelector('.logo-fallback')?.textContent==='TV Salotto');
    console.log('PASS: native HA menu with 500 non-overlapping rows, selection, actions, custom names, empty-name fallback, independent collapse, add/remove and card title');
  } finally {await browser.close();}
  process.exit(0);
})().catch(e=>{console.error(e);process.exit(1)});

