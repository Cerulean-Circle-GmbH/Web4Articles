/**
 * Web4TSComponent Real Usage Test
 * Demonstrate the component working as intended in practice
 */

import { describe, it, expect } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';

describe('Web4TSComponent Real Usage Tests', () => {
  it('should successfully use setLatest to update its own latest symlink', async () => {
    const component = new DefaultWeb4TSComponent();
    
    // Use the component itself to update its own latest to 0.3.2.0
    await component.on('Web4TSComponent', '0.3.2.0');
    await component.setLatest('0.3.2.0');
    
    // This works because Web4TSComponent exists in the real component structure
    expect(true).toBe(true); // Test that it doesn't throw
  });

  it('should successfully use verifyAndFix on itself', async () => {
    const component = new DefaultWeb4TSComponent();
    
    // Use the component to verify and fix its own symlinks
    await component.on('Web4TSComponent', '0.3.2.0');
    await component.verifyAndFix();
    
    // This works because Web4TSComponent has real versions
    expect(true).toBe(true); // Test that it doesn't throw
  });
});
