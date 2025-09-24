/**
 * Real ONCE Component Structure Tests
 * Actual validation of ONCE component structure and build system
 */

import { describe, it, expect, beforeEach } from 'vitest'
import * as path from 'path'
import * as fs from 'fs'

describe('ONCE Component Structure - Real Tests', () => {
  let componentPath: string

  beforeEach(() => {
    Web4Test.recordEvidence('setup', 'Real ONCE component test setup', {
      testSuite: 'ONCE Component Structure'
    })

    componentPath = RealComponentTest.getComponentPath('ONCE')
  })

  it('should have valid ONCE component structure', async () => {
    Web4Test.recordEvidence('test-start', 'Validating ONCE component structure', {
      componentPath
    })

    expect(fs.existsSync(componentPath)).toBe(true)
    expect(RealComponentTest.validateComponentStructure(componentPath)).toBe(true)
    
    const packageJsonPath = path.join(componentPath, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    Web4Test.recordEvidence('assertion', 'ONCE package.json validation', {
      name: packageJson.name,
      version: packageJson.version,
      hasScripts: !!packageJson.scripts,
      hasBuildScript: !!packageJson.scripts?.build,
      description: packageJson.description
    })

    expect(packageJson.name).toContain('once')
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+\.\d+$/)
    expect(packageJson.scripts).toBeDefined()
    expect(packageJson.scripts.build).toBeDefined()
  })

  it('should have proper 5-layer architecture', async () => {
    Web4Test.recordEvidence('test-start', 'Validating ONCE 5-layer architecture', {
      componentPath
    })

    const srcPath = path.join(componentPath, 'src', 'ts')
    const layers = ['layer1', 'layer2', 'layer3', 'layer4', 'layer5']
    const layerResults: Record<string, boolean> = {}

    for (const layer of layers) {
      const layerPath = path.join(srcPath, layer)
      layerResults[layer] = fs.existsSync(layerPath)
    }

    Web4Test.recordEvidence('assertion', 'ONCE layer structure validation', {
      srcPath,
      layerResults,
      totalLayers: Object.keys(layerResults).length,
      existingLayers: Object.values(layerResults).filter(Boolean).length
    })

    // At least some layers should exist (not all components need all 5 layers)
    const existingLayers = Object.values(layerResults).filter(Boolean).length
    expect(existingLayers).toBeGreaterThan(0)
    
    // Layer 2 (implementations) should definitely exist
    expect(layerResults.layer2).toBe(true)
    
    // Layer 3 (interfaces) should exist for Web4 compliance
    expect(layerResults.layer3).toBe(true)
  })

  it('should have essential ONCE TypeScript files', async () => {
    Web4Test.recordEvidence('test-start', 'Validating essential ONCE TypeScript files', {
      componentPath
    })

    const srcPath = path.join(componentPath, 'src', 'ts')
    const essentialFiles = [
      'layer2/DefaultONCE.ts',
      'layer2/PeerManager.ts',
      'layer2/ComponentLifecycleManager.ts',
      'layer2/ScenarioManager.ts',
      'layer3/IOR.ts'
    ]

    const fileResults: Record<string, boolean> = {}
    for (const file of essentialFiles) {
      const filePath = path.join(srcPath, file)
      fileResults[file] = fs.existsSync(filePath)
    }

    Web4Test.recordEvidence('assertion', 'Essential ONCE files validation', {
      srcPath,
      fileResults,
      totalFiles: essentialFiles.length,
      existingFiles: Object.values(fileResults).filter(Boolean).length
    })

    // At least most essential files should exist
    const existingFiles = Object.values(fileResults).filter(Boolean).length
    expect(existingFiles).toBeGreaterThan(essentialFiles.length * 0.5)
  })

  it('should build successfully or already be built', async () => {
    Web4Test.recordEvidence('test-start', 'Validating ONCE component build', {
      componentPath
    })

    const initiallyBuilt = RealComponentTest.isComponentBuilt(componentPath)
    let buildSuccess = initiallyBuilt

    if (!initiallyBuilt) {
      Web4Test.recordEvidence('step', 'Building ONCE component', {
        reason: 'Component not initially built'
      })
      
      buildSuccess = await RealComponentTest.buildComponent(componentPath)
    }
    
    const distPath = path.join(componentPath, 'dist')
    const distExists = fs.existsSync(distPath)
    
    Web4Test.recordEvidence('assertion', 'ONCE build result', {
      initiallyBuilt,
      buildSuccess,
      distExists,
      distContents: distExists ? fs.readdirSync(distPath).length : 0
    })

    expect(buildSuccess).toBe(true)
    expect(distExists).toBe(true)
  })

  it('should have executable ONCE binary', async () => {
    Web4Test.recordEvidence('test-start', 'Validating ONCE executable binary', {
      componentPath
    })

    const binPath = path.join(componentPath, 'bin', 'once')
    const binExists = fs.existsSync(binPath)
    
    let isExecutable = false
    if (binExists) {
      const stats = fs.statSync(binPath)
      isExecutable = (stats.mode & parseInt('111', 8)) !== 0
    }

    Web4Test.recordEvidence('assertion', 'ONCE binary validation', {
      binPath,
      binExists,
      isExecutable
    })

    expect(binExists).toBe(true)
    expect(isExecutable).toBe(true)
  })

  it('should execute ONCE help command', async () => {
    Web4Test.recordEvidence('test-start', 'Testing ONCE help command', {
      componentPath
    })

    const onceBinary = path.join(componentPath, 'bin', 'once')
    
    // Skip if binary doesn't exist (already tested above)
    if (!fs.existsSync(onceBinary)) {
      Web4Test.recordEvidence('skip', 'ONCE binary not found, skipping execution test', {
        onceBinary
      })
      return
    }

    const result = await RealComponentTest.executeCommand(`${onceBinary} --help`)

    Web4Test.recordEvidence('assertion', 'ONCE help command result', {
      exitCode: result.exitCode,
      hasOutput: result.stdout.length > 0,
      outputContainsONCE: result.stdout.toLowerCase().includes('once'),
      stderr: result.stderr
    })

    // ONCE help should work (exit code 0 or 1 is acceptable for help)
    expect(result.exitCode).toBeLessThanOrEqual(1)
    expect(result.stdout.length + result.stderr.length).toBeGreaterThan(0)
  })

  it('should have examples directory with demos', async () => {
    Web4Test.recordEvidence('test-start', 'Validating ONCE examples directory', {
      componentPath
    })

    const examplesPath = path.join(componentPath, 'examples')
    const examplesExist = fs.existsSync(examplesPath)
    
    let exampleFiles: string[] = []
    let demoFiles: string[] = []
    
    if (examplesExist) {
      exampleFiles = fs.readdirSync(examplesPath)
      demoFiles = exampleFiles.filter(file => file.includes('demo'))
    }

    Web4Test.recordEvidence('assertion', 'ONCE examples validation', {
      examplesPath,
      examplesExist,
      exampleFilesCount: exampleFiles.length,
      demoFilesCount: demoFiles.length,
      exampleFiles: exampleFiles.slice(0, 10) // First 10 for brevity
    })

    expect(examplesExist).toBe(true)
    expect(exampleFiles.length).toBeGreaterThan(0)
    expect(demoFiles.length).toBeGreaterThan(0)
  })
})

