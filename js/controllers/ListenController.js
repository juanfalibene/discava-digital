// =============================================================================
// CONTROLADOR: ListenController.js
// Responsabilidad: Orquestar el flujo entre ListenModel y ListenView.
// =============================================================================

import * as Model from "../models/ListenModel.js";
import * as View from "../views/ListenView.js";
import { addListenLinkToNavbar } from "../views/NavView.js";

export function init() {
  const favorites = Model.getFavorites();
  
  // Renderizado inicial
  View.renderPlaylist(favorites, handleRemove, handlePlay);

  // Lógica para el botón global de YouTube
  const ytBtn = document.getElementById("btn-global-yt");
  if (ytBtn) {
    ytBtn.onclick = () => {
      const url = Model.generateGlobalPlaylistUrl(favorites);
      if (url) {
        window.open(url, "_blank");
      } else {
        alert("No videos found in your favorites.");
      }
    };
  }

  // Auto-play del primer video si existe
  if (favorites.length > 0 && favorites[0].videos?.length > 0) {
    handlePlay(favorites[0].videos[0].uri);
  }

  // Asegurar que el link "Listen" sea visible si hay favoritos
  addListenLinkToNavbar();
}

function handlePlay(url) {
  const videoId = Model.getYouTubeId(url);
  View.renderVideo(videoId);
}

function handleRemove(id) {
  if (confirm("Remove this release from your playlist?")) {
    const updatedFavorites = Model.removeFavoriteById(id);
    View.renderPlaylist(updatedFavorites, handleRemove, handlePlay);
    
    // Actualizar la navbar (si borramos el último, el link "Listen" debe desaparecer)
    addListenLinkToNavbar();
  }
}
