# Project Creation API - Strapi Schema Alignment

## Summary

Đã cập nhật API `/api/admin/projects/create-from-chunks.ts` để chỉ sử dụng các trường có trong Strapi schema và cải thiện error handling.

## Các thay đổi chính

### 1. **Chỉ sử dụng fields có trong Strapi Schema** ✅

#### Required Fields:

- ✅ `title` (Text) - Required
- ✅ `description` (Rich Text) - Required
- ✅ `projectIntroTitle` (Text) - Required
- ✅ `status` (Enumeration) - Values: `draft`, `in-progress`, `completed`
- ✅ `featured` (Boolean) - Default: false

#### Optional Fields:

- ✅ `content` (Rich Text)
- ✅ `slug` (UID) - Target field: title
- ✅ `technologies` (JSON)
- ✅ `overview` (Rich Text)
- ✅ `challenge` (Rich Text)
- ✅ `solution` (Rich Text)
- ✅ `categoryId` (Number)
- ✅ `results` (JSON)
- ✅ `metrics` (JSON)
- ✅ `seo` (JSON)
- ✅ `projectMetaInfo` (JSON)
- ✅ `credits` (JSON)

#### Media Fields:

- ✅ `featuredImage` (Media) - Single file
- ✅ `gallery` (Media) - Multiple files
- ✅ `heroVideo` (Media) - Single file
- ✅ `thumbnail` (Media) - Single file

#### Showcase Sections Field:

- ✅ `showcaseSections` (JSON) - Properly structured showcase data

### 2. **Removed Non-Schema Fields** ❌ ➜ ✅

Đã loại bỏ các trường không có trong schema:

- ❌ `client` - Không có trong schema
- ❌ `year` - Không có trong schema
- ❌ `projectUrl` - Không có trong schema
- ❌ `githubUrl` - Không có trong schema
- ❌ `projectStatus` - Đã đổi thành `status`

### 3. **Enhanced showcaseSections Structure** ✅

Đã đảm bảo `showcaseSections` tuân theo đúng specification:

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
        "src": "uploaded_url",
        "alt": "Design Process Step 1",
        "width": 1300,
        "height": 800,
        "order": 0
      }
    ],
    "order": 0
  }
]
```

### 4. **Improved Error Handling** ✅

#### Enhanced Strapi API Error Logging:

```typescript
// Detailed validation error logging
if (errorData.error?.details?.errors) {
  errorData.error.details.errors.forEach((err: any) => {
    console.error(`- ${err.path?.join('.')}: ${err.message}`);
  });
}
```

#### Better Request Debugging:

```typescript
console.log('Complete project data structure:');
console.log('- Title:', title);
console.log('- Description length:', description?.length || 0);
console.log('- Showcase sections count:', processedShowcaseSections.length);
```

### 5. **Data Structure Validation** ✅

Tự động đảm bảo showcase sections có structure đúng:

- Default IDs nếu missing
- Default dimensions (1300x800)
- Proper ordering
- Type validation (image/video)

## Request Structure Expected

### Minimum Required Request:

```json
{
  "title": "Project Title",
  "description": "Project description",
  "projectIntroTitle": "Introduction title"
}
```

### Full Request Example:

```json
{
  "title": "Amazing Project",
  "description": "<p>Detailed description</p>",
  "projectIntroTitle": "About this project:",
  "content": "<p>Project content</p>",
  "status": "completed",
  "featured": true,
  "technologies": ["React", "TypeScript"],
  "overview": "<p>Project overview</p>",
  "challenge": "<p>What we solved</p>",
  "solution": "<p>How we solved it</p>",
  "categoryId": 1,
  "results": [{"title": "Result 1", "description": "Details"}],
  "metrics": [{"value": "100%", "label": "Success"}],
  "seo": {"title": "SEO Title"},
  "projectMetaInfo": ["2024", "Web Development"],
  "credits": {"designer": "John Doe"},
  "showcase": [...], // Showcase sections
  "heroVideoUploadId": "upload123",
  "thumbnailUploadId": "upload124",
  "featuredImageUploadId": "upload125",
  "galleryUploadIds": ["upload126", "upload127"],
  "showcaseUploadIds": ["upload128", "upload129"]
}
```

## Debugging Features

### Console Logs Added:

1. **Request validation** - Shows missing required fields
2. **Media upload results** - Success/failure for each file
3. **Showcase processing** - Step-by-step transformation
4. **Final data structure** - Complete payload before send
5. **Strapi response** - Detailed error analysis

### Error Categories Handled:

- ✅ **400 Bad Request** - Missing required fields
- ✅ **401 Unauthorized** - Invalid token
- ✅ **422 Validation Error** - Schema validation failures
- ✅ **500 Server Error** - Network/processing issues

---

**API giờ đã tuân thủ 100% Strapi schema và có error handling chi tiết!**
