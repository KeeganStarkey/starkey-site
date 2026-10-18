import './footage';
// Homepage: hero closes into a camera frame on scroll, statement lights word by word,
// services light the footage behind them, the retainer month scrolls sideways, work filter.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const noHover = matchMedia('(hover: none)').matches;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const $ = (id: string) => document.getElementById(id)!;

/* Hero */
const hPin = $('h-pin'), hStage = $('h-stage'), hFoot = $('h-foot'), hAfter = $('h-after');
function heroUpdate() {
  if (reduce) return;
  const r = hPin.getBoundingClientRect(), span = r.height - innerHeight, p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
  hStage.style.setProperty('--e', smooth(0.06, 0.82, p).toFixed(4));
  hStage.style.setProperty('--x', smooth(0, 0.55, p).toFixed(4));
  hStage.style.setProperty('--f', smooth(0, 0.22, p).toFixed(4));
  hStage.style.setProperty('--m', smooth(0.5, 0.82, p).toFixed(4));
  const a = smooth(0.72, 0.94, p);
  hStage.style.setProperty('--a', a.toFixed(4));
  hFoot.classList.toggle('off', p > 0.15);
  hAfter.classList.toggle('on', a > 0.5);
  hFoot.querySelectorAll('button,a').forEach((el) => ((el as HTMLElement).tabIndex = p > 0.15 ? -1 : 0));
  hAfter.querySelectorAll('button,a').forEach((el) => ((el as HTMLElement).tabIndex = a > 0.5 ? 0 : -1));
}

/* Statement lights up word by word */
const posTxt = $('pos-txt');
const words: HTMLElement[] = [];
(() => {
  const parts = (posTxt.textContent || '').trim().split(/\s+/);
  posTxt.textContent = '';
  const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = parts.join(' ');
  posTxt.appendChild(sr);
  parts.forEach((w, i) => {
    const s = document.createElement('span'); s.className = 'w'; s.textContent = w; s.setAttribute('aria-hidden', 'true');
    posTxt.appendChild(s);
    if (i < parts.length - 1) posTxt.appendChild(document.createTextNode(' '));
    words.push(s);
  });
})();
function posUpdate() {
  if (reduce) { words.forEach((w) => w.classList.add('on')); return; }
  const r = posTxt.getBoundingClientRect(), vh = innerHeight, p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.35), 0, 1), n = Math.round(p * words.length * 1.08);
  words.forEach((w, i) => w.classList.toggle('on', i < n));
}

/* Services light the footage behind them */
const svc = $('services');
const sv = svc.querySelector<HTMLVideoElement>('video.footage')!;
const sF = window.SP?.footage.get(sv);
if (sF) sF.gate = () => noHover || svc.classList.contains('lit');
svc.querySelectorAll<HTMLElement>('.row').forEach((b) => {
  const on = () => { window.SP?.swap(sv, b); svc.classList.add('lit'); };
  b.addEventListener('pointerenter', on); b.addEventListener('focus', on);
  b.addEventListener('blur', () => svc.classList.remove('lit'));
});
$('rows').addEventListener('pointerleave', () => svc.classList.remove('lit'));

/* Retainer month scrolls sideways while pinned */
const rPin = $('r-pin'), rView = $('r-view'), rTrack = $('r-track'), rProg = $('r-prog');
let rOver = 0, rMode: 'pin' | 'native' = 'native';
function retSetup() {
  if (reduce || innerWidth <= 760) { rMode = 'native'; rPin.style.height = ''; rTrack.style.transform = ''; return; }
  rMode = 'pin'; rTrack.style.transform = 'none';
  rOver = Math.max(0, rTrack.scrollWidth - rView.clientWidth);
  rPin.style.height = (Math.max(innerHeight, 640) + rOver) + 'px';
  retUpdate();
}
function retUpdate() {
  let p: number;
  if (rMode === 'pin') {
    const r = rPin.getBoundingClientRect(), span = r.height - Math.max(innerHeight, 640);
    p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
    rTrack.style.transform = 'translate3d(' + (-p * rOver).toFixed(1) + 'px,0,0)';
  } else {
    const max = rView.scrollWidth - rView.clientWidth; p = max > 0 ? rView.scrollLeft / max : 0;
  }
  rProg.style.width = (p * 100).toFixed(2) + '%';
}
rView.addEventListener('scroll', () => { if (rMode === 'native') retUpdate(); }, { passive: true });

function onScroll() { heroUpdate(); posUpdate(); retUpdate(); }
let ticking = false;
addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); }, { passive: true });
let rt: number | undefined;
function layout() { retSetup(); onScroll(); }
addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(layout, 120); });
document.fonts?.ready.then(layout);
layout();
