import { useMemo } from 'react';
import { Point, CurveParams } from '@/shared/types';

// Эта функция теперь вычисляет только "чистые" математические координаты
const calculatePascalLimaçonPoint = (t: number, a: number, k: number): Point => {
  const r = a * (k + Math.cos(t));
  const x = r * Math.cos(t);
  const y = r * Math.sin(t);
  return { x, y };
};

// Хук теперь не зависит от размеров сцены и не выполняет масштабирование
export const useCurvePoints = (params: CurveParams): Point[] => {
  return useMemo(() => {
    const points: Point[] = [];
    const { a, k, steps, turnsCount } = params;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turnsCount * 2 * Math.PI;
      const mathPoint = calculatePascalLimaçonPoint(t, a, k);
      points.push(mathPoint);
    }
    return points;
  }, [params]);
};
