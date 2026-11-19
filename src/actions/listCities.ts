import { aviso, listarCiudades } from "../presentation/output.ts";
import type { Ciudad } from "../types/City.ts";

export function listar(ciudades: Ciudad[]): void {
  if (ciudades.length === 0) {
    aviso("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }
  listarCiudades(ciudades);
}
