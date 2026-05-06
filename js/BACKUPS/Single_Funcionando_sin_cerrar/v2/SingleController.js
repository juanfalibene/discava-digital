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
 * Lee los parámetros de la URL priorizando el Hash (#) para permitir
 * la navegación reactiva en el servidor remoto.
 */
function readUrlParams() {
  const hashString = window.location.hash.substring(1);
  const queryString = window.location.search.substring(1);

  // Fusionamos ambos, pero el hash tiene prioridad para capturar cambios de estado
  const params = new URLSearchParams(hashString || queryString);

  const releaseId = params.get("release_id");
  const masterId = params.get("master_id");
  const fromFormat = params.get("format") ?? "7";
  const typeOfVersion = params.get("type");

  const toFormat = fromFormat === "7" ? "12" : "7";

  return { releaseId, masterId, fromFormat, toFormat, typeOfVersion };
}

/**
 * Limpia los contenedores de la vista para que al navegar entre discos
 * la información nueva reemplace a la antigua.
 */
function clearAllViews() {
  const selectors = [".single-result", ".versions-list", ".discos"];
  selectors.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = "";
  });
}

/**
 * Inicializa la carga de datos del disco y sus versiones relacionadas.
 */
export async function init() {
  console.log("[SingleController] Inicializando carga de datos...");

  // 1. Actualizar elementos globales de la interfaz
  addListenLinkToNavbar();

  // 2. Limpiar el DOM antes de renderizar el nuevo contenido
  clearAllViews();

  // 3. Obtener parámetros de la URL
  const { releaseId, masterId, toFormat, typeOfVersion } = readUrlParams();

  if (!releaseId) {
    console.warn("[SingleController] No se encontró release_id en la URL.");
    return;
  }

  try {
    // 4. Obtener y renderizar el disco principal (Release)
    const data = await fetchRelease(releaseId);
    renderSingleDisco(data, typeOfVersion);

    // 5. Cargar contenido extra (Versiones y Compilaciones)
    // Eliminamos la restricción estricta de 'type' para que al volver atrás 
    // desde una versión, los resultados secundarios se vuelvan a pintar.
    if (masterId && masterId !== "0") {

      // Buscamos versiones en el formato opuesto (7" <-> 12")
      const versions = await fetchVersions(masterId, toFormat);
      renderVersions(versions, toFormat);

      // Buscamos compilaciones basadas en el artista y título del release actual
      const artistName = data.artists?.[0]?.name ?? "";
      const compilations = await fetchCompilations(data.title, artistName);
      renderCompilations(compilations);

      console.log("[SingleController] Datos extra renderizados correctamente.");
    }

  } catch (error) {
    console.error("[SingleController] Error crítico durante la ejecución:", error);
  }
}