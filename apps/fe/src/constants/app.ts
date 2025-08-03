// for each reaction (CLAPPING, THINGKING, AMAZED)
export const MAX_REACTIONS_PER_SESSION = 15;

// max shares that will be counted
export const MAX_SHARES_PER_SESSION = 10;

// max views that will be counted
export const MAX_VIEWS_PER_SESSION = 20;

// File upload limits
export const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50MB (for chunked upload)
export const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

// Vercel serverless function limits
export const VERCEL_MAX_PAYLOAD = 4.5 * 1024 * 1024; // 4.5MB
export const CHUNK_SIZE = 3 * 1024 * 1024; // 3MB per chunk

// Constants
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;
export const MAX_LIMIT = 100;
