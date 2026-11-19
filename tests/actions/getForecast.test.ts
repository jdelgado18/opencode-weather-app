import { afterEach, beforeEach, expect, test } from "bun:test";
import { pronosticoDe } from "../../src/actions/getForecast.ts";
import { impresiones, lima, mockFetch, mockLog, type FetchMock } from "../helpers.ts";

let fetchSpy: FetchMock;
let log: ReturnType<typeof mockLog>;

beforeEach(() => {
  fetchSpy = mockFetch();
  log = mockLog();
});

afterEach(() => {
  fetchSpy.mockRestore();
  log.mockRestore();
});

test("pronosticoDe muestra el pronóstico devuelto", async () => {
  fetchSpy.mockImplementation(async () =>
    Response.json({
      daily: {
        time: ["2026-11-18"],
        temperature_2m_max: [22],
        temperature_2m_min: [16],
        weather_code: [0],
      },
    }),
  );

  await pronosticoDe(lima, "C");

  const salida = impresiones(log);
  expect(salida).toContain("Consultando pronóstico a 7 días...");
  expect(salida).toContain("Pronóstico a 7 días para Lima, Perú");
  expect(salida).toContain("mín 16.0 °C");
  expect(salida).toContain("Despejado");
});

test("pronosticoDe avisa si falla la API", async () => {
  fetchSpy.mockImplementation(async () => new Response("", { status: 503 }));
  await pronosticoDe(lima, "C");
  expect(impresiones(log)).toContain("Consultando pronóstico a 7 días...");
  expect(impresiones(log)).toContain("OpenMeteo devolvió el error 503.");
});
