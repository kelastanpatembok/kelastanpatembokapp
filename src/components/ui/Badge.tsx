import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-muted text-muted-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-border text-foreground',
  };

  return (
    <View
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5',
        variantStyles[variant],
        className
      )}
    >
      <Text className="text-xs font-medium">{children}</Text>
    </View>
  );
}

