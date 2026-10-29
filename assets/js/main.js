(() => {
  "use strict";

  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );
    });
    mainNav
      .querySelectorAll("a")
      .forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target))
        closeMenu();
    });
  }

  // Accessible FAQ accordion: one answer open at a time.
  const faqButtons = Array.from(document.querySelectorAll(".faq-question"));
  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.closest(".faq-item")?.querySelector(".faq-answer");
      if (!answer) return;
      const wasOpen = button.getAttribute("aria-expanded") === "true";
      faqButtons.forEach((other) => {
        const otherAnswer = other
          .closest(".faq-item")
          ?.querySelector(".faq-answer");
        other.setAttribute("aria-expanded", "false");
        if (otherAnswer) otherAnswer.hidden = true;
      });
      if (!wasOpen) {
        button.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });

  // Reveal content only when motion is allowed; otherwise the CSS keeps it visible.
  const revealItems = document.querySelectorAll(".reveal");
  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Copy support email and cryptocurrency addresses with a graceful fallback.
  const copyButtons = document.querySelectorAll("[data-copy]");
  const copyStatus = document.getElementById("support-copy-status");
  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy") || "";
      if (!value) return;
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          copied = true;
        } else {
          const helper = document.createElement("textarea");
          helper.value = value;
          helper.setAttribute("readonly", "");
          helper.style.position = "fixed";
          helper.style.opacity = "0";
          document.body.appendChild(helper);
          helper.select();
          copied = document.execCommand("copy");
          helper.remove();
        }
      } catch (_) {
        copied = false;
      }
      if (copyStatus)
        copyStatus.textContent = copied
          ? "Copied to clipboard."
          : "Copy was unavailable. Please select and copy the address manually.";
      const original = button.textContent;
      button.textContent = copied ? "Copied ✓" : "Select manually";
      if (copied)
        window.setTimeout(() => {
          button.textContent = original;
        }, 1800);
    });
  });

  // Keep conversion events easy to connect to a future analytics provider.
  // This dispatches a local custom event; it does not transmit personal data.
  document.querySelectorAll("[data-track]").forEach((element) => {
    element.addEventListener("click", () => {
      const detail = {
        action: element.getAttribute("data-track") || "unknown",
      };
      window.dispatchEvent(new CustomEvent("pesapad:conversion", { detail }));
      if (Array.isArray(window.dataLayer))
        window.dataLayer.push({ event: "pesapad_conversion", ...detail });
    });
  });

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
