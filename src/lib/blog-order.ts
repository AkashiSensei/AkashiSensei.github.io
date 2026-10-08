export function sortBlogArticlesByPublication<T extends { publishedAt?: string }>(articles: readonly T[]): T[] {
  // The publication importer validates dates as YYYY-MM-DD. Lexical comparison
  // avoids timezone shifts; stable sorting preserves the order of tied dates.
  return [...articles].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
}
