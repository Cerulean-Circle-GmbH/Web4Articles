/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { LicenseTool } from '../layer3/LicenseTool.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { LicenseToolModel } from '../layer3/LicenseToolModel.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// Use latest version for delegation (always available)
import { DefaultWeb4TSComponent } from '../../../../../Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js';

export class DefaultLicenseTool implements LicenseTool {
  private model: LicenseToolModel;
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
    const componentName = 'LicenseTool';
    const currentVersion = '0.1.0.0';
    await this.web4ts.on(componentName, currentVersion);

    return this.web4ts;
  }

  /**
   * Initialize component with scenario
   * @param scenario Scenario containing model and configuration
   * @cliHide
   */
  async init(scenario: Scenario<LicenseToolModel> | { targetPath?: string }): Promise<this> {
    if ('model' in scenario && scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    if ('targetPath' in scenario) {
      (this.model as any).targetPath = scenario.targetPath;
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<LicenseToolModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'LicenseTool',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'LicenseTool',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Check files for license header compliance
   * @param targetPath Path to check (defaults to current directory)
   * @cliSyntax targetPath
   * @cliDefault targetPath "."
   */
  async check(targetPath: string = '.'): Promise<this> {
    console.log(`\n📋 Checking license headers...\n`);
    
    const path = await import('path');
    const fs = await import('fs/promises');
    const { existsSync } = await import('fs');
    
    // Get project root
    const projectRoot = await this.getProjectRootInternal();
    
    // Verify required files exist
    await this.verifyRequiredFilesInternal(projectRoot);
    
    // Discover files
    const resolvedPath = path.isAbsolute(targetPath) ? targetPath : path.join(process.cwd(), targetPath);
    const files = await this.discoverFilesInternal(resolvedPath);
    
    console.log(`📁 Found ${files.length} files to check\n`);
    
    let validCount = 0;
    let missingCount = 0;
    let outdatedCount = 0;
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const commentStyle = await this.getCommentStyleInternal(file);
      const expectedHeader = await this.buildHeaderInternal(file, commentStyle);
      
      if (await this.hasValidHeaderInternal(content, expectedHeader)) {
        console.log(`   ✅ ${path.relative(resolvedPath, file)}`);
        validCount++;
      } else {
        // Check if there's ANY header-like content
        const hasAnyHeader = 
          (commentStyle === 'block' && content.trimStart().startsWith('/**')) ||
          (commentStyle === 'hash' && content.trimStart().startsWith('#')) ||
          (commentStyle === 'html' && content.trimStart().startsWith('<!--'));
        
        if (!hasAnyHeader) {
          console.log(`   ❌ ${path.relative(resolvedPath, file)} - missing header`);
          missingCount++;
        } else {
          console.log(`   ⚠️  ${path.relative(resolvedPath, file)} - outdated header`);
          outdatedCount++;
        }
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Valid: ${validCount}`);
    console.log(`   ❌ Missing: ${missingCount}`);
    console.log(`   ⚠️  Outdated: ${outdatedCount}`);
    
    return this;
  }

  /**
   * Apply license headers to files
   * @param targetPath Path to apply headers to (defaults to current directory)
   * @param dryRun If true, only report what would be done without modifying files
   * @cliSyntax targetPath dryRun
   * @cliDefault targetPath "."
   * @cliDefault dryRun "false"
   * @cliValues dryRun ["true", "false"]
   */
  async apply(targetPath: string = '.', dryRun: boolean | string = false): Promise<this> {
    const isDryRun = dryRun === true || dryRun === 'true';
    
    console.log(`\n${isDryRun ? '🔍 DRY RUN: ' : '✏️  '}Applying license headers...\n`);
    
    const path = await import('path');
    const fs = await import('fs/promises');
    const { existsSync } = await import('fs');
    
    // Get project root
    const projectRoot = await this.getProjectRootInternal();
    
    // Verify required files exist
    await this.verifyRequiredFilesInternal(projectRoot);
    
    // Discover files
    const resolvedPath = path.isAbsolute(targetPath) ? targetPath : path.join(process.cwd(), targetPath);
    const files = await this.discoverFilesInternal(resolvedPath);
    
    console.log(`📁 Found ${files.length} files to process\n`);
    
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const commentStyle = await this.getCommentStyleInternal(file);
      const newHeader = await this.buildHeaderInternal(file, commentStyle);
      
      if (await this.hasValidHeaderInternal(content, newHeader)) {
        skippedCount++;
        continue;
      }
      
      let newContent: string;
      
      // Check if file has ANY header comment at the start
      const hasAnyHeader = 
        (commentStyle === 'block' && content.trimStart().startsWith('/**')) ||
        (commentStyle === 'hash' && content.trimStart().startsWith('#')) ||
        (commentStyle === 'html' && content.trimStart().startsWith('<!--'));
      
      if (!hasAnyHeader) {
        // No header at all - insert
        newContent = await this.insertHeaderInternal(content, newHeader);
        console.log(`   ${isDryRun ? '📝 would add' : '✅ Added'} header: ${path.relative(resolvedPath, file)}`);
        addedCount++;
      } else {
        // Outdated header - update
        // Extract old header more carefully
        let oldHeader = '';
        
        if (commentStyle === 'block') {
          // For block comments, extract everything up to and including */
          const endMarker = content.indexOf('*/');
          if (endMarker !== -1) {
            oldHeader = content.substring(0, endMarker + 2);
          }
        } else if (commentStyle === 'hash') {
          // For hash comments, extract all leading # lines
          const lines = content.split('\n');
          let headerEndIndex = 0;
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line.startsWith('#')) {
              headerEndIndex = i;
              break;
            }
          }
          oldHeader = lines.slice(0, headerEndIndex).join('\n');
        } else if (commentStyle === 'html') {
          // For HTML comments, extract everything up to and including -->
          const endMarker = content.indexOf('-->');
          if (endMarker !== -1) {
            oldHeader = content.substring(0, endMarker + 3);
          }
        }
        
        newContent = await this.updateHeaderInternal(content, oldHeader, newHeader);
        console.log(`   ${isDryRun ? '📝 would update' : '🔄 Updated'} header: ${path.relative(resolvedPath, file)}`);
        updatedCount++;
      }
      
      if (!isDryRun) {
        await fs.writeFile(file, newContent, 'utf-8');
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Added: ${addedCount}`);
    console.log(`   🔄 Updated: ${updatedCount}`);
    console.log(`   ⏭️  Skipped (valid): ${skippedCount}`);
    
    if (isDryRun) {
      console.log(`\n🔍 DRY RUN: No files were modified`);
    }
    
    return this;
  }

  //
  // Internal Helper Methods (Web4 Naming: No underscores, Internal suffix)
  //

  /**
   * Get project root directory
   * @cliHide
   */
  private async getProjectRootInternal(): Promise<string> {
    const path = await import('path');
    const { existsSync } = await import('fs');
    
    let currentDir = process.cwd();
    
    while (currentDir !== path.dirname(currentDir)) {
      if (existsSync(path.join(currentDir, 'package.json')) &&
          existsSync(path.join(currentDir, 'components'))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    
    return process.cwd();
  }

  /**
   * Verify required license files exist at project root
   * @cliHide
   */
  private async verifyRequiredFilesInternal(projectRoot: string): Promise<void> {
    const path = await import('path');
    const { existsSync } = await import('fs');
    
    const requiredFiles = [
      { path: 'LICENSE', name: 'LICENSE (AGPLv3)' },
      { path: 'AI-GPL.md', name: 'AI-GPL.md (AI-GPL Addendum)' },
      { path: '.reuse/dep5', name: '.reuse/dep5 (REUSE metadata)' }
    ];
    
    const missing: string[] = [];
    
    for (const file of requiredFiles) {
      const fullPath = path.join(projectRoot, file.path);
      if (!existsSync(fullPath)) {
        missing.push(file.name);
      }
    }
    
    if (missing.length > 0) {
      console.warn(`⚠️  Warning: Required license files missing:`);
      missing.forEach(file => console.warn(`   - ${file}`));
      console.warn(`   Headers may contain invalid relative paths.\n`);
    }
  }

  /**
   * Discover files recursively, respecting exclusions
   * @cliHide
   */
  async discoverFilesInternal(dirPath: string): Promise<string[]> {
    const path = await import('path');
    const fs = await import('fs/promises');
    const { existsSync, lstatSync } = await import('fs');
    
    if (!existsSync(dirPath)) {
      return [];
    }
    
    const stat = lstatSync(dirPath);
    if (!stat.isDirectory()) {
      // Single file
      return await this.shouldSkipFileInternal(dirPath) ? [] : [dirPath];
    }
    
    const files: string[] = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      // For directories, check if we should skip before recursing
      if (entry.isDirectory()) {
        // Check if directory itself should be skipped
        const pathParts = fullPath.split(path.sep);
        const excludeDirs = ['node_modules', 'dist', '.git', 'coverage'];
        const shouldSkipDir = excludeDirs.some(excludeDir => pathParts.includes(excludeDir));
        
        if (shouldSkipDir) {
          continue;
        }
        
        const subFiles = await this.discoverFilesInternal(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        if (!(await this.shouldSkipFileInternal(fullPath))) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }

  /**
   * Check if file should be skipped
   * @cliHide
   */
  async shouldSkipFileInternal(filePath: string): Promise<boolean> {
    const path = await import('path');
    const { existsSync, lstatSync } = await import('fs');
    
    const basename = path.basename(filePath);
    const dirPath = path.dirname(filePath);
    
    // Check if it's a symlink (should skip)
    if (existsSync(filePath) && lstatSync(filePath).isSymbolicLink()) {
      return true;
    }
    
    // Exclusion patterns
    const excludeDirs = ['node_modules', 'dist', '.git', 'coverage'];
    const excludeExtensions = ['.bin', '.exe', '.dll', '.so', '.dylib', '.jpg', '.png', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    
    // Check if path contains excluded directories
    for (const excludeDir of excludeDirs) {
      const pathParts = filePath.split(path.sep);
      if (pathParts.includes(excludeDir)) {
        return true;
      }
    }
    
    // Check if file has excluded extension
    const ext = path.extname(filePath).toLowerCase();
    if (excludeExtensions.includes(ext)) {
      return true;
    }
    
    // Only process known text file types (exclude JSON)
    const validExtensions = ['.ts', '.js', '.py', '.sh', '.md', '.yml', '.yaml', '.tsx', '.jsx'];
    
    // Also check for compound extensions like .pdca.md
    const hasValidCompoundExt = basename.endsWith('.pdca.md') || basename.endsWith('.feature.md');
    
    if (ext && !validExtensions.includes(ext) && !hasValidCompoundExt) {
      return true;
    }
    
    // Check .gitignore (basic implementation)
    const gitignorePath = path.join(dirPath, '.gitignore');
    if (existsSync(gitignorePath)) {
      const fs = await import('fs/promises');
      const gitignore = await fs.readFile(gitignorePath, 'utf-8');
      const patterns = gitignore.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      for (const pattern of patterns) {
        if (pattern.startsWith('*') && basename.endsWith(pattern.substring(1))) {
          return true;
        }
        if (basename === pattern) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Get comment style for file based on extension
   * @cliHide
   */
  async getCommentStyleInternal(filePath: string): Promise<'block' | 'hash' | 'html'> {
    const path = await import('path');
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.ts', '.js', '.tsx', '.jsx', '.java', '.c', '.cpp', '.cs'].includes(ext)) {
      return 'block';
    }
    
    if (['.py', '.sh', '.yml', '.yaml'].includes(ext)) {
      return 'hash';
    }
    
    if (['.md', '.html', '.xml'].includes(ext)) {
      return 'html';
    }
    
    // Content-based detection for files without extension
    if (!ext) {
      try {
        const fs = await import('fs/promises');
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Enhanced detection: Check first 20 lines for shebang
        // This allows detection even when /** header was added on line 1
        const lines = content.split('\n').slice(0, 20);
        
        // Look for shebang anywhere in first 20 lines
        const hasShebang = lines.some(line => line.trim().startsWith('#!'));
        
        if (hasShebang) {
          return 'hash'; // It's a bash/python/ruby/perl script
        }
      } catch (err) {
        // If can't read file, fall through to default
      }
    }
    
    return 'block'; // Default
  }

  /**
   * Calculate relative path from one file to another
   * Intentional duplication from PDCA component
   * Reason: Component independence during bootstrap phase
   * Future: Can be refactored to shared Web4Core utility library
   * @cliHide
   */
  async calculateRelativePathInternal(fromFile: string, toFile: string): Promise<string> {
    const path = await import('path');
    const fromDir = path.dirname(fromFile);
    const relativePath = path.relative(fromDir, toFile);
    
    // If in same directory, path.relative returns just filename
    // Prefix with ./ for clarity
    if (!relativePath.startsWith('.') && !path.isAbsolute(relativePath)) {
      return `./${relativePath}`;
    }
    
    return relativePath;
  }

  /**
   * Build license header for file
   * @cliHide
   */
  async buildHeaderInternal(filePath: string, commentStyle: 'block' | 'hash' | 'html'): Promise<string> {
    const projectRoot = await this.getProjectRootInternal();
    const licensePath = await this.calculateRelativePathInternal(filePath, await import('path').then(p => p.join(projectRoot, 'LICENSE')));
    const aiGplPath = await this.calculateRelativePathInternal(filePath, await import('path').then(p => p.join(projectRoot, 'AI-GPL.md')));
    
    const currentYear = new Date().getFullYear();
    
    const lines = [
      'SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum',
      `SPDX-FileComment: See ${aiGplPath} for AI-specific terms.`,
      `Copyright (c) ${currentYear} Cerulean Circle GmbH`,
      `Copyleft: See AGPLv3 (${licensePath}) and AI-GPL Addendum (${aiGplPath})`,
      'Backlinks: /LICENSE, /AI-GPL.md'
    ];
    
    if (commentStyle === 'block') {
      return '/**\n' + lines.map(line => ` * ${line}`).join('\n') + '\n */';
    } else if (commentStyle === 'hash') {
      return lines.map(line => `# ${line}`).join('\n');
    } else if (commentStyle === 'html') {
      return '<!--\n' + lines.join('\n') + '\n-->';
    }
    
    return '';
  }

  /**
   * Check if content has valid header
   * @cliHide
   */
  async hasValidHeaderInternal(content: string, expectedHeader: string): Promise<boolean> {
    // Check if content has the expected header text
    const normalizeHeader = (header: string) => header.replace(/\s+/g, ' ').trim();
    const normalizedExpected = normalizeHeader(expectedHeader);
    const normalizedContent = normalizeHeader(content);
    
    if (!normalizedContent.includes(normalizedExpected)) {
      return false; // Header missing or wrong content
    }
    
    // Check if header is in the CORRECT FORMAT
    // Expected hash header (#) but content has block (/**) = INVALID
    if (expectedHeader.startsWith('#') && content.includes('/**')) {
      return false; // Wrong format - needs update
    }
    
    // Expected block header (/**) but content only has hash (#) = INVALID  
    if (expectedHeader.startsWith('/**') && !content.includes('/**') && content.startsWith('#!/bin/bash')) {
      return false; // Wrong format - needs update
    }
    
    return true;
  }

  /**
   * Insert header at start of file
   * @cliHide
   */
  async insertHeaderInternal(content: string, header: string): Promise<string> {
    // Extract shebang if present (must be on line 1 OR buried in content)
    let shebang = '';
    let restOfContent = content;
    
    const lines = content.split('\n');
    const shebangIdx = lines.findIndex(line => line.trim().startsWith('#!'));
    
    if (shebangIdx >= 0) {
      shebang = lines[shebangIdx] + '\n';
      lines.splice(shebangIdx, 1);
      restOfContent = lines.join('\n');
    }
    
    // Remove any existing /** block comments
    restOfContent = restOfContent.replace(/^\/\*\*[\s\S]*?\*\/\n*/gm, '');
    
    // Remove existing # SPDX headers (in case of double headers)
    restOfContent = restOfContent.replace(/^# SPDX-License-Identifier:.*$/gm, '');
    restOfContent = restOfContent.replace(/^# SPDX-FileComment:.*$/gm, '');
    restOfContent = restOfContent.replace(/^# Copyright \(c\).*$/gm, '');
    restOfContent = restOfContent.replace(/^# Copyleft:.*$/gm, '');
    restOfContent = restOfContent.replace(/^# Backlinks:.*$/gm, '');
    
    // Return: shebang + header + rest
    return shebang + `${header}\n\n${restOfContent.replace(/^\n+/, '')}`;
  }

  /**
   * Update existing header in file
   * @cliHide
   */
  async updateHeaderInternal(content: string, oldHeader: string, newHeader: string): Promise<string> {
    if (!oldHeader || oldHeader.trim() === '') {
      return await this.insertHeaderInternal(content, newHeader);
    }
    
    // Extract shebang if present
    let shebang = '';
    let restOfContent = content;
    
    const lines = content.split('\n');
    const shebangIdx = lines.findIndex(line => line.trim().startsWith('#!'));
    
    if (shebangIdx >= 0) {
      shebang = lines[shebangIdx] + '\n';
      lines.splice(shebangIdx, 1);
      restOfContent = lines.join('\n');
    }
    
    // Remove old header
    if (restOfContent.startsWith(oldHeader)) {
      restOfContent = restOfContent.substring(oldHeader.length).trimStart();
    } else {
      restOfContent = restOfContent.replace(oldHeader, '').trimStart();
    }
    
    // Remove any /** block comments
    restOfContent = restOfContent.replace(/^\/\*\*[\s\S]*?\*\/\n+/gm, '');
    
    // Return: shebang + new header + rest
    return shebang + `${newHeader}\n\n${restOfContent.trimStart()}`;
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
    
    console.log(`🧪 Running LicenseTool tests with auto-promotion...`);
    
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
      
      console.log(`✅ LicenseTool tests completed successfully`);
      
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
        await web4ts.on('LicenseTool', currentVersion);
        await web4ts.upgrade('nextBuild');
        const parts = currentVersion.split('.').map(Number);
        const devVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
        await web4ts.on('LicenseTool', devVersion);
        await web4ts.setDev();
      }
      // Stage 1: Current is dev, no test link OR test is outdated → create test version
      else if (currentVersion === semanticLinks.dev && (!semanticLinks.test || semanticLinks.test < currentVersion)) {
        console.log(`\n🧪 Stage 1: dev → test (creating test version)...`);
        await web4ts.on('LicenseTool', currentVersion);
        await web4ts.upgrade('nextBuild');
        const parts = currentVersion.split('.').map(Number);
        const testVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
        await web4ts.on('LicenseTool', testVersion);
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
            await web4ts.on('LicenseTool', currentVersion);
            await web4ts.upgrade('nextPatch');
            
            // Find the newly created prod version (highest version)
            const componentParentDir = path.dirname(path.dirname(path.dirname(componentRoot)));
            const componentsDir = path.join(componentParentDir, 'components');
            const componentDir = path.join(componentsDir, 'LicenseTool');
            const versions = readdirSync(componentDir)
              .filter(v => /^\d+\.\d+\.\d+\.\d+$/.test(v))
              .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
            const prodVersion = versions[0];  // Highest version is the new prod
            
            // Set prod symlink
            await web4ts.on('LicenseTool', prodVersion);
            await web4ts.setProd();
            console.log(`✅ Promoted to production: ${prodVersion}`);
            
            // CRITICAL: Now create new dev version (nextBuild from prod)
            console.log(`🚧 Creating new dev version...`);
            await web4ts.on('LicenseTool', prodVersion);
            await web4ts.upgrade('nextBuild');
            
            // Find the newly created dev version (highest version)
            const newVersions = readdirSync(componentDir)
              .filter(v => /^\d+\.\d+\.\d+\.\d+$/.test(v))
              .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
            const newDevVersion = newVersions[0];  // Highest version is the new dev
            await web4ts.on('LicenseTool', newDevVersion);
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
      console.error(`❌ LicenseTool tests failed`);
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
    const { LicenseToolCLI } = await import('../layer5/LicenseToolCLI.js');
    const cli = new LicenseToolCLI();
    
    if (!context) {
      // No context - test completions on LicenseTool itself
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on LicenseTool${filter ? ` (filter: ${filter})` : ''}`);
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
