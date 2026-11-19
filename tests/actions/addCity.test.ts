import { afterEach, beforeEach, expect, test } from "bun:test";
import { agregarCiudad } from "../../src/actions/addCity.ts";
import { cargarDatos } from "../../src/storage/dataFile.ts";
import {
  datosBase,
  impresiones,
  mockFetch,
  mockLog,
  usarDatosTemporales,
  type DatosTemporales,
  type FetchMock,
} from "../helpers.ts";

let temporal: DatosTemporales;
let fetchSpy: FetchMock;
let log: ReturnType<typeof mockLog>;

beforeEach(() => {
  temporal = usarDatosTemporales();
  fetchSpy = mockFetch();
  log = mockLog();
});

afterEach(() => {
  fetchSpy.mockRestore();
  log.mockRestore();
  temporal.limpiar();
});

test("agregarCiudad busca, agrega y persiste la ciudad", async () => {
  fetchSpy.mockImplementation(async () =>
    Response.json({
      results: [{ name: "París", latitude: 48.85, longitude: 2.35, country: "Francia" }],
    }),
  );
  const datos = datosBase();

  const encontrada = await agregarCiudad("Paris", datos);

  expect(encontrada).toEqual({
    nombre: "París", latitud: 48.85, longitud: 2.35, pais: "Francia",
  });
  expect(datos.ciudades).toHaveLength(3);
  expect((await cargarDatos()).ciudades).toHaveLength(3);
  expect(impresiones(log)).toContain("Ciudad agregada: París.");
});

test("agregarCiudad rechaza un nombre vacío sin consultar la API", async () => {
  expect(await agregarCiudad("", datosBase())).toBeNull();
  expect(fetchSpy).not.toHaveBeenCalled();
  expect(impresiones(log)).toContain("Debes ingresar un nombre.");
});

test("agregarCiudad rechaza ciudades repetidas sin importar mayúsculas", async () => {
  fetchSpy.mockImplementation(async () =>
    Response.json({ results: [{ name: "lima", latitude: -12, longitude: -77, country: "Perú" }] }),
  );
  const datos = datosBase();

  expect(await agregarCiudad("Lima", datos)).toBeNull();
  expect(datos.ciudades).toHaveLength(2);
  expect(impresiones(log)).toContain("Esa ciudad ya está registrada.");
});

test("agregarCiudad avisa cuando la ciudad no existe", async () => {
  fetchSpy.mockImplementation(async () => Response.json({}));
  expect(await agregarCiudad("NoExiste", datosBase())).toBeNull();
  expect(impresiones(log)).toContain('No se encontró "NoExiste".');
});

test("agregarCiudad captura errores de la API", async () => {
  fetchSpy.mockImplementation(async () => new Response("", { status: 500 }));
  expect(await agregarCiudad("París", datosBase())).toBeNull();
  expect(impresiones(log)).toContain("OpenMeteo devolvió el error 500.");
});
