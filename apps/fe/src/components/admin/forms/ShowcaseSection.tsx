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
      case 'text':
        return <DocumentTextIcon className="h-5 w-5 text-purple-500" />;
      case 'image-text':
        return <PhotoIcon className="h-5 w-5 text-indigo-600" />;
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
      case 'image-text':
        return 'from-indigo-50 to-indigo-100 border-indigo-200';
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
      <div className="relative z-10 space-y-2">
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
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center rounded-full bg-white/60 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm">
                    {section.type}
                  </span>
                  <select
                    value={section.layout}
                    onChange={(e) => {
                      const newLayout = e.target.value as any;
                      setShowcaseSections((prevSections) =>
                        prevSections.map((s) =>
                          s.id === section.id
                            ? // If section is text, ensure items array matches layout (single vs two/three columns)
                              {
                                ...s,
                                layout: newLayout,
                                items:
                                  s.type === 'text'
                                    ? // For text: single -> keep only first item; for 2-col layouts ensure two items; for 3-col ensure three items
                                      newLayout === 'single'
                                      ? [
                                          {
                                            ...(s.items[0] || {}),
                                            id:
                                              s.items[0]?.id ||
                                              `item-${Date.now()}`,
                                            title: s.items[0]?.title || '',
                                            description:
                                              s.items[0]?.description || '',
                                            order: 0,
                                          },
                                        ]
                                      : newLayout === 'one-third-equal'
                                        ? [
                                            {
                                              ...(s.items[0] || {}),
                                              id:
                                                s.items[0]?.id ||
                                                `item-${Date.now()}`,
                                              title: s.items[0]?.title || '',
                                              description:
                                                s.items[0]?.description || '',
                                              order: 0,
                                            },
                                            {
                                              ...(s.items[1] || {}),
                                              id:
                                                s.items[1]?.id ||
                                                `item-${Date.now()}-2`,
                                              title: s.items[1]?.title || '',
                                              description:
                                                s.items[1]?.description || '',
                                              order: 1,
                                            },
                                            {
                                              ...(s.items[2] || {}),
                                              id:
                                                s.items[2]?.id ||
                                                `item-${Date.now()}-3`,
                                              title: s.items[2]?.title || '',
                                              description:
                                                s.items[2]?.description || '',
                                              order: 2,
                                            },
                                          ]
                                        : // half-half or one-third: ensure two items
                                          [
                                            {
                                              ...(s.items[0] || {}),
                                              id:
                                                s.items[0]?.id ||
                                                `item-${Date.now()}`,
                                              title: s.items[0]?.title || '',
                                              description:
                                                s.items[0]?.description || '',
                                              order: 0,
                                            },
                                            {
                                              ...(s.items[1] || {}),
                                              id:
                                                s.items[1]?.id ||
                                                `item-${Date.now()}-2`,
                                              title: s.items[1]?.title || '',
                                              description:
                                                s.items[1]?.description || '',
                                              order: 1,
                                            },
                                          ]
                                    : s.items,
                              }
                            : s
                        )
                      );
                    }}
                    className="rounded-full border-none bg-white/60 px-2.5 py-0.5 text-xs font-medium text-gray-700 backdrop-blur-sm focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="single">Single</option>
                    <option value="half-half">1/2 - 1/2</option>
                    <option value="one-third">1/3 - 2/3</option>
                    <option value="one-third-equal">1/3 - 1/3 - 1/3</option>
                    {/* <option value="grid">Grid</option>
                    <option value="carousel">Carousel</option> */}
                  </select>
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
                setShowcaseSections((prevSections) =>
                  prevSections.filter((s) => s.id !== section.id)
                );
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-600 transition-all hover:bg-red-500 hover:text-white"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Text Section Editor */}
        {section.type === 'text' && (
          <div className="mt-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
            <div className="space-y-3">
              {/* Title & Description editors (kept after size controls) */}
              {section.layout === 'single' ? (
                // Single text block
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    value={section.items[0]?.title || ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setShowcaseSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                items:
                                  s.items && s.items.length
                                    ? s.items.map((it, idx) =>
                                        idx === 0 ? { ...it, title: v } : it
                                      )
                                    : [
                                        {
                                          id: `item-${Date.now()}`,
                                          type: 'text',
                                          title: v,
                                          description: '',
                                          width: 1300,
                                          height: 800,
                                          order: 0,
                                        },
                                      ],
                              }
                            : s
                        )
                      );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                    placeholder="Tiêu đề..."
                  />
                  <label className="mt-2 block text-xs font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    value={section.items[0]?.description || ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setShowcaseSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                items:
                                  s.items && s.items.length
                                    ? s.items.map((it, idx) =>
                                        idx === 0
                                          ? { ...it, description: v }
                                          : it
                                      )
                                    : [
                                        {
                                          id: `item-${Date.now()}`,
                                          type: 'text',
                                          title: '',
                                          description: v,
                                          width: 1300,
                                          height: 800,
                                          order: 0,
                                        },
                                      ],
                              }
                            : s
                        )
                      );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                    placeholder="Mô tả..."
                    rows={4}
                  />
                </div>
              ) : section.layout === 'one-third-equal' ? (
                // Three-column text blocks
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium text-gray-700">
                        {i === 0 ? 'Cột 1' : i === 1 ? 'Cột 2' : 'Cột 3'} - Tiêu
                        đề
                      </label>
                      <input
                        type="text"
                        value={section.items[i]?.title || ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setShowcaseSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    items:
                                      s.items && s.items.length >= 3
                                        ? s.items.map((it, idx) =>
                                            idx === i ? { ...it, title: v } : it
                                          )
                                        : // build up to 3 items preserving existing data
                                          [
                                            {
                                              id:
                                                s.items?.[0]?.id ||
                                                `item-${Date.now()}`,
                                              type: 'text',
                                              title:
                                                i === 0
                                                  ? v
                                                  : s.items?.[0]?.title || '',
                                              description:
                                                s.items?.[0]?.description || '',
                                              width:
                                                s.items?.[0]?.width || 1300,
                                              height:
                                                s.items?.[0]?.height || 800,
                                              order: 0,
                                            },
                                            {
                                              id:
                                                s.items?.[1]?.id ||
                                                `item-${Date.now()}-2`,
                                              type: 'text',
                                              title:
                                                i === 1
                                                  ? v
                                                  : s.items?.[1]?.title || '',
                                              description:
                                                s.items?.[1]?.description || '',
                                              width:
                                                s.items?.[1]?.width || 1300,
                                              height:
                                                s.items?.[1]?.height || 800,
                                              order: 1,
                                            },
                                            {
                                              id:
                                                s.items?.[2]?.id ||
                                                `item-${Date.now()}-3`,
                                              type: 'text',
                                              title:
                                                i === 2
                                                  ? v
                                                  : s.items?.[2]?.title || '',
                                              description:
                                                s.items?.[2]?.description || '',
                                              width:
                                                s.items?.[2]?.width || 1300,
                                              height:
                                                s.items?.[2]?.height || 800,
                                              order: 2,
                                            },
                                          ],
                                  }
                                : s
                            )
                          );
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                        placeholder="Tiêu đề..."
                      />
                      <label className="mt-2 block text-xs font-medium text-gray-700">
                        Mô tả
                      </label>
                      <textarea
                        value={section.items[i]?.description || ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setShowcaseSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    items:
                                      s.items && s.items.length >= 3
                                        ? s.items.map((it, idx) =>
                                            idx === i
                                              ? { ...it, description: v }
                                              : it
                                          )
                                        : [
                                            {
                                              id:
                                                s.items?.[0]?.id ||
                                                `item-${Date.now()}`,
                                              type: 'text',
                                              title: s.items?.[0]?.title || '',
                                              description:
                                                i === 0
                                                  ? v
                                                  : s.items?.[0]?.description ||
                                                    '',
                                              width:
                                                s.items?.[0]?.width || 1300,
                                              height:
                                                s.items?.[0]?.height || 800,
                                              order: 0,
                                            },
                                            {
                                              id:
                                                s.items?.[1]?.id ||
                                                `item-${Date.now()}-2`,
                                              type: 'text',
                                              title: s.items?.[1]?.title || '',
                                              description:
                                                i === 1
                                                  ? v
                                                  : s.items?.[1]?.description ||
                                                    '',
                                              width:
                                                s.items?.[1]?.width || 1300,
                                              height:
                                                s.items?.[1]?.height || 800,
                                              order: 1,
                                            },
                                            {
                                              id:
                                                s.items?.[2]?.id ||
                                                `item-${Date.now()}-3`,
                                              type: 'text',
                                              title: s.items?.[2]?.title || '',
                                              description:
                                                i === 2
                                                  ? v
                                                  : s.items?.[2]?.description ||
                                                    '',
                                              width:
                                                s.items?.[2]?.width || 1300,
                                              height:
                                                s.items?.[2]?.height || 800,
                                              order: 2,
                                            },
                                          ],
                                  }
                                : s
                            )
                          );
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                        rows={4}
                        placeholder="Mô tả..."
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Two-column text blocks (left / right)
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1].map((i) => (
                    <div key={i}>
                      <label className="block text-xs font-medium text-gray-700">
                        {i === 0 ? 'Trái' : 'Phải'} - Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={section.items[i]?.title || ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setShowcaseSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    items:
                                      s.items && s.items.length >= 2
                                        ? s.items.map((it, idx) =>
                                            idx === i ? { ...it, title: v } : it
                                          )
                                        : i === 0
                                          ? [
                                              {
                                                id:
                                                  s.items?.[0]?.id ||
                                                  `item-${Date.now()}`,
                                                type: 'text',
                                                title: v,
                                                description:
                                                  s.items?.[0]?.description ||
                                                  '',
                                                width:
                                                  s.items?.[0]?.width || 1300,
                                                height:
                                                  s.items?.[0]?.height || 800,
                                                order: 0,
                                              },
                                              {
                                                id:
                                                  s.items?.[1]?.id ||
                                                  `item-${Date.now()}-2`,
                                                type: 'text',
                                                title: '',
                                                description: '',
                                                width:
                                                  s.items?.[1]?.width || 1300,
                                                height:
                                                  s.items?.[1]?.height || 800,
                                                order: 1,
                                              },
                                            ]
                                          : [
                                              {
                                                id:
                                                  s.items?.[0]?.id ||
                                                  `item-${Date.now()}`,
                                                type: 'text',
                                                title:
                                                  s.items?.[0]?.title || '',
                                                description:
                                                  s.items?.[0]?.description ||
                                                  '',
                                                width:
                                                  s.items?.[0]?.width || 1300,
                                                height:
                                                  s.items?.[0]?.height || 800,
                                                order: 0,
                                              },
                                              {
                                                id:
                                                  s.items?.[1]?.id ||
                                                  `item-${Date.now()}-2`,
                                                type: 'text',
                                                title: v,
                                                description:
                                                  s.items?.[1]?.description ||
                                                  '',
                                                width:
                                                  s.items?.[1]?.width || 1300,
                                                height:
                                                  s.items?.[1]?.height || 800,
                                                order: 1,
                                              },
                                            ],
                                  }
                                : s
                            )
                          );
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                        placeholder="Tiêu đề..."
                      />
                      <label className="mt-2 block text-xs font-medium text-gray-700">
                        Mô tả
                      </label>
                      <textarea
                        value={section.items[i]?.description || ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setShowcaseSections((prev) =>
                            prev.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    items:
                                      s.items && s.items.length >= 2
                                        ? s.items.map((it, idx) =>
                                            idx === i
                                              ? { ...it, description: v }
                                              : it
                                          )
                                        : i === 0
                                          ? [
                                              {
                                                id:
                                                  s.items?.[0]?.id ||
                                                  `item-${Date.now()}`,
                                                type: 'text',
                                                title:
                                                  s.items?.[0]?.title || '',
                                                description: v,
                                                width: 1300,
                                                height: 800,
                                                order: 0,
                                              },
                                              {
                                                id:
                                                  s.items?.[1]?.id ||
                                                  `item-${Date.now()}-2`,
                                                type: 'text',
                                                title: '',
                                                description: '',
                                                width: 1300,
                                                height: 800,
                                                order: 1,
                                              },
                                            ]
                                          : [
                                              {
                                                id:
                                                  s.items?.[0]?.id ||
                                                  `item-${Date.now()}`,
                                                type: 'text',
                                                title:
                                                  s.items?.[0]?.title || '',
                                                description:
                                                  s.items?.[0]?.description ||
                                                  '',
                                                width: 1300,
                                                height: 800,
                                                order: 0,
                                              },
                                              {
                                                id:
                                                  s.items?.[1]?.id ||
                                                  `item-${Date.now()}-2`,
                                                type: 'text',
                                                title:
                                                  s.items?.[1]?.title || '',
                                                description: v,
                                                width: 1300,
                                                height: 800,
                                                order: 1,
                                              },
                                            ],
                                  }
                                : s
                            )
                          );
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                        rows={4}
                        placeholder="Mô tả..."
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Width/Height controls for text sections */}
              {section.layout === 'single' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Chiều ngang (px)
                    </label>
                    <input
                      type="number"
                      value={section.items[0]?.width || ''}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || 0;
                        setShowcaseSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  items:
                                    s.items && s.items.length
                                      ? s.items.map((it, idx) =>
                                          idx === 0 ? { ...it, width: v } : it
                                        )
                                      : [
                                          {
                                            id: `item-${Date.now()}`,
                                            type: 'text',
                                            title: '',
                                            description: '',
                                            width: v,
                                            height: 800,
                                            order: 0,
                                          },
                                        ],
                                }
                              : s
                          )
                        );
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm"
                      placeholder="1300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Chiều cao (px)
                    </label>
                    <input
                      type="number"
                      value={section.items[0]?.height || ''}
                      onChange={(e) => {
                        const v = parseInt(e.target.value) || 0;
                        setShowcaseSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  items:
                                    s.items && s.items.length
                                      ? s.items.map((it, idx) =>
                                          idx === 0 ? { ...it, height: v } : it
                                        )
                                      : [
                                          {
                                            id: `item-${Date.now()}`,
                                            type: 'text',
                                            title: '',
                                            description: '',
                                            width: 1300,
                                            height: v,
                                            order: 0,
                                          },
                                        ],
                                }
                              : s
                          )
                        );
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm"
                      placeholder="800"
                    />
                  </div>
                </div>
              ) : section.layout === 'one-third-equal' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Tổng chiều ngang (px) - Chia đều 3 cột
                    </label>
                    <input
                      type="number"
                      value={section.items[0]?.width || ''}
                      onChange={(e) => {
                        const totalWidth = parseInt(e.target.value) || 0;
                        const w1 = Math.floor(totalWidth / 3);
                        const w2 = Math.floor(totalWidth / 3);
                        const w3 = totalWidth - w1 - w2;
                        setShowcaseSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  items:
                                    s.items && s.items.length >= 3
                                      ? s.items.map((it, idx) =>
                                          idx === 0
                                            ? { ...it, width: w1 }
                                            : idx === 1
                                              ? { ...it, width: w2 }
                                              : idx === 2
                                                ? { ...it, width: w3 }
                                                : it
                                        )
                                      : [
                                          {
                                            id:
                                              s.items?.[0]?.id ||
                                              `item-${Date.now()}`,
                                            type: 'text',
                                            title: s.items?.[0]?.title || '',
                                            description:
                                              s.items?.[0]?.description || '',
                                            width: w1,
                                            height: s.items?.[0]?.height || 800,
                                            order: 0,
                                          },
                                          {
                                            id:
                                              s.items?.[1]?.id ||
                                              `item-${Date.now()}-2`,
                                            type: 'text',
                                            title: s.items?.[1]?.title || '',
                                            description:
                                              s.items?.[1]?.description || '',
                                            width: w2,
                                            height: s.items?.[1]?.height || 800,
                                            order: 1,
                                          },
                                          {
                                            id:
                                              s.items?.[2]?.id ||
                                              `item-${Date.now()}-3`,
                                            type: 'text',
                                            title: s.items?.[2]?.title || '',
                                            description:
                                              s.items?.[2]?.description || '',
                                            width: w3,
                                            height: s.items?.[2]?.height || 800,
                                            order: 2,
                                          },
                                        ],
                                }
                              : s
                          )
                        );
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm"
                      placeholder="1300"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Sẽ chia:{' '}
                      {Math.floor((section.items[0]?.width || 1300) / 3)}px +{' '}
                      {Math.floor((section.items[0]?.width || 1300) / 3)}px +{' '}
                      {(section.items[0]?.width || 1300) -
                        Math.floor((section.items[0]?.width || 1300) / 3) * 2}
                      px
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Chiều cao chung (px) - Áp dụng cho cả 3
                    </label>
                    <input
                      type="number"
                      value={section.items[0]?.height || ''}
                      onChange={(e) => {
                        const sharedHeight = parseInt(e.target.value) || 0;
                        setShowcaseSections((prev) =>
                          prev.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  items:
                                    s.items && s.items.length >= 3
                                      ? s.items.map((it) => ({
                                          ...it,
                                          height: sharedHeight,
                                        }))
                                      : [
                                          {
                                            id:
                                              s.items?.[0]?.id ||
                                              `item-${Date.now()}`,
                                            type: 'text',
                                            title: s.items?.[0]?.title || '',
                                            description:
                                              s.items?.[0]?.description || '',
                                            width: s.items?.[0]?.width || 1300,
                                            height: sharedHeight,
                                            order: 0,
                                          },
                                          {
                                            id:
                                              s.items?.[1]?.id ||
                                              `item-${Date.now()}-2`,
                                            type: 'text',
                                            title: s.items?.[1]?.title || '',
                                            description:
                                              s.items?.[1]?.description || '',
                                            width: s.items?.[1]?.width || 1300,
                                            height: sharedHeight,
                                            order: 1,
                                          },
                                          {
                                            id:
                                              s.items?.[2]?.id ||
                                              `item-${Date.now()}-3`,
                                            type: 'text',
                                            title: s.items?.[2]?.title || '',
                                            description:
                                              s.items?.[2]?.description || '',
                                            width: s.items?.[2]?.width || 1300,
                                            height: sharedHeight,
                                            order: 2,
                                          },
                                        ],
                                }
                              : s
                          )
                        );
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm"
                      placeholder="800"
                    />
                  </div>

                  {/* Preview */}
                  <div className="rounded-md bg-gray-50 p-2">
                    <p className="mb-1 text-xs font-medium text-gray-700">
                      Kích thước preview:
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        • Cột 1:{' '}
                        {Math.floor(
                          (section.items[0]?.width || 1300) /
                            (section.layout === 'half-half' ? 2 : 3)
                        )}
                        px × {section.items[0]?.height || 800}px
                      </div>
                      {section.items[1] && (
                        <div className="text-xs text-gray-600">
                          • Cột 2:{' '}
                          {(section.items[0]?.width || 1300) -
                            Math.floor(
                              (section.items[0]?.width || 1300) /
                                (section.layout === 'half-half' ? 2 : 3)
                            )}
                          px ×{' '}
                          {section.items[1]?.height ||
                            section.items[0]?.height ||
                            800}
                          px
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Half-half and one-third layouts - shared dimensions
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Tổng chiều ngang (px) -{' '}
                      {section.layout === 'half-half'
                        ? 'Chia 50% - 50%'
                        : 'Chia 33% - 67%'}
                    </label>
                    <input
                      type="number"
                      value={section.items[0]?.width || ''}
                      onChange={(e) => {
                        const totalWidth = parseInt(e.target.value) || 0;
                        const firstItemWidth =
                          section.layout === 'half-half'
                            ? Math.floor(totalWidth / 2)
                            : Math.floor(totalWidth / 3);
                        const secondItemWidth = totalWidth - firstItemWidth;

                        setShowcaseSections((prevSections) =>
                          prevSections.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  items:
                                    s.items && s.items.length >= 2
                                      ? s.items.map((it, idx) =>
                                          idx === 0
                                            ? { ...it, width: firstItemWidth }
                                            : idx === 1
                                              ? {
                                                  ...it,
                                                  width: secondItemWidth,
                                                }
                                              : it
                                        )
                                      : [
                                          {
                                            id:
                                              s.items?.[0]?.id ||
                                              `item-${Date.now()}`,
                                            type: 'text',
                                            title: s.items?.[0]?.title || '',
                                            description:
                                              s.items?.[0]?.description || '',
                                            width: firstItemWidth,
                                            height: s.items?.[0]?.height || 800,
                                            order: 0,
                                          },
                                          {
                                            id:
                                              s.items?.[1]?.id ||
                                              `item-${Date.now()}-2`,
                                            type: 'text',
                                            title: s.items?.[1]?.title || '',
                                            description:
                                              s.items?.[1]?.description || '',
                                            width: secondItemWidth,
                                            height: s.items?.[1]?.height || 800,
                                            order: 1,
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
                    <p className="mt-1 text-xs text-gray-500">
                      Sẽ chia:{' '}
                      {Math.floor(
                        (section.items[0]?.width || 1300) /
                          (section.layout === 'half-half' ? 2 : 3)
                      )}
                      px +{' '}
                      {(section.items[0]?.width || 1300) -
                        Math.floor(
                          (section.items[0]?.width || 1300) /
                            (section.layout === 'half-half' ? 2 : 3)
                        )}
                      px
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Chiều cao chung (px) - Áp dụng cho cả 2
                    </label>
                    <input
                      type="number"
                      value={section.items[0]?.height || ''}
                      onChange={(e) => {
                        const sharedHeight = parseInt(e.target.value) || 0;

                        setShowcaseSections((prevSections) =>
                          prevSections.map((s) =>
                            s.id === section.id
                              ? {
                                  ...s,
                                  items:
                                    s.items && s.items.length >= 2
                                      ? s.items.map((it) => ({
                                          ...it,
                                          height: sharedHeight,
                                        }))
                                      : [
                                          {
                                            id:
                                              s.items?.[0]?.id ||
                                              `item-${Date.now()}`,
                                            type: 'text',
                                            title: s.items?.[0]?.title || '',
                                            description:
                                              s.items?.[0]?.description || '',
                                            width: s.items?.[0]?.width || 1300,
                                            height: sharedHeight,
                                            order: 0,
                                          },
                                          {
                                            id:
                                              s.items?.[1]?.id ||
                                              `item-${Date.now()}-2`,
                                            type: 'text',
                                            title: s.items?.[1]?.title || '',
                                            description:
                                              s.items?.[1]?.description || '',
                                            width: s.items?.[1]?.width || 1300,
                                            height: sharedHeight,
                                            order: 1,
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

                  {/* Preview */}
                  <div className="rounded-md bg-gray-50 p-2">
                    <p className="mb-1 text-xs font-medium text-gray-700">
                      Kích thước preview:
                    </p>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        • Cột 1:{' '}
                        {Math.floor(
                          (section.items[0]?.width || 1300) /
                            (section.layout === 'half-half' ? 2 : 3)
                        )}
                        px × {section.items[0]?.height || 800}px
                      </div>
                      {section.items[1] && (
                        <div className="text-xs text-gray-600">
                          • Cột 2:{' '}
                          {(section.items[0]?.width || 1300) -
                            Math.floor(
                              (section.items[0]?.width || 1300) /
                                (section.layout === 'half-half' ? 2 : 3)
                            )}
                          px ×{' '}
                          {section.items[1]?.height ||
                            section.items[0]?.height ||
                            800}
                          px
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image + Text Section Editor */}
        {section.type === 'image-text' && (
          <div className="mt-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
            <div className="space-y-3">
              <label className="block text-xs font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={section.title || section.items?.[0]?.title || ''}
                onChange={(e) =>
                  setShowcaseSections((prev) =>
                    prev.map((s) =>
                      s.id === section.id ? { ...s, title: e.target.value } : s
                    )
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                placeholder="Tiêu đề..."
              />

              <label className="block text-xs font-medium text-gray-700">
                Subtitle
              </label>
              <input
                type="text"
                value={section.subtitle || ''}
                onChange={(e) =>
                  setShowcaseSections((prev) =>
                    prev.map((s) =>
                      s.id === section.id
                        ? { ...s, subtitle: e.target.value }
                        : s
                    )
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                placeholder="Phụ đề..."
              />

              <label className="block text-xs font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={section.description || ''}
                onChange={(e) =>
                  setShowcaseSections((prev) =>
                    prev.map((s) =>
                      s.id === section.id
                        ? { ...s, description: e.target.value }
                        : s
                    )
                  )
                }
                className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-sm shadow-sm"
                placeholder="Mô tả..."
                rows={4}
              />

              {/* Width/Height controls for Image + Text section */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Chiều ngang (px)
                  </label>
                  <input
                    type="number"
                    value={section.width || ''}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setShowcaseSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id ? { ...s, width: v } : s
                        )
                      );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm"
                    placeholder="1300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Chiều cao (px)
                  </label>
                  <input
                    type="number"
                    value={section.height || ''}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setShowcaseSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id ? { ...s, height: v } : s
                        )
                      );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm"
                    placeholder="800"
                  />
                </div>
              </div>

              {/* Content image width/height controls */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Chiều ngang ảnh nội dung (px)
                  </label>
                  <input
                    type="number"
                    value={section.imageWidth || ''}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setShowcaseSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id ? { ...s, imageWidth: v } : s
                        )
                      );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm"
                    placeholder="650"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Chiều cao ảnh nội dung (px)
                  </label>
                  <input
                    type="number"
                    value={section.imageHeight || ''}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setShowcaseSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id ? { ...s, imageHeight: v } : s
                        )
                      );
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm"
                    placeholder="800"
                  />
                </div>
              </div>

              {/* Position control for content image */}
              <div className="mt-2 flex items-center space-x-3">
                <span className="text-xs font-medium text-gray-700">
                  Vị trí ảnh nội dung:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShowcaseSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id
                            ? { ...s, contentImagePosition: 'left' }
                            : s
                        )
                      )
                    }
                    className={`rounded-md border px-2 py-1 text-xs ${section.contentImagePosition === 'left' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-700'}`}
                  >
                    Trái
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setShowcaseSections((prev) =>
                        prev.map((s) =>
                          s.id === section.id
                            ? { ...s, contentImagePosition: 'right' }
                            : s
                        )
                      )
                    }
                    className={`rounded-md border px-2 py-1 text-xs ${section.contentImagePosition === 'right' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-700'}`}
                  >
                    Phải
                  </button>
                </div>
              </div>

              {/* Image-text media summary (background + content image) - show like media items */}
              {(section.backgroundSrc ||
                section.background?.url ||
                section.imageSrc ||
                section.image?.url) && (
                <div className="mt-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
                  <div className="space-y-3">
                    {/* Background media row */}
                    {(section.backgroundSrc || section.background?.url) && (
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Ảnh nền
                          </p>
                          <p className="text-sm text-gray-600">
                            {section.backgroundAlt ||
                              section.backgroundFile?.name ||
                              'Ảnh nền'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {section.background?.id ||
                          section.backgroundUploadId ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              ✓ Đã tải lên
                            </span>
                          ) : section.backgroundFile ? (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Sẵn sàng
                            </span>
                          ) : null}

                          <button
                            type="button"
                            onClick={() =>
                              setShowcaseSections((prev) =>
                                prev.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        backgroundFile: undefined,
                                        backgroundSrc: undefined,
                                        background: undefined,
                                        backgroundUploadId: undefined,
                                      }
                                    : s
                                )
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Content image media row */}
                    {(section.imageSrc || section.image?.url) && (
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <CheckIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Ảnh nội dung
                          </p>
                          <p className="text-sm text-gray-600">
                            {section.imageAlt ||
                              section.imageFile?.name ||
                              'Ảnh nội dung'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {section.image?.id || section.imageUploadId ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              ✓ Đã tải lên
                            </span>
                          ) : section.imageFile ? (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                              Sẵn sàng
                            </span>
                          ) : null}

                          <button
                            type="button"
                            onClick={() =>
                              setShowcaseSections((prev) =>
                                prev.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        imageFile: undefined,
                                        imageSrc: undefined,
                                        image: undefined,
                                        imageUploadId: undefined,
                                        imageAlt: undefined,
                                      }
                                    : s
                                )
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  id={`bg-input-${section.id}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setShowcaseSections((prevSections) =>
                        prevSections.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                backgroundFile: file,
                                backgroundSrc: URL.createObjectURL(file),
                                backgroundAlt: file.name,
                              }
                            : s
                        )
                      );
                    }
                  }}
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />

                <label
                  htmlFor={`bg-input-${section.id}`}
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-100"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Chọn ảnh nền
                </label>
              </div>

              {/* Content image upload (separate from background) */}
              <div className="relative mt-2">
                <input
                  type="file"
                  id={`content-input-${section.id}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setShowcaseSections((prevSections) =>
                        prevSections.map((s) =>
                          s.id === section.id
                            ? {
                                ...s,
                                imageFile: file,
                                imageSrc: URL.createObjectURL(file),
                                imageAlt: file.name,
                              }
                            : s
                        )
                      );
                    }
                  }}
                  accept="image/*"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />

                <label
                  htmlFor={`content-input-${section.id}`}
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Chọn ảnh nội dung
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Media Preview */}
        {section.items.length > 0 &&
          section.items.some(
            (item) => item.src || item.url || item.uploadId || item.file
          ) && (
            <div className="mt-4 rounded-lg bg-white/60 p-4 backdrop-blur-sm">
              <div className="space-y-3">
                {section.items
                  .filter(
                    (item) => item.src || item.url || item.uploadId || item.file
                  ) // Only show items with source (existing uploads or new files)
                  .map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.title || 'Uploaded file'}{' '}
                          {section.items.length > 1 ? `(${index + 1})` : ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.size
                            ? formatFileSize(item.size)
                            : 'Unknown size'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
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
                                        (_, i) =>
                                          i !==
                                          section.items.findIndex(
                                            (originalItem) =>
                                              originalItem.id === item.id
                                          )
                                      ),
                                    }
                                  : s
                              )
                            );
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Width/Height Inputs - Updated logic for layouts */}
              {section.items.filter(
                (item) => item.src || item.url || item.uploadId || item.file
              ).length > 0 && (
                <div className="mt-3 space-y-3">
                  {section.layout === 'single' ? (
                    // Single layout - individual width/height
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Chiều ngang (px)
                        </label>
                        <input
                          type="number"
                          value={
                            section.items.find(
                              (item) =>
                                item.src ||
                                item.url ||
                                item.uploadId ||
                                item.file
                            )?.width || ''
                          }
                          onChange={(e) => {
                            setShowcaseSections((prevSections) =>
                              prevSections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      items: s.items.map((item, idx) =>
                                        idx === 0
                                          ? {
                                              ...item,
                                              width:
                                                parseInt(e.target.value) || 0,
                                            }
                                          : item
                                      ),
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
                          Chiều cao (px)
                        </label>
                        <input
                          type="number"
                          value={
                            section.items.find(
                              (item) =>
                                item.src ||
                                item.url ||
                                item.uploadId ||
                                item.file
                            )?.height || ''
                          }
                          onChange={(e) => {
                            setShowcaseSections((prevSections) =>
                              prevSections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      items: s.items.map((item, idx) =>
                                        idx === 0
                                          ? {
                                              ...item,
                                              height:
                                                parseInt(e.target.value) || 0,
                                            }
                                          : item
                                      ),
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
                  ) : section.layout === 'one-third-equal' ? (
                    // 3-column shared controls
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Tổng chiều ngang (px) - Chia đều 3 cột
                        </label>
                        <input
                          type="number"
                          value={section.items[0].width || ''}
                          onChange={(e) => {
                            const totalWidth = parseInt(e.target.value) || 0;
                            const w1 = Math.floor(totalWidth / 3);
                            const w2 = Math.floor(totalWidth / 3);
                            const w3 = totalWidth - w1 - w2;

                            setShowcaseSections((prevSections) =>
                              prevSections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      items: s.items.map((item, index) => ({
                                        ...item,
                                        width:
                                          index === 0
                                            ? w1
                                            : index === 1
                                              ? w2
                                              : index === 2
                                                ? w3
                                                : item.width,
                                      })),
                                    }
                                  : s
                              )
                            );
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="1300"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Sẽ chia:{' '}
                          {Math.floor((section.items[0].width || 1300) / 3)}px +{' '}
                          {Math.floor((section.items[0].width || 1300) / 3)}px +{' '}
                          {(section.items[0].width || 1300) -
                            Math.floor((section.items[0].width || 1300) / 3) *
                              2}
                          px
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Chiều cao chung (px) - Áp dụng cho cả 3
                        </label>
                        <input
                          type="number"
                          value={section.items[0].height || ''}
                          onChange={(e) => {
                            const sharedHeight = parseInt(e.target.value) || 0;
                            setShowcaseSections((prevSections) =>
                              prevSections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      items: s.items.map((it) => ({
                                        ...it,
                                        height: sharedHeight,
                                      })),
                                    }
                                  : s
                              )
                            );
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="800"
                        />
                      </div>

                      {/* Preview of dimensions */}
                      <div className="rounded-md bg-gray-50 p-2">
                        <p className="mb-1 text-xs font-medium text-gray-700">
                          Kích thước preview:
                        </p>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            • Item 1 (50%):{' '}
                            {Math.floor((section.items[0].width || 1300) / 2)}px
                            × {section.items[0].height || 800}px
                          </div>
                          {section.items[1] && (
                            <div className="text-xs text-gray-600">
                              • Item 2 (50%):{' '}
                              {Math.floor((section.items[1].width || 1300) / 2)}
                              px × {section.items[1].height || 800}px
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Half-half and one-third layouts - shared dimensions
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Tổng chiều ngang (px) -{' '}
                          {section.layout === 'half-half'
                            ? 'Chia 50% - 50%'
                            : 'Chia 33% - 67%'}
                        </label>
                        <input
                          type="number"
                          value={section.items[0]?.width || ''}
                          onChange={(e) => {
                            const totalWidth = parseInt(e.target.value) || 0;
                            const firstItemWidth =
                              section.layout === 'half-half'
                                ? Math.floor(totalWidth / 2)
                                : Math.floor(totalWidth / 3);
                            const secondItemWidth = totalWidth - firstItemWidth;

                            setShowcaseSections((prevSections) =>
                              prevSections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      items:
                                        s.items && s.items.length >= 2
                                          ? s.items.map((it, idx) =>
                                              idx === 0
                                                ? {
                                                    ...it,
                                                    width: firstItemWidth,
                                                  }
                                                : idx === 1
                                                  ? {
                                                      ...it,
                                                      width: secondItemWidth,
                                                    }
                                                  : it
                                            )
                                          : [
                                              {
                                                id:
                                                  s.items?.[0]?.id ||
                                                  `item-${Date.now()}`,
                                                type: 'text',
                                                title:
                                                  s.items?.[0]?.title || '',
                                                description:
                                                  s.items?.[0]?.description ||
                                                  '',
                                                width: firstItemWidth,
                                                height:
                                                  s.items?.[0]?.height || 800,
                                                order: 0,
                                              },
                                              {
                                                id:
                                                  s.items?.[1]?.id ||
                                                  `item-${Date.now()}-2`,
                                                type: 'text',
                                                title:
                                                  s.items?.[1]?.title || '',
                                                description:
                                                  s.items?.[1]?.description ||
                                                  '',
                                                width: secondItemWidth,
                                                height:
                                                  s.items?.[1]?.height || 800,
                                                order: 1,
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
                        <p className="mt-1 text-xs text-gray-500">
                          Sẽ chia:{' '}
                          {Math.floor(
                            (section.items[0]?.width || 1300) /
                              (section.layout === 'half-half' ? 2 : 3)
                          )}
                          px +{' '}
                          {(section.items[0]?.width || 1300) -
                            Math.floor(
                              (section.items[0]?.width || 1300) /
                                (section.layout === 'half-half' ? 2 : 3)
                            )}
                          px
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Chiều cao chung (px) - Áp dụng cho cả 2
                        </label>
                        <input
                          type="number"
                          value={section.items[0]?.height || ''}
                          onChange={(e) => {
                            const sharedHeight = parseInt(e.target.value) || 0;

                            setShowcaseSections((prevSections) =>
                              prevSections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      items:
                                        s.items && s.items.length >= 2
                                          ? s.items.map((it) => ({
                                              ...it,
                                              height: sharedHeight,
                                            }))
                                          : [
                                              {
                                                id:
                                                  s.items?.[0]?.id ||
                                                  `item-${Date.now()}`,
                                                type: 'text',
                                                title:
                                                  s.items?.[0]?.title || '',
                                                description:
                                                  s.items?.[0]?.description ||
                                                  '',
                                                width:
                                                  s.items?.[0]?.width || 1300,
                                                height: sharedHeight,
                                                order: 0,
                                              },
                                              {
                                                id:
                                                  s.items?.[1]?.id ||
                                                  `item-${Date.now()}-2`,
                                                type: 'text',
                                                title:
                                                  s.items?.[1]?.title || '',
                                                description:
                                                  s.items?.[1]?.description ||
                                                  '',
                                                width:
                                                  s.items?.[1]?.width || 1300,
                                                height: sharedHeight,
                                                order: 1,
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

                      {/* Preview */}
                      <div className="rounded-md bg-gray-50 p-2">
                        <p className="mb-1 text-xs font-medium text-gray-700">
                          Kích thước preview:
                        </p>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-600">
                            • Cột 1:{' '}
                            {Math.floor(
                              (section.items[0]?.width || 1300) /
                                (section.layout === 'half-half' ? 2 : 3)
                            )}
                            px × {section.items[0]?.height || 800}px
                          </div>
                          {section.items[1] && (
                            <div className="text-xs text-gray-600">
                              • Cột 2:{' '}
                              {(section.items[0]?.width || 1300) -
                                Math.floor(
                                  (section.items[0]?.width || 1300) /
                                    (section.layout === 'half-half' ? 2 : 3)
                                )}
                              px ×{' '}
                              {section.items[1]?.height ||
                                section.items[0]?.height ||
                                800}
                              px
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* Upload Area - Show when no file uploaded or when layout needs more items */}
        {/* Hide file upload UI for text sections */}
        {section.type !== 'text' && section.type !== 'image-text' && (
          <div className="mt-4 space-y-3">
            {/* First Item Upload - Hide when already has file */}
            {!section.items.some((item) => item.order === 0 && item.file) && (
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  1.{' '}
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
                                      type: (section.type === 'flipbook'
                                        ? 'flipbook'
                                        : section.type === 'video'
                                          ? 'video'
                                          : 'image') as
                                        | 'image'
                                        | 'video'
                                        | 'text'
                                        | 'flipbook',
                                      title: file.name,
                                      src: URL.createObjectURL(file),
                                      alt: file.name,
                                      size: file.size,
                                      width: 1300,
                                      height: 800,
                                      order: 0,
                                      file: file, // Lưu file object để uploadProjectMedia có thể xử lý
                                    },
                                  ],
                                }
                              : s
                          );

                          return updatedSections;
                        });
                      }
                    }}
                    accept={String(
                      section.type === 'image'
                        ? 'image/*'
                        : section.type === 'video'
                          ? 'video/*'
                          : section.type === 'flipbook'
                            ? 'application/pdf'
                            : '*'
                    )}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <label
                    htmlFor={`file-input-${section.id}-1`}
                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Chọn tệp{' '}
                    {section.type === 'image'
                      ? 'hình ảnh'
                      : section.type === 'video'
                        ? 'video'
                        : section.type === 'flipbook'
                          ? 'PDF'
                          : ''}
                  </label>
                </div>
              </div>
            )}

            {/* Second Item Upload for half-half and one-third layouts - Hide when already has file */}
            {(section.layout === 'half-half' ||
              section.layout === 'one-third' ||
              section.layout === 'one-third-equal') &&
              !section.items.some((item) => item.order === 1 && item.file) && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">
                    2. {section.layout === 'half-half' ? '(50%)' : '(67%)'}
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
                                        type: (section.type === 'flipbook'
                                          ? 'flipbook'
                                          : section.type === 'video'
                                            ? 'video'
                                            : 'image') as
                                          | 'image'
                                          | 'video'
                                          | 'text'
                                          | 'flipbook',
                                        title: file.name,
                                        src: URL.createObjectURL(file),
                                        alt: file.name,
                                        size: file.size,
                                        // Tính toán width dựa trên layout và item đầu tiên
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
                                        // Sử dụng cùng height với item đầu tiên
                                        height: s.items[0]?.height || 800,
                                        order: 1,
                                        file: file, // Lưu file object để uploadProjectMedia có thể xử lý
                                      },
                                    ],
                                  }
                                : s
                            )
                          );
                        }
                      }}
                      accept={String(
                        section.type === 'image'
                          ? 'image/*'
                          : section.type === 'video'
                            ? 'video/*'
                            : section.type === 'flipbook'
                              ? 'application/pdf'
                              : '*'
                      )}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <label
                      htmlFor={`file-input-${section.id}-2`}
                      className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-100"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Chọn tệp{' '}
                      {section.type === 'image'
                        ? 'hình ảnh'
                        : section.type === 'video'
                          ? 'video'
                          : section.type === 'flipbook'
                            ? 'PDF'
                            : ''}{' '}
                      thứ 2
                    </label>
                  </div>
                </div>
              )}

            {/* Third Item Upload for one-third-equal */}
            {section.layout === 'one-third-equal' &&
              !section.items.some((item) => item.order === 2 && item.file) && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-700">
                    3. (33%)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id={`file-input-${section.id}-3`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setShowcaseSections((prevSections) =>
                            prevSections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    items: [
                                      // ensure first two items exist
                                      ...(s.items?.length
                                        ? s.items
                                        : [
                                            {
                                              id: `item-${Date.now()}`,
                                              type:
                                                section.type === 'flipbook'
                                                  ? 'flipbook'
                                                  : section.type === 'video'
                                                    ? 'video'
                                                    : 'image',
                                              title: '',
                                              src: '',
                                              alt: '',
                                              size: 0,
                                              width: 1300,
                                              height: 800,
                                              order: 0,
                                            },
                                          ]),
                                      {
                                        id: `item-${Date.now()}-3`,
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
                                        width: Math.floor(
                                          (s.items?.[0]?.width || 1300) / 3
                                        ),
                                        height: s.items?.[0]?.height || 800,
                                        order: 2,
                                        file: file,
                                      },
                                    ],
                                  }
                                : s
                            )
                          );
                        }
                      }}
                      accept={String(
                        section.type === 'image'
                          ? 'image/*'
                          : section.type === 'video'
                            ? 'video/*'
                            : section.type === 'flipbook'
                              ? 'application/pdf'
                              : '*'
                      )}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <label
                      htmlFor={`file-input-${section.id}-3`}
                      className="flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-100"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Chọn tệp{' '}
                      {section.type === 'image'
                        ? 'hình ảnh'
                        : section.type === 'video'
                          ? 'video'
                          : section.type === 'flipbook'
                            ? 'PDF'
                            : ''}{' '}
                      thứ 3
                    </label>
                  </div>
                </div>
              )}
          </div>
        )}
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
  console.log('showcaseSections', showcaseSections);
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

  const addQuickSection = (type: any, layout: any) => {
    const newSection: any = {
      id: `section-${Date.now()}`,
      type,
      layout,
      title: `Section ${showcaseSections.length + 1}`,
      contentImagePosition: type === 'image-text' ? 'left' : undefined,
      backgroundSrc: undefined,
      imageSrc: undefined,
      items: [
        {
          id: `item-${Date.now()}`,
          type:
            type === 'flipbook'
              ? 'flipbook'
              : type === 'video'
                ? 'video'
                : type === 'text' || type === 'image-text'
                  ? 'text'
                  : 'image',
          title:
            type === 'text' || type === 'image-text'
              ? ''
              : `Item ${showcaseSections.length + 1}`,
          description:
            type === 'text' || type === 'image-text' ? '' : undefined,
          src: type === 'text' ? undefined : '',
          alt: type === 'text' ? undefined : '',
          size: 0,
          width: 1300,
          height: 800,
          order: 0,
        },
      ],
      order: showcaseSections.length,
    };

    // If text type and layout requires 2 columns, add a second empty text item
    if ((type === 'text' || type === 'image-text') && layout !== 'single') {
      newSection.items.push({
        id: `item-${Date.now()}-2`,
        type: 'text',
        title: '',
        description: '',
        order: 1,
      });
    }

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
                <button
                  type="button"
                  onClick={() => addQuickSection('text', 'single')}
                  className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                >
                  <DocumentTextIcon className="h-6 w-6 text-purple-500" />
                  <span className="mt-1 text-xs text-gray-600">Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => addQuickSection('image-text', 'single')}
                  className="flex flex-col items-center rounded-lg border border-gray-200 p-3 transition-colors hover:border-purple-300 hover:bg-purple-50"
                >
                  <PhotoIcon className="h-6 w-6 text-indigo-500" />
                  <span className="mt-1 text-xs text-gray-600">
                    Hình + Text
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
