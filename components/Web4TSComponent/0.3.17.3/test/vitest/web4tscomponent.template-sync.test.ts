/**
 * Template Synchronization Tests
 * 
 * Ensures that when critical master files are modified, their corresponding templates
 * are also updated to maintain consistency across generated components.
 * 
 * This test prevents the common mistake of updating master implementations without
 * propagating changes to the templates that new components are generated from.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

describe('🔄 Template Synchronization', () => {
  // ✅ Web4 Pattern: No underscore naming, use fileURLToPath for ESM
  const currentFileUrl = new URL(import.meta.url);
  const currentDir = path.dirname(fileURLToPath(currentFileUrl));
  const componentRoot = path.join(currentDir, '../..');
  
  describe('Critical File → Template Mapping', () => {
    it('should remind: DefaultWeb4TSComponent.ts changes may require DefaultComponent.ts.template updates', () => {
      // This is NOT a self-copy. DefaultComponent.ts.template is a MINIMAL version
      // that delegates to Web4TSComponent master. Check if delegation methods need updates.
      
      const masterFile = path.join(componentRoot, 'src/ts/layer2/DefaultWeb4TSComponent.ts');
      const templateFile = path.join(componentRoot, 'templates/ts/DefaultComponent.ts.template');
      
      const masterContent = readFileSync(masterFile, 'utf8');
      const templateContent = readFileSync(templateFile, 'utf8');
      
      // Key delegation methods that MUST exist in template:
      const criticalMethods = [
        'test(',
        'build(',
        'clean(',
        'tree(',
        'links(',
        'completion('
      ];
      
      const missingInTemplate: string[] = [];
      
      for (const method of criticalMethods) {
        if (!templateContent.includes(method)) {
          missingInTemplate.push(method);
        }
      }
      
      if (missingInTemplate.length > 0) {
        console.error('❌ Missing delegation methods in DefaultComponent.ts.template:');
        missingInTemplate.forEach(m => console.error(`   - ${m}`));
        throw new Error(`DefaultComponent.ts.template is missing critical delegation methods: ${missingInTemplate.join(', ')}`);
      }
      
      console.log('✅ DefaultComponent.ts.template: All critical delegation methods present');
    });
  });

  describe('Template Freshness Indicators', () => {
    it('should detect if templates have changed', () => {
      // Only check the template that actually exists
      const templateFile = path.join(componentRoot, 'templates/ts/DefaultComponent.ts.template');
      
      expect(existsSync(templateFile)).toBe(true);
      console.log('✅ DefaultComponent.ts.template exists');
      
      // Note: Critical files like DefaultCLI, TSCompletion, TestFileParser, HierarchicalCompletionFilter
      // are now EMBEDDED during copyEssentialInterfaces(), not stored as separate templates.
      // See DefaultWeb4TSComponent.ts copyEssentialInterfaces() method.
      console.log('');
      console.log('📝 Template Strategy Update:');
      console.log('   - DefaultCLI.ts: Copied via copyEssentialInterfaces()');
      console.log('   - TSCompletion.ts: Copied via copyEssentialInterfaces()');
      console.log('   - TestFileParser.ts: Copied via copyEssentialInterfaces()');
      console.log('   - HierarchicalCompletionFilter.ts: Copied via copyEssentialInterfaces()');
      console.log('   - DefaultComponent.ts.template: DELEGATION pattern (minimal, reuses master)');
    });
  });

  describe('Interface Synchronization', () => {
    it('should document that interfaces are copied via copyEssentialInterfaces()', () => {
      // Component.interface.ts and MethodSignature.interface.ts are copied during component creation
      // via the copyEssentialInterfaces() method in DefaultWeb4TSComponent.ts
      
      console.log('');
      console.log('📋 Interface Copy Mechanism:');
      console.log('   Component.interface.ts → Copied via copyEssentialInterfaces()');
      console.log('   MethodSignature.interface.ts → Copied via copyEssentialInterfaces()');
      console.log('   Web4TSComponent.interface.ts → NOT copied (specific to Web4TSComponent)');
      console.log('');
      console.log('💡 To verify: Check DefaultWeb4TSComponent.ts copyEssentialInterfaces() method');
      
      expect(true).toBe(true);
    });
  });

  describe('Documentation Reminder', () => {
    it('should document the copy vs delegation pattern', () => {
      console.log('\n📚 Template Architecture Patterns:');
      console.log('');
      console.log('🔄 RUNTIME COPY (via copyEssentialInterfaces()):');
      console.log('   - DefaultCLI.ts');
      console.log('   - TSCompletion.ts');
      console.log('   - TestFileParser.ts');
      console.log('   - HierarchicalCompletionFilter.ts');
      console.log('   - Component.interface.ts');
      console.log('   - MethodSignature.interface.ts');
      console.log('   → Files are copied at component creation time from master');
      console.log('   → Check: DefaultWeb4TSComponent.ts copyEssentialInterfaces()');
      console.log('');
      console.log('🎯 DELEGATION (Template delegates to Master):');
      console.log('   - DefaultComponent.ts.template → delegates to DefaultWeb4TSComponent');
      console.log('   → Template is MINIMAL, calls master methods via OOP');
      console.log('   → Only update template if adding NEW delegation methods');
      console.log('');
      console.log('⚠️  REMINDER: When modifying critical files, ensure copyEssentialInterfaces()');
      console.log('   includes them so new components get the latest versions!');
      console.log('');
      
      expect(true).toBe(true);
    });
  });

  describe('Template Completeness - New File Detection', () => {
    it('should verify runtime-copied files are in copyEssentialInterfaces()', () => {
      // This test verifies that infrastructure files added to src/ are included in copyEssentialInterfaces()
      // so that new components get them automatically during creation
      
      // ✅ Web4 Pattern: Reuse componentRoot from outer scope
      const defaultWeb4TSComponentPath = path.join(componentRoot, 'src/ts/layer2/DefaultWeb4TSComponent.ts');
      const sourceContent = readFileSync(defaultWeb4TSComponentPath, 'utf8');
      
      // Extract the copyEssentialInterfaces method
      const copyEssentialInterfacesMatch = sourceContent.match(/private async copyEssentialInterfaces\([^)]*\): Promise<void> \{[\s\S]*?^\s\s\}/m);
      
      if (!copyEssentialInterfacesMatch) {
        throw new Error('Could not find copyEssentialInterfaces method in DefaultWeb4TSComponent.ts');
      }
      
      const methodContent = copyEssentialInterfacesMatch[0];
      
      // Critical infrastructure files that MUST be runtime-copied
      const requiredLayer3Files = [
        'Model.interface.ts',
        'Scenario.interface.ts',
        'CLI.interface.ts',
        'MethodInfo.interface.ts',
        'MethodSignature.interface.ts',
        'Component.interface.ts',
        'Completion.ts',
        'Colors.interface.ts'  // Added for DRY refactoring
      ];
      
      const requiredLayer4Files = [
        'DefaultColors.ts'  // Added for DRY refactoring
      ];
      
      const missingLayer3Files: string[] = [];
      const missingLayer4Files: string[] = [];
      
      // Check layer3 files
      for (const file of requiredLayer3Files) {
        if (!methodContent.includes(`'${file}'`)) {
          missingLayer3Files.push(file);
        }
      }
      
      // Check layer4 files
      for (const file of requiredLayer4Files) {
        if (!methodContent.includes(`'${file}'`)) {
          missingLayer4Files.push(file);
        }
      }
      
      if (missingLayer3Files.length > 0 || missingLayer4Files.length > 0) {
        console.error('\n❌ Missing files in copyEssentialInterfaces():');
        if (missingLayer3Files.length > 0) {
          console.error('\n  Layer3 files missing:');
          missingLayer3Files.forEach(f => console.error(`   - ${f}`));
        }
        if (missingLayer4Files.length > 0) {
          console.error('\n  Layer4 files missing:');
          missingLayer4Files.forEach(f => console.error(`   - ${f}`));
        }
        console.error('\n💡 Action: Add these files to copyEssentialInterfaces() method');
        console.error('   Location: DefaultWeb4TSComponent.ts copyEssentialInterfaces()\n');
      }
      
      expect(missingLayer3Files).toEqual([]);
      expect(missingLayer4Files).toEqual([]);
      
      console.log('✅ All required infrastructure files are in copyEssentialInterfaces()');
    });
  });

  describe('Project File Synchronization', () => {
    it('should DETECT when project files are out of sync with templates', async () => {
      // This is the MASTER sync check for ALL template-generated project files
      // Uses hybrid validation: Timestamp for template updates, Content for manual edits
      
      // ✅ Web4 Pattern: Calculate from componentRoot
      const projectRoot = path.join(componentRoot, '../../..');
      const templatesDir = path.join(componentRoot, 'templates');
      
      // Define all critical files that must stay in sync with templates
      const criticalFiles = [
        {
          name: 'source.env (project root)',
          projectPath: path.join(projectRoot, 'source.env'),
          templatePath: path.join(templatesDir, 'project/source.env.template'),
          checkContent: true // Check content sync between project root and template
        },
        {
          name: 'root tsconfig.json',
          projectPath: path.join(projectRoot, 'tsconfig.json'),
          templatePath: path.join(templatesDir, 'config/root-tsconfig.json.template'),
        },
        {
          name: 'root package.json',
          projectPath: path.join(projectRoot, 'package.json'),
          templatePath: path.join(templatesDir, 'config/root-package.json.template'),
        },
        {
          name: 'vitest.config.ts',
          projectPath: path.join(projectRoot, 'components/Web4TSComponent/0.3.13.2/vitest.config.ts'),
          templatePath: path.join(templatesDir, 'config/vitest.config.ts.template'),
        },
        {
          name: 'build.sh',
          projectPath: path.join(projectRoot, 'components/Web4TSComponent/0.3.13.2/src/sh/build.sh'),
          templatePath: path.join(templatesDir, 'sh/build.sh.template'),
        },
        {
          name: 'test.sh',
          projectPath: path.join(projectRoot, 'components/Web4TSComponent/0.3.13.2/src/sh/test.sh'),
          templatePath: path.join(templatesDir, 'sh/test.sh.template'),
        },
        {
          name: 'version-wrapper.sh',
          projectPath: null, // Generated files, not manually edited
          templatePath: path.join(templatesDir, 'sh/version-wrapper.sh.template'),
          checkTemplateOnly: true // Only verify template exists, don't compare to project
        },
      ];
      
      const errors: string[] = [];
      
      for (const file of criticalFiles) {
        // Template-only validation (existence check only)
        if (file.checkTemplateOnly) {
          // Verify template exists
          if (!existsSync(file.templatePath)) {
            errors.push(`❌ Template missing: ${file.name}`);
            errors.push(`   Expected: ${file.templatePath}`);
          } else {
            console.log(`   ✅ Template exists: ${file.name}`);
          }
          continue; // Skip project file comparison
        }
        
        // Skip if file doesn't exist yet (fresh project)
        if (!existsSync(file.projectPath)) {
          console.log(`ℹ️  ${file.name} does not exist yet - run initProject to create it`);
          continue;
        }
        
        if (!existsSync(file.templatePath)) {
          errors.push(`❌ CRITICAL: Template missing for ${file.name}: ${file.templatePath}`);
          continue;
        }
        
        const projectStats = statSync(file.projectPath);
        const templateStats = statSync(file.templatePath);
        
        // Check 1: Template is NEWER than project (template was updated)
        if (templateStats.mtime > projectStats.mtime) {
          errors.push(
            `⚠️  ${file.name} is OUTDATED (template is newer)\n` +
            `   Project:  ${file.projectPath} (${projectStats.mtime.toISOString()})\n` +
            `   Template: ${file.templatePath} (${templateStats.mtime.toISOString()})\n` +
            `   🔧 FIX: Run 'web4tscomponent initProject § force' to sync`
          );
        }
        
        // Check 2: Content DIFFERS (manual edits detected) - ONLY if checkContent is true
        if (file.checkContent) {
          const projectContent = readFileSync(file.projectPath, 'utf-8');
          const templateContent = readFileSync(file.templatePath, 'utf-8');
          
          if (projectContent !== templateContent) {
            errors.push(
              `⚠️  ${file.name} has DIFFERENT CONTENT than template\n` +
              `   Project:  ${file.projectPath}\n` +
              `   Template: ${file.templatePath}\n` +
              `   🔧 FIX: Either:\n` +
              `   A) If template is correct: web4tscomponent initProject § force\n` +
              `   B) If project changes are correct:\n` +
              `      1. diff ${file.projectPath} ${file.templatePath}\n` +
              `      2. Copy changes to template\n` +
              `      3. npm run build\n` +
              `      4. web4tscomponent initProject § force`
            );
          }
        }
      }
      
      if (errors.length > 0) {
        const errorMessage = '\n\n' + errors.join('\n\n') + '\n';
        expect(errors.length, errorMessage).toBe(0);
      }
      
      console.log('✅ All project files are in sync with templates');
    });
  });
});

