# Project Form Components

Form này đã được refactor theo best practices với code splitting để dễ maintain và tái sử dụng.

## Cấu trúc thư mục

```
forms/
├── index.ts                    # Export tất cả components
├── useProjectForm.ts           # Custom hook cho form logic
├── HeroSection.tsx            # Section thông tin hero
├── ShowcaseSection.tsx        # Section quản lý showcase
├── CreditsSection.tsx         # Section thông tin credits
├── ProjectSettingsSection.tsx # Section cài đặt dự án
├── SeoSection.tsx             # Section thông tin SEO
└── README.md                  # File này
```

## Components

### 1. HeroSection.tsx

- **Chức năng**: Quản lý thông tin hero section của dự án
- **Props**: register, errors, projectMetaInfo, newMetaInfo, setNewMetaInfo, addMetaInfo, removeMetaInfo
- **Màu sắc**: Xanh dương (blue gradient)

### 2. ShowcaseSection.tsx

- **Chức năng**: Quản lý showcase sections với drag & drop
- **Props**: showcaseSections, setShowcaseSections
- **Màu sắc**: Tím (purple gradient)
- **Tính năng**: Drag & drop, upload files, preview media

### 3. CreditsSection.tsx

- **Chức năng**: Quản lý thông tin credits của dự án
- **Props**: register, errors, credits, newCredit, setNewCredit, addCredit, removeCredit
- **Màu sắc**: Xanh lá (emerald gradient)

### 4. ProjectSettingsSection.tsx

- **Chức năng**: Quản lý cài đặt dự án (công nghệ, trạng thái, danh mục)
- **Props**: register, watch, control, errors, technologies, newTechnology, setNewTechnology, addTechnology, removeTechnology
- **Màu sắc**: Cam (amber gradient)

### 5. SeoSection.tsx

- **Chức năng**: Quản lý thông tin SEO
- **Props**: register, watch, control, setValue, errors, newKeyword, setNewKeyword, addKeyword, removeKeyword
- **Màu sắc**: Xám (slate gradient)
- **Tính năng**: Basic SEO, Open Graph, Twitter Card, Advanced SEO

## Custom Hook

### useProjectForm.ts

- **Chức năng**: Quản lý toàn bộ logic của form
- **Features**:
  - Form validation với Zod
  - Auto-generate slug từ title
  - Quản lý dynamic fields (technologies, meta info, keywords, credits)
  - Form submission và reset
  - State management cho showcase sections

## Benefits của Code Splitting

### 1. **Maintainability**

- Mỗi component có trách nhiệm riêng biệt
- Dễ dàng sửa đổi từng section mà không ảnh hưởng đến các section khác
- Code ngắn gọn, dễ đọc

### 2. **Reusability**

- Các components có thể được tái sử dụng ở nơi khác
- Custom hook có thể được sử dụng cho các form tương tự

### 3. **Performance**

- Lazy loading có thể được áp dụng cho từng section
- Bundle size nhỏ hơn khi chỉ import những gì cần thiết

### 4. **Testing**

- Dễ dàng test từng component riêng biệt
- Mock data đơn giản hơn cho từng section

### 5. **Team Collaboration**

- Nhiều developer có thể làm việc trên các section khác nhau
- Giảm conflict khi merge code

## Cách sử dụng

```tsx
import {
  HeroSection,
  ShowcaseSection,
  CreditsSection,
  ProjectSettingsSection,
  SeoSection,
  useProjectForm,
} from './forms';

// Trong component chính
const {
  register,
  handleSubmit,
  control,
  watch,
  setValue,
  errors,
  // ... other form methods
} = useProjectForm({ initialData, onSubmit });

// Render các sections
<HeroSection {...heroProps} />
<ShowcaseSection {...showcaseProps} />
<CreditsSection {...creditsProps} />
<ProjectSettingsSection {...settingsProps} />
<SeoSection {...seoProps} />
```

## Color Scheme

Mỗi section có màu sắc riêng để dễ phân biệt:

1. **Hero Section**: Blue gradient (blue-50 → indigo-50 → cyan-50)
2. **Showcase Section**: Purple gradient (purple-50 → pink-50 → rose-50)
3. **Credits Section**: Emerald gradient (emerald-50 → teal-50 → cyan-50)
4. **Project Settings**: Amber gradient (amber-50 → orange-50 → yellow-50)
5. **SEO Section**: Slate gradient (slate-50 → gray-50 → zinc-50)

## Best Practices được áp dụng

1. **Single Responsibility Principle**: Mỗi component chỉ có một trách nhiệm
2. **Separation of Concerns**: Logic được tách ra khỏi UI
3. **Custom Hooks**: Logic phức tạp được đóng gói trong custom hooks
4. **Type Safety**: TypeScript interfaces cho tất cả props
5. **Consistent Styling**: Tailwind CSS với design system nhất quán
6. **Error Handling**: Proper error handling và validation
7. **Accessibility**: ARIA labels và keyboard navigation
8. **Performance**: Optimized re-renders với proper dependencies
