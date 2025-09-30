"use strict";
/**
 * Fichier principale javascript
 */

const dot = document.querySelector(".dot");
const section = document.querySelector(".s1");
const servicesGrid = document.querySelector(".services-grid");
const hiddenElements = section.querySelectorAll(".hidden");
const heroH1 = document.querySelector(".hero h1"); // <-- new

// OPTIONAL: track if the user has scrolled at least once
let hasScrolled = false;
window.addEventListener("scroll", () => { hasScrolled = true; }, { passive: true });

/**
 * Align the dot next to the right of the H1 dynamically (responsive)
 */
function alignDotToH1() {
  const rect = heroH1.getBoundingClientRect();
  const offsetX = 20; // distance from right edge of H1
  const offsetY = -100;  // vertical offset if needed
  dot.style.left = `${rect.right + offsetX + window.scrollX}px`;
  dot.style.top = `${rect.top + rect.height / 2 + offsetY + window.scrollY}px`;
}

/**
 * Met à jour la position de la dot et ajoute/retire la classe .dot-right
 * uniquement lorsque la dot est proche de .services-grid.
 */
function updateDotPosition() {
  const dotRect = dot.getBoundingClientRect();
  const gridRect = servicesGrid.getBoundingClientRect();

  const dotCenterX = dotRect.left + dotRect.width / 2;
  const dotCenterY = dotRect.top + dotRect.height / 2;

  let verticalDist;
  if (dotCenterY < gridRect.top) verticalDist = gridRect.top - dotCenterY;
  else if (dotCenterY > gridRect.bottom) verticalDist = dotCenterY - gridRect.bottom;
  else verticalDist = 0;

  const gridCenterX = gridRect.left + gridRect.width / 2;
  const horizontalDist = Math.abs(dotCenterX - gridCenterX);

  const triggerDist = 100;
  const maxHorizontal = gridRect.width * 0.6;

  let shouldMove = verticalDist <= triggerDist && horizontalDist <= maxHorizontal;

  // Uncomment if you want to wait until the user scrolls
  // shouldMove = shouldMove && hasScrolled;

  dot.classList.toggle("dot-right", shouldMove);

  requestAnimationFrame(updateDotPosition);
}

/**
 * Surveille la collision de la dot avec la section .s1 pour activer les effets.
 */
function checkDotCollision() {
  const dotRect = dot.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();

  const isActive = dotRect.bottom >= sectionRect.top && dotRect.top <= sectionRect.bottom;

  dot.classList.toggle("active", isActive);

  hiddenElements.forEach(el => el.classList.toggle("show", isActive));

  requestAnimationFrame(checkDotCollision);
}

/**
 * Fonction d’initialisation appelée lorsque le DOM est entièrement chargé.
 */
function initialisation() {
  checkDotCollision();
  updateDotPosition();
  alignDotToH1(); // set initial position
  window.addEventListener("scroll", alignDotToH1, { passive: true });
  window.addEventListener("resize", alignDotToH1);
}

window.addEventListener("DOMContentLoaded", initialisation);
