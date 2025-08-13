# Project Creation Setup Guide

Hướng dẫn setup và sử dụng tính năng tạo dự án với authentication, chunked upload và showcase sections.

## 🚀 Tính năng đã hoàn thành

### ✅ Authentication System

- Tái sử dụng login layout từ e-profile upload
- JWT token authentication với Strapi
- Session management và auto cleanup
- Protected admin routes

### ✅ Chunked Upload System

- Hỗ trợ file lớn đến 100MB
- Chunk size 3MB (có thể tùy chỉnh)
- Progress tracking
- Multiple file types support (images, videos, PDFs)

### ✅ Project Creation API

- RESTful API endpoint cho project creation
- File upload integration với chunked upload
- Showcase sections với media files
- Validation và error handling
- Strapi integration

### ✅ Admin Interface

- Form validation với React Hook Form
- File upload components với progress tracking
- Showcase sections builder
- Preview functionality
- Responsive design

## 🛠️ Setup Instructions

### 1. Environment Variables

Tạo file `.env.local`:

```bash
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=https://joyful-basket-ea764d9c28.strapiapp.com/api
STRAPI_API_TOKEN=your-strapi-token

# Upload Configuration
MAX_FILE_SIZE=104857600  # 100MB in bytes
CHUNK_SIZE=3145728      # 3MB in bytes

NODE_ENV=development
```

### 2. Strapi Content Type Setup

### 1. Create/Update Projects Content Type

In Strapi admin panel, go to **Content-Type Builder** → **Projects** and add these fields:

#### Required Fields:

- `title` (Text) - Required
- `description` (Rich Text) - Required
- `projectIntroTitle` (Text) - Required
- `status` (Enumeration) - Values: `draft`, `in-progress`, `completed`
- `featured` (Boolean) - Default: false

#### Optional Fields:

- `content` (Rich Text)
- `slug` (UID) - Target field: title
- `technologies` (JSON)
- `overview` (Rich Text)
- `challenge` (Rich Text)
- `solution` (Rich Text)
- `categoryId` (Number)
- `results` (JSON)
- `metrics` (JSON)
- `seo` (JSON)
- `projectMetaInfo` (JSON)
- `credits` (JSON)

#### Media Fields:

- `featuredImage` (Media) - Single file
- `gallery` (Media) - Multiple files
- `heroVideo` (Media) - Single file
- `thumbnail` (Media) - Single file

#### Upload ID Fields (for chunked upload):

- `featuredImageUploadId` (Text)
- `galleryUploadIds` (JSON)
- `heroVideoUploadId` (Text)
- `thumbnailUploadId` (Text)

#### Showcase Sections Field:

- `showcaseSections` (JSON) - This field stores the showcase sections data with layout information and media files

### 2. Field Structure for showcaseSections

The `showcaseSections` field should accept JSON data with this structure:

```json
[
  {
    "id": "section-1234567890",
    "title": "Design Process",
    "type": "image",
    "layout": "half-half",
    "items": [
      {
        "id": "item-1234567890",
        "type": "image",
        "title": "Design Process Step 1",
        "src": "uploadId_or_url",
        "alt": "Design Process Step 1",
        "width": 1300,
        "height": 800,
        "order": 0
      },
      {
        "id": "item-1234567891",
        "type": "image",
        "title": "Design Process Step 2",
        "src": "uploadId_or_url",
        "alt": "Design Process Step 2",
        "width": 1300,
        "height": 800,
        "order": 1
      }
    ],
    "order": 0
  }
]
```

### 3. Supported Layout Types

The showcase sections support the following layout types:

- **`single`**: Display one item (full width)
- **`grid`**: Display items in a grid with configurable columns (`gridCols`)
- **`masonry`**: Display items in a masonry layout
- **`carousel`**: Display items in a carousel/slider
- **`half-half`**: Split screen into two equal parts (50% - 50%)
- **`one-third`**: Split screen into two parts (33% - 67%)

### 4. Media File Support

Showcase sections support various media types:

- **Images**: JPG, PNG, WebP, etc.
- **Videos**: MP4, WebM, etc.
- **Flipbooks**: PDF files
- **Text**: Rich text content

### 5. Permissions Setup

Go to **Settings** → **Users & Permissions Plugin** → **Roles** → **Authenticated** and enable:

- **Projects**: Create, Read, Update, Delete
- **Upload**: Upload files
- **Media Library**: Upload files

### 6. Upload Directory

Tạo thư mục uploads trong project root:

```bash
mkdir uploads
```

Thêm vào `.gitignore`:

```gitignore
# Uploads
uploads/
```

## 📁 File Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthLayout.tsx              # Reusable auth layout
│   └── admin/
│       ├── ProjectFormPage.tsx         # Main form component
│       ├── forms/                      # Form sections
│       │   ├── HeroSection.tsx         # Hero section form
│       │   ├── ShowcaseSection.tsx     # Showcase section form
│       │   ├── CreditsSection.tsx      # Credits section form
│       │   ├── ProjectSettingsSection.tsx # Project settings
│       │   └── SeoSection.tsx          # SEO settings
├── pages/
│   ├── admin/projects/
│   │   └── create.tsx                  # Create project page
│   └── api/
│       ├── admin/projects/
│       │   ├── index.ts                # Legacy project creation API
│       │   └── create-from-chunks.ts   # New project creation API with media upload
│       ├── upload-chunk.ts             # Chunk upload handler
│       └── create-file-from-chunks.ts  # File assembly API
├── utils/
│   └── project-media-upload.ts         # Media upload utilities
├── types/
│   ├── project.ts                      # Project type definitions
│   └── strapi.ts                       # Strapi type definitions
└── lib/
    └── validations/
        └── project.ts                  # Form validation schema
```

## 🔧 API Endpoints

### 1. Create Project (New - with Media Upload)

```
POST /api/admin/projects/create-from-chunks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Project Title",
  "description": "Project Description",
  "projectIntroTitle": "Project Introduction",
  "heroVideoUploadId": "upload_id",
  "thumbnailUploadId": "upload_id",
  "featuredImageUploadId": "upload_id",
  "galleryUploadIds": ["upload_id1", "upload_id2"],
  "showcaseUploadIds": ["upload_id1", "upload_id2"],
  "originalHeroVideoName": "video.mp4",
  "originalThumbnailName": "thumbnail.jpg",
  "originalFeaturedImageName": "featured.jpg",
  "originalGalleryNames": ["image1.jpg", "image2.jpg"],
  "showcase": [
    {
      "id": "section-1",
      "title": "Design Process",
      "layout": "half-half",
      "items": [
        {
          "id": "item-1",
          "type": "image",
          "title": "Step 1",
          "src": "upload_id_or_url",
          "alt": "Design Step 1",
          "width": 1300,
          "height": 800,
          "order": 0
        }
      ],
      "order": 0
    }
  ],
  // ... other fields
}
```

### 2. Create Project (Legacy)

```
POST /api/admin/projects
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Project Title",
  "description": "Project Description",
  "featuredImageUploadId": "upload_id",
  "thumbnailUploadId": "upload_id",
  "heroVideoUploadId": "upload_id",
  "galleryUploadIds": ["upload_id1", "upload_id2"],
  // ... other fields
}
```

### 3. Upload Chunk

```
POST /api/upload-chunk
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

{
  "chunk": <file-chunk>,
  "chunkNumber": 0,
  "totalChunks": 10,
  "filename": "image.jpg",
  "uploadId": "unique_upload_id"
}
```

### 4. Create File from Chunks

```
POST /api/create-file-from-chunks
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "uploadId": "unique_upload_id",
  "originalFileName": "image.jpg",
  "uploadPath": "projects/featured"
}
```

## 🎯 Usage Guide

### 1. Access Admin Panel

Truy cập `/admin/projects/create` để tạo dự án mới.

### 2. Authentication

- Đăng nhập với email và password đã được cấp quyền
- Token sẽ được lưu trong localStorage
- Tự động redirect nếu chưa đăng nhập

### 3. Create Project

1. **Fill Basic Information**
   - Title, description, content
   - Project intro title
   - Technologies, status, category

2. **Upload Media Files**
   - Featured image (optional)
   - Thumbnail (optional)
   - Hero video (optional)
   - Gallery images (multiple)

3. **Configure Showcase Sections**
   - Add showcase sections with different layouts
   - Upload media files for each section
   - Configure layout types (single, grid, masonry, carousel, half-half, one-third)
   - Set up items with proper dimensions and content

4. **Configure SEO**
   - Meta title, description
   - Keywords
   - Open Graph settings

5. **Add Credits**
   - Project manager
   - Team members
   - Date

### 6. File Upload Process

1. **Select File**: Chọn file từ local storage
2. **Validation**: Kiểm tra size và type
3. **Chunk Upload**: Tải lên từng chunk 3MB
4. **Progress Tracking**: Hiển thị tiến trình
5. **File Assembly**: Ghép các chunk thành file hoàn chỉnh
6. **Strapi Upload**: Tải file lên Strapi media library

### 7. Showcase Sections Process

1. **Create Section**: Tạo showcase section với layout type
2. **Add Items**: Thêm items vào section
3. **Upload Media**: Upload media files cho từng item
4. **Configure Layout**: Thiết lập layout parameters (gridCols, colSpan, etc.)
5. **Preview**: Xem preview trước khi lưu
6. **Save**: Lưu section vào project

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **File Validation**: Size và type checking
- **Chunked Upload**: Prevents timeout cho file lớn
- **Error Handling**: Comprehensive error messages
- **Session Management**: Auto cleanup và logout

## 🚀 Performance Optimizations

- **Chunked Upload**: Hỗ trợ file lớn
- **Progress Tracking**: Real-time upload progress
- **Lazy Loading**: Components load khi cần
- **Error Recovery**: Retry mechanism cho failed chunks
- **Media Optimization**: Automatic image/video optimization
- **Showcase Rendering**: Efficient layout rendering với memoization

## 🐛 Troubleshooting

### Upload Fails

- Kiểm tra file size limit
- Đảm bảo file type được hỗ trợ
- Kiểm tra network connection

### Authentication Error

- Token expired - đăng nhập lại
- Kiểm tra Strapi permissions
- Verify environment variables

### API Errors

- Kiểm tra Strapi server status
- Verify API endpoints
- Check request payload format

### Showcase Issues

- Kiểm tra layout type được hỗ trợ
- Verify media files được upload đúng cách
- Check showcase data structure
- Ensure proper item dimensions

## 🚀 Production Deployment

### 1. Environment Setup

- Update `NEXT_PUBLIC_STRAPI_URL` cho production
- Configure production Strapi instance
- Set up proper file storage (AWS S3, Cloudinary)

### 2. File Storage

- Configure external storage cho uploads
- Set up CDN cho media files
- Implement backup strategy

### 3. Security Enhancements

- Add rate limiting
- Implement CSRF protection
- Set up monitoring và logging

### 4. Showcase Optimization

- Optimize media files for web delivery
- Implement lazy loading cho showcase sections
- Set up proper caching cho showcase data

## 📊 Monitoring

- Track upload success rates
- Monitor API response times
- Log authentication attempts
- Monitor file storage usage
- Track showcase section performance
- Monitor media file delivery metrics

## 🎯 Key Features Summary

### ✅ **Media Upload System**

- Chunked upload cho file lớn (lên đến 100MB)
- Progress tracking real-time
- Support multiple file types (images, videos, PDFs)
- Automatic file optimization

### ✅ **Showcase Sections**

- 6 layout types: single, grid, masonry, carousel, half-half, one-third
- Media file integration
- Responsive design
- Preview functionality

### ✅ **Authentication & Security**

- JWT token authentication
- Session management
- Protected admin routes
- Comprehensive error handling

### ✅ **API Integration**

- RESTful API endpoints
- Strapi CMS integration
- File storage management
- Data validation

Tính năng này cung cấp một hệ thống hoàn chỉnh để tạo và quản lý dự án với authentication mạnh mẽ, khả năng upload file lớn và showcase sections linh hoạt.
