# Adaptive PDF Viewer

Hệ thống PDF viewer thích ứng với thiết bị, sử dụng công nghệ khác nhau cho desktop và mobile để tối ưu trải nghiệm người dùng.

## 🎯 Tính năng

### Desktop (≥768px)

- **3D FlipBook**: Sử dụng Three.js để tạo hiệu ứng lật trang 3D
- **Chế độ hai trang**: Hiển thị như sách thật
- **Zoom và pan**: Phóng to/thu nhỏ và di chuyển trang
- **Điều khiển đầy đủ**: Toolbar với các nút điều hướng
- **Fullscreen**: Chế độ toàn màn hình

### Mobile (<768px)

- **KeenSlider**: Slider mượt mà với touch gestures
- **Trang đơn**: Hiển thị từng trang một cho mobile
- **Touch-friendly**: Điều khiển được tối ưu cho cảm ứng
- **Page indicators**: Chỉ báo trang hiện tại
- **Responsive**: Tự động điều chỉnh kích thước

## 📦 Cấu trúc

```
src/components/PDFViewer/
├── AdaptivePDFViewer.tsx      # Component chính - tự động chọn viewer
├── PDFDesktopViewer.tsx       # Desktop viewer (3D FlipBook)
├── PDFMobileViewer.tsx        # Mobile viewer (KeenSlider)
├── PDFMobileViewer.module.css # Styles cho mobile viewer
├── hooks/
│   └── useIsMobile.ts         # Hook detect mobile device
├── utils/
│   └── pdfUtils.ts           # Utilities cho PDF processing
└── index.ts                   # Export file
```

## 🚀 Cách sử dụng

### 1. Import component

```tsx
import { AdaptivePDFViewer } from '@/components/PDFViewer';
```

### 2. Sử dụng trong JSX

```tsx
function MyComponent() {
  return (
    <div className="h-screen w-full">
      <AdaptivePDFViewer pdfUrl="/path/to/your/file.pdf" />
    </div>
  );
}
```

### 3. Sử dụng riêng biệt (nếu cần)

```tsx
// Chỉ desktop
import { PDFDesktopViewer } from '@/components/PDFViewer';

// Chỉ mobile
import { PDFMobileViewer } from '@/components/PDFViewer';

// Hook detect mobile
import { useIsMobile } from '@/components/PDFViewer';
```

## ⚙️ Cấu hình

### Desktop Viewer Options

Desktop viewer sử dụng 3D FlipBook với các tùy chọn:

- **Double page mode**: Luôn bật cho desktop
- **Zoom controls**: Có thể zoom in/out
- **Full screen**: Hỗ trợ chế độ toàn màn hình
- **Navigation**: Điều hướng với mouse và keyboard

### Mobile Viewer Options

Mobile viewer có thể tùy chỉnh:

```tsx
// Tùy chỉnh render quality
const renderOptions = {
  scale: 2, // Độ phân giải
  quality: 0.9, // Chất lượng JPEG (0-1)
  format: 'jpeg', // jpeg hoặc png
  maxWidth: 800, // Chiều rộng tối đa
  maxHeight: 1200, // Chiều cao tối đa
};
```

## 🎨 Customization

### Thay đổi breakpoint

```tsx
// Sử dụng breakpoint khác
const { isMobile } = useIsMobile(1024); // 1024px thay vì 768px
```

### Custom styling cho mobile

Chỉnh sửa `PDFMobileViewer.module.css`:

```css
.controlsContainer {
  /* Tùy chỉnh controls */
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
}

.navButton {
  /* Tùy chỉnh navigation buttons */
  background: #007bff;
}
```

## 🔧 Dependencies

### Required packages:

- `keen-slider`: Slider cho mobile
- `next`: Next.js framework
- `react`: React library

### External libraries (loaded dynamically):

- **Desktop**: jQuery, Three.js, PDF.js, html2canvas, 3dflipbook
- **Mobile**: PDF.js (CDN)

## 📱 Responsive Behavior

| Screen Size | Viewer Type | Features                                |
| ----------- | ----------- | --------------------------------------- |
| ≥768px      | Desktop     | 3D FlipBook, Double page, Full controls |
| <768px      | Mobile      | Slider, Single page, Touch controls     |

## ⚡ Performance

### Desktop

- Lazy loading của 3D FlipBook scripts
- Dynamic imports để tránh bundle bloat
- Efficient 3D rendering với Three.js

### Mobile

- PDF pages được render thành images
- Lazy loading của PDF.js
- Optimized image quality cho mobile
- Memory-efficient page management

## 🐛 Troubleshooting

### PDF không load được

1. Kiểm tra đường dẫn PDF
2. Đảm bảo PDF accessible từ client
3. Kiểm tra CORS policy
4. Xem console để debug

### Performance issues

1. Giảm `scale` trong render options
2. Sử dụng format `jpeg` thay vì `png`
3. Giảm `quality` xuống 0.8 hoặc thấp hơn
4. Limit số trang hiển thị page indicators

### Styling issues

1. Kiểm tra CSS conflicts
2. Đảm bảo container có height cố định
3. Sử dụng CSS modules để tránh conflicts

## 📄 Example Usage

```tsx
'use client';

import { AdaptivePDFViewer } from '@/components/PDFViewer';

export default function DocumentViewer() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Document Viewer</h1>
      </header>

      <main className="h-[calc(100vh-80px)]">
        <AdaptivePDFViewer pdfUrl="/documents/sample.pdf" />
      </main>
    </div>
  );
}
```

## 🔄 Migration từ MinimalFlipBook

Thay thế:

```tsx
// Cũ
import MinimalFlipBook from '@/components/MinimalFlipBook';
<MinimalFlipBook pdfUrl={pdfUrl} />;

// Mới
import { AdaptivePDFViewer } from '@/components/PDFViewer';
<AdaptivePDFViewer pdfUrl={pdfUrl} />;
```
