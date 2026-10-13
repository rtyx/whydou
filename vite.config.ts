import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

function gitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA
  try {
    return execSync("git rev-parse HEAD").toString().trim()
  } catch {
    return "unknown"
  }
}

// Emits /version.json so a deployed build can be matched to its commit.
function versionFile(): Plugin {
  return {
    name: "version-file",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify({ sha: gitSha(), builtAt: new Date().toISOString() }, null, 2) + "\n",
      })
    },
  }
}

export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss(), versionFile()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
