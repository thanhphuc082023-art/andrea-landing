import { Fragment, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, Transition, Listbox, Tab } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  Bars3Icon,
} from '@heroicons/react/20/solid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  type ProjectFormData,
  projectFormSchema,
} from '@/lib/validations/project';
import { type ShowcaseSection } from '@/types/project';
import React from 'react';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  categories?: Array<{ id: number; name: string }>;
  isLoading?: boolean;
}

const statusOptions = [
  { id: 'draft', name: 'Bản nháp' },
  { id: 'in-progress', name: 'Đang thực hiện' },
  { id: 'completed', name: 'Hoàn thành' },
];

export default function ProjectForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories = [],
  isLoading = false,
}: ProjectFormProps) {
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
      : []
  );
  const [newCredit, setNewCredit] = useState('');
  const [showcaseSections, setShowcaseSections] = useState<ShowcaseSection[]>(
    []
  );

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
        date: '',
        projectManager: '',
      },
      seo: initialData?.seo || {
        title: '',
        description: '',
        keywords: [],
      },
    },
  });

  // Watch title and auto-generate slug
  const title = watch('title');
  React.useEffect(() => {
    if (title && !initialData?.slug) {
      const generatedSlug = generateSlug(title);
      setValue('slug', generatedSlug);
    }
  }, [title, setValue, initialData?.slug]);

  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

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

  const addMetaInfo = () => {
    if (newMetaInfo.trim() && !projectMetaInfo.includes(newMetaInfo.trim())) {
      setProjectMetaInfo([...projectMetaInfo, newMetaInfo.trim()]);
      setNewMetaInfo('');
    }
  };

  const removeMetaInfo = (info: string) => {
    setProjectMetaInfo(projectMetaInfo.filter((i) => i !== info));
  };

  const addCredit = () => {
    if (newCredit.trim() && !credits.includes(newCredit.trim())) {
      setCredits([...credits, newCredit.trim()]);
      setNewCredit('');
    }
  };

  const removeCredit = (credit: string) => {
    setCredits(credits.filter((c) => c !== credit));
  };

  const handleFormSubmit = (data: ProjectFormData) => {
    // Ensure slug is generated if not provided
    const finalData = {
      ...data,
      slug: data.slug || generateSlug(data.title),
      technologies,
      projectMetaInfo,
      credits: {
        title: data.credits?.title || '',
        date: data.credits?.date || '',
        projectManager: credits.join('\n'),
      },
      showcase: showcaseSections, // Add showcase data
    };
    onSubmit(finalData);
  };

  const handleClose = () => {
    reset();
    setTechnologies([]);
    setProjectMetaInfo([]);
    setCredits([]);
    setShowcaseSections([]);
    onClose();
  };

  const addQuickSection = (
    type: ShowcaseSection['type'],
    layout: ShowcaseSection['layout']
  ) => {
    const newSection: ShowcaseSection = {
      id: `section-${Date.now()}`,
      type,
      layout,
      title: `Section ${showcaseSections.length + 1}`,
      items: [
        {
          id: `item-${Date.now()}`,
          type:
            type === 'flipbook'
              ? 'flipbook'
              : type === 'video'
                ? 'video'
                : 'image',
          title: `Item ${showcaseSections.length + 1}`,
          description: '',
          src: '',
          alt: '',
          width: 1300,
          height: 800,
          colSpan: 1,
          bookData:
            type === 'flipbook'
              ? {
                  title: 'Project Title',
                  websiteUrl: 'https://example.com',
                  phoneNumber: '+1234567890',
                  downloadUrl: '/download-file.pdf',
                }
              : undefined,
          order: 0,
        },
      ],
      order: showcaseSections.length,
    };
    setShowcaseSections([...showcaseSections, newSection]);
  };

  // SortableSection Component
  const SortableSection = ({
    section,
    index,
  }: {
    section: ShowcaseSection;
    index: number;
  }) => {
    if (!section || !section.id) {
      return null; // Return null if section is invalid
    }

    let sortableProps;
    try {
      sortableProps = useSortable({ id: section.id });
    } catch (error) {
      console.error('useSortable error:', error);
      return null;
    }

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = sortableProps;

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? 'none' : transition,
    };

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'image':
          return <PhotoIcon className="h-5 w-5 text-blue-500" />;
        case 'video':
          return <VideoCameraIcon className="h-5 w-5 text-red-500" />;
        case 'flipbook':
          return <DocumentTextIcon className="h-5 w-5 text-green-500" />;
        case 'text':
          return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
        default:
          return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
      }
    };

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'image':
          return 'from-blue-50 to-blue-100 border-blue-200';
        case 'video':
          return 'from-red-50 to-red-100 border-red-200';
        case 'flipbook':
          return 'from-green-50 to-green-100 border-green-200';
        case 'text':
          return 'from-purple-50 to-purple-100 border-purple-200';
        default:
          return 'from-gray-50 to-gray-100 border-gray-200';
      }
    };

    const formatFileSize = (bytes: number, decimalPoint = 2) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimalPoint < 0 ? 0 : decimalPoint;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group relative overflow-hidden rounded-xl border-2 bg-gradient-to-r ${getTypeColor(
          section.type
        )} p-6 shadow-lg transition-all duration-150 ease-out hover:shadow-xl ${
          isDragging ? 'rotate-1 scale-95 opacity-50' : ''
        }`}
      >
        {/* Drag Handle Area - Only this area triggers drag */}
        <div
          {...attributes}
          {...listeners}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ pointerEvents: 'auto' }}
        />

        {/* Content Area - No drag, only interactions */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Type Icon & Info */}
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 shadow-sm backdrop-blur-sm">
                  {getTypeIcon(section.type)}
                </div>
                <div>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      setShowcaseSections((prevSections) =>
                        prevSections.map((s) =>
                          s.id === section.id
                            ? { ...s, title: e.target.value }
                            : s
                        )
                      );
                    }}
                    className="w-full rounded-md border-gray-300 bg-transparent pb-2 text-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Nhập tên section..."
                  />
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="inline-flex items-center rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm">
                      {section.type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm">
                      {section.layout}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Delete Button */}
              <button
                type="button"
                onClick={() => {
                  console.log('Delete button clicked for section:', section.id);
                  setShowcaseSections((prevSections) => {
                    console.log('Previous sections:', prevSections);
                    const filtered = prevSections.filter(
                      (s) => s.id !== section.id
                    );
                    console.log('Filtered sections:', filtered);
                    return filtered;
                  });
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600 transition-all hover:bg-red-500 hover:text-white"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Media Preview */}
          {section.items.length > 0 && section.items[0].src && (
            <div className="mt-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {section.items[0].title || 'Uploaded file'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {section.items[0].size
                      ? formatFileSize(section.items[0].size)
                      : 'Unknown size'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Ready
                  </span>
                </div>
              </div>

              {/* Width/Height Inputs */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={section.items[0].width || 1300}
                    onChange={(e) => {
                      setShowcaseSections((prevSections) =>
                        prevSections.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                items: [
                                  {
                                    ...s.items[0],
                                    width: parseInt(e.target.value) || 1300,
                                  },
                                ],
                              }
                            : s
                        )
                      );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="1300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={section.items[0].height || 800}
                    onChange={(e) => {
                      setShowcaseSections((prevSections) =>
                        prevSections.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                items: [
                                  {
                                    ...s.items[0],
                                    height: parseInt(e.target.value) || 800,
                                  },
                                ],
                              }
                            : s
                        )
                      );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Upload Area - Show when no file uploaded */}
          {(!section.items[0] || !section.items[0].src) && (
            <label className="mt-4 block cursor-pointer rounded-lg border-2 border-dashed border-white/40 p-4 text-center transition-all hover:border-white/60 hover:bg-white/20">
              <input
                type="file"
                accept={
                  section.type === 'image'
                    ? 'image/*'
                    : section.type === 'video'
                      ? 'video/*'
                      : section.type === 'flipbook'
                        ? '.pdf,.doc,.docx'
                        : '*'
                }
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setShowcaseSections((prevSections) =>
                      prevSections.map((s) =>
                        s.id === section.id
                          ? {
                              ...s,
                              items: [
                                {
                                  ...s.items[0],
                                  title: file.name,
                                  src: URL.createObjectURL(file),
                                  alt: file.name,
                                  size: file.size,
                                },
                              ],
                            }
                          : s
                      )
                    );
                  }
                }}
                className="hidden"
              />
              <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Chưa có media nào được upload
              </p>
              <p className="text-xs text-gray-500">
                Click vào vùng này để thêm file
              </p>
            </label>
          )}
        </div>
      </div>
    );
  };

  // DnD Sensors - Simplified to avoid errors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    try {
      const { active, over } = event;

      if (active && over && active.id !== over.id) {
        setShowcaseSections((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            return arrayMove(items, oldIndex, newIndex);
          }
          return items;
        });
      }
    } catch (error) {
      console.error('Drag and drop error:', error);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1001]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Đóng</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="mb-6 text-lg font-semibold leading-6 text-gray-900"
                    >
                      {initialData ? 'Chỉnh sửa dự án' : 'Tạo dự án mới'}
                    </Dialog.Title>

                    <Tab.Group>
                      <Tab.Panels className="mt-6">
                        <Tab.Panel>
                          <form
                            onSubmit={handleSubmit(handleFormSubmit)}
                            className="max-h-[70vh] space-y-8 overflow-y-auto pr-2"
                          >
                            {/* ProjectHero Section */}
                            <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                              <div className="mb-4 flex items-center">
                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                                  <span className="text-sm font-bold text-white">
                                    1
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Thông tin Hero Section
                                </h3>
                              </div>
                              <p className="mb-4 text-sm text-gray-600">
                                Thông tin chính sẽ hiển thị ở phần đầu trang dự
                                án
                              </p>

                              <div className="space-y-4">
                                <div>
                                  <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Tiêu đề dự án{' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    {...register('title')}
                                    placeholder="Nhập tiêu đề dự án..."
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.title.message}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Thông tin meta{' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div className="mb-2 flex gap-2">
                                    <input
                                      type="text"
                                      value={newMetaInfo}
                                      onChange={(e) =>
                                        setNewMetaInfo(e.target.value)
                                      }
                                      onKeyPress={(e) =>
                                        e.key === 'Enter' &&
                                        (e.preventDefault(), addMetaInfo())
                                      }
                                      placeholder="Nhập thông tin meta..."
                                      className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={addMetaInfo}
                                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                      <PlusIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {projectMetaInfo.map((info) => (
                                      <span
                                        key={info}
                                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                      >
                                        {info}
                                        <button
                                          type="button"
                                          onClick={() => removeMetaInfo(info)}
                                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                                        >
                                          <XMarkIcon className="h-3 w-3" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Mỗi thông tin sẽ được hiển thị như một dòng
                                    riêng biệt trong hero section
                                  </p>
                                </div>

                                <div>
                                  <label
                                    htmlFor="projectIntroTitle"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Tiêu đề giới thiệu{' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    {...register('projectIntroTitle')}
                                    placeholder="Nhập tiêu đề giới thiệu..."
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  {errors.projectIntroTitle && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.projectIntroTitle.message}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Mô tả dự án (Hero){' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <textarea
                                    {...register('description')}
                                    rows={3}
                                    placeholder="Mô tả ngắn gọn về dự án cho hero section..."
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.description.message}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Video Hero (Background)
                                  </label>
                                  <div className="mt-1">
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          // Handle file upload
                                          console.log(
                                            'Hero video selected:',
                                            file
                                          );
                                        }
                                      }}
                                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Hỗ trợ: MP4, WebM, MOV. Kích thước tối đa:
                                    50MB
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Showcase Section */}
                            <div className="rounded-lg border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                              <div className="mb-4 flex items-center">
                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                                  <span className="text-sm font-bold text-white">
                                    2
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Quản lý Showcase
                                </h3>
                              </div>
                              <p className="mb-4 text-sm text-gray-600">
                                Tạo và quản lý các section showcase cho dự án
                              </p>

                              {/* Simple Showcase Builder */}
                              <div className="space-y-4">
                                {/* Existing Sections */}
                                <h4 className="mb-3 text-sm font-medium text-gray-900">
                                  Các Section đã tạo ({showcaseSections.length})
                                </h4>
                                {showcaseSections.length > 0 && (
                                  <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                  >
                                    <SortableContext
                                      items={showcaseSections
                                        .filter(
                                          (section) => section && section.id
                                        )
                                        .map((section) => section.id)}
                                      strategy={verticalListSortingStrategy}
                                    >
                                      <div className="space-y-3">
                                        {showcaseSections
                                          .filter(
                                            (section) => section && section.id
                                          )
                                          .map((section, index) => (
                                            <SortableSection
                                              key={section.id}
                                              section={section}
                                              index={index}
                                            />
                                          ))}
                                      </div>
                                    </SortableContext>
                                  </DndContext>
                                )}

                                {/* Add New Section */}
                                <div className="group relative">
                                  <button
                                    type="button"
                                    className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/50 p-6 transition-all hover:border-purple-300 hover:bg-purple-50"
                                  >
                                    <PlusIcon className="h-8 w-8 text-purple-500" />
                                  </button>

                                  {/* Popover Options */}
                                  <div className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:-translate-y-1 group-hover:opacity-100">
                                    <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                                      <div className="grid grid-cols-2 gap-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            addQuickSection('image', 'single')
                                          }
                                          className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                                        >
                                          <PhotoIcon className="h-6 w-6 text-blue-500" />
                                          <span className="mt-1 text-xs text-gray-600">
                                            Hình ảnh
                                          </span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            addQuickSection('video', 'single')
                                          }
                                          className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                                        >
                                          <VideoCameraIcon className="h-6 w-6 text-red-500" />
                                          <span className="mt-1 text-xs text-gray-600">
                                            Video
                                          </span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            addQuickSection(
                                              'flipbook',
                                              'single'
                                            )
                                          }
                                          className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                                        >
                                          <DocumentTextIcon className="h-6 w-6 text-green-500" />
                                          <span className="mt-1 text-xs text-gray-600">
                                            Flipbook
                                          </span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            addQuickSection('text', 'single')
                                          }
                                          className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                                        >
                                          <DocumentTextIcon className="h-6 w-6 text-purple-500" />
                                          <span className="mt-1 text-xs text-gray-600">
                                            Văn bản
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* ProjectCredits Section */}
                            <div className="rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-6">
                              <div className="mb-4 flex items-center">
                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
                                  <span className="text-sm font-bold text-white">
                                    3
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Thông tin Credits
                                </h3>
                              </div>
                              <p className="mb-4 text-sm text-gray-600">
                                Thông tin về team và credits của dự án
                              </p>

                              <div className="space-y-4">
                                <div>
                                  <label
                                    htmlFor="credits.title"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Tiêu đề Credits{' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    {...register('credits.title')}
                                    placeholder="Nhập tiêu đề credits..."
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  {errors.credits?.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.credits.title.message}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label
                                    htmlFor="credits.date"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Ngày tháng{' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="date"
                                    {...register('credits.date')}
                                    className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  {errors.credits?.date && (
                                    <p className="mt-1 text-sm text-red-600">
                                      {errors.credits.date.message}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Credits (mỗi dòng một credit){' '}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <div className="mb-2 flex gap-2">
                                    <input
                                      type="text"
                                      value={newCredit}
                                      onChange={(e) =>
                                        setNewCredit(e.target.value)
                                      }
                                      onKeyPress={(e) =>
                                        e.key === 'Enter' &&
                                        (e.preventDefault(), addCredit())
                                      }
                                      placeholder="Nhập credit..."
                                      className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={addCredit}
                                      className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                      <PlusIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {credits.map((credit) => (
                                      <span
                                        key={credit}
                                        className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"
                                      >
                                        {credit}
                                        <button
                                          type="button"
                                          onClick={() => removeCredit(credit)}
                                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                                        >
                                          <XMarkIcon className="h-3 w-3" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    Mỗi dòng sẽ được hiển thị như một credit
                                    riêng biệt
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Project Settings */}
                            <div className="rounded-lg border border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50 p-6">
                              <div className="mb-4 flex items-center">
                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                                  <span className="text-sm font-bold text-white">
                                    4
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Cài đặt dự án
                                </h3>
                              </div>
                              <p className="mb-4 text-sm text-gray-600">
                                Công nghệ, trạng thái, danh mục và tùy chọn của
                                dự án
                              </p>

                              <div className="space-y-6">
                                {/* Technologies */}
                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Công nghệ sử dụng
                                  </label>
                                  <div className="mb-2 flex gap-2">
                                    <input
                                      type="text"
                                      value={newTechnology}
                                      onChange={(e) =>
                                        setNewTechnology(e.target.value)
                                      }
                                      onKeyPress={(e) =>
                                        e.key === 'Enter' &&
                                        (e.preventDefault(), addTechnology())
                                      }
                                      placeholder="Nhập công nghệ..."
                                      className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={addTechnology}
                                      className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                      <PlusIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {technologies.map((tech) => (
                                      <span
                                        key={tech}
                                        className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                                      >
                                        {tech}
                                        <button
                                          type="button"
                                          onClick={() => removeTechnology(tech)}
                                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                                        >
                                          <XMarkIcon className="h-3 w-3" />
                                        </button>
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Status and Category */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Trạng thái
                                    </label>
                                    <Controller
                                      name="status"
                                      control={control}
                                      defaultValue="draft"
                                      render={({ field }) => (
                                        <Listbox
                                          value={field.value}
                                          onChange={field.onChange}
                                        >
                                          <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                              <span className="block truncate">
                                                {
                                                  statusOptions.find(
                                                    (option) =>
                                                      option.id === field.value
                                                  )?.name
                                                }
                                              </span>
                                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                  className="h-5 w-5 text-gray-400"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            </Listbox.Button>
                                            <Transition
                                              as={Fragment}
                                              leave="transition ease-in duration-100"
                                              leaveFrom="opacity-100"
                                              leaveTo="opacity-0"
                                            >
                                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {statusOptions.map((option) => (
                                                  <Listbox.Option
                                                    key={option.id}
                                                    className={({ active }) =>
                                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                        active
                                                          ? 'bg-gray-100 text-gray-900'
                                                          : 'text-gray-900'
                                                      }`
                                                    }
                                                    value={option.id}
                                                  >
                                                    {({ selected }) => (
                                                      <>
                                                        <span
                                                          className={`block truncate ${
                                                            selected
                                                              ? 'font-medium'
                                                              : 'font-normal'
                                                          }`}
                                                        >
                                                          {option.name}
                                                        </span>
                                                        {selected ? (
                                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                                            <CheckIcon
                                                              className="h-5 w-5"
                                                              aria-hidden="true"
                                                            />
                                                          </span>
                                                        ) : null}
                                                      </>
                                                    )}
                                                  </Listbox.Option>
                                                ))}
                                              </Listbox.Options>
                                            </Transition>
                                          </div>
                                        </Listbox>
                                      )}
                                    />
                                    {errors.status && (
                                      <p className="mt-1 text-sm text-red-600">
                                        {errors.status.message}
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="categoryId"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Danh mục
                                    </label>
                                    <input
                                      type="text"
                                      {...register('categoryId')}
                                      placeholder="Nhập tên danh mục..."
                                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.categoryId && (
                                      <p className="mt-1 text-sm text-red-600">
                                        {errors.categoryId.message}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Featured Option */}
                                <div>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      {...register('featured')}
                                      className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                                    />
                                    <span className="ml-2 block text-sm text-gray-900">
                                      Dự án nổi bật
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* SEO Section */}
                            <div className="rounded-lg border border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50 p-6">
                              <div className="mb-4 flex items-center">
                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                                  <span className="text-sm font-bold text-white">
                                    5
                                  </span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Thông tin SEO
                                </h3>
                              </div>
                              <p className="mb-4 text-sm text-gray-600">
                                Tối ưu hóa cho công cụ tìm kiếm
                              </p>

                              <div className="space-y-6">
                                {/* Basic SEO */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    Thông tin cơ bản
                                  </h4>

                                  <div>
                                    <label
                                      htmlFor="seo.title"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      SEO Title
                                    </label>
                                    <input
                                      type="text"
                                      {...register('seo.title')}
                                      placeholder="Tiêu đề SEO..."
                                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="seo.description"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      SEO Description
                                    </label>
                                    <textarea
                                      {...register('seo.description')}
                                      rows={3}
                                      placeholder="Mô tả SEO..."
                                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      SEO Keywords
                                    </label>
                                    <div className="mb-2 flex gap-2">
                                      <input
                                        type="text"
                                        value={newKeyword}
                                        onChange={(e) =>
                                          setNewKeyword(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                          e.key === 'Enter' &&
                                          (e.preventDefault(), addKeyword())
                                        }
                                        placeholder="Nhập keyword..."
                                        className="flex-1 rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      />
                                      <button
                                        type="button"
                                        onClick={addKeyword}
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                      >
                                        <PlusIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {watch('seo.keywords')?.map(
                                        (keyword, index) => (
                                          <span
                                            key={index}
                                            className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
                                          >
                                            {keyword}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeKeyword(index)
                                              }
                                              className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                                            >
                                              <XMarkIcon className="h-3 w-3" />
                                            </button>
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Open Graph */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    Open Graph (Social Media)
                                  </h4>

                                  <div>
                                    <label
                                      htmlFor="seo.ogTitle"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      OG Title
                                    </label>
                                    <input
                                      type="text"
                                      {...register('seo.ogTitle')}
                                      placeholder="Tiêu đề cho social media..."
                                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="seo.ogDescription"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      OG Description
                                    </label>
                                    <textarea
                                      {...register('seo.ogDescription')}
                                      rows={2}
                                      placeholder="Mô tả cho social media..."
                                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      OG Type
                                    </label>
                                    <Controller
                                      name="seo.ogType"
                                      control={control}
                                      render={({ field }) => (
                                        <Listbox
                                          value={field.value || ''}
                                          onChange={field.onChange}
                                        >
                                          <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                              <span className="block truncate">
                                                {field.value || 'Chọn loại...'}
                                              </span>
                                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                  className="h-5 w-5 text-gray-400"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            </Listbox.Button>
                                            <Transition
                                              as={Fragment}
                                              leave="transition ease-in duration-100"
                                              leaveFrom="opacity-100"
                                              leaveTo="opacity-0"
                                            >
                                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {[
                                                  {
                                                    id: '',
                                                    name: 'Chọn loại...',
                                                  },
                                                  {
                                                    id: 'website',
                                                    name: 'Website',
                                                  },
                                                  {
                                                    id: 'article',
                                                    name: 'Article',
                                                  },
                                                  {
                                                    id: 'project',
                                                    name: 'Project',
                                                  },
                                                  {
                                                    id: 'portfolio',
                                                    name: 'Portfolio',
                                                  },
                                                ].map((option) => (
                                                  <Listbox.Option
                                                    key={option.id}
                                                    className={({ active }) =>
                                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                        active
                                                          ? 'bg-gray-100 text-gray-900'
                                                          : 'text-gray-900'
                                                      }`
                                                    }
                                                    value={option.id}
                                                  >
                                                    {({ selected }) => (
                                                      <>
                                                        <span
                                                          className={`block truncate ${
                                                            selected
                                                              ? 'font-medium'
                                                              : 'font-normal'
                                                          }`}
                                                        >
                                                          {option.name}
                                                        </span>
                                                        {selected ? (
                                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                                            <CheckIcon
                                                              className="h-5 w-5"
                                                              aria-hidden="true"
                                                            />
                                                          </span>
                                                        ) : null}
                                                      </>
                                                    )}
                                                  </Listbox.Option>
                                                ))}
                                              </Listbox.Options>
                                            </Transition>
                                          </div>
                                        </Listbox>
                                      )}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      OG Image (Social Media Preview)
                                    </label>
                                    <p className="mb-2 text-xs text-gray-500">
                                      Hình ảnh hiển thị khi chia sẻ trên
                                      Facebook, LinkedIn, Twitter. Khuyến nghị:
                                      1200x630px, tối đa 5MB
                                    </p>
                                    <div className="mt-1">
                                      {watch('seo.ogImage') ? (
                                        <div className="relative">
                                          <img
                                            src={URL.createObjectURL(
                                              watch('seo.ogImage')
                                            )}
                                            alt="OG Image Preview"
                                            className="h-32 w-full rounded-lg object-cover"
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setValue('seo.ogImage', null)
                                            }
                                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                          >
                                            <XMarkIcon className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-gray-400">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file)
                                                setValue('seo.ogImage', file);
                                            }}
                                            className="hidden"
                                          />
                                          <div className="text-center">
                                            <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                              Click để upload OG Image
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              PNG, JPG, WebP (1200x630px)
                                            </p>
                                          </div>
                                        </label>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Twitter Card */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    Twitter Card
                                  </h4>
                                  <p className="text-xs text-gray-500">
                                    Tùy chỉnh hiển thị khi chia sẻ trên Twitter
                                  </p>

                                  <div>
                                    <label
                                      htmlFor="seo.twitterTitle"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Twitter Title
                                    </label>
                                    <input
                                      type="text"
                                      {...register('seo.twitterTitle')}
                                      placeholder="Tiêu đề cho Twitter..."
                                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="seo.twitterDescription"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Twitter Description
                                    </label>
                                    <textarea
                                      {...register('seo.twitterDescription')}
                                      rows={2}
                                      placeholder="Mô tả cho Twitter..."
                                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Twitter Image
                                    </label>
                                    <p className="mb-2 text-xs text-gray-500">
                                      Hình ảnh riêng cho Twitter. Nếu không
                                      upload, sẽ dùng OG Image. Khuyến nghị:
                                      1200x600px, tối đa 5MB
                                    </p>
                                    <div className="mt-1">
                                      {watch('seo.twitterImage') ? (
                                        <div className="relative">
                                          <img
                                            src={URL.createObjectURL(
                                              watch('seo.twitterImage')
                                            )}
                                            alt="Twitter Image Preview"
                                            className="h-32 w-full rounded-lg object-cover"
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setValue('seo.twitterImage', null)
                                            }
                                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                          >
                                            <XMarkIcon className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 hover:border-gray-400">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file)
                                                setValue(
                                                  'seo.twitterImage',
                                                  file
                                                );
                                            }}
                                            className="hidden"
                                          />
                                          <div className="text-center">
                                            <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-600">
                                              Click để upload Twitter Image
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              PNG, JPG, WebP (1200x600px)
                                            </p>
                                          </div>
                                        </label>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Twitter Card Type
                                    </label>
                                    <Controller
                                      name="seo.twitterCard"
                                      control={control}
                                      render={({ field }) => (
                                        <Listbox
                                          value={field.value || ''}
                                          onChange={field.onChange}
                                        >
                                          <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                              <span className="block truncate">
                                                {field.value ||
                                                  'Mặc định (summary)'}
                                              </span>
                                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                  className="h-5 w-5 text-gray-400"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            </Listbox.Button>
                                            <Transition
                                              as={Fragment}
                                              leave="transition ease-in duration-100"
                                              leaveFrom="opacity-100"
                                              leaveTo="opacity-0"
                                            >
                                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {[
                                                  {
                                                    id: '',
                                                    name: 'Mặc định (summary)',
                                                  },
                                                  {
                                                    id: 'summary',
                                                    name: 'Summary',
                                                  },
                                                  {
                                                    id: 'summary_large_image',
                                                    name: 'Summary Large Image',
                                                  },
                                                  { id: 'app', name: 'App' },
                                                  {
                                                    id: 'player',
                                                    name: 'Player',
                                                  },
                                                ].map((option) => (
                                                  <Listbox.Option
                                                    key={option.id}
                                                    className={({ active }) =>
                                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                        active
                                                          ? 'bg-gray-100 text-gray-900'
                                                          : 'text-gray-900'
                                                      }`
                                                    }
                                                    value={option.id}
                                                  >
                                                    {({ selected }) => (
                                                      <>
                                                        <span
                                                          className={`block truncate ${
                                                            selected
                                                              ? 'font-medium'
                                                              : 'font-normal'
                                                          }`}
                                                        >
                                                          {option.name}
                                                        </span>
                                                        {selected ? (
                                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                                            <CheckIcon
                                                              className="h-5 w-5"
                                                              aria-hidden="true"
                                                            />
                                                          </span>
                                                        ) : null}
                                                      </>
                                                    )}
                                                  </Listbox.Option>
                                                ))}
                                              </Listbox.Options>
                                            </Transition>
                                          </div>
                                        </Listbox>
                                      )}
                                    />
                                  </div>
                                </div>

                                {/* Advanced SEO */}
                                <div className="space-y-4">
                                  <h4 className="text-sm font-semibold text-gray-800">
                                    Cài đặt nâng cao
                                  </h4>

                                  <div>
                                    <label
                                      htmlFor="seo.canonicalUrl"
                                      className="block text-sm font-medium text-gray-700"
                                    >
                                      Canonical URL
                                    </label>
                                    <input
                                      type="url"
                                      {...register('seo.canonicalUrl')}
                                      placeholder="https://example.com/project-slug"
                                      className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Meta Robots
                                    </label>
                                    <Controller
                                      name="seo.metaRobots"
                                      control={control}
                                      render={({ field }) => (
                                        <Listbox
                                          value={field.value || ''}
                                          onChange={field.onChange}
                                        >
                                          <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                              <span className="block truncate">
                                                {field.value || 'Mặc định'}
                                              </span>
                                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <ChevronUpDownIcon
                                                  className="h-5 w-5 text-gray-400"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            </Listbox.Button>
                                            <Transition
                                              as={Fragment}
                                              leave="transition ease-in duration-100"
                                              leaveFrom="opacity-100"
                                              leaveTo="opacity-0"
                                            >
                                              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {[
                                                  { id: '', name: 'Mặc định' },
                                                  {
                                                    id: 'index,follow',
                                                    name: 'index, follow',
                                                  },
                                                  {
                                                    id: 'noindex,follow',
                                                    name: 'noindex, follow',
                                                  },
                                                  {
                                                    id: 'index,nofollow',
                                                    name: 'index, nofollow',
                                                  },
                                                  {
                                                    id: 'noindex,nofollow',
                                                    name: 'noindex, nofollow',
                                                  },
                                                ].map((option) => (
                                                  <Listbox.Option
                                                    key={option.id}
                                                    className={({ active }) =>
                                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                        active
                                                          ? 'bg-gray-100 text-gray-900'
                                                          : 'text-gray-900'
                                                      }`
                                                    }
                                                    value={option.id}
                                                  >
                                                    {({ selected }) => (
                                                      <>
                                                        <span
                                                          className={`block truncate ${
                                                            selected
                                                              ? 'font-medium'
                                                              : 'font-normal'
                                                          }`}
                                                        >
                                                          {option.name}
                                                        </span>
                                                        {selected ? (
                                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                                                            <CheckIcon
                                                              className="h-5 w-5"
                                                              aria-hidden="true"
                                                            />
                                                          </span>
                                                        ) : null}
                                                      </>
                                                    )}
                                                  </Listbox.Option>
                                                ))}
                                              </Listbox.Options>
                                            </Transition>
                                          </div>
                                        </Listbox>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>

                    {/* Action Buttons */}
                    <div className="mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto"
                        onClick={handleSubmit(handleFormSubmit)}
                      >
                        {isLoading
                          ? 'Đang lưu...'
                          : initialData
                            ? 'Cập nhật'
                            : 'Tạo dự án'}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleClose}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
