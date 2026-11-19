import { info } from "../presentation/output.ts";
import { guardarAjustes } from "../storage/settingsStorage.ts";
import type { Ciudad } from "../types/City.ts";
import type { Datos } from "../types/Settings.ts";

export async function establecerDefault(ciudad: Ciudad, datos: Datos): Promise<void> {
  datos.ciudadDefault = ciudad.nombre;
  await guardarAjustes(datos);
  info(`Ciudad default: ${ciudad.nombre}.`);
}
