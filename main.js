/* ============================================================
   IsabellaRoyal Shih Tzu — JavaScript principal
   Patrón IIFE: sin módulos ES, compatible con file:// y CDN
   Versión: 2026-06-25
============================================================ */
(function () {
  "use strict";

  /* ── Utilidad: ejecuta fn con try/catch, loguea si falla ── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ══════════════════════════════
     1. NAVBAR: solidifica en scroll
        + activa link según sección visible
  ══════════════════════════════ */
  function initNavbar() {
    var navbar = document.getElementById("navbar");
    var toggle = document.getElementById("navToggle");
    var menu   = document.getElementById("navMenu");
    var links  = document.querySelectorAll(".navbar__link");

    if (!navbar) return;

    /* Solidifica al bajar */
    function onScroll() {
      if (window.scrollY > 40) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Hamburguesa */
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });

      /* Cierra el menú al hacer click en un link */
      links.forEach(function (link) {
        link.addEventListener("click", function () {
          menu.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });

      /* Cierra al hacer click fuera */
      document.addEventListener("click", function (e) {
        if (!navbar.contains(e.target) && menu.classList.contains("is-open")) {
          menu.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    }

    /* Link activo según sección visible */
    var sections = document.querySelectorAll("section[id]");

    function updateActiveLink() {
      var scrollY = window.scrollY + var_navH() + 40;
      sections.forEach(function (sec) {
        var top    = sec.offsetTop;
        var bottom = top + sec.offsetHeight;
        var id     = sec.getAttribute("id");
        var link   = document.querySelector('.navbar__link[href="#' + id + '"]');
        if (link) {
          link.classList.toggle("is-active", scrollY >= top && scrollY < bottom);
        }
      });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();
  }

  function var_navH() {
    return parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "72"
    );
  }

  /* ══════════════════════════════
     2. SCROLL SUAVE para anclas
  ══════════════════════════════ */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = var_navH() + 16;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      var reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }

  /* ══════════════════════════════
     3. REVEAL en scroll con IntersectionObserver
  ══════════════════════════════ */
  function initReveal() {
    var elements = document.querySelectorAll(".reveal");
    if (!elements.length || !("IntersectionObserver" in window)) {
      elements.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -4% 0px" });

    elements.forEach(function (el) { io.observe(el); });

    /* Seguridad a 6 s: revela cualquier elemento que aún esté oculto en viewport */
    setTimeout(function () {
      elements.forEach(function (el) {
        if (!el.classList.contains("is-visible")) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            el.classList.add("is-visible");
          }
        }
      });
    }, 6000);
  }

  /* ══════════════════════════════
     4. FORMULARIO de contacto
  ══════════════════════════════ */
  function initForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.reportValidity()) return;

      var btn = form.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Enviando…';
      }

      /* Simula envío. Reemplaza este bloque con tu integración real
         (Formspree, EmailJS, fetch a tu endpoint, etc.) */
      setTimeout(function () {
        form.style.display = "none";

        var success = form.parentElement.querySelector(".form-success");
        if (!success) {
          success = document.createElement("div");
          success.className = "form-success";
          success.innerHTML = [
            '<div class="form-success__icon"><i class="fa-solid fa-circle-check"></i></div>',
            '<h3 class="form-success__title">¡Mensaje enviado!</h3>',
            '<p class="form-success__text">Te responderemos a la brevedad por email o WhatsApp. ¡Gracias por tu interés!</p>'
          ].join("");
          form.parentElement.appendChild(success);
        }
        success.classList.add("is-visible");
      }, 1200);
    });
  }

  /* ══════════════════════════════
     5. LOGO placeholder visual
        Si src="" → muestra emoji pata
  ══════════════════════════════ */
  function initLogoFallback() {
    var logos = document.querySelectorAll(".navbar__logo-img");
    logos.forEach(function (img) {
      if (!img.getAttribute("src")) {
        img.style.display = "none";
        var fallback = document.createElement("span");
        fallback.setAttribute("aria-hidden", "true");
        fallback.style.cssText = [
          "width:48px;height:48px;border-radius:50%;",
          "background:linear-gradient(135deg,#FFC0CB,#DAA520);",
          "display:inline-flex;align-items:center;justify-content:center;",
          "font-size:1.5rem;flex-shrink:0;border:2px solid #FFC0CB;"
        ].join("");
        fallback.textContent = "🐾";
        img.parentElement.insertBefore(fallback, img);
      }
    });
  }

  /* ══════════════════════════════
     6. CONTADORES animados (stats)
  ══════════════════════════════ */
  function initCounters() {
    var counters = document.querySelectorAll(".about__stat-num");
    if (!counters.length || !("IntersectionObserver" in window)) return;

    var reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animateCount(el) {
      var raw    = el.textContent.trim();
      var suffix = raw.replace(/[\d,.]+/, "");
      var num    = parseFloat(raw.replace(/[^\d.]/g, "")) || 0;

      if (reducedMotion || num === 0) return;

      var start    = 0;
      var duration = 1400;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
        var current  = Math.round(eased * num);

        if (raw.includes(".")) {
          current = (eased * num).toFixed(1);
        }
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      el.textContent = "0" + suffix;
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { io.observe(el); });
  }

  /* ══════════════════════════════
     7. TILT sutil en cards (solo
        dispositivos con hover real)
  ══════════════════════════════ */
  function initTilt() {
    if (matchMedia("(hover: none)").matches) return;

    var cards = document.querySelectorAll(
      ".ejemplar-card, .puppy-card, .care-card, .value-card"
    );

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect    = card.getBoundingClientRect();
        var cx      = rect.left + rect.width  / 2;
        var cy      = rect.top  + rect.height / 2;
        var dx      = (e.clientX - cx) / (rect.width  / 2);
        var dy      = (e.clientY - cy) / (rect.height / 2);
        var maxTilt = 5;
        card.style.transform = [
          "translateY(-4px)",
          "perspective(600px)",
          "rotateX(" + (-dy * maxTilt) + "deg)",
          "rotateY(" + ( dx * maxTilt) + "deg)"
        ].join(" ");
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        card.style.transition = "transform 0.4s ease";
      });

      card.addEventListener("mouseenter", function () {
        card.style.transition = "transform 0.08s ease";
      });
    });
  }

  /* ══════════════════════════════
     BOOT — arranca todo
  ══════════════════════════════ */
  function boot() {
    safe(initLogoFallback, "initLogoFallback");
    safe(initNavbar,       "initNavbar");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initReveal,       "initReveal");
    safe(initCounters,     "initCounters");
    safe(initForm,         "initForm");
    safe(initTilt,         "initTilt");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
