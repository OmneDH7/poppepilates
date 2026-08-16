(() => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const year = document.querySelector("[data-year]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeNav = () => {
    if (!header || !toggle || !mobileNav) return;
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  };

  const openNav = () => {
    if (!header || !toggle || !mobileNav) return;
    header.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    mobileNav.hidden = false;
  };

  toggle?.addEventListener("click", () => {
    if (mobileNav?.hidden) openNav();
    else closeNav();
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  const reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Hero text should appear immediately on load
  document.querySelectorAll(".hero [data-reveal]").forEach((el) => {
    requestAnimationFrame(() => el.classList.add("is-visible"));
  });
})();
