import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': "'test'"
  },
  test: {
    include: ['__test__/**/*.spec.ts']
  }
});
