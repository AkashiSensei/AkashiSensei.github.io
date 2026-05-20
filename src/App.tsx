import { useEffect } from "react"

import { usePathname } from "@/lib/navigation"
import { HomePage } from "@/pages/HomePage"
import { WorkbenchPage } from "@/pages/WorkbenchPage"

function App() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (pathname === "/workbench") {
    return <WorkbenchPage />
  }

  return <HomePage />
}

export default App
