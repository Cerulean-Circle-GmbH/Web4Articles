/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Web4Programmer } from '../layer3/Web4Programmer.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { Web4ProgrammerModel } from '../layer3/Web4ProgrammerModel.interface.js';
import { existsSync, readFileSync, writeFileSync, lstatSync, readlinkSync } from 'fs';
import { join, dirname, resolve } from 'path';

export class DefaultWeb4Programmer implements Web4Programmer {
  private model: Web4ProgrammerModel;

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
  init(scenario: Scenario<Web4ProgrammerModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<Web4ProgrammerModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'Web4Programmer',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'Web4Programmer',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for Web4Programmer
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ Web4Programmer operation completed`);
    return this;
  }

  /**
   * Process data through Web4Programmer logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current Web4Programmer state
   */
  async info(): Promise<this> {
    console.log(`📋 Web4Programmer Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    
    // Show context if loaded
    const context = this.getComponentContext();
    if (context) {
      console.log(`\n📍 Component Context:`);
      console.log(`   Component: ${context.component}`);
      console.log(`   Version: ${context.version}`);
      console.log(`   Path: ${context.path}`);
    }
    
    return this;
  }

  /**
   * Load component context for chaining operations (essential for workflows)
   * @param component Component name to load
   * @param version Version to load (default: latest)
   * @cliSyntax component version
   * @cliDefault version latest
   */
  async on(component: string, version: string = 'latest'): Promise<this> {
    const componentPath = this.resolveComponentPath(component, version);
    
    if (!existsSync(componentPath)) {
      throw new Error(`I couldn't find component: ${component} ${version} at ${componentPath}`);
    }
    
    // Resolve actual version if symlink was provided (e.g., 'latest', 'dev', 'prod', 'test')
    let actualVersion = version;
    if (lstatSync(componentPath).isSymbolicLink()) {
      const linkTarget = readlinkSync(componentPath);
      // Extract version number from link target (e.g., "0.1.0.0" from "../0.1.0.0" or "0.1.0.0")
      const versionMatch = linkTarget.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (versionMatch) {
        actualVersion = versionMatch[1];
      }
    } else {
      // Not a symlink - extract version from path
      const pathMatch = componentPath.match(/(\d+\.\d+\.\d+\.\d+)$/);
      if (pathMatch) {
        actualVersion = pathMatch[1];
      }
    }
    
    // Set component context for chaining
    this.model.name = component;
    this.model.origin = componentPath;
    this.model.definition = `Component context: ${component} ${actualVersion}`;
    
    // Store context for chained operations
    (this.model as any).contextComponent = component;
    (this.model as any).contextVersion = actualVersion;  // Store ACTUAL version, not symlink name
    (this.model as any).contextPath = componentPath;
    
    if (actualVersion !== version) {
      console.log(`✅ Component context loaded: ${component} ${version} → ${actualVersion}`);
    } else {
      console.log(`✅ Component context loaded: ${component} ${version}`);
    }
    console.log(`   Path: ${componentPath}`);
    
    return this; // Enable chaining
  }

  /**
   * Add a new method to the currently loaded component
   * @param methodName Name of the method to add
   * @param parameters Comma-separated parameter list (e.g., "input,format")
   * @param description Human-readable description of what the method does
   * @cliSyntax methodName parameters description
   * @cliDefault parameters ""
   * @cliDefault description "New method"
   */
  async addMethod(methodName: string, parameters: string = '', description: string = 'New method'): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('I need a component context first. Please use "on <component> <version>" before adding methods.');
    }
    
    console.log(`🔧 Adding method '${methodName}' to ${context.component} ${context.version}`);
    
    // Build the method code
    const params = parameters ? parameters.split(',').map(p => p.trim()) : [];
    const methodCode = this.generateMethodCode(methodName, params, description);
    
    // Find the DefaultComponent.ts file
    const defaultComponentFile = join(context.path, 'src/ts/layer2', `Default${context.component}.ts`);
    
    if (!existsSync(defaultComponentFile)) {
      throw new Error(`I couldn't find the component implementation file: ${defaultComponentFile}`);
    }
    
    // Read current content
    const content = readFileSync(defaultComponentFile, 'utf-8');
    
    // Find insertion point (before the closing brace of the class)
    const lastBraceIndex = content.lastIndexOf('}');
    if (lastBraceIndex === -1) {
      throw new Error('I couldn\'t find the class closing brace in the component file.');
    }
    
    // Insert the new method before the closing brace
    const newContent = content.substring(0, lastBraceIndex) + '\n' + methodCode + '\n}\n';
    
    // Write back the file
    writeFileSync(defaultComponentFile, newContent, 'utf-8');
    
    console.log(`✅ Method '${methodName}' added successfully!`);
    console.log(`   File: ${defaultComponentFile}`);
    console.log(`   Parameters: ${params.join(', ') || 'none'}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Rebuild the component: cd ${context.path} && npm run build`);
    console.log(`   2. Test the new method: ./${context.component.toLowerCase()} ${methodName}`);
    
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

  /**
   * @cliHide
   */
  protected resolveComponentPath(component: string, version: string): string {
    // Find project root (where components/ directory exists)
    let currentDir = process.cwd();
    while (!existsSync(join(currentDir, 'components'))) {
      const parentDir = dirname(currentDir);
      if (parentDir === currentDir) {
        throw new Error('I couldn\'t find the components directory. Are you in a Web4 project?');
      }
      currentDir = parentDir;
    }
    
    const componentsDir = join(currentDir, 'components');
    const componentDir = join(componentsDir, component);
    
    if (!existsSync(componentDir)) {
      throw new Error(`Component directory not found: ${component}`);
    }
    
    // If version is a semantic link (latest, dev, test, prod), resolve it
    const versionPath = join(componentDir, version);
    if (existsSync(versionPath)) {
      return resolve(versionPath);
    }
    
    throw new Error(`Version not found: ${component} ${version}`);
  }

  /**
   * @cliHide
   */
  protected generateMethodCode(methodName: string, params: string[], description: string): string {
    const paramList = params.map(p => `${p}: string`).join(', ');
    const cliSyntax = params.join(' ');
    const defaults = params.map(p => `${p}-example`).join(', ');
    
    return `  /**
   * ${description}
${params.map(p => `   * @param ${p} Description of ${p}`).join('\n')}
   * @cliSyntax ${cliSyntax}
   */
  async ${methodName}(${paramList}): Promise<this> {
    console.log(\`🚀 ${methodName} called\`);
${params.map(p => `    console.log(\`   ${p}: \${${p}}\`);`).join('\n')}
    
    // Your implementation here
    
    console.log(\`✅ ${methodName} completed\`);
    return this;
  }
`;
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
    const { readFileSync, readlinkSync, existsSync, lstatSync, readdirSync } = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const { dirname } = await import('path');
    
    // 🚨 RECURSION DETECTION: Check if we're already inside vitest
    const insideTestEnvironment = !!(process.env.VITEST || process.env.VITEST_WORKER_ID);
    
    if (insideTestEnvironment) {
      // Already inside a test - prevent infinite recursion
      console.log(`🧪 Already in test environment - skipping recursive vitest execution`);
      console.log(`✅ Test execution skipped (recursion prevented)`);
    }
    
    // WORKFLOW REMINDER
    console.log(`\n🔄 WORKFLOW REMINDER:`);
    console.log(`   🚧 ALWAYS work on dev version until you run test`);
    console.log(`   🧪 ALWAYS work on test version until test succeeds`);
    console.log(`   🚧 ALWAYS work on dev version after test success\n`);
    
    console.log(`🧪 Running Web4Programmer tests with auto-promotion...`);
    
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
      
      if (!insideTestEnvironment) {
        // Run vitest first (only if not in test environment)
        execSync('npx vitest run', { 
          cwd: process.cwd(),
          stdio: 'inherit',
          encoding: 'utf-8'
        });
      }
      
      console.log(`✅ Web4Programmer tests completed successfully`);
      
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
        await web4ts.on('Web4Programmer', currentVersion);
        await web4ts.upgrade('nextBuild');
        const parts = currentVersion.split('.').map(Number);
        const devVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
        await web4ts.on('Web4Programmer', devVersion);
        await web4ts.setDev();
      }
      // Stage 1: Current is dev, no test link OR test is outdated → create test version
      else if (currentVersion === semanticLinks.dev && (!semanticLinks.test || semanticLinks.test < currentVersion)) {
        console.log(`\n🧪 Stage 1: dev → test (creating test version)...`);
        await web4ts.on('Web4Programmer', currentVersion);
        await web4ts.upgrade('nextBuild');
        const parts = currentVersion.split('.').map(Number);
        const testVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
        await web4ts.on('Web4Programmer', testVersion);
        await web4ts.setTest();
      }
      // Stage 2: Current is test and 100% pass → promote to prod AND create new dev
      else if (currentVersion === semanticLinks.test) {
        console.log(`\n🚀 Stage 2: test → prod (verifying 100% test success)...`);
        // CRITICAL: Verify 100% test success before promoting to production
        const testResultsPath = path.join(process.cwd(), 'test/test-results.json');
        if (existsSync(testResultsPath)) {
          const results = JSON.parse(readFileSync(testResultsPath, 'utf-8'));
          if (results.numFailedTests === 0 && results.numPassedTests > 0) {
            console.log(`✅ 100% test success verified (${results.numPassedTests} passed, 0 failed)`);
            console.log(`🚀 Promoting to production...`);
            await web4ts.on('Web4Programmer', currentVersion);
            await web4ts.upgrade('nextPatch');
            
            // Find the newly created prod version (highest version)
            const componentParentDir = path.dirname(path.dirname(path.dirname(componentRoot)));
            const componentsDir = path.join(componentParentDir, 'components');
            const componentDir = path.join(componentsDir, 'Web4Programmer');
            const versions = readdirSync(componentDir)
              .filter(v => /^\d+\.\d+\.\d+\.\d+$/.test(v))
              .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
            const prodVersion = versions[0];  // Highest version is the new prod
            
            // Set prod symlink
            await web4ts.on('Web4Programmer', prodVersion);
            await web4ts.setProd();
            console.log(`✅ Promoted to production: ${prodVersion}`);
            
            // CRITICAL: Now create new dev version (nextBuild from prod)
            console.log(`🚧 Creating new dev version...`);
            await web4ts.on('Web4Programmer', prodVersion);
            await web4ts.upgrade('nextBuild');
            
            // Find the newly created dev version (highest version)
            const newVersions = readdirSync(componentDir)
              .filter(v => /^\d+\.\d+\.\d+\.\d+$/.test(v))
              .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
            const newDevVersion = newVersions[0];  // Highest version is the new dev
            await web4ts.on('Web4Programmer', newDevVersion);
            await web4ts.setDev();
            
            // CRITICAL: Also update test symlink to point to new dev version
            // This ensures test → dev workflow continuity
            await web4ts.setTest();
            console.log(`✅ New dev version created: ${newDevVersion}`);
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
      console.error(`❌ Web4Programmer tests failed`);
      throw error;
    }
    
    return this;
  }

  /**
   * Add two numbers together
   * @param a Description of a
   * @param b Description of b
   * @cliSyntax a b
   */
  async calculateSum(a: string, b: string): Promise<this> {
    console.log(`🚀 calculateSum called`);
    console.log(`   a: ${a}`);
    console.log(`   b: ${b}`);
    
    // Your implementation here
    
    console.log(`✅ calculateSum completed`);
    return this;
  }

  /**
   * Test and discover tab completions for debugging and development
   * @param what Type of completion to test: "method" or "parameter"
   * @param filter Optional prefix to filter results
   * @cliSyntax what filter
   * @cliDefault filter ""
   */
  async completion(what: string, filter?: string): Promise<this> {
    const context = this.getComponentContext();
    const { execSync } = await import('child_process');
    const path = await import('path');
    
    const callbackName = 'completionNameParameterCompletion';
    const callbackArgs = ['completion', what, filter || ''].map((arg: string) => `"${arg}"`).join(' ');
    
    if (!context) {
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on Web4Programmer${filter ? ` (filter: ${filter})` : ''}`);
      console.log(`---`);
      
      const cliPath = path.join(process.cwd(), 'web4programmer');
      execSync(`${cliPath} completeParameter ${callbackName} ${callbackArgs} 2>/dev/null`, { 
        cwd: process.cwd(),
        stdio: 'inherit',
        encoding: 'utf-8'
      });
    } else {
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on ${context.component} ${context.version}${filter ? ` (filter: ${filter})` : ''}`);
      console.log(`---`);
      
      const cliScriptName = context.component.toLowerCase().replace(/\./g, '');
      
      let currentDir = process.cwd();
      while (!existsSync(path.join(currentDir, 'components'))) {
        const parentDir = dirname(currentDir);
        if (parentDir === currentDir) break;
        currentDir = parentDir;
      }
      
      const cliPath = path.join(currentDir, 'scripts', cliScriptName);
      
      execSync(`${cliPath} completeParameter ${callbackName} ${callbackArgs} 2>/dev/null`, { 
        cwd: context.path,
        stdio: 'inherit',
        encoding: 'utf-8'
      });
    }
    
    return this;
  }

  /**
   * Check if component needs upgrade by comparing template timestamps
   * @cliSyntax
   */
  async needsUpgradeCheck(): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('I need a component context first. Please use "on <component> <version>" before checking upgrade needs.');
    }

    console.log(`🔍 Checking if ${context.component} ${context.version} needs upgrade...`);
    
    const { statSync } = await import('fs');
    const path = await import('path');
    
    // Find Web4TSComponent latest version for template comparison
    const projectRoot = context.path.split('/components/')[0];
    const web4tsComponentPath = path.join(projectRoot, 'components', 'Web4TSComponent', 'latest');
    const templatesPath = path.join(web4tsComponentPath, 'templates');
    
    if (!existsSync(templatesPath)) {
      throw new Error(`I couldn't find Web4TSComponent templates at ${templatesPath}`);
    }

    console.log(`\n📊 Checking against Web4TSComponent templates:`);
    console.log(`   Template source: ${templatesPath}`);
    console.log(`   Component: ${context.path}`);
    
    // Get component creation time from directory metadata
    const componentCreatedTime = statSync(context.path).mtime;
    console.log(`\n📅 Component directory created: ${componentCreatedTime.toISOString()}`);
    
    // Check critical template files against generated files
    const criticalFiles = [
      { template: 'ts/DefaultComponent.ts.template', generated: `src/ts/layer2/Default${context.component}.ts` },
      { template: 'ts/ComponentCLI.ts.template', generated: `src/ts/layer5/${context.component}CLI.ts` },
      { template: 'config/package.json.template', generated: 'package.json' },
      { template: 'config/tsconfig.json.template', generated: 'tsconfig.json' },
      { template: 'sh/build.sh.template', generated: 'src/sh/build.sh' }
    ];
    
    let newerTemplatesFound = 0;
    let totalChecked = 0;
    const upgradeDetails: string[] = [];
    
    console.log(`\n📋 File-by-file comparison:`);
    
    for (const file of criticalFiles) {
      const templatePath = path.join(templatesPath, file.template);
      const generatedPath = path.join(context.path, file.generated);
      
      if (!existsSync(templatePath) || !existsSync(generatedPath)) {
        continue; // Skip if either file doesn't exist
      }
      
      const templateTime = statSync(templatePath).mtime;
      const generatedTime = statSync(generatedPath).mtime;
      
      totalChecked++;
      const diffMinutes = Math.floor((templateTime.getTime() - generatedTime.getTime()) / 1000 / 60);
      
      if (templateTime > generatedTime) {
        newerTemplatesFound++;
        console.log(`   ⚠️  ${file.generated}`);
        console.log(`      Template: ${templateTime.toISOString()}`);
        console.log(`      Generated: ${generatedTime.toISOString()}`);
        console.log(`      Template is ${diffMinutes} minutes newer`);
        upgradeDetails.push(`${file.generated} (${diffMinutes}min older)`);
      } else {
        console.log(`   ✅ ${file.generated}`);
        console.log(`      Up to date (${Math.abs(diffMinutes)} minutes since template)`);
      }
    }
    
    console.log(`\n📊 Check Summary:`);
    console.log(`   Files checked: ${totalChecked}`);
    console.log(`   Newer templates: ${newerTemplatesFound}`);
    console.log(`   Up to date: ${totalChecked - newerTemplatesFound}`);
    
    if (newerTemplatesFound > 0) {
      console.log(`\n⚠️  UPGRADE RECOMMENDED`);
      console.log(`   ${newerTemplatesFound} template(s) are newer than generated files:`);
      upgradeDetails.forEach(detail => console.log(`   - ${detail}`));
      console.log(`\n💡 Recommendation:`);
      console.log(`   Component generated: ${componentCreatedTime.toISOString()}`);
      console.log(`   Templates updated after generation`);
      console.log(`   Consider: Recreate component or manually merge template updates`);
    } else {
      console.log(`\n✅ NO UPGRADE NEEDED`);
      console.log(`   Component is up to date with current templates`);
    }
    
    return this;
  }

}
