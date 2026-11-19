import { afterEach, beforeEach, expect, test } from "bun:test";
import {
  aviso,
  info,
  listarCiudades,
  mostrarClima,
  mostrarPronostico,
} from "../../src/presentation/output.ts";
import { impresiones, lima, mockLog, otawara } from "../helpers.ts";

let log: ReturnType<typeof mockLog>;

beforeEach(() => {
  log = mockLog();
});

afterEach(() => {
  log.mockRestore();
});

test("mostrarClima muestra la etiqueta y la temperatura con su unidad", () => {
  mostrarClima(lima, { temperatura: 18.46, unidad: "C" });
  expect(impresiones(log)).toBe("  Lima, Perú: 18.5 °C");
});

test("mostrarPronostico muestra fecha, mínima, máxima y código WMO", () => {
  mostrarPronostico(lima, {
    unidad: "C",
    dias: [
      { fecha: "2026-11-18", minima: 16, maxima: 22, codigoTiempo: 0 },
      { fecha: "2026-11-19", minima: 17, maxima: 23, codigoTiempo: null },
    ],
  });
  const salida = impresiones(log);
  expect(salida).toContain("Pronóstico a 7 días para Lima, Perú");
  expect(salida).toContain("mín 16.0 °C");
  expect(salida).toContain("máx 22.0 °C");
  expect(salida).toContain("Despejado");
  expect(salida).not.toContain("999");
});

test("listarCiudades numera las ciudades desde 1", () => {
  listarCiudades([lima, otawara]);
  expect(impresiones(log)).toBe("  1. Lima, Perú\n  2. Ōtawara, Japón");
});

test("info y aviso aplican sus prefijos", () => {
  info("Listo");
  aviso("Cuidado");
  expect(impresiones(log)).toBe("  Listo\n  ! Cuidado");
});
