// Film player: any [data-play] element opens the full film with sound.
const lb = document.getElementById('lb') as HTMLDialogElement | null;
const v = document.getElementById('lb-v') as HTMLVideoElement | null;
const title = document.getElementById('lb-title');
const sub = document.getElementById('lb-sub');
let hls: { destroy(): void } | undefined;
let opener: HTMLElement | null = null;

async function open(from: HTMLElement) {
  if (!lb || !v) return;
  const d = from.dataset;
  opener = from;
  window.__hold = true;
  window.SP?.footage.forEach((f) => f.v.pause());
  if (title) title.textContent = d.title || '';
  if (sub) sub.textContent = d.sub || '';
  v.poster = d.poster || '';
  v.muted = false;
  lb.showModal();
  document.body.classList.add('lb-open');
  hls = await window.SP?.attach(v, d.mux || undefined, d.src || undefined, { full: true });
  const p = v.play();
  if (p && p.catch) p.catch(() => {});
}

function close() {
  if (!lb || !v) return;
  v.pause();
  hls?.destroy(); hls = undefined;
  v.removeAttribute('src'); v.load();
  if (lb.open) lb.close();
  document.body.classList.remove('lb-open');
  window.__hold = false;
  opener?.focus();
}

document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-play]');
  if (t) { e.preventDefault(); open(t); }
});
document.getElementById('lb-x')?.addEventListener('click', close);
lb?.addEventListener('close', () => { if (document.body.classList.contains('lb-open')) close(); });
lb?.addEventListener('click', (e) => { if (e.target === lb || (e.target as HTMLElement).classList.contains('lb-stage')) close(); });
