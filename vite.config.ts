import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2017',
    minify: true,
    lib: {
      name: '__tenoxui_preset__',
      entry: './src/index.ts',
      formats: ['es', 'iife', 'cjs', 'umd'],
      fileName: (format) => `index.${format}${format !== 'cjs' ? '.js' : ''}`
    },
    sourcemap: true,
    rollupOptions: {
      output: { exports: 'named' }
    }
  }
})
