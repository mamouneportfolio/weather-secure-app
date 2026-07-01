const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const REQUEST_TIMEOUT_MS = 10000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('La requête a expiré. Vérifie ta connexion internet.');
    }
    throw new Error('Impossible de contacter le service météo. Vérifie ta connexion internet.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Ville introuvable. Vérifie l\'orthographe.');
    }
    if (response.status === 401) {
      throw new Error('Clé API OpenWeather invalide ou manquante.');
    }
    throw new Error(`Erreur météo (code ${response.status}).`);
  }

  return response.json();
}

export async function getWeatherByCity(city) {
  if (!API_KEY) throw new Error('Clé API OpenWeather manquante.');
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=fr`;
  return fetchWithTimeout(url);
}

export async function getWeatherByCoords(latitude, longitude) {
  if (!API_KEY) throw new Error('Clé API OpenWeather manquante.');
  const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`;
  return fetchWithTimeout(url);
}
