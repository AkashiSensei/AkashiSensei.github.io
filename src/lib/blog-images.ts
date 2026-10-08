import type { BlogContent, BlogImage } from "./blog"

export function getBlogGalleryImages(content: BlogContent): BlogImage[] {
  const images = content.cover ? [content.cover, ...Object.values(content.images)] : Object.values(content.images)
  const seen = new Set<string>()
  return images.filter(({ src }) => {
    if (seen.has(src)) return false
    seen.add(src)
    return true
  })
}
