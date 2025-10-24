/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { DemoWeb4Component } from '../layer3/DemoWeb4Component.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { DemoWeb4ComponentModel } from '../layer3/DemoWeb4ComponentModel.interface.js';

export class DefaultDemoWeb4Component implements DemoWeb4Component {
  private model: DemoWeb4ComponentModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * @cliHide
   */
  init(scenario: Scenario<DemoWeb4ComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<DemoWeb4ComponentModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'DemoWeb4Component',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'DemoWeb4Component',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for DemoWeb4Component
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ DemoWeb4Component operation completed`);
    return this;
  }

  /**
   * Process data through DemoWeb4Component logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current DemoWeb4Component state
   */
  async info(): Promise<this> {
    console.log(`📋 DemoWeb4Component Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }

  /**
   * Run component tests with automatic promotion workflow
   * 
   * Follows the same promotion pattern as Web4TSComponent:
   * - Stage 0: prod (initial) → create dev
   * - Stage 1: dev → create test  
   * - Stage 2: test + 100% → create prod + dev
   * 
   * @cliSyntax
   * @cliExample {{COMPONENT_LOWER}} test
   */
  async test(): Promise<this> {
    const { execSync } = await import('child_process');
    const { readFileSync, readlinkSync, existsSync, lstatSync } = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const { dirname } = await import('path');
    
    // 🚨 RECURSION DETECTION: Check if we're already inside vitest
    const insideTestEnvironment = !!(process.env.VITEST || process.env.VITEST_WORKER_ID);
    
    if (insideTestEnvironment) {
      // Already inside a test - prevent infinite recursion
      console.log(`🧪 Already in test environment - skipping recursive vitest execution`);
      console.log(`✅ Test execution skipped (recursion prevented)`);
      return this;
    }
    
    // WORKFLOW REMINDER
    console.log(`\n🔄 WORKFLOW REMINDER:`);
    console.log(`   🚧 ALWAYS work on dev version until you run test`);
    console.log(`   🧪 ALWAYS work on test version until test succeeds`);
    console.log(`   🚧 ALWAYS work on dev version after test success\n`);
    
    console.log(`🧪 Running DemoWeb4Component tests with auto-promotion...`);
    
    try {
      // Get current version from THIS component version's package.json
      // Use import.meta.url to get the directory of THIS file, not cwd
      // File is at: dist/ts/layer2/DefaultComponent.js
      // Package.json is at: ./package.json (component root)
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const componentRoot = path.resolve(__dirname, '../../..');  // Go up 3 levels: layer2 -> ts -> dist -> root
      const packageJsonPath = path.join(componentRoot, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const currentVersion = packageJson.version;
      
      // Run vitest first
      execSync('npx vitest run', { 
        cwd: process.cwd(),
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      
      console.log(`✅ DemoWeb4Component tests completed successfully`);
      
      // 🎯 AUTO-PROMOTION: Determine and execute promotion stage
      console.log(`\n🔍 Checking for promotion opportunity...`);
      
      // componentRoot is the VERSION directory (e.g., /path/to/ComponentName/0.1.0.0)
      // Semantic links are ONE LEVEL UP in the COMPONENT directory (e.g., /path/to/ComponentName/)
      const componentDir = path.dirname(componentRoot);
      
      // Read semantic links from component directory (NOT version directory)
      const getLink = (name: string): string | null => {
        const linkPath = path.join(componentDir, name);
        if (existsSync(linkPath) && lstatSync(linkPath).isSymbolicLink()) {
          return readlinkSync(linkPath);
        }
        return null;
      };
      
      const semanticLinks = {
        dev: getLink('dev'),
        test: getLink('test'),
        prod: getLink('prod'),
        latest: getLink('latest')
      };
      
      console.log(`\n📊 Current semantic links:`);
      console.log(`   🚀 prod:   ${semanticLinks.prod || 'none'}`);
      console.log(`   🧪 test:   ${semanticLinks.test || 'none'}`);
      console.log(`   🚧 dev:    ${semanticLinks.dev || 'none'}`);
      console.log(`   📦 latest: ${semanticLinks.latest || 'none'}`);
      console.log(`   📍 Current: ${currentVersion}`);
      
      // 🎯 OOP PROMOTION: Use Web4TSComponent programmatically (NOT via shell)
      // Calculate target directory (e.g., /test/data or project root)
      // componentRoot is like: /path/to/test/data/components/ComponentName/0.1.0.0
      // We need: /path/to/test/data (3 levels up: version -> component -> components -> parent)
      const componentParentDir = path.dirname(path.dirname(path.dirname(componentRoot)));
      
      // Import Web4TSComponent dynamically (OOP way!)
      const projectRoot = componentRoot.split('/components/')[0];
      const web4tscomponentModule = await import(`${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js`);
      const { DefaultWeb4TSComponent } = web4tscomponentModule;
      
      // Instantiate Web4TSComponent with proper target directory (test isolation!)
      const web4ts = new DefaultWeb4TSComponent();
      web4ts.setTargetDirectory(componentParentDir);
      
      // Stage 0: No dev link exists → create first dev version
      if (!semanticLinks.dev) {
        console.log(`\n🚧 Stage 0: No dev version exists, creating first dev version...`);
        await web4ts.on('DemoWeb4Component', currentVersion);
        await web4ts.upgrade('nextBuild');
        const parts = currentVersion.split('.').map(Number);
        const devVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
        await web4ts.on('DemoWeb4Component', devVersion);
        await web4ts.setDev();
      }
      // Stage 1: Current is dev, no test link OR test is outdated → create test version
      else if (currentVersion === semanticLinks.dev && (!semanticLinks.test || semanticLinks.test < currentVersion)) {
        console.log(`\n🧪 Stage 1: dev → test (creating test version)...`);
        await web4ts.on('DemoWeb4Component', currentVersion);
        await web4ts.upgrade('nextBuild');
        const parts = currentVersion.split('.').map(Number);
        const testVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
        await web4ts.on('DemoWeb4Component', testVersion);
        await web4ts.setTest();
      }
      // Stage 2: Current is test and 100% pass → promote to prod
      else if (currentVersion === semanticLinks.test) {
        console.log(`\n🚀 Stage 2: test → prod (verifying 100% test success)...`);
        // CRITICAL: Verify 100% test success before promoting to production
        const testResultsPath = path.join(process.cwd(), 'test/test-results.json');
        if (existsSync(testResultsPath)) {
          const results = JSON.parse(readFileSync(testResultsPath, 'utf-8'));
          if (results.numFailedTests === 0 && results.numPassedTests > 0) {
            console.log(`✅ 100% test success verified (${results.numPassedTests} passed, 0 failed)`);
            console.log(`🚀 Promoting to production...`);
            await web4ts.on('DemoWeb4Component', currentVersion);
            await web4ts.upgrade('nextPatch');
            console.log(`✅ Promoted to production successfully!`);
          } else {
            console.log(`⚠️  Tests did not achieve 100% success:`);
            console.log(`   Passed: ${results.numPassedTests}`);
            console.log(`   Failed: ${results.numFailedTests}`);
            console.log(`   Skipping promotion - fix failing tests first!`);
          }
        } else {
          console.log(`⚠️  test-results.json not found - cannot verify test success`);
          console.log(`   Skipping promotion for safety`);
        }
      }
      
    } catch (error) {
      console.error(`❌ DemoWeb4Component tests failed`);
      throw error;
    }
    
    return this;
  }
}
