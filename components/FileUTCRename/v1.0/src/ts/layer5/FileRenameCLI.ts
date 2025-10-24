/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { FileRenameController } from '../layer4/FileRenameController';
import { FileRenameScenario } from '../layer3/FileRenamer';

export class FileRenameCLI {
  private controller: FileRenameController;
  
  constructor() { // Web4 empty constructor
    this.controller = new FileRenameController();
  }
  
  /**
   * Main CLI entry point for PDCA timestamp correction
   */
  async executePDCACorrection(options: {
    sourceDirectory?: string;
    dryRun?: boolean;
    preview?: boolean;
  } = {}): Promise<void> {
    
    const scenario: FileRenameScenario = {
      sourceDirectory: options.sourceDirectory || 'scrum.pmo/project.journal/2025-08-20-1552/pdca',
      filePattern: '*.md', // Changed to catch all .md files in the directory
      utcTimestampFormat: 'YYYY-MM-DD-UTC-HHMM',
      useGitMv: true,
      dryRun: options.dryRun || false
    };
    
    this.controller.init(scenario);
    
    console.log('🔧 FileUTCRename Component - Web4 PDCA Timestamp Correction');
    console.log('==============================================================');
    console.log(`📁 Source Directory: ${scenario.sourceDirectory}`);
    console.log(`🔍 File Pattern: ${scenario.filePattern}`);
    console.log(`⏰ UTC Format: ${scenario.utcTimestampFormat}`);
    console.log(`🔧 Use Git Mv: ${scenario.useGitMv ? 'Yes' : 'No'}`);
    console.log(`🧪 Dry Run: ${scenario.dryRun ? 'Yes' : 'No'}`);
    console.log('');
    
    if (options.preview) {
      await this.controller.previewOperations();
      return;
    }
    
    try {
      const result = await this.controller.executePDCATimestampCorrection();
      
      console.log('\n🎯 Summary:');
      console.log(`   Operations: ${result.operations.length}`);
      console.log(`   Success: ${result.success ? '✅' : '❌'}`);
      console.log(`   Errors: ${result.errors.length}`);
      console.log(`   Git Commands: ${result.gitOperations.length}`);
      
      if (result.success && !scenario.dryRun) {
        console.log('\n✨ PDCA file UTC timestamps corrected successfully!');
        console.log('   Ready to create Sprint 21 requirements with proper source links.');
      }
      
    } catch (error) {
      console.error('\n💥 FileUTCRename Component Error:', error);
      process.exit(1);
    }
  }
}

// CLI execution when run directly
if (require.main === module) {
  const cli = new FileRenameCLI();
  const args = process.argv.slice(2);
  
  const options = {
    dryRun: args.includes('--dry-run'),
    preview: args.includes('--preview'),
    sourceDirectory: args.find(arg => arg.startsWith('--source='))?.split('=')[1]
  };
  
  cli.executePDCACorrection(options);
}
