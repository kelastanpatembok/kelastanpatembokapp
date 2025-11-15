import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';

export default function CoursesScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Card>
          <CardContent className="py-12">
            <Text className="text-center text-lg font-semibold text-foreground">
              Courses
            </Text>
            <Text className="text-center text-muted-foreground mt-2">
              Courses feature coming soon...
            </Text>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}

