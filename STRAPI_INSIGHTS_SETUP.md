# Hướng dẫn Setup Strapi Content Type cho Insights

Hướng dẫn này sẽ giúp bạn tạo content type "Insights" trong Strapi để lưu trữ các bài viết góc nhìn.

## 1. Truy cập Strapi Admin Panel

1. Mở trình duyệt và truy cập vào Strapi admin panel:
   ```
   https://joyful-basket-ea764d9c28.strapiapp.com/admin
   ```

2. Đăng nhập với tài khoản admin của bạn

## 2. Tạo Content Type "Insights"

1. Trong sidebar, click vào **Content-Type Builder**
2. Click **Create new collection type**
3. Nhập tên: `insight` (số ít)
4. Display name sẽ tự động thành `Insight`
5. Click **Continue**

## 3. Thêm các Fields cho Insight

### 3.1 Basic Information Fields

#### Title (Text)
- Field name: `title`
- Type: **Text**
- Advanced settings:
  - Required: ✅
  - Unique: ✅
  - Max length: 200

#### Excerpt (Text)
- Field name: `excerpt`
- Type: **Text**
- Advanced settings:
  - Required: ✅
  - Max length: 500

#### Slug (UID)
- Field name: `slug`
- Type: **UID**
- Attached field: `title`
- Advanced settings:
  - Required: ✅
  - Unique: ✅

#### Category (Text)
- Field name: `category`
- Type: **Text**
- Advanced settings:
  - Required: ✅

#### Status (Enumeration)
- Field name: `status`
- Type: **Enumeration**
- Values:
  - `draft`
  - `published`
- Default value: `draft`

#### Featured (Boolean)
- Field name: `featured`
- Type: **Boolean**
- Default value: `false`

### 3.2 Content Field

#### Content (JSON)
- Field name: `content`
- Type: **JSON**
- Advanced settings:
  - Required: ✅

**Cấu trúc Content JSON:**
```json
{
  "design": {
    // Unlayer design object để load lại editor
    "body": {...},
    "counters": {...},
    "schemaVersion": 16
  },
  "html": "<html>...</html>" // HTML string để hiển thị ở trang detail
}
```

**Lưu ý:** Content field lưu trữ cả design data (để chỉnh sửa) và HTML (để hiển thị).

### 3.3 Author Component

1. Tạo **Component** trước:
   - Click **Create new component**
   - Category: `author`
   - Name: `author-info`
   - Icon: chọn icon phù hợp

2. Thêm fields cho Author component:

#### Author Name (Text)
- Field name: `name`
- Type: **Text**
- Required: ✅

#### Author Role (Text)
- Field name: `role`
- Type: **Text**

#### Author Avatar (Component)
Tạo component con cho avatar:
- Category: `media`
- Name: `file-upload`

Fields cho file-upload component:
- `file` (Media - Single media)
- `name` (Text)
- `url` (Text)

#### Author Avatar URL (Text)
- Field name: `avatarUrl`
- Type: **Text**

3. Quay lại Insight content type và thêm:

#### Author (Component)
- Field name: `author`
- Type: **Component**
- Component: `author.author-info`
- Type of relation: **Single component**

### 3.4 Hero Images Component

1. Tạo component `media.hero-images`:

#### Desktop Hero (Component)
- Field name: `desktop`
- Type: **Component**
- Component: `media.file-upload`

#### Mobile Hero (Component)
- Field name: `mobile`
- Type: **Component**
- Component: `media.file-upload`

2. Thêm vào Insight:

#### Hero (Component)
- Field name: `hero`
- Type: **Component**
- Component: `media.hero-images`
- Type of relation: **Single component**

### 3.5 Thumbnail

#### Thumbnail (Component)
- Field name: `thumbnail`
- Type: **Component**
- Component: `media.file-upload`
- Type of relation: **Single component**

### 3.6 SEO Data (JSON)

#### SEO (JSON)
- Field name: `seo`
- Type: **JSON**
- Required: ❌

**Cấu trúc JSON:**
```json
{
  "metaTitle": "string",
  "metaDescription": "string",
  "keywords": ["string"],
  "canonicalUrl": "string",
  "ogTitle": "string",
  "ogDescription": "string",
  "ogImage": {
    "file": "File object",
    "name": "string",
    "url": "string"
  },
  "twitterTitle": "string",
  "twitterDescription": "string",
  "twitterCard": "summary|summary_large_image|app|player",
  "twitterImage": {
    "file": "File object",
    "name": "string",
    "url": "string"
  },
  "metaRobots": "string",
  "schemaMarkup": "string"
}
```

**Lưu ý:**
- Tất cả thông tin SEO được lưu trong một field JSON duy nhất
- Frontend sẽ xử lý validation và UI
- Dễ dàng mở rộng thêm fields mới mà không cần thay đổi schema Strapi
2. Thêm vào Insight content type:

#### SEO (JSON)
- Field name: `seo`
- Type: **JSON**
- Required: ❌

### 3.7 Collection Info Component

1. Tạo component `collection.info`:

#### Collection Name (Text)
- Field name: `name`
- Type: **Text**

#### Collection Description (Text)
- Field name: `description`
- Type: **Text**

#### Collection Tags (JSON)
- Field name: `tags`
- Type: **JSON**

2. Thêm vào Insight:

#### Collection Info (Component)
- Field name: `collectionInfo`
- Type: **Component**
- Component: `collection.info`
- Type of relation: **Single component**

## 4. Cấu hình Permissions

1. Vào **Settings** > **Users & Permissions Plugin** > **Roles**
2. Click vào **Public**
3. Trong phần **Permissions**, tìm **Insight**
4. Bật các permissions:
   - `find` (để có thể lấy danh sách insights)
   - `findOne` (để có thể lấy chi tiết insight)

5. Click vào **Authenticated**
6. Bật thêm permissions:
   - `create` (để có thể tạo insight mới)
   - `update` (để có thể cập nhật insight)
   - `delete` (để có thể xóa insight)

7. Click **Save** cho mỗi role

## 5. Test API Endpoints

Sau khi setup xong, bạn có thể test các endpoints:

### GET - Lấy danh sách insights
```
GET https://joyful-basket-ea764d9c28.strapiapp.com/api/insights
```

### GET - Lấy chi tiết insight
```
GET https://joyful-basket-ea764d9c28.strapiapp.com/api/insights/:id
```

### POST - Tạo insight mới
```
POST https://joyful-basket-ea764d9c28.strapiapp.com/api/insights
Content-Type: application/json

{
  "data": {
    "title": "Sample Insight",
    "excerpt": "This is a sample insight",
    "category": "Technology",
    "content": {
      "design": {
        "body": {
          "id": "sample-id",
          "rows": [],
          "headers": [],
          "footers": []
        },
        "counters": {
          "u_column": 1,
          "u_row": 1
        },
        "schemaVersion": 16
      },
      "html": "<div>Sample HTML content from Unlayer</div>"
    },
    "status": "draft",
    "featured": false
  }
}
```

## 6. Cấu hình Upload Files

Đảm bảo rằng Strapi đã được cấu hình để upload files:

1. Vào **Settings** > **Media Library**
2. Kiểm tra cấu hình upload
3. Đảm bảo các định dạng file được phép:
   - Images: jpg, jpeg, png, webp
   - Max file size: 10MB

## 7. Troubleshooting

### Lỗi 403 Forbidden
- Kiểm tra lại permissions cho role Public/Authenticated
- Đảm bảo API tokens được cấu hình đúng

### Lỗi 404 Not Found
- Kiểm tra URL endpoint
- Đảm bảo content type đã được tạo và published

### Lỗi Upload File
- Kiểm tra cấu hình media library
- Kiểm tra dung lượng file và định dạng

## 8. Sử dụng Content trong Frontend

### 8.1 Lưu Content từ Unlayer Editor

Trong `ContentSection.tsx`, content được lưu với cấu trúc:
```typescript
const contentData = {
  design: exportData.design, // Để load lại editor
  html: exportData.html       // Để hiển thị ở detail page
};
setValue('content', JSON.stringify(contentData));
```

### 8.2 Load Content vào Editor (Edit Mode)

Khi edit insight, content được parse và load:
```typescript
const contentData = JSON.parse(content);
const design = contentData.design || contentData; // Fallback cho format cũ
unlayerRef.current.loadDesign(design);
```

### 8.3 Hiển thị HTML ở Detail Page

Trong trang detail insight:
```typescript
// Parse content từ API response
const contentData = JSON.parse(insight.content);
const htmlContent = contentData.html;

// Render HTML
<div 
  className="insight-content"
  dangerouslySetInnerHTML={{ __html: htmlContent }}
/>
```

### 8.4 API Response Example

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Sample Insight",
      "content": {
        "design": {
          "body": {...},
          "counters": {...},
          "schemaVersion": 16
        },
        "html": "<div>Rendered HTML content</div>"
      }
    }
  }
}
```

## 9. Kết luận

Sau khi hoàn thành các bước trên, bạn sẽ có:

1. ✅ Content type "Insights" với content field dạng JSON
2. ✅ Components cho Author, Hero Images, SEO, Collection Info
3. ✅ Permissions được cấu hình đúng
4. ✅ API endpoints sẵn sàng sử dụng
5. ✅ Upload functionality cho images
6. ✅ Content structure hỗ trợ cả edit và display modes

Bây giờ frontend application có thể:
- Tạo và lưu insights với Unlayer editor
- Load lại content để chỉnh sửa
- Hiển thị HTML đã render ở trang detail
- Tương tác với Strapi API một cách hiệu quả