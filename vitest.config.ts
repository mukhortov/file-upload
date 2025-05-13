import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: resolve(__dirname, './src/client/components'),
      service: resolve(__dirname, './src/client/service'),
      model: resolve(__dirname, './src/client/model'),
      utils: resolve(__dirname, './src/client/utils'),
    },
  },
  test: {
    globals: true,
    environmentMatchGlobs: [
      ['**/src/client/**/*.test.{ts,tsx}', 'jsdom'],
      ['**/src/server/**/*.spec.{ts,tsx}', 'node'],
    ],
    setupFiles: ['./src/client/test/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 10000,
  },
})
