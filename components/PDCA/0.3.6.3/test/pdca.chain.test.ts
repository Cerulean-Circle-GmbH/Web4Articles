/**
 * PDCA Chain Feature Tests
 * 
 * Test bidirectional PDCA chaining feature that automatically:
 * 1. Creates new PDCA with links to previous PDCA
 * 2. Updates previous PDCA's "Next PDCA:" link to point to new PDCA
 * 
 * Requirements: 2025-11-03-UTC-0737.pdca.md
 * Pattern: Test-first CMM3 methodology
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';

describe('PDCA chain - Bidirectional Linking', () => {
  const currentFileUrl = new URL(import.meta.url);
  const testDir = path.dirname(currentFileUrl.pathname);
  const testDataDir = path.join(testDir, 'data', 'chain-tests');
  
  let pdca: DefaultPDCA;

  beforeEach(async () => {
    // Create test environment
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDataDir, { recursive: true });

    // Create minimal template in test data dir for chain to use
    const templateDir = path.join(testDataDir, 'scrum.pmo/roles/_shared/PDCA');
    fs.mkdirSync(templateDir, { recursive: true });
    const minimalTemplate = `# Test PDCA Template
**🗓️ Date:** {{UTC_TIMESTAMP}}
**🎯 Template Version:** 3.2.4.2
**👤 Agent Name:** {{AGENT_NAME}}
**👤 Branch:** {{BRANCH_NAME}}
**🔗 Previous PDCA:** {{PREV}}
**➡️ Next PDCA:** Use pdca chain

## **📊 SUMMARY**

## **📋 PLAN**

## **🔧 DO**

## **✅ CHECK**

## **🎯 ACT**`;
    fs.writeFileSync(path.join(templateDir, 'template.md'), minimalTemplate);

    // Initialize PDCA component
    pdca = new DefaultPDCA();
    await pdca.init({
      model: {
        workingDirectory: testDataDir,
        sessionDirectory: testDataDir,
        currentBranch: 'dev/test-branch',
        repoUrl: 'https://github.com/test-org/test-repo'
      }
    });
  });

  afterEach(() => {
    // Cleanup
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  it('TC40: chain - creates new PDCA with timestamp filename', async () => {
    // Given: Empty session directory
    // When: Create new PDCA via chain
    await pdca.chain('Feature Implementation');

    // Then: New PDCA file created with timestamp format YYYY-MM-DD-UTC-HHMM.pdca.md
    const files = fs.readdirSync(testDataDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    
    expect(pdcaFiles.length).toBe(1);
    
    const timestampPattern = /^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.pdca\.md$/;
    expect(pdcaFiles[0]).toMatch(timestampPattern);
  });

  it('TC41: chain - auto-detects most recent PDCA in directory', async () => {
    // Given: Directory with multiple PDCAs (different timestamps)
    const pdca1 = '2025-11-01-UTC-1000.pdca.md';
    const pdca2 = '2025-11-02-UTC-1400.pdca.md';
    const pdca3 = '2025-11-03-UTC-0800.pdca.md'; // Most recent
    
    fs.writeFileSync(path.join(testDataDir, pdca1), 'PDCA 1 content\n**➡️ Next PDCA:** Use pdca chain');
    fs.writeFileSync(path.join(testDataDir, pdca2), 'PDCA 2 content\n**➡️ Next PDCA:** Use pdca chain');
    fs.writeFileSync(path.join(testDataDir, pdca3), 'PDCA 3 content\n**➡️ Next PDCA:** Use pdca chain');

    // When: Create new PDCA
    await pdca.chain('Next Feature');

    // Then: Most recent PDCA (pdca3) should be identified and updated
    const pdca3Content = fs.readFileSync(path.join(testDataDir, pdca3), 'utf-8');
    
    // Should no longer have "Use pdca chain" - should have actual link
    expect(pdca3Content).not.toContain('**➡️ Next PDCA:** Use pdca chain');
    expect(pdca3Content).toContain('**➡️ Next PDCA:** [GitHub]');
  });

  it('TC42: chain - adds Previous PDCA links to new file', async () => {
    // Given: Existing PDCA
    const existingPDCA = '2025-11-03-UTC-0707.pdca.md';
    const existingContent = `# Test PDCA
**➡️ Next PDCA:** Use pdca chain`;
    fs.writeFileSync(path.join(testDataDir, existingPDCA), existingContent);

    // When: Create new PDCA via chain
    await pdca.chain('New Feature');

    // Then: New file contains Previous PDCA links
    const files = fs.readdirSync(testDataDir);
    const newPDCA = files.find(f => f !== existingPDCA && f.endsWith('.pdca.md'));
    expect(newPDCA).toBeDefined();

    const newContent = fs.readFileSync(path.join(testDataDir, newPDCA!), 'utf-8');
    
    // Should contain dual link format
    expect(newContent).toContain('**🔗 Previous PDCA:** [GitHub]');
    expect(newContent).toContain(`](./${existingPDCA})`);
  });

  it('TC43: chain - updates previous PDCA\'s Next PDCA line', async () => {
    // Given: Previous PDCA has "Use pdca chain"
    const previousPDCA = '2025-11-03-UTC-0700.pdca.md';
    const previousContent = `# Previous PDCA
**🔗 Previous PDCA:** [GitHub](https://example.com) | [§/path](./old.pdca.md)
**➡️ Next PDCA:** Use pdca chain

Some content here.`;
    fs.writeFileSync(path.join(testDataDir, previousPDCA), previousContent);

    // When: Create new PDCA via chain
    await pdca.chain('New Feature');

    // Then: Previous PDCA updated with actual links
    const updatedContent = fs.readFileSync(path.join(testDataDir, previousPDCA), 'utf-8');
    
    // Should no longer have "Use pdca chain"
    expect(updatedContent).not.toContain('**➡️ Next PDCA:** Use pdca chain');
    
    // Should have dual link format
    expect(updatedContent).toContain('**➡️ Next PDCA:** [GitHub]');
    expect(updatedContent).toContain('[§/');
    
    // Should preserve other content
    expect(updatedContent).toContain('Some content here.');
  });

  it.skip('TC44: chain - generates correct GitHub URLs with current branch', async () => {
    // Given: Current branch is dev/test-branch (set in beforeEach)
    const existingPDCA = '2025-11-03-UTC-0700.pdca.md';
    fs.writeFileSync(path.join(testDataDir, existingPDCA), 
      '# Test\n**➡️ Next PDCA:** Use pdca chain');

    // When: Create new PDCA
    await pdca.chain('New Feature');

    // Then: GitHub URLs use current branch
    const updatedContent = fs.readFileSync(path.join(testDataDir, existingPDCA), 'utf-8');
    
    expect(updatedContent).toContain('https://github.com/test-org/test-repo/blob/dev/test-branch/');
  });

  it('TC45: chain - handles first PDCA in directory (no previous)', async () => {
    // Given: Empty session directory (no existing PDCAs)
    // When: Create first PDCA via chain
    await pdca.chain('Initial PDCA');

    // Then: New PDCA created with "N/A" for previous
    const files = fs.readdirSync(testDataDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    
    expect(pdcaFiles.length).toBe(1);
    
    const content = fs.readFileSync(path.join(testDataDir, pdcaFiles[0]), 'utf-8');
    
    // Should indicate no previous PDCA
    expect(content).toContain('**🔗 Previous PDCA:** N/A');
  });

  it('TC46: chain - dry run does not modify files', async () => {
    // Given: Existing PDCA
    const existingPDCA = '2025-11-03-UTC-0700.pdca.md';
    const originalContent = '# Test\n**➡️ Next PDCA:** Use pdca chain';
    fs.writeFileSync(path.join(testDataDir, existingPDCA), originalContent);

    // When: Run chain with dryRun=true
    await pdca.chain('New Feature', 'true');

    // Then: No files created or modified
    const files = fs.readdirSync(testDataDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    expect(pdcaFiles.length).toBe(1); // Only original file
    expect(pdcaFiles[0]).toBe(existingPDCA);
    
    const unchangedContent = fs.readFileSync(path.join(testDataDir, existingPDCA), 'utf-8');
    expect(unchangedContent).toBe(originalContent);
  });

  it('TC47: chain - error when session directory does not exist', async () => {
    // Given: Invalid session directory
    const invalidDir = path.join(testDataDir, 'nonexistent');
    
    // Re-initialize with invalid directory
    pdca = new DefaultPDCA();
    await pdca.init({
      model: {
        workingDirectory: invalidDir,
        sessionDirectory: invalidDir,
        currentBranch: 'dev/test-branch',
        repoUrl: 'https://github.com/test-org/test-repo'
      }
    });

    // When/Then: Should throw error with helpful message
    await expect(
      pdca.chain('New Feature')
    ).rejects.toThrow(/directory does not exist|ENOENT/i);
  });

  it('TC48: chain - preserves template structure with all required sections', async () => {
    // Given: Template file exists
    // When: Create new PDCA
    await pdca.chain('Feature Implementation');

    // Then: New PDCA has all required sections
    const files = fs.readdirSync(testDataDir);
    const newPDCA = files.find(f => f.endsWith('.pdca.md'));
    const content = fs.readFileSync(path.join(testDataDir, newPDCA!), 'utf-8');

    // Required sections
    expect(content).toContain('## **📊 SUMMARY**');
    expect(content).toContain('## **📋 PLAN**');
    expect(content).toContain('## **🔧 DO**');
    expect(content).toContain('## **✅ CHECK**');
    expect(content).toContain('## **🎯 ACT**');
    
    // Required metadata
    expect(content).toContain('**🎯 Template Version:** 3.2.4.2');
    expect(content).toContain('**👤 Agent Name:**');
    expect(content).toContain('**👤 Branch:**');
  });
});

