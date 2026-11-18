/* Music player: no autoplay, separate Play and Pause, Prev/Next,
   clickable bars that double as the seek bar. Tracks come from content.js. */
(function () {
  const root = document.getElementById('player');
  const cfg = (window.SITE && SITE.music) || { tracks: [] };
  const tracks = cfg.tracks || [];
  if (!root) return;
  if (!tracks.length) { root.hidden = true; return; }

  const $ = (s) => root.querySelector(s);
  const el = {
    fold: $('#plFold'), mini: $('#plMini'), cover: $('#plCover'), title: $('#plTitle'),
    artist: $('#plArtist'), time: $('#plTime'), viz: $('#plViz'),
    prev: $('#plPrev'), play: $('#plPlay'), pause: $('#plPause'), next: $('#plNext'), vol: $('#plVol')
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const folder = cfg.folder || 'assets/music/';
  const audio = new Audio();
  audio.preload = 'metadata';

  let idx = 0, raf = 0, last = 0, lit = -1, dragging = false;
  let ac = null, analyser = null, data = null, zeroFrames = 0;
  const N = window.innerWidth < 640 ? 20 : 30;

  /* ----- bars ----- */
  const bars = [];
  for (let i = 0; i < N; i++) {
    const idle = 0.28 + 0.55 * Math.abs(Math.sin(i * 1.37 + 0.6) * Math.cos(i * 0.53));
    const b = document.createElement('i');
    b.style.transform = 'scaleY(' + idle.toFixed(2) + ')';
    el.viz.append(b);
    bars.push({ el: b, idle });
  }
  function resetBars() { bars.forEach(b => b.el.style.transform = 'scaleY(' + b.idle.toFixed(2) + ')'); }

  /* ----- helpers ----- */
  const fmt = (t) => {
    if (!isFinite(t)) return '--:--';
    return Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
  };
  function updateTime() {
    el.time.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
    const r = audio.duration ? audio.currentTime / audio.duration : 0;
    const n = Math.round(r * N);
    if (n !== lit) {
      bars.forEach((b, i) => b.el.classList.toggle('on', i < n));
      lit = n;
      el.viz.setAttribute('aria-valuenow', Math.round(r * 100));
    }
  }
  function setState(playing) {
    root.classList.toggle('is-playing', playing);
    el.play.classList.toggle('is-active', playing);
    el.pause.classList.toggle('is-active', !playing);
  }

  /* ----- loading / transport ----- */
  function load(i, andPlay) {
    idx = (i + tracks.length) % tracks.length;
    const t = tracks[idx];
    audio.src = folder + encodeURIComponent(t.file);
    el.title.textContent = t.title;
    el.artist.textContent = t.artist;
    el.mini.textContent = t.title + ' · ' + t.artist;
    el.cover.innerHTML = t.cover
      ? '<img alt="" src="' + folder + encodeURIComponent(t.cover) + '">'
      : '<svg viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" fill="#2D3A2D"/><circle cx="18" cy="26" r="9" fill="none" stroke="#B8D8A0" stroke-width="3"/><circle cx="38" cy="26" r="9" fill="none" stroke="#B8D8A0" stroke-width="3"/><rect x="14" y="43" width="28" height="4" fill="#B8D8A0"/></svg>';
    lit = -1; updateTime();
    if ('mediaSession' in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: t.title, artist: t.artist });
    }
    if (andPlay) play();
  }

  function graph() {
    if (ac || reduce || !/^https?:$/.test(location.protocol)) return; // file:// would mute the audio
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ac = new AC();
      const src = ac.createMediaElementSource(audio);
      analyser = ac.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.7;
      src.connect(analyser); analyser.connect(ac.destination);
      data = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) { ac = null; analyser = null; }
  }
  function play() {
    graph();
    if (ac && ac.state === 'suspended') ac.resume();
    const p = audio.play();
    if (p && p.catch) p.catch(() => {});
  }
  function next() { const was = !audio.paused; load(idx + 1, was); }
  function prev() {
    if (audio.currentTime > 3 || tracks.length === 1) { audio.currentTime = 0; return; }
    const was = !audio.paused; load(idx - 1, was);
  }

  /* ----- visualizer loop (runs only while playing; ~25fps to stay light) ----- */
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (now - last < 40) return;
    last = now;
    let lv = null;
    if (analyser) {
      analyser.getByteFrequencyData(data);
      let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i];
      if (sum === 0) { if (++zeroFrames > 90) analyser = null; } else zeroFrames = 0;
      lv = data;
    }
    for (let i = 0; i < N; i++) {
      let v;
      if (lv) v = lv[Math.floor(i * lv.length / N)] / 255;
      else v = 0.85 * (0.5 + 0.5 * Math.sin(now / 180 + i * 0.9) * Math.sin(now / 410 + i * 0.37));
      bars[i].el.style.transform = 'scaleY(' + Math.max(bars[i].idle, v).toFixed(2) + ')';
    }
  }

  /* ----- events ----- */
  audio.addEventListener('loadedmetadata', updateTime);
  audio.addEventListener('timeupdate', updateTime);
  audio.addEventListener('play', () => { setState(true); if (!reduce && !raf) raf = requestAnimationFrame(frame); });
  audio.addEventListener('pause', () => { setState(false); cancelAnimationFrame(raf); raf = 0; resetBars(); });
  audio.addEventListener('ended', () => {
    if (tracks.length > 1) load(idx + 1, true);
    else { audio.currentTime = 0; updateTime(); }
  });
  audio.addEventListener('error', () => {
    el.title.textContent = 'File not found';
    el.artist.textContent = 'Check assets/music/ and content.js';
    el.mini.textContent = 'File not found';
  });

  el.play.addEventListener('click', play);
  el.pause.addEventListener('click', () => audio.pause());
  el.next.addEventListener('click', next);
  el.prev.addEventListener('click', prev);

  el.fold.addEventListener('click', () => {
    const folded = root.classList.toggle('is-folded');
    el.fold.setAttribute('aria-expanded', String(!folded));
    el.fold.setAttribute('aria-label', folded ? 'Open music player' : 'Close music player');
  });

  /* seek: click or drag on bars, arrow keys when focused */
  function seekFrom(e) {
    const r = el.viz.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    if (isFinite(audio.duration)) audio.currentTime = x * audio.duration;
  }
  el.viz.addEventListener('pointerdown', (e) => { dragging = true; el.viz.setPointerCapture(e.pointerId); seekFrom(e); });
  el.viz.addEventListener('pointermove', (e) => { if (dragging) seekFrom(e); });
  el.viz.addEventListener('pointerup', () => { dragging = false; });
  el.viz.addEventListener('pointercancel', () => { dragging = false; });
  el.viz.addEventListener('keydown', (e) => {
    if (!isFinite(audio.duration)) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    else if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    else if (e.key === 'Home') audio.currentTime = 0;
    else if (e.key === 'End') audio.currentTime = audio.duration;
    else return;
    e.preventDefault();
  });

  /* volume (remembered) */
  let vol = 0.7;
  try { const v = parseFloat(localStorage.getItem('shenka.vol')); if (!isNaN(v)) vol = v; } catch (e) {}
  audio.volume = vol; el.vol.value = vol;
  el.vol.addEventListener('input', () => {
    audio.volume = parseFloat(el.vol.value);
    try { localStorage.setItem('shenka.vol', el.vol.value); } catch (e) {}
  });

  /* lock-screen / keyboard media keys */
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', play);
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('previoustrack', prev);
      navigator.mediaSession.setActionHandler('nexttrack', next);
    } catch (e) {}
  }

  /* start folded on small screens, open on desktop. Never autoplay. */
  load(0, false);
  setState(false);
})();