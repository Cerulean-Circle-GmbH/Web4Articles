# PDCA: ONCE Demo Showcase - Test Mode Options

## Summary

Presenting the ONCE interactive demo test mode capabilities with various pre-configured sequences. This PDCA documents available demo options and keyboard commands for the user to choose from, demonstrating the automated test mode functionality implemented earlier.

## Plan

1. Explain keyboard input system
2. Present demo sequence options
3. Let user choose preferred demo
4. Execute chosen sequence
5. Document results

## Do

### Keyboard Input System Explanation

The ONCE demo test mode uses a simple sequence format:
- **Letters** = Commands (actions)
- **Numbers** = Pause duration in seconds
- **Sequential execution** = Each character processed in order

### Available Keyboard Commands

| Key | Action | Description |
|-----|--------|-------------|
| `s` | Start/Stop server | Toggles ONCE server on/off |
| `1` | Launch Browser client | Simulates browser environment |
| `2` | Launch Node.js client | Creates Node.js ONCE instance |
| `3` | Launch Worker client | Spawns Web Worker instance |
| `d` | Discover peers | Shows all connected clients |
| `e` | Exchange scenarios | Demos P2P data exchange |
| `m` | Show metrics | Displays system status |
| `c` | Clear screen | Cleans display |
| `k` | Kill all processes | Force stop all instances |
| `h` | Show help | Display command list |
| `q` | Quit | Graceful shutdown |

### Demo Sequence Options

#### 1. **Quick Server Test** - `s3q`
```bash
once demo "s3q"
```
- Start server
- Wait 3 seconds
- Quit gracefully

#### 2. **Single Client Demo** - `s21q`
```bash
once demo "s21q"
```
- Start server
- Wait 2 seconds
- Launch Browser client
- Quit

#### 3. **Peer Discovery Demo** - `s312d3q`
```bash
once demo "s312d3q"
```
- Start server
- Wait 3 seconds
- Launch Browser & Node.js clients
- Discover peers
- Wait 3 seconds
- Quit

#### 4. **Full Feature Demo** - `s312d2e2m3q`
```bash
once demo "s312d2e2m3q"
```
- Start server
- Wait 3 seconds
- Launch Browser & Node.js clients
- Discover peers
- Wait 2 seconds
- Exchange scenarios
- Wait 2 seconds
- Show metrics
- Wait 3 seconds
- Quit

#### 5. **Multi-Client Stress Test** - `s1112223d1e1m2k2q`
```bash
once demo "s1112223d1e1m2k2q"
```
- Start server
- Launch 3 Browser clients
- Launch 3 Node.js clients
- Discover peers
- Exchange scenarios
- Show metrics
- Kill all processes
- Quit

#### 6. **Help & Status Demo** - `h3s2m2c1q`
```bash
once demo "h3s2m2c1q"
```
- Show help
- Wait 3 seconds
- Start server
- Wait 2 seconds
- Show metrics
- Wait 2 seconds
- Clear screen
- Wait 1 second
- Quit

## Check

### Demo Capabilities
- ✅ Automated execution without manual input
- ✅ Visual feedback for each action
- ✅ Configurable timing between actions
- ✅ Graceful error handling
- ✅ Clean shutdown process
- ✅ No zombie processes

### Expected Output Format
```
🤖 ONCE Demo Test Mode
────────────────────────
Sequence: [your sequence]
────────────────────────

📋 Parsed actions:
  1. Press 's'
  2. Wait 3 seconds
  3. Press 'q'

[1/3] ⌨️  Pressing 's'...
✅ Server started on http://172.30.0.2:8080

[2/3] ⏸️  Waiting 3 seconds...

[3/3] ⌨️  Pressing 'q'...
✅ Cleanup complete
```

## Act

### User Choice Required

**Which demo would you like to see?**

1. **Quick Test** (`s3q`) - Just server start/stop
2. **Single Client** (`s21q`) - Server + one client
3. **Peer Discovery** (`s312d3q`) - Multiple clients discovering each other
4. **Full Demo** (`s312d2e2m3q`) - All features showcase
5. **Stress Test** (`s1112223d1e1m2k2q`) - Many clients
6. **Custom** - Provide your own sequence

**Please choose a number (1-6) or provide a custom sequence.**

### How to Run Your Choice

Once you select, I'll show you:
1. The exact command to run
2. What each part of the sequence does
3. Expected output and timing

The demo will:
- Use real IP address (172.30.0.2)
- Show visual progress indicators
- Clean up all processes on exit
- Provide clear success/error messages

## Dual Links

**PDCA History**: [PDCA HowTo Update](./2025-08-28-UTC-2512-pdca-howto-update.md) → **[Demo Showcase](./2025-08-28-UTC-2520-once-demo-showcase.md)**

**GitHub Links**: [View on GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-28-UTC-2227-session-start/pdca/2025-08-28-UTC-2520-once-demo-showcase.md) | [Local File](./2025-08-28-UTC-2520-once-demo-showcase.md)