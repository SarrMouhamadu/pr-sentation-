// ========================================================
// PRESENTATION ENGINE — XAM TE AAR / UNTOC 2026
// MOTEUR DE DÉFILEMENT VERTICAL (VERTICAL SCROLL STORYTELLING)
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  let currentSlideIndex = 0;

  // DOM Elements
  const currentNumEl = document.getElementById('currentSlideNum');
  const totalNumEl = document.getElementById('totalSlidesNum');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const sideNavDock = document.getElementById('sideNavDock');
  const themeToggle = document.getElementById('themeToggle');
  const overviewToggle = document.getElementById('overviewToggle');
  const overviewModal = document.getElementById('overviewModal');
  const overviewBackdrop = document.getElementById('overviewBackdrop');
  const closeOverview = document.getElementById('closeOverview');
  const overviewGrid = document.getElementById('overviewGrid');
  const heroScrollDown = document.getElementById('heroScrollDown');

  // Slide Titles for Overview & Tooltips
  const slideTitles = [
    "01. Couverture & Cérémonial UNTOC",
    "02. Ancrage Territorial & Sénégal",
    "03. Problématique & Verrous Terrain",
    "04. Les 4 Piliers XAM TE AAR",
    "05. Sécurité & Inviolabilité des Données",
    "06. IA Gemini & Triage d'Urgence",
    "07. Données & Preuves Sortie MVP",
    "08. Écosystème Institutionnel & Synergies",
    "09. Éthique, Risques & Limites",
    "10. Feuille de Route & Vision Régionale"
  ];

  if (totalNumEl) {
    totalNumEl.textContent = String(totalSlides).padStart(2, '0');
  }

  // Build Vertical Side Navigation Dock
  if (sideNavDock) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `side-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('data-target', idx);
      dot.innerHTML = `<span class="side-tooltip">${slideTitles[idx]}</span>`;
      dot.addEventListener('click', () => scrollToSlide(idx));
      sideNavDock.appendChild(dot);
    });
  }

  // Build Overview Grid Modal
  if (overviewGrid) {
    slides.forEach((_, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-card ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `
        <div class="thumb-num">Section ${String(idx + 1).padStart(2, '0')}</div>
        <div class="thumb-title">${slideTitles[idx]}</div>
      `;
      thumb.addEventListener('click', () => {
        scrollToSlide(idx);
        closeOverviewModal();
      });
      overviewGrid.appendChild(thumb);
    });
  }

  // Hero Scroll Down Button
  if (heroScrollDown) {
    heroScrollDown.addEventListener('click', () => {
      scrollToSlide(1);
    });
  }

  // Smooth Scroll to Slide by Index
  function scrollToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    const targetSlide = slides[index];
    if (!targetSlide) return;

    const topBarHeight = 64;
    const targetPosition = targetSlide.offsetTop - topBarHeight;

    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: 'smooth'
    });
  }

  // Update UI Elements based on active slide index
  function setActiveSlideUI(index) {
    currentSlideIndex = index;

    // Update Counter
    if (currentNumEl) {
      currentNumEl.textContent = String(index + 1).padStart(2, '0');
    }

    // Update Top Progress Bar
    if (progressFill) {
      const percent = ((index + 1) / totalSlides) * 100;
      progressFill.style.width = `${percent}%`;
    }

    // Update Side Dock Dots
    if (sideNavDock) {
      const dots = sideNavDock.querySelectorAll('.side-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    // Update Overview Modal Thumbnails
    if (overviewGrid) {
      const thumbs = overviewGrid.querySelectorAll('.thumb-card');
      thumbs.forEach((th, i) => {
        th.classList.toggle('active', i === index);
      });
    }

    // Update Buttons state
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === totalSlides - 1;
  }

  // Intersection Observer for Vertical Scroll Tracking
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -40% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const slideIndex = slides.indexOf(entry.target);
        if (slideIndex !== -1) {
          setActiveSlideUI(slideIndex);
        }
      }
    });
  }, observerOptions);

  slides.forEach((slide) => observer.observe(slide));

  // Immediately activate first slide animations
  if (slides[0]) {
    slides[0].classList.add('in-view');
  }

  // Next / Previous Navigation Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        scrollToSlide(currentSlideIndex - 1);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlideIndex < totalSlides - 1) {
        scrollToSlide(currentSlideIndex + 1);
      }
    });
  }

  // Keyboard Navigation (Vertical Flow)
  document.addEventListener('keydown', (e) => {
    // If overview modal open, Escape closes it
    if (overviewModal && overviewModal.classList.contains('open')) {
      if (e.key === 'Escape') closeOverviewModal();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'ArrowRight') {
      if (currentSlideIndex < totalSlides - 1) {
        e.preventDefault();
        scrollToSlide(currentSlideIndex + 1);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
      if (currentSlideIndex > 0) {
        e.preventDefault();
        scrollToSlide(currentSlideIndex - 1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      scrollToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      scrollToSlide(totalSlides - 1);
    } else if (e.key.toLowerCase() === 'd') {
      toggleTheme();
    } else if (e.key.toLowerCase() === 'o') {
      toggleOverviewModal();
    }
  });

  // Overview Modal Controls
  function openOverviewModal() {
    if (overviewModal) overviewModal.classList.add('open');
  }

  function closeOverviewModal() {
    if (overviewModal) overviewModal.classList.remove('open');
  }

  function toggleOverviewModal() {
    if (!overviewModal) return;
    if (overviewModal.classList.contains('open')) {
      closeOverviewModal();
    } else {
      openOverviewModal();
    }
  }

  if (overviewToggle) overviewToggle.addEventListener('click', toggleOverviewModal);
  if (closeOverview) closeOverview.addEventListener('click', closeOverviewModal);
  if (overviewBackdrop) overviewBackdrop.addEventListener('click', closeOverviewModal);

  // Theme Toggle (Dark / Light)
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('untoc_deck_theme', nextTheme);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Fullscreen Toggle
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Plein écran non disponible: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  if (fullscreenToggle) fullscreenToggle.addEventListener('click', toggleFullscreen);

  // Initial call
  setActiveSlideUI(0);
});
