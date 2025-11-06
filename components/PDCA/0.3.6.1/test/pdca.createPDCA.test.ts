/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

/**
 * PDCA createPDCA Feature Tests
 * 
 * Test programmatic PDCA creation feature that:
 * 1. Reads template from scrum.pmo/roles/_shared/PDCA/template.md
 * 2. Populates template placeholders with provided title and objective
 * 3. Generates complete PDCA boilerplate for AI population
 * 4. Writes to session directory with timestamp filename
 * 
 * Requirements: 2025-11-03-UTC-0837.pdca.md
 * Pattern: Test-first CMM3 methodology
 * Decisions: 1a (explicit params), 2a (session directory)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';

describe('PDCA createPDCA - Programmatic PDCA Generation', () => {
  // Web4-compliant pattern: Use import.meta.url instead of __dirname
  const currentFileUrl = new URL(import.meta.url);
  const testDir = path.dirname(currentFileUrl.pathname);
  const testDataDir = path.join(testDir, 'data', 'createPDCA-tests');
  
  let pdca: DefaultPDCA;

  beforeEach(async () => {
    // Create isolated test environment
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDataDir, { recursive: true });

    // Create session directory
    const sessionDir = path.join(testDataDir, 'session');
    fs.mkdirSync(sessionDir, { recursive: true });

    // Create complete template in test data dir (all required sections)
    const templateDir = path.join(testDataDir, 'scrum.pmo/roles/_shared/PDCA');
    fs.mkdirSync(templateDir, { recursive: true });
    const completeTemplate = `# 📋 **PDCA Cycle: {{TITLE}}**

**🗓️ Date:** {{UTC_TIMESTAMP}}  
**🎯 Objective:** {{OBJECTIVE}}  
**🎯 Template Version:** 3.2.4.2  
**🏅 CMM Badge:** 🟡 CMM3-Planning → CMM4-Target

**👤 Agent Name:** {{AGENT_NAME}} → Feature Development  
**👤 Agent Role:** Developer → Implementation  
**👤 Branch:** {{BRANCH_NAME}} → Feature Development  
**🔄 Sync Requirements:** None → Isolated development  
**🎯 Project Journal Session:** {{SESSION_NAME}} → Implementation
**🎯 Sprint:** {{SPRINT_NAME}} → Implementation
**✅ Task:** {{TASK_NAME}}  
**🚨 Issues:** {{KEY_ISSUES}}  

**📎 Previous Commit:** {{PREVIOUS_COMMIT_SHA}} - {{PREVIOUS_COMMIT_DESCRIPTION}}  
**🔗 Previous PDCA:** {{PREVIOUS_PDCA_LINK}}
**➡️ Next PDCA:** Use pdca chain

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** {{ARTIFACT_LINKS}}

### **To TRON: QA Decisions required**
**TEMPLATE VERIFICATION:** Template verified

---

## **📋 PLAN**

**Objective:** {{PLAN_OBJECTIVE}}

**Requirements Traceability:** {{REQUIREMENT_UUID}}

---

## **🔧 DO**

**Implementation:**

---

## **✅ CHECK**

**Verification Results:**

---

## **🎯 ACT**

**Success Achieved:** {{SUCCESS_SUMMARY}}

---

## **💫 EMOTIONAL REFLECTION**

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨
`;
    fs.writeFileSync(path.join(templateDir, 'template.md'), completeTemplate);

    // Initialize PDCA component with test configuration
    pdca = new DefaultPDCA();
    await pdca.init({
      model: {
        workingDirectory: testDataDir,
        sessionDirectory: sessionDir,
        currentBranch: 'dev/test-branch',
        repoUrl: 'https://github.com/test-org/test-repo'
      }
    });
  });

  afterEach(() => {
    // Cleanup test environment
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  it('TC50: createPDCA - creates PDCA with timestamp filename in session directory', async () => {
    // Given: Empty session directory
    const sessionDir = path.join(testDataDir, 'session');
    
    // When: Create new PDCA
    await pdca.createPDCA('Test Feature Implementation', 'Implement test feature using TDD');

    // Then: PDCA file created with timestamp format YYYY-MM-DD-UTC-HHMMSS.pdca.md (or legacy HHMM)
    const files = fs.readdirSync(sessionDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    
    expect(pdcaFiles.length).toBe(1);
    expect(pdcaFiles[0]).toMatch(/^\d{4}-\d{2}-\d{2}-UTC-\d{4,6}\.pdca\.md$/); // Support both HHMM and HHMMSS
  });

  it('TC51: createPDCA - populates template with provided title', async () => {
    // Given: Template with {{TITLE}} placeholder
    const title = 'Advanced Feature Development';
    
    // When: Create PDCA with title
    await pdca.createPDCA(title, 'Build advanced features');

    // Then: Title appears in generated PDCA
    const sessionDir = path.join(testDataDir, 'session');
    const files = fs.readdirSync(sessionDir);
    const pdcaFile = files.find(f => f.endsWith('.pdca.md'));
    const content = fs.readFileSync(path.join(sessionDir, pdcaFile!), 'utf-8');
    
    expect(content).toContain(title);
    expect(content).not.toContain('{{TITLE}}'); // Placeholder replaced
  });

  it('TC52: createPDCA - populates template with provided objective', async () => {
    // Given: Template with {{OBJECTIVE}} placeholder
    const objective = 'Implement comprehensive test coverage for new API endpoints';
    
    // When: Create PDCA with objective
    await pdca.createPDCA('API Testing', objective);

    // Then: Objective appears in generated PDCA
    const sessionDir = path.join(testDataDir, 'session');
    const files = fs.readdirSync(sessionDir);
    const pdcaFile = files.find(f => f.endsWith('.pdca.md'));
    const content = fs.readFileSync(path.join(sessionDir, pdcaFile!), 'utf-8');
    
    expect(content).toContain(objective);
    expect(content).not.toContain('{{OBJECTIVE}}'); // Placeholder replaced
  });

  it('TC53: createPDCA - generates valid UTC timestamp', async () => {
    // Given: Current date/time
    const beforeCreate = new Date();
    
    // When: Create PDCA
    await pdca.createPDCA('Timestamp Test', 'Verify timestamp generation');

    // Then: Timestamp is valid and recent
    const sessionDir = path.join(testDataDir, 'session');
    const files = fs.readdirSync(sessionDir);
    const pdcaFile = files.find(f => f.endsWith('.pdca.md'));
    const content = fs.readFileSync(path.join(sessionDir, pdcaFile!), 'utf-8');
    
    // Should not contain placeholder
    expect(content).not.toContain('{{UTC_TIMESTAMP}}');
    
    // Filename should match current date (support both HHMM and HHMMSS formats)
    const datePattern = /(\d{4})-(\d{2})-(\d{2})-UTC-(\d{4,6})/;
    const match = pdcaFile!.match(datePattern);
    expect(match).not.toBeNull();
    
    const year = parseInt(match![1]);
    const month = parseInt(match![2]);
    const day = parseInt(match![3]);
    
    expect(year).toBe(beforeCreate.getUTCFullYear());
    expect(month).toBe(beforeCreate.getUTCMonth() + 1);
    expect(day).toBe(beforeCreate.getUTCDate());
  });

  it('TC54: createPDCA - preserves all template sections', async () => {
    // Given: Template with all required sections
    
    // When: Create PDCA
    await pdca.createPDCA('Structure Test', 'Verify complete structure');

    // Then: All sections preserved in generated PDCA
    const sessionDir = path.join(testDataDir, 'session');
    const files = fs.readdirSync(sessionDir);
    const pdcaFile = files.find(f => f.endsWith('.pdca.md'));
    const content = fs.readFileSync(path.join(sessionDir, pdcaFile!), 'utf-8');
    
    // Verify all major sections exist
    expect(content).toContain('## **📊 SUMMARY**');
    expect(content).toContain('## **📋 PLAN**');
    expect(content).toContain('## **🔧 DO**');
    expect(content).toContain('## **✅ CHECK**');
    expect(content).toContain('## **🎯 ACT**');
    expect(content).toContain('## **💫 EMOTIONAL REFLECTION**');
    expect(content).toContain('## **🎯 PDCA PROCESS UPDATE**');
    expect(content).toContain('**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨');
  });

  it('TC55: createPDCA - dry run does not create file', async () => {
    // Given: Empty session directory
    const sessionDir = path.join(testDataDir, 'session');
    
    // When: Create PDCA in dry run mode
    await pdca.createPDCA('Dry Run Test', 'Test dry run functionality', 'true');

    // Then: No file created
    const files = fs.readdirSync(sessionDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    
    expect(pdcaFiles.length).toBe(0);
  });

  it('TC56: createPDCA - creates session directory if not exists', async () => {
    // Given: Session directory does not exist
    const sessionDir = path.join(testDataDir, 'session');
    fs.rmSync(sessionDir, { recursive: true, force: true });
    expect(fs.existsSync(sessionDir)).toBe(false);
    
    // When: Create PDCA
    await pdca.createPDCA('Directory Test', 'Verify directory creation');

    // Then: Session directory created and PDCA written
    expect(fs.existsSync(sessionDir)).toBe(true);
    const files = fs.readdirSync(sessionDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    expect(pdcaFiles.length).toBe(1);
  });

  it('TC57: createPDCA - returns this for method chaining', async () => {
    // Given: PDCA instance
    
    // When: Call createPDCA
    const result = await pdca.createPDCA('Chaining Test', 'Verify method chaining');

    // Then: Returns same instance
    expect(result).toBe(pdca);
  });

  it('TC58: createPDCA - handles special characters in title', async () => {
    // Given: Title with special characters
    const title = 'Feature: Test & Verify "Special" Characters (RFC-123)';
    
    // When: Create PDCA
    await pdca.createPDCA(title, 'Test special character handling');

    // Then: Title preserved correctly in content
    const sessionDir = path.join(testDataDir, 'session');
    const files = fs.readdirSync(sessionDir);
    const pdcaFile = files.find(f => f.endsWith('.pdca.md'));
    const content = fs.readFileSync(path.join(sessionDir, pdcaFile!), 'utf-8');
    
    expect(content).toContain(title);
  });

  it('TC59: createPDCA - updates previous PDCA\'s "Next PDCA:" link (bidirectional chaining)', async () => {
    // Given: First PDCA exists with older timestamp (manually created)
    const sessionDir = path.join(testDataDir, 'session');
    const firstPDCA = '2025-11-03-UTC-0800.pdca.md';
    const firstContent = `# Test PDCA
**➡️ Next PDCA:** Use pdca chain`;
    fs.writeFileSync(path.join(sessionDir, firstPDCA), firstContent);
    
    // When: Create second PDCA using createPDCA
    await pdca.createPDCA('Second PDCA', 'Follow-up feature');
    
    // Then: First PDCA's "Next PDCA:" link updated with DualLinks to second
    const files = fs.readdirSync(sessionDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md')).sort();
    expect(pdcaFiles.length).toBe(2);
    
    const updatedFirstContent = fs.readFileSync(path.join(sessionDir, firstPDCA), 'utf-8');
    const secondPDCA = pdcaFiles[1];
    
    // Verify bidirectional link was added
    expect(updatedFirstContent).toContain(`**➡️ Next PDCA:**`);
    expect(updatedFirstContent).toContain(`[GitHub](`);
    expect(updatedFirstContent).toContain(`](./${secondPDCA})`); // Relative path with ./ prefix
    expect(updatedFirstContent).not.toContain('Use pdca chain'); // Placeholder replaced
  });

  it('TC60: createPDCA - with no previous PDCA skips link update', async () => {
    // Given: Empty session directory (only scrum.pmo dir)
    const sessionDir = path.join(testDataDir, 'session');
    const initialFiles = fs.readdirSync(sessionDir);
    const initialPDCAs = initialFiles.filter(f => f.endsWith('.pdca.md'));
    expect(initialPDCAs.length).toBe(0);
    
    // When: Create first PDCA
    await pdca.createPDCA('First PDCA', 'Initial feature');
    
    // Then: PDCA created without attempting to update non-existent previous
    const files = fs.readdirSync(sessionDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    expect(pdcaFiles.length).toBe(1);
    
    // No error thrown, PDCA created successfully
    const content = fs.readFileSync(path.join(sessionDir, pdcaFiles[0]), 'utf-8');
    expect(content).toContain('First PDCA');
  });

  it('TC61: createPDCA - dry run shows would-update message for bidirectional chain', async () => {
    // Given: First PDCA exists with older timestamp (manually created)
    const sessionDir = path.join(testDataDir, 'session');
    const firstPDCA = '2025-11-03-UTC-0800.pdca.md';
    const firstContent = `# Test PDCA
**➡️ Next PDCA:** Use pdca chain`;
    fs.writeFileSync(path.join(sessionDir, firstPDCA), firstContent);
    
    // When: Create second PDCA in dry run mode
    await pdca.createPDCA('Second PDCA', 'Follow-up feature', 'true');
    
    // Then: First PDCA NOT modified (dry run)
    const files = fs.readdirSync(sessionDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    expect(pdcaFiles.length).toBe(1); // Still only first PDCA
    
    // First PDCA unchanged
    const unchangedContent = fs.readFileSync(path.join(sessionDir, firstPDCA), 'utf-8');
    expect(unchangedContent).toBe(firstContent);
  });

  it('TC62: createPDCA - bidirectional link update verified across multiple PDCAs', async () => {
    // Given: Chain of 2 pre-existing PDCAs (manually created with older timestamps)
    const sessionDir = path.join(testDataDir, 'session');
    const firstPDCA = '2025-11-03-UTC-0700.pdca.md';
    const secondPDCA = '2025-11-03-UTC-0800.pdca.md';
    
    const firstContent = `# First PDCA
**🔗 Previous PDCA:** N/A
**➡️ Next PDCA:** [§/session/${secondPDCA}](${secondPDCA})`;
    
    const secondContent = `# Second PDCA
**🔗 Previous PDCA:** [§/session/${firstPDCA}](${firstPDCA})
**➡️ Next PDCA:** Use pdca chain`;
    
    fs.writeFileSync(path.join(sessionDir, firstPDCA), firstContent);
    fs.writeFileSync(path.join(sessionDir, secondPDCA), secondContent);
    
    // When: Create third PDCA using createPDCA
    await pdca.createPDCA('Third PDCA', 'Feature 3');
    
    // Then: Verify previous PDCA's Next link was updated
    const files = fs.readdirSync(sessionDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md')).sort();
    expect(pdcaFiles.length).toBe(3);
    
    const updatedSecondContent = fs.readFileSync(path.join(sessionDir, secondPDCA), 'utf-8');
    const thirdPDCA = pdcaFiles[2];
    
    // Second → Third (Next link updated by createPDCA)
    expect(updatedSecondContent).toContain(`](./${thirdPDCA})`); // Relative path with ./ prefix
    expect(updatedSecondContent).not.toContain('Use pdca chain'); // Placeholder replaced
    
    // Verify the chain is maintained
    expect(updatedSecondContent).toContain('**🔗 Previous PDCA:**');
    expect(updatedSecondContent).toContain('**➡️ Next PDCA:**');
  });

  it('TC70: createPDCA - populates Previous PDCA dual link', async () => {
    // Given: First PDCA exists
    const sessionDir = path.join(testDataDir, 'session');
    const firstPDCA = '2025-11-03-UTC-0800.pdca.md';
    const firstContent = `# First PDCA
**🎯 Template Version:** 3.2.4.2
**➡️ Next PDCA:** Use pdca chain`;
    fs.writeFileSync(path.join(sessionDir, firstPDCA), firstContent);

    // When: Create second PDCA using createPDCA
    await pdca.createPDCA('Second PDCA', 'Test objective');

    // Then: New PDCA should have populated Previous PDCA dual link
    const files = fs.readdirSync(sessionDir);
    const secondPDCA = files.filter(f => f.endsWith('.pdca.md')).sort()[1];
    const secondContent = fs.readFileSync(path.join(sessionDir, secondPDCA), 'utf-8');

    // Should NOT contain unpopulated placeholders
    expect(secondContent).not.toContain('{{GITHUB_URL}}');
    expect(secondContent).not.toContain('{{SESSION}}');
    expect(secondContent).not.toContain('{{FILENAME}}');
    expect(secondContent).not.toContain('{{OTHER_SESSION}}');

    // Should contain actual dual link to previous PDCA
    expect(secondContent).toContain('**🔗 Previous PDCA:**');
    expect(secondContent).toContain('[GitHub](');
    expect(secondContent).toContain('github.com');
    expect(secondContent).toContain('2025-11-03-UTC-0800.pdca.md');
    expect(secondContent).toContain('[§/'); // Section path (format varies by environment)
    expect(secondContent).toContain(`](./${firstPDCA})`); // Relative path
  });

  it('TC71: createPDCA - first PDCA indicates no previous PDCA', async () => {
    // Given: No previous PDCAs exist
    // When: Create first PDCA
    await pdca.createPDCA('First PDCA', 'Test objective');

    // Then: Should indicate no previous PDCA
    const sessionDir = path.join(testDataDir, 'session');
    const files = fs.readdirSync(sessionDir);
    const firstPDCAPath = path.join(sessionDir, files[0]);
    const firstContent = fs.readFileSync(firstPDCAPath, 'utf-8');

    // Should not have unpopulated template placeholders
    const githubUrlMatches = firstContent.match(/{{GITHUB_URL}}/g) || [];
    // Filter out those in code blocks/quotes (documented examples)
    const codeBlocksRemoved = firstContent.replace(/```[\s\S]*?```/g, '').replace(/`[^`]+`/g, '');
    expect(codeBlocksRemoved).not.toContain('{{SESSION}}');
    expect(codeBlocksRemoved).not.toContain('{{OTHER_SESSION}}');
    
    // Previous PDCA line should indicate no previous PDCA exists
    const previousLine = firstContent.match(/\*\*🔗 Previous PDCA:\*\* .*/)[0];
    expect(previousLine).toMatch(/N\/A|First PDCA/i);
  });

  // ============================================================================
  // TC80-TC85: Custom Session Directory Feature
  // PDCA: 2025-11-04-UTC-0726.pdca.md
  // Feature: Enable createPDCA to work in any component directory
  // ============================================================================

  it('TC80: createPDCA - custom sessionDirectory creates PDCA in specified location', async () => {
    // Given: Custom session directory exists
    const customDir = path.join(testDataDir, 'custom-component', 'session');
    fs.mkdirSync(customDir, { recursive: true });
    
    // When: Create PDCA with custom sessionDirectory
    await pdca.createPDCA('Custom Dir Test', 'Test in custom location', customDir);
    
    // Then: PDCA should be created in custom directory
    const files = fs.readdirSync(customDir).filter(f => f.endsWith('.pdca.md'));
    expect(files.length).toBe(1);
    expect(files[0]).toMatch(/^\d{4}-\d{2}-\d{2}-UTC-\d{4,6}\.pdca\.md$/); // Support both HHMM and HHMMSS
    
    // And: PDCA should contain correct title and objective
    const content = fs.readFileSync(path.join(customDir, files[0]), 'utf-8');
    expect(content).toContain('Custom Dir Test');
    expect(content).toContain('Test in custom location');
  });

  it('TC81: createPDCA - non-existent sessionDirectory throws error', async () => {
    // Given: Invalid directory path
    const invalidDir = path.join(testDataDir, 'does-not-exist');
    
    // When/Then: Creating PDCA with non-existent directory should throw
    await expect(
      pdca.createPDCA('Should Fail', 'Invalid directory', invalidDir)
    ).rejects.toThrow(/directory does not exist|ENOENT/i);
    
    // And: No PDCA file should be created
    expect(fs.existsSync(invalidDir)).toBe(false);
  });

  it('TC82: createPDCA - without sessionDirectory uses default (backward compat)', async () => {
    // Given: Default session directory exists
    const defaultSessionDir = path.join(testDataDir, 'session');
    const filesBefore = fs.readdirSync(defaultSessionDir).filter(f => f.endsWith('.pdca.md'));
    
    // When: Create PDCA without sessionDirectory parameter
    await pdca.createPDCA('Default Location', 'Uses default path');
    
    // Then: PDCA created in default location
    const filesAfter = fs.readdirSync(defaultSessionDir).filter(f => f.endsWith('.pdca.md'));
    expect(filesAfter.length).toBe(filesBefore.length + 1);
    
    // And: New PDCA has correct content
    const newFile = filesAfter.filter(f => !filesBefore.includes(f))[0];
    const content = fs.readFileSync(path.join(defaultSessionDir, newFile), 'utf-8');
    expect(content).toContain('Default Location');
    expect(content).toContain('Uses default path');
  });

  it('TC83: createPDCA - bidirectional links work with custom directory', async () => {
    // Given: Custom directory with existing PDCA
    const customDir = path.join(testDataDir, 'web4tscomponent', 'session');
    fs.mkdirSync(customDir, { recursive: true });
    
    const firstPDCA = '2025-11-04-UTC-0700.pdca.md';
    const firstContent = `# First PDCA
**🎯 Template Version:** 3.2.4.2
**➡️ Next PDCA:** Use pdca chain`;
    fs.writeFileSync(path.join(customDir, firstPDCA), firstContent);
    
    // When: Create second PDCA in same custom directory
    await pdca.createPDCA('Second in Custom', 'Chain test', customDir);
    
    // Then: New PDCA should link to previous
    const files = fs.readdirSync(customDir).filter(f => f.endsWith('.pdca.md')).sort();
    const secondContent = fs.readFileSync(path.join(customDir, files[1]), 'utf-8');
    
    expect(secondContent).toContain('**🔗 Previous PDCA:**');
    expect(secondContent).toContain(firstPDCA);
    expect(secondContent).toContain('[GitHub](');
  });

  it('TC84: createPDCA - dry run with custom directory', async () => {
    // Given: Custom directory exists
    const customDir = path.join(testDataDir, 'dryrun-custom');
    fs.mkdirSync(customDir, { recursive: true });
    
    // When: Create PDCA in dry-run mode with custom directory
    await pdca.createPDCA('Dry Run Custom', 'Should not create', customDir, 'true');
    
    // Then: No PDCA file should be created
    const files = fs.readdirSync(customDir).filter(f => f.endsWith('.pdca.md'));
    expect(files.length).toBe(0);
  });

  it('TC85: createPDCA - relative vs absolute paths work identically', async () => {
    // Given: Two identical directories (one accessed via relative, one via absolute)
    const relativeDir = path.join(testDataDir, 'relative-test');
    const absoluteDir = path.resolve(testDataDir, 'absolute-test');
    fs.mkdirSync(relativeDir, { recursive: true });
    fs.mkdirSync(absoluteDir, { recursive: true });
    
    // When: Create PDCAs using relative and absolute paths
    await pdca.createPDCA('Relative Path', 'Relative test', relativeDir);
    await pdca.createPDCA('Absolute Path', 'Absolute test', absoluteDir);
    
    // Then: Both should create valid PDCAs
    const relativeFiles = fs.readdirSync(relativeDir).filter(f => f.endsWith('.pdca.md'));
    const absoluteFiles = fs.readdirSync(absoluteDir).filter(f => f.endsWith('.pdca.md'));
    
    expect(relativeFiles.length).toBe(1);
    expect(absoluteFiles.length).toBe(1);
    
    // And: Both should have correct content
    const relativeContent = fs.readFileSync(path.join(relativeDir, relativeFiles[0]), 'utf-8');
    const absoluteContent = fs.readFileSync(path.join(absoluteDir, absoluteFiles[0]), 'utf-8');
    
    expect(relativeContent).toContain('Relative Path');
    expect(absoluteContent).toContain('Absolute Path');
  });

  /**
   * TC92: Verify Previous Commit Auto-Population
   * Test that createPDCA automatically populates "Previous Commit" field
   * with git log output instead of leaving "TBD - TBD"
   */
  it('TC92 should auto-populate Previous Commit field with git log', async () => {
    // Given: A git repository with commits
    pdca = new DefaultPDCA({ componentRoot: testDataDir });
    
    // When: Creating a PDCA
    await pdca.createPDCA('Test Commit Population', 'Verify Previous Commit auto-populates', undefined, false);
    
    // Then: Previous Commit field should be populated (not TBD)
    const files = fs.readdirSync(path.join(testDataDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    expect(files.length).toBe(1);
    
    const content = fs.readFileSync(path.join(testDataDir, 'session', files[0]), 'utf-8');
    
    // Should contain "Previous Commit:" with SHA pattern (7+ hex chars) and message
    expect(content).toMatch(/\*\*📎 Previous Commit:\*\* [a-f0-9]{7,} - .+/);
    
    // Should NOT contain the TBD placeholder
    expect(content).not.toContain('**📎 Previous Commit:** TBD - TBD');
  });

  /**
   * TC93: Handle Fresh Repo with No Commits
   * Test graceful fallback to TBD when git repo has no commits yet
   */
  it('TC93 should fallback to TBD for fresh repo with no commits', async () => {
    // Given: A fresh git repo with no commits
    const freshRepoDir = path.join(testDataDir, 'fresh-repo');
    fs.mkdirSync(freshRepoDir, { recursive: true });
    fs.mkdirSync(path.join(freshRepoDir, 'session'), { recursive: true });
    
    // Copy template to fresh repo
    const templateDir = path.join(freshRepoDir, 'scrum.pmo/roles/_shared/PDCA');
    fs.mkdirSync(templateDir, { recursive: true });
    const templatePath = path.join(testDataDir, 'scrum.pmo/roles/_shared/PDCA/template.md');
    const freshTemplatePath = path.join(templateDir, 'template.md');
    fs.copyFileSync(templatePath, freshTemplatePath);
    
    // Initialize git but don't commit
    const { execSync } = require('child_process');
    try {
      execSync('git init', { cwd: freshRepoDir });
    } catch (error) {
      // Ignore if git not available
    }
    
    pdca = new DefaultPDCA({ componentRoot: freshRepoDir });
    
    // When: Creating a PDCA in fresh repo
    await pdca.createPDCA('Test Fresh Repo', 'Verify fallback to TBD', undefined, false);
    
    // Then: Should fallback to TBD gracefully
    const files = fs.readdirSync(path.join(freshRepoDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    expect(files.length).toBe(1);
    
    const content = fs.readFileSync(path.join(freshRepoDir, 'session', files[0]), 'utf-8');
    
    // Should contain TBD as fallback
    expect(content).toContain('**📎 Previous Commit:** TBD - TBD');
  });

  /**
   * TC94: Handle Git Command Errors
   * Test that createPDCA doesn't crash if git command fails
   */
  it('TC94 should fallback to TBD if git command fails', async () => {
    // Given: A non-git directory
    const nonGitDir = path.join(testDataDir, 'non-git');
    fs.mkdirSync(nonGitDir, { recursive: true });
    fs.mkdirSync(path.join(nonGitDir, 'session'), { recursive: true });
    
    // Copy template to non-git dir
    const templateDir = path.join(nonGitDir, 'scrum.pmo/roles/_shared/PDCA');
    fs.mkdirSync(templateDir, { recursive: true });
    const templatePath = path.join(testDataDir, 'scrum.pmo/roles/_shared/PDCA/template.md');
    const nonGitTemplatePath = path.join(templateDir, 'template.md');
    fs.copyFileSync(templatePath, nonGitTemplatePath);
    
    pdca = new DefaultPDCA({ componentRoot: nonGitDir });
    
    // When: Creating a PDCA without git (should not throw)
    await expect(async () => {
      await pdca.createPDCA('Test No Git', 'Verify error handling', undefined, false);
    }).not.toThrow();
    
    // Then: Should fallback to TBD gracefully
    const files = fs.readdirSync(path.join(nonGitDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    expect(files.length).toBe(1);
    
    const content = fs.readFileSync(path.join(nonGitDir, 'session', files[0]), 'utf-8');
    
    // Should contain TBD as fallback (git command failed)
    expect(content).toContain('**📎 Previous Commit:** TBD - TBD');
  });

  /**
   * TC95: Verify Commit Format
   * Test that commit format matches expected pattern: "{sha} - {message}"
   */
  it('TC95 should use format "{sha} - {message}"', async () => {
    // Given: A git repository with commits
    pdca = new DefaultPDCA({ componentRoot: testDataDir });
    
    // When: Creating a PDCA
    await pdca.createPDCA('Test Commit Format', 'Verify format matches expectation', undefined, false);
    
    // Then: Format should match git log -1 --format="%h - %s"
    const files = fs.readdirSync(path.join(testDataDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    const content = fs.readFileSync(path.join(testDataDir, 'session', files[0]), 'utf-8');
    
    // Extract Previous Commit line
    const commitMatch = content.match(/\*\*📎 Previous Commit:\*\* (.+)/);
    expect(commitMatch).not.toBeNull();
    
    if (commitMatch) {
      const commitValue = commitMatch[1];
      
      // Should match pattern: 7-40 hex chars, space, dash, space, message
      expect(commitValue).toMatch(/^[a-f0-9]{7,40} - .+$/);
      
      // Should not be TBD
      expect(commitValue).not.toBe('TBD - TBD');
    }
  });
});

describe('PDCA createPDCA - Git Notes for Original Creation Time', () => {
  const currentFileUrl = new URL(import.meta.url);
  const testDir = path.dirname(currentFileUrl.pathname);
  const testDataDir = path.join(testDir, 'data', 'git-notes-tests');
  
  let pdca: DefaultPDCA;

  beforeEach(async () => {
    // Create isolated test environment
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDataDir, { recursive: true });

    // Initialize git repo
    const { execSync } = await import('child_process');
    execSync('git init', { cwd: testDataDir });
    execSync('git config user.email "test@example.com"', { cwd: testDataDir });
    execSync('git config user.name "Test User"', { cwd: testDataDir });

    // Create session directory
    const sessionDir = path.join(testDataDir, 'session');
    fs.mkdirSync(sessionDir, { recursive: true });

    // Create template
    const templateDir = path.join(testDataDir, 'scrum.pmo/roles/_shared/PDCA');
    fs.mkdirSync(templateDir, { recursive: true });
    const template = `# 📋 **PDCA Cycle: {{TITLE}}**

**🗓️ Date:** {{DATE}}
**🎯 Objective:** {{OBJECTIVE}}

## **📊 SUMMARY**
Test content

## **📋 PLAN**
Test content

## **🔧 DO**
Test content

## **✅ CHECK**
Test content

## **🎯 ACT**
Test content

## **💫 EMOTIONAL REFLECTION**
Test content

## **🎯 PDCA PROCESS UPDATE**
Test content
`;
    fs.writeFileSync(path.join(templateDir, 'template.md'), template);

    pdca = new DefaultPDCA();
    await pdca.init({ model: { componentRoot: testDataDir } });
  });

  afterEach(() => {
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  it('TC122: createPDCA stores original creation time in git note', async () => {
    // Given: A new PDCA is being created in isolated test directory
    const { execSync } = await import('child_process');
    const sessionDir = path.join(testDataDir, 'session');
    
    // When: Creating a PDCA with explicit sessionDirectory
    await pdca.createPDCA('Test Git Notes', 'Verify git note is created', sessionDir, false);
    
    // Then: File should be created
    const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.pdca.md'));
    expect(files.length).toBe(1);
    
    // Extract timestamp from filename
    const timestampMatch = files[0].match(/(\d{4}-\d{2}-\d{2}-UTC-\d{6})/);
    expect(timestampMatch).not.toBeNull();
    
    if (timestampMatch) {
      const expectedTimestamp = timestampMatch[1];
      
      // Add and commit the file (since createPDCA doesn't commit in test env)
      const filePath = path.join(sessionDir, files[0]);
      execSync(`git add session/${files[0]}`, { cwd: testDataDir });
      execSync(`git commit -m "Test commit"`, { cwd: testDataDir });
      
      // Add git note with original creation timestamp
      const noteAdded = await pdca.addCreationTimeNote(filePath);
      expect(noteAdded).toBe(true);
      
      // Get the commit SHA for the file
      const commitSha = execSync(
        `git log -1 --format=%H -- session/${files[0]}`,
        { cwd: testDataDir, encoding: 'utf-8' }
      ).trim();
      
      // Verify git note exists and contains correct timestamp
      const note = execSync(
        `git notes show ${commitSha}`,
        { cwd: testDataDir, encoding: 'utf-8' }
      ).trim();
      
      expect(note).toContain('original_creation_time:');
      expect(note).toContain(expectedTimestamp);
    }
  });

  it('TC123: rename now preserves git note', async () => {
    // Given: A PDCA with a git note
    const { execSync } = await import('child_process');
    const sessionDir = path.join(testDataDir, 'session');
    
    // Create PDCA
    await pdca.createPDCA('Test Preserve Note', 'Verify note survives rename', sessionDir, false);
    
    const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.pdca.md'));
    const originalFile = files[0];
    const originalFilePath = path.join(sessionDir, originalFile);
    const originalTimestamp = originalFile.match(/(\d{4}-\d{2}-\d{2}-UTC-\d{6})/)?.[1];
    
    // Commit the file and add git note
    execSync(`git add session/${originalFile}`, { cwd: testDataDir });
    execSync(`git commit -m "Add test PDCA"`, { cwd: testDataDir });
    await pdca.addCreationTimeNote(originalFilePath);
    
    // Verify note exists
    const originalCommitSha = execSync(
      `git log -1 --format=%H -- session/${originalFile}`,
      { cwd: testDataDir, encoding: 'utf-8' }
    ).trim();
    const originalNote = execSync(
      `git notes show ${originalCommitSha}`,
      { cwd: testDataDir, encoding: 'utf-8' }
    ).trim();
    expect(originalNote).toContain(`original_creation_time:${originalTimestamp}`);
    
    // When: Renaming with 'now' (this should copy the git note)
    await pdca.rename('now', originalFilePath, false);
    
    // Then: New file should have git note with ORIGINAL timestamp
    const newFiles = fs.readdirSync(sessionDir).filter(f => f.endsWith('.pdca.md'));
    expect(newFiles.length).toBe(1);
    
    const newCommitSha = execSync(
      `git log -1 --format=%H -- session/${newFiles[0]}`,
      { cwd: testDataDir, encoding: 'utf-8' }
    ).trim();
    
    const note = execSync(
      `git notes show ${newCommitSha}`,
      { cwd: testDataDir, encoding: 'utf-8' }
    ).trim();
    
    expect(note).toContain('original_creation_time:');
    expect(note).toContain(originalTimestamp!);
  });

  it('TC124: rename creationDate reads from git note', async () => {
    // Given: A PDCA created at T1, renamed to T2
    const { execSync } = await import('child_process');
    const sessionDir = path.join(testDataDir, 'session');
    
    // Create PDCA
    await pdca.createPDCA('Test Restore Time', 'Verify creationDate uses note', sessionDir, false);
    
    const files = fs.readdirSync(sessionDir).filter(f => f.endsWith('.pdca.md'));
    const originalFile = files[0];
    const originalFilePath = path.join(sessionDir, originalFile);
    const originalTimestamp = originalFile.match(/(\d{4}-\d{2}-\d{2}-UTC-\d{6})/)?.[1];
    
    // Commit the file and add git note
    execSync(`git add session/${originalFile}`, { cwd: testDataDir });
    execSync(`git commit -m "Add test PDCA"`, { cwd: testDataDir });
    await pdca.addCreationTimeNote(originalFilePath);
    
    // Wait 1 second to ensure timestamp changes
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    // Rename with 'now' (changes timestamp)
    await pdca.rename('now', originalFilePath, false);
    
    const renamedFiles = fs.readdirSync(sessionDir).filter(f => f.endsWith('.pdca.md'));
    const renamedFile = renamedFiles[0];
    const renamedFilePath = path.join(sessionDir, renamedFile);
    const newTimestamp = renamedFile.match(/(\d{4}-\d{2}-\d{2}-UTC-\d{6})/)?.[1];
    
    // Verify timestamp changed
    expect(newTimestamp).not.toBe(originalTimestamp);
    
    // When: Renaming with 'creationDate' (should read from git note)
    await pdca.rename('creationDate', renamedFilePath, false);
    
    // Then: Filename should be restored to ORIGINAL timestamp (from note)
    const restoredFiles = fs.readdirSync(sessionDir).filter(f => f.endsWith('.pdca.md'));
    const restoredFile = restoredFiles[0];
    const restoredTimestamp = restoredFile.match(/(\d{4}-\d{2}-\d{2}-UTC-\d{6})/)?.[1];
    
    expect(restoredTimestamp).toBe(originalTimestamp);
  });

  it.skip('TC125: Backward compatibility - files without notes', async () => {
    // Given: A file created WITHOUT git notes (legacy file)
    const { execSync } = await import('child_process');
    
    // Create file manually without git note
    const timestamp = '2025-11-05-UTC-120000';
    const filename = `${timestamp}.pdca.md`;
    const filePath = path.join(testDataDir, 'session', filename);
    fs.writeFileSync(filePath, '# Test PDCA\n\nTest content');
    
    execSync(`git add session/${filename}`, { cwd: testDataDir });
    execSync(`git commit -m "Add test file"`, { cwd: testDataDir });
    
    // Verify no note exists
    const commitSha = execSync(
      `git log -1 --format=%H -- session/${filename}`,
      { cwd: testDataDir, encoding: 'utf-8' }
    ).trim();
    
    let noteExists = false;
    try {
      execSync(`git notes show ${commitSha}`, { cwd: testDataDir, encoding: 'utf-8' });
      noteExists = true;
    } catch {
      // Expected - no note
    }
    expect(noteExists).toBe(false);
    
    // When: Renaming with 'creationDate'
    await pdca.rename('creationDate', filePath, false);
    
    // Then: Should fallback to git log (not crash)
    const files = fs.readdirSync(path.join(testDataDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    expect(files.length).toBe(1);
    // Filename should still have a valid timestamp
    expect(files[0]).toMatch(/\d{4}-\d{2}-\d{2}-UTC-\d{6}\.pdca\.md/);
  });

  it.skip('TC126: Note survives multiple renames', async () => {
    // Given: A PDCA created at T1
    const { execSync } = await import('child_process');
    await pdca.createPDCA('Test Multiple Renames', 'Verify note survives chain', undefined, false);
    
    const files = fs.readdirSync(path.join(testDataDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    const originalFile = files[0];
    const originalTimestamp = originalFile.match(/(\d{4}-\d{2}-\d{2}-UTC-\d{6})/)?.[1];
    
    // When: Multiple renames
    // 1. Rename with 'now' → T2
    await pdca.rename('now', path.join(testDataDir, 'session', originalFile), false);
    let currentFiles = fs.readdirSync(path.join(testDataDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    
    // 2. Rename with 'strip' → removes description
    await pdca.rename('strip', path.join(testDataDir, 'session', currentFiles[0]), false);
    currentFiles = fs.readdirSync(path.join(testDataDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    
    // 3. Rename with 'creationDate' → restore T1
    await pdca.rename('creationDate', path.join(testDataDir, 'session', currentFiles[0]), false);
    
    // Then: Filename should be restored to ORIGINAL timestamp
    const finalFiles = fs.readdirSync(path.join(testDataDir, 'session')).filter(f => f.endsWith('.pdca.md'));
    const finalFile = finalFiles[0];
    const finalTimestamp = finalFile.match(/(\d{4}-\d{2}-\d{2}-UTC-\d{6})/)?.[1];
    
    expect(finalTimestamp).toBe(originalTimestamp);
  });

  /**
   * TC127: Next PDCA link uses current git branch in GitHub URL
   * 
   * When createPDCA establishes bidirectional chains, the "Next PDCA" link
   * in the previous PDCA must use the current git branch in the GitHub URL,
   * not hardcoded 'main'.
   * 
   * Example:
   *  ❌ Wrong: blob/main/components/PDCA/...
   *  ✅ Right: blob/dev/2025-10-31-UTC-11-07/components/PDCA/...
   * 
   * Requirement: CMM3 4c - Links MUST be verifiable (same branch)
   * Pattern: Use getDualLink internally for branch-aware GitHub URLs
   */
  it('TC127: createPDCA Next PDCA link uses correct git branch in GitHub URL', async () => {
    const { execSync } = await import('child_process');
    const sessionDir = path.join(testDataDir, 'session');
    
    // Given: A git repository on a non-main branch
    execSync('git checkout -b test-branch-127', { cwd: testDataDir });
    const currentBranch = execSync('git branch --show-current', { 
      cwd: testDataDir, 
      encoding: 'utf-8' 
    }).trim();
    expect(currentBranch).toBe('test-branch-127');
    
    // Create first PDCA
    await pdca.createPDCA('First PDCA', 'Initial test', sessionDir, false);
    const files1 = fs.readdirSync(sessionDir).filter(f => f.endsWith('.pdca.md'));
    expect(files1.length).toBe(1);
    const firstPdcaPath = path.join(sessionDir, files1[0]);
    
    // When: Creating second PDCA (should update first PDCA's "Next PDCA" link)
    await pdca.createPDCA('Second PDCA', 'Next test', sessionDir, false);
    
    // Then: First PDCA's "Next PDCA" link should have correct branch in GitHub URL
    const firstPdcaContent = fs.readFileSync(firstPdcaPath, 'utf-8');
    const nextPdcaMatch = firstPdcaContent.match(/\*\*➡️ Next PDCA:\*\* \[GitHub\]\((https:\/\/github\.com\/[^)]+)\)/);
    
    expect(nextPdcaMatch).toBeTruthy();
    const githubUrl = nextPdcaMatch![1];
    
    // Verify GitHub URL contains current branch, not 'main'
    expect(githubUrl).toContain('blob/test-branch-127/');
    expect(githubUrl).not.toContain('blob/main/');
    
    // Verify complete URL structure (path varies by test environment)
    expect(githubUrl).toMatch(/https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/test-branch-127\//);
  });
});

