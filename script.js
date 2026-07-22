


/* ============================================
0. UTILITY HELPERS
============================================ */
/* Shortcut for querySelector */
const qs = (selector, ctx = document) => ctx.querySelector(selector);
/* Shortcut for querySelectorAll */
const qsa = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];
/* Scroll To Top Button */
const scrollTopBtn = qs("#scrollTop");
/* ============================================
1. PRELOADER
============================================ */
(function initPreloader() {
const preloader = qs("#preloader");
if (!preloader) return;
const MINIMUM_MS = 1200;
const startTime = Date.now();
function hidePreloader() {
const elapsed = Date.now() - startTime;
const remaining = Math.max(0, MINIMUM_MS - elapsed);
setTimeout(() => {
preloader.classList.add("hidden");
preloader.addEventListener("transitionend", () => {
preloader.remove();
document.body.classList.add("loaded");
}, { once: true });
/* Safety fallback */
setTimeout(() => {
if (preloader.parentNode) {
preloader.remove();
}
}, 600);
}, remaining);
}
if (document.readyState === "complete") {
hidePreloader();
} else {
window.addEventListener("load", hidePreloader);
}
})();
/* ============================================
2. NAVBAR
============================================ 
(function initNavbar() {
const navbar = qs("#navbar");
const hamburger = qs("#hamburger");
const navMenu = qs("#navMenu");
const navLinks = qsa(".navbar__link");
if (!navbar) return;
const sections = qsa("section[id]");
function updateActiveLink() {
const scrollY = window.scrollY + 120;
let activeId = "";
sections.forEach(section => {
const top = section.offsetTop;
const height = section.offsetHeight;
if (scrollY >= top && scrollY < top + height) {
activeId = section.getAttribute("id");
}
});
navLinks.forEach(link => {
const nav = link.getAttribute("data-nav");
link.classList.toggle("active", nav === activeId);
});
}
function onScroll() {
navbar.classList.toggle("scrolled", window.scrollY > 40);
updateActiveLink();
toggleScrollTopBtn();
}
window.addEventListener("scroll", onScroll, {
passive: true
});
onScroll();
/* Mobile Menu 
if (hamburger && navMenu) {
hamburger.addEventListener("click", () => {
const isOpen = hamburger.classList.toggle("open");
navMenu.classList.toggle("open", isOpen);
hamburger.setAttribute("aria-expanded", String(isOpen));
document.body.style.overflow = isOpen ? "hidden" : "";
});
navLinks.forEach(link => {
link.addEventListener("click", () => {
hamburger.classList.remove("open");
navMenu.classList.remove("open");
hamburger.setAttribute("aria-expanded", "false");
document.body.style.overflow = "";
});
});
document.addEventListener("click", (e) => {
if (!navbar.contains(e.target) &&
navMenu.classList.contains("open")) {
hamburger.classList.remove("open");
navMenu.classList.remove("open");
hamburger.setAttribute("aria-expanded", "false");
document.body.style.overflow = "";
}
});
}
})();


/* ============================================
3.  ANIMATION
============================================ 
(function initTyping() {
const el = qs("#typedText");
if (!el) return;
const phrases = [
"Frontend Web Developer",
"UI/UX Enthusiast",
"Clean Code Advocate",
"Responsive Design Expert",
"Freelance Developer"
 ];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const TYPE_SPEED = 80;
const DELETE_SPEED = 40;
const PAUSE_END = 2000;
const PAUSE_START = 400;
function tick() {
const phrase = phrases[phraseIndex];
if (isDeleting) {
charIndex--;
el.textContent = phrase.slice(0, charIndex);
if (charIndex === 0) {
isDeleting = false;
phraseIndex = (phraseIndex + 1) % phrases.length;
setTimeout(tick, PAUSE_START);
return;
}
setTimeout(tick, DELETE_SPEED);
} else {
charIndex++;
el.textContent = phrase.slice(0, charIndex);
if (charIndex === phrase.length) {
isDeleting = true;
setTimeout(tick, PAUSE_END);
return;
}
setTimeout(tick, TYPE_SPEED);
}
}
setTimeout(tick, 1600);
})();



/* ============================================
4. SKILL BAR ANIMATION
============================================ 
/* Animate one skill bar 
function animateSkillBar(fillEl) {
const targetWidth =
parseInt(fillEl.dataset.width, 10) || 0;
requestAnimationFrame(() => {
fillEl.style.width = targetWidth + "%";
});
}
/* Check if element is visible 
function isInViewport(el) {
const rect = el.getBoundingClientRect();
return (
rect.top < window.innerHeight &&
rect.bottom > 0
);
}
/* Animate bars already visible on page load 
(function animateInitialBars() {
function tryAnimate() {
qsa(".skill-bar__fill").forEach(bar => {
if (isInViewport(bar)) {
animateSkillBar(bar);
}
});
}
if (document.readyState === "loading") {
document.addEventListener(
"DOMContentLoaded",
tryAnimate);
} else {
tryAnimate();
}
})();



/* ============================================
   5. SCROLL REVEAL ANIMATIONS
============================================ 
(function initScrollReveal() {
  const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    qsa(".reveal").forEach(el => {
      el.classList.add("visible");
    });
    return;
  }

  const options = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        const bar = qs(".skill-bar__fill", entry.target);
        if (bar) {
          animateSkillBar(bar);
        }

        observer.unobserve(entry.target);
      }
    });
  }, options);

  qsa(".reveal").forEach(el => {
    observer.observe(el);
  });
})();



