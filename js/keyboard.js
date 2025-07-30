// ---------- Construction & gestion du clavier ----------
export function buildKeyboard(container, onKey) {
  const layout = [
    ['A','Z','E','R','T','Y','U','I','O','P'],
    ['Q','S','D','F','G','H','J','K','L','M'],
    ['BACK','W','X','C','V','B','N','ENTER'],
  ];

  layout.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'krow';

    row.forEach(k => {
      const key = document.createElement('div');
      key.className = 'key' + (k==='BACK'||k==='ENTER' ? ' wide':'');
      key.dataset.key = k;
      key.textContent = k==='BACK' ? '⌫' : k==='ENTER' ? '⏎' : k;
      key.addEventListener('click', () => onKey(k));
      rowEl.appendChild(key);
    });
    container.appendChild(rowEl);
  });

  // clavier physique
  document.addEventListener('keydown', e => {
    let k = e.key;
    if (k === 'Backspace') k = 'BACK';
    else if (k === 'Enter') k = 'ENTER';
    else k = k.toUpperCase();
    onKey(k);
  });
}

/* Met à jour la couleur d'une touche */
export function updateKey(container, letter, status, statusMap) {
  const rank = { correct:3, present:2, absent:1 };
  const current = statusMap[letter];

  if (!current || rank[status] > rank[current]) {
    statusMap[letter] = status;
    const key = container.querySelector(`.key[data-key='${letter}']`);
    if (key) {
      key.classList.remove('correct','present','absent');
      key.classList.add(status);
    }
  }
}
