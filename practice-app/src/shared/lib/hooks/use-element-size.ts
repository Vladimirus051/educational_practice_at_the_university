import { useState, useLayoutEffect, RefObject } from 'react';
export function useElementSize<T extends HTMLElement>(elementRef: RefObject<T>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      setSize({
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    });
    observer.observe(element);
    setSize({ width: element.offsetWidth, height: element.offsetHeight });
    return () => {
      observer.disconnect();
    };
  }, [elementRef]);
  return size;
}
