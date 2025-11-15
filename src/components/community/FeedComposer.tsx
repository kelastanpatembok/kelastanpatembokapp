import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Image as ImageIcon, X } from 'lucide-react-native';
import { useAuth } from '@/components/auth/AuthProvider';
import * as ImagePicker from 'expo-image-picker';
import { cn } from '@/lib/utils';

interface FeedComposerProps {
  onAddPost: (content: string, imageUri?: string) => Promise<void>;
  placeholder?: string;
}

export function FeedComposer({ onAddPost, placeholder = "What's on your mind?" }: FeedComposerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    setLoading(true);
    try {
      await onAddPost(content, imageUri || undefined);
      setContent('');
      setImageUri(null);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <View className="flex-row gap-3">
          <Avatar
            src={user?.avatarUrl}
            fallback={user?.name?.substring(0, 2).toUpperCase() || 'U'}
            size="sm"
          />
          <View className="flex-1">
            <TextInput
              className="text-base text-foreground min-h-[80px]"
              placeholder={placeholder}
              placeholderTextColor="#71717a"
              multiline
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
            />
            
            {imageUri && (
              <View className="mt-2 relative">
                <TouchableOpacity
                  onPress={() => setImageUri(null)}
                  className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1"
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
                {/* Image preview would go here */}
                <View className="h-32 w-full bg-muted rounded-lg" />
              </View>
            )}

            <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-border">
              <TouchableOpacity
                onPress={handlePickImage}
                className="flex-row items-center gap-2"
              >
                <ImageIcon size={18} color="#71717a" />
                <Text className="text-sm text-muted-foreground">Photo</Text>
              </TouchableOpacity>

              <Button
                onPress={handleSubmit}
                disabled={!content.trim() || loading}
                size="sm"
              >
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

