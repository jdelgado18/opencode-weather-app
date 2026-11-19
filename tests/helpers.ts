import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spyOn, type Mock } from "bun:test";
import type { Ciudad } from "../src/types/City.ts";
import type { Datos } from "../src/types/Settings.ts";

export const lima: Ciudad = {
  nombre: "Lima",
  latitud: -12.04318,
  longitud: -77.02824,
  pais: "Perú",
};

export const otawara: Ciudad = {
  nombre: "Ōtawara",
  latitud: 36.86667,
  longitud: 140.03333,
  pais: "Japón",
};

export function datosBase(): Datos {
  return {
    ciudades: [{ ...lima }, { ...otawara }],
    ciudadDefault: "Lima",
    unidad: "C",
  };
}

// El `fetch` de Bun tiene propiedades extra (`preconnect`); acá solo nos interesa la firma callable.
type FetchArgs = Parameters<typeof fetch>;
export type FetchMock = Mock<(entrada: FetchArgs[0], init?: FetchArgs[1]) => Promise<Response>>;

export function mockFetch(): FetchMock {
  return spyOn(globalThis, "fetch");
}

export type PromptMock = Mock<(mensaje?: string, valor?: string) => string | null>;

export function mockPrompt(): PromptMock {
  return spyOn(globalThis, "prompt");
}

export function mockLog() {
  const espia = spyOn(console, "log");
  espia.mockImplementation(() => {});
  return espia;
}

// Los mensajes pueden traer códigos ANSI según el entorno (TTY/FORCE_COLOR);
// las aserciones trabajan con el texto visible, sin importar los colores.
const ANSI = /\u001b\[[0-9;]*m/g;

export function impresiones(log: { mock: { calls: unknown[][] } }): string {
  return log.mock.calls
    .map((llamada) => llamada.map(String).join(" ").replace(ANSI, ""))
    .join("\n");
}

export type DatosTemporales = {
  ruta: string;
  limpiar(): void;
};

// WEATHER_DATA_FILE se lee en cada llamada, así que cada test puede usar su
// propio archivo sin afectar al datos.json real del proyecto.
export function usarDatosTemporales(): DatosTemporales {
  const raiz = existsSync("/tmp/opencode") ? "/tmp/opencode" : tmpdir();
  const directorio = mkdtempSync(join(raiz, "weather-tests-"));
  const ruta = join(directorio, "datos.json");
  const anterior = Bun.env.WEATHER_DATA_FILE;
  Bun.env.WEATHER_DATA_FILE = ruta;

  return {
    ruta,
    limpiar() {
      if (anterior === undefined) delete Bun.env.WEATHER_DATA_FILE;
      else Bun.env.WEATHER_DATA_FILE = anterior;
      rmSync(directorio, { recursive: true, force: true });
    },
  };
}

export function escribirCrudo(ruta: string, valor: unknown): void {
  writeFileSync(ruta, JSON.stringify(valor));
}
