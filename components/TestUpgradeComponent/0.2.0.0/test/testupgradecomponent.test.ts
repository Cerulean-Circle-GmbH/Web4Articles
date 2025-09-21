import { describe, it, expect } from 'vitest';
import { DefaultTestUpgradeComponent } from '../src/ts/layer2/DefaultTestUpgradeComponent.js';

describe('TestUpgradeComponent', () => {
  it('should create instance', () => {
    const component = new DefaultTestUpgradeComponent();
    expect(component).toBeDefined();
  });
});