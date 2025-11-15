import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Heart, MessageCircle, Bookmark, Share2, MoreVertical } from 'lucide-react-native';
import { Post } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post & {
    isLiked?: boolean;
    isBookmarked?: boolean;
    imageUrl?: string;
  };
  onLike?: () => void;
  onBookmark?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onPress?: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
}

export function PostCard({
  post,
  onLike,
  onBookmark,
  onComment,
  onShare,
  onPress,
  canDelete,
  onDelete,
}: PostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const contentLength = post.content?.length || 0;
  const shouldTruncate = contentLength > 200;

  return (
    <Card onTouchEnd={onPress} className="mb-4">
      <CardContent className="p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2 flex-1">
            <Avatar
              src={post.authorAvatar}
              fallback={post.authorName?.substring(0, 2).toUpperCase() || 'U'}
              size="sm"
            />
            <View className="flex-1 min-w-0">
              <Text className="font-medium text-foreground" numberOfLines={1}>
                {post.authorName}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {formatRelativeTime(post.createdAt)}
              </Text>
            </View>
          </View>
          {(canDelete || onDelete) && (
            <TouchableOpacity onPress={onDelete}>
              <MoreVertical size={18} color="#71717a" />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        {post.title && (
          <Text className="text-base font-semibold text-foreground mb-2">
            {post.title}
          </Text>
        )}
        <Text className="text-sm text-foreground leading-relaxed">
          {shouldTruncate && !showFullContent
            ? `${post.content?.substring(0, 200)}...`
            : post.content}
        </Text>
        {shouldTruncate && (
          <TouchableOpacity onPress={() => setShowFullContent(!showFullContent)}>
            <Text className="text-sm text-primary mt-1">
              {showFullContent ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Image */}
        {post.imageUrl && (
          <View className="mt-3 rounded-lg overflow-hidden">
            <Image
              source={{ uri: post.imageUrl }}
              className="w-full aspect-video"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Actions */}
        <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-border">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={onLike}
              className="flex-row items-center gap-1"
            >
              <Heart
                size={18}
                color={post.isLiked ? '#ef4444' : '#71717a'}
                fill={post.isLiked ? '#ef4444' : 'none'}
              />
              <Text className="text-sm text-muted-foreground">
                {post.likes || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onComment}
              className="flex-row items-center gap-1"
            >
              <MessageCircle size={18} color="#71717a" />
              <Text className="text-sm text-muted-foreground">
                {post.comments || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onShare}>
              <Share2 size={18} color="#71717a" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onBookmark}>
            <Bookmark
              size={18}
              color={post.isBookmarked ? '#66b132' : '#71717a'}
              fill={post.isBookmarked ? '#66b132' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </CardContent>
    </Card>
  );
}

