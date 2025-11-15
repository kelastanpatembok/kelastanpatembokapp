import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function CoursesScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Text className="text-2xl font-semibold text-foreground">
          Courses
        </Text>
        <Text className="mt-2 text-muted-foreground">
          Browse all available courses
        </Text>
      </View>
    </ScrollView>
  );
}

