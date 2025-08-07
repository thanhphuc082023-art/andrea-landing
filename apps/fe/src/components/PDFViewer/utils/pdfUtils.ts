/**
 * Utility functions for PDF processing and optimization
 */

export interface PDFPageData {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  imageData: string;
  width: number;
  height: number;
}

export interface PDFRenderOptions {
  scale?: number;
  quality?: number;
  format?: 'jpeg' | 'png';
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Load PDF.js library dynamically
 */
export const loadPDFJS = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
      // Configure worker
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
      setTimeout(resolve, 100);
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });
};

/**
 * Render a PDF page to canvas with optimization
 */
export const renderPDFPage = async (
  page: any,
  pageNumber: number,
  options: PDFRenderOptions = {}
): Promise<PDFPageData> => {
  const {
    scale = 2,
    quality = 0.9,
    format = 'jpeg',
    maxWidth = 1200,
    maxHeight = 1600,
  } = options;

  let viewport = page.getViewport({ scale });

  // Optimize viewport size for mobile
  if (viewport.width > maxWidth || viewport.height > maxHeight) {
    const scaleX = maxWidth / viewport.width;
    const scaleY = maxHeight / viewport.height;
    const optimizedScale = Math.min(scaleX, scaleY) * scale;
    viewport = page.getViewport({ scale: optimizedScale });
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to get canvas context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  const imageData = canvas.toDataURL(
    format === 'jpeg' ? 'image/jpeg' : 'image/png',
    quality
  );

  return {
    pageNumber,
    canvas,
    imageData,
    width: viewport.width,
    height: viewport.height,
  };
};

/**
 * Get optimal render settings based on device capabilities
 */
export const getOptimalRenderSettings = (): PDFRenderOptions => {
  const isMobile = window.innerWidth < 768;
  const isHighDPI = window.devicePixelRatio > 1.5;

  if (isMobile) {
    return {
      scale: isHighDPI ? 2 : 1.5,
      quality: 0.85,
      format: 'jpeg',
      maxWidth: 800,
      maxHeight: 1200,
    };
  }

  return {
    scale: isHighDPI ? 2.5 : 2,
    quality: 0.9,
    format: 'jpeg',
    maxWidth: 1200,
    maxHeight: 1600,
  };
};

/**
 * Create a thumbnail version of a PDF page
 */
export const createThumbnail = async (
  page: any,
  pageNumber: number,
  maxSize: number = 150
): Promise<PDFPageData> => {
  const viewport = page.getViewport({ scale: 1 });
  const scale = Math.min(maxSize / viewport.width, maxSize / viewport.height);

  return renderPDFPage(page, pageNumber, {
    scale,
    quality: 0.7,
    format: 'jpeg',
  });
};
