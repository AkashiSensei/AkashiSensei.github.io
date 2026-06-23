import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import "./index.css"
import "./i18n"
import App from "./App.tsx"
import { AnimationProvider } from "./components/animation-provider.tsx"
import { ThemeProvider } from "./components/theme-provider.tsx"

const spaRedirectPath = sessionStorage.getItem("spa-redirect-path")
if (spaRedirectPath) {
  sessionStorage.removeItem("spa-redirect-path")
  window.history.replaceState(null, "", spaRedirectPath)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AnimationProvider>
          <App />
        </AnimationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
