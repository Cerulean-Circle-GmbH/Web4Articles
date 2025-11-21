/**
 * DefaultRemoteController - RemoteController Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { RemoteController } from '../layer3/RemoteController.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { RemoteControllerModel } from '../layer3/RemoteControllerModel.interface.js';
import { User } from '../layer3/User.interface.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class DefaultRemoteController implements RemoteController {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Changed to public for Component interface compliance
  model: RemoteControllerModel;
  private web4ts?: any; // Lazy-initialized Web4TSComponent for delegation (dynamic import, no static dependency)
  private user?: User; // Optional User service (lazy initialization) - @pdca 2025-11-03-1135.pdca.md
  private methods: Map<string, MethodSignature> = new Map(); // @pdca 2025-11-05-UTC-2301 - Match Web4TSComponent type
  private playwright?: any; // Lazy-loaded Playwright
  private browser?: any; // Playwright browser instance
  private context?: any; // Playwright browser context
  private pages: Map<string, any> = new Map(); // Track pages by application name
  private clickListeners: Array<(appName: string, element: any) => void> = [];
  
  /**
   * Read tracked Cursor PID from file
   * @cliHide
   */
  private async readCursorPid(): Promise<number | null> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const os = await import('os');
      const pidFile = path.join(os.tmpdir(), 'remotecontroller-cursor.pid');
      const pidStr = await fs.readFile(pidFile, 'utf-8');
      const pid = parseInt(pidStr.trim(), 10);
      return isNaN(pid) ? null : pid;
    } catch {
      return null;
    }
  }
  
  /**
   * Write tracked Cursor PID to file
   * @cliHide
   */
  private async writeCursorPid(pid: number): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const os = await import('os');
      const pidFile = path.join(os.tmpdir(), 'remotecontroller-cursor.pid');
      await fs.writeFile(pidFile, pid.toString(), 'utf-8');
      console.log(`   📝 Tracked PID ${pid} in ${pidFile}`);
    } catch (error) {
      // Log error but don't fail - PID tracking is optional
      console.error(`   ⚠️  Failed to write PID file: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Clear tracked Cursor PID file
   * @cliHide
   */
  private async clearCursorPid(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const os = await import('os');
      const pidFile = path.join(os.tmpdir(), 'remotecontroller-cursor.pid');
      await fs.unlink(pidFile);
    } catch {
      // File doesn't exist, that's okay
    }
  }

  constructor() {
    // Empty constructor - Web4 pattern
    // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Initialize with component name for CLI display
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      component: 'RemoteController',  // For CLI display
      version: '0.1.0.0'             // Component version
    };
  }

  /**
   * Check if method exists (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  hasMethod(name: string): boolean {
    return this.methods.has(name);
  }
  
  /**
   * Get method signature (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  getMethodSignature(name: string): MethodSignature | null {
    return this.methods.get(name) || null;
  }
  
  /**
   * List all method names (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  listMethods(): string[] {
    return Array.from(this.methods.keys());
  }

  /**
   * Discover public methods for CLI completion
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  private discoverMethods(): void {
    const prototype = Object.getPrototypeOf(this);
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter((name) => typeof prototype[name] === "function")
      .filter((name) => !name.startsWith("_") && name !== "constructor")
      .filter((name) => !["init", "toScenario", "hasMethod", "getMethodSignature", "listMethods", "discoverMethods"].includes(name));

    for (const methodName of methodNames) {
      const method = prototype[methodName];
      this.methods.set(methodName, {
        name: methodName,
        paramCount: method.length,
        isAsync: method.constructor.name === "AsyncFunction",
      });
    }
  }

  /**
   * Lazy initialization of User service for owner data generation
   * NOT a build dependency - warns if unavailable, continues with fallback
   * @pdca 2025-11-03-1135.pdca.md - User service integration pattern
   * @cliHide
   */
  private async getUser(): Promise<User> {
    if (this.user) return this.user;
    
    try {
      // Dynamic ESM import - fails gracefully if User not available
      // @ts-ignore - Optional dependency, path resolved at runtime
      const userModule = await import('../../User/latest/dist/ts/layer2/DefaultUser.js');
      const { DefaultUser } = userModule;
      
      // Initialize User with empty constructor (uses system/localhost defaults)
      this.user = new DefaultUser();
      
      return this.user!; // Non-null assertion: we just assigned it
    } catch (error) {
      // User service not available - throw for caller to handle fallback
      throw new Error('User service not available');
    }
  }

  /**
   * Lazy initialization of Web4TSComponent for delegation (DRY principle)
   * Dynamic imports resolve paths at runtime, enabling location-independent operation
   * @cliHide
   */
  private async getWeb4TSComponent(): Promise<any> {
    if (this.web4ts) return this.web4ts;

    const path = await import('path');
    const url = new URL(import.meta.url);
    const __filename = url.pathname;
    const componentRoot = path.resolve(path.dirname(__filename), '../../..');

    // @pdca 2025-11-10-UTC-1230.test-isolation-path-pollution-analysis.pdca.md
    // Web4 Principle: Detect project root correctly for test isolation
    // Component path: .../test/data/components/ComponentName/0.1.0.0
    // OR: .../components/ComponentName/0.1.0.0
    // Project root is 2 levels up from component directory
    // (ComponentName/ and components/)
    const componentsDir = path.dirname(path.dirname(componentRoot)); // Go up 2: version → component → components
    const projectRoot = path.dirname(componentsDir); // Go up 1 more: components → project root
    
    // @pdca 2025-11-10-UTC-1230.test-isolation-path-pollution-analysis.pdca.md
    // Web4 Principle: Detect test isolation from model paths, NOT environment variables
    // Test isolation: projectRoot contains '/test/data'
    const isTestIsolation = projectRoot.includes('/test/data');
    
    // @pdca 2025-11-10-UTC-1010.pdca.md - Set THIS component's paths for delegation
    // When Web4TSComponent reads context, it needs to know THIS component's paths
    this.model.componentRoot = componentRoot;
    this.model.projectRoot = projectRoot;
    this.model.targetDirectory = projectRoot;
    this.model.targetComponentRoot = componentRoot;
    this.model.isTestIsolation = isTestIsolation;

    // Import Web4TSComponent and SemanticVersion dynamically
    const web4tscomponentModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js`
    );
    const semanticVersionModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/SemanticVersion.js`
    );
    const { DefaultWeb4TSComponent } = web4tscomponentModule;
    const { SemanticVersion } = semanticVersionModule;

    // ✅ CRITICAL: Initialize Web4TSComponent for delegation
    // @pdca 2025-11-03-UTC-1237.pdca.md - Full delegation initialization
    // @pdca 2025-11-04-UTC-1630.pdca.md - Added projectRoot for version display fix
    // @pdca 2025-11-10-UTC-1010.pdca.md - DO NOT override component identity!
    // Web4TSComponent must retain its own identity ('Web4TSComponent')
    // The delegating component's identity will be set via context in delegateToWeb4TS()
    this.web4ts = new DefaultWeb4TSComponent().init({
      model: {
        // DO NOT set 'component' here - let Web4TSComponent keep its own identity
        version: await SemanticVersion.fromString(this.model.version || '0.0.0.0'), // THIS component's version
        componentRoot: componentRoot,              // THIS component's root directory
        projectRoot: projectRoot,                  // Project root for Path Authority (version display needs this)
        targetDirectory: projectRoot               // Project root for path authority
      }
    });

    return this.web4ts;
  }

  /**
   * ✅ REMOVED: delegateToWeb4TS() helper method
   * 
   * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
   * 
   * This method is NO LONGER NEEDED! DelegationProxy automatically intercepts
   * missing method calls and delegates them to Web4TSComponent with proper context.
   * 
   * The old pattern was:
   *   private async delegateToWeb4TS(method, ...args) { ... }
   * 
   * The new pattern is:
   *   DelegationProxy.start(component) wraps the component in a Proxy
   *   that automatically delegates missing methods.
   * 
   * Benefits:
   *   - Zero boilerplate in generated components
   *   - Automatic delegation of ALL Web4TSComponent methods
   *   - DRY: delegation logic is in ONE place (DelegationProxy)
   */

  /**
   * @cliHide
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * ✅ RADICAL OOP: Component knows ONLY its own methods
   */
  async init(scenario?: Scenario<RemoteControllerModel>): Promise<this> {
    if (scenario?.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    
    // Discover OWN methods only (Radical OOP)
    this.discoverMethods();
    
    // @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
    // ❌ REMOVED: Component should NOT discover delegated methods
    // ✅ RADICAL OOP: CLI discovers delegated methods separately via getDelegationTarget()
    // Component knows ONLY its own methods (create, process, completion)
    
    return this;
  }

  /**
   * @cliHide
   * @pdca 2025-11-03-1135.pdca.md - Use User service with fallback pattern
   */
  async toScenario(name?: string): Promise<Scenario<RemoteControllerModel>> {
    // ✅ RADICAL OOP: Generate owner data using User.toScenario() (Web4 component interface)
    let ownerData: string;
    try {
      // Try to use User service if available (NOT a build dependency)
      const user = await this.getUser();
      
      // ✅ Use User component's toScenario() - universal Web4 interface
      const userScenario = await user.toScenario();
      
      // ✅ Owner data IS the entire User scenario serialized
      const ownerJson = JSON.stringify(userScenario);
      
      ownerData = Buffer.from(ownerJson).toString('base64');
    } catch (error) {
      // ✅ Fallback: Generate minimal User-like scenario without User service
      const fallbackJson = JSON.stringify({
        ior: {
          uuid: this.model.uuid,
          component: 'User',
          version: '0.0.0.0',
          timestamp: new Date().toISOString()
        },
        owner: '',  // No nested owner in fallback
        model: {
          user: process.env.USER || 'system',
          hostname: process.env.HOSTNAME || 'localhost',
          uuid: this.model.uuid,
          component: 'RemoteController',
          version: '0.1.0.0'
        }
      });
      ownerData = Buffer.from(fallbackJson).toString('base64');
    }

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'RemoteController',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Initialize Playwright browser for remote control
   * @cliHide
   */
  private async getPlaywright(): Promise<any> {
    if (this.playwright) return this.playwright;
    
    try {
      // Dynamic import to avoid build-time dependency issues
      // @ts-ignore - Dynamic import resolved at runtime
      const playwrightModule = await import('playwright');
      this.playwright = playwrightModule;
      return this.playwright;
    } catch (error) {
      // Try alternative import path
      try {
        // @ts-ignore - Dynamic import resolved at runtime
        const playwrightModule = await import('playwright-core');
        this.playwright = playwrightModule;
        return this.playwright;
      } catch (error2) {
        throw new Error('Playwright not installed. Run: npm install playwright');
      }
    }
  }

  /**
   * Start Playwright browser context for remote control
   * @cliHide
   */
  private async ensureBrowserContext(): Promise<void> {
    if (this.context) return;
    
    const pw = await this.getPlaywright();
    // Use chromium for desktop automation
    this.browser = await pw.chromium.launch({
      headless: false,
      args: ['--remote-debugging-port=9222']
    });
    
    this.context = await this.browser.newContext({
      viewport: null, // Use full screen
      ignoreHTTPSErrors: true
    });
  }

  /**
   * Start an application by name
   * @param appName Application name (e.g., "Safari", "Chrome", "Finder", "Terminal")
   * @cliSyntax appName
   */
  async startApp(appName: string): Promise<this> {
    console.log(`🚀 Starting application: ${appName}`);
    
    try {
      const platform = process.platform;
      let command: string;
      
      if (platform === 'darwin') {
        // macOS: Use 'open' command
        command = `open -a "${appName}"`;
      } else if (platform === 'win32') {
        // Windows: Use start command
        command = `start "" "${appName}"`;
      } else {
        // Linux: Try common launchers
        command = `${appName.toLowerCase()} &`;
      }
      
      await execAsync(command);
      console.log(`✅ Application started: ${appName}`);
      
      // Wait a bit for app to launch
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to connect to the application with Playwright
      await this.connectToApp(appName);
      
    } catch (error) {
      console.error(`❌ Failed to start application: ${appName}`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
    
    return this;
  }

  /**
   * Start Cursor IDE
   * @param path Optional path or file to open in Cursor
   * @cliSyntax path
   */
  async startCursor(path?: string): Promise<this> {
    console.log(`🚀 Starting Cursor IDE...`);
    
    try {
      const platform = process.platform;
      let cursorPath = '';
      let resolvedPath: string | undefined = undefined;
      
      // Get project root from model if available, otherwise use cwd
      const projectRoot = this.model.projectRoot || process.cwd();
      
      // FIRST: Check if we already have a tracked PID
      const trackedPid = await this.readCursorPid();
      
      if (trackedPid) {
        // We have a tracked PID - check if it's still running
        let trackedPidStillRunning = false;
        
        if (platform === 'darwin') {
          try {
            const { stdout } = await execAsync(`ps -p ${trackedPid} -o pid=`);
            trackedPidStillRunning = stdout.trim() === String(trackedPid);
          } catch {
            trackedPidStillRunning = false;
          }
        } else if (platform === 'win32') {
          try {
            const { stdout } = await execAsync(`tasklist /FI "PID eq ${trackedPid}" /FO CSV | findstr ${trackedPid}`);
            trackedPidStillRunning = !!stdout;
          } catch {
            trackedPidStillRunning = false;
          }
        } else {
          try {
            const { stdout } = await execAsync(`ps -p ${trackedPid} -o pid=`);
            trackedPidStillRunning = stdout.trim() === String(trackedPid);
          } catch {
            trackedPidStillRunning = false;
          }
        }
        
        if (trackedPidStillRunning) {
          // Activate the tracked instance (bring to front)
          if (platform === 'darwin') {
            // Use osascript to activate the specific process
            try {
              await execAsync(`osascript -e 'tell application "System Events" to set frontmost of process id ${trackedPid} to true'`);
            } catch {
              // Fallback: use open -a to bring Cursor to front
              await execAsync(`open -a Cursor`);
            }
          } else if (platform === 'win32') {
            // Windows: Use tasklist to find the window and activate it
            await execAsync(`powershell -Command "Get-Process -Id ${trackedPid} | ForEach-Object { [Microsoft.VisualBasic.Interaction]::AppActivate($_.Id) }"`);
          } else {
            // Linux: Use wmctrl or xdotool to activate
            try {
              await execAsync(`wmctrl -ia $(wmctrl -lp | grep ${trackedPid} | awk '{print $1}' | head -1)`);
            } catch {
              // Fallback: just bring to front if possible
              await execAsync(`xdotool windowactivate $(xdotool search --pid ${trackedPid} | head -1)`);
            }
          }
          
          console.log(`✅ Cursor IDE activated (tracked instance, PID: ${trackedPid})`);
          console.log(`   ℹ️  Activated previously tracked instance`);
          return this;
        } else {
          // Tracked PID is no longer running - it was killed/merged by Cursor
          // Don't create another new instance - just activate the existing one
          console.log(`⚠️  Tracked Cursor instance (PID: ${trackedPid}) is no longer running`);
          console.log(`   ℹ️  It was likely merged/killed by Cursor's single-instance mechanism`);
          console.log(`   ℹ️  Activating existing Cursor instance instead`);
          
          // Activate the existing Cursor instance (if any)
          if (platform === 'darwin') {
            try {
              await execAsync(`open -a Cursor`);
            } catch {
              // Ignore errors
            }
          }
          
          // Clear the dead PID and don't track anything new
          await this.clearCursorPid();
          console.log(`✅ Cursor IDE activated (existing instance)`);
          console.log(`   ⚠️  No new instance tracked - Cursor prevents multiple instances`);
          return this;
        }
      }
      
      // No tracked PID - check if Cursor is already running
      // If it is, we should activate it instead of creating a new instance that will be killed
      let existingPidsBefore = new Set<number>();
      
      if (platform === 'darwin') {
        // macOS: Get main Cursor processes (not Helper processes)
        try {
          const { stdout: beforeStdout } = await execAsync(`ps aux | grep -i "Cursor.app/Contents/MacOS/Cursor" | grep -v "Helper" | grep -v grep | awk '{print $2}'`);
          const beforePids = beforeStdout.trim().split('\n').filter(line => line.trim());
          beforePids.forEach(line => {
            const pid = parseInt(line.trim(), 10);
            if (!isNaN(pid) && pid > 0) existingPidsBefore.add(pid);
          });
        } catch {
          // No existing processes - that's okay
        }
      } else if (platform === 'win32') {
        // Windows: Get Cursor.exe processes
        try {
          const { stdout: beforeStdout } = await execAsync(`tasklist /FI "IMAGENAME eq Cursor.exe" /FO CSV | findstr Cursor.exe`);
          const lines = beforeStdout.trim().split('\n').filter(line => line.trim());
          lines.forEach(line => {
            const match = line.match(/"([^"]+)","([^"]+)"/);
            if (match && match[2]) {
              const pid = parseInt(match[2], 10);
              if (!isNaN(pid) && pid > 0) existingPidsBefore.add(pid);
            }
          });
        } catch {
          // No existing processes - that's okay
        }
      } else {
        // Linux: Get cursor processes
        try {
          const { stdout: beforeStdout } = await execAsync(`pgrep -f cursor`);
          const beforePids = beforeStdout.trim().split('\n').filter(line => line.trim());
          beforePids.forEach(line => {
            const pid = parseInt(line.trim(), 10);
            if (!isNaN(pid) && pid > 0) existingPidsBefore.add(pid);
          });
        } catch {
          // No existing processes - that's okay
        }
      }
      
      const cursorAlreadyRunning = existingPidsBefore.size > 0;
      
      // If Cursor is already running and we have no tracked PID, 
      // it means previous attempts to create new instances were killed/merged
      // In this case, just activate the existing instance instead of creating another one
      if (cursorAlreadyRunning) {
        console.log(`⚠️  Cursor is already running (PIDs: ${Array.from(existingPidsBefore).join(', ')})`);
        console.log(`   ℹ️  Activating existing instance instead of creating a new one`);
        console.log(`   💡 Cursor is single-instance - new instances get merged/killed`);
        
        // Activate the existing instance
        if (platform === 'darwin') {
          try {
            await execAsync(`open -a Cursor`);
          } catch {
            // Ignore errors
          }
        } else if (platform === 'win32') {
          try {
            await execAsync(`powershell -Command "[Microsoft.VisualBasic.Interaction]::AppActivate((Get-Process Cursor).Id)"`);
          } catch {
            // Ignore errors
          }
        } else {
          try {
            await execAsync(`wmctrl -a Cursor`);
          } catch {
            // Ignore errors
          }
        }
        
        console.log(`✅ Cursor IDE activated (existing instance)`);
        console.log(`   ⚠️  No new instance created - Cursor prevents multiple instances`);
        return this;
      }
      
      // Cursor is NOT running - we can safely start a new instance
      if (platform === 'darwin') {
        // macOS: Try common Cursor installation paths
        const cursorPaths = [
          '/Applications/Cursor.app',
          '/Applications/Cursor.app/Contents/MacOS/Cursor',
          process.env.HOME + '/Applications/Cursor.app',
          '/usr/local/bin/cursor'
        ];
        
        for (const testPath of cursorPaths) {
          if (existsSync(testPath)) {
            cursorPath = testPath;
            break;
          }
        }
        
        if (!cursorPath) {
          // Try to find it via mdfind
          try {
            const { stdout } = await execAsync('mdfind "kMDItemCFBundleIdentifier == \'com.todesktop.230313mzl4w4u92\'" | head -1');
            cursorPath = stdout.trim();
          } catch {
            // Fallback to open command which should find it
            cursorPath = 'Cursor';
          }
        }
        
        if (path) {
          // Resolve path relative to project root or current working directory
          const pathModule = await import('path');
          if (pathModule.isAbsolute(path)) {
            resolvedPath = path;
          } else {
            // Use project root if available, otherwise use cwd
            resolvedPath = pathModule.resolve(projectRoot, path);
          }
          // Verify path exists before opening
          if (!existsSync(resolvedPath)) {
            throw new Error(`Path does not exist: ${resolvedPath}`);
          }
        }
        
      } else if (platform === 'win32') {
        // Windows: Try common installation paths
        const cursorPaths = [
          process.env.LOCALAPPDATA + '\\Programs\\cursor\\Cursor.exe',
          process.env.PROGRAMFILES + '\\Cursor\\Cursor.exe',
          process.env['PROGRAMFILES(X86)'] + '\\Cursor\\Cursor.exe'
        ];
        
        for (const testPath of cursorPaths) {
          if (existsSync(testPath)) {
            cursorPath = testPath;
            break;
          }
        }
        
        if (!cursorPath) {
          cursorPath = 'cursor';
        }
        
        if (path) {
          // Resolve path relative to project root or current working directory
          const pathModule = await import('path');
          if (pathModule.isAbsolute(path)) {
            resolvedPath = path;
          } else {
            resolvedPath = pathModule.resolve(projectRoot, path);
          }
          if (!existsSync(resolvedPath)) {
            throw new Error(`Path does not exist: ${resolvedPath}`);
          }
        }
        
      } else {
        // Linux: Try common locations
        const cursorPaths = [
          '/usr/bin/cursor',
          '/usr/local/bin/cursor',
          process.env.HOME + '/.local/bin/cursor',
          '/snap/bin/cursor'
        ];
        
        for (const testPath of cursorPaths) {
          if (existsSync(testPath)) {
            cursorPath = testPath;
            break;
          }
        }
        
        if (!cursorPath) {
          cursorPath = 'cursor';
        }
        
        if (path) {
          // Resolve path relative to project root or current working directory
          const pathModule = await import('path');
          if (pathModule.isAbsolute(path)) {
            resolvedPath = path;
          } else {
            resolvedPath = pathModule.resolve(projectRoot, path);
          }
          if (!existsSync(resolvedPath)) {
            throw new Error(`Path does not exist: ${resolvedPath}`);
          }
        }
      }
      
      // Force a new instance (even if Cursor is already running)
      // We will track the NEW instance's PID
      if (platform === 'darwin') {
        // On macOS, use 'open -n' to FORCE a new instance
        // The -n flag tells macOS to open a new instance even if the app is already running
        const { spawn } = await import('child_process');
        
        // Normalize cursorPath to .app bundle for 'open -n -a'
        let appBundlePath = cursorPath;
        if (cursorPath.endsWith('/Contents/MacOS/Cursor')) {
          // Extract .app bundle path
          appBundlePath = cursorPath.replace('/Contents/MacOS/Cursor', '');
        } else if (!cursorPath.endsWith('.app')) {
          // If it's just 'Cursor', use that (open will find it)
          appBundlePath = 'Cursor';
        }
        
        // Use 'open -n' to force a new instance
        // Add '--args -n' to tell Cursor to open a new window (VSCode/Cursor flag)
        // This combination: macOS forces new instance + Cursor opens new window
        const args = ['-n', '-a', appBundlePath, '--args', '-n'];
        if (resolvedPath) {
          args.push(resolvedPath);
        }
        
        const cursorProcess = spawn('open', args, {
          detached: false,
          stdio: 'ignore'
        });
        cursorProcess.unref(); // Allow parent to exit
        
        // Wait briefly for the 'open' command to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else if (platform === 'win32') {
        // Windows: Start new instance (typically creates new instance by default)
        if (resolvedPath) {
          await execAsync(`start "" "${cursorPath}" "${resolvedPath}"`);
        } else {
          await execAsync(`start "" "${cursorPath}"`);
        }
      } else {
        // Linux: Start new instance
        if (resolvedPath) {
          await execAsync(`${cursorPath} "${resolvedPath}" &`);
        } else {
          await execAsync(`${cursorPath} &`);
        }
      }
      
      // CRITICAL: Check for new PIDs IMMEDIATELY and frequently
      // The new instance appears quickly but may disappear if Cursor merges/kills it
      // We need to catch it within the first few seconds before it's gone
      let allPidsAfter: number[] = [];
      let newPidFound = false;
      
      // Check immediately and frequently (every 500ms) for the first 5 seconds
      // This catches the new PID before Cursor can merge/kill it
      for (let attempt = 0; attempt < 10; attempt++) {
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (platform === 'darwin') {
          // macOS: Get main Cursor processes (not Helper processes)
          try {
            const { stdout } = await execAsync(`ps aux | grep -i "Cursor.app/Contents/MacOS/Cursor" | grep -v "Helper" | grep -v grep | awk '{print $2}'`);
            const pids = stdout.trim().split('\n')
              .filter(line => line.trim())
              .map(line => parseInt(line.trim(), 10))
              .filter(pid => !isNaN(pid) && pid > 0);
            // Merge with existing list
            pids.forEach(pid => {
              if (!allPidsAfter.includes(pid)) {
                allPidsAfter.push(pid);
              }
              // Check if this is a NEW PID (not in existingPidsBefore)
              if (!existingPidsBefore.has(pid) && !newPidFound) {
                newPidFound = true;
                // Found a new PID! Track it immediately before it disappears
                console.log(`   🔍 Detected new Cursor PID: ${pid} (attempt ${attempt + 1})`);
              }
            });
          } catch {
            // PID detection failed for this attempt
          }
        } else if (platform === 'win32') {
          // Windows: Get Cursor.exe processes
          try {
            const { stdout } = await execAsync(`tasklist /FI "IMAGENAME eq Cursor.exe" /FO CSV | findstr Cursor.exe`);
            const lines = stdout.trim().split('\n').filter(line => line.trim());
            const pids = lines
              .map(line => {
                const match = line.match(/"([^"]+)","([^"]+)"/);
                return match && match[2] ? parseInt(match[2], 10) : NaN;
              })
              .filter(pid => !isNaN(pid) && pid > 0);
            // Merge with existing list
            pids.forEach(pid => {
              if (!allPidsAfter.includes(pid)) {
                allPidsAfter.push(pid);
              }
              // Check if this is a NEW PID (not in existingPidsBefore)
              if (!existingPidsBefore.has(pid) && !newPidFound) {
                newPidFound = true;
                console.log(`   🔍 Detected new Cursor PID: ${pid} (attempt ${attempt + 1})`);
              }
            });
          } catch {
            // PID detection failed for this attempt
          }
        } else {
          // Linux: Get cursor processes
          try {
            const { stdout } = await execAsync(`pgrep -f cursor`);
            const pids = stdout.trim().split('\n')
              .filter(line => line.trim())
              .map(line => parseInt(line.trim(), 10))
              .filter(pid => !isNaN(pid) && pid > 0);
            // Merge with existing list
            pids.forEach(pid => {
              if (!allPidsAfter.includes(pid)) {
                allPidsAfter.push(pid);
              }
              // Check if this is a NEW PID (not in existingPidsBefore)
              if (!existingPidsBefore.has(pid) && !newPidFound) {
                newPidFound = true;
                console.log(`   🔍 Detected new Cursor PID: ${pid} (attempt ${attempt + 1})`);
              }
            });
          } catch {
            // PID detection failed for this attempt
          }
        }
        
        // If we found a new PID, we can stop checking early
        // But continue to collect all PIDs for verification
        if (newPidFound && attempt >= 2) {
          // Found new PID and checked a few times - can proceed
          break;
        }
      }
      
      // Find NEW PIDs (ones that didn't exist before) - this is the instance we just forced
      const newPids = allPidsAfter.filter(pid => !existingPidsBefore.has(pid));
      
      // Track the first new PID we found, even if it disappears quickly
      // Cursor may merge/kill the new instance, but we tracked it when it was created
      if (newPids.length > 0) {
        // We successfully forced a NEW Cursor instance - track it immediately
        // Even if it disappears later, we tracked it when it was created
        const pid = newPids[0];
        await this.writeCursorPid(pid);
        
        // Verify it's still running now (it might have disappeared)
        let stillRunning = false;
        if (platform === 'darwin') {
          try {
            const { stdout } = await execAsync(`ps -p ${pid} -o pid=`);
            stillRunning = stdout.trim() === String(pid);
          } catch {
            stillRunning = false;
          }
        } else if (platform === 'win32') {
          try {
            const { stdout } = await execAsync(`tasklist /FI "PID eq ${pid}" /FO CSV | findstr ${pid}`);
            stillRunning = !!stdout;
          } catch {
            stillRunning = false;
          }
        } else {
          try {
            const { stdout } = await execAsync(`ps -p ${pid} -o pid=`);
            stillRunning = stdout.trim() === String(pid);
          } catch {
            stillRunning = false;
          }
        }
        
        if (stillRunning) {
          // PID is still running - great!
          if (cursorAlreadyRunning) {
            console.log(`✅ Cursor IDE started${path ? ` with path: ${path}` : ''} (forced new instance, PID: ${pid})`);
            console.log(`   ℹ️  Forced a new instance even though Cursor was already running`);
          } else {
            console.log(`✅ Cursor IDE started${path ? ` with path: ${path}` : ''} (new instance, PID: ${pid})`);
          }
          console.log(`   ℹ️  This instance can be stopped with: remotecontroller stopCursor`);
        } else {
          // PID was tracked but has already disappeared (Cursor merged/killed it)
          // This is okay - we tracked it when it was created, and stopCursor will handle it
          if (cursorAlreadyRunning) {
            console.log(`✅ Cursor IDE started${path ? ` with path: ${path}` : ''} (forced new instance, PID: ${pid})`);
            console.log(`   ⚠️  New instance was created but has already been merged/closed by Cursor`);
            console.log(`   ℹ️  PID ${pid} was tracked - stopCursor will attempt to stop it if it still exists`);
          } else {
            console.log(`✅ Cursor IDE started${path ? ` with path: ${path}` : ''} (new instance, PID: ${pid})`);
            console.log(`   ⚠️  Instance PID ${pid} was tracked but process has already ended`);
          }
          console.log(`   ℹ️  This instance can be stopped with: remotecontroller stopCursor`);
        }
      } else {
        // Could not force a new instance - Cursor is likely single-instance
        // DO NOT track existing PIDs - we only track PIDs we create
        console.log(`✅ Cursor IDE started${path ? ` with path: ${path}` : ''}`);
        if (cursorAlreadyRunning) {
          console.log(`   ⚠️  Cursor is single-instance - could not force a new instance`);
          console.log(`   ⚠️  Existing Cursor instance was activated, but NOT tracked`);
          console.log(`   ⚠️  stopCursor will NOT work - no new instance was created`);
          console.log(`   💡 Only NEW instances created by startCursor can be stopped`);
        } else {
          console.log(`   ⚠️  Could not detect new Cursor process - PID tracking unavailable`);
          console.log(`   ⚠️  stopCursor will not work for this instance`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Failed to start Cursor IDE`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`   💡 Make sure Cursor is installed and in your PATH`);
      console.error(`   💡 On macOS, you can also try: remotecontroller startApp Cursor`);
      throw error;
    }
    
    return this;
  }

  /**
   * Stop Cursor IDE that was started with startCursor
   * Only stops the specific Cursor instance that was started by this component
   * @cliSyntax
   */
  async stopCursor(): Promise<this> {
    console.log(`🛑 Stopping Cursor IDE...`);
    
    // Read PID from file
    const cursorPid = await this.readCursorPid();
    
    if (!cursorPid) {
      console.log(`⚠️ No Cursor PID tracked. Cannot stop specific instance.`);
      console.log(`   💡 Only NEW Cursor instances started with 'startCursor' are tracked.`);
      console.log(`   💡 Existing Cursor instances are NOT tracked to prevent accidental termination.`);
      return this;
    }
    
    try {
      const platform = process.platform;
      
      // CRITICAL: Verify the process still exists and is actually Cursor
      // Also verify it's the MAIN process, not a helper
      let processExists = false;
      let isCursorMainProcess = false;
      
      if (platform === 'darwin') {
        try {
          // Check if process exists and get full command line
          const { stdout } = await execAsync(`ps -p ${cursorPid} -o command=`);
          const command = stdout.trim();
          // Must be the main Cursor process, not a Helper
          isCursorMainProcess = command.includes('Cursor.app/Contents/MacOS/Cursor') && 
                                !command.includes('Helper');
          processExists = !!command;
        } catch {
          processExists = false;
        }
      } else if (platform === 'win32') {
        try {
          const { stdout } = await execAsync(`tasklist /FI "PID eq ${cursorPid}" /FO CSV | findstr ${cursorPid}`);
          isCursorMainProcess = stdout.includes('Cursor.exe') && !stdout.includes('Helper');
          processExists = !!stdout;
        } catch {
          processExists = false;
        }
      } else {
        try {
          const { stdout } = await execAsync(`ps -p ${cursorPid} -o command=`);
          const command = stdout.trim();
          isCursorMainProcess = command.toLowerCase().includes('cursor') && 
                                !command.toLowerCase().includes('helper');
          processExists = !!command;
        } catch {
          processExists = false;
        }
      }
      
      if (!processExists) {
        console.log(`⚠️ Process ${cursorPid} no longer exists.`);
        await this.clearCursorPid();
        return this;
      }
      
      if (!isCursorMainProcess) {
        console.log(`⚠️ Process ${cursorPid} is not the main Cursor process. Refusing to stop.`);
        console.log(`   💡 This prevents accidentally stopping helper processes.`);
        await this.clearCursorPid();
        return this;
      }
      
      // Double-check: Count total Cursor processes before stopping
      let totalCursorProcesses = 0;
      try {
        if (platform === 'darwin') {
          const { stdout } = await execAsync(`ps aux | grep -i "Cursor.app/Contents/MacOS/Cursor" | grep -v "Helper" | grep -v grep | wc -l`);
          totalCursorProcesses = parseInt(stdout.trim(), 10) || 0;
        } else if (platform === 'win32') {
          const { stdout } = await execAsync(`tasklist /FI "IMAGENAME eq Cursor.exe" /FO CSV | find /C "Cursor.exe"`);
          totalCursorProcesses = parseInt(stdout.trim(), 10) || 0;
        } else {
          const { stdout } = await execAsync(`ps aux | grep -i cursor | grep -v helper | grep -v grep | wc -l`);
          totalCursorProcesses = parseInt(stdout.trim(), 10) || 0;
        }
      } catch {
        // Can't count, proceed with caution
      }
      
      if (totalCursorProcesses > 1) {
        console.log(`⚠️ WARNING: Multiple Cursor instances detected (${totalCursorProcesses} total).`);
        console.log(`   Only stopping the tracked instance (PID: ${cursorPid}).`);
        console.log(`   Other instances will remain running.`);
      }
      
      // Gracefully stop ONLY the tracked process
      if (platform === 'darwin' || platform === 'linux') {
        // Send SIGTERM first (graceful shutdown) - only to the specific PID
        try {
          process.kill(cursorPid, 'SIGTERM');
          console.log(`   Sent SIGTERM to tracked process ${cursorPid} only`);
          
          // Wait a bit for graceful shutdown
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if process still exists
          try {
            await execAsync(`ps -p ${cursorPid}`);
            // Process still exists, send SIGKILL to THIS PID ONLY
            console.log(`   Process still running, sending SIGKILL to PID ${cursorPid} only...`);
            process.kill(cursorPid, 'SIGKILL');
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch {
            // Process already terminated
          }
          
          console.log(`✅ Tracked Cursor IDE instance stopped (PID: ${cursorPid})`);
        } catch (error) {
          console.error(`❌ Failed to stop Cursor IDE`);
          console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        // Windows: Use taskkill with /PID (not /IM which would kill all)
        try {
          await execAsync(`taskkill /PID ${cursorPid} /T`);
          console.log(`✅ Tracked Cursor IDE instance stopped (PID: ${cursorPid})`);
        } catch (error) {
          // Try force kill if normal kill fails - STILL only this PID
          try {
            await execAsync(`taskkill /PID ${cursorPid} /F /T`);
            console.log(`✅ Tracked Cursor IDE instance force stopped (PID: ${cursorPid})`);
          } catch (error2) {
            console.error(`❌ Failed to stop Cursor IDE`);
            console.error(`   Error: ${error2 instanceof Error ? error2.message : String(error2)}`);
          }
        }
      }
      
      // Clear the tracked PID
      await this.clearCursorPid();
      
    } catch (error) {
      console.error(`❌ Failed to stop Cursor IDE`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return this;
  }

  /**
   * Connect to an existing application window
   * @param appName Application name to connect to
   * @cliHide
   */
  private async connectToApp(appName: string): Promise<void> {
    try {
      const pw = await this.getPlaywright();
      const browserName = appName.toLowerCase();
      
      // Check if it's a web browser that supports CDP
      const cdpBrowsers = ['chrome', 'chromium', 'edge', 'brave'];
      const isCDPBrowser = cdpBrowsers.some(b => browserName.includes(b));
      
      if (isCDPBrowser) {
        // Try to connect via CDP (Chrome DevTools Protocol)
        try {
          const browser = await pw.chromium.connectOverCDP('http://localhost:9222');
          const contexts = browser.contexts();
          
          if (contexts.length > 0) {
            const context = contexts[0];
            const pages = context.pages();
            
            if (pages.length > 0) {
              this.pages.set(appName, pages[0]);
              console.log(`✅ Connected to ${appName} via CDP`);
              return;
            }
          }
          
          // If no existing pages, create a new one
          const context = await browser.newContext();
          const page = await context.newPage();
          this.pages.set(appName, page);
          console.log(`✅ Connected to ${appName} via CDP (new page)`);
          return;
        } catch (cdpError) {
          console.log(`⚠️ CDP connection failed, trying standard connection...`);
        }
      }
      
      // For non-CDP browsers or if CDP fails, use standard connection
      await this.ensureBrowserContext();
      const page = await this.context.newPage();
      this.pages.set(appName, page);
      
      console.log(`✅ Connected to: ${appName}`);
    } catch (error) {
      console.warn(`⚠️ Could not fully connect to ${appName}, but app was started`);
      console.warn(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Identify the currently focused application and UI field
   * @cliSyntax
   */
  async identifyCurrentField(): Promise<this> {
    console.log(`🔍 Identifying current application and UI field...`);
    
    try {
      const platform = process.platform;
      
      if (platform === 'darwin') {
        // macOS: Use AppleScript to get focused app and element
        const script = `
          tell application "System Events"
            set frontApp to name of first application process whose frontmost is true
            set frontWindow to name of first window of process frontApp
            return frontApp & "|" & frontWindow
          end tell
        `;
        
        const { stdout } = await execAsync(`osascript -e '${script}'`);
        const [appName, windowName] = stdout.trim().split('|');
        
        console.log(`📱 Application: ${appName}`);
        console.log(`🪟 Window: ${windowName}`);
        console.log(`📍 Current field: (Use identifyClickedElement to get specific field)`);
        
        // Try to get more details using accessibility
        await this.getAccessibilityInfo(appName);
        
      } else if (platform === 'win32') {
        // Windows: Use PowerShell to get focused window
        const script = `
          Add-Type @"
            using System;
            using System.Runtime.InteropServices;
            public class Win32 {
              [DllImport("user32.dll")]
              public static extern IntPtr GetForegroundWindow();
              [DllImport("user32.dll")]
              public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count);
            }
"@
          $hwnd = [Win32]::GetForegroundWindow()
          $title = New-Object System.Text.StringBuilder 256
          [Win32]::GetWindowText($hwnd, $title, 256)
          $title.ToString()
        `;
        
        const { stdout } = await execAsync(`powershell -Command "${script}"`);
        console.log(`📱 Active Window: ${stdout.trim()}`);
        
      } else {
        // Linux: Use xdotool or similar
        try {
          const { stdout } = await execAsync('xdotool getactivewindow getwindowname');
          console.log(`📱 Active Window: ${stdout.trim()}`);
        } catch {
          console.log(`⚠️ xdotool not available. Install with: sudo apt-get install xdotool`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Failed to identify current field`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return this;
  }

  /**
   * Get accessibility information for an application (macOS)
   * @cliHide
   */
  private async getAccessibilityInfo(appName: string): Promise<void> {
    try {
      // Try multiple approaches to get focused element info
      const script = `
        tell application "System Events"
          tell process "${appName}"
            try
              -- Approach 1: Try to get focused element from process
              set focusedElement to value of attribute "AXFocusedUIElement"
              if focusedElement is not missing value then
                set elementRole to value of attribute "AXRole" of focusedElement
                set elementTitle to value of attribute "AXTitle" of focusedElement
                set elementValue to value of attribute "AXValue" of focusedElement
                set elementDescription to value of attribute "AXDescription" of focusedElement
                set elementIdentifier to value of attribute "AXIdentifier" of focusedElement
                
                set roleStr to elementRole as string
                set titleStr to (elementTitle as string)
                set valueStr to (elementValue as string)
                set descStr to (elementDescription as string)
                set idStr to (elementIdentifier as string)
                
                return "FOCUSED|" & roleStr & "|" & titleStr & "|" & valueStr & "|" & descStr & "|" & idStr
              end if
            on error
              -- Approach 2: Try to get focused element from main window
              try
                set mainWindow to first window whose value of attribute "AXMain" is true
                set focusedElement to value of attribute "AXFocusedUIElement" of mainWindow
                if focusedElement is not missing value then
                  set elementRole to value of attribute "AXRole" of focusedElement
                  set elementTitle to value of attribute "AXTitle" of focusedElement
                  set elementValue to value of attribute "AXValue" of focusedElement
                  set elementDescription to value of attribute "AXDescription" of focusedElement
                  set elementIdentifier to value of attribute "AXIdentifier" of focusedElement
                  
                  set roleStr to elementRole as string
                  set titleStr to (elementTitle as string)
                  set valueStr to (elementValue as string)
                  set descStr to (elementDescription as string)
                  set idStr to (elementIdentifier as string)
                  
                  return "WINDOW_FOCUSED|" & roleStr & "|" & titleStr & "|" & valueStr & "|" & descStr & "|" & idStr
                end if
              on error
                -- Approach 3: For Cursor/VS Code, try to find text areas
                try
                  set mainWindow to first window whose value of attribute "AXMain" is true
                  set allGroups to every group of mainWindow
                  repeat with aGroup in allGroups
                    try
                      set textAreas to every text area of aGroup
                      if (count of textAreas) > 0 then
                        set textArea to item 1 of textAreas
                        set textValue to value of attribute "AXValue" of textArea
                        set textRole to value of attribute "AXRole" of textArea
                        -- Check if the text contains the search string
                        if textValue contains "ajalfdkdjnvqinvcnc" then
                          return "TEXT_AREA_FOUND|" & (textRole as string) & "|Editor|" & textValue & "|Contains search text|editor"
                        end if
                        -- Return first text area found (likely the editor)
                        return "TEXT_AREA|" & (textRole as string) & "|Editor|" & (textValue as string) & "|Text editor area|editor"
                      end if
                    end try
                  end repeat
                end try
              end try
            end try
            
            -- Fallback: Return unknown
            return "UNKNOWN|unknown|unknown|unknown|unknown|unknown"
          end tell
        end tell
      `;
      
      const { stdout } = await execAsync(`osascript -e '${script}'`);
      const parts = stdout.trim().split('|');
      const [source, role, title, value, description, identifier] = parts;
      
      if (role && role !== 'unknown') {
        console.log(`   📋 Element Details (${source}):`);
        console.log(`      Role: ${role}`);
        if (title && title !== 'unknown') console.log(`      Title: ${title}`);
        if (value && value !== 'unknown') {
          // Truncate long values for display
          const displayValue = value.length > 200 ? value.substring(0, 200) + '...' : value;
          console.log(`      Value: ${displayValue}`);
          // Check if it contains the search text
          if (value.includes('ajalfdkdjnvqinvcnc')) {
            console.log(`      ✅ FOUND: This field contains your search text!`);
            // Try to find the line/position
            const lines = value.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes('ajalfdkdjnvqinvcnc')) {
                console.log(`      📍 Location: Line ${i + 1} in editor`);
                break;
              }
            }
          }
        }
        if (description && description !== 'unknown') console.log(`      Description: ${description}`);
        if (identifier && identifier !== 'unknown') console.log(`      Identifier: ${identifier}`);
        
        // Generate selector suggestions
        const selectors = this.generateSelectorSuggestions(role, title, identifier, value);
        if (selectors.length > 0) {
          console.log(`   🎯 Suggested Selectors:`);
          selectors.forEach((sel, i) => {
            console.log(`      ${i + 1}. ${sel}`);
          });
        }
      } else {
        console.log(`   ⚠️  Could not retrieve detailed accessibility information`);
        console.log(`   💡 This may require Accessibility permissions in System Settings`);
        console.log(`   💡 For Cursor, the editor content may not be accessible via standard APIs`);
      }
    } catch (error) {
      console.log(`   ⚠️  Accessibility info retrieval failed: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`   💡 This may require Accessibility permissions in System Settings`);
    }
  }

  /**
   * Generate selector suggestions based on element properties
   * @cliHide
   */
  private generateSelectorSuggestions(role: string, title: string, identifier: string, value: string): string[] {
    const selectors: string[] = [];
    
    if (identifier && identifier !== 'unknown') {
      selectors.push(`[id="${identifier}"]`);
      selectors.push(`#${identifier}`);
    }
    
    if (title && title !== 'unknown') {
      selectors.push(`[title="${title}"]`);
      selectors.push(`text="${title}"`);
      // For buttons and links
      if (role === 'AXButton' || role === 'AXLink') {
        selectors.push(`button:has-text("${title}")`);
        selectors.push(`a:has-text("${title}")`);
      }
    }
    
    if (role && role !== 'unknown') {
      const roleMap: { [key: string]: string } = {
        'AXButton': 'button',
        'AXTextField': 'input[type="text"]',
        'AXTextArea': 'textarea',
        'AXCheckBox': 'input[type="checkbox"]',
        'AXRadioButton': 'input[type="radio"]',
        'AXLink': 'a',
        'AXStaticText': 'text',
        'AXImage': 'img'
      };
      
      const htmlRole = roleMap[role];
      if (htmlRole) {
        selectors.push(htmlRole);
      }
    }
    
    if (value && value !== 'unknown' && role === 'AXTextField') {
      selectors.push(`input[value="${value}"]`);
    }
    
    return selectors.slice(0, 5); // Return top 5 suggestions
  }

  /**
   * Start monitoring clicks to identify applications and elements
   * @cliSyntax
   */
  async startMonitoring(): Promise<this> {
    console.log(`👂 Starting click monitoring...`);
    console.log(`   Click on any application window to identify it`);
    console.log(`   Press Ctrl+C to stop monitoring`);
    
    // This would require platform-specific implementation
    // For macOS, we'd use AppleScript or Accessibility APIs
    // For Windows, we'd use Windows API hooks
    // For Linux, we'd use X11 event monitoring
    
    console.log(`⚠️ Full click monitoring requires platform-specific implementation`);
    console.log(`   Use identifyCurrentField after clicking to identify the element`);
    
    return this;
  }

  /**
   * Generate test code for the identified element
   * @param appName Application name
   * @param selector Element selector or identifier
   * @param action Action to perform (click, type, etc.)
   * @param outputFile Optional file path to write test to
   * @cliSyntax appName selector action outputFile
   * @cliDefault action click
   */
  async generateTest(appName: string, selector: string, action: string = 'click', outputFile?: string): Promise<this> {
    console.log(`📝 Generating test code for ${appName}...`);
    
    const testName = `${appName}-${action}-${selector.replace(/[^a-zA-Z0-9]/g, '-')}`.toLowerCase();
    const safeAppName = appName.replace(/[^a-zA-Z0-9]/g, '');
    const safeSelector = selector.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    
    const testCode = `import { test, expect } from '@playwright/test';

test('${safeAppName} - ${action} on element', async ({ page }) => {
  // Navigate to application or connect to existing window
  // For web browsers:
  // await page.goto('http://localhost:3000');
  
  // For native apps, use CDP connection:
  // const browser = await chromium.connectOverCDP('http://localhost:9222');
  // const context = browser.contexts()[0];
  // const page = context.pages()[0];
  
  // Locate element
  const element = page.locator(\`${safeSelector}\`);
  
  // Wait for element to be visible
  await expect(element).toBeVisible({ timeout: 5000 });
  
  // Perform action
  ${this.generateActionCode(action, 'element')}
  
  // Add assertions as needed
  // await expect(element).toBeFocused();
  // await expect(page).toHaveURL('...');
});
`;
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Generated Test Code:`);
    console.log(`${'='.repeat(80)}`);
    console.log(testCode);
    console.log(`${'='.repeat(80)}\n`);
    
    // Write to file if outputFile is provided
    if (outputFile) {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        
        // Ensure directory exists
        const dir = path.dirname(outputFile);
        await fs.mkdir(dir, { recursive: true });
        
        // Write file
        await fs.writeFile(outputFile, testCode, 'utf-8');
        console.log(`✅ Test code written to: ${outputFile}`);
      } catch (error) {
        console.error(`❌ Failed to write test file: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    return this;
  }

  /**
   * Generate action code based on action type
   * @cliHide
   */
  private generateActionCode(action: string, elementVar: string): string {
    const actions: { [key: string]: string } = {
      'click': `await ${elementVar}.click();`,
      'dblclick': `await ${elementVar}.dblclick();`,
      'type': `await ${elementVar}.fill('your text here');`,
      'fill': `await ${elementVar}.fill('your text here');`,
      'press': `await ${elementVar}.press('Enter');`,
      'hover': `await ${elementVar}.hover();`,
      'focus': `await ${elementVar}.focus();`,
      'check': `await ${elementVar}.check();`,
      'uncheck': `await ${elementVar}.uncheck();`,
      'select': `await ${elementVar}.selectOption('option-value');`,
      'screenshot': `await ${elementVar}.screenshot({ path: 'screenshot.png' });`
    };
    
    return actions[action.toLowerCase()] || `await ${elementVar}.click(); // Unknown action: ${action}`;
  }

  /**
   * Navigate to a URL in a browser
   * @param url URL to navigate to
   * @param browserName Optional browser name (default: launches new Chromium)
   * @cliSyntax url browserName
   * @cliDefault browserName chromium
   */
  async navigateTo(url: string, browserName: string = 'chromium'): Promise<this> {
    console.log(`🌐 Navigating to: ${url}`);
    
    try {
      const pw = await this.getPlaywright();
      
      // Ensure browser context exists
      await this.ensureBrowserContext();
      
      // Create or get a page
      let page: any;
      if (this.pages.has(browserName)) {
        page = this.pages.get(browserName);
      } else {
        page = await this.context.newPage();
        this.pages.set(browserName, page);
      }
      
      // Navigate to URL
      await page.goto(url, { waitUntil: 'networkidle' });
      
      console.log(`✅ Navigated to: ${url}`);
      console.log(`   📄 Page title: ${await page.title()}`);
      console.log(`   🔗 Current URL: ${page.url()}`);
      
    } catch (error) {
      console.error(`❌ Failed to navigate to ${url}`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
    
    return this;
  }

  /**
   * Get page elements and their details from the current page
   * @param selector Optional CSS selector to filter elements (default: all interactive elements)
   * @cliSyntax selector
   */
  async getPageElements(selector?: string): Promise<this> {
    console.log(`🔍 Extracting page elements...`);
    
    try {
      // Get the first available page
      let page: any = null;
      for (const [name, p] of this.pages.entries()) {
        page = p;
        console.log(`   Using page: ${name}`);
        break;
      }
      
      if (!page) {
        // Try to get from browser context
        if (this.context) {
          const pages = this.context.pages();
          if (pages.length > 0) {
            page = pages[0];
          }
        }
      }
      
      if (!page) {
        // Try to reconnect to browser via CDP (if browser was launched with --remote-debugging-port=9222)
        try {
          const pw = await this.getPlaywright();
          const browser = await pw.chromium.connectOverCDP('http://localhost:9222');
          const contexts = browser.contexts();
          
          if (contexts.length > 0) {
            const context = contexts[0];
            const pages = context.pages();
            if (pages.length > 0) {
              page = pages[0];
              this.pages.set('chromium', page);
              console.log(`   ✅ Reconnected to browser via CDP`);
            }
          }
        } catch (cdpError) {
          // CDP connection failed, try creating new context
          try {
            await this.ensureBrowserContext();
            if (this.context) {
              const pages = this.context.pages();
              if (pages.length > 0) {
                page = pages[0];
                this.pages.set('chromium', page);
              } else {
                // Create a new page
                page = await this.context.newPage();
                this.pages.set('chromium', page);
                console.log(`   ℹ️  Created new page. Use navigateTo to go to a URL.`);
              }
            }
          } catch (error) {
            console.error(`❌ No page available and could not reconnect to browser.`);
            console.error(`   Please run: remotecontroller navigateTo <url>`);
            return this;
          }
        }
      }
      
      if (!page) {
        console.error(`❌ No page available. Navigate to a URL first.`);
        return this;
      }
      
      // Get page info
      const title = await page.title();
      const url = page.url();
      console.log(`📄 Page: ${title}`);
      console.log(`🔗 URL: ${url}`);
      
      // Extract elements
      const elements = await page.evaluate((sel: string | undefined) => {
        const results: any[] = [];
        const selectors = sel 
          ? [sel]
          : ['button', 'a', 'input', 'textarea', 'select', '[role="button"]', '[role="link"]', '[onclick]'];
        
        selectors.forEach(selector => {
          try {
            const nodes = document.querySelectorAll(selector);
            nodes.forEach((node: Element) => {
              const element = node as HTMLElement;
              const rect = element.getBoundingClientRect();
              
              // Skip hidden elements
              if (rect.width === 0 && rect.height === 0) return;
              
              results.push({
                tag: element.tagName.toLowerCase(),
                text: element.textContent?.trim().substring(0, 100) || '',
                id: element.id || '',
                className: element.className || '',
                role: element.getAttribute('role') || '',
                type: element.getAttribute('type') || '',
                href: (element as HTMLAnchorElement).href || '',
                selector: selector,
                visible: rect.width > 0 && rect.height > 0
              });
            });
          } catch (e) {
            // Invalid selector, skip
          }
        });
        
        return results;
      }, selector);
      
      // Filter unique elements (by text + tag)
      const uniqueElements = new Map<string, any>();
      elements.forEach((el: any) => {
        const key = `${el.tag}-${el.text}-${el.id}`;
        if (!uniqueElements.has(key) && el.visible) {
          uniqueElements.set(key, el);
        }
      });
      
      const elementArray = Array.from(uniqueElements.values());
      
      console.log(`\n📋 Found ${elementArray.length} interactive elements:\n`);
      
      elementArray.slice(0, 20).forEach((el: any, i: number) => {
        console.log(`${i + 1}. ${el.tag.toUpperCase()}${el.id ? `#${el.id}` : ''}${el.className ? `.${el.className.split(' ')[0]}` : ''}`);
        if (el.text) console.log(`   Text: "${el.text.substring(0, 80)}${el.text.length > 80 ? '...' : ''}"`);
        if (el.href) console.log(`   Link: ${el.href}`);
        if (el.type) console.log(`   Type: ${el.type}`);
        if (el.role) console.log(`   Role: ${el.role}`);
        console.log(`   Selector: ${el.selector}`);
        console.log('');
      });
      
      if (elementArray.length > 20) {
        console.log(`   ... and ${elementArray.length - 20} more elements`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to extract page elements`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return this;
  }

  /**
   * Connect to an existing browser via CDP
   * @param port CDP port (default: 9222)
   * @cliSyntax port
   * @cliDefault port 9222
   */
  async connectBrowser(port: string = '9222'): Promise<this> {
    console.log(`🔗 Connecting to browser via CDP on port ${port}...`);
    
    try {
      const pw = await this.getPlaywright();
      const browser = await pw.chromium.connectOverCDP(`http://localhost:${port}`);
      const contexts = browser.contexts();
      
      if (contexts.length === 0) {
        console.log(`⚠️ No browser contexts found. Creating new context...`);
        const context = await browser.newContext();
        const page = await context.newPage();
        this.pages.set('CDP-Browser', page);
      } else {
        const context = contexts[0];
        const pages = context.pages();
        
        if (pages.length > 0) {
          console.log(`✅ Connected to ${pages.length} existing page(s)`);
          pages.forEach((page: any, i: number) => {
            this.pages.set(`CDP-Page-${i + 1}`, page);
          });
        } else {
          const page = await context.newPage();
          this.pages.set('CDP-Page-1', page);
          console.log(`✅ Created new page in existing context`);
        }
      }
      
      console.log(`✅ Browser connected successfully`);
    } catch (error) {
      console.error(`❌ Failed to connect to browser via CDP`);
      console.error(`   Make sure browser is running with: --remote-debugging-port=${port}`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return this;
  }

  /**
   * Create example operation for RemoteController
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ RemoteController operation completed`);
    return this;
  }

  /**
   * Process data through RemoteController logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * ✅ REMOVED: Explicit delegation methods (info, test, build, clean, tree, links)
   * 
   * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
   * 
   * These methods are now automatically delegated via DelegationProxy.
   * No need for explicit boilerplate!
   * 
   * Proxy pattern intercepts missing methods and delegates them to Web4TSComponent
   * with proper context, display properties, and test isolation awareness.
   * 
   * Methods automatically delegated:
   * - info(topic)           - Show component information
   * - test(scope, ...refs)  - Run tests with auto-promotion
   * - build()               - Build component
   * - clean()               - Clean build artifacts
   * - tree(depth, hidden)   - Show directory structure
   * - links(action)         - Show/manage version links
   * - upgrade(version)      - Upgrade component version
   * - ... and any future Web4TSComponent methods!
   */

  /**
   * Test and discover tab completions for debugging and development
   * @param what Type of completion to test: "method" or "parameter"
   * @param filter Optional prefix to filter results (e.g., "v" shows only validate*, verify*, etc.)
   * @cliSyntax what filter
   * @cliDefault filter ""
   */
  async completion(what: string, filter?: string): Promise<this> {
    const context = this.getComponentContext();
    
    // OOP: Instantiate own CLI and call completeParameter directly (no shell!)
    const { RemoteControllerCLI } = await import('../layer5/RemoteControllerCLI.js');
    const cli = new RemoteControllerCLI();
    
    if (!context) {
      // No context - test completions on RemoteController itself
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on RemoteController${filter ? ` (filter: ${filter})` : ''}`);
      console.log(`---`);
      
      // Call completeParameter directly via OOP (completeParameter is on DefaultCLI)
      await cli.completeParameter('completionNameParameterCompletion', 'completion', what, filter || '');
    } else {
      // Context loaded - delegate to web4tscomponent for target component discovery
      const web4ts = await this.getWeb4TSComponent();
      await web4ts.completion(what, filter);
    }
    
    return this;
  }

  /**
   * @cliHide
   */
  protected getComponentContext(): { component: string; version: string; path: string } | null {
    const context = this.model as any;
    if (context.contextComponent && context.contextVersion && context.contextPath) {
      return {
        component: context.contextComponent,
        version: context.contextVersion,
        path: context.contextPath
      };
    }
    return null;
  }
}
