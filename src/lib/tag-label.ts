// Formatting only: canonical labels and filter IDs remain unchanged.
export function formatDocumentTag(label: string) {
  const text = label.trim().replace(/^#+/, "").trim().replace(/\s+/g, "_")
  return text ? `#${text}` : ""
}
