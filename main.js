// ============================================================
// ====== SUPABASE SETUP ======
// 🔑 Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = "https://qzwpyvpprgpqzibzgzcz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_MpVET6kJ_-a7HrfBl5t2Iw_V_83g-wV";

let supabaseClient = null;
try {
  if (typeof window.supabase !== "undefined" && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
    );
    console.log("✅ Supabase initialized successfully");
  } else {
    console.warn("⚠️ Supabase library not loaded");
  }
} catch (e) {
  console.warn("⚠️ Failed to initialize Supabase:", e);
}

// ============================================================
// ====== TESTIMONIALS ======
let selectedRating = 0;

// ---- Star rating interaction ----
document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll(".star");
  if (stars.length > 0) {
    stars.forEach((star) => {
      star.addEventListener("click", function () {
        const val = parseInt(this.dataset.value);
        selectedRating = val;
        stars.forEach((s, i) => {
          const icon = s.querySelector("i");
          if (icon) {
            if (i < val) {
              icon.className = "fas fa-star text-highlight-400";
            } else {
              icon.className = "far fa-star text-purple-300";
            }
          }
        });
        const hint = document.getElementById("rating-hint");
        if (hint) hint.textContent = `Rating: ${val} stars`;
      });
    });
  }
});

// ---- Fetch approved testimonials ----
async function fetchTestimonials() {
  if (!supabaseClient) {
    console.warn("⚠️ Supabase not initialized, skipping testimonials");
    return;
  }
  try {
    const { data, error } = await supabaseClient
      .from("testimonials")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(6);
    if (error) throw error;
    if (data && data.length > 0) {
      renderTestimonials(data);
    }
  } catch (e) {
    console.warn("Could not load testimonials, keeping fallback:", e);
  }
}

// ---- Render dynamic testimonials ----
function renderTestimonials(testimonials) {
  const container = document.getElementById("testimonials-container");
  const empty = document.getElementById("testimonials-empty");
  if (!container) return;

  if (!testimonials || testimonials.length === 0) {
    container.innerHTML = "";
    if (empty) empty.classList.remove("hidden");
    return;
  }

  if (empty) empty.classList.add("hidden");
  container.innerHTML = "";

  testimonials.forEach((t) => {
    const card = document.createElement("div");
    card.className =
      "bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 min-w-[280px] max-w-[320px] flex-shrink-0 snap-center";
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      starsHtml +=
        i <= t.rating
          ? '<i class="fas fa-star text-highlight-500"></i>'
          : '<i class="far fa-star text-highlight-500"></i>';
    }
    const nameHtml = t.business_name
      ? `${t.name} – ${t.business_name}`
      : t.name;
    card.innerHTML = `
      <div class="flex items-center gap-1 mb-4">${starsHtml}</div>
      <p class="text-purple-200 text-sm leading-relaxed mb-5 line-clamp-4">"${t.message}"</p>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">${t.name.charAt(0)}</div>
        <div>
          <p class="text-sm font-semibold text-white">${nameHtml}</p>
          <p class="text-xs text-purple-300">Verified User</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ---- Submit testimonial ----
async function submitTestimonial(e) {
  e.preventDefault();
  if (!supabaseClient) {
    const feedback = document.getElementById("story-feedback");
    if (feedback) {
      feedback.className = "text-sm text-center text-red-400 mt-2";
      feedback.textContent = "Could not submit. Please try again later.";
      feedback.classList.remove("hidden");
    }
    return;
  }

  const name = document.getElementById("story-name");
  const business = document.getElementById("story-business");
  const message = document.getElementById("story-message");
  const feedback = document.getElementById("story-feedback");
  const submitBtn = document.getElementById("submit-story-btn");

  if (!name || !message || !feedback || !submitBtn) {
    console.warn("⚠️ Testimonial form elements not found");
    return;
  }

  const nameVal = name.value.trim();
  const businessVal = business ? business.value.trim() : "";
  const messageVal = message.value.trim();

  if (!nameVal || !messageVal || selectedRating === 0) {
    feedback.className = "text-sm text-center text-red-400 mt-2";
    feedback.textContent =
      "Please fill in all required fields and select a rating.";
    feedback.classList.remove("hidden");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  feedback.classList.add("hidden");

  try {
    const { error } = await supabaseClient.from("testimonials").insert([
      {
        name: nameVal,
        business_name: businessVal || null,
        message: messageVal,
        rating: selectedRating,
        is_approved: false,
      },
    ]);
    if (error) throw error;

    feedback.className = "text-sm text-center text-green-400 mt-2";
    feedback.textContent =
      "Thank you! Your story has been submitted for review.";
    feedback.classList.remove("hidden");
    const form = document.getElementById("testimonial-form");
    if (form) form.reset();

    document.querySelectorAll(".star").forEach((s) => {
      const icon = s.querySelector("i");
      if (icon) icon.className = "far fa-star text-purple-300";
    });
    selectedRating = 0;
    const hint = document.getElementById("rating-hint");
    if (hint)
      hint.textContent = "Click a star to rate (1 = poor, 5 = excellent)";
  } catch (err) {
    console.error("Submit error:", err);
    feedback.className = "text-sm text-center text-red-400 mt-2";
    feedback.textContent = "Something went wrong. Please try again later.";
    feedback.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Story';
  }
}

// Attach form listener
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("testimonial-form");
  if (form) {
    form.addEventListener("submit", submitTestimonial);
  }
});

// ============================================================
// ====== EXISTING CODE – MOBILE MENU, NAVBAR, CAROUSELS, ETC. ======
// ----- MOBILE MENU -----
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
mobileMenu?.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", () => {
    menuOpen = false;
    mobileMenu.classList.add("hidden");
    if (mobileMenuBtn)
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
  });
});

// ----- NAVBAR SCROLL EFFECT -----
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

// ----- SCROLL REVEAL -----
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

// ----- CAROUSEL (main) -----
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

// ----- HERO CAROUSEL -----
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

// ----- FAQ with smooth height transition -----
document.querySelectorAll(".faq-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector(".faq-icon");
    const isOpen = content.classList.contains("open");

    document.querySelectorAll(".faq-content").forEach((c) => {
      c.classList.remove("open");
      c.classList.add("hidden");
    });
    document
      .querySelectorAll(".faq-icon")
      .forEach((i) => i.classList.remove("rotated"));

    if (!isOpen) {
      content.classList.remove("hidden");
      setTimeout(() => content.classList.add("open"), 10);
      icon.classList.add("rotated");
    }
  });
});

// ----- SUPPORT MODAL -----
function openSupportModal() {
  document.getElementById("supportModal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeSupportModal() {
  document.getElementById("supportModal").classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSupportModal();
});

// ----- COPY TO CLIPBOARD -----
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

function copyPayPalEmail() {
  const email = "pesapad.app@gmail.com";
  navigator.clipboard
    .writeText(email)
    .then(() => {
      alert("PayPal email copied to clipboard!");
    })
    .catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("PayPal email copied to clipboard!");
      } catch (err) {
        alert("Could not copy. Please copy manually: " + email);
      }
      document.body.removeChild(textArea);
    });
}

// ----- SMOOTH SCROLL -----
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

// ----- BACK TO TOP -----
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

// ----- SET CURRENT YEAR -----
document.querySelectorAll("#currentYear").forEach((el) => {
  el.innerText = new Date().getFullYear();
});

// ----- FLOATING SUPPORT BUTTON (FAB) -----
const fab = document.getElementById("fab-support");
if (fab) {
  fab.addEventListener("click", openSupportModal);
}

// ============================================================
// ====== INITIALISE ======
document.addEventListener("DOMContentLoaded", async function () {
  // Load testimonials from Supabase (if available)
  await fetchTestimonials();
});
