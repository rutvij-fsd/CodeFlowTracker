import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { Buffer } from 'buffer'

Object.defineProperty(globalThis, 'Buffer', {
  value: Buffer,
});
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@babel/parser', '@babel/traverse'],
    },
  },
  define: {
    'process.env': {},
    global: 'window',
    Buffer: [ 'buffer', 'Buffer' ]
  }
})
