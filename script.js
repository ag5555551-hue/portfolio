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
============================================ */
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
/* Mobile Menu */
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


/*============================================
         5. SCROLL REVEAL ANIMATIONS
============================================ */
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
