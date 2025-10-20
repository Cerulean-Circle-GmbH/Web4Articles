/**
 * DefaultWeb4Programmer - Web4Programmer Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Web4Programmer } from '../layer3/Web4Programmer.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { Web4ProgrammerModel } from '../layer3/Web4ProgrammerModel.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { DefaultWeb4TSComponent } from '../../../../../Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js';

export class DefaultWeb4Programmer implements Web4Programmer {
  private model: Web4ProgrammerModel;
  private web4ts = new DefaultWeb4TSComponent(); // Always available for delegation!

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
      version: '0.2.0.1'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'Web4Programmer',
        version: '0.2.0.1'
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
    return this;
  }

  /**
   * Run component tests with hierarchical selection or full suite with auto-promotion
   * 
   * DRY PRINCIPLE: For hierarchical testing (file/describe/itCase), this method
   * DELEGATES to Web4TSComponent via OOP to avoid code duplication.
   * 
   * Follows the same promotion pattern as Web4TSComponent:
   * - Stage 0: prod (initial) → create dev
   * - Stage 1: dev → create test  
   * - Stage 2: test + 100% → create prod + dev
   * 
   * @param scope Test scope: 'all' (full suite with promotion) or 'file'/'describe'/'itCase' (selective, no promotion)
   * @param references Test references for selective testing (e.g., file number, describe reference, itCase token)
   * @cliSyntax scope references
   * @cliDefault scope all
   * @cliExample {{COMPONENT_LOWER}} test
   * @cliExample {{COMPONENT_LOWER}} test file
   * @cliExample {{COMPONENT_LOWER}} test file 1
   * @cliExample {{COMPONENT_LOWER}} test describe 3b
   * @cliExample {{COMPONENT_LOWER}} test itCase 1a1
   */
  async test(scope: string = 'all', ...references: string[]): Promise<this> {
    const { execSync } = await import('child_process');
    const { readFileSync, readlinkSync, existsSync, lstatSync, readdirSync } = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const { dirname } = await import('path');
    
    // 🎯 DRY: Delegate hierarchical testing to Web4TSComponent (OOP)
    const selectiveScopes = ['file', 'describe', 'itCase'];
    if (selectiveScopes.includes(scope)) {
      await this.web4ts.on('Web4Programmer', '0.2.0.1');
      await this.web4ts.test(scope, ...references);
      return this;
    }
    
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
   * Test and discover tab completions for debugging and development
   * @param what Type of completion to test: "method" or "parameter"
   * @param filter Optional prefix to filter results (e.g., "v" shows only validate*, verify*, etc.)
   * @cliSyntax what filter
   * @cliDefault filter ""
   */
  async completion(what: string, filter?: string): Promise<this> {
    const context = this.getComponentContext();
    const { execSync } = await import('child_process');
    const path = await import('path');
    
    // Always call completionNameParameterCompletion with proper args structure
    const callbackName = 'completionNameParameterCompletion';
    // Args structure: ['completion', 'method|parameter', 'filterPrefix']
    const callbackArgs = ['completion', what, filter || ''].map((arg: string) => `"${arg}"`).join(' ');
    
    if (!context) {
      // No context - test completions on Web4Programmer itself
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on Web4Programmer${filter ? ` (filter: ${filter})` : ''}`);
      console.log(`---`);
      
      // Call completeParameter via CLI (completeParameter is on DefaultCLI)
      // Suppress stderr (build messages) to avoid duplicate "up to date" noise
      const cliPath = path.join(process.cwd(), '{{COMPONENT_LOWER}}');
      execSync(`${cliPath} completeParameter ${callbackName} ${callbackArgs} 2>/dev/null`, { 
        cwd: process.cwd(),
        stdio: 'inherit',
        encoding: 'utf-8'
      });
    } else {
      // Context loaded - test completions on target component
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on ${context.component} ${context.version}${filter ? ` (filter: ${filter})` : ''}`);
      console.log(`---`);
      
      // Call completeParameter on the target component via its CLI script
      // Suppress stderr (build messages) to avoid duplicate "up to date" noise
      const cliScriptName = context.component.toLowerCase().replace(/\./g, '');
      
      // Find project root
      let currentDir = process.cwd();
      while (!existsSync(path.join(currentDir, 'components'))) {
        const parentDir = path.dirname(currentDir);
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

  // 🔄 Custom Business Logic (migrated for v0.2.0.1 testing)

  /**
   * Add a new method to a component dynamically
   * @param methodName Name of the method to add
   * @param parameters Comma-separated parameter names
   * @param description Method description
   * @cliSyntax methodName parameters description
   * @cliDefault parameters ''
   * @cliDefault description 'New method'
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
    const { join } = await import('path');
    const { readFileSync, writeFileSync } = await import('fs');
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
  protected generateMethodCode(methodName: string, params: string[], description: string): string {
    const paramList = params.map(p => `${p}: string`).join(', ');
    const cliSyntax = params.join(' ');
    
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
   * Calculate sum of two numbers (demo custom method)
   * @param a First number
   * @param b Second number
   * @cliSyntax a b
   */
  async calculateSum(a: string, b: string): Promise<this> {
    console.log(`🚀 calculateSum called`);
    console.log(`   a: ${a}`);
    console.log(`   b: ${b}`);
    
    const sum = parseFloat(a) + parseFloat(b);
    console.log(`\n✅ Result: ${a} + ${b} = ${sum}`);
    
    return this;
  }
}
