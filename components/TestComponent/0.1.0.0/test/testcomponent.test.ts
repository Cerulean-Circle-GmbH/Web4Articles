import { describe, it, expect } from 'vitest';
import { DefaultTestComponent } from '../src/ts/layer2/DefaultTestComponent.js';

describe('TestComponent', () => {
  it('should create instance', () => {
    const component = new DefaultTestComponent();
    expect(component).toBeDefined();
  });
});