#!/usr/bin/env node --loader ts-node/esm
/**
 * Automated Cleanup Agent for EOD Structural Compliance
 * Runs daily to ensure project structure follows standards
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface CleanupConfig {
  rules: {
    sprintFolder: string[];
    pdcaLocation: string;
    articleLocation: string;
  };
  exceptions: string[];
}

interface Violation {
  type: 'misplaced-pdca' | 'misplaced-article' | 'broken-link' | 'naming-violation';
  file: string;
  message: string;
  suggestedFix?: string;
}

interface CleanupReport {
  timestamp: string;
  movedFiles: Array<{ from: string; to: string }>;
  fixedLinks: Array<{ file: string; oldLink: string; newLink: string }>;
  violations: Violation[];
  summary: string;
}

class StructureCleanupAgent {
  private config: CleanupConfig;
  private report: CleanupReport;
  private dryRun: boolean;

  constructor(dryRun = false) {
    this.dryRun = dryRun;
    this.config = this.loadConfig();
    this.report = {
      timestamp: new Date().toISOString(),
      movedFiles: [],
      fixedLinks: [],
      violations: [],
      summary: ''
    };
  }

  private loadConfig(): CleanupConfig {
    const configPath = path.join(process.cwd(), '.cleanup-config.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
    
    // Default config
    return {
      rules: {
        sprintFolder: ['planning.md', 'requirements.md', 'tasks/'],
        pdcaLocation: 'scrum.pmo/project.journal/{session}/pdca/role/{role}/',
        articleLocation: 'articles/{platform}/{series}/'
      },
      exceptions: [
        'scrum.pmo/sprints/sprint-0/**',
        '*.tmp.md',
        '*.draft.md'
      ]
    };
  }

  async run(): Promise<CleanupReport> {
    console.log('🧹 Starting EOD Cleanup Agent...');
    console.log(`Mode: ${this.dryRun ? 'DRY RUN' : 'LIVE'}`);
    
    await this.validateSprintFolders();
    await this.migratePDCAs();
    await this.organizeArticles();
    await this.fixBrokenLinks();
    
    this.generateSummary();
    this.saveReport();
    
    return this.report;
  }

  private async validateSprintFolders(): Promise<void> {
    console.log('\n📁 Validating sprint folder structures...');
    
    const sprintFolders = glob.sync('scrum.pmo/sprints/sprint-*');
    
    for (const sprintFolder of sprintFolders) {
      if (this.isException(sprintFolder)) continue;
      
      const files = fs.readdirSync(sprintFolder);
      
      for (const file of files) {
        const filePath = path.join(sprintFolder, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile()) {
          // Check if file belongs in sprint folder
          if (!this.isAllowedInSprint(file)) {
            if (file.endsWith('.pdca.md') || file.includes('-UTC-')) {
              this.report.violations.push({
                type: 'misplaced-pdca',
                file: filePath,
                message: 'PDCA file found in sprint folder',
                suggestedFix: 'Move to project journal session'
              });
            } else if (file.match(/article|post|blog/i) && file.endsWith('.md')) {
              this.report.violations.push({
                type: 'misplaced-article',
                file: filePath,
                message: 'Article found in sprint folder',
                suggestedFix: 'Move to articles directory'
              });
            }
          }
        }
      }
    }
  }

  private async migratePDCAs(): Promise<void> {
    console.log('\n📋 Migrating misplaced PDCAs...');
    
    const misplacedPDCAs = this.report.violations.filter(v => v.type === 'misplaced-pdca');
    
    for (const violation of misplacedPDCAs) {
      // Detect session from file content or path
      const content = fs.readFileSync(violation.file, 'utf-8');
      const sessionMatch = content.match(/Session:\s*([\d-]+)/);
      const roleMatch = content.match(/Role:\s*(\w+)/);
      
      if (sessionMatch && roleMatch) {
        const session = sessionMatch[1];
        const role = roleMatch[1].toLowerCase();
        const fileName = path.basename(violation.file);
        const targetDir = `scrum.pmo/project.journal/${session}/pdca/role/${role}`;
        const targetPath = path.join(targetDir, fileName);
        
        if (!this.dryRun) {
          fs.mkdirSync(targetDir, { recursive: true });
          execSync(`git mv "${violation.file}" "${targetPath}"`);
        }
        
        this.report.movedFiles.push({
          from: violation.file,
          to: targetPath
        });
        
        console.log(`  ✓ Moved: ${violation.file} → ${targetPath}`);
      }
    }
  }

  private async organizeArticles(): Promise<void> {
    console.log('\n📝 Organizing misplaced articles...');
    
    const misplacedArticles = this.report.violations.filter(v => v.type === 'misplaced-article');
    
    for (const violation of misplacedArticles) {
      const content = fs.readFileSync(violation.file, 'utf-8');
      const fileName = path.basename(violation.file);
      
      // Detect platform and series from content or filename
      let platform = 'medium.com';  // default
      let series = 'general';
      
      if (violation.file.includes('sprint-12')) {
        series = 'sprint-12-series';
      }
      
      const targetDir = `articles/${platform}/${series}`;
      const targetPath = path.join(targetDir, fileName);
      
      if (!this.dryRun) {
        fs.mkdirSync(targetDir, { recursive: true });
        execSync(`git mv "${violation.file}" "${targetPath}"`);
      }
      
      this.report.movedFiles.push({
        from: violation.file,
        to: targetPath
      });
      
      console.log(`  ✓ Moved: ${violation.file} → ${targetPath}`);
    }
  }

  private async fixBrokenLinks(): Promise<void> {
    console.log('\n🔗 Fixing broken links...');
    
    // Find all markdown files
    const mdFiles = glob.sync('**/*.md', {
      ignore: ['node_modules/**', '.git/**']
    });
    
    for (const file of mdFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      let updatedContent = content;
      
      // Update links based on moved files
      for (const move of this.report.movedFiles) {
        const oldLink = move.from.replace(/\\/g, '/');
        const newLink = move.to.replace(/\\/g, '/');
        
        // Update various link formats
        const patterns = [
          new RegExp(`\\]\\(.*${oldLink}\\)`, 'g'),
          new RegExp(`\\[.*\\]\\(${oldLink}\\)`, 'g'),
          new RegExp(`${oldLink}`, 'g')
        ];
        
        for (const pattern of patterns) {
          if (pattern.test(updatedContent)) {
            updatedContent = updatedContent.replace(pattern, (match) => {
              return match.replace(oldLink, newLink);
            });
            
            this.report.fixedLinks.push({
              file,
              oldLink,
              newLink
            });
          }
        }
      }
      
      if (updatedContent !== content && !this.dryRun) {
        fs.writeFileSync(file, updatedContent);
        console.log(`  ✓ Updated links in: ${file}`);
      }
    }
  }

  private isAllowedInSprint(filename: string): boolean {
    // Check against allowed files in sprint folders
    const allowed = [
      'planning.md',
      'requirements.md',
      'README.md',
      /^task-\d+.*\.md$/
    ];
    
    return allowed.some(pattern => {
      if (typeof pattern === 'string') {
        return filename === pattern;
      }
      return pattern.test(filename);
    });
  }

  private isException(path: string): boolean {
    return this.config.exceptions.some(pattern => {
      return path.includes(pattern.replace('/**', '').replace('*', ''));
    });
  }

  private generateSummary(): void {
    const summary = `
EOD Cleanup Report - ${new Date().toISOString()}
================================================

Files Moved: ${this.report.movedFiles.length}
Links Fixed: ${this.report.fixedLinks.length}
Violations Found: ${this.report.violations.length}

${this.report.violations.length > 0 ? 'Violations requiring manual review:' : 'All clear! 🎉'}
${this.report.violations.map(v => `- ${v.file}: ${v.message}`).join('\n')}
`;
    
    this.report.summary = summary;
    console.log(summary);
  }

  private saveReport(): void {
    const reportPath = `cleanup-reports/report-${Date.now()}.json`;
    
    if (!this.dryRun) {
      fs.mkdirSync('cleanup-reports', { recursive: true });
      fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
      console.log(`\n📊 Report saved to: ${reportPath}`);
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  const agent = new StructureCleanupAgent(dryRun);
  agent.run()
    .then(report => {
      if (report.violations.length > 0 && !dryRun) {
        console.log('\n⚠️  Some violations require manual review');
        process.exit(1);
      }
      console.log('\n✅ Cleanup completed successfully');
    })
    .catch(error => {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    });
}

export { StructureCleanupAgent, CleanupReport, Violation };