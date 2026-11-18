export type Unidad = "C" | "F";

export type Ciudad = {
  nombre: string;
  latitud: number;
  longitud: number;
  pais: string;
};

export type Datos = {
  ciudades: Ciudad[];
  ciudadDefault: string | null;
  unidad: Unidad;
};

export type Store = {
  cargar(): Promise<Datos>;
  guardar(datos: Datos): Promise<void>;
};

function vacios(): Datos {
  return { ciudades: [], ciudadDefault: null, unidad: "C" };
}

function esCiudad(valor: unknown): valor is Ciudad {
  if (typeof valor !== "object" || valor === null) return false;
  const ciudad = valor as Record<string, unknown>;
  return (
    typeof ciudad.nombre === "string" &&
    typeof ciudad.latitud === "number" &&
    typeof ciudad.longitud === "number" &&
    typeof ciudad.pais === "string"
  );
}

function normalizar(valor: unknown): Datos {
  if (typeof valor !== "object" || valor === null) return vacios();
  const crudo = valor as Record<string, unknown>;
  const ciudades = Array.isArray(crudo.ciudades) ? crudo.ciudades.filter(esCiudad) : [];
  const ciudadDefault =
    typeof crudo.ciudadDefault === "string" &&
    ciudades.some((ciudad) => ciudad.nombre === crudo.ciudadDefault)
      ? crudo.ciudadDefault
      : null;
  return {
    ciudades,
    ciudadDefault,
    unidad: crudo.unidad === "F" ? "F" : "C",
  };
}

export function crearStore(ruta: string): Store {
  return {
    async cargar() {
      const archivo = Bun.file(ruta);
      if (!(await archivo.exists())) return vacios();
      try {
        return normalizar(await archivo.json());
      } catch {
        return vacios();
      }
    },
    async guardar(datos) {
      await Bun.write(ruta, `${JSON.stringify(datos, null, 2)}\n`);
    },
  };
}
