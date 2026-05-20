import { useSyncExternalStore } from "react"

const storedPath = sessionStorage.getItem("spa-redirect-path")
if (storedPath) {
  sessionStorage.removeItem("spa-redirect-path")
  window.history.replaceState(null, "", storedPath)
}

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback)
  return () => window.removeEventListener("popstate", callback)
}

function getPathname() {
  return window.location.pathname
}

export function usePathname() {
  return useSyncExternalStore(subscribe, getPathname, () => "/")
}

export function navigate(path: string) {
  if (window.location.pathname === path) {
    return
  }
  window.history.pushState(null, "", path)
  window.dispatchEvent(new PopStateEvent("popstate"))
}
