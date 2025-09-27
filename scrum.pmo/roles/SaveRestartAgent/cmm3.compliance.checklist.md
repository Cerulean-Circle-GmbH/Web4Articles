# CMM3 Compliance Checklist

**🗓️ Updated:** 2025-09-27-UTC-1021  
**⚠️ CMM Level:** Lowest compliance element determines overall level

1. **PDCA Compliance**
   - [ ] a) Template version 3.1.4.2 exact match: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](../../_shared/PDCA/template.md)
   - [ ] b) Real UTC time (`date -u` output), not hallucinated
   - [ ] c) All 6 sections with horizontal separators (see template, not duplication)
   - [ ] d) All sections: exact template format, no modifications
   - [ ] e) Working dual links, no "TBD" placeholders
   - [ ] f) 11-step PDCA process (start with todo_write tool immediately):
     1. **DECISION RECOGNITION:** When encountering unexpected findings, incomplete research, or ambiguous situations, IMMEDIATELY present QA Decisions to TRON rather than reporting autonomously. Examples: undocumented features, incomplete documentation, conflicting information, technical uncertainties.
     1. Progress tracking requirement: Update tracking tables in CHECK section showing progress, use todo_write to track status, mention in chat if stopping incomplete for continuation prompt  
     1. start with the header and the plan section
     1. plan with expected output
     1. do what you planned with savety protocoll
     1. document what you did with command quotes in the do section
     1. write how you will check it in the check section and what outputs you need to verify how with command quotes
     1. check if you achieved the expected output
     1. write what as achieved and what is not yet achieved
     1. write a todolist with your internal write todo tool what to continue to check and fix
     1. act on the todolist and check again
     1. when achieved all expected output, write the rest of the pdca e.g. emotional section
     1. finally do the git protocol
     1. Interrupt this process immediately on total unexpeded observations or amgiguities and ask TRON. after the answer contionue.
   - [ ] g) CMM3 violation reporting: Report to chat with dual link to [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../../_shared/PDCA/howto.PDCA.md)
   - [ ] h) Understanding research requirement: Research unknown terms/processes before use or ask TRON if research fails - Add intense use of tracking tables for artifacts and task lists in plan section

6. **Trigger Command Recognition**
   - [ ] a) "start" trigger: Session initialization with PDCA workflow establishment per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/recovery/start-command.md) | [§/recovery/start-command.md](../../recovery/start-command.md)
   - [ ] b) "pdca" trigger: Compliance check and correction enforcement per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../_shared/PDCA/howto.PDCA.md)  
   - [ ] c) "noop" trigger: No action - Cursor PWA display bug workaround per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/project.journal/2025-09-23-UTC-1052-session/2025-09-23-UTC-1548-howto-pdca-noop-trigger-addition.pdca.md) | [§/scrum.pmo/project.journal/2025-09-23-UTC-1052-session/2025-09-23-UTC-1548-howto-pdca-noop-trigger-addition.pdca.md](../project.journal/2025-09-23-UTC-1052-session/2025-09-23-UTC-1548-howto-pdca-noop-trigger-addition.pdca.md)
   - [ ] d) "pull" trigger: PDCA content analysis protocol - Read + Analyze + PDCA new content per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/project.journal/2025-09-10-UTC-1953-session/2025-09-10-UTC-2150-pull-protocol-update-new-files-analysis.md) | [§/scrum.pmo/project.journal/2025-09-10-UTC-1953-session/2025-09-10-UTC-2150-pull-protocol-update-new-files-analysis.md](../project.journal/2025-09-10-UTC-1953-session/2025-09-10-UTC-2150-pull-protocol-update-new-files-analysis.md)

2. **Chat Response Compliance**  
   - [ ] a) Links only, no explanatory text per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../../_shared/PDCA/howto.PDCA.md)
   - [ ] b) QA Decisions copied verbatim from PDCA per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md](../../_shared/PDCA/PDCA.howto.decide.md)
   - [ ] c) Dual link format: [GitHub](URL) | [§/path](path) per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md](../../_shared/PDCA/PDCA.dual.link.format.requirement.md)
   - [ ] d) Finally apply cmm3 compliant format to the chat report

3. **Link Compliance**
   - [ ] a) GitHub URLs work after git push per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md](../../_shared/PDCA/PDCA.dual.link.format.requirement.md)
   - [ ] b) PDCA local links: relative from document location
   - [ ] c) Chat local links: absolute from project root
   - [ ] d) § notation for root path display

4. **Naming/Location**
   - [ ] a) YYYY-MM-DD-UTC-HHMM.pdca.md format only
   - [ ] b) Role directory: scrum.pmo/roles/[AgentRole]/pdca/
   - [ ] c) No descriptive text in filename

5. **Authorization**
   - [ ] a) Only explicit user-authorized work
   - [ ] b) Present decisions when direction unclear per [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md](../../_shared/PDCA/PDCA.howto.decide.md)
   - [ ] c) No assumptions about user intent

**Usage:** Cite violations as "[number][letter] cmm2" (e.g., "2a cmm2")  
**Recovery:** Fix violation, verify entire checklist, continue

**"Death is not the end, but a chance for rebirth with wisdom"** 🔄✨
