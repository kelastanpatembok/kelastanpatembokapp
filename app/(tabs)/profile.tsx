import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/components/auth/AuthProvider';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (!user) {
    router.replace('/(auth)/login');
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6 space-y-6">
        <Card>
          <CardContent className="items-center py-6">
            <Avatar
              src={user.avatarUrl}
              fallback={user.name.substring(0, 2).toUpperCase()}
              size="lg"
              className="mb-4"
            />
            <Text className="text-xl font-semibold text-foreground">
              {user.name}
            </Text>
            <Text className="text-sm text-muted-foreground mt-1">
              {user.role}
            </Text>
            {user.email && (
              <Text className="text-sm text-muted-foreground mt-1">
                {user.email}
              </Text>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <Button
              onPress={handleLogout}
              variant="destructive"
              className="w-full"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}

