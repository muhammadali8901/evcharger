(function () {
  "use strict";

  function initNavbarToggle() {
    const navbarToggler = document.querySelector("#navbarToggler");
    const mobileSidebar = document.getElementById("mobileSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const sidebarClose = document.getElementById("sidebarClose");

    if (!navbarToggler || !mobileSidebar) return;

    function openSidebar() {
      mobileSidebar.classList.remove("translate-x-full");
      mobileSidebar.classList.add("translate-x-0");
      if (overlay) {
        overlay.classList.remove("opacity-0", "invisible");
        overlay.classList.add("opacity-100", "visible");
      }
      document.body.style.overflow = "hidden";
      navbarToggler.setAttribute("aria-label", "Close Menu");
    }

    function closeSidebar() {
      mobileSidebar.classList.remove("translate-x-0");
      mobileSidebar.classList.add("translate-x-full");
      if (overlay) {
        overlay.classList.remove("opacity-100", "visible");
        overlay.classList.add("opacity-0", "invisible");
      }
      document.body.style.overflow = "";
      navbarToggler.setAttribute("aria-label", "Open Menu");
    }

    function isSidebarOpen() {
      return mobileSidebar.classList.contains("translate-x-0");
    }

    navbarToggler.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isSidebarOpen()) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    // Close sidebar when clicking links
    const sidebarLinks = mobileSidebar.querySelectorAll(
      "a:not(.mobile-accordion-toggle)"
    );
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeSidebar();
      });
    });

    // Accordion toggles for services/locations
    const accordionToggles = mobileSidebar.querySelectorAll(
      ".mobile-accordion-toggle"
    );
    accordionToggles.forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = toggle.getAttribute("data-target");
        const targetContent = document.getElementById(targetId);
        const icon = toggle.querySelector(".mobile-accordion-icon");

        if (targetContent && icon) {
          const isHidden = targetContent.classList.contains("hidden");
          targetContent.classList.toggle("hidden");
          icon.classList.toggle("rotate-180");
          toggle.setAttribute("aria-expanded", isHidden ? "true" : "false");
        }
      });
    });

    // Overlay click closes sidebar
    if (overlay) {
      overlay.addEventListener("click", closeSidebar);
    }

    // Close button inside sidebar
    if (sidebarClose) {
      sidebarClose.addEventListener("click", (e) => {
        e.preventDefault();
        closeSidebar();
      });
    }

    // Escape key closes sidebar
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isSidebarOpen()) {
        closeSidebar();
        navbarToggler.focus();
      }
    });
  }

  function initHeroFloating() {
    const root = document.getElementById("hero-container");
    if (!root) return;
    const elements = root.querySelectorAll(".floating-element");
    if (!elements.length) return;

    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    function moveToRandom(el) {
      const radius = 12;
      const baseX = parseFloat(el.dataset.baseX);
      const baseY = parseFloat(el.dataset.baseY);

      const dx = randomBetween(-radius, radius);
      const dy = randomBetween(-radius, radius);

      const x = Math.max(0, Math.min(100, baseX + dx));
      const y = Math.max(0, Math.min(100, baseY + dy));

      const duration = Math.round(randomBetween(1400, 2800));
      const delay = Math.round(randomBetween(0, 300));
      el.style.transition = `top ${duration}ms ease-in-out ${delay}ms, left ${duration}ms ease-in-out ${delay}ms`;
      el.style.left = x + "%";
      el.style.top = y + "%";
    }

    elements.forEach((el, i) => {
      if (!el.style.left || !el.style.top) {
        el.style.left = randomBetween(10, 90) + "%";
        el.style.top = randomBetween(15, 85) + "%";
      }

      el.dataset.baseX = String(parseFloat(el.style.left));
      el.dataset.baseY = String(parseFloat(el.style.top));

      setTimeout(() => moveToRandom(el), 200 + i * 120);

      const loop = () => {
        moveToRandom(el);
        const next = Math.round(randomBetween(1800, 3200));
        el.__floatTimer = setTimeout(loop, next);
      };
      el.__floatTimer = setTimeout(loop, 2200 + i * 200);
    });
  }


  // Global FAQ toggle function for inline onclick handlers
  window.toggleFAQ = function toggleFAQ(button, index) {
    const faqItem = button.parentElement;
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = button.querySelector("svg");
    const isOpen = faqItem.classList.contains("open");

    // Close all others
    document.querySelectorAll("#faq .group.open").forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("open");
        const otherAnswer = item.querySelector('[id^="faq-answer-"]');
        otherAnswer.style.maxHeight = "0";
        item.querySelector("svg").style.transform = "rotate(0deg)";
      }
    });

    // Toggle current
    if (isOpen) {
      faqItem.classList.remove("open");
      answer.style.maxHeight = "0";
      icon.style.transform = "rotate(0deg)";
    } else {
      faqItem.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
      icon.style.transform = "rotate(180deg)";
    }
  };

  function initNavbar() {
    initNavbarToggle();
  }

  async function loadComponent(file, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      container.innerHTML = html;
    } catch (error) {
      console.error(`Error loading component ${file}:`, error);
    }
  }

  async function init() {
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      await loadComponent("navbar.html", "navbar-container");
    }

    initHeroFloating();

    if (typeof sal === "function") {
      sal({
        once: true,
        threshold: 0.1,
      });
    }

    setTimeout(initNavbar, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.initNavbarToggle = initNavbarToggle;
  window.initNavbar = initNavbar;
})();
