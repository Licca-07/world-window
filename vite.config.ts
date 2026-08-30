import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages is served from /world-window/; Vercel and local use root.
  base: command === 'build' && process.env.GITHUB_PAGES === 'true' ? '/world-window/' : '/',
  plugins: [react()],
}))
