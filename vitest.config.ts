
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: process.env.V2_TESTS === '1' ? 
      ['v2/test/**/*.test.ts'] : 
      [
        'test/**/*.test.ts',
        'components/**/test/**/*.test.ts',
        'components/**/test/**/*.spec.ts'
      ],
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    // Enable component test discovery
    globals: true,
  },
});
