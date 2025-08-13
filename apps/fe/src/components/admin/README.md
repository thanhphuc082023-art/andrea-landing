# Admin Components

Các components cho admin dashboard, bao gồm form và layout components.

## Components

### ProjectFormPage.tsx

- **Chức năng**: Page component cho form tạo/chỉnh sửa dự án
- **Props**: onSubmit, initialData?, categories?, isLoading?
- **Features**:
  - Header với navigation
  - Form sections được chia nhỏ
  - Responsive design
  - Loading states
  - **Live Preview**: Xem trước dự án như trang đích

### ProjectPreview.tsx

- **Chức năng**: Component preview hiển thị dự án như trang đích
- **Props**: formData, isVisible, onToggle
- **Features**:
  - Real-time preview từ form data
  - Hiển thị như trang project/[slug]
  - Toggle show/hide
  - Responsive design

### ProjectPreviewPage.tsx

- **Chức năng**: Component preview hiển thị dự án như trang đích hoàn chỉnh
- **Props**: formData, showcaseSections, isVisible, onToggle
- **Features**:
  - Preview như trang project/[slug] thật
  - Layout giống hệt trang đích
  - Hero section với title và meta info
  - Showcase sections với preview
  - Credits section
  - Technologies section
  - Status badge

### ProjectPreviewContent.tsx

- **Chức năng**: Component nội dung preview cho page
- **Props**: formData, showcaseSections
- **Features**:
  - Hiển thị nội dung preview như trang đích
  - Responsive design
  - Tất cả sections: Hero, Showcase, Credits, Technologies

### /admin/projects/preview.tsx

- **Chức năng**: Page preview riêng biệt
- **Features**:
  - Lấy data từ sessionStorage
  - Header với nút quay lại form
  - Loading states
  - Error handling khi không có data
  - Navigation về form create/edit

### AdminLayout.tsx

- **Chức năng**: Layout wrapper cho admin pages
- **Props**: children, title?
- **Features**:
  - SEO meta tags
  - Consistent styling
  - Page titles

### ProjectForm.tsx (Modal version)

- **Chức năng**: Modal version của form (giữ lại để tương thích)
- **Props**: isOpen, onClose, onSubmit, initialData?, categories?, isLoading?

## Pages

### `/admin/projects/create`

- **Chức năng**: Tạo dự án mới
- **Route**: `pages/admin/projects/create.tsx`
- **Features**:
  - Form validation
  - API integration (TODO)
  - Redirect sau khi tạo thành công

### `/admin/projects/[id]/edit`

- **Chức năng**: Chỉnh sửa dự án
- **Route**: `pages/admin/projects/[id]/edit.tsx`
- **Features**:
  - Fetch project data
  - Form pre-population
  - API integration (TODO)
  - Loading states
  - Error handling

## Preview Feature

### Live Preview

- **Chức năng**: Xem trước dự án như trang đích `project/[slug]`
- **Cách sử dụng**: Nhấn nút "Xem Preview" trong header
- **Features**:
  - Lưu data vào sessionStorage
  - Navigate đến page preview riêng biệt
  - Hiển thị chính xác như trang đích `project/[slug]`
  - Sử dụng ProjectDetailContents component
  - Nút quay lại form để chỉnh sửa
  - Nút "Tạo dự án" khi hài lòng với preview
  - Responsive design

### Workflow

1. **Create Page** → User nhập data trong form
2. **Preview Page** → User xem preview như trang đích
3. **Project Detail Page** → User nhấn "Tạo dự án" → Navigate đến `project/[slug]`

### Preview Components

- **Hero Section**: Title, meta info, intro title, description, status
- **Technologies**: Tags hiển thị công nghệ sử dụng
- **Credits**: Team information và ngày tháng
- **Showcase**: Preview cho từng showcase section

### Preview Layout

- **ProjectPreviewPage**: Preview hoàn chỉnh như trang đích
- **ProjectPreviewContent**: Component nội dung preview
- **Layout**: Giống hệt trang project/[slug] (sử dụng ProjectDetailContents)
- **Sections**: Hero, Showcase, Credits, Technologies
- **Responsive**: Tự động điều chỉnh theo kích thước
- **Navigation**: Quay lại form để chỉnh sửa
- **Actions**: Tạo dự án khi hài lòng với preview

## Cách sử dụng

### Tạo dự án mới

```tsx
// Navigate to create page
router.push('/admin/projects/create');

// Hoặc sử dụng component trực tiếp
<ProjectFormPage onSubmit={handleSubmit} isLoading={isLoading} />;
```

### Chỉnh sửa dự án

```tsx
// Navigate to edit page
router.push(`/admin/projects/${projectId}/edit`);

// Hoặc sử dụng component trực tiếp
<ProjectFormPage
  onSubmit={handleSubmit}
  initialData={projectData}
  isLoading={isLoading}
/>;
```

### Sử dụng với layout

```tsx
<AdminLayout title="Custom Title">
  <ProjectFormPage
    onSubmit={handleSubmit}
    initialData={initialData}
    isLoading={isLoading}
  />
</AdminLayout>
```

## API Integration

### Create Project

```tsx
const handleSubmit = async (data: ProjectFormData) => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/admin/projects');
    }
  } catch (error) {
    console.error('Error creating project:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Update Project

```tsx
const handleSubmit = async (data: ProjectFormData) => {
  setIsLoading(true);
  try {
    const response = await fetch(`/api/admin/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push(`/admin/projects/${id}`);
    }
  } catch (error) {
    console.error('Error updating project:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Fetch Project Data

```tsx
const fetchProjectData = async () => {
  try {
    const response = await fetch(`/api/admin/projects/${id}`);
    if (response.ok) {
      const data = await response.json();
      setInitialData(data);
    }
  } catch (error) {
    console.error('Error fetching project:', error);
  }
};
```

## Styling

- **Header**: White background với shadow và border
- **Content**: Gray-50 background
- **Form sections**: Colored gradients cho từng section
- **Responsive**: Mobile-first design
- **Loading states**: Spinner và disabled states

## Navigation

- **Back button**: Quay lại trang trước đó
- **Cancel button**: Hủy thao tác
- **Submit button**: Lưu dự án
- **Breadcrumbs**: Hiển thị vị trí hiện tại (TODO)

## Error Handling

- **Form validation**: Zod schema validation
- **API errors**: Try-catch blocks với user feedback
- **Loading states**: Disabled buttons và spinners
- **Fallback UI**: Error boundaries và loading skeletons
