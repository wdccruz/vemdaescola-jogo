/* Sons sintetizados (Web Audio) e leitura em voz alta. Tudo começa desligado. */
window.VDE = window.VDE || {};
VDE.audio = (function () {
  let ctx = null, on = false;
  const notes = {
    tap: [[520, 0, 0.06, 'triangle']],
    jump: [[330, 0, 0.09, 'sine'], [520, 0.06, 0.1, 'sine']],
    pop: [[700, 0, 0.05, 'triangle'], [990, 0.05, 0.08, 'triangle']],
    collect: [[660, 0, 0.09, 'triangle'], [880, 0.08, 0.09, 'triangle'], [1320, 0.16, 0.16, 'triangle']],
    wrong: [[260, 0, 0.12, 'sine'], [196, 0.1, 0.18, 'sine']],
    ok: [[523, 0, 0.1, 'triangle'], [659, 0.1, 0.1, 'triangle'], [784, 0.2, 0.1, 'triangle'], [1047, 0.3, 0.28, 'triangle']],
    croak: [[150, 0, 0.09, 'square'], [110, 0.1, 0.14, 'square']],
    hoot: [[392, 0, 0.16, 'sine'], [330, 0.2, 0.26, 'sine']],
    win: [[523, 0, 0.14, 'triangle'], [659, 0.14, 0.14, 'triangle'], [784, 0.28, 0.14, 'triangle'], [1047, 0.42, 0.2, 'triangle'], [784, 0.62, 0.12, 'triangle'], [1047, 0.74, 0.5, 'triangle']],
  };
  function play(name) {
    if (!on || !ctx || !notes[name]) return;
    const t0 = ctx.currentTime;
    for (const [f, at, dur, type] of notes[name]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + at);
      g.gain.exponentialRampToValueAtTime(type === 'square' ? 0.05 : 0.13, t0 + at + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
      o.connect(g).connect(ctx.destination); o.start(t0 + at); o.stop(t0 + at + dur + 0.03);
    }
  }
  function toggle() {
    on = !on;
    if (on) {
      try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) { on = false; }
    } else if (window.speechSynthesis) speechSynthesis.cancel();
    if (on) play('pop');
    return on;
  }
  /* Lê uma palavra ou frase em voz alta, se o navegador tiver voz em português. */
  function say(text) {
    if (!on || !window.speechSynthesis) return;
    try { const u = new SpeechSynthesisUtterance(text); u.lang = 'pt-BR'; u.rate = 0.9; u.pitch = 1.2; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { /* sem voz: segue o jogo */ }
  }
  return { play, toggle, say, get on() { return on; } };
})();
