import React from 'react';
import {
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
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

interface ShowcaseSectionProps {
  showcaseSections: any[];
  setShowcaseSections: React.Dispatch<React.SetStateAction<any[]>>;
  onLogout?: () => void;
}

// SortableSection Component
const SortableSection = ({
  section,
  index,
  setShowcaseSections,
  onLogout,
}: {
  section: any;
  index: number;
  setShowcaseSections: React.Dispatch<React.SetStateAction<any[]>>;
  onLogout?: () => void;
}) => {
  if (!section || !section.id) {
    return null;
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
      )} p-4 shadow-lg transition-all duration-150 ease-out md:p-6 ${
        isDragging ? 'rotate-1 scale-95 opacity-50' : ''
      }`}
    >
      {/* Trash button placed top-right */}
      <div className="absolute right-3 top-3 z-20">
        <button
          type="button"
          onClick={() => {
            setShowcaseSections((prevSections) =>
              prevSections.filter((s) => s.id !== section.id)
            );
          }}
          className="h-9 rounded-md bg-red-50 px-3 text-red-600 transition hover:bg-red-500 hover:text-white"
          aria-label="Xóa section"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Layout: mobile stacked, md grid */}
      <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
        {/* Drag Handle / Icon */}
        <div className="mb-3 flex items-center justify-start md:mb-0 md:justify-center">
          <div
            {...attributes}
            {...listeners}
            className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-lg bg-white/70 text-gray-700 shadow-sm md:mr-0"
            title="Kéo để sắp xếp"
            style={{ pointerEvents: 'auto' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Header row: title + meta */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex w-full items-start space-x-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/60 shadow-sm backdrop-blur-sm">
                {getTypeIcon(section.type)}
              </div>

              <div className="w-full min-w-0">
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
                  className="w-full rounded-md border-gray-300 bg-transparent pb-1 text-base font-semibold text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Nhập tên section..."
                />
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm">
                    {section.type}
                  </span>
                  <select
                    value={section.layout}
                    onChange={(e) => {
                      setShowcaseSections((prevSections) =>
                        prevSections.map((s) =>
                          s.id === section.id
                            ? { ...s, layout: e.target.value as any['layout'] }
                            : s
                        )
                      );
                    }}
                    className="rounded-full border-none bg-white/60 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="single">Đơn</option>
                    <option value="half-half">1/2 - 1/2</option>
                    <option value="one-third">1/3 - 2/3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Media Preview */}
          {section.items &&
            section.items.length > 0 &&
            section.items.some(
              (item: any) => item.src || item.url || item.uploadId || item.file
            ) && (
              <div className="mt-3 rounded-md bg-white/60 p-3 backdrop-blur-sm">
                <div className="space-y-2">
                  {section.items
                    .filter(
                      (item: any) =>
                        item.src || item.url || item.uploadId || item.file
                    )
                    .map((item: any, idx: number) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center">
                          <div>
                            <p className="block max-w-[12rem] truncate text-sm font-medium text-gray-900">
                              {item.title || 'Uploaded file'}
                              {section.items.length > 1 ? ` (${idx + 1})` : ''}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.size
                                ? formatFileSize(item.size)
                                : 'Unknown size'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.uploadId ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              ✓ Đã tải lên
                            </span>
                          ) : item.file ? (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Sẵn sàng
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                              Có sẵn
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setShowcaseSections((prevSections) =>
                                prevSections.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        items: s.items.filter(
                                          (it: any) => it.id !== item.id
                                        ),
                                      }
                                    : s
                                )
                              );
                            }}
                            className="rounded p-1 text-red-500 hover:text-red-700"
                            aria-label="Xóa item"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Upload inputs area (responsive) */}
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* First input */}
            {!section.items.some(
              (item: any) =>
                item.order === 0 &&
                (item.src || item.url || item.uploadId || item.file)
            ) && (
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  {section.layout === 'half-half'
                    ? '(50%)'
                    : section.layout === 'one-third'
                      ? '(33%)'
                      : ''}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id={`file-input-${section.id}-1`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setShowcaseSections((prevSections) => {
                          const updatedSections = prevSections.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  items: [
                                    {
                                      id: `item-${Date.now()}`,
                                      type:
                                        section.type === 'flipbook'
                                          ? 'flipbook'
                                          : section.type === 'video'
                                            ? 'video'
                                            : 'image',
                                      title: file.name,
                                      src: URL.createObjectURL(file),
                                      alt: file.name,
                                      size: file.size,
                                      width: 1300,
                                      height: 800,
                                      order: 0,
                                      file: file,
                                    },
                                  ],
                                }
                              : s
                          );

                          return updatedSections;
                        });
                      }
                    }}
                    accept={
                      section.type === 'image'
                        ? 'image/*'
                        : section.type === 'video'
                          ? 'video/*'
                          : section.type === 'flipbook'
                            ? 'application/pdf'
                            : '*'
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <label
                    htmlFor={`file-input-${section.id}-1`}
                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Chọn tệp
                  </label>
                </div>
              </div>
            )}

            {/* Second input */}
            {(section.layout === 'half-half' ||
              section.layout === 'one-third') &&
              !section.items.some(
                (item: any) => item.order === 1 && item.file
              ) && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">
                    {section.layout === 'half-half' ? '(50%)' : '(67%)'}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id={`file-input-${section.id}-2`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setShowcaseSections((prevSections) =>
                            prevSections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    items: [
                                      ...s.items,
                                      {
                                        id: `item-${Date.now()}`,
                                        type:
                                          section.type === 'flipbook'
                                            ? 'flipbook'
                                            : section.type === 'video'
                                              ? 'video'
                                              : 'image',
                                        title: file.name,
                                        src: URL.createObjectURL(file),
                                        alt: file.name,
                                        size: file.size,
                                        width:
                                          section.layout === 'half-half'
                                            ? (s.items[0]?.width || 1300) -
                                              Math.floor(
                                                (s.items[0]?.width || 1300) / 2
                                              )
                                            : section.layout === 'one-third'
                                              ? (s.items[0]?.width || 1300) -
                                                Math.floor(
                                                  (s.items[0]?.width || 1300) /
                                                    3
                                                )
                                              : 1300,
                                        height: s.items[0]?.height || 800,
                                        order: 1,
                                        file: file,
                                      },
                                    ],
                                  }
                                : s
                            )
                          );
                        }
                      }}
                      accept={
                        section.type === 'image'
                          ? 'image/*'
                          : section.type === 'video'
                            ? 'video/*'
                            : section.type === 'flipbook'
                              ? 'application/pdf'
                              : '*'
                      }
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <label
                      htmlFor={`file-input-${section.id}-2`}
                      className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Chọn tệp thứ 2
                    </label>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ShowcaseSection({
  showcaseSections,
  setShowcaseSections,
  onLogout,
}: ShowcaseSectionProps) {
  // DnD Sensors
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

  const addQuickSection = (type: any['type'], layout: any['layout']) => {
    const newSection: any = {
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
          src: '',
          alt: '',
          size: 0,
          width: 1300,
          height: 800,
          order: 0,
        },
      ],
      order: showcaseSections.length,
    };
    setShowcaseSections([...showcaseSections, newSection]);
  };

  return (
    <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-6 shadow-sm">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-sm">
          <span className="text-sm font-bold text-white">2</span>
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
                .filter((section) => section && section.id)
                .map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {showcaseSections
                  .filter((section) => section && section.id)
                  .map((section, index) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      index={index}
                      setShowcaseSections={setShowcaseSections}
                      onLogout={onLogout}
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
                  onClick={() => addQuickSection('image', 'single')}
                  className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                >
                  <PhotoIcon className="h-6 w-6 text-blue-500" />
                  <span className="mt-1 text-xs text-gray-600">Hình ảnh</span>
                </button>
                <button
                  type="button"
                  onClick={() => addQuickSection('video', 'single')}
                  className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                >
                  <VideoCameraIcon className="h-6 w-6 text-red-500" />
                  <span className="mt-1 text-xs text-gray-600">Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => addQuickSection('flipbook', 'single')}
                  className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                >
                  <DocumentTextIcon className="h-6 w-6 text-green-500" />
                  <span className="mt-1 text-xs text-gray-600">Flipbook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
