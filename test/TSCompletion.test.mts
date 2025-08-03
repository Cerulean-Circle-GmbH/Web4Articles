
let TSCompletion: any;
beforeAll(async () => {
  // Dynamic import for ESM compatibility
  TSCompletion = (await import('../../src/ts/layer4/TSCompletion.ts')).TSCompletion;
});

describe('TSCompletion', () => {
  it('should list all classes', () => {
    const classes = TSCompletion.getClasses();
    expect(Array.isArray(classes)).toBe(true);
    expect(classes.length).toBeGreaterThan(0);
    expect(classes).toContain('GitScrumProject');
  });

  it('should list methods for a class', () => {
    const methods = TSCompletion.getClassMethods('GitScrumProject');
    expect(Array.isArray(methods)).toBe(true);
    expect(methods).toContain('start');
  });

  it('should list parameters for a method', () => {
    const params = TSCompletion.getMethodParameters('GitScrumProject', 'start');
    expect(Array.isArray(params)).toBe(true);
    // Accepts empty array if no params
    expect(params.length).toBeGreaterThanOrEqual(0);
  });

  it('should complete with no args', () => {
    const completion = new TSCompletion();
    const result = completion.complete([]);
    expect(result).toEqual(TSCompletion.getClasses());
  });

  it('should complete with class arg', () => {
    const completion = new TSCompletion();
    const result = completion.complete(['GitScrumProject']);
    expect(result).toEqual(TSCompletion.getClassMethods('GitScrumProject'));
  });

  it('should complete with class and method args', () => {
    const completion = new TSCompletion();
    const result = completion.complete(['GitScrumProject', 'start']);
    expect(result).toEqual(TSCompletion.getMethodParameters('GitScrumProject', 'start'));
  });
});
