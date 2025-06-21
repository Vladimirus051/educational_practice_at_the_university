import { useState, useRef, useCallback, useEffect, RefObject } from 'react';
import Konva from 'konva';
import { Point } from '@/shared/types';

// ИСПРАВЛЕНИЕ: Хук теперь принимает RefObject напрямую
export const usePrimitiveAnimation = (
    points: Point[],
    onPositionUpdate: (pos: Point) => void,
    layerRef: RefObject<Konva.Layer>
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<Konva.Animation | null>(null);

  const stopAnimation = useCallback(() => {
    if (animationRef.current?.isRunning()) {
      animationRef.current.stop();
    }
    setIsAnimating(false);
  }, []);

  const startAnimation = useCallback(() => {
    // ИСПРАВЛЕНИЕ: Проверяем layerRef.current напрямую
    if (isAnimating || points.length < 2 || !layerRef.current) {
      return;
    }

    if (!animationRef.current) {
      animationRef.current = new Konva.Animation((frame) => {
        if (!frame || points.length === 0) return;
        const duration = 8000;
        const progress = (frame.time % duration) / duration;
        const index = Math.floor(progress * points.length);
        onPositionUpdate(points[index % points.length]);
      }, layerRef.current); // Используем переданный ref
    }

    animationRef.current.start();
    setIsAnimating(true);
  }, [isAnimating, points, onPositionUpdate, layerRef]);

  useEffect(() => {
    // Функция очистки при размонтировании компонента.
    return () => {
      animationRef.current?.stop();
    };
  }, []);

  // ИСПРАВЛЕНИЕ: `setLayer` больше не нужен
  return { isAnimating, startAnimation, stopAnimation };
};
