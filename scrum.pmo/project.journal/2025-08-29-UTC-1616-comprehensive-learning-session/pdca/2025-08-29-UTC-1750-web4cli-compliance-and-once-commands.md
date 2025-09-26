# 📋 **PDCA Cycle: Web4CLI Compliance Implementation and ONCE Command Enhancement**

**📅 Date:** 2025-08-29 UTC 18:50  
**🎯 Objective:** Fix ONCE CLI to comply with Web4CLI requirements and enhance with start/stop commands  
**👤 Role:** Developer  
**🚨 Issues:** CLI used non-compliant --options flags and needed graceful server management  
**📎 Previous Commit:** 4012ad7 - Fix ONCE CLI: star→start typo, remove --headless flags for headless parameters, add once stop command with PID management per Web4CLI requirements  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/scrum.pmo/project.journal/2025-08-29-UTC-1616-comprehensive-learning-session/pdca/2025-08-29-UTC-1745-requirement-show-command-implementation.md) | [../2025-08-29-UTC-1745-requirement-show-command-implementation.md](../2025-08-29-UTC-1745-requirement-show-command-implementation.md)  

## 📋 **Summary**

### **Artifact Links**
- [GitHub: OnceCLI.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/components/ONCE/0.1.0.0/src/ts/layer5/OnceCLI.ts) | [components/ONCE/0.1.0.0/src/ts/layer5/OnceCLI.ts](components/ONCE/0.1.0.0/src/ts/layer5/OnceCLI.ts)
- [GitHub: Web4CLI Requirements](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/main/spec/requirements.md) | [spec/requirements.md](spec/requirements.md)

### **QA Decisions**
- [x] Typo corrected: `once star` → `once start` 
- [x] Flag elimination: `--headless` → `headless` parameter per Web4CLI radical OOP
- [x] New stop command: `once stop` with PID management and graceful cleanup
- [x] Full Web4CLI compliance: cyan commands, white subcommands, yellow parameters
- [x] Interactive/headless mode support with proper TTY detection

---

## 🎯 **Plan**

### **Web4CLI Compliance Strategy**
1. **Eliminate All Flags:** Remove --headless, --help patterns in favor of parameters
2. **Command Enhancement:** Add missing `once stop` for server lifecycle management  
3. **Color Standards:** Apply consistent cyan/white/yellow/green color scheme
4. **PID Management:** Implement proper process tracking for graceful shutdown
5. **Usage Standardization:** Follow Usage, Commands, Parameters, Examples structure

### **Technical Implementation**
- Replace flag-based arguments with parameter-based Web4 OOP approach
- Implement PID file system for server process coordination
- Add TTY detection for interactive vs headless behavior
- Ensure proper signal handling and cleanup procedures

---

## 🔧 **Do**

### **Web4CLI Compliance Implementation**
1. **✅ Typo Correction:** Fixed embarrassing `once star` → `once start` command name
2. **✅ Flag Elimination:** Removed all `--options` patterns:
   - `once demo --headless` → `once demo headless`
   - `once demo --help` → `once demo help`
   - `once start --headless` → `once start headless`
3. **✅ Stop Command Added:** New `once stop` with comprehensive PID management
4. **✅ Headless Mode Enhancement:** Proper TTY detection and mode switching
5. **✅ Color Standards Applied:** Full compliance with requirement 71223733-75d1-4002-bee1-e004d5ccd76c

### **Technical Features Implemented**
```typescript
// PID Management System
const pidFile = path.join(oncePath, '.once-server.pid');
await import('fs').then(fs => fs.promises.writeFile(pidFile, npmProcess.pid?.toString() || ''));

// Interactive Mode Detection  
if (!isHeadless && process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  // ... keyboard handling
}

// Graceful Stop Implementation
process.kill(pid, 'SIGTERM');
setTimeout(() => process.kill(pid, 'SIGKILL'), 2000);
```

---

## ✅ **Check**

### **QA Feedback**
*User Request: "bad typo of mine...little ashamed... scripts/once star should be scripts/once start remove --headless and replace it by parameter <headless> add once stop that gracefully stops the running server." - 2025-08-29T18:50:00Z*

### **Verification Results**
1. **✅ Command Structure:** New usage follows Web4CLI requirements perfectly
   - Usage, Commands, Parameters, Examples sections implemented
   - No flags anywhere in the interface
   - Clean parameter-based OOP design

2. **✅ Functional Testing:**
   - `scripts/once` shows proper usage with corrected commands
   - `once start` launches interactive npm server with 'q' to quit
   - `once start headless` runs non-interactively with stop command guidance
   - `once stop` finds and terminates running server via PID file

3. **✅ Color Compliance:**
   - Cyan: `once` (shell command)
   - White: `demo`, `start`, `stop` (subcommands)  
   - Yellow: `headless`, `q`, parameters
   - Green: Feature descriptions (bullet points)

4. **✅ Process Management:**
   - PID file creation/cleanup working correctly
   - SIGTERM/SIGKILL cascade for graceful shutdown
   - Stale PID detection and cleanup implemented

---

## 🚀 **Act**

### **PDCA Process Update**
- **Web4CLI Standards Applied:** All three global requirements now enforced in ONCE CLI
- **User Experience Enhanced:** Professional server lifecycle management with clear feedback
- **OOP Purity Maintained:** Zero flags, pure command-parameter design achieved
- **Error Prevention:** Robust PID management prevents orphaned processes

### **Architectural Benefits**
1. **Consistency:** ONCE CLI now matches requirement CLI patterns exactly
2. **Maintainability:** Clear command structure easier to extend and modify
3. **User Experience:** Predictable interface following Web4 ecosystem standards
4. **Process Safety:** Proper cleanup prevents resource leaks and zombie processes

### **Implementation Evidence**
```bash
# Before (non-compliant)
once star --headless

# After (Web4CLI compliant)
once start headless
once stop
```

### **Future Enhancements**
- Consider adding `once restart` command for convenience
- Evaluate adding status monitoring (`once status`)
- Explore integration with system service managers

---

**📋 One-line Summary:** Successfully implemented Web4CLI compliance in ONCE CLI with start/stop commands, eliminated all flags for parameter-based OOP design, and added robust PID management for graceful server lifecycle control 🎯✅🚀
