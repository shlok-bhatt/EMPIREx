(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    const setMenuOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };

    const closeMenu = (restoreFocus = false) => {
      const wasOpen = nav.classList.contains("open");
      setMenuOpen(false);
      if (restoreFocus && wasOpen) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      setMenuOpen(!nav.classList.contains("open"));
    });

    nav.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        closeMenu(true);
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    if (typeof window.matchMedia === "function") {
      const desktopQuery = window.matchMedia("(min-width: 821px)");
      const closeOnDesktop = (event) => {
        if (event.matches) closeMenu();
      };

      if (typeof desktopQuery.addEventListener === "function") {
        desktopQuery.addEventListener("change", closeOnDesktop);
      } else if (typeof desktopQuery.addListener === "function") {
        desktopQuery.addListener(closeOnDesktop);
      }
    }
  }

  // Product artwork is served as original static files; show a helpful message if one fails.
  document.querySelectorAll("img[data-site-image]").forEach((img) => {
    const showFallback = () => {
      if (img.dataset.fallbackShown === "true") return;

      img.dataset.fallbackShown = "true";
      img.classList.add("image-load-error");

      const fallback = document.createElement("p");
      fallback.className = "image-fallback";
      fallback.setAttribute("role", "status");
      fallback.setAttribute("aria-live", "polite");
      fallback.textContent = "This image could not be loaded. Please check your connection or try again later.";
      img.insertAdjacentElement("afterend", fallback);
    };

    img.addEventListener("error", showFallback, { once: true });

    // Covers images that failed before the deferred script finished loading.
    if (img.complete && img.naturalWidth === 0) showFallback();
  });
})();
