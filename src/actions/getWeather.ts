import { obtenerClima } from "../api/weather.ts";
import { aviso, mostrarClima } from "../presentation/output.ts";
import type { Ciudad } from "../types/City.ts";
import type { Unidad } from "../types/Weather.ts";

export async function climaDe(ciudad: Ciudad, unidad: Unidad): Promise<void> {
  try {
    mostrarClima(ciudad, await obtenerClima(ciudad, unidad));
  } catch (error) {
    aviso(error instanceof Error ? error.message : "No se pudo obtener el clima.");
  }
}

export async function climaDeTodas(ciudades: Ciudad[], unidad: Unidad): Promise<void> {
  for (const ciudad of ciudades) {
    await climaDe(ciudad, unidad);
  }
}
