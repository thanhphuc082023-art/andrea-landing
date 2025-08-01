// Utility function to upload base64 images to Strapi Media Library
export async function uploadBase64Image(
  base64Data: string,
  filename: string
): Promise<{ id: number; url: string } | null> {
  try {
    // Convert base64 to blob
    const response = await fetch(base64Data);
    const blob = await response.blob();

    // Create FormData for Strapi upload
    const formData = new FormData();
    formData.append('files', blob, filename);

    // Upload to Strapi
    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      console.error('Failed to upload image:', filename);
      return null;
    }

    const uploadData = await uploadResponse.json();

    if (uploadData && uploadData[0]) {
      return {
        id: uploadData[0].id,
        url: uploadData[0].url,
      };
    }

    return null;
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    return null;
  }
}
