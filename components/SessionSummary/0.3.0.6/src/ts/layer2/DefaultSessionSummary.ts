/**
 * DefaultSessionSummary - Web4 Component Implementation
 * Purpose: Automated PDCA session analysis with TRON extraction and decisions tracking
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, basename, relative } from 'path';
import { execSync } from 'child_process';
import { ISessionSummary } from '../layer3/SessionSummary.interface.js';
import { PDCAAnalysis, SessionAnalysisOptions, SessionSummaryResult } from '../layer3/PDCAAnalysis.interface.js';

export class DefaultSessionSummary implements ISessionSummary {
  constructor() {
    // Web4 Empty Constructor Principle
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
        relativePath: relative(process.cwd(), filename),
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

  generateSummary(options: SessionAnalysisOptions): SessionSummaryResult {
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
      summary += this.generateEnhancedTable(analyses, options.branch || 'main');
    } else {
      summary += this.generateBasicTable(analyses, options.branch || 'main');
    }
    
    writeFileSync(outputPath, summary);
    
    return {
      sessionName,
      totalPDCAs: analyses.length,
      analyses,
      generatedPath: outputPath,
      timestamp: new Date().toISOString()
    };
  }

  private generateEnhancedTable(analyses: PDCAAnalysis[], branch: string): string {
    let table = `| **Git SHA** | **UTC Time** | **PDCA Source/Evidence** | **TRON Feedback** | **QA Decisions** | **Achievement** |\n`;
    table += `|-------------|--------------|--------------------------|-------------------|------------------|----------------|\n`;
    
    for (const analysis of analyses) {
      const cleanPath = analysis.relativePath.replace(/^\.\.\/\.\.\/\.\.\//, '');
      const githubUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/${analysis.sha}/${cleanPath}`;
      const localPath = analysis.relativePath;
      
      table += `| **${analysis.sha}** | **${analysis.utcTime}** | [GitHub](${githubUrl}) \\| [§/${localPath}](${localPath}) | ${analysis.tronQuotes} | ${analysis.qaDecisions} | ${analysis.achievement} |\n`;
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