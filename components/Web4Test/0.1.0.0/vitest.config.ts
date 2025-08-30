import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Test environment configuration
    environment: 'jsdom', // For browser-like testing
    
    // Global test configuration
    globals: true,
    
    // File patterns
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'test/**/*'], // Exclude our Web4 object tests
    
    // Test timeouts
    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/', // Our Web4 object tests
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ]
    },
    
    // Reporter configuration
    reporter: ['verbose', 'json'],
    
    // Setup files
    setupFiles: ['./src/test-setup/vitest-setup.ts']
  },
  
  // TypeScript configuration
  esbuild: {
    target: 'es2020'
  }
})

