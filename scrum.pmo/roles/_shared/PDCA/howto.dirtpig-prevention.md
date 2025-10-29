# How to Dirtpig Prevention: Development Discipline and Clean Code Hygiene

**Template Version:** 1.0.0  
**Last Updated:** 2025-10-28  
**Audience:** AI Agents, Developers  
**CMM Level:** CMM3 (Defined Process)

---

## 🎯 Purpose

Teach agents to maintain clean codebases by preventing temporary debug files and development artifacts from polluting the project. This is about **discipline**, not tooling.

---

## 🧹 The Dirtpig Problem

**Definition:** A "dirtpig" is any temporary file, debug script, or development artifact that gets created during troubleshooting and forgotten, cluttering the project root.

### **Common Dirtpig Examples:**
```bash
# Debug files
test-cli-debug.js
test-cli-debug.mjs
debug.log
temp.txt
output.json

# Leftover test artifacts
test-output/
temp-test-data/
debug-scenarios/

# Editor/IDE temporaries
.vscode/settings.json  # (if not in .gitignore)
.idea/workspace.xml
*.swp
```

### **Why This Happens:**
1. Agent encounters an error
2. Agent creates a quick debug file to investigate
3. Agent fixes the issue
4. Agent forgets to clean up
5. **Dirtpig created** 🐷

---

## ❌ Why `.gitignore` is NOT the Solution

**The Myth:** "Just add it to `.gitignore` and the problem goes away."

**The Reality:**
- `.gitignore` **hides** the mess, doesn't **prevent** it
- The root cause is **lack of discipline**, not git visibility
- Future agents will create different temp files with different names
- `.gitignore` becomes a graveyard of past mistakes
- The project directory still contains garbage

**Analogy:** `.gitignore` is like sweeping dirt under the rug. The dirt is still there, you just can't see it.

---

## ✅ The CMM3 Solution: Discipline, Not Tooling

### **Core Principle:**
**"Prevention beats cleanup. Don't create the mess in the first place."**

### **CMM3 Discipline Protocol:**

#### **1. DON'T Create Temp Files in Project Root**
❌ **Wrong:**
```bash
# Agent creates debug file in project root
echo "console.log('debug');" > test-cli-debug.js
node test-cli-debug.js
# Agent forgets to delete it
```

✅ **Right:**
```bash
# Use proper test directory
cat > test/ts/debug/CliDebug.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { Web4TSComponentCLI } from '../../../src/ts/layer5/Web4TSComponentCLI.js';

describe('CLI Debug', () => {
  it('should instantiate CLI', () => {
    const cli = new Web4TSComponentCLI();
    expect(cli).toBeDefined();
  });
});
EOF

# Run test
npx vitest run test/ts/debug/CliDebug.test.ts

# Test file is in proper location, properly named, can be committed if useful
```

#### **2. USE Proper Test Files in `test/` Directory**
- All debugging should use proper test files
- Test files follow naming convention: `*.test.ts`
- Test files are in proper directory structure: `test/ts/layer*/`
- Test output goes to: `test/data/`
- Tests can be committed if they add value

#### **3. DELETE Immediately If You Slip Up**
If you DO create a temp file:
```bash
# Realize the mistake immediately
rm test-cli-debug.js test-cli-debug.mjs

# Commit the deletion if already tracked
git rm test-cli-debug.js test-cli-debug.mjs
git commit -m "Cleanup: Remove dirtpig debug files left by agent during development"
```

#### **4. COMMIT Cleanup with Honest Message**
Don't hide your mistakes. Own them and learn from them:
```bash
# Good commit message
git commit -m "Cleanup: Remove dirtpig debug files (test-cli-debug.js/mjs) left by agent during development"

# Bad commit message (hiding the problem)
git commit -m "Update files"
```

---

## 📋 Dirtpig Detection Checklist

Before committing ANY changes, run this mental checklist:

- [ ] Did I create any temp files in project root?
- [ ] Are there any `test-*.js` files that aren't in `test/`?
- [ ] Are there any `debug-*.log` files?
- [ ] Are there any `temp-*` directories?
- [ ] Did I create any files with my agent/request ID in the name?
- [ ] Are all test outputs in `test/data/`?

If you answer YES to any of these, **CLEAN UP IMMEDIATELY**.

---

## 🎓 Real Example: Web4TSComponent 0.3.17.0

**Date:** 2025-10-28  
**Session:** test-hang-investigation  
**PDCA:** [2025-10-28-UTC-1632.test-hang-investigation.pdca.md](../../../components/Web4TSComponent/0.3.17.0/session/2025-10-28-UTC-1632.test-hang-investigation.pdca.md)

### **What Happened:**
1. Agent was investigating why `web4tscomponent test file` hung
2. Agent needed to test CLI instantiation in isolation
3. Agent created `test-cli-debug.js` and `test-cli-debug.mjs` in project root
4. Agent fixed the issue (missing `encoding: 'utf-8'`)
5. Agent **FORGOT TO DELETE** the debug files
6. User discovered them later: *"either its in the tests or its a dirtpig leftover"*

### **The Mistake:**
```bash
# Files created in project root (WRONG!)
components/Web4TSComponent/0.3.17.0/test-cli-debug.js
components/Web4TSComponent/0.3.17.0/test-cli-debug.mjs
```

### **The Fix:**
```bash
# Agent deleted files
rm test-cli-debug.js test-cli-debug.mjs

# Agent committed cleanup
git commit -m "Cleanup: Remove dirtpig debug files (test-cli-debug.js/mjs) left by agent during development"
```

### **The Lesson:**
**User's Teaching:** *"preventing dirtpigs is preventing you... you DID the leftover!!! .gitignore will not make you clean"*

**Key Insight:** The problem isn't the tool (`.gitignore`), it's the **agent's discipline**. The agent must develop the habit of cleaning up immediately, not relying on tooling to hide mistakes.

---

## 🚀 Prevention Strategies

### **Strategy 1: Use Proper Test Structure**
```
test/
├── ts/
│   ├── layer2/
│   │   └── Component.test.ts       # ✅ Proper test
│   ├── layer5/
│   │   └── CLI.test.ts             # ✅ Proper test
│   └── debug/
│       └── QuickDebug.test.ts      # ✅ Even debug tests go here
├── data/                            # ✅ Test output directory
└── scenarios/                       # ✅ Test fixtures
```

### **Strategy 2: Always Ask "Where Should This Live?"**
Before creating ANY file, ask:
- Is this a test? → `test/ts/`
- Is this test output? → `test/data/`
- Is this documentation? → `session/` or `docs/`
- Is this source code? → `src/ts/`
- **Is this temporary?** → ❌ **DON'T CREATE IT**

### **Strategy 3: Use `npx tsx` for One-Off Scripts**
If you absolutely need to run a one-off debug script:
```bash
# Don't create a file, run inline
npx tsx -e "import('./src/ts/layer5/CLI.js').then(m => console.log(m))"

# Or use stdin
npx tsx << 'EOF'
import { CLI } from './src/ts/layer5/CLI.js';
const cli = new CLI();
console.log('Success:', cli);
EOF
```

### **Strategy 4: Clean As You Go**
Don't wait until the end of the session. Clean up immediately after each debug session:
```bash
# After debugging
rm debug-*.log temp-* test-*.js

# Verify clean
git status
# Should show no untracked files
```

---

## 🎯 CMM3 Compliance

### **CMM1 (Chaos):**
- Creates temp files everywhere
- Never cleans up
- Project littered with `debug1.js`, `test2.log`, `temp-output/`
- No discipline, no process

### **CMM2 (Template Following):**
- Uses `.gitignore` to hide temp files
- Still creates them, just hides them
- "Out of sight, out of mind" mentality
- Tooling-dependent, not discipline-dependent

### **CMM3 (Defined Process):**
- **Never creates temp files in the first place**
- Uses proper test structure for ALL debugging
- Cleans up immediately if mistakes happen
- Process-driven, not tooling-driven
- **This is the target level**

### **CMM4 (Feedback Loop Mastery):**
- Reviews own work after each session
- Learns from past dirtpigs
- Develops muscle memory for clean development
- Teaches other agents

---

## 📊 Success Metrics

**How to measure dirtpig prevention success:**

1. **Zero Untracked Files:**
   ```bash
   git status
   # Should show: "nothing to commit, working tree clean"
   ```

2. **Clean Project Root:**
   ```bash
   ls components/*/
   # Should only show: src/ test/ dist/ package.json README.md etc.
   # Should NOT show: test-*.js debug-*.log temp-*
   ```

3. **Proper Test Structure:**
   ```bash
   find test/ -name "*.js" -not -path "test/data/*"
   # Should return: empty (all tests are .ts in proper structure)
   ```

---

## 🔗 Related Documentation

- [How to Agent Safety Protocols](./howto-agent-safety-protocols.md) - Interactive commands, timeouts, safety
- [How to Test-First](./howto.test-first.md) - Proper test structure and discipline
- [How to PDCA](./howto.PDCA.md) - Documenting learnings and mistakes

---

## 💡 Quick Reference Card

**Dirtpig Prevention in 4 Rules:**

1. ❌ **DON'T** create temp files in project root
2. ✅ **USE** proper test files in `test/ts/`
3. ✅ **DELETE** immediately if you slip up
4. ✅ **COMMIT** cleanup with honest message

**Remember:** Prevention is discipline, not tooling. Clean as you go. 🧹

---

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO).** 🤝✨

---

*Dirtpig prevention achieved through systematic discipline and CMM3 process excellence.*

