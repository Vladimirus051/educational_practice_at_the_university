import { Circle, Line, Text } from 'react-konva';

interface PolarGridProps {
	width: number;
	height: number;
	maxRadius: number;
}

export const PolarGrid = ({ width, height, maxRadius }: PolarGridProps) => {
	const circles = [];
	const lines = [];
	const labels = [];
	const numCircles = 5;
	const numLines = 12;

	// Рисуем концентрические окружности
	for (let i = 1; i <= numCircles; i++) {
		const radius = (i / numCircles) * maxRadius;
		circles.push(
			<Circle
				key={`circ-${i}`}
				x={0}
				y={0}
				radius={radius}
				stroke="#e0e0e0"
				strokeWidth={1}
				listening={false}
			/>
		);
	}

	// Рисуем радиальные линии и метки углов
	for (let i = 0; i < numLines; i++) {
		const angleRad = (i / numLines) * 2 * Math.PI; // Угол в радианах
		const x2 = maxRadius * Math.cos(angleRad);
		const y2 = maxRadius * Math.sin(angleRad);
		lines.push(
			<Line key={`line-${i}`} points={[0, 0, x2, y2]} stroke="#e0e0e0" strokeWidth={1} listening={false} />
		);

		// --- ЛОГИКА ДЛЯ ИСПРАВЛЕНИЯ ТЕКСТА ---
		const labelAngleDeg = Math.round((i * 360) / numLines);
		const labelRadius = maxRadius + 15; // Отодвигаем текст чуть дальше от сетки
		const labelX = labelRadius * Math.cos(angleRad);
		const labelY = labelRadius * Math.sin(angleRad);

		// Рассчитываем поворот так, чтобы текст всегда был читаемым
		let rotation = labelAngleDeg;
		// Для меток в левой полуплоскости (между 90 и 270 градусами)
		// добавляем 180 градусов, чтобы они не были перевернуты.
		if (rotation > 90 && rotation < 270) {
			rotation += 180;
		}

		labels.push(
			<Text
				key={`label-${i}`}
				x={labelX}
				y={labelY}
				text={`${labelAngleDeg}°`}
				fontSize={10}
				fill="gray"
				listening={false}
				// КЛЮЧЕВЫЕ ИСПРАВЛЕНИЯ:
				// 1. Компенсируем глобальную инверсию оси Y, чтобы текст не был перевернут.
				scaleY={-1}
				// 2. Поворачиваем текст для лучшей читаемости.
				rotation={rotation}
				align="center"
				verticalAlign="middle"
			/>
		);
	}

	return (
		<>
			{circles}
			{lines}
			{labels}
		</>
	);
};
