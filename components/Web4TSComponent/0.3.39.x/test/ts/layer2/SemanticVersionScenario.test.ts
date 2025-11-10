import { describe, it, expect } from 'vitest';
import { SemanticVersion } from '../../../src/ts/layer2/SemanticVersion.js';

/**
 * SemanticVersion - Owner Data Scenario Pattern Tests
 * @pdca 2025-10-28-UTC-2015.user-scenario-antipattern.pdca.md - Verify scenario structure
 * 
 * Purpose: Verify that SemanticVersion's owner data follows scenario pattern
 */
describe('SemanticVersion - Owner Data Scenario Pattern', () => {
  
  it('should create owner data as scenario structure', async () => {
    const version = new SemanticVersion().init();
    
    const scenario = await version.toScenario();
    
    // Verify scenario structure
    expect(scenario).toBeDefined();
    expect(scenario.ior).toBeDefined();
    expect(scenario.owner).toBeDefined();
    expect(scenario.model).toBeDefined();
    
    // ✅ Owner should be stringified scenario, not raw JSON
    const ownerScenario = JSON.parse(scenario.owner);
    
    // ✅ Owner data should have scenario structure (ior/owner/model)
    expect(ownerScenario.ior).toBeDefined();
    expect(ownerScenario.ior.component).toBe('User');
    expect(ownerScenario.ior.version).toBe('0.0.0.0');
    expect(ownerScenario.owner).toBeDefined();
    expect(ownerScenario.model).toBeDefined();
    expect(ownerScenario.model.user).toBeDefined();
    expect(ownerScenario.model.hostname).toBeDefined();
    expect(ownerScenario.model.component).toBe('SemanticVersion');
  });
  
  it('should include version string in owner scenario model', async () => {
    const version = new SemanticVersion().init();
    version.model.major = 1;
    version.model.minor = 2;
    version.model.patch = 3;
    version.model.revision = 4;
    version.model.versionString = '1.2.3.4';
    
    const scenario = await version.toScenario();
    const ownerScenario = JSON.parse(scenario.owner);
    
    // Version info should be in owner scenario model
    expect(ownerScenario.model.version).toBe('1.2.3.4');
  });
});

