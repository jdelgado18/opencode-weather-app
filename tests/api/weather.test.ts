import { afterEach, beforeEach, expect, test } from "bun:test";
import { obtenerClima, obtenerPronostico } from "../../src/api/weather.ts";
import { lima, mockFetch, type FetchMock } from "../helpers.ts";

let fetchSpy: FetchMock;

beforeEach(() => {
  fetchSpy = mockFetch();
});

afterEach(() => {
  fetchSpy.mockRestore();
});

test("obtenerClima pide la temperatura actual por coordenadas y devuelve °C", async () => {
  let url = "";
  fetchSpy.mockImplementation(async (entrada) => {
    url = String(entrada);
    return Response.json({ current: { temperature_2m: 18.4 } });
  });

  const clima = await obtenerClima(lima, "C");
  const pedida = new URL(url);
  expect(`${pedida.origin}${pedida.pathname}`).toBe("https://api.open-meteo.com/v1/forecast");
  expect(pedida.searchParams.get("latitude")).toBe(String(lima.latitud));
  expect(pedida.searchParams.get("longitude")).toBe(String(lima.longitud));
  expect(pedida.searchParams.get("current")).toBe("temperature_2m");
  expect(pedida.searchParams.get("temperature_unit")).toBeNull();
  expect(clima).toEqual({ temperatura: 18.4, unidad: "C" });
});

test("obtenerClima pide fahrenheit cuando la unidad es F", async () => {
  let url = "";
  fetchSpy.mockImplementation(async (entrada) => {
    url = String(entrada);
    return Response.json({ current: { temperature_2m: 65 } });
  });

  const clima = await obtenerClima(lima, "F");
  expect(new URL(url).searchParams.get("temperature_unit")).toBe("fahrenheit");
  expect(clima.unidad).toBe("F");
});

test("obtenerClima falla si la respuesta no trae temperatura", async () => {
  fetchSpy.mockImplementation(async () => Response.json({}));
  await expect(obtenerClima(lima, "C")).rejects.toThrow(
    "La respuesta no incluyó la temperatura actual.",
  );
});

test("obtenerPronostico pide 7 días y devuelve mínimas, máximas y código WMO", async () => {
  let url = "";
  fetchSpy.mockImplementation(async (entrada) => {
    url = String(entrada);
    return Response.json({
      daily: {
        time: ["2026-11-18", "2026-11-19"],
        temperature_2m_max: [22, 23],
        temperature_2m_min: [16, 17],
        weather_code: [0, 61],
      },
    });
  });

  const pronostico = await obtenerPronostico(lima, "F");

  const pedida = new URL(url);
  expect(pedida.searchParams.get("daily")).toBe(
    "temperature_2m_max,temperature_2m_min,weather_code",
  );
  expect(pedida.searchParams.get("forecast_days")).toBe("7");
  expect(pedida.searchParams.get("timezone")).toBe("auto");
  expect(pedida.searchParams.get("temperature_unit")).toBe("fahrenheit");
  expect(pronostico.unidad).toBe("F");
  expect(pronostico.dias).toEqual([
    { fecha: "2026-11-18", maxima: 22, minima: 16, codigoTiempo: 0 },
    { fecha: "2026-11-19", maxima: 23, minima: 17, codigoTiempo: 61 },
  ]);
});

test("obtenerPronostico limita la respuesta a 7 días", async () => {
  fetchSpy.mockImplementation(async () =>
    Response.json({
      daily: {
        time: Array.from({ length: 10 }, (_, i) => `2026-11-${i + 1}`),
        temperature_2m_max: Array(10).fill(20),
        temperature_2m_min: Array(10).fill(15),
        weather_code: Array(10).fill(0),
      },
    }),
  );

  const pronostico = await obtenerPronostico(lima, "C");
  expect(pronostico.dias).toHaveLength(7);
});

test("obtenerPronostico omite días incompletos y marca el código ausente como null", async () => {
  fetchSpy.mockImplementation(async () =>
    Response.json({
      daily: {
        time: ["2026-11-18", "2026-11-19", "2026-11-20"],
        temperature_2m_max: [22, 23],
        temperature_2m_min: [16, 17],
        weather_code: [999],
      },
    }),
  );

  const pronostico = await obtenerPronostico(lima, "C");
  expect(pronostico.dias).toEqual([
    { fecha: "2026-11-18", maxima: 22, minima: 16, codigoTiempo: 999 },
    { fecha: "2026-11-19", maxima: 23, minima: 17, codigoTiempo: null },
  ]);
});

test("obtenerPronostico avisa si la respuesta no trae datos diarios", async () => {
  fetchSpy.mockImplementation(async () => Response.json({}));
  await expect(obtenerPronostico(lima, "C")).rejects.toThrow(
    "La respuesta no incluyó el pronóstico diario.",
  );
});

test("obtenerPronostico avisa si no hay temperaturas diarias válidas", async () => {
  fetchSpy.mockImplementation(async () =>
    Response.json({ daily: { time: ["2026-11-18"] } }),
  );
  await expect(obtenerPronostico(lima, "C")).rejects.toThrow(
    "La respuesta no incluyó temperaturas diarias.",
  );
});
