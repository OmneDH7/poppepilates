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

  const form = document.querySelector(".contact-form");
  const captchaA = document.querySelector("[data-captcha-a]");
  const captchaB = document.querySelector("[data-captcha-b]");
  const captchaInput = document.querySelector("[data-captcha-input]");
  const captchaError = document.querySelector("[data-captcha-error]");
  let captchaAnswer = null;
  let suppressCaptchaInputClear = false;

  const showCaptchaError = (message) => {
    if (captchaError) {
      captchaError.textContent = message;
      captchaError.classList.add("is-visible");
    }
    if (captchaInput) {
      captchaInput.setCustomValidity(message);
      captchaInput.reportValidity();
    }
  };

  const clearCaptchaError = () => {
    if (captchaError) {
      captchaError.textContent = "";
      captchaError.classList.remove("is-visible");
    }
    captchaInput?.setCustomValidity("");
  };

  const refreshCaptcha = () => {
    if (!captchaA || !captchaB || !captchaInput) return;
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    captchaAnswer = a + b;
    captchaA.textContent = String(a);
    captchaB.textContent = String(b);
    suppressCaptchaInputClear = true;
    captchaInput.value = "";
    suppressCaptchaInputClear = false;
  };

  refreshCaptcha();
  clearCaptchaError();

  captchaInput?.addEventListener("input", () => {
    if (!suppressCaptchaInputClear) clearCaptchaError();
  });

  form?.addEventListener("submit", (event) => {
    if (!captchaInput || captchaAnswer === null) {
      event.preventDefault();
      showCaptchaError("Please solve the captcha to send your message.");
      return;
    }

    const value = Number.parseInt(String(captchaInput.value).trim(), 10);
    if (!Number.isFinite(value) || value !== captchaAnswer) {
      event.preventDefault();
      refreshCaptcha();
      showCaptchaError("Incorrect captcha. Please try again.");
      return;
    }

    clearCaptchaError();
  });
})();
