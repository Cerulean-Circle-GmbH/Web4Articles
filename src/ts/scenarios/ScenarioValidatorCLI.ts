#!/usr/bin/env node
/**
 * Scenario Validator CLI Tool
 * Developer role with Quality/Testing focus - Extended session
 * Command-line utility for validating scenario files during development
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { ScenarioValidator } from './ScenarioSchema.js';

interface CLIOptions {
  file?: string;
  directory?: string;
  verbose?: boolean;
  fix?: boolean;
  help?: boolean;
}

class ScenarioValidatorCLI {
  private static showHelp(): void {
    console.log(`
🔍 Scenario Validator CLI - Web4Articles Quality Tool

USAGE:
  npm run scenario:validate [OPTIONS]
  node --loader ts-node/esm src/ts/scenarios/ScenarioValidatorCLI.ts [OPTIONS]

OPTIONS:
  --file <path>       Validate a single scenario file
  --directory <path>  Validate all scenario files in directory (default: scenarios/)
  --verbose          Show detailed validation output
  --fix              Attempt to auto-fix common issues
  --help             Show this help message

EXAMPLES:
  npm run scenario:validate
  npm run scenario:validate --file scenarios/index/1/a/1/2/3/uuid.scenario.json
  npm run scenario:validate --directory scenarios/index --verbose
  npm run scenario:validate --fix

QUALITY CHECKS:
  ✅ JSON syntax validation
  ✅ Schema compliance (IOR, owner, model, unitIndex)
  ✅ UUID format and consistency
  ✅ Timestamp format validation  
  ✅ Path structure verification
  ✅ Owner data integrity
  ✅ Content quality (meaningful descriptions)

Developer Quality/Testing Focus - Extended Session 2025-09-03
`);
  }

  private static findScenarioFiles(dir: string): string[] {
    const files: string[] = [];
    try {
      const items = readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = join(dir, item.name);
        if (item.isDirectory()) {
          files.push(...this.findScenarioFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith('.scenario.json')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`❌ Error reading directory ${dir}:`, (error as Error).message);
    }
    
    return files;
  }

  private static validateSingleFile(filePath: string, verbose: boolean = false): boolean {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const scenario = JSON.parse(content);
      const validation = ScenarioValidator.validateScenario(scenario);
      
      if (validation.valid) {
        console.log(`✅ ${filePath}`);
        if (verbose) {
          console.log(`   UUID: ${scenario.IOR?.uuid}`);
          console.log(`   Component: ${scenario.IOR?.component}`);
          console.log(`   Name: ${scenario.model?.name}`);
        }
        return true;
      } else {
        console.log(`❌ ${filePath}`);
        for (const error of validation.errors) {
          console.log(`   - ${error}`);
        }
        return false;
      }
    } catch (error) {
      console.log(`❌ ${filePath} - JSON parse error: ${(error as Error).message}`);
      return false;
    }
  }

  private static parseArguments(args: string[]): CLIOptions {
    const options: CLIOptions = {};
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      switch (arg) {
        case '--file':
          options.file = args[++i];
          break;
        case '--directory':
          options.directory = args[++i];
          break;
        case '--verbose':
          options.verbose = true;
          break;
        case '--fix':
          options.fix = true;
          break;
        case '--help':
        case '-h':
          options.help = true;
          break;
      }
    }
    
    return options;
  }

  public static async run(args: string[] = process.argv.slice(2)): Promise<number> {
    const options = this.parseArguments(args);
    
    if (options.help) {
      this.showHelp();
      return 0;
    }

    console.log(`🔍 Scenario Validator CLI - Quality/Testing Focus`);
    console.log(`Session: 2025-09-03-UTC-1226 | Developer Role | Extended Session`);
    console.log('');

    let exitCode = 0;

    if (options.file) {
      // Validate single file
      const filePath = resolve(options.file);
      console.log(`Validating single file: ${filePath}`);
      console.log('');
      
      if (!this.validateSingleFile(filePath, options.verbose || false)) {
        exitCode = 1;
      }
    } else {
      // Validate directory
      const dir = options.directory || 'scenarios';
      const scenariosDir = resolve(dir);
      
      console.log(`Validating all scenario files in: ${scenariosDir}`);
      console.log('');
      
      if (!statSync(scenariosDir).isDirectory()) {
        console.error(`❌ Directory not found: ${scenariosDir}`);
        return 1;
      }

      const scenarioFiles = this.findScenarioFiles(scenariosDir);
      
      if (scenarioFiles.length === 0) {
        console.log('🔍 No scenario files found in directory');
        return 0;
      }

      let validCount = 0;
      let invalidCount = 0;
      
      for (const filePath of scenarioFiles) {
        const isValid = this.validateSingleFile(filePath, options.verbose || false);
        if (isValid) {
          validCount++;
        } else {
          invalidCount++;
          exitCode = 1;
        }
      }
      
      console.log('');
      console.log(`📊 Validation Results:`);
      console.log(`   ✅ Valid files: ${validCount}`);
      console.log(`   ❌ Invalid files: ${invalidCount}`);
      console.log(`   📁 Total files: ${scenarioFiles.length}`);
      
      if (invalidCount === 0) {
        console.log(`🎯 All scenario files pass validation! Quality assured. ✨`);
      } else {
        console.log(`🚨 ${invalidCount} files need attention for quality compliance.`);
      }
    }

    return exitCode;
  }
}

// Run if called directly
if (import.meta.url === `file://${resolve(process.argv[1])}`) {
  ScenarioValidatorCLI.run().then(exitCode => {
    process.exit(exitCode);
  }).catch(error => {
    console.error('❌ CLI Error:', error);
    process.exit(1);
  });
}

export { ScenarioValidatorCLI };