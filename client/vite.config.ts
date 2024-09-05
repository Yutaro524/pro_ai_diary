import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const base = isProduction ? '/pro_ai_diary/' : '/';

  return {
    plugins: [react(), vanillaExtractPlugin()],
    envDir: path.resolve(__dirname, '../'),
    base,
  };
});