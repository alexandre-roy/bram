/**
 * Fichier principale javascript
 */
"use strict";


const nav = document.getElementById('main-nav');

const dot = document.querySelector(".dot");
const section = document.querySelector(".s1");
const heading = section.querySelector("h2");
/**
 * Surveille la position du point (dot) par rapport à la section des services.
 * Active ou désactive les classes CSS "active" et "show" en fonction
 * de la collision afin de déclencher les animations correspondantes.
 * La fonction se rappelle elle-même via requestAnimationFrame pour un suivi continu.
 */
function checkDotCollision() {
  const dotRect = dot.getBoundingClientRect();
  const sectionRect = heading.getBoundingClientRect();

  if (dotRect.bottom >= sectionRect.top && dotRect.top <= sectionRect.bottom) {
    dot.classList.add("active");
  } else {
    dot.classList.remove("active");
  }

  if (dot.classList.contains("active")) {
    heading.classList.add("show");
  } else {
    heading.classList.remove("show");
  }

  requestAnimationFrame(checkDotCollision);
}

checkDotCollision();

/*************
    Cette fonction est rattachée à l'événement "Load".
    C'est la première fonction qui va s'executer lorsque
    la page sera entièrement chargée.
**************/
/**
 * Fonction d’initialisation appelée lorsque le DOM est entièrement chargé.
 * - Active le défilement fluide pour les liens internes commençant par "#".
 * - Ajoute l'écouteur de changement au sélecteur de langue.
 * - Applique immédiatement la langue sauvegardée ou par défaut.
 */
function initialisation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

}
window.addEventListener("DOMContentLoaded", initialisation);
