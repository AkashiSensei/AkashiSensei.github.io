import { createContext, useContext, useMemo, useState } from "react"

export type AnimationMode = "full" | "static" | "plain"

type AnimationProviderProps = {
  children: React.ReactNode
  defaultMode?: AnimationMode
  storageKey?: string
}

type AnimationProviderState = {
  animationMode: AnimationMode
  isAnimationEnabled: boolean
  isPlainDisplayMode: boolean
  setAnimationMode: (mode: AnimationMode) => void
  toggleAnimationMode: () => void
}

const initialState: AnimationProviderState = {
  animationMode: "full",
  isAnimationEnabled: true,
  isPlainDisplayMode: false,
  setAnimationMode: () => null,
  toggleAnimationMode: () => null,
}

const AnimationProviderContext =
  createContext<AnimationProviderState>(initialState)

function isAnimationMode(value: string | null): value is AnimationMode {
  return value === "full" || value === "static" || value === "plain"
}

function getInitialAnimationMode(
  storageKey: string,
  defaultMode: AnimationMode,
): AnimationMode {
  const storedMode = localStorage.getItem(storageKey)

  if (isAnimationMode(storedMode)) {
    return storedMode
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "static"
  }

  return defaultMode
}

export function AnimationProvider({
  children,
  defaultMode = "full",
  storageKey = "akashisensei-animation-mode",
}: AnimationProviderProps) {
  const [animationMode, setAnimationModeState] = useState<AnimationMode>(() =>
    getInitialAnimationMode(storageKey, defaultMode),
  )

  const value = useMemo<AnimationProviderState>(() => {
    const setAnimationMode = (mode: AnimationMode) => {
      localStorage.setItem(storageKey, mode)
      setAnimationModeState(mode)
    }

    return {
      animationMode,
      isAnimationEnabled: animationMode === "full",
      isPlainDisplayMode: animationMode === "plain",
      setAnimationMode,
      toggleAnimationMode: () => {
        setAnimationMode(animationMode === "full" ? "static" : "full")
      },
    }
  }, [animationMode, storageKey])

  return (
    <AnimationProviderContext.Provider value={value}>
      {children}
    </AnimationProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAnimationPreference = () => {
  const context = useContext(AnimationProviderContext)

  if (context === undefined)
    throw new Error(
      "useAnimationPreference must be used within an AnimationProvider",
    )

  return context
}
