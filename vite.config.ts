import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/client/components'),
      service: path.resolve(__dirname, './src/client/service'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]_[local]',
    },
  },
  test: {
    env: {
      NODE_ENV: 'test',
    },
  },
})
