import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import * as ImageManipulator from 'expo-image-manipulator';

export class StorageService {
  // Upload image with compression
  static async uploadImage(
    uri: string,
    path: string,
    quality: number = 0.8,
    maxWidth: number = 1024,
    maxHeight: number = 1024
  ): Promise<string> {
    try {
      // Compress and resize image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: maxWidth, height: maxHeight } }],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Convert to blob
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(uid: string, uri: string): Promise<string> {
    const path = `profile-pictures/${uid}/${Date.now()}.jpg`;
    return this.uploadImage(uri, path, 0.8, 400, 400);
  }

  // Upload post images
  static async uploadPostImages(postId: string, uris: string[]): Promise<string[]> {
    const uploadPromises = uris.map((uri, index) => {
      const path = `posts/${postId}/${Date.now()}_${index}.jpg`;
      return this.uploadImage(uri, path, 0.7, 1024, 1024);
    });

    return Promise.all(uploadPromises);
  }

  // Upload group cover image
  static async uploadGroupCoverImage(groupId: string, uri: string): Promise<string> {
    const path = `groups/${groupId}/cover_${Date.now()}.jpg`;
    return this.uploadImage(uri, path, 0.8, 800, 400);
  }

  // Delete image
  static async deleteImage(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  // Get file size in MB
  static getFileSize(uri: string): Promise<number> {
    return new Promise((resolve, reject) => {
      fetch(uri)
        .then(response => {
          const contentLength = response.headers.get('content-length');
          if (contentLength) {
            resolve(parseInt(contentLength) / (1024 * 1024));
          } else {
            resolve(0);
          }
        })
        .catch(reject);
    });
  }

  // Validate image file
  static async validateImage(uri: string, maxSizeMB: number = 10): Promise<boolean> {
    try {
      const fileSize = await this.getFileSize(uri);
      return fileSize <= maxSizeMB;
    } catch (error) {
      console.error('Error validating image:', error);
      return false;
    }
  }
} 