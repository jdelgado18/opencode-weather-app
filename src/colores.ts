const CODIGOS = {
  rojo: "\x1b[31m",
  verde: "\x1b[32m",
  amarillo: "\x1b[33m",
  cyan: "\x1b[36m",
} as const;

export type Color = keyof typeof CODIGOS;

const RESET = "\x1b[0m";

// Sin colores en pipes/redirecciones (o si NO_COLOR está definido); FORCE_COLOR los habilita.
const usarColor =
  process.env.NO_COLOR === undefined &&
  (process.env.FORCE_COLOR !== undefined || Boolean(process.stdout.isTTY));

export function pintar(texto: string, color: Color): string {
  return usarColor ? `${CODIGOS[color]}${texto}${RESET}` : texto;
}
