// =============================================================================
// VISTA: NavView.js
// Responsabilidad: Manipulación de la barra de navegación.
// Gestiona el menú hamburguesa y el botón dinámico "Listen".
// =============================================================================

// --- Menú hamburguesa ---
const hamburgerButton = document.getElementById("hamburgerButton");
const navbar = document.getElementById("navbar");

hamburgerButton.addEventListener("click", () => {
  navbar.classList.toggle("show-menu");
});

// --- Helpers de localStorage ---
// Lee el array de favoritos del localStorage (o devuelve un array vacío).
function getFavoritesArray() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// --- Generar el botón "Listen" ---
// Crea y devuelve un elemento <li> con el enlace a listen.html.
function generateListenButton() {
  const listenLink = document.createElement("li");
  listenLink.classList.add("nav-item", "nav-item-listen");

  const listenAnchor = document.createElement("a");
  listenAnchor.href = "./listen.html";
  listenAnchor.textContent = "Listen";

  listenLink.appendChild(listenAnchor);
  return listenLink;
}

// --- Mostrar u ocultar el botón "Listen" según favoritos ---
// Si hay favoritos en localStorage → añade el botón al navbar.
// Si no hay favoritos → lo elimina si existía.
export function addListenLinkToNavbar() {
  const favoritesArray = getFavoritesArray();
  const existingListenLink = document.querySelector(".nav-item-listen");

  if (favoritesArray.length > 0) {
    if (!existingListenLink) {
      const listenLink = generateListenButton();
      document.querySelector(".navbar ul").appendChild(listenLink);
    }
  } else {
    if (existingListenLink) {
      existingListenLink.remove();
    }
  }
}
