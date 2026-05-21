import React from 'react';
import { Pressable, ActivityIndicator, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Texto } from './Texto';
import { SCULPTED_EASING } from '../../constants/easing';

interface BotaoProps extends Omit<PressableProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Botao({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  children,
  className = '',
  style,
  ...props
}: BotaoProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = (e: any) => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0.97, { duration: 100, easing: SCULPTED_EASING });
    if (props.onPressIn) props.onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    if (disabled || loading) return;
    scale.value = withTiming(1, { duration: 150, easing: SCULPTED_EASING });
    if (props.onPressOut) props.onPressOut(e);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return 'bg-accent-bronze';
      case 'secondary': return 'bg-transparent border border-border-strong';
      case 'ghost': return 'bg-transparent';
      case 'destructive': return 'bg-feedback-error';
      default: return 'bg-accent-bronze';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'py-2 px-3 rounded-sm';
      case 'md': return 'py-3 px-4 rounded-sm';
      case 'lg': return 'py-4 px-6 rounded-md min-h-[56px]';
      default: return 'py-3 px-4 rounded-sm';
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return 'inverse';
      case 'secondary': return 'primary';
      case 'ghost': return 'primary';
      case 'destructive': return 'inverse';
      default: return 'inverse';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${getVariantClasses()} ${getSizeClasses()} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      style={[animatedStyle, style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? '#F2EAE0' : '#1A1715'} />
      ) : (
        typeof children === 'string' ? (
          <Texto variant={size === 'sm' ? 'body' : 'bodyBold'} color={getTextColor()}>
            {children}
          </Texto>
        ) : (
          children
        )
      )}
    </AnimatedPressable>
  );
}
