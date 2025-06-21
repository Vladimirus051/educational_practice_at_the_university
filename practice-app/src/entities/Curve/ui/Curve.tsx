import { Line } from 'react-konva';
import { Point } from '@/shared/types';

interface CurveProps {
    points: Point[];
}

export const Curve = ({ points }: CurveProps) => {
    // Преобразуем массив точек в плоский массив [x1, y1, x2, y2, ...]
    const flatPoints = points.flatMap(p => [p.x, p.y]);

    // ИСПОЛЬЗУЕМ ОБЫЧНЫЙ КОМПОНЕНТ Line ИЗ react-konva БЕЗ АНИМАЦИИ.
    // ЭТО КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ, УСТРАНЯЮЩЕЕ КОНФЛИКТ.
    return (
        <Line
            points={flatPoints}
            stroke="black"
            strokeWidth={2}
            tension={0.5} // Сглаживание линии
            lineCap="round"
            lineJoin="round"
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
            perfectDrawEnabled={false} // Оптимизация для динамических линий
            listening={false} // Линия не должна перехватывать события мыши
        />
    );
};
