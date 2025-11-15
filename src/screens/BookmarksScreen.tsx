import React from 'react';
import { View, Text } from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';

export default function BookmarksScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Card>
          <CardContent className="py-12">
            <Text className="text-center text-lg font-semibold text-foreground">
              Bookmarks
            </Text>
            <Text className="text-center text-muted-foreground mt-2">
              Bookmarks feature coming soon...
            </Text>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}

