[Back to Roles](../)

# ReleaseIntegrationAgent — Process

## Mission

Ensure safe, auditable, and timely integration of feature/retro branches into `release/dev` and `main` without loss of canonical assets (journals, workflows, templates, QA logs). Eliminate brittle shell fiddling by using deterministic tools and templates.

## Principles

- Start from `release/dev`; create an integration branch
- Recovery ownership: Recovery is performed only by the ScrumMaster. This role must not initiate or document recovery flows.
- Protect paths: `.github/workflows/**`, `scrum.pmo/project.journal/**`, `scrum.pmo/templates/**`, `qa-feedback-log.md`
- Prefer add/modify-only merges; avoid deletions unless explicitly approved
- Always journal: add `project.state.md` and `branch-overview.md`
- Commit and push after each modifying step

## Inputs

- Target branch to integrate (e.g., `origin/feature/ontology-agent`)
- Current `release/dev` state
- CI reports and open PRs

## Procedure

1) Integration Branch Setup
```bash
git fetch origin
git checkout release/dev && git pull --ff-only origin release/dev
TS=$(date -u +"%Y-%m-%d-%H%M")
git checkout -b "cursor/release-integration-${TS}"
```

2) Journal Entry
```bash
mkdir -p scrum.pmo/project.journal/${TS}
cp scrum.pmo/templates/project.state.template.md scrum.pmo/project.journal/${TS}/project.state.md
cp scrum.pmo/templates/branch-overview.template.md scrum.pmo/project.journal/${TS}/branch-overview.md
# Fill placeholders and unresolved PRs using CI or local scripts
git add scrum.pmo/project.journal/${TS} && git commit -m "docs(journal): start release integration ${TS}"
```

3) Safe Import (roles/process changes)
```bash
# Import role folders or process files add/modify-only
SRC=origin/feature/ontology-agent
git checkout ${SRC} -- scrum.pmo/roles/OntologyAgent
git add scrum.pmo/roles/OntologyAgent
git commit -m "docs(roles): import OntologyAgent role updates from ${SRC}"
```

4) Three-way Merge for conflicting process docs
```bash
BASE=$(git merge-base origin/release/dev ${SRC})
for f in $(git ls-tree -r --name-only ${SRC} scrum.pmo/roles | grep '/process.md$'); do
  git show ${BASE}:$f > /tmp/base 2>/dev/null || true
  git show origin/release/dev:$f > /tmp/current 2>/dev/null || true
  git show ${SRC}:$f > /tmp/feature 2>/dev/null || true
  if [ -s /tmp/current ]; then
    git merge-file -p /tmp/current /tmp/base /tmp/feature > $f || true
    git add $f
  else
    git checkout ${SRC} -- $f && git add $f
  fi
done
git commit -m "docs(roles): integrate process.md via 3-way merge (${SRC})"
```

5) Verify and Journal
```bash
tsranger test "status capture" || true
git add scrum.pmo/project.journal/${TS}/branch-overview.md
git commit -m "docs(journal): capture branch/PR state after integration steps"
```

6) Open PR to release/dev
```bash
gh pr create -B release/dev -t "Release integration ${TS}" -b "Includes role/process updates and journal entry" || true
```

## Outputs

- Updated `release/dev` with imported role/process changes
- Journal entry documenting state and decisions
- Open PR for review

## Templates

See `templates/` in this role for checklists and PR bodies.

## PDCA

- After each integration, add a PDCA record under `PDCA/` capturing issues and improvements.

