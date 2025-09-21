# Local Libraries

This directory contains local copies of third-party libraries that are manually managed to ensure consistent behavior and version control.

## react-email-editor

This is a local copy of the `react-email-editor` library from `node_modules`. It has been copied here to ensure:

1. **Version Control**: The exact version is committed to the repository
2. **Consistent Behavior**: No dependency on external package manager behavior
3. **Custom Configuration**: Can be modified if needed for project-specific requirements

### Usage

The library is automatically aliased in `next.config.mjs` to use this local copy instead of the one in `node_modules`.

### Maintenance

If you need to update the library:

1. Update the version in `package.json` (if needed)
2. Copy the new version from `node_modules` to this directory
3. Update any custom modifications if necessary
4. Test thoroughly

### Files

- `react-email-editor/` - The main library files
- `react-email-editor/index.d.ts` - TypeScript definitions (custom)
- `react-email-editor/package.json` - Package configuration (modified to include types)

### Configuration

The library is configured in `next.config.mjs` with:

- Webpack alias pointing to this directory
- Babel loader for proper transpilation
- TypeScript support via custom definitions
