// ---------- Utils communs ----------
export const normalize = (str) =>
  str
    .replace(/œ/gi, 'oe')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase();

/* Charge le dictionnaire (.dic) — Promise<Set> */
export async function loadDictionary(url) {
  const buf = await (await fetch(url)).arrayBuffer();
  let txt = new TextDecoder('utf-8').decode(buf);

  // trop de � ? on tente ISO-8859-1
  if ((txt.match(/�/g) || []).length > 10 || !/\n/.test(txt)) {
    txt = new TextDecoder('iso-8859-1').decode(buf);
  }

  const set = new Set();
  txt.split(/\r?\n/).forEach((w) => w && set.add(normalize(w.trim())));
  return set;
}

/* Compare guess ↔ word → tableau de statuts */
export function evaluate(word, guess) {
  const len = word.length;
  const res = Array(len).fill('absent');
  const remain = word.split('');

  // 1. bien placées
  for (let i = 0; i < len; i++) {
    if (guess[i] === word[i]) {
      res[i] = 'correct';
      remain[i] = null;
    }
  }
  // 2. présentes ailleurs
  for (let i = 0; i < len; i++) {
    if (res[i] === 'absent') {
      const idx = remain.indexOf(guess[i]);
      if (idx !== -1) { res[i] = 'present'; remain[idx] = null; }
    }
  }
  return res;
}

/* Ajoute un confetti (supprimé après 2 s) */
export function spawnConfetti(parent) {
  const c = document.createElement('div');
  c.className = 'confetti';
  c.style.background = `hsl(${Math.random()*360},100%,50%)`;
  c.style.left = `${Math.random()*100}%`;
  c.style.top  = '-10px';
  parent.appendChild(c);
  setTimeout(()=>c.remove(), 2000);
}
