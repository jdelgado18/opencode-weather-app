import { afterEach, beforeEach, expect, test } from "bun:test";
import { elegirCiudad, leer } from "../../src/presentation/input.ts";
import { impresiones, lima, mockLog, mockPrompt, otawara } from "../helpers.ts";

let promptSpy: ReturnType<typeof mockPrompt>;
let log: ReturnType<typeof mockLog>;

beforeEach(() => {
  promptSpy = mockPrompt();
  log = mockLog();
});

afterEach(() => {
  promptSpy.mockRestore();
  log.mockRestore();
});

test("leer recorta espacios y devuelve la entrada", () => {
  promptSpy.mockImplementation(() => "  Lima  ");
  let cerro = false;
  expect(leer("  Ciudad: ", () => { cerro = true; })).toBe("Lima");
  expect(cerro).toBe(false);
});

test("leer avisa al cerrar la entrada y devuelve null", () => {
  promptSpy.mockImplementation(() => null);
  let cerro = false;
  expect(leer("  Ciudad: ", () => { cerro = true; })).toBeNull();
  expect(cerro).toBe(true);
});

test("elegirCiudad avisa si no hay ciudades y no pregunta", () => {
  let cerro = false;
  expect(elegirCiudad("  Número: ", [], () => { cerro = true; })).toBeNull();
  expect(impresiones(log)).toContain("No hay ciudades registradas.");
  expect(promptSpy).not.toHaveBeenCalled();
  expect(cerro).toBe(false);
});

test("elegirCiudad lista las ciudades y devuelve la seleccionada", () => {
  promptSpy.mockImplementation(() => "2");
  let cerro = false;
  expect(elegirCiudad("  Número: ", [lima, otawara], () => { cerro = true; })).toEqual(otawara);
  expect(impresiones(log)).toContain("1. Lima, Perú");
  expect(impresiones(log)).toContain("2. Ōtawara, Japón");
  expect(cerro).toBe(false);
});

test("elegirCiudad rechaza índices no válidos", () => {
  promptSpy.mockImplementation(() => "7");
  expect(elegirCiudad("  Número: ", [lima], () => {})).toBeNull();
  expect(impresiones(log)).toContain("Selección no válida.");
});

test("elegirCiudad avisa al cerrar la entrada", () => {
  promptSpy.mockImplementation(() => null);
  let cerro = false;
  expect(elegirCiudad("  Número: ", [lima], () => { cerro = true; })).toBeNull();
  expect(cerro).toBe(true);
});
