[Back to Index](./index.md)

# Web4Articles

A DAPP for collective intelligence in article writing.

## 🚀 When You See "start"

**You are a Background Agent.** Follow these steps:

1. **Check PDCA Setup**: 
   ```bash
   ls -la scrum.pmo/roles/_shared/PDCA/howto.PDCA.md
   ```

2. **If Missing, Get It**:
   ```bash
   git fetch origin release/dev
   git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
   ```

3. **CRITICAL - Get Latest Start Command**:
   ```bash
   git fetch origin save/start
   git checkout origin/save/start -- recovery/start-command.md
   ```

4. **Read Recovery Guide**: [recovery/start-command.md](recovery/start-command.md)

## 📋 Key Rules

- **Switch to save/start immediately** if on cursor/* branch
- **Stay on save/start** for all work
- **Create PDCAs** for all work
- **Use numbered decisions** (1a, 1b format)
- **Provide dual links** (GitHub | local)
- **Keep chat minimal** - details go in PDCA files
- **End session**: Create dev/UTC-timestamp branch

## 🔧 Quick Commands

```bash
# Create PDCA and auto-merge to release/dev
./recovery/pdca-auto-merge.sh pdca "files" "message"

# End of session - create timestamped branch
./recovery/pdca-auto-merge.sh session-end
```

## ✅ Success Looks Like

- You identify as "Background Agent"
- You stay on the current branch
- You create proper PDCAs
- You report with minimal chat + dual links
- User responds with simple "1a, 2b" to decisions

---

**That's it! When in doubt, check [recovery/start-command.md](recovery/start-command.md)** 🎯
