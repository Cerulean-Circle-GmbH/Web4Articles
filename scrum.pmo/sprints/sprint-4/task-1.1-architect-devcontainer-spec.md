[Back to Planning](./planning.md) | [Back to Task 1](./task-1.md)

# Task 1.1: Architect — Devcontainer Spec (Requirements, Tooling, PATH & Mounts)
[subtask:uuid:3f2e6a7b-8c9d-4e0f-a1b2-c3d4e5f6a7b8]

## Status
- [ ] Planned
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Traceability
- up
  - [requirement:uuid:8b3e7c2d-7f1a-4a89-9e3d-1f2a4b6c8d0e](./requiremnents.md)
  - [Task 1](./task-1.md)

## Task Description
Produce a precise devcontainer specification covering base image, Node.js version, required tools (bash/coreutils, PlantUML, Graphviz), project mount at git root, environment variables, and PATH. Define validation commands (tests, PUML render).

## Steps
- Select minimal base image and Node version
- Define required packages and install steps
- Specify mounts, workspaceFolder, and PATH
- List validation commands (npm test, plantuml -tsvg -failfast2)

## Acceptance Criteria
- Spec document explicitly lists base image, Node version, packages, mounts, PATH, and validation commands
- Spec reviewed and accepted by DevOps and ScrumMaster

## QA Audit & User Feedback
- [ ] [UTC timestamp] QA review pending.
- [ ] [UTC timestamp] Feedback to be collected after subtask completion.