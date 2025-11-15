import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { firebaseDb } from '@/lib/firebase';
import { Platform, Community } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { CommunityCard } from '@/components/community/CommunityCard';

type RouteParams = {
  slug: string;
};

function CommunitiesList({ platformId, platformSlug }: { platformId: string; platformSlug: string }) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const snap = await firebaseDb
          .collection('platforms')
          .doc(platformId)
          .collection('communities')
          .get();
        
        const communitiesData = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Community[];
        setCommunities(communitiesData);
      } catch (error) {
        console.error('Error loading communities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, [platformId]);

  if (loading) {
    return (
      <View className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </View>
    );
  }

  if (communities.length === 0) {
    return (
      <Text className="text-sm text-muted-foreground">No communities yet</Text>
    );
  }

  return (
    <View className="space-y-3">
      {communities.map((community) => (
        <TouchableOpacity
          key={community.id}
          onPress={() =>
            navigation.navigate('CommunityDetail' as never, {
              slug: platformSlug,
              id: community.id,
            } as never)
          }
        >
          <CommunityCard
            community={community}
            onPress={() => {}}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function PlatformDetailScreen() {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { slug } = route.params || {};
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadPlatform = async () => {
      try {
        const snap = await firebaseDb
          .collection('platforms')
          .where('slug', '==', slug)
          .limit(1)
          .get();

        if (snap.docs.length > 0) {
          const platformData = {
            id: snap.docs[0].id,
            ...snap.docs[0].data(),
          } as Platform;
          setPlatform(platformData);
        }
      } catch (error) {
        console.error('Error loading platform:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPlatform();
    }
  }, [slug]);

  if (loading) {
    return (
      <ScrollView className="flex-1 bg-background">
        <View className="px-4 py-6">
          <Skeleton className="h-32 w-full" />
        </View>
      </ScrollView>
    );
  }

  if (!platform) {
    return (
      <ScrollView className="flex-1 bg-background">
        <View className="px-4 py-6">
          <Text className="text-lg text-foreground">Platform not found</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-6 space-y-6">
        <Card>
          <CardContent>
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: platform.branding?.primaryColor }}
            >
              {platform.name}
            </Text>
            {platform.tagline && (
              <Text className="text-sm text-muted-foreground mb-2">
                {platform.tagline}
              </Text>
            )}
            {platform.description && (
              <Text className="text-base text-foreground">
                {platform.description}
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Communities List */}
        <View className="space-y-4">
          <Text className="text-xl font-semibold text-foreground">
            Communities
          </Text>
          <CommunitiesList platformId={platform.id} platformSlug={slug} />
        </View>

        {platform.settings?.features?.courses && (
          <Button
            onPress={() => {}}
            variant="outline"
            className="w-full"
          >
            View Courses
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

