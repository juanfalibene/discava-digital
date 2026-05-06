// =============================================================================
// VISTA: ListenView.js
// Responsabilidad: Renderizar la lista de reproducción y el reproductor de video.
// =============================================================================

export const favoritesContainer = document.getElementById("favoritesList");
export const videoPlayerContainer = document.querySelector(".listen-video");

// --- ICONOS SVG (Minimalistas) ---
const ICON_TRASH = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;
const ICON_YOUTUBE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>`;

/**
 * Renderiza la lista de favoritos.
 */
export function renderPlaylist(favorites, onRemove, onPlay) {
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    renderEmptyState();
    return;
  }

  // --- BOTÓN GLOBAL: LISTEN ON YOUTUBE ---
  const globalActions = document.createElement("div");
  globalActions.style.marginBottom = "2em";
  globalActions.style.textAlign = "center";

  const ytBtn = document.createElement("button");
  ytBtn.innerHTML = `${ICON_YOUTUBE} Make a Youtube Playlist`;
  ytBtn.style.display = "inline-flex";
  ytBtn.style.alignItems = "center";
  ytBtn.style.gap = "0.8em";
  ytBtn.classList.add("btn-action-single");
  ytBtn.style.padding = "1em 2em";
  ytBtn.id = "btn-global-yt";

  globalActions.appendChild(ytBtn);
  favoritesContainer.appendChild(globalActions);

  favorites.forEach((disco) => {
    const li = document.createElement("li");
    li.classList.add("playlist-item");

    // 1. Imagen (Arriba)
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("playlist-info");
    infoDiv.innerHTML = `<img src="${disco.cover || './img/cover.jpg'}" alt="${disco.title}" class="playlist-thumb">`;

    // 2. Detalles (Texto)
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("playlist-details");
    detailsDiv.innerHTML = `
        <p class="playlist-title">${disco.title}</p>
        <p class="playlist-artist">${disco.artist}</p>
    `;

    // 3. Acciones (Botones)
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("playlist-actions");

    // Contenedor de la lista de videos (se llena si hay videos)
    const videosUl = document.createElement("ul");
    videosUl.classList.add("playlist-videos-list", "hide-div");

    if (disco.videos && disco.videos.length > 0) {
      // Botón Desplegar Videos
      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = `Videos (${disco.videos.length})`;
      toggleBtn.classList.add("btn-action-single");
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        videosUl.classList.toggle("hide-div");
      };
      actionsDiv.appendChild(toggleBtn);

      // Crear items de la lista de videos
      disco.videos.forEach(video => {
        const videoLi = document.createElement("li");
        videoLi.innerHTML = `<span>${video.title}</span>`;
        const playBtn = document.createElement("button");
        playBtn.textContent = "PLAY";
        playBtn.classList.add("btn-small");
        playBtn.onclick = (e) => {
          e.stopPropagation();
          onPlay(video.uri);
        };
        videoLi.appendChild(playBtn);
        videosUl.appendChild(videoLi);
      });
    }

    // Botón Eliminar
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = ICON_TRASH;
    removeBtn.classList.add("btn-remove-fav");
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      onRemove(disco.id);
    };
    actionsDiv.appendChild(removeBtn);

    // --- HEADER (Fila superior) ---
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("playlist-header");

    // Montaje del header (Portada -> Texto -> Botones a la derecha)
    headerDiv.appendChild(infoDiv); // Portada primero (izquierda)
    headerDiv.appendChild(detailsDiv);
    headerDiv.appendChild(actionsDiv); // Botones al final (derecha)

    // Montaje final en el LI
    li.appendChild(headerDiv);
    if (disco.videos?.length > 0) {
      li.appendChild(videosUl);
    }

    // Click en el item reproduce el primer video por defecto
    li.onclick = () => {
      if (disco.videos?.length > 0) onPlay(disco.videos[0].uri);
    };

    favoritesContainer.appendChild(li);
  });
}

export function renderVideo(videoId) {
  if (!videoId) {
    videoPlayerContainer.innerHTML = "<p>Video not found or invalid URL.</p>";
    return;
  }
  videoPlayerContainer.innerHTML = `
    <iframe width="100%" height="500" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1" 
      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
    </iframe>
  `;
}

function renderEmptyState() {
  favoritesContainer.innerHTML = `
    <div class="empty-state">
      <p>Your playlist is empty. Go back to find some gems!</p>
      <a href="index.html#diggin" class="hero-btn-start">Start Digging</a>
    </div>
  `;
  videoPlayerContainer.innerHTML = "<p>No video selected.</p>";
}
