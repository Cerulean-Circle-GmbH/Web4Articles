# PDCA: ONCE Demo IP Address and Lifecycle Management Improvements

## Summary

Enhanced the ONCE demo to use real IP addresses instead of localhost and implemented proper lifecycle management with graceful shutdown capabilities using `ps -edalf` for process tracking. This makes the demo more robust and suitable for network testing across different machines.

## Plan

1. Replace all localhost references with dynamic IP detection
2. Implement graceful shutdown with proper process tracking
3. Create lifecycle management scripts
4. Update all demo files to support IP configuration
5. Test the improved demo with real IP addresses

## Do

### IP Address Detection Implementation
- Modified `server.mjs` to detect host IP using `hostname -I`
- Added environment variable support (HOST/PORT) to all components
- Updated test clients to accept IP configuration

### Created New Scripts
1. **launch-demo-v2.sh**: Enhanced launcher with:
   - Automatic IP detection: `hostname -I | awk '{print $1}'`
   - PID tracking in `/tmp/once-demo-pids.txt`
   - Graceful shutdown trap handlers
   - Status monitoring option
   - Clear instructions with real IP

2. **stop-demo.sh**: Graceful shutdown script with:
   - Process discovery using `ps -edalf`
   - Graceful SIGTERM followed by SIGKILL
   - Zombie process cleanup
   - User confirmation prompt
   - Comprehensive process identification

### Updated Components
- **server.mjs**: Added `getHostIP()` function for automatic IP detection
- **test-client.js**: Uses `process.env.HOST` or localhost
- **demo-showcase.js**: Full IP support with environment variables
- **test-client.html**: URL parameters support (?host=IP&port=PORT)

### Key Code Changes
```javascript
// Auto IP detection in server.mjs
const HOST = process.env.HOST || (await getHostIP()) || 'localhost';

async function getHostIP() {
    const { stdout } = await execAsync("hostname -I | awk '{print $1}'");
    return stdout.trim();
}
```

```bash
# Process tracking in launcher
record_pid() {
    echo "$1:$2" >> "$PID_FILE"
}

# Graceful shutdown
trap cleanup_demo EXIT INT TERM
```

## Check

### What Worked
- ✅ Real IP (172.30.0.2) successfully detected and used
- ✅ Server accessible via real IP: http://172.30.0.2:8080
- ✅ All clients connect using real IP address
- ✅ Graceful shutdown properly terminates processes
- ✅ Process tracking prevents orphaned processes

### Test Results
```bash
# Server health check with real IP
curl http://172.30.0.2:8080/health
# Result: {"status":"healthy","serverIOR":"web4://172.30.0.2:8080/..."}

# Client test with IP
HOST=172.30.0.2 node test-client.js
# Result: Successfully connected and exchanged scenarios

# Process management
ps -edalf | grep -E "(server.mjs|launch-demo)"
# Shows: Clean process tree with proper PIDs
```

### Improvements Made
- No more hardcoded localhost references
- Proper process lifecycle management
- Clean shutdown without orphaned processes
- Network-ready for multi-machine testing

## Act

### Immediate Benefits
1. Demo can be accessed from other machines on network
2. Clean process management prevents resource leaks
3. Easy troubleshooting with clear process tracking
4. Professional lifecycle management

### Usage Instructions
```bash
# Start demo with real IP
cd examples/multi-env-demo
./launch-demo-v2.sh

# Access from another machine
curl http://172.30.0.2:8080/health

# Stop demo gracefully
./stop-demo.sh
```

### Future Enhancements
1. Add Docker support for containerized demos
2. Implement service discovery for automatic peer finding
3. Add network interface selection option
4. Create systemd service files for production

### Key Achievement
The ONCE demo now properly uses real network addresses and manages its lifecycle professionally, making it suitable for real network testing and demonstrations across multiple machines.

## Dual Links

**PDCA History**: [Demo Visualization](./2025-08-28-UTC-2325-once-demo-visualization.md) → **[IP & Lifecycle Improvements](./2025-08-28-UTC-2341-demo-ip-lifecycle-improvements.md)**

**GitHub Links**: [View on GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-28-UTC-2227/scrum.pmo/project.journal/2025-08-28-UTC-2227-session-start/pdca/2025-08-28-UTC-2341-demo-ip-lifecycle-improvements.md) | [Local File](./2025-08-28-UTC-2341-demo-ip-lifecycle-improvements.md)