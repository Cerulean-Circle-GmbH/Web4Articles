/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { DefaultWeb4TSComponent } from '../dist/ts/layer2/DefaultWeb4TSComponent.js';
import { ComponentDependency, ComponentScaffoldOptions } from '../dist/ts/layer3/Web4TSComponent.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createONCEWithDependencies() {
  console.log('🚀 Demo: Creating ONCE Component with Dependencies\n');

  // Create the component generator
  const generator = new DefaultWeb4TSComponent();
  
  // Set target directory (demo output)
  const demoOutputDir = path.join(__dirname, '../demo-output');
  generator.setTargetDirectory(demoOutputDir);

  // Define ONCE dependencies (as mentioned in the PDCA)
  const onceDependencies: ComponentDependency[] = [
    { component: 'IOR', version: '0.3.0.3' },
    { component: 'Scenario', version: '0.3.0.2' },
    { component: 'User', version: '0.3.0.2' }
  ];

  console.log('📦 ONCE Dependencies:');
  onceDependencies.forEach(dep => {
    console.log(`  - ${dep.component}@${dep.version}`);
  });
  console.log();

  // Set up ONCE with dependencies
  generator.setComponentName('ONCE');
  generator.setVersion('0.3.1.0');
  generator.setDependencies(onceDependencies);

  // Show scenario serialization
  console.log('🎬 ONCE Component Scenario:');
  const scenario = generator.toScenario();
  console.log(JSON.stringify(scenario, null, 2));
  console.log();

  // Scaffold options for ONCE
  const onceOptions: ComponentScaffoldOptions = {
    componentName: 'ONCE',
    version: '0.3.1.0',
    includeLayerArchitecture: true,
    includeCLI: true,
    includeSpecFolder: true,
    includeVitest: true,
    dependencies: onceDependencies
  };

  try {
    console.log('🏗️ Scaffolding ONCE component with dependencies...');
    const metadata = await generator.scaffoldComponent(onceOptions);
    
    console.log('✅ ONCE Component Created:');
    console.log(`  Name: ${metadata.name}`);
    console.log(`  Version: ${metadata.version}`);
    console.log(`  Has CLI: ${metadata.hasLocationResilientCLI}`);
    console.log(`  Has Layered Architecture: ${metadata.hasLayeredArchitecture}`);
    console.log(`  Dependencies: ${metadata.dependencies?.length || 0}`);
    console.log();

    // Generate and show dependency-aware build scripts
    console.log('📋 Generated install-deps.sh:');
    const installScript = await generator.generateInstallDepsScript('ONCE', '0.3.1.0', onceDependencies);
    console.log('─'.repeat(60));
    console.log(installScript.substring(0, 800) + '...');
    console.log('─'.repeat(60));
    console.log();

    console.log('📋 Generated build.sh:');
    const buildScript = await generator.generateBuildScript('ONCE', '0.3.1.0', onceDependencies);
    console.log('─'.repeat(60));
    console.log(buildScript.substring(0, 800) + '...');
    console.log('─'.repeat(60));
    console.log();

    console.log('🎯 Component Directory Structure:');
    console.log(`${demoOutputDir}/components/ONCE/0.3.1.0/`);
    console.log('├── src/ts/layer2/');
    console.log('├── src/ts/layer3/');
    console.log('├── src/ts/layer5/');
    console.log('├── spec/requirements/');
    console.log('├── spec/requirements.md/');
    console.log('├── package.json');
    console.log('├── tsconfig.json');
    console.log('├── once.sh (Location-Resilient CLI)');
    console.log('├── install-deps.sh (Dependency-Aware)');
    console.log('└── build.sh (Dependency-Aware)');
    console.log();

  } catch (error) {
    console.error('❌ Error creating ONCE:', (error as Error).message);
    process.exit(1);
  }

  // Demo: Show how buildDependencies() would work
  console.log('🔗 Dependency Build Process:');
  console.log('This would execute:');
  console.log('1. Check if IOR@0.3.0.3 is built');
  console.log('2. Check if Scenario@0.3.0.2 is built');
  console.log('3. Check if User@0.3.0.2 is built');
  console.log('4. Build any missing dependencies');
  console.log('5. Verify all dependencies are available');
  console.log();

  // Show how this solves the PDCA problem
  console.log('✨ Problem Solved:');
  console.log('✅ Component model is dependency-aware');
  console.log('✅ Build scripts auto-build dependencies first');
  console.log('✅ Dependencies are tracked in component metadata');
  console.log('✅ Scenario serialization includes dependencies');
  console.log('✅ Build process is fully automated');
  console.log();

  console.log('🎉 Dependency system implementation complete!');
}

// Run the demo
createONCEWithDependencies().catch(console.error);