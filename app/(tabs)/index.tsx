import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { firebaseDb } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Platform } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/components/auth/AuthProvider';

export default function HomeScreen() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const loadPlatforms = async () => {
    try {
      const snap = await getDocs(
        query(
          collection(firebaseDb, 'platforms'),
          where('public', '==', true),
          orderBy('createdAt', 'desc')
        )
      );
      
      const platformsData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Platform[];
      setPlatforms(platformsData);
    } catch (error) {
      console.error('Error loading platforms:', error);
      // Fallback if ordering fails
      try {
        const snap = await getDocs(
          query(
            collection(firebaseDb, 'platforms'),
            where('public', '==', true)
          )
        );
        const platformsData = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Platform[];
        setPlatforms(platformsData);
      } catch (e) {
        console.error('Fallback query also failed:', e);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPlatforms();
  };

  if (loading) {
    return (
      <ScrollView className="flex-1 bg-background">
        <View className="px-4 py-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <View className="rounded-xl border border-border bg-gradient-to-br from-background to-muted p-6">
          <Text className="text-2xl font-bold text-center text-foreground">
            Belajar bersama lintas platform
          </Text>
          <Text className="mt-2 text-center text-muted-foreground">
            Jaringan sosial multi-platform yang fokus pada pembelajaran komunitas.
          </Text>
          <Button
            onPress={() => router.push('/(tabs)/platforms')}
            className="mt-4 w-full"
          >
            Jelajahi platform
          </Button>
        </View>

        {/* Platforms Grid */}
        {platforms.length > 0 ? (
          <View className="space-y-4">
            <Text className="text-xl font-semibold text-foreground">
              Platform Unggulan
            </Text>
            <View className="space-y-3">
              {platforms.map((platform) => (
                <Card
                  key={platform.id}
                  className="active:opacity-70"
                  onTouchEnd={() =>
                    router.push(`/platforms/${platform.slug}`)
                  }
                >
                  <CardContent>
                    <View className="flex-row items-center gap-3">
                      {platform.branding?.logoUrl && (
                        <View
                          className="h-10 w-10 rounded bg-muted overflow-hidden"
                          style={{
                            borderColor: platform.branding.primaryColor,
                            borderWidth: 2,
                          }}
                        >
                          {/* Image component would go here */}
                        </View>
                      )}
                      <View className="flex-1">
                        <Text
                          className="font-medium text-foreground"
                          style={{
                            color: platform.branding?.primaryColor,
                          }}
                        >
                          {platform.name}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          /{platform.slug}
                        </Text>
                      </View>
                    </View>
                    {platform.description && (
                      <Text className="mt-2 text-sm text-muted-foreground">
                        {platform.description}
                      </Text>
                    )}
                  </CardContent>
                </Card>
              ))}
            </View>
          </View>
        ) : (
          <Card>
            <CardContent className="py-12">
              <Text className="text-center text-lg font-semibold text-foreground mb-2">
                Belum ada platform
              </Text>
              <Text className="text-center text-muted-foreground mb-4">
                Mulai dengan membuat platform pertama Anda.
              </Text>
              {user?.role === 'owner' && (
                <Button
                  onPress={() => router.push('/platforms/create')}
                  className="w-full"
                >
                  Buat Platform
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

