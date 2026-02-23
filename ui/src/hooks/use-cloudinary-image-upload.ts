import { type ChangeEvent, useEffect, useRef, useState } from 'react';

import type { UseCloudinaryImageUploadOptions } from '../types';

import {
  uploadImageToCloudinary,
  validateImageFile,
} from '../lib/cloudinary-upload';

export const useCloudinaryImageUpload = (
  options: UseCloudinaryImageUploadOptions,
) => {
  const { initialImageUrl, fallbackImageUrl } = options;
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
    null,
  );
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearPendingImage = () => {
    if (pendingPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }
    setPendingPreviewUrl(null);
    setPendingImageFile(null);
  };

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(pendingPreviewUrl);
      }
    };
  }, [pendingPreviewUrl]);

  const openFilePicker = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const onFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      event.target.value = '';
      return;
    }

    clearPendingImage();
    const previewUrl = URL.createObjectURL(file);
    setPendingImageFile(file);
    setPendingPreviewUrl(previewUrl);
    setImageUrl(previewUrl);
    setUploadError('');
    event.target.value = '';
  };

  const uploadPendingImage = async (): Promise<string | null> => {
    if (!pendingImageFile) {
      return imageUrl;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const secureUrl = await uploadImageToCloudinary(pendingImageFile);
      setImageUrl(secureUrl);
      clearPendingImage();
      return secureUrl;
    } catch (error) {
      if (error instanceof Error) {
        setUploadError(error.message);
      } else {
        setUploadError('Failed to upload image. Please try again.');
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    clearPendingImage();
    setImageUrl(fallbackImageUrl);
    setUploadError('');
  };

  const resetImage = (nextImageUrl: string) => {
    clearPendingImage();
    setImageUrl(nextImageUrl);
    setUploadError('');
  };

  return {
    fileInputRef,
    imageUrl,
    uploadError,
    isUploading,
    openFilePicker,
    onFileInputChange,
    uploadPendingImage,
    removeImage,
    resetImage,
  };
};
