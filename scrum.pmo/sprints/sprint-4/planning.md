# Sprint 4 Planning

## Sprint Goal
Deliver a cross-platform devcontainer that standardizes local and CI environments for Web4Articles. The devcontainer will include Node.js (matching engine requirements), bash/coreutils, PlantUML + Graphviz, and optional GitHub CLI. It must mount the project at the git root, set PATH correctly, and support running tests and PlantUML renders identically to local.

## Task List (Sprint 4)

- [ ] Task 1.0: Architect — Devcontainer Spec (Requirements, Tooling, PATH & Mounts)
- [ ] Task 1.1: DevOps — Create Devcontainer Files (`.devcontainer/devcontainer.json`, `Dockerfile`)
- [ ] Task 1.2: DevOps — Integrate PlantUML/Graphviz and Validate Rendering in Container
- [ ] Task 1.3: Tester — Verify Tests and CLI Commands Run Equally in Devcontainer
- [ ] Task 1.4: PO — Update README and User Guide for Devcontainer Usage
- [ ] Task 1.5: ScrumMaster — Add CI Step to Build/Use Devcontainer for Validation (No release yet)

## Notes
- Do not build/publish images in this sprint; only define and validate locally.
- Ensure Node.js version aligns with engine warnings (e.g., `execa`, `vite`).
- Prefer minimal base image and layer caching for fast onboarding.

