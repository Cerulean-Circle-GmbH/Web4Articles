/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
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
   * Calculate relative path from document to target
   * @cliHide
   */
  private calculateRelativePath(docPath: string, targetPath: string, path: typeof import('path')): string {
    const docDir = path.dirname(docPath);
    return path.relative(docDir, targetPath);
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
            newPath = this.calculateRelativePath(mdFile, path.join(projectRoot, localPath), path);
          }
        }
        // Check if GitHub path differs from local path
        else if (githubPath && githubPath !== localPath) {
          const expectedPath = this.calculateRelativePath(mdFile, path.join(projectRoot, githubPath), path);
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
          newPath = this.calculateRelativePath(mdFile, path.join(projectRoot, trimmedPath), path);
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
   * 
   * @param topic Training topic identifier (e.g., "how-to-start", "how-to-pdca", "how-to-cmm", "how-to-component")
   * @param options Optional training configuration
   * @cliSyntax topic
   * @cliValues topic how-to-start how-to-pdca how-to-cmm how-to-component
   */
  async trainAI(topic: string): Promise<this> {
    console.log(`\n🎓 AI Training Module - CMM3 Reproducible Learning\n`);
    console.log(`📚 Topic: ${topic}\n`);

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
          '⚠️ Read to depth 3: document → references → secondary references'
        ],
        verificationChecklist: [
          'Can recite the 12 startup steps from README.md',
          'Understands CMM1-CMM4 progression and why CMM4 is feedback loop mastery',
          'Can create agent identity file in correct location',
          'Can create session-start PDCA with correct filename format',
          'Knows to use web4tscomponent for ALL version operations'
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
          '⚠️ CMM badges track compliance status throughout PDCA lifecycle'
        ],
        verificationChecklist: [
          'Can create PDCA with correct filename format',
          'Includes all sections: Links, Plan (with TRON), Do, Check, Act, Meta',
          'Uses dual links (backward + forward placeholders)',
          'DRY: references documents instead of copying content',
          'Includes philosophical insight line at end'
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
          '⚠️ NEVER manually copy component versions - violates CMM3'
        ],
        verificationChecklist: [
          'Can create new component version using web4tscomponent',
          'Understands semantic version promotion types',
          'Knows component directory structure and symlink purposes',
          'Can build component using: web4tscomponent on <Component> <version> build',
          'Recognizes when to use nextPatch vs nextMinor vs nextMajor'
        ]
      }
    };

    const training = trainingTopics[topic];
    
    if (!training) {
      console.error(`❌ Unknown training topic: ${topic}`);
      console.log(`\n📚 Available topics:`);
      Object.keys(trainingTopics).forEach(key => {
        console.log(`   - ${key}: ${trainingTopics[key].title}`);
      });
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
