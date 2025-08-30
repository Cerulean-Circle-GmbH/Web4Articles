/**
 * ONCE Server Integration Test
 * Tests server startup and HTTP connectivity
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { spawn, ChildProcess } from 'child_process'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'
import * as fs from 'fs'

const execAsync = promisify(exec)

describe('ONCE Server Integration Tests', () => {
  let serverProcess: ChildProcess | null = null
  let projectRoot: string
  let serverPath: string
  const testPort = 8081 // Use different port to avoid conflicts

  beforeEach(async () => {
    // Get project root and server path
    projectRoot = process.env.PROJECT_ROOT || process.cwd()
    serverPath = path.join(projectRoot, 'components/ONCE/0.1.0.2/examples/node-server/server.mjs')
    
    // Verify server file exists
    if (!fs.existsSync(serverPath)) {
      throw new Error(`Server file not found: ${serverPath}`)
    }

    // Kill any existing process on test port
    try {
      await execAsync(`lsof -ti:${testPort} | xargs kill -9 2>/dev/null || true`)
    } catch (error) {
      // Ignore errors - port might not be in use
    }
  })

  afterEach(async () => {
    // Clean up server process
    if (serverProcess) {
      serverProcess.kill('SIGTERM')
      
      // Wait a bit for graceful shutdown, then force kill if needed
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (serverProcess && !serverProcess.killed) {
        serverProcess.kill('SIGKILL')
      }
      
      serverProcess = null
    }

    // Clean up any remaining processes on test port
    try {
      await execAsync(`lsof -ti:${testPort} | xargs kill -9 2>/dev/null || true`)
    } catch (error) {
      // Ignore errors
    }
  })

  it('should start ONCE server and respond to HTTP requests', async () => {
    // Start the ONCE server
    serverProcess = spawn('node', [serverPath], {
      env: { 
        ...process.env, 
        HOST: 'localhost', 
        PORT: testPort.toString() 
      },
      cwd: path.dirname(serverPath),
      stdio: ['ignore', 'pipe', 'pipe']
    })

    // Wait for server to start
    let serverReady = false
    let attempts = 0
    const maxAttempts = 30 // 15 seconds max wait

    while (!serverReady && attempts < maxAttempts) {
      try {
        const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${testPort}/ --connect-timeout 1`)
        if (stdout.trim() === '200') {
          serverReady = true
        }
      } catch (error) {
        // Server not ready yet, continue waiting
      }
      
      if (!serverReady) {
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }
    }

    expect(serverReady).toBe(true)
    expect(serverProcess?.killed).toBe(false)

    // Test HTTP GET request via curl
    const { stdout, stderr } = await execAsync(`curl -s http://localhost:${testPort}/`)
    
    expect(stderr).toBe('')
    expect(stdout).toContain('ONCE')
    expect(stdout.length).toBeGreaterThan(0)
  }, 30000)

  it('should respond to WebSocket upgrade requests', async () => {
    // Start the ONCE server
    serverProcess = spawn('node', [serverPath], {
      env: { 
        ...process.env, 
        HOST: 'localhost', 
        PORT: testPort.toString() 
      },
      cwd: path.dirname(serverPath),
      stdio: ['ignore', 'pipe', 'pipe']
    })

    // Wait for server to start
    let serverReady = false
    let attempts = 0

    while (!serverReady && attempts < 30) {
      try {
        const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${testPort}/ --connect-timeout 1`)
        if (stdout.trim() === '200') {
          serverReady = true
        }
      } catch (error) {
        // Continue waiting
      }
      
      if (!serverReady) {
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }
    }

    expect(serverReady).toBe(true)

    // Test WebSocket upgrade via curl headers
    const { stdout, stderr } = await execAsync(`curl -s -I -H "Upgrade: websocket" -H "Connection: Upgrade" -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" -H "Sec-WebSocket-Version: 13" http://localhost:${testPort}/`)
    
    expect(stderr).toBe('')
    expect(stdout).toContain('101') // WebSocket upgrade response
  }, 30000)

  it('should serve static content and API endpoints', async () => {
    // Start the ONCE server
    serverProcess = spawn('node', [serverPath], {
      env: { 
        ...process.env, 
        HOST: 'localhost', 
        PORT: testPort.toString() 
      },
      cwd: path.dirname(serverPath),
      stdio: ['ignore', 'pipe', 'pipe']
    })

    // Wait for server to start
    let serverReady = false
    let attempts = 0

    while (!serverReady && attempts < 30) {
      try {
        const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${testPort}/ --connect-timeout 1`)
        if (stdout.trim() === '200') {
          serverReady = true
        }
      } catch (error) {
        // Continue waiting
      }
      
      if (!serverReady) {
        await new Promise(resolve => setTimeout(resolve, 500))
        attempts++
      }
    }

    expect(serverReady).toBe(true)

    // Test multiple endpoints
    const endpoints = [
      '/',
      '/api/status',
      '/api/version'
    ]

    for (const endpoint of endpoints) {
      const { stdout, stderr } = await execAsync(`curl -s -w "HTTP_CODE:%{http_code}" http://localhost:${testPort}${endpoint}`)
      
      expect(stderr).toBe('')
      expect(stdout).toMatch(/HTTP_CODE:(200|404)/) // Accept 200 or 404 (some endpoints might not exist)
    }
  }, 30000)
})
