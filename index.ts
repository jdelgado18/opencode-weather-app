import { dirname, join } from "node:path";
import { buscarCiudad, obtenerClima } from "./src/api.ts";
import { pintar } from "./src/colores.ts";
import { crearStore, type Ciudad, type Unidad } from "./src/store.ts";
import { aviso, info, listarCiudades, mostrarClima, mostrarMenu } from "./src/ui.ts";

// En el binario compilado Bun.main apunta a $bunfs (solo lectura): los datos
// deben quedar junto al ejecutable, no dentro del bundle.
const principal = Bun.main;
const base = principal.includes("$bunfs") ? process.execPath : principal;
const store = crearStore(join(dirname(base), "datos.json"));

const datos = await store.cargar();
let salir = false;

function leer(mensaje: string): string | null {
  const entrada = prompt(pintar(mensaje, "cyan"));
  if (entrada === null) salir = true;
  return entrada?.trim() ?? null;
}

function elegirCiudad(mensaje: string): Ciudad | null {
  if (datos.ciudades.length === 0) {
    aviso("No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return null;
  }
  listarCiudades(datos.ciudades);
  const entrada = leer(mensaje);
  if (entrada === null) return null;
  const indice = Number(entrada);
  const elegida = Number.isInteger(indice) ? datos.ciudades[indice - 1] : undefined;
  if (!elegida) {
    aviso("Selección no válida.");
    return null;
  }
  return elegida;
}

async function mostrarClimaDe(ciudad: Ciudad, unidad: Unidad): Promise<void> {
  try {
    mostrarClima(ciudad, await obtenerClima(ciudad, unidad));
  } catch (error) {
    aviso(error instanceof Error ? error.message : "No se pudo obtener el clima.");
  }
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
      await mostrarClimaDe(ciudad, datos.unidad);
      break;
    }
    case "2": {
      if (datos.ciudades.length === 0) {
        aviso("No hay ciudades registradas. Usa la opción 3 para agregar una.");
        break;
      }
      for (const ciudad of datos.ciudades) {
        await mostrarClimaDe(ciudad, datos.unidad);
      }
      break;
    }
    case "3": {
      const nombre = leer("  Nombre de la ciudad: ");
      if (nombre === null) break;
      if (nombre === "") {
        aviso("Debes ingresar un nombre.");
        break;
      }
      try {
        const encontrada = await buscarCiudad(nombre);
        if (!encontrada) {
          aviso(`No se encontró "${nombre}".`);
          break;
        }
        if (
          datos.ciudades.some(
            (ciudad) => ciudad.nombre.toLowerCase() === encontrada.nombre.toLowerCase(),
          )
        ) {
          aviso("Esa ciudad ya está registrada.");
          break;
        }
        datos.ciudades.push(encontrada);
        await store.guardar(datos);
        info(`Ciudad agregada: ${encontrada.nombre}.`);
      } catch (error) {
        aviso(error instanceof Error ? error.message : "No se pudo buscar la ciudad.");
      }
      break;
    }
    case "4": {
      const elegida = elegirCiudad("  Número de la ciudad a eliminar: ");
      if (!elegida) break;
      datos.ciudades = datos.ciudades.filter((ciudad) => ciudad !== elegida);
      if (datos.ciudadDefault === elegida.nombre) datos.ciudadDefault = null;
      await store.guardar(datos);
      info(`Ciudad eliminada: ${elegida.nombre}.`);
      break;
    }
    case "5": {
      const elegida = elegirCiudad("  Número de la ciudad default: ");
      if (!elegida) break;
      datos.ciudadDefault = elegida.nombre;
      await store.guardar(datos);
      info(`Ciudad default: ${elegida.nombre}.`);
      break;
    }
    case "8": {
      datos.unidad = datos.unidad === "C" ? "F" : "C";
      await store.guardar(datos);
      info(`Unidad cambiada a °${datos.unidad}.`);
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
