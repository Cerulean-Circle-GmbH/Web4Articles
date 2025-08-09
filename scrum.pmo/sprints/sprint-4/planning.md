# Sprint 4 Planning

## Sprint Goal
Deliver a cross-platform devcontainer that standardizes local and CI environments for Web4Articles. The devcontainer will include Node.js (matching engine requirements), bash/coreutils, PlantUML + Graphviz, and optional GitHub CLI. It must mount the project at the git root, set PATH correctly, and support running tests and PlantUML renders identically to local.

## Task List (Sprint 4)

- [ ] [Task 1: Devcontainer Definition and Validation](./task-1.md)
  **Priority:** 1
  - [ ] [Task 1.1: Architect — Devcontainer Spec (Requirements, Tooling, PATH & Mounts)](./task-1.1-architect-devcontainer-spec.md)
  - [ ] [Task 1.2: DevOps — Create Devcontainer Files (`.devcontainer/devcontainer.json`, `Dockerfile`)](./task-1.2-devops-create-devcontainer-files.md)
  - [ ] [Task 1.3: DevOps — Integrate PlantUML/Graphviz and Validate Rendering](./task-1.3-devops-plantuml-graphviz.md)
  - [ ] [Task 1.4: Tester — Verify Tests and CLI Commands Run Equally in Devcontainer](./task-1.4-tester-validate-in-container.md)
  - [ ] [Task 1.5: PO — Update README and User Guide for Devcontainer Usage](./task-1.5-po-update-readme-user-guide.md)
  - [ ] [Task 1.6: ScrumMaster — Add CI Step to Build/Use Devcontainer for Validation](./task-1.6-scrummaster-ci-validate-devcontainer.md)

## Notes
- Do not build/publish images in this sprint; only define and validate locally.
- Ensure Node.js version aligns with engine warnings (e.g., `execa`, `vite`).
- Prefer minimal base image and layer caching for fast onboarding.

