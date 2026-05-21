import React, { useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  runOnJS,
  withSpring
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Texto } from '../ui/Texto';

interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function SliderInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = ''
}: SliderInputProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const THUMB_SIZE = 32;

  // Calculate initial position based on value
  const getInitialPosition = () => {
    if (trackWidth === 0) return 0;
    const ratio = (value - min) / (max - min);
    return ratio * (trackWidth - THUMB_SIZE);
  };

  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // When track layout changes, initialize the thumb position
  const onTrackLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setTrackWidth(width);
    const ratio = (value - min) / (max - min);
    translateX.value = ratio * (width - THUMB_SIZE);
  };

  // Keep internal value updated with gestures
  const [displayValue, setDisplayValue] = useState(value);

  const updateValueAndHaptic = (newVal: number) => {
    if (newVal !== displayValue) {
      setDisplayValue(newVal);
      // Light haptic only when crossing a step threshold
      if (newVal % step === 0 || step === 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onChange((event) => {
      const maxX = trackWidth - THUMB_SIZE;
      const minX = 0;
      
      let newX = translateX.value + event.changeX;
      newX = Math.max(minX, Math.min(newX, maxX));
      
      translateX.value = newX;

      // Calculate current value
      const ratio = newX / maxX;
      const rawValue = min + ratio * (max - min);
      
      // Snap to step
      const snappedValue = Math.round(rawValue / step) * step;
      const finalValue = Math.max(min, Math.min(snappedValue, max));
      
      runOnJS(updateValueAndHaptic)(finalValue);
    })
    .onFinalize(() => {
      isDragging.value = false;
      
      // Ensure we snap visually to the final value step position
      const maxX = trackWidth - THUMB_SIZE;
      const ratio = (displayValue - min) / (max - min);
      const snapX = ratio * maxX;
      
      translateX.value = withSpring(snapX, { damping: 20, stiffness: 200 });
      runOnJS(onChange)(displayValue);
    });

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: isDragging.value ? 1.1 : 1 }
    ],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE / 2,
  }));

  return (
    <View className="items-center py-8">
      <View className="flex-row items-baseline mb-12">
        <Texto variant="numericHero" className="text-accent-bronze">
          {displayValue}
        </Texto>
        {unit && (
          <Texto variant="h2" color="secondary" className="ml-2">
            {unit}
          </Texto>
        )}
      </View>

      <View className="w-full px-2 py-4">
        <View 
          className="h-[6px] w-full bg-highlight rounded-full relative justify-center"
          onLayout={onTrackLayout}
        >
          {/* Active track part */}
          <Animated.View 
            className="absolute left-0 h-full bg-accent-bronze rounded-full"
            style={progressAnimatedStyle}
          />

          {/* Thumb */}
          <GestureDetector gesture={panGesture}>
            <Animated.View 
              className="absolute w-8 h-8 rounded-full bg-elevated shadow-card items-center justify-center border-2 border-accent-bronze"
              style={[
                { left: 0 },
                thumbAnimatedStyle
              ]}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <View className="w-3 h-3 rounded-full bg-accent-bronze" />
            </Animated.View>
          </GestureDetector>
        </View>
        
        <View className="flex-row justify-between mt-4">
          <Texto variant="caption" color="muted">{min}</Texto>
          <Texto variant="caption" color="muted">{max}</Texto>
        </View>
      </View>
    </View>
  );
}
