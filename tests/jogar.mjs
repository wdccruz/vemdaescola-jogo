// Joga o jogo inteiro sozinho, no computador e no celular, e confere que dá para terminar.
// Uso: node tests/jogar.mjs [pasta-para-capturas]   (precisa do Playwright instalado)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';

const root = new URL('..', import.meta.url).pathname, shots = process.argv[2];
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' };
// servido em uma subpasta de propósito: prova que os caminhos são relativos
const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith('/sub/jogo/')) { res.writeHead(404); return res.end(); }
  let file = url.slice('/sub/jogo/'.length) || 'index.html';
  try { const data = await readFile(join(root, file)); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); res.end(data); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}/sub/jogo/`;
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
let failed = 0;

for (const [name, opts] of [['computador', { viewport: { width: 1280, height: 720 } }], ['celular', { ...devices['iPhone 13'] }], ['celular-deitado', { ...devices['iPhone 13 landscape'] }]]) {
  const ctx = await browser.newContext(opts), p = await ctx.newPage(), problems = [], external = [];
  p.on('pageerror', (e) => problems.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
  p.on('request', (r) => { if (!r.url().startsWith(base) && !r.url().startsWith('data:')) external.push(r.url()); });
  p.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`));
  const tap = (sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) throw new Error('não achei ' + s); e.click(); }, sel);
  const tapText = (sel, text) => p.evaluate(([s, t]) => { const e = [...document.querySelectorAll(s)].find((x) => x.textContent.trim() === t && !x.disabled); if (!e) throw new Error(`não achei ${s} "${t}"`); e.click(); }, [sel, text]);
  const until = (fn, arg, ms = 15000) => p.waitForFunction(fn, arg, { timeout: ms });
  const free = () => until(() => !window.VDE.game.busy);
  const snap = async (n) => { if (shots) await p.screenshot({ path: `${shots}/${name}-${n}.png` }); };
  const t0 = Date.now();
  try {
    await p.goto(base, { waitUntil: 'networkidle' });
    await p.waitForTimeout(700); await snap('0-inicio');
    await tap('#start [data-play]');
    await until(() => window.VDE.game.level === 0); await free(); await p.waitForTimeout(600);

    // ----- Fase 1
    await tap('.spot-estante'); await until(() => document.querySelectorAll('.chip.on').length === 1); await snap('1-biblioteca');
    await tap('.spot-abajur'); await until(() => document.querySelectorAll('.chip.on').length === 2);
    await tap('.spot-bau'); await until(() => document.querySelector('.spot-bau.open')); await p.waitForTimeout(500); await snap('1-sapo');
    await tap('.float'); await until(() => document.querySelectorAll('.chip.on').length === 3);
    await tap('.spot-pedestal'); await p.waitForTimeout(1500);                       // cedo demais: só avisa
    if (await p.$('.puzzle')) throw new Error('o livro mágico abriu antes de achar todas as letras');
    await tap('.spot-globo'); await until(() => document.querySelectorAll('.chip.on').length === 4);
    await tap('.spot-coruja'); await until(() => document.querySelectorAll('.chip.on').length === 5);
    await tap('.spot-pedestal'); await until(() => document.querySelector('.puzzle'));
    await tapText('.tile', 'O'); await p.waitForTimeout(300);                          // erro de propósito: não pode travar
    for (const l of 'LIVRO') { await tapText('.tile', l); await p.waitForTimeout(950); if (l === 'V') await snap('1-palavra'); }
    await until(() => window.VDE.game.level === 1, null, 20000); await free(); await p.waitForTimeout(500);

    // ----- Fase 2
    for (const [id, parts] of [['sol', ['S', 'O', 'L']], ['flor', ['F', 'L', 'O', 'R']], ['gato', ['GA', 'TO']]]) {
      await tap('.spot-placa-' + id); await until(() => document.querySelector('.story')); await p.waitForTimeout(900);
      if (id === 'sol') { await p.evaluate(() => [...document.querySelectorAll('.flower.open')].find((f) => f.getAttribute('aria-label') === 'Flor A').click()); await p.waitForTimeout(2600); await snap('2-jardim'); }
      for (let i = 0; i < parts.length; i++) {
        await p.evaluate((t) => [...document.querySelectorAll('.flower.open:not(.picked)')].find((f) => f.getAttribute('aria-label') === 'Flor ' + t).click(), parts[i]);
        await until((n) => document.querySelectorAll('.story .slot.on').length === n || !document.querySelector('.story'), i + 1);
      }
      await until((cls) => document.querySelector('#world').classList.contains(cls), 'fx-' + id); await p.waitForTimeout(1500);
      if (id === 'flor') await snap('2-flor');
      await free();
    }
    await snap('2-gato');
    await tap('.spot-portao'); await until(() => window.VDE.game.level === 2, null, 25000); await free(); await p.waitForTimeout(500);

    // ----- Fase 3
    await tap('.spot-porta'); await p.waitForTimeout(2500);                           // ainda trancado
    await tap('.spot-padrao'); await until(() => document.querySelector('.pattern')); await snap('3-padrao');
    await tap('.opt[data-c="c"]'); await p.waitForTimeout(300); await tap('.opt[data-c="b"]');
    await until(() => document.querySelector('.gem.g1.on')); await p.waitForTimeout(1500);
    await tap('.spot-ordem'); await until(() => document.querySelector('.order')); await snap('3-ordem');
    for (const n of [1, 2, 3, 4]) { await tap(`.opt[data-n="${n}"]`); await p.waitForTimeout(250); }
    await until(() => document.querySelector('.gem.g2.on')); await p.waitForTimeout(1400);
    for (let i = 1; i <= 3; i++) { await p.evaluate(() => document.querySelector('.float:not(.gone)').click()); await until((n) => document.querySelectorAll('.float.gone').length === n, i); if (i === 1) await snap('3-castelo'); }
    await p.waitForTimeout(1000);
    await tap('.spot-porta'); await until(() => document.querySelector('.puzzle'));
    for (const s of ['MA', 'GI', 'A']) { await tapText('.tile', s); await p.waitForTimeout(950); }
    await until(() => !document.querySelector('#end').hidden, null, 20000); await p.waitForTimeout(2600); await snap('4-final');

    // ----- conferências
    const info = await p.evaluate(() => ({ words: window.VDE.game.words.join(' '), stars: window.VDE.game.stars.join(''), overflow: document.documentElement.scrollWidth - innerWidth, sound: document.querySelector('[data-sound]').getAttribute('aria-pressed') }));
    if (info.words !== 'LIVRO SOL FLOR GATO MAGIA') problems.push('palavras: ' + info.words);
    if (info.overflow > 0) problems.push('rolagem horizontal: ' + info.overflow);
    if (info.sound !== 'false') problems.push('o som deveria começar desligado');
    await tap('#end [data-play]'); await until(() => window.VDE.game.level === 0 && document.querySelector('#end').hidden); await free();
    if (await p.evaluate(() => document.querySelectorAll('.chip.on').length) !== 0) problems.push('jogar de novo não recomeçou do zero');
    await tap('#hud [data-sound]'); if (await p.evaluate(() => document.querySelector('[data-sound]').getAttribute('aria-pressed')) !== 'true') problems.push('botão de som não ligou');
    await tap('#hud [data-sound]'); if (await p.evaluate(() => document.querySelector('[data-sound]').getAttribute('aria-pressed')) !== 'false') problems.push('botão de som não desligou');
    if (external.length) problems.push('pedidos externos: ' + external.join(', '));
    console.log(`${problems.length ? '✗' : '✓'} ${name}: jogo completo em ${Math.round((Date.now() - t0) / 1000)}s (robô) — estrelas ${info.stars}`);
  } catch (e) { problems.push(e.message.split('\n')[0]); if (shots) await p.screenshot({ path: `${shots}/${name}-ERRO.png` }); console.log(`✗ ${name}: parou`); }
  if (problems.length) { failed++; problems.forEach((x) => console.log('   - ' + x)); }
  await ctx.close();
}

// teclado: andar, pular e investigar
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto(base); await p.evaluate(() => document.querySelector('#start [data-play]').click());
  await p.waitForFunction(() => window.VDE.game.level === 0 && !window.VDE.game.busy); await p.waitForTimeout(400);
  const x = () => p.evaluate(() => +document.querySelector('.actor').style.transform.match(/translate\(([-\d.]+)px/)[1]);
  const x0 = await x(); await p.keyboard.down('ArrowRight'); await p.waitForTimeout(500); await p.keyboard.up('ArrowRight'); const x1 = await x();
  await p.keyboard.press('Space'); await p.waitForTimeout(220); const jumping = await p.evaluate(() => !!document.querySelector('.actor.st-jump'));
  await p.keyboard.press('e'); await p.waitForFunction(() => document.querySelectorAll('.chip.on').length === 1, null, { timeout: 6000 }).catch(() => {});
  const got = await p.evaluate(() => document.querySelectorAll('.chip.on').length);
  const ok = x1 > x0 + 80 && jumping && got === 1;
  console.log(`${ok ? '✓' : '✗'} teclado: andou ${Math.round(x1 - x0)}, pulou ${jumping}, investigou ${got === 1}`); if (!ok) failed++;
  await p.close();
}
await browser.close(); server.close();
console.log(failed ? `\n${failed} cenário(s) com problema.` : '\nTudo certo: o jogo pode ser terminado em todos os cenários.');
process.exit(failed ? 1 : 0);
