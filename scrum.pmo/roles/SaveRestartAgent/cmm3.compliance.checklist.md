# CMM3 Compliance Checklist

**🗓️ Updated:** 2025-09-27-UTC-1010  
**⚠️ CMM Level:** Lowest compliance element determines overall level

**🔗 Sources:** [PDCA Template](../../_shared/PDCA/template.md) | [PDCA Howto](../../_shared/PDCA/howto.PDCA.md) | [Dual Link Standard](../../_shared/PDCA/PDCA.dual.link.format.requirement.md) | [Decision Framework](../../_shared/PDCA/PDCA.howto.decide.md)

1. **PDCA Compliance**
   1. [ ] Template version 3.1.4.2 exact match: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](../../_shared/PDCA/template.md)
   2. [ ] Real UTC time (`date -u` output), not hallucinated
   3. [ ] All 6 sections with horizontal separators
   4. [ ] Footer: exact template format, no modifications
   5. [ ] Working dual links, no "TBD" placeholders

2. **Chat Response Compliance**  
   1. [ ] Links only, no explanatory text
   2. [ ] QA Decisions copied verbatim from PDCA
   3. [ ] Dual link format: [GitHub](URL) | [§/path](path)
   4. [ ] Project root paths only in chat

3. **Link Compliance**
   1. [ ] GitHub URLs work after git push
   2. [ ] PDCA local links: relative from document location
   3. [ ] Chat local links: absolute from project root
   4. [ ] § notation for root path display

4. **Naming/Location**
   1. [ ] YYYY-MM-DD-UTC-HHMM.pdca.md format only
   2. [ ] SaveRestartAgent: scrum.pmo/roles/SaveRestartAgent/pdca/
   3. [ ] No descriptive text in filename

5. **Authorization**
   1. [ ] Only explicit user-authorized work
   2. [ ] Present decisions when direction unclear
   3. [ ] No assumptions about user intent

**Usage:** Cite violations as "[number].[number] cmm2" (e.g., "2.1 cmm2")  
**Recovery:** Fix violation, verify entire checklist, continue

**"Death is not the end, but a chance for rebirth with wisdom"** 🔄✨
