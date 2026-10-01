/* =========================================================
   XV Abril Aracely — variante "Nocturno"
   ARCHIVO NUEVO. Solo lo usa index-3.html. Sin dependencias.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Entrada de la portada (único momento de movimiento)
     --------------------------------------------------------- */
  var cover = document.querySelector(".cover");

  if (cover) {
    cover.classList.add("js-reveal");

    var revealed = false;
    var reveal = function () {
      if (revealed) return;
      revealed = true;
      cover.classList.add("is-ready");
    };

    if (document.readyState === "complete") {
      window.setTimeout(reveal, 120);
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(reveal, 180);
      });
    }
    window.setTimeout(reveal, 2500);
  }

  /* ---------------------------------------------------------
     2. Cuenta regresiva
     --------------------------------------------------------- */
  var clock = document.querySelector("[data-countdown]");

  if (clock) {
    var target = new Date(clock.getAttribute("data-countdown")).getTime();
    var slots = {
      days: clock.querySelector('[data-unit="days"]'),
      hours: clock.querySelector('[data-unit="hours"]'),
      minutes: clock.querySelector('[data-unit="minutes"]'),
      seconds: clock.querySelector('[data-unit="seconds"]')
    };

    var pad = function (n) {
      return n < 10 ? "0" + n : String(n);
    };

    var tick = function () {
      var left = target - Date.now();
      if (left < 0) left = 0;

      var totalSeconds = Math.floor(left / 1000);
      slots.days.textContent = String(Math.floor(totalSeconds / 86400));
      slots.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
      slots.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
      slots.seconds.textContent = pad(totalSeconds % 60);
    };

    tick();
    window.setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     3. Barra superior: aparece al salir de la portada
     --------------------------------------------------------- */
  var masthead = document.querySelector(".masthead");

  if (masthead && cover && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        masthead.classList.toggle("is-visible", !entries[0].isIntersecting);
      },
      { rootMargin: "-70% 0px 0px 0px" }
    ).observe(cover);
  }

  /* ---------------------------------------------------------
     4. Confirmación de asistencia → WhatsApp
     --------------------------------------------------------- */
  var form = document.getElementById("rsvp-form");

  if (form) {
    var phone = form.getAttribute("data-phone") || "";
    var nameInput = form.querySelector("#rsvp-name");
    var guestSelect = form.querySelector("#rsvp-guests");
    var yes = form.querySelector("#rsvp-yes");
    var no = form.querySelector("#rsvp-no");
    var message = form.querySelector("#rsvp-message");

    var say = function (text, kind) {
      message.textContent = text;
      message.className = "form-msg" + (kind ? " form-msg--" + kind : "");
    };

    var syncGuests = function () {
      guestSelect.disabled = no.checked;
      if (no.checked) guestSelect.value = "";
    };

    yes.addEventListener("change", syncGuests);
    no.addEventListener("change", syncGuests);
    syncGuests();

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = nameInput.value.trim();

      if (!name) {
        say("Escribe tu nombre o el de tu familia para continuar.", "warn");
        nameInput.focus();
        return;
      }

      if (yes.checked && !guestSelect.value) {
        say("Indica cuántas personas asistirán.", "warn");
        guestSelect.focus();
        return;
      }

      var lines = [
        "XV Abril Aracely",
        "Nombre: " + name,
        "Asistencia: " + (yes.checked ? "Sí asistiré" : "No podré asistir")
      ];

      if (yes.checked) {
        lines.push("Personas: " + guestSelect.value);
      }

      var url =
        "https://wa.me/" +
        encodeURIComponent(phone) +
        "?text=" +
        encodeURIComponent(lines.join("\n"));

      window.open(url, "_blank", "noopener");

      say("Listo. Terminamos de enviar tu confirmación en WhatsApp.", "ok");

      form.reset();
      syncGuests();
    });
  }

  /* ---------------------------------------------------------
     5. Visor de galería
     --------------------------------------------------------- */
  var gallery = document.querySelector("[data-gallery]");
  var viewer = document.querySelector("[data-viewer]");

  if (gallery && viewer) {
    var links = Array.prototype.slice.call(gallery.querySelectorAll("a"));
    var frame = viewer.querySelector("[data-viewer-img]");
    var closeBtn = viewer.querySelector(".viewer__close");
    var index = 0;
    var lastFocus = null;

    var show = function (i) {
      index = (i + links.length) % links.length;
      var link = links[index];
      frame.src = link.getAttribute("href");
      frame.alt = "Fotografía " + (index + 1) + " de " + links.length;
    };

    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      viewer.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    var close = function () {
      viewer.classList.remove("is-open");
      frame.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    links.forEach(function (link, i) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        open(i);
      });
    });

    viewer.addEventListener("click", function (event) {
      var action = event.target.getAttribute("data-action");
      if (action === "close" || event.target === viewer) close();
      if (action === "prev") show(index - 1);
      if (action === "next") show(index + 1);
    });

    document.addEventListener("keydown", function (event) {
      if (!viewer.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
  }
})();
