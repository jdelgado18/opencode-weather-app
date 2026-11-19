import { buscarCiudad } from "../api/geocoding.ts";
import { aviso, info } from "../presentation/output.ts";
import { guardarCiudades } from "../storage/citiesStorage.ts";
import type { Ciudad } from "../types/City.ts";
import type { Datos } from "../types/Settings.ts";

export async function agregarCiudad(nombre: string, datos: Datos): Promise<Ciudad | null> {
  if (nombre === "") {
    aviso("Debes ingresar un nombre.");
    return null;
  }
  try {
    const encontrada = await buscarCiudad(nombre);
    if (!encontrada) {
      aviso(`No se encontró "${nombre}".`);
      return null;
    }
    if (
      datos.ciudades.some(
        (ciudad) => ciudad.nombre.toLowerCase() === encontrada.nombre.toLowerCase(),
      )
    ) {
      aviso("Esa ciudad ya está registrada.");
      return null;
    }
    datos.ciudades.push(encontrada);
    await guardarCiudades(datos);
    info(`Ciudad agregada: ${encontrada.nombre}.`);
    return encontrada;
  } catch (error) {
    aviso(error instanceof Error ? error.message : "No se pudo buscar la ciudad.");
    return null;
  }
}
