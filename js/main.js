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
    for (const kid of kids.flat(Infinity)) {
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
    try { on = localStorage.getItem('shenka.sfx') !== 'off'; } catch (e) { }
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
      hello: () => tone({ type: 'square', f: 150, f2: 55, d: 0.1, v: 0.08 }),
      school: () => noise(0.07, 0.35, 1800),
      projects: () => { noise(0.05, 0.3, 900); tone({ type: 'triangle', f: 180, f2: 110, d: 0.09, v: 0.08 }); },
      notes: () => { tone({ type: 'sine', f: 880, d: 0.35, v: 0.05 }); tone({ type: 'sine', f: 1320, d: 0.3, v: 0.025, t: 0.04 }); },
      profile: () => { tone({ type: 'square', f: 523, d: 0.06, v: 0.035 }); tone({ type: 'square', f: 784, d: 0.08, v: 0.035, t: 0.06 }); },
      contact: () => tone({ type: 'triangle', f: 392, f2: 523, d: 0.12, v: 0.07 }),
      tick: () => tone({ type: 'square', f: 1000, f2: 700, d: 0.03, v: 0.03 })
    };
    return {
      get on() { return on; },
      set(v) { on = v; try { localStorage.setItem('shenka.sfx', v ? 'on' : 'off'); } catch (e) { } },
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

  /* =====================  03 PROJECTS  ===================== */
  function renderProjects(c) {
    const boxes = c.items.map((p, i) => {
      const id = 'box-' + i;
      const rows = [p.summary && ['What it is', p.summary], p.role && ['My part', p.role]].filter(Boolean);
      const links = (p.links || []).filter(l => l.href);
      const stack = p.stack || [];
      const has = rows.length || stack.length || links.length;

      const more = has && h('div', { class: 'box__more', id }, h('div', {},
        h('div', { class: 'box__inside' },
          rows.map(([k, v]) => h('p', {}, h('b', {}, k + ': '), v)),
          stack.length > 0 && h('ul', { class: 'box__stack', 'aria-label': 'Built with' }, stack.map(s => h('li', {}, s))),
          links.length > 0 && h('div', { class: 'box__links' },
            links.map(l => h('a', { class: 'box__link', href: l.href, target: '_blank', rel: 'noopener noreferrer' }, l.label))))));

      const btn = has && h('button', {
        class: 'box__open', type: 'button', 'aria-expanded': 'false', 'aria-controls': id,
        onclick: (e) => {
          const b = e.currentTarget, open = b.closest('.box').classList.toggle('is-open');
          b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Close box' : 'Open box';
        }
      }, 'Open box');

      const initials = p.name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
      const cover = h('div', { class: 'box__cover' },
        p.kind && h('span', { class: 'box__kind' }, p.kind),
        p.image
          ? h('img', { src: p.image, alt: p.imageAlt || '', loading: 'lazy', decoding: 'async' })
          : h('span', { class: 'box__ph', 'aria-hidden': 'true' }, initials));

      return h('article', { class: 'box', 'data-reveal': '' },
        cover,
        h('div', { class: 'box__body' },
          p.year && h('p', { class: 'box__year' }, p.year),
          h('h3', { class: 'box__name' }, p.name),
          p.tagline && h('p', { class: 'box__tag' }, p.tagline),
          btn, more));
    });
    $('#projects').append(h('div', { class: 'wrap' }, head(c.no, c.title, c.blurb), h('div', { class: 'boxes' }, boxes)));
  }

  /* =====================  03 FIELD NOTES  ===================== */
  function buildSky(c) {
    const svg = svgEl('svg', { viewBox: '0 0 300 340', class: 'sky__svg', role: 'group', 'aria-label': 'Orion constellation, interactive' });
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 46; i++) {
      const tw = i < 7;   // the first 7 background stars twinkle
      const a = { cx: (rnd() * 300).toFixed(1), cy: (rnd() * 340).toFixed(1), r: (rnd() * 1.1 + 0.3).toFixed(2), fill: '#F2E9C9', opacity: (rnd() * 0.5 + 0.2).toFixed(2) };
      if (tw) { a.class = 'tw'; a.style = '--d:' + (3 + (i % 4)) + 's;--dl:-' + (i * 0.9).toFixed(1) + 's'; }
      svg.append(svgEl('circle', a));
    }
    c.lines.forEach(([a, b]) => {
      const A = c.stars[a], B = c.stars[b];
      svg.append(svgEl('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: 'sky__line' }));
    });
    const note = h('div', { class: 'sky__note', 'aria-live': 'polite' }, h('p', {}, 'Tap a star.'));
    const gs = c.stars.map((s, i) => {
      const g = svgEl('g', { class: 'sky__star', tabindex: '0', role: 'button', 'aria-label': s.name, 'data-sfx': '' });
      g.append(svgEl('circle', { cx: s.x, cy: s.y, r: 15, fill: 'transparent' }));
            g.append(svgEl('circle', { class: 'dot' + ([0, 3, 6].includes(i) ? ' tw' : ''), cx: s.x, cy: s.y, r: s.r, style: '--d:' + (4 + i) + 's;--dl:-' + i + 's' }));
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
    /* ----- 3D specimens (Field notes) ----- */
  const hoverable = matchMedia('(hover: hover) and (pointer: fine)').matches;
    let decoderSet = false;
  function viewerReady() {
    const ready = customElements.get('model-viewer')
      ? Promise.resolve(true)
      : Promise.race([
          customElements.whenDefined('model-viewer').then(() => true),
          new Promise(r => setTimeout(() => r(false), 8000))
        ]);
    return ready.then((ok) => {
      if (ok && !decoderSet) {
        decoderSet = true;   // teach model-viewer how to read meshopt-compressed files
        try { customElements.get('model-viewer').meshoptDecoderLocation = 'https://cdn.jsdelivr.net/npm/meshoptimizer@0.18.1/meshopt_decoder.js'; } catch (e) {}
      }
      return ok;
    });
  }
  function creditEl(m) {
    const a = (href, text) => h('a', { href, target: '_blank', rel: 'noopener noreferrer' }, text);
    return h('p', { class: 'credit' }, '“', a(m.source, m.title), '” by ', a(m.authorUrl, m.author),
      m.also && [' with scan by ', a(m.also.url, m.also.label)], ', ', a(m.licenseUrl, m.license),
      '. Modified: ' + (m.modified || 'compressed for web') + '.');
  }
  function makeViewer(m, big) {
    const v = document.createElement('model-viewer');
    const set = (k, val) => v.setAttribute(k, val === true ? '' : val);
    set('alt', m.alt || '');
    set('camera-orbit', m.orbit || '0deg 75deg 105%');
    set('interaction-prompt', 'none');
    set('shadow-intensity', m.shadow != null ? m.shadow : '0.7');
    set('exposure', m.exposure || '1');
    set('environment-image', 'neutral');
    set('rotation-per-second', '24deg');
    set('auto-rotate-delay', big ? '2500' : '0');
    set('disable-pan', true);
    if (m.poster) set('poster', m.poster);
    if (big) {
      const z = m.zoom || ['25%', '300%'];
      set('camera-controls', true);
      set('touch-action', 'none');
      set('min-camera-orbit', 'auto auto ' + z[0]);
      set('max-camera-orbit', 'auto auto ' + z[1]);
      if (!reduce) set('auto-rotate', true);
    } else set('disable-zoom', true);          // card: no controls, so the page keeps scrolling
    return v;
  }

  // modal
  const modal = $('#modal'), stage = $('#mdStage');
  let lastFocus = null, modalT = 0, openTok = 0;
  function openModal(l, trigger) {
    clearTimeout(modalT);
    const tok = ++openTok; lastFocus = trigger;
    $$('.vit').forEach(v => v._set && v._set(false));
    $('#mdEra').textContent = l.era; $('#mdTitle').textContent = l.name; $('#mdNote').textContent = l.note;
    $('#mdCredit').replaceChildren(creditEl(l.model));
    stage.replaceChildren(h('span', { class: 'modal__load' }, 'Loading 3D'));
    stage.style.background = l.model.bg || '';
    modal.hidden = false; document.documentElement.classList.add('modal-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    $('#mdClose').focus();
    viewerReady().then((ok) => {
      if (tok !== openTok) return;
      const fail = () => stage.replaceChildren(h('span', { class: 'modal__load' }, '3D preview unavailable'));
      if (!ok) return fail();
      const v = makeViewer(l.model, true);
      v.addEventListener('load', () => {
        const ld = stage.querySelector('.modal__load'); if (ld) ld.remove();
        if (!reduce && l.model.animate !== false && v.availableAnimations && v.availableAnimations.length) v.play({ repetitions: Infinity });
      });
      v.addEventListener('error', fail);
      stage.append(v);
      v.setAttribute('src', l.model.src);
    });
  }
  function closeModal() {
    if (modal.hidden) return;
    ++openTok; modal.classList.remove('is-open');
    modalT = setTimeout(() => { modal.hidden = true; stage.replaceChildren(); document.documentElement.classList.remove('modal-open'); }, reduce ? 0 : 220);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]') || e.target.closest('#mdClose')) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') return closeModal();
    if (e.key !== 'Tab') return;
    const f = $$('button, a[href], model-viewer[camera-controls]', modal);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // cards
  let currentVit = null;
  const near = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { o.unobserve(e.target); e.target._init(); } }), { rootMargin: '400px 0px' });
  const seen = new IntersectionObserver((es) => es.forEach(e => { if (!e.isIntersecting) e.target._set(false); }), { threshold: 0.15 });

  function buildVitrine(l) {
    const m = l.model;
    const el = h('div', { class: 'vit', role: 'button', tabindex: '0', 'data-sfx': '', 'aria-label': 'Open 3D view of ' + l.name },
      h('span', { class: 'vit__ph' }, 'Loading 3D'),
      h('span', { class: 'vit__badge', 'aria-hidden': 'true' }, '3D'),
      h('span', { class: 'vit__hint', 'aria-hidden': 'true' },
        h('span', { class: 'hov' }, 'Hover to spin · click to enlarge'),
        h('span', { class: 'tap' }, 'Tap to spin · tap again to enlarge')),
      h('span', { class: 'vit__fail' }, '3D preview unavailable'));
    // MBG AOWKAOKWAOWAKOAKWOWKKOKOAKWOK
    if (m.bg) el.style.background = m.bg;
    if (m.light) el.classList.add('is-light');
    let viewer = null, active = false;

    const apply = () => {
      if (!viewer) return;
      viewer.autoRotate = active && !reduce;
      if (m.animate !== false && viewer.availableAnimations && viewer.availableAnimations.length) {
        if (active && !reduce) viewer.play({ repetitions: Infinity }); else viewer.pause();
      }
    };
    el._set = (on) => {
      if (on === active) return;
      if (on && currentVit && currentVit !== el) currentVit._set(false);   // only one spins at a time
      active = on; el.classList.toggle('is-active', on);
      currentVit = on ? el : (currentVit === el ? null : currentVit);
      apply();
    };
    el._init = () => viewerReady().then((ok) => {
      if (!ok) return el.classList.add('is-failed');
      viewer = makeViewer(m, false);
      viewer.addEventListener('load', () => { el.classList.add('is-ready'); apply(); });
      viewer.addEventListener('error', () => el.classList.add('is-failed'));
      el.prepend(viewer);
      viewer.setAttribute('src', m.src);
    });

    if (hoverable) {
      el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') el._set(true); });
      el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') el._set(false); });
    }
    // desktop: hover already woke it, so a click enlarges. touch: first tap wakes it, second enlarges.
    el.addEventListener('click', () => { if (!hoverable && !active) el._set(true); else openModal(l, el); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(l, el); } });
    el.addEventListener('focus', () => { if (el.matches(':focus-visible')) el._set(true); });
    el.addEventListener('blur', () => el._set(false));
    near.observe(el); seen.observe(el);
    return el;
  }

  function buildStrata(c) {
    return h('div', { class: 'strata' },
      h('div', { class: 'wrap strata__head' }, h('h3', {}, c.title), h('p', {}, c.blurb)),
      c.layers.map((l, i, arr) =>
        h('div', { class: 'band' + (i === arr.length - 1 ? ' band--dark' : '') + (i % 2 ? ' band--flip' : ''), style: '--c:' + l.color, 'data-reveal': '' },
          h('div', { class: 'wrap band__in' },
            buildVitrine(l),
            h('div', { class: 'band__text' }, h('p', { class: 'band__era' }, l.era), h('h3', {}, l.name), h('p', {}, l.note), creditEl(l.model))))));
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
  /* ----- card stacks (Play tab) ----- */
  const STACK_PALETTE = ['#3DFFB5', '#FFE45E', '#FF4D8D'];
  let lastStart = -1;
  // random colours per stack: no two neighbours match (including last -> first when the deck loops),
  // and a stack never starts with the same colour as the stack before it
  function pickColors(n) {
    let first;
    do { first = Math.floor(Math.random() * 3); } while (first === lastStart);
    lastStart = first;
    const seq = [first];
    for (let i = 1; i < n; i++) {
      const opts = [0, 1, 2].filter(c => c !== seq[i - 1] && !(i === n - 1 && n > 2 && c === seq[0]));
      seq.push(opts[Math.floor(Math.random() * opts.length)]);
    }
    return seq;
  }
  const STACK_OUT = 'translate(62%,-16%) rotate(14deg)';
  const initials = (name) => name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  // messy-pile pose by depth: top card is nearly straight, the ones beneath peek out at odd angles
  const pose = (d) => {
    if (d === 0) return 'translate(0px,0px) rotate(-2deg)';
    const rot = ((d * 7) % 9 - 4) * 2.2, dx = ((d * 5) % 7 - 3) * 3, dy = ((d * 3) % 5 - 2) * 3;
    return 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg)';
  };

  function buildStack(g) {
    const n = g.games.length;
    const colors = pickColors(n);
    const cards = g.games.map((x, i) => {
      const face = h('span', { class: 'sc__face' });
      const fallback = () => face.replaceChildren(h('span', { class: 'sc__ph' }, initials(x.name)));
      if (x.icon) {
        const img = h('img', { src: x.icon, alt: '', draggable: 'false', decoding: 'async' });
        img.addEventListener('error', fallback);
        face.append(img);
      } else fallback();
      return h('span', { class: 'sc', style: '--c:' + STACK_PALETTE[colors[i]] },
        face, x.main && h('span', { class: 'sc__flag' }, 'MAIN'));
    });
    const describe = (x) => g.title + ': ' + x.name + (x.note ? ' (' + x.note + ')' : '');

    if (n === 1) {
      cards[0].style.transform = pose(0);
      return h('div', { class: 'stack is-single', role: 'img', 'aria-label': describe(g.games[0]) }, cards);
    }

    const count = h('span', { class: 'stack__count', 'aria-hidden': 'true' });
    const btn = h('button', { class: 'stack', type: 'button' }, cards, count);
    let order = cards.slice(), busy = false;

    const layout = () => {
      order.forEach((c, d) => {
        c.style.zIndex = n - d;
        c.style.transform = pose(Math.min(d, 3));
        c.style.opacity = d > 3 ? 0 : 1;
        c.classList.toggle('is-top', d === 0);
      });
      const cur = cards.indexOf(order[0]);
      count.textContent = (cur + 1) + '/' + n;
      btn.setAttribute('aria-label', describe(g.games[cur]) + ', ' + (cur + 1) + ' of ' + n + '. Press for the next one.');
    };

    btn.addEventListener('click', () => {
      if (busy) return; busy = true;
      const top = order[0], from = pose(0), dur = reduce ? 0 : 520;
      // fly right if there is room before the screen edge, otherwise fly left
      const r = btn.getBoundingClientRect();
      const dir = (r.right + r.width * 1.15 > window.innerWidth) ? -1 : 1;
      btn.classList.add('is-busy');
      order.push(order.shift());
      layout();
      top.style.zIndex = n + 1;
      top.style.opacity = 1;
      const to = top.style.transform;
      const finish = () => {
        top.classList.remove('is-flying'); btn.classList.remove('is-busy');
        top.style.zIndex = 1; top.style.opacity = (n - 1 > 3) ? 0 : 1; busy = false;
      };
      if (!dur) return finish();
      top.classList.add('is-flying');
      const anim = top.animate([
        { transform: from, offset: 0, easing: 'cubic-bezier(.2,.75,.3,1)' },
        { transform: 'translate(' + (dir * 108) + '%,-10%) rotate(' + (dir * 13) + 'deg)', offset: .4, easing: 'cubic-bezier(.55,0,.3,1)' },
        { transform: to, offset: 1 }
      ], { duration: dur });
      setTimeout(() => { top.style.zIndex = 1; }, dur * 0.4);
      anim.onfinish = finish; anim.oncancel = finish;
    });

    layout();
    return btn;
  }
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
      h('div', { class: 'stacks' }, p.groups.map(g => buildStack(g))));

    const sp = c.speak;
    const speak = panel('speak', h('h3', {}, sp.title), sp.blurb && h('p', { class: 'panel__blurb' }, sp.blurb),
      h('ul', { class: 'langs' }, sp.langs.map(l => h('li', { class: 'lang' },
        h('div', {}, h('strong', {}, l.name), l.note && h('p', { class: 'lang__note' }, l.note)),
        h('div', { class: 'xp', 'aria-hidden': 'true' }, Array.from({ length: 10 }, (_, i) => h('i', { class: i < l.level ? 'on' + (i === l.level - 1 ? ' last' : '') : '' }))),
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

    // heading letters hop in 8-bit steps
    const t = $('#profile h2'), txt = t.textContent;
    t.setAttribute('aria-label', txt);
    t.replaceChildren(...[...txt].map((ch, i) => h('span', { class: 'hop', 'aria-hidden': 'true', style: '--i:' + i }, ch === ' ' ? '\u00A0' : ch)));
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
        h('p', {}, 'Built with HTML, CSS and a little JavaScript. No framework.'),
        h('p', {}, '© ' + new Date().getFullYear() + ' ' + names.full))));
  }

  /* ---------- render everything ---------- */
  renderHello(S.hello);
  renderSchool(S.school);
  if (S.projects) renderProjects(S.projects);
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

  // pause CSS animations of sections that are off-screen
  const live = new IntersectionObserver((es) => es.forEach(e => e.target.classList.toggle('is-off', !e.isIntersecting)), { rootMargin: '80px 0px' });
  $$('main > section').forEach(s => { s.classList.add('is-off'); live.observe(s); });

  // scroll progress
  const bar = $('#progress'); let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0).toFixed(4) + ')';
      dockScroll();
      ticking = false;
    });
  }
  // dock: hide while scrolling down, return on scroll up
  const dock = $('#dock'); let lastY = scrollY, dockHidden = false;
  function dockScroll() {
    const y = scrollY, dy = y - lastY;
    if (Math.abs(dy) < 8) return;                                   // ignore tiny jitters
    const hide = dy > 0 && y > 120 && !dock.querySelector(':focus-visible');
    if (hide !== dockHidden) { dockHidden = hide; dock.classList.toggle('is-hidden', hide); }
    lastY = y;
  }
  dock.addEventListener('focusin', () => { dockHidden = false; dock.classList.remove('is-hidden'); });
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
  const code = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']; let pos = 0;
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
    { svg: PLANET, msg: "Saturn's rings are mostly water ice. Short fact, still a favourite." },
    { svg: BLOB, msg: 'A wild pixel appeared. It has no stats and no quest. Please be kind to it.' }
  ];
  function spawnCritter() {
    const c = CRITTERS[Math.floor(Math.random() * CRITTERS.length)];
    const b = h('button', {
      class: 'critter', type: 'button', 'aria-label': 'A small hidden creature. Click it.', html: c.svg,
      style: 'left:' + (5 + Math.random() * 82).toFixed(1) + '%;top:' + (15 + Math.random() * 65).toFixed(1) + '%'
    });
    b.addEventListener('click', () => { toast(c.msg, 6500); b.remove(); });
    document.body.append(b);
    requestAnimationFrame(() => b.classList.add('on'));
    setTimeout(() => b.remove(), 12000);
  }
  setTimeout(() => { if (Math.random() < 0.6) spawnCritter(); }, 25000 + Math.random() * 45000);
})();