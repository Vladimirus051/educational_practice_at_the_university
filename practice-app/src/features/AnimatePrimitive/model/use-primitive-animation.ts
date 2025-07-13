import { useState, useRef, useCallback, useEffect, RefObject } from 'react';
import Konva from 'konva';
import { Point, AnimationParams } from '@/shared/types';

export const usePrimitiveAnimation = (
    points: Point[],
    onPositionUpdate: (pos: Point) => void,
    layerRef: RefObject<Konva.Layer>,
    animationParams: AnimationParams
) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const animationRef = useRef<Konva.Animation | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [points, animationParams]);

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

    setIsCompleted(false);
    startTimeRef.current = 0;

    if (!animationRef.current) {
      animationRef.current = new Konva.Animation((frame) => {
        if (!frame || points.length === 0) return;

        if (startTimeRef.current === 0) {
          startTimeRef.current = frame.time;
        }

        const elapsedTime = frame.time - startTimeRef.current;
        const baseDuration = 8000;
        const singleCycleDuration = baseDuration / animationParams.speed;
        const totalDuration = singleCycleDuration * animationParams.loops;


        if (elapsedTime >= totalDuration) {
          setIsCompleted(true);
          setIsAnimating(false);
          animationRef.current?.stop();
          return;
        }

        const cycleProgress = (elapsedTime % singleCycleDuration) / singleCycleDuration;
        const pointIndex = Math.floor(cycleProgress * points.length);
        const safeIndex = Math.min(pointIndex, points.length - 1);

        onPositionUpdate(points[safeIndex]);
      }, layerRef.current);
    }

    animationRef.current.start();
    setIsAnimating(true);
  }, [isAnimating, points, onPositionUpdate, layerRef, animationParams]);

  const resetAnimation = useCallback(() => {
    stopAnimation();
    setIsCompleted(false);
    if (points.length > 0) {
      onPositionUpdate(points[0]);
    }
  }, [stopAnimation, points, onPositionUpdate]);

  return {
    isAnimating,
    isCompleted,
    startAnimation,
    stopAnimation,
    resetAnimation
  };
};
