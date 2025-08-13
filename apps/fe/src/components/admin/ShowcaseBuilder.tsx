import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
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
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { type ShowcaseSection, type ShowcaseItem } from '@/types/project';

interface ShowcaseBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sections: ShowcaseSection[]) => void;
  projectId?: number;
  initialSections?: ShowcaseSection[];
}

interface SortableSectionProps {
  section: ShowcaseSection;
  onEdit: (section: ShowcaseSection) => void;
  onDelete: (id: string) => void;
  onUploadMedia: (sectionId: string, file: File) => void;
}

const SortableSection = ({
  section,
  onEdit,
  onDelete,
  onUploadMedia,
}: SortableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="h-5 w-5" />;
      case 'video':
        return <VideoCameraIcon className="h-5 w-5" />;
      case 'text':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'flipbook':
        return <DocumentTextIcon className="h-5 w-5" />;
      default:
        return <PhotoIcon className="h-5 w-5" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadMedia(section.id, file);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-3 rounded-lg border bg-white p-4 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          {getSectionIcon(section.type)}
          <div>
            <h4 className="font-medium text-gray-900">{section.title}</h4>
            <p className="text-sm text-gray-500">
              {section.type} • {section.layout}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Media Upload */}
          <div className="relative">
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
              onChange={handleFileUpload}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Upload Media
            </button>
          </div>
          <button
            onClick={() => onEdit(section)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Chỉnh sửa
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="text-red-600 hover:text-red-800"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Media Preview */}
      {section.items.length > 0 && section.items[0].src && (
        <div className="ml-8 mt-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Media:</span>
            <span className="text-sm font-medium text-gray-900">
              {section.items[0].title || 'Uploaded file'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ShowcaseBuilder({
  isOpen,
  onClose,
  onSave,
  projectId,
  initialSections = [],
}: ShowcaseBuilderProps) {
  const [sections, setSections] = useState<ShowcaseSection[]>(initialSections);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load showcase data when projectId changes
  useEffect(() => {
    if (isOpen && projectId) {
      loadShowcaseData();
    }
  }, [isOpen, projectId]);

  const loadShowcaseData = async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/projects/${projectId}/showcase`);
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Error loading showcase data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addSection = (
    type: ShowcaseSection['type'],
    layout: ShowcaseSection['layout']
  ) => {
    const newSection: ShowcaseSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      type,
      layout,
      items: [],
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const editSection = (section: ShowcaseSection) => {
    // Simple inline editing - just update the title
    const newTitle = prompt('Nhập tên section:', section.title);
    if (newTitle && newTitle.trim()) {
      setSections(
        sections.map((s) =>
          s.id === section.id ? { ...s, title: newTitle.trim() } : s
        )
      );
    }
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const uploadMedia = (sectionId: string, file: File) => {
    // Create a new item with the uploaded file
    const newItem: ShowcaseItem = {
      id: `item-${Date.now()}`,
      type: 'image', // Will be determined by file type
      title: file.name,
      src: URL.createObjectURL(file), // Temporary URL for preview
      order: 0,
    };

    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: [newItem] } // Replace existing items with new one
          : s
      )
    );
  };

  const handleSave = () => {
    // Update order based on current array position
    const updatedSections = sections.map((section, index) => ({
      ...section,
      order: index,
    }));
    onSave(updatedSections);
    onClose();
  };

  const handleClose = () => {
    setSections(initialSections);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
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
                      Xây dựng Project Showcase
                    </Dialog.Title>

                    {isLoading ? (
                      <div className="py-8 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-sm text-gray-600">
                          Đang tải showcase...
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Add Section Buttons */}
                        <div className="mb-6">
                          <h4 className="mb-3 text-sm font-medium text-gray-900">
                            Thêm Section mới:
                          </h4>
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <button
                              type="button"
                              onClick={() => addSection('image', 'single')}
                              className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:border-indigo-300 hover:bg-indigo-50"
                            >
                              <PhotoIcon className="h-6 w-6 text-gray-400" />
                              <span className="mt-1 text-xs text-gray-600">
                                Hình ảnh
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => addSection('video', 'single')}
                              className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:border-indigo-300 hover:bg-indigo-50"
                            >
                              <VideoCameraIcon className="h-6 w-6 text-gray-400" />
                              <span className="mt-1 text-xs text-gray-600">
                                Video
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => addSection('flipbook', 'single')}
                              className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:border-indigo-300 hover:bg-indigo-50"
                            >
                              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                              <span className="mt-1 text-xs text-gray-600">
                                Flipbook
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={() => addSection('text', 'single')}
                              className="flex flex-col items-center rounded-lg border border-gray-200 p-3 hover:border-indigo-300 hover:bg-indigo-50"
                            >
                              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                              <span className="mt-1 text-xs text-gray-600">
                                Văn bản
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Sections List with Drag & Drop */}
                        <div className="mb-6">
                          <h4 className="mb-3 text-sm font-medium text-gray-900">
                            Các Section ({sections.length}):
                          </h4>
                          {sections.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                              <PhotoIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                              <p>
                                Chưa có section nào. Hãy thêm section đầu tiên!
                              </p>
                            </div>
                          ) : (
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={handleDragEnd}
                            >
                              <SortableContext
                                items={sections.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                              >
                                {sections.map((section) => (
                                  <SortableSection
                                    key={section.id}
                                    section={section}
                                    onEdit={editSection}
                                    onDelete={deleteSection}
                                    onUploadMedia={uploadMedia}
                                  />
                                ))}
                              </SortableContext>
                            </DndContext>
                          )}
                        </div>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto"
                      >
                        Lưu Showcase
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
