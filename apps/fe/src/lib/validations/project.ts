import { z } from 'zod';

export const projectFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  slug: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean(),
  status: z.enum(['draft', 'in-progress', 'completed']),
  categoryId: z.string().optional(),
  featuredImage: z.any().optional(),
  gallery: z.array(z.any()).optional(),
  results: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .optional(),
  metrics: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      canonicalUrl: z.string().url().optional().or(z.literal('')),
      metaRobots: z.string().optional(),
      ogTitle: z.string().optional(),
      ogDescription: z.string().optional(),
      ogImage: z.any().optional(),
      ogType: z.string().optional(),
      twitterTitle: z.string().optional(),
      twitterDescription: z.string().optional(),
      twitterImage: z.any().optional(),
      twitterCard: z.string().optional(),
      schemaMarkup: z.string().optional(),
    })
    .optional(),
  projectIntroTitle: z.string().min(1, 'Tiêu đề giới thiệu là bắt buộc'),
  projectMetaInfo: z.array(z.string()).optional(),
  credits: z.object({
    title: z.string().min(1, 'Tiêu đề credits là bắt buộc'),
    creditLabel: z.string().min(1, 'Nhãn Credits là bắt buộc'),
    date: z.string().min(1, 'Ngày tháng là bắt buộc'),
    projectManager: z.string().min(1, 'Credits là bắt buộc'),
  }),
  heroVideo: z.any().optional(),
  videoLink: z.any().optional(),
  heroBanner: z.any().optional(),
  thumbnail: z.any().optional(),
  showcase: z.array(z.any()).optional(),
  content: z.any().optional(), // Content field for rich text editor
  body: z.any(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export const showcaseSectionSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'video', 'gallery']),
  title: z.string().optional(),
  content: z.string().optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['text', 'image', 'video']),
        content: z.string(),
        media: z.any().optional(),
      })
    )
    .optional(),
  order: z.number(),
});

export type ShowcaseSection = z.infer<typeof showcaseSectionSchema>;
