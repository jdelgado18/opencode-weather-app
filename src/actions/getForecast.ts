import { obtenerPronostico } from "../api/weather.ts";
import { aviso, info, mostrarPronostico } from "../presentation/output.ts";
import type { Ciudad } from "../types/City.ts";
import type { Unidad } from "../types/Weather.ts";
import { DIAS_PRONOSTICO } from "../utils/constants.ts";

export async function pronosticoDe(ciudad: Ciudad, unidad: Unidad): Promise<void> {
  try {
    info(`Consultando pronóstico a ${DIAS_PRONOSTICO} días...`);
    mostrarPronostico(ciudad, await obtenerPronostico(ciudad, unidad));
  } catch (error) {
    aviso(error instanceof Error ? error.message : "No se pudo obtener el pronóstico.");
  }
}
