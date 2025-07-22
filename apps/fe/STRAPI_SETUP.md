# Strapi Integration Setup Guide

## Overview

This project integrates with Strapi CMS to manage favicon, logo, SEO data, and content for the homepage. The integration includes:

- ✅ **Global settings** (logo, favicon, SEO)
- ✅ **Articles** with rich content and media
- ✅ **Projects** with images and metadata
- ✅ **Dynamic SEO** meta tags
- ✅ **Homepage featured content**

## Required Strapi Content Types

### 1. Global (Single Type)

Create a single type called `global` with these fields:

```javascript
{
  "siteName": "Text",
  "siteDescription": "Text (Long)",
  "logo": "Media (Single)",
  "favicon": "Media (Single)",
  "defaultSeo": {
    "metaTitle": "Text",
    "metaDescription": "Text (Long)",
    "metaImage": "Media (Single)",
    "keywords": "Text",
    "metaRobots": "Text (default: 'index,follow')",
    "metaViewport": "Text (default: 'width=device-width, initial-scale=1')",
    "canonicalURL": "Text",
    "structuredData": "JSON"
  },
  "socialLinks": {
    "twitter": "Text",
    "facebook": "Text",
    "instagram": "Text",
    "linkedin": "Text",
    "youtube": "Text",
    "github": "Text"
  },
  "contactInfo": {
    "email": "Email",
    "phone": "Text",
    "address": "Text (Long)"
  },
  "navigation": {
    "header": "Component (repeatable): NavigationItem",
    "footer": "Component (repeatable): NavigationItem"
  }
}
```

### 2. Article (Collection Type)

Create a collection type called `articles`:

```javascript
{
  "title": "Text (required)",
  "content": "Rich Text (required)",
  "slug": "UID (required, from title)",
  "excerpt": "Text (Long)",
  "featuredImage": "Media (Single)",
  "author": "Relation (Many-to-One with Author)",
  "categories": "Relation (Many-to-Many with Category)",
  "tags": "Relation (Many-to-Many with Tag)",
  "featured": "Boolean (default: false)",
  "readingTime": "Number",
  "seo": "Component: SEO"
}
```

### 3. Project (Collection Type)

Create a collection type called `projects`:

```javascript
{
  "title": "Text (required)",
  "description": "Text (Long, required)",
  "content": "Rich Text",
  "slug": "UID (required, from title)",
  "technologies": "Text (repeatable)",
  "projectUrl": "Text",
  "githubUrl": "Text",
  "featured": "Boolean (default: false)",
  "images": "Media (Multiple)",
  "category": "Relation (Many-to-One with Category)",
  "status": "Enumeration (draft, in-progress, completed)",
  "seo": "Component: SEO"
}
```

### 4. Author (Collection Type)

```javascript
{
  "name": "Text (required)",
  "email": "Email (required)",
  "bio": "Text (Long)",
  "avatar": "Media (Single)",
  "social": {
    "website": "Text",
    "twitter": "Text",
    "linkedin": "Text",
    "github": "Text"
  }
}
```

### 5. Category (Collection Type)

```javascript
{
  "name": "Text (required)",
  "slug": "UID (required, from name)",
  "description": "Text (Long)",
  "color": "Text",
  "icon": "Media (Single)"
}
```

### 6. Tag (Collection Type)

```javascript
{
  "name": "Text (required)",
  "slug": "UID (required, from name)",
  "description": "Text (Long)",
  "color": "Text"
}
```

## Required Components

### SEO Component

Create a component called `SEO`:

```javascript
{
  "metaTitle": "Text",
  "metaDescription": "Text (Long)",
  "metaImage": "Media (Single)",
  "keywords": "Text",
  "metaRobots": "Text (default: 'index,follow')",
  "metaViewport": "Text (default: 'width=device-width, initial-scale=1')",
  "canonicalURL": "Text",
  "structuredData": "JSON"
}
```

### NavigationItem Component

Create a component called `NavigationItem`:

```javascript
{
  "label": "Text (required)",
  "url": "Text (required)",
  "external": "Boolean (default: false)",
  "children": "Component (repeatable): NavigationItem"
}
```

## API Permissions

Make sure to set these permissions in Strapi:

### Public Role Permissions:

- **Global**: `find`
- **Articles**: `find`, `findOne`
- **Projects**: `find`, `findOne`
- **Categories**: `find`, `findOne`
- **Tags**: `find`, `findOne`
- **Authors**: `find`, `findOne`

## Environment Variables

Add these to your `.env.local` file:

```bash
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=https://joyful-basket-ea764d9c28.strapiapp.com
STRAPI_API_TOKEN=your_api_token_here_if_needed
```

## Usage Examples

### Homepage with Global Data

The homepage automatically uses global settings for:

- Site title and description
- Logo in navigation
- Favicon
- Default SEO meta tags
- Featured articles and projects

### Individual Pages

```typescript
// Article page
const { article } = useArticle(slug);

// Projects page
const { projects } = useProjects({ featured: true });

// Global info anywhere
const { global } = useGlobal();
```

### Components

```typescript
// Logo with Strapi fallback
<StrapiLogo width={120} height={40} fallbackToDefault={true} />

// Global info
<GlobalInfo type="siteName" fallback="Default Site Name" />

// SEO head
<StrapiHead seo={article?.attributes?.seo} />
```

## Testing

1. Start your dev server: `pnpm dev`
2. Visit `/strapi-test` to verify integration
3. Check console for any API errors
4. Verify images load correctly

## Deployment

For production, make sure to:

1. Set up proper API tokens in Strapi
2. Configure CORS for your domain
3. Add production URLs to environment variables
4. Enable ISR for performance: pages revalidate every hour

## Troubleshooting

- **No data showing**: Check API permissions in Strapi
- **Images not loading**: Verify CORS and media URLs
- **Build errors**: Ensure all required fields are filled in Strapi
- **SEO not working**: Check global settings and component structure

The integration provides full type safety with TypeScript and follows Next.js best practices for performance and SEO.
