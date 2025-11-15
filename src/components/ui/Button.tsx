import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  style,
  textStyle,
}: ButtonProps) {
  const baseStyles = 'items-center justify-center rounded-lg';
  
  const variantStyles = {
    default: 'bg-primary',
    outline: 'border border-border bg-transparent',
    ghost: 'bg-transparent',
    destructive: 'bg-destructive',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const textVariantStyles = {
    default: 'text-primary-foreground',
    outline: 'text-foreground',
    ghost: 'text-foreground',
    destructive: 'text-destructive-foreground',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
      style={style}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'default' ? '#ffffff' : '#0a0a0a'}
        />
      ) : (
        <Text
          className={cn('font-medium', textSizeStyles[size], textVariantStyles[variant])}
          style={textStyle}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

