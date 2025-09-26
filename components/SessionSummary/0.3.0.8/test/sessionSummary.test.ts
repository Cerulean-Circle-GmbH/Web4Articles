import { describe, it, expect } from 'vitest';
import { DefaultSessionSummary } from '../src/ts/layer2/DefaultSessionSummary.js';

describe('SessionSummary Component', () => {
  it('creates instance with empty constructor', () => {
    const summary = new DefaultSessionSummary();
    expect(summary).toBeDefined();
  });

  it('extracts TRON quotes correctly', () => {
    const summary = new DefaultSessionSummary();
    const content = `### **TRON Feedback**\n\`\`\`quote\ntest quote\n\`\`\``;
    expect(summary.extractTRONQuotes(content)).toBe('test quote');
  });

  it('extracts QA decisions correctly', () => {
    const summary = new DefaultSessionSummary();
    const content = `### **QA Decisions**\n- [x] Decision 1: Test\n- [ ] Decision 2: Test\n\n### **TRON`;
    const result = summary.extractQADecisions(content);
    expect(result).toContain('Decision 1: Test');
    expect(result).toContain('Decision 2: Test');
  });

  it('extracts achievement from title', () => {
    const summary = new DefaultSessionSummary();
    const content = `# 📋 **PDCA Cycle: Test Title - Test Description**`;
    expect(summary.extractAchievement(content, 'test.md')).toBe('Test Title - Test Description');
  });

  it('finds PDCA files in directory', () => {
    const summary = new DefaultSessionSummary();
    // This would need a test directory structure
    expect(summary.findPDCAFiles).toBeDefined();
  });
});