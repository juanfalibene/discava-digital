// =============================================================================
// VISTA: SingleView.js
// Responsabilidad: Renderizar la página de detalle de un disco.
// Contiene: render del disco, versiones, compilaciones, show/hide, modal styles.
// Fix: tracklist corregido (bucle único), functions.js integrado aquí.
// =============================================================================

import { findMatchingVideos, saveToFavorites, isFavorite } from "../models/SingleModel.js";
import { addListenLinkToNavbar } from "./NavView.js";

// --- Render del disco principal ---
// Fix: bucle de tracklist único (el original tenía 3 bucles anidados que triplicaban items
// y nunca añadía los <li> al DOM). Corregido a un único for...of limpio.
export function renderSingleDisco(data, typeOfVersion) {
  const container = document.querySelector(".single-result");
  const template = document.querySelector("#single-disco").content;
  const div = template.cloneNode(true);

  const disco = div.querySelector(".single-disco");
  const coverDiscoImg = div.querySelector(".single-disco-cover img");
  const singleTitleH1 = div.querySelector(".single-title");
  const singleInfoUL = div.querySelector(".single-info");
  const singleNotesUL = div.querySelector(".single-notes");
  const singleTracklistUL = div.querySelector(".disco-tracklist");
  const singleActionUL = div.querySelector(".action-links");
  const divSingleDiscoTracklist = div.querySelector(".single-disco-tracklist");
  const divSingleInfo = div.querySelector(".single-disco-info"); // guardado antes de appendChild

  // Portada
  coverDiscoImg.src = data.images?.[0]?.uri ?? "./../img/cover.jpg";
  coverDiscoImg.alt = data.title;

  // Título: "Artista - Título"
  const artistName = data.artists?.[0]?.name ?? "Unknown Artist";
  singleTitleH1.textContent = `${artistName} - ${data.title}`;

  // --- Info del disco (Estilo Limpio 1 Columna) ---
  const createInfoRow = (label, value) => {
    const li = document.createElement("li");
    li.classList.add("info-row-clean");
    
    const labelSpan = document.createElement("span");
    labelSpan.classList.add("info-label-clean");
    labelSpan.textContent = label;
    
    const valuesDiv = document.createElement("div");
    valuesDiv.classList.add("info-values-clean");
    
    // Si el valor tiene comas, creamos una pill por cada elemento
    if (typeof value === "string" && value.includes(",")) {
      value.split(",").forEach(val => {
        const pill = document.createElement("span");
        pill.classList.add("info-pill-clean");
        pill.textContent = val.trim();
        valuesDiv.appendChild(pill);
      });
    } else {
      const pill = document.createElement("span");
      pill.classList.add("info-pill-clean");
      pill.textContent = value;
      valuesDiv.appendChild(pill);
    }
    
    li.append(labelSpan, valuesDiv);
    return li;
  };

  if (data.year) singleInfoUL.appendChild(createInfoRow("Released", data.year));
  if (data.genres?.length) singleInfoUL.appendChild(createInfoRow("Genre", data.genres.join(", ")));
  if (data.styles?.length) singleInfoUL.appendChild(createInfoRow("Style", data.styles.join(", ")));

  // --- Datos de comunidad ---
  const ratingValue = data.community?.rating?.average;
  if (ratingValue) singleNotesUL.appendChild(createInfoRow("Rating", `${ratingValue} / 5`));
  
  const haveCount = data.community?.have ?? 0;
  const wantCount = data.community?.want ?? 0;
  singleNotesUL.appendChild(createInfoRow("Collection", `H: ${haveCount} / W: ${wantCount}`));

  const numForSale = data.num_for_sale ?? 0;
  const lowestPrice = data.lowest_price ? `${data.lowest_price}€` : "N/A";
  if (numForSale > 0) singleNotesUL.appendChild(createInfoRow("Market", `${numForSale} copies from ${lowestPrice}`));

  // --- TRACKLIST (corregido) ---
  // Original: 3 bucles anidados que se sobreescribían, función definida dentro del loop,
  // y los <li> nunca se añadían al DOM. Ahora: un único bucle limpio.
  for (const track of data.tracklist) {
    const trackItem = document.createElement("li");
    trackItem.classList.add("track-item-flex"); // Nueva clase para flexbox

    const trackText = document.createElement("span");
    if (typeOfVersion === "version" || typeOfVersion === "compilation") {
      const artistNames = data.artists?.map((a) => a.name).join(", ") ?? "";
      trackText.textContent = `${artistNames} - ${track.title} ${track.duration}`;
    } else {
      trackText.textContent = `${track.title} ${track.duration}`;
    }
    trackItem.appendChild(trackText);

    // Botones de video para cada track (dentro del mismo li)
    if (data.videos) {
      const matchingVideos = findMatchingVideos(track, data.videos);
      if (matchingVideos.length > 0) {
        // Añadimos el botón directamente al li
        trackItem.appendChild(createPlayButton(matchingVideos[0]));
      }
    }
    
    singleTracklistUL.appendChild(trackItem);
  }

  // --- BOTONES DE ACCIÓN (Compra y Playlist) ---
  if (data.uri) {
    const buyLi = document.createElement("li");
    const buyLink = document.createElement("a");
    buyLink.href = data.uri;
    buyLink.target = "_blank";
    buyLink.textContent = "Buy on Discogs";
    buyLink.classList.add("btn-action-single"); // Clase unificada
    buyLi.appendChild(buyLink);
    singleActionUL.appendChild(buyLi);
  }

  // Botón Save to Playlist
  const favLi = document.createElement("li");
  const favBtn = document.createElement("button");
  favBtn.textContent = isFavorite(data.id) ? "Saved" : "Save to Playlist";
  favBtn.classList.add("btn-action-single"); // Clase unificada
  if (isFavorite(data.id)) favBtn.disabled = true;

  favBtn.addEventListener("click", () => {
    if (saveToFavorites(data)) {
      favBtn.textContent = "Saved";
      favBtn.disabled = true;
      addListenLinkToNavbar();
    }
  });
  favLi.appendChild(favBtn);
  singleActionUL.appendChild(favLi);

  // Scroll en tracklist largo (solo en modo búsqueda normal)
  if (typeOfVersion !== "version" && typeOfVersion !== "compilation") {
    if (data.tracklist.length > 2) {
      divSingleDiscoTracklist.style.overflowY = "scroll";
    }
  }

  container.appendChild(div);

  // Estilos de "modal" para versiones y compilaciones
  if (typeOfVersion === "version" || typeOfVersion === "compilation") {
    applyModalStyles();
    createCloseButton();
    // Fix: usamos divSingleInfo guardado antes de appendChild (el fragment queda vacío tras append)
    invertDiscoColors(disco, divSingleInfo, coverDiscoImg, divSingleDiscoTracklist);
  }
}

// --- Botón PLAY → embebe iframe de YouTube ---
// Separado del loop como función pura de fábrica de elemento DOM.
// --- Botón PLAY ---
function createPlayButton(video) {
  const btn = document.createElement("button");
  btn.textContent = "PLAY";
  // No añadimos btn-action-single para que use el estilo compacto de la lista
  btn.addEventListener("click", () => {
    const imgContainer = document.querySelector(".single-disco-image");
    const videoId = video.uri.split("=")[1];
    imgContainer.innerHTML = `<iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}?controls=1"></iframe>`;
  });
  return btn;
}

// --- Render de versiones alternativas ---
export function renderVersions(versions, toFormat) {
  const containerUL = document.querySelector(".versions-list");
  const template = document.querySelector("#disco-versions").content;

  if (versions.length === 0) {
    hideSection("other");
    return;
  }

  showSection("other");

  for (const version of versions) {
    const li = template.cloneNode(true);

    const a = li.querySelector("a");
    const params = new URLSearchParams({
      release_id: version.id,
      master_id: 0,
      format: toFormat,
      type: "version"
    });
    a.href = `./single.html#${params.toString()}`;

    const thumb = li.querySelector("img");
    thumb.src = version.thumb === "" ? "./../img/cover.jpg" : version.thumb;

    const divInfo = li.querySelector(".disco-version-info");
    const titleP = document.createElement("p");
    titleP.textContent = version.title;
    const formatP = document.createElement("p");
    formatP.textContent = version.format;
    const labelP = document.createElement("p");
    labelP.textContent = `${version.label} ${version.released} ${version.country}`;
    divInfo.append(titleP, formatP, labelP);

    containerUL.appendChild(li);
  }

  if (versions.length < 6) {
    containerUL.style.justifyContent = "flex-start";
  }
}

// --- Render de compilaciones ---
export function renderCompilations(compilations) {
  const container = document.querySelector(".discos");
  const template = document.querySelector("#compilations").content;

  if (compilations.length === 0) {
    hideSection("compilations");
    return;
  }

  showSection("compilations");

  for (const compilation of compilations) {
    const div = template.cloneNode(true);

    const a = div.querySelector("a");
    const img = div.querySelector("img");
    const titleP = div.querySelector(".disco-title");
    const yearP = div.querySelector(".disco-year");
    const labelP = div.querySelector(".disco-label");

    img.src =
      compilation.cover_image.includes("spacer.gif") || compilation.cover_image === ""
        ? "./../img/cover.jpg"
        : compilation.cover_image;
    img.alt = compilation.title;

    titleP.textContent = compilation.title;
    yearP.textContent = `${compilation.country} — ${compilation.year}`;
    labelP.textContent = compilation.label?.[0] ?? "";
    
    const params = new URLSearchParams({
      release_id: compilation.id,
      master_id: compilation.master_id,
      type: "compilation"
    });
    a.href = `./single.html#${params.toString()}`;

    container.appendChild(div);
  }

  if (compilations.length < 3) {
    container.style.justifyContent = "flex-start";
  }
}

// --- Mostrar / Ocultar secciones ---
export function showSection(name) {
  const h3 = document.querySelector(`.${name}-versions-results h3`);
  if (h3) {
    h3.classList.remove("hide-div");
    h3.classList.add("show-div");
  }
}

export function hideSection(name) {
  const section = document.querySelector(`.${name}-versions-results`);
  if (section) section.classList.add("hide-div");
}

// --- Estilos de "modal" (versiones y compilaciones) ---
// Extraído de functions.js → changeCSS()
export function applyModalStyles() {
  document.querySelector("body").style.background = "#000000";
  document.querySelector(".header")?.classList.add("on-single-modal");
  document.querySelector("footer").style.background = "transparent";
  document.querySelector(".single-disco-image").style.alignItems = "flex-start";
  document.querySelector(".single-disco-cover").style.padding = "0 2em";
  hideSection("other");
  hideSection("compilations");
}

// --- Botón de cierre en la navbar (para vista modal) ---
// Extraído de functions.js → createCloseButton()
export function createCloseButton() {
  const hamburger = document.getElementById("hamburgerButton");
  const navbar = document.getElementById("navbar");
  if (hamburger) hamburger.style.display = "none";
  if (navbar) navbar.classList.toggle("show-menu");

  const navList = document.querySelector(".navbar ul");
  if (!navList) return;
  navList.innerHTML = "";

  const btnClose = document.createElement("li");
  btnClose.textContent = "X";
  btnClose.classList.add("invert-btn-navbar");
  btnClose.addEventListener("click", () => history.back());
  navList.style.padding = "initial";
  navList.style.backgroundColor = "initial";
  navList.appendChild(btnClose);
}

// --- Invertir colores del disco (modo version/compilation) ---
function invertDiscoColors(disco, divSingleInfo, coverDiscoImg, divSingleDiscoTracklist) {
  disco.classList.add("invert-sd");
  coverDiscoImg.style.height = "auto";
  divSingleDiscoTracklist.classList.add("invert-sd-tracklist");
}
