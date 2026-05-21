import React, { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SCULPTED_EASING } from '../../constants/easing';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const { width } = useWindowDimensions();
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    const targetWidth = (currentStep / totalSteps) * width;
    progressWidth.value = withTiming(targetWidth, { duration: 400, easing: SCULPTED_EASING });
  }, [currentStep, totalSteps, width, progressWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  return (
    <View className="w-full h-[2px] bg-highlight relative">
      <Animated.View 
        className="absolute left-0 top-0 bottom-0 bg-accent-bronze" 
        style={animatedStyle} 
      />
    </View>
  );
}
