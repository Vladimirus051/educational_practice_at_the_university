import { useState, useRef, useEffect, useMemo } from 'react';
import Konva from 'konva';
import {
  Box, Button, Container, Divider, Grid, GridItem,
  Heading, Text, VStack, Switch, FormControl, FormLabel, Flex
} from '@chakra-ui/react';
import { CurveParams, Point, Bounds, AnimationParams } from '@/shared/types';
import { useCurvePoints } from '@/entities/Curve';
import { usePrimitiveAnimation, AnimationParamsForm } from '@/features/AnimatePrimitive';
import { GraphParamsForm } from '@/features/UpdateGraphParams';
import { GraphViewer } from '@/widgets/GraphViewer';
import { Primitive } from '@/entities/Primitive';
import { useElementSize } from '@/shared/lib/hooks/use-element-size';

const INITIAL_PARAMS: CurveParams = { a: 20, k: 2, steps: 1000 };
const INITIAL_ANIMATION_PARAMS: AnimationParams = { speed: 1.0, loops: 1 };
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
  const [animationParams, setAnimationParams] = useState(INITIAL_ANIMATION_PARAMS);
  const [manualZoom, setManualZoom] = useState(1);
  const [primitivePos, setPrimitivePos] = useState<Point | null>(null);
  const [coordinateSystem, setCoordinateSystem] = useState<'cartesian' | 'polar'>('cartesian');
  const [isGraphVisible, setIsGraphVisible] = useState(false);

  const layerRef = useRef<Konva.Layer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const curvePoints = useCurvePoints(params);
  const canvasSize = useElementSize(containerRef);

  const displayPoints = isGraphVisible ? curvePoints : [];

  const { autoScale, bounds } = useMemo(() => {
    if (!canvasSize.width || !canvasSize.height || displayPoints.length === 0) {
      return { autoScale: 1, bounds: null };
    }
    const b = getBounds(displayPoints);
    if (!b || b.width === 0 || b.height === 0) {
      return { autoScale: 1, bounds: b };
    }
    const sX = canvasSize.width / b.width;
    const sY = canvasSize.height / b.height;
    return {
      autoScale: Math.min(MAX_AUTO_SCALE, Math.min(sX, sY) * 0.9),
      bounds: b
    };
  }, [displayPoints, canvasSize]);

  const finalScale = autoScale * manualZoom;
  const primitiveScreenSz = Math.max(3, BASE_PRIMITIVE_SIZE / finalScale);

  const { isAnimating, isCompleted, startAnimation, stopAnimation, resetAnimation }
      = usePrimitiveAnimation(displayPoints, setPrimitivePos, layerRef, animationParams);

  const handleDrawGraph = () => {
    setIsGraphVisible(true);
    if (curvePoints.length > 0) {
      setPrimitivePos(curvePoints[0]);
    }
  };

  const handleClearGraph = () => {
    setIsGraphVisible(false);
    setPrimitivePos(null);
    stopAnimation();
  };

  useEffect(() => {
    resetAnimation();
  }, [params, resetAnimation]);

  return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.xl" py={8}>
          <Heading mb={6}>Улитка Паскаля – вариант 23</Heading>
          <Grid templateColumns={{ base:'1fr', lg:'380px 1fr' }} gap={8}>

            <GridItem>
              <Box bg="white" p={6} shadow="lg" borderRadius="lg">
                <FormControl as={Flex} alignItems="center" mb={4}>
                  <FormLabel htmlFor="coord-switch" mb="0" fontWeight="bold">
                    Система координат:
                  </FormLabel>
                  <Switch
                      id="coord-switch"
                      isChecked={coordinateSystem === 'polar'}
                      onChange={(e) => setCoordinateSystem(e.target.checked ? 'polar' : 'cartesian')}
                      colorScheme="blue"
                  />
                  <Text ml={3}>{coordinateSystem === 'polar' ? 'Полярная' : 'Декартова'}</Text>
                </FormControl>

                <Divider mb={4}/>
                <VStack spacing={3} mb={4}>
                  <Button
                      onClick={handleDrawGraph}
                      isDisabled={isGraphVisible}
                      colorScheme="green"
                      w="full"
                      leftIcon={<>📊</>}
                  >
                    {isGraphVisible ? 'График отрисован' : 'Отрисовать график'}
                  </Button>
                  <Button
                      onClick={handleClearGraph}
                      isDisabled={!isGraphVisible}
                      colorScheme="orange"
                      w="full"
                      leftIcon={<>🧹</>}
                  >
                    Очистить график
                  </Button>
                </VStack>

                <Divider mb={4}/>
                <GraphParamsForm
                    initialParams={params}
                    onParamsChange={setParams}
                    manualZoom={manualZoom}
                    onZoomChange={setManualZoom}
                />

                <Divider my={6} />
                <Text fontWeight="bold" mb={3}>Параметры анимации</Text>
                <AnimationParamsForm
                    params={animationParams}
                    onParamsChange={setAnimationParams}
                    disabled={isAnimating}
                />

                <Divider my={6} />
                <VStack spacing={3}>
                  <Button
                      onClick={startAnimation}
                      isDisabled={isAnimating || !isGraphVisible}
                      colorScheme="blue"
                      w="full"
                  >
                    {isAnimating ? 'Анимация запущена...' : 'Старт анимации'}
                  </Button>
                  <Button
                      onClick={stopAnimation}
                      isDisabled={!isAnimating || !isGraphVisible}
                      colorScheme="red"
                      w="full"
                  >
                    Стоп анимации
                  </Button>
                  <Button
                      onClick={resetAnimation}
                      isDisabled={isAnimating || !isGraphVisible}
                      colorScheme="gray"
                      w="full"
                      size="sm"
                  >
                    Сбросить анимацию
                  </Button>
                  {isCompleted && (
                      <Text fontSize="sm" color="green.600" textAlign="center">
                        ✅ Анимация завершена ({animationParams.loops} {animationParams.loops === 1 ? 'цикл' : 'циклов'})
                      </Text>
                  )}
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
                          curvePoints={displayPoints}
                          coordinateSystem={coordinateSystem}
                          offsetX={coordinateSystem === 'cartesian' && bounds ? bounds.minX + bounds.width  / 2 : 0}
                          offsetY={coordinateSystem === 'cartesian' && bounds ? bounds.minY + bounds.height / 2 : 0}
                          draggable
                      >
                        {primitivePos && <Primitive position={primitivePos} size={primitiveScreenSz} />}
                      </GraphViewer>
                  )}
                </Box>

                {isGraphVisible && (
                    <Text mt={4} fontSize="sm" color="gray.600">
                      r = a·(k + cos t), a={params.a}, k={params.k}
                    </Text>
                )}

                {!isGraphVisible && (
                    <Text mt={4} fontSize="md" color="gray.500" textAlign="center">
                      Нажмите "Отрисовать график" для отображения кривой
                    </Text>
                )}
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>
  );
};
