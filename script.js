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
2.                NAVBAR
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


/* ============================================
3.            TYPING ANIMATION
============================================ */
(function initTyping() {
const el = qs("#typedText");
if (!el) return;
const phrases = [
"Frontend Web Developer",
"UI/UX Enthusiast","Clean Code Advocate",
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
============================================ */
/* Animate one skill bar */
function animateSkillBar(fillEl) {
const targetWidth =
parseInt(fillEl.dataset.width, 10) || 0;
requestAnimationFrame(() => {
fillEl.style.width = targetWidth + "%";
});
}
/* Check if element is visible */
function isInViewport(el) {
const rect = el.getBoundingClientRect();
return (
rect.top < window.innerHeight &&
rect.bottom > 0
);
}
/* Animate bars already visible on page load */
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

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

        /* Animate all skill bars inside revealed section */
        qsa(".skill-bar__fill", entry.target).forEach(bar => {
          animateSkillBar(bar);
        });

        observer.unobserve(entry.target);

      }

    });

  }, options);

  qsa(".reveal").forEach(el => {
    observer.observe(el);
  });

})();

/* ============================================
          6. DARK / LIGHT MODE
============================================ */
(function initTheme() {
const toggle = qs("#themeToggle");
const icon = qs("#themeIcon");
const html = document.documentElement;
const STORAGE_KEY = "portfolio-theme";
const systemDark =
window.matchMedia("(prefers-color-scheme: dark)").matches;
const saved =
localStorage.getItem(STORAGE_KEY);
const initialTheme =
saved || (systemDark ? "dark" : "light");
applyTheme(initialTheme);
if (toggle) {
toggle.addEventListener("click", () => {
const next =
html.getAttribute("data-theme") === "dark"
? "light"
: "dark";
applyTheme(next);
localStorage.setItem(STORAGE_KEY, next);
});
}
function applyTheme(theme) {
html.setAttribute("data-theme", theme);
if (icon) {
icon.className =
theme === "dark"
? "fas fa-sun"
: "fas fa-moon";
}
}
window.matchMedia("(prefers-color-scheme: dark)")
.addEventListener("change", (e) => {
if (!
localStorage.getItem (STORAGE_KEY)) {
applyTheme(e.matches ?
"dark" : "light");
}
});
})();


/* ============================================
7.          SCROLL TO TOP BUTTON
============================================ */
function toggleScrollTopBtn() {
if (!scrollTopBtn) return;
scrollTopBtn.classList.toggle(
"visible",
window.scrollY > 400
);
}
if (scrollTopBtn) {
scrollTopBtn.addEventListener("click", () => {
window.scrollTo({
top: 0,
behavior: "smooth"
});
});
}


/* ============================================
            8. SMOOTH SCROLL
============================================ */
(function initSmoothScroll() {
document.addEventListener("click", (e) => {
const anchor = e.target.closest('a[href^="#"]');
if (!anchor) return;
const targetId = anchor.getAttribute("href").slice(1);
/* href="#" → Scroll to top */
if (!targetId) {
e.preventDefault();
window.scrollTo({
top: 0,
behavior: "smooth"
});
return;
}
const target = qs("#" + targetId);
if (!target) return;
e.preventDefault();
const navbarHeight = parseInt(
getComputedStyle(document.documentElement)
.getPropertyValue("--navbar-height") || "72",
10
);
const top =
target.getBoundingClientRect().top +
window.scrollY -
navbarHeight;
window.scrollTo({
top,
behavior: "smooth"
});
});
})();


/* ============================================
              9. CONTACT FORM
============================================ */


emailjs.init({
  publicKey: "xigsG-OrKh4AhyA8Z",
});

(function initContactForm() {

  const form = qs("#contactForm");
  const submitBtn = qs("#submitBtn");
  const success = qs("#formSuccess");

  if (!form) return;

  const fields = {
    name: {
      el: qs("#name"),
      errEl: qs("#nameError")
    },
    email: {
      el: qs("#email"),
      errEl: qs("#emailError")
    },
    message: {
      el: qs("#message"),
      errEl: qs("#messageError")
    }
  };

  /* Validate One Field */
  function validateField(input, errEl) {

    const value = input.value.trim();
    let msg = "";

    if (input.required && !value) {
      msg = "This field is required.";
    }

    else if (input.type === "email") {

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRe.test(value)) {
        msg = "Please enter a valid email address.";
      }

    }

    else if (input.id === "name" && value.length < 2) {
      msg = "Name must be at least 2 characters.";
    }

    else if (input.id === "message" && value.length < 10) {
      msg = "Message must be at least 10 characters.";
    }

    input.classList.toggle("error", !!msg);
    errEl.textContent = msg;

    return !msg;
  }

  /* Real Time Validation */
  Object.values(fields).forEach(({ el, errEl }) => {

    el.addEventListener("blur", () => {
      validateField(el, errEl);
    });

    el.addEventListener("input", () => {
      validateField(el, errEl);
    });

  });

  /* Submit */
  form.addEventListener("submit", (e) => {

    e.preventDefault();

    const valid =
      validateField(fields.name.el, fields.name.errEl) &&
      validateField(fields.email.el, fields.email.errEl) &&
      validateField(fields.message.el, fields.message.errEl);

    if (!valid) return;

    submitBtn.disabled = true;
    
    const btnText = submitBtn.querySelector(".btn-text");
const btnLoading = submitBtn.querySelector(".btn-loading");

btnText.hidden = true;
btnLoading.hidden = false;
    
    
    emailjs.send(
  "portfolio_service",
  "template_3muuuvm",
  {
    name: fields.name.el.value,
    email: fields.email.el.value,
    message: fields.message.el.value,
    time: new Date().toLocaleString()
  }
)
.then(() => {

  btnText.hidden = false;
  btnLoading.hidden = true;
  
  form.hidden = true;
  success.hidden = false;

})
.catch((error) => {

  console.error(error);

  btnText.hidden = false;
  btnLoading.hidden = true;
  
  alert("❌ Message send failed. Please try again.");

})
.finally(() => {

  submitBtn.disabled = false;
  btnText.hidden = false;
  btnLoading.hidden = true;
});
    
})();
})();


/* ============================================
                10. FOOTER YEAR
============================================== */
(function setYear() {
const el = qs("#year");
if (el) {
el.textContent = new Date().getFullYear();
}
})();


/* ===============================================
           11. HERO CARD TILT EFFECT
============================================== */

(function initTiltEffect() {

  const card = qs(".hero__card");

  if (!card) return;

  /* Disable on touch devices */
  if (window.matchMedia("(pointer: coarse)").matches) return;

  card.addEventListener("mousemove", (e) => {

    const rect = card.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    const MAX_DEG = 8;

    card.style.transform = `
      perspective(600px)
      rotateY(${(dx * MAX_DEG).toFixed(2)}deg)
      rotateX(${(-dy * MAX_DEG).toFixed(2)}deg)
      translateY(-12px)
    `;

  });

  card.addEventListener("mouseleave", () => {

    card.style.transition = "transform 0.5s ease";
    card.style.transform = "translateY(0) rotateX(0) rotateY(0)";

    setTimeout(() => {
      card.style.transition = "";
    }, 500);

  });

})();


/*============================================
          12. STAT CHIPS ANIMATION
============================================ */
(function animateStats() {
const stats = qsa(".hero__stat");
stats.forEach((stat, i) => {
stat.style.opacity = "0";
stat.style.transform = "scale(0.8)";
setTimeout(() => {
stat.style.transition =
"opacity 0.5s ease, transform 0.5s ease";
stat.style.opacity = "1";
stat.style.transform = "scale(1)";
}, 1800 + i * 200);
});
})();

/* ============================================
        13. INITIAL ACTIVE NAV LINK
============================================ */

(function setInitialActiveLink() {

  const hash = window.location.hash.slice(1);

  if (!hash) return;

  const link = qs(`[data-nav="${hash}"]`);

  if (link) {

    qsa(".navbar__link").forEach(nav => {
      nav.classList.remove("active");
    });

    link.classList.add("active");

  }

})();


/* ============================================
        14. NUMBER COUNTER ANIMATION
============================================ */

function animateCounter(el, to, duration = 1200) {

  const start = Date.now();
  const from = parseInt(el.textContent, 10) || 0;

  function step() {

    const progress = Math.min(
      (Date.now() - start) / duration,
      1
    );

    const ease = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(
      from + (to - from) * ease
    );

    if (progress < 1) {
      requestAnimationFrame(step);
    }

  }

  requestAnimationFrame(step);

}


/*===========================================
         15. PROJECT CARD SHIMMER
============================================ */
(function initCardShimmer() {
qsa(".project-card").forEach(card => {
card.addEventListener("mousemove", (e) => {
const rect = card.getBoundingClientRect();
const x = (
(e.clientX - rect.left) /
rect.width * 100
).toFixed(1);
const y = (
(e.clientY - rect.top) /
rect.height * 100
).toFixed(1);
card.style.setProperty("--mouse-x", x + "%");
card.style.setProperty("--mouse-y", y + "%");
});
});
})();


/* ============================================
      16. SERVICE CARD ACCESSIBILITY
============================================ */
(function initServiceCardA11y() {
qsa(".service-card").forEach(card => {
card.setAttribute("tabindex", "0");
card.addEventListener("keydown", (e) => {
if (e.key === "Enter" || e.key === " ") {
card.classList.toggle("focused");
}
});
});
})();
/* ============================================
            17. LOADED MESSAGE
============================================ */
console.log(
"%c Ayush Portfolio — Loaded ✓ ",
"background:#2563eb;color:#fff;font-weight:bold;padding:4px 8px;border-radius:4px;"
);

