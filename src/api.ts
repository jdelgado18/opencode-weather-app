import type { Ciudad, Unidad } from "./store.ts";

const GEOCODING = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST = "https://api.open-meteo.com/v1/forecast";

type ResultadoGeocoding = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type RespuestaGeocoding = { results?: ResultadoGeocoding[] };

type RespuestaForecast = { current?: { temperature_2m?: number } };

type DiarioPronostico = {
  time?: string[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  weather_code?: number[];
};

type RespuestaPronostico = { daily?: DiarioPronostico };

export type Clima = {
  temperatura: number;
  unidad: Unidad;
};

export type DiaPronostico = {
  fecha: string;
  minima: number;
  maxima: number;
  codigoTiempo: number | null;
};

export type Pronostico = {
  dias: DiaPronostico[];
  unidad: Unidad;
};

async function pedir(url: URL): Promise<unknown> {
  let respuesta: Response;
  try {
    respuesta = await fetch(url);
  } catch {
    throw new Error("No se pudo conectar con OpenMeteo. Revisa tu conexión.");
  }
  if (!respuesta.ok) {
    throw new Error(`OpenMeteo devolvió el error ${respuesta.status}.`);
  }
  try {
    return await respuesta.json();
  } catch {
    throw new Error("OpenMeteo devolvió una respuesta inválida.");
  }
}

export async function buscarCiudad(nombre: string): Promise<Ciudad | null> {
  const url = new URL(GEOCODING);
  url.searchParams.set("name", nombre);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const datos = (await pedir(url)) as RespuestaGeocoding;
  const resultado = datos.results?.[0];
  if (!resultado) return null;
  return {
    nombre: resultado.name,
    latitud: resultado.latitude,
    longitud: resultado.longitude,
    pais: resultado.country ?? "",
  };
}

function urlForecast(ciudad: Ciudad, unidad: Unidad): URL {
  const url = new URL(FORECAST);
  url.searchParams.set("latitude", String(ciudad.latitud));
  url.searchParams.set("longitude", String(ciudad.longitud));
  if (unidad === "F") url.searchParams.set("temperature_unit", "fahrenheit");
  return url;
}

export async function obtenerClima(ciudad: Ciudad, unidad: Unidad): Promise<Clima> {
  const url = urlForecast(ciudad, unidad);
  url.searchParams.set("current", "temperature_2m");

  const datos = (await pedir(url)) as RespuestaForecast;
  const temperatura = datos.current?.temperature_2m;
  if (typeof temperatura !== "number") {
    throw new Error("La respuesta no incluyó la temperatura actual.");
  }
  return { temperatura, unidad };
}

export async function obtenerPronostico(
  ciudad: Ciudad,
  unidad: Unidad,
): Promise<Pronostico> {
  const url = urlForecast(ciudad, unidad);
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");

  const datos = (await pedir(url)) as RespuestaPronostico;
  const diario = datos.daily;
  if (!diario) {
    throw new Error("La respuesta no incluyó el pronóstico diario.");
  }

  const fechas = diario.time ?? [];
  const maximas = diario.temperature_2m_max ?? [];
  const minimas = diario.temperature_2m_min ?? [];
  const codigos = diario.weather_code ?? [];

  const dias: DiaPronostico[] = [];
  for (const [indice, fecha] of fechas.entries()) {
    const maxima = maximas[indice];
    const minima = minimas[indice];
    if (typeof maxima !== "number" || typeof minima !== "number") continue;
    const codigo = codigos[indice];
    dias.push({
      fecha,
      maxima,
      minima,
      codigoTiempo: typeof codigo === "number" ? codigo : null,
    });
  }

  if (dias.length === 0) {
    throw new Error("La respuesta no incluyó temperaturas diarias.");
  }
  return { dias: dias.slice(0, 7), unidad };
}
