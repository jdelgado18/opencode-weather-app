import { dirname, join } from "node:path";
import type { Ciudad } from "../types/City.ts";
import type { Datos } from "../types/Settings.ts";
import { NOMBRE_DATOS } from "../utils/constants.ts";

// En el binario compilado Bun.main apunta a $bunfs (solo lectura): los datos
// deben quedar junto al ejecutable, no dentro del bundle. Desde fuente, el
// entry es src/index.ts y los datos viven en la raíz del proyecto.
function rutaDatos(): string {
  const base = Bun.main.includes("$bunfs")
    ? dirname(process.execPath)
    : dirname(dirname(Bun.main));
  return join(base, NOMBRE_DATOS);
}

function vacios(): Datos {
  return { ciudades: [], ciudadDefault: null, unidad: "C" };
}

function esCiudad(valor: unknown): valor is Ciudad {
  if (typeof valor !== "object" || valor === null) return false;
  const ciudad = valor as Record<string, unknown>;
  return (
    typeof ciudad.nombre === "string" &&
    typeof ciudad.latitud === "number" &&
    typeof ciudad.longitud === "number" &&
    typeof ciudad.pais === "string"
  );
}

function normalizar(valor: unknown): Datos {
  if (typeof valor !== "object" || valor === null) return vacios();
  const crudo = valor as Record<string, unknown>;
  const ciudades = Array.isArray(crudo.ciudades) ? crudo.ciudades.filter(esCiudad) : [];
  const ciudadDefault =
    typeof crudo.ciudadDefault === "string" &&
    ciudades.some((ciudad) => ciudad.nombre === crudo.ciudadDefault)
      ? crudo.ciudadDefault
      : null;
  return {
    ciudades,
    ciudadDefault,
    unidad: crudo.unidad === "F" ? "F" : "C",
  };
}

export async function cargarDatos(): Promise<Datos> {
  const archivo = Bun.file(rutaDatos());
  if (!(await archivo.exists())) return vacios();
  try {
    return normalizar(await archivo.json());
  } catch {
    return vacios();
  }
}

export async function guardarDatos(datos: Datos): Promise<void> {
  await Bun.write(rutaDatos(), `${JSON.stringify(datos, null, 2)}\n`);
}
