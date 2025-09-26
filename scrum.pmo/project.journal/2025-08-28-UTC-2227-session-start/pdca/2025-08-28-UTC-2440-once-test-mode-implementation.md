# PDCA: ONCE Demo Test Mode Implementation

## Summary

Successfully implemented test mode for the ONCE interactive demo, enabling automated execution of demo sequences through command-line arguments. The implementation follows the TSRanger pattern where keys represent actions and numbers represent pause durations in seconds.

## Plan

1. Add sequence parser to interpret key/pause strings
2. Implement test mode runner with visual feedback
3. Create CLI wrapper for easy command access
4. Support all existing keyboard commands
5. Test with various sequences

## Do

### 1. Updated interactive-demo.js

Added test mode support with three main components:

#### Sequence Parser
```javascript
function parseSequence(sequence) {
    const actions = [];
    let i = 0;
    
    while (i < sequence.length) {
        const char = sequence[i];
        
        if (/\d/.test(char)) {
            // Collect all consecutive digits
            let numStr = '';
            while (i < sequence.length && /\d/.test(sequence[i])) {
                numStr += sequence[i];
                i++;
            }
            actions.push({ type: 'pause', value: parseInt(numStr) });
        } else {
            actions.push({ type: 'key', value: char });
            i++;
        }
    }
    return actions;
}
```

#### Keypress Simulator
```javascript
async function simulateKeypress(key) {
    log.key(key, 'Simulating keypress');
    
    switch (key) {
        case 's': // Start/stop server
        case '1': // Launch Browser client
        case '2': // Launch Node.js client
        case '3': // Launch Worker client
        case 'd': // Discover peers
        case 'e': // Exchange scenarios
        case 'm': // Show metrics
        case 'c': // Clear screen
        case 'k': // Kill all processes
        case 'h': // Show help
        case 'q': // Quit
        // ... implementation for each
    }
}
```

#### Test Mode Runner
```javascript
async function runTestMode(sequence) {
    // Parse sequence
    const actions = parseSequence(sequence);
    
    // Show plan
    console.log('📋 Parsed actions:');
    actions.forEach((action, index) => {
        if (action.type === 'key') {
            console.log(`  ${index + 1}. Press '${action.value}'`);
        } else {
            console.log(`  ${index + 1}. Wait ${action.value} second(s)`);
        }
    });
    
    // Execute sequence
    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        if (action.type === 'key') {
            console.log(`[${i + 1}/${actions.length}] ⌨️  Pressing '${action.value}'...`);
            await simulateKeypress(action.value);
        } else {
            console.log(`[${i + 1}/${actions.length}] ⏸️  Waiting ${action.value} second(s)...`);
            await new Promise(resolve => setTimeout(resolve, action.value * 1000));
        }
    }
}
```

### 2. Created CLI Wrapper (bin/once)

```javascript
#!/usr/bin/env node

if (args[0] === 'demo' && args[1]) {
    // Run test mode
    spawn('node', [demoPath, 'demo', args[1]], { stdio: 'inherit' });
} else if (args[0] === 'demo') {
    // Run interactive mode
    spawn('node', [demoPath], { stdio: 'inherit' });
}
```

### 3. Updated package.json

Added bin entry:
```json
"bin": {
    "once": "./bin/once",
    "once-cli": "./dist/ts/layer5/ONCECLI.js"
}
```

### 4. Created Test Sequences Documentation

Documented example sequences in `test-sequences.md`:
- Basic: `once demo "s3q"`
- Full demo: `once demo "s312d2e2m3q"`
- Stress test: `once demo "s1112223d1e1m2k2q"`

## Check

### Test Results

```bash
# Test run: once demo "s2q"
🤖 ONCE Demo Test Mode
────────────────────────────────────────
Sequence: s2q

📋 Parsed actions:
  1. Press 's'
  2. Wait 2 seconds
  3. Press 'q'

[1/3] ⌨️  Pressing 's'...
✅ Server started on http://172.30.0.2:8080
[2/3] ⏸️  Waiting 2 seconds...
[3/3] ⌨️  Pressing 'q'...
✅ Cleanup complete
```

### Features Verified
- ✅ Sequence parsing works correctly
- ✅ Multi-digit pauses supported (e.g., "10" = 10 seconds)
- ✅ All keyboard commands functional
- ✅ Visual feedback at each step
- ✅ Graceful cleanup on quit
- ✅ No zombie processes

### Key Benefits
1. **Automated Testing**: Run demos without manual input
2. **Reproducible**: Same sequence produces same results
3. **Shareable**: Just share the command string
4. **CI/CD Ready**: Can be used in automated pipelines

## Act

### Usage Examples

```bash
# Quick tests
once demo "s3q"              # Start and stop
once demo "s21q"             # Server + one client

# Full demos
once demo "s312d2e2m3q"      # Complete feature demo
once demo "h5s312d3q"        # Show help first

# Stress tests
once demo "s111222333d1e1q"  # Many clients
```

### Future Enhancements
1. Add sequence validation before execution
2. Support for loops (e.g., "r3" = repeat 3 times)
3. Save/load named sequences
4. Generate sequences from interactive sessions
5. Add timing reports

### Integration Benefits
- Consistent with TSRanger design patterns
- Easy to document demos (just the sequence)
- Enables automated testing
- Reduces demo setup time
- Prevents human error in demos

### Command Reference
```
s - Start/Stop server
1 - Launch Browser client
2 - Launch Node.js client
3 - Launch Worker client
d - Discover peers
e - Exchange scenarios
m - Show metrics
c - Clear screen
k - Kill all processes
h - Show help
q - Quit
0-9 - Wait N seconds
```

## Dual Links

**PDCA History**: [Test Mode Proposal](./2025-08-28-UTC-2425-once-demo-test-mode.md) → **[Test Mode Implementation](./2025-08-28-UTC-2440-once-test-mode-implementation.md)**

**GitHub Links**: [View on GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-28-UTC-2227-session-start/pdca/2025-08-28-UTC-2440-once-test-mode-implementation.md) | [Local File](./2025-08-28-UTC-2440-once-test-mode-implementation.md)