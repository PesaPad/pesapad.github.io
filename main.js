// ====== MOBILE MENU ======
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
let menuOpen = false;

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("hidden", !menuOpen);
    mobileMenuBtn.innerHTML = menuOpen
      ? '<i class="fas fa-times text-xl"></i>'
      : '<i class="fas fa-bars text-xl"></i>';
  });
}

// Close mobile menu on link/button click
mobileMenu?.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", () => {
    menuOpen = false;
    mobileMenu.classList.add("hidden");
    if (mobileMenuBtn)
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
  });
});

// ====== NAVBAR SCROLL EFFECT ======
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 80) {
    navbar?.classList.add(
      "nav-blur",
      "bg-stone-900/80",
      "border-b",
      "border-white/5",
    );
  } else {
    navbar?.classList.remove(
      "nav-blur",
      "bg-stone-900/80",
      "border-b",
      "border-white/5",
    );
  }
});

// ====== SCROLL REVEAL ======
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
);

document
  .querySelectorAll(".scroll-reveal")
  .forEach((el) => revealObserver.observe(el));

// ====== CAROUSEL (main) ======
function initCarousel(carouselId) {
  const container = document.getElementById(carouselId);
  if (!container) return;
  const slides = container.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(
    `.carousel-dot[data-carousel="${carouselId}"]`,
  );
  let currentIndex = 0;
  let interval;

  function goTo(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    currentIndex = index;
  }

  function next() {
    goTo((currentIndex + 1) % slides.length);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      clearInterval(interval);
      goTo(parseInt(dot.dataset.index));
      interval = setInterval(next, 10000);
    });
  });

  goTo(0);
  interval = setInterval(next, 10000);
}

initCarousel("howItWorksCarousel");
initCarousel("trustCarousel");

// ====== HERO CAROUSEL ======
function initHeroCarousel() {
  const container = document.getElementById("heroCarousel");
  if (!container) return;
  const slides = container.querySelectorAll(".carousel-slide-hero");
  const dots = container.querySelectorAll(".hero-dot");
  let currentIndex = 0;
  let interval;

  function goTo(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    currentIndex = index;
  }

  function next() {
    goTo((currentIndex + 1) % slides.length);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      clearInterval(interval);
      goTo(parseInt(dot.dataset.index));
      interval = setInterval(next, 5000);
    });
  });

  goTo(0);
  interval = setInterval(next, 5000);
}

initHeroCarousel();

// ====== FAQ with smooth height transition ======
document.querySelectorAll(".faq-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector(".faq-icon");
    const isOpen = content.classList.contains("open");

    // Close all
    document.querySelectorAll(".faq-content").forEach((c) => {
      c.classList.remove("open");
      c.classList.add("hidden");
    });
    document
      .querySelectorAll(".faq-icon")
      .forEach((i) => i.classList.remove("rotated"));

    // Open clicked if it was closed
    if (!isOpen) {
      content.classList.remove("hidden");
      // small delay to allow display block before transition
      setTimeout(() => content.classList.add("open"), 10);
      icon.classList.add("rotated");
    }
  });
});

// ====== SUPPORT MODAL ======
function openSupportModal() {
  document.getElementById("supportModal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSupportModal() {
  document.getElementById("supportModal").classList.remove("open");
  document.body.style.overflow = "";
}

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSupportModal();
});

// ====== COPY TO CLIPBOARD ======
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Address copied to clipboard!");
    })
    .catch(() => {
      alert("Could not copy. Please select and copy manually.");
    });
}

// ====== SMOOTH SCROLL ======
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 80;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ====== BACK TO TOP ======
const backToTopBtn = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
});
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ====== SET CURRENT YEAR ======
document.querySelectorAll("#currentYear").forEach((el) => {
  el.innerText = new Date().getFullYear();
});

// ====== FLOATING SUPPORT BUTTON (FAB) ======
const fab = document.getElementById("fab-support");
if (fab) {
  fab.addEventListener("click", openSupportModal);
}