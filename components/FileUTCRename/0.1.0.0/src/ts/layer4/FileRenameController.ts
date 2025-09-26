/**
 * Layer 4: Controller
 * Business logic orchestration for file renaming operations
 */

import { DefaultFileRenamer } from '../layer2/DefaultFileRenamer';
import { FileRenameScenario, FileRenameResult } from '../layer3/FileRenamer';

export class FileRenameController {
  private fileRenamer: DefaultFileRenamer;
  
  constructor() { // Web4 empty constructor
    this.fileRenamer = new DefaultFileRenamer();
  }
  
  init(scenario: FileRenameScenario): this {
    this.fileRenamer.init(scenario);
    return this;
  }
  
  /**
   * Execute PDCA file UTC timestamp correction
   */
  async executePDCATimestampCorrection(): Promise<FileRenameResult> {
    console.log('🔧 Starting PDCA file UTC timestamp correction...');
    
    // Preview operations first
    const operations = await this.fileRenamer.preview();
    
    console.log(`\n📋 Found ${operations.length} files to rename:`);
    operations.forEach(op => {
      console.log(`  ${op.creationTime}: ${op.description}`);
      console.log(`    ${op.originalPath} → ${op.newPath}`);
    });
    
    // Execute the renaming
    const result = await this.fileRenamer.execute();
    
    console.log(`\n✅ Renaming ${result.success ? 'completed successfully' : 'completed with errors'}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (result.gitOperations.length > 0) {
      console.log('\n🔧 Git operations executed:');
      result.gitOperations.forEach(cmd => console.log(`  ${cmd}`));
    }
    
    return result;
  }
  
  /**
   * Preview operations without executing
   */
  async previewOperations(): Promise<void> {
    const operations = await this.fileRenamer.preview();
    
    console.log(`\n📋 Preview: ${operations.length} files would be renamed:`);
    operations.forEach(op => {
      console.log(`\n  📄 ${op.description}`);
      console.log(`     Created: ${op.creationTime}`);
      console.log(`     From: ${op.originalPath}`);
      console.log(`     To:   ${op.newPath}`);
    });
  }
}
