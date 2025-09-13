import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type InsightFormData,
  insightFormSchema,
} from '@/lib/validations/insight';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

export function useInsightForm(initialData?: Partial<InsightFormData>) {
  // Session cleanup
  useSessionCleanup(sessionCleanupConfigs.projectForm);

  // Form setup
  const form = useForm<any>({
    resolver: zodResolver(insightFormSchema),
    shouldFocusError: false,
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      category: '',
      content: '',
      author: {
        name: '',
        role: '',
      },
      status: 'draft',
      featured: false,
      collectionName: 'Góc nhìn của Andrea',
      collectionHref: '/insights',
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        metaRobots: 'index,follow',
        ogType: 'article',
        twitterCard: 'summary_large_image',
      },
      ...initialData,
    },
  });

  const { watch, setValue } = form;
  const title = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !initialData?.slug) {
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

      setValue('slug', slug);
    }
  }, [title, setValue, initialData?.slug]);

  // Auto-generate SEO meta title from title
  useEffect(() => {
    if (title && !form.getValues('seo.metaTitle')) {
      setValue('seo.metaTitle', title);
    }
  }, [title, setValue, form]);

  // Auto-generate SEO meta description from excerpt
  const excerpt = watch('excerpt');
  useEffect(() => {
    if (excerpt && !form.getValues('seo.metaDescription')) {
      setValue('seo.metaDescription', excerpt);
    }
  }, [excerpt, setValue, form]);

  return form;
}
