import { info } from "../presentation/output.ts";
import { guardarAjustes } from "../storage/settingsStorage.ts";
import type { Datos } from "../types/Settings.ts";

export async function cambiarUnidad(datos: Datos): Promise<void> {
  datos.unidad = datos.unidad === "C" ? "F" : "C";
  await guardarAjustes(datos);
  info(`Unidad cambiada a °${datos.unidad}.`);
}
