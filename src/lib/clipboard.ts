/** Shared copy behavior for contact details, article permalinks, and code. */
export async function copyTextToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    return
  }

  const focusedElement = document.activeElement
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.setAttribute("readonly", "")
  textArea.style.position = "fixed"
  textArea.style.top = "-9999px"
  document.body.appendChild(textArea)
  try {
    textArea.select()
    if (!document.execCommand("copy")) throw new Error("Clipboard copy failed")
  } finally {
    textArea.remove()
    if (focusedElement instanceof HTMLElement) focusedElement.focus({ preventScroll: true })
  }
}
