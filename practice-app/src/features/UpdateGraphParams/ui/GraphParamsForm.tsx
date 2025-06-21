import React, { useState, useEffect } from 'react';
import { CurveParams } from '@/shared/types';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    Heading,
    Input,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
    VStack,
    Divider,
    Flex
} from '@chakra-ui/react';

interface GraphParamsFormProps {
    initialParams: CurveParams;
    onParamsChange: (params: CurveParams) => void;
    // НОВОЕ: Пропсы для управления масштабом
    manualZoom: number;
    onZoomChange: (zoom: number) => void;
}

export const GraphParamsForm = ({ initialParams, onParamsChange, manualZoom, onZoomChange }: GraphParamsFormProps) => {
    const [params, setParams] = useState<CurveParams>(initialParams);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onParamsChange(params);
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [params, onParamsChange]);

    useEffect(() => {
        setParams(initialParams);
    }, [initialParams]);

    const updateParam = <K extends keyof CurveParams>(
        key: K,
        value: CurveParams[K]
    ) => {
        setParams(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetToDefaults = () => {
        // ИСПРАВЛЕНИЕ: Значения по умолчанию теперь согласованы с INITIAL_PARAMS
        const defaultParams: CurveParams = {
            a: 20,
            k: 2,
            steps: 1000,
            turnsCount: 10
        };
        setParams(defaultParams);
        onZoomChange(1); // Также сбрасываем ручной зум
    };


    return (
        <VStack spacing={6} align="stretch">
            {/* НОВОЕ: Слайдер для ручного масштабирования */}
            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                    Масштаб (зум): {manualZoom.toFixed(2)}x
                </FormLabel>
                <Slider
                    min={0.5}
                    max={5}
                    step={0.1}
                    value={manualZoom}
                    onChange={onZoomChange}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
                <Flex justify="space-between">
                    <Text fontSize="xs" color="gray.500">0.5x</Text>
                    <Text fontSize="xs" color="gray.500">5.0x</Text>
                </Flex>
            </FormControl>

            <Divider />

            {/* Параметр a */}
            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                    Параметр 'a' (радиус): {params.a}
                </FormLabel>
                <Slider min={20} max={200} step={5} value={params.a} onChange={(val) => updateParam('a', val)} >
                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                    <SliderThumb />
                </Slider>
            </FormControl>

            {/* Параметр k */}
            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                    Параметр 'k' (форма): {params.k}
                </FormLabel>
                <Slider min={0.1} max={5} step={0.1} value={params.k} onChange={(val) => updateParam('k', val)} >
                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                    <SliderThumb />
                </Slider>
            </FormControl>

            {/* Количество шагов */}
            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                    Количество точек: {params.steps}
                </FormLabel>
                <Slider min={100} max={2000} step={100} value={params.steps} onChange={(val) => updateParam('steps', val)} >
                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                    <SliderThumb />
                </Slider>
            </FormControl>

            {/* Количество оборотов */}
            <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                    Количество оборотов: {params.turnsCount}
                </FormLabel>
                <Slider min={1} max={20} step={1} value={params.turnsCount} onChange={(val) => updateParam('turnsCount', val)} >
                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                    <SliderThumb />
                </Slider>
            </FormControl>

            {/* Точный ввод значений и остальная часть формы... */}
            {/* ... (остальной код формы без изменений) ... */}
            <Box pt={4}>
                <Divider />
                <Button onClick={resetToDefaults} w="full" mt={4} variant="outline">
                    Сбросить к значениям по умолчанию
                </Button>
            </Box>

            <Box pt={4}>
                <Divider />
                <Heading as="h4" size="sm" fontWeight="medium" my={2}>
                    О кривой Подера
                </Heading>
                <VStack align="start" fontSize="xs" color="gray.600" spacing={1}>
                    <Text>• r = a(k + cos(t))</Text>
                    <Text>• При k = 1: кардиоида</Text>
                    <Text>• При k &lt; 1: кривая с петлей</Text>
                    <Text>• При k &gt; 1: выпуклая кривая</Text>
                </VStack>
            </Box>
        </VStack>
    );
};
