import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Server integration testing environment
    environment: 'node',
    
    // Global test configuration
    globals: true,
    
    // File patterns for ONCE server tests
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'src/**/*'],
    
    // Extended timeouts for server startup/shutdown
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 15000,
    
    // Coverage for test files
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/**/*'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    },
    
    // Detailed reporter
    reporter: ['verbose']
  },
  
  // TypeScript configuration
  esbuild: {
    target: 'es2020'
  }
})
