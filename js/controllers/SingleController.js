// =============================================================================
// CONTROLADOR: SingleController.js
// =============================================================================

import { fetchRelease, fetchVersions, fetchCompilations } from "../models/SingleModel.js";
import {
  renderSingleDisco,
  renderVersions,
  renderCompilations,
} from "../views/SingleView.js";
import { addListenLinkToNavbar } from "../views/NavView.js";

function readUrlParams() {
  const hashString = window.location.hash.substring(1);
  const queryString = window.location.search.substring(1);
  const params = new URLSearchParams(hashString || queryString);

  const releaseId = params.get("release_id");
  const masterId = params.get("master_id");
  const fromFormat = params.get("format") ?? "7";
  const typeOfVersion = params.get("type");

  const toFormat = fromFormat === "7" ? "12" : "7";
  return { releaseId, masterId, fromFormat, toFormat, typeOfVersion };
}

/**
 * Resetea los estilos globales y limpia contenedores.
 * Esto asegura que si venimos de un modal (fondo negro, secciones ocultas),
 * la página vuelva a su estado original.
 */
function resetPageState() {
  // 1. Limpiar contenedores
  const selectors = [".single-result", ".versions-list", ".discos"];
  selectors.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = "";
  });

  // 2. Forzar reset de estilos que aplica el modal
  document.body.style.background = "";
  const header = document.querySelector(".header");
  if (header) header.classList.remove("on-single-modal");

  // 3. Mostrar los contenedores de resultados que el modal pudo haber ocultado
  const otherResults = document.querySelector(".other-versions-results");
  const compResults = document.querySelector(".compilations-versions-results");
  if (otherResults) otherResults.classList.remove("hide-div");
  if (compResults) compResults.classList.remove("hide-div");
}

export async function init() {
  console.log("[SingleController] Ejecutando carga...");

  addListenLinkToNavbar();

  // Paso clave: resetear TODO antes de empezar
  resetPageState();

  const { releaseId, masterId, toFormat, typeOfVersion } = readUrlParams();

  if (!releaseId) {
    window.location.replace("./index.html#diggin");
    return;
  }

  try {
    const data = await fetchRelease(releaseId);

    // Renderizamos el disco principal
    renderSingleDisco(data, typeOfVersion);

    // Si hay un masterId, disparamos las búsquedas laterales
    // Quitamos 'typeOfVersion === search' para que siempre intente traerlas 
    // al volver atrás a la página principal del release.
    if (masterId && masterId !== "0") {

      const versions = await fetchVersions(masterId, toFormat);
      renderVersions(versions, toFormat);

      const artistName = data.artists?.[0]?.name ?? "";
      const compilations = await fetchCompilations(data.title, artistName);
      renderCompilations(compilations);
    }

  } catch (error) {
    console.error("[SingleController] Error:", error);
  }
}