/**
 * @fileoverview Test suite for PDCA rewritePDCA feature
 * Tests the ability to replace corrupted PDCAs with fresh createPDCA-generated ones
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('PDCA rewritePDCA Tests', () => {
  let pdca: DefaultPDCA;
  let testDataDir: string;
  let corruptedPDCAPath: string;

  beforeEach(async () => {
    // Initialize PDCA component
    pdca = new DefaultPDCA();
    await pdca.init({
      model: {
        workingDirectory: path.join(__dirname, '..'),
        sessionDirectory: '',
        currentBranch: 'test-branch'
      }
    });

    // Create test data directory
    testDataDir = path.join(__dirname, 'temp-rewrite-test');
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDataDir, { recursive: true });

    // Create a corrupted PDCA file
    corruptedPDCAPath = path.join(testDataDir, '2025-11-03-UTC-1400.pdca.md');
    const corruptedContent = `# Corrupted PDCA
This PDCA is missing sections and has invalid structure.
It needs to be rewritten.`;
    fs.writeFileSync(corruptedPDCAPath, corruptedContent, 'utf-8');

    // Set session directory for tests
    pdca.model.sessionDirectory = testDataDir;

    // Create minimal template for testing
    const templateDir = path.join(__dirname, '..', 'scrum.pmo', 'roles', '_shared', 'PDCA');
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }
    const templatePath = path.join(templateDir, 'template.md');
    if (!fs.existsSync(templatePath)) {
      const minimalTemplate = `# 📋 **PDCA Cycle: {{TITLE}} - {{DESCRIPTION}}**

**🗓️ Date:** {{UTC_TIMESTAMP}}  
**🎯 Objective:** {{OBJECTIVE}}  
**🎯 Template Version:** 3.2.4.2  
**🏅 CMM Badge:** {{CMM_STATUS}} ({{BADGE_TYPE}} - Earned {{BADGE_TIMESTAMP}})  

**👤 Agent Name:** {{AGENT_NAME}} → {{AGENT_DESCRIPTION}}  
**👤 Agent Role:** {{ROLE_NAME}} → {{CONTEXT_SPECIALIZATION}}  
**👤 Branch:** {{BRANCH_NAME}} → {{BRANCH_PURPOSE}}  
**🔄 Sync Requirements:** {{SYNC_BRANCHES}} → {{SYNC_PURPOSE}}  
**🎯 Project Journal Session:** {{SESSION_NAME}} → {{CONTEXT_SPECIALIZATION}}
**🎯 Sprint:** {{SPRINT_NAME}} → {{CONTEXT_SPECIALIZATION}}
**✅ Task:** {{TASK_NAME}}  
**🚨 Issues:** {{KEY_ISSUES}}  

**📎 Previous Commit:** {{PREVIOUS_COMMIT_SHA}} - {{PREVIOUS_COMMIT_DESCRIPTION}}  
**🔗 Previous PDCA:** [GitHub]({{GITHUB_URL}}) | [§/scrum.pmo/project.journal/{{SESSION}}/{{FILENAME}}](../{{OTHER_SESSION}}/{{FILENAME}})  
**➡️ Next PDCA:** Use pdca chain

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub]({{GITHUB_URL}}) | [{{LOCAL_PATH}}]({{LOCAL_PATH}})

### **To TRON: QA Decisions required**

### **TRON Feedback ({{FEEDBACK_TIMESTAMP}})**

### **My Answer**

---

## **📋 PLAN**

**Objective:** {{PLAN_OBJECTIVE}}

---

## **🔧 DO**

---

## **✅ CHECK**

---

## **🎯 ACT**

**Success Achieved:** {{SUCCESS_SUMMARY}}

## **💫 EMOTIONAL REFLECTION: {{EMOTIONAL_HEADLINE}}**

---
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Must create PDCA documentation for all significant work

**Quality Impact:** TBD

**Next PDCA Focus:** TBD  

---

**🎯 Summary**

---

### **📚 The 42 Revelation**

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨`;
      fs.writeFileSync(templatePath, minimalTemplate, 'utf-8');
    }
  });

  afterEach(() => {
    // Clean up test data
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  // TC72: rewritePDCA creates new PDCA using createPDCA
  it('TC72: rewritePDCA - creates new PDCA using createPDCA', async () => {
    // Verify corrupted file exists before
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);
    const filesBefore = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));
    expect(filesBefore).toHaveLength(1);

    // Execute rewritePDCA
    await pdca.rewritePDCA(corruptedPDCAPath, 'Test Rewrite', 'Testing rewritePDCA feature');

    // Verify new PDCA was created
    const filesAfter = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));
    expect(filesAfter.length).toBeGreaterThan(0);
    
    // Find the newly created PDCA (will have current timestamp)
    const newPDCAFiles = filesAfter.filter(f => f !== path.basename(corruptedPDCAPath));
    expect(newPDCAFiles.length).toBeGreaterThan(0);
    
    // Verify new PDCA has template content
    const newPDCAPath = path.join(testDataDir, newPDCAFiles[0]);
    const newContent = fs.readFileSync(newPDCAPath, 'utf-8');
    expect(newContent).toContain('Test Rewrite');
    expect(newContent).toContain('Testing rewritePDCA feature');
    expect(newContent).toContain('📋 **PDCA Cycle:');
  });

  // TC73: rewritePDCA deletes original corrupted file
  it('TC73: rewritePDCA - deletes original corrupted file', async () => {
    // Verify corrupted file exists before
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);

    // Execute rewritePDCA
    await pdca.rewritePDCA(corruptedPDCAPath, 'Test Rewrite', 'Testing deletion');

    // Verify original corrupted file was deleted
    expect(fs.existsSync(corruptedPDCAPath)).toBe(false);
  });

  // TC74: rewritePDCA validates file path exists
  it('TC74: rewritePDCA - validates file path exists', async () => {
    const nonExistentPath = path.join(testDataDir, 'non-existent.pdca.md');

    // Should throw error for non-existent file
    await expect(
      pdca.rewritePDCA(nonExistentPath, 'Test', 'Test')
    ).rejects.toThrow();
  });

  // TC75: rewritePDCA throws error if file doesn't exist
  it('TC75: rewritePDCA - throws error if file does not exist', async () => {
    const invalidPath = path.join(testDataDir, 'invalid-path.pdca.md');

    await expect(
      pdca.rewritePDCA(invalidPath, 'Test Title', 'Test Objective')
    ).rejects.toThrow('not found');
  });

  // TC76: rewritePDCA dry run doesn't delete original
  it('TC76: rewritePDCA - dry run does not delete original', async () => {
    // Verify corrupted file exists before
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);
    const filesBefore = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));

    // Execute rewritePDCA with dry run
    await pdca.rewritePDCA(corruptedPDCAPath, 'Test Rewrite', 'Testing dry run', 'true');

    // Verify original file still exists
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);
    
    // Verify new file was still created (createPDCA respects dry run differently)
    const filesAfter = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));
    // In dry run, original should still be there
    expect(filesAfter).toContain(path.basename(corruptedPDCAPath));
  });

  // TC77: rewritePDCA preserves session directory structure
  it('TC77: rewritePDCA - preserves session directory structure', async () => {
    // Execute rewritePDCA
    await pdca.rewritePDCA(corruptedPDCAPath, 'Test Rewrite', 'Testing directory preservation');

    // Verify new PDCA is in same directory as original
    const filesAfter = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));
    expect(filesAfter.length).toBeGreaterThan(0);
    
    // Verify directory structure unchanged
    expect(fs.existsSync(testDataDir)).toBe(true);
    expect(fs.statSync(testDataDir).isDirectory()).toBe(true);
  });

  // TC78: rewritePDCA returns this for method chaining
  it('TC78: rewritePDCA - returns this for method chaining', async () => {
    const result = await pdca.rewritePDCA(corruptedPDCAPath, 'Test Rewrite', 'Testing chaining');

    // Verify returns this (DefaultPDCA instance)
    expect(result).toBe(pdca);
    expect(result).toBeInstanceOf(DefaultPDCA);
  });

  // TC79: rewritePDCA updates bidirectional links via createPDCA
  it('TC79: rewritePDCA - updates bidirectional links via createPDCA', async () => {
    // Create a pre-existing PDCA to establish chain (must be AFTER corrupted file to become "most recent")
    const existingPDCA = path.join(testDataDir, '2025-11-03-UTC-1430.pdca.md');
    const existingContent = `# Test PDCA

**➡️ Next PDCA:** Use pdca chain

## Test Content`;
    fs.writeFileSync(existingPDCA, existingContent, 'utf-8');

    // Corrupted file timestamp: 2025-11-03-UTC-1400.pdca.md (created in beforeEach)
    // Existing file timestamp: 2025-11-03-UTC-1430.pdca.md (newer, so it won't be updated)
    // New file will be created with current timestamp (~1436) and will update existing as "previous"
    
    // Execute rewritePDCA (should create new PDCA and update chain)
    await pdca.rewritePDCA(corruptedPDCAPath, 'Test Rewrite', 'Testing bidirectional links');

    // The newly created PDCA should have a "Previous PDCA:" link to existing (1430)
    const filesAfter = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));
    // Should have: existing (1430) + new (~1436), corrupted (1400) was deleted
    expect(filesAfter.length).toBeGreaterThanOrEqual(2);
    
    // Find the newly created PDCA
    const newPDCAFiles = filesAfter.filter(f => f !== path.basename(existingPDCA));
    expect(newPDCAFiles.length).toBeGreaterThan(0);
    
    // Verify new PDCA has Previous PDCA link
    const newPDCAPath = path.join(testDataDir, newPDCAFiles[0]);
    const newContent = fs.readFileSync(newPDCAPath, 'utf-8');
    expect(newContent).toContain('**🔗 Previous PDCA:**');
    expect(newContent).toContain('2025-11-03-UTC-1430.pdca.md');
    
    // Verify existing PDCA was updated with "Next PDCA:" link
    const updatedExistingContent = fs.readFileSync(existingPDCA, 'utf-8');
    expect(updatedExistingContent).toMatch(/\*\*➡️ Next PDCA:\*\*.*\[GitHub\]/);
    expect(updatedExistingContent).toContain(newPDCAFiles[0]);
  });
});

