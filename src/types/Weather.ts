export type Unidad = "C" | "F";

export type Clima = {
  temperatura: number;
  unidad: Unidad;
};

export type DiaPronostico = {
  fecha: string;
  minima: number;
  maxima: number;
  codigoTiempo: number | null;
};

export type Pronostico = {
  dias: DiaPronostico[];
  unidad: Unidad;
};
