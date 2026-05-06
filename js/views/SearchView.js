// =============================================================================
// VISTA: SearchView.js
// Responsabilidad: Manipulación del DOM. Renderizar datos en la pantalla.
// Conoce el HTML, pero no llama a la API ni contiene lógica de negocio.
// =============================================================================

// --- Referencias al DOM ---
// Centralizamos aquí todos los querySelector/getElementById de la búsqueda.
export const searchInput = document.getElementById("search-query");
export const genreMenu = document.getElementById("menu-genre");
export const btnFormat7 = document.getElementById("7");
export const btnFormat12 = document.getElementById("12");
export const btnSearch = document.getElementById("search-btn");

// --- Limpiar contenedores ---
// Vacía el contenedor de tarjetas y el de filtros.
export function emptyContainer() {
  document.querySelector(".discos").innerHTML = "";
  document.querySelector(".disco-filters").innerHTML = "";
}

// --- Limpiar solo las tarjetas de discos ---
// Fix #1: el Controlador llama a esto en lugar de tocar .discos directamente.
export function clearDiscos() {
  document.querySelector(".discos").innerHTML = "";
}

// --- Renderizar resultados ---
// Toma un array de objetos "disco" y los muestra en pantalla usando el <template> del HTML.
export function renderDiscos(results, filterFormat) {
  const container = document.querySelector(".discos");
  const template = document.querySelector("#disco").content;
  const resultsContainer = document.querySelector("#results");
  resultsContainer.style.display = "block";

  for (const disco of results) {
    const div = template.cloneNode(true);

    const aSingleHref = div.querySelector("a");
    const coverDiscoImg = div.querySelector("img");
    const discoTitleP = div.querySelector(".disco-title");
    const discoYearP = div.querySelector(".disco-year");
    const discoLabelP = div.querySelector(".disco-label");

    const params = new URLSearchParams({
      release_id: disco.id,
      master_id: disco.master_id,
      type: "search",
      format: disco.format?.[0]?.includes("12") ? "12" : "7"
    });

    // Usamos '#' para que el servidor no toque los parámetros
    aSingleHref.href = `./single.html#${params.toString()}`;

    coverDiscoImg.src =
      disco.cover_image.includes("spacer.gif") || disco.cover_image === ""
        ? "./../img/cover.jpg"
        : disco.cover_image;
    coverDiscoImg.alt = disco.title;

    discoTitleP.textContent = disco.title;
    discoYearP.textContent = `${disco.country} — ${disco.year}`;
    discoLabelP.textContent = disco.label?.[0] ?? "";

    container.appendChild(div);
  }
}

// --- Mensaje de sin resultados ---
// Fix #3: muestra feedback al usuario cuando la API no devuelve resultados.
export function renderNoResults(query) {
  const container = document.querySelector(".discos");
  const resultsContainer = document.querySelector("#results");
  resultsContainer.style.display = "flex";

  const msg = document.createElement("p");
  msg.classList.add("no-results-msg");
  msg.textContent = query
    ? `No results found for "${query}". Try a different artist, title, or keyword.`
    : "Please enter an artist or title to search.";
  container.appendChild(msg);
}

// --- Renderizar paginación ---
// Fix #4: muestra máximo MAX_VISIBLE_PAGES números. Si hay más, añade "..." al final.
// Recibe un callback "onPageClick(pageNumber)" que el Controlador inyectará.
const MAX_VISIBLE_PAGES = 10;

export function renderPagination(pagination, onPageClick) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const numOfResults = document.createElement("p");
  numOfResults.classList.add("pagination-status"); // Nueva clase para estilo OF
  numOfResults.textContent = `Showing ${pagination.items} results / ${pagination.pages} pages`;
  paginationContainer.appendChild(numOfResults);

  const paginationList = document.createElement("ul");
  paginationContainer.appendChild(paginationList);

  const totalPages = Math.min(pagination.pages, MAX_VISIBLE_PAGES);

  for (let i = 1; i <= totalPages; i++) {
    const listItem = document.createElement("li");
    listItem.textContent = i;
    listItem.addEventListener("click", () => onPageClick(i));
    paginationList.appendChild(listItem);
  }
}

// --- Limpiar paginación ---
export function clearPagination() {
  document.querySelector(".pagination").innerHTML = "";
}

// --- Crear botones de filtro/ordenamiento ---
// Recibe el texto del botón y un callback "onSort()" que el Controlador inyectará.
export function renderFilterButton(label, onSort) {
  const filtersContainer = document.querySelector(".disco-filters");
  const newSortButton = document.createElement("button");
  newSortButton.textContent = label;
  newSortButton.addEventListener("click", onSort);
  filtersContainer.appendChild(newSortButton);
}

// --- Scroll suave a una sección ---
export function scrollToSection(id) {
  document
    .querySelector(`#${id}`)
    .scrollIntoView({ behavior: "smooth", offsetTop: 500 });
}

// --- Lógica de scroll del header ---
export function initHeaderScroll() {
  window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    const bodyHeight = document.body.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    const triggerHeight = (bodyHeight - windowHeight) * 0.3;

    if (scrollPosition >= triggerHeight) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}
