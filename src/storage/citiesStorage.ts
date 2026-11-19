import type { Ciudad } from "../types/City.ts";
import type { Datos } from "../types/Settings.ts";
import { cargarDatos, guardarDatos } from "./dataFile.ts";

export async function cargarCiudades(): Promise<Ciudad[]> {
  return (await cargarDatos()).ciudades;
}

// El archivo es compartido: se guarda el estado completo tras cambiar ciudades.
export async function guardarCiudades(datos: Datos): Promise<void> {
  await guardarDatos(datos);
}
