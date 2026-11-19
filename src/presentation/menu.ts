import type { MenuOption } from "../types/MenuOption.ts";
import type { Datos } from "../types/Settings.ts";
import { pintar } from "../utils/colors.ts";
import { DIAS_PRONOSTICO, LINEA } from "../utils/constants.ts";

export function opcionesMenu(datos: Datos): MenuOption[] {
  return [
    { clave: "1", etiqueta: "Clima de ciudad default" },
    { clave: "2", etiqueta: `Clima de todas las ciudades (${datos.ciudades.length})` },
    { clave: "3", etiqueta: "Buscar y agregar ciudad" },
    { clave: "4", etiqueta: "Eliminar ciudad" },
    { clave: "5", etiqueta: "Establecer ciudad default" },
    { clave: "6", etiqueta: `Pronóstico a ${DIAS_PRONOSTICO} días` },
    { clave: "7", etiqueta: "Listar ciudades" },
    { clave: "8", etiqueta: `Ajustes (°${datos.unidad})` },
    { clave: "9", etiqueta: "Salir" },
  ];
}

export function mostrarMenu(datos: Datos): void {
  const menu = [
    LINEA,
    "         WEATHER CLI",
    LINEA,
    ...opcionesMenu(datos).map((opcion) => `  ${opcion.clave}. ${opcion.etiqueta}`),
    LINEA,
  ].join("\n");
  console.log(pintar(menu, "cyan"));
}
