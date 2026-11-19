import type { Ciudad } from "../types/City.ts";
import type { Unidad } from "../types/Weather.ts";

export function etiqueta(ciudad: Ciudad): string {
  return ciudad.pais ? `${ciudad.nombre}, ${ciudad.pais}` : ciudad.nombre;
}

export function formatearTemperatura(valor: number, unidad: Unidad): string {
  return `${valor.toFixed(1)} °${unidad}`;
}

export function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-");
  if (!anio || !mes || !dia) return fecha;
  const valor = new Date(Number(anio), Number(mes) - 1, Number(dia), 12);
  if (Number.isNaN(valor.getTime())) return fecha;
  return new Intl.DateTimeFormat("es", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  })
    .format(valor)
    .replace(",", "");
}

// Códigos WMO devueltos por OpenMeteo en `weather_code`.
const TIEMPO: ReadonlyMap<number, string> = new Map([
  [0, "Despejado"],
  [1, "Principalmente despejado"],
  [2, "Parcialmente nublado"],
  [3, "Nublado"],
  [45, "Niebla"],
  [48, "Niebla con escarcha"],
  [51, "Llovizna débil"],
  [53, "Llovizna"],
  [55, "Llovizna intensa"],
  [56, "Llovizna congelante débil"],
  [57, "Llovizna congelante intensa"],
  [61, "Lluvia débil"],
  [63, "Lluvia"],
  [65, "Lluvia intensa"],
  [66, "Lluvia congelante débil"],
  [67, "Lluvia congelante intensa"],
  [71, "Nieve débil"],
  [73, "Nieve"],
  [75, "Nieve intensa"],
  [77, "Granos de nieve"],
  [80, "Chubascos débiles"],
  [81, "Chubascos"],
  [82, "Chubascos intensos"],
  [85, "Chubascos de nieve débiles"],
  [86, "Chubascos de nieve intensos"],
  [95, "Tormenta"],
  [96, "Tormenta con granizo"],
  [99, "Tormenta con granizo intenso"],
]);

export function descifrarTiempo(codigo: number | null): string {
  return codigo === null ? "" : (TIEMPO.get(codigo) ?? "");
}
