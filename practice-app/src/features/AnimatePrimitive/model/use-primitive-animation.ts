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
  useEffect(() => {
    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [points]); 
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
