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
    
    return quotes.join('\\n\\n');
  }

  extractQADecisions(content: string): string {
    // Enhanced feature from origin/dev/once0304 bash implementation
    const decisionMatch = content.match(/### \*\*QA Decisions\*\*([\s\S]*?)(?=### \*\*TRON|---|\n## )/);
    if (decisionMatch) {
      return decisionMatch[1]
        .replace(/\|/g, '\\|')
        .replace(/`/g, '\\`')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) + (decisionMatch[1].length > 200 ? '...' : '');
    }
    return 'No decisions';
  }

  extractAchievement(content: string, filename: string): string {
    const titleMatch = content.match(/# 📋 \*\*PDCA Cycle: ([^*]+) - ([^*]+)\*\*/);
    if (titleMatch) {
      return `${titleMatch[1]} - ${titleMatch[2]}`;
    }
    
    const baseName = basename(filename, '.pdca.md');
    const parts = baseName.split('-').slice(4);
    return parts.join(' ').replace(/([a-z])([A-Z])/g, '$1 $2');
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
      return { 
        sha: 'unknown', 
        timestamp: 'unknown', 
        message: 'No commit info', 
        utcTime: 'unknown' 
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
    
    let summary = `# 📋 **Session Summary: ${sessionName} - CMM3 Systematic PDCA Analysis**\n\n`;
    summary += `**🗓️ Generated:** ${new Date().toISOString()}\n`;
    summary += `**📁 Session Path:** ${options.sessionPath}\n`;
    summary += `**📊 PDCAs Analyzed:** ${analyses.length}\n`;
    summary += `**🎯 Template Version:** 3.1.4.2\n\n`;
    
    // Add session overview
    summary += `## **📊 Session Overview**\n\n`;
    summary += `**Session Focus:** Systematic PDCA analysis with chronological progression\n`;
    summary += `**Analysis Method:** TRON quote extraction, QA decision tracking, git integration\n`;
    summary += `**Quality Standards:** CMM3 compliance with dual links and professional formatting\n\n`;
    
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
    let table = `## **📊 CMM3 Session Analysis (PDCA Systematic Review)**\n\n`;
    table += `**Total PDCAs:** ${analyses.length} | **Analysis Method:** Chronological progression with TRON extraction\n\n`;
    
    // Generate clean, readable list format instead of broken table
    for (let i = 0; i < analyses.length; i++) {
      const analysis = analyses[i];
      const cleanPath = analysis.relativePath.replace(/^\.\.\/\.\.\/\.\.\//, '');
      const githubUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/${analysis.sha}/${cleanPath}`;
      const localPath = analysis.relativePath.includes('2025-09-20-UTC-1348-session/') 
        ? `./${analysis.filename}` 
        : analysis.relativePath;
      
      table += `### **${i + 1}. ${analysis.achievement}**\n`;
      table += `**🕐 Time:** ${analysis.utcTime} | **📋 SHA:** ${analysis.sha}\n\n`;
      
      // TRON Quotes (clean format)
      if (analysis.tronQuotes && analysis.tronQuotes.trim() && analysis.tronQuotes !== '``') {
        table += `**💬 TRON Feedback:**\n`;
        table += `\`\`\`\n${analysis.tronQuotes}\n\`\`\`\n\n`;
      }
      
      // QA Decisions (clean format)
      if (analysis.qaDecisions && analysis.qaDecisions.trim() && analysis.qaDecisions !== 'No decisions') {
        table += `**🎯 QA Decisions:**\n`;
        table += `${analysis.qaDecisions}\n\n`;
      }
      
      // Links (clean format)
      table += `**🔗 Links:** [GitHub](${githubUrl}) | [§/${cleanPath}](${localPath})\n\n`;
      table += `---\n\n`;
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