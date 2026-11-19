import { $ } from "bun";
import { expect, test } from "bun:test";

async function pintarEnProceso(
  texto: string,
  color: string,
  variables: Record<string, string | undefined>,
): Promise<string> {
  const script = `import { pintar } from "./src/utils/colors.ts"; process.stdout.write(pintar(${JSON.stringify(texto)}, ${JSON.stringify(color)}));`;
  return await $`${process.execPath} -e ${script}`
    .env({ ...process.env, ...variables })
    .text();
}

test("pintar aplica códigos ANSI con FORCE_COLOR", async () => {
  const salida = await pintarEnProceso("hola", "cyan", {
    NO_COLOR: undefined,
    FORCE_COLOR: "1",
  });
  expect(salida).toBe("\x1b[36mhola\x1b[0m");
});

test("pintar respeta NO_COLOR", async () => {
  const salida = await pintarEnProceso("hola", "rojo", {
    NO_COLOR: "1",
    FORCE_COLOR: undefined,
  });
  expect(salida).toBe("hola");
});

test("pintar no colorea en pipes sin FORCE_COLOR", async () => {
  const salida = await pintarEnProceso("hola", "verde", {
    NO_COLOR: undefined,
    FORCE_COLOR: undefined,
  });
  expect(salida).toBe("hola");
});
