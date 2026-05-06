document.addEventListener("DOMContentLoaded", () => {
  const favoritesArray = getFavoritesArray();
  const favoritesList = document.getElementById("favoritesList");
  generateFavoritesList(favoritesArray, favoritesList);
  const listenVideoContainer = document.querySelector(".listen-video");

  // Verificar si hay favoritos y cargar el primer video en el contenedor .listen-video
  if (favoritesArray.length > 0) {
    addListenLinkToNavbar();
    const firstFavorite = favoritesArray[0];
    if (firstFavorite.videos && firstFavorite.videos.length > 0) {
      const firstVideo = firstFavorite.videos[0];
      playVideo(firstVideo.uri);
    }
  }
});

function generateFavoritesList(favoritesArray, targetElement) {
  targetElement.innerHTML = "";

  // Verificar si hay elementos en el array de favoritos
  if (favoritesArray.length === 0) {
    const noFavoritesMessage = document.createElement("p");
    noFavoritesMessage.textContent = "No favorites available.";
    targetElement.appendChild(noFavoritesMessage);
  } else {
    // Crear elementos de lista para cada favorito y agregarlos al elemento de destino
    favoritesArray.forEach((favorite, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${favorite.title} by ${favorite.artist}`;
      listItem.classList.add("remove-favorite");
      // Agregar evento de clic para eliminar el favorito
      listItem.addEventListener("click", () => {
        removeFavorite(index);
        // Actualizar la lista de favoritos en la interfaz después de eliminar
        generateFavoritesList(getFavoritesArray(), targetElement);
      });
      targetElement.appendChild(listItem);

      // Verificar si hay videos en el favorito
      if (favorite.videos && favorite.videos.length > 0) {
        const videosList = document.createElement("ul");

        // Crear elementos de lista para cada video y agregarlos a la lista de videos
        favorite.videos.forEach((video) => {
          const videoItem = document.createElement("li");
          videoItem.classList.add("play-video");

          const videoButton = document.createElement("button");
          videoButton.textContent = video.title;

          videoButton.addEventListener("click", () => {
            playVideo(video.uri);
          });

          videoItem.appendChild(videoButton);
          videosList.appendChild(videoItem);
        });

        // Agregar la lista de videos al elemento de destino
        targetElement.appendChild(videosList);
      }
    });
  }
}

function playVideo(videoUri) {
  const containerImgToIframe = document.querySelector(".listen-video");
  const videoEmbedCode = videoUri.split("=", 11);
  containerImgToIframe.innerHTML =
    '<iframe width="100%" height="450" src="https://www.youtube.com/embed/' +
    videoEmbedCode[1] +
    '?controls=1"></iframe>';
}

function removeFavorite(index) {
  const favoritesArray = getFavoritesArray();

  // Verificar si el índice está dentro de los límites del array
  if (index >= 0 && index < favoritesArray.length) {
    // Eliminar el favorito en el índice especificado
    favoritesArray.splice(index, 1);
    // Actualizar el array de favoritos en localStorage
    localStorage.setItem("favorites", JSON.stringify(favoritesArray));
  }
}
