import { describe, it, expect } from 'vitest';
import { DefaultTestCreateComponent } from '../src/ts/layer2/DefaultTestCreateComponent.js';

describe('TestCreateComponent', () => {
  it('should create instance', () => {
    const component = new DefaultTestCreateComponent();
    expect(component).toBeDefined();
  });
});