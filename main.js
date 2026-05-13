// Sticky nav
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => observer.observe(el));

// Stagger children on service grid
document.querySelectorAll('.services-grid .service-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.15}s`;
});

// ── GALLERY NAVIGATION ──
(function() {
  const strip = document.querySelector('.gallery-strip');
  const prevBtn = document.querySelector('.gallery-btn--prev');
  const nextBtn = document.querySelector('.gallery-btn--next');
  const dots = document.querySelectorAll('.gallery-dot');
  const items = document.querySelectorAll('.gallery-item');
  if (!strip || items.length === 0) return;

  const gap = 3;
  let itemWidth = 380;
  let current = 0;

  function getItemWidth() {
    if (items.length === 0) return 380;
    const style = getComputedStyle(items[0]);
    const w = items[0].offsetWidth;
    itemWidth = w + gap;
    return itemWidth;
  }

  function snapTo(index) {
    if (index < 0) index = 0;
    if (index >= items.length) index = items.length - 1;
    current = index;
    const target = items[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    updateDots();
  }

  function updateDots() {
    const scrollLeft = strip.scrollLeft;
    const w = getItemWidth();
    const idx = Math.round(scrollLeft / w);
    current = Math.max(0, Math.min(idx, items.length - 1));
    dots.forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive);
    });
  }

  function getVisibleCount() {
    return Math.round(strip.offsetWidth / getItemWidth());
  }

  prevBtn.addEventListener('click', () => {
    const visible = getVisibleCount();
    const target = current - visible;
    snapTo(target >= 0 ? target : 0);
  });

  nextBtn.addEventListener('click', () => {
    const visible = getVisibleCount();
    const target = current + visible;
    snapTo(target < items.length ? target : items.length - 1);
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-go'), 10);
      snapTo(idx);
    });
  });

  let scrollTimer;
  strip.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateDots, 60);
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    const rect = strip.closest('#gallery');
    if (!rect) return;
    const inView = rect.getBoundingClientRect();
    if (inView.top < window.innerHeight && inView.bottom > 0) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextBtn.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevBtn.click();
      }
    }
  });

  updateDots();
  window.addEventListener('resize', updateDots);

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  strip.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  strip.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextBtn.click();
      } else {
        prevBtn.click();
      }
    }
  }, { passive: true });
})();