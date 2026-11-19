import { afterEach, beforeEach, expect, test } from "bun:test";
import { mostrarMenu, opcionesMenu } from "../../src/presentation/menu.ts";
import { datosBase, impresiones, mockLog } from "../helpers.ts";

let log: ReturnType<typeof mockLog>;

beforeEach(() => {
  log = mockLog();
});

afterEach(() => {
  log.mockRestore();
});

test("opcionesMenu construye las opciones con el conteo y la unidad actuales", () => {
  const opciones = opcionesMenu(datosBase());
  expect(opciones).toHaveLength(9);
  expect(opciones.map((opcion) => opcion.clave)).toEqual([
    "1", "2", "3", "4", "5", "6", "7", "8", "9",
  ]);
  expect(opciones[1]?.etiqueta).toBe("Clima de todas las ciudades (2)");
  expect(opciones[6]?.etiqueta).toBe("Listar ciudades");
  expect(opciones[7]?.etiqueta).toBe("Ajustes (°C)");
});

test("mostrarMenu pinta el encabezado, la opción 7 y el estado actual", () => {
  mostrarMenu({ ...datosBase(), unidad: "F" });
  const salida = impresiones(log);
  expect(salida).toContain("WEATHER CLI");
  expect(salida).toContain("  7. Listar ciudades");
  expect(salida).toContain("Clima de todas las ciudades (2)");
  expect(salida).toContain("Ajustes (°F)");
});
