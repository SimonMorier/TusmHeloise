// ---------- Slideshows latéraux ----------
export function initSlideshow(id, interval = 3000) {
  const el = document.getElementById(id);
  const slides = [...el.querySelectorAll('img')];
  if (slides.length <= 1) return;

  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, interval);
}
