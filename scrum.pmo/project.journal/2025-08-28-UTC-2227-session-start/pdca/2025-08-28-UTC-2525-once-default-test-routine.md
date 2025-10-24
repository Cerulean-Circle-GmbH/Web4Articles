<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# PDCA: ONCE Default Test Routine Implementation

## Summary

Establishing demo sequences 1-5 as the default testing routine for ONCE component validation. This provides a standardized test progression from simple server start/stop to comprehensive stress testing, ensuring consistent quality validation.

## Plan

1. Define default test routine (sequences 1-5)
2. Document test progression rationale
3. Execute Demo 1 as starting point
4. Create test routine documentation
5. Integrate into development workflow

## Do

### Default Test Routine Established

#### Test Sequence Progression

1. **Quick Test** (`s3q`) - Basic server functionality
2. **Single Client** (`s21q`) - Client connection capability
3. **Peer Discovery** (`s312d3q`) - Multi-client networking
4. **Full Demo** (`s312d2e2m3q`) - Complete feature set
5. **Stress Test** (`s1112223d1e1m2k2q`) - Load handling

### Rationale for Progression

- **Incremental Complexity**: Each test builds on previous
- **Fail Fast**: Simple tests catch basic issues early
- **Comprehensive Coverage**: From unit to integration to stress
- **Time Efficient**: Quick tests first, longer tests later
- **Diagnostic Value**: Isolates failure points effectively

### Test Routine Documentation

```bash
#!/bin/bash
# ONCE Default Test Routine

echo "🧪 ONCE Default Test Routine"
echo "============================"

# Test 1: Quick Server Test
echo -e "\n[1/5] Quick Server Test..."
once demo "s3q"
[ $? -ne 0 ] && echo "❌ Test 1 Failed" && exit 1

# Test 2: Single Client
echo -e "\n[2/5] Single Client Test..."
once demo "s21q"
[ $? -ne 0 ] && echo "❌ Test 2 Failed" && exit 1

# Test 3: Peer Discovery
echo -e "\n[3/5] Peer Discovery Test..."
once demo "s312d3q"
[ $? -ne 0 ] && echo "❌ Test 3 Failed" && exit 1

# Test 4: Full Features
echo -e "\n[4/5] Full Feature Test..."
once demo "s312d2e2m3q"
[ $? -ne 0 ] && echo "❌ Test 4 Failed" && exit 1

# Test 5: Stress Test
echo -e "\n[5/5] Stress Test..."
once demo "s1112223d1e1m2k2q"
[ $? -ne 0 ] && echo "❌ Test 5 Failed" && exit 1

echo -e "\n✅ All tests passed!"
```

### Executing Demo 1: Quick Server Test

**Command:**
```bash
once demo "s3q"
```

**Sequence Breakdown:**
- `s` - Start ONCE server
- `3` - Wait 3 seconds (server stabilization)
- `q` - Quit gracefully

**Expected Output:**
```
🤖 ONCE Demo Test Mode
────────────────────────
Sequence: s3q
────────────────────────

📋 Parsed actions:
  1. Press 's'
  2. Wait 3 seconds
  3. Press 'q'

[1/3] ⌨️  Pressing 's'...
  [s] Simulating keypress
ℹ️  Starting ONCE server...
✅ Server started on http://172.30.0.2:8080

[2/3] ⏸️  Waiting 3 seconds...

[3/3] ⌨️  Pressing 'q'...
  [q] Simulating keypress
ℹ️  Quit command received
ℹ️  Performing cleanup...
✅ Cleanup complete
```

## Check

### Test Routine Benefits

- ✅ **Standardized**: Same tests every time
- ✅ **Progressive**: Builds complexity gradually
- ✅ **Diagnostic**: Pinpoints failure stage
- ✅ **Automated**: No manual intervention
- ✅ **Comprehensive**: Covers all major features

### Integration Points

1. **CI/CD Pipeline**: Run routine on every commit
2. **Pre-release**: Mandatory test passage
3. **Development**: Quick validation during coding
4. **Debugging**: Isolate issues to specific test

### Success Criteria

- All 5 tests must pass sequentially
- No zombie processes after any test
- Clean exit codes (0) for each test
- Total runtime under 2 minutes

## Act

### Immediate Implementation

1. **Running Demo 1 Now** - Quick Server Test
2. Document results
3. Proceed with remaining tests on success
4. Create automated test script

### Future Enhancements

1. **Parallel Test Execution**: Run independent tests simultaneously
2. **Performance Metrics**: Track execution times
3. **Regression Detection**: Compare against baseline
4. **Visual Test Reports**: HTML output with graphs
5. **Custom Test Additions**: Project-specific sequences

### Usage Guidelines

**For Developers:**
```bash
# Run single test
once demo "s3q"

# Run full routine
./run-once-tests.sh
```

**For CI/CD:**
```yaml
test:
  script:
    - once demo "s3q"
    - once demo "s21q"
    - once demo "s312d3q"
    - once demo "s312d2e2m3q"
    - once demo "s1112223d1e1m2k2q"
```

### Next Step: Execute Demo 1

Ready to run the Quick Server Test (`s3q`) as the first step of our default routine.

## Dual Links

**PDCA History**: [Demo Showcase](./2025-08-28-UTC-2520-once-demo-showcase.md) → **[Default Test Routine](./2025-08-28-UTC-2525-once-default-test-routine.md)**

**GitHub Links**: [View on GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-28-UTC-2227-session-start/pdca/2025-08-28-UTC-2525-once-default-test-routine.md) | [Local File](./2025-08-28-UTC-2525-once-default-test-routine.md)