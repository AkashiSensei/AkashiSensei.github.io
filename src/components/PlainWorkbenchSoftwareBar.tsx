import { type WorkbenchSoftware } from "@/data/workbench"
import { cn } from "@/lib/utils"

type PlainWorkbenchSoftwareBarProps = {
  software: WorkbenchSoftware[]
  ariaLabel: string
  className?: string
}

export function PlainWorkbenchSoftwareBar({
  software,
  ariaLabel,
  className,
}: PlainWorkbenchSoftwareBarProps) {
  return (
    <ul className={cn("plain-workbench-icon-bar", className)} aria-label={ariaLabel}>
      {software.map((item) => (
        <li key={item.id}>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.name}
              title={item.name}
            >
              <img
                src={item.icon}
                alt={item.name}
                loading="lazy"
                className={cn(
                  item.id === "solidworks" &&
                    "dark:drop-shadow-[0_0_14px_rgb(255_255_255_/_0.62)]",
                )}
              />
            </a>
          ) : (
            <span title={item.name}>
              <img
                src={item.icon}
                alt={item.name}
                loading="lazy"
                className={cn(
                  item.id === "solidworks" &&
                    "dark:drop-shadow-[0_0_14px_rgb(255_255_255_/_0.62)]",
                )}
              />
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
