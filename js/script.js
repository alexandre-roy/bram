"use strict";

/**
 * Intersection Observer for scroll-triggered animations
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -170px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add("show");
        }, delay);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));
}

/**
 * Handle window resize
 */
let resizeTimeout;
function handleResize() {
  // Reserved for future resize handling
}

/**
 * Smooth scroll for navigation links with offset
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");

      if (targetId === "#") return;

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
        history.pushState(null, null, targetId);
      }
    });
  });

  if (window.location.hash) {
    setTimeout(() => {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }, 100);
  }
}

// Interactions
function addInteractivity() {
  const services = document.querySelectorAll(".service");
  services.forEach((service) => {
    service.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.02)";
    });

    service.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Project card interactions
  const projectCards = document.querySelectorAll(
    ".project-card:not(.coming-soon)"
  );
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const overlay = this.querySelector(".project-overlay");
      if (overlay) {
        overlay.style.opacity = "1";
      }
    });

    card.addEventListener("mouseleave", function () {
      const overlay = this.querySelector(".project-overlay");
      if (overlay) {
        overlay.style.opacity = "0";
      }
    });
  });

  // CTA button hover effect
  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    ctaButton.addEventListener("mouseenter", function () {
      const arrow = this.querySelector(".arrow");
      if (arrow) {
        arrow.style.transform = "translateX(5px)";
      }
    });

    ctaButton.addEventListener("mouseleave", function () {
      const arrow = this.querySelector(".arrow");
      if (arrow) {
        arrow.style.transform = "translateX(0)";
      }
    });
  }
}

function init() {
  // Start animations
  initScrollAnimations();

  // Event listeners
  window.addEventListener("resize", handleResize, { passive: true });

  // Initialize features
  addInteractivity();
  initSmoothScroll();
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
