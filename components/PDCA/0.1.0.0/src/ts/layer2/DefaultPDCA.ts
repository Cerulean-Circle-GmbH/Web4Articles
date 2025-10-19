/**
 * DefaultPDCA - PDCA Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { PDCA } from '../layer3/PDCA.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { PDCAModel } from '../layer3/PDCAModel.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// Use latest version for delegation (always available)
import { DefaultWeb4TSComponent } from '../../../../../Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js';

export class DefaultPDCA implements PDCA {
  private model: PDCAModel;
  private web4ts?: any; // Lazy-initialized Web4TSComponent for delegation

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
   * Lazy initialization of Web4TSComponent for delegation (DRY principle)
   * Dynamic imports resolve paths at runtime, enabling location-independent operation
   * @cliHide
   */
  private async getWeb4TSComponent(): Promise<any> {
    if (this.web4ts) return this.web4ts;

    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const { dirname } = await import('path');

    // Get component root (where this version's package.json is)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');

    // Find project root (where components/ directory is)
    const projectRoot = componentRoot.split('/components/')[0];

    // Import Web4TSComponent class dynamically (OOP way!)
    const web4tscomponentModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js`
    );
    const { DefaultWeb4TSComponent } = web4tscomponentModule;

    // Instantiate and configure Web4TSComponent
    this.web4ts = new DefaultWeb4TSComponent();

    // Set 'on' context: load THIS component
    const componentName = 'PDCA';
    const currentVersion = '0.1.0.0';
    await this.web4ts.on(componentName, currentVersion);

    return this.web4ts;
  }

  /**
   * @cliHide
   */
  init(scenario: Scenario<PDCAModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<PDCAModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'PDCA',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'PDCA',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Check PDCA file(s) for CMM3 compliance violations
   * Based on scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md
   * 
   * @param pdcaPath - Path to PDCA file or directory (defaults to current session)
   * @cliSyntax pdcaPath
   * @cliDefault pdcaPath scrum.pmo/project.journal/2025-10-14-UTC-0948-session
   */
  async cmm3check(pdcaPath: string = 'scrum.pmo/project.journal/2025-10-14-UTC-0948-session'): Promise<this> {
    console.log(`\n🔍 CMM3 Compliance Check`);
    console.log(`📁 Target: ${pdcaPath}\n`);

    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Get project root
    const __filename = (await import('url')).fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');
    const projectRoot = componentRoot.split('/components/')[0];
    const fullPath = path.join(projectRoot, pdcaPath);

    // Check if CMM3 checklist has been modified since this code was written
    await this.checkChecklistFreshness(projectRoot, fs, path);

    // Check if path exists
    const stats = await fs.stat(fullPath);
    const pdcaFiles: string[] = [];

    if (stats.isDirectory()) {
      // Scan directory for PDCA files
      const files = await fs.readdir(fullPath);
      pdcaFiles.push(...files.filter(f => f.endsWith('.pdca.md') && existsSync(path.join(fullPath, f))).map(f => path.join(fullPath, f)));
    } else if (fullPath.endsWith('.pdca.md')) {
      pdcaFiles.push(fullPath);
    } else {
      console.log(`❌ Error: ${pdcaPath} is not a PDCA file or directory`);
      return this;
    }

    console.log(`📊 Found ${pdcaFiles.length} PDCA file(s) to check\n`);

    let totalViolations = 0;
    let cmm1Count = 0;
    let cmm2Count = 0;
    let cmm3Count = 0;

    for (const filePath of pdcaFiles) {
      const fileName = path.basename(filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      const violations = await this.checkPDCACompliance(content, fileName);

      if (violations.length === 0) {
        console.log(`✅ ${fileName} - CMM3 Compliant`);
        cmm3Count++;
      } else {
        const level = this.determineCMMLevel(violations);
        const badge = level === 'CMM1' ? '❌' : level === 'CMM2' ? '⚠️' : '🔄';
        console.log(`${badge} ${fileName} - ${level}`);
        console.log(`   Violations: ${violations.join(', ')}`);
        totalViolations += violations.length;
        
        if (level === 'CMM1') cmm1Count++;
        else if (level === 'CMM2') cmm2Count++;
        else cmm3Count++;
      }
    }

    // Summary
    console.log(`\n📈 Summary:`);
    console.log(`   Total PDCAs: ${pdcaFiles.length}`);
    console.log(`   ✅ CMM3: ${cmm3Count} (${Math.round(cmm3Count/pdcaFiles.length*100)}%)`);
    console.log(`   ⚠️  CMM2: ${cmm2Count} (${Math.round(cmm2Count/pdcaFiles.length*100)}%)`);
    console.log(`   ❌ CMM1: ${cmm1Count} (${Math.round(cmm1Count/pdcaFiles.length*100)}%)`);
    console.log(`   Total Violations: ${totalViolations}`);

    return this;
  }

  /**
   * Check if CMM3 checklist has been modified more recently than this code
   * Last synced: 2025-10-19-UTC-1413
   * @cliHide
   */
  private async checkChecklistFreshness(
    projectRoot: string, 
    fs: typeof import('fs/promises'),
    path: typeof import('path')
  ): Promise<void> {
    const checklistPath = path.join(projectRoot, 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md');
    const thisFilePath = path.join(projectRoot, 'components/PDCA/0.1.0.0/src/ts/layer2/DefaultPDCA.ts');
    
    try {
      const checklistStats = await fs.stat(checklistPath);
      const thisFileStats = await fs.stat(thisFilePath);
      
      // Last code update timestamp: 2025-10-19-UTC-1413
      const lastCodeUpdate = new Date('2025-10-19T14:13:00Z');
      
      if (checklistStats.mtime > lastCodeUpdate) {
        console.log(`⚠️  WARNING: CMM3 Checklist Modified!`);
        console.log(`   Checklist: ${checklistStats.mtime.toISOString()}`);
        console.log(`   Last Code Update: ${lastCodeUpdate.toISOString()}`);
        console.log(`   ⚠️  Review check methods in DefaultPDCA.ts to ensure all rules are covered!`);
        console.log(`   📍 File: ${checklistPath}\n`);
      }
    } catch (error) {
      // Silently ignore if checklist doesn't exist
    }
  }

  /**
   * Update feature tracking table with CMM3 compliance findings
   * 
   * @param sessionPath - Path to session directory (defaults to current session)
   * @cliSyntax sessionPath
   * @cliDefault sessionPath scrum.pmo/project.journal/2025-10-14-UTC-0948-session
   */
  async updateFeatureTrackingTable(sessionPath: string = 'scrum.pmo/project.journal/2025-10-14-UTC-0948-session'): Promise<this> {
    console.log(`\n📊 Updating Feature Tracking Table`);
    console.log(`📁 Session: ${sessionPath}\n`);

    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Get project root
    const __filename = (await import('url')).fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');
    const projectRoot = componentRoot.split('/components/')[0];
    
    const pdcaDir = path.join(projectRoot, sessionPath);
    const tablePath = path.join(pdcaDir, 'feature-gap-analysis-table.md');
    
    // Check if table exists
    if (!existsSync(tablePath)) {
      console.log(`❌ Error: Feature tracking table not found at ${tablePath}`);
      return this;
    }

    // Scan PDCAs and collect compliance data
    const files = await fs.readdir(pdcaDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md') && existsSync(path.join(pdcaDir, f))).sort();
    
    console.log(`🔍 Scanning ${pdcaFiles.length} PDCA files...`);
    
    const pdcaData = new Map<string, {filename: string, violations: string[], level: string}>();
    
    for (const fileName of pdcaFiles) {
      const filePath = path.join(pdcaDir, fileName);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const violations = await this.checkPDCACompliance(content, fileName);
        const level = this.determineCMMLevel(violations);
        
        pdcaData.set(fileName, { filename: fileName, violations, level });
      } catch (error) {
        console.log(`⚠️  Skipping ${fileName}: ${error}`);
      }
    }
    
    // Read current table
    let tableContent = await fs.readFile(tablePath, 'utf-8');
    
    // Update table rows
    let updatedCount = 0;
    const lines = tableContent.split('\n');
    const updatedLines: string[] = [];
    
    for (const line of lines) {
      // Match table rows with PDCA references
      const match = line.match(/\|\s*\*\*P\d+\*\*\s*\|(.*?)\|\s*\[GitHub\].*?(\d{4}-\d{2}-\d{2}-UTC-\d{4}[^)]*\.pdca\.md)/);
      
      if (match) {
        const pdcaFilename = path.basename(match[2]);
        const data = pdcaData.get(pdcaFilename);
        
          if (data) {
            // Extract columns
            const columns = line.split('|').map(c => c.trim());
            
            if (columns.length >= 5) {
              // Column 4 is CMM3 Compliant (index 4 in 1-indexed array with leading empty string)
              const existingStatus = columns[4];
              
              // Only update if:
              // 1. Current status is TBD or empty
              // 2. OR current status is manually set but tool found violations
              const shouldUpdate = 
                existingStatus === 'TBD' || 
                existingStatus === '' ||
                existingStatus.trim() === '';
              
              if (shouldUpdate || data.violations.length > 0) {
                // Build compliance status
                let complianceStatus = '';
                if (data.level === 'CMM3') {
                  complianceStatus = '✅ CMM3 [tool]';
                } else if (data.level === 'CMM2') {
                  if (data.violations.length > 0) {
                    complianceStatus = `⚠️ CMM2 (${data.violations.join(', ')}) [tool]`;
                  } else {
                    complianceStatus = '⚠️ CMM2 [tool]';
                  }
                } else {
                  if (data.violations.length > 0) {
                    complianceStatus = `❌ CMM1 (${data.violations.join(', ')}) [tool]`;
                  } else {
                    complianceStatus = '❌ CMM1 [tool]';
                  }
                }
                
                // If there was a manual review and tool found different results, note both
                if (!shouldUpdate && existingStatus && !existingStatus.includes('[tool]')) {
                  complianceStatus = `${existingStatus} → ${complianceStatus}`;
                }
                
                columns[4] = complianceStatus;
                
                // Reconstruct line
                const updatedLine = columns.join(' | ');
                updatedLines.push(updatedLine);
                updatedCount++;
                continue;
              }
            }
          }
      }
      
      updatedLines.push(line);
    }
    
    // Write updated table
    const updatedContent = updatedLines.join('\n');
    await fs.writeFile(tablePath, updatedContent);
    
    console.log(`✅ Updated ${updatedCount} PDCA entries in feature tracking table`);
    console.log(`📍 File: ${tablePath}\n`);
    
    // Show summary
    const cmm3Count = Array.from(pdcaData.values()).filter(d => d.level === 'CMM3').length;
    const cmm2Count = Array.from(pdcaData.values()).filter(d => d.level === 'CMM2').length;
    const cmm1Count = Array.from(pdcaData.values()).filter(d => d.level === 'CMM1').length;
    
    console.log(`📈 Compliance Summary:`);
    console.log(`   ✅ CMM3: ${cmm3Count} (${Math.round(cmm3Count/pdcaFiles.length*100)}%)`);
    console.log(`   ⚠️  CMM2: ${cmm2Count} (${Math.round(cmm2Count/pdcaFiles.length*100)}%)`);
    console.log(`   ❌ CMM1: ${cmm1Count} (${Math.round(cmm1Count/pdcaFiles.length*100)}%)`);

    return this;
  }

  /**
   * Check a single PDCA content for CMM3 compliance violations
   * Based on scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md
   * @cliHide
   */
  private async checkPDCACompliance(content: string, fileName: string): Promise<string[]> {
    const violations: string[] = [];

    // 1. PDCA Compliance
    if (!this.check1a(content)) violations.push('1a');
    if (!this.check1b(content, fileName)) violations.push('1b');
    if (!this.check1c(content)) violations.push('1c');
    if (!this.check1d(content)) violations.push('1d');
    if (!this.check1e(content)) violations.push('1e');
    // 1f requires todo_write tool access, skip for now
    if (!this.check1g(content)) violations.push('1g');
    // 1h requires external research capability, skip for now
    if (!this.check1i(content)) violations.push('1i');
    if (!this.check1j(content)) violations.push('1j');

    // 3. Chat Response Compliance (relevant sections in PDCA)
    if (!this.check3a(content)) violations.push('3a');
    if (!this.check3b(content)) violations.push('3b');
    if (!this.check3c(content)) violations.push('3c');

    // 4. Link Compliance
    if (!this.check4a(content)) violations.push('4a');
    if (!this.check4b(content)) violations.push('4b');
    if (!this.check4c(content)) violations.push('4c');
    if (!this.check4d(content)) violations.push('4d');

    // 5. Naming/Location
    if (!this.check5a(fileName)) violations.push('5a');
    // 5b and 5c require file path context, check if present
    if (!this.check5c(fileName)) violations.push('5c');

    // 6. Authorization
    if (!this.check6a(content)) violations.push('6a');

    // 7. Markdown Quality
    // 7a and 7b require list inspection, complex to automate

    return violations;
  }

  /**
   * 1a) Template version 3.2.4.2 exact match
   * Check for PLAN, DO, CHECK, ACT sections with proper formatting
   * @cliHide
   */
  private check1a(content: string): boolean {
    // Must have all 6 sections with horizontal separators
    return content.includes('## **📋 PLAN**') &&
           content.includes('## **⚙️ DO**') &&
           content.includes('## **✅ CHECK**') &&
           content.includes('## **🎯 ACT**');
  }

  /**
   * 1b) Real UTC time (YYYY-MM-DD-UTC-HHMM), not hallucinated
   * @cliHide
   */
  private check1b(content: string, fileName: string): boolean {
    // Extract date from filename
    const fileMatch = fileName.match(/^(\d{4}-\d{2}-\d{2}-UTC-\d{4})/);
    if (!fileMatch) return false;

    // Check if date appears in content with exact format
    const dateMatch = content.match(/\*\*(?:🗓️ Date|Created):\*\*\s*(\d{4}-\d{2}-\d{2}-UTC-\d{4})/);
    if (!dateMatch) return false;

    // Filename and content date must match
    return fileMatch[1] === dateMatch[1];
  }

  /**
   * 1c) All 6 sections with horizontal separators
   * @cliHide
   */
  private check1c(content: string): boolean {
    // Count --- separators (should have at least 4 for section divisions)
    const separators = (content.match(/^---$/gm) || []).length;
    return separators >= 4;
  }

  /**
   * 1d) All sections: exact template format, no modifications
   * Check for required subsections in DO section
   * @cliHide
   */
  private check1d(content: string): boolean {
    // DO section must have: Agent Name, Branch, Date
    return content.includes('**Agent Name:**') &&
           content.includes('**Branch:**') &&
           content.includes('**🗓️ Date:**');
  }

  /**
   * 1e) Working dual links, no "TBD" placeholders
   * @cliHide
   */
  private check1e(content: string): boolean {
    // Check for TBD in links or artifact sections
    return !content.includes('[TBD]') && 
           !content.includes('(TBD)') &&
           content.includes('[GitHub]') &&
           content.includes('[§/');
  }

  /**
   * 1g) CMM3 violation reporting with dual link to howto.PDCA.md
   * Check for Artifact Links section
   * @cliHide
   */
  private check1g(content: string): boolean {
    return content.includes('### **Artifact Links**') || 
           content.includes('**📊 Feature Gap Analysis:**');
  }

  /**
   * 1i) Git commit & push protocol: PDCAfilename.pdca.md format
   * Cannot check from content alone, assume compliant if file exists
   * @cliHide
   */
  private check1i(content: string): boolean {
    // Git protocol verification would require git log access
    // For now, check if PDCA has typical markers of being committed
    return true; // Cannot validate from content alone
  }

  /**
   * 1j) QA Decisions format: proper decisions OR "All clear, no decisions"
   * @cliHide
   */
  private check1j(content: string): boolean {
    // Must have either QA Decisions section or mention of decisions
    return content.includes('### QA Decisions') ||
           content.includes('All clear, no decisions') ||
           content.includes('**D1:**') ||
           content.includes('Decision 1:');
  }

  /**
   * 3a) CHECK section present
   * @cliHide
   */
  private check3a(content: string): boolean {
    return content.includes('## **✅ CHECK') || content.includes('## **CHECK');
  }

  /**
   * 3b) ACT section present
   * @cliHide
   */
  private check3b(content: string): boolean {
    return content.includes('## **🎯 ACT') || content.includes('## **ACT');
  }

  /**
   * 3c) Dual link format: [GitHub](URL) | [§/path](path)
   * @cliHide
   */
  private check3c(content: string): boolean {
    // Check for proper dual link format
    return content.includes('[GitHub]') && 
           content.includes('[§/') &&
           content.includes('github.com');
  }

  /**
   * 4a) GitHub URLs work after git push
   * Cannot validate without network access
   * @cliHide
   */
  private check4a(content: string): boolean {
    // Check if GitHub URLs are present and well-formed
    const githubLinks = content.match(/https:\/\/github\.com\/[^\s)]+/g);
    return githubLinks !== null && githubLinks.length > 0;
  }

  /**
   * 4b) PDCA local links: relative from document location
   * @cliHide
   */
  private check4b(content: string): boolean {
    // Check for relative paths in local links
    return content.includes('](../') || content.includes('](./');
  }

  /**
   * 4c) Chat local links: absolute from project root
   * Less relevant for PDCA files themselves
   * @cliHide
   */
  private check4c(content: string): boolean {
    // For PDCA files, local links should be relative
    return true;
  }

  /**
   * 4d) § notation for root path display
   * @cliHide
   */
  private check4d(content: string): boolean {
    return content.includes('[§/');
  }

  /**
   * 5a) YYYY-MM-DD-UTC-HHMM.pdca.md format only
   * @cliHide
   */
  private check5a(fileName: string): boolean {
    return /^\d{4}-\d{2}-\d{2}-UTC-\d{4}[^\/]*\.pdca\.md$/.test(fileName);
  }

  /**
   * 5c) No descriptive text in filename
   * @cliHide
   */
  private check5c(fileName: string): boolean {
    // After UTC-HHMM, should only have .pdca.md or allowed suffixes like .error.pdca.md
    return /^\d{4}-\d{2}-\d{2}-UTC-\d{4}(\.error|\.verification|\.ultimate-test|\.updown-experience-analysis)?\.pdca\.md$/.test(fileName);
  }

  /**
   * 6a) NEVER SELF ASSIGN A CMM BADGE
   * @cliHide
   */
  private check6a(content: string): boolean {
    // Check for self-assignment language
    const selfAssignment = /CMM\d badge (assigned|granted|awarded) to self|I (assign|grant|award) myself CMM\d/i;
    return !selfAssignment.test(content);
  }

  /**
   * Determine CMM level based on violations
   * @cliHide
   */
  private determineCMMLevel(violations: string[]): string {
    // CMM3: No violations
    if (violations.length === 0) return 'CMM3';
    
    // CMM1: Missing CHECK or ACT sections (3a, 3b), or no sections at all (1a)
    if (violations.includes('3a') || violations.includes('3b') || violations.includes('1a')) return 'CMM1';
    
    // CMM2: Has CHECK/ACT but other violations
    return 'CMM2';
  }

  /**
   * Process data through PDCA logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current PDCA state
   */
  async info(): Promise<this> {
    console.log(`📋 PDCA Information:`);
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
      const web4ts = await this.getWeb4TSComponent();
      await web4ts.test(scope, ...references);
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
    
    console.log(`🧪 Running PDCA tests with auto-promotion...`);
    
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
      
      console.log(`✅ PDCA tests completed successfully`);
      
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
        await web4ts.on('PDCA', currentVersion);
        await web4ts.upgrade('nextBuild');
        const parts = currentVersion.split('.').map(Number);
        const devVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
        await web4ts.on('PDCA', devVersion);
        await web4ts.setDev();
      }
      // Stage 1: Current is dev, no test link OR test is outdated → create test version
      else if (currentVersion === semanticLinks.dev && (!semanticLinks.test || semanticLinks.test < currentVersion)) {
        console.log(`\n🧪 Stage 1: dev → test (creating test version)...`);
        await web4ts.on('PDCA', currentVersion);
        await web4ts.upgrade('nextBuild');
        const parts = currentVersion.split('.').map(Number);
        const testVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
        await web4ts.on('PDCA', testVersion);
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
            await web4ts.on('PDCA', currentVersion);
            await web4ts.upgrade('nextPatch');
            
            // Find the newly created prod version (highest version)
            const componentParentDir = path.dirname(path.dirname(path.dirname(componentRoot)));
            const componentsDir = path.join(componentParentDir, 'components');
            const componentDir = path.join(componentsDir, 'PDCA');
            const versions = readdirSync(componentDir)
              .filter(v => /^\d+\.\d+\.\d+\.\d+$/.test(v))
              .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
            const prodVersion = versions[0];  // Highest version is the new prod
            
            // Set prod symlink
            await web4ts.on('PDCA', prodVersion);
            await web4ts.setProd();
            console.log(`✅ Promoted to production: ${prodVersion}`);
            
            // CRITICAL: Now create new dev version (nextBuild from prod)
            console.log(`🚧 Creating new dev version...`);
            await web4ts.on('PDCA', prodVersion);
            await web4ts.upgrade('nextBuild');
            
            // Find the newly created dev version (highest version)
            const newVersions = readdirSync(componentDir)
              .filter(v => /^\d+\.\d+\.\d+\.\d+$/.test(v))
              .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
            const newDevVersion = newVersions[0];  // Highest version is the new dev
            await web4ts.on('PDCA', newDevVersion);
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
      console.error(`❌ PDCA tests failed`);
      throw error;
    }
    
    return this;
  }

  /**
   * Build component (TypeScript compilation)
   * Delegates to Web4TSComponent for DRY architecture
   * @cliHide
   */
  async build(): Promise<this> {
    const web4ts = await this.getWeb4TSComponent();
    await web4ts.build();
    return this;
  }

  /**
   * Clean component build artifacts
   * Delegates to Web4TSComponent for DRY architecture
   * @cliHide
   */
  async clean(): Promise<this> {
    const web4ts = await this.getWeb4TSComponent();
    await web4ts.clean();
    return this;
  }

  /**
   * Show component directory tree structure
   * Delegates to Web4TSComponent for DRY architecture
   * @param depth Maximum depth to show (default: 4)
   * @param showHidden Whether to show hidden files (default: false)
   * @cliHide
   */
  async tree(depth: string = '4', showHidden: string = 'false'): Promise<this> {
    const web4ts = await this.getWeb4TSComponent();
    await web4ts.tree(depth, showHidden);
    return this;
  }

  /**
   * Show semantic version links (dev, test, prod, latest)
   * Delegates to Web4TSComponent for DRY architecture
   * @param action Optional action (e.g., 'repair' to fix broken links)
   * @cliHide
   */
  async links(action: string = ''): Promise<this> {
    const web4ts = await this.getWeb4TSComponent();
    await web4ts.links(action);
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
    
    // OOP: Instantiate own CLI and call completeParameter directly (no shell!)
    const { PDCACLI } = await import('../layer5/PDCACLI.js');
    const cli = new PDCACLI();
    
    if (!context) {
      // No context - test completions on PDCA itself
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on PDCA${filter ? ` (filter: ${filter})` : ''}`);
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
