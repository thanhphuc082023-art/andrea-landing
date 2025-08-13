# Admin Project Control Panel Setup

## Overview

This document outlines the setup required for the admin control panel to manage `project/[slug]` pages with dynamic showcase sections, media uploads, and comprehensive project management.

## Strapi Content Types Setup

### 1. Project Content Type

Create a new content type called "Project" with the following fields:

```javascript
{
  "title": "Text (required)",
  "description": "Text (Long, required)",
  "content": "Rich Text (required)",
  "slug": "UID (required, from title)",
  "technologies": "Text (repeatable)",
  "projectUrl": "Text",
  "githubUrl": "Text",
  "featured": "Boolean (default: false)",
  "status": "Enumeration (draft, in-progress, completed)",
  "client": "Text",
  "year": "Number",
  "overview": "Text (Long)",
  "challenge": "Text (Long)",
  "solution": "Text (Long)",
  "featuredImage": "Media (Single)",
  "gallery": "Media (Multiple)",
  "category": "Relation (Many-to-One with Category)",
  "showcase": "JSON",
  "results": "Component (repeatable): ProjectResult",
  "metrics": "Component (repeatable): ProjectMetric",
  "seo": "Component: SEO",
  // ProjectHero fields
  "projectIntroTitle": "Text (default: 'Giới thiệu dự án:')",
  "projectMetaInfo": "Text (repeatable)",
  "heroVideo": "Media (Single, video files)",
  // ProjectCredits fields
  "credits": "Component: ProjectCredits"
}
```

### 2. Category Content Type

Create a "Category" content type:

```javascript
{
  "name": "Text (required)",
  "slug": "UID (required, from name)",
  "description": "Text (Long)",
  "color": "Text (for UI styling)",
  "icon": "Text (icon class or name)"
}
```

### 3. Reusable Components

#### ProjectResult Component

```javascript
{
  "title": "Text (required)",
  "description": "Text (Long, required)"
}
```

#### ProjectMetric Component

```javascript
{
  "value": "Text (required)",
  "label": "Text (required)",
  "description": "Text (Long)"
}
```

#### SEO Component

```javascript
{
  "metaTitle": "Text (required, max 60 chars)",
  "metaDescription": "Text (required, max 160 chars)",
  "keywords": "Text"
}
```

#### ProjectCredits Component

```javascript
{
  "date": "Text",
  "projectManager": "Text",
  "graphicDesigner": "Text",
  "showcase": "Text"
}
```

## API Permissions Setup

### 1. Public Role

- **Project**: `find`, `findOne`
- **Category**: `find`, `findOne`

### 2. Authenticated Role

- **Project**: `find`, `findOne`, `create`, `update`, `delete`
- **Category**: `find`, `findOne`, `create`, `update`, `delete`
- **Media Library**: `upload`, `update`, `delete`

## Media Library Configuration

### 1. File Types

Configure allowed file types:

- Images: `jpg`, `jpeg`, `png`, `webp`, `gif`
- Videos: `mp4`, `webm`, `mov`
- Documents: `pdf`, `doc`, `docx`

### 2. File Size Limits

- Images: 10MB
- Videos: 100MB
- Documents: 50MB

### 3. Image Processing

Enable automatic image processing:

- Thumbnails: 150x150, 300x300, 600x600
- WebP conversion
- Quality optimization

## API Token Setup

### 1. Create API Token

1. Go to Settings → API Tokens
2. Create new token with name "Admin Panel Token"
3. Set token type to "Full access" or custom permissions
4. Copy the generated token

### 2. Environment Variables

Add to your Next.js `.env.local`:

```bash
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
```

## Frontend Integration

### 1. Replace Mock APIs

Update the following files to use actual Strapi API calls:

#### `/api/admin/projects/index.ts`

```typescript
// Replace mock data with:
const response = await fetch(`${process.env.STRAPI_URL}/api/projects`, {
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  },
});
```

#### `/api/admin/projects/[id].ts`

```typescript
// Replace mock data with:
const response = await fetch(`${process.env.STRAPI_URL}/api/projects/${id}`, {
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  },
});
```

#### `/api/admin/projects/[id]/showcase.ts`

```typescript
// Replace mock data with:
const response = await fetch(
  `${process.env.STRAPI_URL}/api/projects/${id}?populate=showcase`,
  {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  }
);
```

### 2. Media Upload Integration

Update `MediaUploader` component to use Strapi's media upload API:

```typescript
const uploadToStrapi = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    body: formData,
  });

  return response.json();
};
```

## Showcase Data Structure

The showcase field in Strapi should store JSON data with this structure:

```json
[
  {
    "id": "section-1",
    "title": "Moodboard",
    "type": "image",
    "layout": "single",
    "items": [
      {
        "id": "item-1",
        "type": "image",
        "src": "https://api.builder.io/api/v1/image/assets/TEMP/...",
        "alt": "Moodboard - Mangrove ecosystem inspiration",
        "width": 1300,
        "height": 1220,
        "order": 0
      }
    ],
    "order": 0
  }
]
```

## Security Considerations

### 1. API Token Security

- Store tokens securely in environment variables
- Use different tokens for different environments
- Regularly rotate tokens
- Set appropriate permissions for each token

### 2. File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Use CDN for media delivery
- Implement proper CORS policies

### 3. Access Control

- Implement proper authentication for admin panel
- Use role-based access control
- Log all admin actions
- Implement rate limiting

## Production Deployment

### 1. Strapi Deployment

- Deploy Strapi to a cloud provider (Heroku, DigitalOcean, AWS)
- Set up database (PostgreSQL recommended)
- Configure environment variables
- Set up SSL certificates

### 2. Next.js Deployment

- Deploy Next.js app to Vercel, Netlify, or similar
- Configure environment variables
- Set up custom domain
- Enable caching and CDN

### 3. Media Storage

- Use cloud storage (AWS S3, Cloudinary, etc.)
- Configure CDN for media delivery
- Set up backup and versioning

## Testing

### 1. API Testing

- Test all CRUD operations
- Test media upload functionality
- Test showcase data management
- Test error handling

### 2. Frontend Testing

- Test form validation
- Test drag and drop functionality
- Test responsive design
- Test accessibility

### 3. Integration Testing

- Test end-to-end workflows
- Test data consistency
- Test performance under load

## Troubleshooting

### Common Issues

1. **CORS Errors**: Configure CORS settings in Strapi
2. **File Upload Failures**: Check file size limits and permissions
3. **API Token Issues**: Verify token permissions and expiration
4. **Showcase Data Not Saving**: Check JSON field configuration

### Debug Steps

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Test API calls with Postman or similar tool
4. Check Strapi logs for server-side errors
5. Verify environment variables are set correctly

## Support

For additional support:

- Check Strapi documentation: https://docs.strapi.io/
- Review Next.js documentation: https://nextjs.org/docs
- Check project GitHub issues
- Contact development team
