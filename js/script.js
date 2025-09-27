/**
 * Fichier principale javascript
 */
"use strict";

const translations = {
  en: {
    slogan: '"building responsive applications masterfully"',
    services: "_our\u00A0\u00A0services",
    footer: "© 2025 - All rights reserved",
    email: "email us"
  },
  fr: {
    slogan: '"construire des applications réactives avec maîtrise"',
    services: "_nos\u00A0\u00A0services",
    footer: "© 2025 - Tous droits réservés",
    email: "écrivez-nous"
  }
};
/**
 * Enregistre la langue sélectionnée dans le localStorage du navigateur
 * afin de la conserver entre les rechargements de page.
 * @param {string} lang - Code de la langue à enregistrer ("en" ou "fr").
 */
function setLang(lang) {
  localStorage.setItem("langue", lang);
}

/**
 * Récupère la langue actuellement sauvegardée dans le localStorage.
 * Retourne "en" par défaut si aucune langue n'est encore enregistrée.
 * @returns {string} - Code de la langue courante ("en" ou "fr").
 */
function getLang() {
  return localStorage.getItem("langue") || "en";
}
/**
 * Applique la langue donnée à tout le contenu textuel de la page.
 * Met à jour le slogan, le titre des services, le texte du pied de page,
 * le lien email et synchronise la valeur du sélecteur de langue.
 * @param {string} lang - Code de la langue à appliquer ("en" ou "fr").
 */
function applyLanguage(lang) {
  const t = translations[lang] || translations.en;
  document.getElementById("slogan").textContent = t.slogan;
  document.getElementById("services-title").textContent = t.services;
  document.getElementById("footer-text").textContent = t.footer;
  document.getElementById("lang-select").value = lang;
  document.getElementById("email").textContent = t.email;
}

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

  const langSelect = document.getElementById("lang-select");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      const newLang = e.target.value;
      setLang(newLang);
      applyLanguage(newLang);
    });
  }

  applyLanguage(getLang());
}
window.addEventListener("DOMContentLoaded", initialisation);
