import { afterEach, beforeEach, expect, spyOn, test, type Mock } from "bun:test";
import { buscarCiudad } from "./geocoding.ts";

type FetchArgs = Parameters<typeof fetch>;
type FetchMock = Mock<(entrada: FetchArgs[0], init?: FetchArgs[1]) => Promise<Response>>;

let fetchSpy: FetchMock;

beforeEach(() => {
  fetchSpy = spyOn(globalThis, "fetch");
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

test("buscarCiudad devuelve null cuando no hay resultados", async () => {
  fetchSpy.mockImplementation(async () => Response.json({}));
  expect(await buscarCiudad("CiudadInexistente")).toBeNull();
});
