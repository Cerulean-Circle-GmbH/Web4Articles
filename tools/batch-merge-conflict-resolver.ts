#!/usr/bin/env node

/**
 * Batch Merge Conflict Resolver
 * Systematic resolution of 88 merge conflicts based on established patterns
 * Updates PDCA tracking table automatically
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ConflictResolution {
  file: string;
  priority: number;
  strategy: 'latest_timestamp' | 'preserve_42_revelation' | 'tron_escalation' | 'enhanced_content' | 'regenerate_lock';
  description: string;
}

// Resolution patterns based on completed work
const RESOLUTION_PATTERNS: ConflictResolution[] = [
  // Priority 1: Critical Framework
  {
    file: 'scrum.pmo/roles/_shared/PDCA/howto.PDCA.md',
    priority: 1,
    strategy: 'enhanced_content',
    description: 'Keep enhanced PDCA methodology content'
  },
  {
    file: 'scrum.pmo/roles/_shared/PDCA/howto.PDCA.original.md', 
    priority: 1,
    strategy: 'enhanced_content',
    description: 'Preserve original content as historical backup'
  },
  {
    file: 'components/Web4TSComponent/0.1.0.0/README.md',
    priority: 1, 
    strategy: 'enhanced_content',
    description: 'Merge component documentation improvements'
  },
  {
    file: 'components/Web4TSComponent/0.1.0.0/src/ts/layer2/DefaultWeb4TSComponent.ts',
    priority: 1,
    strategy: 'enhanced_content', 
    description: 'Apply npm scripts fix and component improvements'
  },
  {
    file: 'tools/cleanup-agent.ts',
    priority: 1,
    strategy: 'enhanced_content',
    description: 'Merge cleanup functionality enhancements'
  }
];

class BatchConflictResolver {
  private trackingFile = 'scrum.pmo/roles/PDCAQualityAgent/pdca/2025-09-27-UTC-1919.pdca.md';
  private completedFiles = 0;
  
  async resolveConflicts(): Promise<void> {
    console.log('🚀 Starting batch merge conflict resolution...');
    
    for (const pattern of RESOLUTION_PATTERNS) {
      if (await this.hasConflicts(pattern.file)) {
        console.log(`🔧 Resolving: ${pattern.file}`);
        await this.resolveFile(pattern);
        await this.updateTracking(pattern);
        this.completedFiles++;
        
        // Commit individual file resolution
        await this.commitResolution(pattern);
      } else {
        console.log(`✅ No conflicts: ${pattern.file}`);
      }
    }
    
    console.log(`🎉 Batch resolution complete: ${this.completedFiles} files processed`);
  }
  
  private async hasConflicts(filePath: string): Promise<boolean> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.includes('<<<<<<< HEAD') || content.includes('=======') || content.includes('>>>>>>> ');
    } catch (error) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
  }
  
  private async resolveFile(pattern: ConflictResolution): Promise<void> {
    const content = fs.readFileSync(pattern.file, 'utf8');
    let resolved = content;
    
    switch (pattern.strategy) {
      case 'latest_timestamp':
        resolved = this.resolveByLatestTimestamp(content);
        break;
      case 'preserve_42_revelation':
        resolved = this.preserve42Revelation(content);
        break;
      case 'tron_escalation':
        resolved = this.enhanceTronEscalation(content);
        break;
      case 'enhanced_content':
        resolved = this.selectEnhancedContent(content);
        break;
      case 'regenerate_lock':
        resolved = await this.regenerateLockFile(pattern.file);
        break;
    }
    
    fs.writeFileSync(pattern.file, resolved);
    console.log(`✅ Resolved: ${pattern.file} using ${pattern.strategy}`);
  }
  
  private resolveByLatestTimestamp(content: string): string {
    // Select content with most recent timestamp (2025-09-27 over earlier dates)
    return content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+/g, (match, head, incoming) => {
      if (head.includes('2025-09-27') && !incoming.includes('2025-09-27')) {
        return head;
      } else if (!head.includes('2025-09-27') && incoming.includes('2025-09-27')) {
        return incoming;
      }
      return head; // Default to HEAD if unclear
    });
  }
  
  private preserve42Revelation(content: string): string {
    // Always preserve 42 Revelation references
    return content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+/g, (match, head, incoming) => {
      if (head.includes('forty-two-revelation') || head.includes('42 Revelation')) {
        return head;
      } else if (incoming.includes('forty-two-revelation') || incoming.includes('42 Revelation')) {
        return incoming;
      }
      return head;
    });
  }
  
  private enhanceTronEscalation(content: string): string {
    // Prefer "To TRON: QA Decisions required" over generic versions
    return content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+/g, (match, head, incoming) => {
      if (head.includes('To TRON:')) {
        return head;
      } else if (incoming.includes('To TRON:')) {
        return incoming;
      }
      return head;
    });
  }
  
  private selectEnhancedContent(content: string): string {
    // Select content that appears more comprehensive (longer, more features)
    return content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+/g, (match, head, incoming) => {
      // Simple heuristic: choose longer content as it likely has more enhancements
      return head.length >= incoming.length ? head : incoming;
    });
  }
  
  private async regenerateLockFile(filePath: string): Promise<string> {
    // For package-lock.json files, regenerate from package.json
    const dir = path.dirname(filePath);
    try {
      execSync('npm install', { cwd: dir });
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.log(`⚠️  Could not regenerate ${filePath}, using manual resolution`);
      return this.selectEnhancedContent(fs.readFileSync(filePath, 'utf8'));
    }
  }
  
  private async updateTracking(pattern: ConflictResolution): Promise<void> {
    const trackingContent = fs.readFileSync(this.trackingFile, 'utf8');
    const fileName = path.basename(pattern.file);
    
    // Update specific file status to COMPLETED
    const updatedContent = trackingContent.replace(
      new RegExp(`(\\*\\*${fileName.replace('.', '\\.')}.*?\\|.*?\\|.*?)⏳ PENDING(.*?\\|.*?\\|.*?)`, 'g'),
      `$1✅ COMPLETED$2 - Batch resolved using ${pattern.strategy}`
    );
    
    fs.writeFileSync(this.trackingFile, updatedContent);
    console.log(`📊 Updated tracking for: ${fileName}`);
  }
  
  private async commitResolution(pattern: ConflictResolution): Promise<void> {
    const fileName = path.basename(pattern.file);
    const commitMsg = `🔧 ${fileName} merge conflicts resolved via batch process - ${pattern.description}`;
    
    try {
      execSync(`git add "${pattern.file}" "${this.trackingFile}"`);
      execSync(`git commit -m "${commitMsg}"`);
      console.log(`✅ Committed: ${fileName}`);
    } catch (error) {
      console.log(`⚠️  Commit failed for ${fileName}: ${error}`);
    }
  }
}

// Execute batch resolution
if (require.main === module) {
  const resolver = new BatchConflictResolver();
  resolver.resolveConflicts().catch(console.error);
}

export { BatchConflictResolver, ConflictResolution };
