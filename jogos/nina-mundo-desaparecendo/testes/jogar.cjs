'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {server,prefix,root}=require('./servidor.cjs');
const {chromium}=require(process.env.NINA_PLAYWRIGHT||'playwright');
const app=server();
const captures=process.env.NINA_CAPTURAS;
const until=process.env.NINA_ATE||'final';

const snapshot=page=>page.evaluate(()=>{
  const {world:w,camera}=adventure;
  return {x:w.player.x+15,y:w.player.y+w.player.h,vy:w.player.vy,on:Boolean(w.player.on),
    floor:w.player.on?.id||w.player.on?.style, flags:[...w.flags],items:[...w.items],chapter:w.index,
    crate:w.crate?.x, time:w.time,cameraX:camera.x,camY:camera.y};
});
const wait=async(page,fn,arg,ms=6500)=>{
  try { await page.waitForFunction(fn,arg,{timeout:ms}); }
  catch(error) { throw new Error(JSON.stringify(await snapshot(page)),{cause:error}); }
};
const sleep=(page,ms)=>page.waitForTimeout(ms);
const shot=(page,name)=>captures&&page.screenshot({path:path.join(captures,name+'.png'),fullPage:true,animations:'disabled'});
const foot=y=>Math.round(y);
const landed=(page,y)=>wait(page,y=>adventure.world.player.on&&Math.abs(adventure.world.player.y+54-y)<4,y);

function keyboard(page) {
  const release=key=>page.keyboard.up(key);
  const press=key=>page.keyboard.down(key);
  async function walk(x) {
    const at=(await snapshot(page)).x;
    if(Math.abs(at-x)<11)return;
    const dir=x>at?1:-1;
    const key=dir>0?'ArrowRight':'ArrowLeft';
    await press(key);
    try { await wait(page,([x,dir])=>(adventure.world.player.x+15-x)*dir>=-2,[x,dir]); }
    finally {await release(key);}
  }
  async function jump(x,y) {
    await sleep(page,145);
    await press('Space');
    try {
      await wait(page,()=>adventure.world.player.vy < -170);
      if(x!==null)await walk(x);
      await landed(page,y);
    } finally {await release('Space');}
  }
  async function action(key) {
    await press(key);await sleep(page,75);await release(key);
  }
  async function draw(flag) {
    await press('x');
    try {await wait(page,id=>adventure.world.flags.has(id),flag);}
    finally {await release('x');}
  }
  return {walk,jump,action,draw,press,release};
}

async function village(page,keys) {
  await landed(page,580);
  await keys.walk(334);
  await keys.action('e');
  await page.locator('#conversation').waitFor();
  assert.equal(await page.locator('#speaker').textContent(),'Cora');
  await page.locator('#forward').click();
  assert.equal(await page.locator('#speaker').textContent(),'Nina');
  await page.locator('#skip').click();
  await keys.walk(590);
  await keys.press('x');await sleep(page,260);await keys.release('x');
  assert.ok(!(await snapshot(page)).flags.includes('bridge'));
  await keys.press('ArrowRight');
  await wait(page,()=>adventure.world.player.y>665);
  await keys.release('ArrowRight');
  await wait(page,()=>adventure.world.player.x<120 && adventure.world.player.on);
  assert.equal(foot((await snapshot(page)).y),580);
  await keys.walk(195);
  await keys.jump(null,492);
  await keys.jump(145,400);
  await keys.walk(109);
  assert.ok((await snapshot(page)).items.includes('stampV'));
  await keys.walk(261);
  await landed(page,492);
  await keys.jump(373,495);
  await keys.jump(525,403);
  assert.ok((await snapshot(page)).items.includes('graphite'));
  await keys.action('i');
  assert.match(await page.locator('#items').textContent(),/Grafite dourado/);
  await page.locator('#close-bag').click();
  await keys.walk(605);
  await landed(page,580);
  await keys.draw('bridge');
  await keys.walk(1054);
  assert.ok((await snapshot(page)).flags.includes('checkpoint'));
  await shot(page,'02-vila');
  await page.reload();
  await page.locator('#resume').click();
  await landed(page,580);
  const saved=await snapshot(page);
  assert.ok(Math.abs(saved.x-1035)<2);
  assert.ok(saved.flags.includes('bridge')&&saved.items.includes('graphite'));
  await keys.walk(1333);
  await wait(page,()=>adventure.world.flags.has('gate'));
  assert.ok((await snapshot(page)).crate>1300);
  await keys.walk(2010);
  await keys.action('e');
  await page.locator('#conversation').waitFor();
  assert.match(await page.locator('#line').textContent(),/mancha/);
  await page.locator('#skip').click();
  await wait(page,()=>adventure.world.index===1);
  console.log('OK Vila: diálogo, falha recuperada, segredo, mochila, grafite, ponte, checkpoint após recarga, placa, portão e transição');
}

async function forest(page,keys) {
  await landed(page,780);
  await keys.walk(427);
  await keys.jump(476,726);
  await keys.jump(null,613);
  await keys.jump(667,509);
  assert.ok((await snapshot(page)).items.includes('seed'));
  await keys.jump(866,411);
  assert.ok((await snapshot(page)).items.includes('stampF'));
  await keys.walk(754);
  await landed(page,509);
  await keys.walk(797);
  await landed(page,780);
  await keys.draw('vine');
  await keys.walk(1160);
  await wait(page,()=>adventure.world.flags.has('firefly'));
  assert.ok((await snapshot(page)).flags.includes('checkpoint'));
  await keys.walk(1242);
  await keys.jump(null,704);
  await wait(page,()=>adventure.world.solids.find(s=>s.id==='firelift').y>690);
  await keys.press('Space');
  await keys.walk(1323);
  await wait(page,()=>adventure.world.player.on?.id==='firelift');
  await keys.release('Space');
  const liftHeight=(await snapshot(page)).y;
  await wait(page,y=>adventure.world.player.on?.id==='firelift'&&adventure.world.player.y+54<y-20,liftHeight);
  await shot(page,'03-floresta');
  await wait(page,()=>adventure.world.player.on?.id==='firelift'&&adventure.world.player.y+54<580);
  await keys.jump(1477,516);
  await keys.walk(1508);
  await wait(page,()=>adventure.world.items.has('page'));
  await keys.walk(1933);
  await landed(page,780);
  await keys.action('e');
  await page.locator('#conversation').waitFor();
  await page.locator('#skip').click();
  await wait(page,()=>adventure.world.index===2);
  console.log('OK Floresta: caixa como degrau, copa, raiz sólida, travessia autônoma, elevador, página e transição');
}

async function ride(page,keys,id,target) {
  await keys.press('Space');
  await keys.walk(target);
  await wait(page,id=>adventure.world.player.on?.id===id,id);
  await keys.release('Space');
}

async function tower(page,keys) {
  await landed(page,1110);
  await keys.walk(295);
  await keys.draw('panel');
  await keys.walk(606);
  assert.ok((await snapshot(page)).items.includes('gear'));
  await keys.draw('engine');
  await keys.walk(675);
  await wait(page,()=>adventure.world.solids.find(s=>s.id==='gearLift').y>1050);
  await ride(page,keys,'gearLift',758);
  await wait(page,()=>adventure.world.player.on?.id==='gearLift'&&adventure.world.player.y+54<923);
  await keys.jump(933,864);
  await keys.walk(944);
  await wait(page,()=>adventure.world.flags.has('checkpoint'));
  await keys.walk(1040);
  await keys.action('e');
  await page.locator('#conversation').waitFor();
  assert.match(await page.locator('#line').textContent(),/Lua/);
  await page.locator('#skip').click();
  await keys.walk(959);
  await keys.action('e');
  await wait(page,()=>adventure.world.flags.has('moon'));
  await keys.walk(1023);
  await keys.jump(1185,762);
  await keys.walk(1186);
  assert.ok((await snapshot(page)).items.includes('stampT'));
  await keys.walk(1130);
  await keys.jump(991,649);
  await keys.action('e');
  await wait(page,()=>adventure.world.flags.has('seal'));
  await keys.walk(946);
  await wait(page,()=>adventure.world.solids.find(s=>s.id==='sealLift').y>598);
  await ride(page,keys,'sealLift',822);
  await wait(page,()=>adventure.world.player.on?.id==='sealLift'&&adventure.world.player.y+54<465);
  await keys.jump(972,407);
  await keys.walk(1086);
  await keys.draw('stair');
  await keys.walk(1240);
  await keys.jump(1380,330);
  await keys.walk(1435);
  await shot(page,'04-torre');
  await keys.action('e');
  await page.locator('#conversation').waitFor();
  assert.equal(await page.locator('#speaker').textContent(),'Borrão');
  await shot(page,'05-borrao');
  await page.locator('#skip').click();
  await keys.walk(1540);
  await keys.draw('end');
  await shot(page,'06-pagina');
  await page.locator('#ending').waitFor();
  assert.match(await page.locator('blockquote').textContent(),/Toda grande aventura começa/);
  assert.match(await page.locator('#secrets').textContent(),/3 de 3/);
  await shot(page,'08-final');
  await page.reload();
  await page.locator('#resume').click();
  await page.locator('#ending').waitFor();
  await page.locator('#restart').click();
  await page.locator('#skip').click();
  assert.deepEqual((await snapshot(page)).items,[]);
  assert.equal((await snapshot(page)).chapter,0);
  console.log('OK Torre: passagem, engrenagem, elevadores, símbolos, selo, ponte, Borrão, final e reinício');
}

async function mobile(browser,url) {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:'reduce'});
  await page.goto(url);
  await page.locator('#start').tap();
  await page.locator('#skip').tap();
  const client=await page.context().newCDPSession(page);
  const send=(type,touchPoints)=>client.send('Input.dispatchTouchEvent',{type,touchPoints});
  const point=async(name,id)=>{
    const box=await page.locator('[data-control="'+name+'"]').boundingBox();
    return {x:box.x+box.width/2,y:box.y+box.height/2,id};
  };
  const right=await point('right',1);
  const jump=await point('jump',2);
  const left=await point('left',3);
  await send('touchStart',[right]);
  await wait(page,()=>adventure.world.player.x>300);
  await send('touchEnd',[]);
  await page.locator('[data-control=use]').tap();
  await page.locator('#conversation').waitFor();
  await page.locator('#skip').tap();
  await send('touchStart',[right]);
  await wait(page,()=>adventure.world.player.x>362);
  await send('touchEnd',[]);
  await sleep(page,180);
  await send('touchStart',[jump]);
  await wait(page,()=>adventure.world.player.vy<-180);
  await landed(page,495);
  await send('touchEnd',[]);
  await send('touchStart',[jump]);
  await send('touchStart',[jump,right]);
  await wait(page,()=>adventure.world.player.x>505);
  await send('touchEnd',[]);
  await wait(page,()=>adventure.world.items.has('graphite'));
  await landed(page,403);
  await send('touchStart',[right]);
  await wait(page,()=>adventure.world.player.x>596);
  await send('touchEnd',[]);
  await landed(page,580);
  const pen=await point('draw',4);
  await send('touchStart',[pen]);
  await wait(page,()=>adventure.world.flags.has('bridge'));
  await send('touchEnd',[]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await shot(page,'07-vila-celular');
  await send('touchStart',[left]);
  await wait(page,()=>adventure.world.player.x<480);
  await send('touchEnd',[]);
  console.log('OK toque emulado: andar nos dois sentidos, pular, multitoque, agir, desenhar e movimento reduzido');
  await page.close();
}

async function run() {
  if(captures)await fs.mkdir(captures,{recursive:true});
  const base='http://127.0.0.1:'+app.address().port;
  const url=base+prefix;
  const browser=await chromium.launch({executablePath:process.env.NINA_CHROMIUM||undefined});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    page.on('response',res=>{if(res.status()>=400)errors.push(res.status()+' '+res.url());});
    await page.goto(url);
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'false');
    await shot(page,'01-capa');
    await page.locator('#sound').click();
    assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');
    await page.locator('#sound').click();
    await page.locator('#start').click();
    await page.locator('#skip').click();
    const keys=keyboard(page);
    await village(page,keys);
    if(until!=='vila'){
      await forest(page,keys);
      if(until!=='floresta')await tower(page,keys);
    }
    assert.deepEqual(errors,[]);
    await page.close();
    await mobile(browser,url);
    const embedded=await browser.newPage({viewport:{width:768,height:850}});
    await embedded.goto(base+'/iframe.html');
    const game=embedded.frameLocator('iframe');
    await game.locator('#start').click();
    await game.locator('#skip').click();
    assert.equal(await game.locator('#scene').isVisible(),true);
    const file=await browser.newPage();
    await file.goto(pathToFileURL(path.join(root,'index.html')).href);
    await file.locator('#start').click();
    await file.locator('#skip').click();
    assert.equal(await file.locator('#scene').isVisible(),true);
    console.log('OK subdiretório, iframe e abertura direta');
  } finally {await browser.close();}
}

app.listen(0,'127.0.0.1',async()=>{
  try {await run();}
  catch(error){console.error(error);process.exitCode=1;}
  finally {app.close();}
});

