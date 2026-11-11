/* O Mistério da Biblioteca Encantada — motor do jogo e as três fases. */
(function () {
  const V = window.VDE, GROUND = V.GROUND;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const SPEED = 310, JUMP = -660, GRAV = 1850, CH_W = 178, CH_H = 193;

  const stage = $('#stage'), world = $('#world'), back = $('#back'), mid = $('#mid'), fore = $('#fore'), things = $('#things'), ctx = $('#ctx');
  const G = { level: -1, mistakes: 0, stars: [], words: [], busy: false, running: false };
  let scene, spots = [], floats = [], scale = 1, viewW = 800, cam = 0, last = 0, near = null, lastProgress = 0;
  const keys = { left: false, right: false };

  /* ---------------- personagens ---------------- */
  function actor(kind) {
    const a = { kind, x: 0, y: GROUND, vy: 0, dir: 1, ground: true, state: '', lock: 0, target: null, cb: null };
    a.el = el('div', 'actor', V.char(kind));
    a.bubble = el('div', 'bubble b-' + kind); a.bubble.hidden = true;
    return a;
  }
  const lilo = actor('lilo'), lila = actor('lila');
  function setState(a, st, ms) {
    if (ms) a.lock = performance.now() + ms;
    if (a.state === st) return;
    a.state = st;
    a.el.className = 'actor st-' + st + (a.talking ? ' talk' : '');
  }
  function place(a) {
    a.el.style.transform = `translate(${a.x - CH_W / 2}px, ${a.y - CH_H + 10}px) scaleX(${a.dir})`;
    if (!a.bubble.hidden) a.bubble.style.transform = `translate(${a.x}px, ${a.y - CH_H - 6}px) translate(-50%, -100%)`;
  }
  function bubble(a, text, ms = 2400) {
    a.bubble.textContent = text; a.bubble.hidden = false; a.talking = true; a.el.classList.add('talk');
    clearTimeout(a.bt);
    a.bt = setTimeout(() => { a.bubble.hidden = true; a.talking = false; a.el.classList.remove('talk'); }, ms);
  }
  function emote(a, st, ms = 900) { setState(a, st, ms); }
  function cheer(ms = 1500) { setState(lilo, 'happy', ms); setTimeout(() => setState(lila, 'happy', ms), 120); }
  function jump(a = lilo) {
    if (!a.ground) return;
    a.vy = JUMP; a.ground = false;
    if (a === lilo) { V.audio.play('jump'); setTimeout(() => jump(lila), 170); }
  }
  function walkTo(x, cb) { lilo.target = Math.max(70, Math.min(scene.W - 70, x)); lilo.cb = cb || null; }

  /* ---------------- laço principal ---------------- */
  function tick(t) {
    if (!G.running) return;
    if (!scene) return requestAnimationFrame(tick);
    const dt = Math.min(0.034, (t - last) / 1000 || 0); last = t;
    const input = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    let moving = false;
    if (!G.busy && input) { lilo.target = null; lilo.cb = null; lilo.dir = input; lilo.x += input * SPEED * dt; moving = true; }
    else if (lilo.target != null) {
      const d = lilo.target - lilo.x;
      if (Math.abs(d) < 7) { lilo.x = lilo.target; lilo.target = null; const cb = lilo.cb; lilo.cb = null; if (cb) cb(); }
      else { lilo.dir = Math.sign(d); lilo.x += lilo.dir * Math.min(Math.abs(d), SPEED * dt); moving = true; }
    }
    lilo.x = Math.max(60, Math.min(scene.W - 60, lilo.x));
    // a Lila acompanha, um passo atrás
    const want = lilo.x - lilo.dir * 104, dl = want - lila.x;
    let lmoving = false;
    if (Math.abs(dl) > 16) { lila.dir = Math.sign(dl); lila.x += lila.dir * Math.min(Math.abs(dl), SPEED * 0.96 * dt); lmoving = true; }
    else if (!moving) lila.dir = lilo.x >= lila.x ? 1 : -1;
    for (const a of [lilo, lila]) {
      if (!a.ground) { a.vy += GRAV * dt; a.y += a.vy * dt; if (a.y >= GROUND) { a.y = GROUND; a.vy = 0; a.ground = true; } }
      if (t > a.lock) setState(a, !a.ground ? 'jump' : (a === lilo ? moving : lmoving) ? 'walk' : 'idle');
      else if (!a.ground) setState(a, 'jump');
      place(a);
    }
    // letras flutuantes: pega pulando
    for (const f of floats) {
      if (!f.taken && Math.abs(lilo.x - f.x) < 54 && lilo.y - 150 < f.y + 34 && lilo.y - 150 > f.y - 90) { f.taken = true; f.onTake(f); }
    }
    // câmera
    const goal = Math.max(0, Math.min(scene.W - viewW, lilo.x - viewW / 2 + lilo.dir * viewW * 0.08));
    cam += (goal - cam) * Math.min(1, dt * 5);
    world.style.transform = `scale(${scale}) translate(${-cam}px, 0)`;
    back.style.transform = `translate(${cam * 0.35}px, 0)`;
    fore.style.transform = `translate(${-cam * 0.3}px, 0)`;
    // coisa mais próxima para interagir
    let best = null, bd = 1e9;
    for (const s of spots) { const d = Math.abs(s.x - lilo.x) - s.w / 2; if (d < 60 && d < bd) { bd = d; best = s; } }
    if (best !== near) { if (near) near.el.classList.remove('near'); near = best; if (near) near.el.classList.add('near'); $('#b-act').classList.toggle('ready', !!near); }
    // dica: depois de um tempo sem progresso, o próximo passo pisca
    if (t - lastProgress > 9000 && !G.busy) { lastProgress = t; const h = G.nextHint && G.nextHint(); if (h) { h.classList.add('hint'); setTimeout(() => h.classList.remove('hint'), 3200); } }
    requestAnimationFrame(tick);
  }
  const progress = () => { lastProgress = performance.now(); };

  function resize() {
    scale = stage.clientHeight / 600; viewW = stage.clientWidth / scale; world.style.setProperty('--s', scale.toFixed(3));
    if (scene && viewW > scene.W) viewW = scene.W;
  }
  window.addEventListener('resize', resize);

  /* ---------------- efeitos ---------------- */
  function fly(text, from, to, cb, cls = '') {
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const f = el('div', 'fly ' + cls, text); document.body.append(f);
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 3, x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    const anim = f.animate([
      { transform: `translate(${x0}px, ${y0}px) translate(-50%, -50%) scale(0.3)`, opacity: 0 },
      { transform: `translate(${x0}px, ${y0 - 70}px) translate(-50%, -50%) scale(1.5)`, opacity: 1, offset: 0.3 },
      { transform: `translate(${x1}px, ${y1}px) translate(-50%, -50%) scale(1)`, opacity: 1 },
    ], { duration: 850, easing: 'cubic-bezier(.3,.1,.3,1)' });
    anim.onfinish = () => { f.remove(); cb && cb(); };
  }
  function sparkle(x, y) {
    const s = el('div', 'spark'); s.style.transform = `translate(${x}px, ${y}px)`;
    s.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i>'; things.append(s); setTimeout(() => s.remove(), 800);
  }
  function miss(node) { G.mistakes++; V.audio.play('wrong'); node.classList.remove('shake'); void node.offsetWidth; node.classList.add('shake'); emote(lila, 'oops', 900); }

  /* ---------------- bandeja: letras, palavras, desafios ---------------- */
  function chips(total, got, label) {
    ctx.innerHTML = `<div class="chips" aria-label="${label}">${[...Array(total)].map((_, i) => `<span class="chip${got[i] ? ' on' : ''}">${got[i] || ''}</span>`).join('')}</div>`;
  }
  function tip(html) { ctx.innerHTML = `<div class="tip">${html}</div>`; }

  /* monta uma palavra tocando nas peças na ordem certa */
  function wordPuzzle({ icon, answer, tiles, word, onDone }) {
    let pos = 0;
    ctx.innerHTML = `<div class="puzzle"><button class="hintpic" type="button" aria-label="Ouvir a palavra">${V.icon(icon, 56)}</button><div class="slots">${answer.map(() => '<span class="slot"></span>').join('')}</div><div class="tiles">${shuffle(tiles).map((t) => `<button type="button" class="tile">${t}</button>`).join('')}</div></div>`;
    ctx.querySelector('.hintpic').onclick = () => V.audio.say(word);
    const slots = [...ctx.querySelectorAll('.slot')];
    ctx.querySelectorAll('.tile').forEach((b) => b.onclick = () => {
      if (b.textContent !== answer[pos]) return miss(b);
      const slot = slots[pos++]; b.disabled = true; b.classList.add('used'); V.audio.play('pop'); progress();
      fly(b.textContent, b, slot, () => { slot.textContent = b.textContent; slot.classList.add('on'); if (slots.every((s) => s.textContent)) { V.audio.play('ok'); V.audio.say(word); ctx.querySelector('.puzzle').classList.add('done'); setTimeout(onDone, 900); } });
    });
  }

  /* ---------------- construção da fase ---------------- */
  function addSpot(s) {
    s.el = el('button', 'spot spot-' + s.id.split('-')[0] + ' spot-' + s.id, s.art + '<span class="bang">!</span>');
    s.el.type = 'button'; s.el.setAttribute('aria-label', s.label);
    s.el.style.cssText = `left:${s.x - s.w / 2}px;top:${GROUND - s.h + (s.dy || 0)}px;width:${s.w}px;height:${s.h}px`;
    s.el.onclick = () => { if (G.busy) return; V.audio.play('tap'); walkTo(s.x - (s.stand ?? Math.min(150, s.w / 2 + 16)), () => { lilo.dir = 1; act(s); }); };
    things.append(s.el); spots.push(s); return s;
  }
  function addFloat(text, x, y, onTake) {
    const f = { text, x, y, taken: false, onTake };
    f.el = el('button', 'float', `<span>${text}</span>`); f.el.type = 'button'; f.el.setAttribute('aria-label', 'Letra ' + text + ' — pule para pegar');
    f.el.style.cssText = `left:${x - 34}px;top:${y - 34}px`;
    f.el.onclick = () => { if (!G.busy) walkTo(x, () => jump()); };
    things.append(f.el); floats.push(f); return f;
  }
  function act(s) { if (G.busy || !s) return; const fn = ACTS[s.id.split('-')[0]]; if (fn) fn(s); }

  function build(n) {
    G.level = n; G.mistakes = 0; G.busy = false; G.nextHint = null;
    scene = V.scenes[n]();
    spots = []; floats = []; near = null;
    world.className = 'lv' + (n + 1); world.style.width = scene.W + 'px';
    back.innerHTML = scene.back; mid.innerHTML = scene.mid; fore.innerHTML = scene.fore || ''; things.innerHTML = '';
    scene.spots.forEach(addSpot);
    for (const a of [lilo, lila]) { a.y = GROUND; a.vy = 0; a.ground = true; a.dir = 1; a.target = null; a.cb = null; a.lock = 0; a.bubble.hidden = true; things.append(a.el, a.bubble); }
    lilo.x = scene.start; lila.x = scene.start - 100; cam = 0;
    resize(); progress();
    document.querySelectorAll('#phases li').forEach((li, i) => { li.classList.toggle('now', i === n); li.classList.toggle('done', i < n); });
    LEVELS[n]();
  }

  async function goTo(n) {
    G.busy = true; keys.left = keys.right = false;
    const c = $('#curtain');
    c.querySelector('small').textContent = 'Fase ' + (n + 1);
    c.querySelector('b').textContent = V.scenes[n]().name;
    c.classList.add('in'); await wait(650);
    build(n); G.busy = true;
    await wait(1100); c.classList.remove('in'); await wait(500); G.busy = false;
  }
  const levelDone = (n) => { const m = G.mistakes; G.stars[n] = m <= 1 ? 3 : m <= 4 ? 2 : 1; };

  /* =========================== FASE 1 =========================== */
  const L1 = { need: ['L', 'I', 'V', 'R', 'O'], got: [], done: {} };
  const LEVELS = [];
  LEVELS[0] = () => {
    L1.got = []; L1.done = {};
    chips(5, L1.got, 'Letras encontradas');
    addFloat('V', 1190, 286, (f) => found('V', f.el));
    G.nextHint = () => { const s = spots.find((s) => ['estante', 'abajur', 'globo', 'coruja'].includes(s.id) && !L1.done[s.id]); return L1.got.length === 5 ? spots.find((s) => s.id === 'pedestal').el : s ? s.el : floats.find((f) => !f.taken)?.el; };
    setTimeout(() => bubble(lila, 'As palavras sumiram!', 2600), 700);
    setTimeout(() => { bubble(lilo, 'Vamos procurar!', 2400); spots[0].el.classList.add('hint'); setTimeout(() => spots[0].el.classList.remove('hint'), 4000); }, 3200);
  };
  function found(letter, from) {
    V.audio.play('collect'); progress(); emote(lilo, 'happy', 900);
    const r = from.getBoundingClientRect(); from.classList.add('gone');
    const target = ctx.querySelectorAll('.chip')[L1.got.length];
    L1.got.push(letter);
    if (!target) return;
    fly(letter, { getBoundingClientRect: () => r }, target, () => {
      if (ctx.querySelector('.chips')) chips(5, L1.got, 'Letras encontradas');
      if (L1.got.length === 5) { bubble(lila, 'Todas as letras! Ao livro mágico!', 3200); spots.find((s) => s.id === 'pedestal').el.classList.add('hint'); }
    });
  }
  function reveal(s, letter, delay = 500) {
    if (L1.done[s.id]) return; L1.done[s.id] = true;
    setTimeout(() => { const p = el('div', 'popletter', letter); p.style.cssText = `left:${s.x - 30}px;top:${GROUND - s.h * 0.62}px`; things.append(p); V.audio.play('pop'); setTimeout(() => found(letter, p), 650); setTimeout(() => p.remove(), 1700); }, delay);
  }
  const ACTS = {
    estante(s) { s.el.classList.remove('go'); void s.el.offsetWidth; s.el.classList.add('go'); emote(lilo, 'wow', 700); reveal(s, 'L'); },
    abajur(s) { s.el.classList.toggle('on'); V.audio.play('pop'); if (s.el.classList.contains('on')) reveal(s, 'I', 350); },
    bau(s) {
      if (s.el.classList.contains('open')) return;
      s.el.classList.add('open'); V.audio.play('croak'); emote(lilo, 'wow', 1100); setTimeout(() => emote(lila, 'wow', 900), 150);
      setTimeout(() => bubble(lila, 'Um sapo! Ha ha ha!', 2000), 500); setTimeout(() => s.el.classList.remove('open'), 2300);
    },
    globo(s) { s.el.classList.remove('go'); void s.el.offsetWidth; s.el.classList.add('go'); V.audio.play('tap'); reveal(s, 'R', 800); },
    coruja(s) {
      if (s.el.classList.contains('awake')) return;
      s.el.classList.add('awake'); V.audio.play('hoot'); emote(lilo, 'wow', 800);
      if (!L1.done.coruja) bubble(lila, 'Desculpe, dona Coruja!', 2200);
      reveal(s, 'O', 700); setTimeout(() => s.el.classList.remove('awake'), 3200);
    },
    pedestal(s) {
      const left = 5 - L1.got.length;
      if (left > 0) { emote(lila, 'oops', 900); return bubble(lila, left === 1 ? 'Falta 1 letra!' : `Faltam ${left} letras!`, 2400); }
      if (L1.solving) return; L1.solving = true;
      bubble(lila, 'Que palavra é esta?', 2400);
      wordPuzzle({ icon: 'livro', answer: L1.need, tiles: L1.need, word: 'livro', onDone: async () => {
        s.el.classList.add('open'); G.words.push('LIVRO'); levelDone(0); cheer(2200); sparkle(s.x, GROUND - 240);
        tip('<b class="won">LIVRO</b>'); bubble(lilo, 'LIVRO! A magia voltou!', 2400);
        await wait(2500); L1.solving = false; goTo(1);
      } });
    },
  };

  /* =========================== FASE 2 =========================== */
  const L2 = { active: null, done: 0 };
  LEVELS[1] = () => {
    L2.active = null; L2.done = 0;
    for (const t of scene.tasks) {
      t.pos = 0; t.done = false; t.flowers = [];
      const letters = shuffle(t.answer.concat(t.extra)), xs = [-290, -200, -110, 110, 200, 290];
      letters.forEach((ch, i) => {
        const f = { text: ch, x: t.x + xs[i], task: t };
        f.el = el('button', 'flower', V.flower(ch, i + t.x)); f.el.type = 'button'; f.el.setAttribute('aria-label', 'Flor ' + ch);
        f.el.style.cssText = `left:${f.x - 48}px;top:${GROUND - 164}px`;
        f.el.onclick = () => pickFlower(f);
        things.append(f.el); t.flowers.push(f);
      });
    }
    things.append(lila.el, lilo.el, lila.bubble, lilo.bubble);
    tip('Toque em uma <b>placa</b> para completar a história');
    G.nextHint = () => { const t = L2.active || scene.tasks.find((t) => !t.done); if (!t) return spots.find((s) => s.id === 'portao').el; return L2.active ? t.flowers.find((f) => f.text === t.answer[t.pos] && !f.used)?.el : spots.find((s) => s.task === t).el; };
    setTimeout(() => bubble(lila, 'As histórias estão sem palavras!', 2800), 600);
    setTimeout(() => { const s = spots[0].el; s.classList.add('hint'); setTimeout(() => s.classList.remove('hint'), 4000); }, 1500);
  };
  function sentence(t) {
    ctx.innerHTML = `<div class="story"><button class="hintpic" type="button" aria-label="Ouvir a história">${V.icon(t.icon, 52)}</button><p>${t.before} <span class="slots">${t.answer.map((a, i) => `<span class="slot${a.length > 1 ? ' wide' : ''}${i < t.pos ? ' on' : ''}">${i < t.pos ? a : ''}</span>`).join('')}</span> ${t.after}</p></div>`;
    ctx.querySelector('.hintpic').onclick = () => V.audio.say(`${t.before} ${t.word.toLowerCase()} ${t.after}`);
  }
  function openTask(t) {
    if (t.done) return bubble(lila, 'Esta já está pronta!', 1800);
    if (L2.active && L2.active !== t) L2.active.flowers.forEach((f) => f.el.classList.remove('open'));
    L2.active = t; t.flowers.forEach((f, i) => setTimeout(() => f.el.classList.add('open'), i * 90));
    V.audio.play('pop'); sentence(t); progress();
    bubble(lila, t.answer[0].length > 1 ? 'Junte os pedacinhos!' : 'Toque nas flores certas!', 2400);
  }
  ACTS.placa = (s) => openTask(s.task);
  function pickFlower(f) {
    if (G.busy || f.used) return;
    const t = f.task;
    if (L2.active !== t) { const s = spots.find((s) => s.task === t); if (t.done) return; return walkTo(s.x - 30, () => openTask(t)); }
    walkTo(f.x - 44, () => {
      lilo.dir = 1;
      if (f.text !== t.answer[t.pos]) { miss(f.el); return bubble(lila, 'Ops! Tente outra flor.', 1700); }
      f.used = true; V.audio.play('collect'); progress(); emote(lilo, 'happy', 700);
      const slot = ctx.querySelectorAll('.slot')[t.pos]; t.pos++;
      f.el.classList.add('picked');
      fly(f.text, f.el, slot, () => { sentence(t); if (t.pos === t.answer.length) taskDone(t); });
    });
  }
  async function taskDone(t) {
    t.done = true; L2.done++; L2.active = null; G.busy = true; G.words.push(t.word);
    t.flowers.forEach((f) => f.el.classList.add('rest'));
    spots.find((s) => s.task === t).el.classList.add('done');
    world.classList.add('fx-' + t.id); V.audio.play('ok'); V.audio.say(`${t.before} ${t.word.toLowerCase()} ${t.after}`);
    ctx.querySelector('.story')?.classList.add('done'); cheer(1800);
    bubble(lilo, { sol: 'Olha o sol nascendo!', flor: 'Que flor gigante!', gato: 'Miau! Achamos o gato!' }[t.id], 2400);
    await wait(2300); G.busy = false;
    if (L2.done === 3) { levelDone(1); spots.find((s) => s.id === 'portao').el.classList.add('open', 'hint'); tip('O <b>portão</b> abriu! Vamos ao castelo ➜'); bubble(lila, 'O portão do castelo abriu!', 2800); }
    else tip('Muito bem! Procure a próxima <b>placa</b> ➜');
  }
  ACTS.portao = () => {
    const left = 3 - L2.done;
    if (left > 0) { emote(lila, 'oops', 900); return bubble(lila, left === 1 ? 'Falta 1 história!' : `Faltam ${left} histórias!`, 2200); }
    goTo(2);
  };

  /* =========================== FASE 3 =========================== */
  const L3 = { gem1: false, gem2: false, syl: [] };
  const gem = (n) => { document.querySelectorAll('.gem.g' + n).forEach((g) => g.classList.add('on')); V.audio.play('ok'); };
  function l3chips() { chips(3, L3.syl, 'Pedaços da palavra mágica'); }
  LEVELS[2] = () => {
    L3.gem1 = L3.gem2 = false; L3.syl = []; L3.solving = false;
    l3chips();
    [['MA', 1150, 262], ['GI', 1380, 286], ['A', 1560, 286]].forEach(([s, x, y]) => addFloat(s, x, y, (f) => {
      V.audio.play('collect'); progress(); emote(lilo, 'happy', 800);
      const r = f.el.getBoundingClientRect(); f.el.classList.add('gone');
      const target = ctx.querySelectorAll('.chip')[L3.syl.length]; L3.syl.push(s);
      if (target) fly(s, { getBoundingClientRect: () => r }, target, () => { if (ctx.querySelector('.chips')) l3chips(); });
    }));
    G.nextHint = () => !L3.gem1 ? spots[0].el : !L3.gem2 ? spots[1].el : floats.find((f) => !f.taken)?.el || spots[2].el;
    setTimeout(() => bubble(lila, 'Três enigmas guardam o último livro!', 3000), 600);
    setTimeout(() => { spots[0].el.classList.add('hint'); setTimeout(() => spots[0].el.classList.remove('hint'), 4000); }, 1500);
  };
  const BOOKC = { a: '#1fbfb8', b: '#ff7a6b', c: '#ffc93c' };
  const mini = (c, h = 50) => `<i class="mb" style="background:${BOOKC[c]};height:${h}px"></i>`;
  ACTS.padrao = (s) => {
    if (L3.gem1) return bubble(lila, 'Este já resolvemos!', 1600);
    bubble(lila, 'Qual livro vem depois?', 2400);
    ctx.innerHTML = `<div class="pattern"><div class="seq">${['a', 'b', 'a', 'b', 'a'].map((c) => mini(c)).join('')}<i class="mb q">?</i></div><div class="opts">${shuffle(['a', 'b', 'c']).map((c) => `<button type="button" class="opt" data-c="${c}" aria-label="Livro ${{ a: 'azul', b: 'coral', c: 'amarelo' }[c]}">${mini(c)}</button>`).join('')}</div></div>`;
    ctx.querySelectorAll('.opt').forEach((b) => b.onclick = () => {
      if (b.dataset.c !== 'b') return miss(b);
      L3.gem1 = true; progress(); const q = ctx.querySelector('.q'); q.textContent = ''; q.classList.remove('q'); q.style.background = BOOKC.b; q.style.height = '50px';
      ctx.querySelector('.pattern').classList.add('done'); s.el.classList.add('solved'); gem(1); cheer(1400);
      setTimeout(() => { if (ctx.querySelector('.pattern')) l3chips(); bubble(lilo, 'Um enigma resolvido!', 2000); }, 1300);
    });
  };
  ACTS.ordem = (s) => {
    if (L3.gem2) return bubble(lila, 'Esta já arrumamos!', 1600);
    bubble(lila, 'Do menor ao maior!', 2400);
    let next = 1;
    ctx.innerHTML = `<div class="order"><div class="rule" aria-hidden="true">${mini('c', 18)}<b>➜</b>${mini('a', 46)}</div><div class="opts">${shuffle([1, 2, 3, 4]).map((n) => `<button type="button" class="opt" data-n="${n}" aria-label="Livro tamanho ${n}"><i class="mb" style="background:${['#ffc93c', '#7a5ae0', '#ff7a6b', '#1fbfb8'][n - 1]};height:${12 + n * 8}px;width:${16 + n * 10}px"></i></button>`).join('')}</div></div>`;
    ctx.querySelectorAll('.opt').forEach((b) => b.onclick = () => {
      if (+b.dataset.n !== next) return miss(b);
      next++; b.disabled = true; b.classList.add('used'); V.audio.play('pop'); progress();
      if (next === 5) { L3.gem2 = true; s.el.classList.add('solved'); gem(2); cheer(1400); setTimeout(() => { if (ctx.querySelector('.order')) l3chips(); bubble(lilo, 'Torre arrumada!', 2000); }, 1200); }
    });
  };
  ACTS.porta = (s) => {
    if (L3.solving) return;
    if (!L3.gem1) { emote(lila, 'oops', 900); return bubble(lila, 'Falta o enigma da estante!', 2400); }
    if (!L3.gem2) { emote(lila, 'oops', 900); return bubble(lila, 'Falta arrumar a torre!', 2400); }
    if (L3.syl.length < 3) { emote(lila, 'oops', 900); return bubble(lila, 'Pule para pegar os pedacinhos!', 2600); }
    L3.solving = true; bubble(lila, 'A última palavra mágica!', 2400);
    wordPuzzle({ icon: 'magia', answer: ['MA', 'GI', 'A'], tiles: ['MA', 'GI', 'A', 'GA', 'ME'], word: 'magia', onDone: async () => {
      gem(3); s.el.classList.add('open'); G.words.push('MAGIA'); levelDone(2); cheer(2600); sparkle(s.x, GROUND - 260);
      tip('<b class="won">MAGIA</b>'); bubble(lilo, 'MAGIA! Conseguimos!', 2400);
      await wait(2600); finish();
    } });
  };

  /* ---------------- início, fim e controles ---------------- */
  function finish() {
    G.running = false; V.audio.play('win');
    const total = G.stars.reduce((a, b) => a + b, 0);
    let best = 0; try { best = +localStorage.getItem('vde-jogo-estrelas') || 0; if (total > best) localStorage.setItem('vde-jogo-estrelas', total); } catch (e) { /* sem armazenamento: tudo bem */ }
    const end = $('#end');
    end.querySelector('.words').innerHTML = G.words.map((w, i) => `<span style="--i:${i}">${w}</span>`).join('');
    end.querySelector('.stars').innerHTML = [0, 1, 2].map((n) => `<div><small>Fase ${n + 1}</small>${[1, 2, 3].map((k) => `<i class="${k <= (G.stars[n] || 1) ? 'on' : ''}" style="--i:${n * 3 + k}">★</i>`).join('')}</div>`).join('');
    end.querySelector('.best').textContent = total > best && best ? 'Novo recorde de estrelas!' : `${total} de 9 estrelas`;
    end.querySelector('.duo').innerHTML = `<div class="actor st-happy">${V.char('lilo')}</div><div class="actor st-happy">${V.char('lila')}</div>`;
    end.querySelector('.confetti').innerHTML = [...Array(36)].map((_, i) => `<i style="left:${(i * 2.8 + (i % 5) * 3) % 100}%;background:${['#ff7a6b', '#1fbfb8', '#ffc93c', '#7a5ae0', '#5fb760'][i % 5]};animation-delay:${(i % 9) * 0.22}s;animation-duration:${2.6 + (i % 4) * 0.5}s"></i>`).join('');
    end.hidden = false; $('#game').classList.add('ended');
  }
  async function start() {
    G.stars = []; G.words = []; L1.solving = false;
    $('#start').hidden = true; $('#end').hidden = true; $('#game').classList.remove('ended'); $('#game').classList.add('playing');
    // ?fase=2 ou ?fase=3 abre direto naquela fase (para testar)
    const f = +new URLSearchParams(location.search).get('fase');
    await goTo(f >= 1 && f <= 3 && !start.used ? f - 1 : 0); start.used = true;
  }
  function run() { if (!G.running) { G.running = true; last = performance.now(); requestAnimationFrame(tick); } }

  function hold(btn, key) {
    const on = (e) => { e.preventDefault(); keys[key] = true; btn.classList.add('down'); }, off = () => { keys[key] = false; btn.classList.remove('down'); };
    btn.addEventListener('pointerdown', on); ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, off));
  }
  hold($('#b-left'), 'left'); hold($('#b-right'), 'right');
  $('#b-jump').addEventListener('pointerdown', (e) => { e.preventDefault(); if (!G.busy) jump(); });
  $('#b-act').addEventListener('click', () => act(near));
  window.addEventListener('keydown', (e) => {
    if (!G.running || e.target.closest?.('input')) return;
    const k = e.key.toLowerCase();
    if (k === 'arrowleft' || k === 'a') keys.left = true;
    else if (k === 'arrowright' || k === 'd') keys.right = true;
    else if (k === 'arrowup' || k === 'w' || k === ' ') { if (!G.busy) jump(); }
    else if (k === 'e' || (k === 'enter' && !e.target.closest?.('button'))) act(near);
    else return;
    if (k.startsWith('arrow') || k === ' ') e.preventDefault();
  });
  window.addEventListener('keyup', (e) => { const k = e.key.toLowerCase(); if (k === 'arrowleft' || k === 'a') keys.left = false; if (k === 'arrowright' || k === 'd') keys.right = false; });
  window.addEventListener('blur', () => { keys.left = keys.right = false; });

  document.querySelectorAll('[data-sound]').forEach((b) => b.addEventListener('click', () => {
    const on = V.audio.toggle();
    document.querySelectorAll('[data-sound]').forEach((x) => { x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); x.setAttribute('aria-label', on ? 'Desligar o som' : 'Ligar o som'); });
  }));
  document.querySelectorAll('[data-play]').forEach((b) => b.addEventListener('click', async () => { V.audio.play('ok'); run(); await start(); }));
  $('#b-home').addEventListener('click', () => { G.running = false; $('#start').hidden = false; $('#game').classList.remove('playing'); });

  // cenário da biblioteca como fundo das telas de início e fim
  { const lib = V.scenes[0](); document.querySelectorAll('.screen .bg').forEach((b) => (b.innerHTML = `<div>${lib.back}${lib.mid}</div>`)); }
  // personagens na tela inicial
  $('#start .duo').innerHTML = `<div class="actor st-idle">${V.char('lilo')}</div><div class="actor st-idle">${V.char('lila')}</div>`;
  const duo = $('#start .duo').children;
  setInterval(() => { if ($('#start').hidden) return; const a = duo[Math.random() < 0.5 ? 0 : 1], st = ['happy', 'wow', 'jump'][Math.floor(Math.random() * 3)]; a.className = 'actor st-' + st; setTimeout(() => (a.className = 'actor st-idle'), 1100); }, 2600);
  try { const b = +localStorage.getItem('vde-jogo-estrelas'); if (b) $('#start .record').textContent = `Seu recorde: ${b} de 9 estrelas`; } catch (e) { /* ok */ }
  V.game = G;
})();
