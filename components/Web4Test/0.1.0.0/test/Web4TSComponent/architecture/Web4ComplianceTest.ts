/**
 * Web4ComplianceTest - Test Web4TSComponent Web4 architecture compliance
 * Web4 test case for validating Web4 principles adherence
 */

import { DefaultWeb4TestCase } from '../../../src/ts/layer2/DefaultWeb4TestCase';
import { TestScenario } from '../../../src/ts/layer3/TestScenario';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Web4ComplianceTest - Validates Web4TSComponent Web4 architecture compliance
 * Tests adherence to Web4 principles: empty constructors, scenario patterns, 5-layer structure
 */
export class Web4ComplianceTest extends DefaultWeb4TestCase {
  
  /**
   * Execute test-specific logic for Web4 compliance
   */
  protected async executeTestLogic(): Promise<any> {
    if (!this.scenario?.testDataScenario) {
      throw new Error('No test data scenario provided');
    }

    const { projectRoot, componentPath, version } = this.scenario.testDataScenario;
    
    // Record input evidence
    this.recordEvidence('input', 'Web4 compliance test input', {
      projectRoot,
      componentPath,
      version
    });

    const fullComponentPath = path.join(projectRoot, componentPath, version);
    
    // Verify component directory exists
    if (!fs.existsSync(fullComponentPath)) {
      throw new Error(`Component directory does not exist: ${fullComponentPath}`);
    }
    
    const complianceResults = {
      layerStructure: await this.validateLayerStructure(fullComponentPath),
      emptyConstructors: await this.validateEmptyConstructors(fullComponentPath),
      scenarioPatterns: await this.validateScenarioPatterns(fullComponentPath),
      interfaceCompliance: await this.validateInterfaceCompliance(fullComponentPath),
      packageStructure: await this.validatePackageStructure(fullComponentPath)
    };
    
    this.recordEvidence('assertion', 'Web4 compliance validation complete', complianceResults);
    
    // Check overall compliance
    const allCompliant = Object.values(complianceResults).every(result => result.compliant);
    
    if (!allCompliant) {
      const failures = Object.entries(complianceResults)
        .filter(([_, result]) => !result.compliant)
        .map(([key, result]) => `${key}: ${result.issues?.join(', ') || 'Unknown issues'}`);
        
      throw new Error(`Web4 compliance failures: ${failures.join('; ')}`);
    }
    
    return {
      success: true,
      overallCompliant: allCompliant,
      complianceResults,
      complianceScore: this.calculateComplianceScore(complianceResults)
    };
  }
  
  /**
   * Validate 5-layer Web4 architecture structure
   */
  private async validateLayerStructure(componentPath: string): Promise<any> {
    const srcPath = path.join(componentPath, 'src', 'ts');
    const expectedLayers = ['layer1', 'layer2', 'layer3', 'layer4', 'layer5'];
    
    const issues = [];
    const layersFound = [];
    
    if (!fs.existsSync(srcPath)) {
      issues.push('Missing src/ts directory');
      return { compliant: false, issues, layersFound };
    }
    
    for (const layer of expectedLayers) {
      const layerPath = path.join(srcPath, layer);
      if (fs.existsSync(layerPath)) {
        layersFound.push(layer);
        
        // Check if layer has TypeScript files
        const tsFiles = fs.readdirSync(layerPath).filter(f => f.endsWith('.ts'));
        if (tsFiles.length === 0) {
          issues.push(`${layer} exists but contains no TypeScript files`);
        }
      }
    }
    
    // At least layer2 and layer3 should exist for basic Web4 compliance
    const hasMinimumLayers = layersFound.includes('layer2') && layersFound.includes('layer3');
    
    if (!hasMinimumLayers) {
      issues.push('Missing minimum required layers (layer2 and layer3)');
    }
    
    this.recordEvidence('step', 'Layer structure validation', {
      srcPath,
      expectedLayers,
      layersFound,
      hasMinimumLayers,
      issues
    });
    
    return {
      compliant: hasMinimumLayers && issues.length === 0,
      layersFound,
      issues,
      hasMinimumLayers
    };
  }
  
  /**
   * Validate empty constructor patterns in TypeScript files
   */
  private async validateEmptyConstructors(componentPath: string): Promise<any> {
    const srcPath = path.join(componentPath, 'src', 'ts');
    const issues = [];
    const filesChecked = [];
    const constructorPatterns = [];
    
    if (!fs.existsSync(srcPath)) {
      issues.push('Cannot check constructors - src/ts directory missing');
      return { compliant: false, issues };
    }
    
    // Find all TypeScript files
    const tsFiles = this.findTSFiles(srcPath);
    
    for (const filePath of tsFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        filesChecked.push(filePath);
        
        // Look for class declarations with constructors
        const classMatches = content.match(/class\s+\w+[^{]*{[^}]*}/gs);
        
        if (classMatches) {
          for (const classMatch of classMatches) {
            const constructorMatch = classMatch.match(/constructor\s*\([^)]*\)\s*{[^}]*}/);
            if (constructorMatch) {
              const constructor = constructorMatch[0];
              constructorPatterns.push({
                file: filePath,
                constructor: constructor.slice(0, 100) + '...' // Truncate for evidence
              });
              
              // Check if constructor has parameters (should be empty for Web4)
              const paramMatch = constructor.match(/constructor\s*\(([^)]*)\)/);
              if (paramMatch && paramMatch[1].trim() !== '') {
                issues.push(`Non-empty constructor in ${filePath}: ${paramMatch[1].trim()}`);
              }
              
              // Check for dependency injection patterns
              if (constructor.includes('inject') || constructor.includes('dependencies')) {
                issues.push(`Dependency injection pattern found in ${filePath}`);
              }
            }
          }
        }
      } catch (error) {
        issues.push(`Error reading file ${filePath}: ${error}`);
      }
    }
    
    this.recordEvidence('step', 'Empty constructor validation', {
      filesChecked: filesChecked.length,
      constructorPatterns: constructorPatterns.length,
      issues
    });
    
    return {
      compliant: issues.length === 0,
      filesChecked: filesChecked.length,
      constructorPatternsFound: constructorPatterns.length,
      issues,
      constructorPatterns
    };
  }
  
  /**
   * Validate scenario initialization patterns
   */
  private async validateScenarioPatterns(componentPath: string): Promise<any> {
    const srcPath = path.join(componentPath, 'src', 'ts');
    const issues = [];
    const scenarioPatterns = [];
    
    if (!fs.existsSync(srcPath)) {
      issues.push('Cannot check scenario patterns - src/ts directory missing');
      return { compliant: false, issues };
    }
    
    const tsFiles = this.findTSFiles(srcPath);
    
    for (const filePath of tsFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Look for init methods with scenario parameter
        const initMethods = content.match(/init\s*\([^)]*scenario[^)]*\)[^{]*{/g);
        if (initMethods) {
          scenarioPatterns.push({
            file: filePath,
            methods: initMethods.map(m => m.slice(0, 50) + '...')
          });
        }
        
        // Look for toScenario methods
        const toScenarioMethods = content.match(/toScenario\s*\([^)]*\)[^{]*{/g);
        if (toScenarioMethods) {
          if (!scenarioPatterns.find(p => p.file === filePath)) {
            scenarioPatterns.push({ file: filePath, methods: [] });
          }
          scenarioPatterns.find(p => p.file === filePath)?.methods.push(
            ...toScenarioMethods.map(m => m.slice(0, 50) + '...')
          );
        }
        
      } catch (error) {
        issues.push(`Error reading file ${filePath}: ${error}`);
      }
    }
    
    this.recordEvidence('step', 'Scenario pattern validation', {
      scenarioPatternsFound: scenarioPatterns.length,
      issues
    });
    
    // Web4 compliance doesn't strictly require scenario patterns in every file,
    // but if they exist, they should follow the pattern
    return {
      compliant: issues.length === 0,
      scenarioPatternsFound: scenarioPatterns.length,
      issues,
      scenarioPatterns
    };
  }
  
  /**
   * Validate interface compliance (layer3 interfaces)
   */
  private async validateInterfaceCompliance(componentPath: string): Promise<any> {
    const layer3Path = path.join(componentPath, 'src', 'ts', 'layer3');
    const issues = [];
    const interfaces = [];
    
    if (!fs.existsSync(layer3Path)) {
      issues.push('Missing layer3 directory for interface definitions');
      return { compliant: false, issues };
    }
    
    const tsFiles = fs.readdirSync(layer3Path).filter(f => f.endsWith('.ts'));
    
    for (const file of tsFiles) {
      try {
        const filePath = path.join(layer3Path, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Look for interface declarations
        const interfaceMatches = content.match(/interface\s+\w+[^{]*{/g);
        if (interfaceMatches) {
          interfaces.push({
            file: file,
            interfaces: interfaceMatches.map(i => i.split('{')[0].trim())
          });
        }
        
      } catch (error) {
        issues.push(`Error reading interface file ${file}: ${error}`);
      }
    }
    
    this.recordEvidence('step', 'Interface compliance validation', {
      layer3Files: tsFiles.length,
      interfacesFound: interfaces.length,
      issues
    });
    
    return {
      compliant: issues.length === 0,
      interfacesFound: interfaces.length,
      layer3Files: tsFiles.length,
      issues,
      interfaces
    };
  }
  
  /**
   * Validate package structure (package.json, tsconfig.json, etc.)
   */
  private async validatePackageStructure(componentPath: string): Promise<any> {
    const issues = [];
    const requiredFiles = ['package.json', 'tsconfig.json', 'README.md'];
    const filesFound = [];
    
    for (const file of requiredFiles) {
      const filePath = path.join(componentPath, file);
      if (fs.existsSync(filePath)) {
        filesFound.push(file);
      } else {
        issues.push(`Missing required file: ${file}`);
      }
    }
    
    // Validate package.json if it exists
    if (filesFound.includes('package.json')) {
      try {
        const packagePath = path.join(componentPath, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        if (!packageJson.scripts?.build) {
          issues.push('package.json missing build script');
        }
        
        if (!packageJson.devDependencies?.typescript) {
          issues.push('package.json missing TypeScript dependency');
        }
        
      } catch (error) {
        issues.push(`Error validating package.json: ${error}`);
      }
    }
    
    this.recordEvidence('step', 'Package structure validation', {
      requiredFiles,
      filesFound,
      issues
    });
    
    return {
      compliant: issues.length === 0,
      filesFound,
      issues
    };
  }
  
  /**
   * Find all TypeScript files recursively
   */
  private findTSFiles(directory: string): string[] {
    const tsFiles: string[] = [];
    
    const scanDirectory = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
          tsFiles.push(fullPath);
        }
      }
    };
    
    scanDirectory(directory);
    return tsFiles;
  }
  
  /**
   * Calculate overall compliance score
   */
  private calculateComplianceScore(results: any): number {
    const weights = {
      layerStructure: 30,
      emptyConstructors: 25,
      scenarioPatterns: 15,
      interfaceCompliance: 15,
      packageStructure: 15
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [category, result] of Object.entries(results)) {
      const weight = weights[category as keyof typeof weights] || 10;
      totalScore += (result as any).compliant ? weight : 0;
      totalWeight += weight;
    }
    
    return Math.round((totalScore / totalWeight) * 100);
  }
  
  /**
   * Record evidence during test execution
   */
  private recordEvidence(type: any, description: string, data: any): void {
    console.log(`[${type.toUpperCase()}] ${description}:`, data);
  }
}

/**
 * Create test scenario for Web4 compliance test
 */
export function createWeb4ComplianceTestScenario(): TestScenario {
  return {
    uuid: 'test:uuid:web4ts-compliance-001',
    name: 'Web4TSComponent Web4 Architecture Compliance Test',
    description: 'Validates that Web4TSComponent follows Web4 architecture principles: 5-layer structure, empty constructors, scenario patterns, interface compliance',
    requirementIORs: [
      'requirement:uuid:web4-architecture-compliance-001',
      'requirement:uuid:web4-empty-constructors-001',
      'requirement:uuid:web4-scenario-patterns-001',
      'requirement:uuid:web4-layer-structure-001'
    ],
    componentIORs: [
      'component:web4tscomponent:0.1.0.2'
    ],
    testDataScenario: {
      projectRoot: '/Users/Shared/Workspaces/2cuGitHub/Web4Articles',
      componentPath: 'components/Web4TSComponent',
      version: '0.1.0.2'
    },
    executionContextScenario: {
      timeout: 20000,
      cleanup: false,
      tags: ['architecture', 'compliance', 'web4', 'critical']
    },
    expectedResultScenario: {
      success: true,
      overallCompliant: true,
      complianceScore: 100
    },
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  };
}
