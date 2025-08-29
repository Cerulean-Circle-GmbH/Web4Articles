/**
 * Real Web4TSComponent Version Management Tests
 * Actual validation of Web4TSComponent version creation functionality
 */

import { describe, it, expect, beforeEach } from 'vitest'
import * as path from 'path'
import * as fs from 'fs'

describe('Web4TSComponent Version Management - Real Tests', () => {
  let componentPath: string
  let tempTestDir: string

  beforeEach(() => {
    Web4Test.recordEvidence('setup', 'Real version management test setup', {
      testSuite: 'Web4TSComponent Version Management'
    })

    componentPath = RealComponentTest.getComponentPath('Web4TSComponent')
    tempTestDir = path.join(componentPath, '..', 'test-temp')
    
    // Clean up any previous test artifacts
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true })
    }
  })

  it('should have valid Web4TSComponent structure', async () => {
    Web4Test.recordEvidence('test-start', 'Validating Web4TSComponent structure', {
      componentPath
    })

    expect(fs.existsSync(componentPath)).toBe(true)
    expect(RealComponentTest.validateComponentStructure(componentPath)).toBe(true)
    
    const packageJsonPath = path.join(componentPath, 'package.json')
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    
    Web4Test.recordEvidence('assertion', 'Package.json validation', {
      name: packageJson.name,
      version: packageJson.version,
      hasScripts: !!packageJson.scripts,
      hasBuildScript: !!packageJson.scripts?.build
    })

    expect(packageJson.name).toContain('web4tscomponent')
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+\.\d+$/)
    expect(packageJson.scripts).toBeDefined()
    expect(packageJson.scripts.build).toBeDefined()
  })

  it('should build successfully', async () => {
    Web4Test.recordEvidence('test-start', 'Building Web4TSComponent', {
      componentPath
    })

    const buildSuccess = await RealComponentTest.buildComponent(componentPath)
    
    Web4Test.recordEvidence('assertion', 'Build result', {
      buildSuccess,
      distExists: fs.existsSync(path.join(componentPath, 'dist')),
      componentBuilt: RealComponentTest.isComponentBuilt(componentPath)
    })

    expect(buildSuccess).toBe(true)
    expect(RealComponentTest.isComponentBuilt(componentPath)).toBe(true)
  })

  it('should have executable CLI script', async () => {
    Web4Test.recordEvidence('test-start', 'Validating CLI script', {
      componentPath
    })

    // Ensure component is built
    if (!RealComponentTest.isComponentBuilt(componentPath)) {
      await RealComponentTest.buildComponent(componentPath)
    }

    const cliScriptPath = path.join(componentPath, 'web4tscomponent.sh')
    expect(fs.existsSync(cliScriptPath)).toBe(true)

    const stats = fs.statSync(cliScriptPath)
    const isExecutable = (stats.mode & parseInt('111', 8)) !== 0

    Web4Test.recordEvidence('assertion', 'CLI script validation', {
      scriptExists: true,
      isExecutable,
      scriptPath: cliScriptPath
    })

    expect(isExecutable).toBe(true)
  })

  it('should execute CLI info command successfully', async () => {
    Web4Test.recordEvidence('test-start', 'Testing CLI info command', {
      componentPath
    })

    const cliScript = path.join(componentPath, 'web4tscomponent.sh')
    const result = await RealComponentTest.executeCommand(`${cliScript} info`)

    Web4Test.recordEvidence('assertion', 'CLI info command result', {
      exitCode: result.exitCode,
      hasOutput: result.stdout.length > 0,
      outputContainsVersion: result.stdout.includes('Version:'),
      stderr: result.stderr
    })

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Version:')
    expect(result.stdout).toContain('Web4TSComponent')
  })

  it('should list available version commands', async () => {
    Web4Test.recordEvidence('test-start', 'Testing version command listing', {
      componentPath
    })

    const cliScript = path.join(componentPath, 'web4tscomponent.sh')
    const result = await RealComponentTest.executeCommand(`${cliScript} version info`)

    Web4Test.recordEvidence('assertion', 'Version info command result', {
      exitCode: result.exitCode,
      hasOutput: result.stdout.length > 0,
      outputContainsCommands: result.stdout.includes('COMMANDS:'),
      stderr: result.stderr
    })

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('COMMANDS:')
    // Should contain version management commands
    expect(result.stdout.toLowerCase()).toMatch(/next|major|minor|patch|build/)
  })

  it('should validate version number format', async () => {
    Web4Test.recordEvidence('test-start', 'Validating current version format', {
      componentPath
    })

    const cliScript = path.join(componentPath, 'web4tscomponent.sh')
    const result = await RealComponentTest.executeCommand(`${cliScript} info`)

    // Extract version from output
    const versionMatch = result.stdout.match(/Version:\s*(\d+\.\d+\.\d+\.\d+)/)
    const currentVersion = versionMatch ? versionMatch[1] : null

    Web4Test.recordEvidence('assertion', 'Version format validation', {
      versionFound: !!currentVersion,
      version: currentVersion,
      matchesPattern: currentVersion ? /^\d+\.\d+\.\d+\.\d+$/.test(currentVersion) : false
    })

    expect(currentVersion).toBeDefined()
    expect(currentVersion).toMatch(/^\d+\.\d+\.\d+\.\d+$/)
  })

  it('should detect project root correctly', async () => {
    Web4Test.recordEvidence('test-start', 'Testing project root detection', {
      componentPath
    })

    // Test from different directories
    const tempDir = path.join(componentPath, '..', '..', 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const cliScript = path.join(componentPath, 'web4tscomponent.sh')
    const result = await RealComponentTest.executeCommand(`${cliScript} info`, tempDir)

    Web4Test.recordEvidence('assertion', 'Project root detection result', {
      exitCode: result.exitCode,
      executedFromTemp: true,
      hasOutput: result.stdout.length > 0,
      stderr: result.stderr
    })

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('Project Root:')
    expect(result.stdout).toContain('Web4Articles')
  })
})
