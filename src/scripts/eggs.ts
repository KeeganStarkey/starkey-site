// Easter eggs: zebras, rack focus, razor cut and letterbox live in the markup (.egg-*);
// J / K / L control every clip on the page, like an editor's transport keys.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement & { _a?: number; _b?: number }>('.egg-focus').forEach((el) => {
  el.addEventListener('pointerenter', () => {
    if (reduce) return;
    clearTimeout(el._a); clearTimeout(el._b);
    el.classList.remove('go', 'locked', 'done'); void el.offsetWidth; el.classList.add('go');
    el._a = window.setTimeout(() => el.classList.add('locked'), 900);
    el._b = window.setTimeout(() => el.classList.add('done'), 1700);
  });
});

const boxes = document.querySelectorAll<HTMLElement>('.egg-letterbox');
if (boxes.length) {
  const t = document.createElement('div'), b = document.createElement('div');
  t.className = 'lbox-bar t'; b.className = 'lbox-bar b'; b.innerHTML = '<span>2.39 : 1 · Scope</span>';
  t.setAttribute('aria-hidden', 'true'); b.setAttribute('aria-hidden', 'true');
  document.body.append(t, b);
  let lt: number | undefined;
  boxes.forEach((el) => {
    el.addEventListener('pointerenter', () => { clearTimeout(lt); document.body.classList.add('lbox'); });
    el.addEventListener('pointerleave', () => { lt = window.setTimeout(() => document.body.classList.remove('lbox'), 900); });
  });
}

const toast = document.createElement('div');
toast.className = 'jkl'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);
let tt: number | undefined, rate = 1;
function say(k: string, msg: string) {
  toast.innerHTML = '<kbd>' + k + '</kbd>' + msg;
  toast.classList.add('on'); clearTimeout(tt);
  tt = window.setTimeout(() => toast.classList.remove('on'), 1400);
}
const vids = () => Array.from(document.querySelectorAll<HTMLVideoElement>('video.footage'));
addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || document.body.classList.contains('lb-open') || document.body.classList.contains('menu-open')) return;
  const tg = e.target as HTMLElement, tag = (tg.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || tg.isContentEditable) return;
  const k = e.key.toLowerCase();
  if (k === 'k') { window.__hold = true; vids().forEach((v) => v.pause()); rate = 1; say('K', '■ Paused'); }
  else if (k === 'l') { const was = window.__hold; window.__hold = false; rate = was ? 1 : Math.min(rate * 2, 4); vids().forEach((v) => (v.playbackRate = rate)); say('L', rate > 1 ? '▶▶ ' + rate + '×' : '▶ Play'); }
  else if (k === 'j') { vids().forEach((v) => { try { v.currentTime = Math.max(0, v.currentTime - 2); } catch {} }); say('J', '◀◀ Back 2 sec'); }
});
