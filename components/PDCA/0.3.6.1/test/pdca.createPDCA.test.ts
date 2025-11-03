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

    // Then: PDCA file created with timestamp format YYYY-MM-DD-UTC-HHMM.pdca.md
    const files = fs.readdirSync(sessionDir);
    const pdcaFiles = files.filter(f => f.endsWith('.pdca.md'));
    
    expect(pdcaFiles.length).toBe(1);
    expect(pdcaFiles[0]).toMatch(/^\d{4}-\d{2}-\d{2}-UTC-\d{4}\.pdca\.md$/);
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
    
    // Filename should match current date
    const datePattern = /(\d{4})-(\d{2})-(\d{2})-UTC-(\d{4})/;
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
});

