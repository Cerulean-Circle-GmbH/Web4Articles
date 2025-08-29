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
once demo "s2bq"
```
- Start server
- Wait 2 seconds
- Launch Browser client
- Quit

### 3. Multi-Client Test
```bash
once demo "s3bc3w5q"
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
once demo "s3bcd3q"
```
- Start server
- Wait 3 seconds
- Launch Browser & Node.js clients
- Discover peers
- Wait 3 seconds
- Quit

### 5. Full Demo Sequence
```bash
once demo "s3bcd2e2m3q"
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
once demo "s1bbbccc1d1e1m2k2q"
```
- Start server
- Wait 1 second
- Launch 3 Browser clients
- Launch 3 Node.js clients
- Wait 1 second
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
once demo "s2l1b2lc3lq"
```
- Start server
- Wait 2 seconds
- Clear screen
- Wait 1 second
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
- `b` - Launch Browser client
- `c` - Launch Node.js client
- `w` - Launch Worker client
- `d` - Discover peers
- `e` - Exchange scenarios
- `m` - Show metrics
- `l` - Clear screen (was backspace in interactive mode)
- `k` - Kill all processes
- `h` - Show help
- `q` - Quit
- Numbers - Wait duration in seconds

Example: `once demo "s512d10e5m3k1q"`