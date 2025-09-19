# PDCA: ONCE Demo Test Mode - Automated Key Sequence

## Summary

Add a test mode to the ONCE interactive demo that accepts a command-line argument with a sequence of keys and pause durations, similar to the TSRanger demo. This enables automated testing and demonstrations without manual keyboard input.

## Plan

### Requirement Analysis
User wants: `once demo "a5c10d1q"`

Where the string means:
- `a` - Execute action 'a' (some demo action)
- `5` - Wait 5 seconds
- `c` - Execute action 'c' (clear screen)
- `10` - Wait 10 seconds (two digits = 10)
- `d` - Execute action 'd' (discover peers)
- `1` - Wait 1 second
- `q` - Quit the demo

### Proposed Implementation

1. **Parse command line argument**
   - Accept: `once demo "sequence"`
   - Parse sequence into actions and delays

2. **Sequence Parser**
   ```javascript
   parseSequence("a5c10d1q") → [
     { type: 'key', value: 'a' },
     { type: 'pause', value: 5 },
     { type: 'key', value: 'c' },
     { type: 'pause', value: 10 },
     { type: 'key', value: 'd' },
     { type: 'pause', value: 1 },
     { type: 'key', value: 'q' }
   ]
   ```

3. **Key Mapping** (proposed based on current demo):
   - `s` - Start/stop server
   - `1` - Launch Browser client
   - `2` - Launch Node.js client  
   - `3` - Launch Worker client
   - `d` - Discover peers
   - `e` - Exchange scenarios
   - `m` - Show metrics
   - `c` - Clear screen
   - `k` - Kill all processes
   - `h` - Show help
   - `q` - Quit

4. **Execution Engine**
   - Process sequence items in order
   - Execute keys through keyboard controller
   - Add pauses between actions
   - Show visual feedback

## Do

### Proposed Changes

1. **Update interactive-demo.js**
   ```javascript
   // Add test mode support
   const args = process.argv.slice(2);
   if (args[0] === 'demo' && args[1]) {
       runTestMode(args[1]);
   } else {
       runInteractiveMode();
   }
   ```

2. **Add Test Mode Function**
   ```javascript
   async function runTestMode(sequence) {
       console.log(`🤖 Running test mode with sequence: ${sequence}`);
       const actions = parseSequence(sequence);
       
       for (const action of actions) {
           if (action.type === 'key') {
               console.log(`⌨️  Pressing '${action.value}'...`);
               await simulateKeypress(action.value);
           } else if (action.type === 'pause') {
               console.log(`⏸️  Waiting ${action.value} seconds...`);
               await sleep(action.value * 1000);
           }
       }
   }
   ```

3. **Add ONCE CLI Command**
   ```bash
   # In package.json bin section
   "once": "./src/ts/layer5/once-cli.js"
   
   # Usage
   once demo "s3125d2e1q"
   # Start server, wait 3s, launch clients 1&2, wait 5s, 
   # discover, wait 2s, exchange, wait 1s, quit
   ```

## Check

### Benefits
- ✅ Automated testing of demo sequences
- ✅ Reproducible demonstrations
- ✅ No manual keyboard input needed
- ✅ Easy to share demo scripts
- ✅ Consistent with TSRanger pattern

### Example Sequences
```bash
# Quick test
once demo "s11q"          # Start server, launch client, quit

# Full demo
once demo "s312315d2e2m3q"  # Complete demo with all features

# Stress test
once demo "s11112223333d1e1k2q"  # Many clients
```

### Visual Output
```
🤖 Running test mode with sequence: s312d2e1q
⌨️  Pressing 's'...
    ✅ Server started
⏸️  Waiting 3 seconds...
⌨️  Pressing '1'...
    ✅ Browser client launched
⌨️  Pressing '2'...
    ✅ Node.js client launched
⌨️  Pressing 'd'...
    🔍 Discovered 2 peers
⏸️  Waiting 2 seconds...
⌨️  Pressing 'e'...
    📦 Scenarios exchanged
⏸️  Waiting 1 second...
⌨️  Pressing 'q'...
    🛑 Demo stopped gracefully
```

## Act

### Implementation Question

**Should I implement this test mode?**

The implementation would include:
1. Sequence parser for key/pause interpretation
2. Test mode runner with visual feedback
3. Integration with existing keyboard controller
4. ONCE CLI command support
5. Documentation and examples

This would make the demo:
- Easier to test
- More shareable (just share the sequence)
- Automated for CI/CD
- Consistent with TSRanger patterns

**Ready to implement?** (Yes/No)

## Dual Links

**PDCA History**: [Release/Dev Integration](./2025-08-28-UTC-2415-once-release-dev-integration.md) → **[Demo Test Mode](./2025-08-28-UTC-2425-once-demo-test-mode.md)**

**GitHub Links**: [View on GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-28-UTC-2227-session-start/pdca/2025-08-28-UTC-2425-once-demo-test-mode.md) | [Local File](./2025-08-28-UTC-2425-once-demo-test-mode.md)