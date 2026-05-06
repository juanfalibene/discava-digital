// =============================================================================
// CONTROLADOR: SearchController.js
// Responsabilidad: Coordinar el Modelo y la Vista.
// Escucha eventos de la Vista, pide datos al Modelo, y le pasa el resultado a la Vista.
// =============================================================================

import { fetchReleases, sortByYear, sortByWant } from "../models/SearchModel.js";
import {
  searchInput,
  genreMenu,
  btnFormat7,
  btnFormat12,
  btnSearch,
  emptyContainer,
  clearDiscos,
  renderDiscos,
  renderNoResults,
  renderPagination,
  clearPagination,
  renderFilterButton,
  scrollToSection,
  initHeaderScroll,
} from "../views/SearchView.js";

// --- Estado interno del Controlador ---
// Guarda el formato seleccionado (7" o 12") y el tipo de búsqueda actual.
let selectedFormat = "7";
let currentQueryType = undefined;

// --- Inicialización ---
// Punto de entrada: registra todos los event listeners.
export function init() {
  // Escucha cambios en los botones de radio (formato 7" / 12")
  btnFormat7.addEventListener("change", (e) => {
    if (e.target.checked) selectedFormat = e.target.value;
  });
  btnFormat12.addEventListener("change", (e) => {
    if (e.target.checked) selectedFormat = e.target.value;
  });

  // Escucha el click en "Start Digging"
  btnSearch.addEventListener("click", async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    emptyContainer();
    await search(query, genreMenu.value, selectedFormat, 1);
  });

  // Inicializa el efecto scroll del header
  initHeaderScroll();

  // Inicializa las portadas recomendadas del hero (si existen en la página)
  initRecommendedCovers();
}

// --- Función central de búsqueda ---
// Orquesta: llama al Modelo, recibe datos, llama a la Vista para renderizar.
async function search(query, genre, format, page = 1, label) {
  // Enviamos el evento a GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'search_performed',
    'search_term': query || 'discovery_mode',
    'search_genre': genre,
    'search_format': format,
    'search_type': label ? 'label_click' : 'manual_search'
  });

  // Si cambia el tipo de búsqueda (label vs búsqueda normal), vaciamos los resultados
  const newQueryType = label ? "label" : "search";
  if (currentQueryType !== newQueryType) {
    currentQueryType = newQueryType;
    emptyContainer();
  }

  const filterFormat = `&format=${format}`;

  try {
    const data = await fetchReleases(query, genre, format, page, label);
    const { pagination, results } = data;

    if (pagination.items >= 1) {
      // Si la búsqueda es vacía (modo descubrimiento), limitamos a 25 resultados
      const finalResults = query === "" ? results.slice(0, 25) : results;
      
      // La Vista renderiza los discos recibidos del Modelo
      renderDiscos(finalResults, filterFormat);
    } else {
      // Fix #3: sin resultados → mensaje de feedback
      renderNoResults(query);
    }

    // Creamos los botones de filtro e inyectamos los callbacks
    // Fix #1: usamos clearDiscos() de la Vista en lugar de tocar el DOM directamente
    renderFilterButton("year", () => {
      clearDiscos();
      renderDiscos(sortByYear(results.slice()), filterFormat);
      clearPagination();
    });

    renderFilterButton("most wanted", () => {
      clearDiscos();
      renderDiscos(sortByWant(results.slice()), filterFormat);
      clearPagination();
    });

    // Solo mostramos paginación en búsquedas normales (no por label)
    if (currentQueryType === "search" && label === undefined) {
      // Inyectamos el callback de paginación: al hacer click en un número de página,
      // el Controlador lanza una nueva búsqueda en esa página
      renderPagination(pagination, async (pageNumber) => {
        emptyContainer();
        await search(searchInput.value, genreMenu.value, selectedFormat, pageNumber);
        scrollToSection("results");
      });
    } else {
      clearPagination();
    }
  } catch (error) {
    console.error("[Controller] Error en la búsqueda:", error);
  }
}

// --- Portadas recomendadas del Hero ---
// Escucha clicks en .single-cover y lanza una búsqueda por label
function initRecommendedCovers() {
  const singleCovers = document.querySelectorAll(".single-cover");
  singleCovers.forEach((div) => {
    const dataLabel = div.getAttribute("data-label");
    div.addEventListener("click", async (e) => {
      e.preventDefault();
      emptyContainer();
      await search(searchInput.value, genreMenu.value, selectedFormat, 1, dataLabel);
      scrollToSection("results");
    });
  });
}
