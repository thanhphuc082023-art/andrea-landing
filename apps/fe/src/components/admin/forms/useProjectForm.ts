import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type ProjectFormData,
  projectFormSchema,
} from '@/lib/validations/project';
import { type ShowcaseSection } from '@/types/project';
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

interface UseProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
}

export function useProjectForm({ initialData, onSubmit }: UseProjectFormProps) {
  // Session cleanup on unmount - disable auto cleanup to preserve data for preview
  const { cleanup } = useSessionCleanup({
    ...sessionCleanupConfigs.projectForm,
    disableAutoCleanup: true,
  });

  // Form state
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      slug: initialData?.slug || '',
      status: initialData?.status || 'draft',
      featured: initialData?.featured || false,
      overview: initialData?.overview || '',
      challenge: initialData?.challenge || '',
      solution: initialData?.solution || '',
      categoryId: initialData?.categoryId || '',
      projectIntroTitle: initialData?.projectIntroTitle || '',
      credits: initialData?.credits || {
        title: '',
        creditLabel: 'Credit:',
        date: '',
        projectManager:
          initialData?.credits?.projectManager ||
          'Project Manager: Chưa có\nGraphic Designer: Chưa có\nShowcase: Chưa có',
      },
      seo: initialData?.seo || {
        title: '',
        description: '',
        keywords: [],
      },
      thumbnail: initialData?.thumbnail || undefined,
      heroVideo: initialData?.heroVideo || undefined,
    },
  });

  // Local state for dynamic fields
  const [technologies, setTechnologies] = useState<string[]>(
    initialData?.technologies || []
  );
  const [newTechnology, setNewTechnology] = useState('');
  const [projectMetaInfo, setProjectMetaInfo] = useState<string[]>(
    initialData?.projectMetaInfo || []
  );
  const [newMetaInfo, setNewMetaInfo] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [credits, setCredits] = useState<string[]>(
    initialData?.credits?.projectManager
      ? initialData.credits.projectManager
          .split('\n')
          .filter((line) => line.trim())
      : [
          'Project Manager: Chưa có',
          'Graphic Designer: Chưa có',
          'Showcase: Chưa có',
        ]
  );
  const [newCredit, setNewCredit] = useState('');
  const [showcaseSections, setShowcaseSections] = useState<ShowcaseSection[]>(
    []
  );

  // Initialize projectManager field with credits
  useEffect(() => {
    const projectManagerText = credits.join('\n');
    setValue('credits.projectManager', projectManagerText);
  }, [credits, setValue]);

  // Load saved data from sessionStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFormData = sessionStorage.getItem('projectFormData');
      const savedShowcaseSections = sessionStorage.getItem(
        'projectShowcaseSections'
      );

      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);

          // Update form values
          setValue('title', parsedData.title || '');
          setValue('description', parsedData.description || '');
          setValue('content', parsedData.content || '');
          setValue('slug', parsedData.slug || '');
          setValue('status', parsedData.status || 'draft');
          setValue('featured', parsedData.featured || false);
          setValue('overview', parsedData.overview || '');
          setValue('challenge', parsedData.challenge || '');
          setValue('solution', parsedData.solution || '');
          setValue('categoryId', parsedData.categoryId || '');
          setValue('projectIntroTitle', parsedData.projectIntroTitle || '');
          setValue(
            'credits',
            parsedData.credits || {
              title: '',
              creditLabel: 'Credit:',
              date: '',
              projectManager: '',
            }
          );
          setValue(
            'seo',
            parsedData.seo || {
              title: '',
              description: '',
              keywords: [],
            }
          );
          setValue('thumbnail', parsedData.thumbnail || undefined);
          setValue('heroVideo', parsedData.heroVideo || undefined);

          // Update local state
          if (parsedData.technologies) {
            setTechnologies(parsedData.technologies);
          }
          if (parsedData.projectMetaInfo) {
            setProjectMetaInfo(parsedData.projectMetaInfo);
          }
          if (parsedData.credits?.projectManager) {
            const creditsList = parsedData.credits.projectManager
              .split('\n')
              .filter((line) => line.trim());
            setCredits(creditsList);
            setValue(
              'credits.projectManager',
              parsedData.credits.projectManager
            );
          }
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }

      // Load showcase sections
      if (savedShowcaseSections) {
        try {
          const parsedSections = JSON.parse(savedShowcaseSections);
          setShowcaseSections(parsedSections);
        } catch (error) {
          console.error('Error parsing showcase sections:', error);
        }
      }
    }
  }, [setValue]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // Watch title and auto-generate slug
  const title = watch('title');
  useEffect(() => {
    if (title && !initialData?.slug) {
      const generatedSlug = generateSlug(title);
      setValue('slug', generatedSlug);
    }
  }, [title, setValue, initialData?.slug]);

  // Technology management
  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  // Meta info management
  const addMetaInfo = () => {
    if (newMetaInfo.trim() && !projectMetaInfo.includes(newMetaInfo.trim())) {
      setProjectMetaInfo([...projectMetaInfo, newMetaInfo.trim()]);
      setNewMetaInfo('');
    }
  };

  const removeMetaInfo = (info: string) => {
    setProjectMetaInfo(projectMetaInfo.filter((i) => i !== info));
  };

  // Keyword management
  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = watch('seo.keywords') || [];
      setValue('seo.keywords', [...currentKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = watch('seo.keywords') || [];
    setValue(
      'seo.keywords',
      currentKeywords.filter((_, i) => i !== index)
    );
  };

  // Credit management
  const addCredit = () => {
    if (newCredit.trim() && !credits.includes(newCredit.trim())) {
      const updatedCredits = [...credits, newCredit.trim()];
      setCredits(updatedCredits);
      // Update projectManager field
      setValue('credits.projectManager', updatedCredits.join('\n'));
      setNewCredit('');
    }
  };

  const removeCredit = (credit: string) => {
    const updatedCredits = credits.filter((c) => c !== credit);
    setCredits(updatedCredits);
    // Update projectManager field
    setValue('credits.projectManager', updatedCredits.join('\n'));
  };

  // Save data to sessionStorage for preview
  const saveDataForPreview = () => {
    const currentData = watch();

    const finalData = {
      ...currentData,
      slug: currentData.slug || generateSlug(currentData.title),
      technologies,
      projectMetaInfo,
      credits: {
        title: currentData.credits?.title || '',
        creditLabel: currentData.credits?.creditLabel || '',
        date: currentData.credits?.date || '',
        projectManager:
          credits.length > 0
            ? credits.join('\n')
            : 'Project Manager: Chưa có\nGraphic Designer: Chưa có\nShowcase: Chưa có',
      },
      // Include heroVideo and thumbnail data for preview
      heroVideo: currentData.heroVideo,
      thumbnail: currentData.thumbnail,
    };

    sessionStorage.setItem('projectFormData', JSON.stringify(finalData));
    sessionStorage.setItem(
      'projectShowcaseSections',
      JSON.stringify(showcaseSections)
    );
  };

  // Form submission
  const handleFormSubmit = (data: ProjectFormData) => {
    const finalData = {
      ...data,
      slug: data.slug || generateSlug(data.title),
      technologies,
      projectMetaInfo,
      credits: {
        title: data.credits?.title || '',
        creditLabel: data.credits?.creditLabel || 'Credit:',
        date: data.credits?.date || '',
        projectManager: credits.join('\n'),
      },
      showcase: showcaseSections,
      // Include heroVideo and thumbnail data for submission
      heroVideo: data.heroVideo,
      thumbnail: data.thumbnail,
    };

    // Clear sessionStorage after successful submission
    cleanup();

    onSubmit(finalData);
  };

  // Reset form
  const resetForm = () => {
    reset();
    setTechnologies([]);
    setProjectMetaInfo([]);
    setCredits([]);
    setShowcaseSections([]);
    setNewTechnology('');
    setNewMetaInfo('');
    setNewKeyword('');
    setNewCredit('');

    // Clear sessionStorage when resetting form
    cleanup();
  };

  return {
    // Form methods
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    errors,

    // Local state
    technologies,
    newTechnology,
    setNewTechnology,
    projectMetaInfo,
    newMetaInfo,
    setNewMetaInfo,
    newKeyword,
    setNewKeyword,
    credits,
    newCredit,
    setNewCredit,
    showcaseSections,
    setShowcaseSections,

    // Actions
    addTechnology,
    removeTechnology,
    addMetaInfo,
    removeMetaInfo,
    addKeyword,
    removeKeyword,
    addCredit,
    removeCredit,
    handleFormSubmit,
    resetForm,
    saveDataForPreview,
    cleanup, // Export cleanup function for manual use
  };
}
