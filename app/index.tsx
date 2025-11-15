import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Index() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#66b132" />
      </View>
    );
  }

  return null;
}

