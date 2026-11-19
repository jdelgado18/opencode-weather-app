import { info } from "../presentation/output.ts";
import { guardarCiudades } from "../storage/citiesStorage.ts";
import type { Ciudad } from "../types/City.ts";
import type { Datos } from "../types/Settings.ts";

export async function eliminarCiudad(ciudad: Ciudad, datos: Datos): Promise<void> {
  datos.ciudades = datos.ciudades.filter((guardada) => guardada !== ciudad);
  if (datos.ciudadDefault === ciudad.nombre) datos.ciudadDefault = null;
  await guardarCiudades(datos);
  info(`Ciudad eliminada: ${ciudad.nombre}.`);
}
