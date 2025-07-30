import { evaluate, spawnConfetti } from './utils.js';
import { updateKey } from './keyboard.js';

export class Game {
  constructor(words, refs) {
    this.words = words;
    this.refs  = refs;
    this.MAX_TRIES = 6;
    this.currentIndex = 0;
    this.bindButtons();
    this.init();
  }

  /* --- Boutons popup -------------------------------------------------- */
  bindButtons() {
    const { nextBtn, replayBtn, restartBtn } = this.refs;
    nextBtn .addEventListener('click', () => { this.currentIndex++; this.hideOverlays(); this.init(); });
    replayBtn.addEventListener('click', () => { this.currentIndex = 0; this.hideOverlays(); this.init(); });
    restartBtn.addEventListener('click', () => { this.currentIndex = 0; this.hideOverlays(); this.init(); });
  }
  hideOverlays() {
    this.refs.popupEl.hidden  = true;
    this.refs.secretEl.hidden = true;
  }

  /* --- (Re)lance une partie ------------------------------------------ */
  init() {
    this.word        = this.words[this.currentIndex];
    this.len         = this.word.length;
    this.currentRow  = 0;
    this.currentCol  = 1;
    this.finished    = false;
    this.statusMap   = {};
    this.buildGrid();
    this.updateDots();
    this.resetKeyboard();
  }

  /* --- Grille --------------------------------------------------------- */
  buildGrid() {
    const { boardEl } = this.refs;
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateRows = `repeat(${this.MAX_TRIES}, var(--tile-size))`;

    /* mobile : adapte la taille si mot long */
    if (window.innerWidth <= 480 && this.len > 7) {
      document.documentElement.style.setProperty('--tile-size', `calc((100vw - 2rem)/${this.len})`);
      document.documentElement.style.setProperty('--key-size', '2rem');
    } else {
      document.documentElement.style.setProperty('--tile-size', '3rem');
      document.documentElement.style.setProperty('--key-size', '3rem');
    }

    for (let r = 0; r < this.MAX_TRIES; r++) {
      const row = document.createElement('div');
      row.className = 'row';
      row.style.gridTemplateColumns = `repeat(${this.len}, var(--tile-size))`;

      for (let c = 0; c < this.len; c++) {
        const t = document.createElement('div');
        t.className = 'tile';
        t.dataset.row = r; t.dataset.col = c;
        if (r === 0 && c === 0) { t.textContent = this.word[0]; t.classList.add('correct'); }
        row.appendChild(t);
      }
      boardEl.appendChild(row);
    }
  }

  tile(r,c) { return this.refs.boardEl.querySelector(`.tile[data-row='${r}'][data-col='${c}']`); }

  /* --- Dots ----------------------------------------------------------- */
  updateDots() {
    for (let c = 0; c < this.len; c++) {
      const t = this.tile(this.currentRow, c);
      if (c < this.currentCol && t.textContent && t.textContent !== '•') t.classList.remove('dot');
      else if (!t.textContent) { t.textContent = '•'; t.classList.add('dot'); }
    }
  }

  /* --- Input handler -------------------------------------------------- */
  handleInput(k) {
    if (this.finished) return;

    if (k === 'BACK') {
      if (this.currentCol > 1) {
        this.currentCol--;
        this.tile(this.currentRow, this.currentCol).textContent = '';
      }
      this.updateDots(); return;
    }
    if (k === 'ENTER') {
      if (this.currentCol !== this.len) { this.showMsg('Mot incomplet', true); return; }
      this.submit(); return;
    }
    if (/^[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇŒ]$/.test(k) && this.currentCol < this.len) {
      this.tile(this.currentRow, this.currentCol).textContent = k;
      this.currentCol++;
    }
    this.updateDots();
  }

  /* --- Soumission ----------------------------------------------------- */
  submit() {
    let guess = this.word[0];
    for (let c = 1; c < this.len; c++) guess += this.tile(this.currentRow, c).textContent.toUpperCase();

    if (!window.isValidWord(guess)) { this.showMsg('Mot invalide', true); return; }

    const score = evaluate(this.word, guess);
    const next  = this.currentRow + 1;

    /* pré-remplit la ligne suivante */
    if (next < this.MAX_TRIES) score.forEach((s,i) => { if (s === 'correct') this.tile(next,i).textContent = guess[i]; });

    /* colore tuiles + clavier */
    score.forEach((s,i) => {
      this.tile(this.currentRow,i).classList.add(s);
      updateKey(this.refs.keyboardEl, guess[i], s, this.statusMap);
    });

    /* victoire ? */
    if (guess === this.word) { this.end(true); return; }

    /* ligne suivante */
    this.currentRow++; this.currentCol = 1;
    if (this.currentRow === this.MAX_TRIES) { this.end(false); return; }
    this.updateDots();
  }

  /* --- Fin de partie -------------------------------------------------- */
  end(win) {
    const { nextBtn, replayBtn, popupEl, secretEl, popMsgEl } = this.refs;
    nextBtn.hidden = !win;
    replayBtn.hidden = false;
    this.finished = true;

    if (win) for (let i=0;i<80;i++) spawnConfetti(document.body);

    if (this.currentIndex === this.words.length-1) secretEl.hidden = false;
    else {
      popMsgEl.textContent = win ? 'Bihihi tu pensais que c’était fini ?' : 'Bouuuh perdu !';
      popupEl.hidden = false;
    }
  }

  /* --- Helpers -------------------------------------------------------- */
  resetKeyboard() { this.refs.keyboardEl.querySelectorAll('.key').forEach(k=>k.classList.remove('correct','present','absent')); }
  showMsg(txt,err=false){
    const el=this.refs.messageEl;
    el.textContent=txt; el.classList.toggle('error',err);
    const row=this.refs.boardEl.querySelector(`.row:nth-child(${this.currentRow+1})`);
    if(row){ row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake'); }
    setTimeout(()=>{ el.textContent=''; el.classList.remove('error'); },1500);
  }
}
