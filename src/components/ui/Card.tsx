import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  onTouchEnd?: () => void;
}

export function Card({ children, className, style, onTouchEnd }: CardProps) {
  const Component = onTouchEnd ? TouchableOpacity : View;
  
  return (
    <Component
      className={cn('rounded-lg border border-border bg-card p-4', className)}
      style={style}
      onPress={onTouchEnd}
      activeOpacity={onTouchEnd ? 0.7 : 1}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className, style }: CardProps) {
  return (
    <View className={cn('mb-4', className)} style={style}>
      {children}
    </View>
  );
}

export function CardContent({ children, className, style }: CardProps) {
  return (
    <View className={className} style={style}>
      {children}
    </View>
  );
}

