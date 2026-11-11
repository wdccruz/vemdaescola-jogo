'use strict';

const Art = (() => {
  const star = (x, y, r, color = '#ffe0a0', extra = '') =>
    `<path ${extra} d="M${x} ${y-r}q1 ${r-1} ${r} ${r}q${1-r} 1 ${-r} ${r}q-1 ${1-r} ${-r} ${-r}q${r-1} -1 ${r} ${-r}" fill="${color}"/>`;

  const icons = {
    book: '<path fill="#a65772" d="M8 20q14-6 25 5 11-11 25-5v30q-15-4-25 5-10-9-25-5Z"/><path fill="#ffedc8" d="M12 14q13-3 21 6 8-9 21-6v31q-12-3-21 6-9-9-21-6Z"/><path fill="none" stroke="#cb997b" stroke-width="2" d="M33 21v29M17 24q6-1 12 3m-12 4q6-1 12 3m8-7q6-4 12-3m-12 10q6-4 12-3"/>',
    leaf: '<path fill="#548770" d="M12 44C8 19 29 11 56 9c-1 26-8 48-34 46Z"/><path fill="none" stroke="#e7e2a6" stroke-width="3" stroke-linecap="round" d="M10 57 46 20M27 40l-2-14m8 8 14-2"/>',
    city: '<path fill="#edb776" d="M8 53h50v5H8zM12 31h12v21H12zM26 15h14v37H26zM42 26h12v26H42z"/><path fill="#b56d7b" d="m9 31 9-10 9 10m-4-16 10-9 10 9m-4 11 9-11 9 11"/><path stroke="#754958" stroke-width="3" d="M18 36v5m15-20v5m0 5v5m15-4v5m-15 7v8"/>',
    moon: '<path fill="#e4a84b" d="M41 8C20 5 7 20 10 39c4 22 34 27 45 7-24 4-33-22-14-38Z"/><path fill="#ffd680" d="M35 10C19 9 9 23 12 39c3 16 21 23 36 12C25 54 16 27 35 10Z"/>'+star(48,22,7,'#a87287')+star(55,31,4,'#a87287'),
    frog: '<path fill="#45775f" d="M9 44c0-9 9-14 12-14h24c6 1 13 7 13 15l-8 8H16Z"/><path fill="#79ad6a" d="M12 34c0-5 3-10 8-11-5-15 13-20 17-7 8-10 20-2 16 9 11 6 10 23-1 26-7 4-29 3-37-1-6-4-7-11-3-16Z"/><path fill="#e5e5a5" d="M17 38q16 8 36-1c3 10-7 15-17 15S15 47 17 38Z"/><path fill="#203b36" d="M23 18a3 4 0 1 0 6 0 3 4 0 1 0-6 0m21 1a3 4 0 1 0 6 0 3 4 0 1 0-6 0"/><path fill="none" stroke="#385448" stroke-width="2" stroke-linecap="round" d="M24 36q9 10 19 0"/>',
    lantern: '<path fill="none" stroke="#69517a" stroke-width="3" d="M25 16v-2a8 8 0 0 1 16 0v2"/><path fill="#69517a" d="M20 17h26l7 8-7 29 4 6H16l4-6-7-29Z"/><path fill="#ffd278" d="M19 26h28l-5 25H24Z"/><path fill="#fff0b2" d="M32 31c6 8 10 15 0 18-9-2-3-11 0-18Z"/>',
    seed: '<path fill="#b27861" d="M8 52q10-12 25-9 15-3 25 9v7H8Z"/><path fill="#6a965e" d="M32 46C16 45 13 33 12 25c12 1 19 5 21 13 4-10 12-14 22-14-2 14-10 23-23 22Z"/><path fill="none" stroke="#406950" stroke-width="3" stroke-linecap="round" d="M33 51V37"/>',
    rain: '<path fill="#8f9cbd" d="M11 32c-8-5-1-18 8-16 4-13 22-12 26 1 10-3 17 10 8 15Z"/><path fill="none" stroke="#5487a4" stroke-width="4" stroke-linecap="round" d="m20 39-4 7m16-7-5 10m17-10-4 7m-2 7-3 5"/>',
    flower: '<path stroke="#4e815e" stroke-width="4" fill="none" d="M33 28v31"/><path fill="#6b9b68" d="M33 52Q18 53 13 41q16-2 20 11m0 2q3-11 18-13-1 11-18 13"/><path fill="#d37882" d="M27 15c-6-13 17-15 13 0 13-8 19 9 5 12 12 7 0 20-9 8-7 13-22 3-12-6-14 1-13-19 3-14Z"/><circle cx="33" cy="24" r="7" fill="#ffd282"/>',
    spider: '<path fill="none" stroke="#685379" stroke-width="3" stroke-linecap="round" d="m24 29-9-5-5 7m15 4-12 1-5 8m17-4-10 7-2 8m30-26 9-5 5 7m-15 4 12 1 5 8m-17-4 10 7 2 8"/><path fill="#9879a7" d="M17 31c0-16 33-16 33 0 0 19-33 19-33 0Z"/><circle cx="28" cy="31" r="3" fill="#252b44"/><circle cx="39" cy="31" r="3" fill="#252b44"/><path d="M30 37q4 4 8 0" fill="none" stroke="#433451" stroke-width="2"/>',
    web: '<g fill="none" stroke="#786f96" stroke-width="2"><path d="M7 9l51 45M10 55 57 9M33 5v56M5 32h56"/><path d="m33 11 16 6 6 15-7 15-15 8-15-8-7-15 7-15Zm0 9 9 4 4 8-4 8-9 5-8-5-5-8 5-8Z"/></g>',
    dew: '<path fill="#74aec3" d="M32 7c8 12 18 24 18 36a18 18 0 0 1-36 0c0-12 10-24 18-36Z"/><path d="M25 35q-6 13 4 17" stroke="#dcf7e5" stroke-width="3" stroke-linecap="round" fill="none"/>'+star(50,19,6,'#d89761'),
    flag: '<path fill="none" stroke="#694858" stroke-width="4" stroke-linecap="round" d="M19 9v49"/><path fill="#c66e75" d="M21 12h33L44 23l10 12H21Z"/>'+star(34,23,6,'#ffde98'),
    lens: '<path fill="none" stroke="#a36866" stroke-width="8" stroke-linecap="round" d="m40 40 14 14"/><circle cx="28" cy="28" r="17" fill="#a9d6d5" stroke="#655576" stroke-width="5"/><path fill="none" stroke="#eff8d8" stroke-width="3" stroke-linecap="round" d="M19 30q0-8 8-10"/>',
    key: '<path fill="#d99747" stroke="#9e623a" stroke-width="2" d="M27 29a13 13 0 1 1 10 9v18h-6v-5h-6v-6h6V34Z"/><circle cx="34" cy="24" r="5" fill="#fff0cc"/>',
    gear: '<path fill="#ad819f" stroke="#6b517e" stroke-width="2" d="m27 7 12 0 2 8 7 4 8-2 6 10-6 6v7l5 6-6 10-8-2-6 4-2 6H27l-2-7-6-4-8 2-6-10 5-5v-7l-6-6 6-10 8 2 7-4Z" transform="translate(4 0) scale(.88)"/><circle cx="33" cy="32" r="9" fill="#fff1d1"/>'
  };

  const pingo = '<path fill="#4d7291" d="M24 26C5 25 1 43 9 49c5 4 11 1 17-3m21-19c16-6 22 7 17 12-3 3-8 1-13 0"/><path fill="#92bfbe" d="M13 37C14 19 27 8 36 8s21 13 21 29c0 17-9 24-22 24s-23-6-22-24Z"/><path fill="#d8e4ba" d="M17 38c7-14 29-13 36 0 5 14-6 20-17 20S12 52 17 38Z"/><path fill="#738f60" d="M35 12C21 10 17 6 17 3c10-2 19 0 21 6C42 1 49 0 55 2c-4 8-10 11-20 10Z"/><g class="blink" fill="#27354e"><ellipse cx="27" cy="34" rx="3" ry="4"/><ellipse cx="44" cy="34" rx="3" ry="4"/></g><path stroke="#805267" fill="none" stroke-linecap="round" stroke-width="2" d="M31 43q5 6 10 0"/><ellipse cx="22" cy="42" rx="4" ry="2" fill="#e19a95"/><ellipse cx="48" cy="42" rx="4" ry="2" fill="#e19a95"/>';
  const lume = '<path fill="#d59780" d="M24 27C10 11 0 20 6 33c3 6 10 9 20 9m20-15c16-17 25-5 18 7-4 6-10 8-20 8"/><path fill="#ffd77f" d="M35 6c5 14 17 19 21 31 5 14-5 23-20 23-16 0-27-12-21-25 5-11 16-17 20-29Z"/><path fill="#fff1a8" d="M35 19c5 12 12 15 13 24 1 8-5 14-13 14-9 0-15-6-13-14 2-9 10-16 13-24Z"/><g class="blink" fill="#604155"><ellipse cx="27" cy="40" rx="2.6" ry="3.7"/><ellipse cx="43" cy="40" rx="2.6" ry="3.7"/></g><path stroke="#805267" fill="none" stroke-linecap="round" stroke-width="2" d="M31 47q4 5 8 0"/>';
  icons.pingo = pingo;
  icons.lume = lume;

  const icon = name => `<svg viewBox="0 0 66 66" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
  const sprite = (name, x, y, scale = 1) =>
    `<g transform="translate(${x} ${y}) scale(${scale})">${icons[name]}</g>`;

  const palette = [
    ['#6d6791','#f3b791','#ffe2ad','#9e819f','#677d8e','#527b76','#376d67','#204b51'],
    ['#233353','#657e78','#e5caa0','#647985','#436e70','#38665b','#2e5654','#1c4249'],
    ['#46416d','#bf7e8c','#ffcd96','#877293','#6d6390','#595981','#49486a','#333a5b'],
    ['#1a2b52','#695280','#f4bb8b','#6c5884','#5a5b87','#434b76','#394368','#293653']
  ];

  function tree(x, y, s, color, light) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path fill="${color}" d="M-12 11C-5-28-13-59-27-75c-14-8-34-6-39-23-6-16 9-30 24-30-1-22 19-34 39-30 15-15 41-10 48 11 29 1 36 26 17 39-2 21-30 20-48 32C8-53 8-23 18 11Z"/>
      <path fill="none" stroke="${light}" stroke-width="3" stroke-linecap="round" opacity=".68" d="M1 0C-4-36 6-69 0-100m0 19q-20-13-32-34m35 22q15-6 26-24"/>
      <path fill="${light}" opacity=".54" d="M-48-113q14-6 18 4-13 7-18-4m26-21q15-9 23 0-13 11-23 0m25 14q11-13 22-6-8 11-22 6m26-19q10-9 17 2-8 7-17-2"/>
    </g>`;
  }

  function books(x, y, w, h, i) {
    const colors = ['#b96b7b','#547d87','#a18399','#bd855d','#607f78'];
    return `<g transform="translate(${x} ${y})">
      <path fill="#3d405e" d="M-4 0h${w+9}v${h+3}H-4z"/>
      <path fill="${colors[i % colors.length]}" d="M0 1h${w}v${h-1}H0z"/>
      <path fill="#e0ba8f" d="M${w*.68} 5h${w*.32}v${h-9}H${w*.68}z"/>
      <path stroke="#f9d6ac" opacity=".65" d="M6 6v${h-11}m5-${h-11}v${h-11}m${w*.68-6}-${h-14}h${w*.24}m-${w*.24} 4h${w*.24}"/>
    </g>`;
  }

  function train(x, y, scale, happy, forward = false) {
    const wheels = [[37,21],[94,21],[170,18],[231,16],[282,14],[327,13]].map(([cx,r]) =>
      `<g transform="translate(${cx} 119)"><circle r="${r}" fill="#23283f" stroke="#efbb78" stroke-width="2.4"/><circle r="${r*.7}" fill="#984f68" stroke="#de9077" stroke-width="1.3"/><path d="M0 ${-r*.65}V${r*.65}M${-r*.65} 0H${r*.65}M${-r*.45} ${-r*.45}l${r*.9} ${r*.9}m${-r*.9} 0 ${r*.9} ${-r*.9}" stroke="#edab79" stroke-width="1.2"/><circle r="4" fill="#ffda9a"/></g>`).join('');
    return `<g transform="translate(${x} ${y}) scale(${forward ? -scale : scale} ${scale})">
      <ellipse cx="171" cy="136" rx="177" ry="9" fill="#152437" opacity=".37"/>
      <g fill="#fff0cb"><circle class="puff" cx="49" cy="-19" r="16"/><circle class="puff" cx="60" cy="-24" r="12"/><circle class="puff" cx="42" cy="-30" r="10"/></g>
      <path stroke="#302942" stroke-width="7" d="M149 106h192"/>
      ${books(229,68,44,13,2)}${books(225,56,43,13,4)}${books(234,43,44,13,0)}
      ${books(292,74,49,13,3)}${books(297,62,42,13,1)}${books(287,50,46,13,2)}
      <g transform="translate(274 44) scale(.46)"><g class="bob">${pingo}</g></g>
      <g transform="translate(261 8) scale(.48)"><g class="bob">${lume}</g></g>
      <path fill="#814f69" stroke="#e9ab78" stroke-width="2" d="M209 78h139l-7 37H221Z"/>
      <path fill="none" stroke="#e4a879" opacity=".72" d="M218 86h121m-117 20h115m-92-20v20m30-20v20m30-20v20"/>
      <path fill="#a95466" stroke="#703e56" stroke-width="3" d="M118 46V24q26-22 73-3v90h-76Z"/>
      <path fill="#32354e" stroke="#e9ab75" stroke-width="3" d="M109 28q10-25 44-25 31-1 45 21l-5 7q-46-11-84-3Z"/>
      <path fill="#443a57" stroke="#efbf82" stroke-width="2.5" d="M143 39q11-9 27-4l6 4v32h-33Z"/>
      <path fill="#78949c" opacity=".65" d="M147 42q10-7 23-3l-22 23Z"/>
      <path fill="#d99777" d="M142 80h35v21h-35Z"/><path stroke="#834b64" fill="none" d="M147 84h25v13h-25Z"/>${star(160,90,5)}
      <path fill="#6d4769" stroke="#edbc80" stroke-width="2.4" d="M26 53Q53 40 126 52c12 6 12 40 0 46H30Z"/>
      <path fill="#976586" d="M51 54q45-7 71 2l4 8H45Z"/>
      <path stroke="#d99b79" stroke-width="3" fill="none" d="M66 49v47m43-45v45M79 65h20m-20 8h20"/>
      <path fill="#59466d" stroke="#edbc80" stroke-width="2.4" d="M38 50 34 31 27 18q13-9 41 0l-8 13-4 19Z"/>
      <ellipse cx="47" cy="18" rx="21" ry="6" fill="#3e3b57" stroke="#edbc80" stroke-width="2"/>
      <path fill="#e1a764" d="M84 49V36h15v13Zm-4-13a11 11 0 0 1 23 0Z"/>
      <path fill="#efa86e" stroke="#60384f" stroke-width="2" d="M6 95h189v14H6Zm0 14h25l-13 17H-11Z"/>
      <path stroke="#9a5061" stroke-width="2" d="m7 113-7 11m14-11-7 11m14-11-7 11"/>
      ${wheels}
      <path stroke="#ffca87" stroke-width="4" stroke-linecap="round" d="M37 119h57"/>
      <ellipse cx="30" cy="76" rx="24" ry="26" fill="#d89365" stroke="#ffe0a0" stroke-width="3"/>
      <ellipse cx="30" cy="76" rx="20" ry="22" fill="#ffe0a6"/>
      <path fill="none" stroke="#784b60" stroke-linecap="round" stroke-width="1.8" d="M17 65q3-4 7-2m12 0q4-2 7 2"/>
      <g class="blink" fill="#393149"><ellipse cx="22" cy="72" rx="3" ry="4"/><ellipse cx="38" cy="72" rx="3" ry="4"/></g>
      <ellipse cx="16" cy="80" rx="3" ry="1.7" fill="#df8d87"/><ellipse cx="44" cy="80" rx="3" ry="1.7" fill="#df8d87"/>
      <path fill="${happy ? '#704354' : 'none'}" stroke="#704354" stroke-width="2" stroke-linecap="round" d="${happy ? 'M23 81q8 5 15-1-6 17-15 1Z' : 'M24 83q6 7 13-1'}"/>
      <path stroke="#ffe9b0" stroke-width="1.5" d="M31 85h5" opacity="${happy ? 1 : 0}"/>
    </g>`;
  }

  const bridge = (x, y, i, built) => `<g transform="translate(${x} ${y})" class="${built ? 'reward' : ''}">
    <path d="M0 0h112v7h-9v39h-10V29Q56-4 19 29v17H9V7H0Z" fill="${built ? '#b87965' : '#365966'}" stroke="${built ? '#f7cc91' : '#8ca2a5'}" stroke-width="2" ${built ? '' : 'stroke-dasharray="5 6" opacity=".73"'}/>
    ${built ? '<path d="M5 4h103M15 14h83M28 9v6m20-6v6m20-6v6m20-6v6" stroke="#ffd39b" opacity=".67"/>'+star(52, -12, 7) : ''}
    <text x="56" y="23" text-anchor="middle" font-family="Baloo, sans-serif" font-size="12" fill="#fff1b8">${built ? ['LUA','SAPO','LAMPIÃO'][i] : ''}</text></g>`;

  function scene(world, progress, happy = false) {
    const [sky, horizon, sun, mountain, hill, grass, front, dark] = palette[world];
    const forest = world === 1;
    const city = world >= 2;
    const finish = world === 3;
    const stars = Array.from({length: 36}, (_,i) => {
      const x = (i*157 + 62) % 1180 + 10;
      const y = (i*53 + 23) % 170 + 8;
      return i % 4 ? `<circle cx="${x}" cy="${y}" r="${i%3*.5+.8}" fill="#fff2cd" opacity=".67"/>` :
        star(x, y, 3+i%5, '#fff0c0', 'class="glint sparkle"');
    }).join('');
    const grove = Array.from({length: forest ? 17 : 11}, (_,i) =>
      tree(i*109 - 18, 205 + (i*17)%34, forest ? .66 + (i*13)%8*.075 : .32 + (i*13)%7*.041, i%3 ? grass : hill, i%2 ? '#92a687' : '#d3b39b')
    ).join('');
    const skyline = Array.from({length: 17}, (_,i) => {
      const x = i*75 - 10;
      const count = 3+(i*7)%5;
      const w = 49+(i*13)%24;
      return Array.from({length: count}, (_,j) => books(x+(j*17)%13, 229-j*15-(i%3)*7, w-(j*11)%14, 14, i+j)).join('') +
        (i%3 === 0 ? `<path d="M${x+20} ${222-count*15}l13 -21 14 21Z" fill="#f7bc8a"/>` : '');
    }).join('');
    const flora = Array.from({length: 36}, (_,i) => {
      const x = (i*157 + 13)%1210;
      const y = 307+(i*17)%49;
      if (world === 0 && x > 412 && x < 765) return '';
      return `<path d="M${x} ${y}q-3-8 -11-12m11 12q3-8 10-9" stroke="${i%2 ? '#92a58a' : hill}" stroke-width="2" fill="none" opacity=".75"/><circle cx="${x-11}" cy="${y-12}" r="${i%3+1}" fill="${i%2 ? '#ffc58c' : '#d98b90'}"/>`;
    }).join('');
    const ties = Array.from({length: 67}, (_,i) => `<path d="M${i*19-16} 278l12 10h7l-11-10Z"/>`).join('');
    const bridgeSections = [0,1,2].map(i => bridge(422+i*112,278,i,progress>i)).join('');
    const forestRewards = [
      sprite('flower', 782, 212, .78)+sprite('flower', 817, 225, .57),
      sprite('web', 895, 156, 1.1)+sprite('spider', 929, 197, .55),
      sprite('lantern', 1000, 172, .92)+star(1029,187,12)
    ];
    const cityRewards = [
      sprite('flag', 722, 152, 1.3)+sprite('flag', 678, 176, .78),
      sprite('lantern', 826, 161, 1.3)+sprite('lantern', 945, 170, .85),
      sprite('gear', 1040, 147, 1.45)+star(1088,151,16)
    ];
    return `<svg viewBox="0 0 1200 350" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%" gradientUnits="objectBoundingBox"><stop stop-color="${sky}"/><stop offset="1" stop-color="${horizon}"/></linearGradient>
        <radialGradient id="halo"><stop stop-color="${sun}" stop-opacity=".7"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></radialGradient>
        <pattern id="grain" width="29" height="31" patternUnits="userSpaceOnUse"><path d="M3 3h1m15 7h1m-6 13h1m11 6h1m-23-13h1" stroke="#fff2d4" opacity=".16"/><path d="M10 5h1m15 14h1m-24 10h1m20-27h1" stroke="#261e40" opacity=".15"/></pattern>
        <clipPath id="track"><path d="${world === 0 ? 'M0 269H422v30H0Zm758 0H1200v30H758Z' : 'M0 269h1200v30H0Z'}"/></clipPath>
      </defs>
      <path fill="url(#sky)" d="M0 0h1200v350H0Z"/>
      <circle cx="873" cy="99" r="160" fill="url(#halo)"/><circle cx="873" cy="99" r="48" fill="${sun}" opacity=".92"/>
      ${stars}
      <path fill="#ffe5c3" opacity=".28" d="M0 103q45-18 103-7 50-15 149 4-52 16-121 9-63 12-131 1Zm663-42q90-19 153-4 66-8 106 0-39 16-103 12-95 7-156-8Zm299 75q83-26 161-8l77-3v22q-128 6-238-11Z"/>
      <path fill="${mountain}" d="M0 181 65 154 100 160 180 85l41 35 33-13 103 63 80-27 82 26L622 98l43 26 45-11 116 68 91-44 58 17 104-75 121 80v110H0Z"/>
      <path fill="${sun}" opacity=".59" d="m139 124 41-39 41 35 33-13 33 21-34-8-31 10-27-18-17 11-13-7Zm438 5 45-31 43 26 45-11 39 23-38-12-46 16-42-21-17 11Zm460-21 42-29 49 34-51-15-18 12Z"/>
      <path fill="${hill}" d="M0 213q146-100 269-50 97 43 199 6 158-54 291 11 123 37 250-18 111-33 191 9v126H0Z"/>
      ${city ? skyline : grove}
      <path fill="${front}" d="M0 232q111-15 241 4t246-7q120-27 259 4t225-6q108-18 229 3v120H0Z"/>
      <path fill="${dark}" d="M0 277q143 18 274 0 154-17 334 1 152 16 328-1 120-13 264 2v71H0Z"/>
      ${world === 0 ? '<path fill="#578e98" d="M534 224q80 12 143 0l82 126H394Z"/><path fill="#78acaf" d="M564 232q64 10 104-2l51 120H442Z"/><path d="M545 259q42 6 71 0m-103 43q101 13 169-4m-110 27q61 7 98 1m-67-88h34" fill="none" stroke="#d6d9bd" opacity=".6" stroke-width="2"/>' : ''}
      <g clip-path="url(#track)"><path d="M0 278h1200v11H0Z" fill="#614e64"/><g fill="#b88c79">${ties}</g><path d="M0 278h1200m-1200 8h1200" stroke="#f1c798" stroke-width="2"/></g>
      ${world === 0 ? bridgeSections : ''}
      ${flora}
      <path fill="url(#grain)" d="M0 0h1200v350H0Z"/>
      ${!city && forest ? tree(72,347,1.82,'#183b48','#497064')+tree(1166,350,1.75,'#183b48','#497064') : ''}
      ${world > 0 && !finish ? (forest ? forestRewards : cityRewards).slice(0,progress).map(reward => `<g class="reward">${reward}</g>`).join('') : ''}
      ${train(world === 0 ? 414 + progress*112 : 491 + progress*87, 160, 1, happy, true)}
      ${finish ? Array.from({length: 48}, (_,i) => star((i*121+11)%1190, 36+(i*79)%290, 4+i%8, ['#ffe1a0','#f4a2ad','#a7d3cb'][i%3], 'class="glint sparkle"')).join('') : ''}
    </svg>`;
  }

  return { icon, scene };
})();



