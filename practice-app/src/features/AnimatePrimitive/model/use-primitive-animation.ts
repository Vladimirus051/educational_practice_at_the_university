import { useState, useRef, useCallback, useEffect, RefObject } from 'react';
import Konva from 'konva';
import { Point } from '@/shared/types';

export const usePrimitiveAnimation = (
    points: Point[],
    onPositionUpdate: (pos: Point) => void,
    layerRef: RefObject<Konva.Layer>
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<Konva.Animation | null>(null);

  // ИСПРАВЛЕНИЕ: Этот useEffect будет следить за изменением кривой.
  // Если точки меняются, он уничтожает старую анимацию,
  // чтобы при следующем запуске она была создана заново с нуля.
  useEffect(() => {
    // Очистка при изменении `points` или размонтировании компонента
    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [points]); // Зависимость от массива точек

  const stopAnimation = useCallback(() => {
    if (animationRef.current?.isRunning()) {
      animationRef.current.stop();
    }
    setIsAnimating(false);
  }, []);

  const startAnimation = useCallback(() => {
    if (isAnimating || points.length < 2 || !layerRef.current) {
      return;
    }

    // Если анимации нет (она была уничтожена или это первый запуск), создаем ее
    if (!animationRef.current) {
      animationRef.current = new Konva.Animation((frame) => {
        if (!frame || points.length === 0) return;
        const duration = 8000;
        const progress = (frame.time % duration) / duration;
        const index = Math.floor(progress * points.length);
        onPositionUpdate(points[index % points.length]);
      }, layerRef.current);
    }

    animationRef.current.start();
    setIsAnimating(true);
  }, [isAnimating, points, onPositionUpdate, layerRef]);

  return { isAnimating, startAnimation, stopAnimation };
};
