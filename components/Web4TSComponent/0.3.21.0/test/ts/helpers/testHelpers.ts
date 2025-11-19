/**
 * Test Helpers - Common test utilities
 * 
 * @pdca 2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { DefaultWeb4TSComponent } from '../../../src/ts/layer2/DefaultWeb4TSComponent.js';

// ✅ Web4 Pattern: Module-level constants
const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../../..');
const testDataPath = path.join(componentRoot, 'test/data');

/**
 * Create a test component with proper test isolation
 * Uses test/data as targetDirectory
 */
export async function createTestComponent(): Promise<DefaultWeb4TSComponent> {
  const version = await SemanticVersion.fromString('0.3.17.3');
  return new DefaultWeb4TSComponent().init({
    model: {
      targetDirectory: testDataPath,
      component: 'Web4TSComponent',
      version: version,
      name: 'Web4TSComponent',
      origin: '',
      definition: '',
      componentRoot: componentRoot,
      uuid: ''
    }
  });
}

/**
 * Get test data path for test isolation
 */
export function getTestDataPath(): string {
  return testDataPath;
}

/**
 * Get component root path
 */
export function getComponentRoot(): string {
  return componentRoot;
}

