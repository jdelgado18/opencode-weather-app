import type { Ciudad } from "../types/City.ts";
import { pintar } from "../utils/colors.ts";
import { aviso, listarCiudades } from "./output.ts";

// alCerrar se llama cuando el usuario corta la entrada (EOF); la app debe salir.
export function leer(mensaje: string, alCerrar: () => void): string | null {
  const entrada = prompt(pintar(mensaje, "cyan"));
  if (entrada === null) alCerrar();
  return entrada?.trim() ?? null;
}

export function elegirCiudad(
  mensaje: string,
  ciudades: Ciudad[],
  alCerrar: () => void,
): Ciudad | null {
  if (ciudades.length === 0) {
    aviso("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return null;
  }
  listarCiudades(ciudades);
  const entrada = leer(mensaje, alCerrar);
  if (entrada === null) return null;
  const indice = Number(entrada);
  const elegida = Number.isInteger(indice) ? ciudades[indice - 1] : undefined;
  if (!elegida) {
    aviso("Selección no válida.");
    return null;
  }
  return elegida;
}
