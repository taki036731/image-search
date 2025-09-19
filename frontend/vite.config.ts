import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    build: {
      // 開発ビルドではソースマップを有効にし、本番ビルドではセキュリティのため非表示に
      sourcemap: isProduction ? 'hidden' : true,
      // 開発ビルdではデバッグしやすいようにminifyしない
      minify: isProduction ? 'esbuild' : false,
      // 本番ビルドの時だけconsoleとdebuggerを削除
      esbuild: {
        drop: isProduction ? ['console', 'debugger'] : undefined,
      },
    },
  };
});
