'use strict';

const SAVE_KEY='nina-papel-aventura-v1';
const DT=1/120;
const UI=PaperUI;
const {els}=UI;
const sine=t=>(1-Math.cos(t*Math.PI*2))*.5;

function readSave() {
  try {
    const data=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(data?.version===1&&Number.isInteger(data.chapter)&&Levels[data.chapter]&&
      Array.isArray(data.items)&&data.items.every(id=>Items[id])&&Array.isArray(data.flags)&&
      Array.isArray(data.spawn)&&data.spawn.length===2&&data.spawn.every(Number.isFinite)) return data;
  } catch { /* Storage may be unavailable inside a sandboxed iframe. */ }
  return null;
}

class Adventure {
  constructor() {
    this.canvas=els.scene;
    this.ctx=this.canvas.getContext('2d',{alpha:false});
    this.camera={x:0,y:0,w:900,h:620};
    this.saved=readSave();
    this.running=false;
    this.last=0;
    this.acc=0;
    els.resume.hidden=!this.saved;
    els.start.addEventListener('click',()=>this.begin());
    els.restart.addEventListener('click',()=>this.begin());
    els.resume.addEventListener('click',()=>this.begin(this.saved));
    els.hint.addEventListener('click',()=>this.hint());
    els.bag.addEventListener('click',()=>UI.inventory(this.world.items));
    els.recover.addEventListener('click',()=>{els.inventory.close();this.respawn();});
    const observer=new ResizeObserver(()=>this.resize());
    observer.observe(els.stage);
    requestAnimationFrame(t=>this.frame(t));
  }

  begin(saved) {
    if(saved?.finished) {
      this.openLevel(saved.chapter,saved);
      this.end(false);
      return;
    }
    UI.show('game');
    this.running=true;
    if(!saved) this.world=null;
    this.openLevel(saved?.chapter??0,saved);
    if(!saved) UI.startDialog(Intro);
    if(saved) UI.feedback('Você voltou ao último ponto salvo.');
  }

  openLevel(index,saved) {
    const level=Levels[index];
    const flags=new Set(saved?.flags);
    const items=new Set(saved?.items??this.world?.items??[]);
    const crossing=level.checkpoint.needs;
    const stranded=crossing&&flags.has('checkpoint')&&!flags.has(crossing)&&!items.has(DrawingItems[crossing]);
    if(stranded) flags.delete('checkpoint');
    const spawn=stranded ? level.spawn : saved?.spawn??level.spawn;
    const player=Physics.body(spawn[0],spawn[1]-54);
    const world={
      index,level,player,spawn:[...spawn],
      flags,items,
      tiles:level.tiles.map(tile=>({...tile,x0:tile.x,y0:tile.y,dx:0,dy:0})),
      solids:[],crate:level.crate?Physics.body(saved?.crateX??level.crate.x,level.crate.y,level.crate.w,level.crate.h):null,
      pet:{x:player.x-50,y:player.y-31,vx:0,vy:0,mode:'hover'},
      fly:index===1?{x:saved?.flags?.includes('firefly')?1165:724,y:731}:null,
      time:0,fade:1,cheer:0,hint:0,apparition:0,emotion:'',particles:[],drawing:null,near:null,endingDelay:0,
      has:key=>!key||world.flags.has(key)||world.items.has(key)
    };
    this.world=world;
    this.acc=0;
    this.updateSolids(0);
    Illustration.load(level.art);
    UI.chapter(level,index);
    UI.prompt(null);
    UI.drawProgress(0);
    this.quest();
    this.resize(true);
    this.save(Boolean(saved?.finished));
  }

  save(finished=false) {
    const w=this.world;
    const data={version:1,chapter:w.index,spawn:w.spawn,flags:[...w.flags],items:[...w.items],crateX:w.crate?.x,finished};
    this.saved=data;
    try {localStorage.setItem(SAVE_KEY,JSON.stringify(data));} catch { /* Checkpoint remains in memory. */ }
  }

  resize(snap=false) {
    if(!this.world||els.game.hidden) return;
    const w=els.stage.clientWidth,h=els.stage.clientHeight;
    if(!w||!h)return;
    this.scale=Math.max(h/(UI.touch.matches?545:620),w/1400);
    this.density=Math.min(window.devicePixelRatio||1,1.65);
    this.canvas.width=Math.round(w*this.density);
    this.canvas.height=Math.round(h*this.density);
    this.camera.w=w/this.scale;
    this.camera.h=h/this.scale;
    this.follow(0,snap||UI.motion.matches);
  }

  follow(dt,snap=false) {
    const cam=this.camera,w=this.world,p=w.player;
    const x=Physics.clamp(p.x+15+p.vx*.19-cam.w*.48,0,Math.max(0,w.level.width-cam.w));
    const y=Physics.clamp(p.y+p.h-cam.h*.77,0,Math.max(0,w.level.height-cam.h));
    const easing=snap?1:1-Math.exp(-dt*7.6);
    cam.x+=(x-cam.x)*easing;
    cam.y+=(y-cam.y)*easing;
  }

  frame(stamp) {
    const elapsed=Math.min(.05,(stamp-this.last)/1000);
    this.last=stamp;
    if(this.running&&!document.hidden) {
      if(!UI.blocked()){
        this.acc+=elapsed;
        while(this.acc>=DT) {
          this.tick(DT);
          this.acc-=DT;
          if(UI.blocked()||!this.running){this.acc=0;break;}
        }
      }
      if(this.scale) Illustration.paint(this.ctx,this.world,this.camera,this.scale,this.density,UI.motion.matches);
    }
    requestAnimationFrame(t=>this.frame(t));
  }

  updateSolids() {
    const w=this.world;
    w.solids=w.tiles.filter(tile=>w.has(tile.needs));
    for(const t of w.solids) {
      if(!t.moving)continue;
      const x=t.x,y=t.y;
      const amount=t.range*sine(w.time/t.period);
      t.x=t.x0+(t.axis==='x'?amount:0);
      t.y=t.y0-(t.axis==='y'?amount:0);
      t.dx=t.x-x;
      t.dy=t.y-y;
    }
    for(const barrier of w.level.solids) if(!w.has(barrier.until)) w.solids.push(barrier);
  }

  quest() {
    const w=this.world;
    const row=w.level.quest.find(([condition])=>!condition||!w.has(condition));
    if(els.quest.textContent!==row[1]) els.quest.textContent=row[1];
    els.count.textContent=w.items.size;
    return row;
  }

  hint() {
    const w=this.world;
    w.hint=3.4;
    const mark=w.level.marks.find(candidate=>candidate.farBank);
    const across=mark&&w.player.x+w.player.w>=mark.x-31;
    UI.feedback('Dobri: '+((across&&this.drawBlock(mark))||this.quest()[2]));
    UI.sound([554,740]);
    els.scene.focus({preventScroll:true});
  }

  respawn() {
    const w=this.world;
    w.player=Physics.body(w.spawn[0],w.spawn[1]-54);
    w.pet={x:w.spawn[0]-45,y:w.spawn[1]-95,vx:0,vy:0,mode:'rejoin'};
    w.drawing=null;
    w.emotion='worry';
    w.hint=2;
    UI.clear();
    UI.drawProgress(0);
    this.follow(0,true);
    UI.feedback('Nina voltou ao ponto salvo.');
    UI.sound([349,392,523]);
  }

  burst(x,y,count=16) {
    const w=this.world;
    w.cheer=.62;
    if(UI.motion.matches)return;
    for(let i=0;i<count;i++){
      const angle=i*2.39996;
      const speed=24+(i%7)*16;
      w.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-22,
        life:.43+i%4*.16,size:2+i%4, color:['#ffe29b','#ffb8ab','#c3e7ba'][i%3]});
    }
  }

  pickup() {
    const w=this.world,p=w.player;
    for(const item of w.level.items) {
      if(w.items.has(item.id)||!w.has(item.needs))continue;
      if(Math.abs(p.x+p.w/2-item.x)>27 || Math.abs(p.y+p.h*.5-item.y)>37)continue;
      w.items.add(item.id);
      this.burst(item.x,item.y);
      UI.feedback(Items[item.id][0]+(item.icon==='stamp'?' · Descoberta secreta!':' · Na mochila'));
      UI.sound([659,880,1047]);
      this.quest();
      this.save();
    }
  }

  activate(key,message,x,y) {
    const w=this.world;
    w.flags.add(key);
    this.burst(x,y);
    UI.sound([523,659,784]);
    if(message) UI.feedback(message);
    this.quest();
    this.save();
  }

  nearby(kind) {
    const w=this.world,p=w.player;
    let nearest, distance=Infinity;
    for(const mark of w.level.marks){
      if((kind==='draw')!==(mark.kind==='draw')||mark.kind==='draw'&&w.has(mark.id))continue;
      if(Math.abs(p.y+p.h-mark.y)>61)continue;
      const gap=Math.abs(p.x+p.w/2-mark.x);
      if(gap>76||gap>=distance)continue;
      nearest=mark;distance=gap;
    }
    return nearest;
  }

  drawBlock(mark) {
    const w=this.world;
    if(!mark) return '';
    const item=DrawingItems[mark.id];
    if(!w.has(item)){
      const name=Items[item][0].toLowerCase();
      if(mark.farBank) return 'Falta '+name+'. Use Mochila → Voltar ao ponto salvo.';
      if(item==='graphite') return 'Pegue o grafite dourado no telhado à direita de Cora.';
      return 'Pegue '+name+' para usar o lápis aqui.';
    }
    return w.has(mark.needs)?'':'Resolva o desafio anterior para desenhar aqui.';
  }

  draw(mark,dt,held,block) {
    const w=this.world,p=w.player;
    if(!mark||!held||!p.on) {
      w.drawing=null;
      UI.drawProgress(0);
      return;
    }
    if(block){
      if(w.drawing?.mark!==mark){
        w.drawing={mark,time:0,duration:1,locked:true};
        UI.feedback(block);
      }
      return;
    }
    if(w.drawing?.mark!==mark) {
      w.drawing={mark,time:0,duration:mark.id==='end'?1.9:1.03};
      UI.sound([440,554],'triangle',.18);
    }
    w.drawing.time+=dt;
    const ratio=Math.min(1,w.drawing.time/w.drawing.duration);
    UI.drawProgress(ratio,mark.label+'…');
    if(ratio<1)return;
    w.drawing=null;
    UI.drawProgress(0);
    const messages={
      bridge:'A ponte ganhou forma e agora aguenta os seus passos!',vine:'As raízes se juntaram. Fagulha já pode atravessar!',
      panel:'O desenho revelou uma passagem secreta.',engine:'A engrenagem entrou no lugar. O elevador está funcionando.',
      stair:'A última ponte ganhou forma.',end:'A última página voltou a ter cor!'
    };
    this.activate(mark.id,messages[mark.id],mark.x,mark.y-35);
    if(mark.id==='bridge') w.apparition=3.8;
    if(mark.id==='end') {
      w.endingDelay=2.4;
      this.save(true);
    }
  }

  interact(mark) {
    if(!mark)return;
    const w=this.world;
    if(!w.has(mark.needs)) {
      this.hint();
      return;
    }
    if(mark.kind==='exit'){
      const passages=[
        [['Nina','Vi uma mancha se mexer do outro lado do rio.'],['Dobri','Chamam de Borrão. A tinta dele deixa margens em branco. A pista segue para a floresta.']],
        [['Nina','A página diz que Borrão nasceu de uma história sem final.'],['Fagulha','Ele levou as últimas páginas para a torre. Talvez ache que vai desaparecer com elas.']]
      ];
      UI.startDialog(passages[w.index],()=>this.openLevel(w.index+1));
      UI.sound([392,523,698]);
      return;
    }
    if(mark.kind==='switch'){
      if(w.flags.has('seal')) { UI.feedback('Os dois símbolos já estão acesos.'); return; }
      if(mark.id==='moon') this.activate('moon','A Lua acendeu. Agora procure a Folha.',mark.x,mark.y-42);
      else if(w.flags.has('moon')){
        w.flags.add('leaf');
        this.activate('seal','Lua e Folha! O elevador do selo começou a subir.',mark.x,mark.y-42);
      } else {
        UI.feedback('A Folha ainda está fria. Leia a ordem dos símbolos no relógio.');
        UI.sound([330,294]);
      }
      return;
    }
    const lines={
      cora:[['Cora','A ponte sumiu bem na hora de levar pão à oficina. Guardei grafite dourado na varanda mais alta.'],['Nina','Vou saltar pelos telhados para pegar o grafite e desenhar uma nova ponte.']],
      mechanism:[['Cora','A caixa é mais pesada que o papel. Empurre-a até cobrir o centro da placa de cobre.']],
      fagulha:[['Fagulha','As raízes da minha árvore foram apagadas. Se você encontrar uma semente de tinta, consegue desenhar outra raiz?'],['Dobri','Tem uma semente lá em cima. A caixa pode servir de degrau para o primeiro galho.']],
      lift:[['Fagulha','Esta plataforma acorda quando eu chego à outra margem. Espere ela descer, embarque e salte para o galho alto.']],
      clue:[['Dobri','A inscrição diz: “Primeiro a Lua ilumina o galho. Depois, a Folha encontra o caminho.”']],
      blot:[['Borrão','Fui a última mancha de uma história que ninguém terminou. Pensei que, se apagasse as outras páginas, a minha teria um lugar.'],['Nina','Você pode ter um lugar sem apagar o de ninguém. Vamos desenhar um final juntos?'],['Borrão','Sim. Quero uma janela, amigos e uma história para contar.']]
    };
    UI.startDialog(lines[mark.id],mark.id==='blot'?()=>{
      this.activate('metBlot','A página em branco espera ao lado de Borrão.',mark.x,mark.y-42);
    }:undefined);
  }

  tick(dt) {
    const w=this.world,p=w.player;
    const input=UI.input();
    if(input.inventory) {UI.inventory(w.items);return;}
    w.time+=dt;
    w.fade=Math.max(0,w.fade-dt*1.4);
    w.cheer=Math.max(0,w.cheer-dt);
    w.hint=Math.max(0,w.hint-dt);
    w.apparition=Math.max(0,w.apparition-dt);
    if(!w.hint)w.emotion='';
    this.updateSolids();
    if(w.crate){
      Physics.tickCrate(w.crate,dt,w.solids);
      if(w.crate.y>w.level.height+90) Object.assign(w.crate,Physics.body(w.level.crate.x,w.level.crate.y,w.crate.w,w.crate.h));
    }
    const nearDraw=this.nearby('draw');
    const drawBlock=this.drawBlock(nearDraw);
    this.draw(nearDraw,dt,input.draw,drawBlock);
    const drawing=w.drawing&&!w.drawing.locked;
    Physics.tickPlayer(p,dt,drawing?0:input.dir,input.jump&&!drawing,input.jumpPressed&&!drawing,input.jumpReleased,w.solids,w.crate);
    p.x=Physics.clamp(p.x,0,w.level.width-p.w);
    if(p.y>w.level.height+66){this.respawn();return;}
    this.pickup();
    const checkpoint=w.level.checkpoint;
    if(w.has(checkpoint.needs)&&!w.flags.has('checkpoint')&&p.on&&Math.abs(p.x+p.w/2-checkpoint.x)<62&&Math.abs(p.y+p.h-checkpoint.y)<10){
      w.flags.add('checkpoint');
      w.spawn=[checkpoint.x,checkpoint.y];
      this.save();
      UI.checkpoint();
      UI.sound([523,698]);
    }
    const plate=w.level.plate;
    if(plate&&!w.has('gate')&&w.crate.on&&Math.abs(w.crate.y+w.crate.h-plate.y)<3&&
      Math.abs(w.crate.x+w.crate.w/2-plate.x-plate.w/2)<28){
      this.activate('gate','A placa afundou e abriu o portão da oficina!',plate.x+plate.w/2,plate.y-15);
    }
    if(w.fly&&w.has('vine')&&!w.has('firefly')){
      w.fly.x=Math.min(1165,w.fly.x+128*dt);
      w.fly.y=732-Math.sin((w.fly.x-724)/441*Math.PI)*31;
      if(w.fly.x>=1165){
        this.activate('firefly','Fagulha chegou! A plataforma e a página apareceram.',w.fly.x,w.fly.y);
        w.apparition=4;
      }
    }
    const action=this.nearby('use');
    w.near=drawing?nearDraw:nearDraw??action;
    UI.prompt(w.near,nearDraw?drawBlock:'');
    if(input.use&&!drawing) {
      if(action) this.interact(action);
      else if(nearDraw) UI.feedback(drawBlock||'Use o lápis aqui. Segure '+(UI.touch.matches?'Desenhar.':'X.'));
    }
    Characters.tickDobri(w.pet,p,w.solids,dt,w.cheer,w.hint);
    for(const particle of w.particles){
      particle.x+=particle.vx*dt;particle.y+=particle.vy*dt;
      particle.vy+=46*dt;particle.life-=dt;
    }
    w.particles=w.particles.filter(particle=>particle.life>0);
    this.follow(dt,UI.motion.matches);
    if(w.endingDelay>0) {
      w.endingDelay-=dt;
      if(w.endingDelay<=0)this.end();
    }
  }

  end(save=true) {
    this.running=false;
    if(save)this.save(true);
    const count=[...this.world.items].filter(id=>id.startsWith('stamp')).length;
    els.secrets.textContent='Selos secretos encontrados · '+count+' de 3';
    document.querySelectorAll('.route li').forEach(li=>li.removeAttribute('aria-current'));
    UI.show('ending');
    UI.sound([523,659,784,988,1047]);
  }
}

const adventure=new Adventure();

