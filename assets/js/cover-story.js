/* Entrada de la portada: una sola secuencia al cargar la página.
   Archivo NUEVO. No modifica assets/js/script.js. */
(function () {
  "use strict";

  var cover = document.querySelector(".cover");
  if (!cover) return;

  cover.classList.add("js-reveal");

  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    cover.classList.add("is-ready");
  }

  // El preloader se desvanece tras window.load; la entrada arranca después.
  if (document.readyState === "complete") {
    setTimeout(reveal, 200);
  } else {
    window.addEventListener("load", function () {
      setTimeout(reveal, 400);
    });
  }

  // Red de seguridad: si la carga se demora, muestra igual el contenido.
  setTimeout(reveal, 3000);

  // La cuenta regresiva de assets/js/script.js se redibuja cada segundo
  // con etiquetas en inglés. Aquí se traducen sin tocar ese archivo.
  var clock = cover.querySelector("#clock");
  if (!clock || !window.MutationObserver) return;

  var labels = { Days: "días", Hours: "horas", Mins: "min", Secs: "seg" };

  function translate() {
    var spans = clock.querySelectorAll(".box span");
    for (var i = 0; i < spans.length; i++) {
      var next = labels[spans[i].textContent.trim()];
      if (next) spans[i].textContent = next;
    }
  }

  new MutationObserver(translate).observe(clock, {
    childList: true,
    subtree: true,
    characterData: true
  });

  translate();
})();
