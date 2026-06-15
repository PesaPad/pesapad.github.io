// Mobile menu toggle
const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
if (mobileBtn) {
  mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      if (mobileMenu.classList.contains("active"))
        mobileMenu.classList.remove("active");
    }
  });
});

// Set current year
document.getElementById("currentYear").innerText = new Date().getFullYear();

// Image fallback (optional)
document.querySelectorAll("img").forEach((img) => {
  img.onerror = () => {
    img.src = "https://via.placeholder.com/400?text=Image+missing";
  };
});
function copyToClipboard(elementId) {
  const textElement = document.getElementById(elementId);
  const text = textElement.innerText;
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Address copied to clipboard!");
    })
    .catch((err) => {
      console.error("Copy failed: ", err);
      alert("Could not copy. Please select and copy manually.");
    });
}
