/* Cenários das três fases: tudo desenhado em SVG, gerado por código (leve). */
window.VDE = window.VDE || {};
(function () {
  const H = 600, GROUND = 500;
  const PAL = ['#ff7a6b', '#1fbfb8', '#ffc93c', '#7a5ae0', '#5fb760', '#ff9f43', '#3d8bd9', '#e85d9a'];
  const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const svg = (w, h, inner, cls = '') => `<svg class="${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;

  /* fileira de lombadas dentro de uma prateleira */
  function books(x, y, w, h, seed, pal = PAL) {
    const r = rng(seed); let out = '', cx = x + 3;
    while (cx < x + w - 14) {
      const bw = 12 + r() * 16, bh = h * (0.62 + r() * 0.36), c = pal[Math.floor(r() * pal.length)];
      if (cx + bw > x + w - 2) break;
      const lean = r() > 0.88 ? ` transform="rotate(${r() > 0.5 ? 9 : -9} ${cx + bw / 2} ${y + h})"` : '';
      out += `<g${lean}><rect x="${cx.toFixed(1)}" y="${(y + h - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2.5" fill="${c}"/><rect x="${(cx + 2).toFixed(1)}" y="${(y + h - bh + 7).toFixed(1)}" width="${(bw - 4).toFixed(1)}" height="3" fill="#fff" opacity=".45"/></g>`;
      cx += bw + 1.5;
    }
    return out;
  }
  function shelf(x, y, w, h, rows, seed, wood = '#8a5a3c', dark = '#5e3a26', pal) {
    const rh = (h - 14) / rows; let out = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${dark}"/><rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 14}" fill="#3b2540"/>`;
    for (let i = 0; i < rows; i++) out += books(x + 10, y + 8 + i * rh, w - 20, rh - 8, seed + i * 7, pal) + `<rect x="${x + 4}" y="${y + 8 + (i + 1) * rh - 8}" width="${w - 8}" height="8" rx="2" fill="${wood}"/>`;
    return out + `<rect x="${x}" y="${y}" width="${w}" height="10" rx="5" fill="${wood}"/>`;
  }

  /* pequenos desenhos usados como dica nas palavras */
  const ICONS = {
    livro: '<path d="M8 14q14-8 24 0 10-8 24 0v34q-14-7-24 0-10-7-24 0z" fill="#7a5ae0" stroke="#23233f" stroke-width="3" stroke-linejoin="round"/><path d="M32 14v34" stroke="#23233f" stroke-width="3"/><path d="M14 22q8-3 12 0M14 30q8-3 12 0M38 22q8-3 12 0M38 30q8-3 12 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none"/>',
    sol: '<g stroke="#f39c12" stroke-width="4" stroke-linecap="round"><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M52 12l-6 6M18 46l-6 6"/></g><circle cx="32" cy="32" r="15" fill="#ffd23f" stroke="#23233f" stroke-width="3"/><path d="M26 30v3M38 30v3M26 37q6 5 12 0" stroke="#23233f" stroke-width="2.5" stroke-linecap="round" fill="none"/>',
    flor: '<path d="M32 36v24" stroke="#3a9d55" stroke-width="5" stroke-linecap="round"/><path d="M32 50q-12-2-14-12 12 0 14 12zM32 54q12-2 14-12-12 0-14 12z" fill="#5fb760"/><g fill="#ff7aa8" stroke="#23233f" stroke-width="2.5"><circle cx="32" cy="12" r="9"/><circle cx="19" cy="22" r="9"/><circle cx="45" cy="22" r="9"/><circle cx="24" cy="36" r="9"/><circle cx="40" cy="36" r="9"/></g><circle cx="32" cy="25" r="8" fill="#ffd23f" stroke="#23233f" stroke-width="2.5"/>',
    gato: '<path d="M14 26l-2-16 14 8q6-2 12 0l14-8-2 16q4 6 4 13 0 17-22 17T10 39q0-7 4-13z" fill="#ff9f43" stroke="#23233f" stroke-width="3" stroke-linejoin="round"/><path d="M24 34v4M40 34v4" stroke="#23233f" stroke-width="3.5" stroke-linecap="round"/><path d="M29 43l3 3 3-3z" fill="#ff6f8f" stroke="#23233f" stroke-width="2" stroke-linejoin="round"/><path d="M8 42l10 2M8 48l10-1M56 42l-10 2M56 48l-10-1" stroke="#23233f" stroke-width="2" stroke-linecap="round"/>',
    magia: '<path d="M32 6l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="#ffd23f" stroke="#23233f" stroke-width="3" stroke-linejoin="round"/><path d="M52 6l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM12 44l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" stroke="#23233f" stroke-width="2" stroke-linejoin="round"/>',
  };
  VDE.icon = (name, size = 64) => `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  const stars = (n, w, h, seed) => { const r = rng(seed); let o = ''; for (let i = 0; i < n; i++) o += `<circle class="tw" style="animation-delay:${(r() * 4).toFixed(1)}s" cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(1 + r() * 2).toFixed(1)}" fill="#fff"/>`; return o; };

  /* ====================== FASE 1 — A BIBLIOTECA MISTERIOSA ====================== */
  function library() {
    const W = 2300;
    const win = (x) => `<g transform="translate(${x} 70)"><path d="M0 300V110a80 80 0 0 1 160 0v190z" fill="#1b2452" stroke="#6b4a8a" stroke-width="12"/><path d="M80 34v266M6 150h148M6 226h148" stroke="#6b4a8a" stroke-width="6"/>${stars(9, 150, 280, x)}</g>`;
    const back = svg(W, H, `
      <defs><linearGradient id="l1w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a6e"/><stop offset="1" stop-color="#5a3a7e"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#l1w)"/>
      ${[...Array(16)].map((_, i) => `<path d="M${i * 150 + 40} 0v${GROUND}" stroke="#fff" stroke-opacity=".035" stroke-width="46"/>`).join('')}
      ${win(260)}${win(980)}${win(1660)}
      <g transform="translate(1040 150)"><circle r="34" fill="#fff6c9"/><circle cx="12" cy="-6" r="30" fill="#1b2452"/></g>
      <rect y="${GROUND - 26}" width="${W}" height="26" fill="#4a2e63"/>`);
    const mid = svg(W, H, `
      <defs><linearGradient id="l1f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9774a"/><stop offset="1" stop-color="#8a5332"/></linearGradient></defs>
      <rect y="${GROUND}" width="${W}" height="100" fill="url(#l1f)"/>
      ${[...Array(24)].map((_, i) => `<path d="M${i * 100} ${GROUND}l-30 100" stroke="#6e4127" stroke-width="3" opacity=".5"/>`).join('')}
      <rect y="${GROUND}" width="${W}" height="6" fill="#d99a66"/>
      ${shelf(20, 150, 150, 350, 4, 3)}${shelf(520, 210, 120, 290, 3, 11)}${shelf(1010, 250, 110, 250, 3, 23)}${shelf(1330, 170, 150, 330, 4, 31)}${shelf(1840, 230, 110, 270, 3, 47)}${shelf(2210, 150, 90, 350, 4, 59)}
      <ellipse cx="780" cy="548" rx="210" ry="30" fill="#c2456b"/><ellipse cx="780" cy="548" rx="170" ry="21" fill="none" stroke="#ffd23f" stroke-width="5" stroke-dasharray="14 12"/>
      <g transform="translate(1190 ${GROUND})"><rect x="-70" y="-26" width="140" height="26" rx="4" fill="#7a5ae0"/><rect x="-58" y="-48" width="118" height="22" rx="4" fill="#ffc93c"/><rect x="-66" y="-68" width="124" height="20" rx="4" fill="#1fbfb8"/><rect x="-46" y="-86" width="92" height="18" rx="4" fill="#ff7a6b"/></g>
      ${[420, 1130, 1800].map((x) => `<g transform="translate(${x} 0)"><path d="M0 0v96" stroke="#2a1c44" stroke-width="5"/><path d="M-30 128q0-34 30-34t30 34z" fill="#ffc93c" stroke="#2a1c44" stroke-width="4"/><path class="glow" d="M-30 128l-90 372h240l-90-372z" fill="#ffe9a3" opacity=".11"/></g>`).join('')}`);

    const spots = [
      { id: 'estante', x: 330, w: 220, h: 340, stand: 30, label: 'Estante de livros', art: svg(220, 340, shelf(10, 10, 200, 330, 4, 5) + `<g class="wob">${books(24, 100, 170, 62, 77)}</g>`) },
      { id: 'abajur', x: 690, w: 120, h: 280, label: 'Abajur', art: svg(120, 280, `<path class="cone" d="M22 92L-60 280h240L98 92z" fill="#ffe9a3" opacity="0"/><rect x="56" y="88" width="8" height="176" fill="#2a1c44"/><ellipse cx="60" cy="268" rx="34" ry="9" fill="#2a1c44"/><path class="shade" d="M22 92q4-70 38-70t38 70z" fill="#7a5ae0" stroke="#2a1c44" stroke-width="5" stroke-linejoin="round"/><path d="M92 96v26" stroke="#2a1c44" stroke-width="3"/><circle cx="92" cy="126" r="5" fill="#ffc93c"/>`) },
      { id: 'bau', x: 930, w: 180, h: 150, label: 'Baú', art: svg(180, 150, `<g class="frog"><ellipse cx="90" cy="80" rx="34" ry="26" fill="#5fb760" stroke="#23233f" stroke-width="3"/><circle cx="74" cy="54" r="11" fill="#5fb760" stroke="#23233f" stroke-width="3"/><circle cx="106" cy="54" r="11" fill="#5fb760" stroke="#23233f" stroke-width="3"/><circle cx="75" cy="54" r="4" fill="#23233f"/><circle cx="107" cy="54" r="4" fill="#23233f"/><path d="M74 82q16 12 32 0" fill="none" stroke="#23233f" stroke-width="3" stroke-linecap="round"/></g><rect x="14" y="74" width="152" height="74" rx="8" fill="#a8693f" stroke="#23233f" stroke-width="4"/><path d="M14 100h152" stroke="#23233f" stroke-width="3"/><g class="lid"><path d="M14 78q0-44 76-44t76 44z" fill="#c98a55" stroke="#23233f" stroke-width="4" stroke-linejoin="round"/><path d="M50 40v38M130 40v38" stroke="#ffc93c" stroke-width="8"/></g><rect x="80" y="88" width="20" height="24" rx="4" fill="#ffc93c" stroke="#23233f" stroke-width="3"/>`) },
      { id: 'globo', x: 1560, w: 140, h: 200, label: 'Globo', art: svg(140, 200, `<path d="M70 150v34M36 190h68" stroke="#2a1c44" stroke-width="8" stroke-linecap="round"/><path d="M20 78a56 56 0 0 0 100 30" fill="none" stroke="#c98a55" stroke-width="7" stroke-linecap="round"/><g class="ball"><circle cx="70" cy="78" r="50" fill="#3d8bd9" stroke="#23233f" stroke-width="4"/><path d="M40 52q12-12 26-6 4 12-8 18-14 2-18-12zM74 82q16-6 28 4 2 16-12 22-14-4-16-26zM46 96q10 0 10 12-8 6-14-2z" fill="#5fb760" stroke="#23233f" stroke-width="2.5" stroke-linejoin="round"/></g>`) },
      { id: 'coruja', x: 1760, w: 170, h: 330, label: 'Coruja dormindo', art: svg(170, 330, `<rect x="10" y="118" width="150" height="14" rx="5" fill="#8a5a3c"/><path d="M30 132l14 26M140 132l-14 26" stroke="#5e3a26" stroke-width="6" stroke-linecap="round"/><g class="owl"><path d="M46 118q-10-70 40-72 50 2 40 72z" fill="#b98a62" stroke="#23233f" stroke-width="4" stroke-linejoin="round"/><path d="M52 52l10 14M120 52l-10 14" stroke="#23233f" stroke-width="4" stroke-linecap="round"/><ellipse cx="86" cy="96" rx="22" ry="20" fill="#f2dcc0"/><g class="shut"><path d="M60 76q9 8 18 0M94 76q9 8 18 0" fill="none" stroke="#23233f" stroke-width="4" stroke-linecap="round"/></g><g class="open"><circle cx="69" cy="76" r="13" fill="#fff" stroke="#23233f" stroke-width="3"/><circle cx="103" cy="76" r="13" fill="#fff" stroke="#23233f" stroke-width="3"/><circle cx="69" cy="77" r="5" fill="#23233f"/><circle cx="103" cy="77" r="5" fill="#23233f"/></g><path d="M80 86l6 9 6-9z" fill="#ffc93c" stroke="#23233f" stroke-width="2.5" stroke-linejoin="round"/></g><text class="zzz" x="128" y="44" font-size="26" font-weight="800" fill="#fff">z</text><text class="zzz z2" x="146" y="22" font-size="18" font-weight="800" fill="#fff">z</text>`) },
      { id: 'pedestal', x: 2100, w: 240, h: 330, label: 'Livro mágico', art: svg(240, 330, `<circle class="aura" cx="120" cy="150" r="104" fill="#ffe9a3" opacity=".16"/><path d="M92 326h56l-10-120h-36z" fill="#6b4a8a" stroke="#23233f" stroke-width="4" stroke-linejoin="round"/><path d="M60 326h120" stroke="#23233f" stroke-width="10" stroke-linecap="round"/><path d="M40 214h160l-14-22H54z" fill="#8a66b0" stroke="#23233f" stroke-width="4" stroke-linejoin="round"/><g class="tome"><rect x="62" y="96" width="116" height="92" rx="10" fill="#7a5ae0" stroke="#23233f" stroke-width="4"/><rect x="62" y="96" width="16" height="92" rx="6" fill="#5637b8"/><path d="M128 118l6 15 15 6-15 6-6 15-6-15-15-6 15-6z" fill="#ffd23f" stroke="#23233f" stroke-width="3" stroke-linejoin="round"/><rect class="lock" x="160" y="130" width="26" height="24" rx="5" fill="#ffc93c" stroke="#23233f" stroke-width="3"/></g>`) },
    ];
    return { W, back, mid, spots, start: 150, name: 'A Biblioteca Misteriosa' };
  }

  /* ====================== FASE 2 — O JARDIM DAS PALAVRAS ====================== */
  const FLOWER_COLORS = ['#ff7aa8', '#ffc93c', '#b08bff', '#ff8a5c', '#6fd3ff'];
  VDE.flower = (text, i) => svg(96, 170, `<path d="M48 80v88" stroke="#3a9d55" stroke-width="7" stroke-linecap="round"/><path class="leaf" d="M48 138q-26-4-30-26 26 0 30 26zM48 150q26-4 30-26-26 0-30 26z" fill="#5fb760" stroke="#2f7d45" stroke-width="2.5"/><g class="petals" fill="${FLOWER_COLORS[i % 5]}" stroke="#23233f" stroke-width="3"><circle cx="48" cy="18" r="17"/><circle cx="20" cy="38" r="17"/><circle cx="76" cy="38" r="17"/><circle cx="30" cy="70" r="17"/><circle cx="66" cy="70" r="17"/></g><circle cx="48" cy="46" r="24" fill="#fff8e1" stroke="#23233f" stroke-width="3"/><text x="48" y="${text.length > 1 ? 55 : 58}" text-anchor="middle" font-size="${text.length > 1 ? 24 : 32}" font-weight="800" fill="#23233f">${text}</text><path class="smile" d="M40 40v5M56 40v5M38 52q10 9 20 0" fill="none" stroke="#23233f" stroke-width="3.5" stroke-linecap="round"/>`, 'flower-art');

  function garden() {
    const W = 2400;
    const cloud = (x, y, s) => `<g class="cloud" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="60" ry="24" fill="#fff"/><ellipse cx="-30" cy="-14" rx="30" ry="22" fill="#fff"/><ellipse cx="22" cy="-20" rx="36" ry="26" fill="#fff"/></g>`;
    const back = svg(W, H, `
      <defs><linearGradient id="l2s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd8ff"/><stop offset="1" stop-color="#e9f9ff"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#l2s)"/>
      <g class="sun" transform="translate(520 360)"><g class="rays" stroke="#ffd23f" stroke-width="10" stroke-linecap="round">${[...Array(10)].map((_, i) => `<path d="M0 -78v-30" transform="rotate(${i * 36})"/>`).join('')}</g><circle r="62" fill="#ffd23f" stroke="#f39c12" stroke-width="6"/><path d="M-20 -8v8M20 -8v8M-22 18q22 20 44 0" stroke="#b96a00" stroke-width="6" stroke-linecap="round" fill="none"/></g>
      ${cloud(240, 110, 1)}${cloud(900, 70, 1.3)}${cloud(1500, 130, 0.9)}${cloud(2100, 80, 1.2)}
      <path d="M0 ${GROUND}V380q200-90 420-20t460-30 440 40 480-50 600 30V${GROUND}z" fill="#9be08a"/>
      <path d="M0 ${GROUND}V430q260-60 520-10t520-30 560 30 800-10V${GROUND}z" fill="#7fd070"/>`);
    const tree = `<g transform="translate(2070 ${GROUND})"><path d="M-26 0q10-120 4-230h50q-8 110 4 230z" fill="#9a6a45" stroke="#23233f" stroke-width="4" stroke-linejoin="round"/><path d="M24 -160q70-10 120-40" fill="none" stroke="#9a6a45" stroke-width="20" stroke-linecap="round"/><g fill="#4fae5a" stroke="#23233f" stroke-width="4"><circle cx="-70" cy="-280" r="80"/><circle cx="60" cy="-310" r="96"/><circle cx="-10" cy="-370" r="84"/><circle cx="150" cy="-250" r="60"/></g>
      <g class="cat" transform="translate(96 -214)"><path class="tail" d="M40 6q34 6 30 40" fill="none" stroke="#ff9f43" stroke-width="12" stroke-linecap="round"/><ellipse cx="6" cy="8" rx="44" ry="20" fill="#ff9f43" stroke="#23233f" stroke-width="3"/><path d="M-50 -2l-4-22 16 10q8-3 16 0l16-10-4 22q4 8 0 18-22 12-40 0-4-10 0-18z" fill="#ff9f43" stroke="#23233f" stroke-width="3" stroke-linejoin="round"/><path d="M-38 6q5 5 10 0M-20 6q5 5 10 0" fill="none" stroke="#23233f" stroke-width="3" stroke-linecap="round"/></g></g>`;
    const mid = svg(W, H, `
      <defs><linearGradient id="l2g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#63bf5c"/><stop offset="1" stop-color="#3f9a4a"/></linearGradient></defs>
      ${tree}
      <g class="bigflower" transform="translate(1530 ${GROUND})"><path d="M0 0v-250" stroke="#3a9d55" stroke-width="12" stroke-linecap="round"/><g class="bf-head" transform="translate(0 -270)"><g fill="#ff7aa8" stroke="#23233f" stroke-width="4">${[...Array(8)].map((_, i) => `<ellipse cx="0" cy="-64" rx="30" ry="50" transform="rotate(${i * 45})"/>`).join('')}</g><circle r="42" fill="#ffd23f" stroke="#23233f" stroke-width="4"/><path d="M-14 -6v8M14 -6v8M-16 14q16 14 32 0" stroke="#23233f" stroke-width="5" stroke-linecap="round" fill="none"/></g></g>
      <rect y="${GROUND}" width="${W}" height="100" fill="url(#l2g)"/>
      <path d="M0 ${GROUND}q30-16 60 0t60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0v12H0z" fill="#63bf5c"/>
      <ellipse cx="830" cy="560" rx="130" ry="24" fill="#6fd3ff" opacity=".8"/><ellipse cx="800" cy="556" rx="50" ry="8" fill="#fff" opacity=".5"/>`);
    const sign = (icon) => svg(150, 190, `<rect x="68" y="90" width="14" height="100" rx="4" fill="#9a6a45" stroke="#23233f" stroke-width="3"/><rect x="8" y="8" width="134" height="104" rx="14" fill="#fff8e1" stroke="#23233f" stroke-width="4"/><g transform="translate(43 28)">${ICONS[icon]}</g><circle class="done" cx="128" cy="22" r="16" fill="#5fb760" stroke="#23233f" stroke-width="3"/><path class="done" d="M120 22l6 6 10-11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`);
    const tasks = [
      { id: 'sol', x: 480, icon: 'sol', before: 'O', after: 'acorda o jardim.', answer: ['S', 'O', 'L'], extra: ['A', 'U'], word: 'SOL' },
      { id: 'flor', x: 1180, icon: 'flor', before: 'A', after: 'abriu bem cedo.', answer: ['F', 'L', 'O', 'R'], extra: ['E', 'T'], word: 'FLOR' },
      { id: 'gato', x: 1880, icon: 'gato', before: 'O', after: 'dorme na árvore.', answer: ['GA', 'TO'], extra: ['PA', 'TA', 'BO'], word: 'GATO' },
    ];
    const spots = tasks.map((t) => ({ id: 'placa-' + t.id, x: t.x, w: 150, h: 190, label: 'Placa da história', art: sign(t.icon), task: t }));
    spots.push({ id: 'portao', x: 2290, w: 220, h: 330, label: 'Portão do castelo', art: svg(220, 330, `<path d="M20 330V130a90 90 0 0 1 180 0v200z" fill="#6b4a8a" stroke="#23233f" stroke-width="5"/><g class="doors"><path class="dl" d="M34 330V134a76 76 0 0 1 76-76v272z" fill="#b08bff" stroke="#23233f" stroke-width="4"/><path class="dr" d="M186 330V134a76 76 0 0 0-76-76v272z" fill="#b08bff" stroke="#23233f" stroke-width="4"/></g><circle cx="98" cy="200" r="6" fill="#ffc93c"/><circle cx="122" cy="200" r="6" fill="#ffc93c"/><path d="M110 22l8 18 20 2-15 13 5 19-18-10-18 10 5-19-15-13 20-2z" fill="#ffd23f" stroke="#23233f" stroke-width="3" stroke-linejoin="round"/>`) });
    return { W, back, mid, spots, tasks, start: 160, name: 'O Jardim das Palavras' };
  }

  /* ====================== FASE 3 — O CASTELO DOS LIVROS ====================== */
  function castle() {
    const W = 2000;
    const tower = (x, h, seed) => { const r = rng(seed); let o = ''; for (let y = GROUND; y > GROUND - h; y -= 26) o += `<rect x="${x - 60 + r() * 14}" y="${y - 26}" width="${106 + r() * 16}" height="24" rx="4" fill="${['#4b3a8c', '#5a46a6', '#3f3180', '#6652b8'][Math.floor(r() * 4)]}"/>`; return o + `<path d="M${x - 70} ${GROUND - h}l70-90 70 90z" fill="#c2456b"/><path d="M${x} ${GROUND - h - 90}v-40l34 14-34 14" fill="#ffc93c" stroke="#ffc93c" stroke-width="3"/>`; };
    const back = svg(W, H, `
      <defs><linearGradient id="l3s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1746"/><stop offset="1" stop-color="#4a2e7a"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#l3s)"/>${stars(60, W, 380, 9)}
      <circle cx="1500" cy="110" r="46" fill="#fff6c9"/>
      ${tower(160, 300, 1)}${tower(620, 380, 2)}${tower(1100, 260, 3)}${tower(1640, 400, 4)}`);
    const arch = (x) => `<path d="M${x} ${GROUND}V230a110 110 0 0 1 220 0v270z" fill="#2c2360" opacity=".55"/>`;
    const torch = (x) => `<g transform="translate(${x} 250)"><path d="M-8 0h16l-4 46h-8z" fill="#8a5a3c" stroke="#23233f" stroke-width="3"/><path class="flame" d="M0 -44q20 22 10 40-10 10-20 0-10-18 10-40z" fill="#ffc93c" stroke="#ff7a3c" stroke-width="4"/></g>`;
    const mid = svg(W, H, `
      <defs><linearGradient id="l3f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a66b0"/><stop offset="1" stop-color="#5c4486"/></linearGradient></defs>
      ${arch(240)}${arch(700)}${arch(1280)}
      ${torch(200)}${torch(660)}${torch(1220)}${torch(1560)}
      <rect y="${GROUND}" width="${W}" height="100" fill="url(#l3f)"/>
      ${[...Array(21)].map((_, i) => `<rect x="${i * 100}" y="${GROUND}" width="50" height="50" fill="#fff" opacity=".07"/><rect x="${i * 100 + 50}" y="${GROUND + 50}" width="50" height="50" fill="#fff" opacity=".07"/>`).join('')}
      <rect y="${GROUND}" width="${W}" height="6" fill="#b08bff"/>
      ${[[1150, 0], [1262, 26]].map(([x, d]) => `<g transform="translate(${x} ${GROUND})"><rect x="-56" y="-${26 + d}" width="112" height="${26 + d}" rx="4" fill="#3d8bd9" stroke="#23233f" stroke-width="3"/><rect x="-46" y="-${48 + d}" width="92" height="22" rx="4" fill="#ffc93c" stroke="#23233f" stroke-width="3"/></g>`).join('')}`);
    const spots = [
      { id: 'padrao', x: 440, w: 250, h: 320, label: 'Estante do padrão', art: svg(250, 320, shelf(10, 10, 230, 310, 3, 71, '#6b4a8a', '#3f2a63', ['#4b3a8c', '#6652b8', '#8a66b0']) + `<rect x="34" y="118" width="182" height="86" rx="10" fill="#fff8e1" stroke="#23233f" stroke-width="4"/><g class="mini">${['#1fbfb8', '#ff7a6b', '#1fbfb8', '#ff7a6b'].map((c, i) => `<rect x="${46 + i * 34}" y="${134}" width="24" height="54" rx="4" fill="${c}" stroke="#23233f" stroke-width="3"/>`).join('')}<text x="194" y="176" text-anchor="middle" font-size="40" font-weight="800" fill="#c2456b">?</text></g><circle class="gem g1" cx="125" cy="48" r="20" fill="#5b5480" stroke="#23233f" stroke-width="4"/>`) },
      { id: 'ordem', x: 900, w: 240, h: 300, label: 'Torre de livros bagunçada', art: svg(240, 300, `<g class="mess"><rect x="30" y="252" width="150" height="40" rx="6" fill="#ff7a6b" stroke="#23233f" stroke-width="4" transform="rotate(-4 105 272)"/><rect x="70" y="214" width="70" height="36" rx="6" fill="#ffc93c" stroke="#23233f" stroke-width="4" transform="rotate(7 105 232)"/><rect x="40" y="170" width="170" height="42" rx="6" fill="#1fbfb8" stroke="#23233f" stroke-width="4" transform="rotate(-6 125 191)"/><rect x="84" y="134" width="100" height="34" rx="6" fill="#7a5ae0" stroke="#23233f" stroke-width="4" transform="rotate(9 134 151)"/></g><g class="tidy"><rect x="35" y="250" width="170" height="42" rx="6" fill="#1fbfb8" stroke="#23233f" stroke-width="4"/><rect x="45" y="210" width="150" height="40" rx="6" fill="#ff7a6b" stroke="#23233f" stroke-width="4"/><rect x="70" y="174" width="100" height="36" rx="6" fill="#7a5ae0" stroke="#23233f" stroke-width="4"/><rect x="85" y="140" width="70" height="34" rx="6" fill="#ffc93c" stroke="#23233f" stroke-width="4"/></g><circle class="gem g2" cx="120" cy="90" r="20" fill="#5b5480" stroke="#23233f" stroke-width="4"/>`) },
      { id: 'porta', x: 1780, w: 300, h: 420, label: 'O último livro mágico', art: svg(300, 420, `<circle class="aura" cx="150" cy="210" r="150" fill="#ffe9a3" opacity=".14"/><path d="M40 420V170a110 110 0 0 1 220 0v250z" fill="#2c2360" stroke="#ffc93c" stroke-width="8"/><g class="tome"><rect x="84" y="170" width="132" height="170" rx="14" fill="#c2456b" stroke="#23233f" stroke-width="5"/><rect x="84" y="170" width="20" height="170" rx="8" fill="#96304f"/><path d="M158 214l9 23 23 9-23 9-9 23-9-23-23-9 23-9z" fill="#ffd23f" stroke="#23233f" stroke-width="4" stroke-linejoin="round"/><path d="M128 300h60" stroke="#ffd23f" stroke-width="6" stroke-linecap="round"/></g><circle class="gem g1" cx="100" cy="120" r="16" fill="#5b5480" stroke="#23233f" stroke-width="4"/><circle class="gem g2" cx="150" cy="96" r="16" fill="#5b5480" stroke="#23233f" stroke-width="4"/><circle class="gem g3" cx="200" cy="120" r="16" fill="#5b5480" stroke="#23233f" stroke-width="4"/>`) },
    ];
    return { W, back, mid, spots, start: 150, name: 'O Castelo dos Livros' };
  }

  VDE.scenes = [library, garden, castle];
  VDE.GROUND = GROUND;
})();
