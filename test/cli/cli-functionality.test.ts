/**
 * CLI Functionality Testing Suite
 * 
 * Tests universal CLI implementation, command delegation, and colorful usage display
 * Validates CLI requirements (47e56d3d-7975-4a89-99ea-d51c4b7ef3a0)
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { DefaultCLI } from '../../components/IOR/0.3.0.0/src/ts/layer5/DefaultCLI.js';
import { DefaultONCE } from '../../components/ONCE/0.3.0.0/src/ts/layer2/DefaultONCE.js';
import { DefaultHttpServer } from '../../components/HttpServer/0.3.0.0/src/ts/layer2/DefaultHttpServer.js';
import { DefaultBuild } from '../../components/Build/0.3.0.0/src/ts/layer2/DefaultBuild.js';

describe('CLI Functionality Testing', () => {
  let consoleSpy: any;

  beforeEach(() => {
    // Spy on console.log to capture output
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Universal CLI Implementation', () => {
    test('DefaultCLI initializes with component correctly', () => {
      const once = new DefaultONCE();
      const cli = DefaultCLI.createForComponent(once, 'ONCE');
      
      expect(cli).toBeDefined();
    });

    test('CLI delegates start command to component', async () => {
      const once = new DefaultONCE();
      const startSpy = vi.spyOn(once, 'start').mockResolvedValue();
      
      const cli = DefaultCLI.createForComponent(once, 'ONCE');
      await cli.start(['test']);
      
      expect(startSpy).toHaveBeenCalledWith(['test']);
    });

    test('CLI delegates stop command to component', async () => {
      const once = new DefaultONCE();
      const stopSpy = vi.spyOn(once, 'stop').mockResolvedValue();
      
      const cli = DefaultCLI.createForComponent(once, 'ONCE');
      await cli.stop(['test']);
      
      expect(stopSpy).toHaveBeenCalledWith(['test']);
    });

    test('CLI handles unknown commands gracefully', async () => {
      const once = new DefaultONCE();
      const cli = DefaultCLI.createForComponent(once, 'ONCE');
      
      await expect(cli.execute('unknownCommand', [])).rejects.toThrow('Unknown command');
    });
  });

  describe('Colorful Usage Display', () => {
    test('CLI shows colorful help when component has no custom help', async () => {
      const build = new DefaultBuild();
      const cli = DefaultCLI.createForComponent(build, 'Build');
      
      await cli.help([]);
      
      // Verify colorful output was generated
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Web4 Build CLI Tool'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Commands:'));
    });

    test('CLI shows component-specific commands when available', async () => {
      const once = new DefaultONCE();
      const cli = DefaultCLI.createForComponent(once, 'ONCE');
      
      await cli.help([]);
      
      // Should show ONCE-specific commands
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Component-Specific Commands:'));
    });
  });

  describe('Component-Specific CLI Implementation', () => {
    test('ONCE CLI executes component-specific commands', async () => {
      const once = new DefaultONCE();
      const cli = DefaultCLI.createForComponent(once, 'ONCE');
      
      // Test ONCE-specific command
      const bootSpy = vi.spyOn(once, 'boot').mockResolvedValue();
      await cli.execute('boot', []);
      
      expect(bootSpy).toHaveBeenCalled();
    });

    test('HttpServer CLI executes server-specific commands', async () => {
      const httpServer = new DefaultHttpServer();
      const cli = DefaultCLI.createForComponent(httpServer, 'HttpServer');
      
      // Test HttpServer-specific command
      const addRouteSpy = vi.spyOn(httpServer, 'addRoute').mockResolvedValue();
      await cli.execute('addRoute', ['GET', '/test']);
      
      expect(addRouteSpy).toHaveBeenCalledWith(['GET', '/test']);
    });
  });

  describe('CLI Error Handling', () => {
    test('CLI handles component method errors gracefully', async () => {
      const once = new DefaultONCE();
      const cli = DefaultCLI.createForComponent(once, 'ONCE');
      
      // Mock component method to throw error
      vi.spyOn(once, 'start').mockRejectedValue(new Error('Test error'));
      
      await expect(cli.start([])).rejects.toThrow('Test error');
    });

    test('CLI provides helpful error messages for missing methods', async () => {
      const build = new DefaultBuild();
      const cli = DefaultCLI.createForComponent(build, 'Build');
      
      await expect(cli.execute('nonExistentMethod', [])).rejects.toThrow('Unknown command');
    });
  });

  describe('CLI Integration with Service Modes', () => {
    test('Component start command detects service mode flags', async () => {
      const httpServer = new DefaultHttpServer();
      const startAsServiceSpy = vi.spyOn(httpServer, 'startAsService').mockResolvedValue();
      
      await httpServer.start(['--service']);
      
      expect(startAsServiceSpy).toHaveBeenCalled();
    });

    test('Component start command uses hybrid mode when ONCE server available', async () => {
      const httpServer = new DefaultHttpServer();
      const startStandaloneSpy = vi.spyOn(httpServer, 'startStandalone').mockResolvedValue();
      const registerAsServiceSpy = vi.spyOn(httpServer, 'registerAsService').mockResolvedValue();
      
      await httpServer.start([]); // No service flag but ONCE server available
      
      expect(startStandaloneSpy).toHaveBeenCalled();
      expect(registerAsServiceSpy).toHaveBeenCalled();
    });
  });
});