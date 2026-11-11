'use strict';

const Illustration = (() => {
  const {shape,oval,line}=Characters;
  const images=new Map();
  const rand=i=>{const x=Math.sin(i*127.1+31.7)*43758.5453;return x-Math.floor(x);};
  const visible=(x,y,camera,buffer=130)=>x>camera.x-buffer&&x<camera.x+camera.w+buffer&&y>camera.y-buffer&&y<camera.y+camera.h+buffer;

  function load(art) {
    if (!images.has(art)) {
      const image=new Image();
      image.src='./assets/'+art+'.webp';
      images.set(art,image);
    }
    return images.get(art);
  }

  function star(g,x,y,r,color) {
    g.beginPath();
    g.moveTo(x,y-r);
    g.quadraticCurveTo(x+1,y-1,x+r,y);
    g.quadraticCurveTo(x+1,y+1,x,y+r);
    g.quadraticCurveTo(x-1,y+1,x-r,y);
    g.quadraticCurveTo(x-1,y-1,x,y-r);
    g.fillStyle=color;g.fill();
  }

  function backdrop(g,world,cam,time,reduced) {
    const image=load(world.level.art);
    const [deep,light]=world.level.palette;
    g.fillStyle=deep;g.fillRect(0,0,cam.w,cam.h);
    if (image.complete&&image.naturalWidth) {
      const ratio=image.naturalWidth/image.naturalHeight;
      const w=Math.max(cam.w*1.19,cam.h*ratio);
      const h=w/ratio;
      const nx=cam.x/Math.max(1,world.level.width-cam.w);
      const ny=cam.y/Math.max(1,world.level.height-cam.h);
      g.drawImage(image,-(w-cam.w)*(.09+nx*.81),-(h-cam.h)*(.28+ny*.5),w,h);
    }
    const shade=g.createLinearGradient(0,0,0,cam.h);
    shade.addColorStop(0,'#152a3b00');
    shade.addColorStop(.58,deep+'13');
    shade.addColorStop(1,deep+'e3');
    g.fillStyle=shade;g.fillRect(0,0,cam.w,cam.h);
    g.fillStyle=light+'1e';
    for (let i=0;i<55;i++) {
      const x=(rand(i*3)*cam.w-cam.x*.09+cam.w*4)%cam.w;
      const y=rand(i*3+1)*cam.h;
      if (i%7===0) star(g,x,y,2.6,'#ffe5a981');
      else oval(g,x,y,1+rand(i*3+2)*1.25,1.1,'#ffe9bd4c');
    }
    if (!reduced && world.fade>0) {
      g.fillStyle='rgba(255,228,177,'+(world.fade*.42)+')';
      g.fillRect(0,0,cam.w,cam.h);
    }
  }

  function arched(g,x,y,w,h,fill,stroke) {
    g.beginPath();g.moveTo(x,y);g.lineTo(x,y-h+w/2);
    g.quadraticCurveTo(x+w*.5,y-h-w*.35,x+w,y-h+w/2);
    g.lineTo(x+w,y);g.closePath();
    g.fillStyle=fill;g.fill();
    g.strokeStyle=stroke;g.lineWidth=2;g.stroke();
  }

  function house(g,i) {
    const wall=i%2?'#935f69':'#598982';
    shape(g,'M-68 1-57-102 51-108 66 1Z',wall,'#344d53',2);
    shape(g,'M-76-99Q-51-112-25-148L-1-180Q26-129 74-101L54-94-56-92Z',i%2?'#704e66':'#375e63','#2d4753',2);
    shape(g,'M-66-100q36-23 65-80 19 46 63 77m-105-6q30-11 49-36m5 13 24 22','','#d7ab8770',2);
    shape(g,'M35-139l-4-30 15-6 6 52Z','#a16c69','#4a4859',1.5);
    arched(g,-49,-42,29,45,'#f4bd78','#6d5658');
    arched(g,21,-49,26,40,'#edc785','#5d5057');
    arched(g,-15,1,33,63,'#487878','#354f54');
    line(g,[[-34,-78],[-34,-42]],'#946555',2);
    line(g,[[-47,-58],[-21,-58]],'#946555',2);
    line(g,[[34,-84],[34,-50]],'#916454',2);
    line(g,[[23,-66],[46,-66]],'#916454',2);
    oval(g,11,-16,2,2,'#ffd498');
    shape(g,'M-52-38h37l-4 12h-28Zm69-8h34l-4 12H22Z','#784f5a','#584353',1);
    for(let n=0;n<13;n++) {
      const x=n<7?-50+n*5:20+(n-7)*5;
      oval(g,x,n<7?-40-rand(n)*5:-48-rand(n)*5,3,2.7,['#e8a29c','#cc8da1','#b7b47a'][n%3]);
    }
    for(let n=0;n<7;n++) line(g,[[-54+n*17,-9-rand(n)*13],[-47+n*17,-9-rand(n)*13]],'#f2c6a454',1);
  }

  function willow(g,i) {
    shape(g,'M-21 4Q-7-39-21-104-54-126-62-167-40-153-17-138-39-177-24-216-17-170 4-142 31-164 47-192 44-142 17-116 5-51 26 4Z','#344b58','#263947',1.5);
    shape(g,'M-10-3q7-54-6-107 16 23 16 48m13-65q24-20 30-40','','#75968b',2);
    shape(g,'M-96-151Q-93-189-62-198-61-232-29-232-1-255 24-229 59-241 73-205 106-199 100-165 95-138 68-143 38-121 13-147-7-135-32-153-69-126-96-151Z','#477d72','#32565c',1.65);
    shape(g,'M-89-170q12-28 41-21-4-31 26-32 26-17 43 1 31-10 49 25-54-20-81 5-39-7-78 22Z','#8ca58a83');
    for(let n=0;n<24;n++){
      const x=rand(i*8+n*4)*160-80,y=-152-rand(i+n*3)*65;
      oval(g,x,y,2+rand(n)*4,1.55,n%3?'#b2ba8b85':'#e2ae86ba');
    }
  }

  function bookStack(g) {
    for(let i=0;i<7;i++){
      const x=-48+rand(i)*19,y=-9-i*13,w=87-rand(i+10)*27;
      g.fillStyle=['#aa7887','#738d8c','#8b7595','#b68d74'][i%4];g.fillRect(x,y,w,12);
      g.strokeStyle='#3d415a';g.strokeRect(x,y,w,12);
      g.fillStyle='#e0c398';g.fillRect(x+w*.62,y+2,w*.35,8);
      line(g,[[x+5,y+2],[x+5,y+10]],'#f2d29a',1.5);
    }
  }

  function gear(g,r,active,time) {
    g.rotate(active?time*.6:0);
    g.beginPath();
    for(let i=0;i<48;i++){
      const angle=i*Math.PI/24, v=i%4<2?r:r*.82;
      const x=Math.cos(angle)*v,y=Math.sin(angle)*v;
      if(!i)g.moveTo(x,y);else g.lineTo(x,y);
    }
    g.closePath();g.fillStyle=active?'#ecc47f':'#a57e78';g.fill();g.strokeStyle='#624958';g.lineWidth=2;g.stroke();
    oval(g,0,0,r*.51,r*.51,'#544b65','#f2cc8c',2);
    for(let i=0;i<4;i++){
      const t=i*Math.PI*.5;
      line(g,[[0,0],[Math.cos(t)*r*.47,Math.sin(t)*r*.47]],'#c99a71',3);
    }
    oval(g,0,0,r*.12,r*.12,'#ffe6a2');
  }

  function prop(g,x,y,type,s,i,time,state) {
    g.save();g.translate(x,y);g.scale(s,s);
    if(type==='house'){g.globalAlpha=.84;house(g,i);}
    if(type==='willow'){g.globalAlpha=.57;willow(g,i);}
    if(type==='books')bookStack(g);
    if(type==='cave'){
      shape(g,'M-85 0Q-80-43-64-80L-43-87-21-116 18-109 53-88 74-65 89 0Z','#37515bd9','#34545b',2);
      arched(g,-49,0,98,81,'#263946','#6c7e77');
      shape(g,'M-76-17l11-25m9-30 20-6m58-16 29 12 12 17M67-41l12 32','', '#a2a98885',2.5);
      for(let n=0;n<7;n++)star(g,-34+n*11,-19-rand(n+1)*41,2.5,'#f8cc84a4');
    }
    if(type==='mushroom'){
      shape(g,'M-11 1q7-21 2-45h17Q4-17 16 1Z','#d7b791','#5c505d',1.5);
      shape(g,'M-37-38q7-27 35-31 31-1 40 31-40 18-75 0Z','#bc7b8b','#574e64',1.6);
      shape(g,'M-35-38q39 10 72 0','','#ffd8a5',2);
      for(let n=0;n<8;n++)oval(g,-26+rand(n+3)*51,-43-rand(n)*16,2.5,2,'#ffd5a0');
    }
    if(type==='clock'){
      shape(g,'M-44 0v-62Q-44-111 0-111q44 0 44 49V0Z','#59566b','#332d4a',2);
      shape(g,'M-37 0v-62Q-37-102 0-102q37 0 37 40V0Z','#7a667a','#c39684',1.5);
      g.save();g.translate(0,-62);gear(g,31,state.has('engine'),time);g.restore();
    }
    if(type==='arch'){
      arched(g,-39,0,78,105,'#4f526b','#dec192');
      const portal=g.createLinearGradient(0,-94,0,0);
      portal.addColorStop(0,'#f4d298');portal.addColorStop(1,'#586879');
      arched(g,-29,-4,58,87,portal,'#786879');
      shape(g,'M-39-13h10m-10-17h10m58 0h10m-10 17h10M-39 0h78','','#b39183',1.8);
      star(g,0,-61,12,'#fff0b7');
      if(state.has('end')) star(g,0,-52,29,'#fff6ca');
    }
    if(type==='post'){
      line(g,[[0,0],[0,-94],[18,-94],[20,-83]],'#4c4b54',4);
      oval(g,20,-73,12,13,'#ffd38068');
      oval(g,20,-73,6,9,'#ffe19b','#866659',1);
    }
    g.restore();
  }

  function platform(g,s,level) {
    const [deep,light,rose,gold,edge,shadow]=level.palette;
    const {x,y,w,h,style}=s;
    g.save();g.translate(x,y);
    if(style==='root'){
      shape(g,`M0 0Q${w*.45} -10 ${w} 0v6Q${w*.78} 32 ${w*.47} 20T0 7Z`,'#8b7264','#3b5050',2);
      for(let n=0;n<9;n++){
        const dx=14+n*w/9;
        g.save();g.translate(dx,3);
        shape(g,'M0 10Q-4 1-12-5-1-9 5 5 9-4 19-3 15 6 4 10Z','#86a783','#476954',1.2);
        g.restore();
      }
      line(g,[[0,1],[w,1]],'#cbcb8c',3);
      g.restore();
      return;
    }
    const wood=style==='bridge'||style==='lift';
    const top=wood?'#e5bd85':style==='roof'?rose:style==='books'?'#a18b9d':light;
    const fill=g.createLinearGradient(0,0,0,h);
    fill.addColorStop(0,wood?'#986d67':edge);fill.addColorStop(1,shadow);
    g.beginPath();g.moveTo(0,0);g.lineTo(w,0);g.lineTo(w-3,h-4);
    for(let i=Math.floor(w/30);i>0;i--)g.lineTo(i*30,h-5-rand(i+x)*9);
    g.lineTo(3,h-3);g.closePath();
    g.fillStyle=fill;g.fill();g.strokeStyle=deep;g.lineWidth=2;g.stroke();
    g.save();g.clip();
    for(let j=0;j<Math.ceil(w/25);j++){
      const dx=j*25;
      if(wood){
        line(g,[[dx,1],[dx+4,h]],'#4e4856',1.45);
        oval(g,dx+8,8,1.3,1.1,'#f8d9a0');
      } else if(style==='books'){
        line(g,[[dx,4],[dx,14]],'#ceb59a',1);
        line(g,[[dx+4,4],[dx+4,14]],'#ceb59a',1);
      } else {
        const yy=7+rand(j*9+x)*Math.min(h*.63,43);
        line(g,[[dx+2,yy],[dx+9,yy-2],[dx+17,yy]],'#eccca64a',1.2);
      }
      if(style==='ground'&&j%3===1){
        const yy=28+rand(j)*24;
        oval(g,dx,yy,9,2,'#8dadac22');
        line(g,[[dx+4,yy+20],[dx+16,yy+17]],'#0b273d70',1.2);
      }
    }
    g.restore();
    line(g,[[1,1.4],[w-1,1.4]],top,style==='ground'?5:3.3);
    if(style==='ground'){
      for(let j=1;j<w/31;j++){
        const dx=j*31, r=rand(j+x);
        if(r<.42) continue;
        line(g,[[dx,0],[dx-4,-7-r*5],[dx,0],[dx+5,-5-r*6]],light,1.6);
        if(r>.78) oval(g,dx-4,-8-r*5,2.2,2.3,rose);
      }
    }
    if(style==='lift') {
      oval(g,w/2,h-2,7,4,gold,deep,1);
      star(g,w/2,7,4,'#fff1b9');
    }
    g.restore();
  }

  function barrier(g,s) {
    g.save();g.translate(s.x,s.y);
    const gate=s.style==='gate';
    g.fillStyle=gate?'#4e4d64':'#6a586e';
    g.fillRect(0,0,s.w,s.h);
    g.strokeStyle='#d2a884';g.lineWidth=2;g.strokeRect(1,1,s.w-2,s.h-2);
    for(let y=18;y<s.h;y+=23){
      line(g,[[3,y],[s.w-3,y+4]],'#bc918377',1.5);
      if(gate) oval(g,s.w/2,y-5,3,3,'#e5bf87');
    }
    g.restore();
  }

  function crate(g,s) {
    g.save();g.translate(s.x,s.y);
    g.fillStyle='#a6755e';g.fillRect(0,0,s.w,s.h);
    g.strokeStyle='#543e4d';g.lineWidth=2;g.strokeRect(1,1,s.w-2,s.h-2);
    g.strokeStyle='#d2a574';g.strokeRect(5,5,s.w-10,s.h-10);
    line(g,[[6,s.h-7],[s.w-7,7]],'#e4bb87',6);
    line(g,[[7,s.h-7],[s.w-8,7]],'#976b60',1.3);
    for(const x of [8,s.w-8])for(const y of [8,s.h-8])oval(g,x,y,1.6,1.6,'#f8d397');
    g.restore();
  }

  function token(g,item,time,reduced) {
    const y=item.y+(reduced?0:Math.sin(time*4+item.x)*4);
    g.save();g.translate(item.x,y);
    const glow=g.createRadialGradient(0,0,4,0,0,29);
    glow.addColorStop(0,'#ffe38e93');glow.addColorStop(1,'#ffe38e00');
    oval(g,0,0,29,29,glow);
    if(item.icon==='graphite'){
      Characters.pencil(g,0,0,.82,true);
      shape(g,'M-55-46h110q6 0 6 6v8q0 6-6 6H5l-5 6-5-6h-50q-6 0-6-6v-8q0-6 6-6Z','#132830ef','#e8c68c',1.25);
      g.font='700 14px Baloo, system-ui, sans-serif';
      g.textAlign='center';
      g.fillStyle='#fff0c0';
      g.fillText(Items.graphite[0],0,-31);
    }
    if(item.icon==='gear'){g.save();gear(g,16,false,0);g.restore();}
    if(item.icon==='stamp'){
      g.rotate(-.15);
      shape(g,'M-12-13h24v26h-24Z','#edb38f','#faf0c3',2);
      shape(g,'M-8-9h16V9H-8Z','#846986');
      star(g,0,0,7,'#ffe29f');
    }
    if(item.icon==='page') shape(g,'M-11-13Q0-17 12-13v23Q0 6-11 13Z','#ffe5ad','#986c72',1.45);
    if(item.icon==='page') shape(g,'M-7-7q7-4 14-2m-14 6q7-4 14-2m-14 6q7-4 14-2','', '#a37b72',1.1);
    if(item.icon==='seed') shape(g,'M-13-7q29-13 24 12Q2 18-13-7Z','#c1c27b','#5b786b',2);
    if(item.icon==='seed') line(g,[[-10,-6],[7,7]],'#f0dc96',1.5);
    star(g,17,-13,4,'#fff1be');
    g.restore();
  }

  function drawMark(g,mark,world,time) {
    const done=world.flags.has(mark.id);
    if(mark.kind==='draw' && done)return;
    const near=world.near===mark;
    const y=mark.y-(mark.kind==='draw'?28:mark.kind==='switch'?42:91);
    g.save();g.translate(mark.x,y);
    if(mark.kind==='draw'){
      g.setLineDash([5,5]);
      oval(g,0,0,21,21,near?'#413942d9':'#31474da6',near?'#fff2b1':'#f7dc9fb5',2);
      g.setLineDash([]);
      Characters.pencil(g,0,0,.73,near);
    } else if(mark.kind==='switch'){
      oval(g,0,0,22,22,done?'#b78978':'#5e5270','#efc38b',2);
      if(mark.id==='moon')shape(g,'M4-13Q-13-13-12 4 0 17 12 6 0 8-1-3 0-10 4-13Z','#f8d79c');
      else shape(g,'M-12 7Q-7-16 14-11 12 9-8 11Z','#b7d99d','#466a63',1);
    } else if(near || mark.id==='exit') {
      oval(g,0,0,13,13,'#253542dc','#eac892',1.4);
      star(g,0,0,6,'#ffe1a3');
    }
    g.restore();
  }

  function ghost(g,world,cam,time) {
    for(const s of world.level.tiles){
      if(!s.needs||world.flags.has(s.needs)||!visible(s.x+s.w/2,s.y,cam,s.w))continue;
      const ink=world.drawing?.mark.id===s.needs?world.drawing.time/world.drawing.duration:0;
      g.save();
      g.strokeStyle='#ffe7b498';g.lineWidth=2;g.setLineDash([8,7]);
      g.strokeRect(s.x,s.y,s.w,14);g.setLineDash([]);
      if(ink) {
        const fromRight=world.drawing.mark.x>s.x+s.w/2;
        const start=fromRight?s.x+s.w:s.x;
        const end=start+(fromRight?-1:1)*s.w*ink;
        g.beginPath();g.moveTo(start,s.y);g.lineTo(end,s.y);
        g.strokeStyle='#ffdd89';g.lineWidth=4;g.stroke();
        star(g,end,s.y,8,'#fff0af');
      }
      g.restore();
    }
  }

  function finalPage(g,world) {
    const ratio=world.flags.has('end')?1:world.drawing?.mark.id==='end'?world.drawing.time/world.drawing.duration:0;
    if(!ratio)return;
    g.save();g.translate(1554,242);
    const halo=g.createRadialGradient(0,0,8,0,0,133);
    halo.addColorStop(0,'#ffe9a7cb');halo.addColorStop(1,'#ffe9a700');
    oval(g,0,0,133,133,halo);
    shape(g,'M-62-48Q-18-60 0-39 18-60 62-48v88Q24 30 0 49-24 30-62 40Z','#fff0bb','#cb9b79',2.6);
    line(g,[[0,-39],[0,44]],'#c4a27d',1.5);
    g.save();
    g.beginPath();g.rect(-59,-54,118*ratio,110);g.clip();
    shape(g,'M-54 22q18-23 47 0v9q-25-8-47 0ZM9 25q20-22 43-3v10q-19-5-43 5Z','#8aac8b');
    arched(g,-47,17,34,45,'#8ca8a8','#9d706c');
    line(g,[[-30,-18],[-30,16]],'#f9dc9d',2);
    line(g,[[-46,-1],[-14,-1]],'#f9dc9d',2);
    star(g,28,-17,15,'#d9a07e');
    star(g,44,-6,6,'#c67b87');
    line(g,[[16,14],[25,19],[40,11]],'#826a82',2.3);
    g.restore();
    if(ratio<1)star(g,-58+ratio*118,36,8,'#ffffd8');
    g.restore();
  }

  function paint(g,world,cam,scale,density,reduced) {
    const time=reduced?0:world.time;
    g.setTransform(scale*density,0,0,scale*density,0,0);
    backdrop(g,world,cam,time,reduced);
    g.save();g.translate(-cam.x,-cam.y);
    world.level.scenery.forEach(([x,y,type,size],i)=>{
      if(visible(x,y,cam,270)) prop(g,x,y,type,size,i,time,world.flags);
    });
    if(world.level.plate){
      const {x,y,w}=world.level.plate;
      g.fillStyle=world.flags.has('gate')?'#f2cc8b':'#b78772';
      g.fillRect(x,y-5,w,5);
      line(g,[[x+5,y-5],[x+w-5,y-5]],'#fff0bc',1.8);
    }
    for(const s of world.solids){
      if(!visible(s.x+s.w/2,s.y,cam,s.w/2+50))continue;
      if(s.style==='gate'||s.style==='wall') barrier(g,s);else platform(g,s,world.level);
    }
    ghost(g,world,cam,time);
    if(world.crate)crate(g,world.crate);
    for(const item of world.level.items){
      if(!world.items.has(item.id)&&world.has(item.needs)&&visible(item.x,item.y,cam))token(g,item,time,reduced);
    }
    for(const mark of world.level.marks)if(visible(mark.x,mark.y,cam))drawMark(g,mark,world,time);
    const cp=world.level.checkpoint;
    if(visible(cp.x,cp.y,cam)){
      line(g,[[cp.x,cp.y],[cp.x,cp.y-72]],'#e4b687',3);
      g.save();g.translate(cp.x,cp.y-70);
      shape(g,'M0 0q15 5 30-1l-8 11 9 10q-13 4-31-1Z',world.flags.has('checkpoint')?'#f4bf79':'#d49e9e','#604d61',1);
      star(g,10,9,4,'#fff3b9');g.restore();
    }
    if(world.index===0)Characters.cora(g,339,580,time);
    if(world.fly)Characters.firefly(g,world.fly.x,world.fly.y,time);
    if(world.index===2 && world.flags.has('stair'))Characters.blot(g,1440,330,time,world.flags.has('metBlot'));
    if(world.index===2)finalPage(g,world);
    if(world.apparition>0 && world.index<2){
      g.save();g.globalAlpha=Math.min(.62,world.apparition*.48);
      Characters.blot(g,world.index===0?1001:1517,world.index===0?580:516,time);g.restore();
    }
    const p=world.player;
    Characters.dobri(g,world.pet.x,world.pet.y,time,world.pet.mode,p.face);
    Characters.nina(g,p.x+p.w/2,p.y+p.h,{...p,scale:1.28,drawing:Boolean(world.drawing),cheer:world.cheer>0,emotion:world.emotion},time);
    for(const v of world.particles){
      g.globalAlpha=Math.min(1,v.life*2.4);
      star(g,v.x,v.y,v.size,v.color);
    }
    g.globalAlpha=1;
    g.restore();
  }

  return {paint,load};
})();

