"use strict";

function scrollAnimations() {
  let userHasScrolled = false;
  const elementsToAnimate = document.querySelectorAll(".hidden");

  function checkIfElementIsVisible() {
    elementsToAnimate.forEach((element) => {
      if (element.classList.contains("show")) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isVisible = rect.top < windowHeight && rect.bottom > 0;

      if (isVisible) {
        const delay = element.dataset.delay || 0;
        setTimeout(() => {
          element.classList.add("show");
        }, delay);
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!userHasScrolled) {
      userHasScrolled = true;
    }
    checkIfElementIsVisible();
  });
}

function init() {
  scrollAnimations();
}

document.addEventListener("DOMContentLoaded", init);