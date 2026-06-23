import { type ReactNode, useEffect, useMemo, useState } from "react"

type ImageLike = {
  height: number
  src: string
  width: number
}

type DetailImageMasonryProps<TImage extends ImageLike> = {
  images: TImage[]
  renderImage: (image: TImage) => ReactNode
}

function getColumnCount() {
  if (typeof window === "undefined") {
    return 3
  }

  const viewportWidth = window.visualViewport?.width ?? window.innerWidth

  if (viewportWidth >= 1000) {
    return 3
  }

  if (viewportWidth >= 768) {
    return 2
  }

  return 1
}

function distributeImages<TImage extends ImageLike>(
  images: TImage[],
  columnCount: number,
) {
  const safeColumnCount = Math.max(1, columnCount)
  const columns: TImage[][] = Array.from({ length: safeColumnCount }, () => [])
  const columnHeights = Array.from({ length: safeColumnCount }, () => 0)

  images.forEach((image) => {
    const ratio = image.height / image.width
    const estimatedHeight = Number.isFinite(ratio) && ratio > 0 ? ratio : 1
    let targetColumnIndex = 0
    let shortestHeight = columnHeights[0]

    for (let index = 1; index < safeColumnCount; index += 1) {
      if (columnHeights[index] < shortestHeight) {
        targetColumnIndex = index
        shortestHeight = columnHeights[index]
      }
    }

    columns[targetColumnIndex].push(image)
    columnHeights[targetColumnIndex] += estimatedHeight
  })

  return columns
}

export function DetailImageMasonry<TImage extends ImageLike>({
  images,
  renderImage,
}: DetailImageMasonryProps<TImage>) {
  const [columnCount, setColumnCount] = useState(getColumnCount)
  const columns = useMemo(
    () => distributeImages(images, columnCount),
    [columnCount, images],
  )

  useEffect(() => {
    const updateColumnCount = () => {
      setColumnCount((currentColumnCount) => {
        const nextColumnCount = getColumnCount()

        return currentColumnCount === nextColumnCount
          ? currentColumnCount
          : nextColumnCount
      })
    }

    updateColumnCount()
    window.addEventListener("resize", updateColumnCount)
    window.visualViewport?.addEventListener("resize", updateColumnCount)

    return () => {
      window.removeEventListener("resize", updateColumnCount)
      window.visualViewport?.removeEventListener("resize", updateColumnCount)
    }
  }, [])

  return (
    <div className="hidden items-start gap-4 md:flex">
      {columns.map((columnImages, columnIndex) => (
        <div
          key={columnIndex}
          className="flex min-w-0 flex-1 flex-col gap-3"
        >
          {columnImages.map((image) => renderImage(image))}
        </div>
      ))}
    </div>
  )
}
