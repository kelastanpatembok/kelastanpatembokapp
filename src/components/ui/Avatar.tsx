import React from 'react';
import { View, Image, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const sizeStyles = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <View
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-full bg-muted',
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          className="h-full w-full"
          resizeMode="cover"
        />
      ) : (
        <Text
          className={cn(
            'font-medium text-muted-foreground',
            textSizeStyles[size]
          )}
        >
          {fallback || 'U'}
        </Text>
      )}
    </View>
  );
}

export function AvatarFallback({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={className}>{children}</View>;
}

