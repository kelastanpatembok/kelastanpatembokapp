import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Image as ImageIcon, X } from 'lucide-react-native';
import { useAuth } from '@/components/auth/AuthProvider';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
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
    // Request permissions for Android
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to pick images',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission needed', 'Please grant storage permissions');
          return;
        }
      } catch (err) {
        console.warn(err);
      }
    }

    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        selectionLimit: 1,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets[0]) {
          setImageUri(response.assets[0].uri || null);
        }
      }
    );
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
            source={user?.avatarUrl ? { uri: user.avatarUrl } : undefined}
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

