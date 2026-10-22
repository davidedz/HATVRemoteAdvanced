// Browser regression tests. All HA calls are spies: no real device is contacted.
// Requires Playwright with Chromium, or PLAYWRIGHT_CHANNEL=msedge.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL});
  try {
    const page = await browser.newPage({viewport:{width:1000,height:1400},hasTouch:true});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('http://card.test/**',route=>route.fulfill({contentType:'text/html',body:'<html><body style="margin:0"></body></html>'}));
    await page.goto('http://card.test/');
    await page.addScriptTag({type:'module',content:fs.readFileSync(path.join(__dirname,'../custom_components/advanced_tv_remote/www/advanced-tv-remote-card.js'),'utf8')});
    await page.waitForFunction(()=>customElements.get('advanced-tv-remote-card'));
    await page.clock.install();await page.clock.pauseAt(new Date());
    await page.evaluate(()=>{
      window.calls=[];window.notifications=[];
      window.serviceAction=command=>({action:'perform-action',perform_action:'remote.send_command',target:{entity_id:'remote.test_receiver'},data:{device:'test_tv',command}});
      window.mount=async channels=>{
        window.card?.remove();window.calls=[];window.notifications=[];
        const card=document.createElement('advanced-tv-remote-card');window.card=card;
        card.hass={callWS:async message=>message.type.endsWith('/sources')?[{entry_id:'source1',title:'TV'}]:message.type.endsWith('/channels')?[]:{},callService:async(...args)=>{calls.push(args);if(window.failService)throw Error('Telecomando non disponibile');}};
        window.originalConfig={type:'custom:advanced-tv-remote-card',config_entry_id:'source1',channels};window.originalJson=JSON.stringify(originalConfig);
        card.setConfig(originalConfig);card.addEventListener('hass-notification',e=>notifications.push(e.detail.message));document.body.append(card);await card.updateComplete;
      };
    });
    const button=index=>page.locator('advanced-tv-remote-card').locator('button').nth(index);
    const getCalls=()=>page.evaluate(()=>calls);
    const reset=()=>page.evaluate(()=>{calls=[];});
    const userConfig=()=>page.evaluate(()=>mount([
      {channel_id:'Rai1.it',name:'Rai 1',tap_action:serviceAction('num1')},
      {channel_id:'Rai2.it',name:'Rai 2',tap_action:{action:'none'}},
      {channel_id:'NOVE.it',name:'Nove',tap_action:serviceAction('num9')},
    ]));
    await userConfig();await button(0).click();
    assert.deepEqual(await getCalls(),[['remote','send_command',{device:'test_tv',command:'num1'},{entity_id:'remote.test_receiver'}]]);
    await page.clock.runFor(350);assert.equal((await getCalls()).length,1);
    await reset();await button(2).click();assert.equal((await getCalls())[0][2].command,'num9');
    await reset();await button(0).click();await button(2).click();assert.deepEqual((await getCalls()).map(c=>c[2].command),['num1','num9']);
    await reset();await button(0).dblclick();assert.equal((await getCalls()).length,2);
    await reset();const box=await button(0).boundingBox();await page.mouse.move(box.x+30,box.y+30);await page.mouse.down();await page.clock.runFor(600);await page.mouse.up();assert.equal((await getCalls()).length,1);
    await reset();await button(0).focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');assert.equal((await getCalls()).length,2);
    await reset();await button(1).click();assert.equal((await getCalls()).length,0);
    await reset();await button(0).tap();assert.equal((await getCalls())[0][2].command,'num1');
    assert.equal(await page.evaluate(()=>JSON.stringify(originalConfig)===originalJson),true);
    await reset();await page.evaluate(()=>Object.freeze(card.hass));await button(0).click();assert.equal((await getCalls())[0][2].command,'num1');
    console.log('PASS: supplied Rai 1/Nove payloads, immediate taps, rapid taps across channels, repeated taps, long tap without hold, keyboard, none and immutable config');

    await page.evaluate(()=>mount([{channel_id:'legacy',tap_action:{action:'call-service',service:'remote.send_command',target:{entity_id:'remote.test'},service_data:{command:'legacy'}}},{channel_id:'data',tap_action:{action:'call-service',service:'remote.send_command',data:{command:'new-data'},service_data:{command:'old-data'}}}]));
    await button(0).click();await button(1).click();assert.deepEqual((await getCalls()).map(c=>c[2].command),['legacy','new-data']);
    console.log('PASS: legacy call-service, service_data and modern data precedence');

    await page.evaluate(()=>mount([{channel_id:'double',tap_action:serviceAction('tap'),double_tap_action:serviceAction('double')},{channel_id:'hold',tap_action:serviceAction('tap'),hold_action:serviceAction('hold')} ]));
    await button(0).dblclick();await page.clock.runFor(350);assert.deepEqual((await getCalls()).map(c=>c[2].command),['double']);
    await reset();await button(0).click();assert.equal((await getCalls()).length,0);await page.clock.runFor(310);assert.equal((await getCalls())[0][2].command,'tap');
    await reset();const hold=await button(1).boundingBox();await page.mouse.move(hold.x+30,hold.y+30);await page.mouse.down();await page.clock.runFor(600);await page.mouse.up();assert.deepEqual((await getCalls()).map(c=>c[2].command),['hold']);
    await reset();await page.mouse.move(hold.x+30,hold.y+30);await page.mouse.down();await page.mouse.move(hold.x+60,hold.y+30);await page.clock.runFor(600);await page.mouse.up();assert.equal((await getCalls()).length,0);await button(1).click();assert.equal((await getCalls())[0][2].command,'tap');
    await reset();await button(0).click();await page.evaluate(()=>card.remove());await page.clock.runFor(400);assert.equal((await getCalls()).length,0);
    console.log('PASS: configured double-tap/hold, no extra taps, movement cancellation and disconnect cleanup');

    await page.evaluate(()=>{window.confirm=()=>false;return mount([{channel_id:'confirmed',tap_action:{...serviceAction('confirmed'),confirmation:{text:'Inviare comando?'}}}]);});
    await button(0).click();assert.equal((await getCalls()).length,0);
    await page.evaluate(()=>{window.confirm=()=>true;});await button(0).click();assert.equal((await getCalls())[0][2].command,'confirmed');
    console.log('PASS: modern service actions preserve confirmation and cancellation');

    await userConfig();await page.evaluate(()=>{failService=true;});await button(0).click();assert.match((await page.evaluate(()=>notifications))[0],/Telecomando non disponibile/);await page.evaluate(()=>{failService=false;});
    assert.deepEqual(errors,[]);
    console.log('PASS: failed service calls produce a visible HA notification without unhandled errors');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
