import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        extensions: ['.js', '.jsx', '.json'], // Ajoutez .jsx ici
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000", // URL de votre backend
          changeOrigin: true,
          secure: false,
        },
      },
    },
});
