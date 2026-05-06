// =============================================================================
// ENTRY POINT: single_main.js
// =============================================================================

console.log("[single_main.js] URL detectada al cargar:", window.location.href);
console.log("[single_main.js] Query string:", window.location.search);

import { init } from "./controllers/SingleController.js";

document.addEventListener("DOMContentLoaded", () => {
  init();
});
