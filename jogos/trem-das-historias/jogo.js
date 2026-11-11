'use strict';

const stations = [
  {
    title: 'O Vale das Palavras', icon: 'book', accent: '#275c55', soft: '#f3e6c5', companion: 'pingo',
    progress: ['A ponte se desfez!', '1 arco de pedra', '2 arcos de pedra', 'Ponte completa!'],
    challenges: [
      {kind:'word', title:'Uma palavra acende o vale', image:'moon', name:'Lua', pieces:['A','LU','LE','O'], answer:[1,0], hint:'Pingo viu a LUA no céu. Fale devagar: LU… A!', win:'LU + A virou LUA. O primeiro arco apareceu!'},
      {kind:'word', title:'O amigo da margem', image:'frog', name:'Sapo', pieces:['PA','PO','SO','SA'], answer:[3,1], hint:'Pingo ouviu um coaxo: SA… PO!', win:'SA + PO virou SAPO. Tem mais um arco sobre o rio!'},
      {kind:'word', title:'Uma luz para Brasa', image:'lantern', name:'Lampião', pieces:['PI','LIM','ÃO','LAM','PA'], answer:[3,0,2], hint:'A luz vem de um LAM-PI-ÃO. Comece com LAM.', win:'LAM + PI + ÃO virou LAMPIÃO. A ponte está pronta!'}
    ]
  }
];

const $ = id => document.getElementById(id);
const ui = Object.fromEntries([
  'cover','start','adventure','chapter','scenery','chapter-label','station-title','scene-caption','workbench',
  'step-label','challenge-title','instructions','hint','hint-art','board','feedback','next','ending','ending-art',
  'ending-title','stamps','restart','route','sound','sound-icon','sound-label'
].map(id => [id, $(id)]));

const state = { station:0, step:0, selections:[], complete:false, sound:false };
const station = () => stations[state.station];
const challenge = () => station().challenges[state.step];
let audio;

function play(notes) {
  if (!state.sound) return;
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!AudioEngine) return;
  try {
    audio ??= new AudioEngine();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    notes.forEach((note, index) => {
      const start = audio.currentTime + index * .105;
      const tone = audio.createOscillator();
      const volume = audio.createGain();
      tone.type = 'sine';
      tone.frequency.value = note;
      volume.gain.setValueAtTime(.001, start);
      volume.gain.exponentialRampToValueAtTime(.12, start + .018);
      volume.gain.exponentialRampToValueAtTime(.001, start + .28);
      tone.connect(volume).connect(audio.destination);
      tone.start(start);
      tone.stop(start + .3);
    });
  } catch {
    // Sound is optional on browsers without an available audio output.
  }
}

function renderSound() {
  ui.sound.setAttribute('aria-pressed', state.sound);
  ui['sound-label'].textContent = state.sound ? 'Som ligado' : 'Som desligado';
  ui['sound-icon'].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h4l5-4v14l-5-4H3Z"/><path d="${state.sound ? 'M15 9q4 3 0 6m3-9q6 6 0 12' : 'm16 10 5 5m0-5-5 5'}"/></svg>`;
}

function renderRoute(active = -1) {
  ui.route.innerHTML = stations.map((item, index) => `<li ${active === index ? 'aria-current="step"' : ''}>
    <span class="route-art">${Art.icon(item.icon)}</span>
    <span><small>${active > index ? '✓ Concluída' : 'Estação '+(index+1)}</small><strong>${item.title}</strong></span>
  </li>`).join('');
}

function renderScene() {
  const progress = state.step + Number(state.complete);
  ui.scenery.innerHTML = Art.scene(state.station, progress, state.complete);
  ui['scene-caption'].textContent = station().progress[progress];
}

function feedback(message, good = false) {
  ui.feedback.textContent = message;
  ui.feedback.classList.toggle('good', good);
}

function renderWord(c) {
  const slots = c.answer.map((_, index) => {
    const selected = state.selections[index];
    const filled = selected !== undefined;
    const label = filled ? 'Retirar '+c.pieces[selected] : 'Espaço '+(index+1);
    return `<button type="button" class="slot${filled?' filled':''}" data-remove="${index}" aria-label="${label}" ${!filled||state.complete?'disabled':''}>${filled ? c.pieces[selected] : '·'}</button>`;
  }).join('');
  const tiles = c.pieces.map((piece, index) => `<button type="button" class="tile" data-piece="${index}" ${state.complete || state.selections.includes(index) ? 'disabled' : ''}>${piece}</button>`).join('');
  return `<div class="puzzle"><div class="illustration" role="img" aria-label="${c.name}">${Art.icon(c.image)}</div>
    <div class="manipulatives"><div class="slots" role="group" aria-label="Palavra em construção">${slots}</div>
    <div class="pieces" role="group" aria-label="Sílabas para encaixar">${tiles}</div></div></div>`;
}

function renderBoard(focusPiece = false) {
  ui.board.innerHTML = renderWord(challenge());
  if (focusPiece) ui.board.querySelector('[data-piece]:enabled')?.focus({preventScroll:true});
}

function openChallenge(newStation) {
  const c = challenge();
  state.selections = [];
  state.complete = false;
  ui.adventure.style.setProperty('--accent', station().accent);
  ui.adventure.style.setProperty('--soft', station().soft);
  ui['chapter-label'].textContent = '✦ Estação '+(state.station+1);
  ui['station-title'].textContent = station().title;
  ui['step-label'].textContent = `${state.step+1} de ${station().challenges.length} desafios`;
  ui['challenge-title'].textContent = c.title;
  ui.instructions.textContent = 'Toque nas sílabas, na ordem, para montar a palavra da figura.';
  ui['hint-art'].innerHTML = Art.icon(station().companion);
  ui.hint.setAttribute('aria-label', 'Pedir dica a '+(station().companion === 'pingo' ? 'Pingo' : 'Lume'));
  ui.hint.disabled = false;
  ui.next.hidden = true;
  feedback('');
  renderScene();
  renderRoute(state.station);
  renderBoard();
  const heading = newStation ? ui['station-title'] : ui['challenge-title'];
  heading.focus({preventScroll:true});
  if (newStation) window.scrollTo(0,0);
}

function begin() {
  state.station = 0;
  state.step = 0;
  ui.cover.hidden = true;
  ui.ending.hidden = true;
  ui.adventure.hidden = false;
  openChallenge(true);
  play([392,523,659]);
}

function complete() {
  state.complete = true;
  renderScene();
  renderBoard();
  ui.hint.disabled = true;
  feedback(challenge().win, true);
  const last = state.step === station().challenges.length-1;
  const finish = state.station === stations.length-1 && last;
  ui.next.textContent = finish ? 'Ver a chegada ✦' : last ? 'Próxima estação →' : 'Continuar →';
  ui.next.hidden = false;
  ui.next.focus({preventScroll:true});
  play([523,659,784,1047]);
}

function wrong(tile, message) {
  feedback(message);
  tile.classList.remove('wrong');
  void tile.offsetWidth;
  tile.classList.add('wrong');
  play([330,294]);
}

function chooseWord(index, tile) {
  const c = challenge();
  const next = state.selections.length;
  if (c.answer[next] !== index) {
    wrong(tile, next ? 'Essa sílaba não encaixou aqui. Tente outra!' : 'Essa sílaba não abre a palavra. Experimente outra!');
    return;
  }
  state.selections.push(index);
  if (state.selections.length === c.answer.length) {
    complete();
    return;
  }
  renderBoard(true);
  feedback(c.pieces[index]+' encaixou! Qual vem agora?', true);
  play([587]);
}

function finish() {
  ui.adventure.hidden = true;
  ui.ending.hidden = false;
  ui['ending-art'].innerHTML = Art.scene(3,1,true);
  ui.stamps.innerHTML = stations.map(item => `<span class="route-art" role="img" aria-label="Carimbo: ${item.title}">${Art.icon(item.icon)}</span>`).join('');
  renderRoute(stations.length);
  ui['ending-title'].focus({preventScroll:true});
  window.scrollTo(0,0);
  play([523,659,784,1047,784,1047]);
}

ui.board.addEventListener('click', event => {
  const tile = event.target.closest('button');
  if (!tile || state.complete) return;
  if (tile.dataset.remove !== undefined) {
    state.selections.splice(Number(tile.dataset.remove));
    renderBoard(true);
    feedback('Agora você pode encaixar a peça de novo.');
  } else if (tile.dataset.piece !== undefined) {
    chooseWord(Number(tile.dataset.piece), tile);
  }
});
ui.hint.addEventListener('click', () => { feedback(challenge().hint); play([494,659]); });
ui.start.addEventListener('click', begin);
ui.restart.addEventListener('click', begin);
ui.next.addEventListener('click', () => {
  if (!state.complete) return;
  if (state.step+1 < station().challenges.length) {
    state.step++;
    openChallenge(false);
    return;
  }
  if (state.station+1 < stations.length) {
    state.station++;
    state.step = 0;
    openChallenge(true);
    return;
  }
  finish();
});
ui.sound.addEventListener('click', () => {
  state.sound = !state.sound;
  renderSound();
  play([494,659]);
});
renderSound();
renderRoute();

