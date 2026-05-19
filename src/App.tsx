import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <p className="text-muted-foreground text-sm">
        React + Vite + TypeScript + Tailwind + shadcn/ui
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">Hello World</h1>
      <Button type="button" variant="outline">
        shadcn Button
      </Button>
    </main>
  )
}

export default App
