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

  document.querySelectorAll(".hero [data-reveal]").forEach((el) => {
    requestAnimationFrame(() => el.classList.add("is-visible"));
  });

  const form = document.querySelector("[data-contact-form]");
  const captchaA = document.querySelector("[data-captcha-a]");
  const captchaB = document.querySelector("[data-captcha-b]");
  const captchaInput = document.querySelector("[data-captcha-input]");
  const captchaError = document.querySelector("[data-captcha-error]");
  const formStatus = document.querySelector("[data-form-status]");
  const submitButton = document.querySelector("[data-contact-submit]");
  let captchaAnswer = 0;

  const setStatus = (message, type) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.remove("is-error", "is-success");
    if (type) formStatus.classList.add(type);
  };

  const setCaptchaError = (message) => {
    if (!captchaError) return;
    captchaError.textContent = message || "";
    captchaError.classList.toggle("is-error", Boolean(message));
  };

  const refreshCaptcha = () => {
    if (!captchaA || !captchaB) return;
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    captchaAnswer = a + b;
    captchaA.textContent = String(a);
    captchaB.textContent = String(b);
    if (captchaInput) captchaInput.value = "";
  };

  refreshCaptcha();

  captchaInput?.addEventListener("input", () => {
    setCaptchaError("");
    setStatus("", "");
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", "");
    setCaptchaError("");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const value = Number.parseInt(String(captchaInput?.value || "").trim(), 10);
    if (!Number.isFinite(value) || value !== captchaAnswer) {
      setCaptchaError("Incorrect captcha. Please try again.");
      refreshCaptcha();
      captchaInput?.focus();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    const endpoint =
      form.getAttribute("action")?.replace(
        "https://formsubmit.co/",
        "https://formsubmit.co/ajax/"
      ) || "https://formsubmit.co/ajax/camille@poppepilates.com";

    const body = new FormData(form);
    body.delete("captcha_check");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Could not send your message.");
      }

      form.reset();
      refreshCaptcha();
      setStatus(
        "Thank you — your message was sent. Camille will get back to you soon.",
        "is-success"
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please email camille@poppepilates.com.",
        "is-error"
      );
      refreshCaptcha();
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send message";
      }
    }
  });
})();
