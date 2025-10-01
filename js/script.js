"use strict";

/**
 * Enhanced Javascript with dot following sections and scroll features
 */

// Cache DOM elements
const dot = document.querySelector(".dot");
const heroH1 = document.querySelector(".hero h1");
const scrollToTopBtn = document.getElementById("scroll-to-top");

// All sections that the dot should visit
const sections = [
  { element: document.querySelector("#services"), name: "services" },
  { element: document.querySelector("#about"), name: "about" },
  { element: document.querySelector("#projects"), name: "projects" },
  { element: document.querySelector("#contact"), name: "contact" }
];

// Animation state
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const smoothness = 0.08;
let currentSection = null;
let isUserScrolling = true;

/**
 * Get the initial position next to H1
 */
function getH1Position() {
  const rect = heroH1.getBoundingClientRect();
  const offsetX = window.innerWidth > 768 ? 20 : 10;
  const offsetY = window.innerWidth > 768 ? -100 : -50;

  return {
    x: rect.right + offsetX,
    y: rect.top + rect.height / 2 + offsetY + window.scrollY
  };
}

/**
 * Get position for a specific section - right next to section title
 */
function getSectionPosition(section) {
  if (!section) return getH1Position();

  // Find the h2 title in the section
  const sectionTitle = section.querySelector('h2, .section-title');

  if (sectionTitle) {
    const rect = sectionTitle.getBoundingClientRect();

    // Position dot to the RIGHT of the title
    const offsetX = window.innerWidth > 768 ? 20 : 10; // Small gap from title
    const offsetY = 0; // Center vertically

    return {
      x: rect.right + offsetX, // Right side of title + gap
      y: rect.top + (rect.height / 2) + offsetY // Vertically centered
    };
  }

  // Fallback if no title found
  const rect = section.getBoundingClientRect();
  return {
    x: rect.left + 50,
    y: rect.top + 100
  };
}

/**
 * Determine which section is currently in view
 */
function getCurrentSection() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const threshold = windowHeight * 0.3; // Section needs to be 30% visible

  // Check if we're at the top (hero section)
  if (scrollY < windowHeight * 0.3) {
    return null; // Stay at H1
  }

  // Find which section is most visible
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i].element;
    if (!section) continue;

    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + scrollY;

    // Check if section is in view
    if (scrollY + threshold >= sectionTop - 200) {
      return sections[i];
    }
  }

  return null;
}

/**
 * Smooth lerp animation
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Main animation loop for smooth dot movement
 */
function animateDot() {
  const activeSection = getCurrentSection();

  // Determine target position based on active section
  if (activeSection && activeSection.element) {
    const sectionPos = getSectionPosition(activeSection.element);
    targetX = sectionPos.x;
    targetY = sectionPos.y; // Remove the window.scrollY here since we want fixed positioning
    currentSection = activeSection.name;
  } else {
    // Return to H1
    const h1Pos = getH1Position();
    targetX = h1Pos.x;
    targetY = h1Pos.y;
    currentSection = null;
  }

  // Smooth transition
  currentX = lerp(currentX, targetX, smoothness);
  currentY = lerp(currentY, targetY, smoothness);

  // Apply position (fixed positioning, so coordinates are relative to viewport)
  dot.style.left = `${currentX}px`;
  dot.style.top = `${currentY}px`;

  requestAnimationFrame(animateDot);
}

/**
 * Intersection Observer for scroll-triggered animations
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('show');
        }, delay);
      }
    });
  }, observerOptions);

  // Observe all hidden elements
  document.querySelectorAll(".hidden").forEach(el => observer.observe(el));
}

/**
 * Handle window resize
 */
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Recalculate position
    const activeSection = getCurrentSection();
    if (activeSection && activeSection.element) {
      const sectionPos = getSectionPosition(activeSection.element);
      currentX = sectionPos.x;
      currentY = sectionPos.y;
    } else {
      const h1Pos = getH1Position();
      currentX = h1Pos.x;
      currentY = h1Pos.y;
    }
  }, 100);
}

/**
 * Scroll to top button functionality
 */
function initScrollToTop() {
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  // Smooth scroll to top when clicked
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Smooth scroll for navigation links with offset
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');

      if (targetId === '#') return;

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // 80px offset for sticky header

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // Handle page load with hash
  if (window.location.hash) {
    setTimeout(() => {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
}

/**
 * Add interactive features
 */
function addInteractivity() {
  // Make dot clickable to scroll to next section
  dot.style.cursor = 'pointer';
  dot.addEventListener('click', () => {
    const activeSection = getCurrentSection();

    if (!activeSection) {
      // At hero, scroll to services
      sections[0].element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Find next section
      const currentIndex = sections.findIndex(s => s.name === activeSection.name);
      if (currentIndex < sections.length - 1) {
        sections[currentIndex + 1].element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // At last section, go back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // Enhanced hover effect for service cards
  const services = document.querySelectorAll('.service');
  services.forEach(service => {
    service.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-15px) scale(1.02)';
    });

    service.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Project card interactions
  const projectCards = document.querySelectorAll('.project-card:not(.coming-soon)');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      const overlay = this.querySelector('.project-overlay');
      if (overlay) {
        overlay.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', function () {
      const overlay = this.querySelector('.project-overlay');
      if (overlay) {
        overlay.style.opacity = '0';
      }
    });
  });

  // CTA button hover effect
  const ctaButton = document.querySelector('.cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('mouseenter', function () {
      const arrow = this.querySelector('.arrow');
      if (arrow) {
        arrow.style.transform = 'translateX(5px)';
      }
    });

    ctaButton.addEventListener('mouseleave', function () {
      const arrow = this.querySelector('.arrow');
      if (arrow) {
        arrow.style.transform = 'translateX(0)';
      }
    });
  }
}

/**
 * Add parallax effect on scroll
 */
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Parallax for about images
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
      const speed = 0.3;
      const yPos = -(scrolled * speed);
      aboutImage.style.transform = `translateY(${yPos}px)`;
    }
  }, { passive: true });
}

/**
 * Initialize everything
 */
function init() {
  // Set initial dot position at H1
  const h1Pos = getH1Position();
  currentX = h1Pos.x;
  currentY = h1Pos.y;
  dot.style.left = `${currentX}px`;
  dot.style.top = `${currentY}px`;

  // Start animations
  animateDot();
  initScrollAnimations();

  // Event listeners
  window.addEventListener('resize', handleResize, { passive: true });

  // Initialize features
  initScrollToTop();
  addInteractivity();
  initSmoothScroll();
  initParallax();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}