import { useEffect, useRef, useState, useCallback } from 'react';
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { type InsightFormData } from '@/lib/validations/insight';
import { uploadEditorImage, getStrapiToken } from '@/utils/editor-image-upload';
import { EDITOR_CONFIG, UPLOAD_CONFIG } from '@/constants/editor';

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
  const [isSaving, setIsSaving] = useState(false);
  const content = watch('content');

  // Optimized image upload handler
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const token = getStrapiToken();
    const result = await uploadEditorImage(file, {
      token: token || undefined,
      path: UPLOAD_CONFIG.DEFAULT_PATH,
    });
    return result.url;
  }, []);

  // Handle loading existing design
  const handleLoadDesign = useCallback(() => {
    if (emailEditorRef.current?.editor && content) {
      try {
        const contentData = JSON.parse(content);
        const design = contentData.design || contentData; // Fallback for old format

        if (design && Object.keys(design).length > 0) {
          emailEditorRef.current.editor.loadDesign(design);
        } else {
          console.warn('No valid design found in content');
        }
      } catch (e) {
        console.warn('Could not parse existing content:', e);
      }
    }
  }, [content]);

  // Handle editor ready event
  const onReady = useCallback(
    (unlayer: any) => {
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
    },
    [setValue]
  );

  // Common upload callback handler
  const createUploadCallback = useCallback(() => {
    return (file: { accepted: File[] }, done: Function) => {
      done({ progress: 0 });
      handleImageUpload(file?.accepted?.[0])
        .then((url: string) => done({ progress: 100, url }))
        .catch((error: any) => {
          console.error('Upload error:', error);
          done({ progress: 0, url: null });
        });
    };
  }, [handleImageUpload]);

  const onLoad = useCallback(() => {
    handleLoadDesign();
    if (emailEditorRef.current?.editor) {
      try {
        if (
          typeof emailEditorRef.current.editor.registerCallback === 'function'
        ) {
          emailEditorRef.current.editor.registerCallback(
            'image',
            createUploadCallback()
          );
        }
      } catch (error) {
        console.error('Error setting up onLoad upload handler:', error);
      }
    }
  }, [handleLoadDesign, createUploadCallback]);

  const saveDesign = useCallback(() => {
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
  }, [setValue]);

  // Manual save with visual feedback
  const handleManualSave = useCallback(() => {
    setIsSaving(true);
    saveDesign();
    setTimeout(() => setIsSaving(false), 1000);
  }, [saveDesign]);

  // Load existing content when editor is ready
  useEffect(() => {
    handleLoadDesign();
  }, [handleLoadDesign]);

  // Setup custom upload handler after editor is ready
  useEffect(() => {
    const setupCustomUpload = () => {
      if (emailEditorRef.current?.editor) {
        try {
          if (
            typeof emailEditorRef.current.editor.registerCallback === 'function'
          ) {
            emailEditorRef.current.editor.registerCallback(
              'image',
              createUploadCallback()
            );
          }
        } catch (error) {
          console.error('Error setting up custom upload:', error);
        }
      }
    };

    const timer = setTimeout(setupCustomUpload, 3000);
    return () => clearTimeout(timer);
  }, [createUploadCallback]);

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
        {/* <EmailEditor
          ref={emailEditorRef}
          onReady={onReady}
          onLoad={onLoad}
          style={{ height: EDITOR_CONFIG.HEIGHT, width: '100%' }}
          projectId={EDITOR_CONFIG.PROJECT_ID}
          options={{
            displayMode: EDITOR_CONFIG.DISPLAY_MODE,
            features: EDITOR_CONFIG.FEATURES,
            id: EDITOR_CONFIG.ID,
          }}
        /> */}
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
