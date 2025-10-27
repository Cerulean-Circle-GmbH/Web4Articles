import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

/**
 * 🚨 CRITICAL PRINCIPLE: "npm start ONLY"
 * 
 * This test suite ensures that Web4TSComponent and ALL generated components
 * follow the fundamental principle:
 * 
 * **npm start must work from GROUND ZERO (no dependencies, no build)**
 * 
 * WHY THIS MATTERS:
 * - Fresh clone experience: git clone → cd component → npm start → just works
 * - No manual setup required
 * - Shell scripts handle: deps → build → run (in correct order)
 * - CLI wrappers are for ADVANCED users only (assume already built)
 * 
 * ARCHITECTURE:
 * ✅ npm start       → ./src/sh/start.sh    (ground-up: deps→build→run)
 * ✅ npm test        → ./src/sh/test.sh     (smart build→vitest)
 * ✅ npm run component → ./componentname    (advanced: assumes built)
 * 
 * This test suite GUARANTEES this principle is never violated.
 */

/**
 * Helper function to clean up test data content (not the directory itself)
 */
async function cleanupTestDataContent(testDataDir: string) {
  try {
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

describe('🚨 CRITICAL: npm start ONLY Principle', () => {
  const testDataDir = path.join(process.cwd(), 'test', 'data');
  let mockProjectRoot: ProjectRootMocker;
  let web4ts: DefaultWeb4TSComponent;

  beforeEach(async () => {
    // Clean test data CONTENT (not the directory itself)
    await cleanupTestDataContent(testDataDir);
    
    // Set up isolated test environment
    mockProjectRoot = new ProjectRootMocker(testDataDir);
    web4ts = new DefaultWeb4TSComponent();
    
    // Initialize project with root configs (DRY principle)
    await web4ts.initProject();
  });

  afterEach(async () => {
    // Clean up test data CONTENT (preserve directory)
    await cleanupTestDataContent(testDataDir);
  });

  describe('📋 Web4TSComponent package.json Compliance', () => {
    it('should use shell script for npm start (not CLI wrapper)', async () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // CRITICAL: npm start MUST call shell script (ground-up)
      expect(packageJson.scripts.start).toBe('./src/sh/start.sh');
      expect(packageJson.scripts.start).not.toContain('./web4tscomponent');
      expect(packageJson.scripts.start).not.toContain('node dist/');
      
      console.log('✅ Web4TSComponent npm start uses shell script (ground-up)');
    });

    it('should use shell script for npm test (smart build)', async () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // npm test should use shell script (handles build)
      expect(packageJson.scripts.test).toBe('./src/sh/test.sh');
      expect(packageJson.scripts.test).not.toContain('node dist/');
      
      console.log('✅ Web4TSComponent npm test uses shell script (smart build)');
    });

    it('should use CLI wrapper for npm run component (advanced users)', async () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // npm run component is for advanced users (assumes built)
      expect(packageJson.scripts.component).toBe('./web4tscomponent');
      
      console.log('✅ Web4TSComponent npm run component uses CLI wrapper (advanced)');
    });

    it('should have all required scripts in correct order', async () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // Verify all lifecycle scripts exist
      expect(packageJson.scripts).toHaveProperty('start');
      expect(packageJson.scripts).toHaveProperty('test');
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts).toHaveProperty('clean');
      expect(packageJson.scripts).toHaveProperty('install-deps');
      expect(packageJson.scripts).toHaveProperty('component');
      
      console.log('✅ Web4TSComponent has all required lifecycle scripts');
    });
  });

  describe('📋 Generated Component package.json Template Compliance', () => {
    it('should generate package.json with shell script for npm start', async () => {
      const templatePath = path.join(process.cwd(), 'templates', 'config', 'package.json.template');
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      
      // CRITICAL: Template MUST use shell script for npm start
      expect(templateContent).toContain('"start": "./src/sh/start.sh"');
      expect(templateContent).not.toContain('"start": "./{{COMPONENT_NAME_LOWER}} start"');
      expect(templateContent).not.toContain('"start": "node dist/');
      
      console.log('✅ Template generates npm start with shell script (ground-up)');
    });

    it('should generate package.json with shell script for npm test', async () => {
      const templatePath = path.join(process.cwd(), 'templates', 'config', 'package.json.template');
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      
      // npm test should use shell script
      expect(templateContent).toContain('"test": "./src/sh/test.sh"');
      expect(templateContent).not.toContain('"test": "./{{COMPONENT_NAME_LOWER}} test"');
      
      console.log('✅ Template generates npm test with shell script (smart build)');
    });

    it('should generate package.json with CLI wrapper for npm run component', async () => {
      const templatePath = path.join(process.cwd(), 'templates', 'config', 'package.json.template');
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      
      // npm run component should use CLI wrapper
      expect(templateContent).toContain('"component": "./{{COMPONENT_NAME_LOWER}}"');
      expect(templateContent).not.toContain('"component": "node dist/');
      
      console.log('✅ Template generates npm run component with CLI wrapper (advanced)');
    });
  });

  describe('🛠️ Shell Script Template Compliance', () => {
    it('should have start.sh template that handles deps and build', async () => {
      const templatePath = path.join(process.cwd(), 'templates', 'sh', 'start.sh.template');
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      
      // start.sh MUST handle dependencies and build
      expect(templateContent).toContain('Install dependencies if needed');
      expect(templateContent).toContain('./src/sh/install-deps.sh');
      expect(templateContent).toContain('npx tsc');
      expect(templateContent).toContain('npm run component');
      
      console.log('✅ start.sh template handles deps→build→run');
    });

    it('should have test.sh template that does smart build', async () => {
      const templatePath = path.join(process.cwd(), 'templates', 'sh', 'test.sh.template');
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      
      // test.sh should call build.sh first
      expect(templateContent).toContain('./src/sh/build.sh');
      expect(templateContent).toContain('npm run vitest');
      
      console.log('✅ test.sh template does smart build before tests');
    });

    it('should have build.sh template that handles deps', async () => {
      const templatePath = path.join(process.cwd(), 'templates', 'sh', 'build.sh.template');
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      
      // build.sh should handle dependencies if needed
      expect(templateContent).toContain('./src/sh/install-deps.sh');
      expect(templateContent).toContain('npx tsc');
      
      console.log('✅ build.sh template handles deps→build');
    });
  });

  describe('🔄 Integration: Actual Generated Component', () => {
    it('should generate component with correct npm start (shell script)', async () => {
      // Create a test component
      await web4ts.create('TestStartOnly', '0.1.0.0');
      
      // Read generated package.json
      const componentPath = path.join(testDataDir, 'components', 'TestStartOnly', '0.1.0.0');
      const packageJsonPath = path.join(componentPath, 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // CRITICAL: Generated component MUST use shell script for npm start
      expect(packageJson.scripts.start).toBe('./src/sh/start.sh');
      expect(packageJson.scripts.start).not.toContain('./teststartonly');
      expect(packageJson.scripts.start).not.toContain('node dist/');
      
      console.log('✅ Generated component uses shell script for npm start');
    });

    it('should generate component with correct npm test (shell script)', async () => {
      // Create a test component
      await web4ts.create('TestStartOnly2', '0.1.0.0');
      
      // Read generated package.json
      const componentPath = path.join(testDataDir, 'components', 'TestStartOnly2', '0.1.0.0');
      const packageJsonPath = path.join(componentPath, 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // Generated component should use shell script for npm test
      expect(packageJson.scripts.test).toBe('./src/sh/test.sh');
      expect(packageJson.scripts.test).not.toContain('./teststartonly2');
      
      console.log('✅ Generated component uses shell script for npm test');
    });

    it('should generate component with correct npm run component (CLI wrapper)', async () => {
      // Create a test component
      await web4ts.create('TestStartOnly3', '0.1.0.0');
      
      // Read generated package.json
      const componentPath = path.join(testDataDir, 'components', 'TestStartOnly3', '0.1.0.0');
      const packageJsonPath = path.join(componentPath, 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // npm run component should use CLI wrapper
      expect(packageJson.scripts.component).toBe('./teststartonly3');
      
      console.log('✅ Generated component uses CLI wrapper for npm run component');
    });

    it('should generate component with working start.sh that handles deps', async () => {
      // Create a test component
      await web4ts.create('TestStartOnly4', '0.1.0.0');
      
      // Read generated start.sh
      const componentPath = path.join(testDataDir, 'components', 'TestStartOnly4', '0.1.0.0');
      const startShPath = path.join(componentPath, 'src', 'sh', 'start.sh');
      const startShContent = await fs.readFile(startShPath, 'utf-8');
      
      // start.sh must handle dependencies and build
      expect(startShContent).toContain('Install dependencies if needed');
      expect(startShContent).toContain('./src/sh/install-deps.sh');
      expect(startShContent).toContain('npx tsc');
      expect(startShContent).toContain('npm run component');
      
      console.log('✅ Generated start.sh handles deps→build→run');
    });

    it('should generate component with working test.sh that does smart build', async () => {
      // Create a test component
      await web4ts.create('TestStartOnly5', '0.1.0.0');
      
      // Read generated test.sh
      const componentPath = path.join(testDataDir, 'components', 'TestStartOnly5', '0.1.0.0');
      const testShPath = path.join(componentPath, 'src', 'sh', 'test.sh');
      const testShContent = await fs.readFile(testShPath, 'utf-8');
      
      // test.sh must call build.sh first
      expect(testShContent).toContain('./src/sh/build.sh');
      expect(testShContent).toContain('npm run vitest');
      
      console.log('✅ Generated test.sh does smart build before tests');
    });
  });

  describe('🚨 Regression Prevention', () => {
    it('should NEVER use CLI wrapper for npm start (regression test)', async () => {
      // Test Web4TSComponent itself
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // CRITICAL: These patterns MUST NEVER appear in npm start
      const forbiddenPatterns = [
        './web4tscomponent start',
        './web4tscomponent test',
        'node dist/ts/layer5/Web4TSComponentCLI.js start',
        'node dist/ts/layer5/Web4TSComponentCLI.js test'
      ];
      
      for (const pattern of forbiddenPatterns) {
        expect(packageJson.scripts.start).not.toBe(pattern);
        expect(packageJson.scripts.test).not.toBe(pattern);
      }
      
      console.log('✅ Regression prevention: npm start/test never use CLI wrapper');
    });

    it('should NEVER generate components with CLI wrapper for npm start', async () => {
      const templatePath = path.join(process.cwd(), 'templates', 'config', 'package.json.template');
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      
      // CRITICAL: These patterns MUST NEVER appear in template
      const forbiddenPatterns = [
        '"start": "./{{COMPONENT_NAME_LOWER}} start"',
        '"test": "./{{COMPONENT_NAME_LOWER}} test"',
        '"start": "node dist/',
        '"test": "node dist/'
      ];
      
      for (const pattern of forbiddenPatterns) {
        expect(templateContent).not.toContain(pattern);
      }
      
      console.log('✅ Regression prevention: template never uses CLI wrapper for start/test');
    });

    it('should document the principle in README', async () => {
      const readmePath = path.join(process.cwd(), 'README.md');
      const readmeContent = await fs.readFile(readmePath, 'utf-8');
      
      // README should document "npm start ONLY"
      expect(readmeContent.toLowerCase()).toContain('npm start');
      
      console.log('✅ README documents npm start principle');
    });
  });

  describe('📚 Documentation & Principle Verification', () => {
    it('should clearly separate user commands from advanced commands', async () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      // User commands (ground-up): start, test
      expect(packageJson.scripts.start).toContain('./src/sh/');
      expect(packageJson.scripts.test).toContain('./src/sh/');
      
      // Advanced command (assumes built): component
      expect(packageJson.scripts.component).toContain('./web4tscomponent');
      
      console.log('✅ Clear separation: user commands vs advanced commands');
    });

    it('should validate that start.sh is truly zero-dependency', async () => {
      const startShPath = path.join(process.cwd(), 'src', 'sh', 'start.sh');
      const startShContent = await fs.readFile(startShPath, 'utf-8');
      
      // start.sh must handle missing deps
      expect(startShContent).toContain('Install dependencies if needed');
      expect(startShContent).toContain('if [ ! -L "node_modules" ]');
      expect(startShContent).toContain('./src/sh/install-deps.sh');
      
      // start.sh must handle missing build
      expect(startShContent).toContain('Check if rebuild is needed');
      expect(startShContent).toContain('if [ ! -f "dist/');
      expect(startShContent).toContain('npx tsc');
      
      console.log('✅ start.sh is truly zero-dependency (handles deps + build)');
    });
  });
});

