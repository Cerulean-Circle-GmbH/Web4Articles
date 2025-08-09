[Back to Planning](./planning.md)

# Sprint 4 — Requirements

- [ ] Cross-platform devcontainer standardizes local and CI environments
  [requirement:uuid:8b3e7c2d-7f1a-4a89-9e3d-1f2a4b6c8d0e]
  > Provide a reproducible development environment via a devcontainer that mounts the git root, sets PATH, and mirrors local execution.

- [ ] Include Node.js, bash/coreutils, PlantUML, and Graphviz
  [requirement:uuid:1a2b3c4d-5e6f-47a8-9b0c-1d2e3f4a5b6c]
  > Ensure Node.js version matches engine ranges; include PlantUML and Graphviz to render `src/puml` diagrams inside the container.

- [ ] Do not publish images; validate locally and in CI
  [requirement:uuid:9c8d7e6f-5a4b-3c2d-1e0f-9a8b7c6d5e4f]
  > Build the devcontainer locally and in CI for validation only; no registry push in this sprint.

- [ ] Add CI step that builds and validates the devcontainer
  [requirement:uuid:0f1e2d3c-4b5a-6c7d-8e9f-0a1b2c3d4e5f]
  > CI should build the devcontainer and run tests and a PlantUML render to ensure parity with local.

- [ ] Minimal base image and fast layer caching
  [requirement:uuid:f6e5d4c3-b2a1-4c5d-9e8f-7a6b5c4d3e2f]
  > Use a slim base with explicit tools; optimize Dockerfile layers for quick rebuilds.