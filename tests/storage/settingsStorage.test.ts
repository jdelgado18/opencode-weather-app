import { afterEach, beforeEach, expect, test } from "bun:test";
import { cargarDatos } from "../../src/storage/dataFile.ts";
import { cargarAjustes, guardarAjustes } from "../../src/storage/settingsStorage.ts";
import { datosBase, usarDatosTemporales, type DatosTemporales } from "../helpers.ts";

let temporal: DatosTemporales;

beforeEach(() => {
  temporal = usarDatosTemporales();
});

afterEach(() => {
  temporal.limpiar();
});

test("cargarAjustes devuelve la ciudad default y la unidad", async () => {
  await guardarAjustes(datosBase());
  expect(await cargarAjustes()).toEqual({ ciudadDefault: "Lima", unidad: "C" });
});

test("cargarAjustes devuelve valores por defecto si no hay archivo", async () => {
  expect(await cargarAjustes()).toEqual({ ciudadDefault: null, unidad: "C" });
});

test("guardarAjustes persiste el cambio sin perder las ciudades", async () => {
  const datos = datosBase();
  await guardarAjustes({ ...datos, ciudadDefault: "Ōtawara", unidad: "F" });

  const guardado = await cargarDatos();
  expect(guardado.ciudades).toEqual(datos.ciudades);
  expect(guardado.ciudadDefault).toBe("Ōtawara");
  expect(guardado.unidad).toBe("F");
});
