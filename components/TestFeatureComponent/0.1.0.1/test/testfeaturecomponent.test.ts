import { describe, it, expect } from 'vitest';
import { DefaultTestFeatureComponent } from '../src/ts/layer2/DefaultTestFeatureComponent.js';

describe('TestFeatureComponent', () => {
  it('should create instance', () => {
    const component = new DefaultTestFeatureComponent();
    expect(component).toBeDefined();
  });
});