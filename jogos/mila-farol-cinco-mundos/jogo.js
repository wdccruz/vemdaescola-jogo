'use strict';

const {el}=UI;
const SAVE='mila-farol-cinco-mundos-v1';
const STEP=1/120;

function fresh(){
  return {version:1,location:-1,hubX:104,lenses:[],secrets:[],islands:{},finished:false};
}
function restore(){
  try {
    const value=JSON.parse(localStorage.getItem(SAVE));
    if(value?.version===1&&Number.isInteger(value.location)&&value.location>=-1&&value.location<Worlds.length&&
      Array.isArray(value.lenses)&&value.lenses.every(i=>Worlds[i])&&Array.isArray(value.secrets)&&value.islands&&Number.isFinite(value.hubX)) return value;
  } catch { /* O jogo continua na memória sem armazenamento local. */ }
  return null;
}

class Expedition {
  constructor(){
    this.saved=restore();
    this.camera={x:0,y:0,w:900,h:620};
    this.canvas=el.scene;
    this.g=this.canvas.getContext('2d',{alpha:false});
    this.clock=0;this.acc=0;this.running=false;
    el.resume.hidden=!this.saved;
    el.start.addEventListener('click',()=>this.start(false));
    el.resume.addEventListener('click',()=>this.start(true));
    el.restart.addEventListener('click',()=>this.start(false));
    el.hint.addEventListener('click',()=>this.hint());
    el.map.addEventListener('click',()=>UI.map(this.profile,this.carried()));
    el.recover.addEventListener('click',()=>{el.inventory.close();this.recover();});
    el.controls.addEventListener('click',()=>this.status());
    this.canvas.addEventListener('click',event=>this.pointAt(event));
    new ResizeObserver(()=>this.resize()).observe(el.stage);
    requestAnimationFrame(t=>this.frame(t));
    UI.route(-1,this.saved?.lenses??[]);
  }
  start(resume){
    this.profile=resume&&this.saved?this.saved:fresh();
    if(this.profile.finished){this.end();return;}
    UI.show('game');
    this.running=true;
    this.open(this.profile.location);
    if(!resume)UI.speak([
      ['Mila','O mapa da visita escolar mostra cinco ilhas. A luz que ligava todas elas se apagou!'],
      ['Tuca','Sou Tuca! Vamos começar pela Ilha dos Números. Siga a placa “Próxima ilha” e use o botão que aparecer quando estiver perto.']
    ]);
  }
  open(index){
    const level=index<0?HUB:buildWorld(index);
    this.profile.location=index;
    const state=index<0?null:this.profile.islands[index]??={solved:[false,false,false],slots:{},counts:{},checkpoint:98};
    const x=index<0?this.profile.hubX:state.checkpoint;
    const y=level.ground;
    this.world={index,level,state,player:Physics.body(x,y-54),pet:{x:x-53,y:y-22,mode:'follow',vx:0,vy:0},time:0,fade:1,
      cheer:0,particles:[],carry:null,near:null,hold:0,hints:{},climbing:false,ending:0,
      tiles:index<0?[tile(0,y,level.width,180,'ground'),tile(190,y-100,135),tile(1600,y-100,110)]:level.tiles.map(s=>({...s,home:s.y,homeX:s.x,dx:0,dy:0})),
      solids:[],crate:level.crate?Physics.body(state.crateX??level.crate.x,level.crate.y,level.crate.w,level.crate.h):null};
    this.acc=0;
    SceneArt.load(level.id);
    this.updateSolids();
    this.resize(true);
    this.status();
    UI.notice('');
    UI.route(index,this.profile.lenses);
    this.save();
  }
  save(){
    this.saved=this.profile;
    try {localStorage.setItem(SAVE,JSON.stringify(this.profile));} catch { /* O progresso fica na sessão. */ }
  }
  resize(snap=false){
    if(!this.world||el.game.hidden)return;
    const {clientWidth:w,clientHeight:h}=el.stage;
    if(!w||!h)return;
    this.scale=Math.max(h/(UI.touch.matches?570:625),w/1420);
    this.dpr=Math.min(devicePixelRatio||1,1.55);
    this.canvas.width=Math.round(w*this.dpr);this.canvas.height=Math.round(h*this.dpr);
    this.camera.w=w/this.scale;this.camera.h=h/this.scale;
    this.follow(0,snap);
  }
  follow(dt,snap=false){
    const {level,player}=this.world,c=this.camera;
    const x=Physics.clamp(player.x+15+player.vx*.17-c.w*.46,0,Math.max(0,level.width-c.w));
    const y=Physics.clamp(player.y+54-c.h*.77,0,Math.max(0,level.height-c.h));
    const rate=snap||UI.reduced.matches?1:1-Math.exp(-8*dt);
    c.x+=(x-c.x)*rate;c.y+=(y-c.y)*rate;
  }
  frame(now){
    const dt=Math.min(.05,(now-this.clock)/1000);
    this.clock=now;
    if(this.running&&!document.hidden){
      if(!UI.blocked()){
        this.acc+=dt;
        while(this.acc>=STEP){
          this.acc-=STEP;
          this.tick(STEP);
          if(UI.blocked()||!this.running){this.acc=0;break;}
        }
      }
      if(this.scale&&this.running)SceneArt.render(this.g,this.world,this.camera,this.scale*this.dpr,this.profile,UI.reduced.matches);
    }
    requestAnimationFrame(t=>this.frame(t));
  }
  updateSolids(){
    const w=this.world;
    w.solids=w.tiles.filter(s=>(s.need===undefined||w.state.solved[s.need])&&(s.until===undefined||!w.state.solved[s.until]));
    for(const s of w.solids)if(s.moving){
      const phase=(w.time/s.period)%1;
      const eased=part=>(1-Math.cos(Math.PI*part))/2;
      const travel=s.axis==='x'?eased(phase*2):
        phase<.22?0:phase<.5?eased((phase-.22)/.28):phase<.72?1:1-eased((phase-.72)/.28);
      const amount=s.range*travel;
      const x=s.homeX+(s.axis==='x'?amount:0),y=s.home-(s.axis==='x'?0:amount);
      s.dx=x-s.x;s.dy=y-s.y;s.x=x;s.y=y;
    }
  }
  puzzle(){return this.world.level.stage?.find(p=>!this.world.state.solved[p.step]);}
  carried(){
    const carry=this.world.carry;
    return carry?this.world.level.stage[carry.step].objects[carry.id]:null;
  }
  slots(p){return this.world.state.slots[p.id]??=Array(p.order.length).fill(null);}
  counts(p){return this.world.state.counts[p.id]??=Array(p.order.length).fill(0);}
  status(){
    const w=this.world,p=this.puzzle();
    UI.label(el.place,w.level.name);
    UI.label(el.area,w.index<0?'Porto das cinco ilhas':p?.area??'Mirante da lente');
    const next=Worlds[this.profile.lenses.length];
    UI.label(el.task,w.index<0?(next?'Próximo destino: '+next.name+'.':'As cinco lentes foram reunidas.'):p?.task??'A lente está no mirante.');
    const item=this.carried();
    UI.display(el.carry,item?'Na mão · '+item.label:'');
    this.guide(p,item,next);
  }
  guide(p,item,next){
    const w=this.world,l=w.level;
    const act=UI.buttonMode()?'Agir':'E';
    const undo=UI.buttonMode()?'Devolver':'Q';
    const jump=UI.buttonMode()?'Pular':'Espaço';
    let message,marker;
    if(w.index<0){
      message=next?'Caminhe até a placa “Próxima ilha”. Junto ao portal, aperte '+act+'.':'Vá ao pé do farol e aperte '+act+' para acender a luz.';
      marker={x:next?l.portals[this.profile.lenses.length]:l.beacon,y:l.ground-(next?168:299),label:next?'Próxima ilha':'Acender o farol'};
    }else if(!p){
      message='Vá à direita. Quando o elevador descer, pule nele. No alto, pule para o mirante e aperte '+act+' junto à lente.';
    }else if(p.step>0&&w.state.checkpoint<l.checkpoints[p.step-1].x){
      message=p.step===1?'O portão abriu. Siga à direita até a próxima oficina.':'A ponte está pronta. Atravesse para chegar ao próximo mecanismo.';
    }else if(p.kind==='slots'){
      if(item)message='Você leva '+item.label+'. Chegue perto de um encaixe e aperte '+act+' de novo.';
      else if(this.slots(p).every(id=>id!==null))message='Confira a montagem. Perto de um encaixe, aperte '+act+' para retirar a peça.';
      else message='Chegue perto de uma peça e aperte '+act+' para pegá-la. Para subir na prateleira, use '+jump+'.';
      if(p.id==='motor-decimal'){
        marker=item?{x:536,y:l.ground-169,label:'Encaixes'}:{x:278,y:l.ground-151,label:'Peças'};
      }
    }else{
      message='Chegue perto de um '+(p.kind==='cash'?'guichê':'recipiente')+' e aperte '+act+' para acrescentar uma unidade. '+undo+' retira uma.';
    }
    w.waypoint=marker;
    UI.label(el.guide,message);
  }
  hint(){
    const w=this.world,p=this.puzzle();
    const title=p?.id??'route', count=w.hints[title]??0;
    w.hints[title]=count+1;w.pet.mode='hint';w.cheer=.7;
    const text=p?(count===0?p.clue:p.help):w.index<0?'O portal brilhante leva à próxima ilha. Cada lente acende outro portal.':'Espere a plataforma descer. Embarque e pule para o mirante quando ela chegar ao alto.';
    UI.notice('Tuca: '+text);UI.sound([494,659]);el.scene.focus({preventScroll:true});
  }
  targets(){
    const w=this.world,l=w.level,p=this.puzzle();
    if(w.index<0)return [
      ...l.portals.map((x,index)=>({kind:'portal',x,y:l.ground,index,label:Worlds[index].short})),
      {kind:'beacon',x:l.beacon,y:l.ground,label:'Acender o farol'},
      {kind:'guide',x:194,y:l.ground,label:'Conversar com Tuca'}
    ];
    const result=[];
    if(p){
      if(p.kind==='slots'){
        const slots=this.slots(p);
        for(const o of p.objects)if(!slots.includes(o.id)&&w.carry?.id!==o.id)result.push({...o,kind:'object',p});
      }
      for(const f of p.fixtures)result.push({...f,kind:p.kind==='slots'?'slot':'bin',p});
    } else result.push({...l.lens,kind:'lens',label:'Recolher a lente'});
    result.push({kind:'guide',x:117,y:l.ground,label:'Conversar com Tuca'});
    return result;
  }
  nearest(){
    const p=this.world.player;
    let nearest=null,distance=Infinity;
    for(const t of this.targets()){
      const dx=Math.abs(p.x+p.w/2-t.x),dy=Math.abs(p.y+p.h-t.y);
      if(dx<=64&&dy<=62&&dx+dy<distance){nearest=t;distance=dx+dy;}
    }
    return nearest;
  }
  pointAt(event){
    if(!this.running||UI.blocked()||UI.touch.matches)return;
    const box=this.canvas.getBoundingClientRect();
    const x=(event.clientX-box.left)/this.scale+this.camera.x,y=(event.clientY-box.top)/this.scale+this.camera.y;
    const p=this.world.player;
    const target=this.targets().find(t=>Math.abs(t.x-x)<34&&Math.abs(t.y-34-y)<46&&Math.abs(p.x+15-t.x)<=69&&Math.abs(p.y+54-t.y)<=62);
    if(target)this.act(target);
    this.canvas.focus({preventScroll:true});
  }
  prompt(t){
    const w=this.world;
    const act=UI.buttonMode()?'Agir':'E';
    if(!t)return w.carry?(UI.buttonMode()?'Devolver':'Q')+' · Devolver à prateleira':'';
    if(t.kind==='object')return act+' · Pegar '+t.label;
    if(t.kind==='slot'){
      const selected=this.slots(t.p)[t.index];
      if(!w.carry&&selected===null)return 'Traga uma peça para '+t.label;
      return act+' · '+(w.carry?'Encaixar em ':'Retirar de ')+t.label;
    }
    if(t.kind==='bin')return act+' · '+(t.p.kind==='cash'?'Pagar com ':'Acrescentar em ')+t.label;
    return act+' · '+t.label;
  }
  act(target){
    if(!target)return;
    const w=this.world;
    switch(target.kind){
      case 'portal':
        if(target.index>this.profile.lenses.length){
          UI.notice('Recupere a lente da ilha anterior para iluminar este portal.');
          return;
        }
        this.profile.hubX=target.x;
        UI.clear();this.open(target.index);
        UI.notice('Tuca: explore a ilha e leve as peças até os mecanismos.');
        break;
      case 'guide':
        UI.speak([['Tuca',w.index<0?'As lentes acendem os portais em ordem. O mapa da mochila mostra quais já encontramos.':'Pegue as peças com Agir ou E. Ao lado do encaixe, use Agir de novo. Devolver ou Q permite tentar de outro jeito.']]);
        break;
      case 'object':
        if(w.carry){UI.notice('Mila já leva uma peça. Encaixe-a ou use Devolver.');return;}
        w.carry={step:target.p.step,id:target.id};UI.sound([640]);break;
      case 'slot': {
        const cells=this.slots(target.p),old=cells[target.index];
        if(!w.carry&&old===null){UI.notice('Pegue uma peça da prateleira e traga até aqui.');return;}
        cells[target.index]=w.carry?.id??null;
        w.carry=old===null?null:{step:target.p.step,id:old};
        if(target.p.id==='motor-decimal'&&cells[target.index]!==null){
          const value=target.p.objects[cells[target.index]].value;
          if(value!==target.p.target[target.index])UI.notice('Confira o valor na posição das '+target.label.toLowerCase()+'. Você pode retirar essa peça e tentar outra.');
        }
        this.check(target.p);
        break;
      }
      case 'bin':this.adjust(target,1);break;
      case 'lens': {
        const index=w.index;
        if(!this.profile.lenses.includes(index))this.profile.lenses.push(index);
        this.profile.lenses.sort((a,b)=>a-b);
        this.profile.hubX=this.profile.lenses.length===5?1630:HUB.portals[this.profile.lenses.length]-103;
        UI.clear();this.open(-1);UI.sound([523,659,784,1047]);
        UI.notice('Lente de '+Worlds[index].short+' recuperada! O farol ganhou luz.');
        this.burst(this.world.player.x+18,this.world.level.ground-65);
        break;
      }
      case 'beacon':
        if(this.profile.lenses.length<5){UI.notice('O farol precisa das cinco lentes. Veja as ilhas no mapa.');return;}
        w.ending=2.2;this.burst(w.level.beacon,w.level.ground-225,48);
        UI.sound([523,659,784,988,1047]);break;
    }
    this.status();
  }
  adjust(target,amount){
    const {p,index}=target,counts=this.counts(p);
    if(amount<0&&counts[index]===0)return;
    if(amount>0&&p.kind==='bins'&&MathGame.sum(counts)>=p.total){
      UI.notice('As peças já foram distribuídas. Use Devolver para mover uma.');return;
    }
    if(amount>0&&p.kind==='cash'&&counts[index]>=p.stock[index]){
      UI.notice('Esse guichê ficou sem peças. Experimente outra combinação.');return;
    }
    counts[index]+=amount;
    this.check(p);
  }
  check(p){
    const w=this.world;
    const values=p.kind==='slots'?this.slots(p).map(id=>id===null?null:p.objects[id].value):this.counts(p);
    const result=MathGame.evaluate(p,values);
    if(result.tip)UI.notice(result.tip);
    if(result.done){
      w.state.solved[p.step]=true;w.carry=null;
      this.burst(p.x+85,p.y-58,24);
      UI.sound([523,659,784,1047]);this.updateSolids();
    } else UI.sound([result.tip?330:560]);
    this.status();this.save();
  }
  undo(target){
    const w=this.world;
    if(w.carry){w.carry=null;UI.notice('Peça devolvida à prateleira.');}
    else if(target?.kind==='bin')this.adjust(target,-1);
    else if(target?.kind==='slot')this.act(target);
    this.status();
  }
  burst(x,y,count=17){
    const w=this.world;w.cheer=.9;w.pet.mode='cheer';
    if(UI.reduced.matches)return;
    for(let i=0;i<count;i++){
      const a=i*2.39996,v=48+(i%7)*13;
      w.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-22,life:.6+i%5*.13,size:2+i%4});
    }
  }
  recover(){
    const w=this.world,y=w.level.ground,x=w.state?.checkpoint??this.profile.hubX;
    w.player=Physics.body(x,y-54);w.pet.x=x-54;w.pet.y=y-22;w.climbing=false;
    UI.clear();this.follow(0,true);UI.notice('Mila voltou ao ponto salvo.');this.status();
  }
  pet(dt){
    const w=this.world,p=w.player,t=w.pet;
    const distance=Math.hypot(t.x-p.x,t.y-p.y);
    if(distance>530){t.x=p.x-58;t.y=p.y+28;t.vx=0;t.vy=0;t.mode='rejoin';return;}
    const gx=p.x+(w.cheer>0?p.face*55:-p.face*66);
    let gy=p.y+p.h-9;
    const gate=w.solids.find(s=>s.style==='gate'&&Math.min(t.x,gx)<s.x+s.w&&Math.max(t.x,gx)>s.x);
    if(gate)gy=Math.min(gy,t.y-38);
    t.mode=w.cheer>0?t.mode:gate?'avoid':distance<90?'idle':'follow';
    t.vx=Physics.toward(t.vx,Physics.clamp((gx-t.x)*5,-348,348),dt*1400);
    t.vy=Physics.toward(t.vy,Physics.clamp((gy-t.y)*6,-325,325),dt*1400);
    t.x+=t.vx*dt;t.y+=t.vy*dt;
  }
  tick(dt){
    const w=this.world,p=w.player,input=UI.input();
    if(input.map){UI.map(this.profile,this.carried());return;}
    w.time+=dt;w.fade=Math.max(0,w.fade-dt*1.8);w.cheer=Math.max(0,w.cheer-dt);w.hold=Math.max(0,w.hold-dt);
    this.updateSolids();
    if(w.crate){
      Physics.tickCrate(w.crate,dt,w.solids);
      if(w.crate.y>w.level.height+60)Object.assign(w.crate,Physics.body(w.level.crate.x,w.level.crate.y,w.crate.w,w.crate.h));
    }
    const ladder=w.level.ladder;
    const onLadder=ladder&&Math.abs(p.x+15-ladder.x)<28&&p.y+p.h>=ladder.y-3&&p.y+p.h<=ladder.y+ladder.h+4;
    if(w.climbing&&onLadder&&input.dir&&p.y+p.h<=ladder.y+10)p.y=ladder.y-p.h;
    w.climbing=Boolean(onLadder&&(input.climb||w.climbing)&&!input.dir);
    if(w.climbing){
      p.vx=0;p.vy=0;p.on=null;
      p.y=Physics.clamp(p.y-input.climb*157*dt,ladder.y-p.h,ladder.y+ladder.h-p.h);
    } else Physics.tickPlayer(p,dt,input.dir,input.jump,input.jumpPressed,false,w.solids,w.crate);
    p.x=Physics.clamp(p.x,0,w.level.width-p.w);
    if(p.y>w.level.height+58){this.recover();return;}
    for(const cp of w.level.checkpoints??[])if(w.state.solved[cp.need]&&w.state.checkpoint<cp.x&&p.on&&Math.abs(p.x+15-cp.x)<57&&Math.abs(p.y+p.h-cp.y)<7){
      w.state.checkpoint=cp.x;w.state.crateX=w.crate?.x;this.save();
      UI.notice('✦ Ponto salvo');UI.sound([523,698]);
      this.status();
    }
    const s=w.level.secret;
    if(s&&!this.profile.secrets.includes(w.index)&&Math.abs(p.x+15-s.x)<27&&Math.abs(p.y+28-s.y)<35){
      this.profile.secrets.push(w.index);this.burst(s.x,s.y);
      UI.notice('Concha escondida! Veja sua coleção na mochila.');this.save();
    }
    w.near=this.nearest();
    if(input.undo)this.undo(w.near);
    else if(input.act||(input.holdingAct&&w.near?.kind==='bin'&&!w.hold)){
      this.act(w.near);w.hold=.25;
    }
    if(w!==this.world)return;
    UI.display(el.prompt,this.prompt(w.near));
    this.pet(dt);
    for(const v of w.particles){v.x+=v.vx*dt;v.y+=v.vy*dt;v.vy+=53*dt;v.life-=dt;}
    w.particles=w.particles.filter(v=>v.life>0);
    this.follow(dt);
    if(w.ending>0){w.ending-=dt;if(w.ending<=0)this.end();}
  }
  end(){
    this.running=false;this.profile.finished=true;this.save();
    UI.label(el.secrets,'Conchas encontradas: '+this.profile.secrets.length+' de 5.');
    UI.show('ending');
  }
}

const expedition=new Expedition();

