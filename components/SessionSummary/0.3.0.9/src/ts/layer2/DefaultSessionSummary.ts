/**
 * DefaultSessionSummary - Web4 Component Implementation
 * Purpose: Automated PDCA session analysis with TRON extraction and decisions tracking
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join, basename, relative, dirname } from 'path';
import { execSync } from 'child_process';
import { ISessionSummary, ComponentWork } from '../layer3/SessionSummary.interface.js';
import { PDCAAnalysis, SessionAnalysisOptions, SessionSummaryResult } from '../layer3/PDCAAnalysis.interface.js';

export class DefaultSessionSummary implements ISessionSummary {
  constructor() {
    // Web4 Empty Constructor Principle
  }

  /**
   * Fix UTC naming for session directory and PDCA files
   * Zero-config auto-correction of UTC mismatches from git commits
   */
  async fixUTCNaming(sessionPath: string): Promise<void> {
    console.log(`🔧 Analyzing UTC naming for session: ${basename(sessionPath)}`);
    
    // Extract git commit UTC times from session PDCAs
    const gitCommitUTCs = await this.extractGitCommitUTCs(sessionPath);
    if (gitCommitUTCs.length === 0) {
      console.log('❌ No git commits found in session PDCAs');
      return;
    }
    
    // Use the first (earliest) commit UTC as the correct session UTC
    const correctUTC = gitCommitUTCs[0];
    const currentSessionName = basename(sessionPath);
    const correctSessionName = currentSessionName.replace(/UTC-\d{4}/, `UTC-${correctUTC.split('-UTC-')[1].split('-')[0]}`);
    
    if (currentSessionName === correctSessionName) {
      console.log('✅ Session UTC naming already correct');
      return;
    }
    
    console.log(`🔄 Renaming session: ${currentSessionName} → ${correctSessionName}`);
    
    // Rename session directory
    const parentDir = dirname(sessionPath);
    const newSessionPath = join(parentDir, correctSessionName);
    
    await this.renameSessionDirectory(sessionPath, newSessionPath);
    await this.renamePDCAFiles(newSessionPath, currentSessionName, correctSessionName);
    await this.fixAllLinks(newSessionPath, currentSessionName, correctSessionName);
    
    console.log('✅ UTC naming correction complete');
  }

  /**
   * Extract git commit UTC times from session PDCA files
   */
  private async extractGitCommitUTCs(sessionPath: string): Promise<string[]> {
    const pdcaFiles = this.findPDCAFiles(sessionPath);
    const utcTimes = new Set<string>();
    
    for (const file of pdcaFiles) {
      try {
        const content = readFileSync(file, 'utf-8');
        const analysis = this.analyzePDCA(file);
        if (analysis?.utcTime) {
          utcTimes.add(analysis.utcTime);
        }
      } catch (error) {
        continue;
      }
    }
    
    return Array.from(utcTimes).sort();
  }

  /**
   * Rename session directory safely
   */
  private async renameSessionDirectory(oldPath: string, newPath: string): Promise<void> {
    // Use imported execSync
    try {
      execSync(`git mv "${oldPath}" "${newPath}"`, { cwd: this.findProjectRoot() });
      console.log(`✅ Session directory renamed: ${basename(oldPath)} → ${basename(newPath)}`);
    } catch (error) {
      console.log(`❌ Failed to rename session directory: ${error}`);
      throw error;
    }
  }

  /**
   * Rename all PDCA files to use correct UTC
   */
  private async renamePDCAFiles(sessionPath: string, oldSessionName: string, newSessionName: string): Promise<void> {
    const pdcaDir = join(sessionPath, 'pdca');
    if (!existsSync(pdcaDir)) return;
    
    const oldUTCPart = oldSessionName.match(/UTC-\d{4}/)?.[0] || '';
    const newUTCPart = newSessionName.match(/UTC-\d{4}/)?.[0] || '';
    
    if (!oldUTCPart || !newUTCPart) return;
    
    const files = readdirSync(pdcaDir).filter(f => f.includes(oldUTCPart));
    // Use imported execSync
    
    for (const file of files) {
      const oldFile = join(pdcaDir, file);
      const newFile = join(pdcaDir, file.replace(oldUTCPart, newUTCPart));
      
      try {
        execSync(`git mv "${oldFile}" "${newFile}"`, { cwd: this.findProjectRoot() });
        console.log(`✅ PDCA renamed: ${file} → ${basename(newFile)}`);
      } catch (error) {
        console.log(`❌ Failed to rename PDCA: ${file}`);
      }
    }
  }

  /**
   * Fix all links in PDCA files to use correct UTC
   */
  private async fixAllLinks(sessionPath: string, oldSessionName: string, newSessionName: string): Promise<void> {
    const pdcaDir = join(sessionPath, 'pdca');
    if (!existsSync(pdcaDir)) return;
    
    const oldUTCPart = oldSessionName.match(/UTC-\d{4}/)?.[0] || '';
    const newUTCPart = newSessionName.match(/UTC-\d{4}/)?.[0] || '';
    
    const files = readdirSync(pdcaDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = join(pdcaDir, file);
      try {
        let content = readFileSync(filePath, 'utf-8');
        
        // Fix GitHub links
        content = content.replace(new RegExp(oldUTCPart, 'g'), newUTCPart);
        
        // Fix session title references
        content = content.replace(new RegExp(oldSessionName, 'g'), newSessionName);
        
        writeFileSync(filePath, content);
        console.log(`✅ Links fixed in: ${file}`);
      } catch (error) {
        console.log(`❌ Failed to fix links in: ${file}`);
      }
    }
  }


  private findProjectRoot(): string {
    let currentDir = process.cwd();
    while (currentDir !== '/') {
      try {
        const gitDir = join(currentDir, '.git');
        if (readdirSync(currentDir).includes('.git')) {
          return currentDir;
        }
      } catch (error) {
        // Continue searching
      }
      currentDir = join(currentDir, '..');
    }
    // Fallback to workspace if no .git found
    return '/workspace';
  }

  findPDCAFiles(sessionPath: string): string[] {
    const files: string[] = [];
    
    try {
      const entries = readdirSync(sessionPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(sessionPath, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...this.findPDCAFiles(fullPath));
        } else if (entry.name.endsWith('.pdca.md') || entry.name.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Could not read directory ${sessionPath}: ${error}`);
    }
    
    return files;
  }

  private escapeTableContent(content: string): string {
    return content
      .replace(/\|/g, '\\|')           // Escape pipe characters
      .replace(/\n/g, ' ')             // Replace newlines with spaces
      .replace(/\r/g, '')              // Remove carriage returns
      .replace(/\t/g, ' ')             // Replace tabs with spaces
      .replace(/\s+/g, ' ')            // Normalize multiple spaces
      .replace(/\*\*/g, '')            // Remove bold markdown
      .replace(/\*/g, '')              // Remove italic markdown
      .replace(/`/g, '\\`')            // Escape backticks
      .trim();                         // Remove leading/trailing whitespace
  }

  extractTRONQuotes(content: string): string {
    const quotes: string[] = [];
    
    // Pattern 1: Standard TRON Feedback with quote blocks
    const tronSectionRegex = /### \*\*TRON Feedback[^`]*```quote\n([\s\S]*?)\n```/g;
    let match;
    while ((match = tronSectionRegex.exec(content)) !== null) {
      quotes.push(match[1].trim());
    }
    
    // Pattern 2: User Quote with timestamp format: > **User Quote (timestamp)**: *"quote"*
    const userQuoteRegex = /> \*\*User Quote[^*]*\*\*: \*"([^"]+)"\*/g;
    while ((match = userQuoteRegex.exec(content)) !== null) {
      quotes.push(match[1].trim());
    }
    
    // Pattern 3: Simple User Quote format: **User Quote:** *"quote"*
    const simpleUserQuoteRegex = /\*\*User Quote:\*\* \*"([^"]+)"\*/g;
    while ((match = simpleUserQuoteRegex.exec(content)) !== null) {
      quotes.push(match[1].trim());
    }
    
    // Pattern 4: TRON QA Feedback without quote blocks
    const tronQARegex = /### \*\*TRON QA Feedback[^#]*?\n\n([^#]+?)(?=\n### |\n---|\n## |$)/g;
    while ((match = tronQARegex.exec(content)) !== null) {
      const feedbackText = match[1].trim().replace(/^\*\*[^*]+\*\*:?\s*/, '').replace(/^\*"([^"]+)"\*/, '$1');
      if (feedbackText && !feedbackText.includes('```') && feedbackText.length > 10) {
        quotes.push(feedbackText);
      }
    }
    
    // Apply table escaping to preserve table structure
    const escapedQuotes = quotes.map(quote => this.escapeTableContent(quote));
    return escapedQuotes.join(' | ');
  }

  extractQADecisions(content: string): string {
    // Enhanced feature from origin/dev/once0304 bash implementation
    const decisionMatch = content.match(/### \*\*QA Decisions\*\*([\s\S]*?)(?=### \*\*TRON|---|\n## )/);
    if (decisionMatch) {
      return this.escapeTableContent(decisionMatch[1]);
    }
    return 'No decisions';
  }

  extractAchievement(content: string, filename: string): string {
    const titleMatch = content.match(/# 📋 \*\*PDCA Cycle: ([^*]+) - ([^*]+)\*\*/);
    if (titleMatch) {
      return this.escapeTableContent(`${titleMatch[1]} - ${titleMatch[2]}`);
    }
    
    const baseName = basename(filename, '.md');
    const parts = baseName.split('-').slice(4);
    const achievement = parts.join(' ').replace(/([a-z])([A-Z])/g, '$1 $2');
    return this.escapeTableContent(achievement);
  }

  getGitInfo(filename: string): { sha: string; timestamp: string; message: string; utcTime: string } {
    try {
      const sha = execSync(`git log -1 --format="%h" -- "${filename}"`, 
        { encoding: 'utf8' }).trim();
      const timestamp = execSync(`git log -1 --format="%ai" -- "${filename}"`, 
        { encoding: 'utf8' }).trim();
      const message = execSync(`git log -1 --format="%s" -- "${filename}"`, 
        { encoding: 'utf8' }).trim();
      
      const date = new Date(timestamp);
      const utcTime = date.toISOString().slice(0, 16).replace('T', '-UTC-').replace(':', '');
      
      return { sha, timestamp, message, utcTime };
    } catch (error) {
      // Enhanced fallback for uncommitted files
      const now = new Date();
      const utcTime = now.toISOString().slice(0, 16).replace('T', '-UTC-').replace(':', '');
      return { 
        sha: 'UNCOMMITTED', 
        timestamp: now.toISOString(), 
        message: 'File not yet committed to git',
        utcTime: utcTime
      };
    }
  }

  analyzePDCA(filename: string): PDCAAnalysis | null {
    try {
      const content = readFileSync(filename, 'utf8');
      const gitInfo = this.getGitInfo(filename);
      
      return {
        sha: gitInfo.sha,
        filename: basename(filename),
        relativePath: relative(this.findProjectRoot(), filename),
        tronQuotes: this.extractTRONQuotes(content),
        qaDecisions: this.extractQADecisions(content),
        achievement: this.extractAchievement(content, filename),
        timestamp: gitInfo.timestamp,
        commitMessage: gitInfo.message,
        utcTime: gitInfo.utcTime
      };
    } catch (error) {
      console.warn(`Error analyzing ${filename}: ${error}`);
      return null;
    }
  }

  async generateSummary(options: SessionAnalysisOptions): Promise<SessionSummaryResult> {
    const files = this.findPDCAFiles(options.sessionPath);
    const analyses = files.map(file => this.analyzePDCA(file)).filter(Boolean) as PDCAAnalysis[];
    
    // Sort by UTC time
    analyses.sort((a, b) => a.utcTime.localeCompare(b.utcTime));
    
    const sessionName = basename(options.sessionPath);
    const outputPath = options.outputFile || join(options.sessionPath, 'session.summary.md');
    
    let summary = `# Session Summary: ${sessionName}\n\n`;
    summary += `**🗓️ Generated:** ${new Date().toISOString()}\n`;
    summary += `**📁 Session Path:** ${options.sessionPath}\n`;
    summary += `**📊 PDCAs Analyzed:** ${analyses.length}\n\n`;
    
    if (options.includeDecisions) {
      summary += this.generateEnhancedTable(analyses, options.branch || 'main', options.sessionPath);
    } else {
      summary += this.generateBasicTable(analyses, options.branch || 'main');
    }
    
    writeFileSync(outputPath, summary);
    
    // NEW: Trigger automated updates on session summary generation
    await this.onSessionSummaryGenerated(options.sessionPath, analyses);

    return {
      sessionName,
      totalPDCAs: analyses.length,
      analyses,
      generatedPath: outputPath,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Automated updates triggered on session summary generation
   * Updates all related documentation and tracking files
   */
  async onSessionSummaryGenerated(sessionPath: string, analyses: PDCAAnalysis[]): Promise<void> {
    console.log('🔄 Triggering automated updates...');
    
    try {
      // 1. Analyze session for component work
      const componentWork = this.analyzeComponentWork(analyses);
      
      // 2. Update coverage tracking table
      await this.updateCoverageTrackingTable(sessionPath, componentWork);
      
      // 3. Update sessions documentation  
      await this.updateSessionsDocumentation(sessionPath, componentWork);
      
      // 4. Update complete coverage analysis
      await this.updateCompleteCoverageAnalysis(sessionPath);
      
      // 5. Create/update component session links
      await this.updateComponentSessionLinks(componentWork, sessionPath);
      
      console.log('✅ Automated updates complete');
    } catch (error) {
      console.warn(`⚠️ Automated updates failed: ${error}`);
    }
  }

  /**
   * Analyze session PDCAs to identify component work
   */
  private analyzeComponentWork(analyses: PDCAAnalysis[]): ComponentWork[] {
    const componentWork: ComponentWork[] = [];
    
    for (const analysis of analyses) {
      // Extract component names from achievements and content
      const componentNames = this.extractComponentNames(analysis.achievement, analysis.filename);
      
      if (componentNames.length > 0) {
        componentWork.push({
          sessionFile: analysis.filename,
          components: componentNames,
          achievement: analysis.achievement,
          timestamp: analysis.utcTime
        });
      }
    }
    
    return componentWork;
  }

  /**
   * Extract component names from achievement text and filename
   */
  private extractComponentNames(achievement: string, filename: string): string[] {
    const components: string[] = [];
    const componentPattern = /\b(SessionSummary|Web4TSComponent|Unit|Build|ONCE|User|Web4Requirement|HttpServer|P2PServer|WsServer|TestComponent|FileUTCRename|GitScrumProject)\b/g;
    
    let match;
    while ((match = componentPattern.exec(achievement)) !== null) {
      if (!components.includes(match[1])) {
        components.push(match[1]);
      }
    }
    
    // Also check filename for component references
    while ((match = componentPattern.exec(filename)) !== null) {
      if (!components.includes(match[1])) {
        components.push(match[1]);
      }
    }
    
    return components;
  }

  /**
   * Update coverage tracking table with new session information
   */
  private async updateCoverageTrackingTable(sessionPath: string, componentWork: ComponentWork[]): Promise<void> {
    console.log(`📊 Updating coverage tracking table for ${componentWork.length} component work items`);
    
    if (componentWork.length === 0) {
      console.log(`   No component work items to add to coverage tracking`);
      return;
    }

    try {
      const projectRoot = this.findProjectRoot();
      const coverageFile = join(projectRoot, 'scrum.pmo/project.journal/component-version-session-coverage-tracking.md');
      
      if (!existsSync(coverageFile)) {
        console.warn(`   Coverage tracking file not found: ${coverageFile}`);
        return;
      }

      const content = readFileSync(coverageFile, 'utf8');
      const sessionName = basename(sessionPath);
      
      // Calculate relative path from coverage file to session summary
      const coverageFileDir = join(projectRoot, 'scrum.pmo/project.journal');
      const sessionSummaryPath = join(sessionPath, 'session.summary.md');
      const relativeToSession = relative(coverageFileDir, sessionSummaryPath);
      
      // Generate new component entries
      let newEntries = '';
      const sessionSummaryRelPath = relative(coverageFileDir, sessionSummaryPath);
      const addedComponents = new Set<string>(); // Prevent duplicates
      
      for (const work of componentWork) {
        for (const componentName of work.components) {
          // Extract version from component name if present (e.g., "Web4TSComponent 0.3.0.8")
          const versionMatch = componentName.match(/^(\S+)\s+v?([\d.]+)$/);
          const name = versionMatch ? versionMatch[1] : componentName;
          const version = versionMatch ? versionMatch[2] : '0.1.0.0';
          
          const componentKey = `${name}-${version}`;
          
          // Check if already in file or already added
          if (!addedComponents.has(componentKey) && !content.includes(`**${name}** | ${version} |`)) {
            addedComponents.add(componentKey);
            
            // Generate entry with new format (without Sessions Directory column)
            newEntries += `| **${name}** | ${version} | [${sessionName} development](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0306/${sessionSummaryRelPath}) \\| [§/${sessionSummaryRelPath}](${sessionSummaryRelPath}) | ✅ Has coverage |\n`;
          }
        }
      }
      
      // Insert new entries before the final status line
      const finalStatusPattern = /\*\*Current Status:\*\* \d+\/\d+ component versions/;
      const match = content.match(finalStatusPattern);
      
      if (match && newEntries.trim()) {
        const insertionPoint = content.indexOf(match[0]);
        const beforeInsertion = content.substring(0, insertionPoint);
        const afterInsertion = content.substring(insertionPoint);
        
        const updatedContent = beforeInsertion + newEntries + '\n' + afterInsertion;
        
        // Update component count in final status
        const currentCount = content.match(/(\d+)\/\d+ component versions/);
        if (currentCount) {
          const newCount = parseInt(currentCount[1]) + componentWork.length;
          const updatedFinalContent = updatedContent.replace(
            /\*\*Current Status:\*\* \d+\/\d+ component versions/,
            `**Current Status:** ${newCount}/${newCount} component versions`
          );
          
          writeFileSync(coverageFile, updatedFinalContent);
          console.log(`   ✅ Added ${componentWork.length} component entries to coverage tracking`);
          console.log(`   📊 Updated component count to ${newCount}`);
        }
      } else {
        console.log(`   ⚠️ Could not find insertion point in coverage tracking file`);
      }
    } catch (error) {
      console.error(`   ❌ Error updating coverage tracking table: ${error}`);
    }
  }

  /**
   * Update sessions documentation with new session information
   */
  private async updateSessionsDocumentation(sessionPath: string, componentWork: ComponentWork[]): Promise<void> {
    console.log(`📝 Updating sessions documentation for ${componentWork.length} component work items`);
    // TODO: Implement automatic sessions documentation updates
  }

  /**
   * Update complete coverage analysis with new session
   */
  private async updateCompleteCoverageAnalysis(sessionPath: string): Promise<void> {
    console.log(`📋 Updating complete coverage analysis for session: ${basename(sessionPath)}`);
    // TODO: Implement automatic coverage analysis updates
  }

  /**
   * Create/update component session links
   */
  private async updateComponentSessionLinks(componentWork: ComponentWork[], sessionPath: string): Promise<void> {
    console.log(`🔗 Updating component session links for ${componentWork.length} components`);
    // TODO: Implement automatic component session link creation
  }

  private generateEnhancedTable(analyses: PDCAAnalysis[], branch: string, sessionPath?: string): string {
    let table = `| **Git SHA** | **UTC Time** | **PDCA Source/Evidence** | **TRON Feedback** | **QA Decisions** | **Achievement** |\n`;
    table += `|-------------|--------------|--------------------------|-------------------|------------------|----------------|\n`;
    
    for (const analysis of analyses) {
      // analysis.relativePath is now relative from project root (fixed in analyzePDCA)
      const cleanPath = analysis.relativePath;
      const githubUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/${analysis.sha}/${cleanPath}`;
      
      // Generate CMM3 compliant dual links
      const displayPath = `§/${cleanPath}`;
      
      // Calculate relative path from session summary file to target file
      const projectRoot = this.findProjectRoot();
      const targetAbsolutePath = join(projectRoot, cleanPath);
      
      // Session summary file location (inside session directory)
      const sessionDir = sessionPath || process.cwd();
      const sessionSummaryFile = join(sessionDir, 'session.summary.md');
      const relativePath = relative(dirname(sessionSummaryFile), targetAbsolutePath);
      
      table += `| **${analysis.sha}** | **${analysis.utcTime}** | [GitHub](${githubUrl}) \\| [${displayPath}](${relativePath}) | ${analysis.tronQuotes} | ${analysis.qaDecisions} | ${analysis.achievement} |\n`;
    }
    
    return table;
  }

  private generateBasicTable(analyses: PDCAAnalysis[], branch: string): string {
    let table = `## TRON Quotes and Achievements\n\n`;
    table += `| UTC Time | File | SHA | TRON Quote | Achievement |\n`;
    table += `|----------|------|-----|------------|-------------|\n`;
    
    for (const analysis of analyses) {
      const tronQuote = analysis.tronQuotes.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      const achievement = analysis.achievement.replace(/\|/g, '\\|');
      table += `| ${analysis.utcTime} | ${analysis.filename} | ${analysis.sha} | ${tronQuote} | ${achievement} |\n`;
    }
    
    return table;
  }
}