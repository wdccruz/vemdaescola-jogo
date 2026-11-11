'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../fisica.js'),'utf8');
const P=vm.runInNewContext(source+'\nPhysics');
const dt=1/120;
const ground={x:0,y:280,w:700,h:90};
const tick=(p,{dir=0,hold=false,press=false,release=false,solids=[ground],crate=null}={})=>
  P.tickPlayer(p,dt,dir,hold,press,release,solids,crate);
const settle=(p,solids)=>{ for(let i=0;i<9;i++)tick(p,{solids}); };
function apex(full) {
  const p=P.body(80,226);
  settle(p);
  tick(p,{hold:true,press:true});
  let y=p.y;
  for(let i=0;i<150;i++){
    tick(p,{hold:full||i<10,release:!full&&i===10});
    y=Math.min(y,p.y);
  }
  assert.equal(p.on,ground);
  return 226-y;
}
const tall=apex(true), short=apex(false);
assert.ok(tall>130 && short>50 && short<tall-25,{tall,short});

const wall={x:230,y:120,w:28,h:160};
const p=P.body(60,226);
settle(p,[ground,wall]);
for(let i=0;i<120;i++)tick(p,{dir:1,solids:[ground,wall]});
assert.equal(p.x,wall.x-p.w);
assert.equal(p.vx,0);

const c=P.body(182,227,49,53);
const mover=P.body(102,226);
settle(mover);
for(let i=0;i<120;i++){
  P.tickCrate(c,dt,[ground]);
  tick(mover,{dir:1,crate:c});
}
assert.ok(c.x>350);
assert.ok(mover.x+mover.w<=c.x+.1);

const edge={x:0,y:280,w:130,h:23,oneWay:true};
const runner=P.body(104,226);
settle(runner,[edge]);
while(runner.on)tick(runner,{dir:1,solids:[edge]});
for(let i=0;i<5;i++)tick(runner,{dir:1,solids:[edge]});
tick(runner,{press:true,hold:true,solids:[edge]});
assert.ok(runner.vy<-400,'tolerância após sair da borda');

const falling=P.body(70,206);
falling.vy=370;
tick(falling,{press:true,hold:true});
let bounced=false;
for(let i=0;i<20;i++){
  tick(falling,{hold:true});
  if(falling.vy<-400)bounced=true;
}
assert.ok(bounced,'salto solicitado antes de tocar o chão');

const lift={id:'lift',x:100,y:240,w:120,h:20,oneWay:true,moving:true,dx:0,dy:0};
const rider=P.body(137,186);
settle(rider,[lift]);
for(let i=0;i<60;i++){
  lift.dx=1.2;lift.dy=-1.4;lift.x+=lift.dx;lift.y+=lift.dy;
  tick(rider,{solids:[lift]});
  assert.equal(rider.on,lift);
  assert.ok(Math.abs(rider.y+rider.h-lift.y)<.01);
}
assert.ok(Math.abs(rider.x-209)<.01);
console.log('OK física: aceleração, colisões, caixa, salto variável, tolerância, buffer e transporte por plataforma');

