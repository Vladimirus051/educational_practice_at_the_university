import { Line } from 'react-konva';
import { Point } from '@/shared/types';
interface CurveProps {
    points: Point[];
}
export const Curve = ({ points }: CurveProps) => {
    const flatPoints = points.flatMap(p => [p.x, p.y]);
    return (
        <Line
            points={flatPoints}
            stroke="black"
            strokeWidth={2}
            tension={0.5} 
            lineCap="round"
            lineJoin="round"
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
            perfectDrawEnabled={false} 
            listening={false} 
        />
    );
};
