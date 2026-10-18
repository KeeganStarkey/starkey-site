// Page chrome shared by every page: header, mobile menu and enquire bar, logo tally light,
// footer wordmark, sister-brand cards, in-page nav highlight, enquiry form.

const $ = (s: string) => document.querySelector<HTMLElement>(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Header goes solid once the hero has gone; mobile bar shows between hero and enquiry */
const hdr = $('#hdr')!, mBar = $('#m-bar'), hero = $('[data-hero]'), enq = $('#enquire');
function chrome() {
  const heroEnd = hero ? hero.getBoundingClientRect().bottom : 0;
  hdr.classList.toggle('solid', hero ? heroEnd <= hdr.offsetHeight + 1 : scrollY > 8);
  if (mBar) {
    const er = enq?.getBoundingClientRect();
    const enqInView = !!er && er.top < innerHeight * 0.8 && er.bottom > 0;
    const show = (hero ? heroEnd < innerHeight * 0.4 : scrollY > innerHeight * 0.5) && !enqInView;
    mBar.classList.toggle('show', show);
    mBar.setAttribute('aria-hidden', String(!show));
    mBar.querySelectorAll('a').forEach((a) => (a.tabIndex = show ? 0 : -1));
  }
}
let ticking = false;
addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; chrome(); }); }, { passive: true });
chrome();

/* Mobile menu */
const menuBtn = $('#menu-btn'), mnav = $('#mnav');
function setMenu(open: boolean) {
  if (!menuBtn || !mnav) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  mnav.classList.toggle('open', open);
  mnav.toggleAttribute('inert', !open);
  document.body.classList.toggle('menu-open', open);
  hdr.classList.toggle('solid', open || hdr.classList.contains('solid'));
  if (!open) chrome();
}
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
mnav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
addEventListener('resize', () => { if (innerWidth > 760) setMenu(false); });

/* Logo tally light: once the page has loaded, and again on hover, tap or returning to the tab */
const markA = $('.hdr-mark'), markP = $('.hdr-mark .p');
function lightMark() { if (!markP) return; markP.classList.remove('lit'); void markP.offsetWidth; markP.classList.add('lit'); }
(document.fonts?.ready ?? Promise.resolve()).then(() => setTimeout(lightMark, 700));
setTimeout(() => { if (markP && !markP.classList.contains('lit')) markP.classList.add('lit'); }, 3000);
markA?.addEventListener('pointerenter', (e) => { if ((e as PointerEvent).pointerType === 'mouse') lightMark(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') lightMark(); });

/* Footer wordmark fitted to the page width, and its tally light */
const footWords = Array.from(document.querySelectorAll<HTMLElement>('.foot-giant .fw'));
function fitFoot() {
  footWords.forEach((el) => {
    el.style.fontSize = '100px';
    const box = el.parentElement!, w = el.getBoundingClientRect().width;
    if (w && box.clientWidth) el.style.fontSize = (100 * box.clientWidth / w * 0.995) + 'px';
  });
}
const footP = $('#foot-p');
if (footP && 'IntersectionObserver' in window) {
  const fio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { footP.classList.add('on'); fio.disconnect(); } }), { threshold: 0.6 });
  fio.observe(footP);
}
let rt: number | undefined;
addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { fitFoot(); chrome(); }, 120); });
document.fonts?.ready.then(fitFoot);
fitFoot();

/* In-page navigation highlights the section you're in */
const subLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.subnav a'));
if (subLinks.length) {
  const secIO = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    subLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  subLinks.forEach((a) => { const s = document.querySelector(a.getAttribute('href')!); if (s) secIO.observe(s); });
}

/* Sister-brand hover cards. Desktop: card follows the cursor. Touch: tap toggles it. */
(() => {
  const triggers = Array.from(document.querySelectorAll<HTMLElement>('.sister'));
  if (!triggers.length) return;
  const cards: Record<string, HTMLElement | null> = {};
  triggers.forEach((t) => { cards[t.dataset.card!] = document.getElementById(t.dataset.card!); });
  let openKey: string | null = null;
  const isTouch = matchMedia('(hover: none)').matches;
  function open(key: string, x?: number, y?: number) {
    if (openKey && openKey !== key) close();
    const card = cards[key]; if (!card) return;
    if (x != null && y != null) { card.style.left = x + 'px'; card.style.top = y + 'px'; }
    card.classList.add('on');
    triggers.forEach((t) => { if (t.dataset.card === key) t.setAttribute('aria-expanded', 'true'); });
    openKey = key;
  }
  function close() {
    if (!openKey) return;
    cards[openKey]?.classList.remove('on');
    triggers.forEach((t) => { if (t.dataset.card === openKey) t.setAttribute('aria-expanded', 'false'); });
    openKey = null;
  }
  triggers.forEach((t) => {
    const hasLink = t.tagName === 'A';
    if (!isTouch) {
      t.addEventListener('pointerenter', (e) => open(t.dataset.card!, (e as PointerEvent).clientX, t.getBoundingClientRect().top));
      t.addEventListener('pointerleave', close);
      t.addEventListener('focus', () => { const r = t.getBoundingClientRect(); open(t.dataset.card!, r.left + r.width / 2, r.top); });
      t.addEventListener('blur', close);
    } else {
      t.addEventListener('click', (e) => {
        if (hasLink && openKey === t.dataset.card) return; // second tap follows the link
        e.preventDefault();
        if (openKey === t.dataset.card) close(); else open(t.dataset.card!);
      });
    }
  });
  document.addEventListener('click', (e) => {
    if (!openKey) return;
    const tg = e.target as HTMLElement;
    if (tg.closest('.sister') || tg.closest('.sister-card')) return;
    close();
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* Enquiry form: posts to Netlify Forms without leaving the page; without JS it posts to /thanks/ */
document.querySelectorAll<HTMLFormElement>('form[data-netlify]').forEach((form) => {
  const msg = form.querySelector<HTMLElement>('.form-msg');
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      const first = String(data.get('name') || '').trim().split(/\s+/)[0];
      form.querySelectorAll('fieldset,.fields,.fld,.send').forEach((el) => ((el as HTMLElement).hidden = true));
      if (msg) {
        msg.hidden = false; msg.classList.add('ok');
        msg.textContent = `Thanks${first ? ', ' + first : ''}. That's with Keegan now, and you'll hear back within one working day.`;
        msg.focus();
      }
    } catch {
      if (msg) {
        msg.hidden = false; msg.classList.remove('ok');
        msg.innerHTML = 'Sorry, that didn\'t send. Please try again, or message Keegan directly on <a href="' + (form.dataset.wa || '#') + '">WhatsApp</a> or by <a href="' + (form.dataset.mail || '#') + '">email</a>.';
      }
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send enquiry'; }
    }
  });
});

void reduce;
