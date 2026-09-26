(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-panel]')];
  function showPanel(name, focus = false) {
    for (const tab of tabs) {
      const selected = tab.dataset.panel === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
      if (selected && focus) tab.focus();
    }
    window.dispatchEvent(new Event('resize'));
  }
  for (const tab of tabs) {
    tab.addEventListener('click', () => showPanel(tab.dataset.panel));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (tabs.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      showPanel(tabs[index].dataset.panel, true);
    });
  }
  document.querySelector('.return-viewer').addEventListener('click', () => showPanel('viewer', true));
  if (location.hash === '#photos' || location.hash === '#avant-apres') showPanel('photos');

  const range = document.getElementById('compare-range');
  const compare = document.getElementById('photo-compare');
  const presets = [...document.querySelectorAll('[data-compare-value]')];
  function updateCompare() {
    const value = Number(range.value);
    compare.style.setProperty('--split', value + '%');
    range.setAttribute('aria-valuetext', `${value} % avant, ${100 - value} % après`);
    document.querySelector('.stamp-before').style.opacity = value < 12 ? 0 : 1;
    document.querySelector('.stamp-after').style.opacity = value > 88 ? 0 : 1;
    presets.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.compareValue) === value)));
  }
  range.addEventListener('input', updateCompare);
  presets.forEach(button => button.addEventListener('click', () => {
    range.value = button.dataset.compareValue;
    updateCompare();
  }));
  updateCompare();

  const cards = [...document.querySelectorAll('.photo-card')];
  const dialog = document.getElementById('photo-dialog');
  const largeImage = document.getElementById('dialog-image');
  let currentIndex = 0;
  function displayPhoto(index) {
    currentIndex = (index + cards.length) % cards.length;
    const card = cards[currentIndex];
    const sourceImage = card.querySelector('img');
    largeImage.src = sourceImage.src;
    largeImage.alt = sourceImage.alt;
    document.getElementById('dialog-count').textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    document.getElementById('dialog-title').textContent = card.querySelector('strong').textContent;
    document.getElementById('dialog-description').textContent = card.querySelector('.photo-summary').textContent;
  }
  cards.forEach((card, index) => card.addEventListener('click', () => {
    displayPhoto(index);
    dialog.showModal();
  }));
  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
  document.getElementById('dialog-prev').addEventListener('click', () => displayPhoto(currentIndex - 1));
  document.getElementById('dialog-next').addEventListener('click', () => displayPhoto(currentIndex + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      displayPhoto(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
})();
