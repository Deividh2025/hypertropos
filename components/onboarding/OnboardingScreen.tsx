import React from 'react';
import { View, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft } from 'phosphor-react-native';
import { Container } from '../ui/Container';
import { Texto } from '../ui/Texto';
import { Botao } from '../ui/Botao';
import { ProgressBar } from './ProgressBar';

interface OnboardingScreenProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  currentStep: number;
  totalSteps: number;
  showNextButton?: boolean;
}

export function OnboardingScreen({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel = 'Avançar',
  currentStep,
  totalSteps,
  showNextButton = true,
}: OnboardingScreenProps) {
  const router = useRouter();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNext();
  };

  return (
    <Container className="flex-1 bg-canvas pt-top">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      <View className="px-6 pt-4 pb-2 z-10 flex-row items-center min-h-[44px]">
        {onBack !== undefined ? (
          <Pressable 
            onPress={handleBack} 
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            className="w-10 h-10 -ml-2 items-center justify-center rounded-full active:bg-highlight"
          >
            <ArrowLeft size={24} color="#5C5247" />
          </Pressable>
        ) : (
          <View className="w-10 h-10 -ml-2" />
        )}
      </View>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="mt-2 mb-8">
          <Texto variant="h1" className="mb-3">{title}</Texto>
          {subtitle && (
            <Texto variant="bodyL" color="secondary">{subtitle}</Texto>
          )}
        </View>

        <View className="flex-1">
          {children}
        </View>
      </ScrollView>

      {showNextButton && (
        <View 
          className="px-6 pb-bottom bg-canvas"
          style={{
            paddingBottom: Platform.OS === 'ios' ? 34 : 24,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: 'var(--color-divider)'
          }}
        >
          <Botao 
            variant="primary" 
            size="lg" 
            onPress={handleNext} 
            disabled={nextDisabled}
            className="w-full shadow-sm"
          >
            {nextLabel}
          </Botao>
        </View>
      )}
    </Container>
  );
}
