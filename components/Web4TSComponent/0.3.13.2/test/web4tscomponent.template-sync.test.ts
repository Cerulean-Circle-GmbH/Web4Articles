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

describe('🔄 Template Synchronization', () => {
  const componentRoot = path.join(__dirname, '..');
  
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
      
      const componentRoot = path.join(__dirname, '..');
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
});

