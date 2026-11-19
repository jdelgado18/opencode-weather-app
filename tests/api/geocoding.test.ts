import { afterEach, beforeEach, expect, test } from "bun:test";
import { buscarCiudad } from "../../src/api/geocoding.ts";
import { mockFetch, type FetchMock } from "../helpers.ts";

let fetchSpy: FetchMock;

beforeEach(() => {
  fetchSpy = mockFetch();
});

afterEach(() => {
  fetchSpy.mockRestore();
});

test("buscarCiudad arma la URL de geocoding y devuelve la ciudad", async () => {
  let url = "";
  fetchSpy.mockImplementation(async (entrada) => {
    url = String(entrada);
    return Response.json({
      results: [
        { name: "Lima", latitude: -12.04318, longitude: -77.02824, country: "Perú" },
      ],
    });
  });

  const ciudad = await buscarCiudad("Lima");
  const pedida = new URL(url);
  expect(`${pedida.origin}${pedida.pathname}`).toBe(
    "https://geocoding-api.open-meteo.com/v1/search",
  );
  expect(pedida.searchParams.get("name")).toBe("Lima");
  expect(pedida.searchParams.get("count")).toBe("1");
  expect(pedida.searchParams.get("language")).toBe("es");
  expect(pedida.searchParams.get("format")).toBe("json");
  expect(ciudad).toEqual({
    nombre: "Lima",
    latitud: -12.04318,
    longitud: -77.02824,
    pais: "Perú",
  });
});

test("buscarCiudad usa país vacío cuando la respuesta no lo trae", async () => {
  fetchSpy.mockImplementation(async () =>
    Response.json({ results: [{ name: "Lima", latitude: -12, longitude: -77 }] }),
  );

  expect((await buscarCiudad("Lima"))?.pais).toBe("");
});

test("buscarCiudad devuelve null cuando no hay resultados", async () => {
  fetchSpy.mockImplementation(async () => Response.json({}));
  expect(await buscarCiudad("CiudadInexistente")).toBeNull();
});

test("buscarCiudad informa el error HTTP de OpenMeteo", async () => {
  fetchSpy.mockImplementation(async () => new Response("", { status: 503 }));
  await expect(buscarCiudad("Lima")).rejects.toThrow("OpenMeteo devolvió el error 503.");
});

test("buscarCiudad informa una respuesta inválida", async () => {
  fetchSpy.mockImplementation(async () => new Response("no es json"));
  await expect(buscarCiudad("Lima")).rejects.toThrow(
    "OpenMeteo devolvió una respuesta inválida.",
  );
});

test("buscarCiudad informa si no se pudo conectar", async () => {
  fetchSpy.mockImplementation(async () => {
    throw new Error("sin red");
  });
  await expect(buscarCiudad("Lima")).rejects.toThrow(
    "No se pudo conectar con OpenMeteo. Revisa tu conexión.",
  );
});
