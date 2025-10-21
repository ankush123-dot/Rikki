let highestZ = 1;

class Paper {
  constructor(paper) {
    this.paper = paper;
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotation = Math.random() * 30 - 15;

    this.init();
  }
  
  init() {
    const paper = this.paper;

    // Center and random offset
    paper.style.top = "50%";
    paper.style.left = "50%";

    const offsetX = Math.random() * 60 - 30;
    const offsetY = Math.random() * 60 - 30;
    this.currentPaperX = offsetX;
    this.currentPaperY = offsetY;

    paper.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) rotate(${this.rotation}deg)`;

    const start = (x, y) => {
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.touchStartX = x;
      this.touchStartY = y;
      this.prevTouchX = x;
      this.prevTouchY = y;
    };

    const move = (x, y) => {
      if (!this.holdingPaper) return;

      const velX = x - this.prevTouchX;
      const velY = y - this.prevTouchY;

      this.currentPaperX += velX;
      this.currentPaperY += velY;
      this.rotation += velX * 0.2;

      this.prevTouchX = x;
      this.prevTouchY = y;

      paper.style.transform = `translate(-50%, -50%) translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    };

    const end = () => {
      this.holdingPaper = false;
    };

    // Touch Events
    paper.addEventListener('touchstart', e => {
      const touch = e.touches[0];
      start(touch.clientX, touch.clientY);
    });

    paper.addEventListener('touchmove', e => {
      e.preventDefault();
      const touch = e.touches[0];
      move(touch.clientX, touch.clientY);
    }, { passive: false });

    paper.addEventListener('touchend', end);

    // Mouse Events
    paper.addEventListener('mousedown', e => {
      start(e.clientX, e.clientY);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    const onMouseMove = e => move(e.clientX, e.clientY);
    const onMouseUp = () => {
      end();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }
}

// Apply Paper logic
document.querySelectorAll('.paper').forEach(paper => new Paper(paper));

// Music Autoplay on First Interaction
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bgAudio');
  const enableAudio = () => {
    audio.volume = 0.3;
    audio.play().catch(e => console.warn('Audio play failed:', e));
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
  };
  document.addEventListener('click', enableAudio);
  document.addEventListener('touchstart', enableAudio);
});

// Fallback if autoplay blocked
window.addEventListener('click', () => {
  const audio = document.getElementById('bgAudio');
  if (audio.paused) {
    audio.play().catch(err => console.log("Autoplay blocked:", err));
  }
});
