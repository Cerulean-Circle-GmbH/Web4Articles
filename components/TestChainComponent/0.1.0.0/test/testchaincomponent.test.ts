import { describe, it, expect } from 'vitest';
import { DefaultTestChainComponent } from '../src/ts/layer2/DefaultTestChainComponent.js';

describe('TestChainComponent', () => {
  it('should create instance', () => {
    const component = new DefaultTestChainComponent();
    expect(component).toBeDefined();
  });
});