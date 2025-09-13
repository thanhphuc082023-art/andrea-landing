# Admin Form Design System

## Overview
Design system cho các form components trong admin panel, đảm bảo tính nhất quán và trải nghiệm người dùng tốt.

## Core Principles

### 1. Visual Hierarchy
- **Section Headers**: Sử dụng icon + title + description
- **Field Labels**: Icon + text với font-semibold
- **Error Messages**: Warning emoji + text với màu đỏ
- **Helper Text**: Text nhỏ màu xám để hướng dẫn

### 2. Color Palette
```css
/* Primary Colors */
--blue-50: #eff6ff
--blue-100: #dbeafe
--blue-500: #3b82f6
--blue-600: #2563eb

/* Status Colors */
--red-50: #fef2f2
--red-200: #fecaca
--red-300: #fca5a5
--red-500: #ef4444
--red-600: #dc2626

/* Neutral Colors */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827

/* Accent Colors */
--purple-50: #faf5ff
--purple-100: #f3e8ff
--purple-500: #8b5cf6
--purple-600: #7c3aed

--yellow-500: #eab308
```

### 3. Spacing System
- **Section spacing**: `space-y-8` (32px)
- **Field spacing**: `gap-8` cho grid, `mt-2` cho labels
- **Component padding**: `p-6` cho containers, `px-4 py-3` cho inputs
- **Icon spacing**: `mr-2` cho icons trong labels

## Component Patterns

### Section Header Pattern
```tsx
<div className="border-b border-gray-200 pb-6">
  <div className="flex items-center space-x-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
      <IconComponent className="h-6 w-6 text-blue-600" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900">
        Section Title
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Section description
      </p>
    </div>
  </div>
</div>
```

### Input Field Pattern
```tsx
<div>
  <label
    htmlFor="fieldId"
    className="flex items-center text-sm font-semibold text-gray-800"
  >
    <IconComponent className="mr-2 h-4 w-4 text-gray-500" />
    Field Label {required && '*'}
  </label>
  <div className="mt-2">
    <input
      type="text"
      id="fieldId"
      className={`block w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none ${
        hasError
          ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
          : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
      }`}
      placeholder="Placeholder text..."
    />
    {hasError && (
      <p className="mt-2 flex items-center text-sm text-red-600">
        <span className="mr-1">⚠️</span>
        {errorMessage}
      </p>
    )}
  </div>
</div>
```

### Select Field Pattern
```tsx
<div className="relative">
  <select
    className={`block w-full appearance-none rounded-lg border-2 pl-4 pr-10 py-3 text-sm transition-colors duration-200 focus:outline-none ${
      hasError
        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
        : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`}
  >
    <option value="" className="text-gray-400">
      Choose option...
    </option>
    {options.map((option) => (
      <option key={option.value} value={option.value} className="text-gray-900">
        {option.emoji} {option.label}
      </option>
    ))}
  </select>
  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>
```

### Listbox Field Pattern (Headless UI)
```tsx
<Listbox value={field.value || ''} onChange={field.onChange}>
  <div className="relative mt-1">
    <Listbox.Button className="relative w-full cursor-default rounded-lg border-2 border-gray-200 bg-white py-3 pl-4 pr-10 text-left text-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100">
      <span className="block truncate">
        {field.value || 'Choose option...'}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon
          className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </span>
    </Listbox.Button>
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {options.map((option) => (
          <Listbox.Option
            key={option.id}
            className={({ active }) =>
              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                active
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-900'
              }`
            }
            value={option.id}
          >
            {({ selected }) => (
              <>
                <span
                  className={`block truncate ${
                    selected ? 'font-medium' : 'font-normal'
                  }`}
                >
                  {option.name}
                </span>
                {selected ? (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                    <CheckIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>
                ) : null}
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Transition>
  </div>
</Listbox>
```

### Textarea Pattern
```tsx
<textarea
  rows={4}
  className={`block w-full rounded-lg border-2 px-4 py-3 text-sm transition-colors duration-200 placeholder-gray-400 focus:outline-none resize-none ${
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
      : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  }`}
  placeholder="Enter detailed description..."
/>
```

### Checkbox Pattern
```tsx
<div className="flex items-start space-x-3">
  <div className="flex h-6 items-center">
    <input
      type="checkbox"
      className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-blue-100 focus:ring-offset-0"
    />
  </div>
  <div className="flex-1">
    <label className="flex items-center text-sm font-semibold text-gray-800 cursor-pointer">
      <IconComponent className="mr-2 h-4 w-4 text-yellow-500" />
      Checkbox Label
    </label>
    <p className="mt-1 text-xs text-gray-500">
      Helper text explaining the option
    </p>
  </div>
</div>
```

### Switch Pattern
```tsx
<div>
  <div className="flex-1">
    <label
      className="flex items-center text-sm font-semibold text-gray-800 cursor-pointer"
      onClick={() => setValue('fieldName', !isEnabled)}
    >
      <IconComponent className="mr-2 h-4 w-4 text-yellow-500" />
      Switch Label
    </label>
    <p className="mt-1 text-xs text-gray-500">
      Helper text explaining the switch option
    </p>
  </div>
  <div className="mt-2 flex items-center">
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      onClick={() => setValue('fieldName', !isEnabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 ${
        isEnabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          isEnabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
</div>
```

### Grouped Section Pattern
```tsx
<div className="lg:col-span-2">
  <div className="rounded-lg border-2 border-gray-100 bg-gray-50 p-6">
    <div className="mb-4 flex items-center space-x-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
        <IconComponent className="h-5 w-5 text-purple-600" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900">
          Group Title
        </h4>
        <p className="text-xs text-gray-600">
          Group description
        </p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Group content */}
    </div>
  </div>
</div>
```

## Icon Guidelines

### Recommended Icons (Heroicons)
- **DocumentTextIcon**: Text fields, titles, content
- **LinkIcon**: URLs, slugs, links
- **TagIcon**: Categories, tags, classifications
- **ChatBubbleLeftRightIcon**: Descriptions, excerpts, comments
- **EyeIcon**: Status, visibility, preview
- **StarIcon**: Featured, favorites, ratings
- **FolderIcon**: Collections, groups, organization
- **PhotoIcon**: Images, media, uploads
- **CalendarIcon**: Dates, scheduling
- **UserIcon**: Authors, users, profiles
- **CogIcon**: Settings, configuration
- **InformationCircleIcon**: Help, info, tooltips

### Icon Sizing
- **Section headers**: `h-6 w-6`
- **Field labels**: `h-4 w-4`
- **Group headers**: `h-5 w-5`
- **Small indicators**: `h-3 w-3`

## Layout Guidelines

### Grid System
```tsx
<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
  {/* Single column on mobile, two columns on large screens */}
</div>
```

### Full-width Fields
```tsx
<div className="lg:col-span-2">
  {/* Spans full width on large screens */}
</div>
```

### Responsive Breakpoints
- **Mobile**: Default (single column)
- **Large (lg)**: 1024px+ (two columns)

## Animation & Transitions

### Standard Transition
```css
transition-colors duration-200
```

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-blue-100
```

## Accessibility

### Requirements
1. **Labels**: Always associate labels with form controls
2. **Error Messages**: Use aria-describedby for error associations
3. **Focus Management**: Ensure keyboard navigation works
4. **Color Contrast**: Maintain WCAG AA standards
5. **Screen Readers**: Use semantic HTML and ARIA labels

### Implementation
```tsx
<input
  id="fieldId"
  aria-describedby={hasError ? "fieldId-error" : undefined}
  aria-invalid={hasError}
/>
{hasError && (
  <p id="fieldId-error" role="alert" className="mt-2 text-sm text-red-600">
    {errorMessage}
  </p>
)}
```

## Usage Examples

### Apply to Other Components
1. **AuthorSection**: Use user icon, follow input patterns
2. **MediaSection**: Use photo icon, add file upload styling
3. **SEOSection**: Use cog icon, group related fields
4. **ScheduleSection**: Use calendar icon, add date picker styling

### Customization
- Change accent colors for different sections (purple for collections, green for SEO, etc.)
- Adjust icon colors to match section themes
- Use different background colors for grouped sections

## Best Practices

1. **Consistency**: Always use the same patterns across components
2. **Feedback**: Provide clear visual feedback for all interactions
3. **Progressive Enhancement**: Start with basic functionality, add enhancements
4. **Performance**: Use CSS transitions instead of JavaScript animations
5. **Testing**: Test with keyboard navigation and screen readers
6. **Documentation**: Keep this guide updated as patterns evolve

## Migration Guide

To update existing components:

1. **Replace class names**: Update from old Tailwind classes to new patterns
2. **Add icons**: Import and add appropriate Heroicons
3. **Update spacing**: Use new spacing system (space-y-8, gap-8, etc.)
4. **Enhance states**: Add proper error, focus, and hover states
5. **Group related fields**: Use grouped section pattern where appropriate
6. **Test thoroughly**: Ensure all functionality still works after updates