[Back to Project State](./project.state.md)

# Repository Tree Index — 2025-08-17-1028 UTC

```
.
|-- .cleanup-config.json
|-- .cspell.json
|-- .github
|   |-- chatmodes
|   |   `-- ScrumMaster2QA.chatmode.md
|   `-- workflows
|       |-- auto-merge-release-dev.yml
|       |-- branch-cleanup-report.yml
|       |-- cleanup-eod.yml
|       |-- eod-merge.yml
|       |-- feature-to-dev.yml
|       |-- license-headers.yml
|       |-- quality-checks.yml
|       |-- recovery-integrity.yml
|       |-- roles-auto-pr.yml
|       |-- roles-pr-scan.yml
|       `-- sync-production.yml
|-- .gitignore
|-- .gitmodules
|-- AI-GPL.md
|-- COMMIT_PUSH_POINT.md
|-- Documentation
|   |-- Build_and_Deployment_Guide.md
|   |-- Glossary.md
|   |   |-- AgentRoles.md
|   |   |-- Methodology.md
|   |   |-- README.md
|   |   `-- TechnicalTerms.md
|   |-- README.md
|   `-- Requirements.md
|-- LICENSE
|-- README.md
|-- articles
|   |-- README.md
|   |-- templates
|   |   |-- article.template.md
|   |   `-- research.template.md
|   `-- writing
|       |-- README.md
|       |-- web4-architecture.md
|       `-- web4-philosophy.md
|-- components
|   |-- GitScrumProject
|   |   |-- README.md
|   |   |-- docs
|   |   |   |-- planning.md
|   |   |   `-- requirements.md
|   |   |-- src
|   |   |   |-- GitHubRepo.ts
|   |   |   |-- GitScrumProject.ts
|   |   |   `-- SubmoduleManager.ts
|   |   |-- test
|   |   |   `-- GitScrumProject.test.ts
|   |   `-- vitest.config.ts
|   |-- TSRanger
|   |   |-- README.md
|   |   |-- v2.5
|   |   |   |-- src
|   |   |   |   |-- README.md
|   |   |   |   |-- TSCompletion.ts
|   |   |   |   |-- TSsh.ts
|   |   |   |   |-- TSshCLI.ts
|   |   |   |   |-- core
|   |   |   |   |   |-- DefaultCLI.ts
|   |   |   |   |   |-- Logger.ts
|   |   |   |   |   |-- TSshProject.ts
|   |   |   |   |   `-- readme.md
|   |   |   |   |-- docs
|   |   |   |   |   |-- tssh-architecture-structure.puml
|   |   |   |   |   `-- tssh-architecture.puml
|   |   |   |   `-- layer4
|   |   |   |       |-- CompletionEngine.ts
|   |   |   |       |-- README.md
|   |   |   |       |-- RangerController.ts
|   |   |   |       |-- TSCompletion.ts
|   |   |   |       |-- TSRanger.ts
|   |   |   |       `-- TSsh.ts
|   |   |   `-- test
|   |   |       |-- README.md
|   |   |       `-- TSsh.test.ts
|   |   |-- v3.n14.4
|   |   |   |-- README.md
|   |   |   |-- package.json
|   |   |   `-- tsconfig.n14.json
|   |   `-- v3.njs14
|   |       |-- README.md
|   |       |-- package.json
|   |       `-- tsconfig.njs14.json
|   `-- TreeIndexGenerator
|       `-- v1.0
|           |-- README.md
|           |-- docs
|           |   `-- specification.md
|           |-- src
|           |   |-- TreeGenerator.ts
|           |   `-- TreeIndexer.ts
|           |-- test
|           |   `-- TreeGenerator.test.ts
|           `-- vitest.config.ts
|-- dist
|   |-- css
|   |   `-- styles.css
|   |-- index.html
|   `-- js
|       `-- main.js
|-- docs
|   |-- BUILD.md
|   |-- CONTRIBUTING.md
|   |-- DESIGN.md
|   |-- INSTALLATION.md
|   |-- LICENSE.md
|   |-- README.md
|   |-- TESTING.md
|   |-- puml
|   |   |-- tssh-architecture-structure.puml
|   |   `-- tssh-architecture.puml
|   `-- wiki
|       |-- Home.md
|       |-- Ontology.md
|       `-- README.md
|-- emergency-ontology-agent-recovery-guide.md
|-- handover.backend.agent.md
|-- index.md
|-- index.md.backup
|-- merge-log-20250811-142752.txt
|-- merge-report-20250811-142753.md
|-- merge-report-sprint-9.md
|-- package.json
|-- projects
|   |-- EAMD.ucp
|   |   |-- README copy.md
|   |   |-- readme.md
|   |   `-- specifications.md
|   `-- readme.md
|-- qa-feedback-log.md
|-- recovery.md
|-- scripts
|   |-- cleanup-sprints.sh
|   |-- find-files.sh
|   |-- link-checker.sh
|   |-- markdown-indexer.sh
|   |-- project-status.sh
|   |-- test-recovery-integrity.sh
|   |-- update-journal-overview.sh
|   |-- update-project-index.sh
|   `-- validate-links.sh
|-- scrum.pmo
|   |-- project.journal
|   |   |-- 2025-08-10-0854
|   |   |   `-- project.state.md
|   |   |-- 2025-08-10-1030
|   |   |   |-- branches.checklist.md
|   |   |   |-- project.state.md
|   |   |   `-- retro
|   |   |       |-- 2025-08-10-UTC-1045-retrospective-questions.md
|   |   |       |-- agent-interview.md
|   |   |       |-- answer.BranchFlowArchitect.md
|   |   |       |-- answer.Developer.md
|   |   |       |-- answer.OntologyAgent.md
|   |   |       |-- answer.PO.md
|   |   |       |-- answer.ResearchAgent.md
|   |   |       |-- answer.ScrumMaster.md
|   |   |       |-- answer.Tester.md
|   |   |       |-- comprehensive-retro-summary.md
|   |   |       |-- final-retro-assessment.md
|   |   |       |-- post-retro-plan.md
|   |   |       |-- retro-instructions.md
|   |   |       `-- retro-qalibor-analysis.md
|   |   |-- 2025-08-11-0955
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-11-0957
|   |   |   `-- project.state.md
|   |   |-- 2025-08-11-1641
|   |   |   |-- answer.BranchFlowArchitect.md
|   |   |   |-- branch-overview.dev.md
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-0117
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-0900
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-0923-recovery
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-1039
|   |   |   `-- project.state.md
|   |   |-- 2025-08-12-1102
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-0118
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-0729
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-1022
|   |   |   `-- branch-overview.md
|   |   |-- 2025-08-13-1023
|   |   |   `-- branch-overview.md
|   |   |-- 2025-08-13-1102
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-1526
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-1537
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-13-1557
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-14-1040
|   |   |   |-- branch-overview.md
|   |   |   |-- current-agents.md
|   |   |   |-- ontology-state.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-14-1617
|   |   |   `-- branch-overview.md
|   |   |-- 2025-08-15-0847-demo
|   |   |   `-- project.state.md
|   |   |-- 2025-08-15-0848-demo
|   |   |   |-- project.state.md
|   |   |   `-- tree.index.md
|   |   |-- 2025-08-15-0927
|   |   |   `-- project.state.md
|   |   |-- 2025-08-15-0947-article-writing
|   |   |   |-- pdca
|   |   |   |   |-- role
|   |   |   |   |   `-- researchagent
|   |   |   |   |       `-- 2025-08-15-UTC-0950.md
|   |   |   |   `-- tasks
|   |   |   |       |-- 2025-08-15-UTC-0947-researchagent-core-articles.md
|   |   |   |       |-- 2025-08-15-UTC-0949-researchagent-topic-research.md
|   |   |   |       |-- 2025-08-15-UTC-0951-scrummaster-backlog-updated.md
|   |   |   |       |-- 2025-08-15-UTC-0952-po-user-story-refinement.md
|   |   |   |       `-- 2025-08-15-UTC-0953-developer-article-template.md
|   |   |   |-- project.state.md
|   |   |   `-- tree.index.md
|   |   |-- 2025-08-15-0955-refactor
|   |   |   |-- pdca
|   |   |   |   |-- role
|   |   |   |   |   `-- scrummaster
|   |   |   |   |       `-- 2025-08-15-UTC-0955.md
|   |   |   |   `-- tasks
|   |   |   |       |-- 2025-08-15-UTC-0955-scrummaster-role-transition.md
|   |   |   |       |-- 2025-08-15-UTC-0956-scrummaster-article-status.md
|   |   |   |       |-- 2025-08-15-UTC-0956-scrummaster-tool-audit.md
|   |   |   |       |-- 2025-08-15-UTC-0957-scrummaster-project-refactor.md
|   |   |   |       |-- 2025-08-15-UTC-0958-scrummaster-documentation-review.md
|   |   |   |       |-- 2025-08-15-UTC-0959-scrummaster-recovery-system.md
|   |   |   |       |-- 2025-08-15-UTC-1000-scrummaster-workspace-integration.md
|   |   |   |       |-- 2025-08-15-UTC-1001-scrummaster-project-tools.md
|   |   |   |       |-- 2025-08-15-UTC-1002-scrummaster-completion.md
|   |   |   |       `-- 2025-08-15-UTC-1003-scrummaster-next-steps.md
|   |   |   |-- project.state.md
|   |   |   |-- workspacesMountPoint-tree.index.md
|   |   |   `-- workspacesMountPoint.md
|   |   |-- 2025-08-16-1201-cleanup
|   |   |   |-- active-agents.md
|   |   |   |-- cleanup-plan-all-sprints.md
|   |   |   |-- pdca
|   |   |   |   |-- role
|   |   |   |   |   |-- cicdagent
|   |   |   |   |   |   `-- 2025-08-16-UTC-1257.md
|   |   |   |   |   |-- ontologyagent
|   |   |   |   |   |   `-- 2025-08-16-UTC-1305.md
|   |   |   |   |   |-- releaseintegrationagent
|   |   |   |   |   |   `-- 2025-08-16-UTC-1255.md
|   |   |   |   |   `-- scrummaster
|   |   |   |   |       |-- 2025-08-16-UTC-1202.md
|   |   |   |   |       |-- 2025-08-16-UTC-1203.md
|   |   |   |   |       |-- 2025-08-16-UTC-1204.md
|   |   |   |   |       |-- 2025-08-16-UTC-1242.md
|   |   |   |   |       |-- 2025-08-16-UTC-1245.md
|   |   |   |   |       |-- 2025-08-16-UTC-1248.md
|   |   |   |   |       |-- 2025-08-16-UTC-1250.md
|   |   |   |   |       |-- 2025-08-16-UTC-1252.md
|   |   |   |   |       |-- 2025-08-16-UTC-1254.md
|   |   |   |   |       |-- 2025-08-16-UTC-1256.md
|   |   |   |   |       |-- 2025-08-16-UTC-1258.md
|   |   |   |   |       |-- 2025-08-16-UTC-1300.md
|   |   |   |   |       |-- 2025-08-16-UTC-1302.md
|   |   |   |   |       |-- 2025-08-16-UTC-1303.md
|   |   |   |   |       `-- 2025-08-16-UTC-1306.md
|   |   |   |   `-- tasks
|   |   |   |       |-- 2025-08-16-UTC-1204-scrummaster-sprint-status.md
|   |   |   |       |-- 2025-08-16-UTC-1205-scrummaster-cleanup-plan.md
|   |   |   |       |-- 2025-08-16-UTC-1240-ontologyagent-cleanup-terms.md
|   |   |   |       |-- 2025-08-16-UTC-1243-releaseintegrationagent-cleanup-plan.md
|   |   |   |       |-- 2025-08-16-UTC-1249-cicdagent-pipeline-cleanup.md
|   |   |   |       `-- 2025-08-16-UTC-1304-scrummaster-final-status.md
|   |   |   |-- project.state.md
|   |   |   `-- tree.index.md
|   |   |-- 2025-08-16-1854
|   |   |   |-- branch-overview.md
|   |   |   `-- project.state.md
|   |   |-- 2025-08-16-2052-recovery
|   |   |   |-- pdca
|   |   |   |   `-- tasks
|   |   |   |       |-- 2025-08-16-UTC-2105-ontologyagent-new-terms-from-chat.md
|   |   |   |       `-- 2025-08-16-UTC-2110-ontologyagent-update-indexes.md
|   |   |   |-- project.state.md
|   |   |   |-- tree.index.md
|   |   |   `-- tree.index.tmp
|   |   |-- 2025-08-16-2135-recovery
|   |   |   |-- pdca
|   |   |   |   |-- role
|   |   |   |   |   `-- scrummaster
|   |   |   |   |       `-- 2025-08-16-UTC-2136.md
|   |   |   |   `-- tasks
|   |   |   |       |-- 2025-08-16-UTC-2137-scrummaster-status-review.md
|   |   |   |       |-- 2025-08-16-UTC-2138-scrummaster-doc-analysis.md
|   |   |   |       |-- 2025-08-16-UTC-2139-scrummaster-sprint-audit.md
|   |   |   |       `-- 2025-08-16-UTC-2140-scrummaster-next-phase.md
|   |   |   |-- project.state.md
|   |   |   `-- tree.index.md
|   |   |-- 2025-08-16-2154-sprint12-qa
|   |   |   `-- project.state.md
|   |   |-- 2025-08-16-2154-sprint7
|   |   |   `-- project.state.md
|   |   |-- 2025-08-17-1028-recovery
|   |   |   |-- pdca
|   |   |   |   `-- role
|   |   |   |-- project.state.md
|   |   |   `-- tree.index.md
|   |   `-- project.journal.overview.md
|   |-- roles
|   |   |-- _shared
|   |   |   `-- PDCA
|   |   |       `-- pdca.enhanced.template.md
|   |   |-- Architect
|   |   |   |-- PDCA
|   |   |   |   `-- 2025-08-16-UTC-2258.md
|   |   |   `-- process.md
|   |   |-- AuthenticIntegerExperiencialistStoryteller
|   |   |   |-- PDCA
|   |   |   |   `-- 2025-08-16-UTC-1310.md
|   |   |   |-- process.md
|   |   |   `-- quick-reference.md
|   |   |-- BranchStatusAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-15-UTC-1004.md
|   |   |   |   |-- 2025-08-15-UTC-1011.md
|   |   |   |   |-- 2025-08-15-UTC-1024.md
|   |   |   |   |-- 2025-08-15-UTC-1128.md
|   |   |   |   |-- 2025-08-16-UTC-1308.md
|   |   |   |   |-- 2025-08-16-UTC-1310.md
|   |   |   |   `-- 2025-08-16-UTC-1311.md
|   |   |   |-- process.md
|   |   |   |-- templates
|   |   |   |   |-- branch-cleanup.template.md
|   |   |   |   |-- branch-status-report.template.md
|   |   |   |   |-- merge-conflict-resolution.template.md
|   |   |   |   `-- recovery-note.branch-hygiene.template.md
|   |   |   `-- tools
|   |   |       |-- branch-analysis.sh
|   |   |       |-- cleanup-stale-branches.sh
|   |   |       |-- find-unmerged-branches.sh
|   |   |       `-- pr-status-check.sh
|   |   |-- CICDAgent
|   |   |   |-- PDCA
|   |   |   |   `-- 2025-08-16-UTC-1257.md
|   |   |   `-- process.md
|   |   |-- Developer
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-15-UTC-0953.md
|   |   |   |   |-- 2025-08-16-UTC-1313.md
|   |   |   |   |-- 2025-08-16-UTC-1315.md
|   |   |   |   `-- 2025-08-16-UTC-1406.md
|   |   |   `-- process.md
|   |   |-- DevOps
|   |   |   `-- PDCA
|   |   |       `-- 2025-08-16-UTC-1312.md
|   |   |-- OntologyAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-14-UTC-1132.md
|   |   |   |   |-- 2025-08-14-UTC-1633.md
|   |   |   |   |-- 2025-08-15-UTC-1131.md
|   |   |   |   |-- 2025-08-15-UTC-1133.md
|   |   |   |   |-- 2025-08-15-UTC-1134.md
|   |   |   |   |-- 2025-08-15-UTC-1135.md
|   |   |   |   |-- 2025-08-15-UTC-1136.md
|   |   |   |   |-- 2025-08-15-UTC-1137.md
|   |   |   |   |-- 2025-08-15-UTC-1138.md
|   |   |   |   |-- 2025-08-15-UTC-1139.md
|   |   |   |   |-- 2025-08-15-UTC-1140.md
|   |   |   |   |-- 2025-08-15-UTC-1141.md
|   |   |   |   |-- 2025-08-16-UTC-1240.md
|   |   |   |   |-- 2025-08-16-UTC-1305.md
|   |   |   |   `-- 2025-08-16-UTC-2110.md
|   |   |   |-- process.md
|   |   |   |-- quick-reference.md
|   |   |   `-- templates
|   |   |       |-- category-definition.template.md
|   |   |       |-- quick-reference.template.md
|   |   |       |-- role-ontology.template.md
|   |   |       |-- terminology-analysis.template.md
|   |   |       `-- term-definition.template.md
|   |   |-- PO
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-15-UTC-0952.md
|   |   |   |   `-- 2025-08-16-UTC-1314.md
|   |   |   |-- process.md
|   |   |   `-- sprint-n-template
|   |   |       |-- planning.md
|   |   |       |-- requirements.md
|   |   |       `-- tasks.md
|   |   |-- RecoveryDefinitionAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-15-UTC-1005.md
|   |   |   |   `-- 2025-08-15-UTC-1046.md
|   |   |   |-- examples
|   |   |   |   |-- automated-environment-recovery.example.md
|   |   |   |   |-- critical-incident-recovery.example.md
|   |   |   |   |-- role-specific-recovery.example.md
|   |   |   |   `-- scrummaster-recovery.example.md
|   |   |   |-- process.md
|   |   |   `-- templates
|   |   |       |-- automation-recovery.template.md
|   |   |       |-- role-specific-recovery.template.md
|   |   |       |-- scenario-based-recovery.template.md
|   |   |       `-- standard-recovery.template.md
|   |   |-- ReleaseIntegrationAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-13-UTC-1617.md
|   |   |   |   |-- 2025-08-13-UTC-1651.md
|   |   |   |   |-- 2025-08-13-UTC-1657.md
|   |   |   |   |-- 2025-08-13-UTC-1706.md
|   |   |   |   |-- 2025-08-13-UTC-1717.md
|   |   |   |   |-- 2025-08-15-UTC-1007.md
|   |   |   |   |-- 2025-08-15-UTC-1009.md
|   |   |   |   |-- 2025-08-15-UTC-1036.md
|   |   |   |   `-- 2025-08-16-UTC-1255.md
|   |   |   |-- process.md
|   |   |   `-- templates
|   |   |       |-- README.template.md
|   |   |       |-- integration-checklist.template.md
|   |   |       `-- release-summary.template.md
|   |   |-- ResearchAgent
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-15-UTC-0949.md
|   |   |   |   `-- 2025-08-15-UTC-0950.md
|   |   |   |-- process.md
|   |   |   |-- quick-reference.md
|   |   |   `-- templates
|   |   |       |-- research-findings.template.md
|   |   |       |-- research-methodology.template.md
|   |   |       |-- research-proposal.template.md
|   |   |       `-- topic-analysis.template.md
|   |   |-- ScrumMaster
|   |   |   |-- PDCA
|   |   |   |   |-- 2025-08-15-UTC-0951.md
|   |   |   |   |-- 2025-08-15-UTC-0955.md
|   |   |   |   |-- 2025-08-15-UTC-0956.md
|   |   |   |   |-- 2025-08-15-UTC-0957.md
|   |   |   |   |-- 2025-08-15-UTC-0958.md
|   |   |   |   |-- 2025-08-15-UTC-0959.md
|   |   |   |   |-- 2025-08-15-UTC-1000.md
|   |   |   |   |-- 2025-08-15-UTC-1001.md
|   |   |   |   |-- 2025-08-15-UTC-1002.md
|   |   |   |   |-- 2025-08-15-UTC-1003.md
|   |   |   |   |-- 2025-08-16-UTC-1202.md
|   |   |   |   |-- 2025-08-16-UTC-1203.md
|   |   |   |   |-- 2025-08-16-UTC-1204.md
|   |   |   |   |-- 2025-08-16-UTC-1242.md
|   |   |   |   |-- 2025-08-16-UTC-1245.md
|   |   |   |   |-- 2025-08-16-UTC-1248.md
|   |   |   |   |-- 2025-08-16-UTC-1250.md
|   |   |   |   |-- 2025-08-16-UTC-1252.md
|   |   |   |   |-- 2025-08-16-UTC-1254.md
|   |   |   |   |-- 2025-08-16-UTC-1256.md
|   |   |   |   |-- 2025-08-16-UTC-1258.md
|   |   |   |   |-- 2025-08-16-UTC-1300.md
|   |   |   |   |-- 2025-08-16-UTC-1302.md
|   |   |   |   |-- 2025-08-16-UTC-1303.md
|   |   |   |   |-- 2025-08-16-UTC-1306.md
|   |   |   |   |-- 2025-08-16-UTC-2136.md
|   |   |   |   |-- 2025-08-16-UTC-2137.md
|   |   |   |   |-- 2025-08-16-UTC-2138.md
|   |   |   |   |-- 2025-08-16-UTC-2139.md
|   |   |   |   `-- 2025-08-16-UTC-2140.md
|   |   |   |-- process.md
|   |   |   `-- recovery-process.md
|   |   `-- Tester
|   |       |-- PDCA
|   |       |   `-- 2025-08-16-UTC-1317.md
|   |       `-- process.md
|   |-- sprint-registry.yml
|   |-- sprints
|   |   |-- initialization.md
|   |   |-- sprint-0
|   |   |   |-- planning.md
|   |   |   |-- requiremnents.md
|   |   |   |-- task-0-create-sprint-0-planning-file.md
|   |   |   |-- task-1-create-scrum-structure.md
|   |   |   |-- task-2-setup-wiki-submodule.md
|   |   |   |-- task-3-create-ontology-page.md
|   |   |   |-- task-4-document-role-responsibilities.md
|   |   |   |-- task-5-template-new-subproject.md
|   |   |   |-- task-5.1-architect-puml-spec.md
|   |   |   |-- task-5.2-developer-implementation.md
|   |   |   |-- task-5.3-developer-testing.md
|   |   |   |-- task-5.4-developer-documentation.md
|   |   |   |-- task-5.5-po-planning-acceptance.md
|   |   |   |-- task-5.6-scrummaster-process-verification.md
|   |   |   |-- task-6-devcontainer-requirements.md
|   |   |   |-- task-7-tree-index-documentation.md
|   |   |   |-- task-7.1-architect-tree-index-spec.md
|   |   |   |-- task-7.2-developer-tree-index-implementation.md
|   |   |   |-- task-7.3-developer-tree-index-tests.md
|   |   |   `-- task-7.4-po-tree-index-process.md
|   |   |-- sprint-1
|   |   |   |-- planning.md
|   |   |   |-- task-1-tssh-wrapper.md
|   |   |   |-- task-1.0-architect-tssh-spec.md
|   |   |   |-- task-1.1-developer-tssh-wrapper.md
|   |   |   |-- task-1.2-developer-tssh-backend.md
|   |   |   |-- task-1.3-developer-bash-completion.md
|   |   |   |-- task-1.4-developer-documentation.md
|   |   |   `-- task-1.5-tester-completion-tests.md
|   |   |-- sprint-10
|   |   |   `-- planning.md
|   |   |-- sprint-11
|   |   |   |-- planning.md
|   |   |   `-- task-11.0-po-sprint-11-planning.md
|   |   |-- sprint-12
|   |   |   |-- planning.md
|   |   |   |-- task-12.0-architect-release-checklist.md
|   |   |   |-- task-12.1-scrummaster-component-tasks.md
|   |   |   |-- task-12.2-po-release-planning.md
|   |   |   |-- task-12.3-developer-component-delivery.md
|   |   |   |-- task-12.4-tester-integration-testing.md
|   |   |   |-- task-12.5-devops-production-deployment.md
|   |   |   |-- task-12.6-scrummaster-release-coordination.md
|   |   |   |-- task-12.7-po-release-closure.md
|   |   |   |-- task-12.8-architect-post-release-analysis.md
|   |   |   |-- task-12.9-tester-post-deployment-testing.md
|   |   |   |-- task-12.10-devops-monitoring-setup.md
|   |   |   `-- task-12.11-scrummaster-retro-planning.md
|   |   |-- sprint-13
|   |   |   |-- planning.md
|   |   |   |-- task-13.0-scrummaster-sprint-13-planning.md
|   |   |   `-- task-13.1-po-strategic-documentation.md
|   |   |-- sprint-14
|   |   |   |-- planning.md
|   |   |   `-- task-14.0-po-sprint-14-planning.md
|   |   |-- sprint-15
|   |   |   |-- planning.md
|   |   |   |-- task-15.0-po-sprint-15-planning.md
|   |   |   |-- task-15.1-scrummaster-agent-coordination.md
|   |   |   `-- task-15.2-developer-agent-tooling.md
|   |   |-- sprint-16
|   |   |   |-- planning.md
|   |   |   `-- task-16.0-po-sprint-16-planning.md
|   |   |-- sprint-17
|   |   |   `-- planning.md
|   |   |-- sprint-18
|   |   |   |-- planning.md
|   |   |   |-- task-18.0-po-sprint-18-planning.md
|   |   |   `-- task-18.1-scrummaster-project-completion.md
|   |   |-- sprint-2
|   |   |   |-- planning.md
|   |   |   |-- task-1.1-architect-ranger-spec.md
|   |   |   |-- task-1.2-developer-ranger-tui.md
|   |   |   |-- task-1.3-developer-completion-integration.md
|   |   |   |-- task-1.4-developer-execution-bridge.md
|   |   |   |-- task-1.5-tester-e2e-tests.md
|   |   |   |-- task-1.6-po-user-guide.md
|   |   |   |-- task-1.7-developer-refactor-tsranger.md
|   |   |   |-- task-1.8-developer-parameter-entry.md
|   |   |   |-- task-1.md
|   |   |   |-- task-2.1-developer-footer-height-and-spacing.md
|   |   |   |-- task-2.2-developer-footer-and-color-preview.md
|   |   |   |-- task-2.3-developer-fix-selected-row-indentation.md
|   |   |   |-- task-2.md
|   |   |   |-- task-3.1-developer-footer-status-line.md
|   |   |   |-- task-3.2-developer-header-status-line.md
|   |   |   |-- task-3.3-developer-status-lines-completion.md
|   |   |   |-- task-3.md
|   |   |   |-- task-4.1-developer-live-completion-buffer.md
|   |   |   |-- task-4.2-developer-completion-match-logic.md
|   |   |   |-- task-4.3-developer-completion-validation.md
|   |   |   |-- task-4.md
|   |   |   |-- task-5.1-developer-enhanced-completion-prompt.md
|   |   |   |-- task-5.2-developer-type-feedback-in-preview.md
|   |   |   |-- task-5.3-developer-completion-visual-improvements.md
|   |   |   |-- task-5.md
|   |   |   |-- task-6.1-developer-colorized-footer-backgrounds.md
|   |   |   |-- task-6.2-developer-column-header-improvements.md
|   |   |   |-- task-6.3-developer-accessibility-and-usability.md
|   |   |   |-- task-6.md
|   |   |   |-- task-7.1-developer-in-process-execution.md
|   |   |   |-- task-7.2-developer-parameter-display-in-footer.md
|   |   |   |-- task-7.md
|   |   |   `-- task-8.md
|   |   |-- sprint-3
|   |   |   |-- planning.md
|   |   |   |-- task-1.0-architect-gitscrumproject-spec.md
|   |   |   |-- task-1.1-developer-repo-scaffold.md
|   |   |   |-- task-1.2-developer-submodule-runtime.md
|   |   |   |-- task-1.3-devops-release-recovery.md
|   |   |   |-- task-1.4-tester-e2e-tests.md
|   |   |   |-- task-1.5-po-user-guide.md
|   |   |   |-- task-1.6-docs-embed-svgs.md
|   |   |   |-- task-1.7-po-plan-tla-sprint-1.md
|   |   |   |-- task-1.8-developer-gh-auth-and-repo-create.md
|   |   |   |-- task-1.9-developer-lfs-migration-and-push.md
|   |   |   |-- task-1.10-developer-https-to-ssh-fallback.md
|   |   |   |-- task-1.11-developer-package-json-generation.md
|   |   |   |-- task-1.12-po-wrapper-project-documentation.md
|   |   |   |-- task-1.13-developer-cli-integration-testing.md
|   |   |   |-- task-1.14-devops-ci-cd-automation.md
|   |   |   |-- task-1.15-tester-dual-repo-validation.md
|   |   |   |-- task-1.16-po-user-onboarding-guide.md
|   |   |   |-- task-1.17-architect-deployment-architecture.md
|   |   |   `-- task-1.18-scrummaster-sprint-coordination.md
|   |   |-- sprint-4
|   |   |   `-- planning.md
|   |   |-- sprint-5
|   |   |   |-- planning.md
|   |   |   |-- task-5.0-architect-component-framework.md
|   |   |   |-- task-5.1-developer-component-cli.md
|   |   |   |-- task-5.2-developer-component-testing.md
|   |   |   |-- task-5.3-developer-component-documentation.md
|   |   |   |-- task-5.4-po-component-requirements.md
|   |   |   |-- task-5.5-tester-component-validation.md
|   |   |   |-- task-5.6-devops-component-deployment.md
|   |   |   |-- task-5.7-architect-component-architecture.md
|   |   |   |-- task-5.8-developer-component-integration.md
|   |   |   |-- task-5.9-po-component-acceptance.md
|   |   |   |-- task-5.10-tester-component-e2e.md
|   |   |   |-- task-5.11-devops-component-ci-cd.md
|   |   |   |-- task-5.12-architect-component-design.md
|   |   |   |-- task-5.13-developer-component-implementation.md
|   |   |   |-- task-5.14-po-component-release.md
|   |   |   |-- task-5.15-tester-component-quality.md
|   |   |   |-- task-5.16-devops-component-monitoring.md
|   |   |   |-- task-5.17-architect-component-optimization.md
|   |   |   |-- task-5.18-developer-component-maintenance.md
|   |   |   |-- task-5.19-po-component-evolution.md
|   |   |   |-- task-5.20-tester-component-regression.md
|   |   |   |-- task-5.21-devops-component-scaling.md
|   |   |   |-- task-5.22-architect-component-future.md
|   |   |   |-- task-5.23-developer-component-innovation.md
|   |   |   |-- task-5.24-po-component-vision.md
|   |   |   |-- task-5.25-tester-component-excellence.md
|   |   |   |-- task-5.26-devops-component-reliability.md
|   |   |   |-- task-5.27-architect-component-sustainability.md
|   |   |   |-- task-5.28-developer-component-efficiency.md
|   |   |   |-- task-5.29-po-component-success.md
|   |   |   `-- task-5.30-tester-component-completion.md
|   |   |-- sprint-6
|   |   |   |-- planning.md
|   |   |   |-- task-6.0-po-sprint-6-planning.md
|   |   |   |-- task-6.1-architect-article-framework.md
|   |   |   |-- task-6.2-developer-article-cli.md
|   |   |   |-- task-6.3-developer-article-testing.md
|   |   |   |-- task-6.4-po-article-requirements.md
|   |   |   |-- task-6.5-tester-article-validation.md
|   |   |   |-- task-6.6-devops-article-deployment.md
|   |   |   |-- task-6.7-architect-article-architecture.md
|   |   |   |-- task-6.8-developer-article-integration.md
|   |   |   |-- task-6.9-po-article-acceptance.md
|   |   |   `-- task-6.10-tester-article-quality.md
|   |   |-- sprint-7
|   |   |   |-- planning.md
|   |   |   |-- task-7.0-po-sprint-7-planning.md
|   |   |   |-- task-7.1-architect-automation-framework.md
|   |   |   |-- task-7.2-developer-automation-cli.md
|   |   |   |-- task-7.3-developer-automation-testing.md
|   |   |   |-- task-7.4-po-automation-requirements.md
|   |   |   |-- task-7.5-tester-automation-validation.md
|   |   |   |-- task-7.6-devops-automation-deployment.md
|   |   |   |-- task-7.7-architect-automation-architecture.md
|   |   |   |-- task-7.8-developer-automation-integration.md
|   |   |   |-- task-7.9-po-automation-acceptance.md
|   |   |   |-- task-7.10-tester-automation-quality.md
|   |   |   |-- task-7.11-devops-automation-ci-cd.md
|   |   |   |-- task-7.12-architect-automation-design.md
|   |   |   |-- task-7.13-developer-automation-implementation.md
|   |   |   |-- task-7.14-po-automation-release.md
|   |   |   |-- task-7.15-tester-automation-e2e.md
|   |   |   |-- task-7.16-devops-automation-monitoring.md
|   |   |   |-- task-7.17-architect-automation-optimization.md
|   |   |   |-- task-7.18-developer-automation-maintenance.md
|   |   |   |-- task-7.19-po-automation-evolution.md
|   |   |   |-- task-7.20-tester-automation-regression.md
|   |   |   |-- task-7.21-devops-automation-scaling.md
|   |   |   |-- task-7.22-architect-automation-future.md
|   |   |   |-- task-7.23-developer-automation-innovation.md
|   |   |   |-- task-7.24-po-automation-vision.md
|   |   |   |-- task-7.25-tester-automation-excellence.md
|   |   |   |-- task-7.26-devops-automation-reliability.md
|   |   |   |-- task-7.27-architect-automation-sustainability.md
|   |   |   |-- task-7.28-developer-automation-efficiency.md
|   |   |   |-- task-7.29-po-automation-success.md
|   |   |   `-- task-7.30-tester-automation-completion.md
|   |   |-- sprint-8
|   |   |   |-- planning.md
|   |   |   |-- task-8.0-po-sprint-8-planning.md
|   |   |   |-- task-8.1-architect-integration-framework.md
|   |   |   |-- task-8.2-developer-integration-cli.md
|   |   |   |-- task-8.3-developer-integration-testing.md
|   |   |   |-- task-8.4-po-integration-requirements.md
|   |   |   `-- task-8.5-tester-integration-validation.md
|   |   |-- sprint-9
|   |   |   |-- planning.md
|   |   |   |-- task-9.0-po-sprint-9-planning.md
|   |   |   |-- task-9.1-architect-release-framework.md
|   |   |   |-- task-9.2-developer-release-cli.md
|   |   |   `-- task-9.3-developer-release-testing.md
|   |   `-- sprints.overview.md
|   `-- templates
|       |-- branch-overview.template.md
|       |-- pdca.enhanced.template.md
|       |-- pdca.role-transition.template.md
|       |-- pdca.standard.template.md
|       |-- project-journal-session.template.md
|       `-- project.state.template.md
|-- sprint-task-conflicts.txt
|-- src
|   |-- sh
|   |   |-- obash
|   |   |-- oosh
|   |   `-- tssh
|   `-- ts
|       |-- layer2
|       |   |-- RangerModel.ts
|       |   `-- TestLogger.ts
|       |-- layer4
|       |   |-- CompletionEngine.ts
|       |   |-- TSCompletion.ts
|       |   `-- TSRanger.ts
|       `-- layer5
|           `-- RangerView.ts
|-- temp
|   |-- project-index-backup.md
|   `-- temp-file-list.txt
|-- tools
|   |-- link-checker.sh
|   `-- markdown-indexer.sh
|-- tree.index.md
|-- tsconfig.json
|-- vitest.config.ts
|-- wiki
|   |-- Home.md
|   |-- Ontology.md
|   `-- README.md
`-- workspacesMountPoint -> ../..
```

*Generated automatically. Not following symbolic links.*

## PDCA Structure
- **Role-based PDCAs:** [pdca/role/](./pdca/role/)

[Back to Project State](./project.state.md)