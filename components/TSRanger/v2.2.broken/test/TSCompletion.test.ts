import { describe, it, expect, beforeAll } from 'vitest';


describe('TSCompletion', () => {
  let TSCompletion: any;
  beforeAll(async () => {
    TSCompletion = (await import('../src/ts/layer4/TSCompletion.ts')).TSCompletion;
  });

  it('should list all classes', () => {
    const classes = TSCompletion.getClasses();
    expect(Array.isArray(classes)).toBe(true);
    expect(classes.length).toBeGreaterThan(0);
  });

  it('should list methods for a class', () => {
    const classes = TSCompletion.getClasses();
    expect(classes.length).toBeGreaterThan(0);
    const className = classes[0];
    const methods = TSCompletion.getClassMethods(className);
    expect(Array.isArray(methods)).toBe(true);
  });

  it('should list parameters for a method', () => {
    const classes = TSCompletion.getClasses();
    expect(classes.length).toBeGreaterThan(0);
    const className = classes[0];
    const methods = TSCompletion.getClassMethods(className);
    if (methods.length > 0) {
      const params = TSCompletion.getMethodParameters(className, methods[0]);
      expect(Array.isArray(params)).toBe(true);
    }
  });

  it('should complete with no args', () => {
    const completion = new TSCompletion();
    const result = completion.complete([]);
    expect(result).toEqual(TSCompletion.getClasses());
  });

  it('should complete with class arg', () => {
    const completion = new TSCompletion();
    const classes = TSCompletion.getClasses();
    if (classes.length > 0) {
      const result = completion.complete([classes[0]]);
      expect(result).toEqual(TSCompletion.getClassMethods(classes[0]));
    }
  });

  it('should complete with class and method args', () => {
    const completion = new TSCompletion();
    const classes = TSCompletion.getClasses();
    if (classes.length > 0) {
      const methods = TSCompletion.getClassMethods(classes[0]);
      if (methods.length > 0) {
        const result = completion.complete([classes[0], methods[0]]);
        expect(result).toEqual(TSCompletion.getMethodParameters(classes[0], methods[0]));
      }
    }
  });

  it('completes parameter name for GitScrumProject create', () => {
    const completion = new TSCompletion();
    const result = completion.complete(['GitScrumProject', 'create']);
    // Accept either parameter name(s) or method suggestions for exact match
    expect(result.join(' ').toLowerCase()).toMatch(/project|create/);
  });

  it('completes default value for GitScrumProject create project', () => {
    const completion = new TSCompletion();
    // Simulate: oosh GitScrumProject create project [Tab]
    const result = completion.complete(['GitScrumProject', 'create', 'project']);
    expect(result.join(' ')).toMatch(/Web4Scrum/);
  });
});
