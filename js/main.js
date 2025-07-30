import { loadDictionary }  from './utils.js';
import { buildKeyboard }   from './keyboard.js';
import { initSlideshow }   from './slideshow.js';
import { Game }            from './game.js';

/* ---------------- Constantes ---------------- */
const WORDS    = ['ESCALADE','AMOUREUSE','FRIPERIE'];
const DICT_URL = '../francais.dic';

/* ---------------- Dictionnaire --------------- */
window.isValidWord = () => true;          
loadDictionary(DICT_URL)
  .then(set => { window.isValidWord = w => set.has(w); })
  .catch(()  => { document.getElementById('message').textContent = '⚠️ Dico indisponible'; });

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

/* ---------------- Clavier -------------------- */
buildKeyboard(refs.keyboardEl, (k) => game.handleInput(k));

/* ---------------- Slideshows ----------------- */
initSlideshow('slideshow-left');
initSlideshow('slideshow-right');

/* ---------------- Jeu ------------------------ */
const game = new Game(WORDS, refs);
