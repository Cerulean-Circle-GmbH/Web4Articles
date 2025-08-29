/**
 * Web4TSCTestingCLI - Web4 Architecture Layer 5 CLI
 * Command-line interface for Web4TSComponent testing and validation
 */

import { DefaultWeb4TSCTesting } from '../layer2/DefaultWeb4TSCTesting.js';

class Web4TSCTestingCLI {
  private tester: DefaultWeb4TSCTesting;

  constructor() {
    this.tester = new DefaultWeb4TSCTesting();
  }

  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showHelp();
      return;
    }

    const command = args[0];
    const remainingArgs = args.slice(1);

    try {
      switch (command) {
        case 'run-all-tests':
          await this.runAllTests(remainingArgs);
          break;
        case 'test-cli-generation':
          await this.testCLIGeneration(remainingArgs);
          break;
        case 'test-standards-validation':
          await this.testStandardsValidation(remainingArgs);
          break;
        case 'test-architecture-compliance':
          await this.testArchitectureCompliance(remainingArgs);
          break;
        case 'test-scenario-support':
          await this.testScenarioSupport(remainingArgs);
          break;
        case 'generate-test-report':
          await this.generateTestReport(remainingArgs);
          break;
        case 'generate-coverage-report':
          await this.generateCoverageReport(remainingArgs);
          break;
        case 'benchmark-performance':
          await this.benchmarkPerformance(remainingArgs);
          break;
        case 'stress-test-components':
          await this.stressTestComponents(remainingArgs);
          break;
        case 'validate-environment':
          await this.validateEnvironment(remainingArgs);
          break;
        case 'help':
          this.showHelp();
          break;
        default:
          console.error(`Unknown command: ${command}`);
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error(`Command failed: ${error}`);
      process.exit(1);
    }
  }

  private async runAllTests(args: string[]): Promise<void> {
    console.log('🧪 Running comprehensive Web4TSComponent tests...');
    
    // Parse arguments
    const web4TSComponentPath = args.find(arg => arg.startsWith('--component-path='))?.split('=')[1];
    const outputPath = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
    const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] as any;

    // Configure tester
    if (web4TSComponentPath) this.tester.setWeb4TSComponentPath(web4TSComponentPath);
    if (outputPath) this.tester.setTestOutputPath(outputPath);
    if (mode) this.tester.setTestMode(mode);

    try {
      const report = await this.tester.runComprehensiveTests();
      
      console.log('\n📊 Test Results Summary:');
      console.log(`Total Tests: ${report.totalTests}`);
      console.log(`Passed: ${report.passedTests} ✅`);
      console.log(`Failed: ${report.failedTests} ❌`);
      console.log(`Coverage: ${report.coveragePercentage}%`);
      console.log(`Execution Time: ${report.executionTimeMs}ms`);

      // Show failed tests if any
      if (report.failedTests > 0) {
        console.log('\n❌ Failed Tests:');
        report.results.filter(r => !r.passed).forEach(result => {
          console.log(`  - ${result.scenarioName}: ${result.details}`);
          result.errors.forEach(error => console.log(`    Error: ${error}`));
        });
      }

      // Show warnings
      const warnings = report.results.flatMap(r => r.warnings).filter(w => w);
      if (warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        warnings.forEach(warning => console.log(`  - ${warning}`));
      }

    } catch (error) {
      console.error(`Test execution failed: ${error}`);
      process.exit(1);
    }
  }

  private async testCLIGeneration(args: string[]): Promise<void> {
    console.log('🔧 Testing CLI generation functionality...');
    
    const componentName = args[0] || 'TestComponent';
    const version = args[1] || '0.1.0.0';

    try {
      const result = await this.tester.testCLIGeneration(componentName, version);
      this.displayTestResult(result);
    } catch (error) {
      console.error(`CLI generation test failed: ${error}`);
      process.exit(1);
    }
  }

  private async testStandardsValidation(args: string[]): Promise<void> {
    console.log('📏 Testing standards validation functionality...');
    
    const componentPath = args[0] || './test-component';

    try {
      const result = await this.tester.testStandardsValidation(componentPath);
      this.displayTestResult(result);
    } catch (error) {
      console.error(`Standards validation test failed: ${error}`);
      process.exit(1);
    }
  }

  private async testArchitectureCompliance(args: string[]): Promise<void> {
    console.log('🏗️ Testing architecture compliance...');
    
    const componentPath = args[0] || './test-component';

    try {
      const result = await this.tester.testArchitectureCompliance(componentPath);
      this.displayTestResult(result);
    } catch (error) {
      console.error(`Architecture compliance test failed: ${error}`);
      process.exit(1);
    }
  }

  private async testScenarioSupport(args: string[]): Promise<void> {
    console.log('💾 Testing scenario support compliance...');
    
    const componentPath = args[0] || './test-component';

    try {
      const result = await this.tester.testScenarioSupportCompliance(componentPath);
      this.displayTestResult(result);
    } catch (error) {
      console.error(`Scenario support test failed: ${error}`);
      process.exit(1);
    }
  }

  private async generateTestReport(args: string[]): Promise<void> {
    console.log('📄 Generating test report...');
    
    const format = args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'json';
    const outputFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1];

    try {
      const report = await this.tester.exportTestResults(format as any);
      
      if (outputFile) {
        const fs = await import('fs/promises');
        await fs.writeFile(outputFile, report);
        console.log(`✅ Test report saved to: ${outputFile}`);
      } else {
        console.log(report);
      }
    } catch (error) {
      console.error(`Report generation failed: ${error}`);
      process.exit(1);
    }
  }

  private async generateCoverageReport(_args: string[]): Promise<void> {
    console.log('📊 Generating coverage report...');

    try {
      const coverage = await this.tester.generateCoverageReport();
      
      console.log('\n📈 Coverage Report:');
      console.log(`Total Features: ${coverage.totalFeatures}`);
      console.log(`Covered Features: ${coverage.coveredFeatures}`);
      console.log(`Coverage Percentage: ${coverage.coveragePercentage}%`);
      
      if (coverage.uncoveredFeatures.length > 0) {
        console.log('\n❌ Uncovered Features:');
        coverage.uncoveredFeatures.forEach(feature => console.log(`  - ${feature}`));
      }
    } catch (error) {
      console.error(`Coverage report generation failed: ${error}`);
      process.exit(1);
    }
  }

  private async benchmarkPerformance(_args: string[]): Promise<void> {
    console.log('⏱️ Running performance benchmarks...');

    try {
      const benchmarks = await this.tester.runPerformanceTests();
      
      console.log('\n📊 Performance Benchmarks:');
      benchmarks.forEach(benchmark => {
        console.log(`\n${benchmark.operationName}:`);
        console.log(`  Average Response Time: ${benchmark.averageResponseTimeMs}ms`);
        console.log(`  Max Response Time: ${benchmark.maxResponseTimeMs}ms`);
        console.log(`  Min Response Time: ${benchmark.minResponseTimeMs}ms`);
        console.log(`  Memory Usage: ${benchmark.memoryUsageMB}MB`);
        console.log(`  Operations/Second: ${benchmark.operationsPerSecond}`);
      });
    } catch (error) {
      console.error(`Performance benchmark failed: ${error}`);
      process.exit(1);
    }
  }

  private async stressTestComponents(_args: string[]): Promise<void> {
    console.log('💪 Running stress tests...');

    try {
      const report = await this.tester.runStressTests();
      
      console.log('\n🔥 Stress Test Results:');
      console.log(`Total Tests: ${report.totalTests}`);
      console.log(`Passed: ${report.passedTests} ✅`);
      console.log(`Failed: ${report.failedTests} ❌`);
      console.log(`Execution Time: ${report.executionTimeMs}ms`);
    } catch (error) {
      console.error(`Stress testing failed: ${error}`);
      process.exit(1);
    }
  }

  private async validateEnvironment(_args: string[]): Promise<void> {
    console.log('🔍 Validating test environment...');

    try {
      const envValidation = await this.tester.validateTestEnvironment();
      const installValidation = await this.tester.validateWeb4TSComponentInstallation();
      
      console.log('\n🌍 Environment Validation:');
      this.displayValidationResult('Environment', envValidation);
      this.displayValidationResult('Web4TSComponent Installation', installValidation);
      
    } catch (error) {
      console.error(`Environment validation failed: ${error}`);
      process.exit(1);
    }
  }

  private displayTestResult(result: any): void {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    console.log(`\n${status}: ${result.scenarioName}`);
    console.log(`Details: ${result.details}`);
    console.log(`Execution Time: ${result.executionTimeMs}ms`);
    
    if (result.errors.length > 0) {
      console.log('Errors:');
      result.errors.forEach((error: string) => console.log(`  - ${error}`));
    }
    
    if (result.warnings.length > 0) {
      console.log('Warnings:');
      result.warnings.forEach((warning: string) => console.log(`  - ${warning}`));
    }
  }

  private displayValidationResult(name: string, validation: any): void {
    const status = validation.isValid ? '✅ VALID' : '❌ INVALID';
    console.log(`${name}: ${status} (Score: ${validation.complianceScore}%)`);
    
    if (validation.issues.length > 0) {
      console.log('  Issues:');
      validation.issues.forEach((issue: string) => console.log(`    - ${issue}`));
    }
    
    if (validation.suggestions.length > 0) {
      console.log('  Suggestions:');
      validation.suggestions.forEach((suggestion: string) => console.log(`    - ${suggestion}`));
    }
  }

  private showHelp(): void {
    console.log(`
🧪 Web4TSCTesting v0.1.0.0 - Web4TSComponent Testing & Validation Suite

USAGE:
  web4tsctesting <command> [options]

COMMANDS:
  run-all-tests                  Run comprehensive test suite
    --component-path=<path>      Path to Web4TSComponent
    --output=<path>              Test output directory  
    --mode=<mode>               Test mode (basic|comprehensive|performance|stress)

  test-cli-generation [name] [version]
                                Test CLI generation functionality
    
  test-standards-validation <component-path>
                                Test standards validation
    
  test-architecture-compliance <component-path>  
                                Test architecture compliance
    
  test-scenario-support <component-path>
                                Test scenario support compliance

  generate-test-report          Generate test execution report
    --format=<format>           Report format (json|xml|html)
    --output=<file>             Output file path
    
  generate-coverage-report     Generate test coverage report
  
  benchmark-performance        Run performance benchmarks
  
  stress-test-components       Run stress tests
  
  validate-environment         Validate test environment
  
  help                         Show this help message

EXAMPLES:
  web4tsctesting run-all-tests --component-path=../../../components/Web4TSComponent/0.1.1.0
  web4tsctesting test-cli-generation MyComponent 0.1.0.0
  web4tsctesting test-standards-validation ./test-component
  web4tsctesting generate-test-report --format=html --output=report.html

Web4 Principles Applied:
- ✅ Empty Constructor Principle
- ✅ Scenario-First Development  
- ✅ Non-Interactive Testing (No Hangs)
- ✅ Location-Resilient CLI
- ✅ 5-Layer Architecture
    `);
  }
}

// CLI Entry Point
async function main(): Promise<void> {
  const cli = new Web4TSCTestingCLI();
  const args = process.argv.slice(2);
  await cli.run(args);
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('CLI execution failed:', error);
    process.exit(1);
  });
}

export { Web4TSCTestingCLI };
