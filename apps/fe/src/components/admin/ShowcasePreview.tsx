import {
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface ShowcasePreviewProps {
  sections: any[];
}

export default function ShowcasePreview({ sections }: ShowcasePreviewProps) {
  if (sections.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">Chưa có showcase nào được tạo</p>
      </div>
    );
  }

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
        return 'border-blue-200 bg-blue-50';
      case 'video':
        return 'border-red-200 bg-red-50';
      case 'flipbook':
        return 'border-green-200 bg-green-50';
      case 'text':
        return 'border-purple-200 bg-purple-50';
      case 'image-text':
        return 'border-indigo-200 bg-indigo-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      {sections.map((section: any, index: number) => (
        <div
          key={section.id}
          className={`rounded-lg border-2 p-4 shadow-sm ${getTypeColor(section.type)}`}
        >
          <div className="mb-3 flex items-center space-x-3">
            {getTypeIcon(section.type)}
            <div>
              <h4 className="font-medium text-gray-900">
                {section.title || `Section ${index + 1}`}
              </h4>
              <p className="text-sm text-gray-600">
                {section.type} • {section.layout}
              </p>
            </div>
          </div>

          {section.type === 'image-text' ? (
            // Image + Text layout preview
            <div className="rounded bg-white p-3 shadow-sm">
              <div
                className="w-full overflow-hidden rounded-md border shadow-sm"
                style={{
                  backgroundImage: section.backgroundSrc
                    ? `url(${section.backgroundSrc})`
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="bg-white/80">
                  <div className="flex h-40">
                    {section.contentImagePosition === 'right' ? (
                      <>
                        <div className="flex flex-1 items-center p-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">
                              {section.title || 'Tiêu đề'}
                            </h5>
                            {section.subtitle && (
                              <p className="text-xs text-gray-600">
                                {section.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-1/2">
                          <img
                            src={section.imageSrc || section.items?.[0]?.src}
                            alt={
                              section.imageAlt || section.items?.[0]?.alt || ''
                            }
                            className="h-40 w-full object-cover"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-1/2">
                          <img
                            src={section.imageSrc || section.items?.[0]?.src}
                            alt={
                              section.imageAlt || section.items?.[0]?.alt || ''
                            }
                            className="h-40 w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-1 items-center p-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">
                              {section.title || 'Tiêu đề'}
                            </h5>
                            {section.subtitle && (
                              <p className="text-xs text-gray-600">
                                {section.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : section.items.length > 0 && section.items[0].src ? (
            <div className="rounded bg-white p-3 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">
                  {section.items[0].title || 'File đã upload'}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded bg-white p-3 text-center shadow-sm">
              <p className="text-sm text-gray-500">
                Chưa có media nào được upload
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
