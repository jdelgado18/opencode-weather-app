import { expect, test } from "bun:test";
import {
  descifrarTiempo,
  etiqueta,
  formatearFecha,
  formatearTemperatura,
} from "../../src/utils/format.ts";
import { lima } from "../helpers.ts";

test("etiqueta incluye el país cuando está disponible", () => {
  expect(etiqueta(lima)).toBe("Lima, Perú");
});

test("etiqueta omite el país cuando está vacío", () => {
  expect(etiqueta({ ...lima, pais: "" })).toBe("Lima");
});

test("formatearTemperatura usa un decimal y el símbolo de la unidad", () => {
  expect(formatearTemperatura(18.46, "C")).toBe("18.5 °C");
  expect(formatearTemperatura(65, "F")).toBe("65.0 °F");
});

test("formatearFecha devuelve una fecha legible en español", () => {
  const fecha = formatearFecha("2026-11-18");
  expect(fecha).not.toBe("2026-11-18");
  expect(fecha).toContain("11");
});

test("formatearFecha deja intacto un valor inválido", () => {
  expect(formatearFecha("no-fecha")).toBe("no-fecha");
  expect(formatearFecha("2026-11")).toBe("2026-11");
});

test("descifrarTiempo traduce códigos WMO conocidos", () => {
  expect(descifrarTiempo(0)).toBe("Despejado");
  expect(descifrarTiempo(61)).toBe("Lluvia débil");
  expect(descifrarTiempo(99)).toBe("Tormenta con granizo intenso");
});

test("descifrarTiempo devuelve una cadena vacía si no hay código o es desconocido", () => {
  expect(descifrarTiempo(null)).toBe("");
  expect(descifrarTiempo(999)).toBe("");
});
