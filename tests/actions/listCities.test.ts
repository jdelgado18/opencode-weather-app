import { afterEach, beforeEach, expect, test } from "bun:test";
import { listar } from "../../src/actions/listCities.ts";
import { impresiones, lima, mockLog, otawara } from "../helpers.ts";

let log: ReturnType<typeof mockLog>;

beforeEach(() => {
  log = mockLog();
});

afterEach(() => {
  log.mockRestore();
});

test("listar muestra todas las ciudades numeradas", () => {
  listar([lima, otawara]);
  expect(impresiones(log)).toBe("  1. Lima, Perú\n  2. Ōtawara, Japón");
});

test("listar avisa si no hay ciudades registradas", () => {
  listar([]);
  expect(impresiones(log)).toContain("No hay ciudades registradas.");
});
