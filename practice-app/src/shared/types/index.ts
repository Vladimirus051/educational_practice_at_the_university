export type Point = {
  x: number;
  y: number;
};

export interface CurveParams {
  a: number;
  k: number;  // Исправлено с l на k
  steps: number;
  turnsCount: number;
  scale?: number; // Опциональный параметр
}
export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};
