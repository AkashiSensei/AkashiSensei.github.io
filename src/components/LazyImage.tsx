import { type ImgHTMLAttributes, useState } from "react"

import { cn } from "@/lib/utils"

type LazyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "className" | "title"> & {
  containerClassName?: string
  imageClassName?: string
  loadingLabel: string
  placeholderTitle: string
}

export function LazyImage({
  alt,
  containerClassName,
  imageClassName,
  loadingLabel,
  onLoad,
  placeholderTitle,
  ...imageProps
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-white/20 px-4 text-center transition-opacity duration-300 dark:bg-white/[0.03]",
          loaded ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        aria-hidden="true"
      >
        <span className="max-w-full truncate text-sm font-semibold text-foreground/70 dark:text-foreground/80">
          {placeholderTitle}
        </span>
        <span className="text-xs font-medium text-foreground/45 dark:text-foreground/55">
          {loadingLabel}
        </span>
      </div>
      <img
        {...imageProps}
        alt={alt}
        loading={imageProps.loading ?? "lazy"}
        onLoad={(event) => {
          setLoaded(true)
          onLoad?.(event)
        }}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
      />
    </div>
  )
}
