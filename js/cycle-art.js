/* Hand-drawn, animated SVG art for the "Life of a star" section.
   Every picture is a function that returns an SVG string with a transparent background.
   The animations live in css/cycle.css (classes starting with a-). */
window.CYCLE_ART = (function () {
  const S = (inner) => `<svg viewBox="0 0 280 200" aria-hidden="true" focusable="false">${inner}</svg>`;
  const BG = '';
  const rays = (n, r1, r2, off = 0) => {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + off;
      d += 'M' + (140 + Math.cos(a) * r1).toFixed(1) + ' ' + (100 + Math.sin(a) * r1).toFixed(1) +
        'L' + (140 + Math.cos(a) * r2).toFixed(1) + ' ' + (100 + Math.sin(a) * r2).toFixed(1);
    }
    return d;
  };
  const txt = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Courier Prime, monospace" font-size="9" fill="#F2E9C9" opacity=".85">${t}</text>`;

  const defs = `<svg id="cycle-defs" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <radialGradient id="g-hot"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#FFE9B0"/><stop offset=".6" stop-color="#E8B04B" stop-opacity=".5"/><stop offset="1" stop-color="#E8B04B" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-red"><stop offset="0" stop-color="#FFC9A0"/><stop offset=".5" stop-color="#FF6B3D"/><stop offset=".85" stop-color="#C23B22"/><stop offset="1" stop-color="#8A2415"/></radialGradient>
    <radialGradient id="g-redglow"><stop offset=".55" stop-color="#FF5A36" stop-opacity=".45"/><stop offset="1" stop-color="#FF5A36" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-blue"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#CFE3FF"/><stop offset=".65" stop-color="#8FB8FF" stop-opacity=".5"/><stop offset="1" stop-color="#8FB8FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-dust"><stop offset="0" stop-color="#8FB8FF" stop-opacity=".45"/><stop offset="1" stop-color="#8FB8FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-dust2"><stop offset="0" stop-color="#E8B04B" stop-opacity=".4"/><stop offset="1" stop-color="#E8B04B" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-mag"><stop offset=".5" stop-color="#C45A8A" stop-opacity=".35"/><stop offset="1" stop-color="#C45A8A" stop-opacity="0"/></radialGradient>
    <radialGradient id="g-sunc"><stop offset="0" stop-color="#FFF6D0"/><stop offset=".7" stop-color="#FFD25A"/><stop offset="1" stop-color="#E8A02B"/></radialGradient>
    <linearGradient id="g-beamU" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFE08A" stop-opacity=".9"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></linearGradient>
    <linearGradient id="g-beamD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE08A" stop-opacity=".9"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></linearGradient>
  </defs></svg>`;

  /* procedural nebula: built once, then reused as a small picture */
  let nebulaURL = null;
  function makeNebula() {
    const W = 260, H = 185;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext && cv.getContext('2d'); if (!ctx) return null;
    const img = ctx.createImageData(W, H), d = img.data;
    const hash = (x, y) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); };
    const sm = (t) => t * t * (3 - 2 * t);
    const noise = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), u = sm(x - xi), v = sm(y - yi);
      const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), e = hash(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + e) * u * v;
    };
    const fbm = (x, y) => { let s = 0, a = 0.5; for (let o = 0; o < 4; o++) { s += a * noise(x, y); x = x * 2 + 17.3; y = y * 2 + 9.1; a *= 0.5; } return s; };
    const mix = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
    const step = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const x = px / W, y = py / H, nx = (x - 0.5) * 3.2, ny = (y - 0.5) * 3.2;
        const q = fbm(nx + 1.7, ny + 9.2);
        const r = fbm(nx + 3 * q + 8.3, ny + 3 * q + 2.8);            // domain warp: wispy filaments
        const lane = fbm(nx * 1.6 + 40, ny * 1.6 + 5);                // dark dust lanes
        const dx = (x - 0.5) / 0.5, dy = (y - 0.5) / 0.42;
        const mask = Math.max(0, 1 - Math.pow(dx * dx + dy * dy, 0.9));
        let alpha = step(0.34, 0.74, r) * Math.pow(mask, 0.55);
        alpha *= 1 - step(0.52, 0.64, lane) * 0.9;
        const warm = step(0.46, 0.72, r), hot = step(0.68, 0.88, r), core = step(0.84, 0.97, r);
        let R = mix(34, 236, warm), G = mix(96, 170, warm), B = mix(150, 70, warm);
        R = mix(R, 214, hot * 0.6); G = mix(G, 96, hot * 0.6); B = mix(B, 46, hot * 0.6);
        R = mix(R, 255, core * 0.8); G = mix(G, 236, core * 0.8); B = mix(B, 200, core * 0.8);
        const k = 0.65 + 0.7 * q, i = (py * W + px) * 4;
        d[i] = Math.min(255, R * k); d[i + 1] = Math.min(255, G * k); d[i + 2] = Math.min(255, B * k);
        d[i + 3] = Math.round(255 * Math.min(1, alpha * 0.95));
      }
    }
    ctx.putImageData(img, 0, 0);
    for (let i = 0; i < 40; i++) {                                    // a few stars inside it
      ctx.fillStyle = 'rgba(242,233,201,' + (0.5 + hash(i, 9.9) * 0.5).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(hash(i, 3.3) * W, hash(i, 7.7) * H, 0.6 + hash(i, 1.1) * 1.2, 0, 6.283); ctx.fill();
    }
    try { return cv.toDataURL('image/png'); } catch (e) { return null; }
  }

  const art = {
    /* 1 · nebula: two layers of dust drifting against each other */
    cloud: () => S(
      '<image data-neb class="a-drift" x="-8" y="-6" width="296" height="212" preserveAspectRatio="xMidYMid slice" style="opacity:0;transition:opacity 1.4s ease"/>' +
      '<g fill="#F2E9C9" class="a-tw"><circle cx="128" cy="92" r="1.6"/><circle cx="162" cy="104" r="1.3"/><circle cx="110" cy="116" r="1.2"/></g>'
    ),

    /* 2 · protostar: glowing core, spinning disk, jets along the axis */
    protostar: () => S(BG +
      `<circle cx="140" cy="100" r="60" fill="url(#g-hot)" class="a-pulse"/>
       <g transform="translate(140 100) scale(1 .3)"><g class="a-spin slow">
         <circle r="104" fill="none" stroke="#E8B04B" stroke-opacity=".55" stroke-width="9" stroke-dasharray="2 10"/>
         <circle r="78" fill="none" stroke="#F2E9C9" stroke-opacity=".6" stroke-width="7" stroke-dasharray="2 8"/>
         <circle r="54" fill="none" stroke="#FFD76A" stroke-width="6" stroke-dasharray="2 6"/></g></g>
       <g class="a-flow" stroke="#F2E9C9" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 9" opacity=".75"><path d="M140 70V12M140 130V188" fill="none"/></g>
       <circle cx="140" cy="100" r="9" fill="#FFF4CF"/>`),

    /* brown dwarf: dim banded ball, magenta glow */
    brown: () => S(BG +
      `<circle cx="140" cy="100" r="80" fill="url(#g-mag)"/>
       <defs><clipPath id="cp-bd"><circle cx="140" cy="100" r="50"/></clipPath></defs>
       <circle cx="140" cy="100" r="50" fill="#4A2142"/>
       <g clip-path="url(#cp-bd)"><g class="a-bands">
         <rect x="80" y="66" width="120" height="9" fill="#8B3F63"/><rect x="80" y="84" width="120" height="6" fill="#6B2F53"/>
         <rect x="80" y="98" width="120" height="12" fill="#A24C70"/><rect x="80" y="118" width="120" height="7" fill="#6B2F53"/>
         <rect x="80" y="132" width="120" height="9" fill="#8B3F63"/></g></g>
       <circle cx="140" cy="100" r="50" fill="none" stroke="#C45A8A" stroke-opacity=".5" stroke-width="2"/>
       <ellipse cx="124" cy="82" rx="16" ry="10" fill="#fff" opacity=".08"/>`),

    /* red dwarf: small, red, steady, with an occasional flare */
    reddwarf: () => S(BG +
      `<circle cx="140" cy="100" r="68" fill="url(#g-redglow)" class="a-breathe"/>
       <circle cx="140" cy="100" r="30" fill="url(#g-red)"/>
       <path d="M160 82q14-10 22 4q-9-3-15 5z" fill="#FFB27A" class="a-flare"/>`),

    /* sun-like main sequence: yellow disc, slowly turning rays */
    sunlike: () => S(BG +
      `<circle cx="140" cy="100" r="80" fill="url(#g-hot)" class="a-breathe"/>
       <g class="a-spin xslow"><path d="${rays(14, 54, 68)}" stroke="#FFD76A" stroke-width="3" stroke-linecap="round" fill="none"/></g>
       <circle cx="140" cy="100" r="42" fill="url(#g-sunc)"/>`),

    /* red giant: swollen, mottled, breathing, with today's Sun for scale */
    redgiant: () => S(BG +
      `<circle cx="132" cy="100" r="98" fill="url(#g-redglow)"/>
       <g class="a-breathe slow"><circle cx="132" cy="100" r="76" fill="url(#g-red)"/>
         <circle cx="108" cy="82" r="12" fill="#C23B22" opacity=".5"/><circle cx="150" cy="116" r="16" fill="#C23B22" opacity=".4"/>
         <circle cx="130" cy="64" r="8" fill="#FFB27A" opacity=".35"/><circle cx="164" cy="84" r="9" fill="#8A2415" opacity=".4"/></g>
       <circle cx="256" cy="176" r="4" fill="#FFD25A"/>${txt(256, 162, 'Sun, today')}`),

    /* planetary nebula: shells of gas expanding around a hot core */
    nebula: () => S(BG +
      `<ellipse cx="140" cy="100" rx="86" ry="74" fill="url(#g-dust)"/>
       <g class="a-ring" style="--dl:0s"><circle cx="140" cy="100" r="64" fill="none" stroke="#8FB8FF" stroke-width="5"/></g>
       <g class="a-ring" style="--dl:-1.7s"><circle cx="140" cy="100" r="48" fill="none" stroke="#E8B04B" stroke-width="4"/></g>
       <g class="a-ring" style="--dl:-3.4s"><circle cx="140" cy="100" r="32" fill="none" stroke="#F2E9C9" stroke-width="3"/></g>
       <circle cx="140" cy="100" r="26" fill="url(#g-blue)"/><circle cx="140" cy="100" r="5" fill="#fff"/>`),

    /* white dwarf: Earth-sized, twinkling, with Earth beside it */
    whitedwarf: () => S(BG +
      `<circle cx="196" cy="100" r="50" fill="url(#g-blue)" class="a-breathe"/>
       <path d="M196 64v72M160 100h72" stroke="#CFE3FF" stroke-width="1.5" stroke-linecap="round" opacity=".7" class="a-tw"/>
       <circle cx="196" cy="100" r="12" fill="#fff"/>
       <circle cx="84" cy="100" r="12" fill="#3B5B8F"/><path d="M75 97q6-5 11 0q3 5 6 1" stroke="#5FA777" stroke-width="3" fill="none" stroke-linecap="round"/>
       ${txt(84, 128, 'Earth')}${txt(196, 128, 'White dwarf')}`),

    /* black dwarf: cold, dark, dotted outline for "hypothetical" */
    blackdwarf: () => S(BG +
      `<circle cx="140" cy="100" r="50" fill="none" stroke="#F2E9C9" stroke-opacity=".25" stroke-width="2" stroke-dasharray="2 7"/>
       <circle cx="140" cy="100" r="32" fill="#0E1330" stroke="#F2E9C9" stroke-opacity=".35" stroke-width="2"/>
       <ellipse cx="129" cy="91" rx="10" ry="7" fill="#F2E9C9" opacity=".05"/>`),

    /* type Ia: a companion feeds a white dwarf, then it detonates */
    typeIa: () => S(BG +
      `<circle cx="214" cy="86" r="38" fill="url(#g-redglow)"/><circle cx="214" cy="86" r="24" fill="url(#g-red)"/>
       <path d="M196 98C170 126 150 120 104 106" fill="none" stroke="#FFD76A" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 8" class="a-flow"/>
       <circle cx="86" cy="104" r="40" fill="url(#g-blue)"/><circle cx="86" cy="104" r="9" fill="#fff"/>
       <circle cx="86" cy="104" r="12" fill="#fff" class="a-flash"/>
       <circle cx="86" cy="104" r="12" fill="none" stroke="#FFD76A" stroke-width="3" class="a-flash b"/>`),

    /* massive main sequence: hot blue-white star with long spikes */
    massive: () => S(BG +
      `<circle cx="140" cy="100" r="92" fill="url(#g-blue)" class="a-breathe"/>
       <g class="a-spin xslow"><path d="${rays(8, 44, 96)}" stroke="#CFE3FF" stroke-width="4" stroke-linecap="round" fill="none"/></g>
       <circle cx="140" cy="100" r="38" fill="#DDEBFF"/><circle cx="140" cy="100" r="38" fill="url(#g-blue)" opacity=".6"/>`),

    /* supergiant: bigger and darker than the red giant */
    supergiant: () => S(BG +
      `<circle cx="140" cy="100" r="104" fill="url(#g-redglow)"/>
       <g class="a-breathe slow"><circle cx="140" cy="100" r="88" fill="url(#g-red)"/>
         <circle cx="112" cy="78" r="15" fill="#8A2415" opacity=".5"/><circle cx="168" cy="118" r="19" fill="#8A2415" opacity=".45"/>
         <circle cx="150" cy="62" r="9" fill="#FFB27A" opacity=".3"/><circle cx="104" cy="126" r="11" fill="#FFB27A" opacity=".25"/></g>
       <circle cx="262" cy="188" r="3" fill="#FFD25A"/>${txt(258, 176, 'Sun')}`),

    /* iron core: the onion-layer cross-section, the centre squeezes */
    ironcore: () => {
      const L = [[86, '#F2E9C9', .14, 'H'], [70, '#FFE08A', .28, 'He'], [55, '#FFB066', .42, 'C · O'], [40, '#E86A4A', .55, 'Si']];
      return S(BG + L.map(([r, c, o]) => `<circle cx="140" cy="100" r="${r}" fill="${c}" opacity="${o}" stroke="${c}" stroke-opacity=".6"/>`).join('') +
        `<circle cx="140" cy="100" r="25" fill="#C8D2EA" class="a-squeeze"/>` +
        L.map(([r, , , t]) => `<text x="140" y="${100 - r + 12}" text-anchor="middle" font-family="Courier Prime, monospace" font-size="9" fill="#F2E9C9" stroke="#0B1026" stroke-width="3" paint-order="stroke">${t}</text>`).join('') +
        `<text x="140" y="104" text-anchor="middle" font-family="Courier Prime, monospace" font-size="10" font-weight="700" fill="#0B1026">Fe</text>`);
    },

    /* core-collapse supernova: rays and shock rings blasting outward */
    supernova: () => S(BG +
      `<g class="a-burst"><circle cx="140" cy="100" r="64" fill="url(#g-hot)"/>
         <path d="${rays(22, 40, 98)}" stroke="#FFE08A" stroke-width="3" stroke-linecap="round" fill="none"/>
         <path d="${rays(22, 44, 70, .14)}" stroke="#FF8A5A" stroke-width="3" stroke-linecap="round" fill="none"/></g>
       <g class="a-ring" style="--dl:0s"><circle cx="140" cy="100" r="70" fill="none" stroke="#FF8A5A" stroke-width="4"/></g>
       <g class="a-ring" style="--dl:-2.5s"><circle cx="140" cy="100" r="50" fill="none" stroke="#F2E9C9" stroke-width="2.5"/></g>
       <circle cx="140" cy="100" r="7" fill="#fff" class="a-squeeze"/>`),

    /* direct collapse: everything falls inward, a dark core, no flash */
    direct: () => S(BG +
      `<circle cx="140" cy="100" r="86" fill="url(#g-redglow)" class="a-fade"/>
       <g class="a-in" style="--dl:0s"><circle cx="140" cy="100" r="84" fill="none" stroke="#FF8A5A" stroke-width="4"/></g>
       <g class="a-in" style="--dl:-1.5s"><circle cx="140" cy="100" r="84" fill="none" stroke="#FFB066" stroke-width="3"/></g>
       <g class="a-in" style="--dl:-3s"><circle cx="140" cy="100" r="84" fill="none" stroke="#F2E9C9" stroke-width="2"/></g>
       <circle cx="140" cy="100" r="20" fill="#05070F"/><circle cx="140" cy="100" r="20" fill="none" stroke="#F2E9C9" stroke-opacity=".6" stroke-width="2"/>`),

    /* pair-instability: the whole star is torn apart, an empty ring remains */
    pair: () => S(BG +
      `<g class="a-burst slowb"><path d="${rays(16, 50, 100)}" stroke="#E8B04B" stroke-width="5" stroke-linecap="round" fill="none"/>
         <path d="${rays(16, 58, 90, .2)}" stroke="#F2E9C9" stroke-width="2" stroke-linecap="round" fill="none"/></g>
       <circle cx="140" cy="100" r="22" fill="none" stroke="#F2E9C9" stroke-opacity=".5" stroke-width="2" stroke-dasharray="2 5"/>
       <g class="a-pulse"><circle cx="132" cy="94" r="3" fill="#F2E9C9"/><circle cx="148" cy="94" r="3" fill="#FF8A5A"/>
         <circle cx="132" cy="108" r="3" fill="#FF8A5A"/><circle cx="148" cy="108" r="3" fill="#F2E9C9"/></g>`),

    /* neutron star: layered ball, with a ruler to show it is only ~20 km */
    neutron: () => S(BG +
      `<circle cx="140" cy="92" r="72" fill="url(#g-blue)" opacity=".5" class="a-breathe"/>
       <circle cx="140" cy="92" r="42" fill="#CFE3FF" stroke="#fff" stroke-width="3"/>
       <circle cx="140" cy="92" r="31" fill="#9FC0F5"/><circle cx="140" cy="92" r="20" fill="#6E96E0"/><circle cx="140" cy="92" r="9" fill="#3F68C2"/>
       <path d="M98 150h84M98 144v12M182 144v12" stroke="#F2E9C9" stroke-width="1.5" fill="none"/>${txt(140, 170, 'about 20 km')}`),

    /* pulsar: magnetic field loops and two beams sweeping like a lighthouse */
    pulsar: () => S(BG +
      `<g transform="rotate(-25 140 100)">
         <g fill="none" stroke="#8FB8FF" stroke-opacity=".6" stroke-width="2"><ellipse cx="140" cy="100" rx="22" ry="54"/><ellipse cx="140" cy="100" rx="40" ry="74"/><ellipse cx="140" cy="100" rx="60" ry="92"/></g>
         <g class="a-spin fast"><path d="M140 100L116 8H164Z" fill="url(#g-beamU)"/><path d="M140 100L116 192H164Z" fill="url(#g-beamD)"/></g></g>
       <circle cx="140" cy="100" r="22" fill="url(#g-blue)"/><circle cx="140" cy="100" r="10" fill="#fff"/>`),

    /* magnetar: tangled, flickering field, sparks leaving the poles */
    magnetar: () => S(BG +
      `<g class="a-flick" fill="none" stroke="#FF8A5A" stroke-width="2.2">
         <ellipse cx="140" cy="100" rx="20" ry="56"/><ellipse cx="140" cy="100" rx="38" ry="76"/>
         <ellipse cx="140" cy="100" rx="58" ry="92"/><ellipse cx="140" cy="100" rx="82" ry="98"/></g>
       <circle cx="140" cy="100" r="22" fill="url(#g-blue)"/><circle cx="140" cy="100" r="10" fill="#fff"/>
       <path d="M156 40q22-14 40-2M124 160q-22 14-40 2" fill="none" stroke="#FFE08A" stroke-width="3" stroke-linecap="round" class="a-flare"/>
       ${[-90, 90, -60, 60].map((a, i) => `<circle cx="140" cy="100" r="2.4" fill="#FFE08A" class="a-spark" style="--a:${a}deg;--dl:-${i}s"/>`).join('')}`),

    /* kilonova: two neutron stars spiral in, then heavy elements are flung out */
    kilonova: () => S(BG +
      `<g class="a-burst slowb"><circle cx="140" cy="100" r="60" fill="url(#g-hot)"/><path d="${rays(14, 34, 96)}" stroke="#E8B04B" stroke-width="3" stroke-linecap="round" fill="none"/></g>
       <g class="a-spin mid"><circle cx="112" cy="100" r="22" fill="url(#g-blue)"/><circle cx="168" cy="100" r="22" fill="url(#g-blue)"/>
         <circle cx="112" cy="100" r="9" fill="#CFE3FF"/><circle cx="168" cy="100" r="9" fill="#CFE3FF"/>
         <path d="M121 100H159" stroke="#8FB8FF" stroke-opacity=".6" stroke-dasharray="2 4" fill="none"/></g>
       <g fill="#E8B04B" class="a-tw"><circle cx="60" cy="60" r="2"/><circle cx="222" cy="52" r="2.4"/><circle cx="48" cy="140" r="1.8"/><circle cx="232" cy="146" r="2.2"/></g>`),

    /* black hole: shadow, lit ring, tilted disk of infalling gas */
    blackhole: () => S(BG +
      `<circle cx="140" cy="100" r="92" fill="url(#g-dust2)" opacity=".5"/>
       <g transform="translate(140 100) scale(1 .28)"><g class="a-spin slow">
         <circle r="96" fill="none" stroke="#E8B04B" stroke-opacity=".7" stroke-width="12" stroke-dasharray="3 7"/>
         <circle r="74" fill="none" stroke="#FFD76A" stroke-width="10" stroke-dasharray="4 6"/>
         <circle r="56" fill="none" stroke="#FFF1C2" stroke-width="7" stroke-dasharray="3 5"/></g></g>
       <circle cx="140" cy="100" r="32" fill="#05070F"/><circle cx="140" cy="100" r="32" fill="none" stroke="#FFE08A" stroke-width="3"/>
       <path d="M100 82a44 44 0 0 1 80 0" fill="none" stroke="#FFF1C2" stroke-width="5" stroke-opacity=".8" stroke-linecap="round"/>
       <path d="M48 100a92 26 0 0 0 184 0" fill="none" stroke="#FFD76A" stroke-width="8" stroke-opacity=".85"/>`),

    /* Hawking evaporation: the hole slowly shrinks, sparks leave, a last flash */
    hawking: () => S(BG +
      `<circle cx="140" cy="100" r="82" fill="url(#g-blue)" opacity=".18"/>
       <g class="a-shrink"><circle cx="140" cy="100" r="34" fill="#05070F"/><circle cx="140" cy="100" r="34" fill="none" stroke="#8FB8FF" stroke-width="2.5"/></g>
       ${[20, 70, 120, 170, 215, 265, 310, 345].map((a, i) => `<circle cx="140" cy="100" r="2.2" fill="#8FB8FF" class="a-spark" style="--a:${a}deg;--dl:-${(i * 0.5).toFixed(1)}s"/>`).join('')}
       <circle cx="140" cy="100" r="10" fill="#fff" class="a-last"/>`)
  };
  /* solid cores [cx, cy, r] in the 280x200 picture: the star field is hidden behind these */
  art.occ = {
    protostar: [[140, 100, 34]], brown: [[140, 100, 50]], reddwarf: [[140, 100, 30]], sunlike: [[140, 100, 42]],
    redgiant: [[132, 100, 76]], nebula: [[140, 100, 30]], whitedwarf: [[196, 100, 34], [84, 100, 12]], blackdwarf: [[140, 100, 32]],
    typeIa: [[214, 86, 24], [86, 104, 34]], massive: [[140, 100, 40]], supergiant: [[140, 100, 88]], ironcore: [[140, 100, 86]],
    supernova: [[140, 100, 36]], direct: [[140, 100, 22]], neutron: [[140, 92, 42]], pulsar: [[140, 100, 22]], magnetar: [[140, 100, 22]],
    kilonova: [[112, 100, 22], [168, 100, 22]], blackhole: [[140, 100, 32]]
  };
  art.defs = defs;
    art.hydrate = (el, key) => {                       // fills in the procedural nebula picture
    if (key !== 'cloud') return;
    const img = el.querySelector('[data-neb]'); if (!img) return;
    setTimeout(() => {
      if (!nebulaURL) nebulaURL = makeNebula();
      if (nebulaURL) { img.setAttribute('href', nebulaURL); img.style.opacity = '1'; }
    }, 60);
  };
  art.tint = {   // faint colour of the space behind each stage
    cloud: '#17324a', protostar: '#3a2a14', brown: '#35182f', reddwarf: '#3a1812', sunlike: '#3a3112', redgiant: '#401a12',
    nebula: '#17304a', whitedwarf: '#1a2c52', blackdwarf: '#10142a', typeIa: '#33261a', massive: '#16284d', supergiant: '#3d1710',
    ironcore: '#2e1a14', supernova: '#40240f', direct: '#2a1210', pair: '#33210f', neutron: '#142347', pulsar: '#142347',
    magnetar: '#3a1a1a', kilonova: '#2a2140', blackhole: '#0a0c18', hawking: '#101a33'
  };
  art.orb = {    // colour of the little orb on each card
    cloud: '#5aa0c8', protostar: '#ffd76a', brown: '#a24c70', reddwarf: '#ff6b3d', sunlike: '#ffd25a', redgiant: '#ff6b3d',
    nebula: '#8fb8ff', whitedwarf: '#cfe3ff', blackdwarf: '#4a5070', typeIa: '#ffe08a', massive: '#9cc8ff', supergiant: '#e0502e',
    ironcore: '#c8d2ea', supernova: '#ffb066', direct: '#05070f', pair: '#e8b04b', neutron: '#6e96e0', pulsar: '#8fb8ff',
    magnetar: '#ff8a5a', kilonova: '#e8b04b', blackhole: '#05070f', hawking: '#8fb8ff'
  };
  return art;
})();