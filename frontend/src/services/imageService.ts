import * as ImagePicker from 'expo-image-picker';
import {Alert} from 'react-native';

export interface ImageResult {
  uri: string;
  fileName?: string;
  type?: string;
}

class ImageService {
  async requestCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  }

  async requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  }

  showImagePicker(): Promise<ImageResult | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image',
        'Choose how you want to select a soil image',
        [
          {
            text: 'Camera',
            onPress: () => this.openCamera().then(resolve),
          },
          {
            text: 'Gallery',
            onPress: () => this.openGallery().then(resolve),
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ]
      );
    });
  }

  private async openCamera(): Promise<ImageResult | null> {
    const hasPermission = await this.requestCameraPermission();
    
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return null;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          fileName: asset.fileName || 'camera_image.jpg',
          type: 'image/jpeg',
        };
      }
      return null;
    } catch (error) {
      console.error('Camera error:', error);
      return null;
    }
  }

  private async openGallery(): Promise<ImageResult | null> {
    const hasPermission = await this.requestMediaLibraryPermission();
    
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Media library permission is required to select photos.');
      return null;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          fileName: asset.fileName || 'gallery_image.jpg',
          type: 'image/jpeg',
        };
      }
      return null;
    } catch (error) {
      console.error('Gallery error:', error);
      return null;
    }
  }
}

export default new ImageService();