'use strict';

const UI=(()=>{
  const el=Object.fromEntries([...document.querySelectorAll('[id]')].map(node=>[node.id,node]));
  const touch=matchMedia('(max-width:740px), (pointer:coarse)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const keys={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',KeyE:'act',KeyQ:'undo',KeyI:'map'};
  const held=new Map(),pressed=new Set();
  const buttons=[...document.querySelectorAll('[data-control]')];
  let active=false, dialogue, noticeTimer, enabled=false, audio, gain;
  const down=(source,action)=>{if(![...held.values()].includes(action))pressed.add(action);held.set(source,action);};
  const blocked=()=>el.story.open||el.inventory.open;
  function clear(){held.clear();pressed.clear();buttons.forEach(button=>button.classList.remove('held'));}
  function input(){
    const has=action=>[...held.values()].includes(action);
    const result={dir:Number(has('right'))-Number(has('left')),jump:has('jump')||has('up'),climb:has('jump')||has('up')?1:has('down')?-1:0,
      jumpPressed:pressed.has('jump')||pressed.has('up'),act:pressed.has('act'),holdingAct:has('act'),undo:pressed.has('undo'),map:pressed.has('map')};
    pressed.clear();
    return result;
  }
  addEventListener('keydown',event=>{
    const action=keys[event.code];
    if(!active||blocked()||!action||event.altKey||event.ctrlKey||event.metaKey||(event.code==='Space'&&event.target.closest('button,a')))return;
    event.preventDefault();
    if(!event.repeat)down(event.code,action);
  });
  addEventListener('keyup',event=>held.delete(event.code));
  addEventListener('blur',clear);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
  for(const button of buttons){
    button.addEventListener('pointerdown',event=>{
      if(!active||blocked())return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      down(event.pointerId,button.dataset.control);
      button.classList.add('held');
    });
    const up=event=>{held.delete(event.pointerId);button.classList.remove('held');};
    for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,up);
  }
  function label(node,value){if(node.textContent!==value)node.textContent=value;}
  function display(node,value){label(node,value);node.hidden=!value;}
  function show(name){
    for(const screen of ['cover','game','ending'])el[screen].hidden=screen!==name;
    active=name==='game';clear();
    if(active)el.scene.focus({preventScroll:true});
    if(name==='ending')el['end-title'].focus({preventScroll:true});
    scrollTo(0,0);
  }
  function speak(lines,done){
    if(blocked())return;
    clear();dialogue={lines,done,index:0};
    line();el.story.showModal();
  }
  function line(){
    const [speaker,text]=dialogue.lines[dialogue.index];
    label(el.speaker,speaker);label(el.speech,text);
    label(el['next-line'],dialogue.index===dialogue.lines.length-1?'Vamos lá →':'Continuar →');
  }
  el['next-line'].addEventListener('click',()=>{
    if(++dialogue.index===dialogue.lines.length)el.story.close();else line();
  });
  el.skip.addEventListener('click',()=>el.story.close());
  el.story.addEventListener('close',()=>{
    const done=dialogue?.done;dialogue=null;
    if(active)el.scene.focus({preventScroll:true});
    done?.();
  });
  el.inventory.addEventListener('close',()=>{if(active)el.scene.focus({preventScroll:true});});
  el['close-map'].addEventListener('click',()=>el.inventory.close());
  el.controls.addEventListener('click',()=>{
    const shown=el.game.classList.toggle('with-controls');
    el.controls.setAttribute('aria-pressed',shown);
    el.scene.focus({preventScroll:true});
  });
  const buttonMode=()=>touch.matches||el.game.classList.contains('with-controls');
  function route(index,lenses){
    el.route.innerHTML=Worlds.map((world,i)=>`<li ${i===index?'aria-current="step"':''}>
      <span class="seal" style="--accent:${world.color}" aria-hidden="true">${lenses.includes(i)?'✓':world.icon}</span>
      <div><small>${lenses.includes(i)?'Lente recuperada':'Ilha '+(i+1)}</small><strong>${world.short}</strong></div></li>`).join('');
    label(el['lens-count'],lenses.length+'/5');
  }
  function map(profile,item){
    if(blocked())return;
    clear();
    el['map-list'].innerHTML=Worlds.map((world,i)=>`<li>${world.name}<span>${profile.lenses.includes(i)?'✓ Lente':'○'}</span></li>`).join('');
    label(el.bag,(item?'Carregando: '+item.label+'. ':'')+'Conchas encontradas: '+profile.secrets.length+' de 5.');
    el.inventory.showModal();
    el['close-map'].focus();
  }
  function notice(message){
    clearTimeout(noticeTimer);display(el.notice,message);
    noticeTimer=setTimeout(()=>{el.notice.hidden=true;},4100);
  }
  function sound(notes){
    const AudioEngine=window.AudioContext||window.webkitAudioContext;
    if(!enabled||!AudioEngine)return;
    try {
      if(!audio){audio=new AudioEngine();gain=audio.createGain();gain.connect(audio.destination);}
      gain.gain.value=.78;
      if(audio.state==='suspended')audio.resume().catch(()=>{});
      notes.forEach((note,index)=>{
        const start=audio.currentTime+index*.086,osc=audio.createOscillator(),vol=audio.createGain();
        osc.frequency.value=note;
        vol.gain.setValueAtTime(.001,start);
        vol.gain.exponentialRampToValueAtTime(.12,start+.014);
        vol.gain.exponentialRampToValueAtTime(.001,start+.21);
        osc.connect(vol).connect(gain);osc.start(start);osc.stop(start+.23);
      });
    } catch { /* A saída de áudio é opcional. */ }
  }
  el.sound.addEventListener('click',()=>{
    enabled=!enabled;el.sound.setAttribute('aria-pressed',enabled);
    label(el.sound,enabled?'Som ligado':'Som desligado');
    if(!enabled&&gain)gain.gain.value=0;else sound([392,523,659]);
  });
  return {el,touch,reduced,clear,input,blocked,label,display,show,speak,route,map,notice,sound,buttonMode};
})();

