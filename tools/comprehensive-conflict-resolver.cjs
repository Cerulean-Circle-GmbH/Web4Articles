#!/usr/bin/env node

/**
 * Comprehensive Merge Conflict Resolver
 * Processes ALL remaining merge conflicts in repository
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ComprehensiveConflictResolver {
  constructor() {
    this.trackingFile = path.resolve('scrum.pmo/roles/PDCAQualityAgent/pdca/2025-09-27-UTC-1919.pdca.md');
    this.completedFiles = 0;
    this.processedFiles = [];
  }
  
  async resolveAllConflicts() {
    console.log('🚀 Starting comprehensive merge conflict resolution...');
    
    // Get all files with merge conflicts
    const conflictFiles = this.findAllConflictFiles();
    console.log(`📊 Found ${conflictFiles.length} files with merge conflicts:`);
    conflictFiles.forEach(file => console.log(`  - ${file}`));
    
    for (const file of conflictFiles) {
      console.log(`\n🔧 Processing: ${file}`);
      try {
        const strategy = this.determineStrategy(file);
        console.log(`📋 Strategy: ${strategy}`);
        
        await this.resolveFile(file, strategy);
        this.processedFiles.push({ file, strategy, success: true });
        this.completedFiles++;
        
        // Commit individual file
        try {
          execSync(`git add "${file}"`);
          execSync(`git commit -m "🔧 ${path.basename(file)} conflicts resolved via ${strategy}"`);
          console.log(`✅ Committed: ${path.basename(file)}`);
        } catch (commitError) {
          console.log(`⚠️ Commit skipped for ${file} (no changes or already committed)`);
        }
        
      } catch (error) {
        console.log(`❌ Failed to resolve ${file}: ${error.message}`);
        this.processedFiles.push({ file, strategy: 'failed', success: false });
      }
    }
    
    console.log(`\n🎉 Comprehensive resolution complete!`);
    console.log(`✅ Successfully processed: ${this.completedFiles} files`);
    console.log(`❌ Failed: ${conflictFiles.length - this.completedFiles} files`);
    
    // Update tracking
    await this.updateFinalTracking();
    
    return this.processedFiles;
  }
  
  findAllConflictFiles() {
    const conflictFiles = [];
    
    // Scan entire repository for conflict markers
    this.scanDirectory('.', conflictFiles);
    
    // Remove duplicates and system files
    return [...new Set(conflictFiles)]
      .filter(file => !file.includes('node_modules/'))
      .filter(file => !file.includes('.git/'))
      .filter(file => !file.startsWith('./tools/batch-merge-conflict-resolver'))
      .sort();
  }
  
  scanDirectory(dir, conflictFiles) {
    try {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        if (item.startsWith('.') && item !== '.') continue;
        if (item === 'node_modules') continue;
        
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.scanDirectory(fullPath, conflictFiles);
        } else if (this.shouldCheckFile(item)) {
          if (this.hasConflictMarkers(fullPath)) {
            conflictFiles.push(fullPath.replace(/^\.\//, ''));
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  shouldCheckFile(filename) {
    const extensions = ['.md', '.ts', '.js', '.json', '.txt', '.yml', '.yaml'];
    return extensions.some(ext => filename.endsWith(ext));
  }
  
  hasConflictMarkers(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.includes('<<<<<<< HEAD') || 
             content.includes('=======') || 
             content.includes('>>>>>>> ');
    } catch (error) {
      return false;
    }
  }
  
  determineStrategy(file) {
    // Strategy based on file type and content
    if (file.includes('forty-two-revelation') || file.includes('42')) {
      return 'preserve_42_revelation';
    }
    if (file.includes('package-lock.json')) {
      return 'regenerate_lock';
    }
    if (file.includes('template') || file.includes('PDCA')) {
      return 'tron_escalation';
    }
    if (file.includes('2025-09-27')) {
      return 'latest_timestamp';
    }
    return 'enhanced_content';
  }
  
  async resolveFile(filePath, strategy) {
    const content = fs.readFileSync(filePath, 'utf8');
    let resolved;
    
    switch (strategy) {
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
        resolved = await this.regenerateLockFile(filePath);
        break;
      default:
        resolved = this.selectEnhancedContent(content);
    }
    
    fs.writeFileSync(filePath, resolved);
    console.log(`✅ Resolved: ${filePath}`);
  }
  
  resolveByLatestTimestamp(content) {
    return content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+/g, 
      (match, head, incoming) => {
        if (head.includes('2025-09-27') && !incoming.includes('2025-09-27')) {
          return head;
        } else if (!head.includes('2025-09-27') && incoming.includes('2025-09-27')) {
          return incoming;
        }
        return head;
      });
  }
  
  preserve42Revelation(content) {
    return content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+/g, 
      (match, head, incoming) => {
        if (head.includes('forty-two-revelation') || head.includes('42 Revelation')) {
          return head;
        } else if (incoming.includes('forty-two-revelation') || incoming.includes('42 Revelation')) {
          return incoming;
        }
        return head;
      });
  }
  
  enhanceTronEscalation(content) {
    return content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+/g, 
      (match, head, incoming) => {
        if (head.includes('To TRON:')) {
          return head;
        } else if (incoming.includes('To TRON:')) {
          return incoming;
        }
        return head;
      });
  }
  
  selectEnhancedContent(content) {
    return content.replace(/<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> [a-f0-9]+/g, 
      (match, head, incoming) => {
        // Choose longer content as it likely has more enhancements
        return head.length >= incoming.length ? head : incoming;
      });
  }
  
  async regenerateLockFile(filePath) {
    const dir = path.dirname(filePath);
    try {
      execSync('npm install', { cwd: dir, stdio: 'ignore' });
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return this.selectEnhancedContent(fs.readFileSync(filePath, 'utf8'));
    }
  }
  
  async updateFinalTracking() {
    try {
      if (!fs.existsSync(this.trackingFile)) {
        console.log(`⚠️ Tracking file not found: ${this.trackingFile}`);
        return;
      }
      
      const trackingContent = fs.readFileSync(this.trackingFile, 'utf8');
      const totalCompleted = this.completedFiles + 4; // +4 for previously completed
      const newPercentage = Math.round(totalCompleted / 88 * 100);
      
      const updatedContent = trackingContent.replace(
        /\*\*4\.5% \(4\/88\)\*\*/g,
        `**${newPercentage}% (${totalCompleted}/88)**`
      );
      
      fs.writeFileSync(this.trackingFile, updatedContent);
      console.log(`📊 Updated tracking: ${newPercentage}% (${totalCompleted}/88) completed`);
      
      // Commit tracking update
      execSync(`git add "${this.trackingFile}"`);
      execSync(`git commit -m "📊 Batch resolution tracking updated: ${totalCompleted}/88 files (${newPercentage}%) completed"`);
      
    } catch (error) {
      console.log(`⚠️ Could not update tracking: ${error.message}`);
    }
  }
}

// Execute comprehensive resolution
console.log('🎯 Comprehensive Merge Conflict Resolution Starting...\n');
const resolver = new ComprehensiveConflictResolver();
resolver.resolveAllConflicts()
  .then(results => {
    console.log('\n📋 Final Summary:');
    console.log(`✅ Successfully resolved: ${results.filter(r => r.success).length} files`);
    console.log(`❌ Failed to resolve: ${results.filter(r => !r.success).length} files`);
    console.log('\n🎉 Comprehensive batch resolution complete!');
  })
  .catch(error => {
    console.error('❌ Batch resolution failed:', error);
    process.exit(1);
  });
