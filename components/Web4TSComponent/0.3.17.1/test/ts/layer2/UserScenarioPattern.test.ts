import { describe, it, expect, vi } from 'vitest';
import { DefaultCLI } from '../../../src/ts/layer2/DefaultCLI.js';

/**
 * User Service Integration - Scenario Pattern Tests
 * @pdca 2025-10-28-UTC-2015.user-scenario-antipattern.pdca.md - Test-First verification
 * 
 * Purpose: Verify that DefaultCLI uses User.toScenario() instead of generateOwnerData()
 * Pattern: Components expose state via toScenario(), not custom methods
 */
describe('DefaultCLI - User Service Integration', () => {
  
  it('should use User.toScenario() for owner data', async () => {
    const cli = new DefaultCLI().init();
    
    // Mock User component with toScenario()
    const mockUserScenario = {
      ior: { 
        uuid: 'user-uuid-123', 
        component: 'User', 
        version: '1.0.0.0',
        timestamp: new Date().toISOString()
      },
      owner: JSON.stringify({ 
        user: 'testuser', 
        hostname: 'testhost', 
        uuid: 'user-uuid-123',
        timestamp: new Date().toISOString()
      }),
      model: { 
        user: 'testuser', 
        hostname: 'testhost',
        uuid: 'user-uuid-123'
      }
    };
    
    // ✅ User is now instance variable, not in model
    // @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md
    (cli as any).user = {
      toScenario: vi.fn().mockResolvedValue(mockUserScenario)
    } as any;
    
    const scenario = await cli.toScenario();
    
    // Verify toScenario() was called
    expect((cli as any).user.toScenario).toHaveBeenCalled();
    
    // Verify owner data is base64 encoded
    expect(scenario.owner).toBeDefined();
    const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
    
    // Should contain user scenario data
    expect(decoded).toContain('testuser');
    expect(decoded).toContain('testhost');
    expect(decoded).toContain('user-uuid-123');
  });
  
  it('should NOT call generateOwnerData() method', async () => {
    const cli = new DefaultCLI().init();
    const generateOwnerDataSpy = vi.fn();
    const toScenarioMock = vi.fn().mockResolvedValue({
      ior: { uuid: 'test', component: 'User', version: '1.0.0.0', timestamp: new Date().toISOString() },
      owner: '{}',
      model: {}
    });
    
    // ✅ User is now instance variable, not in model
    // @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md
    (cli as any).user = {
      toScenario: toScenarioMock,
      generateOwnerData: generateOwnerDataSpy
    } as any;
    
    await cli.toScenario();
    
    // ✅ toScenario should be called
    expect(toScenarioMock).toHaveBeenCalled();
    
    // ❌ generateOwnerData should NEVER be called (anti-pattern)
    expect(generateOwnerDataSpy).not.toHaveBeenCalled();
  });
  
  it('should work without User service (fallback scenario)', async () => {
    const cli = new DefaultCLI().init();
    // ✅ User is now instance variable, not in model
    // @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md
    (cli as any).user = undefined;
    
    const scenario = await cli.toScenario();
    
    // Should still generate valid scenario with fallback User-like scenario
    expect(scenario).toBeDefined();
    expect(scenario.ior).toBeDefined();
    expect(scenario.owner).toBeDefined();
    
    // ✅ Owner should be base64 encoded scenario (not raw JSON)
    const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
    const ownerScenario = JSON.parse(decoded);
    
    // ✅ Fallback should be a valid scenario structure
    expect(ownerScenario.ior).toBeDefined();
    expect(ownerScenario.ior.component).toBe('User');
    expect(ownerScenario.owner).toBeDefined();
    expect(ownerScenario.model).toBeDefined();
    expect(ownerScenario.model.user).toBeDefined();
    expect(ownerScenario.model.hostname).toBeDefined();
  });
  
  it('should serialize entire User scenario as owner data', async () => {
    const cli = new DefaultCLI().init();
    
    const mockUserScenario = {
      ior: { uuid: 'user-123', component: 'User', version: '1.0.0.0', timestamp: new Date().toISOString() },
      owner: 'base64encodeddata',  // User's own owner data
      model: {
        user: 'specific-user',
        hostname: 'specific-host',
        uuid: 'specific-uuid-456'
      }
    };
    
    // ✅ User is now instance variable, not in model
    // @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md
    (cli as any).user = {
      toScenario: vi.fn().mockResolvedValue(mockUserScenario)
    } as any;
    
    const scenario = await cli.toScenario();
    
    const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
    const ownerObj = JSON.parse(decoded);
    
    // ✅ Owner data should be the ENTIRE User scenario
    expect(ownerObj.ior).toBeDefined();
    expect(ownerObj.ior.uuid).toBe('user-123');
    expect(ownerObj.ior.component).toBe('User');
    expect(ownerObj.model).toBeDefined();
    expect(ownerObj.model.user).toBe('specific-user');
    expect(ownerObj.model.hostname).toBe('specific-host');
  });
});

