export function getStrapiMediaUrl(media: any): string | undefined {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || '';

  const url =
    media?.data?.attributes?.url || media?.data?.url || media?.url || '';

  if (!url) return undefined;
  // Nếu đã là absolute URL thì trả về luôn
  if (url.startsWith('http')) return url;
  // Nếu là relative URL thì nối baseUrl
  return `${baseUrl}${url}`;
}
