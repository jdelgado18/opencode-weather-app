import { afterEach, beforeEach, expect, test } from "bun:test";
import { establecerDefault } from "../../src/actions/setDefaultCity.ts";
import { cargarDatos } from "../../src/storage/dataFile.ts";
import {
  datosBase,
  impresiones,
  mockLog,
  otawara,
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

test("establecerDefault guarda la nueva ciudad default sin tocar las ciudades", async () => {
  const datos = datosBase();
  await establecerDefault(otawara, datos);

  const guardado = await cargarDatos();
  expect(guardado.ciudadDefault).toBe("Ōtawara");
  expect(guardado.ciudades).toEqual(datos.ciudades);
  expect(impresiones(log)).toContain("Ciudad default: Ōtawara.");
});
