import { afterEach, beforeEach, expect, test } from "bun:test";
import { eliminarCiudad } from "../../src/actions/removeCity.ts";
import { cargarDatos } from "../../src/storage/dataFile.ts";
import {
  datosBase,
  impresiones,
  lima,
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

test("eliminarCiudad quita la ciudad y resetea la default si era esa", async () => {
  const datos = datosBase();
  // La app pasa la referencia devuelta por elegirCiudad, no una copia del fixture.
  await eliminarCiudad(datos.ciudades[0]!, datos);

  const guardado = await cargarDatos();
  expect(guardado.ciudades).toEqual([otawara]);
  expect(guardado.ciudadDefault).toBeNull();
  expect(guardado.unidad).toBe("C");
  expect(impresiones(log)).toContain("Ciudad eliminada: Lima.");
});

test("eliminarCiudad conserva la default si era otra ciudad", async () => {
  const datos = datosBase();
  await eliminarCiudad(datos.ciudades[1]!, datos);

  const guardado = await cargarDatos();
  expect(guardado.ciudades).toEqual([lima]);
  expect(guardado.ciudadDefault).toBe("Lima");
});
