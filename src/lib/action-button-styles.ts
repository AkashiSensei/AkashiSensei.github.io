export const pillActionClassName =
  "rounded-full text-base font-normal transition-colors"

export const ghostPillActionClassName =
  `${pillActionClassName} h-12 cursor-pointer px-4 text-tone-2 hover:bg-[rgb(var(--site-surface-rgb)_/_0.30)] hover:text-tone-1 dark:hover:bg-white/10`

export const filledPillActionClassName =
  `${pillActionClassName} border-foreground bg-foreground text-background shadow-sm backdrop-blur-md hover:bg-foreground/85 dark:border-[rgb(var(--site-surface-rgb)_/_0.18)] dark:bg-[rgb(var(--site-surface-rgb))] dark:text-black dark:hover:bg-[rgb(255_255_252)]`
