import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  style?: any;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, className, style }: SkeletonProps) {
  const { tokens } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startShimmer();
  }, [animatedValue]);

  return (
    <Animated.View
      className={className}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: 'rgba(232, 222, 209, 0.08)', // Sleek light bronze/stone color for premium dark mode
          opacity: animatedValue,
        },
        style,
      ]}
    />
  );
}

export function SkeletonKPIs() {
  return (
    <View className="flex-row gap-2.5 px-6 mb-4">
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className="flex-1 p-3.5 rounded-sm border border-border-subtle/30 bg-elevated/40 gap-2"
        >
          <Skeleton width={24} height={24} borderRadius={12} />
          <Skeleton width="40%" height={10} />
          <Skeleton width="80%" height={16} />
        </View>
      ))}
    </View>
  );
}

export function SkeletonSilhueta() {
  return (
    <View className="flex-1 p-6 gap-6">
      {/* Statue skeleton card */}
      <View className="w-full h-[400] rounded-md border border-border-subtle bg-elevated/20 p-6 items-center justify-center gap-6">
        <Skeleton width="40%" height={16} />
        <Skeleton width={180} height={260} borderRadius={90} />
        <Skeleton width="30%" height={24} />
      </View>
      {/* Details panel skeleton */}
      <View className="w-full p-5 rounded-md border border-border-subtle bg-elevated/20 gap-3">
        <View className="flex-row justify-between items-center">
          <Skeleton width="40%" height={18} />
          <Skeleton width="20%" height={14} />
        </View>
        <Skeleton width="100%" height={12} />
        <Skeleton width="90%" height={12} />
        <Skeleton width="100%" height={40} borderRadius={8} />
      </View>
    </View>
  );
}

export function SkeletonVolume() {
  return (
    <View className="flex-1 p-6 gap-5">
      <Skeleton width="100%" height={44} borderRadius={8} />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} className="flex-row items-center justify-between py-2 gap-4">
          <View className="flex-1 gap-2">
            <Skeleton width="50%" height={14} />
            <Skeleton width="100%" height={18} borderRadius={4} />
          </View>
          <Skeleton width={48} height={16} />
        </View>
      ))}
    </View>
  );
}

export function SkeletonConquistas() {
  return (
    <View className="flex-1 p-6 gap-4">
      <Skeleton width="60%" height={16} />
      <View className="flex-row flex-wrap justify-between gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <View
            key={i}
            className="w-[29%] h-[105] rounded-md bg-elevated/10 border border-border-subtle/30 p-3 items-center justify-center gap-3"
          >
            <Skeleton width={40} height={40} borderRadius={20} />
            <Skeleton width="80%" height={10} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function SkeletonLinhaTempo() {
  return (
    <View className="flex-1 p-6 gap-6">
      {[1, 2, 3].map((p) => (
        <View key={p} className="p-4 rounded-md border border-border-subtle bg-elevated/20 gap-3">
          <Skeleton width="40%" height={18} />
          <View className="pl-4 border-l border-dashed border-border-subtle/50 gap-4 mt-2">
            {[1, 2, 3].map((s) => (
              <View key={s} className="flex-row items-center gap-3">
                <Skeleton width={16} height={16} borderRadius={8} />
                <View className="flex-1 gap-1.5">
                  <Skeleton width="70%" height={14} />
                  <Skeleton width="30%" height={10} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

export function SkeletonHistorico() {
  return (
    <View className="flex-1 p-6 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          className="p-4 rounded-md border border-border-subtle bg-elevated/25 gap-3"
        >
          <View className="flex-row justify-between items-center">
            <Skeleton width="60%" height={16} />
            <Skeleton width="20%" height={12} />
          </View>
          <View className="flex-row gap-4">
            <Skeleton width="30%" height={12} />
            <Skeleton width="30%" height={12} />
            <Skeleton width="30%" height={12} />
          </View>
          <View className="flex-row justify-between items-center border-t border-border-subtle/20 pt-3">
            <Skeleton width="40%" height={14} />
            <Skeleton width="20%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}
