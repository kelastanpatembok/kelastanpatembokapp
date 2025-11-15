import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebaseDb } from '@/lib/firebase';
import { Platform } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/components/auth/AuthProvider';

export default function PlatformsScreen() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  const loadPlatforms = async () => {
    try {
      const snap = await firebaseDb
        .collection('platforms')
        .where('public', '==', true)
        .get();
      
      const platformsData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Platform[];
      setPlatforms(platformsData);
    } catch (error) {
      console.error('Error loading platforms:', error);
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
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
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
      <View className="px-4 py-6 space-y-4">
        <Text className="text-2xl font-semibold text-foreground">
          Platform Browser
        </Text>

        {platforms.length > 0 ? (
          <View className="space-y-3">
            {platforms.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                onPress={() =>
                  navigation.navigate('PlatformDetail' as never, { slug: platform.slug } as never)
                }
              >
                <Card className="active:opacity-70">
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
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Card>
            <CardContent className="py-12">
              <Text className="text-center text-lg font-semibold text-foreground">
                No platforms found
              </Text>
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

