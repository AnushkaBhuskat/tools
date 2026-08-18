/* ==========================================================================
   KrishKalp Tools & Setup Presentation Application Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // State Management
  const state = {
    currentSlide: 1,
    totalSlides: 11,
    theme: localStorage.getItem('krishkalp_theme') || 'dark',
    overviewOpen: false
  };

  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.getElementById('progressBar');
  const slideIndicator = document.getElementById('slideIndicator');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnTheme = document.getElementById('btnTheme');
  const btnOverview = document.getElementById('btnOverview');
  const btnFullscreen = document.getElementById('btnFullscreen');

  const overviewModal = document.getElementById('overviewModal');
  const closeOverview = document.getElementById('closeOverview');
  const overviewGrid = document.getElementById('overviewGrid');

  const toast = document.getElementById('toast');

  // Initialize Theme
  document.documentElement.setAttribute('data-theme', state.theme);

  // Core Slide Navigation Function
  function goToSlide(targetIndex) {
    if (targetIndex < 1 || targetIndex > state.totalSlides) return;

    slides.forEach((slide, index) => {
      if (index + 1 === targetIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    state.currentSlide = targetIndex;

    // Update Progress & UI Controls
    const progressPercent = (state.currentSlide / state.totalSlides) * 100;
    progressBar.style.width = `${progressPercent}%`;
    slideIndicator.textContent = `Slide ${state.currentSlide} / ${state.totalSlides}`;

    btnPrev.disabled = state.currentSlide === 1;
    btnNext.textContent = state.currentSlide === state.totalSlides ? 'Finish' : 'Next';

    // Highlight Overview Active Thumb
    document.querySelectorAll('.thumb-card').forEach((card, idx) => {
      card.classList.toggle('active', idx + 1 === state.currentSlide);
    });
  }

  // Next / Prev Handlers
  btnNext.addEventListener('click', () => goToSlide(state.currentSlide + 1));
  btnPrev.addEventListener('click', () => goToSlide(state.currentSlide - 1));

  // Keyboard Shortcuts Navigation
  document.addEventListener('keydown', (e) => {
    // Avoid triggering when focused inside inputs or textareas
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
      case 'PageDown':
        e.preventDefault();
        goToSlide(state.currentSlide + 1);
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        goToSlide(state.currentSlide - 1);
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(state.totalSlides);
        break;
      case 'o':
      case 'O':
        toggleOverview();
        break;
      case 't':
      case 'T':
        toggleTheme();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'Escape':
        closeAllModals();
        break;
    }
  });

  // Toggle Dark/Light Theme
  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('krishkalp_theme', state.theme);
  }
  btnTheme.addEventListener('click', toggleTheme);

  // Toggle Modal Overview Grid
  function toggleOverview() {
    state.overviewOpen = !state.overviewOpen;
    overviewModal.classList.toggle('open', state.overviewOpen);
  }
  btnOverview.addEventListener('click', toggleOverview);
  closeOverview.addEventListener('click', () => {
    state.overviewOpen = false;
    overviewModal.classList.remove('open');
  });

  function closeAllModals() {
    state.overviewOpen = false;
    overviewModal.classList.remove('open');
  }

  // Populate Slide Overview Grid Thumbnails
  slides.forEach((slide, idx) => {
    const slideNum = idx + 1;
    const title = slide.querySelector('.slide-title, .hero-title')?.textContent || `Slide ${slideNum}`;
    
    const thumb = document.createElement('div');
    thumb.className = `thumb-card ${slideNum === 1 ? 'active' : ''}`;
    thumb.innerHTML = `
      <span class="thumb-num">Slide ${slideNum}</span>
      <span class="thumb-title">${title}</span>
    `;

    thumb.addEventListener('click', () => {
      goToSlide(slideNum);
      closeAllModals();
    });

    overviewGrid.appendChild(thumb);
  });

  // Toggle Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }
  btnFullscreen.addEventListener('click', toggleFullscreen);

  // Copy to Clipboard Utility
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const textToCopy = button.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('Copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      }
    });
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // Tab Buttons Switcher (e.g., Windows vs Mac venv)
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      const parentCard = btn.closest('.card');

      parentCard.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parentCard.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      parentCard.querySelector(`#${targetTab}`)?.classList.add('active');
    });
  });

  // Initialize Slide 1
  goToSlide(1);
});
