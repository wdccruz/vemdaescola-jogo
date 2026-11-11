/* Lilo e Lila — os livros vivos. Desenho vetorial original, com volume e animado por CSS. */
window.VDE = window.VDE || {};

VDE.char = function (kind) {
  const L = kind === 'lilo';
  const p = L
    ? { a: '#62c0ff', b: '#2b8ae6', c: '#1663c7', line: '#0e3f8a', pack: '#ffcf3d', packd: '#e79a12', shoe: '#3b3fa8', shoed: '#23266f', x: 62, w: 120, y: 44, h: 146 }
    : { a: '#ff93b0', b: '#f4517f', c: '#d42c63', line: '#9c1b4a', pack: '#9a6bf0', packd: '#6a3fc4', shoe: '#8a55e0', shoed: '#5a30a8', x: 68, w: 108, y: 36, h: 156 };
  const { x, w, y, h } = p, r = x + w, b = y + h, id = 'c' + kind;
  const ex1 = x + w * (L ? 0.34 : 0.3), ex2 = x + w * (L ? 0.73 : 0.75), ey = y + h * 0.4, mx = (ex1 + ex2) / 2, my = ey + h * 0.27;
  const ink = '#2b2140';

  const shoe = (fx) => `<g><path d="M${fx - 15} 218q-2-12 10-13h10q8 0 13 7 14 2 16 12 1 8-6 10h-40q-6-1-5-8z" fill="${p.shoe}" stroke="${p.shoed}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${fx + 14} 213q13 3 14 12 0 7-6 9h-12q8-8 4-21z" fill="#fff"/><path d="M${fx - 17} 228q0 7 6 7h40q7-1 6-8z" fill="#fff" stroke="#c9cfe0" stroke-width="2" stroke-linejoin="round"/><path d="M${fx - 2} 211l8 5M${fx + 3} 208l8 5" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>`;
  const glove = (hx, hy, flip) => `<g transform="translate(${hx} ${hy})${flip ? ' scale(-1 1)' : ''}"><rect x="-9" y="-19" width="18" height="11" rx="5" fill="#fff" stroke="#b8c0d6" stroke-width="2"/><circle r="13" fill="#fff" stroke="#b8c0d6" stroke-width="2.5"/><ellipse cx="-11" cy="-5" rx="6" ry="8" transform="rotate(-30 -11 -5)" fill="#fff" stroke="#b8c0d6" stroke-width="2.5"/><path d="M-3 4q4 4 8 0" fill="none" stroke="#c9cfe0" stroke-width="2" stroke-linecap="round"/></g>`;
  const eye = (cx, R) => `<g class="ch-eye" style="transform-origin:${cx}px ${ey}px"><ellipse cx="${cx}" cy="${ey}" rx="${R}" ry="${R + 4}" fill="url(#${id}e)" stroke="${ink}" stroke-width="2.5"/><g class="ch-pupil"><circle cx="${cx + 3}" cy="${ey + 3}" r="${R * 0.62}" fill="url(#${id}i)"/><circle cx="${cx + 3}" cy="${ey + 3}" r="${R * 0.34}" fill="#15101f"/><circle cx="${cx + 8}" cy="${ey - 4}" r="${R * 0.24}" fill="#fff"/><circle cx="${cx - 2}" cy="${ey + 9}" r="${R * 0.12}" fill="#fff" opacity=".9"/></g></g>`;
  const R = L ? 20 : 17;
  const mouthIn = `fill="url(#${id}m)" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"`;
  const emblem = L
    ? `<path transform="translate(${r - 19} ${b - 21}) scale(.62)" d="M0-15l4.4 9.5 10.4 1.2-7.7 7 2.2 10.300L0 7.800l-9.3 5.2 2.2-10.3-7.7-7 10.4-1.200z" fill="url(#${id}g)" stroke="#c9820a" stroke-width="2.5" stroke-linejoin="round"/>`
    : `<path transform="translate(${r - 19} ${b - 22}) scale(.68)" d="M0 14C-18 2-16-13-6-13c4 0 6 3 6 5 0-2 2-5 6-5 10 0 12 15-6 27z" fill="url(#${id}g)" stroke="#c9820a" stroke-width="2.5" stroke-linejoin="round"/>`;
  const top = L
    ? `<g class="ch-rib"><path d="M${x + 40} ${y + 6}c0-20 12-32 30-32l-6 10 9 6c-12 0-18 6-19 18z" fill="#ff5a4d" stroke="#c0332a" stroke-width="2.5" stroke-linejoin="round"/></g>`
    : `<g class="ch-rib" style="transform-origin:${r - 22}px ${y - 4}px" transform="translate(-2 -7)"><path d="M${r - 20} ${y + 2}c-10-16-28-20-34-10s6 20 34 10zM${r - 20} ${y + 2}c10-16 28-20 34-10s-6 20-34 10z" fill="url(#${id}g)" stroke="#c9820a" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="${r - 20}" cy="${y + 2}" rx="8" ry="9" fill="#ffe06a" stroke="#c9820a" stroke-width="2.5"/></g>`;
  const glasses = L ? '' : `<g fill="none" stroke="#7a3fd0" stroke-width="5.5"><circle cx="${ex1}" cy="${ey}" r="${R + 6}"/><circle cx="${ex2}" cy="${ey}" r="${R + 6}"/><path d="M${ex1 + R + 6} ${ey - 2}q${(ex2 - ex1) / 2 - R - 6}-6 ${ex2 - ex1 - 2 * R - 12} 0M${ex1 - R - 6} ${ey - 4}l-7-5" stroke-linecap="round"/></g><path d="M${ex1 - 14} ${ey - 20}a${R + 8} ${R + 8} 0 0 1 12-5" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`;

  return `<svg class="ch ch-${kind}" viewBox="0 0 230 250" aria-hidden="true">
  <defs>
    <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.a}"/><stop offset=".55" stop-color="${p.b}"/><stop offset="1" stop-color="${p.c}"/></linearGradient>
    <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe773"/><stop offset="1" stop-color="#f7a81d"/></linearGradient>
    <linearGradient id="${id}p" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9d6ae"/><stop offset="1" stop-color="#fff8e6"/></linearGradient>
    <linearGradient id="${id}k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.pack}"/><stop offset="1" stop-color="${p.packd}"/></linearGradient>
    <linearGradient id="${id}e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe6f5"/><stop offset=".35" stop-color="#fff"/></linearGradient>
    <radialGradient id="${id}i" cx=".4" cy=".35"><stop offset="0" stop-color="${L ? '#6b5a8c' : '#8a5aa8'}"/><stop offset="1" stop-color="#2b2140"/></radialGradient>
    <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a1230"/><stop offset="1" stop-color="#8f1f45"/></linearGradient>
    <radialGradient id="${id}s"><stop offset="0" stop-color="#1c1030" stop-opacity=".38"/><stop offset="1" stop-color="#1c1030" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}b"><stop offset="0" stop-color="#ff5d8f" stop-opacity=".65"/><stop offset="1" stop-color="#ff5d8f" stop-opacity="0"/></radialGradient>
    <clipPath id="${id}cl"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="15"/></clipPath>
  </defs>
  <ellipse class="ch-shadow" cx="118" cy="238" rx="64" ry="9" fill="url(#${id}s)"/>
  <g class="ch-all">
    <g class="ch-leg ch-leg-b" style="transform-origin:${x + w * 0.68}px ${b - 6}px"><path d="M${x + w * 0.68} ${b - 8}V214" stroke="${p.c}" stroke-width="13" stroke-linecap="round" fill="none"/>${shoe(x + w * 0.68)}</g>
    <g class="ch-leg ch-leg-f" style="transform-origin:${x + w * 0.3}px ${b - 6}px"><path d="M${x + w * 0.3} ${b - 8}V214" stroke="${p.c}" stroke-width="13" stroke-linecap="round" fill="none"/>${shoe(x + w * 0.3)}</g>
    <g class="ch-body" style="transform-origin:118px ${b}px">
      <g class="ch-arm ch-arm-b" style="transform-origin:${r - 4}px ${y + h * 0.56}px"><path d="M${r - 4} ${y + h * 0.56}q22 12 24 36" stroke="${p.c}" stroke-width="13" stroke-linecap="round" fill="none"/>${glove(r + 21, y + h * 0.56 + 42, true)}</g>
      <rect x="${r - 16}" y="${y + h * 0.3}" width="38" height="${h * 0.56}" rx="14" fill="url(#${id}k)" stroke="${p.packd}" stroke-width="2.5"/>
      <rect x="${r + 2}" y="${y + h * 0.5}" width="16" height="${h * 0.2}" rx="5" fill="${p.packd}" opacity=".55"/>
      ${top}
      <rect x="${x - 24}" y="${y + 9}" width="${w * 0.6}" height="${h}" rx="13" fill="${p.c}" stroke="${p.line}" stroke-width="2.5"/>
      <rect x="${x - 19}" y="${y + 5}" width="${w * 0.5}" height="${h - 3}" rx="6" fill="url(#${id}p)" stroke="#cdb684" stroke-width="2"/>
      <path d="M${x - 13} ${y + 12}v${h - 16}M${x - 7} ${y + 10}v${h - 13}M${x - 1} ${y + 9}v${h - 11}" stroke="#d9c595" stroke-width="1.5"/>
      <rect class="ch-cover" x="${x}" y="${y}" width="${w}" height="${h}" rx="15" fill="url(#${id}c)"/>
      <g clip-path="url(#${id}cl)">
        <path d="M${x} ${y + h * 0.62}q${w * 0.5} ${h * 0.2} ${w} ${-h * 0.1}V${b}H${x}z" fill="${p.c}" opacity=".35"/>
        <ellipse cx="${x + w * 0.3}" cy="${y + 10}" rx="${w * 0.42}" ry="16" fill="#fff" opacity=".28"/>
        <g fill="url(#${id}g)" stroke="#c9820a" stroke-width="2.5"><circle cx="${x}" cy="${y}" r="27"/><circle cx="${r}" cy="${y}" r="27"/><circle cx="${x}" cy="${b}" r="27"/><circle cx="${r}" cy="${b}" r="27"/></g>
        <g fill="#fff" opacity=".45"><circle cx="${x + 7}" cy="${y + 7}" r="6"/><circle cx="${r - 9}" cy="${y + 7}" r="5"/></g>
      </g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="15" fill="none" stroke="${p.line}" stroke-width="3"/>
      <path d="M${x + 8} ${y + 34}v${h - 68}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".25"/>
      ${emblem}
      <path d="M${x + 3} ${y + h * 0.26}q14 ${h * 0.2} 2 ${h * 0.5}" fill="none" stroke="url(#${id}k)" stroke-width="9" stroke-linecap="round"/>
      <g class="ch-face">
        <ellipse cx="${ex1 - R - 2}" cy="${ey + R + 12}" rx="13" ry="9" fill="url(#${id}b)"/><ellipse cx="${ex2 + R}" cy="${ey + R + 12}" rx="13" ry="9" fill="url(#${id}b)"/>
        <g class="ch-brows" stroke="${ink}" stroke-width="5.5" stroke-linecap="round" fill="none"><path class="ch-brow-l" d="M${ex1 - 15} ${ey - R - 12}q13-9 26-2" style="transform-origin:${ex1}px ${ey - R - 12}px"/><path class="ch-brow-r" d="M${ex2 - 11} ${ey - R - 14}q13-7 26 2" style="transform-origin:${ex2}px ${ey - R - 12}px"/></g>
        ${eye(ex1, R)}${eye(ex2, R)}${glasses}
        <g class="ch-mouth" style="transform-origin:${mx}px ${my}px">
          <g class="m m-smile"><path d="M${mx - 24} ${my - 6}q24 12 48 0-2 26-24 27t-24-27z" ${mouthIn}/><path d="M${mx - 21} ${my - 4}q21 10 42 0l-2 7q-19 6-38 0z" fill="#fff"/><path d="M${mx - 12} ${my + 14}q12-9 24 0-12 8-24 0z" fill="#ff7a9c"/></g>
          <g class="m m-grin"><path d="M${mx - 29} ${my - 9}q29 13 58 0-2 34-29 35t-29-35z" ${mouthIn}/><path d="M${mx - 26} ${my - 7}q26 11 52 0l-2 8q-24 7-48 0z" fill="#fff"/><path d="M${mx - 14} ${my + 18}q14-11 28 0-14 9-28 0z" fill="#ff7a9c"/></g>
          <g class="m m-wow"><ellipse cx="${mx}" cy="${my + 6}" rx="12" ry="16" ${mouthIn}/><ellipse cx="${mx}" cy="${my + 14}" rx="7" ry="5" fill="#ff7a9c"/></g>
          <g class="m m-oops"><path d="M${mx - 18} ${my + 8}q6-10 12 0t12 0 12 0" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/></g>
        </g>
      </g>
      <g class="ch-arm ch-arm-f" style="transform-origin:${x + 6}px ${y + h * 0.56}px"><path d="M${x + 6} ${y + h * 0.56}q-24 12-26 36" stroke="${p.b}" stroke-width="13" stroke-linecap="round" fill="none"/>${glove(x - 21, y + h * 0.56 + 42, false)}</g>
    </g>
  </g>
</svg>`;
};
