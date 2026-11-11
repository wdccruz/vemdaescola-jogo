'use strict';

const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const game = path.resolve(__dirname, '..');
const prefix = '/vemdaescola-jogo/jogos/trem-das-historias/';
const mime = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.woff2':'font/woff2', '.webp':'image/webp', '.svg':'image/svg+xml'
};

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/iframe.html') {
    res.writeHead(200, {'Content-Type':mime['.html']});
    res.end(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><iframe title="O Trem das Histórias" src="${prefix}" style="width:100%;height:85vh;border:0"></iframe>`);
    return;
  }
  const relative = pathname.startsWith(prefix) ? pathname.slice(prefix.length) || 'index.html' : '';
  const file = path.resolve(game, relative);
  if (file.startsWith(game + path.sep) && mime[path.extname(file)]) {
    try {
      const body = await fs.readFile(file);
      res.writeHead(200, {'Content-Type':mime[path.extname(file)]});
      res.end(body);
      return;
    } catch (err) {
      if (err.code !== 'ENOENT') console.error(err);
    }
  }
  res.writeHead(404).end();
});

const solutions = [[1,0],[3,1],[3,0,2],[1,2,0],[2,0,1],[2,0,1],[2,0],[2,0]];
const captures = process.env.TREM_CAPTURAS;
const capture = (page, name) => captures && page.screenshot({path:path.join(captures, name+'.png'), fullPage:true, animations:'disabled'});
const piece = (page, i) => page.locator(`[data-piece="${i}"]`);

async function assertLayout(page) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'rolagem horizontal');
}

async function activate(page, locator, mode) {
  if (mode === 'toque') return locator.tap();
  if (mode === 'teclado') {
    const focused = () => locator.evaluate(el => el === document.activeElement);
    let tabs = 0;
    while (!await focused() && tabs < 24) {
      await page.keyboard.press('Tab');
      tabs++;
    }
    assert.equal(await locator.evaluate(el => el === document.activeElement), true, 'foco por Tab');
    return page.keyboard.press(tabs % 2 ? 'Space' : 'Enter');
  }
  return locator.click();
}

async function verifyAssets(page) {
  const assets = await page.evaluate(async () => {
    await document.fonts.ready;
    const cover = document.querySelector('.cover-art');
    await cover.decode();
    return {
      image:cover.naturalWidth,
      font:[...document.fonts].some(font => font.family === 'Baloo' && font.status === 'loaded')
    };
  });
  assert.deepEqual(assets, {image:1600,font:true});
}

async function play(browser, base, profile) {
  const {mode, options, screenshot} = profile;
  const page = await browser.newPage(options);
  const errors = [];
  const badRequests = [];
  const responses = new Map();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => badRequests.push(request.url()));
  page.on('response', response => responses.set(response.url(), response.status()));
  await page.goto(base+prefix);
  await verifyAssets(page);
  await assertLayout(page);
  assert.equal(await page.locator('#sound').getAttribute('aria-pressed'), 'false');
  if (screenshot) await capture(page, screenshot+'-abertura');

  if (mode === 'teclado') {
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.brand').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#sound').getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#sound').getAttribute('aria-pressed'), 'false');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  } else {
    await activate(page, page.locator('#start'), mode);
  }

  for (const [i, answer] of solutions.entries()) {
    assert.equal(await page.locator('#route [aria-current]').count(), 1);
    assert.equal(await page.locator('#chapter-label').textContent(), '✦ Estação '+(1+Math.floor(i/3)));
    await assertLayout(page);
    if (i === 0 || i === 3 || i === 6) {
      const wrong = [0,0,1][i/3];
      await activate(page, piece(page,wrong), mode);
      assert.notEqual(await page.locator('#feedback').textContent(), '');
      assert.equal(await page.locator('#next').isVisible(), false);
      await activate(page, page.locator('#hint'), mode);
      assert.match(await page.locator('#feedback').textContent(), /Pingo viu|Lume viu|Bandeira/);
    }
    if (i === 0) {
      if (options.reducedMotion) assert.equal(await page.locator('.puff').first().evaluate(el => getComputedStyle(el).animationName), 'none');
      await activate(page, page.locator('#whistle'), mode);
      assert.match(await page.locator('#feedback').textContent(), /Brasa mandou um oi/);
      await activate(page, piece(page,answer[0]), mode);
      await activate(page, page.locator('[data-remove="0"]'), mode);
      assert.equal(await piece(page,answer[0]).isEnabled(), true);
    }
    for (const index of answer) await activate(page, piece(page,index), mode);
    assert.equal(await page.locator('#next').isVisible(), true);
    if (i === 2) {
      assert.deepEqual(await page.locator('#scenery text').allTextContents(), ['LUA','SAPO','LAMPIÃO']);
    }
    await assertLayout(page);
    if (screenshot && [2,3,6,7].includes(i)) {
      await capture(page, screenshot+'-'+({2:'vale',3:'floresta',6:'cidade',7:'oficina'})[i]);
    }
    await activate(page, page.locator('#next'), mode);
  }

  const dial = i => page.locator(`[data-dial="${i}"]`);
  await activate(page, page.locator('[data-open]'), mode);
  assert.match(await page.locator('#feedback').textContent(), /trancado/);
  await activate(page, dial(0), mode);
  await activate(page, dial(0), mode);
  await activate(page, dial(1), mode);
  if (screenshot) await capture(page, screenshot+'-cofre');
  await activate(page, page.locator('[data-open]'), mode);
  assert.match(await page.locator('#board').textContent(), /Engrenagem recuperada/);
  await activate(page, page.locator('#next'), mode);
  assert.equal(await page.locator('#ending').isVisible(), true);
  assert.equal(await page.locator('#stamps [role="img"]').count(), 3);
  assert.equal(await page.locator('#route li').filter({hasText:'Concluída'}).count(), 3);
  assert.equal(await page.locator('[id]').evaluateAll(nodes => nodes.length === new Set(nodes.map(node => node.id)).size), true);
  await assertLayout(page);
  if (screenshot) await capture(page, screenshot+'-chegada');
  await activate(page, page.locator('#restart'), mode);
  assert.equal(await page.locator('#ending').isVisible(), false);
  assert.equal(await page.locator('#station-title').textContent(), 'O Vale das Palavras');
  assert.equal(await page.locator('#feedback').textContent(), '');
  assert.equal(await page.locator('#board .filled').count(), 0);
  assert.deepEqual(errors, []);
  assert.deepEqual(badRequests, []);
  for (const [url, status] of responses) {
    assert.ok(url.startsWith(base+prefix), url);
    assert.ok(status < 400, url);
  }
  console.log('OK', mode, options.viewport.width+'×'+options.viewport.height, '9 desafios, reinício, recursos e layout');
  await page.close();
}

async function run() {
  const { chromium } = require(process.env.TREM_PLAYWRIGHT || 'playwright');
  const browser = await chromium.launch({executablePath:process.env.TREM_CHROMIUM || undefined});
  try {
    if (captures) await fs.mkdir(captures, {recursive:true});
    const base = 'http://127.0.0.1:'+server.address().port;
    const profiles = [
      {mode:'mouse', options:{viewport:{width:1440,height:970}}, screenshot:'desktop'},
      {mode:'toque', options:{viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2}, screenshot:'celular'},
      {mode:'teclado', options:{viewport:{width:1024,height:768}, reducedMotion:'reduce'}},
      {mode:'mouse', options:{viewport:{width:320,height:640}}}
    ];
    for (const profile of profiles) await play(browser, base, profile);

    const framePage = await browser.newPage({viewport:{width:390,height:844}});
    await framePage.goto(base+'/iframe.html');
    const frame = framePage.frameLocator('iframe');
    await frame.locator('#start').click();
    await piece(frame,1).click();
    await piece(frame,0).click();
    assert.equal(await frame.locator('#next').isVisible(), true);
    console.log('OK iframe em subdiretório');
    await framePage.close();

    const filePage = await browser.newPage();
    await filePage.goto(pathToFileURL(path.join(game,'index.html')).href);
    await verifyAssets(filePage);
    await filePage.locator('#start').click();
    assert.equal(await filePage.locator('#adventure').isVisible(), true);
    console.log('OK abertura direta por arquivo');
    await filePage.close();
  } finally {
    await browser.close();
  }
}

const serve = process.argv.includes('--serve');
server.listen(serve ? Number(process.env.TREM_PORT || 8765) : 0, '127.0.0.1', async () => {
  if (serve) {
    console.log('http://127.0.0.1:'+server.address().port+prefix);
    return;
  }
  try {
    await run();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

