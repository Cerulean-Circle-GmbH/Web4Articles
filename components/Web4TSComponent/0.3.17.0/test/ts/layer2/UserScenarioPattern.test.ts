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
    
    cli.model.user = {
      toScenario: vi.fn().mockResolvedValue(mockUserScenario)
    } as any;
    
    const scenario = await cli.toScenario();
    
    // Verify toScenario() was called
    expect(cli.model.user.toScenario).toHaveBeenCalled();
    
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
    
    cli.model.user = {
      toScenario: toScenarioMock,
      generateOwnerData: generateOwnerDataSpy
    } as any;
    
    await cli.toScenario();
    
    // ✅ toScenario should be called
    expect(toScenarioMock).toHaveBeenCalled();
    
    // ❌ generateOwnerData should NEVER be called (anti-pattern)
    expect(generateOwnerDataSpy).not.toHaveBeenCalled();
  });
  
  it('should work without User service (fallback)', async () => {
    const cli = new DefaultCLI().init();
    cli.model.user = undefined;
    
    const scenario = await cli.toScenario();
    
    // Should still generate valid scenario with fallback owner data
    expect(scenario).toBeDefined();
    expect(scenario.ior).toBeDefined();
    expect(scenario.owner).toBeDefined();
    
    // Owner should be base64 encoded
    const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
    expect(() => JSON.parse(decoded)).not.toThrow();
  });
  
  it('should extract owner from User scenario if available', async () => {
    const cli = new DefaultCLI().init();
    
    const mockOwnerData = JSON.stringify({
      user: 'specific-user',
      hostname: 'specific-host',
      uuid: 'specific-uuid-456'
    });
    
    cli.model.user = {
      toScenario: vi.fn().mockResolvedValue({
        ior: { uuid: 'user-123', component: 'User', version: '1.0.0.0', timestamp: new Date().toISOString() },
        owner: mockOwnerData,  // Already has owner field
        model: {}
      })
    } as any;
    
    const scenario = await cli.toScenario();
    
    const decoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
    const ownerObj = JSON.parse(decoded);
    
    // Should use the owner data from User scenario
    expect(ownerObj.user).toBe('specific-user');
    expect(ownerObj.hostname).toBe('specific-host');
    expect(ownerObj.uuid).toBe('specific-uuid-456');
  });
});

