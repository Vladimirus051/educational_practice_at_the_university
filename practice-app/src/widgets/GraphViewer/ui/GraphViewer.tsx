import React, { forwardRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { Curve } from '@/entities/Curve';
import { PolarGrid } from '@/entities/Curve/ui/PolarGrid';
import { CartesianAxes } from '@/entities/Curve/ui/CartesianAxes';
import { Point } from '@/shared/types';
import Konva from 'konva';

interface GraphViewerProps {
    width: number;
    height: number;
    scale: number;
    curvePoints: Point[];
    children?: React.ReactNode;
    offsetX: number;
    offsetY: number;
    draggable?: boolean;
    coordinateSystem: 'cartesian' | 'polar';
}

export const GraphViewer = forwardRef<Konva.Layer, GraphViewerProps>(
    ({ width, height, scale, curvePoints, children, offsetX, offsetY, draggable, coordinateSystem }, ref) => {
        const maxRadius = React.useMemo(() => {
            if (curvePoints.length === 0) {
                return Math.min(width, height) * 0.3;
            }
            return Math.max(...curvePoints.map(p => Math.sqrt(p.x * p.x + p.y * p.y)));
        }, [curvePoints, width, height]);

        const getDragBoundFunc = React.useCallback(() => {
            if (coordinateSystem !== 'cartesian') return undefined;

            const maxOffset = Math.min(width, height) * 0.3;

            return (pos: { x: number; y: number }) => ({
                x: Math.max(width / 2 - maxOffset, Math.min(width / 2 + maxOffset, pos.x)),
                y: Math.max(height / 2 - maxOffset, Math.min(height / 2 + maxOffset, pos.y))
            });
        }, [width, height, coordinateSystem]);

        return (
            <Stage
                width={width}
                height={height}
                scaleX={scale}
                scaleY={coordinateSystem === 'polar' ? -scale : scale}
                x={width / 2}
                y={height / 2}
                offsetX={offsetX}
                offsetY={offsetY}
                draggable={draggable}
                dragBoundFunc={getDragBoundFunc()}
            >
                <Layer ref={ref}>
                    {coordinateSystem === 'polar' && (
                        <PolarGrid width={width} height={height} maxRadius={maxRadius} />
                    )}
                    {coordinateSystem === 'cartesian' && (
                        <CartesianAxes width={width} height={height} scale={scale} offsetX={offsetX} offsetY={offsetY} />
                    )}
                    <Curve points={curvePoints} />
                    {children}
                </Layer>
            </Stage>
        );
    }
);
