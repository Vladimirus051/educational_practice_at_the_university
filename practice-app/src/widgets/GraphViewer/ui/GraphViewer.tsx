import React, { forwardRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { Curve } from '@/entities/Curve';
import { Point } from '@/shared/types';
import Konva from 'konva';

interface GraphViewerProps {
    width: number;
    height: number;
    scale: number;
    curvePoints: Point[];
    children?: React.ReactNode;
    // НОВОЕ: Пропсы для центрирования и перетаскивания
    offsetX?: number;
    offsetY?: number;
    draggable?: boolean;
}

export const GraphViewer = forwardRef<Konva.Layer, GraphViewerProps>(
    ({ width, height, scale, curvePoints, children, offsetX, offsetY, draggable }, ref) => {
        return (
            <Stage
                width={width}
                height={height}
                scaleX={scale}
                scaleY={scale}
                // НОВОЕ: Центрирование вида и включение перетаскивания
                x={width / 2}
                y={height / 2}
                offsetX={offsetX}
                offsetY={offsetY}
                draggable={draggable}
            >
                <Layer ref={ref}>
                    <Curve points={curvePoints} />
                    {children}
                </Layer>
            </Stage>
        );
    }
);

GraphViewer.displayName = 'GraphViewer';
