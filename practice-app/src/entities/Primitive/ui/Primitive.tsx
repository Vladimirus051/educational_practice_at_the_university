import { forwardRef } from 'react';
import Konva from 'konva';
import { Rect } from 'react-konva';
import { Point } from '@/shared/types';

interface PrimitiveProps {
    position: Point; // математические координаты внутри Stage
    size: number;    // итогу­вый размер в пикселях экрана(!)
}

export const Primitive = forwardRef<Konva.Rect, PrimitiveProps>(
    ({ position, size }, ref) => (
        <Rect
            ref={ref}
            x={position.x - size / 2}
            y={position.y - size / 2}
            width={size}
            height={size}
            fill="blue"
            listening={false}
            perfectDrawEnabled={false}
        />
    )
);
Primitive.displayName = 'Primitive';
