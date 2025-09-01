import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Real component testing environment
    environment: 'node', // For actual component testing
    
    // Global test configuration
    globals: true,
    
    // File patterns for real component tests
    include: ['src/**/*.real.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'test/**/*', 'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // Extended timeouts for real component testing
    testTimeout: 60000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    
    // Coverage for real tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/**/*'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test-setup/**'
      ]
    },
    
    // Detailed reporter for real testing
    reporter: ['verbose', 'json'],
    
    // Setup for real component testing
    setupFiles: ['./src/test-setup/real-component-setup.ts']
  },
  
  // TypeScript configuration
  esbuild: {
    target: 'es2020'
  }
})


