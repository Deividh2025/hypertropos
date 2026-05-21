import React from 'react';
import { View, Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SCULPTED_EASING } from '../../constants/easing';

interface CardProps extends Omit<PressableProps, 'style'> {
  padding?: 'sm' | 'md' | 'lg' | 'none';
  elevated?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

export function Card({
  padding = 'md',
  elevated = false,
  onPress,
  children,
  className = '',
  style,
  ...props
}: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    if (!onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0.99, { duration: 150, easing: SCULPTED_EASING });
    if (props.onPressIn) props.onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    if (!onPress) return;
    scale.value = withTiming(1, { duration: 150, easing: SCULPTED_EASING });
    if (props.onPressOut) props.onPressOut(e);
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none': return 'p-0';
      case 'sm': return 'p-3'; // space-3
      case 'md': return 'p-4'; // space-4
      case 'lg': return 'p-6'; // space-6
      default: return 'p-4';
    }
  };

  const bgClasses = elevated ? 'bg-elevated border border-transparent' : 'bg-canvas border border-border-subtle';
  const baseClasses = `rounded-md ${bgClasses} ${getPaddingClasses()} ${className}`;

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={baseClasses}
        style={[animatedStyle, style]}
        {...props}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedView className={baseClasses} style={[style]} {...(props as any)}>
      {children}
    </AnimatedView>
  );
}
