import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers', '@emotion/react', '@emotion/styled'],
          firebase: ['firebase'],
          charts: ['recharts'],
          export: ['xlsx', 'jspdf', 'jspdf-autotable'],
          capacitor: ['@capacitor/core', '@capacitor/android', '@capacitor/preferences', '@capacitor/splash-screen', '@capacitor/status-bar', '@capacitor/push-notifications', '@capacitor/local-notifications', '@capacitor/firebase-authentication']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});