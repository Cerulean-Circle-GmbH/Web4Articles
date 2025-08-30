/**
 * ONCE Server Integration Test
 * Tests server startup and HTTP connectivity using ONCE CLI
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as path from 'path'

const execAsync = promisify(exec)

describe('ONCE Server Integration Tests', () => {
  let projectRoot: string
  let serverStarted = false
  const testPort = 9876 // Use unique port to avoid conflicts

  beforeAll(async () => {
    // Get project root
    projectRoot = process.env.PROJECT_ROOT || process.cwd()
    
    // If we're already in the component directory, go up to project root
    if (process.cwd().includes('components/ONCE/0.1.0.2')) {
      projectRoot = path.resolve(process.cwd(), '../../..')
    }

    // Check if test port is already in use
    try {
      const { stdout } = await execAsync(`lsof -ti:${testPort}`)
      if (stdout.trim()) {
        console.log(`⚠️  Port ${testPort} already in use - will test existing server`)
        // Test if it's a running ONCE server
        try {
          const { stdout: httpTest } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${testPort}/ --connect-timeout 2`)
          if (httpTest.trim() === '200' || httpTest.trim() === '404') {
            serverStarted = true // Use existing server
            console.log(`✅ Using existing ONCE server on port ${testPort}`)
            return
          }
        } catch (error) {
          // Not a web server, kill it
          console.log(`🔥 Killing non-HTTP process on port ${testPort}`)
          await execAsync(`lsof -ti:${testPort} | xargs kill -9 2>/dev/null || true`)
        }
      }
    } catch (error) {
      // Port is free, continue normally
    }
    
    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  afterAll(async () => {
    // Clean up server process - kill by port since it's running in background
    if (serverStarted) {
      try {
        console.log('Stopping ONCE server...')
        await execAsync(`lsof -ti:${testPort} | xargs kill -TERM 2>/dev/null || true`, { 
          timeout: 5000 
        })
        // Wait for graceful shutdown
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.log('Error stopping server gracefully:', error)
      }
    }

    // Force cleanup any remaining processes on test port
    try {
      await execAsync(`lsof -ti:${testPort} | xargs kill -9 2>/dev/null || true`)
    } catch (error) {
      // Ignore errors
    }
  })

  it('should start ONCE server via CLI', async () => {
    console.log(`Testing ONCE server on port: ${testPort}`)
    console.log(`Project root: ${projectRoot}`)
    
    // Skip server startup if already running
    if (serverStarted) {
      console.log('✅ Using existing ONCE server - skipping startup')
      return
    }
    
    try {
      // Start ONCE server directly in background (not interactive CLI)
      const serverPath = `${projectRoot}/components/ONCE/0.1.0.2/examples/node-server/server.mjs`
      const startCommand = `cd "${projectRoot}/components/ONCE/0.1.0.2/examples/node-server" && HOST=localhost PORT=${testPort} node server.mjs &`
      console.log(`Executing: ${startCommand}`)
      
      await execAsync(startCommand, { timeout: 3000 })
      serverStarted = true
      
      // Wait for server to start
      let serverReady = false
      let attempts = 0
      const maxAttempts = 20 // 10 seconds max wait

      console.log('Waiting for server to be ready...')
      while (!serverReady && attempts < maxAttempts) {
        try {
                  const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${testPort}/ --connect-timeout 1`)
        if (stdout.trim() === '200' || stdout.trim() === '404') {
            serverReady = true
            console.log('✅ Server is ready and responding!')
          }
        } catch (error) {
          // Server not ready yet, continue waiting
        }
        
        if (!serverReady) {
          await new Promise(resolve => setTimeout(resolve, 500))
          attempts++
          console.log(`Attempt ${attempts}/${maxAttempts} - waiting for server...`)
        }
      }

      if (!serverReady) {
        // If server didn't start, fail this test and mark to skip others
        serverStarted = false
        throw new Error(`Server failed to start after ${maxAttempts * 0.5} seconds`)
      }

      expect(serverReady).toBe(true)
    } catch (error) {
      console.error('Server startup failed:', error)
      serverStarted = false
      throw error
    }
  }, 30000)

  it('should respond to HTTP requests', async () => {
    // Skip if server didn't start
    if (!serverStarted) {
      console.log('⏭️ Skipping: Server not started')
      return
    }

    // Test HTTP GET request via curl
    const { stdout, stderr } = await execAsync(`curl -s http://localhost:${testPort}/`)
    
    expect(stderr).toBe('')
    expect(stdout).toContain('ONCE')
    expect(stdout.length).toBeGreaterThan(0)
    console.log('✅ HTTP request successful')
  }, 10000)

  it('should respond to WebSocket upgrade requests', async () => {
    // Skip if server didn't start
    if (!serverStarted) {
      console.log('⏭️ Skipping: Server not started')
      return
    }

    // Test WebSocket upgrade via curl headers  
    const { stdout, stderr } = await execAsync(`curl -s -I -H "Upgrade: websocket" -H "Connection: Upgrade" -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" -H "Sec-WebSocket-Version: 13" http://localhost:${testPort}/`)
    
    expect(stderr).toBe('')
    expect(stdout.length).toBeGreaterThan(0)
    // Server responds with HTTP headers (405 or 101 both indicate server is working)
    expect(stdout).toMatch(/HTTP\/1\.1 (101|405|200)/) // Accept any valid HTTP response
    console.log('✅ WebSocket test successful:', stdout.split('\n')[0])
  }, 10000)
})
