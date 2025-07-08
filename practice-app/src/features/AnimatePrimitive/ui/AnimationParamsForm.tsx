import {
	FormLabel,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Text,
	Flex,
	VStack, FormControl
} from '@chakra-ui/react';
import { AnimationParams } from '@/shared/types';

interface AnimationParamsFormProps {
	params: AnimationParams;
	onParamsChange: (params: AnimationParams) => void;
	disabled?: boolean;
}

export const AnimationParamsForm = ({
	                                    params,
	                                    onParamsChange,
	                                    disabled = false
                                    }: AnimationParamsFormProps) => {
	const updateParam = <K extends keyof AnimationParams>(
		key: K,
		value: AnimationParams[K]
	) => {
		onParamsChange({
			...params,
			[key]: value
		});
	};

	return (
		<VStack spacing={4} align="stretch">
			<FormControl>
				<FormLabel fontSize="sm" fontWeight="medium">
					Скорость анимации: {params.speed}x
				</FormLabel>
				<Slider
					min={0.1}
					max={5.0}
					step={0.1}
					value={params.speed}
					onChange={(val) => updateParam('speed', val)}
					isDisabled={disabled}
				>
					<SliderTrack>
						<SliderFilledTrack />
					</SliderTrack>
					<SliderThumb />
				</Slider>
				<Flex justify="space-between">
					<Text fontSize="xs" color="gray.500">0.1x (медленно)</Text>
					<Text fontSize="xs" color="gray.500">5.0x (быстро)</Text>
				</Flex>
			</FormControl>

			<FormControl>
				<FormLabel fontSize="sm" fontWeight="medium">
					Количество циклов: {params.loops}
				</FormLabel>
				<Slider
					min={1}
					max={20}
					step={1}
					value={params.loops}
					onChange={(val) => updateParam('loops', val)}
					isDisabled={disabled}
				>
					<SliderTrack>
						<SliderFilledTrack />
					</SliderTrack>
					<SliderThumb />
				</Slider>
				<Flex justify="space-between">
					<Text fontSize="xs" color="gray.500">1 цикл</Text>
					<Text fontSize="xs" color="gray.500">20 циклов</Text>
				</Flex>
				<Text fontSize="xs" color="gray.600" mt={1}>
					Один цикл = полное прохождение по всей кривой
				</Text>
			</FormControl>
		</VStack>
	);
};
