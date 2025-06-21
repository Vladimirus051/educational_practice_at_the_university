import React from 'react';
import { Line, Text } from 'react-konva';

interface CartesianAxesProps {
	width: number;
	height: number;
	scale: number;
	offsetX: number;
	offsetY: number;
}

const calculateNiceStep = (range: number, maxTicks: number): number => {
	if (range <= 0) return 1;
	const rawStep = range / maxTicks;
	const exponent = Math.floor(Math.log10(rawStep));
	const magnitude = Math.pow(10, exponent);
	const normalizedStep = rawStep / magnitude;

	if (normalizedStep > 5) return 10 * magnitude;
	if (normalizedStep > 2) return 5 * magnitude;
	if (normalizedStep > 1) return 2 * magnitude;
	return magnitude;
};

export const CartesianAxes = ({ width, height, scale, offsetX, offsetY }: CartesianAxesProps) => {
	// --- КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Вычисляем видимую область холста в мировых координатах ---
	const viewWidth = width / scale;
	const viewHeight = height / scale;

	const minX = offsetX - viewWidth / 2;
	const maxX = offsetX + viewWidth / 2;
	const minY = offsetY - viewHeight / 2;
	const maxY = offsetY + viewHeight / 2;
	// --- КОНЕЦ ИСПРАВЛЕНИЯ ---

	const strokeWidth = 1.5 / scale;
	const fontSize = 12 / scale;

	const xTicks = [];
	const yTicks = [];

	// --- Рисуем ось X и ее разметку ---
	const xStep = calculateNiceStep(maxX - minX, 10);
	for (let i = Math.ceil(minX / xStep) * xStep; i <= maxX; i += xStep) {
		if (Math.abs(i) < 1e-9 && xStep > 1e-9) continue;
		xTicks.push(
			<React.Fragment key={`x-tick-${i.toFixed(5)}`}>
				<Line points={[i, -5 / scale, i, 5 / scale]} stroke="#aaa" strokeWidth={strokeWidth} />
				<Text text={String(Math.round(i))} x={i} y={10 / scale} fontSize={fontSize} fill="gray" align="center" offsetX={fontSize/2} />
			</React.Fragment>
		);
	}

	// --- Рисуем ось Y и ее разметку ---
	const yStep = calculateNiceStep(maxY - minY, 8);
	for (let i = Math.ceil(minY / yStep) * yStep; i <= maxY; i += yStep) {
		if (Math.abs(i) < 1e-9 && yStep > 1e-9) continue;
		yTicks.push(
			<React.Fragment key={`y-tick-${i.toFixed(5)}`}>
				<Line points={[-5 / scale, i, 5 / scale, i]} stroke="#aaa" strokeWidth={strokeWidth} />
				<Text text={String(Math.round(i))} x={-10 / scale} y={i} fontSize={fontSize} fill="gray" align="right" verticalAlign="middle" />
			</React.Fragment>
		);
	}

	return (
		<>
			{/* Ось X со стрелкой */}
			<Line points={[minX, 0, maxX, 0]} stroke="#888" strokeWidth={strokeWidth} pointerAtEnd pointerLength={10 / scale} pointerWidth={8 / scale} />
			<Text text="X" x={maxX - 15 / scale} y={-15 / scale} fontSize={fontSize} fill="black" />

			{/* Ось Y со стрелкой */}
			<Line points={[0, minY, 0, maxY]} stroke="#888" strokeWidth={strokeWidth} pointerAtEnd pointerLength={10 / scale} pointerWidth={8 / scale} />
			<Text text="Y" x={15 / scale} y={minY + 15 / scale} fontSize={fontSize} fill="black" />

			{xTicks}
			{yTicks}
		</>
	);
};
