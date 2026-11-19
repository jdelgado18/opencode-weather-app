import { readFileSync, writeFileSync } from "node:fs";
import { afterEach, beforeEach, expect, test } from "bun:test";
import { cargarDatos, guardarDatos } from "../../src/storage/dataFile.ts";
import {
  datosBase,
  escribirCrudo,
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

test("cargarDatos devuelve el estado vacío si el archivo no existe", async () => {
  expect(await cargarDatos()).toEqual({ ciudades: [], ciudadDefault: null, unidad: "C" });
});

test("cargarDatos lee las ciudades, la default y la unidad", async () => {
  escribirCrudo(temporal.ruta, datosBase());
  expect(await cargarDatos()).toEqual(datosBase());
});

test("cargarDatos descarta ciudades inválidas y normaliza default y unidad", async () => {
  escribirCrudo(temporal.ruta, {
    ciudades: [lima, { nombre: "Sin coordenadas" }, 42, null],
    ciudadDefault: "Tokio",
    unidad: "K",
  });
  expect(await cargarDatos()).toEqual({
    ciudades: [lima],
    ciudadDefault: null,
    unidad: "C",
  });
});

test("cargarDatos devuelve el estado vacío ante un JSON corrupto", async () => {
  writeFileSync(temporal.ruta, "{ esto no es json");
  expect(await cargarDatos()).toEqual({ ciudades: [], ciudadDefault: null, unidad: "C" });
});

test("guardarDatos escribe JSON legible y se puede volver a cargar", async () => {
  const datos = datosBase();
  await guardarDatos(datos);

  const texto = readFileSync(temporal.ruta, "utf8");
  expect(texto).toBe(`${JSON.stringify(datos, null, 2)}\n`);
  expect(await cargarDatos()).toEqual(datos);
});

test("WEATHER_DATA_FILE redirige la persistencia al archivo indicado", async () => {
  await guardarDatos({ ciudades: [], ciudadDefault: null, unidad: "F" });
  expect(Bun.env.WEATHER_DATA_FILE).toBe(temporal.ruta);
  expect(readFileSync(temporal.ruta, "utf8")).toContain('"unidad": "F"');
});
