(function () {
  'use strict';
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- tiny DOM helpers ---------- */
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(kid));
    }
    return el;
  }
  function svgEl(name, attrs, ...kids) {
    const el = document.createElementNS(NS, name);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    kids.forEach(k => el.append(k));
    return el;
  }
  const head = (no, title, blurb) =>
    h('header', { class: 's__head' }, h('p', { class: 's__no' }, no), h('h2', {}, title), blurb && h('p', { class: 's__blurb' }, blurb));

  /* ---------- little drawings ---------- */
  const FOSSIL = {
    trilobite: '<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="#E9D9B4" stroke="#3B2A1E" stroke-width="3" stroke-linejoin="round"><path d="M20 34Q50 2 80 34Z"/><rect x="24" y="34" width="52" height="42" rx="6"/><path d="M26 76Q50 100 74 76Z"/></g><g stroke="#3B2A1E" stroke-width="2"><path d="M24 44h52M24 54h52M24 64h52"/><path d="M50 12v82"/></g><circle cx="38" cy="26" r="3" fill="#3B2A1E"/><circle cx="62" cy="26" r="3" fill="#3B2A1E"/></svg>',
    ammonite: '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="#E9D9B4" stroke="#3B2A1E" stroke-width="3"/><circle cx="50" cy="50" r="34" fill="none" stroke="#3B2A1E" stroke-width="7" stroke-dasharray="3 5" opacity=".55"/><circle cx="54" cy="50" r="24" fill="none" stroke="#3B2A1E" stroke-width="3"/><circle cx="57" cy="50" r="15" fill="none" stroke="#3B2A1E" stroke-width="3"/><circle cx="59" cy="50" r="7" fill="none" stroke="#3B2A1E" stroke-width="3"/></svg>',
    tooth: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M32 10H68Q72 48 56 92Q50 98 44 92Q28 48 32 10Z" fill="#E9D9B4" stroke="#3B2A1E" stroke-width="3" stroke-linejoin="round"/><path d="M32 10H68" stroke="#3B2A1E" stroke-width="6"/><path d="M60 20Q62 50 52 82" fill="none" stroke="#3B2A1E" stroke-width="2" opacity=".5"/></svg>'
  };
  const PLANET = '<svg viewBox="0 0 48 48" aria-hidden="true"><ellipse cx="24" cy="26" rx="22" ry="7" fill="none" stroke="#B8872E" stroke-width="3" transform="rotate(-18 24 26)"/><circle cx="24" cy="24" r="11" fill="#E8B04B" stroke="#141414" stroke-width="2"/></svg>';
  const BLOB = '<svg viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true"><g fill="#3A5BFF"><rect x="2" y="1" width="4" height="1"/><rect x="1" y="2" width="6" height="5"/><rect x="1" y="7" width="2" height="1"/><rect x="5" y="7" width="2" height="1"/></g><g fill="#F4EFE6"><rect x="2" y="3" width="1" height="2"/><rect x="5" y="3" width="1" height="2"/></g></svg>';

  /* ---------- sound effects (synthesised, no files) ---------- */
  const Sfx = (() => {
    let ctx = null, on = true;
    try { on = localStorage.getItem('shenka.sfx') !== 'off'; } catch (e) {}
    function ensure() {
      if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function tone(o) {
      const c = ensure(); if (!c) return;
      const t0 = c.currentTime + (o.t || 0), d = o.d || 0.08;
      const osc = c.createOscillator(), g = c.createGain();
      osc.type = o.type || 'square';
      osc.frequency.setValueAtTime(o.f, t0);
      if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t0 + d);
      g.gain.setValueAtTime(o.v || 0.05, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      osc.connect(g).connect(c.destination);
      osc.start(t0); osc.stop(t0 + d + 0.02);
    }
    function noise(d, v, freq) {
      const c = ensure(); if (!c) return;
      const len = Math.floor(c.sampleRate * d), buf = c.createBuffer(1, len, c.sampleRate), ch = buf.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; g.gain.value = v;
      src.connect(f).connect(g).connect(c.destination); src.start();
    }
    const kit = {
      hello:   () => tone({ type: 'square', f: 150, f2: 55, d: 0.1, v: 0.08 }),
      school:  () => noise(0.07, 0.35, 1800),
      notes:   () => { tone({ type: 'sine', f: 880, d: 0.35, v: 0.05 }); tone({ type: 'sine', f: 1320, d: 0.3, v: 0.025, t: 0.04 }); },
      profile: () => { tone({ type: 'square', f: 523, d: 0.06, v: 0.035 }); tone({ type: 'square', f: 784, d: 0.08, v: 0.035, t: 0.06 }); },
      contact: () => tone({ type: 'triangle', f: 392, f2: 523, d: 0.12, v: 0.07 }),
      tick:    () => tone({ type: 'square', f: 1000, f2: 700, d: 0.03, v: 0.03 })
    };
    return {
      get on() { return on; },
      set(v) { on = v; try { localStorage.setItem('shenka.sfx', v ? 'on' : 'off'); } catch (e) {} },
      play(k) { if (on && kit[k]) kit[k](); }
    };
  })();

  const toastEl = $('#toast'); let toastT;
  function toast(msg, ms = 4200) {
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), ms);
  }

  /* =====================  01 HELLO  ===================== */
  function renderHello(c) {
    $('#hello').append(h('div', { class: 'wrap hello__grid' },
      h('div', { class: 'hello__text' },
        h('p', { class: 'hello__kicker' }, 'Hello, I am'),
        h('h1', { class: 'hello__name' },
          h('span', { class: 'sticker sticker--a', 'data-drag': '', 'data-sfx': '' }, c.names.primary),
          h('span', { class: 'sticker sticker--b', 'data-drag': '', 'data-sfx': '' }, c.names.alt),
          h('span', { class: 'sr' }, ' (' + c.names.full + ')')),
        h('p', { class: 'hello__full' }, 'a.k.a. ' + c.names.full),
        h('p', { class: 'hello__tag' }, c.tagline),
        h('p', { class: 'hello__intro' }, c.intro),
        h('ul', { class: 'hello__status' }, c.status.map(s => h('li', {}, h('span', { class: 'tag' }, s.label), s.text)))),
      h('figure', { class: 'hello__photo' },
        h('img', { src: c.avatar, alt: c.avatarAlt, width: 360, height: 420 }),
        h('figcaption', {}, c.photoCaption))));
  }

  /* =====================  02 SCHOOL  ===================== */
  function renderSchool(c) {
    const folders = c.levels.map((l, i) => {
      const extras = [l.major && ['Major', l.major], l.note && ['Note', l.note]].filter(Boolean);
      const id = 'folder-' + i;
      const more = extras.length && h('div', { class: 'folder__more', id },
        h('div', {}, h('div', { class: 'folder__sheet' }, extras.map(([k, v]) => h('p', {}, h('b', {}, k + ': '), v)))));
      const btn = more && h('button', {
        class: 'folder__open', type: 'button', 'aria-expanded': 'false', 'aria-controls': id,
        onclick: (e) => {
          const b = e.currentTarget, open = b.closest('.folder').classList.toggle('is-open');
          b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Close folder' : 'Open folder';
        }
      }, 'Open folder');
      return h('article', { class: 'folder' + (l.current ? ' is-current' : ''), 'data-reveal': '' },
        h('span', { class: 'folder__tab' }, l.level),
        h('div', { class: 'folder__front' },
          l.current && h('span', { class: 'stamp' }, 'In progress'),
          h('p', { class: 'folder__kind' }, l.name),
          h('h3', { class: 'folder__school' }, l.school),
          h('p', { class: 'folder__years' }, l.years),
          btn, more));
    });
    const row = (k, v) => v ? [h('dt', {}, k), h('dd', {}, v)] : null;
    const t = c.internship;
    $('#school').append(h('div', { class: 'wrap' },
      head(c.no, c.title, c.blurb),
      h('div', { class: 'folders' }, folders),
      t && h('aside', { class: 'ticket', 'data-reveal': '' },
        h('span', { class: 'tape tape--a' }), h('span', { class: 'tape tape--b' }),
        h('p', { class: 'ticket__label' }, 'SHIPPING MANIFEST'),
        h('dl', { class: 'ticket__rows' }, row('Item', t.title), row('Duration', t.length), row('Destination', t.where), row('Notes', t.note)),
        h('div', { class: 'ticket__code', 'aria-hidden': 'true' }),
        h('span', { class: 'stamp stamp--ticket' }, t.status))));
  }

  /* =====================  03 FIELD NOTES  ===================== */
  function buildSky(c) {
    const svg = svgEl('svg', { viewBox: '0 0 300 340', class: 'sky__svg', role: 'group', 'aria-label': 'Orion constellation, interactive' });
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 46; i++) {
      svg.append(svgEl('circle', { cx: (rnd() * 300).toFixed(1), cy: (rnd() * 340).toFixed(1), r: (rnd() * 1.1 + 0.3).toFixed(2), fill: '#F2E9C9', opacity: (rnd() * 0.5 + 0.2).toFixed(2) }));
    }
    c.lines.forEach(([a, b]) => {
      const A = c.stars[a], B = c.stars[b];
      svg.append(svgEl('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: 'sky__line' }));
    });
    const note = h('div', { class: 'sky__note', 'aria-live': 'polite' }, h('p', {}, 'Tap a star.'));
    const gs = c.stars.map((s) => {
      const g = svgEl('g', { class: 'sky__star', tabindex: '0', role: 'button', 'aria-label': s.name, 'data-sfx': '' });
      g.append(svgEl('circle', { cx: s.x, cy: s.y, r: 15, fill: 'transparent' }));
      g.append(svgEl('circle', { class: 'dot', cx: s.x, cy: s.y, r: s.r }));
      const label = svgEl('text', { x: s.x + 11, y: s.y + 4, class: 'sky__label' }); label.textContent = s.name; g.append(label);
      const pick = () => {
        gs.forEach(x => x.classList.remove('is-on')); g.classList.add('is-on');
        note.replaceChildren(h('h3', {}, s.name), h('p', { class: 'sky__type' }, s.kind), h('p', {}, s.note));
      };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      svg.append(g);
      return g;
    });
    return h('div', { class: 'wrap sky' }, svg, h('div', { class: 'sky__text' }, h('h3', {}, c.title), h('p', {}, c.blurb), note));
  }
  function buildStrata(c) {
    return h('div', { class: 'strata' },
      h('div', { class: 'wrap strata__head' }, h('h3', {}, c.title), h('p', {}, c.blurb)),
      c.layers.map((l, i, arr) =>
        h('div', { class: 'band' + (i === arr.length - 1 ? ' band--dark' : '') + (i % 2 ? ' band--flip' : ''), style: '--c:' + l.color, 'data-reveal': '' },
          h('div', { class: 'wrap band__in' },
            h('div', { class: 'specimen' }, h('div', { class: 'specimen__img', html: FOSSIL[l.fossil] || '' }), h('p', { class: 'specimen__tag' }, l.era)),
            h('div', { class: 'band__text' }, h('h3', {}, l.name), h('p', {}, l.note))))));
  }
  function buildNotebook(c) {
    return h('div', { class: 'notebook' }, h('div', { class: 'wrap' }, h('div', { class: 'page' },
      h('h3', {}, c.shelfTitle),
      h('ul', { class: 'also' }, c.also.map(x => h('li', {}, x))),
      h('p', { class: 'aside' }, c.mathNote),
      h('h3', {}, c.howTitle),
      c.howIWork.map(t => h('p', {}, t)))));
  }
  function renderNotes(c) {
    $('#notes').append(h('div', { class: 'wrap' }, head(c.no, c.title, c.blurb)), buildSky(c.sky), buildStrata(c.strata), buildNotebook(c));
  }

  /* =====================  04 PROFILE  ===================== */
  function renderProfile(c) {
    const panel = (key, ...kids) => h('div', { class: 'panel', role: 'tabpanel', id: 'panel-' + key, 'aria-labelledby': 'tab-' + key }, kids);

    const w = c.watch;
    const watch = panel('watch',
      h('h3', {}, w.title),
      h('div', { class: 'meter', role: 'img', 'aria-label': w.split.map(s => s.pct + '% ' + s.label).join(', ') },
        w.split.map(s => h('span', { style: 'flex:' + s.pct, title: s.label }, s.pct + '% ' + s.label))),
      h('p', {}, w.note),
      h('ul', { class: 'stubs' }, w.genres.map(g => h('li', { class: 'stub' }, g))));

    const p = c.play;
    const play = panel('play', h('h3', {}, p.title), p.blurb && h('p', { class: 'panel__blurb' }, p.blurb),
      p.groups.map(g => h('div', { class: 'group' }, h('h3', {}, g.title),
        h('ul', { class: 'carts' }, g.games.map(x => h('li', { class: 'cart' },
          x.main && h('span', { class: 'cart__flag' }, 'MAIN'),
          h('span', { class: 'cart__name' }, x.name),
          x.note && h('span', { class: 'cart__note' }, x.note)))))));

    const sp = c.speak;
    const speak = panel('speak', h('h3', {}, sp.title), sp.blurb && h('p', { class: 'panel__blurb' }, sp.blurb),
      h('ul', { class: 'langs' }, sp.langs.map(l => h('li', { class: 'lang' },
        h('div', {}, h('strong', {}, l.name), l.note && h('p', { class: 'lang__note' }, l.note)),
        h('div', { class: 'xp', 'aria-hidden': 'true' }, Array.from({ length: 10 }, (_, i) => h('i', { class: i < l.level ? 'on' : '' }))),
        h('span', { class: 'lang__lv' }, l.label)))));

    const sd = c.side;
    const side = panel('side', h('h3', {}, sd.title), sd.blurb && h('p', { class: 'panel__blurb' }, sd.blurb),
      sd.groups.map(g => h('div', { class: 'group' }, h('h3', {}, g.title), h('ul', { class: 'stubs' }, g.items.map(i => h('li', { class: 'stub' }, i))))),
      sd.note && h('p', { class: 'group' }, sd.note));

    const tabs = [['watch', 'Watch', watch], ['play', 'Play', play], ['speak', 'Speak', speak], ['side', 'Side quests', side]];
    const list = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Profile sections' });
    const btns = tabs.map(([k, label], i) =>
      h('button', { class: 'tab', role: 'tab', type: 'button', id: 'tab-' + k, 'aria-controls': 'panel-' + k, 'aria-selected': String(i === 0), tabindex: i === 0 ? '0' : '-1' }, label));
    const select = (i) => btns.forEach((b, j) => {
      b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; tabs[j][2].hidden = i !== j;
    });
    btns.forEach((b, i) => {
      b.addEventListener('click', () => select(i));
      b.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
        btns[n].focus(); select(n);
      });
    });
    list.append(...btns);
    $('#profile').append(h('div', { class: 'wrap' }, head(c.no, c.title, c.blurb), list, tabs.map(t => t[2])));
    select(0);
  }

  /* =====================  05 CONTACT  ===================== */
  function linkRow(l) {
    if (l.soon) return h('div', { class: 'linkrow is-soon' }, h('span', { class: 'linkrow__k' }, l.label), h('span', { class: 'linkrow__v' }, l.value), h('span', { class: 'linkrow__t' }, 'SOON'));
    const ext = l.kind !== 'email';
    const a = h('a', { class: 'linkrow', href: l.href, target: ext ? '_blank' : null, rel: ext ? 'noopener noreferrer' : null },
      h('span', { class: 'linkrow__k' }, l.label), h('span', { class: 'linkrow__v' }, l.value));
    if (ext) return a;
    const copy = h('button', {
      class: 'copy', type: 'button', 'aria-label': 'Copy email address',
      onclick: async () => { try { await navigator.clipboard.writeText(l.value); toast('Email copied.'); } catch (e) { toast(l.value); } }
    }, 'Copy');
    return h('div', { class: 'linkrow-wrap' }, a, copy);
  }
  function renderContact(c, names) {
    $('#contact').append(h('div', { class: 'wrap' },
      h('div', { class: 'card' },
        h('span', { class: 'card__badge' }, names.primary + ' / ' + names.alt),
        h('div', {}, h('h2', {}, c.title), h('p', {}, c.blurb)),
        h('div', { class: 'links' }, c.links.map(linkRow))),
      h('footer', { class: 'foot' },
        h('p', {}, 'Built by hand with HTML, CSS and a little JavaScript. No framework.'),
        h('p', {}, '© ' + new Date().getFullYear() + ' ' + names.full))));
  }

  /* ---------- render everything ---------- */
  renderHello(S.hello);
  renderSchool(S.school);
  renderNotes(S.notes);
  renderProfile(S.profile);
  renderContact(S.contact, S.hello.names);

  /* =====================  behaviour  ===================== */
  // active section drives dock colours + current link
  const links = $$('#dockList a');
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (!e.isIntersecting) return;
    document.body.dataset.theme = e.target.dataset.theme;
    links.forEach(a => a.getAttribute('href') === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section').forEach(s => io.observe(s));

  // scroll progress
  const bar = $('#progress'); let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0).toFixed(4) + ')'; ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // gentle reveal
  if (!reduce && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: 0.15 });
    $$('[data-reveal]').forEach(n => { n.classList.add('rv'); ro.observe(n); });
  }

  // draggable stickers (mouse only; touch keeps normal scrolling)
  if (matchMedia('(pointer:fine)').matches) {
    $$('[data-drag]').forEach((el) => {
      let sx = 0, sy = 0, ox = 0, oy = 0, drag = false;
      el.addEventListener('pointerdown', (e) => { drag = true; sx = e.clientX - ox; sy = e.clientY - oy; el.setPointerCapture(e.pointerId); el.classList.add('is-drag'); });
      el.addEventListener('pointermove', (e) => { if (!drag) return; ox = e.clientX - sx; oy = e.clientY - sy; el.style.setProperty('--dx', ox + 'px'); el.style.setProperty('--dy', oy + 'px'); });
      const end = () => { drag = false; el.classList.remove('is-drag'); };
      el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    });
  }

  // sound: one delegated listener, character depends on the section
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button,a,[data-sfx]');
    if (!t || t.id === 'sfxToggle') return;
    if (t.closest('#player')) return Sfx.play('tick');
    const th = t.closest('[data-theme]');
    Sfx.play(th ? th.dataset.theme : 'tick');
  });
  const sfxBtn = $('#sfxToggle');
  sfxBtn.setAttribute('aria-pressed', String(Sfx.on));
  sfxBtn.addEventListener('click', () => {
    Sfx.set(!Sfx.on); sfxBtn.setAttribute('aria-pressed', String(Sfx.on));
    toast(Sfx.on ? 'Sound effects on.' : 'Sound effects off.', 1800);
    if (Sfx.on) Sfx.play('tick');
  });

  /* =====================  easter eggs  ===================== */
  // 1) tap the portrait five times
  let taps = 0, tapT;
  $('.hello__photo img').addEventListener('click', () => {
    taps++; clearTimeout(tapT); tapT = setTimeout(() => taps = 0, 1500);
    if (taps >= 5) { taps = 0; toast('One face, two names. This placeholder has both.', 5000); }
  });

  // 2) Konami code
  const code = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a']; let pos = 0;
  addEventListener('keydown', (e) => {
    pos = (e.key.toLowerCase() === code[pos]) ? pos + 1 : (e.key.toLowerCase() === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0; const m = $('main'); m.classList.add('is-flipped');
      toast('Cheat code accepted. Colours inverted for two seconds.', 3500);
      setTimeout(() => m.classList.remove('is-flipped'), 2000);
    }
  });

  // 3) a small creature, sometimes, somewhere
  const CRITTERS = [
    { svg: FOSSIL.trilobite, msg: 'A trilobite. The group lasted more than 250 million years before the end-Permian extinction.' },
    { svg: PLANET,           msg: "Saturn's rings are mostly water ice. Short fact, still a favourite." },
    { svg: BLOB,             msg: 'A wild pixel appeared. It has no stats and no quest. Please be kind to it.' }
  ];
  function spawnCritter() {
    const c = CRITTERS[Math.floor(Math.random() * CRITTERS.length)];
    const b = h('button', { class: 'critter', type: 'button', 'aria-label': 'A small hidden creature. Click it.', html: c.svg,
      style: 'left:' + (5 + Math.random() * 82).toFixed(1) + '%;top:' + (15 + Math.random() * 65).toFixed(1) + '%' });
    b.addEventListener('click', () => { toast(c.msg, 6500); b.remove(); });
    document.body.append(b);
    requestAnimationFrame(() => b.classList.add('on'));
    setTimeout(() => b.remove(), 12000);
  }
  setTimeout(() => { if (Math.random() < 0.6) spawnCritter(); }, 25000 + Math.random() * 45000);
})();