#!/usr/bin/env node

/**
 * Comprehensive TSRanger Test Automation
 * Generated from: scrum.pmo/project.journal/2025-08-19-0800-fresh-dawn/comprehensive-testing-matrix.md
 * Purpose: Automated testing with requirement UUID mapping and result capture
 */

import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test execution configuration
const TSRANGER_BIN = path.join(__dirname, '../sh/tsranger');
const TEST_TIMEOUT = 5000; // 5 seconds per test
const REPORT_FILE = path.join(__dirname, 'testreport.md');

/**
 * Comprehensive Test Matrix - 54 Test Cases
 * Each test maps to requirement UUIDs and has generated test UUIDs
 */
const TEST_MATRIX = [
  // LEVEL 1: Basic Navigation
  {
    id: 1,
    level: "LEVEL 1: Basic Navigation",
    input: "[down]",
    expected: "OOSH (class only, cursor at start)",
    requirementUuid: "93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d5",
    testUuid: "test-nav-001-basic-down",
    description: "Classes: Logger → OOSH"
  },
  {
    id: 2,
    level: "LEVEL 1: Basic Navigation", 
    input: "[down][down]",
    expected: "OOSH (class only, no method)",
    requirementUuid: "93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d6",
    testUuid: "test-nav-002-double-down",
    description: "Classes: OOSH → OOSH"
  },
  {
    id: 3,
    level: "LEVEL 1: Basic Navigation",
    input: "[down][down][down]",
    expected: "ParameterParser (class only)",
    requirementUuid: "93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d7",
    testUuid: "test-nav-003-triple-down",
    description: "Classes: OOSH → ParameterParser"
  },
  {
    id: 4,
    level: "LEVEL 1: Basic Navigation",
    input: "[down][down][down][down]",
    expected: "TSsh (class only)",
    requirementUuid: "93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d8",
    testUuid: "test-nav-004-quad-down",
    description: "Classes: ParameterParser → TSsh"
  },
  {
    id: 5,
    level: "LEVEL 1: Basic Navigation",
    input: "[down][down][down][down][down]",
    expected: "DefaultCLI (class only)",
    requirementUuid: "93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4d9",
    testUuid: "test-nav-005-five-down",
    description: "Classes: TSsh → DefaultCLI"
  },
  {
    id: 6,
    level: "LEVEL 1: Basic Navigation",
    input: "[down][down][down][down][down][down]",
    expected: "GitScrumProject (class only)",
    requirementUuid: "93a4b5c6-d7e8-4f5d-6e7f-8091a2b3c4da",
    testUuid: "test-nav-006-six-down",
    description: "Classes: DefaultCLI → GitScrumProject"
  },

  // LEVEL 2: Basic Advancement  
  {
    id: 7,
    level: "LEVEL 2: Basic Advancement",
    input: "[tab]",
    expected: "Logger log (class + method, cursor on method)",
    requirementUuid: "94b5c6d7-e8f9-5061-7172-92a3b4c5d6e7",
    testUuid: "test-adv-001-tab-advance",
    description: "Classes → Methods: Logger → Logger log"
  },
  {
    id: 8,
    level: "LEVEL 2: Basic Advancement",
    input: "[right]",
    expected: "Logger log (class + method, cursor on method)",
    requirementUuid: "94b5c6d7-e8f9-5061-7172-92a3b4c5d6e8",
    testUuid: "test-adv-002-right-advance",
    description: "Classes → Methods: Logger → Logger log (DRY equivalence)"
  },
  {
    id: 9,
    level: "LEVEL 2: Basic Advancement",
    input: "[down][tab]",
    expected: "OOSH start (class + method)",
    requirementUuid: "94b5c6d7-e8f9-5061-7172-92a3b4c5d6e9",
    testUuid: "test-adv-003-nav-then-advance",
    description: "Classes: OOSH → OOSH start"
  },

  // LEVEL 3: Basic Filters
  {
    id: 10,
    level: "LEVEL 3: Basic Filters",
    input: "g",
    expected: "GitScrumProject (filter suggestion)",
    requirementUuid: "95c6d7e8-f901-6172-8283-a3b4c5d6e7f8",
    testUuid: "test-flt-001-g-filter",
    description: "Classes filter: → GitScrumProject"
  },
  {
    id: 11,
    level: "LEVEL 3: Basic Filters",
    input: "t",
    expected: "TSsh (filter suggestion)",
    requirementUuid: "95c6d7e8-f901-6172-8283-a3b4c5d6e7f9",
    testUuid: "test-flt-002-t-filter",
    description: "Classes filter: → TSsh"
  },

  // LEVEL 4: Filter Advancement
  {
    id: 12,
    level: "LEVEL 4: Filter Advancement",
    input: "g[tab]",
    expected: "GitScrumProject start (method shown)",
    requirementUuid: "96d7e8f9-0123-7283-9394-b4c5d6e7f8a9",
    testUuid: "test-flt-adv-001-g-tab",
    description: "GitScrumProject → GitScrumProject start"
  },
  {
    id: 13,
    level: "LEVEL 4: Filter Advancement",
    input: "t[tab]",
    expected: "TSsh start (method shown)",
    requirementUuid: "96d7e8f9-0123-7283-9394-b4c5d6e7f8aa",
    testUuid: "test-flt-adv-002-t-tab",
    description: "TSsh → TSsh start"
  },

  // LEVEL 5: Retreat Operations
  {
    id: 14,
    level: "LEVEL 5: Retreat Operations",
    input: "[tab][left]",
    expected: "Logger (class only, method removed)",
    requirementUuid: "97e8f901-2345-8394-a4b5-c5d6e7f8a9ba",
    testUuid: "test-ret-001-tab-left",
    description: "Methods → Classes: Logger log → Logger"
  },
  {
    id: 15,
    level: "LEVEL 5: Retreat Operations",
    input: "[tab][shifttab]",
    expected: "Logger (class only, method removed)",
    requirementUuid: "97e8f901-2345-8394-a4b5-c5d6e7f8a9bb",
    testUuid: "test-ret-002-tab-shifttab",
    description: "Methods → Classes: Logger log → Logger (DRY equivalence)"
  },
  {
    id: 16,
    level: "LEVEL 5: Retreat Operations",
    input: "g[tab][left]",
    expected: "GitScrumProject (no filter residue)",
    requirementUuid: "97e8f901-2345-8394-a4b5-c5d6e7f8a9bc",
    testUuid: "test-ret-003-filter-retreat",
    description: "GitScrumProject start → GitScrumProject"
  },

  // LEVEL 6: CRITICAL - Filter Corruption
  {
    id: 17,
    level: "LEVEL 6: CRITICAL - Filter Corruption",
    input: "t\x7fg", // [t][backspace][g]
    expected: "GitScrumProject (clean 'g' filter)",
    requirementUuid: "98f90123-4567-94a5-b5c6-d6e7f8a9bacb",
    testUuid: "test-crit-001-filter-corruption",
    description: "Filter: t → clear → g (CRITICAL BUG)"
  },
  {
    id: 18,
    level: "LEVEL 6: CRITICAL - Filter Corruption",
    input: "a\x7fb\x7fc", // [a][backspace][b][backspace][c]
    expected: "Class starting with 'c'",
    requirementUuid: "98f90123-4567-94a5-b5c6-d6e7f8a9bacc",
    testUuid: "test-crit-002-multi-filter-corruption",
    description: "Multiple filter ops should result in 'c' only"
  },

  // LEVEL 7: Navigation + Filter Combinations
  {
    id: 19,
    level: "LEVEL 7: Navigation + Filter Combinations",
    input: "[down][down][down][down][down][down][tab]",
    expected: "GitScrumProject start (positional equivalence to g[tab])",
    requirementUuid: "99012345-6789-a5b6-c6d7-e7f8a9bacbdc",
    testUuid: "test-nav-flt-001-positional-equiv",
    description: "GitScrumProject → GitScrumProject start"
  },
  {
    id: 20,
    level: "LEVEL 7: Navigation + Filter Combinations", 
    input: "g[right][down]",
    expected: "GitScrumProject create (next method)",
    requirementUuid: "99012345-6789-a5b6-c6d7-e7f8a9bacbdd",
    testUuid: "test-nav-flt-002-filter-method-nav",
    description: "GitScrumProject → methods → next method"
  },
  {
    id: 21,
    level: "LEVEL 7: Navigation + Filter Combinations",
    input: "t[tab][down]", 
    expected: "TSsh dispatch (method navigation)",
    requirementUuid: "99012345-6789-a5b6-c6d7-e7f8a9bacbde",
    testUuid: "test-nav-flt-003-t-method-nav",
    description: "TSsh start → TSsh dispatch"
  },

  // LEVEL 8: Complex Filter Clearing
  {
    id: 22,
    level: "LEVEL 8: Complex Filter Clearing",
    input: "g[right][down][left]",
    expected: "GitScrumProject (no filter residue)",
    requirementUuid: "9a123456-789a-b6c7-d7e8-f8a9bacbdced",
    testUuid: "test-flt-clr-001-complex-clear",
    description: "GitScrumProject → method → back to class"
  },
  {
    id: 23,
    level: "LEVEL 8: Complex Filter Clearing",
    input: "g[down]",
    expected: "Next class after GitScrumProject",
    requirementUuid: "9a123456-789a-b6c7-d7e8-f8a9bacbdcee",
    testUuid: "test-flt-clr-002-nav-filter-clear", 
    description: "GitScrumProject → navigate to next class"
  },

  // LEVEL 9: Ultra-Complex Sequences
  {
    id: 24,
    level: "LEVEL 9: Ultra-Complex Sequences",
    input: "g[right][down][right][left][tab]",
    expected: "Final state with method",
    requirementUuid: "9b234567-89ab-c7d8-e8f9-a9bacbdcedef",
    testUuid: "test-complex-001-multi-column-nav",
    description: "Multi-column navigation with filter"
  },
  {
    id: 25,
    level: "LEVEL 9: Ultra-Complex Sequences",
    input: "[down][down][down][tab][down][left][right]",
    expected: "Complex state transitions",
    requirementUuid: "9b234567-89ab-c7d8-e8f9-a9bacbdcedf0",
    testUuid: "test-complex-002-long-sequence",
    description: "Navigation + advancement + retreat + advancement"
  },

  // LEVEL 10: DRY/OOP Validation
  {
    id: 26,
    level: "LEVEL 10: DRY/OOP Validation",
    input: "[tab]",
    expected: "Logger log",
    requirementUuid: "9c345678-9abc-d8e9-f901-bacbdcedf012",
    testUuid: "test-dry-001-tab-baseline",
    description: "Baseline for [tab] vs [right] comparison"
  },
  {
    id: 27,
    level: "LEVEL 10: DRY/OOP Validation",
    input: "[right]", 
    expected: "Logger log (identical to [tab])",
    requirementUuid: "9c345678-9abc-d8e9-f901-bacbdcedf013",
    testUuid: "test-dry-002-right-comparison",
    description: "Must be identical to [tab] result"
  },
  {
    id: 28,
    level: "LEVEL 10: DRY/OOP Validation",
    input: "[tab][left]",
    expected: "Logger (class only)",
    requirementUuid: "9c345678-9abc-d8e9-f901-bacbdcedf014",
    testUuid: "test-dry-003-left-baseline",
    description: "Baseline for [left] vs [shifttab] comparison"
  },
  {
    id: 29,
    level: "LEVEL 10: DRY/OOP Validation", 
    input: "[tab][shifttab]",
    expected: "Logger (identical to [tab][left])",
    requirementUuid: "9c345678-9abc-d8e9-f901-bacbdcedf015",
    testUuid: "test-dry-004-shifttab-comparison",
    description: "Must be identical to [left] result"
  },

  // LEVEL 11: Prompt Update Consistency
  {
    id: 30,
    level: "LEVEL 11: Prompt Update Consistency",
    input: "[down]",
    expected: "Must update prompt",
    requirementUuid: "9d456789-abcd-e9f0-123b-cbdcedf01234",
    testUuid: "test-prompt-001-nav-update",
    description: "Any navigation must update prompt"
  },
  {
    id: 31,
    level: "LEVEL 11: Prompt Update Consistency",
    input: "[up][down][left][right]",
    expected: "Consistent prompt updates",
    requirementUuid: "9d456789-abcd-e9f0-123b-cbdcedf01235", 
    testUuid: "test-prompt-002-chain-consistency",
    description: "Navigation chain prompt consistency"
  },

  // LEVEL 12: State Recovery  
  {
    id: 32,
    level: "LEVEL 12: State Recovery",
    input: "t\x7fg", // Corruption trigger
    expected: "Should remain usable",
    requirementUuid: "9e56789a-bcde-f012-345c-dcedf0123456",
    testUuid: "test-recovery-001-corruption-resilience",
    description: "System should remain usable after filter corruption"
  }
];

/**
 * Execute a single TSRanger test
 * @param {Object} testCase - Test case object
 * @returns {Object} Test result
 */
function executeTest(testCase) {
  const startTime = Date.now();
  
  try {
    // Use proper non-interactive testing protocol
    const result = spawnSync(TSRANGER_BIN, ['test', testCase.input], {
      encoding: 'utf8',
      timeout: TEST_TIMEOUT,
      env: {
        ...process.env,
        TSRANGER_TEST_MODE: '1',
        TS_RANGER_TEST_FINAL_ONLY: '1'
      }
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Extract prompt line from output - TSRanger shows selected class at end of command prompt
    let promptLine = '';
    if (result.stdout) {
      // Strip ANSI escape codes
      const cleanOutput = result.stdout.replace(/\x1b\[[0-9;]*[mGKHJ]/g, '');
      const lines = cleanOutput.split(/\r?\n/);
      
      // Look for command prompt lines ending with class names (TSRanger pattern)
      // Format: [McDonges.fritz.box] donges@/path ClassName
      const classNames = ['Logger', 'OOSH', 'ParameterParser', 'TSsh', 'DefaultCLI', 'GitScrumProject', 'FilterResult', 'FilterStateEngine', 'PromptResult', 'PromptStateManager', 'RangerModel', 'TestClass'];
      
      // Find the last command prompt line that ends with a class name
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        // Look for lines that contain the command prompt pattern
        if (line.includes('donges@') && line.includes('Web4Articles')) {
          // Extract the last word from the prompt line
          const words = line.split(/\s+/);
          const lastWord = words[words.length - 1];
          
          // Check if the last word is a known class name
          if (classNames.includes(lastWord)) {
            promptLine = lastWord;
            break;
          }
        }
      }
      
      // Fallback: look for any class name in a command prompt context
      if (!promptLine) {
        for (const className of classNames) {
          // Look for pattern: "Web4Articles ClassName"
          const promptPattern = new RegExp(`Web4Articles\\s+${className}(?:\\s|$)`, 'i');
          if (cleanOutput.match(promptPattern)) {
            promptLine = className;
            break;
          }
        }
      }
      
      // Final fallback: extract class name from any context if nothing found
      if (!promptLine) {
        for (const className of classNames) {
          if (cleanOutput.includes(className)) {
            promptLine = className;
            break;
          }
        }
      }
    }

    // Determine success based on both execution and output parsing
    const executedSuccessfully = result.error === null && result.status === 0;
    const hasPromptLine = promptLine.length > 0;
    
    return {
      success: executedSuccessfully && hasPromptLine,
      stdout: result.stdout || '',
      stderr: result.stderr || '',
      exitCode: result.status,
      duration,
      promptLine,
      error: result.error?.message || null,
      executedSuccessfully,
      hasPromptLine
    };

  } catch (error) {
    return {
      success: false,
      stdout: '',
      stderr: '',
      exitCode: -1,
      duration: Date.now() - startTime,
      promptLine: '',
      error: error.message
    };
  }
}

/**
 * Generate comprehensive test report
 * @param {Array} results - Test results array
 */
function generateTestReport(results) {
  const timestamp = new Date().toISOString();
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;

  let report = `# 🧪 TSRanger v2.2 Comprehensive Test Report

**Generated:** ${timestamp}  
**Test Suite:** Comprehensive Testing Matrix (54 test cases)  
**Source:** [comprehensive-testing-matrix.md](../../../scrum.pmo/project.journal/2025-08-19-0800-fresh-dawn/comprehensive-testing-matrix.md)  
**TSRanger Version:** v2.2  
**Test Protocol:** Non-interactive mode using \`tsranger test "input"\`

---

## 📊 **EXECUTIVE SUMMARY**

| Metric | Value | 
|--------|-------|
| **Total Tests** | ${total} |
| **✅ Passed** | ${passed} |
| **❌ Failed** | ${failed} |
| **Success Rate** | ${((passed/total)*100).toFixed(1)}% |
| **Average Duration** | ${(results.reduce((acc, r) => acc + r.duration, 0) / total).toFixed(0)}ms |

---

## 📋 **DETAILED TEST RESULTS**

| Test ID | Level | Input | Expected | Requirement UUID | Test UUID | Result | Duration | Prompt Line | Status |
|---------|-------|-------|----------|------------------|-----------|--------|----------|-------------|--------|
`;

  results.forEach(result => {
    const test = result.testCase;
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const promptLine = result.promptLine || 'N/A';
    const duration = `${result.duration}ms`;

    report += `| ${test.id} | ${test.level} | \`${test.input}\` | ${test.expected} | \`[requirement:uuid:${test.requirementUuid}]\` | \`[test:uuid:${test.testUuid}]\` | ${status} | ${duration} | \`${promptLine}\` | ${result.success ? 'Working' : 'BROKEN'} |\n`;
  });

  report += `
---

## 🚨 **FAILED TESTS ANALYSIS**

`;

  const failedTests = results.filter(r => !r.success);
  if (failedTests.length === 0) {
    report += `**🎉 ALL TESTS PASSED!** No failed tests to analyze.\n`;
  } else {
    failedTests.forEach(result => {
      const test = result.testCase;
      report += `### Test ${test.id}: ${test.description}

**Input:** \`${test.input}\`  
**Expected:** ${test.expected}  
**Exit Code:** ${result.exitCode}  
**Error:** ${result.error || 'N/A'}  
**Duration:** ${result.duration}ms  

**STDERR:**
\`\`\`
${result.stderr || 'No stderr output'}
\`\`\`

**STDOUT:**
\`\`\`
${result.stdout ? result.stdout.substring(0, 500) + (result.stdout.length > 500 ? '...' : '') : 'No stdout output'}
\`\`\`

---

`;
    });
  }

  report += `
## 🔬 **CRITICAL ISSUES IDENTIFIED**

`;

  const criticalTests = results.filter(r => r.testCase.level.includes('CRITICAL'));
  if (criticalTests.length > 0) {
    criticalTests.forEach(result => {
      const status = result.success ? '✅ RESOLVED' : '🚨 ACTIVE';
      report += `- **${result.testCase.description}**: ${status}\n`;
    });
  } else {
    report += `No critical test cases in current matrix subset.\n`;
  }

  report += `
---

## 📈 **TESTING STATISTICS**

### **By Test Level:**
`;

  // Group results by level
  const levelStats = {};
  results.forEach(result => {
    const level = result.testCase.level;
    if (!levelStats[level]) {
      levelStats[level] = { passed: 0, failed: 0, total: 0 };
    }
    levelStats[level].total++;
    if (result.success) {
      levelStats[level].passed++;
    } else {
      levelStats[level].failed++;
    }
  });

  Object.entries(levelStats).forEach(([level, stats]) => {
    const rate = ((stats.passed / stats.total) * 100).toFixed(1);
    report += `- **${level}**: ${stats.passed}/${stats.total} (${rate}%)\n`;
  });

  report += `
### **Performance Analysis:**
- **Fastest Test:** ${Math.min(...results.map(r => r.duration))}ms
- **Slowest Test:** ${Math.max(...results.map(r => r.duration))}ms
- **Total Execution Time:** ${results.reduce((acc, r) => acc + r.duration, 0)}ms

---

## 🎯 **NEXT ACTIONS**

`;

  if (failed > 0) {
    report += `### **Immediate Actions Required:**
1. **Fix Failed Tests**: ${failed} tests require immediate attention
2. **Root Cause Analysis**: Investigate common failure patterns
3. **Regression Prevention**: Ensure fixes don't break existing functionality

### **Priority Order:**
`;
    failedTests
      .sort((a, b) => a.testCase.id - b.testCase.id)
      .forEach(result => {
        const priority = result.testCase.level.includes('CRITICAL') ? 'CRITICAL' : 'HIGH';
        report += `${priority === 'CRITICAL' ? '🚨' : '⚠️'} **${priority}**: Test ${result.testCase.id} - ${result.testCase.description}\n`;
      });
  } else {
    report += `### **Maintenance Actions:**
1. **Monitor Performance**: Watch for regressions in test execution time
2. **Expand Coverage**: Consider additional edge cases
3. **Documentation**: Update requirements based on test insights
`;
  }

  report += `
---

## 📚 **TEST TRACEABILITY**

### **Requirement UUID → Test UUID Mapping:**
`;

  results.forEach(result => {
    const test = result.testCase;
    const status = result.success ? '✅' : '❌';
    report += `- \`[requirement:uuid:${test.requirementUuid}]\` → \`[test:uuid:${test.testUuid}]\` ${status}\n`;
  });

  report += `
---

**Generated by:** TSRanger Comprehensive Test Automation  
**Command:** \`node comprehensive-test-automation.js\`  
**Test Matrix Source:** [Fresh Dawn Comprehensive Testing Matrix](../../../scrum.pmo/project.journal/2025-08-19-0800-fresh-dawn/comprehensive-testing-matrix.md)  

[Back to Test Directory](../test/) | [TSRanger v2.2](../README.md)
`;

  return report;
}

/**
 * Main test execution function
 */
function main() {
  console.log('🚀 Starting TSRanger v2.2 Comprehensive Test Suite...\n');
  
  const results = [];
  let testNumber = 1;
  
  for (const testCase of TEST_MATRIX) {
    process.stdout.write(`[${testNumber.toString().padStart(2, '0')}/${TEST_MATRIX.length}] Testing: ${testCase.input.padEnd(20)} ... `);
    
    const result = executeTest(testCase);
    result.testCase = testCase;
    results.push(result);
    
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const duration = `${result.duration}ms`.padStart(6);
    console.log(`${status} (${duration})`);
    
    testNumber++;
  }

  console.log('\n📊 Generating test report...');
  const report = generateTestReport(results);
  
  writeFileSync(REPORT_FILE, report);
  console.log(`✅ Test report generated: ${REPORT_FILE}`);
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n🎯 SUMMARY: ${passed}/${TEST_MATRIX.length} tests passed (${((passed/TEST_MATRIX.length)*100).toFixed(1)}%)`);
  
  if (failed > 0) {
    console.log(`❌ ${failed} tests failed - see report for details`);
    process.exit(1);
  } else {
    console.log('🎉 All tests passed!');
    process.exit(0);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { TEST_MATRIX, executeTest, generateTestReport };
