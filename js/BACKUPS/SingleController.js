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
  // Intentamos leer de la query string (?) O del hash (#) por si el servidor redirige
  const queryString = window.location.search || window.location.hash.substring(1);
  const params = new URLSearchParams(queryString);
  
  const releaseId = params.get("release_id");
  const masterId = params.get("master_id");
  const fromFormat = params.get("format") ?? "7";
  const typeOfVersion = params.get("type");
  
  console.log("[SingleController] Params detectados:", { releaseId, masterId, fromFormat, typeOfVersion });

  const toFormat = fromFormat === "7" ? "12" : "7";
  return { releaseId, masterId, fromFormat, toFormat, typeOfVersion };
}

export async function init() {
  addListenLinkToNavbar();

  const { releaseId, masterId, toFormat, typeOfVersion } = readUrlParams();

  if (!releaseId) {
    console.error("[SingleController] ERROR: No hay release_id en la URL ni en el Hash.");
    return;
  }

  try {
    const data = await fetchRelease(releaseId);
    renderSingleDisco(data, typeOfVersion);

    if (masterId && masterId !== "0" && typeOfVersion === "search") {
      const versions = await fetchVersions(masterId, toFormat);
      renderVersions(versions, toFormat);

      const compilations = await fetchCompilations(data.title, data.artists?.[0]?.name ?? "");
      renderCompilations(compilations);
    }
  } catch (error) {
    console.error("[SingleController] Error fatal:", error);
  }
}
