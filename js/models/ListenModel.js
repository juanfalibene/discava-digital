// =============================================================================
// MODELO: ListenModel.js
// Responsabilidad: Gestionar los favoritos en localStorage y lógica de videos.
// =============================================================================

export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function removeFavoriteById(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(f => f.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  return favorites;
}

/**
 * Extrae el ID de un video de YouTube de forma robusta.
 * Soporta: 
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 */
export function getYouTubeId(url) {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
}
/**
 * Genera una URL de playlist de YouTube basada en todos los favoritos.
 */
export function generateGlobalPlaylistUrl(favorites) {
  const ids = favorites
    .map(f => f.videos?.[0]?.uri) // Cogemos el primer video de cada disco
    .map(uri => getYouTubeId(uri))
    .filter(id => id !== null); // Limpiamos nulos
    
  if (ids.length === 0) return null;
  
  return `https://www.youtube.com/watch_videos?video_ids=${ids.join(",")}`;
}
