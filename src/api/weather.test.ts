import { afterEach, beforeEach, expect, spyOn, test, type Mock } from "bun:test";
import type { Ciudad } from "../types/City.ts";
import { obtenerPronostico } from "./weather.ts";

const lima: Ciudad = {
  nombre: "Lima",
  latitud: -12.04318,
  longitud: -77.02824,
  pais: "Perú",
};

// El `fetch` de Bun tiene propiedades extra (`preconnect`); acá solo nos interesa la firma callable.
type FetchArgs = Parameters<typeof fetch>;
type FetchMock = Mock<(entrada: FetchArgs[0], init?: FetchArgs[1]) => Promise<Response>>;

let fetchSpy: FetchMock;

beforeEach(() => {
  fetchSpy = spyOn(globalThis, "fetch");
});

afterEach(() => {
  fetchSpy.mockRestore();
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

test("obtenerPronostico avisa si la respuesta no trae datos diarios", async () => {
  fetchSpy.mockImplementation(async () => Response.json({}));

  await expect(obtenerPronostico(lima, "C")).rejects.toThrow(
    "La respuesta no incluyó el pronóstico diario.",
  );
});
