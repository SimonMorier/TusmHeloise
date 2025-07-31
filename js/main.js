import { loadDictionary }  from './utils.js';
import { buildKeyboard }   from './keyboard.js';
import { initSlideshow }   from './slideshow.js';
import { Game }            from './game.js';

/* ---------------- Constantes ---------------- */
const WORDS    = ['ESCALADE','AMOUREUSE','FRIPERIE'];
const DICT_URL = '../francais.dic';

// Expose le chemin dans le contexte global
window.DICT_URL = DICT_URL;

// Calcule et expose l'URL absolue (pour debug)
const ABS_DICT_URL = new URL(DICT_URL, window.location.href).href;
window.DICT_ABS_URL = ABS_DICT_URL;

console.log('[main.js] ➤ window.DICT_URL =', window.DICT_URL);
console.log('[main.js] ➤ window.DICT_ABS_URL =', window.DICT_ABS_URL);
console.log('[main.js] ➤ Démarrage de main.js');

/* ---------------- Dictionnaire --------------- */
window.isValidWord = () => true;  // fallback pendant le chargement
console.log('[main.js] ➤ Tentative de chargement du dictionnaire à :', ABS_DICT_URL);

loadDictionary(ABS_DICT_URL)
  .then(set => {
    console.log('[main.js] ✅ Dictionnaire chargé,', set.size, 'mots trouvés');
    window.isValidWord = w => {
      const norm = w.toUpperCase();
      const ok = set.has(norm);
      if (!ok) console.log(`[main.js] ⚠️ Mot non trouvé : "${w}"`);
      return ok;
    };
  })
  .catch(error  => {
    console.error('[main.js] ❌ Erreur lors du chargement du dictionnaire :', error);
    const msgEl = document.getElementById('message');
    if (msgEl) {
      msgEl.textContent = `⚠️ Dico indisponible (voir console pour ${ABS_DICT_URL})`;
      msgEl.classList.add('error');
    }
  });

/* ---------------- Réfs DOM ------------------- */
const refs = {
  boardEl   : document.getElementById('board'),
  keyboardEl: document.getElementById('keyboard'),
  messageEl : document.getElementById('message'),
  popupEl   : document.getElementById('popup'),
  secretEl  : document.getElementById('secret'),
  nextBtn   : document.getElementById('next-btn'),
  replayBtn : document.getElementById('replay-btn'),
  restartBtn: document.getElementById('restart-btn'),
  popMsgEl  : document.getElementById('pop-msg'),
};

console.log('[main.js] ➤ Références DOM initialisées');

/* ---------------- Clavier -------------------- */
buildKeyboard(refs.keyboardEl, (k) => {
  console.log('[main.js] ▶️ Touche pressée :', k);
  game.handleInput(k);
});

/* ---------------- Slideshows ----------------- */
console.log('[main.js] ➤ Initialisation des slideshows');
initSlideshow('slideshow-left');
initSlideshow('slideshow-right');

/* ---------------- Jeu ------------------------ */
console.log('[main.js] ➤ Création de l’instance Game');
const game = new Game(WORDS, refs);
console.log('[main.js] 🎮 Jeu prêt à être joué');
