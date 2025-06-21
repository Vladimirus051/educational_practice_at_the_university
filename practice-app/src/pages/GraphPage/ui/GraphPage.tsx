import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Konva from 'konva';
import {
  Box, Button, Container, Divider, Grid, GridItem,
  Heading, Text, VStack
} from '@chakra-ui/react';

import { CurveParams, Point, Bounds } from '@/shared/types';
import { useCurvePoints } from '@/entities/Curve';
import { usePrimitiveAnimation } from '@/features/AnimatePrimitive';
import { GraphParamsForm } from '@/features/UpdateGraphParams';
import { GraphViewer } from '@/widgets/GraphViewer';
import { Primitive } from '@/entities/Primitive';
import { useElementSize } from '@/shared/lib/hooks/use-element-size';

const INITIAL_PARAMS: CurveParams = { a: 20, k: 2, steps: 1000, turnsCount: 10 };
const MAX_AUTO_SCALE = 100;
const BASE_PRIMITIVE_SIZE = 15;

const getBounds = (pts: Point[]): Bounds | null => {
  if (!pts.length) return null;
  let minX = pts[0].x, maxX = pts[0].x,
      minY = pts[0].y, maxY = pts[0].y;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
};

export const GraphPage = () => {
  const [params, setParams] = useState(INITIAL_PARAMS);
  const [manualZoom, setManualZoom] = useState(1);
  const [primitivePos, setPrimitivePos] = useState<Point | null>(null);

  const layerRef = useRef<Konva.Layer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const curvePoints = useCurvePoints(params);
  const canvasSize = useElementSize(containerRef);

  const { autoScale, bounds } = useMemo(() => {
    if (!canvasSize.width || !canvasSize.height || curvePoints.length === 0) {
      return { autoScale: 1, bounds: null };
    }
    const b = getBounds(curvePoints);
    if (!b || b.width === 0 || b.height === 0) {
      return { autoScale: 1, bounds: b };
    }
    const sX = canvasSize.width / b.width;
    const sY = canvasSize.height / b.height;
    return {
      autoScale: Math.min(MAX_AUTO_SCALE, Math.min(sX, sY) * 0.9),
      bounds: b
    };
  }, [curvePoints, canvasSize]);

  const finalScale = autoScale * manualZoom;
  const primitiveScreenSz = Math.max(3, BASE_PRIMITIVE_SIZE / finalScale);

  // ИСПРАВЛЕНИЕ: Передаем `layerRef` напрямую в хук
  const { isAnimating, startAnimation, stopAnimation }
      = usePrimitiveAnimation(curvePoints, setPrimitivePos, layerRef);

  useEffect(() => {
    stopAnimation();
    if (curvePoints.length > 0) {
      setPrimitivePos(curvePoints[0]);
    }
  }, [params, stopAnimation]);

  // ИСПРАВЛЕНИЕ: Этот useEffect больше не нужен, его можно удалить.
  // useEffect(() => {
  //   if (layerRef.current) {
  //     setLayer(layerRef.current);
  //   }
  // }, [setLayer]);

  return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Heading mb={6}>Улитка Паскаля – вариант 23</Heading>
          <Grid templateColumns={{ base:'1fr', lg:'380px 1fr' }} gap={8}>
            <GridItem>
              <Box bg="white" p={6} shadow="lg" borderRadius="lg">
                <GraphParamsForm
                    initialParams={params}
                    onParamsChange={setParams}
                    manualZoom={manualZoom}
                    onZoomChange={setManualZoom}
                />
                <Divider my={6} />
                <VStack spacing={3}>
                  <Button onClick={startAnimation} isDisabled={isAnimating} colorScheme="blue" w="full">
                    {isAnimating ? 'Анимация…' : 'Старт'}
                  </Button>
                  <Button onClick={stopAnimation} isDisabled={!isAnimating} colorScheme="red" w="full">
                    Стоп
                  </Button>
                </VStack>
              </Box>
            </GridItem>
            <GridItem minW={0}>
              <Box bg="white" p={6} shadow="lg" borderRadius="lg">
                <Box
                    ref={containerRef}
                    h="650px" w="100%"
                    border="1px solid" borderColor="gray.200"
                    borderRadius="md" overflow="hidden"
                >
                  {canvasSize.width > 0 && (
                      <GraphViewer
                          ref={layerRef}
                          width={canvasSize.width}
                          height={canvasSize.height}
                          scale={finalScale}
                          curvePoints={curvePoints}
                          offsetX={bounds ? bounds.minX + bounds.width  / 2 : 0}
                          offsetY={bounds ? bounds.minY + bounds.height / 2 : 0}
                          draggable
                      >
                        {primitivePos && <Primitive position={primitivePos} size={primitiveScreenSz} />}
                      </GraphViewer>
                  )}
                </Box>
                <Text mt={4} fontSize="sm" color="gray.600">
                  r = a·(k + cos t), a={params.a}, k={params.k}
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>
  );
};
