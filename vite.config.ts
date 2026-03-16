import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'import.meta.env.VITE_META_ACCESS_TOKEN': JSON.stringify(env.VITE_META_ACCESS_TOKEN || env.META_ACCESS_TOKEN || ''),
      'import.meta.env.VITE_META_PHONE_NUMBER_ID': JSON.stringify(env.VITE_META_PHONE_NUMBER_ID || env.META_PHONE_NUMBER_ID || ''),
      'import.meta.env.VITE_META_WABA_ID': JSON.stringify(env.VITE_META_WABA_ID || env.META_WABA_ID || ''),
      'import.meta.env.VITE_META_APP_ID': JSON.stringify(env.VITE_META_APP_ID || env.META_APP_ID || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
