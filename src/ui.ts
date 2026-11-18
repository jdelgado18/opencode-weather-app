import type { Clima } from "./api.ts";
import type { Ciudad, Datos } from "./store.ts";

const LINEA = "════════════════════════════════════════";

export function mostrarMenu(datos: Datos): void {
  console.log(LINEA);
  console.log("         WEATHER CLI");
  console.log(LINEA);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${datos.ciudades.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (°${datos.unidad})`);
  console.log("  9. Salir");
  console.log(LINEA);
}

function etiqueta(ciudad: Ciudad): string {
  return ciudad.pais ? `${ciudad.nombre}, ${ciudad.pais}` : ciudad.nombre;
}

export function mostrarClima(ciudad: Ciudad, clima: Clima): void {
  console.log(`  ${etiqueta(ciudad)}: ${clima.temperatura.toFixed(1)} °${clima.unidad}`);
}

export function listarCiudades(ciudades: Ciudad[]): void {
  ciudades.forEach((ciudad, indice) => {
    console.log(`  ${indice + 1}. ${etiqueta(ciudad)}`);
  });
}

export function info(mensaje: string): void {
  console.log(`  ${mensaje}`);
}

export function aviso(mensaje: string): void {
  console.log(`  ! ${mensaje}`);
}
