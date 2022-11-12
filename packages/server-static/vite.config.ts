import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    // hmr: { overlay: false },
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'MyLib',
            // the proper extensions will be added
            fileName: 'my-lib',
        },
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
