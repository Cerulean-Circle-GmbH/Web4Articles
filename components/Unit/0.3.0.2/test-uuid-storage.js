/**
 * Test script for UUID Index Storage
 */

import { UnitIndexStorage } from './dist/ts/layer2/UnitIndexStorage.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '../../..');

async function testUUIDStorage() {
  console.log('🧪 Testing Unit UUID Index Storage...');
  
  const storage = new UnitIndexStorage().init(projectRoot);
  
  // Test scenario data
  const testUUID = '1a123c8b-e76f-4c2b-b6b2-375620179ce6';
  const testScenario = {
    uuid: testUUID,
    name: 'Test Unit',
    description: 'Testing UUID storage system',
    createdAt: new Date().toISOString()
  };
  
  // Test symbolic link locations
  const symlinkPaths = [
    path.join(projectRoot, 'components/Unit/latest/spec/requirements', `${testUUID}.scenario.json`),
    path.join(projectRoot, 'components/TestComponent/v1.0/units', `${testUUID}.scenario.json`)
  ];
  
  try {
    // Test 1: Save scenario to index
    console.log('\n📁 Test 1: Saving scenario to UUID index...');
    const saveResult = await storage.saveScenario(testUUID, testScenario, symlinkPaths);
    console.log('Save result:', saveResult);
    
    // Test 2: Load scenario from index  
    console.log('\n📖 Test 2: Loading scenario from UUID index...');
    const loadResult = await storage.loadScenario(testUUID);
    console.log('Load result:', loadResult);
    
    // Test 3: Get backlink info
    console.log('\n🔗 Test 3: Getting backlink information...');
    const backlinkInfo = await storage.getBacklinkInfo(testUUID);
    console.log('Backlink info:', backlinkInfo);
    
    // Test 4: Add additional symbolic link
    console.log('\n➕ Test 4: Adding additional symbolic link...');
    const addSymlinkResult = await storage.addSymbolicLink(
      testUUID, 
      path.join(projectRoot, 'additional-location', `${testUUID}.scenario.json`)
    );
    console.log('Add symlink result:', addSymlinkResult);
    
    // Test 5: List all scenarios
    console.log('\n📋 Test 5: Listing all scenarios in index...');
    const listResult = await storage.listScenarios();
    console.log('List result:', listResult);
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run tests
testUUIDStorage();
