// =============================================================================
// MODELO: SearchModel.js
// Responsabilidad: Comunicación con la API de Discogs y lógica de ordenamiento.
// No sabe nada del DOM ni del HTML. Solo trabaja con datos (objetos JS).
// =============================================================================

// --- Configuración de la API ---
const CONSUMER_KEY = "lcSCxdPmqTHIbWMiCmBT";
const CONSUMER_SECRET = "OKPFUYvAGKHMkxbCQjGqUIVOVkhFYBiX";
const AUTH_CONSUMER = `key=${CONSUMER_KEY}&secret=${CONSUMER_SECRET}`;
const BASE_URL = "https://api.discogs.com/database/";

// --- Función principal de búsqueda ---
// Construye la URL con todos los parámetros y devuelve los datos de la API.
// Devuelve: { pagination, results } o lanza un error.
export async function fetchReleases(query, genre, format, page = 1, label) {
  const searchQuery = query.replace(/ /g, "-");
  const searchGenre = `&genre=funk+%2F+soul`;
  const searchStyle = `&style=${genre}`;
  const nameofLabel = label !== undefined ? `&label=${label}` : "";
  const filterFormat = `&format=${format}`;
  const numberOfPage = page !== 1 ? `&page=${page}` : "";

  const url = `${BASE_URL}search?q=${searchQuery}&type=release${filterFormat}${searchGenre}${searchStyle}${nameofLabel}${numberOfPage}&${AUTH_CONSUMER}`;

  console.log("[Model] Fetching URL:", url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

// --- Funciones de ordenamiento ---
// Ordenan una copia del array de resultados por año (más reciente primero).
export function sortByYear(results) {
  return [...results].sort((a, b) => b.year - a.year);
}

// Ordenan una copia del array de resultados por "wants" de la comunidad (más deseado primero).
export function sortByWant(results) {
  return [...results].sort((a, b) => {
    const wantA = a.community?.want ?? 0;
    const wantB = b.community?.want ?? 0;
    return wantB - wantA;
  });
}
