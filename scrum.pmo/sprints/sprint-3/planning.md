[Back to Sprints](../)

# Sprint 3 Planning

## Sprint Goal
Deliver a comprehensive `GitScrumProject` tool that can create new GitHub repositories from this project as a template, referencing the application source as a git submodule rather than copying sources. Ensure the resulting dual-repo setup (wrapper project + source submodule) has a concise, easy release and recovery process documented and automated. Follow project principles: strict TypeScript ESM, positional CLI, radical OOP, and no Jest.

## Task List (Sprint 3)

- [ ] [Task 1.0: Architect - GitScrumProject Templating Spec (PUML + CLI UX)](./task-1.0-architect-gitscrumproject-spec.md)
  **Priority:** 1
- [ ] [Task 1.1: Developer - Scaffold New Repo via CLI and GitHub](./task-1.1-developer-repo-scaffold.md)
  **Priority:** 2
- [ ] [Task 1.2: Developer - Submodule Integration and Runtime Overlay](./task-1.2-developer-submodule-runtime.md)
  **Priority:** 3
- [ ] [Task 1.3: DevOps/Developer - Release & Recovery Automation (Both Repos)](./task-1.3-devops-release-recovery.md)
  **Priority:** 4
- [ ] [Task 1.4: Tester - E2E and Unit Tests](./task-1.4-tester-e2e-tests.md)
  **Priority:** 5
- [ ] [Task 1.5: PO - User Guide and Acceptance](./task-1.5-po-user-guide.md)
  **Priority:** 6
- [ ] [Task 1.6: Docs - Embed Generated SVG Diagrams in Markdown](./task-1.6-docs-embed-svgs.md)
  **Priority:** 7
- [ ] [Task 1.7: PO — Plan Sprint 1 for TLA.scrum.pmo (wrapper project)](./task-1.7-po-plan-tla-sprint-1.md)
  **Priority:** 8

---

Process notes:
- Commands must be positional only, e.g., `GitScrumProject createTemplateRepo <org> <newRepo> <sourceRepoUrl> <submodulePath>` and `GitScrumProject releasePlan <repoType>`.
- Use `gh` CLI or `@octokit/rest` via ESM as needed; prefer `gh` for simplicity and auditability (shell-visible).
- Ensure `.github/workflows/` templates and recovery docs are generated into the target repo during scaffold.
