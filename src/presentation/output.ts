import type { Ciudad } from "../types/City.ts";
import type { Clima, Pronostico } from "../types/Weather.ts";
import { pintar } from "../utils/colors.ts";
import { DIAS_PRONOSTICO } from "../utils/constants.ts";
import {
  descifrarTiempo,
  etiqueta,
  formatearFecha,
  formatearTemperatura,
} from "../utils/format.ts";

export function mostrarClima(ciudad: Ciudad, clima: Clima): void {
  const temperatura = pintar(formatearTemperatura(clima.temperatura, clima.unidad), "amarillo");
  console.log(`  ${etiqueta(ciudad)}: ${temperatura}`);
}

export function mostrarPronostico(ciudad: Ciudad, pronostico: Pronostico): void {
  console.log(pintar(`  Pronóstico a ${DIAS_PRONOSTICO} días para ${etiqueta(ciudad)}`, "cyan"));
  for (const dia of pronostico.dias) {
    const fecha = formatearFecha(dia.fecha).padEnd(12);
    const minima = pintar(formatearTemperatura(dia.minima, pronostico.unidad), "amarillo");
    const maxima = pintar(formatearTemperatura(dia.maxima, pronostico.unidad), "amarillo");
    const tiempo = descifrarTiempo(dia.codigoTiempo);
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
