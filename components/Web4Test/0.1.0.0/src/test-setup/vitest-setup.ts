/**
 * Vitest Test Setup for Web4Test Framework
 * Global test configuration and Web4 test utilities
 */

import { beforeEach, afterEach, expect } from 'vitest'

// Global test state
let testEvidence: Array<{ type: string; description: string; data: any; timestamp: string }> = []

// Web4 Test Utilities
declare global {
  interface Window {
    Web4Test: {
      recordEvidence: (type: string, description: string, data: any) => void
      getEvidence: () => Array<{ type: string; description: string; data: any; timestamp: string }>
      clearEvidence: () => void
    }
  }
  
  var Web4Test: {
    recordEvidence: (type: string, description: string, data: any) => void
    getEvidence: () => Array<{ type: string; description: string; data: any; timestamp: string }>
    clearEvidence: () => void
  }
}

// Web4 Test Global Utilities
globalThis.Web4Test = {
  recordEvidence: (type: string, description: string, data: any) => {
    testEvidence.push({
      type,
      description,
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      timestamp: new Date().toISOString()
    })
    console.log(`[${type.toUpperCase()}] ${description}:`, data)
  },
  
  getEvidence: () => [...testEvidence],
  
  clearEvidence: () => {
    testEvidence = []
  }
}

// Browser environment setup
if (typeof window !== 'undefined') {
  window.Web4Test = globalThis.Web4Test
}

// Vitest Custom Matchers for Web4
expect.extend({
  toBeWeb4Compliant(received: any) {
    const { isNot } = this
    
    // Check Web4 compliance patterns
    const hasUUID = received && typeof received.uuid === 'string'
    const hasEmptyConstructor = received && typeof received.constructor === 'function'
    const hasInitMethod = received && typeof received.init === 'function'
    
    const pass = hasUUID && hasEmptyConstructor && hasInitMethod
    
    return {
      pass,
      message: () => 
        isNot 
          ? `Expected object not to be Web4 compliant, but it has UUID: ${hasUUID}, empty constructor: ${hasEmptyConstructor}, init method: ${hasInitMethod}`
          : `Expected object to be Web4 compliant. Missing: ${!hasUUID ? 'UUID ' : ''}${!hasEmptyConstructor ? 'constructor ' : ''}${!hasInitMethod ? 'init method' : ''}`
    }
  },
  
  toHaveValidIOR(received: string) {
    const { isNot } = this
    
    // Check IOR format: protocol:type:identifier
    const iorPattern = /^[a-zA-Z][a-zA-Z0-9]*:[a-zA-Z][a-zA-Z0-9]*:[a-zA-Z0-9\-]+$/
    const pass = typeof received === 'string' && iorPattern.test(received)
    
    return {
      pass,
      message: () => 
        isNot
          ? `Expected "${received}" not to be a valid IOR`
          : `Expected "${received}" to be a valid IOR (format: protocol:type:identifier)`
    }
  },
  
  toPreserveEvidence(testFunction: Function) {
    const { isNot } = this
    
    const beforeEvidence = Web4Test.getEvidence().length
    testFunction()
    const afterEvidence = Web4Test.getEvidence().length
    
    const pass = afterEvidence > beforeEvidence
    
    return {
      pass,
      message: () =>
        isNot
          ? `Expected test not to preserve evidence, but evidence increased from ${beforeEvidence} to ${afterEvidence}`
          : `Expected test to preserve evidence, but evidence remained at ${beforeEvidence}`
    }
  }
})

// Type declarations for custom matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeWeb4Compliant(): T
    toHaveValidIOR(): T
    toPreserveEvidence(testFunction: Function): T
  }
  interface AsymmetricMatchersContaining {
    toBeWeb4Compliant(): any
    toHaveValidIOR(): any
    toPreserveEvidence(testFunction: Function): any
  }
}

// Setup before each test
beforeEach(() => {
  // Clear evidence before each test
  Web4Test.clearEvidence()
  
  // Record test start
  Web4Test.recordEvidence('test-start', 'Test execution started', {
    testName: expect.getState().currentTestName || 'unknown',
    timestamp: new Date().toISOString()
  })
})

// Cleanup after each test
afterEach(() => {
  // Record test completion
  const evidence = Web4Test.getEvidence()
  Web4Test.recordEvidence('test-complete', 'Test execution completed', {
    testName: expect.getState().currentTestName || 'unknown',
    evidenceCount: evidence.length,
    timestamp: new Date().toISOString()
  })
})

// Global error handler
process.on('unhandledRejection', (error) => {
  Web4Test.recordEvidence('error', 'Unhandled promise rejection', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  })
})

console.log('🧪 Web4Test Vitest Setup Complete - Web4 testing utilities loaded')
