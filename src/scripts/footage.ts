// Footage: lazy-loaded muted loops. Sources come from Mux (HLS) when a playback ID is set,
// otherwise from the stand-in MP4 in /media. Framed clips (.cam) only play while "live":
// the one nearest the middle of the screen, or the one under the cursor.

type Footage = {
  v: HTMLVideoElement;
  visible: boolean;
  gate: null | (() => boolean);
  cam: boolean;
  live: boolean;
  loaded: boolean;
  hls?: { destroy(): void };
};

declare global {
  interface Window {
    __hold?: boolean;
    SP?: { footage: Map<HTMLVideoElement, Footage>; swap: (v: HTMLVideoElement, from: HTMLElement) => void; repick: () => void; attach: typeof attach };
  }
}

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const portrait = innerWidth <= 760 && innerHeight > innerWidth;
let hlsMod: Promise<any> | null = null;
const getHls = () => (hlsMod ||= import('hls.js/light').then((m) => m.default));

export function attach(v: HTMLVideoElement, mux: string | undefined, src: string | undefined, opts: { full?: boolean } = {}) {
  return new Promise<{ destroy(): void } | undefined>((resolve) => {
    if (mux) {
      const url = `https://stream.mux.com/${mux}.m3u8`;
      // Prefer hls.js (MediaSource) whenever it's supported — this is hls.js's own
      // recommended order. Checking canPlayType() first is unreliable: some Chromium
      // builds report (false) support for application/vnd.apple.mpegurl, which sets
      // a raw .m3u8 as the video src and fails with "no supported sources".
      getHls().then((Hls) => {
        if (Hls.isSupported()) {
          const h = new Hls(opts.full
            ? { capLevelToPlayerSize: true }
            : { capLevelToPlayerSize: true, maxBufferLength: 10, maxMaxBufferLength: 20 });
          h.loadSource(url);
          h.attachMedia(v);
          resolve(h);
        } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
          v.src = url; resolve(undefined);
        } else {
          resolve(undefined);
        }
      });
    } else if (src) {
      v.src = src;
      resolve(undefined);
    } else resolve(undefined);
  });
}

const F = new Map<HTMLVideoElement, Footage>();

function load(f: Footage) {
  if (f.loaded) return;
  f.loaded = true;
  const d = f.v.dataset;
  const mux = (portrait && d.muxPortrait) || d.mux;
  const src = (portrait && d.srcPortrait) || d.src;
  if (portrait && d.posterPortrait) f.v.poster = d.posterPortrait;
  f.v.muted = true;
  f.v.preload = 'auto';
  attach(f.v, mux, src).then((h) => { f.hls = h; });
}

function swap(v: HTMLVideoElement, from: HTMLElement) {
  const f = F.get(v);
  if (!f) return;
  const d = from.dataset;
  if (v.dataset.key === d.key) return;
  f.hls?.destroy(); f.hls = undefined;
  v.dataset.key = d.key || '';
  v.dataset.mux = d.mux || '';
  v.dataset.src = d.src || '';
  if (d.poster) v.poster = d.poster;
  f.loaded = false;
  load(f);
}

document.querySelectorAll<HTMLVideoElement>('video.footage').forEach((v) => {
  F.set(v, { v, visible: false, gate: null, cam: false, live: false, loaded: false });
});

const io = new IntersectionObserver((es) => {
  es.forEach((e) => {
    const f = F.get(e.target as HTMLVideoElement);
    if (f) { f.visible = e.isIntersecting; if (f.visible) load(f); }
  });
}, { rootMargin: '300px' });
F.forEach((_, v) => io.observe(v));

function sync() {
  F.forEach((f) => {
    const want = f.visible && !reduce && !window.__hold && (!f.gate || f.gate()) && (!f.cam || f.live);
    if (want && f.v.paused) { const p = f.v.play(); if (p && p.catch) p.catch(() => {}); }
    else if (!want && !f.v.paused) f.v.pause();
  });
}

const cams = Array.from(document.querySelectorAll<HTMLElement>('.cam')).flatMap((el) => {
  const v = el.querySelector<HTMLVideoElement>('video.footage');
  const f = v && F.get(v);
  if (!f) return [];
  f.cam = true;
  return [{ el, f }];
});
let hoverCam: (typeof cams)[number] | null = null;
cams.forEach((c) => {
  c.el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hoverCam = c; });
  c.el.addEventListener('pointerleave', () => { if (hoverCam === c) hoverCam = null; });
});
function pickLive() {
  const vh = innerHeight, vw = innerWidth;
  let best: (typeof cams)[number] | null = null, bd = 1e9;
  cams.forEach((c) => {
    if (!c.f.visible || c.el.hidden || c.el.closest('[hidden]')) return;
    const r = c.el.getBoundingClientRect();
    if (r.bottom < vh * 0.12 || r.top > vh * 0.88 || r.right < 0 || r.left > vw) return;
    const d = Math.hypot(r.left + r.width / 2 - vw / 2, r.top + r.height / 2 - vh / 2);
    if (d < bd) { bd = d; best = c; }
  });
  if (hoverCam && hoverCam.f.visible && !hoverCam.el.hidden) best = hoverCam;
  cams.forEach((c) => {
    const on = c === best;
    if (c.f.live !== on) { c.f.live = on; c.el.classList.toggle('live', on); }
  });
}

// Timecode at 25 fps; framed clips only run theirs while live
const tcs = Array.from(document.querySelectorAll<HTMLElement>('[data-tc]')).map((el) => ({ el, off: +(el.dataset.tcOff || 0), cam: el.closest('.cam') }));
const tc = (fr: number) => [Math.floor(fr / 90000), Math.floor(fr / 1500) % 60, Math.floor(fr / 25) % 60, fr % 25].map((n) => (n < 10 ? '0' : '') + n).join(':');

let last = -1e9, lastPick = 0;
function frame(now: number) {
  requestAnimationFrame(frame);
  if (now - last < 33) return;
  last = now;
  if (now - lastPick > 180) { lastPick = now; pickLive(); }
  sync();
  if (!reduce && !window.__hold) {
    const base = Math.floor(now / 40) + 90000 + 308;
    tcs.forEach((x) => { if (x.cam && !x.cam.classList.contains('live')) return; x.el.textContent = tc(base + x.off); });
  }
}
requestAnimationFrame(frame);

window.SP = { footage: F, swap, repick: () => { lastPick = 0; }, attach };
