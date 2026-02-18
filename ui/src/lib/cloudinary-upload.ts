import type { UploadImageConfig, ValidateImageFileOptions } from '../types';

export const DEFAULT_ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
];

export const DEFAULT_MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const DEFAULT_CLOUDINARY_CLOUD_NAME = 'dyjwctims';
export const DEFAULT_CLOUDINARY_FOLDER = 'dairy-flow';

export const validateImageFile = (
  file: File,
  options?: ValidateImageFileOptions,
): string | null => {
  const maxSize = options?.maxSize ?? DEFAULT_MAX_IMAGE_SIZE;
  const allowedTypes = options?.allowedTypes ?? DEFAULT_ALLOWED_IMAGE_TYPES;

  if (!allowedTypes.includes(file.type)) {
    return 'Only PNG and JPG files are allowed.';
  }

  if (file.size > maxSize) {
    return 'Image must be 5MB or smaller.';
  }

  return null;
};

export const uploadImageToCloudinary = async (
  file: File,
  config?: UploadImageConfig,
): Promise<string> => {
  const cloudName =
    config?.cloudName ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ??
    DEFAULT_CLOUDINARY_CLOUD_NAME;
  const folder = config?.folder ?? DEFAULT_CLOUDINARY_FOLDER;
  const uploadPreset =
    config?.uploadPreset ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
    throw new Error(
      'Cloudinary upload preset is missing. Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.',
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const payload = (await response.json()) as { secure_url?: string };

  if (!payload?.secure_url) {
    throw new Error('secure_url not found');
  }

  return payload.secure_url;
};
