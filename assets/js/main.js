/**
 * ==============================================================================
 * ROYAL INDIAN ARCHITECTURE - MAIN JAVASCRIPT (CORE NAVIGATION & INTERACTIVITY)
 * Written for HTML/CSS/JS Exam (Clean, Modular, Well-Documented)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroVideo();
  initOrganicShapes();
});

/**
 * Manages the Glassmorphism Navbar and Mobile Navigation Drawer
 */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const navbar = document.getElementById('mainNavbar');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('shadow-2xl', 'bg-[#0d0908]/95');
      navbar?.classList.remove('bg-[#0d0908]/80');
    } else {
      navbar?.classList.remove('shadow-2xl', 'bg-[#0d0908]/95');
      navbar?.classList.add('bg-[#0d0908]/80');
    }
  });

  // Mobile menu hamburger toggle
  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      
      if (mobileMenuDrawer.classList.contains('hidden')) {
        mobileMenuDrawer.classList.remove('hidden');
        setTimeout(() => {
          mobileMenuDrawer.classList.remove('opacity-0', '-translate-y-2');
          mobileMenuDrawer.classList.add('opacity-100', 'translate-y-0');
        }, 10);
      } else {
        mobileMenuDrawer.classList.remove('opacity-100', 'translate-y-0');
        mobileMenuDrawer.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => {
          mobileMenuDrawer.classList.add('hidden');
        }, 250);
      }
    });
  }

  // Highlight active link according to current page pathname
  highlightActiveNavLink();
}

/**
 * Highlights current active page in navigation bar
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('text-amber-400', 'font-semibold');
      link.classList.remove('text-neutral-300');
    }
  });
}

/**
 * Controls the 85vh/85vw Landing Page Hero Video Player (Play/Pause, Sound Toggle)
 */
function initHeroVideo() {
  const heroVideo = document.getElementById('heroVideo');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoMuteBtn = document.getElementById('videoMuteBtn');

  if (!heroVideo) return;

  // Attempt autoplay with muted audio
  heroVideo.muted = true;
  heroVideo.play().catch(err => {
    console.warn('Autoplay prevented by browser policy; user interaction required.', err);
  });

  // Play / Pause toggle
  if (videoPlayBtn) {
    videoPlayBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        videoPlayBtn.innerHTML = `
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs uppercase tracking-wider font-medium text-white">Pause</span>
        `;
      } else {
        heroVideo.pause();
        videoPlayBtn.innerHTML = `
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span class="text-xs uppercase tracking-wider font-medium text-white">Play</span>
        `;
      }
    });
  }

  // Audio mute / unmute toggle
  if (videoMuteBtn) {
    videoMuteBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      if (heroVideo.muted) {
        videoMuteBtn.innerHTML = `
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
          <span class="text-xs uppercase tracking-wider font-medium text-white">Unmute</span>
        `;
      } else {
        videoMuteBtn.innerHTML = `
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span class="text-xs uppercase tracking-wider font-medium text-amber-400">Mute</span>
        `;
      }
    });
  }
}

/**
 * Adds subtle interactive response to random curvy flowy containers
 */
function initOrganicShapes() {
  const shapes = document.querySelectorAll('.curvy-flowy-1, .curvy-flowy-2, .curvy-flowy-3');
  shapes.forEach(shape => {
    shape.addEventListener('mouseenter', () => {
      shape.style.animationPlayState = 'paused';
    });
    shape.addEventListener('mouseleave', () => {
      shape.style.animationPlayState = 'running';
    });
  });
}
