/* script.js - Navigation, Scroll-monitoring, and Layout Manager */

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let activeIndex = 0; // 0 = Overview (Concept 0)
  const totalConcepts = 20;
  let isMobile = window.innerWidth < 767;

  // DOM Elements
  const cards = document.querySelectorAll('.concept-card');
  const tocItems = document.querySelectorAll('.toc-item');
  const progressBar = document.querySelector('.header-progress-bar');
  const progressText = document.querySelector('.header-progress-text');
  
  // Navigation elements
  const prevBtn = document.querySelector('.pc-nav-btn.prev');
  const nextBtn = document.querySelector('.pc-nav-btn.next');
  
  // Mobile UI elements
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileOverlay = document.querySelector('.mobile-toc-overlay');
  const mobileActiveTitle = document.querySelector('.mobile-active-title');
  const mobileActiveIndex = document.querySelector('.mobile-active-index');

  // Initialize page view state
  handleResize();
  updateView();

  // Listeners
  window.addEventListener('resize', handleResize);
  
  // PC Nav Button click handlers
  if (prevBtn) prevBtn.addEventListener('click', navigatePrev);
  if (nextBtn) nextBtn.addEventListener('click', navigateNext);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (isMobile) return; // Disable keyboard pagination on mobile vertical scroll
    if (e.key === 'ArrowLeft') {
      navigatePrev();
    } else if (e.key === 'ArrowRight') {
      navigateNext();
    }
  });

  // TOC Item Click handler (both desktop sidebar and mobile overlay)
  tocItems.forEach((item) => {
    const btn = item.querySelector('button');
    btn.addEventListener('click', () => {
      const targetIndex = parseInt(item.getAttribute('data-index'), 10);
      
      if (isMobile) {
        // Mobile behavior: scroll target card into view
        closeMobileOverlay();
        const targetCard = document.getElementById(`concept-${targetIndex}`);
        if (targetCard) {
          const headerOffset = 110; // header height + mobile nav bar height
          const elementPosition = targetCard.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // Desktop behavior: change active tab
        activeIndex = targetIndex;
        updateView();
      }
    });
  });

  // Card Footer Navigation Click handler
  const footerNavItems = document.querySelectorAll('.footer-nav-item');
  footerNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetIndex = parseInt(item.getAttribute('data-target'), 10);
      if (isNaN(targetIndex) || targetIndex < 0 || targetIndex > totalConcepts) return;
      
      if (isMobile) {
        // Mobile behavior: scroll target card into view
        const targetCard = document.getElementById(`concept-${targetIndex}`);
        if (targetCard) {
          const headerOffset = 110; // header height + mobile nav bar height
          const elementPosition = targetCard.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // Desktop behavior: change active tab
        activeIndex = targetIndex;
        updateView();
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileOverlay.classList.contains('show')) {
        closeMobileOverlay();
      } else {
        openMobileOverlay();
      }
    });
  }

  // Close mobile overlay when clicking outside the menu items
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        closeMobileOverlay();
      }
    });
  }

  // Navigation Logic functions
  function navigatePrev() {
    if (activeIndex > 0) {
      activeIndex--;
      updateView();
    }
  }

  function navigateNext() {
    if (activeIndex < totalConcepts) {
      activeIndex++;
      updateView();
    }
  }

  function openMobileOverlay() {
    mobileOverlay.classList.add('show');
    mobileToggle.textContent = '閉じる';
    document.body.style.overflow = 'hidden'; // Disable page scrolling while TOC is open
  }

  function closeMobileOverlay() {
    mobileOverlay.classList.remove('show');
    mobileToggle.textContent = '目次';
    document.body.style.overflow = ''; // Re-enable scroll
  }

  // Update visual elements
  function updateView() {
    // 1. Update Card Visibility (PC Mode)
    if (!isMobile) {
      cards.forEach((card, idx) => {
        if (idx === activeIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
      
      // Keep scroll state clean on card change
      window.scrollTo(0, 0);
    }

    // 2. Highlight Table of Contents (both PC & mobile lists)
    tocItems.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 3. Update Progress Bar & Info Text
    const pct = (activeIndex / totalConcepts) * 100;
    progressBar.style.width = `${pct}%`;
    
    if (activeIndex === 0) {
      progressText.textContent = `はじめに`;
      if (mobileActiveIndex) mobileActiveIndex.textContent = `INTRO`;
      if (mobileActiveTitle) mobileActiveTitle.textContent = `概要と目次`;
    } else {
      progressText.textContent = `進捗: ${activeIndex} / ${totalConcepts}`;
      if (mobileActiveIndex) mobileActiveIndex.textContent = `${activeIndex}/${totalConcepts}`;
      
      const currentCard = document.getElementById(`concept-${activeIndex}`);
      if (currentCard) {
        const titleJp = currentCard.querySelector('.concept-title-jp').textContent;
        if (mobileActiveTitle) mobileActiveTitle.textContent = titleJp;
      }
    }

    // 4. Update PC Nav Buttons visibility
    if (prevBtn && nextBtn) {
      if (activeIndex === 0) {
        prevBtn.style.visibility = 'hidden';
      } else {
        prevBtn.style.visibility = 'visible';
      }

      if (activeIndex === totalConcepts) {
        nextBtn.style.visibility = 'hidden';
      } else {
        nextBtn.style.visibility = 'visible';
      }
    }
  }

  // Resize Handler
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth < 767;

    if (wasMobile !== isMobile) {
      if (isMobile) {
        // Transition to Mobile: Make all cards visible for vertical scroll
        cards.forEach((card) => {
          card.classList.add('active');
        });
        setupMobileIntersectionObserver();
      } else {
        // Transition to PC: Re-apply active card hidden states
        destroyMobileIntersectionObserver();
        updateView();
      }
    } else if (isMobile && !observerInstance) {
      // Setup observer on initial load if starting in mobile mode
      setupMobileIntersectionObserver();
    }
  }

  // Intersection Observer for Mobile Scrolling
  let observerInstance = null;

  function setupMobileIntersectionObserver() {
    if (observerInstance) return;

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -45% 0px', // Trigger when card occupies center of screen
      threshold: 0
    };

    observerInstance = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idStr = entry.target.id;
          const index = parseInt(idStr.replace('concept-', ''), 10);
          if (!isNaN(index) && index !== activeIndex) {
            activeIndex = index;
            updateView();
          }
        }
      });
    }, observerOptions);

    cards.forEach((card) => {
      observerInstance.observe(card);
    });
  }

  function destroyMobileIntersectionObserver() {
    if (observerInstance) {
      observerInstance.disconnect();
      observerInstance = null;
    }
  }
});
