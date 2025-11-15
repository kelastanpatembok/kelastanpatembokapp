import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { firebaseDb, firebaseAuth } from '@/lib/firebase';
import firestore from '@react-native-firebase/firestore';
import { Post } from '@/types';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent } from '@/components/ui/Card';
import { BookOpen } from 'lucide-react-native';
import { useAuth } from '@/components/auth/AuthProvider';

interface CommunityFeedProps {
  platformId: string;
  platformSlug: string;
  communityId: string;
  communityName: string;
  onlyPinned?: boolean;
}

export function CommunityFeed({
  platformId,
  communityId,
  onlyPinned = false,
}: CommunityFeedProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<(Post & { id: string; isLiked?: boolean; isBookmarked?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());

  const loadPosts = async () => {
    try {
      let postsQuery = firebaseDb
        .collection('platforms')
        .doc(platformId)
        .collection('posts')
        .where('communityId', '==', communityId);

      if (onlyPinned) {
        postsQuery = postsQuery.where('pinned', '==', true);
      }

      const snap = await postsQuery
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const postsData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (Post & { id: string })[];

      setPosts(postsData);

      // Load likes and bookmarks
      const uid = firebaseAuth.currentUser?.uid;
      if (uid) {
        const liked = new Set<string>();
        const bookmarked = new Set<string>();

        // Load likes
        await Promise.all(
          postsData.map(async (post) => {
            const reactionDoc = await firebaseDb
              .collection('platforms')
              .doc(platformId)
              .collection('posts')
              .doc(post.id)
              .collection('reactions')
              .doc(uid)
              .get();
            if (reactionDoc.exists) {
              liked.add(post.id);
            }
          })
        );

        // Load bookmarks
        await Promise.all(
          postsData.map(async (post) => {
            const bookmarkId = `${platformId}_${post.id}`;
            const bookmarkDoc = await firebaseDb
              .collection('users')
              .doc(uid)
              .collection('bookmarks')
              .doc(bookmarkId)
              .get();
            if (bookmarkDoc.exists) {
              bookmarked.add(post.id);
            }
          })
        );

        setLikedPosts(liked);
        setBookmarkedPosts(bookmarked);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [platformId, communityId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const handleLike = async (postId: string) => {
    if (!firebaseAuth.currentUser) return;

    const uid = firebaseAuth.currentUser.uid;
    const hadLike = likedPosts.has(postId);
    const reactionRef = firebaseDb
      .collection('platforms')
      .doc(platformId)
      .collection('posts')
      .doc(postId)
      .collection('reactions')
      .doc(uid);

    try {
      if (hadLike) {
        await reactionRef.delete();
        await firebaseDb
          .collection('platforms')
          .doc(platformId)
          .collection('posts')
          .doc(postId)
          .update({
            likes: firestore.FieldValue.increment(-1),
          });
        setLikedPosts((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, likes: Math.max(0, (p.likes || 0) - 1), isLiked: false } : p
          )
        );
      } else {
        await reactionRef.set({
          type: 'like',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        await firebaseDb
          .collection('platforms')
          .doc(platformId)
          .collection('posts')
          .doc(postId)
          .update({
            likes: firestore.FieldValue.increment(1),
          });
        setLikedPosts((prev) => new Set([...prev, postId]));
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, likes: (p.likes || 0) + 1, isLiked: true } : p
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!firebaseAuth.currentUser) return;

    const uid = firebaseAuth.currentUser.uid;
    const bookmarkId = `${platformId}_${postId}`;
    const bookmarkRef = firebaseDb
      .collection('users')
      .doc(uid)
      .collection('bookmarks')
      .doc(bookmarkId);

    try {
      const isBookmarked = bookmarkedPosts.has(postId);
      if (isBookmarked) {
        await bookmarkRef.delete();
        setBookmarkedPosts((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isBookmarked: false } : p)));
      } else {
        await bookmarkRef.set({
          platformId,
          postId,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
        setBookmarkedPosts((prev) => new Set([...prev, postId]));
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isBookmarked: true } : p)));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  if (loading) {
    return (
      <View className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 items-center">
          <BookOpen size={48} color="#71717a" />
          <Text className="text-lg font-semibold text-foreground mt-4 mb-2">
            {onlyPinned ? 'No pinned posts' : 'No posts yet'}
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            {onlyPinned
              ? 'Subscribe to see all posts'
              : 'Be the first to start the conversation!'}
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              isLiked: likedPosts.has(post.id),
              isBookmarked: bookmarkedPosts.has(post.id),
            }}
            onLike={() => handleLike(post.id)}
            onBookmark={() => handleBookmark(post.id)}
            onComment={() => {
              // Navigate to post detail or open comment modal
            }}
            onShare={() => {
              // Share functionality
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

