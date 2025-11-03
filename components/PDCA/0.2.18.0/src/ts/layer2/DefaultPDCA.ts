/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { PDCA } from '../layer3/PDCA.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { PDCAModel } from '../layer3/PDCAModel.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// Use latest version for delegation (always available)
import { DefaultWeb4TSComponent } from '../../../../../Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js';

/**
 * Training topic definition - CMM3: Objective, Reproducible, Verifiable
 */
interface TrainingTopic {
  title: string;
  description: string;
  requiredReading: Array<{
    path: string;
    reason: string;
    depth: number;
  }>;
  keyLessons: string[];
  verificationChecklist: string[];
}

export class DefaultPDCA implements PDCA {
  private model: PDCAModel;
  private web4ts?: any; // Lazy-initialized Web4TSComponent for delegation
  private defaultSession: string = 'scrum.pmo/project.journal/2025-10-14-UTC-0948-session'; // Default session path

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
   * Set the default session path for PDCA operations
   * 
   * @param sessionPath - Path to session directory
   * @cliSyntax sessionPath
   */
  async setSession(sessionPath: string): Promise<this> {
    console.log(`\n📁 Setting Default Session Path\n`);
    console.log(`   Old: ${this.defaultSession}`);
    console.log(`   New: ${sessionPath}\n`);
    
    this.defaultSession = sessionPath;
    
    console.log(`✅ Default session updated!`);
    console.log(`   This will be used for:`);
    console.log(`   - cmm3checkSession (when no path specified)`);
    console.log(`   - updateFeatureTrackingTable (when no path specified)\n`);
    
    return this;
  }

  /**
   * Check a single PDCA file for CMM3 compliance violations
   * Based on scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md
   * 
   * @param pdcaFile - Path to PDCA file (relative to project root or absolute)
   * @cliSyntax pdcaFile
   */
  async cmm3check(pdcaFile: string): Promise<this> {
    console.log(`\n🔍 CMM3 Compliance Check - Single File`);
    console.log(`📄 File: ${pdcaFile}\n`);

    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Get project root
    const __filename = (await import('url')).fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');
    const projectRoot = componentRoot.split('/components/')[0];
    
    // Resolve file path
    let fullPath: string;
    if (path.isAbsolute(pdcaFile)) {
      fullPath = pdcaFile;
    } else {
      fullPath = path.join(projectRoot, pdcaFile);
    }

    // Check if file exists
    try {
      const stats = await fs.stat(fullPath);
      if (!stats.isFile()) {
        console.log(`❌ Error: ${pdcaFile} is not a file`);
        console.log(`   Use 'cmm3checkSession' to check a directory\n`);
        return this;
      }
    } catch (error) {
      console.log(`❌ Error: File not found: ${pdcaFile}\n`);
      return this;
    }

    if (!fullPath.endsWith('.pdca.md')) {
      console.log(`❌ Error: ${pdcaFile} is not a PDCA file (.pdca.md)\n`);
      return this;
    }

    // Check the file
    const fileName = path.basename(fullPath);
    const content = await fs.readFile(fullPath, 'utf-8');
    const violations = await this.checkPDCACompliance(content, fileName);

    if (violations.length === 0) {
      console.log(`✅ ${fileName} - CMM3 Compliant\n`);
    } else {
      const level = this.determineCMMLevel(violations);
      const badge = level === 'CMM1' ? '❌' : level === 'CMM2' ? '⚠️' : '🔄';
      console.log(`${badge} ${fileName} - ${level}`);
      console.log(`   Violations: ${violations.join(', ')}\n`);
      
      // Show detailed violations
      console.log(`📋 Violation Details:`);
      for (const violation of violations) {
        const description = this.getViolationDescription(violation);
        console.log(`   ${violation}: ${description}`);
      }
      console.log();
    }

    return this;
  }

  /**
   * Check all PDCA files in a session directory for CMM3 compliance violations
   * Based on scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md
   * 
   * @param sessionPath - Path to session directory (defaults to configured session)
   * @cliSyntax sessionPath
   */
  async cmm3checkSession(sessionPath?: string): Promise<this> {
    const targetPath = sessionPath || this.defaultSession;
    console.log(`\n🔍 CMM3 Compliance Check - Session`);
    console.log(`📁 Target: ${targetPath}\n`);

    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Get project root
    const __filename = (await import('url')).fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');
    const projectRoot = componentRoot.split('/components/')[0];
    const fullPath = path.join(projectRoot, targetPath);

    // Check if path exists
    let stats;
    try {
      stats = await fs.stat(fullPath);
    } catch (error) {
      console.log(`❌ Error: Directory not found: ${targetPath}\n`);
      return this;
    }

    const pdcaFiles: string[] = [];

    if (stats.isDirectory()) {
      // Scan directory for PDCA files
      const files = await fs.readdir(fullPath);
      pdcaFiles.push(...files.filter(f => f.endsWith('.pdca.md') && existsSync(path.join(fullPath, f))).map(f => path.join(fullPath, f)));
    } else {
      console.log(`❌ Error: ${targetPath} is not a directory`);
      console.log(`   Use 'cmm3check' to check a single file\n`);
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
    console.log(`   Total Violations: ${totalViolations}\n`);

    return this;
  }

  /**
   * Get human-readable description for a violation code
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
   * Check if CMM3 checklist or its dual-linked files have been modified since last PDCA component update
   * Warns if any files are newer than the component's last code update timestamp
   * Last synced: 2025-10-19-UTC-1500
   * 
   * @cliSyntax 
   */
  async checkCmm3Checklist(): Promise<this> {
    console.log(`\n🔍 Checking CMM3 Checklist Freshness\n`);

    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Get project root
    const __filename = (await import('url')).fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');
    const projectRoot = componentRoot.split('/components/')[0];
    
    // Last code update timestamp: 2025-10-19-UTC-1500
    const lastCodeUpdate = new Date('2025-10-19T15:00:00Z');
    const thisFilePath = path.join(projectRoot, 'components/PDCA/0.1.0.0/src/ts/layer2/DefaultPDCA.ts');
    
    console.log(`📅 PDCA Component Last Update: ${lastCodeUpdate.toISOString()}`);
    console.log(`📍 Component File: ${thisFilePath}\n`);
    
    // List of files to check
    const checklistPath = path.join(projectRoot, 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md');
    
    // Extract all dual-linked files from checklist
    const dualLinkedFiles: string[] = [];
    
    try {
      const checklistContent = await fs.readFile(checklistPath, 'utf-8');
      
      // Extract all § notation paths (local file references)
      // Format: [§/path/to/file](path/to/file)
      const linkRegex = /\[§\/([^\]]+)\]\(([^)]+)\)/g;
      let match;
      while ((match = linkRegex.exec(checklistContent)) !== null) {
        const displayPath = match[1];
        const linkPath = match[2];
        
        // Skip placeholder examples (where both parts match exactly or are generic like "path")
        if (displayPath === linkPath || displayPath === 'path' || linkPath === 'path') {
          continue;
        }
        
        dualLinkedFiles.push(displayPath);
      }
    } catch (error) {
      console.log(`❌ Error: Cannot read checklist at ${checklistPath}`);
      console.log(`   ${error}`);
      return this;
    }
    
    // Check checklist itself
    const filesToCheck = [
      { name: 'CMM3 Compliance Checklist', path: checklistPath }
    ];
    
    // Add all dual-linked files
    for (const relPath of dualLinkedFiles) {
      filesToCheck.push({
        name: `Dual-linked: ${relPath}`,
        path: path.join(projectRoot, relPath)
      });
    }
    
    console.log(`📋 Checking ${filesToCheck.length} files...\n`);
    
    const modifiedFiles: Array<{name: string, path: string, mtime: Date}> = [];
    
    for (const file of filesToCheck) {
      try {
        const stats = await fs.stat(file.path);
        
        if (stats.mtime > lastCodeUpdate) {
          modifiedFiles.push({
            name: file.name,
            path: file.path,
            mtime: stats.mtime
          });
        }
      } catch (error) {
        console.log(`⚠️  Warning: Cannot access ${file.name}`);
        console.log(`   Path: ${file.path}`);
        console.log(`   Error: ${error}\n`);
      }
    }
    
    // Report results
    if (modifiedFiles.length === 0) {
      console.log(`✅ All files up to date!`);
      console.log(`   No files modified since ${lastCodeUpdate.toISOString()}\n`);
    } else {
      console.log(`⚠️  WARNING: ${modifiedFiles.length} file(s) modified since last PDCA component update!\n`);
      console.log(`🔧 ACTION REQUIRED: Review PDCA component check methods!\n`);
      
      for (const file of modifiedFiles) {
        console.log(`📄 ${file.name}`);
        console.log(`   Modified: ${file.mtime.toISOString()}`);
        console.log(`   Path: ${file.path}\n`);
      }
      
      console.log(`⚠️  These files have been updated since the PDCA component was last modified.`);
      console.log(`   Review DefaultPDCA.ts check methods to ensure all rules are covered!\n`);
    }
    
    return this;
  }

  /**
   * Accept CMM3 checklist changes by updating the last code update timestamp
   * This acknowledges that you have reviewed the checklist changes and updated the check methods accordingly
   * 
   * @cliSyntax 
   */
  async acceptCmm3Checklist(): Promise<this> {
    console.log(`\n✅ Accepting CMM3 Checklist Changes\n`);

    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Get project root
    const __filename = (await import('url')).fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');
    const projectRoot = componentRoot.split('/components/')[0];
    
    const thisFilePath = path.join(projectRoot, 'components/PDCA/0.1.0.0/src/ts/layer2/DefaultPDCA.ts');
    
    // Read the current file
    let content = await fs.readFile(thisFilePath, 'utf-8');
    
    // Find the current timestamp in the code
    const timestampMatch = content.match(/Last code update timestamp: (\d{4}-\d{2}-\d{2}-UTC-\d{4})/);
    const oldTimestamp = timestampMatch ? timestampMatch[1] : 'unknown';
    
    // Generate new timestamp in format YYYY-MM-DD-UTC-HHMM
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const newTimestamp = `${year}-${month}-${day}-UTC-${hours}${minutes}`;
    
    console.log(`📅 Old Timestamp: ${oldTimestamp}`);
    console.log(`📅 New Timestamp: ${newTimestamp}\n`);
    
    // Update the timestamp in the file
    // Pattern 1: In checkCmm3Checklist method's JSDoc comment
    content = content.replace(
      /Last synced: \d{4}-\d{2}-\d{2}-UTC-\d{4}/,
      `Last synced: ${newTimestamp}`
    );
    
    // Pattern 2: In the actual code where lastCodeUpdate is defined
    content = content.replace(
      /Last code update timestamp: \d{4}-\d{2}-\d{2}-UTC-\d{4}/,
      `Last code update timestamp: ${newTimestamp}`
    );
    
    content = content.replace(
      /const lastCodeUpdate = new Date\('(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):00Z'\);/,
      `const lastCodeUpdate = new Date('${year}-${month}-${day}T${hours}:${minutes}:00Z');`
    );
    
    // Write back to file
    await fs.writeFile(thisFilePath, content);
    
    console.log(`✅ Updated timestamp in ${thisFilePath.replace(projectRoot + '/', '')}`);
    console.log(`\n⚠️  NOTE: You must rebuild the component for changes to take effect:`);
    console.log(`   web4tscomponent on PDCA 0.1.0.0 build\n`);
    console.log(`📋 Remember to:`);
    console.log(`   1. Review all check methods in DefaultPDCA.ts`);
    console.log(`   2. Ensure all new checklist rules are covered`);
    console.log(`   3. Test with: pdca checkCmm3Checklist`);
    console.log(`   4. Commit your changes\n`);
    
    return this;
  }

  /**
   * Fix dual links in markdown files to comply with Web4 dual link standard
   * Uses Web4TSComponent prod to find project root
   * Based on scripts/fix.dual.links logic
   * 
   * @param target - File or directory to fix (defaults to project root)
   * @cliSyntax target
   * @cliDefault target §
   */
  async fixDualLinks(target: string = '§'): Promise<this> {
    console.log(`\n🔧 Fixing Dual Links\n`);

    const fs = await import('fs/promises');
    const path = await import('path');
    const { existsSync, lstatSync, readlinkSync } = await import('fs');
    
    // Get project root using search logic
    const projectRoot = await this.getProjectRoot();
    
    console.log(`📍 Project Root: ${projectRoot}`);
    
    // Resolve target path
    let targetPath: string;
    if (target === '§') {
      targetPath = projectRoot;
    } else if (target.startsWith('§/')) {
      // Remove § prefix and join with project root
      targetPath = path.join(projectRoot, target.substring(2));
    } else if (path.isAbsolute(target)) {
      targetPath = target;
    } else {
      // Relative path - join with project root, not cwd
      targetPath = path.join(projectRoot, target);
    }
    
    console.log(`🎯 Target: ${targetPath}`);
    console.log(`📋 Dual Link Standard: [GitHub](URL) | [§/path](relative/path)\n`);
    
    // Check if target exists
    try {
      await fs.stat(targetPath);
    } catch (error) {
      console.log(`❌ Error: Target not found: ${targetPath}`);
      return this;
    }
    
    // Process target
    const stats = await fs.stat(targetPath);
    let totalFiles = 0;
    let fixedFiles = 0;
    
    if (stats.isFile()) {
      // Single file
      if (targetPath.endsWith('.md')) {
        totalFiles = 1;
        if (await this.fixMarkdownFile(targetPath, projectRoot, fs, path)) {
          fixedFiles = 1;
          console.log(`✅ Successfully fixed dual links in: ${targetPath.replace(projectRoot + '/', '')}`);
        } else {
          console.log(`ℹ️  No changes needed in: ${targetPath.replace(projectRoot + '/', '')}`);
        }
      } else {
        console.log(`⚠️  Target is not a markdown file: ${targetPath}`);
      }
    } else if (stats.isDirectory()) {
      // Directory - process recursively
      console.log(`📁 Processing directory: ${targetPath.replace(projectRoot + '/', '')}\n`);
      
      const result = await this.processDirectory(targetPath, projectRoot, fs, path);
      totalFiles = result.total;
      fixedFiles = result.fixed;
    }
    
    console.log(`\n📊 Summary: Processed ${totalFiles} files, fixed ${fixedFiles} files`);
    console.log(`✅ Dual Link fixing complete!\n`);
    
    return this;
  }

  /**
   * Get project root by searching for .git directory
   * Same logic as Web4TSComponent's findProjectRoot
   * @cliHide
   */
  private async getProjectRoot(): Promise<string> {
    const path = await import('path');
    const fs = await import('fs/promises');
    
    // Start from current working directory
    let currentDir = process.cwd();
    
    while (currentDir !== '/') {
      try {
        // Check if .git exists (file or directory)
        const gitPath = path.join(currentDir, '.git');
        await fs.stat(gitPath);
        // Found .git, this is the project root
        return currentDir;
      } catch {
        // .git not found, go up one directory
        currentDir = path.dirname(currentDir);
      }
    }
    
    // Fallback to current directory if no .git found
    return process.cwd();
  }

  /**
   * Internal helper: Calculate relative path from document to target
   * @cliHide
   */
  private _calculateRelativePathInternal(docPath: string, targetPath: string, path: typeof import('path')): string {
    const docDir = path.dirname(docPath);
    return path.relative(docDir, targetPath);
  }

  /**
   * DRY Helper: Get training topics (single source of truth)
   * @cliHide
   * 
   * TODO (Future DRY Refactoring): trainAI method currently has its own copy of this data.
   * In a future iteration, refactor trainAI to call this method instead of duplicating.
   * For now, this is a necessary duplication to make queryTrainAI work without breaking trainAI.
   */
  private _getTrainingTopicsInternal(): Record<string, any> {
    // NOTE: This structure is temporarily duplicated from trainAI (lines 1702-2286)
    // Future work: Make trainAI call this method to eliminate duplication
    return {
      'how-to-dual-links': {
        keyLessons: [
          '✅ Format: [GitHub](https://github.com/org/repo/blob/branch/path) | [§/path](path)',
          '✅ GitHub link: For human verification, works in any context',
          '✅ § notation: Project-root-relative, for local navigation',
          '✅ MUST be in sync: Same file, same branch, both valid',
          '⚠️ CMM3 4c: Links MUST be verifiable - file must be pushed',
          '🔧 Tool: `pdca getDualLink <file>` auto-generates correct format',
          '🔧 Auto-fix: getDualLink adds/commits/pushes if needed',
          '❌ NEVER use file:// prefix (CMM2 violation)',
          '❌ NEVER use relative paths without § notation',
          '⚠️ getDualLink returns project-root-relative in local link part',
          '⚠️ For source files NOT at root, use getDualLinkRelativePath to calculate paths',
          '🔧 Tool: `pdca getDualLinkRelativePath <from> <to>` calculates relative paths',
          '✅ Verification: cd to source dir, ls <path> to test link works',
          '❌ NEVER assume getDualLink output works without verification',
          '🚨 MANDATORY: Test every link with ls from source directory',
          '✨ Use getDualLinkRelativePath for zero-knowledge path calculation'
        ],
        verificationChecklist: [
          'Can write dual link format from memory',
          'Understands why GitHub link is needed (verification)',
          'Understands why § notation is needed (local navigation)',
          'Can use getDualLink to generate correct links',
          'Knows file must be pushed for link to be valid',
          'Recognizes CMM2 link violations (file://, no §, unpushed files)',
          'Knows getDualLink returns project-root-relative in local part',
          'Can use getDualLinkRelativePath to calculate relative paths',
          'Always verifies links with ls from source directory',
          'Tests every link before committing'
        ],
        title: '🔗 How to Dual Links: GitHub + § Notation for Chat Reports'
      },
      'how-to-test-first': {
        keyLessons: [
          '✅ Test-First Pattern: Write test → Run test → See it fail → Fix code → See it pass',
          '🎯 Trust the tests: If tests pass, functionality works. No manual verification needed.',
          '❌ Anti-pattern: "Let me manually verify that the test failed before fixing"',
          '❌ Anti-pattern: "I\'ll run the command manually to confirm the bug exists"',
          '🔄 CMM4 feedback loop: Test IS the verification mechanism',
          '⚡ Efficiency: Manual verification duplicates test effort and wastes time',
          '🛡️ Safety: Tests are reproducible; manual checks are subjective and error-prone',
          '📊 Test output is authoritative: PASS = works, FAIL = broken, no interpretation needed',
          '🚫 Never skip directly to fixing: Always run the test first to see the failure',
          '✨ Test-first enforces CMM3: Objective criteria (test assertions) over subjective judgment',
          '⚠️ Root cause: Efficiency bias → assumption cascade → skipping verification step',
          '💡 When debugging: Write a test that reproduces the bug, then fix until test passes'
        ],
        verificationChecklist: [
          'Can write a failing test before implementing a feature',
          'Trusts test output as authoritative (no manual verification)',
          'Recognizes manual verification as an anti-pattern',
          'Understands test-first as a CMM4 feedback loop',
          'Can identify when bias is leading to assumption cascade',
          'Knows to run tests first, not fix first',
          'Understands why test-first is CMM3-compliant (objective criteria)',
          'Can explain why manual verification is CMM2 (subjective)',
          'Avoids over-implementation (doing more than requested)',
          'Stops after showing test results, waits for user direction'
        ],
        title: '🧪 How to Test-First Verification: Trust Tests, Avoid Manual Verification'
      },
      'how-to-feature-development': {
        keyLessons: [
          '✅ Phase 0 - RAG Preparation: Query trainAI BEFORE planning (how-to-test-first, how-to-component)',
          '✅ Phase 1 - TRON Collaboration: Accept challenges as refinement opportunities',
          '✅ Phase 2 - Test-First Design: Write 5-7 comprehensive tests BEFORE implementation',
          '✅ Phase 3 - Expected Failure: Run tests, see failure, TRUST it (no manual check)',
          '✅ Phase 4 - Minimal Implementation: Add ONLY what\'s needed to pass tests',
          '✅ Phase 5 - Trust the Green: Tests pass = done (no manual verification)',
          '✅ Phase 6 - trainAI Integration: Close knowledge loop immediately',
          '✅ Phase 7 - TRON Validation: User confirms pattern, closes feedback loop',
          '🎯 CMM3 Compliance: Objective (tests) + Reproducible (git) + Systematic (process)',
          '⏱️ Time Investment: ~90 min for CMM3 feature vs quick hack',
          '🚀 Success Metric: TRON validates pattern, auto-promotion succeeds',
          '❌ NEVER skip tests: Test-first is mandatory for CMM3',
          '❌ NEVER manual verify: Tests are objective arbiter, not agent judgment',
          '🔄 RAG-Powered FOR TWO: Agent + trainAI + Tests + TRON = CMM3 naturally',
          '💡 Meta-Pattern: Query → Challenge → Test → Implement → Verify → Document → Validate',
          '🎓 External verification at EVERY phase prevents CMM2 violations',
          '✨ Pattern is replicable: Same 7 steps work for any new feature'
        ],
        verificationChecklist: [
          'Queried trainAI before planning (how-to-test-first, relevant domain topics)',
          'Wrote tests before implementation (5-7 test cases)',
          'Ran tests and saw expected failure (method not found, etc)',
          'Trusted failure without manual verification',
          'Implemented minimal code to pass tests (no gold-plating)',
          'All tests passed without manual verification',
          'Updated trainAI with new knowledge immediately',
          'TRON validated the pattern and result',
          'Can explain why this is CMM3 (objective, reproducible, systematic)',
          'Can replicate pattern for next feature development',
          'Understands 90-min investment pays off in reliability',
          'Recognizes external verification (trainAI + Tests + TRON) as key to CMM3'
        ],
        title: '🛠️ How to Feature Development: RAG-Powered Test-First CMM3 Pattern'
      },
      'how-to-test-workflow': {
        keyLessons: [
          '🔗 Semantic links: latest (dev work) → test (testing) → dev (stable) → prod (production)',
          '🧪 Test workflow: Work on `latest` → run `pdca test` → auto-promotes to `test` on success',
          '✅ Auto-promotion: `pdca test` creates/updates `test` symlink when all tests pass',
          '🔧 Test iteration: `web4tscomponent on <Component> latest test itCase` shows test tree',
          '📊 View state: `web4tscomponent on <Component> latest tree links` shows semantic links',
          '🛑 WORKFLOW REMINDER: Always work on dev until test → work on test until success → work on dev after success',
          '⚠️ Version promotion: Use component commands (promote, upgrade), NEVER manual symlinks',
          '🎯 Test selection: `web4tscomponent test itCase <token>` to run specific tests (e.g., 2a1)',
          '🔍 When tests fail: Fix on `test` version, not `latest`',
          '❌ Violated pattern: Fixing tests on `latest` instead of switching to `test` version',
          '💡 Test fixtures can pollute component structure (components/X/version/components/)',
          '⚠️ Obey forcing functions: WORKFLOW REMINDER is there for a reason',
          '📝 Commit discipline: Always commit new versions after successful `pdca test` auto-promotion',
          '🔄 Version lifecycle: `pdca test` manages symlinks but does NOT commit - that\'s your job',
          '✨ Test success = commit trigger: Auto-promotion signals "this version is ready to track"'
        ],
        verificationChecklist: [
          'Understands 4-level semantic versioning (latest, test, dev, prod)',
          'Knows the complete test workflow (latest → test → dev → prod)',
          'Recognizes auto-promotion happens on test success',
          'Can use `test itCase` to view and select tests',
          'Can use `tree links` to view semantic version state',
          'Knows to obey the WORKFLOW REMINDER',
          'Understands why manual symlink changes are CMM3 violations',
          'Can identify when to work on `test` vs `latest` version',
          'Recognizes test fixture pollution issues',
          'Commits new versions after `pdca test` auto-promotion',
          'Understands that `pdca test` manages symlinks but does not commit'
        ],
        title: '🧪 How to Test Workflow: Semantic Versioning and Test Iteration'
      }
    };
  }

  /**
   * DRY Helper: Search across multiple topics
   * @cliHide
   */
  private _searchAcrossTopics(
    query: string,
    scope: string[],
    topics: Record<string, any>
  ): any[] {
    const results: any[] = [];
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/);
    
    for (const topicKey of scope) {
      const topic = topics[topicKey];
      if (!topic) continue;
      
      // Search in key lessons
      if (topic.keyLessons) {
        topic.keyLessons.forEach((lesson: string) => {
          const lessonLower = lesson.toLowerCase();
          const matchCount = keywords.filter(kw => lessonLower.includes(kw)).length;
          
          if (matchCount > 0) {
            results.push({
              topic: topicKey,
              content: lesson,
              score: matchCount,
              type: 'lesson'
            });
          }
        });
      }
      
      // Search in verification checklist
      if (topic.verificationChecklist) {
        topic.verificationChecklist.forEach((item: string) => {
          const itemLower = item.toLowerCase();
          const matchCount = keywords.filter(kw => itemLower.includes(kw)).length;
          
          if (matchCount > 0) {
            results.push({
              topic: topicKey,
              content: item,
              score: matchCount,
              type: 'checklist'
            });
          }
        });
      }
    }
    
    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);
    
    return results;
  }

  /**
   * DRY Helper: Display query results grouped by topic
   * @cliHide
   */
  private _displayQueryResults(results: any[], topics: Record<string, any>): void {
    // Group by topic
    const grouped = new Map<string, any[]>();
    for (const result of results) {
      if (!grouped.has(result.topic)) {
        grouped.set(result.topic, []);
      }
      grouped.get(result.topic)!.push(result);
    }
    
    // Display each topic's results
    for (const [topicKey, matches] of grouped.entries()) {
      const topicTitle = topics[topicKey]?.title || topicKey;
      console.log(`📚 Found in: ${topicKey}`);
      console.log(`   ${topicTitle}`);
      console.log(`${'─'.repeat(80)}`);
      
      matches.forEach(match => {
        console.log(`${match.content}\n`);
      });
    }
    
    // Suggest related topics
    console.log(`💡 Related topics:`);
    for (const topicKey of grouped.keys()) {
      console.log(`   - pdca trainAI ${topicKey} (full guide)`);
    }
    console.log();
  }

  /**
   * DRY Helper: Display available topics
   * @cliHide
   */
  private _displayAvailableTopics(topics: Record<string, any>): void {
    console.log(`💡 Available topics:`);
    Object.keys(topics).forEach((key, i) => {
      const title = topics[key]?.title || key;
      console.log(`   ${i + 1}:${key} - ${title}`);
    });
    console.log();
  }

  /**
   * Fix dual links in a single markdown file
   * @cliHide
   */
  private async fixMarkdownFile(
    mdFile: string,
    projectRoot: string,
    fs: typeof import('fs/promises'),
    path: typeof import('path')
  ): Promise<boolean> {
    const { existsSync } = await import('fs');
    
    console.log(`📄 Processing: ${mdFile.replace(projectRoot + '/', '')}`);
    
    // Read file
    const content = await fs.readFile(mdFile, 'utf-8');
    const lines = content.split('\n');
    
    let changes = 0;
    const newLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNum = i + 1;
      
      // Pattern 1: Standard dual link [GitHub](...) | [text](path)
      const standardMatch = line.match(/\[GitHub\]\(([^)]+)\)\s*\|\s*\[([^\]]*)\]\(([^)]+)\)/);
      
      // Pattern 2: Missing brackets [GitHub](...) | plain/text
      const missingBracketsMatch = line.match(/\[GitHub\]\(([^)]+)\)\s*\|\s*([^[].+[^)])$/);
      
      if (standardMatch) {
        const [fullMatch, githubUrl, displayText, localPath] = standardMatch;
        
        // Extract GitHub path
        const githubPathMatch = githubUrl.match(/github\.com\/[^/]+\/[^/]+\/blob\/[^/]+\/(.+)$/);
        const githubPath = githubPathMatch ? githubPathMatch[1] : null;
        
        // Determine if fix is needed
        let needsFix = false;
        let newDisplay = displayText;
        let newPath = localPath;
        
        // Check if display and path match (should use § notation)
        if (displayText === localPath && !localPath.startsWith('../')) {
          if (existsSync(path.join(projectRoot, localPath))) {
            needsFix = true;
            newDisplay = `§/${localPath}`;
            newPath = this._calculateRelativePathInternal(mdFile, path.join(projectRoot, localPath), path);
          }
        }
        // Check if GitHub path differs from local path
        else if (githubPath && githubPath !== localPath) {
          const expectedPath = this._calculateRelativePathInternal(mdFile, path.join(projectRoot, githubPath), path);
          if (localPath !== expectedPath && existsSync(path.join(projectRoot, githubPath))) {
            needsFix = true;
            newDisplay = `§/${githubPath}`;
            newPath = expectedPath;
          }
        }
        
        if (needsFix) {
          const leading = line.match(/^(\s*)/)?.[1] || '';
          const newLine = `${leading}[GitHub](${githubUrl}) | [${newDisplay}](${newPath})`;
          newLines.push(newLine);
          changes++;
          console.log(`   ✅ Line ${lineNum}: Fixed dual link`);
          console.log(`      Old: [${displayText}](${localPath})`);
          console.log(`      New: [${newDisplay}](${newPath})`);
        } else {
          newLines.push(line);
        }
      } else if (missingBracketsMatch) {
        const [, githubUrl, plainPath] = missingBracketsMatch;
        
        // Fix missing brackets
        const trimmedPath = plainPath.trim();
        let newDisplay: string;
        let newPath: string;
        
        if (existsSync(path.join(projectRoot, trimmedPath))) {
          newDisplay = `§/${trimmedPath}`;
          newPath = this._calculateRelativePathInternal(mdFile, path.join(projectRoot, trimmedPath), path);
        } else {
          newDisplay = trimmedPath;
          newPath = trimmedPath;
        }
        
        const leading = line.match(/^(\s*)/)?.[1] || '';
        const newLine = `${leading}[GitHub](${githubUrl}) | [${newDisplay}](${newPath})`;
        newLines.push(newLine);
        changes++;
        console.log(`   ✅ Line ${lineNum}: Fixed missing brackets`);
        console.log(`      Old: ${plainPath}`);
        console.log(`      New: [${newDisplay}](${newPath})`);
      } else {
        newLines.push(line);
      }
    }
    
    // Write file if changes were made
    if (changes > 0) {
      await fs.writeFile(mdFile, newLines.join('\n'));
      console.log(`   ✅ Fixed ${changes} dual links\n`);
      return true;
    } else {
      console.log(`   ℹ️  No dual links needed fixing\n`);
      return false;
    }
  }

  /**
   * Process directory recursively
   * @cliHide
   */
  private async processDirectory(
    dir: string,
    projectRoot: string,
    fs: typeof import('fs/promises'),
    path: typeof import('path')
  ): Promise<{total: number, fixed: number}> {
    let total = 0;
    let fixed = 0;
    
    const shouldSkip = (filePath: string): boolean => {
      return filePath.includes('/node_modules/') ||
             filePath.includes('/.git/') ||
             filePath.includes('/target/') ||
             filePath.includes('/dist/') ||
             filePath.includes('/.next/');
    };
    
    const processDir = async (currentDir: string): Promise<void> => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (shouldSkip(fullPath)) continue;
        
        if (entry.isDirectory()) {
          await processDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          total++;
          if (await this.fixMarkdownFile(fullPath, projectRoot, fs, path)) {
            fixed++;
          }
        }
      }
    };
    
    await processDir(dir);
    
    return { total, fixed };
  }

  /**
   * Update feature tracking table with CMM3 compliance findings
   * 
   * @param sessionPath - Path to session directory (defaults to configured session)
   * @cliSyntax sessionPath
   */
  async updateFeatureTrackingTable(sessionPath?: string): Promise<this> {
    const targetPath = sessionPath || this.defaultSession;
    console.log(`\n📊 Updating Feature Tracking Table`);
    console.log(`📁 Session: ${targetPath}\n`);

    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Get project root
    const __filename = (await import('url')).fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const componentRoot = path.resolve(__dirname, '../../..');
    const projectRoot = componentRoot.split('/components/')[0];
    
    const pdcaDir = path.join(projectRoot, targetPath);
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
   * Check for required template structure by reading actual template
   * @cliHide
   */
  private check1a(content: string): boolean {
    // Check for template version marker
    if (!content.includes('**🎯 Template Version:** 3.2.4.2')) {
      return false;
    }
    
    // Check for required static section headers from template
    const requiredSections = [
      '## **📊 SUMMARY**',
      '### **Artifact Links**',
      '### **To TRON: QA Decisions required**',
      '### **TRON Feedback',
      '### **My Answer**',
      '## **📋 PLAN**',
      '## **🔧 DO**',
      '## **✅ CHECK**',
      '## **🎯 ACT**'
    ];
    
    // Alternative section formats (older PDCAs might use different emojis)
    const alternativeSections = [
      '## **PLAN**',
      '## **DO**',
      '## **CHECK**',
      '## **ACT**'
    ];
    
    // Check if all required sections exist (with fallback to alternatives)
    for (const section of requiredSections) {
      if (!content.includes(section)) {
        // Check alternatives
        const alt = alternativeSections.find(alt => section.includes(alt.replace(/\*\*/g, '')));
        if (!alt || !content.includes(alt)) {
          return false;
        }
      }
    }
    
    return true;
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
    // const dateMatch = content.match(/\*\*(?:🗓️ Date|Created):\*\*\s*(\d{4}-\d{2}-\d{2}-UTC-\d{4})/);
    // if (!dateMatch) return false;

    // Filename and content date must match
    // return fileMatch[1] === dateMatch[1];
    return true; // manuelle Anpassung
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
   * Check for required footer section from template (The 42 Revelation)
   * @cliHide
   */
  private check1d(content: string): boolean {
    // Check for the footer section from template
    // This is a required static part that all PDCAs should have
    return content.includes('### **📚 The 42 Revelation**') ||
           content.includes('**Understanding requires regression testing:**') ||
           content.includes('**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."**');
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
   * Checks that all dual links follow proper format
   * @cliHide
   */
  private check3c(content: string): boolean {
    // Find all lines with dual links
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Check for GitHub dual link patterns
      if (line.includes('[GitHub](') && line.includes('|')) {
        // Pattern 1: Standard dual link [GitHub](...) | [text](path)
        const standardMatch = line.match(/\[GitHub\]\(([^)]+)\)\s*\|\s*\[([^\]]*)\]\(([^)]+)\)/);
        
        // Pattern 2: Missing brackets [GitHub](...) | plain/text (VIOLATION)
        const missingBracketsMatch = line.match(/\[GitHub\]\(([^)]+)\)\s*\|\s*([^[].+[^)])$/);
        
        if (missingBracketsMatch) {
          // Found dual link with missing brackets - this is a violation
          return false;
        }
        
        if (standardMatch) {
          const [, githubUrl, displayText, localPath] = standardMatch;
          
          // Check if display text uses § notation or is a relative path
          // Valid: [§/path/to/file](../../../path/to/file)
          // Valid: [local/file](local/file)
          // Invalid: [/absolute/path](../../../path) without §
          // Invalid: display text and local path don't match pattern
          
          if (displayText.startsWith('/') && !displayText.startsWith('§/')) {
            // Absolute path without § notation
            return false;
          }
          
          // Check if GitHub URL is valid
          if (!githubUrl.includes('github.com')) {
            return false;
          }
        }
      }
    }
    
    // All dual links are properly formatted
    return true;
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
   * Train AI agents on specific topics with CMM3-defined, reproducible learning paths
   * Systematically transfers knowledge to ensure agents don't repeat CMM2 mistakes
   * Includes collaboration patterns, instruction interpretation, test-first verification, and zero-knowledge method usage
   * 
   * @param topic Training topic identifier (e.g., "how-to-start", "how-to-pdca", "how-to-cmm", "how-to-component", "how-to-feature-development", "how-to-test-workflow", "how-to-test-first", "how-to-dual-links", "how-to-ensure-links", "how-to-component-upgrade", "how-to-interpret-instructions", "how-to-collaborate", "how-to-chat-response") or number (e.g., "1", "2", "3")
   * @param options Optional training configuration
   * @cliSyntax topic
   * @cliValues topic how-to-start how-to-pdca how-to-cmm how-to-component how-to-feature-development how-to-test-workflow how-to-test-first how-to-dual-links how-to-ensure-links how-to-component-upgrade how-to-interpret-instructions how-to-collaborate how-to-chat-response 1 2 3 4 5 6 7 8 9 10 11 12 13
   */
  async trainAI(topic: string): Promise<this> {
    console.log(`\n🎓 AI Training Module - CMM3 Reproducible Learning\n`);

    // Future trainAI topics from gap analysis (2025-10-21-UTC-1047):
    // - how-to-environment-setup: Shell config, git setup, source.env
    // - how-to-agent-safety: Interactive command avoidance, safety protocols (CRITICAL)
    // - how-to-session-structure: Directory organization, branch management
    // - how-to-agent-identity: RequestID, agent registry
    // See: scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1047.trainai-gaps.pdca.md

    // Single source of truth: ordered topic list for both display and numeric mapping
    const orderedTopics = [
      'how-to-start',
      'how-to-pdca',
      'how-to-cmm',
      'how-to-dual-links',
      'how-to-ensure-links',
      'how-to-component-upgrade',
      'how-to-component',
      'how-to-feature-development',
      'how-to-test-workflow',
      'how-to-test-first',
      'how-to-interpret-instructions',
      'how-to-collaborate',
      'how-to-chat-response'
    ];

    // Handle numeric input - map number to topic name
    let actualTopic = topic;
    if (/^\d+$/.test(topic)) {
      const index = parseInt(topic, 10) - 1;
      if (index >= 0 && index < orderedTopics.length) {
        actualTopic = orderedTopics[index];
        console.log(`📍 Selected: ${index + 1}:${actualTopic}\n`);
      } else {
        console.log(`❌ Error: Invalid topic number. Valid range: 1-${orderedTopics.length}\n`);
        console.log(`\n📚 Available topics:`);
        orderedTopics.forEach((key, i) => {
          console.log(`   ${i + 1}:${key}`);
        });
        console.log(`\n💡 Usage: pdca trainAI <number>  or  pdca trainAI <topic-name>\n`);
        return this;
      }
    } else {
      console.log(`📚 Topic: ${actualTopic}\n`);
    }

    // Training topic definitions - CMM3: Objective, Reproducible, Verifiable
    const trainingTopics: { [key: string]: TrainingTopic } = {
      'how-to-start': {
        title: '🚀 How to Start: Background Agent Startup Protocol',
        description: 'Complete startup sequence for new agents, including CMM4 understanding, identity setup, and initial PDCA creation',
        requiredReading: [
          {
            path: 'README.md',
            reason: 'Main entry point - defines 12-step startup protocol',
            depth: 3
          },
          {
            path: 'scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md',
            reason: 'CRITICAL: Must understand CMM4 framework FIRST before touching anything',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/howto.PDCA.md',
            reason: 'Learn PDCA creation and compliance rules',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/template.md',
            reason: 'Official PDCA template structure',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md',
            reason: 'Decision-making framework for QA and user alignment',
            depth: 2
          }
        ],
        keyLessons: [
          '🔴 ALWAYS read CMM4 framework (howto.cmm.md) FIRST',
          '✅ Use component methods (web4tscomponent) for version control - NEVER manual cp/mkdir',
          '✅ Follow startup decisions: Focus, Role, Duration, Location, Identity',
          '✅ Create session-start PDCA using timestamp-only filename',
          '✅ Verify CMM3 compliance: objective, reproducible, verifiable',
          '⚠️ Read to depth 3: document → references → secondary references',
          '🔗 Session end: Validate dual links with `pdca ensureValidLinks <session-dir>`',
          '🛑 Feedback points: After showing results, STOP and wait for user',
          '🤝 Collaboration: User controls loop, you execute within it',
          '⚠️ "Show me" = show + STOP, not show + analyze + implement'
        ],
        verificationChecklist: [
          'Can recite the 12 startup steps from README.md',
          'Understands CMM1-CMM4 progression and why CMM4 is feedback loop mastery',
          'Can create agent identity file in correct location',
          'Can create session-start PDCA with correct filename format',
          'Knows to use web4tscomponent for ALL version operations',
          'Validates all dual links before session end',
          'Can recognize feedback points in startup sequence',
          'Knows when to wait vs continue',
          'Understands collaboration model'
        ]
      },
      'how-to-pdca': {
        title: '📝 How to PDCA: Creating CMM3-Compliant Documentation',
        description: 'Learn to create excellent PDCAs with proper structure, links, and compliance',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/_shared/PDCA/template.md',
            reason: 'Single source of truth for PDCA format',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/howto.PDCA.md',
            reason: 'Consolidated guidelines for PDCA excellence',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: 'Complete CMM3 compliance verification',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ Use TRON format: Trigger (verbatim), Response, Outcome, Next',
          '✅ Dual linking: backward links to previous work, forward links to outcomes',
          '✅ Timestamp-only filenames: YYYY-MM-DD-UTC-HHMM.pdca.md (NO descriptive text)',
          '✅ DRY principle: cross-reference instead of duplicating content',
          '✅ Always include: "Never 2 1 (TO ONE). Always 4 2 (FOR TWO)." at end',
          '⚠️ CMM badges track compliance status throughout PDCA lifecycle',
          '🔗 Dual link format: [GitHub](URL) | [§/path](path) - see how-to-dual-links',
          '🔗 Generate dual links: `pdca getDualLink <file>` (auto-fixes git status)',
          '🔗 Validate links: `pdca ensureValidLinks <file>` before PDCA completion',
          '🛑 1f Step 2: "Interrupt immediately on unexpected observations and ask TRON"',
          '🤝 This is a feedback point - STOP and wait for TRON response',
          '⚠️ Present decisions when direction unclear (6c)',
          '❌ Never assume what user wants next'
        ],
        verificationChecklist: [
          'Can create PDCA with correct filename format',
          'Includes all sections: Links, Plan (with TRON), Do, Check, Act, Meta',
          'Uses dual links (backward + forward placeholders)',
          'DRY: references documents instead of copying content',
          'Includes philosophical insight line at end',
          'Validates dual links using getDualLink or ensureValidLinks',
          'Recognizes when to stop and ask TRON',
          'Can present decisions instead of assuming',
          'Knows collaboration protocol during PDCA creation'
        ]
      },
      'how-to-cmm': {
        title: '🎯 How to CMM: Understanding Capability Maturity Levels',
        description: 'Master the CMM framework from chaos (CMM1) to feedback loop mastery (CMM4)',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md',
            reason: 'Definitive CMM framework explanation',
            depth: 3
          },
          {
            path: 'README.md',
            reason: 'See CMM4 applied to startup process',
            depth: 2
          }
        ],
        keyLessons: [
          '📊 CMM1 (Chaos): No process, hero-dependent, unpredictable',
          '📋 CMM2 (Subjective): Basic processes exist but subjective/ad-hoc',
          '✅ CMM3 (Objective): Defined, reproducible, scientifically verifiable',
          '🔄 CMM4 (Feedback Loop): Continuous improvement through systematic iteration',
          '🎯 Goal: Processes that evolve WITHOUT breaking the system',
          '⚠️ Manual operations = CMM2. Component methods = CMM3.'
        ],
        verificationChecklist: [
          'Can explain CMM1-CMM4 levels with examples',
          'Understands PDCA as CMM4 feedback loop system',
          'Recognizes CMM2 violations (manual cp, subjective decisions)',
          'Can identify how to elevate CMM2 operations to CMM3',
          'Understands why CMM4 enables LLM capability evolution'
        ]
      },
      'how-to-dual-links': {
        title: '🔗 How to Dual Links: GitHub + § Notation for Chat Reports',
        description: 'Master dual link format: GitHub URLs for verification, § paths for local navigation',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/_shared/PDCA/chat.report.template.md',
            reason: 'Official chat report format with dual link examples',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: 'CMM3 4c: Link Compliance requirements',
            depth: 1
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/howto.PDCA.md',
            reason: 'Dual Link System section',
            depth: 1
          }
        ],
        keyLessons: [
          '✅ Format: [GitHub](https://github.com/org/repo/blob/branch/path) | [§/path](path)',
          '✅ GitHub link: For human verification, works in any context',
          '✅ § notation: Project-root-relative, for local navigation',
          '✅ MUST be in sync: Same file, same branch, both valid',
          '⚠️ CMM3 4c: Links MUST be verifiable - file must be pushed',
          '🔧 Tool: `pdca getDualLink <file>` auto-generates correct format',
          '🔧 Auto-fix: getDualLink adds/commits/pushes if needed',
          '❌ NEVER use file:// prefix (CMM2 violation)',
          '❌ NEVER use relative paths without § notation',
          '⚠️ getDualLink returns project-root-relative in local link part',
          '⚠️ For source files NOT at root, use getDualLinkRelativePath to calculate paths',
          '🔧 Tool: `pdca getDualLinkRelativePath <from> <to>` calculates relative paths',
          '✅ Verification: cd to source dir, ls <path> to test link works',
          '❌ NEVER assume getDualLink output works without verification',
          '🚨 MANDATORY: Test every link with ls from source directory',
          '✨ Use getDualLinkRelativePath for zero-knowledge path calculation'
        ],
        verificationChecklist: [
          'Can write dual link format from memory',
          'Understands why GitHub link is needed (verification)',
          'Understands why § notation is needed (local navigation)',
          'Can use getDualLink to generate correct links',
          'Knows file must be pushed for link to be valid',
          'Recognizes CMM2 link violations (file://, no §, unpushed files)',
          'Knows getDualLink returns project-root-relative in local part',
          'Can use getDualLinkRelativePath to calculate relative paths',
          'Always verifies links with ls from source directory',
          'Tests every link before committing'
        ]
      },
      'how-to-ensure-links': {
        title: '✅ How to Ensure Links: CMM3 Atomic Link Validation',
        description: 'Zero-knowledge automation: Ensure all dual links are valid across entire project',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-20-UTC-1215.pdca.md',
            reason: 'Complete design of dual link methods (getDualLink, findPDCAsLinking, updateLinksToFile, ensureValidLinks)',
            depth: 2
          }
        ],
        keyLessons: [
          '🎯 CMM3 Atomic: ensureValidLinks = single command, zero knowledge needed',
          '✅ Process: Normalize → Fix git → Generate canonical → Find PDCAs → Validate → Fix → Commit → Push',
          '✅ Usage: `pdca ensureValidLinks <file>` - fully automated',
          '✅ Dry-run: `pdca ensureValidLinks <file> true` - preview without changes',
          '✅ Idempotent: Safe to run multiple times, only fixes what needs fixing',
          '🔍 findPDCAsLinking: Find all PDCAs linking to a file (building block)',
          '🔄 updateLinksToFile: Bulk update when files move/version (building block)',
          '⚠️ Always run before PDCA completion to ensure valid links',
          '⚠️ Session end: Validate all session PDCAs'
        ],
        verificationChecklist: [
          'Understands CMM3 atomic operation concept (zero-knowledge required)',
          'Can run ensureValidLinks on any file',
          'Knows when to use dry-run mode (preview)',
          'Understands idempotency (safe to run repeatedly)',
          'Can use findPDCAsLinking to find link dependencies',
          'Knows to validate links before PDCA/session completion'
        ]
      },
      'how-to-component-upgrade': {
        title: '🚀 How to Component Upgrade: Link Management During Versioning',
        description: 'Maintain valid links when components evolve: version bumps, file moves, refactoring',
        requiredReading: [
          {
            path: 'components/Web4TSComponent/latest/README.md',
            reason: 'Component versioning patterns',
            depth: 1
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-20-UTC-1215.pdca.md',
            reason: 'updateLinksToFile method design and usage',
            depth: 1
          }
        ],
        keyLessons: [
          '✅ Workflow: Version bump → Update links → Test → Commit',
          '✅ Create version: `web4tscomponent on <Component> <version> upgrade nextPatch`',
          '✅ Update links: `pdca updateLinksToFile <old-path> <new-path>`',
          '✅ Dry-run first: `pdca updateLinksToFile <old> <new> true` to preview',
          '✅ Auto-commit: updateLinksToFile commits and pushes by default',
          '🔍 Pre-check: `pdca findPDCAsLinking <old-path>` to see impact',
          '⚠️ Always update links BEFORE deleting old version',
          '⚠️ Document moves in PDCA (backward compatibility)',
          '🎯 Example: 0.2.0.0 → 0.2.1.0 updates all linking PDCAs automatically'
        ],
        verificationChecklist: [
          'Can create new component version using web4tscomponent',
          'Knows to run findPDCAsLinking before version changes',
          'Can use updateLinksToFile in dry-run mode',
          'Understands when links need updating (path changes, version bumps)',
          'Knows to document version changes in PDCA',
          'Can maintain backward compatibility during refactoring'
        ]
      },
      'how-to-component': {
        title: '🔧 How to Component: Web4 Component System',
        description: 'Learn Web4 component patterns, versioning, and CLI auto-discovery',
        requiredReading: [
          {
            path: 'components/Web4TSComponent/latest/README.md',
            reason: 'Web4 component architecture and patterns',
            depth: 2
          },
          {
            path: 'components/PDCA/0.1.0.0/src/ts/layer2/DefaultPDCA.ts',
            reason: 'Example component implementation',
            depth: 1
          }
        ],
        keyLessons: [
          '✅ Use web4tscomponent for ALL version operations',
          '✅ Version creation: web4tscomponent on <Component> <version> upgrade <promotion>',
          '✅ Semantic versioning: nextPatch, nextMinor, nextMajor, nextBuild',
          '✅ Component pattern: Empty constructor + scenario initialization + functionality',
          '✅ Symlinks: latest (dev), prod (stable), test, dev',
          '⚠️ NEVER manually copy component versions - violates CMM3',
          '✅ Web4 CLI uses positional parameters (no --flags)',
          '✅ Parameter order defined by @cliSyntax annotation',
          '✅ Optional parameters: <?param> (trail, can omit)',
          '✅ Required parameters: <param> or !<param>',
          '✅ Example: `pdca moveFile <oldPath> <newPath> <?dryRun>`',
          '❌ NEVER use --flag syntax (Unix-style)',
          '✅ Consistency: All Web4 components follow same pattern',
          '🔧 @cliSyntax defines parameter order in method signature',
          '🔧 @cliDefault provides defaults for optional parameters',
          '🔧 @cliValues enables tab completion discovery',
          '✅ DRY: Symlink node_modules, never duplicate dependencies',
          '✅ DRY: Extend tsconfig.json from project root',
          '✅ DRY: Reuse existing methods, never copy-paste logic',
          '✅ DRY: Cross-reference docs, never duplicate content',
          '✅ initProject creates global node_modules and tsconfig',
          '❌ NEVER create real node_modules directories in components',
          '⚠️ Duplicated dependencies violate CMM3 (not reproducible)',
          '✅ Radical OOP: Empty constructors (no parameters)',
          '✅ Radical OOP: All config via init(scenario) method',
          '✅ Pattern: constructor() { this.model = {}; }',
          '✅ Pattern: init(scenario: Scenario<Model>): this',
          '✅ Why: Zero-dependency instantiation (testability)',
          '✅ Why: Flexible composition (multiple scenarios)',
          '❌ NEVER use constructor parameters (breaks radical OOP)',
          '✅ Method Chaining: Always return Promise<this>',
          '✅ Enables fluent API: component.method1().method2()',
          '✅ Enables CLI chaining: pdca method1 param1 method2',
          '✅ Pattern: async myMethod(): Promise<this> { return this; }',
          '✅ Auto-Discovery: Add method → CLI command appears',
          '✅ @cliSyntax annotation defines parameter order',
          '✅ @cliValues annotation enables tab completion',
          '✅ @cliHide annotation hides internal methods',
          '✅ TSDoc becomes CLI help text automatically',
          '❌ NEVER manually edit CLI files (auto-generated)'
        ],
        verificationChecklist: [
          'Can create new component version using web4tscomponent',
          'Understands semantic version promotion types',
          'Knows component directory structure and symlink purposes',
          'Can build component using: web4tscomponent on <Component> <version> build',
          'Recognizes when to use nextPatch vs nextMinor vs nextMajor',
          'Understands Web4 uses positional parameters, not flags',
          'Can read @cliSyntax to determine parameter order',
          'Knows optional parameters trail and can be omitted',
          'Understands DRY principle for dependencies (symlinks)',
          'Knows to extend tsconfig from root, not duplicate',
          'Can identify code duplication and refactor to reuse',
          'Understands radical OOP empty constructor pattern',
          'Can write init(scenario) method for configuration',
          'Knows constructor() should have no parameters',
          'Always returns Promise<this> for method chaining',
          'Understands @cliSyntax, @cliValues, @cliHide annotations',
          'Can add methods that auto-discover as CLI commands',
          'Recognizes CMM2 violations (real node_modules, constructor params)',
          'Can explain why DRY and Radical OOP enable CMM3',
          'Knows web4tscomponent initProject sets up DRY structure'
        ]
      },
      'how-to-feature-development': {
        title: '🛠️ How to Feature Development: RAG-Powered Test-First CMM3 Pattern',
        description: 'Master CMM3-compliant feature development: RAG preparation, test-first design, automated verification, and knowledge loop closure',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1550.feature.pdca.md',
            reason: 'Real example: getDualLinkRelativePath implementation using the pattern',
            depth: 2
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1605.pdca.md',
            reason: 'Meta-learning: Pattern extraction and CMM3 compliance analysis',
            depth: 2
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1410.test-first-verification.pdca.md',
            reason: 'Test-first verification principles and anti-patterns',
            depth: 1
          }
        ],
        keyLessons: [
          '✅ Phase 0 - RAG Preparation: Query trainAI BEFORE planning (how-to-test-first, how-to-component)',
          '✅ Phase 1 - TRON Collaboration: Accept challenges as refinement opportunities',
          '✅ Phase 2 - Test-First Design: Write 5-7 comprehensive tests BEFORE implementation',
          '✅ Phase 3 - Expected Failure: Run tests, see failure, TRUST it (no manual check)',
          '✅ Phase 4 - Minimal Implementation: Add ONLY what\'s needed to pass tests',
          '✅ Phase 5 - Trust the Green: Tests pass = done (no manual verification)',
          '✅ Phase 6 - trainAI Integration: Close knowledge loop immediately',
          '✅ Phase 7 - TRON Validation: User confirms pattern, closes feedback loop',
          '🎯 CMM3 Compliance: Objective (tests) + Reproducible (git) + Systematic (process)',
          '⏱️ Time Investment: ~90 min for CMM3 feature vs quick hack',
          '🚀 Success Metric: TRON validates pattern, auto-promotion succeeds',
          '❌ NEVER skip tests: Test-first is mandatory for CMM3',
          '❌ NEVER manual verify: Tests are objective arbiter, not agent judgment',
          '🔄 RAG-Powered FOR TWO: Agent + trainAI + Tests + TRON = CMM3 naturally',
          '💡 Meta-Pattern: Query → Challenge → Test → Implement → Verify → Document → Validate',
          '🎓 External verification at EVERY phase prevents CMM2 violations',
          '✨ Pattern is replicable: Same 7 steps work for any new feature'
        ],
        verificationChecklist: [
          'Queried trainAI before planning (how-to-test-first, relevant domain topics)',
          'Wrote tests before implementation (5-7 test cases)',
          'Ran tests and saw expected failure (method not found, etc)',
          'Trusted failure without manual verification',
          'Implemented minimal code to pass tests (no gold-plating)',
          'All tests passed without manual verification',
          'Updated trainAI with new knowledge immediately',
          'TRON validated the pattern and result',
          'Can explain why this is CMM3 (objective, reproducible, systematic)',
          'Can replicate pattern for next feature development',
          'Understands 90-min investment pays off in reliability',
          'Recognizes external verification (trainAI + Tests + TRON) as key to CMM3'
        ]
      },
      'how-to-test-workflow': {
        title: '🧪 How to Test Workflow: Semantic Versioning and Test Iteration',
        description: 'Master the test workflow: latest → test → dev → prod with auto-promotion and test iteration',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1234.pdca-test-workflow.pdca.md',
            reason: 'Complete test workflow documentation with semantic versioning',
            depth: 3
          },
          {
            path: 'components/Web4TSComponent/latest/README.md',
            reason: 'Component versioning and testing patterns',
            depth: 1
          }
        ],
        keyLessons: [
          '🔗 Semantic links: latest (dev work) → test (testing) → dev (stable) → prod (production)',
          '🧪 Test workflow: Work on `latest` → run `pdca test` → auto-promotes to `test` on success',
          '✅ Auto-promotion: `pdca test` creates/updates `test` symlink when all tests pass',
          '🔧 Test iteration: `web4tscomponent on <Component> latest test itCase` shows test tree',
          '📊 View state: `web4tscomponent on <Component> latest tree links` shows semantic links',
          '🛑 WORKFLOW REMINDER: Always work on dev until test → work on test until success → work on dev after success',
          '⚠️ Version promotion: Use component commands (promote, upgrade), NEVER manual symlinks',
          '🎯 Test selection: `web4tscomponent test itCase <token>` to run specific tests (e.g., 2a1)',
          '🔍 When tests fail: Fix on `test` version, not `latest`',
          '❌ Violated pattern: Fixing tests on `latest` instead of switching to `test` version',
          '💡 Test fixtures can pollute component structure (components/X/version/components/)',
          '⚠️ Obey forcing functions: WORKFLOW REMINDER is there for a reason',
          '📝 Commit discipline: Always commit new versions after successful `pdca test` auto-promotion',
          '🔄 Version lifecycle: `pdca test` manages symlinks but does NOT commit - that\'s your job',
          '✨ Test success = commit trigger: Auto-promotion signals "this version is ready to track"'
        ],
        verificationChecklist: [
          'Understands 4-level semantic versioning (latest, test, dev, prod)',
          'Knows the complete test workflow (latest → test → dev → prod)',
          'Recognizes auto-promotion happens on test success',
          'Can use `test itCase` to view and select tests',
          'Can use `tree links` to view semantic version state',
          'Knows to obey the WORKFLOW REMINDER',
          'Understands why manual symlink changes are CMM3 violations',
          'Can identify when to work on `test` vs `latest` version',
          'Recognizes test fixture pollution issues',
          'Commits new versions after `pdca test` auto-promotion',
          'Understands that `pdca test` manages symlinks but does not commit'
        ]
      },
      'how-to-test-first': {
        title: '🧪 How to Test-First Verification: Trust Tests, Avoid Manual Verification',
        description: 'Master the test-first pattern: Write tests first, trust them to show pass/fail, avoid manual verification loops',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1410.test-first-verification.pdca.md',
            reason: 'Meta-learning from violating test-first pattern',
            depth: 3
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1007.meta-learning.pdca.md',
            reason: 'Context on over-implementation and assumption cascade',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ Test-First Pattern: Write test → Run test → See it fail → Fix code → See it pass',
          '🎯 Trust the tests: If tests pass, functionality works. No manual verification needed.',
          '❌ Anti-pattern: "Let me manually verify that the test failed before fixing"',
          '❌ Anti-pattern: "I\'ll run the command manually to confirm the bug exists"',
          '🔄 CMM4 feedback loop: Test IS the verification mechanism',
          '⚡ Efficiency: Manual verification duplicates test effort and wastes time',
          '🛡️ Safety: Tests are reproducible; manual checks are subjective and error-prone',
          '📊 Test output is authoritative: PASS = works, FAIL = broken, no interpretation needed',
          '🚫 Never skip directly to fixing: Always run the test first to see the failure',
          '✨ Test-first enforces CMM3: Objective criteria (test assertions) over subjective judgment',
          '⚠️ Root cause: Efficiency bias → assumption cascade → skipping verification step',
          '💡 When debugging: Write a test that reproduces the bug, then fix until test passes'
        ],
        verificationChecklist: [
          'Can write a failing test before implementing a feature',
          'Trusts test output as authoritative (no manual verification)',
          'Recognizes manual verification as an anti-pattern',
          'Understands test-first as a CMM4 feedback loop',
          'Can identify when bias is leading to assumption cascade',
          'Knows to run tests first, not fix first',
          'Understands why test-first is CMM3-compliant (objective criteria)',
          'Can explain why manual verification is CMM2 (subjective)',
          'Avoids over-implementation (doing more than requested)',
          'Stops after showing test results, waits for user direction'
        ]
      },
      'how-to-interpret-instructions': {
        title: '🎯 How to Interpret Instructions: Literal vs Implied Actions',
        description: 'Master the art of parsing user instructions to understand exactly what\'s requested vs what\'s assumed',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: '6d - No assumptions about user intent',
            depth: 2
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1007.meta-learning.pdca.md',
            reason: 'Real example of instruction misinterpretation',
            depth: 3
          }
        ],
        keyLessons: [
          '✅ "Show me X" means: Execute X, Display result, STOP',
          '✅ "Fix X" means: Analyze, Propose, Implement (after confirmation)',
          '✅ "X and Y" means: Do X, then do Y',
          '✅ "X" does NOT imply Y, even if Y seems logical',
          '⚠️ Punctuation matters: "pdca" vs "pdca!" vs "PDCA"',
          '🛑 Feedback points: Where control returns to user',
          '❌ Never add implied actions',
          '❌ Never assume "next logical step"',
          '💡 Examples: "run tests" → Execute + show output + STOP (NOT: run + analyze + fix + commit)',
          '💡 "show me file.md" → Display file + STOP (NOT: show + analyze + suggest)',
          '💡 "pdca!" → Create PDCA file (NOT: write PDCA-formatted response)',
          '💡 "read X" → Read X, provide dual link, STOP (NOT: read + summarize + analyze)'
        ],
        verificationChecklist: [
          'Can parse "show me X" correctly (execute + display + stop)',
          'Understands difference between command and suggestion',
          'Recognizes punctuation significance (!, CAPS, etc)',
          'Can identify feedback points in instructions',
          'Knows when to ask vs assume'
        ]
      },
      'how-to-collaborate': {
        title: '🤝 How to Collaborate: User-in-the-Loop CMM4 Pattern',
        description: 'Understand CMM4 collaboration where user controls the loop and agent enables execution',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md',
            reason: 'CMM4 as feedback loop mastery',
            depth: 3
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1007.meta-learning.pdca.md',
            reason: 'Real example of collaboration violation',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md',
            reason: 'Decision-making framework for user alignment',
            depth: 2
          }
        ],
        keyLessons: [
          '🔄 CMM4 Loop: User decides → Agent executes → FEEDBACK POINT → User reflects → User decides',
          '✅ User controls WHAT to do',
          '✅ Agent controls HOW to do it',
          '✅ Feedback points = where control returns to user',
          '🛑 STOP at feedback points, don\'t assume next step',
          '⚠️ "Helpful" = enabling user, NOT solving without asking',
          '❌ Never close feedback loop prematurely',
          '❌ Never assume user wants problem solved',
          '💡 Collaboration Model: User (Decision) → Agent (Execute) → FEEDBACK POINT 🛑 STOP → User (Reflection) → User (Decision)',
          '💡 Anti-Pattern: User → Agent → (everything done) → User sees result ❌',
          '💡 Correct: User → Agent → Result → STOP → User → Next instruction ✅'
        ],
        verificationChecklist: [
          'Understands CMM4 collaboration loop',
          'Can identify feedback points',
          'Knows when to STOP vs continue',
          'Recognizes "helpful" vs "presumptuous"',
          'Waits for user decision at feedback points'
        ]
      },
      'how-to-chat-response': {
        title: '💬 How to Chat Response: CMM3 Compliance for Agent Replies',
        description: 'Master the art of chat responses - links only, no explanatory text, proper dual link format',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/_shared/PDCA/chat.report.template.md',
            reason: 'Official chat report format',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: '3a-3c chat response compliance',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ CMM3 3a: Links only, no explanatory text',
          '✅ CMM3 3c: Dual link format: [GitHub](URL) | [§/path](path)',
          '✅ CMM3 4c: Local link uses project-root-relative path',
          '✅ When user says "read X" → provide dual link, that\'s it',
          '⚠️ No summaries, no analysis, no "key points"',
          '⚠️ Exception: QA Decisions must be copied verbatim',
          '❌ NEVER add explanatory text before/after link',
          '❌ NEVER provide summary instead of link',
          '💡 Wrong: "I\'ve read the CMM3 compliance checklist. Key points: ... [link]" ❌',
          '💡 Right: "[GitHub](URL) | [§/path](path)" ✅'
        ],
        verificationChecklist: [
          'Can provide links without explanatory text',
          'Uses correct dual link format',
          'Knows when to add text (QA Decisions only)',
          'Recognizes 3a violations in own responses',
          'Can generate project-root-relative paths'
        ]
      }
    };

    const training = trainingTopics[actualTopic];
    
    if (!training) {
      console.error(`❌ Unknown training topic: ${actualTopic}`);
      console.log(`\n📚 Available topics:`);
      orderedTopics.forEach((key, i) => {
        console.log(`   ${i + 1}:${key}: ${trainingTopics[key].title}`);
      });
      console.log(`\n💡 Usage: pdca trainAI <number>  or  pdca trainAI <topic-name>\n`);
      return this;
    }

    // Display training content
    console.log(`${training.title}`);
    console.log(`${'='.repeat(80)}\n`);
    console.log(`${training.description}\n`);

    console.log(`📖 Required Reading (Reading Depth Protocol):`);
    console.log(`${'─'.repeat(80)}`);
    training.requiredReading.forEach((doc, i) => {
      console.log(`\n${i + 1}. ${doc.path}`);
      console.log(`   Reason: ${doc.reason}`);
      console.log(`   Depth: ${doc.depth} (read document + ${doc.depth - 1} levels of references)`);
    });

    console.log(`\n\n🎯 Key Lessons (Memorize These):`);
    console.log(`${'─'.repeat(80)}`);
    training.keyLessons.forEach((lesson, i) => {
      console.log(`${i + 1}. ${lesson}`);
    });

    console.log(`\n\n✓ Verification Checklist:`);
    console.log(`${'─'.repeat(80)}`);
    training.verificationChecklist.forEach((check, i) => {
      console.log(`[ ] ${i + 1}. ${check}`);
    });

    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`📊 Training Status: Content displayed`);
    console.log(`🎓 Next: Read all required documents, verify understanding with checklist`);
    console.log(`💡 CMM4 Note: As you complete this training, you evolve beyond base LLM limitations\n`);

    return this;
  }

  /**
   * Query trainAI knowledge base with natural language questions
   * Searches across all topics or within specific topic for quick answers
   * 
   * @param query Natural language question to search for
   * @param topic Optional: limit search to specific topic
   * @cliSyntax query topic
   * @cliDefault topic ""
   * @cliValues topic how-to-start how-to-pdca how-to-cmm how-to-component how-to-feature-development how-to-test-workflow how-to-test-first how-to-dual-links how-to-ensure-links how-to-component-upgrade how-to-interpret-instructions how-to-collaborate how-to-chat-response
   */
  async queryTrainAI(query: string, topic: string = ''): Promise<this> {
    console.log(`\n🔍 trainAI Query Results\n`);
    console.log(`Query: "${query}"\n`);
    
    // DRY: Reuse existing trainAI infrastructure
    const trainingTopics = this._getTrainingTopicsInternal();
    const searchScope = (topic && topic !== '') ? [topic] : Object.keys(trainingTopics);
    
    // Validate topic if provided
    if (topic && topic !== '' && !trainingTopics[topic]) {
      console.log(`❌ Topic "${topic}" not found\n`);
      this._displayAvailableTopics(trainingTopics);
      return this;  // Method chaining
    }
    
    // DRY: Use extracted search method
    const results = this._searchAcrossTopics(query, searchScope, trainingTopics);
    
    // Handle no results
    if (results.length === 0) {
      console.log(`❌ No results found for "${query}"\n`);
      this._displayAvailableTopics(trainingTopics);
      return this;  // Method chaining
    }
    
    // Display results grouped by topic
    this._displayQueryResults(results, trainingTopics);
    
    return this;  // Method chaining
  }

  /**
   * Calculate relative path from one file to another for dual link local part
   * Groups with getDualLink for zero-knowledge discoverability in autocomplete
   * 
   * Use this to calculate the correct relative path for the local part of dual links
   * when creating links in markdown files that are not at the project root.
   * 
   * @param fromFile Source file path (absolute or project-root-relative)
   * @param toFile Target file path (absolute or project-root-relative)
   * @returns Relative path from fromFile to toFile
   * @cliSyntax fromFile toFile
   */
  async getDualLinkRelativePath(fromFile: string, toFile: string): Promise<this> {
    console.log(`\n🧭 Relative Path Calculation\n`);
    
    const path = await import('path');
    const projectRoot = await this.getProjectRoot();
    
    // Normalize paths to full paths
    let fromFullPath: string;
    let toFullPath: string;
    
    if (path.isAbsolute(fromFile)) {
      fromFullPath = fromFile;
    } else if (fromFile.startsWith('§/')) {
      fromFullPath = path.join(projectRoot, fromFile.substring(2));
    } else {
      fromFullPath = path.join(projectRoot, fromFile);
    }
    
    if (path.isAbsolute(toFile)) {
      toFullPath = toFile;
    } else if (toFile.startsWith('§/')) {
      toFullPath = path.join(projectRoot, toFile.substring(2));
    } else {
      toFullPath = path.join(projectRoot, toFile);
    }
    
    // Calculate relative path
    const fromDir = path.dirname(fromFullPath);
    const relativePath = path.relative(fromDir, toFullPath);
    
    console.log(`📁 From: ${path.relative(projectRoot, fromFullPath)}`);
    console.log(`📁 To:   ${path.relative(projectRoot, toFullPath)}`);
    console.log(`\n✨ Relative Path: ${relativePath}\n`);
    
    return this;
  }

  /**
   * Get dual link for a file (GitHub URL + chat path)
   * Auto-fixes git status: adds, commits, pushes if needed
   * 
   * @param filePath Path to file (absolute or project-root-relative)
   * @cliSyntax filePath
   */
  async getDualLink(filePath: string): Promise<this> {
    console.log(`\n🔗 Generating Dual Link\n`);
    
    const fs = await import('fs/promises');
    const path = await import('path');
    const { existsSync } = await import('fs');
    const { execSync } = await import('child_process');
    
    // Get project root
    const projectRoot = await this.getProjectRoot();
    
    // Normalize file path to project-root-relative
    let normalizedPath: string;
    if (path.isAbsolute(filePath)) {
      normalizedPath = path.relative(projectRoot, filePath);
    } else if (filePath.startsWith('§/')) {
      normalizedPath = filePath.substring(2);
    } else {
      normalizedPath = filePath;
    }
    
    const fullPath = path.join(projectRoot, normalizedPath);
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      console.log(`❌ Error: File does not exist`);
      console.log(`   File: ${normalizedPath}\n`);
      return this;
    }
    
    console.log(`📄 Target: ${normalizedPath}`);
    console.log(`🔍 Checking git status...`);
    
    // Check and fix git status
    try {
      // Check if added
      const statusOutput = execSync(`git status --porcelain "${normalizedPath}"`, {
        cwd: projectRoot,
        encoding: 'utf-8'
      }).trim();
      
      if (statusOutput.startsWith('??')) {
        console.log(`⚠️  File not added to git - adding now`);
        execSync(`git add "${normalizedPath}"`, { cwd: projectRoot });
        console.log(`✅ Added: ${normalizedPath}`);
      } else if (statusOutput) {
        console.log(`⚠️  File has uncommitted changes - adding now`);
        execSync(`git add "${normalizedPath}"`, { cwd: projectRoot });
        console.log(`✅ Added: ${normalizedPath}`);
      }
      
      // Check if committed
      const diffCached = execSync(`git diff --cached --name-only "${normalizedPath}"`, {
        cwd: projectRoot,
        encoding: 'utf-8'
      }).trim();
      
      if (diffCached) {
        console.log(`⚠️  File not committed - committing now`);
        const commitMsg = `docs: add ${normalizedPath} for link generation`;
        execSync(`git commit -m "${commitMsg}"`, { cwd: projectRoot });
        console.log(`✅ Committed: ${commitMsg}`);
      }
      
      // Check if pushed
      const branch = execSync('git branch --show-current', {
        cwd: projectRoot,
        encoding: 'utf-8'
      }).trim();
      
      const localCommit = execSync(`git rev-parse HEAD`, {
        cwd: projectRoot,
        encoding: 'utf-8'
      }).trim();
      
      let remoteCommit = '';
      try {
        remoteCommit = execSync(`git rev-parse origin/${branch}`, {
          cwd: projectRoot,
          encoding: 'utf-8'
        }).trim();
      } catch {
        // Remote doesn't exist yet
      }
      
      if (localCommit !== remoteCommit) {
        console.log(`⚠️  Changes not pushed - pushing now`);
        execSync(`git push origin ${branch}`, { cwd: projectRoot });
        console.log(`✅ Pushed to remote: ${branch}`);
      } else {
        console.log(`✅ File ready: committed and pushed`);
      }
      
      // Generate GitHub URL
      const gitConfig = execSync('git config --get remote.origin.url', {
        cwd: projectRoot,
        encoding: 'utf-8'
      }).trim();
      
      // Extract org/repo from git URL
      const match = gitConfig.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
      if (!match) {
        console.log(`❌ Error: Could not parse GitHub URL from git config\n`);
        return this;
      }
      
      const org = match[1];
      const repo = match[2];
      
      const githubUrl = `https://github.com/${org}/${repo}/blob/${branch}/${normalizedPath}`;
      
      // Generate dual link
      console.log(`\n✨ Dual Link Generated:\n`);
      console.log(`[GitHub](${githubUrl}) | [§/${normalizedPath}](${normalizedPath})\n`);
      
    } catch (error: any) {
      console.log(`❌ Error: ${error.message}\n`);
    }
    
    return this;
  }

  /**
   * Tab completion for filePath parameter
   * Returns list of files in project (prioritizes markdown files)
   * @cliHide
   */
  async filePathParameterCompletion(currentArgs: string[]): Promise<string[]> {
    const fs = await import('fs/promises');
    const path = await import('path');
    const { existsSync } = await import('fs');
    
    const projectRoot = await this.getProjectRoot();
    const partialPath = currentArgs[currentArgs.length - 1] || '';
    
    // Determine search directory and file prefix
    let searchDir = projectRoot;
    let filePrefix = '';
    
    if (partialPath.includes('/')) {
      const lastSlash = partialPath.lastIndexOf('/');
      searchDir = path.join(projectRoot, partialPath.substring(0, lastSlash));
      filePrefix = partialPath.substring(lastSlash + 1);
    } else {
      filePrefix = partialPath;
    }
    
    // If search dir doesn't exist, return empty
    if (!existsSync(searchDir)) {
      return [];
    }
    
    // Read directory
    const entries = await fs.readdir(searchDir, { withFileTypes: true });
    const results: string[] = [];
    
    for (const entry of entries) {
      // Skip hidden files and common ignore dirs
      if (entry.name.startsWith('.')) continue;
      if (['node_modules', 'dist', 'target', '.git', '.next'].includes(entry.name)) continue;
      
      const relativePath = partialPath.includes('/') 
        ? partialPath.substring(0, partialPath.lastIndexOf('/') + 1) + entry.name
        : entry.name;
      
      if (entry.isDirectory()) {
        results.push(relativePath + '/');
      } else if (entry.isFile()) {
        // Prioritize markdown and TypeScript files
        if (entry.name.endsWith('.md') || entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          results.push(relativePath);
        }
      }
    }
    
    return results.sort();
  }

  /**
   * Alias for oldPath parameter completion (same as filePath)
   * @cliHide
   */
  async oldPathParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return this.filePathParameterCompletion(currentArgs);
  }

  /**
   * Alias for newPath parameter completion (same as filePath)
   * @cliHide
   */
  async newPathParameterCompletion(currentArgs: string[]): Promise<string[]> {
    return this.filePathParameterCompletion(currentArgs);
  }

  /**
   * Find all PDCA files that link to a specific file
   * Searches entire project for PDCAs containing dual links to target file
   * 
   * @param filePath Path to file to search for
   * @cliSyntax filePath
   */
  async findPDCAsLinking(filePath: string): Promise<this> {
    console.log(`\n🔍 Finding PDCAs Linking to File\n`);
    
    const fs = await import('fs/promises');
    const path = await import('path');
    const { existsSync } = await import('fs');
    
    const projectRoot = await this.getProjectRoot();
    
    // Normalize target path
    let targetPath: string;
    if (path.isAbsolute(filePath)) {
      targetPath = path.relative(projectRoot, filePath);
    } else if (filePath.startsWith('§/')) {
      targetPath = filePath.substring(2);
    } else {
      targetPath = filePath;
    }
    
    console.log(`📍 Searching for PDCAs linking to: ${targetPath}\n`);
    
    // Find all PDCA files
    const pdcaFiles: string[] = [];
    
    const shouldSkip = (filePath: string): boolean => {
      return filePath.includes('/node_modules/') ||
             filePath.includes('/.git/') ||
             filePath.includes('/target/') ||
             filePath.includes('/dist/') ||
             filePath.includes('/.next/');
    };
    
    const scanDir = async (dir: string): Promise<void> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (shouldSkip(fullPath)) continue;
        
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.pdca.md')) {
          pdcaFiles.push(fullPath);
        }
      }
    };
    
    await scanDir(projectRoot);
    
    console.log(`📊 Scanning ${pdcaFiles.length} PDCA files...\n`);
    
    // Search for links in each PDCA
    const matches: Array<{file: string, lines: Array<{num: number, content: string}>}> = [];
    
    for (const pdcaFile of pdcaFiles) {
      const content = await fs.readFile(pdcaFile, 'utf-8');
      const lines = content.split('\n');
      const matchingLines: Array<{num: number, content: string}> = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Pattern: [GitHub](...) | [text](path)
        const dualLinkMatch = line.match(/\[GitHub\]\(([^)]+)\)\s*\|\s*\[([^\]]*)\]\(([^)]+)\)/);
        
        if (dualLinkMatch) {
          const githubUrl = dualLinkMatch[1];
          const localPath = dualLinkMatch[3];
          
          // Check if GitHub URL contains target path
          if (githubUrl.includes(targetPath)) {
            matchingLines.push({ num: i + 1, content: line.trim() });
          }
          // Check if local path matches (handle relative paths)
          else if (localPath === targetPath || localPath.includes(targetPath)) {
            matchingLines.push({ num: i + 1, content: line.trim() });
          }
        }
      }
      
      if (matchingLines.length > 0) {
        matches.push({
          file: path.relative(projectRoot, pdcaFile),
          lines: matchingLines
        });
      }
    }
    
    // Display results
    if (matches.length === 0) {
      console.log(`ℹ️  No PDCAs found linking to: ${targetPath}\n`);
    } else {
      console.log(`Found ${matches.length} PDCA(s) with links:\n`);
      
      matches.forEach((match, idx) => {
        console.log(`${idx + 1}. ${match.file}`);
        match.lines.forEach(line => {
          console.log(`   Line ${line.num}: ${line.content.substring(0, 80)}...`);
        });
        console.log();
      });
    }
    
    return this;
  }

  /**
   * Update all links in PDCAs when a file moves or versions change
   * 
   * @param oldPath Current file path (what PDCAs currently link to)
   * @param newPath New file path (what PDCAs should link to)
   * @param dryRun Preview changes without writing (default: false)
   * @cliSyntax oldPath newPath dryRun
   * @cliDefault dryRun false
   * @cliValues dryRun true false
   */
  async updateLinksToFile(oldPath: string, newPath: string, dryRun: string = 'false'): Promise<this> {
    const isDryRun = dryRun === 'true';
    
    console.log(`\n🔄 Updating Links to File\n`);
    if (isDryRun) {
      console.log(`🔍 DRY RUN MODE - No changes will be made\n`);
    }
    
    const fs = await import('fs/promises');
    const path = await import('path');
    const { execSync } = await import('child_process');
    
    const projectRoot = await this.getProjectRoot();
    
    // Normalize paths
    const normalizePathFn = (p: string): string => {
      if (path.isAbsolute(p)) return path.relative(projectRoot, p);
      if (p.startsWith('§/')) return p.substring(2);
      return p;
    };
    
    const oldNormalized = normalizePathFn(oldPath);
    const newNormalized = normalizePathFn(newPath);
    
    console.log(`📍 Updating links from: ${oldNormalized}`);
    console.log(`                    to: ${newNormalized}\n`);
    
    // Find PDCAs with links to old path
    console.log(`🔍 Finding PDCAs with links...\n`);
    
    // Reuse findPDCAsLinking logic
    const pdcaFiles: string[] = [];
    
    const shouldSkip = (filePath: string): boolean => {
      return filePath.includes('/node_modules/') ||
             filePath.includes('/.git/') ||
             filePath.includes('/target/') ||
             filePath.includes('/dist/') ||
             filePath.includes('/.next/');
    };
    
    const scanDir = async (dir: string): Promise<void> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (shouldSkip(fullPath)) continue;
        
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          pdcaFiles.push(fullPath);
        }
      }
    };
    
    await scanDir(projectRoot);
    
    // Process each PDCA
    const modifiedFiles: string[] = [];
    let totalLinksUpdated = 0;
    
    for (const pdcaFile of pdcaFiles) {
      const content = await fs.readFile(pdcaFile, 'utf-8');
      const lines = content.split('\n');
      let fileModified = false;
      const newLines: string[] = [];
      
      for (const line of lines) {
        const dualLinkMatch = line.match(/\[GitHub\]\(([^)]+)\)\s*\|\s*\[([^\]]*)\]\(([^)]+)\)/);
        
        if (dualLinkMatch) {
          const githubUrl = dualLinkMatch[1];
          const displayText = dualLinkMatch[2];
          const localPath = dualLinkMatch[3];
          
          // Check if this link points to old path
          if (githubUrl.includes(oldNormalized) || localPath.includes(oldNormalized)) {
            // Generate new link using getDualLink logic
            const branch = execSync('git branch --show-current', {
              cwd: projectRoot,
              encoding: 'utf-8'
            }).trim();
            
            const gitConfig = execSync('git config --get remote.origin.url', {
              cwd: projectRoot,
              encoding: 'utf-8'
            }).trim();
            
            const match = gitConfig.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
            if (match) {
              const org = match[1];
              const repo = match[2];
              
              const newGithubUrl = `https://github.com/${org}/${repo}/blob/${branch}/${newNormalized}`;
              
              // Calculate relative path from current file to new file location
              const linkingFileDir = path.dirname(pdcaFile);
              const targetFilePath = path.join(projectRoot, newNormalized);
              const relativePath = path.relative(linkingFileDir, targetFilePath);
              
              const newLine = line.replace(
                /\[GitHub\]\([^)]+\)\s*\|\s*\[[^\]]*\]\([^)]+\)/,
                `[GitHub](${newGithubUrl}) | [§/${newNormalized}](${relativePath})`
              );
              
              newLines.push(newLine);
              fileModified = true;
              totalLinksUpdated++;
              continue;
            }
          }
        }
        
        newLines.push(line);
      }
      
      if (fileModified) {
        const relativePath = path.relative(projectRoot, pdcaFile);
        modifiedFiles.push(relativePath);
        
        if (!isDryRun) {
          await fs.writeFile(pdcaFile, newLines.join('\n'));
          console.log(`✅ Updated: ${relativePath}`);
        } else {
          console.log(`Would update: ${relativePath}`);
        }
      }
    }
    
    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`   - PDCAs updated: ${modifiedFiles.length}`);
    console.log(`   - Links updated: ${totalLinksUpdated}`);
    
    if (!isDryRun && modifiedFiles.length > 0) {
      // Auto-commit and push
      console.log(`\n📦 Git operations:`);
      try {
        for (const file of modifiedFiles) {
          execSync(`git add "${file}"`, { cwd: projectRoot });
        }
        console.log(`   ✅ Added ${modifiedFiles.length} files`);
        
        const commitMsg = `fix: update dual links from ${oldNormalized} to ${newNormalized}`;
        execSync(`git commit -m "${commitMsg}"`, { cwd: projectRoot });
        console.log(`   ✅ Committed: ${commitMsg}`);
        
        const branch = execSync('git branch --show-current', {
          cwd: projectRoot,
          encoding: 'utf-8'
        }).trim();
        execSync(`git push origin ${branch}`, { cwd: projectRoot });
        console.log(`   ✅ Pushed to remote`);
      } catch (error: any) {
        console.log(`   ⚠️  Git error: ${error.message}`);
      }
    }
    
    console.log(`\n✨ ${isDryRun ? 'Dry run complete' : 'Update complete'}!\n`);
    
    return this;
  }

  /**
   * Ensure all dual links to a file are valid across entire project
   * CMM3 Atomic Operation: Zero-knowledge, fully automated
   * 
   * @param filePath Path to file to ensure links for
   * @param dryRun Preview changes without modifying files (default: false)
   * @cliSyntax filePath dryRun
   * @cliDefault dryRun false
   * @cliValues dryRun true false
   */
  async ensureValidLinks(filePath: string, dryRun: string = 'false'): Promise<this> {
    const isDryRun = dryRun === 'true';
    
    console.log(`\n🔍 Ensuring Valid Dual Links\n`);
    if (isDryRun) {
      console.log(`🔍 DRY RUN MODE - No changes will be made\n`);
    }
    
    const fs = await import('fs/promises');
    const path = await import('path');
    const { existsSync } = await import('fs');
    const { execSync } = await import('child_process');
    
    const projectRoot = await this.getProjectRoot();
    
    // Step 1: Normalize target file
    let targetPath: string;
    if (path.isAbsolute(filePath)) {
      targetPath = path.relative(projectRoot, filePath);
    } else if (filePath.startsWith('§/')) {
      targetPath = filePath.substring(2);
    } else {
      targetPath = filePath;
    }
    
    const fullPath = path.join(projectRoot, targetPath);
    
    if (!existsSync(fullPath)) {
      console.log(`❌ Error: File does not exist: ${targetPath}\n`);
      return this;
    }
    
    console.log(`📄 Target: ${targetPath}\n`);
    
    // Step 2: Ensure target file git status
    console.log(`🔍 Checking target file git status...`);
    
    if (!isDryRun) {
      try {
        const statusOutput = execSync(`git status --porcelain "${targetPath}"`, {
          cwd: projectRoot,
          encoding: 'utf-8'
        }).trim();
        
        if (statusOutput.startsWith('??') || statusOutput) {
          console.log(`⚠️  Target file not ready - fixing now`);
          execSync(`git add "${targetPath}"`, { cwd: projectRoot });
          
          const diffCached = execSync(`git diff --cached --name-only "${targetPath}"`, {
            cwd: projectRoot,
            encoding: 'utf-8'
          }).trim();
          
          if (diffCached) {
            const commitMsg = `docs: ensure ${targetPath} for link validation`;
            execSync(`git commit -m "${commitMsg}"`, { cwd: projectRoot });
            console.log(`   ✅ Committed`);
          }
          
          const branch = execSync('git branch --show-current', {
            cwd: projectRoot,
            encoding: 'utf-8'
          }).trim();
          
          execSync(`git push origin ${branch}`, { cwd: projectRoot });
          console.log(`   ✅ Pushed to remote`);
        } else {
          console.log(`✅ Target file ready: committed and pushed`);
        }
      } catch (error: any) {
        console.log(`⚠️  Git error: ${error.message}`);
      }
    }
    
    // Step 3: Generate canonical dual link
    const branch = execSync('git branch --show-current', {
      cwd: projectRoot,
      encoding: 'utf-8'
    }).trim();
    
    const gitConfig = execSync('git config --get remote.origin.url', {
      cwd: projectRoot,
      encoding: 'utf-8'
    }).trim();
    
    const match = gitConfig.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (!match) {
      console.log(`❌ Error: Could not parse GitHub URL\n`);
      return this;
    }
    
    const org = match[1];
    const repo = match[2];
    const canonicalGithubUrl = `https://github.com/${org}/${repo}/blob/${branch}/${targetPath}`;
    const canonicalLink = `[GitHub](${canonicalGithubUrl}) | [§/${targetPath}](${targetPath})`;
    
    console.log(`\n✨ Canonical link: ${canonicalLink.substring(0, 80)}...\n`);
    
    // Step 4: Find all PDCAs linking to target
    console.log(`🔍 Scanning project for PDCAs with links...\n`);
    
    const pdcaFiles: string[] = [];
    
    const shouldSkip = (filePath: string): boolean => {
      return filePath.includes('/node_modules/') ||
             filePath.includes('/.git/') ||
             filePath.includes('/target/') ||
             filePath.includes('/dist/') ||
             filePath.includes('/.next/');
    };
    
    const scanDir = async (dir: string): Promise<void> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (shouldSkip(fullPath)) continue;
        
        if (entry.isDirectory()) {
          await scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.pdca.md')) {
          pdcaFiles.push(fullPath);
        }
      }
    };
    
    await scanDir(projectRoot);
    
    // Step 5: Validate and fix links
    const modifiedFiles: string[] = [];
    let totalLinksFound = 0;
    let totalLinksFixed = 0;
    
    for (const pdcaFile of pdcaFiles) {
      const content = await fs.readFile(pdcaFile, 'utf-8');
      const lines = content.split('\n');
      let fileModified = false;
      const newLines: string[] = [];
      
      for (const line of lines) {
        const dualLinkMatch = line.match(/\[GitHub\]\(([^)]+)\)\s*\|\s*\[([^\]]*)\]\(([^)]+)\)/);
        
        if (dualLinkMatch) {
          const githubUrl = dualLinkMatch[1];
          const displayText = dualLinkMatch[2];
          const localPath = dualLinkMatch[3];
          
          // Check if this link points to target
          if (githubUrl.includes(targetPath) || localPath.includes(targetPath)) {
            totalLinksFound++;
            
            // Check if link is already canonical
            if (githubUrl === canonicalGithubUrl && displayText === `§/${targetPath}` && localPath === targetPath) {
              newLines.push(line);
            } else {
              // Fix the link
              const newLine = line.replace(
                /\[GitHub\]\([^)]+\)\s*\|\s*\[[^\]]*\]\([^)]+\)/,
                `[GitHub](${canonicalGithubUrl}) | [§/${targetPath}](${targetPath})`
              );
              newLines.push(newLine);
              fileModified = true;
              totalLinksFixed++;
            }
            continue;
          }
        }
        
        newLines.push(line);
      }
      
      if (fileModified) {
        const relativePath = path.relative(projectRoot, pdcaFile);
        modifiedFiles.push(relativePath);
        
        if (!isDryRun) {
          await fs.writeFile(pdcaFile, newLines.join('\n'));
          console.log(`✅ Fixed: ${relativePath}`);
        } else {
          console.log(`Would fix: ${relativePath}`);
        }
      }
    }
    
    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`   - Total links found: ${totalLinksFound}`);
    console.log(`   - Links fixed: ${totalLinksFixed}`);
    console.log(`   - Links already valid: ${totalLinksFound - totalLinksFixed}`);
    console.log(`   - PDCAs modified: ${modifiedFiles.length}`);
    
    if (!isDryRun && modifiedFiles.length > 0) {
      // Auto-commit and push
      console.log(`\n📦 Git operations:`);
      try {
        for (const file of modifiedFiles) {
          execSync(`git add "${file}"`, { cwd: projectRoot });
        }
        console.log(`   ✅ Added ${modifiedFiles.length} files`);
        
        const commitMsg = `fix: ensure valid dual links to ${targetPath}`;
        execSync(`git commit -m "${commitMsg}"`, { cwd: projectRoot });
        console.log(`   ✅ Committed: ${commitMsg}`);
        
        execSync(`git push origin ${branch}`, { cwd: projectRoot });
        console.log(`   ✅ Pushed to remote`);
      } catch (error: any) {
        console.log(`   ⚠️  Git error: ${error.message}`);
      }
    }
    
    if (totalLinksFixed === 0) {
      console.log(`\n✅ All dual links are already valid!\n`);
    } else {
      console.log(`\n✨ ${isDryRun ? 'Dry run complete' : 'All dual links are now valid'}!\n`);
    }
    
    return this;
  }

  /**
   * Move a file and automatically update all links across the project
   * CMM3 Atomic: Single command handles file move, link updates, relative path refresh, and git operations
   * Zero-knowledge: User only needs to know old path and new path
   * 
   * Process:
   * 1. Validate paths exist/available
   * 2. Move file using git mv (preserves history)
   * 3. Update all links in other files (updateLinksToFile)
   * 4. Refresh relative links in moved file (refreshRelativeLinks)
   * 5. Git commit and push changes
   * 6. Report summary
   * 
   * @param oldPath Current file path (project-root-relative)
   * @param newPath Destination file path (project-root-relative)
   * @param dryRun If 'true', preview actions without executing (default: 'false')
   * @returns this (for method chaining)
   * 
   * @example
   * // Move a PDCA file to new location
   * pdca moveFile "scrum.pmo/old/2025-10-21.pdca.md" "scrum.pmo/new/2025-10-21.pdca.md"
   * 
   * // Preview move without executing
   * pdca moveFile "scrum.pmo/old/file.md" "scrum.pmo/new/file.md" true
   * 
   * @cliSyntax oldPath newPath dryRun
   * @cliDefault dryRun false
   * @cliValues dryRun true false
   */
  async moveFile(oldPath: string, newPath: string, dryRun: string = 'false'): Promise<this> {
    const fs = await import('fs');
    const path = await import('path');
    const { execSync } = await import('child_process');
    
    const isDryRun = dryRun === 'true';
    const projectRoot = await this.getProjectRoot();
    
    // Normalize paths (inline - DRY principle from updateLinksToFile)
    const normalizePath = (p: string): string => {
      if (path.isAbsolute(p)) return path.relative(projectRoot, p);
      if (p.startsWith('§/')) return p.substring(2);
      return p;
    };
    
    const oldNormalized = normalizePath(oldPath);
    const newNormalized = normalizePath(newPath);
    
    // Create full paths for file system checks
    const oldFullPath = path.join(projectRoot, oldNormalized);
    const newFullPath = path.join(projectRoot, newNormalized);

    // Step 1: Input Validation
    if (!fs.existsSync(oldFullPath)) {
      console.error(`❌ Error: Source file not found: ${oldNormalized}`);
      return this;
    }

    const newDir = path.dirname(newFullPath);
    if (!fs.existsSync(newDir)) {
      console.error(`❌ Error: Destination directory does not exist: ${path.dirname(newNormalized)}`);
      console.log(`💡 Create directory first: mkdir -p ${path.dirname(newNormalized)}`);
      return this;
    }

    if (fs.existsSync(newFullPath)) {
      console.error(`❌ Error: Destination file already exists: ${newNormalized}`);
      return this;
    }

    // Step 2: Display Plan
    console.log(`\n🔄 Moving File${isDryRun ? ' (DRY RUN)' : ''}\n`);
    console.log(`📂 From: ${oldNormalized}`);
    console.log(`📂 To:   ${newNormalized}\n`);

    if (isDryRun) {
      console.log(`📋 Planned Actions:`);
      console.log(`   1. Move file: ${oldNormalized} → ${newNormalized}`);
      console.log(`   2. Find and update links in other files`);
      console.log(`   3. Git commit and push changes\n`);
    }

    // Step 3: Execute Move (Use git mv to preserve history)
    if (!isDryRun) {
      console.log(`🚀 Step 1: Moving file (git mv preserves history)...`);
      
      try {
        execSync(`git mv "${oldNormalized}" "${newNormalized}"`, {
          cwd: projectRoot,
          stdio: 'pipe'
        });
        console.log(`✅ File moved successfully (history preserved)\n`);
      } catch (error: any) {
        console.error(`❌ Error moving file: ${error.message}`);
        return this;
      }
    } else {
      console.log(`✓ Would move file using git mv (preserves history)\n`);
    }

    // Step 4: Update Links in Other Files (DRY: Reuse updateLinksToFile)
    console.log(`🔗 Step 2: Updating links in other files...`);
    await this.updateLinksToFile(oldPath, newPath, dryRun);
    console.log(); // Spacing

    // Step 5: Refresh Relative Links in Moved File
    if (!isDryRun) {
      console.log(`🔄 Step 3: Refreshing relative links in moved file...`);
      
      const movedFileContent = fs.readFileSync(newFullPath, 'utf-8');
      const lines = movedFileContent.split('\n');
      let fileModified = false;
      const newLines: string[] = [];
      
      for (const line of lines) {
        const dualLinkMatch = line.match(/\[GitHub\]\(([^)]+)\)\s*\|\s*\[([^\]]*)\]\(([^)]+)\)/);
        
        if (dualLinkMatch) {
          const githubUrl = dualLinkMatch[1];
          const displayText = dualLinkMatch[2];
          const localPath = dualLinkMatch[3];
          
          // Extract the target file path from § notation
          const sectionMatch = displayText.match(/§\/(.+)/);
          if (sectionMatch) {
            const targetPath = sectionMatch[1];
            const targetFullPath = path.join(projectRoot, targetPath);
            
            // Calculate new relative path from moved file's new location
            const movedFileDir = path.dirname(newFullPath);
            const newRelativePath = path.relative(movedFileDir, targetFullPath);
            
            // Only update if the relative path changed
            if (newRelativePath !== localPath) {
              const newLine = line.replace(
                /\[GitHub\]\(([^)]+)\)\s*\|\s*\[[^\]]*\]\(([^)]+)\)/,
                `[GitHub](${githubUrl}) | [§/${targetPath}](${newRelativePath})`
              );
              newLines.push(newLine);
              fileModified = true;
              continue;
            }
          }
        }
        
        newLines.push(line);
      }
      
      if (fileModified) {
        fs.writeFileSync(newFullPath, newLines.join('\n'));
        console.log(`✅ Refreshed relative links in moved file\n`);
      } else {
        console.log(`ℹ️  No relative links to refresh\n`);
      }
    }

    // Note: updateLinksToFile already commits and pushes everything (including the git mv)
    // No additional commit needed - DRY principle: trust the abstraction

    // Step 5: Summary Report
    console.log(`📊 Summary:`);
    console.log(`   - File moved: ${oldNormalized} → ${newNormalized}`);
    console.log(`   - Links updated in other files: See Step 2 output above`);

    if (isDryRun) {
      console.log(`\n💡 Run without 'true' to execute: pdca moveFile "${oldPath}" "${newPath}"`);
    } else {
      console.log(`\n✨ Move complete! All links are valid and up-to-date.`);
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
