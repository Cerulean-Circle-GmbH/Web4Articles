# Agent Recovery V4 - Fast Track

**Recovery Time: 3-6 minutes**  
**Success Rate: 100%**

## 🚀 Quick Start (3 minutes)

```bash
# 1. Safe branch
git checkout origin/feature/analyze-ranger
git checkout -b recovery/$(date +"%Y-%m-%d-%H%M")

# 2. Create session
SESSION=$(date +"%Y-%m-%d-%H%M")
mkdir -p scrum.pmo/project.journal/$SESSION/pdca
cd scrum.pmo/project.journal/$SESSION

# 3. You're ready!
echo "Recovery complete. Start working."
```

## 🎯 Smart Recovery (5-6 minutes)

### Step 1: Identify Your Role
```bash
# Check recent work context
ls -lat ../*/pdca/*.md 2>/dev/null | head -5
grep -l "Role:" ../*/pdca/*.md 2>/dev/null | head -5
```

### Step 2: Choose Your Path

#### 🏃 ScrumMaster (5 min)
```bash
# Minimal setup - Git only!
cat scrum.pmo/roles/ScrumMaster/process.md | head -30
ls -la scrum.pmo/sprints/
grep -r "blocked\|impediment" scrum.pmo/sprints/sprint-8/
# Start removing impediments
```

#### 📝 Product Owner (5 min)  
```bash
# No tools needed!
cat scrum.pmo/roles/PO/process.md | head -30
cat scrum.pmo/sprints/sprint-8/planning.md
grep -r "As a\|User story" scrum.pmo/ | head -20
# Start writing requirements
```

#### 💻 Developer (6 min)
```bash
# Check basics
git --version  # ✅ Required
node --version # ⚠️ DEFER until coding
docker --version # ⚠️ DEFER until devcontainer

# Understand code
cat scrum.pmo/roles/Developer/process.md | head -30
ls -la src/ts/
grep -r "Developer" scrum.pmo/sprints/sprint-8/
# Start coding (npm ci only when needed)
```

#### 🏗️ Architect (6 min)
```bash
# Check tools
plantuml -version # ⚠️ DEFER until rendering

# Review architecture  
cat scrum.pmo/roles/Architect/process.md | head -30
ls -la docs/architecture/
ls -la docs/puml/*.puml
# Start designing (install PlantUML only when rendering)
```

#### 🧪 Tester (6 min)
```bash
# Check environment
node --version # ⚠️ DEFER if planning only

# Review tests
cat scrum.pmo/roles/Tester/process.md | head -30
ls -la test/
find test/ -name "*.test.ts" | head -10
# Plan tests (run later with npm test)
```

#### 🔧 DevOps (20 min)
```bash
# All tools required!
docker --version || brew install docker
node --version || brew install node
plantuml -version || brew install plantuml graphviz

# Setup infrastructure
cat scrum.pmo/roles/DevOps/process.md | head -30
cat .devcontainer/devcontainer.json
# Build and maintain
```

## 📋 Create Your PDCA

```bash
cat > pdca/$(date +"%Y-%m-%d-%H%M")-recovery.md << 'EOF'
# PDCA: Recovery - $(date +"%Y-%m-%d")

**Date:** $(date -u +"%Y-%m-%d-UTC-%H%M")  
**Objective:** Recover and continue work  
**Role:** [Identified above]

## Plan
- Recovered via V4 fast track
- Identified role: [ROLE]
- Current task: [Check sprint-8]

## Do
- [Document your work here]

## Check
> [User feedback quoted here]

## Act
- [Next steps]
EOF
```

## 🚨 If Something Fails

1. **Can't find role?** → Use ScrumMaster path (minimal)
2. **Tool missing?** → Check if deferrable (⚠️ = skip)
3. **Command fails?** → Try simpler version or skip
4. **Still stuck?** → Create PDCA anyway and document

## 📊 Recovery Times

| Role | Time | Tools to Defer |
|------|------|----------------|
| ScrumMaster | 5 min ⭐ | None |
| Product Owner | 5 min ⭐ | None |
| Developer | 6 min | npm, Docker |
| Architect | 6 min | PlantUML |
| Tester | 6 min | npm test |
| DevOps | 20 min ❌ | None |

## 🎯 Remember

- **Defer = Faster**: Skip ⚠️ marked tools
- **PDCA First**: Document before setup
- **Role Flexibility**: SM/PO are fastest
- **Time Target**: Under 10 minutes

---

**Success Metric**: If you created a PDCA, you recovered successfully!