/**
 * Constants for React Email Editor
 */

export const EDITOR_CONFIG = {
  PROJECT_ID: 9788,
  HEIGHT: '100vh',
  DISPLAY_MODE: 'email' as const,
  FEATURES: {
    stockImages: false,
    imageEditor: true,
    undoRedo: true,
  },
  ID: 'dy-email-editor',
} as const;

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
  DEFAULT_PATH: 'editor-images',
} as const;

export const STRAPI_CONFIG = {
  DEFAULT_URL: 'https://joyful-basket-ea764d9c28.strapiapp.com',
  UPLOAD_ENDPOINT: '/api/upload',
} as const;
