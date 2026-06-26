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
     7. CARRUSEL de Ejemplares
  ══════════════════════════════ */
  function initEjemplaresCarousel() {
    var carousel = document.getElementById("ejemplaresCarousel");
    if (!carousel) return;

    var track    = carousel.querySelector(".ejm-carousel__track");
    var btnPrev  = carousel.querySelector(".ejm-carousel__btn--prev");
    var btnNext  = carousel.querySelector(".ejm-carousel__btn--next");
    var dotsWrap = carousel.querySelector(".ejm-carousel__dots");
    var cards    = Array.from(track.querySelectorAll(".ejemplar-card"));

    if (!cards.length) return;

    var current = 0;

    function getVisible() {
      var w = carousel.offsetWidth;
      if (w < 580) return 1;
      if (w < 960) return 2;
      return 3;
    }

    function totalSlides() {
      return Math.max(1, cards.length - getVisible() + 1);
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      var total = totalSlides();
      if (total <= 1) return;
      for (var i = 0; i < total; i++) {
        var dot = document.createElement("button");
        dot.className = "ejm-carousel__dot" + (i === current ? " is-active" : "");
        dot.setAttribute("aria-label", "Ir al ejemplar " + (i + 1));
        (function(idx) {
          dot.addEventListener("click", function() { goTo(idx); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      var dots = dotsWrap.querySelectorAll(".ejm-carousel__dot");
      dots.forEach(function(d, i) {
        d.classList.toggle("is-active", i === current);
      });
    }

    function goTo(idx) {
      var total = totalSlides();
      current = Math.max(0, Math.min(idx, total - 1));

      var visible   = getVisible();
      var gap       = 32; // 2rem en px
      var cardWidth = (track.parentElement.offsetWidth - gap * (visible - 1)) / visible;
      var offset    = current * (cardWidth + gap);

      track.style.transform = "translateX(-" + offset + "px)";
      btnPrev.disabled = current === 0;
      btnNext.disabled = current >= total - 1;
      updateDots();
    }

    function resize() {
      buildDots();
      if (current >= totalSlides()) current = totalSlides() - 1;
      goTo(current);
    }

    // Swipe táctil
    var touchStartX = 0;
    track.addEventListener("touchstart", function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }, { passive: true });

    btnPrev.addEventListener("click", function() { goTo(current - 1); });
    btnNext.addEventListener("click", function() { goTo(current + 1); });

    window.addEventListener("resize", resize);
    resize();
  }

  /* ══════════════════════════════
     8. LIGHTBOX de galería
  ══════════════════════════════ */
  function initLightbox() {
    var lb        = document.getElementById("lightbox");
    var lbImg     = document.getElementById("lightboxImg");
    var lbName    = document.getElementById("lightboxName");
    var lbCounter = document.getElementById("lightboxCounter");
    var lbThumbs  = document.getElementById("lightboxThumbs");
    var lbClose   = document.getElementById("lightboxClose");
    var lbPrev    = document.getElementById("lightboxPrev");
    var lbNext    = document.getElementById("lightboxNext");
    if (!lb) return;

    var gallery = [];
    var current = 0;

    function showImg(idx) {
      current = idx;
      lbImg.src = gallery[idx];
      lbImg.style.animation = "none";
      lbImg.offsetWidth; // reflow
      lbImg.style.animation = "";
      lbCounter.textContent = gallery.length > 1 ? (idx + 1) + " / " + gallery.length : "";
      lbPrev.disabled = idx === 0;
      lbNext.disabled = idx === gallery.length - 1;
      lbThumbs.querySelectorAll(".lightbox__thumb").forEach(function(t, i) {
        t.classList.toggle("is-active", i === idx);
      });
    }

    function open(name, imgs, startIdx) {
      gallery = imgs;
      lbName.textContent = name;
      lbThumbs.innerHTML = "";
      if (imgs.length > 1) {
        imgs.forEach(function(src, i) {
          var t = document.createElement("img");
          t.src = src;
          t.className = "lightbox__thumb";
          t.alt = name + " foto " + (i + 1);
          t.addEventListener("click", function() { showImg(i); });
          lbThumbs.appendChild(t);
        });
      }
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      showImg(startIdx || 0);
    }

    function close() {
      lb.hidden = true;
      document.body.style.overflow = "";
      lbImg.src = "";
    }

    // Abrir al hacer click en .gallery-trigger
    document.querySelectorAll(".gallery-trigger").forEach(function(trigger) {
      trigger.addEventListener("click", function() {
        var card = trigger.closest("[data-gallery]");
        if (!card) return;
        var imgs = JSON.parse(card.dataset.gallery || "[]");
        var name = card.dataset.name || "";
        if (!imgs.length) return;
        open(name, imgs, 0);
      });
    });

    lbClose.addEventListener("click", close);
    lbPrev.addEventListener("click", function() { if (current > 0) showImg(current - 1); });
    lbNext.addEventListener("click", function() { if (current < gallery.length - 1) showImg(current + 1); });

    // Cerrar al hacer clic en el fondo
    lb.addEventListener("click", function(e) { if (e.target === lb) close(); });

    // Teclado: Escape cierra, flechas navegan
    document.addEventListener("keydown", function(e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft"  && current > 0) showImg(current - 1);
      if (e.key === "ArrowRight" && current < gallery.length - 1) showImg(current + 1);
    });

    // Swipe táctil en el lightbox
    var swipeX = 0;
    lbImg.addEventListener("touchstart", function(e) { swipeX = e.touches[0].clientX; }, { passive: true });
    lbImg.addEventListener("touchend", function(e) {
      var diff = swipeX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && current < gallery.length - 1) showImg(current + 1);
        if (diff < 0 && current > 0) showImg(current - 1);
      }
    }, { passive: true });
  }

  /* ══════════════════════════════
     9. CARRUSEL de Cachorros
  ══════════════════════════════ */
  function initCachorrosCarousel() {
    var carousel = document.getElementById("cachorrosCarousel");
    if (!carousel) return;

    var track    = carousel.querySelector(".ejm-carousel__track");
    var btnPrev  = carousel.querySelector(".ejm-carousel__btn--prev");
    var btnNext  = carousel.querySelector(".ejm-carousel__btn--next");
    var dotsWrap = carousel.querySelector(".ejm-carousel__dots");
    var cards    = Array.from(track.querySelectorAll(".puppy-card"));

    if (!cards.length) return;

    var current = 0;

    function getVisible() {
      var w = carousel.offsetWidth;
      if (w < 580) return 1;
      if (w < 960) return 2;
      return 3;
    }

    function totalSlides() {
      return Math.max(1, cards.length - getVisible() + 1);
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      var total = totalSlides();
      if (total <= 1) return;
      for (var i = 0; i < total; i++) {
        var dot = document.createElement("button");
        dot.className = "ejm-carousel__dot" + (i === current ? " is-active" : "");
        dot.setAttribute("aria-label", "Ir al cachorro " + (i + 1));
        (function(idx) {
          dot.addEventListener("click", function() { goTo(idx); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      var dots = dotsWrap.querySelectorAll(".ejm-carousel__dot");
      dots.forEach(function(d, i) {
        d.classList.toggle("is-active", i === current);
      });
    }

    function goTo(idx) {
      var total = totalSlides();
      current = Math.max(0, Math.min(idx, total - 1));
      var visible   = getVisible();
      var gap       = 32;
      var cardWidth = (track.parentElement.offsetWidth - gap * (visible - 1)) / visible;
      var offset    = current * (cardWidth + gap);
      track.style.transform = "translateX(-" + offset + "px)";
      btnPrev.disabled = current === 0;
      btnNext.disabled = current >= total - 1;
      updateDots();
    }

    function resize() {
      buildDots();
      if (current >= totalSlides()) current = totalSlides() - 1;
      goTo(current);
    }

    var touchStartX = 0;
    track.addEventListener("touchstart", function(e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener("touchend", function(e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }, { passive: true });

    btnPrev.addEventListener("click", function() { goTo(current - 1); });
    btnNext.addEventListener("click", function() { goTo(current + 1); });

    window.addEventListener("resize", resize);
    resize();
  }

  /* ══════════════════════════════
     BOOT — arranca todo
  ══════════════════════════════ */
  function boot() {
    safe(initLogoFallback,        "initLogoFallback");
    safe(initNavbar,              "initNavbar");
    safe(initSmoothScroll,        "initSmoothScroll");
    safe(initReveal,              "initReveal");
    safe(initCounters,            "initCounters");
    safe(initForm,                "initForm");
    safe(initTilt,                "initTilt");
    safe(initLightbox,            "initLightbox");
    safe(initEjemplaresCarousel,  "initEjemplaresCarousel");
    safe(initCachorrosCarousel,   "initCachorrosCarousel");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
