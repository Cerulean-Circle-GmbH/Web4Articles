/**
 * DefaultWODAAnalyzer - WODA Analyzer Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 * Purpose: Analyzes Git branches and generates consistent WODA format documentation
 */

import { WODAAnalyzer } from '../layer3/WODAAnalyzer.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { WODAAnalyzerModel } from '../layer3/WODAAnalyzerModel.interface.js';
import { BranchAnalysis } from '../layer3/BranchAnalysis.interface.js';
import { randomUUID } from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export class DefaultWODAAnalyzer implements WODAAnalyzer {
  private model: WODAAnalyzerModel;

  /**
   * Empty constructor (Web4 pattern)
   * All initialization happens in init() via scenario
   */
  constructor() {
    this.model = {
      uuid: randomUUID(),
      name: '',
      origin: '',
      definition: '',
      component: 'WODAAnalyzer',
      version: this.getVersionFromDirectory(),
      projectRoot: process.cwd(),
      gitRemote: 'origin',
      targetBranch: 'origin/release/dev',
      outputPath: 'scrum.pmo/roles/PDCAQualityAgent/pdca/woda-analysis.md',
      maxBranches: 1000,
      priorityThresholds: {
        critical: 1,   // Branch #1
        high: 9,       // Branches #1-9
        medium: 24     // Branches #1-24
      }
    };
  }

  /**
   * Get version from directory name (Web4 pattern - single source of truth)
   * @cliHide
   */
  private getVersionFromDirectory(): string {
    const currentFileUrl = new URL(import.meta.url);
    const currentVersionDir = path.resolve(path.dirname(currentFileUrl.pathname), '..', '..', '..');
    const componentDirName = path.basename(currentVersionDir);
    const isVersionDir = /^\d+\.\d+\.\d+\.\d+$/.test(componentDirName);
    return isVersionDir ? componentDirName : '0.0.0';
  }

  /**
   * Initialize component with scenario data (Web4 pattern)
   * @param scenario Scenario containing component model and context
   * @returns this component instance for method chaining
   * @cliHide
   */
  init(scenario: Scenario<WODAAnalyzerModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * Transform data (Web4 standard method)
   * @cliHide
   */
  transform(data?: unknown): this {
    // Transform implementation if needed
    return this;
  }

  /**
   * Validate object (Web4 standard method)
   * @cliHide
   */
  validate(object?: any): this {
    // Validation implementation if needed
    return this;
  }

  /**
   * Process - main execution (Web4 standard method)
   * Orchestrates the full WODA analysis workflow
   * @returns this component instance
   */
  async process(): Promise<this> {
    console.log('🚀 WODAAnalyzer: Starting branch analysis...\n');
    
    const analyses = await this.analyzeBranches();
    console.log(`✅ Analyzed ${analyses.length} branches\n`);
    
    console.log('📝 Generating WODA document...');
    const document = await this.generateWODADocument(analyses);
    
    console.log('💾 Writing document...');
    await this.writeDocument(document);
    
    console.log(`\n🎉 Complete! Document written to: ${this.model.outputPath}`);
    console.log(`📊 Total branches: ${analyses.length}`);
    
    return this;
  }

  /**
   * Analyze all loose end branches
   * @returns Array of branch analyses
   */
  async analyzeBranches(): Promise<BranchAnalysis[]> {
    const looseEndBranches = await this.getLooseEndBranches();
    console.log(`📊 Found ${looseEndBranches.length} loose end branches`);
    
    const analyses: BranchAnalysis[] = [];
    
    for (let i = 0; i < looseEndBranches.length && i < this.model.maxBranches; i++) {
      const branch = looseEndBranches[i];
      const analysis = await this.analyzeBranch(branch, i + 1);
      analyses.push(analysis);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   Progress: ${i + 1}/${looseEndBranches.length} branches`);
      }
    }
    
    return analyses;
  }

  /**
   * Get all branches that are loose ends (not in release/dev or dev/0400)
   * @cliHide
   */
  private async getLooseEndBranches(): Promise<{name: string; sha: string; date: string; message: string}[]> {
    // Get all remote branches
    const { stdout } = await execAsync(
      'git branch -r | grep -v HEAD | sed "s/^[[:space:]]*//" | sort',
      { cwd: this.model.projectRoot }
    );
    
    const branches = stdout.trim().split('\n').filter(b => b);
    const looseEnds: {name: string; sha: string; date: string; message: string}[] = [];
    
    for (const branch of branches) {
      if (branch === this.model.targetBranch) continue;
      
      // Check if this branch is already merged
      const isInRelease = await this.isAncestor(branch, this.model.targetBranch);
      const isInDev0400 = await this.isAncestor(branch, 'origin/dev/0400');
      
      if (isInRelease || isInDev0400) continue;
      
      // Get branch metadata
      const { stdout: logData } = await execAsync(
        `git log -1 --format="%H|%h|%ci|%s" ${branch} 2>/dev/null`,
        { cwd: this.model.projectRoot }
      );
      
      const [fullSha, shortSha, date, ...messageParts] = logData.trim().split('|');
      const message = messageParts.join('|');
      
      looseEnds.push({
        name: branch,
        sha: shortSha,
        date: date.split(' ')[0],
        message
      });
    }
    
    return looseEnds;
  }

  /**
   * Check if one branch is an ancestor of another
   * @cliHide
   */
  private async isAncestor(branch: string, target: string): Promise<boolean> {
    try {
      await execAsync(
        `git merge-base --is-ancestor ${branch} ${target} 2>/dev/null`,
        { cwd: this.model.projectRoot }
      );
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Analyze a single branch
   * @cliHide
   */
  private async analyzeBranch(
    branch: {name: string; sha: string; date: string; message: string},
    number: number
  ): Promise<BranchAnalysis> {
    // Determine priority
    let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (number <= this.model.priorityThresholds.critical) {
      priority = 'CRITICAL';
    } else if (number <= this.model.priorityThresholds.high) {
      priority = 'HIGH';
    } else if (number <= this.model.priorityThresholds.medium) {
      priority = 'MEDIUM';
    }
    
    // Calculate age
    const branchDate = new Date(branch.date);
    const now = new Date();
    const ageInDays = Math.floor((now.getTime() - branchDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get statistics (with error handling)
    const commitsAhead = await this.getCommitsAhead(branch.name);
    const pdcaFiles = await this.countFiles(branch.name, 'pdca');
    const componentFiles = await this.countFiles(branch.name, 'components/');
    const testFiles = await this.countFiles(branch.name, 'test|spec');
    
    // Generate GitHub link
    const cleanBranch = branch.name.replace('origin/', '');
    const githubLink = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/${cleanBranch}`;
    
    return {
      number,
      name: branch.name,
      shortSha: branch.sha,
      date: branch.date,
      message: branch.message,
      age: `${ageInDays} days old`,
      priority,
      githubLink,
      commitsAhead,
      pdcaFiles,
      componentFiles,
      testFiles,
      what: branch.message,
      overview: [
        `**Last Commit:** "${branch.message}"`,
        `**Age:** ${ageInDays} days old`,
        `**Priority:** ${priority}`,
        `**Size:** ${commitsAhead} commits ahead`,
        `**Content:** ${pdcaFiles} PDCA files, ${componentFiles} component files, ${testFiles} test files`
      ],
      details: this.generateDetails(commitsAhead, pdcaFiles, componentFiles, testFiles),
      action: this.generateAction(priority)
    };
  }

  /**
   * Get number of commits ahead of target branch
   * @cliHide
   */
  private async getCommitsAhead(branch: string): Promise<number> {
    try {
      const { stdout } = await execAsync(
        `git log --oneline ${this.model.targetBranch}..${branch} 2>/dev/null | wc -l`,
        { cwd: this.model.projectRoot }
      );
      return parseInt(stdout.trim()) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Count files matching a pattern
   * @cliHide
   */
  private async countFiles(branch: string, pattern: string): Promise<number> {
    try {
      const { stdout } = await execAsync(
        `git diff --name-only ${this.model.targetBranch}...${branch} 2>/dev/null | grep -iE "${pattern}" | wc -l`,
        { cwd: this.model.projectRoot }
      );
      return parseInt(stdout.trim()) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Generate Details section content
   * @cliHide
   */
  private generateDetails(commits: number, pdca: number, components: number, tests: number): string {
    return `**Branch Analysis:**
- Commits: ${commits}
- PDCA Files: ${pdca}
- Component Files: ${components}
- Test Files: ${tests}

**Why This Matters:**
Analysis based on commit history, file counts, and branch characteristics. Ready for detailed review.`;
  }

  /**
   * Generate Action section content
   * @cliHide
   */
  private generateAction(priority: string): string {
    let recommendation = '';
    let reasoning = '';
    
    switch (priority) {
      case 'CRITICAL':
        recommendation = 'IMMEDIATE REVIEW REQUIRED';
        reasoning = 'Critical priority requires immediate decision before proceeding with other branches.';
        break;
      case 'HIGH':
        recommendation = 'Review soon - potentially valuable recent work';
        reasoning = 'High priority suggests recent development with potential value to extract or merge.';
        break;
      case 'MEDIUM':
        recommendation = 'Review when time permits';
        reasoning = 'Medium priority - review after critical and high priority branches.';
        break;
      default:
        recommendation = 'Archive or mark historical';
        reasoning = 'Low priority - likely historical or superseded by more recent work.';
    }
    
    return `**💡 My Recommendation:** **${recommendation}**

**Reasoning:**
- ${reasoning}

**❓ Questions for You:**
1. Should this branch be merged, archived, or marked historical?
2. Any specific content to extract before archiving?
3. Does this conflict with current work in dev/0400?`;
  }

  /**
   * Generate complete WODA document from analyses
   * @param analyses Array of branch analyses
   * @returns Complete markdown document
   */
  async generateWODADocument(analyses: BranchAnalysis[]): Promise<string> {
    const timestamp = new Date().toISOString().split('T')[0];
    const priorityCounts = this.getPriorityCounts(analyses);
    
    let document = `# 🎯 COMPLETE Loose Ends Analysis - All ${analyses.length} Branches (WODA Format)

**Generated:** ${timestamp} (Automated via WODAAnalyzer Component)
**Format:** WODA (What, Overview, Details, Action)  
**Scope:** ALL ${analyses.length} loose end branches  
**Purpose:** Enable TRON to make informed decisions on every loose end
**Component:** WODAAnalyzer v${this.model.version}

---

## **📊 Executive Summary**

**Total Branches Analyzed:** ${analyses.length}  
**Analysis Complete:** ✅ All branches with consistent WODA format  
**Generator:** WODAAnalyzer (Web4TSComponent)

### **Distribution**
- 🔴 **CRITICAL:** ${priorityCounts.CRITICAL} branch(es) - MUST DECIDE
- 🟡 **HIGH:** ${priorityCounts.HIGH} branch(es) - Should review soon  
- 🟢 **MEDIUM:** ${priorityCounts.MEDIUM} branch(es) - Review when time permits
- ⚪ **LOW:** ${priorityCounts.LOW} branch(es) - Archive or mark historical

---

`;
    
    // Generate WODA for each branch
    for (const analysis of analyses) {
      document += this.generateWODASection(analysis);
    }
    
    return document;
  }

  /**
   * Get count of branches by priority
   * @cliHide
   */
  private getPriorityCounts(analyses: BranchAnalysis[]): Record<string, number> {
    return analyses.reduce((counts, a) => {
      counts[a.priority] = (counts[a.priority] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }

  /**
   * Generate WODA section for a single branch
   * @cliHide
   */
  private generateWODASection(analysis: BranchAnalysis): string {
    const priorityIcon = {
      CRITICAL: '🔴',
      HIGH: '🟡',
      MEDIUM: '🟢',
      LOW: '⚪'
    }[analysis.priority];
    
    return `## **#${analysis.number}. ${analysis.name}** ${priorityIcon}

[\`📂 Browse Branch\`](${analysis.githubLink}) | Commit: \`${analysis.shortSha}\` | Date: ${analysis.date}

### **What**
${analysis.what}

### **Overview**
${analysis.overview.map(line => `- ${line}`).join('\n')}

### **Details**
${analysis.details}

### **Action**
${analysis.action}

---

`;
  }

  /**
   * Write document to file
   * @param content Document content
   */
  async writeDocument(content: string): Promise<void> {
    const fullPath = path.join(this.model.projectRoot, this.model.outputPath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    // Write file
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  /**
   * Set project root directory
   * @param root Path to project root
   */
  setProjectRoot(root: string): void {
    this.model.projectRoot = root;
  }

  /**
   * Set output file path
   * @param outputPath Relative path from project root
   */
  setOutputPath(outputPath: string): void {
    this.model.outputPath = outputPath;
  }
}

