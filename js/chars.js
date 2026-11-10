/* Lilo e Lila — os livros vivos. Desenho vetorial original, animado por CSS. */
window.VDE = window.VDE || {};

VDE.char = function (kind) {
  const L = kind === 'lilo';
  const p = L
    ? { c: '#1fbfb8', cd: '#12918c', cl: '#6fe3dc', limb: '#0e6f6b', rib: '#ff6f61', ribd: '#d9483c', shoe: '#ffc93c', shoed: '#e09a12', x: 46, w: 108, y: 44, h: 132 }
    : { c: '#ff7a6b', cd: '#dd4f42', cl: '#ffb1a6', limb: '#b63e33', rib: '#1fbfb8', ribd: '#12918c', shoe: '#7a5ae0', shoed: '#5637b8', x: 52, w: 96, y: 30, h: 148 };
  const { x, w, y, h } = p, r = x + w, b = y + h, ex1 = x + w * 0.4, ex2 = x + w * 0.76, ey = y + h * 0.4;
  const shoe = (fx) => L
    ? `<path d="M${fx - 11} 214q0-9 10-9h7q5 0 9 5 10 2 10 10v5h-36z" fill="${p.shoe}" stroke="${p.shoed}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${fx - 11} 222h36v3h-36z" fill="#fff"/><path d="M${fx + 2} 208l5 4" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`
    : `<path d="M${fx - 9} 200h15v8q8 2 13 6 5 4 5 11h-33z" fill="${p.shoe}" stroke="${p.shoed}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${fx - 10} 198h17v6h-17z" rx="2" fill="#fff4dc"/>`;
  const ribbon = L
    ? `<g class="ch-rib"><path d="M108 ${y + 4}c2-22 16-34 34-32l-7 9 10 5c-12 0-20 6-23 18z" fill="${p.rib}" stroke="${p.ribd}" stroke-width="2.5" stroke-linejoin="round"/></g>`
    : `<g class="ch-rib"><path d="M84 ${y + 3}c-8-12-22-16-34-12 8 4 10 10 8 18l10-5 4 10c3-6 7-9 12-11z" fill="${p.rib}" stroke="${p.ribd}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="85" cy="${y + 1}" r="6.5" fill="${p.rib}" stroke="${p.ribd}" stroke-width="2.5"/></g>`;
  const emblem = L
    ? `<path transform="translate(${r - 19} ${b - 19}) scale(.82)" d="M0-11l3.2 7 7.6.8-5.7 5.1 1.7 7.500L0 6.500l-6.8 3.9 1.7-7.5-5.7-5.1 7.6-.8z" fill="#ffd66b" stroke="#e0a21a" stroke-width="2" stroke-linejoin="round"/>`
    : `<path transform="translate(${r - 20} ${b - 20}) scale(.85)" d="M4-11a11 11 0 1 0 6 19A9 9 0 0 1 4-11z" fill="#ffd66b" stroke="#e0a21a" stroke-width="2" stroke-linejoin="round"/>`;
  const eye = (cx) => `<g class="ch-eye" style="transform-origin:${cx}px ${ey}px"><ellipse cx="${cx}" cy="${ey}" rx="${L ? 15 : 13.5}" ry="${L ? 18 : 16}" fill="#fff" stroke="#23233f" stroke-width="2.5"/><g class="ch-pupil"><circle cx="${cx + 3}" cy="${ey + 2}" r="${L ? 8 : 7.5}" fill="#23233f"/><circle cx="${cx + 6}" cy="${ey - 2}" r="3" fill="#fff"/></g></g>`;
  const glasses = L ? '' : `<g fill="none" stroke="#3b2a6b" stroke-width="4"><circle cx="${ex1}" cy="${ey}" r="19"/><circle cx="${ex2}" cy="${ey}" r="19"/><path d="M${ex1 + 19} ${ey}h${ex2 - ex1 - 38}M${ex1 - 19} ${ey - 3}l-7-4" stroke-linecap="round"/></g>`;
  const lashes = L ? '' : `<path d="M${ex1 - 12} ${ey - 19}l-4-6M${ex2 + 12} ${ey - 19}l4-6" stroke="#23233f" stroke-width="3" stroke-linecap="round"/>`;
  const mx = (ex1 + ex2) / 2, my = ey + (L ? 34 : 33);
  return `<svg class="ch ch-${kind}" viewBox="0 0 200 240" aria-hidden="true">
  <ellipse class="ch-shadow" cx="100" cy="230" rx="50" ry="7"/>
  <g class="ch-all">
    <g class="ch-leg ch-leg-b" style="transform-origin:118px ${b - 6}px"><path d="M118 ${b - 8}v${214 - b}" stroke="${p.limb}" stroke-width="9" stroke-linecap="round" fill="none"/>${shoe(118)}</g>
    <g class="ch-leg ch-leg-f" style="transform-origin:82px ${b - 6}px"><path d="M82 ${b - 8}v${214 - b}" stroke="${p.limb}" stroke-width="9" stroke-linecap="round" fill="none"/>${shoe(82)}</g>
    <g class="ch-body" style="transform-origin:100px ${b}px">
      <g class="ch-arm ch-arm-b" style="transform-origin:${r - 3}px ${y + h * 0.56}px"><path d="M${r - 3} ${y + h * 0.56}q20 12 20 36" stroke="${p.limb}" stroke-width="8.5" stroke-linecap="round" fill="none"/><circle cx="${r + 17}" cy="${y + h * 0.56 + 38}" r="9.5" fill="#fff4dc" stroke="#23233f" stroke-width="2.5"/></g>
      ${ribbon}
      <rect x="${x + 9}" y="${y + 7}" width="${w}" height="${h}" rx="12" fill="${p.cd}"/>
      <rect x="${x + 5}" y="${y + 4}" width="${w}" height="${h - 1}" rx="9" fill="#fff4dc" stroke="#e3cfa3" stroke-width="2"/>
      <path d="M${r + 1.5} ${y + 14}v${h - 22}M${r - 2} ${y + 12}v${h - 18}" stroke="#e3cfa3" stroke-width="1.5"/>
      <rect class="ch-cover" x="${x}" y="${y}" width="${w}" height="${h}" rx="13" fill="${p.c}" stroke="#23233f" stroke-width="3"/>
      <path d="M${x + 1.5} ${y + 12}q0-10.5 10.5-10.500h4v${h - 3}h-4q-10.5 0-10.5-10.500z" fill="${p.cd}"/>
      <path d="M${x + 16} ${y + 26}h0M${x + 16} ${b - 26}h0" stroke="#ffd66b" stroke-width="0"/>
      <rect x="${x + 4}" y="${y + 18}" width="9" height="5" rx="2.5" fill="#ffd66b"/><rect x="${x + 4}" y="${b - 24}" width="9" height="5" rx="2.5" fill="#ffd66b"/>
      <path d="M${x + 24} ${y + 10}h${w * 0.42}q8 0 8 5t-8 5h-${w * 0.42 - 8}q-8 0-8-5z" fill="${p.cl}" opacity=".55"/>
      ${emblem}
      <g class="ch-face">
        <g class="ch-brows" stroke="#23233f" stroke-width="4" stroke-linecap="round" fill="none"><path class="ch-brow-l" d="M${ex1 - 12} ${ey - 27}q11-7 22-1" style="transform-origin:${ex1}px ${ey - 27}px"/><path class="ch-brow-r" d="M${ex2 - 10} ${ey - 28}q11-6 22 1" style="transform-origin:${ex2}px ${ey - 27}px"/></g>
        ${eye(ex1)}${eye(ex2)}${glasses}${lashes}
        <ellipse cx="${ex1 - 17}" cy="${ey + 24}" rx="9" ry="6" fill="${L ? '#ffa3b5' : '#ff4f7b'}" opacity="${L ? .8 : .4}"/><ellipse cx="${ex2 + 15}" cy="${ey + 24}" rx="9" ry="6" fill="${L ? '#ffa3b5' : '#ff4f7b'}" opacity="${L ? .8 : .4}"/>
        <g class="ch-mouth" style="transform-origin:${mx}px ${my}px">
          <g class="m m-smile"><path d="M${mx - 17} ${my - 4}q17 ${L ? 26 : 20} 34 0z" fill="#3a1830" stroke="#23233f" stroke-width="2.5" stroke-linejoin="round"/><path d="M${mx - 8} ${my + 6}q8-6 16 0-8 6-16 0z" fill="#ff6f8f"/></g>
          <g class="m m-grin"><path d="M${mx - 22} ${my - 7}q22 34 44 0z" fill="#3a1830" stroke="#23233f" stroke-width="2.5" stroke-linejoin="round"/><path d="M${mx - 19} ${my - 6}h38l-3 5h-32z" fill="#fff"/><path d="M${mx - 9} ${my + 9}q9-7 18 0-9 6-18 0z" fill="#ff6f8f"/></g>
          <g class="m m-wow"><ellipse cx="${mx}" cy="${my + 3}" rx="9" ry="12" fill="#3a1830" stroke="#23233f" stroke-width="2.5"/></g>
          <g class="m m-oops"><path d="M${mx - 15} ${my + 4}q5-8 10 0t10 0 10 0" fill="none" stroke="#23233f" stroke-width="4" stroke-linecap="round"/></g>
        </g>
      </g>
      <g class="ch-arm ch-arm-f" style="transform-origin:${x + 4}px ${y + h * 0.56}px"><path d="M${x + 4} ${y + h * 0.56}q-20 12-20 36" stroke="${p.limb}" stroke-width="8.5" stroke-linecap="round" fill="none"/><circle cx="${x - 16}" cy="${y + h * 0.56 + 38}" r="9.5" fill="#fff4dc" stroke="#23233f" stroke-width="2.5"/></g>
    </g>
  </g>
</svg>`;
};
