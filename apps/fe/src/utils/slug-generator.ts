/**
 * Generate a URL-friendly slug from a title
 * @param title - The title string to convert to a slug
 * @returns A URL-friendly slug string
 */
export function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      // Replace non-word characters (except spaces and hyphens) with empty string
      .replace(/[^\w\s-]/g, '')
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      // Remove multiple consecutive hyphens
      .replace(/-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}
