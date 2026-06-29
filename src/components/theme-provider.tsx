import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light" || value === "system"
}

function getStoredTheme(storageKey: string, defaultTheme: Theme) {
  try {
    const storedTheme = localStorage.getItem(storageKey)

    return isTheme(storedTheme) ? storedTheme : defaultTheme
  } catch {
    return defaultTheme
  }
}

function getResolvedTheme(theme: Theme) {
  if (theme !== "system") {
    return theme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const root = window.document.documentElement
  const resolvedTheme = getResolvedTheme(theme)

  root.classList.remove("light", "dark")
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => getStoredTheme(storageKey, defaultTheme)
  )

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        localStorage.setItem(storageKey, theme)
      } catch {
        // Keep the in-memory theme responsive even if storage is unavailable.
      }
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
