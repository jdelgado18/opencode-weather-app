import { afterEach, beforeEach, expect, test } from "bun:test";
import { cargarDatos } from "../../src/storage/dataFile.ts";
import { cargarCiudades, guardarCiudades } from "../../src/storage/citiesStorage.ts";
import {
  datosBase,
  lima,
  usarDatosTemporales,
  type DatosTemporales,
} from "../helpers.ts";

let temporal: DatosTemporales;

beforeEach(() => {
  temporal = usarDatosTemporales();
});

afterEach(() => {
  temporal.limpiar();
});

test("cargarCiudades devuelve las ciudades guardadas", async () => {
  const datos = datosBase();
  await guardarCiudades(datos);
  expect(await cargarCiudades()).toEqual(datos.ciudades);
});

test("cargarCiudades devuelve una lista vacía si no hay archivo", async () => {
  expect(await cargarCiudades()).toEqual([]);
});

test("guardarCiudades persiste el cambio sin perder los ajustes", async () => {
  const datos = datosBase();
  await guardarCiudades({ ...datos, ciudades: [lima] });

  const guardado = await cargarDatos();
  expect(guardado.ciudades).toEqual([lima]);
  expect(guardado.ciudadDefault).toBe("Lima");
  expect(guardado.unidad).toBe("C");
});
