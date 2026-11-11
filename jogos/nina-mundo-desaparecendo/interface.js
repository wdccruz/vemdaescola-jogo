'use strict';

const PaperUI = (() => {
  const $ = id => document.getElementById(id);
  const els = Object.fromEntries([
    'cover','start','resume','game','chapter','place','quest','hint','bag','count','stage','scene','prompt','toast',
    'checkpoint','drawing','drawing-label','ink-progress','sound','conversation','portrait','speaker','line',
    'skip','forward','inventory','items','recover','close-bag','ending','ending-title','secrets','restart'
  ].map(id=>[id,$(id)]));

  const keys = {
    ArrowLeft:'left', KeyA:'left', ArrowRight:'right', KeyD:'right',
    ArrowUp:'jump', KeyW:'jump', Space:'jump', KeyE:'use', KeyX:'draw', KeyI:'inventory'
  };
  const held = new Map();
  const pressed = new Set();
  const released = new Set();
  const controls = [...document.querySelectorAll('[data-control]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(max-width: 740px), (pointer: coarse)');
  let enabled = false;
  let toastId, checkpointId;
  let dialogue = null;
  let audio, master, audible = false;

  function active(action) { return [...held.values()].includes(action); }
  function down(source,action) {
    if (!active(action)) pressed.add(action);
    held.set(source,action);
  }
  function up(source) {
    const action=held.get(source);
    held.delete(source);
    if (action && !active(action)) released.add(action);
  }
  function clear() {
    held.clear(); pressed.clear(); released.clear();
    controls.forEach(button=>button.classList.remove('held'));
  }
  function input() {
    const result = {
      dir:Number(active('right'))-Number(active('left')),
      jump:active('jump'), jumpPressed:pressed.has('jump'), jumpReleased:released.has('jump'),
      draw:active('draw'), use:pressed.has('use'), inventory:pressed.has('inventory')
    };
    pressed.clear(); released.clear();
    return result;
  }
  function blocked() {return els.conversation.open||els.inventory.open;}

  addEventListener('keydown',event=>{
    if (els.conversation.open && event.code==='KeyE' && !event.repeat) {
      event.preventDefault();
      advance();
      return;
    }
    if (!enabled||blocked()||event.ctrlKey||event.metaKey||event.altKey) return;
    const action=keys[event.code];
    if (!action || (event.code==='Space' && event.target.closest('button,a'))) return;
    event.preventDefault();
    if (!event.repeat) down(event.code,action);
  });
  addEventListener('keyup',event=>up(event.code));
  addEventListener('blur',clear);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
  for (const button of controls) {
    const release=event=>{
      up(event.pointerId);
      button.classList.remove('held');
    };
    button.addEventListener('pointerdown',event=>{
      if (!enabled||blocked()) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      down(event.pointerId,button.dataset.control);
      button.classList.add('held');
    });
    for (const name of ['pointerup','pointercancel','lostpointercapture']) button.addEventListener(name,release);
  }

  function show(screen) {
    for (const name of ['cover','game','ending']) els[name].hidden=name!==screen;
    enabled=screen==='game';
    clear();
    if (screen==='game') els.scene.focus({preventScroll:true});
    if (screen==='ending') els['ending-title'].focus({preventScroll:true});
    window.scrollTo(0,0);
  }

  function startDialog(lines,done) {
    if (blocked()) return;
    clear();
    dialogue={lines,done,index:0};
    renderLine();
    els.conversation.showModal();
    els.forward.focus();
  }
  function renderLine() {
    const {lines,index}=dialogue;
    const [name,line]=lines[index];
    els.speaker.textContent=name;
    els.line.textContent=line;
    els.forward.textContent=index===lines.length-1?'Voltar ao jogo →':'Continuar →';
    Characters.portrait(els.portrait,name);
  }
  function advance() {
    if (!dialogue) return;
    dialogue.index++;
    if (dialogue.index===dialogue.lines.length) els.conversation.close();
    else renderLine();
  }
  els.forward.addEventListener('click',advance);
  els.skip.addEventListener('click',()=>els.conversation.close());
  els.conversation.addEventListener('close',()=>{
    const done=dialogue?.done;
    dialogue=null;
    if (enabled) els.scene.focus({preventScroll:true});
    done?.();
  });
  els.inventory.addEventListener('close',()=>{
    if (enabled) els.scene.focus({preventScroll:true});
  });

  function inventory(items) {
    if (blocked()) return;
    clear();
    els.items.replaceChildren();
    if (!items.size) els.items.append(Object.assign(document.createElement('li'),{textContent:'A mochila ainda está vazia.'}));
    for (const item of items) {
      const [name,description]=Items[item];
      const row=document.createElement('li');
      row.append(Object.assign(document.createElement('strong'),{textContent:name}),
        Object.assign(document.createElement('span'),{textContent:description}));
      els.items.append(row);
    }
    els.inventory.showModal();
    els['close-bag'].focus();
  }
  els['close-bag'].addEventListener('click',()=>els.inventory.close());

  function chapter(level,index) {
    els.chapter.textContent='Capítulo '+(index+1)+' de '+Levels.length;
    els.place.textContent=level.name;
    document.querySelectorAll('.route li').forEach((li,i)=>{
      if (i===index) li.setAttribute('aria-current','step'); else li.removeAttribute('aria-current');
    });
  }

  function feedback(message) {
    clearTimeout(toastId);
    els.toast.textContent=message;
    els.toast.hidden=false;
    toastId=setTimeout(()=>{els.toast.hidden=true;},3300);
  }
  function checkpoint() {
    clearTimeout(checkpointId);
    els.checkpoint.hidden=false;
    checkpointId=setTimeout(()=>{els.checkpoint.hidden=true;},2000);
  }
  function prompt(mark) {
    const value = mark ? (mark.kind==='draw' ? (touch.matches?'Segure Desenhar':'Segure X') : (touch.matches?'Agir':'E'))+' · '+mark.label : '';
    if (els.prompt.textContent!==value) els.prompt.textContent=value;
    els.prompt.hidden=!mark;
  }
  function drawProgress(ratio,label) {
    els.drawing.hidden=!ratio;
    if (ratio) {els['ink-progress'].value=ratio; els['drawing-label'].textContent=label;}
  }
  function sound(notes,shape='sine',length=.16) {
    if (!audible) return;
    const Engine=window.AudioContext||window.webkitAudioContext;
    if (!Engine) return;
    try {
      if (!audio) {audio=new Engine();master=audio.createGain();master.connect(audio.destination);}
      master.gain.value=.75;
      if (audio.state==='suspended') audio.resume().catch(()=>{});
      notes.forEach((note,index)=>{
        const t=audio.currentTime+index*.095;
        const oscillator=audio.createOscillator();
        const volume=audio.createGain();
        oscillator.type=shape;
        oscillator.frequency.value=note;
        volume.gain.setValueAtTime(.001,t);
        volume.gain.exponentialRampToValueAtTime(.15,t+.018);
        volume.gain.exponentialRampToValueAtTime(.001,t+length);
        oscillator.connect(volume).connect(master);
        oscillator.start(t);oscillator.stop(t+length+.02);
      });
    } catch { /* Audio is optional on systems without an output. */ }
  }

  els.sound.addEventListener('click',()=>{
    audible=!audible;
    els.sound.setAttribute('aria-pressed',audible);
    els.sound.textContent=audible?'Som ligado':'Som desligado';
    if (!audible && master) master.gain.value=0;
    else sound([392,523,659]);
  });

  return {els,motion,touch,input,blocked,clear,show,startDialog,inventory,chapter,feedback,checkpoint,prompt,drawProgress,sound};
})();

