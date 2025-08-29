/**
 * Real Vitest Integration Tests
 * Validates the Vitest integration with Web4Test framework
 */

import { describe, it, expect, beforeEach } from 'vitest'

describe('Vitest Integration - Real Tests', () => {
  
  beforeEach(() => {
    Web4Test.recordEvidence('setup', 'Vitest integration test setup', {
      testSuite: 'Vitest Integration'
    })
  })

  it('should have Web4Test global utilities available', () => {
    Web4Test.recordEvidence('test-start', 'Testing Web4Test global utilities', {
      globalExists: typeof Web4Test !== 'undefined'
    })

    expect(typeof Web4Test).toBe('object')
    expect(typeof Web4Test.recordEvidence).toBe('function')
    expect(typeof Web4Test.getEvidence).toBe('function')
    expect(typeof Web4Test.clearEvidence).toBe('function')
  })

  it('should record evidence during test execution', () => {
    Web4Test.recordEvidence('test-start', 'Testing evidence recording', {
      testType: 'evidence-recording'
    })

    const evidenceBefore = Web4Test.getEvidence().length
    
    Web4Test.recordEvidence('step', 'Test evidence step', {
      step: 'evidence-test',
      data: { test: true }
    })
    
    const evidenceAfter = Web4Test.getEvidence().length

    Web4Test.recordEvidence('assertion', 'Evidence recording validation', {
      evidenceBefore,
      evidenceAfter,
      evidenceIncreased: evidenceAfter > evidenceBefore
    })

    expect(evidenceAfter).toBeGreaterThan(evidenceBefore)
  })

  it('should clear evidence between tests', () => {
    Web4Test.recordEvidence('test-start', 'Testing evidence clearing', {})
    
    // Add some evidence
    Web4Test.recordEvidence('step', 'Adding test evidence', { data: 'test' })
    
    const evidenceBefore = Web4Test.getEvidence().length
    expect(evidenceBefore).toBeGreaterThan(0)
    
    // Clear evidence
    Web4Test.clearEvidence()
    
    const evidenceAfter = Web4Test.getEvidence().length
    
    Web4Test.recordEvidence('assertion', 'Evidence clearing validation', {
      evidenceBefore,
      evidenceAfter,
      evidenceCleared: evidenceAfter === 0
    })

    expect(evidenceAfter).toBe(0)
  })

  it('should have RealComponentTest utilities available', () => {
    Web4Test.recordEvidence('test-start', 'Testing RealComponentTest utilities', {
      globalExists: typeof RealComponentTest !== 'undefined'
    })

    expect(typeof RealComponentTest).toBe('object')
    expect(typeof RealComponentTest.getProjectRoot).toBe('function')
    expect(typeof RealComponentTest.getComponentPath).toBe('function')
    expect(typeof RealComponentTest.isComponentBuilt).toBe('function')
    expect(typeof RealComponentTest.buildComponent).toBe('function')
    expect(typeof RealComponentTest.executeCommand).toBe('function')
    expect(typeof RealComponentTest.validateComponentStructure).toBe('function')
  })

  it('should detect project root correctly', () => {
    Web4Test.recordEvidence('test-start', 'Testing project root detection', {})

    const projectRoot = RealComponentTest.getProjectRoot()
    
    Web4Test.recordEvidence('assertion', 'Project root validation', {
      projectRoot,
      containsComponents: projectRoot.includes('Web4Articles'),
      isString: typeof projectRoot === 'string',
      isNotEmpty: projectRoot.length > 0
    })

    expect(typeof projectRoot).toBe('string')
    expect(projectRoot.length).toBeGreaterThan(0)
    expect(projectRoot).toContain('Web4Articles')
  })

  it('should support Web4 custom matchers', () => {
    Web4Test.recordEvidence('test-start', 'Testing Web4 custom matchers', {})

    // Test Web4 compliant object
    const web4Object = {
      uuid: 'test:uuid:web4-object-001',
      constructor: function() {},
      init: function() {}
    }

    // Test IOR format
    const validIOR = 'component:test:web4-object-001'
    const invalidIOR = 'not-a-valid-ior'

    Web4Test.recordEvidence('assertion', 'Web4 matcher validation', {
      web4ObjectValid: true,
      validIOR,
      invalidIOR
    })

    expect(web4Object).toBeWeb4Compliant()
    expect(validIOR).toHaveValidIOR()
    expect(invalidIOR).not.toHaveValidIOR()
  })

  it('should preserve evidence during test execution', () => {
    Web4Test.recordEvidence('test-start', 'Testing evidence preservation', {})

    const testFunction = () => {
      Web4Test.recordEvidence('step', 'Test function evidence', { preserved: true })
    }

    expect(testFunction).toPreserveEvidence(testFunction)
  })

  it('should handle vitest configuration correctly', () => {
    Web4Test.recordEvidence('test-start', 'Testing Vitest configuration', {})

    // Check if we're in the correct test environment
    const isVitest = typeof expect !== 'undefined'
    const hasGlobals = typeof describe !== 'undefined' && typeof it !== 'undefined'
    
    Web4Test.recordEvidence('assertion', 'Vitest configuration validation', {
      isVitest,
      hasGlobals,
      expectFunction: typeof expect,
      environment: 'vitest'
    })

    expect(isVitest).toBe(true)
    expect(hasGlobals).toBe(true)
    expect(typeof expect).toBe('function')
  })
})
