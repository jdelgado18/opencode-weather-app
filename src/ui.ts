import type { Clima } from "./api.ts";
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
