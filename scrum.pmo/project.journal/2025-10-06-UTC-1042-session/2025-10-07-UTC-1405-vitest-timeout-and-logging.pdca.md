# 📋 **PDCA Cycle: Vitest Timeout & Automatic Test Logging**

**🗓️ Date:** 2025-10-07-UTC-1405  
**🎯 Objective:** Standardize test timeouts and implement automatic test logging for Web4TSComponent  
**🎯 Template Version:** 3.2.4.2  
**🏅 CMM Badge:** CMM3 (Process Standardization & Automation)

**👤 Agent Name:** Claude  
**👤 Agent Role:** DevOps Process Engineer  
**👤 Branch:** dev/0308  
**🔄 Sync Requirements:** None (process improvement)  
**🎯 Project Journal Session:** 2025-10-06-UTC-1042-session → Test infrastructure improvement  
**🎯 Sprint:** N/A → Mid-session process improvement

**📎 Previous Commit:** ef70f78e - fix: prevent version overwrite + add hierarchy check  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0308/scrum.pmo/project.journal/2025-10-06-UTC-1042-session/2025-10-07-UTC-1250-version-confusion-0341-vs-0340.pdca.md) | [§/scrum.pmo/project.journal/2025-10-06-UTC-1042-session/2025-10-07-UTC-1250-version-confusion-0341-vs-0340.pdca.md](./2025-10-07-UTC-1250-version-confusion-0341-vs-0340.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0308/scrum.pmo/project.journal/2025-10-06-UTC-1042-session/2025-10-07-UTC-1405-vitest-timeout-and-logging.pdca.md) | [§/scrum.pmo/project.journal/2025-10-06-UTC-1042-session/2025-10-07-UTC-1405-vitest-timeout-and-logging.pdca.md](./2025-10-07-UTC-1405-vitest-timeout-and-logging.pdca.md)
- **Files to Change:** vitest.config.ts, test.sh, test.sh.template, .gitignore
- **Target Component:** Web4TSComponent 0.3.4.1 (dev/test)

### **To TRON: QA Decisions required**
- [x] **Timeout standardization**: Use vitest's built-in timeout (180s) instead of shell-level timeout
- [x] **Logging location**: Store logs in test/data/logs/ with timestamps
- [ ] **Template version**: Verify 3.2.4.2 compliance - awaiting validation

### **TRON Feedback (2025-10-07-UTC-1405)**
```quote
ok currently you use timeout180s on the tests...sometimes less depending on your call.
pdca about what vitest and do already,
if we can call vitest with timeout in ./web4tscomponent test
and if we can make ti the default in 
./web4tscomponent test
to split the vitest output into the terminal and a test log file in test/data with tee or how it is best
```

### **My Answer**
I will analyze vitest's timeout capabilities and design a solution for automatic test logging using vitest.config.ts and tee in test.sh.

**Learning Applied:** Use vitest's native timeout features instead of shell-level timeout for consistency and better integration.

---

## **📊 PLAN**

### **Problem Statement:**

Currently, test timeouts are handled inconsistently:
- Agent manually wraps test commands with `timeout 120s` or `timeout 180s`
- Timeout values vary depending on the call
- Test output is not automatically logged to files
- Manual `tee` commands are needed to capture output

This creates:
1. Inconsistent timeout behavior (sometimes 120s, sometimes 180s)
2. No permanent test logs for regression analysis
3. Manual intervention required for output capture
4. No standardized logging location

### **Questions to Answer:**

1. **What does Vitest already provide for timeouts?**
   - CLI flags?
   - Configuration options?
   - Per-test timeouts?

2. **Can we call vitest with timeout from `./web4tscomponent test`?**
   - Pass timeout as parameter?
   - Set via environment variable?
   - Configure in vitest.config.ts?

3. **How to make test logging default in `./web4tscomponent test`?**
   - Use `tee` in test.sh?
   - Use vitest reporters?
   - Redirect stderr/stdout?

4. **Where should test logs be stored?**
   - `test/data/logs/`?
   - `test/logs/`?
   - Root `logs/` directory?
   - Should it be .gitignored?

### **Research Plan:**

1. Read vitest documentation (vitest.config.ts, CLI options)
2. Check current test.sh implementation
3. Analyze best practices for test logging
4. Design solution that works for both:
   - `npm test` (shell-based wrapper)
   - `npm run component test` (CLI-based wrapper)

---

## **🛠️ DO**

### **Investigation 1: What Vitest Already Provides**

#### **Vitest Timeout Options:**

```typescript
// vitest.config.ts
export default {
  test: {
    testTimeout: 120000,        // Per-test timeout (ms)
    hookTimeout: 30000,          // beforeEach/afterEach timeout (ms)
    teardownTimeout: 10000       // Cleanup timeout (ms)
  }
}
```

#### **Vitest CLI Options:**

```bash
# Run with timeout
vitest --testTimeout=120000

# Run with reporters
vitest --reporter=default --reporter=json --outputFile=test-results.json

# Run with custom config
vitest --config=vitest.custom.config.ts
```

#### **Vitest Environment:**

```bash
# Via environment variable (not standard, but custom)
VITEST_TIMEOUT=120000 vitest
```

### **Investigation 2: Current test.sh Implementation**

```bash
#!/bin/sh
echo "🧪 Running Web4TSComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests with 120-second timeout to prevent infinite loops
echo "⏱️  Running tests with 120s timeout..."
timeout 120s npm run vitest || {
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 124 ]; then
    echo "❌ Tests timed out after 120 seconds (infinite loop detected)"
    exit 124
  else
    exit $EXIT_CODE
  fi
}
```

**Issues:**
- Shell-level `timeout` command (works but crude)
- No logging
- Hardcoded 120s (inconsistent with agent's 180s calls)

### **Investigation 3: Vitest Reporters & Logging**

Vitest supports multiple reporters:
- `default` - Console output
- `verbose` - Detailed console output
- `json` - JSON output to file
- `junit` - JUnit XML format
- Custom reporters

**Best Practice:**
```bash
vitest --reporter=default --reporter=json --outputFile=./test/data/test-results.json
```

This outputs to console AND saves JSON report.

For full console logging with `tee`:
```bash
vitest 2>&1 | tee ./test/data/test-output.log
```

### **Investigation 4: Test Log Location**

**Options:**

1. `test/data/logs/` ✅ BEST
   - Already using `test/data/` for test fixtures
   - Consistent with existing structure
   - Easy to .gitignore: `test/data/logs/`

2. `test/logs/` 
   - Separate from test data
   - But adds another directory

3. `logs/` at component root
   - Pollutes root
   - Not recommended

**Recommendation:** `test/data/logs/` with timestamped filenames

---

## **✅ CHECK**

### **Proposed Solution:**

#### **1. Update vitest.config.ts** (Default Timeout)

```typescript
// vitest.config.ts
export default {
  test: {
    testTimeout: 180000,        // 180s per test (3 minutes)
    hookTimeout: 30000,          // 30s for setup/teardown
    teardownTimeout: 10000,      // 10s for cleanup
    reporters: ['default', 'json'],
    outputFile: './test/data/test-results.json'
  }
}
```

**Benefits:**
- Standardized 180s timeout across all tests
- No shell-level `timeout` needed
- Automatic JSON report generation
- Consistent behavior

#### **2. Update test.sh** (Add Automatic Logging)

```bash
#!/bin/sh
echo "🧪 Running Web4TSComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Create logs directory if it doesn't exist
mkdir -p test/data/logs

# Generate timestamp for log filename
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="test/data/logs/test-${TIMESTAMP}.log"

# Run tests with tee to split output
echo "⏱️  Running tests (180s timeout per test)..."
echo "📝 Logging to: ${LOG_FILE}"
npm run vitest 2>&1 | tee "${LOG_FILE}"

# Check exit code
EXIT_CODE=${PIPESTATUS[0]}
if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Tests failed (see log: ${LOG_FILE})"
  exit $EXIT_CODE
else
  echo "✅ Tests passed (log: ${LOG_FILE})"
fi
```

**Benefits:**
- Automatic timestamped logs
- No manual `tee` needed
- Exit code preserved via `${PIPESTATUS[0]}`
- User-friendly output

#### **3. Update .gitignore** (Exclude Test Logs)

```gitignore
# Test data and logs
**/test/data/logs/
**/test/data/*.log
test-results.json
```

#### **4. CLI Integration** (web4tscomponent test)

The `test()` method in DefaultWeb4TSComponent.ts already delegates to shell scripts, so the logging will work automatically for:
- `npm test` ✅
- `./web4tscomponent test` ✅ (delegates to test.sh)
- `npm run component test` ✅ (delegates to test.sh)

**No CLI changes needed!** The test.sh handles everything.

### **Alternative: CLI-Level Timeout Parameter**

If we want to make timeout configurable from CLI:

```typescript
/**
 * Run component tests
 * 
 * @param timeout Test timeout in seconds (default: 180)
 * @cliSyntax timeout
 * @cliDefault timeout 180
 * @cliExample web4tscomponent test
 * @cliExample web4tscomponent test 300
 */
async test(timeout: string = '180'): Promise<this> {
  // ... existing code ...
  
  // Set environment variable for vitest
  process.env.VITEST_TIMEOUT = (parseInt(timeout) * 1000).toString();
  
  // ... run tests ...
}
```

**BUT:** This is NOT recommended because:
- Adds complexity
- vitest.config.ts is the standard place for timeout
- Environment variable approach is non-standard
- Shell script already handles it via config

### **Summary of Changes:**

| Component | Change | Benefit |
|-----------|--------|---------|
| `vitest.config.ts` | Set `testTimeout: 180000` | Standard 180s timeout |
| `vitest.config.ts` | Add JSON reporter | Auto-generate test-results.json |
| `test.sh` | Add `tee` to log file | Automatic timestamped logs |
| `test.sh` | Remove shell `timeout` | Use vitest's built-in timeout |
| `.gitignore` | Ignore `test/data/logs/` | Keep repo clean |

---

## **🔄 ACT**

### **Decision:**

**PROCEED** with implementing:
1. Vitest config with 180s timeout
2. Automatic test logging via test.sh
3. .gitignore updates
4. Remove shell-level `timeout` command

### **Implementation Order:**

1. Update `vitest.config.ts` (both 0.3.4.0 and 0.3.4.1)
2. Update `test.sh` (both 0.3.4.0 and 0.3.4.1)
3. Update `test.sh.template` (for new components)
4. Update `.gitignore`
5. Test the changes
6. Commit

### **Benefits:**

✅ **Consistent:** All tests use 180s timeout  
✅ **Automatic:** Logs created without manual `tee`  
✅ **Timestamped:** Easy to track test runs over time  
✅ **Clean:** Logs are gitignored  
✅ **Standard:** Uses vitest's built-in features  
✅ **Transparent:** Console output preserved via `tee`  

### **Next Cycle:**

Implement the changes and verify test logging works correctly.

---

## **💫 EMOTIONAL REFLECTION: Relief and Process Maturity**

### **Confidence in Standardization:**
**Strong** - Moving from ad-hoc timeout values to systematic vitest configuration brings predictability and reduces cognitive load for future work.

### **Satisfaction with Automation:**
**High** - Automatic test logging eliminates manual `tee` commands and creates a permanent record of test runs for regression analysis.

### **Concern About Past Inconsistency:**
**Moderate** - Recognizing that timeout values varied between calls (120s, 180s) highlights the need for this CMM3 standardization work.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Documentation for infrastructure improvements ensures decisions are traceable  
- ✅ **CMM3 Compliance:** MUST use exact template 3.2.4.2 format - no variations allowed
- ✅ **Vitest Native Features:** Leveraging built-in timeout and reporters is better than shell workarounds  
- ✅ **Test Logging Standard:** Timestamped logs in test/data/logs/ creates audit trail for test runs

**Quality Impact:** Standardizing test timeouts and logging prevents ad-hoc decisions and creates reproducible test environment

**Next PDCA Focus:** Implementation of vitest timeout config and automatic logging, then verification

---

**🎯 Test Infrastructure Standardized with CMM3 Precision** ⏱️📝

**"Inconsistent timeouts breed confusion - vitest's native features bring clarity."** 🔧📊

---

## **🔄 PDCA PROCESS UPDATE**

**Compliance Check:** Template 3.2.4.2 ✅, Dual links ✅, UTC timestamp ✅, 6 sections ✅, CMM Badge ✅

**Next Steps:** Implement vitest timeout config and automatic test logging

---

### **📚 The 42 Revelation**
**Understanding requires regression testing:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md](../../../scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md)

**CMM4 Achievement Excellence:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-27-UTC-2251/scrum.pmo/roles/SaveRestartAgent/pdca/2025-09-28-UTC-1108.pdca.md) | [§/scrum.pmo/roles/SaveRestartAgent/pdca/2025-09-28-UTC-1108.pdca.md](../../../scrum.pmo/roles/SaveRestartAgent/pdca/2025-09-28-UTC-1108.pdca.md)

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨

