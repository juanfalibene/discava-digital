// =============================================================================
// MODELO: SingleModel.js
// Responsabilidad: Comunicación con la API de Discogs (página de detalle).
// No sabe nada del DOM. Solo recibe parámetros y devuelve datos.
// =============================================================================

const CONSUMER_KEY = "lcSCxdPmqTHIbWMiCmBT";
const CONSUMER_SECRET = "OKPFUYvAGKHMkxbCQjGqUIVOVkhFYBiX";
const AUTH_CONSUMER = `key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`;
const BASE_URL = "https://api.discogs.com/";

// --- Fetch del release principal ---
export async function fetchRelease(releaseId) {
  const url = `${BASE_URL}releases/${releaseId}?${AUTH_CONSUMER}`;
  console.log("[SingleModel] Fetching release:", url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
  return response.json();
}

// --- Fetch de versiones alternativas de un master ---
export async function fetchVersions(masterId, formatToFilter) {
  const url = `${BASE_URL}masters/${masterId}/versions?${AUTH_CONSUMER}`;
  console.log("[SingleModel] Fetching versions:", url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
  const data = await response.json();
  // Filtra solo las versiones del formato opuesto (7" ↔ 12")
  return data.versions.filter((v) => v.format.includes(formatToFilter));
}

// --- Fetch de compilaciones que incluyen al artista/título ---
export async function fetchCompilations(title, artist) {
  const query = `q=${title}-${artist}`;
  const url = `${BASE_URL}database/search?${query}&type=release&${AUTH_CONSUMER}`;
  console.log("[SingleModel] Fetching compilations:", url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
  const data = await response.json();
  // Filtra solo releases que sean Compilaciones en Vinyl
  return data.results.filter(
    (r) => r.format.includes("Compilation") && r.format.includes("Vinyl")
  );
}

// --- Gestión de Favoritos (localStorage) ---
export function saveToFavorites(data) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some((f) => f.id === data.id)) {
    favorites.push({
      id: data.id,
      title: data.title,
      artist: data.artists?.[0]?.name ?? "Unknown",
      cover: data.images?.[0]?.uri ?? "",
      videos: data.videos ?? []
    });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    return true;
  }
  return false;
}

export function isFavorite(id) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some((f) => f.id === id);
}

// --- Buscar videos que coincidan con un track ---
export function findMatchingVideos(track, videos) {
  if (!videos || videos.length === 0 || !track.title) return [];
  
  const trackTitleClean = track.title.toLowerCase().trim();
  
  return videos.filter((video) => {
    const videoTitleClean = video.title.toLowerCase();
    return videoTitleClean.includes(trackTitleClean);
  });
}
