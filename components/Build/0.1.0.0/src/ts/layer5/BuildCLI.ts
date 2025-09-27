/**
 * Build Component CLI - Web4 Build Dependency Management
 * Layer 5: User Experience Layer
 */

import { BuildManager, BuildStatus } from '../layer4/BuildManager.js';
import { BuildScenarioLoader } from '../layer4/BuildScenarioLoader.js';
import { DependencyResolver } from '../layer4/DependencyResolver.js';

export class BuildCLI {
  private buildManager: BuildManager;
  private scenarioLoader: BuildScenarioLoader;
  private resolver: DependencyResolver;

  constructor() {
    // Empty constructor - Web4 principle
    this.buildManager = new BuildManager();
    this.scenarioLoader = new BuildScenarioLoader();
    this.resolver = new DependencyResolver();
  }

  async run(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0];

    try {
      switch (command) {
        case 'build-deps':
          await this.buildDependencies();
          break;
        case 'verify':
          await this.verifyBuild();
          break;
        case 'ensure-built':
          await this.ensureBuilt();
          break;
        case 'check-deps':
          await this.checkDependencies();
          break;
        case 'generate-config':
          await this.generateBuildConfig();
          break;
        default:
          this.showHelp();
      }
    } catch (error: any) {
      console.error('❌ Build error:', error.message);
      process.exit(1);
    }
  }

  private async buildDependencies(): Promise<void> {
    console.log('🔨 Building component dependencies...\n');
    
    // Load build scenario
    const scenario = await this.scenarioLoader.loadBuildScenario();
    if (!scenario.state?.dependencies?.length) {
      console.log('✅ No dependencies to build');
      return;
    }

    // Resolve build order
    const buildOrder = await this.resolver.resolveBuildOrder(scenario);
    
    // Build each dependency
    for (const dep of buildOrder) {
      await this.buildManager.buildComponent(dep);
    }
    
    console.log('✅ All dependencies built successfully!');
  }

  private async verifyBuild(): Promise<void> {
    const isBuilt = await this.buildManager.verifyCurrentBuild();
    if (isBuilt) {
      console.log('✅ Component built successfully');
    } else {
      console.error('❌ Build verification failed');
      process.exit(1);
    }
  }

  private async ensureBuilt(): Promise<void> {
    const isBuilt = await this.buildManager.isBuilt();
    if (!isBuilt) {
      console.log('🔨 Component not built, building now...');
      await this.buildDependencies();
      // Component's own build will be triggered by npm
    } else {
      console.log('✅ Component already built');
    }
  }

  private async checkDependencies(): Promise<void> {
    const scenario = await this.scenarioLoader.loadBuildScenario();
    const report = await this.resolver.checkDependencyStatus(scenario);
    
    console.log('📊 Dependency Status Report:\n');
    for (const [name, status] of Object.entries(report)) {
      const buildStatus = status as BuildStatus;
      const icon = buildStatus.built ? '✅' : '❌';
      console.log(`${icon} ${name}: ${buildStatus.message}`);
    }
  }

  private async generateBuildConfig(): Promise<void> {
    console.log('📝 Generating build.scenario.json template...');
    await this.scenarioLoader.generateTemplate();
    console.log('✅ Created build.scenario.json');
  }

  private showHelp(): void {
    console.log(`
Web4 Build Component - Scenario-based Build Management

Usage:
  build build-deps       Build all component dependencies
  build verify          Verify current build status
  build ensure-built    Ensure component and deps are built
  build check-deps      Check dependency build status
  build generate-config Generate build.scenario.json template

Build Configuration:
  Components define dependencies in build.scenario.json
  Build order is automatically resolved
  Shared build utility manages the process

Example build.scenario.json:
{
  "type": "BuildConfiguration",
  "buildDependencies": {
    "dependencies": [
      {
        "name": "@web4/unit",
        "path": "../../Unit/latest",
        "required": true
      }
    ]
  }
}
    `);
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new BuildCLI();
  cli.run();
}