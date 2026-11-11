'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {server,prefix,root}=require('./servidor.cjs');
const {chromium}=require(process.env.MILA_PLAYWRIGHT||'playwright');
const app=server(),captures=process.env.MILA_CAPTURAS;
const state=page=>page.evaluate(()=>{
  const w=expedition.world,p=w.player;
  return {x:p.x+15,y:p.y+54,vy:p.vy,on:p.on?.id??p.on?.style,where:w.index,
    slots:w.state?.slots,counts:w.state?.counts,solved:w.state?.solved,carry:w.carry,checkpoint:w.state?.checkpoint,near:w.near?.label};
});
const wait=async(page,fn,arg,timeout=6300)=>{
  try {await page.waitForFunction(fn,arg,{timeout});}
  catch(error){throw new Error(JSON.stringify(await state(page)),{cause:error});}
};
const nap=(page,ms)=>page.waitForTimeout(ms);
const land=(page,y)=>wait(page,y=>expedition.world.player.on&&Math.abs(expedition.world.player.y+54-y)<3,y);
const shot=(page,name)=>captures&&page.screenshot({path:path.join(captures,name+'.png'),fullPage:true,animations:'disabled'});
const plans=[
  [[2,1,3],[1,2,4,5],[6,6,6,6,2]],
  [[1,2],[0,1],[4,2,0]],
  [[2,1,0],[0,1],[1,3]],
  [[1,2],[0,2,3],[1,1,0,1]],
  [[2,0,1],[3,0,1],[4,3,3]]
];

function keys(page){
  async function walk(x){
    const from=(await state(page)).x;
    if(Math.abs(from-x)<8)return;
    const dir=x>from?1:-1,key=dir>0?'ArrowRight':'ArrowLeft';
    await page.keyboard.down(key);
    try {await wait(page,([x,dir])=>(expedition.world.player.x+15-x)*dir>=-2,[x,dir]);}
    finally {await page.keyboard.up(key);}
  }
  async function tap(key){
    await page.keyboard.down(key);await nap(page,34);await page.keyboard.up(key);await nap(page,34);
  }
  async function jump(x,y){
    await nap(page,128);
    await page.keyboard.down('Space');
    try {
      await wait(page,()=>expedition.world.player.vy<-180);
      if(x!==null)await walk(x);
      await land(page,y);
    } finally {await page.keyboard.up('Space');}
  }
  return {walk,tap,jump};
}

async function solveSlots(page,k,p,plan){
  for(const [index,id] of plan.entries()){
    const o=p.objects[id],f=p.fixtures[index];
    await k.walk(o.x);
    if(o.y<p.y)await k.jump(null,o.y);
    else await land(page,p.y);
    await k.tap('e');
    await wait(page,id=>expedition.world.carry?.id===id,id);
    await k.walk(f.x);
    await land(page,p.y);
    await nap(page,140);
    await k.walk(f.x);
    await k.tap('e');
    await wait(page,([name,index,id])=>expedition.world.state.slots[name]?.[index]===id,[p.id,index,id]);
  }
}

async function solveBins(page,k,p,plan){
  for(const [i,n] of plan.entries()){
    if(!n)continue;
    await k.walk(p.fixtures[i].x);
    for(let j=0;j<n;j++)await k.tap('e');
    await wait(page,([id,index,n])=>expedition.world.state.counts[id][index]===n,[p.id,i,n]);
  }
}

async function lens(page,k,l){
  await k.walk(2364);
  await nap(page,140);
  await wait(page,()=>{
    const w=expedition.world,lift=w.solids.find(s=>s.id==='lens-lift');
    return (w.time/lift.period)%1<.12;
  });
  await page.keyboard.down('Space');
  try {
    await k.walk(2433);
    await wait(page,()=>expedition.world.player.on?.id==='lens-lift');
  } finally {await page.keyboard.up('Space');}
  await wait(page,y=>expedition.world.player.on?.id==='lens-lift'&&expedition.world.player.y+54<y+61,l.lens.y);
  await k.jump(2564,l.lens.y);
  await k.walk(l.lens.x);
  await k.tap('e');
  await wait(page,()=>expedition.world.index===-1);
}

async function campaign(page){
  const k=keys(page);
  await shot(page,'01-capa');
  await page.locator('#start').click();
  await page.locator('#skip').click();
  await land(page,600);
  assert.match(await page.locator('#guide').textContent(),/Próxima ilha/);
  await shot(page,'02-farol');
  for(let i=0;i<5;i++){
    const portal=await page.evaluate(i=>HUB.portals[i],i);
    await k.walk(portal);
    await k.tap('e');
    await wait(page,i=>expedition.world.index===i,i);
    const l=await page.evaluate(()=>expedition.world.level);
    await land(page,l.ground);
    await page.evaluate(()=>SceneArt.load(expedition.world.level.id).decode());
    for(const [step,p] of l.stage.entries()){
      if(i===0&&step===0){
        assert.match(await page.locator('#guide').textContent(),/aperte E para pegá-la/);
        await k.walk(185);await k.tap('e');
        assert.match(await page.locator('#guide').textContent(),/Você leva 100/);
        await k.walk(p.fixtures[0].x);await k.tap('e');
        assert.equal((await state(page)).slots[p.id][0],0);
        assert.match(await page.locator('#notice').textContent(),/posição das centenas/);
        await k.tap('q');assert.equal((await state(page)).carry.id,0);
        await k.tap('q');assert.equal((await state(page)).carry,null);
        await shot(page,'03-oficina');
      }
      if(p.kind==='slots')await solveSlots(page,k,p,plans[i][step]);
      else await solveBins(page,k,p,plans[i][step]);
      await wait(page,step=>expedition.world.state.solved[step],step);
      if(i===0&&step===0)assert.match(await page.locator('#guide').textContent(),/O portão abriu/);
      if(step===1){
        await k.walk(1765);
        await wait(page,()=>expedition.world.state.checkpoint>=1750);
        await shot(page,'ilha-'+(i+1)+'-travessia');
        if(i===0){
          await page.reload();
          await page.locator('#resume').click();
          await land(page,l.ground);
          assert.equal((await state(page)).checkpoint,1750);
          assert.deepEqual((await state(page)).solved,[true,true,false]);
        }
      }
    }
    await shot(page,'ilha-'+(i+1)+'-mecanismo');
    await lens(page,k,l);
    await wait(page,n=>expedition.profile.lenses.length===n,i+1);
    console.log('OK ilha',i+1,l.name,'três mecanismos, checkpoint, elevador e lente');
    if(process.env.MILA_ATE==='ilha1')return;
  }
  await k.walk(1755);
  await k.tap('e');
  await page.locator('#ending').waitFor();
  await shot(page,'09-final');
  await page.reload();
  await page.locator('#resume').click();
  await page.locator('#ending').waitFor();
  await page.locator('#restart').click();
  await page.locator('#skip').click();
  assert.equal(await page.locator('#lens-count').textContent(),'0/5');
  console.log('OK farol final, recarga e reinício');
}

async function mobile(browser,url){
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2,reducedMotion:'reduce'});
  try{
    await page.goto(url);
    await page.locator('#start').tap();
    await page.locator('#skip').tap();
    const cdp=await page.context().newCDPSession(page);
    const send=(type,touchPoints)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints});
    const point=async(name,id)=>{
      const box=await page.locator('[data-control="'+name+'"]').boundingBox();
      return {x:box.x+box.width/2,y:box.y+box.height/2,id};
    };
    const right=await point('right',1),jump=await point('jump',2);
    await send('touchStart',[right]);
    await wait(page,()=>expedition.world.player.x>325);
    await send('touchEnd',[]);
    await page.locator('[data-control=act]').tap();
    await wait(page,()=>expedition.world.index===0);
    await send('touchStart',[jump]);
    await send('touchStart',[jump,right]);
    await wait(page,()=>expedition.world.player.vy<-150&&expedition.world.player.x>114);
    await send('touchEnd',[]);
    await wait(page,()=>expedition.world.player.on);
    await send('touchStart',[right]);
    await wait(page,()=>expedition.world.player.x+15>=176);
    await send('touchEnd',[]);
    await wait(page,()=>expedition.world.near?.kind==='object'&&expedition.world.near.id===0);
    await page.locator('[data-control=act]').tap();
    await wait(page,()=>expedition.world.carry?.id===0);
    await page.locator('[data-control=undo]').tap();
    await wait(page,()=>expedition.world.carry===null);
    await shot(page,'08-celular');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    console.log('OK toque emulado: andar, agir, salto com direção simultânea, movimento reduzido e largura');
  }finally{await page.close();}
}

async function alternatives(browser,url){
  const page=await browser.newPage({viewport:{width:1260,height:850}});
  try {
    await page.addInitScript(()=>localStorage.setItem('mila-farol-cinco-mundos-v1',JSON.stringify({
      version:1,location:3,hubX:1185,lenses:[0,1,2],secrets:[],islands:{},finished:false
    })));
    await page.goto(url);
    await page.locator('#resume').click();
    const l=await page.evaluate(()=>expedition.world.level),k=keys(page);
    await page.locator('#controls').click();
    const right=page.locator('[data-control=right]');
    const box=await right.boundingBox();
    assert.ok(box);
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
    await page.mouse.down();
    await wait(page,()=>expedition.world.player.x>140);
    await page.mouse.up();
    await page.locator('#controls').click();
    await solveSlots(page,k,l.stage[0],[0,3]);
    await solveSlots(page,k,l.stage[1],plans[3][1]);
    await k.walk(1764);
    await solveBins(page,k,l.stage[2],[0,3,1,1]);
    assert.ok((await state(page)).solved.every(Boolean));
    console.log('OK alternativas jogadas: 2 + 5 metros, três cédulas de R$ 2, R$ 1 e 50 ¢; movimento por mouse');
  }finally{await page.close();}
}

async function run(){
  if(captures)await fs.mkdir(captures,{recursive:true});
  const base='http://127.0.0.1:'+app.address().port,url=base+prefix;
  const browser=await chromium.launch({executablePath:process.env.MILA_CHROMIUM||undefined});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:970}});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
    await page.goto(url);
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'false');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await campaign(page);
    assert.deepEqual(errors,[]);
    await page.close();
    await mobile(browser,url);
    if(process.env.MILA_ATE!=='ilha1')await alternatives(browser,url);
    const other=await browser.newPage();
    await other.goto(base+'/iframe.html');
    const iframe=other.frameLocator('iframe');
    await iframe.locator('#start').click();await iframe.locator('#skip').click();
    assert.equal(await iframe.locator('#scene').isVisible(),true);
    await other.goto(pathToFileURL(path.join(root,'index.html')).href);
    await other.locator('#start').click();await other.locator('#skip').click();
    assert.equal(await other.locator('#scene').isVisible(),true);
    console.log('OK subdiretório, iframe, abertura direta e console limpo');
  }finally{await browser.close();}
}
app.listen(0,'127.0.0.1',async()=>{
  try{await run();}catch(error){console.error(error);process.exitCode=1;}finally{app.close();}
});

