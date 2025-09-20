/**
 * sessionSummary - Automated PDCA Session Analysis Tool
 * Purpose: Extract TRON quotes and generate systematic MD tables from complete sessions
 * Usage: sessionSummary <sessionPath> [outputFile]
 */

import { readFileSync, readdirSync, writeFileSync, statSync } from 'fs';
import { join, basename, relative } from 'path';
import { execSync } from 'child_process';

interface PDCAAnalysis {
  sha: string;
  filename: string;
  relativePath: string;
  tronQuotes: string;
  achievement: string;
  timestamp: string;
  commitMessage: string;
  utcTime: string;
}

export class SessionSummary {
  constructor() {}

  /**
   * Find all PDCA files in session directory
   */
  private findPDCAFiles(sessionPath: string): string[] {
    const files: string[] = [];
    
    try {
      const entries = readdirSync(sessionPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(sessionPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively search subdirectories
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

  /**
   * Extract TRON quotes from PDCA file content
   */
  private extractTRONQuotes(content: string): string {
    const quotes: string[] = [];
    
    // Match TRON Feedback sections with quotes
    const tronSectionRegex = /### \*\*TRON Feedback[^`]*```quote\n([\s\S]*?)\n```/g;
    let match;
    
    while ((match = tronSectionRegex.exec(content)) !== null) {
      quotes.push(match[1].trim());
    }
    
    return quotes.join('\\n\\n');
  }

  /**
   * Extract achievement/learning from PDCA
   */
  private extractAchievement(content: string, filename: string): string {
    // Try to extract from title
    const titleMatch = content.match(/# 📋 \*\*PDCA Cycle: ([^*]+) - ([^*]+)\*\*/);
    if (titleMatch) {
      return `${titleMatch[1]} - ${titleMatch[2]}`;
    }
    
    // Fallback to filename
    const baseName = basename(filename, '.pdca.md');
    const parts = baseName.split('-').slice(4); // Remove date/time prefix
    return parts.join(' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  /**
   * Get git SHA and commit info for file
   */
  private getGitInfo(filename: string): { sha: string; timestamp: string; message: string; utcTime: string } {
    try {
      const sha = execSync(`git log -1 --format="%h" -- "${filename}"`, 
        { encoding: 'utf8' }).trim();
      const timestamp = execSync(`git log -1 --format="%ai" -- "${filename}"`, 
        { encoding: 'utf8' }).trim();
      const message = execSync(`git log -1 --format="%s" -- "${filename}"`, 
        { encoding: 'utf8' }).trim();
      
      // Convert timestamp to UTC format YYYY-MM-DD-UTC-HHMM
      const date = new Date(timestamp);
      const utcTime = date.toISOString().slice(0, 16).replace('T', '-UTC-').replace(':', '');
      
      return { sha, timestamp, message, utcTime };
    } catch {
      // Fallback to file modification time
      const stat = statSync(filename);
      const utcTime = stat.mtime.toISOString().slice(0, 16).replace('T', '-UTC-').replace(':', '');
      return { 
        sha: 'unknown', 
        timestamp: stat.mtime.toISOString(),
        message: 'No git history',
        utcTime: utcTime
      };
    }
  }

  /**
   * Analyze single PDCA file
   */
  private async analyzePDCA(filename: string): Promise<PDCAAnalysis> {
    const content = readFileSync(filename, 'utf8');
    const gitInfo = this.getGitInfo(filename);
    const relativePath = relative(process.cwd(), filename);
    
    return {
      sha: gitInfo.sha,
      filename: filename,
      relativePath: relativePath,
      tronQuotes: this.extractTRONQuotes(content),
      achievement: this.extractAchievement(content, filename),
      timestamp: gitInfo.timestamp,
      commitMessage: gitInfo.message,
      utcTime: gitInfo.utcTime
    };
  }

  /**
   * Analyze complete session directory for PDCA files
   */
  async analyzeSession(sessionPath: string): Promise<PDCAAnalysis[]> {
    console.log(`🔍 Analyzing session: ${sessionPath}`);
    
    const pdcaFiles = this.findPDCAFiles(sessionPath);
    console.log(`📋 Found ${pdcaFiles.length} PDCA files`);
    
    const analyses: PDCAAnalysis[] = [];

    for (const file of pdcaFiles) {
      try {
        const analysis = await this.analyzePDCA(file);
        analyses.push(analysis);
        console.log(`✅ Analyzed: ${basename(file)}`);
      } catch (error) {
        console.warn(`⚠️ Failed to analyze ${file}: ${error}`);
      }
    }

    // Sort by git commit timestamp
    return analyses.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  /**
   * Generate MD table from analyses
   */
  generateTable(analyses: PDCAAnalysis[], branch: string = 'dev/req0305'): string {
    let table = `## **📊 Complete Session Analysis Table (Chronological Order with Git SHAs and UTC Times)**\n\n`;
    table += `**Note:** Table shows chronological progression with exact TRON quotes. Total PDCAs analyzed: ${analyses.length}\n\n`;
    table += `| **Git SHA** | **UTC Time** | **PDCA Source/Evidence** | **Exact TRON Quotes** | **Key Learning/Achievement** |\n`;
    table += `|-------------|--------------|--------------------------|------------------------|--------------------------|\n`;

    for (const analysis of analyses) {
      const filename = basename(analysis.relativePath);
      const githubUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/${branch}/${analysis.relativePath}`;
      const dualLink = `[GitHub](${githubUrl}) \\| [${filename}](N/A)`;
      const quotes = analysis.tronQuotes.replace(/\n/g, '\\n');
      
      table += `| **${analysis.sha}** | **${analysis.utcTime}** | ${dualLink} | \`${quotes}\` | **${analysis.achievement}** |\n`;
    }

    return table;
  }

  /**
   * Main execution method
   */
  static async start(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('Usage: sessionSummary <sessionPath> [outputFile] [branch]');
      console.log('Example: sessionSummary scrum.pmo/project.journal/2025-09-11-UTC-0007-session');
      return;
    }

    const sessionPath = args[0];
    const outputFile = args[1];
    const branch = args[2] || 'dev/req0305';
    
    console.log(`🚀 sessionSummary Tool Starting...`);
    
    const tool = new SessionSummary();
    const analyses = await tool.analyzeSession(sessionPath);
    const table = tool.generateTable(analyses, branch);
    
    console.log('\n📊 Generated Table:\n');
    console.log(table);
    
    if (outputFile) {
      writeFileSync(outputFile, table);
      console.log(`\n💾 Table written to: ${outputFile}`);
    }
    
    console.log(`\n✅ sessionSummary Complete - Analyzed ${analyses.length} PDCAs`);
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  SessionSummary.start(process.argv.slice(2)).catch(console.error);
}