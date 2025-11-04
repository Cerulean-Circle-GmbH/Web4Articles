/**
 * @fileoverview Test suite for PDCA rewritePDCA feature
 * Tests the ability to rewrite corrupted PDCAs in-place with auto-extraction
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

    // Create a corrupted PDCA file with extractable title and objective
    corruptedPDCAPath = path.join(testDataDir, '2025-11-03-UTC-1400.pdca.md');
    const corruptedContent = `# 📋 **PDCA Cycle: Corrupted Test PDCA - Testing Extraction**

**🗓️ Date:** Mon, 03 Nov 2025 14:00:00 GMT  
**🎯 Objective:** Testing rewritePDCA extraction and in-place rewriting  
**🎯 Template Version:** 3.2.4.2  

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
**🔗 Previous PDCA:** {{PREVIOUS_PDCA_LINK}}  
**➡️ Next PDCA:** Use pdca chain

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub]({{GITHUB_URL}}) | [{{LOCAL_PATH}}]({{LOCAL_PATH}})
- **Changed Files:** [GitHub]({{GITHUB_URL}}) | [{{LOCAL_PATH}}]({{LOCAL_PATH}})
- **New Components:** [GitHub]({{GITHUB_URL}}) | [{{LOCAL_PATH}}]({{LOCAL_PATH}})
- **Requirements Created:** [GitHub]({{GITHUB_URL}}) | [{{LOCAL_PATH}}]({{LOCAL_PATH}})
- **Related Artifacts:** [GitHub]({{GITHUB_URL}}) | [{{LOCAL_PATH}}]({{LOCAL_PATH}})

### **To TRON: QA Decisions required**
**TEMPLATE VERIFICATION: Before using this template, verify it matches current 3.1.4.2 requirements exactly - no modifications or assumptions**
- [x] {{COMPLETED_DECISION}}: {{DECISION_DESCRIPTION}}
- [ ] {{PENDING_DECISION}}: {{DECISION_DESCRIPTION}}
- [ ] {{FOLLOWUP_REQUIRED}}: {{DECISION_DESCRIPTION}}

### **TRON Feedback ({{FEEDBACK_TIMESTAMP}})**
\`\`\`quote
{{VERBATIM_WORD_BY_WORD_USER_PROMPT_NO_REFORMULATION}}
{{PRESERVE_ALL_LINE_BREAKS_SPACING_NUMBERING}}
\`\`\`

### **My Answer**
{{IMMEDIATE_CHAT_RESPONSE_TO_FEEDBACK}}
{{EXPLANATION_OF_UNDERSTANDING_AND_ACTIONS}}

**Learning Applied:** {{KEY_INSIGHT_FROM_FEEDBACK}}

---

## **📋 PLAN**

**Objective:** {{PLAN_OBJECTIVE}}

**Requirements Traceability:** {{REQUIREMENT_UUID}}

**Implementation Strategy:**
- **{{STRATEGY_ELEMENT_1}}:** {{STRATEGY_DESCRIPTION_1}}
- **{{STRATEGY_ELEMENT_2}}:** {{STRATEGY_DESCRIPTION_2}}
- **{{STRATEGY_ELEMENT_3}}:** {{STRATEGY_DESCRIPTION_3}}

---

## **🔧 DO**

**{{DO_SECTION_TITLE}}**

---

## **✅ CHECK**

**Verification Results:**

**{{CHECK_CATEGORY_1}} ({{STATUS_1}})**
\`\`\`
{{VERIFICATION_OUTPUT_1}}
\`\`\`

---

## **🎯 ACT**

**Success Achieved:** {{SUCCESS_SUMMARY}}

---
`;
      fs.writeFileSync(templatePath, minimalTemplate, 'utf-8');
    }
  });

  afterEach(() => {
    // Clean up test data directory
    if (fs.existsSync(testDataDir)) {
      try {
        fs.rmSync(testDataDir, { recursive: true, force: true });
      } catch (err) {
        // Ignore cleanup errors
      }
    }
    
    // Clean up test template directory
    const templateDir = path.join(__dirname, '..', 'scrum.pmo');
    if (fs.existsSync(templateDir)) {
      try {
        fs.rmSync(templateDir, { recursive: true, force: true });
      } catch (err) {
        // Ignore cleanup errors
      }
    }
  });

  // TC72: rewritePDCA extracts title and objective from corrupted file
  it('TC72: rewritePDCA - extracts title and objective from corrupted file', async () => {
    // Verify corrupted file exists
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);

    // Execute rewritePDCA (no title/objective parameters - auto-extract)
    await pdca.rewritePDCA(corruptedPDCAPath);

    // Verify file still exists (in-place rewrite)
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);

    // Verify new content has extracted title and objective
    const newContent = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    expect(newContent).toContain('Corrupted Test PDCA'); // Extracted title
    expect(newContent).toContain('Testing rewritePDCA extraction and in-place rewriting'); // Extracted objective
    expect(newContent).toContain('📋 **PDCA Cycle:');
  });

  // TC73: rewritePDCA preserves original timestamp
  it('TC73: rewritePDCA - preserves original timestamp', async () => {
    const originalFilename = path.basename(corruptedPDCAPath);
    expect(originalFilename).toBe('2025-11-03-UTC-1400.pdca.md');

    // Execute rewritePDCA
    await pdca.rewritePDCA(corruptedPDCAPath);

    // Verify filename is unchanged (timestamp preserved)
    const filesAfter = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));
    expect(filesAfter).toContain(originalFilename);
    expect(filesAfter).toHaveLength(1); // Only one file (in-place rewrite)

    // Verify file still exists at original path
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);
  });

  // TC74: rewritePDCA validates file path exists
  it('TC74: rewritePDCA - validates file path exists', async () => {
    const nonExistentPath = path.join(testDataDir, 'non-existent.pdca.md');

    // Should throw error for non-existent file
    await expect(
      pdca.rewritePDCA(nonExistentPath)
    ).rejects.toThrow();
  });

  // TC75: rewritePDCA throws error if file doesn't exist
  it('TC75: rewritePDCA - throws error if file does not exist', async () => {
    const invalidPath = path.join(testDataDir, 'invalid-path.pdca.md');

    await expect(
      pdca.rewritePDCA(invalidPath)
    ).rejects.toThrow('not found');
  });

  // TC76: rewritePDCA dry run doesn't modify original
  it('TC76: rewritePDCA - dry run does not modify original', async () => {
    // Read original content before dry run
    const originalContent = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);

    // Execute rewritePDCA with dry run
    await pdca.rewritePDCA(corruptedPDCAPath, 'true');

    // Verify original file still exists
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);
    
    // Verify content is unchanged
    const contentAfter = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    expect(contentAfter).toBe(originalContent);
    
    // Verify only one file exists (no new files created)
    const filesAfter = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));
    expect(filesAfter).toHaveLength(1);
  });

  // TC77: rewritePDCA preserves session directory structure
  it('TC77: rewritePDCA - preserves session directory structure', async () => {
    // Execute rewritePDCA
    await pdca.rewritePDCA(corruptedPDCAPath);

    // Verify file is in same directory
    const filesAfter = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md'));
    expect(filesAfter).toHaveLength(1);
    expect(filesAfter[0]).toBe(path.basename(corruptedPDCAPath));

    // Verify file path is unchanged
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);
  });

  // TC78: rewritePDCA returns this for method chaining
  it('TC78: rewritePDCA - returns this for method chaining', async () => {
    const result = await pdca.rewritePDCA(corruptedPDCAPath);
    
    // Verify it returns the PDCA instance for chaining
    expect(result).toBe(pdca);
  });

  // TC79: rewritePDCA uses template-compliant structure
  it('TC79: rewritePDCA - uses template-compliant structure', async () => {
    // Execute rewritePDCA
    await pdca.rewritePDCA(corruptedPDCAPath);

    // Read rewritten content
    const rewrittenContent = fs.readFileSync(corruptedPDCAPath, 'utf-8');

    // Verify template structure is present
    expect(rewrittenContent).toContain('## **📊 SUMMARY**');
    expect(rewrittenContent).toContain('## **📋 PLAN**');
    expect(rewrittenContent).toContain('## **🔧 DO**');
    expect(rewrittenContent).toContain('## **✅ CHECK**');
    expect(rewrittenContent).toContain('## **🎯 ACT**');
    
    // Verify metadata is populated
    expect(rewrittenContent).toContain('Corrupted Test PDCA'); // Title
    expect(rewrittenContent).toContain('Testing rewritePDCA extraction and in-place rewriting'); // Objective
    expect(rewrittenContent).toContain('Claude Sonnet 4.5'); // Agent name
  });

  // TC86: rewritePDCA populates basic placeholders
  it('TC86: rewritePDCA - populates basic boilerplate placeholders', async () => {
    await pdca.rewritePDCA(corruptedPDCAPath);
    
    const content = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    
    // Verify NO unpopulated basic placeholders remain
    expect(content).not.toContain('{{CMM_STATUS}}');
    expect(content).not.toContain('{{AGENT_NAME}}');
    expect(content).not.toContain('{{BRANCH_NAME}}');
    expect(content).not.toContain('{{BRANCH_PURPOSE}}');
    expect(content).not.toContain('{{SESSION_NAME}}');
    expect(content).not.toContain('{{SPRINT_NAME}}');
    expect(content).not.toContain('{{TASK_NAME}}');
    expect(content).not.toContain('{{KEY_ISSUES}}');
    expect(content).not.toContain('{{DESCRIPTION}}');
    expect(content).not.toContain('{{BADGE_TYPE}}');
    expect(content).not.toContain('{{AGENT_DESCRIPTION}}');
    expect(content).not.toContain('{{ROLE_NAME}}');
    expect(content).not.toContain('{{CONTEXT_SPECIALIZATION}}');
    
    // Verify populated with sensible defaults
    expect(content).toContain('Claude Sonnet 4.5');
    expect(content).toContain('test-branch'); // From model
    expect(content).toContain('CMM3');
  });

  // TC87: rewritePDCA passes cmm3check violation 1k (metadata placeholders only)
  it('TC87: rewritePDCA - output has no unpopulated metadata placeholders', async () => {
    await pdca.rewritePDCA(corruptedPDCAPath);
    
    const content = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    
    // Check for metadata placeholders that SHOULD be populated by rewritePDCA
    // (Not AI-content placeholders like {{DO_SECTION_TITLE}}, {{VERBATIM_QA_FEEDBACK}}, etc.)
    const metadataPlaceholders = [
      '{{TITLE}}', '{{OBJECTIVE}}', '{{UTC_TIMESTAMP}}', '{{AGENT_NAME}}',
      '{{BRANCH_NAME}}', '{{SESSION_NAME}}', '{{SPRINT_NAME}}', '{{TASK_NAME}}',
      '{{KEY_ISSUES}}', '{{PREVIOUS_COMMIT_SHA}}', '{{PREVIOUS_COMMIT_DESCRIPTION}}',
      '{{PLAN_OBJECTIVE}}', '{{REQUIREMENT_UUID}}', '{{SUCCESS_SUMMARY}}',
      '{{DESCRIPTION}}', '{{CMM_STATUS}}', '{{BADGE_TYPE}}', '{{BADGE_TIMESTAMP}}',
      '{{AGENT_DESCRIPTION}}', '{{ROLE_NAME}}', '{{CONTEXT_SPECIALIZATION}}',
      '{{BRANCH_PURPOSE}}', '{{SYNC_BRANCHES}}', '{{SYNC_PURPOSE}}',
      '{{FEEDBACK_TIMESTAMP}}'
    ];
    
    // Verify none of these metadata placeholders remain
    for (const placeholder of metadataPlaceholders) {
      expect(content).not.toContain(placeholder);
    }
  });

  // TC88: rewritePDCA populates PLAN_OBJECTIVE
  it('TC88: rewritePDCA - populates PLAN_OBJECTIVE with extracted objective', async () => {
    await pdca.rewritePDCA(corruptedPDCAPath);
    
    const content = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    
    // Verify PLAN section has objective
    expect(content).toContain('**Objective:** Testing rewritePDCA extraction and in-place rewriting');
    expect(content).not.toContain('{{PLAN_OBJECTIVE}}');
  });

  // TC89: rewritePDCA DRY - reuses shared population helper
  it('TC89: rewritePDCA - reuses shared population helper (DRY)', async () => {
    // This test verifies the IMPLEMENTATION approach (DRY)
    // createPDCA and rewritePDCA should call the same helper: populateBoilerplateInternal()
    
    await pdca.rewritePDCA(corruptedPDCAPath);
    const rewriteContent = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    
    // Create a new PDCA for comparison
    await pdca.createPDCA('Test', 'Test objective');
    const newPDCAFiles = fs.readdirSync(testDataDir).filter(f => f.endsWith('.pdca.md') && f !== path.basename(corruptedPDCAPath));
    expect(newPDCAFiles.length).toBeGreaterThan(0);
    
    const newPDCAPath = path.join(testDataDir, newPDCAFiles[0]);
    const createContent = fs.readFileSync(newPDCAPath, 'utf-8');
    
    // Verify SAME placeholders are populated in both
    expect(rewriteContent).toContain('Claude Sonnet 4.5');
    expect(createContent).toContain('Claude Sonnet 4.5');
    expect(rewriteContent).not.toContain('{{AGENT_NAME}}');
    expect(createContent).not.toContain('{{AGENT_NAME}}');
    expect(rewriteContent).toContain('CMM3');
    expect(createContent).toContain('CMM3');
    expect(rewriteContent).not.toContain('{{CMM_STATUS}}');
    expect(createContent).not.toContain('{{CMM_STATUS}}');
  });

  // TC90: rewritePDCA populates Previous PDCA link
  it('TC90: rewritePDCA - populates Previous PDCA link correctly', async () => {
    await pdca.rewritePDCA(corruptedPDCAPath);
    
    const content = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    
    // Verify Previous PDCA link placeholder is replaced
    expect(content).not.toContain('{{PREVIOUS_PDCA_LINK}}');
    
    // Verify the Previous PDCA line specifically (not artifact links)
    // Should be "N/A - First PDCA" or actual dual link
    const previousPDCALineMatch = content.match(/\*\*🔗 Previous PDCA:\*\* (.+)/);
    expect(previousPDCALineMatch).toBeTruthy();
    
    const previousPDCAValue = previousPDCALineMatch![1];
    // Should NOT contain template placeholders in the Previous PDCA line
    expect(previousPDCAValue).not.toContain('{{GITHUB_URL}}');
    expect(previousPDCAValue).not.toContain('{{SESSION}}');
    expect(previousPDCAValue).not.toContain('{{FILENAME}}');
    
    // Should be either "N/A - First PDCA" OR a proper dual link
    expect(previousPDCAValue).toMatch(/(?:N\/A - First PDCA|GitHub.*\|.*§\/)/);
  });

  // TC91: rewritePDCA preserves filename timestamp but populates display timestamp
  it('TC91: rewritePDCA - preserves filename timestamp but populates display timestamp', async () => {
    await pdca.rewritePDCA(corruptedPDCAPath);
    
    const content = fs.readFileSync(corruptedPDCAPath, 'utf-8');
    
    // Verify filename is unchanged (2025-11-03-UTC-1400.pdca.md)
    expect(fs.existsSync(corruptedPDCAPath)).toBe(true);
    expect(path.basename(corruptedPDCAPath)).toBe('2025-11-03-UTC-1400.pdca.md');
    
    // Verify display timestamp is populated (not {{UTC_TIMESTAMP}})
    expect(content).not.toContain('{{UTC_TIMESTAMP}}');
    expect(content).toMatch(/\*\*🗓️ Date:\*\* \w{3}, \d{2} \w{3} \d{4}/); // e.g., "Mon, 03 Nov 2025"
  });
});
