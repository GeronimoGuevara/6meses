/* ============================================================
   GERO & LU · ANNIVERSARY PAGE · SCRIPT
   ============================================================ */

/* ── Partículas de corazones ───────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  const SYMBOLS  = ['♥', '❤', '✦', '✿'];
  const COLORS   = [
    'rgba(194,24,91,',
    'rgba(233,30,99,',
    'rgba(201,169,110,',
    'rgba(248,187,208,',
  ];
  const COUNT = Math.min(28, Math.floor(window.innerWidth / 22));

  class Particle {
    constructor() { this.reset(true); }

    reset(randomY = false) {
      this.x      = Math.random() * W;
      this.y      = randomY ? Math.random() * H : H + 20;
      this.size   = 8 + Math.random() * 14;
      this.speed  = 0.28 + Math.random() * 0.55;
      this.drift  = (Math.random() - 0.5) * 0.45;
      this.alpha  = 0.05 + Math.random() * 0.18;
      this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.008 + Math.random() * 0.012;
    }

    update() {
      this.y      -= this.speed;
      this.wobble += this.wobbleSpeed;
      this.x      += Math.sin(this.wobble) * 0.4 + this.drift;
      if (this.y < -30) this.reset();
    }

    draw() {
      ctx.save();
      ctx.font      = `${this.size}px serif`;
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fillText(this.symbol, this.x, this.y);
      ctx.restore();
    }
  }

  function init() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  loop();
})();


/* ── Scroll reveal ─────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));

  // Forzar el primero visible de entrada
  setTimeout(() => {
    const header = document.querySelector('.header');
    if (header) header.classList.add('visible');
  }, 100);
})();


/* ── Imagen polaroid: fallback placeholder ─────────── */
(function initPolaroidFallback() {
  const img = document.querySelector('.polaroid-img');
  if (!img) return;

  img.addEventListener('error', () => {
    img.classList.add('error');
  });

  // Si ya está rota al cargar
  if (img.complete && img.naturalWidth === 0) {
    img.classList.add('error');
  }
})();


/* ── Video player ──────────────────────────────────── */
(function initVideo() {
  const video   = document.getElementById('myVideo');
  const playBtn = document.getElementById('playBtn');
  const overlay = document.getElementById('videoOverlay');
  if (!video || !playBtn) return;

  function togglePlay() {
    if (video.paused) {
      video.play();
      playBtn.classList.add('hidden');
    } else {
      video.pause();
      playBtn.classList.remove('hidden');
    }
  }

  playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  video.addEventListener('ended', () => {
    playBtn.classList.remove('hidden');
  });

  // Si no hay archivo de video, ocultar la sección con gracia
  video.addEventListener('error', () => {
    const section = document.querySelector('.video-section');
    if (section) {
      section.style.opacity = '0.35';
      section.style.pointerEvents = 'none';
      section.title = 'Agregá tu video en assets/video.mp4';
    }
  });
})();


/* ── Música ────────────────────────────────────────── */
(function initMusic() {
  const btn   = document.getElementById('musicBtn');
  const audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;

  let playing = false;

  btn.addEventListener('click', () => {
    if (playing) {
      audio.pause();
      playing = false;
      btn.classList.remove('playing');
      btn.title = 'Reproducir música';
    } else {
      audio.play().catch(() => {
        // Autoplay bloqueado — el usuario debe interactuar primero
      });
      playing = true;
      btn.classList.add('playing');
      btn.title = 'Pausar música';
    }
  });

  audio.addEventListener('error', () => {
    btn.style.opacity = '0.4';
    btn.title = 'Agregá tu música en assets/musica.mp3';
    btn.style.pointerEvents = 'none';
  });
})();