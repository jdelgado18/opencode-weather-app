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

export type Clima = {
  temperatura: number;
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

export async function obtenerClima(ciudad: Ciudad, unidad: Unidad): Promise<Clima> {
  const url = new URL(FORECAST);
  url.searchParams.set("latitude", String(ciudad.latitud));
  url.searchParams.set("longitude", String(ciudad.longitud));
  url.searchParams.set("current", "temperature_2m");
  if (unidad === "F") url.searchParams.set("temperature_unit", "fahrenheit");

  const datos = (await pedir(url)) as RespuestaForecast;
  const temperatura = datos.current?.temperature_2m;
  if (typeof temperatura !== "number") {
    throw new Error("La respuesta no incluyó la temperatura actual.");
  }
  return { temperatura, unidad };
}
