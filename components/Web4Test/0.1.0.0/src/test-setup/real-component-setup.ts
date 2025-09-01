/**
 * Real Component Testing Setup for Web4Test Framework
 * Configuration and utilities for actual component validation
 */

import { beforeEach, afterEach } from 'vitest'
import * as path from 'path'
import * as fs from 'fs'
import { execSync } from 'child_process'

// Real component testing utilities
declare global {
  var RealComponentTest: {
    getProjectRoot: () => string
    getComponentPath: (componentName: string, version?: string) => string
    isComponentBuilt: (componentPath: string) => boolean
    buildComponent: (componentPath: string) => Promise<boolean>
    executeCommand: (command: string, cwd?: string) => Promise<{ stdout: string; stderr: string; exitCode: number }>
    validateComponentStructure: (componentPath: string) => boolean
  }
}

// Project root detection
function findProjectRoot(): string {
  let currentDir = __dirname
  
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'components')) && 
        fs.existsSync(path.join(currentDir, 'scrum.pmo'))) {
      return currentDir
    }
    currentDir = path.dirname(currentDir)
  }
  
  throw new Error('Could not find project root (looking for components/ and scrum.pmo/ directories)')
}

// Real Component Testing Global Utilities
globalThis.RealComponentTest = {
  getProjectRoot: (): string => {
    try {
      return findProjectRoot()
    } catch (error) {
      // Fallback for testing environment
      return process.cwd()
    }
  },
  
  getComponentPath: (componentName: string, version?: string): string => {
    const projectRoot = globalThis.RealComponentTest.getProjectRoot()
    const componentDir = path.join(projectRoot, 'components', componentName)
    
    if (!version) {
      // Try to find latest version or use latest symlink
      const latestPath = path.join(componentDir, 'latest')
      if (fs.existsSync(latestPath) && fs.lstatSync(latestPath).isSymbolicLink()) {
        const target = fs.readlinkSync(latestPath)
        return path.resolve(componentDir, target)
      }
      
      // Find highest version number
      if (fs.existsSync(componentDir)) {
        const versions = fs.readdirSync(componentDir)
          .filter(dir => fs.statSync(path.join(componentDir, dir)).isDirectory())
          .filter(dir => /^\d+\.\d+\.\d+\.\d+$/.test(dir))
          .sort((a, b) => {
            const aParts = a.split('.').map(Number)
            const bParts = b.split('.').map(Number)
            for (let i = 0; i < 4; i++) {
              if (aParts[i] !== bParts[i]) {
                return bParts[i] - aParts[i] // Descending order
              }
            }
            return 0
          })
        
        if (versions.length > 0) {
          version = versions[0]
        }
      }
    }
    
    if (!version) {
      throw new Error(`No version found for component ${componentName}`)
    }
    
    return path.join(componentDir, version)
  },
  
  isComponentBuilt: (componentPath: string): boolean => {
    const distPath = path.join(componentPath, 'dist')
    const packageJsonPath = path.join(componentPath, 'package.json')
    
    if (!fs.existsSync(distPath) || !fs.existsSync(packageJsonPath)) {
      return false
    }
    
    // Check if dist has content
    const distContents = fs.readdirSync(distPath)
    return distContents.length > 0
  },
  
  buildComponent: async (componentPath: string): Promise<boolean> => {
    try {
      const packageJsonPath = path.join(componentPath, 'package.json')
      if (!fs.existsSync(packageJsonPath)) {
        return false
      }
      
      // Execute npm run build
      execSync('npm run build', { 
        cwd: componentPath, 
        stdio: 'pipe',
        timeout: 30000
      })
      
      return globalThis.RealComponentTest.isComponentBuilt(componentPath)
    } catch (error) {
      console.error('Build failed:', error)
      return false
    }
  },
  
  executeCommand: async (command: string, cwd?: string): Promise<{ stdout: string; stderr: string; exitCode: number }> => {
    return new Promise((resolve) => {
      try {
        const result = execSync(command, {
          cwd: cwd || globalThis.RealComponentTest.getProjectRoot(),
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 30000
        })
        
        resolve({
          stdout: result,
          stderr: '',
          exitCode: 0
        })
      } catch (error: any) {
        resolve({
          stdout: error.stdout || '',
          stderr: error.stderr || error.message || '',
          exitCode: error.status || 1
        })
      }
    })
  },
  
  validateComponentStructure: (componentPath: string): boolean => {
    const requiredPaths = [
      'package.json',
      'tsconfig.json',
      'src',
      'src/index.ts'
    ]
    
    return requiredPaths.every(requiredPath => {
      const fullPath = path.join(componentPath, requiredPath)
      return fs.existsSync(fullPath)
    })
  }
}

// Setup before each real component test
beforeEach(async () => {
  const projectRoot = globalThis.RealComponentTest.getProjectRoot()
  
  Web4Test.recordEvidence('real-test-setup', 'Real component test setup', {
    projectRoot,
    testEnvironment: 'node',
    timestamp: new Date().toISOString()
  })
})

// Cleanup after each real component test
afterEach(() => {
  Web4Test.recordEvidence('real-test-cleanup', 'Real component test cleanup', {
    timestamp: new Date().toISOString()
  })
})

console.log('🔧 Real Component Testing Setup Complete - Component validation utilities loaded')


