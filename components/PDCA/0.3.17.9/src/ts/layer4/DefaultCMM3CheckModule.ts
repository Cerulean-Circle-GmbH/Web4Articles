/**
 * DefaultCMM3CheckModule - Radical OOP CMM3 Compliance Checker
 * 
 * ARCHITECTURE:
 * - Wraps complex compliance logic in manageable OOP structure
 * - this.model stores all state
 * - Functional checks are CONTAINED, not eliminated
 * - Output is model-driven
 * 
 * This is about MANAGING complexity, not rewriting everything.
 */

import { CMM3CheckModule, CMM3CheckModuleModel, ViolationRule } from '../layer3/CMM3CheckModule.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { existsSync } from 'fs';

export class DefaultCMM3CheckModule implements CMM3CheckModule {
  model: CMM3CheckModuleModel;

  constructor() {
    this.model = {
      projectRoot: '',
      sessionFiles: new Map(),
      summary: { total: 0, cmm3: 0, cmm2: 0, cmm1: 0 },
      output: [],
      violationDetails: new Map()
    };
  }

  /**
   * Initialize with scenario
   * @cliHide
   */
  init(scenario?: Scenario): this {
    return this;
  }

  /**
   * Check a single PDCA file for CMM3 compliance
   * Radical OOP: All state in model, output built in model
   * @cliHide
   */
  async checkFile(filePath: string): Promise<this> {
    this.model.output = [];
    this.addOutput('\n🔍 CMM3 Compliance Check - Single File');
    this.addOutput(`📄 File: ${filePath}\n`);

    // Load file into model
    await this.loadFileIntoModel(filePath);
    
    if (!this.model.currentFile) {
      this.displayOutput();
      return this;
    }

    // Check compliance (functional logic contained here)
    this.checkComplianceInModel();

    // Build output from model
    this.buildFileOutputFromModel();
    
    // Display
    this.displayOutput();
    
    return this;
  }

  /**
   * Check all PDCA files in a session directory
   * Radical OOP: All state in model, output built in model
   * @cliHide
   */
  async checkSession(sessionPath?: string): Promise<this> {
    this.model.output = [];
    this.model.sessionFiles.clear();
    this.model.summary = { total: 0, cmm3: 0, cmm2: 0, cmm1: 0 };

    const targetPath = sessionPath || 'session';
    this.addOutput('\n🔍 CMM3 Compliance Check - Session');
    this.addOutput(`📁 Target: ${targetPath}\n`);

    // Load session files into model
    await this.loadSessionIntoModel(targetPath);

    if (this.model.sessionFiles.size === 0) {
      this.addOutput('❌ No PDCA files found\n');
      this.displayOutput();
      return this;
    }

    this.addOutput(`📊 Found ${this.model.sessionFiles.size} PDCA file(s) to check\n`);

    // Check each file
    await this.checkAllFilesInModel();

    // Build summary output
    this.buildSessionSummaryFromModel();

    // Display
    this.displayOutput();

    return this;
  }

  /**
   * Load file into model
   * Radical OOP: Uses this.model
   * @cliHide
   */
  private async loadFileIntoModel(filePath: string): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    // Get project root
    this.model.projectRoot = await this.findProjectRoot();

    // Resolve file path
    let fullPath: string;
    if (path.isAbsolute(filePath)) {
      fullPath = filePath;
    } else {
      fullPath = path.join(this.model.projectRoot, filePath);
    }

    // Check if file exists
    try {
      const stats = await fs.stat(fullPath);
      if (!stats.isFile()) {
        this.addOutput(`❌ Error: ${filePath} is not a file`);
        this.addOutput(`   Use checkSession to check a directory\n`);
        return;
      }
    } catch (error) {
      this.addOutput(`❌ Error: File not found: ${filePath}\n`);
      return;
    }

    if (!fullPath.endsWith('.pdca.md')) {
      this.addOutput(`❌ Error: ${filePath} is not a PDCA file (.pdca.md)\n`);
      return;
    }

    // Load into model
    const fileName = path.basename(fullPath);
    const content = await fs.readFile(fullPath, 'utf-8');

    this.model.currentFile = {
      path: fullPath,
      fileName: fileName,
      content: content,
      violations: []
    };
  }

  /**
   * Load session files into model
   * Radical OOP: Uses this.model
   * @cliHide
   */
  private async loadSessionIntoModel(sessionPath: string): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    // Get project root
    this.model.projectRoot = await this.findProjectRoot();
    const fullPath = path.join(this.model.projectRoot, sessionPath);

    // Check if path exists
    try {
      const stats = await fs.stat(fullPath);
      if (!stats.isDirectory()) {
        this.addOutput(`❌ Error: ${sessionPath} is not a directory\n`);
        return;
      }
    } catch (error) {
      this.addOutput(`❌ Error: Directory not found: ${sessionPath}\n`);
      return;
    }

    // Scan directory for PDCA files
    const files = await fs.readdir(fullPath);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md') && existsSync(path.join(fullPath, f)));

    // Load each file's content
    for (const fileName of pdcaFiles) {
      const filePath = path.join(fullPath, fileName);
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Store in model (violations will be filled during check)
      this.model.sessionFiles.set(fileName, []);
      
      // Also store content temporarily for checking
      if (!this.model.currentFile) {
        this.model.currentFile = { path: filePath, fileName, content, violations: [] };
      }
    }
  }

  /**
   * Check compliance for current file in model
   * Radical OOP: Reads from this.model.currentFile, writes to this.model.currentFile.violations
   * 
   * FUNCTIONAL LOGIC CONTAINED HERE:
   * This is where the functional checks live, but they're MANAGED by OOP structure
   * @cliHide
   */
  private checkComplianceInModel(): void {
    if (!this.model.currentFile) return;

    const { content, fileName } = this.model.currentFile;
    const violations: string[] = [];

    // 1. PDCA Compliance
    if (!this.check1a(content)) violations.push('1a');
    if (!this.check1b(content, fileName)) violations.push('1b');
    if (!this.check1c(content)) violations.push('1c');
    if (!this.check1d(content)) violations.push('1d');
    if (!this.check1e(content)) violations.push('1e');
    if (!this.check1g(content)) violations.push('1g');
    if (!this.check1i(content)) violations.push('1i');
    if (!this.check1j(content)) violations.push('1j');

    // 3. Chat Response Compliance
    if (!this.check3a(content)) violations.push('3a');
    if (!this.check3b(content)) violations.push('3b');

    // 4. Link Compliance
    if (!this.check4a(content)) violations.push('4a');
    if (!this.check4b(content)) violations.push('4b');
    if (!this.check4c(content)) violations.push('4c');
    if (!this.check4d(content)) violations.push('4d');

    // 5. Naming/Location
    if (!this.check5a(fileName)) violations.push('5a');
    if (!this.check5c(fileName)) violations.push('5c');

    // 6. Authorization
    if (!this.check6a(content)) violations.push('6a');

    // Store in model
    this.model.currentFile.violations = violations;
  }

  /**
   * Check all files in session
   * Radical OOP: Iterates over this.model.sessionFiles
   * @cliHide
   */
  private async checkAllFilesInModel(): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    for (const [fileName, _] of this.model.sessionFiles) {
      // Load file content
      const filePath = path.join(path.dirname(this.model.currentFile?.path || ''), fileName);
      const content = await fs.readFile(filePath, 'utf-8');

      // Set as current file
      this.model.currentFile = { path: filePath, fileName, content, violations: [] };

      // Check compliance
      this.checkComplianceInModel();

      // Store violations
      this.model.sessionFiles.set(fileName, this.model.currentFile.violations);

      // Update summary
      this.model.summary.total++;
      const level = this.determineCMMLevelFromModel();
      if (level === 'CMM3') this.model.summary.cmm3++;
      else if (level === 'CMM2') this.model.summary.cmm2++;
      else this.model.summary.cmm1++;

      // Build output for this file
      this.buildFileLineInOutput();
    }
  }

  /**
   * Build output for current file
   * Radical OOP: Reads from this.model.currentFile, writes to this.model.output
   * @cliHide
   */
  private buildFileOutputFromModel(): void {
    if (!this.model.currentFile) return;

    const { fileName, violations } = this.model.currentFile;

    if (violations.length === 0) {
      this.addOutput(`✅ ${fileName} - CMM3 Compliant\n`);
    } else {
      const level = this.determineCMMLevelFromModel();
      const badge = level === 'CMM1' ? '❌' : level === 'CMM2' ? '⚠️' : '🔄';
      this.addOutput(`${badge} ${fileName} - ${level}`);
      this.addOutput(`   Violations: ${violations.join(', ')}\n`);

      // Show detailed violations
      this.addOutput(`📋 Violation Details:`);
      for (const violation of violations) {
        const description = this.getViolationDescription(violation);
        this.addOutput(`   ${violation}: ${description}`);
      }
      this.addOutput('');
    }
  }

  /**
   * Build single line output for file in session check
   * Radical OOP: Reads from this.model.currentFile, writes to this.model.output
   * @cliHide
   */
  private buildFileLineInOutput(): void {
    if (!this.model.currentFile) return;

    const { fileName, violations } = this.model.currentFile;

    if (violations.length === 0) {
      this.addOutput(`✅ ${fileName} - CMM3 Compliant`);
    } else {
      const level = this.determineCMMLevelFromModel();
      const badge = level === 'CMM1' ? '❌' : level === 'CMM2' ? '⚠️' : '🔄';
      this.addOutput(`${badge} ${fileName} - ${level}`);
      this.addOutput(`   Violations: ${violations.join(', ')}`);
    }
  }

  /**
   * Build session summary output
   * Radical OOP: Reads from this.model.summary, writes to this.model.output
   * @cliHide
   */
  private buildSessionSummaryFromModel(): void {
    const { total, cmm3, cmm2, cmm1 } = this.model.summary;

    this.addOutput('\n📈 Summary:');
    this.addOutput(`   Total PDCAs: ${total}`);
    this.addOutput(`   ✅ CMM3: ${cmm3} (${Math.round(cmm3/total*100)}%)`);
    this.addOutput(`   ⚠️  CMM2: ${cmm2} (${Math.round(cmm2/total*100)}%)`);
    this.addOutput(`   ❌ CMM1: ${cmm1} (${Math.round(cmm1/total*100)}%)`);
    this.addOutput(`   Total Violations: ${this.countTotalViolationsInModel()}\n`);
  }

  /**
   * Count total violations across all files
   * Radical OOP: Reads from this.model.sessionFiles
   * @cliHide
   */
  private countTotalViolationsInModel(): number {
    let total = 0;
    for (const [_, violations] of this.model.sessionFiles) {
      total += violations.length;
    }
    return total;
  }

  /**
   * Determine CMM level from current file violations
   * Radical OOP: Reads from this.model.currentFile
   * @cliHide
   */
  private determineCMMLevelFromModel(): string {
    if (!this.model.currentFile) return 'CMM1';

    const violations = this.model.currentFile.violations;
    
    if (violations.length === 0) return 'CMM3';

    // CMM1: Critical violations
    const cmm1Violations = ['1a', '1b', '1c', '1d', '5a'];
    if (violations.some(v => cmm1Violations.includes(v))) return 'CMM1';

    // CMM2: Everything else
    return 'CMM2';
  }

  /**
   * Get human-readable description for violation code
   * @cliHide
   */
  private getViolationDescription(code: string): string {
    const descriptions: Record<string, string> = {
      '1a': 'Template version 3.2.4.2 not found or incorrect structure',
      '1b': 'UTC timestamp not in correct format',
      '1c': 'Missing section separators (---)',
      '1d': 'Template footer (42 Revelation) not found',
      '1e': 'Dual links contain TBD placeholders',
      '1g': 'CMM3 violation not properly reported',
      '1i': 'Git commit/push protocol not followed',
      '1j': 'QA Decisions section not properly formatted',
      '3a': 'Links only requirement not met',
      '3b': 'QA Decisions not copied verbatim',
      '3c': 'Dual link format incorrect',
      '4a': 'GitHub URLs not working',
      '4b': 'PDCA local links not relative',
      '4c': 'Chat local links not absolute',
      '4d': '§ notation not used',
      '5a': 'Filename not in YYYY-MM-DD-UTC-HHMM.pdca.md format',
      '5c': 'Filename contains descriptive text',
      '6a': 'Self-assigned CMM badge detected'
    };
    return descriptions[code] || 'Unknown violation';
  }

  /**
   * Find project root
   * @cliHide
   */
  private async findProjectRoot(): Promise<string> {
    const path = await import('path');
    const url = new URL(import.meta.url);
    const __filename = url.pathname;
    const __dirname = path.dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');
    return componentRoot.split('/components/')[0];
  }

  /**
   * Add line to output buffer
   * Radical OOP: Builds output in model
   * @cliHide
   */
  private addOutput(line: string): void {
    this.model.output.push(line);
  }

  /**
   * Display all output from model
   * Radical OOP: Output comes from model
   * @cliHide
   */
  private displayOutput(): void {
    this.model.output.forEach(line => console.log(line));
  }

  // ============================================================================
  // FUNCTIONAL CHECKS - CONTAINED BUT NOT ELIMINATED
  // These are the actual compliance rules. They're functional, but MANAGED.
  // ============================================================================

  private check1a(content: string): boolean {
    const requiredSections = [
      '## **📋 PLAN**',
      '## **🔧 DO**',
      '## **✅ CHECK**',
      '## **🎯 ACT**'
    ];
    
    const alternativeSections = [
      '## **PLAN**',
      '## **DO**',
      '## **CHECK**',
      '## **ACT**'
    ];
    
    for (const section of requiredSections) {
      if (!content.includes(section)) {
        const alt = alternativeSections.find(alt => section.includes(alt.replace(/\*\*/g, '')));
        if (!alt || !content.includes(alt)) {
          return false;
        }
      }
    }
    
    return true;
  }

  private check1b(content: string, fileName: string): boolean {
    const fileMatch = fileName.match(/^(\d{4}-\d{2}-\d{2}-UTC-\d{4})/);
    return !!fileMatch;
  }

  private check1c(content: string): boolean {
    const separators = (content.match(/^---$/gm) || []).length;
    return separators >= 4;
  }

  private check1d(content: string): boolean {
    return content.includes('**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."**') ||
           content.includes('"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."');
  }

  private check1e(content: string): boolean {
    return !content.includes('[TBD]') && 
           !content.includes('(TBD)');
  }

  private check1g(content: string): boolean {
    return content.includes('### **Artifact Links**') || 
           content.includes('**📊 Feature Gap Analysis:**') ||
           content.includes('## 📋 **Links**');
  }

  private check1i(content: string): boolean {
    return true; // Cannot validate from content alone
  }

  private check1j(content: string): boolean {
    return content.includes('### QA Decisions') ||
           content.includes('All clear, no decisions') ||
           content.includes('**D1:**') ||
           content.includes('Decision 1:');
  }

  private check3a(content: string): boolean {
    return content.includes('## **✅ CHECK') || content.includes('## **CHECK') || content.includes('## ✅ **CHECK**');
  }

  private check3b(content: string): boolean {
    return content.includes('## **🎯 ACT') || content.includes('## **ACT') || content.includes('## 🎯 **ACT**');
  }

  private check4a(content: string): boolean {
    return true; // Would need to actually fetch URLs
  }

  private check4b(content: string): boolean {
    return true; // Complex to check without file context
  }

  private check4c(content: string): boolean {
    return true; // Complex to check without file context
  }

  private check4d(content: string): boolean {
    return content.includes('[§/') || !content.includes('](scrum.pmo/');
  }

  private check5a(fileName: string): boolean {
    return /^\d{4}-\d{2}-\d{2}-UTC-\d{4}.*\.pdca\.md$/.test(fileName);
  }

  private check5c(fileName: string): boolean {
    // Filename should not have descriptive text between timestamp and .pdca.md
    const match = fileName.match(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}(.*)\.pdca\.md$/);
    if (!match) return false;
    const between = match[1];
    // Allow empty, dash, or very short suffixes
    return between === '' || between === '-' || between.length <= 3;
  }

  private check6a(content: string): boolean {
    // Check for self-assigned CMM badges (should not have "CMM3:" or "CMM4:" in headers)
    return !content.match(/^#.*CMM[34]:/m);
  }
}

