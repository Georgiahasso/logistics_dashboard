import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/logistics_dashboard/',
  server: {
    port: 3000,
    open: true
  }
});

