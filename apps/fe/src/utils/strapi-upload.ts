/**
 * Upload a file to Strapi media library
 * @param file - The file to upload
 * @param path - Optional path for organizing uploads
 * @param token - Optional JWT token for authentication
 * @returns Promise with upload response data
 */
export async function upload(
  file: File,
  path: string = '',
  token?: string
): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('files', file);

    if (path) {
      formData.append('path', path);
    }

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading file to Strapi:', error);
    throw error;
  }
}
