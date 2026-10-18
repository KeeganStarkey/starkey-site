// Work filters: buttons with data-f inside [data-filter-for="<grid id>"]; items carry data-cat.
document.querySelectorAll<HTMLElement>('[data-filter-for]').forEach((group) => {
  const grid = document.getElementById(group.dataset.filterFor!);
  if (!grid) return;
  const btns = Array.from(group.querySelectorAll<HTMLButtonElement>('button[data-f]'));
  btns.forEach((b) => b.addEventListener('click', () => {
    const cat = b.dataset.f!;
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    grid.classList.toggle('filtered', cat !== 'all');
    grid.querySelectorAll<HTMLElement>('[data-cat]').forEach((el) => { el.hidden = cat !== 'all' && el.dataset.cat !== cat; });
    window.SP?.repick();
  }));
});
