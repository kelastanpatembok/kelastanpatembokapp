import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: any;
}

export function Skeleton({ className, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      className={cn('rounded-md bg-muted', className)}
      style={[{ opacity }, style]}
    />
  );
}

