// =============================================================================
// MAIN: listen_main.js
// Punto de entrada para la página de Playlist (listen.html).
// =============================================================================

import { init } from "./controllers/ListenController.js";
import { initCookieBanner } from "./utils/CookieBanner.js";
import { initFooter } from "./views/FooterView.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[ListenMain] Bootstrapping Listen page...");
  init();
  initCookieBanner();
  initFooter();
});
