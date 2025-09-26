# ONCE Demo Test Sequences

## Quick Test Sequences

### 1. Basic Server Test
```bash
once demo "s3q"
```
- Start server
- Wait 3 seconds
- Quit

### 2. Single Client Test
```bash
once demo "s21q"
```
- Start server
- Wait 2 seconds
- Launch Browser client
- Quit

### 3. Multi-Client Test
```bash
once demo "s312315q"
```
- Start server
- Wait 3 seconds
- Launch Browser client
- Launch Node.js client
- Wait 3 seconds
- Launch Worker client
- Wait 5 seconds
- Quit

### 4. Discovery Demo
```bash
once demo "s312d3q"
```
- Start server
- Wait 3 seconds
- Launch Browser & Node.js clients
- Discover peers
- Wait 3 seconds
- Quit

### 5. Full Demo Sequence
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

### 6. Stress Test
```bash
once demo "s1112223d1e1m2k2q"
```
- Start server
- Launch 3 Browser clients
- Launch 3 Node.js clients
- Discover peers
- Wait 1 second
- Exchange scenarios
- Wait 1 second
- Show metrics
- Wait 2 seconds
- Kill all processes
- Wait 2 seconds
- Quit

### 7. Clear Screen Demo
```bash
once demo "s2c12c23cq"
```
- Start server
- Wait 2 seconds
- Clear screen
- Launch Browser client
- Wait 2 seconds
- Clear screen
- Launch Node.js client
- Wait 3 seconds
- Clear screen
- Quit

### 8. Help Display
```bash
once demo "h5s2h3q"
```
- Show help
- Wait 5 seconds
- Start server
- Wait 2 seconds
- Show help again
- Wait 3 seconds
- Quit

## Custom Sequences

Create your own sequences using:
- `s` - Start/Stop server
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
- Numbers - Wait duration in seconds

Example: `once demo "s512d10e5m3k1q"`