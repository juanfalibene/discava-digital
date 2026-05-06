// =============================================================================
// ENTRY POINT: single_main.js
// =============================================================================

console.log("[single_main.js] URL detectada al cargar:", window.location.href);
console.log("[single_main.js] Query string:", window.location.search);

// js/single_main.js
import { init } from "./controllers/SingleController.js";
import { initCookieBanner } from "./utils/CookieBanner.js";
import { initFooter } from "./views/FooterView.js";

document.addEventListener("DOMContentLoaded", () => {
  init();
  initCookieBanner();
  initFooter();
});

// ESTO ES LO QUE FALTA:
// Escucha cuando el usuario hace clic en una versión/compilación y cambia el #URL
window.addEventListener("hashchange", () => {
  console.log("[single_main.js] El Hash ha cambiado, reiniciando controlador...");
  init();
});
