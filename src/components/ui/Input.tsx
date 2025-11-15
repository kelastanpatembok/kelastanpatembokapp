import React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <Text className="mb-2 text-sm font-medium text-foreground">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'h-10 rounded-lg border border-border bg-background px-3 text-foreground',
          error && 'border-destructive',
          className
        )}
        placeholderTextColor="#71717a"
        {...props}
      />
      {error && (
        <Text className="mt-1 text-sm text-destructive">{error}</Text>
      )}
    </View>
  );
}

