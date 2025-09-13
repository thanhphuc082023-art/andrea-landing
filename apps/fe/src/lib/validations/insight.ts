import { z } from 'zod';

// File upload schema
const fileUploadSchema = z.object({
  file: z.any().optional(),
  url: z.any().optional(),
  name: z.any().optional(),
  uploadId: z.number().optional(),
});

// Author schema
const authorSchema = z.object({
  name: z.string().min(1, 'Tên tác giả là bắt buộc'),
  role: z.string().optional(),
  avatar: fileUploadSchema.optional(),
});

// Hero images schema
const heroImagesSchema = z.object({
  desktop: fileUploadSchema.optional(),
  mobile: fileUploadSchema.optional(),
});

// SEO schema
const seoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  metaRobots: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: fileUploadSchema.optional(),
  ogType: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: fileUploadSchema.optional(),
  twitterCard: z.string().optional(),
  schemaMarkup: z.string().optional(),
});

// Main insight form schema
export const insightFormSchema = z.object({
  // Basic information
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().optional(),
  excerpt: z.string().min(1, 'Tóm tắt là bắt buộc'),
  category: z.string().min(1, 'Danh mục là bắt buộc'),

  // Content
  content: z.any(),

  // Author information
  author: authorSchema,

  // Hero images
  hero: heroImagesSchema.optional(),

  // Featured image for listing
  thumbnail: fileUploadSchema.optional(),

  // Status and settings
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),

  // Collection info
  collectionName: z.string().optional().default('Góc nhìn của Andrea'),
  collectionHref: z.string().optional().default('/insights'),

  // SEO
  seo: seoSchema.optional(),

  // Publishing
  publishedAt: z.string().optional(),

  // Reading time (auto-calculated)
  readingTime: z.number().optional(),
});

export type InsightFormData = z.infer<typeof insightFormSchema>;

// Schema for insight sections (if needed for structured content)
export const insightSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(), // HTML content
  order: z.number(),
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
    )
    .optional(),
});

export type InsightSection = z.infer<typeof insightSectionSchema>;

// Categories enum (can be extended)
export const INSIGHT_CATEGORIES = [
  'Thiết kế bao bì',
  'Thiết kế thương hiệu',
  'Thiết kế website',
  'Marketing',
  'Xu hướng thiết kế',
  'Case study',
  'Khác',
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];
