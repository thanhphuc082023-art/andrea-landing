import { MAX_PDF_SIZE, MAX_THUMBNAIL_SIZE } from '@/constants/app';

export function getStrapiMediaUrl(media: any): string | undefined {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';

  const url =
    media?.data?.attributes?.url || media?.data?.url || media?.url || '';

  if (!url) return undefined;
  // Nếu đã là absolute URL thì trả về luôn
  if (url.startsWith('http')) return url;
  // Nếu là relative URL thì nối baseUrl
  return `${baseUrl}${url}`;
}

// Helper function to validate file inputs
export const validateInputs = (
  pdfFile: any,
  title: string,
  thumbnailFile?: any
) => {
  if (!pdfFile || !title) {
    return {
      isValid: false,
      error:
        !pdfFile && !title
          ? 'Thiếu tệp PDF và tiêu đề'
          : !pdfFile
            ? 'Thiếu tệp PDF'
            : 'Thiếu tiêu đề',
      message: 'Missing required fields: pdfFile, title',
      status: 400,
    };
  }

  if (pdfFile.mimetype !== 'application/pdf') {
    return {
      isValid: false,
      error: 'Loại tệp không hợp lệ. Chỉ chấp nhận tệp PDF.',
      message: 'Invalid file type. Only PDF files are allowed.',
      status: 400,
    };
  }

  if (pdfFile.size > MAX_PDF_SIZE) {
    return {
      isValid: false,
      error: 'Tệp PDF quá lớn. Kích thước tối đa cho phép là 50MB.',
      message: 'PDF file too large. Maximum size is 50MB.',
      status: 413,
    };
  }

  if (thumbnailFile) {
    if (!thumbnailFile.mimetype?.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Loại tệp thumbnail không hợp lệ. Chỉ chấp nhận tệp hình ảnh.',
        message: 'Invalid thumbnail file type. Only image files are allowed.',
        status: 400,
      };
    }

    if (thumbnailFile.size > MAX_THUMBNAIL_SIZE) {
      return {
        isValid: false,
        error: 'Ảnh thumbnail quá lớn. Kích thước tối đa cho phép là 5MB.',
        message: 'Thumbnail file too large. Maximum size is 5MB.',
        status: 413,
      };
    }
  }

  return { isValid: true };
};

// Helper function to parse validation errors
export const getValidationErrorMessage = (errorData: any): string => {
  // Check for detailed validation errors
  const errors = errorData?.error?.details?.errors;

  if (Array.isArray(errors)) {
    const uniqueErrors = errors.filter((err: any) =>
      err.message?.includes('unique')
    );

    if (uniqueErrors.length > 0) {
      const hasTitle = uniqueErrors.some((err: any) =>
        err.path?.includes('title')
      );
      const hasSlug = uniqueErrors.some((err: any) =>
        err.path?.includes('slug')
      );

      if (hasTitle || hasSlug) {
        return 'Tiêu đề đã tồn tại. Vui lòng chọn tiêu đề khác.';
      }
    }
    return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
  }

  // Fallback to simple error message check
  if (errorData.error?.message?.includes('unique')) {
    return 'Tiêu đề đã tồn tại. Vui lòng chọn tiêu đề khác.';
  }

  return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
};

// Helper function to create File object from buffer
export const createFileFromBuffer = (
  buffer: Buffer,
  filename: string,
  type: string
): File => {
  return new File([buffer], filename, { type });
};

// Helper function to get error message based on error type
export const getSystemErrorMessage = (error: Error): string => {
  if (error.message.includes('ECONNREFUSED')) {
    return 'Không thể kết nối tới Strapi server.';
  }
  if (error.message.includes('timeout')) {
    return 'Thời gian xử lý quá lâu. Vui lòng thử lại.';
  }
  if (error.message.includes('ENOTFOUND')) {
    return 'Không tìm thấy server. Vui lòng kiểm tra cấu hình.';
  }
  return 'Lỗi hệ thống. Vui lòng thử lại sau.';
};
