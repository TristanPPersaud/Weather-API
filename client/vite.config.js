import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',  // or your Render server API URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../server/dist',  // Ensure this matches your desired output directory
  },
});