export type Point = {
  x: number;
  y: number;
};
export interface CurveParams {
  a: number;
  k: number;
  steps: number;
}
export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};
export interface AnimationParams {
  speed: number;
  loops: number;
}
