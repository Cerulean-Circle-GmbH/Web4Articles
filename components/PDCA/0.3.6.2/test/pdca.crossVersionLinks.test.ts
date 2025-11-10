/**
 * PDCA Cross-Version Chain Linking Tests
 * 
 * Test PDCA chain links across component version boundaries:
 * 1. First PDCA in version links to last PDCA of previous version
 * 2. Last PDCA in version shows "N/A (Last in chain)" (not self-link)
 * 3. First PDCA in first version shows "N/A (First in chain)"
 * 
 * Requirements: 2025-11-10-UTC-140738.pdca.md
 * Pattern: Test-Driven Development (TDD) RED-GREEN-REFACTOR
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA.js';

describe('PDCA Cross-Version Chain Linking', () => {
  const currentFileUrl = new URL(import.meta.url);
  const testDir = path.dirname(currentFileUrl.pathname);
  const testDataDir = path.join(testDir, 'data', 'cross-version-tests');
  
  let pdca: DefaultPDCA;

  beforeEach(async () => {
    // Create test environment
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDataDir, { recursive: true });

    // Initialize git repo for test environment
    try {
      execSync('git init', { cwd: testDataDir, stdio: 'pipe' });
      execSync('git config user.email "test@example.com"', { cwd: testDataDir, stdio: 'pipe' });
      execSync('git config user.name "Test User"', { cwd: testDataDir, stdio: 'pipe' });
    } catch (error) {
      // Git init failed - tests will skip git operations
    }

    // Create PDCA instance
    pdca = new DefaultPDCA();
    pdca.model = {
      version: '0.3.6.2',
      component: 'TestComponent',
      componentRoot: testDataDir,
      projectRoot: testDataDir,
      currentBranch: 'test-branch',
      sessionRelative: '',
      packageJsonPath: '',
      toVersion: ''
    };
  });

  afterEach(() => {
    // Cleanup
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  /**
   * TC-CROSS-01: First PDCA in version links to previous version's last PDCA
   * 
   * Setup:
   * - Create TestComponent/0.3.15.0/session with 2 PDCAs
   * - Create TestComponent/0.3.16.0/session with 2 PDCAs
   * 
   * Expected:
   * - First PDCA in 0.3.16.0 should link to last PDCA in 0.3.15.0
   * - NOT show "N/A (First in chain)"
   */
  it('TC-CROSS-01: First PDCA links to previous version\'s last PDCA', () => {
    // Create version 0.3.15.0 with 2 PDCAs
    const v150Dir = path.join(testDataDir, 'TestComponent/0.3.15.0/session');
    fs.mkdirSync(v150Dir, { recursive: true });
    
    const v150_pdca1 = path.join(v150Dir, '2025-10-20-UTC-1000.pdca.md');
    const v150_pdca2 = path.join(v150Dir, '2025-10-20-UTC-1100.pdca.md');
    
    fs.writeFileSync(v150_pdca1, `# 📋 **PDCA Cycle: Test 1**
**🗓️ Date:** Sun, 20 Oct 2025 10:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** N/A (First in chain)
**➡️ Next PDCA:** TBD

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    fs.writeFileSync(v150_pdca2, `# 📋 **PDCA Cycle: Test 2**
**🗓️ Date:** Sun, 20 Oct 2025 11:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** [GitHub](url1) | [§/path](./2025-10-20-UTC-1000.pdca.md)
**➡️ Next PDCA:** N/A (Last in chain)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    // Create version 0.3.16.0 with 2 PDCAs
    const v160Dir = path.join(testDataDir, 'TestComponent/0.3.16.0/session');
    fs.mkdirSync(v160Dir, { recursive: true });
    
    const v160_pdca1 = path.join(v160Dir, '2025-10-24-UTC-1000.pdca.md');
    const v160_pdca2 = path.join(v160Dir, '2025-10-24-UTC-1100.pdca.md');
    
    fs.writeFileSync(v160_pdca1, `# 📋 **PDCA Cycle: Test 3**
**🗓️ Date:** Thu, 24 Oct 2025 10:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** N/A (First in chain)
**➡️ Next PDCA:** TBD

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    fs.writeFileSync(v160_pdca2, `# 📋 **PDCA Cycle: Test 4**
**🗓️ Date:** Thu, 24 Oct 2025 11:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** [GitHub](url2) | [§/path](./2025-10-24-UTC-1000.pdca.md)
**➡️ Next PDCA:** N/A (Last in chain)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    // Commit files to git for proper timestamp tracking
    try {
      execSync('git add -A', { cwd: testDataDir, stdio: 'pipe' });
      execSync('git commit -m "Initial PDCAs" --date="2025-10-24T10:00:00+0000"', { cwd: testDataDir, stdio: 'pipe' });
    } catch (error) {
      // Git operations failed - continue with test
    }

    // Run fixAllPDCAs or updateChainLinks on v160_pdca1
    // This should detect it's the first PDCA in this version and link to v150_pdca2
    pdca.model.componentRoot = v160Dir;
    pdca.model.sessionRelative = '.';
    
    // Call the chain link update logic
    // TODO: This will fail until implementation is complete (RED phase)
    // The implementation should:
    // 1. Detect v160_pdca1 is first in its session
    // 2. Find previous version session (0.3.15.0)
    // 3. Get last PDCA from previous version (v150_pdca2)
    // 4. Update v160_pdca1's Previous PDCA link to point to v150_pdca2
    
    // Read the result
    const content = fs.readFileSync(v160_pdca1, 'utf-8');
    
    // Assert: Should link to previous version's last PDCA
    expect(content).toMatch(/Previous PDCA:.*2025-10-20-UTC-1100\.pdca\.md/);
    expect(content).not.toContain('N/A (First in chain)');
  });

  /**
   * TC-CROSS-02: Last PDCA shows "N/A (Last in chain)" (not self-link)
   * 
   * Setup:
   * - Create TestComponent/0.3.16.0/session with 2 PDCAs
   * - Simulate self-referential Next link in last PDCA
   * 
   * Expected:
   * - Last PDCA should show "N/A (Last in chain)" or blank
   * - NOT link to itself
   */
  it('TC-CROSS-02: Last PDCA shows "N/A (Last in chain)" (not self-link)', () => {
    // Create version 0.3.16.0 with 2 PDCAs
    const v160Dir = path.join(testDataDir, 'TestComponent/0.3.16.0/session');
    fs.mkdirSync(v160Dir, { recursive: true });
    
    const v160_pdca1 = path.join(v160Dir, '2025-10-24-UTC-1000.pdca.md');
    const v160_pdca2 = path.join(v160Dir, '2025-10-24-UTC-1100.pdca.md');
    
    fs.writeFileSync(v160_pdca1, `# 📋 **PDCA Cycle: Test 1**
**🗓️ Date:** Thu, 24 Oct 2025 10:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** N/A (First in chain)
**➡️ Next PDCA:** [GitHub](url) | [§/path](./2025-10-24-UTC-1100.pdca.md)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    fs.writeFileSync(v160_pdca2, `# 📋 **PDCA Cycle: Test 2**
**🗓️ Date:** Thu, 24 Oct 2025 11:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** [GitHub](url) | [§/path](./2025-10-24-UTC-1000.pdca.md)
**➡️ Next PDCA:** [GitHub](url) | [§/path](./2025-10-24-UTC-1100.pdca.md)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    // Commit files
    try {
      execSync('git add -A', { cwd: testDataDir, stdio: 'pipe' });
      execSync('git commit -m "Initial PDCAs" --date="2025-10-24T11:00:00+0000"', { cwd: testDataDir, stdio: 'pipe' });
    } catch (error) {
      // Continue
    }

    // Run chain link update
    pdca.model.componentRoot = v160Dir;
    pdca.model.sessionRelative = '.';
    
    // TODO: This will fail until implementation (RED phase)
    // Implementation should:
    // 1. Detect v160_pdca2 is last in its session
    // 2. Check if Next PDCA links to itself
    // 3. Replace self-link with "N/A (Last in chain)"
    
    // Read result
    const content = fs.readFileSync(v160_pdca2, 'utf-8');
    
    // Assert: Should NOT link to itself
    expect(content).toMatch(/Next PDCA:.*N\/A.*Last in chain/);
    expect(content).not.toMatch(/Next PDCA:.*2025-10-24-UTC-1100\.pdca\.md/);
  });

  /**
   * TC-CROSS-03: First PDCA in first version shows "N/A (First in chain)"
   * 
   * Setup:
   * - Create TestComponent/0.3.1.0/session with 2 PDCAs (first version ever)
   * 
   * Expected:
   * - First PDCA should show "N/A (First in chain)"
   * - Because there's no previous version to link to
   */
  it('TC-CROSS-03: First PDCA in first version shows "N/A (First in chain)"', () => {
    // Create version 0.3.1.0 (first version) with 2 PDCAs
    const v010Dir = path.join(testDataDir, 'TestComponent/0.3.1.0/session');
    fs.mkdirSync(v010Dir, { recursive: true });
    
    const v010_pdca1 = path.join(v010Dir, '2025-10-01-UTC-1000.pdca.md');
    const v010_pdca2 = path.join(v010Dir, '2025-10-01-UTC-1100.pdca.md');
    
    fs.writeFileSync(v010_pdca1, `# 📋 **PDCA Cycle: Test 1**
**🗓️ Date:** Wed, 01 Oct 2025 10:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** N/A (First in chain)
**➡️ Next PDCA:** TBD

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    fs.writeFileSync(v010_pdca2, `# 📋 **PDCA Cycle: Test 2**
**🗓️ Date:** Wed, 01 Oct 2025 11:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** [GitHub](url) | [§/path](./2025-10-01-UTC-1000.pdca.md)
**➡️ Next PDCA:** N/A (Last in chain)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    // Commit files
    try {
      execSync('git add -A', { cwd: testDataDir, stdio: 'pipe' });
      execSync('git commit -m "Initial PDCAs" --date="2025-10-01T10:00:00+0000"', { cwd: testDataDir, stdio: 'pipe' });
    } catch (error) {
      // Continue
    }

    // Run chain link update
    pdca.model.componentRoot = v010Dir;
    pdca.model.sessionRelative = '.';
    
    // TODO: Implementation should:
    // 1. Detect v010_pdca1 is first in its session
    // 2. Try to find previous version session
    // 3. Find no previous version exists
    // 4. Keep "N/A (First in chain)" as-is
    
    // Read result
    const content = fs.readFileSync(v010_pdca1, 'utf-8');
    
    // Assert: Should still show "N/A (First in chain)"
    expect(content).toMatch(/Previous PDCA:.*N\/A.*First in chain/);
  });

  /**
   * TC-CROSS-04: createPDCA populates cross-version forward link
   * 
   * Setup:
   * - Create TestComponent/0.3.15.0/session with last PDCA
   * - Create first PDCA in TestComponent/0.3.16.0/session using createPDCA
   * 
   * Expected:
   * - Last PDCA in 0.3.15.0 gets its Next link updated to point to first PDCA in 0.3.16.0
   * - Bidirectional cross-version link established
   */
  it('TC-CROSS-04: createPDCA populates cross-version forward link', () => {
    // Create version 0.3.15.0 with 1 PDCA
    const v150Dir = path.join(testDataDir, 'TestComponent/0.3.15.0/session');
    fs.mkdirSync(v150Dir, { recursive: true });
    
    const v150_pdca1 = path.join(v150Dir, '2025-10-20-UTC-1000.pdca.md');
    
    fs.writeFileSync(v150_pdca1, `# 📋 **PDCA Cycle: Test 1**
**🗓️ Date:** Sun, 20 Oct 2025 10:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** N/A (First in chain)
**➡️ Next PDCA:** N/A (Last in chain)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    // Commit files
    try {
      execSync('git add -A', { cwd: testDataDir, stdio: 'pipe' });
      execSync('git commit -m "Initial PDCA" --date="2025-10-20T10:00:00+0000"', { cwd: testDataDir, stdio: 'pipe' });
    } catch (error) {
      // Continue
    }

    // Create version 0.3.16.0 directory
    const v160Dir = path.join(testDataDir, 'TestComponent/0.3.16.0/session');
    fs.mkdirSync(v160Dir, { recursive: true });

    // TODO: Call createPDCA to create first PDCA in 0.3.16.0
    // This should:
    // 1. Create new PDCA in 0.3.16.0/session
    // 2. Detect it's the first in this version
    // 3. Link backward to v150_pdca1
    // 4. Update v150_pdca1's Next link to point forward
    
    // For now, simulate what createPDCA should do:
    const v160_pdca1 = path.join(v160Dir, '2025-10-24-UTC-1000.pdca.md');
    fs.writeFileSync(v160_pdca1, `# 📋 **PDCA Cycle: Test 2**
**🗓️ Date:** Thu, 24 Oct 2025 10:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** [GitHub](url) | [§/../0.3.15.0/session/2025-10-20-UTC-1000.pdca.md](../0.3.15.0/session/2025-10-20-UTC-1000.pdca.md)
**➡️ Next PDCA:** N/A (Last in chain)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    // Read v150_pdca1 after createPDCA
    const v150Content = fs.readFileSync(v150_pdca1, 'utf-8');
    
    // Assert: Previous version's last PDCA should now link forward
    expect(v150Content).toMatch(/Next PDCA:.*2025-10-24-UTC-1000\.pdca\.md/);
    expect(v150Content).not.toContain('N/A (Last in chain)');
    
    // Assert: New version's first PDCA should link backward
    const v160Content = fs.readFileSync(v160_pdca1, 'utf-8');
    expect(v160Content).toMatch(/Previous PDCA:.*2025-10-20-UTC-1000\.pdca\.md/);
  });

  /**
   * TC-CROSS-05: fixAllPDCAs handles cross-version links
   * 
   * Setup:
   * - Create TestComponent/0.3.15.0/session and 0.3.16.0/session with broken links
   * - Run fixAllPDCAs on both sessions
   * 
   * Expected:
   * - Cross-version links correctly established
   * - Within-version links also correct
   */
  it('TC-CROSS-05: fixAllPDCAs handles cross-version links', () => {
    // Create version 0.3.15.0 with 2 PDCAs
    const v150Dir = path.join(testDataDir, 'TestComponent/0.3.15.0/session');
    fs.mkdirSync(v150Dir, { recursive: true });
    
    const v150_pdca1 = path.join(v150Dir, '2025-10-20-UTC-1000.pdca.md');
    const v150_pdca2 = path.join(v150Dir, '2025-10-20-UTC-1100.pdca.md');
    
    // Broken links in 0.3.15.0
    fs.writeFileSync(v150_pdca1, `# 📋 **PDCA Cycle: Test 1**
**🗓️ Date:** Sun, 20 Oct 2025 10:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** N/A (First in chain)
**➡️ Next PDCA:** Use \`pdca chain\`

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    fs.writeFileSync(v150_pdca2, `# 📋 **PDCA Cycle: Test 2**
**🗓️ Date:** Sun, 20 Oct 2025 11:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** Use \`pdca chain\`
**➡️ Next PDCA:** N/A (Last in chain)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    // Create version 0.3.16.0 with 2 PDCAs
    const v160Dir = path.join(testDataDir, 'TestComponent/0.3.16.0/session');
    fs.mkdirSync(v160Dir, { recursive: true });
    
    const v160_pdca1 = path.join(v160Dir, '2025-10-24-UTC-1000.pdca.md');
    const v160_pdca2 = path.join(v160Dir, '2025-10-24-UTC-1100.pdca.md');
    
    // Broken links in 0.3.16.0
    fs.writeFileSync(v160_pdca1, `# 📋 **PDCA Cycle: Test 3**
**🗓️ Date:** Thu, 24 Oct 2025 10:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** N/A (First in chain)
**➡️ Next PDCA:** Use \`pdca chain\`

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    fs.writeFileSync(v160_pdca2, `# 📋 **PDCA Cycle: Test 4**
**🗓️ Date:** Thu, 24 Oct 2025 11:00:00 GMT
**🎯 Template Version:** 3.2.4.2
**🔗 Previous PDCA:** Use \`pdca chain\`
**➡️ Next PDCA:** [GitHub](url) | [§/path](./2025-10-24-UTC-1100.pdca.md)

## **📊 SUMMARY**
## **📋 PLAN**
## **🔧 DO**
## **✅ CHECK**
## **🎯 ACT**
## **💫 EMOTIONAL REFLECTION: Test**
## **🎯 PDCA PROCESS UPDATE**
`);

    // Commit files
    try {
      execSync('git add -A', { cwd: testDataDir, stdio: 'pipe' });
      execSync('git commit -m "Initial PDCAs" --date="2025-10-24T11:00:00+0000"', { cwd: testDataDir, stdio: 'pipe' });
    } catch (error) {
      // Continue
    }

    // TODO: Run fixAllPDCAs on both sessions
    // This should:
    // 1. Fix within-version links in 0.3.15.0
    // 2. Fix within-version links in 0.3.16.0
    // 3. Establish cross-version link from v150_pdca2 to v160_pdca1
    // 4. Update v160_pdca1's Previous link to v150_pdca2
    // 5. Fix self-link in v160_pdca2
    
    // Read results
    const v150_pdca1_content = fs.readFileSync(v150_pdca1, 'utf-8');
    const v150_pdca2_content = fs.readFileSync(v150_pdca2, 'utf-8');
    const v160_pdca1_content = fs.readFileSync(v160_pdca1, 'utf-8');
    const v160_pdca2_content = fs.readFileSync(v160_pdca2, 'utf-8');
    
    // Assert: Within-version links correct in 0.3.15.0
    expect(v150_pdca1_content).toMatch(/Next PDCA:.*2025-10-20-UTC-1100\.pdca\.md/);
    expect(v150_pdca2_content).toMatch(/Previous PDCA:.*2025-10-20-UTC-1000\.pdca\.md/);
    
    // Assert: Cross-version link from 0.3.15.0 to 0.3.16.0
    expect(v150_pdca2_content).toMatch(/Next PDCA:.*2025-10-24-UTC-1000\.pdca\.md/);
    expect(v160_pdca1_content).toMatch(/Previous PDCA:.*2025-10-20-UTC-1100\.pdca\.md/);
    
    // Assert: Within-version links correct in 0.3.16.0
    expect(v160_pdca1_content).toMatch(/Next PDCA:.*2025-10-24-UTC-1100\.pdca\.md/);
    expect(v160_pdca2_content).toMatch(/Previous PDCA:.*2025-10-24-UTC-1000\.pdca\.md/);
    
    // Assert: Last PDCA doesn't link to itself
    expect(v160_pdca2_content).toMatch(/Next PDCA:.*N\/A.*Last in chain/);
    expect(v160_pdca2_content).not.toMatch(/Next PDCA:.*2025-10-24-UTC-1100\.pdca\.md/);
  });
});

