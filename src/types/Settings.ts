import type { Ciudad } from "./City.ts";
import type { Unidad } from "./Weather.ts";

// Un único datos.json guarda tanto las ciudades como las preferencias.
export type Datos = {
  ciudades: Ciudad[];
  ciudadDefault: string | null;
  unidad: Unidad;
};

export type Ajustes = {
  ciudadDefault: string | null;
  unidad: Unidad;
};
