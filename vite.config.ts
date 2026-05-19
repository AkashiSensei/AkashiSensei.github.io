import path from "node:path"
import { fileURLToPath } from "node:url"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const root = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  server: {
    // 在局域网内可访问（手机同 Wi‑Fi 下用本机 IP + 端口打开）
    host: true,
    port: 5173,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
})
