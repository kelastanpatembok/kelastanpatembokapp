import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, BookOpen } from 'lucide-react-native';
import { Community } from '@/types';
import { cn } from '@/lib/utils';

interface CommunityCardProps {
  community: Community;
  onPress?: () => void;
  platformPrimaryColor?: string;
}

export function CommunityCard({ community, onPress, platformPrimaryColor }: CommunityCardProps) {
  return (
    <Card onTouchEnd={onPress} className="active:opacity-70">
      <CardContent>
        <View className="flex-row items-start gap-3">
          {community.thumbnail && (
            <View
              className="h-12 w-12 rounded-lg bg-muted overflow-hidden"
              style={{
                borderColor: platformPrimaryColor,
                borderWidth: platformPrimaryColor ? 2 : 0,
              }}
            >
              {/* Image would go here */}
            </View>
          )}
          <View className="flex-1 min-w-0">
            <Text className="text-lg font-semibold text-foreground mb-1">
              {community.name}
            </Text>
            {community.description && (
              <Text className="text-sm text-muted-foreground mb-2" numberOfLines={2}>
                {community.description}
              </Text>
            )}
            <View className="flex-row items-center gap-4 mt-2">
              {community.memberCount !== undefined && (
                <View className="flex-row items-center gap-1">
                  <Users size={14} color="#71717a" />
                  <Text className="text-xs text-muted-foreground">
                    {community.memberCount.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

