# Session Cleanup Hook

The `useSessionCleanup` hook provides automatic cleanup of session data when components unmount.

## Usage

### Basic Usage

```tsx
import { useSessionCleanup } from '@/hooks/useSessionCleanup';

function MyComponent() {
  // Clean up specific sessionStorage keys on unmount
  useSessionCleanup({
    sessionKeys: ['myData', 'tempData'],
  });

  return <div>My Component</div>;
}
```

### Using Predefined Configurations

```tsx
import {
  useSessionCleanup,
  sessionCleanupConfigs,
} from '@/hooks/useSessionCleanup';

function ProjectForm() {
  // Clean up project form data
  useSessionCleanup(sessionCleanupConfigs.projectForm);

  return <form>...</form>;
}

function AuthComponent() {
  // Clean up authentication data
  useSessionCleanup(sessionCleanupConfigs.auth);

  return <div>...</div>;
}

function AdminComponent() {
  // Clean up all session data
  useSessionCleanup(sessionCleanupConfigs.all);

  return <div>...</div>;
}
```

## Available Configurations

### `sessionCleanupConfigs.projectForm`

Cleans up project form related session data:

- `projectFormData`
- `projectShowcaseSections`

### `sessionCleanupConfigs.auth`

Cleans up authentication related localStorage data:

- `strapiToken`
- `strapiUser`

### `sessionCleanupConfigs.all`

Cleans up all session and local storage data.

## Custom Configuration

You can create custom cleanup configurations:

```tsx
// Clean up specific keys
useSessionCleanup({
  sessionKeys: ['customData', 'tempData'],
  localKeys: ['userPrefs'],
});

// Clear all session storage
useSessionCleanup({
  clearSessionStorage: true,
});

// Clear all local storage
useSessionCleanup({
  clearLocalStorage: true,
});

// Clear everything
useSessionCleanup({
  clearSessionStorage: true,
  clearLocalStorage: true,
});

// Disable automatic cleanup on unmount
const { cleanup } = useSessionCleanup({
  sessionKeys: ['myData'],
  disableAutoCleanup: true,
});

// Manual cleanup when needed
cleanup();
```

## When to Use

- **Form components**: Clean up temporary form data
- **Authentication components**: Clean up tokens and user data
- **Admin areas**: Clean up all session data when leaving admin
- **Upload components**: Clean up temporary upload data
- **Preview pages**: Clean up preview data after navigation

## Advanced Usage

### Manual Cleanup Control

For components that need to preserve data during navigation (like preview pages), use `disableAutoCleanup`:

```tsx
function PreviewPage() {
  const { cleanup } = useSessionCleanup({
    sessionKeys: ['formData'],
    disableAutoCleanup: true, // Don't auto-cleanup on unmount
  });

  // Clean up manually when appropriate
  const handleSubmit = () => {
    // ... submit logic
    cleanup(); // Clean up after successful submission
  };

  return <div>...</div>;
}
```

## Best Practices

1. Use specific keys instead of clearing all storage when possible
2. Use predefined configurations for common use cases
3. Only clean up data that should be removed on unmount
4. Consider user experience - don't clear data that should persist across navigation
5. Use `disableAutoCleanup: true` for components that need to preserve data during navigation
6. Use manual cleanup functions for precise control over when data is removed
