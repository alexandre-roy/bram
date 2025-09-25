/**
 * Fichier principale javascript
 */
"use strict";


/*************
    Cette fonction est rattachée à l'événement "Load".
    C'est la première fonction qui va s'executer lorsque
    la page sera entièrement chargée.
**************/
/**
 * Fonction de depart et gestionnaire d'evenements
 */
function initialisation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", initialisation);

const nav = document.getElementById('main-nav');

const dot = document.querySelector(".dot");
const section = document.querySelector(".s1");
const heading = section.querySelector("h2");

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
