import { useEffect, useRef, useState } from 'react';
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { type InsightFormData } from '@/lib/validations/insight';

interface ContentSectionProps {
  register: UseFormRegister<InsightFormData>;
  watch: UseFormWatch<InsightFormData>;
  control: any;
  errors: any;
  setValue: UseFormSetValue<InsightFormData>;
}

// No need for global window declaration with react-email-editor

export default function ContentSection({
  register,
  watch,
  control,
  errors,
  setValue,
}: ContentSectionProps) {
  const emailEditorRef = useRef<EditorRef>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const content = watch('content');

  // Handle editor ready event
  const onReady = (unlayer: any) => {
    setEditorReady(true);

    // Set initial content to ensure form validation passes (only for new insights)
    if (!content && emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.exportHtml((data: any) => {
        const contentData = {
          design: data.design,
          html: data.html,
        };
        setValue('content', JSON.stringify(contentData), {
          shouldValidate: true,
        });
      });
    }
  };

  // Handle design changes
  const onDesignLoad = () => {
    console.log('Design loaded');
  };

  // Auto-save on design changes
  const saveDesign = () => {
    if (emailEditorRef.current?.editor) {
      emailEditorRef.current.editor.exportHtml((data: any) => {
        const contentData = {
          design: data.design,
          html: data.html,
        };
        setValue('content', JSON.stringify(contentData), {
          shouldValidate: true,
        });
      });
    }
  };

  // Manual save with visual feedback
  const handleManualSave = () => {
    setIsSaving(true);
    saveDesign();
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  // Load existing content when editor is ready
  useEffect(() => {
    if (editorReady && content && emailEditorRef.current?.editor) {
      try {
        const contentData = JSON.parse(content);

        // Check if content has the new format with design and html
        const design = contentData.design || contentData; // Fallback for old format

        if (design && Object.keys(design).length > 0) {
          emailEditorRef.current.editor.loadDesign(design);
        } else {
          console.warn('No valid design found in content');
        }
      } catch (e) {
        console.warn('Could not parse existing content:', e);
        console.warn('Content value:', content);
      }
    }
  }, [content, editorReady]);
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Nội dung</h3>
              <p className="mt-1 text-sm text-gray-600">
                Tạo nội dung insight bằng React Email Editor
              </p>
            </div>
          </div>

          {/* Save button moved to top right */}
          <button
            type="button"
            onClick={handleManualSave}
            disabled={isSaving}
            className={`inline-flex items-center rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSaving
                ? 'border-green-200 bg-green-50 text-green-700 focus:ring-green-100'
                : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-100'
            }`}
          >
            {isSaving ? 'Đã lưu' : 'Lưu thiết kế'}
          </button>
        </div>
      </div>

      {/* React Email Editor */}
      <div className="overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm">
        <EmailEditor
          ref={emailEditorRef}
          onReady={onReady}
          onLoad={onDesignLoad}
          style={{ height: '800px', width: '100%' }}
          options={{
            projectId: process.env.NEXT_PUBLIC_UNLAYER_PROJECT_ID
              ? parseInt(process.env.NEXT_PUBLIC_UNLAYER_PROJECT_ID)
              : undefined,
            displayMode: 'email',
            appearance: {
              theme: 'light',
              panels: {
                tools: {
                  dock: 'right',
                },
              },
            },
          }}
        />
      </div>

      {/* Hidden input for form validation */}
      <input type="hidden" {...register('content')} />
      {errors.content && (
        <p className="mt-2 flex items-center text-sm text-red-600">
          <span className="mr-1">⚠️</span>
          {errors.content.message}
        </p>
      )}
    </div>
  );
}
