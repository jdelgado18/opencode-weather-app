import { afterEach, beforeEach, expect, test } from "bun:test";
import { cambiarUnidad } from "../../src/actions/toggleUnit.ts";
import { cargarDatos } from "../../src/storage/dataFile.ts";
import {
  datosBase,
  impresiones,
  mockLog,
  usarDatosTemporales,
  type DatosTemporales,
} from "../helpers.ts";

let temporal: DatosTemporales;
let log: ReturnType<typeof mockLog>;

beforeEach(() => {
  temporal = usarDatosTemporales();
  log = mockLog();
});

afterEach(() => {
  log.mockRestore();
  temporal.limpiar();
});

test("cambiarUnidad pasa de °C a °F y persiste el cambio", async () => {
  const datos = datosBase();
  await cambiarUnidad(datos);
  expect(datos.unidad).toBe("F");
  expect((await cargarDatos()).unidad).toBe("F");
  expect(impresiones(log)).toContain("Unidad cambiada a °F.");
});

test("cambiarUnidad pasa de °F a °C y conserva el resto", async () => {
  const datos = { ...datosBase(), unidad: "F" as const };
  await cambiarUnidad(datos);
  expect((await cargarDatos()).unidad).toBe("C");
  expect(datos.ciudades).toHaveLength(2);
  expect(impresiones(log)).toContain("Unidad cambiada a °C.");
});
