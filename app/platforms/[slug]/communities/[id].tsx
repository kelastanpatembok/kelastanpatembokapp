import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { firebaseDb, firebaseAuth } from '@/lib/firebase';
import { collection, getDocs, query, where, limit, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Community, Post } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { CommunityFeed } from '@/components/community/CommunityFeed';
import { FeedComposer } from '@/components/community/FeedComposer';
import { useAuth } from '@/components/auth/AuthProvider';
import { Users, BookOpen, MessageSquare, MessageCircle } from 'lucide-react-native';
import { cn } from '@/lib/utils';

type TabType = 'feed' | 'courses' | 'forum' | 'chat';

export default function CommunityDetailScreen() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const [platform, setPlatform] = useState<any>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const loadData = async () => {
    try {
      // Load platform
      const platformSnap = await getDocs(
        query(
          collection(firebaseDb, 'platforms'),
          where('slug', '==', slug),
          limit(1)
        )
      );

      if (platformSnap.docs.length === 0) {
        router.back();
        return;
      }

      const platformData = {
        id: platformSnap.docs[0].id,
        ...platformSnap.docs[0].data(),
      };
      setPlatform(platformData);

      // Load community
      const communityDoc = await getDoc(
        doc(firebaseDb, 'platforms', platformData.id, 'communities', id)
      );

      if (!communityDoc.exists()) {
        router.back();
        return;
      }

      const communityData = {
        id: communityDoc.id,
        ...communityDoc.data(),
      } as Community;
      setCommunity(communityData);

      // Check access
      const currentUser = getAuth(firebaseAuth).currentUser;
      const uid = currentUser?.uid;
      if (uid) {
        const isPlatformOwner = platformData.ownerId === uid;
        setIsOwner(isPlatformOwner);
        
        if (isPlatformOwner) {
          setHasAccess(true);
        } else {
          const memberDoc = await getDoc(
            doc(firebaseDb, 'platforms', platformData.id, 'members', uid)
          );
          
          if (memberDoc.exists()) {
            const memberData = memberDoc.data();
            setHasAccess(memberData?.hasPaid === true || memberData?.communities?.includes(id));
          } else {
            setHasAccess(false);
          }
        }
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (slug && id) {
      loadData();
    }
  }, [slug, id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleAddPost = async (content: string, imageUri?: string) => {
    const currentUser = getAuth(firebaseAuth).currentUser;
    if (!currentUser || !platform || !community) return;

    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const newPost = {
        content,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        platformId: platform.id,
        communityId: community.id,
        communityName: community.name,
        authorId: currentUser.uid,
        authorName: user?.name || 'Unknown',
        authorAvatar: user?.avatarUrl || '',
        ...(imageUri && { imageUrl: imageUri }),
      };

      await addDoc(
        collection(firebaseDb, 'platforms', platform.id, 'posts'),
        newPost
      );

      // Reload posts
      loadData();
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <ScrollView className="flex-1 bg-background">
        <View className="px-4 py-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </View>
      </ScrollView>
    );
  }

  if (!platform || !community) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-foreground">Community not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-4 py-6 space-y-6">
          {/* Community Header */}
          <Card>
            <CardHeader>
              <View className="flex-row items-start gap-4">
                {community.thumbnail && (
                  <View
                    className="h-16 w-16 rounded-lg bg-muted overflow-hidden"
                    style={{
                      borderColor: platform.branding?.primaryColor,
                      borderWidth: 2,
                    }}
                  >
                    {/* Image would go here */}
                  </View>
                )}
                <View className="flex-1">
                  <Text
                    className="text-2xl font-bold mb-1"
                    style={{ color: platform.branding?.primaryColor }}
                  >
                    {community.name}
                  </Text>
                  {community.description && (
                    <Text className="text-sm text-muted-foreground">
                      {community.description}
                    </Text>
                  )}
                </View>
              </View>
            </CardHeader>
            <CardContent>
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <Users size={16} color="#71717a" />
                  <Text className="text-sm text-muted-foreground">
                    {community.memberCount || 0} members
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Tabs */}
          <View className="flex-row border-b border-border">
            <TouchableOpacity
              onPress={() => setActiveTab('feed')}
              className={cn(
                'flex-1 py-3 items-center border-b-2',
                activeTab === 'feed' ? 'border-primary' : 'border-transparent'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  activeTab === 'feed' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Feed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('courses')}
              className={cn(
                'flex-1 py-3 items-center border-b-2',
                activeTab === 'courses' ? 'border-primary' : 'border-transparent'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  activeTab === 'courses' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Courses
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('forum')}
              className={cn(
                'flex-1 py-3 items-center border-b-2',
                activeTab === 'forum' ? 'border-primary' : 'border-transparent'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  activeTab === 'forum' ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Forum
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'feed' && (
            <View>
              {user && isOwner && (
                <FeedComposer onAddPost={handleAddPost} />
              )}
              <CommunityFeed
                platformId={platform.id}
                platformSlug={slug}
                communityId={community.id}
                communityName={community.name}
                onlyPinned={hasAccess === false}
              />
            </View>
          )}

          {activeTab === 'courses' && (
            <View>
              <Text className="text-lg font-semibold text-foreground mb-4">
                Courses
              </Text>
              <Text className="text-muted-foreground">
                Courses feature coming soon...
              </Text>
            </View>
          )}

          {activeTab === 'forum' && (
            <View>
              <Text className="text-lg font-semibold text-foreground mb-4">
                Forum
              </Text>
              <Text className="text-muted-foreground">
                Forum feature coming soon...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

