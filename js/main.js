// =============================================================================
// ENTRY POINT: main.js
// Responsabilidad: Arrancar la aplicación.
// Importa el Controlador y lo inicializa cuando el DOM está listo.
// Todo el código de búsqueda, renderizado y lógica vive en:
//   - js/models/SearchModel.js   → datos y API
//   - js/views/SearchView.js     → DOM y renderizado
//   - js/controllers/SearchController.js → coordinación y eventos
// =============================================================================

import { init } from "./controllers/SearchController.js";
import { addListenLinkToNavbar } from "./views/NavView.js";
import { initCookieBanner } from "./utils/CookieBanner.js";
import { initFooter } from "./views/FooterView.js";

document.addEventListener("DOMContentLoaded", function () {
  init();
  addListenLinkToNavbar();
  initCookieBanner();
  initFooter();
});
