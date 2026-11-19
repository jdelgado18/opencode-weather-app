import type { Ciudad } from "../types/City.ts";
import { GEOCODING } from "../utils/constants.ts";
import { pedir } from "./weather.ts";

type ResultadoGeocoding = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type RespuestaGeocoding = { results?: ResultadoGeocoding[] };

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
