// navbar toogle
const hamburgerButton = document.getElementById("hamburgerButton");
const navbar = document.getElementById("navbar");

hamburgerButton.addEventListener("click", () => {
  navbar.classList.toggle("show-menu");
});

function changeCSS() {
  console.log(url.pathname);
  document.querySelector("body").style.background = "#000000";
  document.querySelector(".header").classList.add("on-single-modal");
  document.querySelector("footer").style.background = "transparent";
  document.querySelector(".single-disco-image").style.alignItems = "flex-start";
  document.querySelector(".single-disco-cover").style.padding = "0 2em";

  hideElement("other");
  hideElement("compilations");
}

function createCloseButton() {
  //only if version || compilation data
  document.getElementById("hamburgerButton").style.display = "none";
  document.getElementById("navbar").classList.toggle("show-menu");

  const navbar = document.querySelector(".navbar ul");
  navbar.innerHTML = "";
  const btnClose = document.createElement("li");

  btnClose.addEventListener("click", () => {
    history.back();
  });
  btnClose.textContent = "X";
  btnClose.classList.add("invert-btn-navbar");
  navbar.style.padding = "initial";
  navbar.style.backgroundColor = "initial";
  navbar.appendChild(btnClose);
}

function getFavoritesArray() {
  // Obtener el array actual de favoritos del localStorage o crear uno vacío
  return JSON.parse(localStorage.getItem("favorites")) || [];
}
function generateListenButton() {
  const listenLink = document.createElement("li");
  listenLink.classList.add("nav-item");
  listenLink.classList.add("nav-item-listen");

  const listenAnchor = document.createElement("a");
  listenAnchor.href = "./listen.html";
  listenAnchor.textContent = "Listen";

  listenLink.appendChild(listenAnchor);

  return listenLink;
}

function addListenLinkToNavbar() {
  const favoritesArray = getFavoritesArray();

  // Obtener el array actual de favoritos del localStorage
  const listenLink = generateListenButton();

  // Obtener el botón "Listen" actual en el menú
  const existingListenLink = document.querySelector(".nav-item-listen");

  if (favoritesArray.length > 0) {
    // Si hay favoritos, agregar el botón "Listen" si aún no existe
    if (!existingListenLink) {
      document.querySelector(".navbar ul").appendChild(listenLink);
    }
  } else {
    // Si no hay favoritos, quitar el botón "Listen" si existe
    if (existingListenLink) {
      existingListenLink.remove();
    }
  }
}

/* Función global para manejar la lógica de verificación del localStorage y creación del elemento del menú
function handleLocalStorageAndNavbar() {
  // Obtener el array actual de favoritos del localStorage
  const favoritesArray = getFavoritesArray();

  // Verificar si hay favoritos almacenados en localStorage
  if (favoritesArray.length > 0) {
    const listenLink = document.createElement("li");
    listenLink.classList.add("nav-item");

    // Crear el enlace del menú
    const listenAnchor = document.createElement("a");
    listenAnchor.href = "./listen.html";
    listenAnchor.textContent = "Listen";
    listenLink.appendChild(listenAnchor);
    document.querySelector(".navbar ul").appendChild(listenLink);
  }
}*/
