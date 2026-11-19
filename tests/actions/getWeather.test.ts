import { afterEach, beforeEach, expect, test } from "bun:test";
import { climaDe, climaDeTodas } from "../../src/actions/getWeather.ts";
import { impresiones, lima, mockFetch, mockLog, otawara, type FetchMock } from "../helpers.ts";

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

test("climaDe consulta por coordenadas y muestra el resultado", async () => {
  let url = "";
  fetchSpy.mockImplementation(async (entrada) => {
    url = String(entrada);
    return Response.json({ current: { temperature_2m: 20 } });
  });

  await climaDe(lima, "C");

  const pedida = new URL(url);
  expect(pedida.searchParams.get("latitude")).toBe(String(lima.latitud));
  expect(pedida.searchParams.get("current")).toBe("temperature_2m");
  expect(impresiones(log)).toBe("  Lima, Perú: 20.0 °C");
});

test("climaDeTodas consulta cada ciudad", async () => {
  fetchSpy.mockImplementation(async () => Response.json({ current: { temperature_2m: 20 } }));

  await climaDeTodas([lima, otawara], "F");

  expect(fetchSpy).toHaveBeenCalledTimes(2);
  expect(impresiones(log)).toContain("Lima, Perú: 20.0 °F");
  expect(impresiones(log)).toContain("Ōtawara, Japón: 20.0 °F");
});

test("climaDe avisa si la API devuelve un error", async () => {
  fetchSpy.mockImplementation(async () => new Response("", { status: 500 }));
  await climaDe(lima, "C");
  expect(impresiones(log)).toContain("OpenMeteo devolvió el error 500.");
});

test("climaDe avisa si no hay temperatura en la respuesta", async () => {
  fetchSpy.mockImplementation(async () => Response.json({}));
  await climaDe(lima, "C");
  expect(impresiones(log)).toContain("La respuesta no incluyó la temperatura actual.");
});
