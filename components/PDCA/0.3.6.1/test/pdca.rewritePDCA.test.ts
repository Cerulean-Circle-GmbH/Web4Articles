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

  // ========================================
  // OPTION B: SMART CONTENT PRESERVATION TESTS (Always Preserve)
  // ========================================

  // TC-PRESERVE-01: Valid DO section is preserved during rewrite
  it('TC-PRESERVE-01: Preserves valid DO section content automatically', async () => {
    // Setup: Create corrupted PDCA with valid DO section but missing PLAN
    const preserveTestPath = path.join(testDataDir, '2025-11-04-UTC-1030.pdca.md');
    const validDOContent = `**Implementation Steps:**
1. Created extractSections() helper method
2. Created isValidContent() validation logic
3. Created mergeSections() content merger
4. Enhanced rewritePDCA to call helpers

This is valid content with over 50 characters and minimal placeholders.`;

    const corruptedWithValidDO = `# 📋 **PDCA Cycle: Test Preservation - Test Preservation**

**🗓️ Date:** Tue, 04 Nov 2025 10:30:00 GMT  
**🎯 Objective:** Test that valid content is preserved  
**🎯 Template Version:** 3.2.4.2  

## **📋 PLAN**

CORRUPTED PLAN SECTION

---

## **🔧 DO**

${validDOContent}

---

## **✅ CHECK**

MISSING CHECK SECTION`;

    fs.writeFileSync(preserveTestPath, corruptedWithValidDO, 'utf-8');

    // Action: rewritePDCA (Option B always preserves)
    await pdca.rewritePDCA(preserveTestPath);

    // Assert: Valid DO section content should be preserved
    const rewrittenContent = fs.readFileSync(preserveTestPath, 'utf-8');
    expect(rewrittenContent).toContain('Implementation Steps');
    expect(rewrittenContent).toContain('extractSections() helper method');
    expect(rewrittenContent).toContain('This is valid content with over 50 characters');
  });

  // TC-PRESERVE-02: Invalid CHECK section is preserved in recovery (zero data loss)
  it('TC-PRESERVE-02: Preserves invalid CHECK section in recovery section (zero data loss)', async () => {
    // Setup: Create corrupted PDCA with explicitly invalid CHECK section
    const resetTestPath = path.join(testDataDir, '2025-11-04-UTC-1031.pdca.md');
    const corruptedWithInvalidCheck = `# 📋 **PDCA Cycle: Test Reset - Test Reset**

**🗓️ Date:** Tue, 04 Nov 2025 10:31:00 GMT  
**🎯 Objective:** Test that invalid content is reset  
**🎯 Template Version:** 3.2.4.2  

## **📋 PLAN**

Valid plan content here with sufficient length to pass validation.

---

## **🔧 DO**

Valid DO content here with sufficient length to pass validation.

---

## **✅ CHECK**

MISSING CHECK SECTION

---`;

    fs.writeFileSync(resetTestPath, corruptedWithInvalidCheck, 'utf-8');

    // Action: rewritePDCA (Zero data loss: preserves all content)
    await pdca.rewritePDCA(resetTestPath);

    // Assert: Invalid content preserved in recovery section (zero data loss)
    const rewrittenContent = fs.readFileSync(resetTestPath, 'utf-8');
    expect(rewrittenContent).toContain('MISSING CHECK SECTION'); // Now preserved, not lost
    expect(rewrittenContent).toContain('🔍 RECOVERED CONTENT'); // In recovery section
    
    // Should still contain template CHECK structure
    expect(rewrittenContent).toContain('## **✅ CHECK**');
    expect(rewrittenContent).toContain('**Verification Results:**');
  });

  // TC-PRESERVE-03: Mixed content (zero data loss with valid + invalid)
  it('TC-PRESERVE-03: Preserves valid sections + invalid in recovery (zero data loss)', async () => {
    // Setup: Create PDCA with mixed content (some valid, some invalid)
    const mixedTestPath = path.join(testDataDir, '2025-11-04-UTC-1032.pdca.md');
    const validACTContent = `**Success Achieved:** Feature implementation complete with zero regressions!

**Code Quality Enhanced:**
- DRY principle applied with shared helper
- Clean separation of concerns
- Comprehensive test coverage

This is valid ACT content with sufficient length and minimal placeholders.`;

    const mixedContent = `# 📋 **PDCA Cycle: Mixed Test - Mixed Test**

**🗓️ Date:** Tue, 04 Nov 2025 10:32:00 GMT  
**🎯 Objective:** Test mixed content preservation  
**🎯 Template Version:** 3.2.4.2  

## **📋 PLAN**

CORRUPTED PLAN

---

## **🔧 DO**

Valid DO section with implementation details and sufficient length.

---

## **✅ CHECK**

Short.

---

## **🎯 ACT**

${validACTContent}

---`;

    fs.writeFileSync(mixedTestPath, mixedContent, 'utf-8');

    // Action: rewritePDCA
    await pdca.rewritePDCA(mixedTestPath);

    // Assert: Valid sections preserved in correct places, invalid in recovery (zero data loss)
    const rewrittenContent = fs.readFileSync(mixedTestPath, 'utf-8');
    
    // Valid DO section should be preserved in DO
    expect(rewrittenContent).toContain('Valid DO section with implementation details');
    
    // Valid ACT section should be preserved in ACT
    expect(rewrittenContent).toContain('**Success Achieved:**');
    expect(rewrittenContent).toContain('Feature implementation complete');
    expect(rewrittenContent).toContain('DRY principle applied');
    
    // Invalid content preserved in recovery section (zero data loss)
    expect(rewrittenContent).toContain('CORRUPTED PLAN'); // Now preserved, not lost
    expect(rewrittenContent).toContain('Short.'); // Now preserved, not lost
    expect(rewrittenContent).toContain('🔍 RECOVERED CONTENT');
    
    // Should still have template structure
    expect(rewrittenContent).toContain('**Verification Results:**');
  });

  // TC-PRESERVE-04: Demo PDCA validation (real-world test)
  it('TC-PRESERVE-04: Preserves valid DO section from demo PDCA (1011)', async () => {
    // Setup: Create a PDCA similar to the corrupted demo PDCA (1011)
    const demoTestPath = path.join(testDataDir, '2025-11-04-UTC-1011-demo.pdca.md');
    const validDemoContent = `**1. rename with now**

The \`rename now\` command updates a PDCA filename to the current UTC timestamp...

**2. rename with creationDate**

The \`rename creationDate\` command restores a PDCA filename to its original creation date...

This DO section has over 300 lines of comprehensive command documentation.`;

    const demoPDCA = `# 📋 **PDCA Cycle: Demo - Demo**

**🗓️ Date:** Tue, 04 Nov 2025 10:11:36 GMT  
**🎯 Objective:** Show PDCA commands  
**🎯 Template Version:** 3.2.4.2  

## **📋 PLAN**

CORRUPTED CONTENT

---

## **🔧 DO**

${validDemoContent}

---

## **✅ CHECK**

MISSING CHECK SECTION

---`;

    fs.writeFileSync(demoTestPath, demoPDCA, 'utf-8');

    // Action: rewritePDCA
    await pdca.rewritePDCA(demoTestPath);

    // Assert: Valid DO section with command documentation is preserved
    const rewrittenContent = fs.readFileSync(demoTestPath, 'utf-8');
    expect(rewrittenContent).toContain('rename with now');
    expect(rewrittenContent).toContain('rename with creationDate');
    expect(rewrittenContent).toContain('over 300 lines of comprehensive command documentation');
    
    // Invalid sections should be reset
    expect(rewrittenContent).not.toContain('CORRUPTED CONTENT');
    expect(rewrittenContent).not.toContain('MISSING CHECK SECTION');
  });

  // ========================================
  // ZERO DATA LOSS TESTS (TDD - New Requirements)
  // ========================================

  // TC150: rewritePDCA preserves content from sections with missing headers
  it('TC150: Preserves content from section with missing header (zero data loss)', async () => {
    // Setup: Create corrupted PDCA with content but missing ## header marker
    const tc150Path = path.join(testDataDir, '2025-11-06-UTC-0900.pdca.md');
    const actContentWithoutHeader = `**🎯 ACT** (CORRUPTION: Missing ## header markers)

**Success Achieved:** File populated and corrupted for rewritePDCA testing

Testing Improvements Enhanced:
- **Corruption Type 1:** Missing header markers (this section)
- **Corruption Type 2:** Invalid dual links  
- **Corruption Type 3:** Malformed code blocks

rewritePDCA Benefits:
- **Auto-Fix:** Should restore proper markdown structure
- **Validation:** Should detect and repair broken links`;

    const corrupted150 = `# 📋 **PDCA Cycle: TC150 Test - TC150 Test**

**🗓️ Date:** Wed, 06 Nov 2025 09:00:00 GMT  
**🎯 Objective:** Test content preservation from sections with missing headers  
**🎯 Template Version:** 3.2.4.2  

## **📋 PLAN**

Valid plan content here.

---

## **🔧 DO**

Valid DO content here.

---

## **✅ CHECK**

Valid CHECK content here.

---

${actContentWithoutHeader}

---`;

    fs.writeFileSync(tc150Path, corrupted150, 'utf-8');

    // Action: rewritePDCA
    await pdca.rewritePDCA(tc150Path);

    // Assert: Content from section without header MUST be preserved
    const rewritten = fs.readFileSync(tc150Path, 'utf-8');
    expect(rewritten).toContain('File populated and corrupted for rewritePDCA testing');
    expect(rewritten).toContain('Testing Improvements Enhanced');
    expect(rewritten).toContain('Corruption Type 1');
    expect(rewritten).toContain('Corruption Type 2');
    expect(rewritten).toContain('rewritePDCA Benefits');
    expect(rewritten).toContain('Auto-Fix');
    
    // Header should be fixed
    expect(rewritten).toContain('## **🎯 ACT**');
  });

  // TC151: rewritePDCA creates recovery section for unmappable content
  it('TC151: Creates recovery section for content that cannot be mapped', async () => {
    // Setup: Create PDCA with orphaned content that doesn't belong to any section
    const tc151Path = path.join(testDataDir, '2025-11-06-UTC-0901.pdca.md');
    const corrupted151 = `# 📋 **PDCA Cycle: TC151 Test - TC151 Test**

**🗓️ Date:** Wed, 06 Nov 2025 09:01:00 GMT  
**🎯 Objective:** Test recovery section creation  
**🎯 Template Version:** 3.2.4.2  

This is orphaned content at the top that doesn't belong to any section header.
It contains important information about the corruption scenario.
Multiple lines of valuable data that must not be lost.

## **📋 PLAN**

Valid plan.

---

Random content between sections that has no clear section home.
This could be notes, observations, or partial data.

## **🔧 DO**

Valid DO.

---`;

    fs.writeFileSync(tc151Path, corrupted151, 'utf-8');

    // Action: rewritePDCA
    await pdca.rewritePDCA(tc151Path);

    // Assert: Unmappable content preserved in recovery section
    const rewritten = fs.readFileSync(tc151Path, 'utf-8');
    expect(rewritten).toContain('orphaned content at the top');
    expect(rewritten).toContain('important information about the corruption scenario');
    expect(rewritten).toContain('Random content between sections');
    
    // Recovery section should exist
    expect(rewritten).toContain('🔍 RECOVERED CONTENT');
  });

  // TC152: rewritePDCA correctly maps recognized sections even without proper headers
  it('TC152: Maps recognized sections to correct locations in template', async () => {
    // Setup: Create PDCA with content that can be recognized by keywords
    const tc152Path = path.join(testDataDir, '2025-11-06-UTC-0902.pdca.md');
    const corrupted152 = `# 📋 **PDCA Cycle: TC152 Test - TC152 Test**

**🗓️ Date:** Wed, 06 Nov 2025 09:02:00 GMT  
**🎯 Objective:** Test smart section mapping  
**🎯 Template Version:** 3.2.4.2  

PLAN

**Objective:** This is clearly plan content

**Definition of Ready:**
- Item 1
- Item 2

DO

**Implementation:**
Step 1: Do this
Step 2: Do that

CHECK

**Verification Results:**
All tests passed successfully.

ACT

**Success Achieved:** Mission accomplished!`;

    fs.writeFileSync(tc152Path, corrupted152, 'utf-8');

    // Action: rewritePDCA
    await pdca.rewritePDCA(tc152Path);

    // Assert: Content mapped to correct sections
    const rewritten = fs.readFileSync(tc152Path, 'utf-8');
    
    // PLAN content should be in PLAN section
    const planMatch = rewritten.match(/## \*\*📋 PLAN\*\*([\s\S]*?)---/);
    expect(planMatch).toBeTruthy();
    expect(planMatch![0]).toContain('This is clearly plan content');
    expect(planMatch![0]).toContain('Definition of Ready');
    
    // DO content should be in DO section  
    const doMatch = rewritten.match(/## \*\*🔧 DO\*\*([\s\S]*?)---/);
    expect(doMatch).toBeTruthy();
    expect(doMatch![0]).toContain('Implementation');
    expect(doMatch![0]).toContain('Step 1: Do this');
    
    // CHECK content should be in CHECK section
    const checkMatch = rewritten.match(/## \*\*✅ CHECK\*\*([\s\S]*?)---/);
    expect(checkMatch).toBeTruthy();
    expect(checkMatch![0]).toContain('Verification Results');
    
    // ACT content should be in ACT section
    const actMatch = rewritten.match(/## \*\*🎯 ACT\*\*([\s\S]*?)(?:---|$)/);
    expect(actMatch).toBeTruthy();
    expect(actMatch![0]).toContain('Mission accomplished');
  });

  // TC153: rewritePDCA preserves ALL content (comprehensive zero data loss test)
  it('TC153: Preserves ALL content with zero data loss (comprehensive test)', async () => {
    // Setup: Create highly corrupted PDCA with valuable content scattered everywhere
    const tc153Path = path.join(testDataDir, '2025-11-06-UTC-0903.pdca.md');
    const corrupted153 = `# 📋 **PDCA Cycle: TC153 Comprehensive - TC153 Comprehensive**

**🗓️ Date:** Wed, 06 Nov 2025 09:03:00 GMT  
**🎯 Objective:** Comprehensive zero data loss test  

Important note at the top: UNIQUE_STRING_ALPHA_12345

## **📋 PLAN**

Valid plan with UNIQUE_STRING_BETA_67890

**🔧 DO** (missing ##)

DO content with UNIQUE_STRING_GAMMA_24680

Some orphaned text with UNIQUE_STRING_DELTA_13579

## **✅ CHECK**

CHECK content with UNIQUE_STRING_EPSILON_11111

Random insertion with UNIQUE_STRING_ZETA_22222

**🎯 ACT** (missing ##)

ACT content with UNIQUE_STRING_ETA_33333`;

    fs.writeFileSync(tc153Path, corrupted153, 'utf-8');

    // Action: rewritePDCA
    await pdca.rewritePDCA(tc153Path);

    // Assert: EVERY unique string must be present (zero data loss)
    const rewritten = fs.readFileSync(tc153Path, 'utf-8');
    
    const uniqueStrings = [
      'UNIQUE_STRING_ALPHA_12345',
      'UNIQUE_STRING_BETA_67890',
      'UNIQUE_STRING_GAMMA_24680',
      'UNIQUE_STRING_DELTA_13579',
      'UNIQUE_STRING_EPSILON_11111',
      'UNIQUE_STRING_ZETA_22222',
      'UNIQUE_STRING_ETA_33333'
    ];
    
    for (const uniqueString of uniqueStrings) {
      expect(rewritten).toContain(uniqueString);
    }
    
    // All headers should be properly formatted
    expect(rewritten).toContain('## **📋 PLAN**');
    expect(rewritten).toContain('## **🔧 DO**');
    expect(rewritten).toContain('## **✅ CHECK**');
    expect(rewritten).toContain('## **🎯 ACT**');
  });
});
