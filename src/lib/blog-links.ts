export function getBlogHeadingUrl(currentUrl: string, headingId: string, locale: "zh" | "en") {
  const url = new URL(currentUrl)
  url.searchParams.set("lang", locale)
  url.hash = headingId
  return url.href
}
