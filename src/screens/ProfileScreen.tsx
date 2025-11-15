import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6 space-y-6">
        <Card>
          <CardContent className="items-center py-6">
            <Avatar
              source={user?.avatarUrl ? { uri: user.avatarUrl } : undefined}
              fallback={user?.name?.[0] || 'U'}
              size="lg"
            />
            <Text className="mt-4 text-xl font-bold text-foreground">
              {user?.name || 'User'}
            </Text>
            {user?.email && (
              <Text className="mt-1 text-sm text-muted-foreground">
                {user.email}
              </Text>
            )}
            {user?.role && (
              <View className="mt-2 px-3 py-1 rounded-full bg-primary/10">
                <Text className="text-xs font-medium text-primary">
                  {user.role}
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        <Button
          onPress={logout}
          variant="outline"
          className="w-full"
        >
          Sign Out
        </Button>
      </View>
    </ScrollView>
  );
}

