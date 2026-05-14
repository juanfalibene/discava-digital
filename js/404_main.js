/**
 * 404_main.js
 * Entry point for the 404 error page.
 */

import { addListenLinkToNavbar } from "./views/NavView.js";
import { initCookieBanner } from "./utils/CookieBanner.js";
import { initFooter } from "./views/FooterView.js";

document.addEventListener("DOMContentLoaded", () => {
  addListenLinkToNavbar();
  initCookieBanner();
  initFooter();
});
