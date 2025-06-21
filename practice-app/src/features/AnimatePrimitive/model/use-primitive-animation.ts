import { useState, useRef, useCallback, useEffect } from 'react';
import Konva from 'konva';
import { Point } from '@/shared/types';

export const usePrimitiveAnimation = (
    points: Point[],
    onPositionUpdate: (pos: Point) => void
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<Konva.Animation | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);

  const stopAnimation = useCallback(() => {
    if (animationRef.current?.isRunning()) {
      animationRef.current.stop();
    }
    setIsAnimating(false);
  }, []); // Пустой массив зависимостей, т.к. функция не зависит от пропсов/стейта

  const startAnimation = useCallback(() => {
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
      }, layerRef.current);
    }

    animationRef.current.start();
    setIsAnimating(true);
  }, [isAnimating, points, onPositionUpdate]);

  const setLayer = useCallback((layer: Konva.Layer | null) => {
    layerRef.current = layer;
  }, []);

  useEffect(() => {
    // Эта функция очистки вызывается при размонтировании компонента.
    // Она безопасно останавливает анимацию, предотвращая утечки памяти.
    return () => {
      animationRef.current?.stop();
    };
  }, []); // Пустой массив зависимостей = выполнится один раз

  return { isAnimating, startAnimation, stopAnimation, setLayer };
};
