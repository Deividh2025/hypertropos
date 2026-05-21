import React from 'react';
import { View, PressableProps } from 'react-native';
import { Card } from '../ui/Card';
import { Texto } from '../ui/Texto';

interface SelectableCardProps extends Omit<PressableProps, 'style' | 'onPress'> {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function SelectableCard({
  title,
  description,
  selected,
  onPress,
  icon,
  className = '',
  ...props
}: SelectableCardProps) {
  // We use Card internally, modifying its styling based on 'selected'
  
  return (
    <Card
      onPress={onPress}
      padding="lg"
      className={`mb-4 border-[2px] ${
        selected 
          ? 'border-accent-bronze bg-elevated' 
          : 'border-border-subtle bg-canvas opacity-80'
      } ${className}`}
      {...props}
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <Texto 
            variant="h3" 
            color={selected ? 'primary' : 'secondary'}
            className="mb-1"
          >
            {title}
          </Texto>
          
          {description && (
            <Texto 
              variant="body" 
              color={selected ? 'secondary' : 'muted'}
            >
              {description}
            </Texto>
          )}
        </View>
        
        {icon && (
          <View className="ml-4 opacity-80">
            {icon}
          </View>
        )}
      </View>
    </Card>
  );
}
