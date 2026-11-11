/* Cenários das três fases: ilustração em SVG gerada por código (leve), em clima de livro ilustrado. */
window.VDE = window.VDE || {};
(function () {
  const H = 600, GROUND = 500, INK = '#4a2b3c';
  const PAL = ['#f4517f', '#2b8ae6', '#ffc23d', '#8a55e0', '#4fb86a', '#ff8a3d', '#35b7c4', '#e0507a', '#7a4fc9', '#f2a23a'];
  const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const DEFS = `<defs>
    <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c98a4f"/><stop offset="1" stop-color="#9a5f30"/></linearGradient>
    <linearGradient id="woodd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c4a25"/><stop offset=".5" stop-color="#99602f"/><stop offset="1" stop-color="#7c4a25"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe773"/><stop offset="1" stop-color="#f7a81d"/></linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#fff3b8" stop-opacity=".95"/><stop offset=".45" stop-color="#ffd86a" stop-opacity=".4"/><stop offset="1" stop-color="#ffd86a" stop-opacity="0"/></radialGradient>
    <radialGradient id="shade"><stop offset="0" stop-color="#2a1430" stop-opacity=".3"/><stop offset="1" stop-color="#2a1430" stop-opacity="0"/></radialGradient>
  </defs>`;
  const svg = (w, h, inner, cls = '') => `<svg class="${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${DEFS}${inner}</svg>`;
  const shadow = (cx, rx, y = GROUND + 4) => `<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${Math.max(7, rx * 0.11)}" fill="url(#shade)"/>`;

  /* fileira de lombadas */
  function books(x, y, w, h, seed, pal = PAL) {
    const r = rng(seed); let out = '', cx = x + 3;
    while (cx < x + w - 14) {
      const bw = 13 + r() * 17, bh = h * (0.62 + r() * 0.36), c = pal[Math.floor(r() * pal.length)];
      if (cx + bw > x + w - 2) break;
      const lean = r() > 0.86 ? ` transform="rotate(${r() > 0.5 ? 9 : -9} ${cx + bw / 2} ${y + h})"` : '', by = y + h - bh;
      out += `<g${lean}><rect x="${cx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${c}"/><rect x="${cx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="url(#sheen)"/><rect x="${(cx + 2.5).toFixed(1)}" y="${(by + 8).toFixed(1)}" width="${(bw - 5).toFixed(1)}" height="3.5" rx="1.5" fill="#fff6d8" opacity=".75"/>${r() > 0.5 ? `<rect x="${(cx + 2.5).toFixed(1)}" y="${(by + bh - 14).toFixed(1)}" width="${(bw - 5).toFixed(1)}" height="3" rx="1.5" fill="#fff6d8" opacity=".5"/>` : ''}</g>`;
      cx += bw + 1.5;
    }
    return out;
  }
  function shelf(x, y, w, h, rows, seed, opt = {}) {
    const rh = (h - 18) / rows, far = opt.far;
    let out = `<g${far ? ' opacity=".5"' : ''}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="url(#woodd)"/><rect x="${x + 9}" y="${y + 10}" width="${w - 18}" height="${h - 16}" rx="3" fill="${opt.inside || '#5a3320'}"/>`;
    for (let i = 0; i < rows; i++) out += books(x + 11, y + 10 + i * rh, w - 22, rh - 9, seed + i * 7, opt.pal) + `<rect x="${x + 5}" y="${y + 10 + (i + 1) * rh - 9}" width="${w - 10}" height="9" rx="2.5" fill="url(#wood)"/><rect x="${x + 9}" y="${y + 10 + (i + 1) * rh}" width="${w - 18}" height="5" fill="#2a1430" opacity=".18"/>`;
    return out + `<path d="M${x - 6} ${y + 4}q${w / 2 + 6}-22 ${w + 12} 0v8h-${w + 12}z" fill="url(#wood)" stroke="#7c4a25" stroke-width="2"/></g>`;
  }
  const vine = (x, len, seed) => { const r = rng(seed); let o = `<path d="M${x} -6q${10 - r() * 20} ${len / 2} 0 ${len}" fill="none" stroke="#3f8f4a" stroke-width="4" stroke-linecap="round"/>`; for (let yy = 16; yy < len; yy += 26) { const s = r() > 0.5 ? 1 : -1; o += `<path d="M${x} ${yy}q${s * 22} -12 ${s * 26} 10 ${-s * 20} 6 ${-s * 26} -10z" fill="${r() > 0.5 ? '#5cb85f' : '#7fcf6a'}" stroke="#3f8f4a" stroke-width="1.5"/>`; } return `<g class="vine" style="transform-origin:${x}px 0px;animation-delay:${(r() * 3).toFixed(1)}s">${o}</g>`; };
  const motes = (n, w, h, seed) => { const r = rng(seed); let o = ''; for (let i = 0; i < n; i++) o += `<circle class="tw" style="animation-delay:${(r() * 4).toFixed(1)}s" cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(1.5 + r() * 2.5).toFixed(1)}" fill="#fff6c9"/>`; return o; };

  /* pequenos desenhos usados como dica nas palavras */
  const ICONS = {
    livro: `<path d="M8 14q14-8 24 0 10-8 24 0v34q-14-7-24 0-10-7-24 0z" fill="#8a55e0" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M32 14v34" stroke="${INK}" stroke-width="3"/><path d="M14 22q8-3 12 0M14 30q8-3 12 0M38 22q8-3 12 0M38 30q8-3 12 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none"/>`,
    sol: `<g stroke="#f39c12" stroke-width="4" stroke-linecap="round"><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M52 12l-6 6M18 46l-6 6"/></g><circle cx="32" cy="32" r="15" fill="#ffd23f" stroke="${INK}" stroke-width="3"/><path d="M26 30v3M38 30v3M26 37q6 5 12 0" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" fill="none"/>`,
    flor: `<path d="M32 36v24" stroke="#3a9d55" stroke-width="5" stroke-linecap="round"/><path d="M32 50q-12-2-14-12 12 0 14 12zM32 54q12-2 14-12-12 0-14 12z" fill="#5fb760"/><g fill="#ff7aa8" stroke="${INK}" stroke-width="2.5"><circle cx="32" cy="12" r="9"/><circle cx="19" cy="22" r="9"/><circle cx="45" cy="22" r="9"/><circle cx="24" cy="36" r="9"/><circle cx="40" cy="36" r="9"/></g><circle cx="32" cy="25" r="8" fill="#ffd23f" stroke="${INK}" stroke-width="2.5"/>`,
    gato: `<path d="M14 26l-2-16 14 8q6-2 12 0l14-8-2 16q4 6 4 13 0 17-22 17T10 39q0-7 4-13z" fill="#ff9f43" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M24 34v4M40 34v4" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><path d="M29 43l3 3 3-3z" fill="#ff6f8f" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><path d="M8 42l10 2M8 48l10-1M56 42l-10 2M56 48l-10-1" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
    magia: `<path d="M32 6l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill="#ffd23f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M52 6l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM12 44l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`,
  };
  VDE.icon = (name, size = 64) => `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  /* ====================== FASE 1 — A BIBLIOTECA MISTERIOSA ====================== */
  function library() {
    const W = 2300;
    const win = (x) => `<g transform="translate(${x} 40)">
      <path d="M0 330V120a95 95 0 0 1 190 0v210z" fill="url(#l1sky)"/>
      <path d="M0 330v-70q50-34 96-10t94-14v94z" fill="#8fd36f"/><path d="M0 330v-40q60-20 110-4t80-10v54z" fill="#6fbf5c"/>
      <circle cx="138" cy="96" r="26" fill="#fff6c9"/><circle cx="138" cy="96" r="44" fill="url(#halo)"/>
      <ellipse cx="52" cy="120" rx="30" ry="11" fill="#fff" opacity=".9"/><ellipse cx="70" cy="110" rx="20" ry="12" fill="#fff" opacity=".9"/>
      <path d="M0 330V120a95 95 0 0 1 190 0v210z" fill="none" stroke="url(#woodd)" stroke-width="14"/>
      <path d="M95 26v304M4 150h182M4 240h182" stroke="#99602f" stroke-width="7"/>
      <path d="M-14 330h218v16h-218z" fill="url(#wood)"/>
      <path class="beam" d="M10 60l-220 440h330L180 60z" fill="url(#l1beam)"/></g>`;
    const back = svg(W, H, `
      <defs>
        <linearGradient id="l1w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9dba6"/><stop offset="1" stop-color="#eebf85"/></linearGradient>
        <linearGradient id="l1sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd4ff"/><stop offset="1" stop-color="#dff5ff"/></linearGradient>
        <linearGradient id="l1beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8d8" stop-opacity=".5"/><stop offset="1" stop-color="#fff8d8" stop-opacity="0"/></linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#l1w)"/>
      ${[...Array(24)].map((_, i) => `<path d="M${i * 100 + 30} 0v${GROUND}" stroke="#fff" stroke-opacity=".16" stroke-width="34"/>`).join('')}
      ${shelf(60, 150, 170, 300, 4, 101, { far: 1 })}${shelf(560, 200, 200, 250, 3, 131, { far: 1 })}${shelf(1290, 160, 220, 290, 4, 151, { far: 1 })}${shelf(1980, 190, 190, 260, 3, 171, { far: 1 })}
      ${win(300)}${win(1020)}${win(1710)}
      <rect y="${GROUND - 62}" width="${W}" height="62" fill="#c98a4f"/><rect y="${GROUND - 62}" width="${W}" height="7" fill="#e0a868"/>
      ${[...Array(30)].map((_, i) => `<rect x="${i * 80 + 12}" y="${GROUND - 46}" width="56" height="34" rx="4" fill="#b9763f" opacity=".7"/>`).join('')}
      ${motes(40, W, 420, 5)}`);

    const lamp = (x) => `<g transform="translate(${x} 0)"><path d="M0 0v84" stroke="#7c4a25" stroke-width="5"/><circle cx="0" cy="150" r="120" fill="url(#halo)" class="glow"/><path d="M-38 122q4-40 38-40t38 40z" fill="url(#gold)" stroke="#c9820a" stroke-width="3"/><ellipse cx="0" cy="122" rx="38" ry="7" fill="#fff6c9"/></g>`;
    const mid = svg(W, H, `
      <defs>
        <linearGradient id="l1f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d79a5e"/><stop offset="1" stop-color="#a8683a"/></linearGradient>
        <radialGradient id="l1rug"><stop offset="0" stop-color="#ffd76a"/><stop offset=".34" stop-color="#ffb347"/><stop offset=".36" stop-color="#f4517f"/><stop offset=".62" stop-color="#e03d74"/><stop offset=".64" stop-color="#ff8a3d"/><stop offset=".86" stop-color="#f36f3a"/><stop offset=".88" stop-color="#c22f63"/><stop offset="1" stop-color="#c22f63"/></radialGradient>
      </defs>
      <rect y="${GROUND}" width="${W}" height="100" fill="url(#l1f)"/>
      ${[...Array(24)].map((_, i) => `<path d="M${i * 100} ${GROUND}l-36 100" stroke="#8a5330" stroke-width="2.5" opacity=".45"/>`).join('')}
      <rect y="${GROUND}" width="${W}" height="7" fill="#f0bd84"/>
      <ellipse cx="820" cy="552" rx="330" ry="40" fill="url(#l1rug)"/><ellipse cx="820" cy="552" rx="330" ry="40" fill="none" stroke="#a82552" stroke-width="3"/>
      <ellipse cx="1700" cy="556" rx="240" ry="32" fill="url(#l1rug)" opacity=".9"/>
      ${shadow(100, 100)}${shelf(20, 130, 160, 370, 4, 3)}
      ${shadow(560, 80)}${shelf(500, 210, 126, 290, 3, 11)}
      ${shadow(1065, 78)}${shelf(1005, 250, 118, 250, 3, 23)}
      ${shadow(1400, 100)}${shelf(1322, 160, 160, 340, 4, 31)}
      ${shadow(1900, 76)}${shelf(1842, 230, 116, 270, 3, 47)}
      ${shelf(2212, 140, 100, 360, 4, 59)}
      <g transform="translate(1322 ${GROUND})" stroke="#8a5330" stroke-width="8" stroke-linecap="round"><path d="M-64 0l46-330M-18 0l46-330"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${-56 + i * 7.8} ${-52 - i * 50}h46" stroke-width="6"/>`).join('')}</g>
      <g transform="translate(246 ${GROUND})">${shadow(0, 50, 2)}<path d="M-28 0h56l-8-52h-40z" fill="#e2703a" stroke="#a84a1e" stroke-width="3" stroke-linejoin="round"/><path d="M-34 -52h68v-12h-68z" fill="#f08a52" stroke="#a84a1e" stroke-width="3"/><g fill="#4fb86a" stroke="#2f8a48" stroke-width="2.5"><path d="M0 -64q-50-30-44-100 40 30 44 100z"/><path d="M0 -64q50-34 48-104-42 32-48 104z"/><path d="M0 -64q-10-70 4-126 22 60-4 126z" fill="#6fd07a"/></g></g>
      <g transform="translate(1190 ${GROUND})">${shadow(0, 86, 2)}<rect x="-74" y="-28" width="148" height="28" rx="5" fill="#8a55e0" stroke="#5a30a8" stroke-width="2.5"/><rect x="-74" y="-28" width="148" height="28" rx="5" fill="url(#sheen)"/><rect x="-60" y="-52" width="124" height="24" rx="5" fill="#ffc23d" stroke="#c9820a" stroke-width="2.5"/><rect x="-68" y="-74" width="130" height="22" rx="5" fill="#35b7c4" stroke="#1d7f8a" stroke-width="2.5"/><rect x="-48" y="-94" width="96" height="20" rx="5" fill="#f4517f" stroke="#a82552" stroke-width="2.5"/></g>
      ${lamp(430)}${lamp(1150)}${lamp(1830)}`);

    const fore = svg(W * 1.3, H, `
      ${vine(140, 150, 2)}${vine(190, 90, 3)}${vine(980, 120, 4)}${vine(1730, 170, 6)}${vine(1780, 100, 7)}${vine(2560, 140, 8)}
      <g transform="translate(1420 600)"><rect x="-150" y="-52" width="300" height="60" rx="8" fill="#6a3fc4"/><rect x="-150" y="-52" width="300" height="60" rx="8" fill="url(#sheen)"/><rect x="-120" y="-100" width="250" height="50" rx="8" fill="#2b8ae6"/><rect x="-104" y="-92" width="218" height="34" rx="3" fill="#fff3d6"/></g>
      <g transform="translate(2700 600)" fill="#3f8f4a"><path d="M0 0q-80-60-70-170 60 50 70 170z"/><path d="M0 0q60-80 50-190-50 70-50 190z" fill="#5cb85f"/></g>`, 'fore-art');

    const spots = [
      { id: 'estante', x: 330, w: 220, h: 350, stand: 30, label: 'Estante de livros', art: svg(220, 350, shadow(110, 120, 346) + shelf(10, 14, 200, 336, 4, 5) + `<g class="wob">${books(24, 104, 170, 64, 77)}</g>`) },
      { id: 'abajur', x: 690, w: 130, h: 290, label: 'Abajur', art: svg(130, 290, `${shadow(65, 46, 284)}<circle class="cone" cx="65" cy="80" r="150" fill="url(#halo)" opacity="0"/><rect x="60" y="92" width="10" height="178" rx="4" fill="url(#gold)" stroke="#c9820a" stroke-width="2"/><path d="M34 282q0-14 31-14t31 14z" fill="url(#gold)" stroke="#c9820a" stroke-width="2.5"/><path class="shade" d="M22 96q6-74 43-74t43 74z" fill="#8a55e0" stroke="#5a30a8" stroke-width="3" stroke-linejoin="round"/><path d="M34 86q4-46 26-56" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".3"/><path d="M26 96h78" stroke="url(#gold)" stroke-width="6" stroke-linecap="round"/><path d="M98 100v26" stroke="#c9820a" stroke-width="2.5"/><circle cx="98" cy="131" r="6" fill="url(#gold)" stroke="#c9820a" stroke-width="2"/>`) },
      { id: 'bau', x: 930, w: 190, h: 160, label: 'Baú', art: svg(190, 160, `${shadow(95, 96, 154)}<g class="frog"><ellipse cx="95" cy="86" rx="36" ry="27" fill="#6fd07a" stroke="#2f8a48" stroke-width="3"/><circle cx="78" cy="58" r="12" fill="#6fd07a" stroke="#2f8a48" stroke-width="3"/><circle cx="112" cy="58" r="12" fill="#6fd07a" stroke="#2f8a48" stroke-width="3"/><circle cx="79" cy="58" r="6" fill="#fff"/><circle cx="113" cy="58" r="6" fill="#fff"/><circle cx="80" cy="59" r="3" fill="${INK}"/><circle cx="114" cy="59" r="3" fill="${INK}"/><path d="M78 88q17 13 34 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="72" cy="84" r="5" fill="#ff7a9c" opacity=".6"/><circle cx="118" cy="84" r="5" fill="#ff7a9c" opacity=".6"/></g><rect x="16" y="80" width="158" height="76" rx="9" fill="url(#wood)" stroke="#7c4a25" stroke-width="3"/><path d="M16 108h158" stroke="#7c4a25" stroke-width="2.5"/><path d="M50 80v76M140 80v76" stroke="url(#gold)" stroke-width="10"/><g class="lid"><path d="M16 84q0-48 79-48t79 48z" fill="#d79a5e" stroke="#7c4a25" stroke-width="3" stroke-linejoin="round"/><path d="M50 42v42M140 42v42" stroke="url(#gold)" stroke-width="10"/><path d="M30 70q10-26 50-30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".3"/></g><rect x="84" y="92" width="22" height="26" rx="5" fill="url(#gold)" stroke="#c9820a" stroke-width="2.5"/><circle cx="95" cy="103" r="3.5" fill="#7c4a25"/>`) },
      { id: 'globo', x: 1560, w: 150, h: 210, label: 'Globo', art: svg(150, 210, `${shadow(75, 56, 204)}<path d="M75 158v32" stroke="url(#gold)" stroke-width="9"/><path d="M38 202q0-14 37-14t37 14z" fill="url(#wood)" stroke="#7c4a25" stroke-width="2.5"/><path d="M20 82a60 60 0 0 0 108 34" fill="none" stroke="url(#gold)" stroke-width="7" stroke-linecap="round"/><g class="ball"><circle cx="75" cy="82" r="54" fill="#49a7ee" stroke="#1f6fb8" stroke-width="3"/><path d="M42 54q14-14 30-6 4 14-10 20-16 2-20-14zM80 86q18-6 30 6 2 18-14 24-14-6-16-30zM48 102q12 0 12 14-10 6-16-2z" fill="#6fd07a" stroke="#2f8a48" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 60q12-26 40-28" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/></g>`) },
      { id: 'coruja', x: 1760, w: 190, h: 340, label: 'Coruja dormindo', art: svg(190, 340, `<rect x="14" y="138" width="162" height="16" rx="6" fill="url(#wood)" stroke="#7c4a25" stroke-width="2.5"/><path d="M36 154l14 28M154 154l-14 28" stroke="#7c4a25" stroke-width="7" stroke-linecap="round"/><g class="owl"><path d="M48 138q-12-78 47-80 59 2 47 80z" fill="#b9814f" stroke="#7c4a25" stroke-width="3" stroke-linejoin="round"/><path d="M54 60l6 22 14-12zM136 60l-6 22-14-12z" fill="#b9814f" stroke="#7c4a25" stroke-width="3" stroke-linejoin="round"/><ellipse cx="95" cy="116" rx="27" ry="22" fill="#f6e2c2"/><path d="M82 112q4 5 8 0M100 112q4 5 8 0M90 124q4 5 8 0" fill="none" stroke="#c99a66" stroke-width="2.5" stroke-linecap="round"/><g class="shut"><path d="M66 90q10 9 20 0M104 90q10 9 20 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/></g><g class="open"><circle cx="76" cy="90" r="15" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="114" cy="90" r="15" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="77" cy="91" r="7" fill="${INK}"/><circle cx="115" cy="91" r="7" fill="${INK}"/><circle cx="80" cy="88" r="2.5" fill="#fff"/><circle cx="118" cy="88" r="2.5" fill="#fff"/></g><g fill="none" stroke="url(#gold)" stroke-width="4"><circle cx="76" cy="90" r="19"/><circle cx="114" cy="90" r="19"/><path d="M95 90h0"/></g><path d="M89 98l6 10 6-10z" fill="url(#gold)" stroke="#c9820a" stroke-width="2" stroke-linejoin="round"/><path d="M52 52l43-18 43 18-43 16z" fill="#3b2a5c" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M70 60v12q25 12 50 0v-12" fill="#3b2a5c" stroke="${INK}" stroke-width="2.5"/><path d="M132 50v24" stroke="url(#gold)" stroke-width="3"/><circle cx="132" cy="78" r="5" fill="url(#gold)"/></g><text class="zzz" x="144" y="52" font-size="28" font-weight="800" fill="#8a55e0">z</text><text class="zzz z2" x="164" y="28" font-size="20" font-weight="800" fill="#8a55e0">z</text>`) },
      { id: 'pedestal', x: 2100, w: 260, h: 350, label: 'Livro mágico', art: svg(260, 350, `${shadow(130, 90, 344)}<circle class="aura" cx="130" cy="150" r="128" fill="url(#halo)"/><path d="M100 344h60l-10-128h-40z" fill="url(#wood)" stroke="#7c4a25" stroke-width="3" stroke-linejoin="round"/><path d="M66 344q0-14 64-14t64 14z" fill="url(#wood)" stroke="#7c4a25" stroke-width="3"/><path d="M42 226h176l-16-26H58z" fill="#d79a5e" stroke="#7c4a25" stroke-width="3" stroke-linejoin="round"/><g class="tome"><rect x="64" y="100" width="132" height="98" rx="12" fill="#8a55e0" stroke="#5a30a8" stroke-width="3"/><rect x="64" y="100" width="132" height="98" rx="12" fill="url(#sheen)"/><rect x="64" y="100" width="18" height="98" rx="8" fill="#6a3fc4"/><g fill="url(#gold)" stroke="#c9820a" stroke-width="2"><path d="M178 100h6q12 0 12 12v6q-14-2-18-18zM178 198h6q12 0 12-12v-6q-14 2-18 18z"/></g><path d="M134 122l8 19 19 8-19 8-8 19-8-19-19-8 19-8z" fill="url(#gold)" stroke="#c9820a" stroke-width="2.5" stroke-linejoin="round"/><rect class="lock" x="176" y="136" width="28" height="26" rx="6" fill="url(#gold)" stroke="#c9820a" stroke-width="2.5"/></g>${motes(8, 260, 220, 91)}`) },
    ];
    return { W, back, mid, fore, spots, start: 150, name: 'A Biblioteca Misteriosa' };
  }

  /* ====================== FASE 2 — O JARDIM DAS PALAVRAS ====================== */
  const FLOWER_COLORS = [['#ff8fb6', '#e0507a'], ['#ffd45a', '#e79a12'], ['#b79aff', '#7a4fc9'], ['#ff9d6a', '#e2703a'], ['#7fd6ff', '#2b8ae6']];
  VDE.flower = (text, i) => { const [c, d] = FLOWER_COLORS[i % 5]; return svg(96, 170, `<path d="M48 80q-6 44 0 88" fill="none" stroke="#3f9a4f" stroke-width="7" stroke-linecap="round"/><path class="leaf" d="M48 140q-28-4-32-28 28 0 32 28zM47 152q28-4 32-28-28 0-32 28z" fill="#6fcf6a" stroke="#3f9a4f" stroke-width="2.5"/><g class="petals" fill="${c}" stroke="${d}" stroke-width="3"><circle cx="48" cy="16" r="18"/><circle cx="19" cy="37" r="18"/><circle cx="77" cy="37" r="18"/><circle cx="30" cy="71" r="18"/><circle cx="66" cy="71" r="18"/></g><circle cx="48" cy="46" r="25" fill="#fff8e1" stroke="${d}" stroke-width="3"/><text x="48" y="${text.length > 1 ? 55 : 58}" text-anchor="middle" font-size="${text.length > 1 ? 24 : 32}" font-weight="800" fill="${INK}">${text}</text><path class="smile" d="M40 40v5M56 40v5M38 52q10 9 20 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`, 'flower-art'); };

  function garden() {
    const W = 2400;
    const cloud = (x, y, s) => `<g class="cloud" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="66" ry="22" fill="#fff"/><ellipse cx="-30" cy="-10" rx="32" ry="24" fill="#fff"/><ellipse cx="22" cy="-18" rx="40" ry="30" fill="#fff"/><ellipse cx="0" cy="12" rx="60" ry="12" fill="#cfeaff" opacity=".7"/></g>`;
    const pine = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="-10" width="10" height="24" fill="#8a5a36"/><circle cx="0" cy="-36" r="34" fill="#5fbf62"/><circle cx="-18" cy="-22" r="22" fill="#52b058"/><circle cx="18" cy="-22" r="22" fill="#6fcf6a"/></g>`;
    const back = svg(W, H, `
      <defs><linearGradient id="l2s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fc8ff"/><stop offset=".7" stop-color="#d4f3ff"/><stop offset="1" stop-color="#fff3cf"/></linearGradient>
      <linearGradient id="l2h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6ec9a"/><stop offset="1" stop-color="#8fd97c"/></linearGradient>
      <linearGradient id="l2h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93dd7c"/><stop offset="1" stop-color="#6cc762"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#l2s)"/>
      <g class="sun" transform="translate(520 360)"><circle r="150" fill="url(#halo)"/><g class="rays" stroke="#ffd23f" stroke-width="10" stroke-linecap="round">${[...Array(12)].map((_, i) => `<path d="M0 -80v-${i % 2 ? 22 : 34}" transform="rotate(${i * 30})"/>`).join('')}</g><circle r="62" fill="url(#gold)" stroke="#f39c12" stroke-width="5"/><ellipse cx="-30" cy="14" rx="12" ry="8" fill="#ff8a5c" opacity=".5"/><ellipse cx="30" cy="14" rx="12" ry="8" fill="#ff8a5c" opacity=".5"/><path d="M-20 -8v10M20 -8v10M-22 20q22 20 44 0" stroke="#a85c00" stroke-width="6" stroke-linecap="round" fill="none"/></g>
      ${cloud(240, 110, 1)}${cloud(900, 70, 1.3)}${cloud(1500, 130, 0.9)}${cloud(2100, 80, 1.2)}
      <path d="M0 ${GROUND}V370q200-90 420-20t460-30 440 40 480-50 600 30V${GROUND}z" fill="url(#l2h1)"/>
      ${pine(300, 356, 1)}${pine(380, 372, 0.7)}${pine(1190, 362, 0.9)}${pine(1700, 346, 1.1)}${pine(1780, 362, 0.7)}${pine(2250, 372, 0.9)}
      <path d="M0 ${GROUND}V430q260-60 520-10t520-30 560 30 800-10V${GROUND}z" fill="url(#l2h2)"/>`);
    const tree = `<g transform="translate(2070 ${GROUND})">${shadow(0, 150, 4)}<path d="M-30 0q12-120 4-240h56q-8 120 6 240z" fill="url(#wood)" stroke="#7c4a25" stroke-width="3" stroke-linejoin="round"/><path d="M-10 -40q6-60 0-120" fill="none" stroke="#7c4a25" stroke-width="3" stroke-linecap="round" opacity=".5"/><path d="M26 -166q70-10 122-40" fill="none" stroke="#a8683a" stroke-width="22" stroke-linecap="round"/><g stroke="#3f9a4f" stroke-width="3"><circle cx="-76" cy="-286" r="84" fill="#57b85c"/><circle cx="64" cy="-318" r="100" fill="#63c566"/><circle cx="-10" cy="-382" r="88" fill="#74d172"/><circle cx="156" cy="-256" r="62" fill="#57b85c"/></g><g fill="#ff5a4d" stroke="#c0332a" stroke-width="2">${[[-90, -300], [-20, -350], [70, -290], [120, -350], [30, -410], [160, -250]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="9"/>`).join('')}</g>
      <g class="cat" transform="translate(98 -220)"><path class="tail" d="M40 6q34 6 30 40" fill="none" stroke="#ff9f43" stroke-width="12" stroke-linecap="round"/><ellipse cx="6" cy="8" rx="44" ry="20" fill="#ff9f43" stroke="${INK}" stroke-width="3"/><path d="M-50 -2l-4-22 16 10q8-3 16 0l16-10-4 22q4 8 0 18-22 12-40 0-4-10 0-18z" fill="#ff9f43" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M-38 6q5 5 10 0M-20 6q5 5 10 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g></g>`;
    const fence = [...Array(12)].map((_, i) => `<g transform="translate(${i * 208 + 30} ${GROUND + 2})"><path d="M-10 -34h190M-10 -14h190" stroke="#fff3d6" stroke-width="8"/>${[0, 40, 80, 120, 160].map((x) => `<path d="M${x - 7} 0v-50l7-10 7 10v50z" fill="#fffaf0" stroke="#d9c595" stroke-width="2"/>`).join('')}</g>`).join('');
    const shroom = (x, s) => `<g transform="translate(${x} ${GROUND + 2}) scale(${s})"><path d="M-7 0q-2-16 0-22h14q2 6 0 22z" fill="#fff3d6" stroke="#d9c595" stroke-width="2"/><path d="M-24 -20q0-26 24-26t24 26z" fill="#f4517f" stroke="#a82552" stroke-width="2.5"/><circle cx="-8" cy="-32" r="4" fill="#fff"/><circle cx="9" cy="-28" r="3" fill="#fff"/></g>`;
    const fly = (x, y, c, d) => `<g class="bfly" style="animation-delay:${d}s" transform="translate(${x} ${y})"><g class="wing"><path d="M0 0q-22-22-24 0 4 18 24 0z" fill="${c}"/><path d="M0 0q22-22 24 0-4 18-24 0z" fill="${c}"/></g><path d="M0 -6v12" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;
    const mid = svg(W, H, `
      <defs><linearGradient id="l2g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fcf62"/><stop offset="1" stop-color="#43a04e"/></linearGradient></defs>
      ${fence}${tree}
      <g class="bigflower" transform="translate(1530 ${GROUND})"><path d="M0 0v-250" stroke="#3f9a4f" stroke-width="12" stroke-linecap="round"/><path d="M0 -90q-60-10-70-56 60 0 70 56zM0 -130q60-10 70-56-60 0-70 56z" fill="#6fcf6a" stroke="#3f9a4f" stroke-width="3"/><g class="bf-head" transform="translate(0 -270)"><g fill="#ff8fb6" stroke="#e0507a" stroke-width="4">${[...Array(8)].map((_, i) => `<ellipse cx="0" cy="-64" rx="30" ry="50" transform="rotate(${i * 45})"/>`).join('')}</g><circle r="42" fill="url(#gold)" stroke="#e79a12" stroke-width="4"/><path d="M-14 -6v8M14 -6v8M-16 14q16 14 32 0" stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"/></g></g>
      <rect y="${GROUND}" width="${W}" height="100" fill="url(#l2g)"/>
      <path d="M0 ${GROUND + 2}${[...Array(40)].map(() => 'q30-18 60 0').join('')}v14H0z" fill="#6fcf62"/>
      <path d="M0 560q300-30 600 0t600 0 600 0 600 0v40H0z" fill="#f3d9a4" opacity=".55"/>
      <ellipse cx="830" cy="548" rx="130" ry="20" fill="#7fd6ff"/><ellipse cx="800" cy="544" rx="50" ry="6" fill="#fff" opacity=".6"/>
      ${shroom(140, 1)}${shroom(170, 0.6)}${shroom(1010, 0.8)}${shroom(1640, 1)}${shroom(2200, 0.7)}
      ${fly(360, 300, '#ff8fb6', 0)}${fly(980, 260, '#ffd45a', 1.2)}${fly(1480, 320, '#b79aff', 0.6)}${fly(2000, 280, '#7fd6ff', 2)}`);
    const fore = svg(W * 1.3, H, `<g fill="#3f9a4f">${[60, 900, 1700, 2500, 3000].map((x, i) => `<g transform="translate(${x} 606)"><path d="M0 0q-40-50-30-110 36 40 30 110z"/><path d="M0 0q30-70 70-90-20 60-70 90z" fill="#57b85c"/><path d="M0 0q-10-80 20-130 16 70-20 130z" fill="${i % 2 ? '#63c566' : '#4aa653'}"/></g>`).join('')}</g>`, 'fore-art');
    const sign = (icon) => svg(150, 196, `${shadow(75, 44, 190)}<rect x="67" y="96" width="16" height="96" rx="5" fill="url(#wood)" stroke="#7c4a25" stroke-width="2.5"/><rect x="6" y="6" width="138" height="108" rx="16" fill="url(#wood)" stroke="#7c4a25" stroke-width="3"/><rect x="16" y="16" width="118" height="88" rx="10" fill="#fff8e1" stroke="#d9c595" stroke-width="2"/><g transform="translate(43 28)">${ICONS[icon]}</g><circle class="done" cx="132" cy="18" r="17" fill="#4fb86a" stroke="#2f8a48" stroke-width="3"/><path class="done" d="M124 18l6 6 10-11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`);
    const tasks = [
      { id: 'sol', x: 480, icon: 'sol', before: 'O', after: 'acorda o jardim.', answer: ['S', 'O', 'L'], extra: ['A', 'U'], word: 'SOL' },
      { id: 'flor', x: 1180, icon: 'flor', before: 'A', after: 'abriu bem cedo.', answer: ['F', 'L', 'O', 'R'], extra: ['E', 'T'], word: 'FLOR' },
      { id: 'gato', x: 1880, icon: 'gato', before: 'O', after: 'dorme na árvore.', answer: ['GA', 'TO'], extra: ['PA', 'TA', 'BO'], word: 'GATO' },
    ];
    const spots = tasks.map((t) => ({ id: 'placa-' + t.id, x: t.x, w: 150, h: 196, label: 'Placa da história', art: sign(t.icon), task: t }));
    spots.push({ id: 'portao', x: 2290, w: 230, h: 340, label: 'Portão do castelo', art: svg(230, 340, `${shadow(115, 120, 336)}<path d="M16 340V136a99 99 0 0 1 198 0v204z" fill="#b9a3d6" stroke="#6a4f96" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M16 ${150 + i * 34}h28M186 ${150 + i * 34}h28" stroke="#6a4f96" stroke-width="2" opacity=".5"/>`).join('')}<path d="M40 340V140a75 75 0 0 1 150 0v200z" fill="#3b2a5c"/><circle cx="115" cy="220" r="80" fill="url(#halo)" opacity=".8"/><g class="doors"><path class="dl" d="M40 340V140a75 75 0 0 1 75-75v275z" fill="url(#wood)" stroke="#7c4a25" stroke-width="3"/><path class="dr" d="M190 340V140a75 75 0 0 0-75-75v275z" fill="url(#wood)" stroke="#7c4a25" stroke-width="3"/></g><circle cx="102" cy="210" r="7" fill="url(#gold)" stroke="#c9820a" stroke-width="2"/><circle cx="128" cy="210" r="7" fill="url(#gold)" stroke="#c9820a" stroke-width="2"/><path d="M115 18l9 20 22 2-17 14 6 21-20-11-20 11 6-21-17-14 22-2z" fill="url(#gold)" stroke="#c9820a" stroke-width="3" stroke-linejoin="round"/>`) });
    return { W, back, mid, fore, spots, tasks, start: 160, name: 'O Jardim das Palavras' };
  }

  /* ====================== FASE 3 — O CASTELO DOS LIVROS ====================== */
  function castle() {
    const W = 2000;
    const tower = (x, h, seed) => { const r = rng(seed); let o = ''; for (let y = GROUND; y > GROUND - h; y -= 28) { const c = ['#8a55e0', '#f4517f', '#2b8ae6', '#ffc23d', '#35b7c4', '#7a4fc9'][Math.floor(r() * 6)], bx = x - 66 + r() * 14, bw = 116 + r() * 18; o += `<rect x="${bx.toFixed(0)}" y="${y - 28}" width="${bw.toFixed(0)}" height="26" rx="5" fill="${c}"/><rect x="${bx.toFixed(0)}" y="${y - 28}" width="${bw.toFixed(0)}" height="26" rx="5" fill="url(#sheen)"/><rect x="${(bx + 8).toFixed(0)}" y="${y - 21}" width="${(bw - 16).toFixed(0)}" height="4" rx="2" fill="#fff6d8" opacity=".5"/>`; } const t = GROUND - h; return `<g opacity=".78">${o}<rect x="${x - 16}" y="${t + 50}" width="32" height="46" rx="16" fill="#ffe27a"/><path d="M${x - 78} ${t}l78-100 78 100z" fill="#f4517f" stroke="#a82552" stroke-width="3" stroke-linejoin="round"/><path d="M${x - 40} ${t - 8}l40-52" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".3"/><path d="M${x} ${t - 100}v-44" stroke="#7c4a25" stroke-width="4"/><path class="flag" d="M${x} ${t - 144}l40 14-40 14z" fill="url(#gold)" stroke="#c9820a" stroke-width="2" stroke-linejoin="round"/></g>`; };
    const back = svg(W, H, `
      <defs><linearGradient id="l3s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a7a"/><stop offset=".6" stop-color="#8a55b8"/><stop offset="1" stop-color="#ffb07a"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#l3s)"/>${motes(70, W, 330, 9)}
      <circle cx="1500" cy="120" r="150" fill="url(#halo)"/><circle cx="1500" cy="120" r="50" fill="#fff6c9"/>
      <path d="M0 ${GROUND}V420q200-50 420-10t500-20 500 30 580-20V${GROUND}z" fill="#5a3a8c" opacity=".6"/>
      ${tower(170, 300, 1)}${tower(640, 380, 2)}${tower(1110, 270, 3)}${tower(1650, 400, 4)}`);
    const column = (x) => `<g transform="translate(${x} 0)"><rect x="-26" y="60" width="52" height="${GROUND - 60}" fill="#b9a3d6"/><rect x="-26" y="60" width="52" height="${GROUND - 60}" fill="url(#sheen)"/><rect x="-38" y="40" width="76" height="26" rx="6" fill="#d6c6ec" stroke="#6a4f96" stroke-width="2.5"/><rect x="-38" y="${GROUND - 24}" width="76" height="24" rx="6" fill="#d6c6ec" stroke="#6a4f96" stroke-width="2.5"/></g>`;
    const torch = (x) => `<g transform="translate(${x} 250)"><circle cx="0" cy="-20" r="110" fill="url(#halo)" class="glow"/><path d="M-9 0h18l-5 50h-8z" fill="url(#wood)" stroke="#7c4a25" stroke-width="2.5"/><path d="M-14 -4h28v10h-28z" fill="url(#gold)" stroke="#c9820a" stroke-width="2"/><path class="flame" d="M0 -50q22 24 11 44-11 10-22 0-11-20 11-44z" fill="#ffc23d" stroke="#ff7a3c" stroke-width="4"/></g>`;
    const banner = (x, c, d) => `<g class="banner" transform="translate(${x} 34)"><path d="M-34 0h68v130l-34-26-34 26z" fill="${c}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/><path d="M0 34l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="url(#gold)"/></g>`;
    const mid = svg(W, H, `
      <defs><linearGradient id="l3f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cdb7e6"/><stop offset="1" stop-color="#8f74b8"/></linearGradient>
      <linearGradient id="l3c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4517f"/><stop offset="1" stop-color="#c22f63"/></linearGradient></defs>
      <rect width="${W}" height="${GROUND}" fill="#4a2e7a" opacity=".5"/>
      ${[240, 700, 1280].map((x) => `<path d="M${x} ${GROUND}V240a110 110 0 0 1 220 0v260z" fill="#2c1f5c" opacity=".55"/>`).join('')}
      ${column(120)}${column(590)}${column(1040)}${column(1560)}
      ${banner(350, '#2b8ae6', '#1663c7')}${banner(810, '#f4517f', '#a82552')}${banner(1390, '#8a55e0', '#5a30a8')}
      ${torch(200)}${torch(660)}${torch(1220)}${torch(1480)}
      <rect y="${GROUND}" width="${W}" height="100" fill="url(#l3f)"/>
      ${[...Array(21)].map((_, i) => `<rect x="${i * 100}" y="${GROUND}" width="50" height="50" fill="#fff" opacity=".1"/><rect x="${i * 100 + 50}" y="${GROUND + 50}" width="50" height="50" fill="#fff" opacity=".1"/>`).join('')}
      <rect y="${GROUND}" width="${W}" height="6" fill="#efe4fb"/>
      <path d="M0 536h${W}v40H0z" fill="url(#l3c)"/><path d="M0 540h${W}M0 572h${W}" stroke="url(#gold)" stroke-width="4"/>
      ${[[1150, 0], [1262, 26]].map(([x, d]) => `<g transform="translate(${x} ${GROUND})">${shadow(0, 66, 2)}<rect x="-58" y="-${28 + d}" width="116" height="${28 + d}" rx="5" fill="#2b8ae6" stroke="#1663c7" stroke-width="2.5"/><rect x="-58" y="-${28 + d}" width="116" height="${28 + d}" rx="5" fill="url(#sheen)"/><rect x="-48" y="-${52 + d}" width="96" height="24" rx="5" fill="#ffc23d" stroke="#c9820a" stroke-width="2.5"/></g>`).join('')}`);
    const fore = svg(W * 1.3, H, `<g transform="translate(110 600)"><rect x="-130" y="-46" width="260" height="56" rx="8" fill="#f4517f"/><rect x="-130" y="-46" width="260" height="56" rx="8" fill="url(#sheen)"/><rect x="-104" y="-90" width="210" height="46" rx="8" fill="#ffc23d"/></g><g transform="translate(2380 600)"><rect x="-140" y="-50" width="280" height="60" rx="8" fill="#2b8ae6"/><rect x="-110" y="-96" width="220" height="48" rx="8" fill="#8a55e0"/><rect x="-110" y="-96" width="220" height="48" rx="8" fill="url(#sheen)"/></g>`, 'fore-art');
    const mb = (x, c, d) => `<rect x="${x}" y="134" width="26" height="56" rx="5" fill="${c}" stroke="${d}" stroke-width="2.5"/><rect x="${x + 4}" y="142" width="18" height="4" rx="2" fill="#fff" opacity=".6"/>`;
    const lilac = { pal: ['#8a55e0', '#7a4fc9', '#b79aff', '#6a3fc4', '#f4517f'], inside: '#3b2a5c' };
    const spots = [
      { id: 'padrao', x: 440, w: 260, h: 330, label: 'Estante do padrão', art: svg(260, 330, `${shadow(130, 140, 326)}${shelf(12, 14, 236, 316, 3, 71, lilac)}<rect x="32" y="116" width="196" height="92" rx="14" fill="url(#wood)" stroke="#7c4a25" stroke-width="3"/><rect x="42" y="126" width="176" height="72" rx="8" fill="#fff8e1"/><g class="mini">${mb(52, '#2b8ae6', '#1663c7')}${mb(86, '#f4517f', '#a82552')}${mb(120, '#2b8ae6', '#1663c7')}${mb(154, '#f4517f', '#a82552')}<text x="201" y="178" text-anchor="middle" font-size="42" font-weight="800" fill="#c22f63">?</text></g><circle class="gem g1" cx="130" cy="50" r="21" fill="#7a6a9c" stroke="#4a3a6c" stroke-width="3"/>`) },
      { id: 'ordem', x: 900, w: 250, h: 310, label: 'Torre de livros bagunçada', art: svg(250, 310, `${shadow(125, 120, 304)}<g class="mess"><rect x="30" y="260" width="156" height="40" rx="7" fill="#f4517f" stroke="#a82552" stroke-width="3" transform="rotate(-4 108 280)"/><rect x="74" y="222" width="74" height="36" rx="7" fill="#ffc23d" stroke="#c9820a" stroke-width="3" transform="rotate(7 110 240)"/><rect x="40" y="178" width="178" height="42" rx="7" fill="#2b8ae6" stroke="#1663c7" stroke-width="3" transform="rotate(-6 130 199)"/><rect x="88" y="142" width="104" height="34" rx="7" fill="#8a55e0" stroke="#5a30a8" stroke-width="3" transform="rotate(9 140 159)"/></g><g class="tidy"><rect x="36" y="258" width="178" height="42" rx="7" fill="#2b8ae6" stroke="#1663c7" stroke-width="3"/><rect x="47" y="218" width="156" height="40" rx="7" fill="#f4517f" stroke="#a82552" stroke-width="3"/><rect x="73" y="182" width="104" height="36" rx="7" fill="#8a55e0" stroke="#5a30a8" stroke-width="3"/><rect x="88" y="148" width="74" height="34" rx="7" fill="#ffc23d" stroke="#c9820a" stroke-width="3"/><rect x="36" y="258" width="178" height="42" rx="7" fill="url(#sheen)"/></g><circle class="gem g2" cx="125" cy="96" r="21" fill="#7a6a9c" stroke="#4a3a6c" stroke-width="3"/>`) },
      { id: 'porta', x: 1780, w: 320, h: 430, label: 'O último livro mágico', art: svg(320, 430, `<circle class="aura" cx="160" cy="220" r="170" fill="url(#halo)"/><path d="M30 430V176a130 130 0 0 1 260 0v254z" fill="#d6c6ec" stroke="#6a4f96" stroke-width="4"/><path d="M52 430V178a108 108 0 0 1 216 0v252z" fill="#2c1f5c" stroke="url(#gold)" stroke-width="7"/><circle cx="160" cy="250" r="100" fill="url(#halo)" opacity=".7"/><g class="tome"><rect x="92" y="176" width="136" height="176" rx="15" fill="#f4517f" stroke="#a82552" stroke-width="3.5"/><rect x="92" y="176" width="136" height="176" rx="15" fill="url(#sheen)"/><rect x="92" y="176" width="22" height="176" rx="9" fill="#c22f63"/><g fill="url(#gold)" stroke="#c9820a" stroke-width="2"><path d="M206 176h8q14 0 14 14v8q-18-2-22-22zM206 352h8q14 0 14-14v-8q-18 2-22 22z"/></g><path d="M166 222l10 24 24 10-24 10-10 24-10-24-24-10 24-10z" fill="url(#gold)" stroke="#c9820a" stroke-width="3" stroke-linejoin="round"/><path d="M134 314h64" stroke="url(#gold)" stroke-width="6" stroke-linecap="round"/></g><circle class="gem g1" cx="108" cy="118" r="17" fill="#7a6a9c" stroke="#4a3a6c" stroke-width="3"/><circle class="gem g2" cx="160" cy="92" r="17" fill="#7a6a9c" stroke="#4a3a6c" stroke-width="3"/><circle class="gem g3" cx="212" cy="118" r="17" fill="#7a6a9c" stroke="#4a3a6c" stroke-width="3"/>`) },
    ];
    return { W, back, mid, fore, spots, start: 150, name: 'O Castelo dos Livros' };
  }

  VDE.scenes = [library, garden, castle];
  VDE.GROUND = GROUND;
})();
