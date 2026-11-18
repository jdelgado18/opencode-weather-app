import type { Clima, Pronostico } from "./api.ts";
import { pintar } from "./colores.ts";
import type { Ciudad, Datos } from "./store.ts";

const LINEA = "════════════════════════════════════════";

export function mostrarMenu(datos: Datos): void {
  const menu = [
    LINEA,
    "         WEATHER CLI",
    LINEA,
    "  1. Clima de ciudad default",
    `  2. Clima de todas las ciudades (${datos.ciudades.length})`,
    "  3. Buscar y agregar ciudad",
    "  4. Eliminar ciudad",
    "  5. Establecer ciudad default",
    "  6. Pronóstico a 7 días",
    `  8. Ajustes (°${datos.unidad})`,
    "  9. Salir",
    LINEA,
  ].join("\n");
  console.log(pintar(menu, "cyan"));
}

function etiqueta(ciudad: Ciudad): string {
  return ciudad.pais ? `${ciudad.nombre}, ${ciudad.pais}` : ciudad.nombre;
}

export function mostrarClima(ciudad: Ciudad, clima: Clima): void {
  const temperatura = pintar(`${clima.temperatura.toFixed(1)} °${clima.unidad}`, "amarillo");
  console.log(`  ${etiqueta(ciudad)}: ${temperatura}`);
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

function formatearFecha(fecha: string): string {
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

export function mostrarPronostico(ciudad: Ciudad, pronostico: Pronostico): void {
  console.log(pintar(`  Pronóstico a 7 días para ${etiqueta(ciudad)}`, "cyan"));
  for (const dia of pronostico.dias) {
    const fecha = formatearFecha(dia.fecha).padEnd(12);
    const minima = pintar(`${dia.minima.toFixed(1)} °${pronostico.unidad}`, "amarillo");
    const maxima = pintar(`${dia.maxima.toFixed(1)} °${pronostico.unidad}`, "amarillo");
    const tiempo = dia.codigoTiempo === null ? "" : (TIEMPO.get(dia.codigoTiempo) ?? "");
    console.log(`  ${fecha}  mín ${minima}  máx ${maxima}${tiempo ? `  ${tiempo}` : ""}`);
  }
}

export function listarCiudades(ciudades: Ciudad[]): void {
  ciudades.forEach((ciudad, indice) => {
    console.log(`  ${indice + 1}. ${etiqueta(ciudad)}`);
  });
}

export function info(mensaje: string): void {
  console.log(pintar(`  ${mensaje}`, "verde"));
}

export function aviso(mensaje: string): void {
  console.log(pintar(`  ! ${mensaje}`, "rojo"));
}
