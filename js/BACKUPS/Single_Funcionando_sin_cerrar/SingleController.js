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

/**
 * Extrae los parámetros de la URL priorizando el Hash (#) 
 * que es lo que cambia al navegar entre versiones.
 */
function readUrlParams() {
  // Intentamos leer del hash primero, si no hay nada, buscamos en la query string
  const hashString = window.location.hash.substring(1);
  const queryString = window.location.search.substring(1);

  const params = new URLSearchParams(hashString || queryString);

  const releaseId = params.get("release_id");
  const masterId = params.get("master_id");
  const fromFormat = params.get("format") ?? "7";
  const typeOfVersion = params.get("type");

  console.log("[SingleController] Params detectados:", { releaseId, masterId, fromFormat, typeOfVersion });

  const toFormat = fromFormat === "7" ? "12" : "7";
  return { releaseId, masterId, fromFormat, toFormat, typeOfVersion };
}

/**
 * Limpia los contenedores de la vista para evitar que la información
 * se duplique o se acumule al navegar sin recargar la página.
 */
function clearAllViews() {
  const selectors = [".single-result", ".versions-list", ".discos"];
  selectors.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = "";
  });
}

/**
 * Función principal de inicialización
 */
export async function init() {
  // 1. Actualizar elementos comunes de la interfaz
  addListenLinkToNavbar();

  // 2. Limpiar el DOM antes de la nueva carga
  clearAllViews();

  // 3. Leer los parámetros actuales de la URL/Hash
  const { releaseId, masterId, toFormat, typeOfVersion } = readUrlParams();

  if (!releaseId) {
    console.warn("[SingleController] No se detectó release_id. Esperando interacción.");
    return;
  }

  try {
    // 4. Obtener y renderizar el release principal
    const data = await fetchRelease(releaseId);
    renderSingleDisco(data, typeOfVersion);

    // 5. Si es una búsqueda inicial y tiene un master_id, buscar versiones y compilaciones
    if (masterId && masterId !== "0" && typeOfVersion === "search") {
      // Cargar versiones alternativas (ej. si es 7", busca 12")
      const versions = await fetchVersions(masterId, toFormat);
      renderVersions(versions, toFormat);

      // Cargar compilaciones donde aparece el artista/título
      const artistName = data.artists?.[0]?.name ?? "";
      const compilations = await fetchCompilations(data.title, artistName);
      renderCompilations(compilations);
    }
  } catch (error) {
    console.error("[SingleController] Error fatal en la carga de datos:", error);
  }
}