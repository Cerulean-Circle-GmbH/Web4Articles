#!/usr/bin/env node
/**
 * CLI tool for fixing scenario owner UUIDs
 * Usage: node fix-scenario-uuids.js [scenario-file-path]
 * Usage: node fix-scenario-uuids.js --all
 */

import { DefaultUser } from './dist/layer2/DefaultUser.js';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🔧 User Scenario Owner UUID Fix Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node fix-scenario-uuids.js <scenario-file-path>  # Fix single file');
    console.log('  node fix-scenario-uuids.js --all                # Fix all scenarios');
    console.log('');
    console.log('Examples:');
    console.log('  node fix-scenario-uuids.js ../../../scenarios/index/a/b/c/d/e/file.scenario.json');
    console.log('  node fix-scenario-uuids.js --all');
    return;
  }

  try {
    if (args[0] === '--all') {
      console.log('🔍 Finding all scenario files...');
      
      // Find all scenario files from project root
      const projectRoot = path.resolve(__dirname, '../../..');
      const scenarioFiles = await glob('scenarios/index/**/*.scenario.json', { cwd: projectRoot });
      
      if (scenarioFiles.length === 0) {
        console.log('❌ No scenario files found');
        return;
      }

      console.log(`📁 Found ${scenarioFiles.length} scenario files`);
      console.log('🔧 Starting batch fix...\n');

      // Convert to absolute paths
      const absolutePaths = scenarioFiles.map(file => path.resolve(projectRoot, file));
      
      const batchResult = await DefaultUser.batchFixScenarioOwnerUUIDs(absolutePaths);
      
      console.log('📊 Batch Fix Results:');
      console.log(`📁 Total Files: ${batchResult.totalFiles}`);
      console.log(`✅ Successful Fixes: ${batchResult.successfulFixes}`);
      console.log(`🔄 Already Fixed: ${batchResult.alreadyFixed}`);
      console.log(`❌ Errors: ${batchResult.errors}`);
      
      if (batchResult.successfulFixes > 0) {
        console.log('\n🔧 Fixed Files:');
        for (const fileResult of batchResult.results) {
          if (fileResult.success && fileResult.oldUUID !== fileResult.newUUID) {
            const fileName = path.basename(fileResult.filePath);
            console.log(`✅ ${fileName}`);
            console.log(`   🔄 ${fileResult.oldUUID} → ${fileResult.newUUID}`);
          }
        }
      }

      if (batchResult.errors > 0) {
        console.log('\n❌ Errors:');
        for (const fileResult of batchResult.results) {
          if (!fileResult.success) {
            const fileName = path.basename(fileResult.filePath);
            console.log(`❌ ${fileName}: ${fileResult.message}`);
          }
        }
      }

    } else {
      // Single file fix
      const scenarioFile = path.resolve(args[0]);
      console.log(`🔧 Fixing scenario: ${path.basename(scenarioFile)}`);
      
      const result = await DefaultUser.fixScenarioOwnerUUID(scenarioFile);
      
      if (result.success) {
        console.log(`✅ ${result.message}`);
        if (result.oldUUID && result.newUUID) {
          if (result.oldUUID !== result.newUUID) {
            console.log(`🔄 ${result.oldUUID} → ${result.newUUID}`);
          } else {
            console.log(`🔄 UUID already consistent: ${result.newUUID}`);
          }
        }
      } else {
        console.log(`❌ ${result.message}`);
        process.exit(1);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
