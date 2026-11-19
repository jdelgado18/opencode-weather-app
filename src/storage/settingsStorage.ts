import type { Ajustes, Datos } from "../types/Settings.ts";
import { cargarDatos, guardarDatos } from "./dataFile.ts";

export async function cargarAjustes(): Promise<Ajustes> {
  const { ciudadDefault, unidad } = await cargarDatos();
  return { ciudadDefault, unidad };
}

// El archivo es compartido: se guarda el estado completo tras cambiar ajustes.
export async function guardarAjustes(datos: Datos): Promise<void> {
  await guardarDatos(datos);
}
