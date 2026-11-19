import { agregarCiudad } from "./actions/addCity.ts";
import { pronosticoDe } from "./actions/getForecast.ts";
import { climaDe, climaDeTodas } from "./actions/getWeather.ts";
import { listar } from "./actions/listCities.ts";
import { eliminarCiudad } from "./actions/removeCity.ts";
import { establecerDefault } from "./actions/setDefaultCity.ts";
import { cambiarUnidad } from "./actions/toggleUnit.ts";
import { elegirCiudad, leer as leerInput } from "./presentation/input.ts";
import { mostrarMenu } from "./presentation/menu.ts";
import { aviso, info } from "./presentation/output.ts";
import { cargarCiudades } from "./storage/citiesStorage.ts";
import { cargarAjustes } from "./storage/settingsStorage.ts";
import type { Datos } from "./types/Settings.ts";

const [ciudades, ajustes] = await Promise.all([cargarCiudades(), cargarAjustes()]);
const datos: Datos = { ciudades, ...ajustes };
let salir = false;

const terminar = (): void => {
  salir = true;
};

function leer(mensaje: string): string | null {
  return leerInput(mensaje, terminar);
}

function elegir(mensaje: string) {
  return elegirCiudad(mensaje, datos.ciudades, terminar);
}

while (!salir) {
  mostrarMenu(datos);
  const opcion = leer("  Selecciona una opción: ");
  if (opcion === null) break;

  switch (opcion) {
    case "1": {
      const nombre = datos.ciudadDefault;
      const ciudad = nombre === null ? undefined : datos.ciudades.find((c) => c.nombre === nombre);
      if (!ciudad) {
        aviso("Establece una ciudad default con la opción 5.");
        break;
      }
      await climaDe(ciudad, datos.unidad);
      break;
    }
    case "2": {
      if (datos.ciudades.length === 0) {
        aviso("No hay ciudades registradas. Usa la opción 3 para agregar una.");
        break;
      }
      await climaDeTodas(datos.ciudades, datos.unidad);
      break;
    }
    case "3": {
      const nombre = leer("  Nombre de la ciudad: ");
      if (nombre === null) break;
      await agregarCiudad(nombre, datos);
      break;
    }
    case "4": {
      const elegida = elegir("  Número de la ciudad a eliminar: ");
      if (!elegida) break;
      await eliminarCiudad(elegida, datos);
      break;
    }
    case "5": {
      const elegida = elegir("  Número de la ciudad default: ");
      if (!elegida) break;
      await establecerDefault(elegida, datos);
      break;
    }
    case "6": {
      const elegida = elegir("  Número de la ciudad para el pronóstico: ");
      if (!elegida) break;
      await pronosticoDe(elegida, datos.unidad);
      break;
    }
    case "7": {
      listar(datos.ciudades);
      break;
    }
    case "8": {
      await cambiarUnidad(datos);
      break;
    }
    case "9": {
      salir = true;
      info("¡Hasta luego!");
      break;
    }
    default:
      aviso("Opción no válida.");
  }
}
