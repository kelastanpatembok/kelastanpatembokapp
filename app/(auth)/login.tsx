import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuth } from '@/components/auth/AuthProvider';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithCredentials, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginWithCredentials(username, password);
      if (result.ok) {
        router.replace('/(tabs)');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await loginWithGoogle();
      if (result.ok) {
        // Wait a moment for Firebase auth state to update
        // The onAuthStateChanged listener will update the user state
        // Then the index.tsx will handle navigation automatically
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      } else {
        setError(result.error || 'Google login failed');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-4"
        keyboardShouldPersistTaps="handled"
      >
        <Card className="w-full">
          <CardHeader>
            <Text className="text-2xl font-bold text-center text-foreground">
              Kelas Tanpa Tembok
            </Text>
            <Text className="mt-2 text-center text-muted-foreground">
              Sign in to continue
            </Text>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <View className="rounded-lg bg-destructive/10 p-3">
                <Text className="text-sm text-destructive">{error}</Text>
              </View>
            )}

            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />

            <Button
              onPress={handleLogin}
              loading={loading}
              className="w-full mt-4"
            >
              Sign In
            </Button>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-border" />
              <Text className="px-4 text-sm text-muted-foreground">OR</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            <Button
              onPress={handleGoogleLogin}
              variant="outline"
              loading={loading}
              className="w-full"
            >
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

