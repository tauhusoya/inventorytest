import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',     // ← allow access from outside (important!)
        port: 5173,          // ← optional: ensure it's fixed
        strictPort: true,
        watch: {
            usePolling: true,
        },
        cors: true           // ← allow cross-origin requests
    }
});