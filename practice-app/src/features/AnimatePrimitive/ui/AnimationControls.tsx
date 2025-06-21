import { Button, HStack } from '@chakra-ui/react';

interface AnimationControlsProps {
  isAnimating: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}

export const AnimationControls = ({ isAnimating, onStart, onStop, disabled }: AnimationControlsProps) => {
  return (
    <HStack>
      <Button onClick={onStart} isDisabled={isAnimating || disabled} colorScheme="green">Старт</Button>
      <Button onClick={onStop} isDisabled={!isAnimating || disabled} colorScheme="red">Стоп</Button>
    </HStack>
  );
};
